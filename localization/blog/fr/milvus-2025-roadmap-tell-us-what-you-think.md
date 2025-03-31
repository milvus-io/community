---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Feuille de route Milvus 2025 - Dites-nous ce que vous en pensez
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  En 2025, nous lançons deux versions majeures, Milvus 2.6 et Milvus 3.0, ainsi
  que de nombreuses autres caractéristiques techniques. Nous vous invitons à
  nous faire part de vos réflexions.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Bonjour, utilisateurs et contributeurs de Milvus !</p>
<p>Nous sommes ravis de partager avec vous notre <a href="https://milvus.io/docs/roadmap.md"><strong>feuille de route Milvus 2025</strong></a>. 🚀 Ce plan technique met en évidence les principales fonctionnalités et améliorations que nous développons pour rendre Milvus encore plus performant pour vos besoins de recherche vectorielle.</p>
<p>Mais ce n'est qu'un début : nous voulons connaître votre avis ! Vos commentaires contribuent à façonner Milvus, en veillant à ce qu'il évolue pour répondre aux défis du monde réel. Faites-nous part de vos commentaires et aidez-nous à affiner la feuille de route au fur et à mesure que nous avançons.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">Le paysage actuel<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Au cours de l'année écoulée, nous avons vu nombre d'entre vous créer des applications RAG et d'agents impressionnantes avec Milvus, en exploitant plusieurs de nos fonctionnalités populaires, telles que l'intégration de modèles, la recherche en texte intégral et la recherche hybride. Vos implémentations ont fourni des informations précieuses sur les exigences de la recherche vectorielle dans le monde réel.</p>
<p>Avec l'évolution des technologies de l'IA, vos cas d'utilisation deviennent de plus en plus sophistiqués - de la recherche vectorielle de base aux applications multimodales complexes couvrant les agents intelligents, les systèmes autonomes et l'IA incarnée. Ces défis techniques influencent notre feuille de route alors que nous continuons à développer Milvus pour répondre à vos besoins.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Deux versions majeures en 2025 : Milvus 2.6 et Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, nous lancerons deux versions majeures : Milvus 2.6 (milieu de CY25) et Milvus 3.0 (fin 2025).</p>
<p><strong>Milvus 2.6</strong> se concentre sur les améliorations de l'architecture de base que vous avez demandées :</p>
<ul>
<li><p>Déploiement plus simple avec moins de dépendances (adieu les maux de tête liés au déploiement !)</p></li>
<li><p>Pipelines d'ingestion de données plus rapides</p></li>
<li><p>Réduction des coûts de stockage (nous entendons vos préoccupations en matière de coûts de production)</p></li>
<li><p>Meilleure gestion des opérations de données à grande échelle (supprimer/modifier)</p></li>
<li><p>Recherche scalaire et plein texte plus efficace</p></li>
<li><p>Prise en charge des derniers modèles d'intégration avec lesquels vous travaillez</p></li>
</ul>
<p><strong>Milvus 3.0</strong> est notre plus grande évolution architecturale, introduisant un système de lac de données vectoriel pour :</p>
<ul>
<li><p>l'intégration transparente des services d'IA</p></li>
<li><p>Capacités de recherche de niveau supérieur</p></li>
<li><p>Une gestion des données plus robuste</p></li>
<li><p>Une meilleure gestion des énormes ensembles de données hors ligne avec lesquels vous travaillez.</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Fonctionnalités techniques prévues - Nous avons besoin de vos commentaires<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous trouverez ci-dessous les principales fonctionnalités techniques que nous prévoyons d'ajouter à Milvus.</p>
<table>
<thead>
<tr><th><strong>Domaine de fonctionnalité clé</strong></th><th><strong>Fonctionnalités techniques</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Traitement des données non structurées piloté par l'IA</strong></td><td>- Entrée/sortie de données : Intégration native avec les principaux services de modèles pour l'ingestion de texte brut<br>- Traitement des données originales : Prise en charge des références texte/URL pour le traitement des données brutes<br>- Prise en charge des tenseurs : Mise en œuvre de listes vectorielles (pour les scénarios ColBERT/CoPali/Vidéo)<br>- Types de données étendus : DateTime, Map, GIS en fonction des besoins<br>- Recherche itérative : Affinement du vecteur de requête grâce au retour d'information de l'utilisateur</td></tr>
<tr><td><strong>Amélioration de la qualité et des performances de la recherche</strong></td><td>- Correspondance avancée : capacités de correspondance de phrases et de correspondance multiple<br>- Mise à jour de l'analyseur : amélioration de l'analyseur avec une prise en charge étendue des jetons et une observabilité améliorée.<br>- Optimisation JSON : Filtrage plus rapide grâce à une indexation améliorée<br>- Tri d'exécution : Ordonnancement des résultats basé sur des champs scalaires<br>- Reranker avancé : Reranking basé sur un modèle et fonctions de notation personnalisées<br>- Recherche itérative : Affinement du vecteur de requête grâce au retour d'information de l'utilisateur</td></tr>
<tr><td><strong>Flexibilité de la gestion des données</strong></td><td>- Modification du schéma : Ajout/suppression de champs, modification de la longueur des variables<br>- Agrégations scalaires : opérations count/distinct/min/max<br>- Prise en charge des UDF : Prise en charge des fonctions définies par l'utilisateur<br>- Versionnement des données : Système de retour en arrière basé sur des instantanés<br>- Regroupement des données : Co-location par configuration<br>- Échantillonnage des données : Obtention rapide de résultats basés sur des données d'échantillonnage</td></tr>
<tr><td><strong>Améliorations architecturales</strong></td><td>- Nœud de flux : Ingestion de données incrémentielle simplifiée<br>- MixCoord : Architecture de coordination unifiée<br>- Indépendance du logstore : Réduction des dépendances externes comme le pulsar<br>- Déduplication PK : Déduplication globale des clés primaires</td></tr>
<tr><td><strong>Rentabilité et améliorations de l'architecture</strong></td><td>- Stockage hiérarchisé : Séparation des données chaudes et froides pour réduire les coûts de stockage<br>- Politique d'éviction des données : Les utilisateurs peuvent définir leur propre politique d'éviction des données<br>- Mises à jour en masse : Prise en charge des modifications de valeurs spécifiques aux champs, ETL, etc.<br>- Large TopK : renvoie des ensembles de données volumineux<br>- VTS GA : Connexion à différentes sources de données<br>- Quantification avancée : Optimisation de la consommation de mémoire et des performances sur la base de techniques de quantification<br>- Élasticité des ressources : Évolution dynamique des ressources pour s'adapter aux différentes charges d'écriture, de lecture et de tâches d'arrière-plan.</td></tr>
</tbody>
</table>
<p>Dans le cadre de la mise en œuvre de cette feuille de route, nous vous serions reconnaissants de nous faire part de vos réflexions et de vos commentaires sur les points suivants :</p>
<ol>
<li><p><strong>Priorités des fonctionnalités :</strong> Quelles sont les fonctionnalités de notre feuille de route qui auraient le plus d'impact sur votre travail ?</p></li>
<li><p><strong>Idées de mise en œuvre :</strong> Y a-t-il des approches spécifiques qui, selon vous, fonctionneraient bien pour ces fonctionnalités ?</p></li>
<li><p><strong>Alignement des cas d'utilisation :</strong> Comment les fonctionnalités prévues s'alignent-elles sur vos cas d'utilisation actuels et futurs ?</p></li>
<li><p><strong>Considérations relatives aux performances :</strong> Y a-t-il des aspects de performance sur lesquels nous devrions nous concentrer pour répondre à vos besoins spécifiques ?</p></li>
</ol>
<p><strong>Vos commentaires nous aident à améliorer Milvus pour tout le monde. N'hésitez pas à partager vos idées sur notre<a href="https://github.com/milvus-io/milvus/discussions/40263"> forum de discussion Milvus</a> ou sur notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Bienvenue pour contribuer à Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>En tant que projet open-source, Milvus est toujours ouvert à vos contributions :</p>
<ul>
<li><p><strong>Partagez vos commentaires :</strong> Signalez les problèmes ou suggérez des fonctionnalités via notre <a href="https://github.com/milvus-io/milvus/issues">page de problèmes GitHub</a>.</p></li>
<li><p><strong>Contribuer au code :</strong> Soumettre des demandes de téléchargement (voir notre <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Guide du contributeur</a>)</p></li>
<li><p><strong>Faites passer le message :</strong> partagez vos expériences avec Milvus et <a href="https://github.com/milvus-io/milvus">mettez en avant notre dépôt GitHub.</a></p></li>
</ul>
<p>Nous sommes ravis de construire ce nouveau chapitre de Milvus avec vous. Votre code, vos idées et vos commentaires font avancer ce projet !</p>
<p>- L'équipe Milvus</p>
