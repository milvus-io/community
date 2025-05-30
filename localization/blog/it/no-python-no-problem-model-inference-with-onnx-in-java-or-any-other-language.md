---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Nessun Python, nessun problema: inferenza di modelli con ONNX in Java o in
  qualsiasi altro linguaggio
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) è un ecosistema di strumenti per
  l'inferenza di modelli di reti neurali, indipendente dalla piattaforma.
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
<p>Costruire applicazioni di IA generativa non è mai stato così facile. Un ricco ecosistema di strumenti, modelli di IA e set di dati consente anche agli ingegneri del software non specializzati di costruire chatbot, generatori di immagini e altro ancora. Questi strumenti, per la maggior parte, sono realizzati per Python e si basano su PyTorch. Ma se non avete accesso a Python in produzione e dovete usare Java, Golang, Rust, C++ o un altro linguaggio?</p>
<p>Ci limiteremo all'inferenza del modello, compresi i modelli embedding e i modelli foundation; altre attività, come l'addestramento e la messa a punto del modello, non vengono in genere completate al momento della distribuzione. Quali sono le opzioni per l'inferenza dei modelli senza Python? La soluzione più ovvia è quella di utilizzare un servizio online di fornitori come Anthropic o Mistral. In genere forniscono un SDK per linguaggi diversi da Python e, se non lo facessero, basterebbero delle semplici chiamate API REST. Ma cosa succede se la nostra soluzione deve essere interamente locale, ad esempio per questioni di conformità o di privacy?</p>
<p>Un'altra soluzione è quella di eseguire un server Python in locale. Il problema iniziale era l'impossibilità di eseguire Python in produzione, quindi questo esclude l'uso di un server Python locale. Altre soluzioni locali simili saranno probabilmente soggette a restrizioni legali, di sicurezza o tecniche. <em>Abbiamo bisogno di una soluzione completamente contenuta che ci permetta di richiamare il modello direttamente da Java o da un altro linguaggio non Python.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Un Python si trasforma in una farfalla Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">Che cos'è ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) è un ecosistema di strumenti per l'inferenza di modelli di reti neurali, indipendente dalla piattaforma. È stato inizialmente sviluppato dal team PyTorch di Meta (allora Facebook), con ulteriori contributi da parte di Microsoft, IBM, Huawei, Intel, AMD, Arm e Qualcomm. Attualmente è un progetto open-source di proprietà della Linux Foundation for AI and Data. ONNX è il metodo de facto per la distribuzione di modelli di reti neurali indipendenti dalla piattaforma.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Grafico computazionale (parziale) di ONNX per un trasformatore NN</em></p>
<p><strong>Di solito usiamo "ONNX" in senso stretto per riferirci al suo formato di file.</strong> Un file di modello ONNX rappresenta un grafico computazionale, che spesso include i valori dei pesi di una funzione matematica, e lo standard definisce le operazioni comuni per le reti neurali. Si può pensare che sia simile al grafico computazionale creato quando si usa l'autodiff con PyTorch. Da un altro punto di vista, il formato di file ONNX funge da <em>rappresentazione intermedia</em> (IR) per le reti neurali, proprio come la compilazione del codice nativo, che prevede anch'essa una fase IR. Si veda l'illustrazione qui sopra che visualizza un grafo computazionale ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Una IR consente molte combinazioni di front-end e back-end.</em></p>
<p>Il formato di file ONNX è solo una parte dell'ecosistema ONNX, che comprende anche librerie per la manipolazione di grafi computazionali e librerie per il caricamento e l'esecuzione di file di modelli ONNX. Queste librerie coprono diversi linguaggi e piattaforme. Poiché ONNX è solo un IR (Intermediate Representation Language), è possibile applicare ottimizzazioni specifiche per una determinata piattaforma hardware prima di eseguirlo con codice nativo. La figura precedente illustra le combinazioni di front-end e back-end.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Flusso di lavoro ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>A scopo di discussione, esamineremo la possibilità di richiamare un modello di text embedding da Java, per esempio, in preparazione all'ingestione di dati nel database vettoriale open-source <a href="https://milvus.io/">Milvus</a>. Quindi, se vogliamo richiamare il nostro modello di incorporazione o di fondazione da Java, è semplice usare la libreria ONNX sul file del modello corrispondente? Sì, ma è necessario procurarsi i file sia per il modello che per l'encoder del tokenizer (e il decoder per i modelli di fondazione). Possiamo produrli noi stessi usando Python offline, cioè prima della produzione, come spieghiamo ora.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Esportare i modelli NN da Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Apriamo un modello di text embedding comune, <code translate="no">all-MiniLM-L6-v2</code>, da Python usando la libreria sentence-transformers di HuggingFace. Utilizzeremo la libreria HF indirettamente tramite la libreria util di .txtai, poiché abbiamo bisogno di un wrapper attorno a sentence-transformers che esporti anche i livelli di pooling e normalizzazione dopo la funzione di trasformazione. (Questi livelli prendono le incorporazioni di token dipendenti dal contesto, cioè l'output del trasformatore, e le trasformano in un'unica incorporazione di testo).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Indichiamo alla libreria di esportare <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> dall'hub del modello HuggingFace come ONNX, specificando il compito come text embedding e abilitando la quantizzazione del modello. La chiamata a <code translate="no">onnx_model()</code> scaricherà il modello dall'hub del modello, se non esiste già localmente, convertirà i tre livelli in ONNX e combinerà i loro grafi computazionali.</p>
<p>Siamo pronti a eseguire l'inferenza in Java? Non è così veloce. Il modello inserisce un elenco di token (o un elenco di elenchi per più di un campione) corrispondente alla tokenizzazione del testo che vogliamo incorporare. Pertanto, a meno che non si riesca a eseguire tutta la tokenizzazione prima della produzione, sarà necessario eseguire il tokenizzatore da Java.</p>
<p>Ci sono alcune opzioni per farlo. Una consiste nell'implementare o trovare un'implementazione del tokenizer per il modello in questione in Java o in un altro linguaggio e richiamarla da Java come libreria statica o a collegamento dinamico. Una soluzione più semplice è quella di convertire il tokenizer in un file ONNX e usarlo da Java, così come si usa il file ONNX del modello.</p>
<p>Il semplice ONNX, tuttavia, non contiene le operazioni necessarie per implementare il grafo computazionale di un tokenizer. Per questo motivo, Microsoft ha creato una libreria per aumentare ONNX, chiamata ONNXRuntime-Extensions. Essa definisce operazioni utili per ogni tipo di pre e postelaborazione dei dati, non solo per i tokenizer di testo.</p>
<p>Ecco come esportare il nostro tokenizzatore come file ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Abbiamo scartato il decodificatore del tokenizer, poiché l'incorporazione di frasi non lo richiede. Ora abbiamo due file: <code translate="no">tokenizer.onnx</code> per la tokenizzazione del testo e <code translate="no">model.onnx</code> per l'incorporazione di stringhe di token.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Inferenza del modello in Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>L'esecuzione del nostro modello da Java è ora banale. Ecco alcune linee di codice importanti dell'esempio completo:</p>
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
<p>Un esempio completo e funzionante si trova nella sezione delle risorse.</p>
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
    </button></h2><p>In questo post abbiamo visto come sia possibile esportare modelli open source dall'hub dei modelli di HuggingFace e utilizzarli direttamente da linguaggi diversi da Python. Notiamo, tuttavia, alcuni avvertimenti:</p>
<p>In primo luogo, le librerie ONNX e le estensioni runtime hanno diversi livelli di supporto delle funzionalità. Potrebbe non essere possibile utilizzare tutti i modelli in tutte le lingue fino al rilascio di un futuro aggiornamento dell'SDK. Le librerie runtime ONNX per Python, C++, Java e JavaScript sono le più complete.</p>
<p>In secondo luogo, l'hub HuggingFace contiene ONNX pre-esportati, ma questi modelli non includono i livelli finali di pooling e normalizzazione. È necessario sapere come funziona <code translate="no">sentence-transformers</code> se si intende utilizzare direttamente <code translate="no">torch.onnx</code>.</p>
<p>Ciononostante, ONNX gode dell'appoggio dei principali leader del settore ed è in procinto di diventare un mezzo senza attriti per l'IA generativa multipiattaforma.</p>
<h2 id="Resources" class="common-anchor-header">Risorse<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Esempi di codice ONNX in Python e Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
