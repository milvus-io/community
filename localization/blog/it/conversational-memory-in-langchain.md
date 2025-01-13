---
id: conversational-memory-in-langchain.md
title: Memoria conversazionale in LangChain
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
<p>LangChain è un framework robusto per la costruzione di applicazioni LLM. Tuttavia, questa potenza comporta una certa complessità. LangChain offre molti modi per sollecitare un LLM e funzioni essenziali come la memoria conversazionale. La memoria conversazionale offre all'LLM un contesto per ricordare le vostre conversazioni.</p>
<p>In questo post vediamo come utilizzare la memoria conversazionale con LangChain e Milvus. Per seguirci, è necessario che <code translate="no">pip</code> installi quattro librerie e una chiave API OpenAI. Le quattro librerie necessarie possono essere installate eseguendo <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. Oppure eseguendo il primo blocco del <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">Quaderno di CoLab</a> per questo articolo.</p>
<p>In questo post, impareremo a conoscere:</p>
<ul>
<li>Memoria conversazionale con LangChain</li>
<li>Impostazione del contesto di conversazione</li>
<li>Prompt della memoria conversazionale con LangChain</li>
<li>Riassunto della memoria conversazionale con LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Memoria conversazionale con LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Nello stato predefinito, si interagisce con un LLM attraverso singoli prompt. L'aggiunta della memoria per il contesto, o "memoria conversazionale", significa che non è più necessario inviare tutto attraverso un solo prompt. LangChain offre la possibilità di memorizzare le conversazioni già avvenute con un LLM per recuperarle in seguito.</p>
<p>Per impostare una memoria conversazionale persistente con un archivio vettoriale, abbiamo bisogno di sei moduli di LangChain. Per prima cosa, dobbiamo procurarci gli LLM <code translate="no">OpenAIEmbeddings</code> e <code translate="no">OpenAI</code>. Abbiamo anche bisogno di <code translate="no">VectorStoreRetrieverMemory</code> e della versione LangChain di <code translate="no">Milvus</code> per utilizzare un backend di memoria vettoriale. Poi abbiamo bisogno di <code translate="no">ConversationChain</code> e <code translate="no">PromptTemplate</code> per salvare la nostra conversazione e interrogarla.</p>
<p>Le librerie <code translate="no">os</code>, <code translate="no">dotenv</code> e <code translate="no">openai</code> servono principalmente per scopi operativi. Le usiamo per caricare e utilizzare la chiave API di OpenAI. L'ultima fase di configurazione consiste nell'avviare un'istanza locale <a href="https://milvus.io/docs/milvus_lite.md">di Milvus Lite</a>. Per farlo, utilizziamo la libreria <code translate="no">default_server</code> del pacchetto Milvus Python.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Impostazione del contesto di conversazione<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo impostato tutti i prerequisiti, possiamo procedere alla creazione della memoria di conversazione. Il primo passo è creare una connessione al server Milvus usando LangChain. Poi, usiamo un dizionario vuoto per creare la nostra collezione LangChain Milvus. Inoltre, si passano gli embeddings creati in precedenza e i dettagli della connessione al server Milvus Lite.</p>
<p>Per utilizzare il database vettoriale per la memoria conversazionale, dobbiamo istanziarlo come retriever. In questo caso recuperiamo solo il primo risultato, impostando <code translate="no">k=1</code>. L'ultima fase di impostazione della memoria conversazionale consiste nell'utilizzare l'oggetto <code translate="no">VectorStoreRetrieverMemory</code> come memoria conversazionale attraverso la connessione tra retriever e database vettoriale appena impostata.</p>
<p>Per utilizzare la nostra memoria conversazionale, deve avere un contesto. Diamo quindi alla memoria un contesto. Per questo esempio, forniamo cinque informazioni. Memorizziamo la mia merenda preferita (cioccolato), lo sport (nuoto), la birra (Guinness), il dolce (cheesecake) e il musicista (Taylor Swift). Ogni voce viene salvata nella memoria attraverso la funzione <code translate="no">save_context</code>.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Prompt della memoria conversazionale con LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>È ora di vedere come utilizzare la memoria conversazionale. Iniziamo collegandoci al LLM di OpenAI attraverso LangChain. Utilizziamo una temperatura di 0 per indicare che non vogliamo che il nostro LLM sia creativo.</p>
<p>Poi creiamo un modello. Diciamo al LLM che è impegnato in una conversazione amichevole con un umano e inseriamo due variabili. La variabile <code translate="no">history</code> fornisce il contesto dalla memoria della conversazione. La variabile <code translate="no">input</code> fornisce l'input corrente. Per inserire queste variabili si utilizza l'oggetto <code translate="no">PromptTemplate</code>.</p>
<p>Utilizziamo l'oggetto <code translate="no">ConversationChain</code> per combinare il prompt, l'LLM e la memoria. Ora siamo pronti a verificare la memoria della nostra conversazione dandole alcuni prompt. Iniziamo dicendo all'LLM che il nostro nome è Gary, l'antagonista principale della serie Pokemon (tutto il resto della memoria della conversazione è un fatto che mi riguarda).</p>
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
<p>L'immagine sottostante mostra come potrebbe essere la risposta attesa dal LLM. In questo esempio, ha risposto dicendo che il suo nome è "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora proviamo a testare la memoria finora acquisita. Utilizziamo l'oggetto <code translate="no">ConversationChain</code> creato in precedenza e cerchiamo il mio musicista preferito.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>L'immagine sottostante mostra la risposta attesa dalla Conversation Chain. Poiché abbiamo usato l'opzione verbose, ci mostra anche la conversazione pertinente. Si può notare che la risposta è che la mia artista preferita è Taylor Swift, come previsto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poi, verifichiamo il mio dolce preferito, la cheesecake.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Quando chiediamo il mio dolce preferito, possiamo vedere che la Conversation Chain seleziona ancora una volta le informazioni corrette da Milvus. Trova che il mio dolce preferito è la torta al formaggio, come gli ho detto prima.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora che abbiamo confermato che possiamo interrogare le informazioni fornite in precedenza, controlliamo un'altra cosa: le informazioni fornite all'inizio della nostra conversazione. Abbiamo iniziato la conversazione dicendo all'intelligenza artificiale che ci chiamavamo Gary.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>La nostra verifica finale mostra che la catena di conversazione ha memorizzato la parte relativa al nostro nome nella nostra memoria vettoriale di conversazione. Il risultato è che abbiamo detto di chiamarci Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Riassunto sulla memoria conversazionale di LangChain<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo tutorial abbiamo imparato a usare la memoria conversazionale in LangChain. LangChain offre l'accesso a backend di vector store come Milvus per la memoria conversazionale persistente. Possiamo usare la memoria conversazionale iniettando la storia nei nostri prompt e salvando il contesto storico nell'oggetto <code translate="no">ConversationChain</code>.</p>
<p>Per questo esempio di esercitazione, abbiamo fornito alla catena di conversazione cinque informazioni su di me e abbiamo finto di essere il principale rivale dei Pokemon, Gary. Poi, abbiamo sottoposto alla Catena di Conversazione delle domande sulla conoscenza a priori che avevamo memorizzato: il mio musicista preferito e il mio dolce. La Catena ha risposto correttamente a entrambe le domande e ha visualizzato le voci pertinenti. Infine, abbiamo chiesto il nostro nome come indicato all'inizio della conversazione e ci ha risposto correttamente che avevamo detto di chiamarci "Gary".</p>
