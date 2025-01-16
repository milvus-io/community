---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  نقدم لك Milvus 2.5: بحث بالنص الكامل، وتصفية أكثر قوة للبيانات الوصفية،
  وتحسينات في سهولة الاستخدام!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">نظرة عامة<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>يسعدنا تقديم أحدث إصدار من ميلفوس، الإصدار 2.5، والذي يقدم إمكانية جديدة قوية: البحث في <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">النص</a> الكامل، والمعروف أيضًا باسم البحث المعجمي أو البحث بالكلمات الرئيسية. إذا كنت جديدًا في مجال البحث، فإن البحث في النص الكامل يتيح لك العثور على المستندات من خلال البحث عن كلمات أو عبارات محددة داخلها، على غرار طريقة البحث في جوجل. وهذا يكمل إمكانات البحث الدلالي الموجودة لدينا، والتي تفهم المعنى الكامن وراء بحثك بدلاً من مجرد مطابقة الكلمات الدقيقة.</p>
<p>نحن نستخدم مقياس BM25 القياسي في هذا المجال لتشابه المستندات، ويستند تطبيقنا على متجهات متناثرة، مما يسمح بتخزين واسترجاع أكثر كفاءة. بالنسبة لأولئك الذين ليسوا على دراية بالمصطلح، فإن المتجهات المتفرقة هي طريقة لتمثيل النص حيث تكون معظم القيم صفرية، مما يجعلها فعالة للغاية في التخزين والمعالجة - تخيل جدول بيانات ضخم حيث تحتوي بعض الخلايا فقط على أرقام، والباقي فارغة. يتناسب هذا النهج جيدًا مع فلسفة منتج Milvus حيث يكون المتجه هو كيان البحث الأساسي.</p>
<p>من الجوانب الإضافية الجديرة بالملاحظة في تطبيقنا هو القدرة على إدراج النص والاستعلام عنه <em>مباشرةً</em> بدلاً من أن يقوم المستخدمون أولاً بتحويل النص يدويًا إلى متجهات متفرقة. وهذا يأخذ Milvus خطوة أخرى نحو معالجة البيانات غير المنظمة بشكل كامل.</p>
<p>لكن هذه هي البداية فقط. مع إصدار الإصدار 2.5، قمنا بتحديث <a href="https://milvus.io/docs/roadmap.md">خارطة طريق منتج Milvus</a>. في التكرارات المستقبلية لمنتج Milvus، سينصب تركيزنا على تطوير قدرات Milvus في أربعة اتجاهات رئيسية:</p>
<ul>
<li>تبسيط معالجة البيانات غير المهيكلة;</li>
<li>تحسين جودة البحث وكفاءته;</li>
<li>إدارة أسهل للبيانات;</li>
<li>خفض التكاليف من خلال التطورات الخوارزمية والتصميمية</li>
</ul>
<p>هدفنا هو بناء بنية تحتية للبيانات يمكنها تخزين المعلومات واسترجاعها بكفاءة وفعالية في عصر الذكاء الاصطناعي.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">البحث في النص الكامل عن طريق البحث الدلالي المتفرّق BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>على الرغم من أن البحث الدلالي عادةً ما يكون لديه وعي أفضل بالمحتوى وفهم أفضل للهدف، إلا أنه عندما يحتاج المستخدم إلى البحث عن أسماء علم محددة أو أرقام تسلسلية أو عبارة مطابقة تمامًا، فإن استرجاع النص الكامل مع مطابقة الكلمات الرئيسية غالبًا ما ينتج نتائج أكثر دقة.</p>
<p>لتوضيح ذلك بمثال:</p>
<ul>
<li>يتفوق البحث الدلالي عندما تطلب: "البحث عن مستندات حول حلول الطاقة المتجددة"</li>
<li>يكون البحث عن النص الكامل أفضل عندما تحتاج إلى: &quot;البحث عن مستندات تشير إلى <em>تسلا موديل 3 2024</em>&quot;</li>
</ul>
<p>في نسختنا السابقة (Milvus 2.4)، كان على المستخدمين معالجة نصهم مسبقًا باستخدام أداة منفصلة (وحدة BM25EmbeddingFunction إلى PyMilvus) على أجهزتهم الخاصة قبل أن يتمكنوا من البحث فيه كان لهذا النهج عدة قيود: لم يتمكن من التعامل مع مجموعات البيانات المتزايدة بشكل جيد، وتطلب خطوات إعداد إضافية، وجعل العملية برمتها أكثر تعقيدًا من اللازم. بالنسبة للمهتمين بالتقنية، كانت القيود الرئيسية هي أنه لا يمكن أن يعمل إلا على جهاز واحد؛ لا يمكن تحديث المفردات وإحصائيات المجموعة الأخرى المستخدمة لتسجيل BM25 مع تغير المجموعة؛ وتحويل النص إلى متجهات من جانب العميل أقل سهولة في العمل مع النص مباشرة.</p>
<p>يبسط ميلفوس 2.5 كل شيء. يمكنك الآن العمل مع النص مباشرةً:</p>
<ul>
<li>تخزين مستنداتك النصية الأصلية كما هي</li>
<li>البحث باستخدام استعلامات اللغة الطبيعية</li>
<li>الحصول على النتائج في شكل مقروء</li>
</ul>
<p>خلف الكواليس، يتعامل Milvus مع جميع تحويلات المتجهات المعقدة تلقائيًا مما يسهل العمل مع البيانات النصية. هذا ما نطلق عليه نهج "إدخال المستند وإخراج المستند" - أنت تعمل بنص قابل للقراءة، ونحن نتعامل مع الباقي.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">التنفيذ التقني</h3><p>بالنسبة للمهتمين بالتفاصيل التقنية، يضيف ميلفوس 2.5 إمكانية البحث في النص الكامل من خلال تطبيق Sparse-BM25 المدمج الخاص به، بما في ذلك:</p>
<ul>
<li><strong>أداة ترميز مبنية على تانتيفي</strong>: يتكامل ميلفوس الآن مع منظومة تانتيفي المزدهرة</li>
<li><strong>القدرة على استيعاب واسترجاع المستندات الخام</strong>: دعم الاستيعاب المباشر للبيانات النصية والاستعلام عنها</li>
<li><strong>تسجيل ملاءمة BM25</strong>: استيعاب تسجيل BM25، الذي يتم تنفيذه استنادًا إلى المتجهات المتفرقة</li>
</ul>
<p>لقد اخترنا العمل مع نظام tantivy البيئي المتطور وبناء أداة ترميز النص Milvus على tantivy. في المستقبل، ستدعم Milvus المزيد من أدوات الترميز في المستقبل وستعرض عملية الترميز لمساعدة المستخدمين على فهم جودة الاسترجاع بشكل أفضل. سنستكشف أيضًا أدوات الترميز القائمة على التعلّم العميق واستراتيجيات الجذع لتحسين أداء البحث في النص الكامل. فيما يلي نموذج كود لاستخدام أداة الترميز وتكوينها:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>بعد تكوين أداة الرمز المميز في مخطط المجموعة، يمكن للمستخدمين تسجيل النص في دالة bm25 عبر طريقة إضافة_وظيفة. سيتم تشغيل هذا داخليًا في خادم Milvus. يمكن إكمال جميع تدفقات البيانات اللاحقة مثل الإضافات والحذف والتعديلات والاستعلامات من خلال العمل على السلسلة النصية الخام، بدلاً من التمثيل المتجه. انظر المثال البرمجي أدناه لمعرفة كيفية استيعاب النص وإجراء بحث في النص الكامل باستخدام واجهة برمجة التطبيقات الجديدة:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>لقد اعتمدنا تطبيقًا لتسجيل الصلة BM25 الذي يمثل الاستعلامات والمستندات كمتجهات متناثرة، يُطلق عليه <strong>Sparse-BM25</strong>. وهذا يفتح العديد من التحسينات القائمة على المتجهات المتناثرة، مثل:</p>
<p>يحقق Milvus إمكانات البحث الهجين من خلال <strong>تطبيق Sparse-BM25</strong> المتطور، الذي يدمج البحث عن النص الكامل في بنية قاعدة البيانات المتجهة. من خلال تمثيل ترددات المصطلحات كمتجهات متناثرة بدلاً من الفهارس المقلوبة التقليدية، يتيح Sparse-BM25 تحسينات متقدمة، مثل <strong>فهرسة الرسم البياني</strong> <strong>وتكميم المنتج (PQ</strong> <strong>) والتكميم الكمي القياسي (SQ)</strong>. تعمل هذه التحسينات على تقليل استخدام الذاكرة وتسريع أداء البحث. على غرار نهج الفهرس المقلوب، يدعم Milvus أخذ النص الخام كمدخلات وتوليد متجهات متفرقة داخليًا. وهذا يجعله قادرًا على العمل مع أي أداة ترميز واستيعاب أي كلمة تظهر في مجموعة النصوص المتغيرة ديناميكيًا.</p>
<p>بالإضافة إلى ذلك، يتجاهل التقليم القائم على الاستدلال المتجهات المتفرقة منخفضة القيمة، مما يعزز الكفاءة دون المساس بالدقة. على عكس النهج السابق الذي يستخدم المتجهات المتناثرة، فإنه يمكن أن يتكيف مع مجموعة متزايدة من المتحولات، وليس دقة تسجيل BM25.</p>
<ol>
<li>بناء فهارس بيانية على المتجه المتناثر، والتي تعمل بشكل أفضل من الفهرس المقلوب على الاستعلامات ذات النص الطويل حيث يحتاج الفهرس المقلوب إلى مزيد من الخطوات لإنهاء مطابقة الرموز في الاستعلام;</li>
<li>الاستفادة من تقنيات التقريب لتسريع البحث مع تأثير طفيف فقط على جودة الاسترجاع، مثل تكميم المتجه والتشذيب القائم على الاستدلال;</li>
<li>توحيد الواجهة ونموذج البيانات لإجراء البحث الدلالي والبحث في النص الكامل، وبالتالي تحسين تجربة المستخدم.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>باختصار، وسّع برنامج Milvus 2.5 من قدرته على البحث إلى ما هو أبعد من البحث الدلالي من خلال تقديم استرجاع النص الكامل، مما يسهل على المستخدمين بناء تطبيقات ذكاء اصطناعي عالية الجودة. هذه مجرد خطوات أولية في مجال البحث المتناثر-بم 25، ونتوقع أن يكون هناك المزيد من إجراءات التحسين التي يمكن تجربتها في المستقبل.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">مرشحات بحث مطابقة النص<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>الميزة الثانية للبحث النصي التي تم إصدارها مع الإصدار 2.5 من ميلفوس هي ميزة <strong>مطابقة</strong> النص، والتي تسمح للمستخدم بتصفية البحث إلى إدخالات تحتوي على سلسلة نصية محددة. هذه الميزة مبنية أيضًا على أساس الترميز ويتم تنشيطها باستخدام <code translate="no">enable_match=True</code>.</p>
<p>تجدر الإشارة إلى أنه مع خاصية مطابقة النص، تعتمد معالجة نص الاستعلام على منطق OR بعد الترميز. على سبيل المثال، في المثال أدناه، ستُرجع النتيجة جميع المستندات (باستخدام حقل "نص") التي تحتوي إما على "متجه" أو "قاعدة بيانات".</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>إذا كان السيناريو الخاص بك يتطلب مطابقة كلٍ من "المتجه" و"قاعدة البيانات"، فأنت بحاجة إلى كتابة مطابقتين نصيتين منفصلتين وتراكبهما باستخدام "و" لتحقيق هدفك.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">تحسين كبير في أداء التصفية العددية<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>ينشأ تركيزنا على أداء التصفية العددية من اكتشافنا أن الجمع بين استرجاع المتجهات وتصفية البيانات الوصفية يمكن أن يحسن أداء الاستعلام ودقته بشكل كبير في سيناريوهات مختلفة. وتتراوح هذه السيناريوهات من تطبيقات البحث عن الصور مثل تحديد حالة الزاوية في القيادة الذاتية إلى سيناريوهات RAG المعقدة في قواعد المعرفة المؤسسية. وبالتالي، فهي مناسبة للغاية لمستخدمي المؤسسات لتنفيذها في سيناريوهات تطبيقات البيانات واسعة النطاق.</p>
<p>في الممارسة العملية، يمكن أن تؤثر العديد من العوامل مثل كمية البيانات التي تقوم بترشيحها، وكيفية تنظيم بياناتك، وكيفية البحث على الأداء. لمعالجة هذا الأمر، يقدم الإصدار Milvus 2.5 ثلاثة أنواع جديدة من الفهارس - فهرس خريطة البت وفهرس المصفوفة المقلوب والفهرس المقلوب بعد ترميز حقل نص Varchar. يمكن لهذه الفهارس الجديدة تحسين الأداء بشكل كبير في حالات الاستخدام في العالم الحقيقي.</p>
<p>على وجه التحديد:</p>
<ol>
<li>يمكن استخدام<strong>فهرس BitMap</strong> لتسريع تصفية العلامات (المشغلات الشائعة تشمل في، صفيف_يتضمن، إلخ)، وهي مناسبة للسيناريوهات التي تحتوي على عدد أقل من بيانات فئة الحقل (عددية البيانات). ويتمثل المبدأ في تحديد ما إذا كان صف البيانات يحتوي على قيمة معينة في عمود ما، مع تحديد 1 لـ نعم و0 لـ لا، ثم الاحتفاظ بقائمة BitMap. يوضح الرسم البياني التالي مقارنة اختبار الأداء الذي أجريناه بناءً على سيناريو عمل أحد العملاء. في هذا السيناريو، يبلغ حجم البيانات 500 مليون، وفئة البيانات 20، والقيم المختلفة لها نسب توزيع مختلفة (1%، 5%، 10%، 50%)، ويختلف الأداء في ظل كميات التصفية المختلفة أيضًا. مع التصفية بنسبة 50%، يمكننا تحقيق مكاسب في الأداء بنسبة 6.8 أضعاف من خلال فهرس BitMap. تجدر الإشارة إلى أنه مع زيادة الكاردينالية، مقارنةً بفهرس BitMap، سيُظهر الفهرس المقلوب أداءً أكثر توازناً.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>تعتمد<strong>مطابقة النص</strong> على الفهرس المقلوب بعد ترميز حقل النص. يتجاوز أداؤها بكثير وظيفة مطابقة أحرف البدل (أي مثل + %) التي قدمناها في 2.4. وفقًا لنتائج اختبارنا الداخلي، فإن مزايا Text Match واضحة جدًا، خاصةً في سيناريوهات الاستعلام المتزامن، حيث يمكنها تحقيق زيادة تصل إلى 400 ضعف في الثانية في الثانية.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>فيما يتعلق بمعالجة بيانات JSON، نخطط لتقديم في الإصدارات اللاحقة من الإصدار 2.5.x بناء مؤشرات مقلوبة للمفاتيح التي يحددها المستخدم وتسجيل معلومات الموقع الافتراضي لجميع المفاتيح لتسريع التحليل. نتوقع أن يؤدي هذان المجالان إلى تحسين أداء الاستعلام في JSON و Dynamic Field بشكل كبير. نخطط لعرض المزيد من المعلومات في مذكرات الإصدار المستقبلية والمدونات التقنية، لذا ترقبوا معنا!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">واجهة إدارة جديدة<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>لا ينبغي أن تتطلب إدارة قاعدة البيانات شهادة في علوم الكمبيوتر، لكننا نعلم أن مسؤولي قواعد البيانات يحتاجون إلى أدوات قوية. لهذا السبب قدمنا <strong>واجهة إدارة المجموعة WebUI،</strong> وهي واجهة جديدة قائمة على الويب يمكن الوصول إليها على عنوان مجموعتك على المنفذ 9091/webui. توفر أداة المراقبة هذه</p>
<ul>
<li>لوحات معلومات المراقبة في الوقت الحقيقي التي تعرض مقاييس على مستوى المجموعة</li>
<li>تحليلات مفصلة للذاكرة والأداء لكل عقدة</li>
<li>معلومات الشرائح وتتبع الاستعلامات البطيئة</li>
<li>مؤشرات صحة النظام وحالة العقدة</li>
<li>أدوات استكشاف الأخطاء وإصلاحها سهلة الاستخدام لمشاكل النظام المعقدة</li>
</ul>
<p>على الرغم من أن هذه الواجهة لا تزال في مرحلة تجريبية، إلا أننا نعمل بنشاط على تطويرها بناءً على ملاحظات المستخدمين من مسؤولي قواعد البيانات. ستتضمن التحديثات المستقبلية تشخيصات مدعومة بالذكاء الاصطناعي، والمزيد من ميزات الإدارة التفاعلية، وقدرات مراقبة محسّنة للعقد.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">التوثيق وتجربة المطورين<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد قمنا بتجديد <strong>وثائقنا</strong> وتجربة <strong>SDK/API</strong> بالكامل لجعل الوصول إلى Milvus أكثر سهولة مع الحفاظ على العمق للمستخدمين ذوي الخبرة. تشمل التحسينات ما يلي:</p>
<ul>
<li>نظام توثيق معاد هيكلته مع تقدم أوضح من المفاهيم الأساسية إلى المفاهيم المتقدمة</li>
<li>برامج تعليمية تفاعلية وأمثلة واقعية تعرض تطبيقات عملية</li>
<li>مراجع شاملة لواجهة برمجة التطبيقات مع عينات من التعليمات البرمجية العملية</li>
<li>تصميم SDK أكثر سهولة في الاستخدام يبسط العمليات الشائعة</li>
<li>أدلة مصورة تجعل المفاهيم المعقدة أسهل في الفهم</li>
<li>مساعد التوثيق المدعوم بالذكاء الاصطناعي (ASK AI) للحصول على إجابات سريعة</li>
</ul>
<p>تركز SDK/API المحدثة على تحسين تجربة المطورين من خلال واجهات أكثر سهولة وتكامل أفضل مع الوثائق. نعتقد أنك ستلاحظ هذه التحسينات عند العمل مع سلسلة 2.5.x.</p>
<p>ومع ذلك، نحن نعلم أن التوثيق وتطوير SDK عملية مستمرة. سنواصل تحسين كل من بنية المحتوى وتصميم SDK بناءً على ملاحظات المجتمع. انضم إلى قناة Discord الخاصة بنا لمشاركة اقتراحاتك ومساعدتنا على التحسين أكثر.</p>
<h2 id="Summary" class="common-anchor-header"><strong>الملخص</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي ميلفوس 2.5 على 13 ميزة جديدة والعديد من التحسينات على مستوى النظام، ليس فقط بمساهمة من Zilliz بل من مجتمع المصادر المفتوحة. لقد تطرقنا إلى عدد قليل منها فقط في هذا المنشور ونشجعك على زيارة <a href="https://milvus.io/docs/release_notes.md">مذكرة الإصدار</a> <a href="https://milvus.io/docs">والوثائق الرسمية</a> لمزيد من المعلومات!</p>
