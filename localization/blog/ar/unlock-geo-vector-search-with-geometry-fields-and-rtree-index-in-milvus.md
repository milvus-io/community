---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  الجمع بين التصفية الجغرافية المكانية والبحث عن المتجهات مع الحقول الهندسية
  وRTREE في Milvus 2.6
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Geospatial Filtering + Vector Search in Milvus with Geometry Fields and RTREE
desc: >-
  تعرّف على كيفية توحيد الإصدار Milvus 2.6 البحث المتجه مع الفهرسة الجغرافية
  المكانية باستخدام الحقول الهندسية وفهرس RTREE، مما يتيح استرجاع دقيق ومدرك
  للموقع بالذكاء الاصطناعي.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>مع تزايد تطبيق أنظمة الذكاء الاصطناعي في اتخاذ القرارات في الوقت الحقيقي، تزداد أهمية البيانات الجغرافية المكانية في مجموعة متزايدة من التطبيقات - خاصة تلك التي تعمل في العالم المادي أو تخدم المستخدمين في مواقع حقيقية.</p>
<p>فكر في منصات توصيل الطعام مثل DoorDash أو Uber Eats. عندما يقوم المستخدم بتقديم طلب، لا يقوم النظام ببساطة بحساب أقصر مسافة بين نقطتين. فهو يقوم بتقييم جودة المطعم، وتوافر شركات التوصيل، وظروف حركة المرور المباشرة، ومناطق الخدمة، وبشكل متزايد، تضمين المستخدم والعناصر التي تمثل التفضيلات الشخصية. وبالمثل، يجب أن تقوم المركبات ذاتية القيادة بتخطيط المسار، واكتشاف العوائق، والفهم الدلالي على مستوى المشهد في ظل قيود زمنية صارمة - غالباً ما تكون في غضون أجزاء من الثانية. في هذه المجالات، تعتمد القرارات الفعّالة على الجمع بين القيود المكانية والتشابه الدلالي، بدلاً من التعامل معها كخطوات مستقلة.</p>
<p>أما في طبقة البيانات، فقد جرت العادة أن يتم التعامل مع البيانات المكانية والدلالية بواسطة أنظمة منفصلة.</p>
<ul>
<li><p>تم تصميم قواعد البيانات الجغرافية المكانية والامتدادات المكانية لتخزين الإحداثيات والمضلعات والعلاقات المكانية مثل الاحتواء أو المسافة.</p></li>
<li><p>تتعامل قواعد البيانات المتجهة مع التضمينات المتجهة التي تمثل المعنى الدلالي للبيانات.</p></li>
</ul>
<p>عندما تحتاج التطبيقات إلى كليهما، فإنها غالبًا ما تضطر إلى خطوط أنابيب استعلام متعددة المراحل - التصفية حسب الموقع في نظام، ثم إجراء بحث متجه في نظام آخر. يزيد هذا الفصل من تعقيد النظام، ويزيد من زمن الاستعلام، ويجعل من الصعب إجراء الاستدلال المكاني الدلالي بكفاءة على نطاق واسع.</p>
<p>يعالج<a href="https://milvus.io/docs/release_notes.md#v264">الإصدار Milvus 2.6</a> هذه المشكلة من خلال تقديم <a href="https://milvus.io/docs/geometry-field.md">حقل الهندسة</a> الذي يسمح بدمج البحث عن التشابه المتجه مباشرةً مع القيود المكانية. يتيح ذلك حالات استخدام مثل:</p>
<ul>
<li><p>خدمة قاعدة الموقع (LBS): "العثور على نقاط مهمة متشابهة داخل هذا المربع السكني في المدينة"</p></li>
<li><p>البحث متعدد الوسائط: "استرداد الصور المتشابهة في نطاق 1 كم من هذه النقطة"</p></li>
<li><p>الخرائط والخدمات اللوجستية: "الأصول داخل منطقة ما" أو "الطرق التي تتقاطع مع مسار ما"</p></li>
</ul>
<p>بالاقتران مع <a href="https://milvus.io/docs/rtree.md">فهرس RTREE</a>الجديد <a href="https://milvus.io/docs/rtree.md">- وهو</a>هيكل قائم على الشجرة مُحسَّن للتصفية المكانية - يدعم الآن برنامج ميلفوس الآن مشغلات جغرافية مكانية فعالة مثل <code translate="no">st_contains</code> و <code translate="no">st_within</code> و <code translate="no">st_dwithin</code> إلى جانب البحث المتجه عالي الأبعاد. إنهما معًا يجعلان الاسترجاع الذكي الواعي مكانيًا ليس ممكنًا فحسب، بل عمليًا أيضًا.</p>
<p>في هذا المنشور، سنستعرض كيفية عمل الحقل الهندسي وفهرس RTREE، وكيف يتحدان مع البحث عن التشابه المتجه لتمكين التطبيقات المكانية الدلالية في العالم الحقيقي.</p>
<h2 id="What-Is-a-Geometry-Field-in-Milvus" class="common-anchor-header">ما هو الحقل الهندسي في ميلفوس؟<button data-href="#What-Is-a-Geometry-Field-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>الحقل <strong>الهندسي</strong> هو نوع بيانات معرّف بالمخطط (<code translate="no">DataType.GEOMETRY</code>) في ميلفوس يستخدم لتخزين البيانات الهندسية. على عكس الأنظمة التي تتعامل مع الإحداثيات الخام فقط، يدعم ميلفوس مجموعة من البنى المكانية - بما في ذلك <strong>النقطة</strong> <strong>والخط والخط</strong> <strong>والمضلع</strong>.</p>
<p>وهذا يجعل من الممكن تمثيل مفاهيم العالم الحقيقي مثل مواقع المطاعم (نقطة)، أو مناطق التسليم (مضلع)، أو مسارات المركبات ذاتية القيادة (LineString)، وكل ذلك ضمن قاعدة البيانات نفسها التي تخزن المتجهات الدلالية. وبعبارة أخرى، يصبح ميلفوس نظامًا موحدًا لكل من <em>مكان</em> وجود شيء ما <em>ومعناه</em>.</p>
<p>يتم تخزين القيم الهندسية باستخدام تنسيق <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">النص المعروف (WKT)</a> ، وهو معيار يمكن للبشر قراءته لإدراج البيانات الهندسية والاستعلام عنها. هذا يبسط عملية إدخال البيانات والاستعلام عنها لأنه يمكن إدراج سلاسل WKT مباشرة في سجل Milvus. على سبيل المثال:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">ما هو فهرس RTREE وكيف يعمل؟<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد تقديم ميلفوس لنوع البيانات الهندسية، فإنه يحتاج أيضًا إلى طريقة فعالة لتصفية الكائنات المكانية. يعالج ميلفوس هذا الأمر باستخدام خط أنابيب تصفية مكاني من مرحلتين:</p>
<ul>
<li><p><strong>التصفية الخشنة:</strong> تضييق نطاق العناصر المرشحة بسرعة باستخدام فهارس مكانية مثل RTREE.</p></li>
<li><p><strong>التصفية الدقيقة:</strong> تطبق فحوصات هندسية دقيقة على العناصر المرشحة المتبقية، مما يضمن صحة الحدود.</p></li>
</ul>
<p>يوازن هذا التصميم بين الأداء والدقة. يعمل الفهرس المكاني على تشذيب البيانات غير ذات الصلة بقوة، بينما تضمن الفحوصات الهندسية الدقيقة نتائج صحيحة للمشغلات مثل الاحتواء والتقاطع وعتبات المسافة.</p>
<p>في قلب خط الأنابيب هذا يوجد <strong>RTREE (الشجرة المستطيلة)</strong>، وهي بنية فهرسة مكانية مصممة لتسريع الاستعلامات على البيانات الهندسية. تعمل RTREE من خلال تنظيم الكائنات بشكل هرمي باستخدام <strong>الحد الأدنى من المستطيلات المحدودة (MBRs)</strong>، مما يسمح بتخطي أجزاء كبيرة من مساحة البحث أثناء تنفيذ الاستعلام.</p>
<h3 id="Phase-1-Building-the-RTREE-Index" class="common-anchor-header">المرحلة 1: بناء فهرس المعرفة التعليمية والتربوية والبحثية بالنظام التسلسلي</h3><p>تتبع عملية بناء RTREE عملية تصاعديّة من الأسفل إلى الأعلى تقوم بتجميع الأجسام المكانية القريبة في مناطق محدودة أكبر بشكل متزايد:</p>
<p><strong>1. إنشاء العقد الورقية:</strong> بالنسبة لكل كائن هندسي، احسب <strong>الحد الأدنى للمستطيل المحيط</strong>به <strong>(MBR</strong>) - أصغر مستطيل يحتوي على الكائن بالكامل - وخزنه كعقدة ورقية.</p>
<p><strong>2. قم بالتجميع في مربعات أكبر:</strong> قم بتجميع العقد الورقية القريبة ولف كل مجموعة داخل MBR جديد، مما ينتج عنه عقد داخلية.</p>
<p><strong>3. إضافة عقدة الجذر:</strong> قم بإنشاء عقدة جذر تغطي MBR الخاصة بها جميع المجموعات الداخلية، مما يشكل بنية شجرة متوازنة الارتفاع.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>المرحلة 2: تسريع الاستعلامات</strong></p>
<p><strong>1. تشكيل MBR الاستعلام:</strong> احسب MBR للهندسة المستخدمة في استعلامك.</p>
<p><strong>2. تشذيب الفروع:</strong> بدءًا من الجذر، قارن MBR الاستعلام مع كل عقدة داخلية. تخطي أي فرع لا يتقاطع MBR مع MBR الاستعلام.</p>
<p><strong>3. جمع الفروع المرشحة:</strong> النزول إلى الفروع المتقاطعة وجمع العقد الورقية المرشحة.</p>
<p><strong>4. إجراء مطابقة دقيقة:</strong> لكل مرشح، قم بتشغيل المسند المكاني للحصول على نتائج دقيقة.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">لماذا تعتبر RTREE سريعة</h3><p>توفر RTREE أداءً قويًا في التصفية المكانية بسبب العديد من ميزات التصميم الرئيسية:</p>
<ul>
<li><p><strong>تقوم كل عقدة بتخزين MBR:</strong> تقوم كل عقدة بتقريب مساحة جميع الأشكال الهندسية في شجرتها الفرعية. وهذا يجعل من السهل تحديد ما إذا كان ينبغي استكشاف فرع ما أثناء الاستعلام.</p></li>
<li><p><strong>تشذيب سريع:</strong> يتم فقط استكشاف الشجرات الفرعية التي يتقاطع MBR الخاص بها مع منطقة الاستعلام. يتم تجاهل المناطق غير ذات الصلة تمامًا.</p></li>
<li><p><strong>يتناسب حجمها مع حجم البيانات:</strong> تدعم RTREE عمليات البحث المكانية في زمن <strong>O(log N)</strong> ، مما يتيح إجراء استعلامات سريعة حتى مع توسع مجموعة البيانات.</p></li>
<li><p><strong>تطبيق Boost.Geometry:</strong> Milvus builds its RTREE index using <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, a widely used C++ library that provides optimized geometry algorithms and a thread-safe RTREE implementation suitable for concurrent workloads.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">مشغلات الهندسة المدعومة</h3><p>يوفر Milvus مجموعة من المشغلات المكانية التي تسمح لك بتصفية الكيانات واسترجاعها بناءً على العلاقات الهندسية. هذه المشغلات ضرورية لأحمال العمل التي تحتاج إلى فهم كيفية ارتباط الكائنات ببعضها البعض في الفضاء.</p>
<p>يسرد الجدول التالي قائمة بالمشغلات <a href="https://milvus.io/docs/geometry-operators.md">الهندسية</a> المتوفرة حالياً في ميلفوس.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>المشغل</strong></th><th style="text-align:center"><strong>الوصف</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(أ، ب)</strong></td><td style="text-align:center">ترجع TRUE إذا كان الشكلان الهندسيان A و B يشتركان في نقطة مشتركة واحدة على الأقل.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكل الهندسي A يحتوي تماماً على الشكل الهندسي B (باستثناء الحدود).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A، B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكل الهندسي A يحتوي بالكامل على الشكل الهندسي B. هذا هو معكوس st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_يغطي(A، B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكل الهندسي A يغطي الشكل الهندسي B (بما في ذلك الحدود).</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A، B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكلان الهندسيان A و B يتلامسان عند حدودهما لكنهما لا يتقاطعان داخلياً.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكلان الهندسيان A و B متطابقين مكانيًا.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A، B)</strong></td><td style="text-align:center">تُرجع TRUE إذا كان الشكلان الهندسيان A وB متداخلين جزئياً ولا يحتوي أحدهما على الآخر بالكامل.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A، B، d)</strong></td><td style="text-align:center">تُرجع TRUE إذا كانت المسافة بين A وB أقل من <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">كيفية الجمع بين فهرس الموقع الجغرافي وفهرس المتجهات</h3><p>من خلال دعم الهندسة وفهرس RTREE، يمكن لـ Milvus الجمع بين التصفية الجغرافية المكانية والبحث عن التشابه المتجه في سير عمل واحد. تعمل العملية في خطوتين:</p>
<p><strong>1. التصفية حسب الموقع باستخدام فهرس RTREE:</strong> يستخدم Milvus أولاً فهرس RTREE لتضييق نطاق البحث إلى الكيانات ضمن النطاق الجغرافي المحدد (على سبيل المثال، "ضمن 2 كم").</p>
<p><strong>2. الترتيب حسب الدلالات باستخدام البحث المتجه:</strong> من المرشحين المتبقين، يختار الفهرس المتجه النتائج الأكثر تشابهًا من بين أعلى N بناءً على تشابه التضمين.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="common-anchor-header">حالات الاستخدام في العالم الحقيقي لاسترجاع المتجهات الجغرافية<button data-href="#Real-World-Use-Cases-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. خدمات التوصيل: توصيات أكثر ذكاءً وإدراكاً للموقع</h3><p>تتعامل منصات مثل DoorDash أو Uber Eats مع مئات الملايين من الطلبات كل يوم. في اللحظة التي يفتح فيها المستخدم التطبيق، يجب أن يحدد النظام - بناءً على موقع المستخدم، والوقت من اليوم، وتفضيلات الذوق، وأوقات التسليم المقدرة، وحركة المرور في الوقت الفعلي، وتوافر شركات التوصيل - أي المطاعم أو شركات التوصيل هي الأفضل <em>في الوقت الحالي</em>.</p>
<p>تقليدياً، يتطلب هذا الأمر الاستعلام عن قاعدة بيانات جغرافية مكانية ومحرك توصية منفصل، تليها جولات متعددة من التصفية وإعادة الترتيب. مع فهرس تحديد الموقع الجغرافي، يبسِّط Milvus سير العمل هذا إلى حد كبير:</p>
<ul>
<li><p><strong>التخزين الموحّد</strong> - إحداثيات المطعم، ومواقع البريد السريع، وتفضيلات المستخدم المضمّنة جميعها في نظام واحد.</p></li>
<li><p><strong>الاسترجاع المشترك</strong> - قم أولاً بتطبيق مرشح مكاني (على سبيل المثال، <em>المطاعم في نطاق 3 كم</em>)، ثم استخدم البحث المتجه للترتيب حسب التشابه أو تفضيل الذوق أو الجودة.</p></li>
<li><p><strong>اتخاذ القرار الديناميكي</strong> - الجمع بين توزيع السعاة في الوقت الفعلي وإشارات المرور لتعيين أقرب ساعي وأنسب ساعي بسرعة.</p></li>
</ul>
<p>يسمح هذا النهج الموحّد للمنصة بإجراء الاستدلال المكاني والدلالي في استعلام واحد. على سبيل المثال، عندما يبحث المستخدم عن "أرز بالكاري"، تسترجع Milvus المطاعم ذات الصلة من الناحية الدلالية <em>وتعطي</em> الأولوية للمطاعم القريبة من المستخدم، والتي تقوم بالتوصيل بسرعة، وتتطابق مع ذوقه التاريخي.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. القيادة الذاتية: قرارات أكثر ذكاءً</h3><p>في القيادة الذاتية، تُعدّ الفهرسة الجغرافية المكانية أمراً أساسياً في القيادة الذاتية الإدراك والتوطين واتخاذ القرارات. يجب على المركبات مواءمة نفسها باستمرار مع الخرائط عالية الوضوح واكتشاف العوائق وتخطيط المسارات الآمنة - كل ذلك في غضون بضعة أجزاء من الثانية.</p>
<p>باستخدام Milvus، يمكن لنوع Geometry وفهرس RTREE تخزين البنى المكانية الغنية والاستعلام عنها مثل:</p>
<ul>
<li><p><strong>حدود الطريق</strong> (سلسلة خطية)</p></li>
<li><p><strong>مناطق تنظيم حركة المرور</strong> (مضلع)</p></li>
<li><p><strong>العوائق المكتشفة</strong> (نقطة)</p></li>
</ul>
<p>يمكن فهرسة هذه الهياكل بكفاءة، مما يسمح للبيانات الجغرافية المكانية بالمشاركة مباشرةً في حلقة قرار الذكاء الاصطناعي. على سبيل المثال، يمكن لمركبة ذاتية القيادة أن تحدد بسرعة ما إذا كانت إحداثياتها الحالية تقع ضمن حارة معينة أو تتقاطع مع منطقة محظورة، وذلك ببساطة من خلال مسند مكاني من RTREE.</p>
<p>عند دمجها مع التضمينات المتجهة التي تم إنشاؤها بواسطة نظام الإدراك - مثل تضمينات المشهد التي تلتقط بيئة القيادة الحالية - يمكن أن يدعم برنامج ميلفوس استعلامات أكثر تقدماً، مثل استرجاع سيناريوهات القيادة التاريخية المشابهة للسيناريو الحالي ضمن دائرة نصف قطرها 50 متراً. وهذا يساعد النماذج على تفسير البيئة بشكل أسرع واتخاذ قرارات أفضل.</p>
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
    </button></h2><p>تحديد الموقع الجغرافي أكثر من مجرد خطوط الطول والعرض. في التطبيقات الحساسة للموقع، فهي توفر سياقًا أساسيًا حول <strong>مكان وقوع الأحداث، وكيفية ارتباط الكيانات مكانيًا، وكيف تشكل هذه العلاقات سلوك النظام</strong>. عند دمجها مع إشارات دلالية من نماذج التعلم الآلي، تتيح البيانات الجغرافية المكانية فئة أكثر ثراءً من الاستعلامات التي يصعب التعبير عنها - أو لا يمكن تنفيذها بكفاءة - عندما يتم التعامل مع البيانات المكانية والمتجهة بشكل منفصل.</p>
<p>مع تقديم حقل الهندسة وفهرس RTREE، يجلب Milvus البحث عن التشابه المتجه والتصفية المكانية في محرك استعلام واحد. يتيح ذلك للتطبيقات إجراء استرجاع مشترك عبر <strong>المتجهات والبيانات الجغرافية المكانية والوقت،</strong> مما يدعم حالات الاستخدام مثل أنظمة التوصيات الواعية مكانيًا، والبحث متعدد الوسائط المستند إلى الموقع، والتحليلات المقيدة بالمنطقة أو المسار. والأهم من ذلك أنها تقلل من التعقيد المعماري من خلال التخلص من خطوط الأنابيب متعددة المراحل التي تنقل البيانات بين الأنظمة المتخصصة.</p>
<p>مع استمرار أنظمة الذكاء الاصطناعي في الاقتراب من عملية صنع القرار في العالم الحقيقي، سيحتاج فهم المحتوى ذي الصلة بشكل متزايد إلى الاقتران <strong><em>بمكان</em></strong> تطبيقه <strong><em>ومتى</em></strong> يكون مهمًا. يوفر Milvus اللبنات الأساسية لهذه الفئة من أعباء العمل المكانية الدلالية بطريقة معبرة وعملية للعمل على نطاق واسع.</p>
<p>لمزيد من المعلومات حول الحقل الهندسي وفهرس RTREE، راجع الوثائق أدناه:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">الحقل الهندسي | وثائق ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | توثيق ميلفوس</a></p></li>
</ul>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من ميلفوس؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
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
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">فتح الاسترجاع الحقيقي على مستوى الكيان: صفيف الهياكل الجديد وقدرات MAX_SIM في ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في ميلفوس: السلاح السري لمكافحة التكرارات في بيانات تدريب LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - قواعد بيانات المتجهات تستحق اختبارًا حقيقيًا </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">البحث المتجه في العالم الحقيقي: كيفية التصفية بكفاءة دون قتل التذكر</a></p></li>
</ul>
