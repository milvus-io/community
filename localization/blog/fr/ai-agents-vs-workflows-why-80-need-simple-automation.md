---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  Agents d'IA ou flux de travail ? Pourquoi vous devriez renoncer aux agents
  pour 80 % des tâches d'automatisation ?
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  L'intégration de Refly et de Milvus offre une approche pragmatique de
  l'automatisation, qui privilégie la fiabilité et la facilité d'utilisation à
  la complexité inutile.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>Les agents d'intelligence artificielle sont aujourd'hui omniprésents, qu'il s'agisse de copilotes de codage ou de robots de service à la clientèle, et ils peuvent être d'une efficacité stupéfiante dans les raisonnements complexes. Comme beaucoup d'entre vous, je les adore. Mais après avoir construit des agents et des flux de travail automatisés, j'ai appris une vérité simple : <strong>les agents ne sont pas la meilleure solution pour tous les problèmes.</strong></p>
<p>Par exemple, lorsque j'ai construit un système multi-agent avec CrewAI pour le décodage de ML, les choses se sont rapidement gâtées. Les agents de recherche ignoraient les robots d'indexation 70 % du temps. Les agents de synthèse abandonnaient les citations. La coordination s'est effondrée dès que les tâches n'étaient pas claires comme de l'eau de roche.</p>
<p>Et ce n'est pas seulement dans les expériences. Beaucoup d'entre nous oscillent déjà entre ChatGPT pour le brainstorming, Claude pour le codage et une demi-douzaine d'API pour le traitement des données, en se disant qu'il <em>doit y avoir un meilleur moyen de faire fonctionner tout cela ensemble.</em></p>
<p>Parfois, la réponse est un agent. Le plus souvent, il s'agit d'un <strong>flux de travail d'IA bien conçu</strong> qui suture vos outils existants en quelque chose de puissant, sans la complexité imprévisible.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Construire des flux de travail d'IA plus intelligents avec Refly et Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Je sais que certains d'entre vous secouent déjà la tête : "Les flux de travail ? Ils sont rigides. Ils ne sont pas assez intelligents pour une véritable automatisation de l'IA". La plupart des flux de travail sont rigides, car ils sont calqués sur les chaînes de montage de l'ancienne école : étape A → étape B → étape C, aucun écart n'est autorisé.</p>
<p>Mais le vrai problème n'est pas l'<em>idée</em> des flux de travail, c'est leur <em>exécution</em>. Nous ne sommes pas obligés de nous contenter de pipelines linéaires et fragiles. Nous pouvons concevoir des flux de travail plus intelligents qui s'adaptent au contexte, s'adaptent à la créativité et produisent toujours des résultats prévisibles.</p>
<p>Dans ce guide, nous allons construire un système complet de création de contenu en utilisant Refly et Milvus pour montrer pourquoi les flux de travail d'IA peuvent surpasser les architectures multi-agents complexes, en particulier si vous vous souciez de la vitesse, de la fiabilité et de la maintenabilité.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Les outils que nous utilisons</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Une plateforme de création de contenu open-source, native à l'IA, construite autour d'un concept de "canevas libre".</p>
<ul>
<li><p><strong>Principales fonctionnalités :</strong> canevas intelligent, gestion des connaissances, dialogue multithread et outils de création professionnels.</p></li>
<li><p><strong>Pourquoi c'est utile :</strong> La construction de flux de travail par glisser-déposer vous permet d'enchaîner les outils dans des séquences d'automatisation cohérentes, sans vous enfermer dans une exécution rigide à chemin unique.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: une base de données vectorielles open-source gérant la couche de données.</p>
<ul>
<li><p><strong>Pourquoi c'est important :</strong> La création de contenu consiste principalement à trouver et à recombiner des informations existantes. Les bases de données traditionnelles gèrent bien les données structurées, mais la plupart des travaux créatifs impliquent des formats non structurés (documents, images, vidéos).</p></li>
<li><p><strong>Ce que cela apporte :</strong> Milvus exploite des modèles d'intégration intégrés pour coder les données non structurées sous forme de vecteurs, ce qui permet d'effectuer une recherche sémantique afin que vos flux de travail puissent récupérer le contexte pertinent avec une latence de l'ordre de la milliseconde. Grâce à des protocoles tels que MCP, il s'intègre de manière transparente à vos frameworks d'IA, vous permettant d'interroger les données en langage naturel au lieu de vous débattre avec la syntaxe des bases de données.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configuration de votre environnement</h3><p>Permettez-moi de vous guider dans la mise en place de ce flux de travail au niveau local.</p>
<p><strong>Liste de contrôle pour une installation rapide :</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (ou Linux similaire)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Une clé API de n'importe quel LLM qui supporte l'appel de fonction. Dans ce guide, j'utiliserai le LLM de <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Configuration requise</strong></p>
<ul>
<li><p>CPU : 8 cœurs minimum (16 cœurs recommandés)</p></li>
<li><p>Mémoire : 16GB minimum (32GB recommandé)</p></li>
<li><p>Stockage : 100GB SSD minimum (500GB recommandé)</p></li>
<li><p>Réseau : Connexion internet stable requise</p></li>
</ul>
<p><strong>Dépendances logicielles</strong></p>
<ul>
<li><p>Système d'exploitation : Linux (Ubuntu 20.04+ recommandé)</p></li>
<li><p>Conteneurisation : Docker + Docker Compose</p></li>
<li><p>Python : Version 3.11 ou supérieure</p></li>
<li><p>Modèle de langage : Tout modèle prenant en charge les appels de fonction (les services en ligne ou le déploiement hors ligne d'Ollama fonctionnent tous les deux).</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Étape 1 : Déployer la base de données vectorielle Milvus</h3><p><strong>1.1 Télécharger Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Lancer les services Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Etape 2 : Déployer la plateforme Refly</h3><p><strong>2.1 Cloner le référentiel</strong></p>
<p>Vous pouvez utiliser les valeurs par défaut pour toutes les variables d'environnement, sauf si vous avez des besoins spécifiques :</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Vérifier l'état des services</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Étape 3 : Configuration des services MCP</h3><p><strong>3.1 Télécharger le serveur Milvus MCP</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Démarrer le service MCP</strong></p>
<p>Cet exemple utilise le mode SSE. Remplacer l'URI par votre point d'extrémité de service Milvus disponible :</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Confirmer que le service MCP fonctionne</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Étape 4 : Configuration et mise en place</h3><p>Maintenant que votre infrastructure fonctionne, configurons tout pour que tout fonctionne de manière transparente.</p>
<p><strong>4.1 Accéder à la plateforme Refly</strong></p>
<p>Naviguez vers votre instance locale de Refly :</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Créez votre compte</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Configurez votre modèle linguistique</strong></p>
<p>Pour ce guide, nous utiliserons <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. Tout d'abord, enregistrez-vous et obtenez votre clé API.</p>
<p><strong>4.4 Ajouter votre fournisseur de modèle</strong></p>
<p>Saisissez la clé API que vous avez obtenue à l'étape précédente :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Configurer le modèle LLM</strong></p>
<p>Veillez à sélectionner un modèle qui prend en charge les capacités d'appel de fonction, car cela est essentiel pour les intégrations de flux de travail que nous allons construire :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Intégrer le service Milvus-MCP</strong></p>
<p>Notez que la version web ne prend pas en charge les connexions de type stdio, nous utiliserons donc le point de terminaison HTTP que nous avons configuré plus tôt :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Excellent ! Une fois tout configuré, voyons ce système en action à travers quelques exemples pratiques.</p>
<p><strong>4.7 Exemple : Récupération efficace de vecteurs avec le serveur MCP-Milvus</strong></p>
<p>Cet exemple montre comment le <strong>serveur MCP-Milvus</strong> fonctionne en tant qu'intergiciel entre vos modèles d'IA et les instances de base de données vectorielles Milvus. Il agit comme un traducteur - acceptant les requêtes en langage naturel de votre modèle d'IA, les convertissant en requêtes de base de données correctes et renvoyant les résultats - afin que vos modèles puissent travailler avec des données vectorielles sans connaître la syntaxe de la base de données.</p>
<p><strong>4.7.1 Créer un nouveau canevas</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Démarrer une conversation</strong></p>
<p>Ouvrez l'interface de dialogue, sélectionnez votre modèle, saisissez votre question et envoyez.</p>
<p><strong>4.7.3 Examiner les résultats</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce qui se passe ici est assez remarquable : nous venons de montrer le contrôle en langage naturel d'une base de données vectorielles Milvus en utilisant <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> comme couche d'intégration. Pas de syntaxe d'interrogation complexe - il suffit de dire au système ce dont vous avez besoin en langage clair, et il se charge des opérations de base de données pour vous.</p>
<p><strong>4.8 Exemple 2 : Création d'un guide de déploiement Refly avec des flux de travail</strong></p>
<p>Ce deuxième exemple montre la puissance réelle de l'orchestration des flux de travail. Nous allons créer un guide de déploiement complet en combinant plusieurs outils d'IA et sources de données en un processus unique et cohérent.</p>
<p><strong>4.8.1 Rassemblez vos sources de données</strong></p>
<p>La puissance de Refly réside dans sa flexibilité à gérer différents formats d'entrée. Vous pouvez importer des ressources dans différents formats, qu'il s'agisse de documents, d'images ou de données structurées.</p>
<p><strong>4.8.2 Créer des tâches et lier des cartes de ressources</strong></p>
<p>Nous allons maintenant créer notre flux de travail en définissant des tâches et en les reliant à nos documents sources.</p>
<p><strong>4.8.3 Mise en place de trois tâches de traitement</strong></p>
<p>C'est ici que l'approche du flux de travail est vraiment efficace. Au lieu d'essayer de tout gérer en un seul processus complexe, nous divisons le travail en trois tâches ciblées qui intègrent les documents téléchargés et les affinent systématiquement.</p>
<ul>
<li><p><strong>Tâche d'intégration du contenu</strong>: Combine et structure le matériel source</p></li>
<li><p><strong>Tâche d'affinage du contenu</strong>: améliore la clarté et la fluidité.</p></li>
<li><p><strong>Compilation du projet final</strong>: Création d'un document prêt à être publié</p></li>
</ul>
<p>Les résultats parlent d'eux-mêmes. Ce qui aurait nécessité des heures de coordination manuelle entre plusieurs outils est désormais géré automatiquement, chaque étape s'appuyant logiquement sur la précédente.</p>
<p><strong>Capacités de flux de travail multimodal :</strong></p>
<ul>
<li><p><strong>Génération et traitement d'images</strong>: Intégration avec des modèles de haute qualité tels que flux-schnell, flux-pro et SDXL.</p></li>
<li><p><strong>Génération et compréhension de vidéos</strong>: Prise en charge de divers modèles vidéo stylisés, notamment Seedance, Kling et Veo.</p></li>
<li><p><strong>Outils de génération audio</strong>: Génération de musique à l'aide de modèles tels que Lyria-2 et synthèse vocale à l'aide de modèles tels que Chatterbox</p></li>
<li><p><strong>Traitement intégré</strong>: Toutes les sorties multimodales peuvent être référencées, analysées et retraitées dans le système.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'intégration de <strong>Refly</strong> et <strong>Milvus</strong> offre une approche pragmatique de l'automatisation, qui privilégie la fiabilité et la facilité d'utilisation à la complexité inutile. En combinant l'orchestration des flux de travail et le traitement multimodal, les équipes peuvent passer plus rapidement du concept à la publication tout en conservant un contrôle total à chaque étape.</p>
<p>Il ne s'agit pas de rejeter les agents d'IA. Ils sont précieux pour s'attaquer à des problèmes véritablement complexes et imprévisibles. Mais pour de nombreux besoins d'automatisation, notamment en matière de création de contenu et de traitement des données, un flux de travail bien conçu peut donner de meilleurs résultats avec moins de frais généraux.</p>
<p>Au fur et à mesure que la technologie de l'IA évolue, les systèmes les plus efficaces combineront probablement les deux stratégies :</p>
<ul>
<li><p>Les<strong>flux de travail</strong> où la prévisibilité, la maintenabilité et la reproductibilité sont essentielles.</p></li>
<li><p>Les<strong>agents</strong>, pour lesquels le raisonnement réel, l'adaptabilité et la résolution de problèmes ouverts sont nécessaires.</p></li>
</ul>
<p>L'objectif n'est pas de construire l'IA la plus tape-à-l'œil, mais la plus <em>utile</em>. Et souvent, la solution la plus utile est aussi la plus simple.</p>
