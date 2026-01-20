---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Comment nous avons construit un modèle de mise en évidence sémantique pour
  l'élagage du contexte RAG et la sauvegarde des tokens
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Découvrez comment Zilliz a construit un modèle de mise en évidence sémantique
  pour le filtrage du bruit RAG, l'élagage du contexte et l'économie de jetons
  en utilisant des architectures d'encodage uniquement, le raisonnement LLM et
  des données d'entraînement bilingues à grande échelle.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">Le problème : Le bruit des RAG et le gaspillage de jetons<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>recherche vectorielle</strong> est une base solide pour les systèmes RAG (assistants d'entreprise, agents d'intelligence artificielle, robots d'assistance à la clientèle, etc. Elle permet de trouver de manière fiable les documents importants. Mais la recherche vectorielle ne résout pas à elle seule le problème du contexte. Même les index bien réglés renvoient des morceaux qui sont largement pertinents, alors que seule une petite fraction des phrases à l'intérieur de ces morceaux répond réellement à la requête.</p>
<p>Dans les systèmes de production, cette lacune apparaît immédiatement. Une seule requête peut donner lieu à des dizaines de documents, chacun contenant des milliers de tokens. Seule une poignée de phrases contient le signal réel ; le reste est un contexte qui gonfle l'utilisation des jetons, ralentit l'inférence et distrait souvent le LLM. Le problème devient encore plus évident dans les flux de travail des agents, où les requêtes elles-mêmes sont le résultat d'un raisonnement en plusieurs étapes et ne correspondent qu'à de petites parties du texte récupéré.</p>
<p>Il en résulte un besoin évident d'un modèle capable d'<em><strong>identifier et de mettre en évidence</strong></em> <em>les phrases utiles et d'ignorer le reste - essentiellement</em>un filtrage de la pertinence au niveau de la phrase, ou ce que de nombreuses équipes appellent l'<a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>élagage du contexte</strong></a>. L'objectif est simple : conserver les parties importantes et éliminer le bruit avant qu'il n'atteigne le LLM.</p>
<p>La mise en évidence traditionnelle par mot-clé ne peut pas résoudre ce problème. Par exemple, si un utilisateur demande "Comment améliorer l'efficacité de l'exécution du code Python ?", un surligneur de mots-clés repérera "Python" et "efficacité", mais ne verra pas la phrase qui répond réellement à la question - "Utiliser les opérations vectorisées NumPy au lieu des boucles" - parce qu'elle ne partage aucun mot-clé avec la requête. Ce dont nous avons besoin, c'est d'une compréhension sémantique, et non d'une correspondance de chaînes de caractères.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Un modèle de mise en évidence sémantique pour le filtrage du bruit et l'élagage du contexte dans RAG<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour faciliter la tâche des concepteurs de RAG, nous avons formé et mis à disposition un <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>modèle de mise en évidence sémantique</strong></a> qui identifie et met en évidence les phrases des documents récupérés qui sont les plus sémantiquement alignées avec la requête. Le modèle fournit actuellement des performances de pointe en anglais et en chinois et est conçu pour s'intégrer directement dans les pipelines RAG existants.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Détails du modèle</strong></p>
<ul>
<li><p><strong>Référence :</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Licence :</strong> MIT (commerciale et conviviale)</p></li>
<li><p><strong>Architecture :</strong> 0.6B encoder-only model based on BGE-M3 Reranker v2</p></li>
<li><p><strong>Fenêtre de contexte :</strong> 8192 tokens</p></li>
<li><p><strong>Langues supportées :</strong> anglais et chinois</p></li>
</ul>
<p>La mise en évidence sémantique fournit les signaux de pertinence nécessaires pour sélectionner uniquement les parties utiles des longs documents récupérés. En pratique, ce modèle permet</p>
<ul>
<li><p><strong>une meilleure interprétabilité</strong>, en montrant quelles parties d'un document sont réellement importantes</p></li>
<li><p><strong>une réduction de 70 à 80 % du coût des jetons</strong> en n'envoyant que les phrases mises en évidence au LLM</p></li>
<li><p><strong>une meilleure qualité de réponse</strong>, puisque le modèle voit moins de contexte non pertinent</p></li>
<li><p><strong>un débogage plus facile</strong>, car les ingénieurs peuvent inspecter directement les correspondances au niveau de la phrase.</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Résultats de l'évaluation : Atteindre la performance SOTA</h3><p>Nous avons évalué notre modèle de surlignage sémantique sur plusieurs ensembles de données couvrant à la fois l'anglais et le chinois, dans des conditions in-domain et out-of-domain.</p>
<p>Les ensembles de référence sont les suivants</p>
<ul>
<li><p><strong>Anglais multi-span QA :</strong> multispanqa</p></li>
<li><p><strong>Wikipedia en anglais hors domaine :</strong> wikitext2</p></li>
<li><p><strong>AQ chinoise à travées multiples :</strong> multispanqa_zh</p></li>
<li><p><strong>Wikipédia en chinois hors domaine :</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les modèles évalués sont les suivants</p>
<ul>
<li><p>la série Open Provence</p></li>
<li><p>Série Provence/XProvence de Naver</p></li>
<li><p>L'outil de mise en valeur sémantique d'OpenSearch</p></li>
<li><p>Notre modèle bilingue entraîné : <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>Dans les quatre ensembles de données, notre modèle obtient le meilleur classement. Plus important encore, c'est le <em>seul</em> modèle qui obtient de bons résultats à la fois en anglais et en chinois. Les modèles concurrents se concentrent exclusivement sur l'anglais ou affichent des performances nettement inférieures sur les textes chinois.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Comment nous avons construit ce modèle de mise en évidence sémantique<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>La formation d'un modèle pour cette tâche n'est pas la partie la plus difficile ; la formation d'un <em>bon</em> modèle qui gère les problèmes antérieurs et fournit des performances proches de celles de la SOTA est là où le vrai travail se produit. Notre approche s'est concentrée sur deux points :</p>
<ul>
<li><p><strong>Architecture du modèle :</strong> utilisation d'un encodeur uniquement pour une inférence rapide.</p></li>
<li><p><strong>Données d'entraînement :</strong> générer des étiquettes de pertinence de haute qualité en utilisant des LLM capables de raisonnement et mettre à l'échelle la génération de données avec des cadres d'inférence locaux.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Architecture du modèle</h3><p>Nous avons construit le modèle comme un réseau léger d'<strong>encodeur seul</strong> qui traite l'élagage du contexte comme une <strong>tâche d'évaluation de la pertinence au niveau du jeton</strong>. Cette conception s'inspire de <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, une approche d'élagage du contexte présentée par Naver à l'ICLR 2025, qui recadre l'élagage de "choisir le bon morceau" à "noter chaque jeton". Ce cadre s'aligne naturellement sur la mise en évidence sémantique, où des signaux fins sont essentiels.</p>
<p>Les modèles à encodeur seul ne constituent pas l'architecture la plus récente, mais ils restent extrêmement pratiques dans ce domaine : ils sont rapides, faciles à mettre à l'échelle et peuvent produire des scores de pertinence pour toutes les positions des mots en parallèle. Pour un système RAG de production, cet avantage en termes de vitesse est bien plus important que l'utilisation d'un modèle de décodeur plus grand.</p>
<p>Une fois que nous avons calculé les scores de pertinence au niveau du jeton, nous les agrégeons pour obtenir des scores <strong>au niveau de la phrase</strong>. Cette étape permet de transformer les signaux de jetons bruyants en une mesure de pertinence stable et interprétable. Les phrases dépassant un seuil configurable sont mises en évidence ; toutes les autres sont filtrées. On obtient ainsi un mécanisme simple et fiable de sélection des phrases qui ont réellement de l'importance pour la requête.</p>
<h3 id="Inference-Process" class="common-anchor-header">Processus d'inférence</h3><p>Au moment de l'exécution, notre modèle de mise en évidence sémantique suit un pipeline simple :</p>
<ol>
<li><p><strong>Entrée -</strong> Le processus commence par une requête de l'utilisateur. Les documents récupérés sont traités comme des contextes candidats pour l'évaluation de la pertinence.</p></li>
<li><p><strong>Traitement du modèle -</strong> La requête et le contexte sont concaténés en une seule séquence : [BOS] + Requête + Contexte</p></li>
<li><p><strong>Évaluation des jetons -</strong> Chaque jeton du contexte se voit attribuer un score de pertinence compris entre 0 et 1, reflétant l'importance de son lien avec la requête.</p></li>
<li><p><strong>Agrégation des phrases -</strong> Les scores des jetons sont agrégés au niveau de la phrase, généralement en calculant une moyenne, afin de produire un score de pertinence pour chaque phrase.</p></li>
<li><p><strong>Filtrage par seuil -</strong> Les phrases dont le score est supérieur à un seuil configurable sont mises en évidence et conservées, tandis que les phrases à faible score sont filtrées avant d'être transmises au LLM en aval.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Modèle de base : BGE-M3 Reranker v2</h3><p>Nous avons choisi le BGE-M3 Reranker v2 comme modèle de base pour plusieurs raisons :</p>
<ol>
<li><p>Il utilise une architecture d'encodeur adaptée à l'évaluation des jetons et des phrases.</p></li>
<li><p>Prise en charge de plusieurs langues avec optimisation pour l'anglais et le chinois</p></li>
<li><p>Fournit une fenêtre contextuelle de 8192 jetons appropriée pour les documents RAG plus longs.</p></li>
<li><p>Maintient 0,6 milliard de paramètres - suffisamment fort sans être lourd en termes de calcul.</p></li>
<li><p>Assure une connaissance suffisante du monde dans le modèle de base</p></li>
<li><p>Entraîné pour le reranking, qui s'aligne étroitement sur les tâches de jugement de pertinence.</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Données de formation : Annotation LLM avec raisonnement<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois l'architecture du modèle finalisée, le défi suivant consistait à construire un ensemble de données permettant d'entraîner un modèle fiable. Nous avons commencé par étudier la façon dont Open Provence gère cela. Leur approche utilise des ensembles de données publics d'assurance qualité et un petit LLM pour étiqueter les phrases pertinentes. Elle s'adapte bien et est facile à automatiser, ce qui en fait une bonne base de référence pour nous.</p>
<p>Mais nous avons rapidement rencontré le même problème qu'ils décrivent : si vous demandez à un LLM de produire directement des étiquettes au niveau de la phrase, les résultats ne sont pas toujours stables. Certaines étiquettes sont correctes, d'autres sont douteuses, et il est difficile de nettoyer les choses par la suite. L'annotation entièrement manuelle n'était pas non plus une option - nous avions besoin de beaucoup plus de données que nous ne pourrions jamais étiqueter à la main.</p>
<p>Pour améliorer la stabilité sans sacrifier l'évolutivité, nous avons fait un changement : le LLM doit fournir un court extrait de raisonnement pour chaque étiquette qu'il produit. Chaque exemple d'entraînement comprend la requête, le document, la portée des phrases et une brève explication de la pertinence ou de la non-pertinence d'une phrase. Ce petit ajustement a rendu les annotations beaucoup plus cohérentes et nous a donné quelque chose de concret à référencer lors de la validation ou du débogage de l'ensemble de données.</p>
<p>L'inclusion du raisonnement s'est avérée étonnamment précieuse :</p>
<ul>
<li><p><strong>Une meilleure qualité d'annotation :</strong> L'écriture du raisonnement fonctionne comme un autocontrôle, ce qui réduit les étiquettes aléatoires ou incohérentes.</p></li>
<li><p><strong>Meilleure observabilité :</strong> Nous pouvons voir <em>pourquoi</em> une phrase a été sélectionnée au lieu de traiter l'étiquette comme une boîte noire.</p></li>
<li><p><strong>Débogage plus facile :</strong> Lorsque quelque chose ne semble pas correct, le raisonnement permet de déterminer facilement si le problème vient de l'invite, du domaine ou de la logique d'annotation.</p></li>
<li><p><strong>Données réutilisables :</strong> Même si nous adoptons un modèle d'étiquetage différent à l'avenir, les traces de raisonnement restent utiles pour le réétiquetage ou l'audit.</p></li>
</ul>
<p>Le flux de travail d'annotation se présente comme suit :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B pour l'annotation</h3><p>Pour l'annotation, nous avons choisi Qwen3 8B parce qu'il prend nativement en charge un "mode de réflexion" via les sorties, ce qui facilite grandement l'extraction de traces de raisonnement cohérentes. Les modèles plus petits ne nous donnaient pas d'étiquettes stables, et les modèles plus grands étaient plus lents et inutilement coûteux pour ce type de pipeline. Qwen3 8B a trouvé le bon équilibre entre la qualité, la vitesse et le coût.</p>
<p>Nous avons exécuté toutes les annotations à l'aide d'un <strong>service vLLM local</strong> plutôt que d'API dans le nuage. Cela nous a permis d'obtenir un débit élevé, des performances prévisibles et un coût beaucoup plus faible, en échangeant du temps de GPU contre des jetons d'API, ce qui est plus avantageux lorsque l'on génère des millions d'échantillons.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Échelle des ensembles de données</h3><p>Au total, nous avons créé <strong>plus de 5 millions d'échantillons de formation bilingues</strong>, répartis à peu près équitablement entre l'anglais et le chinois.</p>
<ul>
<li><p><strong>Sources anglaises :</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Sources chinoises :</strong> DuReader, Wikipedia chinois, mmarco_chinese</p></li>
</ul>
<p>Une partie du jeu de données provient de la réannotation de données existantes utilisées par des projets comme Open Provence. Le reste a été généré à partir de corpus bruts en créant d'abord des paires requête-contexte et en les étiquetant ensuite avec notre pipeline basé sur le raisonnement.</p>
<p>Toutes les données d'entraînement annotées sont également disponibles sur HuggingFace pour le développement de la communauté et les références d'entraînement : <a href="https://huggingface.co/zilliz/datasets">Jeux de données Zilliz</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Méthode de formation</h3><p>Une fois l'architecture du modèle et le jeu de données prêts, nous avons entraîné le modèle sur <strong>8× A100 GPU</strong> pour trois époques, ce qui a pris environ <strong>9 heures de</strong> bout en bout.</p>
<p><strong>Remarque :</strong> l'entraînement n'a porté que sur la <strong>tête d'élagage</strong>, qui est responsable de la tâche de mise en évidence sémantique. Nous n'avons pas entraîné la <strong>tête Rerank</strong>, car le fait de se concentrer uniquement sur l'objectif d'élagage a permis d'obtenir de meilleurs résultats pour l'évaluation de la pertinence au niveau des phrases.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Étude de cas en situation réelle<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici donc un exemple réel qui montre comment le modèle se comporte dans un cas limite courant : lorsque le texte extrait contient à la fois la bonne réponse et un distracteur très tentant.</p>
<p><strong>Requête :</strong> <em>Qui a écrit L'assassinat d'un cerf sacré ?</em></p>
<p><strong>Contexte (5 phrases) :</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Réponse correcte : Phrase 1 (indique explicitement "scénario de Lanthimos et Efthymis Filippou")</p>
<p>Cet exemple comporte un piège : la phrase 3 mentionne qu'"Euripide" a écrit la pièce originale. Mais la question demande "qui a écrit le film The Killing of a Sacred Deer", et la réponse devrait être les scénaristes du film, et non le dramaturge grec d'il y a des milliers d'années.</p>
<h3 id="Model-results" class="common-anchor-header">Résultats du modèle</h3><table>
<thead>
<tr><th>Modèle</th><th>Trouve la bonne réponse ?</th><th>Prédiction</th></tr>
</thead>
<tbody>
<tr><td>Notre modèle</td><td>✓</td><td>Phrases sélectionnées 1 (correcte) et 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>N'a sélectionné que la phrase 3, n'a pas trouvé la bonne réponse</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Seule la phrase 3 a été sélectionnée, la réponse correcte n'a pas été trouvée</td></tr>
</tbody>
</table>
<p><strong>Comparaison des scores des phrases clés :</strong></p>
<table>
<thead>
<tr><th>Phrase</th><th>Notre modèle</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Phrase 1 (scénario de film, réponse correcte)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Phrase 3 (pièce de théâtre originale, distracteur)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>Modèles XProvence :</p>
<ul>
<li><p>Fortement attiré par "Euripide" et "pièce", donnant à la phrase 3 des scores presque parfaits (0.947 et 0.802)</p></li>
<li><p>Ignore complètement la réponse réelle (phrase 1), donnant des scores extrêmement bas (0.133 et 0.081)</p></li>
<li><p>Même en abaissant le seuil de 0,5 à 0,2, il ne parvient toujours pas à trouver la bonne réponse.</p></li>
</ul>
<p>Notre modèle :</p>
<ul>
<li><p>attribue correctement à la phrase 1 le score le plus élevé (0,915)</p></li>
<li><p>Attribue toujours une certaine pertinence à la phrase 3 (0.719) parce qu'elle est liée à l'arrière-plan</p></li>
<li><p>sépare clairement les deux phrases avec une marge d'environ 0,2</p></li>
</ul>
<p>Cet exemple illustre la force principale du modèle : comprendre l'<strong>intention de la requête</strong> plutôt que de se contenter de faire correspondre des mots-clés de surface. Dans ce contexte, "Qui a écrit <em>L'assassinat d'un cerf sacré</em>" fait référence au film, et non à la pièce de théâtre grecque. Notre modèle s'en rend compte, alors que d'autres se laissent distraire par des indices lexicaux forts.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Essayez-le et dites-nous ce que vous en pensez<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre modèle <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> est désormais entièrement ouvert sous la licence MIT et prêt à être utilisé en production. Vous pouvez l'intégrer dans votre pipeline RAG, l'adapter à votre propre domaine ou créer de nouveaux outils à partir de ce modèle. Les contributions et les commentaires de la communauté sont les bienvenus.</p>
<ul>
<li><p><strong>Téléchargement depuis HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Toutes les données d'entraînement annotées</strong> <a href="https://huggingface.co/zilliz/datasets">: https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">La mise en évidence sémantique disponible dans Milvus et Zilliz Cloud</h3><p>La mise en évidence sémantique est également intégrée directement dans <a href="https://milvus.io/">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus entièrement géré), ce qui permet aux utilisateurs d'avoir une vision claire de la <em>raison pour laquelle</em> chaque document a été récupéré. Au lieu d'analyser des morceaux entiers, vous voyez immédiatement les phrases spécifiques qui se rapportent à votre requête, même si le libellé ne correspond pas exactement. La recherche est ainsi plus facile à comprendre et plus rapide à déboguer. Pour les pipelines RAG, cela clarifie également ce sur quoi le LLM en aval est censé se concentrer, ce qui aide à la conception rapide et aux contrôles de qualité.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Essayez gratuitement le Semantic Highlighting dans un Cloud Zilliz entièrement géré.</strong></a></p>
<p>Nous aimerions savoir comment cela fonctionne pour vous - rapports de bogues, idées d'amélioration, ou tout ce que vous découvrez en l'intégrant dans votre flux de travail.</p>
<p>Si vous souhaitez discuter plus en détail, n'hésitez pas à rejoindre notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou à réserver une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes. Nous sommes toujours heureux de discuter avec d'autres constructeurs et d'échanger des notes.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Remerciements<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce travail s'appuie sur un grand nombre d'idées géniales et de contributions open-source, et nous tenons à souligner les projets qui ont rendu ce modèle possible.</p>
<ul>
<li><p><strong>Provence</strong> a introduit un cadre propre et pratique pour l'élagage de contexte en utilisant des modèles d'encodeurs légers.</p></li>
<li><p><strong>Open Provence</strong> a fourni une base de code solide et bien conçue - pipelines de formation, traitement des données et têtes de modèle - sous une licence permissive. Cela nous a donné un point de départ solide pour l'expérimentation.</p></li>
</ul>
<p>Au-dessus de cette base, nous avons ajouté plusieurs contributions de notre cru :</p>
<ul>
<li><p>Utilisation du <strong>raisonnement LLM</strong> pour générer des étiquettes de pertinence de meilleure qualité</p></li>
<li><p>Création de <strong>près de 5 millions d'</strong> échantillons de formation bilingues alignés sur les charges de travail réelles de RAG</p></li>
<li><p>Choix d'un modèle de base mieux adapté à l'évaluation de la pertinence du contexte long<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>Entraînement de la <strong>tête d'élagage</strong> pour spécialiser le modèle pour la mise en évidence sémantique.</p></li>
</ul>
<p>Nous sommes reconnaissants aux équipes de Provence et d'Open Provence d'avoir publié leur travail ouvertement. Leurs contributions ont considérablement accéléré notre développement et rendu ce projet possible.</p>
