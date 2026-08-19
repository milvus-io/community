---
id: milvus-3-0-structarray.md
title: >-
  كيان واحد، متجهات متعددة: البحث على مستوى الكيان والعنصر باستخدام Milvus 3.0
  StructArray
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  يمكن أن يحتوي الكيان الواحد على متجهات محاذاة متعددة وحقول بيانات وصفية، ويمكن
  لميلفوس البحث إما في الكيان بأكمله أو في عنصر فردي دون تسطيح البيانات إلى صفوف
  منفصلة.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>تبدأ معظم مخططات قواعد بيانات المتجهات بافتراض بسيط: كيان واحد، وتضمين واحد. يحصل المنتج على متجه واحد، وكذلك المستند. يتم تضمين استعلام المستخدم ومقارنته بتلك المتجهات من خلال بحث الجيران الأقرب التقريبي (ANN). يعمل هذا النموذج للجيل الأول من حالات استخدام بحث المتجهات، بما في ذلك RAG، والبحث الدلالي، وأنظمة التوصية.</p>
<p><strong>بيانات الذكاء الاصطناعي الواقعية، مع ذلك، نادرًا ما تنطبق على هذا الافتراض.</strong> يحتوي الفيديو على مقاطع أو لقطات أو إطارات رئيسية، لكل منها تضمين خاص بها ونطاق زمني وتسمية توضيحية وملصق مشهد ودرجة ثقة. قد يحتوي المنتج على عدة صور وزوايا عرض. تحتوي المستندات الطويلة على فقرات أو أقسام يكون معناها المحلي أكثر أهمية من تضمين واحد للمستند بأكمله. تُظهر نماذج التفاعل المتأخر الشهيرة نفس القيد بدقّة أدق: ينتج ColBERT متجهًا واحدًا لكل رمز، بينما ينتج ColPali متجهًا واحدًا لكل رقعة بصرية.</p>
<p>في كل حالة، يظل الكيان الأصلي هو الوحدة التي يخزنها التطبيق ويعرضها ويؤمّنها ويعيدها. ومع ذلك، غالبًا ما تعتمد الصلة والتصفية وشرح النتائج على عناصر داخل ذلك الكيان.</p>
<p><strong>تمنح ميزة StructArray الجديدة Milvus نموذج بيانات أصليًا لهذا الشكل: كيان واحد يحتوي على مصفوفة مرتبة من عناصر Struct المعرّفة في المخطط، وكل عنصر يمكن أن يحمل بيانات وصفية عددية، أو تضمينات متجهة، أو كليهما.</strong> يمكن لـ Milvus تصفية الحقول التي تنتمي إلى نفس العنصر، أو مقارنة قائمتي تضمين على مستوى الكيان، أو البحث في عناصر فردية وإرجاع الإزاحة المطابقة.</p>
<p>تستخدم هذه المقالة مثالًا للبحث عن الفيديو لشرح نموذج البيانات، ثم تتبعه من خلال تصميم المخطط، والتصفية، ودقّات بحث المتجهات، واستراتيجيات فهرسة EmbeddingList، ودمج النتائج الهجينة، والتخطيط المادي الذي يجعل الميزة قابلة للتنفيذ.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">لماذا لم يعد نموذج المتجه الواحد والصف المسطح الواحد كافيًا<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>تأمل مستخدمًا يبحث في كتالوج فيديو عن «شخص يقطّع الخضروات في مطبخ». قد تكمن الإشارة ذات الصلة في مقطع واحد مدته ثماني ثوانٍ، وليس في تضمين للفيديو بأكمله. <strong>ضغط كل مقطع وكائن وحركة في متجه واحد قد يحافظ على الموضوع العام، لكنه قد يُفقد التفاصيل المحلية.</strong></p>
<p>يظهر نفس التباين في أحمال عمل أخرى:</p>
<ul>
<li>قد تأتي صلة المنتج من واحدة من عدة صور أو زوايا.</li>
<li>قد يطابق المستند بسبب فقرة واحدة بدلاً من موضوعه العام.</li>
<li>قد تحتوي ذاكرة وكيل على عدة ملاحظات، واحدة فقط منها مهمة للمهمة الحالية.</li>
<li>يحتوي سجل ColBERT أو ColPali على قائمة متغيرة الطول من متجهات الرموز أو الرقع بدلاً من متجه واحد كثيف.</li>
</ul>
<p>أحد البدائل هو تقسيم كل مقطع أو صورة أو فقرة إلى صف منفصل في قاعدة البيانات. يمكّن ذلك البحث المحلي، ولكنه يفصل أيضًا كل جزء عن كيانه الأصلي. قد تتكرر البيانات الوصفية للكيان الأصلي عبر الصفوف، ويتطلب الاسترجاع على مستوى الكيان بعد ذلك تجميعًا وإزالة تكرار وإعادة ترتيب بعد بحث الأجزاء.</p>
<p>التخزين المتداخل وحده لا يحل مشكلة الاستعلام. يمكن لـ JSON تخزين الكائنات، لكنه لا يمنح Milvus مخططًا فرعيًا محددًا مسبقًا لفهرسة المتجهات والقيم العددية. يمكن للمصفوفات المتوازية تخزين التسميات التوضيحية وملصقات المشاهد وقيم الثقة، ولكن يجب على التطبيق الحفاظ على محاذاة الإزاحة. لا يمكن لقاعدة البيانات أن تستنتج بأمان أن <code translate="no">scene_type[3]</code> و <code translate="no">label_confidence[3]</code> يصفان نفس المقطع ما لم تكن هذه العلاقة جزءًا من نموذج البيانات.</p>
<p>يقوم StructArray بتشفير تلك العلاقة مباشرة. فهو يُبقي العناصر المحلية داخل الكيان الأصلي مع إتاحة حقولها الفرعية المتوافقة للتحقق من المخطط والفهرسة والتصفية وبحث المتجهات.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">ما هو StructArray ونموذج البيانات الخاص به؟<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>يقوم StructArray، المعروف أيضًا باسم مصفوفة البنى، بتخزين مجموعة مرتبة من عناصر Struct في كل كيان. حقل StructArray هو <code translate="no">Array</code> جميع عناصره تتبع مخطط <code translate="no">Struct</code> واحد محدد مسبقًا. لمجموعة فيديو، يمكن أن يبدو الشكل المنطقي كما يلي:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>هنا:</p>
<ul>
<li><code translate="no">clips</code> هو حقل StructArray الأصلي.</li>
<li><code translate="no">clip_embedding_list</code> و <code translate="no">clip_embedding</code> و <code translate="no">start_sec</code> والسمات الأخرى هي حقول فرعية.</li>
<li><code translate="no">clips[0]</code> هو المقطع الأول.</li>
<li>كل حقل فرعي عند الإزاحة <code translate="no">0</code> ينتمي إلى نفس المقطع.</li>
<li>كل حقل فرعي عند الإزاحة <code translate="no">3</code> ينتمي إلى مقطع آخر.</li>
</ul>
<p>يعمل الحقلان الفرعيان للمتجهات في وضعي بحث مختلفين. يتم فهرسة <code translate="no">clips[clip_embedding_list]</code> بمعيار <code translate="no">MAX_SIM*</code> لبحث EmbeddingList على مستوى الكيان، بينما يتم فهرسة <code translate="no">clips[clip_embedding]</code> بمعيار متجه عادي للبحث على مستوى العنصر. نظرًا لأن حقل المتجه أو الحقل الفرعي للمتجه يقبل فهرسًا واحدًا فقط، يجب على المجموعة التي تحتاج إلى كلا الوضعين تعريف وفهرسة الحقلين الفرعيين بشكل منفصل.</p>
<p>يدعم هذا النموذج ثلاثة دلالات استعلام متميزة.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. بحث EmbeddingList يُرجع الكيانات الأصلية</h3><p>تشكل المتجهات في <code translate="no">clips[clip_embedding_list]</code> قائمة تضمين واحدة للفيديو. الاستعلام هو أيضًا <code translate="no">EmbeddingList</code>. يقارن Milvus قائمة الاستعلام مع كل قائمة مخزنة باستخدام معيار <code translate="no">MAX_SIM*</code> ويُرجع نتيجة على مستوى الكيان.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. عائلة <code translate="no">MATCH_*</code> تقوم بتصفية الكيانات الأصلية</h3><p>تقيّم <code translate="no">MATCH_ANY</code> و <code translate="no">MATCH_ALL</code> و <code translate="no">MATCH_LEAST</code> و <code translate="no">MATCH_MOST</code> و <code translate="no">MATCH_EXACT</code> مسندًا (شرطًا) مقابل عناصر Struct، وتحسب عدد العناصر التي تحققه، وتقرر ما إذا كان الكيان الأصلي يجتاز التصفية.</p>
<p>على سبيل المثال:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>يجب أن يكون كلا الشرطين العدديين صحيحين عند نفس إزاحة المقطع. لا يجمع Milvus ملصق مطبخ من مقطع مع قيمة ثقة عالية من مقطع آخر.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. البحث على مستوى العنصر يُرجع إزاحة العنصر المطابق</h3><p>يمكن لمتجه استعلام عادي البحث في كل متجه في <code translate="no">clips[clip_embedding]</code> بشكل مستقل. يحدد كل تطابق الكيان الأصلي والإزاحة الصفرية لعنصر Struct المطابق. يمكن لـ <code translate="no">element_filter</code> تقييد العناصر التي تشارك في بحث المتجهات.</p>
<p>تشترك هذه العمليات في فرضية واحدة: يعرف Milvus أي قيم المتجهات والقيم العددية تنتمي إلى نفس العنصر، وأي العناصر تنتمي إلى نفس الكيان.</p>
<p>StructArray ليس نظام تداخل عشوائيًا للأغراض العامة. نموذجه الحالي هو <code translate="no">Array</code> واحد من عناصر Struct مع حقول فرعية عددية ومتجهية مدعومة. هذا الحد يجعل فهرسة الحقول الفرعية والتنفيذ المراعي للعناصر أمرًا ممكنًا.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">بناء المخطط والفهارس ومسار الإدراج<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>يقوم مثال PyMilvus المبسط التالي بإنشاء مجموعة فيديو بمتجه واحد على المستوى الأعلى وStructArray للمقاطع. ويستخدم حقولًا فرعية منفصلة لمتجهات المقاطع حتى تتمكن نفس المجموعة من توضيح وضعي البحث.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>يجب فهرسة الحقول الفرعية للمتجهات قبل البحث. نظرًا لأن عائلة المعايير تحدد وضع البحث، يحصل كل حقل فرعي متجه على الفهرس الخاص به:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>فهارس القيم العددية اختيارية، ولكن الحقول الفرعية التي تظهر بشكل متكرر في عمليات التصفية واسعة النطاق يجب أن تستخدم فهرسًا عدديًا متوافقًا. على سبيل المثال، يمكن أن يستخدم <code translate="no">clips[scene_type]</code> فهرسًا مقلوبًا، بينما يمكن لحقل فرعي رقمي مثل <code translate="no">clips[label_confidence]</code> استخدام فهرس مناسب للتصفية الرقمية.</p>
<p>أدخل البيانات بشكلها الطبيعي ككيان: صف فيديو واحد مع مصفوفة من كائنات المقاطع. للإبقاء على المثال مختصرًا، يكتب نفس متجه المقطع في كلا الحقلين الفرعيين للمتجهات.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>عند حدود API، يظل <code translate="no">clips</code> مصفوفة من الكائنات المهيكلة. داخل Milvus، يتبع كل حقل فرعي المسار المحدد بالنوع المطلوب لفهرسته وتصفيته وسلوك إخراجه. هذا التمييز شفاف في وقت الإدراج ولكنه أساسي لكل ما يلي.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">تصفية نفس العنصر هي الفرق بين البنية والمصفوفات المتوازية<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>الفائدة الرئيسية للتصفية ليست صياغة أقصر للحقول المتداخلة. بل هي الارتباط الصحيح عبر الحقول الفرعية العددية.</p>
<p>لنفترض أن التطبيق يحتاج إلى مقاطع فيديو تحتوي على مقطع مطبخ بثقة تسمية أعلى من <code translate="no">0.8</code>. لا يكفي أن يحتوي الفيديو على مقطع مطبخ ما ومقطع عالي الثقة ما؛ بل يجب أن يحقق نفس المقطع كلا الشرطين.</p>
<p>تعبر عائلة <code translate="no">MATCH_*</code> الخاصة بـ StructArray عن ذلك مباشرة:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>يقيم Milvus المسند عند كل إزاحة عنصر، ثم يطبق مُحدِّد الكمية الخاص بالمشغل لتحديد ما إذا كان الكيان الأصلي يجتاز أم لا:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: عنصر واحد على الأقل يطابق.</li>
<li><code translate="no">MATCH_ALL</code>: كل عنصر يطابق.</li>
<li><code translate="no">MATCH_LEAST</code>: عنصر واحد على الأقل يطابق وفقًا لـ <code translate="no">threshold</code>.</li>
<li><code translate="no">MATCH_MOST</code>: عنصر واحد على الأكثر يطابق وفقًا لـ <code translate="no">threshold</code>.</li>
<li><code translate="no">MATCH_EXACT</code>: عدد العناصر المطابقة يساوي <code translate="no">threshold</code> بالضبط.</li>
</ul>
<p>إذا تم تخزين نفس البيانات كمصفوفتين مستقلتين، فإن التعبير التالي لن يحافظ على هذا الارتباط:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>قد تظهر القيمتان عند إزاحتين مختلفتين. قد يكون ذلك صالحًا للسمات غير المرتبطة، ولكنه غير صحيح عندما يصف كلا الشرطين نفس المقطع أو صورة المنتج أو فقرة المستند.</p>
<p>يجعل StructArray هوية العنصر جزءًا من مسند قاعدة البيانات بدلاً من كونه اصطلاحًا يجب على التطبيق فرضه.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">دقّتا بحث متجه، هويتا نتائج<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد أن يخزن كيان ما متجهات متعددة، يجب أن يحسم الاسترجاع سؤالًا نموذجيًا قبل بدء بحث ANN:</p>
<p><strong>هل يجب تقييم المتجهات معًا كتمثيل واحد للكيان الأصلي، أم يجب أن يتنافس كل متجه عنصر بشكل مستقل؟</strong></p>
<p>يدعم StructArray كلا النموذجين، لكنهما يستخدمان أشكال استعلام مختلفة وعائلات معايير مختلفة وحقولًا فرعية متجهة مختلفة وهويات نتائج مختلفة.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">بحث EmbeddingList: قائمة متجهات الاستعلام تعثر على كيان</h3><p>يحتوي استعلام <code translate="no">EmbeddingList</code> على متجهات متعددة. قد يتم تقسيم فيديو الاستعلام إلى عدة مقاطع؛ قد يحتوي استعلام منتج على عدة صور مرجعية؛ يحتوي استعلام ColBERT على متجه واحد لكل رمز استعلام.</p>
<p>لكل كيان، يقارن Milvus قائمة الاستعلام مع قائمة التضمين المخزنة للكيان. في ظل التقييم بنمط MaxSim، يختار كل متجه استعلام أفضل تطابق له في قائمة الكيان، ويجمع Milvus درجات أفضل التطابقات في درجة كيان. يمثل التطابق النهائي الكيان الأصلي، وليس عنصر Struct معينًا.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>يجيب هذا البحث على السؤال: <strong>ما هي أفضل مقاطع الفيديو تطابقًا بشكل عام مع هذه المجموعة من مقاطع الاستعلام؟</strong></p>
<p>إنه مناسب لاسترجاع الفيديو مقابل الفيديو، والبحث عن المنتجات بصور متعددة، والاسترجاع بنمط ColBERT وColPali، والحالات الأخرى التي يتم فيها تمثيل كل من الاستعلام والكيان المخزن بمتجهات متعددة.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">البحث على مستوى العنصر: متجه استعلام واحد يعثر على مقطع داخل كيان</h3><p>يستخدم البحث على مستوى العنصر متجه استعلام عادي. يشارك كل متجه في <code translate="no">clips[clip_embedding]</code> في بحث ANN كمرشح مستقل. يحدد كل تطابق الكيان الأصلي وإزاحة العنصر المطابق.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>للبحث في مقاطع محددة فقط، أرفق <code translate="no">element_filter</code> بشروط عددية تنطبق على نفس المقطع:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>لا يختار عامل التصفية أولاً مقطع مطبخ ثم يبحث عن مقطع مختلف عالي الثقة. يشير كل من المسندين ومرشح المتجه إلى نفس عنصر Struct.</p>
<p>قد يبدو الرد غير المجمَّع كما يلي:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>قد يظهر نفس الكيان أكثر من مرة لأن عدة مقاطع يمكن أن تطابق. يكون ذلك مفيدًا عندما يحتاج التطبيق إلى إظهار ليس فقط الفيديو أو المستند ذي الصلة، ولكن أيضًا المقطع أو الفقرة التي أنتجت التطابق.</p>
<table>
<thead>
<tr><th>الجانب</th><th>بحث EmbeddingList</th><th>البحث على مستوى العنصر</th></tr>
</thead>
<tbody>
<tr><td>مدخلات الاستعلام</td><td>متجه استعلام واحد أو أكثر في <code translate="no">EmbeddingList</code></td><td>متجه استعلام عادي واحد</td></tr>
<tr><td>الهدف المثال</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>عائلة المعايير</td><td><code translate="no">MAX_SIM*</code></td><td>معايير عادية مثل <code translate="no">COSINE</code> أو <code translate="no">IP</code> أو <code translate="no">L2</code></td></tr>
<tr><td>وحدة مرشح ANN</td><td>قائمة تضمين الكيان الأصلي</td><td>كل متجه عنصر Struct</td></tr>
<tr><td>هوية النتيجة</td><td>الكيان الأصلي</td><td>الكيان الأصلي بالإضافة إلى إزاحة العنصر</td></tr>
<tr><td>حالة الاستخدام النموذجية</td><td>مطابقة استعلام متعدد المتجهات مع كيان متعدد المتجهات</td><td>العثور على المقطع أو الصورة أو الفقرة أو الرقعة أو الحقيقة الأكثر صلة</td></tr>
</tbody>
</table>
<p>لدعم كلا الوضعين في مجموعة واحدة، قم بتعريف وفهرسة حقول فرعية متجهة منفصلة. يجب أن يتوافق شكل الاستعلام وعائلة المعايير والفهرس المستهدف معًا.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">فهرسة EmbeddingList هي قرار بين الجودة والتكلفة<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>مع تضمين واحد لكل كيان، يجد فهرس ANN الكيانات القريبة من متجه الاستعلام. يعد بحث EmbeddingList أكثر تكلفة لأن الصلة تعتمد على التفاعلات الزوجية بين قائمتي متجهات.</p>
<p>حساب MaxSim الدقيق مقابل كل متجه في كل كيان ينتج أنظف ترتيب مرجعي، لكن الفحص الكامل عادة ما يكون مكلفًا للغاية للاسترجاع عبر الإنترنت. لذلك يستخدم Milvus نموذجًا من مرحلتين:</p>
<ol>
<li>استراتيجية تقريبية تسترجع الكيانات الأصلية المرشحة.</li>
<li>عند تفعيل <code translate="no">emb_list_rerank</code>، يعيد Milvus حساب MaxSim على هؤلاء المرشحين لإنتاج الترتيب النهائي.</li>
</ol>
<p>استرجاع المزيد من مرشحي المرحلة الأولى يحسن عمومًا فرصة وصول النتائج الأعلى فعليًا إلى مرحلة إعادة الترتيب، ولكنه يزيد أيضًا من زمن الاستجابة والحساب. تختلف الاستراتيجيات الثلاث أساسًا في كيفية إنتاج مجموعة المرشحين هذه.</p>
<table>
<thead>
<tr><th>الاستراتيجية</th><th>تمثيل مرشح المرحلة الأولى</th><th>نقطة بداية جيدة عندما</th><th>المفاضلة الرئيسية</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>فهرسة كل متجه في كل قائمة تضمين. تعمل متجهات الاستعلام عبر ANN بشكل مستقل؛ يتم تجميع التطابقات مرة أخرى إلى الكيانات الأصلية قبل إعادة ترتيب MaxSim.</td><td>الجودة هي الأولوية، والقوائم قصيرة أو متوسطة، والمتجهات الفردية تمييزية.</td><td>حجم الفهرس وعمل بحث المرحلة الأولى ينموان مع طول القائمة وعدد متجهات الاستعلام.</td></tr>
<tr><td>MUVERA</td><td>تشفير كل قائمة تضمين في متجه واحد ثابت الأبعاد من خلال الإسقاطات العشوائية، ثم تشغيل ANN عادي.</td><td>يكون TokenANN ثقيلًا جدًا ويُفضَّل الضغط دون خط أنابيب تدريب.</td><td>يفقد التشفير المعلومات؛ إعدادات الإسقاط الأقوى تزيد من الأبعاد المشفرة وتكلفة ANN.</td></tr>
<tr><td>LEMUR</td><td>تدريب نموذج يخطط قائمة التضمين إلى متجه كيان أصلي ثابت الأبعاد.</td><td>التضمينات أقل تمييزًا، أو القوائم كبيرة، أو حمل العمل بصري أو متعدد الوسائط.</td><td>يتطلب تدريبًا ويمكن أن يكون حساسًا لتوزيع المجموعة وانحياز طول المستند.</td></tr>
</tbody>
</table>
<p>لا توجد استراتيجية واحدة هي الأفضل لكل حمل عمل. ابدأ بالبيانات المستهدفة وتوزيع الاستعلام:</p>
<ul>
<li>استخدم TokenANN كخط أساس يضع الجودة أولاً عندما يسمح حجم مجموعة البيانات بذلك.</li>
<li>جرّب MUVERA عندما يصبح فهرس TokenANN أو استرجاع المرشحين مكلفًا للغاية مع نمو طول القائمة، وتريد تجنب خط أنابيب التدريب.</li>
<li>قيّم LEMUR عندما تكون مساحة التضمين مشوشة أو ضعيفة التمييز، أو عندما يكون حمل العمل بصريًا أو متعدد الوسائط.</li>
<li>قم بقياس الاستدعاء أو nDCG إلى جانب زمن الاستجابة وحجم الفهرس. الاستراتيجية التي تعمل مع النصوص القصيرة يمكن أن تتصرف بشكل مختلف مع أطوال المستندات طويلة الذيل أو آلاف الرقع البصرية.</li>
</ul>
<p>يعالج StructArray مشكلة واحدة: كيفية تمثيل عناصر متوافقة وقابلة للتصفية وتحمل متجهات داخل كيان واحد. تعالج استراتيجية EmbeddingList مشكلة أخرى: كيفية تقريب MaxSim بتكلفة مقبولة لنموذج ومجموعة معينة.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">البحث الهجين يجعل هوية النتائج صريحة<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>نادرًا ما يتبع الاسترجاع في الإنتاج مسار متجه واحد. قد يجمع طلب الفيديو بين تضمين فيديو على المستوى الأعلى، وتضمين واحد أو أكثر على مستوى المقطع، وإشارة تسمية توضيحية أو نصية، وإعادة ترتيب.</p>
<p>بمجرد دخول المرشحين على مستوى العنصر إلى هذا الخط، يجب على المحرك تحديد ما يحدد المرشح النهائي.</p>
<table>
<thead>
<tr><th>تكوين الطلب الهجين</th><th>نطاق المرشح النهائي</th><th>هوية النتيجة</th></tr>
</thead>
<tbody>
<tr><td>جميع عمليات البحث الفرعية على مستوى العنصر وتستهدف الحقول الفرعية المتجهة تحت نفس StructArray</td><td>مستوى العنصر</td><td>المفتاح الأساسي بالإضافة إلى حقل StructArray بالإضافة إلى إزاحة العنصر</td></tr>
<tr><td>تم تضمين حقل متجه على المستوى الأعلى</td><td>مستوى الكيان</td><td>المفتاح الأساسي</td></tr>
<tr><td>تم تضمين طلب EmbeddingList</td><td>مستوى الكيان</td><td>المفتاح الأساسي</td></tr>
<tr><td>طلبات على مستوى العنصر تستهدف حقول StructArray مختلفة</td><td>مستوى الكيان</td><td>المفتاح الأساسي</td></tr>
</tbody>
</table>
<p>يحافظ التكوين الأول على هوية العنصر لأن الإزاحة <code translate="no">3</code> تشير إلى نفس عنصر Struct لكل بحث فرعي تحت StructArray أصلي معين. يناسب هذا التطبيق الذي يريد إرجاع المقطع أو الفقرة الأكثر صلة بعد دمج عدة إشارات على مستوى العنصر.</p>
<p>تخلط التكوينات الأخرى دقّات المرشحين أو مساحات أسماء العناصر. لذلك يجب دمج نتيجة عنصر في درجة على مستوى الكيان قبل إعادة الترتيب النهائية. يدعم Milvus عدة استراتيجيات للدمج:</p>
<table>
<thead>
<tr><th>استراتيجية الدمج</th><th>درجة الكيان من نتائج العناصر المُرجعة</th><th>الشرط المهم</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>أفضل درجة عنصر</td><td>يعمل مع معايير المتجهات العادية المدعومة</td></tr>
<tr><td><code translate="no">sum</code></td><td>مجموع كل درجات العناصر المُرجعة</td><td>استخدم مع معايير الارتباط الإيجابي مثل <code translate="no">IP</code> أو <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>متوسط درجات العناصر المُرجعة</td><td>يعمل مع معايير المتجهات العادية المدعومة</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>مجموع أفضل <code translate="no">K</code> من درجات العناصر المُرجعة</td><td>يتطلب <code translate="no">topk</code> موجبًا؛ استخدم مع <code translate="no">IP</code> أو <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>متوسط أفضل <code translate="no">K</code> من درجات العناصر المُرجعة</td><td>يتطلب <code translate="no">topk</code> موجبًا</td></tr>
</tbody>
</table>
<p>يعمل الدمج فقط على نتائج العناصر التي يُرجعها بحث ANN الفرعي؛ ولا يفحص كل عنصر في الكيان بعد الاسترجاع. لذلك يتحكم حد <code translate="no">limit</code> في الطلب في نتائج العناصر المتاحة لوظيفة الدمج.</p>
<p>يشكل هذا الاختيار دلالات الاسترجاع، وليس مجرد تنسيق المخرجات. إذا كان التطبيق يعرض مقطعًا أو فقرة، فإن الحفاظ على الإزاحة خلال الدمج أمر طبيعي. إذا كان يعرض فيديو أو منتجًا أو مستندًا، فإن الدمج على مستوى الكيان أمر طبيعي. عندما تعمل الإشارات بدقّات مختلفة، يحتاج النظام إلى قاعدة تقييم صريحة من العنصر إلى الكيان.</p>
<p>ينقل StructArray مشكلة الهوية والدمج من المعالجة اللاحقة المؤقتة إلى نموذج تنفيذ البحث.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">كيف ينفذ Milvus StructArray دون معاملته ككتلة<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>النموذج المواجه للمستخدم هو <code translate="no">ARRAY&lt;STRUCT&gt;</code>. ومع ذلك، فإن تخزين القيمة بأكملها ككتلة واحدة غير شفافة سيجعل فهارس الحقول الفرعية والتصفية والإخراج الانتقائي غير فعالة.</p>
<p>يستخدم Milvus تصميمًا بعمود أصلي منطقي وأعمدة فرعية مادية.</p>
<p>في طبقة المخطط، يكون <code translate="no">clips</code> هو الحقل الأصلي المنطقي. وهو يحدد خصائص مثل مخطط Struct والسعة القصوى وقابلية القيمة null. يتم تطبيع حقوله الفرعية إلى مسارات مثل <code translate="no">clips[clip_embedding_list]</code> و <code translate="no">clips[clip_embedding]</code> و <code translate="no">clips[scene_type]</code> و <code translate="no">clips[label_confidence]</code>.</p>
<p>تتبع الحقول الفرعية العددية مسارات تخزين مصفوفة عددية لكل كيان، بينما تتبع الحقول الفرعية المتجهة مسارات مصفوفة متجهة. يمكن لكل حقل فرعي بعد ذلك استخدام مسار البيانات المناسب لنوعه: تصفية عددية وفهارس عددية للبيانات الوصفية، وفهارس متجهة وبحث ANN للتضمينات.</p>
<p>عند الإدراج، يقوم Proxy بتوسيع قائمة Struct المتداخلة إلى أعمدة فرعية محددة الأنواع. أثناء التنفيذ، يحافظ Milvus على العلاقة بين كل عنصر مادي وكيانه الأصلي. من الناحية المفاهيمية، تبدو هذه العلاقة كما يلي:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>عندما يُرجع البحث على مستوى العنصر معرّف عنصر ماديًا، يعيّنه Milvus مرة أخرى إلى الكيان الأصلي وإزاحة العنصر. عندما ينتج <code translate="no">element_filter</code> خريطة بتات على مستوى العنصر، يقوم المحرك بمحاذاتها مع رؤية الكيان الأصلي وعمليات الحذف وعوامل التصفية الأخرى.</p>
<p>عند إرجاع النتائج، يستخدم Milvus المخطط المنطقي والإزاحات المشتركة لإعادة بناء شكل StructArray الذي أدخله التطبيق. يمكن للنظام التنفيذ عبر أعمدة فرعية محددة الأنواع بينما يواصل المستخدم قراءة وكتابة الكائنات المتداخلة الطبيعية. هذا التخطيط المادي يجعل StructArray أكثر من مجرد JSON محدد الأنواع: العلاقة المتداخلة تشارك في نموذج الفهرس والتنفيذ.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">أين يناسب StructArray، وأين لا يناسب<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد StructArray مناسبًا بقوة عندما تكون جميع الشروط التالية صحيحة:</p>
<ul>
<li>لدى التطبيق كيان أصلي ذو معنى، مثل فيديو أو منتج أو مستند أو صفحة بصرية أو سجل ذاكرة.</li>
<li>يحتوي كل كيان أصلي على مجموعة مرتبة متغيرة الطول من العناصر المحلية.</li>
<li>تحتاج تلك العناصر إلى بيانات وصفية عددية خاصة بها، أو متجهات، أو كليهما.</li>
<li>يجب أن يحافظ البحث أو التصفية على العلاقة بين الحقول الفرعية عند نفس إزاحة العنصر.</li>
<li>يحتاج التطبيق إلى استرجاع متعدد المتجهات على مستوى الكيان، أو نتائج على مستوى العنصر، أو كليهما.</li>
</ul>
<p>ليس StructArray بالضرورة أفضل لكل مجموعة. قد تُخدم المستندات القصيرة أو الاستعلامات البسيطة جيدًا بتضمين كثيف واحد. تضيف الفهرسة متعددة المتجهات تكاليف تخزين وبحث، لذا يجب أن تكتسب التمثيلات الإضافية مكانها من خلال تحسين جودة الاسترجاع أو دقّة نتائج أكثر فائدة.</p>
<p>حدود المخطط والتنفيذ الحالية مهمة أيضًا:</p>
<ul>
<li>يتم دعم <code translate="no">Struct</code> كنوع عنصر لـ <code translate="no">Array</code>، وليس كحقل مجموعة على المستوى الأعلى.</li>
<li>تشترك جميع العناصر في StructArray واحد في مخطط واحد محدد مسبقًا.</li>
<li><code translate="no">max_capacity</code> مطلوب ويحدد عدد العناصر لكل كيان.</li>
<li>لا يتم دعم الحقول الفرعية المتداخلة <code translate="no">Struct</code> أو <code translate="no">Array</code> أو <code translate="no">ArrayOfStruct</code> أو <code translate="no">JSON</code> داخل StructArray.</li>
<li>يقبل الحقل الفرعي المتجه فهرسًا واحدًا. استخدم حقولًا فرعية متجهة منفصلة لبحث EmbeddingList والبحث على مستوى العنصر عندما يكون كلاهما مطلوبًا.</li>
<li>يجب فهرسة الحقول الفرعية المتجهة قبل البحث. يجب فهرسة الحقول الفرعية العددية المستخدمة بكثرة في عوامل التصفية بشكل مناسب.</li>
<li>يكون مخطط الحقل الفرعي ثابتًا بعد إنشاء حقل StructArray، لذا خطط لسمات العنصر قبل الإطلاق في الإنتاج.</li>
</ul>
<p>تجعل هذه القيود النموذج أضيق من التداخل العشوائي في قواعد بيانات المستندات، ولكنها تمنح Milvus أيضًا بنية كافية للتفكير في هوية العنصر، وفهرسة كل حقل فرعي، والتنفيذ بدقّتي بحث.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray يُبقي الأدلة المحلية فئة أولى دون فقدان الكيان<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>يمنح StructArray Milvus كائن استرجاع تجد المخططات المسطحة صعوبة في تمثيله: كيان أصلي مع مجموعة مرتبة من العناصر المهيكلة. تشارك العلاقات بين تلك العناصر في التصفية والفهرسة والبحث بدلاً من أن تكون موجودة في التخزين فقط.</p>
<p>يحتفظ كل عنصر ببياناته الوصفية وتضميناته الخاصة. يمكن للعناصر تحقيق المسندات العددية لنفس العنصر، أو المشاركة معًا في بحث EmbeddingList على مستوى الكيان، أو التنافس بشكل مستقل في البحث على مستوى العنصر. في الوقت نفسه، تظل مرتبطة بالكيان الأصلي الذي تمنحها بياناته الوصفية وأذوناته وهويته في التطبيق سياقها.</p>
<p>بالنسبة لمقاطع الفيديو وصور المنتجات وفقرات المستندات والرقع البصرية وأجزاء الذاكرة، يمكن البحث في الأدلة المحلية وتصفيتها دون فقدان الكيان الذي تنتمي إليه. خيارات التصميم المتبقية صريحة: حدد دقّة البحث، وامنح كل حقل فرعي متجه المعيار والفهرس المطابقين، وقرر ما إذا كانت النتائج الهجينة يجب أن تحافظ على إزاحات العناصر أو تُدمج مرة أخرى إلى الكيانات.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">جرّب StructArray في Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray متاح في Milvus 3.0. ابدأ <a href="https://milvus.io/docs/array-of-structs.md">بنظرة عامة على StructArray</a>. إذا كنت تقيّم الاسترجاع متعدد المتجهات على مستوى الكيان، فاقرأ <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">دليل استراتيجية EmbeddingList</a>. بالنسبة لدقّة النتائج وسلوك الدمج، راجع <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">البحث الهجين مع StructArray</a>.</p>
<p>لسياق الإصدار الأوسع، راجع <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">مدونة إطلاق Milvus 3.0</a> و<a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار</a> و<a href="https://github.com/milvus-io/milvus">مستودع milvus-io/milvus</a>.</p>
<p>يدعم <a href="https://zilliz.com/">Zilliz Cloud</a> أيضًا StructArray وبحث EmbeddingList للنشر المُدار. راجع <a href="https://docs.zilliz.com/docs/use-array-of-structs">دليل Zilliz Cloud لـ StructArray</a> لمعرفة الحدود الخاصة بالخدمة. في Zilliz Cloud، يتم حاليًا توثيق العوامل العددية على StructArray لمجموعات On-Demand.</p>
<p>لمناقشة مخطط أو تصميم استرجاع مع الفريق، انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus على Discord</a> أو احجز جلسة <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
