---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Apresentando o Milvus Ngram Index: Correspondência mais rápida de
  palavras-chave e consultas LIKE para cargas de trabalho de agentes
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Saiba como o índice Ngram no Milvus acelera as consultas LIKE transformando a
  correspondência de substring em pesquisas eficientes de n-gramas,
  proporcionando um desempenho 100 vezes mais rápido.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>Nos sistemas de agentes, <strong>a recuperação de contexto</strong> é um elemento fundamental em todo o pipeline, fornecendo a base para o raciocínio, o planeamento e a ação a jusante. A pesquisa vetorial ajuda os agentes a recuperar contexto semanticamente relevante que capta a intenção e o significado em conjuntos de dados grandes e não estruturados. No entanto, a relevância semântica, por si só, muitas vezes não é suficiente. Os pipelines de agentes também dependem da pesquisa de texto completo para impor restrições de palavras-chave exactas - tais como nomes de produtos, chamadas de funções, códigos de erro ou termos legalmente significativos. Esta camada de suporte garante que o contexto recuperado não só é relevante, mas também satisfaz explicitamente os requisitos textuais rígidos.</p>
<p>As cargas de trabalho reais reflectem consistentemente esta necessidade:</p>
<ul>
<li><p>Os assistentes de apoio ao cliente têm de encontrar conversas que mencionem um produto ou ingrediente específico.</p></li>
<li><p>Os copilotos de codificação procuram trechos que contenham um nome de função exato, uma chamada de API ou uma cadeia de erros.</p></li>
<li><p>Os agentes jurídicos, médicos e académicos filtram os documentos em busca de cláusulas ou citações que devem aparecer textualmente.</p></li>
</ul>
<p>Tradicionalmente, os sistemas têm tratado esta questão com o operador SQL <code translate="no">LIKE</code>. Uma consulta como <code translate="no">name LIKE '%rod%'</code> é simples e amplamente suportada, mas sob alta concorrência e grandes volumes de dados, esta simplicidade acarreta grandes custos de desempenho.</p>
<ul>
<li><p><strong>Sem um índice</strong>, uma consulta <code translate="no">LIKE</code> percorre todo o armazenamento de contexto e aplica a correspondência de padrões linha a linha. Com milhões de registos, mesmo uma única consulta pode demorar segundos - demasiado lenta para interações de agentes em tempo real.</p></li>
<li><p><strong>Mesmo com um índice invertido convencional</strong>, padrões curinga como <code translate="no">%rod%</code> continuam difíceis de otimizar porque o mecanismo ainda deve percorrer todo o dicionário e executar a correspondência de padrões em cada entrada. A operação evita a varredura de linhas, mas permanece fundamentalmente linear, resultando em melhorias apenas marginais.</p></li>
</ul>
<p>Isto cria uma lacuna clara nos sistemas de recuperação híbridos: a pesquisa vetorial lida com a relevância semântica de forma eficiente, mas a filtragem de palavras-chave exactas torna-se frequentemente o passo mais lento no processo.</p>
<p>O Milvus suporta nativamente a pesquisa vetorial e de texto integral híbrida com filtragem de metadados. Para resolver as limitações da correspondência de palavras-chave, o Milvus introduz o <a href="https://milvus.io/docs/ngram.md"><strong>Índice Ngram</strong></a>, que melhora o desempenho do <code translate="no">LIKE</code> dividindo o texto em pequenas substrings e indexando-as para uma pesquisa eficiente. Isto reduz drasticamente a quantidade de dados examinados durante a execução da consulta, fornecendo consultas <code translate="no">LIKE</code> <strong>dezenas a centenas de vezes mais rápidas</strong> em cargas de trabalho autênticas.</p>
<p>O restante deste post mostra como o Índice Ngram funciona no Milvus e avalia seu desempenho em cenários do mundo real.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">O que é o índice Ngram?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Nas bases de dados, a filtragem de texto é normalmente expressa usando <strong>SQL</strong>, a linguagem de consulta padrão usada para recuperar e gerenciar dados. Um dos operadores de texto mais utilizados é <code translate="no">LIKE</code>, que suporta a correspondência de cadeias de caracteres baseada em padrões.</p>
<p>As expressões LIKE podem ser amplamente agrupadas em quatro tipos de padrões comuns, dependendo da forma como os caracteres curinga são utilizados:</p>
<ul>
<li><p><strong>Correspondência infixa</strong> (<code translate="no">name LIKE '%rod%'</code>): Corresponde a registos onde a substring rod aparece em qualquer parte do texto.</p></li>
<li><p><strong>Correspondência de prefixo</strong> (<code translate="no">name LIKE 'rod%'</code>): Corresponde aos registos cujo texto começa com rod.</p></li>
<li><p><strong>Correspondência de sufixo</strong> (<code translate="no">name LIKE '%rod'</code>): Corresponde aos registos cujo texto termina com rod.</p></li>
<li><p><strong>Correspondência curinga</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Combina várias condições de substring (<code translate="no">%</code>) com curingas de um único carácter (<code translate="no">_</code>) num único padrão.</p></li>
</ul>
<p>Embora esses padrões sejam diferentes em aparência e expressividade, o <strong>Índice Ngram</strong> em Milvus acelera todos eles usando a mesma abordagem subjacente.</p>
<p>Antes de construir o índice, Milvus divide cada valor de texto em substrings curtas e sobrepostas de comprimentos fixos, conhecidas como <em>n-gramas</em>. Por exemplo, quando n = 3, a palavra <strong>"Milvus"</strong> é decomposta nos seguintes 3-gramas: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu"</strong> e <strong>"vus".</strong> Cada n-grama é então armazenado num índice invertido que mapeia a substring para o conjunto de IDs de documentos em que aparece. No momento da consulta, as condições de <code translate="no">LIKE</code> são traduzidas em combinações de pesquisas de n-gramas, permitindo ao Milvus filtrar rapidamente a maioria dos registos não correspondentes e avaliar o padrão em relação a um conjunto de candidatos muito mais pequeno. É isto que transforma as dispendiosas pesquisas de cadeias de caracteres em eficientes consultas baseadas em índices.</p>
<p>Dois parâmetros controlam a forma como o índice Ngram é construído: <code translate="no">min_gram</code> e <code translate="no">max_gram</code>. Juntos, eles definem o intervalo de comprimentos de substring que o Milvus gera e indexa.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: O comprimento de substring mais curto a indexar. Na prática, isso também define o comprimento mínimo da substring da consulta que pode se beneficiar do Índice Ngram</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: O comprimento mais longo da substring a indexar. No momento da consulta, determina adicionalmente o tamanho máximo da janela utilizada ao dividir cadeias de caracteres de consulta mais longas em n-gramas.</p></li>
</ul>
<p>Ao indexar todas as substrings contíguas cujos comprimentos se situam entre <code translate="no">min_gram</code> e <code translate="no">max_gram</code>, Milvus estabelece uma base consistente e eficiente para acelerar todos os tipos de padrões <code translate="no">LIKE</code> suportados.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Como funciona o índice Ngram?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus implementa o Índice Ngram em um processo de duas fases:</p>
<ul>
<li><p><strong>Construir o índice:</strong> Gerar n-gramas para cada documento e construir um índice invertido durante a ingestão de dados.</p></li>
<li><p><strong>Acelerar as consultas:</strong> Utilizar o índice para limitar a pesquisa a um pequeno conjunto de candidatos e, em seguida, verificar as correspondências <code translate="no">LIKE</code> exactas desses candidatos.</p></li>
</ul>
<p>Um exemplo concreto torna este processo mais fácil de compreender.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Fase 1: Construir o índice</h3><p><strong>Decompor o texto em n-gramas:</strong></p>
<p>Suponhamos que indexamos o texto <strong>"Apple"</strong> com as seguintes definições:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Com esta configuração, o Milvus gera todas as substrings contíguas de comprimento 2 e 3:</p>
<ul>
<li><p>2-gramas: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-gramas: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Construir um índice invertido:</strong></p>
<p>Consideremos agora um pequeno conjunto de dados com cinco registos:</p>
<ul>
<li><p><strong>Documento 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Documento 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Documento 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Documento 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Documento 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Durante a ingestão, o Milvus gera n-gramas para cada registo e insere-os num índice invertido. Neste índice:</p>
<ul>
<li><p><strong>As chaves</strong> são n-gramas (substrings)</p></li>
<li><p><strong>Os valores</strong> são listas de IDs de documentos onde o n-grama aparece</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Agora o índice está totalmente construído.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Fase 2: Acelerar as consultas</h3><p>Quando um filtro <code translate="no">LIKE</code> é executado, o Milvus utiliza o índice Ngram para acelerar a avaliação da consulta através dos seguintes passos:</p>
<p><strong>1. Extrair o termo da consulta:</strong> Substrings contíguos sem curingas são extraídos da expressão <code translate="no">LIKE</code> (por exemplo, <code translate="no">'%apple%'</code> torna-se <code translate="no">apple</code>).</p>
<p><strong>2. Decompor o termo de consulta:</strong> O termo de consulta é decomposto em n-gramas com base no seu comprimento (<code translate="no">L</code>) e nos <code translate="no">min_gram</code> e <code translate="no">max_gram</code> configurados.</p>
<p><strong>3. Procurar cada grama e intersectar:</strong> Milvus procura os n-gramas da consulta no índice invertido e intersecta as suas listas de identificação de documentos para produzir um pequeno conjunto de candidatos.</p>
<p><strong>4. Verificar e devolver resultados:</strong> A condição original <code translate="no">LIKE</code> é aplicada apenas a este conjunto de candidatos para determinar o resultado final.</p>
<p>Na prática, a forma como uma consulta é dividida em n-gramas depende da forma do próprio padrão. Para ver como isto funciona, vamos concentrar-nos em dois casos comuns: correspondências de infixos e correspondências de wildcards. As correspondências de prefixo e sufixo comportam-se da mesma forma que as correspondências de infixo, pelo que não as iremos abordar separadamente.</p>
<p><strong>Correspondência infixa</strong></p>
<p>Para uma correspondência infixa, a execução depende do comprimento da substring literal (<code translate="no">L</code>) em relação a <code translate="no">min_gram</code> e <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (por exemplo, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>A substring literal <code translate="no">ppl</code> está inteiramente dentro do intervalo de n-gramas configurado. Milvus procura diretamente o n-grama <code translate="no">&quot;ppl&quot;</code> no índice invertido, produzindo os IDs de documentos candidatos <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Como o próprio literal é um n-grama indexado, todos os candidatos já satisfazem a condição de infixação. O passo final de verificação não elimina nenhum registo, e o resultado permanece <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (e.g., <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>A substring literal <code translate="no">pple</code> é mais comprida do que <code translate="no">max_gram</code>, pelo que é decomposta em n-gramas sobrepostos utilizando uma janela de tamanho <code translate="no">max_gram</code>. Com <code translate="no">max_gram = 3</code>, isto produz os n-gramas <code translate="no">&quot;ppl&quot;</code> e <code translate="no">&quot;ple&quot;</code>.</p>
<p>O Milvus procura cada n-grama no índice invertido:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>A intersecção destas listas dá origem ao conjunto de candidatos <code translate="no">[0, 1, 4]</code>. O filtro <code translate="no">LIKE '%pple%'</code> original é então aplicado a estes candidatos. Todos os três satisfazem a condição, pelo que o resultado final permanece <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (e.g., <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>A substring literal é mais curta do que <code translate="no">min_gram</code> e, por conseguinte, não pode ser decomposta em n-gramas indexados. Neste caso, o índice Ngram não pode ser utilizado e o Milvus volta ao caminho de execução predefinido, avaliando a condição <code translate="no">LIKE</code> através de uma pesquisa completa com correspondência de padrões.</p>
<p><strong>Correspondência com curinga</strong> (por exemplo, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Este padrão contém vários caracteres curinga, pelo que o Milvus começa por dividi-lo em literais contíguos: <code translate="no">&quot;Ap&quot;</code> e <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus então processa cada literal independentemente:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> tem comprimento 2 e está dentro do intervalo de n-gramas.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> é mais longo do que <code translate="no">max_gram</code> e é decomposto em <code translate="no">&quot;ppl&quot;</code> e <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>Isto reduz a consulta aos seguintes n-gramas:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>A intersecção destas listas produz um único candidato: <code translate="no">[0]</code>.</p>
<p>Finalmente, o filtro original <code translate="no">LIKE '%Ap%pple%'</code> é aplicado ao documento 0 (<code translate="no">&quot;Apple&quot;</code>). Uma vez que não satisfaz o padrão completo, o conjunto final de resultados está vazio.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Limitações e compromissos do índice de ngramas<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora o índice Ngram possa melhorar significativamente o desempenho da consulta <code translate="no">LIKE</code>, introduz compensações que devem ser consideradas em implementações no mundo real.</p>
<ul>
<li><strong>Aumento do tamanho do índice</strong></li>
</ul>
<p>O principal custo do índice Ngram é o aumento da sobrecarga de armazenamento. Como o índice armazena todas as substrings contíguas cujos comprimentos estão entre <code translate="no">min_gram</code> e <code translate="no">max_gram</code>, o número de n-gramas gerados cresce rapidamente à medida que esse intervalo se expande. Cada comprimento adicional de n-grama adiciona efetivamente outro conjunto completo de substrings sobrepostas para cada valor de texto, aumentando tanto o número de chaves de índice como as suas listas de lançamento. Na prática, expandir o intervalo em apenas um caractere pode praticamente dobrar o tamanho do índice em comparação com um índice invertido padrão.</p>
<ul>
<li><strong>Não é eficaz para todas as cargas de trabalho</strong></li>
</ul>
<p>O índice Ngram não acelera todas as cargas de trabalho. Se os padrões de consulta forem altamente irregulares, contiverem literais muito curtos ou não conseguirem reduzir o conjunto de dados a um pequeno conjunto de candidatos na fase de filtragem, o benefício do desempenho pode ser limitado. Nesses casos, a execução da consulta ainda pode se aproximar do custo de uma varredura completa, mesmo que o índice esteja presente.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Avaliação do desempenho do índice Ngram em consultas LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>O objetivo deste parâmetro de comparação é avaliar a eficácia com que o índice Ngram acelera as consultas <code translate="no">LIKE</code> na prática.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Metodologia de teste</h3><p>Para colocar seu desempenho em contexto, comparamos com dois modos de execução de linha de base:</p>
<ul>
<li><p><strong>Mestre</strong>: Execução de força bruta sem nenhum índice.</p></li>
<li><p><strong>Mestre-invertido</strong>: Execução usando um índice invertido convencional.</p></li>
</ul>
<p>Concebemos dois cenários de teste para cobrir diferentes caraterísticas dos dados:</p>
<ul>
<li><p><strong>Conjunto de dados de texto Wiki</strong>: 100.000 linhas, com cada campo de texto truncado a 1 KB.</p></li>
<li><p><strong>Conjunto de dados de uma só palavra</strong>: 1.000.000 linhas, em que cada linha contém uma única palavra.</p></li>
</ul>
<p>Em ambos os cenários, as seguintes definições são aplicadas de forma consistente:</p>
<ul>
<li><p>As consultas usam o <strong>padrão de correspondência infixa</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>O índice Ngram é configurado com <code translate="no">min_gram = 2</code> e <code translate="no">max_gram = 4</code></p></li>
<li><p>Para isolar o custo de execução da consulta e evitar a sobrecarga de materialização de resultados, todas as consultas retornam <code translate="no">count(*)</code> em vez de conjuntos completos de resultados.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Teste para wiki, cada linha é um texto wiki com comprimento de conteúdo truncado por 1000, 100K linhas</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Tempo (ms)</th><th>Aceleração</th><th>Contagem</th></tr>
</thead>
<tbody>
<tr><td>Mestre</td><td>Estádio</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngrama</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>escola secundária</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngrama</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>é um estabelecimento de ensino secundário coeducacional</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngrama</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Teste para palavras individuais, 1M linhas</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Tempo (ms)</th><th>Aceleração</th><th>Contagem</th></tr>
</thead>
<tbody>
<tr><td>Mestre</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngrama</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngrama</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngrama</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngrama</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mestre</td><td>nação</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Mestre-invertido</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngrama</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> Estes resultados são baseados em benchmarks realizados em maio. Desde então, o ramo Master foi submetido a optimizações de desempenho adicionais, pelo que se espera que a diferença de desempenho aqui observada seja menor nas versões actuais.</p>
<p>Os resultados do benchmark destacam um padrão claro: o Índice de Ngramas acelera significativamente as consultas LIKE em todos os casos, e a rapidez com que as consultas são executadas depende fortemente da estrutura e do comprimento dos dados de texto subjacentes.</p>
<ul>
<li><p>Para <strong>campos de texto longos</strong>, como documentos do tipo Wiki truncados em 1.000 bytes, os ganhos de desempenho são especialmente pronunciados. Em comparação com a execução de força bruta sem índice, o índice Ngram atinge aumentos de velocidade de cerca de <strong>100-200×</strong>. Quando comparado com um índice invertido convencional, a melhoria é ainda mais dramática, atingindo <strong>1.200-1.900×</strong>. Isto deve-se ao facto de as consultas LIKE em textos longos serem particularmente dispendiosas para as abordagens de indexação tradicionais, enquanto as pesquisas de n-gramas podem reduzir rapidamente o espaço de pesquisa a um conjunto muito pequeno de candidatos.</p></li>
<li><p>Em conjuntos de dados constituídos por <strong>entradas de uma só palavra</strong>, os ganhos são menores, mas ainda assim substanciais. Neste cenário, o Índice Ngram é aproximadamente <strong>80-100×</strong> mais rápido do que a execução de força bruta e <strong>45-55×</strong> mais rápido do que um índice invertido convencional. Embora um texto mais curto seja inerentemente mais barato de digitalizar, a abordagem baseada em n-gramas continua a evitar comparações desnecessárias e reduz consistentemente o custo da consulta.</p></li>
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
    </button></h2><p>O índice Ngram acelera as consultas <code translate="no">LIKE</code> dividindo o texto em n-gramas de comprimento fixo e indexando-os usando uma estrutura invertida. Esta conceção transforma a dispendiosa correspondência de substracções em pesquisas eficientes de n-gramas, seguidas de uma verificação mínima. Como resultado, evitam-se as pesquisas em todo o texto e preserva-se a semântica exacta de <code translate="no">LIKE</code>.</p>
<p>Na prática, esta abordagem é eficaz numa vasta gama de cargas de trabalho, com resultados especialmente fortes para a correspondência difusa em campos de texto longos. Por conseguinte, o índice Ngram é adequado para cenários em tempo real, como a pesquisa de códigos, agentes de apoio ao cliente, recuperação de documentos jurídicos e médicos, bases de conhecimentos empresariais e pesquisa académica, em que a correspondência precisa de palavras-chave continua a ser essencial.</p>
<p>Ao mesmo tempo, o Ngram Index beneficia de uma configuração cuidadosa. A escolha de valores apropriados em <code translate="no">min_gram</code> e <code translate="no">max_gram</code> é fundamental para equilibrar o tamanho do índice e o desempenho da consulta. Quando ajustado para refletir padrões de consulta reais, o Índice de Ngramas fornece uma solução prática e escalável para consultas <code translate="no">LIKE</code> de elevado desempenho em sistemas de produção.</p>
<p>Para obter mais informações sobre o Índice Ngram, consulte a documentação abaixo:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Índice Ngram | Documentação do Milvus</a></li>
</ul>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre os recursos do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando o Milvus 2.6: Pesquisa Vetorial Acessível à Escala de Bilhões</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a função Embedding: Como o Milvus 2.6 agiliza a vetorização e a busca semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding no Milvus: Filtragem JSON 88,9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Filtragem Geoespacial e Pesquisa Vetorial com Campos Geométricos e RTREE no Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Apresentando o AISAQ no Milvus: A pesquisa vetorial em escala de bilhões ficou 3.200 vezes mais barata em memória</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Otimizando o NVIDIA CAGRA no Milvus: Uma abordagem híbrida GPU-CPU para indexação mais rápida e consultas mais baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: a arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para o Milvus </a></p></li>
</ul>
