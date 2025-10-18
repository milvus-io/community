---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: >-
  كيف قامت OpusSearch OpusSearch ببناء المطابقة التامة لـ RAG للمؤسسات باستخدام
  Milvus BM25
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_2025_10_18_10_43_29_93fe542daf.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  تعرّف على كيفية استخدام OpusSearch لـ Milvus BM25 لتشغيل المطابقة التامة في
  أنظمة RAG للمؤسسات - الجمع بين البحث الدلالي واسترجاع الكلمات الرئيسية
  الدقيقة.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>نُشر هذا المنشور في الأصل على موقع <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> وأعيد نشره هنا بعد الحصول على إذن.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">النقطة العمياء للبحث الدلالي<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>تخيل هذا: أنت محرر فيديو في الموعد النهائي. تحتاج إلى مقاطع من "الحلقة 281" من البودكاست الخاص بك. تكتبها في بحثنا. يقوم بحثنا الدلالي المدعوم بالذكاء الاصطناعي، الذي يفخر بذكائه، بإرجاع مقاطع من الحلقة 280 و282، بل ويقترح الحلقة 218 لأن الأرقام متشابهة، أليس كذلك؟</p>
<p><strong>خطأ</strong>.</p>
<p>عندما أطلقنا <a href="https://www.opus.pro/opussearch">OpusSearch</a> للمؤسسات في يناير 2025، اعتقدنا أن البحث الدلالي سيكون كافياً. كانت الاستعلامات اللغوية الطبيعية مثل "العثور على لحظات مضحكة عن المواعدة" تعمل بشكل جميل. كان نظام RAG <a href="https://milvus.io/">المدعوم من Milvus</a> الخاص بنا الذي يعمل <a href="https://milvus.io/">بنظام Milvus</a> يسحقها.</p>
<p><strong>ولكن بعد ذلك اصطدمنا بالواقع بملاحظات المستخدمين:</strong></p>
<p>"أريد فقط مقاطع من الحلقة 281. لماذا هذا صعب للغاية؟</p>
<p>"عندما أبحث عن "هذا ما قالته"، أريد هذه العبارة بالضبط، وليس "هذا ما قصده"."</p>
<p>اتضح أن محرري الفيديو والقصاصين لا يريدون دائمًا أن يكون الذكاء الاصطناعي ذكيًا. بل يريدون أحياناً أن يكون البرنامج <strong>واضحاً وصحيحاً</strong>.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">لماذا نهتم بالبحث؟<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد أنشأنا <a href="https://www.opus.pro/opussearch">وظيفة بحث مؤسسية</a> لأننا أدركنا أن <strong>تحقيق الدخل من</strong> كتالوجات الفيديو الكبيرة هو التحدي الرئيسي الذي تواجهه المؤسسات. تعمل منصتنا التي تدعمها RAG <strong>كعامل نمو</strong> يمكّن المؤسسات من <strong>البحث في مكتبات الفيديو الخاصة بها بالكامل وإعادة توظيفها وتحقيق الدخل منها</strong>. اقرأ عن قصص نجاح <strong>كل من All The Smoke</strong> <strong>وراديو KFC</strong> <strong>وTFTC</strong> <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">هنا</a>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">لماذا ضاعفنا الاعتماد على Milvus (بدلاً من إضافة قاعدة بيانات أخرى)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>كان الحل الواضح هو إضافة Elasticsearch أو MongoDB للمطابقة التامة. ومع ذلك، كشركة ناشئة، فإن الاحتفاظ بأنظمة بحث متعددة يؤدي إلى نفقات تشغيلية كبيرة وتعقيدات كبيرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>قامت شركة Milvus مؤخرًا بشحن ميزة البحث عن النص الكامل الخاصة بها، وأظهر تقييم مع مجموعة البيانات الخاصة بنا <strong>دون أي ضبط</strong> مزايا مقنعة:</p>
<ul>
<li><p><strong>دقة فائقة في المطابقة الجزئية</strong>. على سبيل المثال "قصة تناول الطعام" و"القفز عالياً"، تقوم قواعد البيانات المتجهة الأخرى بإرجاع "قصة تناول الطعام" و"الانتشاء" أحيانًا مما يغير المعنى.</p></li>
<li><p><strong>تُرجع</strong> Milvus <strong>نتائج أطول وأكثر شمولاً</strong> من قواعد البيانات الأخرى عندما تكون الاستعلامات عامة، وهو بطبيعة الحال أكثر مثالية لحالة الاستخدام لدينا.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">الهندسة المعمارية من 5000 قدم<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + التصفية = سحر المطابقة التامة<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يتعلق البحث عن النص الكامل في ميلفوس بالمطابقة التامة حقًا، ولكنه يتعلق بتسجيل درجة الملاءمة باستخدام BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(أفضل 25 مطابقة</a>)، والذي يحسب مدى صلة المستند باستعلامك. إنه رائع في حالة "اعثر لي على شيء قريب"، ولكنه سيء في حالة "اعثر لي على هذا بالضبط".</p>
<p>ثم قمنا بعد ذلك <strong>بدمج قوة BM25 مع تصفية TEXT_MATCH في ميلفوس</strong>. إليك كيفية عملها:</p>
<ol>
<li><p>التصفية<strong>أولاً</strong>: TEXT_MATCH يعثر على المستندات التي تحتوي على كلماتك المفتاحية بالضبط</p></li>
<li><p><strong>الترتيب ثانياً</strong>: يقوم BM25 بفرز تلك المطابقات الدقيقة حسب الصلة</p></li>
<li><p><strong>الفوز</strong>: تحصل على التطابقات التامة، مرتبة بذكاء</p></li>
</ol>
<p>فكِّر في الأمر على أنه "أعطني كل شيء يحتوي على "الحلقة 281"، ثم اعرض لي أفضلها أولاً."</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">الرمز الذي جعل الأمر ينجح<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">تصميم المخطط</h3><p><strong>هام</strong>: لقد عطلنا كلمات التوقف تمامًا، حيث تمثل مصطلحات مثل "المكتب" و"المكتب" كيانات مميزة في مجال المحتوى الخاص بنا.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">إعداد وظيفة BM25</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">تكوين الفهرس</h3><p>ضُبطت معلمات bm25_k1 و bm25_b هذه على مجموعة بيانات الإنتاج لدينا لتحقيق الأداء الأمثل.</p>
<p><strong>bm25_k1</strong>: تعطي القيم الأعلى (حتى 2.0 تقريبًا) وزنًا أكبر لتكرار المصطلحات، بينما تقلل القيم الأقل من تأثير تكرار المصطلحات بعد التكرارات القليلة الأولى.</p>
<p><strong>bm25_b</strong>: تُعاقب القيم الأقرب إلى 1.0 المستندات الأطول بشدة، بينما تتجاهل القيم الأقرب إلى 0 طول المستند تمامًا.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">استعلام البحث الذي بدأ العمل</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>للمطابقات التامة متعددة المصطلحات:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">الأخطاء التي ارتكبناها (حتى لا تضطر إلى ذلك)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">الحقول الديناميكية: ضرورية لمرونة الإنتاج</h3><p>في البداية، لم نقم بتمكين الحقول الديناميكية، وهو ما كان يمثل مشكلة. تطلبت تعديلات المخطط إسقاط المجموعات وإعادة إنشائها في بيئات الإنتاج.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">تصميم المجموعات: الحفاظ على فصل واضح بين الاهتمامات</h3><p>تستخدم بنيتنا مجموعات مخصصة لكل مجال ميزة. يقلل هذا النهج المعياري من تأثير تغييرات المخطط ويحسن قابلية الصيانة.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">استخدام الذاكرة: التحسين باستخدام MMAP</h3><p>تتطلب الفهارس المتفرقة تخصيص ذاكرة كبيرة. بالنسبة لمجموعات البيانات النصية الكبيرة، نوصي بتكوين MMAP لاستخدام تخزين القرص. يتطلب هذا النهج سعة إدخال/إخراج كافية للحفاظ على خصائص الأداء.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">تأثير الإنتاج والنتائج<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد نشر وظيفة المطابقة التامة في يونيو 2025، لاحظنا تحسينات قابلة للقياس في مقاييس رضا المستخدمين وانخفاض حجم الدعم للمشكلات المتعلقة بالبحث. يتيح نهجنا ثنائي الوضع إمكانية البحث الدلالي للاستعلامات الاستكشافية مع توفير مطابقة دقيقة لاسترجاع محتوى محدد.</p>
<p>الفائدة المعمارية الرئيسية: الحفاظ على نظام قاعدة بيانات واحد يدعم كلا نموذجي البحث، مما يقلل من التعقيد التشغيلي مع توسيع نطاق الوظائف.</p>
<h2 id="What’s-Next" class="common-anchor-header">ما التالي؟<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن نجرب <strong>استعلامات</strong> <strong>هجينة</strong> <strong>تجمع بين المطابقة الدلالية والمطابقة التامة في بحث واحد</strong>. تخيل: "ابحث عن مقاطع مضحكة من الحلقة 281" حيث تستخدم كلمة "مضحك" البحث الدلالي وكلمة "الحلقة 281" المطابقة التامة.</p>
<p>لا يكمن مستقبل البحث في الاختيار بين الذكاء الاصطناعي الدلالي والمطابقة التامة. إنه استخدام <strong>كليهما</strong> بذكاء في نفس النظام.</p>
