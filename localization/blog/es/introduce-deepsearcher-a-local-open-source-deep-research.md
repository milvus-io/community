---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'Presentamos DeepSearcher: Una investigación profunda local de código abierto'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  A diferencia de la Investigación Profunda de OpenAI, este ejemplo se ejecutó
  localmente, utilizando únicamente modelos y herramientas de código abierto
  como Milvus y LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>DeepSearcher</span> </span></p>
<p>En el post anterior, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"Construí una investigación profunda con código abierto, ¡y tú también puedes!",</em></a> explicamos algunos de los principios en los que se basan los agentes de investigación y construimos un prototipo sencillo que genera informes detallados sobre un tema o pregunta determinados. El artículo y el cuaderno correspondiente demostraban los conceptos fundamentales del <em>uso de herramientas</em>, la <em>descomposición de consultas</em>, el <em>razonamiento</em> y la <em>reflexión</em>. El ejemplo de nuestro post anterior, en contraste con la Investigación Profunda de OpenAI, se ejecutaba localmente, utilizando únicamente modelos y herramientas de código abierto como <a href="https://milvus.io/docs">Milvus</a> y LangChain. (Te animo a que leas el artículo <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">anterior</a> antes de continuar).</p>
<p>En las semanas siguientes, hubo una explosión de interés en comprender y reproducir la Investigación Profunda de OpenAI. Véase, por ejemplo, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> y <a href="https://huggingface.co/blog/open-deep-research">Hugging Face's Open DeepResearch</a>. Estas herramientas difieren en arquitectura y metodología, aunque comparten un objetivo: investigar de forma iterativa un tema o pregunta navegando por la web o por documentos internos y generar un informe detallado, fundamentado y bien estructurado. Es importante destacar que el agente subyacente automatiza el razonamiento sobre qué acción tomar en cada paso intermedio.</p>
<p>En este post, nos basamos en nuestro post anterior y presentamos el proyecto de código abierto <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> de Zilliz. Nuestro agente demuestra conceptos adicionales: <em>enrutamiento de consultas, flujo de ejecución condicional</em> y <em>rastreo web como herramienta</em>. Se presenta como una biblioteca de Python y una herramienta de línea de comandos en lugar de un cuaderno Jupyter y tiene más funciones que nuestro post anterior. Por ejemplo, puede introducir múltiples documentos fuente y establecer el modelo de incrustación y la base de datos vectorial utilizados mediante un archivo de configuración. Aunque sigue siendo relativamente simple, DeepSearcher es una gran muestra de RAG agéntico y es un paso más hacia un estado de la técnica de aplicaciones de IA.</p>
<p>Además, exploramos la necesidad de servicios de inferencia más rápidos y eficientes. Los modelos de razonamiento hacen uso del "escalado de inferencia", es decir, del cálculo adicional, para mejorar sus resultados, y eso, combinado con el hecho de que un único informe puede requerir cientos o miles de llamadas LLM, hace que el ancho de banda de inferencia sea el principal cuello de botella. Utilizamos el <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">modelo de razonamiento DeepSeek-R1 en el hardware personalizado de SambaNova</a>, que es dos veces más rápido en tokens de salida por segundo que el competidor más cercano (véase la figura siguiente).</p>
<p>SambaNova Cloud también ofrece inferencia como servicio para otros modelos de código abierto, como Llama 3.x, Qwen2.5 y QwQ. El servicio de inferencia se ejecuta en el chip personalizado de SambaNova denominado unidad de flujo de datos reconfigurable (RDU), que está especialmente diseñado para la inferencia eficiente en modelos de IA Generativa, reduciendo el coste y aumentando la velocidad de inferencia. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Más información en su sitio web.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>Velocidad de salida- DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Arquitectura de DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>La arquitectura de <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> sigue la línea de nuestro post anterior, que dividía el problema en cuatro pasos ( <em>definir/refinar la pregunta</em>, <em>investigar</em>, <em>analizar</em> y <em>sintetizar</em> ), aunque esta vez con algunos solapamientos. Repasamos cada paso, destacando las mejoras de <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de DeepSearcher</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Definir y refinar la pregunta</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>En el diseño de DeepSearcher, los límites entre investigar y refinar la pregunta son difusos. La consulta inicial del usuario se descompone en subconsultas, de forma muy similar al post anterior. Véase más arriba las subconsultas iniciales producidas a partir de la consulta "¿Cómo han cambiado Los Simpson con el tiempo?". Sin embargo, el siguiente paso de investigación continuará refinando la pregunta según sea necesario.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Investigación y análisis</h3><p>Una vez desglosada la consulta en subconsultas, comienza la parte de investigación del agente. A grandes rasgos, consta de cuatro pasos: <em>enrutamiento</em>, <em>búsqueda</em>, <em>reflexión y repetición condicional</em>.</p>
<h4 id="Routing" class="common-anchor-header">Enrutamiento</h4><p>Nuestra base de datos contiene varias tablas o colecciones procedentes de distintas fuentes. Sería más eficiente si pudiéramos restringir nuestra búsqueda semántica sólo a aquellas fuentes que son relevantes para la consulta en cuestión. Un enrutador de consultas pide a un LLM que decida de qué colecciones debe recuperarse la información.</p>
<p>Este es el método para formar el enrutador de consultas:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Hacemos que el LLM devuelva una salida estructurada como JSON para convertir fácilmente su salida en una decisión sobre qué hacer a continuación.</p>
<h4 id="Search" class="common-anchor-header">Búsqueda</h4><p>Una vez seleccionadas varias colecciones de bases de datos mediante el paso anterior, el paso de búsqueda realiza una búsqueda de similitud con <a href="https://milvus.io/docs">Milvus</a>. Al igual que en el paso anterior, los datos de origen se han especificado de antemano, troceados, incrustados y almacenados en la base de datos vectorial. Para DeepSearcher, las fuentes de datos, tanto locales como en línea, deben especificarse manualmente. Dejamos la búsqueda en línea para futuros trabajos.</p>
<h4 id="Reflection" class="common-anchor-header">Reflexión</h4><p>A diferencia de la entrada anterior, DeepSearcher ilustra una verdadera forma de reflexión agéntica, introduciendo los resultados anteriores como contexto en un indicador que "reflexiona" sobre si las preguntas formuladas hasta el momento y los trozos recuperados relevantes contienen alguna laguna informativa. Se trata de una etapa de análisis.</p>
<p>Este es el método para crear la pregunta:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>Una vez más, hacemos que el LLM devuelva una salida estructurada, esta vez como datos interpretables en Python.</p>
<p>He aquí un ejemplo de nuevas subconsultas "descubiertas" por reflexión tras responder a las subconsultas iniciales anteriores:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Repetición condicional</h4><p>A diferencia de nuestro post anterior, DeepSearcher ilustra el flujo de ejecución condicional. Después de reflexionar sobre si las preguntas y respuestas hasta el momento están completas, si hay preguntas adicionales que hacer el agente repite los pasos anteriores. Es importante destacar que el flujo de ejecución (un bucle while) es una función de la salida del LLM en lugar de estar codificado. En este caso sólo hay una elección binaria: <em>repetir la investigación</em> o <em>generar un informe</em>. En agentes más complejos puede haber varias como: <em>seguir hipervínculo</em>, <em>recuperar trozos, almacenar en memoria, reflexionar</em>, etc. De este modo, la pregunta sigue refinándose como el agente considere oportuno hasta que decide salir del bucle y generar el informe. En nuestro ejemplo de Los Simpson, DeepSearcher realiza dos rondas más para rellenar los huecos con subconsultas adicionales.</p>
<h3 id="Synthesize" class="common-anchor-header">Sintetizar</h3><p>Por último, la pregunta totalmente descompuesta y los trozos recuperados se sintetizan en un informe con una única pregunta. Este es el código para crear la pregunta:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Este método tiene la ventaja sobre nuestro prototipo, que analizaba cada pregunta por separado y simplemente concatenaba los resultados, de producir un informe en el que todas las secciones son coherentes entre sí, es decir, no contienen información repetida o contradictoria. Un sistema más complejo podría combinar aspectos de ambos, utilizando un flujo de ejecución condicional para estructurar el informe, resumir, reescribir, reflexionar y pivotar, etc., lo que dejamos para futuros trabajos.</p>
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
    </button></h2><p>He aquí una muestra del informe generado por la consulta "¿Cómo han cambiado Los Simpson a lo largo del tiempo?" con DeepSeek-R1 pasando la página de Wikipedia sobre Los Simpson como material fuente:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Encuentra <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">el informe completo aquí</a>, y <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">un informe producido por DeepSearcher con GPT-4o mini</a> para comparar.</p>
<h2 id="Discussion" class="common-anchor-header">Debate<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Presentamos <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, un agente para realizar investigaciones y redactar informes. Nuestro sistema se basa en la idea de nuestro artículo anterior, añadiendo características como flujo de ejecución condicional, enrutamiento de consultas y una interfaz mejorada. Pasamos de la inferencia local con un pequeño modelo de razonamiento cuantificado de 4 bits a un servicio de inferencia en línea para el modelo masivo DeepSeek-R1, mejorando cualitativamente nuestro informe de salida. DeepSearcher funciona con la mayoría de los servicios de inferencia como OpenAI, Gemini, DeepSeek y Grok 3 (¡próximamente!).</p>
<p>Los modelos de razonamiento, especialmente los utilizados en los agentes de investigación, se basan en la inferencia, y tuvimos la suerte de poder utilizar la versión más rápida de DeepSeek-R1 de SambaNova, que se ejecuta en su hardware personalizado. Para nuestra consulta de demostración, realizamos sesenta y cinco llamadas al servicio de inferencia DeepSeek-R1 de SambaNova, introduciendo alrededor de 25.000 tokens, generando 22.000 tokens y costando 0,30 dólares. Nos impresionó la velocidad de inferencia, dado que el modelo contiene 671.000 millones de parámetros y tiene un tamaño de 3/4 de terabyte. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Más información aquí.</a></p>
<p>Seguiremos profundizando en este trabajo en futuros posts, examinando otros conceptos agenticos y el espacio de diseño de los agentes de investigación. Mientras tanto, invitamos a todo el mundo a que pruebe <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, <a href="https://github.com/zilliztech/deep-searcher">nos incluya en GitHub</a> y comparta sus comentarios.</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher de Zilliz</strong></a></p></li>
<li><p>Lectura de fondo: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"Construí una investigación profunda con código abierto, ¡y tú también puedes!"</em></strong></a></p></li>
<li><p><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>"SambaNova lanza el DeepSeek-R1 671B más rápido y con mayor eficiencia</strong></a><em>"</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Informe DeepSeek-R1 sobre Los Simpson</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o mini informe sobre Los Simpson</a></p></li>
<li><p><a href="https://milvus.io/docs">Base de datos vectorial de código abierto Milvus</a></p></li>
</ul>
