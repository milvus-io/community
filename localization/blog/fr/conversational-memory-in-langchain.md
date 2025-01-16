---
id: conversational-memory-in-langchain.md
title: Mémoire conversationnelle dans LangChain
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
<p>LangChain est un cadre robuste pour la construction d'applications LLM. Cependant, cette puissance s'accompagne d'une certaine complexité. LangChain propose de nombreuses façons d'inviter un LLM et des fonctions essentielles telles que la mémoire conversationnelle. La mémoire conversationnelle offre un contexte permettant au LLM de se souvenir de votre conversation.</p>
<p>Dans ce billet, nous verrons comment utiliser la mémoire conversationnelle avec LangChain et Milvus. Pour suivre, vous devez <code translate="no">pip</code> installer quatre bibliothèques et une clé API OpenAI. Les quatre bibliothèques dont vous avez besoin peuvent être installées en exécutant <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. Ou en exécutant le premier bloc dans le <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebook</a> pour cet article.</p>
<p>Dans cet article, nous allons apprendre à :</p>
<ul>
<li>La mémoire conversationnelle avec LangChain</li>
<li>Configurer le contexte de la conversation</li>
<li>L'incitation à la mémoire conversationnelle avec LangChain</li>
<li>Résumé de la mémoire conversationnelle avec LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">La mémoire conversationnelle avec LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans l'état par défaut, vous interagissez avec un LLM par le biais d'invites uniques. L'ajout d'une mémoire contextuelle, ou "mémoire conversationnelle", signifie que vous n'avez plus besoin de tout envoyer par le biais d'une seule invite. LangChain offre la possibilité de stocker la conversation que vous avez déjà eue avec un LLM afin de récupérer ces informations ultérieurement.</p>
<p>Pour mettre en place une mémoire conversationnelle persistante avec un magasin de vecteurs, nous avons besoin de six modules de LangChain. Tout d'abord, nous devons obtenir les modules <code translate="no">OpenAIEmbeddings</code> et <code translate="no">OpenAI</code>. Nous avons également besoin de <code translate="no">VectorStoreRetrieverMemory</code> et de la version LangChain de <code translate="no">Milvus</code> pour utiliser une mémoire vectorielle. Ensuite, nous avons besoin de <code translate="no">ConversationChain</code> et <code translate="no">PromptTemplate</code> pour sauvegarder notre conversation et l'interroger.</p>
<p>Les bibliothèques <code translate="no">os</code>, <code translate="no">dotenv</code> et <code translate="no">openai</code> sont principalement utilisées à des fins opérationnelles. Nous les utilisons pour charger et utiliser la clé API OpenAI. La dernière étape de configuration consiste à lancer une instance locale de <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Nous le faisons en utilisant le site <code translate="no">default_server</code> du paquetage Milvus Python.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Configuration du contexte de conversation<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que toutes les conditions préalables sont réunies, nous pouvons procéder à la création de notre mémoire conversationnelle. Notre première étape consiste à créer une connexion au serveur Milvus à l'aide de LangChain. Ensuite, nous utilisons un dictionnaire vide pour créer notre collection LangChain Milvus. En outre, nous transmettons les embeddings que nous avons créés ci-dessus et les détails de la connexion au serveur Milvus Lite.</p>
<p>Pour utiliser la base de données vectorielle pour la mémoire conversationnelle, nous devons l'instancier en tant que récupérateur. Dans ce cas, nous ne récupérons que le premier résultat, en définissant <code translate="no">k=1</code>. La dernière étape de la configuration de la mémoire conversationnelle consiste à utiliser l'objet <code translate="no">VectorStoreRetrieverMemory</code> comme mémoire conversationnelle par le biais du récupérateur et de la connexion à la base de données vectorielle que nous venons de mettre en place.</p>
<p>Pour utiliser notre mémoire conversationnelle, il faut qu'elle ait un certain contexte. Donnons donc à la mémoire un certain contexte. Pour cet exemple, nous donnons cinq informations. Stockons mon en-cas préféré (chocolat), mon sport préféré (natation), ma bière préférée (Guinness), mon dessert préféré (cheesecake) et ma musicienne préférée (Taylor Swift). Chaque entrée est enregistrée dans la mémoire à l'aide de la fonction <code translate="no">save_context</code>.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Promouvoir la mémoire conversationnelle avec LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est temps de voir comment nous pouvons utiliser notre mémoire conversationnelle. Commençons par nous connecter au LLM d'OpenAI via LangChain. Nous utilisons une température de 0 pour indiquer que nous ne voulons pas que notre LLM soit créatif.</p>
<p>Ensuite, nous créons un modèle. Nous indiquons au LLM qu'il est engagé dans une conversation amicale avec un humain et insérons deux variables. La variable <code translate="no">history</code> fournit le contexte de la mémoire conversationnelle. La variable <code translate="no">input</code> fournit l'entrée actuelle. Nous utilisons l'objet <code translate="no">PromptTemplate</code> pour insérer ces variables.</p>
<p>Nous utilisons l'objet <code translate="no">ConversationChain</code> pour combiner notre invite, notre LLM et notre mémoire. Nous sommes maintenant prêts à vérifier la mémoire de notre conversation en lui donnant quelques invites. Nous commençons par dire au LLM que nous nous appelons Gary, le principal rival de la série Pokemon (tout le reste de la mémoire conversationnelle est un fait me concernant).</p>
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
<p>L'image ci-dessous montre à quoi pourrait ressembler une réponse attendue du LLM. Dans cet exemple, il a répondu en disant qu'il s'appelait "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Testons maintenant la mémoire jusqu'à présent. Nous utilisons l'objet <code translate="no">ConversationChain</code> que nous avons créé plus tôt et nous recherchons mon musicien préféré.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>L'image ci-dessous montre une réponse attendue de la chaîne de conversation. Comme nous avons utilisé l'option verbose, la conversation correspondante est également affichée. Nous pouvons voir qu'il retourne que mon artiste préféré est Taylor Swift, comme prévu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ensuite, recherchons mon dessert préféré, le cheesecake.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque nous demandons mon dessert préféré, nous pouvons voir que la chaîne de conversation sélectionne une fois de plus les informations correctes de Milvus. Elle trouve que mon dessert préféré est le gâteau au fromage, comme je le lui ai dit plus tôt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Maintenant que nous avons confirmé que nous pouvons demander les informations que nous avons fournies plus tôt, vérifions une autre chose : les informations que nous avons fournies au début de notre conversation. Nous avons commencé notre conversation en disant à l'IA que nous nous appelions Gary.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Notre dernière vérification montre que la chaîne de conversation a stocké la partie concernant notre nom dans notre mémoire conversationnelle vectorielle. Elle renvoie que nous avons dit que notre nom était Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Résumé de la mémoire conversationnelle LangChain<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans ce tutoriel, nous avons appris à utiliser la mémoire conversationnelle dans LangChain. LangChain offre un accès aux backends de stockage vectoriel comme Milvus pour la mémoire conversationnelle persistante. Nous pouvons utiliser la mémoire conversationnelle en injectant un historique dans nos invites et en sauvegardant le contexte historique dans l'objet <code translate="no">ConversationChain</code>.</p>
<p>Pour cet exemple de tutoriel, nous avons donné à la chaîne de conversation cinq informations sur moi et nous avons prétendu être le principal rival de Pokemon, Gary. Ensuite, nous avons posé à la chaîne de conversation des questions sur les connaissances a priori que nous avons stockées - mon musicien et mon dessert préférés. La chaîne a répondu correctement à ces deux questions et a fait apparaître les entrées correspondantes. Enfin, nous l'avons interrogée sur le nom que nous avions donné au début de la conversation, et elle a répondu correctement que nous avions dit que notre nom était "Gary".</p>
