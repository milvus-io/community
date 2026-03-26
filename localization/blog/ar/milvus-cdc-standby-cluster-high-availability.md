---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  التوفر العالي لقاعدة البيانات الناقلة: كيفية إنشاء مجموعة احتياطية لقاعدة
  بيانات ميلفوس الاحتياطية باستخدام CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  تعرّف على كيفية إنشاء قاعدة بيانات متجهة عالية التوفر باستخدام Milvus CDC.
  دليل تفصيلي خطوة بخطوة للنسخ المتماثل الأساسي-الاحتياطي، وتجاوز الفشل،
  والتعافي من مخاطر الإنتاج.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>تحتاج كل قاعدة بيانات إنتاج إلى خطة عندما تسوء الأمور. لقد كان لدى قواعد البيانات العلائقية شحن WAL، والنسخ المتماثل بين المدونات، والتجاوز الآلي للأعطال لعقود من الزمن. لكن <a href="https://zilliz.com/learn/what-is-a-vector-database">قواعد البيانات المتجهة</a> - على الرغم من أنها أصبحت بنية تحتية أساسية لتطبيقات الذكاء الاصطناعي - لا تزال في طور اللحاق بالركب في هذا المجال. فمعظمها يوفر التكرار على مستوى العقدة في أحسن الأحوال. إذا تعطلت مجموعة كاملة، فإنك تقوم بالاستعادة من النسخ الاحتياطية وإعادة بناء <a href="https://zilliz.com/learn/vector-index">فهارس المتجهات</a> من الصفر - وهي عملية قد تستغرق ساعات وتكلف الآلاف في الحوسبة، لأن إعادة إنشاء <a href="https://zilliz.com/glossary/vector-embeddings">التضمينات</a> من خلال خط أنابيب التعلم الآلي ليس رخيصاً.</p>
<p>يتبع<a href="https://milvus.io/">ميلفوس</a> نهجاً مختلفاً. فهو يوفر توافرًا عالي الطبقات: نسخ متماثلة على مستوى العقدة للتجاوز السريع للفشل داخل المجموعة، والنسخ المتماثل القائم على CDC للحماية على مستوى المجموعة والحماية عبر المناطق، والنسخ الاحتياطي لاستعادة شبكة الأمان. هذا النموذج متعدد الطبقات هو ممارسة قياسية في قواعد البيانات التقليدية - ميلفوس هو أول قاعدة بيانات متجهة رئيسية تجلبه إلى أعباء عمل المتجهات.</p>
<p>يغطي هذا الدليل أمرين: استراتيجيات التوافر العالي المتاحة لقواعد البيانات المتجهة (حتى تتمكن من تقييم ما تعنيه عبارة "جاهز للإنتاج" في الواقع)، وبرنامج تعليمي عملي لإعداد النسخ المتماثل الأساسي والاحتياطي لقاعدة بيانات Milvus CDC من الصفر.</p>
<blockquote>
<p>هذا هو <strong>الجزء 1</strong> من سلسلة:</p>
<ul>
<li><strong>الجزء 1</strong> (هذه المقالة): إعداد النسخ المتماثل الابتدائي-الاحتياطي على مجموعات جديدة</li>
<li><strong>الجزء 2</strong>: إضافة CDC إلى مجموعة حالية تحتوي على بيانات بالفعل، باستخدام <a href="https://milvus.io/docs/milvus_backup_overview.md">النسخ الاحتياطي ل Milvus Backup</a></li>
<li><strong>الجزء 3</strong>: إدارة تجاوز الفشل - ترقية النسخة الاحتياطية عند تعطل الأساسي</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">لماذا يعتبر التوفر العالي أكثر أهمية لقواعد البيانات الناقلة؟<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما تتعطل قاعدة بيانات SQL التقليدية، فإنك تفقد إمكانية الوصول إلى السجلات المنظمة - ولكن يمكن عادةً إعادة استيراد البيانات نفسها من مصادر المنبع. عندما تتعطل قاعدة البيانات المتجهة، يكون الاسترداد أصعب بشكل أساسي.</p>
<p>تخزن قواعد البيانات المتجهة <a href="https://zilliz.com/glossary/vector-embeddings">التضمينات</a> - وهي تمثيلات عددية كثيفة تم إنشاؤها بواسطة نماذج التعلم الآلي. تعني إعادة بنائها إعادة تشغيل مجموعة بياناتك بأكملها من خلال خط أنابيب التضمين: تحميل المستندات الخام، وتقطيعها، واستدعاء <a href="https://zilliz.com/ai-models">نموذج التضمين،</a> وإعادة فهرسة كل شيء. بالنسبة لمجموعة بيانات تحتوي على مئات الملايين من المتجهات، يمكن أن يستغرق ذلك أيامًا ويكلف آلاف الدولارات في حوسبة وحدة معالجة الرسومات.</p>
<p>وفي الوقت نفسه، غالباً ما تكون الأنظمة التي تعتمد على <a href="https://zilliz.com/learn/what-is-vector-search">البحث عن المتجهات</a> في المسار الحرج:</p>
<ul>
<li><strong>خطوط أنابيب<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong> التي تشغل روبوتات الدردشة والبحث التي تواجه العملاء - إذا تعطلت قاعدة بيانات المتجهات، يتوقف الاسترجاع ويعيد الذكاء الاصطناعي إجابات عامة أو مهلوسة.</li>
<li><strong>محركات التوصيات</strong> التي تقدم اقتراحات المنتجات أو المحتوى في الوقت الفعلي - إذا تعطلت هذه المحركات فإن ذلك يعني ضياع الإيرادات.</li>
<li>أنظمة<strong>الكشف عن الاحتيال ومراقبة الحالات الشاذة</strong> التي تعتمد على <a href="https://zilliz.com/glossary/similarity-search">البحث عن التشابه</a> للإبلاغ عن النشاط المشبوه - أي فجوة في التغطية تخلق نافذة من الضعف.</li>
<li><strong>أنظمة الوكلاء المستقلين</strong> التي تستخدم مخازن المتجهات للذاكرة واسترجاع الأدوات - يفشل الوكلاء أو يتعطلون بدون قاعدة معرفتهم.</li>
</ul>
<p>إذا كنت تقوم بتقييم قواعد بيانات المتجهات لأي من حالات الاستخدام هذه، فإن التوافر العالي ليس ميزة لطيفة للتحقق منها لاحقًا. يجب أن تكون من أول الأشياء التي تنظر إليها.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">كيف يبدو التوافر العالي على مستوى الإنتاج لقاعدة بيانات المتجهات؟<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>ليست كل التوافر العالي متساوية. قاعدة البيانات المتجهة التي تتعامل فقط مع حالات فشل العقدة داخل مجموعة واحدة ليست "متاحة بدرجة عالية" بالطريقة التي يتطلبها نظام الإنتاج. يحتاج HA الحقيقي إلى تغطية ثلاث طبقات:</p>
<table>
<thead>
<tr><th>الطبقة</th><th>ما تحميه</th><th>كيف تعمل</th><th>وقت الاسترداد</th><th>فقدان البيانات</th></tr>
</thead>
<tbody>
<tr><td><strong>على مستوى العقدة</strong> (متعدد النسخ)</td><td>تعطل عقدة واحدة، أو فشل في الأجهزة، أو تعطل OOM، أو فشل AZ</td><td>نسخ <a href="https://milvus.io/docs/glossary.md">مقاطع البيانات</a> نفسها عبر عقد متعددة؛ العقد الأخرى تمتص الحمل</td><td>فوري</td><td>صفر</td></tr>
<tr><td><strong>على مستوى المجموعة</strong> (النسخ المتماثل CDC)</td><td>تعطل المجموعة بأكملها - طرح سيء ل K8s، حذف مساحة الاسم، تلف التخزين</td><td>دفق كل عملية كتابة إلى مجموعة احتياطية عبر <a href="https://milvus.io/docs/four_layers.md">سجل الكتابة الأمامي؛</a> يكون الاحتياطي دائمًا متأخرًا بثوانٍ</td><td>دقائق</td><td>ثوانٍ</td></tr>
<tr><td><strong>شبكة الأمان</strong> (النسخ الاحتياطي الدوري)</td><td>تلف البيانات الكارثي، وبرامج الفدية، والخطأ البشري الذي ينتشر من خلال النسخ المتماثل</td><td>أخذ لقطات دورية وتخزينها في موقع منفصل</td><td>ساعات</td><td>ساعات (منذ آخر نسخة احتياطية)</td></tr>
</tbody>
</table>
<p>هذه الطبقات مكملة وليست بدائل. يجب أن يكدسها نشر الإنتاج:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replica</a> أولاً</strong> - تتعامل مع الأعطال الأكثر شيوعًا (تعطل العقدة وفشل AZ) بدون أي تعطل وبدون فقدان للبيانات.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> تاليًا</strong> - يحمي من الأعطال التي لا يمكن للنسخ المتعددة أن تحميها: انقطاع التيار الكهربائي على مستوى المجموعة أو خطأ بشري كارثي. الكتلة الاحتياطية في مجال فشل مختلف.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">النسخ الاحتياطية الدورية</a> دائمًا</strong> - شبكة الأمان الخاصة بك كملاذ أخير. حتى CDC لا يمكن أن ينقذك إذا تم نسخ البيانات التالفة إلى النسخة الاحتياطية قبل أن تلتقطها.</li>
</ol>
<p>عند تقييم قواعد البيانات المتجهة، اسأل: أي من هذه الطبقات الثلاث يدعمها المنتج بالفعل؟ تقدم معظم قواعد بيانات المتجهات اليوم الطبقة الأولى فقط. تدعم Milvus جميع الطبقات الثلاث، مع ميزة CDC كميزة مدمجة - وليست إضافة من طرف ثالث.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">ما هو Milvus CDC وكيف يعمل؟<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>تعدّ ميزة<strong>التقاط بيانات التغيير (CDC)</strong> من<strong>Milvus</strong> ميزة مدمجة للنسخ المتماثل تقوم بقراءة <a href="https://milvus.io/docs/four_layers.md">سجل الكتابة الأمامي</a> للمجموعة الأساسية <a href="https://milvus.io/docs/four_layers.md">(WAL)</a> وتدفق كل إدخال إلى مجموعة احتياطية منفصلة. تقوم المجموعة الاحتياطية بإعادة تشغيل الإدخالات وينتهي بها الأمر بنفس البيانات، وعادةً ما تكون متأخرة بثوانٍ.</p>
<p>هذا النمط راسخ في عالم قواعد البيانات. لدى MySQL نسخ متماثل ثنائي السجل. PostgreSQL لديها شحن WAL. لدى MongoDB النسخ المتماثل القائم على oplog. هذه هي التقنيات التي أثبتت جدواها والتي حافظت على تشغيل قواعد البيانات العلائقية والمستندات في الإنتاج لعقود. تقدم Milvus نفس النهج لأعباء عمل المتجهات - فهي أول <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بيانات متجهة</a> رئيسية تقدم النسخ المتماثل المستند إلى WAL كميزة مدمجة.</p>
<p>هناك ثلاث خصائص تجعل من قاعدة بيانات CDC ملائمة بشكل جيد للتعافي من الكوارث:</p>
<ul>
<li><strong>مزامنة منخفضة الكمون.</strong> يقوم CDC ببث العمليات فور حدوثها، وليس على دفعات مجدولة. يبقى الاحتياطي متأخراً بثوانٍ عن الأساسي في الظروف العادية.</li>
<li><strong>إعادة تشغيل مرتبة.</strong> تصل العمليات إلى الاحتياطي بنفس الترتيب الذي تمت كتابتها به. تبقى البيانات متسقة بدون تسوية.</li>
<li><strong>استرداد نقطة التدقيق.</strong> إذا تعطلت عملية CDC أو تعطلت الشبكة، فإنها تستأنف من حيث توقفت. لا يتم تخطي أو تكرار أي بيانات.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">كيف تعمل بنية CDC؟</h3><p>يحتوي نشر CDC على ثلاثة مكونات:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>بنية CDC التي تُظهر مجموعة المصدر مع عقد البث وعقد CDC التي تستهلك WAL، وتنسخ البيانات إلى طبقة الوكيل في المجموعة الهدف، والتي تقوم بإعادة توجيه عمليات DDL/DCL/DML إلى عقد البث وإلحاقها ب WAL</span> </span></p>
<table>
<thead>
<tr><th>المكوّن</th><th>الدور</th></tr>
</thead>
<tbody>
<tr><td><strong>المجموعة الأساسية</strong></td><td><a href="https://milvus.io/docs/architecture_overview.md">مثيل</a> الإنتاج <a href="https://milvus.io/docs/architecture_overview.md">Milvus</a>. تتم جميع عمليات القراءة والكتابة هنا. يتم تسجيل كل كتابة في WAL.</td></tr>
<tr><td><strong>عقدة CDC</strong></td><td>عملية خلفية إلى جانب الأساسي. تقرأ إدخالات WAL وتعيد توجيهها إلى النسخة الاحتياطية. يتم تشغيلها بشكل مستقل عن مسار القراءة/الكتابة - لا تأثير على أداء الاستعلام أو الإدراج.</td></tr>
<tr><td><strong>المجموعة الاحتياطية</strong></td><td>مثيل Milvus منفصل يقوم بإعادة توجيه إدخالات WAL المعاد توجيهها. يحتفظ بالبيانات نفسها التي يحتفظ بها الأساسي متأخرًا بثوانٍ. يمكن أن تخدم استعلامات القراءة ولكنها لا تقبل الكتابة.</td></tr>
</tbody>
</table>
<p>التدفق: تصل الكتابات إلى الأساسي ← تقوم عقدة CDC بنسخها إلى النسخة الاحتياطية ← تقوم النسخة الاحتياطية بإعادة تشغيلها. لا شيء آخر يتصل بمسار الكتابة في الوضع الاحتياطي. إذا تعطل الأساسيّ، فإن الاحتياطي لديه بالفعل جميع البيانات تقريبًا ويمكن ترقيته.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">البرنامج التعليمي: إعداد مجموعة احتياطية لـ Milvus CDC الاحتياطية<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>ما تبقى من هذه المقالة هو إرشادات عملية. في النهاية، سيكون لديك مجموعتان من مجموعات Milvus تعملان مع النسخ المتماثل في الوقت الحقيقي بينهما.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p>قبل البدء:</p>
<ul>
<li><strong><a href="https://milvus.io/">ميلفوس</a> الإصدار 2.6.6 أو أحدث.</strong> يتطلب CDC هذا الإصدار. يوصى بأحدث تصحيح 2.6.x.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">مشغل Milvus</a> الإصدار 1.3.4 أو أحدث.</strong> يستخدم هذا الدليل المشغل لإدارة المجموعة على Kubernetes.</li>
<li><strong>مجموعة Kubernetes قيد التشغيل</strong> مع تكوين <code translate="no">kubectl</code> و <code translate="no">helm</code>.</li>
<li><strong>Python مع <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> لخطوة تكوين النسخ المتماثل.</li>
</ul>
<p>قيدان في الإصدار الحالي:</p>
<table>
<thead>
<tr><th>القيد</th><th>التفاصيل</th></tr>
</thead>
<tbody>
<tr><td>نسخة متماثلة واحدة من CDC</td><td>نسخة متماثلة واحدة من CDC لكل مجموعة. تم التخطيط لتوزيع CDC لإصدار مستقبلي.</td></tr>
<tr><td>لا يوجد إدراج مجمّع</td><td>لا يتم دعم<a href="https://milvus.io/docs/import-data.md">الإدراج المجمع</a> أثناء تمكين CDC. مخطط أيضًا لإصدار مستقبلي.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">الخطوة 1: ترقية مشغل Milvus</h3><p>قم بترقية مشغل Milvus إلى الإصدار v1.3.4 أو أحدث:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من تشغيل جراب المشغل:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">الخطوة 2: نشر المجموعة الأساسية</h3><p>قم بإنشاء ملف YAML للمجموعة الأساسية (المصدر). يخبر قسم <code translate="no">cdc</code> تحت <code translate="no">components</code> المشغل بنشر عقدة CDC إلى جانب الكتلة:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>يستخدم الإعداد <code translate="no">msgStreamType: woodpecker</code> إعداد إعداد ميلفوس <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a> المدمج في Woodpecker بدلاً من قائمة انتظار رسائل خارجية مثل Kafka أو Pulsar. Woodpecker هو سجل كتابة أمامي سحابي أصلي تم تقديمه في Milvus 2.6 الذي يزيل الحاجة إلى بنية تحتية خارجية للمراسلة.</p>
<p>تطبيق التكوين:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>انتظر حتى تصل جميع البودات إلى حالة التشغيل. تأكد من أن جراب CDC قيد التشغيل:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">الخطوة 3: نشر المجموعة الاحتياطية</h3><p>تستخدم المجموعة الاحتياطية (الهدف) نفس إصدار Milvus ولكنها لا تتضمن مكون CDC - فهي تستقبل البيانات المنسوخة فقط:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>تطبيق:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من تشغيل جميع الكبسولات:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">الخطوة 4: تكوين علاقة النسخ المتماثل</h3><p>مع تشغيل كلا المجموعتين، قم بتكوين طوبولوجيا النسخ المتماثل باستخدام Python مع <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>حدد تفاصيل اتصال المجموعة وأسماء القنوات الفعلية (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>بناء تكوين النسخ المتماثل:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>تطبيقه على كلا المجموعتين:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد أن ينجح ذلك، تبدأ التغييرات الإضافية على الأساسي في النسخ المتماثل إلى الاحتياطي تلقائيًا.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">الخطوة 5: التحقق من أن النسخ المتماثل يعمل</h3><ol>
<li>اتصل بالأساسي <a href="https://milvus.io/docs/manage-collections.md">وأنشئ مجموعة،</a> <a href="https://milvus.io/docs/insert-update-delete.md">وأدخل بعض النواقل،</a> وقم <a href="https://milvus.io/docs/load-and-release.md">بتحميلها</a></li>
<li>قم بإجراء بحث على الأساسي للتأكد من وجود البيانات هناك</li>
<li>اتصل بالنسخة الاحتياطية وقم بإجراء نفس البحث</li>
<li>إذا أرجع الوضع الاحتياطي نفس النتائج، فإن النسخ المتماثل يعمل</li>
</ol>
<p>يغطي برنامج <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> إنشاء المجموعة وإدراجها والبحث عنها إذا كنت بحاجة إلى مرجع.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">تشغيل CDC في الإنتاج<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>إعداد CDC هو الجزء المباشر. يتطلب الحفاظ على موثوقيتها بمرور الوقت الاهتمام ببعض المجالات التشغيلية.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">مراقبة تأخر النسخ المتماثل</h3><p>دائمًا ما يكون الاحتياطي متأخرًا قليلاً عن الأساسي - وهذا متأصل في النسخ المتماثل غير المتزامن. في ظل الحمل العادي، يكون التأخير بضع ثوانٍ. ولكن يمكن أن تتسبب طفرات الكتابة أو ازدحام الشبكة أو ضغط الموارد على النسخة الاحتياطية في زيادة هذا التأخر.</p>
<p>تتبع التأخر كمقياس وتنبه إليه. عادةً ما يعني التأخر الذي ينمو دون أن يتعافى أن عقدة CDC لا يمكنها مواكبة إنتاجية الكتابة. تحقق من عرض النطاق الترددي للشبكة بين المجموعات أولاً، ثم فكر فيما إذا كانت العقدة الاحتياطية تحتاج إلى المزيد من الموارد.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">استخدم الاحتياطي لتوسيع نطاق القراءة</h3><p>لا يعد الاحتياطي مجرد نسخة احتياطية باردة تجلس في وضع الخمول حتى وقوع الكارثة. فهو يقبل <a href="https://milvus.io/docs/single-vector-search.md">طلبات البحث والاستعلام</a> أثناء تنشيط النسخ المتماثل - حيث يتم حظر عمليات الكتابة فقط. هذا يفتح استخدامات عملية:</p>
<ul>
<li>توجيه أعباء عمل <a href="https://zilliz.com/glossary/similarity-search">البحث</a> أو التحليلات <a href="https://zilliz.com/glossary/similarity-search">المتشابهة</a> الدفعية إلى الوضع الاحتياطي</li>
<li>تقسيم حركة مرور القراءة خلال ساعات الذروة لتقليل الضغط على النظام الأساسي</li>
<li>تشغيل استعلامات باهظة الثمن (عمليات بحث كبيرة من أعلى K، وعمليات بحث تمت تصفيتها عبر مجموعات كبيرة) دون التأثير على زمن انتقال الكتابة في الإنتاج</li>
</ul>
<p>هذا يحول البنية التحتية للتشغيل الاحتياطي إلى أصل من أصول الأداء. يكسب الاحتياطي أجره حتى في حالة عدم تعطل أي شيء.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">تحديد حجم الاحتياطي بشكل صحيح</h3><p>يعيد الاحتياطي تكرار كل عملية كتابة من الرئيسي، لذا فهو يحتاج إلى موارد حوسبة وذاكرة مماثلة. إذا كنت تقوم أيضًا بتوجيه القراءات إليه، فضع في الحسبان هذا الحمل الإضافي. متطلبات التخزين متطابقة - فهي تحتوي على نفس البيانات.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">اختبر تجاوز الفشل قبل أن تحتاج إليه</h3><p>لا تنتظر انقطاعاً حقيقياً لتكتشف أن عملية تجاوز الفشل لا تعمل. قم بإجراء تدريبات دورية:</p>
<ol>
<li>أوقف الكتابة إلى الأساسي</li>
<li>انتظر حتى يلحق الاحتياطي (تأخر → 0)</li>
<li>ترقية الاحتياطي</li>
<li>تحقق من أن الاستعلامات تُرجع النتائج المتوقعة</li>
<li>عكس العملية</li>
</ol>
<p>قياس المدة التي تستغرقها كل خطوة وتوثيقها. الهدف من ذلك هو جعل عملية تجاوز الفشل إجراءً روتينيًا بتوقيت معروف - وليس ارتجالاً مرهقًا في الساعة 3 صباحًا. يغطي الجزء 3 من هذه السلسلة عملية تجاوز الفشل بالتفصيل.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">لا ترغب في إدارة مركز السيطرة على الأقراص المضغوطة بنفسك؟ تتولى Zilliz Cloud ذلك<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد إعداد وتشغيل النسخ المتماثل للنسخ المتماثل CDC لـ Milvus أمرًا قويًا، ولكنه يأتي مع نفقات تشغيلية: يمكنك إدارة مجموعتين، ومراقبة سلامة النسخ المتماثل، والتعامل مع دفاتر تشغيل تجاوز الفشل، وصيانة البنية التحتية عبر المناطق. أما بالنسبة للفرق التي ترغب في الحصول على نظام HA على مستوى الإنتاج دون العبء التشغيلي، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدار) يوفر ذلك خارج الصندوق.</p>
<p><strong>الكتلة العالمية</strong> هي الميزة الرئيسية في Zilliz Cloud. فهي تتيح لك تشغيل نشر Milvus في مناطق متعددة - أمريكا الشمالية وأوروبا وآسيا والمحيط الهادئ وغيرها - كمجموعة منطقية واحدة. تحت غطاء المحرك، يستخدم نفس تقنية النسخ المتماثل CDC/WAL الموضحة في هذه المقالة، ولكن تتم إدارتها بالكامل:</p>
<table>
<thead>
<tr><th>القدرة</th><th>CDC ذاتية الإدارة (هذه المقالة)</th><th>مجموعة زيليز السحابية العالمية</th></tr>
</thead>
<tbody>
<tr><td><strong>النسخ المتماثل</strong></td><td>يمكنك تكوين ومراقبة</td><td>خط أنابيب CDC التلقائي غير المتزامن</td></tr>
<tr><td><strong>تجاوز الفشل</strong></td><td>دليل التشغيل اليدوي</td><td>مؤتمت - لا تغييرات في التعليمات البرمجية، ولا تحديثات لسلسلة الاتصال</td></tr>
<tr><td><strong>الشفاء الذاتي</strong></td><td>تقوم بإعادة توفير المجموعة الفاشلة</td><td>تلقائي: يكتشف الحالة القديمة ويعيد تعيينها ويعيد بناءها كمجموعة ثانوية جديدة</td></tr>
<tr><td><strong>عبر المنطقة</strong></td><td>يمكنك نشر وإدارة كلا المجموعتين</td><td>منطقة متعددة مدمجة مع وصول محلي للقراءة</td></tr>
<tr><td><strong>RPO</strong></td><td>ثوانٍ (يعتمد على المراقبة الخاصة بك)</td><td>ثوانٍ (غير مخطط لها) / صفر (تبديل مخطط له)</td></tr>
<tr><td><strong>وقت التشغيل الفعلي</strong></td><td>دقائق (يعتمد على دفتر التشغيل الخاص بك)</td><td>دقائق (تلقائي)</td></tr>
</tbody>
</table>
<p>بالإضافة إلى الكتلة العالمية، تتضمن خطة الأعمال الحرجة ميزات إضافية للتعافي من الكوارث:</p>
<ul>
<li><strong>الاسترداد في الوقت المحدد (PITR)</strong> - استرجاع مجموعة إلى أي لحظة ضمن نافذة الاحتفاظ، وهو مفيد للتعافي من الحذف العرضي أو تلف البيانات الذي يتم نسخه إلى النسخة الاحتياطية.</li>
<li>النسخ<strong>الاحتياطي عبر المنطقة</strong> - النسخ الاحتياطي التلقائي والمستمر للنسخ الاحتياطي إلى منطقة وجهة. تستغرق الاستعادة إلى مجموعات جديدة دقائق.</li>
<li><strong>اتفاقية مستوى الخدمة لوقت التشغيل بنسبة 99.99%</strong> - مدعوم بالنشر متعدد المناطق مع نسخ متماثلة متعددة.</li>
</ul>
<p>إذا كنت تدير بحثًا متجهًا في الإنتاج وكان استرجاع البيانات في حالات الطوارئ متطلبًا، فإن الأمر يستحق تقييم Zilliz Cloud إلى جانب نهج Milvus المُدار ذاتيًا. <a href="https://zilliz.com/contact-sales">اتصل بفريق Zilliz</a> للحصول على التفاصيل.</p>
<h2 id="Whats-Next" class="common-anchor-header">ما التالي<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>غطت هذه المقالة مشهد HA لقواعد البيانات المتجهة وغطت مشهد HA لقواعد البيانات المتجهة ومرت عبر بناء زوج أساسي-احتياطي من الصفر. التالي:</p>
<ul>
<li><strong>الجزء 2</strong>: إضافة CDC إلى مجموعة Milvus الحالية التي تحتوي على بيانات بالفعل، باستخدام <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> لتأسيس النسخة الاحتياطية قبل تمكين النسخ المتماثل</li>
<li><strong>الجزء 3</strong>: إدارة تجاوز الفشل - ترقية الوضع الاحتياطي، وإعادة توجيه حركة المرور، واستعادة الأساسي الأصلي</li>
</ul>
<p>ترقبوا.</p>
<hr>
<p>إذا كنت تقوم بتشغيل <a href="https://milvus.io/">Milvus</a> في الإنتاج وتفكر في التعافي من الكوارث، فنحن نود مساعدتك:</p>
<ul>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> لطرح الأسئلة، ومشاركة بنية HA الخاصة بك، والتعلم من الفرق الأخرى التي تدير Milvus على نطاق واسع.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية مدتها 20 دقيقة في ساعات عمل Milvus المكتبية</a> للتعرف على إعدادات التعافي من الكوارث - سواءً كان ذلك في تكوين مركز البيانات المضغوط أو تخطيط تجاوز الفشل أو النشر متعدد المناطق.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية والانتقال مباشرةً إلى التوافر العالي الجاهز للإنتاج، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدار من قبل Milvus) يوفر توافرًا عاليًا عبر المناطق من خلال ميزة Global Cluster - لا حاجة إلى إعداد CDC يدويًا.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تظهر عندما تبدأ الفرق في إعداد التوافر العالي لقاعدة البيانات المتجهة:</p>
<p><strong>س: هل يبطئ CDC الكتلة الأساسية؟</strong></p>
<p>ج: لا. تقرأ عقدة CDC سجلات WAL بشكل غير متزامن، بشكل مستقل عن مسار القراءة/الكتابة. فهي لا تتنافس مع الاستعلامات أو الإدخالات على الموارد على الأساسي. لن ترى فرقًا في الأداء مع تمكين CDC.</p>
<p><strong>س: هل يمكن ل CDC نسخ البيانات التي كانت موجودة قبل تمكينه؟</strong></p>
<p>ج: لا - يلتقط CDC التغييرات فقط من نقطة تمكينه. لجلب البيانات الموجودة إلى الوضع الاحتياطي، استخدم <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> لبدء النسخ الاحتياطي أولاً، ثم قم بتمكين CDC للنسخ المتماثل المستمر. يغطي الجزء 2 من هذه السلسلة سير العمل هذا.</p>
<p><strong>س: هل ما زلت بحاجة إلى CDC إذا كان لدي بالفعل تمكين النسخ المتماثل المتعدد؟</strong></p>
<p>إنها تحمي من أوضاع الفشل المختلفة. تحتفظ النسخ <a href="https://milvus.io/docs/replica.md">المتماثلة المتعددة</a> بنسخ من نفس <a href="https://milvus.io/docs/glossary.md">المقاطع</a> عبر العُقد داخل مجموعة واحدة - وهو أمر رائع في حالات فشل العُقد، ولا فائدة منه عند اختفاء المجموعة بأكملها (نشر سيء، انقطاع التيار من الألف إلى الياء، حذف مساحة الاسم). يحتفظ CDC بمجموعة منفصلة في مجال فشل مختلف مع بيانات شبه فورية. بالنسبة لأي شيء يتجاوز بيئة التطوير، فأنت بحاجة إلى كليهما.</p>
<p><strong>س: كيف تقارن Milvus CDC بالنسخ المتماثل في قواعد البيانات المتجهة الأخرى؟</strong></p>
<p>تقدم معظم قواعد البيانات المتجهة اليوم تكرارًا على مستوى العقدة (ما يعادل النسخ المتكرر المتعدد) ولكنها تفتقر إلى النسخ المتماثل على مستوى المجموعة. تُعد Milvus حاليًا قاعدة البيانات المتجهة الرئيسية الوحيدة التي تحتوي على النسخ المتماثل CDC المدمج المستند إلى WAL - وهو نفس النمط المثبت الذي استخدمته قواعد البيانات العلائقية مثل PostgreSQL و MySQL لعقود. إذا كان تجاوز الفشل عبر المجموعات أو عبر المناطق متطلبًا، فإن هذا عامل تفاضل مفيد للتقييم.</p>
