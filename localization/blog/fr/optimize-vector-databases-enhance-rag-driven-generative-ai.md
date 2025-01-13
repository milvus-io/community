---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: >-
  Optimiser les bases de données vectorielles, améliorer l'IA générative pilotée
  par RAG
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  Dans cet article, vous en apprendrez plus sur les bases de données
  vectorielles et leurs cadres d'analyse comparative, sur les ensembles de
  données permettant d'aborder différents aspects et sur les outils utilisés
  pour l'analyse des performances - tout ce dont vous avez besoin pour commencer
  à optimiser les bases de données vectorielles.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Cet article a été publié à l'origine sur le <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">canal Medium d'Intel</a> et est repris ici avec autorisation.</em></p>
<p><br></p>
<p>Deux méthodes pour optimiser votre base de données vectorielle lorsque vous utilisez RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Photo par <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> sur <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Par Cathy Zhang et Dr. Malini Bhandaru Contributeurs : Lin Yang et Changyan Liu</p>
<p>Les modèles d'IA générative (GenAI), qui connaissent une adoption exponentielle dans notre vie quotidienne, sont améliorés par la <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">génération augmentée par récupération (RAG)</a>, une technique utilisée pour améliorer la précision et la fiabilité des réponses en récupérant des faits à partir de sources externes. La RAG aide un <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">grand modèle de langage</a> ordinaire <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">(LLM</a> ) à comprendre le contexte et à réduire les <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">hallucinations</a> en exploitant une base de données géante de données non structurées stockées sous forme de vecteurs - une présentation mathématique qui aide à capturer le contexte et les relations entre les données.</p>
<p>Les RAG permettent de récupérer plus d'informations contextuelles et donc de générer de meilleures réponses, mais les bases de données vectorielles sur lesquelles ils s'appuient deviennent de plus en plus grandes pour fournir un contenu riche à exploiter. Tout comme les LLM à mille milliards de paramètres, les bases de données vectorielles contenant des milliards de vecteurs ne sont pas loin derrière. En tant qu'ingénieurs en optimisation, nous étions curieux de voir si nous pouvions rendre les bases de données vectorielles plus performantes, charger les données plus rapidement et créer des index plus rapidement pour garantir la rapidité de la recherche, même lorsque de nouvelles données sont ajoutées. Cela permettrait non seulement de réduire le temps d'attente des utilisateurs, mais aussi de rendre les solutions d'IA basées sur RAG un peu plus durables.</p>
<p>Dans cet article, vous en apprendrez davantage sur les bases de données vectorielles et leurs cadres d'analyse comparative, sur les ensembles de données permettant d'aborder différents aspects et sur les outils utilisés pour l'analyse des performances - tout ce dont vous avez besoin pour commencer à optimiser les bases de données vectorielles. Nous partagerons également nos réalisations en matière d'optimisation de deux solutions de bases de données vectorielles populaires afin de vous inspirer dans votre démarche d'optimisation des performances et de l'impact sur le développement durable.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Comprendre les bases de données vectorielles<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Contrairement aux bases de données relationnelles ou non relationnelles traditionnelles où les données sont stockées de manière structurée, une base de données vectorielle contient une représentation mathématique d'éléments de données individuels, appelée vecteur, construite à l'aide d'une fonction d'intégration ou de transformation. Le vecteur représente généralement des caractéristiques ou des significations sémantiques et peut être court ou long. Les bases de données vectorielles permettent la recherche de vecteurs par similarité à l'aide d'une métrique de distance (où la proximité signifie que les résultats sont plus similaires) telle que la <a href="https://www.pinecone.io/learn/vector-similarity/">similarité euclidienne, le produit de point ou la similarité cosinus</a>.</p>
<p>Pour accélérer le processus de recherche, les données vectorielles sont organisées à l'aide d'un mécanisme d'indexation. Parmi les exemples de ces méthodes d'organisation, on peut citer les structures plates, les <a href="https://arxiv.org/abs/2002.09094">fichiers inversés (IVF), les</a> <a href="https://arxiv.org/abs/1603.09320">petits mondes hiérarchiques navigables (HNSW</a> ) et le <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">hachage sensible à la localité (LSH)</a>, entre autres. Chacune de ces méthodes contribue à l'efficacité de la récupération de vecteurs similaires en cas de besoin.</p>
<p>Voyons comment utiliser une base de données vectorielles dans un système de GenAI. La figure 1 illustre à la fois le chargement des données dans une base de données vectorielles et leur utilisation dans le contexte d'une application GenAI. Lorsque vous saisissez votre invite, elle subit un processus de transformation identique à celui utilisé pour générer des vecteurs dans la base de données. Cette invite transformée est ensuite utilisée pour récupérer des vecteurs similaires dans la base de données vectorielles. Ces éléments récupérés servent essentiellement de mémoire conversationnelle, fournissant un historique contextuel pour les invites, un peu comme le font les LLM. Cette fonction s'avère particulièrement avantageuse dans le traitement du langage naturel, la vision par ordinateur, les systèmes de recommandation et d'autres domaines nécessitant une compréhension sémantique et une mise en correspondance des données. Votre invite initiale est ensuite "fusionnée" avec les éléments récupérés, fournissant un contexte et aidant le LLM à formuler des réponses basées sur le contexte fourni plutôt que de s'appuyer uniquement sur ses données de formation d'origine.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 1. Architecture d'une application RAG.</p>
<p>Les vecteurs sont stockés et indexés pour une recherche rapide. Les bases de données vectorielles se présentent sous deux formes principales : les bases de données traditionnelles qui ont été étendues pour stocker des vecteurs et les bases de données vectorielles spécialement conçues. <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> et <a href="https://opensearch.org/">OpenSearch</a> sont des exemples de bases de données traditionnelles qui prennent en charge les vecteurs. Parmi les exemples de bases de données vectorielles spécifiques, on peut citer les solutions propriétaires <a href="https://zilliz.com/">Zilliz</a> et <a href="https://www.pinecone.io/">Pinecone</a>, ainsi que les projets open source <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a> et <a href="https://www.trychroma.com/">Chroma</a>. Vous pouvez en savoir plus sur les bases de données vectorielles sur GitHub via <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>et <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>Nous allons examiner de plus près une base de données de chaque catégorie, Milvus et Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Améliorer les performances<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans les optimisations, examinons comment les bases de données vectorielles sont évaluées, quelques cadres d'évaluation et les outils d'analyse des performances disponibles.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Mesures de performance</h3><p>Examinons les principales mesures qui peuvent vous aider à évaluer les performances des bases de données vectorielles.</p>
<ul>
<li>La<strong>latence de chargement</strong> mesure le temps nécessaire pour charger les données dans la mémoire de la base de données vectorielle et construire un index. Un index est une structure de données utilisée pour organiser et récupérer efficacement des données vectorielles en fonction de leur similarité ou de leur distance. Les types d'<a href="https://milvus.io/docs/index.md#In-memory-Index">index en mémoire</a> comprennent l'<a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">index plat</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (scalable nearest neighbors</a>) et <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li>Le<strong>rappel</strong> est la proportion de vraies correspondances, ou d'éléments pertinents, trouvés dans les <a href="https://redis.io/docs/data-types/probabilistic/top-k/">K premiers</a> résultats récupérés par l'algorithme de recherche. Des valeurs de rappel plus élevées indiquent une meilleure récupération des éléments pertinents.</li>
<li>Le nombre de<strong>requêtes par seconde (QPS</strong> ) est la vitesse à laquelle la base de données vectorielle peut traiter les requêtes entrantes. Des valeurs de QPS plus élevées impliquent une meilleure capacité de traitement des requêtes et un meilleur débit du système.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Cadres d'évaluation comparative</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La figure 2 présente le cadre d'évaluation des bases de données vectorielles. Le cadre d'évaluation comparative des bases de données vectorielles.</p>
<p>L'évaluation comparative d'une base de données vectorielle nécessite un serveur de base de données vectorielle et des clients. Pour nos tests de performance, nous avons utilisé deux outils open source populaires.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Développé par Zilliz, VectorDBBench permet de tester différentes bases de données vectorielles avec différents types d'index et fournit une interface web pratique.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> Développé par Qdrant, vector-db-benchmark permet de tester plusieurs bases de données vectorielles typiques pour le type d'index <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. Il exécute les tests en ligne de commande et fournit un fichier <a href="https://docs.docker.com/compose/">Docker Compose</a> __file pour simplifier le démarrage des composants du serveur.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 3. Exemple de commande vector-db-benchmark utilisée pour exécuter le test de référence.</p>
<p>Mais le cadre de référence n'est qu'une partie de l'équation. Nous avons besoin de données pour tester différents aspects de la solution de base de données vectorielle elle-même, comme sa capacité à gérer de grands volumes de données, différentes tailles de vecteurs et la rapidité de la recherche.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Jeux de données ouverts pour tester les bases de données vectorielles</h3><p>Les grands ensembles de données sont de bons candidats pour tester la latence de la charge et l'allocation des ressources. Certains ensembles de données ont des dimensions élevées et sont parfaits pour tester la vitesse de calcul de la similarité.</p>
<p>Les ensembles de données vont d'une dimension de 25 à une dimension de 2048. L'ensemble de données <a href="https://laion.ai/">LAION</a>, une collection d'images ouverte, a été utilisé pour entraîner de très grands modèles neuronaux profonds visuels et linguistiques, tels que des modèles génératifs de diffusion stables. L'ensemble de données OpenAI de 5 millions de vecteurs, chacun ayant une dimension de 1536, a été créé par VectorDBBench en exécutant OpenAI sur des <a href="https://huggingface.co/datasets/allenai/c4">données brutes</a>. Étant donné que chaque élément vectoriel est de type FLOAT, la sauvegarde des vecteurs nécessite environ 29 Go (5M * 1536 * 4) de mémoire, plus une quantité similaire pour contenir les indices et autres métadonnées, soit un total de 58 Go de mémoire pour les tests. Lorsque vous utilisez l'outil vector-db-benchmark, veillez à disposer d'un espace de stockage adéquat sur le disque pour sauvegarder les résultats.</p>
<p>Pour tester la latence de chargement, nous avions besoin d'une grande collection de vecteurs, ce qu'offre <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a>. Pour tester les performances de la génération d'index et du calcul de similarité, les vecteurs de haute dimension sont plus sollicités. À cette fin, nous avons choisi l'ensemble de données 500K composé de vecteurs de 1536 dimensions.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Outils de performance</h3><p>Nous avons abordé les moyens de stresser le système afin d'identifier les mesures intéressantes, mais examinons ce qui se passe à un niveau inférieur : quel est le niveau d'occupation de l'unité de calcul, la consommation de mémoire, les temps d'attente sur les verrous, etc. Ces éléments fournissent des indices sur le comportement de la base de données, particulièrement utiles pour identifier les zones problématiques.</p>
<p>L'utilitaire <a href="https://www.redhat.com/sysadmin/interpret-top-output">top de</a> Linux fournit des informations sur les performances du système. Cependant, l'outil <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> de Linux fournit un ensemble d'informations plus approfondies. Pour en savoir plus, nous vous recommandons également de lire les <a href="https://www.brendangregg.com/perf.html">exemples de perf Linux</a> et la <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">méthode d'analyse descendante de la microarchitecture d'Intel</a>. Un autre outil encore est l'<a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, qui est utile pour optimiser non seulement les performances des applications, mais aussi celles du système et la configuration pour une variété de charges de travail couvrant le HPC, le cloud, l'IoT, les médias, le stockage, et plus encore.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Optimisations de la base de données vectorielle Milvus<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Passons en revue quelques exemples de la manière dont nous avons tenté d'améliorer les performances de la base de données vectorielle Milvus.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Réduction des frais généraux de déplacement de la mémoire dans l'écriture du tampon du datanode</h3><p>Le chemin d'écriture de Milvus permet aux mandataires d'écrire des données dans un courtier de journaux via <em>MsgStream</em>. Les nœuds de données consomment ensuite les données, en les convertissant et en les stockant dans des segments. Les segments fusionnent les données nouvellement insérées. La logique de fusion alloue un nouveau tampon pour contenir/déplacer les anciennes données et les nouvelles données à insérer, puis renvoie le nouveau tampon en tant qu'anciennes données pour la prochaine fusion de données. Les anciennes données deviennent ainsi de plus en plus volumineuses, ce qui ralentit le mouvement des données. Les profils de performance ont montré un surcoût élevé pour cette logique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 4. La fusion et le déplacement des données dans la base de données vectorielle génèrent une surcharge de performance importante.</p>
<p>Nous avons modifié la logique du <em>tampon de fusion</em> pour ajouter directement les nouvelles données à insérer dans les anciennes, ce qui évite d'allouer un nouveau tampon et de déplacer les anciennes données volumineuses. Les profils de performance confirment que cette logique ne génère pas de surcoût. Les mesures du microcode <em>metric_CPU operating frequency</em> et <em>metric_CPU utilization</em> indiquent une amélioration qui est cohérente avec le fait que le système n'a plus besoin d'attendre le long mouvement de la mémoire. La latence de chargement s'est améliorée de plus de 60 %. L'amélioration est capturée sur <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 5. Avec moins de copies, nous constatons une amélioration des performances de plus de 50 % en ce qui concerne la latence de chargement.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Construction d'un index inversé avec réduction des frais généraux d'allocation de mémoire</h3><p>Le moteur de recherche de Milvus, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, utilise l'<a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">algorithme Elkan k-means</a> pour former des données en grappes afin de créer des <a href="https://milvus.io/docs/v1.1.1/index.md">index de fichiers inversés (IVF)</a>. Chaque cycle de formation des données définit un nombre d'itérations. Plus ce nombre est élevé, meilleurs sont les résultats de la formation. Cependant, cela implique également que l'algorithme d'Elkan sera appelé plus fréquemment.</p>
<p>L'algorithme d'Elkan gère l'allocation et la désallocation de la mémoire à chaque fois qu'il est exécuté. Plus précisément, il alloue de la mémoire pour stocker la moitié de la taille des données de la matrice symétrique, à l'exclusion des éléments diagonaux. Dans Knowhere, la dimension de la matrice symétrique utilisée par l'algorithme d'Elkan est fixée à 1024, ce qui se traduit par une taille de mémoire d'environ 2 Mo. Cela signifie que pour chaque cycle d'entraînement, Elkan alloue et désalloue de manière répétée 2 Mo de mémoire.</p>
<p>Les données de profilage Perf ont indiqué une activité fréquente d'allocation de mémoire importante. En fait, elles ont déclenché l'allocation de <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">zones de mémoire virtuelle (VMA</a>), l'allocation de pages physiques, la configuration de cartes de pages et la mise à jour des statistiques de cgroupes de mémoire dans le noyau. Ce modèle d'activité d'allocation/désallocation de mémoire importante peut, dans certaines situations, aggraver la fragmentation de la mémoire. Il s'agit d'une taxe importante.</p>
<p>La structure <em>IndexFlatElkan</em> est spécifiquement conçue et construite pour soutenir l'algorithme d'Elkan. Une instance <em>IndexFlatElkan</em> sera initialisée pour chaque processus d'apprentissage des données. Pour atténuer l'impact sur les performances résultant de l'allocation et de la désallocation fréquentes de la mémoire dans l'algorithme d'Elkan, nous avons remanié la logique du code, en déplaçant la gestion de la mémoire en dehors de la fonction de l'algorithme d'Elkan, dans le processus de construction d'<em>IndexFlatElkan</em>. Cela permet d'allouer la mémoire une seule fois au cours de la phase d'initialisation tout en servant tous les appels de fonction ultérieurs de l'algorithme d'Elkan à partir du processus d'apprentissage des données en cours et contribue à améliorer la latence de chargement d'environ 3 %. Le <a href="https://github.com/zilliztech/knowhere/pull/280">correctif Knowhere</a> est disponible <a href="https://github.com/zilliztech/knowhere/pull/280">ici</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Accélération de la recherche vectorielle Redis grâce au Software Prefetch<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, un magasin de données clé-valeur traditionnel en mémoire, a récemment commencé à prendre en charge la recherche vectorielle. Pour aller au-delà d'un magasin de données clé-valeur typique, il offre des modules d'extensibilité ; le module <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> facilite le stockage et la recherche de vecteurs directement dans Redis.</p>
<p>Pour la recherche de similarités vectorielles, Redis prend en charge deux algorithmes, à savoir la force brute et HNSW. L'algorithme HNSW est spécialement conçu pour localiser efficacement les plus proches voisins approximatifs dans les espaces à haute dimension. Il utilise une file d'attente prioritaire nommée <em>candidate_set</em> pour gérer tous les vecteurs candidats pour le calcul de la distance.</p>
<p>Chaque vecteur candidat contient des métadonnées substantielles en plus des données vectorielles. Par conséquent, le chargement d'un candidat à partir de la mémoire peut entraîner l'absence de données dans le cache, ce qui entraîne des retards de traitement. Notre optimisation introduit la prélecture logicielle pour charger de manière proactive le candidat suivant tout en traitant le candidat en cours. Cette amélioration a permis d'améliorer le débit de 2 à 3 % pour les recherches de similarités vectorielles dans une configuration Redis à instance unique. Le correctif est en cours de remontée.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">Changement de comportement par défaut de GCC pour éviter les pénalités liées au code assembleur mixte<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Afin de maximiser les performances, les sections de code fréquemment utilisées sont souvent écrites à la main en assembleur. Cependant, lorsque différents segments de code sont écrits par différentes personnes ou à différents moments, les instructions utilisées peuvent provenir de jeux d'instructions assembleurs incompatibles tels que <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> et <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. S'il n'est pas compilé de manière appropriée, le code mixte entraîne une baisse des performances. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Pour en savoir plus sur le mélange des instructions Intel AVX et SSE, cliquez ici</a>.</p>
<p>Vous pouvez facilement déterminer si vous utilisez du code assembleur en mode mixte et si vous n'avez pas compilé le code avec <em>VZEROUPPER</em>, ce qui entraîne une pénalité en termes de performances. Cela peut être observé à l'aide d'une commande perf comme <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;</em>. Si votre système d'exploitation ne supporte pas l'événement, utilisez <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>Le compilateur Clang insère par défaut <em>VZEROUPPER</em>, évitant ainsi toute pénalité en mode mixte. Mais le compilateur GCC n'insère <em>VZEROUPPER</em> que lorsque les drapeaux de compilateur -O2 ou -O3 sont spécifiés. Nous avons contacté l'équipe GCC et expliqué le problème. Désormais, le compilateur GCC gère correctement le code assembleur en mode mixte par défaut.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Commencez à optimiser vos bases de données vectorielles<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles jouent un rôle essentiel dans la GenAI, et elles sont de plus en plus volumineuses afin de générer des réponses de meilleure qualité. En ce qui concerne l'optimisation, les applications d'IA ne sont pas différentes des autres applications logicielles en ce sens qu'elles révèlent leurs secrets lorsque l'on utilise des outils standard d'analyse des performances ainsi que des cadres de référence et des données de stress.</p>
<p>À l'aide de ces outils, nous avons découvert des pièges de performance liés à l'allocation inutile de mémoire, à l'absence de préemption des instructions et à l'utilisation d'options de compilateur incorrectes. Sur la base de nos conclusions, nous avons apporté des améliorations à Milvus, Knowhere, Redis et au compilateur GCC afin de rendre l'IA un peu plus performante et durable. Les bases de données vectorielles constituent une classe importante d'applications qui méritent vos efforts d'optimisation. Nous espérons que cet article vous aidera à démarrer.</p>
