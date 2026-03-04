---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: >-
  Comment créer des agents d'IA prêts pour la production avec Deep Agents et
  Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Apprenez à construire des agents d'intelligence artificielle évolutifs à
  l'aide de Deep Agents et de Milvus pour des tâches de longue durée, des coûts
  de jetons réduits et une mémoire persistante.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>De plus en plus d'équipes mettent en place des agents d'intelligence artificielle et les tâches qu'elles leur confient deviennent de plus en plus complexes. De nombreux flux de travail réels impliquent des tâches de longue haleine comportant de multiples étapes et de nombreux appels d'outils. À mesure que ces tâches prennent de l'ampleur, deux problèmes apparaissent rapidement : l'augmentation du coût des jetons et les limites de la fenêtre contextuelle du modèle. Les agents doivent aussi souvent se souvenir d'informations entre les sessions, telles que les résultats de recherches antérieures, les préférences de l'utilisateur ou les conversations précédentes.</p>
<p>Des cadres tels que <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, publié par LangChain, aident à organiser ces flux de travail. Il fournit un moyen structuré d'exécuter des agents, avec un support pour la planification des tâches, l'accès aux fichiers et la délégation des sous-agents. Il est ainsi plus facile de créer des agents capables de gérer des tâches longues et à plusieurs étapes de manière plus fiable.</p>
<p>Mais les flux de travail ne suffisent pas. Les agents ont également besoin d'une <strong>mémoire à long terme</strong> pour pouvoir récupérer les informations utiles des sessions précédentes. C'est là que <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielle open-source, entre en jeu. En stockant des enchâssements de conversations, de documents et de résultats d'outils, Milvus permet aux agents de rechercher et de rappeler des connaissances antérieures.</p>
<p>Dans cet article, nous expliquerons le fonctionnement de Deep Agents et montrerons comment le combiner avec Milvus pour construire des agents d'IA avec des flux de travail structurés et une mémoire à long terme.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Qu'est-ce que Deep Agents ?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> est un framework d'agent open-source construit par l'équipe LangChain. Il est conçu pour aider les agents à gérer de manière plus fiable les tâches à long terme et à étapes multiples. Il se concentre sur trois capacités principales :</p>
<p><strong>1. Planification des tâches</strong></p>
<p>Deep Agents comprend des outils intégrés tels que <code translate="no">write_todos</code> et <code translate="no">read_todos</code>. L'agent décompose une tâche complexe en une liste claire de choses à faire, puis travaille sur chaque élément étape par étape, en marquant les tâches comme terminées.</p>
<p><strong>2. Accès au système de fichiers</strong></p>
<p>Il fournit des outils tels que <code translate="no">ls</code>, <code translate="no">read_file</code>, et <code translate="no">write_file</code>, afin que l'agent puisse visualiser, lire et écrire des fichiers. Si un outil produit un résultat important, celui-ci est automatiquement enregistré dans un fichier au lieu de rester dans la fenêtre contextuelle du modèle. Cela permet d'éviter que la fenêtre contextuelle ne se remplisse.</p>
<p><strong>3. Délégation de sous-agents</strong></p>
<p>À l'aide d'un outil <code translate="no">task</code>, l'agent principal peut confier des tâches secondaires à des sous-agents spécialisés. Chaque sous-agent dispose de sa propre fenêtre contextuelle et de ses propres outils, ce qui permet d'organiser le travail.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Techniquement, un agent créé avec <code translate="no">create_deep_agent</code> est un <strong>LangGraph StateGraph</strong> compilé. (LangGraph est la bibliothèque de flux de travail développée par l'équipe LangChain, et StateGraph est sa structure d'état principale). De ce fait, les Deep Agents peuvent utiliser directement les fonctionnalités de LangGraph telles que la sortie en continu, le point de contrôle et l'interaction humaine dans la boucle.</p>
<p><strong>Qu'est-ce qui rend les agents profonds utiles dans la pratique ?</strong></p>
<p>Les tâches d'agent de longue durée sont souvent confrontées à des problèmes tels que les limites de contexte, le coût élevé des jetons et le manque de fiabilité de l'exécution. Deep Agents aide à résoudre ces problèmes en rendant les flux de travail des agents plus structurés et plus faciles à gérer. En réduisant la croissance inutile du contexte, il diminue l'utilisation des jetons et rend les tâches de longue durée plus rentables.</p>
<p>Il facilite également l'organisation des tâches complexes à plusieurs étapes. Les sous-tâches peuvent s'exécuter indépendamment sans interférer les unes avec les autres, ce qui améliore la fiabilité. Parallèlement, le système est flexible, ce qui permet aux développeurs de le personnaliser et de l'étendre au fur et à mesure que leurs agents passent du stade de simples expériences à celui d'applications de production.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Personnalisation des agents profonds<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un cadre général ne peut pas couvrir tous les besoins d'un secteur ou d'une entreprise. Deep Agents est conçu pour être flexible, afin que les développeurs puissent l'adapter à leurs propres cas d'utilisation.</p>
<p>Grâce à la personnalisation, vous pouvez</p>
<ul>
<li><p>connecter vos propres outils et API internes</p></li>
<li><p>Définir des flux de travail spécifiques à un domaine</p></li>
<li><p>S'assurer que l'agent respecte les règles de l'entreprise</p></li>
<li><p>Prendre en charge la mémoire et le partage des connaissances entre les sessions</p></li>
</ul>
<p>Voici les principaux moyens de personnaliser les Deep Agents :</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Personnalisation de l'invite système</h3><p>Vous pouvez ajouter votre propre invite système en plus des instructions par défaut fournies par l'intergiciel. Ceci est utile pour définir les règles du domaine et les flux de travail.</p>
<p>Une bonne invite personnalisée peut inclure</p>
<ul>
<li><strong>Règles de flux de travail du domaine</strong></li>
</ul>
<p>Exemple : "Pour les tâches d'analyse de données, toujours effectuer une analyse exploratoire avant de construire un modèle".</p>
<ul>
<li><strong>Exemples spécifiques</strong></li>
</ul>
<p>Exemple : "Regrouper les demandes de recherche documentaire similaires en une seule tâche."</p>
<ul>
<li><strong>Règles d'arrêt</strong></li>
</ul>
<p>Exemple : "Arrêter si plus de 100 appels d'outils sont utilisés".</p>
<ul>
<li><strong>Conseils pour la coordination des outils</strong></li>
</ul>
<p>Exemple : "Utilisez <code translate="no">grep</code> pour trouver l'emplacement du code, puis utilisez <code translate="no">read_file</code> pour afficher les détails."</p>
<p>Évitez de répéter des instructions que l'intergiciel gère déjà et évitez d'ajouter des règles qui entrent en conflit avec le comportement par défaut.</p>
<h3 id="Tools" class="common-anchor-header">Outils</h3><p>Vous pouvez ajouter vos propres outils au jeu d'outils intégré. Les outils sont définis comme des fonctions Python normales, et leurs docstrings décrivent ce qu'ils font.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents supporte également les outils qui suivent le standard Model Context Protocol (MCP) à travers <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Logiciel intermédiaire (middleware)</h3><p>Vous pouvez écrire des intergiciels personnalisés pour</p>
<ul>
<li><p>ajouter ou modifier des outils</p></li>
<li><p>Ajuster les invites</p></li>
<li><p>se connecter à différentes étapes de l'exécution de l'agent.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents comprend également des intergiciels intégrés pour la planification, la gestion des sous-agents et le contrôle de l'exécution.</p>
<table>
<thead>
<tr><th>Logiciel intermédiaire</th><th>Fonction</th></tr>
</thead>
<tbody>
<tr><td>Middleware de liste de tâches (TodoListMiddleware)</td><td>Fournit les outils write_todos et read_todos pour gérer les listes de tâches.</td></tr>
<tr><td>Middleware de système de fichiers</td><td>Fournit des outils d'exploitation de fichiers et enregistre automatiquement les résultats d'outils importants.</td></tr>
<tr><td>SubAgentMiddleware</td><td>Fournit l'outil de tâche permettant de déléguer le travail à des sous-agents.</td></tr>
<tr><td>SummarizationMiddleware (logiciel intermédiaire de résumé)</td><td>Résume automatiquement les informations lorsque le contexte dépasse 170k tokens.</td></tr>
<tr><td>AnthropicPromptCachingMiddleware (intergiciel de mise en cache des invites)</td><td>Active la mise en cache des messages pour les modèles anthropiques</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Corrige les appels d'outils incomplets causés par des interruptions</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Configure les outils qui nécessitent une approbation humaine</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Sous-agents</h3><p>L'agent principal peut déléguer des tâches secondaires à des sous-agents à l'aide de l'outil <code translate="no">task</code>. Chaque sous-agent s'exécute dans sa propre fenêtre contextuelle et dispose de ses propres outils et d'une invite système.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Pour les cas d'utilisation avancés, vous pouvez même passer un flux de travail LangGraph préconstruit en tant que sous-agent.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Contrôle de l'approbation humaine)</h3><p>Vous pouvez spécifier certains outils qui nécessitent une approbation humaine à l'aide du paramètre <code translate="no">interrupt_on</code>. Lorsque l'agent appelle l'un de ces outils, l'exécution est suspendue jusqu'à ce qu'une personne l'examine et l'approuve.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Personnalisation du backend (stockage)</h3><p>Vous pouvez choisir différents backends de stockage pour contrôler la manière dont les fichiers sont traités. Les options actuelles sont les suivantes</p>
<ul>
<li><p><strong>StateBackend</strong> (stockage temporaire)</p></li>
<li><p><strong>FilesystemBackend</strong> (stockage sur disque local)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>En modifiant le backend, vous pouvez ajuster le comportement du stockage des fichiers sans modifier la conception globale du système.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Pourquoi utiliser les agents profonds avec Milvus pour les agents d'intelligence artificielle ?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les applications réelles, les agents ont souvent besoin d'une mémoire qui dure pendant plusieurs sessions. Par exemple, ils peuvent avoir besoin de se souvenir des préférences de l'utilisateur, d'accumuler des connaissances sur un domaine au fil du temps, d'enregistrer des informations en retour pour ajuster le comportement ou de garder une trace des tâches de recherche à long terme.</p>
<p>Par défaut, Deep Agents utilise <code translate="no">StateBackend</code>, qui ne stocke les données que pendant une seule session. À la fin de la session, tout est effacé. Cela signifie qu'il ne peut pas prendre en charge la mémoire à long terme, entre les sessions.</p>
<p>Pour permettre une mémoire persistante, nous utilisons <a href="https://milvus.io/"><strong>Milvus</strong></a> comme base de données vectorielle avec <code translate="no">StoreBackend</code>. Voici comment cela fonctionne : le contenu des conversations importantes et les résultats des outils sont convertis en embeddings (vecteurs numériques qui représentent le sens) et stockés dans Milvus. Lorsqu'une nouvelle tâche commence, l'agent effectue une recherche sémantique pour retrouver les souvenirs passés qui s'y rapportent. Cela permet à l'agent de "se souvenir" des informations pertinentes des sessions précédentes.</p>
<p>Milvus est bien adapté à ce cas d'utilisation en raison de son architecture de séparation de l'informatique et du stockage. Il prend en charge</p>
<ul>
<li><p>la mise à l'échelle horizontale jusqu'à des dizaines de milliards de vecteurs</p></li>
<li><p>les requêtes à haute fréquence</p></li>
<li><p>les mises à jour de données en temps réel</p></li>
<li><p>un déploiement prêt à la production pour les systèmes à grande échelle.</p></li>
</ul>
<p>Techniquement, Deep Agents utilise <code translate="no">CompositeBackend</code> pour acheminer différents chemins vers différents backends de stockage :</p>
<table>
<thead>
<tr><th>Chemin</th><th>Backend</th><th>Objectif</th></tr>
</thead>
<tbody>
<tr><td>/workspace/, /temp/</td><td>StateBackend</td><td>Données temporaires, effacées après la session</td></tr>
<tr><td>/mémoires/, /connaissances/</td><td>StoreBackend + Milvus</td><td>Données persistantes, consultables d'une session à l'autre</td></tr>
</tbody>
</table>
<p>Avec cette configuration, les développeurs n'ont besoin que de sauvegarder des données à long terme dans des chemins tels que <code translate="no">/memories/</code>. Le système gère automatiquement la mémoire intersession. Les étapes de configuration détaillées sont fournies dans la section ci-dessous.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Travaux pratiques : Construire un agent d'IA avec une mémoire à long terme à l'aide de Milvus et d'agents profonds<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Cet exemple montre comment doter un agent basé sur DeepAgents d'une mémoire persistante à l'aide de Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Étape 1 : Installer les dépendances</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Étape 2 : Configurer le backend de la mémoire</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Étape 3 : Créer l'agent</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Points clés</strong></p>
<ul>
<li><strong>Chemin persistant</strong></li>
</ul>
<p>Tous les fichiers enregistrés sous <code translate="no">/memories/</code> seront stockés de manière permanente et pourront être consultés au cours de différentes sessions.</p>
<ul>
<li><strong>Configuration de la production</strong></li>
</ul>
<p>L'exemple utilise <code translate="no">InMemoryStore()</code> pour les tests. En production, remplacez-le par un adaptateur Milvus pour permettre une recherche sémantique évolutive.</p>
<ul>
<li><strong>Mémoire automatique</strong></li>
</ul>
<p>L'agent enregistre automatiquement les résultats de recherche et les résultats importants dans le dossier <code translate="no">/memories/</code>. Dans les tâches ultérieures, il peut rechercher et récupérer des informations antérieures pertinentes.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Aperçu des outils intégrés<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents comprend plusieurs outils intégrés, fournis par le biais d'un logiciel intermédiaire. Ils se répartissent en trois groupes principaux :</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Gestion des tâches (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Crée une liste structurée de tâches. Chaque tâche peut inclure une description, une priorité et des dépendances.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Affiche la liste des tâches en cours, y compris les tâches terminées et en attente.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Outils du système de fichiers (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Liste les fichiers d'un répertoire. Doit utiliser un chemin d'accès absolu (commençant par <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Lit le contenu des fichiers. Prend en charge <code translate="no">offset</code> et <code translate="no">limit</code> pour les fichiers volumineux.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Crée ou écrase un fichier.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Remplace un texte spécifique dans un fichier.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Recherche des fichiers à l'aide de modèles, tels que <code translate="no">**/*.py</code> pour rechercher tous les fichiers Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Recherche du texte dans les fichiers.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Exécute des commandes shell dans un environnement sandbox. Nécessite que le backend prenne en charge <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Délégation de sous-agent (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Envoie une sous-tâche à un sous-agent spécifique. Vous fournissez le nom du sous-agent et la description de la tâche.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Traitement des résultats des outils</h3><p>Si un outil génère un résultat important, Deep Agents l'enregistre automatiquement dans un fichier.</p>
<p>Par exemple, si <code translate="no">internet_search</code> renvoie 100 Ko de contenu, le système l'enregistre dans un fichier tel que <code translate="no">/tool_results/internet_search_1.txt</code>. L'agent ne conserve que le chemin d'accès au fichier dans son contexte. Cela permet de réduire l'utilisation de jetons et de limiter la taille de la fenêtre contextuelle.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder : Quand utiliser l'un ou l'autre ?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Puisque cet article se concentre sur DeepAgents, il est également utile de comprendre comment il se compare à</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, une autre option de construction d'agent dans l'écosystème LangChain.</em></p>
<p>LangChain propose plusieurs façons de construire des agents d'intelligence artificielle, et le meilleur choix dépend généralement du degré de contrôle que vous souhaitez exercer sur le système.</p>
<p><strong>DeepAgents</strong> est conçu pour construire des agents autonomes qui gèrent des tâches à long terme et à plusieurs étapes. Il donne aux développeurs un contrôle total sur la façon dont l'agent planifie les tâches, utilise les outils et gère la mémoire. Parce qu'il est construit sur LangGraph, vous pouvez personnaliser les composants, intégrer des outils Python et modifier le backend de stockage. DeepAgents convient donc parfaitement aux flux de travail complexes et aux systèmes de production pour lesquels la fiabilité et la flexibilité sont importantes.</p>
<p><strong>Agent Builder</strong>, en revanche, met l'accent sur la facilité d'utilisation. Il masque la plupart des détails techniques, de sorte que vous pouvez décrire un agent, ajouter des outils et l'exécuter rapidement. La mémoire, l'utilisation des outils et les étapes d'approbation humaine sont gérées automatiquement. Agent Builder est donc utile pour les prototypes rapides, les outils internes ou les premières expériences.</p>
<p><strong>Agent Builder et DeepAgents ne sont pas des systèmes distincts, ils font partie de la même pile.</strong> Agent Builder est construit au-dessus de DeepAgents. De nombreuses équipes commencent par utiliser Agent Builder pour tester des idées, puis passent à DeepAgents lorsqu'elles ont besoin de plus de contrôle. Les flux de travail créés avec DeepAgents peuvent également être transformés en modèles Agent Builder afin que d'autres puissent les réutiliser facilement.</p>
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
    </button></h2><p>Deep Agents facilite la gestion des flux de travail complexes des agents en utilisant trois idées principales : la planification des tâches, le stockage des fichiers et la délégation des sous-agents. Ces mécanismes transforment les processus désordonnés et multi-étapes en flux de travail structurés. Combiné à Milvus pour la recherche vectorielle, l'agent peut également conserver une mémoire à long terme entre les sessions.</p>
<p>Pour les développeurs, cela signifie des coûts de jetons moins élevés et un système plus fiable qui peut passer d'une simple démo à un environnement de production.</p>
<p>Si vous créez des agents d'IA qui ont besoin de flux de travail structurés et d'une véritable mémoire à long terme, nous serions ravis d'entrer en contact avec vous.</p>
<p>Vous avez des questions sur les agents profonds ou sur l'utilisation de Milvus comme backend de mémoire persistante ? Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes pour discuter de votre cas d'utilisation.</p>
