---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Pourquoi le code Claude semble si stable : Plongée en profondeur d'un
  développeur dans la conception de son stockage local
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Plongée dans le stockage de Claude Code : Les journaux de session JSONL,
  l'isolation des projets, la configuration en couches et les instantanés de
  fichiers qui rendent le codage assisté par l'IA stable et récupérable.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Le code Claude est omniprésent ces derniers temps. Les développeurs l'utilisent pour livrer des fonctionnalités plus rapidement, automatiser les flux de travail et prototyper des agents qui fonctionnent réellement dans des projets réels. Ce qui est encore plus surprenant, c'est le nombre de non-codeurs qui s'y sont mis aussi - construisant des outils, câblant des tâches, et obtenant des résultats utiles avec presque aucune configuration. Il est rare de voir un outil de codage de l'IA se répandre aussi rapidement à travers autant de niveaux de compétences différents.</p>
<p>Ce qui ressort vraiment, cependant, c'est la <em>stabilité de</em> l'outil. Claude Code se souvient de ce qui s'est passé d'une session à l'autre, survit aux plantages sans perdre de progrès et se comporte plus comme un outil de développement local que comme une interface de chat. Cette fiabilité vient de la façon dont il gère le stockage local.</p>
<p>Au lieu de traiter votre session de codage comme un chat temporaire, Claude Code lit et écrit de vrais fichiers, stocke l'état du projet sur le disque et enregistre chaque étape du travail de l'agent. Les sessions peuvent être reprises, inspectées, ou annulées sans avoir à se poser de questions, et chaque projet reste proprement isolé - évitant ainsi les problèmes de contamination croisée que rencontrent beaucoup d'outils d'agent.</p>
<p>Dans cet article, nous allons examiner de plus près l'architecture de stockage qui sous-tend cette stabilité, et pourquoi elle joue un rôle si important dans le fait que Claude Code semble pratique pour le développement quotidien.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Défis auxquels chaque assistant de codage d'IA locale est confronté<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant d'expliquer comment Claude Code aborde le stockage, jetons un coup d'œil aux problèmes courants que les outils de codage d'IA locale ont tendance à rencontrer. Ces problèmes apparaissent naturellement lorsqu'un assistant travaille directement sur votre système de fichiers et conserve l'état des données au fil du temps.</p>
<p><strong>1. Les données du projet sont mélangées entre les espaces de travail.</strong></p>
<p>La plupart des développeurs passent d'un dépôt à l'autre tout au long de la journée. Si un assistant conserve l'état d'un projet à l'autre, il devient plus difficile de comprendre son comportement et plus facile pour lui de faire des suppositions erronées. Chaque projet a besoin d'un espace propre et isolé pour son état et son historique.</p>
<p><strong>2. Les pannes peuvent entraîner une perte de données.</strong></p>
<p>Au cours d'une session de codage, un assistant produit un flux constant de données utiles - modifications de fichiers, appels d'outils, étapes intermédiaires. Si ces données ne sont pas sauvegardées immédiatement, un crash ou un redémarrage forcé peut les effacer. Un système fiable écrit les données importantes sur le disque dès qu'elles sont créées, de sorte que le travail n'est pas perdu de manière inattendue.</p>
<p><strong>3. Il n'est pas toujours évident de savoir ce que l'agent a réellement fait.</strong></p>
<p>Une session typique implique de nombreuses petites actions. Sans un enregistrement clair et ordonné de ces actions, il est difficile de retracer comment l'assistant est arrivé à un certain résultat ou de localiser l'étape où quelque chose s'est mal passé. Un historique complet rend le débogage et la révision beaucoup plus faciles à gérer.</p>
<p><strong>4. L'annulation des erreurs demande trop d'efforts.</strong></p>
<p>Il arrive que l'assistant apporte des modifications qui ne fonctionnent pas tout à fait. Si vous n'avez pas de moyen intégré pour annuler ces changements, vous finissez par rechercher manuellement les modifications dans le repo. Le système devrait automatiquement suivre ce qui a été modifié afin que vous puissiez l'annuler proprement sans travail supplémentaire.</p>
<p><strong>5. Des projets différents nécessitent des paramètres différents.</strong></p>
<p>Les environnements locaux varient. Certains projets nécessitent des autorisations, des outils ou des règles de répertoire spécifiques ; d'autres ont des scripts ou des flux de travail personnalisés. Un assistant doit respecter ces différences et permettre des paramétrages par projet tout en gardant son comportement principal cohérent.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Les principes de conception du stockage derrière Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>La conception du stockage de Claude Code s'articule autour de quatre idées simples. Elles peuvent sembler simples, mais ensemble, elles répondent aux problèmes pratiques qui se posent lorsqu'un assistant IA travaille directement sur votre machine et sur plusieurs projets.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Chaque projet dispose de son propre espace de stockage.</h3><p>Claude Code lie toutes les données de session au répertoire du projet auquel elles appartiennent. Cela signifie que les conversations, les modifications et les journaux restent dans le projet d'où ils proviennent et ne fuient pas dans les autres. Le fait de garder le stockage séparé rend le comportement de l'assistant plus facile à comprendre et permet d'inspecter ou d'effacer facilement les données d'un répertoire spécifique.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Les données sont immédiatement enregistrées sur le disque.</h3><p>Au lieu de garder les données d'interaction en mémoire, Claude Code les écrit sur le disque dès qu'elles sont créées. Chaque événement - message, appel d'outil ou mise à jour d'état - est ajouté comme une nouvelle entrée. Si le programme se plante ou est fermé de manière inattendue, presque tout est encore là. Cette approche assure la durabilité des sessions sans ajouter beaucoup de complexité.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Chaque action a une place claire dans l'histoire.</h3><p>Claude Code relie chaque message et chaque action d'outil à celui qui le précède, formant ainsi une séquence complète. Cet historique ordonné permet de revoir le déroulement d'une session et de retracer les étapes qui ont conduit à un résultat spécifique. Pour les développeurs, ce type de trace facilite grandement le débogage et la compréhension du comportement de l'agent.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Les modifications de code sont faciles à annuler.</h3><p>Avant que l'assistant ne mette à jour un fichier, Claude Code enregistre un instantané de son état précédent. Si la modification s'avère erronée, vous pouvez rétablir la version précédente sans avoir à fouiller dans le répertoire ou à deviner ce qui a changé. Ce simple filet de sécurité rend les modifications effectuées par l'IA beaucoup moins risquées.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Disposition du stockage local de Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code stocke toutes ses données locales dans un seul endroit : votre répertoire personnel. Cela permet au système de rester prévisible et facilite l'inspection, le débogage ou le nettoyage en cas de besoin. La structure de stockage est construite autour de deux composants principaux : un petit fichier de configuration global et un répertoire de données plus grand où se trouve tout l'état du projet.</p>
<p><strong>Deux composants principaux :</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Stocke la configuration globale et les raccourcis, y compris les mappages de projets, les paramètres du serveur MCP et les invites récemment utilisées.</p></li>
<li><p><code translate="no">~/.claude/</code>Le répertoire de données principal, où Claude Code stocke les conversations, les sessions de projet, les permissions, les plugins, les compétences, l'historique et les données d'exécution connexes.</p></li>
</ul>
<p>Ensuite, regardons de plus près ces deux composants principaux.</p>
<p><strong>(1) Configuration globale</strong>: <code translate="no">~/.claude.json</code></p>
<p>Ce fichier agit comme un index plutôt que comme un magasin de données. Il enregistre les projets sur lesquels vous avez travaillé, les outils associés à chaque projet et les invites que vous avez récemment utilisées. Les données de conversation elles-mêmes ne sont pas stockées dans ce fichier.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Répertoire de données principal</strong>: <code translate="no">~/.claude/</code></p>
<p>Le répertoire <code translate="no">~/.claude/</code> contient la plupart des données locales de Claude Code. Sa structure reflète quelques idées fondamentales de conception : l'isolation du projet, la persistance immédiate, et la récupération sûre des erreurs.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cette structure est intentionnellement simple : tout ce que Claude Code génère se trouve dans un seul répertoire, organisé par projet et par session. Il n'y a pas d'état caché éparpillé dans votre système, et il est facile de l'inspecter ou de le nettoyer quand c'est nécessaire.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Comment Claude Code gère la configuration<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de configuration de Claude Code est conçu autour d'une idée simple : garder le comportement par défaut cohérent sur toutes les machines, tout en laissant les environnements individuels et les projets personnaliser ce dont ils ont besoin. Pour ce faire, Claude Code utilise un modèle de configuration à trois niveaux. Lorsqu'un même paramètre apparaît à plusieurs endroits, c'est toujours la couche la plus spécifique qui l'emporte.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Les trois niveaux de configuration</h3><p>Claude Code charge la configuration dans l'ordre suivant, de la priorité la plus basse à la plus haute :</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>On peut considérer que l'on commence par les valeurs par défaut globales, que l'on applique ensuite les ajustements spécifiques à la machine et que l'on applique enfin les règles spécifiques au projet.</p>
<p>Nous allons maintenant examiner chaque niveau de configuration en détail.</p>
<p><strong>(1) Configuration globale</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>La configuration globale définit le comportement par défaut de Claude Code dans tous les projets. C'est ici que vous définissez les permissions de base, que vous activez les plugins et que vous configurez le comportement de nettoyage.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Configuration locale</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>La configuration locale est spécifique à une seule machine. Elle n'est pas destinée à être partagée ou vérifiée dans le contrôle de version. C'est donc un bon endroit pour les clés d'API, les outils locaux ou les autorisations spécifiques à l'environnement.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Configuration au niveau du projet</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>La configuration au niveau du projet ne s'applique qu'à un seul projet et a la priorité la plus élevée. C'est ici que vous définissez les règles qui doivent toujours s'appliquer lorsque vous travaillez dans ce référentiel.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Une fois les couches de configuration définies, la question suivante est de savoir <strong>comment Claude Code résout la configuration et les permissions au moment de l'exécution.</strong></p>
<p><strong>Claude Code</strong> applique la configuration en trois couches : il commence avec les valeurs par défaut globales, puis applique les dérogations spécifiques à la machine, et enfin applique les règles spécifiques au projet. Lorsque le même paramètre apparaît à plusieurs endroits, la configuration la plus spécifique est prioritaire.</p>
<p>Les autorisations suivent un ordre d'évaluation fixe :</p>
<ol>
<li><p><strong>deny</strong> - bloque toujours</p></li>
<li><p><strong>ask</strong> - demande une confirmation</p></li>
<li><p><strong>allow</strong> - s'exécute automatiquement</p></li>
<li><p><strong>default</strong> - s'applique uniquement lorsqu'aucune règle ne correspond</p></li>
</ol>
<p>Le système reste ainsi sûr par défaut, tout en offrant aux projets et aux machines individuelles la flexibilité dont ils ont besoin.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Stockage des sessions : Comment Claude Code conserve les données d'interaction essentielles<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans <strong>Claude Code</strong>, les sessions sont l'unité centrale des données. Une session capture l'ensemble de l'interaction entre l'utilisateur et l'IA, y compris la conversation elle-même, les appels d'outils, les changements de fichiers et le contexte associé. La façon dont les sessions sont stockées a un impact direct sur la fiabilité, la débogage et la sécurité globale du système.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Conserver les données de session séparément pour chaque projet</h3><p>Une fois les sessions définies, la question suivante est de savoir comment <strong>Claude Code</strong> les stocke de manière à garder les données organisées et isolées.</p>
<p><strong>Claude Code</strong> isole les données de session par projet. Les sessions de chaque projet sont stockées dans un répertoire dérivé du chemin de fichier du projet.</p>
<p>Le chemin de stockage suit ce modèle :</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Pour créer un nom de répertoire valide, les caractères spéciaux tels que <code translate="no">/</code>, les espaces et <code translate="no">~</code> sont remplacés par <code translate="no">-</code>.</p>
<p>Par exemple :</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Cette approche garantit que les données de session de différents projets ne se mélangent jamais et qu'elles peuvent être gérées ou supprimées pour chaque projet.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Pourquoi les sessions sont stockées au format JSONL</h3><p><strong>Claude Code</strong> stocke les données de session en utilisant JSONL (JSON Lines) au lieu de JSON standard.</p>
<p>Dans un fichier JSON traditionnel, tous les messages sont regroupés dans une grande structure, ce qui signifie que le fichier entier doit être lu et réécrit chaque fois qu'il change. En revanche, JSONL stocke chaque message sur sa propre ligne dans le fichier. Une ligne équivaut à un message, sans enveloppe extérieure.</p>
<table>
<thead>
<tr><th>Aspect</th><th>JSON standard</th><th>JSONL (lignes JSON)</th></tr>
</thead>
<tbody>
<tr><td>Comment les données sont-elles stockées ?</td><td>Une grande structure</td><td>Un message par ligne</td></tr>
<tr><td>Quand les données sont sauvegardées</td><td>Généralement à la fin</td><td>Immédiatement, par message</td></tr>
<tr><td>Impact du crash</td><td>Le fichier entier peut se briser</td><td>Seule la dernière ligne est affectée</td></tr>
<tr><td>Écriture de nouvelles données</td><td>Réécriture du fichier entier</td><td>Ajouter une ligne</td></tr>
<tr><td>Utilisation de la mémoire</td><td>Charger tout</td><td>Lecture ligne par ligne</td></tr>
</tbody>
</table>
<p>JSONL est plus efficace à plusieurs égards :</p>
<ul>
<li><p><strong>Enregistrement immédiat :</strong> Chaque message est écrit sur le disque dès qu'il est généré, au lieu d'attendre la fin de la session.</p></li>
<li><p><strong>Résistance aux pannes :</strong> en cas de panne du programme, seul le dernier message non terminé peut être perdu. Tout ce qui a été écrit avant reste intact.</p></li>
<li><p><strong>Apposition rapide :</strong> Les nouveaux messages sont ajoutés à la fin du fichier sans lecture ni réécriture des données existantes.</p></li>
<li><p><strong>Faible utilisation de la mémoire :</strong> Les fichiers de session peuvent être lus une ligne à la fois, de sorte qu'il n'est pas nécessaire de charger l'ensemble du fichier en mémoire.</p></li>
</ul>
<p>Un fichier de session JSONL simplifié ressemble à ceci :</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Types de messages de session</h3><p>Un fichier de session enregistre tout ce qui se passe lors d'une interaction avec le code Claude. Pour le faire clairement, il utilise différents types de messages pour différents types d'événements.</p>
<ul>
<li><p>Les<strong>messages de l'utilisateur</strong> représentent les nouvelles entrées dans le système. Cela inclut non seulement ce que l'utilisateur tape, mais aussi les résultats renvoyés par les outils, tels que la sortie d'une commande shell. Du point de vue de l'IA, il s'agit d'entrées auxquelles elle doit répondre.</p></li>
<li><p>Les<strong>messages de l'assistant</strong> décrivent ce que Claude fait en réponse. Ces messages comprennent le raisonnement de l'IA, le texte qu'elle génère et tous les outils qu'elle décide d'utiliser. Ils enregistrent également les détails de l'utilisation, tels que le nombre de jetons, afin de fournir une image complète de l'interaction.</p></li>
<li><p>Les<strong>instantanés de l'historique des fichiers</strong> sont des points de contrôle de sécurité créés avant que Claude ne modifie des fichiers. En sauvegardant d'abord l'état original du fichier, Claude Code permet d'annuler les modifications en cas de problème.</p></li>
<li><p><strong>Les résumés</strong> fournissent un aperçu concis de la session et sont liés au résultat final. Ils facilitent la compréhension du contenu d'une session sans avoir à en rejouer chaque étape.</p></li>
</ul>
<p>Ensemble, ces types de messages enregistrent non seulement la conversation, mais aussi la séquence complète des actions et des effets qui se produisent au cours d'une session.</p>
<p>Pour rendre cela plus concret, examinons des exemples spécifiques de messages d'utilisateur et de messages d'assistant.</p>
<p><strong>(1) Exemple de messages d'utilisateur :</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Exemple de messages d'assistant :</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Comment les messages de session sont liés</h3><p>Claude Code ne stocke pas les messages de session en tant qu'entrées isolées. Au contraire, il les relie entre eux pour former une chaîne d'événements claire. Chaque message comprend un identifiant unique (<code translate="no">uuid</code>) et une référence au message qui le précède (<code translate="no">parentUuid</code>). Cela permet de voir non seulement ce qui s'est passé, mais aussi pourquoi cela s'est passé.</p>
<p>Une session commence par un message d'utilisateur, qui lance la chaîne. Chaque réponse de Claude renvoie au message qui l'a provoquée. Les appels d'outils et leurs résultats sont ajoutés de la même manière, chaque étape étant liée à la précédente. Lorsque la session se termine, un résumé est joint au message final.</p>
<p>Comme chaque étape est liée, Claude Code peut rejouer la séquence complète des actions et comprendre comment un résultat a été produit, ce qui facilite grandement le débogage et l'analyse.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Faciliter l'annulation des modifications du code grâce aux instantanés de fichiers<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>Les modifications générées par l'IA ne sont pas toujours correctes, et parfois elles vont dans la mauvaise direction. Pour rendre ces modifications sûres, Claude Code utilise un simple système d'instantanés qui vous permet d'annuler les modifications sans avoir à fouiller dans les différences ou à nettoyer manuellement les fichiers.</p>
<p>L'idée est simple : <strong>avant que Claude Code ne modifie un fichier, il enregistre une copie du contenu original.</strong> Si la modification s'avère être une erreur, le système peut restaurer instantanément la version précédente.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">Qu'est-ce qu'un <em>instantané de l'historique d'un fichier</em>?</h3><p>Un <em>instantané de l'historique des fichiers</em> est un point de contrôle créé avant que les fichiers ne soient modifiés. Il enregistre le contenu original de chaque fichier que <strong>Claude</strong> s'apprête à modifier. Ces instantanés servent de source de données pour les opérations d'annulation et de retour en arrière.</p>
<p>Lorsqu'un utilisateur envoie un message susceptible de modifier des fichiers, <strong>Claude Code</strong> crée un instantané vide pour ce message. Avant l'édition, le système sauvegarde le contenu original de chaque fichier cible dans l'instantané, puis applique les modifications directement sur le disque. Si l'utilisateur déclenche l'<em>annulation</em>, <strong>Claude Code</strong> restaure le contenu sauvegardé et écrase les fichiers modifiés.</p>
<p>En pratique, le cycle de vie d'une modification annulable se déroule comme suit :</p>
<ol>
<li><p><strong>L'utilisateur envoie un messageClaude</strong>Code crée un nouvel enregistrement vide <code translate="no">file-history-snapshot</code>.</p></li>
<li><p><strong>Claude se prépare à modifier les fichiersLe</strong>système identifie les fichiers à modifier et sauvegarde leur contenu original sur <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude exécute la modificationLes</strong>opérations de<strong>modification</strong>et d'écriture sont effectuées et le contenu modifié est écrit sur le disque.</p></li>
<li><p>L'utilisateur<strong>déclenche l'annulationL'</strong>utilisateur appuie sur <strong>Esc + Esc</strong>, signalant que les modifications doivent être annulées.</p></li>
<li><p><strong>Le contenu original est restauréClaude</strong>Code lit le contenu sauvegardé sur <code translate="no">trackedFileBackups</code> et écrase les fichiers actuels, achevant ainsi l'annulation.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Pourquoi l'annulation fonctionne-t-elle ? Les instantanés sauvegardent l'ancienne version</h3><p>L'annulation dans Claude Code fonctionne parce que le système enregistre le contenu <em>original</em> du fichier avant toute modification.</p>
<p>Au lieu d'essayer d'annuler les modifications après coup, Claude Code adopte une approche plus simple : il copie le fichier tel qu'il existait <em>avant la</em> modification et stocke cette copie dans <code translate="no">trackedFileBackups</code>. Lorsque l'utilisateur déclenche l'annulation, le système restaure cette version sauvegardée et écrase le fichier modifié.</p>
<p>Le diagramme ci-dessous illustre ce flux étape par étape :</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">A quoi ressemble un <em>instantané de l'historique des fichiers</em> en interne</h3><p>L'instantané lui-même est stocké sous la forme d'un enregistrement structuré. Il contient des métadonnées sur le message de l'utilisateur, l'heure de l'instantané et, surtout, une correspondance entre les fichiers et leur contenu d'origine.</p>
<p>L'exemple ci-dessous montre un seul enregistrement <code translate="no">file-history-snapshot</code> créé avant que Claude ne modifie des fichiers. Chaque entrée de <code translate="no">trackedFileBackups</code> stocke le contenu d'un fichier <em>avant sa modification</em>, qui est ensuite utilisé pour restaurer le fichier lors d'une annulation.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Où sont stockés les instantanés et combien de temps ils sont conservés</h3><ul>
<li><p><strong>Où sont stockées les métadonnées des instantanés</strong>: Les enregistrements d'instantanés sont liés à une session spécifique et sauvegardés sous forme de fichiers JSONL à l'adresse<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Où le contenu original des fichiers est sauvegardé</strong>: Le contenu de chaque fichier avant édition est stocké séparément par hachage de contenu sous<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Durée de conservation des instantanés par défaut</strong>: Les données des instantanés sont conservées pendant 30 jours, conformément au paramètre global <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Comment modifier la durée de conservation</strong>: Le nombre de jours de conservation peut être ajusté via le champ <code translate="no">cleanupPeriodDays</code> dans <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Commandes associées</h3><table>
<thead>
<tr><th>Commande / Action</th><th>Description de la commande</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Annule la dernière série d'éditions de fichiers (la plus couramment utilisée)</td></tr>
<tr><td>/rewind</td><td>Revenir à un point de contrôle spécifié précédemment (snapshot)</td></tr>
<tr><td>/diff</td><td>Affiche les différences entre le fichier actuel et la sauvegarde instantanée.</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Autres répertoires importants<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Gestion des plugins</strong></p>
<p>Le répertoire <code translate="no">plugins/</code> stocke les modules complémentaires qui donnent à Claude Code des capacités supplémentaires.</p>
<p>Ce répertoire stocke les <em>plugins</em> installés, leur provenance et les compétences supplémentaires qu'ils apportent. Il conserve également des copies locales des plugins téléchargés afin qu'ils n'aient pas besoin d'être récupérés à nouveau.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - Où les compétences sont stockées et appliquées</strong></p>
<p>Dans Claude Code, une compétence est une petite capacité réutilisable qui aide Claude à effectuer une tâche spécifique, comme travailler avec des PDF, éditer des documents, ou suivre un flux de travail de codage.</p>
<p>Toutes les compétences ne sont pas disponibles partout. Certaines s'appliquent globalement, tandis que d'autres sont limitées à un seul projet ou fournies par un plugin. Claude Code stocke les compétences à différents endroits pour contrôler où chaque compétence peut être utilisée.</p>
<p>La hiérarchie ci-dessous montre comment les compétences sont superposées en fonction de leur portée, depuis les compétences disponibles globalement jusqu'aux compétences spécifiques à un projet ou fournies par un plugin.</p>
<table>
<thead>
<tr><th>Niveau</th><th>Emplacement de stockage</th><th>Description des compétences</th></tr>
</thead>
<tbody>
<tr><td>Utilisateur</td><td>~/.claude/skills/</td><td>Disponible globalement, accessible par tous les projets</td></tr>
<tr><td>Projet</td><td>projet/.claude/compétences/</td><td>Disponible uniquement pour le projet en cours, personnalisation spécifique au projet</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Installé avec les plugins, dépend de l'état d'activation des plugins</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Stockage des listes de tâches</strong></p>
<p>Le répertoire <code translate="no">todos/</code> stocke les listes de tâches que Claude crée pour faire le suivi du travail au cours d'une conversation, comme les étapes à franchir, les éléments en cours et les tâches terminées.</p>
<p>Les listes de tâches sont enregistrées sous forme de fichiers JSON dans le répertoire<code translate="no">~/.claude/todos/{session-id}-*.json</code>. Chaque nom de fichier comprend l'identifiant de la session, qui lie la liste de tâches à une conversation spécifique.</p>
<p>Le contenu de ces fichiers provient de l'outil <code translate="no">TodoWrite</code> et comprend des informations de base sur les tâches telles que la description de la tâche, l'état actuel, la priorité et les métadonnées connexes.</p>
<p><strong>(4) local/ - Exécution locale et outils</strong></p>
<p>Le répertoire <code translate="no">local/</code> contient les fichiers principaux dont Claude Code a besoin pour fonctionner sur votre machine.</p>
<p>Cela inclut l'exécutable en ligne de commande <code translate="no">claude</code> et le répertoire <code translate="no">node_modules/</code> qui contient ses dépendances d'exécution. En gardant ces composants locaux, Claude Code peut fonctionner de manière indépendante, sans dépendre de services externes ou d'installations sur l'ensemble du système.</p>
<p><strong>（5）Additional Supporting Directories</strong></p>
<ul>
<li><p><strong>shell-snapshots/ :</strong> Stocke des instantanés de l'état de la session shell (comme le répertoire courant et les variables d'environnement), ce qui permet de revenir en arrière dans les opérations shell.</p></li>
<li><p><strong>plans/ :</strong> Stocke les plans d'exécution générés par le mode Plan (par exemple, la décomposition étape par étape des tâches de programmation à plusieurs étapes).</p></li>
<li><p><strong>statsig/ :</strong> Met en cache les configurations des indicateurs de fonctionnalités (par exemple, si de nouvelles fonctionnalités sont activées) afin de réduire le nombre de requêtes répétées.</p></li>
<li><p><strong>telemetry/ :</strong> Stocke des données télémétriques anonymes (telles que la fréquence d'utilisation des fonctionnalités) afin d'optimiser le produit.</p></li>
<li><p><strong>debug/ :</strong> Stocke les journaux de débogage (y compris les piles d'erreurs et les traces d'exécution) pour faciliter le dépannage.</p></li>
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
    </button></h2><p>Après avoir creusé la façon dont Claude Code stocke et gère tout localement, l'image devient assez claire : l'outil semble stable parce que les fondations sont solides. Rien d'extravagant - juste une ingénierie réfléchie. Chaque projet a son propre espace, chaque action est notée et les modifications de fichiers sont sauvegardées avant que quoi que ce soit ne change. C'est le genre de conception qui fait tranquillement son travail et vous permet de vous concentrer sur le vôtre.</p>
<p>Ce que j'aime le plus, c'est qu'il n'y a rien de mystique ici. Claude Code fonctionne bien parce que les bases sont bien faites. Si vous avez déjà essayé de construire un agent qui touche de vrais fichiers, vous savez à quel point il est facile pour les choses de s'effondrer - les états se mélangent, les crashs effacent les progrès, et l'annulation devient une devinette. Claude Code évite tout cela grâce à un modèle de stockage simple, cohérent et difficile à casser.</p>
<p>Pour les équipes qui développent des agents d'intelligence artificielle locaux ou sur site, en particulier dans des environnements sécurisés, cette approche montre comment un stockage et une persistance solides rendent les outils d'intelligence artificielle fiables et pratiques pour le développement quotidien.</p>
<p>Si vous concevez des agents d'IA locaux ou sur site et souhaitez discuter plus en détail de l'architecture de stockage, de la conception des sessions ou du rollback sécurisé, n'hésitez pas à rejoindre notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a>. Vous pouvez également réserver un entretien individuel de 20 minutes dans le cadre des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> pour obtenir des conseils personnalisés.</p>
