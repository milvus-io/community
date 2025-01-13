---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'الإصدار Milvus 2.2.8: أداء أفضل للاستعلام، وإنتاجية أعلى بنسبة 20%'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>ميلفوس 2.2.8</span> </span></p>
<p>نحن متحمسون للإعلان عن أحدث إصداراتنا من Milvus 2.2.8. يتضمن هذا الإصدار العديد من التحسينات وإصلاحات الأخطاء من الإصدارات السابقة، مما أدى إلى تحسين أداء الاستعلام وتوفير الموارد وزيادة الإنتاجية. دعونا نلقي نظرة على الجديد في هذا الإصدار معًا.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">تقليل ذروة استهلاك الذاكرة أثناء تحميل المجموعة<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>لإجراء الاستعلامات، يحتاج Milvus إلى تحميل البيانات والفهارس في الذاكرة. ومع ذلك، أثناء عملية التحميل، يمكن أن تتسبب النسخ المتعددة للذاكرة في زيادة ذروة استخدام الذاكرة إلى ثلاثة إلى أربعة أضعاف ما كانت عليه أثناء وقت التشغيل الفعلي. يعالج أحدث إصدار من Milvus 2.2.8 هذه المشكلة بشكل فعال ويحسن استخدام الذاكرة.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">سيناريوهات استعلام موسعة مع دعم QueryNode للمكونات الإضافية<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>تدعم QueryNode الآن المكونات الإضافية في الإصدار الأحدث Milvus 2.2.8. يمكنك بسهولة تحديد مسار ملف المكون الإضافي باستخدام التكوين <code translate="no">queryNode.soPath</code>. بعد ذلك، يمكن لـ Milvus تحميل المكون الإضافي في وقت التشغيل وتوسيع سيناريوهات الاستعلام المتاحة. راجع <a href="https://pkg.go.dev/plugin">وثائق المكون الإضافي Go،</a> إذا كنت بحاجة إلى إرشادات حول تطوير المكونات الإضافية.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">تحسين أداء الاستعلام مع خوارزمية الضغط المحسنة<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>تحدد خوارزمية الضغط السرعة التي يمكن أن تتقارب بها المقاطع، مما يؤثر بشكل مباشر على أداء الاستعلام. مع التحسينات الأخيرة التي أُدخلت على خوارزمية الضغط، تحسنت كفاءة التقارب بشكل كبير، مما أدى إلى استعلامات أسرع.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">توفير أفضل للموارد وأداء أفضل في الاستعلام مع تقليل أجزاء التجميع<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>ميلفوس هو نظام معالجة متوازية بشكل كبير (MPP)، مما يعني أن عدد أجزاء المجموعة يؤثر على كفاءة ميلفوس في الكتابة والاستعلام. في الإصدارات القديمة، كانت المجموعة تحتوي على جزأين بشكل افتراضي، مما أدى إلى أداء ممتاز في الكتابة ولكن أداء الاستعلام وتكلفة الموارد كان ضعيفًا. مع التحديث الجديد ل Milvus 2.2.8، تم تقليل أجزاء المجموعة الافتراضية إلى جزء واحد، مما يسمح للمستخدمين بتوفير المزيد من الموارد وإجراء استعلامات أفضل. معظم المستخدمين في المجتمع لديهم أقل من 10 ملايين وحدة تخزين للبيانات، ويكفي جزء واحد لتحقيق أداء كتابة جيد.</p>
<p><strong>ملاحظة</strong>: لا تؤثر هذه الترقية على المجموعات التي تم إنشاؤها قبل هذا الإصدار.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">زيادة الإنتاجية بنسبة 20% مع خوارزمية تجميع الاستعلام المحسنة<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي Milvus على خوارزمية تجميع استعلام فعالة تجمع طلبات الاستعلام المتعددة في قائمة الانتظار في طلب واحد لتنفيذ أسرع، مما يحسن الإنتاجية بشكل كبير. في الإصدار الأخير، أدخلنا تحسينات إضافية على هذه الخوارزمية، مما أدى إلى زيادة إنتاجية Milvus بنسبة 20% على الأقل.</p>
<p>بالإضافة إلى التحسينات المذكورة، يعمل الإصدار Milvus 2.2.8 أيضًا على إصلاح العديد من الأخطاء. لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار ميلفوس</a>.</p>
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، يُرجى عدم التردد في الاتصال بنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع بأكمله مباشرةً أو الاطلاع على <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
