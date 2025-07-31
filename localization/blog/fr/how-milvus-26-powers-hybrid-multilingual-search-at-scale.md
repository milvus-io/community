---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: >-
  Comment Milvus 2.6 améliore la recherche multilingue en texte intégral à
  grande échelle
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 introduit un pipeline d'analyse de texte entièrement remanié avec
  une prise en charge multilingue complète pour la recherche en texte intégral.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Les applications modernes d'intelligence artificielle deviennent de plus en plus complexes. Il ne suffit pas d'appliquer une méthode de recherche à un problème pour qu'il soit résolu.</p>
<p>Prenons l'exemple des systèmes de recommandation : ils nécessitent une <strong>recherche vectorielle</strong> pour comprendre le sens du texte et des images, un <strong>filtrage des métadonnées</strong> pour limiter les résultats en fonction du prix, de la catégorie ou de l'emplacement, et une <strong>recherche par mot clé</strong> pour les requêtes directes telles que "Nike Air Max". Chaque méthode résout une partie différente du problème, et les systèmes du monde réel ont besoin de toutes ces méthodes pour fonctionner ensemble.</p>
<p>L'avenir de la recherche ne consiste pas à choisir entre la recherche vectorielle et la recherche par mot-clé. Il s'agit de combiner vecteur ET mot-clé ET filtrage, ainsi que d'autres types de recherche, le tout en un seul endroit. C'est pourquoi nous avons commencé à intégrer la <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">recherche hybride</a> dans Milvus il y a un an, avec la sortie de Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Mais la recherche en texte intégral fonctionne différemment<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Il n'est pas facile d'intégrer la recherche en texte intégral dans un système vectoriel natif. La recherche en texte intégral présente son propre ensemble de défis.</p>
<p>Alors que la recherche vectorielle capture le sens <em>sémantique</em> du texte - en le transformant en vecteurs à haute dimension - la recherche en texte intégral dépend de la compréhension de la <strong>structure du langage</strong>: comment les mots sont formés, où ils commencent et où ils finissent, et comment ils sont liés les uns aux autres. Par exemple, lorsqu'un utilisateur recherche "running shoes" en anglais, le texte passe par plusieurs étapes de traitement :</p>
<p><em>séparation des espaces blancs → minuscules → suppression des mots vides → transformation de &quot;running&quot; en &quot;run&quot;.</em></p>
<p>Pour traiter cela correctement, nous avons besoin d'un <strong>analyseur de langue</strong>robuste <strong>,</strong>capable de gérer le fractionnement, le tronconnage, le filtrage et bien plus encore.</p>
<p>Lorsque nous avons introduit la <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">recherche plein texte BM25</a> dans Milvus 2.5, nous avons inclus un analyseur personnalisable, qui a bien fonctionné pour ce pour quoi il avait été conçu. Vous pouviez définir un pipeline utilisant des tokenizers, des filtres de token et des filtres de caractères pour préparer le texte à l'indexation et à la recherche.</p>
<p>Pour l'anglais, cette configuration était relativement simple. Mais les choses deviennent plus complexes lorsqu'il s'agit de langues multiples.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">Le défi de la recherche multilingue en texte intégral<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche multilingue en texte intégral pose toute une série de problèmes :</p>
<ul>
<li><p><strong>Les langues complexes nécessitent un traitement particulier</strong>: Les langues comme le chinois, le japonais et le coréen n'utilisent pas d'espaces entre les mots. Elles ont besoin d'outils avancés pour segmenter les caractères en mots significatifs. Ces outils peuvent fonctionner correctement pour une seule langue, mais il est rare qu'ils prennent en charge simultanément plusieurs langues complexes.</p></li>
<li><p><strong>Même des langues similaires peuvent entrer en conflit</strong>: L'anglais et le français peuvent tous deux utiliser des espaces pour séparer les mots, mais une fois que vous appliquez un traitement spécifique à la langue, comme le stemming ou la lemmatisation, les règles d'une langue peuvent interférer avec celles de l'autre. Ce qui améliore la précision en anglais peut fausser les requêtes en français, et vice versa.</p></li>
</ul>
<p>En bref, <strong>des langues différentes nécessitent des analyseurs différents</strong>. Essayer de traiter un texte chinois avec un analyseur anglais conduit à l'échec : il n'y a pas d'espaces à diviser, et les règles de troncature anglaises peuvent corrompre les caractères chinois.</p>
<p>Conclusion ? S'appuyer sur un seul tokenizer et un seul analyseur pour les ensembles de données multilingues rend presque impossible une tokenisation cohérente et de haute qualité dans toutes les langues. Cela entraîne directement une dégradation des performances de recherche.</p>
<p>Lorsque les équipes ont commencé à adopter la recherche en texte intégral dans Milvus 2.5, nous avons commencé à entendre les mêmes commentaires :</p>
<p><em>"C'est parfait pour nos recherches en anglais, mais qu'en est-il de nos tickets d'assistance client multilingues ?" "Nous aimons avoir à la fois la recherche vectorielle et la recherche BM25, mais notre ensemble de données comprend du contenu en chinois, en japonais et en anglais. "Pouvons-nous obtenir la même précision de recherche dans toutes nos langues ?</em></p>
<p>Ces questions ont confirmé ce que nous avions déjà constaté dans la pratique : la recherche en texte intégral diffère fondamentalement de la recherche vectorielle. La similarité sémantique fonctionne bien d'une langue à l'autre, mais une recherche textuelle précise nécessite une compréhension approfondie de la structure de chaque langue.</p>
<p>C'est pourquoi <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduit un pipeline d'analyse de texte entièrement remanié avec une prise en charge multilingue complète. Ce nouveau système applique automatiquement l'analyseur approprié à chaque langue, ce qui permet une recherche plein texte précise et évolutive dans des ensembles de données multilingues, sans configuration manuelle ni compromis sur la qualité.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Comment Milvus 2.6 permet une recherche plein texte multilingue robuste<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Après des recherches et un développement approfondis, nous avons mis au point une série de fonctionnalités qui répondent à différents scénarios multilingues. Chaque approche résout le problème de la dépendance linguistique à sa manière.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Analyseur multilingue : La précision par le contrôle</h3><p>L'<a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>analyseur multilingue</strong></a> vous permet de définir différentes règles de traitement de texte pour différentes langues au sein d'une même collection, au lieu de forcer toutes les langues à passer par le même pipeline d'analyse.</p>
<p><strong>Voici comment cela fonctionne :</strong> vous configurez des analyseurs spécifiques à chaque langue et marquez chaque document avec sa langue lors de l'insertion. Lorsque vous effectuez une recherche BM25, vous spécifiez l'analyseur de langue à utiliser pour le traitement de la requête. Cela garantit que le contenu indexé et les requêtes de recherche sont traités avec les règles optimales pour leurs langues respectives.</p>
<p><strong>Parfait pour :</strong> Les applications pour lesquelles vous connaissez la langue de votre contenu et souhaitez une précision de recherche maximale. Pensez aux bases de connaissances multinationales, aux catalogues de produits localisés ou aux systèmes de gestion de contenu spécifiques à une région.</p>
<p><strong>L'exigence :</strong> Vous devez fournir des métadonnées linguistiques pour chaque document. Actuellement, cette fonctionnalité n'est disponible que pour les opérations de recherche BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Identificateur de langue Tokenizer : Détection automatique de la langue</h3><p>Nous savons qu'il n'est pas toujours pratique d'étiqueter manuellement chaque élément de contenu. Le <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a> apporte la détection automatique de la langue directement dans le pipeline d'analyse de texte.</p>
<p><strong>Voici comment il fonctionne :</strong> Ce tokenizer intelligent analyse le texte entrant, détecte sa langue à l'aide d'algorithmes de détection sophistiqués et applique automatiquement les règles de traitement spécifiques à la langue. Vous le configurez avec plusieurs définitions d'analyseur - une pour chaque langue que vous souhaitez prendre en charge, plus un analyseur de repli par défaut.</p>
<p>Nous prenons en charge deux moteurs de détection : <code translate="no">whatlang</code> pour un traitement plus rapide et <code translate="no">lingua</code> pour une plus grande précision. Le système prend en charge 71 à 75 langues, en fonction du détecteur choisi. Lors de l'indexation et de la recherche, le tokenizer sélectionne automatiquement l'analyseur approprié en fonction de la langue détectée, en revenant à votre configuration par défaut lorsque la détection est incertaine.</p>
<p><strong>Parfait pour :</strong> Les environnements dynamiques avec des mélanges de langues imprévisibles, les plateformes de contenu généré par l'utilisateur ou les applications où le marquage manuel de la langue n'est pas possible.</p>
<p><strong>Le compromis :</strong> la détection automatique ajoute une latence de traitement et peut s'avérer difficile avec des textes très courts ou des contenus multilingues. Mais pour la plupart des applications réelles, le côté pratique l'emporte largement sur ces limitations.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU Tokenizer : Fondation universelle</h3><p>Si les deux premières options vous semblent excessives, nous avons quelque chose de plus simple pour vous. Nous avons récemment intégré le<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> tokenizer ICU (International Components for Unicode)</a> dans Milvus 2.6. ICU existe depuis toujours - c'est un ensemble de bibliothèques mature et largement utilisé qui gère le traitement de texte pour des tonnes de langues et d'écritures. Ce qui est génial, c'est qu'il peut traiter des langages simples et complexes à la fois.</p>
<p>Le tokenizer ICU est honnêtement un excellent choix par défaut. Il utilise les règles Unicode pour découper les mots, ce qui le rend fiable pour des douzaines de langues qui n'ont pas leurs propres tokenizers spécialisés. Si vous avez juste besoin de quelque chose de puissant et d'universel qui fonctionne bien dans plusieurs langues, ICU fait l'affaire.</p>
<p><strong>Limitation :</strong> ICU fonctionne toujours au sein d'un seul analyseur, de sorte que toutes vos langues finissent par partager les mêmes filtres. Vous voulez faire des choses spécifiques à une langue comme le stemming ou la lemmatisation ? Vous rencontrerez les mêmes problèmes que ceux évoqués précédemment.</p>
<p><strong>Les points forts de l'ICU :</strong> Nous avons conçu ICU pour qu'il fonctionne comme analyseur par défaut dans les configurations multi-langues ou avec identifiant de langue. C'est en fait votre filet de sécurité intelligent pour gérer les langues que vous n'avez pas explicitement configurées.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Voyez-le en action : Démonstration pratique<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Assez de théorie - plongeons dans le code ! Voici comment utiliser les nouvelles fonctionnalités multilingues de <strong>pymilvus</strong> pour créer une collection de recherche multilingue.</p>
<p>Nous commencerons par définir des configurations d'analyseur réutilisables, puis nous passerons en revue <strong>deux exemples complets</strong>:</p>
<ul>
<li><p>Utilisation de l'<strong>analyseur multilingue</strong></p></li>
<li><p>Utilisation du <strong>tokenizer d'identifiant de langue</strong></p></li>
</ul>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Étape 1 : configuration du client Milvus</h3><p><em>Tout d'abord, nous nous connectons à Milvus, définissons un nom de collection et nettoyons toutes les collections existantes pour repartir à zéro.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Étape 2 : Définition d'analyseurs pour plusieurs langues</h3><p>Ensuite, nous définissons un dictionnaire <code translate="no">analyzers</code> avec des configurations spécifiques à chaque langue. Celles-ci seront utilisées dans les deux méthodes de recherche multilingue présentées plus loin.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Option A : Utilisation de l'analyseur multilingue</h3><p>Cette approche est optimale lorsque vous <strong>connaissez à l'avance la langue de chaque document</strong>. Lors de l'insertion des données, cette information sera transmise dans un champ dédié ( <code translate="no">language</code> ).</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Création d'une collection avec l'analyseur multilingue</h4><p>Nous allons créer une collection dans laquelle le champ <code translate="no">&quot;text&quot;</code> utilise différents analyseurs en fonction de la valeur du champ <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Insérer des données multilingues et charger la collection</h4><p>Insérez maintenant des documents en anglais et en japonais. Le champ <code translate="no">language</code> indique à Milvus l'analyseur à utiliser.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Exécuter une recherche plein texte</h4><p>Pour effectuer une recherche, spécifiez l'analyseur à utiliser pour la requête en fonction de sa langue.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Résultats :</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Option B : Utilisation du tokenizer de l'identificateur de langue</h3><p>Cette approche vous décharge de la gestion manuelle de la langue. Le <strong>tokenizer d'identification de la</strong> langue détecte automatiquement la langue de chaque document et applique l'analyseur approprié, sans qu'il soit nécessaire de spécifier un champ <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Création d'une collection avec Language Identifier Tokenizer</h4><p>Ici, nous créons une collection dans laquelle le champ <code translate="no">&quot;text&quot;</code> utilise la détection automatique de la langue pour choisir l'analyseur approprié.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Insérer des données et charger une collection</h4><p>Insérez du texte dans différentes langues, sans avoir à les étiqueter. Milvus détecte et applique automatiquement l'analyseur correct.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Exécution d'une recherche plein texte</h4><p>Voici la meilleure partie : <strong>il n'est pas nécessaire de spécifier un analyseur</strong> lors de la recherche. Le tokenizer détecte automatiquement la langue de la requête et applique la logique appropriée.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Résultats</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 fait un grand pas en avant pour rendre la <strong>recherche hybride</strong> plus puissante et plus accessible, en combinant la recherche vectorielle et la recherche par mot-clé, désormais dans plusieurs langues. Grâce à la prise en charge multilingue améliorée, vous pouvez créer des applications qui comprennent <em>ce que les utilisateurs veulent dire</em> et <em>ce qu'ils disent</em>, quelle que soit la langue qu'ils utilisent.</p>
<p>Mais ce n'est qu'une partie de la mise à jour. Milvus 2.6 apporte également plusieurs autres fonctionnalités qui rendent la recherche plus rapide, plus intelligente et plus facile à utiliser :</p>
<ul>
<li><p><strong>Meilleure correspondance des requêtes</strong> - Utilisez <code translate="no">phrase_match</code> et <code translate="no">multi_match</code> pour des recherches plus précises.</p></li>
<li><p><strong>Filtrage JSON plus rapide</strong> - Grâce à un nouvel index dédié aux champs JSON</p></li>
<li><p><strong>Tri basé sur les valeurs scalaires</strong> - Triez les résultats en fonction de n'importe quel champ numérique.</p></li>
<li><p><strong>Reranking avancé</strong> - Réorganisez les résultats à l'aide de modèles ou d'une logique de notation personnalisée.</p></li>
</ul>
<p>Vous souhaitez une présentation complète de Milvus 2.6 ? Consultez notre dernier article : <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Présentation de Milvus 2.6 : Recherche vectorielle abordable à l'échelle du milliard</strong></a><strong>.</strong></p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
