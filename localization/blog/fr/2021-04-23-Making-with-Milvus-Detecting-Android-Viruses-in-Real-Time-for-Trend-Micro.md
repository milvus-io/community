---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: Faire avec Milvus Détecter les virus Android en temps réel pour Trend Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Découvrez comment Milvus est utilisé pour atténuer les menaces pesant sur les
  données critiques et renforcer la cybersécurité grâce à la détection des virus
  en temps réel.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Faire avec Milvus : détecter les virus Android en temps réel pour Trend Micro</custom-h1><p>La cybersécurité reste une menace persistante pour les particuliers comme pour les entreprises. En 2020, <a href="https://www.getapp.com/resources/annual-data-security-report/">86 % des entreprises</a> seront de plus en plus préoccupées par la confidentialité des données et seulement <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23 % des consommateurs</a> estimeront que leurs données personnelles sont très sûres. Les logiciels malveillants devenant de plus en plus omniprésents et sophistiqués, une approche proactive de la détection des menaces est devenue essentielle. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> est un leader mondial de la sécurité des nuages hybrides, de la défense des réseaux, de la sécurité des petites entreprises et de la sécurité des points finaux. Pour protéger les dispositifs Android contre les virus, la société a créé Trend Micro Mobile Security, une application mobile qui compare les APK (Android Application Package) du Google Play Store à une base de données de programmes malveillants connus. Le système de détection des virus fonctionne comme suit :</p>
<ul>
<li>Les APK externes (progiciel d'application Android) du Google Play Store sont explorés.</li>
<li>Les logiciels malveillants connus sont convertis en vecteurs et stockés dans <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>Les nouveaux APK sont également convertis en vecteurs, puis comparés à la base de données des logiciels malveillants à l'aide d'une recherche de similarité.</li>
<li>Si un vecteur APK est similaire à l'un des vecteurs de logiciels malveillants, l'application fournit aux utilisateurs des informations détaillées sur le virus et son niveau de menace.</li>
</ul>
<p>Pour fonctionner, le système doit effectuer une recherche de similarité très efficace sur des ensembles massifs de données vectorielles en temps réel. Au départ, Trend Micro utilisait <a href="https://www.mysql.com/">MySQL</a>. Cependant, au fur et à mesure que son activité se développait, le nombre d'APK contenant du code malveillant stockés dans sa base de données augmentait. L'équipe d'algorithmes de l'entreprise a commencé à chercher d'autres solutions de recherche de similarités vectorielles après avoir rapidement dépassé MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Comparaison des solutions de recherche de similarités vectorielles</h3><p>Il existe un certain nombre de solutions de recherche de similarités vectorielles, dont beaucoup sont open source. Bien que les circonstances varient d'un projet à l'autre, la plupart des utilisateurs ont intérêt à exploiter une base de données vectorielle conçue pour le traitement et l'analyse de données non structurées plutôt qu'une simple bibliothèque nécessitant une configuration poussée. Nous comparons ci-dessous quelques solutions populaires de recherche de similarités vectorielles et expliquons pourquoi Trend Micro a choisi Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> est une bibliothèque développée par Facebook AI Research qui permet une recherche de similarité et un regroupement efficaces de vecteurs denses. Les algorithmes qu'elle contient recherchent des vecteurs de toute taille dans des ensembles. Faiss est écrit en C++ avec des wrappers pour Python/numpy, et supporte un certain nombre d'index dont IndexFlatL2, IndexFlatIP, HNSW, et IVF.</p>
<p>Bien que Faiss soit un outil incroyablement utile, il a ses limites. Il ne fonctionne que comme une bibliothèque d'algorithmes de base, et non comme une base de données pour gérer des ensembles de données vectorielles. En outre, il n'offre pas de version distribuée, de services de surveillance, de SDK ou de haute disponibilité, qui sont les principales caractéristiques de la plupart des services basés sur le cloud.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-ins basés sur Faiss et d'autres bibliothèques de recherche ANN</h4><p>Il existe plusieurs plug-ins basés sur Faiss, NMSLIB et d'autres bibliothèques de recherche ANN qui sont conçus pour améliorer la fonctionnalité de base de l'outil sous-jacent qui les alimente. Elasticsearch (ES) est un moteur de recherche basé sur la bibliothèque Lucene avec un certain nombre de plugins de ce type. Vous trouverez ci-dessous un schéma d'architecture d'un plug-in ES :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>La prise en charge intégrée des systèmes distribués est un avantage majeur d'une solution ES. Cela permet aux développeurs de gagner du temps et aux entreprises d'économiser de l'argent grâce au code qu'il n'est pas nécessaire d'écrire. Les plug-ins ES sont techniquement avancés et répandus. Elasticsearch fournit un QueryDSL (langage spécifique au domaine), qui définit des requêtes basées sur JSON et est facile à comprendre. Un ensemble complet de services ES permet d'effectuer des recherches vectorielles/textuelles et de filtrer des données scalaires simultanément.</p>
<p>Amazon, Alibaba et Netease sont quelques grandes entreprises technologiques qui s'appuient actuellement sur les plug-ins Elasticsearch pour la recherche de similarités vectorielles. Les principaux inconvénients de cette solution sont la consommation élevée de mémoire et l'absence de prise en charge de l'optimisation des performances. En revanche, <a href="http://jd.com/">JD.com</a> a développé sa propre solution distribuée basée sur Faiss, appelée <a href="https://github.com/vearch/vearch">Vearch</a>. Cependant, Vearch est encore un projet en phase d'incubation et sa communauté open-source est relativement inactive.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> est une base de données vectorielle open-source créée par <a href="https://zilliz.com">Zilliz</a>. Elle est très flexible, fiable et très rapide. En encapsulant plusieurs bibliothèques d'index largement adoptées, telles que Faiss, NMSLIB et Annoy, Milvus fournit un ensemble complet d'API intuitives, permettant aux développeurs de choisir le type d'index idéal pour leur scénario. Il fournit également des solutions distribuées et des services de surveillance. Milvus dispose d'une communauté open-source très active et de plus de 5,5 km d'étoiles sur <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus surpasse la concurrence</h4><p>Nous avons compilé un certain nombre de résultats de tests différents provenant des diverses solutions de recherche de similarités vectorielles mentionnées ci-dessus. Comme nous pouvons le voir dans le tableau comparatif suivant, Milvus s'est avéré nettement plus rapide que la concurrence, bien qu'il ait été testé sur un ensemble de données de 1 milliard de vecteurs à 128 dimensions.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Moteur</strong></th><th style="text-align:left"><strong>Performance (ms)</strong></th><th style="text-align:left"><strong>Taille de l'ensemble de données (millions)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Pas bon</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Comparaison des solutions de recherche de similarités vectorielles.</em></h6><p>Après avoir pesé le pour et le contre de chaque solution, Trend Micro a choisi Milvus pour son modèle de recherche vectorielle. Avec des performances exceptionnelles sur des ensembles de données massifs à l'échelle du milliard, il est évident que la société a choisi Milvus pour un service de sécurité mobile qui nécessite une recherche de similarité vectorielle en temps réel.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Conception d'un système de détection de virus en temps réel</h3><p>Trend Micro possède plus de 10 millions d'APK malveillants stockés dans sa base de données MySQL, avec 100 000 nouveaux APK ajoutés chaque jour. Le système fonctionne en extrayant et en calculant les valeurs Thash des différents composants d'un fichier APK, puis utilise l'algorithme Sha256 pour le transformer en fichiers binaires et générer des valeurs Sha256 de 256 bits qui différencient l'APK des autres. Étant donné que les valeurs Sha256 varient selon les fichiers APK, un APK peut avoir une valeur Thash combinée et une valeur Sha256 unique.</p>
<p>Les valeurs Sha256 ne servent qu'à différencier les APK, et les valeurs Thash sont utilisées pour la recherche de similarités vectorielles. Des APK similaires peuvent avoir les mêmes valeurs Thash mais des valeurs Sha256 différentes.</p>
<p>Pour détecter les APK contenant un code malveillant, Trend Micro a développé son propre système de récupération des valeurs Thash similaires et des valeurs Sha256 correspondantes. Trend Micro a choisi Milvus pour effectuer une recherche instantanée de similitudes vectorielles sur des ensembles massifs de données vectorielles converties à partir des valeurs Thash. Après l'exécution de la recherche de similitudes, les valeurs Sha256 correspondantes sont interrogées dans MySQL. Une couche de mise en cache Redis est également ajoutée à l'architecture pour faire correspondre les valeurs Thash aux valeurs Sha256, ce qui réduit considérablement le temps d'interrogation.</p>
<p>Le diagramme d'architecture du système de sécurité mobile de Trend Micro est présenté ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>Le choix d'une métrique de distance appropriée permet d'améliorer les performances de la classification vectorielle et du regroupement. Le tableau suivant présente les <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">mesures de distance</a> et les index correspondants qui fonctionnent avec des vecteurs binaires.</p>
<table>
<thead>
<tr><th><strong>Métriques de distance</strong></th><th><strong>Types d'index</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- PLAT <br/> - IVF_FLAT</td></tr>
<tr><td>- Superstructure <br/> - Substructure</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Mesures de distance et index pour les vecteurs binaires.</em></h6><p><br/></p>
<p>Trend Micro convertit les valeurs Thash en vecteurs binaires et les stocke dans Milvus. Pour ce scénario, Trend Micro utilise la distance de Hamming pour comparer les vecteurs.</p>
<p>Milvus prendra bientôt en charge les ID de vecteurs sous forme de chaînes de caractères, et les ID entiers n'auront plus besoin d'être mis en correspondance avec le nom correspondant au format chaîne de caractères. Cela rend la couche de mise en cache Redis inutile et l'architecture du système moins encombrante.</p>
<p>Trend Micro adopte une solution basée sur le cloud et déploie de nombreuses tâches sur <a href="https://kubernetes.io/">Kubernetes</a>. Pour atteindre la haute disponibilité, Trend Micro utilise <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>, un middleware de sharding de cluster Milvus développé en Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro sépare le stockage et le calcul de la distance en stockant tous les vecteurs dans l'<a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) fourni par <a href="https://aws.amazon.com/">AWS</a>. Cette pratique est une tendance populaire dans l'industrie. Kubernetes est utilisé pour démarrer plusieurs nœuds de lecture, et développe des services LoadBalancer sur ces nœuds de lecture pour assurer une haute disponibilité.</p>
<p>Pour maintenir la cohérence des données, Mishards ne prend en charge qu'un seul nœud d'écriture. Toutefois, une version distribuée de Milvus prenant en charge plusieurs nœuds d'écriture sera disponible dans les mois à venir.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Fonctions de surveillance et d'alerte</h3><p>Milvus est compatible avec les systèmes de surveillance construits sur <a href="https://prometheus.io/">Prometheus</a> et utilise <a href="https://grafana.com/">Grafana</a>, une plateforme open-source pour l'analyse de séries temporelles, pour visualiser diverses mesures de performance.</p>
<p>Prometheus surveille et stocke les mesures suivantes :</p>
<ul>
<li>Mesures de performances Milvus, notamment la vitesse d'insertion, la vitesse d'interrogation et le temps de disponibilité Milvus.</li>
<li>Mesures des performances du système, notamment l'utilisation du CPU/GPU, le trafic réseau et la vitesse d'accès au disque.</li>
<li>Mesures de stockage du matériel, notamment la taille des données et le nombre total de fichiers.</li>
</ul>
<p>Le système de surveillance et d'alerte fonctionne comme suit :</p>
<ul>
<li>Un client Milvus envoie des données de mesure personnalisées à Pushgateway.</li>
<li>La passerelle Pushgateway garantit que les données de mesure éphémères sont envoyées en toute sécurité à Prometheus.</li>
<li>Prometheus continue à extraire des données de Pushgateway.</li>
<li>Alertmanager définit le seuil d'alerte pour différentes mesures et déclenche des alarmes par le biais d'e-mails ou de messages.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Performance du système</h3><p>Quelques mois se sont écoulés depuis le lancement du service ThashSearch basé sur Milvus. Le graphique ci-dessous montre que la latence des requêtes de bout en bout est inférieure à 95 millisecondes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>L'insertion est également rapide. Il faut environ 10 secondes pour insérer 3 millions de vecteurs à 192 dimensions. Avec l'aide de Milvus, les performances du système ont pu répondre aux critères de performance définis par Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Ne soyez pas un inconnu</h3><ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
