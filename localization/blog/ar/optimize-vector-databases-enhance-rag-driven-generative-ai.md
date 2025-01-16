---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: تحسين قواعد بيانات المتجهات، وتعزيز الذكاء الاصطناعي التوليدي القائم على RAG
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  في هذه المقالة، ستتعرف في هذه المقالة على المزيد حول قواعد البيانات المتجهة
  وأطر قياس الأداء، ومجموعات البيانات لمعالجة الجوانب المختلفة، والأدوات
  المستخدمة لتحليل الأداء - كل ما تحتاجه لبدء تحسين قواعد البيانات المتجهة.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>تم نشر هذا المنشور في الأصل على <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">قناة إنتل المتوسطة</a> ويعاد نشره هنا بعد الحصول على إذن.</em></p>
<p><br></p>
<p>طريقتان لتحسين قاعدة بياناتك المتجهة عند استخدام RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تصوير <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">إيليا بافلوف</a> على <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>بقلم كاثي تشانغ والدكتورة ماليني بهاندارو المساهمين: لين يانغ وتشانغيان ليو</p>
<p>يتم تحسين نماذج الذكاء الاصطناعي التوليدي (GenAI)، التي تشهد اعتمادًا هائلاً في حياتنا اليومية، من خلال <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">التوليد المعزز للاسترجاع (RAG)</a>، وهي تقنية تُستخدم لتعزيز دقة الاستجابة والموثوقية من خلال جلب الحقائق من مصادر خارجية. تساعد تقنية RAG <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">نموذج اللغة الكبيرة</a> العادية <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">(LLM)</a> على فهم السياق وتقليل <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">الهلوسة</a> من خلال الاستفادة من قاعدة بيانات عملاقة من البيانات غير المنظمة المخزنة في صورة متجهات - وهو عرض رياضي يساعد على التقاط السياق والعلاقات بين البيانات.</p>
<p>يساعد RAG على استرجاع المزيد من المعلومات السياقية وبالتالي توليد استجابات أفضل، ولكن قواعد البيانات المتجهة التي تعتمد عليها تزداد حجمًا أكثر من أي وقت مضى لتوفير محتوى غني للاستفادة منه. مثلما تلوح في الأفق قواعد بيانات المتجهات التي يبلغ حجمها تريليون معيار LLMs، فإن قواعد بيانات المتجهات التي تضم مليارات المتجهات ليست بعيدة عن ذلك. وبصفتنا مهندسي التحسين، كان لدينا فضول لمعرفة ما إذا كان بإمكاننا جعل قواعد البيانات المتجهة أكثر أداءً، وتحميل البيانات بشكل أسرع، وإنشاء مؤشرات بشكل أسرع لضمان سرعة الاسترجاع حتى مع إضافة بيانات جديدة. لن يؤدي القيام بذلك إلى تقليل وقت انتظار المستخدم فحسب، بل سيؤدي أيضًا إلى جعل حلول الذكاء الاصطناعي القائمة على RAG أكثر استدامة.</p>
<p>في هذه المقالة، ستتعرف في هذه المقالة على المزيد حول قواعد البيانات المتجهة وأطر قياس الأداء، ومجموعات البيانات لمعالجة الجوانب المختلفة، والأدوات المستخدمة لتحليل الأداء - كل ما تحتاجه لبدء تحسين قواعد البيانات المتجهة. سنقوم أيضًا بمشاركة إنجازات التحسين التي حققناها على اثنين من حلول قواعد البيانات المتجهة الشائعة لإلهامك في رحلة تحسين الأداء وتأثير الاستدامة.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">فهم قواعد البيانات المتجهة<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>على عكس قواعد البيانات العلائقية أو غير العلائقية التقليدية حيث يتم تخزين البيانات بطريقة منظمة، تحتوي قاعدة البيانات المتجهة على تمثيل رياضي لعناصر البيانات الفردية، يُطلق عليه اسم المتجه، ويتم إنشاؤه باستخدام دالة تضمين أو تحويل. يمثل المتجه عادةً السمات أو المعاني الدلالية ويمكن أن يكون قصيرًا أو طويلًا. تقوم قواعد البيانات المتجهة باسترجاع المتجهات من خلال البحث عن المتجهات باستخدام مقياس تشابه باستخدام مقياس المسافة (حيث يعني التقارب أن النتائج أكثر تشابهًا) مثل <a href="https://www.pinecone.io/learn/vector-similarity/">الإقليدية أو الضرب النقطي أو تشابه جيب التمام</a>.</p>
<p>لتسريع عملية الاسترجاع، يتم تنظيم بيانات المتجهات باستخدام آلية فهرسة. تتضمن أمثلة على طرق التنظيم هذه الهياكل المسطحة، <a href="https://arxiv.org/abs/2002.09094">والملف المقلوب (IVF)،</a> <a href="https://arxiv.org/abs/1603.09320">والعوالم الصغيرة الهرمية القابلة للتنقل (HNSW)،</a> <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">والتجزئة الحساسة للموقع (LSH)</a>، وغيرها. تساهم كل طريقة من هذه الطرق في كفاءة وفعالية استرجاع المتجهات المتشابهة عند الحاجة.</p>
<p>دعونا نفحص كيفية استخدام قاعدة بيانات المتجهات في نظام GenAI. يوضح الشكل 1 كلاً من تحميل البيانات في قاعدة بيانات المتجهات واستخدامها في سياق تطبيق GenAI. عندما تقوم بإدخال المطالبة الخاصة بك، فإنها تخضع لعملية تحويل مماثلة لتلك المستخدمة لتوليد المتجهات في قاعدة البيانات. ثم تُستخدم مطالبة المتجهات المحولة هذه لاسترداد متجهات مماثلة من قاعدة بيانات المتجهات. تعمل هذه العناصر المسترجعة بشكل أساسي كذاكرة محادثة، حيث توفر تاريخًا سياقيًا للمطالبات، على غرار طريقة عمل أجهزة LLM. وتثبت هذه الميزة فائدتها بشكل خاص في معالجة اللغة الطبيعية والرؤية الحاسوبية وأنظمة التوصيات وغيرها من المجالات التي تتطلب الفهم الدلالي ومطابقة البيانات. يتم بعد ذلك "دمج" المطالبة الأولية مع العناصر المسترجعة، مما يوفر السياق ويساعد الآلية في صياغة الاستجابات بناءً على السياق المقدم بدلاً من الاعتماد فقط على بيانات التدريب الأصلية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل 1. بنية تطبيق RAG.</p>
<p>يتم تخزين المتجهات وفهرستها لاسترجاعها بسرعة. تنقسم قواعد البيانات المتجهة إلى نوعين رئيسيين، قواعد البيانات التقليدية التي تم توسيعها لتخزين المتجهات، وقواعد البيانات المتجهة المصممة لهذا الغرض. بعض الأمثلة على قواعد البيانات التقليدية التي توفر دعمًا للمتجهات هي <a href="https://redis.io/">Redis</a> و <a href="https://github.com/pgvector/pgvector">pgvector</a> و <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> و <a href="https://opensearch.org/">OpenSearch</a>. ومن الأمثلة على قواعد البيانات المتجهة المصممة لغرض معين الحلول الخاصة <a href="https://zilliz.com/">Zilliz</a> و <a href="https://www.pinecone.io/">Pinecone،</a> والمشاريع مفتوحة المصدر <a href="https://milvus.io/">Milvus</a> و <a href="https://weaviate.io/">Weaviate</a> و <a href="https://qdrant.tech/">Qdrant</a> و <a href="https://github.com/facebookresearch/faiss">Faiss</a> و <a href="https://www.trychroma.com/">Chroma</a>. يمكنك معرفة المزيد عن قواعد بيانات المتجهات على GitHub عبر GitHub عبر <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>و <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>سنلقي نظرة فاحصة على واحدة من كل فئة، ميلفوس وريديس.</p>
<h2 id="Improving-Performance" class="common-anchor-header">تحسين الأداء<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في التحسينات، دعونا نراجع كيفية تقييم قواعد البيانات المتجهة وبعض أطر التقييم وأدوات تحليل الأداء المتاحة.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">مقاييس الأداء</h3><p>لنلقِ نظرة على المقاييس الرئيسية التي يمكن أن تساعدك في قياس أداء قاعدة البيانات المتجهة.</p>
<ul>
<li>يقيس<strong>زمن انتقال التحميل</strong> الوقت اللازم لتحميل البيانات في ذاكرة قاعدة البيانات المتجهة وإنشاء فهرس. الفهرس عبارة عن بنية بيانات تُستخدم لتنظيم البيانات المتجهة واسترجاعها بكفاءة استنادًا إلى تشابهها أو المسافة بينها. تتضمن أنواع <a href="https://milvus.io/docs/index.md#In-memory-Index">الفهارس داخل الذاكرة</a> <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">الفهرس المسطح</a> و <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a> و <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_FLAT</a> و <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ و HNSW و HNSW</a> و <a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN القابل للتطوير (ScaNN)</a>و <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li><strong>الاسترجاع</strong> هو نسبة التطابقات الحقيقية، أو العناصر ذات الصلة، الموجودة في <a href="https://redis.io/docs/data-types/probabilistic/top-k/">أفضل</a> النتائج <a href="https://redis.io/docs/data-types/probabilistic/top-k/">K</a> التي تم استرجاعها بواسطة خوارزمية البحث. تشير قيم الاستدعاء الأعلى إلى استرجاع أفضل للعناصر ذات الصلة.</li>
<li><strong>الاستعلامات في الثانية (QPS)</strong> هو المعدل الذي يمكن لقاعدة البيانات المتجهة معالجة الاستعلامات الواردة. تشير قيم QPS الأعلى إلى قدرة أفضل على معالجة الاستعلامات وإنتاجية أفضل للنظام.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">الأطر المعيارية</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل 2. إطار قياس أداء قاعدة البيانات المتجهة.</p>
<p>يتطلب قياس أداء قاعدة البيانات المتجهة وجود خادم قاعدة بيانات متجهة وعملاء. استخدمنا في اختبارات الأداء التي أجريناها أداتين مفتوحتي المصدر شائعتين.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> تساعد أداة VectorDBBench، التي طورها Zilliz ومفتوحة المصدر، في اختبار قواعد البيانات المتجهة بأنواع مختلفة من الفهارس وتوفر واجهة ويب ملائمة.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>Vector-db-benchmark</strong></a><strong>:</strong> يساعد Vector-db-benchmark، الذي طورته شركة Qdrant، على اختبار العديد من قواعد البيانات المتجهة النموذجية لنوع فهرس <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. وهو يقوم بتشغيل الاختبارات من خلال سطر الأوامر ويوفر ملف __ملف <a href="https://docs.docker.com/compose/">Docker Compose</a> لتبسيط بدء تشغيل مكونات الخادم.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل 3. مثال على الأمر vector-db-benchmark المستخدم لتشغيل الاختبار المعياري.</p>
<p>لكن الإطار المعياري ليس سوى جزء من المعادلة. نحن بحاجة إلى بيانات تمارس جوانب مختلفة من حل قاعدة البيانات المتجهة نفسها، مثل قدرتها على التعامل مع أحجام كبيرة من البيانات، وأحجام متجهات مختلفة، وسرعة الاسترجاع، وبهذا، دعونا نلقي نظرة على بعض مجموعات البيانات العامة المتاحة.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">مجموعات البيانات المفتوحة لممارسة قواعد البيانات المتجهة</h3><p>تُعد مجموعات البيانات الكبيرة مرشحة جيدة لاختبار زمن انتقال التحميل وتخصيص الموارد. تحتوي بعض مجموعات البيانات على بيانات عالية الأبعاد وهي جيدة لاختبار سرعة حوسبة التشابه.</p>
<p>تتراوح مجموعات البيانات من بُعد 25 إلى بُعد 2048. وقد استُخدمت مجموعة بيانات <a href="https://laion.ai/">LAION،</a> وهي مجموعة صور مفتوحة، لتدريب نماذج بصرية ولغوية عميقة عصبية كبيرة جدًا مثل النماذج التوليدية ذات الانتشار المستقر. تم إنشاء مجموعة بيانات OpenAI المكونة من 5 ملايين متجه، لكل منها بُعد 1536، بواسطة VectorDBBench عن طريق تشغيل OpenAI على <a href="https://huggingface.co/datasets/allenai/c4">البيانات الأولية</a>. بالنظر إلى أن كل عنصر متجه هو من النوع FLOAT، لحفظ المتجهات وحدها، يلزم حوالي 29 جيجابايت (5M * 1536 * 4) من الذاكرة، بالإضافة إلى كمية إضافية مماثلة لحفظ المؤشرات والبيانات الوصفية الأخرى بإجمالي 58 جيجابايت من الذاكرة للاختبار. عند استخدام أداة vector-db-benchmark، تأكد من وجود مساحة تخزين كافية على القرص لحفظ النتائج.</p>
<p>لاختبار كمون التحميل، احتجنا إلى مجموعة كبيرة من المتجهات، وهو ما يوفره <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">Deep-image-96-angular</a>. لاختبار أداء توليد الفهرس وحساب التشابه، توفر المتجهات عالية الأبعاد مزيدًا من الضغط. وتحقيقًا لهذه الغاية، اخترنا مجموعة بيانات 500 ألف من متجهات ذات أبعاد 1536 متجهًا.</p>
<h3 id="Performance-Tools" class="common-anchor-header">أدوات الأداء</h3><p>لقد غطينا طرق الضغط على النظام لتحديد المقاييس ذات الأهمية، ولكن دعونا نفحص ما يحدث على مستوى أقل: ما مدى انشغال وحدة الحوسبة واستهلاك الذاكرة وانتظار الأقفال وغير ذلك؟ هذه توفر أدلة على سلوك قاعدة البيانات، وهي مفيدة بشكل خاص في تحديد مناطق المشاكل.</p>
<p>توفر أداة لينكس <a href="https://www.redhat.com/sysadmin/interpret-top-output">الأعلى</a> معلومات عن أداء النظام. ومع ذلك، توفر أداة <a href="https://perf.wiki.kernel.org/index.php/Main_Page">بيرف</a> في لينكس مجموعة أعمق من الرؤى. لمعرفة المزيد، نوصي أيضًا بقراءة <a href="https://www.brendangregg.com/perf.html">أمثلة لينكس بيرف</a> <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">وطريقة تحليل البنية الدقيقة من أعلى إلى أسفل من إنتل</a>. هناك أداة أخرى هي أداة <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler،</a> وهي أداة مفيدة عند تحسين ليس فقط أداء التطبيق ولكن أيضًا أداء النظام وتكوينه لمجموعة متنوعة من أعباء العمل التي تشمل الحوسبة عالية الأداء والسحابة وإنترنت الأشياء والوسائط والتخزين وغيرها.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">تحسينات قاعدة بيانات Milvus Vector لقاعدة البيانات<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نستعرض بعض الأمثلة على كيفية محاولتنا تحسين أداء قاعدة بيانات Milvus المتجهة.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">تقليل الحركة الزائدة للذاكرة في كتابة المخزن المؤقت لقاعدة البيانات</h3><p>يقوم وكلاء مسار الكتابة في Milvus بكتابة البيانات في وسيط السجل عبر <em>MsgStream</em>. ثم تستهلك عقد البيانات البيانات، وتقوم بتحويلها وتخزينها إلى شرائح. ستقوم المقاطع بدمج البيانات المدرجة حديثًا. يخصص منطق الدمج مخزنًا مؤقتًا جديدًا لحفظ/نقل كل من البيانات القديمة والبيانات الجديدة المراد إدراجها ثم يعيد المخزن المؤقت الجديد كبيانات قديمة لدمج البيانات التالي. يؤدي ذلك إلى زيادة حجم البيانات القديمة تباعًا، مما يجعل حركة البيانات أبطأ. أظهرت ملفات تعريف الأداء ارتفاع النفقات العامة لهذا المنطق.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل 4. يؤدي دمج البيانات ونقلها في قاعدة البيانات المتجهة إلى توليد نفقات عالية الأداء.</p>
<p>لقد قمنا بتغيير منطق <em>المخزن المؤقت للدمج</em> لإلحاق البيانات الجديدة مباشرةً بالبيانات القديمة لإدراجها في البيانات القديمة، وتجنب تخصيص مخزن مؤقت جديد ونقل البيانات القديمة الكبيرة. تؤكد ملفات تعريف الأداء أنه لا توجد نفقات زائدة لهذا المنطق. تشير مقاييس الرمز المصغّر <em>تردد تشغيل وحدة المعالجة المركزية</em> <em>واستخدام وحدة المعالجة المركزية</em> إلى تحسن يتوافق مع عدم اضطرار النظام إلى انتظار حركة الذاكرة الطويلة بعد الآن. تحسن زمن انتقال التحميل بأكثر من 60 بالمائة. تم تسجيل التحسن على <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل 5. مع تقليل النسخ نرى تحسنًا في الأداء بنسبة تزيد عن 50 في المئة في زمن انتقال التحميل.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">بناء الفهرس المقلوب مع تقليل نفقات تخصيص الذاكرة الزائدة</h3><p>يوظف محرك البحث Milvus، <a href="https://milvus.io/docs/knowhere.md">نوير،</a> <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">خوارزمية Elkan k-means</a> لتدريب بيانات المجموعة لإنشاء <a href="https://milvus.io/docs/v1.1.1/index.md">مؤشرات الملفات المقلوبة (IVF)</a>. تحدد كل جولة من تدريب البيانات عدد التكرارات. كلما زاد العدد، كانت نتائج التدريب أفضل. ومع ذلك، فإنه يعني أيضًا أنه سيتم استدعاء خوارزمية Elkan بشكل متكرر أكثر.</p>
<p>تتعامل خوارزمية Elkan مع تخصيص الذاكرة وإلغاء تخصيصها في كل مرة يتم تنفيذها. على وجه التحديد، تخصص ذاكرة لتخزين نصف حجم بيانات المصفوفة المتماثلة، باستثناء العناصر القطرية. في Knowhere، يتم تعيين بُعد المصفوفة المتماثلة التي تستخدمها خوارزمية Elkan على 1024، مما يؤدي إلى حجم ذاكرة يبلغ 2 ميغابايت تقريبًا. هذا يعني أنه في كل جولة تدريب، يقوم Elkan بتخصيص وإلغاء تخصيص ذاكرة بحجم 2 ميغابايت بشكل متكرر.</p>
<p>أشارت بيانات تحليل الأداء إلى نشاط تخصيص الذاكرة الكبير المتكرر. في الواقع، لقد أدى ذلك إلى تخصيص <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">منطقة الذاكرة الافتراضية (VMA)</a>، وتخصيص الصفحات الفعلية، وإعداد خريطة الصفحات، وتحديث إحصائيات مجموعة الذاكرة cgroup في النواة. يمكن أن يؤدي هذا النمط من نشاط تخصيص/إلغاء التخصيص الكبير للذاكرة، في بعض الحالات، إلى تفاقم تجزئة الذاكرة. هذه ضريبة كبيرة.</p>
<p>تم تصميم وبناء بنية <em>IndexFlatElkan</em> خصيصًا لدعم خوارزمية Elkan. سيتم تهيئة مثيل <em>IndexFlatElkan</em> في كل عملية تدريب على البيانات. وللتخفيف من تأثير الأداء الناتج عن التخصيص المتكرر للذاكرة وإلغاء التخصيص في خوارزمية Elkan، قمنا بإعادة هيكلة منطق الكود، ونقلنا إدارة الذاكرة خارج وظيفة خوارزمية Elkan إلى عملية بناء <em>IndexFlatElkan</em>. يتيح ذلك تخصيص الذاكرة مرة واحدة فقط أثناء مرحلة التهيئة مع خدمة جميع استدعاءات دالة خوارزمية Elkan اللاحقة من عملية تدريب البيانات الحالية ويساعد على تحسين زمن انتقال التحميل بحوالي 3 في المائة. ابحث عن <a href="https://github.com/zilliztech/knowhere/pull/280">تصحيح Knowhere هنا</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">تسريع بحث ريديس المتجه من خلال الجلب المسبق للبرامج<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>بدأ Redis، وهو مخزن بيانات تقليدي شائع في الذاكرة للبيانات ذات القيمة المفتاحية في الذاكرة، مؤخرًا في دعم البحث المتجه. ولتجاوز كونه مخزنًا نموذجيًا للقيم الرئيسية، فإنه يوفر وحدات قابلة للتوسعة؛ تسهل وحدة <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> تخزين المتجهات والبحث عنها مباشرةً داخل Redis.</p>
<p>بالنسبة للبحث عن التشابه المتجه، يدعم Redis خوارزميتين، وهما القوة الغاشمة و HNSW. صُممت خوارزمية HNSW خصيصًا لتحديد موقع أقرب الجيران التقريبي بكفاءة في المساحات عالية الأبعاد. وهي تستخدم قائمة انتظار ذات أولوية تُدعى <em>Candid_set</em> لإدارة جميع المتجهات المرشحة لحساب المسافة.</p>
<p>يتضمن كل متجه مرشح بيانات وصفية كبيرة بالإضافة إلى بيانات المتجه. ونتيجة لذلك، عند تحميل مرشح من الذاكرة، يمكن أن يتسبب ذلك في حدوث أخطاء في ذاكرة التخزين المؤقت للبيانات، مما يؤدي إلى تأخير في المعالجة. يقدم تحسيننا الجلب المسبق للبرامج لتحميل المرشح التالي بشكل استباقي أثناء معالجة المرشح الحالي. وقد أدى هذا التحسين إلى تحسين الإنتاجية بنسبة 2 إلى 3 في المائة لعمليات البحث عن التشابه المتجه في إعداد Redis أحادي المثال. التصحيح في طور التعميم.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">تغيير السلوك الافتراضي لـ GCC لمنع عقوبات كود التجميع المختلط<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>لتحقيق أقصى قدر من الأداء، غالبًا ما تتم كتابة الأجزاء المستخدمة بشكل متكرر من التعليمات البرمجية يدويًا في التجميع. ومع ذلك، عندما تتم كتابة أجزاء مختلفة من التعليمات البرمجية إما من قبل أشخاص مختلفين أو في أوقات مختلفة، قد تأتي التعليمات المستخدمة من مجموعات تعليمات تجميع غير متوافقة مثل <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">وSexting SIMD Extensions (SSE)</a>. إذا لم يتم تجميع الشيفرة البرمجية المختلطة بشكل مناسب، فإن ذلك سيؤدي إلى حدوث خلل في الأداء. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">تعرف على المزيد حول خلط تعليمات Intel AVX و SSE هنا</a>.</p>
<p>يمكنك بسهولة تحديد ما إذا كنت تستخدم شيفرة تجميع مختلطة الوضع ولم تقم بتجميع الشيفرة البرمجية باستخدام <em>VZEROUUPPER،</em> مما يؤدي إلى حدوث عقوبة الأداء. يمكن ملاحظة ذلك من خلال أمر بيرف مثل <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1، umask=0x10/' &lt;workload&gt;.</em> إذا لم يكن نظام التشغيل الخاص بك يدعم الحدث، استخدم <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>يقوم المحول البرمجي Clang افتراضيًا بإدراج <em>VZEROUUUPPER،</em> متجنبًا أي عقوبة للوضع المختلط. لكن المحول البرمجي GCC يقوم بإدراج <em>VZEROUUPPER</em> فقط عندما يتم تحديد علامتي -O2 أو -O3 للمحول البرمجي. لقد اتصلنا بفريق GCC وشرحنا المشكلة وهم الآن، بشكل افتراضي، يتعاملون بشكل صحيح مع كود تجميع الوضع المختلط.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">البدء بتحسين قواعد بيانات المتجهات الخاصة بك<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>تلعب قواعد بيانات المتجهات دورًا أساسيًا في GenAI، وهي تنمو بشكل أكبر من أي وقت مضى لتوليد استجابات عالية الجودة. فيما يتعلق بالتحسين، لا تختلف تطبيقات الذكاء الاصطناعي عن تطبيقات البرامج الأخرى من حيث أنها تكشف عن أسرارها عندما يستخدم المرء أدوات تحليل الأداء القياسية إلى جانب أطر عمل معيارية ومدخلات الضغط.</p>
<p>وباستخدام هذه الأدوات، كشفنا عن مصائد الأداء المتعلقة بالتخصيص غير الضروري للذاكرة، والفشل في جلب التعليمات مسبقًا، واستخدام خيارات غير صحيحة للمترجم. واستنادًا إلى النتائج التي توصلنا إليها، قمنا بإدخال تحسينات على Milvus وNowhere وRedis ومترجم GCC للمساعدة في جعل الذكاء الاصطناعي أكثر أداءً واستدامة. قواعد البيانات المتجهة هي فئة مهمة من التطبيقات التي تستحق جهود التحسين. نأمل أن تساعدك هذه المقالة على البدء.</p>
