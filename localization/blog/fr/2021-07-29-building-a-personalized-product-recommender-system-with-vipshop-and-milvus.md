---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Architecture générale
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  Milvus facilite la fourniture de services de recommandation personnalisés aux
  utilisateurs.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Création d'un système de recommandation de produits personnalisé avec Vipshop et Milvus</custom-h1><p>Avec la croissance explosive de l'échelle des données Internet, la quantité et la catégorie des produits dans les plateformes de commerce électronique courantes augmentent d'une part, et la difficulté pour les utilisateurs de trouver les produits dont ils ont besoin s'accroît d'autre part.</p>
<p><a href="https://www.vip.com/">Vipshop</a> est l'un des principaux détaillants en ligne de produits de marque à prix réduits en Chine. La société propose des produits de marque populaires et de haute qualité aux consommateurs dans toute la Chine, avec une réduction significative par rapport aux prix de vente au détail. Afin d'optimiser l'expérience d'achat de ses clients, l'entreprise a décidé de mettre en place un système de recommandation de recherche personnalisé basé sur les mots-clés de la requête de l'utilisateur et les portraits de l'utilisateur.</p>
<p>La fonction principale du système de recommandation de recherche pour le commerce électronique est d'extraire les produits appropriés d'un grand nombre de produits et de les afficher aux utilisateurs en fonction de leur intention de recherche et de leurs préférences. Dans ce processus, le système doit calculer la similarité entre les produits et les intentions et préférences de recherche des utilisateurs, et recommander aux utilisateurs les produits TopK présentant la plus grande similarité.</p>
<p>Les données telles que les informations sur les produits, les intentions de recherche des utilisateurs et leurs préférences sont toutes des données non structurées. Nous avons essayé de calculer la similarité de ces données en utilisant CosineSimilarity(7.x) du moteur de recherche Elasticsearch (ES), mais cette approche présente les inconvénients suivants.</p>
<ul>
<li><p>Temps de réponse long - le temps de latence moyen pour récupérer les résultats du TopK à partir de millions d'éléments est d'environ 300 ms.</p></li>
<li><p>Coût de maintenance élevé des index ES - le même ensemble d'index est utilisé pour les vecteurs de caractéristiques des produits de base et d'autres données connexes, ce qui facilite à peine la construction de l'index, mais produit une quantité massive de données.</p></li>
</ul>
<p>Nous avons essayé de développer notre propre plug-in de hachage sensible localement pour accélérer le calcul de la similitude cosinus de l'ES. Bien que les performances et le débit aient été considérablement améliorés après l'accélération, la latence de plus de 100 ms était encore difficile à satisfaire pour les besoins réels de recherche de produits en ligne.</p>
<p>Après une recherche approfondie, nous avons décidé d'utiliser Milvus, une base de données vectorielle open source, qui présente l'avantage de prendre en charge le déploiement distribué, les SDK multilingues, la séparation lecture/écriture, etc. par rapport à Faiss, une base de données autonome couramment utilisée.</p>
<p>À l'aide de divers modèles d'apprentissage profond, nous convertissons des données massives non structurées en vecteurs de caractéristiques et importons les vecteurs dans Milvus. Grâce aux excellentes performances de Milvus, notre système de recommandation de recherche de commerce électronique peut interroger efficacement les vecteurs TopK qui sont similaires aux vecteurs cibles.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Architecture générale<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Architecture] (https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Architecture.&quot;) Comme le montre le diagramme, l'architecture globale du système se compose de deux parties principales.</p>
<ul>
<li><p>Processus d'écriture : les vecteurs de caractéristiques d'éléments (ci-après dénommés vecteurs d'éléments) générés par le modèle d'apprentissage profond sont normalisés et écrits dans MySQL. MySQL lit ensuite les vecteurs d'éléments traités à l'aide de l'outil de synchronisation des données (ETL) et les importe dans la base de données vectorielle Milvus.</p></li>
<li><p>Processus de lecture : Le service de recherche obtient les vecteurs de caractéristiques des préférences de l'utilisateur (ci-après dénommés vecteurs de l'utilisateur) sur la base des mots clés et des portraits de l'utilisateur, interroge les vecteurs similaires dans Milvus et rappelle les vecteurs d'éléments TopK.</p></li>
</ul>
<p>Milvus prend en charge à la fois la mise à jour incrémentielle des données et la mise à jour complète des données. Chaque mise à jour incrémentale doit supprimer le vecteur d'éléments existant et insérer un nouveau vecteur d'éléments, ce qui signifie que chaque collection nouvellement mise à jour sera réindexée. Cette méthode convient mieux au scénario dans lequel il y a plus de lectures et moins d'écritures. C'est pourquoi nous choisissons la méthode de mise à jour de l'ensemble des données. En outre, il ne faut que quelques minutes pour écrire l'ensemble des données par lots de plusieurs partitions, ce qui équivaut à des mises à jour en temps quasi réel.</p>
<p>Les nœuds d'écriture Milvus effectuent toutes les opérations d'écriture, y compris la création de collections de données, la construction d'index, l'insertion de vecteurs, etc. et fournissent des services au public avec des noms de domaine d'écriture. Les nœuds de lecture Milvus exécutent toutes les opérations de lecture et fournissent des services au public avec des noms de domaine en lecture seule.</p>
<p>Alors que la version actuelle de Milvus ne prend pas en charge le changement d'alias de collection, nous introduisons Redis pour changer d'alias de manière transparente entre plusieurs collections de données entières.</p>
<p>Le nœud de lecture n'a besoin que de lire les informations de métadonnées existantes et les données vectorielles ou les index de MySQL, Milvus et du système de fichiers distribué GlusterFS, de sorte que la capacité de lecture peut être étendue horizontalement en déployant plusieurs instances.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Détails de la mise en œuvre<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Mise à jour des données</h3><p>Le service de mise à jour des données comprend non seulement l'écriture des données vectorielles, mais aussi la détection du volume de données des vecteurs, la construction de l'index, le préchargement de l'index, le contrôle des alias, etc. Le processus global est le suivant : <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Processus</span> </span></p>
<ol>
<li><p>Supposons qu'avant de construire l'ensemble des données, la CollectionA fournisse un service de données au public et que l'ensemble des données utilisées soit dirigé vers la CollectionA (<code translate="no">redis key1 = CollectionA</code>). L'objectif de la construction de l'ensemble des données est de créer une nouvelle collection, la CollectionB.</p></li>
<li><p>Vérification des données sur les marchandises - vérification du numéro d'article des données sur les marchandises dans la table MySQL, comparaison des données sur les marchandises avec les données existantes dans la CollectionA. L'alerte peut être définie en fonction de la quantité ou du pourcentage. Si la quantité (pourcentage) définie n'est pas atteinte, l'ensemble des données ne sera pas construit et sera considéré comme un échec de cette opération de construction, ce qui déclenchera l'alerte ; une fois que la quantité (pourcentage) définie est atteinte, l'ensemble du processus de construction des données démarre.</p></li>
<li><p>Commencer à construire l'ensemble des données - initialiser l'alias de l'ensemble des données en cours de construction et mettre à jour Redis. Après la mise à jour, l'alias de l'ensemble des données en cours de construction est dirigé vers la collection B (<code translate="no">redis key2 = CollectionB</code>).</p></li>
<li><p>Créer une nouvelle collection entière - déterminer si la CollectionB existe. Si c'est le cas, supprimez-la avant d'en créer une nouvelle.</p></li>
<li><p>Écriture des données par lots - calculer l'ID de partition de chaque donnée de produit avec son propre ID en utilisant l'opération modulo, et écrire les données sur plusieurs partitions dans la collection nouvellement créée par lots.</p></li>
<li><p>Construction et préchargement de l'index - Création d'un index (<code translate="no">createIndex()</code>) pour la nouvelle collection. Le fichier d'index est stocké dans le serveur de stockage distribué GlusterFS. Le système simule automatiquement une requête sur la nouvelle collection et précharge l'index pour l'échauffement de la requête.</p></li>
<li><p>Vérification des données de la collection - vérification du nombre d'éléments de données dans la nouvelle collection, comparaison des données avec la collection existante et définition d'alarmes basées sur la quantité et le pourcentage. Si le nombre (pourcentage) fixé n'est pas atteint, la collection ne sera pas commutée et le processus de construction sera considéré comme un échec, ce qui déclenchera l'alerte.</p></li>
<li><p>Commutation de la collection - Contrôle des alias. Après la mise à jour de Redis, l'ensemble de l'alias de données utilisé est dirigé vers la collection B (<code translate="no">redis key1 = CollectionB</code>), la clé Redis2 d'origine est supprimée et le processus de construction est terminé.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Rappel des données</h3><p>Les données de partition Milvus sont appelées plusieurs fois pour calculer la similarité entre les vecteurs d'utilisateur, obtenus sur la base des mots clés de la requête de l'utilisateur et du portrait de l'utilisateur, et le vecteur d'élément, et les vecteurs d'élément TopK sont renvoyés après la fusion. Le schéma général du flux de travail est le suivant : <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>Flux de travail</span>Le </span>tableau suivant énumère les principaux services impliqués dans ce processus. On peut constater que la latence moyenne pour le rappel des vecteurs TopK est d'environ 30 ms.</p>
<table>
<thead>
<tr><th><strong>Service</strong></th><th><strong>Rôle</strong></th><th><strong>Paramètres d'entrée</strong></th><th><strong>Paramètres de sortie</strong></th><th><strong>Temps de réponse</strong></th></tr>
</thead>
<tbody>
<tr><td>Acquisition des vecteurs utilisateurs</td><td>Obtention du vecteur utilisateur</td><td>informations sur l'utilisateur + requête</td><td>vecteur utilisateur</td><td>10 ms</td></tr>
<tr><td>Recherche Milvus</td><td>Calculer la similarité des vecteurs et renvoyer les résultats TopK</td><td>vecteur utilisateur</td><td>vecteur de l'article</td><td>10 ms</td></tr>
<tr><td>Logique d'ordonnancement</td><td>Rappel et fusion simultanés des résultats</td><td>Vecteurs d'éléments rappelés par plusieurs canaux et score de similarité</td><td>TopK éléments</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>Processus de mise en œuvre :</strong></p>
<ol>
<li>Sur la base des mots-clés de la requête de l'utilisateur et du portrait de l'utilisateur, le vecteur de l'utilisateur est calculé par le modèle d'apprentissage profond.</li>
<li>Obtenir l'alias de collection de l'ensemble des données utilisées à partir de Redis currentInUseKeyRef et obtenir Milvus CollectionName. Ce processus est un service de synchronisation des données, c'est-à-dire qu'il bascule l'alias vers Redis après la mise à jour de l'ensemble des données.</li>
<li>Milvus est appelé simultanément et de manière asynchrone avec le vecteur utilisateur pour obtenir les données de différentes partitions de la même collection, et Milvus calcule la similarité entre le vecteur utilisateur et le vecteur élément, et renvoie les TopK vecteurs élément similaires dans chaque partition.</li>
<li>Fusionner les TopK vecteurs d'éléments renvoyés par chaque partition et classer les résultats dans l'ordre inverse de la distance de similarité, qui est calculée à l'aide du produit intérieur IP (plus la distance entre les vecteurs est grande, plus ils sont similaires). Les vecteurs d'éléments TopK finaux sont renvoyés.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">Perspectives d'avenir<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>À l'heure actuelle, la recherche vectorielle basée sur Milvus peut être utilisée régulièrement dans la recherche de scénarios de recommandation, et ses performances élevées nous laissent une plus grande marge de manœuvre dans la dimensionnalité du modèle et la sélection des algorithmes.</p>
<p>Milvus jouera un rôle crucial en tant que logiciel intermédiaire pour un plus grand nombre de scénarios, y compris le rappel de la recherche sur le site principal et les recommandations tous scénarios.</p>
<p>Les trois caractéristiques les plus attendues de Milvus à l'avenir sont les suivantes.</p>
<ul>
<li>Logique de changement d'alias de collection - coordonner le changement entre les collections sans composants externes.</li>
<li>Mécanisme de filtrage - Milvus v0.11.0 ne prend en charge que le mécanisme de filtrage ES DSL dans la version autonome. La nouvelle version Milvus 2.0 prend en charge le filtrage scalaire et la séparation lecture/écriture.</li>
<li>Prise en charge du stockage pour Hadoop Distributed File System (HDFS) - La version Milvus v0.10.6 que nous utilisons ne prend en charge que l'interface de fichier POSIX, et nous avons déployé GlusterFS avec prise en charge FUSE en tant que backend de stockage. Cependant, HDFS est un meilleur choix en termes de performances et de facilité de mise à l'échelle.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Leçons apprises et meilleures pratiques<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
<li>Pour les applications où les opérations de lecture sont les plus importantes, le déploiement d'une séparation lecture-écriture peut augmenter de manière significative la puissance de traitement et améliorer les performances.</li>
<li>Le client Java Milvus ne dispose pas d'un mécanisme de reconnexion car le client Milvus utilisé par le service de rappel réside en mémoire. Nous devons créer notre propre pool de connexion pour garantir la disponibilité de la connexion entre le client Java et le serveur par le biais d'un test de battement de cœur.</li>
<li>Des requêtes lentes se produisent occasionnellement sur Milvus. Cela est dû à un échauffement insuffisant de la nouvelle collection. En simulant la requête sur la nouvelle collection, le fichier d'index est chargé dans la mémoire pour réaliser le réchauffement de l'index.</li>
<li>nlist est le paramètre de construction de l'index et nprobe est le paramètre de requête. Vous devez déterminer une valeur seuil raisonnable en fonction de votre scénario d'entreprise par le biais d'expériences de test de pression afin d'équilibrer les performances et la précision de la recherche.</li>
<li>Dans le cas de données statiques, il est plus efficace d'importer d'abord toutes les données dans la collection et de construire les index plus tard.</li>
</ol>
