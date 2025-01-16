---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  الكشف عن Milvus 2.3.2 و2.3.3: دعم أنواع بيانات المصفوفة، والحذف المعقد، وتكامل
  TiKV، والمزيد
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  يسعدنا اليوم أن نعلن عن إصدار الإصدار 2.3.2 و2.3.3.3 من Milvus! تجلب هذه
  التحديثات العديد من الميزات المثيرة والتحسينات والتحسينات المثيرة، مما يعزز
  أداء النظام والمرونة وتجربة المستخدم بشكل عام.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في المشهد المتطور باستمرار لتقنيات البحث عن المتجهات، لا تزال Milvus في الطليعة، حيث تتخطى الحدود وتضع معايير جديدة. اليوم، يسعدنا أن نعلن عن إصدار الإصدار 2.3.2 و2.3.3.3 من Milvus! تجلب هذه التحديثات العديد من الميزات المثيرة والتحسينات والتحسينات المثيرة، مما يعزز أداء النظام والمرونة وتجربة المستخدم بشكل عام.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">دعم أنواع بيانات المصفوفات - مما يجعل نتائج البحث أكثر دقة وملاءمة<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>تُعد إضافة دعم نوع بيانات المصفوفات تحسينًا محوريًا لـ Milvus، خاصةً في سيناريوهات تصفية الاستعلام مثل التقاطع والاتحاد. تضمن هذه الإضافة أن تكون نتائج البحث ليست أكثر دقة فحسب، بل أكثر ملاءمة أيضًا. من الناحية العملية، على سبيل المثال، في قطاع التجارة الإلكترونية، تسمح علامات المنتجات المخزّنة كسلسلة مصفوفات للمستهلكين بإجراء عمليات بحث متقدمة، وتصفية النتائج غير ذات الصلة.</p>
<p>يمكنك الغوص في <a href="https://milvus.io/docs/array_data_type.md">وثائقنا</a> الشاملة للحصول على دليل متعمق حول الاستفادة من أنواع المصفوفات في Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">دعم تعبيرات الحذف المعقدة - تحسين إدارة البيانات الخاصة بك<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>في الإصدارات السابقة، دعمت Milvus في الإصدارات السابقة تعبيرات حذف المفتاح الأساسي، مما يوفر بنية مستقرة ومبسطة. مع الإصدار Milvus 2.3.2 أو 2.3.3، يمكن للمستخدمين استخدام تعبيرات الحذف المعقدة، مما يسهل مهام إدارة البيانات المعقدة مثل التنظيف المتجدد للبيانات القديمة أو حذف البيانات المدفوع باللائحة العامة لحماية البيانات استنادًا إلى معرّفات المستخدم.</p>
<p>ملاحظة: تأكد من تحميل المجموعات قبل استخدام التعبيرات المعقدة. بالإضافة إلى ذلك، من المهم ملاحظة أن عملية الحذف لا تضمن الذرية.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">تكامل TiKV - تخزين البيانات الوصفية القابلة للتطوير مع الاستقرار<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>بالاعتماد في السابق على Etcd لتخزين البيانات الوصفية، واجهت Milvus تحديات محدودة السعة وقابلية التوسع في تخزين البيانات الوصفية. ولمعالجة هذه المشاكل، أضافت Milvus TiKV، وهو مخزن مفتوح المصدر للقيم الرئيسية، كخيار آخر لتخزين البيانات الوصفية. يوفر TiKV قابلية توسع واستقرار وكفاءة محسنة، مما يجعله حلاً مثاليًا لمتطلبات Milvus المتطورة. بدءًا من الإصدار Milvus 2.3.2، يمكن للمستخدمين الانتقال بسلاسة إلى TiKV لتخزين البيانات الوصفية من خلال تعديل التكوين.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">دعم نوع المتجه FP16 - احتضان كفاءة التعلم الآلي<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم الآن الإصدار Milvus 2.3.2 والإصدارات الأحدث نوع متجه FP16 على مستوى الواجهة. FP16، أو النقطة العائمة 16 بت، هو تنسيق بيانات يستخدم على نطاق واسع في التعلم العميق والتعلم الآلي، مما يوفر تمثيلًا وحسابًا فعالاً للقيم العددية. في حين أن الدعم الكامل لـ FP16 قيد التنفيذ، تتطلب الفهارس المختلفة في طبقة الفهرسة تحويل FP16 إلى FP32 أثناء الإنشاء.</p>
<p>سنقوم بدعم أنواع بيانات FP16 و BF16 و int8 بشكل كامل في الإصدارات اللاحقة من Milvus. ترقبوا.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">تحسين كبير في تجربة الترقية المتجددة - انتقال سلس للمستخدمين<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>تعد الترقية المتجددة ميزة مهمة للأنظمة الموزعة، مما يتيح ترقيات النظام دون تعطيل خدمات الأعمال أو التعرض لأوقات تعطل. في أحدث إصدارات ميلفوس، قمنا بتعزيز ميزة الترقية المتجددة في ميلفوس، مما يضمن انتقالاً أكثر انسيابية وفعالية للمستخدمين الذين يقومون بالترقية من الإصدار 2.2.15 إلى 2.3.3.3 وجميع الإصدارات الأحدث. وقد استثمر المجتمع أيضًا في إجراء اختبارات وتحسينات واسعة النطاق، مما قلل من تأثير الاستعلام أثناء الترقية إلى أقل من 5 دقائق، مما يوفر للمستخدمين تجربة خالية من المتاعب.</p>
<h2 id="Performance-optimization" class="common-anchor-header">تحسين الأداء<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى تقديم ميزات جديدة، فقد قمنا بتحسين أداء Milvus بشكل كبير في الإصدارين الأخيرين.</p>
<ul>
<li><p>تصغير عمليات نسخ البيانات لتحسين تحميل البيانات</p></li>
<li><p>تبسيط عمليات الإدراج ذات السعة الكبيرة باستخدام قراءة دُفعات متغيرة</p></li>
<li><p>إزالة عمليات التحقق من الإزاحات غير الضرورية أثناء حشو البيانات لتحسين أداء مرحلة الاستدعاء.</p></li>
<li><p>معالجة مشكلات الاستهلاك العالي لوحدة المعالجة المركزية في السيناريوهات ذات عمليات إدراج البيانات الكبيرة</p></li>
</ul>
<p>تساهم هذه التحسينات مجتمعةً في توفير تجربة Milvus أسرع وأكثر كفاءة. تحقق من لوحة معلومات المراقبة الخاصة بنا لإلقاء نظرة سريعة على كيفية تحسين أداء Milvus.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">التغييرات غير المتوافقة<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>حذف التعليمات البرمجية المتعلقة بـ TimeTravel بشكل دائم.</p></li>
<li><p>إهمال دعم MySQL كمخزن للبيانات الوصفية.</p></li>
</ul>
<p>راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus</a> لمزيد من المعلومات التفصيلية حول جميع الميزات والتحسينات الجديدة.</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدارين الأخيرين Milvus 2.3.2 و2.3.3، نحن ملتزمون بتوفير حل قاعدة بيانات قوي وغني بالميزات وعالي الأداء. استكشف هذه الميزات الجديدة، واستفد من التحسينات، وانضم إلينا في هذه الرحلة المثيرة بينما نطور Milvus لتلبية متطلبات إدارة البيانات الحديثة. قم بتنزيل أحدث إصدار الآن واختبر مستقبل تخزين البيانات مع Milvus!</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">لنبقى على اتصال!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كان لديك أسئلة أو ملاحظات حول Milvus، انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا للتفاعل مع مهندسينا والمجتمع مباشرةً أو انضم إلى <a href="https://discord.com/invite/RjNbk8RR4f">غداء مجتمع Milvus وتعلم</a> كل يوم ثلاثاء من الساعة 12-12:30 مساءً بتوقيت المحيط الهادي. نرحب بك أيضًا لمتابعتنا على <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> للحصول على آخر الأخبار والتحديثات حول Milvus.</p>
