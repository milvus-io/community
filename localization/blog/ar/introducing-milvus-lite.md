---
id: introducing-milvus-lite.md
title: 'تقديم Milvus Lite: ابدأ في إنشاء تطبيق GenAI في ثوانٍ معدودة'
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>نحن متحمسون لتقديم <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite،</a> وهي قاعدة بيانات متجهات خفيفة الوزن تعمل محليًا داخل تطبيق Python الخاص بك. استنادًا إلى قاعدة بيانات <a href="https://milvus.io/intro">Milvus</a> المتجهة الشهيرة مفتوحة المصدر، تعيد Milvus Lite استخدام المكونات الأساسية لفهرسة المتجهات وتحليل الاستعلامات مع إزالة العناصر المصممة لقابلية التوسع العالية في الأنظمة الموزعة. يجعل هذا التصميم حلًا مدمجًا وفعالًا مثاليًا للبيئات ذات موارد الحوسبة المحدودة، مثل أجهزة الكمبيوتر المحمولة وأجهزة Jupyter Notebook والأجهزة المحمولة أو الأجهزة المتطورة.</p>
<p>يتكامل Milvus Lite مع العديد من حزم تطوير الذكاء الاصطناعي مثل LangChain وLlamaIndex، مما يتيح استخدامه كمخزن متجه في خطوط أنابيب الاسترجاع المعززة (RAG) دون الحاجة إلى إعداد الخادم. ما عليك سوى تشغيل <code translate="no">pip install pymilvus</code> (الإصدار 2.4.3 أو أعلى) لدمجه في تطبيق الذكاء الاصطناعي الخاص بك كمكتبة بايثون.</p>
<p>يشارك Milvus Lite واجهة برمجة تطبيقات Milvus، مما يضمن أن تعمل شفرتك من جانب العميل مع كل من عمليات النشر المحلية صغيرة النطاق وخوادم Milvus المنشورة على Docker أو Kubernetes مع مليارات المتجهات.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">لماذا صممنا Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>تتطلب العديد من تطبيقات الذكاء الاصطناعي البحث عن تشابه المتجهات للبيانات غير المهيكلة، بما في ذلك النصوص والصور والأصوات ومقاطع الفيديو، لتطبيقات مثل روبوتات الدردشة الآلية ومساعدات التسوق. صُممت قواعد البيانات المتجهة لتخزين التضمينات المتجهة والبحث فيها وهي جزء أساسي من مجموعة تطوير الذكاء الاصطناعي، خاصةً لحالات استخدام الذكاء الاصطناعي التوليدي مثل <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">التوليد المعزز للاسترجاع (RAG)</a>.</p>
<p>وعلى الرغم من توافر العديد من حلول البحث عن المتجهات، إلا أنه لم يكن هناك خيار سهل التشغيل يعمل أيضًا لعمليات النشر الإنتاجية واسعة النطاق. وبصفتنا مبتكري Milvus، قمنا بتصميم Milvus Lite لمساعدة مطوري الذكاء الاصطناعي على إنشاء تطبيقات أسرع مع ضمان تجربة متسقة عبر خيارات النشر المختلفة، بما في ذلك Milvus على Kubernetes وDocker والخدمات السحابية المُدارة.</p>
<p>يعد Milvus Lite إضافة مهمة إلى مجموعة عروضنا ضمن نظام Milvus البيئي. فهو يوفر للمطورين أداة متعددة الاستخدامات تدعم كل مرحلة من مراحل رحلة التطوير الخاصة بهم. من النماذج الأولية إلى بيئات الإنتاج ومن الحوسبة المتطورة إلى عمليات النشر واسعة النطاق، أصبحت Milvus الآن قاعدة البيانات المتجهة الوحيدة التي تغطي حالات الاستخدام من أي حجم وفي جميع مراحل التطوير.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">كيف يعمل ميلفوس لايت<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus Lite جميع العمليات الأساسية المتوفرة في Milvus، مثل إنشاء المجموعات وإدراج المتجهات والبحث عنها وحذفها. وسيدعم قريبًا ميزات متقدمة مثل البحث الهجين. يقوم Milvus Lite بتحميل البيانات في الذاكرة لإجراء عمليات بحث فعالة واستمرارها كملف SQLite.</p>
<p>يتم تضمين Milvus Lite في <a href="https://github.com/milvus-io/pymilvus">Python SDK الخاص بـ Milvus</a> ويمكن نشره باستخدام <code translate="no">pip install pymilvus</code>. يوضح المقتطف البرمجي التالي كيفية إعداد قاعدة بيانات متجهية باستخدام Milvus Lite عن طريق تحديد اسم ملف محلي ثم إنشاء مجموعة جديدة. بالنسبة لأولئك الذين هم على دراية بواجهة برمجة تطبيقات Milvus، فإن الفرق الوحيد هو أن <code translate="no">uri</code> يشير إلى اسم ملف محلي بدلاً من نقطة نهاية الشبكة، على سبيل المثال، <code translate="no">&quot;milvus_demo.db&quot;</code> بدلاً من <code translate="no">&quot;http://localhost:19530&quot;</code> لخادم Milvus. كل شيء آخر يبقى كما هو. يدعم Milvus Lite أيضًا تخزين النص الخام والتسميات الأخرى كبيانات وصفية، باستخدام مخطط ديناميكي أو محدد بشكل صريح، كما هو موضح أدناه.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>من أجل قابلية التوسع، يمكن لتطبيق ذكاء اصطناعي تم تطويره باستخدام Milvus Lite الانتقال بسهولة إلى استخدام Milvus المنشور على Docker أو Kubernetes بمجرد تحديد <code translate="no">uri</code> مع نقطة نهاية الخادم.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">التكامل مع مكدس تطوير الذكاء الاصطناعي<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى تقديم Milvus Lite لجعل البحث المتجه سهل البدء به، تتكامل Milvus أيضًا مع العديد من أطر العمل ومزودي حزمة تطوير الذكاء الاصطناعي، بما في ذلك <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a> <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">وLlamaIndex</a> <a href="https://haystack.deepset.ai/integrations/milvus-document-store">وHaystack</a> <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">وVoyage AI</a> <a href="https://milvus.io/docs/integrate_with_ragas.md">وRagas</a> <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">وJina AI</a> <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">وDSPy</a> <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">وBentoML</a> <a href="https://chiajy.medium.com/70873c7576f1">وWayHow</a> <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">وRealari AI</a> <a href="https://docs.airbyte.com/integrations/destinations/milvus">وAirbyte</a> <a href="https://milvus.io/docs/integrate_with_hugging-face.md">وHuggingFace</a> <a href="https://memgpt.readme.io/docs/storage#milvus">وMemGPT</a>. وبفضل أدواتها وخدماتها الشاملة، تعمل عمليات التكامل هذه على تبسيط تطوير تطبيقات الذكاء الاصطناعي مع إمكانية البحث المتجه.</p>
<p>وهذه ليست سوى البداية فقط - هناك العديد من عمليات التكامل المثيرة التي ستحدث قريباً! ترقبوا المزيد!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">المزيد من الموارد والأمثلة<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>استكشف <a href="https://milvus.io/docs/quickstart.md">وثائق Milvus للبدء السريع</a> للحصول على أدلة تفصيلية وأمثلة على التعليمات البرمجية حول استخدام Milvus Lite لبناء تطبيقات الذكاء الاصطناعي مثل الاسترجاع المعزز<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG)</a> <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">والبحث عن الصور</a>.</p>
<p>ميلفوس لايت هو مشروع مفتوح المصدر، ونحن نرحب بمساهماتك. اطلع على <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">دليل المساهمة</a> للبدء. يمكنك أيضًا الإبلاغ عن الأخطاء أو طلب ميزات عن طريق تسجيل مشكلة على مستودع <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite في GitHub</a>.</p>
