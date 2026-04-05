---
id: claude-code-memory-memsearch.md
title: >-
  Nous avons lu la source divulguée de Claude Code. Voici comment fonctionne sa
  mémoire
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  La fuite des sources de Claude Code révèle une mémoire à 4 couches plafonnée à
  200 lignes avec une recherche par grep uniquement. Voici comment chaque couche
  fonctionne et ce que memsearch corrige.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Le code source de Claude Code a été diffusé publiquement par accident. La version 2.1.88 incluait un fichier source de 59,8 Mo qui aurait dû être retiré de la compilation. Ce seul fichier contenait la base de code TypeScript complète et lisible - 512 000 lignes, maintenant reflétées sur GitHub.</p>
<p>Le <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">système de mémoire</a> a attiré notre attention. Claude Code est l'agent de codage IA le plus populaire sur le marché, et la mémoire est la partie avec laquelle la plupart des utilisateurs interagissent sans comprendre comment elle fonctionne sous le capot. Nous avons donc creusé la question.</p>
<p>La version courte : La mémoire de Claude Code est plus simple qu'il n'y paraît. Elle se limite à 200 lignes de notes. Elle ne peut trouver des mémoires que par correspondance exacte de mots-clés - si vous posez une question sur les "conflits de port", mais que la note dit "docker-compose mapping", vous n'obtiendrez rien. Et rien ne sort de Claude Code. Si vous changez d'agent, vous repartez de zéro.</p>
<p>Voici les quatre couches :</p>
<ul>
<li><strong>CLAUDE.md</strong> - un fichier que vous écrivez vous-même avec des règles que Claude doit suivre. Manuel, statique, et limité par ce que vous pensez écrire à l'avance.</li>
<li><strong>Mémoire automatique</strong> - Claude prend ses propres notes pendant les sessions. Utile, mais limité à un index de 200 lignes sans recherche par sens.</li>
<li><strong>Auto Dream</strong> - un processus de nettoyage en arrière-plan qui consolide les souvenirs désordonnés pendant que vous êtes inactif. Aide pour les souvenirs datant de plusieurs jours, mais ne permet pas de faire le lien entre les mois.</li>
<li><strong>KAIROS</strong> - un mode démon toujours actif qui n'a pas été publié et qui a été trouvé dans le code divulgué. Il n'existe pas encore de version publique.</li>
</ul>
<p>Ci-dessous, nous décomposons chaque couche, puis nous couvrons les points de rupture de l'architecture et ce que nous avons construit pour combler les lacunes.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Comment fonctionne CLAUDE.md ?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md est un fichier Markdown que vous créez et placez dans le dossier de votre projet. Vous le remplissez avec ce dont vous voulez que Claude se souvienne : règles de style de code, structure du projet, commandes de test, étapes de déploiement. Claude le charge au début de chaque session.</p>
<p>Il existe trois portées : au niveau du projet (à la racine du répertoire), personnel (<code translate="no">~/.claude/CLAUDE.md</code>) et organisationnel (configuration de l'entreprise). Les fichiers plus courts sont suivis de manière plus fiable.</p>
<p>La limite est évidente : CLAUDE.md ne contient que les choses que vous avez écrites à l'avance. Les décisions de débogage, les préférences que vous avez mentionnées au cours de la conversation, les cas limites que vous avez découverts ensemble - rien de tout cela n'est capturé à moins que vous ne vous arrêtiez et ne l'ajoutiez manuellement. La plupart des gens ne le font pas.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Comment fonctionne la mémoire automatique ?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>La Mémoire Automatique capture ce qui fait surface pendant le travail. Claude décide de ce qui mérite d'être conservé et l'écrit dans un dossier mémoire sur votre machine, organisé en quatre catégories : utilisateur (rôle et préférences), feedback (vos corrections), projet (décisions et contexte), et référence (où les choses sont conservées).</p>
<p>Chaque note est un fichier Markdown distinct. Le point d'entrée est <code translate="no">MEMORY.md</code> - un index où chaque ligne est une étiquette courte (moins de 150 caractères) qui pointe vers un fichier détaillé. Claude lit l'index, puis extrait des fichiers spécifiques lorsqu'ils semblent pertinents.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>Les 200 premières lignes de MEMORY.md sont chargées dans chaque session. Tout ce qui suit est invisible.</p>
<p>Un choix de conception intelligent : la fuite de l'invite du système indique à Claude de traiter sa propre mémoire comme une indication, et non comme un fait. Il vérifie le code réel avant d'agir sur ce dont il se souvient, ce qui permet de réduire les hallucinations - un modèle que d'autres <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">agents d'intelligence artificielle</a> commencent à adopter.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Comment Auto Dream consolide-t-il les souvenirs périmés ?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>La mémoire automatique capture des notes, mais après des semaines d'utilisation, ces notes deviennent périmées. Une entrée indiquant "le bug de déploiement d'hier" n'a plus de sens une semaine plus tard. Une note indique que vous utilisez PostgreSQL ; une note plus récente indique que vous avez migré vers MySQL. Les fichiers supprimés ont encore des entrées de mémoire. L'index se remplit de contradictions et de références obsolètes.</p>
<p>Auto Dream est le processus de nettoyage. Il s'exécute en arrière-plan et</p>
<ul>
<li>remplace les références temporelles vagues par des dates exactes. "Problème de déploiement d'hier" → "Problème de déploiement du 2026-03-28".</li>
<li>Résout les contradictions. Note PostgreSQL + note MySQL → conserve la vérité actuelle.</li>
<li>Supprime les entrées périmées. Les notes faisant référence à des fichiers supprimés ou à des tâches terminées sont supprimées.</li>
<li>Maintient <code translate="no">MEMORY.md</code> en dessous de 200 lignes.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Conditions de déclenchement :</strong> plus de 24 heures depuis le dernier nettoyage ET au moins 5 nouvelles sessions accumulées. Vous pouvez également taper "dream" pour l'exécuter manuellement. Le processus s'exécute dans un sous-agent d'arrière-plan - comme le sommeil réel, il n'interrompt pas votre travail actif.</p>
<p>L'invite système de l'agent de rêve commence par : <em>"Vous êtes en train de faire un rêve - un passage réflexif sur vos fichiers de mémoire".</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">Qu'est-ce que KAIROS ? Le mode Always-On inédit de Claude Code<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>Les trois premières couches sont opérationnelles ou en cours de déploiement. La fuite de code contient aussi quelque chose qui n'a pas encore été livré : KAIROS.</p>
<p>KAIROS - apparemment nommé d'après le mot grec pour "le bon moment" - apparaît plus de 150 fois dans le code source. Il transformerait Claude Code d'un outil que vous utilisez activement en un assistant d'arrière-plan qui surveille votre projet en permanence.</p>
<p>D'après le code divulgué, KAIROS :</p>
<ul>
<li>Tient un journal des observations, des décisions et des actions tout au long de la journée.</li>
<li>Il vérifie l'état d'avancement du projet à l'aide d'une minuterie. À intervalles réguliers, il reçoit un signal et décide d'agir ou de rester silencieux.</li>
<li>Reste en dehors de votre chemin. Toute action qui vous bloquerait pendant plus de 15 secondes est reportée.</li>
<li>Exécute le nettoyage des rêves en interne, ainsi qu'une boucle complète d'observation, de réflexion et d'action en arrière-plan.</li>
<li>Possède des outils exclusifs que Claude Code ne possède pas : pousser des fichiers vers vous, envoyer des notifications, surveiller vos requêtes GitHub.</li>
</ul>
<p>KAIROS est derrière un drapeau de fonctionnalité à la compilation. Il n'est dans aucune version publique. Pensez-y comme à Anthropic qui explore ce qui se passe quand la <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">mémoire d'un agent</a> cesse d'être session par session et devient toujours active.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Où se situe l'architecture de la mémoire de Claude Code ?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>La mémoire de Claude Code fait un vrai travail. Mais cinq limitations structurelles restreignent ce qu'elle peut gérer au fur et à mesure que les projets grandissent.</p>
<table>
<thead>
<tr><th>Limitation</th><th>Ce qui se passe</th></tr>
</thead>
<tbody>
<tr><td><strong>Un index de 200 lignes</strong></td><td><code translate="no">MEMORY.md</code> contient ~25 KB. Exécutez un projet pendant des mois, et les anciennes entrées sont remplacées par de nouvelles. "Quelle configuration Redis avons-nous choisie la semaine dernière ?" - disparaît.</td></tr>
<tr><td><strong>Récupération Grep uniquement</strong></td><td>La recherche en mémoire utilise la <a href="https://milvus.io/docs/full-text-search.md">correspondance</a> littérale <a href="https://milvus.io/docs/full-text-search.md">des mots-clés</a>. Vous vous souvenez de "deploy-time port conflicts", mais la note indique "docker-compose port mapping". Grep ne peut pas combler cette lacune.</td></tr>
<tr><td><strong>Résumés uniquement, pas de raisonnement</strong></td><td>La mémoire automatique enregistre des notes de haut niveau, mais pas les étapes de débogage ni le raisonnement qui vous a permis d'arriver à ce résultat. Le <em>comment</em> est perdu.</td></tr>
<tr><td><strong>La complexité s'accumule sans que les fondations soient réparées</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Chaque couche existe parce que la précédente n'était pas suffisante. Mais aucune couche ne change ce qu'il y a en dessous : un outil, des fichiers locaux, une capture session par session.</td></tr>
<tr><td><strong>La mémoire est enfermée dans le code Claude</strong></td><td>Passez à OpenCode, Codex CLI ou tout autre agent et vous repartez de zéro. Pas d'exportation, pas de format partagé, pas de portabilité.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce ne sont pas des bogues. Ce sont les limites naturelles d'un outil unique, d'une architecture de fichiers locaux. De nouveaux agents sont livrés chaque mois, les flux de travail changent, mais les connaissances que vous avez accumulées dans un projet ne devraient pas disparaître avec eux. C'est pourquoi nous avons créé <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">Qu'est-ce que memsearch ? Une mémoire persistante pour n'importe quel agent de codage d'IA<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> retire la mémoire de l'agent et la place dans sa propre couche. Les agents vont et viennent. La mémoire reste.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Comment installer memsearch</h3><p>Les utilisateurs de Claude Code installent memsearch à partir de la place de marché :</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>C'est fait. Aucune configuration n'est nécessaire.</p>
<p>Les autres plateformes sont tout aussi simples. OpenClaw : <code translate="no">openclaw plugins install clawhub:memsearch</code>. API Python via uv ou pip :</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">Qu'est-ce que memsearch capture ?</h3><p>Une fois installé, memsearch s'insère dans le cycle de vie de l'agent. Chaque conversation est résumée et indexée automatiquement. Lorsque vous posez une question qui nécessite un historique, le rappel se déclenche de lui-même.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les fichiers de mémoire sont stockés sous forme de Markdown daté - un fichier par jour :</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez ouvrir, lire et modifier les fichiers de mémoire dans n'importe quel éditeur de texte. Si vous voulez migrer, vous copiez le dossier. Si vous voulez un contrôle de version, git fonctionne nativement.</p>
<p>L'<a href="https://milvus.io/docs/index-explained.md">index vectoriel</a> stocké dans <a href="https://milvus.io/docs/overview.md">Milvus</a> est une couche de cache - s'il est perdu, vous le reconstruisez à partir des fichiers Markdown. Vos données vivent dans les fichiers, pas dans l'index.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Comment memsearch trouve-t-il les souvenirs ? Recherche sémantique contre Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche de mémoire de Claude Code utilise grep - la correspondance littérale des mots-clés. Cela fonctionne lorsque vous avez quelques dizaines de notes, mais cela ne fonctionne plus après des mois d'histoire lorsque vous ne vous souvenez plus de la formulation exacte.</p>
<p>memsearch utilise plutôt la <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">recherche hybride</a>. Les <a href="https://zilliz.com/glossary/semantic-search">vecteurs sémantiques</a> trouvent le contenu lié à votre requête même si la formulation est différente, tandis que BM25 correspond aux mots-clés exacts. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> fusionne et classe les deux ensembles de résultats ensemble.</p>
<p>Supposons que vous demandiez : "Comment avons-nous résolu le problème de dépassement de délai de Redis la semaine dernière ?" - la recherche sémantique comprend l'intention et la trouve. Si vous demandez &quot;search for <code translate="no">handleTimeout</code>&quot;, BM25 trouve le nom exact de la fonction. Les deux voies couvrent les angles morts l'une de l'autre.</p>
<p>Lorsque le rappel se déclenche, le sous-agent effectue une recherche en trois étapes, en allant plus loin uniquement si nécessaire :</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1 : Recherche sémantique - courts aperçus</h3><p>Le sous-agent exécute <code translate="no">memsearch search</code> par rapport à l'index Milvus et extrait les résultats les plus pertinents :</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Chaque résultat affiche un score de pertinence, le fichier source et un aperçu de 200 caractères. La plupart des requêtes s'arrêtent ici.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2 : Contexte complet - Développer un résultat spécifique</h3><p>Si l'aperçu de L1 n'est pas suffisant, le sous-agent exécute <code translate="no">memsearch expand a3f8c1</code> pour extraire l'entrée complète :</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3 : Transcription brute de la conversation</h3><p>Dans les rares cas où vous avez besoin de savoir exactement ce qui a été dit, l'agent secondaire extrait l'échange original :</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>La transcription conserve tout : vos mots exacts, la réponse exacte de l'agent et chaque appel d'outil. Les trois étapes vont du plus léger au plus lourd - le sous-agent décide de la profondeur d'exploration, puis renvoie les résultats organisés à votre session principale.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Comment memsearch partage-t-il la mémoire entre les agents de codage de l'IA ?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>C'est la différence la plus fondamentale entre memsearch et la mémoire de Claude Code.</p>
<p>La mémoire de Claude Code est enfermée dans un seul outil. Si vous utilisez OpenCode, OpenClaw ou Codex CLI, vous partez de zéro. MEMORY.md est local, lié à un utilisateur et à un agent.</p>
<p>memsearch supporte quatre agents de codage : Claude Code, OpenClaw, OpenCode et Codex CLI. Ils partagent le même format de mémoire Markdown et la même <a href="https://milvus.io/docs/manage-collections.md">collection Milvus</a>. Les mémoires écrites à partir de n'importe quel agent sont consultables à partir de tous les autres agents.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Deux scénarios réels :</strong></p>
<p><strong>Changement d'outil.</strong> Vous passez un après-midi dans Claude Code à comprendre le pipeline de déploiement, et vous rencontrez plusieurs problèmes. Les conversations sont résumées et indexées automatiquement. Le lendemain, vous passez à OpenCode et demandez "comment avons-nous résolu ce conflit de port hier ?". OpenCode fait une recherche dans memsearch, trouve les souvenirs de Claude Code d'hier et vous donne la bonne réponse.</p>
<p><strong>Collaboration d'équipe.</strong> Pointez le backend Milvus sur <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> et plusieurs développeurs sur différentes machines, utilisant différents agents, lisent et écrivent la même mémoire de projet. Un nouveau membre de l'équipe se joint à l'équipe et n'a pas besoin de fouiller dans des mois de Slack et de documentation - l'agent est déjà au courant.</p>
<h2 id="Developer-API" class="common-anchor-header">API pour les développeurs<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous construisez votre propre <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">outil d'agent</a>, memsearch fournit une CLI et une API Python.</p>
<p><strong>CLI :</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>API Python :</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sous le capot, Milvus gère la recherche vectorielle. Exécutez localement avec <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (configuration zéro), collaborez via <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (niveau gratuit disponible), ou hébergez vous-même avec Docker. L'<a href="https://milvus.io/docs/embeddings.md">intégration</a> se fait par défaut avec ONNX - s'exécute sur le CPU, pas besoin de GPU. Il est possible d'utiliser OpenAI ou Ollama à tout moment.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch : Comparaison complète<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Fonctionnalité</th><th>Mémoire du code Claude</th><th>recherche de mémoire</th></tr>
</thead>
<tbody>
<tr><td>Ce qui est sauvegardé</td><td>Ce que Claude considère comme important</td><td>Chaque conversation, résumée automatiquement</td></tr>
<tr><td>Limite de stockage</td><td>Index de ~200 lignes (~25 KB)</td><td>Illimité (fichiers quotidiens + index vectoriel)</td></tr>
<tr><td>Retrouver de vieux souvenirs</td><td>Correspondance de mots-clés Grep</td><td>Recherche hybride basée sur le sens et les mots-clés (Milvus)</td></tr>
<tr><td>Pouvez-vous les lire ?</td><td>Vérifier manuellement le dossier mémoire</td><td>Ouvrir n'importe quel fichier .md</td></tr>
<tr><td>Pouvez-vous les éditer ?</td><td>Editer les fichiers à la main</td><td>Idem - réindexation automatique lors de l'enregistrement</td></tr>
<tr><td>Contrôle de version</td><td>Pas conçu pour cela</td><td>git fonctionne nativement</td></tr>
<tr><td>Support inter-outils</td><td>Code Claude uniquement</td><td>4 agents, mémoire partagée</td></tr>
<tr><td>Rappel à long terme</td><td>Se dégrade après quelques semaines</td><td>Persistant pendant des mois</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Commencer avec memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>La mémoire de Claude Code a de réels atouts - la conception auto-sceptique, le concept de consolidation des rêves, et le budget de blocage de 15 secondes dans KAIROS. Anthropic réfléchit sérieusement à ce problème.</p>
<p>Mais la mémoire d'un seul outil a un plafond. Dès que votre flux de travail s'étend sur plusieurs agents, plusieurs personnes ou plus de quelques semaines d'histoire, vous avez besoin d'une mémoire qui existe par elle-même.</p>
<ul>
<li>Essayez <a href="https://github.com/zilliztech/memsearch">memsearch</a> - open source, sous licence MIT. Installer dans Claude Code avec deux commandes.</li>
<li>Lisez <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">comment memsearch fonctionne sous le capot</a> ou le <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">guide du plugin Claude Code</a>.</li>
<li>Vous avez des questions ? Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord de Milvus</a> ou <a href="https://milvus.io/office-hours">réservez une session Office Hours gratuite</a> pour discuter de votre cas d'utilisation.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Comment fonctionne le système de mémoire de Claude Code ?</h3><p>Claude Code utilise une architecture de mémoire à quatre niveaux, tous stockés sous forme de fichiers Markdown locaux. CLAUDE.md est un fichier de règles statiques que vous écrivez manuellement. Auto Memory permet à Claude de sauvegarder ses propres notes pendant les sessions, organisées en quatre catégories - préférences de l'utilisateur, retour d'information, contexte du projet et points de référence. Auto Dream consolide les mémoires périmées en arrière-plan. KAIROS est un démon toujours actif qui n'a pas été publié et qui a été trouvé dans la fuite du code source. L'ensemble du système est limité à un index de 200 lignes et n'est consultable que par correspondance exacte de mots clés - pas de recherche sémantique ni de rappel basé sur le sens.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Les agents de codage de l'IA peuvent-ils partager la mémoire entre différents outils ?</h3><p>Pas de manière native. La mémoire de Claude Code est verrouillée à Claude Code - il n'y a pas de format d'exportation ou de protocole inter-agents. Si vous passez à OpenCode, Codex CLI ou OpenClaw, vous repartez de zéro. memsearch résout ce problème en stockant les mémoires sous forme de fichiers Markdown datés indexés dans une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> (Milvus). Les quatre agents pris en charge lisent et écrivent la même mémoire, de sorte que le contexte est transféré automatiquement lorsque vous changez d'outil.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">Quelle est la différence entre la recherche par mot-clé et la recherche sémantique pour la mémoire des agents ?</h3><p>La recherche par mot-clé (grep) correspond à des chaînes exactes - si votre mémoire indique "docker-compose port mapping" mais que vous cherchez "port conflicts", elle ne renvoie rien. La recherche sémantique convertit le texte en <a href="https://zilliz.com/glossary/vector-embeddings">vecteurs</a> qui capturent le sens, de sorte que les concepts connexes correspondent même avec des formulations différentes. memsearch combine les deux approches avec la recherche hybride, vous donnant un rappel basé sur le sens et une précision de mot-clé exact dans une seule requête.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Qu'est-ce qui a été divulgué dans l'incident du code source de Claude Code ?</h3><p>La version 2.1.88 de Claude Code était livrée avec un fichier de code source de 59,8 Mo qui aurait dû être retiré de la version de production. Le fichier contenait la base de code TypeScript complète et lisible - environ 512 000 lignes - y compris l'implémentation complète du système de mémoire, le processus de consolidation Auto Dream, et des références à KAIROS, un mode d'agent toujours actif qui n'a pas encore été publié. Le code a été rapidement mis en miroir sur GitHub avant qu'il ne puisse être supprimé.</p>
