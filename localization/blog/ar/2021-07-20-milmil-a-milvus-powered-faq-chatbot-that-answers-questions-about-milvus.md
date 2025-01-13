---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: >-
  MilMil روبوت الدردشة الآلي للأسئلة الشائعة المدعوم من ميلفوس الذي يجيب عن
  أسئلة حول ميلفوس
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: استخدام أدوات البحث المتجهة مفتوحة المصدر لبناء خدمة الإجابة عن الأسئلة.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>ميل ميل: روبوت محادثة للأسئلة الشائعة مدعوم من ميلفوس يجيب عن أسئلة حول ميلفوس</custom-h1><p>أنشأ مجتمع المصدر المفتوح مؤخرًا MilMil - وهو روبوت دردشة للأسئلة الشائعة حول Milvus صممه مستخدمو Milvus ومن أجلهم. يتوفر MilMil على مدار الساعة طوال أيام الأسبوع على موقع <a href="https://milvus.io/">Milvus.io</a> للإجابة على الأسئلة الشائعة حول Milvus، قاعدة بيانات المتجهات مفتوحة المصدر الأكثر تقدمًا في العالم.</p>
<p>لا يساعد نظام الإجابة على الأسئلة هذا في حل المشاكل الشائعة التي يواجهها مستخدمو Milvus بسرعة أكبر فحسب، بل يحدد المشاكل الجديدة بناءً على ما يرسله المستخدمون. تتضمن قاعدة بيانات MilMil الأسئلة التي طرحها المستخدمون منذ إطلاق المشروع لأول مرة بموجب ترخيص مفتوح المصدر في عام 2019. يتم تخزين الأسئلة في مجموعتين، واحدة لميل ميلفوس 1.x وما قبلها وأخرى لميلفوس 2.0.</p>
<p>يتوفر MilMil حاليًا باللغة الإنجليزية فقط.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">كيف يعمل ميل ميل ميل ميل؟<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد MilMil على نموذج MilMil على نموذج <em>محولات الجمل/محوّلات الجمل/محوّلات التشابه-مبتكرات-مبتكرات-قاعدة-بنت-بيس-ف2</em> للحصول على تمثيلات متجهة لقاعدة بيانات الأسئلة الشائعة، ثم يتم استخدام Milvus لاسترجاع التشابه المتجه لإرجاع الأسئلة المتشابهة دلاليًا.</p>
<p>أولاً، يتم تحويل بيانات الأسئلة الشائعة إلى متجهات دلالية باستخدام نموذج معالجة اللغة الطبيعية (NLP). يتم بعد ذلك إدراج التضمينات في Milvus ويتم تعيين معرف فريد لكل منها. أخيرًا، يتم إدراج الأسئلة والأجوبة في PostgreSQL، وهي قاعدة بيانات علائقية، مع معرّفات المتجهات الخاصة بها.</p>
<p>عندما يرسل المستخدمون سؤالاً ما، يقوم النظام بتحويله إلى متجه خاصية باستخدام BERT. بعد ذلك، يبحث النظام في "ميلفوس" عن خمسة متجهات الأكثر تشابهًا مع متجه الاستعلام ويسترجع معرّفاتها. وأخيراً، يتم إرجاع الأسئلة والإجابات التي تتوافق مع معرّفات المتجهات المسترجعة إلى المستخدم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>System-process.png</span> </span></p>
<p>راجع مشروع <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">نظام الإجابة على الأسئلة</a> في معسكر ميلفوس التدريبي لاستكشاف الكود المستخدم لبناء روبوتات الدردشة الآلية للذكاء الاصطناعي.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">اسأل ميلميل عن ميلفوس<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>للدردشة مع ميلميل، انتقل إلى أي صفحة على <a href="https://milvus.io/">Milvus.io</a> وانقر على أيقونة الطائر في الزاوية اليمنى السفلى. اكتب سؤالك في مربع إدخال النص واضغط على إرسال. سيرد عليك ميل ميل ميل في أجزاء من الثانية! بالإضافة إلى ذلك، يمكن استخدام القائمة المنسدلة في الزاوية العلوية اليسرى للتبديل بين الوثائق التقنية للإصدارات المختلفة من ميلفوس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>Milvus-chatbot- الرمز.png</span> </span></p>
<p>بعد إرسال سؤال، يقوم الروبوت على الفور بإرجاع ثلاثة أسئلة مشابهة دلاليًا لسؤال الاستعلام. يمكنك النقر على "مشاهدة الإجابة" لتصفح الإجابات المحتملة لسؤالك، أو النقر على "مشاهدة المزيد" لعرض المزيد من الأسئلة المتعلقة ببحثك. إذا لم تتوفر إجابة مناسبة، انقر على "ضع ملاحظاتك هنا" لطرح سؤالك مع عنوان البريد الإلكتروني. ستصل المساعدة من مجتمع ميلفوس قريبًا!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>جرّب MilMil وأخبرنا برأيك. نرحب بجميع الأسئلة أو التعليقات أو أي شكل من أشكال التعليقات.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">لا تكن غريباً<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>ابحث أو ساهم في ميلفوس على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>تواصل معنا على <a href="https://twitter.com/milvusio">تويتر</a>.</li>
</ul>
