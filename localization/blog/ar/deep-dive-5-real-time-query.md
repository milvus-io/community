---
id: deep-dive-5-real-time-query.md
title: استخدام قاعدة بيانات متجهات ميلفوس للاستعلام في الوقت الحقيقي
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: تعرف على الآلية الأساسية للاستعلام في الوقت الحقيقي في ميلفوس.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/xige-16">شي جي</a> ونقلته <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>في المنشور السابق، تحدثنا في المنشور السابق عن <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدراج البيانات واستمرار البيانات</a> في ميلفوس. في هذه المقالة، سنستمر في شرح كيفية تفاعل <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">المكونات المختلفة</a> في ميلفوس مع بعضها البعض لإكمال الاستعلام عن البيانات في الوقت الحقيقي.</p>
<p><em>بعض الموارد المفيدة قبل البدء مدرجة أدناه. نوصي بقراءتها أولاً لفهم الموضوع في هذا المنشور بشكل أفضل.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">الغوص العميق في بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">نموذج بيانات ميلفوس</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">دور ووظيفة كل مكون من مكونات ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات في ملفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدخال البيانات واستمرار البيانات في ملفوس</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">تحميل البيانات إلى عقدة الاستعلام<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل تنفيذ الاستعلام، يجب تحميل البيانات إلى عقد الاستعلام أولاً.</p>
<p>هناك نوعان من البيانات التي يتم تحميلها إلى عقدة الاستعلام: البيانات المتدفقة من <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">وسيط السجل،</a> والبيانات التاريخية من <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">تخزين الكائنات</a> (وتسمى أيضًا التخزين الدائم أدناه).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>المخطط الانسيابي</span> </span></p>
<p>منسق البيانات هو المسؤول عن التعامل مع البيانات المتدفقة التي يتم إدراجها باستمرار في ميلفوس. عندما يقوم مستخدم Milvus بالاتصال على <code translate="no">collection.load()</code> لتحميل مجموعة، يقوم منسق الاستعلام بالاستعلام عن منسق البيانات لمعرفة المقاطع التي تم إدراجها باستمرار في التخزين ونقاط التفتيش المقابلة لها. نقطة التفتيش هي علامة للدلالة على أن المقاطع المستمرة قبل نقاط التفتيش مستهلكة بينما تلك التي تلي نقطة التفتيش ليست كذلك.</p>
<p>بعد ذلك، يقوم منسق الاستعلام بإخراج إستراتيجية التخصيص بناءً على المعلومات الواردة من منسق البيانات: إما حسب المقطع أو حسب القناة. يكون مخصص المقطع مسؤولاً عن تخصيص المقاطع في التخزين الدائم (البيانات المجمعة) إلى عقد استعلام مختلفة. على سبيل المثال، في الصورة أعلاه، يقوم مخصص المقطع بتخصيص المقطع 1 و3 (S1، S3) إلى عقدة الاستعلام 1، والمقطع 2 و4 (S2، S4) إلى عقدة الاستعلام 2. يقوم مخصص القناة بتعيين عقد استعلام مختلفة لمشاهدة <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">قنوات</a> معالجة بيانات متعددة (DMChannels) في وسيط السجل. على سبيل المثال، في الصورة أعلاه، يقوم مخصص القناة بتعيين عقدة الاستعلام 1 لمشاهدة القناة 1 (Ch1)، وعقدة الاستعلام 2 لمشاهدة القناة 2 (Ch2).</p>
<p>باستخدام استراتيجية التخصيص، تقوم كل عقدة استعلام بتحميل بيانات المقطع ومشاهدة القنوات وفقًا لذلك. في عقدة الاستعلام 1 في الصورة، يتم تحميل البيانات التاريخية (بيانات الدُفعات) عبر S1 و S3 المخصصين من التخزين الدائم. في هذه الأثناء، تقوم عقدة الاستعلام 1 بتحميل البيانات الإضافية (بيانات الدفق) عن طريق الاشتراك في القناة 1 في وسيط السجل.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">إدارة البيانات في عقدة الاستعلام<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>تحتاج عقدة الاستعلام إلى إدارة كل من البيانات التاريخية والتزايدية. يتم تخزين البيانات التاريخية في <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">قطاعات مغلقة</a> بينما يتم تخزين البيانات الإضافية في <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">قطاعات متزايدة</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">إدارة البيانات التاريخية</h3><p>هناك اعتباران أساسيان لإدارة البيانات التاريخية: توازن التحميل وتجاوز فشل عقدة الاستعلام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>توازن التحميل</span> </span></p>
<p>على سبيل المثال، كما هو موضح في الرسم التوضيحي، تم تخصيص عقدة الاستعلام 4 لمقاطع مختومة أكثر من بقية عقد الاستعلام. من المحتمل جدًا أن يؤدي ذلك إلى جعل عقدة الاستعلام 4 عنق الزجاجة الذي يبطئ عملية الاستعلام بأكملها. لحل هذه المشكلة، يحتاج النظام إلى تخصيص العديد من المقاطع في عقدة الاستعلام 4 إلى عقد الاستعلام الأخرى. وهذا ما يسمى توازن التحميل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>تجاوز فشل عقدة الاستعلام</span> </span></p>
<p>هناك حالة محتملة أخرى موضحة في الصورة أعلاه. تعطلت إحدى العقد، عقدة الاستعلام 4، فجأة. في هذه الحالة، يجب نقل الحمل (المقاطع المخصصة لعقدة الاستعلام 4) إلى عقد استعلام عاملة أخرى لضمان دقة نتائج الاستعلام.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">إدارة البيانات التزايدية</h3><p>تراقب عقدة الاستعلام قنوات DMChannels لتلقي البيانات التزايدية. يتم تقديم Flowgraph في هذه العملية. يقوم أولاً بتصفية جميع رسائل إدراج البيانات. هذا لضمان تحميل البيانات الموجودة في قسم محدد فقط. تحتوي كل مجموعة في Milvus على قناة مطابقة، والتي يتم مشاركتها من قبل جميع الأقسام في تلك المجموعة. لذلك، هناك حاجة إلى مخطط تدفق لتصفية البيانات المدرجة إذا كان مستخدم Milvus يحتاج فقط إلى تحميل البيانات في قسم معين. خلاف ذلك، سيتم تحميل البيانات في جميع الأقسام في المجموعة إلى عقدة الاستعلام.</p>
<p>بعد تصفيتها، يتم إدراج البيانات الإضافية في أجزاء متزايدة، ويتم تمريرها إلى عقدة وقت الخادم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>مخطط التدفق</span> </span></p>
<p>أثناء إدراج البيانات، يتم تعيين طابع زمني لكل رسالة إدراج. في قناة DMChannel الموضحة في الصورة أعلاه، يتم إدراج البيانات بالترتيب، من اليسار إلى اليمين. الطابع الزمني لرسالة الإدراج الأولى هو 1، والثانية 2، والثالثة 6. الرسالة الرابعة المميزة باللون الأحمر ليست رسالة إدراج، بل هي رسالة مؤقتة. هذا للدلالة على أن البيانات المدرجة التي تكون طوابعها الزمنية أصغر من هذا الطابع الزمني موجودة بالفعل في وسيط السجل. بعبارة أخرى، يجب أن تحتوي جميع البيانات التي تم إدراجها بعد رسالة النقطة الزمنية هذه على طوابع زمنية تكون قيمها أكبر من هذه النقطة الزمنية. على سبيل المثال، في الصورة أعلاه، عندما تدرك عقدة الاستعلام أن العلامة الزمنية الحالية هي 5، فهذا يعني أن جميع رسائل الإدراج التي تكون قيمة طابعها الزمني أقل من 5 يتم تحميلها جميعًا إلى عقدة الاستعلام.</p>
<p>توفر العقدة الزمنية للخادم قيمة <code translate="no">tsafe</code> محدثة في كل مرة تتلقى فيها قيمة الطابع الزمني من عقدة الإدراج. <code translate="no">tsafe</code> يعني وقت الأمان، ويمكن الاستعلام عن جميع البيانات التي تم إدراجها قبل هذه النقطة الزمنية. خذ مثالاً، إذا كان <code translate="no">tsafe</code> = 9، يمكن الاستعلام عن البيانات المدرجة ذات الطوابع الزمنية الأصغر من 9.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">الاستعلام في الوقت الحقيقي في ملفوس<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يتم تمكين الاستعلام في الوقت الحقيقي في ميلفوس عن طريق رسائل الاستعلام. يتم إدراج رسائل الاستعلام في وسيط السجل عن طريق الوكيل. ثم تحصل عقد الاستعلام على رسائل الاستعلام من خلال مشاهدة قناة الاستعلام في وسيط السجل.</p>
<h3 id="Query-message" class="common-anchor-header">رسالة الاستعلام</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>رسالة الاستعلام</span> </span></p>
<p>تتضمن رسالة الاستعلام المعلومات المهمة التالية حول الاستعلام:</p>
<ul>
<li><code translate="no">msgID</code>: معرف الرسالة، معرف رسالة الاستعلام المعين من قبل النظام.</li>
<li><code translate="no">collectionID</code>: معرف المجموعة المراد الاستعلام عنها (إذا تم تحديده من قبل المستخدم).</li>
<li><code translate="no">execPlan</code>: تُستخدم خطة التنفيذ بشكل أساسي لتصفية السمات في الاستعلام.</li>
<li><code translate="no">service_ts</code>: سيتم تحديث الطابع الزمني للخدمة مع <code translate="no">tsafe</code> المذكور أعلاه. يشير الطابع الزمني للخدمة إلى النقطة التي توجد فيها الخدمة. جميع البيانات المدرجة قبل <code translate="no">service_ts</code> متاحة للاستعلام.</li>
<li><code translate="no">travel_ts</code>: يحدد الطابع الزمني للسفر نطاقًا زمنيًا في الماضي. وسيتم إجراء الاستعلام على البيانات الموجودة في الفترة الزمنية المحددة بواسطة <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: : يحدد الطابع الزمني للضمان فترة زمنية يجب إجراء الاستعلام بعدها. سيتم إجراء الاستعلام فقط عندما <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">الاستعلام في الوقت الحقيقي</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>عملية الاستعلام</span> </span></p>
<p>عند استلام رسالة استعلام، يحكم ميلفوس أولاً على ما إذا كان وقت الخدمة الحالي، <code translate="no">service_ts</code> ، أكبر من الطابع الزمني الضمان، <code translate="no">guarantee_ts</code> ، في رسالة الاستعلام. إذا كانت الإجابة بنعم، فسيتم تنفيذ الاستعلام. سيتم إجراء الاستعلام بالتوازي على كل من البيانات التاريخية والبيانات الإضافية. نظرًا لأنه يمكن أن يكون هناك تداخل في البيانات بين البيانات المتدفقة والبيانات الدفعية ، يلزم إجراء يسمى "التقليل المحلي" لتصفية نتائج الاستعلام الزائدة عن الحاجة.</p>
<p>ومع ذلك، إذا كان وقت الخدمة الحالي أصغر من الطابع الزمني للضمان في رسالة استعلام تم إدراجها حديثًا، ستصبح رسالة الاستعلام رسالة غير محلولة وتنتظر معالجتها حتى يصبح وقت الخدمة أكبر من الطابع الزمني للضمان.</p>
<p>يتم دفع نتائج الاستعلام في النهاية إلى قناة النتائج. يحصل الوكيل على نتائج الاستعلام من تلك القناة. وبالمثل، سيقوم الوكيل بإجراء "تقليل عام" أيضًا لأنه يتلقى النتائج من عقد استعلام متعددة وقد تكون نتائج الاستعلام متكررة.</p>
<p>للتأكد من أن الوكيل قد تلقى جميع نتائج الاستعلام قبل إعادتها إلى SDK، ستحتفظ رسالة النتائج أيضًا بسجل للمعلومات بما في ذلك المقاطع المختومة التي تم البحث عنها وقنوات DMChannels التي تم البحث عنها والمقاطع المختومة العالمية (جميع المقاطع في جميع عقد الاستعلام). يمكن للنظام أن يستنتج أن الوكيل قد تلقى جميع نتائج الاستعلام فقط في حالة استيفاء الشرطين التاليين</p>
<ul>
<li>اتحاد جميع المقاطع المختومة التي تم البحث عنها المسجلة في جميع رسائل النتائج أكبر من المقاطع المختومة العالمية,</li>
<li>تم الاستعلام عن جميع قنوات DMChannels في المجموعة.</li>
</ul>
<p>في النهاية، يقوم الوكيل بإرجاع النتائج النهائية بعد "الاختزال العام" إلى مجموعة أدوات تطوير البرمجيات Milvus SDK.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن التوفر العام</a> لـ Milvus 2.0، قمنا بتنظيم سلسلة مدونة Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
