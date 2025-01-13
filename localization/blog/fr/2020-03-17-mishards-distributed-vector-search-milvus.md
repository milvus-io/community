---
id: mishards-distributed-vector-search-milvus.md
title: Vue d'ensemble de l'architecture distribuée
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Comment passer à l'échelle supérieure
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Recherche vectorielle distribuée dans Milvus</custom-h1><p>Milvus vise à réaliser une recherche de similarité et une analyse efficaces pour les vecteurs à grande échelle. Une instance autonome de Milvus peut facilement gérer la recherche vectorielle pour des vecteurs à l'échelle du milliard. Cependant, pour des ensembles de données de 10 milliards, 100 milliards ou même plus, un cluster Milvus est nécessaire. Le cluster peut être utilisé comme une instance autonome pour des applications de niveau supérieur et peut répondre aux besoins de l'entreprise en matière de faible latence et de forte concurrence pour les données à grande échelle. Un cluster Milvus peut renvoyer des requêtes, séparer la lecture de l'écriture, s'étendre horizontalement et dynamiquement, fournissant ainsi une instance Milvus qui peut s'étendre sans limite. Mishards est une solution distribuée pour Milvus.</p>
<p>Cet article présente brièvement les composants de l'architecture Mishards. Des informations plus détaillées seront présentées dans les prochains articles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Vue d'ensemble de l'architecture distribuée<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-architecture-distribuée-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Traçage des services<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Principaux composants des services<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Cadre de découverte des services, tel que ZooKeeper, etcd et Consul.</li>
<li>Équilibreur de charge, tel que Nginx, HAProxy, Ingress Controller.</li>
<li>Nœud Mishards : sans état, évolutif.</li>
<li>Nœud Milvus en écriture seule : nœud unique et non évolutif. Vous devez utiliser des solutions de haute disponibilité pour ce nœud afin d'éviter un point de défaillance unique.</li>
<li>Nœud Milvus en lecture seule : Nœud avec état et évolutif.</li>
<li>Service de stockage partagé : Tous les nœuds Milvus utilisent un service de stockage partagé pour partager les données, tel que NAS ou NFS.</li>
<li>Service de métadonnées : Tous les nœuds Milvus utilisent ce service pour partager des métadonnées. Actuellement, seul MySQL est pris en charge. Ce service nécessite une solution de haute disponibilité MySQL.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Composants évolutifs<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Mishards</li>
<li>Nœuds Milvus en lecture seule</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Présentation des composants<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Nœuds Mishards</strong></p>
<p>Mishards est responsable de la décomposition des demandes en amont et de l'acheminement des sous-demandes vers les sous-services. Les résultats sont résumés pour être renvoyés en amont.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-noeuds-mishards.jpg</span> </span></p>
<p>Comme l'indique le graphique ci-dessus, après avoir accepté une demande de recherche TopK, Mishards décompose d'abord la demande en sous-demandes et envoie les sous-demandes au service en aval. Lorsque toutes les sous-réponses sont collectées, elles sont fusionnées et renvoyées en amont.</p>
<p>Mishards étant un service sans état, il n'enregistre pas de données et ne participe pas à des calculs complexes. Les nœuds n'ont donc pas d'exigences élevées en matière de configuration et la puissance de calcul est principalement utilisée pour fusionner les sous-résultats. Il est donc possible d'augmenter le nombre de nœuds Mishards pour obtenir une concurrence élevée.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Nœuds Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Les nœuds Milvus sont responsables des opérations de base liées au CRUD et ont donc des exigences de configuration relativement élevées. Tout d'abord, la taille de la mémoire doit être suffisante pour éviter un trop grand nombre d'opérations d'E/S sur disque. Ensuite, la configuration de l'unité centrale peut également affecter les performances. Au fur et à mesure que la taille du cluster augmente, davantage de nœuds Milvus sont nécessaires pour accroître le débit du système.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Nœuds en lecture seule et nœuds en écriture</h3><ul>
<li>Les opérations principales de Milvus sont l'insertion et la recherche de vecteurs. La recherche est extrêmement exigeante pour les configurations de CPU et de GPU, alors que l'insertion ou d'autres opérations sont relativement peu exigeantes. Séparer le nœud qui exécute la recherche du nœud qui exécute les autres opérations permet un déploiement plus économique.</li>
<li>En termes de qualité de service, lorsqu'un nœud effectue des opérations de recherche, le matériel connexe fonctionne à pleine charge et ne peut pas garantir la qualité de service des autres opérations. C'est pourquoi deux types de nœuds sont utilisés. Les demandes de recherche sont traitées par des nœuds en lecture seule et les autres demandes sont traitées par des nœuds en écriture.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Un seul nœud inscriptible est autorisé</h3><ul>
<li><p>Actuellement, Milvus ne prend pas en charge le partage des données pour plusieurs instances inscriptibles.</p></li>
<li><p>Lors du déploiement, un point de défaillance unique des nœuds inscriptibles doit être envisagé. Des solutions de haute disponibilité doivent être préparées pour les nœuds inscriptibles.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Évolutivité des nœuds en lecture seule</h3><p>Lorsque la taille des données est très importante ou que les exigences en matière de latence sont très élevées, vous pouvez faire évoluer horizontalement les nœuds en lecture seule en tant que nœuds avec état. Supposons qu'il y ait 4 hôtes et que chacun ait la configuration suivante : CPU Cores : 16, GPU : 1, Mémoire : 64 Go. Le graphique suivant montre le cluster lors de la mise à l'échelle horizontale des nœuds à état. La puissance de calcul et la mémoire évoluent linéairement. Les données sont réparties en 8 zones, chaque nœud traitant les requêtes de 2 zones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>Lorsque le nombre de requêtes est important pour certains domaines, des nœuds en lecture seule sans état peuvent être déployés pour ces domaines afin d'augmenter le débit. Prenons l'exemple des hôtes ci-dessus. Lorsque les hôtes sont combinés en un cluster sans serveur, la puissance de calcul augmente de façon linéaire. Comme les données à traiter n'augmentent pas, la puissance de traitement pour le même groupe de données augmente également de façon linéaire.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Service de métadonnées</h3><p>Mots clés : MySQL</p>
<p>Pour plus d'informations sur les métadonnées Milvus, voir Comment afficher les métadonnées. Dans un système distribué, les nœuds inscriptibles Milvus sont les seuls producteurs de métadonnées. Les nœuds Mishards, les nœuds inscriptibles Milvus et les nœuds en lecture seule Milvus sont tous des consommateurs de métadonnées. Actuellement, Milvus ne prend en charge que MySQL et SQLite pour le stockage des métadonnées. Dans un système distribué, le service ne peut être déployé qu'en tant que MySQL hautement disponible.</p>
<h3 id="Service-discovery" class="common-anchor-header">Découverte du service</h3><p>Mots-clés : Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-decouverte-de-services.png</span> </span></p>
<p>La découverte de services fournit des informations sur tous les nœuds Milvus. Les nœuds Milvus enregistrent leurs informations lorsqu'ils sont en ligne et se déconnectent lorsqu'ils sont hors ligne. Les nœuds Milvus peuvent également détecter les nœuds anormaux en vérifiant périodiquement l'état de santé des services.</p>
<p>La découverte de services comprend de nombreux cadres, notamment etcd, Consul, ZooKeeper, etc. Mishards définit les interfaces de découverte de services et offre des possibilités de mise à l'échelle par des plugins. Actuellement, Mishards fournit deux types de plugins, qui correspondent aux configurations statiques et aux clusters Kubernetes. Vous pouvez personnaliser votre propre découverte de services en suivant l'implémentation de ces plugins. Les interfaces sont temporaires et doivent être remaniées. Plus d'informations sur l'écriture de votre propre plugin seront développées dans les prochains articles.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Équilibrage de charge et répartition des services</h3><p>Mots-clés : Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>La découverte de services et l'équilibrage de charge sont utilisés ensemble. L'équilibrage de charge peut être configuré comme une interrogation, un hachage ou un hachage cohérent.</p>
<p>L'équilibreur de charge est chargé de renvoyer les demandes des utilisateurs au nœud Mishards.</p>
<p>Chaque nœud Mishards acquiert les informations de tous les nœuds Milvus en aval via le centre de découverte de services. Toutes les métadonnées connexes peuvent être obtenues par le service de métadonnées. Mishards implémente le sharding en consommant ces ressources. Mishards définit les interfaces liées aux stratégies de routage et fournit des extensions via des plugins. Actuellement, Mishards fournit une stratégie de hachage cohérente basée sur le niveau de segment le plus bas. Comme le montre le graphique, il y a 10 segments, de s1 à s10. Selon la stratégie de hachage cohérent basée sur les segments, Mishards achemine les demandes concernant s1, 24, s6 et s9 vers le nœud Milvus 1, s2, s3, s5 vers le nœud Milvus 2 et s7, s8, s10 vers le nœud Milvus 3.</p>
<p>En fonction des besoins de votre entreprise, vous pouvez personnaliser le routage en suivant le plugin de routage par hachage cohérent par défaut.</p>
<h3 id="Tracing" class="common-anchor-header">Traçage</h3><p>Mots clés : OpenTracing, Jaeger, Zipkin</p>
<p>Étant donné la complexité d'un système distribué, les requêtes sont envoyées à de multiples invocations de services internes. Pour aider à identifier les problèmes, nous avons besoin de tracer la chaîne d'invocation des services internes. Au fur et à mesure que la complexité augmente, les avantages d'un système de traçage disponible s'expliquent d'eux-mêmes. Nous avons choisi le standard OpenTracing de la CNCF. OpenTracing fournit des API indépendantes de la plateforme et du fournisseur pour que les développeurs puissent facilement mettre en œuvre un système de traçage.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>Le graphique précédent est un exemple de traçage pendant l'invocation d'une recherche. La recherche invoque consécutivement <code translate="no">get_routing</code>, <code translate="no">do_search</code> et <code translate="no">do_merge</code>. <code translate="no">do_search</code> invoque également <code translate="no">search_127.0.0.1</code>.</p>
<p>L'ensemble de l'enregistrement de traçage forme l'arbre suivant :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>Le tableau suivant montre des exemples d'informations de requête/réponse et de balises pour chaque nœud :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing a été intégré à Milvus. De plus amples informations seront fournies dans les prochains articles.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Surveillance et alerte</h3><p>Mots-clés : Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
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
    </button></h2><p>En tant qu'intergiciel de service, Mishards intègre la découverte de services, le routage des requêtes, la fusion des résultats et le traçage. Une extension basée sur des plugins est également fournie. Actuellement, les solutions distribuées basées sur Mishards présentent encore les inconvénients suivants :</p>
<ul>
<li>Mishards utilise un proxy comme couche intermédiaire et a des coûts de latence.</li>
<li>Les nœuds inscriptibles de Milvus sont des services à point unique.</li>
<li>Le déploiement est compliqué lorsqu'il y a de multiples tiroirs et qu'un seul tiroir a plusieurs copies.</li>
<li>Absence d'une couche de cache, comme l'accès aux métadonnées.</li>
</ul>
<p>Nous corrigerons ces problèmes dans les prochaines versions afin que les Mishards puissent être appliqués à l'environnement de production plus facilement.</p>
