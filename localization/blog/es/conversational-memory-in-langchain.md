---
id: conversational-memory-in-langchain.md
title: Memoria conversacional en LangChain
author: Yujian Tang
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/conversational-memory-in-langchain.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain es un framework robusto para construir aplicaciones LLM. Sin embargo, esa potencia viene acompañada de una gran complejidad. LangChain proporciona muchas maneras de incitar a un LLM y características esenciales como la memoria conversacional. La memoria conversacional ofrece contexto para que el LLM recuerde tu charla.</p>
<p>En este artículo, veremos cómo utilizar la memoria conversacional con LangChain y Milvus. Para seguir adelante, necesitas <code translate="no">pip</code> instalar cuatro bibliotecas y una clave API OpenAI. Las cuatro bibliotecas que necesitas se pueden instalar ejecutando <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. O ejecutando el primer bloque del <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebook</a> para este artículo.</p>
<p>En este post, aprenderemos sobre:</p>
<ul>
<li>Memoria conversacional con LangChain</li>
<li>Configuración del contexto de conversación</li>
<li>Prompting de la Memoria Conversacional con LangChain</li>
<li>Resumen de la Memoria Conversacional con LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Memoria Conversacional con LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>En el estado por defecto, se interactúa con un LLM a través de prompts simples. Añadir memoria contextual o "memoria conversacional" significa que ya no tienes que enviarlo todo a través de un solo prompt. LangChain ofrece la posibilidad de almacenar la conversación que ya has mantenido con un LLM para recuperar esa información más adelante.</p>
<p>Para configurar una memoria conversacional persistente con un almacén vectorial, necesitamos seis módulos de LangChain. En primer lugar, debemos obtener los LLM <code translate="no">OpenAIEmbeddings</code> y <code translate="no">OpenAI</code>. También necesitamos <code translate="no">VectorStoreRetrieverMemory</code> y la versión LangChain de <code translate="no">Milvus</code> para utilizar un backend de almacén vectorial. Después necesitamos <code translate="no">ConversationChain</code> y <code translate="no">PromptTemplate</code> para guardar nuestra conversación y consultarla.</p>
<p>Las bibliotecas <code translate="no">os</code>, <code translate="no">dotenv</code>, y <code translate="no">openai</code> son principalmente para fines operativos. Las utilizamos para cargar y utilizar la clave API de OpenAI. El último paso de configuración es crear una instancia local <a href="https://milvus.io/docs/milvus_lite.md">de Milvus Lite</a>. Lo hacemos utilizando <code translate="no">default_server</code> del paquete Milvus Python.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">embeddings</span>.<span class="hljs-property">openai</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAIEmbeddings</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">llms</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">memory</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">VectorStoreRetrieverMemory</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">chains</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">ConversationChain</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">prompts</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">PromptTemplate</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">vectorstores</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Milvus</span>
embeddings = <span class="hljs-title class_">OpenAIEmbeddings</span>()


<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">import</span> openai
<span class="hljs-title function_">load_dotenv</span>()
openai.<span class="hljs-property">api_key</span> = os.<span class="hljs-title function_">getenv</span>(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)


<span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
default_server.<span class="hljs-title function_">start</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Configuración del contexto de conversación<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que tenemos todos nuestros prerrequisitos configurados, podemos proceder a crear nuestra memoria conversacional. Nuestro primer paso es crear una conexión con el servidor Milvus utilizando LangChain. A continuación, utilizamos un diccionario vacío para crear nuestra colección LangChain Milvus. Además, pasamos las incrustaciones que creamos anteriormente y los detalles de conexión para el servidor Milvus Lite.</p>
<p>Para utilizar la base de datos vectorial para la memoria conversacional, necesitamos instanciarla como recuperador. En este caso, sólo recuperamos el primer resultado, estableciendo <code translate="no">k=1</code>. El último paso en la configuración de la memoria conversacional es utilizar el objeto <code translate="no">VectorStoreRetrieverMemory</code> como nuestra memoria conversacional a través del recuperador y la conexión a la base de datos vectorial que acabamos de configurar.</p>
<p>Para usar nuestra memoria conversacional, tiene que tener algo de contexto en ella. Así que vamos a darle contexto a la memoria. Para este ejemplo, damos cinco datos. Guardemos mi tentempié favorito (chocolate), deporte (natación), cerveza (Guinness), postre (tarta de queso) y músico (Taylor Swift). Cada entrada se guarda en la memoria a través de la función <code translate="no">save_context</code>.</p>
<pre><code translate="no">vectordb = Milvus.from_documents(
   {},
   embeddings,
   connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;127.0.0.1&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: default_server.listen_port})
retriever = Milvus.as_retriever(vectordb, search_kwargs=<span class="hljs-built_in">dict</span>(k=<span class="hljs-number">1</span>))
memory = VectorStoreRetrieverMemory(retriever=retriever)
about_me = [
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite snack is chocolate&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Nice&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite sport is swimming&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Cool&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite beer is Guinness&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Great&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite dessert is cheesecake&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Good to know&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite musician is Taylor Swift&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Same&quot;</span>}
]
<span class="hljs-keyword">for</span> example <span class="hljs-keyword">in</span> about_me:
   memory.save_context({<span class="hljs-string">&quot;input&quot;</span>: example[<span class="hljs-string">&quot;input&quot;</span>]}, {<span class="hljs-string">&quot;output&quot;</span>: example[<span class="hljs-string">&quot;output&quot;</span>]})
<button class="copy-code-btn"></button></code></pre>
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Activación de la memoria conversacional con LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Es hora de ver cómo podemos utilizar nuestra memoria conversacional. Empecemos por conectarnos a la LLM de OpenAI a través de LangChain. Usamos una temperatura de 0 para indicar que no queremos que nuestro LLM sea creativo.</p>
<p>A continuación, creamos una plantilla. Le decimos al LLM que está manteniendo una conversación amistosa con un humano e insertamos dos variables. La variable <code translate="no">history</code> proporciona el contexto de la memoria conversacional. La variable <code translate="no">input</code> proporciona la entrada actual. Utilizamos el objeto <code translate="no">PromptTemplate</code> para insertar estas variables.</p>
<p>Usamos el objeto <code translate="no">ConversationChain</code> para combinar nuestro prompt, LLM y memoria. Ahora estamos listos para verificar la memoria de nuestra conversación dándole algunos prompt. Comenzamos diciéndole al LLM que nuestro nombre es Gary, el principal rival en la serie Pokemon (todo lo demás en la memoria de la conversación es un hecho sobre mí).</p>
<pre><code translate="no">llm = OpenAI(temperature=<span class="hljs-number">0</span>) <span class="hljs-comment"># Can be any valid LLM</span>
_DEFAULT_TEMPLATE = <span class="hljs-string">&quot;&quot;&quot;The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.


Relevant pieces of previous conversation:
{history}


(You do not need to use these pieces of information if not relevant)


Current conversation:
Human: {input}
AI:&quot;&quot;&quot;</span>
PROMPT = PromptTemplate(
   input_variables=[<span class="hljs-string">&quot;history&quot;</span>, <span class="hljs-string">&quot;input&quot;</span>], template=_DEFAULT_TEMPLATE
)
conversation_with_summary = ConversationChain(
   llm=llm,
   prompt=PROMPT,
   memory=memory,
   verbose=<span class="hljs-literal">True</span>
)
conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Hi, my name is Gary, what&#x27;s up?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>La imagen de abajo muestra cómo podría ser una respuesta esperada del LLM. En este ejemplo, ha respondido diciendo que se llama "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora vamos a probar la memoria hasta ahora. Usamos el objeto <code translate="no">ConversationChain</code> que creamos antes y hacemos una consulta sobre mi músico favorito.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>La imagen de abajo muestra una respuesta esperada de la Cadena de Conversación. Como usamos la opción verbose, también nos muestra la conversación relevante. Podemos ver que devuelve que mi artista favorita es Taylor Swift, como era de esperar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A continuación, busquemos mi postre favorito: tarta de queso.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Cuando preguntamos por mi postre favorito, podemos ver que la Cadena de Conversación, una vez más, recoge la información correcta de Milvus. Comprueba que mi postre favorito es la tarta de queso, como le dije antes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora que hemos confirmado que podemos consultar la información que hemos dado antes, vamos a comprobar una cosa más: la información que hemos dado al principio de nuestra conversación. Empezamos la conversación diciéndole a la IA que nos llamábamos Gary.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>La última comprobación nos indica que la cadena de conversación almacenó la información sobre nuestro nombre en la memoria de conversación de nuestro almacén vectorial. Nos devuelve que dijimos que nos llamábamos Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Resumen de la Memoria Conversacional LangChain<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>En este tutorial, hemos aprendido a utilizar la memoria conversacional en LangChain. LangChain ofrece acceso a vector store backends como Milvus para memoria conversacional persistente. Podemos utilizar la memoria conversacional inyectando historia en nuestros prompts y guardando el contexto histórico en el objeto <code translate="no">ConversationChain</code>.</p>
<p>Para este tutorial de ejemplo, le dimos a la cadena de conversación cinco datos sobre mí y fingimos ser el principal rival de Pokemon, Gary. A continuación, lanzamos a la Cadena de Conversación preguntas sobre el conocimiento a priori que habíamos almacenado: mi músico favorito y mi postre. Respondió correctamente a ambas preguntas y mostró las entradas correspondientes. Por último, le preguntamos por nuestro nombre al principio de la conversación, y respondió correctamente que habíamos dicho que nos llamábamos "Gary".</p>
