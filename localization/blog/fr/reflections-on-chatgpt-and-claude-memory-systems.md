---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Réflexions sur ChatGPT et les systèmes de mémoire de Claude : Ce qu'il faut
  pour permettre une récupération conversationnelle à la demande
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Découvrez comment ChatGPT et Claude conçoivent la mémoire différemment,
  pourquoi la récupération conversationnelle à la demande est difficile et
  comment Milvus 2.6 la permet à l'échelle de la production.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>Dans les systèmes d'agents d'IA de haute qualité, la conception de la mémoire est beaucoup plus complexe qu'il n'y paraît à première vue. Elle doit répondre à trois questions fondamentales : Comment l'historique des conversations doit-il être stocké ? Quand le contexte passé doit-il être récupéré ? Et qu'est-ce qui doit être récupéré exactement ?</p>
<p>Ces choix déterminent directement le temps de réponse d'un agent, l'utilisation des ressources et, en fin de compte, le plafond de ses capacités.</p>
<p>Les modèles tels que ChatGPT et Claude sont de plus en plus "conscients de la mémoire" à mesure que nous les utilisons. Ils se souviennent des préférences, s'adaptent aux objectifs à long terme et maintiennent la continuité entre les sessions. En ce sens, ils fonctionnent déjà comme des mini-agents d'intelligence artificielle. Pourtant, sous la surface, leurs systèmes de mémoire sont construits sur des hypothèses architecturales très différentes.</p>
<p>Des analyses récentes de rétro-ingénierie des <a href="https://manthanguptaa.in/posts/claude_memory/">mécanismes de mémoire de</a> <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>et de <a href="https://manthanguptaa.in/posts/claude_memory/">Claude</a> révèlent un contraste évident. <strong>ChatGPT</strong> s'appuie sur l'injection de contexte précalculé et la mise en cache en couches pour offrir une continuité légère et prévisible. <strong>Claude,</strong> en revanche, adopte le style RAG, la récupération à la demande avec des mises à jour dynamiques de la mémoire pour équilibrer la profondeur de la mémoire et l'efficacité.</p>
<p>Ces deux approches ne sont pas simplement des préférences de conception, elles sont façonnées par les capacités de l'infrastructure. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a> introduit la combinaison de la récupération hybride dense-sparse, du filtrage scalaire efficace et du stockage hiérarchisé que la mémoire conversationnelle à la demande requiert, rendant la récupération sélective suffisamment rapide et économique pour être déployée dans les systèmes du monde réel.</p>
<p>Dans ce billet, nous verrons comment les systèmes de mémoire de ChatGPT et de Claude fonctionnent réellement, pourquoi ils ont divergé au niveau de l'architecture, et comment les avancées récentes dans des systèmes comme Milvus rendent la récupération conversationnelle à la demande pratique à l'échelle.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">Le système de mémoire de ChatGPT<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Au lieu d'interroger une base de données vectorielle ou de récupérer dynamiquement les conversations passées au moment de l'inférence, ChatGPT construit sa "mémoire" en assemblant un ensemble fixe de composants contextuels et en les injectant directement dans chaque invite. Chaque composant est préparé à l'avance et occupe une position connue dans l'invite.</p>
<p>Cette conception permet de préserver la personnalisation et la continuité de la conversation tout en rendant la latence, l'utilisation des jetons et le comportement du système plus prévisibles. En d'autres termes, la mémoire n'est pas quelque chose que le modèle recherche à la volée, c'est quelque chose que le système conditionne et remet au modèle chaque fois qu'il génère une réponse.</p>
<p>À un niveau élevé, une invite ChatGPT complète se compose des couches suivantes, classées de la plus globale à la plus immédiate :</p>
<p>[0] Instructions du système</p>
<p>[1] Instructions du développeur</p>
<p>[2] Métadonnées de la session (éphémères)</p>
<p>[3] Mémoire de l'utilisateur (faits à long terme)</p>
<p>[4] Résumé des conversations récentes (conversations passées, titres + extraits)</p>
<p>[5] Messages de la session en cours (cette discussion)</p>
<p>[6] Votre dernier message</p>
<p>Parmi ces éléments, les composants [2] à [5] constituent la mémoire effective du système, chacun jouant un rôle distinct.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Métadonnées de session</h3><p>Les métadonnées de session représentent des informations de courte durée, non persistantes, qui sont injectées une fois au début d'une conversation et supprimées à la fin de la session. Leur rôle est d'aider le modèle à s'adapter au contexte d'utilisation actuel plutôt que de personnaliser le comportement à long terme.</p>
<p>Cette couche capture des signaux relatifs à l'environnement immédiat de l'utilisateur et à ses habitudes d'utilisation récentes. Les signaux typiques sont les suivants</p>
<ul>
<li><p><strong>des informations sur l'appareil</strong> - par exemple, si l'utilisateur est sur un téléphone portable ou un ordinateur de bureau</p></li>
<li><p><strong>Attributs du compte</strong> - tels que le niveau d'abonnement (par exemple, ChatGPT Go), l'âge du compte et la fréquence d'utilisation globale.</p></li>
<li><p><strong>Mesures comportementales</strong> - y compris les jours actifs au cours des 1, 7 et 30 derniers jours, la durée moyenne de la conversation et la distribution de l'utilisation du modèle (par exemple, 49 % des demandes traitées par GPT-5).</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Mémoire des utilisateurs</h3><p>La mémoire de l'utilisateur est la couche de mémoire persistante et modifiable qui permet de personnaliser les conversations. Elle stocke des informations relativement stables, telles que le nom de l'utilisateur, son rôle ou ses objectifs de carrière, ses projets en cours, ses résultats passés et ses préférences en matière d'apprentissage, et est injectée dans chaque nouvelle conversation afin de préserver la continuité au fil du temps.</p>
<p>Cette mémoire peut être mise à jour de deux manières :</p>
<ul>
<li><p>Les<strong>mises à jour explicites</strong> se produisent lorsque les utilisateurs gèrent directement la mémoire à l'aide d'instructions telles que "se souvenir de ceci" ou "supprimer ceci de la mémoire".</p></li>
<li><p>Les<strong>mises à jour implicites</strong> se produisent lorsque le système identifie des informations qui répondent aux critères de stockage d'OpenAI, comme un nom confirmé ou un titre de poste, et les enregistre automatiquement, sous réserve du consentement par défaut de l'utilisateur et des paramètres de la mémoire.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Résumé des conversations récentes</h3><p>Le résumé de la conversation récente est une couche contextuelle légère, intersession, qui préserve la continuité sans rejouer ou récupérer l'historique complet des conversations. Au lieu de s'appuyer sur une récupération dynamique, comme dans les approches traditionnelles basées sur les RAG, ce résumé est précalculé et injecté directement dans chaque nouvelle conversation.</p>
<p>Cette couche résume uniquement les messages de l'utilisateur, à l'exclusion des réponses de l'assistant. Sa taille est volontairement limitée (environ 15 entrées en général) et elle ne retient que les signaux de haut niveau concernant les intérêts récents plutôt que le contenu détaillé. Comme elle ne s'appuie pas sur les enchâssements ou la recherche de similarités, elle maintient la latence et la consommation de jetons à un niveau peu élevé.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Messages de la session en cours</h3><p>Les messages de la session en cours contiennent l'historique complet des messages de la conversation en cours et fournissent le contexte à court terme nécessaire à des réponses cohérentes, au fur et à mesure. Cette couche comprend à la fois les entrées de l'utilisateur et les réponses de l'assistant, mais uniquement tant que la session reste active.</p>
<p>Comme le modèle fonctionne avec une limite fixe de jetons, cet historique ne peut pas croître indéfiniment. Lorsque la limite est atteinte, le système supprime les premiers messages pour faire de la place aux plus récents. Cette troncature n'affecte que la session en cours : la mémoire à long terme de l'utilisateur et le résumé des conversations récentes restent intacts.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">Le système de mémoire de Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude adopte une approche différente de la gestion de la mémoire. Plutôt que d'injecter un ensemble important et fixe de composants de mémoire dans chaque invite, comme le fait ChatGPT, Claude combine la mémoire persistante de l'utilisateur avec des outils à la demande et une récupération sélective. Le contexte historique n'est récupéré que lorsque le modèle le juge pertinent, ce qui permet au système de faire un compromis entre la profondeur contextuelle et le coût de calcul.</p>
<p>Le contexte de l'invite de Claude est structuré comme suit :</p>
<p>[0] Invite du système (instructions statiques)</p>
<p>[1] Mémoires de l'utilisateur</p>
<p>[2] Historique de la conversation</p>
<p>[3] Message actuel</p>
<p>Les principales différences entre Claude et ChatGPT résident dans la <strong>manière dont l'historique des conversations est récupéré</strong> et <strong>dont la mémoire de l'utilisateur est mise à jour et maintenue</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Mémoires d'utilisateurs</h3><p>Dans Claude, les mémoires d'utilisateurs forment une couche de contexte à long terme similaire à la mémoire d'utilisateur de ChatGPT, mais avec un accent plus marqué sur les mises à jour automatiques en arrière-plan. Ces mémoires sont stockées dans un format structuré (enveloppé dans des balises de style XML) et sont conçues pour évoluer progressivement dans le temps avec une intervention minimale de l'utilisateur.</p>
<p>Claude prend en charge deux modes de mise à jour :</p>
<ul>
<li><p><strong>Mises à jour implicites</strong> - Le système analyse périodiquement le contenu des conversations et met à jour la mémoire en arrière-plan. Ces mises à jour ne sont pas appliquées en temps réel, et les mémoires associées aux conversations supprimées sont progressivement élaguées dans le cadre d'une optimisation continue.</p></li>
<li><p><strong>Mises à jour explicites</strong> - Les utilisateurs peuvent gérer directement la mémoire par le biais de commandes telles que "se souvenir de ceci" ou "supprimer ceci", qui sont exécutées via un outil dédié <code translate="no">memory_user_edits</code>.</p></li>
</ul>
<p>Par rapport à ChatGPT, Claude confie au système lui-même la responsabilité d'affiner, de mettre à jour et d'élaguer la mémoire à long terme. Cela réduit la nécessité pour les utilisateurs de conserver activement ce qui est stocké.</p>
<h3 id="Conversation-History" class="common-anchor-header">Historique des conversations</h3><p>Pour l'historique des conversations, Claude ne s'appuie pas sur un résumé fixe qui est injecté dans chaque message. Au lieu de cela, il récupère le contexte passé uniquement lorsque le modèle décide que c'est nécessaire, en utilisant trois mécanismes distincts. Cela permet d'éviter de reporter un historique non pertinent et de contrôler l'utilisation des jetons.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Composant</strong></th><th style="text-align:center"><strong>Objectif</strong></th><th style="text-align:center"><strong>Comment il est utilisé</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Fenêtre mobile (conversation en cours)</strong></td><td style="text-align:center">Stocke l'historique complet des messages de la conversation en cours (et non un résumé), de manière similaire au contexte de session de ChatGPT</td><td style="text-align:center">Injecté automatiquement. La limite de jetons est de ~190K ; les messages plus anciens sont supprimés une fois la limite atteinte.</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>outil</strong></td><td style="text-align:center">Recherche des conversations passées par sujet ou mot-clé, renvoyant des liens de conversation, des titres et des extraits de messages de l'utilisateur/assistant.</td><td style="text-align:center">Déclenché lorsque le modèle détermine que des détails historiques sont nécessaires. Les paramètres sont <code translate="no">query</code> (termes de recherche) et <code translate="no">max_results</code> (1-10).</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>outil</strong></td><td style="text-align:center">Récupère les conversations récentes dans un intervalle de temps spécifié (par exemple, "les 3 derniers jours"), les résultats étant formatés de la même manière que dans le cas de l'outil de recherche. <code translate="no">conversation_search</code></td><td style="text-align:center">Déclenché lorsque le contexte récent et temporel est pertinent. Les paramètres comprennent <code translate="no">n</code> (nombre de résultats), <code translate="no">sort_order</code>, et l'intervalle de temps.</td></tr>
</tbody>
</table>
<p>Parmi ces composants, <code translate="no">conversation_search</code> est particulièrement remarquable. Il peut faire apparaître des résultats pertinents même pour des requêtes formulées en termes vagues ou multilingues, ce qui indique qu'il opère à un niveau sémantique plutôt que de s'appuyer sur une simple correspondance de mots-clés. Il s'agit probablement d'une recherche basée sur l'intégration ou d'une approche hybride qui traduit ou normalise d'abord la requête sous une forme canonique, puis applique une recherche par mot-clé ou une recherche hybride.</p>
<p>Dans l'ensemble, l'approche de Claude en matière de recherche à la demande présente plusieurs points forts notables :</p>
<ul>
<li><p>L'<strong>extraction n'est pas automatique</strong>: Les appels d'outils sont déclenchés par le propre jugement du modèle. Par exemple, lorsqu'un utilisateur fait référence au <em>"projet dont nous avons discuté la dernière fois",</em> Claude peut décider d'invoquer <code translate="no">conversation_search</code> pour récupérer le contexte pertinent.</p></li>
<li><p><strong>Un contexte plus riche en cas de besoin</strong>: Les résultats récupérés peuvent inclure des <strong>extraits de la réponse de l'assistant</strong>, alors que les résumés de ChatGPT ne capturent que les messages de l'utilisateur. Claude est donc mieux adapté aux cas d'utilisation qui nécessitent un contexte conversationnel plus approfondi ou plus précis.</p></li>
<li><p><strong>Une meilleure efficacité par défaut</strong>: Le contexte historique n'étant injecté qu'en cas de besoin, le système évite de reporter de grandes quantités d'historique non pertinent, réduisant ainsi la consommation inutile de jetons.</p></li>
</ul>
<p>Les compromis sont tout aussi clairs. L'introduction de la recherche à la demande augmente la complexité du système : les index doivent être construits et maintenus, les requêtes exécutées, les résultats classés et parfois reclassés. La latence de bout en bout devient également moins prévisible qu'avec un contexte précalculé et toujours injecté. En outre, le modèle doit apprendre à décider quand l'extraction est nécessaire. Si ce jugement échoue, il se peut que le contexte pertinent ne soit jamais récupéré.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">Les contraintes de la recherche à la demande à la Claude<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>L'adoption d'un modèle de recherche à la demande fait de la base de données vectorielle un élément essentiel de l'architecture. La recherche par conversation impose des exigences inhabituellement élevées en matière de stockage et d'exécution des requêtes, et le système doit répondre à quatre contraintes en même temps.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Tolérance de faible latence</h3><p>Dans les systèmes conversationnels, la latence P99 doit généralement rester inférieure à ~20 ms. Les retards au-delà de ce seuil sont immédiatement perceptibles par les utilisateurs. Cela laisse peu de place à l'inefficacité : la recherche vectorielle, le filtrage des métadonnées et le classement des résultats doivent tous être soigneusement optimisés. Un goulot d'étranglement à n'importe quel moment peut dégrader l'ensemble de l'expérience conversationnelle.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Exigences en matière de recherche hybride</h3><p>Les requêtes des utilisateurs couvrent souvent plusieurs dimensions. Une requête telle que <em>"discussions sur RAG de la semaine écoulée"</em> combine pertinence sémantique et filtrage temporel. Si une base de données ne prend en charge que la recherche vectorielle, elle peut renvoyer 1 000 résultats sémantiquement similaires, mais le filtrage de la couche d'application les réduira à une poignée, ce qui gaspillera la majeure partie du calcul. Pour être pratique, la base de données doit prendre en charge de manière native les requêtes vectorielles et scalaires combinées.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Séparation du stockage et du calcul</h3><p>L'historique des conversations présente un schéma d'accès chaud-froid évident. Les conversations récentes font l'objet de requêtes fréquentes, tandis que les plus anciennes sont rarement consultées. Si tous les vecteurs devaient rester en mémoire, le stockage de dizaines de millions de conversations consommerait des centaines de gigaoctets de mémoire vive, un coût irréaliste à l'échelle. Pour être viable, le système doit prendre en charge la séparation du stockage et du calcul, en conservant les données chaudes en mémoire et les données froides dans le stockage d'objets, les vecteurs étant chargés à la demande.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Diverses formes de requêtes</h3><p>La recherche de conversations ne suit pas un modèle d'accès unique. Certaines requêtes sont purement sémantiques (par exemple, <em>"l'optimisation des performances dont nous avons discuté")</em>, d'autres sont purement temporelles (<em>"toutes les conversations de la semaine dernière")</em>, et beaucoup combinent des contraintes multiples (<em>"les discussions liées à Python mentionnant FastAPI au cours des trois derniers mois").</em> Le planificateur de requêtes de la base de données doit adapter les stratégies d'exécution aux différents types de requêtes, plutôt que de s'appuyer sur une recherche brute universelle.</p>
<p>Ensemble, ces quatre défis définissent les contraintes fondamentales de la recherche conversationnelle. Tout système cherchant à mettre en œuvre une recherche à la demande de type Claude doit les relever de manière coordonnée.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Pourquoi Milvus 2.6 fonctionne-t-il bien pour la recherche conversationnelle ?<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Les choix de conception de <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a> s'alignent étroitement sur les exigences fondamentales de la recherche conversationnelle à la demande. Vous trouverez ci-dessous une ventilation des capacités clés et de leur correspondance avec les besoins réels en matière de recherche conversationnelle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Recherche hybride avec des vecteurs denses et épars</h3><p>Milvus 2.6 prend en charge de manière native le stockage de vecteurs denses et épars dans la même collection et la fusion automatique de leurs résultats au moment de la requête. Les vecteurs denses (par exemple, les encastrements à 768 dimensions générés par des modèles tels que BGE-M3) capturent la similarité sémantique, tandis que les vecteurs épars (généralement produits par BM25) préservent les signaux exacts des mots-clés.</p>
<p>Pour une requête telle que <em>"discussions sur le RAG de la semaine dernière",</em> Milvus exécute en parallèle la recherche sémantique et la recherche par mot-clé, puis fusionne les résultats par le biais d'un reranking. Par rapport à l'utilisation de l'une ou l'autre approche seule, cette stratégie hybride permet d'obtenir un taux de rappel nettement plus élevé dans des scénarios conversationnels réels.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Séparation stockage-calcul et optimisation des requêtes</h3><p>Milvus 2.6 prend en charge le stockage hiérarchisé de deux manières :</p>
<ul>
<li><p>Données chaudes en mémoire, données froides dans le stockage d'objets</p></li>
<li><p>Les index en mémoire, les données vectorielles brutes dans le stockage d'objets.</p></li>
</ul>
<p>Avec cette conception, le stockage d'un million d'entrées de conversation peut être réalisé avec environ 2 Go de mémoire et 8 Go de stockage d'objets. Avec un réglage approprié, la latence P99 peut rester inférieure à 20 ms, même lorsque la séparation stockage-computation est activée.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">Déchiquetage JSON et filtrage scalaire rapide</h3><p>Milvus 2.6 active le déchiquetage JSON par défaut, en aplatissant les champs JSON imbriqués dans un stockage en colonnes. Cela améliore les performances du filtrage scalaire de 3 à 5 fois selon les références officielles (les gains réels varient en fonction du modèle de requête).</p>
<p>La recherche conversationnelle nécessite souvent un filtrage par métadonnées telles que l'identifiant de l'utilisateur, l'identifiant de la session ou l'intervalle de temps. Avec JSON Shredding, des requêtes telles que <em>"toutes les conversations de l'utilisateur A au cours de la semaine écoulée"</em> peuvent être exécutées directement sur des index en colonnes, sans avoir à analyser de manière répétée des blobs JSON complets.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Contrôle open-source et flexibilité opérationnelle</h3><p>En tant que système open-source, Milvus offre un niveau de contrôle architectural et opérationnel que les solutions fermées à boîte noire n'offrent pas. Les équipes peuvent régler les paramètres d'index, appliquer des stratégies de hiérarchisation des données et personnaliser les déploiements distribués en fonction de leurs charges de travail.</p>
<p>Cette flexibilité réduit la barrière à l'entrée : les équipes de petite et moyenne taille peuvent construire des systèmes de recherche conversationnelle à l'échelle d'un million ou d'une dizaine de millions sans dépendre de budgets d'infrastructure surdimensionnés.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Pourquoi ChatGPT et Claude ont pris des chemins différents<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>À un niveau élevé, la différence entre les systèmes de mémoire de ChatGPT et de Claude se résume à la façon dont chacun gère l'oubli. ChatGPT favorise l'oubli proactif : une fois que la mémoire dépasse les limites fixées, le contexte plus ancien est abandonné. Ceci échange l'exhaustivité contre la simplicité et un comportement prévisible du système. Claude favorise l'oubli différé. En théorie, l'historique des conversations peut croître sans limite, le rappel étant délégué à un système de récupération à la demande.</p>
<p>Pourquoi les deux systèmes ont-ils choisi des voies différentes ? Avec les contraintes techniques exposées ci-dessus, la réponse devient claire : <strong>chaque architecture n'est viable que si l'infrastructure sous-jacente peut la supporter</strong>.</p>
<p>Si l'approche de Claude avait été tentée en 2020, elle aurait probablement été irréalisable. À l'époque, les bases de données vectorielles présentaient souvent des temps de latence de plusieurs centaines de millisecondes, les requêtes hybrides étaient mal supportées et l'utilisation des ressources augmentait de manière prohibitive à mesure que les données s'accroissaient. Dans ces conditions, la recherche à la demande aurait été considérée comme une ingénierie excessive.</p>
<p>En 2025, le paysage a changé. Les progrès réalisés en matière d'infrastructure, sous l'impulsion de systèmes tels que <strong>Milvus 2.6, ont</strong>rendu viables en production la séparation du stockage et du calcul, l'optimisation des requêtes, la recherche hybride dense et éparse et le déchiquetage JSON. Ces progrès réduisent la latence, contrôlent les coûts et rendent la recherche sélective pratique à l'échelle. En conséquence, les outils à la demande et la mémoire basée sur la recherche sont devenus non seulement réalisables, mais aussi de plus en plus attrayants, en particulier en tant que base pour les systèmes de type agent.</p>
<p>En fin de compte, les choix d'architecture dépendent de ce que l'infrastructure rend possible.</p>
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
    </button></h2><p>Dans les systèmes réels, la conception de la mémoire n'est pas un choix binaire entre un contexte précalculé et une récupération à la demande. Les architectures les plus efficaces sont généralement hybrides, combinant les deux approches.</p>
<p>Un modèle courant consiste à injecter des conversations récentes par le biais d'une fenêtre contextuelle glissante, à stocker les préférences stables de l'utilisateur dans une mémoire fixe et à récupérer l'historique plus ancien à la demande par le biais d'une recherche vectorielle. Au fur et à mesure de la maturation d'un produit, cet équilibre peut être modifié progressivement - d'un contexte principalement précalculé à un contexte de plus en plus axé sur la recherche - sans nécessiter de réinitialisation architecturale perturbatrice.</p>
<p>Même si l'on commence par une approche précalculée, il est important de concevoir le produit en tenant compte de la migration. La mémoire doit être stockée avec des identifiants clairs, des horodatages, des catégories et des références aux sources. Lorsque l'extraction devient viable, des embeddings peuvent être générés pour la mémoire existante et ajoutés à une base de données vectorielle avec les mêmes métadonnées, ce qui permet d'introduire la logique d'extraction de manière progressive et avec un minimum de perturbations.</p>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou déposez des questions sur <a href="https://github.com/milvus-io/milvus">GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
