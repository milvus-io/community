---
id: how-to-get-the-right-vector-embeddings.md
title: Comment obtenir les bons Vector Embeddings ?
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Une introduction complète aux encastrements vectoriels et à la manière de les
  générer avec des modèles open-source populaires.
cover: assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Embeddings, Image Embeddings, Text Embeddings
recommend: true
canonicalUrl: 'https://zilliz.com/blog/how-to-get-the-right-vector-embeddings'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cet article a été publié à l'origine dans <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> et est repris ici avec permission.</em></p>
<p><strong>Une introduction complète aux vector embeddings et à la manière de les générer avec des modèles open source populaires.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Image par Денис Марчук de Pixabay</span> </span></p>
<p>Les encastrements vectoriels sont essentiels lorsque l'on travaille sur la <a href="https://zilliz.com/blog/vector-similarity-search">similarité sémantique</a>. Cependant, un vecteur est simplement une série de nombres ; un encastrement vectoriel est une série de nombres représentant des données d'entrée. L'intégration vectorielle permet de structurer des <a href="https://zilliz.com/blog/introduction-to-unstructured-data">données non structurées</a> ou de travailler avec n'importe quel type de données en les convertissant en une série de nombres. Cette approche nous permet d'effectuer des opérations mathématiques sur les données d'entrée, plutôt que de nous appuyer sur des comparaisons qualitatives.</p>
<p>Les encastrements vectoriels ont une grande influence sur de nombreuses tâches, en particulier sur la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a>. Toutefois, il est essentiel d'obtenir les encastrements vectoriels appropriés avant de les utiliser. Par exemple, si vous utilisez un modèle d'image pour vectoriser du texte, ou vice versa, vous obtiendrez probablement de mauvais résultats.</p>
<p>Dans cet article, nous allons apprendre ce que signifient les embeddings vectoriels, comment générer les embeddings vectoriels appropriés pour vos applications en utilisant différents modèles et comment utiliser au mieux les embeddings vectoriels avec des bases de données vectorielles telles que <a href="https://milvus.io/">Milvus</a> et <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Comment les incrustations vectorielles sont-elles créées ?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/how_vector_embeddings_are_created_03f9b60c68.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Maintenant que nous comprenons l'importance des embeddings vectoriels, apprenons comment ils fonctionnent. Un vector embedding est la représentation interne des données d'entrée dans un modèle d'apprentissage profond, également connu sous le nom de modèles d'intégration ou de réseau neuronal profond. Comment extraire ces informations ?</p>
<p>Nous obtenons des vecteurs en supprimant la dernière couche et en prenant la sortie de l'avant-dernière couche. La dernière couche d'un réseau neuronal produit généralement la prédiction du modèle, nous prenons donc la sortie de l'avant-dernière couche. L'intégration vectorielle correspond aux données transmises à la couche prédictive d'un réseau neuronal.</p>
<p>La dimensionnalité d'un vecteur intégré est équivalente à la taille de l'avant-dernière couche du modèle et est donc interchangeable avec la taille ou la longueur du vecteur. Les dimensions courantes des vecteurs sont 384 (générées par Sentence Transformers Mini-LM), 768 (par Sentence Transformers MPNet), 1 536 (par OpenAI) et 2 048 (par ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">Que signifie l'intégration vectorielle ?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Quelqu'un m'a demandé un jour ce que signifiait chaque dimension d'un vector embedding. La réponse courte est : rien. Une seule dimension d'un vecteur intégré ne signifie rien, car elle est trop abstraite pour que l'on puisse en déterminer la signification. Cependant, lorsque nous prenons toutes les dimensions ensemble, elles fournissent la signification sémantique des données d'entrée.</p>
<p>Les dimensions du vecteur sont des représentations abstraites de haut niveau de différents attributs. Les attributs représentés dépendent des données d'apprentissage et du modèle lui-même. Les modèles de texte et d'image génèrent des encastrements différents parce qu'ils sont formés pour des types de données fondamentalement différents. Même des modèles de texte différents génèrent des encastrements différents. Ils diffèrent parfois par leur taille, mais aussi par les attributs qu'ils représentent. Par exemple, un modèle formé sur des données juridiques apprendra des choses différentes d'un modèle formé sur des données de soins de santé. J'ai exploré ce sujet dans mon article sur <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">la comparaison des vector embeddings</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Générer les bons vector embeddings<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Comment obtenir les bons embeddings vectoriels ? Tout commence par l'identification du type de données que vous souhaitez intégrer. Cette section couvre l'intégration de cinq types de données différents : images, texte, audio, vidéos et données multimodales. Tous les modèles présentés ici sont open source et proviennent de Hugging Face ou PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Intégration d'images</h3><p>La reconnaissance d'images a pris son essor en 2012 après l'apparition d'AlexNet. Depuis, le domaine de la vision par ordinateur a connu de nombreuses avancées. Le dernier modèle notable de reconnaissance d'images est ResNet-50, un réseau résiduel profond à 50 couches basé sur l'ancienne architecture ResNet-34.</p>
<p>Les réseaux neuronaux résiduels (ResNet) résolvent le problème de la disparition du gradient dans les réseaux neuronaux convolutionnels profonds à l'aide de connexions raccourcies. Ces connexions permettent à la sortie des couches précédentes d'aller directement aux couches suivantes sans passer par toutes les couches intermédiaires, évitant ainsi le problème du gradient de fuite. Cette conception rend ResNet moins complexe que VGGNet (Visual Geometry Group), un réseau neuronal convolutionnel précédemment très performant.</p>
<p>Je recommande deux implémentations de ResNet-50 à titre d'exemple : <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 sur Hugging Face</a> et <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 sur PyTorch Hub</a>. Bien que les réseaux soient les mêmes, le processus d'obtention des embeddings diffère.</p>
<p>L'exemple de code ci-dessous montre comment utiliser PyTorch pour obtenir des embeddings vectoriels. Tout d'abord, nous chargeons le modèle depuis PyTorch Hub. Ensuite, nous supprimons la dernière couche et appelons <code translate="no">.eval()</code> pour demander au modèle de se comporter comme s'il était en cours d'exécution pour l'inférence. Ensuite, la fonction <code translate="no">embed</code> génère l'intégration vectorielle.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace utilise une configuration légèrement différente. Le code ci-dessous montre comment obtenir un encapsulage vectoriel à partir de Hugging Face. Tout d'abord, nous avons besoin d'un extracteur de caractéristiques et d'un modèle de la bibliothèque <code translate="no">transformers</code>. Nous utiliserons l'extracteur de caractéristiques pour obtenir des entrées pour le modèle et utiliserons le modèle pour obtenir des sorties et extraire le dernier état caché.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, AutoModelForImageClassification


extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)
model = AutoModelForImageClassification.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)


<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Text-embeddings" class="common-anchor-header">Incrustations de texte</h3><p>Les ingénieurs et les chercheurs ont expérimenté le langage naturel et l'IA depuis l'invention de l'IA. Parmi les premières expériences, on peut citer</p>
<ul>
<li>ELIZA, le premier chatbot thérapeute de l'IA.</li>
<li>La chambre chinoise de John Searle, une expérience de pensée qui examine si la capacité de traduire entre le chinois et l'anglais nécessite une compréhension de la langue.</li>
<li>Traductions entre l'anglais et le russe basées sur des règles.</li>
</ul>
<p>Le fonctionnement de l'IA sur le langage naturel a évolué de manière significative par rapport à son intégration basée sur des règles. En commençant par les réseaux neuronaux primaires, nous avons ajouté des relations de récurrence par le biais des RNN pour suivre les étapes dans le temps. Ensuite, nous avons utilisé des transformateurs pour résoudre le problème de la transduction des séquences.</p>
<p>Les transformateurs se composent d'un encodeur, qui code une entrée dans une matrice représentant l'état, d'une matrice d'attention et d'un décodeur. Le décodeur décode l'état et la matrice d'attention afin de prédire le prochain jeton correct pour terminer la séquence de sortie. Le GPT-3, le modèle linguistique le plus populaire à ce jour, comprend des décodeurs stricts. Ils codent l'entrée et prédisent le(s) bon(s) mot(s) suivant(s).</p>
<p>Voici deux modèles de la bibliothèque <code translate="no">sentence-transformers</code> de Hugging Face que vous pouvez utiliser en plus des embeddings d'OpenAI :</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: un modèle à 384 dimensions</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: un modèle à 768 dimensions</li>
</ul>
<p>Vous pouvez accéder aux embeddings des deux modèles de la même manière.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Encastrements multimodaux</h3><p>Les modèles multimodaux sont moins bien développés que les modèles d'image ou de texte. Ils relient souvent les images au texte.</p>
<p>L'exemple open source le plus utile est <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, un modèle image-texte. Vous pouvez accéder aux embeddings de CLIP VIT de la même manière que vous le feriez avec un modèle d'image, comme le montre le code ci-dessous.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoProcessor, AutoModelForZeroShotImageClassification


processor = AutoProcessor.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
model = AutoModelForZeroShotImageClassification.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Audio-embeddings" class="common-anchor-header">Incrustations audio</h3><p>L'IA pour l'audio a reçu moins d'attention que l'IA pour le texte ou les images. Le cas d'utilisation le plus courant pour l'audio est la conversion de la parole en texte dans des secteurs tels que les centres d'appel, la technologie médicale et l'accessibilité. Un modèle open source populaire pour la conversion de la parole au texte est <a href="https://huggingface.co/openai/whisper-large-v2">Whisper d'OpenAI</a>. Le code ci-dessous montre comment obtenir des embeddings vectoriels à partir du modèle parole-texte.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
from transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, WhisperModel
from datasets <span class="hljs-keyword">import</span> <span class="hljs-type">load_dataset</span>


<span class="hljs-variable">model</span> <span class="hljs-operator">=</span> WhisperModel.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
feature_extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
ds = load_dataset(<span class="hljs-string">&quot;hf-internal-testing/librispeech_asr_dummy&quot;</span>, <span class="hljs-string">&quot;clean&quot;</span>, split=<span class="hljs-string">&quot;validation&quot;</span>)
inputs = feature_extractor(ds[<span class="hljs-number">0</span>][<span class="hljs-string">&quot;audio&quot;</span>][<span class="hljs-string">&quot;array&quot;</span>], return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
input_features = inputs.<span class="hljs-type">input_features</span>
<span class="hljs-variable">decoder_input_ids</span> <span class="hljs-operator">=</span> torch.tensor([[<span class="hljs-number">1</span>, <span class="hljs-number">1</span>]]) * model.config.<span class="hljs-type">decoder_start_token_id</span>
<span class="hljs-variable">vector_embedding</span> <span class="hljs-operator">=</span> model(input_features, decoder_input_ids=decoder_input_ids).last_hidden_state
<button class="copy-code-btn"></button></code></pre>
<h3 id="Video-embeddings" class="common-anchor-header">Encastrements vidéo</h3><p>Les encastrements vidéo sont plus complexes que les encastrements audio ou d'images. Une approche multimodale est nécessaire lorsque l'on travaille avec des vidéos, car elles contiennent du son et des images synchronisés. Un modèle vidéo populaire est le <a href="https://huggingface.co/deepmind/multimodal-perceiver">perceur multimodal</a> de DeepMind. Ce <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">tutoriel</a> montre comment utiliser ce modèle pour classer une vidéo.</p>
<p>Pour obtenir les embeddings de l'entrée, utilisez <code translate="no">outputs[1][-1].squeeze()</code> à partir du code présenté dans le notebook au lieu de supprimer les sorties. Je mets en évidence cet extrait de code dans la fonction <code translate="no">autoencode</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">autoencode_video</span>(<span class="hljs-params">images, audio</span>):
     <span class="hljs-comment"># only create entire video once as inputs</span>
     inputs = {<span class="hljs-string">&#x27;image&#x27;</span>: torch.from_numpy(np.moveaxis(images, -<span class="hljs-number">1</span>, <span class="hljs-number">2</span>)).<span class="hljs-built_in">float</span>().to(device),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.from_numpy(audio).to(device),
               <span class="hljs-string">&#x27;label&#x27;</span>: torch.zeros((images.shape[<span class="hljs-number">0</span>], <span class="hljs-number">700</span>)).to(device)}
     nchunks = <span class="hljs-number">128</span>
     reconstruction = {}
     <span class="hljs-keyword">for</span> chunk_idx <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(nchunks)):
          image_chunk_size = np.prod(images.shape[<span class="hljs-number">1</span>:-<span class="hljs-number">1</span>]) // nchunks
          audio_chunk_size = audio.shape[<span class="hljs-number">1</span>] // SAMPLES_PER_PATCH // nchunks
          subsampling = {
               <span class="hljs-string">&#x27;image&#x27;</span>: torch.arange(
                    image_chunk_size * chunk_idx, image_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.arange(
                    audio_chunk_size * chunk_idx, audio_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;label&#x27;</span>: <span class="hljs-literal">None</span>,
          }
     <span class="hljs-comment"># forward pass</span>
          <span class="hljs-keyword">with</span> torch.no_grad():
               outputs = model(inputs=inputs, subsampled_output_points=subsampling)


          output = {k:v.cpu() <span class="hljs-keyword">for</span> k,v <span class="hljs-keyword">in</span> outputs.logits.items()}
          reconstruction[<span class="hljs-string">&#x27;label&#x27;</span>] = output[<span class="hljs-string">&#x27;label&#x27;</span>]
          <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;image&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> reconstruction:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = output[<span class="hljs-string">&#x27;image&#x27;</span>]
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = output[<span class="hljs-string">&#x27;audio&#x27;</span>]
          <span class="hljs-keyword">else</span>:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], output[<span class="hljs-string">&#x27;image&#x27;</span>]], dim=<span class="hljs-number">1</span>)
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], output[<span class="hljs-string">&#x27;audio&#x27;</span>]], dim=<span class="hljs-number">1</span>)
          vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<span class="hljs-comment"># finally, reshape image and audio modalities back to original shape</span>
     reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], images.shape)
     reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], audio.shape)
     <span class="hljs-keyword">return</span> reconstruction


     <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Stockage, indexation et recherche d'embeddings vectoriels avec des bases de données vectorielles<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous comprenons ce que sont les encastrements vectoriels et comment les générer à l'aide de différents modèles d'encastrement puissants, la question suivante est de savoir comment les stocker et en tirer parti. Les bases de données vectorielles sont la réponse.</p>
<p>Les bases de données vectorielles telles que <a href="https://zilliz.com/what-is-milvus">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a> sont spécialement conçues pour le stockage, l'indexation et la recherche dans des ensembles massifs de données non structurées par le biais d'incrustations vectorielles. Elles constituent également l'une des infrastructures les plus critiques pour les différentes piles d'IA.</p>
<p>Les bases de données vectorielles utilisent généralement l'algorithme <a href="https://zilliz.com/glossary/anns">ANN (Approximate Nearest Neighbor)</a> pour calculer la distance spatiale entre le vecteur de la requête et les vecteurs stockés dans la base de données. Plus les deux vecteurs sont proches, plus ils sont pertinents. L'algorithme trouve ensuite les k premiers voisins les plus proches et les fournit à l'utilisateur.</p>
<p>Les bases de données vectorielles sont populaires dans des cas d'utilisation tels que la <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">génération augmentée de recherche LLM</a> (RAG), les systèmes de questions-réponses, les systèmes de recommandation, les recherches sémantiques et les recherches de similitudes d'images, de vidéos et d'audio.</p>
<p>Pour en savoir plus sur les encastrements vectoriels, les données non structurées et les bases de données vectorielles, commencez par la série <a href="https://zilliz.com/blog?tag=39&amp;page=1">Base de données vectorielles 101</a>.</p>
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
    </button></h2><p>Les vecteurs sont un outil puissant pour travailler avec des données non structurées. Ils permettent de comparer mathématiquement différents éléments de données non structurées sur la base de la similarité sémantique. Le choix du bon modèle d'incorporation de vecteurs est essentiel pour construire un moteur de recherche vectoriel pour n'importe quelle application.</p>
<p>Dans ce billet, nous avons appris que les vector embeddings sont la représentation interne des données d'entrée dans un réseau neuronal. Par conséquent, ils dépendent fortement de l'architecture du réseau et des données utilisées pour former le modèle. Les différents types de données (tels que les images, le texte et l'audio) requièrent des modèles spécifiques. Heureusement, de nombreux modèles open source pré-entraînés sont disponibles. Dans cet article, nous avons abordé les modèles pour les cinq types de données les plus courants : images, texte, multimodal, audio et vidéo. De plus, si vous souhaitez utiliser au mieux les embeddings vectoriels, les bases de données vectorielles sont l'outil le plus populaire.</p>
