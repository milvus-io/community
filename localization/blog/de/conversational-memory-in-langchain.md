---
id: conversational-memory-in-langchain.md
title: Konversationsspeicher in LangChain
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
<p>LangChain ist ein robuster Rahmen für die Erstellung von LLM-Anwendungen. Mit dieser Leistung kommt jedoch auch ein gewisses Maß an Komplexität. LangChain bietet viele Möglichkeiten, einen LLM aufzufordern und wesentliche Funktionen wie den Konversationsspeicher. Der Konversationsspeicher bietet dem LLM einen Kontext, um sich an Ihren Chat zu erinnern.</p>
<p>In diesem Beitrag sehen wir uns an, wie man den Gesprächsspeicher mit LangChain und Milvus verwendet. Dazu müssen Sie auf <code translate="no">pip</code> vier Bibliotheken und einen OpenAI-API-Schlüssel installieren. Die vier Bibliotheken, die Sie benötigen, können Sie installieren, indem Sie <code translate="no">pip install langchain milvus pymilvus python-dotenv</code> ausführen. Oder führen Sie den ersten Block im <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebook</a> für diesen Artikel aus.</p>
<p>In diesem Beitrag erfahren wir mehr über:</p>
<ul>
<li>Konversationsspeicher mit LangChain</li>
<li>Einrichten des Konversationskontextes</li>
<li>Das Gesprächsgedächtnis mit LangChain auffordern</li>
<li>LangChain Gesprächsgedächtnis Zusammenfassung</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Konversationsspeicher mit LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>In der Standardeinstellung interagieren Sie mit einem LLM durch einzelne Prompts. Das Hinzufügen eines Kontextspeichers oder "Konversationsspeichers" bedeutet, dass Sie nicht mehr alles über einen Prompt senden müssen. LangChain bietet die Möglichkeit, die Konversation zu speichern, die Sie bereits mit einem LLM geführt haben, um diese Informationen später abzurufen.</p>
<p>Um ein persistentes Gesprächsgedächtnis mit einem Vektorspeicher einzurichten, benötigen wir sechs Module von LangChain. Zuerst müssen wir den <code translate="no">OpenAIEmbeddings</code> und den <code translate="no">OpenAI</code> LLM besorgen. Außerdem benötigen wir <code translate="no">VectorStoreRetrieverMemory</code> und die LangChain-Version von <code translate="no">Milvus</code>, um ein Vektorspeicher-Backend zu verwenden. Dann brauchen wir <code translate="no">ConversationChain</code> und <code translate="no">PromptTemplate</code>, um unsere Konversation zu speichern und sie abzufragen.</p>
<p>Die Bibliotheken <code translate="no">os</code>, <code translate="no">dotenv</code> und <code translate="no">openai</code> sind hauptsächlich für operative Zwecke gedacht. Wir verwenden sie, um den OpenAI-API-Schlüssel zu laden und zu verwenden. Der letzte Einrichtungsschritt besteht darin, eine lokale <a href="https://milvus.io/docs/milvus_lite.md">Milvus-Lite-Instanz</a> einzurichten. Dazu verwenden wir die <code translate="no">default_server</code> aus dem Milvus-Python-Paket.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Einrichten des Konversationskontextes<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun alle Voraussetzungen geschaffen haben, können wir mit der Erstellung unseres Gesprächsspeichers fortfahren. Unser erster Schritt besteht darin, mit LangChain eine Verbindung zum Milvus-Server herzustellen. Als nächstes verwenden wir ein leeres Wörterbuch, um unsere LangChain-Milvus-Sammlung zu erstellen. Außerdem geben wir die oben erstellten Einbettungen und die Verbindungsdetails für den Milvus-Lite-Server an.</p>
<p>Um die Vektordatenbank für den Konversationsspeicher zu verwenden, müssen wir sie als Retriever instanziieren. Wir rufen in diesem Fall nur das Top-1-Ergebnis ab und setzen <code translate="no">k=1</code>. Der letzte Schritt bei der Einrichtung des Konversationsspeichers ist die Verwendung des Objekts <code translate="no">VectorStoreRetrieverMemory</code> als Konversationsspeicher über die soeben eingerichtete Verbindung zwischen Retriever und Vektordatenbank.</p>
<p>Um unseren Konversationsspeicher zu verwenden, muss er einen Kontext enthalten. Geben wir dem Speicher also etwas Kontext. Für dieses Beispiel geben wir fünf Informationen an. Wir speichern meinen Lieblingssnack (Schokolade), Sport (Schwimmen), Bier (Guinness), Nachtisch (Käsekuchen) und Musiker (Taylor Swift). Jeder Eintrag wird über die Funktion <code translate="no">save_context</code> im Speicher abgelegt.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Prompting des Gesprächsspeichers mit LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist an der Zeit, sich anzusehen, wie wir unser Gesprächsgedächtnis nutzen können. Beginnen wir mit der Verbindung zum OpenAI LLM über LangChain. Wir verwenden eine Temperatur von 0, um anzuzeigen, dass wir nicht wollen, dass unser LLM kreativ ist.</p>
<p>Als nächstes erstellen wir eine Vorlage. Wir teilen dem LLM mit, dass er sich in einem freundlichen Gespräch mit einem Menschen befindet und fügen zwei Variablen ein. Die Variable <code translate="no">history</code> liefert den Kontext aus dem Gesprächsspeicher. Die Variable <code translate="no">input</code> liefert die aktuelle Eingabe. Wir verwenden das Objekt <code translate="no">PromptTemplate</code>, um diese Variablen einzufügen.</p>
<p>Wir verwenden das Objekt <code translate="no">ConversationChain</code>, um unsere Eingabeaufforderung, das LLM und den Speicher zu kombinieren. Nun sind wir bereit, das Gedächtnis unserer Konversation zu überprüfen, indem wir ihr einige Prompts geben. Wir beginnen damit, dem LLM mitzuteilen, dass unser Name Gary ist, der Hauptkonkurrent in der Pokemon-Serie (alles andere im Gesprächsspeicher ist eine Tatsache über mich).</p>
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
<p>Das Bild unten zeigt, wie eine erwartete Antwort des LLM aussehen könnte. In diesem Beispiel hat es geantwortet, indem es sagte, sein Name sei "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nun wollen wir das Gedächtnis testen. Wir verwenden das Objekt <code translate="no">ConversationChain</code>, das wir zuvor erstellt haben, und fragen nach meinem Lieblingsmusiker.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Das Bild unten zeigt eine erwartete Antwort der Conversation Chain. Da wir die ausführliche Option verwendet haben, wird uns auch die entsprechende Unterhaltung angezeigt. Wir sehen, dass die Antwort wie erwartet lautet, dass meine Lieblingskünstlerin Taylor Swift ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Als nächstes wollen wir nach meinem Lieblingsdessert - Käsekuchen - suchen.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Bei der Abfrage nach meinem Lieblingsdessert können wir sehen, dass die Conversation Chain wieder die richtigen Informationen von Milvus auswählt. Sie stellt fest, dass mein Lieblingsdessert Käsekuchen ist, wie ich es bereits gesagt habe.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nachdem wir nun bestätigt haben, dass wir die Informationen abfragen können, die wir zuvor gegeben haben, wollen wir noch eine weitere Sache überprüfen - die Informationen, die wir zu Beginn unserer Unterhaltung gegeben haben. Wir haben unser Gespräch begonnen, indem wir der KI gesagt haben, dass unser Name Gary ist.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Unsere abschließende Prüfung ergibt, dass die Konversationskette das Bit über unseren Namen in unserem Vektorspeicher für Konversationen gespeichert hat. Sie gibt zurück, dass wir gesagt haben, unser Name sei Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">LangChain Konversationsspeicher Zusammenfassung<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Tutorial haben wir gelernt, wie man den Konversationsspeicher in LangChain verwendet. LangChain bietet Zugang zu Vektorspeicher-Backends wie Milvus für persistenten Konversationsspeicher. Wir können den Konversationsspeicher nutzen, indem wir einen Verlauf in unsere Prompts einfügen und den historischen Kontext im <code translate="no">ConversationChain</code> Objekt speichern.</p>
<p>Für dieses Beispiel-Tutorial haben wir der Konversationskette fünf Fakten über mich gegeben und so getan, als wäre ich der Hauptkonkurrent in Pokemon, Gary. Dann haben wir die Gesprächskette mit Fragen zu dem von uns gespeicherten Vorwissen - mein Lieblingsmusiker und mein Lieblingsdessert - gelöchert. Sie beantwortete beide Fragen richtig und zeigte die entsprechenden Einträge an. Schließlich fragten wir nach unserem Namen, den wir zu Beginn des Gesprächs angegeben hatten, und es wurde korrekt zurückgegeben, dass wir gesagt hatten, unser Name sei "Gary".</p>
