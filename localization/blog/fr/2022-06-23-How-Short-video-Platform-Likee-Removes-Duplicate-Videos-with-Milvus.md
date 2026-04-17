---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: >-
  Comment la plateforme de vidéos courtes Likee supprime les vidéos dupliquées
  avec Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Découvrez comment Likee utilise Milvus pour identifier les vidéos dupliquées
  en quelques millisecondes.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par Xinyang Guo et Baoyu Han, ingénieurs chez BIGO, et traduit par <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>BIGO<a href="https://www.bigo.sg/">Technology</a> (BIGO) est l'une des entreprises technologiques de Singapour à la croissance la plus rapide. Grâce à la technologie de l'intelligence artificielle, les produits et services vidéo de BIGO ont acquis une immense popularité dans le monde entier, avec plus de 400 millions d'utilisateurs dans plus de 150 pays. Il s'agit notamment de <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (diffusion en direct) et de <a href="https://likee.video/">Likee</a> (vidéo de courte durée).</p>
<p>Likee est une plateforme mondiale de création de vidéos courtes où les utilisateurs peuvent partager leurs moments, s'exprimer et se connecter avec le monde. Pour améliorer l'expérience des utilisateurs et leur recommander des contenus de meilleure qualité, Likee doit éliminer les vidéos dupliquées parmi l'énorme quantité de vidéos générées par les utilisateurs chaque jour, ce qui n'est pas une tâche aisée.</p>
<p>Ce blog présente comment BIGO utilise <a href="https://milvus.io">Milvus</a>, une base de données vectorielle open-source, pour supprimer efficacement les vidéos dupliquées.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#Overview">Vue d'ensemble</a></li>
<li><a href="#Video-deduplication-workflow">Flux de travail de la déduplication vidéo</a></li>
<li><a href="#System-architecture">Architecture du système</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Utilisation de Milvus pour la recherche de similarités</a></li>
</ul>
<custom-h1>Vue d'ensemble</custom-h1><p>Milvus est une base de données vectorielles open-source qui permet une recherche vectorielle ultra-rapide. Grâce à Milvus, Likee est en mesure d'effectuer une recherche en 200 ms tout en garantissant un taux de rappel élevé. En outre, en <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">faisant évoluer Milvus horizontalement</a>, Likee augmente avec succès le débit des requêtes vectorielles, ce qui améliore encore son efficacité.</p>
<custom-h1>Flux de travail de la déduplication vidéo</custom-h1><p>Comment Likee identifie-t-il les vidéos dupliquées ? Chaque fois qu'une vidéo est introduite dans le système Likee, elle est découpée en 15 à 20 images et chaque image est convertie en un vecteur de caractéristiques. Likee recherche ensuite dans une base de données de 700 millions de vecteurs les K vecteurs les plus similaires. Chacun des K vecteurs les plus similaires correspond à une vidéo de la base de données. Likee effectue ensuite des recherches affinées pour obtenir les résultats finaux et déterminer les vidéos à supprimer.</p>
<custom-h1>Architecture du système</custom-h1><p>Examinons de plus près le fonctionnement du système de déduplication vidéo de Likee à l'aide de Milvus. Comme le montre le diagramme ci-dessous, les nouvelles vidéos téléchargées sur Likee seront écrites en temps réel dans Kafka, un système de stockage de données, et consommées par les consommateurs Kafka. Les vecteurs de caractéristiques de ces vidéos sont extraits par des modèles d'apprentissage profond, où les données non structurées (vidéo) sont converties en vecteurs de caractéristiques. Ces vecteurs de caractéristiques seront mis en forme par le système et envoyés à l'auditeur de similarité.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Architecture du système de déduplication vidéo de Likee</span> </span></p>
<p>Les vecteurs de caractéristiques extraits seront indexés par Milvus et stockés dans Ceph, avant d'être <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">chargés par le nœud de requête Milvus</a> pour une recherche ultérieure. Les identifiants vidéo correspondants de ces vecteurs caractéristiques seront également stockés simultanément dans TiDB ou Pika en fonction des besoins réels.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Utilisation de la base de données vectorielles Milvus pour la recherche de similarités</h3><p>Lors de la recherche de vecteurs similaires, des milliards de données existantes, ainsi que de grandes quantités de nouvelles données générées chaque jour, posent de grands défis à la fonctionnalité du moteur de recherche de vecteurs. Après une analyse approfondie, Likee a finalement choisi Milvus, un moteur de recherche vectorielle distribué très performant et doté d'un taux de rappel élevé, pour effectuer la recherche de similitudes vectorielles.</p>
<p>Comme le montre le diagramme ci-dessous, la procédure d'une recherche de similarité se déroule comme suit :</p>
<ol>
<li><p>Tout d'abord, Milvus effectue une recherche par lots pour rappeler les 100 premiers vecteurs similaires pour chacun des multiples vecteurs de caractéristiques extraits d'une nouvelle vidéo. Chaque vecteur similaire est lié à l'ID vidéo correspondant.</p></li>
<li><p>Ensuite, en comparant les ID vidéo, Milvus supprime les vidéos en double et récupère les vecteurs de caractéristiques des vidéos restantes dans TiDB ou Pika.</p></li>
<li><p>Enfin, Milvus calcule et note la similarité entre chaque ensemble de vecteurs de caractéristiques récupérés et les vecteurs de caractéristiques de la vidéo de la requête. L'identifiant de la vidéo ayant le score le plus élevé est renvoyé comme résultat. La recherche de similitudes vidéo est ainsi terminée.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Procédure de recherche de similitudes</span> </span></p>
<p>En tant que moteur de recherche vectoriel très performant, Milvus a fait un travail extraordinaire dans le système de déduplication vidéo de Likee, alimentant considérablement la croissance des activités de BIGO dans le domaine de la vidéo courte. En ce qui concerne les activités vidéo, Milvus peut s'appliquer à de nombreux autres scénarios, tels que le blocage des contenus illégaux ou la recommandation de vidéos personnalisées. BIGO et Milvus se réjouissent à l'idée de coopérer à l'avenir dans d'autres domaines.</p>
