---
id: deep-dive-3-data-processing.md
title: Comment les données sont-elles traitées dans une base de données vectorielle ?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus fournit une infrastructure de gestion des données essentielle pour les
  applications d'IA de production. Cet article dévoile les subtilités du
  traitement des données à l'intérieur.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/czs007">Zhenshan Cao</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>Dans les deux précédents articles de cette série de blogs, nous avons déjà abordé l'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">architecture du système</a> Milvus, la base de données vectorielles la plus avancée au monde, ainsi que son <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">SDK et son API Python</a>.</p>
<p>Ce billet vise principalement à vous aider à comprendre comment les données sont traitées dans Milvus en allant en profondeur dans le système Milvus et en examinant l'interaction entre les composants de traitement des données.</p>
<p><em>Quelques ressources utiles avant de commencer sont listées ci-dessous. Nous vous recommandons de les lire d'abord pour mieux comprendre le sujet de ce billet.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Plongée dans l'architecture de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modèle de données Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Le rôle et la fonction de chaque composant Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Traitement des données dans Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Interface MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p>L'<a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">interface MsgStream</a> est cruciale pour le traitement des données dans Milvus. Lorsque <code translate="no">Start()</code> est appelé, la coroutine en arrière-plan écrit des données dans le <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a> ou lit des données à partir de celui-ci. Lorsque <code translate="no">Close()</code> est appelé, la coroutine s'arrête.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Interface MsgStream</span> </span></p>
<p>Le MsgStream peut servir de producteur et de consommateur. L'interface <code translate="no">AsProducer(channels []string)</code> définit le MsgStream en tant que producteur, tandis que l'interface <code translate="no">AsConsumer(channels []string, subNamestring)</code>le définit en tant que consommateur. Le paramètre <code translate="no">channels</code> est commun aux deux interfaces et sert à définir les canaux (physiques) dans lesquels les données doivent être écrites ou lues.</p>
<blockquote>
<p>Le nombre d'unités dans une collection peut être spécifié lors de la création d'une collection. Chaque shard correspond à un <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canal virtuel (vchannel)</a>. Par conséquent, une collection peut avoir plusieurs canaux virtuels. Milvus attribue à chaque canal virtuel du courtier en journaux un <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">canal physique (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Chaque canal virtuel/shard correspond à un canal physique</span>. </span></p>
<p><code translate="no">Produce()</code> L'interface MsgStream est chargée d'écrire des données dans les pchannels du log broker. Les données peuvent être écrites de deux manières :</p>
<ul>
<li>Écriture unique : les entités sont écrites dans différents shards (vchannel) par les valeurs de hachage des clés primaires. Ces entités sont ensuite transférées dans les canaux correspondants du courtier en journaux.</li>
<li>Écriture par diffusion : les entités sont écrites dans tous les pchannels spécifiés par le paramètre <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> est un type d'API bloquante. S'il n'y a pas de données disponibles dans le canal p spécifié, la coroutine sera bloquée lorsque <code translate="no">Consume()</code> est appelé dans l'interface MsgStream. En revanche, <code translate="no">Chan()</code> est une API non bloquante, ce qui signifie que la coroutine lit et traite les données uniquement s'il existe des données dans le pchannel spécifié. Dans le cas contraire, la coroutine peut traiter d'autres tâches et ne sera pas bloquée lorsqu'il n'y a pas de données disponibles.</p>
<p><code translate="no">Seek()</code> est une méthode de reprise sur panne. Lorsqu'un nouveau nœud est démarré, l'enregistrement de la consommation de données peut être obtenu et la consommation de données peut reprendre là où elle a été interrompue en appelant <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Écriture de données<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Les données écrites dans différents canaux virtuels (shards) peuvent être des messages d'insertion ou de suppression. Ces canaux virtuels peuvent également être appelés canaux Dm (canaux de manipulation des données).</p>
<p>Différentes collections peuvent partager les mêmes pchannels dans le log broker. Une même collection peut avoir plusieurs unités de stockage (shards) et donc plusieurs canaux virtuels correspondants. Les entités d'une même collection s'écoulent donc dans plusieurs canaux p correspondants dans le gestionnaire de journaux. Par conséquent, le partage des canaux p présente l'avantage d'augmenter le volume du débit grâce à une forte concurrence dans le courtier en journaux.</p>
<p>Lors de la création d'une collection, non seulement le nombre de tessons est spécifié, mais le mappage entre les vchannels et les pchannels dans le log broker est également décidé.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Chemin d'écriture dans Milvus</span> </span></p>
<p>Comme le montre l'illustration ci-dessus, dans le chemin d'écriture, les mandataires écrivent des données dans le courtier en journaux via l'interface <code translate="no">AsProducer()</code> du MsgStream. Les nœuds de données consomment ensuite les données, puis convertissent et stockent les données consommées dans le stockage d'objets. Le chemin de stockage est un type de méta-information qui sera enregistré dans etcd par les coordinateurs de données.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagramme de flux</h3><p>Étant donné que différentes collections peuvent partager les mêmes pchannels dans le log broker, lors de la consommation de données, les nœuds de données ou les nœuds de requête doivent juger à quelle collection les données d'un pchannel appartiennent. Pour résoudre ce problème, nous avons introduit le flowgraph dans Milvus. Il est principalement chargé de filtrer les données d'un canal partagé par ID de collection. Nous pouvons donc dire que chaque graphe de flux gère le flux de données dans un tesson correspondant (canal virtuel) d'une collection.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Graphe de flux dans le chemin d'écriture</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Création de MsgStream</h3><p>Lors de l'écriture de données, l'objet MsgStream est créé dans les deux scénarios suivants :</p>
<ul>
<li>Lorsque le proxy reçoit une demande d'insertion de données, il tente d'abord d'obtenir la correspondance entre les vchannels et les pchannels via le coordinateur racine (root coord). Il crée ensuite un objet MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Scénario 1</span> </span></p>
<ul>
<li>Lorsque le nœud de données démarre et lit les méta-informations des canaux dans etcd, l'objet MsgStream est créé.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Scénario 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Lecture des données<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Chemin de lecture dans Milvus</span> </span></p>
<p>Le flux de travail général de la lecture des données est illustré dans l'image ci-dessus. Les requêtes sont diffusées via le canal DqRequestChannel aux nœuds de requête. Les nœuds d'interrogation exécutent les tâches d'interrogation en parallèle. Les résultats des requêtes des nœuds de requête passent par gRPC et le proxy agrège les résultats et les renvoie au client.</p>
<p>Pour examiner de plus près le processus de lecture des données, nous pouvons voir que le proxy écrit les demandes de requête dans le canal DqRequestChannel. Les nœuds de requête consomment ensuite les messages en s'abonnant au canal DqRequestChannel. Chaque message du canal DqRequestChannel est diffusé de manière à ce que tous les nœuds de requête abonnés puissent le recevoir.</p>
<p>Lorsque les nœuds d'interrogation reçoivent des demandes de renseignements, ils effectuent une interrogation locale sur les données par lots stockées dans des segments scellés et sur les données en continu qui sont insérées dynamiquement dans Milvus et stockées dans des segments croissants. Ensuite, les nœuds d'interrogation doivent agréger les résultats de l'interrogation dans les <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">segments scellés et croissants</a>. Ces résultats agrégés sont transmis au proxy via gRPC.</p>
<p>Le proxy collecte tous les résultats de plusieurs nœuds d'interrogation et les agrège pour obtenir les résultats finaux. Le proxy renvoie ensuite les résultats finaux de la requête au client. Étant donné que chaque demande de requête et ses résultats correspondants sont étiquetés par le même identifiant de requête unique, le proxy peut déterminer quels résultats de requête correspondent à quelle demande de requête.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagramme de flux</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Diagramme de flux dans le chemin de lecture</span> </span></p>
<p>Comme pour le chemin d'écriture, les diagrammes de flux sont également introduits dans le chemin de lecture. Milvus met en œuvre l'architecture Lambda unifiée, qui intègre le traitement des données incrémentielles et historiques. Par conséquent, les nœuds de requête doivent également obtenir des données de flux en temps réel. De même, les diagrammes de flux dans le chemin de lecture filtrent et différencient les données provenant de différentes collections.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Création d'un MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Création d'un objet MsgStream dans le chemin de lecture</span> </span></p>
<p>Lors de la lecture des données, l'objet MsgStream est créé dans le scénario suivant :</p>
<ul>
<li>Dans Milvus, les données ne peuvent être lues que si elles sont chargées. Lorsque le proxy reçoit une demande de chargement de données, il l'envoie au coordinateur de requêtes, qui décide de la manière d'attribuer les fichiers à différents nœuds de requêtes. Les informations relatives à l'affectation (c'est-à-dire les noms des canaux virtuels et la correspondance entre les canaux virtuels et les canaux virtuels correspondants) sont envoyées aux nœuds d'interrogation par le biais d'un appel de méthode ou d'un appel de procédure à distance (RPC). Ensuite, les nœuds d'interrogation créent les objets MsgStream correspondants pour consommer les données.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Opérations DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL est l'abréviation de Data Definition Language (langage de définition des données). Les opérations DDL sur les métadonnées peuvent être classées en deux catégories : les demandes d'écriture et les demandes de lecture. Toutefois, ces deux types de demandes sont traités de la même manière lors du traitement des métadonnées.</p>
<p>Les demandes de lecture sur les métadonnées comprennent</p>
<ul>
<li>le schéma de collecte des requêtes</li>
<li>Informations sur l'indexation des requêtes Et plus encore</li>
</ul>
<p>Les demandes d'écriture comprennent</p>
<ul>
<li>Créer une collection</li>
<li>Déposer une collection</li>
<li>Créer un index</li>
<li>Supprimer un index Et plus encore</li>
</ul>
<p>Les requêtes DDL sont envoyées au proxy par le client, et le proxy transmet ensuite ces requêtes dans l'ordre reçu au coordinateur racine qui attribue un horodatage à chaque requête DDL et effectue des contrôles dynamiques sur les requêtes. Le proxy traite chaque demande en série, c'est-à-dire une demande DDL à la fois. Le proxy ne traitera pas la demande suivante avant d'avoir terminé le traitement de la demande précédente et d'avoir reçu les résultats de la coordonnée racine.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Opérations DDL</span>. </span></p>
<p>Comme le montre l'illustration ci-dessus, il y a <code translate="no">K</code> demandes DDL dans la file d'attente des tâches de la coordonnée racine. Les demandes DDL dans la file d'attente des tâches sont classées dans l'ordre dans lequel elles sont reçues par la coordonnée racine. Ainsi, <code translate="no">ddl1</code> est la première envoyée à la coordination racine et <code translate="no">ddlK</code> est la dernière de ce lot. Le coordinateur racine traite les demandes une par une dans l'ordre chronologique.</p>
<p>Dans un système distribué, la communication entre les mandataires et le coordinateur racine est assurée par gRPC. Le coordinateur racine conserve un enregistrement de la valeur maximale de l'horodatage des tâches exécutées afin de s'assurer que toutes les demandes DDL sont traitées dans l'ordre chronologique.</p>
<p>Supposons qu'il y ait deux mandataires indépendants, le mandataire 1 et le mandataire 2. Ils envoient tous deux des demandes DDL à la même coordonnée racine. Cependant, un problème se pose : les demandes antérieures ne sont pas nécessairement envoyées à la coordonnée racine avant les demandes reçues ultérieurement par un autre proxy. Par exemple, dans l'image ci-dessus, lorsque <code translate="no">DDL_K-1</code> est envoyé au coordonnateur racine par le proxy 1, <code translate="no">DDL_K</code> du proxy 2 a déjà été accepté et exécuté par le coordonnateur racine. Comme l'a enregistré le coordonnateur racine, la valeur maximale de l'horodatage des tâches exécutées à ce stade est <code translate="no">K</code>. Ainsi, pour ne pas interrompre l'ordre temporel, la demande <code translate="no">DDL_K-1</code> sera rejetée par la file d'attente des tâches du coordonnateur racine. Toutefois, si le proxy 2 envoie la demande <code translate="no">DDL_K+5</code> au coordonnateur racine à ce stade, la demande sera acceptée dans la file d'attente des tâches et sera exécutée ultérieurement en fonction de sa valeur d'horodatage.</p>
<h2 id="Indexing" class="common-anchor-header">Indexation<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Création d'un index</h3><p>Lorsqu'il reçoit des demandes de création d'index de la part du client, le proxy effectue d'abord des vérifications statiques sur les demandes et les envoie à la coordonnée racine. Ensuite, le coordonnateur racine persiste ces demandes de construction d'index dans le méta stockage (etcd) et envoie les demandes au coordinateur d'index (coordonnateur d'index).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Construction d'un index</span>. </span></p>
<p>Comme illustré ci-dessus, lorsque le coordinateur d'index reçoit des demandes de construction d'index de la part du coordinateur racine, il persiste d'abord la tâche dans etcd pour le méta-magasin. L'état initial de la tâche de construction d'index est <code translate="no">Unissued</code>. La coordination de l'index maintient un registre de la charge de travail de chaque nœud d'index et envoie les tâches entrantes à un nœud d'index moins chargé. Une fois la tâche terminée, le nœud d'index écrit l'état de la tâche, soit <code translate="no">Finished</code> ou <code translate="no">Failed</code>, dans le méta-magasin, qui est etcd dans Milvus. Le coordonnateur de l'index comprendra alors si la tâche de construction de l'index réussit ou échoue en consultant etcd. Si la tâche échoue en raison de ressources système limitées ou de l'abandon du nœud d'index, le coordinateur d'index redéclenchera l'ensemble du processus et attribuera la même tâche à un autre nœud d'index.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Abandon d'un index</h3><p>En outre, le coordinateur d'index est également chargé des demandes d'abandon d'index.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Abandon d'un index</span>. </span></p>
<p>Lorsque le coordonnateur de la racine reçoit une demande de suppression d'index de la part du client, il marque d'abord l'index comme &quot;supprimé&quot; et renvoie le résultat au client tout en notifiant le coordonnateur de l'index. Ensuite, la coordination d'indexation filtre toutes les tâches d'indexation à l'aide de <code translate="no">IndexID</code> et les tâches correspondant à la condition sont supprimées.</p>
<p>La coroutine d'arrière-plan de la coordination d'indexation supprime progressivement toutes les tâches d'indexation marquées comme "abandonnées" du stockage d'objets (MinIO et S3). Ce processus implique l'interface recycleIndexFiles. Lorsque tous les fichiers d'index correspondants sont supprimés, les méta-informations des tâches d'indexation supprimées sont supprimées du méta-stockage (etcd).</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale</a> de Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
