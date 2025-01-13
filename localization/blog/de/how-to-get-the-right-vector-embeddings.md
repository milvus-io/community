---
id: how-to-get-the-right-vector-embeddings.md
title: Wie man die richtigen Vektoreinbettungen erhält
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Eine umfassende Einführung in Vektoreinbettungen und wie man sie mit gängigen
  Open-Source-Modellen erzeugt.
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
<p><em>Dieser Artikel wurde ursprünglich in <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> veröffentlicht und wird hier mit Genehmigung wiederveröffentlicht.</em></p>
<p><strong>Eine umfassende Einführung in Vektoreinbettungen und wie man sie mit gängigen Open-Source-Modellen erzeugt.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Bild von Денис Марчук von Pixabay</span> </span></p>
<p>Vektoreinbettungen sind bei der Arbeit mit <a href="https://zilliz.com/blog/vector-similarity-search">semantischer Ähnlichkeit</a> von entscheidender Bedeutung. Ein Vektor ist jedoch einfach eine Reihe von Zahlen; eine Vektoreinbettung ist eine Reihe von Zahlen, die Eingabedaten darstellen. Mit Hilfe von Vektoreinbettungen können wir <a href="https://zilliz.com/blog/introduction-to-unstructured-data">unstrukturierte Daten</a> strukturieren oder mit jeder Art von Daten arbeiten, indem wir sie in eine Reihe von Zahlen umwandeln. Dieser Ansatz ermöglicht es uns, mathematische Operationen mit den Eingabedaten durchzuführen, anstatt uns auf qualitative Vergleiche zu verlassen.</p>
<p>Vektoreinbettungen sind für viele Aufgaben von Bedeutung, insbesondere für die <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a>. Es ist jedoch von entscheidender Bedeutung, dass man die geeigneten Vektoreinbettungen erhält, bevor man sie verwendet. Wenn Sie zum Beispiel ein Bildmodell verwenden, um Text zu vektorisieren, oder umgekehrt, werden Sie wahrscheinlich schlechte Ergebnisse erzielen.</p>
<p>In diesem Beitrag erfahren Sie, was Vektoreinbettungen bedeuten, wie Sie mit verschiedenen Modellen die richtigen Vektoreinbettungen für Ihre Anwendungen erzeugen und wie Sie Vektoreinbettungen mit Vektordatenbanken wie <a href="https://milvus.io/">Milvus</a> und <a href="https://zilliz.com/">Zilliz Cloud</a> optimal nutzen können.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Wie werden Vektoreinbettungen erstellt?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>Nachdem wir nun die Bedeutung von Vektoreinbettungen verstanden haben, wollen wir lernen, wie sie funktionieren. Eine Vektoreinbettung ist die interne Repräsentation von Eingabedaten in einem Deep-Learning-Modell, auch bekannt als Einbettungsmodelle oder ein tiefes neuronales Netzwerk. Wie extrahieren wir also diese Informationen?</p>
<p>Wir erhalten Vektoren, indem wir die letzte Schicht entfernen und die Ausgabe der vorletzten Schicht nehmen. Die letzte Schicht eines neuronalen Netzes gibt in der Regel die Vorhersage des Modells aus, daher nehmen wir die Ausgabe der vorletzten Schicht. Die Vektoreinbettung sind die Daten, die der Vorhersageschicht eines neuronalen Netzes zugeführt werden.</p>
<p>Die Dimensionalität einer Vektoreinbettung entspricht der Größe der vorletzten Schicht des Modells und ist somit austauschbar mit der Größe oder Länge des Vektors. Übliche Vektordimensionen sind 384 (generiert von Sentence Transformers Mini-LM), 768 (von Sentence Transformers MPNet), 1.536 (von OpenAI) und 2.048 (von ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">Was bedeutet eine Vektoreinbettung?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Jemand fragte mich einmal nach der Bedeutung der einzelnen Dimensionen in einer Vektoreinbettung. Die kurze Antwort lautet: nichts. Eine einzelne Dimension in einer Vektoreinbettung hat keine Bedeutung, da sie zu abstrakt ist, um ihre Bedeutung zu bestimmen. Nimmt man jedoch alle Dimensionen zusammen, ergeben sie die semantische Bedeutung der Eingabedaten.</p>
<p>Die Dimensionen des Vektors sind hochrangige, abstrakte Repräsentationen verschiedener Attribute. Welche Attribute dargestellt werden, hängt von den Trainingsdaten und dem Modell selbst ab. Text- und Bildmodelle erzeugen unterschiedliche Einbettungen, da sie für grundlegend unterschiedliche Datentypen trainiert wurden. Selbst unterschiedliche Textmodelle erzeugen unterschiedliche Einbettungen. Manchmal unterscheiden sie sich in der Größe, ein anderes Mal in den Attributen, die sie darstellen. Ein Modell, das für juristische Daten trainiert wurde, lernt beispielsweise andere Dinge als eines, das für Daten aus dem Gesundheitswesen trainiert wurde. Ich habe dieses Thema in meinem Beitrag <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">Vergleich von Vektoreinbettungen</a> untersucht.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Erzeugen der richtigen Vektoreinbettungen<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie erhält man die richtigen Vektoreinbettungen? Alles beginnt damit, die Art der Daten zu bestimmen, die Sie einbetten möchten. Dieser Abschnitt behandelt die Einbettung von fünf verschiedenen Datentypen: Bilder, Text, Audio, Videos und multimodale Daten. Alle Modelle, die wir hier vorstellen, sind quelloffen und stammen von Hugging Face oder PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Bildeinbettungen</h3><p>Die Bilderkennung erlebte 2012 mit dem Erscheinen von AlexNet einen wahren Höhenflug. Seitdem hat es im Bereich der Computer Vision zahlreiche Fortschritte gegeben. Das neueste bemerkenswerte Bilderkennungsmodell ist ResNet-50, ein tiefes Residualnetz mit 50 Schichten, das auf der früheren ResNet-34-Architektur basiert.</p>
<p>Residuale neuronale Netze (ResNet) lösen das Problem des verschwindenden Gradienten in tiefen neuronalen Faltungsnetzen mit Hilfe von Shortcut-Verbindungen. Diese Verbindungen ermöglichen es, dass die Ausgabe von früheren Schichten direkt an spätere Schichten weitergeleitet wird, ohne alle Zwischenschichten zu durchlaufen, wodurch das Problem des verschwindenden Gradienten vermieden wird. Durch dieses Design ist ResNet weniger komplex als VGGNet (Visual Geometry Group), ein früheres, sehr leistungsfähiges neuronales Faltungsnetz.</p>
<p>Ich empfehle zwei ResNet-50-Implementierungen als Beispiele: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 auf Hugging Face</a> und <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 auf PyTorch Hub</a>. Während die Netze gleich sind, unterscheidet sich das Verfahren zur Gewinnung von Einbettungen.</p>
<p>Das folgende Codebeispiel zeigt, wie PyTorch verwendet wird, um Vektoreinbettungen zu erhalten. Zunächst laden wir das Modell aus PyTorch Hub. Als nächstes entfernen wir die letzte Schicht und rufen <code translate="no">.eval()</code> auf, um das Modell anzuweisen, sich so zu verhalten, als würde es für die Inferenz laufen. Dann erzeugt die Funktion <code translate="no">embed</code> die Vektoreinbettung.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace verwendet einen etwas anderen Aufbau. Der folgende Code zeigt, wie man eine Vektoreinbettung von Hugging Face erhält. Zunächst benötigen wir einen Merkmalsextraktor und ein Modell aus der Bibliothek <code translate="no">transformers</code>. Wir werden den Feature Extractor verwenden, um Eingaben für das Modell zu erhalten, und das Modell verwenden, um Ausgaben zu erhalten und den letzten versteckten Zustand zu extrahieren.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">Texteinbettungen</h3><p>Ingenieure und Forscher haben seit der Erfindung der KI mit natürlicher Sprache und KI experimentiert. Zu den frühesten Experimenten gehören:</p>
<ul>
<li>ELIZA, der erste Chatbot für KI-Therapeuten.</li>
<li>John Searles Chinese Room, ein Gedankenexperiment, in dem untersucht wird, ob die Fähigkeit, zwischen Chinesisch und Englisch zu übersetzen, ein Verständnis der Sprache voraussetzt.</li>
<li>Regelbasierte Übersetzungen zwischen Englisch und Russisch.</li>
</ul>
<p>Der Umgang der KI mit natürlicher Sprache hat sich gegenüber ihrer regelbasierten Einbettung erheblich weiterentwickelt. Ausgehend von primären neuronalen Netzen fügten wir über RNNs Rekursionsbeziehungen hinzu, um zeitliche Schritte verfolgen zu können. Danach haben wir Transformatoren verwendet, um das Problem der Sequenztransduktion zu lösen.</p>
<p>Transformatoren bestehen aus einem Encoder, der eine Eingabe in eine Matrix kodiert, die den Zustand darstellt, einer Aufmerksamkeitsmatrix und einem Decoder. Der Dekodierer dekodiert den Zustand und die Aufmerksamkeitsmatrix, um das korrekte nächste Token zum Abschluss der Ausgabesequenz vorherzusagen. GPT-3, das bisher populärste Sprachmodell, besteht aus strengen Decodern. Sie kodieren die Eingabe und sagen das/die richtige(n) nächste(n) Token voraus.</p>
<p>Hier sind zwei Modelle aus der <code translate="no">sentence-transformers</code> Bibliothek von Hugging Face, die Sie zusätzlich zu OpenAIs Einbettungen verwenden können:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: ein 384-dimensionales Modell</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: ein 768-dimensionales Modell</li>
</ul>
<p>Sie können auf die Einbettungen beider Modelle auf die gleiche Weise zugreifen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Multimodale Einbettungen</h3><p>Multimodale Modelle sind weniger gut entwickelt als Bild- oder Textmodelle. Sie verknüpfen oft Bilder mit Text.</p>
<p>Das nützlichste Open-Source-Beispiel ist <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, ein Bild-Text-Modell. Sie können auf die Einbettungen von CLIP VIT auf die gleiche Weise zugreifen wie auf ein Bildmodell, wie im unten stehenden Code gezeigt.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">Audio-Einbettungen</h3><p>Der künstlichen Intelligenz für Audio wurde bisher weniger Aufmerksamkeit geschenkt als der künstlichen Intelligenz für Text oder Bilder. Der häufigste Anwendungsfall für Audio ist Sprache-zu-Text für Branchen wie Callcenter, Medizintechnik und Barrierefreiheit. Ein beliebtes Open-Source-Modell für Sprache-zu-Text ist <a href="https://huggingface.co/openai/whisper-large-v2">Whisper von OpenAI</a>. Der folgende Code zeigt, wie man Vektoreinbettungen aus dem Sprache-zu-Text-Modell erhält.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">Video-Einbettungen</h3><p>Videoeinbettungen sind komplexer als Audio- oder Bildeinbettungen. Bei der Arbeit mit Videos ist ein multimodaler Ansatz erforderlich, da sie synchronisierte Töne und Bilder enthalten. Ein beliebtes Videomodell ist der <a href="https://huggingface.co/deepmind/multimodal-perceiver">multimodale Perceiver</a> von DeepMind. Dieses <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">Notebook-Tutorial</a> zeigt, wie man das Modell zur Klassifizierung eines Videos verwendet.</p>
<p>Um die Einbettungen der Eingaben zu erhalten, verwenden Sie <code translate="no">outputs[1][-1].squeeze()</code> aus dem im Notizbuch gezeigten Code, anstatt die Ausgaben zu löschen. Ich hebe diesen Codeschnipsel in der Funktion <code translate="no">autoencode</code> hervor.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Speichern, Indizieren und Suchen von Vektoreinbettungen mit Vektordatenbanken<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Da wir nun wissen, was Vektoreinbettungen sind und wie man sie mit verschiedenen leistungsstarken Einbettungsmodellen erzeugt, stellt sich die nächste Frage, wie man sie speichern und nutzen kann. Vektordatenbanken sind die Antwort.</p>
<p>Vektordatenbanken wie <a href="https://zilliz.com/what-is-milvus">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a> wurden speziell für die Speicherung, Indizierung und Suche in riesigen Datensätzen mit unstrukturierten Daten durch Vektoreinbettungen entwickelt. Sie sind auch eine der wichtigsten Infrastrukturen für verschiedene KI-Stacks.</p>
<p>Vektordatenbanken verwenden in der Regel den Algorithmus <a href="https://zilliz.com/glossary/anns">"Approximate Nearest Neighbor" (ANN)</a>, um den räumlichen Abstand zwischen dem Abfragevektor und den in der Datenbank gespeicherten Vektoren zu berechnen. Je näher die beiden Vektoren beieinander liegen, desto relevanter sind sie. Dann findet der Algorithmus die besten k nächsten Nachbarn und liefert sie dem Nutzer.</p>
<p>Vektordatenbanken sind in Anwendungsfällen wie <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM Retrieval Augmented Generation</a> (RAG), Frage- und Antwortsystemen, Empfehlungssystemen, semantischen Suchen und Bild-, Video- und Audio-Ähnlichkeitssuchen beliebt.</p>
<p>Wenn Sie mehr über Vektoreinbettungen, unstrukturierte Daten und Vektordatenbanken erfahren möchten, sollten Sie mit der Serie <a href="https://zilliz.com/blog?tag=39&amp;page=1">Vector Database 101</a> beginnen.</p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektoren sind ein leistungsstarkes Werkzeug für die Arbeit mit unstrukturierten Daten. Mithilfe von Vektoren können wir verschiedene Teile von unstrukturierten Daten auf der Grundlage semantischer Ähnlichkeit mathematisch vergleichen. Die Wahl des richtigen Vektoreinbettungsmodells ist entscheidend für den Aufbau einer Vektorsuchmaschine für jede Anwendung.</p>
<p>In diesem Beitrag haben wir gelernt, dass Vektoreinbettungen die interne Repräsentation von Eingabedaten in einem neuronalen Netzwerk sind. Daher hängen sie in hohem Maße von der Netzwerkarchitektur und den zum Trainieren des Modells verwendeten Daten ab. Verschiedene Datentypen (z. B. Bilder, Text und Audio) erfordern spezifische Modelle. Glücklicherweise gibt es viele vortrainierte Open-Source-Modelle, die verwendet werden können. In diesem Beitrag haben wir Modelle für die fünf häufigsten Datentypen behandelt: Bilder, Text, multimodale Daten, Audio und Video. Wenn Sie die Vektoreinbettungen optimal nutzen möchten, sind Vektordatenbanken das beliebteste Werkzeug.</p>
