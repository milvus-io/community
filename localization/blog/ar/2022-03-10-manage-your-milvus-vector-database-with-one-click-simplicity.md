---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: إدارة قاعدة بيانات Milvus Vector الخاصة بك بنقرة واحدة بكل بساطة
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - أداة واجهة المستخدم الرسومية لميلفوس 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>صورة غلاف المدونة</span> </span></p>
<p>مسودة بقلم <a href="https://github.com/czhen-zilliz">تشن تشين</a> وترجمة <a href="https://github.com/LocoRichard">ليشن وانغ</a>.</p>
<p style="font-size: 12px;color: #4c5a67">انقر <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">هنا</a> للتحقق من المنشور الأصلي.</p> 
<p>في مواجهة الطلب المتزايد بسرعة على معالجة البيانات غير المهيكلة، يبرز نظام Milvus 2.0. وهو نظام قاعدة بيانات متجه موجه بالذكاء الاصطناعي مصمم لسيناريوهات الإنتاج الضخمة. بصرف النظر عن كل حزم SDKs الخاصة بـ Milvus و Milvus CLI، وهي واجهة سطر أوامر لـ Milvus، هل هناك أداة تسمح للمستخدمين بتشغيل Milvus بشكل أكثر سهولة؟ الإجابة هي نعم. لقد أعلنت شركة Zilliz عن واجهة مستخدم رسومية - Attu - خصيصًا لميلفوس. في هذه المقالة، نود أن نوضح لك خطوة بخطوة كيفية إجراء بحث تشابه المتجهات باستخدام Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>جزيرة أتو</span> </span></p>
<p>بالمقارنة مع واجهة المستخدم Milvus CLI التي تجلب البساطة المطلقة في الاستخدام، يتميز Attu بالمزيد:</p>
<ul>
<li>أدوات تثبيت لأنظمة تشغيل ويندوز وماك ولينكس;</li>
<li>واجهة مستخدم رسومية بديهية لتسهيل استخدام ميلفوس;</li>
<li>تغطية الوظائف الرئيسية لميلفوس;</li>
<li>مكونات إضافية لتوسيع الوظائف المخصصة;</li>
<li>معلومات كاملة عن طوبولوجيا النظام لتسهيل فهم وإدارة مثيل ميلفوس.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">التثبيت<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكنك العثور على أحدث إصدار من Attu على <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. يوفر Attu مثبتات قابلة للتنفيذ لأنظمة تشغيل مختلفة. وهو مشروع مفتوح المصدر ويرحب بالمساهمة من الجميع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>التثبيت</span> </span></p>
<p>يمكنك أيضًا تثبيت Attu عبر Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> هو عنوان IP للبيئة التي يعمل فيها Attu، و <code translate="no">milvus server IP</code> هو عنوان IP للبيئة التي يعمل فيها Milvus.</p>
<p>بعد تثبيت Attu بنجاح، يمكنك إدخال عنوان IP ومنفذ Milvus في الواجهة لبدء تشغيل Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>ربط ميلفوس مع أتو</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">نظرة عامة على الميزة<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>صفحة نظرة عامة</span> </span></p>
<p>تتكون واجهة Attu من صفحة <strong>نظرة</strong> عامة، وصفحة <strong>المجموعات،</strong> وصفحة <strong>البحث عن المتجهات،</strong> وصفحة <strong>عرض</strong> النظام، والتي تتوافق مع الأيقونات الأربعة الموجودة في جزء التنقل على الجانب الأيسر على التوالي.</p>
<p>تعرض صفحة <strong>النظرة العامة</strong> المجموعات التي تم تحميلها. في حين تسرد صفحة <strong>المجموعة</strong> جميع المجموعات وتشير إلى ما إذا كانت محملة أو تم تحريرها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>صفحة المجموعة</span> </span></p>
<p>صفحات <strong>البحث عن المتجهات</strong> وصفحات <strong>عرض النظام</strong> هي مكونات إضافية لـ Attu. سيتم تقديم مفاهيم واستخدام المكونات الإضافية في الجزء الأخير من المدونة.</p>
<p>يمكنك إجراء بحث تشابه المتجهات في صفحة <strong>بحث</strong> المتجهات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>صفحة البحث عن المتجهات</span> </span></p>
<p>في صفحة <strong>عرض</strong> النظام، يمكنك التحقق من البنية الطوبولوجية لميلفوس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>صفحة عرض النظام</span> </span></p>
<p>يمكنك أيضًا التحقق من المعلومات التفصيلية لكل عقدة بالنقر على العقدة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>عرض العقدة</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">عرض توضيحي<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>لنستكشف أتو مع مجموعة بيانات اختبارية.</p>
<p>تحقق من <a href="https://github.com/zilliztech/attu/tree/main/examples">ريبو GitHub</a> الخاص بنا للحصول على مجموعة البيانات المستخدمة في الاختبار التالي.</p>
<p>أولاً، قم بإنشاء مجموعة باسم اختبار مع الحقول الأربعة التالية:</p>
<ul>
<li>اسم الحقل: المعرف، حقل المفتاح الأساسي</li>
<li>اسم الحقل: المتجه، الحقل المتجه، الحقل المتجه، المتجه العائم، البعد: 128</li>
<li>اسم الحقل: العلامة التجارية، حقل قياسي، البعد: Int64</li>
<li>اسم الحقل: اللون، حقل قياسي، Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>إنشاء مجموعة</span> </span></p>
<p>قم بتحميل المجموعة للبحث بعد إنشائها بنجاح.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>تحميل المجموعة</span> </span></p>
<p>يمكنك الآن التحقق من المجموعة التي تم إنشاؤها حديثًا في صفحة <strong>نظرة عامة</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>تحقق من المجموعة</span> </span></p>
<p>استيراد مجموعة البيانات الاختبارية إلى ملفوس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>استيراد البيانات</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>استيراد البيانات</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>استيراد البيانات</span> </span></p>
<p>انقر فوق اسم المجموعة في صفحة نظرة عامة أو صفحة المجموعة للدخول إلى واجهة الاستعلام للتحقق من البيانات المستوردة.</p>
<p>أضف عامل التصفية، وحدد التعبير <code translate="no">id != 0</code> ، وانقر فوق <strong>تطبيق عامل التصفية،</strong> وانقر فوق <strong>استعلام</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>استعلام البيانات</span> </span></p>
<p>ستجد أن جميع إدخالات الكيانات الخمسين قد تم استيرادها بنجاح.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>نتيجة الاستعلام</span> </span></p>
<p>لنجرب البحث عن تشابه المتجهات.</p>
<p>انسخ متجهًا واحدًا من <code translate="no">search_vectors.csv</code> والصقه في حقل <strong>قيمة المتجه</strong>. اختر المجموعة والحقل. انقر فوق <strong>بحث</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>بحث البيانات</span> </span></p>
<p>يمكنك بعد ذلك التحقق من نتيجة البحث. بدون تجميع أي نصوص برمجية، يمكنك البحث باستخدام ميلفوس بسهولة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>نتيجة البحث</span> </span></p>
<p>أخيراً، دعنا نتحقق من صفحة <strong>عرض النظام</strong>.</p>
<p>باستخدام واجهة برمجة تطبيقات المقاييس المغلفة في Milvus Node.js SDK، يمكنك التحقق من حالة النظام وعلاقات العقدة وحالة العقدة.</p>
<p>كميزة حصرية لـ Attu، تتضمن صفحة عرض النظام رسمًا بيانيًا طوبولوجيًا كاملًا للنظام. من خلال النقر على كل عقدة، يمكنك التحقق من حالتها (تحديث كل 10 ثوانٍ).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>الرسم البياني الطوبولوجي لعقدة ميلفوس</span> </span></p>
<p>انقر على كل عقدة للدخول إلى <strong>عرض قائمة العقدة</strong>. يمكنك التحقق من جميع العقد التابعة لعقدة التنسيق. من خلال الفرز، يمكنك تحديد العُقد ذات الاستخدام العالي لوحدة المعالجة المركزية أو الذاكرة بسرعة، وتحديد المشكلة في النظام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>قائمة عقدة ميلفوس</span> </span></p>
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
    </button></h2><p>كما ذكرنا سابقًا، فإن صفحتي <strong>Vector Search</strong> و <strong>System View</strong> هما مكونان إضافيان لـ Attu. نحن نشجع المستخدمين على تطوير المكونات الإضافية الخاصة بهم في Attu لتناسب سيناريوهات تطبيقاتهم. في الشيفرة المصدرية، يوجد مجلد مصمم خصيصًا لرموز المكونات الإضافية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>الإضافات</span> </span></p>
<p>يمكنك الرجوع إلى أي من المكونات الإضافية لمعرفة كيفية إنشاء مكون إضافي. من خلال تعيين ملف التكوين التالي، يمكنك إضافة المكون الإضافي إلى Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>إضافة ملحقات إلى Attu</span> </span></p>
<p>يمكنك الاطلاع على <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> <a href="https://milvus.io/docs/v2.0.x/attu.md">ووثيقة Milvus الفنية</a> للحصول على تعليمات مفصلة.</p>
<p>Attu هو مشروع مفتوح المصدر. جميع المساهمات مرحب بها. يمكنك أيضًا <a href="https://github.com/zilliztech/attu/issues">تقديم مشكلة</a> إذا واجهتك أي مشكلة في Attu.</p>
<p>نأمل مخلصين أن يوفر لك Attu تجربة مستخدم أفضل مع Milvus. وإذا أعجبك Attu، أو كانت لديك بعض الملاحظات حول الاستخدام، يمكنك إكمال <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">استبيان مستخدم Attu</a> هذا لمساعدتنا في تحسين Attu من أجل تجربة مستخدم أفضل.</p>
