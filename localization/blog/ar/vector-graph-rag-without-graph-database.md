---
id: vector-graph-rag-without-graph-database.md
title: بنينا الرسم البياني RAG بدون قاعدة بيانات الرسم البياني
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  تضيف Vector Graph RAG مفتوحة المصدر Vector Graph RAG الاستدلال متعدد القفزات
  إلى RAG باستخدام Milvus فقط. 87.8% استرجاع@5، 2 استدعاءات LLM لكل استعلام، لا
  حاجة لقاعدة بيانات رسم بياني.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>الخلاصة:</em></strong> <em>هل تحتاج بالفعل إلى قاعدة بيانات للرسم البياني لـ Graph RAG؟ لا، ضع الكيانات والعلاقات والممرات في Milvus. استخدم توسعة الرسم البياني الفرعي بدلًا من اجتياز الرسم البياني، وإعادة ترتيب LLM واحدة بدلًا من حلقات العامل متعددة الجولات. هذا هو</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph</em></strong></a><strong><em> RAG،</em></strong> <em>وهذا ما بنيناه. حقق هذا النهج 87.8% في متوسط التذكر@5 على ثلاثة معايير لضمان الجودة متعدد القفزات وتفوق على HippoRAG 2 على مثيل واحد من Milvus.</em></p>
</blockquote>
<p>إن الأسئلة متعددة القفزات هي الحائط الذي تصطدم به معظم خطوط أنابيب RAG في نهاية المطاف. فالإجابة موجودة في مجموعة الأسئلة الخاصة بك، ولكنها تمتد على عدة مقاطع متصلة بكيانات لا يسميها السؤال أبدًا. الحل الشائع هو إضافة قاعدة بيانات للرسم البياني، مما يعني تشغيل نظامين بدلاً من نظام واحد.</p>
<p>ظللنا نصطدم بهذا الحائط بأنفسنا ولم نرغب في تشغيل قاعدتي بيانات لمجرد التعامل معه. لذلك قمنا ببناء <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG،</a> وهي مكتبة Python التي تجلب إمكانية التفكير متعدد القفزات إلى <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> باستخدام <a href="https://milvus.io/docs">Milvus</a> فقط، وهي قاعدة بيانات المتجهات مفتوحة المصدر الأكثر اعتمادًا على نطاق واسع. توفر نفس إمكانية القفزات المتعددة بقاعدة بيانات واحدة بدلاً من اثنتين.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">لماذا تعطّل الأسئلة متعددة القفزات نظام RAG القياسي<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>الأسئلة متعددة القفزات تعطل RAG القياسي لأن الإجابة تعتمد على علاقات الكيانات التي لا يمكن للبحث المتجه رؤيتها. غالبًا ما لا يكون الكيان الجسر الذي يربط السؤال بالإجابة موجودًا في السؤال نفسه.</p>
<p>تعمل الأسئلة البسيطة بشكل جيد. تقوم بتقطيع المستندات، وتضمينها، واسترداد أقرب التطابقات، وتغذيتها إلى LLM. "ما هي الفهارس التي يدعمها Milvus؟" موجودة في مقطع واحد، ويجدها البحث المتجه.</p>
<p>لا تتناسب الأسئلة متعددة المقاطع مع هذا النمط. خذ مثلاً سؤالاً مثل <em>"ما هي الآثار الجانبية التي يجب أن أنتبه لها مع أدوية السكري من الدرجة الأولى؟</em> </p>
<p>تتطلب الإجابة عليه خطوتين استدلاليتين. أولاً، يجب أن يعرف النظام أن الميتفورمين هو دواء الخط الأول لمرض السكري. وعندها فقط يمكنه البحث عن الآثار الجانبية للميتفورمين: مراقبة وظائف الكلى، وعدم الراحة في الجهاز الهضمي، ونقص فيتامين B12.</p>
<p>"الميتفورمين" هو الكيان الجسر. فهو يربط السؤال بالإجابة، لكن السؤال لا يذكره أبداً.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وهنا يتوقف <a href="https://zilliz.com/learn/vector-similarity-search">البحث عن التشابه في Vector</a>. فهو يسترجع المقاطع التي تشبه السؤال، وأدلة علاج مرض السكري وقوائم الآثار الجانبية للأدوية، لكنه لا يستطيع تتبع علاقات الكيانات التي تربط هذه المقاطع ببعضها البعض. تعيش حقائق مثل "الميتفورمين هو دواء الخط الأول لمرض السكري" في تلك العلاقات، وليس في نص أي مقطع منفرد.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">لماذا لا تعد قواعد بيانات الرسوم البيانية و RAG العميلة هي الحل<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>إن الطرق القياسية لحل RAG متعدد القفزات هي قواعد بيانات الرسوم البيانية وحلقات العامل التكرارية. كلاهما يعمل. كلاهما يكلف أكثر مما تريد معظم الفرق دفعه مقابل ميزة واحدة.</p>
<p>اسلك طريق قاعدة بيانات الرسم البياني أولاً. يمكنك استخراج ثلاثيات من مستنداتك، وتخزينها في قاعدة بيانات الرسم البياني، واجتياز الحواف للعثور على اتصالات متعددة القفزات. وهذا يعني تشغيل نظام ثانٍ إلى جانب <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة البيانات المتجهة</a> الخاصة بك، وتعلم Cypher أو Gremlin، والحفاظ على مزامنة مخازن الرسم البياني والمتجهات.</p>
<p>حلقات العامل التكرارية هي النهج الآخر. تسترجع LLM مجموعة ما، وتعللها، وتقرر ما إذا كان لديها سياق كافٍ، وتسترجع مرة أخرى إذا لم يكن كذلك. تقوم <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (تريفيدي وآخرون، 2023) بإجراء 3-5 مكالمات LLM لكل استعلام. يمكن أن يتجاوز معدل التكلفة لكل استعلام 10 لأن الوكيل يقرر متى يتوقف. لا يمكن التنبؤ بالتكلفة لكل استعلام، ويرتفع زمن انتقال P99 كلما أجرى الوكيل جولات إضافية.</p>
<p>لا يناسب أي منهما الفرق التي ترغب في الاستعلام متعدد القفزات دون إعادة بناء مكدسها. لذا جربنا شيئًا آخر.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">ما هو Vector Graph RAG، بنية الرسم البياني داخل قاعدة بيانات المتجهات<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> عبارة عن مكتبة Python مفتوحة المصدر من Python تجلب الاستدلال متعدد القفزات إلى <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> باستخدام <a href="https://milvus.io/docs">Milvus</a> فقط. تخزن بنية الرسم البياني كمراجع معرفات عبر ثلاث مجموعات Milvus. يصبح الاجتياز سلسلة من عمليات البحث عن المفتاح الأساسي في Milvus بدلاً من استعلامات Cypher ضد قاعدة بيانات الرسم البياني. يقوم ميلفوس واحد بالوظيفتين.</p>
<p>وهو يعمل لأن العلاقات في الرسم البياني المعرفي هي مجرد نص. الثلاثي <em>(وهو الميتفورمين، وهو دواء الخط الأول لمرض السكري من النوع الثاني)</em> هو حافة موجهة في قاعدة بيانات الرسم البياني. كما أنها جملة "الميتفورمين هو دواء الخط الأول لمرض السكري من النوع الثاني." يمكنك تضمين هذه الجملة كمتجه وتخزينها في <a href="https://milvus.io/docs">ميلفوس،</a> مثل أي نص آخر.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>إن الإجابة على استعلام متعدد القفزات يعني تتبع الروابط من ما يذكره الاستعلام (مثل "السكري") إلى ما لا يذكره (مثل "ميتفورمين"). لا يعمل ذلك إلا إذا كان التخزين يحافظ على تلك الروابط: أي الكيان الذي يتصل بأي منها من خلال أي علاقة. النص العادي قابل للبحث، ولكن لا يمكن متابعته.</p>
<p>لإبقاء الروابط قابلة للمتابعة في ميلفوس، نعطي كل كيان وكل علاقة معرّفًا فريدًا، ثم نخزنها في مجموعات منفصلة تشير إلى بعضها البعض بواسطة المعرّف. ثلاث مجموعات إجمالاً: <strong>الكيانات</strong> (العقد)، <strong>والعلاقات</strong> (الحواف)، <strong>والمقاطع</strong> (النص المصدر الذي يحتاجه LLM لتوليد الإجابات). يحتوي كل صف على تضمين متجه، لذا يمكننا البحث الدلالي في أي من المجموعات الثلاث.</p>
<p>تقوم<strong>الكيانات</strong> بتخزين الكيانات المستقطعة. لكل منها معرف فريد، <a href="https://zilliz.com/glossary/vector-embeddings">وتضمين مت</a> جه <a href="https://zilliz.com/glossary/semantic-search">للبحث</a> الدلالي، وقائمة بمعرفات العلاقات التي تشارك فيها.</p>
<table>
<thead>
<tr><th>المعرف</th><th>الاسم</th><th>التضمين</th><th>معرفات_العلاقات</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>ميتفورمين</td><td>[0.12, ...]</td><td>[ص01، ص02، ص03]</td></tr>
<tr><td>e02</td><td>داء السكري من النوع 2</td><td>[0.34, ...]</td><td>[ص01، ص04] [ص01، ص04]</td></tr>
<tr><td>e03</td><td>وظائف الكلى</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p>تخزن<strong>العلاقات</strong> ثلاثيات المعرفة. يسجل كل منها معرّفات الكيان الموضوع والموضوع، ومعرّفات المقاطع التي أتت منها، وتضمين نص العلاقة الكامل.</p>
<table>
<thead>
<tr><th>المعرف</th><th>الموضوع_المعرف</th><th>object_id</th><th>النص</th><th>التضمين</th><th>معرفات_الممر</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>الميتفورمين هو دواء الخط الأول لمرض السكري من النوع 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>يجب مراقبة وظائف الكلى لدى المرضى الذين يتناولون الميتفورمين</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p>تخزن<strong>المقاطع</strong> أجزاء المستند الأصلية، مع إشارات إلى الكيانات والعلاقات المستخرجة منها.</p>
<p>تشير المجموعات الثلاث إلى بعضها البعض من خلال حقول المعرفات: تحمل الكيانات معرفات علاقاتها، وتحمل العلاقات معرفات الكيانات موضوعها وموضوعها ومقاطع المصدر، وتحمل المقاطع معرفات كل ما تم استخراجه منها. هذه الشبكة من مراجع المعرفات هي الرسم البياني.</p>
<p>الاستعراض هو مجرد سلسلة من عمليات البحث عن المعرفات. تقوم بجلب الكيان e01 للحصول على <code translate="no">relation_ids</code> الخاص به ، ثم تجلب العلاقات r01 و r02 بتلك المعرفات، ثم تقرأ r01 <code translate="no">object_id</code> لاكتشاف الكيان e02 وتستمر. كل قفزة هي <a href="https://milvus.io/docs/get-and-scalar-query.md">استعلام مفتاح أساسي</a> قياسي من Milvus. لا حاجة لسايفر.</p>
<p>قد تتساءل عما إذا كانت الرحلات الإضافية إلى ميلفوس تضيف شيئًا. إنها ليست كذلك. يكلف توسيع الرسم البياني الفرعي 2-3 استعلامات مستندة إلى المعرف بإجمالي 20-30 مللي ثانية. تستغرق مكالمة LLM من 1-3 ثوانٍ، مما يجعل عمليات البحث عن المعرف غير مرئية بجانبها.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">كيف يجيب Vector Graph RAG على استعلام متعدد القفزات<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>يأخذ تدفق الاسترجاع استعلامًا متعدد القفزات إلى إجابة أساسية في أربع خطوات: <strong>استرجاع البذور ← توسيع الرسم البياني الفرعي ← إعادة ترتيب LLM ← توليد الإجابة.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>سنستعرض سؤال مرض السكري <em>"ما هي الآثار الجانبية التي يجب أن أنتبه لها مع أدوية الخط الأول لمرض السكري؟</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">الخطوة 1: استرجاع البذور</h3><p>يستخرج LLM الكيانات الرئيسية من السؤال: "السكري"، "الآثار الجانبية"، "أدوية الخط الأول". يعثر البحث المتجه في Milvus على الكيانات والعلاقات الأكثر صلة مباشرةً.</p>
<p>لكن الميتفورمين ليس من بينها. لا يذكره السؤال، لذا لا يمكن للبحث المتجهي العثور عليه.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">الخطوة 2: توسيع الرسم البياني الفرعي</h3><p>هذا هو المكان الذي يختلف فيه Vector Graph RAG عن RAG القياسي.</p>
<p>يتتبع النظام مراجع المعرفات من الكيانات الأولية قفزة واحدة للخارج. يحصل على معرّفات الكيانات الأولية، ويعثر على جميع العلاقات التي تحتوي على تلك المعرّفات، ويسحب معرّفات الكيانات الجديدة إلى الرسم البياني الفرعي. افتراضي: قفزة واحدة.</p>
<p><strong>يدخل "ميتفورمين"، وهو الكيان الجسر، إلى المخطط الفرعي.</strong></p>
<p>"السكري" له علاقة: <em>"الميتفورمين هو دواء الخط الأول لمرض السكري من النوع الثاني."</em> يؤدي اتباع هذه الحافة إلى دخول الميتفورمين. بمجرد دخول الميتفورمين في الرسم البياني الفرعي، تأتي معه العلاقات الخاصة به: <em>"يجب مراقبة وظائف الكلى لدى المرضى الذين يتناولون الميتفورمين"، "قد يسبب الميتفورمين عدم ارتياح في الجهاز الهضمي"، "قد يؤدي استخدام الميتفورمين على المدى الطويل إلى نقص فيتامين ب 12".</em></p>
<p>ترتبط الآن حقيقتان كانتا تعيشان في مقطعين منفصلين من خلال قفزة واحدة من توسيع الرسم البياني. يمكن الآن اكتشاف الكيان الجسر الذي لم يذكره السؤال أبدًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">الخطوة 3: إعادة تصنيف LLM</h3><p>يترك لك التوسيع عشرات العلاقات المرشحة. معظمها ضوضاء.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>يرسل النظام هؤلاء المرشحين والسؤال الأصلي إلى LLM: "أيهما يتعلق بالآثار الجانبية لأدوية الخط الأول لمرض السكري؟ إنها مكالمة واحدة بدون تكرار.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>تغطي العلاقات المختارة السلسلة الكاملة: داء السكري ← الميتفورمين ← مراقبة الكلى / عدم الراحة في الجهاز الهضمي / نقص فيتامين ب 12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">الخطوة 4: توليد الإجابة</h3><p>يسترجع النظام المقاطع الأصلية للعلاقات المختارة ويرسلها إلى LLM.</p>
<p>يولد LLM من نص المقطع الكامل، وليس من الثلاثيات المشذبة. الثلاثيات هي ملخصات مضغوطة. فهي تفتقر إلى السياق والمحاذير والتفاصيل التي يحتاجها LLM لإنتاج إجابة مستندة إلى أساس.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">شاهد Vector Graph RAG أثناء العمل</h3><p>لقد أنشأنا أيضًا واجهة تفاعلية تصور كل خطوة. انقر على لوحة الخطوات الموجودة على اليسار وسيتم تحديث الرسم البياني في الوقت الفعلي: البرتقالي للعقد الأولية، والأزرق للعقد الموسعة، والأخضر للعلاقات المختارة. إنه يجعل تدفق الاسترجاع ملموسًا بدلًا من التجريد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">لماذا تتفوق إعادة تصنيف واحدة على التكرارات المتعددة<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>يقوم خط الأنابيب الخاص بنا بإجراء مكالمتين LLM لكل استعلام: واحدة لإعادة التصنيف، والأخرى للتوليد. تقوم الأنظمة التكرارية مثل IRCoT وAgentic RAG بإجراء أكثر من 3 إلى 10 مكالمات لأنها تقوم بالتكرار: استرجاع، ثم استنتاج، ثم استرجاع مرة أخرى. نحن نتخطى التكرار لأن البحث المتجه وتوسيع النطاق الفرعي يغطيان كلاً من التشابه الدلالي والوصلات الهيكلية في مسار واحد، مما يمنح LLM ما يكفي من المرشحين لإنهاء عملية إعادة الترتيب مرة واحدة.</p>
<table>
<thead>
<tr><th>النهج</th><th>مكالمات LLM لكل استعلام</th><th>ملف تعريف الكمون</th><th>التكلفة النسبية لواجهة برمجة التطبيقات</th></tr>
</thead>
<tbody>
<tr><td>الرسم البياني المتجه RAG</td><td>2 (إعادة تصنيف + توليد)</td><td>ثابت، يمكن التنبؤ به</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>متغير</td><td>~2-3x</td></tr>
<tr><td>وكيل RAG العميل</td><td>5-10+</td><td>غير متوقع</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>في الإنتاج، هذا يعني انخفاض تكلفة واجهة برمجة التطبيقات بنسبة 60% تقريبًا، واستجابات أسرع 2-3 أضعاف، ووقت استجابة يمكن التنبؤ به. لا طفرات مفاجئة عندما يقرر الوكيل تشغيل جولات إضافية.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">النتائج المعيارية<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>حقق Vector Graph RAG متوسط استرجاع بنسبة 87.8% @5 عبر ثلاثة معايير قياسية لضمان الجودة متعدد القفزات، وهو ما يطابق أو يتجاوز كل طريقة اختبرناها، بما في ذلك HippoRAG 2، مع استدعاءات Milvus و2 LLM فقط.</p>
<p>لقد قمنا بالتقييم على MuSiQue (2-4 قفزات، وهي الأصعب)، وHotpotQA (2 قفزات، وهي الأكثر استخدامًا)، و2WikiMultiHopQA (2 قفزات، الاستدلال عبر المستندات). المقياس هو Recall@5: ما إذا كانت المقاطع الداعمة الصحيحة تظهر في أعلى 5 نتائج مسترجعة.</p>
<p>استخدمنا نفس الثلاثيات المستخرجة مسبقًا من <a href="https://github.com/OSU-NLP-Group/HippoRAG">مستودع HippoRAG</a> لإجراء مقارنة عادلة. لا إعادة استخلاص، ولا معالجة مسبقة مخصصة. تعزل المقارنة خوارزمية الاسترجاع نفسها.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">الرسم البياني المتجه R</a> AG مقابل RAG القياسي (الساذج) RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يرفع Vector Graph RAG متوسط الاسترجاع@5 من 73.4% إلى 87.8%، وهو ما يمثل تحسنًا بنسبة 19.6 نقطة مئوية.</p>
<ul>
<li>MuSiQue: أكبر مكسب (+31.4 نقطة مئوية). معيار 3-4 قفزات، أصعب الأسئلة متعددة القفزات، وهو أصعب الأسئلة متعددة القفزات، وهو بالضبط المكان الذي يكون فيه لتوسيع النطاق الفرعي أكبر تأثير.</li>
<li>2WikiMultiHopQA: تحسن حاد (+27.7 نقطة مئوية). الاستدلال عبر المستندات، وهي نقطة أخرى رائعة لتوسيع النطاق الفرعي.</li>
<li>HotpotQA: مكسب أقل (+6.1 نقطة)، لكن RAG القياسي يسجل بالفعل 90.8% على مجموعة البيانات هذه. السقف منخفض.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">الرسم البياني المتجه RAG</a> مقابل أحدث الأساليب (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يحصل Vector Graph RAG على أعلى متوسط نقاط بنسبة 87.8% مقابل HippoRAG 2 وIRCoT وNV-Embed-v2.</p>
<p>معيار بالمعيار:</p>
<ul>
<li>HotpotQA: تعادل HippoRAG 2 (كلاهما 96.3%)</li>
<li>2WikiMultiHopMultiHopQA: يتقدم بـ 3.7 نقطة (94.1% مقابل 90.4%)</li>
<li>MuSiQue (الأصعب): يتأخر بفارق 1.7 نقطة (73.0% مقابل 74.7%)</li>
</ul>
<p>يحقق Vector Graph RAG هذه الأرقام باستخدام استدعاءين فقط من LLM لكل استعلام، ولا توجد قاعدة بيانات للرسم البياني ولا ColBERTv2. يعمل على أبسط بنية تحتية في المقارنة ولا يزال يحقق أعلى متوسط.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">كيف يقارن <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> مع مناهج RAG الأخرى للرسم البياني<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>تعمل مناهج RAG المختلفة للرسم البياني على تحسين المشاكل المختلفة. صُمم Vector Graph RAG للإنتاج متعدد القفزات لضمان الجودة بتكلفة متوقعة وبنية تحتية بسيطة.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>البنية التحتية</strong></td><td>قاعدة بيانات الرسم البياني + قاعدة بيانات المتجهات</td><td>ColBERTv2 + رسم بياني داخل الذاكرة</td><td>قاعدة بيانات المتجهات + وكلاء متعددو الجولات</td><td><strong>ميلفوس فقط</strong></td></tr>
<tr><td><strong>مكالمات LLM لكل استعلام</strong></td><td>متفاوتة</td><td>معتدل</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>الأفضل ل</strong></td><td>تلخيص المجموعة الشاملة</td><td>الاسترجاع الأكاديمي الدقيق</td><td>الاستكشاف المعقد والمفتوح</td><td><strong>ضمان جودة الإنتاج متعدد القفزات</strong></td></tr>
<tr><td><strong>قلق التحجيم</strong></td><td>فهرسة LLM مكلفة</td><td>رسم بياني كامل في الذاكرة</td><td>وقت استجابة وتكلفة لا يمكن التنبؤ بها</td><td><strong>المقاييس مع ميلفوس</strong></td></tr>
<tr><td><strong>تعقيد الإعداد</strong></td><td>عالية</td><td>متوسط-عالي</td><td>متوسط</td><td><strong>منخفضة (تثبيت بنقرة واحدة)</strong></td></tr>
</tbody>
</table>
<p>يستخدم<a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> التجميع الهرمي للمجتمع للإجابة عن أسئلة التلخيص العالمي مثل "ما هي الموضوعات الرئيسية في هذه المجموعة؟ هذه مشكلة مختلفة عن ضمان الجودة متعدد القفزات.&quot;</p>
<p>يستخدم<a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez وآخرون، 2025) الاسترجاع المستوحى من الإدراك مع المطابقة على مستوى الرمز المميز ColBERTv2. يحد تحميل الرسم البياني الكامل في الذاكرة من قابلية التوسع.</p>
<p>المقاربات التكرارية مثل <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> تتداول بساطة البنية التحتية مقابل تكلفة LLM وزمن انتقال غير متوقع.</p>
<p>يستهدف Vector Graph RAG ضمان الجودة متعدد القفزات للإنتاج: الفرق التي تريد تكلفة ووقت استجابة يمكن التنبؤ به دون إضافة قاعدة بيانات للرسم البياني.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">متى يتم استخدام Vector Graph RAG وحالات الاستخدام الرئيسية<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم Vector Graph RAG لأربعة أنواع من أعباء العمل:</p>
<table>
<thead>
<tr><th>السيناريو</th><th>لماذا يناسب</th></tr>
</thead>
<tbody>
<tr><td><strong>المستندات ذات الكثافة المعرفية</strong></td><td>الرموز القانونية مع المراجع التبادلية والأدبيات الطبية الحيوية مع سلاسل جينات الأدوية والأمراض، والإيداعات المالية مع روابط بين الشركة والشخص والحدث، والمستندات التقنية مع الرسوم البيانية لتبعية واجهة برمجة التطبيقات</td></tr>
<tr><td><strong>2-4 أسئلة ذات قفزة واحدة</strong></td><td>تعمل الأسئلة ذات القفزة الواحدة بشكل جيد مع RAG القياسي. قد تحتاج خمس قفزات أو أكثر إلى طرق تكرارية. إن نطاق 2-4 قفزات هو النقطة المثالية لتوسيع الرسم البياني الفرعي.</td></tr>
<tr><td><strong>النشر البسيط</strong></td><td>قاعدة بيانات واحدة، واحدة <code translate="no">pip install</code> ، لا توجد بنية تحتية للرسم البياني للتعلم</td></tr>
<tr><td><strong>حساسية التكلفة والكمون</strong></td><td>مكالمتان LLM لكل استعلام، ثابتة ويمكن التنبؤ بها. عند آلاف الاستعلامات اليومية، يتراكم الفرق.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">ابدأ مع Vector Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> بدون وسيطات افتراضيًا إلى <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. يقوم بإنشاء ملف <code translate="no">.db</code> محلي، مثل SQLite. لا يوجد خادم لبدء التشغيل، ولا شيء لتكوينه.</p>
<p><code translate="no">add_texts()</code> يستدعي LLM لاستخراج ثلاثيات من النص الخاص بك، ويوجهها، ويخزن كل شيء في Milvus. <code translate="no">query()</code> يقوم بتشغيل تدفق الاسترجاع الكامل المكون من أربع خطوات: البذور، التوسيع، إعادة التصنيف، الإنشاء.</p>
<p>للإنتاج، قم بتبديل معلمة URI واحدة. تبقى بقية التعليمات البرمجية كما هي:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>لاستيراد ملفات PDF أو صفحات الويب أو ملفات Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>لا يحتاج Graph RAG إلى قاعدة بيانات للرسم البياني. يخزن Vector Graph RAG بنية الرسم البياني كمراجع معرفات عبر ثلاث مجموعات Milvus، مما يحول اجتياز الرسم البياني إلى عمليات بحث عن المفتاح الأساسي ويحافظ على كل استعلام متعدد القفزات في استدعاءين LLM ثابتين.</p>
<p>لمحة سريعة</p>
<ul>
<li>مكتبة بايثون مفتوحة المصدر. الاستدلال متعدد القفزات على Milvus وحده.</li>
<li>ثلاث مجموعات مرتبطة بمعرف. الكيانات (العقد) والعلاقات (الحواف) والمقاطع (النص المصدر). يتتبع توسيع النطاق الفرعي المعرفات لاكتشاف الكيانات الجسرية التي لم يذكرها الاستعلام.</li>
<li>استدعاءان لـ LLM لكل استعلام. إعادة ترتيب واحدة وتوليد واحد. لا يوجد تكرار.</li>
<li>87.8% متوسط التذكّر@5 عبر MuSiQue وHotpotQA و2WikiMultiHopQA، مطابقًا أو متفوقًا على HippoRAG 2 في اثنين من ثلاثة.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">جربه:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> للحصول على الكود</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">مستندات</a> لواجهة برمجة التطبيقات الكاملة والأمثلة</li>
<li>انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع</a> <a href="https://slack.milvus.io/">ميلفوس</a> <a href="https://slack.milvus.io/">على ديسكورد</a> لطرح الأسئلة ومشاركة التعليقات</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة ساعات عمل ميلفوس المكتبية</a> للتعرف على حالة الاستخدام الخاصة بك</li>
<li>تقدم<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> مستوى مجاني مع Milvus المُدار إذا كنت تفضل تخطي إعداد البنية التحتية</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">الأسئلة الشائعة<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">هل يمكنني عمل Graph RAG باستخدام قاعدة بيانات متجهة فقط؟</h3><p>نعم. يقوم Vector Graph RAG بتخزين بنية الرسم البياني المعرفي (الكيانات والعلاقات وارتباطاتها) داخل ثلاث مجموعات Milvus مرتبطة بمراجع تبادلية للمعرفات. وبدلًا من اجتياز الحواف في قاعدة بيانات الرسم البياني، فإنه يسلسل عمليات البحث عن المفتاح الأساسي في Milvus لتوسيع مخطط فرعي حول الكيانات الأولية. يحقق ذلك 87.8% متوسط استرجاع@5 على ثلاثة معايير قياسية متعددة القفزات دون أي بنية تحتية لقاعدة بيانات الرسم البياني.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">كيف يقارن Vector Graph RAG مع Microsoft GraphRAG؟</h3><p>إنهما يحلان مشاكل مختلفة. يستخدم Microsoft GraphRAG التجميع الهرمي للمجتمع لتلخيص مجموعة المستندات العالمية ("ما هي الموضوعات الرئيسية في هذه المستندات؟"). بينما يركز Vector Graph RAG على الإجابة عن الأسئلة متعددة القفزات، حيث يكون الهدف هو تجميع حقائق محددة عبر المقاطع. يحتاج Vector Graph RAG فقط إلى Milvus واستدعائين LLM لكل استعلام. يتطلب Microsoft GraphRAG قاعدة بيانات رسم بياني ويحمل تكاليف فهرسة أعلى.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">ما أنواع الأسئلة التي تستفيد من RAG متعدد القفزات؟</h3><p>يساعد RAG متعدد القفزات في الأسئلة التي تعتمد إجابتها على ربط المعلومات المتناثرة عبر مقاطع متعددة، خاصةً عندما لا يظهر كيان رئيسي في السؤال. ومن الأمثلة على ذلك "ما هي الآثار الجانبية لدواء الخط الأول لمرض السكري؟ (يتطلب اكتشاف الميتفورمين كحلقة وصل)، وعمليات البحث عن المراجع التبادلية في النص القانوني أو التنظيمي، وتتبع سلسلة التبعية في الوثائق الفنية. يتعامل RAG القياسي مع عمليات البحث أحادية العامل بشكل جيد. يضيف RAG متعدد القفزات قيمة عندما يكون مسار الاستدلال من خطوتين إلى أربع خطوات.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">هل أحتاج إلى استخراج ثلاثيات الرسم البياني المعرفي يدويًا؟</h3><p>لا. <code translate="no">add_texts()</code> و <code translate="no">add_documents()</code> يتصلان تلقائيًا بـ LLM لاستخراج الكيانات والعلاقات، ويوجهانها ويخزنانها في Milvus. يمكنك استيراد المستندات من عناوين URL، وملفات PDF، وملفات DOCX باستخدام <code translate="no">DocumentImporter</code> المدمج. للقياس أو الترحيل، تدعم المكتبة استيراد ثلاثيات مستخرجة مسبقًا من أطر أخرى مثل HippoRAG.</p>
