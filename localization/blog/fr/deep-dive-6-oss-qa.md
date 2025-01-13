---
id: deep-dive-6-oss-qa.md
title: Assurance qualité des logiciels libres - Une étude de cas de Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  L'assurance qualité est un processus qui permet de déterminer si un produit ou
  un service répond à certaines exigences.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>L'assurance qualité (AQ) est un processus systématique visant à déterminer si un produit ou un service répond à certaines exigences. Un système d'AQ est un élément indispensable du processus de R&amp;D car, comme son nom l'indique, il garantit la qualité du produit.</p>
<p>Ce billet présente le cadre d'AQ adopté dans le développement de la base de données vectorielles Milvus, dans le but de fournir une ligne directrice aux développeurs et utilisateurs contributeurs pour qu'ils participent au processus. Il couvrira également les principaux modules de test de Milvus ainsi que les méthodes et outils qui peuvent être utilisés pour améliorer l'efficacité des tests d'assurance qualité.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Introduction générale au système d'assurance qualité Milvus</a></li>
<li><a href="#Test-modules-in-Milvus">Modules de test dans Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Outils et méthodes pour une meilleure efficacité de l'AQ</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Introduction générale au système d'assurance qualité Milvus<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>L'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">architecture du système</a> est essentielle à la réalisation des tests d'assurance qualité. Plus un ingénieur AQ est familiarisé avec le système, plus il a de chances de proposer un plan de test raisonnable et efficace.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de Milvus</span> </span></p>
<p>Milvus 2.0 adopte une <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">architecture en nuage, distribuée et en couches</a>, le SDK étant l'<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">entrée principale pour le</a> flux de <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">données</a> dans Milvus. Les utilisateurs de Milvus exploitent très fréquemment le SDK, d'où la nécessité d'effectuer des tests fonctionnels du côté du SDK. En outre, les tests fonctionnels sur le SDK peuvent aider à détecter les problèmes internes qui peuvent exister dans le système Milvus. Outre les tests fonctionnels, d'autres types de tests seront également effectués sur la base de données vectorielle, notamment des tests unitaires, des tests de déploiement, des tests de fiabilité, des tests de stabilité et des tests de performance.</p>
<p>Une architecture distribuée et native pour l'informatique en nuage présente à la fois des avantages et des inconvénients pour les tests d'assurance qualité. Contrairement aux systèmes déployés et exécutés localement, une instance Milvus déployée et exécutée sur un cluster Kubernetes peut garantir que les tests de logiciels sont effectués dans les mêmes circonstances que le développement de logiciels. Cependant, l'inconvénient est que la complexité de l'architecture distribuée apporte plus d'incertitudes qui peuvent rendre les tests d'assurance qualité du système encore plus difficiles et ardus. Par exemple, Milvus 2.0 utilise des microservices de différents composants, ce qui entraîne une augmentation du nombre de <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">services et de nœuds</a>, ainsi qu'une plus grande possibilité d'erreur du système. Par conséquent, un plan d'assurance qualité plus sophistiqué et plus complet est nécessaire pour améliorer l'efficacité des tests.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">Tests AQ et gestion des problèmes</h3><p>L'AQ dans Milvus implique à la fois la réalisation de tests et la gestion des problèmes apparus au cours du développement du logiciel.</p>
<h4 id="QA-testings" class="common-anchor-header">Tests d'AQ</h4><p>Milvus effectue différents types de tests AQ en fonction des fonctionnalités de Milvus et des besoins des utilisateurs, par ordre de priorité, comme le montre l'image ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Priorité des tests AQ</span> </span></p>
<p>Les tests d'assurance qualité sont menés sur les aspects suivants dans Milvus, selon l'ordre de priorité suivant :</p>
<ol>
<li><strong>Fonction</strong>: Vérifier si les fonctions et les caractéristiques fonctionnent comme elles ont été conçues à l'origine.</li>
<li><strong>Déploiement</strong>: Vérifier si un utilisateur peut déployer, réinstaller et mettre à niveau la version autonome de Mivus et le cluster Milvus avec différentes méthodes (Docker Compose, Helm, APT ou YUM, etc.).</li>
<li><strong>Performance</strong>:  Tester les performances de l'insertion de données, de l'indexation, de la recherche vectorielle et de la requête dans Milvus.</li>
<li><strong>Stabilité</strong>: Vérifier si Milvus peut fonctionner de manière stable pendant 5 à 10 jours avec une charge de travail normale.</li>
<li><strong>Fiabilité</strong>: Tester si Milvus peut encore fonctionner partiellement en cas d'erreur système.</li>
<li><strong>Configuration</strong>: Vérifier si Milvus fonctionne comme prévu dans une certaine configuration.</li>
<li><strong>Compatibilité</strong>: Tester si Milvus est compatible avec différents types de matériel ou de logiciel.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Gestion des problèmes</h4><p>De nombreux problèmes peuvent apparaître au cours du développement d'un logiciel. Les auteurs de ces problèmes peuvent être des ingénieurs AQ ou des utilisateurs de Milvus issus de la communauté des logiciels libres. L'équipe d'assurance qualité est chargée de résoudre les problèmes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Flux de travail de la gestion des problèmes</span> </span></p>
<p>Lorsqu'un <a href="https://github.com/milvus-io/milvus/issues">problème</a> est créé, il passe d'abord par le triage. Lors du triage, les nouveaux problèmes sont examinés afin de s'assurer qu'ils sont suffisamment détaillés. Si le problème est confirmé, il sera accepté par les développeurs qui tenteront de le résoudre. Une fois le développement terminé, l'auteur du problème doit vérifier si le problème est résolu. Si c'est le cas, le problème sera finalement clôturé.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">Quand l'AQ est-elle nécessaire ?</h3><p>Une idée fausse très répandue est que l'AQ et le développement sont indépendants l'un de l'autre. En réalité, pour garantir la qualité du système, des efforts sont nécessaires de la part des développeurs et des ingénieurs chargés de l'assurance qualité. C'est pourquoi l'assurance qualité doit être impliquée tout au long du cycle de vie.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>Cycle de vie de l'AQ</span> </span></p>
<p>Comme le montre la figure ci-dessus, le cycle de vie complet de la R&amp;D d'un logiciel comprend trois étapes.</p>
<p>Au cours de la phase initiale, les développeurs publient la documentation relative à la conception, tandis que les ingénieurs AQ élaborent des plans de test, définissent les critères de diffusion et assignent les tâches d'AQ. Les développeurs et les ingénieurs chargés de l'assurance qualité doivent connaître à la fois la documentation de conception et le plan de test afin que les deux équipes aient une compréhension mutuelle de l'objectif de la version (en termes de fonctionnalités, de performances, de stabilité, de convergence des bogues, etc.</p>
<p>Pendant la R&amp;D, les équipes de développement et d'assurance qualité interagissent fréquemment pour développer et vérifier les caractéristiques et les fonctions, et pour corriger les bogues et les problèmes signalés par la <a href="https://slack.milvus.io/">communauté des</a> logiciels libres.</p>
<p>Au cours de l'étape finale, si les critères de publication sont remplis, une nouvelle image Docker de la nouvelle version de Milvus sera publiée. Une note de publication mettant l'accent sur les nouvelles fonctionnalités et les bogues corrigés ainsi qu'une étiquette de publication sont nécessaires pour la publication officielle. Ensuite, l'équipe d'assurance qualité publiera également un rapport de test sur cette version.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Modules de test dans Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Il existe plusieurs modules de test dans Milvus et cette section explique chaque module en détail.</p>
<h3 id="Unit-test" class="common-anchor-header">Test d'unité</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Test d'unité</span> </span></p>
<p>Les tests unitaires peuvent aider à identifier les bogues logiciels à un stade précoce et fournir un critère de vérification pour la restructuration du code. Selon les critères d'acceptation des pull requests (PR) de Milvus, la <a href="https://app.codecov.io/gh/milvus-io/milvus/">couverture des</a> tests unitaires du code doit être de 80 %.</p>
<h3 id="Function-test" class="common-anchor-header">Test de fonction</h3><p>Les tests de fonction dans Milvus sont principalement organisés autour de <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> et des SDK. L'objectif principal des tests de fonction est de vérifier si les interfaces peuvent fonctionner comme prévu. Les tests de fonction ont deux facettes :</p>
<ul>
<li>Tester si les SDK peuvent renvoyer les résultats attendus lorsque des paramètres corrects sont transmis.</li>
<li>Tester si les SDK peuvent gérer les erreurs et renvoyer des messages d'erreur raisonnables lorsque des paramètres incorrects sont transmis.</li>
</ul>
<p>La figure ci-dessous illustre le cadre actuel des tests de fonctions, qui est basé sur le cadre général <a href="https://pytest.org/">pytest</a>. Ce cadre ajoute une enveloppe à PyMilvus et renforce les tests avec une interface de test automatisée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Test de fonction</span> </span></p>
<p>Considérant qu'une méthode de test partagée est nécessaire et que certaines fonctions doivent être réutilisées, le cadre de test ci-dessus est adopté, plutôt que d'utiliser directement l'interface PyMilvus. Un module "check" est également inclus dans le cadre pour faciliter la vérification des valeurs attendues et réelles.</p>
<p>Pas moins de 2 700 cas de test de fonction sont incorporés dans le répertoire <code translate="no">tests/python_client/testcases</code>, couvrant ainsi la quasi-totalité des interfaces PyMilvus. Ces tests de fonction supervisent strictement la qualité de chaque PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Test de déploiement</h3><p>Milvus existe en deux modes : <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">autonome</a> et en <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">grappe</a>. Et il y a deux façons principales de déployer Milvus : en utilisant Docker Compose ou Helm. Après avoir déployé Milvus, les utilisateurs peuvent également redémarrer ou mettre à niveau le service Milvus. Il existe deux catégories principales de tests de déploiement : le test de redémarrage et le test de mise à niveau.</p>
<p>Le test de redémarrage fait référence au processus de test de la persistance des données, c'est-à-dire à la question de savoir si les données sont toujours disponibles après un redémarrage. Le test de mise à niveau concerne le processus de test de la compatibilité des données afin d'éviter les situations où des formats de données incompatibles sont insérés dans Milvus. Les deux types de tests de déploiement partagent le même flux de travail, comme l'illustre l'image ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Test de déploiement</span> </span></p>
<p>Dans un test de redémarrage, les deux déploiements utilisent la même image Docker. Cependant, dans un test de mise à niveau, le premier déploiement utilise une image Docker d'une version précédente tandis que le second déploiement utilise une image Docker d'une version ultérieure. Les résultats des tests et les données sont enregistrés dans le fichier <code translate="no">Volumes</code> ou dans la <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">revendication de volume persistant</a> (PVC).</p>
<p>Lors de l'exécution du premier test, plusieurs collections sont créées et des opérations différentes sont effectuées sur chacune d'entre elles. Lors de l'exécution du deuxième test, l'objectif principal est de vérifier si les collections créées sont toujours disponibles pour les opérations CRUD et si de nouvelles collections peuvent être créées.</p>
<h3 id="Reliability-test" class="common-anchor-header">Test de fiabilité</h3><p>Les tests de fiabilité des systèmes distribués natifs du cloud adoptent généralement une méthode d'ingénierie du chaos dont l'objectif est de tuer dans l'œuf les erreurs et les défaillances du système. En d'autres termes, dans un test d'ingénierie du chaos, nous créons délibérément des défaillances du système afin d'identifier les problèmes dans les tests de pression et de corriger les défaillances du système avant qu'elles ne commencent vraiment à poser des problèmes. Lors d'un test de chaos à Milvus, nous choisissons <a href="https://chaos-mesh.org/">Chaos Mesh</a> comme outil pour créer un chaos. Il y a plusieurs types de défaillances à créer :</p>
<ul>
<li><strong>Pod kill</strong>: une simulation du scénario où les nœuds sont en panne.</li>
<li><strong>Pod failure</strong>: Tester si l'un des nœuds de travail tombe en panne et si l'ensemble du système peut continuer à fonctionner.</li>
<li><strong>Memory stress</strong>: simulation d'une forte consommation de mémoire et de ressources CPU par les nœuds de travail.</li>
<li><strong>Partition du réseau</strong>: Étant donné que Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">sépare le stockage de l'informatique</a>, le système repose fortement sur la communication entre les différents composants. Une simulation du scénario dans lequel la communication entre les différents pods est partitionnée est nécessaire pour tester l'interdépendance des différents composants de Milvus.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Test de fiabilité</span> </span></p>
<p>La figure ci-dessus illustre le cadre de test de fiabilité de Milvus qui permet d'automatiser les tests de chaos. Le déroulement d'un test de fiabilité est le suivant :</p>
<ol>
<li>Initialiser un cluster Milvus en lisant les configurations de déploiement.</li>
<li>Lorsque le cluster est prêt, exécuter <code translate="no">test_e2e.py</code> pour tester si les fonctionnalités de Milvus sont disponibles.</li>
<li>Exécuter <code translate="no">hello_milvus.py</code> pour tester la persistance des données. Créer une collection nommée "hello_milvus" pour l'insertion de données, la vidange, la construction d'index, la recherche vectorielle et l'interrogation. Cette collection ne sera ni libérée ni abandonnée pendant le test.</li>
<li>Créez un objet de surveillance qui démarrera six threads exécutant les opérations de création, d'insertion, de vidage, d'index, de recherche et d'interrogation.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Faire la première assertion - toutes les opérations sont réussies comme prévu.</li>
<li>Introduire une défaillance du système dans Milvus en utilisant Chaos Mesh pour analyser le fichier yaml qui définit la défaillance. Une défaillance peut consister à tuer le nœud de requête toutes les cinq secondes, par exemple.</li>
<li>Faire la deuxième affirmation lors de l'introduction d'une défaillance du système - Juger si les résultats renvoyés des opérations dans Milvus lors d'une défaillance du système correspondent aux attentes.</li>
<li>Éliminer la défaillance via Chaos Mesh.</li>
<li>Lorsque le service Milvus est rétabli (ce qui signifie que tous les pods sont prêts), faire la troisième affirmation - toutes les opérations sont réussies comme prévu.</li>
<li>Exécuter <code translate="no">test_e2e.py</code> pour tester si les fonctionnalités Milvus sont disponibles. Certaines des opérations effectuées pendant le chaos peuvent être bloquées en raison de la troisième assertion. Et même après l'élimination du chaos, certaines opérations peuvent continuer à être bloquées, ce qui empêche la troisième affirmation d'aboutir comme prévu. Cette étape vise à faciliter la troisième assertion et sert de norme pour vérifier si le service Milvus s'est rétabli.</li>
<li>Exécutez <code translate="no">hello_milvus.py</code>, chargez la collection créée et effectuez des opérations CRUP sur la collection. Ensuite, vérifiez si les données existant avant la défaillance du système sont toujours disponibles après la récupération de la défaillance.</li>
<li>Collectez les journaux.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Test de stabilité et de performance</h3><p>La figure ci-dessous décrit les objectifs, les scénarios de test et les mesures des tests de stabilité et de performance.</p>
<table>
<thead>
<tr><th></th><th>Test de stabilité</th><th>Test de performance</th></tr>
</thead>
<tbody>
<tr><td>Objectifs</td><td>- S'assurer que Milvus peut fonctionner sans problème pendant une période déterminée dans le cadre d'une charge de travail normale. <br> - S'assurer que les ressources sont consommées de manière stable lorsque le service Milvus démarre.</td><td>- Tester les performances de toutes les interfaces Milvus. <br> - Trouver la configuration optimale à l'aide des tests de performance.  <br> - Servir de référence pour les versions futures. <br> - Trouver le goulot d'étranglement qui entrave l'amélioration des performances.</td></tr>
<tr><td>Scénarios</td><td>- Scénario de lecture intensive hors ligne où les données sont à peine mises à jour après leur insertion et où le pourcentage de traitement de chaque type de demande est le suivant : demande de recherche 90 %, demande d'insertion 5 %, autres 5 %. <br> - Scénario en ligne à forte intensité d'écriture où les données sont insérées et recherchées simultanément et où le pourcentage de traitement de chaque type de demande est : demande d'insertion 50 %, demande de recherche 40 %, autres 10 %.</td><td>- Insertion de données <br> - Construction d'un index <br> - Recherche vectorielle</td></tr>
<tr><td>Métriques</td><td>- Utilisation de la mémoire <br> - Consommation de l'unité centrale <br> - Latence IO <br> - Statut des pods Milvus <br> - Temps de réponse du service Milvus <br> etc.</td><td>- Débit de données pendant l'insertion des données <br> - Le temps nécessaire à la construction d'un index <br> - Temps de réponse lors d'une recherche vectorielle <br> - Requête par seconde (QPS) <br> - Requête par seconde  <br> - Taux de rappel <br> etc.</td></tr>
</tbody>
</table>
<p>Le test de stabilité et le test de performance partagent le même ensemble de flux de travail :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Test de stabilité et de performance</span> </span></p>
<ol>
<li>Analyse et mise à jour des configurations, et définition des mesures. Le site <code translate="no">server-configmap</code> correspond à la configuration de Milvus autonome ou en grappe, tandis que le site <code translate="no">client-configmap</code> correspond aux configurations des cas de test.</li>
<li>Configurer le serveur et le client.</li>
<li>Préparation des données</li>
<li>Demande d'interaction entre le serveur et le client.</li>
<li>Rapport et affichage des métriques.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Outils et méthodes pour une meilleure efficacité de l'assurance qualité<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>La section sur les tests de modules montre que la procédure pour la plupart des tests est en fait presque la même, impliquant principalement la modification des configurations du serveur et du client Milvus et le passage de paramètres API. Lorsqu'il existe plusieurs configurations, plus la combinaison des différentes configurations est variée, plus ces expériences et ces tests peuvent couvrir de scénarios de test. Par conséquent, la réutilisation des codes et des procédures est d'autant plus essentielle au processus d'amélioration de l'efficacité des tests.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">Cadre de test SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>Cadre de test SDK</span> </span></p>
<p>Pour accélérer le processus de test, nous pouvons ajouter un wrapper <code translate="no">API_request</code> au cadre de test original et le définir comme quelque chose de similaire à la passerelle API. Cette passerelle API sera chargée de collecter toutes les demandes API et de les transmettre à Milvus pour recevoir collectivement les réponses. Ces réponses seront ensuite renvoyées au client. Une telle conception facilite la capture de certaines informations de journal telles que les paramètres et les résultats renvoyés. En outre, le composant de vérification du cadre de test SDK peut vérifier et examiner les résultats de Milvus. Toutes les méthodes de vérification peuvent être définies dans ce composant de vérification.</p>
<p>Avec le cadre de test SDK, certains processus d'initialisation cruciaux peuvent être regroupés en une seule fonction. Ce faisant, de grandes parties de codes fastidieux peuvent être éliminées.</p>
<p>Il convient également de noter que chaque cas de test individuel est lié à une collection unique afin de garantir l'isolation des données.</p>
<p>Lors de l'exécution des cas de test,<code translate="no">pytest-xdist</code>, l'extension pytest, peut être utilisée pour exécuter tous les cas de test individuels en parallèle, ce qui augmente considérablement l'efficacité.</p>
<h3 id="GitHub-action" class="common-anchor-header">Action GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>Action GitHub</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a> est également adopté pour améliorer l'efficacité de l'assurance qualité en raison de ses caractéristiques suivantes :</p>
<ul>
<li>Il s'agit d'un outil CI/CD natif profondément intégré à GitHub.</li>
<li>Il est livré avec un environnement machine configuré de manière uniforme et des outils de développement de logiciels courants préinstallés, notamment Docker, Docker Compose, etc.</li>
<li>Il prend en charge plusieurs systèmes d'exploitation et versions, notamment Ubuntu, MacOs, Windows-server, etc.</li>
<li>Il dispose d'une place de marché qui offre de riches extensions et des fonctions prêtes à l'emploi.</li>
<li>Sa matrice prend en charge les tâches concurrentes et la réutilisation du même flux de test pour améliorer l'efficacité.</li>
</ul>
<p>Outre les caractéristiques ci-dessus, une autre raison d'adopter GitHub Action est que les tests de déploiement et les tests de fiabilité nécessitent un environnement indépendant et isolé. Et GitHub Action est idéal pour les contrôles quotidiens sur des ensembles de données à petite échelle.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Outils pour les tests de référence</h3><p>Un certain nombre d'outils sont utilisés pour rendre les tests d'assurance qualité plus efficaces.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>Outils d'assurance qualité</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: un ensemble d'outils open-source pour Kubernetes permettant d'exécuter des flux de travail et de gérer des clusters en planifiant des tâches. Il peut également permettre d'exécuter plusieurs tâches en parallèle.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Tableau de bord Kubernetes</a>: interface utilisateur Kubernetes basée sur le web pour visualiser <code translate="no">server-configmap</code> et <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Le stockage en réseau (NAS) est un serveur de stockage de données informatiques au niveau des fichiers pour conserver les ensembles de données de référence ANN courants.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> et <a href="https://www.mongodb.com/">MongoDB</a>: bases de données pour la sauvegarde des résultats des tests de référence.</li>
<li><a href="https://grafana.com/">Grafana</a>: Une solution open-source d'analyse et de surveillance pour surveiller les métriques de ressources du serveur et les métriques de performance du client.</li>
<li><a href="https://redash.io/">Redash</a>: Un service qui aide à visualiser vos données et à créer des graphiques pour les tests de référence.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale</a> de Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
