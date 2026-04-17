---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Contexte Introduction
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: >-
  Comment construire un système de recommandation basé sur l'apprentissage
  profond ?
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Construire des systèmes de recommandation personnalisés avec Milvus et PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Contexte Introduction<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec le développement continu de la technologie des réseaux et l'expansion constante du commerce électronique, le nombre et la variété des produits augmentent rapidement et les utilisateurs doivent consacrer beaucoup de temps à la recherche des produits qu'ils souhaitent acheter. Il s'agit d'une surcharge d'informations. Pour résoudre ce problème, les systèmes de recommandation ont vu le jour.</p>
<p>Le système de recommandation est un sous-ensemble du système de filtrage de l'information, qui peut être utilisé dans une série de domaines tels que les films, la musique, le commerce électronique et les recommandations de flux d'alimentation. Le système de recommandation découvre les besoins et les intérêts personnalisés de l'utilisateur en analysant et en explorant ses comportements, et recommande des informations ou des produits susceptibles d'intéresser l'utilisateur. Contrairement aux moteurs de recherche, les systèmes de recommandation ne demandent pas aux utilisateurs de décrire précisément leurs besoins, mais modélisent leur comportement historique afin de fournir de manière proactive des informations qui répondent aux intérêts et aux besoins de l'utilisateur.</p>
<p>Dans cet article, nous utilisons PaddlePaddle, une plateforme d'apprentissage profond de Baidu, pour construire un modèle et nous combinons Milvus, un moteur de recherche par similarité vectorielle, pour construire un système de recommandation personnalisé qui peut rapidement et précisément fournir aux utilisateurs des informations intéressantes.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Préparation des données<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous prenons l'ensemble de données MovieLens Million (ml-1m) [1] comme exemple. L'ensemble de données ml-1m contient 1 000 000 de critiques de 4 000 films par 6 000 utilisateurs, collectées par le laboratoire de recherche GroupLens. Les données originales comprennent les caractéristiques du film, les caractéristiques de l'utilisateur et l'évaluation du film par l'utilisateur. Vous pouvez vous référer à ml-1m-README [2].</p>
<p>L'ensemble de données ml-1m comprend 3 articles .dat : movies.dat、users.dat et ratings.dat.movies.dat comprend les caractéristiques du film, voir l'exemple ci-dessous :</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Cela signifie que l'identifiant du film est 1, et que le titre est 《Toy Story》, qui est divisé en trois catégories. Ces trois catégories sont l'animation, les enfants et la comédie.</p>
<p>users.dat comprend les caractéristiques de l'utilisateur, voir l'exemple ci-dessous :</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Cela signifie que l'identifiant de l'utilisateur est 1, qu'il est de sexe féminin et qu'il a moins de 18 ans. L'identifiant de la profession est 10.</p>
<p>ratings.dat contient les caractéristiques de l'évaluation des films, voir l'exemple ci-dessous :</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Cela signifie que l'utilisateur 1 évalue le film 1193 à 5 points.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Modèle de recommandation par fusion<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans le système de recommandation personnalisée de films, nous avons utilisé le modèle de recommandation de fusion [3] mis en œuvre par PaddlePaddle. Ce modèle a été créé à partir de sa pratique industrielle.</p>
<p>Tout d'abord, le réseau neuronal est alimenté par les caractéristiques de l'utilisateur et les caractéristiques du film :</p>
<ul>
<li>Les caractéristiques de l'utilisateur intègrent quatre attributs : l'ID de l'utilisateur, le sexe, la profession et l'âge.</li>
<li>Les caractéristiques des films intègrent trois attributs : l'ID du film, l'ID du type de film et le nom du film.</li>
</ul>
<p>Pour les caractéristiques de l'utilisateur, l'ID de l'utilisateur est converti en une représentation vectorielle d'une dimension de 256, qui entre dans la couche entièrement connectée, et un traitement similaire est effectué pour les trois autres attributs. Ensuite, les représentations des caractéristiques des quatre attributs sont entièrement connectées et ajoutées séparément.</p>
<p>Pour les caractéristiques des films, l'identifiant du film est traité de la même manière que l'identifiant de l'utilisateur. L'identifiant du type de film est directement introduit dans la couche entièrement connectée sous la forme d'un vecteur, et le nom du film est représenté par un vecteur de longueur fixe à l'aide d'un réseau neuronal convolutionnel textuel. Les représentations des caractéristiques des trois attributs sont ensuite entièrement connectées et ajoutées séparément.</p>
<p>Après avoir obtenu la représentation vectorielle de l'utilisateur et du film, on calcule la similarité cosinusoïdale entre eux comme score du système de recommandation personnalisé. Enfin, le carré de la différence entre le score de similarité et le score réel de l'utilisateur est utilisé comme fonction de perte du modèle de régression.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-utilisateur-film-recommandation-personnalisée-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Vue d'ensemble du système<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Combiné au modèle de recommandation par fusion de PaddlePaddle, le vecteur de caractéristiques du film généré par le modèle est stocké dans le moteur de recherche de similarité vectorielle Milvus, et la caractéristique de l'utilisateur est utilisée comme vecteur cible à rechercher. La recherche de similarité est effectuée dans Milvus pour obtenir le résultat de la requête en tant que films recommandés à l'utilisateur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>La méthode du produit intérieur (PI) est fournie dans Milvus pour calculer la distance vectorielle. Après normalisation des données, la similarité du produit intérieur est cohérente avec le résultat de la similarité cosinus dans le modèle de recommandation de fusion.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Application du système de recommandation personnelle<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>La création d'un système de recommandation personnalisé avec Milvus se fait en trois étapes. Pour plus de détails sur le fonctionnement, veuillez vous reporter à Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Étape 1：Formation au modèle</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>L'exécution de cette commande génère un modèle recommender_system.inference.model dans le répertoire, qui peut convertir les données du film et les données de l'utilisateur en vecteurs de caractéristiques, et générer des données d'application pour que Milvus les stocke et les récupère.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Étape 2：Prétraitement des données</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>L'exécution de cette commande génère des données de test movies_data.txt dans le répertoire pour réaliser le prétraitement des données cinématographiques.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Etape 3：Implémentation d'un système de recommandation personnel avec Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>L'exécution de cette commande permet de mettre en œuvre des recommandations personnalisées pour les utilisateurs spécifiés.</p>
<p>Le processus principal est le suivant :</p>
<ul>
<li>Par le biais de load_inference_model, les données cinématographiques sont traitées par le modèle pour générer un vecteur de caractéristiques cinématographiques.</li>
<li>Charger le vecteur de caractéristiques de films dans Milvus via milvus.insert.</li>
<li>En fonction de l'âge, du sexe et de la profession de l'utilisateur spécifiés par les paramètres, il est converti en un vecteur de caractéristiques de l'utilisateur, milvus.search_vectors est utilisé pour la recherche de similarité et le résultat présentant la plus grande similarité entre l'utilisateur et le film est renvoyé.</li>
</ul>
<p>Prédiction des cinq meilleurs films qui intéressent l'utilisateur :</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>En saisissant les informations relatives à l'utilisateur et au film dans le modèle de recommandation par fusion, nous pouvons obtenir des scores de correspondance, puis trier les scores de tous les films en fonction de l'utilisateur afin de recommander des films susceptibles d'intéresser l'utilisateur. <strong>Cet article combine Milvus et PaddlePaddle pour construire un système de recommandation personnalisé. Milvus, un moteur de recherche vectoriel, est utilisé pour stocker toutes les données relatives aux caractéristiques des films, puis la recherche de similarités est effectuée sur les caractéristiques de l'utilisateur dans Milvus.</strong> Le résultat de la recherche est le classement des films recommandés par le système à l'utilisateur.</p>
<p>Le moteur de recherche de similarités vectorielles Milvus [5] est compatible avec diverses plateformes d'apprentissage en profondeur et recherche des milliards de vecteurs avec une réponse de quelques millisecondes seulement. Vous pouvez explorer plus de possibilités d'applications d'IA avec Milvus en toute simplicité !</p>
<h2 id="Reference" class="common-anchor-header">Référence<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m) : http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README : http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Modèle de recommandation de fusion par PaddlePaddle : https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp : https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus : https://milvus.io/</li>
</ol>
