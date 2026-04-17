---
id: deep-dive-2-milvus-sdk-and-api.md
title: مقدمة عن مجموعة أدوات تطوير البرمجيات (SDK) وواجهة برمجة تطبيقات ميلفوس بايثون
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  تعرّف على كيفية تفاعل حزم تطوير البرمجيات مع Milvus ولماذا تساعدك واجهة برمجة
  التطبيقات على غرار ORM على إدارة Milvus بشكل أفضل.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<p>بقلم <a href="https://github.com/XuanYang-cn">شوان يانغ</a></p>
<h2 id="Background" class="common-anchor-header">الخلفية<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>يوضح الرسم التوضيحي التالي التفاعل بين حزم تطوير البرمجيات SDKs و Milvus من خلال gRPC. تخيل أن ميلفوس هو صندوق أسود. تُستخدم المخازن المؤقتة للبروتوكول لتحديد واجهات الخادم وهيكل المعلومات التي تحملها. لذلك، يتم تعريف جميع العمليات في الصندوق الأسود Milvus بواسطة واجهة برمجة تطبيقات البروتوكول.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>التفاعل</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">واجهة برمجة تطبيقات بروتوكول ميلفوس<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>تتكون واجهة برمجة تطبيقات بروتوكول ميلفوس من <code translate="no">milvus.proto</code> و <code translate="no">common.proto</code> و <code translate="no">schema.proto</code> ، وهي ملفات مخازن بروتوكول مؤقتة ملحقة بـ <code translate="no">.proto</code>. لضمان التشغيل السليم، يجب أن تتفاعل حزم SDKs مع Milvus مع ملفات المخازن المؤقتة للبروتوكول هذه.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> هو المكون الحيوي لواجهة برمجة تطبيقات بروتوكول ميلفوس لأنه يحدد <code translate="no">MilvusService</code> ، والذي يحدد كذلك جميع واجهات RPC الخاصة بـ Milvus.</p>
<p>يوضح نموذج الكود التالي الواجهة <code translate="no">CreatePartitionRequest</code>. وهي تحتوي على معلمتين رئيسيتين من نوع السلسلة <code translate="no">collection_name</code> و <code translate="no">partition_name</code> ، والتي يمكنك بناءً عليها بدء طلب إنشاء قسم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>تحقق من مثال على البروتوكول في <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">مستودع PyMilvus GitHub</a> في السطر 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>مثال</span> </span></p>
<p>يمكنك العثور على تعريف <code translate="no">CreatePartitionRequest</code> هنا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>التعريف</span> </span></p>
<p>نرحب بالمساهمين الذين يرغبون في تطوير ميزة من ميلفوس أو مجموعة تطوير البرمجيات بلغة برمجة مختلفة للعثور على جميع الواجهات التي يقدمها ميلفوس عبر RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> يحدد الأنواع الشائعة من المعلومات، بما في ذلك <code translate="no">ErrorCode</code> ، و <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> يحدد المخطط في المعلمات. نموذج الكود التالي هو مثال على <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>و <code translate="no">common.proto</code> ، و <code translate="no">schema.proto</code> معًا يشكلان معًا واجهة برمجة التطبيقات الخاصة بـ Milvus، ويمثلان جميع العمليات التي يمكن استدعاؤها عبر RPC.</p>
<p>إذا بحثت في التعليمات البرمجية المصدرية ولاحظت بعناية، ستجد أنه عند استدعاء واجهات مثل <code translate="no">create_index</code> ، فإنها في الواقع تستدعي واجهات RPC متعددة مثل <code translate="no">describe_collection</code> و <code translate="no">describe_index</code>. العديد من الواجهات الخارجية لـ Milvus هي مزيج من واجهات RPC متعددة.</p>
<p>بعد فهم سلوكيات RPC، يمكنك بعد ذلك تطوير ميزات جديدة لـ Milvus من خلال الجمع. أنت أكثر من مرحب بك لاستخدام خيالك وإبداعك والمساهمة في مجتمع Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">رسم الخرائط العلاقة بين الكائنات (ORM)</h3><p>باختصار، يشير التعيين العلائقي للكائنات (ORM) إلى أنه عندما تعمل على كائن محلي، فإن هذه العمليات ستؤثر على الكائن المقابل على الخادم. يتميز PyMilvus ORM-style API بالخصائص التالية:</p>
<ol>
<li>تعمل مباشرة على الكائنات.</li>
<li>يعزل منطق الخدمة وتفاصيل الوصول إلى البيانات.</li>
<li>يخفي تعقيدات التنفيذ، ويمكنك تشغيل نفس البرامج النصية عبر مثيلات Milvus المختلفة بغض النظر عن أساليب النشر أو التنفيذ.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">واجهة برمجة تطبيقات بنمط ORM</h3><p>يكمن أحد جوهر واجهة برمجة التطبيقات بنمط ORM في التحكم في اتصال Milvus. على سبيل المثال، يمكنك تحديد أسماء مستعارة لعدة خوادم Milvus، والاتصال بها أو قطع الاتصال بها فقط باستخدام الأسماء المستعارة الخاصة بها. يمكنك حتى حذف عنوان الخادم المحلي، والتحكم في كائنات معينة عبر اتصال محدد بدقة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>التحكم في الاتصال</span> </span></p>
<p>ميزة أخرى لواجهة برمجة التطبيقات على غرار ORM هي أنه بعد التجريد، يمكن إجراء جميع العمليات مباشرةً على الكائنات، بما في ذلك التجميع والتقسيم والفهرس.</p>
<p>يمكنك تجريد كائن مجموعة عن طريق الحصول على كائن موجود أو إنشاء كائن جديد. يمكنك أيضًا تعيين اتصال Milvus إلى كائنات محددة باستخدام اسم مستعار للاتصال، بحيث يمكنك العمل على هذه الكائنات محليًا.</p>
<p>لإنشاء كائن تقسيم، يمكنك إما إنشاؤه مع كائن المجموعة الأصل، أو يمكنك القيام بذلك تمامًا كما تفعل عند إنشاء كائن مجموعة. يمكن استخدام هذه الطرق على كائن فهرس أيضًا.</p>
<p>في حالة وجود كائنات التقسيم أو كائنات الفهرس هذه، يمكنك الحصول عليها من خلال كائن المجموعة الأصل.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة التعمّق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن توفر</a> الإصدار 2.0 من Milvus 2.0 بشكل عام، قمنا بتنظيم سلسلة مدونة Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
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
