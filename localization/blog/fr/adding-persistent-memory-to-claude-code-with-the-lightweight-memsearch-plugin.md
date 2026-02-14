---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: Ajouter une mémoire persistante au code Claude avec le plugin léger memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Donnez à Claude Code une mémoire à long terme avec memsearch ccplugin.
  Stockage Markdown léger et transparent, récupération sémantique automatique,
  pas de surcharge de jetons.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Nous avons récemment construit et mis en libre accès <a href="https://github.com/zilliztech/memsearch">memsearch</a>, une bibliothèque de mémoire à long terme autonome et prête à l'emploi qui donne à n'importe quel agent une mémoire persistante, transparente et modifiable par l'homme. Elle utilise la même architecture de mémoire sous-jacente qu'OpenClaw, mais sans le reste de la pile OpenClaw. Cela signifie que vous pouvez l'intégrer dans n'importe quel cadre d'agent (Claude, GPT, Llama, agents personnalisés, moteurs de flux de travail) et ajouter instantanément une mémoire durable et interrogeable. <em>(Si vous souhaitez une plongée en profondeur dans le fonctionnement de memsearch, nous avons écrit un</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>article séparé ici</em></a><em>).</em></p>
<p>Dans la plupart des flux de travail des agents, memsearch fonctionne exactement comme prévu. Mais le <strong>codage agentique</strong> est une autre histoire. Les sessions de codage sont longues, les changements de contexte sont constants, et les informations qui méritent d'être conservées s'accumulent pendant des jours ou des semaines. Ce volume et cette volatilité exposent les faiblesses des systèmes de mémoire typiques des agents, y compris memsearch. Dans les scénarios de codage, les schémas de recherche diffèrent suffisamment pour que nous ne puissions pas simplement réutiliser l'outil existant tel quel.</p>
<p>Pour y remédier, nous avons construit un <strong>plugin de mémoire persistante conçu spécifiquement pour Claude Code</strong>. Il s'appuie sur le CLI memsearch, et nous l'appelons le <strong>ccplugin memsearch</strong>.</p>
<ul>
<li>GitHub Repo : <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(open-source, licence MIT)</em></li>
</ul>
<p>Avec le <strong>ccplugin memsearch</strong> léger qui gère la mémoire en coulisses, Claude Code acquiert la capacité de se souvenir de chaque conversation, de chaque décision, de chaque préférence de style et de chaque fil de discussion de plusieurs jours - automatiquement indexé, entièrement consultable et persistant à travers les sessions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Pour plus de clarté dans ce billet : "ccplugin" fait référence à la couche supérieure, ou au plugin Claude Code lui-même. "memsearch" fait référence à la couche inférieure, l'outil CLI autonome qui se trouve en dessous.</em></p>
<p>Alors pourquoi le codage a-t-il besoin de son propre plugin, et pourquoi avons-nous construit quelque chose d'aussi léger ? Cela se résume à deux problèmes que vous avez certainement rencontrés : Le manque de mémoire persistante de Claude Code, et la lourdeur et la complexité des solutions existantes comme claude-mem.</p>
<p>Alors pourquoi créer un plugin dédié ? Parce que les agents de codage se heurtent à deux problèmes que vous avez certainement rencontrés vous-même :</p>
<ul>
<li><p>Claude Le code n'a pas de mémoire persistante.</p></li>
<li><p>De nombreuses solutions communautaires existantes, comme <em>claude-mem, sont</em>puissantes mais lourdes, encombrantes ou trop complexes pour le travail de codage quotidien.</p></li>
</ul>
<p>Le ccplugin vise à résoudre ces deux problèmes avec une couche minimale, transparente et conviviale pour les développeurs au-dessus de memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Le problème de mémoire du code Claude : il oublie tout à la fin d'une session<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Commençons par un scénario que les utilisateurs de Claude Code ont certainement rencontré.</p>
<p>Vous ouvrez Claude Code le matin. Vous tapez "Continue le refactor d'authentification d'hier". Claude vous répond : "Je ne suis pas sûr de savoir sur quoi vous travailliez hier". Vous passez donc les dix minutes suivantes à copier-coller les logs d'hier. Ce n'est pas un problème énorme, mais il devient rapidement ennuyeux parce qu'il apparaît si fréquemment.</p>
<p>Même si Claude Code a ses propres mécanismes de mémoire, ils sont loin d'être satisfaisants. Le fichier <code translate="no">CLAUDE.md</code> peut stocker les directives et les préférences du projet, mais il fonctionne mieux pour les règles statiques et les commandes courtes, pas pour accumuler des connaissances à long terme.</p>
<p>Claude Code propose les commandes <code translate="no">resume</code> et <code translate="no">fork</code>, mais elles sont loin d'être conviviales. Pour les commandes fork, vous devez vous souvenir des identifiants de session, taper les commandes manuellement et gérer une arborescence d'historiques de conversations qui se ramifient. Lorsque vous exécutez la commande <code translate="no">/resume</code>, vous obtenez un mur de titres de sessions. Si vous ne vous souvenez que de quelques détails sur ce que vous avez fait et que cela remonte à plus de quelques jours, bonne chance pour trouver la bonne session.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour l'accumulation de connaissances à long terme et entre projets, cette approche est impossible.</p>
<p>Pour répondre à cette idée, claude-mem utilise un système de mémoire à trois niveaux. Le premier niveau recherche des résumés de haut niveau. Le deuxième niveau creuse dans une ligne de temps pour obtenir plus de détails. Le troisième niveau extrait des observations complètes pour obtenir des conversations brutes. En outre, il existe des étiquettes de confidentialité, un suivi des coûts et une interface de visualisation sur le web.</p>
<p>Voici comment le système fonctionne sous le capot :</p>
<ul>
<li><p><strong>Couche d'exécution.</strong> Un service Node.js Worker fonctionne sur le port 37777. Les métadonnées de session sont stockées dans une base de données SQLite légère. Une base de données vectorielle gère la récupération sémantique précise du contenu de la mémoire.</p></li>
<li><p><strong>Couche d'interaction.</strong> Une interface web basée sur React vous permet de visualiser les souvenirs capturés en temps réel : résumés, chronologies et enregistrements bruts.</p></li>
<li><p><strong>Couche d'interface.</strong> Un serveur MCP (Model Context Protocol) expose des interfaces d'outils standardisés. Claude peut appeler <code translate="no">search</code> (interroger des résumés de haut niveau), <code translate="no">timeline</code> (afficher des chronologies détaillées) et <code translate="no">get_observations</code> (récupérer des enregistrements d'interactions bruts) pour récupérer et utiliser directement des souvenirs.</p></li>
</ul>
<p>Pour être honnête, il s'agit d'un produit solide qui résout le problème de mémoire de Claude Code. Mais il est lourd et complexe pour ce qui est de la vie quotidienne.</p>
<table>
<thead>
<tr><th>Couche</th><th>Technologie</th></tr>
</thead>
<tbody>
<tr><td>Langage</td><td>TypeScript (ES2022, modules ESNext)</td></tr>
<tr><td>Temps d'exécution</td><td>Node.js 18+</td></tr>
<tr><td>Base de données</td><td>SQLite 3 avec le pilote bun:sqlite</td></tr>
<tr><td>Magasin de vecteurs</td><td>ChromaDB (optionnel, pour la recherche sémantique)</td></tr>
<tr><td>Serveur HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>Temps réel</td><td>Événements envoyés par le serveur (SSE)</td></tr>
<tr><td>Cadre d'interface utilisateur</td><td>React + TypeScript</td></tr>
<tr><td>SDK AI</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Outil de construction</td><td>esbuild (inclut TypeScript)</td></tr>
<tr><td>Gestionnaire de processus</td><td>Bun</td></tr>
<tr><td>Test</td><td>Test runner intégré à Node.js</td></tr>
</tbody>
</table>
<p><strong>Pour commencer, l'installation est lourde.</strong> Faire fonctionner claude-mem signifie installer Node.js, Bun, et le runtime MCP, puis mettre en place un service Worker, un serveur Express, React UI, SQLite, et un magasin de vecteurs par-dessus. Cela fait beaucoup de pièces mobiles à déployer, à maintenir et à déboguer en cas de problème.</p>
<p><strong>Tous ces composants brûlent également des jetons que vous n'avez pas demandé à dépenser.</strong> Les définitions d'outils MCP se chargent en permanence dans la fenêtre contextuelle de Claude, et chaque appel d'outil consomme des jetons sur la demande et la réponse. Sur de longues sessions, ces frais généraux s'accumulent rapidement et peuvent rendre le coût des jetons incontrôlable.</p>
<p><strong>Le rappel de mémoire n'est pas fiable car il dépend entièrement du choix de Claude de faire une recherche.</strong> Claude doit décider lui-même d'appeler des outils tels que <code translate="no">search</code> pour déclencher la recherche. S'il ne se rend pas compte qu'il a besoin d'une mémoire, le contenu pertinent n'apparaît jamais. De plus, chacun des trois niveaux de mémoire nécessite l'invocation explicite de son propre outil, de sorte qu'il n'y a pas de solution de repli si Claude ne pense pas à chercher.</p>
<p><strong>Enfin, le stockage des données est opaque, ce qui rend le débogage et la migration désagréables.</strong> Les mémoires sont réparties entre SQLite pour les métadonnées de session et Chroma pour les données vectorielles binaires, sans qu'aucun format ouvert ne les relie. Pour migrer, il faut écrire des scripts d'exportation. Pour voir ce que l'IA retient réellement, il faut passer par l'interface Web ou par une interface de requête dédiée. Il n'y a aucun moyen de regarder les données brutes.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Pourquoi le plugin memsearch pour Claude Code est-il meilleur ?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous voulions une couche mémoire vraiment légère - pas de services supplémentaires, pas d'architecture enchevêtrée, pas de surcharge opérationnelle. C'est ce qui nous a motivé à construire le <strong>ccplugin memsearch</strong>. Au fond, il s'agissait d'une expérience : <em>un système de mémoire centré sur le codage pouvait-il être radicalement plus simple ?</em></p>
<p>Oui, et nous l'avons prouvé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'ensemble du ccplugin est constitué de quatre hooks shell et d'un processus de surveillance en arrière-plan. Pas de Node.js, pas de serveur MCP, pas d'interface Web. Il s'agit simplement de scripts shell appelant la CLI de memsearch, ce qui réduit considérablement la barre d'installation et de maintenance.</p>
<p>Le ccplugin peut être aussi fin en raison des limites strictes de responsabilité. Il ne gère pas le stockage de la mémoire, la récupération de vecteurs ou l'intégration de texte. Tout cela est délégué à l'interface de programmation memsearch. Le ccplugin n'a qu'une seule tâche : faire le lien entre les événements du cycle de vie de Claude Code (démarrage de la session, soumission de l'invite, arrêt de la réponse, fin de la session) et les fonctions correspondantes de l'interface de programmation de memsearch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette conception découplée rend le système flexible au-delà de Claude Code. Le CLI de memsearch fonctionne indépendamment avec d'autres IDE, d'autres cadres d'agents, ou même une simple invocation manuelle. Il n'est pas limité à un seul cas d'utilisation.</p>
<p>En pratique, cette conception offre trois avantages clés.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Tous les souvenirs vivent dans de simples fichiers Markdown</h3><p>Chaque mémoire créée par le ccplugin est conservée dans <code translate="no">.memsearch/memory/</code> sous la forme d'un fichier Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Il s'agit d'un fichier par jour. Chaque fichier contient les résumés des sessions de la journée en texte clair, entièrement lisible par l'homme. Voici une capture d'écran des fichiers de mémoire quotidiens du projet memsearch lui-même :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous voyez tout de suite le format : horodatage, identifiant de session, identifiant de tour, et un résumé de la session. Rien n'est caché.</p>
<p>Vous voulez savoir ce dont l'IA se souvient ? Ouvrez le fichier Markdown. Vous voulez modifier un souvenir ? Utilisez votre éditeur de texte. Vous voulez migrer vos données ? Copiez le dossier <code translate="no">.memsearch/memory/</code>.</p>
<p>L'index vectoriel <a href="https://milvus.io/">Milvus</a> est un cache pour accélérer la recherche sémantique. Il peut être reconstruit à tout moment à partir de Markdown. Pas de bases de données opaques, pas de boîtes noires binaires. Toutes les données sont traçables et entièrement reconstituables.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. L'injection automatique de contexte ne coûte aucun jeton supplémentaire</h3><p>Le stockage transparent est la base de ce système. Le véritable bénéfice vient de la façon dont ces mémoires sont utilisées, et dans ccplugin, le rappel des mémoires est entièrement automatique.</p>
<p>Chaque fois qu'une demande est soumise, le crochet <code translate="no">UserPromptSubmit</code> lance une recherche sémantique et injecte les trois premiers souvenirs pertinents dans le contexte. Claude ne décide pas s'il faut faire une recherche. Il obtient simplement le contexte.</p>
<p>Au cours de ce processus, Claude ne voit jamais les définitions des outils MCP, de sorte que rien d'autre n'occupe la fenêtre de contexte. Le crochet s'exécute au niveau de la couche CLI et injecte les résultats de la recherche en texte clair. Pas de surcharge IPC, pas de coûts de jetons d'appel d'outil. L'encombrement de la fenêtre contextuelle qui accompagne les définitions d'outils MCP est totalement supprimé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour les cas où le top-3 automatique n'est pas suffisant, nous avons également construit trois niveaux de récupération progressive. Ces trois niveaux sont des commandes CLI, et non des outils MCP.</p>
<ul>
<li><p><strong>L1 (automatique) :</strong> Chaque invite renvoie les trois premiers résultats de la recherche sémantique avec un aperçu de <code translate="no">chunk_hash</code> et de 200 caractères. Cela couvre la plupart des utilisations quotidiennes.</p></li>
<li><p><strong>L2 (à la demande) :</strong> Lorsqu'un contexte complet est nécessaire, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> renvoie la section Markdown complète ainsi que les métadonnées.</p></li>
<li><p><strong>L3 (approfondi) :</strong> Lorsque la conversation originale est nécessaire, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> extrait l'enregistrement JSONL brut de Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Les résumés de session sont générés en arrière-plan à un coût quasi nul</h3><p>La récupération couvre la façon dont les souvenirs sont utilisés. Mais les souvenirs doivent d'abord être écrits. Comment tous ces fichiers Markdown sont-ils créés ?</p>
<p>Le ccplugin les génère par le biais d'un pipeline en arrière-plan qui s'exécute de manière asynchrone et ne coûte presque rien. Chaque fois que vous arrêtez une réponse de Claude, le crochet <code translate="no">Stop</code> se déclenche : il analyse la transcription de la conversation, appelle Claude Haiku (<code translate="no">claude -p --model haiku</code>) pour générer un résumé, et l'ajoute au fichier Markdown du jour. Les appels à l'API Haiku sont extrêmement bon marché, presque négligeables par invocation.</p>
<p>À partir de là, le processus de veille détecte la modification du fichier et indexe automatiquement le nouveau contenu dans Milvus afin qu'il puisse être récupéré immédiatement. L'ensemble du flux s'exécute en arrière-plan sans interrompre votre travail, et les coûts restent contrôlés.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Démarrage rapide du plugin memsearch avec Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Tout d'abord, installez le plugin à partir de la place de marché des plugins de Claude Code :</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Ensuite, redémarrez Claude Code.</h3><p>Le plugin initialisera sa configuration automatiquement.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Troisièmement, après une conversation, vérifiez le fichier de mémoire du jour :</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Quatrièmement, profitez-en.</h3><p>Au prochain démarrage de Claude Code, le système récupère et injecte automatiquement les souvenirs pertinents. Aucune étape supplémentaire n'est nécessaire.</p>
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
    </button></h2><p>Revenons à la question initiale : comment donner à l'IA une mémoire persistante ? claude-mem et memsearch ccplugin adoptent des approches différentes, chacune avec des forces différentes. Nous avons résumé un guide rapide pour choisir entre les deux :</p>
<table>
<thead>
<tr><th>Catégorie</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Architecture</td><td>4 shell hooks + 1 watch process</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>Méthode d'intégration</td><td>Crochets natifs + CLI</td><td>Serveur MCP (stdio)</td></tr>
<tr><td>Rappel</td><td>Automatique (injection de crochets)</td><td>Piloté par l'agent (nécessite l'invocation d'un outil)</td></tr>
<tr><td>Consommation de contexte</td><td>Zéro (injection du texte du résultat uniquement)</td><td>Les définitions des outils MCP persistent</td></tr>
<tr><td>Résumé de la session</td><td>Un appel CLI Haiku asynchrone</td><td>Plusieurs appels API + compression des observations</td></tr>
<tr><td>Format de stockage</td><td>Fichiers Markdown simples</td><td>SQLite + Chroma embeddings</td></tr>
<tr><td>Migration des données</td><td>Fichiers Markdown simples</td><td>SQLite + Chroma embeddings</td></tr>
<tr><td>Méthode de migration</td><td>Copie des fichiers .md</td><td>Exportation depuis la base de données</td></tr>
<tr><td>Temps d'exécution</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP runtime</td></tr>
</tbody>
</table>
<p>claude-mem offre des fonctionnalités plus riches, une interface soignée et un contrôle plus fin. Pour les équipes qui ont besoin de collaboration, de visualisation web, ou de gestion détaillée de la mémoire, c'est un choix solide.</p>
<p>memsearch ccplugin offre une conception minimale, une fenêtre contextuelle sans surcharge et un stockage totalement transparent. Pour les ingénieurs qui veulent une couche mémoire légère sans complexité supplémentaire, c'est le meilleur choix. Le choix de l'un ou l'autre dépend de vos besoins.</p>
<p>Vous souhaitez approfondir vos connaissances ou obtenir de l'aide pour construire avec memsearch ou Milvus ?</p>
<ul>
<li><p>Rejoignez la <a href="https://milvus.io/slack">communauté Slack Milvus</a> pour vous connecter avec d'autres développeurs et partager ce que vous construisez.</p></li>
<li><p>Réservez nos <a href="https://milvus.io/office-hours">heures de bureau Milvus pour des</a>questions-réponses en direct et une assistance directe de l'équipe.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Ressources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>Documentation memsearch ccplugin</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">: https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">: https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>Projet memsearch</strong> <a href="https://github.com/zilliztech/memsearch">: https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog : <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en open-source (memsearch)</a></p></li>
<li><p>Blog : <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Guide complet de l'agent d'intelligence artificielle open-source (en anglais)</a></p></li>
<li><p>Blog : <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutoriel OpenClaw : Se connecter à Slack pour un assistant IA local</a></p></li>
</ul>
