---
id: building-video-search-system-with-milvus.md
title: Vue d'ensemble du système
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Recherche de vidéos par image avec Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 étapes pour construire un système de recherche vidéo</custom-h1><p>Comme son nom l'indique, la recherche de vidéos par image consiste à extraire de la base de données les vidéos contenant des images similaires à l'image d'entrée. L'une des principales étapes consiste à transformer les vidéos en encastrements, c'est-à-dire à extraire les images clés et à convertir leurs caractéristiques en vecteurs. Certains lecteurs curieux pourraient se demander quelle est la différence entre la recherche d'une vidéo par image et la recherche d'une image par image. En fait, la recherche des images clés dans les vidéos est équivalente à la recherche d'une image par image.</p>
<p>Vous pouvez vous référer à notre article précédent <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG : Building a Content-based Image Retrieval System (Milvus x VGG : construction d'un système de recherche d'images basé sur le contenu)</a> si cela vous intéresse.</p>
<h2 id="System-overview" class="common-anchor-header">Vue d'ensemble du système<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Le diagramme suivant illustre le flux de travail typique d'un tel système de recherche vidéo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-systeme-de-recherche-video.png</span> </span></p>
<p>Lors de l'importation de vidéos, nous utilisons la bibliothèque OpenCV pour découper chaque vidéo en images, extraire les vecteurs des images clés à l'aide du modèle d'extraction de caractéristiques d'image VGG, puis insérer les vecteurs extraits (embeddings) dans Milvus. Nous utilisons Minio pour stocker les vidéos originales et Redis pour stocker les corrélations entre les vidéos et les vecteurs.</p>
<p>Lors de la recherche de vidéos, nous utilisons le même modèle VGG pour convertir l'image d'entrée en un vecteur de caractéristiques et l'insérer dans Milvus pour trouver les vecteurs présentant le plus de similitudes. Ensuite, le système extrait les vidéos correspondantes de Minio sur son interface en fonction des corrélations dans Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Préparation des données<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cet article, nous utilisons environ 100 000 fichiers GIF de Tumblr comme échantillon de données pour construire une solution de bout en bout pour la recherche de vidéos. Vous pouvez utiliser vos propres référentiels vidéo.</p>
<h2 id="Deployment" class="common-anchor-header">Déploiement<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Le code permettant de construire le système de recherche vidéo présenté dans cet article se trouve sur GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Étape 1 : Création d'images Docker.</h3><p>Le système de recherche vidéo nécessite Milvus v0.7.1 docker, Redis docker, Minio docker, l'interface frontale docker et l'API back-end docker. Vous devez construire vous-même le docker de l'interface frontale et le docker de l'API back-end, tandis que vous pouvez extraire les trois autres dockers directement depuis Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Étape 2 : Configurer l'environnement.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Ici, nous utilisons docker-compose.yml pour gérer les cinq conteneurs mentionnés ci-dessus. Voir le tableau suivant pour la configuration de docker-compose.yml :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>L'adresse IP 192.168.1.38 dans le tableau ci-dessus est l'adresse du serveur spécialement conçu pour construire le système de récupération vidéo dans cet article. Vous devez la mettre à jour avec votre adresse de serveur.</p>
<p>Vous devez créer manuellement des répertoires de stockage pour Milvus, Redis et Minio, puis ajouter les chemins correspondants dans docker-compose.yml. Dans cet exemple, nous avons créé les répertoires suivants :</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Vous pouvez configurer Milvus, Redis et Minio dans docker-compose.yml comme suit :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Étape 3 : Démarrer le système.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilisez le fichier docker-compose.yml modifié pour démarrer les cinq conteneurs docker qui seront utilisés dans le système de recherche vidéo :</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Ensuite, vous pouvez exécuter docker-compose ps pour vérifier si les cinq conteneurs docker ont démarré correctement. La capture d'écran suivante montre une interface typique après un démarrage réussi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>Vous avez maintenant construit avec succès un système de recherche vidéo, bien que la base de données ne contienne aucune vidéo.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Étape 4 : Importer des vidéos.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans le répertoire de déploiement du référentiel du système, vous trouverez import_data.py, le script d'importation des vidéos. Il vous suffit de mettre à jour le chemin d'accès aux fichiers vidéo et l'intervalle d'importation pour exécuter le script.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-mise-a-jour-du-chemin-video.png</span> </span></p>
<p>chemin_données : Le chemin d'accès aux vidéos à importer.</p>
<p>time.sleep(0.5) : L'intervalle auquel le système importe les vidéos. Le serveur que nous utilisons pour construire le système de recherche vidéo dispose de 96 cœurs de processeur. Il est donc recommandé de fixer l'intervalle à 0,5 seconde. Réglez l'intervalle sur une valeur plus élevée si votre serveur dispose de moins de cœurs de CPU. Sinon, le processus d'importation pèsera sur l'unité centrale et créera des processus zombies.</p>
<p>Exécutez import_data.py pour importer les vidéos.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Une fois les vidéos importées, vous disposez de votre propre système de recherche vidéo !</p>
<h2 id="Interface-display" class="common-anchor-header">Affichage de l'interface<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Ouvrez votre navigateur et entrez 192.168.1.38:8001 pour voir l'interface du système de recherche vidéo comme indiqué ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>Cliquez sur le bouton en haut à droite pour afficher toutes les vidéos du dépôt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-view-all-videos-repository.png</span> </span></p>
<p>Cliquez sur la boîte de téléchargement en haut à gauche pour saisir une image cible. Comme indiqué ci-dessous, le système renvoie les vidéos contenant les images les plus similaires.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-recommender-system-cats.png</span> </span></p>
<p>Ensuite, amusez-vous avec notre système de recherche vidéo !</p>
<h2 id="Build-your-own" class="common-anchor-header">Créez le vôtre<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cet article, nous avons utilisé Milvus pour créer un système de recherche de vidéos par images. Cela illustre l'application de Milvus dans le traitement des données non structurées.</p>
<p>Milvus est compatible avec de nombreux frameworks d'apprentissage profond et permet d'effectuer des recherches en quelques millisecondes pour des vecteurs à l'échelle de milliards. N'hésitez pas à emmener Milvus avec vous dans d'autres scénarios d'IA : https://github.com/milvus-io/milvus.</p>
<p>Ne soyez pas un inconnu, suivez-nous sur <a href="https://twitter.com/milvusio/">Twitter</a> ou rejoignez-nous sur <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</p>
