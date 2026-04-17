---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Vue d'ensemble du système
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Découvrez comment Milvus, une base de données vectorielles open-source, est
  utilisée par Mozat pour alimenter une application de mode qui offre des
  recommandations de style personnalisées et un système de recherche d'images.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Construire une application de planification de garde-robe et de tenue avec Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>Fondée en 2003, <a href="http://www.mozat.com/home">Mozat</a> est une start-up dont le siège se trouve à Singapour et qui possède des bureaux en Chine et en Arabie saoudite. L'entreprise est spécialisée dans la création d'applications de médias sociaux, de communication et de style de vie. <a href="https://stylepedia.com/">Stylepedia</a> est une application de garde-robe créée par Mozat qui aide les utilisateurs à découvrir de nouveaux styles et à entrer en contact avec d'autres passionnés de mode. Ses principales caractéristiques sont la possibilité de créer une garde-robe numérique, des recommandations de style personnalisées, une fonctionnalité de médias sociaux et un outil de recherche d'images pour trouver des articles similaires à ceux vus en ligne ou dans la vie réelle.</p>
<p><a href="https://milvus.io">Milvus</a> est utilisé pour alimenter le système de recherche d'images de Stylepedia. L'application traite trois types d'images : les images d'utilisateurs, les images de produits et les photographies de mode. Chaque image peut inclure un ou plusieurs éléments, ce qui complique encore plus chaque requête. Pour être utile, un système de recherche d'images doit être précis, rapide et stable, des caractéristiques qui constituent une base technique solide pour l'ajout de nouvelles fonctionnalités à l'application, telles que les suggestions de tenues et les recommandations de contenu de mode.</p>
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-system-process.png</span> </span></p>
<p>Le système de recherche d'images est divisé en deux parties, l'une hors ligne et l'autre en ligne.</p>
<p>Hors ligne, les images sont vectorisées et insérées dans une base de données vectorielle (Milvus). Dans le flux de données, les images de produits et les photographies de mode pertinentes sont converties en vecteurs de caractéristiques à 512 dimensions à l'aide de modèles de détection d'objets et d'extraction de caractéristiques. Les données vectorielles sont ensuite indexées et ajoutées à la base de données vectorielle.</p>
<p>En ligne, la base de données d'images est interrogée et les images similaires sont renvoyées à l'utilisateur. Comme pour la composante hors ligne, l'image interrogée est traitée par des modèles de détection d'objets et d'extraction de caractéristiques afin d'obtenir un vecteur de caractéristiques. À l'aide de ce vecteur, Milvus recherche les vecteurs similaires TopK et obtient les identifiants des images correspondantes. Enfin, après un post-traitement (filtrage, tri, etc.), une collection d'images similaires à l'image de la requête est renvoyée.</p>
<h2 id="Implementation" class="common-anchor-header">Mise en œuvre<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>L'implémentation se décompose en quatre modules :</p>
<ol>
<li>Détection de vêtements</li>
<li>Extraction des caractéristiques</li>
<li>Recherche de similarité vectorielle</li>
<li>Post-traitement</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Détection de vêtements</h3><p>Dans le module de détection de vêtements, <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, un cadre de détection de cibles en une étape, basé sur l'ancrage, est utilisé comme modèle de détection d'objets en raison de sa petite taille et de son inférence en temps réel. Il propose quatre tailles de modèle (YOLOv5s/m/l/x), et chaque taille spécifique présente des avantages et des inconvénients. Les modèles plus grands sont plus performants (plus grande précision) mais nécessitent beaucoup plus de puissance de calcul et s'exécutent plus lentement. Dans le cas présent, les objets étant relativement grands et faciles à détecter, le plus petit modèle, YOLOv5s, suffit.</p>
<p>Les vêtements de chaque image sont reconnus et découpés pour servir d'entrées au modèle d'extraction des caractéristiques utilisé dans le traitement ultérieur. Simultanément, le modèle de détection d'objets prédit également la classification des vêtements selon des classes prédéfinies (hauts, vêtements d'extérieur, pantalons, jupes, robes et barboteuses).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Extraction des caractéristiques</h3><p>Le modèle d'extraction des caractéristiques est la clé de la recherche de similitudes. Les images de vêtements recadrées sont intégrées dans des vecteurs à virgule flottante de 512 dimensions qui représentent leurs attributs dans un format de données numériques lisible par une machine. La méthodologie d'<a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">apprentissage métrique profond (DML)</a> est adoptée avec <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> comme modèle de base.</p>
<p>L'apprentissage métrique vise à former un module d'extraction de caractéristiques non linéaires basé sur le CNN (ou un encodeur) afin de réduire la distance entre les vecteurs de caractéristiques correspondant à la même classe d'échantillons et d'augmenter la distance entre les vecteurs de caractéristiques correspondant à des classes d'échantillons différentes. Dans ce scénario, la même classe d'échantillons correspond au même vêtement.</p>
<p>EfficientNet tient compte à la fois de la vitesse et de la précision lors de la mise à l'échelle uniforme de la largeur, de la profondeur et de la résolution du réseau. EfficientNet-B4 est utilisé comme réseau d'extraction de caractéristiques, et la sortie de la dernière couche entièrement connectée est constituée des caractéristiques d'image nécessaires pour effectuer la recherche de similarité vectorielle.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Recherche de similarité vectorielle</h3><p>Milvus est une base de données vectorielles open-source qui prend en charge les opérations de création, de lecture, de mise à jour et de suppression (CRUD) ainsi que la recherche en temps quasi réel sur des ensembles de données d'un trillion d'octets. Dans Stylepedia, elle est utilisée pour la recherche de similarités vectorielles à grande échelle parce qu'elle est très élastique, stable, fiable et rapide comme l'éclair. Milvus étend les capacités des bibliothèques d'index vectoriels largement utilisées (Faiss, NMSLIB, Annoy, etc.) et fournit un ensemble d'API simples et intuitives qui permettent aux utilisateurs de sélectionner le type d'index idéal pour un scénario donné.</p>
<p>Compte tenu des exigences du scénario et de l'échelle des données, les développeurs de Stylepedia ont utilisé la distribution CPU-only de Milvus associée à l'index HNSW. Deux collections indexées, l'une pour les produits et l'autre pour les photographies de mode, sont construites pour alimenter différentes fonctionnalités de l'application. Chaque collection est ensuite divisée en six partitions en fonction des résultats de la détection et de la classification afin de réduire la portée de la recherche. Milvus effectue des recherches sur des dizaines de millions de vecteurs en quelques millisecondes, offrant ainsi des performances optimales tout en maintenant les coûts de développement à un niveau bas et en minimisant la consommation de ressources.</p>
<h3 id="Post-processing" class="common-anchor-header">Post-traitement</h3><p>Pour améliorer la similarité entre les résultats de la recherche d'images et l'image de la requête, nous utilisons le filtrage des couleurs et des étiquettes clés (longueur de la manche, longueur du vêtement, style de col, etc.) pour filtrer les images non admissibles. En outre, un algorithme d'évaluation de la qualité des images est utilisé pour s'assurer que les images de meilleure qualité sont présentées aux utilisateurs en premier.</p>
<h2 id="Application" class="common-anchor-header">Application<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Téléchargement par l'utilisateur et recherche d'images</h3><p>Les utilisateurs peuvent prendre des photos de leurs propres vêtements et les télécharger dans leur placard numérique Stylepedia, puis récupérer les images de produits les plus similaires à leurs téléchargements.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-recherche-résultats.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Suggestions de tenues</h3><p>En effectuant une recherche de similarité dans la base de données Stylepedia, les utilisateurs peuvent trouver des photos de mode qui contiennent un article de mode spécifique. Il peut s'agir de nouveaux vêtements que quelqu'un envisage d'acheter ou d'un article de sa propre collection qui pourrait être porté ou associé différemment. Ensuite, grâce au regroupement des articles avec lesquels l'article est souvent associé, des suggestions de tenues sont générées. Par exemple, une veste de motard noire peut être associée à différents articles, tels qu'une paire de jeans noirs. Les utilisateurs peuvent alors parcourir des photographies de mode pertinentes où cette association se produit dans la formule sélectionnée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-veste-tailleur.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-veste-capture.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Recommandations de photographies de mode</h3><p>Sur la base de l'historique de navigation de l'utilisateur, de ses goûts et du contenu de sa garde-robe numérique, le système calcule la similarité et fournit des recommandations personnalisées de photographies de mode susceptibles de l'intéresser.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>En combinant des méthodologies d'apprentissage profond et de vision par ordinateur, Mozat a pu construire un système de recherche de similarité d'images rapide, stable et précis en utilisant Milvus pour alimenter diverses fonctionnalités de l'application Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Ne soyez pas un inconnu<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
