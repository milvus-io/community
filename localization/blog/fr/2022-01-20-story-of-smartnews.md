---
id: 2022-01-20-story-of-smartnews.md
title: L'histoire de SmartNews - d'un utilisateur de Milvus à un contributeur actif
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: >-
  Découvrez l'histoire de SmartNews, à la fois utilisateur et contributeur de
  Milvus.
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Cet article est traduit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
<p>L'information est omniprésente dans nos vies. Meta (anciennement connu sous le nom de Facebook), Instagram, Twitter et d'autres plateformes de médias sociaux rendent les flux d'informations d'autant plus omniprésents. Par conséquent, les moteurs qui traitent ces flux d'informations sont devenus incontournables dans la plupart des architectures de systèmes. Cependant, en tant qu'utilisateur de plateformes de médias sociaux et d'applications pertinentes, je parie que vous avez dû être gêné par des articles, des nouvelles, des mèmes et bien d'autres choses encore en double. L'exposition au contenu dupliqué entrave le processus de recherche d'informations et conduit à une mauvaise expérience utilisateur.</p>
<p>Pour un produit traitant des flux d'informations, il est prioritaire pour les développeurs de trouver un processeur de données flexible qui peut être intégré de manière transparente dans l'architecture du système afin de dédupliquer les nouvelles ou les publicités identiques.</p>
<p><a href="https://www.smartnews.com/en/">SmartNews</a>, évaluée à <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2 milliards de dollars américains</a>, est la société d'applications d'actualités la plus valorisée aux États-Unis. Elle était auparavant un utilisateur de Milvus, une base de données vectorielles open-source, avant de devenir un contributeur actif au projet Milvus.</p>
<p>Cet article raconte l'histoire de SmartNews et explique pourquoi elle a décidé de contribuer au projet Milvus.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Aperçu de SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews, fondée en 2012, a son siège à Tokyo, au Japon. L'application d'actualités développée par SmartNews a toujours été <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">la mieux notée</a> sur le marché japonais. SmartNews est l'application d'actualités <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">qui connaît la croissance la plus rapide</a> et se targue également d'une <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">grande viscosité d'utilisateurs</a> sur le marché américain. Selon les statistiques d'<a href="https://www.appannie.com/en/">APP Annie</a>, la durée de session moyenne mensuelle de SmartNews était la première parmi toutes les applications d'actualités à la fin du mois de juillet 2021, supérieure à la durée de session cumulée d'AppleNews et de Google News.</p>
<p>Avec la croissance rapide de la base d'utilisateurs et de la viscosité, SmartNews doit faire face à davantage de défis en termes de mécanisme de recommandation et d'algorithme d'IA. Ces défis comprennent l'utilisation de caractéristiques discrètes massives dans l'apprentissage automatique à grande échelle, l'accélération de la recherche de données non structurées avec la recherche de similarité vectorielle, et plus encore.</p>
<p>Au début de l'année 2021, l'équipe chargée de l'algorithme publicitaire dynamique de SmartNews a demandé à l'équipe chargée de l'infrastructure d'IA d'optimiser les fonctions de rappel et d'interrogation des publicités. Après deux mois de recherche, l'ingénieur de l'infrastructure d'IA Shu a décidé d'utiliser Milvus, une base de données vectorielle open-source qui prend en charge plusieurs index et métriques de similarité ainsi que des mises à jour de données en ligne. Plus d'un millier d'organisations dans le monde font confiance à Milvus.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Recommandation publicitaire basée sur la recherche de similarités vectorielles<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>La base de données vectorielles open-source Milvus est adoptée dans le système publicitaire de SmartNews pour faire correspondre et recommander à ses utilisateurs des publicités dynamiques provenant d'un ensemble de données à l'échelle de 10 millions. Ce faisant, SmartNews peut créer une relation de correspondance entre deux ensembles de données qui n'étaient pas compatibles auparavant - les données des utilisateurs et les données des publicités. Au deuxième trimestre 2021, Shu a réussi à déployer Milvus 1.0 sur Kubernetes. En savoir plus sur le <a href="https://milvus.io/docs">déploiement de Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Après le déploiement réussi de Milvus 1.0, le premier projet à utiliser Milvus a été le projet de rappel de publicité lancé par l'équipe publicitaire de SmartNews. Au cours de la phase initiale, l'ensemble de données publicitaires était à l'échelle d'un million. Parallèlement, la latence P99 était strictement contrôlée à moins de 10 millisecondes.</p>
<p>En juin 2021, Shu et ses collègues de l'équipe chargée des algorithmes ont appliqué Milvus à d'autres scénarios commerciaux et ont tenté d'agréger des données et de mettre à jour des données/index en ligne en temps réel.</p>
<p>À ce jour, Milvus, la base de données vectorielles open-source, a été utilisée dans divers scénarios commerciaux chez SmartNews, y compris la recommandation d'annonces.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>D'un utilisateur à un contributeur actif</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de l'intégration de Milvus dans l'architecture du produit Smartnews, Shu et d'autres développeurs ont formulé des demandes de fonctions telles que le rechargement à chaud, le TTL (time-to-live) des articles, la mise à jour/remplacement des articles, etc. Ces fonctions sont également souhaitées par de nombreux utilisateurs de la communauté Milvus. C'est pourquoi Dennis Zhao, chef de l'équipe de l'infrastructure de l'IA à SmartNews, a décidé de développer la fonction de rechargement à chaud et d'en faire profiter la communauté. Dennis estime que "l'équipe de SmartNews a bénéficié de la communauté Milvus, nous sommes donc plus que disposés à contribuer si nous avons quelque chose à partager avec la communauté".</p>
<p>Le rechargement des données permet d'éditer le code tout en l'exécutant. Grâce au rechargement des données, les développeurs n'ont plus besoin de s'arrêter à un point d'arrêt ou de redémarrer l'application. Au lieu de cela, ils peuvent modifier le code directement et voir le résultat en temps réel.</p>
<p>Fin juillet, Yusup, ingénieur chez SmartNews, a proposé l'idée d'utiliser les <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">alias de collection</a> pour réaliser le rechargement à chaud.</p>
<p>La création d'alias de collection fait référence à la spécification de noms d'alias pour une collection. Une collection peut avoir plusieurs alias. Cependant, un alias correspond à un maximum d'une collection. Il suffit de faire une analogie entre une collection et un casier. Un casier, comme une collection, a son propre numéro et sa propre position, qui resteront toujours inchangés. Cependant, il est toujours possible d'y déposer ou d'en retirer des objets différents. De même, le nom de la collection est fixe, mais les données qu'elle contient sont dynamiques. Vous pouvez toujours insérer ou supprimer des vecteurs dans une collection, car la suppression de données est prise en charge dans la <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">version pré-GA</a> de Milvus.</p>
<p>Dans le cas de l'activité publicitaire de SmartNews, près de 100 millions de vecteurs sont insérés ou mis à jour à mesure que de nouveaux vecteurs publicitaires dynamiques sont générés. Il existe plusieurs solutions à ce problème :</p>
<ul>
<li>Solution 1 : supprimer d'abord les anciennes données et en insérer de nouvelles.</li>
<li>Solution 2 : créer une nouvelle collection pour les nouvelles données.</li>
<li>Solution 3 : utiliser un alias de collection.</li>
</ul>
<p>Pour la solution 1, l'un des défauts les plus évidents est qu'elle prend énormément de temps, en particulier lorsque l'ensemble de données à mettre à jour est énorme. Il faut généralement des heures pour mettre à jour un ensemble de données à l'échelle de 100 millions.</p>
<p>Quant à la solution 2, le problème est que la nouvelle collection n'est pas immédiatement disponible pour la recherche. En d'autres termes, une collection n'est pas consultable pendant le chargement. De plus, Milvus ne permet pas à deux collections d'utiliser le même nom de collection. Le passage à une nouvelle collection nécessiterait toujours que les utilisateurs modifient manuellement le code côté client. En d'autres termes, les utilisateurs doivent réviser la valeur du paramètre <code translate="no">collection_name</code> chaque fois qu'ils doivent passer d'une collection à l'autre.</p>
<p>La solution 3 serait la solution miracle. Il vous suffit d'insérer les nouvelles données dans une nouvelle collection et d'utiliser l'alias de collection. Ce faisant, il vous suffit de changer d'alias de collection chaque fois que vous devez passer d'une collection à l'autre pour effectuer une recherche. Vous n'avez pas besoin d'efforts supplémentaires pour réviser le code. Cette solution vous évite les problèmes mentionnés dans les deux solutions précédentes.</p>
<p>Yusup est parti de cette demande et a aidé toute l'équipe de SmartNews à comprendre l'architecture de Milvus. Après un mois et demi, le projet Milvus a reçu de Yusup une PR sur le rechargement à chaud. Plus tard, cette fonction est officiellement disponible avec la sortie de Milvus 2.0.0-RC7.</p>
<p>Actuellement, l'équipe chargée de l'infrastructure de l'IA prend l'initiative de déployer Milvus 2.0 et de migrer progressivement toutes les données de Milvus 1.0 vers 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>alias de collection img</span> </span></p>
<p>La prise en charge des alias de collection peut grandement améliorer l'expérience de l'utilisateur, en particulier pour les grandes entreprises Internet qui reçoivent un grand nombre de demandes d'utilisateurs. Chenglong Li, ingénieur de données de la communauté Milvus, qui a aidé à construire le pont entre Milvus et Smartnews, a déclaré : "La fonction d'alias de collection découle d'une demande commerciale réelle de SmartNews, un utilisateur de Milvus. Et SmartNews a fourni le code à la communauté Milvus. Cet acte de réciprocité est un excellent exemple de l'esprit open-source : de la communauté et pour la communauté. Nous espérons voir plus de contributeurs comme SmartNews et construire ensemble une communauté Milvus plus prospère".</p>
<p>"Actuellement, une partie de l'activité publicitaire adopte Milvus comme base de données vectorielles hors ligne. La sortie officielle de Milvus 2.0 approche, et nous espérons pouvoir utiliser Milvus pour construire des systèmes plus fiables et fournir des services en temps réel pour davantage de scénarios commerciaux", a déclaré Dennis.</p>
<blockquote>
<p>Mise à jour : Milvus 2.0 est maintenant disponible ! <a href="/blog/fr/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">En savoir plus</a></p>
</blockquote>
