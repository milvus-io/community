---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 &amp; 2.2.11 : Mises à jour mineures pour améliorer la stabilité
  du système et l'expérience de l'utilisateur
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: >-
  introduire les nouvelles fonctionnalités et les améliorations de Milvus 2.2.10
  et 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Salutations, fans de Milvus ! Nous sommes heureux d'annoncer que nous venons de publier Milvus 2.2.10 et 2.2.11, deux mises à jour mineures qui se concentrent principalement sur la correction de bugs et l'amélioration générale des performances. Vous pouvez vous attendre à un système plus stable et à une meilleure expérience utilisateur avec ces deux mises à jour. Jetons un coup d'œil rapide aux nouveautés de ces deux versions.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 a corrigé des blocages occasionnels du système, accéléré le chargement et l'indexation, réduit l'utilisation de la mémoire dans les nœuds de données et apporté de nombreuses autres améliorations. Voici quelques changements notables :</p>
<ul>
<li>Remplacement de l'ancien rédacteur de charge utile CGO par un nouveau rédacteur écrit en Go pur, ce qui réduit l'utilisation de la mémoire dans les nœuds de données.</li>
<li>Ajout de <code translate="no">go-api/v2</code> au fichier <code translate="no">milvus-proto</code> pour éviter toute confusion avec les différentes versions de <code translate="no">milvus-proto</code>.</li>
<li>Mise à jour de Gin de la version 1.9.0 à la version 1.9.1 pour corriger un bogue dans la fonction <code translate="no">Context.FileAttachment</code>.</li>
<li>Ajout du contrôle d'accès basé sur les rôles (RBAC) pour les API FlushAll et Database.</li>
<li>Correction d'un crash aléatoire causé par le SDK AWS S3.</li>
<li>Amélioration des vitesses de chargement et d'indexation.</li>
</ul>
<p>Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#2210">notes de mise à jour de Milvus 2.2.10</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 a résolu divers problèmes afin d'améliorer la stabilité du système. Il a également amélioré ses performances en matière de surveillance, de journalisation, de limitation de débit et d'interception des requêtes inter-clusters. Vous trouverez ci-dessous les points forts de cette mise à jour.</p>
<ul>
<li>Ajout d'un intercepteur au serveur Milvus GRPC pour éviter tout problème de routage entre clusters.</li>
<li>Ajout de codes d'erreur au gestionnaire de morceaux minio pour faciliter le diagnostic et la correction des erreurs.</li>
<li>Utilisation d'un pool de coroutines singleton pour éviter le gaspillage de coroutines et maximiser l'utilisation des ressources.</li>
<li>Réduction de l'utilisation du disque pour RocksMq à un dixième de son niveau original en activant la compression zstd.</li>
<li>Correction d'une panique occasionnelle de QueryNode pendant le chargement.</li>
<li>Correction du problème d'étranglement des requêtes de lecture causé par un double calcul erroné de la longueur de la file d'attente.</li>
<li>Correction de problèmes avec GetObject retournant des valeurs nulles sous MacOS.</li>
<li>Correction d'un crash causé par l'utilisation incorrecte du modificateur noexcept.</li>
</ul>
<p>Pour plus de détails, voir les <a href="https://milvus.io/docs/release_notes.md#2211">notes de mise à jour de Milvus 2.2.11</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Restons en contact !<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez des questions ou des commentaires sur Milvus, n'hésitez pas à nous contacter sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter directement avec nos ingénieurs et la communauté ou vous rendre à nos <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">heures de bureau du mardi</a>!</p>
