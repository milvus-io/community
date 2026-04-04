---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: >-
  Le MCP est-il mort ? Ce que nous avons appris Construire avec des compétences
  MCP, CLI et Agent
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP mange le contexte, se casse en production et ne peut pas réutiliser le LLM
  de votre agent. Nous avons construit avec les trois - voici quand chacun
  s'adapte.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Lorsque Denis Yarats, directeur technique de Perplexity, a déclaré à ASK 2026 que la société privait MCP de priorité en interne, cela a déclenché le cycle habituel. Le PDG de YC, Garry Tan, s'est emparé de la question - MCP mange trop de fenêtre de contexte, l'authentification est cassée, il a construit un remplacement CLI en 30 minutes. Hacker News a publié un article fortement anti-MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il y a un an, un tel niveau de scepticisme public aurait été inhabituel. Model Context Protocol (MCP) était considéré comme la norme définitive pour l'intégration d'outils d'<a href="https://zilliz.com/glossary/ai-agents">agents d'intelligence artificielle</a>. Le nombre de serveurs doublait chaque semaine. Depuis lors, le schéma a suivi un arc familier : engouement rapide, adoption à grande échelle, puis désillusion au niveau de la production.</p>
<p>L'industrie réagit rapidement. Lark/Feishu de Bytedance a ouvert son CLI officiel - plus de 200 commandes dans 11 domaines d'activité avec 19 compétences d'agent intégrées. Google a lancé gws pour Google Workspace. Le modèle CLI + compétences devient rapidement le modèle par défaut pour les outils d'agent d'entreprise, et non une alternative de niche.</p>
<p>Chez Zilliz, nous avons publié <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>, qui vous permet d'exploiter et de gérer <a href="https://milvus.io/intro">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus entièrement géré) directement à partir de votre terminal sans quitter votre environnement de codage. En outre, nous avons créé <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> et <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>pour que les agents de codage IA comme Claude Code et Codex puissent gérer votre <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> en langage naturel.</p>
<p>Il y a un an, nous avons également construit un serveur MCP pour Milvus et Zilliz Cloud. Cette expérience nous a appris exactement où MCP s'effondre - et où il s'adapte encore. Trois limitations architecturales nous ont poussés vers CLI et Skills : le gonflement des fenêtres de contexte, la conception passive des outils, et l'incapacité de réutiliser le LLM de l'agent.</p>
<p>Dans ce billet, nous allons passer en revue chaque problème, montrer ce que nous construisons à la place, et présenter un cadre pratique pour choisir entre MCP, CLI, et Agent Skills.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP consomme 72% de votre fenêtre de contexte au démarrage<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Une configuration MCP standard peut consommer environ 72% de votre fenêtre de contexte disponible avant que l'agent ne prenne une seule action. Connectez trois serveurs - GitHub, Playwright, et une intégration IDE - sur un modèle de 200K tokens, et les définitions d'outils occupent à elles seules environ 143K tokens. L'agent n'a encore rien fait. Il est déjà rempli aux trois quarts.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le coût ne se limite pas aux jetons. Plus il y a de contenu sans rapport avec le contexte, moins le modèle se concentre sur ce qui est réellement important. Une centaine de schémas d'outils placés dans le contexte signifie que l'agent les parcourt tous à chaque décision. Les chercheurs ont documenté ce qu'ils appellent la <em>pourriture de contexte</em>, c'est-à-dire la dégradation de la qualité du raisonnement due à la surcharge de contexte. Lors de tests mesurés, la précision de la sélection des outils a chuté de 43 % à moins de 14 % à mesure que le nombre d'outils augmentait. Paradoxalement, plus il y a d'outils, plus leur utilisation est mauvaise.</p>
<p>La cause première est architecturale. MCP charge toutes les descriptions d'outils dans leur intégralité au début de la session, sans se soucier de savoir si la conversation en cours les utilisera un jour ou l'autre. Il s'agit d'un choix de conception au niveau du protocole, et non d'un bogue, mais le coût augmente avec chaque outil ajouté.</p>
<p>Les compétences des agents adoptent une approche différente : la <strong>divulgation progressive</strong>. Au début de la session, un agent ne lit que les métadonnées de chaque compétence - nom, description en une ligne, condition de déclenchement. Quelques dizaines de jetons au total. Le contenu complet de la compétence n'est chargé que lorsque l'agent le juge pertinent. Pensez-y de cette manière : MCP aligne tous les outils devant la porte et vous oblige à choisir ; Skills vous donne d'abord un index, puis un contenu complet à la demande.</p>
<p>Les outils CLI offrent un avantage similaire. Un agent exécute git --help ou docker --help pour découvrir les capacités à la demande, sans précharger chaque définition de paramètre. Le coût du contexte est payé au fur et à mesure, et non à l'avance.</p>
<p>À petite échelle, la différence est négligeable. À l'échelle de la production, c'est la différence entre un agent qui fonctionne et un agent qui se noie dans ses propres définitions d'outils.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">L'architecture passive de MCP limite les flux de travail des agents<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP est un protocole d'appel d'outils : comment découvrir des outils, les appeler et recevoir des résultats. Une conception propre pour des cas d'utilisation simples. Mais cette propreté est aussi une contrainte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Espace d'outils plat sans hiérarchie</h3><p>Un outil MCP est une signature de fonction plate. Il n'y a pas de sous-commandes, pas de conscience du cycle de vie de la session, pas de sens de la position de l'agent dans un flux de travail à plusieurs étapes. Il attend d'être appelé. C'est tout ce qu'il fait.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un CLI fonctionne différemment. git commit, git push et git log sont des chemins d'exécution complètement différents qui partagent une interface unique. Un agent exécute --help, explore la surface disponible de manière incrémentale, et développe seulement ce dont il a besoin - sans charger en amont toute la documentation des paramètres dans le contexte.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Les compétences encodent la logique du flux de travail - MCP ne le peut pas</h3><p>Une compétence d'agent est un fichier Markdown contenant une procédure opérationnelle standard : ce qu'il faut faire en premier, ce qu'il faut faire ensuite, comment gérer les échecs et quand faire remonter quelque chose à l'utilisateur. L'agent ne reçoit pas seulement un outil, mais un flux de travail complet. Les compétences déterminent activement le comportement de l'agent au cours d'une conversation - ce qui le déclenche, ce qu'il prépare à l'avance et comment il se remet des erreurs. Les outils MCP ne peuvent qu'attendre.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP ne peut pas accéder au LLM de l'agent</h3><p>C'est la limitation qui nous a réellement arrêtés.</p>
<p>Lorsque nous avons créé <a href="https://github.com/zilliztech/claude-context">claude-context</a> - un plugin MCP qui ajoute la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a> à Claude Code et à d'autres agents de codage IA, en leur donnant un contexte approfondi à partir d'une base de code entière - nous voulions récupérer des bribes de conversations historiques pertinentes de Milvus et les faire apparaître en tant que contexte. La recherche <a href="https://zilliz.com/learn/vector-similarity-search">vectorielle</a> a fonctionné. Le problème était de savoir ce qu'il fallait faire des résultats.</p>
<p>Récupérez les 10 premiers résultats, et peut-être que 3 d'entre eux sont utiles. Les 7 autres sont du bruit. Remettez les 10 résultats à l'agent extérieur, et le bruit interfère avec la réponse. Lors des tests, nous avons constaté que les réponses étaient distraites par des enregistrements historiques non pertinents. Nous devions filtrer avant de transmettre les résultats.</p>
<p>Nous avons essayé plusieurs approches. Ajout d'une étape de reclassement dans le serveur MCP à l'aide d'un petit modèle : pas assez précis, et le seuil de pertinence doit être ajusté en fonction de chaque cas d'utilisation. Utilisation d'un grand modèle pour le reranking : techniquement valable, mais un serveur MCP s'exécute comme un processus séparé sans accès au LLM de l'agent extérieur. Nous devrions configurer un client LLM distinct, gérer une clé API distincte et un chemin d'appel distinct.</p>
<p>Ce que nous voulions était simple : laisser le LLM de l'agent externe participer directement à la décision de filtrage. Récupérer les 10 premiers, laisser l'agent lui-même juger ce qui vaut la peine d'être gardé, et ne renvoyer que les résultats pertinents. Pas de deuxième modèle. Pas de clés API supplémentaires.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP ne peut pas faire cela. La frontière de processus entre le serveur et l'agent est également une frontière d'intelligence. Le serveur ne peut pas utiliser le LLM de l'agent ; l'agent ne peut pas gouverner ce qui se passe à l'intérieur du serveur. Cela convient aux outils CRUD simples. Dès qu'un outil a besoin de faire un appel au jugement, cette isolation devient une véritable contrainte.</p>
<p>Une compétence d'agent résout directement ce problème. Une compétence de recherche peut appeler une recherche vectorielle pour les 10 premiers, demander au LLM de l'agent d'évaluer la pertinence et ne renvoyer que ce qui est pertinent. Aucun modèle supplémentaire. L'agent effectue le filtrage lui-même.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">Ce que nous avons construit à la place avec CLI et Skills<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous considérons que CLI + Skills est la direction à suivre pour l'interaction agent-outil - pas seulement pour la récupération de la mémoire, mais dans toute la pile. Cette conviction est à la base de tout ce que nous construisons.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch : Une couche de mémoire basée sur les compétences pour les agents d'IA</h3><p>Nous avons construit <a href="https://github.com/zilliztech/memsearch">memsearch</a>, une couche de mémoire open-source pour Claude Code et d'autres agents d'intelligence artificielle. La compétence s'exécute à l'intérieur d'un sous-agent avec trois étapes : Milvus gère la recherche vectorielle initiale pour une découverte large, le LLM de l'agent évalue la pertinence et développe le contexte pour les résultats prometteurs, et un forage final accède aux conversations originales uniquement lorsque cela est nécessaire. Le bruit est éliminé à chaque étape - le bric-à-brac de la recherche intermédiaire n'atteint jamais la fenêtre contextuelle primaire.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'idée clé : l'intelligence de l'agent fait partie de l'exécution de l'outil. Le LLM déjà dans la boucle fait le filtrage - pas de deuxième modèle, pas de clé API supplémentaire, pas de réglage fragile des seuils. Il s'agit d'un cas d'utilisation spécifique - la récupération de contextes de conversation pour les agents de codage - mais l'architecture se généralise à tout scénario dans lequel un outil a besoin de jugement, et pas seulement d'exécution.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills et Plugin pour les opérations de base de données vectorielles</h3><p>Milvus est la base de données vectorielle open-source la plus largement adoptée au monde avec <a href="https://github.com/milvus-io/milvus">plus de 43 000 étoiles sur GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> est le service entièrement géré de Milvus avec des fonctionnalités d'entreprise avancées et est beaucoup plus rapide que Milvus.</p>
<p>L'architecture en couches mentionnée ci-dessus est à la base de nos outils de développement :</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> est la couche d'infrastructure. Gestion des clusters, <a href="https://milvus.io/docs/manage-collections.md">opérations de collecte</a>, recherche vectorielle, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, sauvegardes, facturation - tout ce que vous feriez dans la console Zilliz Cloud, disponible à partir du terminal. Les humains et les agents utilisent les mêmes commandes. Zilliz CLI sert également de base à Milvus Skills et Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> est la couche de connaissances pour le logiciel libre Milvus. Elle enseigne aux agents de codage IA (Claude Code, Cursor, Codex, GitHub Copilot) à faire fonctionner n'importe quel déploiement Milvus - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone, ou Distributed - à travers le code Python <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>: connexions, <a href="https://milvus.io/docs/schema-hands-on.md">conception de schémas</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">recherche hybride</a>, <a href="https://milvus.io/docs/full-text-search.md">recherche en texte intégral</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> fait de même pour Zilliz Cloud, en apprenant aux agents à gérer l'infrastructure cloud à travers Zilliz CLI.</li>
<li>Zilliz<a href="https://github.com/zilliztech/zilliz-plugin">Plugin</a> est la couche d'expérience du développeur pour Claude Code - il enveloppe CLI + Skill dans une expérience guidée avec des commandes slash comme /zilliz:quickstart et /zilliz:status.</li>
</ul>
<p>Le CLI gère l'exécution, les compétences encodent la connaissance et la logique du flux de travail, le plugin fournit l'UX. Pas de serveur MCP dans la boucle.</p>
<p>Pour plus de détails, consultez ces ressources :</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Présentation de Zilliz CLI et des compétences des agents pour Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud vient d'atterrir dans le code Claude</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI Prompts - Zilliz Cloud Developer Hub (en anglais)</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI Reference - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus pour les agents d'intelligence artificielle - Milvus Documentation</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">Le MCP est-il en train de mourir ?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Beaucoup de développeurs et d'entreprises, y compris nous ici à Zilliz, se tournent vers le CLI et les compétences. Mais le MCP est-il vraiment en train de mourir ?</p>
<p>La réponse courte : non - mais son champ d'application se réduit à l'endroit où il a sa place.</p>
<p>MCP a été donné à la Fondation Linux. Les serveurs actifs sont plus de 10 000. Les téléchargements mensuels de SDK s'élèvent à 97 millions. Un écosystème de cette taille ne disparaît pas à cause d'un commentaire de conférence.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un fil de discussion de Hacker News - <em>"Quand est-ce que MCP a du sens par rapport à CLI ?"</em> - a suscité des réponses majoritairement favorables au CLI : "Les outils CLI sont comme des instruments de précision", "Les CLI sont aussi plus rapides que les MCP". Certains développeurs ont un point de vue plus équilibré : Les compétences sont une recette détaillée qui vous aide à mieux résoudre un problème ; le MCP est l'outil qui vous aide à résoudre le problème. Les deux ont leur place.</p>
<p>C'est juste, mais cela soulève une question pratique. Si la recette elle-même peut indiquer à l'agent quels outils utiliser et comment, un protocole distinct de distribution des outils est-il encore nécessaire ?</p>
<p>Cela dépend du cas d'utilisation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>MCP over stdio</strong> - la version que la plupart des développeurs exécutent localement - est le lieu où les problèmes s'accumulent : communication inter-processus instable, isolation désordonnée de l'environnement, surcoût élevé des jetons. Dans ce contexte, il existe de meilleures alternatives pour presque tous les cas d'utilisation.</p>
<p>Le<strong>MCP sur HTTP</strong> est une autre histoire. Les plateformes d'outils internes aux entreprises ont besoin d'une gestion centralisée des permissions, d'une OAuth unifiée, d'une télémétrie et d'une journalisation normalisées. Les outils CLI fragmentés ont vraiment du mal à fournir ces éléments. L'architecture centralisée de MCP a une réelle valeur dans ce contexte.</p>
<p>Ce que Perplexity a abandonné, c'est principalement le cas d'utilisation de stdio. Denis Yarats a spécifié "en interne" et n'a pas appelé à l'adoption de ce choix par l'ensemble de l'industrie. Cette nuance s'est perdue dans la transmission - "Perplexity abandonne MCP" se répand considérablement plus vite que "Perplexity dépriorise MCP par rapport à stdio pour l'intégration d'outils internes".</p>
<p>MCP a émergé parce qu'il a résolu un vrai problème : avant lui, chaque application d'IA écrivait sa propre logique d'appel d'outils, sans norme partagée. MCP a fourni une interface unifiée au bon moment, et l'écosystème s'est rapidement développé. L'expérience de la production a ensuite fait apparaître les limites. Il s'agit là d'un arc normal pour les outils d'infrastructure, et non d'une condamnation à mort.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Quand utiliser MCP, CLI ou Skills ?<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP over stdio (Local)</th><th>MCP sur HTTP (Entreprise)</th></tr>
</thead>
<tbody>
<tr><td><strong>Authentification</strong></td><td>Aucune</td><td>OAuth, centralisée</td></tr>
<tr><td><strong>Stabilité de la connexion</strong></td><td>Problèmes d'isolation des processus</td><td>HTTPS stable</td></tr>
<tr><td><strong>Journalisation</strong></td><td>Pas de mécanisme standard</td><td>Télémétrie centralisée</td></tr>
<tr><td><strong>Contrôle d'accès</strong></td><td>Aucun</td><td>Permissions basées sur les rôles</td></tr>
<tr><td><strong>Notre point de vue</strong></td><td>Remplacer par CLI + compétences</td><td>Conserver pour l'outillage d'entreprise</td></tr>
</tbody>
</table>
<p>Pour les équipes qui choisissent leur pile d'outils d'<a href="https://zilliz.com/glossary/ai-agents">IA agentique</a>, voici comment les couches s'intègrent :</p>
<table>
<thead>
<tr><th>Couche</th><th>Ce qu'il fait</th><th>Meilleur pour</th><th>Exemples d'utilisation</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Tâches opérationnelles, gestion des infrastructures</td><td>Commandes exécutées par les agents et les humains</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Compétences</strong></td><td>Logique du flux de travail de l'agent, connaissances encodées</td><td>Tâches nécessitant un jugement LLM, SOPs multi-étapes</td><td>compétences milvus, compétences zilliz, memsearch</td></tr>
<tr><td><strong>API REST</strong></td><td>Intégrations externes</td><td>Connexion à des services tiers</td><td>API GitHub, API Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Plateformes d'outils d'entreprise</td><td>Authentification centralisée, enregistrement des audits</td><td>Passerelles d'outils internes</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Commencer<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout ce dont nous avons parlé dans cet article est disponible dès aujourd'hui :</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - la couche de mémoire basée sur les compétences pour les agents d'intelligence artificielle. Ajoutez-la à Claude Code ou à n'importe quel agent qui prend en charge les compétences.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - gérer Milvus et Zilliz Cloud depuis votre terminal. Installez-le et explorez les sous-commandes que vos agents peuvent utiliser.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> et <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> - donnez à votre agent de codage IA des connaissances natives sur Milvus et Zilliz Cloud.</li>
</ul>
<p>Vous avez des questions sur la recherche vectorielle, l'architecture des agents ou la construction avec CLI et Skills ? Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Milvus Discord</a> ou <a href="https://milvus.io/office-hours">réservez une session Office Hours gratuite</a> pour discuter de votre cas d'utilisation.</p>
<p>Prêt à construire ? <a href="https://cloud.zilliz.com/signup">Inscrivez-vous à Zilliz Cloud</a> - les nouveaux comptes avec une adresse e-mail professionnelle reçoivent 100 $ de crédits gratuits. Vous avez déjà un compte ? <a href="https://cloud.zilliz.com/login">Connectez-vous ici</a>.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Questions fréquemment posées<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">Qu'est-ce qui ne va pas avec MCP pour les agents d'intelligence artificielle ?</h3><p>MCP a trois limitations architecturales principales en production. Premièrement, il charge tous les schémas d'outils dans la fenêtre de contexte au début de la session - la connexion de seulement trois serveurs MCP sur un modèle de 200 000 jetons peut consommer plus de 70 % du contexte disponible avant que l'agent ne fasse quoi que ce soit. Deuxièmement, les outils MCP sont passifs : ils attendent d'être appelés et ne peuvent pas coder des flux de travail à plusieurs étapes, une logique de traitement des erreurs ou des procédures opérationnelles standard. Troisièmement, les serveurs MCP s'exécutent en tant que processus distincts sans accès au LLM de l'agent, de sorte que tout outil nécessitant un jugement (comme le filtrage des résultats de recherche en fonction de leur pertinence) nécessite la configuration d'un modèle distinct avec sa propre clé API. Ces problèmes sont les plus aigus avec MCP sur stdio ; MCP sur HTTP en atténue certains.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">Quelle est la différence entre MCP et Agent Skills ?</h3><p>MCP est un protocole d'appel d'outils qui définit comment un agent découvre et invoque des outils externes. Une compétence d'agent est un fichier Markdown contenant une procédure opérationnelle standard complète - déclencheurs, instructions étape par étape, gestion des erreurs et règles d'escalade. La principale différence architecturale : Les compétences s'exécutent dans le processus de l'agent, de sorte qu'elles peuvent tirer parti de la LLM de l'agent pour des appels au jugement tels que le filtrage de la pertinence ou le reclassement des résultats. Les outils MCP s'exécutent dans un processus distinct et ne peuvent pas accéder à l'intelligence de l'agent. Les compétences utilisent également la divulgation progressive - seules les métadonnées légères sont chargées au démarrage, le contenu complet étant chargé à la demande - ce qui réduit au minimum l'utilisation de la fenêtre contextuelle par rapport au chargement initial du schéma de MCP.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">Quand dois-je continuer à utiliser MCP plutôt que CLI ou Skills ?</h3><p>MCP sur HTTP a toujours du sens pour les plateformes d'outils d'entreprise où vous avez besoin d'OAuth centralisé, d'un contrôle d'accès basé sur les rôles, d'une télémétrie standardisée et d'une journalisation d'audit à travers de nombreux outils internes. Les outils CLI fragmentés peinent à répondre de manière cohérente à ces exigences d'entreprise. Pour les flux de développement locaux - où les agents interagissent avec les outils sur votre machine - CLI + Skills offre généralement de meilleures performances, un contexte moins lourd et une logique de flux de travail plus flexible que MCP sur stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">Comment les outils CLI et les compétences des agents fonctionnent-ils ensemble ?</h3><p>L'outil CLI fournit la couche d'exécution (les commandes proprement dites), tandis que les compétences fournissent la couche de connaissance (quand exécuter telle ou telle commande, dans quel ordre, et comment gérer les échecs). Par exemple, le CLI de Zilliz gère les opérations d'infrastructure telles que la gestion des clusters, le CRUD des collections et la recherche vectorielle. Milvus Skill enseigne à l'agent les bons modèles pymilvus pour la conception de schémas, la recherche hybride et les pipelines RAG. L'interface de programmation fait le travail ; la compétence connaît le flux de travail. Ce modèle en couches - CLI pour l'exécution, Skills pour la connaissance, un plugin pour l'UX - est la façon dont nous avons structuré tous nos outils de développement chez Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI : quand dois-je utiliser chacun d'entre eux ?</h3><p>Les outils CLI comme git, docker, ou zilliz-cli sont les meilleurs pour les tâches opérationnelles - ils exposent des sous-commandes hiérarchiques et se chargent à la demande. Les compétences telles que milvus-skill sont les meilleures pour la logique de flux de travail de l'agent - elles portent les procédures d'exploitation, la récupération des erreurs et peuvent accéder au LLM de l'agent. MCP over HTTP convient toujours aux plateformes d'outils d'entreprise qui ont besoin d'OAuth centralisé, de permissions et de journaux d'audit. MCP over stdio - la version locale - est remplacée par CLI + Skills dans la plupart des configurations de production.</p>
