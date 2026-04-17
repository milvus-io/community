---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: 'من ملفات PDF إلى الإجابات: بناء قاعدة معارف RAG مع PaddleOCR و Milvus و ERNIE'
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  تعرّف على كيفية بناء قاعدة معرفية عالية الدقة لـ RAG باستخدام Milvus، والبحث
  الهجين، وإعادة الترتيب، والأسئلة والأجوبة متعددة الوسائط لذكاء المستندات.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>أصبحت النماذج اللغوية الكبيرة أكثر قدرة بكثير مما كانت عليه في عام 2023، لكنها لا تزال تهلوس بثقة وغالباً ما تعتمد على معلومات قديمة. يعالج RAG (التوليد المعزز للاسترجاع) كلتا المشكلتين من خلال استرجاع السياق ذي الصلة من قاعدة بيانات متجهة مثل <a href="https://milvus.io/">Milvus</a> قبل أن يولد النموذج إجابة. يؤسس هذا السياق الإضافي للإجابة في المصادر الحقيقية ويجعلها أكثر حداثة.</p>
<p>إحدى حالات استخدام RAG الأكثر شيوعًا هي قاعدة معارف الشركة. حيث يقوم المستخدم بتحميل ملفات PDF أو ملفات Word أو مستندات داخلية أخرى، ويطرح سؤالاً بلغة طبيعية، ويتلقى إجابة بناءً على تلك المواد بدلاً من الاعتماد فقط على التدريب المسبق للنموذج.</p>
<p>ولكن استخدام نفس نموذج LLM ونفس قاعدة البيانات المتجهة لا يضمن نفس النتيجة. إذ يمكن لفريقين أن يبنيا على نفس الأساس وينتهي بهما الأمر بجودة نظام مختلفة جداً. عادةً ما يأتي الاختلاف عادةً من كل شيء في المراحل الأولية: <strong>كيف يتم تحليل المستندات وتجزئتها وتضمينها؛ وكيف تتم فهرسة البيانات؛ وكيف يتم ترتيب نتائج الاسترجاع؛ وكيف يتم تجميع الإجابة النهائية.</strong></p>
<p>في هذه المقالة، سنستخدم <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> كمثال وسنشرح كيفية بناء قاعدة معرفية قائمة على RAG باستخدام <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a> و <a href="https://milvus.io/">Milvus</a> و ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">بنية نظام Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>تتكون بنية نظام Paddle-ERNIE-RAG من أربع طبقات أساسية:</p>
<ul>
<li><strong>طبقة استخراج البيانات.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">طبقة PP-StructureV3،</a> وهي خط أنابيب تحليل المستندات في PaddleOCR، تقوم بقراءة ملفات PDF والصور باستخدام التعرف الضوئي على الحروف المدرك للتخطيط. وهو يحافظ على بنية المستند - العناوين والجداول وترتيب القراءة - ويخرج علامات Markdown نظيفة، مقسمة إلى أجزاء متداخلة.</li>
<li><strong>طبقة تخزين متجهة.</strong> يتم تضمين كل جزء في متجه مكون من 384 بُعدًا وتخزينه في <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> إلى جانب البيانات الوصفية (اسم الملف ورقم الصفحة ومعرف الجزء). يدعم الفهرس المقلوب المتوازي البحث بالكلمات الرئيسية.</li>
<li><strong>طبقة الاسترجاع والإجابة.</strong> يتم تشغيل كل استعلام مقابل كل من الفهرس المتجه وفهرس الكلمات المفتاحية. يتم دمج النتائج عن طريق RRF (دمج الرتب المتبادل)، وإعادة ترتيبها، وتمريرها إلى نموذج <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> لتوليد الإجابة.</li>
<li><strong>طبقة التطبيق.</strong> تتيح لك واجهة <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/">Gradio</a> تحميل المستندات، وطرح الأسئلة، وعرض الإجابات مع الاقتباسات من المصدر ودرجات الثقة.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>تستعرض الأقسام أدناه كل مرحلة بالترتيب، بدءًا من كيفية تحول المستندات الأولية إلى نص قابل للبحث.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">كيفية بناء خط أنابيب RAG خطوة بخطوة<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">الخطوة 1: تحليل المستندات باستخدام PP-StructureV3</h3><p>المستندات الأولية هي المكان الذي تبدأ فيه معظم مشاكل الدقة. تمزج الأوراق البحثية والتقارير الفنية بين تخطيطات ذات عمودين وصيغ وجداول وصور. عادةً ما يؤدي استخراج النص باستخدام مكتبة أساسية مثل PyPDF2 إلى تشويش الإخراج: تظهر الفقرات غير مرتبة، وتنهار الجداول، وتختفي الصيغ.</p>
<p>لتجنب هذه المشاكل، ينشئ المشروع فئة OnlinePDFParser في backend.py. تستدعي هذه الفئة واجهة برمجة تطبيقات PP-StructureV3 عبر الإنترنت للقيام بتحليل التخطيط. فبدلًا من استخراج النص الخام، يقوم بتحديد بنية المستند، ثم يحولها إلى صيغة Markdown.</p>
<p>لهذه الطريقة ثلاث فوائد واضحة:</p>
<ul>
<li><strong>مخرجات Markdown نظيفة</strong></li>
</ul>
<p>يتم تنسيق الإخراج بتنسيق Markdown بعناوين وفقرات مناسبة. وهذا يسهّل فهم المحتوى على النموذج.</p>
<ul>
<li><strong>استخراج الصور بشكل منفصل</strong></li>
</ul>
<p>يستخرج النظام الصور ويحفظها أثناء التحليل. وهذا يمنع فقدان المعلومات المرئية المهمة.</p>
<ul>
<li><strong>معالجة أفضل للسياق</strong></li>
</ul>
<p>يتم تقسيم النص باستخدام نافذة منزلقة مع تداخل. هذا يتجنب تقطيع الجمل أو الصيغ في المنتصف، مما يساعد في الحفاظ على وضوح المعنى وتحسين دقة البحث.</p>
<p><strong>تدفق التحليل الأساسي</strong></p>
<p>في backend.py، يتبع التحليل ثلاث خطوات بسيطة:</p>
<ol>
<li>إرسال ملف PDF إلى واجهة برمجة التطبيقات PP-StructureV3.</li>
<li>قراءة نتائج تخطيطParsingResults التي تم إرجاعها.</li>
<li>استخرج نص Markdown الذي تم تنظيفه وأي صور.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">الخطوة 2: تقطيع النص مع تداخل النافذة المنزلقة</h3><p>بعد التحليل، يجب تقسيم نص Markdown إلى أجزاء أصغر (أجزاء) للبحث. إذا تم قطع النص بأطوال ثابتة، فقد يتم تقسيم الجمل أو الصيغ إلى نصفين.</p>
<p>ولمنع ذلك، يستخدم النظام تقنية النافذة المنزلقة المقطوعة مع التداخل. يشترك كل جزء في ذيل كل جزء مع الجزء الذي يليه، بحيث يظهر محتوى الحدود في كلتا النافذتين. هذا يحافظ على المعنى سليمًا عند حواف القطع ويحسن من عملية الاسترجاع.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">الخطوة 3: تخزين المتجهات والبيانات الوصفية في ميلفوس</h3><p>مع تجهيز القطع النظيفة، فإن الخطوة التالية هي تخزينها بطريقة تدعم الاسترجاع السريع والدقيق.</p>
<p><strong>تخزين المتجهات والبيانات الوصفية</strong></p>
<p>يفرض ميلفوس قواعد صارمة لأسماء المجموعات - فقط أحرف ASCII والأرقام والشرطات السفلية. إذا كان اسم القاعدة المعرفية يحتوي على أحرف غير ASCII، فإن الواجهة الخلفية تقوم بترميزه سداسيًا ببادئة kb_ قبل إنشاء المجموعة وفك تشفيرها للعرض. تفصيل صغير، لكنه يمنع الأخطاء الغامضة.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>بالإضافة إلى التسمية، تمر كل قطعة بخطوتين قبل إدراجها: إنشاء تضمين وإرفاق البيانات الوصفية.</p>
<ul>
<li><strong>ما يتم تخزينه:</strong></li>
</ul>
<p>يتم تحويل كل قطعة إلى متجه كثيف مكون من 384 بُعدًا. في الوقت نفسه، يخزن مخطط Milvus حقولاً إضافية مثل اسم الملف ورقم الصفحة ومعرف القطعة.</p>
<ul>
<li><strong>لماذا هذا مهم:</strong></li>
</ul>
<p>هذا يجعل من الممكن تتبع إجابة ما إلى الصفحة التي أتت منها بالضبط. كما أنه يعد النظام لحالات استخدام الأسئلة والأجوبة متعددة الوسائط في المستقبل.</p>
<ul>
<li><strong>تحسين الأداء:</strong></li>
</ul>
<p>في vector_store.py، تستخدم طريقة إدراج_المستندات تضمين الدُفعات. وهذا يقلل من عدد طلبات الشبكة ويجعل العملية أكثر كفاءة.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">الخطوة 4: الاسترجاع باستخدام البحث الهجين ودمج RRF</h3><p>نادرًا ما تكون طريقة بحث واحدة كافية. يعثر البحث المتجه على محتوى متشابه دلاليًا ولكنه قد يفوت المصطلحات الدقيقة؛ البحث بالكلمات المفتاحية يُسمّر مصطلحات محددة ولكنه يفوت إعادة الصياغة. يؤدي تشغيل كليهما بالتوازي ودمج المخرجات إلى نتائج أفضل من أي منهما بمفرده.</p>
<p>عندما تختلف لغة الاستعلام عن لغة المستند، يقوم النظام أولاً بترجمة الاستعلام باستخدام لغة LLM بحيث يمكن لكلا مساري البحث العمل بلغة المستند. ثم يتم تشغيل عمليتي بحث بالتوازي:</p>
<ul>
<li><strong>بحث متجه (كثيف):</strong> يعثر على المحتوى ذي المعنى المتشابه، حتى عبر اللغات، ولكنه قد يُظهر مقاطع ذات صلة لا تجيب مباشرةً على السؤال.</li>
<li><strong>بحث الكلمات المفتاحية (متناثر):</strong> يعثر على التطابقات التامة للمصطلحات التقنية أو الأرقام أو متغيرات الصيغ - وهو نوع الرموز التي غالبًا ما تعمل التضمينات المتجهة على تسهيلها.</li>
</ul>
<p>يدمج النظام كلا قائمتي النتائج باستخدام RRF (دمج الرتب المتبادلة). ويحصل كل مرشح على درجة بناءً على ترتيبه في كل قائمة، لذا فإن القطعة التي تظهر بالقرب من أعلى <em>القائمتين</em> تحصل على أعلى الدرجات. يساهم البحث المتجه في التغطية الدلالية؛ بينما يساهم البحث بالكلمات المفتاحية في دقة المصطلح.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">الخطوة 5: إعادة ترتيب النتائج قبل توليد الإجابة</h3><p>الأجزاء التي تُرجعها خطوة البحث ليست متساوية في الأهمية. لذا قبل توليد الإجابة النهائية، تقوم خطوة إعادة التصنيف بإعادة تصنيفها.</p>
<p>في reranker_v2.py، تقوم طريقة إعادة التصنيف المدمجة بتقييم كل جزء، حيث يتم تسجيلها من خمسة جوانب:</p>
<ul>
<li><strong>المطابقة الضبابية</strong></li>
</ul>
<p>باستخدام fuzzywuzzy، نتحقق من مدى تشابه صياغة القطعة مع الاستعلام. يقيس هذا تداخل النص المباشر.</p>
<ul>
<li><strong>تغطية الكلمات الرئيسية</strong></li>
</ul>
<p>نتحقق من عدد الكلمات المهمة من الاستعلام التي تظهر في القطعة. المزيد من الكلمات الرئيسية المتطابقة يعني درجة أعلى.</p>
<ul>
<li><strong>التشابه الدلالي</strong></li>
</ul>
<p>نعيد استخدام درجة التشابه المتجه التي أرجعها ميلفوس. يعكس هذا مدى تقارب المعاني.</p>
<ul>
<li><strong>الطول والرتبة الأصلية</strong></li>
</ul>
<p>يتم معاقبة الأجزاء القصيرة جدًا لأنها غالبًا ما تفتقر إلى السياق. تحصل القطع التي تحتل مرتبة أعلى في نتائج Milvus الأصلية على مكافأة صغيرة.</p>
<ul>
<li><strong>اكتشاف الكيانات المسماة</strong></li>
</ul>
<p>يكتشف النظام المصطلحات المكتوبة بأحرف كبيرة مثل "Milvus" أو "RAG" كأسماء علم محتملة، ويحدد المصطلحات التقنية متعددة الكلمات كعبارات رئيسية محتملة.</p>
<p>لكل عامل وزن في النتيجة النهائية (كما هو موضح في الشكل أدناه).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لا يتطلب أي بيانات تدريب، وتكون مساهمة كل عامل مرئية. إذا تم تصنيف جزء ما في مرتبة عالية أو منخفضة بشكل غير متوقع، فإن الدرجات توضح السبب. لا تقدم أداة إعادة ترتيب الصندوق الأسود بالكامل ذلك.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">الخطوة 6: إضافة أسئلة وأجوبة متعددة الوسائط للمخططات والرسوم البيانية</h3><p>غالبًا ما تحتوي الأوراق البحثية على مخططات ورسوم بيانية مهمة تحمل معلومات لا يحملها النص. قد يفوت خط أنابيب RAG النصي فقط هذه الإشارات تمامًا.  للتعامل مع هذا الأمر، أضفنا خاصية أسئلة وأجوبة بسيطة قائمة على الصور مع ثلاثة أجزاء:</p>
<p><strong>1. إضافة المزيد من السياق إلى المطالبة</strong></p>
<p>عند إرسال صورة إلى النموذج، يحصل النظام أيضًا على نص OCR من نفس الصفحة.<br>
تتضمن المطالبة: الصورة ونص الصفحة وسؤال المستخدم.<br>
هذا يساعد النموذج على فهم السياق الكامل ويقلل من الأخطاء عند قراءة الصورة.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. دعم واجهة برمجة تطبيقات الرؤية</strong></p>
<p>يدعم العميل (ernie_client.py) تنسيق رؤية OpenAI. يتم تحويل الصور إلى Base64 وإرسالها بتنسيق image_url، مما يتيح للنموذج معالجة كل من الصورة والنص معًا.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. الخطة الاحتياطية</strong></p>
<p>إذا فشلت واجهة برمجة التطبيقات الخاصة بالصورة (على سبيل المثال، بسبب مشاكل في الشبكة أو حدود النموذج)، يعود النظام إلى خطة RAG العادية القائمة على النص.<br>
ويستخدم نص التعرف الضوئي على الحروف للإجابة عن السؤال، وبالتالي يستمر النظام في العمل دون انقطاع.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">ميزات واجهة المستخدم الرئيسية وتنفيذها لخط الأنابيب<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">كيفية التعامل مع تحديد معدل واجهة برمجة التطبيقات والحماية</h3><p>عند استدعاء LLM أو تضمين واجهات برمجة التطبيقات، قد يتلقى النظام أحيانًا خطأ <strong>429 عدد كبير جدًا من الطلبات</strong>. يحدث هذا عادةً عندما يتم إرسال عدد كبير جدًا من الطلبات في وقت قصير.</p>
<p>للتعامل مع ذلك، يضيف المشروع آلية إبطاء تكيفية في ernie_client.py. في حالة حدوث خطأ الحد الأقصى للمعدل، يقوم النظام تلقائيًا بتقليل سرعة الطلب وإعادة المحاولة بدلاً من التوقف.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>يساعد هذا في الحفاظ على استقرار النظام، خاصةً عند معالجة وتضمين أعداد كبيرة من المستندات.</p>
<h3 id="Custom-Styling" class="common-anchor-header">تصميم مخصص</h3><p>تستخدم الواجهة الأمامية Gradio (main.py). أضفنا CSS مخصص (modern_css) لجعل الواجهة أنظف وأسهل في الاستخدام.</p>
<ul>
<li><strong>مربع الإدخال</strong></li>
</ul>
<p>تم تغييره من النمط الرمادي الافتراضي إلى تصميم أبيض مستدير. يبدو أبسط وأكثر حداثة.</p>
<ul>
<li><strong>زر الإرسال</strong></li>
</ul>
<p>أضفنا لونًا متدرجًا وتأثير التحويم حتى يبرز أكثر.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">عرض معادلة LaTeX</h3><p>تحتوي العديد من المستندات البحثية على صيغ رياضية، لذا فإن العرض الصحيح مهم. لقد أضفنا دعم LaTeX الكامل لكل من الصيغ المضمنة والمكتوبة.</p>
<ul>
<li><strong>حيثما ينطبق</strong>يعمل التكوين في كل من نافذة الدردشة (الدردشة الآلية) ومنطقة الملخص (Markdown).</li>
<li><strong>نتيجة عملية</strong>سواءً ظهرت الصيغ في إجابة النموذج أو في ملخصات المستندات، يتم عرضها بشكل صحيح على الصفحة.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">قابلية الشرح: درجات الملاءمة والثقة</h3><p>لتجنب تجربة "الصندوق الأسود"، يعرض النظام مؤشرين بسيطين:</p>
<ul>
<li><p><strong>الملاءمة</strong></p></li>
<li><p>يظهر تحت كل إجابة في قسم "المراجع".</p></li>
<li><p>يعرض درجة إعادة الترتيب لكل جزء مستشهد به.</p></li>
<li><p>يساعد المستخدمين على معرفة سبب استخدام صفحة أو مقطع معين.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>الثقة</strong></p></li>
<li><p>تظهر في لوحة "تفاصيل التحليل".</p></li>
<li><p>استنادًا إلى درجة الجزء الأعلى (مقيسة إلى 100%).</p></li>
<li><p>يوضح مدى ثقة النظام في الإجابة.</p></li>
<li><p>إذا كانت أقل من 60%، فقد تكون الإجابة أقل موثوقية.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>تظهر واجهة المستخدم أدناه. في الواجهة، تُظهر كل إجابة رقم صفحة المصدر ودرجة ملاءمتها.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>تعتمد دقّة RAG على الهندسة بين LLM وقاعدة بيانات المتجهات. وقد استعرضت هذه المقالة بناء <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> مع <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> الذي يغطي كل مرحلة من مراحل تلك الهندسة:</p>
<ul>
<li><strong>تحليل المستند.</strong> يقوم PP-StructureV3 (عبر <a href="https://github.com/PaddlePaddle/PaddleOCR"></a> PaddleOCR) بتحويل ملفات PDF إلى Markdown نظيفة مع التعرف الضوئي على الحروف المدرك للتخطيط، مع الحفاظ على العناوين والجداول والصور التي تفقدها المستخرجات الأساسية.</li>
<li><strong>التقطيع.</strong> تحافظ تقسيمات النوافذ المنزلقة مع التداخل على السياق سليمًا عند حدود القطع، مما يمنع الأجزاء المقطوعة التي تضر باسترجاع الملفات.</li>
<li><strong>تخزين المتجهات في ميلفوس.</strong> تخزين المتجهات بطريقة تدعم الاسترجاع السريع والدقيق.</li>
<li><strong>البحث الهجين.</strong> تشغيل البحث عن المتجهات والبحث عن الكلمات الرئيسية بالتوازي، ثم دمج النتائج مع RRF (دمج الرتب المتبادلة)، مما يؤدي إلى التقاط كل من التطابقات الدلالية والمطابقات الدقيقة للمصطلحات التي قد تفوت أي من الطريقتين وحدهما.</li>
<li><strong>إعادة الترتيب.</strong> تقوم أداة إعادة الترتيب الشفافة والقائمة على القواعد بتسجيل كل جزء على أساس التطابق الضبابي وتغطية الكلمات المفتاحية والتشابه الدلالي والطول واكتشاف الاسم الصحيح - لا حاجة لبيانات التدريب، وكل درجة قابلة للتصحيح.</li>
<li><strong>أسئلة وأجوبة متعددة الوسائط.</strong> يمنح إقران الصور مع نص صفحة التعرف الضوئي على الحروف (OCR) في المطالبة سياقًا كافيًا لنموذج الرؤية للإجابة عن الأسئلة المتعلقة بالمخططات والرسوم البيانية، مع وجود نص احتياطي فقط في حالة فشل واجهة برمجة تطبيقات الصور.</li>
</ul>
<p>إذا كنت تقوم ببناء نظام RAG للأسئلة والأجوبة على المستندات وتريد دقة أفضل، نود أن نسمع كيف تتعامل مع الأمر.</p>
<p>هل لديك أسئلة حول <a href="https://milvus.io/">ميلفوس</a> أو البحث المختلط أو تصميم قاعدة المعرفة؟ انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة لمناقشة حالة الاستخدام الخاصة بك.</p>
