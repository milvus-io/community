---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  الكشف عن Milvus 2.4: البحث متعدد المتجهات والمتجهات المتفرقة وفهرس CAGRA
  والمزيد!
author: Fendy Feng
date: 2024-3-20
desc: >-
  يسعدنا أن نعلن عن إطلاق الإصدار Milvus 2.4، وهو تقدم كبير في تعزيز قدرات البحث
  لمجموعات البيانات واسعة النطاق.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>يسعدنا أن نعلن عن إطلاق الإصدار Milvus 2.4، وهو تقدم كبير في تعزيز قدرات البحث لمجموعات البيانات واسعة النطاق. يضيف هذا الإصدار الأخير ميزات جديدة، مثل دعم فهرس CAGRA المستند إلى وحدة معالجة الرسومات (GPU)، والدعم التجريبي <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">للتضمينات المتناثرة،</a> والبحث الجماعي، والعديد من التحسينات الأخرى في قدرات البحث. تعزز هذه التطورات التزامنا تجاه المجتمع من خلال تقديم أداة قوية وفعالة للمطورين مثلك للتعامل مع البيانات المتجهة والاستعلام عنها. لننتقل معًا إلى المزايا الرئيسية لـ Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">تمكين البحث متعدد المتجهات لعمليات بحث مبسطة متعددة الوسائط<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>يوفر Milvus 2.4 إمكانية البحث متعدد المتجهات، مما يسمح بالبحث المتزامن وإعادة ترتيب أنواع مختلفة من المتجهات داخل نظام Milvus نفسه. تعمل هذه الميزة على تبسيط عمليات البحث متعدد الوسائط، مما يعزز معدلات الاستدعاء بشكل كبير ويمكّن المطورين من إدارة تطبيقات الذكاء الاصطناعي المعقدة ذات أنواع البيانات المتنوعة دون عناء. بالإضافة إلى ذلك، تعمل هذه الوظيفة على تبسيط عملية التكامل والضبط الدقيق لنماذج إعادة الترتيب المخصصة، مما يساعد في إنشاء وظائف بحث متقدمة مثل <a href="https://zilliz.com/vector-database-use-cases/recommender-system">أنظمة التوصية</a> الدقيقة التي تستخدم رؤى من البيانات متعددة الأبعاد.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>كيفية عمل ميزة البحث متعدد المتجهات في ميلفوس</span> </span></p>
<p>يحتوي دعم المتجهات المتعددة في ميلفوس على عنصرين:</p>
<ol>
<li><p>القدرة على تخزين/الاستعلام عن متجهات متعددة لكيان واحد داخل مجموعة، وهي طريقة أكثر طبيعية لتنظيم البيانات</p></li>
<li><p>القدرة على بناء/تحسين خوارزمية إعادة الترتيب من خلال الاستفادة من خوارزميات إعادة الترتيب المبنية مسبقًا في ميلفوس</p></li>
</ol>
<p>إلى جانب كونها <a href="https://github.com/milvus-io/milvus/issues/25639">ميزة مطلوبة</a> بشدة، قمنا ببناء هذه الإمكانية لأن الصناعة تتجه نحو النماذج متعددة الوسائط مع إصدار GPT-4 وClaude 3. إعادة الترتيب هي تقنية شائعة الاستخدام لزيادة تحسين أداء الاستعلام في البحث. كنا نهدف إلى تسهيل الأمر على المطورين لبناء وتحسين عمليات إعادة الترتيب الخاصة بهم داخل نظام Milvus البيئي.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">دعم تجميع البحث من أجل تحسين كفاءة الحوسبة<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>تجميع البحث هو <a href="https://github.com/milvus-io/milvus/issues/25343">ميزة</a> أخرى <a href="https://github.com/milvus-io/milvus/issues/25343">مطلوبة</a> كثيرًا أضفناها إلى Milvus 2.4. فهو يدمج عملية تجميع حسب المجموعة المصممة للحقول من أنواع BOOL أو INT أو VARCHAR، مما يسد فجوة كفاءة حاسمة في تنفيذ استعلامات التجميع على نطاق واسع.</p>
<p>تقليديًا، كان المطورون يعتمدون على عمليات بحث واسعة النطاق من أعلى K متبوعة بمعالجة يدوية لاحقة لاستخلاص نتائج خاصة بالمجموعة، وهي طريقة تتطلب الكثير من الحوسبة وتتطلب الكثير من التعليمات البرمجية. يعمل البحث عن التجميع على تحسين هذه العملية من خلال ربط نتائج الاستعلام بكفاءة بمعرّفات المجموعات المجمّعة مثل أسماء المستندات أو مقاطع الفيديو، مما يسهّل التعامل مع الكيانات المجزأة ضمن مجموعات بيانات أكبر.</p>
<p>تميز Milvus عملية البحث التجميعي الخاصة بها من خلال تطبيق قائم على التكرار، مما يوفر تحسنًا ملحوظًا في الكفاءة الحسابية مقارنةً بالتقنيات المماثلة. يضمن هذا الاختيار قابلية فائقة للتوسع في الأداء، خاصةً في بيئات الإنتاج حيث يكون تحسين موارد الحوسبة أمرًا بالغ الأهمية. من خلال تقليل عبور البيانات والنفقات الحسابية الزائدة، يدعم Milvus معالجة استعلام أكثر كفاءة، مما يقلل بشكل كبير من أوقات الاستجابة والتكاليف التشغيلية مقارنة بقواعد البيانات المتجهة الأخرى.</p>
<p>يعزز تجميع البحث من قدرة Milvus على إدارة الاستعلامات المعقدة ذات الحجم الكبير والمعقدة ويتماشى مع ممارسات الحوسبة عالية الأداء لحلول إدارة البيانات القوية.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">الدعم التجريبي لتضمينات المتجهات المتفرقة<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>تمثّل<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">التضمينات المتفرقة</a> نقلة نوعية عن مناهج المتجهات الكثيفة التقليدية، حيث تلبي الفروق الدقيقة في التشابه الدلالي بدلاً من مجرد تكرار الكلمات الرئيسية. يسمح هذا التمييز بقدرة بحث أكثر دقة، بما يتماشى بشكل وثيق مع المحتوى الدلالي للاستعلام والمستندات. توفر نماذج المتجهات المتفرقة، المفيدة بشكل خاص في استرجاع المعلومات ومعالجة اللغات الطبيعية، قدرات بحث قوية خارج المجال وقابلية للتفسير مقارنةً بنظيراتها الكثيفة.</p>
<p>في الإصدار Milvus 2.4، قمنا بتوسيع نطاق البحث الهجين ليشمل التضمينات المتفرقة التي تم إنشاؤها بواسطة نماذج عصبية متقدمة مثل SPLADEv2 أو نماذج إحصائية مثل BM25. في Milvus، يتم التعامل مع المتجهات المتفرقة على قدم المساواة مع المتجهات الكثيفة، مما يتيح إنشاء مجموعات ذات حقول متجهات متناثرة، وإدراج البيانات، وبناء الفهرس، وإجراء عمليات البحث عن التشابه. وتجدر الإشارة إلى أن التضمينات المتفرقة في ميلفوس تدعم مقياس المسافة (IP) الخاص <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">بالضرب الداخلي،</a> وهو أمر مفيد نظرًا لطبيعتها عالية الأبعاد، مما يجعل المقاييس الأخرى أقل فعالية. تدعم هذه الوظيفة أيضًا أنواع البيانات ذات البُعد كعدد صحيح غير موقّع 32 بت، و 32 بت كعدد عائم للقيمة، مما يسهل مجموعة واسعة من التطبيقات، بدءًا من عمليات البحث النصية الدقيقة إلى أنظمة <a href="https://zilliz.com/learn/information-retrieval-metrics">استرجاع المعلومات</a> المعقدة.</p>
<p>مع هذه الميزة الجديدة، تسمح Milvus بمنهجيات البحث الهجينة التي تمزج بين الكلمات المفتاحية والتقنيات القائمة على التضمين، مما يوفر انتقالاً سلساً للمستخدمين الذين ينتقلون من أطر البحث التي تركز على الكلمات المفتاحية بحثاً عن حل شامل وقليل الصيانة.</p>
<p>نقوم بتسمية هذه الميزة بـ "بيتا" لمواصلة اختبار أداء الميزة وجمع الملاحظات من المجتمع. من المتوقع التوافر العام (GA) لدعم المتجهات المتفرقة مع إصدار Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">دعم فهرس CAGRA لفهرسة الرسم البياني المعجل بوحدة معالجة الرسومات المتقدمة<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تطوير <a href="https://arxiv.org/abs/2308.15136">CAGRA (CAGRA</a> ) من قبل NVIDIA، وهي تقنية فهرسة الرسوم البيانية القائمة على وحدة معالجة الرسومات التي تتفوق بشكل كبير على الطرق التقليدية القائمة على وحدة المعالجة المركزية مثل فهرس HNSW من حيث الكفاءة والأداء، خاصةً في البيئات عالية الإنتاجية.</p>
<p>مع تقديم فهرس CAGRA، يوفر Milvus 2.4 إمكانية فهرسة الرسم البياني المعززة بوحدة معالجة الرسوم البيانية المعززة بوحدة معالجة الرسوم البيانية. ويُعد هذا التحسين مثاليًا لبناء تطبيقات البحث عن التشابه التي تتطلب الحد الأدنى من زمن الاستجابة. بالإضافة إلى ذلك، يدمج الإصدار Milvus 2.4 بحث القوة الغاشمة مع فهرس CAGRA لتحقيق أقصى معدلات استرجاع في التطبيقات. للحصول على رؤى مفصلة، استكشف <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">مدونة مقدمة CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>ميلفوس رافت CAGRA مقابل ميلفوس HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">تحسينات وميزات إضافية<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>يتضمن Milvus 2.4 أيضًا تحسينات رئيسية أخرى، مثل دعم التعبير العادي لمطابقة السلاسل الفرعية المحسنة في <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">تصفية البيانات الوصفية</a> وفهرس مقلوب قياسي جديد لتصفية فعالة لنوع البيانات القياسية وأداة التقاط بيانات التغيير لمراقبة التغييرات في مجموعات Milvus وتكرارها. تعمل هذه التحديثات مجتمعة على تحسين أداء Milvus وتعدد استخداماته، مما يجعله حلاً شاملاً لعمليات البيانات المعقدة.</p>
<p>لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/release_notes.md">وثائق Milvus 2.4</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">ابق على اتصال!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>هل أنت متحمس لمعرفة المزيد عن Milvus 2.4؟ <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">انضم إلى ندوتنا القادمة على الويب</a> مع جيمس لوان، نائب رئيس قسم الهندسة في شركة Zilliz، لإجراء مناقشة متعمقة حول إمكانيات هذا الإصدار الأخير. إذا كانت لديك أسئلة أو ملاحظات، انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا للتفاعل مع مهندسينا وأعضاء مجتمعنا. لا تنسَ متابعتنا على <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> للحصول على آخر الأخبار والتحديثات حول Milvus.</p>
