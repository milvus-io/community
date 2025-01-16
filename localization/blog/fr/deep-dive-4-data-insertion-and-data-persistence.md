---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Insertion et persistance des données dans une base de données vectorielle
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Découvrez le mécanisme d'insertion et de persistance des données dans la base
  de données vectorielles Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/sunby">Bingyi Sun</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>Dans le précédent article de la série Deep Dive, nous avons présenté la <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">manière dont les données sont traitées dans Milvus</a>, la base de données vectorielles la plus avancée au monde. Dans cet article, nous continuerons à examiner les composants impliqués dans l'insertion des données, nous illustrerons le modèle de données en détail et nous expliquerons comment la persistance des données est réalisée dans Milvus.</p>
<p>Aller à :</p>
<ul>
<li><a href="#Milvus-architecture-recap">Récapitulatif de l'architecture de Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">Le portail des demandes d'insertion de données</a></li>
<li><a href="#Data-coord-and-data-node">Coordonnée des données et nœud de données</a></li>
<li><a href="#Root-coord-and-Time-Tick">Coordonnée racine et Time Tick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Organisation des données : collecte, partition, tesson (canal), segment</a></li>
<li><a href="#Data-allocation-when-and-how">Allocation des données : quand et comment</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Structure du fichier Binlog et persistance des données</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Récapitulatif de l'architecture Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Architecture Milvus</span>. </span></p>
<p>Le SDK envoie des demandes de données au proxy, le portail, via l'équilibreur de charge. Le proxy interagit ensuite avec le service de coordination pour écrire les requêtes DDL (langage de définition des données) et DML (langage de manipulation des données) dans le stockage des messages.</p>
<p>Les nœuds de travail, y compris le nœud de requête, le nœud de données et le nœud d'index, consomment les requêtes à partir du stockage de messages. Plus précisément, le nœud d'interrogation est chargé de l'interrogation des données ; le nœud de données est responsable de l'insertion et de la persistance des données ; et le nœud d'indexation s'occupe principalement de la création d'index et de l'accélération des requêtes.</p>
<p>La couche inférieure est le stockage d'objets, qui exploite principalement MinIO, S3 et AzureBlob pour stocker les journaux, les binlogs delta et les fichiers d'index.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">Le portail des demandes d'insertion de données<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy dans Milvus</span>. </span></p>
<p>Le proxy sert de portail pour les demandes d'insertion de données.</p>
<ol>
<li>Au départ, le proxy accepte les demandes d'insertion de données des SDK et répartit ces demandes dans plusieurs buckets à l'aide d'un algorithme de hachage.</li>
<li>Ensuite, le proxy demande à la coordination des données d'attribuer des segments, la plus petite unité de Milvus pour le stockage des données.</li>
<li>Ensuite, le proxy insère les informations des segments demandés dans le magasin de messages afin que ces informations ne soient pas perdues.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Coordonnée des données et nœud de données<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>La fonction principale de la coordination des données est de gérer l'attribution des canaux et des segments, tandis que la fonction principale du nœud de données est de consommer et de conserver les données insérées.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Coordonnée des données et nœud de données dans Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Fonction</h3><p>Le coordonnateur de données remplit les fonctions suivantes :</p>
<ul>
<li><p><strong>Allocation de l'espace des segments</strong>La coordination des données alloue au proxy l'espace des segments croissants afin que le proxy puisse utiliser l'espace libre des segments pour insérer des données.</p></li>
<li><p><strong>Enregistrer l'allocation de segments et l'heure d'expiration de l'espace alloué dans le segment</strong>L'espace dans chaque segment alloué par la coordonnée des données n'est pas permanent, c'est pourquoi la coordonnée des données doit également enregistrer l'heure d'expiration de chaque allocation de segment.</p></li>
<li><p><strong>Vider automatiquement les données du segment</strong>Si le segment est plein, la coordination des données déclenche automatiquement le vidage des données.</p></li>
<li><p><strong>Attribuer des canaux aux nœuds de données</strong>Une collection peut avoir plusieurs <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canaux virtuels</a>. La coordination des données détermine quels canaux sont consommés par quels nœuds de données.</p></li>
</ul>
<p>Les nœuds de données remplissent les fonctions suivantes :</p>
<ul>
<li><p><strong>Consommation des données</strong>Le nœud de données consomme les données des canaux alloués par la coordination des données et crée une séquence pour les données.</p></li>
<li><p><strong>Persistance des données</strong>Le nœud de données met en cache les données insérées dans la mémoire et les transfère automatiquement sur le disque lorsque le volume de données atteint un certain seuil.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Flux de travail</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Un canal virtuel ne peut être attribué qu'à un seul nœud de données</span>. </span></p>
<p>Comme le montre l'image ci-dessus, la collection comporte quatre canaux virtuels (V1, V2, V3 et V4) et deux nœuds de données. Il est très probable que la coordination des données affecte un nœud de données à la consommation des données de V1 et V2, et l'autre nœud de données à la consommation des données de V3 et V4. Un seul canal virtuel ne peut pas être attribué à plusieurs nœuds de données afin d'éviter la répétition de la consommation de données, qui entraînerait l'insertion répétée du même lot de données dans le même segment.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord et Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord gère TSO (timestamp Oracle) et publie des messages Time Tick à l'échelle mondiale. Chaque demande d'insertion de données est assortie d'un horodatage attribué par le coordonnateur principal. Le Time Tick est la pierre angulaire de Milvus. Il agit comme une horloge dans Milvus et indique à quel moment le système Milvus se trouve.</p>
<p>Lorsque des données sont écrites dans Milvus, chaque demande d'insertion de données porte un horodatage. Lors de la consommation des données, chaque nœud de données temporelles consomme des données dont l'horodatage se situe dans une certaine fourchette.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Exemple d'insertion et de consommation de données basées sur l'horodatage</span>. </span></p>
<p>L'image ci-dessus représente le processus d'insertion de données. Les valeurs des horodatages sont représentées par les nombres 1, 2, 6, 5, 7 et 8. Les données sont écrites dans le système par deux mandataires : p1 et p2. Lors de la consommation des données, si l'heure actuelle du Time Tick est 5, les nœuds de données ne peuvent lire que les données 1 et 2. Lors de la deuxième lecture, si l'heure actuelle du Time Tick est 9, les données 6, 7 et 8 peuvent être lues par le nœud de données.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Organisation des données : collection, partition, shard (canal), segment<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Organisation des données dans Milvus</span>. </span></p>
<p>Lisez d'abord cet <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">article</a> pour comprendre le modèle de données dans Milvus et les concepts de collection, de partition et de segment.</p>
<p>En résumé, la plus grande unité de données dans Milvus est une collection qui peut être comparée à une table dans une base de données relationnelle. Une collection peut avoir plusieurs niveaux (chacun correspondant à un canal) et plusieurs partitions à l'intérieur de chaque niveau. Comme le montre l'illustration ci-dessus, les canaux (shards) sont les barres verticales tandis que les partitions sont les barres horizontales. À chaque intersection se trouve le concept de segment, la plus petite unité d'allocation de données. Dans Milvus, les index sont construits sur des segments. Au cours d'une interrogation, le système Milvus équilibre également les charges d'interrogation dans différents nœuds d'interrogation et ce processus est mené sur la base de l'unité des segments. Les segments contiennent plusieurs <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlogs</a>, et lorsque les données du segment sont consommées, un fichier binlog est généré.</p>
<h3 id="Segment" class="common-anchor-header">Segment</h3><p>Il existe trois types de segments avec des statuts différents dans Milvus : le segment croissant, le segment scellé et le segment effacé.</p>
<h4 id="Growing-segment" class="common-anchor-header">Segment en croissance</h4><p>Un segment croissant est un segment nouvellement créé qui peut être alloué au proxy pour l'insertion de données. L'espace interne d'un segment peut être utilisé, alloué ou libre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Trois états dans un segment croissant</span> </span></p>
<ul>
<li>Utilisé : cette partie de l'espace d'un segment croissant a été consommée par un nœud de données.</li>
<li>Alloué : cette partie de l'espace d'un segment croissant a été demandée par le proxy et allouée par le coordonnateur des données. L'espace alloué expirera après un certain temps.</li>
<li>Libre : cette partie de l'espace d'un segment croissant n'a pas été utilisée. La valeur de l'espace libre est égale à l'espace total du segment soustrait de la valeur de l'espace utilisé et alloué. L'espace libre d'un segment augmente donc au fur et à mesure que l'espace alloué expire.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Segment scellé</h4><p>Un segment scellé est un segment fermé qui ne peut plus être alloué au proxy pour l'insertion de données.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segment scellé dans Milvus</span> </span></p>
<p>Un segment croissant est scellé dans les circonstances suivantes :</p>
<ul>
<li>Si l'espace utilisé dans un segment croissant atteint 75 % de l'espace total, le segment sera scellé.</li>
<li>Flush() est appelé manuellement par un utilisateur de Milvus pour conserver toutes les données d'une collection.</li>
<li>Les segments en croissance qui ne sont pas scellés après une longue période seront scellés, car un trop grand nombre de segments en croissance entraîne une surconsommation de mémoire par les nœuds de données.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Segment effacé</h4><p>Un segment effacé est un segment qui a déjà été écrit sur le disque. Le terme "flush" fait référence au stockage des données d'un segment dans un système de stockage d'objets à des fins de persistance des données. Un segment ne peut être effacé que lorsque l'espace alloué dans un segment scellé expire. Lorsqu'il est effacé, le segment scellé devient un segment effacé.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segment effacé dans Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Canal</h3><p>Un canal est alloué :</p>
<ul>
<li>lorsque le nœud de données démarre ou s'arrête ; ou</li>
<li>lorsque l'espace du segment alloué est demandé par le proxy.</li>
</ul>
<p>Il existe ensuite plusieurs stratégies d'attribution des canaux. Milvus prend en charge deux de ces stratégies :</p>
<ol>
<li>Hachage cohérent</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Hachage cohérent dans Milvus</span> </span></p>
<p>Il s'agit de la stratégie par défaut de Milvus. Cette stratégie tire parti de la technique de hachage pour attribuer à chaque canal une position sur l'anneau, puis effectue une recherche dans le sens des aiguilles d'une montre pour trouver le nœud de données le plus proche d'un canal. Ainsi, dans l'illustration ci-dessus, le canal 1 est attribué au nœud de données 2, tandis que le canal 2 est attribué au nœud de données 3.</p>
<p>Cette stratégie pose toutefois un problème : l'augmentation ou la diminution du nombre de nœuds de données (par exemple, le démarrage d'un nouveau nœud de données ou la fermeture soudaine d'un nœud de données) peut affecter le processus d'attribution des canaux. Pour résoudre ce problème, la coordination des données surveille l'état des nœuds de données via etcd afin que la coordination des données puisse être immédiatement informée de tout changement dans l'état des nœuds de données. La coordination des données détermine ensuite à quel nœud de données allouer correctement les canaux.</p>
<ol start="2">
<li>Équilibrage de la charge</li>
</ol>
<p>La deuxième stratégie consiste à attribuer des canaux de la même collection à différents nœuds de données, en veillant à ce que les canaux soient attribués de manière égale. L'objectif de cette stratégie est d'équilibrer la charge.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Attribution des données : quand et comment<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Le processus d'attribution des données dans Milvus</span> </span></p>
<p>Le processus d'attribution des données commence par le client. Il envoie d'abord des demandes d'insertion de données avec un horodatage <code translate="no">t1</code> au mandataire. Ensuite, le proxy envoie une demande d'allocation de segments à la coordination des données.</p>
<p>Dès réception de la demande d'allocation de segments, la coordination des données vérifie l'état des segments et les alloue. Si l'espace actuel des segments créés est suffisant pour les lignes de données nouvellement insérées, la coordination des données alloue ces segments créés. Toutefois, si l'espace disponible dans les segments actuels n'est pas suffisant, la coordonnée des données alloue un nouveau segment. La coordonnée des données peut renvoyer un ou plusieurs segments à chaque demande. Entre-temps, la coordonnée des données enregistre également le segment alloué dans le méta-serveur pour la persistance des données.</p>
<p>Ensuite, la coordonnée des données renvoie au mandataire les informations relatives au segment alloué (notamment l'identifiant du segment, le nombre de lignes, le délai d'expiration <code translate="no">t2</code>, etc. Le proxy envoie ces informations sur le segment alloué au magasin de messages afin qu'elles soient correctement enregistrées. Notez que la valeur de <code translate="no">t1</code> doit être inférieure à celle de <code translate="no">t2</code>. La valeur par défaut de <code translate="no">t2</code> est de 2 000 millisecondes et peut être modifiée en configurant le paramètre <code translate="no">segment.assignmentExpiration</code> dans le fichier <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Structure du fichier Binlog et persistance des données<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Rinçage du nœud de données</span> </span></p>
<p>Le nœud de données s'abonne au magasin de messages parce que les demandes d'insertion de données sont conservées dans le magasin de messages et que les nœuds de données peuvent ainsi consommer les messages d'insertion. Les nœuds de données placent d'abord les demandes d'insertion dans un tampon d'insertion et, au fur et à mesure que les demandes s'accumulent, elles sont évacuées vers le stockage d'objets après avoir atteint un certain seuil.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Structure du fichier Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Structure du fichier binlog</span>. </span></p>
<p>La structure du fichier binlog dans Milvus est similaire à celle de MySQL. Le fichier binlog est utilisé pour remplir deux fonctions : la récupération des données et la construction d'un index.</p>
<p>Un journal contient de nombreux <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">événements</a>. Chaque événement comporte un en-tête et des données.</p>
<p>Les métadonnées, notamment l'heure de création du binlog, l'ID du nœud d'écriture, la longueur de l'événement et NextPosition (décalage de l'événement suivant), etc. sont écrites dans l'en-tête de l'événement.</p>
<p>Les données de l'événement peuvent être divisées en deux parties : fixes et variables.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Structure de fichier d'un événement d'insertion</span>. </span></p>
<p>La partie fixe des données d'événement d'un <code translate="no">INSERT_EVENT</code> contient <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code> et <code translate="no">reserved</code>.</p>
<p>La partie variable stocke en fait les données insérées. Les données d'insertion sont séquencées au format parquet et stockées dans ce fichier.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistance des données</h3><p>S'il y a plusieurs colonnes dans le schéma, Milvus stocke les binlogs dans les colonnes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistance des données du journal binôme</span>. </span></p>
<p>Comme illustré dans l'image ci-dessus, la première colonne est la clé primaire binlog. La deuxième est la colonne d'horodatage. Les autres colonnes sont celles définies dans le schéma. Le chemin d'accès aux fichiers binlogs dans MinIO est également indiqué dans l'image ci-dessus.</p>
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale de</a> Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
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
