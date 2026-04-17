---
id: Whats-Inside-Milvus-1.0.md
title: Que contient Milvus 1.0 ?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  Milvus v1.0 est disponible dès maintenant. Découvrez les principes
  fondamentaux de Milvus ainsi que les principales fonctionnalités de Milvus
  v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Que contient Milvus 1.0 ?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus est une base de données vectorielles open-source conçue pour gérer des ensembles massifs de données vectorielles de l'ordre du million, du milliard, voire du trillion. Milvus a de vastes applications couvrant la découverte de nouveaux médicaments, la vision par ordinateur, la conduite autonome, les moteurs de recommandation, les chatbots, et bien plus encore.</p>
<p>En mars 2021, Zilliz, la société à l'origine de Milvus, a publié la première version de support à long terme de la plateforme, Milvus v1.0. Après des mois de tests approfondis, une version stable et prête à la production de la base de données vectorielles la plus populaire au monde est prête pour le prime time. Cet article de blog couvre quelques principes fondamentaux de Milvus ainsi que les principales caractéristiques de la version 1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Distributions de Milvus</h3><p>Milvus est disponible en distributions CPU-only et GPU-enabled. La première s'appuie exclusivement sur le CPU pour la construction d'index et la recherche ; la seconde permet une recherche et une construction d'index hybrides CPU et GPU qui accélèrent encore plus Milvus. Par exemple, avec la distribution hybride, le CPU peut être utilisé pour la recherche et le GPU pour la construction de l'index, ce qui améliore encore l'efficacité des requêtes.</p>
<p>Les deux distributions Milvus sont disponibles dans Docker. Vous pouvez soit compiler Milvus à partir de Docker (si votre système d'exploitation le prend en charge), soit compiler Milvus à partir du code source sous Linux (les autres systèmes d'exploitation ne sont pas pris en charge).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Intégration de vecteurs</h3><p>Les vecteurs sont stockés dans Milvus en tant qu'entités. Chaque entité possède un champ d'identification de vecteur et un champ de vecteur. Milvus v1.0 ne prend en charge que les ID de vecteurs entiers. Lors de la création d'une collection dans Milvus, les ID de vecteur peuvent être générés automatiquement ou définis manuellement. Milvus garantit que les ID de vecteur générés automatiquement sont uniques, mais les ID définis manuellement peuvent être dupliqués dans Milvus. En cas de définition manuelle des identifiants, les utilisateurs sont tenus de s'assurer que tous les identifiants sont uniques.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Partitions</h3><p>Milvus permet de créer des partitions dans une collection. Dans les situations où les données sont insérées régulièrement et où les données historiques ne sont pas significatives (par exemple, les données en continu), les partitions peuvent être utilisées pour accélérer la recherche de similarités vectorielles. Une collection peut comporter jusqu'à 4 096 partitions. La spécification d'une recherche vectorielle dans une partition spécifique restreint la recherche et peut réduire de manière significative le temps d'interrogation, en particulier pour les collections qui contiennent plus d'un trillion de vecteurs.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Optimisation des algorithmes d'indexation</h3><p>Milvus est construit au-dessus de plusieurs bibliothèques d'index largement adoptées, notamment Faiss, NMSLIB et Annoy. Milvus est bien plus qu'une simple enveloppe pour ces bibliothèques d'index. Voici quelques-unes des principales améliorations apportées aux bibliothèques sous-jacentes :</p>
<ul>
<li>Optimisation des performances de l'index IVF à l'aide de l'algorithme Elkan k-means.</li>
<li>Optimisations de la recherche FLAT.</li>
<li>Prise en charge de l'index hybride IVF_SQ8H, qui peut réduire la taille des fichiers d'index jusqu'à 75 % sans sacrifier la précision des données. IVF_SQ8H est basé sur IVF_SQ8, avec un rappel identique mais une vitesse d'interrogation beaucoup plus rapide. Il a été conçu spécifiquement pour Milvus afin d'exploiter la capacité de traitement parallèle des GPU et le potentiel de synergie entre le co-traitement CPU/GPU.</li>
<li>Compatibilité dynamique du jeu d'instructions.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Recherche, construction d'index et autres optimisations de Milvus</h3><p>Les optimisations suivantes ont été apportées à Milvus pour améliorer les performances de recherche et de construction d'index.</p>
<ul>
<li>Les performances de recherche sont optimisées lorsque le nombre de requêtes (nq) est inférieur au nombre de threads de l'unité centrale.</li>
<li>Milvus combine les demandes de recherche d'un client qui utilisent le même topK et les mêmes paramètres de recherche.</li>
<li>La construction de l'index est suspendue lorsque les demandes de recherche arrivent.</li>
<li>Milvus précharge automatiquement les collections en mémoire au démarrage.</li>
<li>Plusieurs dispositifs GPU peuvent être affectés à l'accélération de la recherche de similarités vectorielles.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Mesures de distance</h3><p>Milvus est une base de données vectorielle conçue pour permettre la recherche de similarités vectorielles. La plateforme a été conçue pour les MLOps et les applications d'IA de niveau de production. Milvus prend en charge un large éventail de mesures de distance pour calculer la similarité, telles que la distance euclidienne (L2), le produit intérieur (IP), la distance de Jaccard, la distance de Tanimoto, la distance de Hamming, la superstructure et la sous-structure. Les deux dernières mesures sont couramment utilisées dans la recherche moléculaire et la découverte de nouveaux médicaments assistée par l'IA.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Logging</h3><p>Milvus prend en charge la rotation des journaux. Dans le fichier de configuration du système, milvus.yaml, vous pouvez définir la taille d'un seul fichier journal, le nombre de fichiers journaux et la sortie du journal vers stdout.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Solution distribuée</h3><p>Avec un nœud d'écriture et un nombre illimité de nœuds de lecture, Mishards libère le potentiel de calcul de la grappe de serveurs. Ses fonctionnalités incluent le transfert de requêtes, le fractionnement lecture/écriture, la mise à l'échelle dynamique/horizontale, et bien d'autres encore.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Surveillance</h3><p>Milvus est compatible avec Prometheus, une boîte à outils open-source de surveillance des systèmes et d'alertes. Milvus ajoute la prise en charge de Pushgateway dans Prometheus, ce qui permet à Prometheus d'acquérir des mesures par lots de courte durée. Le système de surveillance et d'alerte fonctionne comme suit :</p>
<ul>
<li>Le serveur Milvus envoie des données métriques personnalisées à Pushgateway.</li>
<li>Pushgateway veille à ce que les données de mesure éphémères soient envoyées en toute sécurité à Prometheus.</li>
<li>Prometheus continue d'extraire des données de Pushgateway.</li>
<li>Alertmanager permet de définir le seuil d'alerte pour différents indicateurs et d'envoyer des alertes par courrier électronique ou par message.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Gestion des métadonnées</h3><p>Milvus utilise par défaut SQLite pour la gestion des métadonnées. SQLite est implémenté dans Milvus et ne nécessite pas de configuration. Dans un environnement de production, il est recommandé d'utiliser MySQL pour la gestion des métadonnées.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Participez à notre communauté open-source :</h3><ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
