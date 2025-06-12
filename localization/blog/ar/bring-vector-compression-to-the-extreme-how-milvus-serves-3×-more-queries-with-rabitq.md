---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف تخدم ميلفوس 3 أضعاف الاستعلامات
  باستخدام RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  اكتشف كيف تستفيد Milvus من تقنية RaBitQ لتعزيز كفاءة البحث المتجه، وتقليل
  تكاليف الذاكرة مع الحفاظ على الدقة. تعلم كيفية تحسين حلول الذكاء الاصطناعي
  الخاصة بك اليوم!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> عبارة عن قاعدة بيانات متجهات مفتوحة المصدر وقابلة للتطوير بدرجة كبيرة تعمل على تشغيل البحث الدلالي على نطاق مليار متجه. مع نشر المستخدمين لروبوتات الدردشة الآلية RAG وخدمة عملاء الذكاء الاصطناعي والبحث المرئي بهذا الحجم، يظهر تحدٍ مشترك: <strong>تكاليف البنية التحتية.</strong> في المقابل، فإن النمو الأسي للأعمال التجارية أمر مثير، أما فواتير السحابة المرتفعة فهي ليست كذلك. يتطلب البحث المتجه السريع عادةً تخزين المتجهات في الذاكرة، وهو أمر مكلف. بطبيعة الحال، قد تسأل: <em>هل يمكننا ضغط المتجهات لتوفير المساحة دون التضحية بجودة البحث؟</em></p>
<p>الإجابة هي <strong>نعم،</strong> وفي هذه المدونة، سنوضح لك كيف أن تطبيق تقنية جديدة تسمى <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> تمكّن شركة Milvus من خدمة حركة مرور أكثر بمقدار 3 أضعاف بتكلفة ذاكرة أقل مع الحفاظ على دقة مماثلة. سنقوم أيضًا بمشاركة الدروس العملية المستفادة من دمج RaBitQ في Milvus مفتوح المصدر وخدمة Milvus المدارة بالكامل على <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">فهم البحث والضغط الناقل<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في RaBitQ، دعونا نفهم التحدي.</p>
<p>تقع خوارزميات البحث<a href="https://zilliz.com/glossary/anns"><strong>التقريبي لأقرب جار (ANN)</strong></a> في قلب قاعدة بيانات المتجهات، حيث تعثر على المتجهات الأقرب إلى أقرب k من المتجهات لاستعلام معين. المتجه هو عبارة عن إحداثيات في فضاء عالي الأبعاد، وغالبًا ما يشتمل على مئات الأرقام ذات الفاصلة العائمة. ومع زيادة حجم بيانات المتجهات، تزداد متطلبات التخزين والحساب. على سبيل المثال، يتطلب تشغيل <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (خوارزمية بحث في الشبكة العنكبوتية) بمليار متجه ذي 768 بُعد في FP32 أكثر من 3 تيرابايت من الذاكرة!</p>
<p>ومثلما يضغط MP3 الصوت عن طريق تجاهل الترددات غير المحسوسة للأذن البشرية، يمكن ضغط البيانات المتجهة بأقل تأثير على دقة البحث. تُظهر الأبحاث أن الدقة الكاملة FP32 غالبًا ما تكون غير ضرورية للشبكة العصبية الاصطناعية. تقوم تقنية<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> التكميم</a> الكمي (SQ)، وهي تقنية ضغط شائعة، بتعيين قيم الفاصلة العائمة إلى حاويات منفصلة وتخزين مؤشرات الحاويات فقط باستخدام أعداد صحيحة منخفضة البت. تقلل طرق التكميم الكمي بشكل كبير من استخدام الذاكرة من خلال تمثيل نفس المعلومات بعدد أقل من البتات. تسعى الأبحاث في هذا المجال إلى تحقيق أكبر قدر من التوفير بأقل خسارة في الدقة.</p>
<p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">تمثل</a>تقنية الضغط الأكثر تطرفًا - التكميم الكمي - 1 بت، والمعروفة أيضًا باسم <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">التكميم الكمي الثنائي -</a>كل تعويم ببت واحد. مقارنةً بالترميز FP32 (ترميز 32 بت)، يقلل هذا من استخدام الذاكرة بمقدار 32×. نظرًا لأن الذاكرة غالبًا ما تكون عنق الزجاجة الرئيسي في البحث عن المتجهات، فإن هذا الضغط يمكن أن يعزز الأداء بشكل كبير. <strong>ومع ذلك، يكمن التحدي في الحفاظ على دقة البحث.</strong> وعادةً ما يقلل SQ 1 بت من الاستدعاء إلى أقل من 70%، مما يجعله غير قابل للاستخدام عمليًا.</p>
<p>وهنا تبرز تقنية <strong>RaBitQ</strong> - وهي تقنية ضغط ممتازة تحقق تكميم 1 بت مع الحفاظ على الاستدعاء العالي. يدعم برنامج Milvus الآن تقنية RaBitQ بدءًا من الإصدار 2.6، مما يتيح لقاعدة بيانات المتجهات خدمة 3 أضعاف QPS مع الحفاظ على مستوى مماثل من الدقة.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">مقدمة موجزة عن RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> هي طريقة تكميم ثنائية مصممة بذكاء تستفيد من الخاصية الهندسية للفضاء عالي الأبعاد لتحقيق ضغط متجه فعال ودقيق.</p>
<p>للوهلة الأولى، قد يبدو للوهلة الأولى أن اختزال كل بُعد من أبعاد المتجه إلى بت واحد أمرًا شديد القسوة، ولكن في الفضاء عالي الأبعاد، غالبًا ما تخذلنا بديهياتنا. وكما<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> أوضح</a> جيانيانغ غاو، مؤلف برنامج RaBitQ، فإن المتجهات عالية الأبعاد تُظهر خاصية أن الإحداثيات الفردية تميل إلى أن تكون مركزة بإحكام حول الصفر، نتيجة لظاهرة غير بديهية تم شرحها في كتاب "<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> تركيز القياس</a>". وهذا يجعل من الممكن التخلص من الكثير من الدقة الأصلية مع الحفاظ على البنية النسبية اللازمة لإجراء بحث دقيق عن أقرب جار.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: توزيع القيمة غير البديهي في الهندسة عالية الأبعاد. <em>تأمل قيمة البُعد الأول لمتجه وحدة عشوائي مأخوذة بشكل منتظم من كرة الوحدة؛ حيث تنتشر القيم بشكل منتظم في الفضاء ثلاثي الأبعاد. ومع ذلك، بالنسبة للفضاء عالي الأبعاد (على سبيل المثال، 1000 د)، تتركز القيم حول الصفر، وهي خاصية غير بديهية للهندسة عالية الأبعاد. (مصدر الصورة: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">التكميم في الفضاء عالي الأبعاد غير البديهي</a>)</em></p>
<p>مستوحى من هذه الخاصية للفضاء عالي الأبعاد، <strong>يركز RaBitQ على ترميز المعلومات الزاوية بدلاً من الإحداثيات المكانية الدقيقة</strong>. وهو يقوم بذلك عن طريق تطبيع كل متجه بيانات بالنسبة إلى نقطة مرجعية مثل النقطة المركزية لمجموعة البيانات. يتم بعد ذلك تعيين كل متجه إلى أقرب رأس له على المكعب الزائد، مما يسمح بالتمثيل ببت واحد فقط لكل بُعد. يمتد هذا النهج بشكل طبيعي إلى <code translate="no">IVF_RABITQ</code> ، حيث يتم التطبيع بالنسبة إلى أقرب نقطة مركزية للمجموعة، مما يحسن دقة الترميز المحلي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: ضغط متجه عن طريق إيجاد أقرب تقريب له على المكعب الزائد، بحيث يمكن تمثيل كل بُعد بت واحد فقط. (مصدر الصورة:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>التكميم الكمي في الفضاء عالي الأبعاد المضاد</em></a><em>)</em></p>
<p>لضمان أن يظل البحث موثوقًا حتى مع مثل هذا التمثيل المضغوط، يقدم RaBitQ <strong>مقدّرًا غير متحيز قائم على أسس نظرية</strong> للمسافة بين متجه الاستعلام ومتجهات المستندات ذات التكافؤ الثنائي. يساعد هذا في تقليل خطأ إعادة البناء والحفاظ على استرجاع عالٍ.</p>
<p>يتوافق RaBitQ أيضًا بشكل كبير مع تقنيات التحسين الأخرى، مثل<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a><a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> والمعالجة المسبقة للدوران العشوائي</a>. علاوة على ذلك، يتميز RaBitQ <strong>بخفة الوزن في التدريب وسرعة التنفيذ</strong>. يتضمن التدريب ببساطة تحديد إشارة كل مكون متجه، ويتم تسريع عملية البحث من خلال عمليات سريعة للبتات تدعمها وحدات المعالجة المركزية الحديثة. تُمكِّن هذه التحسينات معًا RaBitQ من توفير بحث عالي السرعة بأقل خسارة في الدقة.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">هندسة RaBitQ في Milvus: من البحث الأكاديمي إلى الإنتاج<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>على الرغم من أن RaBitQ واضح من الناحية المفاهيمية ومصحوب<a href="https://github.com/gaoj0017/RaBitQ"> بتطبيق مرجعي،</a> إلا أن تكييفه في قاعدة بيانات متجهة موزعة على مستوى الإنتاج مثل Milvus يمثل العديد من التحديات الهندسية. لقد قمنا بتطبيق RaBitQ في Knowhere، وهو محرك البحث المتجه الأساسي وراء Milvus، كما ساهمنا أيضًا بنسخة محسّنة في مكتبة بحث الشبكة العصبية الاصطناعية مفتوحة المصدر<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>دعونا نلقي نظرة على كيفية جعل هذه الخوارزمية تنبض بالحياة في Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">مقايضات التنفيذ</h3><p>تضمن أحد قرارات التصميم المهمة التعامل مع البيانات المساعدة لكل ناقل. تتطلب RaBitQ قيمتين من الفاصلة العائمة لكل متجه محسوبة مسبقًا أثناء وقت الفهرسة، وقيمة ثالثة يمكن حسابها أثناء التنقل أو محسوبة مسبقًا. في Knowhere، قمنا بحساب هذه القيمة مسبقًا أثناء وقت الفهرسة وتخزينها لتحسين الكفاءة أثناء البحث. في المقابل، يحافظ تطبيق FAISS على الذاكرة من خلال حسابها في وقت الاستعلام، مع إجراء مفاضلة مختلفة بين استخدام الذاكرة وسرعة الاستعلام.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">تسريع الأجهزة</h3><p>توفر وحدات المعالجة المركزية الحديثة تعليمات متخصصة يمكنها تسريع العمليات الثنائية بشكل كبير. قمنا بتصميم نواة حساب المسافة للاستفادة من تعليمات وحدة المعالجة المركزية الحديثة. نظرًا لأن RaBitQ يعتمد على عمليات العد المنبثق، فقد أنشأنا مسارًا متخصصًا في نوير يستخدم تعليمات <code translate="no">VPOPCNTDQ</code> لـ AVX512 عند توفرها. على الأجهزة المدعومة (على سبيل المثال، Intel IceLake أو AMD Zen 4)، يمكن أن يؤدي ذلك إلى تسريع عمليات حساب المسافة الثنائية بعدة عوامل مقارنةً بالتطبيقات الافتراضية.</p>
<h3 id="Query-Optimization" class="common-anchor-header">تحسين الاستعلام</h3><p>يدعم كل من Knowhere (محرك بحث Milvus) ونسخة FAISS المحسّنة الخاصة بنا التكميم القياسي (SQ1-SQ8) على متجهات الاستعلام. ويوفر ذلك مرونة إضافية: حتى مع تكميم الاستعلامات المكونة من 4 بت، يظل الاستدعاء مرتفعًا بينما تنخفض المتطلبات الحسابية بشكل كبير، وهو أمر مفيد بشكل خاص عندما يجب معالجة الاستعلامات بإنتاجية عالية.</p>
<p>نخطو خطوة إلى الأمام في تحسين محرك الكاردينال الخاص بنا، والذي يعمل على تشغيل Milvus المُدار بالكامل على Zilliz Cloud. بالإضافة إلى إمكانات محرك Milvus مفتوح المصدر، نقدم تحسينات متقدمة، بما في ذلك التكامل مع فهرس متجه قائم على الرسم البياني، وطبقات إضافية من التحسينات، ودعم تعليمات Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">مكسب الأداء: 3 أضعاف سرعة أكبر في الثانية مع دقة مماثلة<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>بدءًا من الإصدار 2.6، تقدم Milvus نوع الفهرس الجديد <code translate="no">IVF_RABITQ</code>. يجمع هذا الفهرس الجديد بين RaBitQ مع تجميع IVF، وتحويل الدوران العشوائي، والتنقيح الاختياري لتحقيق التوازن الأمثل بين الأداء وكفاءة الذاكرة والدقة.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">استخدام IVF_RABITQ في تطبيقك</h3><p>إليك كيفية تنفيذ <code translate="no">IVF_RABITQ</code> في تطبيق Milvus الخاص بك:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">قياس الأداء: الأرقام تروي القصة</h3><p>لقد قمنا بقياس تكوينات مختلفة باستخدام<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench،</a> وهي أداة قياس مرجعية مفتوحة المصدر لتقييم قواعد البيانات المتجهة. تستخدم كل من بيئات الاختبار والتحكم بيئات Milvus Standalone المنشورة على مثيلات AWS EC2 <code translate="no">m6id.2xlarge</code>. تتميز هذه الأجهزة بـ 8 وحدات معالجة مركزية افتراضية وذاكرة وصول عشوائي بسعة 32 جيجابايت ووحدة معالجة مركزية Intel Xeon 8375C تعتمد على بنية Ice Lake، والتي تدعم مجموعة تعليمات VPOPCNTDQ AVX-512.</p>
<p>استخدمنا اختبار أداء البحث من vdb-bench، مع مجموعة بيانات مكونة من مليون متجه، كل منها ذو 768 بُعدًا. بما أن حجم المقطع الافتراضي في Milvus هو 1 جيجابايت، وبما أن حجم المقطع الافتراضي في Milvus هو 1 جيجابايت، ومجموعة البيانات الخام (768 بُعدًا × 1 مليون متجه × 4 بايت لكل عوامة) يبلغ إجماليها 3 جيجابايت تقريبًا، فقد تضمن القياس عدة مقاطع لكل قاعدة بيانات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: مثال على تكوين الاختبار في vdb-bench.</p>
<p>فيما يلي بعض التفاصيل منخفضة المستوى حول مقابض التكوين الخاصة بـ IVF و RaBitQ وعملية التنقية:</p>
<ul>
<li><p><code translate="no">nlist</code> و <code translate="no">nprobe</code> هي معلمات قياسية لجميع الطرق المستندة إلى <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> هو عدد صحيح غير سالب يحدد إجمالي عدد دلاء IVF لمجموعة البيانات.</p></li>
<li><p><code translate="no">nprobe</code> هو عدد صحيح غير سالب يحدد عدد دلاء IVF التي تتم زيارتها لمتجه بيانات واحد أثناء عملية البحث. وهي معلمة متعلقة بالبحث.</p></li>
<li><p><code translate="no">rbq_bits_query</code> يحدد مستوى تكميم متجه الاستعلام. استخدم القيمة 1....8 لمستويات التكميم <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. استخدم القيمة 0 لتعطيل التكميم. وهي معلمة متعلقة بالبحث.</p></li>
<li><p><code translate="no">refine</code>، <code translate="no">refine_type</code> و <code translate="no">refine_k</code> المعلمات هي معلمات قياسية لعملية التنقية</p></li>
<li><p><code translate="no">refine</code> هي قيمة منطقية تمكّن استراتيجية التنقيح.</p></li>
<li><p><code translate="no">refine_k</code> هي قيمة fp غير سالبة. تستخدم عملية التنقيح طريقة تكميم عالية الجودة لاختيار العدد المطلوب من أقرب الجيران من مجموعة أكبر من المرشحين <code translate="no">refine_k</code> ، يتم اختيارها باستخدام <code translate="no">IVFRaBitQ</code>. وهي معلمة متعلقة بالبحث.</p></li>
<li><p><code translate="no">refine_type</code> هي سلسلة تحدد نوع التكميم لفهرس التكرير. الخيارات المتاحة هي <code translate="no">SQ6</code> و <code translate="no">SQ8</code> و <code translate="no">FP16</code> و <code translate="no">BF16</code> و <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>تكشف النتائج عن رؤى مهمة:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: مقارنة التكلفة والأداء لخط الأساس (IVF_FLAT) و IVF_SQ8 و IVF_SQ8 و IVF_RABITQ مع استراتيجيات تنقية مختلفة</p>
<p>بالمقارنة مع الفهرس الأساسي <code translate="no">IVF_FLAT</code> ، الذي يحقق 236 QPS مع استرجاع 95.2%، يصل <code translate="no">IVF_RABITQ</code> إلى إنتاجية أعلى بكثير - 648 QPS مع استعلامات FP32 و 898 QPS عند إقرانه باستعلامات SQ8 المحسنة. توضح هذه الأرقام ميزة أداء RaBitQ، خاصةً عند تطبيق التنقيح.</p>
<p>ومع ذلك، يأتي هذا الأداء مصحوبًا بمقايضة ملحوظة في الاسترجاع. عند استخدام <code translate="no">IVF_RABITQ</code> بدون تنقية، فإن مستوى الاسترجاع يصل إلى حوالي 76%، وهو ما قد يكون أقل من ذلك بالنسبة للتطبيقات التي تتطلب دقة عالية. ومع ذلك، فإن تحقيق هذا المستوى من الاسترجاع باستخدام ضغط متجه 1 بت لا يزال مثيرًا للإعجاب.</p>
<p>التنقيح ضروري لاستعادة الدقة. عند تهيئته باستخدام استعلام SQ8 وتنقيح SQ8، يقدم <code translate="no">IVF_RABITQ</code> أداءً واستدعاءً رائعين. فهو يحافظ على نسبة استرجاع عالية تصل إلى 94.7%، وهو ما يطابق تقريبًا IVF_FLAT، بينما يحقق 864 QPS، أي أعلى من IVF_FLAT بأكثر من 3 أضعاف. حتى بالمقارنة مع مؤشر تكميم شائع آخر <code translate="no">IVF_SQ8</code> ، فإن <code translate="no">IVF_RABITQ</code> مع تنقيح SQ8 يحقق أكثر من نصف الإنتاجية عند الاستدعاء المماثل، فقط بتكلفة أكثر هامشية. وهذا يجعله خيارًا ممتازًا للسيناريوهات التي تتطلب السرعة والدقة في آنٍ واحد.</p>
<p>باختصار، <code translate="no">IVF_RABITQ</code> وحده رائع لزيادة الإنتاجية إلى أقصى حد مع استدعاء مقبول، ويصبح أكثر قوة عند إقرانه مع التنقيح لسد فجوة الجودة، باستخدام جزء بسيط من مساحة الذاكرة فقط مقارنةً بـ <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>يمثل RaBitQ تقدمًا كبيرًا في تقنية التكميم الكمي المتجه. فمن خلال الجمع بين التكميم الثنائي واستراتيجيات الترميز الذكية، يحقق ما كان يبدو مستحيلاً: الضغط الشديد بأقل خسارة في الدقة.</p>
<p>وبدءًا من الإصدار 2.6، ستقدم Milvus الإصدار IVF_RABITQ، حيث ستدمج تقنية الضغط القوية هذه مع استراتيجيات التجميع والتنقيح IVF لتحويل التكميم الثنائي إلى إنتاج. يخلق هذا المزيج توازناً عملياً بين الدقة والسرعة وكفاءة الذاكرة التي يمكن أن تحول أعباء عمل البحث المتجه.</p>
<p>نحن ملتزمون بجلب المزيد من الابتكارات من هذا القبيل إلى كل من Milvus مفتوح المصدر وخدمته المدارة بالكامل على Zilliz Cloud، مما يجعل البحث المتجه أكثر كفاءة ومتاحة للجميع.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">البدء باستخدام ميلفوس 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>ميلفوس 2.6 متاح الآن. بالإضافة إلى RabitQ، فهو يقدم العشرات من الميزات الجديدة وتحسينات الأداء مثل التخزين المتدرج، وMeanhash LSH، والبحث المحسّن عن النص الكامل، والتعددية في البحث، مما يعالج مباشرةً التحديات الأكثر إلحاحًا في البحث المتجه اليوم: التوسع بكفاءة مع الحفاظ على التكاليف تحت السيطرة.</p>
<p>هل أنت مستعد لاستكشاف كل ما يقدمه الإصدار Milvus 2.6؟ يمكنك الغوص في<a href="https://milvus.io/docs/release_notes.md"> ملاحظات الإصدار</a> أو تصفح<a href="https://milvus.io/docs"> الوثائق الكاملة</a> أو الاطلاع على<a href="https://milvus.io/blog"> مدونات الميزات</a> الخاصة بنا.</p>
<p>إذا كانت لديك أي أسئلة أو كانت لديك حالة استخدام مماثلة، فلا تتردد في التواصل معنا من خلال <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Discord</a> أو تقديم مشكلة على<a href="https://github.com/milvus-io/milvus"> GitHub</a> - نحن هنا لمساعدتك في تحقيق أقصى استفادة من الإصدار Milvus 2.6.</p>
