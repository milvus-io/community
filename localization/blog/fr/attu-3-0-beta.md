---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta : gestion multi-clusters, agent IA et console Milvus entièrement
  repensée
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  La version bêta d'Attu 3.0 propose une refonte de la console de gestion
  Milvus, avec la gestion multi-clusters, l'état persistant, un agent IA
  intégré, des diagnostics avancés, des métriques en temps réel, le débogage via
  API, la sauvegarde et la restauration, ainsi que des workflows RBAC
  simplifiés.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta est désormais disponible.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> est la console de gestion open source pour <a href="https://milvus.io"><strong>Milvus</strong></a>. Si vous avez utilisé Milvus en local ou en production, vous avez probablement utilisé Attu pour inspecter des collections, parcourir des données, gérer des schémas ou vérifier ce qui se passe au sein d'un cluster.</p>
<p>Attu 2.x fonctionnait bien pour la gestion de base d'un seul cluster. Mais à mesure que les déploiements de Milvus se sont développés, ses limites sont devenues plus évidentes. Il ne pouvait se connecter qu'à une seule instance de Milvus à la fois. L'état de la connexion était perdu après le redémarrage d'un conteneur. La navigation dans les données était principalement centrée sur les collections. Le diagnostic, la surveillance, le débogage des API, la sauvegarde et la restauration, ainsi que la gestion des autorisations nécessitaient souvent des outils distincts ou des étapes manuelles.</p>
<p><strong>Attu 3.0 Beta est une refonte complète de l'expérience de gestion de Milvus.</strong></p>
<p>Cette version ajoute la gestion multi-clusters, un état local persistant, un agent IA intégré avec plus de 50 outils Milvus, des capacités de diagnostic avancées, un navigateur de données repensé, des métriques Prometheus intégrées, un API Playground, la sauvegarde et la restauration via une interface graphique, ainsi que des workflows RBAC simplifiés.</p>
<p>En bref, Attu n'est plus seulement une visionneuse légère pour une instance Milvus. Elle devient une console d'exploitation pratique pour les développeurs et les équipes gérant Milvus dans des environnements locaux, de préproduction et de production.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Ce qui a changé dans Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici une comparaison générale entre Attu 2.x et Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Fonctionnalité</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Connexions au cluster</td><td>Une seule instance</td><td>Plusieurs clusters avec basculement en un clic</td></tr>
<tr><td>Persistance d'état</td><td>Sans état ; perdu lors du redémarrage du conteneur</td><td>Base de données locale ; survit aux redémarrages</td></tr>
<tr><td>Assistance IA</td><td>Aucune</td><td>Agent intégré avec plus de 50 outils Milvus</td></tr>
<tr><td>Diagnostics</td><td>Analyse manuelle</td><td>4 compétences de diagnostic de niveau expert intégrées</td></tr>
<tr><td>Gestion RBAC</td><td>Pages distinctes, flux en plusieurs étapes</td><td>Création d'utilisateurs en contexte, en un clic</td></tr>
<tr><td>Navigation dans les données</td><td>Liste de collections plate</td><td>Arborescence hiérarchique : base de données → collection → partition</td></tr>
<tr><td>Surveillance</td><td>Grafana externe requis</td><td>Tableau de bord des métriques Prometheus intégré</td></tr>
<tr><td>Débogage API</td><td>Outils externes tels que curl ou Postman</td><td>Playground API REST intégré</td></tr>
<tr><td>Sauvegarde et restauration</td><td>CLI uniquement</td><td>Interface graphique avec prise en charge de S3, MinIO, GCS et Azure</td></tr>
<tr><td>Intégration LLM</td><td>Aucune</td><td>BYOL : OpenAI, Anthropic, DeepSeek, Gemini et plus encore</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Gérez plusieurs clusters Milvus à partir d'une seule barre latérale<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Le changement le plus important au quotidien est la gestion multi-clusters.</strong> Attu 3.0 peut se connecter à toutes les instances Milvus que vous exécutez et les répertorier dans une seule barre latérale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : Barre latérale d'Attu 3.0 affichant plusieurs connexions Milvus avec des indicateurs d'état</p>
<p>Dans Attu 2.x, passer d'un cluster Milvus à un autre impliquait de se déconnecter, de se reconnecter et d'attendre. Si vous disposiez de clusters distincts pour le développement, la préproduction, la production ou différents secteurs d'activité, vous vous retrouviez souvent avec un onglet de navigateur par cluster.</p>
<p>Attu 3.0 remplace ce processus par une barre latérale gauche permanente. Chaque connexion Milvus est répertoriée au même endroit, avec un indicateur d'état en temps réel à côté. Un point vert signifie que le cluster est accessible. Un point rouge signifie que le cluster est hors service ou indisponible.</p>
<p>Changer de cluster ne nécessite qu'un clic. Attu conserve le contexte de chaque connexion, vous n'avez donc pas besoin de vous reconnecter à chaque fois que vous passez d'un environnement à l'autre.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">La configuration des connexions est moins fragile</h3><p>Les nouvelles connexions prennent en charge le chiffrement TLS/SSL, l'authentification par jeton et l'authentification par nom d'utilisateur/mot de passe. Vous pouvez tester une connexion avant de l'enregistrer, conserver les détails de connexion localement et effacer en masse les connexions inactives lorsque les anciens environnements ne sont plus nécessaires.</p>
<p><strong>Chaque cluster dispose de son propre espace de travail.</strong> La vue d'ensemble, le navigateur de données, la gestion des utilisateurs, les métriques et les opérations sont tous limités au cluster actuellement sélectionné. Cela rend beaucoup plus difficile de confondre les environnements de préproduction et de production ou d'exécuter une opération au mauvais endroit.</p>
<p>Pour toute personne gérant plusieurs instances Milvus, il s'agit de l'un des changements les plus importants d'Attu 3.0. Cela peut sembler basique, mais cela élimine une grande partie des changements d'onglets et des difficultés de reconnexion du travail quotidien avec Milvus.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">L'état local est désormais conservé après un redémarrage<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x était sans état. Si le conteneur redémarrait, vos informations de connexion enregistrées disparaissaient et vous deviez reconstruire votre espace de travail.</p>
<p><strong>Attu 3.0 ajoute une base de données locale qui conserve les configurations de cluster, l'historique des conversations de l'agent, les compétences personnalisées, la configuration du LLM et les préférences de l'utilisateur.</strong></p>
<p>Lorsque vous exécutez Attu avec Docker, montez un volume pour conserver cet état :</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Une fois le volume monté, le redémarrage du conteneur ne signifie plus repartir de zéro.</p>
<p>Cela est également important pour le nouvel agent IA. L'historique des conversations, les compétences personnalisées et la configuration du LLM peuvent être conservés localement, ce qui fait d'Attu une console que vous pouvez continuer à utiliser au fil du temps plutôt qu'une interface utilisateur temporaire qui se réinitialise après chaque redémarrage.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Utilisez l'agent IA intégré pour exploiter Milvus en langage naturel<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 inclut un agent IA intégré pour la gestion de Milvus. Il ne s'agit pas d'un chatbot de documentation. <strong>L'agent est connecté à plus de 50 outils Milvus, ce qui lui permet d'inspecter l'état du cluster et d'exécuter des opérations réelles via Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : L'agent IA d'Attu 3.0 peut appeler des outils Milvus à partir de requêtes en langage naturel</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Plus de 50 outils intégrés couvrant les workflows Milvus courants</h3><p>L'agent couvre les opérations quotidiennes, les diagnostics, les autorisations et la gestion des clusters. Vous pouvez poser des questions ou donner des instructions telles que :</p>
<table>
<thead>
<tr><th>Scénario</th><th>Exemples de commandes</th></tr>
</thead>
<tbody>
<tr><td>Opérations quotidiennes</td><td>« Liste toutes mes collections. »<br>« Créez une collection avec des champs id, title et embedding. Utilisez la dimension 768 pour le champ embedding. »<br>« Insérez des données de test dans my_collection. »<br>« Recherchez dans my_collection les 10 enregistrements les plus proches de « intelligence artificielle ».</td></tr>
<tr><td>Opérations et diagnostics</td><td>« Mon cluster est-il en bon état ? »<br>« Pourquoi la recherche est-elle si lente ? »<br>« Quelles collections utilisent le plus de mémoire ? »<br>« Y a-t-il eu des requêtes lentes récemment ? »</td></tr>
<tr><td>Autorisations</td><td>« Créez un utilisateur en lecture seule nommé analyst. »<br>« Accorder tous les privilèges au rôle admin. »<br>« Vérifiez les privilèges dont dispose l'utilisateur zhangsan. »</td></tr>
<tr><td>Gestion du cluster</td><td>« Afficher la version et la configuration actuelles de Milvus. »<br>« Lister l'utilisation des groupes de ressources. »<br>« Compactez my_collection pour moi. »</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Les actions destructrices nécessitent une validation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : les opérations destructrices ou sensibles affichent une boîte de dialogue de confirmation avant leur exécution</p>
<p><strong>L'agent est conçu pour être transparent et contrôlable.</strong> Les opérations non destructrices, telles que la liste des collections ou la lecture des métriques, renvoient directement les résultats.</p>
<p>Les opérations destructrices ou sensibles, telles que la suppression d'une collection, l'effacement de données ou la modification des privilèges, déclenchent une boîte de dialogue de confirmation. La boîte de dialogue répertorie les paramètres exacts et attend l'approbation avant d'exécuter l'opération.</p>
<p>Vous pouvez également voir quels outils l'agent a appelés, combien de jetons il a utilisés et si un appel d'outil a échoué. C'est important pour un agent de gestion de base de données. Les utilisateurs doivent pouvoir comprendre ce que l'agent a fait, et pas seulement voir le résultat final.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Exécuter des compétences de diagnostic expert depuis la console<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>L'agent IA est livré avec quatre compétences de diagnostic intégrées.</strong> Il s'agit de workflows guidés pour des scénarios courants de dépannage Milvus, et non de messages d'invite génériques.</p>
<table>
<thead>
<tr><th>Compétence de diagnostic</th><th>Ce qu'elle vérifie</th></tr>
</thead>
<tbody>
<tr><td>Diagnostic de l'état du cluster</td><td>Version, état des nœuds, état de chaque composant et indicateurs clés.</td></tr>
<tr><td>Diagnostic des performances de recherche</td><td>Intégrité de l'index, fragmentation des segments, équilibre des répliques et indicateurs de performances de recherche associés.</td></tr>
<tr><td>Diagnostic de l'écriture des données</td><td>Insertions lentes, contrôles de données perdues, anomalies de vidage et symptômes liés au chemin d'écriture.</td></tr>
<tr><td>Audit de configuration</td><td>Paramètres risqués ou incorrects susceptibles d'affecter la stabilité, les performances ou le comportement attendu.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : Attu 3.0 intègre des compétences de diagnostic et prend en charge les compétences personnalisées</p>
<p>Vous pouvez également créer des compétences personnalisées en langage naturel. Une compétence peut coder une liste de contrôle pré-lancement, une vérification de la qualité des données pour une collection spécifique ou un flux de diagnostic que votre équipe exécute pour une charge de travail connue.</p>
<p>Une compétence personnalisée est essentiellement une combinaison de connaissances métier et d'une procédure. Une fois enregistrée, l'agent peut la réutiliser au lieu de devoir recourir à une invite ponctuelle à chaque fois.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Apportez votre propre fournisseur de LLM<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu n'intègre ni ne sert de proxy à un service LLM.</strong> Vous configurez votre propre fournisseur et gardez le contrôle du chemin d'accès au modèle.</p>
<p>Les options de fournisseurs prises en charge incluent OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter et des points de terminaison personnalisés compatibles avec OpenAI.</p>
<table>
<thead>
<tr><th>Fournisseur</th><th>Exemples de modèles</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Tout modèle routé</td></tr>
<tr><td>Point de terminaison personnalisé</td><td>Toute API compatible avec OpenAI</td></tr>
</tbody>
</table>
<p>Votre clé API est chiffrée localement et n'est pas téléchargée vers un service géré par Attu. Cette conception est importante pour les équipes qui souhaitent bénéficier d'une assistance IA tout en conservant le contrôle des identifiants, du flux de données et du choix du fournisseur.</p>
<p>En pratique, BYOL permet d'utiliser l'agent dans différents environnements. Une équipe peut utiliser OpenAI. Une autre peut utiliser un modèle Anthropic. Une troisième peut acheminer le trafic via un point de terminaison compatible avec OpenAI. Attu n'impose pas de fournisseur de modèle unique.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Parcourir les données Milvus à l'aide d'une arborescence Base de données → Collection → Partition<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 repense également le navigateur de données. Attu 2.x présentait principalement une liste de collections plate. Cela devient difficile à utiliser dès lors qu’un cluster comporte plusieurs bases de données, des dizaines de collections et des données partitionnées.</p>
<p><strong>Le nouveau navigateur utilise une hiérarchie qui correspond à la manière dont Milvus organise les données : base de données → collection → partition.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : le navigateur de données repensé utilise une navigation hiérarchique pour les bases de données, les collections et les partitions</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Les opérations sur les données sont plus proches de l'endroit où vous naviguez</h3><p>Le navigateur de données conserve les opérations auxquelles les utilisateurs sont déjà habitués et ajoute davantage d'actions directement dans l'interface utilisateur :</p>
<ul>
<li>Glisser-déposer une collection dans une autre base de données.</li>
<li>Lancer une recherche vectorielle en saisissant directement du texte, lorsqu'un modèle d'intégration est configuré.</li>
<li>Inspectez les scores de similarité et affinez les résultats à l'aide de facettes.</li>
<li>Importez et exportez des données au format CSV, JSON et Parquet.</li>
<li>Afficher et modifier visuellement le schéma d'une collection, y compris la prise en charge des champs dynamiques.</li>
<li>Créez, supprimez et examinez les partitions et leurs statistiques.</li>
<li>Gérer l'intégralité du cycle de vie de la collection : créer, charger, publier, copier, renommer, déplacer entre bases de données et supprimer.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : Navigateur de données Attu 3.0 avec recherche vectorielle et inspection des résultats</p>
<p>La plupart de ces actions sont accessibles via des menus contextuels ou des panneaux d'opérations. Pour les tâches courantes liées aux collections, vous n'avez plus besoin de passer de la navigation dans l'interface utilisateur aux opérations en ligne de commande.</p>
<p>Attu 3.0 est également la gamme de produits dans laquelle la prise en charge par l'interface utilisateur des nouvelles fonctionnalités <a href="https://milvus.io/docs/release_notes.md">de Milvus 3.0</a>, telles que les instantanés et les vecteurs pouvant être nuls, continuera d'apparaître à mesure que ces fonctionnalités arriveront à maturité.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Consultez les opérations, les métriques, les requêtes lentes, la topologie et les sauvegardes en un seul endroit<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 intègre davantage d'informations opérationnelles dans la console.</strong> La section Opérations et surveillance comprend une vue d'ensemble du cluster, des métriques en temps réel, l'analyse des requêtes lentes, la topologie, ainsi que la sauvegarde et la restauration.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : page Opérations et surveillance d'Attu 3.0</p>
<p>L'objectif n'est pas de remplacer tous les systèmes d'observabilité déjà utilisés par une équipe de production. Les équipes peuvent toujours utiliser Prometheus, Grafana, les journaux, les alertes et leur pile de surveillance existante. L'objectif est de permettre de répondre aux questions courantes sur Milvus depuis Attu.</p>
<table>
<thead>
<tr><th>Zone</th><th>Ce que vous pouvez faire</th></tr>
</thead>
<tbody>
<tr><td>Aperçu visuel du cluster</td><td>Visualisez d'un seul coup d'œil la version de Milvus, le mode de déploiement, le nombre de nœuds, le nombre de bases de données, le nombre de collections, l'état de charge et les entités de quota.</td></tr>
<tr><td>Métriques en temps réel</td><td>Examinez le QPS, les taux d'insertion/suppression, la latence des requêtes, le taux de réussite du cache et les métriques associées basées sur Prometheus.</td></tr>
<tr><td>Analyse des requêtes lentes</td><td>Examinez les requêtes lentes par type, durée, collection, horodatage, source et contexte de dépannage associé.</td></tr>
<tr><td>Vue de la topologie</td><td>Comprenez la topologie des nœuds et les connexions entre les composants tels que RootCoord, DataCoord, IndexCoord, QueryCoord et Proxy.</td></tr>
<tr><td>Sauvegarde et restauration</td><td>Créez des sauvegardes complètes ou incrémentielles vers S3, MinIO, GCS ou Azure, et téléchargez les métadonnées de sauvegarde au format ZIP ou téléchargez-en une pour effectuer une restauration.</td></tr>
</tbody>
</table>
<p>La sauvegarde et la restauration sont particulièrement importantes car elles transfèrent un workflow qui dépendait auparavant de l'utilisation de l'interface CLI vers l'interface graphique. Cela est utile pour les tests locaux, la validation en environnement de préproduction et les équipes qui souhaitent un chemin de récupération plus visible.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Débogage des API REST Milvus avec l'API Playground intégré<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 ajoute un API Playground REST pour le développement et le débogage des API Milvus.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : API Playground d'Attu 3.0</p>
<p>L'API Playground répertorie les points de terminaison REST de Milvus par catégorie. Sélectionnez une base de données et une collection, et Attu remplit automatiquement le contexte d'exécution. À partir de là, vous pouvez envoyer une requête en un clic et inspecter la réponse en temps réel.</p>
<p>Cela s'avère utile lorsque vous souhaitez tester un appel d'API sans avoir à configurer de commandes curl ou de collection Postman. C'est également utile pour comprendre comment une fonctionnalité Milvus se mappe à l'API REST, car vous pouvez passer directement du contexte de l'interface utilisateur au corps de la requête.</p>
<p>Pour les développeurs d'applications, l'API Playground est un environnement de débogage. Pour les nouveaux utilisateurs de Milvus, c'est un environnement d'apprentissage. Pour les équipes de la plateforme, c'est un moyen rapide de valider les opérations avant de les transformer en scripts ou en code d'application.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Gérer le RBAC à côté de la base de données ou de la collection<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 modifie la façon dont les workflows d'autorisation s'affichent dans l'interface utilisateur.</strong> Au lieu de traiter <a href="https://milvus.io/docs/rbac.md">le RBAC</a> comme une tâche d'administration distincte, il rapproche le contrôle d'accès des onglets de base de données et de collection où les utilisateurs travaillent déjà.</p>
<p>Le modèle sous-jacent reste le RBAC de Milvus : utilisateurs, rôles, <a href="https://milvus.io/docs/grant_privileges.md">privilèges</a>, octrois et révocations. Attu 3.0 simplifie le chemin d'exploitation autour de ce modèle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image : Gestion des utilisateurs et des autorisations en contexte dans Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Création d'utilisateurs en un clic pour les périmètres courants</h3><p>Dans Attu 2.x, l'ouverture d'un accès en lecture seule à une collection impliquait généralement plusieurs étapes : créer l'utilisateur, créer un rôle, configurer les privilèges, attribuer le rôle à l'utilisateur et s'assurer que le périmètre était correct.</p>
<p><strong>Dans Attu 3.0, vous pouvez ouvrir une collection, aller dans l'onglet Utilisateurs, cliquer sur Créer un utilisateur, choisir Lecture seule ou Lecture-écriture, et laisser Attu terminer le processus.</strong> Il crée l'utilisateur, génère un mot de passe sécurisé, crée le rôle correspondant au périmètre et applique l'autorisation.</p>
<p>Le même principe s'applique au niveau de la base de données. Vous pouvez également autoriser un utilisateur existant à accéder à la collection actuelle ou révoquer son accès en un seul clic.</p>
<p>Cela permet de garder la gestion des autorisations au plus près de la ressource à protéger. Vous n’avez pas besoin de passer par plusieurs pages d’administration ni de vous souvenir d’une convention de nommage des rôles simplement pour accorder un accès limité à un collègue.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Ce que cette version bêta signifie pour les utilisateurs d'Attu<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta est la plus importante mise à jour de la console de gestion Milvus depuis le lancement d'Attu.</strong> Il ne s'agit pas seulement d'une refonte visuelle. Elle modifie l'étendue des capacités d'Attu.</p>
<p>La principale amélioration réside dans le fait qu’Attu s’adapte désormais à la manière dont de nombreux utilisateurs de Milvus travaillent réellement : clusters multiples, paramètres locaux persistants, davantage de mouvements de données, davantage de contrôle d’accès, davantage de dépannage et un besoin accru de comprendre le comportement des clusters sans avoir à passer d’un outil à l’autre.</p>
<p>Les points forts sont les suivants :</p>
<ul>
<li>Gestion multi-clusters avec indicateurs de santé et basculement en un clic.</li>
<li>État local persistant pour les configurations de cluster, les préférences, la configuration LLM, l'historique des agents et les compétences personnalisées.</li>
<li>Un agent IA intégré avec plus de 50 outils Milvus et des portes de confirmation pour les actions destructrices.</li>
<li>Quatre compétences de diagnostic expertes intégrées pour l'état de santé des clusters, les performances de recherche, les écritures de données et la révision de la configuration.</li>
<li>Un navigateur de données repensé avec une navigation base de données → collection → partition et des opérations de collection plus riches.</li>
<li>Métriques Prometheus intégrées, analyse des requêtes lentes, topologie, ainsi que sauvegarde et restauration.</li>
<li>Un environnement de test API REST pour le débogage et l'apprentissage des API Milvus.</li>
<li>Des workflows RBAC qui s'exécutent à côté de la base de données ou de la collection, et non plus uniquement dans un flux d'administration séparé.</li>
</ul>
<p>Si vous utilisez Attu uniquement pour le développement Milvus local, la version 3.0 vous offre une console plus performante. Si vous gérez plusieurs environnements Milvus, les changements apportés au multi-cluster et à l'état persistant valent à eux seuls le détour. Si vous déboguez souvent des problèmes de performances ou d'autorisations, l'Agent, les diagnostics, les métriques et les workflows RBAC contextuels devraient vous faire gagner du temps immédiatement.</p>
<h2 id="Get-Started" class="common-anchor-header">Pour commencer<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Essayez Attu 3.0 Beta avec Docker :</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Puis ouvrez :</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ajoutez votre connexion Milvus depuis la barre latérale et commencez à explorer la nouvelle console.</p>
<p>Vous préférez une application de bureau ? Téléchargez la version adaptée à votre plateforme depuis <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>. Attu 3.0 Beta propose des packages de bureau pour macOS, Linux et Windows. Les versions récentes incluent également un package serveur Linux autonome permettant d'exécuter Attu sans Docker ni Electron.</p>
<p><strong>Vous avez des questions ?</strong> Partagez votre configuration multi-clusters, vos compétences en matière d'agents personnalisés ou vos scénarios de diagnostic sur le <a href="https://discord.gg/milvus"><strong>Discord Milvus</strong></a>, ou réservez <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>des heures de bureau Milvus</strong></a> pour y travailler avec la communauté.</p>
<p><strong>Vous ne souhaitez pas gérer vous-même l'infrastructure Milvus ?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> est la plateforme entièrement gérée par les créateurs de Milvus. Elle conserve l'API Milvus et ajoute une infrastructure gérée pour la recherche vectorielle en temps réel, la découverte à grande échelle et les opérations de données IA. Pour les équipes ayant des exigences en matière de souveraineté des données, Zilliz Cloud <strong>BYOC</strong> s'exécute au sein de votre propre compte cloud, de sorte que les données restent dans votre VPC tandis que Zilliz gère les opérations.</p>
