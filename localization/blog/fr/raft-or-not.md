---
id: raft-or-not.md
title: >-
  Radeau ou pas ? La meilleure solution pour assurer la cohérence des données
  dans les bases de données natives de l'informatique en nuage
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Pourquoi l'algorithme de réplication par consensus n'est-il pas la solution
  miracle pour assurer la cohérence des données dans les bases de données
  distribuées ?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> et transcréé par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>La réplication basée sur le consensus est une stratégie largement adoptée dans de nombreuses bases de données distribuées natives du cloud. Cependant, elle présente certaines lacunes et n'est certainement pas la solution miracle.</p>
<p>Cet article vise à expliquer les concepts de réplication, de cohérence et de consensus dans une base de données distribuée et native pour le cloud, puis à clarifier pourquoi les algorithmes basés sur le consensus tels que Paxos et Raft ne sont pas la solution miracle, et enfin à proposer une <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">solution à la réplication basée sur le consensus</a>.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Comprendre la réplication, la cohérence et le consensus</a></li>
<li><a href="#Consensus-based-replication">Réplication par consensus</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Une stratégie de réplication de logs pour les bases de données distribuées et cloud-natives</a></li>
<li><a href="#Summary">Résumé</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Comprendre la réplication, la cohérence et le consensus<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant d'approfondir les avantages et les inconvénients de Paxos et de Raft, et de proposer une stratégie de réplication de logs adaptée, nous devons d'abord démystifier les concepts de réplication, de cohérence et de consensus.</p>
<p>Notez que cet article se concentre principalement sur la synchronisation des données/logs incrémentaux. Par conséquent, lorsque l'on parle de réplication des données/logs, on se réfère uniquement à la réplication des données incrémentales, et non à celle des données historiques.</p>
<h3 id="Replication" class="common-anchor-header">Réplication</h3><p>La réplication est le processus qui consiste à faire plusieurs copies des données et à les stocker sur différents disques, processus, machines, clusters, etc. dans le but d'accroître la fiabilité des données et d'accélérer les requêtes. Dans la mesure où, lors de la réplication, les données sont copiées et stockées à plusieurs endroits, elles sont plus fiables en cas de défaillance d'un disque, d'une machine physique ou d'une grappe d'ordinateurs. En outre, les répliques multiples de données peuvent améliorer les performances d'une base de données distribuée en accélérant considérablement les requêtes.</p>
<p>Il existe différents modes de réplication, tels que la réplication synchrone/asynchrone, la réplication avec cohérence forte/éventuelle, la réplication leader-suiveur/décentralisée. Le choix du mode de réplication a un effet sur la disponibilité et la cohérence du système. Par conséquent, comme le propose le célèbre <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">théorème CAP</a>, l'architecte d'un système doit faire un compromis entre la cohérence et la disponibilité lorsque la partition du réseau est inévitable.</p>
<h3 id="Consistency" class="common-anchor-header">Cohérence</h3><p>En bref, la cohérence dans une base de données distribuée fait référence à la propriété qui garantit que chaque nœud ou réplique a la même vue des données lors de l'écriture ou de la lecture des données à un moment donné. Pour une liste complète des niveaux de cohérence, lisez la documentation <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">ici</a>.</p>
<p>Pour clarifier, nous parlons ici de cohérence comme dans le théorème CAP, et non d'ACID (atomicité, cohérence, isolation, durabilité). La cohérence dans le théorème CAP se réfère à chaque nœud du système ayant les mêmes données alors que la cohérence dans ACID se réfère à un nœud unique appliquant les mêmes règles à chaque validation potentielle.</p>
<p>En général, les bases de données OLTP (traitement des transactions en ligne) requièrent une forte cohérence ou linéarité afin de garantir que</p>
<ul>
<li>Chaque lecture peut accéder aux dernières données insérées.</li>
<li>Si une nouvelle valeur est renvoyée après une lecture, toutes les lectures suivantes, qu'elles soient effectuées sur le même client ou sur des clients différents, doivent renvoyer la nouvelle valeur.</li>
</ul>
<p>L'essence de la linéarisation est de garantir la récence de plusieurs répliques de données - une fois qu'une nouvelle valeur est écrite ou lue, toutes les lectures suivantes peuvent voir la nouvelle valeur jusqu'à ce qu'elle soit écrasée ultérieurement. Un système distribué offrant la linéarisation peut éviter aux utilisateurs de garder un œil sur plusieurs répliques et peut garantir l'atomicité et l'ordre de chaque opération.</p>
<h3 id="Consensus" class="common-anchor-header">Le consensus</h3><p>Le concept de consensus est introduit dans les systèmes distribués car les utilisateurs souhaitent que les systèmes distribués fonctionnent de la même manière que les systèmes autonomes.</p>
<p>Pour simplifier, le consensus est un accord général sur une valeur. Par exemple, Steve et Frank voulaient manger quelque chose. Steve a suggéré de prendre des sandwiches. Frank a accepté la suggestion de Steve et tous deux ont mangé des sandwiches. Ils sont parvenus à un consensus. Plus précisément, une valeur (les sandwiches) proposée par l'un d'entre eux est acceptée par les deux, et tous deux entreprennent des actions sur la base de cette valeur. De même, le consensus dans un système distribué signifie que lorsqu'un processus propose une valeur, tous les autres processus du système l'acceptent et agissent en fonction de cette valeur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Le consensus</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Réplication basée sur le consensus<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>Les premiers algorithmes basés sur le consensus ont été proposés en même temps que la <a href="https://pmg.csail.mit.edu/papers/vr.pdf">réplication avec horodatage en</a> 1988. En 1989, Leslie Lamport a proposé <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>, un algorithme basé sur le consensus.</p>
<p>Ces dernières années, nous avons assisté à l'apparition d'un autre algorithme basé sur le consensus dans l'industrie - <a href="https://raft.github.io/">Raft</a>. Il a été adopté par de nombreuses bases de données NewSQL grand public telles que CockroachDB, TiDB, OceanBase, etc.</p>
<p>Il est à noter qu'un système distribué ne supporte pas nécessairement la linéarisation même s'il adopte une réplication basée sur le consensus. Cependant, la linéarisation est une condition préalable à la construction d'une base de données distribuée ACID.</p>
<p>Lors de la conception d'un système de base de données, il convient de tenir compte de l'ordre de validation des journaux et des machines à états. Des précautions supplémentaires sont également nécessaires pour maintenir le bail de leader de Paxos ou de Raft et pour éviter un cerveau divisé en cas de partition du réseau.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Machine à états de réplication Raft</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Avantages et inconvénients</h3><p>En effet, Raft, ZAB et le <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">protocole de journalisation basé sur le quorum</a> dans Aurora sont tous des variantes de Paxos. La réplication basée sur le consensus présente les avantages suivants :</p>
<ol>
<li>Bien que la réplication basée sur le consensus se concentre davantage sur la cohérence et la partition du réseau dans le théorème CAP, elle fournit une disponibilité relativement meilleure par rapport à la réplication traditionnelle leader-suiveur.</li>
<li>Raft est une avancée qui a considérablement simplifié les algorithmes basés sur le consensus. Il existe de nombreuses bibliothèques Raft open-source sur GitHub (par exemple <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>Les performances de la réplication par consensus peuvent satisfaire la plupart des applications et des entreprises. Avec la couverture des disques SSD haute performance et des cartes d'interface réseau (NIC) de plusieurs gigaoctets, le fardeau de la synchronisation de plusieurs répliques est allégé, ce qui fait des algorithmes Paxos et Raft le courant dominant de l'industrie.</li>
</ol>
<p>On croit à tort que la réplication par consensus est la solution miracle pour assurer la cohérence des données dans une base de données distribuée. Or, ce n'est pas le cas. Les défis en matière de disponibilité, de complexité et de performance auxquels est confronté l'algorithme basé sur le consensus l'empêchent d'être la solution parfaite.</p>
<ol>
<li><p>Disponibilité compromise L'algorithme Paxos ou Raft optimisé dépend fortement de la réplique leader, qui n'a qu'une faible capacité à lutter contre les défaillances grises. Dans la réplication basée sur le consensus, une nouvelle élection de la réplique leader n'a pas lieu tant que le nœud leader ne répond pas pendant une longue période. Par conséquent, la réplication basée sur le consensus est incapable de gérer les situations où le nœud leader est lent ou lorsqu'un thrashing se produit.</p></li>
<li><p>Complexité élevée Bien qu'il existe déjà de nombreux algorithmes étendus basés sur Paxos et Raft, l'émergence de <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> et <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a> nécessite davantage de considérations et de tests sur la synchronisation entre les journaux et les machines d'état.</p></li>
<li><p>Performances compromises À l'ère du cloud-native, le stockage local est remplacé par des solutions de stockage partagé comme EBS et S3 pour garantir la fiabilité et la cohérence des données. Par conséquent, la réplication par consensus n'est plus indispensable pour les systèmes distribués. De plus, la réplication par consensus s'accompagne d'un problème de redondance des données, car la solution et EBS possèdent plusieurs répliques.</p></li>
</ol>
<p>Pour la réplication multi-centres de données et multi-cloud, la recherche de cohérence compromet non seulement la disponibilité mais aussi la <a href="https://en.wikipedia.org/wiki/PACELC_theorem">latence</a>, ce qui entraîne une baisse des performances. Par conséquent, la linéarisation n'est pas indispensable pour la tolérance aux sinistres multi-centres de données dans la plupart des applications.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Une stratégie de réplication des logs pour les bases de données distribuées et natives de l'informatique en nuage<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est indéniable que les algorithmes basés sur le consensus, tels que Raft et Paxos, sont toujours les algorithmes courants adoptés par de nombreuses bases de données OLTP. Cependant, en observant les exemples du protocole <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>, de <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> et de <a href="https://rockset.com/">Rockset</a>, nous pouvons voir que la tendance est en train de changer.</p>
<p>Il existe deux principes majeurs pour une solution qui peut servir au mieux une base de données distribuée native dans le nuage.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. La réplication en tant que service</h3><p>Un microservice distinct dédié à la synchronisation des données est nécessaire. Le module de synchronisation et le module de stockage ne doivent plus être étroitement couplés au sein du même processus.</p>
<p>Par exemple, Socrates découple le stockage, le journal et le calcul. Il n'y a qu'un seul service de journalisation dédié (le service XLog au milieu de la figure ci-dessous).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de Socrates</span> </span></p>
<p>Le service XLog est un service individuel. La persistance des données est assurée par un stockage à faible latence. La zone d'atterrissage de Socrates est chargée de maintenir trois répliques à une vitesse accélérée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Service XLog de Socrates</span> </span></p>
<p>Le nœud leader distribue les logs au log broker de manière asynchrone, et évacue les données vers Xstore. Le cache SSD local peut accélérer la lecture des données. Une fois que la vidange des données est réussie, les tampons de la zone d'atterrissage peuvent être nettoyés. Il est évident que toutes les données des journaux sont divisées en trois couches : la zone d'atterrissage, le disque SSD local et le XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Principe des poupées russes</h3><p>L'une des façons de concevoir un système est de suivre le principe des poupées russes : chaque couche est complète et parfaitement adaptée à ce qu'elle fait, de sorte que d'autres couches peuvent être construites au-dessus ou autour d'elle.</p>
<p>Lors de la conception d'une base de données "cloud-native", nous devons exploiter intelligemment d'autres services tiers afin de réduire la complexité de l'architecture du système.</p>
<p>Il semble que nous ne puissions pas nous passer de Paxos pour éviter un point de défaillance unique. Cependant, nous pouvons encore simplifier considérablement la réplication des journaux en confiant l'élection du leader à Raft ou aux services Paxos basés sur <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> et <a href="https://etcd.io/">etcd</a>.</p>
<p>Par exemple, l'architecture <a href="https://rockset.com/">Rockset</a> suit le principe des poupées russes et utilise Kafka/Kineses pour les journaux distribués, S3 pour le stockage et un cache SSD local pour améliorer les performances des requêtes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture Rockset</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">L'approche Milvus</h3><p>La cohérence ajustable dans Milvus est en fait similaire aux lectures suivies dans la réplication basée sur le consensus. La fonctionnalité "follower read" fait référence à l'utilisation de répliques "follower" pour entreprendre des tâches de lecture de données en partant du principe d'une cohérence forte. L'objectif est d'améliorer le débit de la grappe et de réduire la charge du leader. Le mécanisme qui sous-tend la fonction de lecture par les suiveurs consiste à demander l'index de validation du dernier journal et à fournir un service d'interrogation jusqu'à ce que toutes les données de l'index de validation soient appliquées aux machines d'état.</p>
<p>Cependant, la conception de Milvus n'a pas adopté la stratégie de suivi. En d'autres termes, Milvus ne demande pas l'index de validation à chaque fois qu'il reçoit une demande d'interrogation. Au lieu de cela, Milvus adopte un mécanisme tel que le filigrane dans <a href="https://flink.apache.org/">Flink</a>, qui notifie au nœud de requête l'emplacement de l'index de validation à intervalles réguliers. La raison de ce mécanisme est que les utilisateurs de Milvus ne sont généralement pas très exigeants en matière de cohérence des données et qu'ils peuvent accepter un compromis sur la visibilité des données pour améliorer les performances du système.</p>
<p>En outre, Milvus adopte également plusieurs microservices et sépare le stockage de l'informatique. Dans l'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">architecture Milvus</a>, S3, MinIo et Azure Blob sont utilisés pour le stockage.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture Milvus</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>De nos jours, un nombre croissant de bases de données natives du cloud font de la réplication des logs un service individuel. Ce faisant, le coût de l'ajout de répliques en lecture seule et de la réplication hétérogène peut être réduit. L'utilisation de plusieurs microservices permet une utilisation rapide de l'infrastructure en nuage mature, ce qui est impossible pour les bases de données traditionnelles. Un service de journalisation individuel peut s'appuyer sur une réplication basée sur le consensus, mais il peut également suivre la stratégie des poupées russes pour adopter divers protocoles de cohérence avec Paxos ou Raft afin de parvenir à la linéarisation.</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos made simple [J]. ACM SIGACT News (Distributed Computing Column) 32, 4 (Whole Number 121, December 2001), 2001 : 51-58.</li>
<li>Ongaro D, Ousterhout J. In search of an understandable consensus algorithm[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14). 2014 : 305-319.</li>
<li>Oki B M, Liskov B H. Viewstamped replication : A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988 : 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA : Replication in log-based distributed storage systems [J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora : On avoiding distributed consensus for i/os, commits, and membership changes[C]//Proceedings of the 2018 International Conference on Management of Data. 2018 : 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates : The new sql server in the cloud[C]//Proceedings of the 2019 International Conference on Management of Data. 2019 : 1743-1756.</li>
</ul>
