---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  توقف عن الدفع مقابل البيانات الباردة: تخفيض التكلفة بنسبة 80% مع تحميل
  البيانات الباردة والساخنة عند الطلب في التخزين المتدرج في ميلفوس
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  تعرّف على كيفية تمكين التخزين المتدرج في Milvus من التحميل عند الطلب للبيانات
  الساخنة والباردة عند الطلب، مما يوفر خفضًا في التكلفة بنسبة تصل إلى 80% وأوقات
  تحميل أسرع على نطاق واسع.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>كم منكم لا يزال يدفع فواتير بنية تحتية متميزة للبيانات التي بالكاد يلمسها نظامك؟ كن صادقًا - معظم الفرق تفعل ذلك.</strong></p>
<p>إذا كنت تدير بحثًا متجهًا في الإنتاج، فربما تكون قد رأيت ذلك بشكل مباشر. فأنت تقوم بتوفير كميات كبيرة من الذاكرة ومحركات أقراص SSD حتى يظل كل شيء "جاهزًا للاستعلام"، على الرغم من أن شريحة صغيرة فقط من مجموعة بياناتك هي النشطة فعليًا. وأنت لست وحدك. لقد رأينا الكثير من الحالات المماثلة أيضاً:</p>
<ul>
<li><p><strong>منصات SaaS متعددة المستأجرين:</strong> مئات من المستأجرين المسجلين، ولكن 10-15% فقط نشطون في أي يوم. أما البقية فيظلون باردين ولكنهم لا يزالون يشغلون الموارد.</p></li>
<li><p><strong>أنظمة توصيات التجارة الإلكترونية:</strong> مليون وحدة تخزين، ومع ذلك فإن أعلى 8% من المنتجات تولد معظم التوصيات وحركة البحث.</p></li>
<li><p><strong>البحث بالذكاء الاصطناعي:</strong> أرشيفات هائلة من التضمينات، على الرغم من أن 90% من استعلامات المستخدم تصل إلى عناصر من الأسبوع الماضي.</p></li>
</ul>
<p>إنها القصة نفسها في مختلف المجالات: <strong>أقل من 10% من بياناتك يتم الاستعلام عنها بشكل متكرر، ولكنها غالباً ما تستهلك 80% من مساحة التخزين والذاكرة.</strong> يعلم الجميع أن هذا الخلل موجود - ولكن حتى وقت قريب، لم تكن هناك طريقة معمارية نظيفة لإصلاحه.</p>
<p><strong>تغير ذلك مع الإصدار</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>قبل هذا الإصدار، كان Milvus (مثل معظم قواعد البيانات المتجهة) يعتمد على <strong>نموذج التحميل الكامل</strong>: إذا كانت البيانات بحاجة إلى أن تكون قابلة للبحث، فيجب تحميلها على العقد المحلية. لم يكن يهم ما إذا كانت تلك البيانات قد تم ضربها ألف مرة في الدقيقة أو مرة واحدة كل ربع سنة - <strong>كان يجب أن تظل جميعها ساخنة.</strong> وقد ضمن هذا الخيار التصميمي أداءً يمكن التنبؤ به، ولكنه كان يعني أيضًا زيادة حجم المجموعات والدفع مقابل الموارد التي لا تستحقها البيانات الباردة.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">التخزين المتدرج</a> <strong>هو الحل.</strong></p>
<p>يقدم الإصدار Milvus 2.6 بنية تخزين متدرج جديدة مع <strong>تحميل حقيقي عند الطلب،</strong> مما يسمح للنظام بالتمييز بين البيانات الساخنة والباردة تلقائيًا:</p>
<ul>
<li><p>تبقى المقاطع الساخنة مخزنة مؤقتًا بالقرب من الحوسبة</p></li>
<li><p>تعيش المقاطع الباردة بثمن بخس في تخزين الكائنات عن بُعد</p></li>
<li><p><strong>لا</strong> يتم سحب البيانات إلى العقد المحلية <strong>إلا عندما يحتاجها الاستعلام فعليًا</strong></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يؤدي هذا إلى تحويل هيكل التكلفة من "مقدار البيانات التي لديك" إلى <strong>"مقدار البيانات التي تستخدمها بالفعل".</strong> وفي عمليات النشر المبكرة للإنتاج، يؤدي هذا التحول البسيط <strong>إلى خفض تكلفة التخزين والذاكرة بنسبة تصل إلى 80%</strong>.</p>
<p>في بقية هذا المنشور، سنستعرض كيفية عمل التخزين المتدرج، ونشارك نتائج الأداء الحقيقية، ونوضح أين يحقق هذا التغيير أكبر تأثير.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">لماذا ينهار التحميل الكامل على نطاق واسع<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في الحل، يجدر بنا أن نلقي نظرة فاحصة على السبب في أن <strong>وضع التحميل الكامل</strong> المستخدم في Milvus 2.5 والإصدارات السابقة أصبح عاملاً مقيدًا مع زيادة أعباء العمل.</p>
<p>في الإصدار Milvus 2.5 والإصدارات الأقدم، عندما يصدر المستخدم طلبًا <code translate="no">Collection.load()</code> ، تقوم كل عقدة استعلام بتخزين المجموعة بأكملها مؤقتًا محليًا، بما في ذلك البيانات الوصفية وبيانات الحقل والفهارس. يتم تنزيل هذه المكونات من وحدة تخزين الكائنات وتخزينها إما بشكل كامل في الذاكرة أو يتم تعيين الذاكرة (mmap) على القرص المحلي. فقط بعد توفر <em>كل</em> هذه البيانات محليًا يتم وضع علامة على المجموعة على أنها محملة وجاهزة لخدمة الاستعلامات.</p>
<p>وبعبارة أخرى، لا يمكن الاستعلام عن المجموعة حتى تتواجد مجموعة البيانات الكاملة - الساخنة أو الباردة - على العقدة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>ملاحظة:</strong> بالنسبة لأنواع الفهرس التي تتضمن بيانات المتجه الخام، يقوم ميلفوس بتحميل ملفات الفهرس فقط، وليس حقل المتجه بشكل منفصل. ومع ذلك، يجب أن يتم تحميل الفهرس بالكامل لخدمة الاستعلامات، بغض النظر عن مقدار البيانات التي يتم الوصول إليها فعليًا.</p>
<p>لمعرفة لماذا يصبح هذا الأمر إشكاليًا، خذ مثالًا ملموسًا:</p>
<p>لنفترض أن لديك مجموعة بيانات متجهة متوسطة الحجم تحتوي على</p>
<ul>
<li><p><strong>100 مليون متجه</strong></p></li>
<li><p><strong>768 بُعدًا</strong> (تضمينات BERT)</p></li>
<li><p>دقة<strong>عائمة32</strong> (4 بايت لكل بُعد)</p></li>
<li><p><strong>فهرس HNSW</strong></p></li>
</ul>
<p>في هذا الإعداد، يستهلك فهرس HNSW وحده - بما في ذلك المتجهات الخام المضمنة - حوالي 430 جيجابايت من الذاكرة. بعد إضافة حقول قياسية شائعة مثل معرّفات المستخدم أو الطوابع الزمنية أو تسميات الفئات، يتجاوز إجمالي استخدام الموارد المحلية بسهولة 500 جيجابايت.</p>
<p>هذا يعني أنه حتى إذا كان 80% من البيانات نادرًا ما يتم الاستعلام عنها أو لا يتم الاستعلام عنها مطلقًا، فلا يزال يتعين على النظام توفير أكثر من 500 جيجابايت من الذاكرة المحلية أو القرص والاحتفاظ بها لمجرد الحفاظ على المجموعة متصلة بالإنترنت.</p>
<p>بالنسبة لبعض أحمال العمل، يكون هذا السلوك مقبولاً:</p>
<ul>
<li><p>إذا كان يتم الوصول إلى جميع البيانات تقريبًا بشكل متكرر، فإن التحميل الكامل لكل شيء يوفر أقل زمن استعلام ممكن - بأعلى تكلفة.</p></li>
<li><p>إذا كان من الممكن تقسيم البيانات إلى مجموعات فرعية ساخنة ودافئة، فإن تعيين البيانات الدافئة على القرص يمكن أن يقلل ضغط الذاكرة جزئيًا.</p></li>
</ul>
<p>ومع ذلك، في أحمال العمل التي تكون فيها 80% أو أكثر من البيانات موجودة في الذيل الطويل، تظهر عيوب التحميل الكامل بسرعة، سواء من حيث <strong>الأداء</strong> أو <strong>التكلفة</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">اختناقات الأداء</h3><p>في الممارسة العملية، يؤثر التحميل الكامل على أكثر من أداء الاستعلام، وغالبًا ما يؤدي إلى إبطاء سير العمل التشغيلي الروتيني:</p>
<ul>
<li><p><strong>ترقيات متجددة أطول:</strong> في المجموعات الكبيرة، يمكن أن تستغرق الترقيات المتجددة ساعات أو حتى يومًا كاملًا، حيث يجب على كل عقدة إعادة تحميل مجموعة البيانات بأكملها قبل أن تصبح متاحة مرة أخرى.</p></li>
<li><p><strong>استرداد أبطأ بعد الأعطال:</strong> عند إعادة تشغيل عقدة الاستعلام، لا يمكنها خدمة حركة المرور حتى يتم إعادة تحميل جميع البيانات، مما يطيل وقت الاسترداد بشكل كبير ويزيد من تأثير فشل العقدة.</p></li>
<li><p><strong>تكرار وتجريب أبطأ:</strong> يؤدي التحميل الكامل إلى إبطاء سير عمل التطوير، مما يجبر فرق الذكاء الاصطناعي على الانتظار لساعات حتى يتم تحميل البيانات عند اختبار مجموعات البيانات الجديدة أو تكوينات الفهرس.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">عدم كفاءة التكلفة</h3><p>يؤدي التحميل الكامل أيضًا إلى زيادة تكاليف البنية التحتية. على سبيل المثال، في مثيلات السحابة السائدة المحسّنة للذاكرة، يكلف تخزين 1 تيرابايت من البيانات محلياً حوالي<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">,</mo><mn>000 في</mn><mo separator="true"> السنة*،</mo> است</mrow></semantics></math></span></span>ناداً<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>إلى</mi><mi>التسعير المحافظ</mi></mrow><annotation encoding="application/x-tex">(AW</annotation><mrow><mi>S</mi></mrow><annotation encoding="application/x-tex">r6i</annotation><mrow><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70,000 في السنة**، استناداً إلى التسعير المحافظ (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mpunct"> 70،</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000 في</span><span class="mord mathnormal" style="margin-right:0.02778em;">السنة</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">*</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mpunct">*،</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">استناداً</span><span class="mord mathnormal">إلى التسعير المحافظ</span><span class="mopen">(</span><span class="mord mathnormal" style="margin-right:0.13889em;">AWS</span><span class="mord mathnormal">r6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB / شهر؛ GCP n4-highmem: ~ 5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68</mi><mn>/ جيجابايت /</mn><mo separator="true"> شهر؛</mo><mi>سلسلة</mi><mi>AzureE</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">5.68 / جيجابايت / شهر؛ سلسلة Azure E: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">68/جيجابايت/شهر؛</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">السلسلة</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67 / جيجابايت / شهر).</span></span></span></p>
<p>ضع في اعتبارك الآن نمط وصول أكثر واقعية، حيث تكون 80% من تلك البيانات باردة ويمكن تخزينها في تخزين الكائنات بدلاً من ذلك (بسعر 0.023 دولارًا أمريكيًا / جيجابايت / شهر تقريبًا):</p>
<ul>
<li><p>200 جيجابايت بيانات ساخنة × 5.68 دولار</p></li>
<li><p>800 جيجابايت بيانات باردة × 0.023 دولار</p></li>
</ul>
<p>التكلفة السنوية: (200 × 5.68+800 × 0.023 دولار) × 12 × 14<strong>,000</strong> دولار</p>
<p>هذا <strong>تخفيض بنسبة 80%</strong> في التكلفة الإجمالية للتخزين، دون التضحية بالأداء في الأماكن المهمة بالفعل.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">ما هو التخزين المتدرج وكيف يعمل؟<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>لإزالة هذه المفاضلة، قدم Milvus 2.6 <strong>التخزين</strong> المتدرج، الذي يوازن بين الأداء والتكلفة من خلال التعامل مع التخزين المحلي على أنه ذاكرة تخزين مؤقتة بدلاً من حاوية لمجموعة البيانات بأكملها.</p>
<p>في هذا النموذج، تقوم QueryNodes بتحميل البيانات الوصفية خفيفة الوزن فقط عند بدء التشغيل. يتم جلب بيانات الحقل والفهارس عند الطلب من مخزن الكائنات البعيد عندما يتطلبها الاستعلام، ويتم تخزينها مؤقتًا محليًا إذا كان يتم الوصول إليها بشكل متكرر. يمكن إخلاء البيانات غير النشطة لتحرير مساحة.</p>
<p>نتيجةً لذلك، تبقى البيانات الساخنة قريبة من طبقة الحوسبة للاستعلامات ذات زمن الوصول المنخفض، بينما تبقى البيانات الباردة في مخزن الكائنات حتى الحاجة إليها. يقلل هذا من وقت التحميل ويحسن كفاءة الموارد ويسمح ل QueryNodes بالاستعلام عن مجموعات بيانات أكبر بكثير من سعة الذاكرة المحلية أو سعة القرص.</p>
<p>من الناحية العملية، يعمل التخزين المتدرج على النحو التالي:</p>
<ul>
<li><p><strong>الاحتفاظ بالبيانات الساخنة محليًا:</strong> ما يقرب من 20٪ من البيانات التي يتم الوصول إليها بشكل متكرر تبقى مقيمة على العقد المحلية، مما يضمن زمن استجابة منخفض لـ 80٪ من الاستعلامات الأكثر أهمية.</p></li>
<li><p><strong>تحميل البيانات الباردة عند الطلب:</strong> لا يتم جلب الـ 80% المتبقية من البيانات التي نادرًا ما يتم الوصول إليها إلا عند الحاجة إليها، مما يؤدي إلى تحرير معظم موارد الذاكرة والأقراص المحلية.</p></li>
<li><p><strong>التكيف ديناميكيًا مع الإخلاء المستند إلى LRU:</strong> يستخدم Milvus استراتيجية الإخلاء المستندة إلى LRU (الأقل استخدامًا مؤخرًا) لضبط البيانات التي تعتبر ساخنة أو باردة باستمرار. يتم إخلاء البيانات غير النشطة تلقائيًا لإفساح المجال للبيانات التي تم الوصول إليها حديثًا.</p></li>
</ul>
<p>مع هذا التصميم، لم يعد Milvus مقيدًا بالسعة الثابتة للذاكرة المحلية والقرص. وبدلاً من ذلك، تعمل الموارد المحلية كذاكرة تخزين مؤقت مُدارة ديناميكيًا، حيث يتم استرداد المساحة باستمرار من البيانات غير النشطة وإعادة تخصيصها لأحمال العمل النشطة.</p>
<p>تحت الغطاء، يتم تمكين هذا السلوك من خلال ثلاث آليات تقنية أساسية:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. التحميل البطيء</h3><p>عند التهيئة، لا تقوم Milvus بتحميل سوى الحد الأدنى من البيانات الوصفية على مستوى المقطع، مما يسمح للمجموعات بأن تصبح قابلة للاستعلام فور بدء التشغيل تقريبًا. تبقى بيانات الحقل وملفات الفهرس في التخزين عن بعد ويتم جلبها عند الطلب أثناء تنفيذ الاستعلام، مما يحافظ على انخفاض استخدام الذاكرة المحلية والقرص.</p>
<p><strong>كيفية عمل تحميل المجموعات في ميلفوس 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>كيفية عمل التحميل البطيء في Milvus 2.6 والإصدارات الأحدث</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تنقسم البيانات الوصفية التي تم تحميلها أثناء التهيئة إلى أربع فئات رئيسية:</p>
<ul>
<li><p><strong>إحصائيات المقطع</strong> (المعلومات الأساسية مثل عدد الصفوف وحجم المقطع والبيانات الوصفية للمخطط)</p></li>
<li><p><strong>الطوابع الزمنية</strong> (تُستخدم لدعم استعلامات السفر عبر الزمن)</p></li>
<li><p><strong>إدراج وحذف السجلات</strong> (مطلوب للحفاظ على اتساق البيانات أثناء تنفيذ الاستعلام)</p></li>
<li><p><strong>مرشحات بلوم</strong> (تُستخدم للتصفية المسبقة السريعة لإزالة المقاطع غير ذات الصلة بسرعة)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. التحميل الجزئي</h3><p>بينما يتحكم التحميل البطيء في <em>وقت</em> تحميل البيانات، يتحكم التحميل الجزئي في <em>مقدار</em> البيانات التي يتم تحميلها. وبمجرد بدء الاستعلامات أو عمليات البحث، تقوم QueryNode بإجراء تحميل جزئي، حيث تقوم بجلب أجزاء البيانات المطلوبة فقط أو ملفات الفهرس من مخزن الكائنات.</p>
<p><strong>فهارس المتجهات: التحميل الواعي للمستأجر</strong></p>
<p>واحدة من أكثر القدرات تأثيرًا التي تم تقديمها في Milvus 2.6+ هي التحميل الواعي للمستأجرين للفهارس المتجهة، المصممة خصيصًا لأحمال العمل متعددة المستأجرين.</p>
<p>عندما يصل الاستعلام إلى البيانات من مستأجر واحد، يقوم Milvus بتحميل جزء من الفهرس المتجه الخاص بذلك المستأجر فقط، مع تخطي بيانات الفهرس لجميع المستأجرين الآخرين. هذا يحافظ على تركيز الموارد المحلية على المستأجرين النشطين.</p>
<p>يوفر هذا التصميم العديد من الفوائد:</p>
<ul>
<li><p>الفهارس المتجهة للمستأجرين غير النشطين لا تستهلك الذاكرة المحلية أو القرص</p></li>
<li><p>تظل بيانات الفهرس للمستأجرين النشطين مخزنة مؤقتًا للوصول في وقت استجابة منخفض</p></li>
<li><p>سياسة إخلاء LRU على مستوى المستأجرين تضمن الاستخدام العادل لذاكرة التخزين المؤقت عبر المستأجرين</p></li>
</ul>
<p><strong>الحقول العددية: التحميل الجزئي على مستوى العمود</strong></p>
<p>ينطبق التحميل الجزئي أيضًا على <strong>الحقول القياس</strong>ية، مما يسمح ل Milvus بتحميل الأعمدة المشار إليها صراحةً في الاستعلام فقط.</p>
<p>ضع في اعتبارك مجموعة تحتوي على <strong>50 حقلاً من حقول المخطط،</strong> مثل <code translate="no">id</code> و <code translate="no">vector</code> و و <code translate="no">title</code> و <code translate="no">description</code> و <code translate="no">category</code> و <code translate="no">price</code> و <code translate="no">stock</code> و <code translate="no">tags</code> ، وتحتاج فقط إلى إرجاع ثلاثة حقول -<code translate="no">id</code> و <code translate="no">title</code> و <code translate="no">price</code>.</p>
<ul>
<li><p>في <strong>Milvus 2.5،</strong> يتم تحميل جميع الحقول القياسية الخمسين بغض النظر عن متطلبات الاستعلام.</p></li>
<li><p>في <strong>Milvus 2.6+،</strong> يتم تحميل الحقول الثلاثة المطلوبة فقط. تبقى الحقول الـ 47 المتبقية غير محملة ويتم جلبها بشكل كسول فقط إذا تم الوصول إليها لاحقًا.</p></li>
</ul>
<p>يمكن أن تكون وفورات الموارد كبيرة. إذا كان كل حقل قياسي يشغل 20 جيجابايت:</p>
<ul>
<li><p>يتطلب تحميل جميع الحقول <strong>1,000 جيجابايت</strong> (50 × 20 جيجابايت)</p></li>
<li><p>يستهلك تحميل الحقول الثلاثة المطلوبة فقط <strong>60 جيجابايت</strong></p></li>
</ul>
<p>يمثل هذا <strong>انخفاضًا بنسبة 94%</strong> في تحميل البيانات القياسية، دون التأثير على صحة الاستعلام أو النتائج.</p>
<p><strong>ملاحظة:</strong> سيتم تقديم التحميل الجزئي المدرك للمستأجر للحقول القياسية والفهارس المتجهة رسميًا في إصدار قادم. وبمجرد توفره، سيؤدي ذلك إلى تقليل زمن انتقال التحميل وتحسين أداء الاستعلام البارد في عمليات النشر الكبيرة متعددة المستأجرين.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. إخلاء ذاكرة التخزين المؤقت المستند إلى LRU</h3><p>يقلل التحميل البطيء والتحميل الجزئي بشكل كبير من كمية البيانات التي يتم جلبها إلى الذاكرة المحلية والقرص. ومع ذلك، في الأنظمة التي تعمل لفترة طويلة، ستظل ذاكرة التخزين المؤقت تنمو مع الوصول إلى بيانات جديدة بمرور الوقت. عندما يتم الوصول إلى السعة المحلية، يتم تفعيل الإخلاء من ذاكرة التخزين المؤقت القائمة على LRU.</p>
<p>يتبع إخلاء LRU (الأقل استخدامًا مؤخرًا) قاعدة بسيطة: يتم إخلاء البيانات التي لم يتم الوصول إليها مؤخرًا أولاً. هذا يحرر مساحة محلية للبيانات التي تم الوصول إليها حديثًا مع الاحتفاظ بالبيانات المستخدمة بشكل متكرر في ذاكرة التخزين المؤقت.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">تقييم الأداء: التخزين المتدرج مقابل التحميل الكامل<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>لتقييم التأثير الواقعي للتخزين <strong>المتدرج</strong> في العالم الحقيقي، قمنا بإعداد بيئة اختبار تعكس عن كثب أعباء عمل الإنتاج. قمنا بمقارنة Milvus مع التخزين المتدرج وبدونه عبر خمسة أبعاد: وقت التحميل واستخدام الموارد وأداء الاستعلام والسعة الفعالة وكفاءة التكلفة.</p>
<h3 id="Experimental-setup" class="common-anchor-header">الإعداد التجريبي</h3><p><strong>مجموعة البيانات</strong></p>
<ul>
<li><p>100 مليون متجه بأبعاد 768 (تضمينات BERT)</p></li>
<li><p>حجم فهرس المتجهات: حوالي 430 جيجابايت</p></li>
<li><p>10 حقول قياسية، بما في ذلك المعرف والطابع الزمني والفئة</p></li>
</ul>
<p><strong>تكوين الأجهزة</strong></p>
<ul>
<li><p>1 QueryNode مع 4 وحدات تحكم افتراضية وذاكرة 32 جيجابايت و1 تيرابايت NVMe SSD</p></li>
<li><p>شبكة 10 جيجابت في الثانية</p></li>
<li><p>مجموعة تخزين كائنات MinIO كواجهة خلفية للتخزين عن بُعد</p></li>
</ul>
<p><strong>نمط الوصول</strong></p>
<p>تتبع الاستعلامات توزيعًا واقعيًا للوصول السريع والبارد:</p>
<ul>
<li><p>80% من الاستعلامات تستهدف البيانات من آخر 30 يومًا (≈20% من إجمالي البيانات)</p></li>
<li><p>15٪ من البيانات المستهدفة من 30-90 يومًا (≈30٪ من إجمالي البيانات)</p></li>
<li><p>5٪ بيانات مستهدفة أقدم من 90 يومًا (≈50٪ من إجمالي البيانات)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">النتائج الرئيسية</h3><p><strong>1. وقت تحميل أسرع بـ 33 مرة</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>المرحلة</strong></th><th style="text-align:center"><strong>ميلفوس 2.5</strong></th><th style="text-align:center"><strong>ميلفوس 2.6+ (تخزين متدرج)</strong></th><th style="text-align:center"><strong>تسريع</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">تنزيل البيانات</td><td style="text-align:center">22 دقيقة</td><td style="text-align:center">28 ثانية</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">تحميل الفهرس</td><td style="text-align:center">3 دقائق</td><td style="text-align:center">17 ثانية</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>الإجمالي</strong></td><td style="text-align:center"><strong>25 دقيقة</strong></td><td style="text-align:center"><strong>45 ثانية</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>في Milvus 2.5، استغرق تحميل المجموعة <strong>25 دقيقة</strong>. مع التخزين المتدرج في الإصدار Milvus 2.6+، يكتمل نفس عبء العمل في <strong>45 ثانية</strong> فقط، مما يمثل تحسنًا كبيرًا في كفاءة التحميل.</p>
<p><strong>2. انخفاض بنسبة 80% في استخدام الموارد المحلية</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>المرحلة</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (التخزين المتدرج)</strong></th><th style="text-align:center"><strong>التخفيض</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">بعد التحميل</td><td style="text-align:center">430 جيجابايت</td><td style="text-align:center">12 جيجابايت</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">بعد 1 ساعة</td><td style="text-align:center">430 جيجابايت</td><td style="text-align:center">68 جيجابايت</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">بعد 24 ساعة</td><td style="text-align:center">430 جيجابايت</td><td style="text-align:center">85 جيجابايت</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">الحالة المستقرة</td><td style="text-align:center">430 جيجابايت</td><td style="text-align:center">85-95 جيجابايت</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>في الإصدار Milvus 2.5، يظل استخدام الموارد المحلية ثابتًا عند <strong>430</strong> جيجابايت، بغض النظر عن عبء العمل أو وقت التشغيل. في المقابل، يبدأ Milvus 2.6+ ب <strong>12 جيجابايت</strong> فقط بعد التحميل مباشرة.</p>
<p>أثناء تشغيل الاستعلامات، يتم تخزين البيانات التي يتم الوصول إليها بشكل متكرر مؤقتًا محليًا ويزداد استخدام الموارد تدريجيًا. بعد حوالي 24 ساعة تقريبًا، يستقر النظام عند <strong>85-95 ج</strong>يجابايت، مما يعكس مجموعة العمل من البيانات الساخنة. على المدى الطويل، ينتج عن ذلك <strong> انخفاض بنسبة 80٪ تقريبًا</strong> في استخدام الذاكرة المحلية والأقراص دون التضحية بتوافر الاستعلام.</p>
<p><strong>3. تأثير شبه معدوم على أداء البيانات الساخنة</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>نوع الاستعلام</strong></th><th style="text-align:center"><strong>زمن استجابة ميلفوس 2.5 P99</strong></th><th style="text-align:center"><strong>وقت استجابة P99 + P99 ميلفوس 2.6+</strong></th><th style="text-align:center"><strong>التغيير</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">استعلامات البيانات الساخنة</td><td style="text-align:center">15 مللي ثانية</td><td style="text-align:center">16 مللي ثانية</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">استعلامات البيانات الساخنة</td><td style="text-align:center">15 مللي ثانية</td><td style="text-align:center">28 مللي ثانية</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">استعلامات البيانات الباردة (الوصول الأول)</td><td style="text-align:center">15 مللي ثانية</td><td style="text-align:center">120 مللي ثانية</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">استعلامات البيانات الباردة (تخزين مؤقت)</td><td style="text-align:center">15 مللي ثانية</td><td style="text-align:center">18 مللي ثانية</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>بالنسبة للبيانات الساخنة، والتي تمثل 80% تقريبًا من جميع الاستعلامات، يزيد زمن انتقال P99 بنسبة 6.7% فقط، مما يؤدي إلى عدم وجود تأثير ملموس في الإنتاج.</p>
<p>تُظهِر استعلامات البيانات الباردة زمن انتقال أعلى عند الوصول الأول بسبب التحميل عند الطلب من تخزين الكائنات. ومع ذلك، بمجرد تخزينها مؤقتًا، يزيد زمن وصولها بنسبة 20% فقط. نظرًا لانخفاض تكرار الوصول إلى البيانات الباردة، فإن هذه المفاضلة مقبولة بشكل عام لمعظم أعباء العمل في العالم الحقيقي.</p>
<p><strong>4. سعة فعالة أكبر بمقدار 4.3 × 4.3</strong></p>
<p>في ظل ميزانية الأجهزة نفسها - ثمانية خوادم بسعة 64 جيجابايت من الذاكرة لكل منها (إجمالي 512 جيجابايت) - يمكن ل Milvus 2.5 تحميل 512 جيجابايت من البيانات على الأكثر، أي ما يعادل 136 مليون ناقل تقريبًا.</p>
<p>مع تمكين التخزين المتدرج في Milvus 2.6+، يمكن للأجهزة نفسها دعم 2.2 تيرابايت من البيانات، أو ما يقرب من 590 مليون ناقل. يمثل هذا زيادة 4.3 أضعاف في السعة الفعالة، مما يتيح تقديم مجموعات بيانات أكبر بكثير دون توسيع الذاكرة المحلية.</p>
<p><strong>5. تخفيض التكلفة بنسبة 80.1%</strong></p>
<p>باستخدام مجموعة بيانات متجهية سعتها 2 تيرابايت في بيئة AWS كمثال، وبافتراض أن 20% من البيانات ساخنة (400 جيجابايت)، تكون مقارنة التكلفة على النحو التالي:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>العنصر</strong></th><th style="text-align:center"><strong>ميلفوس 2.5</strong></th><th style="text-align:center"><strong>ميلفوس 2.6+ (تخزين متدرج)</strong></th><th style="text-align:center"><strong>التوفير</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">التكلفة الشهرية</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">التكلفة السنوية</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">معدل التوفير</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">ملخص المعيار</h3><p>عبر جميع الاختبارات، يوفر التخزين المتدرج تحسينات متسقة وقابلة للقياس:</p>
<ul>
<li><p><strong>أوقات تحميل أسرع بـ 33 مرة:</strong> تقليل وقت تحميل المجموعة من <strong>25 دقيقة إلى 45 ثانية</strong>.</p></li>
<li><p><strong>انخفاض استخدام الموارد المحلية بنسبة 80%:</strong> في حالة التشغيل الثابتة، ينخفض استخدام الذاكرة والقرص المحلي بنسبة <strong>80%</strong> تقريباً.</p></li>
<li><p><strong>تأثير شبه معدوم على أداء البيانات الساخنة:</strong> يزيد وقت استجابة P99 للبيانات الساخنة <strong>بأقل من 10%،</strong> مما يحافظ على أداء الاستعلام منخفض الكمون.</p></li>
<li><p><strong>الكمون المتحكم فيه للبيانات الباردة:</strong> تتكبد البيانات الباردة زمن انتقال أعلى في أول وصول، ولكن هذا مقبول نظرًا لانخفاض تكرار الوصول إليها.</p></li>
<li><p><strong>4.3× سعة فعّالة أعلى:</strong> يمكن للأجهزة نفسها خدمة <strong>بيانات أكثر بـ 4-5 أضعاف البيانات</strong> بدون ذاكرة إضافية.</p></li>
<li><p><strong>تخفيض التكلفة بنسبة تزيد عن 80%:</strong> يتم تخفيض تكاليف البنية التحتية السنوية <strong>بأكثر من 80%</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">متى يتم استخدام التخزين المتدرج في Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>استنادًا إلى النتائج المعيارية وحالات الإنتاج في العالم الحقيقي، نقوم بتجميع حالات استخدام التخزين المتدرج في ثلاث فئات لمساعدتك في تحديد ما إذا كان مناسبًا لأعباء العمل لديك.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">حالات الاستخدام الأنسب</h3><p><strong>1. منصات البحث المتجهية متعددة المستأجرين</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> عدد كبير من المستأجرين مع نشاط متفاوت للغاية؛ البحث المتجه هو عبء العمل الأساسي.</p></li>
<li><p><strong>نمط الوصول:</strong> يولد أقل من 20% من المستأجرين أكثر من 80% من الاستعلامات المتجهة.</p></li>
<li><p><strong>الفوائد المتوقعة:</strong> تخفيض التكلفة بنسبة 70-80%؛ زيادة السعة 3-5 أضعاف.</p></li>
</ul>
<p><strong>2. أنظمة توصيات التجارة الإلكترونية (أعباء عمل البحث المتجه)</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> انحراف شعبي قوي بين المنتجات ذات الشعبية الكبيرة والذيل الطويل.</p></li>
<li><p><strong>نمط الوصول:</strong> أعلى 10% من المنتجات تمثل حوالي 80% من حركة البحث المتجه.</p></li>
<li><p><strong>الفوائد المتوقعة:</strong> لا حاجة إلى سعة إضافية خلال أحداث الذروة؛ خفض التكلفة بنسبة 60-70%</p></li>
</ul>
<p><strong>3. مجموعات بيانات واسعة النطاق مع فصل واضح بين الساخن والبارد (يهيمن عليها المتجهات)</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> مجموعات بيانات بمقياس تيرابايت أو مجموعات بيانات أكبر، مع انحياز الوصول بشكل كبير للبيانات الحديثة.</p></li>
<li><p><strong>نمط الوصول:</strong> التوزيع الكلاسيكي 80/20: 20٪ من البيانات تخدم 80٪ من الاستفسارات</p></li>
<li><p><strong>الفوائد المتوقعة</strong> تخفيض التكلفة بنسبة 75-85%</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">حالات الاستخدام المناسبة</h3><p><strong>1. أعباء العمل الحساسة للتكلفة</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> ميزانيات ضيقة مع بعض التسامح مع بعض المفاضلات الطفيفة في الأداء.</p></li>
<li><p><strong>نمط الوصول:</strong> الاستعلامات المتجهة مركزة نسبياً.</p></li>
<li><p><strong>الفوائد المتوقعة:</strong> تخفيض التكلفة بنسبة 50-70%؛ قد تتكبد البيانات الباردة حوالي 500 مللي ثانية من زمن الوصول الأول، وهو ما يجب تقييمه مقابل متطلبات اتفاقية مستوى الخدمة.</p></li>
</ul>
<p><strong>2. الاحتفاظ بالبيانات التاريخية والبحث الأرشيفي</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> أحجام كبيرة من المتجهات التاريخية مع تكرار استعلام منخفض للغاية.</p></li>
<li><p><strong>نمط الوصول:</strong> حوالي 90% من الاستعلامات تستهدف البيانات الحديثة.</p></li>
<li><p><strong>الفوائد المتوقعة:</strong> الاحتفاظ بمجموعات البيانات التاريخية الكاملة؛ الحفاظ على إمكانية التنبؤ بتكاليف البنية التحتية والتحكم فيها</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">حالات الاستخدام غير الملائمة</h3><p><strong>1. أعباء عمل البيانات الساخنة بشكل موحد</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> يتم الوصول إلى جميع البيانات بوتيرة متشابهة، مع عدم وجود تمييز واضح بين الساخن والبارد.</p></li>
<li><p><strong>لماذا غير مناسب:</strong> فائدة محدودة لذاكرة التخزين المؤقت؛ تعقيد إضافي للنظام دون مكاسب مجدية</p></li>
</ul>
<p><strong>2. أعباء العمل ذات الكمون المنخفض للغاية</strong></p>
<ul>
<li><p><strong>الخصائص:</strong> أنظمة حساسة للغاية لوقت الاستجابة مثل التداول المالي أو المزايدة في الوقت الفعلي</p></li>
<li><p><strong>لماذا غير مناسب:</strong> حتى الاختلافات الصغيرة في زمن الاستجابة غير مقبولة؛ يوفر التحميل الكامل أداءً أكثر قابلية للتنبؤ به</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">بداية سريعة: جرب التخزين المتدرج في ميلفوس 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>يعالج التخزين المتدرج في Milvus 2.6 عدم تطابق شائع بين كيفية تخزين البيانات المتجهة وكيفية الوصول إليها فعليًا. في معظم أنظمة الإنتاج، يتم الاستعلام عن جزء صغير فقط من البيانات بشكل متكرر، ومع ذلك تتعامل نماذج التحميل التقليدية مع جميع البيانات على أنها ساخنة بنفس القدر. من خلال التحول إلى التحميل عند الطلب وإدارة الذاكرة المحلية والقرص كذاكرة تخزين مؤقت، يعمل Milvus على مواءمة استهلاك الموارد مع سلوك الاستعلام الحقيقي بدلاً من افتراضات أسوأ الحالات.</p>
<p>يسمح هذا النهج للأنظمة بالتوسع إلى مجموعات بيانات أكبر دون زيادات متناسبة في الموارد المحلية، مع الحفاظ على أداء الاستعلام الساخن دون تغيير إلى حد كبير. تظل البيانات الباردة متاحة عند الحاجة، مع زمن انتقال متوقع ومحدود، مما يجعل المفاضلة واضحة ويمكن التحكم فيها. مع انتقال البحث المتجه إلى بيئات إنتاج حساسة من حيث التكلفة ومتعددة المستأجرين وطويلة الأمد، يوفر التخزين المتدرج أساساً عملياً للعمل بكفاءة على نطاق واسع.</p>
<p>لمزيد من المعلومات حول التخزين المتدرج، راجع الوثائق أدناه:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">التخزين المتدرج | وثائق ميلفوس</a></li>
</ul>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من Milvus؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">تعرف على المزيد حول ميزات Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">تقديم ميلفوس 2.6: بحث متجه ميسور التكلفة على نطاق المليار</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">تقديم وظيفة التضمين: كيف يعمل ملفوس 2.6 على تبسيط عملية البحث في المتجهات والبحث الدلالي</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">تمزيق JSON في ميلفوس: تصفية JSON أسرع ب 88.9 مرة مع المرونة</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">فتح الاسترجاع الحقيقي على مستوى الكيان: مصفوفة جديدة من الهياكل وقدرات MAX_SIM في ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">الجمع بين التصفية الجغرافية المكانية والبحث في المتجهات مع الحقول الهندسية وRTREE في ملفوس 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">تقديم AISAQ في Milvus: أصبح البحث عن المتجهات بمليارات النطاقات أرخص ب 3,200 مرة على الذاكرة</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">تحسين NVIDIA CAGRA في Milvus: نهج هجين بين وحدة معالجة الرسومات ووحدة المعالجة المركزية للفهرسة الأسرع والاستعلامات الأرخص</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في ميلفوس: السلاح السري لمحاربة التكرارات في بيانات تدريب LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - قواعد بيانات المتجهات تستحق اختبارًا حقيقيًا </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس</a></p></li>
</ul>
