---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Comment utiliser les données sur les chaînes de caractères pour améliorer vos
  applications de recherche par similarité ?
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Utilisez les données sur les chaînes de caractères pour rationaliser le
  processus de création de vos propres applications de recherche de similitudes.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Couverture</span> </span></p>
<p>Milvus 2.1 est accompagné de <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">quelques mises à jour significatives</a> qui rendent le travail avec Milvus beaucoup plus facile. L'une d'entre elles est la prise en charge du type de données chaîne. À l'heure actuelle, Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">prend en charge des types de données</a> tels que les chaînes, les vecteurs, les booléens, les entiers, les nombres à virgule flottante, etc.</p>
<p>Cet article présente une introduction à la prise en charge du type de données chaîne. Lisez et apprenez ce que vous pouvez faire avec et comment l'utiliser.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">Que pouvez-vous faire avec des données de type chaîne ?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Comment gérer les données de type chaîne dans Milvus 2.1 ?</a><ul>
<li><a href="#Create-a-collection">Créer une collection</a></li>
<li><a href="#Insert-data">Insérer et supprimer des données</a></li>
<li><a href="#Build-an-index">Construire un index</a></li>
<li><a href="#Hybrid-search">Recherche hybride</a></li>
<li><a href="#String-expressions">Expressions de chaînes</a></li>
</ul></li>
</ul>
<custom-h1>Que pouvez-vous faire avec des données de type chaîne ?</custom-h1><p>La prise en charge des données de type chaîne est l'une des fonctions les plus attendues par les utilisateurs. Elle rationalise le processus de création d'une application avec la base de données vectorielles Milvus et accélère la vitesse de la recherche de similarités et de la requête vectorielle, ce qui augmente considérablement l'efficacité et réduit le coût de maintenance de l'application sur laquelle vous travaillez, quelle qu'elle soit.</p>
<p>Plus précisément, Milvus 2.1 prend en charge le type de données VARCHAR, qui stocke des chaînes de caractères de longueur variable. Grâce à la prise en charge du type de données VARCHAR, vous pouvez :</p>
<ol>
<li>gérer directement les données de chaînes de caractères sans l'aide d'une base de données relationnelle externe.</li>
</ol>
<p>La prise en charge du type de données VARCHAR vous permet de sauter l'étape de conversion des chaînes de caractères en d'autres types de données lors de l'insertion de données dans Milvus. Supposons que vous travailliez sur un système de recherche de livres pour votre propre librairie en ligne. Vous créez un ensemble de données de livres et souhaitez identifier les livres avec leur nom. Alors que dans les versions précédentes, Milvus ne prend pas en charge le type de données chaîne, avant d'insérer des données dans Milvus, vous devrez peut-être d'abord transformer les chaînes (les noms des livres) en identifiants de livre à l'aide d'une base de données relationnelle telle que MySQL. Pour l'instant, comme le type de données chaîne est pris en charge, vous pouvez simplement créer un champ chaîne et saisir directement les noms des livres au lieu de leurs numéros d'identification.</p>
<p>Cette commodité s'applique également au processus de recherche et d'interrogation. Imaginez un client dont le livre préféré est <em>Hello Milvus</em>. Vous souhaitez rechercher dans le système des livres similaires et les recommander au client. Dans les versions précédentes de Milvus, le système ne vous renvoie que les identifiants des livres et vous devez prendre une mesure supplémentaire pour vérifier les informations correspondantes sur les livres dans une base de données relationnelle. Mais dans Milvus 2.1, vous pouvez obtenir directement les noms des livres car vous avez déjà créé un champ de chaîne contenant les noms des livres.</p>
<p>En un mot, la prise en charge du type de données chaîne vous évite de vous tourner vers d'autres outils pour gérer les données chaîne, ce qui simplifie grandement le processus de développement.</p>
<ol start="2">
<li>Accélérer la vitesse des <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">recherches hybrides</a> et des <a href="https://milvus.io/docs/v2.1.x/query.md">requêtes vectorielles</a> grâce au filtrage des attributs.</li>
</ol>
<p>Comme les autres types de données scalaires, VARCHAR peut être utilisé pour le filtrage d'attributs dans la recherche hybride et la requête vectorielle par le biais d'une expression booléenne. Il est particulièrement intéressant de mentionner que Milvus 2.1 ajoute l'opérateur <code translate="no">like</code>, qui vous permet d'effectuer une correspondance par préfixe. Vous pouvez également effectuer une correspondance exacte à l'aide de l'opérateur <code translate="no">==</code>.</p>
<p>En outre, un index inversé basé sur MARISA-trie est pris en charge pour accélérer la recherche et l'interrogation hybrides. Poursuivez votre lecture et découvrez toutes les expressions de chaîne que vous souhaitez connaître pour effectuer un filtrage d'attributs avec des données de chaîne.</p>
<custom-h1>Comment gérer les données de type chaîne dans Milvus 2.1 ?</custom-h1><p>Nous savons maintenant que le type de données chaîne est extrêmement utile, mais quand exactement avons-nous besoin d'utiliser ce type de données dans la construction de nos propres applications ? Dans ce qui suit, vous verrez quelques exemples de code de scénarios qui peuvent impliquer des données de type chaîne, ce qui vous permettra de mieux comprendre comment gérer les données VARCHAR dans Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Création d'une collection<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Reprenons l'exemple précédent. Vous travaillez toujours sur le système de recommandation de livres et vous souhaitez créer une collection de livres avec un champ de clé primaire appelé <code translate="no">book_name</code>, dans lequel vous insérerez des données de type chaîne de caractères. Dans ce cas, vous pouvez définir le type de données comme <code translate="no">DataType.VARCHAR</code>lorsque vous définissez le schéma du champ, comme le montre l'exemple ci-dessous.</p>
<p>Notez que lors de la création d'un champ VARCHAR, il est nécessaire de spécifier la longueur maximale des caractères via le paramètre <code translate="no">max_length</code> dont la valeur peut être comprise entre 1 et 65 535.  Dans cet exemple, nous avons fixé la longueur maximale à 200.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">Insérer les données<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que la collection est créée, nous pouvons y insérer des données. Dans l'exemple suivant, nous insérons 2 000 lignes de données sous forme de chaînes générées de manière aléatoire.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Supprimer des données<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Supposons que deux livres, nommés <code translate="no">book_0</code> et <code translate="no">book_1</code>, ne soient plus disponibles dans votre magasin et que vous souhaitiez supprimer les informations correspondantes de votre base de données. Dans ce cas, vous pouvez utiliser l'expression <code translate="no">in</code> pour filtrer les entités à supprimer, comme indiqué dans l'exemple ci-dessous.</p>
<p>N'oubliez pas que Milvus ne prend en charge que la suppression d'entités avec des clés primaires clairement spécifiées. Par conséquent, avant d'exécuter le code suivant, assurez-vous que vous avez défini le champ <code translate="no">book_name</code> comme champ de clé primaire.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Construction d'un index<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 prend en charge la construction d'index scalaires, ce qui accélère considérablement le filtrage des champs de chaîne. Contrairement à la construction d'un index vectoriel, il n'est pas nécessaire de préparer des paramètres avant de construire un index scalaire. Milvus ne prend temporairement en charge que l'index d'arbre de dictionnaire (MARISA-trie), de sorte que le type d'index d'un champ de type VARCHAR est MARISA-trie par défaut.</p>
<p>Vous pouvez spécifier le nom de l'index lors de sa construction. S'il n'est pas spécifié, la valeur par défaut de <code translate="no">index_name</code> est <code translate="no">&quot;_default_idx_&quot;</code>. Dans l'exemple ci-dessous, nous avons nommé l'index <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Recherche hybride<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>En spécifiant des expressions booléennes, vous pouvez filtrer les champs de chaîne lors d'une recherche de similarité vectorielle.</p>
<p>Par exemple, si vous recherchez les livres dont l'introduction est la plus similaire à Hello Milvus mais que vous ne souhaitez obtenir que les livres dont le nom commence par "book_2", vous pouvez utiliser l'opérateur <code translate="no">like</code>pour effectuer une correspondance par préfixe et obtenir les livres ciblés, comme indiqué dans l'exemple ci-dessous.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Expressions de chaînes de caractères<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre l'opérateur nouvellement ajouté <code translate="no">like</code>, d'autres opérateurs, déjà pris en charge dans les versions précédentes de Milvus, peuvent également être utilisés pour le filtrage des champs de chaîne. Voici quelques exemples d'<a href="https://milvus.io/docs/v2.1.x/boolean.md">expressions de chaîne</a> couramment utilisées, où <code translate="no">A</code> représente un champ de type VARCHAR. N'oubliez pas que toutes les expressions de chaîne ci-dessous peuvent être combinées logiquement à l'aide d'opérateurs logiques, tels que AND, OR et NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Opérations sur les ensembles</h3><p>Vous pouvez utiliser <code translate="no">in</code> et <code translate="no">not in</code> pour réaliser des opérations d'ensemble, telles que <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Comparer deux champs de chaîne</h3><p>Vous pouvez utiliser des opérateurs relationnels pour comparer les valeurs de deux champs de type chaîne. Ces opérateurs relationnels comprennent <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Pour plus d'informations, voir <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Opérateurs relationnels</a>.</p>
<p>Notez que les champs de type chaîne ne peuvent être comparés qu'à d'autres champs de type chaîne et non à des champs d'autres types de données. Par exemple, un champ de type VARCHAR ne peut pas être comparé à un champ de type booléen ou de type entier.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Comparer un champ à une valeur constante</h3><p>Vous pouvez utiliser <code translate="no">==</code> ou <code translate="no">!=</code> pour vérifier si la valeur d'une rubrique est égale à une valeur constante.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filtrer les champs avec une seule plage</h3><p>Vous pouvez utiliser <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> pour filtrer les champs de type chaîne de caractères avec une seule plage, comme <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Correspondance des préfixes</h3><p>Comme indiqué précédemment, Milvus 2.1 ajoute l'opérateur <code translate="no">like</code> pour la correspondance des préfixes, comme <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Prochaines étapes<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la sortie officielle de Milvus 2.1, nous avons préparé une série de blogs présentant les nouvelles fonctionnalités. En savoir plus sur cette série de blogs :</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Comment utiliser les données sur les chaînes de caractères pour renforcer vos applications de recherche par similarité</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilisation de Milvus embarqué pour installer et exécuter instantanément Milvus avec Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Augmenter le débit de lecture de votre base de données vectorielle avec des répliques en mémoire</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus (partie II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a></li>
</ul>
