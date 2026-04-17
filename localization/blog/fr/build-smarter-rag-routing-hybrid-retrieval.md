---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Au-delà du RAG naïf : construire des systèmes plus intelligents avec le
  routage des requêtes et la recherche hybride
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Découvrez comment les systèmes RAG modernes utilisent le routage des requêtes,
  la recherche hybride et l'évaluation étape par étape pour fournir de
  meilleures réponses à moindre coût.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>Votre pipeline <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> récupère des documents pour chaque requête, qu'elle soit nécessaire ou non. Il exécute la même recherche de similarité sur le code, le langage naturel et les rapports financiers. Et lorsque les résultats sont mauvais, vous n'avez aucun moyen de savoir quelle étape est tombée en panne.</p>
<p>Ce sont les symptômes d'un système RAG naïf - un pipeline fixe qui traite toutes les requêtes de la même manière. Les systèmes RAG modernes fonctionnent différemment. Ils acheminent les requêtes vers le bon gestionnaire, combinent plusieurs méthodes de recherche et évaluent chaque étape de manière indépendante.</p>
<p>Cet article présente une architecture à quatre nœuds pour construire des systèmes RAG plus intelligents, explique comment mettre en œuvre la <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">récupération hybride</a> sans maintenir d'index séparés et montre comment évaluer chaque étape du pipeline afin de déboguer les problèmes plus rapidement.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Pourquoi le contexte long ne remplace pas le RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Mettez tout dans le prompt" est une suggestion courante maintenant que les modèles supportent des fenêtres de jetons de 128K+. Elle ne tient pas la route en production pour deux raisons.</p>
<p><strong>Le coût évolue en fonction de la base de connaissances, et non de la requête.</strong> Chaque requête envoie la totalité de la base de connaissances à travers le modèle. Pour un corpus de 100 000 jetons, cela représente 100 000 jetons d'entrée par requête, que la réponse nécessite un paragraphe ou dix. Les coûts mensuels d'inférence augmentent linéairement avec la taille du corpus.</p>
<p><strong>L'attention se dégrade avec la longueur du contexte.</strong> Les modèles peinent à se concentrer sur les informations pertinentes enfouies dans de longs contextes. La recherche sur l'effet "lost in the middle" (Liu et al., 2023) montre que les modèles sont plus susceptibles de manquer des informations placées au milieu de longues entrées. Des fenêtres contextuelles plus grandes n'ont pas résolu ce problème - la qualité de l'attention n'a pas suivi le rythme de la taille de la fenêtre.</p>
<p>RAG évite ces deux problèmes en ne récupérant que les passages pertinents avant la génération. La question n'est pas de savoir si la RAG est nécessaire, mais comment construire une RAG qui fonctionne réellement.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">Qu'est-ce qui ne va pas avec les RAG traditionnels ?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Les RAG traditionnels suivent un pipeline fixe : intégrer la requête, exécuter une <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle de similarité</a>, prendre les K premiers résultats, générer une réponse. Chaque requête suit le même chemin.</p>
<p>Cela crée deux problèmes :</p>
<ol>
<li><p><strong>Le gaspillage de calcul sur des requêtes triviales.</strong> La question "Qu'est-ce que 2 + 2 ?" ne nécessite pas de recherche, mais le système l'exécute quand même, ce qui augmente le temps de latence et les coûts sans aucun avantage.</p></li>
<li><p><strong>Recherche fragile pour les requêtes complexes.</strong> Les formulations ambiguës, les synonymes ou les requêtes en langues mixtes mettent souvent en échec la similarité vectorielle pure. Lorsque la recherche passe à côté de documents pertinents, la qualité de la génération chute sans qu'il y ait de solution de repli.</p></li>
</ol>
<p>La solution : ajouter la prise de décision avant la recherche. Un système RAG moderne décide <em>s'il</em> faut récupérer des documents, <em>ce qu'</em> il faut rechercher et <em>comment</em> le faire, plutôt que d'exécuter aveuglément le même pipeline à chaque fois.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Comment fonctionnent les systèmes RAG modernes : Une architecture à quatre nœuds<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Au lieu d'un pipeline fixe, un système RAG moderne fait passer chaque requête par quatre nœuds de décision. Chaque nœud répond à une question sur la manière de traiter la requête en cours.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Nœud 1 : Acheminement de la requête - Cette requête doit-elle être récupérée ?</h3><p>L'acheminement de la requête est la première décision dans le pipeline. Il classe la requête entrante et l'envoie sur le chemin approprié :</p>
<table>
<thead>
<tr><th>Type de requête</th><th>Exemple d'action</th><th>Action</th></tr>
</thead>
<tbody>
<tr><td>Sens commun / connaissances générales</td><td>"Qu'est-ce que 2 + 2 ?</td><td>Réponse directe avec l'extraction LLM-skip</td></tr>
<tr><td>Question de base de connaissances</td><td>"Quelles sont les spécifications du modèle X ?</td><td>Acheminer vers le pipeline de recherche</td></tr>
<tr><td>Informations en temps réel</td><td>"Météo à Paris ce week-end</td><td>Appeler une API externe</td></tr>
</tbody>
</table>
<p>Le routage en amont permet d'éviter les recherches inutiles pour les requêtes qui n'en ont pas besoin. Dans les systèmes où une grande partie des requêtes sont simples ou de connaissance générale, cette seule mesure peut réduire les coûts de calcul de manière significative.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Nœud 2 : Réécriture des requêtes - Que doit rechercher le système ?</h3><p>Les requêtes des utilisateurs sont souvent vagues. Une question telle que "les principaux chiffres du rapport du troisième trimestre de LightOn" ne se traduit pas bien dans une requête de recherche.</p>
<p>La réécriture des requêtes transforme la question originale en conditions de recherche structurées :</p>
<ul>
<li><strong>Période de temps :</strong> 1er juillet - 30 septembre 2025 (Q3)</li>
<li><strong>Type de document :</strong> Rapport financier</li>
<li><strong>Entité :</strong> LightOn, département des finances</li>
</ul>
<p>Cette étape permet de combler le fossé entre la façon dont les utilisateurs posent des questions et la façon dont les systèmes de recherche indexent les documents. De meilleures requêtes signifient moins de résultats non pertinents.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Nœud 3 : Sélection de la stratégie de recherche - Comment le système doit-il chercher ?</h3><p>Des types de contenu différents nécessitent des stratégies de recherche différentes. Une seule méthode ne peut pas tout couvrir :</p>
<table>
<thead>
<tr><th>Type de contenu</th><th>Meilleure méthode de recherche</th><th>Pourquoi</th></tr>
</thead>
<tbody>
<tr><td>Code (noms de variables, signatures de fonctions)</td><td>Recherche lexicale<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>La recherche par mot-clé exact fonctionne bien sur les mots-clés structurés</td></tr>
<tr><td>Langage naturel (documents, articles)</td><td>Recherche sémantique (vecteurs denses)</td><td>Traite les synonymes, les paraphrases et l'intention</td></tr>
<tr><td>Multimodal (tableaux, diagrammes, dessins)</td><td>Recherche multimodale</td><td>Capture la structure visuelle qui échappe à l'extraction de texte</td></tr>
</tbody>
</table>
<p>Les documents sont étiquetés avec des métadonnées au moment de l'indexation. Au moment de l'interrogation, ces étiquettes guident à la fois les documents à rechercher et la méthode d'extraction à utiliser.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Nœud 4 : Génération d'un contexte minimal - De quelle quantité de contexte le modèle a-t-il besoin ?</h3><p>Après l'extraction et le <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">reclassement</a>, le système n'envoie au modèle que les passages les plus pertinents, et non des documents entiers.</p>
<p>Ce point est plus important qu'il n'y paraît. Par rapport au chargement d'un document complet, le fait de ne transmettre que les passages pertinents peut réduire l'utilisation des jetons de plus de 90 %. Un nombre réduit de jetons signifie des réponses plus rapides et des coûts moindres, même lorsque la mise en cache est en jeu.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">L'importance de la recherche hybride pour le RAG d'entreprise<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>En pratique, la sélection de la stratégie de recherche (nœud 3) est l'étape où la plupart des équipes se retrouvent bloquées. Aucune méthode de recherche ne couvre à elle seule tous les types de documents d'entreprise.</p>
<p>Certains affirment que la recherche par mot-clé est suffisante - après tout, la recherche de code basée sur le grep de Claude Code fonctionne bien. Mais le code est très structuré, avec des conventions de dénomination cohérentes. Il en va tout autrement des documents d'entreprise.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Les documents d'entreprise sont confus</h3><p><strong>Synonymes et formulation variée.</strong> "Optimiser l'utilisation de la mémoire" et "réduire l'empreinte mémoire" signifient la même chose mais utilisent des mots différents. La recherche par mot-clé correspond à l'un mais pas à l'autre. Dans les environnements multilingues - le chinois avec la segmentation des mots, le japonais avec les écritures mixtes, l'allemand avec les mots composés - le problème se multiplie.</p>
<p><strong>La structure visuelle est importante.</strong> Les dessins techniques dépendent de la mise en page. Les rapports financiers s'appuient sur des tableaux. Les images médicales dépendent des relations spatiales. L'OCR extrait le texte mais perd la structure. L'extraction de texte seul ne peut pas traiter ces documents de manière fiable.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Comment mettre en œuvre la recherche hybride</h3><p>La recherche hybride combine plusieurs méthodes de recherche - généralement <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 pour la recherche par mots-clés et les vecteurs denses pour la recherche sémantique - afin de</a>couvrir ce qu'aucune méthode ne peut gérer seule.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'approche traditionnelle utilise deux systèmes distincts : l'un pour le BM25, l'autre pour la recherche vectorielle. Chaque requête est traitée par les deux systèmes et les résultats sont ensuite fusionnés. Cette méthode fonctionne, mais elle s'accompagne d'un réel surcoût :</p>
<table>
<thead>
<tr><th></th><th>Traditionnelle (systèmes séparés)</th><th>Unifié (collection unique)</th></tr>
</thead>
<tbody>
<tr><td>Stockage</td><td>Deux index distincts</td><td>Une collection, les deux types de vecteurs</td></tr>
<tr><td>Synchronisation des données</td><td>Les deux systèmes doivent rester synchronisés</td><td>Chemin d'écriture unique</td></tr>
<tr><td>Chemin d'accès aux requêtes</td><td>Deux requêtes + fusion des résultats</td><td>Un appel API, fusion automatique</td></tr>
<tr><td>Ajustement</td><td>Ajuster les poids de fusion entre les systèmes</td><td>Modifier les poids denses/éparses en une seule requête</td></tr>
<tr><td>Complexité opérationnelle</td><td>Élevée</td><td>Faible</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 prend en charge les vecteurs denses (pour la recherche sémantique) et les vecteurs épars (pour la recherche par mot-clé de type BM25) dans la même collection. Un seul appel à l'API renvoie des résultats fusionnés, avec un comportement de recherche réglable en modifiant le poids entre les types de vecteurs. Pas d'index séparés, pas de problèmes de synchronisation, pas de latence de fusion.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Comment évaluer un pipeline RAG étape par étape<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Vérifier uniquement la réponse finale n'est pas suffisant. RAG est un pipeline à plusieurs étapes, et un échec à n'importe quelle étape se propage en aval. Si vous ne mesurez que la qualité des réponses, vous ne pouvez pas savoir si le problème se situe au niveau du routage, de la réécriture, de l'extraction, du reclassement ou de la génération.</p>
<p>Lorsque les utilisateurs signalent des "résultats inexacts", la cause première peut se situer n'importe où : le routage peut sauter la recherche alors qu'il ne le devrait pas ; la réécriture de la requête peut laisser de côté des entités clés ; la recherche peut manquer des documents pertinents ; le reclassement peut enterrer de bons résultats ; ou le modèle peut ignorer complètement le contexte de la recherche.</p>
<p>Évaluez chaque étape avec ses propres mesures :</p>
<table>
<thead>
<tr><th>Étape</th><th>Métrique</th><th>Ce qu'il attrape</th></tr>
</thead>
<tbody>
<tr><td>Routage</td><td>Score F1</td><td>Taux élevé de faux négatifs = les requêtes nécessitant une recherche sont ignorées</td></tr>
<tr><td>Réécriture de requêtes</td><td>Précision de l'extraction des entités, couverture des synonymes</td><td>La requête réécrite supprime des termes importants ou modifie l'intention.</td></tr>
<tr><td>Récupération</td><td>Recall@K, NDCG@10</td><td>Les documents pertinents ne sont pas retrouvés ou sont classés trop bas.</td></tr>
<tr><td>Reclassement</td><td>Précision@3</td><td>Les premiers résultats ne sont pas réellement pertinents</td></tr>
<tr><td>Génération</td><td>Fidélité, exhaustivité des réponses</td><td>Le modèle ignore le contexte récupéré ou donne des réponses partielles.</td></tr>
</tbody>
</table>
<p><strong>Mettez en place une surveillance en couches.</strong> Utilisez des ensembles de tests hors ligne pour définir des fourchettes de mesures de référence pour chaque étape. En production, déclenchez des alertes lorsqu'une étape tombe en dessous de sa ligne de base. Cela vous permet de détecter rapidement les régressions et de les relier à une étape spécifique - au lieu de deviner.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">Ce qu'il faut construire en premier<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Trois priorités ressortent des déploiements réels de RAG :</p>
<ol>
<li><p><strong>Ajouter le routage au plus tôt.</strong> De nombreuses requêtes n'ont pas besoin d'être récupérées. Les filtrer en amont permet de réduire la charge et d'améliorer le temps de réponse avec un minimum d'effort d'ingénierie.</p></li>
<li><p><strong>Utiliser une recherche hybride unifiée.</strong> La maintenance de systèmes de recherche BM25 et vectorielle distincts double les coûts de stockage, crée une complexité de synchronisation et ajoute une latence de fusion. Un système unifié tel que Milvus 2.6, dans lequel les vecteurs denses et épars se trouvent dans la même collection, élimine ces problèmes.</p></li>
<li><p><strong>Évaluer chaque étape indépendamment.</strong> La qualité des réponses de bout en bout ne constitue pas à elle seule un signal utile. Les mesures par étape (F1 pour le routage, Recall@K et NDCG pour la recherche) vous permettent de déboguer plus rapidement et d'éviter de casser une étape tout en en réglant une autre.</p></li>
</ol>
<p>La valeur réelle d'un système RAG moderne n'est pas seulement la recherche - il s'agit de savoir <em>quand</em> et <em>comment</em> rechercher. Commencez par le routage et la recherche hybride unifiée, et vous aurez une base évolutive.</p>
<hr>
<p>Si vous construisez ou mettez à niveau un système RAG et que vous rencontrez des problèmes de qualité d'extraction, nous serions ravis de vous aider :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> pour poser des questions, partager votre architecture et apprendre des autres développeurs qui travaillent sur des problèmes similaires.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session Milvus Office Hours gratuite de 20 minutes</a> pour étudier votre cas d'utilisation, qu'il s'agisse de la conception du routage, de la configuration de la recherche hybride ou de l'évaluation en plusieurs étapes.</li>
<li>Si vous préférez ignorer la configuration de l'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour commencer.</li>
</ul>
<hr>
<p>Voici quelques questions qui reviennent souvent lorsque les équipes commencent à construire des systèmes RAG plus intelligents :</p>
<p><strong>Q : RAG est-il toujours nécessaire maintenant que les modèles prennent en charge des fenêtres contextuelles de plus de 128 Ko ?</strong></p>
<p>Oui. Les longues fenêtres contextuelles sont utiles lorsque vous devez traiter un seul document volumineux, mais elles ne remplacent pas la recherche pour les requêtes de la base de connaissances. L'envoi de l'ensemble du corpus à chaque requête fait augmenter les coûts de façon linéaire, et les modèles perdent de vue les informations pertinentes dans les longs contextes - un problème bien documenté connu sous le nom d'effet "lost in the middle" (Liu et al., 2023). RAG ne récupère que ce qui est pertinent, ce qui rend les coûts et la latence prévisibles.</p>
<p><strong>Q : Comment combiner BM25 et la recherche vectorielle sans utiliser deux systèmes distincts ?</strong></p>
<p>Utilisez une base de données vectorielle qui prend en charge les vecteurs denses et épars dans la même collection. Milvus 2.6 stocke les deux types de vecteurs par document et renvoie des résultats fusionnés à partir d'une seule requête. Vous réglez l'équilibre entre la correspondance par mot-clé et la correspondance sémantique en modifiant un paramètre de poids - pas d'index séparés, pas de fusion des résultats, pas de problèmes de synchronisation.</p>
<p><strong>Q : Quelle est la première chose que je devrais ajouter pour améliorer mon pipeline RAG existant ?</strong></p>
<p>Le routage des requêtes. C'est l'amélioration qui a le plus d'impact et qui demande le moins d'efforts. La plupart des systèmes de production voient une part importante de requêtes qui n'ont pas du tout besoin d'être récupérées - des questions de bon sens, des calculs simples, des connaissances générales. L'acheminement de ces requêtes directement vers le LLM réduit les appels de recherche inutiles et améliore immédiatement le temps de réponse.</p>
<p><strong>Q : Comment puis-je déterminer quelle étape de mon pipeline RAG est à l'origine des mauvais résultats ?</strong></p>
<p>Évaluez chaque étape indépendamment. Utilisez le score F1 pour la précision du routage, Recall@K et NDCG@10 pour la qualité de la recherche, Precision@3 pour le reclassement et les mesures de fidélité pour la génération. Définissez des lignes de base à partir de données de test hors ligne et surveillez chaque étape en production. Lorsque la qualité des réponses baisse, vous pouvez remonter à l'étape spécifique qui a régressé au lieu de deviner.</p>
