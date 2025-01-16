---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: ما الجديد في Milvus 2.1 - نحو البساطة والسرعة
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  تتمتع الآن Milvus، قاعدة بيانات المتجهات مفتوحة المصدر، بتحسينات في الأداء
  وسهولة الاستخدام لطالما انتظرها المستخدمون.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>الجديد في ميلفوس 2.1 - نحو البساطة والسرعة</span> </span></p>
<p>يسعدنا أن نعلن أن<a href="https://milvus.io/docs/v2.1.x/release_notes.md">إصدار الإصدار</a> Milvus 2.1 أصبح الآن متاحًا بعد ستة أشهر من العمل الشاق من قبل جميع المساهمين في مجتمع Milvus. يركز هذا التكرار الرئيسي لقاعدة البيانات المتجهة الشهيرة على <strong>الأداء</strong> <strong>وسهولة الاستخدام،</strong> وهما أهم كلمتين رئيسيتين في تركيزنا. لقد أضفنا دعمًا للسلاسل وقائمة انتظار رسائل Kafka و Milvus المدمجة، بالإضافة إلى عدد من التحسينات في الأداء وقابلية التوسع والأمان وقابلية الملاحظة. يعد Milvus 2.1 تحديثًا مثيرًا من شأنه أن يسد "الميل الأخير" من الكمبيوتر المحمول الخاص بمهندس الخوارزمية إلى خدمات البحث عن التشابه المتجه على مستوى الإنتاج.</p>
<custom-h1>الأداء - زيادة أكثر من 3.2 أضعاف</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">زمن انتقال على مستوى 5 مللي ثانية<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus بالفعل البحث عن الجار الأقرب التقريبي (ANN)، وهي قفزة كبيرة عن طريقة KNN التقليدية. ومع ذلك، لا تزال مشاكل الإنتاجية والكمون تشكل تحديًا للمستخدمين الذين يحتاجون إلى التعامل مع سيناريوهات استرجاع البيانات المتجهة على نطاق مليار.</p>
<p>في Milvus 2.1، يوجد بروتوكول توجيه جديد لم يعد يعتمد على قوائم انتظار الرسائل في رابط الاسترجاع، مما يقلل بشكل كبير من زمن انتقال الاسترجاع لمجموعات البيانات الصغيرة. تُظهر نتائج اختبارنا أن Milvus الآن يخفض مستوى زمن الاستجابة إلى 5 مللي ثانية، وهو ما يلبي متطلبات الروابط المهمة عبر الإنترنت مثل البحث عن التشابه والتوصية.</p>
<h2 id="Concurrency-control" class="common-anchor-header">التحكم في التزامن<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>يعمل Milvus 2.1 على ضبط نموذج التزامن الخاص به من خلال تقديم نموذج جديد لتقييم التكلفة وجدولة التزامن. وهو يوفر الآن التحكم في التزامن، مما يضمن عدم وجود عدد كبير من الطلبات المتزامنة التي تتنافس على موارد وحدة المعالجة المركزية وذاكرة التخزين المؤقت، ولن يتم استخدام وحدة المعالجة المركزية بشكل أقل من اللازم لعدم وجود طلبات كافية. كما تدمج طبقة المجدول الذكي الجديد في Milvus 2.1 طبقة المجدول الذكي الجديدة في Milvus 2.1 أيضًا الاستعلامات ذات عدد الطلبات الصغيرة التي لها معلمات طلب متناسقة، مما يوفر تعزيزًا مذهلاً للأداء بمقدار 3.2 أضعاف في السيناريوهات ذات عدد الطلبات الصغيرة والتزامن العالي للاستعلام.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">النسخ المتماثلة في الذاكرة<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>يجلب الإصدار Milvus 2.1 النسخ المتماثلة في الذاكرة التي تعمل على تحسين قابلية التوسع والتوافر لمجموعات البيانات الصغيرة. على غرار النسخ المتماثلة للقراءة فقط في قواعد البيانات التقليدية، يمكن للنسخ المتماثلة في الذاكرة أن تتوسع أفقياً بإضافة أجهزة عندما تكون سرعة القراءة في الثانية عالية. في استرجاع المتجهات لمجموعات البيانات الصغيرة، غالبًا ما يحتاج نظام التوصية إلى توفير QPS يتجاوز حد أداء جهاز واحد. الآن في هذه السيناريوهات، يمكن تحسين إنتاجية النظام بشكل كبير عن طريق تحميل نسخ متماثلة متعددة في الذاكرة. في المستقبل، سنقدم أيضًا في المستقبل آلية قراءة محمية تعتمد على النسخ المتماثلة في الذاكرة، والتي ستطلب بسرعة نسخًا وظيفية أخرى في حالة احتياج النظام إلى التعافي من الأعطال والاستفادة الكاملة من التكرار في الذاكرة لتحسين التوافر الكلي للنظام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>تسمح النسخ المتماثلة داخل الذاكرة بأن تستند خدمات الاستعلام على نسخ منفصلة من البيانات نفسها</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">تحميل أسرع للبيانات<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>يأتي التحسين الأخير في الأداء من تحميل البيانات. يقوم الآن Milvus 2.1 بضغط <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">السجلات الثنائية</a> باستخدام Zstandard (zstd)، مما يقلل بشكل كبير من حجم البيانات في مخازن الكائنات والرسائل بالإضافة إلى النفقات الزائدة للشبكة أثناء تحميل البيانات. بالإضافة إلى ذلك، تم الآن تقديم تجمعات goroutine بحيث يمكن لـ Milvus تحميل المقاطع بشكل متزامن مع التحكم في آثار الذاكرة وتقليل الوقت اللازم للتعافي من الأعطال وتحميل البيانات.</p>
<p>سيتم نشر النتائج المعيارية الكاملة لـ Milvus 2.1 على موقعنا الإلكتروني قريبًا. ترقبوا ذلك.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">دعم الفهرس السلسلي والعددي<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار 2.1، يدعم Milvus الآن سلسلة متغيرة الطول (VARCHAR) كنوع بيانات قياسي. يمكن استخدام VARCHAR كمفتاح أساسي يمكن إرجاعه كمخرج، ويمكن أن يعمل أيضًا كمرشحات للسمة. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">تصفية السمات</a> هي واحدة من أكثر الوظائف شيوعًا التي يحتاجها مستخدمو ميلفوس. إذا وجدت نفسك في كثير من الأحيان ترغب في &quot;العثور على المنتجات الأكثر تشابهًا مع المستخدم في نطاق سعري <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;، أو &quot;العثور على المقالات التي تحتوي على الكلمة الرئيسية &quot;قاعدة بيانات المتجهات&quot; وترتبط بموضوعات سحابية أصلية&quot;، فستحب Milvus 2.1.</p>
<p>يدعم Milvus 2.1 أيضًا فهرس Milvus 2.1 الفهرس المقلوب العددي لتحسين سرعة التصفية استنادًا إلى<a href="https://github.com/s-yata/marisa-trie">"ماريسا-تريز"</a><a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">الموجزة</a>كبنية بيانات. يمكن الآن تحميل جميع البيانات في الذاكرة ببصمة منخفضة جدًا، مما يسمح بمقارنة أسرع بكثير، والتصفية ومطابقة البادئة على السلاسل. تُظهر نتائج اختبارنا أن متطلبات الذاكرة في MARISA-trie هي 10% فقط من متطلبات قواميس Python لتحميل جميع البيانات في الذاكرة وتوفير إمكانيات الاستعلام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>يجمع Milvus 2.1 بين MARISA-Trie والفهرس المقلوب لتحسين سرعة التصفية بشكل كبير.</span> </span></p>
<p>في المستقبل، سيواصل ميلفوس التركيز في المستقبل على التطورات المتعلقة بالاستعلام القياسي، ودعم المزيد من أنواع الفهارس القياسية ومشغلي الاستعلام، وتوفير قدرات الاستعلام القياسي المستند إلى القرص، وكل ذلك كجزء من الجهود المستمرة لتقليل تكلفة التخزين والاستخدام للبيانات القياسية.</p>
<custom-h1>تحسينات قابلية الاستخدام</custom-h1><h2 id="Kafka-support" class="common-anchor-header">دعم كافكا<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>لطالما طلب مجتمعنا دعم <a href="https://kafka.apache.org">Apache Kafka</a> <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">كمخزن للرسائل</a> في Milvus. يوفر لك Milvus 2.1 الآن خيار استخدام<a href="https://pulsar.apache.org">Pulsar</a> أو Kafka كمخزن للرسائل بناءً على تكوينات المستخدم، وذلك بفضل تصميم التجريد والتغليف في Milvus وGo Kafka SDK الذي ساهمت به Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">مجموعة برمجيات جافا SDK الجاهزة للإنتاج<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار Milvus 2.1 من Milvus، تم الآن إصدار <a href="https://github.com/milvus-io/milvus-sdk-java">مجموعة تطوير البرمجيات Java SDK</a> الخاصة بنا رسميًا. وتتمتع مجموعة تطوير البرمجيات Java SDK بنفس إمكانيات مجموعة تطوير البرمجيات Python SDK، مع أداء أفضل في التزامن. في الخطوة التالية، سيعمل المساهمون في مجتمعنا على تحسين التوثيق وحالات الاستخدام لحزمة SDK Java SDK تدريجيًا، وسيساعدون في دفع حزم SDK Go و RESTful SDK إلى مرحلة الإنتاج الجاهز أيضًا.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">قابلية الملاحظة والصيانة<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>يضيف الإصدار Milvus 2.1<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">مقاييس</a> مراقبة مهمة مثل عدد مرات إدخال المتجهات، وزمن/إنتاجية البحث، والنفقات الزائدة في ذاكرة العقدة، والنفقات الزائدة لوحدة المعالجة المركزية. بالإضافة إلى ذلك، يعمل الإصدار الجديد أيضًا على تحسين حفظ السجل بشكل كبير من خلال ضبط مستويات السجل وتقليل طباعة السجل غير المفيدة.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">ميلفوس المدمج<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد سهّلت Milvus إلى حد كبير نشر خدمات استرجاع البيانات المتجهة الضخمة واسعة النطاق، ولكن بالنسبة للعلماء الذين يرغبون في التحقق من صحة الخوارزميات على نطاق أصغر، لا يزال Docker أو K8s معقدًا للغاية دون داعٍ. مع تقديم <a href="https://github.com/milvus-io/embd-milvus">Milvus</a> المدمج، يمكنك الآن تثبيت Milvus باستخدام pip، تمامًا كما هو الحال مع Pyrocksb و Pysqlite. يدعم Milvus المدمج جميع وظائف كل من الإصدارين العنقودي والمستقل، مما يسمح لك بالتبديل بسهولة من حاسوبك المحمول إلى بيئة إنتاج موزعة دون تغيير سطر واحد من التعليمات البرمجية. سيتمتع مهندسو الخوارزميات بتجربة أفضل بكثير عند بناء نموذج أولي باستخدام Milvus.</p>
<custom-h1>جرّب البحث المتجه خارج الصندوق الآن</custom-h1><p>علاوة على ذلك، يحتوي Milvus 2.1 أيضًا على بعض التحسينات الرائعة في الاستقرار وقابلية التوسع، ونحن نتطلع إلى استخدامك وملاحظاتك.</p>
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
    </button></h2><ul>
<li>راجع <a href="https://milvus.io/docs/v2.1.x/release_notes.md">ملاحظات الإصدار</a> المفصلة لجميع التغييرات في الإصدار Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">قم بتثبيت</a>Milvus 2.1 وجرب الميزات الجديدة</li>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Slack</a> الخاص بنا وناقش الميزات الجديدة مع الآلاف من مستخدمي ميلفوس حول العالم</li>
<li>تابعنا على <a href="https://twitter.com/milvusio">تويتر</a><a href="https://www.linkedin.com/company/the-milvus-project">ولينكد إن</a> للحصول على تحديثات بمجرد صدور مدوناتنا حول ميزات جديدة محددة</li>
</ul>
<blockquote>
<p>حرره <a href="https://github.com/songxianj">سونغكسيان جيانغ</a></p>
</blockquote>
