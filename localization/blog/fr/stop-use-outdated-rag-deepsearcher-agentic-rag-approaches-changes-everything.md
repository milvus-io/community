---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: >-
  Cessez de construire des RAG vanille : adoptez les RAG agentiques avec
  DeepSearcher
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">Le passage à une recherche alimentée par l'IA grâce aux LLM et à la recherche approfondie<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>L'évolution de la technologie de recherche a progressé de manière spectaculaire au fil des décennies, de la recherche par mot clé dans les années pré-2000 aux expériences de recherche personnalisées dans les années 2010. Nous assistons à l'émergence de solutions basées sur l'IA, capables de traiter des requêtes complexes nécessitant une analyse professionnelle approfondie.</p>
<p>Deep Research d'OpenAI illustre cette évolution, en utilisant des capacités de raisonnement pour synthétiser de grandes quantités d'informations et générer des rapports de recherche en plusieurs étapes. Par exemple, à la question "Quelle est la capitalisation boursière raisonnable de Tesla ?", Deep Research peut analyser en détail les finances de l'entreprise. Deep Research peut analyser en profondeur les finances de l'entreprise, les trajectoires de croissance de l'activité et les estimations de la valeur du marché.</p>
<p>Deep Research met en œuvre une forme avancée du cadre RAG (Retrieval-Augmented Generation). La méthode RAG traditionnelle améliore les résultats des modèles de langage en récupérant et en incorporant des informations externes pertinentes. L'approche de l'OpenAI va plus loin en mettant en œuvre des cycles itératifs de recherche et de raisonnement. Au lieu d'une seule étape de recherche, Deep Research génère dynamiquement plusieurs requêtes, évalue les résultats intermédiaires et affine sa stratégie de recherche, démontrant ainsi que les techniques avancées ou agentiques de RAG peuvent fournir un contenu de haute qualité au niveau de l'entreprise, qui ressemble davantage à une recherche professionnelle qu'à une simple réponse à une question.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher : Une recherche locale en profondeur qui met la RAG agentique à la portée de tous<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Inspirés par ces avancées, des développeurs du monde entier ont créé leurs propres implémentations. Les ingénieurs de Zilliz ont créé le projet <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, qui peut être considéré comme une recherche approfondie locale et ouverte. Ce projet a obtenu plus de 4 900 étoiles GitHub en moins d'un mois.</p>
<p>DeepSearcher redéfinit la recherche d'entreprise alimentée par l'IA en combinant la puissance de modèles de raisonnement avancés, des fonctions de recherche sophistiquées et un assistant de recherche intégré. Intégrant des données locales via <a href="https://milvus.io/docs/overview.md">Milvus</a> (une base de données vectorielle performante et open-source), DeepSearcher fournit des résultats plus rapides et plus pertinents tout en permettant aux utilisateurs d'échanger facilement les modèles de base pour une expérience personnalisée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1 :</em> <em>Historique des étoiles de DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Source</em></a><em>)</em></p>
<p>Dans cet article, nous allons explorer l'évolution de la RAG traditionnelle à la RAG agentique, en examinant ce qui rend ces approches différentes sur le plan technique. Nous discuterons ensuite de la mise en œuvre de DeepSearcher, en montrant comment il exploite les capacités des agents intelligents pour permettre un raisonnement dynamique et multi-tours, et pourquoi cela est important pour les développeurs de solutions de recherche au niveau de l'entreprise.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">Du RAG traditionnel au RAG agentique : la puissance du raisonnement itératif<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>La RAG agentique améliore le cadre traditionnel de la RAG en y intégrant des capacités d'agent intelligent. DeepSearcher est un excellent exemple d'un cadre de RAG agentique. Grâce à la planification dynamique, au raisonnement en plusieurs étapes et à la prise de décision autonome, il établit un processus en boucle fermée qui récupère, traite, valide et optimise les données pour résoudre des problèmes complexes.</p>
<p>La popularité croissante des RAG agentiques est due aux progrès significatifs réalisés dans les capacités de raisonnement des grands modèles de langage (LLM), en particulier leur capacité améliorée à décomposer les problèmes complexes et à maintenir des chaînes de pensée cohérentes à travers de multiples étapes.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Comparaison Dimension</strong></td><td><strong>RAG traditionnel</strong></td><td><strong>RAG agentique</strong></td></tr>
<tr><td>Approche de base</td><td>Passif et réactif</td><td>Proactive, axée sur les agents</td></tr>
<tr><td>Déroulement du processus</td><td>Recherche et génération en une seule étape (processus unique)</td><td>Récupération et génération dynamiques, en plusieurs étapes (raffinement itératif)</td></tr>
<tr><td>Stratégie de recherche</td><td>Recherche par mot clé fixe, en fonction de la requête initiale</td><td>Recherche adaptative (par exemple, affinement des mots-clés, changement de source de données)</td></tr>
<tr><td>Traitement des requêtes complexes</td><td>Génération directe ; risque d'erreurs en cas de données contradictoires</td><td>Décomposition des tâches → recherche ciblée → synthèse des réponses</td></tr>
<tr><td>Capacité d'interaction</td><td>Repose entièrement sur l'apport de l'utilisateur ; pas d'autonomie</td><td>Engagement proactif (par exemple, clarifier les ambiguïtés, demander des détails)</td></tr>
<tr><td>Correction des erreurs et retour d'information</td><td>Pas d'autocorrection ; limité par les résultats initiaux</td><td>Validation itérative → récupération autodéclenchée pour plus de précision</td></tr>
<tr><td>Cas d'utilisation idéaux</td><td>Questions et réponses simples, recherches factuelles</td><td>Raisonnement complexe, résolution de problèmes en plusieurs étapes, tâches ouvertes</td></tr>
<tr><td>Exemple</td><td>L'utilisateur demande : "Qu'est-ce que l'informatique quantique ?" → Le système renvoie une définition du manuel</td><td>L'utilisateur demande : "Comment l'informatique quantique peut-elle optimiser la logistique ?" → Le système récupère les principes quantiques et les algorithmes logistiques, puis synthétise les informations exploitables.</td></tr>
</tbody>
</table>
<p>Contrairement à la RAG traditionnelle, qui repose sur une recherche unique basée sur une requête, la RAG agentique décompose une requête en plusieurs sous-questions et affine sa recherche de manière itérative jusqu'à ce qu'elle aboutisse à une réponse satisfaisante. Cette évolution offre trois avantages principaux :</p>
<ul>
<li><p><strong>Résolution proactive des problèmes :</strong> Le système passe d'une réaction passive à une résolution active des problèmes.</p></li>
<li><p><strong>Recherche dynamique à plusieurs tours :</strong> Au lieu d'effectuer une recherche unique, le système ajuste continuellement ses requêtes et s'auto-corrige sur la base d'un retour d'information permanent.</p></li>
<li><p><strong>Une application plus large :</strong> Il va au-delà de la simple vérification des faits pour traiter des tâches de raisonnement complexes et générer des rapports complets.</p></li>
</ul>
<p>En tirant parti de ces capacités, les applications Agentic RAG telles que DeepSearcher fonctionnent comme un expert humain, en fournissant non seulement la réponse finale, mais aussi une analyse complète et transparente du processus de raisonnement et des détails d'exécution.</p>
<p>À long terme, la RAG agentique devrait dépasser les systèmes de RAG de base. Les approches conventionnelles ont souvent du mal à traiter la logique sous-jacente des requêtes des utilisateurs, qui nécessitent un raisonnement itératif, une réflexion et une optimisation continue.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">À quoi ressemble une architecture de RAG agentique ? L'exemple de DeepSearcher<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons compris la puissance des systèmes RAG agentiques, à quoi ressemble leur architecture ? Prenons l'exemple de DeepSearcher.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2 : Deux modules de DeepSearcher</em></p>
<p>L'architecture de DeepSearcher se compose de deux modules principaux :</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Module d'ingestion de données</h3><p>Ce module connecte diverses sources de données propriétaires tierces via une base de données vectorielle Milvus. Il est particulièrement utile pour les environnements d'entreprise qui s'appuient sur des ensembles de données propriétaires. Le module gère</p>
<ul>
<li><p>l'analyse syntaxique et le découpage des documents</p></li>
<li><p>la génération d'intégration</p></li>
<li><p>Le stockage et l'indexation des vecteurs</p></li>
<li><p>La gestion des métadonnées pour une recherche efficace</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Module de raisonnement et d'interrogation en ligne</h3><p>Ce module met en œuvre diverses stratégies d'agents dans le cadre de RAG afin de fournir des réponses précises et perspicaces. Il fonctionne selon une boucle dynamique et itérative : après chaque recherche de données, le système vérifie si les informations accumulées répondent suffisamment à la requête initiale. Si ce n'est pas le cas, une autre itération est déclenchée ; si c'est le cas, le rapport final est généré.</p>
<p>Ce cycle continu de "suivi" et de "réflexion" représente une amélioration fondamentale par rapport à d'autres approches de base de la GCR. Alors que les RAG traditionnels effectuent un processus de recherche et de génération en une seule fois, l'approche itérative de DeepSearcher reflète la façon dont les chercheurs humains travaillent - en posant des questions initiales, en évaluant les informations reçues, en identifiant les lacunes et en poursuivant de nouvelles lignes d'enquête.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Quelle est l'efficacité de DeepSearcher et quels sont les cas d'utilisation qui lui conviennent le mieux ?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois installé et configuré, DeepSearcher indexe vos fichiers locaux par le biais de la base de données vectorielle Milvus. Lorsque vous soumettez une requête, il effectue une recherche complète et approfondie du contenu indexé. L'un des principaux avantages pour les développeurs est que le système enregistre chaque étape de son processus de recherche et de raisonnement, offrant ainsi une transparence sur la manière dont il est parvenu à ses conclusions - une caractéristique essentielle pour le débogage et l'optimisation des systèmes RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3 : Lecture accélérée d'une itération de DeepSearcher</em></p>
<p>Cette approche consomme plus de ressources informatiques que les systèmes RAG traditionnels, mais donne de meilleurs résultats pour les requêtes complexes. Examinons deux cas d'utilisation spécifiques pour lesquels DeepSearcher est le mieux adapté.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Requêtes de type général</h3><p>Les requêtes de type général, telles que la génération de rapports, la rédaction de documents ou le résumé de tendances, fournissent un bref sujet mais nécessitent un résultat exhaustif et détaillé.</p>
<p>Par exemple, lorsqu'on demande &quot;Comment les Simpsons ont-ils changé au fil du temps ?&quot;, DeepSearcher génère d'abord un ensemble initial de sous-requêtes :</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Il récupère les informations pertinentes, puis procède à des itérations avec retour d'information pour affiner sa recherche, en générant les sous-requêtes suivantes :</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Chaque itération s'appuie sur la précédente, pour aboutir à un rapport complet qui couvre de multiples facettes du sujet, structuré avec des sections telles que :</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Par souci de concision, seuls des extraits du processus et du rapport final sont présentés)</em></p>
<p>Le rapport final fournit une analyse approfondie avec des citations appropriées et une organisation structurée.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Requêtes de raisonnement complexes</h3><p>Les requêtes complexes impliquent plusieurs niveaux de logique et des entités interconnectées.</p>
<p>Prenons l'exemple de la requête suivante : "Quel est le film dont le réalisateur est le plus âgé, Le don de Dieu aux femmes ou Aldri annet enn bråk ?"</p>
<p>Bien que cette question puisse sembler simple pour un être humain, les systèmes RAG simples ont du mal à la traiter car la réponse n'est pas stockée directement dans la base de connaissances. DeepSearcher relève ce défi en décomposant la requête en sous-questions plus petites :</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Il récupère d'abord des informations sur les réalisateurs des deux films,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>puis génère des sous-requêtes :</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Il extrait ensuite leurs dates de naissance et les compare enfin pour déterminer la bonne réponse :</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>À l'inverse, un système RAG conventionnel pourrait manquer des détails clés en raison d'une recherche limitée en un seul passage, ce qui pourrait donner lieu à des réponses <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">hallucinées</a> ou inexactes :</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher se distingue en effectuant des recherches itératives et approfondies sur des données locales importées. Il enregistre chaque étape de son processus de raisonnement et fournit finalement un rapport complet et unifié. Cela le rend particulièrement efficace pour les requêtes de type général - telles que la génération de rapports détaillés ou le résumé de tendances - et pour les requêtes de raisonnement complexes qui nécessitent de décomposer une question en sous-questions plus petites et d'agréger des données par le biais de multiples boucles de rétroaction.</p>
<p>Dans la section suivante, nous comparerons DeepSearcher à d'autres systèmes de RAG, en explorant comment son approche itérative et l'intégration flexible des modèles se comparent aux méthodes traditionnelles.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Comparaison quantitative : DeepSearcher vs. RAG traditionnel<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans le dépôt GitHub de DeepSearcher, nous avons mis à disposition le code pour les tests quantitatifs. Pour cette analyse, nous avons utilisé le populaire ensemble de données 2WikiMultiHopQA. (Remarque : nous n'avons évalué que les 50 premières entrées afin de gérer la consommation de jetons d'API, mais les tendances générales restent claires).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Comparaison du taux de rappel</h3><p>Comme le montre la figure 4, le taux de rappel s'améliore considérablement à mesure que le nombre d'itérations maximales augmente :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 4 : Itérations maximales par rapport au taux de rappel</em></p>
<p>Après un certain temps, les améliorations marginales s'amenuisent. C'est pourquoi nous fixons généralement le nombre d'itérations par défaut à 3, bien que ce nombre puisse être ajusté en fonction des besoins spécifiques.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Analyse de la consommation de jetons</h3><p>Nous avons également mesuré la consommation totale de jetons pour 50 requêtes à travers différents nombres d'itérations :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 5 : Itérations maximales vs. consommation de jetons</em></p>
<p>Les résultats montrent que la consommation de jetons augmente linéairement avec le nombre d'itérations. Par exemple, avec 4 itérations, DeepSearcher consomme environ 0,3 million de jetons. En utilisant une estimation approximative basée sur la tarification gpt-4o-mini d'OpenAI de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1</mi><mn>jeton de sortie</mn><mo separator="true">, ce qui</mo></mrow><annotation encoding="application/x-tex">équivaut</annotation><mrow><mi>à un coût moyen</mi><mi>d</mi><mi>'environ 0</mi></mrow><annotation encoding="application/x-tex">,60/1M jeton de sortie, cela équivaut à un coût moyen d'environ</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1</span><span class="mord">jeton de sortie</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">ce qui équivaut à un coût</span><span class="mord mathnormal">moyen</span><span class="mord mathnormal">d'environ 0</span></span></span></span>,0036 par requête (ou environ 0,18 $ pour 50 requêtes).</p>
<p>Pour les modèles d'inférence plus gourmands en ressources, les coûts seraient plusieurs fois plus élevés en raison d'une tarification plus élevée par jeton et de sorties de jetons plus importantes.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Comparaison des performances des modèles</h3><p>Un avantage significatif de DeepSearcher est sa flexibilité dans le passage d'un modèle à l'autre. Nous avons testé différents modèles d'inférence et des modèles de non-inférence (comme gpt-4o-mini). Dans l'ensemble, les modèles d'inférence - en particulier Claude 3.7 Sonnet - ont eu tendance à être les plus performants, bien que les différences n'aient pas été spectaculaires.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 6 : Rappel moyen par modèle</em></p>
<p>Notamment, certains modèles de non-inférence plus petits n'ont parfois pas pu compléter le processus complet de requête de l'agent en raison de leur capacité limitée à suivre les instructions - un défi commun pour de nombreux développeurs travaillant avec des systèmes similaires.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (RAG agentique) vs. Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> est également capable de traiter des requêtes complexes, en particulier des requêtes multi-sauts. Quelle est donc la différence entre DeepSearcher (RAG agentique) et Graph RAG ?</p>
<p>Graph RAG est conçu pour interroger des documents sur la base de liens relationnels explicites, ce qui le rend particulièrement performant pour les requêtes multi-sauts. Par exemple, lors du traitement d'un long roman, Graph RAG peut extraire avec précision les relations complexes entre les personnages. Cependant, cette méthode nécessite une utilisation importante de jetons lors de l'importation des données pour cartographier ces relations, et son mode d'interrogation a tendance à être rigide - typiquement efficace uniquement pour les requêtes portant sur une seule relation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 7 : Graph RAG vs. DeepSearcher</em></p>
<p>En revanche, le RAG agentique - comme l'illustre DeepSearcher - adopte une approche fondamentalement différente. Il minimise la consommation de jetons lors de l'importation des données et investit plutôt des ressources informatiques lors du traitement des requêtes. Ce choix de conception entraîne d'importants compromis techniques :</p>
<ol>
<li><p>Des coûts initiaux plus faibles : DeepSearcher nécessite moins de prétraitement des documents, ce qui rend la configuration initiale plus rapide et moins coûteuse.</p></li>
<li><p>Traitement dynamique des requêtes : Le système peut ajuster sa stratégie de recherche à la volée en fonction des résultats intermédiaires.</p></li>
<li><p>Coûts par requête plus élevés : Chaque requête nécessite plus de calculs que dans le cas de Graph RAG, mais donne des résultats plus souples.</p></li>
</ol>
<p>Pour les développeurs, cette distinction est cruciale lorsqu'il s'agit de concevoir des systèmes ayant des modes d'utilisation différents. Graph RAG peut être plus efficace pour les applications avec des modèles de requêtes prévisibles et un volume de requêtes élevé, tandis que l'approche de DeepSearcher excelle dans les scénarios nécessitant de la flexibilité et le traitement de requêtes imprévisibles et complexes.</p>
<p>À l'avenir, avec la baisse du coût des LLM et l'amélioration continue des performances d'inférence, les systèmes RAG agentiques tels que DeepSearcher deviendront probablement plus répandus. Le désavantage du coût de calcul diminuera, tandis que l'avantage de la flexibilité demeurera.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Contrairement à Deep Research de l'OpenAI, DeepSearcher est spécifiquement conçu pour l'extraction et l'analyse en profondeur de données privées. En s'appuyant sur une base de données vectorielle, DeepSearcher peut ingérer diverses sources de données, intégrer différents types de données et les stocker uniformément dans un référentiel de connaissances vectoriel. Ses solides capacités de recherche sémantique lui permettent d'effectuer des recherches efficaces dans de vastes quantités de données hors ligne.</p>
<p>En outre, DeepSearcher est entièrement open source. Bien que Deep Research reste un leader en matière de qualité de génération de contenu, il est payant et fonctionne comme un produit fermé, ce qui signifie que ses processus internes sont cachés aux utilisateurs. En revanche, DeepSearcher offre une transparence totale : les utilisateurs peuvent examiner le code, le personnaliser en fonction de leurs besoins, voire le déployer dans leurs propres environnements de production.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Aperçus techniques<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout au long du développement et des itérations ultérieures de DeepSearcher, nous avons recueilli plusieurs informations techniques importantes :</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Modèles d'inférence : Efficaces mais pas infaillibles</h3><p>Nos expériences révèlent que si les modèles d'inférence fonctionnent bien en tant qu'agents, ils suranalysent parfois des instructions simples, ce qui entraîne une consommation excessive de jetons et des temps de réponse plus lents. Cette observation s'aligne sur l'approche des principaux fournisseurs d'IA comme OpenAI, qui ne font plus de distinction entre les modèles d'inférence et les modèles de non-inférence. Au lieu de cela, les services de modèle devraient automatiquement déterminer la nécessité de l'inférence sur la base d'exigences spécifiques pour conserver les jetons.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">L'émergence imminente de la RAG agentique</h3><p>Du point de vue de la demande, la génération d'un contenu approfondi est essentielle ; d'un point de vue technique, l'amélioration de l'efficacité des RAG est également cruciale. À long terme, le coût est le principal obstacle à l'adoption généralisée de la RAG agentique. Cependant, avec l'émergence de LLM rentables et de haute qualité comme DeepSeek-R1 et les réductions de coûts induites par la loi de Moore, les dépenses associées aux services d'inférence devraient diminuer.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">La limite d'échelle cachée de la RAG agentique</h3><p>L'une des principales conclusions de nos recherches concerne la relation entre les performances et les ressources informatiques. Au départ, nous avions émis l'hypothèse que le simple fait d'augmenter le nombre d'itérations et l'allocation de jetons améliorerait proportionnellement les résultats pour les requêtes complexes.</p>
<p>Nos expériences ont révélé une réalité plus nuancée : bien que les performances s'améliorent avec des itérations supplémentaires, nous avons observé des rendements décroissants évidents. Plus précisément :</p>
<ul>
<li><p>Les performances augmentent fortement de 1 à 3 itérations.</p></li>
<li><p>Les améliorations entre 3 et 5 itérations étaient modestes.</p></li>
<li><p>Au-delà de 5 itérations, les gains étaient négligeables malgré des augmentations significatives de la consommation de jetons.</p></li>
</ul>
<p>Cette constatation a des implications importantes pour les développeurs : se contenter d'augmenter les ressources informatiques des systèmes RAG n'est pas l'approche la plus efficace. La qualité de la stratégie de recherche, de la logique de décomposition et du processus de synthèse est souvent plus importante que le nombre brut d'itérations. Cela suggère que les développeurs devraient se concentrer sur l'optimisation de ces composants plutôt que de se contenter d'augmenter les budgets de jetons.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">L'évolution au-delà du RAG traditionnel</h3><p>Le RAG traditionnel offre une efficacité précieuse grâce à son approche à faible coût et à récupération unique, ce qui le rend adapté à des scénarios simples de questions-réponses. Ses limites deviennent toutefois apparentes lorsqu'il s'agit de traiter des requêtes comportant une logique implicite complexe.</p>
<p>Prenons l'exemple d'une requête d'utilisateur telle que "Comment gagner 100 millions en un an". Un système RAG traditionnel pourrait extraire du contenu sur les carrières à hauts revenus ou les stratégies d'investissement, mais il aurait du mal à.. :</p>
<ol>
<li><p>identifier les attentes irréalistes de la requête</p></li>
<li><p>décomposer le problème en sous-objectifs réalisables</p></li>
<li><p>Synthétiser des informations provenant de plusieurs domaines (affaires, finances, entrepreneuriat)</p></li>
<li><p>présenter une approche structurée, à plusieurs voies, avec des délais réalistes.</p></li>
</ol>
<p>C'est là que les systèmes de RAG agentiques comme DeepSearcher montrent leur force. En décomposant les requêtes complexes et en appliquant un raisonnement en plusieurs étapes, ils peuvent fournir des réponses nuancées et complètes qui répondent mieux aux besoins d'information sous-jacents de l'utilisateur. Au fur et à mesure que ces systèmes deviennent plus efficaces, nous nous attendons à ce que leur adoption s'accélère dans les applications d'entreprise.</p>
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
    </button></h2><p>DeepSearcher représente une évolution significative dans la conception des systèmes RAG, offrant aux développeurs un cadre puissant pour construire des capacités de recherche plus sophistiquées. Ses principaux avantages techniques sont les suivants</p>
<ol>
<li><p>Raisonnement itératif : La capacité de décomposer des requêtes complexes en sous-étapes logiques et de construire progressivement des réponses complètes.</p></li>
<li><p>Une architecture flexible : Prise en charge de la permutation des modèles sous-jacents et de la personnalisation du processus de raisonnement pour répondre aux besoins spécifiques de l'application.</p></li>
<li><p>Intégration de la base de données Vector : Connexion transparente à Milvus pour le stockage et l'extraction efficaces d'encastrements vectoriels à partir de sources de données privées.</p></li>
<li><p>Exécution transparente : Enregistrement détaillé de chaque étape du raisonnement, permettant aux développeurs de déboguer et d'optimiser le comportement du système.</p></li>
</ol>
<p>Nos tests de performance confirment que DeepSearcher fournit des résultats supérieurs pour les requêtes complexes par rapport aux approches RAG traditionnelles, bien qu'avec des compromis évidents en termes d'efficacité de calcul. La configuration optimale (typiquement autour de 3 itérations) équilibre la précision avec la consommation de ressources.</p>
<p>Comme les coûts du LLM continuent de diminuer et que les capacités de raisonnement s'améliorent, l'approche Agentic RAG mise en œuvre dans DeepSearcher deviendra de plus en plus pratique pour les applications de production. Pour les développeurs qui travaillent sur la recherche d'entreprise, les assistants de recherche ou les systèmes de gestion des connaissances, DeepSearcher offre une puissante base open-source qui peut être personnalisée en fonction des exigences spécifiques du domaine.</p>
<p>Les contributions de la communauté des développeurs sont les bienvenues et nous vous invitons à explorer ce nouveau paradigme dans la mise en œuvre des RAG en consultant notre <a href="https://github.com/zilliztech/deep-searcher">dépôt GitHub</a>.</p>
