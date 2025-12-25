---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  Embedding First, Then Chunking: Recuperación RAG más inteligente con
  fragmentación semántica máxima y mínima
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Descubra cómo el Max-Min Semantic Chunking aumenta la precisión de la RAG
  utilizando un enfoque de incrustación que crea fragmentos más inteligentes,
  mejora la calidad del contexto y ofrece un mejor rendimiento de recuperación.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">La Generación de Recuperación Aumentada (RAG)</a> se ha convertido en el enfoque por defecto para proporcionar contexto y memoria a las aplicaciones de IA: los agentes de IA, los asistentes de atención al cliente, las bases de conocimiento y los sistemas de búsqueda confían en ella.</p>
<p>En casi todas las canalizaciones RAG, el proceso estándar es el mismo: tomar los documentos, dividirlos en trozos y, a continuación, incrustar esos trozos para la recuperación de similitudes en una base de datos vectorial como <a href="https://milvus.io/">Milvus</a>. Dado que <strong>la fragmentación</strong> se realiza por adelantado, la calidad de los trozos afecta directamente a la calidad de la recuperación de la información y a la precisión de las respuestas finales.</p>
<p>El problema es que las estrategias tradicionales de fragmentación suelen dividir el texto sin ninguna comprensión semántica. La fragmentación de longitud fija se basa en el recuento de tokens y la fragmentación recursiva utiliza una estructura superficial, pero ambas ignoran el significado real del texto. Como resultado, a menudo se separan las ideas relacionadas, se agrupan las líneas no relacionadas y se fragmenta el contexto importante.</p>
<p>En este blog, me gustaría compartir una estrategia de chunking diferente: <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a>. En lugar de trocear primero, incrusta el texto por adelantado y utiliza la similitud semántica para decidir dónde deben formarse los límites. Al incrustar antes de cortar, la cadena puede seguir los cambios naturales de significado en lugar de depender de límites arbitrarios de longitud.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Funcionamiento de una canalización RAG típica<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La mayoría de los procesos RAG, independientemente del marco de trabajo, siguen la misma línea de montaje de cuatro etapas. Es probable que usted mismo haya escrito alguna versión de esto:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. 1. Limpieza y fragmentación de los datos</h3><p>El proceso comienza con la limpieza de los documentos en bruto: eliminación de encabezados, pies de página, texto de navegación y todo lo que no sea contenido real. Una vez eliminado el ruido, el texto se divide en trozos más pequeños. La mayoría de los equipos utilizan trozos de tamaño fijo (300-800 tokens) para que el modelo de incrustación sea manejable. El inconveniente es que las divisiones se basan en la longitud, no en el significado, por lo que los límites pueden ser arbitrarios.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Incrustación y almacenamiento</h3><p>Cada trozo se incrusta utilizando un modelo de incrustación como el de OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> o el codificador de BAAI. Los vectores resultantes se almacenan en una base de datos vectorial como <a href="https://milvus.io/">Milvus</a> o <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. La base de datos gestiona la indexación y la búsqueda de similitudes para que puedas comparar rápidamente las nuevas consultas con todos los chunks almacenados.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Consulta de</h3><p>Cuando un usuario formula una pregunta -por ejemplo, <em>"¿Cómo reduce la RAG las alucinaciones?"</em> - el sistema incorpora la consulta y la envía a la base de datos. La base de datos devuelve los K trozos cuyos vectores se acercan más a la pregunta. Estos son los fragmentos de texto en los que se basará el modelo para responder a la pregunta.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Generación de respuestas</h3><p>Los trozos recuperados se agrupan con la consulta del usuario y se introducen en un LLM. El modelo genera una respuesta utilizando el contexto proporcionado como base.</p>
<p><strong>La fragmentación se encuentra al principio de todo este proceso, pero tiene un impacto enorme</strong>. Si los trozos coinciden con el significado natural del texto, la recuperación es precisa y coherente. Si los trozos se cortan en lugares incómodos, al sistema le cuesta más encontrar la información correcta, incluso con incrustaciones sólidas y una base de datos vectorial rápida.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Los retos de la fragmentación correcta</h3><p>La mayoría de los sistemas GAR actuales utilizan uno de los dos métodos básicos de fragmentación, ambos con limitaciones.</p>
<p><strong>1. Troceado de tamaño fijo</strong></p>
<p>Es el método más sencillo: dividir el texto por un número fijo de tokens o caracteres. Es rápido y predecible, pero ignora por completo la gramática, los temas o las transiciones. Las frases pueden reducirse a la mitad. A veces incluso palabras. Las incrustaciones que se obtienen de estos trozos tienden a ser ruidosas porque los límites no reflejan cómo está estructurado realmente el texto.</p>
<p><strong>2. División recursiva de caracteres</strong></p>
<p>Este método es un poco más inteligente. Divide el texto jerárquicamente basándose en pistas como párrafos, saltos de línea u oraciones. Si una sección es demasiado larga, la divide de forma recursiva. En general, el resultado es más coherente, pero sigue siendo incoherente. Algunos documentos carecen de una estructura clara o tienen secciones de longitud desigual, lo que afecta a la precisión de la recuperación. Y en algunos casos, este método produce trozos que superan la ventana de contexto del modelo.</p>
<p>Ambos métodos se enfrentan a la misma disyuntiva: precisión frente a contexto. Los trozos más pequeños mejoran la precisión de la recuperación pero pierden el contexto circundante; los trozos más grandes conservan el significado pero corren el riesgo de añadir ruido irrelevante. Alcanzar el equilibrio adecuado es lo que hace que la fragmentación sea fundamental -y frustrante- en el diseño de sistemas GAR.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">Fragmentación semántica Max-Min: Incrustar primero, trocear después<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, S.R. Bhat et al. publicaron <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval: A Multi-Dataset</em></a> Analysis. Una de sus principales conclusiones es que no existe un único <strong>"mejor"</strong> tamaño de fragmento para la RAG. Los trozos pequeños (64-128 tokens) tienden a funcionar mejor con preguntas de tipo factual o de búsqueda, mientras que los trozos más grandes (512-1024 tokens) ayudan en tareas narrativas o de razonamiento de alto nivel. En otras palabras, los trozos de tamaño fijo son siempre un compromiso.</p>
<p>Esto plantea una pregunta natural: en lugar de elegir una longitud y esperar lo mejor, ¿podemos fragmentar por significado en lugar de por tamaño? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a> es un método que he encontrado y que intenta precisamente eso.</p>
<p>La idea es sencilla: <strong>incrustar primero, trocear después</strong>. En lugar de dividir el texto y luego incrustar los trozos que caen, el algoritmo incrusta <em>todas las frases</em> al principio. A continuación, utiliza las relaciones semánticas entre las frases incrustadas para decidir dónde deben ir los límites.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagrama del flujo de trabajo "incrustar primero, trocear después" en el método de troceado semántico Max-Min</span> </span></p>
<p>Conceptualmente, el método trata la fragmentación como un problema de agrupación restringida en el espacio de incrustación. Se recorre el documento en orden, frase a frase. Para cada frase, el algoritmo compara su incrustación con las del trozo actual. Si la nueva frase está semánticamente lo suficientemente cerca, se une al chunk. Si está demasiado lejos, el algoritmo empieza un nuevo chunk. La restricción clave es que los trozos deben seguir el orden original de las frases: sin reordenación ni agrupación global.</p>
<p>El resultado es un conjunto de trozos de longitud variable que reflejan dónde cambia realmente el significado del documento, en lugar de dónde un contador de caracteres llega a cero.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Funcionamiento de la estrategia de agrupación semántica Max-Min<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>El Max-Min Semantic Chunking determina los límites de los trozos comparando cómo se relacionan las frases entre sí en el espacio vectorial de alta dimensión. En lugar de basarse en longitudes fijas, examina cómo cambia el significado a lo largo del documento. El proceso se divide en seis pasos:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. 1. Incrustar todas las frases e iniciar un chunk</h3><p>El modelo de incrustación convierte cada frase del documento en una incrustación vectorial. Procesa las frases en orden. Si las primeras <em>n-k</em> frases forman el trozo actual C, hay que evaluar la siguiente frase (sₙ₋ₖ₊₁): ¿debe unirse a C o iniciar un nuevo trozo?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Medir cómo de consistente es el chunk actual</h3><p>Dentro del fragmento C, calcule la similitud coseno por pares mínima entre todas las incrustaciones de frases. Este valor refleja lo estrechamente relacionadas que están las frases dentro del chunk. Una similitud mínima más baja indica que las frases están menos relacionadas, lo que sugiere que puede ser necesario dividir el trozo.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Comparar la nueva frase con el fragmento</h3><p>A continuación, calcule la máxima similitud coseno entre la nueva frase y cualquier frase que ya esté en C. Esto refleja lo bien que la nueva frase se alinea semánticamente con el trozo existente.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Decidir si se amplía el chunk o se crea uno nuevo.</h3><p>Esta es la regla principal:</p>
<ul>
<li><p>Si <strong>la similitud máxima de</strong> la nueva frase con el chunk <strong>C</strong> es <strong>mayor o igual que la</strong> <strong>similitud mínima dentro de C</strong>, → La nueva frase encaja y permanece en el chunk.</p></li>
<li><p>En caso contrario, → se inicia un nuevo chunk.</p></li>
</ul>
<p>Esto asegura que cada chunk mantiene su consistencia semántica interna.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Ajustar los umbrales a medida que cambia el documento</h3><p>Para optimizar la calidad de los chunk, parámetros como el tamaño del chunk y los umbrales de similitud pueden ajustarse dinámicamente. Esto permite que el algoritmo se adapte a las diferentes estructuras y densidades semánticas de los documentos.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Gestión de las primeras frases</h3><p>Cuando un chunk contiene sólo una frase, el algoritmo gestiona la primera comparación utilizando un umbral de similitud fijo. Si la similitud entre la frase 1 y la frase 2 es superior a ese umbral, forman un chunk. Si no, se separan inmediatamente.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Puntos fuertes y limitaciones del Max-Min Semantic Chunking<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>El Max-Min Semantic Chunking mejora la forma en que los sistemas RAG dividen el texto al utilizar el significado en lugar de la longitud, pero no es una bala de plata. A continuación, le ofrecemos una visión práctica de sus puntos fuertes y sus puntos débiles.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">Lo que hace bien</h3><p>El Max-Min Semantic Chunking mejora el chunking tradicional en tres aspectos importantes:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Límites de trozos dinámicos y basados en el significado</strong></h4><p>A diferencia de los enfoques basados en estructuras o tamaños fijos, este método se basa en la similitud semántica para guiar el chunking. Compara la similitud mínima dentro del trozo actual (su grado de cohesión) con la similitud máxima entre la nueva frase y ese trozo (su grado de ajuste). Si esta última es mayor, la frase se une al trozo; en caso contrario, se inicia un nuevo trozo.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Ajuste de parámetros sencillo y práctico</strong></h4><p>El algoritmo sólo depende de tres hiperparámetros básicos:</p>
<ul>
<li><p>el <strong>tamaño máximo del trozo</strong></p></li>
<li><p>la <strong>similitud mínima</strong> entre las dos primeras frases, y</p></li>
<li><p>el <strong>umbral</strong> de similitud para añadir nuevas frases.</p></li>
</ul>
<p>Estos parámetros se ajustan automáticamente en función del contexto: los trozos más grandes requieren umbrales de similitud más estrictos para mantener la coherencia.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Baja sobrecarga de procesamiento</strong></h4><p>Dado que el proceso RAG ya calcula la incrustación de las frases, Max-Min Semantic Chunking no añade una gran carga computacional. Todo lo que necesita es un conjunto de comprobaciones de similitud coseno mientras explora las frases. Esto lo hace más barato que muchas técnicas de agrupación semántica que requieren modelos adicionales o agrupación en varias etapas.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">Lo que aún no puede resolver</h3><p>El Max-Min Semantic Chunking mejora los límites de los trozos, pero no elimina todos los retos de la segmentación de documentos. Dado que el algoritmo procesa las frases en orden y sólo las agrupa localmente, puede pasar por alto relaciones de largo alcance en documentos más largos o complejos.</p>
<p>Un problema común es <strong>la fragmentación del contexto</strong>. Cuando hay información importante repartida en distintas partes de un documento, el algoritmo puede colocar esas partes en trozos separados. Cada fragmento contiene sólo una parte del significado.</p>
<p>Por ejemplo, en las notas de la versión 2.4.13 de Milvus, como se muestra a continuación, un fragmento puede contener el identificador de la versión mientras que otro contiene la lista de características. Una consulta como <em>"¿Qué nuevas características se introdujeron en Milvus 2.4.13?"</em> depende de ambos. Si esos detalles están divididos en diferentes trozos, el modelo de incrustación puede no conectarlos, lo que conduce a una recuperación más débil.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Ejemplo que muestra la fragmentación del contexto en Milvus 2.4.13 Release Notes con el identificador de versión y la lista de características en trozos separados</span> </span></li>
</ul>
<p>Esta fragmentación también afecta a la fase de generación del LLM. Si la referencia de la versión está en un fragmento y las descripciones de las características en otro, el modelo recibe un contexto incompleto y no puede razonar con claridad sobre la relación entre ambos.</p>
<p>Para mitigar estos casos, los sistemas suelen utilizar técnicas como las ventanas deslizantes, el solapamiento de los límites de los trozos o los escaneos de varias pasadas. Estos enfoques reintroducen parte del contexto que falta, reducen la fragmentación y ayudan a que la fase de recuperación conserve la información relacionada.</p>
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
    </button></h2><p>El Max-Min Semantic Chunking no es una solución mágica para todos los problemas de RAG, pero nos ofrece una forma más sensata de pensar en los límites de los trozos. En lugar de dejar que los límites de los tokens decidan dónde se trocean las ideas, utiliza incrustaciones para detectar dónde cambia realmente el significado. Para muchos documentos del mundo real -API, especificaciones, registros, notas de la versión, guías de solución de problemas- esto por sí solo puede aumentar notablemente la calidad de la recuperación.</p>
<p>Lo que más me gusta de este enfoque es que se adapta de forma natural a los procesos de RAG existentes. Si ya incrusta frases o párrafos, el coste adicional consiste básicamente en unas cuantas comprobaciones de similitud del coseno. No se necesitan modelos adicionales, agrupaciones complejas ni preprocesamientos pesados. Y cuando funciona, los trozos que produce parecen más "humanos", más parecidos a cómo agrupamos mentalmente la información al leer.</p>
<p>Pero el método sigue teniendo puntos ciegos. Sólo ve el significado localmente y no puede volver a conectar la información que está intencionadamente separada. Siguen siendo necesarias las ventanas superpuestas, las exploraciones de varias pasadas y otros trucos para preservar el contexto, sobre todo en documentos en los que las referencias y las explicaciones viven lejos unas de otras.</p>
<p>Aun así, el Max-Min Semantic Chunking nos lleva en la dirección correcta: lejos de la fragmentación arbitraria del texto y hacia procesos de recuperación que respeten realmente la semántica. Si está explorando formas de hacer que RAG sea más fiable, merece la pena experimentar con él.</p>
<p>¿Tienes preguntas o quieres profundizar en la mejora del rendimiento de RAG? Únete a nuestro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> y conecta con ingenieros que construyen y ajustan sistemas de recuperación reales cada día.</p>
