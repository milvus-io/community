---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: ميلفوس 2.0 - لمحة عن الميزات الجديدة
author: Yanliang Qiao
date: 2022-01-27T00:00:00.000Z
desc: اطّلع على أحدث ميزات Milvus 2.0.
cover: assets.zilliz.com/New_features_in_Milvus_2_0_93a87a7a8a.png
tag: Engineering
---
<custom-h1>ميلفوس 2.0: لمحة عن الميزات الجديدة</custom-h1><p>لقد مر نصف عام منذ الإصدار الأول المرشح للإصدار الأول من Milvus 2.0. الآن نحن فخورون بالإعلان عن التوفر العام للإصدار العام لـ Milvus 2.0. يرجى متابعتي خطوة بخطوة لإلقاء نظرة على بعض الميزات الجديدة التي يدعمها ميلفوس.</p>
<h2 id="Entity-deletion" class="common-anchor-header">حذف الكيانات<button data-href="#Entity-deletion" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus 2.0 حذف الكيانات، مما يسمح للمستخدمين بحذف المتجهات استنادًا إلى المفاتيح الأساسية (المعرفات) للمتجهات. لن يكونوا قلقين بشأن البيانات المنتهية الصلاحية أو غير الصالحة بعد الآن. لنجرب ذلك.</p>
<ol>
<li>اتصل بـ Milvus، وأنشئ مجموعة جديدة، وأدخل 300 صف من المتجهات ذات الـ 128 بُعدًا التي تم إنشاؤها عشوائيًا.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># connect to milvus</span>
host = <span class="hljs-string">&#x27;x.x.x.x&#x27;</span>
connections.add_connection(default={<span class="hljs-string">&quot;host&quot;</span>: host, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-number">19530</span>})
connections.connect(alias=<span class="hljs-string">&#x27;default&#x27;</span>)
<span class="hljs-comment"># create a collection with customized primary field: id_field</span>
dim = <span class="hljs-number">128</span>
id_field = FieldSchema(name=<span class="hljs-string">&quot;cus_id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
age_field = FieldSchema(name=<span class="hljs-string">&quot;age&quot;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&quot;age&quot;</span>)
embedding_field = FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
schema = CollectionSchema(fields=[id_field, age_field, embedding_field],
                          auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;hello MilMil&quot;</span>)
collection_name = <span class="hljs-string">&quot;hello_milmil&quot;</span>
collection = Collection(name=collection_name, schema=schema)
<span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">300</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
ins_res = collection.insert(entities)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">insert entities primary keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299]
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>قبل الشروع في الحذف، تحقق من وجود الكيانات التي تريد حذفها عن طريق البحث أو الاستعلام، وقم بذلك مرتين للتأكد من أن النتيجة موثوقة.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># search</span>
nq = <span class="hljs-number">10</span>
search_vec = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nq)]
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
limit = <span class="hljs-number">3</span>
<span class="hljs-comment"># search 2 times to verify the vector persists</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>):
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
    expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
    <span class="hljs-comment"># query to verify the ids exist</span>
    query_res = collection.query(expr)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;query results: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>احذف الكيان الذي يحمل الرقم cus_id 76، ثم ابحث واستعلام عن هذا الكيان.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;trying to delete one vector: id=<span class="hljs-subst">{ids[<span class="hljs-number">0</span>]}</span>&quot;</span>)
collection.delete(expr=<span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[ids[<span class="hljs-number">0</span>]]}</span>&quot;</span>)
results = collection.search(search_vec, embedding_field.name, search_params, limit)
ids = results[<span class="hljs-number">0</span>].ids
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">trying to <span class="hljs-keyword">delete</span> one <span class="hljs-attr">vector</span>: id=<span class="hljs-number">76</span>
after <span class="hljs-attr">deleted</span>: search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<p>لماذا لا يزال الكيان المحذوف قابلاً للاسترجاع؟ إذا كنت قد راجعت الكود المصدري لـ Milvus، فستجد أن الحذف داخل Milvus غير متزامن ومنطقي، مما يعني أن الكيانات لن يتم حذفها فعليًا. وبدلاً من ذلك، سيتم إرفاقها بعلامة "محذوفة" بحيث لا تسترجعها أي طلبات بحث أو استعلام. بالإضافة إلى ذلك، يبحث ميلفوس تحت مستوى اتساق الثبات المحدود بشكل افتراضي. لذلك، تظل الكيانات المحذوفة قابلة للاسترجاع قبل مزامنة البيانات في عقدة البيانات وعقدة الاستعلام. حاول البحث أو الاستعلام عن الكيان المحذوف بعد بضع ثوانٍ، وستجد أنه لم يعد موجودًا في النتيجة.</p>
<pre><code translate="no" class="language-python">expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<h2 id="Consistency-level" class="common-anchor-header">مستوى الاتساق<button data-href="#Consistency-level" class="anchor-icon" translate="no">
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
    </button></h2><p>توضح لنا التجربة أعلاه كيف يؤثر مستوى الاتساق على الرؤية الفورية للبيانات المحذوفة حديثًا. يمكن للمستخدمين ضبط مستوى الاتساق في Milvus بمرونة لتكييفه مع سيناريوهات الخدمة المختلفة. يدعم ميلفوس 2.0 أربعة مستويات من الاتساق:</p>
<ul>
<li><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> يتم تعيين على أنه مطابق لأحدث طابع زمني للنظام، وتنتظر عقد الاستعلام حتى ينتقل وقت الخدمة إلى أحدث طابع زمني للنظام، ثم تعالج طلب البحث أو الاستعلام.</li>
<li><code translate="no">CONSISTENCY_EVENTUALLY</code>:: <code translate="no">GuaranteeTs</code> يتم تعيين أصغر بشكل غير ملحوظ من الطابع الزمني الأحدث للنظام لتخطي التحقق من الاتساق. تبحث عقد الاستعلام على الفور في طريقة عرض البيانات الموجودة.</li>
<li><code translate="no">CONSISTENCY_BOUNDED</code>: <code translate="no">GuaranteeTs</code> يتم تعيين أصغر نسبياً من الطابع الزمني الأحدث للنظام، وتقوم عقد الاستعلام بالبحث على طريقة عرض بيانات مقبولة وأقل تحديثاً.</li>
<li><code translate="no">CONSISTENCY_SESSION</code>: يستخدم العميل الطابع الزمني لآخر عملية كتابة كـ <code translate="no">GuaranteeTs</code> ، بحيث يمكن لكل عميل على الأقل استرجاع البيانات التي أدخلها بنفسه.</li>
</ul>
<p>في إصدار RC السابق، يتبنى ميلفوس التناسق القوي باعتباره التناسق الافتراضي. ومع ذلك، مع الأخذ في الاعتبار حقيقة أن معظم المستخدمين أقل تطلبًا فيما يتعلق بالاتساق من الأداء، فإن ميلفوس يغير الاتساق الافتراضي إلى اتساق محدود الثبات، والذي يمكن أن يوازن متطلباتهم إلى حد كبير. في المستقبل، سنقوم في المستقبل بتحسين تكوين ضمانات الاتساق المحدود بشكل أكبر، وهو ما يمكن تحقيقه فقط أثناء إنشاء المجموعة في الإصدار الحالي. لمزيد من المعلومات حول <code translate="no">GuaranteeTs</code> ، راجع <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md">الطابع الزمني للضمان في طلبات البحث</a>.</p>
<p>هل سيؤدي انخفاض الاتساق إلى أداء أفضل؟ لا يمكنك أبدًا معرفة الإجابة حتى تجرب ذلك.</p>
<ol start="4">
<li>قم بتعديل الكود أعلاه لتسجيل زمن انتقال البحث.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>):
    start = time.time()
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    end = time.time()
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search latency: <span class="hljs-subst">{<span class="hljs-built_in">round</span>(end-start, <span class="hljs-number">4</span>)}</span>&quot;</span>)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>ابحث بنفس مقياس البيانات والمعلمات باستثناء أنه تم تعيين <code translate="no">consistency_level</code> على أنه <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_strong&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_STRONG</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.3293
search latency: 0.1949
search latency: 0.1998
search latency: 0.2016
search latency: 0.198
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>ابحث في مجموعة مع تعيين <code translate="no">consistency_level</code> على أنه <code translate="no">CONSISTENCY_BOUNDED</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_bounded&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_BOUNDED</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.0144
search latency: 0.0104
search latency: 0.0107
search latency: 0.0104
search latency: 0.0102
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>من الواضح أن متوسط زمن انتقال البحث في المجموعة <code translate="no">CONSISTENCY_BOUNDED</code> أقصر بـ 200 مللي ثانية من ذلك في المجموعة <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<p>هل الكيانات المحذوفة غير مرئية على الفور إذا تم تعيين مستوى الاتساق على أنه قوي؟ الإجابة هي نعم. لا يزال بإمكانك تجربة ذلك بنفسك.</p>
<h2 id="Handoff" class="common-anchor-header">التسليم<button data-href="#Handoff" class="anchor-icon" translate="no">
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
    </button></h2><p>عند العمل مع مجموعة البيانات المتدفقة، اعتاد العديد من المستخدمين على إنشاء فهرس وتحميل المجموعة قبل إدراج البيانات فيها. في الإصدارات السابقة من Milvus، كان يتعين على المستخدمين تحميل المجموعة يدويًا بعد بناء الفهرس لاستبدال البيانات الأولية بالفهرس، وهو أمر بطيء وشاق. تسمح ميزة التسليم اليدوي لـ Milvus 2.0 بتحميل الجزء المفهرس تلقائيًا لاستبدال البيانات المتدفقة التي تصل إلى عتبات معينة من الفهرسة، مما يحسن أداء البحث بشكل كبير.</p>
<ol start="8">
<li>بناء الفهرس وتحميل المجموعة قبل إدراج المزيد من الكيانات.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># index</span>
index_params = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">64</span>}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
<span class="hljs-comment"># load</span>
collection.load()
<button class="copy-code-btn"></button></code></pre>
<ol start="9">
<li>أدخل 50,000 صف من الكيانات 200 مرة (يتم استخدام نفس دفعات المتجهات من أجل الراحة، ولكن هذا لن يؤثر على النتيجة).</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">50000</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">200</span>):
    ins_res = collection.insert(entities)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="10">
<li>تحقق من معلومات مقطع التحميل في عقدة الاستعلام أثناء الإدراج وبعده.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># did this in another python console</span>
utility.get_query_segment_info(<span class="hljs-string">&quot;hello_milmil_handoff&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="11">
<li>ستجد أن جميع المقاطع المختومة المحملة في عقدة الاستعلام مفهرسة.</li>
</ol>
<pre><code translate="no">[<span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551298</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">394463520</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">747090</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
, <span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551297</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">397536480</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">752910</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
...
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-more" class="common-anchor-header">ما هو أكثر من ذلك<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى الوظائف المذكورة أعلاه، تم تقديم ميزات جديدة مثل ضغط البيانات وموازنة التحميل الديناميكي والمزيد في Milvus 2.0. يرجى الاستمتاع برحلتك الاستكشافية مع ميلفوس!</p>
<p>في المستقبل القريب، سوف نشارككم سلسلة من المدونات التي ستعرض تصميم الميزات الجديدة في Milvus 2.0.</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">الحذف</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">ضغط البيانات</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">توازن التحميل الديناميكي</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">مجموعة البتات</a></li>
</ul>
<p>تجدنا على</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus">جيثب</a></li>
<li><a href="https://milvus.io/">Milvus.io</a></li>
<li><a href="https://slack.milvus.io/">قناة سلاك</a></li>
</ul>
