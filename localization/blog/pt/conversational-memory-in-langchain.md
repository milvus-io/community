---
id: conversational-memory-in-langchain.md
title: Memória de conversação em LangChain
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
<p>LangChain é uma estrutura robusta para construir aplicações LLM. No entanto, com esse poder vem um pouco de complexidade. A LangChain oferece muitas maneiras de solicitar um LLM e recursos essenciais como a memória de conversação. A memória de conversação oferece contexto para que o LLM se lembre do seu bate-papo.</p>
<p>Nesta publicação, veremos como usar a memória de conversação com a LangChain e o Milvus. Para acompanhar, precisa de <code translate="no">pip</code> instalar quatro bibliotecas e uma chave da API OpenAI. As quatro bibliotecas necessárias podem ser instaladas executando <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. Ou executando o primeiro bloco no <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">Notebook</a> do <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab</a> para este artigo.</p>
<p>Neste post, vamos aprender sobre:</p>
<ul>
<li>Memória de conversação com LangChain</li>
<li>Configurar o contexto da conversação</li>
<li>Como ativar a memória de conversação com a LangChain</li>
<li>Resumo da memória de conversação com LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Memória de conversação com LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>No estado predefinido, interage com um LLM através de prompts únicos. Adicionar memória para contexto, ou "memória de conversação", significa que já não tem de enviar tudo através de um único comando. A LangChain oferece a capacidade de armazenar a conversa que já teve com um LLM para recuperar essa informação mais tarde.</p>
<p>Para configurar uma memória de conversação persistente com um armazenamento vetorial, precisamos de seis módulos da LangChain. Primeiro, temos de obter o <code translate="no">OpenAIEmbeddings</code> e o <code translate="no">OpenAI</code> LLM. Também precisamos de <code translate="no">VectorStoreRetrieverMemory</code> e da versão LangChain de <code translate="no">Milvus</code> para utilizar um backend de armazenamento vetorial. Depois, precisamos de <code translate="no">ConversationChain</code> e <code translate="no">PromptTemplate</code> para guardar a nossa conversa e consultá-la.</p>
<p>As bibliotecas <code translate="no">os</code>, <code translate="no">dotenv</code> e <code translate="no">openai</code> são principalmente para fins operacionais. Nós as usamos para carregar e usar a chave da API OpenAI. A etapa final de configuração é criar uma instância local <a href="https://milvus.io/docs/milvus_lite.md">do Milvus Lite</a>. Fazemos isso usando o <code translate="no">default_server</code> do pacote Milvus Python.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Configurando o contexto da conversa<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que temos todos os nossos pré-requisitos configurados, podemos prosseguir para criar nossa memória de conversação. Nosso primeiro passo é criar uma conexão com o servidor Milvus usando LangChain. Em seguida, usamos um dicionário vazio para criar a nossa coleção LangChain Milvus. Além disso, passamos os embeddings que criámos acima e os detalhes da ligação ao servidor Milvus Lite.</p>
<p>Para utilizar a base de dados vetorial para a memória de conversação, temos de a instanciar como um recuperador. Neste caso, só recuperamos o primeiro resultado, definindo <code translate="no">k=1</code>. O último passo da configuração da memória de conversação é utilizar o objeto <code translate="no">VectorStoreRetrieverMemory</code> como a nossa memória de conversação através da ligação do recuperador e da base de dados vetorial que acabámos de configurar.</p>
<p>Para usar nossa memória de conversação, ela precisa ter algum contexto. Por isso, vamos dar algum contexto à memória. Para este exemplo, damos cinco informações. Vamos guardar o meu snack preferido (chocolate), desporto (natação), cerveja (Guinness), sobremesa (cheesecake) e músico (Taylor Swift). Cada entrada é guardada na memória através da função <code translate="no">save_context</code>.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Solicitar a memória de conversação com LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Está na altura de ver como podemos usar a nossa memória de conversação. Comecemos por nos ligarmos ao LLM do OpenAI através da LangChain. Usamos uma temperatura de 0 para indicar que não queremos que a nossa LLM seja criativa.</p>
<p>De seguida, criamos um modelo. Dizemos ao LLM que está envolvido numa conversa amigável com um humano e inserimos duas variáveis. A variável <code translate="no">history</code> fornece o contexto da memória de conversação. A variável <code translate="no">input</code> fornece o input atual. Utilizamos o objeto <code translate="no">PromptTemplate</code> para inserir estas variáveis.</p>
<p>Utilizamos o objeto <code translate="no">ConversationChain</code> para combinar o nosso prompt, LLM e memória. Agora estamos prontos para verificar a memória da nossa conversa, dando-lhe algumas instruções. Começamos por dizer ao LLM que o nosso nome é Gary, o principal rival da série Pokemon (tudo o resto na memória de conversação é um facto sobre mim).</p>
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
<p>A imagem abaixo mostra o que poderia ser uma resposta esperada do MLT. Neste exemplo, ele respondeu dizendo que o seu nome é "IA".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora vamos testar a memória até agora. Utilizamos o objeto <code translate="no">ConversationChain</code> que criámos anteriormente e consultamos o meu músico favorito.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>A imagem abaixo mostra uma resposta esperada da cadeia de conversação. Como usamos a opção verbose, ela também nos mostra a conversa relevante. Podemos ver que ela retorna que meu artista favorito é Taylor Swift, como esperado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em seguida, vamos verificar a minha sobremesa favorita - cheesecake.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Quando consultamos a minha sobremesa favorita, podemos ver que a cadeia de conversação escolhe mais uma vez a informação correta do Milvus. Descobre que a minha sobremesa favorita é cheesecake, como lhe disse anteriormente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora que confirmámos que podemos consultar a informação que demos anteriormente, vamos verificar mais uma coisa - a informação que fornecemos no início da nossa conversa. Começámos a nossa conversa dizendo à IA que o nosso nome era Gary.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>A nossa verificação final indica que a cadeia de conversação guardou a informação sobre o nosso nome na nossa memória de conversação do vetor de armazenamento. Devolve que dissemos que o nosso nome é Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Resumo da memória de conversação LangChain<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste tutorial, aprendemos como usar a memória de conversação em LangChain. LangChain oferece acesso a backends de armazenamento vetorial como Milvus para memória conversacional persistente. Podemos usar a memória de conversação injetando histórico em nossos prompts e salvando o contexto histórico no objeto <code translate="no">ConversationChain</code>.</p>
<p>Para este exemplo de tutorial, demos à cadeia de conversação cinco factos sobre mim e fingimos ser o principal rival do Pokemon, o Gary. Depois, fizemos perguntas à cadeia de conversação sobre o conhecimento a priori que armazenámos - o meu músico favorito e a minha sobremesa. O sistema respondeu corretamente a ambas as perguntas e fez aparecer as entradas relevantes. Por fim, perguntámos-lhe qual era o nosso nome no início da conversa, e ela respondeu corretamente que tínhamos dito que o nosso nome era "Gary".</p>
