---
id: harness-engineering-ai-agents.md
title: 'هندسة التسخير: طبقة التنفيذ التي يحتاجها وكلاء الذكاء الاصطناعي بالفعل'
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  تقوم هندسة التسخير ببناء بيئة التنفيذ حول وكلاء الذكاء الاصطناعي المستقل. تعرف
  على ماهيته، وكيف استخدمه OpenAI، ولماذا يتطلب البحث الهجين.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>قام ميتشيل هاشيموتو ببناء شركة HashiCorp وشارك في إنشاء Terraform. في فبراير 2026، نشر هاشيموتو <a href="https://mitchellh.com/writing/my-ai-adoption-journey">منشورًا على مدونته</a> يصف فيه عادة طورها أثناء عمله مع وكلاء الذكاء الاصطناعي: في كل مرة يرتكب فيها الوكيل خطأً، كان يقوم بتصميم إصلاح دائم في بيئة الوكيل. وقد أطلق عليها اسم "هندسة التسخير". وفي غضون أسابيع، نشرت <a href="https://openai.com/index/harness-engineering/">OpenAI</a> <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">وAthropic</a> مقالات هندسية تتوسع في هذه الفكرة. وصل مصطلح <em>هندسة التسخير</em>.</p>
<p>كان له صدى لأنه يسمي مشكلة سبق أن واجهها كل مهندس يقوم ببناء <a href="https://zilliz.com/glossary/ai-agents">وكلاء الذكاء الاصطناعي</a>. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">هندسة التسخير</a> تعطيك مخرجات أفضل في دورة واحدة. هندسة السياق تدير ما يراه النموذج. ولكن لا يعالج أي منهما ما يحدث عندما يعمل الوكيل بشكل مستقل لساعات، ويتخذ مئات القرارات دون إشراف. هذه هي الفجوة التي تملأها هندسة التسخير - وهي تعتمد دائمًا تقريبًا على البحث الهجين (البحث الهجين بالنص الكامل والبحث الدلالي) للعمل.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">ما هي هندسة التسخير؟<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>هندسة التسخير هو نظام تصميم بيئة التنفيذ حول وكيل ذكاء اصطناعي مستقل. فهو يحدد الأدوات التي يمكن للوكيل أن يستدعيها، ومن أين يحصل على المعلومات، وكيف يتحقق من صحة قراراته الخاصة، ومتى يجب أن يتوقف.</p>
<p>لفهم سبب أهميتها، فكر في ثلاث طبقات لتطوير وكيل الذكاء الاصطناعي:</p>
<table>
<thead>
<tr><th>الطبقة</th><th>ما الذي يحسنه</th><th>النطاق</th><th>مثال</th></tr>
</thead>
<tbody>
<tr><td><strong>هندسة الموجهات</strong></td><td>ما تقوله للنموذج</td><td>تبادل واحد</td><td>أمثلة قليلة، مطالبات متسلسلة الأفكار</td></tr>
<tr><td><strong>هندسة السياق</strong></td><td>ما يمكن أن يراه النموذج</td><td><a href="https://zilliz.com/glossary/context-window">نافذة السياق</a></td><td>استرجاع المستندات، ضغط التاريخ</td></tr>
<tr><td><strong>هندسة التسخير</strong></td><td>العالم الذي يعمل فيه الوكيل</td><td>التنفيذ المستقل متعدد الساعات</td><td>الأدوات ومنطق التحقق من الصحة والقيود المعمارية</td></tr>
</tbody>
</table>
<p>تعمل<strong>هندسة التسخير</strong> على تحسين جودة المحادثة الواحدة - الصياغة والهيكل والأمثلة. محادثة واحدة ومخرج واحد</p>
<p>تدير<strong>هندسة السياق</strong> مقدار المعلومات التي يمكن للنموذج أن يراها في آن واحد - أي المستندات التي يجب استرجاعها، وكيفية ضغط السجل، وما الذي يتناسب مع نافذة السياق وما الذي يتم إسقاطه.</p>
<p>تبني<strong>هندسة التسخير</strong> العالم الذي يعمل فيه الوكيل. الأدوات، ومصادر المعرفة، ومنطق التحقق من الصحة، والقيود المعمارية - كل شيء يحدد ما إذا كان الوكيل يمكن أن يعمل بشكل موثوق عبر مئات القرارات دون إشراف بشري.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>ثلاث طبقات لتطوير وكيل الذكاء الاصطناعي: هندسة الموجهات تعمل على تحسين ما تقوله، وهندسة السياق تدير ما يراه النموذج، وهندسة التسخير تصمم بيئة التنفيذ</span> </span></p>
<p>تشكل الطبقتان الأوليان جودة الدور الواحد. أما الثالثة فتشكل ما إذا كان بإمكان الوكيل أن يعمل لساعات دون أن تراقبه.</p>
<p>هذه ليست مناهج متنافسة. إنها تقدم. ومع نمو قدرة الوكيل، ينتقل الفريق نفسه عبر الطبقات الثلاث - غالباً ضمن مشروع واحد.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">كيف استخدمت OpenAI هندسة التسخير لبناء قاعدة برمجيات مكونة من مليون سطر والدروس التي تعلموها<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>أجرت OpenAI تجربة داخلية تضع هندسة التسخير في مصطلحات ملموسة. وقد وصفوا ذلك في منشورهم الهندسي على مدونتهم الهندسية <a href="https://openai.com/index/harness-engineering/">"تسخير الهندسة: الاستفادة من الدستور البرمجي في عالم العميل أولاً".</a> بدأ فريق مكون من ثلاثة أشخاص بمستودع فارغ في أواخر أغسطس 2025. وعلى مدار خمسة أشهر، لم يكتبوا أي كود بأنفسهم، بل تم إنشاء كل سطر بواسطة Codex، وكيل الترميز المدعوم بالذكاء الاصطناعي من OpenAI. والنتيجة: مليون سطر من التعليمات البرمجية للإنتاج و1500 طلب سحب مدمج.</p>
<p>الجزء المثير للاهتمام ليس الناتج. بل في المشاكل الأربع التي واجهوها وحلول طبقة التسخير التي قاموا ببنائها.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">المشكلة 1: عدم وجود فهم مشترك لقاعدة البرمجة</h3><p>ما هي طبقة التجريد التي يجب أن يستخدمها الوكيل؟ ما هي اصطلاحات التسمية؟ أين وصلت مناقشة الهندسة المعمارية في الأسبوع الماضي؟ بدون إجابات، خمن الوكيل - وخمن بشكل خاطئ - مرارًا وتكرارًا.</p>
<p>كان التخمين الأول هو ملف واحد <code translate="no">AGENTS.md</code> يحتوي على كل اصطلاح وقاعدة وقرار تاريخي. وقد فشل لأربعة أسباب. السياق شحيح، وملف التعليمات المتضخم يزاحم المهمة الفعلية. عندما يتم وضع علامة على كل شيء مهم، لا شيء مهم. تتعفن الوثائق - تصبح القواعد من الأسبوع الثاني خاطئة بحلول الأسبوع الثامن. ولا يمكن التحقق من المستند المسطح ميكانيكيًا.</p>
<p>الحل: تقليص <code translate="no">AGENTS.md</code> إلى 100 سطر. لا قواعد - خريطة. يشير إلى دليل منظم <code translate="no">docs/</code> يحتوي على قرارات التصميم وخطط التنفيذ ومواصفات المنتج والمستندات المرجعية. تتحقق اللينترز و CI من أن الروابط المتقاطعة تبقى سليمة. ينتقل الوكيل إلى ما يحتاجه بالضبط.</p>
<p>المبدأ الأساسي: إذا لم يكن هناك شيء ما في السياق في وقت التشغيل، فهو غير موجود بالنسبة للوكيل.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">المشكلة 2: لم يتمكن ضمان الجودة البشري من مواكبة مخرجات الوكيل</h3><p>قام الفريق بتوصيل بروتوكول Chrome DevTools في Codex. يمكن للوكيل تصوير مسارات واجهة المستخدم ومراقبة أحداث وقت التشغيل والاستعلام عن السجلات باستخدام LogQL والمقاييس باستخدام PromQL. وضعوا عتبة محددة: كان يجب أن تبدأ الخدمة في أقل من 800 ميلي ثانية قبل اعتبار المهمة مكتملة. كانت مهام Codex تعمل لأكثر من ست ساعات متواصلة - عادةً أثناء نوم المهندسين.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">المشكلة 3: الانجراف المعماري بدون قيود</h3><p>بدون حواجز حماية، كان الوكيل يعيد إنتاج أي أنماط يجدها في الريبو - بما في ذلك الأنماط السيئة.</p>
<p>الحل: بنية صارمة متعددة الطبقات مع اتجاه تبعية واحد مفروض - الأنواع ← التكوين ← الريبو ← الخدمة ← وقت التشغيل ← واجهة المستخدم. فرضت البطانات المخصصة هذه القواعد ميكانيكيًا، مع رسائل خطأ تتضمن تعليمات الإصلاح المضمنة.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>بنية صارمة متعددة الطبقات مع التحقق من صحة التبعية في اتجاه واحد: الأنواع في القاعدة، وواجهة المستخدم في الأعلى، والمصنفات المخصصة تفرض القواعد مع اقتراحات الإصلاح المضمنة</span> </span></p>
<p>في فريق بشري، عادةً ما يصل هذا القيد إلى فريق بشري عندما تتوسع الشركة إلى مئات المهندسين. أما بالنسبة لوكيل الترميز، فهو شرط أساسي منذ اليوم الأول. كلما تحرك الوكيل بشكل أسرع دون قيود، كلما كان الانجراف المعماري أسوأ.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">المشكلة 4: الديون التقنية الصامتة</h3><p>الحل: ترميز المبادئ الأساسية للمشروع في المستودع، ثم تشغيل مهام Codex في الخلفية وفق جدول زمني للبحث عن الانحرافات وإرسال علاقات علاقات علاقات عامة لإعادة الهيكلة. تم دمج معظمها تلقائياً في غضون دقيقة واحدة - دفعات صغيرة مستمرة بدلاً من الحساب الدوري.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">لماذا لا يمكن لوكلاء الذكاء الاصطناعي تقييم عملهم الخاص بهم<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>أثبتت تجربة OpenAI أن تجربة تسخير الهندسة تعمل. لكن بحثاً منفصلاً كشف عن نمط فشل داخلها: الوكلاء سيئون بشكل منهجي في تقييم مخرجاتهم الخاصة.</p>
<p>تظهر المشكلة في شكلين.</p>
<p><strong>قلق السياق.</strong> عندما تمتلئ نافذة السياق، يبدأ الوكلاء في إنهاء المهام قبل الأوان - ليس لأن العمل قد تم إنجازه، ولكن لأنهم يشعرون باقتراب انتهاء النافذة. وقد <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">وثّق</a> فريق Cognition، وهو الفريق الذي يقف وراء وكيل ترميز الذكاء الاصطناعي Devin، <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">هذا السلوك</a> أثناء إعادة بناء Devin من أجل Claude Sonnet 4.5: أصبح النموذج مدركًا لنافذة السياق الخاصة به وبدأ في اتخاذ اختصارات قبل وقت طويل من نفاد المساحة فعليًا.</p>
<p>كان إصلاحهم هندسة تسخير خالصة. لقد قاموا بتمكين الإصدار التجريبي للسياق المكون من مليون رمز ولكن حددوا الاستخدام الفعلي بـ 200 ألف رمز - خداع النموذج للاعتقاد بأن لديه مساحة واسعة. اختفى القلق. لا حاجة لتغيير النموذج؛ مجرد بيئة أكثر ذكاءً.</p>
<p>التخفيف العام الأكثر شيوعًا هو الضغط: تلخيص السجل والسماح لنفس الوكيل بالاستمرار بسياق مضغوط. هذا يحافظ على الاستمرارية ولكنه لا يلغي السلوك الأساسي. البديل هو إعادة تعيين السياق: مسح النافذة، وتدوير مثيل جديد، وتسليم الحالة من خلال قطعة أثرية منظمة. هذا يزيل محفز القلق تمامًا ولكنه يتطلب وثيقة تسليم كاملة - الثغرات في القطعة الأثرية تعني ثغرات في فهم الوكيل الجديد.</p>
<p><strong>تحيز التقييم الذاتي.</strong> عندما يقوم الوكلاء بتقييم مخرجاتهم الخاصة، فإنهم يسجلون درجات عالية. حتى في المهام ذات معايير النجاح/الإخفاق الموضوعية، يكتشف الوكيل مشكلة ما، ويتحدث إلى نفسه معتقدًا أنها ليست خطيرة، ويوافق على العمل الذي يجب أن يفشل.</p>
<p>يستعير الحل من شبكات الخصومة التوليدية (شبكات الخصومة التوليدية): فصل المولد عن المقيّم تمامًا. في شبكة GAN، تتنافس شبكتان عصبيتان - واحدة تولد والأخرى تقيّم - وهذا التوتر الخصامي يفرض رفع الجودة. تنطبق نفس الديناميكية على <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">الأنظمة متعددة العوامل</a>.</p>
<p>اختبرت أنثروبيك هذا الأمر باستخدام مجموعة من ثلاثة وكلاء - المخطط والمولد والمقيّم - ضد وكيل منفرد في مهمة بناء محرك لعبة ثنائي الأبعاد ثنائي الأبعاد. وقد وصفوا التجربة الكاملة في <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"تصميم التسخير لتطوير التطبيقات طويلة المدى"</a> (أنثروبيك، 2026). يقوم المخطط بتوسيع موجه قصير إلى مواصفات منتج كاملة، ويترك تفاصيل التنفيذ غير محددة عمدًا - حيث يترتب على الإفراط في المواصفات المبكرة أخطاء في المراحل النهائية. يقوم المولد بتنفيذ الميزات في سباقات السرعة، ولكن قبل كتابة التعليمات البرمجية، يوقع عقدًا سريعًا مع المقيّم: تعريف مشترك لكلمة "تم". يستخدم المقيّم Playwright (إطار عمل أتمتة المتصفح المفتوح المصدر من Microsoft) للنقر على التطبيق مثل المستخدم الحقيقي، واختبار واجهة المستخدم وواجهة برمجة التطبيقات وسلوك قاعدة البيانات. إذا فشل أي شيء يفشل، تفشل العملية.</p>
<p>أنتج الوكيل المنفرد لعبة تم تشغيلها تقنيًا، لكن الاتصالات بين الكيانات ووقت التشغيل كانت معطلة على مستوى الكود - لا يمكن اكتشافها إلا من خلال قراءة المصدر. أنتج تسخير ثلاثي الوكلاء لعبة قابلة للتشغيل مع توليد مستوى بمساعدة الذكاء الاصطناعي ورسوم متحركة متحركة ومؤثرات صوتية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>مقارنة بين الوكيل المنفرد والتسخير ثلاثي الوكلاء: استغرق تشغيل الوكيل المنفرد 20 دقيقة بتكلفة تسعة دولارات مع وظائف أساسية معطلة، بينما استغرق تشغيل التسخير الكامل 6 ساعات بتكلفة مائتي دولار لإنتاج لعبة تعمل بكامل طاقتها مع ميزات مدعومة بالذكاء الاصطناعي</span> </span></p>
<p>كلفت البنية المكونة من ثلاثة وكلاء 20 ضعفًا تقريبًا. تجاوز الناتج من غير قابل للاستخدام إلى قابل للاستخدام. هذه هي المقايضة الأساسية التي تقوم بها هندسة التسخير: النفقات العامة الهيكلية مقابل الموثوقية.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">مشكلة الاسترجاع داخل كل تسخير عامل<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>يشترك كلا النمطين - نظام <code translate="no">docs/</code> الهيكلي ودورة سباق المولد/المقيّم - في تبعية صامتة: يجب على الوكيل أن يجد المعلومات الصحيحة من قاعدة معرفية حية ومتطورة عندما يحتاج إليها.</p>
<p>وهذا أصعب مما يبدو عليه الأمر. لنأخذ مثالًا ملموسًا: يقوم المولد بتنفيذ سبرينت 3، وهو تنفيذ مصادقة المستخدم. قبل كتابة التعليمات البرمجية، يحتاج إلى نوعين من المعلومات.</p>
<p>أولاً، استعلام <a href="https://zilliz.com/glossary/semantic-search">بحث دلالي</a>: <em>ما هي مبادئ تصميم هذا المنتج حول جلسات المستخدم؟</em> قد تستخدم الوثيقة ذات الصلة "إدارة الجلسات" أو "التحكم في الوصول" - وليس "مصادقة المستخدم". وبدون الفهم الدلالي، فإن الاسترجاع يغيب عن الاستعلام.</p>
<p>ثانيًا، استعلام المطابقة التامة: <em>ما هي المستندات التي تشير إلى الدالة <code translate="no">validateToken</code> ؟</em> اسم الدالة هو سلسلة اعتباطية بدون معنى دلالي. لا يمكن <a href="https://zilliz.com/glossary/vector-embeddings">للاسترجاع القائم على التضمين</a> العثور عليها بشكل موثوق. فقط مطابقة الكلمات الرئيسية تعمل.</p>
<p>يحدث هذان الاستعلامان في وقت واحد. لا يمكن فصلهما إلى خطوات متسلسلة.</p>
<p>يفشل <a href="https://zilliz.com/learn/vector-similarity-search">البحث المتجه</a> البحت في المطابقة التامة. يفشل <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> التقليدي في الاستعلامات الدلالية ولا يمكنه التنبؤ بالمفردات التي سيستخدمها المستند. قبل الإصدار Milvus 2.5، كان الخيار الوحيد هو نظاما استرجاع متوازيان - فهرس متجه <a href="https://milvus.io/docs/full-text-search.md">وفهرس نص كامل</a> - يعملان بشكل متزامن في وقت الاستعلام مع منطق دمج النتائج المخصص. بالنسبة لمستودع مباشر <code translate="no">docs/</code> مع تحديثات مستمرة، كان يجب أن يظل كلا الفهرسين متزامنين: كل تغيير في المستند يؤدي إلى إعادة الفهرسة في مكانين، مع وجود خطر مستمر من عدم الاتساق.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">كيف يحل برنامج Milvus 2.6 مشكلة استرجاع العميل باستخدام خط أنابيب هجين واحد<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus هي <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات متجهة</a> مفتوحة المصدر مصممة لأعباء عمل الذكاء الاصطناعي. يعمل Sparse-BM25 الخاص ب Milvus 2.6 على حل مشكلة الاسترجاع ثنائي الأنابيب في نظام واحد.</p>
<p>عند الاستيعاب، ينشئ Milvus تمثيلين في وقت واحد: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">تضمين كثيف</a> للاسترجاع الدلالي <a href="https://milvus.io/docs/sparse_vector.md">ومتجه متناثر مشفر بترميز TF</a> لتسجيل BM25. يتم تحديث <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">إحصائيات IDF</a> العالمية تلقائيًا عند إضافة المستندات أو إزالتها - لا توجد عمليات إعادة فهرسة يدوية. في وقت الاستعلام، يُنشئ إدخال اللغة الطبيعية كلا نوعي متجه الاستعلام داخليًا. تدمج <a href="https://milvus.io/docs/rrf-ranker.md">عملية دمج الرتب المتبادلة (RRF)</a> النتائج المصنفة، ويتلقى المتصل مجموعة نتائج واحدة موحدة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>قبل وبعد: نظامان منفصلان مع المزامنة اليدوية والنتائج المجزأة ومنطق الدمج المخصص مقابل خط أنابيب Milvus 2.6 الفردي مع التضمين الكثيف وBM25 المتفرّق ودمج RRF والصيانة التلقائية لـ IDF لإنتاج نتائج موحدة</span> </span></p>
<p>واجهة واحدة. فهرس واحد للصيانة.</p>
<p>في <a href="https://zilliz.com/glossary/beir">معيار BEIR</a> - وهو مجموعة تقييم قياسية تغطي 18 مجموعة بيانات استرجاع غير متجانسة - يحقق Milvus إنتاجية أعلى من Elasticsearch بمعدل 3-4 أضعاف من Elasticsearch عند الاستدعاء المكافئ، مع تحسين يصل إلى 7 أضعاف في الثانية في أعباء عمل محددة. بالنسبة لسيناريو السباق، يعثر استعلام واحد على كل من مبدأ تصميم الجلسة (المسار الدلالي) وكل مستند يذكر <code translate="no">validateToken</code> (المسار الدقيق). يتم تحديث مستودع <code translate="no">docs/</code> بشكل مستمر؛ وتعني صيانة BM25 IDF أن المستند المكتوب حديثًا يشارك في تسجيل الاستعلام التالي دون أي إعادة بناء دفعة واحدة.</p>
<p>هذه هي طبقة الاسترجاع المصممة لهذه الفئة من المشاكل بالضبط. عندما يحتاج تسخير الوكيل إلى البحث في قاعدة معرفية حية - وثائق التعليمات البرمجية وقرارات التصميم وسجل السبرنت - فإن البحث الهجين أحادي الخط ليس أمراً لطيفاً. إنه ما يجعل بقية التسخير يعمل.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">أفضل مكونات التسخير مصممة ليتم حذفها<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>كل مكون في التسخير يرمز إلى افتراض حول قيود النموذج. كان التحلل السريع ضروريًا عندما تفقد النماذج التماسك في المهام الطويلة. كانت إعادة تعيين السياق ضرورية عندما واجهت النماذج قلقًا بالقرب من حد النافذة. أصبحت عوامل المقيّم ضرورية عندما كان التحيز في التقييم الذاتي غير قابل للإدارة.</p>
<p>تنتهي صلاحية هذه الافتراضات. قد تصبح خدعة نافذة السياق-الإدراك غير ضرورية عندما تطور النماذج قدرة حقيقية على التحمل في سياق طويل. بينما تستمر النماذج في التحسن، ستصبح المكونات الأخرى غير ضرورية مع استمرار تحسن النماذج، ستصبح المكونات الأخرى غير ضرورية تبطئ الوكلاء دون إضافة موثوقية.</p>
<p>هندسة التسخير ليست بنية ثابتة. إنه نظام تتم إعادة معايرته مع كل إصدار نموذج جديد. السؤال الأول بعد أي ترقية رئيسية ليس "ما الذي يمكنني إضافته؟ بل "ما الذي يمكنني إزالته؟</p>
<p>ينطبق نفس المنطق على الاسترجاع. مع تعامل النماذج مع السياقات الأطول بشكل أكثر موثوقية، ستتغير استراتيجيات التجزئة وتوقيت الاسترجاع. قد تكون المعلومات التي تحتاج إلى تجزئة دقيقة اليوم قابلة للاستيعاب كصفحات كاملة غدًا. تتكيف البنية التحتية للاسترجاع جنبًا إلى جنب مع النموذج.</p>
<p>كل مكوّن في بنية تحتية جيدة البناء ينتظر أن يتم الاستغناء عنه بواسطة نموذج أكثر ذكاءً. هذه ليست مشكلة. هذا هو الهدف.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">ابدأ مع ميلفوس<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت تقوم ببناء بنية تحتية للوكيل تحتاج إلى استرجاع مختلط - البحث الدلالي والبحث بالكلمات الرئيسية في خط واحد - فإليك من أين تبدأ:</p>
<ul>
<li>اقرأ <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>ملاحظات الإصدار Milvus 2.6</strong></a> للحصول على التفاصيل الكاملة حول Sparse-BM25، والصيانة التلقائية لـ IDF، ومعايير الأداء.</li>
<li>انضم إلى <a href="https://milvus.io/community"><strong>مجتمع Milvus</strong></a> لطرح الأسئلة ومشاركة ما تقوم ببنائه.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>احجز جلسة مجانية في ساعات عمل Milvus المكتبية</strong></a> للتعرف على حالة استخدامك مع خبير في قاعدة بيانات المتجهات.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (Milvus المدارة بالكامل) تقدم مستوى مجاني للبدء مع أرصدة مجانية بقيمة 100 دولار عند التسجيل بالبريد الإلكتروني للعمل.</li>
<li>ضع نجمة لنا على GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - أكثر من 43 ألف نجمة وتتزايد.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتداولة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">ما هي هندسة التسخير وكيف تختلف عن الهندسة السريعة؟</h3><p>تعمل هندسة التسخير على تحسين ما تقوله للنموذج في تبادل واحد - الصياغة والهيكل والأمثلة. تقوم هندسة التسخير ببناء بيئة التنفيذ حول وكيل الذكاء الاصطناعي المستقل: الأدوات التي يمكنه استدعاؤها، والمعرفة التي يمكنه الوصول إليها، ومنطق التحقق من صحة عمله، والقيود التي تمنع الانجراف المعماري. هندسة التسخير تشكل دور محادثة واحدة. تشكل هندسة التسخير ما إذا كان بإمكان الوكيل أن يعمل بشكل موثوق لساعات عبر مئات القرارات دون إشراف بشري.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">لماذا يحتاج وكلاء الذكاء الاصطناعي إلى كل من البحث الموجه و BM25 في نفس الوقت؟</h3><p>يجب أن يجيب الوكلاء على استعلامين مختلفين اختلافاً جوهرياً في الاسترجاع في وقت واحد. الاستعلامات الدلالية - <em>ما هي مبادئ تصميمنا حول جلسات المستخدم؟</em> - تتطلب تضمينات متجهات كثيفة لمطابقة المحتوى المرتبط مفاهيميًا بغض النظر عن المفردات. استعلامات المطابقة التامة - <em>ما هي المستندات التي تشير إلى الدالة <code translate="no">validateToken</code> ؟</em> - تتطلب تسجيل الكلمات المفتاحية BM25، لأن أسماء الدوال عبارة عن سلاسل اعتباطية بدون معنى دلالي. نظام الاسترجاع الذي يتعامل مع أحد النمطين فقط سيفقد بشكل منهجي الاستعلامات من النوع الآخر.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">كيف يعمل نظام Milvus Sparse-BM25 لاسترجاع معرفة الوكيل؟</h3><p>عند الاستيعاب، ينشئ Milvus تضمينًا كثيفًا ومتجهًا متناثرًا مشفرًا بترميز TF لكل مستند في وقت واحد. يتم تحديث إحصائيات IDF العالمية في الوقت الفعلي مع تغير قاعدة المعرفة - لا يلزم إعادة الفهرسة اليدوية. في وقت الاستعلام، يتم إنشاء كلا النوعين من المتجهات داخليًا، ويقوم دمج الرتب المتبادل بدمج النتائج المصنفة، ويتلقى الوكيل مجموعة نتائج موحدة واحدة. يتم تشغيل خط الأنابيب بأكمله من خلال واجهة واحدة وفهرس واحد - وهو أمر بالغ الأهمية لقواعد المعرفة التي يتم تحديثها باستمرار مثل مستودع وثائق التعليمات البرمجية.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">متى يجب إضافة وكيل مقيِّم إلى مجموعة العوامل الخاصة بي؟</h3><p>أضف مُقيِّم منفصل عندما لا يمكن التحقق من جودة مخرجات المولد الخاص بك عن طريق الاختبارات الآلية وحدها، أو عندما يتسبب تحيز التقييم الذاتي في عدم التحقق من العيوب. المبدأ الأساسي: يجب أن يكون المقيِّم منفصلاً معماريًا عن المولد - فالسياق المشترك يعيد تقديم نفس التحيز الذي تحاول التخلص منه. يجب أن يكون لدى المقيّم إمكانية الوصول إلى أدوات وقت التشغيل (أتمتة المتصفح، ومكالمات واجهة برمجة التطبيقات، واستعلامات قاعدة البيانات) لاختبار السلوك، وليس فقط مراجعة التعليمات البرمجية. وقد وجد <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">بحث</a> أنثروبيك أن هذا الفصل المستوحى من شبكة GAN نقل جودة المخرجات من "إطلاق تقني ولكن معطل" إلى "يعمل بشكل كامل مع ميزات لم يحاول الوكيل المنفرد تجربتها".</p>
