---
id: >-
  ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
title: >-
  KI für intelligenteres Browsing: Filtern von Webinhalten mit Pixtral, Milvus
  und Browser-Nutzung
author: Stephen Batifol
date: 2025-02-25T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Sie einen intelligenten Assistenten erstellen, der Inhalte
  filtert, indem Sie Pixtral für die Bildanalyse, die Vektordatenbank Milvus für
  die Speicherung und Browser Use für die Webnavigation kombinieren.
cover: >-
  assets.zilliz.com/AI_for_Smarter_Browsing_Filtering_Web_Content_with_Pixtral_Milvus_and_Browser_Use_56d0154bbd.png
tag: Engineering
tags: >-
  Vector Database Milvus, AI Content Filtering, Pixtral Image Analysis, Browser
  Use Web Navigation, Intelligent Agent Development
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
---
<iframe width="100%" height="480" src="https://www.youtube.com/embed/4Xf4_Wfjk_Y" title="How to Build a Smart Social Media Agent with Milvus, Pixtral &amp; Browser Use" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>Als Developer Advocate für Milvus verbringe ich viel Zeit in sozialen Netzwerken und höre mir an, was die Leute über uns zu sagen haben und ob ich auch helfen kann. Wenn man nach &quot;Milvus&quot; sucht, prallen allerdings Welten aufeinander. Es ist sowohl eine Vektor-DB als auch eine Vogelgattung, was bedeutet, dass ich in einem Moment tief in einem Thread über Vektorähnlichkeitsalgorithmen stecke und im nächsten atemberaubende Fotos von schwarzen Vögeln bewundere, die durch den Himmel fliegen.</p>
<p>Obwohl beide Themen interessant sind, ist es in meinem Fall nicht wirklich hilfreich, sie zu vermischen. Was wäre, wenn es einen intelligenten Weg gäbe, dieses Problem zu lösen, ohne dass ich manuell nachschauen muss?</p>
<p>Durch die Kombination von visuellem Verständnis und Kontextbewusstsein können wir einen Assistenten entwickeln, der den Unterschied zwischen den Zugmustern eines Schwarzmilans und einem neuen Artikel von uns kennt.</p>
<h2 id="The-tech-stack" class="common-anchor-header">Der Technologie-Stack<button data-href="#The-tech-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir kombinieren drei verschiedene Technologien:</p>
<ul>
<li><strong>Browser-Use:</strong> Dieses Tool navigiert durch verschiedene Websites (z. B. Twitter), um Inhalte abzurufen.</li>
<li><strong>Pixtral</strong>: Ein Vision-Sprachmodell, das Bilder und Kontext analysiert. In diesem Beispiel unterscheidet es zwischen einem technischen Diagramm über unsere Vector DB und einem beeindruckenden Vogelfoto.</li>
<li><strong>Milvus</strong>: Eine hochleistungsfähige und quelloffene Vector DB. In ihr werden wir die relevanten Beiträge für spätere Abfragen speichern.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/the_tech_stack_ad695ccf9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Seeing-it-in-action" class="common-anchor-header">In Aktion zu sehen<button data-href="#Seeing-it-in-action" class="anchor-icon" translate="no">
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
    </button></h2><p>Werfen wir einen Blick auf diese 2 Beiträge:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langchian_tweet_1_with_Milvus_f2bd988503.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tweet_2_with_Bird_4b534efced.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Beim linken Beitrag erkennt Pixtral, dass es sich um einen Beitrag über Milvus, die Vektor-DB, handelt. Es werden einige Implementierungsdetails erwähnt, aber auch ein Bild, das ein Systemdiagramm zeigt, was darauf hinweist, dass es sich tatsächlich um die Vector DB handelt. Unten können wir sehen, dass Pixtral das Gleiche denkt.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: <span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
<span class="hljs-number">1.</span> Navigated to the post URL. <span class="hljs-number">2.</span> Extracted relevant post content. <span class="hljs-number">3.</span> Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB.
INFO     [src.agent.custom_agent] 📋 Future Plans:
<span class="hljs-number">1.</span> Summarize the findings <span class="hljs-keyword">and</span> confirm the relevance to Milvus. <span class="hljs-number">2.</span> Complete the task by providing a clear <span class="hljs-keyword">and</span> concise report.
INFO     [src.agent.custom_agent] 🤔 Thought: The task required analyzing the post content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB, ignoring <span class="hljs-built_in">any</span> content about birds <span class="hljs-keyword">or</span> photography. The extracted content <span class="hljs-keyword">is</span> entirely relevant to Milvus <span class="hljs-keyword">and</span> its applications <span class="hljs-keyword">in</span> vector search <span class="hljs-keyword">and</span> RAG systems. I will now summarize the findings <span class="hljs-keyword">and</span> complete the task.
INFO     [src.agent.custom_agent] 🎯 Summary: The post <span class="hljs-keyword">and</span> its replies are relevant to Milvus, the Vector DB, focusing on its use <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search. No content about birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post by LangChainAI discusses the &#x27;GraphRAG Agent,&#x27; which uses Neo4j and Milvus vector search to enhance RAG systems. Replies highlight the innovative use of Milvus for intelligent retrieval and vector search, with no mention of birds or photography. The content is entirely relevant to Milvus, the Vector DB.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies focus on the innovative use of Milvus <span class="hljs-keyword">for</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search alongside other technologies.
<span class="hljs-number">3.</span> No posts <span class="hljs-keyword">or</span> replies are related to birds <span class="hljs-keyword">or</span> photography.
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
<button class="copy-code-btn"></button></code></pre>
<p>Das Bild auf der rechten Seite hingegen ist es nicht. Wir können sehen, dass dieses Bild, so schön es auch ist, nicht von einer Vektor-DB handelt. Wir sehen einen Vogel, der am Himmel fliegt, daher wird Pixtral dieses Bild als irrelevant betrachten.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
Navigated to the post. Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB. No relevant information found.
INFO     [src.agent.custom_agent] 🤔 Thought: The content of the post <span class="hljs-keyword">and</span> comments only discusses birds <span class="hljs-keyword">and</span> photography. Since the task specifies ignoring such topics, there <span class="hljs-keyword">is</span> no relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. The task can now be concluded.
INFO     [src.agent.custom_agent] 🎯 Summary: The post does <span class="hljs-keyword">not</span> contain relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. I will conclude the task.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post and comments focus on birds and photography. No relevant information related to Milvus, the Vector DB, was found.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
<button class="copy-code-btn"></button></code></pre>
<p>Nun, da wir die Beiträge, die wir nicht haben wollen, herausgefiltert haben, können wir die relevanten in Milvus speichern. So ist es möglich, sie später entweder mit der Vektorsuche oder der Volltextsuche abzufragen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Browser_use_milvus_pixtral_39bf320a9f.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Storing-Data-in-Milvus" class="common-anchor-header">Speichern von Daten in Milvus<button data-href="#Storing-Data-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/enable-dynamic-field.md#Dynamic-Field">Dynamische Felder</a> sind in diesem Fall ein Muss, da es nicht immer möglich ist, das Schema einzuhalten, das Milvus erwartet. Mit Milvus verwenden Sie einfach <code translate="no">enable_dynamic_field=True</code>, wenn Sie Ihr Schema erstellen, und das war's. Hier ist ein Codeschnipsel zur Veranschaulichung des Prozesses:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Create a Schema that handles Dynamic Fields</span>
schema = <span class="hljs-variable language_">self</span>.client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<p>Dann definieren wir die Daten, auf die wir Zugriff haben wollen:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Prepare data with dynamic fields</span>
data = {
    <span class="hljs-string">&#x27;text&#x27;</span>: content_str,
    <span class="hljs-string">&#x27;vector&#x27;</span>: embedding,
    <span class="hljs-string">&#x27;url&#x27;</span>: url,
    <span class="hljs-string">&#x27;type&#x27;</span>: content_type,
    <span class="hljs-string">&#x27;metadata&#x27;</span>: json.dumps(metadata <span class="hljs-keyword">or</span> {})
}

<span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-variable language_">self</span>.client.insert(
    collection_name=<span class="hljs-variable language_">self</span>.collection_name,
    data=[data]
)
<button class="copy-code-btn"></button></code></pre>
<p>Diese einfache Einrichtung bedeutet, dass Sie sich nicht darum kümmern müssen, dass jedes Feld im Voraus perfekt definiert ist. Richten Sie einfach das Schema so ein, dass dynamische Ergänzungen möglich sind, und überlassen Sie Milvus die schwere Arbeit.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Durch die Kombination der Webnavigation von Browser Use, dem visuellen Verständnis von Pixtral und der effizienten Speicherung von Milvus haben wir einen intelligenten Assistenten geschaffen, der den Kontext wirklich versteht. Jetzt verwende ich ihn, um zwischen Vögeln und Vektor-DB zu unterscheiden, aber der gleiche Ansatz könnte auch bei einem anderen Problem helfen, mit dem Sie vielleicht konfrontiert sind.</p>
<p>Ich für meinen Teil möchte weiter an Agenten arbeiten, die mir bei meiner täglichen Arbeit helfen können, um meine kognitive Belastung zu verringern 😌.</p>
<h2 id="Wed-Love-to-Hear-What-You-Think" class="common-anchor-header">Wir würden gerne hören, was Sie denken!<button data-href="#Wed-Love-to-Hear-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Ihnen dieser Blogbeitrag gefallen hat, würden wir uns freuen:</p>
<ul>
<li>⭐ Geben Sie uns einen Stern auf <a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li>💬 Treten Sie unserer <a href="https://discord.gg/FG6hMJStWu">Milvus-Discord-Community</a> bei, um Ihre Erfahrungen zu teilen oder wenn Sie Hilfe bei der Erstellung von Agenten benötigen</li>
<li>🔍 Erkunden Sie unser <a href="https://github.com/milvus-io/bootcamp">Bootcamp-Repository</a> für Anwendungsbeispiele mit Milvus</li>
</ul>
