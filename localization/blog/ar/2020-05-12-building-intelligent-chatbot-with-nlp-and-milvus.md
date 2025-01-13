---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: البنية العامة
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: روبوت ضمان الجودة من الجيل التالي هنا
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>بناء نظام ذكي لضمان الجودة باستخدام البرمجة اللغوية العصبية و Milvus</custom-h1><p>مشروع ميلفوس ：github.com/milvus-io/milvus</p>
<p>يشيع استخدام نظام الإجابة على الأسئلة في مجال معالجة اللغة الطبيعية. يتم استخدامه للإجابة على الأسئلة في شكل لغة طبيعية وله مجموعة واسعة من التطبيقات. وتتضمن التطبيقات النموذجية: التفاعل الصوتي الذكي، وخدمة العملاء عبر الإنترنت، واكتساب المعرفة، والدردشة العاطفية المخصصة، وغيرها. يمكن تصنيف معظم أنظمة الإجابة عن الأسئلة إلى: أنظمة الإجابة عن الأسئلة التوليدية والاسترجاعية، وأنظمة الإجابة عن الأسئلة أحادية الجولة وأنظمة الإجابة عن الأسئلة متعددة الجولات وأنظمة الإجابة عن الأسئلة المفتوحة وأنظمة الإجابة عن الأسئلة المحددة.</p>
<p>تتناول هذه المقالة بشكل أساسي نظام ضمان الجودة المصمم لمجال محدد، والذي يُطلق عليه عادةً روبوت خدمة العملاء الذكي. في الماضي، كان بناء روبوت خدمة العملاء يتطلب عادةً تحويل معرفة المجال إلى سلسلة من القواعد والرسوم البيانية المعرفية. تعتمد عملية البناء بشكل كبير على الذكاء "البشري". وبمجرد تغيير المشاهد، سيتطلب الأمر الكثير من العمل المتكرر. مع تطبيق التعلم العميق في معالجة اللغة الطبيعية (NLP)، يمكن للقراءة الآلية أن تجد تلقائياً إجابات للأسئلة المطابقة مباشرةً من المستندات. يقوم نموذج لغة التعلم العميق بتحويل الأسئلة والمستندات إلى متجهات دلالية للعثور على الإجابة المطابقة.</p>
<p>تستخدم هذه المقالة نموذج BERT مفتوح المصدر من Google وMilvus، وهو محرك بحث متجه مفتوح المصدر، لبناء روبوت للأسئلة والأجوبة بسرعة استنادًا إلى الفهم الدلالي.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">البنية العامة<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>تنفذ هذه المقالة نظامًا للإجابة على الأسئلة من خلال مطابقة التشابه الدلالي. عملية البناء العامة هي كما يلي:</p>
<ol>
<li>الحصول على عدد كبير من الأسئلة ذات الإجابات في مجال معين (مجموعة أسئلة قياسية).</li>
<li>استخدام نموذج BERT لتحويل هذه الأسئلة إلى متجهات ميزات وتخزينها في Milvus. وسيقوم Milvus بتعيين معرف متجه لكل متجه ميزة في نفس الوقت.</li>
<li>قم بتخزين معرّفات الأسئلة التمثيلية هذه والإجابات المقابلة لها في PostgreSQL.</li>
</ol>
<p>عندما يطرح المستخدم سؤالاً:</p>
<ol>
<li>يقوم نموذج BERT بتحويله إلى متجه ميزة.</li>
<li>يقوم Milvus بإجراء بحث عن التشابه واسترداد المعرف الأكثر تشابهًا مع السؤال.</li>
<li>تقوم PostgreSQL بإرجاع الإجابة المقابلة.</li>
</ol>
<p>مخطط بنية النظام كما يلي (الخطوط الزرقاء تمثل عملية الاستيراد والخطوط الصفراء تمثل عملية الاستعلام):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-نظام-معمارية-نظام-ميلفوس-بيرت-بوستغريسكل.png</span> </span></p>
<p>بعد ذلك، سنوضح لك كيفية بناء نظام الأسئلة والأجوبة عبر الإنترنت خطوة بخطوة.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">خطوات بناء نظام الأسئلة والأجوبة<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل أن تبدأ، تحتاج إلى تثبيت Milvus و PostgreSQL. لمعرفة خطوات التثبيت المحددة، راجع موقع ميلفوس الرسمي.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. إعداد البيانات</h3><p>تأتي البيانات التجريبية في هذه المقالة من: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>تحتوي مجموعة البيانات على أزواج بيانات الأسئلة والأجوبة المتعلقة بصناعة التأمين. في هذه المقالة نستخرج منها 20,000 زوج من الأسئلة والأجوبة. من خلال هذه المجموعة من مجموعات بيانات الأسئلة والأجوبة، يمكنك بناء روبوت خدمة عملاء لصناعة التأمين بسرعة.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. توليد متجهات الميزات</h3><p>يستخدم هذا النظام نموذجًا قام BERT بتدريبها مسبقًا. قم بتنزيله من الرابط أدناه قبل بدء الخدمة: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>استخدم هذا النموذج لتحويل قاعدة بيانات الأسئلة إلى ناقلات ميزات للبحث عن التشابه في المستقبل. لمزيد من المعلومات حول خدمة BERT، انظر https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-كود-كتلة الكود.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. الاستيراد إلى Milvus و PostgreSQL</h3><p>قم بتطبيع واستيراد ناقلات الميزات التي تم إنشاؤها إلى Milvus، ثم قم باستيراد المعرفات التي تم إرجاعها بواسطة Milvus والإجابات المقابلة إلى PostgreSQL. يوضح ما يلي بنية الجدول في PostgreSQLSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3- import-milvus-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4- import-milvus-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. استرجاع الإجابات</h3><p>يقوم المستخدم بإدخال سؤال، وبعد توليد متجه الميزة من خلال BERT، يمكنه العثور على السؤال الأكثر تشابهًا في مكتبة Milvus. تستخدم هذه المقالة مسافة جيب التمام لتمثيل التشابه بين جملتين. نظرًا لأن جميع المتجهات يتم تطبيعها، فكلما اقتربت مسافة جيب التمام بين متجهي الميزة من 1، كلما زاد التشابه.</p>
<p>من الناحية العملية، قد لا يكون لدى نظامك أسئلة متطابقة تمامًا في المكتبة. بعد ذلك، يمكنك تعيين عتبة 0.9. إذا كانت أكبر مسافة تشابه مسترجعة أقل من هذه العتبة، سيطالب النظام بعدم تضمين الأسئلة ذات الصلة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-استرجاع-الأجوبة.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">عرض توضيحي للنظام<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>فيما يلي مثال توضيحي لواجهة النظام:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-نظام-التطبيق.png</span> </span></p>
<p>أدخل سؤالك في مربع الحوار وستتلقى إجابة مقابلة:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-ملفوس-QA-نظام-تطبيق-نظام-التطبيق-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">ملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد قراءة هذه المقالة، نأمل أن تجد سهولة في بناء نظام الأسئلة والأجوبة الخاص بك.</p>
<p>فمع نموذج BERT، لم تعد بحاجة إلى فرز وتنظيم مجموعة النصوص مسبقًا. في الوقت نفسه، وبفضل الأداء العالي وقابلية التوسع العالية لمحرك البحث المتجه مفتوح المصدر Milvus، يمكن لنظام ضمان الجودة الخاص بك دعم مجموعة نصوص تصل إلى مئات الملايين من النصوص.</p>
<p>وقد انضمت Milvus رسميًا إلى مؤسسة لينكس للذكاء الاصطناعي (LF AI) للاحتضان. نرحب بك للانضمام إلى مجتمع Milvus والعمل معنا لتسريع تطبيق تقنيات الذكاء الاصطناعي!</p>
<p>=&gt; جرب عرضنا التجريبي عبر الإنترنت هنا: https://www.milvus.io/scenarios</p>
