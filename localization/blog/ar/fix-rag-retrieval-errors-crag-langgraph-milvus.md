---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: إصلاح أخطاء استرجاع RAG باستخدام CRAG وLangGraph وMilvus
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  تشابه كبير ولكن إجابات خاطئة؟ تعرف على كيفية إضافة CRAG التقييم والتصحيح إلى
  خطوط أنابيب RAG. بناء نظام جاهز للإنتاج باستخدام LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>مع دخول تطبيقات LLM في مرحلة الإنتاج، تحتاج الفرق بشكل متزايد إلى أن تجيب نماذجها على الأسئلة المستندة إلى بيانات خاصة أو معلومات في الوقت الفعلي. إن <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">التوليد المعزز بالاسترجاع</a> (RAG) - حيث يسحب النموذج من قاعدة معرفية خارجية في وقت الاستعلام - هو النهج القياسي. فهو يقلل من الهلوسة ويبقي الإجابات حديثة.</p>
<p>ولكن هناك مشكلة تظهر بسرعة في الممارسة العملية: <strong>يمكن أن يحصل المستند على درجة عالية في التشابه ومع ذلك يكون خاطئًا تمامًا بالنسبة للسؤال.</strong> تساوي خطوط أنابيب RAG التقليدية بين التشابه والأهمية. في الإنتاج، ينهار هذا الافتراض. قد تكون النتيجة ذات الترتيب الأعلى قديمة أو مرتبطة بشكل عرضي فقط أو تفتقد التفاصيل الدقيقة التي يحتاجها المستخدم.</p>
<p>يعالج CRAG (الاسترجاع التصحيحي-التوليد المعزز) هذا الأمر من خلال إضافة التقييم والتصحيح بين الاسترجاع والتوليد. فبدلاً من الثقة العمياء في درجات التشابه، يتحقق النظام مما إذا كان المحتوى المسترجع يجيب بالفعل على السؤال - ويصلح الوضع عندما لا يجيب.</p>
<p>تتناول هذه المقالة بناء نظام CRAG جاهز للإنتاج باستخدام LangChain وLangGraph <a href="https://milvus.io/intro">وMilvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">ثلاث مشاكل في الاسترجاع لا يحلها نظام RAG التقليدي<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>تعود معظم حالات فشل RAG في الإنتاج إلى واحدة من ثلاث مشاكل:</p>
<p><strong>عدم تطابق الاسترجاع.</strong> المستند متشابه من الناحية الموضعية ولكنه لا يجيب على السؤال في الواقع. اسأل عن كيفية تكوين شهادة HTTPS في Nginx، وقد يُرجع النظام دليل إعداد Apache، أو إرشادات إرشادية لعام 2019، أو شرحًا عامًا حول كيفية عمل TLS. قريب دلاليًا، عديم الفائدة عمليًا.</p>
<p><strong>محتوى قديم.</strong> لا يحتوي <a href="https://zilliz.com/learn/vector-similarity-search">البحث المتجه</a> على مفهوم التكرار. استعلم عن "أفضل ممارسات بايثون المزامنة" وستحصل على مزيج من أنماط 2018 وأنماط 2024، مرتبة حسب مسافة التضمين فقط. لا يستطيع النظام التمييز بين ما يحتاجه المستخدم بالفعل.</p>
<p><strong>تلوث الذاكرة.</strong> هذه المشكلة تتفاقم بمرور الوقت وغالباً ما تكون الأصعب في الإصلاح. لنفترض أن النظام يسترجع مرجعًا قديمًا لواجهة برمجة التطبيقات ويُنشئ رمزًا غير صحيح. يتم تخزين هذا الناتج السيئ في الذاكرة. في الاستعلام المماثل التالي، يسترجعه النظام مرة أخرى - مما يعزز الخطأ. تختلط المعلومات القديمة والحديثة تدريجياً، وتتآكل موثوقية النظام مع كل دورة.</p>
<p>هذه ليست حالات زاوية. فهي تظهر بانتظام بمجرد أن يتعامل نظام RAG مع حركة مرور حقيقية. وهذا ما يجعل عمليات التحقق من جودة الاسترجاع مطلبًا وليس أمرًا لطيفًا.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">ما هو CRAG؟ التقييم أولاً، ثم التوليد<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>التوليد المعزز للاسترجاع التصحيحي (CRAG)</strong> هي طريقة تضيف خطوة تقييم وتصحيح بين الاسترجاع والتوليد في خط أنابيب RAG. تم تقديمها في ورقة بحثية بعنوان "التوليد <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>المعزز للاسترجاع التصحيحي المعزز</em></a> " (يان وآخرون، 2024). على عكس التوليد المعزز الاسترجاعي التصحيحي التقليدي، الذي يتخذ قرارًا ثنائيًا - استخدام المستند أو تجاهله - يقوم التوليد المعزز الاسترجاعي التصحيحي بتسجيل كل نتيجة مسترجعة لمعرفة مدى ملاءمتها ويوجهها عبر أحد مسارات التصحيح الثلاثة قبل أن تصل إلى نموذج اللغة.</p>
<p>يواجه RAG التقليدي صعوبات عندما تقع نتائج الاسترجاع في منطقة رمادية: ذات صلة جزئيًا، أو قديمة إلى حد ما، أو تفتقد إلى جزء رئيسي. بوابة نعم/لا البسيطة إما أن تتجاهل المعلومات الجزئية المفيدة أو تسمح بمرور المحتوى المزعج. تقوم CRAG بإعادة صياغة خط سير العمل من <strong>استرجاع ← توليد</strong> إلى <strong>استرجاع ← تقييم ← تصحيح ← توليد،</strong> مما يمنح النظام فرصة لإصلاح جودة الاسترجاع قبل بدء التوليد.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>سير عمل CRAG المكون من أربع خطوات: الاسترجاع ← التقييم ← التقييم ← التصحيح ← التوليد، مما يوضح كيفية تسجيل المستندات وتوجيهها</span> </span></p>
<p>يتم تصنيف النتائج المسترجعة إلى واحدة من ثلاث فئات:</p>
<ul>
<li><strong>صحيحة:</strong> تجيب مباشرةً على الاستعلام؛ قابلة للاستخدام بعد التنقيح الخفيف</li>
<li><strong>غامضة:</strong> ذات صلة جزئيًا؛ تحتاج إلى معلومات تكميلية</li>
<li><strong>غير صحيحة:</strong> غير ذات صلة؛ يتم تجاهلها والعودة إلى مصادر بديلة</li>
</ul>
<table>
<thead>
<tr><th>قرار</th><th>ثقة</th><th>الإجراء</th></tr>
</thead>
<tbody>
<tr><td>صحيح</td><td>&gt; 0.9</td><td>تنقيح محتوى المستند</td></tr>
<tr><td>غامض</td><td>0.5-0.9</td><td>تنقيح المستند + استكماله بالبحث على الويب</td></tr>
<tr><td>غير صحيح</td><td>&lt; 0.5</td><td>تجاهل نتائج الاسترجاع؛ الرجوع بالكامل إلى البحث على الويب</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">تنقيح المحتوى</h3><p>يعالج CRAG أيضًا مشكلة أكثر دقة مع RAG القياسي: معظم الأنظمة تغذي النموذج بالمستند المسترجع بالكامل. يؤدي هذا إلى إهدار الرموز وتخفيف الإشارة - حيث يتعين على النموذج أن يخوض في فقرات غير ذات صلة للعثور على الجملة الوحيدة المهمة بالفعل. يقوم CRAG بتنقيح المحتوى المسترجع أولاً، واستخراج الأجزاء ذات الصلة وتجريد الباقي.</p>
<p>تستخدم الورقة الأصلية شرائط المعرفة والقواعد الاستدلالية لهذا الغرض. في الممارسة العملية، تعمل مطابقة الكلمات الرئيسية في العديد من حالات الاستخدام، ويمكن لأنظمة الإنتاج أن تضع طبقات على التلخيص القائم على LLM أو الاستخراج المنظم للحصول على جودة أعلى.</p>
<p>تتكون عملية التنقيح من ثلاثة أجزاء:</p>
<ul>
<li><strong>تفكيك المستند:</strong> استخراج المقاطع الرئيسية من مستند أطول</li>
<li><strong>إعادة كتابة الاستعلام:</strong> تحويل الاستعلامات الغامضة أو المبهمة إلى استعلامات أكثر استهدافًا</li>
<li><strong>اختيار المعرفة:</strong> استخلاص المحتوى الأكثر فائدة وترتيبها والاحتفاظ بها فقط</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>عملية تنقيح المستند المكونة من ثلاث خطوات: تحليل المستند (2000 → 500 رمز)، وإعادة كتابة الاستعلام (تحسين دقة البحث)، واختيار المعرفة (التصفية والترتيب والتشذيب)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">المقيّم</h3><p>المقيِّم هو جوهر CRAG. إنه ليس مخصصًا للاستدلال العميق - إنه بوابة فرز سريع. بالنظر إلى استعلام ومجموعة من المستندات المسترجعة، فإنه يقرر ما إذا كان المحتوى جيدًا بما يكفي لاستخدامه.</p>
<p>تختار الورقة البحثية الأصلية نموذج T5-Large المضبوط بدقة بدلاً من نموذج LLM للأغراض العامة. المنطق: السرعة والدقة أكثر أهمية من المرونة في هذه المهمة بالذات.</p>
<table>
<thead>
<tr><th>السمة</th><th>T5-Large المضبوط بدقة T5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>الكمون</td><td>10-20 مللي ثانية</td><td>200 مللي ثانية فأكثر</td></tr>
<tr><td>الدقة</td><td>92% (تجارب ورقية)</td><td>يحدد لاحقًا</td></tr>
<tr><td>ملاءمة المهمة</td><td>عالية - مهمة واحدة مضبوطة بدقة عالية ودقة أعلى</td><td>متوسط - للأغراض العامة، أكثر مرونة ولكن أقل تخصصًا</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">تراجع البحث على الويب</h3><p>عندما يتم الإبلاغ عن الاسترجاع الداخلي على أنه غير صحيح أو غامض، يمكن ل CRAG تشغيل بحث الويب لسحب معلومات أحدث أو معلومات تكميلية. يعمل هذا كشبكة أمان للاستعلامات الحساسة للوقت والمواضيع التي بها ثغرات في قاعدة المعرفة الداخلية.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">لماذا يعتبر ميلفوس ملائمًا ل CRAG في الإنتاج<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>تعتمد فعالية CRAG على ما يقع تحتها. تحتاج <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة البيانات المتجهة</a> إلى القيام بأكثر من مجرد البحث عن التشابه الأساسي - فهي تحتاج إلى دعم العزل متعدد المستأجرين والاسترجاع المختلط ومرونة المخطط التي يتطلبها نظام CRAG للإنتاج.</p>
<p>بعد تقييم العديد من الخيارات، اخترنا <a href="https://zilliz.com/what-is-milvus">Milvus</a> لثلاثة أسباب.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">العزل متعدد المستأجرين</h3><p>في الأنظمة القائمة على الوكلاء، يحتاج كل مستخدم أو جلسة عمل إلى مساحة الذاكرة الخاصة به. ويصبح النهج الساذج - مجموعة واحدة لكل مستأجر - مشكلة تشغيلية بسرعة، خاصة على نطاق واسع.</p>
<p>يعالج ميلفوس هذا الأمر باستخدام <a href="https://milvus.io/docs/use-partition-key.md">مفتاح التقسيم</a>. قم بتعيين <code translate="no">is_partition_key=True</code> على الحقل <code translate="no">agent_id</code> ، ويقوم Milvus بتوجيه الاستعلامات إلى القسم الصحيح تلقائيًا. لا يوجد امتداد للمجموعة، ولا يوجد رمز توجيه يدوي.</p>
<p>في اختباراتنا المعيارية التي أجريناها باستخدام 10 ملايين ناقل عبر 100 مستأجر، حقق Milvus مع ضغط التجميع <strong>معدل QPS أعلى بمقدار 3-5 أضعاف</strong> مقارنةً بخط الأساس غير المحسّن.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">الاسترجاع الهجين</h3><p>لا يفي البحث المتجه النقي بالمطابقة التامة لوحدات تعريف المنتج للمحتوى مثل <code translate="no">SKU-2024-X5</code> أو سلاسل الإصدارات أو المصطلحات المحددة.</p>
<p>يدعم Milvus 2.5 <a href="https://milvus.io/docs/multi-vector-search.md">الاسترجاع الهجين</a> محليًا: المتجهات الكثيفة للتشابه الدلالي، والمتجهات المتفرقة لمطابقة الكلمات الرئيسية على غرار BM25، وتصفية البيانات الوصفية القياسية - كل ذلك في استعلام واحد. يتم دمج النتائج باستخدام دمج الرتب المتبادل (RRF)، لذلك لا تحتاج إلى إنشاء ودمج خطوط أنابيب استرجاع منفصلة.</p>
<p>على مجموعة بيانات مكونة من مليون متجه، وصل زمن استرجاع Milvus Sparse-BM25 إلى <strong>6 مللي</strong> ثانية، مع تأثير ضئيل على أداء CRAG من طرف إلى طرف.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">مخطط مرن للذاكرة المتطورة</h3><p>مع نضوج خطوط أنابيب CRAG، يتطور نموذج البيانات معها. كنا بحاجة إلى إضافة حقول مثل <code translate="no">confidence</code> و <code translate="no">verified</code> و <code translate="no">source</code> أثناء تكرار منطق التقييم. في معظم قواعد البيانات، هذا يعني نصوص الترحيل والتوقف عن العمل.</p>
<p>يدعم Milvus حقول JSON الديناميكية، لذلك يمكن توسيع البيانات الوصفية بسرعة دون انقطاع الخدمة.</p>
<p>إليك مخطط نموذجي:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>يبسط Milvus أيضًا توسيع نطاق النشر. فهو يوفر <a href="https://milvus.io/docs/install-overview.md">أنماط Lite و Standalone و Distributed</a> المتوافقة مع التعليمات البرمجية - لا يتطلب الانتقال من التطوير المحلي إلى مجموعة الإنتاج سوى تغيير سلسلة الاتصال.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">التدريب العملي: بناء نظام CRAG باستخدام البرمجيات الوسيطة LangGraph Middleware و Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">لماذا نهج البرمجيات الوسيطة؟</h3><p>إحدى الطرق الشائعة لبناء CRAG باستخدام LangGraph هي توصيل رسم بياني للحالة مع عقد وحواف تتحكم في كل خطوة. يعمل هذا، ولكن يتشابك الرسم البياني مع زيادة التعقيد، ويصبح تصحيح الأخطاء صداعًا.</p>
<p>لقد استقرينا على <strong>نمط البرمجيات الوسيطة</strong> في LangGraph 1.0. فهو يعترض الطلبات قبل استدعاء النموذج، لذا يتم التعامل مع الاسترجاع والتقييم والتصحيح في مكان واحد متماسك. مقارنةً بنهج مخطط الحالة:</p>
<ul>
<li><strong>كود أقل:</strong> المنطق مركزي، وليس مبعثرًا عبر عقد الرسم البياني</li>
<li><strong>أسهل في المتابعة:</strong> يُقرأ تدفق التحكم بشكل خطي</li>
<li><strong>أسهل في التصحيح:</strong> تشير الأعطال إلى موقع واحد، وليس إلى اجتياز الرسم البياني</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">سير العمل الأساسي</h3><p>يعمل خط الأنابيب في أربع خطوات</p>
<ol>
<li><strong>الاسترجاع:</strong> جلب أفضل 3 مستندات ذات صلة من ميلفوس، على نطاق المستأجر الحالي</li>
<li><strong>التقييم: تقييم</strong> جودة المستند باستخدام نموذج خفيف الوزن</li>
<li><strong>التصحيح:</strong> التنقيح أو التكميل بالبحث على الويب أو التراجع كلياً بناءً على الحكم</li>
<li><strong>الحقن:</strong> تمرير السياق النهائي إلى النموذج من خلال موجه نظام ديناميكي</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">إعداد البيئة وإعداد البيانات</h3><p><strong>متغيرات البيئة</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>إنشاء مجموعة ميلفوس</strong></p>
<p>قبل تشغيل الشيفرة، قم بإنشاء مجموعة في ملفوس بمخطط يطابق منطق الاسترجاع.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>ملاحظة الإصدار:</strong> تستخدم هذه الشيفرة البرمجية أحدث ميزات البرمجيات الوسيطة في LangGraph وLangChain. قد تتغير واجهات برمجة التطبيقات هذه مع تطور الأطر - تحقق من <a href="https://langchain-ai.github.io/langgraph/">وثائق LangGraph</a> لمعرفة أحدث الاستخدامات.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">الوحدات الرئيسية</h3><p><strong>1. تصميم مقيِّم على مستوى الإنتاج</strong></p>
<p>طريقة <code translate="no">_evaluate_relevance()</code> في الشيفرة أعلاه مبسطة عمدًا للاختبار السريع. بالنسبة للإنتاج، ستحتاج إلى مخرجات منظمة مع تسجيل الثقة وإمكانية الشرح:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. تنقيح المعرفة والتراجع</strong></p>
<p>تعمل ثلاث آليات معًا للحفاظ على سياق النموذج عالي الجودة:</p>
<ul>
<li>يستخرج<strong>تنقيح المعرفة</strong> أكثر الجمل ذات الصلة بالاستعلام ويزيل الضوضاء.</li>
<li>يتم تشغيل<strong>البحث الاحتياطي</strong> عندما يكون الاسترجاع المحلي غير كافٍ، حيث يتم سحب المعرفة الخارجية عبر Tavily.</li>
<li>يجمع<strong>دمج السياق</strong> بين الذاكرة الداخلية والنتائج الخارجية في كتلة سياق واحدة غير مكررة قبل أن تصل إلى النموذج.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">نصائح لتشغيل CRAG في الإنتاج<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>هناك ثلاثة مجالات مهمة للغاية بمجرد تجاوز النماذج الأولية.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. التكلفة: اختر المقيِّم المناسب</h3><p>يعمل المقيِّم على كل استعلام على حدة، مما يجعله أكبر رافعة لكل من زمن الاستجابة والتكلفة.</p>
<ul>
<li><strong>أعباء العمل عالية التكلفة:</strong> نموذج خفيف الوزن مضبوط بدقة مثل T5-Large يحافظ على زمن الاستجابة عند 10-20 مللي ثانية والتكاليف متوقعة.</li>
<li><strong>منخفضة الحركة أو النماذج الأولية:</strong> يعد النموذج المستضاف مثل <code translate="no">gpt-4o-mini</code> أسرع في الإعداد ويحتاج إلى عمل تشغيلي أقل، ولكن زمن الاستجابة وتكاليف كل مكالمة أعلى.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. إمكانية المراقبة: الأداة من اليوم الأول</h3><p>أصعب مشكلات الإنتاج هي تلك التي لا يمكنك رؤيتها حتى تتدهور جودة الإجابة بالفعل.</p>
<ul>
<li><strong>مراقبة البنية التحتية:</strong> يتكامل ميلفوس مع <a href="https://milvus.io/docs/monitor_overview.md">بروميثيوس</a>. ابدأ بثلاثة مقاييس <code translate="no">milvus_query_latency_seconds</code> ، <code translate="no">milvus_search_qps</code> ، و <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>مراقبة التطبيقات:</strong> تتبع توزيع حكم CRAG، ومعدل تشغيل البحث على الويب، وتوزيع درجة الثقة. بدون هذه الإشارات، لا يمكنك معرفة ما إذا كان انخفاض الجودة ناتجًا عن سوء الاسترجاع أو سوء تقدير المقيّم.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. الصيانة طويلة الأجل: منع تلوث الذاكرة</h3><p>كلما طالت مدة تشغيل الوكيل، كلما تراكمت البيانات القديمة ومنخفضة الجودة في الذاكرة. قم بإعداد حواجز الحماية مبكراً:</p>
<ul>
<li><strong>التصفية المسبقة:</strong> ذكريات السطح فقط مع <code translate="no">confidence &gt; 0.7</code> بحيث يتم حظر المحتوى منخفض الجودة قبل أن يصل إلى المقيّم.</li>
<li><strong>التضاؤل الزمني:</strong> تقليل وزن الذكريات الأقدم تدريجيًا. ثلاثون يومًا هي بداية افتراضية معقولة، يمكن ضبطها حسب حالة الاستخدام.</li>
<li><strong>التنظيف المجدول:</strong> قم بتشغيل مهمة أسبوعية لتطهير الذكريات القديمة ذات الثقة المنخفضة التي لم يتم التحقق منها. هذا يمنع حلقة التغذية الراجعة حيث يتم استرجاع البيانات القديمة واستخدامها وإعادة تخزينها.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">الخاتمة - وبعض الأسئلة الشائعة<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>تعالج CRAG واحدة من أكثر المشاكل المستمرة في إنتاج RAG: نتائج الاسترجاع التي تبدو ذات صلة ولكنها ليست كذلك. من خلال إدراج خطوة تقييم وتصحيح بين الاسترجاع والتوليد، فإنه يقوم بتصفية النتائج السيئة، ويملأ الثغرات بالبحث الخارجي، ويمنح النموذج سياقًا أنظف للعمل معه.</p>
<p>لكن جعل CRAG يعمل بشكل موثوق في الإنتاج يتطلب أكثر من مجرد منطق استرجاع جيد. فهو يتطلب قاعدة بيانات متجهة تتعامل مع العزل متعدد المستأجرين، والبحث المختلط، والمخططات المتطورة - وهو ما يناسب <a href="https://milvus.io/intro">Milvus</a>. على جانب التطبيق، فإن اختيار المقيّم المناسب، وتفعيل إمكانية الملاحظة مبكرًا، وإدارة جودة الذاكرة بفعالية هي ما يفصل بين العرض التوضيحي والنظام الذي يمكنك الوثوق به.</p>
<p>إذا كنت تقوم ببناء أنظمة RAG أو أنظمة الوكلاء وتواجه مشاكل في جودة الاسترجاع، فنحن نود مساعدتك:</p>
<ul>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> لطرح الأسئلة، ومشاركة بنيتك، والتعلم من المطورين الآخرين الذين يعملون على مشاكل مماثلة.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية مدتها 20 دقيقة من ساعات عمل Milvus المكتبية</a> للتعرف على حالة استخدامك مع الفريق - سواء كان تصميم CRAG أو الاسترجاع المختلط أو توسيع نطاق المستأجرين المتعددين.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية والانتقال مباشرةً إلى البناء، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (المدارة من Milvus) تقدم لك مستوى مجاني للبدء.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تثار كثيرًا عندما تبدأ الفرق في تطبيق CRAG:</p>
<p><strong>كيف يختلف CRAG عن مجرد إضافة أداة إعادة الترتيب إلى RAG؟</strong></p>
<p>تقوم أداة إعادة الترتيب بإعادة ترتيب النتائج حسب الملاءمة ولكنها لا تزال تفترض أن المستندات المسترجعة قابلة للاستخدام. يذهب CRAG إلى أبعد من ذلك - فهو يقيّم ما إذا كان المحتوى المسترجع يجيب بالفعل على الاستعلام على الإطلاق، ويتخذ إجراءات تصحيحية عندما لا يجيب على الاستعلام: تنقيح التطابقات الجزئية، أو استكمالها بالبحث على الويب، أو تجاهل النتائج بالكامل. إنها حلقة مراقبة الجودة، وليس مجرد فرز أفضل.</p>
<p><strong>لماذا تؤدي درجة التشابه العالية أحيانًا إلى إرجاع مستند خاطئ؟</strong></p>
<p>يقيس تشابه التضمين التقارب الدلالي في الفضاء المتجه، ولكن هذا ليس هو نفسه الإجابة عن السؤال. إن مستند حول تكوين HTTPS على Apache قريب دلاليًا من سؤال حول HTTPS على Nginx - لكن ذلك لن يساعد. يلتقط CRAG هذا من خلال تقييم الصلة بالاستعلام الفعلي، وليس فقط المسافة المتجهة.</p>
<p><strong>ما الذي يجب أن أبحث عنه في قاعدة بيانات المتجهات لـ CRAG؟</strong></p>
<p>هناك ثلاثة أشياء مهمة للغاية: الاسترجاع المختلط (حتى تتمكن من الجمع بين البحث الدلالي ومطابقة الكلمات الرئيسية للمصطلحات الدقيقة)، والعزل متعدد المستأجرين (بحيث يكون لكل مستخدم أو جلسة عمل الوكيل مساحة الذاكرة الخاصة به)، ومخطط مرن (حتى تتمكن من إضافة حقول مثل <code translate="no">confidence</code> أو <code translate="no">verified</code> دون توقف مع تطور خط الأنابيب الخاص بك).</p>
<p><strong>ماذا يحدث عندما لا تكون أي من المستندات المسترجعة ذات صلة؟</strong></p>
<p>لا تستسلم CRAG فقط. عندما تنخفض الثقة إلى أقل من 0.5، فإنه يعود إلى البحث على الويب. عندما تكون النتائج غامضة (0.5-0.9)، فإنه يدمج المستندات الداخلية المنقحة مع نتائج البحث الخارجي. يحصل النموذج دائمًا على بعض السياق للعمل معه، حتى عندما تكون قاعدة المعرفة بها ثغرات.</p>
