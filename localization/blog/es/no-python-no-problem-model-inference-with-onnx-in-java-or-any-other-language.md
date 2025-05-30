---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Sin Python no hay problema: Inferencia de modelos con ONNX en Java o en
  cualquier otro lenguaje
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) es un ecosistema de herramientas de
  plataforma agnóstica para la inferencia de modelos de redes neuronales.
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
<p>Nunca ha sido tan fácil crear aplicaciones de IA Generativa. Un rico ecosistema de herramientas, modelos de IA y conjuntos de datos permite incluso a ingenieros de software no especializados crear impresionantes chatbots, generadores de imágenes y mucho más. Estas herramientas, en su mayor parte, están hechas para Python y se basan en PyTorch. ¿Pero qué pasa cuando no tienes acceso a Python en producción y necesitas usar Java, Golang, Rust, C++ u otro lenguaje?</p>
<p>Nos limitaremos a la inferencia de modelos, incluidos los modelos de incrustación y los modelos de cimentación; otras tareas, como la formación y el ajuste de modelos, no suelen completarse en el momento de la implantación. ¿Qué opciones tenemos para la inferencia de modelos sin Python? La solución más obvia es utilizar un servicio en línea de proveedores como Anthropic o Mistral. Normalmente proporcionan un SDK para lenguajes distintos de Python, y si no lo hicieran, sólo requeriría simples llamadas REST API. Pero, ¿y si nuestra solución tiene que ser totalmente local debido, por ejemplo, a cuestiones de cumplimiento o privacidad?</p>
<p>Otra solución es ejecutar un servidor Python localmente. El problema original se planteaba como la imposibilidad de ejecutar Python en producción, así que eso descarta el uso de un servidor Python local. Las soluciones locales relacionadas probablemente sufrirán restricciones legales, de seguridad o técnicas similares. <em>Necesitamos una solución totalmente contenida que nos permita llamar al modelo directamente desde Java u otro lenguaje que no sea Python.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Un Python se metamorfosea en una mariposa Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">¿Qué es ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) es un ecosistema de plataformas agnósticas de herramientas para realizar la inferencia de modelos de redes neuronales. Fue desarrollado inicialmente por el equipo PyTorch de Meta (entonces Facebook), con aportaciones posteriores de Microsoft, IBM, Huawei, Intel, AMD, Arm y Qualcomm. En la actualidad, es un proyecto de código abierto propiedad de la Linux Foundation for AI and Data. ONNX es el método de facto para distribuir modelos de redes neuronales independientes de la plataforma.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Gráfico computacional (parcial) de ONNX para un transformador NN</em></p>
<p><strong>Normalmente utilizamos "ONNX" en un sentido más estricto para referirnos a su formato de archivo.</strong> Un archivo de modelo ONNX representa un gráfico computacional, que a menudo incluye los valores de peso de una función matemática, y el estándar define operaciones comunes para redes neuronales. Puedes pensar en él de forma similar al gráfico computacional creado cuando utilizas autodiff con PyTorch. Desde otra perspectiva, el formato de archivo ONNX sirve como <em>representación intermedia</em> (RI) para redes neuronales, de forma muy similar a la compilación de código nativo, que también implica un paso de RI. Véase la ilustración anterior en la que se visualiza un gráfico computacional ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Una IR permite muchas combinaciones de front-ends y back-ends</em></p>
<p>El formato de archivo ONNX es sólo una parte del ecosistema ONNX, que también incluye bibliotecas para manipular gráficos computacionales y bibliotecas para cargar y ejecutar archivos de modelos ONNX. Estas bibliotecas abarcan distintos lenguajes y plataformas. Dado que ONNX no es más que un IR (lenguaje de representación intermedio), pueden aplicarse optimizaciones específicas para una determinada plataforma de hardware antes de ejecutarlo con código nativo. Véase la figura anterior, que ilustra las combinaciones de front-ends y back-ends.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Flujo de trabajo de ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>A efectos de discusión, investigaremos la llamada a un modelo de incrustación de texto desde Java, por ejemplo, como preparación para la ingestión de datos en la base de datos vectorial de código abierto <a href="https://milvus.io/">Milvus</a>. Así pues, si queremos llamar a nuestro modelo de incrustación o base desde Java, ¿es tan sencillo como utilizar la biblioteca ONNX en el archivo de modelo correspondiente? Sí, pero tendremos que procurarnos archivos tanto para el modelo como para el codificador del tokenizador (y el decodificador para los modelos de cimentación). Podemos producirlos nosotros mismos utilizando Python offline, es decir, antes de la producción, lo que ahora explicamos.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Exportación de modelos NN desde Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Abramos un modelo común de incrustación de texto, <code translate="no">all-MiniLM-L6-v2</code>, desde Python utilizando la biblioteca de transformadores de frases de HuggingFace. Utilizaremos la biblioteca HF indirectamente a través de la biblioteca util de .txtai, ya que necesitamos una envoltura alrededor de los transformadores de frases que también exporte las capas de agrupación y normalización después de la función transformadora. (Estas capas toman las incrustaciones de tokens dependientes del contexto, es decir, la salida del transformador, y las transforman en una única incrustación de texto).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ordenamos a la biblioteca que exporte <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> desde el hub del modelo HuggingFace como ONNX, especificando la tarea como incrustación de texto y habilitando la cuantificación del modelo. La llamada a <code translate="no">onnx_model()</code> descargará el modelo del hub de modelos si no existe ya localmente, convertirá las tres capas a ONNX y combinará sus gráficos computacionales.</p>
<p>¿Estamos listos para realizar inferencias en Java? No tan rápido. El modelo introduce una lista de tokens (o una lista de listas para más de una muestra) correspondiente a la tokenización del texto que deseamos incrustar. Por lo tanto, a menos que podamos realizar toda la tokenización antes del tiempo de producción, tendremos que ejecutar el tokenizador desde dentro de Java.</p>
<p>Para ello existen varias opciones. Una consiste en implementar o encontrar una implementación del tokenizador para el modelo en cuestión en Java u otro lenguaje, y llamarlo desde Java como una biblioteca estática o dinámicamente vinculada. Una solución más sencilla es convertir el tokenizador en un archivo ONNX y utilizarlo desde Java, del mismo modo que utilizamos el archivo ONNX del modelo.</p>
<p>Sin embargo, ONNX plano no contiene las operaciones necesarias para implementar el grafo computacional de un tokenizador. Por esta razón, Microsoft creó una biblioteca para aumentar ONNX llamada ONNXRuntime-Extensions. Define operaciones útiles para todo tipo de pre y postprocesamiento de datos, no sólo para los tokenizadores de texto.</p>
<p>Así es como exportamos nuestro tokenizador como un archivo ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Hemos descartado el decodificador del tokenizador, ya que incrustar frases no lo requiere. Ahora, tenemos dos archivos: <code translate="no">tokenizer.onnx</code> para tokenizar texto, y <code translate="no">model.onnx</code> para incrustar cadenas de tokens.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Inferencia del modelo en Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Ejecutar nuestro modelo desde Java es ahora trivial. He aquí algunas de las líneas de código importantes del ejemplo completo:</p>
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
<p>Encontrará un ejemplo completo en la sección de recursos.</p>
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
    </button></h2><p>Hemos visto en este post cómo es posible exportar modelos de código abierto desde el hub de modelos de HuggingFace y utilizarlos directamente desde lenguajes distintos de Python. Sin embargo, hay que tener en cuenta algunas advertencias:</p>
<p>En primer lugar, las bibliotecas ONNX y las extensiones en tiempo de ejecución tienen diferentes niveles de soporte de características. Puede que no sea posible utilizar todos los modelos en todos los lenguajes hasta que se publique una futura actualización del SDK. Las bibliotecas en tiempo de ejecución de ONNX para Python, C++, Java y JavaScript son las más completas.</p>
<p>En segundo lugar, el hub HuggingFace contiene ONNX pre-exportado, pero estos modelos no incluyen las capas finales de pooling y normalización. Debe conocer cómo funciona <code translate="no">sentence-transformers</code> si pretende utilizar directamente <code translate="no">torch.onnx</code>.</p>
<p>No obstante, ONNX cuenta con el respaldo de los principales líderes del sector y está en vías de convertirse en un medio sin fricciones para la IA Generativa multiplataforma.</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Ejemplo de código onnx en Python y Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
