---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Guide étape par étape pour configurer OpenClaw (anciennement Clawdbot/Moltbot)
  avec Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: tutorials
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Guide étape par étape pour configurer OpenClaw avec Slack. Exécutez un
  assistant d'IA auto-hébergé sur votre machine Mac ou Linux - aucun cloud n'est
  nécessaire.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Si vous avez été sur Twitter, Hacker News ou Discord cette semaine, vous l'avez vu. Un emoji homard 🦞, des captures d'écran de tâches en cours d'exécution et une affirmation audacieuse : une IA qui ne se contente pas de <em>parler - elle</em> <em>le fait</em> vraiment.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les choses sont devenues encore plus étranges au cours du week-end. L'entrepreneur Matt Schlicht a lancé <a href="https://moltbook.com">Moltbook, un</a>réseau social de type Reddit où seuls les agents de l'IA peuvent publier, et où les humains ne peuvent que regarder. En quelques jours, plus de 1,5 million d'agents se sont inscrits. Ils ont formé des communautés, débattu de philosophie, se sont plaints de leurs opérateurs humains et ont même fondé leur propre religion, le "crustafarianisme". Oui, vraiment.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bienvenue dans l'engouement pour OpenClaw.</p>
<p>L'engouement est tel que l'action de Cloudflare a bondi de 14 %, simplement parce que les développeurs utilisent son infrastructure pour exécuter des applications. Les ventes de Mac Mini auraient grimpé en flèche car les gens achètent du matériel dédié à leur nouvel employé en charge de l'IA. Et le dossier GitHub ? Plus de <a href="https://github.com/openclaw/openclaw">150 000 étoiles</a> en quelques semaines.</p>
<p>Nous devions donc naturellement vous montrer comment configurer votre propre instance OpenClaw et la connecter à Slack pour que vous puissiez diriger votre assistant IA depuis votre application de messagerie préférée.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">Qu'est-ce qu'OpenClaw ?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (anciennement connu sous le nom de Clawdbot/Moltbot) est un agent d'IA autonome open-source qui s'exécute localement sur les machines des utilisateurs et effectue des tâches du monde réel via des applications de messagerie telles que WhatsApp, Telegram et Discord. Il automatise les flux de travail numériques, tels que la gestion des courriels, la navigation sur le web ou la planification de réunions, en se connectant à des LLM tels que Claude ou ChatGPT.</p>
<p>En bref, c'est comme avoir un assistant numérique 24/7 qui peut penser, répondre et faire avancer les choses.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Configurer OpenClaw comme un assistant IA basé sur Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Imaginez que vous disposiez d'un bot dans votre espace de travail Slack, capable de répondre instantanément à des questions sur votre produit, d'aider à déboguer les problèmes des utilisateurs ou d'orienter les coéquipiers vers la bonne documentation, sans que personne n'ait à interrompre ce qu'il est en train de faire. Pour nous, cela pourrait signifier une assistance plus rapide pour la communauté Milvus : un bot qui répond aux questions courantes ("Comment créer une collection ?"), aide à résoudre les erreurs ou résume les notes de version à la demande. Pour votre équipe, il peut s'agir d'intégrer de nouveaux ingénieurs, de traiter des FAQ internes ou d'automatiser des tâches DevOps répétitives. Les cas d'utilisation sont très variés.</p>
<p>Dans ce tutoriel, nous allons aborder les bases : installer OpenClaw sur votre machine et le connecter à Slack. Une fois cela fait, vous aurez un assistant IA fonctionnel prêt à être personnalisé pour tout ce dont vous avez besoin.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><ul>
<li><p>Une machine Mac ou Linux</p></li>
<li><p>Une <a href="https://console.anthropic.com/">clé API Anthropic</a> (ou un accès CLI Claude Code)</p></li>
<li><p>Un espace de travail Slack où vous pouvez installer des applications</p></li>
</ul>
<p>Voilà, c'est fait. Il ne reste plus qu'à commencer.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Etape 1 : Installer OpenClaw</h3><p>Lancez le programme d'installation :</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>À l'invite, sélectionnez <strong>Oui</strong> pour continuer.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Choisissez ensuite le mode <strong>QuickStart</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Étape 2 : Choisissez votre LLM</h3><p>Le programme d'installation vous demandera de choisir un fournisseur de modèle. Nous utilisons Anthropic avec le Claude Code CLI pour l'authentification.</p>
<ol>
<li>Sélectionnez <strong>Anthropic</strong> comme fournisseur  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Effectuez la vérification dans votre navigateur lorsque vous y êtes invité.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Choisissez <strong>anthropic/claude-opus-4-5-20251101</strong> comme modèle par défaut.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Étape 3 : Configurer Slack</h3><p>Lorsqu'il vous est demandé de sélectionner un canal, choisissez <strong>Slack</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Donnez un nom à votre robot. Nous avons appelé le nôtre "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous devez maintenant créer une application Slack et vous procurer deux jetons. Voici comment procéder : <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Créer une application Slack</strong></p>
<p>Rendez-vous sur le <a href="https://api.slack.com/apps?new_app=1">site web de l'API Slack</a> et créez une nouvelle application à partir de zéro.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Donnez-lui un nom et sélectionnez l'espace de travail que vous souhaitez utiliser.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Définir les permissions du bot</strong></p>
<p>Dans la barre latérale, cliquez sur <strong>OAuth &amp; Permissions</strong>. Descendez jusqu'à <strong>Bot Token Scopes</strong> et ajoutez les permissions dont votre bot a besoin.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Activer le mode Socket</strong></p>
<p>Cliquez sur <strong>Socket Mode</strong> dans la barre latérale et activez-le.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cela générera un <strong>App-Level Token</strong> (commence par <code translate="no">xapp-</code>). Copiez-le dans un endroit sûr.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Activer les abonnements aux événements</strong></p>
<p>Allez dans <strong>Event Subscriptions</strong> et activez la fonction.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Choisissez ensuite les événements auxquels votre robot doit s'abonner.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Installer l'application</strong></p>
<p>Cliquez sur <strong>Installer l'application</strong> dans la barre latérale, puis <strong>demandez l'installation</strong> (ou installez-la directement si vous êtes administrateur de l'espace de travail).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois approuvé, vous verrez votre <strong>Bot User OAuth Token</strong> (commence par <code translate="no">xoxb-</code>). Copiez-le également.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Étape 4 : Configurer OpenClaw</h3><p>Retournez dans le CLI d'OpenClaw :</p>
<ol>
<li><p>Entrez votre <strong>Bot User OAuth Token</strong> (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Entrez votre <strong>Token au niveau de l'application</strong> (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Sélectionnez les canaux Slack auxquels le bot peut accéder  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Sautez la configuration des compétences pour l'instant - vous pourrez toujours les ajouter plus tard.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Sélectionnez <strong>Redémarrer</strong> pour appliquer vos modifications</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Étape 5 : Essayez-le</h3><p>Rendez-vous sur Slack et envoyez un message à votre robot. Si tout est configuré correctement, OpenClaw répondra et sera prêt à exécuter des tâches sur votre machine.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Astuces</h3><ol>
<li>Exécutez <code translate="no">clawdbot dashboard</code> pour gérer les paramètres via une interface web.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Si quelque chose ne fonctionne pas, vérifiez les journaux pour connaître les détails de l'erreur.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Un mot d'avertissement<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw est puissant - et c'est exactement la raison pour laquelle vous devez être prudent. L'expression "fait des choses" signifie qu'il peut exécuter de vraies commandes sur votre machine. C'est là tout l'intérêt, mais cela comporte des risques.</p>
<p><strong>La bonne nouvelle :</strong></p>
<ul>
<li><p>Il s'agit d'un logiciel libre, le code est donc vérifiable</p></li>
<li><p>Il s'exécute localement, de sorte que vos données ne se trouvent pas sur le serveur de quelqu'un d'autre.</p></li>
<li><p>Vous contrôlez les autorisations dont il dispose.</p></li>
</ul>
<p><strong>La moins bonne nouvelle :</strong></p>
<ul>
<li><p>L'injection d'invites est un risque réel : un message malveillant pourrait inciter le robot à exécuter des commandes non souhaitées.</p></li>
<li><p>Des escrocs ont déjà créé de faux dépôts et jetons OpenClaw, alors faites attention à ce que vous téléchargez.</p></li>
</ul>
<p><strong>Notre conseil :</strong></p>
<ul>
<li><p>N'exécutez pas ce programme sur votre machine principale. Utilisez une VM, un ordinateur portable de rechange ou un serveur dédié.</p></li>
<li><p>N'accordez pas plus de permissions que nécessaire.</p></li>
<li><p>Ne l'utilisez pas encore en production. Il s'agit d'une nouveauté. Traitez-le comme une expérience.</p></li>
<li><p>Tenez-vous en aux sources officielles : <a href="https://x.com/openclaw">@openclaw</a> sur X et <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Une fois que vous donnez à un LLM la capacité d'exécuter des commandes, il n'y a rien de tel qu'une sécurité à 100%. Ce n'est pas un problème pour OpenClaw, c'est la nature même de l'IA agentique. Il suffit de faire preuve d'intelligence.</p>
<h2 id="Whats-Next" class="common-anchor-header">Et maintenant ?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Félicitations ! Vous disposez désormais d'un assistant d'IA local fonctionnant sur votre propre infrastructure, accessible via Slack. Vos données restent les vôtres et vous disposez d'un assistant infatigable prêt à automatiser les tâches répétitives.</p>
<p>À partir de là, vous pouvez :</p>
<ul>
<li><p>Installer d'autres <a href="https://docs.molt.bot/skills">compétences</a> pour étendre les possibilités d'OpenClaw.</p></li>
<li><p>Configurer des tâches planifiées pour qu'il travaille de manière proactive</p></li>
<li><p>Connecter d'autres plateformes de messagerie comme Telegram ou Discord</p></li>
<li><p>Explorer l'écosystème <a href="https://milvus.io/">Milvus</a> pour les capacités de recherche d'IA</p></li>
</ul>
<p><strong>Vous avez des questions ou souhaitez partager ce que vous construisez ?</strong></p>
<ul>
<li><p>Rejoignez la <a href="https://milvus.io/slack">communauté Milvus Slack</a> pour entrer en contact avec d'autres développeurs.</p></li>
<li><p>Réservez nos <a href="https://milvus.io/office-hours">Milvus Office Hours</a> pour des questions et réponses en direct avec l'équipe.</p></li>
</ul>
<p>Joyeux hacking ! 🦞</p>
