---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Manos a la obra con VDBBench: Evaluación comparativa de bases de datos
  vectoriales para POC que se ajustan a la producción
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Aprenda a probar bases de datos vectoriales con datos de producción reales
  utilizando VDBBench. Guía paso a paso para POC de conjuntos de datos
  personalizados que predicen el rendimiento real.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>Las bases de datos vectoriales son ahora una parte esencial de la infraestructura de IA, ya que impulsan varias aplicaciones impulsadas por LLM para el servicio al cliente, la generación de contenidos, la búsqueda, las recomendaciones y mucho más.</p>
<p>Con tantas opciones en el mercado, desde bases de datos vectoriales específicas como Milvus y Zilliz Cloud hasta bases de datos tradicionales con búsqueda vectorial como complemento, <strong>elegir la adecuada no es tan sencillo como leer gráficos de referencia.</strong></p>
<p>La mayoría de los equipos realizan una prueba de concepto (POC) antes de comprometerse, lo cual es inteligente en teoría, pero en la práctica, muchas referencias de proveedores que parecen impresionantes sobre el papel se derrumban en condiciones reales.</p>
<p>Una de las razones principales es que la mayoría de las afirmaciones de rendimiento se basan en conjuntos de datos obsoletos de 2006-2012 (SIFT, GloVe, LAION) que se comportan de forma muy diferente a las incrustaciones modernas. Por ejemplo, SIFT utiliza vectores de 128 dimensiones, mientras que los modelos de IA actuales producen dimensiones mucho mayores (3.072 para el último de OpenAI, 1.024 para el de Cohere), un gran cambio que afecta al rendimiento, el coste y la escalabilidad.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">La solución: pruebe con sus datos, no con referencias enlatadas<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>La solución más sencilla y eficaz: realice su evaluación POC con los vectores que su aplicación genera realmente. Esto significa utilizar sus modelos de incrustación, sus consultas reales y su distribución de datos real.</p>
<p>Esto es exactamente para lo que se ha creado <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a>, una herramienta de evaluación comparativa de bases de datos vectoriales de código abierto. Admite la evaluación y comparación de cualquier base de datos vectorial, incluidas Milvus, Elasticsearch, pgvector, etc., y simula cargas de trabajo de producción reales.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Descargar VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Ver Leaderboard →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">¿Qué es VDBBench</a><a href="https://github.com/zilliztech/VectorDBBench">?</a> </p>
<p>VDBbench te permite:</p>
<ul>
<li><p><strong>Probar con sus propios datos</strong> de sus modelos de incrustación.</p></li>
<li><p>Simular <strong>inserciones concurrentes, consultas e ingestión de streaming</strong>.</p></li>
<li><p>Medir <strong>la latencia P95/P99, el rendimiento sostenido y la precisión de recuperación</strong></p></li>
<li><p>Realizar pruebas comparativas en varias bases de datos en las mismas condiciones</p></li>
<li><p>Permite <strong>realizar pruebas con conjuntos de datos personalizados</strong> para que los resultados coincidan realmente con los de producción</p></li>
</ul>
<p>A continuación, le explicaremos cómo ejecutar un POC de nivel de producción con VDBBench y sus datos reales, para que pueda tomar una decisión segura y preparada para el futuro.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Cómo evaluar VectorDBs con sus conjuntos de datos personalizados con VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de empezar, asegúrese de tener instalado Python 3.11 o superior. Necesitará datos vectoriales en formato CSV o NPY, aproximadamente 2-3 horas para la configuración completa y las pruebas, y conocimientos intermedios de Python para la resolución de problemas en caso necesario.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Instalación y configuración</h3><p>Si va a evaluar una base de datos, ejecute este comando:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Si va a comparar todas las bases de datos soportadas, ejecute el comando:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Para clientes de bases de datos específicos (por ejemplo: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Consulta esta <a href="https://github.com/zilliztech/VectorDBBench">página de GitHub</a> para ver todas las bases de datos compatibles y sus comandos de instalación.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Iniciar VDBBench</h3><p>Inicie <strong>VDBBench</strong> con:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Salida de consola esperada: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La interfaz web estará disponible localmente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Preparación de datos y conversión de formatos</h3><p>VDBBench requiere archivos Parquet estructurados con esquemas específicos para garantizar la coherencia de las pruebas en diferentes bases de datos y conjuntos de datos.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nombre del archivo</strong></th><th style="text-align:center"><strong>Finalidad</strong></th><th style="text-align:center"><strong>Requerido</strong></th><th style="text-align:center"><strong>Contenido Ejemplo</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Colección de vectores para la inserción en la base de datos</td><td style="text-align:center">✅</td><td style="text-align:center">ID del vector + Datos del vector (lista[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Colección de vectores para las consultas</td><td style="text-align:center">✅</td><td style="text-align:center">ID del vector + Datos del vector (lista[float])</td></tr>
<tr><td style="text-align:center">vecinos.parquet</td><td style="text-align:center">Ground Truth para vectores de consulta (lista de ID de vecino más cercano real)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k lista de ID similares]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Etiquetas (metadatos que describen entidades distintas de los vectores)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; etiqueta</td></tr>
</tbody>
</table>
<p>Especificaciones de archivo necesarias:</p>
<ul>
<li><p><strong>El archivo de vectores de entrenamiento (train.parquet)</strong> debe contener una columna ID con enteros incrementales y una columna vector que contenga matrices float32. Los nombres de las columnas son configurables, pero la columna ID debe utilizar tipos enteros para una indexación adecuada.</p></li>
<li><p><strong>El archivo vectorial de prueba (test.parquet)</strong> sigue la misma estructura que los datos de entrenamiento. El nombre de la columna ID debe ser "id", mientras que los nombres de las columnas del vector pueden personalizarse para ajustarse a su esquema de datos.</p></li>
<li><p>El<strong>archivo de datos reales (neighbors.parquet)</strong> contiene los vecinos más cercanos de referencia para cada consulta de prueba. Requiere una columna ID correspondiente a los ID de los vectores de prueba y una columna de matriz neighbors que contenga los ID correctos de los vecinos más cercanos del conjunto de entrenamiento.</p></li>
<li><p><strong>El archivo de etiquetas escalares (scalar_labels.parquet)</strong> es opcional y contiene etiquetas de metadatos asociadas a los vectores de entrenamiento, útiles para las pruebas de búsqueda filtrada.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Desafíos del formato de datos</h3><p>La mayoría de los datos vectoriales de producción existen en formatos que no se ajustan directamente a los requisitos de VDBBench. Los archivos CSV suelen almacenar incrustaciones como representaciones de cadenas de matrices, los archivos NPY contienen matrices numéricas en bruto sin metadatos y las exportaciones de bases de datos suelen utilizar JSON u otros formatos estructurados.</p>
<p>La conversión manual de estos formatos implica varios pasos complejos: el análisis sintáctico de las representaciones de cadenas en matrices numéricas, el cálculo de los vecinos más próximos exactos mediante bibliotecas como FAISS, la división adecuada de los conjuntos de datos manteniendo la coherencia de los ID y la garantía de que todos los tipos de datos se ajustan a las especificaciones de Parquet.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Conversión automatizada de formatos</h3><p>Para agilizar el proceso de conversión, hemos desarrollado un script en Python que gestiona automáticamente la conversión de formatos, el cálculo de la verdad sobre el terreno y la estructuración adecuada de los datos.</p>
<p><strong>Formato de entrada CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Formato de entrada NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Conversión Implementación del script</h3><p><strong>Instalación de las dependencias necesarias:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ejecutar la conversión:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Referencia de parámetros:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nombre del parámetro</strong></th><th style="text-align:center"><strong>Requerido</strong></th><th style="text-align:center"><strong>Tipo</strong></th><th style="text-align:center"><strong>Descripción</strong></th><th style="text-align:center"><strong>Valor por defecto</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Sí</td><td style="text-align:center">Cadena</td><td style="text-align:center">Ruta de datos de entrenamiento, admite formato CSV o NPY. CSV debe contener la columna emb, si no hay columna id se autogenerará</td><td style="text-align:center">Ninguno</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Sí</td><td style="text-align:center">Cadena</td><td style="text-align:center">Ruta de los datos de consulta, admite formato CSV o NPY. El formato es el mismo que el de los datos de entrenamiento</td><td style="text-align:center">Ninguno</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Sí</td><td style="text-align:center">Cadena</td><td style="text-align:center">Ruta del directorio de salida, guarda los archivos parquet convertidos y los archivos de índice de vecinos</td><td style="text-align:center">Ninguno</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">No</td><td style="text-align:center">Cadena</td><td style="text-align:center">Ruta CSV de etiquetas, debe contener la columna labels (formateada como matriz de cadenas), utilizada para guardar etiquetas</td><td style="text-align:center">Ninguna</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">No</td><td style="text-align:center">Entero</td><td style="text-align:center">Número de vecinos más cercanos que se devuelven al calcular</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Estructura del directorio de salida:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Script de conversión completo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Salida del proceso de conversión:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Archivos generados Verificación:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Configuración del conjunto de datos personalizado</h3><p>Vaya a la sección de configuración del conjunto de datos personalizado en la interfaz web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La interfaz de configuración proporciona campos para los metadatos del conjunto de datos y la especificación de la ruta del archivo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parámetros de configuración:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nombre del parámetro</strong></th><th style="text-align:center"><strong>Significado</strong></th><th style="text-align:center"><strong>Sugerencias de configuración</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nombre</td><td style="text-align:center">Nombre del conjunto de datos (identificador único)</td><td style="text-align:center">Cualquier nombre, por ejemplo <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Ruta de la carpeta</td><td style="text-align:center">Ruta del directorio del conjunto de datos</td><td style="text-align:center">por ejemplo <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Dimensiones del vector</td><td style="text-align:center">Debe coincidir con los archivos de datos, por ejemplo, 768</td></tr>
<tr><td style="text-align:center">tamaño</td><td style="text-align:center">Recuento de vectores (opcional)</td><td style="text-align:center">Puede dejarse vacío, el sistema lo detectará automáticamente</td></tr>
<tr><td style="text-align:center">Tipo de métrica</td><td style="text-align:center">Método de medición de la similitud</td><td style="text-align:center">Normalmente se utiliza L2 (distancia euclidiana) o IP (producto interno)</td></tr>
<tr><td style="text-align:center">Nombre del archivo de entrenamiento</td><td style="text-align:center">Nombre de archivo del conjunto de entrenamiento (sin extensión .parquet)</td><td style="text-align:center">Si <code translate="no">train.parquet</code>, rellene <code translate="no">train</code>. Si hay varios archivos, utilice la separación por comas, p. ej, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">nombre del archivo de prueba</td><td style="text-align:center">Nombre de archivo del conjunto de consulta (sin extensión .parquet)</td><td style="text-align:center">Si <code translate="no">test.parquet</code>, rellene <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">Nombre del archivo de la verdad sobre el terreno</td><td style="text-align:center">Nombre de archivo de la verdad sobre el terreno (sin extensión .parquet)</td><td style="text-align:center">Si <code translate="no">neighbors.parquet</code>, escriba <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">train id name</td><td style="text-align:center">Nombre de la columna ID de los datos de entrenamiento</td><td style="text-align:center">Normalmente <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">train emb name</td><td style="text-align:center">Nombre de columna del vector de datos de entrenamiento</td><td style="text-align:center">Si el nombre de columna generado por script es <code translate="no">emb</code>, rellene <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">test emb name</td><td style="text-align:center">Nombre de columna del vector de datos de prueba</td><td style="text-align:center">Suele ser el mismo que el nombre de la columna de entrenamiento, p. ej, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">ground truth emb name</td><td style="text-align:center">Nombre de columna del vecino más próximo en Ground Truth</td><td style="text-align:center">Si el nombre de la columna es <code translate="no">neighbors_id</code>, rellene <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">nombre del archivo de etiquetas escalares</td><td style="text-align:center">(Opcional) Nombre del archivo de etiquetas (sin extensión .parquet)</td><td style="text-align:center">Si se ha generado <code translate="no">scalar_labels.parquet</code>, rellene <code translate="no">scalar_labels</code>, de lo contrario déjelo vacío</td></tr>
<tr><td style="text-align:center">porcentajes de etiquetas</td><td style="text-align:center">(Opcional) Porcentaje del filtro de etiquetas</td><td style="text-align:center">por ejemplo, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, dejar vacío si no es necesario filtrar las etiquetas</td></tr>
<tr><td style="text-align:center">descripción</td><td style="text-align:center">Descripción del conjunto de datos</td><td style="text-align:center">No se puede anotar el contexto empresarial ni el método de generación</td></tr>
</tbody>
</table>
<p>Guarde la configuración para continuar con la configuración de la prueba.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Ejecución de la prueba y configuración de la base de datos</h3><p>Acceda a la interfaz de configuración de la prueba:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Selección y configuración de la base de datos (Milvus como ejemplo):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Asignación del conjunto de datos:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Prueba de metadatos y etiquetado:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Ejecución de pruebas:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Análisis de resultados y evaluación del rendimiento<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>La interfaz de resultados proporciona un análisis exhaustivo del rendimiento:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Resumen de la configuración de la prueba</h3><p>En la evaluación se probaron niveles de concurrencia de 1, 5 y 10 operaciones concurrentes (limitados por los recursos de hardware disponibles), dimensiones de vector de 768, tamaño del conjunto de datos de 3.000 vectores de entrenamiento y 3.000 consultas de prueba, con el filtrado de etiquetas escalares desactivado para esta ejecución de prueba.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Consideraciones críticas para la implementación</h3><ul>
<li><p><strong>Coherencia dimensional:</strong> Los desajustes en las dimensiones de los vectores entre los conjuntos de datos de entrenamiento y de prueba provocarán fallos inmediatos en la prueba. Verifique la alineación dimensional durante la preparación de los datos para evitar errores en tiempo de ejecución.</p></li>
<li><p><strong>Precisión</strong> de la verdad sobre el terreno: Los cálculos incorrectos de la verdad sobre el terreno invalidan las mediciones de la tasa de recuperación. El script de conversión proporcionado utiliza FAISS con distancia L2 para el cálculo exacto del vecino más cercano, lo que garantiza resultados de referencia precisos.</p></li>
<li><p><strong>Requisitos de escala del conjunto de datos:</strong> Los conjuntos de datos pequeños (menos de 10.000 vectores) pueden producir mediciones de QPS incoherentes debido a una generación de carga insuficiente. Considere la posibilidad de ampliar el tamaño del conjunto de datos para obtener pruebas de rendimiento más fiables.</p></li>
<li><p><strong>Asignación de recursos:</strong> Las restricciones de memoria y CPU del contenedor Docker pueden limitar artificialmente el rendimiento de la base de datos durante las pruebas. Supervise la utilización de los recursos y ajuste los límites del contenedor según sea necesario para una medición precisa del rendimiento.</p></li>
<li><p><strong>Monitorización de errores:</strong> <strong>VDBBench</strong> puede registrar errores en la salida de la consola que no aparecen en la interfaz web. Supervise los registros de terminal durante la ejecución de la prueba para obtener información de diagnóstico completa.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Herramientas complementarias: Generación de datos de prueba<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Para escenarios de desarrollo y pruebas estandarizadas, puede generar conjuntos de datos sintéticos con características controladas:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Esta utilidad genera conjuntos de datos con dimensiones y recuentos de registros especificados para la creación de prototipos y escenarios de pruebas de referencia.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Acaba de aprender a liberarse del "teatro del benchmark" que ha inducido a error a innumerables decisiones sobre bases de datos vectoriales. Con VDBBench y su propio conjunto de datos, puede generar métricas de QPS, latencia y recuperación de nivel de producción, sin más conjeturas a partir de datos académicos de hace décadas.</p>
<p>Deje de confiar en benchmarks enlatados que no tienen nada que ver con sus cargas de trabajo reales. En cuestión de horas, no de semanas, podrá ver con precisión el rendimiento de una base de datos con <em>sus</em> vectores, <em>sus</em> consultas y <em>sus</em> restricciones. Esto significa que puede tomar la decisión con confianza, evitar dolorosas reescrituras posteriores y lanzar sistemas que realmente funcionen en producción.</p>
<ul>
<li><p>Pruebe VDBBench con sus cargas de trabajo: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Vea los resultados de las pruebas de las principales bases de datos vectoriales: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">Tabla de clasificación de VDBBench</a></p></li>
</ul>
<p>¿Tienes preguntas o quieres compartir tus resultados? Únete a la conversación en<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o conecta con nuestra comunidad en <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Este es el primer post de nuestra serie VectorDB POC Guide: métodos prácticos y probados por desarrolladores para crear una infraestructura de IA que funcione bajo la presión del mundo real. Esté atento para más.</em></p>
