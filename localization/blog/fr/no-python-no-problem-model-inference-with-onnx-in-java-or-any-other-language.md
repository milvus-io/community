---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Pas de Python, pas de problème : Inférence de modèle avec ONNX en Java, ou
  tout autre langage
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) est un écosystème d'outils agnostiques
  pour l'inférence de modèles de réseaux neuronaux.
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>Il n'a jamais été aussi facile de créer des applications d'IA générative. Un riche écosystème d'outils, de modèles d'IA et d'ensembles de données permet même aux ingénieurs logiciels non spécialisés de construire des chatbots impressionnants, des générateurs d'images et bien plus encore. Ces outils, pour la plupart, sont conçus pour Python et s'appuient sur PyTorch. Mais qu'en est-il lorsque vous n'avez pas accès à Python en production et que vous devez utiliser Java, Golang, Rust, C++ ou un autre langage ?</p>
<p>Nous nous limiterons à l'inférence de modèles, y compris les modèles d'intégration et les modèles de base ; les autres tâches, telles que l'entraînement et le réglage fin des modèles, ne sont généralement pas effectuées au moment du déploiement. Quelles sont nos options pour l'inférence de modèle sans Python ? La solution la plus évidente consiste à utiliser un service en ligne proposé par des fournisseurs comme Anthropic ou Mistral. Ils fournissent généralement un SDK pour les langages autres que Python, et s'ils ne le font pas, cela ne nécessiterait que de simples appels à l'API REST. Mais qu'en est-il si notre solution doit être entièrement locale en raison, par exemple, de problèmes de conformité ou de protection de la vie privée ?</p>
<p>Une autre solution consiste à exécuter un serveur Python localement. Le problème initial était l'impossibilité d'exécuter Python en production, ce qui exclut l'utilisation d'un serveur Python local. Les solutions locales connexes seront probablement soumises à des restrictions juridiques, techniques ou de sécurité similaires. <em>Nous avons besoin d'une solution entièrement intégrée qui nous permette d'appeler le modèle directement à partir de Java ou d'un autre langage non-Python.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1 : Un Python se métamorphose en un papillon Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">Qu'est-ce que l'ONNX (Open Neural Network Exchange) ?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) est un écosystème d'outils agnostiques pour l'inférence de modèles de réseaux neuronaux. Il a été initialement développé par l'équipe PyTorch de Meta (alors Facebook), avec des contributions ultérieures de Microsoft, IBM, Huawei, Intel, AMD, Arm et Qualcomm. Il s'agit actuellement d'un projet open-source appartenant à la Fondation Linux pour l'IA et les données. ONNX est la méthode de facto pour distribuer des modèles de réseaux neuronaux agnostiques en termes de plateforme.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2 : Graphique de calcul ONNX (partiel) pour un transformateur NN</em></p>
<p><strong>Nous utilisons généralement "ONNX" dans un sens plus étroit pour faire référence à son format de fichier.</strong> Un fichier de modèle ONNX représente un graphique de calcul, comprenant souvent les valeurs de poids d'une fonction mathématique, et la norme définit des opérations communes pour les réseaux neuronaux. Vous pouvez l'assimiler au graphique de calcul créé lorsque vous utilisez autodiff avec PyTorch. D'un autre point de vue, le format de fichier ONNX sert de <em>représentation intermédiaire</em> (RI) pour les réseaux neuronaux, à l'instar de la compilation du code natif, qui implique également une étape de RI. L'illustration ci-dessus présente un graphe de calcul ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3 : Une RI permet de nombreuses combinaisons de front-ends et de back-ends.</em></p>
<p>Le format de fichier ONNX n'est qu'une partie de l'écosystème ONNX, qui comprend également des bibliothèques pour manipuler les graphes de calcul et des bibliothèques pour charger et exécuter les fichiers de modèles ONNX. Ces bibliothèques couvrent plusieurs langues et plateformes. Comme ONNX n'est qu'un IR (Intermediate Representation Language), des optimisations spécifiques à une plateforme matérielle donnée peuvent être appliquées avant de l'exécuter avec le code natif. Voir la figure ci-dessus illustrant les combinaisons de front-ends et de back-ends.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Flux de travail ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>À des fins de discussion, nous allons étudier la possibilité d'appeler un modèle d'intégration de texte à partir de Java, par exemple, en préparation de l'ingestion de données dans la base de données vectorielles open-source <a href="https://milvus.io/">Milvus</a>. Donc, si nous devons appeler notre modèle d'intégration ou de fondation depuis Java, est-ce aussi simple que d'utiliser la bibliothèque ONNX sur le fichier de modèle correspondant ? Oui, mais nous devrons nous procurer des fichiers pour le modèle et l'encodeur du tokenizer (et le décodeur pour les modèles de fondation). Nous pouvons les produire nous-mêmes en utilisant Python hors ligne, c'est-à-dire avant la production, ce que nous expliquons maintenant.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Exportation de modèles NN à partir de Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Ouvrons un modèle d'intégration de texte courant, <code translate="no">all-MiniLM-L6-v2</code>, à partir de Python en utilisant la bibliothèque de transformateurs de phrases de HuggingFace. Nous utiliserons la bibliothèque HF indirectement via la bibliothèque util de .txtai car nous avons besoin d'une enveloppe autour de sentence-transformers qui exporte également les couches de mise en commun et de normalisation après la fonction de transformation. (Ces couches prennent les enchâssements de jetons dépendants du contexte, c'est-à-dire la sortie du transformateur, et les transforment en un seul enchâssement de texte).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Nous demandons à la bibliothèque d'exporter <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> à partir du hub de modèles HuggingFace en tant qu'ONNX, en spécifiant que la tâche est l'intégration de texte et en activant la quantification du modèle. L'appel à <code translate="no">onnx_model()</code> téléchargera le modèle à partir du hub de modèles s'il n'existe pas déjà localement, convertira les trois couches en ONNX et combinera leurs graphes de calcul.</p>
<p>Sommes-nous prêts maintenant à effectuer l'inférence en Java ? Pas si vite. Le modèle entre une liste de tokens (ou une liste de listes pour plus d'un échantillon) correspondant à la tokenisation du texte que nous souhaitons intégrer. Par conséquent, à moins que nous ne puissions effectuer toute la tokenisation avant la production, nous devrons exécuter le tokenizer à partir de Java.</p>
<p>Il existe plusieurs options pour ce faire. L'une d'entre elles consiste à mettre en œuvre ou à trouver une mise en œuvre du tokenizer pour le modèle en question en Java ou dans un autre langage, et à l'appeler à partir de Java sous la forme d'une bibliothèque statique ou liée dynamiquement. Une solution plus simple consiste à convertir le tokenizer en un fichier ONNX et à l'utiliser à partir de Java, tout comme nous utilisons le fichier ONNX du modèle.</p>
<p>Cependant, le fichier ONNX ordinaire ne contient pas les opérations nécessaires pour mettre en œuvre le graphe de calcul d'un tokenizer. C'est pourquoi Microsoft a créé une bibliothèque pour augmenter ONNX, appelée ONNXRuntime-Extensions. Elle définit des opérations utiles pour toutes sortes de pré et post-traitements de données, et pas seulement pour les tokenizers de texte.</p>
<p>Voici comment nous exportons notre tokenizer sous la forme d'un fichier ONNX :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Nous avons supprimé le décodeur du tokenizer, puisque l'intégration de phrases ne le nécessite pas. Nous avons maintenant deux fichiers : <code translate="no">tokenizer.onnx</code> pour le tokenizateur de texte, et <code translate="no">model.onnx</code> pour l'incorporation de chaînes de tokens.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Inférence de modèle en Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>L'exécution de notre modèle à partir de Java est maintenant triviale. Voici quelques lignes de code importantes de l'exemple complet :</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>Un exemple complet peut être trouvé dans la section des ressources.</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons vu dans ce billet comment il est possible d'exporter des modèles open-source depuis le hub de modèles de HuggingFace et de les utiliser directement à partir de langages autres que Python. Nous notons cependant quelques mises en garde :</p>
<p>Tout d'abord, les bibliothèques ONNX et les extensions de runtime ont des niveaux variables de prise en charge des fonctionnalités. Il ne sera peut-être pas possible d'utiliser tous les modèles dans tous les langages jusqu'à ce qu'une future mise à jour du SDK soit publiée. Les bibliothèques d'exécution ONNX pour Python, C++, Java et JavaScript sont les plus complètes.</p>
<p>Deuxièmement, le hub HuggingFace contient des ONNX pré-exportés, mais ces modèles n'incluent pas les couches finales de regroupement et de normalisation. Vous devez savoir comment fonctionne <code translate="no">sentence-transformers</code> si vous avez l'intention d'utiliser directement <code translate="no">torch.onnx</code>.</p>
<p>Néanmoins, ONNX a le soutien des principaux leaders de l'industrie et est sur une trajectoire pour devenir un moyen sans friction de l'IA générative multiplateforme.</p>
<h2 id="Resources" class="common-anchor-header">Ressources<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Exemple de code ONNX en Python et Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
