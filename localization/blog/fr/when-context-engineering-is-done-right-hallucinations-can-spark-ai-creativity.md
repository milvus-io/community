---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: >-
  Lorsque l'ingénierie contextuelle est bien menée, les hallucinations peuvent
  être l'étincelle de la créativité de l'IA
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: >-
  Découvrez pourquoi les hallucinations de l'IA ne sont pas de simples erreurs
  mais des étincelles de créativité, et comment l'ingénierie contextuelle les
  transforme en résultats fiables et concrets.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>Pendant longtemps, beaucoup d'entre nous - moi y compris - ont traité les hallucinations du LLM comme rien de plus que des défauts. Toute une chaîne d'outils a été construite pour les éliminer : systèmes de récupération, garde-fous, mise au point, etc. Ces mesures de protection sont toujours précieuses. Mais plus j'étudie la manière dont les modèles génèrent réellement des réponses - et comment des systèmes comme <a href="https://milvus.io/"><strong>Milvus</strong></a> s'intègrent dans des pipelines d'IA plus larges - moins je crois que les hallucinations ne sont que des échecs. En fait, elles peuvent aussi être l'étincelle de la créativité de l'IA.</p>
<p>Si nous examinons la créativité humaine, nous constatons le même schéma. Chaque percée repose sur des sauts d'imagination. Mais ces sauts ne viennent jamais de nulle part. Les poètes maîtrisent d'abord le rythme et le mètre avant de briser les règles. Les scientifiques s'appuient sur des théories établies avant de s'aventurer en terrain inconnu. Le progrès dépend de ces sauts, à condition qu'ils soient fondés sur des connaissances et une compréhension solides.</p>
<p>Les LLM fonctionnent à peu près de la même manière. Leurs "hallucinations" ou "sauts" - analogies, associations et extrapolations - émergent du même processus génératif qui permet aux modèles d'établir des connexions, d'étendre leurs connaissances et de faire émerger des idées au-delà de ce à quoi ils ont été explicitement formés. Tous les sauts ne sont pas couronnés de succès, mais lorsqu'ils le sont, les résultats peuvent être convaincants.</p>
<p>C'est pourquoi je considère l'<strong>ingénierie contextuelle</strong> comme la prochaine étape cruciale. Plutôt que d'essayer d'éliminer toutes les hallucinations, nous devrions nous concentrer sur leur <em>orientation</em>. En concevant le bon contexte, nous pouvons trouver un équilibre - en gardant les modèles suffisamment imaginatifs pour explorer de nouveaux terrains, tout en veillant à ce qu'ils restent suffisamment ancrés pour que l'on puisse leur faire confiance.</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">Qu'est-ce que l'ingénierie contextuelle ?<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Qu'entend-on exactement par " <em>ingénierie contextuelle</em>" ? Le terme est peut-être nouveau, mais la pratique évolue depuis des années. Des techniques telles que le RAG, l'incitation, l'appel de fonction et le MCP sont toutes des tentatives antérieures pour résoudre le même problème : fournir aux modèles l'environnement adéquat pour produire des résultats utiles. L'ingénierie contextuelle consiste à unifier ces approches dans un cadre cohérent.</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">Les trois piliers de l'ingénierie contextuelle<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Une ingénierie contextuelle efficace repose sur trois couches interconnectées :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1. La couche des instructions - Définir l'orientation</h3><p>Cette couche comprend des messages-guides, des exemples succincts et des démonstrations. C'est le système de navigation du modèle : il ne s'agit pas d'un vague "allez vers le nord", mais d'un itinéraire clair avec des points de repère. Des instructions bien structurées fixent des limites, définissent des objectifs et réduisent l'ambiguïté du comportement du modèle.</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2. La couche de connaissances - Fournir la vérité de base</h3><p>C'est ici que nous plaçons les faits, les codes, les documents et les états dont le modèle a besoin pour raisonner efficacement. Sans cette couche, le système improvise à partir d'une mémoire incomplète. Grâce à elle, le modèle peut fonder ses résultats sur des données spécifiques au domaine. Plus les connaissances sont précises et pertinentes, plus le raisonnement est fiable.</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3. La couche des outils - Permettre l'action et le retour d'information</h3><p>Cette couche couvre les API, les appels de fonction et les intégrations externes. C'est ce qui permet au système de passer du raisonnement à l'exécution, en récupérant des données, en effectuant des calculs ou en déclenchant des flux de travail. Tout aussi important, ces outils fournissent un retour d'information en temps réel qui peut être intégré dans le raisonnement du modèle. C'est ce retour d'information qui permet la correction, l'adaptation et l'amélioration continue. Dans la pratique, c'est ce qui transforme les gestionnaires du cycle de vie en participants actifs d'un système.</p>
<p>Ces couches ne sont pas cloisonnées, elles se renforcent mutuellement. Les instructions fixent la destination, les connaissances fournissent les informations avec lesquelles travailler, et les outils transforment les décisions en actions et réinjectent les résultats dans la boucle. Bien orchestrées, elles créent un environnement dans lequel les modèles peuvent être à la fois créatifs et fiables.</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">Les défis du long terme : Quand le plus devient le moins<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreux modèles d'IA annoncent aujourd'hui des fenêtres d'un million de mots, ce qui est suffisant pour ~75 000 lignes de code ou un document de 750 000 mots. Mais plus de contexte ne donne pas automatiquement de meilleurs résultats. Dans la pratique, les contextes très longs introduisent des modes de défaillance distincts qui peuvent dégrader le raisonnement et la fiabilité.</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">Empoisonnement du contexte - Quand les mauvaises informations se propagent</h3><p>Une fois que de fausses informations entrent dans le contexte de travail - que ce soit dans les objectifs, les résumés ou les états intermédiaires - elles peuvent faire dérailler l'ensemble du processus de raisonnement. <a href="https://arxiv.org/pdf/2507.06261">Le rapport Gemini 2.5 de DeepMind</a> en fournit un exemple clair. Un agent LLM jouant à Pokémon a mal interprété l'état du jeu et a décidé que sa mission était d'"attraper le légendaire impossible à attraper". Cet objectif erroné a été enregistré comme un fait, ce qui a conduit l'agent à générer des stratégies élaborées mais impossibles.</p>
<p>Comme le montre l'extrait ci-dessous, le contexte empoisonné a piégé le modèle dans une boucle - répétant les erreurs, ignorant le bon sens et renforçant la même erreur jusqu'à ce que l'ensemble du processus de raisonnement s'effondre.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 1 : Extrait du <a href="https://arxiv.org/pdf/2507.06261">document technique Gemini 2.5</a></p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">Distraction par le contexte - Perdu dans les détails</h3><p>À mesure que les fenêtres contextuelles s'agrandissent, les modèles peuvent commencer à surpondérer la transcription et à sous-utiliser ce qu'ils ont appris pendant la formation. Gemini 2.5 Pro de DeepMind, par exemple, prend en charge une fenêtre d'un million de <a href="https://arxiv.org/pdf/2507.06261">tokens</a>, mais <a href="https://arxiv.org/pdf/2507.06261">commence à dériver vers ~100 000 tokens - recyclant les</a>actions passées au lieu de générer de nouvelles stratégies. Les <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">recherches de Databricks</a> montrent que les modèles plus petits, comme Llama 3.1-405B, atteignent cette limite bien plus tôt, à environ 32 000 jetons. Il s'agit d'un effet humain familier : trop de lecture de fond et vous perdez le fil de l'histoire.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figure 2 : Extrait du <a href="https://arxiv.org/pdf/2507.06261">document technique Gemini 2.5</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3 : Performance en contexte long des modèles GPT, Claude, Llama, Mistral et DBRX sur 4 ensembles de données RAG (Databricks DocsQA, FinanceBench, HotPotQA et Natural Questions) [Source :</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>].</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">Confusion de contexte - Trop d'outils dans la cuisine</h3><p>L'ajout d'outils n'est pas toujours utile. Le <a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboard</a> montre que lorsque le contexte affiche des menus d'outils étendus - souvent avec de nombreuses options non pertinentes - la fiabilité du modèle diminue, et des outils sont invoqués même lorsqu'ils ne sont pas nécessaires. Un exemple clair : un Llama 3.1-8B quantifié a échoué avec 46 outils disponibles, mais a réussi lorsque l'ensemble a été réduit à 19. C'est le paradoxe du choix pour les systèmes d'intelligence artificielle : trop d'options, de moins bonnes décisions.</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">Conflit de contexte - Quand l'information entre en conflit</h3><p>Les interactions à plusieurs tours ajoutent un mode d'échec distinct : les malentendus initiaux s'aggravent au fur et à mesure que le dialogue se ramifie. Dans les <a href="https://arxiv.org/pdf/2505.06120v1">expériences de Microsoft et de Salesforce</a>, les LLM à poids ouvert et à poids fermé sont nettement moins performants dans les contextes à plusieurs tours que dans les contextes à un seul tour, avec une baisse moyenne de 39 % sur six tâches de génération. Une fois qu'une hypothèse erronée entre dans l'état de la conversation, les tours suivants en héritent et amplifient l'erreur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 4 : Les LLMs se perdent dans les conversations multi-tours dans les expériences</em></p>
<p>L'effet apparaît même dans les modèles de frontière. Lorsque les tâches de référence ont été réparties sur plusieurs tours, le score de performance du modèle o3 d'OpenAI a chuté de <strong>98,1</strong> à <strong>64,1</strong>. Une erreur de lecture initiale "fixe" effectivement le modèle mondial ; chaque réponse s'y ajoute, transformant une petite contradiction en un point aveugle renforcé à moins d'être explicitement corrigée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 4 : scores de performance dans les expériences de conversation multi-tours LLM</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">Six stratégies pour apprivoiser le contexte long<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La réponse aux défis posés par le contexte long n'est pas d'abandonner la capacité, mais de l'élaborer avec discipline. Voici six stratégies que nous avons vues fonctionner dans la pratique :</p>
<h3 id="Context-Isolation" class="common-anchor-header">Isolation du contexte</h3><p>Divisez les flux de travail complexes en agents spécialisés avec des contextes isolés. Chaque agent se concentre sur son propre domaine sans interférence, ce qui réduit le risque de propagation des erreurs. Cela permet non seulement d'améliorer la précision, mais aussi d'assurer une exécution parallèle, à l'instar d'une équipe d'ingénieurs bien structurée.</p>
<h3 id="Context-Pruning" class="common-anchor-header">Élagage du contexte</h3><p>Auditez et élaguez régulièrement le contexte. Supprimez les détails redondants, les informations périmées et les traces non pertinentes. Pensez-y comme à un remaniement : éliminez le code mort et les dépendances, pour ne garder que l'essentiel. Un élagage efficace nécessite des critères explicites pour déterminer ce qui a sa place et ce qui ne l'a pas.</p>
<h3 id="Context-Summarization" class="common-anchor-header">Synthèse du contexte</h3><p>Les longs historiques n'ont pas besoin d'être transportés dans leur intégralité. Il faut plutôt les condenser en des résumés concis qui ne retiennent que ce qui est essentiel pour l'étape suivante. Un bon résumé conserve les faits, les décisions et les contraintes essentiels, tout en éliminant les répétitions et les détails inutiles. C'est comme si vous remplaciez un cahier des charges de 200 pages par un dossier de conception d'une page qui vous donne tout ce dont vous avez besoin pour aller de l'avant.</p>
<h3 id="Context-Offloading" class="common-anchor-header">Déchargement du contexte</h3><p>Il n'est pas nécessaire que tous les détails fassent partie du contexte réel. Persistez les données non critiques dans des systèmes externes (bases de connaissances, magasins de documents ou bases de données vectorielles telles que Milvus) et ne les récupérez qu'en cas de besoin. Cela permet d'alléger la charge cognitive du modèle tout en conservant l'accès aux informations de fond.</p>
<h3 id="Strategic-RAG" class="common-anchor-header">RAG stratégique</h3><p>La recherche d'informations n'est puissante que si elle est sélective. Introduisez des connaissances externes par le biais d'un filtrage rigoureux et de contrôles de qualité, en veillant à ce que le modèle consomme des entrées pertinentes et exactes. Comme pour tout pipeline de données, il y a des déchets à l'entrée et des déchets à la sortie, mais avec une récupération de haute qualité, le contexte devient un atout et non un handicap.</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">Chargement optimisé des outils</h3><p>Plus d'outils n'est pas synonyme de meilleures performances. Des études montrent que la fiabilité diminue fortement au-delà de 30 outils disponibles. Ne chargez que les fonctions nécessaires à une tâche donnée et limitez l'accès aux autres. Une boîte à outils allégée favorise la précision et réduit le bruit qui peut submerger la prise de décision.</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">Le défi de l'infrastructure de l'ingénierie contextuelle<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>L'efficacité de l'ingénierie contextuelle dépend de l'infrastructure sur laquelle elle s'appuie. Or, les entreprises d'aujourd'hui sont confrontées à une tempête parfaite de défis liés aux données :</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">Explosion de l'échelle - des téraoctets aux pétaoctets</h3><p>Aujourd'hui, la croissance des données a redéfini la ligne de base. Les charges de travail qui, autrefois, tenaient aisément dans une seule base de données, s'étendent désormais sur des pétaoctets, exigeant un stockage et un calcul distribués. Une modification de schéma qui se résumait autrefois à une mise à jour SQL en une ligne peut se transformer en un effort d'orchestration complet à travers les clusters, les pipelines et les services. La mise à l'échelle ne consiste pas simplement à ajouter du matériel, mais à concevoir une coordination, une résilience et une élasticité à une échelle où chaque hypothèse est soumise à des tests de résistance.</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">Révolution de la consommation - Des systèmes qui parlent l'IA</h3><p>Les agents d'IA ne se contentent pas d'interroger les données ; ils les génèrent, les transforment et les consomment en continu à la vitesse de la machine. Les infrastructures conçues uniquement pour les applications orientées vers l'homme ne peuvent pas suivre. Pour prendre en charge les agents, les systèmes doivent assurer une récupération à faible latence, des mises à jour en continu et des charges de travail lourdes en écriture, sans se casser la figure. En d'autres termes, la pile d'infrastructure doit être conçue pour "parler l'IA" en tant que charge de travail native, et non pas comme une réflexion après coup.</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">Complexité multimodale - Plusieurs types de données, un seul système</h3><p>Les charges de travail de l'IA mélangent du texte, des images, du son, de la vidéo et des données d'intégration à haute dimension, chacun étant accompagné de riches métadonnées. La gestion de cette hétérogénéité est au cœur de l'ingénierie contextuelle pratique. Le défi ne consiste pas seulement à stocker divers objets, mais aussi à les indexer, à les récupérer efficacement et à maintenir la cohérence sémantique entre les différentes modalités. Une infrastructure véritablement prête pour l'IA doit traiter la multimodalité comme un principe de conception de premier ordre, et non comme une fonctionnalité supplémentaire.</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon : Une infrastructure de données conçue pour l'IA<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Les défis de l'échelle, de la consommation et de la multimodalité ne peuvent pas être résolus uniquement par la théorie - ils exigent une infrastructure conçue spécialement pour l'IA. C'est pourquoi, chez <a href="https://zilliz.com/">Zilliz</a>, nous avons conçu <strong>Milvus</strong> et <strong>Loon</strong> pour qu'ils fonctionnent ensemble, en abordant les deux aspects du problème : l'extraction haute performance au moment de l'exécution et le traitement des données à grande échelle en amont.</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>: la base de données vectorielles open-source la plus largement adoptée, optimisée pour la recherche et le stockage vectoriels haute performance.</p></li>
<li><p><strong>Loon</strong>: notre futur service de lac de données multimodales natif dans le nuage, conçu pour traiter et organiser des données multimodales à grande échelle avant qu'elles n'atteignent la base de données. Restez à l'écoute.</p></li>
</ul>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">Recherche vectorielle rapide comme l'éclair</h3><p><strong>Milvus</strong> est conçu dès le départ pour les charges de travail vectorielles. En tant que couche de service, il permet une recherche en moins de 10 ms sur des centaines de millions, voire des milliards de vecteurs, qu'ils soient dérivés de texte, d'images, d'audio ou de vidéo. Pour les applications d'intelligence artificielle, la vitesse de recherche n'est pas un avantage. C'est elle qui détermine la réactivité ou la lenteur d'un agent, la pertinence ou le décalage d'un résultat de recherche. La performance est ici directement visible dans l'expérience de l'utilisateur final.</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">Service de lac de données multimodal à l'échelle</h3><p><strong>Loon</strong> est notre prochain service de lac de données multimodal, conçu pour le traitement et l'analyse hors ligne à grande échelle de données non structurées. Il complète Milvus du côté du pipeline, en préparant les données avant qu'elles n'atteignent la base de données. Les ensembles de données multimodales du monde réel - texte, images, audio et vidéo - sont souvent désordonnés, avec des doublons, du bruit et des formats incohérents. Loon se charge de ces tâches lourdes à l'aide de cadres distribués tels que Ray et Daft, en compressant, dédupliquant et regroupant les données avant de les transmettre directement à Milvus. Le résultat est simple : pas de goulots d'étranglement au niveau de la mise en scène, pas de conversions de format pénibles, mais des données propres et structurées que les modèles peuvent utiliser immédiatement.</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">Élasticité native dans le nuage</h3><p>Les deux systèmes sont construits de manière cloud-native, avec une mise à l'échelle indépendante du stockage et de l'informatique. Cela signifie que lorsque les charges de travail passent de gigaoctets à pétaoctets, vous pouvez équilibrer les ressources entre le service en temps réel et la formation hors ligne, plutôt que de surprovisionner l'un ou de sous-estimer l'autre.</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">Une architecture à l'épreuve du temps</h3><p>Plus important encore, cette architecture est conçue pour évoluer avec vous. L'ingénierie contextuelle est encore en pleine évolution. Actuellement, la plupart des équipes se concentrent sur la recherche sémantique et les pipelines RAG. Mais la prochaine vague exigera davantage - l'intégration de plusieurs types de données, le raisonnement à travers eux et l'alimentation de flux de travail pilotés par des agents.</p>
<p>Avec Milvus et Loon, cette transition ne nécessite pas de démonter vos fondations. La même pile qui prend en charge les cas d'utilisation d'aujourd'hui peut s'étendre naturellement à ceux de demain. Vous ajoutez de nouvelles capacités sans avoir à tout recommencer, ce qui signifie moins de risques, moins de coûts et un chemin plus fluide à mesure que les charges de travail d'IA deviennent plus complexes.</p>
<h2 id="Your-Next-Move" class="common-anchor-header">Votre prochaine étape<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ingénierie contextuelle n'est pas une simple discipline technique - c'est la façon dont nous libérons le potentiel créatif de l'IA tout en la gardant ancrée et fiable. Si vous êtes prêt à mettre ces idées en pratique, commencez là où c'est le plus important.</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>Expérimentez Milvus</strong></a> pour voir comment les bases de données vectorielles peuvent ancrer la recherche dans des déploiements réels.</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Suivez Milvus</strong></a> pour obtenir des mises à jour sur la sortie de Loon et des informations sur la gestion des données multimodales à grande échelle.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Rejoignez la communauté Zilliz sur Discord</strong></a> pour partager des stratégies, comparer des architectures et contribuer à définir les meilleures pratiques.</p></li>
</ul>
<p>Les entreprises qui maîtrisent aujourd'hui l'ingénierie contextuelle façonneront le paysage de l'IA de demain. Ne laissez pas l'infrastructure être une contrainte - construisez les fondations que votre créativité en matière d'IA mérite.</p>
