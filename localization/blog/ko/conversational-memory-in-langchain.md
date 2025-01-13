---
id: conversational-memory-in-langchain.md
title: LangChain의 대화형 메모리
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
<p>LangChain은 LLM 애플리케이션을 구축하기 위한 강력한 프레임워크입니다. 그러나 그 강력한 성능에는 상당한 복잡성이 수반됩니다. LangChain은 대화형 메모리와 같은 필수 기능과 LLM을 프롬프트하는 다양한 방법을 제공합니다. 대화 메모리는 LLM이 채팅을 기억할 수 있는 컨텍스트를 제공합니다.</p>
<p>이 포스팅에서는 LangChain과 Milvus에서 대화형 메모리를 사용하는 방법을 살펴보겠습니다. 따라 하려면 <code translate="no">pip</code> 네 개의 라이브러리와 OpenAI API 키를 설치해야 합니다. 필요한 네 개의 라이브러리는 <code translate="no">pip install langchain milvus pymilvus python-dotenv</code> 을 실행하여 설치할 수 있습니다. 또는 이 글의 <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab 노트북에서</a> 첫 번째 블록을 실행합니다.</p>
<p>이 글에서는 다음에 대해 알아보겠습니다:</p>
<ul>
<li>LangChain을 사용한 대화 메모리</li>
<li>대화 컨텍스트 설정하기</li>
<li>LangChain으로 대화형 메모리 프롬프트하기</li>
<li>LangChain 대화형 메모리 요약</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">LangChain을 사용한 대화형 메모리<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>기본 상태에서는 단일 프롬프트를 통해 LLM과 상호작용합니다. 컨텍스트를 위한 메모리, 즉 "대화형 메모리"를 추가하면 더 이상 하나의 프롬프트를 통해 모든 것을 전송할 필요가 없습니다. LangChain은 LLM과 이미 나눈 대화를 저장하여 나중에 해당 정보를 검색할 수 있는 기능을 제공합니다.</p>
<p>벡터 저장소로 영구 대화 메모리를 설정하려면 LangChain의 6가지 모듈이 필요합니다. 먼저 <code translate="no">OpenAIEmbeddings</code> 및 <code translate="no">OpenAI</code> LLM을 가져와야 합니다. 또한 벡터 저장소 백엔드를 사용하려면 <code translate="no">VectorStoreRetrieverMemory</code> 와 <code translate="no">Milvus</code> 의 LangChain 버전이 필요합니다. 그런 다음 대화를 저장하고 쿼리하려면 <code translate="no">ConversationChain</code> 과 <code translate="no">PromptTemplate</code> 이 필요합니다.</p>
<p><code translate="no">os</code>, <code translate="no">dotenv</code>, <code translate="no">openai</code> 라이브러리는 주로 운영 목적으로 사용됩니다. 이 라이브러리를 사용하여 OpenAI API 키를 로드하고 사용합니다. 마지막 설정 단계는 로컬 <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 인스턴스를 스핀업하는 것입니다. 이 작업은 Milvus Python 패키지의 <code translate="no">default_server</code> 을 사용하여 수행합니다.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">대화 컨텍스트 설정<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 모든 전제 조건이 설정되었으므로 대화 메모리를 만들 수 있습니다. 첫 번째 단계는 LangChain을 사용하여 Milvus 서버에 대한 연결을 생성하는 것입니다. 다음으로, 빈 사전을 사용해 LangChain Milvus 컬렉션을 생성합니다. 또한 위에서 생성한 임베딩과 Milvus Lite 서버에 대한 연결 세부 정보를 전달합니다.</p>
<p>대화형 메모리에 벡터 데이터베이스를 사용하려면 이를 리트리버로 인스턴스화해야 합니다. 이 경우 상위 1개 결과만 검색하도록 <code translate="no">k=1</code> 으로 설정합니다. 마지막 대화형 메모리 설정 단계는 방금 설정한 리트리버와 벡터 데이터베이스 연결을 통해 <code translate="no">VectorStoreRetrieverMemory</code> 객체를 대화형 메모리로 사용하는 것입니다.</p>
<p>대화형 메모리를 사용하려면 메모리에 컨텍스트가 있어야 합니다. 따라서 메모리에 컨텍스트를 부여해 보겠습니다. 이 예제에서는 다섯 가지 정보를 제공합니다. 내가 좋아하는 간식(초콜릿), 스포츠(수영), 맥주(기네스), 디저트(치즈 케이크), 음악가(테일러 스위프트)를 저장해 봅시다. 각 항목은 <code translate="no">save_context</code> 기능을 통해 메모리에 저장됩니다.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">LangChain으로 대화형 메모리 활성화하기<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 대화형 메모리를 어떻게 사용할 수 있는지 살펴볼 차례입니다. 먼저 LangChain을 통해 OpenAI LLM에 연결해 보겠습니다. LLM이 창의성을 발휘하지 않기를 원한다는 의미로 온도를 0으로 설정합니다.</p>
<p>다음으로 템플릿을 생성합니다. LLM에 인간과 친근한 대화를 나누고 있다고 알려주고 두 개의 변수를 삽입합니다. <code translate="no">history</code> 변수는 대화 메모리의 컨텍스트를 제공합니다. <code translate="no">input</code> 변수는 현재 입력을 제공합니다. <code translate="no">PromptTemplate</code> 객체를 사용하여 이 변수를 삽입합니다.</p>
<p><code translate="no">ConversationChain</code> 객체를 사용하여 프롬프트, LLM 및 메모리를 결합합니다. 이제 몇 가지 프롬프트를 제공하여 대화의 메모리를 확인할 준비가 되었습니다. 먼저 LLM에 내 이름이 포켓몬 시리즈의 주요 라이벌인 게리라고 알려줍니다(대화 메모리의 다른 모든 내용은 나에 대한 사실입니다).</p>
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
<p>아래 이미지는 LLM의 예상 응답이 어떤 모습일지 보여줍니다. 이 예에서는 자신의 이름이 "AI"라고 응답했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 지금까지의 메모리를 테스트해 보겠습니다. 앞서 만든 <code translate="no">ConversationChain</code> 객체를 사용하여 제가 좋아하는 뮤지션에 대해 쿼리해 보겠습니다.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>아래 이미지는 대화 체인의 예상 응답을 보여줍니다. 자세한 설명 옵션을 사용했기 때문에 관련 대화도 표시됩니다. 예상대로 제가 가장 좋아하는 아티스트가 테일러 스위프트임을 반환하는 것을 볼 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다음으로 제가 가장 좋아하는 디저트인 치즈케이크를 확인해 보겠습니다.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>내가 가장 좋아하는 디저트를 쿼리하면 대화 체인이 다시 한 번 밀버스에서 올바른 정보를 선택하는 것을 볼 수 있습니다. 앞서 말했듯이 제가 가장 좋아하는 디저트는 치즈케이크임을 알 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 앞서 제공한 정보를 쿼리할 수 있다는 것을 확인했으니 대화 초반에 제공한 정보를 한 가지 더 확인해 보겠습니다. AI에게 제 이름이 Gary라고 말하면서 대화를 시작했습니다.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>최종 확인 결과 대화 체인이 벡터 스토어 대화 메모리에 이름에 대한 비트를 저장한 것으로 나타났습니다. 대화 체인은 우리가 이름이 게리라고 말한 것을 반환합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">LangChain 대화 메모리 요약<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 튜토리얼에서는 LangChain에서 대화형 메모리를 사용하는 방법을 배웠습니다. LangChain은 지속적인 대화형 메모리를 위해 Milvus와 같은 벡터 저장소 백엔드에 대한 액세스를 제공합니다. 프롬프트에 히스토리를 주입하고 <code translate="no">ConversationChain</code> 객체에 히스토리 컨텍스트를 저장하여 대화형 메모리를 사용할 수 있습니다.</p>
<p>이 예제 튜토리얼에서는 대화 체인에 저에 대한 다섯 가지 사실을 제공하고 포켓몬스터의 주요 라이벌인 게리인 척했습니다. 그런 다음 대화 체인에 내가 좋아하는 뮤지션과 디저트 등 저장된 선험적 지식에 대한 질문을 던졌습니다. 대화 체인은 이 두 가지 질문에 모두 정답을 맞추고 관련 항목을 표시했습니다. 마지막으로 대화 초반에 주어진 이름에 대해 물었더니 "Gary"라고 정확하게 대답했습니다.</p>
