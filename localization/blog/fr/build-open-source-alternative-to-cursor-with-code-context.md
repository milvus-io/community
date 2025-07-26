---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Construire une alternative Open-Source au curseur avec Code Context
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context - un plugin open-source, compatible MCP, qui apporte une
  puissante recherche sémantique de code à n'importe quel agent de codage AI,
  Claude Code et Gemini CLI, des IDE comme VSCode, et même des environnements
  comme Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">Le boom du codage de l'IA et son angle mort<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Les outils de codage de l'IA sont omniprésents, et c'est pour une bonne raison qu'ils sont en train de faire des ravages. Qu'il s'agisse de <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, de Gemini CLI</a> ou des alternatives open-source de Cursor, ces agents peuvent écrire des fonctions, expliquer les dépendances du code et remanier des fichiers entiers à l'aide d'une simple invite. Les développeurs s'empressent de les intégrer dans leurs flux de travail et, à bien des égards, ils sont à la hauteur de l'engouement suscité.</p>
<p><strong>Mais lorsqu'il s'agit de <em>comprendre votre base de code</em>, la plupart des outils d'IA se heurtent à un mur.</strong></p>
<p>Demandez à Claude Code de trouver "où ce projet gère l'authentification des utilisateurs", et il se rabat sur <code translate="no">grep -r &quot;auth&quot;</code>- crachant 87 correspondances vaguement liées à travers les commentaires, les noms de variables et les noms de fichiers, manquant probablement de nombreuses fonctions avec une logique d'authentification mais qui ne sont pas appelées "auth". Essayez Gemini CLI, et il cherchera des mots-clés comme "login" ou "password", manquant complètement des fonctions comme <code translate="no">verifyCredentials()</code>. Ces outils sont excellents pour générer du code, mais lorsqu'il s'agit de naviguer, de déboguer ou d'explorer des systèmes peu familiers, ils s'effondrent. À moins d'envoyer l'ensemble du code au LLM pour obtenir un contexte - en brûlant des jetons et du temps - ils peinent à fournir des réponses significatives.</p>
<p><em>C'est la véritable lacune des outils d'IA d'aujourd'hui : le</em> <strong><em>contexte du code.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor a réussi, mais pas pour tout le monde<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> s'attaque de front à ce problème. Au lieu de rechercher des mots-clés, il construit une carte sémantique de votre base de code à l'aide d'arbres syntaxiques, d'encastrements vectoriels et d'une recherche tenant compte du code. Demandez-lui "où se trouve la logique de validation du courrier électronique" et il vous renverra <code translate="no">isValidEmailFormat()</code> - non pas parce que le nom correspond, mais parce qu'il comprend ce que <em>fait</em> ce code.</p>
<p>Bien que Cursor soit puissant, il ne convient pas à tout le monde. <strong><em>Cursor est un logiciel fermé, hébergé dans le nuage et basé sur un abonnement.</em></strong> Il est donc hors de portée des équipes travaillant avec du code sensible, des organisations soucieuses de la sécurité, des développeurs indépendants, des étudiants et de tous ceux qui préfèrent les systèmes ouverts.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">Et si vous pouviez créer votre propre curseur ?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Le fait est que la technologie de base de Cursor n'est pas propriétaire. Elle repose sur des bases open-source éprouvées - bases de données vectorielles comme <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">modèles d'intégration</a>, analyseurs syntaxiques avec Tree-sitter - toutes disponibles pour quiconque souhaite relier les points.</p>
<p><em>Nous nous sommes donc posé la question :</em> <strong><em>Et si tout le monde pouvait construire son propre Cursor ?</em></strong> Fonctionne sur votre infrastructure. Pas de frais d'abonnement. Entièrement personnalisable. Contrôle total de votre code et de vos données.</p>
<p>C'est pourquoi nous avons créé <a href="https://github.com/zilliztech/code-context"><strong>Code Context - un</strong></a>plugin open-source, compatible MCP, qui apporte une puissante recherche sémantique de code à n'importe quel agent de codage AI, tel que Claude Code et Gemini CLI, des IDE comme VSCode, et même des environnements comme Google Chrome. Il vous donne également la possibilité de créer votre propre agent de codage comme Cursor à partir de zéro, débloquant ainsi une navigation intelligente en temps réel dans votre base de code.</p>
<p><strong><em>Pas d'abonnement. Pas de boîte noire. Juste l'intelligence du code, selon vos conditions.</em></strong></p>
<p>Dans la suite de cet article, nous verrons comment fonctionne Code Context et comment vous pouvez commencer à l'utiliser dès aujourd'hui.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context : Une alternative open-source à l'intelligence de Cursor<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> est un moteur de recherche sémantique de code open-source, compatible MCP. Que vous construisiez un assistant de codage IA personnalisé à partir de zéro ou que vous ajoutiez une conscience sémantique à des agents de codage IA comme Claude Code et Gemini CLI, Code Context est le moteur qui rend tout cela possible.</p>
<p>Il fonctionne localement, s'intègre à vos outils et environnements préférés, tels que VS Code et les navigateurs Chrome, et offre une compréhension robuste du code sans dépendre de plates-formes fermées, exclusivement dans le nuage.</p>
<p><strong>Ses principales fonctionnalités sont les suivantes</strong></p>
<ul>
<li><p><strong>Recherche sémantique de code en langage naturel :</strong> Recherche de code en langage naturel. Recherchez des concepts tels que "vérification de la connexion de l'utilisateur" ou "logique de traitement des paiements", et Code Context localisera les fonctions pertinentes, même si elles ne correspondent pas exactement aux mots-clés.</p></li>
<li><p><strong>Prise en charge multilingue :</strong> Effectuez des recherches en toute transparence dans plus de 15 langages de programmation, dont JavaScript, Python, Java et Go, et bénéficiez d'une compréhension sémantique cohérente dans tous ces langages.</p></li>
<li><p><strong>Découpage du code basé sur l'AST :</strong> Le code est automatiquement divisé en unités logiques, telles que les fonctions et les classes, à l'aide de l'analyse AST, ce qui garantit que les résultats de la recherche sont complets, significatifs et ne sont jamais interrompus au milieu d'une fonction.</p></li>
<li><p><strong>Indexation incrémentale en direct :</strong> Les modifications apportées au code sont indexées en temps réel. Au fur et à mesure que vous modifiez des fichiers, l'index de recherche reste à jour, sans qu'il soit nécessaire de procéder à des actualisations ou à des réindexations manuelles.</p></li>
<li><p><strong>Déploiement entièrement local et sécurisé :</strong> Exécutez tout sur votre propre infrastructure. Code Context prend en charge les modèles locaux via Ollama et l'indexation via <a href="https://milvus.io/">Milvus</a>, de sorte que votre code ne quitte jamais votre environnement.</p></li>
<li><p><strong>Intégration IDE de premier ordre :</strong> L'extension VSCode vous permet d'effectuer des recherches et d'accéder aux résultats instantanément, directement depuis votre éditeur, sans changement de contexte.</p></li>
<li><p><strong>Prise en charge du protocole MCP :</strong> Code Context parle le protocole MCP, ce qui facilite l'intégration avec les assistants de codage IA et permet d'intégrer la recherche sémantique directement dans leurs flux de travail.</p></li>
<li><p><strong>Prise en charge des plugins de navigateur :</strong> Recherchez des dépôts directement depuis GitHub dans votre navigateur - pas d'onglets, pas de copier-coller, juste un contexte instantané où que vous travailliez.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Comment fonctionne Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context utilise une architecture modulaire avec un orchestrateur central et des composants spécialisés pour l'intégration, l'analyse, le stockage et la récupération.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">Le module de base : Code Context Core</h3><p>Au cœur de Code Context se trouve le <strong>Code Context Core</strong>, qui coordonne l'analyse, l'intégration, le stockage et l'extraction sémantique du code :</p>
<ul>
<li><p>Le<strong>module de traitement de texte</strong> divise et analyse le code à l'aide de Tree-sitter pour une analyse AST tenant compte du langage.</p></li>
<li><p>L'<strong>interface d'intégration</strong> prend en charge les backends enfichables - actuellement OpenAI et VoyageAI - convertissant les morceaux de code en intégrations vectorielles qui capturent leur signification sémantique et leurs relations contextuelles.</p></li>
<li><p><strong>L'interface de base de données vectorielle</strong> stocke ces incorporations dans une instance <a href="https://milvus.io/">Milvus</a> auto-hébergée (par défaut) ou dans <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, la version gérée de Milvus.</p></li>
</ul>
<p>Tout cela est synchronisé avec votre système de fichiers sur une base programmée, ce qui garantit que l'index reste à jour sans nécessiter d'intervention manuelle.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Modules d'extension au dessus de Code Context Core</h3><ul>
<li><p><strong>Extension VSCode</strong>: Intégration transparente de l'IDE pour une recherche sémantique rapide dans l'éditeur et un saut de définition.</p></li>
<li><p><strong>Extension Chrome</strong>: Recherche sémantique de code en ligne lors de la navigation dans les dépôts GitHub - pas besoin de changer d'onglet.</p></li>
<li><p><strong>Serveur MCP</strong>: Expose Code Context à tout assistant de codage IA via le protocole MCP, permettant une assistance contextuelle en temps réel.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Démarrer avec Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context peut être intégré dans les outils de codage que vous utilisez déjà ou pour créer un assistant de codage IA personnalisé à partir de zéro. Dans cette section, nous aborderons les deux scénarios :</p>
<ul>
<li><p>Comment intégrer Code Context aux outils existants</p></li>
<li><p>Comment configurer le module de base pour une recherche de code sémantique autonome lors de la création de votre propre assistant de codage IA.</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Intégration MCP</h3><p>Code Context supporte le <strong>Model Context Protocol (MCP)</strong>, ce qui permet aux agents de codage IA comme Claude Code de l'utiliser comme backend sémantique.</p>
<p>Pour intégrer Claude Code :</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois configuré, Claude Code appellera automatiquement Code Context pour la recherche sémantique de code lorsque cela est nécessaire.</p>
<p>Pour intégrer d'autres outils ou environnements, consultez notre<a href="https://github.com/zilliztech/code-context"> repo GitHub</a> pour plus d'exemples et d'adaptateurs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Construire votre propre assistant de codage avec Code Context</h3><p>Pour créer un assistant d'intelligence artificielle personnalisé à l'aide de Code Context, vous devez configurer le module de base pour la recherche sémantique de code en trois étapes seulement :</p>
<ol>
<li><p>Configurer votre modèle d'intégration</p></li>
<li><p>Connectez-vous à votre base de données vectorielle</p></li>
<li><p>Indexez votre projet et commencez la recherche</p></li>
</ol>
<p>Voici un exemple utilisant <strong>OpenAI Embeddings</strong> et la <strong>base de données vectorielles</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> comme backend vectoriel :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Extension VSCode</h3><p>Code Context est disponible sous la forme d'une extension VSCode nommée <strong>"Semantic Code Search",</strong> qui apporte une recherche intelligente de code en langage naturel directement dans votre éditeur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois installée :</p>
<ul>
<li><p>Configurez votre clé API</p></li>
<li><p>Indexez votre projet</p></li>
<li><p>Utilisez des requêtes en langage naturel (pas besoin de correspondance exacte)</p></li>
<li><p>Accédez instantanément aux résultats en cliquant sur la barre de navigation.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'exploration sémantique fait ainsi partie intégrante de votre flux de travail de codage - aucun terminal ou navigateur n'est nécessaire.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Extension Chrome (bientôt disponible)</h3><p>Notre prochaine <strong>extension Chrome</strong> apporte Code Context aux pages web de GitHub, vous permettant de lancer une recherche sémantique de code directement à l'intérieur de n'importe quel dépôt public - sans changement de contexte ou d'onglets.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous pourrez explorer des bases de code inconnues avec les mêmes capacités de recherche approfondie que celles dont vous disposez localement. Restez à l'écoute : l'extension est en cours de développement et sera bientôt lancée.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Pourquoi utiliser Code Context ?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La configuration de base vous permet d'être rapidement opérationnel, mais c'est dans les environnements de développement professionnels et performants que <strong>Code Context</strong> brille vraiment. Ses fonctionnalités avancées sont conçues pour prendre en charge des flux de travail sérieux, des déploiements à l'échelle de l'entreprise aux outils d'IA personnalisés.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Déploiement privé pour une sécurité de niveau entreprise</h3><p>Code Context prend en charge le déploiement hors ligne à l'aide du modèle d'intégration locale <strong>Ollama</strong> et de <strong>Milvus</strong> en tant que base de données vectorielle auto-hébergée. Cela permet d'obtenir un pipeline de recherche de code entièrement privé : pas d'appels API, pas de transmission Internet et aucune donnée ne quitte votre environnement local.</p>
<p>Cette architecture est idéale pour les secteurs soumis à des exigences de conformité strictes, tels que la finance, l'administration et la défense, où la confidentialité du code n'est pas négociable.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Indexation en temps réel avec synchronisation intelligente des fichiers</h3><p>La mise à jour de votre index de code ne doit pas être lente ou manuelle. Code Context inclut un <strong>système de surveillance des fichiers basé sur l'arbre de Merkle</strong> qui détecte instantanément les changements et effectue des mises à jour incrémentielles en temps réel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En ne réindexant que les fichiers modifiés, il réduit le temps de mise à jour des grands référentiels de quelques minutes à quelques secondes. Cela garantit que le code que vous venez d'écrire est déjà consultable, sans qu'il soit nécessaire de cliquer sur "rafraîchir".</p>
<p>Dans les environnements de développement rapide, ce type d'immédiateté est essentiel.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">Une analyse AST qui comprend le code comme vous le faites</h3><p>Les outils de recherche de code traditionnels découpent le texte en fonction du nombre de lignes ou de caractères, brisant souvent les unités logiques et renvoyant des résultats confus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context fait mieux. Il utilise l'analyse AST de Tree-sitter pour comprendre la structure réelle du code. Il identifie les fonctions, les classes, les interfaces et les modules complets, fournissant ainsi des résultats propres et sémantiquement complets.</p>
<p>Il prend en charge les principaux langages de programmation, notamment JavaScript/TypeScript, Python, Java, C/C++, Go et Rust, avec des stratégies spécifiques à chaque langage pour un découpage précis. Pour les langages non pris en charge, il revient à l'analyse syntaxique basée sur des règles, ce qui garantit un traitement gracieux sans plantage ni résultats vides.</p>
<p>Ces unités de code structurées sont également intégrées dans les métadonnées pour une recherche sémantique plus précise.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Open Source et extensible par conception</h3><p>Code Context est entièrement open source sous licence MIT. Tous les modules de base sont accessibles au public sur GitHub.</p>
<p>Nous pensons qu'une infrastructure ouverte est la clé pour construire des outils de développement puissants et fiables, et nous invitons les développeurs à l'étendre à de nouveaux modèles, langages ou cas d'utilisation.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Résoudre le problème de la fenêtre contextuelle pour les assistants d'intelligence artificielle</h3><p>Les grands modèles de langage (LLM) ont une limite stricte : leur fenêtre contextuelle. Cela les empêche de voir l'ensemble d'une base de code, ce qui réduit la précision des compléments, des corrections et des suggestions.</p>
<p>Code Context permet de combler cette lacune. Sa recherche sémantique de code permet de retrouver les <em>bons</em> morceaux de code, ce qui donne à votre assistant d'intelligence artificielle un contexte ciblé et pertinent pour raisonner. Il améliore la qualité des résultats générés par l'IA en permettant au modèle de "zoomer" sur ce qui est réellement important.</p>
<p>Les outils de codage d'IA populaires, tels que Claude Code et Gemini CLI, ne disposent pas d'une recherche de code sémantique native - ils s'appuient sur des heuristiques superficielles basées sur des mots-clés. Code Context, lorsqu'il est intégré via <strong>MCP</strong>, leur apporte une mise à niveau cérébrale.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Conçu pour les développeurs, par les développeurs</h3><p>Code Context est conçu pour être réutilisé de manière modulaire : chaque composant est disponible sous la forme d'un paquetage <strong>npm</strong> indépendant. Vous pouvez les mélanger, les associer et les étendre en fonction des besoins de votre projet.</p>
<ul>
<li><p>Vous n'avez besoin que d'une recherche sémantique de code ? Utiliser<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Vous voulez vous connecter à un agent d'intelligence artificielle ? Ajoutez <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Vous construisez votre propre outil IDE/navigateur ? Utilisez nos exemples de VSCode et d'extension Chrome</p></li>
</ul>
<p>Quelques exemples d'applications du contexte de code :</p>
<ul>
<li><p><strong>Plugins d'autocomplétion sensibles au contexte</strong> qui extraient des extraits pertinents pour de meilleures complétions LLM</p></li>
<li><p><strong>Détecteurs de bogues intelligents</strong> qui rassemblent le code environnant pour améliorer les suggestions de correction</p></li>
<li><p><strong>Outils de refactorisation de code sûrs</strong> qui trouvent automatiquement des emplacements sémantiquement liés</p></li>
<li><p><strong>Des visualiseurs d'architecture</strong> qui construisent des diagrammes à partir des relations sémantiques entre les codes</p></li>
<li><p><strong>Des assistants de révision de code plus intelligents</strong> qui font apparaître les implémentations historiques pendant les révisions PR.</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Bienvenue dans notre communauté<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> est plus qu'un simple outil, c'est une plateforme pour explorer comment l <strong>'IA et les bases de données vectorielles</strong> peuvent travailler ensemble pour vraiment comprendre le code. Alors que le développement assisté par l'IA devient la norme, nous pensons que la recherche sémantique de code sera une capacité fondamentale.</p>
<p>Les contributions de toutes sortes sont les bienvenues :</p>
<ul>
<li><p>Prise en charge de nouveaux langages</p></li>
<li><p>Nouveaux modèles d'intégration</p></li>
<li><p>Flux de travail innovants assistés par l'IA</p></li>
<li><p>Commentaires, rapports de bogues et idées de conception</p></li>
</ul>
<p>Retrouvez-nous ici :</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context sur GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>MCP npm package</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode marketplace</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Ensemble, nous pouvons construire l'infrastructure de la prochaine génération d'outils de développement de l'IA - transparents, puissants et orientés vers les développeurs.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
