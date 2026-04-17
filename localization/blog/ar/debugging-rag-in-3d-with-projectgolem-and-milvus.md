---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  ماذا لو كان بإمكانك معرفة سبب فشل RAG؟ تصحيح أخطاء RAG ثلاثي الأبعاد باستخدام
  Project_Golem وMilvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  تعرّف على كيفية جعل Project_Golem وMilvus أنظمة RAG قابلة للملاحظة من خلال
  تصور مساحة المتجهات، وتصحيح أخطاء الاسترجاع، وتوسيع نطاق البحث عن المتجهات في
  الوقت الفعلي.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>عندما يحدث خطأ في استرداد RAG، عادةً ما تعرف أنه معطل - حيث لا تظهر المستندات ذات الصلة، أو لا تظهر المستندات غير ذات الصلة. لكن معرفة السبب قصة مختلفة. كل ما عليك التعامل معه هو درجات التشابه وقائمة مسطحة من النتائج. لا توجد طريقة لمعرفة كيفية وضع المستندات فعليًا في مساحة المتجه، أو كيفية ارتباط الأجزاء ببعضها البعض، أو مكان وصول استعلامك بالنسبة للمحتوى الذي كان يجب أن يتطابق معه. في الممارسة العملية، هذا يعني أن تصحيح أخطاء RAG هو في الغالب تجربة وخطأ: قم بتعديل استراتيجية التقطيع، وقم بتبديل نموذج التضمين، واضبط أعلى k، وآمل أن تتحسن النتائج.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> هي أداة مفتوحة المصدر تجعل الفضاء المتجه مرئيًا. وهي تستخدم UMAP لإسقاط التضمينات عالية الأبعاد في ثلاثية الأبعاد وThree.js لعرضها بشكل تفاعلي في المتصفح. فبدلاً من تخمين سبب فشل الاسترجاع، يمكنك أن ترى كيف تتجمع القطع دلاليًا، وأين يقع استعلامك، والمستندات التي تم استرجاعها - كل ذلك في واجهة مرئية واحدة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا مذهل. ومع ذلك، تم تصميم Project_Golem الأصلي للعروض التوضيحية الصغيرة، وليس لأنظمة العالم الحقيقي. فهو يعتمد على الملفات المسطحة، والبحث بالقوة الغاشمة، وإعادة بناء مجموعة البيانات الكاملة - مما يعني أنه ينهار بسرعة مع نمو بياناتك لأكثر من بضعة آلاف من المستندات.</p>
<p>لسد هذه الفجوة، قمنا بدمج Project_Golem مع <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (تحديدًا الإصدار 2.6.8) باعتباره عموده الفقري المتجه. Milvus عبارة عن قاعدة بيانات متجهات مفتوحة المصدر عالية الأداء تتعامل مع الاستيعاب في الوقت الحقيقي، والفهرسة القابلة للتطوير، والاسترجاع على مستوى أجزاء من الثانية، بينما يظل Project_Golem مركزًا على ما يقوم به بشكل أفضل: جعل سلوك استرجاع المتجهات مرئيًا. معًا، يحولان معًا التصور ثلاثي الأبعاد من عرض توضيحي لعبة إلى أداة تصحيح أخطاء عملية لأنظمة RAG للإنتاج.</p>
<p>في هذا المنشور، سنتعرف في هذا المقال على Project_Golem ونوضح كيف قمنا بدمجه مع Milvus لجعل سلوك البحث المتجه قابلًا للملاحظة وقابلًا للتطوير وجاهزًا للإنتاج.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">ما هو Project_Golem؟<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد تصحيح أخطاء RAG صعبًا لسبب بسيط: مساحات المتجهات عالية الأبعاد، ولا يمكن للبشر رؤيتها.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> هو أداة قائمة على المتصفح تتيح لك رؤية الفضاء المتجه الذي يعمل فيه نظام RAG الخاص بك. يأخذ التضمينات عالية الأبعاد التي تقود الاسترجاع - عادةً 768 أو 1536 بُعدًا - ويعرضها في مشهد تفاعلي ثلاثي الأبعاد يمكنك استكشافه مباشرةً.</p>
<p>إليك كيفية عمله تحت الغطاء:</p>
<ul>
<li>تقليل الأبعاد باستخدام UMAP. يستخدم Project_Golem برنامج UMAP لضغط المتجهات عالية الأبعاد إلى ثلاثة أبعاد مع الحفاظ على المسافات النسبية بينها. تبقى الأجزاء المتشابهة دلاليًا في الفضاء الأصلي قريبة من بعضها البعض في الإسقاط ثلاثي الأبعاد؛ أما الأجزاء غير المترابطة فتبقى متباعدة.</li>
<li>عرض ثلاثي الأبعاد باستخدام Three.js. يظهر كل جزء من المستند كعقدة في مشهد ثلاثي الأبعاد معروض في المتصفح. يمكنك تدوير المساحة وتكبيرها واستكشافها لترى كيف تتجمع مستنداتك - أي الموضوعات التي تتجمع بشكل متقارب وأيها متداخلة، وأين تقع الحدود.</li>
<li>تمييز وقت الاستعلام. عند تشغيل استعلام، لا يزال الاسترجاع يحدث في الفضاء الأصلي عالي الأبعاد باستخدام تشابه جيب التمام. ولكن بمجرد ظهور النتائج، تضيء الأجزاء المسترجعة في العرض ثلاثي الأبعاد. يمكنك أن ترى على الفور أين وصل استعلامك بالنسبة للنتائج - وبنفس القدر من الأهمية، بالنسبة للمستندات التي لم يتم استرجاعها.</li>
</ul>
<p>هذا ما يجعل Project_Golem مفيدًا لتصحيح الأخطاء. فبدلاً من التحديق في قائمة نتائج مرتبة وتخمين سبب عدم العثور على مستند ذي صلة، يمكنك معرفة ما إذا كان المستند موجودًا في مجموعة بعيدة (مشكلة تضمين)، أو متداخلًا مع محتوى غير ذي صلة (مشكلة في التقطيع)، أو بالكاد خارج عتبة الاسترجاع (مشكلة في التكوين). تقوم طريقة العرض ثلاثية الأبعاد بتحويل درجات التشابه المجردة إلى علاقات مكانية يمكنك التفكير فيها.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">لماذا Project_Golem ليس جاهزًا للإنتاج<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم Project_Golem كنموذج أولي للتصور، وهو يعمل بشكل جيد لذلك. لكن بنيته تضع افتراضات تنهار بسرعة على نطاق واسع - بطرق مهمة إذا كنت تريد استخدامه لتصحيح أخطاء RAG في العالم الحقيقي.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">كل تحديث يتطلب إعادة بناء كاملة</h3><p>هذا هو القيد الأساسي. في التصميم الأصلي، تؤدي إضافة مستندات جديدة في التصميم الأصلي إلى إعادة بناء خط أنابيب كامل: يتم إعادة إنشاء التضمينات وكتابتها إلى ملفات .npy، ويتم إعادة تشغيل UMAP عبر مجموعة البيانات بأكملها، ويتم إعادة تصدير الإحداثيات ثلاثية الأبعاد على هيئة JSON.</p>
<p>حتى عند 100,000 مستند، يستغرق تشغيل UMAP أحادي النواة من 5 إلى 10 دقائق. في نطاق المليون مستند، يصبح الأمر غير عملي تمامًا. لا يمكنك استخدام ذلك لأي مجموعة بيانات تتغيّر باستمرار - مثل موجز الأخبار، والوثائق، ومحادثات المستخدمين - لأن كل تحديث يعني انتظار دورة إعادة معالجة كاملة.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">البحث بالقوة الغاشمة لا يتسع نطاقه</h3><p>جانب الاسترجاع له سقفه الخاص. يستخدم التطبيق الأصلي NumPy للبحث عن تشابه جيب التمام بالقوة الغاشمة - تعقيد زمني خطي، بدون فهرسة. على مجموعة بيانات من مليون مستند، يمكن أن يستغرق استعلام واحد أكثر من ثانية. وهذا غير قابل للاستخدام في أي نظام تفاعلي أو عبر الإنترنت.</p>
<p>ضغط الذاكرة يضاعف المشكلة. يستغرق كل متجه مكون من 768 متجهًا عائمًا 32 ذي 768 بُعدًا حوالي 3 كيلوبايت، لذا فإن مجموعة بيانات بمليون متجه تتطلب أكثر من 3 جيجابايت في الذاكرة - وكلها محملة في مصفوفة NumPy مسطحة بدون بنية فهرسة لجعل البحث فعالاً.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">لا يوجد تصفية للبيانات الوصفية ولا تعدد في الإيجار</h3><p>في نظام RAG الحقيقي، نادرًا ما يكون تشابه المتجهات هو معيار الاسترجاع الوحيد. تحتاج دائمًا تقريبًا إلى التصفية حسب البيانات الوصفية، مثل نوع المستند أو الطوابع الزمنية أو أذونات المستخدم أو الحدود على مستوى التطبيق. يحتاج نظام RAG الخاص بدعم العملاء، على سبيل المثال، إلى تحديد نطاق الاسترجاع لمستندات مستأجر معين - وليس البحث عبر بيانات الجميع.</p>
<p>لا يدعم Project_Golem أيًا من هذا. لا توجد فهارس ANN (مثل HNSW أو IVF)، ولا توجد فهرسة قياسية، ولا عزل للمستأجر، ولا بحث هجين. إنها طبقة تصور بدون محرك استرجاع إنتاج تحتها.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">كيف يعمل ميلفوس على تشغيل طبقة الاسترجاع الخاصة بمشروع_غوليم<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>حدد القسم السابق ثلاث ثغرات: عمليات إعادة البناء الكاملة عند كل تحديث، والبحث بالقوة الغاشمة، وعدم وجود استرجاع مدرك للبيانات الوصفية. تنبع الثغرات الثلاث من نفس السبب الجذري - لا يحتوي Project_Golem على طبقة قاعدة بيانات. الاسترجاع والتخزين والتصور متشابكة في خط أنابيب واحد، لذا فإن تغيير أي جزء يفرض إعادة بناء كل شيء.</p>
<p>لا يكمن الإصلاح في تحسين خط الأنابيب هذا. بل تقسيمه.</p>
<p>من خلال دمج Milvus 2.6.8 كعمود فقري للمتجه، يصبح الاسترجاع طبقة مخصصة على مستوى الإنتاج تعمل بشكل مستقل عن التصور. يتعامل Milvus مع تخزين المتجهات والفهرسة والبحث. يركز Project_Golem_Golem على العرض فقط - حيث يستهلك معرّفات المستندات من Milvus ويبرزها في العرض ثلاثي الأبعاد.</p>
<p>ينتج عن هذا الفصل تدفقان نظيفان ومستقلان:</p>
<p>تدفق الاسترجاع (عبر الإنترنت، على مستوى الميلي ثانية)</p>
<ul>
<li>يتم تحويل استعلامك إلى متجه باستخدام تضمينات OpenAI.</li>
<li>يتم إرسال متجه الاستعلام إلى مجموعة Milvus.</li>
<li>يقوم Milvus AUTOINDEX بتحديد الفهرس المناسب وتحسينه.</li>
<li>يقوم البحث في الوقت الحقيقي عن تشابه جيب التمام بإرجاع معرّفات المستندات ذات الصلة.</li>
</ul>
<p>تدفق التصور (دون اتصال، على نطاق تجريبي)</p>
<ul>
<li>ينشئ UMAP إحداثيات ثلاثية الأبعاد أثناء استيعاب البيانات (n_neighbors=30، min_dist=0.1).</li>
<li>يتم تخزين الإحداثيات في golem_cortex.json.</li>
<li>تبرز الواجهة الأمامية العقد ثلاثية الأبعاد المقابلة باستخدام معرّفات المستندات التي أرجعها Milvus.</li>
</ul>
<p>النقطة المهمة: لم يعد الاسترجاع ينتظر التصور. يمكنك استيعاب المستندات الجديدة والبحث عنها على الفور - حيث يمكن للواجهة الأمامية ثلاثية الأبعاد اللحاق بالجدول الزمني الخاص بها.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">ما الذي تغيره عقد البث</h3><p>هذا الاستيعاب في الوقت الحقيقي مدعوم بإمكانية جديدة في الإصدار 2.6.8 من ميلفوس: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">عقد البث</a>. في الإصدارات السابقة، كان الاستيعاب في الوقت الحقيقي يتطلب قائمة انتظار رسائل خارجية مثل Kafka أو Pulsar. تنقل عُقد التدفق هذا التنسيق إلى ميلفوس نفسها - يتم استيعاب المتجهات الجديدة بشكل مستمر، ويتم تحديث الفهارس بشكل تدريجي، وتصبح المستندات المضافة حديثًا قابلة للبحث على الفور دون إعادة بناء كاملة ودون أي تبعيات خارجية.</p>
<p>بالنسبة إلى Project_Golem، هذا ما يجعل البنية عملية. يمكنك الاستمرار في إضافة المستندات إلى نظام RAG الخاص بك - مقالات جديدة ومستندات محدثة ومحتوى من إنشاء المستخدم - ويظل الاسترجاع محدثًا دون تشغيل دورة إعادة التحميل المكلفة UMAP → JSON → إعادة التحميل.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">توسيع نطاق التصور إلى نطاق المليون (المسار المستقبلي)</h3><p>من خلال هذا الإعداد المدعوم من Milvus، يدعم Project_Golem حاليًا العروض التفاعلية بحوالي 10000 مستند. يتسع نطاق الاسترجاع إلى ما هو أبعد من ذلك بكثير - حيث يتعامل Milvus مع الملايين - لكن لا يزال خط أنابيب التصور يعتمد على تشغيل UMAP على دفعات. لسد هذه الفجوة، يمكن توسيع البنية مع خط أنابيب التصور التدريجي:</p>
<ul>
<li><p>مشغلات التحديث: يستمع النظام إلى أحداث الإدراج في مجموعة ميلفوس. وبمجرد أن تصل المستندات المضافة حديثًا إلى عتبة محددة (على سبيل المثال، 1000 عنصر)، يتم تشغيل تحديث تزايدي.</p></li>
<li><p>الإسقاط التزايدي: بدلًا من إعادة تشغيل UMAP عبر مجموعة البيانات الكاملة، يتم إسقاط المتجهات الجديدة في الفضاء ثلاثي الأبعاد الحالي باستخدام طريقة التحويل () الخاصة ب UMAP. يحافظ هذا على البنية العامة مع تقليل تكلفة الحساب بشكل كبير.</p></li>
<li><p>مزامنة الواجهة الأمامية: يتم دفق أجزاء الإحداثيات المحدّثة إلى الواجهة الأمامية عبر WebSocket، مما يسمح للعقد الجديدة بالظهور ديناميكيًا دون إعادة تحميل المشهد بأكمله.</p></li>
</ul>
<p>بالإضافة إلى قابلية التوسع، يتيح Milvus 2.6.8 إمكانية البحث الهجين من خلال الجمع بين تشابه المتجهات والبحث في النص الكامل والتصفية القياسية. يفتح هذا الباب أمام تفاعلات ثلاثية الأبعاد أكثر ثراءً - مثل تمييز الكلمات الرئيسية، وتصفية الفئات، والتقطيع المستند إلى الوقت - مما يمنح المطورين طرقًا أكثر قوة لاستكشاف سلوك RAG وتصحيحه والاستدلال عليه.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">كيفية نشر واستكشاف Project_Golem_Golem مع Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>أصبح Project_Golem_Golem الذي تمت ترقيته الآن مفتوح المصدر على <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. باستخدام وثائق Milvus الرسمية كمجموعة البيانات الخاصة بنا، نسير خلال العملية الكاملة لتصور استرجاع RAG بشكل ثلاثي الأبعاد. يستخدم الإعداد Docker و Python وهو سهل المتابعة، حتى لو كنت تبدأ من الصفر.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li>دوكر ≥ 20.10</li>
<li>إرساء Docker Compose ≥ 2.0</li>
<li>بايثون ≥ 3.11</li>
<li>مفتاح OpenAI API</li>
<li>مجموعة بيانات (وثائق ميلفوس بتنسيق Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. نشر ميلفوس</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. التنفيذ الأساسي</h3><p>تكامل ميلفوس (ingest.py)</p>
<p>ملاحظة: يدعم التطبيق ما يصل إلى ثماني فئات مستندات. في حال تجاوز عدد الفئات هذا الحد، يُعاد استخدام الألوان بطريقة دائرية.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>تصوّر الواجهة الأمامية (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>قم بتنزيل مجموعة البيانات ووضعها في الدليل المحدد</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. بدء المشروع</h3><p>تحويل تضمينات النص إلى فضاء ثلاثي الأبعاد</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[صورة]</p>
<p>بدء تشغيل خدمة الواجهة الأمامية</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. التصور والتفاعل</h3><p>بعد أن تتلقى الواجهة الأمامية نتائج الاسترجاع، يتم تحجيم سطوع العقدة بناءً على درجات تشابه جيب التمام، بينما يتم الاحتفاظ بألوان العقدة الأصلية للحفاظ على مجموعات فئات واضحة. يتم رسم خطوط شبه شفافة من نقطة الاستعلام إلى كل عقدة مطابقة، ويتم تحريك الكاميرا وتكبيرها بسلاسة للتركيز على المجموعة المفعلة.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">مثال 1: تطابق داخل المجال</h4><p>استعلام: "ما هي أنواع الفهارس التي يدعمها Milvus؟</p>
<p>سلوك التصور:</p>
<ul>
<li><p>في الفضاء ثلاثي الأبعاد، تُظهر حوالي 15 عقدة تقريبًا داخل المجموعة الحمراء المسماة INDEXES زيادة ملحوظة في السطوع (حوالي 2-3×).</p></li>
<li><p>تتضمن العقد المتطابقة أجزاء من مستندات مثل index_types.md و hnsw_index.md و ivf_index.md.</p></li>
<li><p>يتم عرض خطوط شبه شفافة من متجه الاستعلام إلى كل عقدة مطابقة، وتركز الكاميرا بسلاسة على المجموعة الحمراء.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">مثال 2: رفض الاستعلام خارج المجال</h4><p>استعلام: "كم تبلغ قيمة وجبة كنتاكي فرايد تشيكن؟</p>
<p>سلوك التصور:</p>
<ul>
<li><p>تحتفظ جميع العقد بألوانها الأصلية، مع تغييرات طفيفة في الحجم فقط (أقل من 1.1×).</p></li>
<li><p>تتناثر العقد المتطابقة عبر مجموعات متعددة بألوان مختلفة، ولا تظهر أي تركيز دلالي واضح.</p></li>
<li><p>لا تقوم الكاميرا بتشغيل إجراء التركيز، حيث لم يتم استيفاء عتبة التشابه (0.5).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>لن يحل Project_Golem المقترن بـ Milvus محل خط أنابيب تقييم RAG الحالي الخاص بك - لكنه يضيف شيئًا تفتقر إليه معظم خطوط الأنابيب تمامًا: القدرة على رؤية ما يحدث داخل مساحة المتجه.</p>
<p>باستخدام هذا الإعداد، يمكنك معرفة الفرق بين فشل الاسترجاع الناجم عن التضمين السيئ، والفشل الناجم عن سوء التقطيع، والفشل الناجم عن عتبة ضيقة جدًا. كان هذا النوع من التشخيص يتطلب التخمين والتكرار. الآن يمكنك رؤيته.</p>
<p>يدعم التكامل الحالي التصحيح التفاعلي على نطاق تجريبي (حوالي 10000 مستند)، مع قاعدة بيانات Milvus المتجهة التي تتعامل مع الاسترجاع على مستوى الإنتاج خلف الكواليس. تم تخطيط المسار إلى التصور على نطاق المليون ولكن لم يتم بناؤه بعد - مما يجعل هذا هو الوقت المناسب للمشاركة.</p>
<p>تحقق من <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> على GitHub، وجربه مع مجموعة البيانات الخاصة بك، وشاهد كيف يبدو الفضاء المتجه الخاص بك بالفعل.</p>
<p>إذا كانت لديك أسئلة أو ترغب في مشاركة ما تجده، انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا، أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus</a> للحصول على إرشادات عملية حول الإعداد الخاص بك.</p>
