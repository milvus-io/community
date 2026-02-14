---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 مقابل MiniMax M2.5 مقابل Gemini 3 Deep Think: ما النموذج الذي يناسب
  مجموعة عملاء الذكاء الاصطناعي لديك؟
author: 'Lumina Wang, Julie Xie'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  مقارنة عملية بين GLM-5 وMiniMax M2.5 وGemini 3 Deep Think للبرمجة والاستدلال
  ووكلاء الذكاء الاصطناعي. يتضمن برنامج تعليمي RAG مع ميلفوس.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>في غضون يومين فقط، تم طرح ثلاثة نماذج رئيسية متتالية: GLM-5، وMiniMax M2.5، وGemini 3 Deep Think. تتصدر النماذج الثلاثة نفس الإمكانيات: <strong>الترميز، والتفكير العميق، وسير العمل العميل.</strong> ويدعي الثلاثة جميعهم تحقيق أحدث النتائج. إذا حدَّقت في أوراق المواصفات، يمكنك تقريبًا أن تلعب لعبة مطابقة وتزيل نقاط الحديث المتطابقة في الثلاثة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الفكرة الأكثر رعباً؟ من المحتمل أن يكون رئيسك في العمل قد اطلع بالفعل على الإعلانات ويتحرق شوقاً لأن تقوم ببناء تسعة تطبيقات داخلية باستخدام النماذج الثلاثة قبل انتهاء الأسبوع.</p>
<p>فما الذي يميز هذه النماذج عن بعضها البعض؟ وكيف يجب عليك الاختيار بينها؟ و (كما هو الحال دائمًا) كيف يمكنك ربطها مع <a href="https://milvus.io/">ميلفوس</a> لشحن قاعدة معرفية داخلية؟ ضع إشارة مرجعية على هذه الصفحة. فهي تحتوي على كل ما تحتاجه.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">لمحة سريعة عن GLM-5 وMiniMax M2.5 وGemini 3 Deep Think في لمحة سريعة<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">يتصدر GLM-5 في هندسة الأنظمة المعقدة ومهام الوكيل طويل المدى</h3><p>في 12 فبراير، أطلقت شركة Zhipu رسميًا نموذج GLM-5، الذي يتفوق في هندسة الأنظمة المعقدة ومهام سير عمل الوكلاء طويلة المدى.</p>
<p>يحتوي النموذج على 355B-744B معلمة (40B نشطة)، تم تدريبها على 28.5T توكين. وهو يدمج آليات انتباه متناثرة مع إطار عمل للتعلم المعزز غير المتزامن يسمى Slime، مما يمكّنه من التعامل مع السياقات الطويلة للغاية دون فقدان الجودة مع الحفاظ على انخفاض تكاليف النشر.</p>
<p>تصدرت GLM-5 الحزمة مفتوحة المصدر في المعايير الرئيسية، حيث احتلت المرتبة الأولى في اختبار SWE-bench Verified (77.8) والمرتبة الأولى في اختبار Terminal Bench 2.0 (56.2) - متقدمة على MiniMax 2.5 وGemini 3 Deep Think. ومع ذلك، لا تزال نتائجه الرئيسية تتخلف عن أفضل النماذج المغلقة المصدر مثل Claude Opus 4.5 و GPT-5.2. في Vending Bench 2، وهو تقييم لمحاكاة الأعمال، حقق GLM-5 أرباحًا سنوية بالمحاكاة بلغت 4432 دولارًا، مما يضعه تقريبًا في نفس نطاق الأنظمة المغلقة المصدر.</p>
<p>كما أدخلت GLM-5 أيضًا ترقيات كبيرة على هندسة النظام وقدرات الوكيل طويل المدى. ويمكنه الآن تحويل النصوص أو المواد الخام مباشرةً إلى ملفات .docx و .pdf و .xlsx، وإنشاء مخرجات محددة مثل مستندات متطلبات المنتج وخطط الدروس والامتحانات وجداول البيانات والتقارير المالية والمخططات الانسيابية والقوائم.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think يضع معيارًا جديدًا للتفكير العلمي</h3><p>في الساعات الأولى من يوم 13 فبراير 2026، أصدرت Google رسميًا Gemini 3 Deep Think، وهو ترقية رئيسية سأطلق عليها (مبدئيًا) أقوى نموذج للبحث والاستدلال على هذا الكوكب. ففي النهاية، كان Gemini هو النموذج الوحيد الذي اجتاز اختبار غسيل السيارات: "<em>أريد أن أغسل سيارتي ومغسلة السيارات على بعد 50 مترًا فقط. هل أشغل سيارتي وأقودها إلى هناك أم أم أمشي فقط؟</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تكمن قوتها الأساسية في الأداء المنطقي والتنافسي من الدرجة الأولى: فقد وصلت إلى 3455 Elo على Codeforces، أي ما يعادل ثامن أفضل مبرمج تنافسي في العالم. وقد وصل إلى مستوى الميدالية الذهبية في الأجزاء الكتابية من أولمبياد الفيزياء والكيمياء والرياضيات الدولي لعام 2025. كفاءة التكلفة هي إنجاز آخر. إذ يعمل ARC-AGI-1 بسعر 7.17 دولار فقط لكل مهمة، أي بتخفيض يتراوح بين 280 ضعفاً و420 ضعفاً مقارنةً بـ o3-preview من OpenAI قبل 14 شهراً. على الجانب التطبيقي، تتمثل أكبر مكاسب Deep Think في البحث العلمي. حيث يستخدمه الخبراء بالفعل في مراجعة الأقران لأوراق الرياضيات الاحترافية ولتحسين سير عمل تحضير نمو البلورات المعقدة.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">يتنافس MiniMax M2.5 على التكلفة والسرعة في أعباء عمل الإنتاج</h3><p>في اليوم نفسه، أصدرت MiniMax الإصدار M2.5، مما جعله بطل التكلفة والكفاءة لحالات استخدام الإنتاج.</p>
<p>وباعتباره واحدًا من أسرع عائلات الطرازات في الصناعة، فإن M2.5 يحقق نتائج جديدة في مجال البرمجة واستدعاء الأدوات والبحث والإنتاجية المكتبية. التكلفة هي أكبر نقطة بيع لها: يعمل الإصدار السريع بسرعة 100 TPS تقريبًا، حيث يبلغ سعر المدخلات <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>30</mi><mn>لكل مليون</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">توكين</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>والإخراج 0</mn></mrow><annotation encoding="application/x-tex">.30 لكل مليون توكين والإخراج</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30 لكل مليون توكين والإخراج</span><span class="mord mathnormal">2</span></span></span></span>.40 لكل مليون توكين. يقلل الإصدار 50 TPS من تكلفة الإنتاج بمقدار النصف الآخر. تحسّنت السرعة بنسبة 37% مقارنةً بالإصدار M2.1 السابق، ويُكمل المهام التي تم التحقق منها في اختبار SWE في متوسط 22.8 دقيقة، وهو ما يتطابق تقريبًا مع كلود أوبوس 4.6. من ناحية القدرات، يدعم M2.5 تطوير المكدس الكامل بأكثر من 10 لغات، بما في ذلك Go وRust وKotlin، ويغطي كل شيء بدءاً من تصميم النظام من صفر إلى واحد إلى المراجعة الكاملة للأكواد. بالنسبة لسير العمل المكتبي، تتكامل ميزة المهارات المكتبية بعمق مع Word وPPT وExcel. وعند دمجها مع معرفة المجال في التمويل والقانون، يمكنها إنشاء تقارير بحثية ونماذج مالية جاهزة للاستخدام المباشر.</p>
<p>هذه هي النظرة العامة رفيعة المستوى. بعد ذلك، دعونا نلقي نظرة على كيفية أدائها الفعلي في الاختبارات العملية.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">مقارنات عملية<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">عرض المشهد ثلاثي الأبعاد: ينتج Gemini 3 Deep Think أكثر النتائج واقعية</h3><p>لقد أخذنا مطالبة اختبرها المستخدمون بالفعل على Gemini 3 Deep Think وقمنا بتشغيلها من خلال GLM-5 و MiniMax M2.5 لإجراء مقارنة مباشرة. المطالبة: إنشاء مشهد كامل من Three.js في ملف HTML واحد يعرض غرفة داخلية ثلاثية الأبعاد بالكامل لا يمكن تمييزها عن لوحة زيتية كلاسيكية في متحف.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الجوزاء 3 التفكير العميق</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>ميني ماكس M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>حقق<strong>Gemini 3 Deep Think</strong> أقوى نتيجة. فقد ترجمت المطالبة بدقة وأنشأت مشهدًا ثلاثي الأبعاد عالي الجودة. كانت الإضاءة هي الأبرز: بدا اتجاه الظل وتراجعه طبيعيًا، حيث نقل بوضوح العلاقة المكانية للضوء الطبيعي القادم من النافذة. كانت التفاصيل الدقيقة مثيرة للإعجاب أيضًا، بما في ذلك الملمس النصف ذائب للشموع وجودة المواد المستخدمة في الأختام الشمعية الحمراء. كانت الدقة البصرية بشكل عام عالية.</p>
<p>أنتج<strong>GLM-5</strong> نمذجة مفصلة للأجسام ونسيجًا تفصيليًا، لكن نظام الإضاءة الخاص به كان به مشاكل ملحوظة. ظهرت ظلال الطاولة ككتل صلبة سوداء نقية دون انتقالات ناعمة. بدا ختم الشمع وكأنه يطفو فوق سطح الطاولة، وفشل في التعامل مع علاقة التلامس بين الأجسام وسطح الطاولة بشكل صحيح. تشير هذه القطع الأثرية إلى وجود مجال للتحسين في الإضاءة العامة والمنطق المكاني.</p>
<p>لم يتمكن<strong>MiniMax M2.5</strong> من تحليل وصف المشهد المعقد بشكل فعال. كان الناتج مجرد حركة جسيمات مضطربة، مما يشير إلى وجود قيود كبيرة في كل من الفهم والتوليد عند التعامل مع التعليمات الدلالية متعددة الطبقات مع متطلبات بصرية دقيقة.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">توليد SVG: جميع النماذج الثلاثة تتعامل معه بشكل مختلف</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>موجه:</strong> أنشئ صورة SVG لبجع بني كاليفورنيا يركب دراجة. يجب أن تحتوي الدراجة على قضبان وإطار دراجة بشكل صحيح. يجب أن يكون للبجعة جرابها الكبير المميز، ويجب أن يكون هناك إشارة واضحة للريش. يجب أن يكون البجع يقود الدراجة بشكل واضح. يجب أن تظهر الصورة ريش التكاثر الكامل للبجع البني في كاليفورنيا.</p>
<p><strong>الجوزاء 3 التفكير العميق</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>الجوزاء 3 ديب ثينك</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>ميني ماكس M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>ميني ماكس M2.5</span> </span></p>
<p>أنتج<strong>جيمني 3 ديب ثينك Gemini 3 ديب ثينك</strong> أكثر مجموعة SVG اكتمالاً بشكل عام. وضعية ركوب البجعة دقيقة: يستقر مركز ثقلها بشكل طبيعي على المقعد، وتستقر قدماها على الدواسات في وضعية ركوب الدراجات الديناميكية. نسيج الريش مفصل ومتعدد الطبقات. نقطة الضعف الوحيدة هي أن الحقيبة الحلقية المميزة للبجعة مرسومة بشكل كبير للغاية، مما يؤدي إلى إبعاد النسب الكلية قليلاً.</p>
<p>كان لدى<strong>GLM-5</strong> مشاكل ملحوظة في الوضعية. يتم وضع القدمين بشكل صحيح على الدواسات، لكن وضعية الجلوس بشكل عام تبتعد عن وضعية الركوب الطبيعية، وتبدو العلاقة بين الجسم والمقعد غير واضحة. ومع ذلك، فإن تفاصيلها متينة: إن كيس الحلق متناسب بشكل جيد، وجودة نسيج الريش محترمة.</p>
<p>اتبعت<strong>MiniMax M2.5</strong> أسلوبًا بسيطًا وتخطت عناصر الخلفية تمامًا. موضع البجعة على الدراجة صحيح تقريبًا، لكن التفاصيل لا تفي بالغرض. المقاود ذات الشكل الخاطئ، وملمس الريش غير موجود تقريبًا، والرقبة سميكة جدًا، وهناك قطع بيضاوية بيضاء شاردة في الصورة لا ينبغي أن تكون موجودة.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">كيفية الاختيار بين GLM-5 و MiniMax M2.5 و Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>عبر جميع اختباراتنا، كانت MiniMax M2.5 الأبطأ في توليد المخرجات، حيث تطلبت أطول وقت للتفكير والاستنتاج. كان أداء GLM-5 متسقًا وكان متساويًا تقريبًا مع Gemini 3 Deep Think في السرعة.</p>
<p>إليك دليل اختيار سريع وضعناه معًا:</p>
<table>
<thead>
<tr><th>حالة الاستخدام الأساسية</th><th>النموذج الموصى به</th><th>نقاط القوة الرئيسية</th></tr>
</thead>
<tbody>
<tr><td>البحث العلمي والتفكير المتقدم (الفيزياء والكيمياء والرياضيات وتصميم الخوارزميات المعقدة)</td><td>الجوزاء 3 التفكير العميق</td><td>الأداء الحائز على الميدالية الذهبية في المسابقات الأكاديمية. التحقق من البيانات العلمية من الدرجة الأولى. برمجة تنافسية عالمية المستوى على Codeforces. تطبيقات بحثية مثبتة، بما في ذلك تحديد العيوب المنطقية في الأوراق البحثية الاحترافية. (يقتصر حاليًا على مشتركي Google AI Ultra ومستخدمي المؤسسات المختارة؛ تكلفة كل مهمة مرتفعة نسبيًا).</td></tr>
<tr><td>نشر مفتوح المصدر، وتخصيص الشبكة الداخلية للمؤسسات، والتطوير المتكامل، وتكامل المهارات المكتبية</td><td>Zhipu GLM-5</td><td>النموذج مفتوح المصدر الأعلى تصنيفًا. قدرات هندسية قوية على مستوى النظام. يدعم النشر المحلي بتكاليف يمكن التحكم فيها.</td></tr>
<tr><td>أعباء العمل الحساسة من حيث التكلفة، والبرمجة متعددة اللغات، والتطوير عبر المنصات (ويب/أندرويد/iOS/ويندوز)، والتوافق المكتبي</td><td>ميني ماكس M2.5</td><td>عند 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>30</mi><mn>لكل مليون</mn></mrow><annotation encoding="application/x-tex">رمز إدخال و0.30 لكل مليون رمز إخراج،</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">30</span><span class="mord">لكل مليون</span></span></span></span>رمز إخراج، <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct"> و2</span></span></span></span>.40 لكل مليون رمز إخراج. SOTA عبر معايير المكتب والترميز واستدعاء الأدوات. احتلت المرتبة الأولى في معيار Multi-SWE-Bench. تعميم قوي. تجاوزت معدلات النجاح في Droid/OpenCode كلود أوبوس 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">برنامج RAG التعليمي: توصيل GLM-5 مع ميلفوس لقاعدة المعرفة<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>يتوفر كل من GLM-5 وMiniMax M2.5 من خلال <a href="https://openrouter.ai/">OpenRouter</a>. قم بالتسجيل وإنشاء <code translate="no">OPENROUTER_API_KEY</code> للبدء.</p>
<p>يستخدم هذا البرنامج التعليمي GLM-5 من Zhipu كمثال على LLM. لاستخدام MiniMax بدلاً من ذلك، ما عليك سوى تبديل اسم النموذج إلى <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">التبعيات وإعداد البيئة</h3><p>قم بتثبيت أو ترقية كل من pymilvus و openai و requests و tqdm إلى أحدث إصداراتها:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>يستخدم هذا البرنامج التعليمي GLM-5 كنموذج LLM ونموذج التضمين النصي OpenAI- تضمين النص 3-صغير كنموذج تضمين.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">إعداد البيانات</h3><p>سوف نستخدم صفحات الأسئلة الشائعة من وثائق Milvus 2.4.x كقاعدة معرفية خاصة بنا.</p>
<p>قم بتنزيل الملف المضغوط واستخرج المستندات في مجلد <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>قم بتحميل جميع ملفات Markdown من <code translate="no">milvus_docs/en/faq</code>. قمنا بتقسيم كل ملف على <code translate="no">&quot;# &quot;</code> لفصل المحتوى تقريبًا حسب الأقسام الرئيسية:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM وإعداد نموذج التضمين</h3><p>سوف نستخدم GLM-5 كنموذج LLM ونموذج التضمين النصي 3-صغير كنموذج التضمين:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>توليد تضمين اختباري وطباعة أبعاده وعناصره القليلة الأولى:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">تحميل البيانات إلى ميلفوس</h3><p><strong>إنشاء مجموعة:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ملاحظة حول تكوين MilvusClient:</p>
<ul>
<li><p>تعيين URI إلى ملف محلي (على سبيل المثال، <code translate="no">./milvus.db</code>) هو الخيار الأبسط. يستخدم تلقائيًا Milvus Lite لتخزين جميع البيانات في هذا الملف.</p></li>
<li><p>بالنسبة للبيانات واسعة النطاق، يمكنك نشر خادم Milvus أكثر أداءً على Docker أو Kubernetes. في هذه الحالة، استخدم URI الخادم (على سبيل المثال، <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>لاستخدام Zilliz Cloud (الإصدار السحابي المُدار بالكامل من Milvus)، قم بتعيين URI والرمز المميز إلى نقطة النهاية العامة ومفتاح API من وحدة تحكم Zilliz Cloud.</p></li>
</ul>
<p>تحقق مما إذا كانت المجموعة موجودة بالفعل، وقم بإسقاطها إذا كان الأمر كذلك:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>قم بإنشاء مجموعة جديدة بالمعلمات المحددة. إذا لم تقم بتوفير تعريفات الحقول، يقوم ميلفوس تلقائيًا بإنشاء حقل افتراضي <code translate="no">id</code> كمفتاح أساسي وحقل <code translate="no">vector</code> للبيانات المتجهة. يخزن حقل JSON المحجوز أي حقول وقيم غير محددة في المخطط:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">إدراج البيانات</h3><p>قم بتكرار الأسطر النصية وإنشاء التضمينات وإدراج البيانات في Milvus. لم يتم تعريف الحقل <code translate="no">text</code> هنا في المخطط. تتم إضافته تلقائيًا كحقل ديناميكي مدعوم بحقل JSON المحجوز في Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">بناء خط أنابيب RAG</h3><p><strong>استرجاع المستندات ذات الصلة:</strong></p>
<p>لنطرح سؤالاً شائعاً حول ملفوس:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ابحث في المجموعة عن أفضل 3 نتائج ذات صلة:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>يتم فرز النتائج حسب المسافة، الأقرب أولاً:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>إنشاء استجابة مع LLM:</strong></p>
<p>دمج المستندات المسترجعة في سلسلة سياق:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>إعداد النظام ومطالبات المستخدم. يتم إنشاء مطالبة المستخدم من المستندات المسترجعة من ميلفوس:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>استدعاء GLM-5 لتوليد الإجابة النهائية:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>يقوم GLM-5 بإرجاع إجابة جيدة التنظيم:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">الخاتمة: اختر النموذج، ثم قم ببناء خط الأنابيب<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>جميع النماذج الثلاثة قوية، لكنها قوية في أشياء مختلفة. يعد Gemini 3 Deep Think هو الاختيار عندما يكون عمق التفكير مهمًا أكثر من التكلفة. GLM-5 هو أفضل خيار مفتوح المصدر للفرق التي تحتاج إلى النشر المحلي والهندسة على مستوى النظام. يعد MiniMax M2.5 منطقيًا عندما تقوم بتحسين الإنتاجية والميزانية عبر أعباء عمل الإنتاج.</p>
<p>النموذج الذي تختاره هو نصف المعادلة فقط. لتحويل أي منها إلى تطبيق مفيد، تحتاج إلى طبقة استرجاع يمكنها التوسع مع بياناتك. وهنا يأتي دور ميلفوس. يعمل البرنامج التعليمي RAG أعلاه مع أي نموذج متوافق مع OpenAI، لذا فإن التبديل بين GLM-5 أو MiniMax M2.5 أو أي إصدار مستقبلي يتطلب تغيير سطر واحد.</p>
<p>إذا كنت تصمم وكلاء ذكاء اصطناعي محليين أو محليين وترغب في مناقشة بنية التخزين أو تصميم الجلسات أو الاستعادة الآمنة بمزيد من التفاصيل، فلا تتردد في الانضمام إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا، ويمكنك أيضًا حجز جلسة فردية لمدة 20 دقيقة من خلال <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> للحصول على إرشادات مخصصة.</p>
<p>إذا كنت ترغب في التعمق أكثر في بناء وكلاء الذكاء الاصطناعي، فإليك المزيد من الموارد لمساعدتك على البدء.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">كيفية بناء أنظمة متعددة الوكلاء جاهزة للإنتاج باستخدام Agno و Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">اختيار نموذج التضمين المناسب لخط أنابيب RAG الخاص بك</a></p></li>
<li><p><a href="https://zilliz.com/learn">كيفية بناء وكيل ذكاء اصطناعي باستخدام Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">ما هو OpenClaw؟ الدليل الكامل لعامل الذكاء الاصطناعي مفتوح المصدر</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">البرنامج التعليمي لـ OpenClaw الاتصال بـ Slack لمساعد الذكاء الاصطناعي المحلي</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">بناء وكلاء ذكاء اصطناعي على غرار Clawdbot مع LangGraph و Milvus</a></p></li>
</ul>
