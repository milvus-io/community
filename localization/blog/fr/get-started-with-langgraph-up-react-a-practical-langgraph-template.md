---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Démarrer avec langgraph-up-react : Un modèle pratique de LangGraph'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  présentation de langgraph-up-react, un modèle LangGraph + ReAct prêt à
  l'emploi pour les agents ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>Les agents d'IA sont en train de devenir un modèle central dans l'IA appliquée. De plus en plus de projets dépassent les simples messages-guides et intègrent des modèles dans des boucles de prise de décision. C'est passionnant, mais cela implique aussi de gérer l'état, de coordonner les outils, de gérer les branches et d'ajouter des transferts humains - des choses qui ne sont pas immédiatement évidentes.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> est un choix judicieux pour cette couche. Il s'agit d'un cadre d'IA qui fournit des boucles, des conditionnelles, de la persistance, des contrôles humains dans la boucle et du streaming - une structure suffisante pour transformer une idée en une véritable application multi-agents. Cependant, LangGraph a une courbe d'apprentissage abrupte. Sa documentation est rapide, il faut du temps pour s'habituer aux abstractions, et passer d'une simple démo à quelque chose qui ressemble à un produit peut être frustrant.</p>
<p>Récemment, j'ai commencé à utiliser <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react, un</strong></a>modèle LangGraph + ReAct prêt à l'emploi pour les agents ReAct. Il réduit la configuration, est livré avec des valeurs par défaut saines, et vous permet de vous concentrer sur le comportement plutôt que sur le modèle. Dans ce billet, je vais vous expliquer comment démarrer avec LangGraph en utilisant ce modèle.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Comprendre les agents ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans le modèle lui-même, il est utile d'examiner le type d'agent que nous allons construire. L'un des modèles les plus courants aujourd'hui est le cadre <strong>ReAct (Reason + Act)</strong>, présenté pour la première fois dans le document de 2022 de Google <em>intitulé "</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct : Synergizing Reasoning and Acting in Language Models</em></a><em>".</em></p>
<p>L'idée est simple : au lieu de traiter le raisonnement et l'action séparément, ReAct les combine dans une boucle de rétroaction qui ressemble beaucoup à la résolution de problèmes par l'homme. L'agent <strong>raisonne</strong> sur le problème, <strong>agit</strong> en appelant un outil ou une API, puis <strong>observe le</strong> résultat avant de décider de la suite. Ce cycle simple - raisonner → agir → observer - permet aux agents de s'adapter dynamiquement au lieu de suivre un script fixe.</p>
<p>Voici comment les pièces s'imbriquent les unes dans les autres :</p>
<ul>
<li><p><strong>Raison</strong>: Le modèle décompose les problèmes en étapes, planifie des stratégies et peut même corriger les erreurs à mi-chemin.</p></li>
<li><p><strong>Agir</strong>: Sur la base de son raisonnement, l'agent fait appel à des outils, qu'il s'agisse d'un moteur de recherche, d'une calculatrice ou de votre propre API personnalisée.</p></li>
<li><p><strong>Observer</strong>: L'agent examine les résultats de l'outil, les filtre et les réintègre dans son raisonnement suivant.</p></li>
</ul>
<p>Cette boucle est rapidement devenue l'épine dorsale des agents d'IA modernes. Vous en trouverez des traces dans les plugins ChatGPT, les pipelines RAG, les assistants intelligents et même la robotique. Dans notre cas, c'est la base sur laquelle le modèle <code translate="no">langgraph-up-react</code> s'appuie.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Comprendre LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons examiné le modèle ReAct, la question suivante est : comment mettre en œuvre un tel modèle dans la pratique ? La plupart des modèles de langage ne gèrent pas très bien le raisonnement en plusieurs étapes. Chaque appel est sans état : le modèle génère une réponse et oublie tout dès qu'il a terminé. Il est donc difficile de reporter les résultats intermédiaires ou d'ajuster les étapes ultérieures en fonction des premières.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> comble cette lacune. Au lieu de traiter chaque demande comme un événement unique, il permet de décomposer les tâches complexes en étapes, de se souvenir de ce qui s'est passé à chaque étape et de décider de la suite en fonction de l'état actuel. En d'autres termes, elle transforme le processus de raisonnement d'un agent en quelque chose de structuré et de répétable, plutôt qu'en une chaîne d'invites ad hoc.</p>
<p>Il s'agit en quelque sorte d'un <strong>organigramme du raisonnement de l'IA</strong>:</p>
<ul>
<li><p><strong>Analyse de</strong> la requête de l'utilisateur</p></li>
<li><p><strong>Sélectionner</strong> l'outil adéquat pour la tâche</p></li>
<li><p><strong>Exécuter la</strong> tâche en appelant l'outil</p></li>
<li><p><strong>Traiter les</strong> résultats</p></li>
<li><p><strong>Vérifier</strong> si la tâche est terminée ; si ce n'est pas le cas, revenir en arrière et poursuivre le raisonnement</p></li>
<li><p><strong>Produire</strong> la réponse finale</p></li>
</ul>
<p>En cours de route, LangGraph gère le <strong>stockage de la mémoire</strong> afin que les résultats des étapes précédentes ne soient pas perdus, et il s'intègre à une <strong>bibliothèque d'outils externes</strong> (API, bases de données, recherche, calculatrices, systèmes de fichiers, etc.)</p>
<p>C'est pourquoi il s'appelle <em>LangGraph</em>: <strong>Lang (langue) + Graph - un</strong>cadre permettant d'organiser la façon dont les modèles de langue pensent et agissent au fil du temps.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Comprendre langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph est puissant, mais il s'accompagne de frais généraux. La mise en place de la gestion des états, la conception des nœuds et des arêtes, la gestion des erreurs et le câblage des modèles et des outils sont autant de tâches qui prennent du temps. Le débogage des flux à plusieurs étapes peut également s'avérer pénible : lorsque quelque chose ne fonctionne pas, le problème peut se situer au niveau de n'importe quel nœud ou de n'importe quelle transition. Au fur et à mesure que les projets se développent, les moindres changements peuvent se répercuter sur la base de code et tout ralentir.</p>
<p>C'est là qu'un modèle mature fait une énorme différence. Au lieu de partir de zéro, un modèle vous offre une structure éprouvée, des outils préconstruits et des scripts qui fonctionnent parfaitement. Vous n'avez pas à vous préoccuper de la paperasse et vous vous concentrez directement sur la logique de l'agent.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> est l'un de ces modèles. Il est conçu pour vous aider à créer rapidement un agent LangGraph ReAct, avec :</p>
<ul>
<li><p>🔧 <strong>Un écosystème d'outils intégrés</strong>: adaptateurs et utilitaires prêts à l'emploi.</p></li>
<li><p>⚡ <strong>Démarrage rapide</strong>: configuration simple et agent fonctionnel en quelques minutes</p></li>
<li><p>🧪 <strong>Tests inclus</strong>: tests unitaires et tests d'intégration pour plus de confiance lors de l'extension</p></li>
<li><p>📦 <strong>Configuration prête pour la production</strong>: modèles d'architecture et scripts qui permettent de gagner du temps lors du déploiement.</p></li>
</ul>
<p>En bref, il s'occupe de la paperasse pour que vous puissiez vous concentrer sur la construction d'agents qui résolvent réellement vos problèmes d'entreprise.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Démarrer avec le modèle langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Faire fonctionner le modèle est simple. Voici le processus d'installation étape par étape :</p>
<ol>
<li>Installer les dépendances de l'environnement</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Cloner le projet</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Installer les dépendances</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Configurer l'environnement</li>
</ol>
<p>Copiez l'exemple de configuration et ajoutez vos clés :</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Editez .env et définissez au moins un fournisseur de modèle ainsi que votre clé d'API Tavily :</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Démarrer le projet</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Votre serveur de développement est maintenant en place et prêt à être testé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">Que pouvez-vous construire avec langgraph-up-react ?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Que pouvez-vous faire une fois que le modèle est opérationnel ? Voici deux exemples concrets qui montrent comment il peut être appliqué dans des projets réels.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Base de connaissances d'entreprise Q&amp;A (Agentic RAG)</h3><p>Un cas d'utilisation courant est un assistant Q&amp;A interne pour les connaissances de l'entreprise. Pensez aux manuels de produits, aux documents techniques, aux FAQ - des informations utiles mais dispersées. Avec <code translate="no">langgraph-up-react</code>, vous pouvez créer un agent qui indexe ces documents dans une base de données vectorielle <a href="https://milvus.io/"><strong>Milvus</strong></a>, récupère les passages les plus pertinents et génère des réponses précises fondées sur le contexte.</p>
<p>Pour le déploiement, Milvus propose des options flexibles : <strong>Lite</strong> pour un prototypage rapide, <strong>Standalone</strong> pour des charges de travail de production de taille moyenne et <strong>Distributed</strong> pour des systèmes à l'échelle de l'entreprise. Vous devrez également régler les paramètres de l'index (par exemple, HNSW) pour équilibrer la vitesse et la précision, et mettre en place une surveillance de la latence et du rappel pour garantir la fiabilité du système en cas de charge.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Collaboration multi-agents</h3><p>La collaboration multi-agents est un autre cas d'utilisation puissant. Au lieu qu'un agent essaie de tout faire, vous définissez plusieurs agents spécialisés qui travaillent ensemble. Dans un flux de travail de développement logiciel, par exemple, un agent chef de produit décompose les exigences, un agent architecte rédige la conception, un agent développeur écrit le code et un agent testeur valide les résultats.</p>
<p>Cette orchestration met en évidence les points forts de LangGraph : gestion des états, ramifications et coordination entre les agents. Nous couvrirons cette configuration plus en détail dans un prochain article, mais le point clé est que <code translate="no">langgraph-up-react</code> permet d'essayer ces modèles sans passer des semaines sur l'échafaudage.</p>
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
    </button></h2><p>Construire des agents fiables n'est pas seulement une question de messages intelligents - il s'agit de structurer le raisonnement, de gérer l'état, et de connecter le tout dans un système que vous pouvez réellement maintenir. LangGraph vous donne le cadre pour le faire, et <code translate="no">langgraph-up-react</code> abaisse la barrière en s'occupant de l'habillage pour que vous puissiez vous concentrer sur le comportement de l'agent.</p>
<p>Avec ce modèle, vous pouvez lancer des projets tels que des systèmes de base de connaissances Q&amp;A ou des flux de travail multi-agents sans vous perdre dans la configuration. C'est un point de départ qui permet de gagner du temps, d'éviter les pièges les plus courants et de rendre l'expérimentation avec LangGraph beaucoup plus fluide.</p>
<p>Dans le prochain billet, j'irai plus loin dans un tutoriel pratique, montrant étape par étape comment étendre le modèle et construire un agent fonctionnel pour un cas d'utilisation réel en utilisant LangGraph, <code translate="no">langgraph-up-react</code>, et la base de données vectorielle Milvus. Restez à l'écoute.</p>
