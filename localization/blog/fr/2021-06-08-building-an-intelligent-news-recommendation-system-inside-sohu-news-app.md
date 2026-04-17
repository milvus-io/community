---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Recommandation de contenu à l'aide de la recherche vectorielle sémantique
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Découvrez comment Milvus a été utilisé pour créer un système intelligent de
  recommandation de nouvelles au sein d'une application.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Création d'un système intelligent de recommandation d'actualités dans l'application Sohu News</custom-h1><p>Avec <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71 % des Américains</a> qui obtiennent leurs recommandations d'actualités à partir de plateformes sociales, le contenu personnalisé est rapidement devenu le mode de découverte des nouveaux médias. Qu'il s'agisse de rechercher des sujets spécifiques ou d'interagir avec des contenus recommandés, tout ce que les utilisateurs voient est optimisé par des algorithmes pour améliorer le taux de clics, l'engagement et la pertinence. Sohu est un groupe chinois de médias en ligne, de vidéo, de recherche et de jeux, coté au NASDAQ. Il s'est appuyé sur <a href="https://milvus.io/">Milvus</a>, une base de données vectorielles open-source créée par <a href="https://zilliz.com/">Zilliz</a>, pour créer un moteur de recherche vectorielle sémantique dans son application d'actualités. Cet article explique comment l'entreprise a utilisé les profils des utilisateurs pour affiner les recommandations de contenu personnalisées au fil du temps, améliorant ainsi l'expérience et l'engagement des utilisateurs.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Recommandation de contenu à l'aide de la recherche vectorielle sémantique<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Les profils des utilisateurs de Sohu News sont construits à partir de l'historique de navigation et ajustés au fur et à mesure que les utilisateurs recherchent et interagissent avec le contenu des actualités. Le système de recommandation de Sohu utilise la recherche vectorielle sémantique pour trouver des articles d'actualité pertinents. Le système identifie un ensemble de tags susceptibles d'intéresser chaque utilisateur en fonction de son historique de navigation. Il recherche ensuite rapidement les articles pertinents et trie les résultats en fonction de leur popularité (mesurée par le CTR moyen), avant de les proposer aux utilisateurs.</p>
<p>Le New York Times publie à lui seul <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 articles</a> par jour, ce qui donne une idée de l'ampleur du nouveau contenu qu'un système de recommandation efficace doit être capable de traiter. L'ingestion de gros volumes d'informations exige une recherche de similarités à la milliseconde et une mise en correspondance des étiquettes avec le nouveau contenu toutes les heures. Sohu a choisi Milvus parce qu'il traite des ensembles de données massifs de manière efficace et précise, réduit l'utilisation de la mémoire pendant la recherche et prend en charge les déploiements à hautes performances.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Comprendre le flux de travail d'un système de recommandation de nouvelles<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>La recommandation de contenu basée sur la recherche sémantique vectorielle de Sohu repose sur le modèle sémantique structuré profond (DSSM), qui utilise deux réseaux neuronaux pour représenter les requêtes des utilisateurs et les articles d'actualité sous forme de vecteurs. Le modèle calcule la similarité en cosinus des deux vecteurs sémantiques, puis le lot d'actualités le plus similaire est envoyé au pool de candidats à la recommandation. Ensuite, les articles sont classés en fonction de leur CTR estimé, et ceux dont le taux de clics prédit est le plus élevé sont affichés aux utilisateurs.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Codage des articles d'actualité en vecteurs sémantiques avec BERT-as-service</h3><p>Pour encoder les articles d'actualité en vecteurs sémantiques, le système utilise l'outil <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Si le nombre de mots d'un élément de contenu dépasse 512 lors de l'utilisation de ce modèle, une perte d'informations se produit au cours du processus d'intégration. Pour y remédier, le système extrait d'abord un résumé et l'encode dans un vecteur sémantique à 768 dimensions. Ensuite, les deux sujets les plus pertinents de chaque article sont extraits, et les vecteurs de sujets pré-entraînés correspondants (200 dimensions) sont identifiés sur la base de l'ID du sujet. Ensuite, les vecteurs thématiques sont intégrés au vecteur sémantique de 768 dimensions extrait du résumé de l'article, formant ainsi un vecteur sémantique de 968 dimensions.</p>
<p>De nouveaux contenus arrivent en permanence par Kafta et sont convertis en vecteurs sémantiques avant d'être insérés dans la base de données Milvus.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Extraction d'étiquettes sémantiquement similaires à partir de profils d'utilisateurs avec BERT-as-service</h3><p>L'autre réseau neuronal du modèle est le vecteur sémantique de l'utilisateur. Des étiquettes sémantiquement similaires (par exemple, coronavirus, covid, COVID-19, pandémie, nouvelle souche, pneumonie) sont extraites des profils d'utilisateurs en fonction des intérêts, des requêtes de recherche et de l'historique de navigation. La liste des balises acquises est triée en fonction de leur poids et les 200 premières sont divisées en différents groupes sémantiques. Les permutations des étiquettes au sein de chaque groupe sémantique sont utilisées pour générer de nouvelles phrases d'étiquettes, qui sont ensuite encodées dans des vecteurs sémantiques par l'intermédiaire de BERT-aservice</p>
<p>Pour chaque profil d'utilisateur, les ensembles de mots-clés ont un <a href="https://github.com/baidu/Familia">ensemble correspondant de sujets</a> qui sont marqués par un poids indiquant le niveau d'intérêt de l'utilisateur. Les deux sujets les plus importants parmi tous les sujets pertinents sont sélectionnés et encodés par le modèle d'apprentissage machine (ML) pour être insérés dans le vecteur sémantique de l'étiquette correspondante, formant ainsi un vecteur sémantique de l'utilisateur à 968 dimensions. Même si le système génère les mêmes étiquettes pour différents utilisateurs, des poids différents pour les étiquettes et leurs sujets correspondants, ainsi qu'une variance explicite entre les vecteurs de sujets de chaque utilisateur, garantissent que les recommandations sont uniques</p>
<p>Le système est capable de faire des recommandations d'actualités personnalisées en calculant la similarité en cosinus des vecteurs sémantiques extraits à la fois des profils d'utilisateurs et des articles d'actualité.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Calcul de nouveaux vecteurs sémantiques de profils d'utilisateurs et insertion dans Milvus</h3><p>Les vecteurs sémantiques des profils d'utilisateurs sont calculés quotidiennement, les données de la période de 24 heures précédente étant traitées le soir suivant. Les vecteurs sont insérés individuellement dans Milvus et exécutés dans le processus d'interrogation afin de fournir aux utilisateurs des résultats d'actualité pertinents. Le contenu des actualités est intrinsèquement d'actualité, ce qui nécessite un calcul toutes les heures pour générer un fil d'actualité contenant un contenu dont le taux de clics prédit est élevé et qui est pertinent pour les utilisateurs. Le contenu des actualités est également trié en partitions par date, et les anciennes actualités sont éliminées quotidiennement.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Réduction du temps d'extraction des vecteurs sémantiques de plusieurs jours à quelques heures</h3><p>L'extraction de contenu à l'aide de vecteurs sémantiques nécessite de convertir chaque jour des dizaines de millions de mots-clés en vecteurs sémantiques. Il s'agit d'un processus fastidieux qui prendrait plusieurs jours, même en utilisant des processeurs graphiques (GPU), qui accélèrent ce type de calcul. Pour résoudre ce problème technique, les vecteurs sémantiques issus de l'intégration précédente doivent être optimisés de manière à ce que les vecteurs sémantiques correspondants soient directement récupérés lorsque des mots-clés similaires font surface.</p>
<p>Le vecteur sémantique de l'ensemble existant de phrases-clés est stocké, et un nouvel ensemble de phrases-clés généré quotidiennement est encodé dans des vecteurs MinHash. La <a href="https://milvus.io/docs/v1.1.1/metric.md">distance de Jaccard</a> est utilisée pour calculer la similarité entre le vecteur MinHash de la nouvelle phrase-clé et le vecteur de la phrase-clé sauvegardée. Si la distance de Jaccard dépasse un seuil prédéfini, les deux ensembles sont considérés comme similaires. Si le seuil de similarité est atteint, les nouvelles phrases peuvent exploiter les informations sémantiques des enregistrements précédents. Les tests suggèrent qu'une distance supérieure à 0,8 devrait garantir une précision suffisante dans la plupart des situations.</p>
<p>Grâce à ce processus, la conversion quotidienne des dizaines de millions de vecteurs mentionnés ci-dessus est ramenée de plusieurs jours à environ deux heures. Bien que d'autres méthodes de stockage des vecteurs sémantiques puissent être plus appropriées en fonction des exigences spécifiques d'un projet, le calcul de la similarité entre deux mots-clés à l'aide de la distance de Jaccard dans une base de données Milvus reste une méthode efficace et précise dans une grande variété de scénarios.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Surmonter les "mauvais cas" de la classification des textes courts<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la classification de textes d'actualité, les articles courts ont moins de caractéristiques à extraire que les articles plus longs. C'est pourquoi les algorithmes de classification échouent lorsque des contenus de différentes longueurs sont traités par le même classificateur. Milvus aide à résoudre ce problème en recherchant plusieurs éléments d'information sur la classification des textes longs avec une sémantique similaire et des scores fiables, puis en utilisant un mécanisme de vote pour modifier la classification des textes courts.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Identification et résolution des textes courts mal classés</h3><p>La classification précise de chaque article d'actualité est essentielle pour fournir des recommandations de contenu utiles. Étant donné que les articles courts ont moins de caractéristiques, l'application du même classificateur à des articles de longueurs différentes entraîne un taux d'erreur plus élevé pour la classification des textes courts. L'étiquetage humain est trop lent et imprécis pour cette tâche, c'est pourquoi BERT-as-service et Milvus sont utilisés pour identifier rapidement les textes courts mal classés dans les lots, les reclasser correctement, puis utiliser les lots de données comme corpus pour l'entraînement contre ce problème.</p>
<p>BERT-as-service est utilisé pour coder en vecteurs sémantiques un nombre total de cinq millions d'articles d'actualité longs dont le score du classificateur est supérieur à 0,9. Après avoir inséré les articles longs dans Milvus, les nouvelles courtes sont codées en vecteurs sémantiques. Chaque vecteur sémantique de nouvelles courtes est utilisé pour interroger la base de données Milvus et obtenir les 20 premiers articles longs présentant la plus grande similarité en cosinus avec la nouvelle courte cible. Si 18 des 20 articles longs les plus similaires sur le plan sémantique semblent appartenir à la même classification et que celle-ci diffère de celle de l'article court interrogé, la classification de l'article court est considérée comme incorrecte et doit être ajustée pour s'aligner sur les 18 articles longs.</p>
<p>Ce processus permet d'identifier et de corriger rapidement les classifications inexactes des textes courts. Les statistiques d'échantillonnage aléatoire montrent qu'une fois les classifications de textes courts corrigées, la précision globale de la classification des textes dépasse 95 %. En tirant parti de la classification de textes longs à haute fiabilité pour corriger la classification de textes courts, la majorité des cas de mauvaise classification sont corrigés en peu de temps. Il s'agit également d'un bon corpus pour l'entraînement d'un classificateur de textes courts.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Organigramme de découverte des "mauvais cas" de classification de textes courts.")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus peut alimenter la recommandation de contenu d'actualités en temps réel et plus encore<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus a considérablement amélioré les performances en temps réel du système de recommandation de nouvelles de Sohu et a également renforcé l'efficacité de l'identification des textes courts mal classés. Si vous souhaitez en savoir plus sur Milvus et ses différentes applications :</p>
<ul>
<li>Lisez notre <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagissez avec notre communauté open-source sur <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilisez ou contribuez à la base de données vectorielle la plus populaire au monde sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testez et déployez rapidement des applications d'IA avec notre nouveau <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
