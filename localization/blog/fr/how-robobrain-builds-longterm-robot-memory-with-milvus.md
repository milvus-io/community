---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Comment RoboBrain construit la mémoire à long terme du robot avec Milvus
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  Les modules robotiques peuvent fonctionner seuls mais échouent lorsqu'ils sont
  enchaînés. Le PDG de Senqi AI explique comment RoboBrain utilise l'état de la
  tâche, le retour d'information et la mémoire Milvus.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Ce billet a été rédigé par Song Zhi, PDG de Senqi AI, une entreprise d'IA incarnée qui construit une infrastructure d'exécution des tâches pour les robots. RoboBrain est l'un des produits phares de Senqi AI.</em></p>
<p>La plupart des capacités des robots fonctionnent bien par elles-mêmes. Un modèle de navigation peut planifier un itinéraire. Un modèle de perception peut identifier des objets. Un module de parole peut accepter des instructions. L'échec de la production apparaît lorsque ces capacités doivent fonctionner comme une tâche continue.</p>
<p>Pour un robot, une instruction simple telle que "Va vérifier cette zone, photographie tout ce qui est inhabituel et préviens-moi" nécessite une planification avant le début de la tâche, une adaptation pendant son exécution et la production d'un résultat utile à la fin. Chaque transfert peut être interrompu : la navigation se bloque derrière un obstacle, une photo floue est acceptée comme définitive ou le système oublie l'exception qu'il a traitée il y a cinq minutes.</p>
<p>C'est le principal défi auquel sont confrontés les <a href="https://zilliz.com/glossary/ai-agents">agents d'intelligence artificielle</a> opérant dans le monde physique. Contrairement aux agents numériques, les robots s'exécutent face à des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données</a> continues <a href="https://zilliz.com/learn/introduction-to-unstructured-data">et non structurées</a>: chemins bloqués, lumière changeante, limites de la batterie, bruit des capteurs et règles de l'opérateur.</p>
<p>RoboBrain est le système d'exploitation d'intelligence incarnée de Senqi AI pour l'exécution des tâches des robots. Il se situe au niveau de la tâche, reliant la perception, la planification, le contrôle de l'exécution et le retour d'information afin que les instructions en langage naturel puissent devenir des flux de travail structurés et récupérables pour le robot.</p>
<table>
<thead>
<tr><th>Point d'arrêt</th><th>Ce qui échoue dans la production</th><th>Comment RoboBrain y remédie</th></tr>
</thead>
<tbody>
<tr><td>Planification des tâches</td><td>Les instructions vagues laissent les modules en aval sans champs d'exécution concrets.</td><td>L'objectivation des tâches transforme l'intention en un état partagé.</td></tr>
<tr><td>Acheminement du contexte</td><td>Les bonnes informations existent, mais elles parviennent au mauvais stade de la décision.</td><td>La mémoire à plusieurs niveaux achemine le contexte en temps réel, à court terme et à long terme séparément.</td></tr>
<tr><td>Retour de données</td><td>Un seul passage se termine ou échoue sans améliorer l'exécution suivante.</td><td>Les rétroactions mettent à jour l'état de la tâche et la mémoire à long terme.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Trois points d'arrêt dans l'exécution d'une tâche par un robot<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Les tâches logicielles peuvent souvent être délimitées en termes d'entrée, de processus et de résultat. Les tâches des robots sont confrontées à un état physique en mouvement : chemins bloqués, lumière changeante, limites de la batterie, bruit des capteurs et règles de l'opérateur.</p>
<p>C'est pourquoi la boucle des tâches a besoin de plus que des modèles isolés. Elle a besoin d'un moyen de préserver le contexte à travers la planification, l'exécution et le retour d'information.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. Planification des tâches : Des instructions vagues produisent une exécution vague</h3><p>Une phrase comme "Va jeter un coup d'œil" cache de nombreuses décisions. Quelle zone ? Que doit photographier le robot ? Qu'est-ce qui est considéré comme inhabituel ? Que doit-il faire si la prise de vue échoue ? Quel résultat doit-il renvoyer à l'opérateur ?</p>
<p>Si la couche de tâche ne peut pas résoudre ces détails en champs concrets - zone cible, objet d'inspection, condition d'achèvement, politique d'échec et format de retour - la tâche s'exécute sans direction dès le départ et ne récupère jamais le contexte en aval.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Acheminement du contexte : Les bonnes données arrivent à la mauvaise étape</h3><p>La pile du robot peut déjà contenir les bonnes informations, mais l'exécution de la tâche dépend de leur récupération au bon moment.</p>
<p>La phase de démarrage a besoin de cartes, de définitions de zones et de règles de fonctionnement. La phase d'exécution intermédiaire a besoin de l'état des capteurs en temps réel. Le traitement des exceptions nécessite des cas similaires issus de déploiements antérieurs. Lorsque ces sources sont mélangées, le système prend le bon type de décision dans le mauvais contexte.</p>
<p>Lorsque le routage échoue, le démarrage s'appuie sur une expérience périmée au lieu de règles locales, la gestion des exceptions ne peut pas atteindre les cas dont elle a besoin, et l'exécution intermédiaire reçoit la carte d'hier au lieu de lectures en direct. Donner un dictionnaire à quelqu'un ne l'aide pas à écrire une dissertation. Les données doivent parvenir au bon point de décision, à la bonne étape, sous la bonne forme.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Retour d'informations : L'exécution en une seule passe n'apporte aucune amélioration</h3><p>Sans retour d'information, un robot peut terminer une exécution sans améliorer la suivante. Une action terminée doit encore faire l'objet d'un contrôle de qualité : l'image est-elle suffisamment nette ou le robot doit-il reprendre la photo ? Le chemin est-il toujours dégagé ou doit-il faire un détour ? La batterie est-elle au-dessus du seuil, ou la tâche doit-elle être interrompue ?</p>
<p>Un système à passage unique ne dispose d'aucun mécanisme pour ces appels. Il s'exécute, s'arrête et répète le même échec la prochaine fois.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Comment RoboBrain ferme la boucle des tâches du robot<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain relie la compréhension de l'environnement, la planification des tâches, le contrôle de l'exécution et le retour d'informations en une seule boucle de fonctionnement.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>L'architecture de l'intergiciel de base de RoboBrain montre comment l'intention de l'utilisateur passe par les objets de tâche, la mémoire à détection d'étape alimentée par Milvus et un moteur de politique avant d'atteindre les capacités incarnées.</span> </span></p>
<p>Dans l'architecture décrite dans ce billet, cette boucle est mise en œuvre par trois mécanismes :</p>
<ol>
<li>L'<strong>objectivation des tâches</strong> structure le point d'entrée.</li>
<li>La<strong>mémoire à plusieurs niveaux</strong> achemine les bonnes informations à la bonne étape.</li>
<li><strong>Une boucle de retour</strong> écrit les résultats et décide de la prochaine étape.</li>
</ol>
<p>Ces mécanismes ne fonctionnent qu'en tant qu'ensemble. Si l'on corrige l'un d'entre eux sans les autres, la chaîne se brise toujours au point suivant.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. Objectivation des tâches : Transformer l'intention en un état partagé</h3><p>Avant que l'exécution ne commence, RoboBrain transforme chaque instruction en un objet de tâche : type de tâche, zone cible, objet d'inspection, contraintes, résultat attendu, étape actuelle et politique d'échec.</p>
<p>Il ne s'agit pas seulement d'analyser le langage. Il s'agit de donner à chaque module en aval la même vue de l'état de la tâche. Sans cette conversion, la tâche n'a pas de direction.</p>
<p>Dans l'exemple de la patrouille, l'objet de la tâche renseigne le type d'inspection, la zone désignée, les éléments anormaux en tant qu'objet de contrôle, la batterie &gt;= 20 % en tant que contrainte, une photo d'anomalie claire et une alerte de l'opérateur en tant que résultat attendu, et le retour à la base en tant que politique d'échec.</p>
<p>Le champ d'étape se met à jour au fur et à mesure que l'exécution évolue. Un obstacle fait passer la tâche de la navigation à la déviation ou à la demande d'aide. Une image floue fait passer la tâche de l'inspection à la prise de vue. Une batterie faible fait passer la tâche à l'arrêt et au retour à la base.</p>
<p>Les modules en aval ne reçoivent plus de commandes isolées. Ils reçoivent l'étape actuelle de la tâche, ses contraintes et la raison pour laquelle l'étape a changé.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Mémoire à plusieurs niveaux : Acheminement du contexte vers la bonne étape</h3><p>RoboBrain répartit les informations relatives à la tâche en trois niveaux afin que les bonnes données parviennent à la bonne étape.</p>
<p>L'<strong>état en temps réel</strong> contient la pose, la batterie, les relevés des capteurs et les observations environnementales. Il permet de prendre des décisions à chaque étape du contrôle.</p>
<p>Le<strong>contexte à court terme</strong> enregistre les événements liés à la tâche en cours : l'obstacle que le robot a évité il y a deux minutes, la photo qu'il a prise à nouveau ou la porte qu'il n'a pas réussi à ouvrir du premier coup. Cette mémoire permet au système de ne pas perdre le fil de ce qui vient de se passer.</p>
<p>La<strong>mémoire sémantique à long terme</strong> stocke la connaissance de la scène, l'expérience historique, les cas d'exception et les commentaires post-tâche. Une aire de stationnement particulière peut nécessiter des ajustements de l'angle de la caméra la nuit en raison de la présence de surfaces réfléchissantes. Un certain type d'anomalie peut avoir des antécédents de faux positifs et devrait déclencher un examen humain plutôt qu'une alerte automatique.</p>
<p>Ce niveau à long terme repose sur la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités vectorielles</a> dans la <a href="https://milvus.io/">base de données vectorielles Milvus</a>, car l'extraction de la bonne mémoire implique une correspondance par le sens, et non par l'identification ou le mot-clé. Les descriptions de scènes et les enregistrements de manipulations sont stockés sous forme d'<a href="https://zilliz.com/glossary/vector-embeddings">encastrements vectoriels</a> et récupérés à l'aide d'une <a href="https://zilliz.com/glossary/anns">recherche approximative du plus proche voisin</a> afin de trouver les correspondances sémantiques les plus proches.</p>
<p>Au démarrage, les règles de zone et les résumés des patrouilles passées sont extraits de la mémoire à long terme. L'exécution à mi-parcours s'appuie sur l'état en temps réel et le contexte à court terme. Le traitement des exceptions utilise la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a> pour trouver des cas similaires dans la mémoire à long terme.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. Boucle de rétroaction : Réintégration des résultats dans le système</h3><p>RoboBrain écrit les résultats de la navigation, de la perception et de l'action dans l'objet de la tâche après chaque étape, en mettant à jour le champ de la scène. Le système lit ces observations et décide de la prochaine action : détour si le chemin est inaccessible, nouvelle prise de vue si l'image est floue, nouvelle tentative si la porte ne s'ouvre pas, ou arrêt si la batterie est faible.</p>
<p>L'exécution devient un cycle : exécuter, observer, ajuster, exécuter à nouveau. La chaîne continue de s'adapter aux changements environnementaux au lieu de s'interrompre à la première apparition d'un événement inattendu.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Comment Milvus alimente la mémoire à long terme du robot RoboBrain<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Certaines mémoires de robots peuvent être interrogées par l'ID de la tâche, l'horodatage ou les métadonnées de la session. L'expérience opérationnelle à long terme ne peut généralement pas l'être.</p>
<p>L'enregistrement utile est souvent le cas qui est sémantiquement similaire à la scène actuelle, même si l'identifiant de la tâche, le nom de l'emplacement ou la formulation sont différents. Il s'agit donc d'un problème de <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a>, et Milvus convient parfaitement au niveau de la mémoire à long terme.</p>
<p>Ce niveau stocke des informations telles que</p>
<ul>
<li>les descriptions des règles de zone et la sémantique des points de localisation</li>
<li>les définitions des types d'anomalies et les résumés d'exemples</li>
<li>les enregistrements historiques des manipulations et les conclusions de l'examen post-tâche</li>
<li>les résumés de patrouille rédigés à la fin de la tâche</li>
<li>les comptes rendus d'expérience après la prise en charge par l'homme</li>
<li>les causes de défaillance et les stratégies de correction de scénarios similaires.</li>
</ul>
<p>Rien de tout cela n'est naturellement accessible par le biais d'un champ structuré. Tout cela doit être rappelé en fonction de la signification.</p>
<p>Un exemple concret : le robot patrouille de nuit à l'entrée d'un parking. L'éblouissement causé par les plafonniers rend la détection d'anomalies instable. Les reflets sont constamment signalés comme des anomalies.</p>
<p>Le système doit se souvenir des stratégies de reprise de vue qui ont fonctionné en cas de fort éblouissement nocturne, des corrections de l'angle de la caméra dans des zones similaires et des conclusions de l'évaluation humaine qui ont marqué les détections antérieures comme des faux positifs. Une requête de correspondance exacte peut trouver un identifiant de tâche ou une fenêtre temporelle connus. Elle ne peut pas retrouver de manière fiable "le cas d'éblouissement antérieur qui s'est comporté comme celui-ci", à moins que cette relation n'ait déjà été étiquetée.</p>
<p>La similarité sémantique est le modèle de recherche qui fonctionne. Les <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">mesures de similarité</a> classent les souvenirs stockés en fonction de leur pertinence, tandis que le <a href="https://milvus.io/docs/filtered-search.md">filtrage des métadonnées</a> peut réduire l'espace de recherche par domaine, type de tâche ou fenêtre temporelle. En pratique, il s'agit souvent d'une <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">recherche hybride</a>: correspondance sémantique pour la signification, filtres structurés pour les contraintes opérationnelles.</p>
<p>Pour la mise en œuvre, la couche de filtrage est souvent l'endroit où la mémoire sémantique devient opérationnelle. Les <a href="https://milvus.io/docs/boolean.md">expressions de filtre Milvus</a> définissent des contraintes scalaires, tandis que les <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">requêtes scalaires Milvus</a> prennent en charge les recherches exactes lorsque le système a besoin d'enregistrements par métadonnées plutôt que par similarité.</p>
<p>Ce modèle de recherche ressemble à la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">génération augmentée de recherche</a> adaptée à la prise de décision dans le monde physique plutôt qu'à la génération de texte. Le robot ne recherche pas des documents pour répondre à une question ; il recherche des expériences antérieures pour choisir la prochaine action sûre.</p>
<p>Tout n'entre pas dans Milvus. Les identifiants de tâches, les horodatages et les métadonnées de session sont stockés dans une base de données relationnelle. Les journaux d'exécution bruts sont stockés dans un système de journalisation. Chaque système de stockage gère le modèle de requête pour lequel il a été conçu.</p>
<table>
<thead>
<tr><th>Type de données</th><th>Où elles se trouvent</th><th>Comment elles sont interrogées</th></tr>
</thead>
<tbody>
<tr><td>ID de tâche, horodatage, métadonnées de session</td><td>Base de données relationnelle</td><td>Recherches exactes, jointures</td></tr>
<tr><td>Journaux d'exécution bruts et flux d'événements</td><td>Système de journalisation</td><td>Recherche en texte intégral, filtres temporels</td></tr>
<tr><td>Règles de scène, traitement des cas, retours d'expérience</td><td>Milvus</td><td>Recherche de similarité vectorielle par signification</td></tr>
</tbody>
</table>
<p>Au fur et à mesure que les tâches s'exécutent et que les scènes s'accumulent, la couche de mémoire à long terme alimente les processus en aval : curation d'échantillons pour affiner le modèle, analyse de données plus larges et transfert de connaissances d'un déploiement à l'autre. La mémoire se transforme en un actif de données qui donne à chaque déploiement futur un point de départ plus élevé.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">Ce que cette architecture change dans le déploiement<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>L'objectivation des tâches, la mémoire hiérarchisée et la boucle de rétroaction transforment la boucle de tâches de RoboBrain en un modèle de déploiement : chaque tâche préserve l'état, chaque exception peut récupérer l'expérience antérieure et chaque exécution peut améliorer la suivante.</p>
<p>Un robot qui patrouille dans un nouveau bâtiment ne doit pas partir de zéro s'il a déjà géré ailleurs des éclairages, des obstacles, des types d'anomalies ou des règles de conduite similaires. C'est ce qui rend l'exécution des tâches des robots plus reproductible d'une scène à l'autre et qui facilite le contrôle des coûts de déploiement à long terme.</p>
<p>Pour les équipes de robotique, la leçon la plus profonde est que la mémoire n'est pas seulement une couche de stockage. Elle fait partie du contrôle de l'exécution. Le système doit savoir ce qu'il fait, ce qui vient de changer, les cas similaires qui se sont produits auparavant et ce qui doit être réécrit pour la prochaine exécution.</p>
<h2 id="Further-Reading" class="common-anchor-header">Autres lectures<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous travaillez sur des problèmes similaires concernant la mémoire des robots, l'exécution des tâches ou la récupération sémantique pour l'IA incarnée, ces ressources sont des étapes utiles :</p>
<ul>
<li>Lisez la <a href="https://milvus.io/docs">documentation Milvus</a> ou essayez le <a href="https://milvus.io/docs/quickstart.md">quickstart Milvus</a> pour voir comment la recherche vectorielle fonctionne en pratique.</li>
<li>Consultez l'<a href="https://milvus.io/docs/architecture_overview.md">aperçu de l'architecture Milvus</a> si vous prévoyez une couche mémoire de production.</li>
<li>Parcourez les <a href="https://zilliz.com/vector-database-use-cases">cas d'utilisation de la base de données vectorielle</a> pour plus d'exemples de recherche sémantique dans les systèmes de production.</li>
<li>Rejoignez la <a href="https://milvus.io/community">communauté Milvus</a> pour poser des questions et partager ce que vous construisez.</li>
<li>Si vous souhaitez gérer Milvus au lieu d'exploiter votre propre infrastructure, renseignez-vous sur <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>
