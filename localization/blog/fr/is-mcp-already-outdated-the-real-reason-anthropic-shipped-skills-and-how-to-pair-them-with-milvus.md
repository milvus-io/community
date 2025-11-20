---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  Le MCP est-il déjà dépassé ? La vraie raison pour laquelle Anthropic a expédié
  des compétences et comment les associer à Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Découvrez comment Skills réduit la consommation de jetons et comment Skills et
  MCP collaborent avec Milvus pour améliorer les flux de travail de l'IA.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>Au cours des dernières semaines, une discussion étonnamment animée a éclaté sur X et Hacker News : <em>Avons-nous encore besoin des serveurs MCP ?</em> Certains développeurs affirment que MCP est trop technique, gourmand en jetons, et fondamentalement mal aligné avec la façon dont les agents devraient utiliser les outils. D'autres défendent MCP comme le moyen fiable d'exposer les capacités du monde réel aux modèles de langage. Selon le fil de discussion que vous lisez, MCP est soit l'avenir de l'utilisation des outils, soit mort à l'arrivée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustration est compréhensible. MCP vous donne un accès robuste aux systèmes externes, mais il oblige également le modèle à charger de longs schémas, des descriptions verbeuses et des listes d'outils tentaculaires. Cela représente un coût réel. Si vous téléchargez la transcription d'une réunion et que vous l'introduisez ensuite dans un autre outil, le modèle peut retraiter le même texte plusieurs fois, gonflant ainsi l'utilisation des jetons sans bénéfice évident. Pour les équipes opérant à grande échelle, il ne s'agit pas d'un inconvénient, mais d'une facture.</p>
<p>Mais déclarer MCP obsolète est prématuré. Anthropic - la même équipe qui a inventé MCP - a tranquillement introduit quelque chose de nouveau : <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Les compétences sont des définitions Markdown/YAML légères qui décrivent <em>comment</em> et <em>quand</em> un outil doit être utilisé. Au lieu de déverser des schémas complets dans la fenêtre contextuelle, le modèle lit d'abord les métadonnées compactes et les utilise pour planifier. Dans la pratique, les Skills réduisent considérablement la charge de travail des jetons et donnent aux développeurs plus de contrôle sur l'orchestration des outils.</p>
<p>Cela signifie-t-il que les Skills vont remplacer MCP ? Pas tout à fait. Les compétences rationalisent la planification, mais MCP fournit toujours les capacités réelles : lecture de fichiers, appel d'API, interaction avec les systèmes de stockage ou connexion à une infrastructure externe comme <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielle open-source qui sous-tend la recherche sémantique rapide à l'échelle, ce qui en fait un backend critique lorsque vos compétences ont besoin d'un accès réel aux données.</p>
<p>Cet article explique ce que les compétences font bien, où MCP est encore important, et comment les deux s'intègrent dans l'architecture évolutive des agents d'Anthropic. Nous verrons ensuite comment construire vos propres compétences qui s'intègrent parfaitement à Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Que sont les compétences des agents Anthropic et comment fonctionnent-elles ?<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>L'un des problèmes de longue date des agents d'IA traditionnels est que les instructions s'effacent au fur et à mesure que la conversation s'intensifie.</p>
<p>Même avec les invites les plus soigneusement conçues, le comportement du modèle peut progressivement dériver au cours de la conversation. Après plusieurs tours, Claude commence à oublier les instructions initiales ou à s'en désintéresser.</p>
<p>Le problème réside dans la structure de l'invite du système. Il s'agit d'une injection unique et statique qui se dispute l'espace dans la fenêtre contextuelle du modèle, aux côtés de l'historique de la conversation, des documents et de toute autre entrée. Au fur et à mesure que la fenêtre contextuelle se remplit, l'attention du modèle pour l'invite du système se dilue de plus en plus, ce qui entraîne une perte de cohérence au fil du temps.</p>
<p>Les compétences ont été conçues pour résoudre ce problème. Les compétences sont des dossiers contenant des instructions, des scripts et des ressources. Plutôt que de s'appuyer sur une invite statique du système, les compétences décomposent l'expertise en paquets d'instructions modulaires, réutilisables et persistants que Claude peut découvrir et charger dynamiquement lorsqu'il en a besoin pour une tâche.</p>
<p>Lorsque Claude commence une tâche, il effectue d'abord un balayage léger de toutes les compétences disponibles en lisant uniquement leurs métadonnées YAML (quelques dizaines de tokens seulement). Ces métadonnées fournissent juste assez d'informations pour que Claude puisse déterminer si une compétence est pertinente pour la tâche en cours. Si c'est le cas, Claude développe l'ensemble des instructions (généralement moins de 5k tokens), et des ressources ou des scripts supplémentaires ne sont chargés que si c'est nécessaire.</p>
<p>Cette divulgation progressive permet à Claude d'initialiser une compétence avec seulement 30 à 50 tokens, ce qui améliore considérablement l'efficacité et réduit les surcharges de contexte inutiles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Comparaison des compétences avec les invites, les projets, les MCP et les sous-agents<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Aujourd'hui, le paysage des outils de modélisation peut sembler encombré. Même au sein de l'écosystème agentique de Claude, il existe plusieurs composants distincts : Compétences, invites, projets, sous-agents et MCP.</p>
<p>Maintenant que nous comprenons ce que sont les compétences et comment elles fonctionnent grâce aux paquets d'instructions modulaires et au chargement dynamique, nous devons savoir comment les compétences sont liées à d'autres parties de l'écosystème Claude, en particulier MCP. En voici un résumé :</p>
<h3 id="1-Skills" class="common-anchor-header">1. Les compétences</h3><p>Les compétences sont des dossiers qui contiennent des instructions, des scripts et des ressources. Claude les découvre et les charge dynamiquement en utilisant la divulgation progressive : d'abord les métadonnées, puis les instructions complètes, et enfin tous les fichiers nécessaires.</p>
<p><strong>Idéal pour :</strong></p>
<ul>
<li><p>Les flux de travail organisationnels (directives de marque, procédures de conformité)</p></li>
<li><p>Expertise dans un domaine (formules Excel, analyse de données)</p></li>
<li><p>Préférences personnelles (systèmes de prise de notes, modèles de codage)</p></li>
<li><p>Les tâches professionnelles qui doivent être réutilisées au fil des conversations (examens de la sécurité du code basés sur OWASP).</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Invites</h3><p>Les invites sont les instructions en langage naturel que vous donnez à Claude au cours d'une conversation. Ils sont temporaires et n'existent que dans la conversation en cours.</p>
<p><strong>C'est la solution idéale :</strong></p>
<ul>
<li><p>Les demandes ponctuelles (résumer un article, mettre en forme une liste)</p></li>
<li><p>Amélioration de la conversation (ajuster le ton, ajouter des détails)</p></li>
<li><p>Contexte immédiat (analyse de données spécifiques, interprétation du contenu)</p></li>
<li><p>Instructions ad hoc</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Les projets</h3><p>Les projets sont des espaces de travail autonomes disposant de leur propre historique de conversation et de leur propre base de connaissances. Chaque projet offre une fenêtre contextuelle de 200K. Lorsque la connaissance de votre projet approche les limites du contexte, Claude passe de manière transparente en mode RAG, ce qui permet de multiplier par 10 la capacité effective.</p>
<p><strong>Idéal pour :</strong></p>
<ul>
<li><p>Contexte persistant (par exemple, toutes les conversations liées au lancement d'un produit)</p></li>
<li><p>Organisation de l'espace de travail (contextes distincts pour différentes initiatives)</p></li>
<li><p>Collaboration d'équipe (pour les plans Team et Enterprise)</p></li>
<li><p>Instructions personnalisées (ton ou perspective spécifique à un projet)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Sous-agents</h3><p>Les sous-agents sont des assistants spécialisés de l'IA qui disposent de leurs propres fenêtres contextuelles, d'invites système personnalisées et d'autorisations d'utilisation d'outils spécifiques. Ils peuvent travailler de manière indépendante et renvoyer les résultats à l'agent principal.</p>
<p><strong>Idéal pour :</strong></p>
<ul>
<li><p>Spécialisation des tâches (examen du code, génération de tests, audits de sécurité)</p></li>
<li><p>Gestion du contexte (maintenir l'attention sur la conversation principale)</p></li>
<li><p>Traitement parallèle (plusieurs sous-agents travaillant simultanément sur différents aspects)</p></li>
<li><p>Restriction des outils (par exemple, accès en lecture seule)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Model Context Protocol)</h3><p>Le protocole de contexte de modèle (MCP) est une norme ouverte qui relie les modèles d'IA à des outils et des sources de données externes.</p>
<p><strong>Idéal pour :</strong></p>
<ul>
<li><p>Accéder à des données externes (Google Drive, Slack, GitHub, bases de données)</p></li>
<li><p>Utiliser des outils commerciaux (systèmes CRM, plateformes de gestion de projet)</p></li>
<li><p>Connexion à des environnements de développement (fichiers locaux, IDE, contrôle de version)</p></li>
<li><p>Intégration avec des systèmes personnalisés (outils et sources de données propriétaires)</p></li>
</ul>
<p>Sur la base de ce qui précède, nous pouvons constater que les compétences et le MCP répondent à des défis différents et se complètent mutuellement.</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>MCP</strong></th><th><strong>Compétences</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Valeur fondamentale</strong></td><td>Connexion à des systèmes externes (bases de données, API, plateformes SaaS)</td><td>Définit les spécifications de comportement (comment traiter et présenter les données)</td></tr>
<tr><td><strong>Réponses aux questions</strong></td><td>"À quoi Claude peut-il accéder ?</td><td>"Que doit faire Claude ?</td></tr>
<tr><td><strong>Mise en œuvre</strong></td><td>Protocole client-serveur + schéma JSON</td><td>Fichier Markdown + métadonnées YAML</td></tr>
<tr><td><strong>Consommation de contexte</strong></td><td>Des dizaines de milliers de jetons (accumulations multiples sur le serveur)</td><td>30-50 jetons par opération</td></tr>
<tr><td><strong>Cas d'utilisation</strong></td><td>Interrogation de grandes bases de données, appel des API de GitHub</td><td>Définition de stratégies de recherche, application de règles de filtrage, formatage des résultats</td></tr>
</tbody>
</table>
<p>Prenons l'exemple de la recherche de code.</p>
<ul>
<li><p><strong>MCP (par exemple, claude-context) :</strong> Permet d'accéder à la base de données vectorielle Milvus.</p></li>
<li><p><strong>Compétences :</strong> Définit le flux de travail, tel que la priorisation du code le plus récemment modifié, le tri des résultats par pertinence et la présentation des données dans un tableau Markdown.</p></li>
</ul>
<p>MCP fournit la capacité, tandis que les compétences définissent le processus. Ensemble, ils forment une paire complémentaire.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Comment créer des compétences personnalisées avec Claude-Context et Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> est un plugin MCP qui ajoute une fonctionnalité de recherche sémantique de code à Claude Code, transformant l'ensemble de la base de code en contexte de Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prérequis</h3><p>Configuration requise :</p>
<ul>
<li><p><strong>Node.js</strong>: Version &gt;= 20.0.0 et &lt; 24.0.0</p></li>
<li><p><strong>Clé API OpenAI</strong> (pour l'intégration de modèles)</p></li>
<li><p><strong>Clé API</strong><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> (service Milvus géré)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Étape 1 : Configurer le service MCP (claude-context)</h3><p>Exécutez la commande suivante dans le terminal :</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vérifier la configuration :</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La configuration du MCP est terminée. Claude peut maintenant accéder à la base de données vectorielle Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Etape 2 : Créer la compétence</h3><p>Créer le répertoire Skills :</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Créer le fichier SKILL.md :</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Étape 3 : Redémarrer Claude pour appliquer les compétences</h3><p>Exécutez la commande suivante pour redémarrer Claude :</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note :</strong> Une fois la configuration terminée, vous pouvez immédiatement utiliser les compétences pour interroger la base de code Milvus.</p>
<p>Vous trouverez ci-dessous un exemple de fonctionnement.</p>
<p>Interroger : Comment fonctionne Milvus QueryCoord ?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>À la base, les compétences constituent un mécanisme d'encapsulation et de transfert de connaissances spécialisées. En utilisant les compétences, l'IA peut hériter de l'expérience d'une équipe et suivre les meilleures pratiques de l'industrie, qu'il s'agisse d'une liste de contrôle pour les examens de code ou de normes de documentation. Lorsque ces connaissances tacites sont rendues explicites par le biais de fichiers Markdown, la qualité des résultats générés par l'IA peut s'en trouver considérablement améliorée.</p>
<p>À l'avenir, la capacité à exploiter efficacement les compétences pourrait devenir un facteur de différenciation clé dans la manière dont les équipes et les individus utilisent l'IA à leur avantage.</p>
<p>Alors que vous exploitez le potentiel de l'IA dans votre entreprise, Milvus est un outil essentiel pour la gestion et la recherche de données vectorielles à grande échelle. En associant la puissante base de données vectorielles de Milvus à des outils d'IA tels que Skills, vous pouvez améliorer non seulement vos flux de travail, mais aussi la profondeur et la rapidité de vos informations fondées sur des données.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> pour discuter avec nos ingénieurs et d'autres ingénieurs en IA de la communauté. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
