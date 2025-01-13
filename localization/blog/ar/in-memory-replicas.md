---
id: in-memory-replicas.md
title: >-
  زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة داخل
  الذاكرة
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  استخدم النسخ المتماثلة في الذاكرة لتحسين إنتاجية القراءة واستخدام موارد
  الأجهزة.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>صورة_الغلاف</span> </span></p>
<blockquote>
<p>شارك في تأليف هذه المقالة <a href="https://github.com/congqixia">كونغكي شيا</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">وأنجيلا ني</a>.</p>
</blockquote>
<p>مع إصداره الرسمي، يأتي Milvus 2.1 مع العديد من الميزات الجديدة لتوفير الراحة وتجربة مستخدم أفضل. على الرغم من أن مفهوم النسخ المتماثل داخل الذاكرة ليس شيئًا جديدًا في عالم قواعد البيانات الموزعة، إلا أنه ميزة مهمة يمكن أن تساعدك على تعزيز أداء النظام وتحسين توافر النظام بطريقة سهلة. لذلك، يشرح هذا المنشور ما هي النسخة المتماثلة في الذاكرة وسبب أهميتها، ثم يقدم كيفية تمكين هذه الميزة الجديدة في قاعدة بيانات Milvus، وهي قاعدة بيانات متجهة للذكاء الاصطناعي.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">المفاهيم المتعلقة بالنسخة المتماثلة في الذاكرة</a></p></li>
<li><p><a href="#What-is-in-memory-replica">ما هي النسخة المتماثلة في الذاكرة؟</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">ما أهمية النسخ المتماثلة في الذاكرة؟</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">تمكين النسخ المتماثلة داخل الذاكرة في قاعدة بيانات Milvus المتجهة</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">المفاهيم المتعلقة بالنسخ المتماثلة داخل الذاكرة<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل التعرف على ماهية النسخ المتماثلة في الذاكرة وسبب أهميتها، نحتاج أولاً إلى فهم بعض المفاهيم ذات الصلة بما في ذلك مجموعة النسخ المتماثلة، والنسخة المتماثلة داخل الذاكرة، والنسخة المتماثلة المتدفقة، والنسخة المتماثلة التاريخية، وقائد النسخة المتماثلة. الصورة أدناه هي توضيح لهذه المفاهيم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>مفاهيم النسخ المتماثلة</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">مجموعة النسخ المتماثلة</h3><p>تتكون مجموعة النسخ المتماثلة من <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">عقد استعلام</a> متعددة مسؤولة عن التعامل مع البيانات التاريخية والنسخ المتماثلة.</p>
<h3 id="Shard-replica" class="common-anchor-header">النسخة المتماثلة للجزء المتماثل</h3><p>تتألف النسخة المتماثلة للجزء من نسخة متماثلة متدفقة ونسخة متماثلة تاريخية، وكلاهما ينتميان إلى نفس <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">الجزء</a> (أي قناة DML). تشكل النسخ المتماثلة متعددة الأجزاء مجموعة النسخ المتماثلة. ويتم تحديد العدد الدقيق للنسخ المتماثلة للجزء في مجموعة النسخ المتماثلة من خلال عدد الأجزاء في مجموعة محددة.</p>
<h3 id="Streaming-replica" class="common-anchor-header">النسخة المتماثلة المتدفقة</h3><p>تحتوي النسخة المتماثلة المتدفقة على جميع الأجزاء <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">المتزايدة</a> من نفس قناة DML. من الناحية الفنية، يجب تقديم نسخة متماثلة متدفقة بواسطة عقدة استعلام واحدة فقط في نسخة متماثلة واحدة.</p>
<h3 id="Historical-replica" class="common-anchor-header">النسخة المتماثلة التاريخية</h3><p>تحتوي النسخة المتماثلة التاريخية على جميع المقاطع المختومة من نفس قناة DML. يمكن توزيع المقاطع المختومة لنسخة متماثلة تاريخية واحدة على عدة عقد استعلام داخل نفس مجموعة النسخ المتماثلة.</p>
<h3 id="Shard-leader" class="common-anchor-header">قائد الجزء</h3><p>قائد الجزء هو عقدة الاستعلام التي تخدم النسخة المتماثلة المتدفقة في نسخة متماثلة للجزء.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">ما هي النسخة المتماثلة داخل الذاكرة؟<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>يتيح لك تمكين النسخ المتماثلة في الذاكرة تحميل البيانات في مجموعة على عقد استعلام متعددة بحيث يمكنك الاستفادة من موارد وحدة المعالجة المركزية والذاكرة الإضافية. تكون هذه الميزة مفيدة جدًا إذا كانت لديك مجموعة بيانات صغيرة نسبيًا ولكنك تريد زيادة إنتاجية القراءة وتحسين الاستفادة من موارد الأجهزة.</p>
<p>تحتوي قاعدة بيانات Milvus vector على نسخة متماثلة واحدة لكل مقطع في الذاكرة في الوقت الحالي. ومع ذلك، مع النسخ المتماثلة في الذاكرة، يمكنك الحصول على نسخ متماثلة متعددة لمقطع ما على عقد استعلام مختلفة. هذا يعني أنه إذا كانت هناك عقدة استعلام واحدة تجري بحثًا على مقطع ما، فيمكن تعيين طلب بحث جديد وارد إلى عقدة استعلام أخرى خاملة لأن عقدة الاستعلام هذه لديها نسخة متماثلة لنفس المقطع بالضبط.</p>
<p>بالإضافة إلى ذلك، إذا كان لدينا نسخ متماثلة متعددة في الذاكرة، يمكننا التعامل بشكل أفضل مع الموقف الذي تتعطل فيه عقدة الاستعلام. في السابق، كان علينا انتظار إعادة تحميل المقطع من أجل المتابعة والبحث في عقدة استعلام أخرى. ومع ذلك، مع النسخ المتماثل داخل الذاكرة، يمكن إعادة إرسال طلب البحث إلى عقدة استعلام جديدة على الفور دون الحاجة إلى إعادة تحميل البيانات مرة أخرى.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>النسخ المتماثل</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">لماذا تعتبر النسخ المتماثلة في الذاكرة مهمة؟<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>تتمثل إحدى أهم مزايا تمكين النسخ المتماثلة في الذاكرة في زيادة إجمالي QPS (الاستعلام في الثانية) والإنتاجية. علاوة على ذلك، يمكن الاحتفاظ بنسخ متماثلة متعددة المقاطع ويكون النظام أكثر مرونة في مواجهة حالات الفشل.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">تمكين النسخ المتماثلة داخل الذاكرة في قاعدة بيانات ميلفوس المتجهة<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>إن تمكين الميزة الجديدة للنسخ المتماثلة في الذاكرة أمر سهل في قاعدة بيانات Milvus vector. كل ما عليك فعله هو ببساطة تحديد عدد النسخ المتماثلة التي تريدها عند تحميل مجموعة (أي استدعاء <code translate="no">collection.load()</code>).</p>
<p>في المثال التعليمي التالي، نفترض أنك <a href="https://milvus.io/docs/v2.1.x/create_collection.md">أنشأت</a> بالفعل <a href="https://milvus.io/docs/v2.1.x/create_collection.md">مجموعة</a> باسم "كتاب" <a href="https://milvus.io/docs/v2.1.x/insert_data.md">وأدرجت البيانات</a> فيها. ثم يمكنك تشغيل الأمر التالي لإنشاء نسختين متماثلتين عند <a href="https://milvus.io/docs/v2.1.x/load_collection.md">تحميل</a> مجموعة كتب.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك تعديل عدد النسخ المتماثلة بمرونة في المثال التوضيحي أعلاه بما يتناسب مع سيناريو تطبيقك. ثم يمكنك إجراء <a href="https://milvus.io/docs/v2.1.x/search.md">بحث</a> أو <a href="https://milvus.io/docs/v2.1.x/query.md">استعلام</a> تشابه متجه مباشرةً على نسخ متماثلة متعددة دون تشغيل أي أوامر إضافية. ومع ذلك، تجدر الإشارة إلى أن الحد الأقصى لعدد النسخ المتماثلة المسموح به محدود بإجمالي حجم الذاكرة القابلة للاستخدام لتشغيل عقد الاستعلام. إذا تجاوز عدد النسخ المتماثلة التي تحددها حدود الذاكرة القابلة للاستخدام، فسيتم إرجاع خطأ أثناء تحميل البيانات.</p>
<p>يمكنك أيضًا التحقق من معلومات النسخ المتماثلة في الذاكرة التي قمت بإنشائها عن طريق تشغيل <code translate="no">collection.get_replicas()</code>. سيتم إرجاع المعلومات الخاصة بمجموعات النسخ المتماثلة وعقد الاستعلام والقطع المقابلة. فيما يلي مثال على الإخراج.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>مع الإصدار الرسمي ل Milvus 2.1، قمنا بإعداد سلسلة من المدونات التي تقدم الميزات الجديدة. اقرأ المزيد في سلسلة المدونات هذه:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلسلة لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
