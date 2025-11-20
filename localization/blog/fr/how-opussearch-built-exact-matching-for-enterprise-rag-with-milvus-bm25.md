---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: >-
  Comment OpusSearch a développé l'Exact Matching pour Enterprise RAG avec
  Milvus BM25
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/opus_cover_new_1505263938.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  Découvrez comment OpusSearch utilise Milvus BM25 pour optimiser la
  correspondance exacte dans les systèmes RAG d'entreprise, en combinant la
  recherche sémantique avec la récupération précise de mots clés.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>Cet article a été publié à l'origine sur <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> et est repris ici avec l'autorisation de l'auteur.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">L'angle mort de la recherche sémantique<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Imaginez la situation : Vous êtes un monteur vidéo qui doit respecter un délai. Vous avez besoin d'extraits de l'"épisode 281" de votre podcast. Vous le tapez dans notre moteur de recherche. Notre recherche sémantique alimentée par l'IA, fière de son intelligence, renvoie des extraits des épisodes 280, 282 et suggère même l'épisode 218 parce que les numéros sont similaires, n'est-ce pas ?</p>
<p><strong>C</strong>'<strong>est faux</strong>.</p>
<p>Lorsque nous avons lancé <a href="https://www.opus.pro/opussearch">OpusSearch</a> pour les entreprises en janvier 2025, nous pensions que la recherche sémantique suffirait. Les requêtes en langage naturel telles que "trouver des moments drôles sur les rencontres" fonctionnaient à merveille. Notre système RAG <a href="https://milvus.io/">, alimenté par Milvus,</a> était en train de l'écraser.</p>
<p><strong>Mais la réalité nous a frappés de plein fouet avec les commentaires des utilisateurs :</strong></p>
<p>"Je veux juste des extraits de l'épisode 281. Pourquoi est-ce si difficile ?"</p>
<p>Lorsque je cherche "C'est ce qu'elle a dit", je veux EXACTEMENT cette phrase, pas "c'est ce qu'il voulait dire".</p>
<p>Il s'avère que les monteurs vidéo et les clippeurs ne veulent pas toujours que l'IA soit intelligente. Parfois, ils veulent que le logiciel soit <strong>simple et correct</strong>.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">Pourquoi la recherche nous intéresse-t-elle ?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons créé une <a href="https://www.opus.pro/opussearch">fonction de recherche d'entreprise</a> parce que nous avons constaté que la <strong>monétisation de</strong> vastes catalogues vidéo est le principal défi auquel les entreprises sont confrontées. Notre plateforme alimentée par RAG sert d'<strong>agent de croissance pour</strong> permettre aux entreprises de <strong>rechercher, de réutiliser et de monétiser l'ensemble de leurs vidéothèques</strong>. Découvrez les cas de réussite de <strong>All The Smoke</strong>, <strong>KFC Radio</strong> et <strong>TFTC</strong> <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">ici</a>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">Pourquoi nous avons doublé Milvus (au lieu d'ajouter une autre base de données)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>La solution la plus évidente était d'ajouter Elasticsearch ou MongoDB pour une correspondance exacte. Cependant, en tant que startup, la maintenance de plusieurs systèmes de recherche introduit une surcharge opérationnelle et une complexité significatives.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus a récemment lancé sa fonction de recherche en texte intégral, et une évaluation avec notre propre ensemble de données <strong>sans aucun réglage</strong> a montré des avantages convaincants :</p>
<ul>
<li><p><strong>Une précision supérieure des correspondances partielles</strong>. Par exemple, "histoire de boire" et "sauter haut", d'autres bases de données vectorielles renvoient parfois "histoire de manger" et "sauter haut", ce qui modifie le sens.</p></li>
<li><p>Milvus <strong>renvoie des résultats plus longs et plus complets</strong> que les autres bases de données lorsque les requêtes sont générales, ce qui est naturellement plus idéal pour notre cas d'utilisation.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">Architecture à 5000 pieds d'altitude<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + filtrage = magie de la correspondance exacte<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche en texte intégral de Milvus n'est pas vraiment axée sur la correspondance exacte, mais sur l'évaluation de la pertinence à l'aide de BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(Best Matching 25</a>), qui calcule le degré de pertinence d'un document par rapport à votre requête. C'est très utile pour "trouver quelque chose de proche", mais c'est terrible pour "trouver exactement ceci".</p>
<p>Nous avons ensuite <strong>combiné la puissance de BM25 avec le filtrage TEXT_MATCH de Milvus</strong>. Voici comment cela fonctionne :</p>
<ol>
<li><p><strong>Filtrer d'abord</strong>: TEXT_MATCH trouve les documents contenant vos mots-clés exacts.</p></li>
<li><p><strong>Classement en second</strong>: BM25 trie ces correspondances exactes par pertinence.</p></li>
<li><p><strong>Gagnant</strong>: vous obtenez des correspondances exactes, classées intelligemment.</p></li>
</ol>
<p>Pensez-y comme "donnez-moi tout ce qui contient 'épisode 281', puis montrez-moi les meilleurs en premier".</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">Le code qui a permis à ce système de fonctionner<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">Conception du schéma</h3><p><strong>Important</strong>: nous avons entièrement désactivé les mots vides, car des termes comme "The Office" et "Office" représentent des entités distinctes dans notre domaine de contenu.</p>
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
<h3 id="BM25-Function-Setup" class="common-anchor-header">Configuration de la fonction BM25</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">Configuration de l'index</h3><p>Ces paramètres bm25_k1 et bm25_b ont été ajustés par rapport à notre ensemble de données de production pour des performances optimales.</p>
<p><strong>bm25_k1</strong>: Des valeurs élevées (jusqu'à ~2.0) donnent plus de poids aux occurrences répétées des termes, tandis que des valeurs plus faibles réduisent l'impact de la fréquence des termes après les premières occurrences.</p>
<p><strong>bm25_b</strong>: Les valeurs proches de 1,0 pénalisent fortement les documents plus longs, tandis que les valeurs proches de 0 ignorent totalement la longueur du document.</p>
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
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">La requête de recherche qui a commencé à fonctionner</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>Pour les correspondances exactes multitermes :</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">Les erreurs que nous avons commises (pour que vous n'ayez pas à les commettre)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">Champs dynamiques : Un élément essentiel pour la flexibilité de la production</h3><p>Au départ, nous n'avions pas activé les champs dynamiques, ce qui posait problème. Les modifications de schéma nécessitaient de supprimer et de recréer les collections dans les environnements de production.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">Conception des collections : Maintenir une séparation claire des préoccupations</h3><p>Notre architecture utilise des collections dédiées à chaque domaine de fonctionnalité. Cette approche modulaire minimise l'impact des modifications de schéma et améliore la maintenabilité.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">Utilisation de la mémoire : Optimiser avec MMAP</h3><p>Les index épars nécessitent une allocation de mémoire importante. Pour les grands ensembles de données textuelles, nous recommandons de configurer MMAP pour utiliser le stockage sur disque. Cette approche nécessite une capacité d'E/S adéquate pour maintenir les caractéristiques de performance.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">Impact sur la production et résultats<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Après le déploiement de la fonctionnalité de correspondance exacte en juin 2025, nous avons observé des améliorations mesurables dans les mesures de satisfaction des utilisateurs et une réduction du volume de support pour les problèmes liés à la recherche. Notre approche à double mode permet une recherche sémantique pour les requêtes exploratoires tout en fournissant une correspondance précise pour la recherche de contenu spécifique.</p>
<p>Le principal avantage architectural est le maintien d'un système de base de données unique qui prend en charge les deux paradigmes de recherche, réduisant ainsi la complexité opérationnelle tout en élargissant les fonctionnalités.</p>
<h2 id="What’s-Next" class="common-anchor-header">Quelles sont les prochaines étapes ?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous expérimentons des <strong>requêtes</strong> <strong>hybrides</strong> <strong>combinant la recherche sémantique et la correspondance exacte en une seule recherche</strong>. Imaginez : "Trouver des clips amusants de l'épisode 281", où "amusant" utilise la recherche sémantique et "épisode 281" la correspondance exacte.</p>
<p>L'avenir de la recherche ne consiste pas à choisir entre l'IA sémantique et la correspondance exacte. Il s'agit d'utiliser <strong>les deux</strong> intelligemment dans le même système.</p>
