---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH en Milvus: El arma secreta para combatir los duplicados en los
  datos de formación LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH en Milvus 2.6 ofrece una solución eficaz para deduplicar conjuntos
  de datos de formación LLM masivos, con un procesamiento 2 veces más rápido y
  un ahorro de costes de 3 a 5 veces en comparación con los métodos
  tradicionales.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Los grandes modelos lingüísticos (LLM) han transformado el panorama de la IA gracias a su capacidad para escribir código, crear contenidos y resolver problemas complejos. Sin embargo, estos potentes modelos requieren enormes cantidades de datos de alta calidad para alimentar su entrenamiento.</p>
<p>El reto es que los datos de entrenamiento en bruto a menudo contienen una redundancia significativa. Es como enseñar a un niño repitiendo las mismas lecciones una y otra vez mientras se saltan otros temas importantes. Una gran empresa de IA se puso en contacto con nosotros precisamente por este problema: estaban creando un nuevo y ambicioso modelo lingüístico, pero tenían dificultades para desduplicar decenas de miles de millones de documentos. Los métodos de comparación tradicionales no podían adaptarse a este volumen, y las herramientas de deduplicación especializadas requerían enormes recursos informáticos, lo que las hacía económicamente inviables.</p>
<p>Para resolver este problema, nuestra solución es: la indexación MinHash LSH (Locality Sensitive Hashing), que estará disponible en Milvus 2.6. Este artículo explorará cómo MinHash LSH resuelve eficientemente el problema de la deduplicación de datos para la formación LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Deduplicación de datos: Por qué es importante para la formación LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Para entrenar LLM potentes es esencial disponer de datos diversos y de alta calidad. Cuando aparece contenido duplicado en los datos de entrenamiento, se crean varios problemas importantes:</p>
<ul>
<li><p><strong>Recursos desperdiciados:</strong> Los datos redundantes aumentan el tiempo de entrenamiento, los costes y el consumo de energía.</p></li>
<li><p><strong>Rendimiento reducido:</strong> Los modelos pueden sobreajustarse al contenido repetido, limitando su capacidad de generalización a nueva información.</p></li>
<li><p><strong>Efecto de memorización:</strong> El contenido duplicado aumenta la probabilidad de que los modelos memoricen y reproduzcan textualmente un texto específico. También podría dar lugar a filtraciones de información confidencial o problemas de derechos de autor.</p></li>
<li><p><strong>Evaluaciones engañosas:</strong> Los duplicados entre los conjuntos de entrenamiento y prueba pueden inflar accidentalmente las métricas de rendimiento.</p></li>
</ul>
<p>Existen tres métodos principales para encontrar y eliminar duplicados:</p>
<ul>
<li><p><strong>Coincidencia exacta:</strong> identifica duplicados idénticos mediante hashing.</p></li>
<li><p><strong>Coincidencia aproximada:</strong> encuentra casi duplicados mediante algoritmos como MinHash LSH y similitud de Jaccard.</p></li>
<li><p><strong>Correspondencia semántica:</strong> identifica contenidos con significados similares mediante incrustaciones vectoriales.</p></li>
</ul>
<p>Con corpus de preentrenamiento que alcanzan terabytes o incluso petabytes, los métodos tradicionales de correspondencia exacta, como las comparaciones por pares, son inviables desde el punto de vista informático. La deduplicación semántica añade una sobrecarga significativa al utilizar modelos de incrustación para generar vectores. Necesitamos métodos aproximados más innovadores, como <strong>MinHash LSH, que</strong>equilibren la recuperación y la precisión manteniendo unos costes manejables, para que la deduplicación a gran escala resulte práctica.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: detección eficaz de casi duplicados en conjuntos de datos masivos<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Para encontrar casi duplicados en un océano de datos de entrenamiento, necesitamos un algoritmo de coincidencia aproximada que sea eficiente y preciso. MinHash LSH (Locality Sensitive Hashing) es una gran herramienta para este objetivo. Desglosemos este término aparentemente complejo paso a paso.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Paso 1: Representación de documentos con MinHash</h3><p>En primer lugar, necesitamos una forma de medir la similitud de los documentos. El método estándar utiliza la similitud de Jaccard:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Esta fórmula mide el solapamiento entre el documento A y el documento B, en concreto, la proporción de elementos compartidos respecto al total de elementos únicos. Un valor más alto significa que los documentos son más similares.</p>
<p>Sin embargo, calcular esto directamente para miles de millones de pares de documentos requiere muchos recursos y llevaría años. MinHash crea "huellas dactilares" (firmas) compactas que preservan las relaciones de similitud y agilizan las comparaciones.</p>
<ol>
<li><strong>Shingling:</strong> Divida cada documento en secuencias superpuestas de palabras o caracteres (k-shingles). Por ejemplo, la frase "Me encanta la búsqueda vectorial" con k=3 (por palabra) da como resultado: {"Amo el vector", "amo la búsqueda vectorial"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> Aplica múltiples funciones hash a cada conjunto de shingles y registra el valor hash mínimo de cada función. El resultado es un vector de firmas para cada documento.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Al calcular la similitud, la probabilidad de que los valores hash se alineen en las mismas posiciones en las firmas MinHash de dos documentos (que corresponde a la distancia Jaccard de estas firmas) proporciona una aproximación cercana a la similitud Jaccard de sus conjuntos de tejas originales. Esto nos permite estimar eficazmente la similitud de los documentos sin comparar directamente los textos originales más grandes; en su lugar, podemos analizar sus firmas MinHash compactas.</p>
<p>El principio MinHash consiste en utilizar la palabra con el menor valor hash para representar todo el documento, mejorando la precisión mediante la incorporación de funciones hash adicionales. Es probable que los cambios menores en las palabras se pasen por alto, ya que no suelen afectar al valor hash mínimo. En cambio, los cambios más sustanciales tienden a alterar el valor hash y son más fáciles de detectar. Este método puede considerarse como una agrupación mínima de valores hash entre varias palabras. Además de MinHash, existen alternativas como SimHash para generar firmas de documentos, pero no se tratarán aquí.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Paso 2: Identificación de documentos similares mediante LSH</h3><p>Incluso con firmas MinHash compactas, comparar cada par en millones o miles de millones de documentos sigue siendo caro desde el punto de vista computacional. Ahí es donde entra en juego <strong>Locality Sensitive Hashing (LSH)</strong>.</p>
<p>La idea clave de LSH es utilizar funciones hash que <strong>provoquen colisiones de forma intencionada: los</strong>elementos <strong>similares</strong>tienen más probabilidades de coincidir en el mismo cubo, mientras que los no similares no. Esto es lo contrario del hash tradicional, cuyo objetivo es evitar las colisiones.</p>
<p>Para MinHash, una estrategia LSH popular es la <strong>técnica de bandas</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Dividir cada firma MinHash (un vector de longitud <em>N</em>) en <em>b</em> bandas, cada una con <em>r</em> filas<em>(N = b × r</em>).</p></li>
<li><p><strong>Hashing de bandas:</strong> Convertir cada banda (un subvector de <em>r</em> valores) en un cubo mediante una función hash estándar.</p></li>
<li><p><strong>Pares candidatos:</strong> Si dos documentos comparten un cubo en <strong>cualquier</strong> banda, se marcan como coincidencias potenciales.</p></li>
</ol>
<p>Ajustando el número de bandas (b) y el número de filas por banda ®, se puede controlar el equilibrio entre recuperación, precisión y eficacia de la búsqueda.</p>
<p>La idea clave es la siguiente: los documentos muy similares tendrán muchos valores hash coincidentes en sus firmas MinHash. Cuando estas firmas se dividen en bandas, incluso una banda con todos los valores coincidentes es suficiente para colocar dos documentos en el mismo cubo. Cuanto más parecidos sean los documentos, mayor será la probabilidad de que esto ocurra en al menos una banda, lo que permite a LSH sacar a la superficie pares candidatos de forma eficiente sin comparar exhaustivamente todas las firmas.</p>
<p>En resumen, <strong>MinHash + LSH</strong> permiten una deduplicación aproximada escalable: MinHash comprime los documentos en firmas compactas y LSH reduce eficazmente el espacio de búsqueda agrupando las coincidencias probables. Es como detectar gemelos en una multitud: primero, se toma una instantánea rápida de las características de todos (MinHash), se agrupan los parecidos (LSH) y, a continuación, se inspeccionan minuciosamente los grupos más pequeños en busca de duplicados reales.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Integración de MinHash LSH en Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Una necesidad del mundo real impulsó la integración de MinHash LSH en Milvus 2.6. Como se mencionó anteriormente, un usuario de Milvus -una de las principales empresas de LLM- se acercó a nosotros con un desafío: deduplicar de manera eficiente volúmenes masivos de datos de texto para el preentrenamiento de LLM.</p>
<p>Los canales de deduplicación tradicionales suelen depender de herramientas externas desvinculadas de los sistemas de almacenamiento y recuperación, lo que requiere costosas transferencias de datos entre componentes. Este flujo de trabajo fragmentado aumenta la sobrecarga operativa e impide la plena utilización de los recursos informáticos distribuidos.</p>
<p>Reconociendo los puntos fuertes de Milvus en el manejo de datos vectoriales de alto rendimiento, surgió una idea natural: <strong><em>¿Y si MinHash LSH se integrara en Milvus de forma nativa, convirtiendo la deduplicación aproximada en una función de base de datos de primera clase?</em></strong></p>
<p>Este enfoque permite un flujo de trabajo completo desde la deduplicación hasta la recuperación semántica dentro de Milvus, simplificando los MLOps a la vez que se aprovecha su escalabilidad y su API unificada. Junto con nuestro socio, hemos optimizado MinHash LSH para la arquitectura nativa en la nube de Milvus, dando como resultado una solución rápida y escalable para la deduplicación a gran escala.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Entre las principales funciones de Milvus 2.6 se incluyen:</h3><ul>
<li><p><strong>Indexación nativa MinHash LSH:</strong> Implementa la técnica de bandas estándar para LSH y admite la reclasificación Jaccard opcional para mejorar la recuperación. Ofrece implementaciones en memoria y basadas en mmap para una mayor flexibilidad en diferentes cargas de trabajo.</p></li>
<li><p><strong>Perfecta integración con la API:</strong> Los usuarios pueden definir campos vectoriales MinHash, construir índices <code translate="no">MINHASH_LSH</code>, insertar datos de firma y realizar búsquedas de similitud aproximada utilizando el SDK estándar y las API declarativas de Milvus.</p></li>
<li><p><strong>Distribuido y escalable:</strong> Construida sobre la arquitectura nativa en la nube de Milvus, la función admite el escalado horizontal para grandes conjuntos de datos y procesamiento de alto rendimiento.</p></li>
</ul>
<p>Esta integración ofreció resultados impresionantes. Al ejecutar MinHash LSH en Milvus totalmente gestionado<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>), ayudamos a este usuario a deduplicar <strong>10.000 millones de documentos</strong> de forma eficiente. En comparación con su enfoque anterior basado en MapReduce, la nueva solución <strong>duplicó con creces la velocidad de procesamiento</strong> y logró <strong>un ahorro de costes de 3 a 5 veces</strong>, gracias a la indexación y ejecución de consultas optimizadas de Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Práctica: Deduplicación de conjuntos de datos LLM con Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Arremanguémonos y utilicemos MinHash LSH en Milvus 2.6 para realizar una deduplicación aproximada a escala.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Requisito previo: Generación de firmas MinHash</h3><p>Milvus gestiona la indexación y búsqueda de firmas MinHash <strong>pregeneradas</strong>. Tendrá que generarlas durante el preprocesamiento utilizando herramientas como <code translate="no">datasketch</code> en Python o una implementación personalizada. Los pasos típicos son</p>
<ol>
<li><p>Leer documentos en bruto</p></li>
<li><p>Desmenuzar (tokenizar o trocear) cada documento</p></li>
<li><p>Aplicar múltiples funciones hash para generar una firma MinHash (por ejemplo, una matriz uint64 de tamaño 128 )</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Paso 1: Crear un esquema en Milvus</h3><p>Necesitamos crear una colección Milvus para almacenar las firmas MinHash y sus correspondientes IDs de documentos.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Paso 2: Crear el índice y la colección MINHASH_LSH</strong></h3><p>Este es el paso principal. Debemos especificar JACCARD como tipo de métrica y configurar los parámetros relacionados con LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Nota sobre el ajuste de parámetros: La eficacia de MinHash LSH depende en gran medida de la elección de los parámetros. Por ejemplo, el número de funciones hash utilizadas durante la generación de la firma MinHash (es decir, <code translate="no">MINHASH_DIM</code>) afecta a la precisión y el tamaño de la firma. En la fase LSH, el número de bandas (<code translate="no">num_bands</code>) y filas por banda determinan conjuntamente el rango de sensibilidad del umbral de similitud y el equilibrio entre recuperación y precisión. Los usuarios deben experimentar y realizar ajustes en función de las características de sus conjuntos de datos y de sus necesidades de deduplicación. Suele tratarse de un proceso iterativo.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Paso 3: Insertar firmas MinHash</strong></h3><p>Supongamos que tiene un lote de documentos y sus correspondientes firmas MinHash.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Paso 5: Buscar documentos casi duplicados</h3><p>Utilice la firma MinHash de un documento para buscar documentos similares en la colección.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Paso 6: Post-procesamiento y Clustering</h3><p>Los resultados devueltos son <strong>candidatos a casi duplicados</strong>. Para formar grupos de deduplicación completos, puede aplicar técnicas de clustering como <strong>Union-Find</strong> sobre los pares candidatos. Cada grupo resultante representa un conjunto de duplicados; conserve un documento representativo y archive o elimine el resto.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Conclusión</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH en Milvus 2.6 es un salto adelante en el procesamiento de datos de IA. Lo que comenzó como una solución para la deduplicación de datos LLM ahora abre las puertas a casos de uso más amplios: limpieza de contenido web, gestión de catálogos, detección de plagio y más.</p>
<p>Si tiene un caso de uso similar, póngase en contacto con nosotros a través de <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> para concertar una <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">reunión en la hora de oficina</a>.</p>
