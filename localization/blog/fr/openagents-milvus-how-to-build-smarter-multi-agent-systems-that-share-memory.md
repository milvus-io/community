---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus : Comment construire des systèmes multi-agents plus
  intelligents qui partagent la mémoire
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Découvrez comment OpenAgents permet une collaboration multi-agents distribuée,
  pourquoi Milvus est essentiel pour ajouter une mémoire évolutive et comment
  construire un système complet.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>La plupart des développeurs commencent leurs systèmes agentiques avec un seul agent et ne réalisent que plus tard qu'ils ont essentiellement construit un chatbot très coûteux. Pour les tâches simples, un agent de type ReAct fonctionne bien, mais il atteint rapidement ses limites : il ne peut pas exécuter des étapes en parallèle, il perd la trace de longues chaînes de raisonnement et il a tendance à s'effondrer dès que vous ajoutez trop d'outils au mélange. Les configurations multi-agents promettent d'y remédier, mais elles apportent leurs propres problèmes : frais généraux de coordination, transferts fragiles, et un contexte partagé en expansion qui érode discrètement la qualité du modèle.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> est un cadre open-source pour la construction de systèmes multi-agents dans lesquels les agents d'intelligence artificielle travaillent ensemble, partagent des ressources et s'attaquent à des projets à long terme au sein de communautés persistantes. Au lieu d'un orchestrateur central unique, OpenAgents permet aux agents de collaborer de manière plus distribuée : ils peuvent se découvrir les uns les autres, communiquer et se coordonner autour d'objectifs communs.</p>
<p>Associé à la base de données vectorielle <a href="https://milvus.io/">Milvus</a>, ce pipeline bénéficie d'une couche de mémoire à long terme évolutive et très performante. Milvus alimente la mémoire des agents avec une recherche sémantique rapide, des choix d'indexation flexibles comme HNSW et IVF, et une isolation propre grâce au partitionnement, de sorte que les agents peuvent stocker, récupérer et réutiliser les connaissances sans se noyer dans le contexte ou marcher sur les données des autres.</p>
<p>Dans ce billet, nous verrons comment OpenAgents permet une collaboration multi-agents distribuée, pourquoi Milvus est une base essentielle pour une mémoire d'agent évolutive et comment assembler un tel système étape par étape.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Défis dans la construction de systèmes d'agents dans le monde réel<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreux cadres d'agents courants aujourd'hui - LangChain, AutoGen, CrewAI et d'autres - sont construits autour d'un modèle <strong>centré sur les tâches</strong>. Vous créez un ensemble d'agents, vous leur donnez une tâche, vous définissez éventuellement un flux de travail et vous les laissez travailler. Cela fonctionne bien pour les cas d'utilisation étroits ou de courte durée, mais dans les environnements de production réels, cela expose trois limites structurelles :</p>
<ul>
<li><p><strong>Les connaissances restent cloisonnées.</strong> L'expérience d'un agent est limitée à son propre déploiement. Un agent chargé de l'examen du code en ingénierie ne partage pas ce qu'il apprend avec un agent de l'équipe produit qui évalue la faisabilité. Chaque équipe finit par reconstruire les connaissances à partir de zéro, ce qui est à la fois inefficace et fragile.</p></li>
<li><p><strong>La collaboration est rigide.</strong> Même dans les cadres multi-agents, la coopération dépend généralement de flux de travail définis à l'avance. Lorsque la collaboration doit changer, ces règles statiques ne peuvent pas s'adapter, ce qui rend l'ensemble du système moins flexible.</p></li>
<li><p><strong>L'absence d'état persistant.</strong> La plupart des agents suivent un cycle de vie simple : <em>démarrage → exécution → arrêt.</em> Ils oublient tout entre deux exécutions : le contexte, les relations, les décisions prises et l'historique des interactions. Sans état persistant, les agents ne peuvent pas construire une mémoire à long terme ou faire évoluer leur comportement.</p></li>
</ul>
<p>Ces problèmes structurels sont dus au fait que les agents sont traités comme des exécutants de tâches isolées plutôt que comme des participants à un réseau de collaboration plus large.</p>
<p>L'équipe d'OpenAgents pense que les futurs systèmes d'agents ont besoin de plus qu'un raisonnement plus fort - ils ont besoin d'un mécanisme qui permette aux agents de se découvrir les uns les autres, d'établir des relations, de partager des connaissances et de travailler ensemble de manière dynamique. Et surtout, cela ne devrait pas dépendre d'un seul contrôleur central. L'internet fonctionne parce qu'il est distribué : aucun nœud ne dicte tout, et le système devient plus robuste et évolutif au fur et à mesure qu'il se développe. Les systèmes multi-agents bénéficient du même principe de conception. C'est pourquoi OpenAgents supprime l'idée d'un orchestrateur tout-puissant et permet à la place une coopération décentralisée, pilotée par le réseau.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">Qu'est-ce qu'OpenAgents ?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents est un cadre open-source pour la construction de réseaux d'agents d'IA qui permet une collaboration ouverte, où les agents d'IA travaillent ensemble, partagent des ressources et s'attaquent à des projets à long terme. Il fournit l'infrastructure pour un internet des agents - où les agents collaborent ouvertement avec des millions d'autres agents dans des communautés persistantes et croissantes. Sur le plan technique, le système s'articule autour de trois composants principaux : <strong>Le réseau d'agents, les modules de réseau et les transports.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Le réseau d'agents : Un environnement partagé pour la collaboration</h3><p>Un réseau d'agents est un environnement partagé où plusieurs agents peuvent se connecter, communiquer et travailler ensemble pour résoudre des tâches complexes. Ses principales caractéristiques sont les suivantes</p>
<ul>
<li><p><strong>Fonctionnement permanent :</strong> Une fois créé, le réseau reste en ligne indépendamment de toute tâche ou flux de travail.</p></li>
<li><p><strong>Agent dynamique :</strong> Les agents peuvent se joindre à tout moment à l'aide d'un identifiant de réseau ; aucun enregistrement préalable n'est nécessaire.</p></li>
<li><p><strong>Prise en charge multiprotocole :</strong> Une couche d'abstraction unifiée prend en charge les communications via WebSocket, gRPC, HTTP et libp2p.</p></li>
<li><p><strong>Configuration autonome :</strong> Chaque réseau conserve ses propres autorisations, sa propre gouvernance et ses propres ressources.</p></li>
</ul>
<p>Avec une seule ligne de code, vous pouvez créer un réseau, et n'importe quel agent peut le rejoindre immédiatement grâce à des interfaces standard.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Mods de réseau : Extensions enfichables pour la collaboration</h3><p>Les Mods fournissent une couche modulaire de fonctionnalités de collaboration qui restent découplées du système principal. Vous pouvez combiner les modules en fonction de vos besoins spécifiques, ce qui permet de créer des modèles de collaboration adaptés à chaque cas d'utilisation.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Objectif</strong></th><th><strong>Cas d'utilisation</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Messagerie de l'espace de travail</strong></td><td>Communication de messages en temps réel</td><td>Réponses en continu, retour d'information instantané</td></tr>
<tr><td><strong>Forum</strong></td><td>Discussion asynchrone</td><td>Examen des propositions, délibérations à plusieurs tours</td></tr>
<tr><td><strong>Wiki</strong></td><td>Base de connaissances partagée</td><td>Consolidation des connaissances, collaboration documentaire</td></tr>
<tr><td><strong>Social</strong></td><td>Graphique des relations</td><td>Routage d'experts, réseaux de confiance</td></tr>
</tbody>
</table>
<p>Tous les modules fonctionnent sur un système d'événements unifié, ce qui facilite l'extension du cadre ou l'introduction de comportements personnalisés lorsque cela est nécessaire.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transports : Un canal de communication indépendant du protocole</h3><p>Les transports sont les protocoles de communication qui permettent à des agents hétérogènes de se connecter et d'échanger des messages au sein d'un réseau OpenAgents. OpenAgents prend en charge plusieurs protocoles de transport qui peuvent fonctionner simultanément au sein d'un même réseau :</p>
<ul>
<li><p><strong>HTTP/REST</strong> pour une intégration étendue et multilingue</p></li>
<li><p><strong>WebSocket</strong> pour une communication bidirectionnelle à faible latence</p></li>
<li><p><strong>gRPC</strong> pour une communication RPC haute performance adaptée aux clusters à grande échelle</p></li>
<li><p><strong>libp2p</strong> pour une mise en réseau décentralisée, de pair à pair</p></li>
<li><p><strong>A2A</strong>, un protocole émergent conçu spécifiquement pour la communication d'agent à agent.</p></li>
</ul>
<p>Tous les transports fonctionnent selon un format de message unifié basé sur les événements, ce qui permet une traduction transparente entre les protocoles. Vous n'avez pas à vous préoccuper du protocole utilisé par un agent homologue, le cadre de travail s'en charge automatiquement. Les agents construits dans n'importe quel langage ou cadre peuvent rejoindre un réseau OpenAgents sans réécrire le code existant.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Intégration d'OpenAgents avec Milvus pour une mémoire agentique à long terme<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents résout le problème de la <strong>communication, de la découverte et de la collaboration des</strong>agents <strong>, mais</strong>la collaboration seule ne suffit pas. Les agents génèrent des idées, des décisions, des historiques de conversation, des résultats d'outils et des connaissances spécifiques au domaine. Sans couche de mémoire persistante, tout cela s'évapore dès qu'un agent s'éteint.</p>
<p>C'est là que <strong>Milvus</strong> devient essentiel. Milvus fournit le stockage vectoriel haute performance et la récupération sémantique nécessaires pour transformer les interactions des agents en une mémoire durable et réutilisable. Lorsqu'il est intégré au réseau OpenAgents, il offre trois avantages majeurs :</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Recherche sémantique</strong></h4><p>Milvus permet une recherche sémantique rapide à l'aide d'algorithmes d'indexation tels que HNSW et IVF_FLAT. Les agents peuvent retrouver les documents historiques les plus pertinents en se basant sur le sens plutôt que sur les mots-clés, ce qui leur permet de :</p>
<ul>
<li><p>de se souvenir de décisions ou de plans antérieurs,</p></li>
<li><p>d'éviter de répéter le travail,</p></li>
<li><p>maintenir un contexte à long terme entre les sessions.</p></li>
</ul>
<p>Il s'agit là de l'épine dorsale de la <em>mémoire agentique</em>: une récupération rapide, pertinente et contextuelle.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Évolutivité horizontale à l'échelle du milliard</strong></h4><p>Les réseaux d'agents réels génèrent des quantités massives de données. Milvus est conçu pour fonctionner confortablement à cette échelle, en offrant :</p>
<ul>
<li><p>le stockage et la recherche sur des milliards de vecteurs,</p></li>
<li><p>une latence &lt; 30 ms, même en cas de recherche Top-K à haut débit,</p></li>
<li><p>une architecture entièrement distribuée qui s'adapte linéairement à la croissance de la demande.</p></li>
</ul>
<p>Que vous ayez une douzaine d'agents ou des milliers travaillant en parallèle, Milvus assure une recherche rapide et cohérente.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Isolation multi-locataires</strong></h4><p>Milvus offre une isolation granulaire multi-locataires grâce à <strong>Partition Key</strong>, un mécanisme de partitionnement léger qui segmente la mémoire à l'intérieur d'une collection unique. Cela permet</p>
<ul>
<li><p>à différentes équipes, projets ou communautés d'agents de conserver des espaces mémoire indépendants,</p></li>
<li><p>de réduire considérablement les frais généraux par rapport à la gestion de plusieurs collections,</p></li>
<li><p>la récupération optionnelle des partitions lorsque des connaissances partagées sont nécessaires.</p></li>
</ul>
<p>Cette isolation est cruciale pour les grands déploiements multi-agents où les limites des données doivent être respectées sans compromettre la vitesse de récupération.</p>
<p>OpenAgents se connecte à Milvus par le biais de <strong>modules personnalisés</strong> qui appellent directement les API de Milvus. Les messages des agents, les sorties d'outils et les journaux d'interaction sont automatiquement intégrés dans les vecteurs et stockés dans Milvus. Les développeurs peuvent personnaliser</p>
<ul>
<li><p>le modèle d'intégration,</p></li>
<li><p>le schéma de stockage et les métadonnées,</p></li>
<li><p>et les stratégies de recherche (par exemple, recherche hybride, recherche partitionnée).</p></li>
</ul>
<p>Chaque communauté d'agents dispose ainsi d'une couche de mémoire évolutive, persistante et optimisée pour le raisonnement sémantique.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Comment construire un chatbot multi-agent avec OpenAgent et Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour rendre les choses plus concrètes, passons en revue une démo : construire une <strong>communauté d'assistance aux développeurs</strong> où plusieurs agents spécialisés - experts en Python, experts en bases de données, ingénieurs DevOps, et autres - collaborent pour répondre aux questions techniques. Au lieu de s'appuyer sur un seul agent généraliste surchargé, chaque expert apporte un raisonnement spécifique au domaine, et le système achemine automatiquement les requêtes vers l'agent le mieux adapté.</p>
<p>Cet exemple montre comment intégrer <strong>Milvus</strong> dans un déploiement OpenAgents afin de fournir une mémoire à long terme pour les questions-réponses techniques. Les conversations des agents, les solutions antérieures, les journaux de dépannage et les requêtes des utilisateurs sont tous convertis en encastrements vectoriels et stockés dans Milvus, ce qui donne au réseau la capacité de :</p>
<ul>
<li><p>se souvenir des réponses précédentes,</p></li>
<li><p>de réutiliser les explications techniques antérieures,</p></li>
<li><p>maintenir la cohérence d'une session à l'autre</p></li>
<li><p>s'améliorer dans le temps au fur et à mesure que les interactions s'accumulent.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Prérequis</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Définir les dépendances</h3><p>Définir les paquets Python nécessaires au projet :</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Variables d'environnement</h3><p>Voici le modèle de configuration de votre environnement :</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Configurer votre réseau OpenAgents</h3><p>Définissez la structure de votre réseau d'agents et ses paramètres de communication :</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Mettre en œuvre la collaboration multi-agents</h3><p>Ce qui suit montre des extraits de code de base (et non l'implémentation complète).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Créer et activer un environnement virtuel</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Installer les dépendances</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurer les clés API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Démarrer le réseau OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Démarrer le service Multi-Agent</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Démarrer OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Accéder à Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Vérifiez l'état de vos agents et de votre réseau :</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>OpenAgents fournit la couche de coordination qui permet aux agents de se découvrir, de communiquer et de collaborer, tandis que Milvus résout le problème tout aussi critique du stockage, du partage et de la réutilisation des connaissances. En fournissant une couche de mémoire vectorielle très performante, Milvus permet aux agents de construire un contexte persistant, de se souvenir des interactions passées et d'accumuler de l'expertise au fil du temps. Ensemble, ils poussent les systèmes d'IA au-delà des limites des modèles isolés et vers le potentiel de collaboration plus profond d'un véritable réseau multi-agents.</p>
<p>Bien entendu, aucune architecture multi-agents n'est exempte de compromis. L'exécution d'agents en parallèle peut augmenter la consommation de jetons, les erreurs peuvent se répercuter en cascade sur les agents et la prise de décision simultanée peut entraîner des conflits occasionnels. Il s'agit là de domaines de recherche active et d'amélioration continue, mais ils ne diminuent en rien la valeur de la construction de systèmes capables de se coordonner, de se souvenir et d'évoluer.</p>
<p>🚀 Prêt à doter vos agents d'une mémoire à long terme ?</p>
<p>Découvrez <a href="https://milvus.io/">Milvus</a> et essayez de l'intégrer à votre propre flux de travail.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
