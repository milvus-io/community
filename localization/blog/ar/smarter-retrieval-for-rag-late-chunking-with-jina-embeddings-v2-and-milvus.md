---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 'الاسترجاع الأكثر ذكاءً ل RAG: التقطيع المتأخر مع Jina Embedddings v2 و Milvus'
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  عزز دقة RAG باستخدام التقطيع المتأخر وMilvus لتضمين المستندات الفعال والمدرك
  للسياق والبحث الأسرع والأكثر ذكاءً في المتجهات.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>عادةً ما يبدأ بناء نظام RAG قوي عادةً <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>بتجزئة</strong></a> <strong>المستندات</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>- أي تقسيم</strong></a>النصوص الكبيرة إلى أجزاء يمكن التحكم فيها لتضمينها واسترجاعها. تتضمن الاستراتيجيات الشائعة ما يلي:</p>
<ul>
<li><p><strong>القطع ذات الحجم الثابت</strong> (على سبيل المثال، كل 512 رمزًا)</p></li>
<li><p><strong>أجزاء متغيرة الحجم</strong> (على سبيل المثال، حدود الفقرة أو الجملة)</p></li>
<li><p><strong>النوافذ المنزلقة</strong> (فترات متداخلة)</p></li>
<li><p><strong>التقطيع التكراري</strong> (تقسيمات هرمية)</p></li>
<li><p><strong>التقطيع الدلالي</strong> (التجميع حسب الموضوع)</p></li>
</ul>
<p>في حين أن هذه الأساليب لها مزاياها، إلا أنها غالبًا ما تقطع السياق بعيد المدى. ولمواجهة هذا التحدي، ابتكرت جينا للذكاء الاصطناعي نهج التقطيع المتأخر: تضمين المستند بأكمله أولاً، ثم اقتطاع الأجزاء الخاصة بك.</p>
<p>في هذه المقالة، سنستكشف كيفية عمل أسلوب التقطيع المتأخر ونوضح كيف يمكن أن يؤدي الجمع بينه وبين <a href="https://milvus.io/">Milvus -</a>قاعدة بيانات متجهة مفتوحة المصدر عالية الأداء ومفتوحة المصدر مصممة للبحث عن التشابه - إلى تحسين خطوط أنابيب RAG الخاصة بك بشكل كبير. سواء كنت تقوم ببناء قواعد معارف مؤسسية أو دعم عملاء قائم على الذكاء الاصطناعي أو تطبيقات بحث متقدمة، ستوضح لك هذه الإرشادات كيفية إدارة التضمينات بشكل أكثر فعالية على نطاق واسع.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">ما هو التقطيع المتأخر؟<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن لطرق التقطيع التقليدية أن تقطع الروابط المهمة عندما تمتد المعلومات الأساسية على عدة أجزاء، مما يؤدي إلى ضعف أداء الاسترجاع.</p>
<p>انظر إلى ملاحظات الإصدار 2.4.13 من ميلفوس 2.4.13، مقسمة إلى جزأين كما هو موضح أدناه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 1. مذكرة إصدار ميلفوس 2.4.13 مقسمة إلى أجزاء</em></p>
<p>إذا كنت تستفسر عن "ما هي الميزات الجديدة في الإصدار 2.4.13 من ملفوس 2.4.13؟"، فقد يفشل نموذج التضمين القياسي في ربط "ملفوس 2.4.13" (في الجزء 1) بميزاته (في الجزء 2). والنتيجة؟ متجهات أضعف ودقة استرجاع أقل.</p>
<p>توفر الإصلاحات الإرشادية - مثل النوافذ المنزلقة والسياقات المتداخلة وعمليات المسح المتكررة - تخفيفًا جزئيًا ولكن بدون ضمانات.</p>
<p>يتبع<strong>التقطيع التقليدي</strong> هذا المسار:</p>
<ol>
<li><p>التقطيع<strong>المسبق</strong> للنص (حسب الجمل أو الفقرات أو الحد الأقصى لطول الرمز المميز).</p></li>
<li><p><strong>تضمين</strong> كل جزء على حدة.</p></li>
<li><p><strong>تجميع</strong> التضمينات الرمزية (على سبيل المثال، من خلال تجميع متوسط التجميع) في متجه قطعة واحدة.</p></li>
</ol>
<p>يقلب<strong>التقطيع المتأخر</strong> خط الأنابيب:</p>
<ol>
<li><p><strong>التضمين أولاً</strong>: تشغيل محول سياق طويل على المستند بالكامل، مما يؤدي إلى إنشاء تضمينات رمزية غنية تلتقط السياق العام.</p></li>
<li><p><strong>التقطيع لاحقًا</strong>: تجميع متوسط الامتدادات المتجاورة من تلك التضمينات الرمزية لتكوين متجهات القطع النهائية.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 2. التقطيع الساذج مقابل التقطيع المتأخر (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>المصدر</em></a><em>)</em></p>
<p>من خلال الحفاظ على سياق المستند الكامل في كل قطعة، ينتج عن التقطيع المتأخر</p>
<ul>
<li><p><strong>دقة أعلى في الاسترجاع - كل</strong>قطعة مدركة للسياق.</p></li>
<li><p><strong>أجزاء أقل - فأنت</strong>ترسل نصًا أكثر تركيزًا إلى إدارة المستندات الطويلة مما يقلل من التكاليف ووقت الاستجابة.</p></li>
</ul>
<p>يمكن للعديد من النماذج ذات السياق الطويل مثل jina-embeddings-v2-base-en معالجة ما يصل إلى 8,192 رمزًا - أي ما يعادل قراءة مدتها 20 دقيقة تقريبًا (حوالي 5000 كلمة) - مما يجعل التقطيع المتأخر عمليًا لمعظم المستندات في العالم الحقيقي.</p>
<p>الآن بعد أن فهمنا "ماذا" و "لماذا" وراء التقطيع المتأخر، دعونا نتعمق في "الكيفية". في القسم التالي، سنرشدك في القسم التالي إلى تطبيق عملي لخط أنابيب التقطيع المتأخر، وقياس أدائه مقارنةً بالتقطيع التقليدي، والتحقق من تأثيره في العالم الحقيقي باستخدام Milvus. ستعمل هذه الإرشادات العملية على الربط بين النظرية والتطبيق، مع توضيح كيفية دمج التقطيع المتأخر في سير عمل RAG الخاص بك.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">اختبار التقطيع المتأخر<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">التنفيذ الأساسي</h3><p>فيما يلي الوظائف الأساسية للتقطيع المتأخر. لقد أضفنا سلاسل مستندات واضحة لإرشادك خلال كل خطوة. الدالة <code translate="no">sentence_chunker</code> تقسم الدالة المستند الأصلي إلى أجزاء مستندة إلى فقرة، مع إرجاع كل من محتويات الجزء ومعلومات الشرح التوضيحي للجزء <code translate="no">span_annotations</code> (أي مؤشرات البداية والنهاية لكل جزء).</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p>وتستخدم الدالة <code translate="no">document_to_token_embeddings</code> نموذج jinaai/jina-embeddings-v2-base-en ونموذجها الرمزي لإنتاج تضمينات للمستند بأكمله.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p>تأخذ الدالة <code translate="no">late_chunking</code> تضمينات الرموز الرمزية للمستند ومعلومات الشرح التوضيحي للقطعة الأصلية <code translate="no">span_annotations</code> ، ثم تنتج تضمينات القطعة النهائية.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>على سبيل المثال، التقطيع باستخدام jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>نصيحة</em>: إن تغليف خط الأنابيب الخاص بك في دوال يجعل من السهل التبديل في نماذج أخرى طويلة السياق أو استراتيجيات التقطيع.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">مقارنة مع طرق التضمين التقليدية</h3><p>لمزيد من التوضيح لمزايا التقطيع المتأخر، قمنا أيضًا بمقارنته بأساليب التضمين التقليدية، باستخدام مجموعة من نماذج المستندات والاستعلامات.</p>
<p>ودعونا نعيد النظر في مثال مذكرة الإصدار Milvus 2.4.13:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>نقيس <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">التشابه في جيب التمام</a> بين تضمين الاستعلام ("milvus 2.4.13") وكل قطعة:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>تفوّق التقطيع المتأخر على التقطيع التقليدي باستمرار، مما أسفر عن أوجه تشابه جيب تمام أعلى عبر كل قطعة. وهذا يؤكد أن تضمين المستند الكامل أولاً يحافظ على السياق العام بشكل أكثر فعالية.</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>يمكننا أن نلاحظ أن تضمين الفقرة الكاملة أولاً يضمن أن كل قطعة تحمل "<code translate="no">Milvus 2.4.13</code>" مما يعزز درجات التشابه في السياق وجودة الاسترجاع.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>اختبار التقطيع المتأخر في ميلفوس</strong></h3><p>بمجرد إنشاء تضمينات القطع، يمكننا تخزينها في ميلفوس وإجراء الاستعلامات. يقوم الرمز التالي بإدراج متجهات القطع في المجموعة.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>استيراد التضمينات إلى ميلفوس</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">الاستعلام والتحقق من الصحة</h4><p>للتحقق من صحة دقة استعلامات Milvus، نقارن نتائج الاسترجاع الخاصة به بنتائج التشابه الجيبية الغاشمة المحسوبة يدويًا. إذا عادت كلتا الطريقتين بنتائج متناسقة من أعلى k، يمكننا أن نكون واثقين من أن دقة بحث ميلفوس موثوقة.</p>
<p>نحن نقارن بحث Milvus الأصلي بالبحث الأصلي في Milvus مع مسح تشابه جيب التمام بالقوة الغاشمة:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>هذا يؤكد أن Milvus يُرجع نفس الأجزاء الأعلى-ك التي يُرجعها الفحص اليدوي لجيب التمام.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>لذا فإن كلتا الطريقتين تُنتج نفس القطع الثلاث الأولى، مما يؤكد دقة ميلفوس.</p>
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
    </button></h2><p>في هذه المقالة، تعمقنا في آليات وفوائد التقطيع المتأخر. بدأنا بتحديد أوجه القصور في أساليب التقطيع التقليدية، خاصةً عند التعامل مع المستندات الطويلة حيث يكون الحفاظ على السياق أمرًا بالغ الأهمية. قدمنا مفهوم التقطيع المتأخر - تضمين المستند بأكمله قبل تقطيعه إلى أجزاء ذات معنى - وأظهرنا كيف يحافظ هذا على السياق العام، مما يؤدي إلى تحسين التشابه الدلالي ودقة الاسترجاع.</p>
<p>ثم استعرضنا بعد ذلك تطبيقًا عمليًا باستخدام نموذج Jina-embeddings-v2-base-en من Jina AI وقمنا بتقييم أدائه مقارنةً بالطرق التقليدية. وأخيرًا، أوضحنا كيفية دمج تضمينات القطع في Milvus من أجل بحث متجه دقيق وقابل للتطوير.</p>
<p>يوفر أسلوب التقطيع المتأخر نهجًا <strong>يركز على السياق أولاً</strong> في التضمين - وهو مثالي للمستندات الطويلة والمعقدة حيث يكون السياق أكثر أهمية. من خلال تضمين النص بأكمله مقدمًا ثم التقطيع لاحقًا، يمكنك الحصول على</p>
<ul>
<li><p><strong>🔍 دقة استرجاع أكثر وضوحًا</strong></p></li>
<li><p>⚡ <strong>مطالبات LLM بسيطة ومركزة</strong></p></li>
<li><p>🛠️ <strong>التكامل البسيط</strong> مع أي نموذج سياق طويل</p></li>
</ul>
