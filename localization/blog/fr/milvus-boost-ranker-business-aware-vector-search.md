---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >-
  Comment utiliser Milvus Boost Ranker pour une recherche vectorielle adaptée
  aux entreprises ?
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Découvrez comment Milvus Boost Ranker vous permet de superposer des règles
  commerciales à la similarité vectorielle - favoriser les documents officiels,
  rétrograder le contenu périmé, ajouter de la diversité.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>La recherche vectorielle classe les résultats en fonction de la similarité d'intégration - plus les vecteurs sont proches, plus le résultat est élevé. Certains systèmes ajoutent un réarrangeur basé sur un modèle (BGE, Voyage, Cohere) pour améliorer l'ordre. Mais aucune de ces approches ne répond à une exigence fondamentale en matière de production : le <strong>contexte commercial est aussi important que la pertinence sémantique, voire plus.</strong></p>
<p>Un site de commerce électronique a besoin de faire apparaître en premier les produits en stock dans les magasins officiels. Une plateforme de contenu veut épingler les annonces récentes. Une base de connaissances d'entreprise a besoin de documents faisant autorité en tête de liste. Lorsque le classement repose uniquement sur la distance vectorielle, ces règles sont ignorées. Les résultats peuvent être pertinents, mais ils ne sont pas appropriés.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, introduit dans <a href="https://milvus.io/intro">Milvus</a> 2.6, résout ce problème. Il vous permet d'ajuster le classement des résultats de recherche à l'aide de règles de métadonnées - pas de reconstruction de l'index, pas de changement de modèle. Cet article explique comment il fonctionne, quand l'utiliser et comment le mettre en œuvre avec du code.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Qu'est-ce que Boost Ranker ?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker est une fonctionnalité légère de reclassement basée sur des règles dans Milvus 2.6.2</strong> qui ajuste les résultats de <a href="https://zilliz.com/learn/vector-similarity-search">recherche vectoriels</a> à l'aide de champs de métadonnées scalaires. Contrairement aux fonctions de reclassement basées sur des modèles qui font appel à des LLM externes ou à des services d'intégration, Boost Ranker fonctionne entièrement au sein de Milvus à l'aide de simples règles de filtrage et de pondération. Il n'y a pas de dépendances externes, le temps de latence est minime - il convient à une utilisation en temps réel.</p>
<p>Vous le configurez par l'intermédiaire de l'<a href="https://milvus.io/docs/manage-functions.md">API de fonction</a>. Une fois que la recherche vectorielle renvoie un ensemble de candidats, Boost Ranker applique trois opérations :</p>
<ol>
<li><strong>Filtre :</strong> identifier les résultats correspondant à des conditions spécifiques (par exemple, <code translate="no">is_official == true</code>).</li>
<li><strong>Boost :</strong> multiplie leurs scores par un poids configuré</li>
<li><strong>Shuffle :</strong> ajoute optionnellement un petit facteur aléatoire (0-1) pour introduire de la diversité.</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Fonctionnement sous le capot</h3><p>Boost Ranker s'exécute dans Milvus en tant qu'étape de post-traitement :</p>
<ol>
<li><strong>Recherche vectorielle</strong> - chaque segment renvoie des candidats avec des ID, des scores de similarité et des métadonnées.</li>
<li><strong>Appliquer des règles</strong> - le système filtre les enregistrements correspondants et ajuste leurs scores en utilisant le poids configuré et l'option <code translate="no">random_score</code>.</li>
<li><strong>Fusionner et trier</strong> - tous les candidats sont combinés et re-triés en fonction des scores mis à jour pour produire les résultats Top-K finaux.</li>
</ol>
<p>Boost Ranker n'opérant que sur les candidats déjà récupérés - et non sur l'ensemble de la base de données - le coût de calcul supplémentaire est négligeable.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Quand utiliser Boost Ranker ?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Booster des résultats importants</h3><p>Le cas d'utilisation le plus courant : superposer des règles commerciales simples à la recherche sémantique.</p>
<ul>
<li><strong>E-commerce :</strong> booster les produits des magasins phares, des vendeurs officiels ou des promotions payantes. Les articles dont les ventes récentes ou les taux de clics sont élevés sont favorisés.</li>
<li><strong>Plateformes de contenu :</strong> donnez la priorité au contenu récemment publié via un champ <code translate="no">publish_time</code>, ou stimulez les messages provenant de comptes vérifiés.</li>
<li><strong>Recherche d'entreprise :</strong> donnez une priorité plus élevée aux documents contenant les champs <code translate="no">doctype == &quot;policy&quot;</code> ou <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Tout cela est configurable à l'aide d'un filtre et d'un poids. Pas de changement de modèle d'intégration, pas de reconstruction d'index.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Rétrograder sans supprimer</h3><p>Boost Ranker peut également abaisser le classement de certains résultats - une alternative plus douce au filtrage strict.</p>
<ul>
<li><strong>Produits à faible stock :</strong> si <code translate="no">stock &lt; 10</code>, réduire légèrement leur poids. Ils seront toujours trouvables, mais ne domineront pas les premières positions.</li>
<li><strong>Contenu sensible :</strong> réduisez le poids du contenu signalé au lieu de le supprimer complètement. Cela permet de limiter l'exposition sans censure stricte.</li>
<li><strong>Documents périmés : les</strong> documents dont l'adresse est <code translate="no">year &lt; 2020</code> sont moins bien classés, de sorte que les contenus plus récents apparaissent en premier.</li>
</ul>
<p>Les utilisateurs peuvent toujours trouver des résultats rétrogradés en faisant défiler la page ou en effectuant une recherche plus précise, mais ils n'évinceront pas les contenus plus pertinents.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Ajouter de la diversité grâce au hasard contrôlé</h3><p>Lorsque de nombreux résultats ont des scores similaires, le Top-K peut sembler identique d'une requête à l'autre. Le paramètre <code translate="no">random_score</code> de Boost Ranker introduit une légère variation :</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>Le paramètre  de Boost Ranker introduit une légère variation : : contrôle le caractère aléatoire global pour la reproductibilité</li>
<li><code translate="no">field</code>Le paramètre "clé primaire" <code translate="no">id</code> permet de s'assurer que le même enregistrement reçoit la même valeur aléatoire à chaque fois.</li>
</ul>
<p>Ceci est utile pour <strong>diversifier les recommandations</strong> (éviter que les mêmes éléments apparaissent toujours en premier) et pour l'<strong>exploration</strong> (combiner des poids commerciaux fixes avec de petites perturbations aléatoires).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Combinaison de Boost Ranker avec d'autres classeurs</h3><p>Boost Ranker est paramétré via l'API Function à l'adresse <code translate="no">params.reranker = &quot;boost&quot;</code>. Deux choses à savoir pour le combiner :</p>
<ul>
<li><strong>Limitation :</strong> dans la recherche hybride (multi-vectorielle), Boost Ranker ne peut pas être le ranker de premier niveau. Mais il peut être utilisé à l'intérieur de chaque <code translate="no">AnnSearchRequest</code> pour ajuster les résultats avant qu'ils ne soient fusionnés.</li>
<li><strong>Combinaisons courantes :</strong><ul>
<li><strong>RRF + Boost :</strong> utiliser RRF pour fusionner les résultats multimodaux, puis appliquer Boost pour un réglage fin basé sur les métadonnées.</li>
<li><strong>Model ranker + Boost :</strong> utiliser un ranker basé sur un modèle pour la qualité sémantique, puis Boost pour les règles métier.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Comment configurer Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker est configuré via l'API Function. Pour une logique plus complexe, combinez-le avec <code translate="no">FunctionScore</code> pour appliquer plusieurs règles ensemble.</p>
<h3 id="Required-Fields" class="common-anchor-header">Champs obligatoires</h3><p>Lors de la création d'un objet <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: n'importe quel nom personnalisé</li>
<li><code translate="no">input_field_names</code>: doit être une liste vide <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: doit être une liste vide <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: doit être <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Paramètres clés</h3><p><strong><code translate="no">params.weight</code> (obligatoire)</strong></p>
<p>Le multiplicateur appliqué aux scores des enregistrements correspondants. La façon dont vous le définissez dépend de la métrique :</p>
<table>
<thead>
<tr><th>Type de métrique</th><th>Pour améliorer les résultats</th><th>Pour rétrograder les résultats</th></tr>
</thead>
<tbody>
<tr><td>Plus c'est élevé, mieux c'est (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Plus bas, c'est mieux (L2/Euclidean)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (optionnel)</strong></p>
<p>Une condition qui sélectionne les enregistrements dont les scores sont ajustés :</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Seuls les enregistrements correspondants sont affectés. Tous les autres enregistrements conservent leur score initial.</p>
<p><strong><code translate="no">params.random_score</code> (facultatif)</strong></p>
<p>Ajoute une valeur aléatoire entre 0 et 1 pour la diversité. Voir la section sur le caractère aléatoire ci-dessus pour plus de détails.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Règles simples ou multiples</h3><p><strong>Règle unique</strong> - lorsque vous avez une contrainte métier (par exemple, booster les documents officiels), passez le classificateur directement à <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Règles multiples</strong> - lorsque vous avez besoin de plusieurs contraintes (donner la priorité aux articles en stock + rétrograder les produits mal notés + ajouter du hasard), créez plusieurs objets <code translate="no">Function</code> et combinez-les avec <code translate="no">FunctionScore</code>. Vous configurez :</p>
<ul>
<li><code translate="no">boost_mode</code>: comment chaque règle se combine avec le score original (<code translate="no">multiply</code> ou <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>la façon dont plusieurs règles se combinent entre elles (<code translate="no">multiply</code> ou <code translate="no">add</code>).</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Travaux pratiques : hiérarchisation des documents officiels<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Prenons un exemple concret : faire en sorte que les documents officiels soient mieux classés dans un système de recherche documentaire.</p>
<h3 id="Schema" class="common-anchor-header">Schéma</h3><p>Une collection appelée <code translate="no">milvus_collection</code> avec les champs suivants :</p>
<table>
<thead>
<tr><th>Champ</th><th>Type de champ</th><th>Objet</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Clé primaire</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Texte du document</td></tr>
<tr><td><code translate="no">embedding</code></td><td>VECTEUR_FLOTTANT (3072)</td><td>Vecteur sémantique</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Origine : &quot;official&quot;, &quot;community&quot;, ou &quot;ticket&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> si <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Les champs <code translate="no">source</code> et <code translate="no">is_official</code> sont les métadonnées que Boost Ranker utilisera pour ajuster les classements.</p>
<h3 id="Setup-Code" class="common-anchor-header">Code de configuration</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Comparaison des résultats : Avec et sans Boost Ranker</h3><p>Tout d'abord, lancez une recherche de base sans Boost Ranker. Ensuite, ajoutez Boost Ranker avec <code translate="no">filter: is_official == true</code> et <code translate="no">weight: 1.2</code>, et comparez.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Résultats</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>Le principal changement : le document <code translate="no">id=2</code> (officiel) est passé de la 4e à la 2e place car son score a été multiplié par 1,2. Les messages de la communauté et les enregistrements de tickets ne sont pas supprimés - ils sont simplement moins bien classés. C'est l'intérêt de Boost Ranker : garder la recherche sémantique comme base, puis superposer des règles métier.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> vous permet d'injecter une logique métier dans les résultats de recherche vectorielle sans toucher à vos embeddings ni reconstruire vos index. Boostez le contenu officiel, rétrogradez les résultats périmés, ajoutez une diversité contrôlée - tout cela par le biais d'une simple configuration de filtre + poids dans l'<a href="https://milvus.io/docs/manage-functions.md">API de fonction Milvus</a>.</p>
<p>Que vous construisiez des pipelines RAG, des systèmes de recommandation ou des recherches d'entreprise, Boost Ranker aide à combler le fossé entre ce qui est sémantiquement similaire et ce qui est réellement utile à vos utilisateurs.</p>
<p>Si vous travaillez sur le classement des recherches et souhaitez discuter de votre cas d'utilisation :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> pour vous connecter avec d'autres développeurs construisant des systèmes de recherche et d'extraction.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite de 20 minutes de Milvus Office Hours</a> pour examiner votre logique de classement avec l'équipe.</li>
<li>Si vous préférez sauter l'étape de l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour démarrer.</li>
</ul>
<hr>
<p>Quelques questions se posent lorsque les équipes commencent à utiliser Boost Ranker :</p>
<p><strong>Boost Ranker peut-il remplacer un reranker basé sur un modèle comme Cohere ou BGE ?</strong>Ils résolvent des problèmes différents. Les rerankers basés sur des modèles recalculent les résultats en fonction de la qualité sémantique - ils sont bons pour décider "quel document répond réellement à la question". Boost Ranker ajuste les scores en fonction des règles de gestion - il décide "quel document pertinent doit apparaître en premier". Dans la pratique, vous souhaitez souvent les deux : un modèle de classement pour la pertinence sémantique, puis Boost Ranker pour la logique métier.</p>
<p><strong>Boost Ranker ajoute-t-il un temps de latence significatif ?</strong>Non. Il opère sur l'ensemble des candidats déjà récupérés (typiquement le Top-K de la recherche vectorielle), et non sur l'ensemble des données. Les opérations sont de simples filtres et multiplications, de sorte que la surcharge est négligeable par rapport à la recherche vectorielle elle-même.</p>
<p><strong>Comment définir la valeur de la pondération ?</strong>Commencez par de petits ajustements. Pour la similarité COSINE (plus elle est élevée, mieux c'est), une pondération de 1,1 à 1,3 est généralement suffisante pour modifier sensiblement les classements sans annuler totalement la pertinence sémantique. Testez avec vos données réelles - si les résultats boostés avec une faible similarité commencent à dominer, diminuez le poids.</p>
<p><strong>Puis-je combiner plusieurs règles Boost Ranker ?</strong>Oui. Créez plusieurs objets <code translate="no">Function</code> et combinez-les à l'aide de <code translate="no">FunctionScore</code>. Vous contrôlez l'interaction des règles via <code translate="no">boost_mode</code> (comment chaque règle se combine avec le score original) et <code translate="no">function_mode</code> (comment les règles se combinent entre elles) - les deux supportent <code translate="no">multiply</code> et <code translate="no">add</code>.</p>
