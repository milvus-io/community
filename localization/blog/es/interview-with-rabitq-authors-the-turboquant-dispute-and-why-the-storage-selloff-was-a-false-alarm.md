---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Entrevista con los autores de RaBitQ: La disputa de TurboQuant y por qué la
  caída del almacenamiento fue una falsa alarma
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Los autores de RaBitQ responden al documento TurboQuant de Google: el
  desequilibrio de los puntos de referencia, la teoría de la atribución errónea
  y por qué la venta masiva de almacenamiento fue una falsa alarma.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>El documento <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> de Google afirmaba que la <strong>compresión era 6 veces mayor, la velocidad 8 veces mayor y la pérdida de precisión</strong> de las representaciones vectoriales <strong>casi nula</strong>. Tras su publicación, las acciones de memoria y almacenamiento cayeron en picado, y los principales medios tecnológicos lo convirtieron rápidamente en noticia de portada.</p>
<p>La reacción del mercado fue sólo el principio. Los investigadores pronto empezaron a preguntarse si las afirmaciones del artículo eran exageradas y si trataba con justicia los trabajos anteriores, especialmente <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>. La disputa volvió a poner de actualidad <strong>la cuantificación vectorial</strong>, en parte porque las mismas ideas subyacentes son ahora importantes en dos partes fundamentales de la IA: <a href="https://zilliz.com/learn/vector-similarity-search">los sistemas de búsqueda vectorial</a> y la compresión de caché KV para modelos de gran tamaño.</p>
<p>Para entender tanto el debate técnico como lo que significa para los sistemas de producción, hablamos con <strong>Cheng Long</strong>, profesor asociado de la NTU de Singapur y responsable de VectorDB@NTU; <strong>Jianyang Gao</strong>, primer autor de RaBitQ; y <strong>Li Liu</strong>, Director de Ingeniería de Zilliz. La conversación versó sobre la cuantificación vectorial en sí, las cuestiones planteadas en torno a TurboQuant y por qué es importante para sistemas como <a href="https://milvus.io/">Milvus</a>, las <a href="https://zilliz.com/learn/what-is-vector-database">bases de datos vectoriales</a> de código abierto más populares, y la recuperación de vectores a gran escala.</p>
<p><strong><em>Lectura relacionada:</em></strong> <em>Si prefieres la parte de ingeniería en lugar de la entrevista, consulta nuestro artículo complementario sobre</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>cómo afecta la cuantización vectorial a los costes de infraestructura de la IA</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">¿Por qué la cuantización vectorial se ha convertido de repente en un tema tan importante?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Antes de entrar en la polémica, ¿podría explicarnos qué es la cuantización vectorial y por qué ha cobrado tanta importancia en la IA?</strong></p>
<p><strong>Cheng Long:</strong> La cuantización vectorial es una técnica de <strong>compresión de datos</strong> y <strong>representación aproximada</strong>. Su origen se remonta al procesamiento de señales, donde se utilizaba para la compresión de imágenes y audio. En los sistemas modernos de IA, su papel ha cambiado porque los vectores se han convertido en una de las unidades básicas de cálculo.</p>
<p>En la actualidad, su importancia es más evidente en dos ámbitos.</p>
<p>Uno es la <strong>búsqueda en tiempo real en colecciones con miles o incluso decenas de miles de millones de vectores</strong>. En los sistemas de recuperación semántica, la tarea principal es la búsqueda de similitudes en vectores de alta dimensión. Pero los vectores en bruto son grandes y el cálculo en coma flotante es caro. A gran escala, resulta difícil ofrecer una latencia de milisegundos. La cuantización vectorial ayuda comprimiendo los vectores en representaciones de pocos bits y acelerando el cálculo de distancias. Por eso es importante para cargas de trabajo prácticas como <a href="https://milvus.io/docs/single-vector-search.md">la búsqueda monovectorial</a>, la <a href="https://milvus.io/docs/multi-vector-search.md">búsqueda multivectorial</a> y el diseño de índices en <a href="https://milvus.io/docs/index-explained.md">la arquitectura de búsqueda Milvus</a>.</p>
<p>La otra es la <strong>compresión</strong> de <strong>la caché KV</strong> para modelos grandes. La caché KV reduce el cómputo redundante durante la generación, pero el coste de memoria crece rápidamente a medida que el contexto se alarga. El problema es cómo comprimir esos vectores sin perjudicar demasiado la calidad del resultado. En el fondo, se trata también de un problema de cuantificación vectorial.</p>
<p><strong>Zilliz: Si se generaliza el uso de la cuantificación vectorial -y si los resultados de TurboQuant se mantienen-, ¿significa eso que la demanda de almacenamiento se reducirá drásticamente?</strong></p>
<p><strong>Jianyang Gao:</strong> Con el mismo modelo y la misma carga de trabajo, la compresión puede reducir la demanda de almacenamiento. Pero eso no justifica la conclusión general a la que se ha llegado.</p>
<p>Cuando TurboQuant habla de <strong>compresión 6x</strong> y <strong>aceleración 8x</strong>, se está comparando con una <strong>base de 16 bits/32 bits</strong>. No es lo mismo que compararse con otros métodos de la misma categoría. Así que todavía hay que evaluar con más cuidado el efecto real.</p>
<p><strong>Zilliz: Entonces, desde esa perspectiva, si la reacción del mercado fuera realmente por la tecnología en sí, ¿debería haberse producido mucho antes, cuando ya habían aparecido ideas similares?</strong></p>
<p><strong>Cheng Long:</strong> Desde un punto de vista técnico, se podría decir que ya se había alcanzado antes un territorio teórico similar. Pero los mercados no se mueven en sincronía con la investigación. Suele haber un desfase entre los resultados académicos, la adopción por parte de la ingeniería y la interpretación financiera.</p>
<p>Y en un horizonte más largo, el efecto puede incluso no ser lineal. La compresión puede hacer posible la ejecución de grandes modelos en dispositivos más pequeños, lo que puede crear una nueva demanda en lugar de simplemente reducirla. La relación entre tecnología y mercados es más complicada que una extrapolación lineal.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">¿Cómo surgió RaBitQ y qué aportó?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: ¿Cómo se le ocurrió la idea de RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Partimos de una laguna que vimos en las bases de datos vectoriales. Los métodos tradicionales, como <a href="https://milvus.io/docs/ivf-pq.md">la cuantificación de productos</a>, funcionaban bien empíricamente, pero ofrecían muy pocas garantías teóricas.</p>
<p>Por aquel entonces, yo estudiaba probabilidad en alta dimensión en la NTU de Singapur, y eso me llevó a preguntarme si podíamos crear un método que no solo fuera práctico, sino que también ofreciera una clara garantía teórica. Ese fue el punto de partida de RaBitQ.</p>
<p><strong>Zilliz: ¿Cuál cree que es la principal originalidad de RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Su idea clave era utilizar una rotación aleatoria, también conocida como transformación de Johnson-Lindenstrauss, para que la distribución de las coordenadas vectoriales fuera más uniforme y predecible.</p>
<p>Una vez conseguido esto, se puede derivar un estimador de cuantización óptimo. Luego dimos una prueba estricta de que alcanza el límite inferior teórico.</p>
<p>En trabajos anteriores también se había intentado introducir la rotación aleatoria. Pero, desde nuestro punto de vista, esos métodos no consiguieron el efecto que buscábamos por cuestiones prácticas de diseño de algoritmos.</p>
<p><strong>Zilliz: Desde el punto de vista de la ingeniería, ¿qué es lo que más les llamó la atención de RaBitQ?</strong></p>
<p><strong>Li Liu:</strong> Habíamos trabajado con muchos algoritmos de cuantización, desde <a href="https://milvus.io/docs/ivf-sq8.md">métodos de cuantización escalar</a> hasta PQ y otras variantes. Lo más destacado de RaBitQ fue que cambió la forma de enfocar el problema.</p>
<p>Antes de eso, gran parte del campo seguía siendo bastante empírico. Se podía decir que un método parecía funcionar, pero era más difícil explicar claramente por qué. RaBitQ abordaba el problema de una forma mucho más matemática. El método parecía elegante y, en cierto sentido, sencillo. Esa forma de pensar influyó en muchos de sus trabajos posteriores.</p>
<p><strong>Zilliz: En pocas palabras, ¿cuánto puede ahorrar en memoria y en costes?</strong></p>
<p><strong>Li Liu:</strong> Al mismo nivel de memoria, pasar de la compresión de 4 bits a la de 2 bits reduce el uso de memoria a la mitad.</p>
<p>Y no se trata sólo de compresión. Su rendimiento es superior al de enfoques anteriores, y eso es importante en entornos de producción en los que los equipos se preocupan tanto por la eficiencia de la memoria como por la calidad de la recuperación. Por eso es importante para los sistemas que necesitan equilibrar el <a href="https://milvus.io/docs/dense-vector.md">almacenamiento vectorial denso</a>, el rendimiento y la recuperación.</p>
<p><strong>Zilliz: Más allá de Milvus, ¿dónde cree que se utiliza RaBitQ en la actualidad?</strong></p>
<p><strong>Cheng Long:</strong> En primer lugar, quiero dar las gracias al equipo de Milvus, porque fueron de los primeros en adoptar RaBitQ. También mantuvimos muchas conversaciones y colaboramos en algunas investigaciones.</p>
<p>RaBitQ también se ha adoptado en otros sistemas, como FAISS de Meta, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene y turbopuffer. Lo que destaca en el lado de <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus</a> es que el equipo lanzó <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> como una opción de índice real en <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, junto con un trabajo más amplio sobre <a href="https://milvus.io/docs/manage-collections.md">gestión de colecciones</a>, <a href="https://milvus.io/docs/ivf-flat.md">indexación basada en IVF</a> e <a href="https://milvus.io/docs/hnsw.md">indexación basada en HNSW</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">¿Cómo debemos evaluar TurboQuant?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: En su respuesta pública, dijo que TurboQuant tenía algunos problemas graves. ¿Cuáles eran, en su opinión, los principales?</strong></p>
<p><strong>Jianyang Gao:</strong> Vemos tres problemas principales.</p>
<p>Uno es la forma en que el documento describe el trabajo previo y discute el solapamiento. El documento de TurboQuant tergiversa la metodología de RaBitQ, ignorando la parte más similar, como la transformación Johnson-Lindenstrauss. Otra es la forma en que el documento caracteriza el resultado teórico. Describe RaBitQ como subóptimo sin proporcionar ninguna explicación o prueba, pero RaBitQ es óptimo de hecho. La tercera es la imparcialidad de la comparación experimental. Utilizan una CPU mononúcleo para evaluar RaBitQ y una GPU A100 para evaluar TurboQuant.</p>
<p><strong>Zilliz: Veamos primero la cuestión del punto de referencia. ¿Por qué crees que la comparación no fue justa?</strong></p>
<p><strong>Jianyang Gao:</strong> Las pruebas de rendimiento sólo tienen sentido si la configuración es comparable. Si un sistema se prueba en un entorno de hardware o software muy diferente, el resultado puede reflejar más la configuración que el propio algoritmo.</p>
<p>En nuestra opinión, las diferencias en la elección del procesador, el lenguaje de implementación y el nivel de optimización pueden suponer una gran diferencia. Por eso, la metodología de los benchmarks debe interpretarse con mucho cuidado, sobre todo por parte de los equipos que construyen sistemas de recuperación en producción.</p>
<p><strong>Cheng Long:</strong> El artículo también hace otras afirmaciones que no se sostienen.</p>
<p>Por ejemplo, dice que <strong>RaBitQ no puede vectorizarse</strong>. Pero RaBitQ ya había publicado código abierto con cálculo vectorizado basado en SIMD cuando se publicó el artículo de 2024. Así que, desde nuestro punto de vista, esa afirmación era incorrecta.</p>
<p>También merece la pena mencionar que empezamos a trabajar con NVIDIA el año pasado y completamos una implementación de RaBitQ en la GPU. El código relacionado está siendo revisado para su inclusión en la biblioteca cuVS de NVIDIA.</p>
<p><strong>Zilliz: Milvus evaluó TurboQuant en la segunda mitad de 2025 pero no lo adoptó. ¿Qué observó su equipo durante las pruebas?</strong></p>
<p><strong>Li Liu:</strong> Contiene una idea útil. En nuestra opinión, hace una pequeña optimización en cómo se asigna la rejilla de cuantificación. Pero el paso más importante del método -utilizar la rotación aleatoria para la cuantización- fue introducido por primera vez por RaBitQ.</p>
<p>Y en lo que respecta a la estimación insesgada, el enfoque de RaBitQ es más limpio y su derivación teórica es más sólida.</p>
<p>Dicho esto, como se trataba de un resultado de Google, lo probamos en 2025. En nuestro laboratorio, en un entorno de CPU estandarizado, TurboQuant no superó a nuestra versión interna RaBitQ en la mayoría de los casos que evaluamos. Así que cuando el mercado reaccionó con tanta fuerza, nos quedamos realmente sorprendidos.</p>
<p><strong>Zilliz: Para los lectores que no hayan estudiado a fondo ninguno de los dos documentos, ¿podría explicar en qué se solapan RaBitQ y TurboQuant?</strong></p>
<p><strong>Li Liu:</strong> A grandes rasgos, ambos métodos comienzan con <strong>una rotación aleatoria</strong>. Matemáticamente, eso significa multiplicar el vector por una matriz ortogonal aleatoria. Es como cambiar el ángulo de visión en un espacio tridimensional. No cambia las posiciones relativas de los puntos de datos, pero distribuye la información entre las dimensiones de forma más uniforme.</p>
<p>Después viene la <strong>cuantización</strong>. Se divide el espacio continuo de valor real en <strong>2^k celdas de cuadrícula</strong>, donde <strong>k</strong> es el número de bits de cuantificación, y luego se asigna cada elemento del vector a un punto de cuadrícula cercano. TurboQuant realiza aquí un pequeño ajuste asignando la cuadrícula según la distribución de los datos en lugar de distribuirla uniformemente.</p>
<p>El último paso es la <strong>estimación del error</strong>, y aquí es donde reside la principal contribución de RaBitQ. Los métodos tradicionales calculan directamente a partir de los valores cuantizados, lo que hace que el error sea más difícil de controlar. RaBitQ estima el error de cuantificación con mayor precisión, y de ahí proviene su optimalidad matemática. La solución de TurboQuant es más complicada, y en nuestro caso el compromiso no parecía tan atractivo.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">¿Por qué la atribución es tan difícil de resolver en la práctica?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Después de publicar su declaración pública, ¿cómo respondieron Google y el ICLR?</p>
<p><strong>Cheng Long:</strong> El ICLR no tomó ninguna medida. Les enviamos un correo electrónico durante el periodo de revisión, en septiembre del año pasado, pero no recibimos respuesta. Volvimos a escribirles en marzo de este año y nos dijeron que publicáramos los comentarios en OpenReview, pero más allá de eso no hubo ninguna acción.</p>
<p>En cuanto a Google, uno de los coautores respondió hace unos días. La respuesta decía que revisarían la versión arXiv para corregir su descripción inexacta de la optimalidad de RaBitQ.</p>
<p><strong>Zilliz:</strong> Antes, la discusión giraba en torno a la mala conducta académica. Ahora también parece una cuestión de desequilibrio y de quién puede dar forma a la historia. ¿Por qué es tan difícil defender su trabajo?</p>
<p><strong>Cheng Long:</strong> Uno de los problemas es la escala. Las conferencias sobre IA son ahora tan grandes que un solo ciclo puede reunir decenas de miles de artículos. Los organizadores simplemente no tienen capacidad para gestionar todas las disputas de este tipo.</p>
<p>El otro problema es el desequilibrio. Las grandes empresas tienen una voz pública mucho más fuerte. Los investigadores independientes o los equipos más pequeños no tienen el mismo poder de comunicación.</p>
<p><strong>Jianyang Gao:</strong> Para los particulares, el coste es altísimo. El profesor Long y yo apenas hemos podido trabajar con normalidad en las últimas semanas.</p>
<p>El proceso en sí también ha sido frustrante. Nos rechazaron rotundamente cuando nos pusimos en contacto con los autores, y no recibimos respuesta de los organizadores de la conferencia. En la práctica, muchos investigadores contemplan situaciones como ésta y deciden dejarlas pasar. Pero así es también como muchas contribuciones originales desaparecen de la narrativa pública.</p>
<p><strong>Zilliz:</strong> Parece que no es la primera vez que su equipo se encuentra con este tipo de problemas.</p>
<p><strong>Cheng Long:</strong> No, no lo es.</p>
<p>Ya hemos visto casos en los que las empresas toman RaBitQ, le hacen algunas modificaciones de ingeniería, le dan un nuevo nombre y luego lo describen sólo como algo inspirado en RaBitQ.</p>
<p>Por eso aprecio la forma en que algunos equipos de la industria manejan esto, incluido Milvus. Cuando utilizan RaBitQ, lo describen objetivamente. Y cuando añaden optimizaciones más allá de la versión original, las explican claramente como su propia contribución de ingeniería. De este modo se reconoce el trabajo original y se demuestra la solidez técnica de la empresa.</p>
<p><strong>Zilliz:</strong> Cuando las grandes empresas se basan en trabajos académicos, ¿suelen ofrecer algún tipo de participación financiera o reparto de beneficios?</p>
<p><strong>Jianyang Gao:</strong> En la mayoría de los casos, no.</p>
<p>Dicho esto, las grandes empresas siguen teniendo un gran incentivo para presentar un avance técnico como algo que han creado ellas mismas y no como algo que han adoptado de otros. Todo el mundo quiere que los clientes y los inversores vean el trabajo más avanzado como el resultado de la innovación de su propio equipo.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">¿Cuál es el futuro de la cuantización vectorial?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz</strong>: ¿En qué líneas de investigación están trabajando ahora?</p>
<p><strong>Cheng Long:</strong> Gran parte de nuestro trabajo seguirá centrándose en la recuperación de vectores.</p>
<p>Una de ellas es combinar RaBitQ con distintos índices de recuperación vectorial, como IVF y HNSW, para que el sistema pueda soportar datos a mayor escala con menor latencia, mayor concurrencia y menor coste. También estoy prestando atención a la compresión de la caché KV.</p>
<p><strong>Jianyang Gao:</strong> La caché KV en grandes modelos y la recuperación vectorial comparten muchas de las mismas propiedades, tanto matemáticas como a nivel de sistemas, porque ambas tratan con vectores de alta dimensión.</p>
<p>De cara al futuro, quiero pensar más en cómo aplicar herramientas matemáticas, incluidas ideas de probabilidad de alta dimensión, para acelerar la inferencia y el entrenamiento.</p>
<p><strong>Zilliz:</strong> ¿Dónde está el techo de la cuantificación vectorial como campo? ¿Cuánto queda por mejorar?</p>
<p><strong>Cheng Long:</strong> Desde un punto de vista teórico, el techo está ampliamente a la vista. RaBitQ ya es asintóticamente óptimo.</p>
<p>Pero aún queda mucho margen en el aspecto técnico. Todavía hay que tener en cuenta las características del hardware, la distribución de los datos, las limitaciones de latencia y muchos otros factores prácticos. Precisamente por eso, los sistemas de producción siguen necesitando un trabajo minucioso en áreas como <a href="https://milvus.io/docs/architecture_overview.md">la arquitectura de bases de datos vectoriales distribuidas</a>, el <a href="https://milvus.io/docs/sparse_vector.md">soporte de vectores dispersos</a>, <a href="https://milvus.io/docs/reranking.md">los pipelines de reranking</a> y la selección de <a href="https://milvus.io/docs/metric.md">métricas</a> en la <a href="https://milvus.io/docs/metric.md">métrica de distancia Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Seguir leyendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Si desea profundizar en la parte de ingeniería de RaBitQ y cómo encaja en Milvus, estos son los recursos más relevantes:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ documentation</a> - detalles de configuración y guía de ajuste.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Profundización en la integración de RaBitQ</a>: cómo Milvus convirtió RaBitQ en un índice de producción.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Cómo afecta la cuantización vectorial a los costes de infraestructura de la IA</a>: nuestro análisis más amplio del debate TurboQuant-RaBitQ.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Publicación de Milvus 2.6</a> - donde IVF_RABITQ se lanzó como una opción real de índice Milvus.</li>
<li><a href="https://milvus.io/docs/index-explained.md">El índice Milvus explicado</a> - cómo IVF_RABITQ encaja con otras opciones de índice.</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">Indexación IVF_FLAT</a> e <a href="https://milvus.io/docs/hnsw.md">indexación HNSW</a> - líneas de base útiles si está comparando compensaciones de índices.</li>
<li><a href="https://milvus.io/docs/schema.md">Diseño de esquemas en Milvus</a> y <a href="https://milvus.io/docs/filtered-search.md">búsqueda filtrada</a>: útil si está evaluando RaBitQ en una aplicación real y no de forma aislada.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Inicio rápido de Milvus</a> y <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">diseño del sistema RAG</a> - útil si desea probar esto en una canalización de recuperación.</li>
</ul>
<p>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> o <a href="https://milvus.io/office-hours">reserve Milvus Office Hours</a> si desea hablar sobre su carga de trabajo.</p>
<p>Si prefiere omitir la configuración de la infraestructura, puede <a href="https://cloud.zilliz.com/signup">suscribirse a Zilliz Cloud</a> (Milvus totalmente gestionado).</p>
