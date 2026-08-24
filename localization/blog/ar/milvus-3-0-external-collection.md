---
id: milvus-3-0-external-collection.md
title: >-
  Milvus External Collection: فهرسة واسترجاع البيانات المقيمة في بحيرة البيانات
  دون نقلها
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  قدّم Milvus 3.0 ميزة External Collection، مما يسمح لـ Milvus ببناء الفهارس
  وتقديم الاسترجاع على البيانات التي تبقى في بحيرة البيانات.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>في العديد من خطوط أنابيب الذكاء الاصطناعي، تُنتَج التضمينات (embeddings) والبيانات الوصفية وتُخزَّن بالفعل في بحيرة بيانات. قد يكتب خط أنابيب المنتجات سمات المنتجات وتضمينات متعددة الوسائط إلى ملفات Parquet في S3. قد تعيش مجموعة بيانات الاسترجاع أو التدريب في جدول Iceberg أو Lance. بحيرة البيانات هي بالفعل المكان الذي تُنشأ فيه هذه المجموعات، وتُحدَّث، وتُدار إصداراتها، وتستخدمها بقية مكونات البنية التحتية للبيانات.</p>
<p>غير أن قواعد بيانات المتجهات بُنيت تقليديًا حول نسخة تقديم مملوكة لقاعدة البيانات. إذا أرادت الفرق إجراء بحث متجهي منخفض زمن الاستجابة على بيانات موجودة بالفعل في بحيرة، فعادةً ما كان أمامها خياران:</p>
<ul>
<li><strong>نسخ البيانات إلى قاعدة بيانات متجهات.</strong> يوفر هذا فهارس ANN ومسار تقديم إنتاجي، لكنه ينشئ نسخة ثانية من مجموعة البيانات وخط أنابيب ETL يجب أن يظل متزامنًا مع المصدر.</li>
<li><strong>الاستعلام عن البحيرة مباشرة.</strong> يتجنب هذا التكرار، لكن بدون طبقة فهرسة وتقديم ANN، يتراجع البحث المتجهي إلى عمليات مسح غير مصممة لزمن استجابة الإنتاج.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>المجموعة الخارجية (External Collection)</strong></a> <strong>تقدم مسارًا ثالثًا.</strong> تظل البيانات المصدر في Parquet أو Iceberg أو Lance أو Vortex أو أي تنسيق خارجي مدعوم آخر، بينما تبني Milvus الفهارس عليها وتقدمها. يمكنك تخطيط الحقول الخارجية في مخطط Milvus، وتحديد الفهارس التي تحتاجها، وتحديث المجموعة، واستخدام واجهات بحث واستعلام Milvus المعتادة—دون نسخ صفوف المصدر أولاً إلى مجموعة مُدارة بواسطة Milvus.</p>
<p>التغيير المعماري واضح: يمكن أن تبقى البيانات في البحيرة، بينما تضيف Milvus طبقة الفهرسة والاسترجاع.</p>
<p>يجعل هذا أيضًا من المجموعة الخارجية خطوة مهمة نحو <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>،</strong> وهي بنية بيانات موحدة أصلية للبحيرة (lake-native) للذكاء الاصطناعي، تجمع بين تقديم بمستوى قواعد بيانات المتجهات وتخزين بحيرة مفتوح، وفهارس قابلة لإعادة الاستخدام على مستوى البحيرة، وطبقة دلالية مشتركة. لم يعد الاسترجاع عبر الإنترنت مضطرًا للبدء من نسخة تقديم منفصلة بينما تعمل Spark وخطوط أنابيب التدريب ومهام التقييم وأدوات الحوكمة على نسخة أخرى من البيانات. يمكنها جميعًا العمل من أساس البيانات نفسه المقيم في البحيرة.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">ما هي المجموعة الخارجية وما الذي تغيّره<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>المجموعة الخارجية</strong> هي نوع من مجموعات Milvus توجد بياناتها المصدر خارج التخزين المُدار بواسطة Milvus.</p>
<p>بدون المجموعة الخارجية، فإن وضع هذا الكتالوج خلف بحث متجهي إنتاجي يعني عادةً إنشاء نسخة أخرى في Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في كل مرة يتغير فيها الكتالوج، أو يتغير نموذج التضمين، أو يُملأ حقل بأثر رجعي، يتعين على خط أنابيب آخر نقل البيانات المحدثة عبر تلك الحدود.</p>
<p>مع المجموعة الخارجية، يصبح الهيكل:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>لا</strong> تجعل الملفات الخارجية نسخة بيانات مصدر خاصة بها. بدلاً من ذلك، تحتوي المجموعة الخارجية على المعلومات التي تحتاجها Milvus لتفسير هذه الملفات والبحث فيها:</p>
<ol>
<li>عنصر <code translate="no">external_source</code> يحدد الملفات أو الجدول الخارجي.</li>
<li>عنصر <code translate="no">external_spec</code> يصف تنسيق المصدر والوصول إلى التخزين.</li>
<li>تخطيطات <code translate="no">external_field</code> التي تربط الحقول في مخطط Milvus بأعمدة مجموعة البيانات الخارجية.</li>
<li>الفهارس وملفات البيان (manifests) وحالة التقديم التي تنشئها Milvus للاسترجاع.</li>
</ol>
<p><strong>النسخ الصفري للبيانات المصدر لا يعني حالة صفرية داخل Milvus.</strong> ما تزال Milvus تبني الفهارس. وما تزال تستخدم موارد الحوسبة. وما تزال تخزن البيانات مؤقتًا. التغيير هو أن الصفوف المرجعية لم تعد بحاجة إلى النسخ إلى Milvus لمجرد أنك تحتاج إلى Milvus للبحث عنها.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">مجموعة Milvus العادية مقابل المجموعة الخارجية</h3><table>
<thead>
<tr><th><strong>الجانب</strong></th><th><strong>مجموعة مُدارة بواسطة Milvus</strong></th><th><strong>مجموعة خارجية</strong></th></tr>
</thead>
<tbody>
<tr><td>سجلات المصدر</td><td>مخزنة ومدارة بواسطة Milvus</td><td>تبقى في الملفات أو الجدول الخارجي</td></tr>
<tr><td>كيفية دخول البيانات إلى Milvus</td><td>إدراج، أو تحديث، أو استيراد، أو كتابة دفقية</td><td>تخطيط المصدر الخارجي + Refresh</td></tr>
<tr><td>التعديلات عبر الإنترنت</td><td>مدعومة</td><td>للقراءة فقط من جانب Milvus</td></tr>
<tr><td>حداثة البيانات</td><td>تتبع مسار الكتابة ونموذج الاتساق في Milvus</td><td>تتبع آخر Refresh منشور بنجاح</td></tr>
<tr><td>الحالة المُدارة بواسطة Milvus</td><td>البيانات المصدر، البيانات الوصفية، الفهارس، التخزينات المؤقتة</td><td>التخطيطات، ملفات البيان، الفهارس، التخزينات المؤقتة</td></tr>
<tr><td>مسار الاستعلام</td><td>واجهات بحث واستعلام Milvus</td><td>واجهات بحث واستعلام Milvus</td></tr>
<tr><td>الأنسب لـ</td><td>البيانات عبر الإنترنت المتغيرة باستمرار</td><td>بيانات البحيرة الكبيرة المنتجة دفعاتٍ وكثيفة القراءة</td></tr>
</tbody>
</table>
<p>لذلك تُكمِل المجموعة الخارجية مجموعات Milvus العادية بدلاً من استبدالها.</p>
<p>يمكن للنظام الاحتفاظ بالحالة عبر الإنترنت سريعة التغير في مجموعات Milvus العادية مع استخدام المجموعات الخارجية للمجاميع الكبيرة، والكتالوجات، ومجموعات البيانات التاريخية، وخصائص النماذج، أو أي بيانات أخرى أُنتجت وتُحكَم في البحيرة بالفعل.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">لماذا يهم إزالة النسخة الثانية<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>من المغري وصف المجموعات الخارجية بأنها تحسين للتخزين: لا تنسخ عدة تيرابايتات من البيانات إلى قاعدة بيانات أخرى، وستوفر مساحة التخزين. هذا مفيد، لكنه ليس المشكلة المعمارية الرئيسية.</p>
<p><strong>التكلفة الأعظم تأتي من إبقاء نظامي بيانات متوافقين.</strong></p>
<p>لنعد إلى كتالوج المنتجات. تنتج منصة البيانات مجموعة بيانات Parquet المرجعية. يستوردها البحث إلى قاعدة بيانات متجهات. قد يقرأ فريق التوصيات نفس بيانات البحيرة عبر Spark لإجراء تحليلات غير متصلة بالإنترنت. بعدها يولّد نموذج تضمين جديد عمود متجهات بديلاً. وتستمر المخزونات والبيانات الوصفية في التغير في الوقت نفسه.</p>
<p>بمجرد أن تصبح نسخة التقديم عبر الإنترنت مستقلة عن البحيرة، يجب أن يعبر كل تغيير تلك الحدود:</p>
<ul>
<li>يجب نسخ البيانات؛</li>
<li>يجب جدولة النقل ومراقبته؛</li>
<li>تحتاج المهام الفاشلة إلى إعادة محاولة؛</li>
<li>قد تحتاج المخططات والأذونات إلى تمثيلها في أنظمة متعددة؛</li>
<li>تعتمد الحداثة على مدى سرعة مواكبة خط أنابيب المزامنة؛</li>
<li>يجب أن تعرف الفرق أي نسخة تمثل الإصدار الذي تريده فعلاً.</li>
</ul>
<p>التخزين هو مجرد بند واحد.</p>
<table>
<thead>
<tr><th><strong>التكلفة</strong></th><th><strong>بحيرة + نسخة تقديم منفصلة</strong></th><th><strong>مجموعة خارجية</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>نسخ البيانات المصدر</strong></td><td>نسخة البحيرة بالإضافة إلى نسخة تقديم منفصلة</td><td>تبقى صفوف المصدر في البحيرة</td></tr>
<tr><td><strong>حركة البيانات</strong></td><td>خط أنابيب ETL/استيراد مستمر</td><td>Refresh على المصدر الخارجي</td></tr>
<tr><td><strong>حداثة البيانات</strong></td><td>تعتمد على إيقاع التصدير/الاستيراد</td><td>يتحكم بها وقت نشر Refresh جديد</td></tr>
<tr><td><strong>الحوكمة</strong></td><td>يجب أن تظل نسختا المصدر والتقديم متوافقتين</td><td>تبقى ملكية المصدر وسلالة البيانات والتحكم في الإصدارات لدى منصة البحيرة</td></tr>
<tr><td><strong>إعادة الاستخدام دون اتصال</strong></td><td>قد يجهّز مستهلكون آخرون نسخهم الخاصة</td><td>يمكن لأدوات البحيرة الحالية مواصلة قراءة نفس المصدر</td></tr>
<tr><td><strong>موارد التقديم</strong></td><td>تُحدَّد أحجامها حول نسخة قاعدة البيانات وحمل عمل الاستعلام</td><td>يمكن إدارة الفهرسة وحوسبة الاستعلام والتخزين المؤقت بشكل منفصل عن ملكية صفوف المصدر</td></tr>
</tbody>
</table>
<p>يصبح هذا الفرق مهمًا بشكل خاص مع ازدياد تغيّر بيانات الذكاء الاصطناعي.</p>
<p>تزيل الفرق التكرار من المجاميع، وتجمّع البيانات للتحليل، وتولّد تضمينات جديدة عندما يتغير النموذج، وتضيف تسميات وملخصات وكيانات مستخرجة ودرجات جودة أو إشارات تغذية راجعة، وتشغّل مهام تقييم وخطوط أنابيب تنظيف بيانات على نفس المجموعة التي تسترجع منها تطبيقات الإنتاج.</p>
<p>إذا كان كل نظام يملك نسخته الخاصة، فكل تحسين يتحول إلى مهمة مزامنة أخرى.</p>
<p>تغيّر المجموعة الخارجية تلك الحدود: <strong>يمكن للأنظمة غير المتصلة مواصلة العمل على مجموعة بيانات البحيرة، بينما تقدّم Milvus الاسترجاع على الأساس نفسه.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">ما مصادر البيانات التي تدعمها المجموعة الخارجية<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>صُممت المجموعة الخارجية حول بيانات مفتوحة مُدارة خارجيًا بدلاً من تخطيط مصدر خاص بـ Milvus. وهي تدعم تنسيقات مصادر خارجية متعددة عبر <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>التنسيق الخارجي</strong></th><th><strong>قيمة format</strong></th><th><strong>ما تقرؤه Milvus</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>دليل أو بادئة تخزين كائنات تحتوي على ملفات Parquet ومجموعات صفوف</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>ملفات Vortex والبيانات الوصفية لتخطيطها</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>مجموعة بيانات Lance والبيانات الوصفية لأجزائها</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>بيانات Iceberg الوصفية بالإضافة إلى لقطة (snapshot) محددة</td></tr>
<tr><td>لقطة Milvus</td><td>milvus-table</td><td>لقطة Milvus مدعومة مكشوفة كمصدر خارجي</td></tr>
</tbody>
</table>
<p>التخطيط بين المصدر وMilvus صريح.</p>
<p>يمكن لعمود مصدر باسم <code translate="no">product_id</code> أن يصبح حقل <code translate="no">id</code> في Milvus؛ ويمكن أن يصبح <code translate="no">image_vec</code> هو <code translate="no">embedding</code>؛ ولا يحتاج جدول مصدر عريض إلى كشف كل عمود للمجموعة. هذا يعني أن منصة البيانات لا تضطر إلى إعادة تسمية مصدرها أو إعادة كتابته فقط لإرضاء قاعدة بيانات التقديم.</p>
<p>تضيف التنسيقات ذات الإصدارات خاصية مفيدة أخرى. مع مصدر مثل Iceberg، يمكن للمجموعة أن تشير إلى لقطة معينة بدلاً من أي شيء يكون حاليًا وقت تنفيذ الاستعلام. إصدار المصدر الثابت مفيد للتقييم القابل للتكرار، واختبارات الانحدار، والتحليل التاريخي، وأحمال عمل التدقيق.</p>
<p>تظل الملفات الأساسية قابلة للاستخدام من بقية مكونات البنية التحتية للبيانات أيضًا. يمكن لـ Spark وأطر التدريب وأنظمة الحوكمة والأدوات الأخرى المتوافقة مع البحيرات مواصلة قراءة نفس البيانات المفتوحة.</p>
<p>تضيف المجموعة الخارجية مستهلكًا آخر لتلك البيانات؛ ولا تحوّل Milvus إلى المالك الوحيد لها.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">الوصول الآمن إلى التخزين الخارجي</h3><p>تحتاج Milvus أيضًا إلى إذن لقراءة التخزين الخارجي.</p>
<p>اعتمادًا على مزود التخزين، يمكن لعمليات النشر استخدام آليات مثل هوية حمل العمل أو هوية المثيل، أو افتراض دور AWS STS، أو انتحال هوية حساب الخدمة، أو وصولًا قائمًا على SAS، أو أنظمة أدوار خاصة بالمزود، بدلاً من تضمين بيانات اعتماد طويلة الأجل في إعدادات التطبيق.</p>
<p>تتحكم هوية التخزين هذه في كيفية وصول Milvus إلى المصدر. يظل التفويض داخل Milvus حدودًا أمنية منفصلة.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">كيفية إنشاء مجموعة خارجية وفهرستها وتحديثها والاستعلام عنها<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>تتكون دورة حياة المجموعة الخارجية من أربع خطوات رئيسية:</p>
<ol>
<li>حدّد المصدر الخارجي وخطط أعمدةه في مخطط Milvus.</li>
<li>حدّد الفهارس التي يحتاجها حمل العمل.</li>
<li>شغّل Refresh لتكتشف Milvus البيانات المصدر وتُعدّ إصدارًا قابلًا للاستعلام.</li>
<li>حمّل المجموعة واستخدم واجهات بحث واستعلام Milvus المعتادة.</li>
</ol>
<p>فيما يلي نفس كتالوج المنتجات ممثلًا كمجموعة خارجية:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>تستخدم الفهارس واجهة Milvus المعتادة:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>ثم حدّث المصدر الخارجي:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد أن يصبح الإصدار المحدث جاهزًا، حمّله وابحث فيه مثل مجموعة Milvus عادية:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>الفرق المهم ليس في استدعاء البحث، بل في نقطة بداية دورة الحياة. تبدأ مجموعة مُدارة بواسطة Milvus بكتابة البيانات أو استيرادها إلى Milvus. تبدأ المجموعة الخارجية بمرجع إلى بيانات موجودة بالفعل في مكان آخر.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">كيف يلتقط Refresh التغييرات في البيانات الخارجية<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>المجموعة الخارجية للقراءة فقط من جانب Milvus، لكن مجموعة بيانات البحيرة الأساسية لا يجب أن تظل مجمّدة إلى الأبد.</p>
<p>لنفترض أن خط أنابيب المنتجات أضاف دفعة أخرى، أو حدّث البيانات الوصفية، أو كتب تضمينات من نموذج جديد. لا تتبع Milvus باستمرار كل كائن يظهر في مسار المصدر. تصبح هذه التغييرات مرئية عبر Refresh.</p>
<p>يقرأ Refresh البيانات الوصفية الخارجية، ويحلل أجزاء المصدر، ويحدّث ملفات البيان (manifests) التي تربطها بمجموعة Milvus، ويُعدّ حالة الفهارس المقابلة.</p>
<p>المفتاح هو أن هذا العمل يمكن أن يكون تدريجيًا.</p>
<p>تحدد Milvus أجزاء المصدر التي لم تتغير ويمكنها إعادة استخدام أعمال المقاطع (segments) والفهارس الموجودة لها. أما الأجزاء الجديدة أو المتغيرة فهي التي تتطلب معالجة جديدة.</p>
<p>لذلك، لا يجب أن يؤدي تغيير بسيط في مجموعة بيانات متعددة التيرابايتات إلى تشغيل استيراد كامل آخر وإعادة بناء كاملة للفهارس.</p>
<p>يمنح Refresh أيضًا نظام التقديم حد إصدار واضحًا. فبينما يتم إعداد إصدار جديد، تستمر الاستعلامات في استخدام الحالة المنشورة سابقًا. وبمجرد اكتمال Refresh، تصبح الحالة الجديدة متاحة كإصدار كامل بدلاً من كشف مزيج من البيانات القديمة والبيانات المعدة جزئيًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يتناسب هذا النموذج بشكل طبيعي مع عمليات بناء الكتالوج كل ساعة، وتحديثات قواعد المعرفة الليلية، وتحديثات التضمين الدورية، وخطوط أنابيب الخصائص المولدة بواسطة النماذج، وأحمال العمل المماثلة الموجهة بالدفعات.</p>
<p>إنه <strong>لا</strong> يحل محل مسار الكتابة الدفقية. إذا كان يجب أن يصبح كل إدراج أو حذف قابلاً للبحث عبر Milvus فورًا، تظل المجموعة المُدارة هي النموذج الأفضل.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">كيف يقلل التحميل الكسول (Lazy Loading) استخدام الذاكرة لمجموعات البيانات العريضة<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>إن إبقاء صفوف المصدر في تخزين الكائنات لا يفيد إلا إذا لم تضطر طبقة التقديم إلى تحميل كل بايت محليًا قبل أن تتمكن من الإجابة عن الاستعلامات. ومع تمكين التخزين المتدرج (Tiered Storage) في Milvus، فإنها لن تفعل.</p>
<p>في وقت تحميل المجموعة، يمكن لعُقد الاستعلام (QueryNodes) الاحتفاظ مبدئيًا ببيانات وصفية خفيفة الوزن فقط، مثل معلومات المخطط وتعريفات الفهارس وخرائط الكتل ومراجع الكائنات البعيدة. تُجلب بيانات الحقول على مستوى الكتلة عندما يحتاجها الاستعلام؛ ويمكن أن تظل الفهارس بعيدة حتى أول استخدام، ثم تُخزَّن محليًا مؤقتًا. تظل البيانات كثيرة الاستخدام ساخنة، بينما يمكن إخراج البيانات الأقل وصولًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا مفيد بشكل خاص لمجموعات بيانات الذكاء الاصطناعي العريضة.</p>
<p>قد يحتوي صف المنتج على عدة تضمينات، ووصف طويل، وJSON خام، وبيانات وصفية للصور، وملخصات مولدة، ومخزون، وتسعير، وتقييمات، والعديد من السمات الأخرى. قد يلمس بحث التشابه النموذجي متجهًا واحدًا فقط بالإضافة إلى المخزون والسعر والتقييم. لا يوجد سبب يفرض أن تشغل كل الحقول الأخرى ذاكرة التقديم بشكل دائم لمجرد أنها تنتمي إلى السجل نفسه.</p>
<p>يمكن للمجموعة الخارجية تضييق بصمة التقديم على مستويين:</p>
<ul>
<li><strong>أولاً، الإسقاط على مستوى المخطط.</strong> من خلال <code translate="no">external_field</code>، يمكن للمجموعة الخارجية كشف أعمدة المصدر التي يحتاجها التطبيق فقط. تظل الأعمدة الأخرى في مجموعة بيانات البحيرة ولا تُضمَّن في مخطط التقديم هذا.</li>
<li><strong>ثانيًا، الإسقاط وقت التشغيل.</strong> في نموذج التقديم المتدرج، تجلب عُقد الاستعلام وتخزّن مؤقتًا الحقول والفهارس التي يحتاجها حمل العمل فعلاً، بدلاً من تحميل مجموعة البيانات المُخططة بالكامل مقدمًا.</li>
</ul>
<p>بعبارة أخرى، <strong>يمكن أن تظل مجموعة البيانات عريضة في البحيرة دون إجبار بصمة التقديم على أن تكون عريضة بالمثل.</strong></p>
<p>هناك مقايضة واضحة. الاستعلام الذي يصطدم بحقل أو فهرس بارد قد يدفع تكلفة قراءة عن بُعد عند أول وصول. يمكن لسياسات الإحماء (warm-up) تحميل الحقول أو الفهارس الحرجة لزمن الاستجابة مسبقًا، بينما تمنع سياسات التخزين المؤقت والإخراج (eviction) الحالة الأقل تواترًا في الوصول من شغل الموارد المحلية إلى أجل غير مسمى.</p>
<p>المغزى ليس أن تخزين الكائنات يتصرف مثل ذاكرة الوصول العشوائي (RAM). بل أن الذاكرة والقرص المحلي يمكن أن يتبعا مجموعة العمل الخاصة بحمل عمل الاسترجاع، بدلاً من الحجم الإجمالي وعرض مجموعة البيانات المصدر.</p>
<p>يؤدي تنسيق المصدر دورًا مهمًا هنا أيضًا. يمكن للتنسيقات المصممة لعمليات المسح التحليلي الواسع والتنسيقات المحسّنة للقراءات الأضيق أو العشوائية أن تُنتج سلوك إدخال/إخراج مختلفًا عند الوصول عند الطلب. لا تمحو المجموعة الخارجية تلك المقايضات على مستوى التخزين؛ بل تتيح لـ Milvus بناء طبقة استرجاع فوقها.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">ما قدرات البحث والفهرسة التي تدعمها المجموعة الخارجية<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>لا تكتفي المجموعة الخارجية بتوجيه Milvus إلى دليل من التضمينات ومسح الملفات. بل تبني Milvus هياكل استرجاع على البيانات الخارجية وتنفذ الاستعلامات عبر محرك الاسترجاع القياسي الخاص بها.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">فهارس Milvus المبنية فوق البيانات الخارجية</h3><p>اعتمادًا على الحقول وحمل العمل، يمكن لـ Milvus بناء:</p>
<ul>
<li>فهارس متجهات لبحث ANN؛</li>
<li>فهارس عددية لتصفية البيانات الوصفية؛</li>
<li>فهارس JSON للسمات شبه المنظمة؛</li>
<li>فهارس BM25 والنص الكامل للاسترجاع المعجمي.</li>
<li>حقول مولّدة بالدوال (function-generated) مدعومة من نموذج بيانات Milvus.</li>
</ul>
<p>يستخدم بحث ANN تلك الفهارس لتضييق مجموعة المرشحين بدلاً من قراءة كل متجه مصدر.</p>
<p>هذا التمييز مهم لأن تخزين تضمين في بحيرة ليس مثل تشغيل قاعدة بيانات متجهات فوقها. التخزين الدائم يمنحك بايتات. أما الاسترجاع الإنتاجي فيحتاج أيضًا إلى فهارس، وتخطيط استعلام، وتصفية، وترتيب، وتخزين مؤقت، ومسار تقديم منخفض زمن الاستجابة.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">أبعد من أفضل K المتجهية</h3><p>من الأخطاء الشائعة الأخرى قراءة "المجموعة الخارجية" على أنها "بحث متجهي فوق Parquet". هذا يقلل من شأن ما يتطلبه الاسترجاع الإنتاجي فعلاً.</p>
<p>نادرًا ما تعتمد نتيجة بحث إنتاجية على تشابه المتجهات وحدها. قد تعتمد أيضًا على مصطلحات دقيقة، وسياسة وصول، ومخزون، وطابع زمني، وفئة، وسعر، وجودة مصدر، أو إشارات ترتيب أعمال.</p>
<p>لنفترض استعلامًا مثل:</p>
<table>
<thead>
<tr><th>فستان زهري أحمر للصيف، متوفر في المخزون، الأعلى تقييمًا أولاً</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>قد يحتاج مسار الاسترجاع الإنتاجي إلى عدة إشارات:</p>
<ul>
<li><strong>تشابه المتجهات</strong> للمعنى الدلالي لـ'فستان صيفي زهري'.</li>
<li><strong>بحث معجمي أو نص كامل</strong> لمصطلح دقيق مثل 'أحمر'.</li>
<li><strong>مرشحات عددية</strong> لإزالة المنتجات غير المتوفرة في المخزون أو الأقل من عتبة تقييم معينة.</li>
<li><strong>استرجاع وترتيب هجين</strong> للجمع بين إشارات استرجاع متعددة.</li>
</ul>
<p>توسّع Milvus 3.0 أيضًا محرك الاستعلام إلى ما بعد استرجاع أقرب الجيران الأولي بقدرات مثل <strong>الترتيب من جانب الخادم، والتجميع، والتصنيف حسب الأوجه (faceting).</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>المغزى الأوسع هو أن المجموعة الخارجية تمنح البيانات المقيمة في البحيرة مسار استرجاع بمستوى قواعد البيانات—وليس مجرد طريقة لقراءة المتجهات من الملفات.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">كيف تدعم نفس بيانات البحيرة التقديم عبر الإنترنت والمعالجة غير المتصلة<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>أقوى سبب معماري للإبقاء على المصدر في تنسيق بحيرة مفتوح ليس ببساطة أن النسخة الثانية تكلف مالًا. بل هو أن مجموعة البيانات نفسها يمكن أن تظل متاحة للأنظمة التي تحسّنها باستمرار.</p>
<p>لنعد إلى كتالوج المنتجات.</p>
<p>خلال النهار، يمكن لـ Milvus تقديم مجموعة خارجية للبحث عن المنتجات، أو التوصيات، أو استرجاع الوكلاء.</p>
<p>في الوقت نفسه، يمكن لأنظمة أخرى العمل مباشرة على مجموعة بيانات البحيرة:</p>
<ul>
<li>يمكن لـ Spark تحديد المنتجات المكررة.</li>
<li>يمكن لخط أنابيب التدريب توليد تضمينات من نموذج جديد.</li>
<li>يمكن لمهمة جودة البيانات اكتشاف السجلات غير الصالحة أو الشاذة.</li>
<li>يمكن لخط أنابيب التقييم مقارنة جودة الاسترجاع بين إصدارات النماذج.</li>
<li>يمكن لعملية دفعية توليد ملخصات أو تسميات أو بيانات وصفية إضافية.</li>
</ul>
<p>المجموعة الخارجية <strong>لا</strong> تشغّل تلك المهام بنفسها. تبقى Spark كما هي، ويبقى التدريب كما هو. دورها هو إزالة الحدود الإضافية بين التقديم والبيانات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكن للعمل غير المتصل كتابة بيانات محسّنة أو حقول جديدة إلى البحيرة. يجعل Refresh لاحق المصدر المحدث متاحًا لمسار استرجاع Milvus.</p>
<p>لا توجد حلقة تصدير واستيراد منفصلة غرضها الوحيد إعادة بناء نسخة مرجعية أخرى للتقديم.</p>
<p>تظل الحوكمة مقسّمة بوضوح أيضًا. تبقى إصدارات المصدر وسلالة البيانات (lineage) وملكية المصدر لدى منصة البحيرة. تحتفظ Milvus بتفويضها الخاص على مستوى المجموعة وببيانات الاعتماد المطلوبة لقراءة المصدر. مشاركة أساس بيانات واحد لا تعني دمج كل نطاقات الأمان في نظام واحد.</p>
<p>هذا هو الارتباط بـ <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: تظل البحيرة أساس البيانات المشترك، بينما توفر Milvus طبقة استرجاع منخفضة زمن الاستجابة فوقها. المجموعة الخارجية جزء واحد من تلك البنية، إلى جانب Storage V3 واللقطات (Snapshots) وتكامل Spark وتطوّر المخطط والتعبئة بأثر رجعي (backfill).</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">أين تتناسب المجموعة الخارجية—وأين لا تتناسب<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>المجموعة الخارجية مناسبة تمامًا عندما:</strong></p>
<ul>
<li>تكون بياناتك المرجعية موجودة بالفعل في Parquet أو Vortex أو Lance أو Iceberg أو مصدر خارجي مدعوم آخر.</li>
<li>تُنتَج مجموعة البيانات بشكل أساسي على دفعات بدلاً من الكتابات التعاملية عالية التردد.</li>
<li>يسبب الاحتفاظ بنسخة تقديم ثانية أعباء كبيرة على ETL أو الحداثة أو الحوكمة.</li>
<li>تحتاج أنظمة متعددة إلى العمل مع نفس مجموعة البيانات المفتوحة.</li>
<li>يكون حد Refresh الصريح مقبولاً لحداثة التقديم.</li>
<li>تريد استرجاع Milvus الإنتاجي دون جعل Milvus مالكًا لصفوف المصدر.</li>
</ul>
<p><strong>مجموعة Milvus العادية تظل الخيار الأفضل عندما:</strong></p>
<ul>
<li>يقوم التطبيق بإدراج أو تحديث السجلات باستمرار؛</li>
<li>يجب أن تصبح عمليات الحذف مرئية عبر مسار الكتابة عبر الإنترنت؛</li>
<li>يعتمد حمل العمل على ميزات مجموعات غير متاحة للمخططات الخارجية؛</li>
<li>يكون تصميم التقديم مُبقيًا عمدًا جميع البيانات المطلوبة في الذاكرة، متجنبًا بذلك أخطاء التخزين المؤقت عن بُعد.</li>
</ul>
<p><strong>هناك عدة حدود جديرة بالانتباه.</strong></p>
<ul>
<li><strong>المجموعات الخارجية للقراءة فقط.</strong> تحدث تغييرات المصدر خارج Milvus.</li>
<li><strong>ينطبق النسخ الصفري على صفوف المصدر.</strong> لا تزال الفهارس وملفات البيان والتخزينات المؤقتة والحوسبة تكلف موارد.</li>
<li><strong>Refresh صريح.</strong> إنه ليس آلية مزامنة دفقية.</li>
<li><strong>يجب أن يظل المصدر قابلاً للوصول.</strong> لا يزال سلوك البحث والفهرسة والتحديث يعتمد على الوصول إلى التخزين وبيانات الاعتماد.</li>
<li><strong>Storage V3 مطلوب.</strong> في Milvus 3.0 مفتوحة المصدر، يجب تمكينه قبل استخدام المجموعة الخارجية.</li>
<li><strong>لا تحل المجموعة الخارجية محل المعالجة الأولية (upstream).</strong> لا يزال توليد التضمينات والتجميع وإزالة التكرار وتنظيف البيانات تحدث في الأنظمة الأولية المناسبة.</li>
</ul>
<p>الخيار إذن تكاملي وليس ثنائيًا. يمكن للنظام استخدام مجموعات Milvus العادية للحالة عبر الإنترنت سريعة التغير، والمجموعات الخارجية لمجموعات البيانات الكبيرة المنتجة دفعاتٍ التي يكون موطنها الطبيعي هو البحيرة.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">جرّب المجموعة الخارجية في Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>المجموعة الخارجية متاحة في Milvus 3.0. ابدأ بمجموعة بيانات بحيرة تمثيلية وقم بتقييم الجوانب المهمة لحمل عملك: التحديث الأولي والتدريجي، وتكلفة بناء الفهارس، وسلوك الاستعلام الساخن والبارد، وفاصل الحداثة الذي يتطلبه تطبيقك.</p>
<p>للحصول على تفاصيل التنفيذ، راجع:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">إنشاء مجموعة خارجية</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">مدونة إطلاق Milvus 3.0</a></li>
</ul>
<p>إذا كنت تفضل مسارًا مُدارًا، فالمجموعة الخارجية متاحة أيضًا كجزء من <strong>Zilliz Vector Lakebase</strong> في Zilliz Cloud. راجع:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">المجموعة الخارجية في Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">من قاعدة بيانات المتجهات إلى Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">لماذا بنينا Vector Lakebase: إعادة التفكير في بنية البيانات غير المنظمة للذكاء الاصطناعي</a></li>
</ul>
<p>يمكنك أيضًا طرح أسئلة التنفيذ أو تقديم ملاحظاتك إلى <a href="https://github.com/milvus-io/milvus">مستودع Milvus على GitHub</a> أو <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus على Discord</a>.</p>
