---
id: how-to-get-the-right-vector-embeddings.md
title: Come ottenere le giuste incorporazioni vettoriali
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Un'introduzione completa alle incorporazioni vettoriali e a come generarle con
  i più diffusi modelli open-source.
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
<p><em>Questo articolo è stato pubblicato originariamente su <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> e viene ripubblicato qui con l'autorizzazione.</em></p>
<p><strong>Un'introduzione completa alle incorporazioni vettoriali e a come generarle con i più diffusi modelli open source.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Immagine di Денис Марчук da Pixabay</span> </span></p>
<p>Le incorporazioni vettoriali sono fondamentali quando si lavora con la <a href="https://zilliz.com/blog/vector-similarity-search">similarità semantica</a>. Tuttavia, un vettore è semplicemente una serie di numeri; un embedding vettoriale è una serie di numeri che rappresentano i dati di input. Utilizzando le incorporazioni vettoriali, possiamo strutturare <a href="https://zilliz.com/blog/introduction-to-unstructured-data">dati non strutturati</a> o lavorare con qualsiasi tipo di dati convertendoli in una serie di numeri. Questo approccio ci permette di eseguire operazioni matematiche sui dati in ingresso, anziché affidarci a confronti qualitativi.</p>
<p>Le incorporazioni vettoriali sono influenti per molti compiti, in particolare per la <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a>. Tuttavia, è fondamentale ottenere le incorporazioni vettoriali appropriate prima di utilizzarle. Ad esempio, se si utilizza un modello di immagine per vettorializzare il testo, o viceversa, probabilmente si otterranno scarsi risultati.</p>
<p>In questo post scopriremo cosa significano le incorporazioni vettoriali, come generare le incorporazioni vettoriali giuste per le vostre applicazioni utilizzando diversi modelli e come utilizzare al meglio le incorporazioni vettoriali con database vettoriali come <a href="https://milvus.io/">Milvus</a> e <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Come vengono creati gli embeddings vettoriali?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>Ora che abbiamo capito l'importanza degli embedding vettoriali, impariamo a capire come funzionano. Un embedding vettoriale è la rappresentazione interna dei dati di input in un modello di deep learning, noto anche come modello di embedding o rete neurale profonda. Come si estraggono queste informazioni?</p>
<p>Otteniamo i vettori rimuovendo l'ultimo strato e prendendo l'output del penultimo strato. L'ultimo strato di una rete neurale solitamente produce la previsione del modello, quindi prendiamo l'output del penultimo strato. L'embedding vettoriale è il dato che alimenta lo strato predittivo di una rete neurale.</p>
<p>La dimensionalità di un embedding vettoriale è equivalente alla dimensione del penultimo strato del modello e, pertanto, è intercambiabile con la dimensione o la lunghezza del vettore. Le dimensioni comuni dei vettori sono 384 (generate da Sentence Transformers Mini-LM), 768 (da Sentence Transformers MPNet), 1.536 (da OpenAI) e 2.048 (da ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">Cosa significa embedding vettoriale?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta qualcuno mi ha chiesto il significato di ciascuna dimensione di un embedding vettoriale. La risposta breve è: niente. Una singola dimensione in un embedding vettoriale non significa nulla, perché è troppo astratta per determinarne il significato. Tuttavia, se consideriamo tutte le dimensioni insieme, esse forniscono il significato semantico dei dati in ingresso.</p>
<p>Le dimensioni del vettore sono rappresentazioni astratte di alto livello di diversi attributi. Gli attributi rappresentati dipendono dai dati di addestramento e dal modello stesso. I modelli di testo e di immagine generano embeddings diversi perché sono addestrati per tipi di dati fondamentalmente diversi. Anche modelli di testo diversi generano embeddings diversi. A volte differiscono per le dimensioni, altre volte per gli attributi che rappresentano. Per esempio, un modello addestrato su dati legali imparerà cose diverse da uno addestrato su dati sanitari. Ho esplorato questo argomento nel mio post <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">sul confronto delle incorporazioni vettoriali</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Generare le giuste incorporazioni vettoriali<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Come si ottengono le giuste incorporazioni vettoriali? Tutto inizia con l'identificazione del tipo di dati che si desidera incorporare. Questa sezione tratta l'incorporazione di cinque diversi tipi di dati: immagini, testo, audio, video e dati multimodali. Tutti i modelli che presentiamo sono open source e provengono da Hugging Face o PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Incorporazione di immagini</h3><p>Il riconoscimento delle immagini è decollato nel 2012, dopo la comparsa di AlexNet. Da allora, il campo della computer vision ha visto numerosi progressi. L'ultimo modello di riconoscimento delle immagini degno di nota è ResNet-50, una rete residuale profonda a 50 strati basata sull'architettura precedente ResNet-34.</p>
<p>Le reti neurali residue (ResNet) risolvono il problema del gradiente che svanisce nelle reti neurali convoluzionali profonde utilizzando connessioni di tipo shortcut. Queste connessioni permettono all'output degli strati precedenti di andare direttamente agli strati successivi senza passare per tutti gli strati intermedi, evitando così il problema del gradiente che svanisce. Questo design rende ResNet meno complessa di VGGNet (Visual Geometry Group), una rete neurale convoluzionale dalle prestazioni eccellenti.</p>
<p>Vi propongo due implementazioni di ResNet-50 come esempi: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 su Hugging Face</a> e <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 su PyTorch Hub</a>. Mentre le reti sono le stesse, il processo per ottenere le incorporazioni è diverso.</p>
<p>L'esempio di codice che segue mostra come utilizzare PyTorch per ottenere le incorporazioni vettoriali. Innanzitutto, si carica il modello da PyTorch Hub. Quindi, si rimuove l'ultimo strato e si chiama <code translate="no">.eval()</code> per istruire il modello a comportarsi come se fosse in esecuzione per l'inferenza. Quindi, la funzione <code translate="no">embed</code> genera l'incorporazione vettoriale.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace utilizza una configurazione leggermente diversa. Il codice seguente mostra come ottenere un embedding vettoriale da Hugging Face. Per prima cosa, abbiamo bisogno di un estrattore di caratteristiche e di un modello dalla libreria <code translate="no">transformers</code>. Useremo l'estrattore di caratteristiche per ottenere gli input per il modello e useremo il modello per ottenere gli output ed estrarre l'ultimo stato nascosto.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">Incorporazione del testo</h3><p>Ingegneri e ricercatori hanno sperimentato il linguaggio naturale e l'IA fin dall'invenzione dell'IA. Tra i primi esperimenti ricordiamo:</p>
<ul>
<li>ELIZA, il primo chatbot terapista AI.</li>
<li>La stanza cinese di John Searle, un esperimento di pensiero che esamina se la capacità di tradurre tra cinese e inglese richieda una comprensione della lingua.</li>
<li>Traduzioni basate su regole tra inglese e russo.</li>
</ul>
<p>Il funzionamento dell'intelligenza artificiale sul linguaggio naturale si è evoluto in modo significativo rispetto alle sue incorporazioni basate su regole. Partendo dalle reti neurali primarie, abbiamo aggiunto le relazioni di ricorrenza attraverso le RNN per tenere traccia dei passaggi nel tempo. Da lì, abbiamo utilizzato i trasformatori per risolvere il problema della trasduzione delle sequenze.</p>
<p>I trasformatori sono costituiti da un codificatore, che codifica un ingresso in una matrice che rappresenta lo stato, una matrice di attenzione e un decodificatore. Il decodificatore decodifica lo stato e la matrice di attenzione per prevedere il token successivo corretto per terminare la sequenza in uscita. Il GPT-3, il modello linguistico più diffuso ad oggi, comprende decodificatori rigidi. Essi codificano l'input e predicono il token successivo corretto.</p>
<p>Ecco due modelli della libreria <code translate="no">sentence-transformers</code> di Hugging Face che possono essere utilizzati in aggiunta agli embeddings di OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: un modello a 384 dimensioni</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: un modello a 768 dimensioni.</li>
</ul>
<p>È possibile accedere agli embeddings di entrambi i modelli nello stesso modo.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Incorporazione multimodale</h3><p>I modelli multimodali sono meno sviluppati dei modelli di immagini o di testo. Spesso mettono in relazione immagini e testo.</p>
<p>L'esempio open source più utile è <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, un modello immagine-testo. È possibile accedere agli embeddings di CLIP VIT nello stesso modo in cui si accede a un modello di immagini, come mostrato nel codice sottostante.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">Incorporazioni audio</h3><p>L'intelligenza artificiale per l'audio ha ricevuto meno attenzione di quella per il testo o le immagini. Il caso d'uso più comune per l'audio è il speech-to-text per settori come i call center, la tecnologia medica e l'accessibilità. Un modello open source molto diffuso per il speech-to-text è <a href="https://huggingface.co/openai/whisper-large-v2">Whisper di OpenAI</a>. Il codice seguente mostra come ottenere le incorporazioni vettoriali dal modello speech-to-text.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">Incorporazioni video</h3><p>Le incorporazioni di video sono più complesse di quelle di audio e immagini. Un approccio multimodale è necessario quando si lavora con i video, poiché questi includono audio e immagini sincronizzate. Un modello video molto diffuso è il <a href="https://huggingface.co/deepmind/multimodal-perceiver">multimodal perceiver</a> di DeepMind. Questo <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">tutorial</a> mostra come utilizzare il modello per classificare un video.</p>
<p>Per ottenere le incorporazioni dell'input, utilizzare <code translate="no">outputs[1][-1].squeeze()</code> dal codice mostrato nel notebook invece di eliminare le uscite. Evidenzio questo frammento di codice nella funzione <code translate="no">autoencode</code>.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Memorizzazione, indicizzazione e ricerca delle incorporazioni vettoriali con i database vettoriali<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo capito cosa sono le incorporazioni vettoriali e come generarle utilizzando vari modelli di incorporazioni potenti, la domanda successiva è come memorizzarle e sfruttarle. I database vettoriali sono la risposta.</p>
<p>I database vettoriali, come <a href="https://zilliz.com/what-is-milvus">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, sono costruiti appositamente per archiviare, indicizzare e ricercare tra enormi insiemi di dati non strutturati tramite embedding vettoriali. Sono anche una delle infrastrutture più critiche per vari stack di IA.</p>
<p>I database vettoriali di solito utilizzano l'algoritmo <a href="https://zilliz.com/glossary/anns">Approximate Nearest Neighbor (ANN)</a> per calcolare la distanza spaziale tra il vettore interrogato e i vettori memorizzati nel database. Più i due vettori sono vicini, più sono rilevanti. L'algoritmo trova quindi i k vettori più vicini e li fornisce all'utente.</p>
<p>I database vettoriali sono molto diffusi in casi d'uso come la <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generazione aumentata di recupero LLM</a> (RAG), i sistemi di domande e risposte, i sistemi di raccomandazione, le ricerche semantiche e le ricerche di somiglianza di immagini, video e audio.</p>
<p>Per saperne di più sulle incorporazioni vettoriali, sui dati non strutturati e sui database vettoriali, si consiglia di iniziare con la serie <a href="https://zilliz.com/blog?tag=39&amp;page=1">Vector Database 101</a>.</p>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>I vettori sono uno strumento potente per lavorare con i dati non strutturati. Utilizzando i vettori, possiamo confrontare matematicamente diversi pezzi di dati non strutturati in base alla somiglianza semantica. La scelta del giusto modello di incorporazione vettoriale è fondamentale per costruire un motore di ricerca vettoriale per qualsiasi applicazione.</p>
<p>In questo post abbiamo appreso che le incorporazioni vettoriali sono la rappresentazione interna dei dati in ingresso in una rete neurale. Di conseguenza, dipendono fortemente dall'architettura della rete e dai dati utilizzati per addestrare il modello. Diversi tipi di dati (come immagini, testo e audio) richiedono modelli specifici. Fortunatamente, sono disponibili molti modelli open source preaddestrati. In questo post abbiamo trattato i modelli per i cinque tipi di dati più comuni: immagini, testo, multimodale, audio e video. Inoltre, se si desidera utilizzare al meglio le incorporazioni vettoriali, i database vettoriali sono lo strumento più diffuso.</p>
