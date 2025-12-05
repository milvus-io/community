---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  تقديم وظيفة التضمين: كيف يعمل ميلفوس 2.6 على تبسيط عملية التضمين والبحث
  الدلالي
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  اكتشف كيف يقوم Milvus 2.6 بتبسيط عملية التضمين والبحث عن المتجهات باستخدام
  إدخال البيانات وإخراجها. التعامل مع التضمين وإعادة الترتيب تلقائيًا - لا حاجة
  إلى معالجة مسبقة خارجية.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>إذا كنت قد أنشأت تطبيق بحث متجه من قبل، فأنت تعرف بالفعل سير العمل جيدًا. قبل أن يتم تخزين أي بيانات، يجب أولاً تحويلها إلى متجهات باستخدام نموذج التضمين، وتنظيفها وتنسيقها، ثم إدخالها في النهاية في قاعدة بيانات المتجهات. يمر كل استعلام بنفس العملية أيضًا: تضمين المدخلات، وإجراء بحث تشابه، ثم تعيين المعرفات الناتجة إلى المستندات أو السجلات الأصلية. يعمل ذلك - لكنه يخلق تشابكًا موزعًا من البرامج النصية للمعالجة المسبقة، وخطوط أنابيب التضمين، والرمز الصمغي الذي يجب عليك الحفاظ عليه.</p>
<p>تتخذ الآن<a href="https://milvus.io/">Milvus،</a> قاعدة البيانات المتجهة مفتوحة المصدر عالية الأداء، خطوة كبيرة نحو تبسيط كل ذلك. يقدم <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">الإصدار 2.6 من Milvus</a> <strong>ميزة إدخال البيانات وإخراجها (المعروفة أيضًا باسم</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>وظيفة التضمين</strong></a><strong>)</strong>، وهي قدرة تضمين مدمجة تتصل مباشرةً بمزودي النماذج الرئيسيين مثل OpenAI و AWS Bedrock و Google Vertex AI و Hugging Face. بدلاً من إدارة البنية التحتية للتضمين الخاصة بك، يمكن لـ Milvus الآن استدعاء هذه النماذج نيابةً عنك. يمكنك أيضًا الإدراج والاستعلام باستخدام نص أولي - وقريبًا أنواع البيانات الأخرى - بينما يتعامل Milvus تلقائيًا مع التوجيه في وقت الكتابة والاستعلام.</p>
<p>في بقية هذا المنشور، سنلقي نظرة فاحصة على كيفية عمل Data-in، Data-out تحت الغطاء، وكيفية تكوين الموفرين ووظائف التضمين، وكيف يمكنك استخدامها لتبسيط سير عمل البحث المتجه من البداية إلى النهاية.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">ما هو إدخال البيانات وإخراج البيانات؟<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>تم بناء Data-in، Data-out في Milvus 2.6 على وحدة الدالة الجديدة - وهو إطار عمل يمكّن Milvus من التعامل مع تحويل البيانات وتوليد التضمين داخليًا، دون أي خدمات خارجية للمعالجة المسبقة. (يمكنك متابعة اقتراح التصميم في <a href="https://github.com/milvus-io/milvus/issues/35856">إصدار GitHub رقم 35856</a>.) باستخدام هذه الوحدة، يمكن ل Milvus أخذ بيانات المدخلات الخام، واستدعاء موفر التضمين مباشرة، وكتابة المتجهات الناتجة تلقائيًا في مجموعتك.</p>
<p>على مستوى عالٍ، تحوّل الوحدة النمطية <strong>الدالة</strong> توليد التضمين إلى قدرة قاعدة بيانات أصلية. فبدلاً من تشغيل خطوط أنابيب تضمين منفصلة، أو عمال في الخلفية، أو خدمات إعادة التضمين، ترسل Milvus الآن الطلبات إلى الموفر الذي تم تكوينه، وتسترجع التضمينات، وتخزنها إلى جانب بياناتك - كل ذلك داخل مسار الاستيعاب. هذا يزيل النفقات التشغيلية لإدارة البنية التحتية للتضمين الخاصة بك.</p>
<p>إدخال البيانات وإخراج البيانات يقدم ثلاثة تحسينات رئيسية لسير عمل Milvus:</p>
<ul>
<li><p><strong>إدراج البيانات الخام مباشرةً</strong> - يمكنك الآن إدراج نصوص أو صور أو أنواع بيانات أخرى غير معالجة مباشرةً في Milvus. لا حاجة لتحويلها إلى متجهات مسبقًا.</p></li>
<li><p><strong>تكوين وظيفة تضمين واحدة</strong> - بمجرد تكوين نموذج التضمين في Milvus، فإنه يدير تلقائيًا عملية التضمين بأكملها. يتكامل Milvus بسلاسة مع مجموعة من موفري النماذج، بما في ذلك OpenAI و AWS Bedrock و Google Vertex AI و Cohere و Hugging Face.</p></li>
<li><p><strong>الاستعلام باستخدام مدخلات أولية</strong> - يمكنك الآن إجراء بحث دلالي باستخدام نص أولي أو استعلامات أخرى قائمة على المحتوى. يستخدم Milvus نفس النموذج الذي تم تكوينه لتوليد التضمينات أثناء التنقل، وإجراء بحث التشابه، وإرجاع النتائج ذات الصلة.</p></li>
</ul>
<p>باختصار، يقوم ميلفوس الآن بتضمين بياناتك تلقائيًا - وإعادة ترتيبها اختياريًا -. يصبح التضمين وظيفة مدمجة في قاعدة البيانات، مما يلغي الحاجة إلى خدمات التضمين الخارجية أو منطق المعالجة المسبقة المخصصة.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">كيف يعمل إدخال البيانات وإخراج البيانات<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>يوضح الرسم البياني أدناه كيفية عمل Data-in، Data-out داخل Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكن تقسيم سير عمل إدخال البيانات وإخراج البيانات إلى ست خطوات رئيسية:</p>
<ol>
<li><p><strong>بيانات الإدخال</strong> - يقوم المستخدم بإدخال البيانات الأولية - مثل النصوص أو الصور أو أنواع المحتوى الأخرى - مباشرةً في ملفوس دون إجراء أي معالجة مسبقة خارجية.</p></li>
<li><p><strong>توليد الت</strong> ضمينات - تستدعي وحدة الدالة تلقائيًا نموذج التضمين المكوّن من خلال واجهة برمجة التطبيقات الخارجية الخاصة بها، مما يحول المدخلات الأولية إلى تضمينات متجهة في الوقت الفعلي.</p></li>
<li><p><strong>تخزين</strong> التضمينات - تقوم Milvus بكتابة التضمينات التي تم إنشاؤها في حقل المتجه المخصص ضمن مجموعتك، حيث تصبح متاحة لعمليات البحث عن التشابه.</p></li>
<li><p><strong>إرسال استعلام</strong> - يقوم المستخدم بإصدار استعلام نصي خام أو استعلام قائم على المحتوى إلى Milvus، تمامًا كما هو الحال مع مرحلة الإدخال.</p></li>
<li><p><strong>البحث الدلالي</strong> - يقوم ميلفوس بتضمين الاستعلام باستخدام نفس النموذج المهيأ، ويقوم بإجراء بحث تشابه على المتجهات المخزنة، ويحدد أقرب التطابقات الدلالية.</p></li>
<li><p><strong>إرجاع النتائج</strong> - تقوم Milvus بإرجاع النتائج الأكثر تشابهًا - المعينة إلى بياناتها الأصلية - مباشرةً إلى التطبيق.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">كيفية تكوين إدخال البيانات وإخراج البيانات<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li><p>تثبيت أحدث إصدار من <strong>ميلفوس 2.6</strong>.</p></li>
<li><p>قم بإعداد مفتاح واجهة برمجة تطبيقات التضمين من موفر مدعوم (مثل OpenAI أو AWS Bedrock أو Cohere). في هذا المثال، سنستخدم <strong>Cohere</strong> كموفر التضمين.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">تعديل التكوين <code translate="no">milvus.yaml</code> </h3><p>إذا كنت تقوم بتشغيل Milvus مع <strong>Docker Compose،</strong> فستحتاج إلى تعديل الملف <code translate="no">milvus.yaml</code> لتمكين الوحدة النمطية Function. يمكنك الرجوع إلى الوثائق الرسمية للحصول على إرشادات: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">تكوين ملف Milvus مع Docker Compose</a> (يمكن أيضًا العثور على إرشادات لطرق النشر الأخرى هنا).</p>
<p>في ملف التكوين، حدد موقع القسمين <code translate="no">credential</code> و <code translate="no">function</code>.</p>
<p>ثم قم بتحديث الحقلين <code translate="no">apikey1.apikey</code> و <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد إجراء هذه التغييرات، أعد تشغيل ميلفوس لتطبيق التكوين المحدث.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">كيفية استخدام خاصية إدخال البيانات وإخراج البيانات<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. تحديد المخطط الخاص بالمجموعة</h3><p>لتمكين ميزة التضمين، يجب أن يتضمن <strong>مخطط مجموع</strong> تك ثلاثة حقول على الأقل:</p>
<ul>
<li><p><strong>حقل المفتاح الأساسي (</strong><code translate="no">id</code> ) - يحدد بشكل فريد كل كيان في المجموعة.</p></li>
<li><p><strong>الحقل القياسي (</strong><code translate="no">document</code> ) - يخزن البيانات الأولية الأصلية.</p></li>
<li><p><strong>حقل المتجه (</strong><code translate="no">dense</code> ) - يخزن التضمينات المتجهة التي تم إنشاؤها.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. تعريف دالة التضمين</h3><p>بعد ذلك، قم بتعريف دالة <strong>التضمين</strong> في المخطط.</p>
<ul>
<li><p><code translate="no">name</code> - معرف فريد للدالة.</p></li>
<li><p><code translate="no">function_type</code> - يتم تعيينه على <code translate="no">FunctionType.TEXTEMBEDDING</code> لتضمينات النص. يدعم ميلفوس أيضًا أنواع الدوال الأخرى مثل <code translate="no">FunctionType.BM25</code> و <code translate="no">FunctionType.RERANK</code>. راجع <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">نظرة عامة على</a> <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">البحث عن النص الكامل</a> <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">وتضاؤل التصنيف</a> لمزيد من التفاصيل.</p></li>
<li><p><code translate="no">input_field_names</code> - يحدد حقل الإدخال للبيانات الأولية (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - يحدد حقل الإخراج حيث سيتم تخزين التضمينات المتجهة (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - يحتوي على معلمات التكوين لدالة التضمين. يجب أن تتطابق قيم <code translate="no">provider</code> و <code translate="no">model_name</code> مع الإدخالات المقابلة في ملف التكوين <code translate="no">milvus.yaml</code> الخاص بك.</p></li>
</ul>
<p><strong>ملاحظة:</strong> يجب أن تحتوي كل دالة على <code translate="no">name</code> و <code translate="no">output_field_names</code> فريدة من نوعها للتمييز بين منطق التحويلات المختلفة ومنع التضارب.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. تكوين الفهرس</h3><p>بمجرد تحديد الحقول والدوال، قم بإنشاء فهرس للمجموعة. للتبسيط، نستخدم نوع AUTOINDEX هنا كمثال.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. إنشاء المجموعة</h3><p>استخدم المخطط والفهرس المحددين لإنشاء مجموعة جديدة. في هذا المثال، سننشئ مجموعة باسم Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. إدراج البيانات</h3><p>يمكنك الآن إدراج البيانات الأولية مباشرةً في Milvus - لا حاجة لإنشاء تضمينات يدويًا.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. إجراء بحث المتجهات</h3><p>بعد إدراج البيانات، يمكنك إجراء عمليات البحث مباشرةً باستخدام استعلامات نصية أولية. يقوم Milvus تلقائيًا بتحويل استعلامك إلى تضمين وإجراء بحث تشابه مع المتجهات المخزنة وإرجاع أفضل التطابقات.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>لمزيد من التفاصيل حول البحث المتجه، انظر: <a href="https://milvus.io/docs/single-vector-search.md">البحث الأساسي عن المتجهات </a> <a href="https://milvus.io/docs/get-and-scalar-query.md">وواجهة برمجة تطبيقات الاستعلام</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">ابدأ مع ميلفوس 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>من خلال إدخال البيانات وإخراج البيانات، يرتقي ميلفوس 2.6 ببساطة البحث المتجه إلى المستوى التالي. من خلال دمج وظائف التضمين وإعادة الترتيب مباشرةً داخل Milvus، لم تعد بحاجة إلى إدارة المعالجة المسبقة الخارجية أو الاحتفاظ بخدمات تضمين منفصلة.</p>
<p>هل أنت مستعد لتجربتها؟ قم بتثبيت <a href="https://milvus.io/docs">Milvus</a> 2.6 اليوم وجرّب بنفسك قوة تضمين البيانات وإخراجها.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">تعرف على المزيد حول ميزات Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">تقديم Milvus 2.6: بحث متجه ميسور التكلفة على نطاق المليار</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">تمزيق JSON في ميلفوس: تصفية JSON أسرع ب 88.9 مرة مع المرونة</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">فتح الاسترجاع الحقيقي على مستوى الكيان: قدرات صفيف الهياكل الجديدة وقدرات MAX_SIM في ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في ميلفوس: السلاح السري لمكافحة التكرارات في بيانات تدريب LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - قواعد بيانات المتجهات تستحق اختبارًا حقيقيًا </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">البحث المتجه في العالم الحقيقي: كيفية التصفية بكفاءة دون قتل التذكر </a></p></li>
</ul>
