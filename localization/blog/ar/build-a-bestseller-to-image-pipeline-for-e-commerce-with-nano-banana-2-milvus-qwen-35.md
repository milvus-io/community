---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  بناء خط أنابيب من الأكثر مبيعًا إلى صورة للتجارة الإلكترونية باستخدام Nano
  Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  برنامج تعليمي خطوة بخطوة: استخدم Nano Banana 2، والبحث الهجين Milvus، و Qwen
  3.5 لإنشاء صور منتجات التجارة الإلكترونية من الطبقات المسطحة بثلث التكلفة.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>إذا كنت تقوم ببناء أدوات الذكاء الاصطناعي لبائعي التجارة الإلكترونية، فربما سمعت هذا الطلب آلاف المرات: "لدي منتج جديد. امنحني صورة ترويجية تبدو وكأنها تنتمي إلى قائمة الأكثر مبيعاً. بدون مصور، بدون استوديو، واجعلها رخيصة."</p>
<p>هذه هي المشكلة باختصار. البائعون لديهم صور مسطحة وكتالوج من أكثر الكتب مبيعاً التي يتم تحويلها بالفعل. إنهم يريدون الربط بين الاثنين باستخدام الذكاء الاصطناعي، بسرعة وعلى نطاق واسع.</p>
<p>عندما أصدرت Google برنامج Nano Banana 2 (Gemini 3.1 Flash Image) في 26 فبراير 2026، اختبرناه في اليوم نفسه ودمجناه في خط أنابيب الاسترجاع القائم على Milvus الحالي. والنتيجة: انخفضت التكلفة الإجمالية لتوليد الصور إلى ما يقرب من ثلث ما تم إنفاقه من قبل، وتضاعفت الإنتاجية. يمثل خفض سعر الصورة الواحدة (أرخص بحوالي 50% من Nano Banana Pro) جزءًا من ذلك، ولكن الوفورات الأكبر تأتي من إلغاء دورات إعادة العمل بالكامل.</p>
<p>يغطي هذا المقال ما يحققه Nano Banana 2 للتجارة الإلكترونية بشكل صحيح، حيث لا يزال مقصرًا، ثم يتجول في برنامج تعليمي عملي لخط الأنابيب الكامل: بحث <strong>Milvus</strong> الهجين للعثور على أفضل البائعين المتشابهين بصريًا، و <strong>Qwen</strong> 3.5 لتحليل الأنماط، و <strong>Nano Banana 2</strong> للجيل النهائي.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">ما الجديد في نانو بانانا 2؟<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>تم إطلاق Nano Banana 2 (صورة الجوزاء 3.1 فلاش) في 26 فبراير 2026. وهو يجلب معظم قدرات Nano Banana Pro إلى بنية Flash، مما يعني توليد أسرع بسعر أقل. فيما يلي الترقيات الرئيسية:</p>
<ul>
<li><strong>جودة احترافية بسرعة فلاش.</strong> يوفر Nano Banana 2 معرفة ومنطقية ودقة بصرية على مستوى عالمي كانت حصرية في السابق لـ Pro، ولكن مع زمن انتقال وإنتاجية Flash.</li>
<li><strong>إخراج 512 بكسل إلى 4K.</strong> أربع مستويات دقة (512 بكسل، 1K، 2K، 4K) مع دعم أصلي. مستوى 512 بكسل جديد وفريد من نوعه في Nano Banana 2.</li>
<li><strong>14 نسبة عرض إلى ارتفاع.</strong> يضيف 4:1 و1:4 و8:1 و1:8 إلى المجموعة الحالية (1:1 و2:3 و3:2 و3:2 و3:4 و4:3 و4:5 و5:4 و9:16 و16:16 و16:9 و21:9).</li>
<li><strong>ما يصل إلى 14 صورة مرجعية.</strong> الحفاظ على تشابه الأحرف لما يصل إلى 5 أحرف ودقة الكائنات لما يصل إلى 14 كائنًا في سير عمل واحد.</li>
<li><strong>تحسين عرض النص.</strong> توليد نص مقروء ودقيق في الصورة عبر لغات متعددة، مع دعم للترجمة والتعريب ضمن جيل واحد.</li>
<li><strong>تأريض البحث عن الصور.</strong> يسحب من بيانات الويب والصور في الوقت الفعلي من بحث Google لتوليد صور أكثر دقة لموضوعات العالم الحقيقي.</li>
<li><strong>~أرخص بنسبة 50٪ تقريبًا لكل صورة.</strong> بدقة 1K: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>067</mi><mn>مقابل 0</mn></mrow><annotation encoding="application/x-tex">.067 مقابل</annotation><mrow><mn>0</mn></mrow><annotation encoding="application/x-tex">.067 برو</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067</span></span><span class="mord">مقابل 0.067 برو</span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′0</span></span></span></span>.134.</li>
</ul>
<p><strong>حالة استخدام ممتعة لـ Nano Banano 2: إنشاء بانوراما مدركة للموقع بناءً على لقطة شاشة بسيطة لخريطة Google</strong></p>
<p>بالنظر إلى لقطة شاشة من خرائط Google وموجّه النمط، يتعرّف النموذج على السياق الجغرافي ويولّد بانوراما تحافظ على العلاقات المكانية الصحيحة. مفيدة لإنتاج تصميمات إعلانية تستهدف المنطقة (خلفية مقهى باريسي أو منظر طبيعي لشوارع طوكيو) دون الحاجة إلى الحصول على صور فوتوغرافية من المخزون.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>للاطلاع على مجموعة الميزات الكاملة، راجع <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">مدونة إعلان جوجل</a> <a href="https://ai.google.dev/gemini-api/docs/image-generation">ووثائق المطورين</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">ماذا يعني تحديث نانو بانانا للتجارة الإلكترونية؟<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>التجارة الإلكترونية هي واحدة من أكثر الصناعات كثافة في استخدام الصور. قوائم المنتجات، وإعلانات الأسواق، والتصميمات الاجتماعية، وحملات الشعارات، وواجهات المتاجر المحلية: تتطلب كل قناة تدفقًا مستمرًا من الأصول المرئية، ولكل منها مواصفاتها الخاصة.</p>
<p>تتلخص المتطلبات الأساسية لتوليد الصور بالذكاء الاصطناعي في التجارة الإلكترونية في:</p>
<ul>
<li><strong>الحفاظ على انخفاض التكاليف</strong> - يجب أن تعمل تكلفة الصورة الواحدة على نطاق الكتالوج.</li>
<li><strong>مطابقة مظهر أكثر الكتب مبيعًا التي أثبتت نجاحها</strong> - يجب أن تتماشى الصور الجديدة مع النمط المرئي للقوائم التي تم تحويلها بالفعل.</li>
<li><strong>تجنب الانتهاك</strong> - لا لنسخ تصميمات المنافسين أو إعادة استخدام الأصول المحمية.</li>
</ul>
<p>علاوةً على ذلك، يحتاج البائعون عبر الحدود إلى</p>
<ul>
<li><strong>دعم تنسيق متعدد المنصات</strong> - نسب ومواصفات مختلفة للأسواق والإعلانات وواجهات المتاجر.</li>
<li><strong>عرض نص متعدد اللغات</strong> - نص واضح ودقيق في الصورة عبر لغات متعددة.</li>
</ul>
<p>يقترب نانو بانانا 2 من تحقيق كل المربعات. توضح الأقسام أدناه ما تعنيه كل ترقية من الناحية العملية: حيث تحل مباشرةً مشكلة التجارة الإلكترونية، وأين تقصّر، وكيف يبدو تأثير التكلفة الفعلية.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">خفض تكاليف توليد المخرجات بنسبة تصل إلى 60%</h3><p>بدقة 1K، تبلغ تكلفة Nano Banana 2 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>067</mi></mrow><annotation encoding="application/x-tex">لكل صورة مقابل 0.067 للصورة الواحدة في Pro</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067</span></span><span class="mord">لكل صورة</span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"> </span></span></span></span></span></span></span></span></span><span class="mord mathnormal">0</span></span></span></span>.134، وهو ما يمثل خفضًا بنسبة 50% مباشرة. لكن سعر الصورة الواحدة هو نصف القصة فقط. ما كان يقتل ميزانيات المستخدمين هو إعادة العمل. يفرض كل سوق مواصفات الصورة الخاصة به (1:1 لأمازون، 3:4 لواجهات متاجر Shopify، فائقة الاتساع لإعلانات البانر)، وإنتاج كل متغير يعني تمرير جيل منفصل مع أوضاع الفشل الخاصة به.</p>
<p>يجمع Nano Banana 2 تلك الممرات الإضافية في مسار واحد.</p>
<ul>
<li><p><strong>أربعة مستويات دقة أصلية.</strong></p></li>
<li><p>512 بكسل (0.045 دولار)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>فئة 512 بكسل جديدة وفريدة من نوعها في Nano Banana 2. يمكن للمستخدمين الآن إنشاء مسودات منخفضة التكلفة بحجم 512 بكسل للتكرار وإخراج الأصل النهائي بدقة 2K أو 4K دون خطوة ترقية منفصلة.</p>
<ul>
<li><p><strong>14 نسبة عرض إلى ارتفاع مدعومة</strong> إجمالاً. إليك بعض الأمثلة:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>تنضم هذه النسب الجديدة فائقة العرض وفائقة الطول إلى المجموعة الحالية. يمكن لجلسة جيل واحد إنتاج تنسيقات مختلفة مثل: <strong>صورة أمازون الرئيسية</strong> (1:1)، <strong>وبطل واجهة المتجر</strong> (3:4) <strong>وإعلان بانر</strong> (بنسب عريضة للغاية أو نسب أخرى.)</p>
<p>لا حاجة إلى اقتصاص أو حشو أو إعادة عرض لهذه النسب الأربع. يتم تضمين نسب العرض إلى الارتفاع الـ 10 المتبقية في المجموعة الكاملة، مما يجعل العملية أكثر مرونة عبر منصات مختلفة.</p>
<p>سيؤدي التوفير في كل صورة بنسبة 50٪ تقريبًا إلى نصف الفاتورة فقط. إن التخلص من إعادة العمل عبر الدقة ونسب العرض إلى الارتفاع هو ما أدى إلى خفض التكلفة الإجمالية إلى ما يقرب من ثلث ما كان يتم إنفاقه من قبل.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">دعم ما يصل إلى 14 صورة مرجعية مع النمط الأكثر مبيعاً</h3><p>من بين جميع تحديثات Nano Banana 2، كان للمزج متعدد المراجع التأثير الأكبر على خط أنابيب Milvus. يقبل Nano Banana 2 ما يصل إلى 14 صورة مرجعية في طلب واحد، مع الحفاظ على</p>
<ul>
<li>تشابه الأحرف لما يصل إلى <strong>5 أحرف</strong></li>
<li>دقة الكائنات لما يصل إلى <strong>14 كائنًا</strong></li>
</ul>
<p>عمليًا، استرجعنا العديد من الصور الأكثر مبيعًا من Milvus، ومررناها كمراجع، وورثت الصورة التي تم إنشاؤها تكوين المشهد والإضاءة والوضعيات ووضع الدعامة. لم تكن هناك حاجة إلى هندسة سريعة لإعادة بناء تلك الأنماط يدويًا.</p>
<p>دعمت النماذج السابقة مرجعًا واحدًا أو مرجعين فقط، مما أجبر المستخدمين على اختيار أفضل مبيع واحد لمحاكاته. مع وجود 14 خانة مرجعية، كان بإمكاننا مزج الخصائص من عدة قوائم متعددة الأفضل أداءً والسماح للنموذج بتجميع نمط مركب. هذه هي الإمكانية التي تجعل خط الأنابيب القائم على الاسترجاع في البرنامج التعليمي أدناه ممكنًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">إنتاج صور متميزة وجاهزة تجارياً دون تكلفة إنتاج أو لوجستيات تقليدية</h3><p>لتوليد صور متناسقة وموثوقة، تجنب إلقاء جميع متطلباتك في موجه واحد. الطريقة الأكثر موثوقية هي العمل على مراحل: توليد الخلفية أولًا، ثم النموذج بشكل منفصل، وأخيرًا تجميعهما معًا.</p>
<p>لقد اختبرنا توليد الخلفية في جميع نماذج Nano Banana الثلاثة باستخدام نفس الموجه: أفق شنغهاي الممطر بنسبة 4:1 في يوم ممطر من خلال نافذة، مع ظهور برج لؤلؤة الشرق. يختبر هذا الموجه التركيب والتفاصيل المعمارية والواقعية الضوئية في مسار واحد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">نانو بانانا الأصلي مقابل نانو بانانا برو مقابل نانو بانانا برو مقابل نانو بانانا 2</h4><ul>
<li><strong>نانو بانانا الأصلي.</strong> نسيج المطر الطبيعي مع توزيع قطرات معقول، ولكن تفاصيل المبنى مفرطة في النعومة. بالكاد يمكن التعرف على برج اللؤلؤ الشرقي، وكانت الدقة أقل من متطلبات الإنتاج.</li>
<li><strong>نانو بانانا برو.</strong> أجواء سينمائية: لعبت الإضاءة الداخلية الدافئة ضد المطر البارد بشكل مقنع. ومع ذلك، فقد حذفت إطار النافذة بالكامل، مما أدى إلى تسطيح إحساس الصورة بالعمق. يمكن استخدامه كصورة داعمة وليس بطلاً.</li>
<li><strong>نانو موزة 2.</strong> قدمت المشهد كاملاً. إطار النافذة في المقدمة خلق عمقًا. كان برج اللؤلؤ الشرقي مفصلاً بوضوح. ظهرت السفن على نهر هوانغبو. ميّزت الإضاءة ذات الطبقات الدفء الداخلي عن الغيوم الخارجية. كان نسيج المطر وبقع الماء شبه فوتوغرافي، وحافظت نسبة 4:1 فائقة الاتساع على المنظور الصحيح مع تشويه بسيط فقط عند حافة النافذة اليسرى.</li>
</ul>
<p>بالنسبة لمعظم مهام توليد الخلفية في تصوير المنتجات، وجدنا أن إخراج Nano Banana 2 قابل للاستخدام بدون معالجة لاحقة.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">تقديم نص داخل الصورة بشكل واضح عبر اللغات</h3><p>لا يمكن تجنب علامات الأسعار، واللافتات الترويجية، والنسخ متعددة اللغات في صور التجارة الإلكترونية، وقد كانت تاريخياً نقطة انهيار لتوليد الذكاء الاصطناعي. يتعامل معها Nano Banana 2 بشكل أفضل بكثير، حيث يدعم عرض النص داخل الصورة عبر لغات متعددة مع الترجمة والتوطين في جيل واحد.</p>
<p><strong>عرض النص القياسي.</strong> في اختبارنا، كان إخراج النص خاليًا من الأخطاء في كل تنسيق من تنسيقات التجارة الإلكترونية التي جربناها: ملصقات الأسعار، وخطوط التسويق القصيرة، وأوصاف المنتجات ثنائية اللغة.</p>
<p><strong>استمرار الكتابة اليدوية.</strong> نظرًا لأن التجارة الإلكترونية غالبًا ما تتطلب عناصر مكتوبة بخط اليد مثل بطاقات الأسعار والبطاقات الشخصية، اختبرنا ما إذا كانت النماذج قادرة على مطابقة نمط مكتوب بخط اليد موجود وتوسيع نطاقه - على وجه التحديد، مطابقة قائمة مهام مكتوبة بخط اليد وإضافة 5 عناصر جديدة بنفس النمط. النتائج عبر ثلاثة نماذج:</p>
<ul>
<li><strong>الموز النانو الأصلي.</strong> أرقام متسلسلة متكررة، بنية غير مفهومة.</li>
<li><strong>نانو بانانا برو.</strong> تخطيط صحيح، ولكن إعادة إنتاج نمط الخط بشكل سيء.</li>
<li><strong>نانو بانانا 2.</strong> صفر من الأخطاء. تطابق وزن الحد ونمط شكل الحرف بشكل وثيق بما فيه الكفاية بحيث لا يمكن تمييزه عن المصدر.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>ومع ذلك،</strong> تشير وثائق Google الخاصة إلى أن Nano Banana 2 "لا يزال بإمكانه أن يواجه صعوبة في التهجئة الدقيقة والتفاصيل الدقيقة في الصور." كانت نتائجنا نظيفة عبر التنسيقات التي اختبرناها، ولكن يجب أن يتضمن أي سير عمل إنتاجي خطوة التحقق من النص قبل النشر.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">برنامج تعليمي خطوة بخطوة: بناء خط إنتاج من الأكثر مبيعًا إلى صورة باستخدام ميلفوس وكوين 3.5 ونانو بانانا 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">قبل أن نبدأ البنية وإعداد النموذج</h3><p>لتجنب عشوائية التوليد العشوائي للصفحة الواحدة، قمنا بتقسيم العملية إلى ثلاث مراحل يمكن التحكم فيها: استرجاع ما يعمل بالفعل مع البحث الهجين <strong>Milvus،</strong> وتحليل سبب عمله مع <strong>Qwen 3.</strong>5، ثم إنشاء الصورة النهائية مع تلك القيود المدمجة مع <strong>Nano Banana 2</strong>.</p>
<p>كتاب تمهيدي سريع عن كل أداة إذا لم تكن قد عملت معها من قبل:</p>
<ul>
<li><strong><a href="https://milvus.io/">ميلفوس</a></strong><a href="https://milvus.io/">:</a> قاعدة بيانات المتجهات مفتوحة المصدر الأكثر اعتمادًا على نطاق واسع. يخزّن كتالوج منتجاتك كمتجهات ويقوم بتشغيل بحث هجين (كثيف + متناثر + مرشحات متناثرة + متناثرة + متجهات قياسية) للعثور على الصور الأكثر مبيعًا الأكثر تشابهًا مع منتج جديد.</li>
<li><strong>Qwen 3.5</strong>: برنامج LLM متعدد الوسائط شائع. يأخذ الصور الأكثر مبيعًا المسترجعة ويستخرج الأنماط البصرية الكامنة وراءها (تخطيط المشهد، والإضاءة، والوضعية، والحالة المزاجية) في موجه أسلوب منظم.</li>
<li><strong>نانو بانانا 2</strong>: نموذج توليد الصور من جوجل (صورة الجوزاء 3.1 فلاش). يأخذ ثلاثة مدخلات: تخطيط مسطح المنتج الجديد، ومرجع أكثر الكتب مبيعًا، وموجه أسلوب كوين 3.5. يُخرج الصورة الترويجية النهائية.</li>
</ul>
<p>يبدأ المنطق الكامن وراء هذه البنية بملاحظة واحدة: أكثر الأصول المرئية قيمة في أي كتالوج للتجارة الإلكترونية هي مكتبة الصور الأكثر مبيعًا التي تم تحويلها بالفعل. تم صقل الأوضاع والتركيبات والإضاءة في تلك الصور من خلال الإنفاق الإعلاني الحقيقي. إن استرجاع تلك الأنماط مباشرةً أسرع بكثير من إعادة هندستها من خلال الكتابة السريعة، وخطوة الاسترجاع هذه هي بالضبط ما تعالجه قاعدة البيانات المتجهة.</p>
<p>إليك التدفق الكامل. نحن نستدعي كل نموذج من خلال واجهة برمجة تطبيقات OpenRouter، لذا لا توجد متطلبات محلية لوحدة معالجة الرسومات ولا أوزان للنماذج لتنزيلها.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>نعتمد على ثلاث قدرات من Milvus لإنجاح مرحلة الاسترجاع:</p>
<ol>
<li><strong>بحث هجين كثيف + متناثر.</strong> نقوم بتشغيل تضمينات الصور ومتجهات TF-IDF النصية كاستعلامات متوازية ثم دمج مجموعتي النتائج مع إعادة ترتيب RRF (دمج الرتب المتبادل).</li>
<li><strong>تصفية الحقول العددية.</strong> نقوم بالترشيح حسب حقول البيانات الوصفية مثل الفئة وعدد_المبيعات قبل مقارنة المتجهات، بحيث لا تتضمن النتائج سوى المنتجات ذات الصلة وذات الأداء العالي.</li>
<li><strong>مخطط متعدد الحقول.</strong> نقوم بتخزين المتجهات الكثيفة والمتجهات المتفرقة والبيانات الوصفية العددية في مجموعة Milvus واحدة، مما يحافظ على منطق الاسترجاع بالكامل في استعلام واحد بدلاً من التشتت عبر أنظمة متعددة.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">إعداد البيانات</h3><p><strong>كتالوج المنتجات التاريخية</strong></p>
<p>نبدأ بأصلين: مجلد صور/مجلد لصور المنتجات الموجودة وملف products.csv يحتوي على بياناتها الوصفية.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>بيانات المنتجات الجديدة</strong></p>
<p>بالنسبة للمنتجات التي نريد إنشاء صور ترويجية لها، نقوم بإعداد هيكل موازٍ: مجلد new_products/ ومجلد new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">الخطوة 1: تثبيت التبعيات</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">الخطوة 2: استيراد الوحدات والتكوينات</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>قم بتكوين جميع النماذج والمسارات:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الدوال المساعدة</strong></p>
<p>تتعامل هذه الدوال المساعدة مع ترميز الصور، واستدعاءات واجهة برمجة التطبيقات، وتحليل الاستجابة:</p>
<ul>
<li>image_to_uri(): يحوّل صورة PIL إلى URI لبيانات base64 لنقل واجهة برمجة التطبيقات.</li>
<li>get_image_image_embeddings(): ترميز الصور على دفعات إلى متجهات ذات 2048 بُعدًا عبر واجهة برمجة تطبيقات OpenRouter Embedding API.</li>
<li>get_get_text_embedding(): يشفر النص إلى نفس الفضاء المتجه ذي 2048 بُعدًا.</li>
<li>sparse_to_dict(): يحول صف مصفوفة متفرقة من scipy إلى تنسيق {الفهرس: القيمة} الذي يتوقعه ميلفوس للمتجهات المتفرقة.</li>
<li>استخراج_الصور(): يستخرج الصور التي تم إنشاؤها من استجابة Nano Banana 2 API.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">الخطوة 3: تحميل كتالوج المنتجات</h3><p>اقرأ المنتجات.csv وحمّل صور المنتج المقابلة:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>نموذج الإخراج:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">الخطوة 4: توليد التضمينات</h3><p>يتطلب البحث الهجين نوعين من المتجهات لكل منتج.</p>
<p><strong>4.1 المتجهات الكثيفة: تضمينات الصور</strong></p>
<p>يشفّر نموذج nvidia/llama-nemotron-embed-vl-1b-v2 كل صورة منتج في متجه كثيف ذي 2048 بُعدًا. نظرًا لأن هذا النموذج يدعم كلاً من مدخلات الصور والنصوص في فضاء متجه مشترك، فإن التضمينات نفسها تعمل لاسترجاع صورة إلى صورة واسترجاع نص إلى صورة.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>الناتج:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 متجهات متفرقة: تضمينات نصية TF-IDF</strong></p>
<p>يتم ترميز الأوصاف النصية للمنتج إلى متجهات متناثرة باستخدام متجه TF-IDF الخاص ببرنامج scikit-learn. تلتقط هذه المتجهات المطابقة على مستوى الكلمات الرئيسية التي يمكن أن تفوتها المتجهات الكثيفة.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>المخرجات:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>لماذا كلا النوعين من المتجهات؟</strong> تكمل المتجهات الكثيفة والمتناثرة بعضها البعض. تلتقط المتجهات الكثيفة التشابه البصري: لوحة الألوان، صورة ظلية للملابس، النمط العام. تلتقط المتجهات المتفرقة دلالات الكلمات الرئيسية: مصطلحات مثل "زهري" أو "ميدي" أو "شيفون" التي تشير إلى سمات المنتج. ينتج عن الجمع بينهما جودة استرجاع أفضل بكثير من أي من النهجين بمفرده.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">الخطوة 5: إنشاء مجموعة Milvus مع مخطط هجين</h3><p>تُنشئ هذه الخطوة مجموعة Milvus واحدة تخزن المتجهات الكثيفة والمتجهات المتفرقة وحقول البيانات الوصفية القياسية معًا. هذا المخطط الموحد هو ما يتيح البحث الهجين في استعلام واحد.</p>
<table>
<thead>
<tr><th><strong>الحقل</strong></th><th><strong>النوع</strong></th><th><strong>الغرض</strong></th></tr>
</thead>
<tbody>
<tr><td>ناقلات_كثيفة</td><td>FLOAT_VECTOR (2048 د)</td><td>تضمين الصورة، تشابه COSINE</td></tr>
<tr><td>ناقل_متفرق</td><td>متجه_متفرق_مسطح_متجه</td><td>متجه متناثر TF-IDF، المنتج الداخلي</td></tr>
<tr><td>الفئة</td><td>VARCHAR</td><td>تسمية الفئة للتصفية</td></tr>
<tr><td>عدد_المبيعات</td><td>INT64</td><td>حجم المبيعات التاريخية للتصفية</td></tr>
<tr><td>اللون، الطراز، الموسم</td><td>VARCHAR</td><td>تسميات البيانات الوصفية الإضافية</td></tr>
<tr><td>السعر</td><td>مسطح</td><td>سعر المنتج</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>أدخل بيانات المنتج:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">الخطوة 6: البحث المختلط للعثور على الأكثر مبيعاً المشابهة</h3><p>هذه هي خطوة الاسترجاع الأساسية. لكل منتج جديد، يقوم خط الأنابيب بتشغيل ثلاث عمليات في وقت واحد:</p>
<ol>
<li><strong>البحث الكثيف</strong>: يعثر على المنتجات ذات الصور المتشابهة بصريًا.</li>
<li><strong>البحث المتناثر</strong>: يعثر على المنتجات ذات الكلمات الرئيسية النصية المطابقة عبر TF-IDF.</li>
<li><strong>التصفية العددية</strong>: تقصر النتائج على نفس الفئة والمنتجات ذات عدد المبيعات &gt; 1500.</li>
<li><strong>إعادة ترتيب RRF</strong>: يدمج قوائم النتائج الكثيفة والمتناثرة باستخدام دمج الرتب المتبادل.</li>
</ol>
<p>تحميل المنتج الجديد:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ترميز المنتج الجديد:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>تنفيذ البحث الهجين</strong></p>
<p>استدعاءات واجهة برمجة التطبيقات الرئيسية هنا:</p>
<ul>
<li>ينشئ AnnSearchRequest طلبات بحث منفصلة لحقول المتجهات الكثيفة والمتناثرة.</li>
<li>expr=filter_expr يطبق التصفية العددية ضمن كل طلب بحث.</li>
<li>RRRFRFRanker(k=60) يدمج قائمتي النتائج المصنفة باستخدام خوارزمية دمج الرتب المتبادلة.</li>
<li>يقوم hybrid_search الهجين بتنفيذ كلا الطلبين وإرجاع نتائج مدمجة ومعاد ترتيبها.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>المخرجات: أفضل 3 نتائج متشابهة، مرتبة حسب الدرجة المدمجة.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">الخطوة 7: تحليل نمط الكتب الأكثر مبيعًا باستخدام Qwen 3.5</h3><p>نقوم بإدخال الصور الأكثر مبيعًا التي تم استرجاعها إلى Qwen 3.5 ونطلب منه استخراج الحمض النووي البصري المشترك: تكوين المشهد، وإعداد الإضاءة، ووضعية العارض، والمزاج العام. من هذا التحليل، نحصل من هذا التحليل على موجه جيل واحد جاهز للتسليم إلى Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>عينة من المخرجات:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">الخطوة 8: توليد الصورة الترويجية باستخدام Nano Banana 2</h3><p>نقوم بتمرير ثلاثة مدخلات إلى Nano Banana 2: الصورة المسطحة للمنتج الجديد، والصورة الأكثر مبيعًا الأعلى مبيعًا، وموجه النمط الذي استخرجناه في الخطوة السابقة. يركب النموذج هذه المدخلات في صورة ترويجية تجمع بين الثوب الجديد والأسلوب المرئي المثبت.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>المعلمات الرئيسية لمكالمة Nano Banana 2 API:</p>
<ul>
<li>الطرائق: [&quot;نص&quot;، &quot;صورة&quot;]: تعلن أن الاستجابة يجب أن تتضمن صورة.</li>
<li>image_config.aspect_ratio: يتحكم في نسبة العرض إلى الارتفاع للإخراج (3:4 تعمل بشكل جيد للقطات الشخصية/الموضة).</li>
<li>image_config.image_config.image_atize: يضبط الدقة. يدعم Nano Banana 2 دقة 512 بكسل حتى 4K.</li>
</ul>
<p>استخرج الصورة التي تم إنشاؤها:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">الخطوة 9: المقارنة جنبًا إلى جنب</h3><p>المخرجات تتقن الخطوط العريضة: الإضاءة خافتة ومتساوية، ووضعية العارضة تبدو طبيعية، والمزاج العام يتطابق مع المرجع الأكثر مبيعًا.</p>
<p>حيث نراه مقصرًا في مزج الملابس. تبدو السترة الصوفية مُلصقة على العارضة بدلاً من ارتدائها، كما أن ملصق خط العنق الأبيض يظهر من خلال ذلك. يكافح التوليد بتمريرة واحدة مع هذا النوع من التكامل الدقيق بين الملابس والجسم، لذا نتناول الحلول في الملخص.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">الخطوة 10: توليد الدُفعات لجميع المنتجات الجديدة</h3><p>نلف خط الأنابيب الكامل في دالة واحدة ونشغله عبر المنتجات الجديدة المتبقية. تم حذف رمز الدُفعات هنا للإيجاز؛ تواصل معنا إذا كنت بحاجة إلى التنفيذ الكامل.</p>
<p>يبرز أمران عبر نتائج الدُفعات. يتم تعديل مطالبات النمط التي نحصل عليها من <strong>Qwen 3.5</strong> بشكل هادف لكل منتج: فستان صيفي وملابس شتوية محبوكة تتلقى أوصافًا مختلفة حقًا للمشهد مصممة خصيصًا للموسم وحالة الاستخدام والإكسسوارات. الصور التي نحصل عليها من <strong>Nano Banana 2،</strong> بدورها، تصمد أمام التصوير الفوتوغرافي الحقيقي في الاستوديو من حيث الإضاءة والملمس والتركيب.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه المقالة، تناولنا ما يجلبه Nano Banana 2 إلى توليد صور التجارة الإلكترونية، وقارناه مع Nano Banana وPro الأصلي عبر مهام الإنتاج الحقيقية، وتعرّفنا على كيفية إنشاء خط أنابيب لتحويل الصور إلى صور باستخدام Milvus وQwen 3.5 وNano Banana 2.</p>
<p>يتمتع خط الأنابيب هذا بأربع مزايا عملية:</p>
<ul>
<li><strong>تكلفة مضبوطة وميزانيات يمكن التنبؤ بها.</strong> نموذج التضمين (Llama Nemotron Embed VL 1B v2) مجاني على OpenRouter. يعمل Nano Banana 2 بنصف تكلفة كل صورة تقريبًا من Pro، كما أن الإخراج الأصلي متعدد التنسيقات يلغي دورات إعادة العمل التي كانت تضاعف الفاتورة الفعلية مرتين أو ثلاث مرات. بالنسبة لفرق التجارة الإلكترونية التي تدير آلاف وحدات حفظ المخزون في كل موسم، تعني إمكانية التنبؤ هذه أن إنتاج الصور يتناسب مع الكتالوج بدلاً من تجاوز الميزانية.</li>
<li><strong>أتمتة شاملة، ووقت أسرع للإدراج في القائمة.</strong> يعمل التدفق من صورة المنتج المسطحة إلى الصورة الترويجية النهائية دون تدخل يدوي. يمكن للمنتج الجديد أن ينتقل من صورة المستودع إلى صورة قائمة جاهزة للتسويق في دقائق بدلاً من أيام، وهو أمر مهم للغاية خلال مواسم الذروة عندما يكون معدل دوران الكتالوج أعلى.</li>
<li><strong>لا حاجة لوحدة معالجة الرسومات المحلية، مما يقلل من عائق الدخول.</strong> يعمل كل نموذج من خلال واجهة برمجة تطبيقات OpenRouter. يمكن لفريق ليس لديه بنية تحتية لتعلّم الآلة ولا عدد مهندسين مخصص تشغيل خط الأنابيب هذا من جهاز كمبيوتر محمول. لا يوجد شيء للتزويد ولا شيء للصيانة، ولا يوجد استثمار مقدماً في الأجهزة.</li>
<li><strong>دقة استرجاع أعلى، واتساق أقوى للعلامة التجارية.</strong> يجمع برنامج Milvus بين التصفية الكثيفة والمتناثرة والقياسية في استعلام واحد، ويتفوق باستمرار على أساليب المتجه الواحد لمطابقة المنتجات. من الناحية العملية، هذا يعني أن الصور التي تم إنشاؤها ترث بشكل أكثر موثوقية اللغة المرئية الراسخة لعلامتك التجارية: الإضاءة والتكوين والتصميم التي أثبتت أن أكثر المنتجات مبيعًا لديك بالفعل تتوافق مع علامتك التجارية. تبدو المخرجات كما لو كانت تنتمي إلى متجرك، وليس كما لو كانت صورًا فنية عامة من مخزون الذكاء الاصطناعي.</li>
</ul>
<p>هناك أيضًا قيود تستحق أن تكون صريحًا بشأنها:</p>
<ul>
<li><strong>المزج بين الملابس والجسم.</strong> التوليد بتمريرة واحدة يمكن أن يجعل الملابس تبدو مركبة بدلًا من أن تبدو بالية. التفاصيل الدقيقة مثل الإكسسوارات الصغيرة أحيانًا تكون ضبابية. الحل البديل: التوليد على مراحل (الخلفية أولًا، ثم وضعية النموذج، ثم التركيب). هذا النهج متعدد المراحل يمنح كل خطوة نطاقًا أضيق ويحسن جودة المزج بشكل كبير.</li>
<li><strong>دقة التفاصيل في حالات الحواف.</strong> يمكن أن تفقد الزخارف والأنماط والتخطيطات ذات النص الثقيل الوضوح. الحل البديل: أضف قيودًا صريحة إلى موجه الإنشاء ("الملابس تناسب الجسم بشكل طبيعي، لا توجد ملصقات مكشوفة، لا توجد عناصر إضافية، تفاصيل المنتج حادة"). إذا كانت الجودة لا تزال قاصرة على منتج معين، قم بالتبديل إلى نانو بانانا برو للنهاية</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> هي قاعدة البيانات المتجهة مفتوحة المصدر التي تعمل على تشغيل خطوة البحث الهجين، وإذا كنت ترغب في التجول أو محاولة تبديل صور المنتج الخاصة بك، فإن<a href="https://milvus.io/docs">البداية السريعة</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> تستغرق حوالي عشر دقائق. لدينا مجتمع نشط للغاية على <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> و Slack، ونود أن نرى ما يبنيه الناس باستخدام هذا. وإذا انتهى بك الأمر إلى تشغيل Nano Banana 2 مقابل منتج مختلف رأسيًا أو كتالوج أكبر، يرجى مشاركة النتائج! نود أن نسمع عنها.</p>
<h2 id="Keep-Reading" class="common-anchor-header">تابع القراءة<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">نانو بانانا + ميلفوس: تحويل الضجيج إلى RAG متعدد الوسائط جاهز للمؤسسات</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">ما هو OpenClaw؟ الدليل الكامل لعامل الذكاء الاصطناعي مفتوح المصدر</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">برنامج OpenClaw التعليمي: الاتصال بـ Slack لمساعد الذكاء الاصطناعي المحلي</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">استخرجنا نظام ذاكرة أوبن كلاو المفتوح المصدر (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">الذاكرة الثابتة لرمز كلود: البرنامج المساعد memsearch ccplugin</a></li>
</ul>
