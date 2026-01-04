---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Phrase Match with Slop in Milvus 2.6 : Comment améliorer la précision de la
  recherche plein texte au niveau de la phrase ?
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
  Découvrez comment Phrase Match dans Milvus 2.6 prend en charge la recherche
  plein texte au niveau de la phrase avec une marge de manœuvre, permettant un
  filtrage de mots clés plus tolérant pour la production dans le monde réel.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>Alors que les données non structurées continuent d'exploser et que les modèles d'IA deviennent de plus en plus intelligents, la recherche vectorielle est devenue la couche de recherche par défaut pour de nombreux systèmes d'IA - pipelines RAG, recherche d'IA, agents, moteurs de recommandation, etc. Elle fonctionne parce qu'elle capture le sens : non seulement les mots tapés par les utilisateurs, mais aussi l'intention qui les sous-tend.</p>
<p>Cependant, une fois que ces applications sont mises en production, les équipes découvrent souvent que la compréhension sémantique n'est qu'un aspect du problème de recherche. De nombreuses charges de travail dépendent également de règles textuelles strictes, telles que la correspondance avec une terminologie exacte, la préservation de l'ordre des mots ou l'identification de phrases ayant une signification technique, juridique ou opérationnelle.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> supprime ce clivage en introduisant la recherche plein texte native directement dans la base de données vectorielle. Grâce aux index de jetons et de positions intégrés au moteur principal, Milvus peut interpréter l'intention sémantique d'une requête tout en appliquant des contraintes précises au niveau des mots clés et des phrases. Il en résulte un pipeline de recherche unifié dans lequel le sens et la structure se renforcent mutuellement plutôt que de vivre dans des systèmes distincts.</p>
<p>La<a href="https://milvus.io/docs/phrase-match.md">correspondance des phrases</a> est un élément clé de cette capacité de recherche en texte intégral. Elle identifie les séquences de termes qui apparaissent ensemble et dans l'ordre, ce qui est essentiel pour détecter les modèles de journaux, les signatures d'erreurs, les noms de produits et tout texte dans lequel l'ordre des mots définit la signification. Dans ce billet, nous expliquerons comment <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> fonctionne dans <a href="https://milvus.io/">Milvus</a>, comment <code translate="no">slop</code> ajoute la flexibilité nécessaire au texte du monde réel et pourquoi ces fonctionnalités rendent la recherche vectorielle hybride en texte intégral non seulement possible mais pratique au sein d'une base de données unique.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">Qu'est-ce que Phrase Match ?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>La correspondance de phrases est un type de requête en texte intégral dans Milvus qui se concentre sur la <em>structure, c'est-à-dire</em>sur la question de savoir si une séquence de mots apparaît dans le même ordre à l'intérieur d'un document. Lorsqu'aucune flexibilité n'est autorisée, la requête se comporte de manière stricte : les termes doivent apparaître l'un à côté de l'autre et dans le même ordre. Une requête telle que <strong>"robotics machine learning"</strong> ne correspond donc que si ces trois mots apparaissent sous la forme d'une phrase continue.</p>
<p>La difficulté réside dans le fait que le texte réel se comporte rarement de manière aussi nette. Le langage naturel introduit du bruit : des adjectifs supplémentaires se glissent dans le texte, les journaux réorganisent les champs, les noms de produits s'enrichissent de modificateurs, et les auteurs humains n'écrivent pas en pensant aux moteurs de recherche. Une correspondance stricte entre les phrases se brise facilement - un mot inséré, une reformulation ou un terme interverti peut entraîner une erreur. Et dans de nombreux systèmes d'IA, en particulier ceux qui sont confrontés à la production, l'omission d'une ligne de journal pertinente ou d'une phrase déclenchant une règle n'est pas acceptable.</p>
<p>Milvus 2.6 résout ce problème à l'aide d'un mécanisme simple : la <strong>marge de manœuvre</strong>. Ce mécanisme définit la <em>marge de manœuvre autorisée entre les</em> termes de la <em>requête</em>. Au lieu de considérer une phrase comme fragile et inflexible, la marge de manœuvre vous permet de décider si un mot supplémentaire est tolérable, ou deux, ou même si une légère réorganisation doit toujours être considérée comme une correspondance. La recherche de phrases passe ainsi d'un test binaire de type "réussite/échec" à un outil de recherche contrôlé et adaptable.</p>
<p>Pour comprendre pourquoi cela est important, imaginez que vous recherchiez dans les journaux toutes les variantes de l'erreur de réseau familière <strong>"connexion réinitialisée par un pair".</strong> En pratique, vos journaux pourraient ressembler à ceci :</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>À première vue, tous ces éléments représentent le même événement sous-jacent. Mais les méthodes d'extraction courantes se heurtent à des difficultés :</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 se heurte à la structure.</h3><p>Il considère la requête comme un ensemble de mots-clés, sans tenir compte de l'ordre dans lequel ils apparaissent. Tant que les mots "connexion" et "pair" apparaissent quelque part, BM25 peut classer le document dans une catégorie élevée, même si l'expression est inversée ou sans rapport avec le concept que vous recherchez réellement.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">La recherche vectorielle se heurte à des contraintes.</h3><p>Les emboîtements sont excellents pour capturer le sens et les relations sémantiques, mais ils ne peuvent pas appliquer une règle telle que "ces mots doivent apparaître dans cette séquence". Vous pouvez retrouver des messages sémantiquement liés, mais ne pas trouver le modèle structurel exact requis pour le débogage ou la conformité.</p>
<p>La correspondance de phrases comble le fossé entre ces deux approches. En utilisant la <strong>marge</strong>, vous pouvez spécifier exactement le degré de variation acceptable :</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Correspondance exacte (tous les termes doivent apparaître de manière contiguë et dans l'ordre).</p></li>
<li><p><code translate="no">slop = 1</code> - Autoriser un mot supplémentaire (couvre les variations courantes en langue naturelle avec un seul terme inséré).</p></li>
<li><p><code translate="no">slop = 2</code> - Autoriser l'insertion de plusieurs mots (pour les formulations plus descriptives ou verbeuses).</p></li>
<li><p><code translate="no">slop = 3</code> - Autoriser la réorganisation (pour les phrases inversées ou mal ordonnées, ce qui est souvent le cas le plus difficile dans les textes du monde réel).</p></li>
</ul>
<p>Au lieu d'espérer que l'algorithme de notation "fasse bien les choses", vous déclarez explicitement la tolérance structurelle requise par votre application.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Fonctionnement de la correspondance des phrases dans Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Alimentée par la bibliothèque du moteur de recherche <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, la correspondance de phrases dans Milvus est mise en œuvre au-dessus d'un index inversé avec des informations de position. Au lieu de vérifier uniquement si les termes apparaissent dans un document, il vérifie qu'ils apparaissent dans le bon ordre et à une distance contrôlable.</p>
<p>Le diagramme ci-dessous illustre le processus :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokénisation du document (avec les positions)</strong></p>
<p>Lorsque des documents sont insérés dans Milvus, les champs de texte sont traités par un <a href="https://milvus.io/docs/analyzer-overview.md">analyseur</a> qui divise le texte en tokens (mots ou termes) et enregistre la position de chaque token dans le document. Par exemple, <code translate="no">doc_1</code> est transformé en tokens sous la forme suivante : : <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Création d'un index inversé</strong></p>
<p>Ensuite, Milvus crée un index inversé. Au lieu de mettre en correspondance les documents avec leur contenu, l'index inversé met en correspondance chaque mot-clé avec les documents dans lesquels il apparaît, ainsi qu'avec toutes les positions enregistrées de ce mot-clé dans chaque document.</p>
<p><strong>3. Correspondance des phrases</strong></p>
<p>Lorsqu'une requête de phrase est exécutée, Milvus utilise d'abord l'index inversé pour identifier les documents qui contiennent tous les mots-clés de la requête. Il valide ensuite chaque candidat en comparant les positions des jetons pour s'assurer que les termes apparaissent dans le bon ordre et dans la limite de la distance autorisée <code translate="no">slop</code>. Seuls les documents qui satisfont à ces deux conditions sont renvoyés en tant que correspondances.</p>
<p>Le diagramme ci-dessous résume le fonctionnement de la recherche de syntagmes de bout en bout.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Comment activer la comparaison de phrases dans Milvus ?<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>La concordance des phrases fonctionne sur les champs de type <strong><code translate="no">VARCHAR</code></strong>le type de chaîne dans Milvus. Pour l'utiliser, vous devez configurer votre schéma de collecte de manière à ce que Milvus effectue une analyse de texte et stocke les informations de position pour le champ. Pour ce faire, vous devez activer deux paramètres : <code translate="no">enable_analyzer</code> et <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Définir enable_analyzer et enable_match</h3><p>Pour activer la correspondance des phrases pour un champ VARCHAR spécifique, définissez les deux paramètres sur <code translate="no">True</code> lorsque vous définissez le schéma du champ. Ensemble, ils indiquent à Milvus de</p>
<ul>
<li><p><strong>tokeniser</strong> le texte (via <code translate="no">enable_analyzer</code>), et</p></li>
<li><p><strong>construire un index inversé avec des décalages positionnels</strong> (via <code translate="no">enable_match</code>).</p></li>
</ul>
<p>La correspondance de phrases repose sur ces deux étapes : l'analyseur décompose le texte en tokens et l'index de correspondance stocke l'emplacement de ces tokens, ce qui permet d'effectuer des requêtes efficaces basées sur les phrases et les mots-clés.</p>
<p>Vous trouverez ci-dessous un exemple de configuration de schéma qui active la comparaison de phrases sur un champ <code translate="no">text</code>:</p>
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
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Recherche avec correspondance de phrases : Comment la pente affecte l'ensemble de candidats<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que vous avez activé la correspondance pour une rubrique VARCHAR dans votre schéma de collection, vous pouvez effectuer des correspondances de phrases à l'aide de l'expression <code translate="no">PHRASE_MATCH</code>.</p>
<p>Remarque : l'expression <code translate="no">PHRASE_MATCH</code> ne tient pas compte des majuscules et des minuscules. Vous pouvez utiliser <code translate="no">PHRASE_MATCH</code> ou <code translate="no">phrase_match</code>.</p>
<p>Dans les opérations de recherche, la correspondance de phrases est généralement appliquée avant le classement par similarité vectorielle. Elle filtre d'abord les documents sur la base de contraintes textuelles explicites, réduisant ainsi l'ensemble des candidats. Les documents restants sont ensuite reclassés à l'aide de vecteurs intégrés.</p>
<p>L'exemple ci-dessous montre comment différentes valeurs de <code translate="no">slop</code> affectent ce processus. En ajustant le paramètre <code translate="no">slop</code>, vous contrôlez directement les documents qui passent le filtre de phrases et qui passent à l'étape du classement vectoriel.</p>
<p>Supposons que vous ayez une collection nommée <code translate="no">tech_articles</code> contenant les cinq entités suivantes :</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>texte</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>L'apprentissage automatique améliore l'efficacité de l'analyse des données à grande échelle</td></tr>
<tr><td>2</td><td>L'apprentissage d'une approche basée sur la machine est essentiel pour les progrès de l'IA moderne</td></tr>
<tr><td>3</td><td>Les architectures de machines d'apprentissage profond optimisent les charges de calcul</td></tr>
<tr><td>4</td><td>Les machines améliorent rapidement les performances des modèles pour un apprentissage continu</td></tr>
<tr><td>5</td><td>L'apprentissage d'algorithmes avancés de machine augmente les capacités de l'IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Le filtre est appliqué aux documents qui contiennent l'expression "machine d'apprentissage" avec une légère flexibilité.</p>
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
<p>Résultats de la recherche :</p>
<table>
<thead>
<tr><th>doc_id</th><th>texte</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>L'apprentissage d'une approche basée sur la machine est vital pour les progrès de l'IA moderne</td></tr>
<tr><td>3</td><td>Les architectures des machines d'apprentissage profond optimisent les charges de calcul</td></tr>
<tr><td>5</td><td>L'apprentissage d'algorithmes avancés augmente les capacités de l'IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>Cet exemple autorise une pente de 2, ce qui signifie que jusqu'à deux jetons supplémentaires (ou termes inversés) sont autorisés entre les mots "machine" et "apprentissage".</p>
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
<p>Résultats de la recherche :</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texte</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">L'apprentissage automatique renforce l'efficacité de l'analyse des données à grande échelle</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Les architectures de machines d'apprentissage profond optimisent les charges de calcul.</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>Dans cet exemple, une pente de 3 offre encore plus de flexibilité. Le filtre recherche "machine learning" avec un maximum de trois positions de jetons autorisées entre les mots.</p>
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
<p>Résultats de la recherche :</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texte</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">L'apprentissage automatique renforce l'efficacité de l'analyse des données à grande échelle</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">L'apprentissage d'une approche basée sur la machine est essentiel pour les progrès de l'IA moderne</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Les architectures de machines d'apprentissage profond optimisent les charges de calcul</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">L'apprentissage d'algorithmes avancés augmente les capacités de l'IA</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Conseils rapides : Ce qu'il faut savoir avant d'activer la correspondance des phrases dans Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match prend en charge le filtrage au niveau de la phrase, mais son activation implique plus qu'une configuration au moment de la requête. Il est utile de connaître les considérations associées avant de l'appliquer dans un environnement de production.</p>
<ul>
<li><p>L'activation de la correspondance de phrases sur un champ crée un index inversé, ce qui augmente l'utilisation de l'espace de stockage. Le coût exact dépend de facteurs tels que la longueur du texte, le nombre de jetons uniques et la configuration de l'analyseur. Lorsque l'on travaille avec des champs de texte volumineux ou des données à cardinalité élevée, il convient de prendre en compte ces frais généraux dès le départ.</p></li>
<li><p>La configuration de l'analyseur est un autre choix de conception essentiel. Une fois qu'un analyseur est défini dans le schéma de collecte, il ne peut plus être modifié. Pour passer ultérieurement à un autre analyseur, il faut abandonner la collection existante et la recréer avec un nouveau schéma. C'est pourquoi le choix d'un analyseur doit être considéré comme une décision à long terme plutôt que comme une expérience.</p></li>
<li><p>Le comportement de Phrase Match est étroitement lié à la façon dont le texte est tokenisé. Avant d'appliquer un analyseur à une collection entière, il est recommandé d'utiliser la méthode <code translate="no">run_analyzer</code> pour inspecter le résultat de la tokenisation et confirmer qu'il correspond à vos attentes. Cette étape peut permettre d'éviter des erreurs subtiles et des résultats de requête inattendus par la suite. Pour plus d'informations, reportez-vous à la section <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Vue d'ensemble des analyseurs</a>.</p></li>
</ul>
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
    </button></h2><p>La correspondance de phrases est un type de recherche plein texte de base qui permet des contraintes de niveau de phrase et de position au-delà de la simple correspondance de mots-clés. En opérant sur l'ordre et la proximité des jetons, elle fournit un moyen prévisible et précis de filtrer les documents sur la base de la manière dont les termes apparaissent réellement dans le texte.</p>
<p>Dans les systèmes de recherche modernes, la correspondance de phrases est généralement appliquée avant le classement vectoriel. Elle limite d'abord l'ensemble des candidats aux documents qui satisfont explicitement aux phrases ou structures requises. La recherche vectorielle est ensuite utilisée pour classer ces résultats en fonction de leur pertinence sémantique. Ce modèle est particulièrement efficace dans des scénarios tels que l'analyse de journaux, la recherche de documentation technique et les pipelines RAG, où les contraintes textuelles doivent être appliquées avant que la similarité sémantique ne soit prise en compte.</p>
<p>Avec l'introduction du paramètre <code translate="no">slop</code> dans Milvus 2.6, Phrase Match devient plus tolérant à la variation du langage naturel tout en conservant son rôle de mécanisme de filtrage plein texte. Cela rend les contraintes au niveau de la phrase plus faciles à appliquer dans les flux de travail de recherche de production.</p>
<p>👉 Essayez-le avec les scripts de <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">démonstration</a> et explorez <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> pour voir comment la recherche d'information basée sur les phrases s'intègre dans votre pile.</p>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
