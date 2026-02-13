---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: >-
  Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en libre
  accès (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Nous avons extrait l'architecture de mémoire IA d'OpenClaw dans memsearch -
  une bibliothèque Python autonome avec des journaux Markdown, une recherche
  vectorielle hybride et la prise en charge de Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (anciennement clawdbot et moltbot) devient viral - <a href="https://github.com/openclaw/openclaw">189k+ étoiles GitHub</a> en moins de deux semaines. C'est fou. L'essentiel du buzz porte sur ses capacités autonomes et agentiques dans les canaux de discussion quotidiens, notamment iMessages, WhatsApp, Slack, Telegram et bien d'autres encore.</p>
<p>Mais en tant qu'ingénieurs travaillant sur un système de base de données vectorielles, ce qui a vraiment attiré notre attention, c'est l'<strong>approche d'OpenClaw en matière de mémoire à long terme</strong>. Contrairement à la plupart des systèmes de mémoire existants, l'IA d'OpenClaw écrit automatiquement des journaux quotidiens sous forme de fichiers Markdown. Ces fichiers sont la source de vérité, et le modèle ne se "souvient" que de ce qui est écrit sur le disque. Les développeurs humains peuvent ouvrir ces fichiers Markdown, les éditer directement, distiller les principes à long terme et voir exactement ce dont l'IA se souvient à tout moment. Il n'y a pas de boîte noire. Honnêtement, c'est l'une des architectures de mémoire les plus propres et les plus conviviales pour les développeurs que nous ayons vues.</p>
<p>Naturellement, nous nous sommes posé une question : <strong><em>pourquoi cela ne fonctionnerait-il qu'à l'intérieur d'OpenClaw ? Et si n'importe quel agent pouvait disposer d'une telle mémoire ?</em></strong> Nous avons pris l'architecture mémoire exacte d'OpenClaw et construit <a href="https://github.com/zilliztech/memsearch">memsearch</a> - une bibliothèque de mémoire à long terme autonome et prête à l'emploi qui donne à n'importe quel agent une mémoire persistante, transparente et modifiable par l'homme. Elle ne dépend pas du reste d'OpenClaw. Il suffit de l'ajouter, et votre agent obtient une mémoire durable avec une recherche alimentée par Milvus/Zilliz Cloud, ainsi que des journaux Markdown comme source canonique de vérité.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo :</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (open-source, licence MIT)</p></li>
<li><p><strong>Documentation</strong> <a href="https://zilliztech.github.io/memsearch/">: https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Plugin de code Claude</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">: https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Ce qui différencie la mémoire d'OpenClaw<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans l'architecture de la mémoire d'OpenClaw, clarifions deux concepts : le <strong>contexte</strong> et la <strong>mémoire</strong>. Ils semblent similaires mais fonctionnent très différemment dans la pratique.</p>
<ul>
<li><p>Le<strong>contexte</strong> est tout ce que l'agent voit dans une seule requête - les invites du système, les fichiers d'orientation au niveau du projet comme <code translate="no">AGENTS.md</code> et <code translate="no">SOUL.md</code>, l'historique de la conversation (messages, appels d'outils, résumés compressés) et le message actuel de l'utilisateur. Il est limité à une session et relativement compact.</p></li>
<li><p>La<strong>mémoire</strong> est ce qui persiste d'une session à l'autre. Elle se trouve sur votre disque local - l'historique complet des conversations passées, les fichiers avec lesquels l'agent a travaillé et les préférences de l'utilisateur. Elle n'est pas résumée. Non compressé. Les données brutes.</p></li>
</ul>
<p>Voici maintenant la décision de conception qui rend l'approche d'OpenClaw spéciale : <strong>toute la mémoire est stockée sous forme de fichiers Markdown simples sur le système de fichiers local.</strong> Après chaque session, l'IA écrit automatiquement des mises à jour de ces fichiers Markdown. Vous - et n'importe quel développeur - pouvez les ouvrir, les modifier, les réorganiser, les supprimer ou les affiner. Pendant ce temps, la base de données vectorielle s'appuie sur ce système, créant et maintenant un index pour la recherche. Chaque fois qu'un fichier Markdown est modifié, le système détecte le changement et le réindexe automatiquement.</p>
<p>Si vous avez utilisé des outils tels que Mem0 ou Zep, vous remarquerez immédiatement la différence. Ces systèmes stockent les souvenirs sous forme d'embeddings - c'est la seule copie. Vous ne pouvez pas lire ce dont votre agent se souvient. Vous ne pouvez pas corriger un mauvais souvenir en modifiant une ligne. L'approche d'OpenClaw vous offre les deux : la transparence des fichiers simples <strong>et la</strong> puissance de recherche vectorielle à l'aide d'une base de données vectorielle. Vous pouvez le lire, le <code translate="no">git diff</code>, le grep - il s'agit simplement de fichiers.</p>
<p>Le seul inconvénient ? À l'heure actuelle, ce système de mémoire Markdown-first est étroitement lié à l'ensemble de l'écosystème OpenClaw - le processus Gateway, les connecteurs de plateforme, la configuration de l'espace de travail et l'infrastructure de messagerie. Si vous ne voulez que le modèle de mémoire, c'est beaucoup de machinerie à traîner.</p>
<p>C'est exactement la raison pour laquelle nous avons créé <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: la même philosophie - Markdown comme source de vérité, indexation vectorielle automatique, entièrement modifiable par l'homme - mais sous la forme d'une bibliothèque légère et autonome que vous pouvez intégrer à n'importe quelle architecture agentique.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Comment fonctionne memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme mentionné précédemment, <a href="https://github.com/zilliztech/memsearch">memsearch</a> est une bibliothèque de mémoire à long terme totalement indépendante qui met en œuvre la même architecture de mémoire que celle utilisée dans OpenClaw - sans apporter le reste de la pile OpenClaw. Vous pouvez la brancher dans n'importe quel cadre d'agent (Claude, GPT, Llama, agents personnalisés, moteurs de flux de travail) et donner instantanément à votre système une mémoire persistante, transparente et modifiable par l'homme.</p>
<p>Toute la mémoire de l'agent dans memsearch est stockée en texte clair Markdown dans un répertoire local. La structure est volontairement simple pour que les développeurs puissent la comprendre d'un seul coup d'œil :</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch utilise <a href="https://milvus.io/"><strong>Milvus</strong></a> comme base de données vectorielle pour indexer ces fichiers Markdown en vue d'une récupération sémantique rapide. Mais l'index vectoriel <em>n'</em> est <em>pas</em> la source de vérité, ce sont les fichiers qui le sont. Si vous supprimez entièrement l'index Milvus, <strong>vous ne perdez rien.</strong> Memsearch se contente de réincorporer et de réindexer les fichiers Markdown, reconstruisant ainsi la couche de recherche complète en quelques minutes. Cela signifie que la mémoire de votre agent est transparente, durable et entièrement reconstructible.</p>
<p>Voici les principales fonctionnalités de memsearch :</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Le Markdown lisible rend le débogage aussi simple que l'édition d'un fichier</h3><p>Le débogage de la mémoire d'une IA est généralement douloureux. Lorsqu'un agent produit une mauvaise réponse, la plupart des systèmes de mémoire ne vous donnent aucun moyen clair de voir <em>ce qu'</em> il a réellement stocké. Le flux de travail typique consiste à écrire un code personnalisé pour interroger une API de mémoire, puis à passer au crible des embeddings opaques ou des blobs JSON verbeux - qui ne vous disent pas grand-chose sur l'état interne réel de l'IA.</p>
<p><strong>memsearch élimine toute cette catégorie de problèmes.</strong> Toute la mémoire se trouve dans le dossier memory/ sous la forme d'un simple Markdown :</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Si l'IA se trompe, il suffit de modifier le fichier pour y remédier. Mettez à jour l'entrée, sauvegardez, et memsearch réindexera automatiquement le changement. Cinq secondes. Pas d'appel à l'API. Pas d'outils. Pas de mystère. Vous déboguez la mémoire AI de la même manière que vous déboguez la documentation, en éditant un fichier.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">La mémoire soutenue par Git signifie que les équipes peuvent suivre, réviser et annuler les modifications.</h3><p>Il est difficile de collaborer sur une mémoire d'IA qui vit dans une base de données. Pour savoir qui a modifié quoi et quand, il faut fouiller dans les journaux d'audit, et de nombreuses solutions n'en fournissent même pas. Les changements se produisent en silence et les désaccords sur ce que l'IA devrait mémoriser n'ont pas de voie de résolution claire. Les équipes finissent par se fier aux messages Slack et aux hypothèses.</p>
<p>Memsearch résout ce problème en faisant de la mémoire un simple fichier Markdown, ce qui signifie que <strong>Git gère automatiquement les versions</strong>. Une seule commande permet d'afficher l'ensemble de l'historique :</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>La mémoire AI participe désormais au même flux de travail que le code. Les décisions d'architecture, les mises à jour de configuration et les changements de préférences apparaissent tous dans des différences que tout le monde peut commenter, approuver ou inverser :</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">La mémoire en texte clair rend la migration presque sans effort</h3><p>La migration est l'un des coûts cachés les plus importants des frameworks de mémoire. Passer d'un outil à un autre signifie généralement exporter des données, convertir des formats, réimporter et espérer que les champs sont compatibles. Ce genre de travail peut facilement prendre une demi-journée, et le résultat n'est jamais garanti.</p>
<p>memsearch évite totalement ce problème car la mémoire est du Markdown en texte clair. Il n'y a pas de format propriétaire, pas de schéma à traduire, rien à migrer :</p>
<ul>
<li><p><strong>Changement de machine :</strong> <code translate="no">rsync</code> le dossier mémoire. C'est fait.</p></li>
<li><p><strong>Changez de modèle d'intégration :</strong> Exécutez à nouveau la commande d'indexation. Cela prendra cinq minutes, et les fichiers markdown ne seront pas modifiés.</p></li>
<li><p><strong>Changer le déploiement de la base de données vectorielle :</strong> Changez une valeur de configuration. Par exemple, passer de Milvus Lite en développement à Zilliz Cloud en production :</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Vos fichiers de mémoire restent exactement les mêmes. L'infrastructure qui les entoure peut évoluer librement. Il en résulte une portabilité à long terme, une propriété rare dans les systèmes d'intelligence artificielle.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Les fichiers Markdown partagés permettent aux humains et aux agents de corédiger la mémoire</h3><p>Dans la plupart des solutions de mémoire, la modification de ce dont l'IA se souvient nécessite l'écriture d'un code par rapport à une API. Cela signifie que seuls les développeurs peuvent maintenir la mémoire de l'IA, et même pour eux, c'est une tâche fastidieuse.</p>
<p>Memsearch permet une répartition plus naturelle des responsabilités :</p>
<ul>
<li><p><strong>L'IA gère :</strong> Les journaux quotidiens automatiques (<code translate="no">YYYY-MM-DD.md</code>) avec des détails d'exécution tels que "déployé v2.3.1, 12% d'amélioration des performances".</p></li>
<li><p><strong>Les humains s'en chargent :</strong> Les principes à long terme dans <code translate="no">MEMORY.md</code>, comme "Team stack : Python + FastAPI + PostgreSQL".</p></li>
</ul>
<p>Les deux parties éditent les mêmes fichiers Markdown avec les outils qu'elles utilisent déjà. Pas d'appel d'API, pas d'outil spécial, pas de gardien. Lorsque la mémoire est enfermée dans une base de données, ce type de partage des droits d'auteur n'est pas possible. memsearch le rend possible par défaut.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Sous le capot : memsearch s'appuie sur quatre flux de travail qui maintiennent la mémoire rapide, fraîche et allégée<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch s'appuie sur quatre flux de travail principaux : <strong>Watch</strong> (surveiller) → <strong>Index</strong> (regrouper et intégrer) → <strong>Search</strong> (récupérer) → <strong>Compact</strong> (résumer). Voici ce que fait chacun d'entre eux.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Regarder : Réindexation automatique à chaque enregistrement de fichier</h3><p>Le flux de travail <strong>Watch</strong> surveille tous les fichiers Markdown dans le répertoire memory/ et déclenche une réindexation chaque fois qu'un fichier est modifié et enregistré. Un délai <strong>de 1500 ms</strong> garantit que les mises à jour sont détectées sans gaspiller de calcul : si plusieurs sauvegardes se succèdent rapidement, le minuteur se réinitialise et ne se déclenche que lorsque les modifications se sont stabilisées.</p>
<p>Ce délai est ajusté de manière empirique :</p>
<ul>
<li><p><strong>100ms</strong> → trop sensible ; se déclenche à chaque frappe, brûlant les appels d'intégration</p></li>
<li><p><strong>10s</strong> → trop lent ; les développeurs remarquent un décalage</p></li>
<li><p><strong>1500 ms</strong> → équilibre idéal entre réactivité et efficacité des ressources</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En pratique, cela signifie qu'un développeur peut écrire du code dans une fenêtre et modifier <code translate="no">MEMORY.md</code> dans une autre, en ajoutant une URL de documentation API ou en corrigeant une entrée obsolète. Il suffit d'enregistrer le fichier pour que la prochaine requête de l'IA prenne en compte la nouvelle mémoire. Pas de redémarrage, pas de réindexation manuelle.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Indexation : Chunking intelligent, déduplication et intégration adaptée aux versions</h3><p>Index est le flux de travail critique en termes de performances. Il gère trois éléments : <strong>le découpage, la déduplication et les identifiants de morceaux versionnés.</strong></p>
<p>Le découpage<strong>en</strong> morceaux divise le texte le long des frontières sémantiques (les titres et leurs corps) afin que les contenus connexes restent ensemble. Cela permet d'éviter qu'une phrase comme "Redis configuration" soit divisée en plusieurs morceaux.</p>
<p>Par exemple, ce texte Markdown :</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>devient deux morceaux :</p>
<ul>
<li><p>Chunk 1 : <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Morceau 2 : <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p>La<strong>déduplication</strong> utilise un hachage SHA-256 de chaque morceau pour éviter d'intégrer deux fois le même texte. Si plusieurs fichiers mentionnent "PostgreSQL 16", l'API d'intégration est appelée une fois, et non une fois par fichier. Pour ~500Ko de texte, cela permet d'économiser environ <strong> 0,15$/mois</strong>. À plus grande échelle, cela représente des centaines de dollars.</p>
<p><strong>La conception de l'identifiant de morceau</strong> encode tout ce qui est nécessaire pour savoir si un morceau est périmé. Le format est <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. Le champ <code translate="no">model_version</code> est la partie importante : lorsqu'un modèle d'intégration est mis à niveau de <code translate="no">text-embedding-3-small</code> à <code translate="no">text-embedding-3-large</code>, les anciennes intégrations deviennent invalides. La version du modèle étant intégrée à l'ID, le système identifie automatiquement les morceaux qui doivent être réincorporés. Aucun nettoyage manuel n'est nécessaire.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Recherche : Recherche hybride vecteur + BM25 pour une précision maximale</h3><p>La recherche utilise une approche hybride : la recherche vectorielle est pondérée à 70% et la recherche par mot-clé BM25 est pondérée à 30%. Cette approche permet d'équilibrer deux besoins différents qui apparaissent fréquemment dans la pratique.</p>
<ul>
<li><p>La<strong>recherche vectorielle</strong> gère la correspondance sémantique. Une requête pour "Redis cache config" renvoie un bloc contenant "Redis L1 cache with 5min TTL" même si la formulation est différente. Ceci est utile lorsque le développeur se souvient du concept mais pas de la formulation exacte.</p></li>
<li><p><strong>BM25</strong> gère la correspondance exacte. Une requête pour "PostgreSQL 16" ne renvoie pas de résultats sur "PostgreSQL 15". Ceci est important pour les codes d'erreur, les noms de fonctions et les comportements spécifiques à une version, où la proximité n'est pas suffisante.</p></li>
</ul>
<p>La répartition 70/30 par défaut fonctionne bien pour la plupart des cas d'utilisation. Pour les flux de travail qui s'appuient fortement sur les correspondances exactes, augmenter le poids de BM25 à 50% est un changement de configuration en une ligne.</p>
<p>Les résultats sont renvoyés sous forme de morceaux top-K (3 par défaut), chacun étant tronqué à 200 caractères. Lorsque le contenu complet est nécessaire, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> le charge. Cette divulgation progressive permet de limiter l'utilisation de la fenêtre contextuelle du LLM sans sacrifier l'accès aux détails.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Compact : Résumer la mémoire historique pour garder le contexte propre</h3><p>La mémoire accumulée finit par poser problème. Les anciennes entrées remplissent la fenêtre de contexte, augmentent les coûts des jetons et ajoutent du bruit qui dégrade la qualité de la réponse. Compact résout ce problème en appelant un LLM pour résumer la mémoire historique sous une forme condensée, puis en supprimant ou en archivant les originaux. Il peut être déclenché manuellement ou programmé pour être exécuté à intervalles réguliers.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Comment démarrer avec memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch fournit à la fois une <strong>API Python</strong> et un <strong>CLI</strong>, de sorte que vous pouvez l'utiliser au sein de frameworks d'agents ou comme outil de débogage autonome. L'installation est minimale et le système est conçu de manière à ce que votre environnement de développement local et votre déploiement en production soient presque identiques.</p>
<p>Memsearch prend en charge trois backends compatibles avec Milvus, tous exposés via la <strong>même API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (par défaut)</strong></a><strong>:</strong> Fichier local <code translate="no">.db</code>, aucune configuration, adapté à une utilisation individuelle.</p></li>
<li><p><strong>Milvus Standalone / Cluster :</strong> Auto-hébergé, prend en charge plusieurs agents partageant des données, adapté aux environnements d'équipe.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Entièrement géré, avec mise à l'échelle automatique, sauvegardes, haute disponibilité et isolation. Idéal pour les charges de travail de production.</p></li>
</ul>
<p>Le passage du développement local à la production se fait généralement <strong>par un changement de configuration en une ligne</strong>. Votre code reste le même.</p>
<h3 id="Install" class="common-anchor-header">Installation</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch prend également en charge plusieurs fournisseurs d'intégration, notamment OpenAI, Google, Voyage, Ollama et les modèles locaux. Cela garantit que votre architecture de mémoire reste portable et agnostique.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Option 1 : API Python (intégrée dans votre structure d'agent)</h3><p>Voici un exemple minimal d'une boucle d'agent complète utilisant memsearch. Vous pouvez copier/coller et modifier selon vos besoins :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Ceci montre la boucle principale :</p>
<ul>
<li><p><strong>Rappel</strong>: memsearch effectue une recherche hybride vecteur + BM25</p></li>
<li><p><strong>Réfléchissez</strong>: votre LLM traite l'entrée de l'utilisateur + la mémoire récupérée</p></li>
<li><p><strong>Rappelez-vous</strong>: l'agent écrit une nouvelle mémoire dans Markdown, et memsearch met à jour son index.</p></li>
</ul>
<p>Ce modèle s'intègre naturellement dans n'importe quel système d'agent - LangChain, AutoGPT, routeurs sémantiques, LangGraph, ou boucles d'agent personnalisées. Il s'agit d'un système agnostique de par sa conception.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Option 2 : CLI (opérations rapides, bonnes pour le débogage)</h3><p>Le CLI est idéal pour les flux de travail autonomes, les vérifications rapides ou l'inspection de la mémoire pendant le développement :</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>Le CLI reflète les capacités de l'API Python mais fonctionne sans écrire de code, ce qui est idéal pour le débogage, les inspections, les migrations ou la validation de la structure de votre dossier mémoire.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Comment memsearch se compare aux autres solutions de mémoire<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>La question la plus fréquente que se posent les développeurs est de savoir pourquoi ils utiliseraient memsearch alors qu'il existe déjà des options bien établies. La réponse courte : memsearch échange des fonctionnalités avancées telles que les graphes de connaissances temporelles contre de la transparence, de la portabilité et de la simplicité. Pour la plupart des cas d'utilisation de la mémoire agent, c'est le bon compromis.</p>
<table>
<thead>
<tr><th>Solution</th><th>Points forts</th><th>Limites</th><th>Meilleur pour</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Mémoire en clair transparente, coauteur IA humain, friction de migration nulle, débogage facile, Git-natif</td><td>Pas de graphes temporels intégrés ou de structures de mémoire multi-agents complexes</td><td>Équipes qui privilégient le contrôle, la simplicité et la portabilité de la mémoire à long terme</td></tr>
<tr><td>Mem0</td><td>Entièrement géré, pas d'infrastructure à gérer ou à entretenir</td><td>Opaque - impossible d'inspecter ou de modifier manuellement la mémoire ; les embeddings sont la seule représentation.</td><td>Équipes souhaitant un service géré sans intervention et acceptant une visibilité réduite</td></tr>
<tr><td>Zep</td><td>Riche ensemble de fonctionnalités : mémoire temporelle, modélisation multi-personnes, graphes de connaissances complexes</td><td>Architecture lourde ; plus de pièces mobiles ; plus difficile à apprendre et à utiliser</td><td>Agents qui ont vraiment besoin de structures de mémoire avancées ou d'un raisonnement temporel.</td></tr>
<tr><td>LangMem / Letta</td><td>Intégration profonde et transparente au sein de leurs propres écosystèmes</td><td>Verrouillage du cadre ; difficile à porter sur d'autres piles d'agents</td><td>Les équipes sont déjà engagées dans ces frameworks spécifiques</td></tr>
</tbody>
</table>
<h2 id="Try-memsearch-and-let-us-know-your-feedback" class="common-anchor-header">Essayez memsearch et faites-nous part de vos commentaires<button data-href="#Try-memsearch-and-let-us-know-your-feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch est entièrement open source sous la licence MIT, et le dépôt est prêt pour des expériences de production dès aujourd'hui.</p>
<ul>
<li><p><strong>Repo :</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Docs :</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Si vous construisez un agent qui a besoin de se souvenir de choses à travers les sessions et que vous voulez avoir un contrôle total sur ce qu'il se souvient, memsearch vaut la peine d'être regardé. La bibliothèque s'installe avec un simple <code translate="no">pip install</code>, fonctionne avec n'importe quelle structure d'agent, et stocke tout en Markdown que vous pouvez lire, éditer, et versionner avec Git.</p>
<p>Nous développons activement memsearch et aimerions avoir l'avis de la communauté.</p>
<ul>
<li><p>Ouvrez un problème si quelque chose ne fonctionne pas.</p></li>
<li><p>Soumettez un PR si vous voulez étendre la bibliothèque.</p></li>
<li><p>Mettez en vedette le repo si la philosophie Markdown-as-source-of-truth résonne avec vous.</p></li>
</ul>
<p>Le système de mémoire d'OpenClaw n'est plus enfermé dans OpenClaw. Maintenant, tout le monde peut l'utiliser.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lire la suite<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Guide complet de l'agent d'intelligence artificielle open-source</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutoriel OpenClaw : Se connecter à Slack pour un assistant IA local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construire des agents IA de type Clawdbot avec LangGraph et Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG contre les agents à longue durée d'exécution : RAG est-il obsolète ?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Créer une compétence anthropique personnalisée pour Milvus afin de faire tourner rapidement RAG</a></p></li>
</ul>
