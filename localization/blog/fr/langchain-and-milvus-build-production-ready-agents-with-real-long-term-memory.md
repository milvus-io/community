---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 et Milvus : comment créer des agents prêts pour la production
  avec une véritable mémoire à long terme
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Découvrez comment LangChain 1.0 simplifie l'architecture des agents et comment
  Milvus ajoute une mémoire à long terme pour des applications d'IA évolutives
  et prêtes à la production.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain est un cadre populaire à code source ouvert pour le développement d'applications alimentées par de grands modèles de langage (LLM). Il fournit une boîte à outils modulaire pour construire des agents de raisonnement et d'utilisation d'outils, connecter des modèles à des données externes et gérer des flux d'interaction.</p>
<p>Avec la sortie de <strong>LangChain 1.0</strong>, le cadre fait un pas en avant vers une architecture plus conviviale pour la production. La nouvelle version remplace la conception antérieure basée sur la chaîne par une boucle ReAct normalisée (Raisonner → Appel d'outil → Observer → Décider) et introduit un intergiciel pour gérer l'exécution, le contrôle et la sécurité.</p>
<p>Cependant, le raisonnement seul n'est pas suffisant. Les agents doivent également pouvoir stocker, rappeler et réutiliser des informations. C'est là que <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielle open-source, peut jouer un rôle essentiel. Milvus fournit une couche de mémoire évolutive et performante qui permet aux agents de stocker, de rechercher et d'extraire des informations de manière efficace par le biais de la similarité sémantique.</p>
<p>Dans ce billet, nous verrons comment LangChain 1.0 met à jour l'architecture des agents et comment l'intégration de Milvus permet aux agents d'aller au-delà du raisonnement - en créant une mémoire persistante et intelligente pour des cas d'utilisation réels.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Pourquoi la conception basée sur la chaîne n'est pas à la hauteur<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>À ses débuts (version 0.x), l'architecture de LangChain était centrée sur les chaînes. Chaque chaîne définissait une séquence fixe et était livrée avec des modèles préconstruits qui rendaient l'orchestration LLM simple et rapide. Cette conception était idéale pour construire rapidement des prototypes. Mais au fur et à mesure que l'écosystème LLM évoluait et que les cas d'utilisation du monde réel devenaient plus complexes, des fissures dans cette architecture ont commencé à apparaître.</p>
<p><strong>1. Manque de flexibilité</strong></p>
<p>Les premières versions de LangChain fournissaient des pipelines modulaires tels que SimpleSequentialChain ou LLMChain, chacun suivant un flux fixe et linéaire - création d'un message → appel de modèle → traitement de sortie. Cette conception a bien fonctionné pour les tâches simples et prévisibles et a permis de créer rapidement des prototypes.</p>
<p>Toutefois, à mesure que les applications devenaient plus dynamiques, ces modèles rigides commençaient à sembler restrictifs. Lorsque la logique métier ne s'inscrit plus dans une séquence prédéfinie, deux options peu satisfaisantes s'offrent à vous : forcer votre logique à se conformer au cadre ou le contourner entièrement en appelant directement l'API LLM.</p>
<p><strong>2. Absence de contrôle au niveau de la production</strong></p>
<p>Ce qui fonctionnait bien dans les démonstrations se cassait souvent en production. Les chaînes n'incluaient pas les garanties nécessaires pour les applications à grande échelle, persistantes ou sensibles. Les problèmes les plus fréquents sont les suivants</p>
<ul>
<li><p><strong>Débordement de contexte :</strong> Les longues conversations pouvaient dépasser les limites de jetons, provoquant des pannes ou une troncature silencieuse.</p></li>
<li><p><strong>Fuites de données sensibles :</strong> Des informations personnelles identifiables (comme des courriels ou des identifiants) peuvent être envoyées par inadvertance à des modèles tiers.</p></li>
<li><p><strong>Opérations non supervisées :</strong> Les agents peuvent supprimer des données ou envoyer des courriels sans l'approbation d'un humain.</p></li>
</ul>
<p><strong>3. Manque de compatibilité entre les modèles</strong></p>
<p>Chaque fournisseur de LLM - OpenAI, Anthropic et de nombreux modèles chinois - met en œuvre ses propres protocoles de raisonnement et d'appel d'outils. Chaque fois que vous changiez de fournisseur, vous deviez réécrire la couche d'intégration : modèles d'invite, adaptateurs et analyseurs de réponse. Ce travail répétitif ralentissait le développement et rendait l'expérimentation pénible.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0 : Un agent ReAct tout-en-un<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'équipe LangChain a analysé des centaines d'implémentations d'agents de niveau production, une constatation s'est imposée : presque tous les agents performants convergeaient naturellement vers le <strong>modèle ReAct ("Reasoning + Acting")</strong>.</p>
<p>Qu'il s'agisse d'un système multi-agents ou d'un agent unique effectuant un raisonnement approfondi, la même boucle de contrôle apparaît : alternance entre de brèves étapes de raisonnement et des appels d'outils ciblés, puis intégration des observations résultantes dans les décisions ultérieures jusqu'à ce que l'agent soit en mesure de fournir une réponse finale.</p>
<p>Pour s'appuyer sur cette structure éprouvée, LangChain 1.0 place la boucle ReAct au cœur de son architecture, ce qui en fait la structure par défaut pour construire des agents fiables, interprétables et prêts pour la production.</p>
<p>Pour prendre en charge tous les types d'agents, des plus simples aux plus complexes, LangChain 1.0 adopte une conception en couches qui allie facilité d'utilisation et contrôle précis :</p>
<ul>
<li><p><strong>Scénarios standard :</strong> Commencez par la fonction create_agent() - une boucle ReAct propre et standardisée qui gère le raisonnement et les appels d'outils dès le départ.</p></li>
<li><p><strong>Scénarios étendus :</strong> Ajoutez un intergiciel pour obtenir un contrôle plus fin. Les intergiciels vous permettent d'inspecter ou de modifier ce qui se passe à l'intérieur de l'agent - par exemple, en ajoutant la détection des IPI, des points de contrôle d'approbation humaine, des tentatives automatiques ou des crochets de surveillance.</p></li>
<li><p><strong>Scénarios complexes :</strong> Pour les flux de travail avec état ou l'orchestration multi-agents, utilisez LangGraph, un moteur d'exécution basé sur un graphe qui permet un contrôle précis du flux logique, des dépendances et des états d'exécution.</p></li>
</ul>
<p>Décortiquons maintenant les trois composants clés qui rendent le développement d'agents plus simple, plus sûr et plus cohérent d'un modèle à l'autre.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. La fonction create_agent() : Une manière plus simple de construire des agents</h3><p>L'une des principales avancées de LangChain 1.0 est la réduction de la complexité de la construction d'agents à une seule fonction - create_agent(). Vous n'avez plus besoin de gérer manuellement la gestion de l'état, la gestion des erreurs ou les sorties en continu. Ces fonctionnalités de niveau production sont désormais gérées automatiquement par le runtime LangGraph sous-jacent.</p>
<p>Avec seulement trois paramètres, vous pouvez lancer un agent entièrement fonctionnel :</p>
<ul>
<li><p><strong>modèle</strong> - soit un identifiant de modèle (chaîne de caractères), soit un objet de modèle instancié.</p></li>
<li><p><strong>tools</strong> - une liste de fonctions qui donnent à l'agent ses capacités.</p></li>
<li><p><strong>system_prompt</strong> - l'instruction qui définit le rôle, le ton et le comportement de l'agent.</p></li>
</ul>
<p>Sous le capot, create_agent() s'exécute sur la boucle standard d'un agent - appelant un modèle, le laissant choisir les outils à exécuter, et terminant une fois que plus aucun outil n'est nécessaire :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il hérite également des capacités intégrées de LangGraph pour la persistance de l'état, la récupération des interruptions et le streaming. Les tâches qui nécessitaient auparavant des centaines de lignes de code d'orchestration sont désormais gérées par une API unique et déclarative.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. L'intergiciel : Une couche composable pour un contrôle prêt à la production</h3><p>L'intergiciel est la passerelle essentielle qui permet à LangChain de passer du prototype à la production. Il expose des crochets à des points stratégiques de la boucle d'exécution de l'agent, ce qui vous permet d'ajouter une logique personnalisée sans réécrire le processus central de ReAct.</p>
<p>La boucle principale d'un agent suit un processus de décision en trois étapes - Modèle → Outil → Terminaison :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 fournit quelques <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">middlewares préconstruits</a> pour des modèles courants. En voici quatre exemples.</p>
<ul>
<li><strong>Détection des informations confidentielles : Toute application traitant des données sensibles de l'utilisateur</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Résumé : Résumer automatiquement l'historique des conversations lorsque la limite des jetons est atteinte.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Réessai d'outil : Réessayer automatiquement les appels d'outils qui n'ont pas abouti avec un délai exponentiel configurable.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Middleware personnalisé</strong></li>
</ul>
<p>En plus des options officielles d'intergiciels préconstruits, vous pouvez également créer des intergiciels personnalisés en utilisant des décorateurs ou des classes.</p>
<p>Par exemple, l'extrait ci-dessous montre comment enregistrer les appels de modèle avant l'exécution :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Sortie structurée : Une manière standardisée de traiter les données</h3><p>Dans le développement traditionnel d'agents, la sortie structurée a toujours été difficile à gérer. Chaque fournisseur de modèle le gère différemment - par exemple, OpenAI offre une API de sortie structurée native, tandis que d'autres ne prennent en charge les réponses structurées qu'indirectement par le biais d'appels d'outils. Cela signifiait souvent qu'il fallait écrire des adaptateurs personnalisés pour chaque fournisseur, ce qui ajoutait du travail supplémentaire et rendait la maintenance plus pénible qu'elle ne devrait l'être.</p>
<p>Dans LangChain 1.0, la sortie structurée est gérée directement par le paramètre response_format de la fonction create_agent().  Vous n'avez besoin de définir votre schéma de données qu'une seule fois. LangChain choisit automatiquement la meilleure stratégie d'application en fonction du modèle que vous utilisez - aucune configuration supplémentaire ou code spécifique au fournisseur n'est nécessaire.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain prend en charge deux stratégies pour les sorties structurées :</p>
<p><strong>1. Stratégie du fournisseur :</strong> Certains fournisseurs de modèles prennent nativement en charge la sortie structurée via leurs API (par exemple OpenAI et Grok). Lorsqu'un tel support est disponible, LangChain utilise directement l'application du schéma intégré du fournisseur. Cette approche offre le plus haut niveau de fiabilité et de cohérence, puisque le modèle lui-même garantit le format de sortie.</p>
<p><strong>2. Stratégie d'appel d'outils :</strong> Pour les modèles qui ne supportent pas les sorties structurées natives, LangChain utilise le Tool Calling pour obtenir le même résultat.</p>
<p>Vous n'avez pas à vous soucier de la stratégie utilisée : le cadre détecte les capacités du modèle et s'adapte automatiquement. Cette abstraction vous permet de passer librement d'un fournisseur de modèle à l'autre sans modifier votre logique métier.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Comment Milvus améliore la mémoire des agents<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les agents de niveau production, le véritable goulot d'étranglement des performances n'est souvent pas le moteur de raisonnement, mais le système de mémoire. Dans LangChain 1.0, les bases de données vectorielles jouent le rôle de mémoire externe de l'agent et permettent une mémorisation à long terme grâce à la récupération sémantique.</p>
<p><a href="https://milvus.io/">Milvus</a> est l'une des bases de données vectorielles open-source les plus matures disponibles aujourd'hui, conçue pour la recherche vectorielle à grande échelle dans les applications d'intelligence artificielle. Elle s'intègre nativement à LangChain, de sorte que vous n'avez pas à gérer manuellement la vectorisation, la gestion de l'index ou la recherche de similarité. Le package langchain_milvus intègre Milvus comme une interface VectorStore standard, vous permettant de le connecter à vos agents avec seulement quelques lignes de code.</p>
<p>Ce faisant, Milvus relève trois défis majeurs dans la construction de systèmes de mémoire d'agents évolutifs et fiables :</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Extraction rapide de bases de connaissances massives</strong></h4><p>Lorsqu'un agent doit traiter des milliers de documents, de conversations passées ou de manuels de produits, une simple recherche par mot-clé ne suffit pas. Milvus utilise la recherche par similarité vectorielle pour trouver des informations sémantiquement pertinentes en quelques millisecondes, même si la requête est formulée différemment. Cela permet à votre agent de rappeler des connaissances basées sur le sens, et pas seulement sur des correspondances de texte exactes.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Mémoire à long terme persistante</strong></h4><p>Le SummarizationMiddleware de LangChain peut condenser l'historique des conversations lorsqu'il devient trop long, mais qu'advient-il de tous les détails qui sont résumés ? Milvus les conserve. Chaque conversation, appel d'outil et étape de raisonnement peut être vectorisé et stocké pour une référence à long terme. En cas de besoin, l'agent peut rapidement retrouver les souvenirs pertinents par le biais d'une recherche sémantique, ce qui permet une véritable continuité d'une session à l'autre.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Gestion unifiée du contenu multimodal</strong></h4><p>Les agents modernes traitent plus que du texte - ils interagissent avec des images, du son et de la vidéo. Milvus prend en charge le stockage multi-vecteur et le schéma dynamique, ce qui vous permet de gérer les incorporations de plusieurs modalités dans un système unique. Il s'agit d'une base de mémoire unifiée pour les agents multimodaux, qui permet une récupération cohérente de différents types de données.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph : Comment choisir celui qui convient à vos agents<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>La mise à jour vers LangChain 1.0 est une étape essentielle vers la création d'agents de niveau production - mais cela ne signifie pas que c'est toujours le seul ou le meilleur choix pour tous les cas d'utilisation. Le choix du bon framework détermine la rapidité avec laquelle vous pouvez combiner ces capacités dans un système fonctionnel et maintenable.</p>
<p>En fait, LangChain 1.0 et LangGraph 1.0 peuvent être considérés comme des éléments d'une même pile, conçus pour fonctionner ensemble plutôt que pour se remplacer l'un l'autre : LangChain vous aide à construire rapidement des agents standard, tandis que LangGraph vous permet de contrôler finement des flux de travail complexes. En d'autres termes, LangChain vous aide à aller vite, tandis que LangGraph vous aide à aller en profondeur.</p>
<p>Voici une comparaison rapide de leurs différences de positionnement technique :</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Niveau d'abstraction</strong></td><td>Abstraction de haut niveau, conçue pour les scénarios d'agents standards</td><td>Cadre d'orchestration de bas niveau, conçu pour les flux de travail complexes</td></tr>
<tr><td><strong>Capacité de base</strong></td><td>Boucle ReAct standard (Raison → Appel d'outil → Observation → Réponse)</td><td>Machines à états personnalisées et logique de branchement complexe (StateGraph + routage conditionnel)</td></tr>
<tr><td><strong>Mécanisme d'extension</strong></td><td>Logiciel intermédiaire pour les capacités de production</td><td>Gestion manuelle des nœuds, des arêtes et des transitions d'état</td></tr>
<tr><td><strong>Mise en œuvre sous-jacente</strong></td><td>Gestion manuelle des nœuds, des arêtes et des transitions d'état</td><td>Exécution native avec persistance et récupération intégrées</td></tr>
<tr><td><strong>Cas d'utilisation typiques</strong></td><td>80 % des scénarios d'agents standard</td><td>Collaboration multi-agents et orchestration de flux de travail à long terme</td></tr>
<tr><td><strong>Courbe d'apprentissage</strong></td><td>Construire un agent en ~10 lignes de code</td><td>Nécessite une compréhension des graphes d'état et de l'orchestration des nœuds</td></tr>
</tbody>
</table>
<p>Si vous êtes novice en matière de construction d'agents ou si vous souhaitez lancer un projet rapidement, commencez par LangChain. Si vous savez déjà que votre cas d'utilisation nécessite une orchestration complexe, une collaboration multi-agent ou des workflows de longue durée, passez directement à LangGraph.</p>
<p>Les deux frameworks peuvent coexister dans le même projet - vous pouvez commencer simplement avec LangChain et intégrer LangGraph lorsque votre système a besoin de plus de contrôle et de flexibilité. L'essentiel est de choisir le bon outil pour chaque partie de votre flux de travail.</p>
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
    </button></h2><p>Il y a trois ans, LangChain a commencé comme une enveloppe légère pour appeler les LLM. Aujourd'hui, il s'est transformé en un framework complet de niveau production.</p>
<p>Au cœur du système, des couches intermédiaires assurent la sécurité, la conformité et l'observabilité. LangGraph ajoute l'exécution persistante, le flux de contrôle et la gestion d'état. Enfin, au niveau de la mémoire, <a href="https://milvus.io/">Milvus</a> comble une lacune essentielle en fournissant une mémoire à long terme évolutive et fiable qui permet aux agents de retrouver le contexte, de raisonner sur l'historique et de s'améliorer au fil du temps.</p>
<p>Ensemble, LangChain, LangGraph et Milvus forment une chaîne d'outils pratique pour l'ère des agents modernes, permettant un prototypage rapide et un déploiement à l'échelle de l'entreprise, sans sacrifier la fiabilité ou les performances.</p>
<p>🚀 Prêt à doter votre agent d'une mémoire fiable et à long terme ? Découvrez <a href="https://milvus.io">Milvus</a> et voyez comment il alimente une mémoire à long terme intelligente pour les agents LangChain en production.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou déposez des questions sur <a href="https://github.com/milvus-io/milvus">GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
