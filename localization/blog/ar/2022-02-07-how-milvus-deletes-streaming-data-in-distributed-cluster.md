---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: الاستخدام
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  التصميم الأساسي وراء وظيفة الحذف في Milvus 2.0، قاعدة بيانات المتجهات الأكثر
  تقدمًا في العالم.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>كيف يحذف Milvus البيانات المتدفقة في مجموعة موزعة</custom-h1><p>يتميّز Milvus 2.0 بمعالجة موحّدة للدفعات والتدفق وبنية سحابية أصلية، ويشكل Milvus 2.0 تحديًا أكبر من سابقه أثناء تطوير وظيفة الحذف. وبفضل تصميمه المتطور لتجزئة التخزين والحوسبة التخزينية وآلية النشر/الاشتراك المرنة، نحن فخورون بالإعلان عن تحقيق ذلك. في الإصدار Milvus 2.0، يمكنك حذف كيان في مجموعة معينة بمفتاحها الأساسي بحيث لا يتم إدراج الكيان المحذوف في نتيجة البحث أو الاستعلام.</p>
<p>يُرجى ملاحظة أن عملية الحذف في Milvus تشير إلى الحذف المنطقي، في حين أن تنظيف البيانات المادية يحدث أثناء ضغط البيانات. لا يؤدي الحذف المنطقي إلى تعزيز أداء البحث المقيد بسرعة الإدخال/الإخراج بشكل كبير فحسب، بل يسهل أيضًا استعادة البيانات. لا يزال من الممكن استرجاع البيانات المحذوفة منطقيًا بمساعدة وظيفة السفر عبر الزمن.</p>
<h2 id="Usage" class="common-anchor-header">الاستخدام<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نجرب دالة الحذف في Milvus 2.0 أولاً. (المثال التالي يستخدم PyMilvus 2.0.0 على Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Implementation" class="common-anchor-header">التنفيذ<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>في مثيل Milvus، تكون عقدة البيانات مسؤولة بشكل أساسي عن تعبئة البيانات المتدفقة (السجلات في وسيط السجل) كبيانات تاريخية (لقطات السجل) ومسحها تلقائيًا إلى تخزين الكائنات. تقوم عقدة الاستعلام بتنفيذ طلبات البحث على البيانات الكاملة، أي البيانات المتدفقة والبيانات التاريخية.</p>
<p>ولتحقيق أقصى استفادة من سعة كتابة البيانات للعقد المتوازية في الكتلة العنقودية، تتبنى Milvus استراتيجية التجزئة على أساس تجزئة المفتاح الأساسي لتوزيع عمليات الكتابة بالتساوي على عقد عاملة مختلفة. وهذا يعني أن الوكيل سيقوم بتوجيه رسائل لغة التلاعب بالبيانات (DML) (أي الطلبات) الخاصة بكيان ما إلى نفس عقدة البيانات وعقدة الاستعلام. يتم نشر هذه الرسائل من خلال قناة DML-Channel وتستهلكها عقدة البيانات وعقدة الاستعلام بشكل منفصل لتوفير خدمات البحث والاستعلام معًا.</p>
<h3 id="Data-node" class="common-anchor-header">عقدة البيانات</h3><p>بعد تلقي رسائل INSERT للبيانات، تقوم عقدة البيانات بإدراج البيانات في مقطع متزايد، وهو مقطع جديد تم إنشاؤه لاستقبال البيانات المتدفقة في الذاكرة. إذا وصل عدد صفوف البيانات أو مدة المقطع المتنامي إلى الحد الأدنى، تقوم عقدة البيانات بإغلاقه لمنع أي بيانات واردة. تقوم عقدة البيانات بعد ذلك بمسح المقطع المختوم، الذي يحتوي على البيانات التاريخية، إلى مخزن الكائن. وفي الوقت نفسه، تُنشئ عقدة البيانات مرشح ازدهار استنادًا إلى المفاتيح الأساسية للبيانات الجديدة، وتقوم بمسحها إلى مخزن الكائنات مع المقطع المختوم، وحفظ مرشح الازدهار كجزء من السجل الثنائي للإحصائيات (binlog)، والذي يحتوي على المعلومات الإحصائية للمقطع.</p>
<blockquote>
<p>مرشح التفتح هو بنية بيانات احتمالية تتكون من متجه ثنائي طويل وسلسلة من دوال التعيين العشوائي. يمكن استخدامه لاختبار ما إذا كان عنصر ما عضوًا في مجموعة ما، ولكنه قد يُرجع مطابقات إيجابية كاذبة.           -- ويكيبيديا</p>
</blockquote>
<p>عند ورود رسائل حذف البيانات، تقوم عقدة البيانات بتخزين جميع مرشحات التفتح في الجزء المطابق، وتطابقها مع المفاتيح الأساسية المقدمة في الرسائل لاسترداد جميع المقاطع (من كل من المقاطع النامية والمغلقة) التي من المحتمل أن تتضمن الكيانات المراد حذفها. بعد تحديد المقاطع المطابقة، تقوم عقدة البيانات بتخزينها في الذاكرة لإنشاء سجلات دلتا الثنائية لتسجيل عمليات الحذف، ثم تقوم بمسح تلك السجلات الثنائية مع المقاطع إلى مخزن الكائنات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>عقدة البيانات</span> </span></p>
<p>نظرًا لأنه يتم تعيين جزء واحد فقط بقناة DML واحدة، فلن تتمكن عقد الاستعلام الإضافية المضافة إلى الكتلة من الاشتراك في قناة DML-Channel. للتأكد من أن جميع عقد الاستعلام يمكنها تلقي رسائل الحذف، تقوم عقد البيانات بتصفية رسائل الحذف من قناة DML، وإعادة توجيهها إلى قناة دلتا لإعلام جميع عقد الاستعلام بعمليات الحذف.</p>
<h3 id="Query-node" class="common-anchor-header">عقدة الاستعلام</h3><p>عند تحميل مجموعة من تخزين الكائن، تحصل عقدة الاستعلام أولاً على نقطة تدقيق كل جزء، والتي تحدد عمليات DML منذ آخر عملية مسح. استنادًا إلى نقطة التدقيق، تقوم عقدة الاستعلام بتحميل جميع المقاطع المختومة مع مرشحات دلتا بنلوغ وفلاتر بلوم الخاصة بها. مع تحميل جميع البيانات، تشترك عقدة الاستعلام بعد ذلك في قناة DML وقناة دلتا وقناة دلتا وقناة الاستعلام.</p>
<p>في حالة ورود المزيد من رسائل INSERT للبيانات بعد تحميل المجموعة إلى الذاكرة، تقوم عقدة الاستعلام أولاً بتحديد المقاطع المتزايدة وفقًا للرسائل، وتقوم بتحديث مرشحات التفتح المتضخمة المقابلة في الذاكرة لأغراض الاستعلام فقط. لن يتم مسح مرشحات التفتح المخصصة للاستعلام إلى تخزين الكائنات بعد انتهاء الاستعلام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>عقدة الاستعلام</span> </span></p>
<p>كما ذكر أعلاه، يمكن لعدد معين فقط من عقد الاستعلام تلقي رسائل DELETE من قناة DML، مما يعني أنها وحدها التي يمكنها تنفيذ طلبات الحذف في قطاعات متزايدة. بالنسبة لعقد الاستعلام التي اشتركت في قناة DML، فإنها تقوم أولاً بتصفية رسائل الحذف في المقاطع المتزايدة، وتحديد موقع الكيانات من خلال مطابقة المفاتيح الأساسية المقدمة مع تلك المرشحات المزدوجة المخصصة للاستعلام في المقاطع المتزايدة، ثم تسجيل عمليات الحذف في المقاطع المقابلة.</p>
<p>يُسمح فقط لعقد الاستعلام التي لا يمكنها الاشتراك في قناة DML-Channel بمعالجة طلبات البحث أو الاستعلام على المقاطع المغلقة لأنها لا يمكنها الاشتراك إلا في قناة دلتا، واستقبال رسائل الحذف المعاد توجيهها بواسطة عقد البيانات. بعد تجميع جميع رسائل الحذف في المقاطع المختومة من قناة دلتا، تقوم عقد الاستعلام بتحديد موقع الكيانات من خلال مطابقة المفاتيح الأساسية المقدمة مع مرشحات التفتح للقطاعات المختومة، ثم تسجيل عمليات الحذف في القطاعات المقابلة.</p>
<p>في نهاية المطاف، في البحث أو الاستعلام، تقوم عقد الاستعلام بإنشاء مجموعة بتات بناءً على سجلات الحذف لحذف الكيانات المحذوفة، والبحث بين الكيانات المتبقية من جميع المقاطع، بغض النظر عن حالة المقطع. أخيرًا وليس آخرًا، يؤثر مستوى الاتساق على رؤية البيانات المحذوفة. في ظل مستوى الاتساق القوي (كما هو موضح في نموذج الكود السابق)، تكون الكيانات المحذوفة غير مرئية على الفور بعد الحذف. بينما يتم اعتماد مستوى الاتساق المحدود، سيكون هناك عدة ثوانٍ من وقت الاستجابة قبل أن تصبح الكيانات المحذوفة غير مرئية.</p>
<h2 id="Whats-next" class="common-anchor-header">ما التالي؟<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>نهدف في مدونة سلسلة الميزات الجديدة 2.0 إلى شرح تصميم الميزات الجديدة. اقرأ المزيد في سلسلة المدونة هذه!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">كيف يقوم Milvus بحذف البيانات المتدفقة في مجموعة موزعة</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">كيفية ضغط البيانات في ميلفوس؟</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">كيف يوازن ميلفوس حمل الاستعلام عبر العقد؟</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">كيف تمكّن Bitset تعدد الاستخدامات في البحث عن التشابه المتجه</a></li>
</ul>
