---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: >-
  Comment construire des systèmes multi-agents prêts pour la production avec
  Agno et Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Apprenez à construire, déployer et mettre à l'échelle des systèmes
  multi-agents prêts à la production en utilisant Agno, AgentOS et Milvus pour
  des charges de travail réelles.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Si vous avez construit des agents d'intelligence artificielle, vous vous êtes probablement heurté à ce mur : votre démo fonctionne très bien, mais la mise en production est une toute autre histoire.</p>
<p>Nous avons abordé la gestion de la mémoire des agents et le reranking dans des articles précédents. Abordons maintenant le défi le plus important : construire des agents qui tiennent la route en production.</p>
<p>La réalité est là : les environnements de production sont désordonnés. Un seul agent suffit rarement, c'est pourquoi les systèmes multi-agents sont omniprésents. Mais les frameworks disponibles aujourd'hui ont tendance à se diviser en deux camps : les plus légers qui font une bonne démonstration mais qui se cassent la figure sous une charge réelle, ou les plus puissants qui prennent une éternité à apprendre et à construire avec.</p>
<p>J'ai expérimenté <a href="https://github.com/agno-agi/agno">Agno</a> récemment, et il semble trouver un juste milieu - axé sur l'aptitude à la production sans complexité excessive. Le projet a gagné plus de 37 000 étoiles GitHub en quelques mois, ce qui suggère que d'autres développeurs le trouvent également utile.</p>
<p>Dans ce billet, je vais partager ce que j'ai appris en construisant un système multi-agent utilisant Agno avec <a href="https://milvus.io/">Milvus</a> comme couche mémoire. Nous verrons comment Agno se compare à des alternatives telles que LangGraph et nous passerons en revue une implémentation complète que vous pouvez essayer vous-même.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Qu'est-ce qu'Agno ?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> est un cadre multi-agents conçu spécifiquement pour une utilisation en production. Il comporte deux couches distinctes :</p>
<ul>
<li><p><strong>La couche du cadre Agno</strong>: Vous y définissez la logique de vos agents.</p></li>
<li><p><strong>Couche d'exécution AgentOS</strong>: Transforme cette logique en services HTTP que vous pouvez réellement déployer.</p></li>
</ul>
<p>Pensez-y de la manière suivante : la couche cadre définit <em>ce que</em> vos agents doivent faire, tandis qu'AgentOS s'occupe de la <em>manière dont</em> ce travail est exécuté et servi.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">La couche cadre</h3><p>C'est ce avec quoi vous travaillez directement. Elle introduit trois concepts fondamentaux :</p>
<ul>
<li><p><strong>Agent</strong>: gère un type de tâche spécifique</p></li>
<li><p><strong>L'équipe</strong>: Coordination de plusieurs agents pour résoudre des problèmes complexes</p></li>
<li><p>Le<strong>flux de travail</strong>: Définit l'ordre et la structure d'exécution</p></li>
</ul>
<p>Une chose que j'ai appréciée : vous n'avez pas besoin d'apprendre un nouveau DSL ou de dessiner des organigrammes. Le comportement de l'agent est défini à l'aide d'appels de fonctions Python standard. Le cadre gère l'invocation du LLM, l'exécution des outils et la gestion de la mémoire.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">La couche d'exécution AgentOS</h3><p>AgentOS est conçu pour répondre à des volumes élevés de requêtes grâce à une exécution asynchrone, et son architecture sans état permet une mise à l'échelle simple.</p>
<p>Ses principales caractéristiques sont les suivantes</p>
<ul>
<li><p>Intégration FastAPI pour l'exposition d'agents en tant que points d'extrémité HTTP</p></li>
<li><p>Gestion de session et réponses en continu</p></li>
<li><p>Points d'extrémité de surveillance</p></li>
<li><p>Prise en charge de la mise à l'échelle horizontale</p></li>
</ul>
<p>En pratique, AgentOS prend en charge la plupart des tâches d'infrastructure, ce qui vous permet de vous concentrer sur la logique de l'agent lui-même.</p>
<p>Une vue de haut niveau de l'architecture d'Agno est présentée ci-dessous.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs. LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour comprendre la place d'Agno, comparons-le à LangGraph, l'un des frameworks multi-agents les plus utilisés.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> utilise une machine à états basée sur un graphe. Vous modélisez l'ensemble du flux de travail de votre agent sous la forme d'un graphe : les étapes sont des nœuds, les chemins d'exécution sont des arêtes. Cela fonctionne bien lorsque votre processus est fixe et strictement ordonné. Mais pour les scénarios ouverts ou conversationnels, cela peut sembler restrictif. Au fur et à mesure que les interactions deviennent plus dynamiques, il devient de plus en plus difficile de maintenir un graphe propre.</p>
<p><strong>Agno</strong> adopte une approche différente. Au lieu d'être une couche d'orchestration pure, c'est un système de bout en bout. Définissez le comportement de votre agent et AgentOS l'expose automatiquement sous la forme d'un service HTTP prêt à la production, avec la surveillance, l'évolutivité et la prise en charge des conversations multi-tours intégrées. Pas de passerelle API séparée, pas de gestion de session personnalisée, pas d'outil opérationnel supplémentaire.</p>
<p>Voici une comparaison rapide :</p>
<table>
<thead>
<tr><th>Dimension</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Modèle d'orchestration</td><td>Définition explicite du graphe à l'aide de nœuds et d'arêtes</td><td>Workflows déclaratifs définis en Python</td></tr>
<tr><td>Gestion des états</td><td>Classes d'état personnalisées définies et gérées par les développeurs</td><td>Système de mémoire intégré</td></tr>
<tr><td>Débogage et observabilité</td><td>LangSmith (payant)</td><td>AgentOS UI (open source)</td></tr>
<tr><td>Modèle d'exécution</td><td>Intégré dans un runtime existant</td><td>Service autonome basé sur FastAPI</td></tr>
<tr><td>Complexité du déploiement</td><td>Nécessite une configuration supplémentaire via LangServe</td><td>Fonctionne dès le départ</td></tr>
</tbody>
</table>
<p>LangGraph vous offre plus de flexibilité et un contrôle plus fin. Agno optimise le temps de mise en production. Le bon choix dépend de l'état d'avancement de votre projet, de l'infrastructure existante et du niveau de personnalisation dont vous avez besoin. Si vous n'êtes pas sûr, l'exécution d'une petite démonstration de faisabilité avec les deux solutions est probablement le moyen le plus fiable de prendre une décision.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Choisir Milvus pour la couche mémoire de l'agent<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que vous avez choisi un cadre, la prochaine décision est de savoir comment stocker la mémoire et les connaissances. Nous utilisons Milvus pour cela. <a href="https://milvus.io/">Milvus</a> est la base de données vectorielle open-source la plus populaire, conçue pour les charges de travail d'IA, avec plus de <a href="https://github.com/milvus-io/milvus">42 000+</a> étoiles <a href="https://github.com/milvus-io/milvus">GitHub</a>.</p>
<p><strong>Agno prend en charge Milvus en natif.</strong> Le module <code translate="no">agno.vectordb.milvus</code> intègre des fonctionnalités de production telles que la gestion des connexions, les tentatives automatiques, les écritures par lots et la génération d'embedding. Vous n'avez pas besoin de créer des pools de connexions ou de gérer les défaillances du réseau vous-même : quelques lignes de Python vous permettent de disposer d'une couche de mémoire vectorielle fonctionnelle.</p>
<p><strong>Milvus s'adapte à vos besoins.</strong> Il prend en charge trois <a href="https://milvus.io/docs/install-overview.md">modes de déploiement :</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Léger, basé sur des fichiers, idéal pour le développement et les tests locaux.</p></li>
<li><p><strong>Standalone</strong>: Déploiement sur un seul serveur pour les charges de travail de production</p></li>
<li><p><strong>Distribué</strong>: Cluster complet pour les scénarios à grande échelle</p></li>
</ul>
<p>Vous pouvez commencer avec Milvus Lite pour valider la mémoire de votre agent localement, puis passer à une solution autonome ou distribuée à mesure que le trafic augmente, sans modifier le code de votre application. Cette flexibilité est particulièrement utile lorsque vous procédez à des itérations rapides dans les premières phases, mais que vous avez besoin d'une voie claire pour passer à l'échelle par la suite.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Étape par étape : Création d'un agent Agno prêt pour la production avec Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Construisons un agent prêt pour la production en partant de zéro.</p>
<p>Nous commencerons par un exemple simple d'agent unique pour montrer le flux de travail complet. Ensuite, nous l'étendrons à un système multi-agents. AgentOS compilera automatiquement le tout sous la forme d'un service HTTP appelable.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Déploiement de Milvus Standalone avec Docker</h3><p><strong>(1) Télécharger les fichiers de déploiement</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Démarrer le service Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Mise en œuvre du noyau</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Exécution de l'agent</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Connexion à la console AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Créer un compte et se connecter</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Connectez votre agent à AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Configurer le port exposé et le nom de l'agent</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Ajouter des documents et les indexer dans Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Tester l'agent de bout en bout</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans cette configuration, Milvus gère la recherche sémantique à haute performance. Lorsque l'assistant de la base de connaissances reçoit une question technique, il invoque l'outil <code translate="no">search_knowledge</code> pour intégrer la requête, récupère les morceaux de documents les plus pertinents dans Milvus et utilise ces résultats comme base de sa réponse.</p>
<p>Milvus propose trois options de déploiement, ce qui vous permet de choisir une architecture adaptée à vos besoins opérationnels tout en conservant les API au niveau de l'application cohérentes dans tous les modes de déploiement.</p>
<p>La démo ci-dessus montre le flux principal de récupération et de génération. Toutefois, pour intégrer cette conception dans un environnement de production, plusieurs aspects architecturaux doivent être examinés plus en détail.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Comment les résultats de la recherche sont partagés entre les agents<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Le mode Team d'Agno dispose d'une option <code translate="no">share_member_interactions=True</code> qui permet aux agents ultérieurs d'hériter de l'historique complet des interactions des agents précédents. En pratique, cela signifie que lorsque le premier agent récupère des informations dans Milvus, les agents suivants peuvent réutiliser ces résultats au lieu d'effectuer à nouveau la même recherche.</p>
<ul>
<li><p><strong>L'avantage :</strong> Les coûts de recherche sont amortis au sein de l'équipe. Une recherche vectorielle prend en charge plusieurs agents, ce qui réduit les requêtes redondantes.</p></li>
<li><p><strong>L'inconvénient :</strong> La qualité de la recherche est amplifiée. Si la recherche initiale renvoie des résultats incomplets ou inexacts, cette erreur se propage à tous les agents qui en dépendent.</p></li>
</ul>
<p>C'est pourquoi la précision de la recherche est encore plus importante dans les systèmes multi-agents. Une mauvaise recherche ne dégrade pas seulement la réponse d'un agent, elle affecte l'ensemble de l'équipe.</p>
<p>Voici un exemple de configuration d'équipe :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Pourquoi Agno et Milvus sont-ils disposés séparément ?<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cette architecture, <strong>Agno</strong> se situe au niveau de la conversation et de l'orchestration. Il est responsable de la gestion du flux de dialogue, de la coordination des agents et du maintien de l'état de la conversation, l'historique des sessions étant conservé dans une base de données relationnelle. Les connaissances réelles du domaine du système, telles que la documentation sur les produits et les rapports techniques, sont traitées séparément et stockées sous forme d'enchâssements vectoriels dans <strong>Milvus</strong>. Grâce à cette division claire, la logique de conversation et le stockage des connaissances sont totalement découplés.</p>
<p>Pourquoi cela est important d'un point de vue opérationnel :</p>
<ul>
<li><p><strong>Mise à l'échelle indépendante</strong>: Au fur et à mesure que la demande d'Agno augmente, ajoutez des instances Agno supplémentaires. Lorsque le volume des requêtes augmente, il faut étendre Milvus en ajoutant des nœuds de requête. Chaque couche évolue de manière isolée.</p></li>
<li><p><strong>Besoins matériels différents</strong>: Agno est lié à l'unité centrale et à la mémoire (inférence LLM, exécution du flux de travail). Milvus est optimisé pour la recherche vectorielle à haut débit (E/S sur disque, parfois accélération GPU). Leur séparation permet d'éviter les conflits de ressources.</p></li>
<li><p><strong>Optimisation des coûts</strong>: Vous pouvez régler et allouer des ressources pour chaque couche indépendamment.</p></li>
</ul>
<p>Cette approche en couches vous permet d'obtenir une architecture plus efficace, plus résiliente et plus apte à la production.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Éléments à surveiller lors de l'utilisation d'Agno avec Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno dispose de capacités d'évaluation intégrées, mais l'ajout de Milvus élargit les éléments à surveiller. D'après notre expérience, concentrez-vous sur trois domaines :</p>
<ul>
<li><p><strong>Qualité de la récupération</strong>: Les documents renvoyés par Milvus sont-ils réellement pertinents par rapport à la requête, ou simplement superficiellement similaires au niveau du vecteur ?</p></li>
<li><p><strong>Fidélité de la réponse</strong>: La réponse finale est-elle fondée sur le contenu récupéré ou le LLM génère-t-il des affirmations non étayées ?</p></li>
<li><p><strong>Ventilation de la latence de bout en bout</strong>: Ne vous contentez pas de suivre le temps de réponse total. Décomposez-le par étape - génération d'encapsulation, recherche de vecteur, assemblage de contexte, inférence LLM - afin d'identifier les points de ralentissement.</p></li>
</ul>
<p><strong>Un exemple pratique :</strong> Lorsque votre collection Milvus passe de 1 million à 10 millions de vecteurs, vous pouvez remarquer que la latence de récupération augmente. C'est généralement le signe qu'il faut ajuster les paramètres de l'index (comme <code translate="no">nlist</code> et <code translate="no">nprobe</code>) ou envisager de passer d'un déploiement autonome à un déploiement distribué.</p>
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
    </button></h2><p>Construire des systèmes d'agents prêts pour la production ne se limite pas à assembler des appels LLM et des démonstrations d'extraction. Vous avez besoin de limites architecturales claires, d'une infrastructure qui évolue de manière indépendante et d'une observabilité qui vous permette de détecter rapidement les problèmes.</p>
<p>Dans ce billet, j'ai expliqué comment Agno et Milvus peuvent fonctionner ensemble : Agno pour l'orchestration multi-agents, Milvus pour la mémoire évolutive et la récupération sémantique. En gardant ces couches séparées, vous pouvez passer du prototype à la production sans réécrire la logique de base et faire évoluer chaque composant en fonction des besoins.</p>
<p>Si vous expérimentez des configurations similaires, je serais curieux de savoir ce qui fonctionne pour vous.</p>
<p><strong>Des questions sur Milvus ?</strong> Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes.</p>
