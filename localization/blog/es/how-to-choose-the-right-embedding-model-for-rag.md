---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 'De Word2Vec a LLM2Vec: Cómo elegir el modelo de incrustación adecuado para RAG'
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  Este blog le mostrará cómo evaluar las incrustaciones en la práctica, para que
  pueda elegir la que mejor se adapte a su sistema GAR.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>Los grandes modelos lingüísticos son potentes, pero tienen un punto débil bien conocido: las alucinaciones. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">La generación mejorada por recuperación (RAG</a> ) es una de las formas más eficaces de resolver este problema. En lugar de basarse únicamente en la memoria del modelo, la RAG recupera los conocimientos pertinentes de una fuente externa y los incorpora a la pregunta, garantizando así que las respuestas se basen en datos reales.</p>
<p>Un sistema RAG suele constar de tres componentes principales: el propio LLM, una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> como <a href="https://milvus.io/">Milvus</a> para almacenar y buscar información, y un modelo de incrustación. El modelo de incrustación es el que convierte el lenguaje humano en vectores legibles por la máquina. Es el traductor entre el lenguaje natural y la base de datos. La calidad de este traductor determina la pertinencia del contexto recuperado. Si se hace bien, los usuarios verán respuestas precisas y útiles. Si se hace mal, incluso la mejor infraestructura produce ruido, errores y pérdida de cálculo.</p>
<p>Por eso es tan importante comprender los modelos de incrustación. Hay muchos entre los que elegir: desde los primeros métodos, como Word2Vec, hasta los modelos modernos basados en LLM, como la familia de incrustación de texto de OpenAI. Cada uno tiene sus propias ventajas y desventajas. Esta guía le ayudará a despejar la confusión y le mostrará cómo evaluar las incrustaciones en la práctica, para que pueda elegir la que mejor se adapte a su sistema GAR.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">¿Qué son las incrustaciones y por qué son importantes?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>En el nivel más simple, las incrustaciones convierten el lenguaje humano en números que las máquinas pueden entender. Cada palabra, frase o documento se asigna a un espacio vectorial de alta dimensión, donde la distancia entre vectores captura las relaciones entre ellos. Los textos con significados similares tienden a agruparse, mientras que los contenidos no relacionados tienden a alejarse. Esto es lo que hace posible la búsqueda semántica: encontrar significados, no sólo palabras clave.</p>
<p>No todos los modelos de incrustación funcionan igual. Por lo general, se dividen en tres categorías, cada una con sus ventajas y desventajas:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Los vectores dispersos</strong></a> (como BM25) se centran en la frecuencia de las palabras clave y la longitud del documento. Son excelentes para las coincidencias explícitas, pero no tienen en cuenta los sinónimos ni el contexto: "IA" e "inteligencia artificial" no tendrían nada que ver.</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Los vectores densos</strong></a> (como los producidos por BERT) captan una semántica más profunda. Pueden ver que "Apple lanza un nuevo teléfono" está relacionado con "lanzamiento de un producto iPhone", incluso sin compartir palabras clave. El inconveniente es el mayor coste computacional y la menor interpretabilidad.</p></li>
<li><p><strong>Los modelos híbridos</strong> (como BGE-M3) combinan ambos aspectos. Pueden generar representaciones dispersas, densas o multivectoriales simultáneamente, preservando la precisión de la búsqueda por palabras clave y captando al mismo tiempo los matices semánticos.</p></li>
</ul>
<p>En la práctica, la elección depende del caso de uso: vectores dispersos para mayor rapidez y transparencia, densos para un significado más rico, e híbridos cuando se desea lo mejor de ambos mundos.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Ocho factores clave para evaluar los modelos de incrustación<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 Ventana de contexto</strong></h3><p>La <a href="https://zilliz.com/glossary/context-window"><strong>ventana de contexto</strong></a> determina la cantidad de texto que un modelo puede procesar a la vez. Dado que un token equivale aproximadamente a 0,75 palabras, este número limita directamente la longitud del pasaje que el modelo puede "ver" al crear incrustaciones. Una ventana grande permite al modelo captar todo el significado de los documentos más largos; una pequeña le obliga a trocear el texto en partes más pequeñas, con el riesgo de perder el contexto significativo.</p>
<p>Por ejemplo, <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>el modelo de incrustación de texto OpenAI-ada-002</em></a> admite hasta 8.192 tokens, suficientes para abarcar un artículo de investigación completo, incluidos el resumen, los métodos y la conclusión. Por el contrario, los modelos con ventanas de sólo 512 tokens (como <em>m3e-base</em>) requieren truncamientos frecuentes, lo que puede provocar la pérdida de detalles clave.</p>
<p>Conclusión: si su caso de uso implica documentos largos, como expedientes legales o trabajos académicos, elija un modelo con una ventana de tokens de 8K+. Para textos más breves, como los chats de atención al cliente, una ventana de tokens de 2.000 puede ser suficiente.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">#Unidad de tokenización<strong> nº 2</strong> </h3><p>Antes de generar las incrustaciones, el texto debe dividirse en trozos más pequeños llamados <strong>tokens</strong>. La forma en que se realiza esta tokenización afecta a la capacidad del modelo para tratar palabras raras, términos profesionales y dominios especializados.</p>
<ul>
<li><p><strong>Tokenización de subpalabras (BPE):</strong> Divide las palabras en partes más pequeñas (por ejemplo, "infelicidad" → "un" + "felicidad"). Es el método por defecto en los LLM modernos, como GPT y LLaMA, y funciona bien con palabras fuera de vocabulario.</p></li>
<li><p><strong>WordPiece:</strong> Un refinamiento de BPE utilizado por BERT, diseñado para equilibrar mejor la cobertura del vocabulario con la eficiencia.</p></li>
<li><p><strong>Tokenización por palabras:</strong> Divide sólo por palabras enteras. Es sencilla, pero tiene dificultades con la terminología rara o compleja, por lo que no es adecuada para campos técnicos.</p></li>
</ul>
<p>Para ámbitos especializados como la medicina o el derecho, los modelos basados en subpalabras suelen ser los mejores, ya que pueden tratar correctamente términos como <em>infarto de miocardio</em> o <em>subrogación</em>. Algunos modelos modernos, como <strong>NV-Embed</strong>, van más allá añadiendo mejoras como las capas de atención latente, que mejoran la forma en que la tokenización capta el vocabulario complejo y específico de un dominio.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 Dimensionalidad</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>La dimensionalidad del vector</strong></a> se refiere a la longitud del vector de incrustación, que determina la cantidad de detalles semánticos que puede captar un modelo. Las dimensiones más altas (por ejemplo, 1.536 o más) permiten distinciones más finas entre conceptos, pero tienen el coste de un mayor almacenamiento, consultas más lentas y mayores requisitos de computación. Las dimensiones inferiores (como 768) son más rápidas y baratas, pero corren el riesgo de perder significados sutiles.</p>
<p>La clave está en el equilibrio. Para la mayoría de las aplicaciones de uso general, las dimensiones 768-1.536 son la combinación perfecta de eficacia y precisión. Para tareas que exigen una gran precisión, como las búsquedas académicas o científicas, superar las 2.000 dimensiones puede merecer la pena. Por otro lado, los sistemas con recursos limitados (como las implementaciones edge) pueden utilizar 512 dimensiones de forma eficaz, siempre que se valide la calidad de la recuperación. En algunos sistemas ligeros de recomendación o personalización, incluso dimensiones más pequeñas pueden ser suficientes.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 Tamaño del vocabulario</h3><p>El <strong>tamaño</strong> del vocabulario de un modelo se refiere al número de tokens únicos que su tokenizador puede reconocer. Esto afecta directamente a su capacidad para manejar diferentes idiomas y terminología específica del dominio. Si una palabra o carácter no está en el vocabulario, se marca como <code translate="no">[UNK]</code>, lo que puede hacer que se pierda el significado.</p>
<p>Los requisitos varían según el caso de uso. Los escenarios multilingües suelen necesitar vocabularios más extensos, del orden de 50.000 o más tokens, como en el caso de <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. En el caso de las aplicaciones específicas, lo más importante es la cobertura de términos especializados. Por ejemplo, un modelo jurídico debe admitir de forma nativa términos como <em>&quot;prescripción&quot; o</em> <em>&quot;adquisición de buena fe</em>&quot;, mientras que un modelo chino debe tener en cuenta miles de caracteres y signos de puntuación únicos. Sin una cobertura suficiente del vocabulario, la precisión de la incrustación se reduce rápidamente.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 Datos de entrenamiento</h3><p>Los <strong>datos de entrenamiento</strong> definen los límites de lo que "sabe" un modelo de incrustación. Los modelos entrenados con datos amplios y de uso general -como <em>text-embedding-ada-002</em>, que utiliza una mezcla de páginas web, libros y Wikipedia- suelen funcionar bien en varios dominios. Pero cuando se necesita precisión en campos especializados, los modelos entrenados en el dominio suelen ganar. Por ejemplo, <em>LegalBERT</em> y <em>BioBERT</em> superan a los modelos generales en textos jurídicos y biomédicos, aunque pierden algo de capacidad de generalización.</p>
<p>La regla general:</p>
<ul>
<li><p><strong>Escenarios generales</strong> → utilice modelos entrenados en conjuntos de datos amplios, pero asegúrese de que cubren su(s) idioma(s) de destino. Por ejemplo, las aplicaciones chinas necesitan modelos entrenados en corpus chinos ricos.</p></li>
<li><p><strong>Ámbitos verticales</strong> → elija modelos específicos del ámbito para obtener la máxima precisión.</p></li>
<li><p><strong>Lo mejor de ambos mundos</strong> → modelos más recientes como <strong>NV-Embed</strong>, entrenados en dos etapas con datos generales y específicos del dominio, muestran prometedoras ganancias en generalización <em>y</em> precisión del dominio.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 Coste</h3><p>El coste no es sólo el precio de la API, sino también <strong>el coste económico</strong> y el <strong>coste computacional</strong>. Los modelos de API alojadas, como los de OpenAI, se basan en el uso: se paga por llamada, pero no hay que preocuparse por la infraestructura. Esto los hace perfectos para la creación rápida de prototipos, proyectos piloto o cargas de trabajo a pequeña o mediana escala.</p>
<p>Las opciones de código abierto, como <em>BGE</em> o <em>Sentence-BERT</em>, son de uso gratuito pero requieren una infraestructura autogestionada, normalmente clusters de GPU o TPU. Son más adecuadas para la producción a gran escala, donde el ahorro a largo plazo y la flexibilidad compensan los costes únicos de configuración y mantenimiento.</p>
<p>Conclusión práctica: Los <strong>modelos de API son ideales para la iteración rápida</strong>, mientras que <strong>los modelos de código abierto suelen ganar en la producción a gran escala</strong> una vez que se tiene en cuenta el coste total de propiedad (TCO). Elegir el camino correcto depende de si se necesita velocidad de comercialización o control a largo plazo.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 Puntuación MTEB</h3><p>El <a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a> es el estándar más utilizado para comparar modelos de incrustación. Evalúa el rendimiento en varias tareas, como la búsqueda semántica, la clasificación, la agrupación y otras. Una puntuación más alta suele significar que el modelo es más generalizable en distintos tipos de tareas.</p>
<p>Dicho esto, MTEB no es una bala de plata. Un modelo con una puntuación global alta puede tener un rendimiento inferior en su caso de uso específico. Por ejemplo, un modelo entrenado principalmente en inglés puede obtener buenos resultados en las pruebas comparativas de MTEB, pero tener problemas con textos médicos especializados o datos no ingleses. Lo más seguro es utilizar MTEB como punto de partida y luego validarlo con <strong>sus propios conjuntos de datos</strong> antes de comprometerse.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 Especificidad de dominio</h3><p>Algunos modelos se han creado específicamente para situaciones concretas y brillan allí donde los modelos generales se quedan cortos:</p>
<ul>
<li><p><strong>Legal:</strong> <em>LegalBERT</em> puede distinguir términos jurídicos precisos, como <em>defensa</em> frente a <em>jurisdicción</em>.</p></li>
<li><p><strong>Biomédico:</strong> <em>BioBERT</em> maneja con precisión frases técnicas como <em>ARNm</em> o <em>terapia dirigida</em>.</p></li>
<li><p><strong>Multilingüe:</strong> <em>BGE-M3</em> es compatible con más de 100 idiomas, lo que lo hace idóneo para aplicaciones globales que requieren un puente entre el inglés, el chino y otros idiomas.</p></li>
<li><p><strong>Recuperación de códigos:</strong> <em>Qwen3-Embedding</em> alcanza puntuaciones de primer nivel (81,0+) en <em>MTEB-Code</em>, optimizado para consultas relacionadas con la programación.</p></li>
</ul>
<p>Si su caso de uso entra dentro de uno de estos ámbitos, los modelos optimizados para el ámbito pueden mejorar significativamente la precisión de la recuperación. Pero para aplicaciones más amplias, utilice modelos de uso general, a menos que las pruebas demuestren lo contrario.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Perspectivas adicionales para evaluar las incrustaciones<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de los ocho factores principales, hay otros aspectos que merece la pena tener en cuenta si se desea una evaluación más profunda:</p>
<ul>
<li><p><strong>Alineación multilingüe</strong>: En el caso de los modelos multilingües, no basta con que admitan muchos idiomas. La verdadera prueba es si los espacios vectoriales están alineados. En otras palabras, ¿las palabras semánticamente idénticas (por ejemplo, "cat" en inglés y "gato" en español) están próximas en el espacio vectorial? Una buena alineación garantiza una recuperación coherente en todos los idiomas.</p></li>
<li><p><strong>Pruebas adversariales</strong>: Un buen modelo de incrustación debe ser estable ante pequeños cambios en la entrada. Si se introducen frases casi idénticas (por ejemplo, "El gato se sentó en la alfombra" frente a "El gato se sentó en la alfombra"), se puede comprobar si los vectores resultantes se desplazan razonablemente o fluctúan de forma salvaje. Las grandes oscilaciones suelen indicar una robustez débil.</p></li>
<li><p><strong>La coherencia semántica local</strong> se refiere al fenómeno de comprobar si palabras semánticamente similares se agrupan estrechamente en vecindarios locales. Por ejemplo, dada una palabra como "banco", el modelo debe agrupar adecuadamente los términos relacionados (como "ribera" e "institución financiera") y mantener a distancia los términos no relacionados. Medir la frecuencia con la que las palabras "intrusivas" o irrelevantes se cuelan en estos vecindarios ayuda a comparar la calidad del modelo.</p></li>
</ul>
<p>Estas perspectivas no siempre son necesarias para el trabajo diario, pero resultan útiles para las pruebas de estrés de las incrustaciones en sistemas de producción en los que la estabilidad multilingüe, de alta precisión o adversarial es realmente importante.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Modelos de incrustación habituales: Breve historia<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>La historia de los modelos de incrustación es, en realidad, la historia de cómo las máquinas han aprendido a comprender el lenguaje con mayor profundidad a lo largo del tiempo. Cada generación ha ido superando los límites de la anterior, pasando de las representaciones estáticas de palabras a los modelos de incrustación de gran tamaño (LLM) actuales, capaces de captar los matices del contexto.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: El punto de partida (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Word2Vec de Google</a> fue el primer avance que hizo que las incrustaciones fueran ampliamente prácticas. Se basaba en la <em>hipótesis distribucional</em> de la lingüística, es decir, la idea de que las palabras que aparecen en contextos similares suelen compartir significado. Mediante el análisis de grandes cantidades de texto, Word2Vec mapeó las palabras en un espacio vectorial en el que los términos relacionados se situaban cerca unos de otros. Por ejemplo, "puma" y "leopardo" se agrupaban cerca gracias a que compartían hábitat y características de caza.</p>
<p>Word2Vec tiene dos versiones:</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words):</strong> predice una palabra que falta a partir del contexto que la rodea.</p></li>
<li><p><strong>Skip-Gram</strong>: hace lo contrario: predice las palabras circundantes a partir de una palabra objetivo.</p></li>
</ul>
<p>Este enfoque sencillo pero potente permitía analogías elegantes como:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Para su época, Word2Vec era revolucionario. Pero tenía dos limitaciones importantes. En primer lugar, era <strong>estático</strong>: cada palabra tenía un único vector, por lo que "banco" significaba lo mismo tanto si estaba cerca de "dinero" como de "río". En segundo lugar, sólo funcionaba a nivel de <strong>palabra</strong>, lo que dejaba frases y documentos fuera de su alcance.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT: La revolución de los transformadores (2018)</h3><p>Si Word2Vec nos dio el primer mapa de significado, <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong></a> lo redibujó con mucho más detalle. Lanzado por Google en 2018, BERT marcó el comienzo de la era de <em>la comprensión semántica</em> profunda al introducir la arquitectura Transformer en los embeddings. A diferencia de los LSTM anteriores, Transformers puede examinar todas las palabras de una secuencia simultáneamente y en ambas direcciones, lo que permite un contexto mucho más rico.</p>
<p>La magia de BERT procede de dos inteligentes tareas de preentrenamiento:</p>
<ul>
<li><p><strong>Modelado del lenguaje enmascarado (MLM):</strong> Oculta aleatoriamente palabras en una frase y obliga al modelo a predecirlas, enseñándole a inferir el significado a partir del contexto.</p></li>
<li><p><strong>Predicción de la siguiente frase (NSP):</strong> entrena al modelo para decidir si dos frases se suceden, lo que le ayuda a aprender las relaciones entre frases.</p></li>
</ul>
<p>Bajo el capó, los vectores de entrada de BERT combinaban tres elementos: incrustación de tokens (la palabra en sí), incrustación de segmentos (a qué frase pertenece) e incrustación de posiciones (dónde se sitúa en la secuencia). Juntos, estos elementos permiten a BERT captar relaciones semánticas complejas tanto a nivel de <strong>frase</strong> como de <strong>documento</strong>. Este salto convirtió a BERT en una herramienta puntera para tareas como la respuesta a preguntas y la búsqueda semántica.</p>
<p>Por supuesto, BERT no era perfecto. Sus primeras versiones se limitaban a una <strong>ventana de 512 tokens</strong>, lo que significaba que los documentos largos tenían que trocearse y a veces perdían significado. Sus densos vectores también carecían de interpretabilidad: se podía ver que dos textos coincidían, pero no siempre se podía explicar por qué. Las variantes posteriores, como <strong>RoBERTa</strong>, abandonaron la tarea NSP después de que la investigación demostrara que aportaba pocas ventajas, pero conservaron el potente entrenamiento MLM.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: Fusión de lo disperso y lo denso (2023)</h3><p>En 2023, el campo había madurado lo suficiente como para reconocer que ningún método de incrustación podía lograrlo todo por sí solo. Aparece <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), un modelo híbrido diseñado explícitamente para tareas de recuperación. Su principal innovación es que no sólo produce un tipo de vector, sino que genera vectores densos, vectores dispersos y multivectores a la vez, combinando sus puntos fuertes.</p>
<ul>
<li><p>Los<strong>vectores dens</strong> os captan la semántica profunda, gestionando sinónimos y paráfrasis (por ejemplo, "lanzamiento del iPhone", ≈ "Apple lanza un nuevo teléfono").</p></li>
<li><p>Los<strong>vectores dispers</strong> os asignan pesos explícitos a los términos. Aunque no aparezca una palabra clave, el modelo puede inferir su relevancia; por ejemplo, relacionando "iPhone nuevo producto" con "Apple Inc." y "smartphone".</p></li>
<li><p><strong>Los multivectores</strong> refinan aún más las incrustaciones densas al permitir que cada token contribuya con su propia puntuación de interacción, lo que resulta útil para una recuperación más precisa.</p></li>
</ul>
<p>El proceso de formación de BGE-M3 refleja esta sofisticación:</p>
<ol>
<li><p><strong>Preentrenamiento</strong> en datos masivos no etiquetados con <em>RetroMAE</em> (codificador enmascarado + decodificador de reconstrucción) para construir una comprensión semántica general.</p></li>
<li><p><strong>Ajuste general</strong> mediante aprendizaje contrastivo en 100 millones de pares de textos, lo que mejora su rendimiento de recuperación.</p></li>
<li><p><strong>Ajuste de tareas</strong> con ajuste de instrucciones y muestreo negativo complejo para la optimización de escenarios específicos.</p></li>
</ol>
<p>Los resultados son impresionantes: BGE-M3 maneja múltiples granularidades (desde el nivel de palabra hasta el de documento), ofrece un gran rendimiento multilingüe -especialmente en chino- y equilibra la precisión con la eficiencia mejor que la mayoría de sus competidores. En la práctica, representa un gran paso adelante en la creación de modelos de incrustación potentes y prácticos para la recuperación a gran escala.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">LLM como modelos de incrustación (2023-actualidad)</h3><p>Durante años, la opinión generalizada era que los grandes modelos lingüísticos (LLM) basados únicamente en decodificadores, como GPT, no eran adecuados para la incrustación. Se creía que su atención causal -que sólo se fija en los tokens anteriores- limitaba la comprensión semántica profunda. Sin embargo, investigaciones recientes han invertido este supuesto. Con los ajustes adecuados, los LLM pueden generar incrustaciones que rivalizan, y a veces superan, a los modelos creados a propósito. Dos ejemplos notables son LLM2Vec y NV-Embed.</p>
<p><strong>LLM2Vec</strong> adapta los LLM de sólo descodificador con tres cambios clave:</p>
<ul>
<li><p><strong>Conversión bidireccional de la atención</strong>: sustitución de las máscaras causales para que cada token pueda atender a la secuencia completa.</p></li>
<li><p><strong>Predicción del siguiente testigo enmascarado (MNTP):</strong> un nuevo objetivo de entrenamiento que fomenta la comprensión bidireccional.</p></li>
<li><p><strong>Aprendizaje contrastivo no supervisado</strong>: inspirado en SimCSE, acerca frases semánticamente similares en el espacio vectorial.</p></li>
</ul>
<p><strong>NV-Embed</strong>, por su parte, adopta un enfoque más racionalizado:</p>
<ul>
<li><p><strong>Capas de atención latente:</strong> añade "matrices latentes" entrenables para mejorar la agrupación de secuencias.</p></li>
<li><p><strong>Entrenamiento bidireccional directo:</strong> basta con eliminar las máscaras causales y afinar con el aprendizaje contrastivo.</p></li>
<li><p><strong>Optimización de la agrupación de medias:</strong> utiliza medias ponderadas entre fichas para evitar el "sesgo de la última ficha".</p></li>
</ul>
<p>El resultado es que las incrustaciones modernas basadas en LLM combinan <strong>la comprensión semántica profunda</strong> con la <strong>escalabilidad</strong>. Pueden manejar <strong>ventanas de contexto muy largas (8.000-32.000 tokens)</strong>, lo que las hace especialmente eficaces para tareas con gran cantidad de documentos en investigación, derecho o búsqueda empresarial. Y como reutilizan la misma columna vertebral LLM, a veces pueden ofrecer incrustaciones de alta calidad incluso en entornos más restringidos.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Conclusión: Llevar la teoría a la práctica<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>A la hora de elegir un modelo de incrustación, la teoría no es suficiente. La verdadera prueba es cómo funciona en <em>su</em> sistema con <em>sus</em> datos. Unos pocos pasos prácticos pueden marcar la diferencia entre un modelo que parece bueno sobre el papel y uno que realmente funciona en la producción:</p>
<ul>
<li><p><strong>Realice pruebas con subconjuntos de MTEB.</strong> Utilice puntos de referencia, especialmente tareas de recuperación, para crear una lista inicial de candidatos.</p></li>
<li><p><strong>Realice pruebas con datos empresariales reales.</strong> Cree conjuntos de evaluación a partir de sus propios documentos para medir la recuperación, la precisión y la latencia en condiciones reales.</p></li>
<li><p><strong>Compruebe la compatibilidad con las bases de datos.</strong> Los vectores dispersos requieren un soporte de índice invertido, mientras que los vectores densos de alta dimensión exigen más almacenamiento y cálculo. Asegúrese de que su base de datos vectorial es compatible con su elección.</p></li>
<li><p><strong>Gestione los documentos largos de forma inteligente.</strong> Utilice estrategias de segmentación, como las ventanas deslizantes, para aumentar la eficacia, y combínelas con modelos de ventana de contexto amplio para preservar el significado.</p></li>
</ul>
<p>Desde los sencillos vectores estáticos de Word2Vec hasta las incrustaciones potenciadas por LLM con 32.000 contextos, hemos visto grandes avances en la forma en que las máquinas comprenden el lenguaje. Pero esta es la lección que todo desarrollador acaba aprendiendo: el modelo <em>con mayor puntuación</em> no siempre es el <em>mejor</em> para su caso de uso.</p>
<p>Al fin y al cabo, a los usuarios no les importan las tablas de clasificación MTEB ni los gráficos de referencia: sólo quieren encontrar la información correcta, rápido. Elija el modelo que equilibre la precisión, el coste y la compatibilidad con su sistema, y habrá creado algo que no sólo impresiona en teoría, sino que realmente funciona en el mundo real.</p>
