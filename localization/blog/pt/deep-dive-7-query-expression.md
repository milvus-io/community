---
id: deep-dive-7-query-expression.md
title: Como é que a base de dados compreende e executa a sua consulta?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Uma consulta vetorial é o processo de recuperação de vectores através de
  filtragem escalar.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi transcriado por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Uma <a href="https://milvus.io/docs/v2.0.x/query.md">consulta vetorial</a> em Milvus é o processo de obtenção de vectores através de uma filtragem escalar baseada numa expressão booleana. Com a filtragem escalar, os utilizadores podem limitar os resultados das suas consultas com determinadas condições aplicadas aos atributos dos dados. Por exemplo, se um utilizador procurar filmes lançados entre 1990 e 2010 e com pontuações superiores a 8,5, apenas os filmes cujos atributos (ano de lançamento e pontuação) satisfazem a condição.</p>
<p>Esta publicação tem como objetivo examinar a forma como uma consulta é concluída no Milvus, desde a introdução de uma expressão de consulta até à geração do plano de consulta e à execução da consulta.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#Query-expression">Expressão de consulta</a></li>
<li><a href="#Plan-AST-generation">Geração do plano AST</a></li>
<li><a href="#Query-execution">Execução da consulta</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Expressão da consulta<button data-href="#Query-expression" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>A expressão da consulta com filtragem de atributos em Milvus adopta a sintaxe EBNF (Extended Backus-Naur form). A imagem seguinte apresenta as regras de expressão em Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Sintaxe da expressão</span> </span></p>
<p>As expressões lógicas podem ser criadas utilizando a combinação de operadores lógicos binários, operadores lógicos unários, expressões lógicas e expressões simples. Uma vez que a sintaxe EBNF é recursiva, uma expressão lógica pode ser o resultado da combinação ou parte de uma expressão lógica maior. Uma expressão lógica pode conter muitas sub-expressões lógicas. A mesma regra aplica-se em Milvus. Se um utilizador precisar de filtrar os atributos dos resultados com muitas condições, pode criar o seu próprio conjunto de condições de filtragem combinando diferentes operadores e expressões lógicas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Expressão booleana</span> </span></p>
<p>A imagem acima mostra parte das <a href="https://milvus.io/docs/v2.0.x/boolean.md">regras de expressão booleana</a> no Milvus. Os operadores lógicos unários podem ser adicionados a uma expressão. Atualmente, o Milvus apenas suporta o operador lógico unário &quot;not&quot;, que indica que o sistema tem de retirar os vectores cujos valores do campo escalar não satisfazem os resultados do cálculo. Os operadores lógicos binários incluem &quot;e&quot; e &quot;ou&quot;. As expressões simples incluem expressões de termo e expressões de comparação.</p>
<p>O cálculo aritmético básico como a adição, a subtração, a multiplicação e a divisão também é suportado durante uma consulta no Milvus. A imagem seguinte demonstra a precedência das operações. Os operadores são listados de cima para baixo em precedência decrescente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Precedência</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Como é que uma expressão de consulta sobre determinados filmes é processada no Milvus?</h3><p>Suponhamos que há uma grande quantidade de dados de filmes armazenados no Milvus e que o utilizador pretende consultar determinados filmes. Por exemplo, os dados de cada filme armazenados no Milvus têm os seguintes cinco campos: ID do filme, ano de lançamento, tipo de filme, pontuação e cartaz. Neste exemplo, o tipo de dados do ID do filme e do ano de lançamento é int64, enquanto as pontuações dos filmes são dados de ponto flutuante. Além disso, os cartazes dos filmes são armazenados no formato de vectores de ponto flutuante e o tipo de filme no formato de dados de cadeia. Nomeadamente, o suporte para o tipo de dados string é uma nova caraterística do Milvus 2.1.</p>
<p>Por exemplo, se um utilizador quiser consultar os filmes com pontuações superiores a 8,5. Os filmes também devem ter sido lançados entre uma década antes de 2000 e uma década depois de 2000 ou os seus tipos devem ser filmes de comédia ou de ação, o utilizador tem de introduzir a seguinte expressão de predicado: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Ao receber a expressão de consulta, o sistema executá-la-á na seguinte precedência:</p>
<ol>
<li>Consulta de filmes com pontuação superior a 8,5. Os resultados da consulta são designados por &quot;resultado1&quot;.</li>
<li>Calcular 2000 - 10 para obter o "resultado2" (1990).</li>
<li>Calcular 2000 + 10 para obter o "resultado3" (2010).</li>
<li>Procurar filmes com o valor de <code translate="no">release_year</code> superior a &quot;resultado2&quot; e inferior a &quot;resultado3&quot;. Ou seja, o sistema precisa de consultar os filmes lançados entre 1990 e 2010. Os resultados da consulta são designados por &quot;resultado4&quot;.</li>
<li>Consultar filmes que sejam comédias ou filmes de ação. Os resultados da consulta são designados por &quot;resultado5&quot;.</li>
<li>Combine "resultado4" e "resultado5" para obter filmes que tenham sido lançados entre 1990 e 2010 ou que pertençam à categoria de comédia ou filme de ação. Os resultados são designados por &quot;resultado6&quot;.</li>
<li>Pegue na parte comum de "resultado1" e "resultado6" para obter os resultados finais que satisfazem todas as condições.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Exemplo de filme</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Geração do plano AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>O Milvus utiliza a ferramenta de código aberto <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) para a geração do plano AST (abstract syntax tree). O ANTLR é um poderoso gerador de parser para ler, processar, executar ou traduzir ficheiros estruturados de texto ou binários. Mais especificamente, o ANTLR pode gerar um analisador para construir e percorrer árvores de análise com base em sintaxe ou regras predefinidas. A imagem seguinte é um exemplo em que a expressão de entrada é &quot;SP=100;&quot;. LEXER, a funcionalidade de reconhecimento de linguagem incorporada no ANTLR, gera quatro tokens para a expressão de entrada - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; e &quot;;&quot;. Em seguida, a ferramenta analisará os quatro tokens para gerar a árvore de análise correspondente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>árvore de análise</span> </span></p>
<p>O mecanismo de análise é uma parte crucial da ferramenta ANTLR. Foi concebido para percorrer todas as árvores de análise para examinar se cada nó obedece às regras de sintaxe ou para detetar determinadas palavras sensíveis. Algumas das APIs relevantes estão listadas na imagem abaixo. Como o ANTLR começa no nó raiz e vai descendo por cada sub-nó até o final, não há necessidade de diferenciar a ordem de como percorrer a árvore de análise.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>caminhador da árvore de análise</span> </span></p>
<p>O Milvus gera o PlanAST para consulta de forma semelhante ao ANTLR. No entanto, o uso do ANTLR requer a redefinição de regras de sintaxe bastante complicadas. Portanto, o Milvus adopta uma das regras mais prevalecentes - regras de expressão booleana, e depende do pacote <a href="https://github.com/antonmedv/expr">Expr</a> open sourced no GitHub para consultar e analisar a sintaxe das expressões de consulta.</p>
<p>Durante uma consulta com filtragem de atributos, o Milvus irá gerar uma árvore de planos primitiva não resolvida usando o ant-parser, o método de análise fornecido pelo Expr, ao receber a expressão de consulta. A árvore de planos primitiva que obteremos é uma árvore binária simples. Em seguida, a árvore de planos é ajustada pelo Expr e pelo optimizador incorporado no Milvus. O optimizador em Milvus é bastante semelhante ao mecanismo de caminhada acima mencionado. Uma vez que a funcionalidade de otimização da árvore de planos fornecida pelo Expr é bastante sofisticada, a carga do optimizador incorporado no Milvus é aliviada em grande medida. Em última análise, o analisador analisa a árvore de planos optimizada de forma recursiva para gerar um plano AST na estrutura de <a href="https://developers.google.com/protocol-buffers">buffers de protocolo</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Fluxo de trabalho do plano AST</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Execução da consulta<button data-href="#Query-execution" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>A execução da consulta é, na sua origem, a execução do plano AST gerado nas etapas anteriores.</p>
<p>No Milvus, um plano AST é definido numa estrutura proto. A imagem abaixo é uma mensagem com a estrutura protobuf. Existem seis tipos de expressões, entre as quais a expressão binária e a expressão unária, que podem ainda ter expressão lógica binária e expressão lógica unária.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>A imagem abaixo é uma imagem UML da expressão de consulta. Demonstra a classe básica e a classe derivada de cada expressão. Cada classe tem um método para aceitar parâmetros de visitante. Este é um padrão típico de conceção de visitantes. O Milvus utiliza este padrão para executar o plano AST, uma vez que a sua maior vantagem é o facto de os utilizadores não terem de fazer nada às expressões primitivas, podendo aceder diretamente a um dos métodos dos padrões para modificar determinada classe de expressão de consulta e elementos relevantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Ao executar um plano AST, o Milvus recebe primeiro um nó de plano do tipo proto. Em seguida, obtém um nó de plano do tipo segcore através do analisador interno C++ proto. Após a obtenção dos dois tipos de nós de plano, o Milvus aceita uma série de acessos de classe e, em seguida, modifica e executa a estrutura interna dos nós de plano. Por fim, o Milvus procura em todos os nós do plano de execução para obter os resultados filtrados. Os resultados finais são apresentados no formato de uma máscara de bits. Uma máscara de bits é um conjunto de números de bits ("0" e "1"). Os dados que satisfazem as condições de filtragem são marcados com "1" na máscara de bits, enquanto os que não satisfazem os requisitos são marcados com "0" na máscara de bits.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>executar fluxo de trabalho</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Sobre a série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visão geral da arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs e SDKs Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestão de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta em tempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de execução escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de execução vetorial</a></li>
</ul>
