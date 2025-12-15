---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Optimización de NVIDIA CAGRA en Milvus: un enfoque híbrido GPU-CPU para
  acelerar la indexación y abaratar las consultas
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Descubra cómo GPU_CAGRA en Milvus 2.6 utiliza las GPU para la construcción
  rápida de gráficos y las CPU para el servicio escalable de consultas.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>A medida que los sistemas de IA pasan de los experimentos a la infraestructura de producción, las bases de datos vectoriales ya no tienen que lidiar con millones de incrustaciones. <strong>Ahora, miles de millones son rutinarios, y decenas de miles de millones son cada vez más comunes.</strong> A esta escala, las decisiones algorítmicas no sólo afectan al rendimiento y la recuperación, sino que también se traducen directamente en el coste de la infraestructura.</p>
<p>Esto nos lleva a una cuestión fundamental para las implantaciones a gran escala: <strong>¿cómo elegir el índice adecuado para obtener una recuperación y latencia aceptables sin que el uso de recursos informáticos se descontrole?</strong></p>
<p>Los índices basados en gráficos como <strong>NSW, HNSW, CAGRA y Vamana</strong> se han convertido en la respuesta más adoptada. Al navegar por grafos de vecindad preconstruidos, estos índices permiten una búsqueda rápida del vecino más próximo a escala de miles de millones, evitando el escaneo de fuerza bruta y la comparación de cada vector con la consulta.</p>
<p>Sin embargo, el perfil de costes de este enfoque es desigual. <strong>Consultar un grafo es relativamente barato; construirlo, no.</strong> La construcción de un gráfico de alta calidad requiere cálculos de distancias a gran escala y refinamientos iterativos en todo el conjunto de datos, cargas de trabajo que las CPU tradicionales tienen dificultades para manejar con eficiencia a medida que crecen los datos.</p>
<p>CAGRA de NVIDIA resuelve este cuello de botella utilizando las GPU para acelerar la construcción de gráficos a través del paralelismo masivo. Aunque esto reduce significativamente el tiempo de construcción, el hecho de depender de las GPU tanto para la construcción de índices como para el servicio de consultas introduce mayores restricciones de coste y escalabilidad en los entornos de producción.</p>
<p>Para equilibrar estas ventajas y desventajas, <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>adopta un diseño híbrido para</strong> <strong>los índices</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a>: <strong>Las GPU se utilizan únicamente para la construcción de los grafos, mientras que la ejecución de las consultas se ejecuta en las CPU.</strong> Esto preserva las ventajas de calidad de los gráficos construidos en la GPU al tiempo que mantiene la escalabilidad y la rentabilidad del servicio de consultas, lo que lo hace especialmente adecuado para cargas de trabajo con actualizaciones de datos poco frecuentes, grandes volúmenes de consultas y una estricta sensibilidad a los costes.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">¿Qué es CAGRA y cómo funciona?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Los índices vectoriales basados en grafos se dividen generalmente en dos categorías principales:</p>
<ul>
<li><p><strong>Construcción iterativa de grafos</strong>, representada por <strong>CAGRA</strong> (ya soportada en Milvus).</p></li>
<li><p><strong>Construcción de gráficos basada en la inserción</strong>, representada por <strong>Vamana</strong> (actualmente en desarrollo en Milvus).</p></li>
</ul>
<p>Estos dos enfoques difieren significativamente en sus objetivos de diseño y fundamentos técnicos, por lo que cada uno es adecuado para diferentes escalas de datos y patrones de carga de trabajo.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> es un algoritmo nativo de la GPU para la búsqueda aproximada del vecino más próximo (ANN), diseñado para construir y consultar grafos de proximidad a gran escala de forma eficiente. Al aprovechar el paralelismo de la GPU, CAGRA acelera significativamente la construcción de grafos y proporciona un alto rendimiento de consulta en comparación con enfoques basados en la CPU como HNSW.</p>
<p>CAGRA se basa en el algoritmo <strong>NN-Descent (Nearest Neighbor Descent)</strong>, que construye un grafo k-nearest-neighbor (kNN) mediante refinamiento iterativo. En cada iteración, se evalúan y actualizan los vecinos candidatos, convergiendo gradualmente hacia relaciones de vecindad de mayor calidad en todo el conjunto de datos.</p>
<p>Después de cada ronda de refinamiento, CAGRA aplica técnicas adicionales de poda de grafos -como la <strong>poda de desvíos de 2 saltos- para</strong>eliminar los bordes redundantes y preservar al mismo tiempo la calidad de la búsqueda. Esta combinación de refinamiento iterativo y poda da como resultado un <strong>grafo compacto pero bien conectado</strong> que es eficiente de recorrer en el momento de la consulta.</p>
<p>Mediante el refinamiento y la poda repetidos, CAGRA produce una estructura de grafos que admite <strong>una alta recuperación y una búsqueda del vecino más próximo de baja latencia a gran escala</strong>, lo que la hace especialmente adecuada para conjuntos de datos estáticos o que se actualizan con poca frecuencia.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Paso 1: Construcción del grafo inicial con NN-Descent</h3><p>NN-Descent se basa en una observación simple pero poderosa: si el nodo <em>u</em> es vecino de <em>v</em>, y el nodo <em>w</em> es vecino de <em>u</em>, entonces es muy probable que <em>w</em> también sea vecino de <em>v</em>. Esta propiedad transitiva permite al algoritmo descubrir los verdaderos vecinos más próximos de forma eficaz, sin necesidad de comparar exhaustivamente cada par de vectores.</p>
<p>CAGRA utiliza NN-Descent como algoritmo central de construcción de grafos. El proceso es el siguiente</p>
<p><strong>1. Inicialización aleatoria:</strong> Cada nodo comienza con un pequeño conjunto de vecinos seleccionados aleatoriamente, formando un grafo inicial aproximado.</p>
<p><strong>2. 2. Expansión de vecinos:</strong> En cada iteración, un nodo reúne a sus vecinos actuales y a los vecinos de éstos para formar una lista de candidatos. El algoritmo calcula las similitudes entre el nodo y todos los candidatos. Dado que la lista de candidatos de cada nodo es independiente, estos cálculos pueden asignarse a bloques de hilos de GPU independientes y ejecutarse en paralelo a escala masiva.</p>
<p><strong>3.</strong> 3<strong>. Actualización de la lista de candidatos:</strong> si el algoritmo encuentra candidatos más cercanos que los vecinos actuales del nodo, intercambia los vecinos más distantes y actualiza la lista kNN del nodo. A lo largo de múltiples iteraciones, este proceso produce un grafo kNN aproximado de mucha mayor calidad.</p>
<p><strong>4. Comprobación de convergencia:</strong> A medida que avanzan las iteraciones, se producen menos actualizaciones de vecinos. Una vez que el número de conexiones actualizadas cae por debajo de un umbral establecido, el algoritmo se detiene, lo que indica que el grafo se ha estabilizado.</p>
<p>Dado que la expansión de vecinos y el cálculo de similitudes para los distintos nodos son totalmente independientes, CAGRA asigna la carga de trabajo de NN-Descent de cada nodo a un bloque de subprocesos dedicado de la GPU. Este diseño permite un paralelismo masivo y hace que la construcción de grafos sea varios órdenes de magnitud más rápida que los métodos tradicionales basados en la CPU.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Paso 2: poda del grafo con desvíos de 2 saltos</h3><p>Una vez completado el proceso NN-Descent, el grafo resultante es preciso pero excesivamente denso. NN-Descent mantiene intencionadamente vecinos candidatos extra, y la fase de inicialización aleatoria introduce muchas aristas débiles o irrelevantes. Como resultado, a menudo cada nodo termina con un grado dos veces -o incluso varias veces- mayor que el grado objetivo.</p>
<p>Para producir un grafo compacto y eficiente, CAGRA aplica la poda de desvíos de 2 saltos.</p>
<p>La idea es sencilla: si el nodo <em>A</em> puede llegar al nodo <em>B</em> indirectamente a través de un vecino compartido <em>C</em> (formando un camino A → C → B), y la distancia de este camino indirecto es comparable a la distancia directa entre <em>A</em> y <em>B</em>, entonces la arista directa A → B se considera redundante y puede eliminarse.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una ventaja clave de esta estrategia de poda es que la comprobación de redundancia de cada arista depende sólo de la información local: las distancias entre los dos puntos finales y sus vecinos compartidos. Dado que cada arista puede evaluarse de forma independiente, el paso de poda es altamente paralelizable y se adapta de forma natural a la ejecución por lotes en la GPU.</p>
<p>Como resultado, CAGRA puede podar el grafo de forma eficiente en las GPU, lo que reduce la sobrecarga de almacenamiento en un <strong>40-50%</strong> al tiempo que preserva la precisión de la búsqueda y mejora la velocidad de recorrido durante la ejecución de la consulta.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA en Milvus: ¿en qué se diferencia?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque las GPU ofrecen importantes ventajas de rendimiento para la construcción de grafos, los entornos de producción se enfrentan a un reto práctico: Los recursos de la GPU son mucho más caros y limitados que los de la CPU. Si tanto la construcción de índices como la ejecución de consultas dependen exclusivamente de las GPU, surgen rápidamente varios problemas operativos:</p>
<ul>
<li><p><strong>Baja utilización de los recursos:</strong> El tráfico de consultas suele ser irregular y en ráfagas, lo que deja las GPU inactivas durante largos periodos de tiempo y desperdicia una capacidad de cálculo muy cara.</p></li>
<li><p><strong>Alto coste de implantación:</strong> La asignación de una GPU a cada instancia de consulta aumenta los costes de hardware, a pesar de que la mayoría de las consultas no aprovechan todo el rendimiento de la GPU.</p></li>
<li><p><strong>Escalabilidad limitada:</strong> El número de GPU disponibles limita directamente el número de réplicas de servicio que se pueden ejecutar, lo que restringe la capacidad de escalar en función de la demanda.</p></li>
<li><p><strong>Menor flexibilidad:</strong> Cuando tanto la creación de índices como las consultas dependen de las GPU, el sistema queda vinculado a la disponibilidad de GPU y no puede cambiar fácilmente las cargas de trabajo a las CPU.</p></li>
</ul>
<p>Para hacer frente a estas limitaciones, Milvus 2.6.1 introduce un modo de despliegue flexible para el índice GPU_CAGRA a través del parámetro <code translate="no">adapt_for_cpu</code>. Este modo permite un flujo de trabajo híbrido: CAGRA utiliza la GPU para construir un índice de grafos de alta calidad, mientras que la ejecución de las consultas se ejecuta en la CPU, normalmente utilizando HNSW como algoritmo de búsqueda.</p>
<p>De este modo, las GPU se utilizan donde más valor aportan (en la construcción de índices rápidos y precisos), mientras que las CPU gestionan las consultas a gran escala de forma mucho más rentable y escalable.</p>
<p>Como resultado, este enfoque híbrido es especialmente adecuado para cargas de trabajo en las que:</p>
<ul>
<li><p><strong>Las actualizaciones de datos son poco frecuentes</strong>, por lo que las reconstrucciones de índices son poco frecuentes.</p></li>
<li><p>El<strong>volumen de consultas es elevado</strong>, por lo que se requieren muchas réplicas de bajo coste.</p></li>
<li><p><strong>La sensibilidad a los costes es alta</strong> y el uso de la GPU debe controlarse estrictamente.</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Entendiendo <code translate="no">adapt_for_cpu</code></h3><p>En Milvus, el parámetro <code translate="no">adapt_for_cpu</code> controla cómo se serializa un índice CAGRA en el disco durante la construcción del índice y cómo se deserializa en la memoria en el momento de la carga. Cambiando este parámetro en el momento de la construcción y en el momento de la carga, Milvus puede cambiar de forma flexible entre la construcción del índice basada en la GPU y la ejecución de la consulta basada en la CPU.</p>
<p>Las diferentes combinaciones de <code translate="no">adapt_for_cpu</code> en tiempo de compilación y carga dan lugar a cuatro modos de ejecución, cada uno diseñado para un escenario operativo específico.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tiempo de creación (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Tiempo de carga (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Lógica de ejecución</strong></th><th style="text-align:center"><strong>Escenario recomendado</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>verdadero</strong></td><td style="text-align:center"><strong>verdadero</strong></td><td style="text-align:center">Construir con GPU_CAGRA → serializar como HNSW → deserializar como HNSW → <strong>consulta a la CPU</strong></td><td style="text-align:center">Cargas de trabajo sensibles a los costes; servicio de consultas a gran escala</td></tr>
<tr><td style="text-align:center"><strong>verdadero</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Construir con GPU_CAGRA → serializar como HNSW → deserializar como HNSW → <strong>consulta a la CPU</strong></td><td style="text-align:center">Las consultas subsiguientes vuelven a la CPU cuando se producen desajustes en los parámetros</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>true</strong></td><td style="text-align:center">Construir con GPU_CAGRA → serializar como CAGRA → deserializar como HNSW → <strong>consulta a la CPU</strong></td><td style="text-align:center">Mantener el índice CAGRA original para almacenamiento mientras se habilita una búsqueda temporal en CPU</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Construir con GPU_CAGRA → serializar como CAGRA → deserializar como CAGRA → <strong>consulta GPU</strong></td><td style="text-align:center">Cargas de trabajo de rendimiento crítico en las que el coste es secundario</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> El mecanismo <code translate="no">adapt_for_cpu</code> solo admite la conversión unidireccional. Un índice CAGRA puede convertirse en HNSW porque la estructura del grafo CAGRA conserva todas las relaciones de vecindad que necesita HNSW. Sin embargo, un índice HNSW no puede convertirse de nuevo a CAGRA, ya que carece de la información estructural adicional necesaria para la consulta basada en GPU. En consecuencia, la configuración del tiempo de compilación debe seleccionarse cuidadosamente, teniendo en cuenta los requisitos de despliegue y consulta a largo plazo.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Puesta a prueba de GPU_CAGRA<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Para evaluar la eficacia del modelo de ejecución híbrido (que utiliza la GPU para la construcción de índices y la CPU para la ejecución de consultas), hemos llevado a cabo una serie de experimentos controlados en un entorno estandarizado. La evaluación se centra en tres dimensiones: <strong>rendimiento de</strong> la <strong>construcción de índices</strong>, <strong>rendimiento de las consultas</strong> y <strong>precisión de la recuperación</strong>.</p>
<p><strong>Configuración experimental</strong></p>
<p>Los experimentos se realizaron en hardware estándar ampliamente adoptado por la industria para garantizar que los resultados sigan siendo fiables y ampliamente aplicables.</p>
<ul>
<li><p>CPU: Procesador MD EPYC 7R13 (16 cpus)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Rendimiento de la construcción de índices</h3><p>Comparamos CAGRA construido en la GPU con HNSW construido en la CPU, bajo el mismo grado de gráfico objetivo de 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales resultados</strong></p>
<ul>
<li><p><strong>CAGRA en la GPU genera índices entre 12 y 15 veces más rápido que HNSW en la CPU.</strong> Tanto en Cohere1M como en Gist1M, CAGRA en la GPU supera significativamente a HNSW en la CPU, lo que pone de manifiesto la eficiencia del paralelismo en la GPU durante la construcción de grafos.</p></li>
<li><p><strong>El tiempo de construcción aumenta linealmente con las iteraciones de NN-Descent.</strong> A medida que aumenta el número de iteraciones, el tiempo de construcción crece de forma casi lineal, lo que refleja la naturaleza de refinamiento iterativo de NN-Descent y proporciona un equilibrio predecible entre el coste de construcción y la calidad del gráfico.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Rendimiento de la consulta</h3><p>En este experimento, el gráfico CAGRA se construye una vez en la GPU y luego se consulta utilizando dos rutas de ejecución diferentes:</p>
<ul>
<li><p>Consulta<strong>en la CPU</strong>: el índice se deserializa a formato HNSW y se busca en la CPU.</p></li>
<li><p>Consulta<strong>en la GPU</strong>: la búsqueda se ejecuta directamente en el grafo CAGRA utilizando un recorrido basado en la GPU.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales resultados</strong></p>
<ul>
<li><p><strong>El rendimiento de la búsqueda en la GPU es entre 5 y 6 veces superior al de la CPU.</strong> Tanto en Cohere1M como en Gist1M, el traversal basado en la GPU proporciona QPS sustancialmente superiores, lo que pone de manifiesto la eficiencia de la navegación paralela de grafos en las GPU.</p></li>
<li><p><strong>La recuperación aumenta con las iteraciones de NN-Descent y luego se estabiliza.</strong> A medida que aumenta el número de iteraciones, la recuperación mejora tanto en la CPU como en la GPU. Sin embargo, a partir de cierto punto, las iteraciones adicionales producen ganancias decrecientes, lo que indica que la calidad del grafo ha convergido en gran medida.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Precisión de recuperación</h3><p>En este experimento, tanto CAGRA como HNSW se consultan en la CPU para comparar la recuperación en condiciones de consulta idénticas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales resultados</strong></p>
<p><strong>CAGRA consigue una mayor recuperación que HNSW en ambos conjuntos de datos</strong>, lo que demuestra que incluso cuando un índice CAGRA se construye en la GPU y se deserializa para la búsqueda en la CPU, la calidad del grafo se mantiene.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">Próximos pasos: Ampliación de la construcción de índices con Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>El enfoque híbrido GPU-CPU de Milvus ofrece una solución práctica y rentable para las actuales cargas de trabajo de búsqueda vectorial a gran escala. Al construir gráficos CAGRA de alta calidad en las GPU y servir las consultas en las CPU, combina la construcción rápida de índices con una ejecución de consultas escalable y asequible, lo que resulta especialmente<strong>adecuado para cargas de trabajo con actualizaciones poco frecuentes, grandes volúmenes de consultas y estrictas restricciones de costes.</strong></p>
<p>A escalas aún mayores -decenas<strong>o cientos de miles de millones de vectores-</strong>, la propia construcción de índices se convierte en el cuello de botella. Cuando el conjunto completo de datos ya no cabe en la memoria de la GPU, la industria suele recurrir a métodos de <strong>construcción de grafos basados en inserciones</strong> como <strong>Vamana</strong>. En lugar de construir el gráfico de una sola vez, Vamana procesa los datos por lotes, insertando nuevos vectores de forma incremental mientras mantiene la conectividad global.</p>
<p>Su proceso de construcción sigue tres etapas clave</p>
<p><strong>1.</strong> 1.<strong>Crecimiento geométrico por lotes</strong>: se empieza con lotes pequeños para formar un esqueleto del grafo, luego se aumenta el tamaño de los lotes para maximizar el paralelismo y, por último, se utilizan lotes grandes para perfeccionar los detalles.</p>
<p><strong>2.</strong> 2.<strong>Inserción codiciosa</strong>: cada nuevo nodo se inserta navegando desde un punto de entrada central, refinando iterativamente su conjunto de vecinos.</p>
<p><strong>3.</strong> 3.<strong>Actualización de aristas hacia atrás</strong>: se añaden conexiones inversas para preservar la simetría y garantizar una navegación eficaz por el grafo.</p>
<p>La poda se integra directamente en el proceso de construcción mediante el criterio α-RNG: si un vecino candidato <em>v</em> ya está cubierto por un vecino existente <em>p′</em> (es decir, <em>d(p′, v) &lt; α × d(p, v)</em>), entonces <em>v</em> se poda. El parámetro α permite un control preciso de la dispersión y la precisión. La aceleración en la GPU se consigue mediante el paralelismo en lotes y el escalado geométrico de lotes, con lo que se logra un equilibrio entre la calidad del índice y el rendimiento.</p>
<p>Juntas, estas técnicas permiten a los equipos gestionar el rápido crecimiento de los datos y las actualizaciones de índices a gran escala sin toparse con las limitaciones de memoria de la GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El equipo de Milvus está desarrollando activamente la compatibilidad con Vamana, con un lanzamiento previsto para la primera mitad de 2026. Permanezca atento.</p>
<p>¿Tiene alguna pregunta o desea profundizar en alguna función de la última versión de Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente cuestiones en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Más información sobre las características de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: El arma secreta para combatir los duplicados en los datos de formación LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus</a></p></li>
</ul>
