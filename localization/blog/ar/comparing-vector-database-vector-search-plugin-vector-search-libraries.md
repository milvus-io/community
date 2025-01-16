---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  مقارنة قواعد بيانات المتجهات ومكتبات البحث عن المتجهات ومكونات البحث عن
  المتجهات الإضافية
author: Frank Liu
date: 2023-11-9
desc: >-
  في هذا المقال، سنواصل استكشاف عالم البحث المتجه المعقد، ومقارنة قواعد بيانات
  المتجهات، والمكونات الإضافية للبحث المتجه، ومكتبات البحث المتجه.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>مرحبًا بكم مرة أخرى في قاعدة بيانات المتجهات 101!</p>
<p>لقد أدت الطفرة في <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> ونماذج اللغات الكبيرة الأخرى (LLMs) إلى نمو تقنيات البحث المتجه، والتي تضم قواعد بيانات متجهات متخصصة مثل <a href="https://zilliz.com/what-is-milvus">Milvus</a> و <a href="https://zilliz.com/cloud">Zilliz Cloud</a> إلى جانب مكتبات مثل <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> ومكونات البحث المتجه المدمجة في قواعد البيانات التقليدية.</p>
<p>في <a href="https://zilliz.com/learn/what-is-vector-database">سلسلة منشوراتنا السابقة، تناولنا في منشورنا السابق</a> أساسيات قواعد بيانات المتجهات. في هذا المنشور، سنواصل استكشاف عالم البحث المتجه المعقد، ومقارنة قواعد بيانات المتجهات، ومكونات البحث المتجهية، ومكتبات البحث المتجهية.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">ما هو البحث المتجه؟<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">البحث عن</a> المتجهات، والمعروف أيضًا باسم البحث عن تشابه المتجهات، هو تقنية لاسترجاع أفضل-ك من النتائج الأكثر تشابهًا أو ارتباطًا دلاليًا بمتجه استعلام معين من بين مجموعة واسعة من بيانات المتجهات الكثيفة. قبل إجراء عمليات البحث عن التشابه، نستفيد من الشبكات العصبية لتحويل <a href="https://zilliz.com/learn/introduction-to-unstructured-data">البيانات غير المهيكلة،</a> مثل النصوص والصور ومقاطع الفيديو والصوت، إلى متجهات رقمية عالية الأبعاد تسمى متجهات التضمين. بعد توليد متجهات التضمين، تقارن محركات البحث عن المتجهات المسافة المكانية بين متجه الاستعلام المدخلات والمتجهات في مخازن المتجهات. وكلما كانت متقاربة في الفضاء، كلما كانت أكثر تشابهًا.</p>
<p>تتوفر العديد من تقنيات البحث المتجهية في السوق، بما في ذلك مكتبات التعلم الآلي مثل NumPy من Python، ومكتبات البحث المتجهية مثل FAISS، ومكونات البحث المتجهية المبنية على قواعد البيانات التقليدية، وقواعد البيانات المتجهة المتخصصة مثل Milvus وZilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">قواعد بيانات المتجهات مقابل مكتبات البحث عن المتجهات<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">قواعد البيانات المتجهة المتخصصة</a> ليست المكدس الوحيد لعمليات البحث عن التشابه. فقبل ظهور قواعد بيانات المتجهات، استُخدمت العديد من مكتبات البحث عن المتجهات، مثل FAISS و ScaNN و HNSW، لاسترجاع المتجهات.</p>
<p>يمكن أن تساعدك مكتبات البحث المتجهية في بناء نظام بحث متجهي نموذجي عالي الأداء بسرعة. إذا أخذنا FAISS كمثال، فهو مفتوح المصدر وتم تطويره بواسطة Meta للبحث الفعال عن التشابه وتجميع المتجهات الكثيفة بكفاءة. يمكن ل FAISS التعامل مع مجموعات المتجهات من أي حجم، حتى تلك التي لا يمكن تحميلها بالكامل في الذاكرة. بالإضافة إلى ذلك، يوفر FAISS أدوات للتقييم وضبط المعلمات. وعلى الرغم من أن FAISS مكتوب بلغة C++، إلا أنه يوفر واجهة Python/NumPy.</p>
<p>ومع ذلك، فإن مكتبات البحث المتجهية هي مجرد مكتبات ANN خفيفة الوزن وليست حلولاً مُدارة، ولها وظائف محدودة. إذا كانت مجموعة البيانات الخاصة بك صغيرة ومحدودة، يمكن أن تكون هذه المكتبات كافية لمعالجة البيانات غير المهيكلة، حتى بالنسبة للأنظمة التي تعمل في الإنتاج. ومع ذلك، مع زيادة أحجام مجموعات البيانات وزيادة عدد المستخدمين، تزداد صعوبة حل مشكلة الحجم. علاوة على ذلك، فهي لا تسمح بإجراء أي تعديلات على بيانات الفهرس الخاصة بها ولا يمكن الاستعلام عنها أثناء استيراد البيانات.</p>
<p>وعلى النقيض من ذلك، فإن قواعد البيانات المتجهة هي الحل الأمثل لتخزين البيانات غير المنظمة واسترجاعها. ويمكنها تخزين ملايين أو حتى مليارات المتجهات والاستعلام عنها مع توفير استجابات في الوقت الفعلي في الوقت نفسه؛ فهي قابلة للتطوير بدرجة كبيرة لتلبية احتياجات العمل المتزايدة للمستخدمين.</p>
<p>بالإضافة إلى ذلك، تتمتع قواعد البيانات المتجهة مثل Milvus بميزات أكثر سهولة في الاستخدام للبيانات المهيكلة/شبه المهيكلة: السحابة-السحابية، وتعدد الإيجارات، وقابلية التوسع، وما إلى ذلك. ستتضح هذه الميزات عندما نتعمق في هذا البرنامج التعليمي.</p>
<p>تعمل أيضًا في طبقة مختلفة تمامًا من التجريد عن مكتبات البحث المتجه - قواعد البيانات المتجهة هي خدمات متكاملة، بينما مكتبات الشبكة النانوية الوطنية تهدف إلى دمجها في التطبيق الذي تقوم بتطويره. وبهذا المعنى، فإن مكتبات الشبكات العصبية الاصطناعية هي أحد المكونات العديدة التي تُبنى قواعد البيانات المتجهة فوقها، على غرار كيفية بناء Elasticsearch فوق Apache Lucene.</p>
<p>لإعطاء مثال على سبب أهمية هذا التجريد، دعنا نلقي نظرة على إدراج عنصر بيانات جديد غير منظم في قاعدة بيانات متجهية. هذا سهل للغاية في ميلفوس:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>إنه حقًا بهذه السهولة - 3 أسطر من التعليمات البرمجية. مع مكتبة مثل FAISS أو ScaNN، للأسف، لا توجد طريقة سهلة للقيام بذلك دون إعادة إنشاء الفهرس بالكامل يدويًا عند نقاط تفتيش معينة. حتى لو استطعت، لا تزال مكتبات البحث المتجهية تفتقر إلى قابلية التوسع وتعدد الإيجار، وهما من أهم ميزات قواعد البيانات المتجهة.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">قواعد البيانات المتجهة مقابل مكونات البحث المتجهة لقواعد البيانات التقليدية<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>عظيم، الآن بعد أن حددنا الفرق بين مكتبات البحث المتجه وقواعد البيانات المتجهة، دعونا نلقي نظرة على كيفية اختلاف قواعد البيانات المتجهة عن <strong>المكونات الإضافية</strong> للبحث المتجه.</p>
<p>هناك عدد متزايد من قواعد البيانات العلائقية التقليدية وأنظمة البحث مثل Clickhouse و <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> التي تتضمن مكونات إضافية مدمجة للبحث المتجه. يتضمن Elasticsearch 8.0، على سبيل المثال، وظيفة إدراج المتجهات ووظيفة البحث عن المتجهات التي يمكن استدعاؤها عبر نقاط نهاية واجهة برمجة التطبيقات المريحة. يجب أن تكون مشكلة ملحقات البحث المتجه واضحة وضوح الشمس في رابعة النهار، <strong>فهذه الحلول لا تتخذ نهجًا متكاملًا لإدارة التضمين والبحث المتجه</strong>. وبدلاً من ذلك، تهدف هذه المكونات الإضافية إلى أن تكون تحسينات فوق البنى الحالية، مما يجعلها محدودة وغير محسّنة. سيكون تطوير تطبيق بيانات غير مهيكلة فوق قاعدة بيانات تقليدية أشبه بمحاولة تركيب بطاريات الليثيوم والمحركات الكهربائية داخل إطار سيارة تعمل بالبنزين - ليست فكرة رائعة!</p>
<p>لتوضيح سبب ذلك، دعونا نعود إلى قائمة الميزات التي يجب أن تنفذها قاعدة بيانات المتجهات (من القسم الأول). تفتقد المكونات الإضافية للبحث المتجه إلى اثنتين من هذه الميزات - قابلية الضبط وواجهات برمجة التطبيقات/مجموعات تطوير البرمجيات سهلة الاستخدام. سأستمر في استخدام محرك ANN الخاص بـ Elasticsearch كمثال؛ تعمل إضافات البحث المتجه الأخرى بشكل مشابه جدًا لذا لن أخوض في التفاصيل أكثر من ذلك. يدعم Elasticsearch تخزين المتجهات عبر نوع حقل البيانات <code translate="no">dense_vector</code> ويسمح بالاستعلام عبر <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>يدعم المكون الإضافي ANN في Elasticsearch خوارزمية فهرسة واحدة فقط: العوالم الصغيرة القابلة للتنقل الهرمي القابلة للتنقل والمعروفة أيضًا باسم HNSW (أحب أن أعتقد أن مبتكرها كان متقدمًا على مارفل عندما يتعلق الأمر بتعميم الأكوان المتعددة). علاوة على ذلك، فإن المسافة L2/Euclidean هي الوحيدة المدعومة كمقياس للمسافة. هذه بداية جيدة، لكن دعنا نقارنها بـ Milvus، قاعدة بيانات متجهة كاملة. باستخدام <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>بينما يمتلك كل من <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch و Milvus</a> طرقًا لإنشاء الفهارس وإدراج متجهات التضمين وإجراء البحث الأقرب للجار، يتضح من هذه الأمثلة أن Milvus لديه واجهة برمجة تطبيقات بحث متجهات أكثر سهولة (واجهة برمجة تطبيقات أفضل للمستخدم) ودعم أوسع لفهرس المتجهات + دعم مقياس المسافة (قابلية ضبط أفضل). تخطط Milvus أيضًا لدعم المزيد من مؤشرات المتجهات والسماح بالاستعلام عبر عبارات شبيهة بعبارات SQL في المستقبل، مما يزيد من تحسين قابلية الضبط وسهولة الاستخدام.</p>
<p>لقد استغرقنا الكثير من المحتوى. كان هذا القسم طويلًا إلى حد ما باعتراف الجميع، لذا بالنسبة لأولئك الذين قاموا بتصفحه، إليكم خلاصة سريعة: ميلفوس أفضل من ملحقات البحث المتجه لأن ميلفوس تم بناؤه من الألف إلى الياء كقاعدة بيانات متجهة، مما يسمح بمجموعة أكثر ثراءً من الميزات وبنية أكثر ملاءمة للبيانات غير المنظمة.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">كيف تختار من بين تقنيات البحث المتجه المختلفة؟<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يتم إنشاء جميع قواعد بيانات المتجهات على قدم المساواة، فكل منها يمتلك سمات فريدة تلبي احتياجات تطبيقات محددة. تعد مكتبات البحث عن المتجهات والمكونات الإضافية سهلة الاستخدام ومثالية للتعامل مع بيئات الإنتاج صغيرة الحجم التي تحتوي على ملايين المتجهات. إذا كان حجم بياناتك صغيرًا وكنت تحتاج فقط إلى وظيفة البحث عن المتجهات الأساسية، فإن هذه التقنيات كافية لعملك.</p>
<p>ومع ذلك، يجب أن تكون قاعدة بيانات المتجهات المتخصصة هي خيارك الأفضل للشركات كثيفة البيانات التي تتعامل مع مئات الملايين من المتجهات وتتطلب استجابات في الوقت الفعلي. على سبيل المثال، تدير شركة Milvus مليارات المتجهات دون عناء، وتوفر سرعات استعلام فائقة ووظائف غنية. علاوة على ذلك، تُثبت الحلول المُدارة بالكامل مثل Zilliz أنها أكثر فائدة، حيث تحررك من التحديات التشغيلية وتتيح لك التركيز الحصري على أنشطة عملك الأساسية.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">ألقِ نظرة أخرى على دورات قاعدة بيانات Vector 101 التدريبية<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">مقدمة في البيانات غير المهيكلة</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">ما هي قاعدة البيانات المتجهة؟</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">المقارنة بين قواعد بيانات المتجهات ومكتبات البحث في المتجهات ومكونات البحث في المتجهات</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">مقدمة إلى ميلفوس</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">البداية السريعة لملفوس</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">مقدمة في البحث عن تشابه المتجهات</a></li>
<li><a href="https://zilliz.com/blog/vector-index">أساسيات فهرس المتجهات وفهرس الملفات المقلوب</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">التكمية العددية والتكمية الكمية للمنتج</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">العوالم الصغيرة القابلة للملاحة الهرمية (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">أقرب الجيران التقريبي أوه نعم (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">اختيار الفهرس المتجه المناسب لمشروعك</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">ديسكان وخوارزمية فامانا</a></li>
</ol>
