---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Annonce de la disponibilité générale de Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Un moyen simple de traiter des données massives à haute dimension
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Chers membres et amis de la communauté Milvus :</p>
<p>Aujourd'hui, six mois après que la première version candidate (RC) a été rendue publique, nous sommes ravis d'annoncer que Milvus 2.0 est <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">disponible en version générale (GA)</a> et prêt pour la production ! Le chemin a été long et nous remercions tous les contributeurs de la communauté, les utilisateurs et la LF AI &amp; Data Foundation qui nous ont aidés à atteindre cet objectif.</p>
<p>La capacité à traiter des milliards de données de haute dimension est un enjeu majeur pour les systèmes d'IA de nos jours, et ce pour de bonnes raisons :</p>
<ol>
<li>Les données non structurées occupent des volumes dominants par rapport aux données structurées traditionnelles.</li>
<li>La fraîcheur des données n'a jamais été aussi importante. Les scientifiques des données sont avides de solutions de données opportunes plutôt que du compromis traditionnel T+1.</li>
<li>Les coûts et les performances sont devenus encore plus critiques, et pourtant il existe toujours un écart important entre les solutions actuelles et les cas d'utilisation réels. D'où Milvus 2.0. Milvus est une base de données qui permet de traiter des données de haute dimension à grande échelle. Elle est conçue pour le cloud et peut fonctionner partout. Si vous avez suivi nos versions RC, vous savez que nous avons consacré beaucoup d'efforts à rendre Milvus plus stable et plus facile à déployer et à maintenir.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA offre désormais<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Suppression d'entités</strong></p>
<p>En tant que base de données, Milvus supporte maintenant la <a href="https://milvus.io/docs/v2.0.x/delete_data.md">suppression d'entités par clé primaire</a> et supportera plus tard la suppression d'entités par expression.</p>
<p><strong>Équilibre de charge automatique</strong></p>
<p>Milvus prend désormais en charge la politique d'équilibrage de charge plugin pour équilibrer la charge de chaque nœud de requête et de chaque nœud de données. Grâce à la désagrégation du calcul et du stockage, l'équilibrage sera effectué en quelques minutes seulement.</p>
<p><strong>Transfert</strong></p>
<p>Une fois que les segments croissants sont scellés par le flush, les tâches de handoff remplacent les segments croissants par des segments historiques indexés afin d'améliorer les performances de recherche.</p>
<p><strong>Compactage des données</strong></p>
<p>Le compactage des données est une tâche d'arrière-plan qui permet de fusionner les petits segments en grands segments et de nettoyer les données logiques supprimées.</p>
<p><strong>Prise en charge de etcd intégré et du stockage local des données</strong></p>
<p>En mode autonome Milvus, nous pouvons supprimer la dépendance etcd/MinIO avec seulement quelques configurations. Le stockage local des données peut également être utilisé comme cache local pour éviter de charger toutes les données dans la mémoire principale.</p>
<p><strong>SDKs multi-langues</strong></p>
<p>En plus de <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, les SDK <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> et <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> sont maintenant prêts à l'emploi.</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> fournit une solution facile pour déployer et gérer une pile de services Milvus complète, y compris les composants Milvus et ses dépendances pertinentes (par exemple, etcd, Pulsar et MinIO), vers les clusters <a href="https://kubernetes.io/">Kubernetes</a> cibles d'une manière évolutive et hautement disponible.</p>
<p><strong>Outils qui aident à gérer Milvus</strong></p>
<p>Nous devons remercier <a href="https://zilliz.com/">Zilliz</a> pour la fantastique contribution des outils de gestion. Nous avons maintenant <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, qui nous permet d'interagir avec Milvus via une interface graphique intuitive, et <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, un outil de ligne de commande pour gérer Milvus.</p>
<p>Grâce aux 212 contributeurs, la communauté a terminé 6718 commits au cours des 6 derniers mois, et des tonnes de problèmes de stabilité et de performance ont été résolus. Nous publierons notre rapport sur la stabilité et les performances peu après la sortie de la version 2.0 GA.</p>
<h2 id="Whats-next" class="common-anchor-header">Quelles sont les prochaines étapes ?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Fonctionnalité</strong></p>
<p>La prise en charge des types de chaînes sera la prochaine fonctionnalité phare de Milvus 2.1. Nous introduirons également un mécanisme de temps de vie (TTL) et une gestion ACL de base afin de mieux répondre aux besoins des utilisateurs.</p>
<p><strong>Disponibilité</strong></p>
<p>Nous travaillons à la refonte du mécanisme de planification de la coordination des requêtes afin de prendre en charge plusieurs répliques de mémoire pour chaque segment. Avec plusieurs répliques actives, Milvus peut prendre en charge un basculement plus rapide et une exécution spéculative afin de réduire le temps d'arrêt à quelques secondes.</p>
<p><strong>Performances</strong></p>
<p>Les résultats des tests de performance seront bientôt disponibles sur nos sites web. Les versions suivantes devraient connaître une amélioration impressionnante des performances. Notre objectif est de réduire de moitié la latence de recherche pour les petits ensembles de données et de doubler le débit du système.</p>
<p><strong>Facilité d'utilisation</strong></p>
<p>Milvus est conçu pour fonctionner partout. Nous prendrons en charge Milvus sur MacOS (M1 et X86) et sur les serveurs ARM dans les prochaines petites versions. Nous proposerons également PyMilvus intégré afin que vous puissiez simplement <code translate="no">pip install</code> Milvus sans configuration complexe de l'environnement.</p>
<p><strong>Gouvernance de la communauté</strong></p>
<p>Nous allons affiner les règles d'adhésion et clarifier les exigences et les responsabilités des rôles des contributeurs. Un programme de mentorat est également en cours de développement ; si vous êtes intéressé par les bases de données cloud-natives, la recherche vectorielle et/ou la gouvernance de la communauté, n'hésitez pas à nous contacter.</p>
<p>Nous sommes très enthousiastes à propos de la dernière version de Milvus GA ! Comme toujours, nous sommes heureux de recevoir vos commentaires. Si vous rencontrez des problèmes, n'hésitez pas à nous contacter sur <a href="https://github.com/milvus-io/milvus">GitHub</a> ou via <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Meilleures salutations,</p>
<p>Xiaofan Luan</p>
<p>Responsable du projet Milvus</p>
<p><br/></p>
<blockquote>
<p><em>Édité par <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
