---
id: claude-code-context-management-tools.md
title: 7 meilleurs outils open-source pour la gestion du contexte du code Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/claude_code_context_management_tools_16_9fdd81ad02.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  Les longues sessions de code Claude perdent rapidement du signal. Apprenez 7
  outils pour réduire le bruit du terminal, la récupération du code, la sortie
  des outils, la mémoire et l'utilisation des jetons.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Vous pouvez donner à Claude Code une fenêtre contextuelle de 1 million de jetons et obtenir des réponses moins bonnes au fil du temps. Le problème n'est pas seulement la taille du contexte. Il s'agit de la qualité du contexte.</p>
<p>Les sessions de Claude Code se dégradent lorsque les journaux de terminal, les sorties brutes des outils, les lectures répétées de fichiers, les réponses verbeuses et l'historique des projets oubliés se disputent l'attention. Dans les flux de travail d'agent de longue durée, ce bruit se transforme en une boucle : le modèle perd le fil, vous ajoutez d'autres tours pour fixer la réponse, et ces tours supplémentaires ajoutent encore plus de bruit.</p>
<p>Il s'agit d'une <strong>défocalisation du contexte</strong>: le modèle a suffisamment de place pour contenir des informations, mais les informations importantes sont enfouies dans un contexte à faible signal. Des fenêtres plus grandes peuvent permettre d'ignorer plus facilement ce phénomène, car les développeurs cessent de réfléchir attentivement à ce qui entre dans l'invite.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>Diagramme de mise en cache des invites montrant comment des préfixes réutilisés peuvent encore ajouter un contexte facturé d'un tour à l'autre.</span> </span></p>
<p>La mise en cache des invites peut réduire le coût des préfixes répétés, mais elle ne transforme pas la fenêtre de contexte en un tiroir à ordures. Vous payez toujours pour de nouveaux jetons et vous avez toujours besoin du modèle pour raisonner sur les bonnes informations.</p>
<p>Cet article passe en revue sept outils open-source qui s'attaquent à la défocalisation du contexte à différents niveaux : sortie du terminal, sortie de l'outil, navigation dans la base de code, lecture de fichiers, verbosité du modèle, récupération sémantique du code et mémoire intersession. Il explique également comment ces idées s'appliquent à la conception de <a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a>, à la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités vectorielles</a> et aux systèmes de récupération tels que Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Quelles sont les causes de la défocalisation du contexte du code Claude ?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>La perte de contexte de Claude Code provient généralement de cinq modes de défaillance : trop de texte d'instruction brut, des sorties d'outils bruyantes, l'exploration répétée de la base de code, de longues réponses au modèle et des trous de mémoire entre les sessions ou les agents.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Cinq causes de perte de contexte Claude Code : instructions redondantes, sorties d'outils bruyantes, recherches répétées dans la base de code, réponses longues et trous de mémoire.</span> </span></p>
<table>
<thead>
<tr><th>Mode de défaillance du contexte</th><th>A quoi cela ressemble dans le code Claude</th><th>Catégorie d'outil qui aide</th></tr>
</thead>
<tbody>
<tr><td>Les journaux du terminal sont bruyants</td><td><code translate="no">git</code>Les journaux des terminaux sont bruyants, <code translate="no">pytest</code>, <code translate="no">gh</code>, et les CLI des nuages déversent plus de texte que le modèle n'en a besoin.</td><td>Compression des sorties de CLI</td></tr>
<tr><td>Les sorties d'outils inondent la fenêtre</td><td>Les journaux de test, les dumps DOM et les sorties MCP entrent dans le chat sous forme de blocs bruts géants.</td><td>Le sandboxing des sorties d'outils</td></tr>
<tr><td>La navigation dans la base de code se répète</td><td>Claude énumère les répertoires, recherche, lit les fichiers et répète la même exploration à chaque session.</td><td>Graphique de code ou recherche sémantique</td></tr>
<tr><td>La lecture des fichiers est trop large</td><td>Le modèle lit un fichier entier alors qu'il n'a besoin que d'un symbole ou d'un résumé.</td><td>Lecture progressive du code</td></tr>
<tr><td>Claude parle trop</td><td>La réponse elle-même ajoute un contexte inutile pour les tours futurs.</td><td>Compression des réponses</td></tr>
<tr><td>La mémoire ne persiste pas</td><td>Vous réexpliquez les décisions du projet à chaque fois que vous commencez une nouvelle session.</td><td>La mémoire Markdown d'abord</td></tr>
</tbody>
</table>
<p>Une bonne pile de gestion de contexte devrait faire trois choses : garder les déchets à l'écart, récupérer la bonne connaissance du projet à la demande, et préserver les décisions durables à travers les sessions.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Quel outil de gestion de contexte Claude Code devriez-vous utiliser en premier ?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Commencez par la couche qui crée le plus de bruit dans votre flux de travail. Si c'est la sortie de votre terminal qui pose problème, commencez par RTK. Si Claude ne cesse de s'égarer dans un grand dépôt, commencez par claude-context ou code-review-graph. Si votre véritable problème est de réexpliquer les mêmes décisions tous les jours, commencez par memsearch.</p>
<table>
<thead>
<tr><th>Outil</th><th>Problème principal résolu</th><th>Meilleure adéquation</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Sortie de terminal bruyante des commandes courantes des développeurs.</td><td>Développeurs qui exécutent de nombreuses commandes CLI dans le code Claude.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Mode contextuel</a></td><td>Sorties massives d'outils bruts entrant dans la conversation principale.</td><td>Utilisateurs intensifs de Playwright, GitHub, log, ou MCP-tool.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Exploration aveugle de la base de code dans les grands dépôts.</td><td>Revues, analyse des dépendances et questions sur le rayon d'action.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Lecture complète de fichiers alors qu'un résumé des symboles suffirait.</td><td>Gros fichiers, recherches répétées de symboles, et lecture incrémentale du code.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">L'homme des cavernes</a></td><td>Les habitudes de Claude en matière de réponses verbeuses.</td><td>Utilisateurs qui veulent des résultats laconiques et un contexte futur plus petit.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-contexte</a></td><td>Ré-exploration de la base de code à chaque session.</td><td>Recherche sémantique de code à travers MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perdre la mémoire du projet à travers les sessions, les agents et les changements de modèles.</td><td>Projets de longue durée avec des décisions et des leçons durables.</td></tr>
</tbody>
</table>
<p>Les cinq premiers outils réduisent ce qui entre ou reste dans le contexte. Les deux derniers facilitent le rappel du contexte utile.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK compresse les commandes brutes avant que Claude ne les voie<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK est un proxy CLI qui réduit l'utilisation de jetons dans les commandes courantes des développeurs. Sa description sur GitHub indique qu'il réduit la consommation de jetons LLM de 60 à 90% pour les commandes de développement courantes, et qu'il est livré sous la forme d'un seul binaire Rust.</p>
<p>Dans l'utilisation quotidienne de Claude Code, les commandes telles que <code translate="no">git status</code>, <code translate="no">pytest</code>, et les listes de répertoires déversent souvent des informations d'environnement complètes et des descriptions d'état dans la fenêtre contextuelle. Le modèle n'a généralement besoin que d'une petite réponse : quels fichiers ont changé, quel test a échoué, où le PR est bloqué, ou quels fichiers clés existent dans le répertoire.</p>
<p>RTK se situe entre le shell et Claude. Il peut réécrire des commandes à l'aide de crochets de code Claude et renvoyer des sorties compressées.</p>
<p>Sortie brute <code translate="no">git status</code>:</p>
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
<p>Ce qui compte vraiment :</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Même chose avec <code translate="no">pytest</code>. La sortie brute est pleine de cas de passage et de bruit d'environnement :</p>
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
<p>Compressé, le signal est immédiat :</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK est le point de départ le plus simple lorsque le gonflement du contexte provient de commandes shell plutôt que de la récupération de code.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">Le Mode Contexte permet d'utiliser les sorties géantes de l'outil en dehors de la discussion principale.<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Mode est conçu pour les blocs bruts que les outils renvoient : journaux de test, instantanés du DOM du navigateur, charges utiles GitHub, sorties d'outils MCP et pages scannées. Sa description sur GitHub met en avant l'optimisation de la fenêtre contextuelle pour les agents de codage de l'IA et fait état d'une réduction de 98 % des sorties d'outils.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Carte du dépôt GitHub Context Mode montrant la sortie d'outils en bac à sable et le positionnement de l'optimisation du contexte.</span> </span></p>
<p>Son approche consiste à isoler les sorties d'outils volumineuses dans un bac à sable local et un index, puis à ne transmettre que des résumés et des poignées de récupération dans la conversation de Claude.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>Flux du mode contextuel montrant une sortie d'outil volumineuse passant par l'exécution du bac à sable, les index SQLite ou FTS, les résumés et les résultats de l'extraction.</span> </span></p>
<p>Ce flux est utile car un agent de codage a souvent besoin du nœud défaillant, du sélecteur cassé ou de la trace de pile pertinente, et non de l'ensemble du DOM ou de chaque ligne de test réussie. Le mode contextuel permet de conserver l'intégralité des résultats disponibles localement tout en évitant qu'ils ne dominent la conversation principale.</p>
<p>Cela ressemble à la façon dont les systèmes de <a href="https://zilliz.com/blog/hybrid-search-with-milvus">recherche hybrides</a> de production séparent le stockage de l'extraction. Vous conservez les données brutes dans un endroit durable, puis vous ne récupérez que la partie qui compte.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph cartographie la structure du code avant que Claude n'y navigue<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph aborde un problème différent : Claude n'a pas toujours besoin de plus de texte ; il a besoin d'une meilleure carte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Image du logo code-review-graph utilisée dans l'article original</span> </span></p>
<p>Dans un grand dépôt, une simple question peut déclencher une exploration coûteuse :</p>
<blockquote>
<p>Après avoir modifié cette logique de connexion, quels sont les fichiers et les tests affectés ?</p>
</blockquote>
<p>Sans graphe de code, le mouvement typique de Claude est :</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph pré-construit une carte structurelle de la base de code. Il utilise Tree-sitter pour analyser les fonctions, les classes, les importations, les relations d'appel, l'héritage et les dépendances des tests, puis écrit le graphe dans SQLite.</p>
<p>Cela le rend utile pour l'examen du code et l'analyse du rayon d'action. Au lieu de demander à Claude de redécouvrir le graphe de dépendance par des lectures répétées, vous le laissez d'abord interroger la structure.</p>
<p>Cette méthode est proche de la <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">recherche sémantique</a>, mais n'est pas identique. Un graphe structurel répond à la question "qu'est-ce qui dépend de quoi ?" La recherche sémantique répond à la question "quel code est conceptuellement lié à cette question ?". Dans les flux de travail réels d'assistance au code, vous avez souvent besoin des deux.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior donne à Claude des résumés de symboles avant les fichiers complets<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>L'idée de base de Token Savior est simple : ne pas envoyer le fichier complet par défaut. Envoyez d'abord un index ou un résumé des symboles, puis développez uniquement lorsque la tâche nécessite plus de détails.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Carte du dépôt GitHub de Token Savior montrant la description de son serveur MCP et les statistiques du projet</span> </span></p>
<p>Si vous demandez où un webhook de paiement est géré, le modèle n'a souvent pas besoin de toutes les lignes de tous les fichiers concernés. Il doit d'abord savoir si un fichier ou un symbole est pertinent.</p>
<p>Token Savior sert le code en couches :</p>
<table>
<thead>
<tr><th>Couche</th><th>Ce que Claude reçoit</th><th>Quand il s'étend</th></tr>
</thead>
<tbody>
<tr><td>Résumé</td><td>Index, noms des symboles et brèves descriptions.</td><td>Première réponse par défaut.</td></tr>
<tr><td>Extrait</td><td>Une petite section de code autour du symbole concerné.</td><td>Lorsque le résumé est probablement pertinent.</td></tr>
<tr><td>Fichier complet</td><td>Le contenu complet du fichier.</td><td>Uniquement lorsque l'édition ou un raisonnement approfondi l'exige.</td></tr>
</tbody>
</table>
<p>Cette méthode reflète la façon dont les développeurs lisent réellement le code. Vous scannez, confirmez la pertinence, puis n'ouvrez le fichier complet qu'en cas de nécessité. Cela ressemble également au modèle de récupération progressive utilisé dans les <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">applications RAG</a>: récupérer assez largement pour s'orienter, puis restreindre le contexte avant la génération.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">L'homme des cavernes réduit l'encombrement des réponses de Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
<p>Caveman est une compétence/un module d'extension du code Claude qui supprime les phrases de remplissage, les plaisanteries, les phrases enveloppantes, les surexplications et les structures répétitives. L'objectif n'est pas de supprimer des connaissances, mais de rendre la réponse plus dense.</p>
<p>Sans Caveman :</p>
<blockquote>
<p>La raison pour laquelle votre composant React effectue un nouveau rendu est probablement...</p>
</blockquote>
<p>Avec Caveman :</p>
<blockquote>
<p>Nouvel objet ref à chaque rendu. Inline object prop = new ref = re-render. Wrap in useMemo.</p>
</blockquote>
<p>Ceci est important parce que les propres réponses de Claude deviennent le contexte futur. Si chaque réponse comprend une longue explication, le tour suivant commence avec plus de texte qu'il n'en a besoin. Des réponses plus courtes peuvent améliorer le prochain tour autant qu'elles améliorent le tour actuel.</p>
<p>Pour les équipes qui réfléchissent à l'<a href="https://zilliz.com/blog/context-engineering-for-ai-agents">ingénierie du contexte pour les agents d'intelligence artificielle</a>, Caveman est un rappel que la politique de sortie fait partie de la politique de contexte.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context ajoute la recherche sémantique de code à travers MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context résout le problème de l'exploration répétée de la base de code grâce à la recherche sémantique. Il indexe un référentiel, stocke les morceaux de code dans une base de données vectorielle, et expose la recherche à travers le <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Dépôt Claude Context présenté sur GitHub Tendance dans l'article original</span> </span></p>
<p>Dans une grosse base de code, vous posez constamment à Claude des questions telles que :</p>
<blockquote>
<p>Aidez-moi à trouver quelles parties du code pourraient être liées à ce bogue.</p>
</blockquote>
<p>Sans couche de récupération, l'approche par défaut de Claude est souvent :</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context déplace ce travail dans une couche de récupération. Elle découpe le référentiel en morceaux, génère des embeddings, les stocke dans un <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">index de code soutenu par Milvus</a>, et récupère les morceaux de code pertinents avant que le modèle ne commence à lire les fichiers à l'aveugle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>Flux claude-contexte montrant le découpage de la base de code, les encastrements, la base de données vectorielle et la recherche hybride, l'extraction du code pertinent et l'injection du contexte de Claude</span> </span></p>
<p>C'est ici que les outils de codage de l'IA commencent à ressembler à des systèmes de recherche. Vous avez besoin d'un découpage, d'une intégration, de métadonnées, d'une correspondance lexicale, d'un classement et d'une fraîcheur. Il s'agit des mêmes éléments de base que ceux qui sous-tendent la <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">recherche RAG de production</a>, le <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">routage de la recherche hybride</a> et la <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">sélection du modèle d'intégration</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch conserve la mémoire utile à travers les sessions et les agents<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch s'attaque à l'autre aspect du problème : non pas ce qu'il faut oublier, mais comment se souvenir de ce qui est important.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>Image du logo de memsearch tirée de l'article original</span> </span></p>
<p>Imaginez que vous disiez à Claude le lundi :</p>
<blockquote>
<p>Notre webhook ne peut pas réessayer en cas d'échec - les événements qui ont échoué doivent être placés dans une file d'attente de lettres mortes.</p>
</blockquote>
<p>Le mercredi, vous ouvrez une nouvelle session et demandez :</p>
<blockquote>
<p>Que pouvons-nous encore optimiser dans la couche webhook ?</p>
</blockquote>
<p>Sans mémoire durable, Claude traite la décision de lundi comme si elle n'avait jamais eu lieu. Vous lui expliquez à nouveau.</p>
<p>memsearch stocke la mémoire sous forme de fichiers Markdown locaux, lisibles par l'homme, et utilise Milvus comme index de récupération reconstructible. Cette conception permet à la mémoire d'être éditée par les humains tout en la rendant consultable par les agents.</p>
<p>Au moment de la récupération, memsearch utilise le rappel progressif : rechercher d'abord, développer si nécessaire, puis descendre jusqu'à la transcription originale seulement si nécessaire.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>Flux de récupération progressive de memsearch montrant la recherche, l'expansion, la transcription et le retour résumé à la conversation principale.</span> </span></p>
<p>Ce modèle Markdown-first est utile pour les équipes qui travaillent sur des sessions, des modèles et des agents. Il s'associe aussi naturellement à la <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">mémoire à long terme des agents d'IA</a>, à la <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">mémoire partagée des agents multiples</a> et au problème plus large de la prévention du <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">pourrissement du contexte dans les systèmes d'agents</a>.</p>
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
    </button></h2><p>Les sept outils sont complémentaires et non interchangeables. Utilisez-les comme des couches.</p>
<table>
<thead>
<tr><th>Couche</th><th>Utiliser ces outils</th><th>Pourquoi</th></tr>
</thead>
<tbody>
<tr><td>Supprimer le bruit de commande</td><td>RTK</td><td>Compresser les données de sortie des terminaux avant qu'elles ne parviennent à Claude.</td></tr>
<tr><td>Mettre dans un bac à sable les sorties brutes des outils</td><td>Mode Contexte</td><td>Garder les gros logs, les DOMs, et les charges utiles des outils en dehors de la conversation principale.</td></tr>
<tr><td>Cartographier la structure du code</td><td>graphique d'examen du code</td><td>Répondre aux questions sur les dépendances et le rayon d'action sans lire les fichiers à l'aveugle.</td></tr>
<tr><td>Lire le code progressivement</td><td>Sauveur de jetons</td><td>Commencez par des résumés de symboles, puis développez seulement si nécessaire.</td></tr>
<tr><td>Compresser les réponses de Claude</td><td>Homme des cavernes</td><td>Empêcher que la production du modèle ne devienne un futur gonflement du contexte.</td></tr>
<tr><td>Récupérer le code pertinent</td><td>claude-contexte</td><td>Utiliser la recherche sémantique et hybride de code au lieu de boucles grep répétées.</td></tr>
<tr><td>Réutiliser les décisions durables</td><td>memsearch</td><td>Rappeler l'historique du projet à travers les sessions, les agents et les changements de modèle.</td></tr>
</tbody>
</table>
<p>Un ordre de déploiement pratique est le suivant :</p>
<ol>
<li><strong>Éliminez d'abord les bruits évidents.</strong> Ajouter RTK ou Context Mode si la sortie de l'interpréteur de commandes et les charges utiles des outils dominent votre contexte.</li>
<li><strong>Corriger la navigation dans le référentiel.</strong> Ajouter code-review-graph pour la structure ou claude-context pour la recherche sémantique de code.</li>
<li><strong>Contrôler ce qui reste.</strong> Utiliser Token Savior et Caveman pour garder les lectures de fichiers et les réponses de modèles compactes.</li>
<li><strong>Préserver les connaissances durables.</strong> Utilisez memsearch lorsque les explications répétées deviennent un goulot d'étranglement.</li>
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
<li>Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Milvus Discord</a> pour poser des questions et comparer les modèles de gestion du contexte avec d'autres développeurs.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite Milvus Office Hours</a> si vous souhaitez obtenir de l'aide pour concevoir une couche de récupération pour le code, la mémoire ou les charges de travail RAG.</li>
<li>Si vous préférez ignorer l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour commencer.</li>
</ul>
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
    </button></h2><p><strong>Comment puis-je réduire l'utilisation des jetons Claude Code sans perdre de contexte utile ?</strong></p>
<p>Commencez par compresser les entrées les plus bruyantes : les sorties de terminal, les charges utiles brutes des outils et les lectures de code répétées. Ensuite, ajoutez des outils d'extraction tels que claude-context ou code-review-graph pour que Claude puisse extraire le code pertinent au lieu d'explorer le dépôt à partir de zéro.</p>
<p><strong>Dois-je utiliser claude-context ou code-review-graph pour un gros dépôt ?</strong></p>
<p>Utilisez claude-context lorsque vous avez besoin d'une recherche sémantique de code, en particulier lorsque vous ne connaissez pas le nom exact du fichier ou du symbole. Utilisez code-review-graph lorsque vous avez besoin de réponses structurelles telles que les relations d'appel, les importations, les dépendances de test et le rayon d'action de la révision.</p>
<p><strong>La mémoire est-elle différente de la recherche de code dans Claude Code ?</strong></p>
<p>Oui. La recherche de code permet de trouver les fichiers ou les symboles pertinents du projet. La récupération de la mémoire rappelle les décisions durables, les préférences de l'utilisateur, l'historique du débogage et les leçons entre les sessions. memsearch se concentre sur la mémoire ; claude-context se concentre sur la récupération du code.</p>
<p><strong>Ces outils remplacent-ils la mise en cache de l'invite ou une fenêtre contextuelle plus grande ?</strong></p>
<p>Non. La mise en cache des invites et les grandes fenêtres contextuelles permettent de réduire la capacité et les coûts, mais elles ne décident pas des informations qui méritent l'attention. Les outils de gestion du contexte améliorent la qualité et la densité de ce qui entre dans le modèle en premier lieu.</p>
