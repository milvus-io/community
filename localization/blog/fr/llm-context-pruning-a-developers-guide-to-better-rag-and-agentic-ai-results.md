---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  LLM Context Pruning : Guide du développeur pour de meilleurs résultats en
  matière de RAG et d'IA agentique
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Découvrez comment l'élagage du contexte fonctionne dans les systèmes RAG à
  contexte long, pourquoi il est important, et comment des modèles comme
  Provence permettent le filtrage sémantique et fonctionnent dans la pratique.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>Les fenêtres contextuelles des LLM sont devenues énormes ces derniers temps. Certains modèles peuvent prendre un million de tokens ou plus en une seule passe, et chaque nouvelle version semble augmenter ce chiffre. C'est passionnant, mais si vous avez construit quelque chose qui utilise un long contexte, vous savez qu'il y a un fossé entre ce qui est <em>possible</em> et ce qui est <em>utile</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce n'est pas parce qu'un modèle <em>peut</em> lire un livre entier en une seule invite que vous devez lui en donner une. La plupart des entrées longues sont pleines de choses dont le modèle n'a pas besoin. Lorsque vous commencez à déverser des centaines de milliers de tokens dans une invite, vous obtenez généralement des réponses plus lentes, des factures de calcul plus élevées et parfois des réponses de moins bonne qualité parce que le modèle essaie de prêter attention à tout en même temps.</p>
<p>Ainsi, même si les fenêtres contextuelles ne cessent de s'agrandir, la vraie question est de savoir <strong>ce qu'il faut réellement y mettre.</strong> C'est là qu'intervient l'<strong>élagage du contexte</strong>. Il s'agit essentiellement d'élaguer les parties du contexte récupéré ou assemblé qui n'aident pas le modèle à répondre à la question. Bien fait, il permet à votre système d'être rapide, stable et beaucoup plus prévisible.</p>
<p>Dans cet article, nous allons expliquer pourquoi le contexte long se comporte souvent différemment de ce à quoi vous vous attendez, comment l'élagage permet de garder les choses sous contrôle et comment les outils d'élagage comme <strong>Provence</strong> s'intègrent dans les pipelines RAG réels sans rendre votre configuration plus compliquée.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Quatre modes d'échec courants dans les systèmes à contexte long<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fenêtre de contexte plus grande ne rend pas magiquement le modèle plus intelligent. En fait, dès que vous commencez à introduire une tonne d'informations dans l'invite, vous débloquez un nouvel ensemble de moyens pour que les choses tournent mal. Voici quatre problèmes que vous rencontrerez régulièrement lors de l'élaboration de systèmes à contexte long ou de systèmes RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Le choc des contextes</h3><p>Le conflit de contexte se produit lorsque les informations accumulées au cours de plusieurs tours deviennent contradictoires.</p>
<p>Par exemple, un utilisateur peut dire "j'aime les pommes" au début d'une conversation et déclarer plus tard "je n'aime pas les fruits". Lorsque les deux déclarations restent dans le contexte, le modèle n'a aucun moyen fiable de résoudre le conflit, ce qui entraîne des réponses incohérentes ou hésitantes.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Confusion de contexte</h3><p>La confusion du contexte survient lorsque le contexte contient de grandes quantités d'informations non pertinentes ou faiblement liées, ce qui rend difficile pour le modèle la sélection de l'action ou de l'outil adéquat.</p>
<p>Ce problème est particulièrement visible dans les systèmes augmentés d'outils. Lorsque le contexte est encombré de détails sans rapport, le modèle peut mal interpréter l'intention de l'utilisateur et sélectionner le mauvais outil ou la mauvaise action - non pas parce que la bonne option est absente, mais parce que le signal est noyé dans le bruit.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Distraction contextuelle</h3><p>La distraction par le contexte se produit lorsqu'un excès d'informations contextuelles domine l'attention du modèle, réduisant ainsi sa dépendance à l'égard des connaissances pré-entraînées et du raisonnement général.</p>
<p>Au lieu de s'appuyer sur des modèles largement appris, le modèle accorde une importance excessive aux détails récents du contexte, même s'ils sont incomplets ou peu fiables. Cela peut conduire à un raisonnement superficiel ou fragile qui reflète trop fidèlement le contexte au lieu d'appliquer une compréhension de plus haut niveau.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Empoisonnement du contexte</h3><p>L'empoisonnement du contexte se produit lorsque des informations incorrectes sont introduites dans le contexte et qu'elles sont référencées et renforcées de manière répétée au cours de plusieurs tours.</p>
<p>Une seule fausse déclaration introduite au début de la conversation peut devenir la base du raisonnement ultérieur. Au fur et à mesure que le dialogue se poursuit, le modèle s'appuie sur cette hypothèse erronée, aggravant l'erreur et s'éloignant de la bonne réponse.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">Qu'est-ce que l'élagage de contexte et pourquoi est-il important ?<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'on commence à traiter de longs contextes, on se rend rapidement compte qu'il faut plus d'une astuce pour garder les choses sous contrôle. Dans les systèmes réels, les équipes combinent généralement un certain nombre de tactiques - RAG, chargement d'outils, résumé, mise en quarantaine de certains messages, délestage de l'ancien historique, etc. Elles sont toutes utiles à différents égards. Mais c'est l'<strong>élagage du contexte</strong> qui décide directement de <em>ce qui est transmis</em> au modèle.</p>
<p>L'élagage du contexte, en termes simples, est le processus de suppression automatique des informations non pertinentes, de faible valeur ou conflictuelles avant qu'elles n'entrent dans la fenêtre contextuelle du modèle. Il s'agit en fait d'un filtre qui ne conserve que les éléments de texte les plus susceptibles d'avoir de l'importance pour la tâche en cours.</p>
<p>D'autres stratégies peuvent réorganiser le contexte, le comprimer ou mettre certaines parties de côté pour plus tard. L'élagage est plus direct : <strong>il répond à la question suivante : "Cet élément d'information doit-il figurer dans l'invite ?".</strong></p>
<p>C'est pourquoi l'élagage est particulièrement important dans les systèmes RAG. La recherche vectorielle est excellente, mais elle n'est pas parfaite. Elle renvoie souvent un grand nombre de candidats, certains utiles, d'autres vaguement liés, d'autres encore complètement à côté de la plaque. Si vous vous contentez de les déverser tous dans l'invite, vous rencontrerez les modes d'échec que nous avons évoqués plus haut. L'élagage se situe entre la récupération et le modèle, agissant comme un gardien qui décide des morceaux à conserver.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lorsque l'élagage fonctionne bien, les avantages apparaissent immédiatement : un contexte plus propre, des réponses plus cohérentes, une utilisation moindre des jetons et moins d'effets secondaires bizarres dus à l'insertion de texte non pertinent. Même si vous ne changez rien à votre configuration de recherche, l'ajout d'une étape d'élagage solide peut améliorer sensiblement les performances globales du système.</p>
<p>En pratique, l'élagage est l'une des optimisations les plus efficaces dans un contexte long ou un pipeline RAG - une idée simple, un impact important.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence : Un modèle pratique d'élagage de contexte<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>En explorant les approches de l'élagage contextuel, je suis tombé sur deux modèles open-source convaincants développés par <strong>Naver Labs Europe</strong>: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> et sa variante multilingue, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence est une méthode d'apprentissage d'un modèle d'élagage contextuel léger pour la génération augmentée par la recherche, avec un accent particulier sur la réponse aux questions. À partir d'une question posée par un utilisateur et d'un passage extrait, le modèle identifie et supprime les phrases non pertinentes, en ne conservant que les informations qui contribuent à la réponse finale.</p>
<p>En élaguant le contenu de faible valeur avant la génération, Provence réduit le bruit dans l'entrée du modèle, raccourcit les messages-guides et diminue la latence de l'inférence LLM. Il est également prêt à l'emploi et fonctionne avec n'importe quel LLM ou système de recherche sans nécessiter d'intégration étroite ou de changements architecturaux.</p>
<p>Provence offre plusieurs caractéristiques pratiques pour les pipelines RAG du monde réel.</p>
<p><strong>1. Compréhension au niveau du document</strong></p>
<p>Provence raisonne sur des documents dans leur ensemble, plutôt que de noter des phrases isolément. Ceci est important car les documents réels contiennent souvent des références telles que "it", "this" ou "the method above". Prises isolément, ces phrases peuvent être ambiguës, voire dénuées de sens. Lorsqu'elles sont replacées dans leur contexte, leur pertinence devient évidente. En modélisant le document de manière holistique, Provence produit des décisions d'élagage plus précises et plus cohérentes.</p>
<p><strong>2. Sélection adaptative des phrases</strong></p>
<p>Provence détermine automatiquement le nombre de phrases à conserver dans un document extrait. Au lieu de s'appuyer sur des règles fixes telles que "conserver les cinq premières phrases", il s'adapte à la requête et au contenu.</p>
<p>Certaines questions peuvent être répondues avec une seule phrase, alors que d'autres requièrent plusieurs énoncés à l'appui. Provence gère cette variation de manière dynamique, en utilisant un seuil de pertinence qui fonctionne bien dans tous les domaines et qui peut être ajusté en cas de besoin, sans réglage manuel dans la plupart des cas.</p>
<p><strong>3. Efficacité élevée grâce au re-ranking intégré</strong></p>
<p>Provence est conçu pour être efficace. Il s'agit d'un modèle compact et léger, ce qui le rend significativement plus rapide et moins cher à exécuter que les approches d'élagage basées sur LLM.</p>
<p>Plus important encore, Provence peut combiner le reclassement et l'élagage contextuel en une seule étape. Puisque le reclassement est déjà une étape standard dans les pipelines RAG modernes, l'intégration de l'élagage à ce stade rend le coût supplémentaire de l'élagage du contexte proche de zéro, tout en améliorant la qualité du contexte transmis au modèle de langage.</p>
<p><strong>4. Support multilingue via XProvence</strong></p>
<p>Provence dispose également d'une variante appelée XProvence, qui utilise la même architecture mais est entraînée sur des données multilingues. Cela lui permet d'évaluer les requêtes et les documents dans plusieurs langues, comme le chinois, l'anglais et le coréen, ce qui le rend adapté aux systèmes RAG multilingues et interlinguistiques.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Comment Provence est entraîné</h3><p>Provence utilise une conception de formation propre et efficace basée sur une architecture d'encodeur croisé. Pendant l'apprentissage, la requête et chaque passage extrait sont concaténés en une seule entrée et encodés ensemble. Cela permet au modèle d'observer le contexte complet de la question et du passage en même temps et de raisonner directement sur leur pertinence.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cet encodage conjoint permet à Provence d'apprendre à partir de signaux de pertinence très fins. Le modèle est affiné sur <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> en tant qu'encodeur léger et optimisé pour effectuer deux tâches simultanément :</p>
<ol>
<li><p><strong>Notation de la pertinence au niveau du document (score rerank) :</strong> Le modèle prédit un score de pertinence pour l'ensemble du document, indiquant dans quelle mesure il correspond à la requête. Par exemple, un score de 0,8 représente une forte pertinence.</p></li>
<li><p><strong>Étiquetage de la pertinence au niveau des jetons (masque binaire) :</strong> Parallèlement, le modèle attribue une étiquette binaire à chaque mot, indiquant s'il est pertinent (<code translate="no">1</code>) ou non pertinent (<code translate="no">0</code>) pour la requête.</p></li>
</ol>
<p>Ainsi, le modèle entraîné peut évaluer la pertinence globale d'un document et identifier les parties qui doivent être conservées ou supprimées.</p>
<p>Au moment de l'inférence, Provence prédit les étiquettes de pertinence au niveau du jeton. Ces prédictions sont ensuite agrégées au niveau de la phrase : une phrase est conservée si elle contient plus de tokens pertinents que de tokens non pertinents ; sinon, elle est élaguée. Comme le modèle est entraîné avec une supervision au niveau de la phrase, les prédictions de jetons au sein d'une même phrase ont tendance à être cohérentes, ce qui rend cette stratégie d'agrégation fiable dans la pratique. Le comportement d'élagage peut également être réglé en ajustant le seuil d'agrégation pour obtenir un élagage plus conservateur ou plus agressif.</p>
<p>De manière cruciale, Provence réutilise l'étape de reranking que la plupart des pipelines RAG incluent déjà. Cela signifie que l'élagage contextuel peut être ajouté avec peu ou pas de frais généraux supplémentaires, ce qui rend Provence particulièrement pratique pour les systèmes RAG du monde réel.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Évaluation de la performance de l'élagage de contexte à travers les modèles<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Jusqu'à présent, nous nous sommes concentrés sur la conception et la formation de Provence. L'étape suivante consiste à évaluer ses performances dans la pratique : la qualité de l'élagage du contexte, la comparaison avec d'autres approches et le comportement dans des conditions réelles.</p>
<p>Pour répondre à ces questions, nous avons conçu un ensemble d'expériences quantitatives visant à comparer la qualité de l'élagage du contexte entre plusieurs modèles dans des contextes d'évaluation réalistes.</p>
<p>Les expériences se concentrent sur deux objectifs principaux :</p>
<ul>
<li><p><strong>L'efficacité de l'élagage :</strong> Nous mesurons la précision avec laquelle chaque modèle conserve le contenu pertinent tout en supprimant les informations non pertinentes, en utilisant des mesures standard telles que la précision, le rappel et le score F1.</p></li>
<li><p><strong>Généralisation hors domaine :</strong> Nous évaluons les performances de chaque modèle sur des distributions de données différentes de ses données d'apprentissage, afin d'évaluer sa robustesse dans des scénarios hors domaine.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modèles comparés</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (Un modèle d'élagage basé sur une architecture BERT, conçu spécifiquement pour les tâches de surlignage sémantique)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Ensemble de données</h3><p>Nous utilisons WikiText-2 comme base de données d'évaluation. WikiText-2 est dérivé des articles de Wikipedia et contient diverses structures de documents, où les informations pertinentes sont souvent réparties sur plusieurs phrases et où les relations sémantiques peuvent être non triviales.</p>
<p>Il est important de noter que WikiText-2 diffère considérablement des données généralement utilisées pour entraîner les modèles d'élagage contextuel, tout en ressemblant à un contenu réel et riche en connaissances. Il convient donc parfaitement à l'évaluation hors domaine, qui est l'un des principaux objectifs de nos expériences.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Génération de requêtes et annotation</h3><p>Pour construire une tâche d'élagage hors domaine, nous générons automatiquement des paires question-réponse à partir du corpus WikiText-2 brut en utilisant <strong>GPT-4o-mini</strong>. Chaque échantillon d'évaluation se compose de trois éléments :</p>
<ul>
<li><p><strong>Requête :</strong> Une question en langage naturel générée à partir du document.</p></li>
<li><p><strong>Contexte :</strong> Le document complet, non modifié.</p></li>
<li><p><strong>Vérité de base :</strong> annotations au niveau des phrases indiquant celles qui contiennent la réponse (à conserver) et celles qui ne sont pas pertinentes (à élaguer).</p></li>
</ul>
<p>Cette configuration définit naturellement une tâche d'élagage du contexte : étant donné une requête et un document complet, le modèle doit identifier les phrases qui ont réellement de l'importance. Les phrases qui contiennent la réponse sont étiquetées comme pertinentes et doivent être conservées, tandis que toutes les autres phrases sont considérées comme non pertinentes et doivent être élaguées. Cette formulation permet de mesurer quantitativement la qualité de l'élagage à l'aide de la précision, du rappel et du score F1.</p>
<p>Il est essentiel que les questions générées n'apparaissent pas dans les données d'apprentissage des modèles évalués. Par conséquent, les performances reflètent une véritable généralisation plutôt qu'une mémorisation. Au total, nous générons 300 échantillons, couvrant des questions simples basées sur des faits, des tâches de raisonnement multi-sauts et des invites analytiques plus complexes, afin de mieux refléter les modèles d'utilisation du monde réel.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Pipeline d'évaluation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Optimisation des hyperparamètres : Pour chaque modèle, nous effectuons une recherche en grille sur un espace d'hyperparamètres prédéfini et sélectionnons la configuration qui maximise le score F1.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Résultats et analyse</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les résultats révèlent de nettes différences de performance entre les trois modèles.</p>
<p><strong>Provence</strong> obtient la meilleure performance globale, avec un <strong>score F1 de 66,76%</strong>. Sa précision<strong>(69,53 %</strong>) et son rappel<strong>(64,19 %</strong>) sont bien équilibrés, ce qui indique une généralisation solide en dehors du domaine. La configuration optimale utilise un seuil d'élagage de <strong>0,6</strong> et α <strong>= 0,051</strong>, ce qui suggère que les scores de pertinence du modèle sont bien calibrés et que le comportement d'élagage est intuitif et facile à régler dans la pratique.</p>
<p><strong>XProvence</strong> atteint un <strong>score F1 de 58,97%</strong>, caractérisé par un <strong>rappel élevé (75,52%)</strong> et une <strong>précision plus faible (48,37%)</strong>. Ceci reflète une stratégie d'élagage plus conservatrice qui donne la priorité à la conservation des informations potentiellement pertinentes plutôt qu'à l'élimination agressive du bruit. Un tel comportement peut être souhaitable dans les domaines où les faux négatifs sont coûteux, tels que les applications médicales ou juridiques, mais il augmente également le nombre de faux positifs, ce qui réduit la précision. Malgré ce compromis, la capacité multilingue de XProvence en fait une option solide pour les environnements non anglophones ou multilingues.</p>
<p>En revanche, <strong>OpenSearch Semantic Highlighter</strong> est nettement moins performant, avec un <strong>score F1 de 46,37 %</strong> (précision <strong>62,35 %</strong>, rappel <strong>36,98 %</strong>). L'écart par rapport à Provence et XProvence met en évidence les limites de l'étalonnage des scores et de la généralisation hors domaine, en particulier dans des conditions hors domaine.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Mise en évidence sémantique : Une autre façon de trouver ce qui est réellement important dans un texte<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons parlé de l'élagage du contexte, il convient d'examiner une autre pièce du puzzle : la <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>mise en évidence sémantique</strong></a>. D'un point de vue technique, ces deux fonctionnalités font pratiquement le même travail : elles évaluent des morceaux de texte en fonction de leur pertinence par rapport à une requête. La différence réside dans la manière dont le résultat est utilisé dans le pipeline.</p>
<p>La plupart des gens entendent "surligner" et pensent aux outils classiques de surlignage de mots clés que l'on trouve dans Elasticsearch ou Solr. Ces outils recherchent essentiellement des correspondances littérales de mots clés et les enveloppent dans quelque chose comme <code translate="no">&lt;em&gt;</code>. Ils sont bon marché et prévisibles, mais ils ne fonctionnent que lorsque le texte utilise <em>exactement</em> les mêmes mots que la requête. Si le document paraphrase, utilise des synonymes ou formule l'idée différemment, les surligneurs traditionnels passent complètement à côté.</p>
<p><strong>La mise en évidence sémantique emprunte une voie différente.</strong> Au lieu de vérifier les correspondances exactes entre les chaînes de caractères, il utilise un modèle pour estimer la similarité sémantique entre la requête et les différentes parties du texte. Cela lui permet de mettre en évidence le contenu pertinent même si la formulation est totalement différente. Pour les pipelines RAG, les flux d'agents ou tout système de recherche IA où le sens compte plus que les mots, la mise en évidence sémantique vous donne une image beaucoup plus claire de la <em>raison pour laquelle</em> un document a été récupéré.</p>
<p>Le problème est que la plupart des solutions de mise en évidence sémantique existantes ne sont pas conçues pour des charges de travail d'IA de production. Nous avons testé toutes les solutions disponibles, mais aucune n'offrait le niveau de précision, de latence ou de fiabilité multilingue dont nous avions besoin pour de véritables systèmes RAG et agents. Nous avons donc fini par former notre propre modèle et l'ouvrir à la concurrence : <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>À un niveau élevé, l'<strong>élagage contextuel et la mise en évidence sémantique résolvent la même tâche principale</strong>: à partir d'une requête et d'un morceau de texte, déterminer quelles parties ont réellement de l'importance. La seule différence réside dans la suite des opérations.</p>
<ul>
<li><p>L<strong>'élagage contextuel</strong> élimine les parties non pertinentes avant la génération.</p></li>
<li><p>La<strong>mise en évidence sémantique</strong> conserve l'intégralité du texte, mais fait apparaître visuellement les parties importantes.</p></li>
</ul>
<p>L'opération sous-jacente étant très similaire, le même modèle peut souvent utiliser les deux fonctions. Il est ainsi plus facile de réutiliser les composants dans la pile et votre système RAG reste plus simple et plus efficace dans l'ensemble.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Mise en évidence sémantique dans Milvus et Zilliz Cloud</h3><p>La mise en évidence sémantique est désormais entièrement prise en charge dans <a href="https://milvus.io">Milvus</a> et <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (le service entièrement géré de Milvus), et elle s'avère déjà utile pour tous ceux qui travaillent avec RAG ou la recherche pilotée par l'IA. Cette fonctionnalité résout un problème très simple mais pénible : lorsque la recherche vectorielle renvoie une tonne de morceaux, comment déterminer rapidement <em>quelles phrases à l'intérieur de ces morceaux ont réellement de l'importance</em>?</p>
<p>Sans surlignage, les utilisateurs finissent par lire des documents entiers juste pour comprendre pourquoi quelque chose a été récupéré. Grâce à la mise en évidence sémantique intégrée, Milvus et Zilliz Cloud marquent automatiquement les passages spécifiques qui sont sémantiquement liés à votre requête, même si la formulation est différente. Plus besoin de chercher des correspondances de mots clés ou de deviner pourquoi un morceau est apparu.</p>
<p>La recherche est ainsi beaucoup plus transparente. Au lieu de renvoyer simplement des "documents pertinents", Milvus montre <em>où</em> se trouve la pertinence. Pour les pipelines RAG, cela est particulièrement utile car vous pouvez instantanément voir ce que le modèle est censé prendre en compte, ce qui facilite grandement le débogage et la construction d'invites.</p>
<p>Nous avons intégré cette prise en charge directement dans Milvus et Zilliz Cloud, de sorte qu'il n'est pas nécessaire d'ajouter des modèles externes ou d'exécuter un autre service pour obtenir une attribution utilisable. Tout se déroule à l'intérieur du chemin de recherche : recherche vectorielle → évaluation de la pertinence → portées mises en évidence. Il fonctionne à l'échelle et prend en charge les charges de travail multilingues avec notre modèle <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">Perspectives d'avenir<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ingénierie contextuelle est encore très récente et il reste encore beaucoup de choses à comprendre. Même si l'élagage et la mise en évidence sémantique fonctionnent bien dans <a href="https://milvus.io">Milvus</a> et <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>,</strong> nous sommes loin de la fin de l'histoire. De nombreux domaines nécessitent encore un véritable travail d'ingénierie - rendre les modèles d'élagage plus précis sans ralentir les choses, mieux gérer les requêtes bizarres ou hors domaine, et relier toutes les pièces ensemble pour que l'extraction → rerank → prune → highlight ressemble à un pipeline propre au lieu d'un ensemble de bidouillages collés les uns aux autres.</p>
<p>Ces décisions deviennent de plus en plus importantes au fur et à mesure que les fenêtres de contexte s'agrandissent. Une bonne gestion du contexte n'est plus un "bonus agréable" ; elle devient un élément essentiel pour que les systèmes à contexte long et RAG se comportent de manière fiable.</p>
<p>Nous allons continuer à expérimenter, à comparer et à livrer les éléments qui font réellement la différence pour les développeurs. L'objectif est simple : faciliter la construction de systèmes qui ne se cassent pas avec des données désordonnées, des requêtes imprévisibles ou des charges de travail à grande échelle.</p>
<p>Si vous souhaitez discuter de tout cela, ou si vous avez simplement besoin d'aide pour déboguer quelque chose, vous pouvez vous connecter à notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>Nous sommes toujours heureux de discuter et d'échanger des notes avec d'autres constructeurs.</p>
