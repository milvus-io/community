---
id: dna-sequence-classification-based-on-milvus.md
title: Clasificación de secuencias de ADN basada en Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Utilice Milvus, una base de datos vectorial de código abierto, para reconocer
  familias de genes de secuencias de ADN. Menos espacio pero mayor precisión.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Clasificación de secuencias de ADN basada en Milvus</custom-h1><blockquote>
<p>Autor: Mengjia Gu, ingeniera de datos en Zilliz, es licenciada en Estudios de la Información por la Universidad McGill. Sus intereses incluyen las aplicaciones de IA y la búsqueda de similitudes con bases de datos vectoriales. Como miembro de la comunidad del proyecto de código abierto Milvus, ha proporcionado y mejorado varias soluciones, como el sistema de recomendación y el modelo de clasificación de secuencias de ADN. Le gustan los retos y nunca se rinde.</p>
</blockquote>
<custom-h1>Introducción</custom-h1><p>La secuencia de ADN es un concepto popular tanto en la investigación académica como en aplicaciones prácticas, como la trazabilidad de genes, la identificación de especies y el diagnóstico de enfermedades. Mientras que todas las industrias están hambrientas de un método de investigación más inteligente y eficiente, la inteligencia artificial ha atraído mucha atención, especialmente desde el ámbito biológico y médico. Cada vez son más los científicos e investigadores que contribuyen al aprendizaje automático y al aprendizaje profundo en bioinformática. Para que los resultados experimentales sean más convincentes, una opción común es aumentar el tamaño de la muestra. La colaboración con big data en genómica también aporta más posibilidades de casos de uso en la realidad. Sin embargo, la alineación de secuencias tradicional tiene limitaciones que la hacen <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">inadecuada para datos de gran tamaño</a>. Con el fin de hacer menos concesiones en la realidad, la vectorización es una buena opción para un gran conjunto de datos de secuencias de ADN.</p>
<p>La base de datos vectorial de código abierto <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> es adecuada para datos masivos. Es capaz de almacenar vectores de secuencias de ácidos nucleicos y realizar una recuperación de alta eficiencia. También puede ayudar a reducir el coste de producción o investigación. El sistema de clasificación de secuencias de ADN basado en Milvus sólo tarda milisegundos en realizar la clasificación de genes. Además, muestra una mayor precisión que otros clasificadores comunes en el aprendizaje automático.</p>
<custom-h1>Procesamiento de datos</custom-h1><p>Un gen que codifica información genética está formado por una pequeña sección de secuencias de ADN, que consta de 4 bases nucleotídicas [A, C, G, T]. En el genoma humano hay unos 30.000 genes, casi 3.000 millones de pares de bases de ADN, y cada par de bases tiene 2 bases correspondientes. Para permitir diversos usos, las secuencias de ADN pueden clasificarse en varias categorías. Para reducir el coste y facilitar el uso de datos de secuencias de ADN largas, se introduce <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer </a>en el preprocesamiento de datos. Al mismo tiempo, hace que los datos de secuencias de ADN se parezcan más a un texto sin formato. Además, los datos vectorizados pueden acelerar el cálculo en el análisis de datos o el aprendizaje automático.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>El método k-mer se utiliza habitualmente en el preprocesamiento de secuencias de ADN. Extrae una pequeña sección de longitud k a partir de cada base de la secuencia original, convirtiendo así una secuencia larga de longitud s en (s-k+1) secuencias cortas de longitud k. Ajustar el valor de k mejorará el rendimiento del modelo. Las listas de secuencias cortas son más fáciles de leer, extraer y vectorizar.</p>
<p><strong>Vectorización</strong></p>
<p>Las secuencias de ADN se vectorizan en forma de texto. Una secuencia transformada por k-mer se convierte en una lista de secuencias cortas, que se parece a una lista de palabras individuales en una frase. Por lo tanto, la mayoría de los modelos de procesamiento del lenguaje natural deberían funcionar también para los datos de secuencias de ADN. Se pueden aplicar metodologías similares a la formación de modelos, la extracción de características y la codificación. Dado que cada modelo tiene sus propias ventajas e inconvenientes, la selección de modelos depende de la característica de los datos y del objetivo de la investigación. Por ejemplo, CountVectorizer, un modelo de bolsa de palabras, realiza la extracción de características mediante una simple tokenización. No pone límite a la longitud de los datos, pero el resultado obtenido es menos obvio en términos de comparación de similitudes.</p>
<custom-h1>Demostración de Milvus</custom-h1><p>Milvus puede gestionar fácilmente datos no estructurados y recuperar los resultados más similares entre billones de vectores en un plazo medio de milisegundos. Su búsqueda de similitudes se basa en el algoritmo de búsqueda del vecino más próximo aproximado (RNA). Estas características hacen de Milvus una gran opción para gestionar vectores de secuencias de ADN y, por tanto, para promover el desarrollo y las aplicaciones de la bioinformática.</p>
<p>A continuación se muestra una demostración de cómo construir un sistema de clasificación de secuencias de ADN con Milvus. El <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">conjunto de datos experimentales </a>incluye 3 organismos y 7 familias de genes. Todos los datos se convierten en listas de secuencias cortas mediante k-mers. Con un modelo CountVectorizer preentrenado, el sistema codifica entonces los datos de secuencia en vectores. El diagrama de flujo que figura a continuación muestra la estructura del sistema y los procesos de inserción y búsqueda.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Pruebe esta demostración en <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">el Milvus bootcamp</a>.</p>
<p>En Milvus, el sistema crea una colección e inserta los vectores correspondientes de secuencias de ADN en la colección (o partición si está activada). Al recibir una solicitud de consulta, Milvus devolverá las distancias entre el vector de la secuencia de ADN de entrada y los resultados más similares de la base de datos. La clase de la secuencia de entrada y la similitud entre las secuencias de ADN pueden determinarse mediante las distancias vectoriales en los resultados.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Clasificación de secuencias</strong>de ADN La búsqueda de secuencias de ADN más similares en Milvus podría implicar la familia de genes de una muestra desconocida, y así conocer su posible funcionalidad.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> Si una secuencia se clasifica como GPCRs, entonces probablemente tiene influencia en las funciones corporales. </a>En esta demostración, Milvus ha permitido con éxito al sistema identificar las familias de genes de las secuencias de ADN humano buscadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>Similitud genética</strong></p>
<p>La similitud media de secuencias de ADN entre organismos ilustra la proximidad entre sus genomas. La demo busca en los datos humanos las secuencias de ADN más similares a las del chimpancé y el perro respectivamente. A continuación, calcula y compara las distancias medias del producto interno (0,97 para el chimpancé y 0,70 para el perro), lo que demuestra que el chimpancé comparte más genes similares con el ser humano que el perro. Con datos más complejos y el diseño del sistema, Milvus es capaz de apoyar la investigación genética incluso a un nivel superior.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Rendimiento</strong></p>
<p>La demostración entrena el modelo de clasificación con un 80% de datos de muestras humanas (3629 en total) y utiliza el resto como datos de prueba. Compara el rendimiento del modelo de clasificación de secuencias de ADN que utiliza Milvus con el basado en Mysql y 5 clasificadores populares de aprendizaje automático. El modelo basado en Milvus supera a sus homólogos en precisión.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>Exploración adicional</custom-h1><p>Con el desarrollo de la tecnología de big data, la vectorización de la secuencia de ADN desempeñará un papel más importante en la investigación y la práctica genéticas. Combinado con el conocimiento profesional en bioinformática, los estudios relacionados pueden beneficiarse aún más de la participación de la vectorización de secuencias de ADN. Por lo tanto, Milvus puede presentar mejores resultados en la práctica. Según los diferentes escenarios y necesidades de los usuarios, la búsqueda de similitudes y el cálculo de distancias impulsados por Milvus muestran un gran potencial y muchas posibilidades.</p>
<ul>
<li><strong>Estudio de secuencias desconocidas</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">Según algunos investigadores, la vectorización puede comprimir los datos de secuencias de ADN.</a> Al mismo tiempo, requiere menos esfuerzo para estudiar la estructura, función y evolución de secuencias de ADN desconocidas. Milvus puede almacenar y recuperar un gran número de vectores de secuencias de ADN sin perder precisión.</li>
<li><strong>Adaptar dispositivos</strong>: Limitada por los algoritmos tradicionales de alineación de secuencias, la búsqueda de similitudes apenas puede beneficiarse de la mejora de los dispositivos<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>). Milvus, que admite tanto el cálculo normal en CPU como la aceleración en GPU, resuelve este problema con el algoritmo aproximado del vecino más próximo.</li>
<li><strong>Detección de virus y rastreo de orígenes</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">Los científicos han comparado secuencias genómicas y han informado de que el virus COVID19, de probable origen murciélago, pertenece al SARS-COV</a>. Basándose en esta conclusión, los investigadores pueden ampliar el tamaño de la muestra para obtener más pruebas y patrones.</li>
<li><strong>Diagnosticar enfermedades</strong>: Clínicamente, los médicos podrían comparar secuencias de ADN entre pacientes y grupos sanos para identificar genes variantes causantes de enfermedades. Es posible extraer características y codificar estos datos utilizando algoritmos adecuados. Milvus es capaz de devolver distancias entre vectores, que pueden relacionarse con datos de enfermedades. Además de ayudar al diagnóstico de enfermedades, esta aplicación también puede contribuir a inspirar el estudio de <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">terapias dirigidas</a>.</li>
</ul>
<custom-h1>Más información sobre Milvus</custom-h1><p>Milvus es una potente herramienta capaz de impulsar una amplia gama de aplicaciones de inteligencia artificial y búsqueda de similitudes vectoriales. Para saber más sobre el proyecto, consulte los siguientes recursos:</p>
<ul>
<li>Lea nuestro <a href="https://milvus.io/blog">blog</a>.</li>
<li>Interactúe con nuestra comunidad de código abierto en <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Utilice o contribuya a la base de datos vectorial más popular del mundo en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Pruebe y despliegue rápidamente aplicaciones de IA con nuestro nuevo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
