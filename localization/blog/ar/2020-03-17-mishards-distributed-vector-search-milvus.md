---
id: mishards-distributed-vector-search-milvus.md
title: نظرة عامة على البنية الموزعة
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: كيفية التوسع
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>ميشاردز - البحث عن المتجهات الموزعة في ميلفوس</custom-h1><p>يهدف Milvus إلى تحقيق بحث تشابه فعال وتحليلات فعالة للمتجهات ذات النطاق الضخم. يمكن لمثيل Milvus المستقل أن يتعامل بسهولة مع البحث عن المتجهات لمليار متجه على نطاق مليار متجه. ومع ذلك، بالنسبة لمجموعات البيانات التي يبلغ حجمها 10 مليارات أو 100 مليار أو حتى مجموعات بيانات أكبر، هناك حاجة إلى مجموعة Milvus العنقودية. يمكن استخدام الكتلة كمثيل مستقل لتطبيقات المستوى الأعلى ويمكن أن تلبي احتياجات العمل من الكمون المنخفض والتزامن العالي للبيانات ذات النطاق الضخم. يمكن لمجموعة Milvus العنقودية إعادة إرسال الطلبات، وفصل القراءة عن الكتابة، والتوسع الأفقي، والتوسع ديناميكيًا، وبالتالي توفير مثيل Milvus الذي يمكن أن يتوسع بلا حدود. Mishards هو حل موزع لـ Milvus.</p>
<p>ستقدم هذه المقالة بإيجاز مكونات بنية Mishards. سيتم تقديم معلومات أكثر تفصيلاً في المقالات القادمة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-ميلفوس-ميلفوس-ميشاردز-ميشاردز.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">نظرة عامة على البنية الموزعة<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-نظرة عامة على البنية الموزعة.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">تتبع الخدمة<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-تتبع الخدمة-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">مكونات الخدمة الأساسية<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>إطار عمل اكتشاف الخدمة، مثل ZooKeeper، و etcd، و Consul.</li>
<li>موازن التحميل، مثل Nginx و HAProxy و Ingress Controller.</li>
<li>عقدة ميشاردز: عقدة عديمة الحالة وقابلة للتطوير.</li>
<li>عقدة ميلفوس للكتابة فقط: عقدة واحدة وغير قابلة للتطوير. تحتاج إلى استخدام حلول التوافر العالي لهذه العقدة لتجنب نقطة فشل واحدة.</li>
<li>عقدة ميلفوس للقراءة فقط: عقدة حالة وقابلة للتطوير.</li>
<li>خدمة تخزين مشتركة: تستخدم جميع عقد Milvus خدمة التخزين المشتركة لمشاركة البيانات، مثل NAS أو NFS.</li>
<li>خدمة البيانات الوصفية: تستخدم جميع عقد Milvus هذه الخدمة لمشاركة البيانات الوصفية. حالياً، يتم دعم MySQL فقط. تتطلب هذه الخدمة حل MySQL عالي التوفر.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">مكونات قابلة للتطوير<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>ميشاردز</li>
<li>عقد ميلفوس للقراءة فقط</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">مقدمة المكونات<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>عقد Mishards</strong></p>
<p>Mishards مسؤولة عن تقسيم طلبات المنبع وتوجيه الطلبات الفرعية إلى الخدمات الفرعية. يتم تلخيص النتائج للعودة إلى المنبع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-ميشاردز-عقدة. jpg</span> </span></p>
<p>كما هو موضح في الرسم البياني أعلاه، بعد قبول طلب بحث TopK، تقوم Mishards أولاً بتقسيم الطلب إلى طلبات فرعية وإرسال الطلبات الفرعية إلى خدمة المنبع. عندما يتم جمع جميع الاستجابات الفرعية، يتم دمج الاستجابات الفرعية وإعادتها إلى المنبع.</p>
<p>نظرًا لأن Mishards هي خدمة عديمة الحالة، فإنها لا تحفظ البيانات أو تشارك في عمليات حسابية معقدة. وبالتالي، لا تحتوي العقد على متطلبات تكوين عالية وتستخدم قوة الحوسبة بشكل أساسي في دمج النتائج الفرعية. لذلك، من الممكن زيادة عدد عقد Mishards للحصول على تزامن عالٍ.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">عقد ميلفوس<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>عُقد Milvus مسؤولة عن العمليات الأساسية المتعلقة بـ CRUD، لذا فإن لها متطلبات تكوين عالية نسبيًا. أولاً، يجب أن يكون حجم الذاكرة كبيرًا بما يكفي لتجنب الكثير من عمليات الإدخال والإخراج على القرص. ثانيًا، يمكن أن تؤثر تكوينات وحدة المعالجة المركزية أيضًا على الأداء. مع زيادة حجم المجموعة، يلزم المزيد من عقد Milvus لزيادة إنتاجية النظام.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">عقد القراءة فقط والعقد القابلة للكتابة</h3><ul>
<li>العمليات الأساسية لـ Milvus هي إدخال المتجهات والبحث. يحتوي البحث على متطلبات عالية للغاية على تكوينات وحدة المعالجة المركزية ووحدة معالجة الرسومات، في حين أن عمليات الإدراج أو العمليات الأخرى لها متطلبات منخفضة نسبيًا. يؤدي فصل العقدة التي تقوم بتشغيل البحث عن العقدة التي تقوم بتشغيل العمليات الأخرى إلى نشر أكثر اقتصاداً.</li>
<li>فيما يتعلق بجودة الخدمة، عندما تقوم العقدة بتشغيل عمليات البحث، فإن الأجهزة ذات الصلة تعمل بكامل طاقتها ولا يمكنها ضمان جودة خدمة العمليات الأخرى. لذلك، يتم استخدام نوعين من العقد. تتم معالجة طلبات البحث بواسطة عقد للقراءة فقط وتتم معالجة الطلبات الأخرى بواسطة عقد قابلة للكتابة.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">يُسمح بعقدة واحدة فقط قابلة للكتابة</h3><ul>
<li><p>لا يدعم ميلفوس حاليًا مشاركة البيانات لمثيلات متعددة قابلة للكتابة.</p></li>
<li><p>أثناء النشر، يجب مراعاة نقطة فشل واحدة للعقد القابلة للكتابة. يجب إعداد حلول التوافر العالي للعقد القابلة للكتابة.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">قابلية توسيع العقد القابلة للقراءة فقط</h3><p>عندما يكون حجم البيانات كبيراً للغاية، أو عندما تكون متطلبات زمن الاستجابة عالية للغاية، يمكنك توسيع نطاق عقد القراءة فقط أفقياً كعقد قابلة للكتابة. افترض أن هناك 4 مضيفين ولكل منهم التكوين التالي: نوى وحدة المعالجة المركزية: 16، وحدة معالجة الرسومات: 1، الذاكرة: 64 جيجابايت. يوضح المخطط التالي الكتلة عند توسيع نطاق العقد ذات الحالة أفقياً. يتم توسيع كل من قوة الحوسبة والذاكرة خطيًا. تنقسم البيانات إلى 8 أجزاء مع كل عقدة تعالج الطلبات من جزأين.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-قراءة فقط-عُقدة-قابلية التوسع-ميلفوس.png</span> </span></p>
<p>عندما يكون عدد الطلبات كبيرًا بالنسبة لبعض الأجزاء، يمكن نشر عقد القراءة فقط عديمة الحالة لهذه الأجزاء لزيادة الإنتاجية. خذ المضيفين أعلاه كمثال. عندما يتم دمج المضيفين في مجموعة بدون خادم، تزداد قوة الحوسبة خطيًا. نظرًا لأن البيانات المراد معالجتها لا تزيد، فإن قوة المعالجة لجزء البيانات نفسه تزداد خطيًا أيضًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-القراءة فقط-عُقدة-قابلة للتطوير-ملفوس-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">خدمة البيانات الوصفية</h3><p>الكلمات المفتاحية MySQL</p>
<p>لمزيد من المعلومات حول البيانات الوصفية لـ Milvus، راجع كيفية عرض البيانات الوصفية. في النظام الموزع، تكون عقد ميلفوس القابلة للكتابة هي المنتج الوحيد للبيانات الوصفية. تعتبر عقد Mishards وعقد Milvus القابلة للكتابة وعقد Milvus للقراءة فقط مستهلكين للبيانات الوصفية. في الوقت الحالي، يدعم Milvus حاليًا MySQL و SQLite فقط كخلفية تخزين للبيانات الوصفية. في النظام الموزع، لا يمكن نشر الخدمة إلا كخدمة MySQL عالية التوفر.</p>
<h3 id="Service-discovery" class="common-anchor-header">اكتشاف الخدمة</h3><p>الكلمات المفتاحية: Apache Zookeeper، إلخd، Consul، Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-اكتشاف الخدمة.png</span> </span></p>
<p>يوفر اكتشاف الخدمة معلومات حول جميع عقد ميلفوس. تقوم عقد ميلفوس بتسجيل معلوماتها عند الاتصال بالإنترنت وتسجيل الخروج عند عدم الاتصال. يمكن لعقد Milvus أيضًا اكتشاف العقد غير الطبيعية عن طريق التحقق من الحالة الصحية للخدمات بشكل دوري.</p>
<p>يحتوي اكتشاف الخدمة على الكثير من أطر العمل، بما في ذلك etcd و Consul و ZooKeeper وغيرها. يحدد Mishards واجهات اكتشاف الخدمة ويوفر إمكانيات للتوسع بواسطة المكونات الإضافية. حاليًا، يوفر Mishards نوعين من المكونات الإضافية، والتي تتوافق مع مجموعة Kubernetes والتكوينات الثابتة. يمكنك تخصيص اكتشاف الخدمة الخاصة بك عن طريق اتباع تنفيذ هذه المكونات الإضافية. الواجهات مؤقتة وتحتاج إلى إعادة تصميم. سيتم توضيح المزيد من المعلومات حول كتابة المكون الإضافي الخاص بك في المقالات القادمة.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">موازنة التحميل وتجزئة الخدمة</h3><p>الكلمات المفتاحية: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-موازنة التحميل وتقاسم الخدمة.png</span> </span></p>
<p>يتم استخدام اكتشاف الخدمة وموازنة التحميل معًا. يمكن تكوين موازنة التحميل على شكل اقتراع أو تجزئة أو تجزئة متسقة.</p>
<p>موازن التحميل مسؤول عن إعادة إرسال طلبات المستخدم إلى عقدة Mishards.</p>
<p>تحصل كل عقدة من عقد Mishards على معلومات جميع عقد Milvus النهائية عبر مركز اكتشاف الخدمة. يمكن الحصول على جميع البيانات الوصفية ذات الصلة عن طريق خدمة البيانات الوصفية. تقوم Mishards بتنفيذ التجزئة من خلال استهلاك هذه الموارد. يحدد Mishards الواجهات المتعلقة باستراتيجيات التوجيه ويوفر الإضافات عبر المكونات الإضافية. في الوقت الحالي، يوفر Mishards استراتيجية تجزئة متسقة استنادًا إلى أدنى مستوى مقطع. كما هو موضح في الرسم البياني، هناك 10 شرائح، من s1 إلى s10. وفقًا لاستراتيجية التجزئة المتسقة المستندة إلى المقاطع، يقوم Mishards بتوجيه الطلبات المتعلقة بالمقاطع s1 و s24 و s6 و s9 إلى عقدة Milvus 1، و s2 و s3 و s5 إلى عقدة Milvus 2، و s7 و s8 و s10 إلى عقدة Milvus 3.</p>
<p>استنادًا إلى احتياجات عملك، يمكنك تخصيص التوجيه باتباع المكون الإضافي الافتراضي للتوجيه المتسق للتجزئة.</p>
<h3 id="Tracing" class="common-anchor-header">التتبع</h3><p>الكلمات المفتاحية: التتبع المفتوح، جايجر، زيبكين</p>
<p>بالنظر إلى تعقيد النظام الموزع، يتم إرسال الطلبات إلى استدعاءات خدمة داخلية متعددة. للمساعدة في تحديد المشاكل، نحتاج إلى تتبع سلسلة استدعاءات الخدمة الداخلية. ومع ازدياد التعقيد، فإن فوائد نظام التتبع المتاح لا تحتاج إلى شرح. نختار معيار CNCF OpenTracing. يوفر OpenTracing واجهات برمجة تطبيقات مستقلة عن النظام الأساسي ومستقلة عن البائعين للمطورين لتنفيذ نظام التتبع بسهولة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-التتبع-عرض تجريبي-ملفوس.png</span> </span></p>
<p>المخطط السابق هو مثال على التتبع أثناء استدعاء البحث. يستدعي البحث <code translate="no">get_routing</code> و <code translate="no">do_search</code> و <code translate="no">do_merge</code> على التوالي. <code translate="no">do_search</code> يستدعي أيضًا <code translate="no">search_127.0.0.1</code>.</p>
<p>يشكل سجل التتبع بأكمله الشجرة التالية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-بحث-تتبع-التتبع-ملفوس.png</span> </span></p>
<p>يوضح المخطط التالي أمثلة على معلومات الطلب/الاستجابة وعلامات كل عقدة:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>طلب-استجابة-معلومات-علامات-عُقدة-ملفوس.png</span> </span></p>
<p>تم دمج التتبع المفتوح في ميلفوس. سيتم تغطية المزيد من المعلومات في المقالات القادمة.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">المراقبة والتنبيه</h3><p>الكلمات المفتاحية: بروميثيوس، جرافانا</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-مراقبة-تنبيه-ملفوس.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">ملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>كبرنامج وسيط للخدمة، يدمج Mishards اكتشاف الخدمة وطلب التوجيه ودمج النتائج والتتبع. كما يتم توفير التوسعة القائمة على المكونات الإضافية. في الوقت الحالي، لا تزال الحلول الموزعة القائمة على Mishards تعاني من العوائق التالية:</p>
<ul>
<li>يستخدم Mishards البروكسي كطبقة وسطى ولديه تكاليف زمن انتقال.</li>
<li>عقد ميلفوس القابلة للكتابة هي خدمات أحادية النقطة.</li>
<li>تعتمد على خدمة MySQL المتوفرة بشكل كبير. -يعتبر النشر معقدًا عندما يكون هناك عدة أجزاء ويكون للجزء الواحد نسخ متعددة.</li>
<li>تفتقر إلى طبقة ذاكرة التخزين المؤقت، مثل الوصول إلى البيانات الوصفية.</li>
</ul>
<p>سنقوم بإصلاح هذه المشكلات المعروفة في الإصدارات القادمة بحيث يمكن تطبيق Mishards على بيئة الإنتاج بشكل أكثر ملاءمة.</p>
