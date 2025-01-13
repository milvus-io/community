---
id: building-a-milvus-cluster-based-on-juicefs.md
title: Qu'est-ce que JuiceFS ?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Apprenez à construire un cluster Milvus basé sur JuiceFS, un système de
  fichiers partagés conçu pour les environnements cloud-native.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Construction d'un cluster Milvus basé sur JuiceFS</custom-h1><p>Les collaborations entre les communautés open-source sont une chose magique. Non seulement des bénévoles passionnés, intelligents et créatifs assurent l'innovation des solutions open-source, mais ils s'efforcent également de réunir différents outils de manière intéressante et utile. <a href="https://milvus.io/">Milvus</a>, la base de données vectorielles la plus populaire au monde, et <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, un système de fichiers partagé conçu pour les environnements cloud-native, ont été réunis dans cet esprit par leurs communautés open-source respectives. Cet article explique ce qu'est JuiceFS, comment construire un cluster Milvus basé sur le stockage de fichiers partagés JuiceFS et les performances que les utilisateurs peuvent attendre de cette solution.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>Qu'est-ce que JuiceFS ?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS est un système de fichiers POSIX distribué open-source haute performance, qui peut être construit au-dessus de Redis et de S3. Il a été conçu pour les environnements cloud-native et prend en charge la gestion, l'analyse, l'archivage et la sauvegarde de données de tout type. JuiceFS est couramment utilisé pour résoudre les défis liés au big data, créer des applications d'intelligence artificielle (IA) et collecter des logs. Le système prend également en charge le partage de données entre plusieurs clients et peut être utilisé directement comme stockage partagé dans Milvus.</p>
<p>Une fois que les données et les métadonnées correspondantes sont persistées dans le stockage d'objets et <a href="https://redis.io/">Redis</a> respectivement, JuiceFS sert d'intergiciel sans état. Le partage des données est réalisé en permettant à différentes applications de s'amarrer les unes aux autres de manière transparente par le biais d'une interface de système de fichiers standard. JuiceFS s'appuie sur Redis, un magasin de données en mémoire open-source, pour le stockage des métadonnées. Redis est utilisé parce qu'il garantit l'atomicité et fournit des opérations de métadonnées très performantes. Toutes les données sont stockées dans le stockage d'objets par le client JuiceFS. Le schéma de l'architecture est le suivant :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Construire un cluster Milvus basé sur JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Un cluster Milvus construit avec JuiceFS (voir le diagramme d'architecture ci-dessous) fonctionne en divisant les demandes en amont à l'aide de Mishards, un intergiciel de partage de cluster, pour faire descendre les demandes en cascade vers ses sous-modules. Lors de l'insertion de données, Mishards attribue les demandes en amont au nœud d'écriture Milvus, qui stocke les données nouvellement insérées dans JuiceFS. Lors de la lecture de données, Mishards charge les données de JuiceFS via un nœud de lecture Milvus vers la mémoire pour traitement, puis collecte et renvoie les résultats des sous-services en amont.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Étape 1 : Lancer le service MySQL</strong></h3><p>Lancez le service MySQL sur <strong>n'importe quel</strong> nœud du cluster. Pour plus de détails, voir <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Gérer les métadonnées avec MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Étape 2 : Créer un système de fichiers JuiceFS</strong></h3><p>À des fins de démonstration, le programme binaire JuiceFS précompilé est utilisé. Téléchargez le <a href="https://github.com/juicedata/juicefs/releases">paquet d'installation</a> adapté à votre système et suivez le <a href="https://github.com/juicedata/juicefs-quickstart">Guide de démarrage rapide de</a> JuiceFS pour obtenir des instructions d'installation détaillées. Pour créer un système de fichiers JuiceFS, configurez d'abord une base de données Redis pour le stockage des métadonnées. Il est recommandé d'héberger le service Redis sur le même cloud que l'application pour les déploiements dans les clouds publics. En outre, configurez le stockage d'objets pour JuiceFS. Dans cet exemple, Azure Blob Storage est utilisé, mais JuiceFS prend en charge presque tous les services d'objets. Sélectionnez le service de stockage d'objets qui répond le mieux aux exigences de votre scénario.</p>
<p>Après avoir configuré le service Redis et le stockage d'objets, formatez un nouveau système de fichiers et montez JuiceFS dans le répertoire local :</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Si le serveur Redis n'est pas exécuté localement, remplacez localhost par l'adresse suivante : <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Lorsque l'installation réussit, JuiceFS renvoie la page de stockage partagé <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Étape 3 : Démarrer Milvus</strong></h3><p>Milvus doit être installé sur tous les nœuds du cluster et chaque nœud Milvus doit être configuré avec une autorisation de lecture ou d'écriture. Un seul nœud Milvus peut être configuré comme nœud en écriture, les autres devant être des nœuds en lecture. Tout d'abord, définissez les paramètres des sections <code translate="no">cluster</code> et <code translate="no">general</code> dans le fichier de configuration du système Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Section</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Paramètre</strong></th><th style="text-align:left"><strong>Paramètre Description</strong></th><th style="text-align:left"><strong>Configuration</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Activation ou non du mode cluster</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Rôle de déploiement Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Section</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Pendant l'installation, le chemin d'accès au stockage partagé JuiceFS configuré est défini comme <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Une fois l'installation terminée, démarrez Milvus et vérifiez qu'il est lancé correctement. Enfin, démarrez le service Mishards sur l <strong>'un des</strong> nœuds du cluster. L'image ci-dessous montre un lancement réussi de Mishards. Pour plus d'informations, consultez le <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">tutoriel</a> GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Critères de performance</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Les solutions de stockage partagé sont généralement mises en œuvre par des systèmes de stockage en réseau (NAS). Les types de systèmes NAS couramment utilisés comprennent le système de fichiers réseau (NFS) et le bloc de messages serveur (SMB). Les plateformes de cloud public fournissent généralement des services de stockage gérés compatibles avec ces protocoles, tels que Amazon Elastic File System (EFS).</p>
<p>Contrairement aux systèmes NAS traditionnels, JuiceFS est mis en œuvre sur la base du système de fichiers dans l'espace utilisateur (FUSE), où toutes les lectures et écritures de données ont lieu directement du côté de l'application, ce qui réduit encore la latence d'accès. JuiceFS possède également des caractéristiques uniques que l'on ne retrouve pas dans les autres systèmes NAS, telles que la compression et la mise en cache des données.</p>
<p>Les tests de référence révèlent que JuiceFS offre des avantages majeurs par rapport à EFS. Dans le benchmark des métadonnées (Figure 1), JuiceFS enregistre des opérations d'E/S par seconde (IOPS) jusqu'à dix fois supérieures à celles d'EFS. En outre, le benchmark du débit d'E/S (Figure 2) montre que JuiceFS surpasse EFS dans les scénarios à tâche unique et à tâches multiples.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-2.png</span> </span></p>
<p>En outre, les tests de référence montrent que le temps de récupération de la première requête, ou le temps de chargement des données nouvellement insérées du disque vers la mémoire, pour le cluster Milvus basé sur JuiceFS n'est que de 0,032 seconde en moyenne, ce qui indique que les données sont chargées du disque vers la mémoire presque instantanément. Pour ce test, le temps de récupération de la première requête est mesuré en utilisant un million de lignes de données vectorielles à 128 dimensions insérées par lots de 100k à des intervalles de 1 à 8 secondes.</p>
<p>JuiceFS est un système de stockage de fichiers partagés stable et fiable, et le cluster Milvus construit sur JuiceFS offre à la fois des performances élevées et une capacité de stockage flexible.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>En savoir plus sur Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est un outil puissant capable d'alimenter une vaste gamme d'applications d'intelligence artificielle et de recherche de similarités vectorielles. Pour en savoir plus sur le projet, consultez les ressources suivantes :</p>
<ul>
<li>Lisez notre <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagissez avec notre communauté open-source sur <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilisez ou contribuez à la base de données vectorielles la plus populaire au monde sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testez et déployez rapidement des applications d'IA grâce à notre nouveau <a href="https://github.com/milvus-io/bootcamp">camp d'entraînement</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>writer bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>writer bio-jingjing jia.png</span> </span></p>
