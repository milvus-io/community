---
id: in-memory-replicas.md
title: >-
  Augmentez le débit de lecture de votre base de données vectorielle avec des
  répliques en mémoire
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Utiliser des répliques en mémoire pour améliorer le débit de lecture et
  l'utilisation des ressources matérielles.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article est co-écrit par <a href="https://github.com/congqixia">Congqi Xia</a> et <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Avec sa sortie officielle, Milvus 2.1 s'accompagne de nombreuses nouvelles fonctionnalités destinées à faciliter la vie des utilisateurs et à améliorer leur expérience. Bien que le concept de réplique en mémoire ne soit pas nouveau dans le monde des bases de données distribuées, il s'agit d'une fonctionnalité essentielle qui peut vous aider à améliorer les performances et la disponibilité du système sans effort. Cet article explique donc ce qu'est la réplique en mémoire et pourquoi elle est importante, puis présente comment activer cette nouvelle fonctionnalité dans Milvus, une base de données vectorielle pour l'IA.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Concepts liés à la réplique en mémoire</a></p></li>
<li><p><a href="#What-is-in-memory-replica">Qu'est-ce que la réplique en mémoire ?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Pourquoi les répliques en mémoire sont-elles importantes ?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Activer les répliques en mémoire dans la base de données vectorielle Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Concepts liés à la réplique en mémoire<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de savoir ce qu'est une réplique en mémoire et pourquoi elle est importante, nous devons d'abord comprendre quelques concepts pertinents, notamment le groupe de répliques, la réplique en nuage, la réplique en continu, la réplique historique et le chef de nuage. L'image ci-dessous illustre ces concepts.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Concepts de réplique</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Groupe de répliques</h3><p>Un groupe de répliques est constitué de plusieurs <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">nœuds de requête</a> chargés de gérer les données historiques et les répliques.</p>
<h3 id="Shard-replica" class="common-anchor-header">Réplique en nuage</h3><p>Un réplica shard se compose d'un réplica streaming et d'un réplica historique, tous deux appartenant au même <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">shard</a> (c'est-à-dire au canal DML). Un groupe de répliques est constitué de plusieurs répliques. Le nombre exact de répliques d'un groupe de répliques est déterminé par le nombre de tessons d'une collection donnée.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Réplique en continu</h3><p>Une réplique en continu contient tous les <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">segments croissants</a> du même canal DML. D'un point de vue technique, une réplique en continu ne doit être servie que par un seul nœud de requête dans une réplique.</p>
<h3 id="Historical-replica" class="common-anchor-header">Réplique historique</h3><p>Une réplique historique contient tous les segments scellés du même canal DML. Les segments scellés d'une réplique historique peuvent être distribués sur plusieurs nœuds de requête au sein du même groupe de répliques.</p>
<h3 id="Shard-leader" class="common-anchor-header">Chef de tesson</h3><p>Un chef de groupe est le nœud de requête qui sert la réplique en continu dans un groupe de répliques.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">Qu'est-ce que la réplique en mémoire ?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>L'activation des répliques en mémoire vous permet de charger les données d'une collection sur plusieurs nœuds de requête afin d'exploiter des ressources supplémentaires en termes de CPU et de mémoire. Cette fonctionnalité est très utile si vous disposez d'un ensemble de données relativement petit mais que vous souhaitez augmenter le débit de lecture et améliorer l'utilisation des ressources matérielles.</p>
<p>Pour l'instant, la base de données vectorielles Milvus contient une réplique pour chaque segment en mémoire. Cependant, avec les répliques en mémoire, vous pouvez avoir plusieurs répliques d'un segment sur différents nœuds d'interrogation. Cela signifie que si un nœud d'interrogation effectue une recherche sur un segment, une nouvelle demande de recherche peut être attribuée à un autre nœud d'interrogation inactif, car ce nœud d'interrogation possède une réplique du même segment.</p>
<p>En outre, si nous disposons de plusieurs répliques en mémoire, nous pouvons mieux faire face à la situation dans laquelle un nœud de requête tombe en panne. Auparavant, nous devions attendre que le segment soit rechargé afin de poursuivre la recherche sur un autre nœud d'interrogation. Cependant, avec la réplication en mémoire, la demande de recherche peut être renvoyée immédiatement à un nouveau nœud d'interrogation sans avoir à recharger les données.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>La réplication</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Pourquoi les répliques en mémoire sont-elles importantes ?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>L'un des principaux avantages de l'activation des répliques en mémoire est l'augmentation du QPS (query per second) et du débit. En outre, il est possible de maintenir plusieurs répliques de segments et le système est plus résistant en cas de basculement.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Activer les répliques en mémoire dans la base de données vectorielle Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>L'activation de la nouvelle fonctionnalité des répliques en mémoire est facile dans la base de données vectorielle Milvus. Il vous suffit de spécifier le nombre de répliques que vous souhaitez lors du chargement d'une collection (en appelant <code translate="no">collection.load()</code>).</p>
<p>Dans l'exemple suivant, nous supposons que vous avez déjà <a href="https://milvus.io/docs/v2.1.x/create_collection.md">créé une collection</a> nommée "book" et que vous y avez <a href="https://milvus.io/docs/v2.1.x/insert_data.md">inséré des données</a>. Vous pouvez alors exécuter la commande suivante pour créer deux répliques lors du <a href="https://milvus.io/docs/v2.1.x/load_collection.md">chargement d'</a> une collection de livres.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez modifier le nombre de répliques dans l'exemple de code ci-dessus pour l'adapter au mieux à votre scénario d'application. Vous pouvez ensuite effectuer directement une <a href="https://milvus.io/docs/v2.1.x/search.md">recherche de</a> similarité vectorielle ou une <a href="https://milvus.io/docs/v2.1.x/query.md">requête</a> sur plusieurs répliques sans exécuter de commandes supplémentaires. Toutefois, il convient de noter que le nombre maximal de répliques autorisé est limité par la quantité totale de mémoire utilisable pour exécuter les nœuds de requête. Si le nombre de répliques que vous spécifiez dépasse les limites de la mémoire utilisable, une erreur sera renvoyée lors du chargement des données.</p>
<p>Vous pouvez également vérifier les informations des répliques en mémoire que vous avez créées en exécutant <code translate="no">collection.get_replicas()</code>. Les informations relatives aux groupes de réplicas et aux nœuds de requête et shards correspondants seront renvoyées. Voici un exemple de résultat.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
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
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Comment utiliser les données de chaînes de caractères pour renforcer vos applications de recherche de similitudes</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilisation de Milvus embarqué pour installer et exécuter instantanément Milvus avec Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Augmenter le débit de lecture de votre base de données vectorielle avec des répliques en mémoire</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus (partie II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a></li>
</ul>
