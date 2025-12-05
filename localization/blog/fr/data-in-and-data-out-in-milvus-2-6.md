---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Introduction de la fonction d'intégration : Comment Milvus 2.6 rationalise la
  vectorisation et la recherche sémantique
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Découvrez comment Milvus 2.6 simplifie le processus d'intégration et la
  recherche vectorielle avec Data-in, Data-out. Gestion automatique de
  l'intégration et du reranking - aucun prétraitement externe n'est nécessaire.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Si vous avez déjà construit une application de recherche vectorielle, vous connaissez déjà un peu trop bien le flux de travail. Avant de pouvoir être stockées, les données doivent d'abord être transformées en vecteurs à l'aide d'un modèle d'incorporation, puis nettoyées et formatées, avant d'être finalement intégrées dans votre base de données vectorielles. Chaque requête suit le même processus : incorporation de l'entrée, recherche de similarité, puis mise en correspondance des identifiants résultants avec les documents ou enregistrements d'origine. Cela fonctionne, mais crée un enchevêtrement distribué de scripts de prétraitement, de pipelines d'intégration et de code de collage dont vous devez assurer la maintenance.</p>
<p><a href="https://milvus.io/">Milvus</a>, une base de données vectorielles open-source haute performance, fait désormais un grand pas en avant pour simplifier tout cela. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduit la <strong>fonction Data-in, Data-out (également connue sous le nom de</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>fonction d'intégration</strong></a><strong>)</strong>, une capacité d'intégration intégrée qui se connecte directement aux principaux fournisseurs de modèles tels que OpenAI, AWS Bedrock, Google Vertex AI et Hugging Face. Au lieu de gérer votre propre infrastructure d'intégration, Milvus peut désormais appeler ces modèles pour vous. Vous pouvez également insérer et interroger à l'aide de texte brut - et bientôt d'autres types de données - tandis que Milvus gère automatiquement la vectorisation au moment de l'écriture et de l'interrogation.</p>
<p>Dans la suite de ce billet, nous examinerons de plus près le fonctionnement de Data-in, Data-out, comment configurer les fournisseurs et les fonctions d'intégration, et comment vous pouvez l'utiliser pour rationaliser vos flux de recherche vectorielle de bout en bout.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">Qu'est-ce que Data-in, Data-out ?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out dans Milvus 2.6 est construit sur le nouveau module Function - un cadre qui permet à Milvus de gérer la transformation des données et la génération d'intégration en interne, sans services de prétraitement externes. (Avec ce module, Milvus peut prendre des données d'entrée brutes, appeler directement un fournisseur d'intégration et écrire automatiquement les vecteurs résultants dans votre collection.</p>
<p>À un niveau élevé, le module <strong>Function</strong> transforme la génération d'intégration en une capacité de base de données native. Au lieu d'exécuter des pipelines d'intégration distincts, des travailleurs en arrière-plan ou des services de reranker, Milvus envoie désormais des demandes à votre fournisseur configuré, récupère les intégrations et les stocke avec vos données, le tout dans le chemin d'ingestion. Cela supprime la charge opérationnelle liée à la gestion de votre propre infrastructure d'intégration.</p>
<p>Data-in, Data-out apporte trois améliorations majeures au flux de travail Milvus :</p>
<ul>
<li><p><strong>Insérer directement des données brutes</strong> - Vous pouvez désormais insérer du texte, des images ou d'autres types de données non traités directement dans Milvus. Il n'est pas nécessaire de les convertir en vecteurs au préalable.</p></li>
<li><p><strong>Configurer une fonction d'incorporation</strong> - Une fois que vous avez configuré un modèle d'incorporation dans Milvus, celui-ci gère automatiquement l'ensemble du processus d'incorporation. Milvus s'intègre de manière transparente à une série de fournisseurs de modèles, notamment OpenAI, AWS Bedrock, Google Vertex AI, Cohere et Hugging Face.</p></li>
<li><p><strong>Requête avec des entrées brutes</strong> - Vous pouvez désormais effectuer une recherche sémantique à l'aide de texte brut ou d'autres requêtes basées sur le contenu. Milvus utilise le même modèle configuré pour générer des enchâssements à la volée, effectuer une recherche de similarité et renvoyer des résultats pertinents.</p></li>
</ul>
<p>En bref, Milvus incorpore désormais automatiquement vos données - et les réorganise éventuellement. La vectorisation devient une fonction intégrée de la base de données, ce qui élimine le besoin de services d'intégration externes ou de logique de prétraitement personnalisée.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Fonctionnement de Data-in, Data-out<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Le diagramme ci-dessous illustre le fonctionnement de Data-in, Data-out dans Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le flux de travail Data-in, Data-out peut être décomposé en six étapes principales :</p>
<ol>
<li><p><strong>Données d'entrée</strong> - L'utilisateur insère des données brutes - telles que du texte, des images ou d'autres types de contenu - directement dans Milvus sans effectuer de prétraitement externe.</p></li>
<li><p><strong>Générer des embeddings</strong> - Le module Function invoque automatiquement le modèle d'embedding configuré via son API tierce, convertissant l'entrée brute en embeddings vectoriels en temps réel.</p></li>
<li><p><strong>Stockage des embeddings</strong> - Milvus écrit les embeddings générés dans le champ vectoriel désigné dans votre collection, où ils deviennent disponibles pour les opérations de recherche de similarité.</p></li>
<li><p><strong>Soumettre une requête</strong> - L'utilisateur émet une requête en texte brut ou basée sur le contenu à Milvus, comme pour l'étape de saisie.</p></li>
<li><p><strong>Recherche sémantique</strong> - Milvus incorpore la requête à l'aide du même modèle configuré, exécute une recherche de similarité sur les vecteurs stockés et détermine les correspondances sémantiques les plus proches.</p></li>
<li><p><strong>Renvoi des résultats</strong> - Milvus renvoie les k résultats les plus similaires - mappés à leurs données d'origine - directement à l'application.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Comment configurer Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><ul>
<li><p>Installez la dernière version de <strong>Milvus 2.6</strong>.</p></li>
<li><p>Préparez votre clé API d'intégration à partir d'un fournisseur pris en charge (par exemple, OpenAI, AWS Bedrock ou Cohere). Dans cet exemple, nous utiliserons <strong>Cohere</strong> comme fournisseur d'intégration.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Modifier la configuration de <code translate="no">milvus.yaml</code> </h3><p>Si vous exécutez Milvus avec <strong>Docker Compose</strong>, vous devrez modifier le fichier <code translate="no">milvus.yaml</code> pour activer le module Function. Vous pouvez vous référer à la documentation officielle pour obtenir des conseils : <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configure Milvus with Docker Compose</a> (Des instructions pour d'autres méthodes de déploiement peuvent également être trouvées ici).</p>
<p>Dans le fichier de configuration, localisez les sections <code translate="no">credential</code> et <code translate="no">function</code>.</p>
<p>Ensuite, mettez à jour les champs <code translate="no">apikey1.apikey</code> et <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Une fois ces modifications effectuées, redémarrez Milvus pour appliquer la configuration mise à jour.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Utilisation de la fonctionnalité Data-in, Data-out<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Définir le schéma de la collection</h3><p>Pour activer la fonctionnalité d'intégration, le <strong>schéma de</strong> votre <strong>collection</strong> doit comprendre au moins trois champs :</p>
<ul>
<li><p><strong>Champ de clé primaire (</strong><code translate="no">id</code> ) - Identifie de manière unique chaque entité de la collection.</p></li>
<li><p><strong>Champ scalaire (</strong><code translate="no">document</code> ) - Stocke les données brutes originales.</p></li>
<li><p><strong>Champ vectoriel (</strong><code translate="no">dense</code> ) - Stocke les intégrations vectorielles générées.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Définir la fonction d'intégration</h3><p>Définissez ensuite la <strong>fonction d'intégration</strong> dans le schéma.</p>
<ul>
<li><p><code translate="no">name</code> - Un identifiant unique pour la fonction.</p></li>
<li><p><code translate="no">function_type</code> - Défini à <code translate="no">FunctionType.TEXTEMBEDDING</code> pour les incorporations de texte. Milvus prend également en charge d'autres types de fonction tels que <code translate="no">FunctionType.BM25</code> et <code translate="no">FunctionType.RERANK</code>. Voir <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Recherche plein texte</a> et <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Aperçu du classificateur de décroissance</a> pour plus de détails.</p></li>
<li><p><code translate="no">input_field_names</code> - Définit le champ d'entrée pour les données brutes (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Définit le champ de sortie où les encastrements vectoriels seront stockés (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Contient les paramètres de configuration de la fonction d'intégration. Les valeurs de <code translate="no">provider</code> et <code translate="no">model_name</code> doivent correspondre aux entrées correspondantes de votre fichier de configuration <code translate="no">milvus.yaml</code>.</p></li>
</ul>
<p><strong>Remarque :</strong> chaque fonction doit avoir un <code translate="no">name</code> et un <code translate="no">output_field_names</code> uniques afin de distinguer les différentes logiques de transformation et d'éviter les conflits.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Configurer l'index</h3><p>Une fois les champs et les fonctions définis, créez un index pour la collection. Pour des raisons de simplicité, nous utilisons ici le type AUTOINDEX à titre d'exemple.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Création de la collection</h3><p>Utilisez le schéma et l'index définis pour créer une nouvelle collection. Dans cet exemple, nous allons créer une collection nommée Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Insérer des données</h3><p>Vous pouvez maintenant insérer des données brutes directement dans Milvus - il n'est pas nécessaire de générer des embeddings manuellement.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Effectuer une recherche vectorielle</h3><p>Après avoir inséré des données, vous pouvez effectuer des recherches directement à l'aide de requêtes de texte brut. Milvus convertit automatiquement votre requête en un embedding, effectue une recherche de similarité par rapport aux vecteurs stockés et renvoie les meilleures correspondances.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pour plus de détails sur la recherche vectorielle, voir : <a href="https://milvus.io/docs/single-vector-search.md">Recherche vectorielle de base </a>et <a href="https://milvus.io/docs/get-and-scalar-query.md">API de requête</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Démarrer avec Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec Data-in, Data-out, Milvus 2.6 fait passer la simplicité de la recherche vectorielle au niveau supérieur. En intégrant les fonctions d'intégration et de reclassement directement dans Milvus, vous n'avez plus besoin de gérer un prétraitement externe ou de maintenir des services d'intégration distincts.</p>
<p>Prêt à l'essayer ? Installez <a href="https://milvus.io/docs">Milvus</a> 2.6 dès aujourd'hui et découvrez par vous-même la puissance de Data-in, Data-out.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">En savoir plus sur les fonctionnalités de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : Recherche vectorielle abordable à l'échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Déchiquetage JSON dans Milvus : filtrage JSON 88,9 fois plus rapide et flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Déverrouiller la véritable recherche au niveau de l'entité : Nouvelles fonctionnalités Array-of-Structs et MAX_SIM dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données de formation LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans tuer le rappel ? </a></p></li>
</ul>
