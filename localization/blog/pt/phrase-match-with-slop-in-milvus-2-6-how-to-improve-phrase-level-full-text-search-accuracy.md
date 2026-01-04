---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Correspondência de frases com Slop no Milvus 2.6: Como melhorar a precisão da
  pesquisa de texto completo ao nível da frase
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Saiba como o Phrase Match no Milvus 2.6 suporta a pesquisa de texto completo
  ao nível da frase com slop, permitindo uma filtragem de palavras-chave mais
  tolerante para a produção no mundo real.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>À medida que os dados não estruturados continuam a explodir e os modelos de IA se tornam cada vez mais inteligentes, a pesquisa vetorial tornou-se a camada de recuperação predefinida para muitos sistemas de IA - pipelines ARG, pesquisa de IA, agentes, motores de recomendação e muito mais. Funciona porque capta o significado: não apenas as palavras que os utilizadores escrevem, mas a intenção por detrás delas.</p>
<p>No entanto, quando estas aplicações entram em produção, as equipas descobrem frequentemente que a compreensão semântica é apenas um dos lados do problema da recuperação. Muitas cargas de trabalho também dependem de regras textuais rigorosas - como a correspondência com a terminologia exata, a preservação da ordem das palavras ou a identificação de frases com significado técnico, legal ou operacional.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">O Milvus 2.6</a> elimina essa divisão ao introduzir a pesquisa de texto completo nativa diretamente no banco de dados vetorial. Com índices simbólicos e posicionais incorporados ao mecanismo principal, o Milvus pode interpretar a intenção semântica de uma consulta enquanto impõe restrições precisas de palavras-chave e frases. O resultado é um pipeline de recuperação unificado no qual o significado e a estrutura se reforçam mutuamente, em vez de viverem em sistemas separados.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">O Phrase Match</a> é uma parte fundamental desta capacidade de texto integral. Identifica sequências de termos que aparecem juntos e por ordem - crucial para detetar padrões de registo, assinaturas de erros, nomes de produtos e qualquer texto em que a ordem das palavras defina o significado. Neste post, explicaremos como <a href="https://milvus.io/docs/phrase-match.md">o Phrase Match</a> funciona no <a href="https://milvus.io/">Milvus</a>, como o <code translate="no">slop</code> adiciona a flexibilidade necessária para o texto do mundo real e por que esses recursos tornam a pesquisa híbrida de vetor e texto completo não apenas possível, mas prática em um único banco de dados.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">O que é o Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>A Correspondência de Frases é um tipo de consulta de texto integral no Milvus que se concentra na <em>estrutura - especificamente</em>, se uma sequência de palavras aparece na mesma ordem dentro de um documento. Quando não é permitida qualquer flexibilidade, a consulta comporta-se de forma estrita: os termos têm de aparecer uns ao lado dos outros e em sequência. Assim, uma consulta como <strong>"aprendizagem automática de robótica"</strong> só corresponde quando essas três palavras aparecem como uma frase contínua.</p>
<p>O desafio é que o texto real raramente se comporta desta forma. A linguagem natural introduz ruído: adjectivos extra são introduzidos, os registos reordenam campos, os nomes de produtos ganham modificadores e os autores humanos não escrevem com os motores de pesquisa em mente. Uma correspondência rigorosa de frases quebra-se facilmente - uma palavra inserida, uma reformulação ou um termo trocado pode causar uma falha. E em muitos sistemas de IA, especialmente os voltados para a produção, não é aceitável perder uma linha de registo relevante ou uma frase que desencadeie uma regra.</p>
<p>O Milvus 2.6 resolve este atrito com um mecanismo simples: <strong>slop</strong>. A folga define <em>a quantidade de espaço permitido entre os</em> termos <em>da consulta</em>. Em vez de tratar uma frase como frágil e inflexível, o slop permite-lhe decidir se uma palavra extra é tolerável, ou duas, ou mesmo se uma ligeira reordenação deve contar como uma correspondência. Isto faz com que a pesquisa de frases deixe de ser um teste binário de aprovação/reprovação e passe a ser uma ferramenta de recuperação controlada e ajustável.</p>
<p>Para perceber porque é que isto é importante, imagine que procura nos registos todas as variantes do erro de rede familiar <strong>"ligação reposta por um par".</strong> Na prática, os seus registos podem ter o seguinte aspeto:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>À primeira vista, todos eles representam o mesmo evento subjacente. Mas os métodos de recuperação comuns têm dificuldades:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">O BM25 tem dificuldades com a estrutura.</h3><p>Ele vê a consulta como um saco de palavras-chave, ignorando a ordem em que elas aparecem. Desde que "connection" e "peer" apareçam algures, o BM25 pode classificar o documento com uma classificação elevada - mesmo que a frase seja invertida ou não esteja relacionada com o conceito que está realmente a procurar.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">A pesquisa vetorial tem dificuldade em lidar com restrições.</h3><p>As incorporações são excelentes na captura de significado e relações semânticas, mas não podem impor uma regra como "estas palavras devem aparecer nesta sequência". Poderá obter mensagens semanticamente relacionadas, mas ainda assim não conseguirá obter o padrão estrutural exato necessário para depuração ou conformidade.</p>
<p>O Phrase Match preenche a lacuna entre estas duas abordagens. Ao utilizar o <strong>slop</strong>, pode especificar exatamente quanta variação é aceitável:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Correspondência exacta (Todos os termos devem aparecer de forma contígua e por ordem).</p></li>
<li><p><code translate="no">slop = 1</code> - Permitir uma palavra extra (Abrange variações comuns da linguagem natural com um único termo inserido).</p></li>
<li><p><code translate="no">slop = 2</code> - Permitir várias palavras inseridas (Trata de frases mais descritivas ou verbosas).</p></li>
<li><p><code translate="no">slop = 3</code> - Permitir reordenação (suporta frases invertidas ou pouco ordenadas, muitas vezes o caso mais difícil em textos do mundo real).</p></li>
</ul>
<p>Em vez de esperar que o algoritmo de pontuação "acerte", declara explicitamente a tolerância estrutural que a sua aplicação exige.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Como funciona a correspondência de frases no Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Com base na biblioteca do motor de busca <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, o Phrase Match em Milvus é implementado em cima de um índice invertido com informação posicional. Em vez de verificar apenas se os termos aparecem num documento, verifica se aparecem na ordem correta e a uma distância controlável.</p>
<p>O diagrama abaixo ilustra o processo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokenização de documentos (com posições)</strong></p>
<p>Quando os documentos são inseridos no Milvus, os campos de texto são processados por um <a href="https://milvus.io/docs/analyzer-overview.md">analisador</a>, que divide o texto em tokens (palavras ou termos) e regista a posição de cada token no documento. Por exemplo, <code translate="no">doc_1</code> é tokenizado como: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Criação do Índice Invertido</strong></p>
<p>De seguida, o Milvus constrói um índice invertido. Em vez de mapear os documentos para os seus conteúdos, o índice invertido mapeia cada token para os documentos em que aparece, juntamente com todas as posições registadas desse token dentro de cada documento.</p>
<p><strong>3. Correspondência de frases</strong></p>
<p>Quando uma consulta de frase é executada, o Milvus usa primeiro o índice invertido para identificar documentos que contêm todos os tokens da consulta. Em seguida, valida cada candidato comparando as posições dos tokens para garantir que os termos aparecem na ordem correta e dentro da distância permitida <code translate="no">slop</code>. Apenas os documentos que satisfazem ambas as condições são devolvidos como correspondências.</p>
<p>O diagrama abaixo resume como a Correspondência de Frases funciona de ponta a ponta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Como ativar a Correspondência de Frases no Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Phrase Match funciona em campos do tipo <strong><code translate="no">VARCHAR</code></strong>o tipo de string no Milvus. Para o utilizar, é necessário configurar o esquema da coleção de modo a que o Milvus efectue a análise de texto e armazene a informação posicional do campo. Para tal, é necessário ativar dois parâmetros: <code translate="no">enable_analyzer</code> e <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Definir enable_analyzer e enable_match</h3><p>Para ativar a Phrase Match para um campo VARCHAR específico, defina ambos os parâmetros para <code translate="no">True</code> ao definir o esquema do campo. Juntos, eles dizem ao Milvus para:</p>
<ul>
<li><p><strong>tokenizar</strong> o texto (via <code translate="no">enable_analyzer</code>), e</p></li>
<li><p><strong>construir um índice invertido com deslocamentos posicionais</strong> (via <code translate="no">enable_match</code>).</p></li>
</ul>
<p>O Phrase Match baseia-se em ambos os passos: o analisador divide o texto em tokens, e o índice de correspondência armazena onde esses tokens aparecem, permitindo consultas eficientes baseadas em frases e slop.</p>
<p>Abaixo está um exemplo de configuração de esquema que ativa a Correspondência de Frases num campo <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Pesquisar com Phrase Match: Como o slop afeta o conjunto de candidatos<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de ativar a correspondência para um campo VARCHAR no seu esquema de coleção, pode efetuar correspondências de frases utilizando a expressão <code translate="no">PHRASE_MATCH</code>.</p>
<p>Observação: a expressão <code translate="no">PHRASE_MATCH</code> não diferencia maiúsculas de minúsculas. Pode utilizar <code translate="no">PHRASE_MATCH</code> ou <code translate="no">phrase_match</code>.</p>
<p>Nas operações de pesquisa, a Correspondência de Frases é normalmente aplicada antes da classificação de semelhança de vectores. Em primeiro lugar, filtra os documentos com base em restrições textuais explícitas, reduzindo o conjunto de candidatos. Os restantes documentos são depois reordenados com recurso a vectores de incorporação.</p>
<p>O exemplo abaixo mostra como diferentes valores de <code translate="no">slop</code> afectam este processo. Ao ajustar o parâmetro <code translate="no">slop</code>, controla diretamente os documentos que passam o filtro de frases e prosseguem para a fase de classificação vetorial.</p>
<p>Suponha que tem uma coleção chamada <code translate="no">tech_articles</code> que contém as cinco entidades seguintes:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>A aprendizagem automática aumenta a eficiência da análise de dados em grande escala</td></tr>
<tr><td>2</td><td>A aprendizagem de uma abordagem baseada na máquina é vital para o progresso da IA moderna</td></tr>
<tr><td>3</td><td>As arquitecturas de máquinas de aprendizagem profunda optimizam as cargas computacionais</td></tr>
<tr><td>4</td><td>A máquina melhora rapidamente o desempenho do modelo para a aprendizagem contínua</td></tr>
<tr><td>5</td><td>A aprendizagem de algoritmos avançados de máquinas expande as capacidades da IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Aqui, permitimos uma inclinação de 1. O filtro é aplicado a documentos que contêm a frase "máquina de aprendizagem" com uma ligeira flexibilidade.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados da correspondência:</p>
<table>
<thead>
<tr><th>doc_id</th><th>texto</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Aprender uma abordagem baseada em máquinas é vital para o progresso da IA moderna</td></tr>
<tr><td>3</td><td>As arquitecturas de máquinas de aprendizagem profunda optimizam as cargas computacionais</td></tr>
<tr><td>5</td><td>A aprendizagem de algoritmos de máquina avançados expande as capacidades da IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>Este exemplo permite uma inclinação de 2, o que significa que são permitidos até dois tokens extra (ou termos invertidos) entre as palavras "machine" e "learning".</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados da correspondência:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">A aprendizagem automática aumenta a eficiência da análise de dados em grande escala</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">As arquitecturas de máquinas de aprendizagem profunda optimizam as cargas computacionais</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>Neste exemplo, uma inclinação de 3 proporciona ainda mais flexibilidade. O filtro procura "machine learning" com um máximo de três posições de token permitidas entre as palavras.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados da correspondência:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">A aprendizagem automática aumenta a eficiência da análise de dados em grande escala</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">A aprendizagem de uma abordagem baseada na máquina é vital para o progresso da IA moderna</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">As arquitecturas de máquinas de aprendizagem profunda optimizam as cargas computacionais</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">A aprendizagem de algoritmos de máquina avançados expande as capacidades da IA</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Dicas rápidas: O que precisa de saber antes de ativar a correspondência de frases no Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>A Correspondência de Frases fornece suporte para a filtragem ao nível da frase, mas a sua ativação envolve mais do que a configuração em tempo de consulta. É útil estar ciente das considerações associadas antes de aplicá-lo em um ambiente de produção.</p>
<ul>
<li><p>A ativação do Phrase Match num campo cria um índice invertido, o que aumenta a utilização do armazenamento. O custo exato depende de factores como o comprimento do texto, o número de tokens únicos e a configuração do analisador. Ao trabalhar com campos de texto grandes ou dados de alta cardinalidade, essa sobrecarga deve ser considerada antecipadamente.</p></li>
<li><p>A configuração do analisador é outra escolha crítica de design. Quando um analisador é definido no esquema de coleção, não pode ser alterado. A mudança para um analisador diferente mais tarde requer a eliminação da coleção existente e a sua recriação com um novo esquema. Por este motivo, a seleção do analisador deve ser tratada como uma decisão a longo prazo e não como uma experiência.</p></li>
<li><p>O comportamento do Phrase Match está intimamente ligado à forma como o texto é tokenizado. Antes de aplicar um analisador a uma coleção inteira, recomenda-se a utilização do método <code translate="no">run_analyzer</code> para inspecionar o resultado da tokenização e confirmar que corresponde às suas expectativas. Esta etapa pode ajudar a evitar incompatibilidades subtis e resultados de consulta inesperados mais tarde. Para obter mais informações, consulte <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Visão geral do analisador</a>.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>A Correspondência de Frases é um tipo de pesquisa de texto integral central que permite restrições posicionais e ao nível da frase para além da simples correspondência de palavras-chave. Ao operar na ordem e proximidade dos tokens, fornece uma forma previsível e precisa de filtrar documentos com base na forma como os termos aparecem efetivamente no texto.</p>
<p>Nos sistemas de recuperação modernos, o Phrase Match é normalmente aplicado antes da classificação baseada em vectores. Em primeiro lugar, restringe o conjunto de candidatos aos documentos que satisfazem explicitamente as frases ou estruturas requeridas. A pesquisa vetorial é então utilizada para classificar estes resultados por relevância semântica. Este padrão é especialmente eficaz em cenários como a análise de registos, a pesquisa de documentação técnica e os pipelines RAG, onde as restrições textuais têm de ser aplicadas antes de se considerar a semelhança semântica.</p>
<p>Com a introdução do parâmetro <code translate="no">slop</code> no Milvus 2.6, o Phrase Match torna-se mais tolerante à variação da linguagem natural, mantendo o seu papel como um mecanismo de filtragem de texto completo. Isto torna as restrições ao nível da frase mais fáceis de aplicar em fluxos de trabalho de recuperação de produção.</p>
<p>Experimente com os scripts <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">de demonstração</a> e explore <a href="https://milvus.io/docs/release_notes.md#v267">o Milvus 2.6</a> para ver como a recuperação com reconhecimento de frase se encaixa na sua pilha.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registre problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
