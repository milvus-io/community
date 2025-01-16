---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: كيفية استخدام بيانات السلاسل لتمكين تطبيقات البحث عن التشابه لديك
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: استخدم بيانات السلسلة لتبسيط عملية إنشاء تطبيقات البحث عن التشابه الخاصة بك.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>الغلاف</span> </span></p>
<p>يأتي Milvus 2.1 مع <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">بعض التحديثات المهمة</a> التي تجعل العمل مع Milvus أسهل بكثير. أحدها هو دعم نوع بيانات السلاسل. في الوقت الحالي <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">يدعم Milvus أنواع البيانات</a> بما في ذلك السلاسل والمتجهات والمنطقيين والأعداد الصحيحة والأرقام ذات الفاصلة العائمة وغيرها.</p>
<p>تقدم هذه المقالة مقدمة لدعم نوع بيانات السلسلة. اقرأ وتعرف على ما يمكنك فعله به وكيفية استخدامه.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">ما الذي يمكنك فعله ببيانات السلسلة؟</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">كيفية إدارة بيانات السلسلة في Milvus 2.1؟</a><ul>
<li><a href="#Create-a-collection">إنشاء مجموعة</a></li>
<li><a href="#Insert-data">إدراج البيانات وحذفها</a></li>
<li><a href="#Build-an-index">إنشاء فهرس</a></li>
<li><a href="#Hybrid-search">البحث الهجين</a></li>
<li><a href="#String-expressions">تعبيرات السلسلة</a></li>
</ul></li>
</ul>
<custom-h1>ما الذي يمكنك فعله ببيانات السلسلة؟</custom-h1><p>كان دعم نوع بيانات السلسلة من أكثر الوظائف التي يتوقعها المستخدمون. فهو يعمل على تبسيط عملية إنشاء تطبيق باستخدام قاعدة بيانات Milvus المتجهة وتسريع سرعة البحث عن التشابه والاستعلام المتجه، مما يزيد من الكفاءة إلى حد كبير ويقلل من تكلفة الصيانة لأي تطبيق تعمل عليه.</p>
<p>على وجه التحديد، يدعم Milvus 2.1 Milvus 2.1 نوع البيانات VARCHAR، الذي يخزن سلاسل الأحرف ذات الأطوال المتفاوتة. مع دعم نوع بيانات VARCHAR، يمكنك:</p>
<ol>
<li>إدارة بيانات السلاسل مباشرةً دون مساعدة قاعدة بيانات علائقية خارجية.</li>
</ol>
<p>يمكّنك دعم نوع بيانات VARCHAR من تخطي خطوة تحويل السلاسل إلى أنواع بيانات أخرى عند إدراج البيانات في Milvus. لنفترض أنك تعمل على نظام بحث عن الكتب لمتجر الكتب الخاص بك على الإنترنت. أنت تقوم بإنشاء مجموعة بيانات للكتب وتريد تحديد الكتب بأسمائها. بينما في الإصدارات السابقة حيث لا يدعم Milvus نوع بيانات السلسلة، قبل إدراج البيانات في MIilvus، قد تحتاج أولاً إلى تحويل السلاسل (أسماء الكتب) إلى معرّفات الكتب بمساعدة قاعدة بيانات علائقية مثل MySQL. في الوقت الحالي، نظرًا لأن نوع بيانات السلاسل مدعوم، يمكنك ببساطة إنشاء حقل سلسلة وإدخال أسماء الكتب مباشرةً بدلاً من أرقام معرفاتها.</p>
<p>تذهب الراحة أيضًا إلى عملية البحث والاستعلام. تخيل أن هناك عميل كتابه المفضل هو <em>Hello Milvus</em>. تريد البحث في النظام عن كتب مشابهة والتوصية بها للعميل. في الإصدارات السابقة من Milvus، سيعيد لك النظام معرّفات الكتب فقط وتحتاج إلى اتخاذ خطوة إضافية للتحقق من معلومات الكتاب المقابلة في قاعدة بيانات علائقية. ولكن في الإصدار Milvus 2.1، يمكنك الحصول على أسماء الكتب مباشرةً لأنك قمت بالفعل بإنشاء حقل سلسلة بأسماء الكتب فيه.</p>
<p>باختصار، يوفر عليك دعم نوع بيانات السلسلة الجهد المبذول في اللجوء إلى أدوات أخرى لإدارة بيانات السلسلة، مما يبسط عملية التطوير بشكل كبير.</p>
<ol start="2">
<li>تسريع سرعة <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">البحث الهجين</a> <a href="https://milvus.io/docs/v2.1.x/query.md">والاستعلام المتجه</a> من خلال تصفية السمات.</li>
</ol>
<p>مثل أنواع البيانات العددية الأخرى، يمكن استخدام VARCHAR لتصفية السمات في البحث المختلط والاستعلام المتجه من خلال التعبير المنطقي. تجدر الإشارة بشكل خاص إلى أن Milvus 2.1 يضيف عامل التشغيل <code translate="no">like</code> ، والذي يمكّنك من إجراء مطابقة البادئة. أيضًا، يمكنك إجراء مطابقة تامة باستخدام المشغل <code translate="no">==</code>.</p>
<p>إلى جانب ذلك، يتم دعم الفهرس المقلوب القائم على MARISA-trie لتسريع البحث والاستعلام المختلط. استمر في القراءة واكتشف جميع تعبيرات السلاسل التي قد ترغب في معرفتها لإجراء تصفية السمات باستخدام بيانات السلسلة.</p>
<custom-h1>كيفية إدارة بيانات السلسلة في Milvus 2.1؟</custom-h1><p>نعلم الآن أن نوع بيانات السلسلة مفيد للغاية، ولكن متى نحتاج بالضبط إلى استخدام نوع البيانات هذا في بناء تطبيقاتنا الخاصة؟ في ما يلي، سترى بعض الأمثلة البرمجية للسيناريوهات التي قد تتضمن بيانات السلسلة، والتي ستمنحك فهمًا أفضل لكيفية إدارة بيانات VARCHAR في Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">إنشاء مجموعة<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>دعنا نتبع المثال السابق. أنت ما زلت تعمل على نظام التوصية بالكتب وتريد إنشاء مجموعة كتب مع حقل مفتاح أساسي يسمى <code translate="no">book_name</code> ، حيث ستقوم بإدراج بيانات السلسلة. في هذه الحالة، يمكنك تعيين نوع البيانات على أنه <code translate="no">DataType.VARCHAR</code>عند تعيين مخطط الحقل، كما هو موضح في المثال أدناه.</p>
<p>لاحظ أنه عند إنشاء حقل VARCHAR، من الضروري تحديد الحد الأقصى لطول الحرف عبر المعلمة <code translate="no">max_length</code> التي يمكن أن تتراوح قيمتها من 1 إلى 65,535 65,535.  في هذا المثال، قمنا بتعيين الحد الأقصى للطول 200.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">إدراج البيانات<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن تم إنشاء المجموعة، يمكننا إدراج البيانات فيها. في المثال التالي، نقوم بإدراج 2000 صف من بيانات السلسلة التي تم إنشاؤها عشوائيًا.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">حذف البيانات<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>لنفترض أن كتابين، المسمى <code translate="no">book_0</code> و <code translate="no">book_1</code> ، لم يعودا متاحين في متجرك، لذلك تريد حذف المعلومات ذات الصلة من قاعدة البيانات الخاصة بك. في هذه الحالة، يمكنك استخدام تعبير المصطلح <code translate="no">in</code> لتصفية الكيانات المراد حذفها، كما هو موضح في المثال أدناه.</p>
<p>تذكر أن ميلفوس يدعم فقط حذف الكيانات ذات المفاتيح الأساسية المحددة بوضوح، لذا قبل تشغيل الكود التالي، تأكد من أنك قمت بتعيين الحقل <code translate="no">book_name</code> كحقل المفتاح الأساسي.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">إنشاء فهرس<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم ميلفوس 2.1 إنشاء فهارس عددية، مما يسرع بشكل كبير من تصفية حقول السلسلة. على عكس بناء فهرس متجه، لا يتعين عليك إعداد معلمات قبل بناء فهرس عددية. لا يدعم Milvus مؤقتًا سوى فهرس شجرة القاموس (MARISA-trie)، لذا فإن نوع فهرس الحقل من نوع VARCHAR هو MARISA-trie افتراضيًا.</p>
<p>يمكنك تحديد اسم الفهرس عند إنشائه. إذا لم يتم تحديده، فإن القيمة الافتراضية <code translate="no">index_name</code> هي <code translate="no">&quot;_default_idx_&quot;</code>. في المثال أدناه، قمنا بتسمية الفهرس <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">البحث الهجين<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>من خلال تحديد التعبيرات المنطقية، يمكنك تصفية حقول السلسلة أثناء البحث عن التشابه المتجه.</p>
<p>على سبيل المثال، إذا كنت تبحث عن الكتب التي تتشابه مقدمتها مع Hello Milvus ولكنك تريد فقط الحصول على الكتب التي تبدأ أسماؤها بـ "book_2"، يمكنك استخدام عامل التشغيل <code translate="no">like</code>لإجراء مطابقة البادئة والحصول على الكتب المستهدفة، كما هو موضح في المثال أدناه.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">تعبيرات السلسلة<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>بصرف النظر عن المشغل المضاف حديثًا <code translate="no">like</code> ، يمكن أيضًا استخدام المشغلات الأخرى، المدعومة بالفعل في الإصدارات السابقة من ميلفوس، لتصفية حقول السلاسل. فيما يلي بعض الأمثلة على <a href="https://milvus.io/docs/v2.1.x/boolean.md">تعبيرات السلاسل</a> شائعة الاستخدام، حيث يمثل <code translate="no">A</code> حقلاً من النوع VARCHAR. تذكر أن جميع تعبيرات السلسلة أدناه يمكن دمجها منطقيًا باستخدام عوامل منطقية، مثل AND و OR و NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">عمليات التعيين</h3><p>يمكنك استخدام <code translate="no">in</code> و <code translate="no">not in</code> لتحقيق عمليات المجموعة، مثل <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">المقارنة بين حقلي سلسلة</h3><p>يمكنك استخدام العوامل العلائقية لمقارنة قيم حقلي سلسلة. تتضمن هذه العوامل العلائقية <code translate="no">==</code> ، <code translate="no">!=</code> ، ، <code translate="no">&gt;</code> ، <code translate="no">&gt;=</code> ، <code translate="no">&lt;</code> ، <code translate="no">&lt;=</code>. لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">العوامل العلائقية</a>.</p>
<p>لاحظ أنه يمكن مقارنة حقول السلسلة فقط مع حقول سلسلة أخرى بدلاً من حقول أنواع البيانات الأخرى. على سبيل المثال، لا يمكن مقارنة حقل من النوع VARCHAR مع حقل من النوع المنطقي أو من النوع الصحيح.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">مقارنة حقل بقيمة ثابتة</h3><p>يمكنك استخدام <code translate="no">==</code> أو <code translate="no">!=</code> للتحقق مما إذا كانت قيمة الحقل تساوي قيمة ثابتة.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">تصفية الحقول بنطاق واحد</h3><p>يمكنك استخدام <code translate="no">&gt;</code> و <code translate="no">&gt;=</code> و و <code translate="no">&lt;</code> و <code translate="no">&lt;=</code> لتصفية حقول السلسلة ذات النطاق الواحد، مثل <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">مطابقة البادئة</h3><p>كما ذكرنا سابقًا، يضيف ميلفوس 2.1 المشغل <code translate="no">like</code> لمطابقة البادئة، مثل <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">ما التالي<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار الرسمي ل Milvus 2.1، أعددنا سلسلة من المدونات التي تقدم الميزات الجديدة. اقرأ المزيد في سلسلة المدونات هذه:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلسلة لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
