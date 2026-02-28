---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: >-
  Pourquoi les agents d'IA comme OpenClaw brûlent-ils les jetons et comment
  réduire les coûts ?
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Pourquoi les factures de jetons d'OpenClaw et d'autres agents d'IA grimpent en
  flèche, et comment y remédier avec BM25 + récupération vectorielle (index1,
  QMD, Milvus) et la mémoire Markdown-first (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p>Si vous avez passé un peu de temps avec <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (anciennement Clawdbot et Moltbot), vous savez déjà à quel point cet agent d'intelligence artificielle est bon. Il est rapide, local, flexible et capable de réaliser des flux de travail étonnamment complexes à travers Slack, Discord, votre base de code et pratiquement tout ce à quoi vous l'associez. Mais une fois que vous commencez à l'utiliser sérieusement, un modèle émerge rapidement : <strong>votre utilisation de jetons commence à grimper</strong>.</p>
<p>Ce n'est pas la faute d'OpenClaw en particulier - c'est la façon dont la plupart des agents d'intelligence artificielle se comportent aujourd'hui. Ils déclenchent un appel LLM pour presque tout : rechercher un fichier, planifier une tâche, écrire une note, exécuter un outil ou poser une question de suivi. Et comme les jetons sont la monnaie universelle de ces appels, chaque action a un coût.</p>
<p>Pour comprendre d'où vient ce coût, nous devons regarder sous le capot deux grands contributeurs :</p>
<ul>
<li><strong>La recherche :</strong> Les recherches mal construites génèrent des charges utiles de contexte étendues - des fichiers entiers, des journaux, des messages et des régions de code dont le modèle n'a pas réellement besoin.</li>
<li><strong>La mémoire :</strong> Le stockage d'informations sans importance oblige l'agent à les relire et à les retraiter lors d'appels ultérieurs, ce qui augmente l'utilisation des jetons au fil du temps.</li>
</ul>
<p>Ces deux problèmes augmentent silencieusement les coûts opérationnels sans améliorer les capacités.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Comment les agents d'IA comme OpenClaw effectuent-ils des recherches - et pourquoi cela consomme-t-il des jetons ?<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'un agent a besoin d'informations provenant de votre base de code ou de votre bibliothèque de documents, il effectue généralement l'équivalent d'un <strong>Ctrl+F</strong> à l'échelle du projet. Chaque ligne correspondante est retournée - sans classement, sans filtrage et sans priorité. Claude Code implémente ceci à travers un outil Grep dédié construit sur ripgrep. OpenClaw n'a pas d'outil de recherche de base de code intégré, mais son outil exec permet au modèle sous-jacent d'exécuter n'importe quelle commande, et les compétences chargées peuvent guider l'agent dans l'utilisation d'outils tels que rg. Dans les deux cas, la recherche dans la base de code renvoie des correspondances de mots clés non classées et non filtrées.</p>
<p>Cette approche brute fonctionne bien dans les petits projets. Mais au fur et à mesure que les référentiels s'étoffent, le prix augmente. Les correspondances non pertinentes s'empilent dans la fenêtre contextuelle du LLM, obligeant le modèle à lire et à traiter des milliers de tokens dont il n'a pas réellement besoin. Une seule recherche non ciblée peut entraîner des fichiers complets, d'énormes blocs de commentaires ou des journaux qui partagent un mot-clé mais pas l'intention sous-jacente. Répétez ce schéma au cours d'une longue session de débogage ou de recherche, et la masse s'accumule rapidement.</p>
<p>OpenClaw et Claude Code tentent tous deux de gérer cette croissance. OpenClaw élague les sorties d'outils surdimensionnées et compacte les longs historiques de conversation, tandis que Claude Code limite les sorties de lecture de fichiers et prend en charge le compactage du contexte. Ces mesures d'atténuation fonctionnent, mais seulement après l'exécution de la requête surchargée. Les résultats de recherche non classés ont encore consommé des jetons, et vous avez encore payé pour les obtenir. La gestion du contexte est utile pour les requêtes futures, et non pour l'appel original qui a généré le gaspillage.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Comment fonctionne la mémoire des agents d'IA et pourquoi elle coûte aussi des jetons<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche n'est pas la seule source de surcharge de jetons. Chaque élément de contexte qu'un agent rappelle de sa mémoire doit également être chargé dans la fenêtre de contexte du LLM, ce qui coûte également des jetons.</p>
<p>Les API LLM sur lesquelles la plupart des agents s'appuient aujourd'hui sont sans état : L'API Messages d'Anthropic requiert l'historique complet de la conversation à chaque demande, et l'API Chat Completions d'OpenAI fonctionne de la même manière. Même l'API Responses d'OpenAI, plus récente et avec état, qui gère l'état de la conversation côté serveur, facture toujours la fenêtre de contexte complète à chaque appel. La mémoire chargée dans le contexte coûte des jetons, quelle que soit la manière dont elle y parvient.</p>
<p>Pour contourner ce problème, les structures d'agents écrivent des notes dans des fichiers sur le disque et chargent les notes pertinentes dans la fenêtre contextuelle lorsque l'agent en a besoin. Par exemple, OpenClaw stocke les notes conservées dans MEMORY.md et ajoute les journaux quotidiens aux fichiers Markdown horodatés, puis les indexe à l'aide d'une recherche hybride BM25 et vectorielle afin que l'agent puisse rappeler le contexte pertinent à la demande.</p>
<p>La conception de la mémoire d'OpenClaw fonctionne bien, mais elle nécessite tout l'écosystème d'OpenClaw : le processus Gateway, les connexions à la plate-forme de messagerie et le reste de la pile. Il en va de même pour la mémoire de Claude Code, qui est liée à son CLI. Si vous construisez un agent personnalisé en dehors de ces plateformes, vous avez besoin d'une solution autonome. La section suivante couvre les outils disponibles pour ces deux problèmes.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Comment empêcher OpenClaw de brûler des tokens ?<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous souhaitez réduire le nombre de tokens consommés par OpenClaw, vous pouvez agir sur deux leviers.</p>
<ul>
<li>Le premier est une <strong>meilleure récupération</strong> - en remplaçant les vidages de mots clés de type grep par des outils de recherche classés et axés sur la pertinence, de sorte que le modèle ne voit que les informations qui comptent réellement.</li>
<li>Le second est une <strong>meilleure mémoire</strong> - passer d'un stockage opaque et dépendant du cadre à quelque chose que vous pouvez comprendre, inspecter et contrôler.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Remplacer grep par une meilleure récupération : index1, QMD et Milvus</h3><p>De nombreux agents de codage d'IA recherchent des bases de code à l'aide de grep ou de ripgrep. Claude Code dispose d'un outil Grep dédié, basé sur ripgrep. OpenClaw n'a pas d'outil de recherche de base de code intégré, mais son outil exec permet au modèle sous-jacent d'exécuter n'importe quelle commande, et des compétences telles que ripgrep ou QMD peuvent être chargées pour guider la recherche de l'agent. Sans compétence axée sur la recherche, l'agent se rabat sur l'approche choisie par le modèle sous-jacent. Le problème de base est le même pour tous les agents : sans recherche classée, les correspondances de mots-clés entrent dans la fenêtre contextuelle sans être filtrées.</p>
<p>Cela fonctionne lorsqu'un projet est suffisamment petit pour que chaque correspondance tienne confortablement dans la fenêtre contextuelle. Le problème commence lorsqu'une base de code ou une bibliothèque de documents s'agrandit au point qu'un mot clé renvoie des dizaines ou des centaines d'occurrences et que l'agent doit toutes les charger dans l'invite. À cette échelle, vous avez besoin de résultats classés par pertinence, et pas seulement filtrés par correspondance.</p>
<p>La solution standard est la recherche hybride, qui combine deux méthodes de classement complémentaires :</p>
<ul>
<li>BM25 évalue chaque résultat en fonction de la fréquence et de l'unicité d'apparition d'un terme dans un document donné. Un fichier ciblé qui mentionne 15 fois le terme "authentification" est mieux classé qu'un fichier volumineux qui ne le mentionne qu'une fois.</li>
<li>La recherche vectorielle convertit le texte en représentations numériques du sens, de sorte que "authentification" peut correspondre à "flux de connexion" ou "gestion de session" même s'ils ne partagent aucun mot-clé.</li>
</ul>
<p>Aucune de ces méthodes n'est suffisante à elle seule : BM25 ne tient pas compte des termes paraphrasés et la recherche vectorielle ne tient pas compte des termes exacts tels que les codes d'erreur. La combinaison des deux méthodes et la fusion des listes classées à l'aide d'un algorithme de fusion permettent de combler ces deux lacunes.</p>
<p>Les outils ci-dessous mettent en œuvre ce modèle à différentes échelles. Grep est l'outil de base avec lequel tout le monde commence. index1, QMD et Milvus ajoutent chacun une recherche hybride avec une capacité croissante.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1 : recherche hybride rapide sur une seule machine</h4><p><a href="https://github.com/gladego/index1">index1</a> est un outil CLI qui regroupe la recherche hybride dans un seul fichier de base de données SQLite. FTS5 gère BM25, sqlite-vec gère la similarité vectorielle, et RRF fusionne les listes classées. Les embeddings sont générés localement par Ollama, donc rien ne sort de votre machine.</p>
<p>index1 découpe le code par structure, et non par nombre de lignes : Les fichiers Markdown sont divisés par des titres, les fichiers Python par AST, JavaScript et TypeScript par des motifs regex. Cela signifie que les résultats de la recherche renvoient des unités cohérentes telles qu'une fonction complète ou une section de documentation complète, et non des plages de lignes arbitraires qui se coupent au milieu du bloc. Le temps de réponse est de 40 à 180 ms pour les requêtes hybrides. Sans Ollama, il se réduit à BM25-only, qui classe toujours les résultats au lieu de déverser chaque correspondance dans la fenêtre contextuelle.</p>
<p>index1 comprend également un module de mémoire épisodique pour stocker les leçons apprises, les causes profondes des bogues et les décisions architecturales. Ces mémoires vivent dans la même base de données SQLite que l'index du code plutôt que dans des fichiers autonomes.</p>
<p>Note : index1 est un projet à un stade précoce (0 étoiles, 4 commits en février 2026). Évaluez-le par rapport à votre propre base de code avant de vous engager.</p>
<ul>
<li><strong>Idéal pour</strong>: les développeurs solitaires ou les petites équipes avec une base de code qui tient sur une seule machine, à la recherche d'une amélioration rapide par rapport à grep.</li>
<li><strong>Dépassez-le lorsque</strong>: vous avez besoin d'un accès multi-utilisateurs au même index, ou vos données dépassent ce qu'un seul fichier SQLite peut gérer confortablement.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD : une plus grande précision grâce au reclassement local de LLM</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), créé par Tobi Lütke, fondateur de Shopify, ajoute une troisième étape : Le reclassement LLM. Après que BM25 et la recherche vectorielle ont renvoyé des candidats, un modèle linguistique local relit les meilleurs résultats et les réorganise en fonction de leur pertinence réelle par rapport à votre requête. Cela permet d'identifier les cas où les correspondances entre mots-clés et sémantiques renvoient des résultats plausibles mais erronés.</p>
<p>QMD s'exécute entièrement sur votre machine à l'aide de trois modèles GGUF totalisant environ 2 Go : un modèle d'intégration (embeddinggemma-300M), un reranker à codeur croisé (Qwen3-Reranker-0.6B) et un modèle d'expansion de requête (qmd-query-expansion-1.7B). Ces trois éléments se téléchargent automatiquement lors de la première exécution. Pas d'appels API dans le nuage, pas de clés API.</p>
<p>La contrepartie est le temps de démarrage à froid : le chargement de trois modèles à partir du disque prend environ 15 à 16 secondes. QMD prend en charge un mode serveur persistant (qmd mcp) qui conserve les modèles en mémoire entre les requêtes, éliminant ainsi la pénalité de démarrage à froid en cas de requêtes répétées.</p>
<ul>
<li><strong>Idéal pour : les</strong> environnements où le respect de la vie privée est primordial, où aucune donnée ne peut quitter votre machine et où la précision de la recherche importe plus que le temps de réponse.</li>
<li><strong>Dépassez-le lorsque :</strong> vous avez besoin de réponses inférieures à la seconde, d'un accès partagé en équipe, ou que votre ensemble de données dépasse la capacité d'une seule machine.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus : recherche hybride à l'échelle de l'équipe et de l'entreprise</h4><p>Les outils à machine unique ci-dessus fonctionnent bien pour les développeurs individuels, mais ils atteignent leurs limites lorsque plusieurs personnes ou agents ont besoin d'accéder à la même base de connaissances. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> est une base de données vectorielles open-source conçue pour l'étape suivante : distribuée, multi-utilisateurs et capable de gérer des milliards de vecteurs.</p>
<p>Sa principale caractéristique pour ce cas d'utilisation est l'intégration de Sparse-BM25, disponible depuis Milvus 2.5 et nettement plus rapide dans la version 2.6. Vous fournissez du texte brut et Milvus le tokenise en interne à l'aide d'un analyseur construit sur tantivy, puis convertit le résultat en vecteurs épars qui sont précalculés et stockés au moment de l'indexation.</p>
<p>La représentation BM25 étant déjà stockée, la recherche n'a pas besoin de recalculer les scores à la volée. Ces vecteurs épars cohabitent avec les vecteurs denses (encastrements sémantiques) dans la même collection. Au moment de l'interrogation, vous fusionnez les deux signaux avec un classificateur tel que RRFRanker, que Milvus fournit d'emblée. Même modèle de recherche hybride qu'index1 et QMD, mais fonctionnant sur une infrastructure qui s'étend horizontalement.</p>
<p>Milvus offre également des fonctionnalités que les outils à machine unique ne peuvent pas offrir : isolation multi-locataires (bases de données ou collections distinctes par équipe), réplication des données avec basculement automatique et hiérarchisation des données chaudes/froides pour un stockage rentable. Pour les agents, cela signifie que plusieurs développeurs ou plusieurs instances d'agents peuvent interroger simultanément la même base de connaissances sans empiéter sur les données des autres.</p>
<ul>
<li><strong>Idéal pour</strong>: plusieurs développeurs ou agents partageant une base de connaissances, des ensembles de documents volumineux ou à croissance rapide, ou des environnements de production nécessitant une réplication, un basculement et un contrôle d'accès.</li>
</ul>
<p>En résumé :</p>
<table>
<thead>
<tr><th>Outil</th><th>Étape</th><th>Déploiement</th><th>Signal de migration</th></tr>
</thead>
<tbody>
<tr><td>Claude Native Grep</td><td>Prototypage</td><td>Intégré, aucune configuration</td><td>Les factures augmentent ou les requêtes ralentissent</td></tr>
<tr><td>index1</td><td>Machine unique (vitesse)</td><td>SQLite local + Ollama</td><td>Besoin d'un accès multi-utilisateurs ou les données dépassent la capacité d'une seule machine</td></tr>
<tr><td>QMD</td><td>Machine unique (précision)</td><td>Trois modèles GGUF locaux</td><td>Besoin d'index partagés par l'équipe</td></tr>
<tr><td>Milvus</td><td>Équipe ou production</td><td>Cluster distribué</td><td>Grands ensembles de documents ou exigences multi-locataires</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Réduire les coûts des jetons des agents d'IA en leur donnant une mémoire persistante et modifiable avec memsearch</h3><p>L'optimisation de la recherche réduit le gaspillage de jetons par requête, mais elle n'est d'aucune utilité pour ce que l'agent conserve entre les sessions.</p>
<p>Chaque élément de contexte qu'un agent se rappelle de sa mémoire doit être chargé dans l'invite, ce qui coûte également des jetons. La question n'est pas de savoir s'il faut stocker la mémoire, mais comment. La méthode de stockage détermine si vous pouvez voir ce dont l'agent se souvient, le réparer en cas d'erreur et l'emporter avec vous si vous changez d'outil.</p>
<p>La plupart des frameworks échouent sur ces trois points. Mem0 et Zep stockent tout dans une base de données vectorielle, ce qui fonctionne pour la récupération, mais rend la mémoire :</p>
<ul>
<li><strong>Opaque.</strong> Vous ne pouvez pas voir ce dont l'agent se souvient sans interroger une API.</li>
<li><strong>Difficile à modifier.</strong> La correction ou la suppression d'une mémoire nécessite des appels à l'API, et non l'ouverture d'un fichier.</li>
<li><strong>Verrouillée.</strong> Changer de cadre signifie exporter, convertir et réimporter vos données.</li>
</ul>
<p>OpenClaw adopte une approche différente. Toutes les mémoires sont stockées dans des fichiers Markdown sur le disque. L'agent écrit automatiquement des journaux quotidiens et les humains peuvent ouvrir et modifier directement n'importe quel fichier de mémoire. Cela résout les trois problèmes : la mémoire est lisible, modifiable et portable de par sa conception.</p>
<p>La contrepartie est un surcoût de déploiement. Exécuter la mémoire d'OpenClaw signifie exécuter tout l'écosystème d'OpenClaw : le processus Gateway, les connexions à la plate-forme de messagerie et le reste de la pile. Pour les équipes qui utilisent déjà OpenClaw, c'est très bien. Pour tous les autres, la barrière est trop importante. <strong>memsearch</strong> a été conçu pour combler cette lacune : il extrait le modèle de mémoire Markdown-first d'OpenClaw dans une bibliothèque autonome qui fonctionne avec n'importe quel agent.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, conçu par Zilliz (l'équipe à l'origine de Milvus), traite les fichiers Markdown comme une source unique de vérité. Un MEMORY.md contient des faits et des décisions à long terme que vous écrivez à la main. Les journaux quotidiens (2026-02-26.md) sont générés automatiquement à partir des résumés de session. L'index vectoriel, stocké dans Milvus, est une couche dérivée qui peut être reconstruite à tout moment à partir du document Markdown.</p>
<p>En pratique, cela signifie que vous pouvez ouvrir n'importe quel fichier mémoire dans un éditeur de texte, lire exactement ce que l'agent sait, et le modifier. Sauvegardez le fichier, et l'observateur de fichiers de memsearch détecte le changement et réindexe automatiquement. Vous pouvez gérer les mémoires avec Git, examiner les mémoires générées par l'IA par le biais de demandes d'extraction, ou passer à une nouvelle machine en copiant un dossier. Si l'index Milvus est perdu, vous le reconstruisez à partir des fichiers. Les fichiers ne sont jamais en danger.</p>
<p>Sous le capot, memsearch utilise le même modèle de recherche hybride que celui décrit ci-dessus : morceaux divisés par la structure des titres et les limites des paragraphes, récupération BM25 + vecteur, et une commande compacte alimentée par LLM qui résume les anciens souvenirs lorsque les journaux deviennent volumineux.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Idéal pour : les équipes qui veulent une visibilité totale sur ce que l'agent se souvient, qui ont besoin d'un contrôle de version sur la mémoire, ou qui veulent un système de mémoire qui n'est pas lié à une structure d'agent unique.</p>
<p>En résumé :</p>
<table>
<thead>
<tr><th>Capacité</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Source de vérité</td><td>Base de données vectorielle (seule source de données)</td><td>Fichiers Markdown (primaires) + Milvus (index)</td></tr>
<tr><td>Transparence</td><td>Boîte noire, nécessite une API pour l'inspecter</td><td>Ouvrir n'importe quel fichier .md pour le lire</td></tr>
<tr><td>Éditabilité</td><td>Modifier via des appels API</td><td>Modifier directement dans n'importe quel éditeur de texte, réindexation automatique</td></tr>
<tr><td>Contrôle des versions</td><td>Nécessite une journalisation d'audit séparée</td><td>Git fonctionne nativement</td></tr>
<tr><td>Coût de la migration</td><td>Exporter → convertir le format → réimporter</td><td>Copier le dossier Markdown</td></tr>
<tr><td>Collaboration entre l'homme et l'IA</td><td>L'IA écrit, les humains observent</td><td>Les humains peuvent modifier, compléter et réviser</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Quelle configuration s'adapte à votre échelle ?<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Scénario</th><th>Recherche</th><th>Mémoire</th><th>Quand passer à autre chose</th></tr>
</thead>
<tbody>
<tr><td>Premier prototype</td><td>Grep (intégré)</td><td>-</td><td>Les factures augmentent ou les requêtes ralentissent</td></tr>
<tr><td>Développeur unique, recherche uniquement</td><td><a href="https://github.com/gladego/index1">index1</a> (vitesse) ou <a href="https://github.com/tobi/qmd">QMD</a> (précision)</td><td>-</td><td>Besoin d'un accès multi-utilisateurs ou les données dépassent les capacités d'une seule machine</td></tr>
<tr><td>Un seul développeur, les deux</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">recherche de mémoire</a></td><td>Besoin d'un accès multi-utilisateurs ou les données dépassent la capacité d'une machine</td></tr>
<tr><td>Équipe ou production, les deux</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>Intégration rapide, mémoire seulement</td><td>-</td><td>Mem0 ou Zep</td><td>Besoin d'inspecter, d'éditer ou de migrer des mémoires</td></tr>
</tbody>
</table>
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
    </button></h2><p>Les coûts symboliques qui accompagnent les agents d'IA toujours actifs ne sont pas inévitables. Ce guide a couvert deux domaines où de meilleurs outils peuvent réduire le gaspillage : la recherche et la mémoire.</p>
<p>Grep fonctionne à petite échelle, mais lorsque les bases de code augmentent, les correspondances de mots clés non classées inondent la fenêtre de contexte avec du contenu dont le modèle n'a jamais eu besoin. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> et <a href="https://github.com/tobi/qmd"></a> QMD résolvent ce problème sur une seule machine en combinant l'évaluation des mots clés BM25 avec la recherche vectorielle et en renvoyant uniquement les résultats les plus pertinents. Pour les équipes, les configurations multi-agents ou les charges de travail de production, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> fournit le même modèle de recherche hybride sur une infrastructure qui évolue horizontalement.</p>
<p>Pour la mémoire, la plupart des frameworks stockent tout dans une base de données vectorielle : opaque, difficile à modifier à la main et verrouillée par le framework qui l'a créée. <a href="https://github.com/zilliztech/memsearch">memsearch</a> adopte une approche différente. La mémoire est stockée dans des fichiers Markdown que vous pouvez lire, éditer et contrôler avec Git. Milvus sert d'index dérivé qui peut être reconstruit à partir de ces fichiers à tout moment. Vous gardez le contrôle de ce que l'agent sait.</p>
<p><a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> et <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> sont tous deux des logiciels libres. Nous développons activement memsearch et serions ravis de recevoir les commentaires de ceux qui l'utilisent en production. Ouvrez un problème, soumettez un PR, ou dites-nous simplement ce qui fonctionne et ce qui ne fonctionne pas.</p>
<p>Projets mentionnés dans ce guide :</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Mémoire Markdown-first pour les agents IA, soutenue par Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Base de données vectorielle open-source pour la recherche hybride évolutive.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: Recherche hybride BM25 + vecteur pour les agents de codage de l'IA.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Recherche hybride locale avec reclassement LLM.</li>
</ul>
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en open-source (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Mémoire persistante pour le code Claude : memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Guide complet de l'agent d'intelligence artificielle open-source</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutoriel OpenClaw : Se connecter à Slack pour un assistant IA local</a></li>
</ul>
