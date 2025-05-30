---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Kein Python, kein Problem: Modellinferenz mit ONNX in Java oder einer anderen
  Sprache
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) ist ein plattformunabhängiges Ökosystem
  von Tools für die Inferenz von neuronalen Netzwerkmodellen.
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
<p>Es war noch nie so einfach, generative KI-Anwendungen zu entwickeln. Ein reichhaltiges Ökosystem von Tools, KI-Modellen und Datensätzen ermöglicht es auch nicht spezialisierten Softwareingenieuren, beeindruckende Chatbots, Bildgeneratoren und vieles mehr zu erstellen. Diese Werkzeuge sind größtenteils für Python entwickelt worden und bauen auf PyTorch auf. Aber was ist, wenn Sie in der Produktion keinen Zugang zu Python haben und Java, Golang, Rust, C++ oder eine andere Sprache verwenden müssen?</p>
<p>Wir beschränken uns auf die Modellinferenz, einschließlich der Einbettung von Modellen und Basismodellen; andere Aufgaben, wie z. B. Modelltraining und Feinabstimmung, werden in der Regel zum Zeitpunkt der Bereitstellung nicht abgeschlossen. Welche Möglichkeiten haben wir für die Modellinferenz ohne Python? Die naheliegendste Lösung ist die Nutzung eines Online-Dienstes von Anbietern wie Anthropic oder Mistral. Sie bieten in der Regel ein SDK für andere Sprachen als Python an, und wenn nicht, wären nur einfache REST-API-Aufrufe erforderlich. Was aber, wenn unsere Lösung aus Gründen der Einhaltung von Vorschriften oder des Datenschutzes vollständig lokal sein muss?</p>
<p>Eine andere Lösung besteht darin, einen Python-Server lokal zu betreiben. Das ursprüngliche Problem bestand darin, dass Python nicht in der Produktion eingesetzt werden kann, was die Verwendung eines lokalen Python-Servers ausschließt. Ähnliche lokale Lösungen werden wahrscheinlich unter ähnlichen rechtlichen, sicherheitstechnischen oder technischen Einschränkungen leiden. <em>Wir benötigen eine vollständig geschlossene Lösung, die es uns ermöglicht, das Modell direkt aus Java oder einer anderen Nicht-Python-Sprache aufzurufen.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 1: Eine Python-Metamorphose in einen Onyx-Schmetterling.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">Was ist ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) ist ein plattformunabhängiges Ökosystem von Tools für die Inferenz von neuronalen Netzwerkmodellen. Es wurde ursprünglich vom PyTorch-Team bei Meta (damals Facebook) entwickelt, mit weiteren Beiträgen von Microsoft, IBM, Huawei, Intel, AMD, Arm und Qualcomm. Derzeit ist es ein Open-Source-Projekt, das der Linux Foundation for AI and Data gehört. ONNX ist die De-facto-Methode für die Verteilung von plattformunabhängigen neuronalen Netzwerkmodellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 2: Ein (partieller) ONNX-Berechnungsgraph für einen NN-Transformer</em></p>
<p><strong>Wir verwenden "ONNX" normalerweise im engeren Sinne, um das Dateiformat zu bezeichnen.</strong> Eine ONNX-Modelldatei stellt einen Berechnungsgraphen dar, der oft die Gewichtungswerte einer mathematischen Funktion enthält, und der Standard definiert allgemeine Operationen für neuronale Netze. Man kann es sich ähnlich vorstellen wie den Berechnungsgraphen, der bei der Verwendung von Autodiff mit PyTorch erstellt wird. Aus einem anderen Blickwinkel betrachtet, dient das ONNX-Dateiformat als <em>Zwischendarstellung</em> (IR) für neuronale Netze, ähnlich wie bei der Kompilierung von nativem Code, die ebenfalls einen IR-Schritt beinhaltet. In der obigen Abbildung wird ein ONNX-Rechengraph dargestellt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 3: Eine IR ermöglicht viele Kombinationen von Front-Ends und Back-Ends</em></p>
<p>Das ONNX-Dateiformat ist nur ein Teil des ONNX-Ökosystems, das auch Bibliotheken zur Bearbeitung von Berechnungsgraphen und Bibliotheken zum Laden und Ausführen von ONNX-Modelldateien umfasst. Diese Bibliotheken sind sprach- und plattformübergreifend. Da ONNX nur eine IR (Intermediate Representation Language) ist, können Optimierungen, die für eine bestimmte Hardwareplattform spezifisch sind, angewendet werden, bevor sie mit nativem Code ausgeführt werden. Die obige Abbildung veranschaulicht die Kombinationen von Front-Ends und Back-Ends.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">ONNX-Arbeitsablauf<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Zu Diskussionszwecken werden wir den Aufruf eines Texteinbettungsmodells von Java aus untersuchen, z. B. als Vorbereitung für die Dateneingabe in die Open-Source-Vektordatenbank <a href="https://milvus.io/">Milvus</a>. Wenn wir also unser Einbettungs- oder Grundmodell von Java aus aufrufen wollen, ist es dann so einfach wie die Verwendung der ONNX-Bibliothek für die entsprechende Modelldatei? Ja, aber wir müssen sowohl für das Modell als auch für den Tokenizer-Encoder (und den Decoder für Basismodelle) Dateien beschaffen. Diese können wir selbst mit Python offline, d. h. vor der Produktion, erstellen, was wir jetzt erklären.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Exportieren von NN-Modellen aus Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Öffnen wir ein gängiges Texteinbettungsmodell, <code translate="no">all-MiniLM-L6-v2</code>, aus Python unter Verwendung der Satztransformatoren-Bibliothek von HuggingFace. Wir werden die HF-Bibliothek indirekt über die util-Bibliothek von .txtai verwenden, da wir einen Wrapper um sentence-transformers benötigen, der auch die Pooling- und Normalisierungsschichten nach der Transformatorfunktion exportiert. (Diese Schichten nehmen die kontextabhängigen Token-Einbettungen, d. h. die Ausgabe des Transformators, und transformieren sie in eine einzige Texteinbettung).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Wir weisen die Bibliothek an, <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> aus dem HuggingFace-Modell-Hub als ONNX zu exportieren, wobei wir die Aufgabe als Texteinbettung spezifizieren und die Modellquantisierung aktivieren. Der Aufruf von <code translate="no">onnx_model()</code> lädt das Modell von der Modell-Drehscheibe herunter, wenn es nicht bereits lokal vorhanden ist, konvertiert die drei Schichten in ONNX und kombiniert ihre Berechnungsgraphen.</p>
<p>Sind wir nun bereit, Inferenzen in Java durchzuführen? Nicht ganz so schnell. Das Modell gibt eine Liste von Token ein (oder eine Liste von Listen für mehr als eine Probe), die der Tokenisierung des Textes entspricht, den wir einbetten wollen. Daher müssen wir den Tokenizer in Java ausführen, es sei denn, wir können die Tokenisierung vor der Produktionszeit durchführen.</p>
<p>Hierfür gibt es mehrere Möglichkeiten. Eine davon besteht darin, den Tokenizer für das betreffende Modell in Java oder einer anderen Sprache zu implementieren oder eine solche Implementierung zu finden und sie von Java aus als statische oder dynamisch gelinkte Bibliothek aufzurufen. Eine einfachere Lösung besteht darin, den Tokenizer in eine ONNX-Datei zu konvertieren und sie von Java aus zu verwenden, so wie wir die ONNX-Datei des Modells verwenden.</p>
<p>Einfaches ONNX enthält jedoch nicht die notwendigen Operationen, um den Berechnungsgraphen eines Tokenizers zu implementieren. Aus diesem Grund hat Microsoft eine Bibliothek zur Erweiterung von ONNX namens ONNXRuntime-Extensions entwickelt. Sie definiert nützliche Operationen für alle Arten der Datenvor- und -nachverarbeitung, nicht nur für Text-Tokenizer.</p>
<p>Hier sehen Sie, wie wir unseren Tokenizer als ONNX-Datei exportieren:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Wir haben den Decoder des Tokenizers weggelassen, da er für die Einbettung von Sätzen nicht benötigt wird. Jetzt haben wir zwei Dateien: <code translate="no">tokenizer.onnx</code> für die Tokenisierung von Text und <code translate="no">model.onnx</code> für die Einbettung von Zeichenketten von Token.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Modellinferenz in Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Ausführung unseres Modells in Java ist nun trivial. Hier sind einige der wichtigsten Codezeilen aus dem vollständigen Beispiel:</p>
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
<p>Ein vollständiges Arbeitsbeispiel finden Sie im Abschnitt Ressourcen.</p>
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
    </button></h2><p>In diesem Beitrag haben wir gesehen, wie es möglich ist, Open-Source-Modelle aus dem Model Hub von HuggingFace zu exportieren und sie direkt in anderen Sprachen als Python zu verwenden. Dabei sind jedoch einige Einschränkungen zu beachten:</p>
<p>Erstens haben die ONNX-Bibliotheken und Laufzeit-Erweiterungen einen unterschiedlichen Grad an Funktionsunterstützung. Es ist möglicherweise nicht möglich, alle Modelle in allen Sprachen zu verwenden, bis ein zukünftiges SDK-Update veröffentlicht wird. Die ONNX-Laufzeitbibliotheken für Python, C++, Java und JavaScript sind die umfassendsten.</p>
<p>Zweitens enthält der HuggingFace-Hub bereits exportiertes ONNX, aber diese Modelle enthalten nicht die endgültigen Pooling- und Normalisierungsschichten. Sie sollten wissen, wie <code translate="no">sentence-transformers</code> funktioniert, wenn Sie <code translate="no">torch.onnx</code> direkt verwenden möchten.</p>
<p>Nichtsdestotrotz wird ONNX von wichtigen Branchenführern unterstützt und ist auf dem besten Weg, ein reibungsloses Mittel für plattformübergreifende generative KI zu werden.</p>
<h2 id="Resources" class="common-anchor-header">Ressourcen<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Onnx-Beispielcode in Python und Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
