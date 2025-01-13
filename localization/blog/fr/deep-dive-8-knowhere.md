---
id: deep-dive-8-knowhere.md
title: >-
  Quelle est la puissance de la recherche de similarité dans la base de données
  vectorielle Milvus ?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'Et non, ce n''est pas Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/cydrain">Yudong Cai</a> et traduit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>En tant que moteur d'exécution vectorielle, Knowhere est à Milvus ce qu'un moteur est à une voiture de sport. Cet article présente ce qu'est Knowhere, en quoi il est différent de Faiss, et comment le code de Knowhere est structuré.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Le concept de Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere dans l'architecture Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere vs Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Comprendre le code de Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Ajouter des index à Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Le concept de Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Au sens strict, Knowhere est une interface d'exploitation permettant d'accéder à des services dans les couches supérieures du système et à des bibliothèques de recherche de similarités vectorielles telles que <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> dans les couches inférieures du système. En outre, Knowhere est également responsable de l'informatique hétérogène. Plus précisément, Knowhere contrôle sur quel matériel (par exemple, CPU ou GPU) sont exécutées les requêtes de construction d'index et de recherche. C'est ainsi que Knowhere tire son nom - savoir où exécuter les opérations. D'autres types de matériel, notamment les DPU et TPU, seront pris en charge dans les prochaines versions.</p>
<p>Dans un sens plus large, Knowhere intègre également d'autres bibliothèques d'indexation tierces comme Faiss. Par conséquent, dans son ensemble, Knowhere est reconnu comme le moteur principal de calcul vectoriel dans la base de données vectorielles Milvus.</p>
<p>Le concept de Knowhere montre qu'il ne traite que les tâches de calcul des données, alors que les tâches telles que le partage, l'équilibre des charges et la reprise après sinistre dépassent le champ d'action de Knowhere.</p>
<p>À partir de Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (au sens large) devient indépendant du projet Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere dans l'architecture Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>architecture de knowhere</span> </span></p>
<p>Le calcul dans Milvus implique principalement des opérations vectorielles et scalaires. Knowhere ne gère que les opérations sur les vecteurs dans Milvus. La figure ci-dessus illustre l'architecture de Knowhere dans Milvus.</p>
<p>La couche inférieure est le matériel du système. Les bibliothèques d'indexation tierces se trouvent au-dessus du matériel. Knowhere interagit ensuite avec le nœud d'index et le nœud de requête au sommet via CGO.</p>
<p>Cet article parle de Knowhere dans son sens le plus large, comme indiqué dans le cadre bleu de l'illustration de l'architecture.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere ne se contente pas d'étendre les fonctions de Faiss, il en optimise également les performances. Plus précisément, Knowhere présente les avantages suivants.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Prise en charge de BitsetView</h3><p>Initialement, les bitset ont été introduits dans Milvus dans le but de procéder à une &quot;suppression douce&quot;. Un vecteur supprimé en douceur existe toujours dans la base de données mais ne sera pas calculé lors d'une recherche ou d'une requête de similarité vectorielle. Chaque bit de l'ensemble de bits correspond à un vecteur indexé. Si un vecteur est marqué "1" dans l'ensemble de bits, cela signifie que ce vecteur est supprimé et qu'il ne sera pas pris en compte lors d'une recherche de vecteurs.</p>
<p>Les paramètres de bitset sont ajoutés à toutes les API de requête d'index Faiss exposées dans Knowhere, y compris les index CPU et GPU.</p>
<p>En savoir plus sur <a href="https://milvus.io/blog/2022-2-14-bitset.md">la façon dont les bitset permettent la polyvalence de la recherche vectorielle</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Prise en charge d'autres mesures de similarité pour l'indexation de vecteurs binaires</h3><p>Outre <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, Knowhere supporte également <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>. Jaccard et Tanimoto peuvent être utilisés pour mesurer la similarité entre deux ensembles d'échantillons, tandis que Superstructure et Substructure peuvent être utilisés pour mesurer la similarité des structures chimiques.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Prise en charge du jeu d'instructions AVX512</h3><p>Faiss lui-même prend en charge plusieurs jeux d'instructions, notamment <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere étend encore les jeux d'instructions pris en charge en ajoutant <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, qui peut <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">améliorer les performances de la construction d'index et des requêtes de 20 à 30 %</a> par rapport à AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Sélection automatique des instructions SIMD</h3><p>Knowhere est conçu pour fonctionner correctement sur un large spectre de processeurs CPU (à la fois sur site et sur des plateformes cloud) avec différentes instructions SIMD (par exemple, SIMD SSE, AVX, AVX2, et AVX512). Le défi est donc le suivant : étant donné un binaire logiciel unique (c'est-à-dire Milvus), comment faire en sorte qu'il invoque automatiquement les instructions SIMD appropriées sur n'importe quel processeur CPU ? Faiss ne prend pas en charge la sélection automatique des instructions SIMD et les utilisateurs doivent spécifier manuellement l'indicateur SIMD (par exemple, "-msse4") pendant la compilation. Cependant, Knowhere est construit en remaniant la base de code de Faiss. Les fonctions communes (par exemple, le calcul de similarité) qui dépendent des accélérations SIMD sont supprimées. Ensuite, pour chaque fonction, quatre versions (SSE, AVX, AVX2, AVX512) sont implémentées et chacune est placée dans un fichier source séparé. Les fichiers sources sont ensuite compilés individuellement avec le drapeau SIMD correspondant. Ainsi, au moment de l'exécution, Knowhere peut automatiquement choisir les instructions SIMD les mieux adaptées en fonction des drapeaux actuels de l'unité centrale et lier les bons pointeurs de fonction à l'aide de crochets.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Autres optimisations des performances</h3><p>Lire <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus : A Purpose-Built Vector Data Management System</a> pour en savoir plus sur l'optimisation des performances de Knowhere.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Comprendre le code de Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme mentionné dans la première section, Knowhere ne gère que les opérations de recherche vectorielle. Par conséquent, Knowhere ne traite que le champ vectoriel d'une entité (actuellement, un seul champ vectoriel est supporté pour les entités d'une collection). La construction d'index et la recherche de similarité vectorielle sont également ciblées sur le champ vectoriel d'un segment. Pour mieux comprendre le modèle de données, lisez le blog <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">ici</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>champs d'entité</span> </span></p>
<h3 id="Index" class="common-anchor-header">Index</h3><p>L'index est un type de structure de données indépendante des données vectorielles originales. L'indexation nécessite quatre étapes : créer un index, entraîner les données, insérer les données et construire un index.</p>
<p>Pour certaines applications d'intelligence artificielle, l'entraînement des ensembles de données est un processus distinct de la recherche vectorielle. Dans ce type d'application, les données des ensembles de données sont d'abord formées, puis insérées dans une base de données vectorielles telle que Milvus pour la recherche de similarités. Les ensembles de données ouverts tels que sift1M et sift1B fournissent des données pour l'entraînement et le test. Cependant, dans Knowhere, les données pour l'entraînement et la recherche sont mélangées. En d'autres termes, Knowhere entraîne toutes les données d'un segment, puis insère toutes les données entraînées et construit un index pour elles.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Structure du code de Knowhere</h3><p>DataObj est la classe de base de toutes les structures de données dans Knowhere. <code translate="no">Size()</code> est la seule méthode virtuelle de DataObj. La classe Index hérite de DataObj avec un champ nommé &quot;size_&quot;. La classe Index possède également deux méthodes virtuelles - <code translate="no">Serialize()</code> et <code translate="no">Load()</code>. La classe VecIndex, dérivée de la classe Index, est la classe de base virtuelle pour tous les index vectoriels. VecIndex fournit les méthodes suivantes : <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, et <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>classe de base</span> </span></p>
<p>Les autres types d'index sont énumérés à droite dans la figure ci-dessus.</p>
<ul>
<li>L'index Faiss a deux sous-classes : FaissBaseIndex pour tous les index sur les vecteurs à virgule flottante et FaissBaseBinaryIndex pour tous les index sur les vecteurs binaires.</li>
<li>GPUIndex est la classe de base pour tous les index GPU Faiss.</li>
<li>OffsetBaseIndex est la classe de base pour tous les index auto-développés. Seul l'identifiant du vecteur est stocké dans le fichier d'index. Par conséquent, la taille d'un fichier d'index pour des vecteurs à 128 dimensions peut être réduite de deux ordres de grandeur. Nous recommandons de prendre également en considération les vecteurs originaux lorsque ce type d'index est utilisé pour la recherche de similarités vectorielles.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Techniquement parlant, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> n'est pas un index, mais est plutôt utilisé pour la recherche par force brute. Lorsque des vecteurs sont insérés dans la base de données vectorielles, aucune formation de données ni construction d'index n'est nécessaire. Les recherches sont effectuées directement sur les données vectorielles insérées.</p>
<p>Toutefois, pour des raisons de cohérence du code, IDMAP hérite également de la classe VecIndex et de toutes ses interfaces virtuelles. L'utilisation d'IDMAP est la même que celle des autres index.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Les index IVF (fichier inversé) sont les plus fréquemment utilisés. La classe IVF est dérivée des classes VecIndex et FaissBaseIndex, et s'étend aux classes IVFSQ et IVFPQ. GPUIVF est dérivé de GPUIndex et IVF. GPUIVF s'étend ensuite à GPUIVFSQ et GPUIVFPQ.</p>
<p>IVFSQHybrid est une classe d'index hybride auto-développée qui est exécutée par quantification grossière sur le GPU. La recherche dans le seau est exécutée par l'unité centrale. Ce type d'index permet de réduire les copies de mémoire entre le CPU et le GPU en exploitant la puissance de calcul du GPU. IVFSQHybrid a le même taux de rappel que GPUIVFSQ mais offre de meilleures performances.</p>
<p>La structure des classes de base pour les index binaires est relativement plus simple. BinaryIDMAP et BinaryIVF sont dérivés de FaissBaseBinaryIndex et VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>index de tiers</span> </span></p>
<p>Actuellement, seuls deux types d'index tiers sont pris en charge en dehors de Faiss : l'index basé sur les arbres Annoy et l'index basé sur les graphes HNSW. Ces deux index tiers courants et fréquemment utilisés sont tous deux dérivés de VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Ajouter des index à Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous souhaitez ajouter de nouveaux index à Knowhere, vous pouvez d'abord vous référer aux index existants :</p>
<ul>
<li>Pour ajouter un index basé sur la quantification, reportez-vous à IVF_FLAT.</li>
<li>Pour ajouter un index basé sur les graphes, reportez-vous à HNSW.</li>
<li>Pour ajouter un index basé sur les arbres, reportez-vous à Annoy.</li>
</ul>
<p>Après avoir consulté les index existants, vous pouvez suivre les étapes ci-dessous pour ajouter un nouvel index à Knowhere.</p>
<ol>
<li>Ajoutez le nom du nouvel index dans <code translate="no">IndexEnum</code>. Le type de données est une chaîne.</li>
<li>Ajoutez un contrôle de validation des données sur le nouvel index dans le fichier <code translate="no">ConfAdapter.cpp</code>. Le contrôle de validation sert principalement à valider les paramètres de formation des données et de requête.</li>
<li>Créez un nouveau fichier pour le nouvel index. La classe de base du nouvel index doit inclure <code translate="no">VecIndex</code> et l'interface virtuelle nécessaire de <code translate="no">VecIndex</code>.</li>
<li>Ajoutez la logique de construction de l'index pour le nouvel index dans <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Ajoutez un test unitaire dans le répertoire <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale de</a> Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
