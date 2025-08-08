---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: 'مراجعة GPT-5: الدقة ترتفع، والأسعار تنخفض، والشفرة قوية - لكنها سيئة للإبداع'
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  بالنسبة للمطورين، خاصةً أولئك الذين يقومون ببناء الوكلاء وخطوط أنابيب RAG، قد
  يكون هذا الإصدار هو الترقية الأكثر فائدة حتى الآن.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>بعد أشهر من التكهنات، قامت OpenAI أخيرًا بشحن</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> هذا النموذج ليس النموذج الإبداعي الصاعق الذي كان عليه GPT-4، ولكن بالنسبة للمطورين، خاصةً أولئك الذين يبنون وكلاء وخطوط أنابيب RAG، قد يكون هذا الإصدار بهدوء هو الترقية الأكثر فائدة حتى الآن.</p>
<p><strong>خلاصة القول للبناة:</strong> يوحّد GPT-5 البنى، ويزيد من شحنات الإدخال/الإخراج متعدد الوسائط، ويخفض معدلات الأخطاء الواقعية، ويوسع السياق إلى 400 ألف رمز ويجعل الاستخدام على نطاق واسع في متناول الجميع. ومع ذلك، فقد تراجع الإبداع والذوق الأدبي خطوة ملحوظة إلى الوراء.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">ما الجديد تحت الغطاء؟<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>النواة الموحّدة</strong> - تدمج السلسلة الرقمية GPT مع نماذج الاستدلال من السلسلة o، مما يوفر استدلالاً طويل السلسلة بالإضافة إلى متعدد الوسائط في بنية واحدة.</p></li>
<li><p><strong>طيف كامل متعدد الوسائط</strong> - إدخال/إخراج عبر النص والصورة والصوت والفيديو، كل ذلك ضمن نفس النموذج.</p></li>
<li><p><strong>مكاسب هائلة في الدقة</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% أخطاء واقعية أقل بنسبة 44% مقابل GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>: 78% أخطاء واقعية أقل مقابل o3.</p></li>
</ul></li>
<li><p><strong>تعزيزات في مهارات المجال</strong>: : أقوى في توليد الأكواد، والمنطق الرياضي، والاستشارات الصحية، والكتابة المنظمة؛ انخفضت الهلوسة بشكل ملحوظ.</p></li>
</ul>
<p>إلى جانب GPT-5، أصدر OpenAI أيضًا <strong>ثلاثة متغيرات إضافية،</strong> كل منها مُحسَّن لاحتياجات مختلفة:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>النموذج</strong></th><th><strong>الوصف</strong></th><th><strong>المدخلات / دولار لكل 1 مليون توكن</strong></th><th><strong>الإخراج / دولار لكل 1 مليون توكن</strong></th><th><strong>تحديث المعرفة</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>النموذج الرئيسي، المنطق طويل السلسلة + كامل متعدد الوسائط</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>مكافئ لـ gpt-5، المستخدم في محادثات ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>أرخص بنسبة 60%، ويحتفظ بحوالي 90% من أداء البرمجة</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>حافة / غير متصل، سياق 32K، زمن انتقال &lt;40 مللي ثانية</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>حطم GPT-5 الأرقام القياسية عبر 25 فئة معيارية - من إصلاح الأكواد البرمجية إلى التفكير متعدد الوسائط إلى المهام الطبية - مع تحسينات متسقة في الدقة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">لماذا يجب أن يهتم المطورون - خاصةً بالنسبة للمطوّرين والوكلاء<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>تشير اختباراتنا العملية إلى أن هذا الإصدار يمثل ثورة هادئة في مجال توليد الاسترجاع المعزز وسير العمل القائم على الوكلاء.</p>
<ol>
<li><p><strong>تخفيضات في الأسعار</strong> تجعل التجربة قابلة للتطبيق - تكلفة مدخلات واجهة برمجة التطبيقات: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1.25 لكل مليون</mn></mrow><annotation encoding="application/x-tex">توكن**؛</annotation><mrow><mi>تكلفة</mi><mi>الإخراج</mi><mo>:</mo></mrow></semantics></math></span></span></strong> <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>*∗∗1</mo></mrow><annotation encoding="application/x-tex">.25 لكل مليون توكن**؛ تكلفة الإخراج: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25</span><span class="mord">لكل مل</span></span><span class="base"><span class="mord mathnormal">يون توكينز</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span><span class="base"><span class="mord mathnormal"></span></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span><span class="base"><span class="mord mathnormal"></span></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mord mathnormal"> *</span></span></span></span></strong>* <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct"> ؛</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">تكلفة</span><span class="mord mathnormal">الإخراج</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">*∗10</span></span></span></span></strong>.</p></li>
<li><p>تسمح لك<strong>نافذة السياق 400 ألف</strong> في السياق (مقابل 128 ألف في o3/4o) بالحفاظ على الحالة عبر تدفقات عمل الوكيل المعقدة متعددة الخطوات دون تقطيع السياق.</p></li>
<li><p><strong>هلوسات أقل واستخدام أفضل للأداة</strong> - يدعم استدعاءات الأدوات متعددة الخطوات المتسلسلة، ويتعامل مع المهام المعقدة غير القياسية، ويحسن موثوقية التنفيذ.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">لا يخلو من العيوب<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>على الرغم من تقدمه التقني، لا يزال GPT-5 يُظهر حدوداً واضحة.</p>
<p>عند الإطلاق، تضمنت الكلمة الرئيسية ل OpenAI شريحة احتسبت بشكل غريب <em>52.8 &gt; 69.1 = 30.8،</em> وفي اختباراتنا الخاصة، كرر النموذج بثقة تفسير "تأثير برنولي" في الكتاب المدرسي - ولكن خاطئ - لرفع الطائرة - مما يذكرنا <strong>بأنه لا يزال متعلمًا للنمط وليس خبيرًا حقيقيًا في المجال.</strong></p>
<p><strong>في حين أن أداء العلوم والتكنولوجيا والهندسة والرياضيات قد ازدادت حدته، فقد تراجع العمق الإبداعي.</strong> لاحظ العديد من المستخدمين القدامى تراجعاً في الذوق الأدبي: الشعر يبدو أكثر تسطيحاً، والمحادثات الفلسفية أقل دقة، والسرد الطويل أكثر ميكانيكية. إن المفاضلة واضحة - دقة واقعية أعلى واستدلال أقوى في المجالات التقنية، ولكن على حساب النبرة الفنية الاستكشافية التي جعلت GPT ذات يوم يبدو بشريًا تقريبًا.</p>
<p>مع وضع ذلك في الاعتبار، دعونا نرى كيف كان أداء GPT-5 في اختباراتنا العملية.</p>
<h2 id="Coding-Tests" class="common-anchor-header">اختبارات البرمجة<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>بدأت بمهمة بسيطة: كتابة نص HTML يسمح للمستخدمين بتحميل صورة وتحريكها بالماوس. توقّف GPT-5 مؤقتًا لمدة تسع ثوانٍ تقريبًا، ثم أنتج كودًا عمليًا يتعامل مع التفاعل بشكل جيد. شعرت أنها بداية جيدة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كانت المهمة الثانية أصعب: تنفيذ كشف التصادم بين المضلع والكرة داخل شكل سداسي دوار، مع سرعة دوران قابلة للتعديل، ومرونة، وعدد الكرات. أنشأ GPT-5 الإصدار الأول في حوالي ثلاث عشرة ثانية. تضمنت الشيفرة جميع الميزات المتوقعة، ولكن كان بها أخطاء ولم تعمل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد ذلك استخدمت خيار <strong>إصلاح الأخطاء</strong> في المحرر، وصحح GPT-5 الأخطاء حتى يظهر الشكل السداسي. ومع ذلك، لم تظهر الكرات أبدًا - كان منطق التكاثر مفقودًا أو غير صحيح، مما يعني أن الوظيفة الأساسية للبرنامج كانت غائبة على الرغم من اكتمال الإعداد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>باختصار،</strong> يستطيع GPT-5 إنتاج شيفرة تفاعلية نظيفة وجيدة التنظيم والتعافي من أخطاء وقت التشغيل البسيطة. لكن في السيناريوهات المعقدة، لا يزال يخاطر بإغفال المنطق الأساسي، لذا فإن المراجعة البشرية والتكرار ضروريان قبل النشر.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">اختبار المنطق<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد طرحتُ لغزًا منطقيًا متعدد الخطوات يتضمن ألوان العناصر والأسعار والقرائن الموضعية - وهو أمر قد يستغرق من معظم البشر عدة دقائق لحلّه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>سؤال:</strong> <em>ما هو العنصر الأزرق وما هو سعره؟</em></p>
<p>أجاب GPT-5 بالإجابة الصحيحة في 9 ثوانٍ فقط، مع شرح واضح وسليم منطقياً. عزز هذا الاختبار قوة النموذج في التفكير المنظم والاستنتاج السريع.</p>
<h2 id="Writing-Test" class="common-anchor-header">اختبار الكتابة<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>غالبًا ما ألجأ إلى ChatGPT للمساعدة في المدونات ومنشورات وسائل التواصل الاجتماعي والمحتويات المكتوبة الأخرى، لذا فإن إنشاء النصوص هو أحد أكثر الإمكانيات التي أهتم بها. في هذا الاختبار، طلبت من GPT-5 إنشاء منشور على LinkedIn استنادًا إلى مدونة حول محلل متعدد اللغات في Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كان الناتج منظمًا بشكل جيد وأصاب جميع النقاط الرئيسية من المدونة الأصلية، لكنه بدا رسميًا ومتوقعًا للغاية - مثل بيان صحفي للشركة أكثر من كونه شيئًا يهدف إلى إثارة الاهتمام على الشبكات الاجتماعية. لقد افتقرت إلى الدفء والإيقاع والشخصية التي تجعل المنشور يبدو إنسانيًا وجذابًا.</p>
<p>على الجانب الإيجابي، كانت الرسوم التوضيحية المصاحبة ممتازة: واضحة، ومتوافقة مع العلامة التجارية، ومتماشية تمامًا مع أسلوب زيليز التقني. من الناحية البصرية، كان الأمر على ما يرام؛ الكتابة تحتاج فقط إلى المزيد من الطاقة الإبداعية لتتناسب معها.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">نافذة سياق أطول = موت RAG و VectorDB؟<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد تناولنا هذا الموضوع العام الماضي عندما <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">أطلقت Google <strong>Gemini 1.5 Pro</strong></a> مع نافذة السياق الطويلة للغاية التي يبلغ طولها 10 ملايين رمز. في ذلك الوقت، سارع بعض الأشخاص إلى التنبؤ بنهاية RAG - بل ونهاية قواعد البيانات تمامًا. وبالانتقال سريعًا إلى اليوم: لم يعد RAG حيًا فحسب، بل إنه يزدهر. من الناحية العملية، أصبحت <em>أكثر</em> قدرة وإنتاجية، إلى جانب قواعد البيانات المتجهة مثل <a href="https://milvus.io/"><strong>Milvus</strong></a> <a href="https://zilliz.com/cloud"><strong>وZilliz Cloud</strong></a>.</p>
<p>والآن، مع طول سياق GPT-5 الموسع وقدرات استدعاء الأدوات الأكثر تقدمًا، ظهر السؤال مرة أخرى: <em>هل ما زلنا بحاجة إلى قواعد بيانات المتجهات لاستيعاب السياق، أو حتى خطوط أنابيب مخصصة للوكلاء/مجموعة أدوات الاستدعاء؟</em></p>
<p><strong>الإجابة المختصرة: نعم بالتأكيد. ما زلنا بحاجة إليها.</strong></p>
<p>السياق الأطول مفيد، لكنه ليس بديلاً عن الاسترجاع المنظم. لا تزال الأنظمة متعددة الوكلاء في طريقها لتكون اتجاهًا معماريًا طويل الأجل - وغالبًا ما تحتاج هذه الأنظمة إلى سياق غير محدود تقريبًا. بالإضافة إلى ذلك، عندما يتعلق الأمر بإدارة البيانات الخاصة غير المهيكلة بشكل آمن، ستكون قاعدة البيانات المتجهة هي الحارس النهائي دائمًا.</p>
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
    </button></h2><p>بعد مشاهدة حدث إطلاق OpenAI وإجراء اختباراتي العملية، يبدو GPT-5 أقل شبهاً بقفزة دراماتيكية إلى الأمام وأكثر شبهاً بمزيج محسّن من نقاط القوة السابقة مع بعض الترقيات في مكانها الصحيح. هذا ليس أمراً سيئاً - إنها علامة على الحدود المعمارية وحدود جودة البيانات التي بدأت تواجهها النماذج الكبيرة.</p>
<p>وكما يقول المثل، فإن <em>الانتقادات الشديدة تأتي من التوقعات العالية</em>. إن أي خيبة أمل حول GPT-5 تأتي في الغالب من المعيار العالي جداً الذي وضعه OpenAI لنفسه. وفي الحقيقة - لا تزال الدقة الأفضل، والأسعار المنخفضة، والدعم المتكامل متعدد الوسائط، مكاسب قيّمة. بالنسبة للمطورين الذين يقومون ببناء وكلاء وخطوط أنابيب RAG، قد تكون هذه في الواقع الترقية الأكثر فائدة حتى الآن.</p>
<p>لقد كان بعض الأصدقاء يمزحون حول إنشاء "نصب تذكاري على الإنترنت" لـ GPT-4o، مدّعين أن شخصية رفيق الدردشة القديم قد اختفت إلى الأبد. أنا لا أمانع التغيير - قد يكون GPT-5 أقل دفئًا وثرثرة، لكن أسلوبه المباشر الذي لا معنى له يبدو واضحًا ومباشرًا بشكل منعش.</p>
<p><strong>ماذا عنك؟</strong> شاركنا بأفكارك - انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">Discord،</a> أو انضم إلى المحادثة على <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> <a href="https://x.com/milvusio">وX</a>.</p>
