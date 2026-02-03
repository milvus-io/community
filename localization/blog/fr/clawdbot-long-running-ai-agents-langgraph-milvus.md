---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Pourquoi Clawdbot est devenu viral - et comment construire des agents longue
  durée prêts à produire avec LangGraph et Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot a prouvé que les gens veulent une IA qui agit. Apprenez à construire
  des agents de longue durée prêts à la production avec l'architecture à deux
  agents, Milvus et LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (désormais OpenClaw) est devenu viral<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, rebaptisé OpenClaw, a pris d'assaut l'internet la semaine dernière. L'assistant IA open-source créé par Peter Steinberger a atteint <a href="https://github.com/openclaw/openclaw">plus de 110 000 étoiles GitHub</a> en quelques jours. Les utilisateurs ont posté des vidéos montrant l'assistant en train de s'enregistrer de manière autonome pour prendre l'avion, de gérer les courriels et de contrôler les appareils domestiques intelligents. Andrej Karpathy, ingénieur fondateur d'OpenAI, en a fait l'éloge. David Sacks, fondateur et investisseur de Tech, a tweeté à son sujet. Les gens l'ont appelé "Jarvis, mais en vrai".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Puis sont venus les avertissements de sécurité.</p>
<p>Les chercheurs ont trouvé des centaines de panneaux d'administration exposés. Le bot fonctionne par défaut avec un accès root. Il n'y a pas de bac à sable. Les vulnérabilités liées à l'injection d'invites pourraient permettre aux attaquants de détourner l'agent. Un cauchemar pour la sécurité.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot est devenu viral pour une raison bien précise<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot est devenu viral pour une bonne raison.</strong> Il fonctionne localement ou sur votre propre serveur. Il se connecte aux applications de messagerie que les gens utilisent déjà - WhatsApp, Slack, Telegram, iMessage. Il se souvient du contexte au fil du temps au lieu de tout oublier après chaque réponse. Il gère les calendriers, résume les courriels et automatise les tâches entre les applications.</p>
<p>Les utilisateurs ont l'impression d'avoir affaire à une IA personnelle autonome et toujours active, et non à un simple outil d'assistance et de réponse. Son modèle open-source et auto-hébergé séduit les développeurs qui souhaitent contrôler et personnaliser l'application. Et la facilité d'intégration avec les flux de travail existants facilite le partage et la recommandation.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Deux défis pour la création d'agents à long terme<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La popularité de Clawdbot prouve que les gens veulent une IA qui</strong> <em>agit</em><strong>, et pas seulement qui répond.</strong> Mais tout agent qui fonctionne sur de longues périodes et accomplit des tâches réelles - qu'il s'agisse de Clawdbot ou d'un agent que vous construisez vous-même - doit relever deux défis techniques : la <strong>mémoire</strong> et la <strong>vérification</strong>.</p>
<p><strong>Le problème de la mémoire</strong> se manifeste de multiples façons :</p>
<ul>
<li><p>Les agents épuisent leur fenêtre contextuelle en cours de tâche et laissent derrière eux un travail à moitié terminé</p></li>
<li><p>Ils perdent de vue la liste complète des tâches et déclarent "terminé" trop tôt.</p></li>
<li><p>Ils ne peuvent pas transférer le contexte entre les sessions, de sorte que chaque nouvelle session repart à zéro.</p></li>
</ul>
<p>Tous ces problèmes ont la même origine : les agents n'ont pas de mémoire persistante. Les fenêtres de contexte sont finies, la récupération entre les sessions est limitée et les progrès ne sont pas suivis d'une manière à laquelle les agents peuvent accéder.</p>
<p><strong>Le problème de la vérification</strong> est différent. Même lorsque la mémoire fonctionne, les agents continuent de marquer les tâches comme achevées après un rapide test unitaire, sans vérifier si la fonctionnalité fonctionne réellement de bout en bout.</p>
<p>Clawdbot s'attaque à ces deux problèmes. Il stocke la mémoire localement au fil des sessions et utilise des "compétences" modulaires pour automatiser les navigateurs, les fichiers et les services externes. L'approche fonctionne. Mais elle n'est pas prête pour la production. Pour une utilisation en entreprise, vous avez besoin d'une structure, d'une auditabilité et d'une sécurité que Clawdbot n'offre pas d'emblée.</p>
<p>Cet article couvre les mêmes problèmes avec des solutions prêtes pour la production.</p>
<p>Pour la mémoire, nous utilisons une <strong>architecture à deux agents</strong> basée sur les <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">recherches d'Anthropic</a>: un agent initialisateur qui décompose les projets en caractéristiques vérifiables, et un agent codeur qui les traite un par un avec des transferts propres. Pour le rappel sémantique entre les sessions, nous utilisons <a href="https://milvus.io/">Milvus</a>, une base de données vectorielle qui permet aux agents d'effectuer des recherches en fonction du sens et non des mots-clés.</p>
<p>Pour la vérification, nous utilisons l'<strong>automatisation du navigateur</strong>. Au lieu de faire confiance aux tests unitaires, l'agent teste les fonctionnalités comme le ferait un véritable utilisateur.</p>
<p>Nous présenterons les concepts, puis nous montrerons une implémentation pratique utilisant <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> et Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Comment l'architecture à deux agents empêche l'épuisement du contexte<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Chaque LLM a une fenêtre de contexte : une limite sur la quantité de texte qu'il peut traiter en même temps. Lorsqu'un agent travaille sur une tâche complexe, cette fenêtre se remplit de code, de messages d'erreur, d'historique de conversation et de documentation. Lorsque la fenêtre est pleine, l'agent s'arrête ou commence à oublier le contexte antérieur. Pour les tâches de longue durée, ce phénomène est inévitable.</p>
<p>Prenons l'exemple d'un agent à qui l'on donnerait une simple instruction : "Construire un clone de claude.ai". Le projet nécessite une authentification, des interfaces de chat, un historique des conversations, des réponses en continu et des dizaines d'autres fonctionnalités. Un seul agent essaiera de tout faire en même temps. À mi-chemin de l'implémentation de l'interface de chat, la fenêtre contextuelle se remplit. La session se termine avec un code à moitié écrit, aucune documentation sur ce qui a été tenté et aucune indication sur ce qui fonctionne et ce qui ne fonctionne pas. La session suivante hérite d'un gâchis. Même avec le compactage du contexte, le nouvel agent doit deviner ce que faisait la session précédente, déboguer le code qu'il n'a pas écrit et trouver où reprendre. Des heures sont perdues avant que de nouveaux progrès ne soient réalisés.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">La solution de l'agent double</h3><p>La solution d'Anthropic, décrite dans leur article <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents",</a> est d'utiliser deux modes d'invite différents : <strong>une invite d'initialisation</strong> pour la première session et une <strong>invite de codage</strong> pour les sessions suivantes.</p>
<p>Techniquement, les deux modes utilisent le même agent sous-jacent, la même invite système, les mêmes outils et le même harnais. La seule différence réside dans l'invite initiale de l'utilisateur. Mais comme ils jouent des rôles distincts, il est utile de les considérer comme deux agents distincts. C'est ce que nous appelons l'architecture à deux agents.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>L'initialisateur met en place l'environnement nécessaire à un progrès progressif.</strong> Il prend une demande vague et fait trois choses :</p>
<ul>
<li><p><strong>Il décompose le projet en fonctionnalités spécifiques et vérifiables.</strong> Il ne s'agit pas d'exigences vagues comme "créer une interface de discussion", mais d'étapes concrètes et testables : "L'utilisateur clique sur le bouton Nouveau chat → une nouvelle conversation apparaît dans la barre latérale → la zone de chat affiche l'état de bienvenue. L'exemple du clone claude.ai d'Anthropic comportait plus de 200 fonctionnalités de ce type.</p></li>
<li><p><strong>Crée un fichier de suivi de la progression.</strong> Ce fichier enregistre l'état d'avancement de chaque fonctionnalité, de sorte que chaque session peut voir ce qui a été fait et ce qui reste à faire.</p></li>
<li><p><strong>Écrire des scripts d'installation et faire un premier commit git.</strong> Les scripts tels que <code translate="no">init.sh</code> permettent aux sessions futures de démarrer rapidement l'environnement de développement. Le commit git établit une base de référence propre.</p></li>
</ul>
<p>L'initialisateur ne se contente pas de planifier. Il crée une infrastructure qui permet aux futures sessions de commencer à travailler immédiatement.</p>
<p><strong>L'agent de codage</strong> gère toutes les sessions suivantes. Il :</p>
<ul>
<li><p>lit le fichier de progression et les journaux git pour comprendre l'état actuel</p></li>
<li><p>Exécute un test de base de bout en bout pour confirmer que l'application fonctionne toujours.</p></li>
<li><p>Choisit une fonctionnalité sur laquelle travailler</p></li>
<li><p>Implémente la fonctionnalité, la teste complètement, la commite sur git avec un message descriptif, et met à jour le fichier de progression.</p></li>
</ul>
<p>Lorsque la session se termine, la base de code est dans un état qui peut être fusionné : pas de bogues majeurs, un code ordonné, une documentation claire. Il n'y a pas de travail à moitié terminé ni de mystère sur ce qui a été fait. La session suivante reprend exactement là où celle-ci s'est arrêtée.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Utiliser JSON pour le suivi des fonctionnalités, pas Markdown</h3><p><strong>Un détail d'implémentation qui mérite d'être noté : la liste des fonctionnalités doit être en JSON, et non en Markdown.</strong></p>
<p>Lors de l'édition de JSON, les modèles d'IA ont tendance à modifier chirurgicalement des champs spécifiques. Lorsqu'ils éditent du Markdown, ils réécrivent souvent des sections entières. Avec une liste de plus de 200 fonctionnalités, les modifications en Markdown peuvent accidentellement corrompre votre suivi des progrès.</p>
<p>Une entrée JSON ressemble à ceci :</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Chaque fonctionnalité comporte des étapes de vérification claires. Le champ <code translate="no">passes</code> permet de suivre l'achèvement de la tâche. Il est également recommandé de formuler des instructions fermes telles que "Il est inacceptable de supprimer ou de modifier des tests car cela pourrait entraîner des fonctionnalités manquantes ou des bogues" afin d'empêcher l'agent de jouer avec le système en supprimant des fonctionnalités difficiles.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Comment Milvus donne aux agents une mémoire sémantique entre les sessions<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>L'architecture à deux agents résout le problème de l'épuisement du contexte, mais pas celui de l'oubli.</strong> Même si les transferts entre les sessions se font sans problème, l'agent perd la trace de ce qu'il a appris. Il ne peut pas se rappeler que les "jetons de rafraîchissement JWT" sont liés à l'"authentification de l'utilisateur" à moins que ces mots exacts n'apparaissent dans le fichier de progression. Au fur et à mesure que le projet grandit, la recherche dans des centaines de commits git devient lente. La correspondance des mots-clés ne permet pas d'établir des liens qui seraient évidents pour un humain.</p>
<p><strong>C'est là que les bases de données vectorielles entrent en jeu.</strong> Au lieu de stocker du texte et de rechercher des mots-clés, une base de données vectorielle convertit le texte en représentations numériques de la signification. Lorsque vous recherchez "authentification de l'utilisateur", elle trouve des entrées concernant les "jetons de rafraîchissement JWT" et la "gestion de la session de connexion". Ce n'est pas parce que les mots correspondent, mais parce que les concepts sont sémantiquement proches. L'agent peut demander "ai-je déjà vu quelque chose comme ça ?" et obtenir une réponse utile.</p>
<p><strong>En pratique, cela fonctionne en intégrant les enregistrements de progrès et les commits git dans la base de données sous forme de vecteurs.</strong> Lorsqu'une session de codage commence, l'agent interroge la base de données avec sa tâche en cours. La base de données renvoie un historique pertinent en quelques millisecondes : ce qui a été essayé auparavant, ce qui a fonctionné, ce qui a échoué. L'agent ne part pas de zéro. Il part du contexte.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>convient parfaitement à ce cas d'utilisation.</strong> Il s'agit d'un logiciel libre conçu pour la recherche vectorielle à l'échelle de la production, qui traite des milliards de vecteurs sans aucune difficulté. Pour les petits projets ou le développement local, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> peut être intégré directement dans une application comme SQLite. Aucune configuration de cluster n'est nécessaire. Lorsque le projet prend de l'ampleur, vous pouvez migrer vers Milvus distribué sans modifier votre code. Pour générer des embeddings, vous pouvez utiliser des modèles externes comme <a href="https://www.sbert.net/">SentenceTransformer</a> pour un contrôle plus fin, ou faire référence à ces <a href="https://milvus.io/docs/embeddings.md">fonctions d'embedding intégrées</a> pour des configurations plus simples. Milvus prend également en charge la <a href="https://milvus.io/docs/hybridsearch.md">recherche hybride</a>, qui combine la similarité vectorielle avec le filtrage traditionnel, de sorte que vous pouvez demander "trouver des problèmes d'authentification similaires de la semaine dernière" en un seul appel.</p>
<p><strong>Cela résout également le problème du transfert.</strong> La base de données vectorielles persiste en dehors de toute session, de sorte que les connaissances s'accumulent au fil du temps. La session 50 a accès à tout ce qui a été appris au cours des sessions 1 à 49. Le projet développe une mémoire institutionnelle.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Vérification de l'achèvement à l'aide de tests automatisés<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Même avec l'architecture à deux agents et la mémoire à long terme, les agents peuvent toujours déclarer leur victoire trop tôt. C'est le problème de la vérification.</strong></p>
<p>Voici un mode d'échec courant : Une session de codage termine une fonctionnalité, exécute un test unitaire rapide, le voit réussir et fait basculer <code translate="no">&quot;passes&quot;: false</code> sur <code translate="no">&quot;passes&quot;: true</code>. Mais un test unitaire réussi ne signifie pas que la fonctionnalité fonctionne réellement. L'API peut renvoyer des données correctes alors que l'interface utilisateur n'affiche rien à cause d'un bogue CSS. Le fichier de progression indique "terminé" alors que les utilisateurs ne voient rien.</p>
<p><strong>La solution consiste à faire en sorte que l'agent teste comme un véritable utilisateur.</strong> Chaque fonctionnalité de la liste des fonctionnalités comporte des étapes de vérification concrètes : "l'utilisateur clique sur le bouton Nouvelle conversation → la nouvelle conversation apparaît dans la barre latérale → la zone de conversation affiche l'état de bienvenue". L'agent doit vérifier ces étapes littéralement. Au lieu d'exécuter uniquement des tests au niveau du code, il utilise des outils d'automatisation du navigateur tels que Puppeteer pour simuler une utilisation réelle. Il ouvre la page, clique sur des boutons, remplit des formulaires et vérifie que les bons éléments apparaissent à l'écran. Ce n'est que lorsque le flux complet est passé que l'agent marque l'achèvement de la fonctionnalité.</p>
<p><strong>Cela permet de détecter des problèmes que les tests unitaires ne détectent pas</strong>. Une fonctionnalité de chat peut avoir une logique de backend parfaite et des réponses API correctes. Mais si le frontend ne rend pas la réponse, les utilisateurs ne voient rien. L'automatisation du navigateur permet de faire une capture d'écran du résultat et de vérifier que ce qui apparaît à l'écran correspond à ce qui devrait apparaître. Le champ <code translate="no">passes</code> ne devient <code translate="no">true</code> que lorsque la fonctionnalité fonctionne réellement de bout en bout.</p>
<p><strong>Il existe toutefois des limites.</strong> Certaines fonctionnalités natives du navigateur ne peuvent pas être automatisées par des outils tels que Puppeteer. Les sélecteurs de fichiers et les boîtes de dialogue de confirmation du système en sont des exemples courants. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic a noté</a> que les fonctionnalités reposant sur des modales d'alerte natives du navigateur avaient tendance à être plus boguées parce que l'agent ne pouvait pas les voir par l'intermédiaire de Puppeteer. La solution pratique consiste à contourner ces limitations. Dans la mesure du possible, utilisez des composants d'interface utilisateur personnalisés au lieu de boîtes de dialogue natives, afin que l'agent puisse tester chaque étape de vérification de la liste des fonctionnalités.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">L'assemblage : LangGraph pour l'état de la session, Milvus pour la mémoire à long terme<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les concepts ci-dessus sont réunis dans un système fonctionnel utilisant deux outils : LangGraph pour l'état de session et Milvus pour la mémoire à long terme.</strong> LangGraph gère ce qui se passe au sein d'une session unique : quelle fonction est en cours d'élaboration, ce qui est terminé, ce qui va suivre. Milvus stocke l'historique consultable des sessions : ce qui a été fait auparavant, les problèmes rencontrés et les solutions qui ont fonctionné. Ensemble, ils donnent aux agents une mémoire à court et à long terme.</p>
<p><strong>Une remarque sur cette implémentation :</strong> Le code ci-dessous est une démonstration simplifiée. Il montre les principaux modèles dans un seul script, mais il ne reproduit pas complètement la séparation des sessions décrite plus haut. Dans une configuration de production, chaque session de codage serait une invocation séparée, potentiellement sur différentes machines ou à différents moments. Les pages <code translate="no">MemorySaver</code> et <code translate="no">thread_id</code> de LangGraph permettent cela en conservant l'état entre les invocations. Pour voir clairement le comportement de reprise, vous exécutez le script une fois, vous l'arrêtez, puis vous l'exécutez à nouveau avec la même adresse <code translate="no">thread_id</code>. La deuxième exécution reprend là où la première s'est arrêtée.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Conclusion</h3><p>Les agents d'intelligence artificielle échouent dans les tâches de longue haleine parce qu'ils ne disposent pas d'une mémoire persistante et d'une vérification adéquate. Clawdbot est devenu viral en résolvant ces problèmes, mais son approche n'est pas prête pour la production.</p>
<p>Cet article présente trois solutions qui le sont :</p>
<ul>
<li><p><strong>Architecture à deux agents :</strong> Un initialisateur divise les projets en caractéristiques vérifiables ; un agent de codage les traite un par un avec des transferts propres. Cela permet d'éviter l'épuisement du contexte et de suivre les progrès réalisés.</p></li>
<li><p><strong>Base de données vectorielle pour la mémoire sémantique :</strong> <a href="https://milvus.io/">Milvus</a> stocke les enregistrements de progrès et les commits git sous forme d'enchâssements, de sorte que les agents peuvent effectuer des recherches en fonction du sens, et non des mots-clés. La session 50 se souvient de ce que la session 1 a appris.</p></li>
<li><p><strong>Automatisation du navigateur pour une vérification réelle :</strong> Les tests unitaires vérifient que le code fonctionne. Puppeteer vérifie que les fonctionnalités fonctionnent réellement en testant ce que les utilisateurs voient à l'écran.</p></li>
</ul>
<p>Ces modèles ne se limitent pas au développement de logiciels. La recherche scientifique, la modélisation financière, l'examen de documents juridiques - toute tâche qui s'étend sur plusieurs sessions et nécessite des transferts fiables peut en bénéficier.</p>
<p>Les principes de base :</p>
<ul>
<li><p>Utiliser un initialisateur pour diviser le travail en morceaux vérifiables.</p></li>
<li><p>Suivre les progrès dans un format structuré et lisible par une machine.</p></li>
<li><p>Stocker l'expérience dans une base de données vectorielle pour une récupération sémantique.</p></li>
<li><p>Vérifier l'achèvement du travail à l'aide de tests réels, et pas seulement de tests unitaires.</p></li>
<li><p>Concevoir des limites de session nettes afin que le travail puisse s'interrompre et reprendre en toute sécurité.</p></li>
</ul>
<p>Les outils existent. Les modèles sont éprouvés. Il ne reste plus qu'à les appliquer.</p>
<p><strong>Prêt à commencer ?</strong></p>
<ul>
<li><p>Explorez <a href="https://milvus.io/">Milvus</a> et <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> pour ajouter une mémoire sémantique à vos agents.</p></li>
<li><p>Découvrez LangGraph pour gérer l'état des sessions</p></li>
<li><p>Lisez la <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">recherche complète d'Anthropic</a> sur les harnais d'agents à longue durée d'exécution.</p></li>
</ul>
<p><strong>Vous avez des questions ou souhaitez partager ce que vous construisez ?</strong></p>
<ul>
<li><p>Rejoignez la <a href="https://milvus.io/slack">communauté Milvus Slack</a> pour entrer en contact avec d'autres développeurs.</p></li>
<li><p>Participez aux <a href="https://milvus.io/office-hours">Milvus Office Hours</a> pour des questions-réponses en direct avec l'équipe.</p></li>
</ul>
