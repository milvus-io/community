---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >-
  Le RAG est-il en train de devenir obsolète avec l'émergence d'agents de longue
  date comme Claude Cowork ?
author: Min Yin
date: 2026-1-27
desc: >-
  Une analyse approfondie de la mémoire à long terme de Claude Cowork, de la
  mémoire des agents inscriptibles, des compromis RAG et des raisons pour
  lesquelles les bases de données vectorielles ont encore de l'importance.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> est une nouvelle fonctionnalité d'agent dans l'application Claude Desktop. Du point de vue du développeur, il s'agit essentiellement d'un gestionnaire de tâches automatisé qui s'enroule autour du modèle : il peut lire, modifier et générer des fichiers locaux, et il peut planifier des tâches en plusieurs étapes sans que vous n'ayez à demander manuellement chacune d'entre elles. Il s'agit de la même boucle que celle de Claude Code, mais exposée au bureau plutôt qu'au terminal.</p>
<p>La principale caractéristique de Cowork est sa capacité à fonctionner pendant de longues périodes sans perdre son état. Il ne se heurte pas au délai de conversation habituel ou à la réinitialisation du contexte. Il peut continuer à travailler, suivre les résultats intermédiaires et réutiliser les informations précédentes d'une session à l'autre. Cela donne l'impression d'une "mémoire à long terme", même si les mécanismes sous-jacents ressemblent davantage à un état de tâche persistant + un report contextuel. Quoi qu'il en soit, l'expérience est différente du modèle de chat traditionnel, où tout est réinitialisé à moins que vous ne construisiez votre propre couche de mémoire.</p>
<p>Cela soulève deux questions pratiques pour les développeurs :</p>
<ol>
<li><p><strong>Si le modèle peut déjà se souvenir d'informations passées, quelle est la place de la RAG ou de la RAG agentique ? La RAG sera-t-elle remplacée ?</strong></p></li>
<li><p><strong>Si nous voulons un agent local, de type Cowork, comment pouvons-nous implémenter nous-mêmes la mémoire à long terme ?</strong></p></li>
</ol>
<p>La suite de cet article aborde ces questions en détail et explique comment les bases de données vectorielles s'intègrent dans ce nouveau paysage de la "mémoire modèle".</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG : quelle est la différence ?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme je l'ai mentionné précédemment, Claude Cowork est un mode agent à l'intérieur de Claude Desktop qui peut lire et écrire des fichiers locaux, diviser les tâches en étapes plus petites, et continuer à travailler sans perdre l'état. Il conserve son propre contexte de travail, de sorte que les tâches de plusieurs heures ne se réinitialisent pas comme une session de chat normale.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) résout un problème différent : permettre à un modèle d'accéder à des connaissances externes. Vous indexez vos données dans une base de données vectorielle, récupérez les morceaux pertinents pour chaque requête et les introduisez dans le modèle. Ce système est largement utilisé car il fournit aux applications LLM une forme de "mémoire à long terme" pour les documents, les journaux, les données sur les produits, etc.</p>
<p>Si les deux systèmes aident un modèle à "se souvenir", quelle est la différence réelle ?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Comment Cowork gère la mémoire</h3><p>La mémoire de Cowork est en lecture-écriture. L'agent décide quelles informations de la tâche ou de la conversation en cours sont pertinentes, les stocke en tant qu'entrées de mémoire et les récupère plus tard au fur et à mesure de l'avancement de la tâche. Cela permet à Cowork de maintenir la continuité des flux de travail à long terme, en particulier ceux qui produisent de nouveaux états intermédiaires au fur et à mesure qu'ils progressent.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Comment RAG et RAG Agentic gèrent la mémoire</h3><p>Le RAG standard est un système de recherche axé sur les requêtes : l'utilisateur pose une question, le système récupère les documents pertinents et le modèle les utilise pour répondre. Le corpus de recherche reste stable et versionné, et les développeurs contrôlent exactement ce qui y entre.</p>
<p>Les RAG agentiques modernes étendent ce modèle. Le modèle peut décider quand récupérer des informations, quoi récupérer et comment les utiliser pendant la planification ou l'exécution d'un flux de travail. Ces systèmes peuvent exécuter de longues tâches et appeler des outils, à l'instar de Cowork. Mais même avec le RAG agentique, la couche de recherche reste orientée vers la connaissance plutôt que vers l'état. L'agent récupère des faits qui font autorité ; il n'écrit pas dans le corpus l'état évolutif de sa tâche.</p>
<p>Une autre façon de voir les choses :</p>
<ul>
<li><p><strong>La mémoire de Cowork est axée sur les tâches :</strong> l'agent écrit et lit son propre état évolutif.</p></li>
<li><p><strong>La RAG est axée sur les connaissances :</strong> le système récupère des informations établies sur lesquelles le modèle doit s'appuyer.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Ingénierie inverse Claude Cowork : Comment il construit une mémoire d'agent à long terme<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork fait l'objet d'un grand battage médiatique parce qu'il gère des tâches en plusieurs étapes sans oublier constamment ce qu'il était en train de faire. Du point de vue d'un développeur, je me demande <strong>comment il conserve l'état d'une session aussi longue.</strong> Anthropic n'a pas publié les détails internes, mais en se basant sur des expériences antérieures avec le module de mémoire de Claude, nous pouvons reconstituer un modèle mental décent.</p>
<p>Claude semble s'appuyer sur une configuration hybride : <strong>une couche de mémoire persistante à long terme et des outils de récupération à la demande.</strong> Au lieu d'intégrer l'intégralité de la conversation dans chaque requête, Claude ne fait appel au contexte passé que lorsqu'il le juge pertinent. Cela permet au modèle de maintenir un niveau de précision élevé sans pour autant épuiser les jetons à chaque tour.</p>
<p>Si vous décomposez la structure de la requête, elle ressemble à peu près à ceci :</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>Le comportement intéressant n'est pas la structure elle-même - c'est la façon dont le modèle décide de ce qu'il faut mettre à jour et quand il faut lancer la recherche.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">La mémoire de l'utilisateur : La couche persistante</h3><p>Claude conserve une mémoire à long terme qui se met à jour au fil du temps. Et contrairement au système de mémoire plus prévisible de ChatGPT, celui de Claude semble un peu plus "vivant". Il stocke les mémoires dans des blocs XML et les met à jour de deux manières :</p>
<ul>
<li><p><strong>Mises à jour implicites :</strong> Parfois, le modèle décide simplement que quelque chose est une préférence ou un fait stable et l'écrit tranquillement dans la mémoire. Ces mises à jour ne sont pas instantanées ; elles apparaissent après quelques tours, et les souvenirs plus anciens peuvent s'effacer si la conversation correspondante disparaît.</p></li>
<li><p><strong>Mises à jour explicites :</strong> Les utilisateurs peuvent modifier directement la mémoire à l'aide de l'outil <code translate="no">memory_user_edits</code> ("se souvenir de X", "oublier Y"). Ces écritures sont immédiates et se comportent plus comme une opération CRUD.</p></li>
</ul>
<p>Claude utilise une heuristique en arrière-plan pour décider ce qui mérite d'être conservé, et n'attend pas d'instructions explicites.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Récupération de conversations : La partie à la demande</h3><p>Claude <em>ne</em> conserve <em>pas</em> de résumé en continu comme de nombreux systèmes LLM. Au lieu de cela, il dispose d'une boîte à outils de fonctions d'extraction qu'il peut appeler chaque fois qu'il pense qu'il lui manque un contexte. Ces appels ne se produisent pas à chaque tour - le modèle les déclenche en fonction de son propre jugement interne.</p>
<p>L'exemple le plus marquant est <code translate="no">conversation_search</code>. Lorsque l'utilisateur dit quelque chose de vague comme "ce projet du mois dernier", Claude lance souvent cet outil pour retrouver les tournures pertinentes. Ce qui est remarquable, c'est que cet outil fonctionne toujours lorsque la formulation est ambiguë ou dans une langue différente. Cela implique très clairement :</p>
<ul>
<li><p>une sorte de correspondance sémantique (embeddings)</p></li>
<li><p>Probablement combinée à une normalisation ou à une traduction légère</p></li>
<li><p>Une recherche par mot-clé intégrée pour plus de précision</p></li>
</ul>
<p>En fait, cela ressemble beaucoup à un système RAG miniature intégré à l'ensemble des outils du modèle.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Comment le comportement de Claude en matière d'extraction diffère des tampons d'historique de base</h3><p>D'après les tests et les journaux, quelques schémas se dégagent :</p>
<ul>
<li><p><strong>La récupération n'est pas automatique.</strong> Le modèle choisit quand l'appeler. S'il pense qu'il a déjà suffisamment de contexte, il ne s'en préoccupe même pas.</p></li>
<li><p><strong>Les morceaux récupérés comprennent</strong> <em>à la fois</em><strong>des</strong> <strong>messages de l'utilisateur et de l'assistant.</strong> C'est utile - cela permet de conserver plus de nuances que les résumés réservés à l'utilisateur.</p></li>
<li><p><strong>L'utilisation des jetons reste raisonnable.</strong> L'historique n'étant pas injecté à chaque tour, les longues sessions ne s'envolent pas de manière imprévisible.</p></li>
</ul>
<p>Dans l'ensemble, cela ressemble à un LLM augmenté par la recherche, sauf que la recherche se fait dans le cadre de la boucle de raisonnement du modèle.</p>
<p>Cette architecture est intelligente, mais elle n'est pas gratuite :</p>
<ul>
<li><p>La recherche ajoute de la latence et davantage de "pièces mobiles" (indexation, classement, reclassement).</p></li>
<li><p>Le modèle évalue parfois mal s'il a besoin du contexte, ce qui signifie que vous voyez le classique "oubli LLM" même si les données <em>étaient</em> disponibles.</p></li>
<li><p>Le débogage devient plus délicat parce que le comportement du modèle dépend de déclencheurs d'outils invisibles, et pas seulement de l'entrée de l'invite.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork contre Claude Codex dans la gestion de la mémoire à long terme</h3><p>Contrairement à la configuration de Claude, très axée sur la récupération, ChatGPT gère la mémoire d'une manière beaucoup plus structurée et prévisible. Au lieu de faire des recherches sémantiques ou de traiter les anciennes conversations comme un mini magasin vectoriel, ChatGPT injecte la mémoire directement dans chaque session à travers les composants en couches suivants :</p>
<ul>
<li><p>Mémoire de l'utilisateur</p></li>
<li><p>Métadonnées de la session</p></li>
<li><p>Messages de la session en cours</p></li>
</ul>
<p><strong>Mémoire de l'utilisateur</strong></p>
<p>La mémoire de l'utilisateur est la principale couche de stockage à long terme - la partie qui persiste à travers les sessions et qui peut être éditée par l'utilisateur. Elle stocke des informations assez classiques : nom, antécédents, projets en cours, préférences en matière d'apprentissage, etc. Ce bloc est injecté au début de chaque nouvelle conversation, de sorte que le modèle commence toujours avec une vue cohérente de l'utilisateur.</p>
<p>ChatGPT met à jour cette couche de deux manières :</p>
<ul>
<li><p><strong>Mises à jour explicites :</strong> Les utilisateurs peuvent dire au modèle de "se souvenir de ceci" ou "d'oublier cela", et la mémoire change immédiatement. Il s'agit essentiellement d'une API CRUD que le modèle expose par le biais du langage naturel.</p></li>
<li><p><strong>Mises à jour implicites :</strong> Si le modèle repère des informations qui correspondent aux règles de l'OpenAI pour la mémoire à long terme, comme un titre de poste ou une préférence, et que l'utilisateur n'a pas désactivé la mémoire, il les ajoutera discrètement de lui-même.</p></li>
</ul>
<p>Du point de vue du développeur, cette couche est simple, déterministe et facile à raisonner. Il n'y a pas de recherche intégrée, ni d'heuristique sur ce qu'il faut récupérer.</p>
<p><strong>Métadonnées de session</strong></p>
<p>Les métadonnées de session se situent à l'autre extrémité du spectre. Elles sont éphémères, non persistantes et injectées une seule fois au début d'une session. Il s'agit de variables d'environnement pour la conversation. Il s'agit d'éléments tels que</p>
<ul>
<li><p>l'appareil sur lequel vous vous trouvez</p></li>
<li><p>l'état du compte/de l'abonnement</p></li>
<li><p>des schémas d'utilisation grossiers (jours actifs, distribution du modèle, durée moyenne de la conversation).</p></li>
</ul>
<p>Ces métadonnées aident le modèle à adapter les réponses à l'environnement actuel, par exemple en rédigeant des réponses plus courtes sur mobile, sans polluer la mémoire à long terme.</p>
<p><strong>Messages de la session en cours</strong></p>
<p>Il s'agit de l'historique standard à fenêtre glissante : tous les messages de la conversation en cours jusqu'à ce que la limite de jetons soit atteinte. Lorsque la fenêtre devient trop grande, les tours plus anciens sont automatiquement supprimés.</p>
<p>Il est important de noter que cette éviction <strong>n'</strong> affecte <strong>pas</strong> la mémoire de l'utilisateur ni les résumés intersessions. Seul l'historique de la conversation locale diminue.</p>
<p>La plus grande divergence avec Claude apparaît dans la façon dont ChatGPT gère les conversations "récentes mais pas actuelles". Claude appelle un outil de recherche pour récupérer le contexte passé s'il pense qu'il est pertinent. ChatGPT ne le fait pas.</p>
<p>Au lieu de cela, ChatGPT conserve un <strong>résumé intersession</strong> très léger qui est injecté dans chaque conversation. Quelques détails clés sur cette couche :</p>
<ul>
<li><p>Elle <strong>ne</strong> résume <strong>que les messages de l'utilisateur</strong>, pas ceux de l'assistant.</p></li>
<li><p>Elle stocke un très petit ensemble d'éléments - environ 15 - juste assez pour capturer des thèmes ou des intérêts stables.</p></li>
<li><p>Elle <strong>n'</strong>effectue <strong>aucun calcul d'intégration, aucun classement de similarité et aucun appel de recherche</strong>. Il s'agit essentiellement d'un contexte pré-mâché, et non d'une recherche dynamique.</p></li>
</ul>
<p>D'un point de vue technique, cette approche échange la flexibilité contre la prévisibilité. Il n'y a pas de risque d'échec bizarre de la recherche, et la latence de l'inférence reste stable car rien n'est récupéré à la volée. L'inconvénient est que ChatGPT ne récupérera pas un message aléatoire datant d'il y a six mois, à moins qu'il ne soit parvenu jusqu'à la couche de résumé.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Défis à relever pour rendre la mémoire des agents inscriptible<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'un agent passe d'une <strong>mémoire en lecture seule</strong> (RAG typique) à une <strong>mémoire inscriptible (où</strong>il peut enregistrer les actions, les décisions et les préférences des utilisateurs), la complexité augmente rapidement. Il ne s'agit plus seulement de récupérer des documents, mais de maintenir un état croissant dont dépend le modèle.</p>
<p>Un système de mémoire inscriptible doit résoudre trois problèmes réels :</p>
<ol>
<li><p><strong>Que retenir ?</strong> L'agent a besoin de règles pour décider quels événements, préférences ou observations valent la peine d'être conservés. Sans cela, la mémoire explose en taille ou se remplit de bruit.</p></li>
<li><p><strong>Comment stocker et hiérarchiser la mémoire :</strong> Toutes les mémoires ne sont pas égales. Les éléments récents, les faits à long terme et les notes éphémères nécessitent tous des couches de stockage, des politiques de conservation et des stratégies d'indexation différentes.</p></li>
<li><p><strong>Comment écrire rapidement sans interrompre la récupération :</strong> La mémoire doit être écrite en continu, mais les mises à jour fréquentes peuvent dégrader la qualité de l'index ou ralentir les requêtes si le système n'est pas conçu pour des insertions à haut débit.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Défi 1 : Qu'est-ce qui vaut la peine d'être mémorisé ?</h3><p>Tout ce que fait un utilisateur ne doit pas se retrouver dans la mémoire à long terme. Si quelqu'un crée un fichier temporaire et le supprime cinq minutes plus tard, le fait de l'enregistrer pour toujours n'aide personne. C'est là que réside la principale difficulté : <strong>comment le système décide-t-il de ce qui est réellement important ?</strong></p>
<p><strong>(1) Façons courantes de juger de l'importance</strong></p>
<p>Les équipes s'appuient généralement sur un mélange d'heuristiques :</p>
<ul>
<li><p><strong>basée sur le temps</strong>: les actions récentes ont plus d'importance que les anciennes</p></li>
<li><p><strong>Basé sur la fréquence</strong>: les fichiers ou les actions auxquels on accède de manière répétée sont plus importants.</p></li>
<li><p><strong>Basé sur le type</strong>: certains objets sont intrinsèquement plus importants (par exemple, les fichiers de configuration du projet par rapport aux fichiers de cache).</p></li>
</ul>
<p><strong>(2) Lorsque les règles sont contradictoires</strong></p>
<p>Ces signaux sont souvent contradictoires. Un fichier créé la semaine dernière mais fortement modifié aujourd'hui : est-ce l'ancienneté ou l'activité qui l'emporte ? Il n'y a pas de réponse unique et "correcte", c'est pourquoi l'évaluation de l'importance tend à devenir rapidement confuse.</p>
<p><strong>(3) L'utilité des bases de données vectorielles</strong></p>
<p>Les bases de données vectorielles offrent des mécanismes permettant d'appliquer les règles d'importance sans nettoyage manuel :</p>
<ul>
<li><p><strong>TTL :</strong> Milvus peut automatiquement supprimer des données après une durée déterminée.</p></li>
<li><p><strong>Décroissance :</strong> les vecteurs plus anciens peuvent être pondérés à la baisse de sorte qu'ils disparaissent naturellement de la recherche.</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Défi 2 : hiérarchisation de la mémoire dans la pratique</h3><p>Au fur et à mesure que les agents s'exécutent, la mémoire s'accumule. Le système a donc besoin d'un moyen de diviser la mémoire en niveaux <strong>chauds</strong> (accès fréquents) et <strong>froids</strong> (accès rares).</p>
<p><strong>(1) Décider quand la mémoire devient froide</strong></p>
<p>Dans ce modèle, la <em>mémoire chaude</em> fait référence aux données conservées dans la RAM pour un accès à faible latence, tandis que la <em>mémoire froide</em> fait référence aux données déplacées vers le disque ou le stockage d'objets pour réduire les coûts.</p>
<p>Le choix du moment où la mémoire devient froide peut se faire de différentes manières. Certains systèmes utilisent des modèles légers pour estimer l'importance sémantique d'une action ou d'un fichier en fonction de sa signification et de son utilisation récente. D'autres s'appuient sur une logique simple, basée sur des règles, comme le déplacement de la mémoire qui n'a pas été consultée depuis 30 jours ou qui n'est pas apparue dans les résultats de recherche depuis une semaine. Les utilisateurs peuvent également marquer explicitement certains fichiers ou actions comme étant importants, ce qui permet de s'assurer qu'ils restent toujours chauds.</p>
<p><strong>(2) Où sont stockées les mémoires chaudes et froides ?</strong></p>
<p>Une fois classées, les mémoires chaudes et froides sont stockées différemment. La mémoire chaude reste dans la RAM et est utilisée pour les contenus fréquemment consultés, tels que le contexte de la tâche active ou les actions récentes de l'utilisateur. La mémoire froide est déplacée vers des disques ou des systèmes de stockage d'objets tels que S3, où l'accès est plus lent mais où les coûts de stockage sont beaucoup plus faibles. Ce compromis fonctionne bien car la mémoire froide est rarement utilisée et n'est généralement consultée que pour des références à long terme.</p>
<p><strong>(3) L'utilité des bases de données vectorielles</strong></p>
<p><strong>Milvus et Zilliz Cloud</strong> prennent en charge ce modèle en permettant un stockage hiérarchisé chaud-froid tout en conservant une interface de requête unique, de sorte que les vecteurs fréquemment consultés restent en mémoire et que les données plus anciennes sont automatiquement déplacées vers un stockage moins coûteux.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Défi 3 : À quelle vitesse la mémoire doit-elle être écrite ?</h3><p>Les systèmes RAG traditionnels écrivent généralement les données par lots. Les index sont reconstruits hors ligne - souvent pendant la nuit - et ne deviennent consultables que plus tard. Cette approche fonctionne pour les bases de connaissances statiques, mais elle n'est pas adaptée à la mémoire des agents.</p>
<p><strong>(1) Pourquoi la mémoire d'agent a besoin d'écritures en temps réel</strong></p>
<p>La mémoire des agents doit saisir les actions de l'utilisateur au moment où elles se produisent. Si une action n'est pas enregistrée immédiatement, le prochain tour de conversation peut manquer de contexte critique. C'est pourquoi les systèmes de mémoire inscriptible nécessitent des écritures en temps réel plutôt que des mises à jour différées et hors ligne.</p>
<p><strong>(2) La tension entre la vitesse d'écriture et la qualité de la récupération</strong></p>
<p>La mémoire en temps réel exige une latence d'écriture très faible. Dans le même temps, une recherche de qualité dépend d'index bien construits, et la construction d'un index prend du temps. Reconstruire un index pour chaque écriture est trop coûteux, mais retarder l'indexation signifie que les données nouvellement écrites restent temporairement invisibles à la recherche. Ce compromis est au cœur de la conception des mémoires inscriptibles.</p>
<p><strong>(3) L'utilité des bases de données vectorielles</strong></p>
<p>Les bases de données vectorielles résolvent ce problème en découplant l'écriture de l'indexation. Une solution courante consiste à écrire en flux continu et à construire des index incrémentaux. En utilisant <strong>Milvus</strong> comme exemple, les nouvelles données sont d'abord écrites dans un tampon en mémoire, ce qui permet au système de gérer efficacement les écritures à haute fréquence. Avant même qu'un index complet ne soit construit, les données mises en mémoire tampon peuvent être interrogées en quelques secondes grâce à la fusion dynamique ou à la recherche approximative.</p>
<p>Lorsque la mémoire tampon atteint un seuil prédéfini, le système construit des index par lots et les conserve. Cela améliore les performances de recherche à long terme sans bloquer les écritures en temps réel. En séparant l'ingestion rapide de la construction d'index plus lente, Milvus atteint un équilibre pratique entre la vitesse d'écriture et la qualité de la recherche qui fonctionne bien pour la mémoire agent.</p>
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
    </button></h2><p>Cowork nous donne un aperçu d'une nouvelle classe d'agents - persistants, dotés d'un état, et capables de porter un contexte sur de longues durées. Mais il met aussi en évidence une autre chose : la mémoire à long terme n'est que la moitié de l'image. Pour construire des agents prêts à la production qui soient à la fois autonomes et fiables, nous avons encore besoin d'une récupération structurée sur de grandes bases de connaissances évolutives.</p>
<p>Les RAG gèrent les faits du monde ; la mémoire inscriptible gère l'état interne de l'agent. Les bases de données vectorielles se situent à l'intersection, fournissant l'indexation, la recherche hybride et le stockage évolutif qui permettent aux deux couches de fonctionner ensemble.</p>
<p>Au fur et à mesure que les agents à longue durée d'exécution continueront à mûrir, leurs architectures convergeront probablement vers cette conception hybride. Cowork est un signal fort de la direction que prennent les choses, non pas vers un monde sans RAG, mais vers des agents dotés de piles de mémoire plus riches, alimentées par des bases de données vectorielles.</p>
<p>Si vous souhaitez explorer ces idées ou obtenir de l'aide pour votre propre configuration, <strong>rejoignez notre</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> pour discuter avec les ingénieurs de Milvus. Et pour des conseils plus pratiques, vous pouvez toujours <strong>réserver une</strong> <strong>session</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours.</strong></a> </p>
