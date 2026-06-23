---
id: claude-code-context-management-tools.md
title: >
  Les 7 meilleurs outils open source pour la gestion du contexte des codes
  Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Les longues sessions de programmation en Claude Code perdent rapidement le
  signal. Découvrez 7 outils pour réduire le bruit du terminal, récupérer du
  code, gérer la sortie des outils, optimiser la mémoire et l'utilisation des
  jetons.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Vous pouvez fournir à Claude Code une fenêtre de contexte d’un million de tokens et obtenir malgré tout des réponses de moins en moins pertinentes au fil du temps. Le problème ne réside pas uniquement dans la taille du contexte, mais aussi dans sa qualité.</p>
<p>Les sessions avec Claude Code se dégradent lorsque les journaux de terminal, les sorties brutes des outils, les lectures répétées de fichiers, les réponses trop détaillées et l’historique du projet oublié se disputent tous l’attention du modèle. Dans les workflows d’agents de longue durée, ce bruit se transforme en boucle : le modèle perd le fil, vous ajoutez des tours supplémentaires pour corriger la réponse, et ces tours supplémentaires ajoutent encore plus de bruit.</p>
<p>C’est ce qu’on appelle <strong>la « perte de focalisation du contexte »</strong>: le modèle dispose de suffisamment d’espace pour stocker des informations, mais les informations importantes sont noyées sous un contexte à faible signal. Des fenêtres plus grandes peuvent rendre ce phénomène plus facile à ignorer, car les développeurs cessent de réfléchir attentivement à ce qu’ils saisissent dans la prompt.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Schéma de mise en cache des invites montrant comment les préfixes réutilisés peuvent tout de même ajouter du contexte facturé d’un tour à l’autre</span>
  
 </span></p>
<p>La mise en cache des invites peut réduire le coût des préfixes répétés, mais elle ne transforme pas la fenêtre contextuelle en fourre-tout. Vous payez toujours pour les nouveaux tokens, et vous avez toujours besoin que le modèle raisonne à partir des bonnes informations.</p>
<p>Cet article passe en revue sept outils open source qui s’attaquent à la perte de contexte à différents niveaux : sortie du terminal, sortie des outils, navigation dans la base de code, lecture de fichiers, verbosité du modèle, recherche sémantique de code et mémoire intersessionnelle. Il explique également comment ces concepts s’appliquent à la conception <a href="https://zilliz.com/learn/what-is-vector-database">de bases de données vectorielles</a>, à <a href="https://zilliz.com/learn/vector-similarity-search">la recherche de similarité vectorielle</a> et aux systèmes de recherche tels que Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Quelles sont les causes de la perte de contexte dans Claude Code ?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>La perte de contexte de Claude Code provient généralement de cinq modes de défaillance : un excès de texte d’instructions brutes, des sorties d’outils bruitées, l’exploration répétée de la base de code, des réponses longues du modèle et des lacunes de mémoire entre les sessions ou les agents.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Les cinq causes de la perte de contexte de Claude Code : instructions redondantes, sorties d’outils désordonnées, récupération répétée de la base de code, réponses longues et lacunes de mémoire</span>
  
 </span></p>
<table>
<thead>
<tr><th>Mode de défaillance du contexte</th><th>À quoi cela ressemble-t-il dans Claude Code ?</th><th>Catégorie d’outils utiles</th></tr>
</thead>
<tbody>
<tr><td>Les journaux de terminal sont encombrés</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, et les interfaces CLI cloud génèrent plus de texte que ce dont le modèle a besoin.</td><td>Compression de la sortie des interfaces CLI</td></tr>
<tr><td>Les sorties des outils inondent la fenêtre</td><td>Les journaux de test, les dumps DOM et les sorties MCP apparaissent dans le chat sous forme d’énormes blocs bruts.</td><td>Isolation des sorties des outils</td></tr>
<tr><td>Navigation répétitive dans la base de code</td><td>Claude répertorie les répertoires, effectue des recherches avec grep, lit des fichiers et répète la même exploration à chaque session.</td><td>Graphique de code ou recherche sémantique</td></tr>
<tr><td>La lecture des fichiers est trop large</td><td>Le modèle lit un fichier entier alors qu’un seul symbole ou un résumé aurait suffi.</td><td>Lecture progressive du code</td></tr>
<tr><td>Claude parle trop</td><td>La réponse elle-même ajoute un contexte inutile pour les tours de parole suivants.</td><td>Compression des réponses</td></tr>
<tr><td>La mémoire n’est pas conservée</td><td>Vous réexpliquez les décisions relatives au projet à chaque fois que vous commencez une nouvelle session.</td><td>Mémoire « Markdown-first »</td></tr>
</tbody>
</table>
<p>Un bon système de gestion du contexte doit remplir trois fonctions : filtrer les informations superflues, récupérer les connaissances pertinentes sur le projet à la demande et conserver les décisions durables d’une session à l’autre.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Quel outil de contexte Claude Code devriez-vous utiliser en premier ?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Commencez par la couche qui génère le plus de bruit dans votre flux de travail. Si le problème vient de la sortie de votre terminal, commencez par RTK. Si Claude ne cesse d’errer dans un grand dépôt, commencez par claude-context ou code-review-graph. Si votre véritable casse-tête est de devoir réexpliquer les mêmes décisions chaque jour, commencez par memsearch.</p>
<table>
<thead>
<tr><th>Outil</th><th>Problème principal qu’il résout</th><th>Meilleure utilisation</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Sortie de terminal encombrée par les commandes courantes des développeurs.</td><td>Développeurs qui exécutent de nombreuses commandes CLI dans Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Mode Contexte</a></td><td>Flux massif de données brutes provenant d’outputs d’outils et s’introduisant dans la conversation principale.</td><td>Utilisateurs intensifs de Playwright, GitHub, des journaux ou des outils MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Exploration à l'aveugle de bases de code dans de grands dépôts.</td><td>Revues de code, analyse des dépendances et questions relatives au « blast radius ».</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Lecture intégrale des fichiers alors qu’un résumé des symboles suffirait.</td><td>Fichiers volumineux, recherches répétées de symboles et lecture incrémentielle du code.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Les habitudes de Claude en matière de réponses trop détaillées.</td><td>Les utilisateurs qui souhaitent un résultat concis et un contexte futur plus restreint.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Réexploration de la base de code à chaque session.</td><td>Recherche sémantique de code via MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perte de la mémoire du projet d’une session à l’autre, entre les agents et lors des changements de modèle.</td><td>Projets de longue durée avec des décisions et des enseignements durables.</td></tr>
</tbody>
</table>
<p>Les cinq premiers outils réduisent ce qui entre ou reste dans le contexte. Les deux derniers facilitent la récupération du contexte utile.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK compresse la sortie brute des commandes avant que Claude ne la voie<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK est un proxy CLI permettant de réduire l’utilisation de tokens par les commandes courantes des développeurs. Selon sa description sur GitHub, il réduit la consommation de tokens des LLM de 60 à 90 % pour les commandes de développement courantes, et il est fourni sous la forme d’un seul binaire Rust.</p>
<p>Dans l’utilisation quotidienne de Claude Code, des commandes telles que ` <code translate="no">git status</code>`, ` <code translate="no">pytest</code>` et les listes de répertoires affichent souvent l’intégralité des informations d’environnement et des descriptions d’état dans la fenêtre de contexte. Le modèle n’a généralement besoin que d’une réponse plus concise : quels fichiers ont été modifiés, quel test a échoué, où la pull request est bloquée, ou quels fichiers clés existent dans le répertoire.</p>
<p>RTK s’intercale entre le shell et Claude. Il peut réécrire les commandes via les hooks de Claude Code et renvoyer une sortie condensée.</p>
<p>Sortie brute d’ <code translate="no">git status</code>:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>Ce qui importe réellement :</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Même chose avec ` <code translate="no">pytest</code>`. La sortie brute regorge de cas réussis et de bruit d’environnement :</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Une fois compressé, le signal est immédiat :</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK est le point de départ le plus simple lorsque le gonflement de votre contexte provient de commandes de shell plutôt que de la récupération de code.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Le mode Contexte isole les sorties volumineuses des outils en dehors de la fenêtre de discussion principale<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Le mode Contexte est conçu pour les blocs bruts renvoyés par les outils : journaux de test, instantanés DOM du navigateur, données GitHub, sorties d’outils MCP et pages extraites. Sa description sur GitHub met en avant l’optimisation de la fenêtre de contexte pour les agents de codage IA et fait état d’une réduction de 98 % des sorties d’outils.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Fiche du dépôt GitHub du mode Contexte montrant la mise en sandbox des sorties d’outils et le positionnement de l’optimisation du contexte</span>
  
 </span></p>
<p>Son approche consiste à isoler les sorties volumineuses des outils dans un bac à sable local et à les indexer, puis à ne transmettre à la conversation Claude que des résumés et des identifiants de récupération.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Flux de Context Mode illustrant le parcours des sorties volumineuses des outils : exécution en sandbox, index SQLite ou FTS, résumés et résultats de recherche</span>
  
 </span></p>
<p>Ce flux est utile car un agent de codage a souvent besoin du nœud défaillant, du sélecteur défectueux ou de la trace de pile pertinente, et non de l’intégralité du DOM ou de chaque ligne de test réussie. Le « Context Mode » conserve la sortie complète disponible localement tout en l’empêchant de dominer la conversation principale.</p>
<p>Ce principe est similaire à la manière dont les systèmes <a href="https://zilliz.com/blog/hybrid-search-with-milvus">de recherche hybrides</a> en production séparent le stockage de la récupération. Vous conservez les données brutes dans un emplacement durable, puis vous ne récupérez que la partie qui vous intéresse.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph cartographie la structure du code avant que Claude ne l’explore<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph répond à un problème différent : Claude n’a pas toujours besoin de plus de texte ; il a besoin d’une meilleure cartographie.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Image du logo de code-review-graph utilisée dans l’article original</span>
  
 </span></p>
<p>Dans un grand référentiel, une simple question peut déclencher une exploration coûteuse :</p>
<blockquote>
<p>Après avoir modifié cette logique de connexion, quels fichiers et tests sont concernés ?</p>
</blockquote>
<p>Sans graphe de code, la démarche habituelle de Claude est la suivante :</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph pré-construit une carte structurelle de la base de code. Il utilise Tree-sitter pour analyser les fonctions, les classes, les importations, les relations d’appel, l’héritage et les dépendances de test, puis enregistre le graphe dans SQLite.</p>
<p>Cela s’avère utile pour la révision de code et l’analyse de l’impact. Au lieu de demander à Claude de redécouvrir le graphe de dépendances par des lectures répétées, on lui permet d’interroger d’abord la structure.</p>
<p>Cette approche est proche de <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">la recherche sémantique</a>, mais n’est pas identique. Un graphe structurel répond à la question « qu’est-ce qui dépend de quoi ? », tandis que la recherche sémantique répond à la question « quel code est conceptuellement lié à cette question ? ». Dans les workflows réels d’assistance au code, on a souvent besoin des deux.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior fournit à Claude des résumés de symboles avant les fichiers complets<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>L’idée centrale de Token Savior est simple : ne pas envoyer le fichier complet par défaut. Envoyer d’abord un index ou un résumé des symboles, puis ne développer le contenu que lorsque la tâche nécessite plus de détails.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Fiche du dépôt GitHub de Token Savior présentant la description de son serveur MCP et les statistiques du projet</span>
  
 </span></p>
<p>Si vous demandez où est géré un webhook de paiement, le modèle n’a souvent pas besoin de chaque ligne de chaque fichier associé. Il doit d’abord savoir si un fichier ou un symbole est pertinent.</p>
<p>Token Savior fournit le code par couches :</p>
<table>
<thead>
<tr><th>Couche</th><th>Ce que Claude reçoit</th><th>Lorsqu’il se développe</th></tr>
</thead>
<tbody>
<tr><td>Résumé</td><td>Index, noms de symboles et brèves descriptions.</td><td>Première réponse par défaut.</td></tr>
<tr><td>Extrait</td><td>Une petite section de code autour du symbole concerné.</td><td>Lorsque le résumé est susceptible d'être pertinent.</td></tr>
<tr><td>Fichier complet</td><td>Contenu complet du fichier.</td><td>Uniquement lorsque l'édition ou un raisonnement approfondi l'exige.</td></tr>
</tbody>
</table>
<p>Cela reflète la manière dont les développeurs lisent réellement le code. Vous parcourez le texte, vérifiez la pertinence, puis n'ouvrez le fichier complet qu'en cas de nécessité. Cela ressemble également au modèle de récupération progressive utilisé dans <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">les applications RAG</a>: récupérer suffisamment d'informations pour s'orienter, puis affiner le contexte avant la génération.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman réduit le volume excessif des réponses de Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>La plupart des outils contextuels se concentrent sur ce qui entre dans le modèle. Caveman cible ce que Claude produit.</p>
<p>Caveman est une compétence/un plugin Claude Code qui élimine les remplissages, les formules de politesse, les phrases d’encadrement, les explications superflues et les structures répétitives. L’objectif n’est pas de supprimer des connaissances, mais de rendre la réponse plus concise.</p>
<p>Sans Caveman :</p>
<blockquote>
<p>La raison pour laquelle votre composant React se réaffiche est probablement que…</p>
</blockquote>
<p>Avec Caveman :</p>
<blockquote>
<p>Une nouvelle référence d’objet à chaque rendu. Une propriété d’objet en ligne = une nouvelle référence = un nouveau rendu. Enveloppez-la dans useMemo.</p>
</blockquote>
<p>C’est important car les réponses de Claude elles-mêmes deviennent le contexte futur. Si chaque réponse comprend une longue explication, le tour suivant commence avec plus de texte que nécessaire. Des réponses plus courtes peuvent améliorer le tour suivant autant qu’elles améliorent le tour actuel.</p>
<p>Pour les équipes qui réfléchissent à <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">l’ingénierie du contexte pour les agents IA</a>, Caveman rappelle que la politique de sortie fait partie intégrante de la politique de contexte.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context ajoute la recherche sémantique de code via le MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context résout le problème de l’exploration répétée de la base de code grâce à la recherche sémantique. Il indexe un dépôt, stocke des extraits de code dans une base de données vectorielle et permet d’effectuer des recherches via le <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Dépôt Claude Context présenté sur GitHub En vogue dans l’article original</span>
  
 </span></p>
<p>Dans une base de code volumineuse, vous posez constamment à Claude des questions telles que :</p>
<blockquote>
<p>« Aide-moi à déterminer quelles parties du code pourraient être liées à ce bug. »</p>
</blockquote>
<p>Sans couche de recherche, l’approche par défaut de Claude est souvent la suivante :</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context transfère ce travail vers une couche de recherche. Il découpe le référentiel en segments, génère des représentations vectorielles, les stocke dans un <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">index de code basé sur Milvus</a>, puis récupère les segments de code pertinents avant que le modèle ne commence à lire les fichiers à l’aveugle.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>Flux de claude-context illustrant le découpage de la base de code, les représentations, la base de données vectorielle et la recherche hybride, la récupération du code pertinent et l’injection du contexte dans Claude</span>
  
 </span></p>
<p>C’est là que les outils de codage basés sur l’IA commencent à ressembler à des systèmes de recherche. Il faut du découpage en segments, des représentations vectorielles, des métadonnées, la correspondance lexicale, le classement et l’actualité des données. Ce sont les mêmes éléments constitutifs qui sous-tendent <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">la recherche RAG en production</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">le routage de la recherche hybride</a> et <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">la sélection des modèles de représentations vectorielles</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch conserve une mémoire utile d’une session à l’autre et d’un agent à l’autre<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch s’attaque à l’aspect inverse du problème : non pas ce qu’il faut oublier, mais comment se souvenir de ce qui compte.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>Image du logo de memsearch tirée de l’article original</span>
  
 </span></p>
<p>Imaginez que vous disiez à Claude lundi :</p>
<blockquote>
<p>Notre webhook ne peut pas réessayer en cas d’échec — les événements ayant échoué doivent être placés dans une file d’attente de messages perdus.</p>
</blockquote>
<p>Le mercredi, vous ouvrez une nouvelle session et demandez :</p>
<blockquote>
<p>Que pouvons-nous optimiser d’autre au niveau de la couche webhook ?</p>
</blockquote>
<p>Sans mémoire persistante, Claude considère la décision de lundi comme si elle n’avait jamais eu lieu. Vous lui expliquez à nouveau.</p>
<p>memsearch stocke la mémoire sous forme de fichiers Markdown locaux lisibles par l’homme et utilise Milvus comme index de recherche reconstruisable. Cette conception permet de conserver la mémoire modifiable par les humains tout en la rendant consultable par les agents.</p>
<p>Au moment de la récupération, memsearch utilise un rappel progressif : recherche d’abord, expansion si nécessaire, puis exploration de la transcription originale uniquement lorsque cela s’avère indispensable.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Flux de recherche progressive de memsearch illustrant la recherche, l’extension, la transcription et le retour résumé à la conversation principale</span>
  
 </span></p>
<p>Ce modèle « Markdown d’abord » est utile pour les équipes travaillant sur plusieurs sessions, modèles et agents. Il s’associe également naturellement à <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">la mémoire à long terme des agents IA</a>, à <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">la mémoire partagée entre plusieurs agents</a> et au problème plus large de la prévention <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">de la « dégradation du contexte » dans les systèmes d’agents</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Comment ces outils fonctionnent-ils ensemble ?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Ces sept outils sont complémentaires, et non interchangeables. Utilisez-les comme des couches.</p>
<table>
<thead>
<tr><th>Couche</th><th>Utilisez ces outils</th><th>Pourquoi</th></tr>
</thead>
<tbody>
<tr><td>Supprimer le bruit de commande</td><td>RTK</td><td>Compressez les données de sortie volumineuses du terminal avant qu'elles n'atteignent Claude.</td></tr>
<tr><td>Mettre en bac à sable la sortie brute de l'outil</td><td>Mode Contexte</td><td>Conserver les journaux volumineux, les DOM et les données des outils en dehors de la conversation principale.</td></tr>
<tr><td>Cartographier la structure du code</td><td>code-review-graph</td><td>Répondez aux questions relatives aux dépendances et à la portée des impacts sans avoir à lire les fichiers à l'aveugle.</td></tr>
<tr><td>Lisez le code progressivement</td><td>Token Savior</td><td>Commencez par les résumés de symboles, puis développez-les uniquement si nécessaire.</td></tr>
<tr><td>Compressez les réponses de Claude</td><td>Caveman</td><td>Empêchez les sorties du modèle lui-même de surcharger le contexte futur.</td></tr>
<tr><td>Récupérer le code pertinent</td><td>claude-context</td><td>Utiliser la recherche sémantique et hybride de code plutôt que des boucles grep répétitives.</td></tr>
<tr><td>Réutiliser les décisions durables</td><td>memsearch</td><td>Récupérer l'historique du projet d'une session à l'autre, d'un agent à l'autre et lors des changements de modèle.</td></tr>
</tbody>
</table>
<p>Voici un ordre de déploiement pratique :</p>
<ol>
<li><strong>Éliminez d’abord le bruit évident.</strong> Ajoutez RTK ou le mode Contexte si les sorties du shell et les charges utiles des outils dominent votre contexte.</li>
<li><strong>Optimisez la navigation dans le référentiel.</strong> Ajoutez « code-review-graph » pour la structure ou « claude-context » pour la recherche sémantique de code.</li>
<li><strong>Contrôlez ce qui reste.</strong> Utilisez « Token Savior » et « Caveman » pour réduire la taille des lectures de fichiers et des réponses du modèle.</li>
<li><strong>Préservez les connaissances durables.</strong> Utilisez memsearch lorsque les explications répétées deviennent un goulot d’étranglement.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Restez en contact<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Milvus sur Discord</a> pour poser des questions et comparer vos modèles de gestion de contexte avec ceux d’autres développeurs.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite « Milvus Office Hours</a> » si vous avez besoin d’aide pour concevoir une couche de recherche pour le code, la mémoire ou les charges de travail RAG.</li>
<li>Si vous préférez éviter la mise en place de l’infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus géré) propose une offre gratuite pour vous lancer.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Foire aux questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Comment réduire l’utilisation de jetons Claude Code sans perdre de contexte utile ?</strong></p>
<p>Commencez par compresser les entrées les plus « bruyantes » : les sorties de terminal, les données brutes des outils et les lectures de code répétées. Ajoutez ensuite des outils de récupération tels que claude-context ou code-review-graph afin que Claude puisse extraire le code pertinent au lieu d’explorer le dépôt à partir de zéro.</p>
<p><strong>Dois-je utiliser claude-context ou code-review-graph pour un grand dépôt ?</strong></p>
<p>Utilisez claude-context lorsque vous avez besoin d’une recherche sémantique de code, en particulier lorsque vous ne connaissez pas le nom exact du fichier ou du symbole. Utilisez code-review-graph lorsque vous avez besoin de réponses structurelles telles que les relations d’appel, les importations, les dépendances de test et le rayon d’impact de la révision.</p>
<p><strong>La fonction « mémoire » est-elle différente de la recherche de code dans Claude Code ?</strong></p>
<p>Oui. La recherche de code permet de trouver des fichiers de projet ou des symboles pertinents. La recherche de mémoire permet de rappeler des décisions durables, des préférences utilisateur, l’historique de débogage et des leçons tirées de sessions précédentes. memsearch se concentre sur la mémoire ; claude-context se concentre sur la recherche de code.</p>
<p><strong>Ces outils remplacent-ils la mise en cache des invites ou une fenêtre de contexte plus large ?</strong></p>
<p>Non. La mise en cache des invites et les grandes fenêtres de contexte facilitent la gestion de la capacité et des coûts, mais elles ne déterminent pas quelles informations méritent une attention particulière. Les outils de gestion du contexte améliorent avant tout la qualité et la densité des données entrantes dans le modèle. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
