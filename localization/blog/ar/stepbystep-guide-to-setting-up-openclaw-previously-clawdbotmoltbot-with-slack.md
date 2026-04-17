---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: دليل خطوة بخطوة لإعداد OpenClaw (Clawdbot/Moltbot سابقًا) مع Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: tutorials
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  دليل خطوة بخطوة لإعداد OpenClaw مع Slack. قم بتشغيل مساعد ذكاء اصطناعي ذاتي
  الاستضافة على جهاز Mac أو Linux - لا حاجة إلى سحابة.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>إذا كنت على تويتر التقني، أو هاكر نيوز، أو ديسكورد هذا الأسبوع، فقد رأيت ذلك. رمز تعبيري لسرطان البحر 🦞، ولقطات شاشة لمهام يتم إنجازها، وادعاء واحد جريء: ذكاء اصطناعي لا <em>يتحدث</em>فقط <em>- بل</em> <em>يفعل ذلك</em> بالفعل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أصبح الأمر أكثر غرابة خلال عطلة نهاية الأسبوع. فقد أطلق رائد الأعمال مات شليخت <a href="https://moltbook.com">Moltbook - وهو عبارة عن</a>شبكة اجتماعية على غرار Reddit حيث يمكن لوكلاء الذكاء الاصطناعي فقط النشر، ويمكن للبشر فقط المشاهدة. وفي غضون أيام، اشترك أكثر من 1.5 مليون عميل. وشكلوا مجتمعات وناقشوا الفلسفة وتذمروا من مشغليهم من البشر، بل وأسسوا ديانتهم الخاصة التي أطلقوا عليها اسم "Crustafarianism". نعم، حقًا.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>مرحبًا بكم في جنون OpenClaw.</p>
<p>الضجيج حقيقي لدرجة أن أسهم Cloudflare قفزت بنسبة 14% لمجرد أن المطورين يستخدمون بنيتها التحتية لتشغيل التطبيقات. وأفادت التقارير أن مبيعات Mac Mini ارتفعت حيث يشتري الناس أجهزة مخصصة لموظف الذكاء الاصطناعي الجديد. وريبو GitHub؟ أكثر من <a href="https://github.com/openclaw/openclaw">150,000 نجمة</a> في أسابيع قليلة فقط.</p>
<p>لذا، كان من الطبيعي أن نوضح لك كيفية إعداد مثيل OpenClaw الخاص بك - وتوصيله ب Slack حتى تتمكن من التحكم في مساعد الذكاء الاصطناعي الخاص بك من تطبيق المراسلة المفضل لديك.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">ما هو OpenClaw؟<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (المعروف سابقًا باسم Clawdbot/Moltbot) هو وكيل ذكاء اصطناعي مفتوح المصدر ومستقل يعمل محليًا على أجهزة المستخدم وينفذ مهام العالم الحقيقي عبر تطبيقات المراسلة مثل واتساب وتيليجرام وديسكورد. وهو يقوم بأتمتة سير العمل الرقمي - مثل إدارة رسائل البريد الإلكتروني أو تصفح الويب أو جدولة الاجتماعات - من خلال الاتصال بتطبيقات المراسلة مثل Claude أو ChatGPT.</p>
<p>باختصار، إنه باختصار يشبه وجود مساعد رقمي على مدار الساعة طوال أيام الأسبوع يمكنه التفكير والاستجابة وإنجاز المهام بالفعل.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">إعداد OpenClaw كمساعد ذكاء اصطناعي قائم على Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>تخيل وجود روبوت في مساحة عمل Slack الخاصة بك يمكنه الإجابة على الفور عن الأسئلة المتعلقة بمنتجك، أو المساعدة في تصحيح مشكلات المستخدم، أو توجيه أعضاء الفريق إلى الوثائق الصحيحة - دون أن يضطر أي شخص إلى إيقاف ما يفعله. بالنسبة لنا، يمكن أن يعني ذلك دعمًا أسرع لمجتمع Milvus: روبوت يجيب على الأسئلة الشائعة ("كيف يمكنني إنشاء مجموعة؟")، أو يساعد في استكشاف الأخطاء وإصلاحها، أو يلخص ملاحظات الإصدار عند الطلب. أما بالنسبة لفريقك، فقد يكون ذلك بالنسبة لفريقك هو تأهيل المهندسين الجدد، أو التعامل مع الأسئلة الشائعة الداخلية، أو أتمتة مهام DevOps المتكررة. حالات الاستخدام مفتوحة على مصراعيها.</p>
<p>في هذا البرنامج التعليمي، سنتعرف في هذا البرنامج التعليمي على الأساسيات: تثبيت OpenClaw على جهازك وتوصيله ب Slack. وبمجرد الانتهاء من ذلك، سيكون لديك مساعد ذكاء اصطناعي فعال جاهز للتخصيص لأي شيء تحتاجه.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li><p>جهاز ماك أو لينكس</p></li>
<li><p><a href="https://console.anthropic.com/">مفتاح واجهة برمجة تطبيقات أنثروبيك</a> (أو الوصول إلى كلود كود CLI)</p></li>
<li><p>مساحة عمل سلاك حيث يمكنك تثبيت التطبيقات</p></li>
</ul>
<p>هذا كل شيء. لنبدأ.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">الخطوة 1: تثبيت OpenClaw</h3><p>قم بتشغيل المثبت:</p>
<p>كيرل -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>عندما يُطلب منك ذلك، اختر <strong>نعم</strong> للمتابعة.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ثم اختر وضع <strong>QuickStart</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">الخطوة 2: اختر LLM الخاص بك</h3><p>سيطلب منك المثبت اختيار موفر نموذج. نحن نستخدم أنثروبيك مع كلود كود CLI للمصادقة.</p>
<ol>
<li>اختر <strong>أنثروبيك</strong> كمزود  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>أكمل عملية التحقق في متصفحك عندما يُطلب منك ذلك.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>اختر <strong>Anthropic/claude-claude-opus-4-5-20251101</strong> كنموذج افتراضي  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">الخطوة 3: إعداد Slack</h3><p>عندما يُطلب منك تحديد قناة، اختر <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تابع تسمية الروبوت الخاص بك. أطلقنا على روبوتنا اسم "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ستحتاج الآن إلى إنشاء تطبيق Slack والحصول على رمزين مميزين. إليك الطريقة:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 إنشاء تطبيق Slack</strong></p>
<p>انتقل إلى <a href="https://api.slack.com/apps?new_app=1">موقع Slack API على الويب</a> وأنشئ تطبيقًا جديدًا من البداية.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أعطه اسمًا وحدد مساحة العمل التي تريد استخدامها.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 قم بتعيين أذونات الروبوت</strong></p>
<p>في الشريط الجانبي، انقر على <strong>OAuth &amp; Permissions</strong>. مرر لأسفل إلى <strong>نطاقات الرمز المميز للروبوت</strong> وأضف الأذونات التي يحتاجها الروبوت الخاص بك.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 تمكين وضع المقبس</strong></p>
<p>انقر على <strong>وضع المقبس</strong> في الشريط الجانبي وقم بتشغيله.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>سيؤدي هذا إلى إنشاء <strong>رمز مميز على مستوى التطبيق</strong> (يبدأ ب <code translate="no">xapp-</code>). انسخه في مكان آمن.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 تمكين اشتراكات الأحداث</strong></p>
<p>انتقل إلى <strong>اشتراكات الأحداث</strong> وقم بتبديلها.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ثم اختر الأحداث التي يجب أن يشترك فيها الروبوت الخاص بك.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 تثبيت التطبيق</strong></p>
<p>انقر على <strong>تثبيت التطبيق</strong> في الشريط الجانبي، ثم <strong>اطلب التثبيت</strong> (أو قم بالتثبيت مباشرةً إذا كنت مسؤول مساحة العمل).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد الموافقة، سترى <strong>رمز OAuth Token لمستخدم الر</strong> وبوت الخاص بك (يبدأ بـ <code translate="no">xoxb-</code>). انسخ هذا أيضًا.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">الخطوة 4: تكوين OpenClaw</h3><p>العودة إلى OpenClaw CLI:</p>
<ol>
<li><p>أدخل <strong>رمز المصادقة المميز</strong> لمستخدم <strong>البوت</strong> الخاص بك (<code translate="no">xoxb-...</code>)</p></li>
<li><p>أدخل <strong>الرمز المميز لمستوى التطبيق</strong> الخاص بك (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>حدد قنوات Slack التي يمكن للبوت الوصول إليها  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>تخطي تكوين المهارات في الوقت الحالي - يمكنك دائمًا إضافتها لاحقًا  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>حدد <strong>إعادة التشغيل</strong> لتطبيق التغييرات</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">الخطوة 5: جربه</h3><p>توجه إلى Slack وأرسل رسالة إلى الروبوت الخاص بك. إذا تم إعداد كل شيء بشكل صحيح، سيستجيب OpenClaw وسيكون جاهزًا لتشغيل المهام على جهازك.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">نصائح</h3><ol>
<li>قم بتشغيل <code translate="no">clawdbot dashboard</code> لإدارة الإعدادات من خلال واجهة الويب  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>إذا حدث خطأ ما، تحقق من السجلات لمعرفة تفاصيل الخطأ  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">كلمة تحذير<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw قوي - ولهذا السبب بالضبط يجب أن تكون حذراً. "في الواقع يفعل أشياء" يعني أنه يمكنه تنفيذ أوامر حقيقية على جهازك. هذا هو بيت القصيد، لكن الأمر ينطوي على مخاطر.</p>
<p><strong>الأخبار الجيدة:</strong></p>
<ul>
<li><p>إنه مفتوح المصدر، لذا فإن الشيفرة البرمجية قابلة للتدقيق</p></li>
<li><p>يعمل محليًا، لذا فإن بياناتك ليست على خادم شخص آخر</p></li>
<li><p>أنت تتحكم في الأذونات التي يمتلكها</p></li>
</ul>
<p><strong>الأخبار غير الجيدة:</strong></p>
<ul>
<li><p>يُعدّ حقن الموجه خطرًا حقيقيًا - من المحتمل أن تخدع الرسالة الخبيثة الروبوت لتشغيل أوامر غير مقصودة</p></li>
<li><p>لقد أنشأ المحتالون بالفعل عمليات ريبو ورموز مزيفة على OpenClaw، لذا كن حذرًا مما تقوم بتنزيله</p></li>
</ul>
<p><strong>نصيحتنا:</strong></p>
<ul>
<li><p>لا تشغل هذا على جهازك الأساسي. استخدم جهازًا افتراضيًا أو حاسوبًا محمولًا احتياطيًا أو خادمًا مخصصًا.</p></li>
<li><p>لا تمنح أذونات أكثر مما تحتاج إليه.</p></li>
<li><p>لا تستخدم هذا في الإنتاج بعد. إنه جديد. تعامل معه على أنه تجربة.</p></li>
<li><p>التزم بالمصادر الرسمية: <a href="https://x.com/openclaw">@openclaw</a> على X <a href="https://github.com/openclaw">وOpenClaw</a>.</p></li>
</ul>
<p>بمجرد أن تعطي LLM القدرة على تنفيذ الأوامر، لا يوجد شيء آمن 100%. هذه ليست مشكلة OpenClaw - هذه هي طبيعة الذكاء الاصطناعي العميل. فقط كن ذكيًا حيال ذلك.</p>
<h2 id="Whats-Next" class="common-anchor-header">ما التالي؟<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>تهانينا! لديك الآن مساعد ذكاء اصطناعي محلي يعمل على البنية التحتية الخاصة بك، ويمكن الوصول إليه من خلال Slack. تظل بياناتك ملكاً لك، ولديك مساعد لا يكلّ ولا يملّ جاهز لأتمتة الأمور المتكررة.</p>
<p>من هنا، يمكنك</p>
<ul>
<li><p>تثبيت المزيد من <a href="https://docs.molt.bot/skills">المهارات</a> لتوسيع ما يمكن لـ OpenClaw القيام به</p></li>
<li><p>إعداد المهام المجدولة بحيث تعمل بشكل استباقي</p></li>
<li><p>ربط منصات المراسلة الأخرى مثل تيليجرام أو ديسكورد</p></li>
<li><p>استكشاف منظومة <a href="https://milvus.io/">ميلفوس</a> لإمكانيات البحث بالذكاء الاصطناعي</p></li>
</ul>
<p><strong>هل لديك أسئلة أو تريد مشاركة ما تقوم ببنائه؟</strong></p>
<ul>
<li><p>انضم إلى <a href="https://milvus.io/slack">مجتمع ميلفوس سلاك</a> للتواصل مع مطورين آخرين</p></li>
<li><p>احجز <a href="https://milvus.io/office-hours">ساعات عمل Milvus المكتبية</a> للحصول على أسئلة وأجوبة مباشرة مع الفريق</p></li>
</ul>
<p>قرصنة سعيدة! 🦞</p>
