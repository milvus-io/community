---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >-
  OpenClaw (anciennement Clawdbot et Moltbot) expliqué : Un guide complet de
  l'agent d'IA autonome
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  Guide complet d'OpenClaw (Clawdbot/Moltbot) - fonctionnement, installation,
  cas d'utilisation, Moltbook et avertissements de sécurité.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (anciennement Moltbot et Clawdbot) est un agent IA open-source qui s'exécute sur votre machine, se connecte via les applications de messagerie que vous utilisez déjà (WhatsApp, Telegram, Slack, Signal et autres) et prend des mesures en votre nom - commandes shell, automatisation du navigateur, courrier électronique, calendrier et opérations sur les fichiers. Un planificateur de battements de cœur le réveille à un intervalle configurable afin qu'il puisse s'exécuter sans y être invité. Il a gagné plus de <a href="https://github.com/openclaw/openclaw">100 000</a> étoiles GitHub en moins d'une semaine après son lancement fin janvier 2026, ce qui en fait l'un des dépôts open-source à la croissance la plus rapide de l'histoire de GitHub.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce qui distingue OpenClaw, c'est sa combinaison : MIT-licensed, open-source, local-first (mémoire et données stockées sous forme de fichiers Markdown sur votre disque), et extensible par la communauté grâce à un format de compétences portable. C'est également là que se déroulent certaines des expériences les plus intéressantes en matière d'IA agentique : l'agent d'un développeur a négocié un rabais de 4 200 dollars sur l'achat d'une voiture par courrier électronique pendant qu'il dormait ; un autre a déposé une réfutation juridique d'un refus d'assurance sans qu'on le lui demande ; et un autre utilisateur a construit <a href="https://moltbook.com/">Moltbook</a>, un réseau social où plus d'un million d'agents d'IA interagissent de manière autonome pendant que des humains les observent.</p>
<p>Ce guide présente tout ce que vous devez savoir : ce qu'est OpenClaw, comment il fonctionne, ce qu'il peut faire dans la vie réelle, comment il est lié à Moltbook et les risques de sécurité qui y sont associés.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">Qu'est-ce qu'OpenClaw ?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a> (anciennement Clawdbot et Moltbot) est un assistant d'intelligence artificielle autonome et open-source qui fonctionne sur votre machine et vit dans vos applications de chat. Vous lui parlez via WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage ou Signal - ce que vous utilisez déjà - et il vous répond. Mais contrairement à ChatGPT ou à l'interface web de Claude, OpenClaw ne se contente pas de répondre aux questions. Il peut exécuter des commandes shell, contrôler votre navigateur, lire et écrire des fichiers, gérer votre calendrier et envoyer des courriels, le tout déclenché par un message texte.</p>
<p>Il est conçu pour les développeurs et les utilisateurs chevronnés qui souhaitent disposer d'un assistant personnel d'IA qu'ils peuvent contacter de n'importe où - sans sacrifier le contrôle de leurs données ou dépendre d'un service hébergé.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Principales fonctionnalités d'OpenClaw</h3><ul>
<li><p><strong>Passerelle multicanal</strong> - WhatsApp, Telegram, Discord et iMessage avec un seul processus de passerelle. Ajoutez Mattermost et bien plus encore grâce à des packs d'extension.</p></li>
<li><p><strong>Routage multi-agents</strong> - sessions isolées par agent, espace de travail ou expéditeur.</p></li>
<li><p><strong>Prise en charge des médias</strong>: envoi et réception d'images, de fichiers audio et de documents.</p></li>
<li><p><strong>Interface de contrôle Web</strong> - tableau de bord du navigateur pour le chat, la configuration, les sessions et les nœuds.</p></li>
<li><p><strong>Nœuds mobiles</strong> - couplage de nœuds iOS et Android avec prise en charge de Canvas.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">Qu'est-ce qui différencie OpenClaw ?</h3><p><strong>OpenClaw est auto-hébergé.</strong></p>
<p>La passerelle, les outils et la mémoire d'OpenClaw se trouvent sur votre machine, et non dans un SaaS hébergé par un fournisseur. OpenClaw stocke les conversations, la mémoire à long terme et les compétences sous forme de fichiers Markdown et YAML dans votre espace de travail et à l'adresse <code translate="no">~/.openclaw</code>. Vous pouvez les consulter dans n'importe quel éditeur de texte, les sauvegarder avec Git, les parcourir ou les supprimer. Les modèles d'IA peuvent être hébergés dans le nuage (Anthropic, OpenAI, Google) ou localement (via Ollama, LM Studio, ou d'autres serveurs compatibles avec OpenAI), en fonction de la façon dont vous configurez le bloc de modèles. Si vous voulez que toute l'inférence reste sur votre matériel, vous dirigez OpenClaw vers des modèles locaux uniquement.</p>
<p><strong>OpenClaw est entièrement autonome</strong></p>
<p>La passerelle fonctionne comme un démon en arrière-plan (<code translate="no">systemd</code> sur Linux, <code translate="no">LaunchAgent</code> sur macOS) avec un battement de cœur configurable - toutes les 30 minutes par défaut, toutes les heures avec Anthropic OAuth. À chaque battement de cœur, l'agent lit une liste de contrôle sur <code translate="no">HEARTBEAT.md</code> dans l'espace de travail, décide si un élément nécessite une action, et vous envoie un message ou répond à <code translate="no">HEARTBEAT_OK</code> (que la passerelle abandonne silencieusement). Les événements externes - crochets web, tâches cron, messages des coéquipiers - déclenchent également la boucle de l'agent.</p>
<p>Le degré d'autonomie de l'agent est un choix de configuration. Les politiques d'outils et les approbations des exécutants régissent les actions à haut risque : vous pouvez autoriser la lecture des courriels mais exiger une approbation avant l'envoi, autoriser la lecture des fichiers mais bloquer les suppressions. Si vous désactivez ces garde-fous, l'agent s'exécute sans rien demander.</p>
<p><strong>OpenClaw est un logiciel libre.</strong></p>
<p>Le noyau de Gateway est sous licence MIT. Il est entièrement lisible, forkable et auditable. C'est important dans le contexte : Anthropic a déposé une plainte en vertu du DMCA contre un développeur qui avait désobfusqué le client de Claude Code ; l'interface de programmation Codex d'OpenAI est Apache 2.0 mais l'interface utilisateur et les modèles sont fermés ; Manus est entièrement fermé.</p>
<p>L'écosystème reflète l'ouverture. <a href="https://github.com/openclaw/openclaw">Des centaines de contributeurs</a> ont créé des compétences - des fichiers modulaires <code translate="no">SKILL.md</code> avec un contenu frontal YAML et des instructions en langage naturel - partagés via ClawHub (un registre de compétences que l'agent peut rechercher automatiquement), des dépôts communautaires ou des URL directes. Le format est portable, compatible avec les conventions Claude Code et Cursor. Si une compétence n'existe pas, vous pouvez décrire la tâche à votre agent et lui demander d'en rédiger une.</p>
<p>Cette combinaison de propriété locale, d'évolution pilotée par la communauté et de fonctionnement autonome est la raison pour laquelle les développeurs sont enthousiastes. Pour les développeurs qui veulent avoir un contrôle total sur leurs outils d'IA, c'est important.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">Fonctionnement d'OpenClaw sous le capot<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Un processus, tout à l'intérieur</strong></p>
<p>Lorsque vous lancez <code translate="no">openclaw gateway</code>, vous démarrez un processus Node.js unique et de longue durée appelé Gateway. Ce processus représente l'ensemble du système : les connexions aux canaux, l'état de la session, la boucle de l'agent, les appels de modèle, l'exécution des outils, la persistance de la mémoire. Il n'y a pas de service distinct à gérer.</p>
<p>Cinq sous-systèmes au sein d'un processus :</p>
<ol>
<li><p><strong>Adaptateurs de canaux</strong> - un par plateforme (Baileys pour WhatsApp, grammY pour Telegram, etc.). Ils normalisent les messages entrants dans un format commun et sérialisent les réponses.</p></li>
<li><p><strong>Gestionnaire de session</strong> - résout l'identité de l'expéditeur et le contexte de la conversation. Les DM sont regroupés dans une session principale ; les chats de groupe ont leur propre session.</p></li>
<li><p><strong>File d'attente</strong> - sérialise les exécutions par session. Si un message arrive au milieu d'une session, elle le conserve, l'injecte ou le collecte pour un tour suivant.</p></li>
<li><p><strong>Exécution de l'agent</strong> - rassemble le contexte (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, journal quotidien, historique des conversations), puis exécute la boucle de l'agent : appel du modèle → exécution des appels d'outils → renvoi des résultats → répétition jusqu'à ce que ce soit fait.</p></li>
<li><p><strong>Plan de contrôle</strong> - WebSocket API sur <code translate="no">:18789</code>. La CLI, l'application macOS, l'interface web et les nœuds iOS/Android se connectent tous ici.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le modèle est un appel d'API externe qui peut ou non s'exécuter localement. Tout le reste - routage, outils, mémoire, état - vit à l'intérieur de ce processus unique sur votre machine.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour une requête simple, cette boucle est bouclée en quelques secondes. Les chaînes d'outils à plusieurs étapes prennent plus de temps. Le modèle est un appel d'API externe qui peut ou non être exécuté localement, mais tout le reste - routage, outils, mémoire, état - vit à l'intérieur de ce processus unique sur votre machine.</p>
<p><strong>Même boucle que le code Claude, enveloppe différente</strong></p>
<p>La boucle de l'agent - entrée → contexte → modèle → outils → répétition → réponse - est le même schéma que celui utilisé par Claude Code. Toutes les structures d'agents sérieuses en utilisent une version ou une autre. Ce qui diffère, c'est ce qui l'enveloppe.</p>
<p>Claude Code l'enveloppe dans un <strong>CLI</strong>: vous tapez, il s'exécute, il se termine. OpenClaw l'intègre dans un <strong>démon persistant</strong> connecté à plus de 12 plates-formes de messagerie, avec un planificateur de battements de cœur, une gestion de session entre les canaux et une mémoire qui persiste entre les exécutions - même lorsque vous n'êtes pas à votre bureau.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Routage et basculement de modèle</strong></p>
<p>OpenClaw est agnostique en matière de modèles. Vous configurez les fournisseurs sur <code translate="no">openclaw.json</code>, et la passerelle s'oriente en conséquence - avec une rotation des profils d'authentification et une chaîne de secours qui utilise un backoff exponentiel lorsqu'un fournisseur tombe en panne. Mais le choix du modèle est important, car OpenClaw assemble de grandes invites : instructions du système, historique des conversations, schémas d'outils, compétences et mémoire. Cette charge contextuelle explique pourquoi la plupart des déploiements utilisent un modèle frontière comme principal orchestrateur, des modèles moins coûteux gérant les battements de cœur et les tâches des sous-agents.</p>
<p><strong>Compromis entre l'informatique en nuage et l'informatique locale</strong></p>
<p>Du point de vue de la passerelle, les modèles locaux et en nuage semblent identiques - ce sont tous deux des points d'extrémité compatibles avec OpenAI. Ce sont les compromis qui diffèrent.</p>
<p>Les modèles en nuage (Anthropic, OpenAI, Google) offrent un raisonnement solide, de larges fenêtres contextuelles et une utilisation fiable des outils. Ils constituent le choix par défaut de l'orchestrateur principal. Le coût varie en fonction de l'utilisation : les utilisateurs légers dépensent entre 5 et 20 dollars par mois, les agents actifs avec des battements de cœur fréquents et des invites importantes coûtent généralement entre 50 et 150 dollars par mois, et les utilisateurs puissants non optimisés ont rapporté des factures de plusieurs milliers d'euros.</p>
<p>Les modèles locaux via Ollama ou d'autres serveurs compatibles avec OpenAI éliminent le coût par jeton mais nécessitent du matériel - et OpenClaw a besoin d'au moins 64K jetons de contexte, ce qui réduit les options viables. Avec 14 milliards de paramètres, les modèles peuvent gérer des automatisations simples mais sont marginaux pour les tâches d'agent à plusieurs étapes ; l'expérience de la communauté place le seuil de fiabilité à 32 milliards ou plus, ce qui nécessite au moins 24 Go de VRAM. Vous n'arriverez pas à la cheville d'un modèle de cloud frontalier en matière de raisonnement ou de contexte étendu, mais vous bénéficiez d'une localisation totale des données et de coûts prévisibles.</p>
<p><strong>Ce que cette architecture vous apporte</strong></p>
<p>Parce que tout passe par un seul processus, la passerelle est une surface de contrôle unique. Le modèle à appeler, les outils à autoriser, la quantité de contexte à inclure, le degré d'autonomie à accorder, tout est configuré en un seul endroit. Les canaux sont découplés du modèle : remplacez Telegram par Slack ou Claude par Gemini et rien d'autre ne change. Le câblage, les outils et la mémoire des canaux restent dans votre infrastructure ; le modèle est la dépendance que vous pointez vers l'extérieur.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">De quel matériel avez-vous réellement besoin pour faire fonctionner OpenClaw ?</h3><p>Fin janvier, des messages ont circulé montrant des développeurs en train de déballer plusieurs Mac Minis - un utilisateur a affiché 40 unités sur un bureau. Même Logan Kilpatrick, de Google DeepMind, a annoncé qu'il en avait commandé un, bien que les exigences matérielles réelles soient beaucoup plus modestes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La documentation officielle indique que la configuration minimale requise est de 2 Go de RAM et 2 cœurs de processeur pour le chat de base, ou de 4 Go si vous souhaitez l'automatisation du navigateur. Un VPS à 5 $/mois suffit amplement. Vous pouvez également le déployer sur AWS ou Hetzner avec Pulumi, l'exécuter dans Docker sur un petit VPS, ou utiliser un vieil ordinateur portable qui prend la poussière. La tendance Mac Mini a été motivée par la preuve sociale, et non par des exigences techniques.</p>
<p><strong>Alors pourquoi les gens ont-ils acheté du matériel dédié ? Pour deux raisons : l'isolement et la persistance.</strong> Lorsque vous donnez à un agent autonome un accès shell, vous voulez une machine que vous pouvez physiquement débrancher en cas de problème. Et comme OpenClaw fonctionne par battements de cœur - il se réveille selon un calendrier configurable pour agir en votre nom - un appareil dédié signifie qu'il est toujours allumé, toujours prêt. L'intérêt est l'isolation physique sur un ordinateur que vous pouvez débrancher et la disponibilité sans dépendre de la disponibilité d'un service en nuage.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">Comment installer OpenClaw et démarrer rapidement<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous avez besoin de <strong>Node 22+</strong>. Vérifiez avec <code translate="no">node --version</code> si vous n'êtes pas sûr.</p>
<p><strong>Installez le CLI :</strong></p>
<p>Sur macOS/Linux :</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sous Windows (PowerShell) :</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exécutez l'assistant d'intégration :</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>Il vous guide dans l'authentification, la configuration de la passerelle et, éventuellement, la connexion à un canal de messagerie (WhatsApp, Telegram, etc.). L'option <code translate="no">--install-daemon</code> enregistre la passerelle en tant que service d'arrière-plan afin qu'elle démarre automatiquement.</p>
<p><strong>Vérifiez que la passerelle fonctionne :</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ouvrez le tableau de bord :</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>L'interface de contrôle s'ouvre à l'adresse <code translate="no">http://127.0.0.1:18789/</code>. Vous pouvez commencer à chatter avec votre agent ici même - aucune configuration de canal n'est nécessaire si vous souhaitez simplement tester les choses.</p>
<p><strong>Il y a deux choses à savoir dès le départ.</strong> Si vous souhaitez exécuter la passerelle au premier plan plutôt qu'en tant que démon (utile pour le débogage), vous pouvez le faire :</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>Et si vous avez besoin de personnaliser l'endroit où OpenClaw stocke sa configuration et son état - disons que vous l'exécutez en tant que compte de service ou dans un conteneur - il y a trois vars env qui comptent :</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - répertoire de base pour la résolution des chemins internes</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - remplace l'emplacement des fichiers d'état</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - pointe vers un fichier de configuration spécifique</p></li>
</ul>
<p>Une fois que la passerelle fonctionne et que le tableau de bord est chargé, vous êtes prêt. À partir de là, vous voudrez probablement connecter un canal de messagerie et mettre en place des approbations de compétences - nous couvrirons ces deux aspects dans les sections suivantes.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">Comment OpenClaw se compare-t-il aux autres agents d'IA ?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>La communauté technologique appelle OpenClaw " Claude, mais avec des mains ". C'est une description vivante, mais elle ne tient pas compte des différences architecturales. Plusieurs produits d'IA ont maintenant des "mains" - Anthropic a <a href="https://claude.com/blog/claude-code">Claude Code</a> et <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, OpenAI a <a href="https://openai.com/codex/">Codex</a> et <a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT agent</a>, et <a href="https://manus.im/">Manus</a> existe. Les distinctions qui importent dans la pratique sont les suivantes :</p>
<ul>
<li><p><strong>L'endroit où l'agent s'exécute</strong> (votre machine ou le nuage du fournisseur)</p></li>
<li><p><strong>Comment vous interagissez avec lui</strong> (application de messagerie, terminal, IDE, interface web)</p></li>
<li><p><strong>Qui possède l'état et la mémoire à long terme</strong> (fichiers locaux ou compte du fournisseur) ?</p></li>
</ul>
<p>À un niveau élevé, OpenClaw est une passerelle locale d'abord qui vit sur votre matériel et parle à travers des applications de chat, tandis que les autres sont principalement des agents hébergés que vous pilotez à partir d'un terminal, d'un IDE, ou d'une application web/de bureau.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Code Claude</th><th>Codex OpenAI</th><th>Agent ChatGPT</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Open source</td><td>Oui. Passerelle principale sous licence MIT ;</td><td>Non.</td><td>Non.</td><td>Non.</td><td>Non. SaaS fermé</td></tr>
<tr><td>Interface</td><td>Applications de messagerie (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.)</td><td>Terminal, intégrations IDE, applications web et mobiles</td><td>Terminal CLI, intégrations IDE, Codex Web UI</td><td>ChatGPT web et applications de bureau (y compris le mode agent de macOS)</td><td>Tableau de bord web, opérateur de navigateur, Slack et intégrations d'applications.</td></tr>
<tr><td>Objectif principal</td><td>Automatisation personnelle et des développeurs à travers les outils et les services</td><td>Développement de logiciels et flux de travail DevOps</td><td>Développement de logiciels et édition de code</td><td>Tâches web générales, recherche et flux de travail de productivité</td><td>Automatisation de la recherche, du contenu et du web pour les utilisateurs professionnels</td></tr>
<tr><td>Mémoire de session</td><td>Mémoire basée sur des fichiers (Markdown + journaux) sur disque ; des plugins optionnels ajoutent une mémoire sémantique / à long terme</td><td>Sessions par projet avec historique, plus la mémoire Claude optionnelle sur le compte</td><td>État par session dans l'interface de programmation / l'éditeur ; pas de mémoire utilisateur à long terme intégrée</td><td>Exécution de l'agent par tâche, soutenue par les fonctions de mémoire au niveau du compte de ChatGPT (si elles sont activées)</td><td>Mémoire à l'échelle du compte, côté cloud, à travers les exécutions, adaptée aux flux de travail récurrents.</td></tr>
<tr><td>Déploiement</td><td>Passerelle/daemon fonctionnant en permanence sur votre machine ou VPS ; appelle les fournisseurs LLM</td><td>Exécution sur la machine du développeur en tant que plugin CLI/IDE ; tous les appels de modèles sont dirigés vers l'API d'Anthropic.</td><td>CLI fonctionne localement ; les modèles s'exécutent via l'API d'OpenAI ou Codex Web</td><td>Entièrement hébergé par OpenAI ; le mode agent active un espace de travail virtuel à partir du client ChatGPT.</td><td>Entièrement hébergé par Manus ; les agents s'exécutent dans l'environnement cloud de Manus.</td></tr>
<tr><td>Public cible</td><td>Développeurs et utilisateurs chevronnés à l'aise avec leur propre infrastructure</td><td>Développeurs et ingénieurs DevOps travaillant avec des terminaux et des IDEs</td><td>Développeurs qui veulent un agent de codage dans un terminal/IDE</td><td>Travailleurs du savoir et équipes utilisant ChatGPT pour les tâches des utilisateurs finaux</td><td>Utilisateurs professionnels et équipes automatisant les flux de travail centrés sur le web</td></tr>
<tr><td>Coût</td><td>Gratuit + appel à l'API en fonction de votre utilisation</td><td>20-200$/mois</td><td>20-200 $/mois</td><td>20-200 $/mois</td><td>39-199 $/mois (crédits)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Applications d'OpenClaw dans le monde réel<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>La valeur pratique d'OpenClaw vient de sa portée. Voici quelques-unes des applications les plus intéressantes, à commencer par un robot d'assistance que nous avons déployé pour la communauté Milvus.</p>
<p><strong>L'équipe d'assistance de Zilliz a créé un robot d'assistance IA pour la communauté Milvus sur Slack</strong></p>
<p>L'équipe de Zilliz a connecté OpenClaw à son espace de travail Slack en tant qu'<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">assistant de la communauté Milvus</a>. L'installation a pris 20 minutes. Il répond désormais aux questions courantes sur Milvus, aide à résoudre les erreurs et oriente les utilisateurs vers la documentation pertinente. Si vous souhaitez essayer quelque chose de similaire, nous avons rédigé un <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">tutoriel</a> complet <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">, étape par étape,</a> sur la façon de connecter OpenClaw à Slack.</p>
<ul>
<li><strong>Tutoriel OpenClaw :</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guide étape par étape pour configurer OpenClaw avec Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg a créé un agent qui l'a aidé à négocier une réduction de 4 200 $ sur l'achat d'une voiture pendant son sommeil.</strong></p>
<p>AJ Stuyvenberg, ingénieur logiciel, a chargé son OpenClaw d'acheter une Hyundai Palisade 2026. L'agent a dépouillé les inventaires des concessionnaires locaux, rempli des formulaires de contact en utilisant son numéro de téléphone et son adresse électronique, puis a passé plusieurs jours à faire jouer les concessionnaires les uns contre les autres, en leur envoyant des devis PDF concurrents et en leur demandant de battre le prix de l'autre. Résultat final : <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4 200 dollars</a> de moins que le prix affiché, et Stuyvenberg ne s'est présenté que pour signer les papiers. "Externaliser les aspects pénibles de l'achat d'une voiture à l'IA était rafraîchissant et agréable", écrit-il.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>L'agent de Hormold lui a fait gagner un litige d'assurance précédemment résolu, sans qu'il soit nécessaire de s'y prendre à l'avance</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un utilisateur nommé Hormold a vu sa demande d'indemnisation rejetée par Lemonade Insurance. Son OpenClaw a découvert l'e-mail de rejet, a rédigé une réfutation citant le libellé de la police et l'a envoyée, sans autorisation explicite. Lemonade a rouvert l'enquête. Mon @openclaw a accidentellement déclenché une bagarre avec Lemonade Insurance&quot;, a-t-il tweeté, &quot;Merci, AI&quot;.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook : Un réseau social construit avec OpenClaw pour les agents d'IA<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Les exemples ci-dessus montrent qu'OpenClaw automatise des tâches pour des utilisateurs individuels. Mais que se passe-t-il lorsque des milliers de ces agents interagissent entre eux ?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le 28 janvier 2026, en s'inspirant d'OpenClaw et en l'utilisant, l'entrepreneur Matt Schlicht a lancé <a href="https://moltbook.com/">Moltbook</a>, une plateforme de type Reddit où seuls les agents d'IA peuvent publier des messages. La croissance a été rapide. En l'espace de 72 heures, 32 000 agents se sont inscrits. En l'espace d'une semaine, ils étaient plus de 1,5 million. Plus d'un million d'humains ont visité le site au cours de la première semaine.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les problèmes de sécurité sont apparus tout aussi rapidement. Le 31 janvier, soit quatre jours après le lancement, <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media a signalé</a> qu'une mauvaise configuration de la base de données Supabase avait laissé l'ensemble du backend de la plateforme ouvert à l'internet public. Le chercheur en sécurité Jameson O'Reilly a découvert la faille ; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz</a> l'a <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">confirmée de manière indépendante</a> et en a documenté toute la portée : accès non authentifié en lecture et en écriture à toutes les tables, y compris 1,5 million de clés API d'agents, plus de 35 000 adresses électroniques et des milliers de messages privés.</p>
<p>La question de savoir si Moltbook représente un comportement émergent de la machine ou des agents reproduisant des tropes de science-fiction à partir de données d'entraînement reste ouverte. Ce qui est moins ambigu, c'est la démonstration technique : des agents autonomes qui maintiennent un contexte persistant, se coordonnent sur une plateforme partagée et produisent des résultats structurés sans instruction explicite. Pour les ingénieurs qui construisent avec OpenClaw ou des cadres similaires, il s'agit d'un aperçu en direct des capacités et des défis de sécurité qui accompagnent l'IA agentique à grande échelle.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Risques techniques et considérations de production pour OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de déployer OpenClaw dans un endroit important, vous devez comprendre ce que vous exécutez réellement. Il s'agit d'un agent disposant d'un accès au shell, d'un contrôle du navigateur et de la capacité d'envoyer des courriels en votre nom - en boucle, sans demander. C'est puissant, mais la surface d'attaque est énorme et le projet est jeune.</p>
<p><strong>Le modèle d'authentification présentait une grave faille.</strong> Le 30 janvier 2026, Mav Levin de depthfirst a révélé la <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8) - un bogue de détournement WebSocket intersite où n'importe quel site web pouvait voler votre jeton d'authentification et obtenir un RCE sur votre machine par le biais d'un simple lien malveillant. Un seul clic et l'accès est total. Ce problème a été corrigé sur <code translate="no">2026.1.29</code>, mais Censys a trouvé plus de 21 000 instances d'OpenClaw exposées à l'internet public à l'époque, dont un grand nombre via HTTP. <strong>Si vous utilisez une version plus ancienne ou si vous n'avez pas verrouillé votre configuration réseau, vérifiez d'abord cela.</strong></p>
<p><strong>Les compétences ne sont que du code provenant d'étrangers, et il n'y a pas de bac à sable.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">L'équipe de sécurité de Cisco</a> a démantelé une compétence appelée "What Would Elon Do ?" (Que ferait Elon ?) qui avait été jouée pour atteindre la première place sur le référentiel. Il s'agissait d'un logiciel malveillant pur et dur, qui utilisait l'injection rapide pour contourner les contrôles de sécurité et exfiltrer les données de l'utilisateur vers un serveur contrôlé par l'attaquant. Ils ont trouvé neuf vulnérabilités dans cette seule compétence, dont deux critiques. Lors de l'audit de 31 000 compétences d'agents sur plusieurs plateformes (Claude, Copilot, dépôts génériques AgentSkills), 26 % d'entre elles présentaient au moins une vulnérabilité. Plus de 230 compétences malveillantes ont été téléchargées sur ClawHub au cours de la seule première semaine de février. <strong>Traitez chaque compétence que vous n'avez pas écrite vous-même comme une dépendance non fiable - forkez-la, lisez-la, puis installez-la.</strong></p>
<p><strong>La boucle Heartbeat fera des choses que vous n'avez pas demandées.</strong> L'histoire de Hormold dans l'introduction - où l'agent a trouvé un refus d'assurance, a recherché des précédents et a envoyé une réfutation juridique de manière autonome - n'est pas une démo de fonctionnalité ; c'est un risque de responsabilité. L'agent s'est engagé à envoyer une correspondance juridique sans l'approbation d'un humain. Cela a fonctionné cette fois-là. Ce ne sera pas toujours le cas. <strong>Tout ce qui implique des paiements, des suppressions ou des communications externes nécessite une porte humaine dans la boucle, point final.</strong></p>
<p><strong>Les coûts de l'API augmentent rapidement si vous n'êtes pas vigilant.</strong> Chiffres approximatifs : une installation légère avec quelques battements de cœur par jour coûte 18-36$/mois sur Sonnet 4.5. Si vous passez à plus de 12 vérifications par jour sur Opus, vous vous retrouvez avec un coût de 270 à 540 $ par mois. Une personne sur HN a découvert qu'elle dépensait 70 $/mois en appels API redondants et en journalisation verbeuse - elle a réduit ce montant à presque rien après avoir nettoyé la configuration. <strong>Définissez des alertes de dépenses au niveau du fournisseur.</strong> Un intervalle de battement de cœur mal configuré peut épuiser votre budget API du jour au lendemain.</p>
<p>Avant de déployer, nous vous recommandons vivement d'effectuer cette opération :</p>
<ul>
<li><p>Exécutez-le dans un environnement isolé - une VM ou un conteneur dédié, pas votre véhicule de tous les jours</p></li>
<li><p>Fork et auditer chaque compétence avant de l'installer. Lisez les sources. Tout le code source.</p></li>
<li><p>Fixer des limites strictes de dépenses d'API au niveau du fournisseur, et pas seulement dans la configuration de l'agent.</p></li>
<li><p>Passer toutes les actions irréversibles derrière l'approbation humaine - paiements, suppressions, envoi d'emails, tout ce qui est externe.</p></li>
<li><p>Passer à la version 2026.1.29 ou plus récente et suivre les correctifs de sécurité.</p></li>
</ul>
<p>Ne l'exposez pas à l'internet public à moins que vous ne sachiez exactement ce que vous faites avec la configuration du réseau.</p>
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
    </button></h2><p>OpenClaw a franchi les 175 000 étoiles GitHub en moins de deux semaines, ce qui en fait l'un des dépôts open-source à la croissance la plus rapide de l'histoire de GitHub. L'adoption est réelle et l'architecture qui la sous-tend mérite qu'on s'y intéresse.</p>
<p>D'un point de vue technique, OpenClaw est trois choses que la plupart des agents d'intelligence artificielle ne sont pas : entièrement open-source (MIT), local-first (mémoire stockée sous forme de fichiers Markdown sur votre machine), et programmé de manière autonome (un démon de battement de cœur qui agit sans y être invité). Il s'intègre aux plateformes de messagerie telles que Slack, Telegram et WhatsApp dès sa sortie de l'emballage, et prend en charge les compétences construites par la communauté grâce à un simple système SKILL.md. Cette combinaison la rend particulièrement adaptée à la création d'assistants toujours actifs : Des bots Slack qui répondent aux questions 24/7, des moniteurs de boîte de réception qui trient les courriels pendant que vous dormez, ou des flux de travail d'automatisation qui fonctionnent sur votre propre matériel sans verrouillage de fournisseur.</p>
<p>Cela dit, l'architecture qui rend OpenClaw puissant le rend également risqué s'il est déployé sans précaution. Voici quelques points à garder à l'esprit :</p>
<ul>
<li><p><strong>Exécutez-le de manière isolée.</strong> Utilisez un appareil ou une machine virtuelle dédiée, et non votre machine principale. Si quelque chose tourne mal, vous devez disposer d'un interrupteur que vous pouvez physiquement atteindre.</p></li>
<li><p><strong>Vérifier les compétences avant l'installation.</strong> 26 % des compétences communautaires analysées par Cisco contenaient au moins une vulnérabilité. Mettez en fourchette et examinez tout ce qui ne vous inspire pas confiance.</p></li>
<li><p><strong>Fixez des limites de dépenses API au niveau du fournisseur.</strong> Un battement de cœur mal configuré peut brûler des centaines de dollars en une nuit. Configurez des alertes avant de déployer.</p></li>
<li><p><strong>Mettez en place un portail pour les actions irréversibles.</strong> Paiements, suppressions, communications externes : ces actions doivent être approuvées par l'homme et non exécutées de manière autonome.</p></li>
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guide étape par étape pour configurer OpenClaw avec Slack</a> - Créez un bot d'assistance AI alimenté par Milvus dans votre espace de travail Slack à l'aide d'OpenClaw.</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 et Milvus : Construire des agents d'IA prêts pour la production avec une mémoire à long terme</a> - Comment donner à vos agents une mémoire persistante et sémantique avec Milvus ?</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Stop Building Vanilla RAG : Embrace Agentic RAG with DeepSearcher</a> - Pourquoi le RAG agentique est plus performant que la recherche traditionnelle, avec une implémentation open-source pratique.</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG with Milvus and LangGraph</a> - Tutoriel : construire un agent qui décide quand récupérer, évalue la pertinence des documents, et réécrit les requêtes.</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Building a Production-Ready AI Assistant with Spring Boot and Milvus</a> - Guide complet pour construire un assistant IA d'entreprise avec recherche sémantique et mémoire de conversation.</p></li>
</ul>
