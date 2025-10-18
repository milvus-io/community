---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: >-
  Como a OpusSearch criou a correspondência exacta para o RAG empresarial com o
  Milvus BM25
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_2025_10_18_10_43_29_93fe542daf.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  Saiba como o OpusSearch utiliza o Milvus BM25 para potenciar a correspondência
  exacta em sistemas RAG empresariais, combinando a pesquisa semântica com a
  recuperação precisa de palavras-chave.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>Este post foi originalmente publicado no <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> e é republicado aqui com permissão.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">O ponto cego da pesquisa semântica<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagine o seguinte: És um editor de vídeo com um prazo a cumprir. Precisa de clips do "episódio 281" do seu podcast. Escreve-o na nossa pesquisa. A nossa pesquisa semântica alimentada por IA, orgulhosa da sua inteligência, devolve clips do 280, 282 e até sugere o episódio 218 porque os números são semelhantes, certo?</p>
<p><strong>Errado</strong>.</p>
<p>Quando lançámos o <a href="https://www.opus.pro/opussearch">OpusSearch</a> para empresas em janeiro de 2025, pensámos que a pesquisa semântica seria suficiente. As consultas em linguagem natural como "encontrar momentos engraçados sobre encontros" funcionavam lindamente. O nosso sistema RAG <a href="https://milvus.io/">, alimentado por Milvus</a>, estava a arrasar.</p>
<p><strong>Mas depois a realidade bateu-nos na cara com o feedback dos utilizadores:</strong></p>
<p>"Só quero clips do episódio 281. Porque é que isto é tão difícil?"</p>
<p>"Quando procuro 'Foi isso que ela disse', quero EXACTAMENTE essa frase, não 'foi isso que ele quis dizer'."</p>
<p>Acontece que os editores de vídeo e os recortadores nem sempre querem que a IA seja inteligente. Por vezes, querem que o software seja <strong>direto e correto</strong>.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">Porque é que nos preocupamos com a Pesquisa?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Criámos uma <a href="https://www.opus.pro/opussearch">função de pesquisa empresarial</a> porque identificámos que <strong>a rentabilização de</strong> grandes catálogos de vídeo é o principal desafio que as organizações enfrentam. A nossa plataforma com base no RAG funciona como um <strong>agente de crescimento</strong> que permite às empresas <strong>pesquisar, reutilizar e rentabilizar todas as suas bibliotecas de vídeo</strong>. Leia sobre as histórias de sucesso de <strong>All The Smoke</strong>, <strong>KFC Radio</strong> e <strong>TFTC</strong> <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">aqui</a>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">Por que dobramos a aposta no Milvus (em vez de adicionar outro banco de dados)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>A solução óbvia era adicionar o Elasticsearch ou o MongoDB para obter uma correspondência exacta. No entanto, como uma startup, manter vários sistemas de pesquisa introduz uma sobrecarga e complexidade operacional significativa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A Milvus tinha recentemente lançado a sua funcionalidade de pesquisa de texto integral e uma avaliação com o nosso próprio conjunto de dados <strong>sem qualquer afinação</strong> mostrou vantagens convincentes:</p>
<ul>
<li><p><strong>Precisão de correspondência parcial superior</strong>. Por exemplo, "drinking story" e "jumping high", outras bases de dados vectoriais devolvem por vezes "dining story" e "getting high", o que altera o significado.</p></li>
<li><p>Milvus <strong>apresenta resultados mais longos e mais completos</strong> do que outras bases de dados quando as consultas são gerais, o que é naturalmente mais ideal para o nosso caso de utilização.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">Arquitetura a 5000 pés<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + filtragem = magia da correspondência exacta<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa de texto completo do Milvus não tem propriamente a ver com correspondência exacta, mas sim com pontuação de relevância utilizando o BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(Best Matching 25</a>), que calcula a relevância de um documento para a sua consulta. É excelente para "encontre-me algo próximo", mas terrível para "encontre-me exatamente isto".</p>
<p>Em seguida, combinámos <strong>o poder do BM25 com a filtragem TEXT_MATCH do Milvus</strong>. Eis como funciona:</p>
<ol>
<li><p><strong>Filtrar primeiro</strong>: O TEXT_MATCH encontra documentos que contêm as suas palavras-chave exactas</p></li>
<li><p><strong>Classificação em segundo lugar</strong>: o BM25 classifica essas correspondências exactas por relevância</p></li>
<li><p><strong>Vitória</strong>: obtém correspondências exactas, classificadas de forma inteligente</p></li>
</ol>
<p>Pense nisso como "dê-me tudo com 'episódio 281', depois mostre-me os melhores primeiro".</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">O código que o fez funcionar<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">Desenho do esquema</h3><p><strong>Importante</strong>: Desactivámos totalmente as palavras de paragem, uma vez que termos como "The Office" e "Office" representam entidades distintas no nosso domínio de conteúdo.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">Configuração da função BM25</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">Configuração do índice</h3><p>Estes parâmetros bm25_k1 e bm25_b foram ajustados em relação ao nosso conjunto de dados de produção para um desempenho ótimo.</p>
<p><strong>bm25_k1</strong>: Valores mais altos (até ~2.0) dão mais peso a ocorrências de termos repetidos, enquanto valores mais baixos reduzem o impacto da frequência do termo após as primeiras ocorrências.</p>
<p><strong>bm25_b</strong>: Valores próximos de 1,0 penalizam fortemente documentos mais longos, enquanto valores próximos de 0 ignoram completamente o comprimento do documento.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">A consulta de pesquisa que começou a funcionar</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>Para correspondências exactas de múltiplos termos:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">Os erros que cometemos (para que não tenha de os cometer)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">Campos dinâmicos: Crítico para a flexibilidade da produção</h3><p>Inicialmente, não habilitamos os campos dinâmicos, o que era problemático. As modificações no esquema exigiam a eliminação e a recriação de coleções em ambientes de produção.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">Design da coleção: Manter uma separação clara das preocupações</h3><p>Nossa arquitetura usa coleções dedicadas por domínio de recurso. Essa abordagem modular minimiza o impacto das alterações de esquema e melhora a capacidade de manutenção.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">Uso de memória: Otimizar com MMAP</h3><p>Os índices esparsos requerem uma alocação significativa de memória. Para grandes conjuntos de dados de texto, recomendamos a configuração do MMAP para utilizar o armazenamento em disco. Esta abordagem requer uma capacidade de E/S adequada para manter as caraterísticas de desempenho.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">Impacto na produção e resultados<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Após a implementação da funcionalidade de correspondência exacta em junho de 2025, observámos melhorias mensuráveis nas métricas de satisfação do utilizador e um volume de suporte reduzido para problemas relacionados com a pesquisa. A nossa abordagem de modo duplo permite a pesquisa semântica para consultas exploratórias, ao mesmo tempo que fornece uma correspondência exacta para a recuperação de conteúdos específicos.</p>
<p>A principal vantagem da arquitetura: manter um único sistema de base de dados que suporta ambos os paradigmas de pesquisa, reduzindo a complexidade operacional e expandindo a funcionalidade.</p>
<h2 id="What’s-Next" class="common-anchor-header">O que vem a seguir?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Estamos a fazer experiências com <strong>consultas</strong> <strong>híbridas</strong> <strong>que combinam correspondência semântica e exacta numa única pesquisa</strong>. Imagine: "Encontrar clips engraçados do episódio 281" em que "engraçado" utiliza a pesquisa semântica e "episódio 281" utiliza a correspondência exacta.</p>
<p>O futuro da pesquisa não é escolher entre a IA semântica e a correspondência exacta. É utilizar <strong>ambas</strong> de forma inteligente no mesmo sistema.</p>
