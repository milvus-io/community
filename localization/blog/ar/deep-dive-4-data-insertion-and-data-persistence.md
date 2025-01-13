---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: إدراج البيانات وثبات البيانات في قاعدة بيانات المتجهات
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  تعرف على الآلية الكامنة وراء إدراج البيانات واستمرار البيانات في قاعدة بيانات
  Milvus vector.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/sunby">بينغيي سون</a> وأعدته <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>في المنشور السابق في سلسلة الغوص العميق، قدمنا في المقالة السابقة <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">كيفية معالجة البيانات في ميلفوس،</a> قاعدة البيانات المتجهة الأكثر تقدمًا في العالم. في هذه المقالة، سنستمر في هذه المقالة في فحص المكونات المتضمنة في إدراج البيانات، وتوضيح نموذج البيانات بالتفصيل، وشرح كيفية تحقيق ثبات البيانات في ميلفوس.</p>
<p>الانتقال إلى:</p>
<ul>
<li><a href="#Milvus-architecture-recap">ملخص بنية ملفوس</a></li>
<li><a href="#The-portal-of-data-insertion-requests">بوابة طلبات إدراج البيانات</a></li>
<li><a href="#Data-coord-and-data-node">تنسيق البيانات وعقدة البيانات</a></li>
<li><a href="#Root-coord-and-Time-Tick">جذر التنسيق وعقدة الوقت</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">تنظيم البيانات: التجميع، والتقسيم، والجزء (القناة)، والجزء</a></li>
<li><a href="#Data-allocation-when-and-how">تخصيص البيانات: متى وكيف</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">بنية ملف مدونة البيانات واستمرار البيانات</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">ملخص بنية ميلفوس<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس</span>. </span></p>
<p>ترسل SDK طلبات البيانات إلى الوكيل، البوابة، عبر موازن التحميل. ثم يتفاعل الوكيل مع خدمة المنسق لكتابة طلبات DDL (لغة تعريف البيانات) و DML (لغة معالجة البيانات) في مخزن الرسائل.</p>
<p>تستهلك العقد العاملة، بما في ذلك عقدة الاستعلام وعقدة البيانات وعقدة الفهرس، الطلبات من مخزن الرسائل. وبشكل أكثر تحديدًا، تكون عقدة الاستعلام مسؤولة عن الاستعلام عن البيانات؛ وتكون عقدة البيانات مسؤولة عن إدخال البيانات واستمرار البيانات؛ وتتعامل عقدة الفهرس بشكل أساسي مع بناء الفهرس وتسريع الاستعلام.</p>
<p>الطبقة السفلية هي تخزين الكائن، والتي تستفيد بشكل أساسي من MinIO و S3 و AzureBlob لتخزين السجلات ومدونات دلتا الثنائية وملفات الفهرس.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">بوابة طلبات إدراج البيانات<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>الوكيل في ميلفوس</span>. </span></p>
<p>يعمل الوكيل كبوابة لطلبات إدراج البيانات.</p>
<ol>
<li>في البداية، يقبل الوكيل طلبات إدراج البيانات من حزم SDKs، ويخصص تلك الطلبات في عدة دلاء باستخدام خوارزمية التجزئة.</li>
<li>ثم يطلب الوكيل تنسيق البيانات لتعيين المقاطع، وهي أصغر وحدة في Milvus لتخزين البيانات.</li>
<li>بعد ذلك، يقوم الوكيل بإدراج معلومات المقاطع المطلوبة في مخزن الرسائل حتى لا تضيع هذه المعلومات.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">تنسيق البيانات وعقدة البيانات<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>تتمثل الوظيفة الرئيسية لتنسيق البيانات في إدارة تخصيص القنوات والمقاطع بينما تتمثل الوظيفة الرئيسية لعقدة البيانات في استهلاك البيانات المدرجة واستمرارها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>تنسيق البيانات وعقدة البيانات في ميلفوس</span>. </span></p>
<h3 id="Function" class="common-anchor-header">الوظيفة</h3><p>يعمل منسق البيانات في الجوانب التالية:</p>
<ul>
<li><p><strong>تخصيص مساحة المقطع</strong>يقوم منسق البيانات بتخصيص مساحة في المقاطع المتزايدة للوكيل بحيث يمكن للوكيل استخدام المساحة الخالية في المقاطع لإدراج البيانات.</p></li>
<li><p><strong>تسجيل تخصيص المقطع ووقت انتهاء صلاحية المساحة المخصصة في المقطع</strong>المساحة داخل كل مقطع مخصص من قبل منسق البيانات ليست دائمة، وبالتالي، يحتاج منسق البيانات أيضًا إلى الاحتفاظ بسجل لوقت انتهاء صلاحية كل تخصيص مقطع.</p></li>
<li><p><strong>مسح بيانات المقطع تلقائيًا</strong>إذا كان المقطع ممتلئًا، يقوم منسق البيانات تلقائيًا بتشغيل مسح البيانات.</p></li>
<li><p><strong>تخصيص قنوات لعُقد البيانات</strong>يمكن أن تحتوي المجموعة على عدة <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">قنوات v</a>. يحدد تنسيق البيانات القنوات الافتراضية التي تستهلكها عقد البيانات.</p></li>
</ul>
<p>تعمل عقدة البيانات في الجوانب التالية:</p>
<ul>
<li><p><strong>استهلاك البيانات</strong>تستهلك عقدة البيانات البيانات تستهلك البيانات من القنوات التي خصصها منسق البيانات وتنشئ تسلسلاً للبيانات.</p></li>
<li><p><strong>مثابرة البيانات</strong>تخزين البيانات المدرجة في الذاكرة وتخزين البيانات المدرجة تلقائيًا على القرص عندما يصل حجم البيانات إلى حد معين.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">سير العمل</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>يمكن تعيين قناة vchannel واحدة فقط لعقدة بيانات واحدة</span>. </span></p>
<p>كما هو موضح في الصورة أعلاه، تحتوي المجموعة على أربع قنوات vchannels (V1 و V2 و V3 و V4) وهناك عقدتا بيانات. من المحتمل جدًا أن يقوم منسق البيانات بتعيين عقدة بيانات واحدة لاستهلاك البيانات من V1 و V2، وعقدة البيانات الأخرى من V3 و V4. لا يمكن تعيين قناة vchannel واحدة إلى عقد بيانات متعددة وهذا لمنع تكرار استهلاك البيانات، الأمر الذي سيؤدي إلى إدراج نفس الدفعة من البيانات في نفس المقطع بشكل متكرر.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">الإحداثي الجذري وعلامة الوقت<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>يدير الإحداثي الجذر TSO (الطابع الزمني أوراكل)، وينشر رسائل التجزئة الزمنية على مستوى العالم. يحتوي كل طلب إدراج بيانات على طابع زمني معيّن من قبل التنسيق الجذري. تيك الوقت هو حجر الزاوية في ميلفوس الذي يعمل مثل الساعة في ميلفوس ويشير إلى النقطة الزمنية التي يوجد فيها نظام ميلفوس.</p>
<p>عند كتابة البيانات في ميلفوس، يحمل كل طلب إدخال بيانات طابعًا زمنيًا. أثناء استهلاك البيانات، تستهلك كل عقدة بيانات زمنية بيانات تكون طوابعها الزمنية ضمن نطاق معين.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>مثال على إدخال البيانات واستهلاك البيانات بناءً على الطابع الزمني</span>. </span></p>
<p>الصورة أعلاه هي عملية إدراج البيانات. يتم تمثيل قيمة الطوابع الزمنية بالأرقام 1،2،6،5،7،8. تتم كتابة البيانات في النظام بواسطة وكيلين: p1 و p2. أثناء استهلاك البيانات، إذا كان الوقت الحالي لعلامة الوقت هو 5، يمكن لعُقد البيانات قراءة البيانات 1 و2 فقط. ثم أثناء القراءة الثانية، إذا أصبح الوقت الحالي للتذكرة الزمنية 9، يمكن قراءة البيانات 6،7،8 بواسطة عقدة البيانات.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">تنظيم البيانات: التجميع، والتقسيم، والجزء (القناة)، والقطعة<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>تنظيم البيانات في ميلفوس</span>. </span></p>
<p>اقرأ هذه <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">المقالة</a> أولاً لفهم نموذج البيانات في ميلفوس ومفاهيم التجميع والجزء والجزء والجزء والجزء والمقطع.</p>
<p>باختصار، أكبر وحدة بيانات في ملفوس هي المجموعة التي يمكن تشبيهها بجدول في قاعدة بيانات علائقية. يمكن أن تحتوي المجموعة على أجزاء متعددة (كل منها يتوافق مع قناة) وأقسام متعددة داخل كل جزء. كما هو موضح في الرسم التوضيحي أعلاه، القنوات (الأجزاء) هي الأشرطة الرأسية بينما الأقسام هي الأجزاء الأفقية. في كل تقاطع يوجد مفهوم المقطع، وهو أصغر وحدة لتخصيص البيانات. في Milvus، يتم بناء الفهارس في Milvus على مقاطع. أثناء الاستعلام، يقوم نظام Milvus أيضًا بموازنة أحمال الاستعلام في عقد الاستعلام المختلفة وتتم هذه العملية بناءً على وحدة المقاطع. تحتوي المقاطع على العديد من <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">المقاطع،</a> وعندما يتم استهلاك بيانات المقاطع، يتم إنشاء ملف مدونة المقاطع.</p>
<h3 id="Segment" class="common-anchor-header">المقطع</h3><p>هناك ثلاثة أنواع من المقاطع ذات الحالة المختلفة في ميلفوس: المقطع المتنامي، والمقطع المغلق، والمقطع المسحوب.</p>
<h4 id="Growing-segment" class="common-anchor-header">المقطع المتنامي</h4><p>القطعة المتنامية هي شريحة متنامية هي شريحة تم إنشاؤها حديثاً يمكن تخصيصها للوكيل لإدراج البيانات. يمكن استخدام المساحة الداخلية للقطعة المتنامية أو تخصيصها أو تحريرها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>ثلاث حالات في القطعة المتنامية</span> </span></p>
<ul>
<li>مستخدمة: تم استهلاك هذا الجزء من مساحة القطعة المتنامية بواسطة عقدة البيانات.</li>
<li>مخصص: تم طلب هذا الجزء من مساحة القطعة المتنامية من قبل الوكيل وتم تخصيصه من قبل منسق البيانات. ستنتهي صلاحية المساحة المخصصة بعد فترة زمنية معينة.</li>
<li>حرة: لم يتم استخدام هذا الجزء من مساحة الجزء المتنامي. قيمة المساحة الخالية تساوي المساحة الكلية للمقطع مطروحًا منها قيمة المساحة المستخدمة والمخصصة. لذا تزداد المساحة الخالية للمقطع مع انتهاء المساحة المخصصة.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">القطعة المغلقة</h4><p>المقطع المغلق هو مقطع مغلق لم يعد بالإمكان تخصيصه للوكيل لإدراج البيانات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>القطعة المغلقة في ميلفوس</span> </span></p>
<p>يتم إغلاق القطعة المتنامية في الظروف التالية:</p>
<ul>
<li>إذا وصلت المساحة المستخدمة في القطعة المتنامية إلى 75% من المساحة الإجمالية، يتم إغلاق القطعة.</li>
<li>يتم استدعاء Flush() يدويًا من قبل مستخدم Milvus لاستمرار جميع البيانات في المجموعة.</li>
<li>سيتم ختم المقاطع المتنامية التي لم يتم ختمها بعد فترة طويلة من الزمن، حيث أن الكثير من المقاطع المتنامية تتسبب في زيادة استهلاك عقد البيانات للذاكرة.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">المقطع المسحوب</h4><p>المقطع الذي تم مسحه هو مقطع تم كتابته بالفعل في القرص. يشير المسح إلى تخزين بيانات المقطع إلى مخزن الكائنات من أجل استمرار البيانات. يمكن مسح المقطع فقط عندما تنتهي المساحة المخصصة في مقطع مغلق. عندما يتم مسحها، تتحول القطعة المختومة إلى قطعة ممسوحة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>المقطع المسحوب في ميلفوس</span> </span></p>
<h3 id="Channel" class="common-anchor-header">قناة</h3><p>يتم تخصيص قناة :</p>
<ul>
<li>عندما تبدأ عقدة البيانات أو تغلق؛ أو</li>
<li>عندما يتم طلب مساحة المقطع المخصص من قبل الوكيل.</li>
</ul>
<p>ثم هناك عدة استراتيجيات لتخصيص القناة. يدعم ميلفوس 2 من الاستراتيجيات:</p>
<ol>
<li>تجزئة الاتساق</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>التجزئة المتسقة في ميلفوس</span> </span></p>
<p>الاستراتيجية الافتراضية في ميلفوس. تستفيد هذه الاستراتيجية من تقنية التجزئة لتعيين موضع لكل قناة على الحلقة، ثم تبحث في اتجاه الساعة للعثور على أقرب عقدة بيانات إلى قناة. وبالتالي، في الرسم التوضيحي أعلاه، يتم تخصيص القناة 1 لعقدة البيانات 2، بينما يتم تخصيص القناة 2 لعقدة البيانات 3.</p>
<p>ومع ذلك، تتمثل إحدى مشاكل هذه الاستراتيجية في أن الزيادة أو النقصان في عدد عقد البيانات (على سبيل المثال، يمكن أن تؤثر الزيادة أو النقصان في عدد عقد البيانات (على سبيل المثال، بدء عقدة بيانات جديدة أو توقف عقدة بيانات فجأة) على عملية تخصيص القناة. لحل هذه المشكلة، يقوم منسق البيانات بمراقبة حالة عقد البيانات عبر إلخd بحيث يمكن إخطار منسق البيانات على الفور إذا كان هناك أي تغيير في حالة عقد البيانات. ثم يحدد منسق البيانات كذلك عقدة البيانات التي سيتم تخصيص القنوات لها بشكل صحيح.</p>
<ol start="2">
<li>موازنة التحميل</li>
</ol>
<p>تتمثل الاستراتيجية الثانية في تخصيص قنوات من نفس المجموعة إلى عقد بيانات مختلفة، مما يضمن تخصيص القنوات بالتساوي. الغرض من هذه الاستراتيجية هو تحقيق توازن الأحمال.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">تخصيص البيانات: متى وكيف<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>عملية تخصيص البيانات في ميلفوس</span> </span></p>
<p>تبدأ عملية تخصيص البيانات من العميل. يرسل أولاً طلبات إدراج البيانات مع الطابع الزمني <code translate="no">t1</code> إلى الوكيل. ثم يرسل الوكيل طلبًا إلى منسق البيانات لتخصيص المقطع.</p>
<p>عند استلام طلب تخصيص المقطع، يتحقق منسق البيانات من حالة المقطع ويخصص المقطع. إذا كانت المساحة الحالية للمقاطع التي تم إنشاؤها كافية لصفوف البيانات المدرجة حديثًا، يقوم منسق البيانات بتخصيص تلك المقاطع التي تم إنشاؤها. ومع ذلك، إذا كانت المساحة المتوفرة في المقاطع الحالية غير كافية، يقوم منسق البيانات بتخصيص مقطع جديد. يمكن أن يعيد منسق البيانات مقطعًا واحدًا أو أكثر عند كل طلب. في هذه الأثناء، يقوم منسق البيانات أيضًا بحفظ المقطع المخصص في الخادم الوصفية لاستمرار البيانات.</p>
<p>بعد ذلك، يقوم منسق البيانات بإرجاع معلومات المقطع المخصص (بما في ذلك معرف المقطع وعدد الصفوف ووقت انتهاء الصلاحية <code translate="no">t2</code> ، إلخ) إلى الوكيل. يرسل الوكيل هذه المعلومات الخاصة بالمقطع المخصص إلى مخزن الرسائل بحيث يتم تسجيل هذه المعلومات بشكل صحيح. لاحظ أن قيمة <code translate="no">t1</code> يجب أن تكون أصغر من قيمة <code translate="no">t2</code>. القيمة الافتراضية لـ <code translate="no">t2</code> هي 2000 ميلي ثانية ويمكن تغييرها من خلال تكوين المعلمة <code translate="no">segment.assignmentExpiration</code> في الملف <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">بنية ملف Binlog واستمرار البيانات<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>تدفق عقدة البيانات</span> </span></p>
<p>تشترك عقدة البيانات في مخزن الرسائل لأن طلبات إدراج البيانات يتم الاحتفاظ بها في مخزن الرسائل وبالتالي يمكن لعقد البيانات أن تستهلك رسائل الإدراج. تقوم عقد البيانات أولاً بوضع طلبات الإدراج في مخزن إدراج مؤقت، ومع تراكم الطلبات يتم مسحها إلى مخزن الكائنات بعد الوصول إلى حد معين.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">بنية ملف Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>بنية ملف Binlog</span>. </span></p>
<p>تشبه بنية ملف Binlog في Milvus تلك الموجودة في MySQL. يتم استخدام Binlog لخدمة وظيفتين: استعادة البيانات وبناء الفهرس.</p>
<p>يحتوي ملف Binlog على العديد من <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">الأحداث</a>. يحتوي كل حدث على رأس حدث وبيانات الحدث.</p>
<p>تتم كتابة البيانات الوصفية بما في ذلك وقت إنشاء Binlog، ومعرف عقدة الكتابة، وطول الحدث، والموضع التالي (إزاحة الحدث التالي)، وما إلى ذلك في رأس الحدث.</p>
<p>يمكن تقسيم بيانات الحدث إلى قسمين: ثابت ومتغير.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>بنية ملف حدث الإدراج</span>. </span></p>
<p>يحتوي الجزء الثابت في بيانات الحدث لحدث <code translate="no">INSERT_EVENT</code> على <code translate="no">StartTimestamp</code> و <code translate="no">EndTimestamp</code> و <code translate="no">reserved</code>.</p>
<p>يخزن الجزء المتغير في الواقع البيانات المدرجة. يتم تسلسل بيانات الإدراج في شكل باركيه وتخزينها في هذا الملف.</p>
<h3 id="Data-persistence" class="common-anchor-header">ثبات البيانات</h3><p>إذا كانت هناك أعمدة متعددة في المخطط، سيقوم ميلفوس بتخزين المدونات الثنائية في الأعمدة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>ثبات بيانات Binlog</span>. </span></p>
<p>كما هو موضح في الصورة أعلاه، العمود الأول هو المفتاح الأساسي binlog. والثاني هو عمود الطابع الزمني. أما البقية فهي الأعمدة المحددة في المخطط. يُشار أيضًا إلى مسار ملف المدونات الثنائية في MinIO في الصورة أعلاه.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن توفر</a> الإصدار 2.0 من ميلفوس 2.0 بشكل عام، قمنا بتنظيم سلسلة مدونة الغوص العميق هذه لتقديم تفسير متعمق لبنية ميلفوس وكود المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
