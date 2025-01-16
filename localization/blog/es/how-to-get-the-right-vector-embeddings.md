---
id: how-to-get-the-right-vector-embeddings.md
title: Cómo obtener las incrustaciones vectoriales adecuadas
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Una introducción completa a las incrustaciones vectoriales y cómo generarlas
  con modelos populares de código abierto.
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
<p><em>Este artículo se publicó originalmente en <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> y se publica aquí con permiso.</em></p>
<p><strong>Una introducción completa a las incrustaciones vectoriales y cómo generarlas con modelos populares de código abierto.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Imagen de Денис Марчук de Pixabay</span> </span></p>
<p>Las incrustaciones vectoriales son fundamentales cuando se trabaja con <a href="https://zilliz.com/blog/vector-similarity-search">similitud semántica</a>. Sin embargo, un vector es simplemente una serie de números; una incrustación vectorial es una serie de números que representan datos de entrada. Con las incrustaciones vectoriales podemos estructurar <a href="https://zilliz.com/blog/introduction-to-unstructured-data">datos no estructurados</a> o trabajar con cualquier tipo de datos convirtiéndolos en una serie de números. Este enfoque nos permite realizar operaciones matemáticas con los datos de entrada, en lugar de basarnos en comparaciones cualitativas.</p>
<p>Las incrustaciones vectoriales influyen en muchas tareas, sobre todo en la <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a>. Sin embargo, es crucial obtener las incrustaciones vectoriales adecuadas antes de utilizarlas. Por ejemplo, si se utiliza un modelo de imagen para vectorizar texto, o viceversa, probablemente se obtendrán malos resultados.</p>
<p>En este post, aprenderemos qué significan las incrustaciones vectoriales, cómo generar las incrustaciones vectoriales adecuadas para sus aplicaciones utilizando diferentes modelos y cómo hacer el mejor uso de las incrustaciones vectoriales con bases de datos vectoriales como <a href="https://milvus.io/">Milvus</a> y <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">¿Cómo se crean las incrustaciones vectoriales?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>Ahora que entendemos la importancia de las incrustaciones vectoriales, aprendamos cómo funcionan. Una incrustación vectorial es la representación interna de los datos de entrada en un modelo de aprendizaje profundo, también conocido como modelos de incrustación o red neuronal profunda. Entonces, ¿cómo extraemos esta información?</p>
<p>Obtenemos los vectores eliminando la última capa y tomando la salida de la penúltima capa. La última capa de una red neuronal suele emitir la predicción del modelo, así que tomamos la salida de la penúltima capa. La incrustación vectorial son los datos que se introducen en la capa de predicción de una red neuronal.</p>
<p>La dimensionalidad de un vector es equivalente al tamaño de la penúltima capa del modelo y, por tanto, intercambiable con el tamaño o longitud del vector. Las dimensiones de vector más comunes son 384 (generado por Sentence Transformers Mini-LM), 768 (por Sentence Transformers MPNet), 1.536 (por OpenAI) y 2.048 (por ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">¿Qué significa incrustación vectorial?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Alguien me preguntó una vez qué significaba cada dimensión de una incrustación vectorial. La respuesta corta es nada. Una sola dimensión de una incrustación vectorial no significa nada, ya que es demasiado abstracta para determinar su significado. Sin embargo, cuando tomamos todas las dimensiones juntas, proporcionan el significado semántico de los datos de entrada.</p>
<p>Las dimensiones del vector son representaciones abstractas de alto nivel de distintos atributos. Los atributos representados dependen de los datos de entrenamiento y del propio modelo. Los modelos de texto e imagen generan incrustaciones diferentes porque están entrenados para tipos de datos fundamentalmente distintos. Incluso los distintos modelos de texto generan incrustaciones diferentes. A veces difieren en tamaño; otras, en los atributos que representan. Por ejemplo, un modelo entrenado para datos jurídicos aprenderá cosas distintas que otro entrenado para datos sanitarios. Exploré este tema en mi post <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">Comparación de incrustaciones vectoriales</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Generar las incrustaciones vectoriales adecuadas<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>¿Cómo se obtienen las incrustaciones vectoriales adecuadas? Todo comienza con la identificación del tipo de datos que se desea incrustar. Esta sección cubre la incrustación de cinco tipos diferentes de datos: imágenes, texto, audio, vídeos y datos multimodales. Todos los modelos que presentamos aquí son de código abierto y proceden de Hugging Face o PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Incrustación de imágenes</h3><p>El reconocimiento de imágenes despegó en 2012 tras la aparición de AlexNet. Desde entonces, el campo de la visión por ordenador ha experimentado numerosos avances. El último modelo notable de reconocimiento de imágenes es ResNet-50, una red residual profunda de 50 capas basada en la antigua arquitectura ResNet-34.</p>
<p>Las redes neuronales residuales (ResNet) resuelven el problema del gradiente de fuga en las redes neuronales convolucionales profundas mediante conexiones de atajo. Estas conexiones permiten que la salida de las capas anteriores vaya directamente a las capas posteriores sin pasar por todas las capas intermedias, evitando así el problema del gradiente evanescente. Este diseño hace que ResNet sea menos compleja que VGGNet (Visual Geometry Group), una red neuronal convolucional que hasta ahora había obtenido los mejores resultados.</p>
<p>Recomiendo dos implementaciones de ResNet-50 como ejemplos: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 en Hugging Face</a> y <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 en PyTorch Hub</a>. Aunque las redes son las mismas, el proceso de obtención de incrustaciones difiere.</p>
<p>El siguiente ejemplo de código muestra cómo utilizar PyTorch para obtener incrustaciones vectoriales. En primer lugar, cargamos el modelo desde PyTorch Hub. A continuación, eliminamos la última capa y llamamos a <code translate="no">.eval()</code> para indicar al modelo que se comporte como si se estuviera ejecutando para la inferencia. A continuación, la función <code translate="no">embed</code> genera la incrustación vectorial.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace utiliza una configuración ligeramente diferente. El siguiente código muestra cómo obtener una incrustación vectorial de Hugging Face. En primer lugar, necesitamos un extractor de características y un modelo de la biblioteca <code translate="no">transformers</code>. Utilizaremos el extractor de características para obtener entradas para el modelo y utilizaremos el modelo para obtener salidas y extraer el último estado oculto.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">Incrustación de texto</h3><p>Los ingenieros e investigadores han estado experimentando con el lenguaje natural y la IA desde la invención de la IA. Algunos de los primeros experimentos son:</p>
<ul>
<li>ELIZA, el primer chatbot terapeuta de IA.</li>
<li>La habitación china de John Searle, un experimento mental que examina si la capacidad de traducir entre chino e inglés requiere una comprensión del idioma.</li>
<li>Traducciones entre inglés y ruso basadas en reglas.</li>
</ul>
<p>El funcionamiento de la IA en el lenguaje natural ha evolucionado significativamente a partir de sus incrustaciones basadas en reglas. Empezando con redes neuronales primarias, añadimos relaciones de recurrencia mediante RNN para seguir los pasos en el tiempo. A partir de ahí, utilizamos transformadores para resolver el problema de la transducción de secuencias.</p>
<p>Los transformadores constan de un codificador, que codifica una entrada en una matriz que representa el estado, una matriz de atención y un decodificador. El decodificador descodifica el estado y la matriz de atención para predecir el siguiente token correcto y terminar la secuencia de salida. GPT-3, el modelo lingüístico más popular hasta la fecha, consta de decodificadores estrictos. Codifican la entrada y predicen el siguiente token o tokens correctos.</p>
<p>Aquí tienes dos modelos de la biblioteca <code translate="no">sentence-transformers</code> de Hugging Face que puedes utilizar además de los embeddings de OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: un modelo de 384 dimensiones</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: un modelo de 768 dimensiones</li>
</ul>
<p>Puede acceder a las incrustaciones de ambos modelos de la misma manera.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Incrustaciones multimodales</h3><p>Los modelos multimodales están menos desarrollados que los de imagen o texto. Suelen relacionar imágenes con texto.</p>
<p>El ejemplo de código abierto más útil es <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, un modelo de imagen a texto. Puede acceder a las incrustaciones de CLIP VIT del mismo modo que lo haría con un modelo de imagen, como se muestra en el código siguiente.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">Incrustación de audio</h3><p>La IA para audio ha recibido menos atención que la IA para texto o imágenes. El caso de uso más común para el audio es la conversión de voz a texto en sectores como los centros de llamadas, la tecnología médica y la accesibilidad. Un modelo popular de código abierto para la conversión de voz a texto es <a href="https://huggingface.co/openai/whisper-large-v2">Whisper de OpenAI</a>. El siguiente código muestra cómo obtener incrustaciones vectoriales a partir del modelo de voz a texto.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">Incrustaciones de vídeo</h3><p>Las incrustaciones de vídeo son más complejas que las de audio o imagen. Es necesario un enfoque multimodal cuando se trabaja con vídeos, ya que incluyen audio e imágenes sincronizadas. Un modelo de vídeo popular es el <a href="https://huggingface.co/deepmind/multimodal-perceiver">perceptor multimodal</a> de DeepMind. Este <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">tutorial</a> muestra cómo utilizar el modelo para clasificar un vídeo.</p>
<p>Para obtener las incrustaciones de la entrada, utilice <code translate="no">outputs[1][-1].squeeze()</code> del código que se muestra en el cuaderno en lugar de eliminar las salidas. Resalto este fragmento de código en la función <code translate="no">autoencode</code>.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Almacenamiento, indexación y búsqueda de incrustaciones vectoriales con bases de datos vectoriales<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que entendemos qué son las incrustaciones vectoriales y cómo generarlas utilizando varios modelos de incrustación potentes, la siguiente pregunta es cómo almacenarlas y aprovecharlas. Las bases de datos vectoriales son la respuesta.</p>
<p>Las bases de datos vectoriales, como <a href="https://zilliz.com/what-is-milvus">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, se han creado específicamente para almacenar, indexar y buscar conjuntos masivos de datos no estructurados mediante incrustaciones vectoriales. También son una de las infraestructuras más importantes para varias pilas de IA.</p>
<p>Las bases de datos vectoriales suelen utilizar el algoritmo <a href="https://zilliz.com/glossary/anns">del vecino más próximo aproximado (RNA</a> ) para calcular la distancia espacial entre el vector de consulta y los vectores almacenados en la base de datos. Cuanto más cerca se encuentren los dos vectores, más relevantes son. A continuación, el algoritmo encuentra los k vectores más próximos y se los entrega al usuario.</p>
<p>Las bases de datos vectoriales son populares en casos de uso como <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">la generación aumentada de recuperación LLM</a> (RAG), los sistemas de preguntas y respuestas, los sistemas de recomendación, las búsquedas semánticas y las búsquedas por similitud de imágenes, vídeo y audio.</p>
<p>Para obtener más información sobre incrustaciones vectoriales, datos no estructurados y bases de datos vectoriales, considere la posibilidad de comenzar con la serie <a href="https://zilliz.com/blog?tag=39&amp;page=1">Base de datos vectoriales 101</a>.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Los vectores son una poderosa herramienta para trabajar con datos no estructurados. Utilizando vectores, podemos comparar matemáticamente diferentes piezas de datos no estructurados basándonos en la similitud semántica. Elegir el modelo de incrustación vectorial adecuado es fundamental para construir un motor de búsqueda vectorial para cualquier aplicación.</p>
<p>En este post, aprendimos que las incrustaciones vectoriales son la representación interna de los datos de entrada en una red neuronal. Como resultado, dependen en gran medida de la arquitectura de la red y de los datos utilizados para entrenar el modelo. Diferentes tipos de datos (como imágenes, texto y audio) requieren modelos específicos. Afortunadamente, hay muchos modelos de código abierto preentrenados disponibles para su uso. En este post, cubrimos los modelos para los cinco tipos de datos más comunes: imágenes, texto, multimodal, audio y vídeo. Además, si quieres aprovechar al máximo las incrustaciones vectoriales, las bases de datos vectoriales son la herramienta más popular.</p>
