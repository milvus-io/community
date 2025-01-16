---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: كيف يوازن ميلفوس بين حمل الاستعلامات عبر العقد؟
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: يدعم الإصدار Milvus 2.0 موازنة التحميل التلقائي عبر عقد الاستعلام.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>صورة غلاف المدونة</span> </span></p>
<p>بقلم <a href="https://github.com/xige-16">شي جي</a></p>
<p>في مقالات المدونة السابقة، قدمنا تباعًا وظائف الحذف وBitsetet والضغط في Milvus 2.0. تتويجًا لهذه السلسلة، نود أن نشارك التصميم الكامن وراء موازنة التحميل، وهي وظيفة حيوية في الكتلة الموزعة في ميلفوس.</p>
<h2 id="Implementation" class="common-anchor-header">التنفيذ<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>في حين يختلف عدد وحجم المقاطع المخزنة في عقد الاستعلام، فإن أداء البحث عبر عقد الاستعلام قد يختلف أيضًا. يمكن أن تحدث أسوأ الحالات عندما يتم استنفاد عدد قليل من عقد الاستعلام في البحث على كمية كبيرة من البيانات، ولكن عقد الاستعلام المنشأة حديثًا تظل خاملة لعدم توزيع أي مقطع عليها، مما يتسبب في إهدار هائل لموارد وحدة المعالجة المركزية وانخفاض كبير في أداء البحث.</p>
<p>لتجنب مثل هذه الظروف، تتم برمجة منسق الاستعلام (منسق الاستعلام) لتوزيع المقاطع بالتساوي على كل عقدة استعلام وفقًا لاستخدام ذاكرة الوصول العشوائي للعقد. لذلك، يتم استهلاك موارد وحدة المعالجة المركزية بالتساوي عبر العقد، وبالتالي تحسين أداء البحث بشكل كبير.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">تشغيل موازنة التحميل التلقائي</h3><p>وفقًا للقيمة الافتراضية للتهيئة <code translate="no">queryCoord.balanceIntervalSeconds</code> ، يتحقق منسق الاستعلام من استخدام ذاكرة الوصول العشوائي (بالنسبة المئوية) لجميع عقد الاستعلام كل 60 ثانية. إذا تم استيفاء أي من الشرطين التاليين، يبدأ منسق الاستعلام في موازنة حمل الاستعلام عبر عقدة الاستعلام:</p>
<ol>
<li>استخدام ذاكرة الوصول العشوائي لأي عقدة استعلام في المجموعة أكبر من <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (الافتراضي: 90);</li>
<li>أو أن تكون القيمة المطلقة لفرق استخدام ذاكرة الوصول العشوائي لأي عقدتي استعلام أكبر من <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (الافتراضي: 30).</li>
</ol>
<p>بعد أن يتم نقل المقاطع من عقدة الاستعلام المصدر إلى عقدة الاستعلام الوجهة، يجب أن تستوفي الشرطين التاليين</p>
<ol>
<li>استخدام ذاكرة الوصول العشوائي لعقدة الاستعلام الوجهة ليس أكبر من <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (الافتراضي: 90);</li>
<li>أن تكون القيمة المطلقة لفرق استخدام ذاكرة الوصول العشوائي لعقدة الاستعلام المصدر والوجهة بعد موازنة التحميل أقل من القيمة المطلقة قبل موازنة التحميل.</li>
</ol>
<p>في حالة استيفاء الشروط المذكورة أعلاه، يستمر تنسيق الاستعلام في موازنة حمل الاستعلام عبر العقد.</p>
<h2 id="Load-balance" class="common-anchor-header">موازنة التحميل<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>عند تشغيل موازنة التحميل، يقوم منسق الاستعلام أولاً بتحميل المقطع (المقاطع) المستهدفة إلى عقدة الاستعلام الوجهة. تقوم كلتا عقدتي الاستعلام بإرجاع نتائج البحث من المقطع (المقاطع) المستهدفة في أي طلب بحث في هذه المرحلة لضمان اكتمال النتيجة.</p>
<p>بعد أن تقوم عقدة الاستعلام الوجهة بتحميل المقطع المستهدف بنجاح، يقوم منسق الاستعلام بنشر <code translate="no">sealedSegmentChangeInfo</code> إلى قناة الاستعلام. كما هو موضح أدناه، <code translate="no">onlineNodeID</code> و <code translate="no">onlineSegmentIDs</code> يشيران إلى عقدة الاستعلام التي تقوم بتحميل المقطع والمقطع الذي تم تحميله على التوالي، و <code translate="no">offlineNodeID</code> و <code translate="no">offlineSegmentIDs</code> يشيران إلى عقدة الاستعلام التي تحتاج إلى تحرير المقطع والمقطع المراد تحريره على التوالي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>مختومةSegmentChangeInfo</span> </span></p>
<p>بعد تلقي <code translate="no">sealedSegmentChangeInfo</code> ، تقوم عقدة الاستعلام المصدر بعد ذلك بتحرير المقطع المستهدف.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>سير عمل موازنة التحميل</span> </span></p>
<p>تنجح العملية بأكملها عندما تقوم عقدة الاستعلام المصدر بتحرير المقطع المستهدف. بإكمال ذلك، يتم تعيين حمل الاستعلام متوازنًا عبر عقد الاستعلام، مما يعني أن استخدام ذاكرة الوصول العشوائي لجميع عقد الاستعلام ليس أكبر من <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> ، وتكون القيمة المطلقة لفرق استخدام ذاكرة الوصول العشوائي لعقد الاستعلام المصدر والوجهة بعد موازنة التحميل أقل من تلك التي كانت قبل موازنة التحميل.</p>
<h2 id="Whats-next" class="common-anchor-header">ما التالي؟<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>نهدف في مدونة سلسلة الميزات الجديدة 2.0 إلى شرح تصميم الميزات الجديدة. اقرأ المزيد في سلسلة المدونة هذه!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">كيف يحذف Milvus البيانات المتدفقة في مجموعة موزعة</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">كيفية ضغط البيانات في ميلفوس؟</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">كيف يوازن ميلفوس حمل الاستعلام عبر العقد؟</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">كيف تمكّن Bitset تعدد استخدامات البحث عن التشابه المتجهي</a></li>
</ul>
<p>هذه هي خاتمة سلسلة المدونات الخاصة بميزة Milvus 2.0 الجديدة. بعد هذه السلسلة، نحن نخطط لسلسلة جديدة من <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">الغوص العميق في</a> ميلفوس (Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>)، والتي تقدم البنية الأساسية لـ Milvus 2.0. يرجى الترقب.</p>
