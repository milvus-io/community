---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: 'Construí una investigación profunda con código abierto, ¡y tú también puedes!'
author: Stefan Webb
date: 2025-02-6
desc: >-
  Aprenda a crear un agente al estilo de Deep Research utilizando herramientas
  de código abierto como Milvus, DeepSeek R1 y LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bueno, en realidad, un agente de alcance mínimo que puede razonar, planificar, utilizar herramientas, etc. para realizar investigaciones utilizando Wikipedia. Aún así, no está mal para unas pocas horas de trabajo...</p>
<p>A menos que residas bajo una roca, en una cueva o en un remoto monasterio de montaña, habrás oído hablar del lanzamiento de <em>Deep Research</em> por parte de OpenAI el 2 de febrero de 2025. Este nuevo producto promete revolucionar la forma en que respondemos a preguntas que requieren la síntesis de grandes cantidades de información diversa.</p>
<p>El usuario teclea su consulta, selecciona la opción Deep Research y la plataforma busca de forma autónoma en la red, realiza un razonamiento sobre lo que descubre y sintetiza múltiples fuentes en un informe coherente y completamente citado. Tarda varios órdenes de magnitud más en producir sus resultados que un chatbot estándar, pero el resultado es más detallado, más informado y más matizado.</p>
<h2 id="How-does-it-work" class="common-anchor-header">¿Cómo funciona?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Pero, ¿cómo funciona esta tecnología y por qué Deep Research supone una mejora notable con respecto a intentos anteriores (como la <em>Deep Research</em> de Google: alerta de conflicto de marcas entrante)? Dejaremos esto último para un próximo post. En cuanto a lo primero, no cabe duda de que hay mucha "salsa secreta" subyacente en Deep Research. Podemos extraer algunos detalles de la publicación de OpenAI, que resumo.</p>
<p><strong>Deep Research explota los recientes avances en modelos de fundamentos especializados para tareas de razonamiento:</strong></p>
<ul>
<li><p>"...afinado en el próximo modelo de razonamiento OpenAI o3..."</p></li>
<li><p>"...aprovecha el razonamiento para buscar, interpretar y analizar cantidades masivas de texto...".</p></li>
</ul>
<p><strong>Deep Research hace uso de un sofisticado flujo de trabajo agéntico con planificación, reflexión y memoria:</strong></p>
<ul>
<li><p>"...aprendió a planificar y ejecutar una trayectoria de múltiples pasos..."</p></li>
<li><p>"...retrocediendo y reaccionando a la información en tiempo real..."</p></li>
<li><p>"...pivotar según sea necesario en reacción a la información que encuentra..."</p></li>
</ul>
<p><strong>Deep Research se entrena con datos propios, utilizando varios tipos de ajuste fino, lo que probablemente sea un componente clave de su rendimiento:</strong></p>
<ul>
<li><p>"...entrenado utilizando aprendizaje de refuerzo de extremo a extremo en tareas difíciles de navegación y razonamiento a través de una gama de dominios..."</p></li>
<li><p>"...optimizado para la navegación web y el análisis de datos...".</p></li>
</ul>
<p>El diseño exacto del flujo de trabajo agéntico es un secreto, sin embargo, podemos construir algo nosotros mismos basándonos en ideas bien establecidas sobre cómo estructurar agentes.</p>
<p><strong>Una nota antes de empezar</strong>: Es fácil dejarse llevar por la fiebre de la IA Generativa, especialmente cuando se lanza un nuevo producto que parece un paso adelante. Sin embargo, la Investigación Profunda, como reconoce OpenAI, tiene limitaciones comunes a la tecnología de IA Generativa. Deberíamos acordarnos de pensar de forma crítica sobre el resultado, ya que puede contener hechos falsos ("alucinaciones"), formato y citas incorrectos, y variar significativamente en calidad en función de la semilla aleatoria.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">¿Puedo crear mi propia IA?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Por supuesto. Construyamos nuestra propia "Investigación Profunda", funcionando localmente y con herramientas de código abierto. Sólo contaremos con conocimientos básicos de IA Generativa, sentido común, un par de horas libres, una GPU y las herramientas de código abierto <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> y <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Por supuesto, no podemos esperar replicar el rendimiento de OpenAI, pero nuestro prototipo demostrará mínimamente algunas de las ideas clave que probablemente subyacen en su tecnología, combinando avances en los modelos de razonamiento con avances en los flujos de trabajo agénticos. Es importante destacar que, a diferencia de OpenAI, sólo utilizaremos herramientas de código abierto y podremos desplegar nuestro sistema localmente.</p>
<p>Haremos algunas suposiciones simplificadoras para reducir el alcance de nuestro proyecto:</p>
<ul>
<li><p>Utilizaremos un modo de razonamiento de código abierto destilado y <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">cuantificado</a> para 4 bits que pueda ejecutarse localmente.</p></li>
<li><p>No realizaremos ajustes adicionales en nuestro modelo de razonamiento.</p></li>
<li><p>La única herramienta con la que cuenta nuestro agente es la capacidad de descargar y leer una página de Wikipedia y realizar consultas RAG independientes (no tendremos acceso a toda la web).</p></li>
<li><p>Nuestro agente sólo procesará datos de texto, no imágenes, PDFs, etc.</p></li>
<li><p>Nuestro agente no retrocederá ni tendrá en cuenta pivotes.</p></li>
<li><p>Nuestro agente (aún no) controlará su flujo de ejecución basándose en su salida.</p></li>
<li><p>Wikipedia contiene la verdad, toda la verdad y nada más que la verdad.</p></li>
</ul>
<p>Utilizaremos <a href="https://milvus.io/docs">Milvus</a> para nuestra base de datos vectorial, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> como modelo de razonamiento y <a href="https://python.langchain.com/docs/introduction/">LangChain</a> para implementar RAG. Empecemos.</p>
<custom-h1>Un agente mínimo para la investigación en línea</custom-h1><p>Utilizaremos nuestro modelo mental de cómo los humanos llevan a cabo la investigación para diseñar el flujo de trabajo del agente:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Definir/Refinar pregunta</h3><p>La investigación comienza definiendo una pregunta. Tomamos la pregunta como la consulta del usuario, pero utilizamos nuestro modelo de razonamiento para asegurarnos de que la pregunta se expresa de forma específica, clara y centrada. Es decir, nuestro primer paso es reescribir la pregunta y extraer cualquier subconsulta o subpregunta. Hacemos un uso eficaz de la especialización de nuestros modelos de base para el razonamiento y de un método sencillo para la salida estructurada en JSON.</p>
<p>He aquí un ejemplo de razonamiento a medida que DeepSeek refina la pregunta "¿Cómo ha cambiado el reparto a lo largo del tiempo?":</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Búsqueda</h3><p>A continuación, realizamos una "revisión bibliográfica" de los artículos de Wikipedia. Por ahora, leemos un solo artículo y dejamos los enlaces de navegación para una iteración futura. Durante el prototipado descubrimos que la exploración de enlaces puede resultar muy costosa si cada enlace requiere una llamada al modelo de razonamiento. Analizamos el artículo y almacenamos sus datos en nuestra base de datos vectorial, Milvus, como si tomáramos notas.</p>
<p>He aquí un fragmento de código que muestra cómo almacenamos nuestra página de Wikipedia en Milvus utilizando su integración LangChain:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Analizar</h3><p>El agente vuelve a sus preguntas y las responde basándose en la información relevante del documento. Dejaremos un flujo de trabajo de análisis/reflexión en varios pasos para futuros trabajos, así como cualquier reflexión crítica sobre la credibilidad y el sesgo de nuestras fuentes.</p>
<p>He aquí un fragmento de código que ilustra la construcción de una RAG con LangChain y la respuesta a nuestras subpreguntas por separado.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Sintetizar</h3><p>Una vez que el agente ha realizado su investigación, crea un esquema estructurado, o mejor dicho, un esqueleto, de sus conclusiones para resumirlas en un informe. A continuación, completa cada sección con un título y el contenido correspondiente. Dejamos para una futura iteración un flujo de trabajo más sofisticado con reflexión, reordenación y reescritura. Esta parte del agente implica planificación, uso de herramientas y memoria.</p>
<p>Consulte el <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">cuaderno adjunto</a> para ver el código completo y el <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">archivo de informe guardado</a> para ver un ejemplo de salida.</p>
<h2 id="Results" class="common-anchor-header">Resultados<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestra consulta para las pruebas es <em>"¿Cómo han cambiado Los Simpson con el tiempo?"</em> y la fuente de datos es el artículo de Wikipedia sobre "Los Simpson". A continuación se muestra una sección del <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">informe generado</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Resumen: Lo que hemos construido y lo que queda por hacer<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>En tan sólo unas horas, hemos diseñado un flujo de trabajo básico que puede razonar, planificar y recuperar información de Wikipedia para generar un informe de investigación estructurado. Aunque este prototipo está lejos de la Investigación Profunda de OpenAI, demuestra el poder de las herramientas de código abierto como Milvus, DeepSeek, y LangChain en la construcción de agentes autónomos de investigación.</p>
<p>Por supuesto, hay mucho margen de mejora. Las futuras iteraciones podrían:</p>
<ul>
<li><p>Ampliar más allá de Wikipedia para buscar múltiples fuentes dinámicamente</p></li>
<li><p>Introducir el backtracking y la reflexión para refinar las respuestas.</p></li>
<li><p>Optimizar el flujo de ejecución basándose en el propio razonamiento del agente.</p></li>
</ul>
<p>El código abierto nos da una flexibilidad y un control que el código cerrado no nos da. Ya sea para la investigación académica, la síntesis de contenidos o la asistencia basada en IA, la creación de nuestros propios agentes de investigación abre posibilidades apasionantes. Permanece atento al próximo post, en el que exploraremos la incorporación de la recuperación web en tiempo real, el razonamiento multipaso y el flujo de ejecución condicional.</p>
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
<li><p>Cuaderno de notas:<a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>"Línea de base para una investigación profunda de código abierto</em></a><em>"</em></p></li>
<li><p>Informe:<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>"La evolución de Los Simpson como programa a lo largo del tiempo, abarcando cambios en el contenido, el humor, el desarrollo de personajes, la animación y su papel en la sociedad</em></a><em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>.</em></a></p></li>
<li><p><a href="https://milvus.io/docs">Documentación de la base de datos vectorial Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Página del modelo DeepSeek R1 destilado y cuantizado</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Preguntas frecuentes sobre la investigación profunda | Centro de ayuda de OpenAI</a></p></li>
</ul>
