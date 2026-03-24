---
id: milvus-boost-ranker-business-aware-vector-search.md
title: كيفية استخدام مصنف Milvus Boost Ranker للبحث عن المتجهات الواعية للأعمال
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  تعلّم كيف يتيح لك برنامج Milvus Boost Ranker وضع قواعد العمل فوق قواعد التشابه
  المتجه - تعزيز المستندات الرسمية، وإزالة المحتوى القديم، وإضافة التنوع.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>يصنّف البحث في المتجهات النتائج من خلال تضمين التشابه - كلما كانت المتجهات أقرب، كلما كانت النتيجة أعلى. تضيف بعض الأنظمة أداة إعادة ترتيب قائمة على النموذج (BGE، Voyage، Cohere) لتحسين الترتيب. لكن لا يعالج أي من النهجين متطلبًا أساسيًا في الإنتاج: <strong>سياق العمل مهم بقدر أهمية الصلة الدلالية، وأحيانًا أكثر.</strong></p>
<p>يحتاج موقع التجارة الإلكترونية إلى عرض المنتجات الموجودة في المخزون من المتاجر الرسمية أولاً. تريد منصة المحتوى تثبيت الإعلانات الأخيرة. تحتاج قاعدة معارف المؤسسة إلى مستندات موثوقة في الأعلى. عندما يعتمد الترتيب على المسافة المتجهة فقط، يتم تجاهل هذه القواعد. قد تكون النتائج ذات صلة، ولكنها ليست مناسبة.</p>
<p>يعمل<strong><a href="https://milvus.io/docs/reranking.md">برنامج Boost Ranker،</a></strong> الذي تم تقديمه في الإصدار 2.6 <a href="https://milvus.io/intro">من Milvus،</a> على حل هذه المشكلة. فهو يتيح لك تعديل تصنيفات نتائج البحث باستخدام قواعد البيانات الوصفية - دون إعادة بناء الفهرس أو تغيير النموذج. يغطي هذا المقال كيفية عمله، ومتى يتم استخدامه، وكيفية تطبيقه مع التعليمات البرمجية.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">ما هو بووست رانكر المعزز؟<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>بووست رانكر Boost Ranker هي ميزة إعادة ترتيب خفيفة الوزن وقائمة على القواعد في Milvus 2.6.2</strong> والتي تعدل نتائج <a href="https://zilliz.com/learn/vector-similarity-search">البحث المتجه</a> باستخدام حقول البيانات الوصفية القياسية. على عكس برامج إعادة الترتيب المستندة إلى النماذج التي تستدعي خدمات LLMs الخارجية أو خدمات التضمين، يعمل Boost Ranker بالكامل داخل Milvus باستخدام قواعد تصفية وترجيح بسيطة. لا توجد تبعيات خارجية، والحد الأدنى من الكمون الزائد - مناسب للاستخدام في الوقت الحقيقي.</p>
<p>يمكنك تكوينه من خلال <a href="https://milvus.io/docs/manage-functions.md">واجهة برمجة التطبيقات الوظيفية</a>. بعد أن يقوم البحث المتجه بإرجاع مجموعة من المرشحين، يطبق Boost Ranker ثلاث عمليات:</p>
<ol>
<li><strong>تصفية:</strong> تحديد النتائج المطابقة لشروط محددة (على سبيل المثال، <code translate="no">is_official == true</code>)</li>
<li><strong>التعزيز:</strong> ضرب درجاتهم في وزن تم تكوينه</li>
<li><strong>خلط ورق اللعب:</strong> إضافة عامل عشوائي صغير (0-1) اختياريًا لإدخال التنوع</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">كيف يعمل تحت الغطاء</h3><p>يعمل Boost Ranker داخل Milvus كخطوة ما بعد المعالجة:</p>
<ol>
<li><strong>البحث في المتجهات</strong> - يقوم كل مقطع بإرجاع المرشحين مع المعرفات ودرجات التشابه والبيانات الوصفية.</li>
<li><strong>تطبيق القواعد</strong> - يقوم النظام بتصفية السجلات المطابقة وتعديل درجاتها باستخدام الوزن المكوّن واختياري <code translate="no">random_score</code>.</li>
<li><strong>الدمج والفرز</strong> - يتم دمج جميع المرشحين وإعادة فرزهم حسب الدرجات المحدّثة للحصول على النتائج النهائية لأعلى K.</li>
</ol>
<p>نظرًا لأن برنامج Boost Ranker يعمل فقط على المرشحين الذين تم استرجاعهم بالفعل - وليس على مجموعة البيانات الكاملة - فإن التكلفة الحسابية الإضافية لا تُذكر.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">متى يجب عليك استخدام بووست رانكر المعزز؟<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">تعزيز النتائج المهمة</h3><p>حالة الاستخدام الأكثر شيوعًا: وضع قواعد عمل بسيطة فوق البحث الدلالي.</p>
<ul>
<li><strong>التجارة الإلكترونية:</strong> تعزيز المنتجات من المتاجر الرئيسية أو البائعين الرسميين أو العروض الترويجية المدفوعة. ادفع العناصر ذات المبيعات الحديثة العالية أو معدلات النقر إلى أعلى.</li>
<li><strong>منصات المحتوى:</strong> إعطاء الأولوية للمحتوى المنشور حديثًا عبر حقل <code translate="no">publish_time</code> ، أو تعزيز المنشورات من الحسابات التي تم التحقق منها.</li>
<li><strong>بحث المؤسسة:</strong> إعطاء أولوية أعلى للمستندات حيث <code translate="no">doctype == &quot;policy&quot;</code> أو <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>كل ذلك قابل للتكوين باستخدام مرشح + وزن. لا تغييرات في نموذج التضمين ولا إعادة بناء الفهرس.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">التخفيض دون إزالة</h3><p>يمكن لـ Boost Ranker أيضًا خفض الترتيب لنتائج معينة - وهو بديل أكثر ليونة للتصفية الصعبة.</p>
<ul>
<li><strong>المنتجات منخفضة المخزون:</strong> إذا كان <code translate="no">stock &lt; 10</code> ، خفض وزنها قليلاً. لا يزال من الممكن العثور عليها، ولكن لن تهيمن على المراكز العليا.</li>
<li><strong>المحتوى الحساس:</strong> خفض وزن المحتوى الذي تم الإبلاغ عنه بدلاً من إزالته بالكامل. يحد من التعرض دون رقابة صارمة.</li>
<li><strong>المستندات القديمة:</strong> يتم تصنيف المستندات التي تم الإبلاغ عنها <code translate="no">year &lt; 2020</code> في مرتبة أقل بحيث يظهر المحتوى الأحدث أولاً.</li>
</ul>
<p>لا يزال بإمكان المستخدمين العثور على النتائج التي تم تخفيض رتبتها عن طريق التمرير أو البحث بشكل أكثر دقة، ولكن لن يزاحموا المحتوى الأكثر صلة.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">إضافة التنوع مع العشوائية المحكومة</h3><p>عندما يكون للعديد من النتائج نتائج متشابهة، يمكن أن تبدو أعلى K متطابقة عبر الاستعلامات. تُدخل معلمة <code translate="no">random_score</code> الخاصة بـ Boost Ranker تباينًا طفيفًا:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: يتحكم في العشوائية الشاملة من أجل التكرار</li>
<li><code translate="no">field</code>: عادة ما يكون المفتاح الأساسي <code translate="no">id</code> ، يضمن حصول نفس السجل على نفس القيمة العشوائية في كل مرة</li>
</ul>
<p>هذا مفيد <strong>لتنويع التوصيات</strong> (منع نفس العناصر من الظهور أولًا دائمًا) <strong>والاستكشاف</strong> (الجمع بين أوزان الأعمال الثابتة مع الاضطرابات العشوائية الصغيرة).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">الجمع بين مصنف التعزيز مع مصنفات أخرى</h3><p>يتم تعيين Boost Ranker عبر واجهة برمجة التطبيقات الوظيفية مع <code translate="no">params.reranker = &quot;boost&quot;</code>. هناك أمران يجب معرفتهما بشأن الجمع بينه</p>
<ul>
<li><strong>التقييد:</strong> في البحث الهجين (متعدد النواقل)، لا يمكن أن يكون Boost Ranker هو المصنف الأعلى مستوى. ولكن يمكن استخدامه داخل كل <code translate="no">AnnSearchRequest</code> فردي لضبط النتائج قبل دمجها.</li>
<li><strong>التوليفات الشائعة:</strong><ul>
<li><strong>RRRF + Boo</strong> st<strong>:</strong> استخدام RRF لدمج النتائج متعددة النماذج، ثم تطبيق Boost للضبط الدقيق القائم على البيانات الوصفية.</li>
<li>مصنف<strong>النموذج + Boost:</strong> استخدم مصنف قائم على النموذج للجودة الدلالية، ثم استخدم Boost لقواعد العمل.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">كيفية تكوين مصنف Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>يتم تكوين مصنف Boost Ranker من خلال واجهة برمجة التطبيقات الوظيفية. للحصول على منطق أكثر تعقيدًا، ادمجه مع <code translate="no">FunctionScore</code> لتطبيق قواعد متعددة معًا.</p>
<h3 id="Required-Fields" class="common-anchor-header">الحقول المطلوبة</h3><p>عند إنشاء كائن <code translate="no">Function</code> </p>
<ul>
<li><code translate="no">name</code>: أي اسم مخصص</li>
<li><code translate="no">input_field_names</code>: يجب أن يكون قائمة فارغة <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: يجب أن يكون <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: يجب أن يكون <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">معلمات المفتاح</h3><p><strong><code translate="no">params.weight</code> (مطلوب)</strong></p>
<p>المضاعف المطبق على درجات السجلات المطابقة. تعتمد كيفية تعيينه على المقياس:</p>
<table>
<thead>
<tr><th>نوع المقياس</th><th>لتعزيز النتائج</th><th>لتخفيض النتائج</th></tr>
</thead>
<tbody>
<tr><td>الأعلى هو الأفضل (COSINE، IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>الأدنى هو الأفضل (L2/إقليديوس)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (اختياري)</strong></p>
<p>شرط يحدد السجلات التي يتم تعديل درجاتها:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>تتأثر السجلات المطابقة فقط. كل شيء آخر يحتفظ بدرجاته الأصلية.</p>
<p><strong><code translate="no">params.random_score</code> (اختياري)</strong></p>
<p>يضيف قيمة عشوائية بين 0 و1 للتنوع. راجع قسم العشوائية أعلاه للحصول على التفاصيل.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">قاعدة واحدة مقابل قواعد متعددة</h3><p><strong>قاعدة واحدة</strong> - عندما يكون لديك قيد عمل واحد (على سبيل المثال، تعزيز المستندات الرسمية)، قم بتمرير المصنف مباشرةً إلى <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>قواعد متعددة</strong> - عندما تحتاج إلى عدة قيود (إعطاء الأولوية للعناصر الموجودة في المخزون + تخفيض رتبة المنتجات ذات التصنيف المنخفض + إضافة العشوائية)، قم بإنشاء عدة <code translate="no">Function</code> كائنات ودمجها مع <code translate="no">FunctionScore</code>. يمكنك تكوين:</p>
<ul>
<li><code translate="no">boost_mode</code>: كيف تتحد كل قاعدة مع النتيجة الأصلية (<code translate="no">multiply</code> أو <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: كيفية دمج قواعد متعددة مع بعضها البعض (<code translate="no">multiply</code> أو <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">التدريب العملي: تحديد أولويات الوثائق الرسمية<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>دعنا نتناول مثالاً ملموسًا: جعل المستندات الرسمية تحتل مرتبة أعلى في نظام البحث عن المستندات.</p>
<h3 id="Schema" class="common-anchor-header">المخطط</h3><p>مجموعة تسمى <code translate="no">milvus_collection</code> مع هذه الحقول:</p>
<table>
<thead>
<tr><th>الحقل</th><th>النوع</th><th>الغرض</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>المفتاح الأساسي</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>نص المستند</td></tr>
<tr><td><code translate="no">embedding</code></td><td>متجه_عائم (3072)</td><td>متجه دلالي</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>الأصل: &quot;رسمي&quot;، أو &quot;مجتمع&quot;، أو &quot;تذكرة&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>بوول</td><td><code translate="no">True</code> إذا <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>الحقلان <code translate="no">source</code> و <code translate="no">is_official</code> هما حقلا البيانات الوصفية التي سيستخدمها Boost Ranker لضبط التصنيفات.</p>
<h3 id="Setup-Code" class="common-anchor-header">رمز الإعداد</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">مقارنة النتائج: مع وبدون تعزيز التصنيف</h3><p>أولاً، قم بإجراء بحث أساسي بدون Boost Ranker. ثم أضف Boost Ranker مع <code translate="no">filter: is_official == true</code> و <code translate="no">weight: 1.2</code> ، وقارن.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">النتائج</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>التغيير الرئيسي: قفز المستند <code translate="no">id=2</code> (الرسمي) من المركز الرابع إلى المركز الثاني لأنه تم ضرب نتيجته في 1.2. لم تتم إزالة منشورات المجتمع وسجلات التذاكر - بل تم حذفها فقط في مرتبة أقل. هذا هو الهدف من Boost Ranker: الحفاظ على البحث الدلالي كأساس، ثم وضع قواعد العمل في الأعلى.</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>يمنحك<a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> طريقة لإدخال منطق العمل في نتائج البحث المتجه دون المساس بالتضمينات أو إعادة بناء الفهارس. قم بتعزيز المحتوى الرسمي، وخفض رتبة النتائج التي لا معنى لها، وإضافة تنوع محكوم - كل ذلك من خلال تكوين بسيط للمرشح + الوزن في <a href="https://milvus.io/docs/manage-functions.md">واجهة برمجة تطبيقات Milvus Function</a>.</p>
<p>سواء كنت تنشئ خطوط أنابيب RAG أو أنظمة توصية أو بحث مؤسسي، يساعدك Boost Ranker على سد الفجوة بين ما هو متشابه دلاليًا وما هو مفيد بالفعل لمستخدميك.</p>
<p>إذا كنت تعمل على تصنيف البحث وتريد مناقشة حالة الاستخدام الخاصة بك:</p>
<ul>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> للتواصل مع مطورين آخرين يعملون على بناء أنظمة البحث والاسترجاع.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية مدتها 20 دقيقة في ساعات عمل Milvus المكتبية</a> للتعرف على منطق الترتيب الخاص بك مع الفريق.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المدارة من Milvus) لديها مستوى مجاني للبدء.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تظهر عندما تبدأ الفرق في استخدام Boost Ranker:</p>
<p><strong>هل يمكن لـ Boost Ranker أن يحل محل أداة إعادة التصنيف القائمة على النموذج مثل Cohere أو BGE؟</strong>تقوم أدوات إعادة التصنيف القائمة على النموذج بإعادة تصنيف النتائج حسب الجودة الدلالية - فهي جيدة في تحديد "أي مستند يجيب بالفعل على السؤال". بينما يقوم بووست رانكر Boost Ranker بضبط النتائج حسب قواعد العمل - فهو يقرر "أي مستند ذي صلة يجب أن يظهر أولاً". من الناحية العملية، غالبًا ما تحتاج إلى كليهما معًا: مصنف نموذجي للأهمية الدلالية، ثم مصنف معزز لمنطق الأعمال في الأعلى.</p>
<p><strong>هل يضيف برنامج Boost Ranker وقت استجابة كبير؟</strong>لا، فهو يعمل على مجموعة المرشحين التي تم استرجاعها بالفعل (عادةً ما تكون أعلى K من البحث المتجه)، وليس مجموعة البيانات الكاملة. العمليات عبارة عن عمليات تصفية ومضاعفة بسيطة، لذا فإن النفقات العامة لا تُذكر مقارنةً بالبحث المتجه نفسه.</p>
<p><strong>كيف أضبط قيمة الوزن؟</strong>ابدأ بتعديلات صغيرة. بالنسبة لتشابه COSINE (الأعلى هو الأفضل)، عادةً ما يكون الوزن 1.1-1.3 كافيًا لتحويل التصنيفات بشكل ملحوظ دون تجاوز الصلة الدلالية تمامًا. اختبر ذلك باستخدام بياناتك الفعلية - إذا بدأت النتائج المعززة ذات التشابه المنخفض في الهيمنة، فاخفض الوزن.</p>
<p><strong>هل يمكنني الجمع بين عدة قواعد لتعزيز التصنيف؟</strong>نعم. قم بإنشاء عدة كائنات <code translate="no">Function</code> ودمجها باستخدام <code translate="no">FunctionScore</code>. يمكنك التحكم في كيفية تفاعل القواعد من خلال <code translate="no">boost_mode</code> (كيف تتحد كل قاعدة مع النتيجة الأصلية) و <code translate="no">function_mode</code> (كيف تتحد القواعد مع بعضها البعض) - كلاهما يدعم <code translate="no">multiply</code> و <code translate="no">add</code>.</p>
