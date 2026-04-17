---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Desbloquear a verdadeira recuperação ao nível da entidade: Novas capacidades
  de matriz de estruturas e MAX_SIM no Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Saiba como o Array of Structs e o MAX_SIM no Milvus permitem uma verdadeira
  pesquisa ao nível da entidade para dados multi-vectoriais, eliminando a
  deduplicação e melhorando a precisão da recuperação.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Se criou aplicações de IA com base em bases de dados vectoriais, provavelmente já se deparou com o mesmo problema: a base de dados recupera embeddings de pedaços individuais, mas a sua aplicação preocupa-se com <strong><em>entidades</em>.</strong> A incompatibilidade torna complexo todo o fluxo de trabalho de recuperação.</p>
<p>É provável que já tenha visto isto acontecer vezes sem conta:</p>
<ul>
<li><p><strong>Bases de dados de conhecimento RAG:</strong> Os artigos são divididos em fragmentos de parágrafos, pelo que o motor de busca devolve fragmentos dispersos em vez do documento completo.</p></li>
<li><p><strong>Recomendação de comércio eletrónico:</strong> Um produto tem vários embeddings de imagem e o seu sistema devolve cinco ângulos do mesmo item em vez de cinco produtos únicos.</p></li>
<li><p><strong>Plataformas de vídeo:</strong> Os vídeos são divididos em clip embeddings, mas os resultados da pesquisa apresentam partes do mesmo vídeo em vez de uma única entrada consolidada.</p></li>
<li><p><strong>Recuperação ao estilo ColBERT / ColPali:</strong> Os documentos expandem-se em centenas de token ou patch-level embeddings, e os resultados aparecem como pequenos pedaços que ainda precisam de ser fundidos.</p></li>
</ul>
<p>Todos estes problemas têm origem na <em>mesma lacuna arquitetónica</em>: a maioria das bases de dados vectoriais trata cada incorporação como uma linha isolada, enquanto as aplicações reais operam em entidades de nível superior - documentos, produtos, vídeos, itens, cenas. Como resultado, as equipas de engenharia são forçadas a reconstruir as entidades manualmente utilizando a lógica de deduplicação, agrupamento, agrupamento e classificação. Funciona, mas é frágil, lento e incha a camada de aplicação com lógica que nunca deveria ter existido.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> fecha essa lacuna com uma nova funcionalidade: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> com o tipo de métrica <strong>MAX_SIM</strong>. Juntos, eles permitem que todos os embeddings de uma única entidade sejam armazenados em um único registro e permitem que Milvus pontue e retorne a entidade holisticamente. Não há mais conjuntos de resultados duplicados. Não há mais pós-processamento complexo como reranking e merging</p>
<p>Neste artigo, vamos explicar como funciona o Array of Structs e o MAX_SIM - e demonstrá-los através de dois exemplos reais: Recuperação de documentos da Wikipédia e pesquisa de documentos baseada em imagens do ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">O que é um Array of Structs?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Em Milvus, um campo <strong>Array of Structs</strong> permite que um único registo contenha uma <em>lista ordenada</em> de elementos Struct, cada um seguindo o mesmo esquema predefinido. Um Struct pode conter vários vectores, bem como campos escalares, cadeias de caracteres ou quaisquer outros tipos suportados. Por outras palavras, permite-lhe agrupar todas as peças que pertencem a uma entidade - incorporações de parágrafos, visualizações de imagens, vectores de símbolos, metadados - diretamente numa linha.</p>
<p>Aqui está um exemplo de uma entidade de uma coleção que contém um campo Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>No exemplo acima, o campo <code translate="no">chunks</code> é um campo de matriz de estruturas e cada elemento de estrutura contém seus próprios campos, ou seja, <code translate="no">text</code>, <code translate="no">text_vector</code> e <code translate="no">chapter</code>.</p>
<p>Esta abordagem resolve um problema de modelação de longa data nas bases de dados vectoriais. Tradicionalmente, cada incorporação ou atributo tem de se tornar a sua própria linha, o que obriga a que <strong>entidades multi-vectoriais (documentos, produtos, vídeos)</strong> sejam divididas em dezenas, centenas ou mesmo milhares de registos. Com o Array of Structs, o Milvus permite-lhe armazenar toda a entidade multi-vetorial num único campo, o que o torna um ajuste natural para listas de parágrafos, token embeddings, sequências de clipes, imagens multi-view, ou qualquer cenário onde um item lógico é composto por muitos vectores.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Como um conjunto de estruturas funciona com o MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobreposto a esta nova estrutura de matriz de estruturas está o <strong>MAX_SIM</strong>, uma nova estratégia de pontuação que torna a recuperação semântica consciente da entidade. Quando uma consulta chega, o Milvus compara-a com <em>todos os</em> vectores dentro de cada Array of Structs e considera a <strong>semelhança máxima</strong> como a pontuação final da entidade. A entidade é então classificada - e devolvida - com base nessa pontuação única. Isto evita o problema clássico da base de dados de vectores de recuperar fragmentos dispersos e empurra o fardo do agrupamento, desduplicação e nova classificação para a camada de aplicação. Com MAX_SIM, a recuperação a nível de entidade torna-se integrada, consistente e eficiente.</p>
<p>Para entender como o MAX_SIM funciona na prática, vamos analisar um exemplo concreto.</p>
<p><strong>Nota:</strong> Todos os vectores neste exemplo são gerados pelo mesmo modelo de incorporação, e a similaridade é medida com a similaridade de cosseno no intervalo [0,1].</p>
<p>Suponhamos que um utilizador procura <strong>"Curso para principiantes em aprendizagem automática".</strong></p>
<p>A consulta é tokenizada em três <strong>tokens</strong>:</p>
<ul>
<li><p><em>Aprendizagem de máquinas</em></p></li>
<li><p><em>iniciante</em></p></li>
<li><p><em>curso</em></p></li>
</ul>
<p>Cada um destes tokens é então <strong>convertido num vetor de incorpor</strong> ação pelo mesmo modelo de incorporação utilizado para os documentos.</p>
<p>Agora, imagine que a base de dados de vectores contém dois documentos:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Um guia de introdução às redes neurais profundas com Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>Um guia avançado para a leitura de artigos LLM</em></p></li>
</ul>
<p>Ambos os documentos foram incorporados em vetores e armazenados dentro de um array de structs.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Passo 1: Calcular MAX_SIM para doc_1</strong></h3><p>Para cada vetor de consulta, o Milvus calcula a sua similaridade cosseno em relação a todos os vectores do doc_1:</p>
<table>
<thead>
<tr><th></th><th>Introdução</th><th>guia</th><th>redes neuronais profundas</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>aprendizagem de máquinas</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>principiante</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>curso</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Para cada vetor de consulta, o MAX_SIM seleciona a <strong>maior</strong> semelhança da sua linha:</p>
<ul>
<li><p>aprendizagem automática → redes neurais profundas (0,9)</p></li>
<li><p>iniciante → introdução (0.8)</p></li>
<li><p>curso → guia (0,7)</p></li>
</ul>
<p>A soma das melhores correspondências dá a doc_1 uma <strong>pontuação MAX_SIM de 2,4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Passo 2: Calcular MAX_SIM para doc_2</h3><p>Agora repetimos o processo para o documento_2:</p>
<table>
<thead>
<tr><th></th><th>avançado</th><th>guia</th><th>LLM</th><th>papel</th><th>leitura</th></tr>
</thead>
<tbody>
<tr><td>aprendizagem de máquinas</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>principiante</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>curso</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>As melhores correspondências para doc_2 são:</p>
<ul>
<li><p>"aprendizagem automática" → "LLM" (0.9)</p></li>
<li><p>"iniciante" → "guia" (0.6)</p></li>
<li><p>"curso" → "guia" (0,8)</p></li>
</ul>
<p>A soma das pontuações dá ao doc_2 uma <strong>pontuação MAX_SIM de 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Passo 3: Comparar as pontuações</h3><p>Como <strong>2,4 &gt; 2,3</strong>, <strong>o documento 1 tem uma classificação superior ao documento 2</strong>, o que faz sentido intuitivamente, uma vez que o documento 1 está mais próximo de um guia introdutório de aprendizagem automática.</p>
<p>A partir deste exemplo, podemos destacar três caraterísticas principais do MAX_SIM:</p>
<ul>
<li><p><strong>Semântica em primeiro lugar, não baseada em palavras-chave:</strong> O MAX_SIM compara embeddings, não literais de texto. Apesar de <em>"machine learning"</em> e <em>"deep neural networks"</em> partilharem zero palavras sobrepostas, a sua semelhança semântica é de 0,9. Isto torna o MAX_SIM robusto a sinónimos, paráfrases, sobreposições conceptuais e cargas de trabalho modernas ricas em embedding.</p></li>
<li><p><strong>Insensível ao comprimento e à ordem:</strong> MAX_SIM não requer que a consulta e o documento tenham o mesmo número de vectores (por exemplo, doc_1 tem 4 vectores enquanto doc_2 tem 5, e ambos funcionam bem). Também ignora a ordem dos vectores - "beginner" que aparece mais cedo na consulta e "introduction" que aparece mais tarde no documento não tem impacto na pontuação.</p></li>
<li><p><strong>Cada vetor de consulta é importante:</strong> O MAX_SIM considera a melhor correspondência para cada vetor de consulta e soma essas melhores pontuações. Isto evita que vectores sem correspondência distorçam o resultado e garante que cada token de consulta importante contribui para a pontuação final. Por exemplo, a correspondência de menor qualidade para "iniciante" em doc_2 reduz diretamente sua pontuação geral.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Porque é que MAX_SIM + Array of Structs são importantes na Base de Dados Vetorial<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">O Milvus</a> é uma base de dados vetorial de alto desempenho e de código aberto, que agora suporta totalmente o MAX_SIM juntamente com Array of Structs, permitindo a recuperação multi-vetorial nativa do vetor e ao nível da entidade:</p>
<ul>
<li><p><strong>Armazene entidades multi-vectoriais de forma nativa:</strong> O Array of Structs permite-lhe armazenar grupos de vectores relacionados num único campo sem os dividir em linhas separadas ou tabelas auxiliares.</p></li>
<li><p><strong>Cálculo eficiente da melhor correspondência:</strong> Combinado com índices vectoriais como IVF e HNSW, o MAX_SIM pode calcular as melhores correspondências sem analisar cada vetor, mantendo o desempenho elevado mesmo com documentos grandes.</p></li>
<li><p><strong>Criado especificamente para cargas de trabalho semânticas pesadas:</strong> Essa abordagem se destaca na recuperação de textos longos, correspondência semântica multifacetada, alinhamento de resumo de documentos, consultas com várias palavras-chave e outros cenários de IA que exigem raciocínio semântico flexível e refinado.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Quando usar uma Matriz de Estruturas<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>O valor de <strong>Array of Structs</strong> torna-se claro quando se olha para o que ele permite. Em sua essência, esse recurso fornece três capacidades fundamentais:</p>
<ul>
<li><p><strong>Agrupa dados heterogéneos - vectores</strong>, escalares, cadeias de caracteres, metadados - num único objeto estruturado.</p></li>
<li><p><strong>Alinha o armazenamento com entidades do mundo real</strong>, para que cada linha da base de dados seja mapeada de forma clara para um item real, como um artigo, um produto ou um vídeo.</p></li>
<li><p><strong>Quando combinado com funções agregadas como MAX_SIM</strong>, permite uma verdadeira recuperação multi-vetorial ao nível da entidade diretamente a partir da base de dados, eliminando a deduplicação, o agrupamento ou a reordenação na camada de aplicação.</p></li>
</ul>
<p>Devido a estas propriedades, Array of Structs é um ajuste natural sempre que uma <em>única entidade lógica é representada por vários vectores</em>. Exemplos comuns incluem artigos divididos em parágrafos, documentos decompostos em token embeddings ou produtos representados por várias imagens. Se os seus resultados de pesquisa sofrem de resultados duplicados, fragmentos dispersos ou a mesma entidade aparece várias vezes nos principais resultados, o Array of Structs resolve estes problemas na camada de armazenamento e recuperação - não através de correcções posteriores no código da aplicação.</p>
<p>Esse padrão é especialmente poderoso para sistemas modernos de IA que dependem da <strong>recuperação de vários vetores</strong>. Por exemplo:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>O ColBERT</strong></a> representa um único documento como 100-500 token embeddings para uma correspondência semântica refinada em domínios como o texto jurídico e a investigação académica.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>O ColPali</strong> converte </a>cada página de PDF em 256-1024 fragmentos de imagem para recuperação multimodal de extractos financeiros, contratos, facturas e outros documentos digitalizados.</p></li>
</ul>
<p>Uma matriz de Structs permite que o Milvus armazene todos esses vetores em uma única entidade e calcule a similaridade agregada (por exemplo, MAX_SIM) de forma eficiente e nativa. Para tornar isto mais claro, aqui estão dois exemplos concretos.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Exemplo 1: Pesquisa de produtos de comércio eletrónico</h3><p>Anteriormente, os produtos com várias imagens eram armazenados num esquema plano - uma imagem por linha. Um produto com fotos frontais, laterais e em ângulo produzia três linhas. Os resultados da pesquisa frequentemente retornavam várias imagens do mesmo produto, exigindo desduplicação manual e nova classificação.</p>
<p>Com uma matriz de estruturas, cada produto torna-se <strong>numa linha</strong>. Todas as incorporações de imagens e metadados (ângulo, is_primary, etc.) vivem dentro de um campo <code translate="no">images</code> como uma matriz de structs. Milvus entende que eles pertencem ao mesmo produto e retorna o produto como um todo - não suas imagens individuais.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Exemplo 2: Base de conhecimento ou pesquisa na Wikipédia</h3><p>Anteriormente, um único artigo da Wikipédia era dividido em <em>N</em> linhas de parágrafos. Os resultados da pesquisa retornavam parágrafos dispersos, forçando o sistema a agrupá-los e adivinhar a que artigo pertenciam.</p>
<p>Com uma matriz de estruturas, o artigo inteiro torna-se <strong>numa linha</strong>. Todos os parágrafos e suas incorporações são agrupados em um campo de parágrafos, e o banco de dados retorna o artigo completo, não pedaços fragmentados.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Tutoriais práticos: Recuperação em nível de documento com a matriz de estruturas<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Recuperação de documentos da Wikipédia</h3><p>Neste tutorial, vamos ver como usar um <strong>Array of Structs</strong> para converter dados ao nível dos parágrafos em registos de documentos completos - permitindo que o Milvus faça uma <strong>verdadeira recuperação ao nível do documento</strong> em vez de devolver fragmentos isolados.</p>
<p>Muitos pipelines de bases de conhecimento armazenam artigos da Wikipédia como pedaços de parágrafos. Isto funciona bem para incorporação e indexação, mas é uma falha na recuperação: uma consulta do utilizador normalmente devolve parágrafos dispersos, forçando-o a agrupar e reconstruir manualmente o artigo. Com um Array of Structs e MAX_SIM, podemos redesenhar o esquema de armazenamento para que <strong>cada artigo se torne uma linha</strong>, e o Milvus pode classificar e retornar o documento inteiro nativamente.</p>
<p>Nos próximos passos, mostraremos como:</p>
<ol>
<li><p>Carregar e pré-processar dados de parágrafos da Wikipédia</p></li>
<li><p>Agrupar todos os parágrafos pertencentes ao mesmo artigo numa matriz de estruturas</p></li>
<li><p>Inserir estes documentos estruturados no Milvus</p></li>
<li><p>Executar consultas MAX_SIM para obter artigos completos - de forma limpa, sem deduções ou reanálises</p></li>
</ol>
<p>No final deste tutorial, terá um pipeline funcional onde o Milvus lida diretamente com a recuperação ao nível da entidade, exatamente da forma que os utilizadores esperam.</p>
<p><strong>Modelo de dados:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Etapa 1: agrupar e transformar os dados</strong></p>
<p>Para esta demonstração, usamos o conjunto de dados <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 2: Criar a coleção Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 3: Inserir dados e criar índice</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Etapa 4: Pesquisar documentos</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comparação de resultados: Recuperação tradicional vs. Matriz de estruturas</strong></p>
<p>O impacto da Matriz de estruturas fica claro quando olhamos para o que o banco de dados realmente retorna:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimensão</strong></th><th style="text-align:center"><strong>Abordagem tradicional</strong></th><th style="text-align:center"><strong>Matriz de estruturas</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Saída da base de dados</strong></td><td style="text-align:center">Devolve <strong>os 100 parágrafos principais</strong> (elevada redundância)</td><td style="text-align:center">Devolve os <em>10 principais documentos completos</em> - limpos e exactos</td></tr>
<tr><td style="text-align:center"><strong>Lógica da aplicação</strong></td><td style="text-align:center">Requer <strong>agrupamento, deduplicação e reanálise</strong> (complexo)</td><td style="text-align:center">Não é necessário pós-processamento - os resultados ao nível da entidade vêm diretamente do Milvus</td></tr>
</tbody>
</table>
<p>No exemplo da Wikipédia, demonstrámos apenas o caso mais simples: combinar vectores de parágrafos numa representação unificada do documento. Mas a verdadeira força do Array of Structs é que ele se generaliza para <strong>qualquer</strong> modelo de dados multi-vetorial - tanto os pipelines de recuperação clássicos como as arquitecturas modernas de IA.</p>
<p><strong>Cenários tradicionais de recuperação multi-vetorial</strong></p>
<p>Muitos sistemas de pesquisa e recomendação bem estabelecidos operam naturalmente em entidades com vários vectores associados. Array of Structs mapeia esses casos de uso de forma limpa:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Cenário</strong></th><th style="text-align:center"><strong>Modelo de dados</strong></th><th style="text-align:center"><strong>Vectores por entidade</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Produtos de comércio eletrónico</strong></td><td style="text-align:center">Um produto → várias imagens</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center"><strong>Pesquisa de vídeo</strong></td><td style="text-align:center">Um vídeo → vários clips</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center"><strong>Recuperação de papel</strong></td><td style="text-align:center">Um documento → várias secções</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Cargas de trabalho de modelos de IA (casos de utilização multi-vectoriais fundamentais)</strong></p>
<p>O conjunto de estruturas torna-se ainda mais crítico nos modelos modernos de IA que produzem intencionalmente grandes conjuntos de vectores por entidade para um raciocínio semântico refinado.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modelo</strong></th><th style="text-align:center"><strong>Modelo de dados</strong></th><th style="text-align:center"><strong>Vectores por entidade</strong></th><th style="text-align:center"><strong>Aplicação</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Um documento → muitos token embeddings</td><td style="text-align:center">100-500</td><td style="text-align:center">Texto jurídico, artigos académicos, recuperação de documentos com precisão</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Uma página PDF → muitas incorporações de fragmentos</td><td style="text-align:center">256-1024</td><td style="text-align:center">Relatórios financeiros, contratos, facturas, pesquisa multimodal de documentos</td></tr>
</tbody>
</table>
<p>Estes modelos <em>requerem</em> um padrão de armazenamento multi-vetorial. Antes do Array of Structs, os programadores tinham de dividir os vectores por linhas e juntar manualmente os resultados. Com o Milvus, estas entidades podem agora ser armazenadas e recuperadas nativamente, com o MAX_SIM a tratar automaticamente a pontuação ao nível do documento.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. Pesquisa de documentos baseada em imagens ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>O ColPali</strong></a> é um modelo poderoso para a recuperação multimodal de PDFs. Em vez de se basear em texto, processa cada página de PDF como uma imagem e divide-a em até 1024 partes visuais, gerando uma incorporação por parte de cada parte. Num esquema de base de dados tradicional, isto exigiria o armazenamento de uma única página como centenas ou milhares de linhas separadas, tornando impossível para a base de dados compreender que estas linhas pertencem à mesma página. Como resultado, a pesquisa a nível de entidade torna-se fragmentada e impraticável.</p>
<p>O Array of Structs resolve este problema armazenando todos os patch embeddings <em>num único campo</em>, permitindo que o Milvus trate a página como uma entidade coesa e multi-vetorial.</p>
<p>A pesquisa tradicional em PDFs geralmente depende do <strong>OCR</strong>, que converte imagens de páginas em texto. Isso funciona para texto simples, mas perde gráficos, tabelas, layout e outras dicas visuais. O ColPali evita esta limitação ao trabalhar diretamente nas imagens das páginas, preservando todas as informações visuais e textuais. A desvantagem é a escala: cada página contém agora centenas de vectores, o que requer uma base de dados que possa agregar muitos embeddings numa única entidade - exatamente o que o Array of Structs + MAX_SIM fornece.</p>
<p>O caso de utilização mais comum é o <strong>Vision RAG</strong>, em que cada página PDF se torna uma entidade multi-vetorial. Os cenários típicos incluem:</p>
<ul>
<li><p><strong>Relatórios financeiros:</strong> pesquisa em milhares de PDFs por páginas que contenham gráficos ou tabelas específicos.</p></li>
<li><p><strong>Contratos:</strong> recuperação de cláusulas de documentos legais digitalizados ou fotografados.</p></li>
<li><p><strong>Facturas:</strong> localizar facturas por fornecedor, montante ou esquema.</p></li>
<li><p><strong>Apresentações:</strong> localização de diapositivos que contenham uma figura ou diagrama específico.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modelo de dados:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 1: Preparar os dados</strong>Pode consultar o documento para obter detalhes sobre como o ColPali converte imagens ou texto em representações multi-vectoriais.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 2: Criar a coleção Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 3: Inserir dados e criar índice</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 4: Pesquisa multimodal: Consulta de texto → Resultados de imagem</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exemplo de saída:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Aqui, os resultados retornam diretamente páginas PDF completas. Não precisamos de nos preocupar com os 1024 patch embeddings subjacentes - o Milvus trata de toda a agregação automaticamente.</p>
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
    </button></h2><p>A maioria dos bancos de dados vetoriais armazena cada fragmento como um registro independente, o que significa que os aplicativos precisam remontar esses fragmentos quando precisam de um documento, produto ou página completa. Uma matriz de Structs muda isso. Ao combinar escalares, vectores, texto e outros campos num único objeto estruturado, permite que uma linha da base de dados represente uma entidade completa de ponta a ponta.</p>
<p>O resultado é simples, mas poderoso: o trabalho que costumava exigir agrupamento, eliminação de duplicações e reanálise complexos na camada de aplicação torna-se uma capacidade nativa da base de dados. E é exatamente para aí que se dirige o futuro das bases de dados vectoriais: estruturas mais ricas, recuperação mais inteligente e condutas mais simples.</p>
<p>Para obter mais informações sobre Array of Structs e MAX_SIM, consulte a documentação abaixo:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Matriz de Structs | Documentação do Milvus</a></li>
</ul>
<p>Tem dúvidas ou quer aprofundar qualquer caraterística do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
