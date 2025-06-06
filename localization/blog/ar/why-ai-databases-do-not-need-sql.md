---
id: why-ai-databases-do-not-need-sql.md
title: لماذا لا تحتاج قواعد بيانات الذكاء الاصطناعي إلى SQL
author: James Luan
date: 2025-05-30T00:00:00.000Z
cover: assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, SQL, AI Agents, LLM'
meta_keywords: 'SQL, AI Databases, vector databases, AI Agents'
meta_title: |
  Why AI Databases Don't Need SQL
desc: >-
  وسواء أعجبك ذلك أم لا، إليك الحقيقة، وهي أن SQL مقدر لها أن تتراجع في عصر
  الذكاء الاصطناعي.
origin: 'https://milvus.io/blog/why-ai-databases-do-not-need-sql.md'
---
<p>لعقود، كان <code translate="no">SELECT * FROM WHERE</code> هو القاعدة الذهبية لاستعلامات قواعد البيانات. سواء لأنظمة إعداد التقارير أو التحليل المالي أو استعلامات سلوك المستخدم، فقد اعتدنا على استخدام لغة منظمة لمعالجة البيانات بدقة. حتى أن NoSQL، التي أعلنت ذات مرة عن "ثورة مضادة لـ SQL"، استسلمت في النهاية وقدمت دعم SQL، معترفةً بمكانتها التي لا يمكن الاستغناء عنها على ما يبدو.</p>
<p><em>ولكن هل تساءلت يومًا ما: لقد أمضينا أكثر من 50 عامًا في تعليم الحواسيب التحدث بلغة البشر، فلماذا ما زلنا نجبر البشر على التحدث بلغة &quot;الكمبيوتر&quot;؟</em></p>
<p><strong>سواءً أعجبك ذلك أم لا، إليك الحقيقة: إن SQL مقدر لها أن تتراجع في عصر الذكاء الاصطناعي.</strong> ربما لا تزال تُستخدم في الأنظمة القديمة، ولكنها أصبحت غير ملائمة بشكل متزايد لتطبيقات الذكاء الاصطناعي الحديثة. إن ثورة الذكاء الاصطناعي لا تغير فقط كيفية بناء البرمجيات - بل إنها تجعل SQL عفا عليها الزمن، ومعظم المطورين مشغولون للغاية في تحسين عمليات الربط الخاصة بهم بحيث لا يلاحظون ذلك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Natural-Language-The-New-Interface-for-AI-Databases" class="common-anchor-header">اللغة الطبيعية: الواجهة الجديدة لقواعد بيانات الذكاء الاصطناعي<button data-href="#Natural-Language-The-New-Interface-for-AI-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>إن مستقبل التفاعل مع قواعد البيانات لا يتعلق بتعلم لغة SQL أفضل - بل يتعلق <strong>بالتخلي عن بناء الجملة بالكامل</strong>.</p>
<p>بدلاً من المصارعة مع استعلامات SQL المعقدة، تخيل ببساطة أن تقول</p>
<p><em>"ساعدني في العثور على المستخدمين الذين يتشابه سلوكهم الشرائي الأخير مع أفضل عملائنا في الربع الأخير."</em></p>
<p>يفهم النظام نيتك ويقرر تلقائيًا:</p>
<ul>
<li><p>هل يجب عليه الاستعلام عن الجداول المهيكلة أو إجراء بحث عن التشابه المتجه عبر تضمينات المستخدم؟</p></li>
<li><p>هل يجب أن يستدعي واجهات برمجة التطبيقات الخارجية لإثراء البيانات؟</p></li>
<li><p>كيف يجب أن يقوم بترتيب النتائج وتصفيتها؟</p></li>
</ul>
<p>كل ذلك يكتمل تلقائيًا. بدون بناء جملة. لا تصحيح أخطاء. لا يوجد بحث في Stack Overflow عن "كيفية عمل دالة نافذة مع CTEs متعددة." أنت لم تعد &quot;مبرمج&quot; قاعدة بيانات - أنت تجري محادثة مع نظام بيانات ذكي.</p>
<p>هذا ليس خيالًا علميًا. وفقًا لتوقعات مؤسسة Gartner، بحلول عام 2026، ستعطي معظم الشركات الأولوية للغة الطبيعية كواجهة استعلام أساسية، مع تحول SQL من مهارة "ضرورية" إلى مهارة "اختيارية".</p>
<p>هذا التحول يحدث بالفعل:</p>
<p><strong>✅ انعدام الحواجز النحوية:</strong> تصبح أسماء الحقول، وعلاقات الجداول، وتحسين الاستعلام مشكلة النظام، وليس مشكلتك أنت</p>
<p>✅<strong>بيانات غير مهيكلة سهلة الاستخدام:</strong> تصبح الصور والصوت والنصوص كائنات استعلام من الدرجة الأولى</p>
<p><strong>✅ وصول ديمقراطي:</strong> يمكن لفرق العمليات ومديري المنتجات والمحللين الاستعلام مباشرةً عن البيانات بنفس سهولة استعلام كبير المهندسين لديك</p>
<h2 id="Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="common-anchor-header">اللغة الطبيعية هي مجرد السطح؛ وكلاء الذكاء الاصطناعي هم العقل الحقيقي<button data-href="#Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="anchor-icon" translate="no">
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
    </button></h2><p>استعلامات اللغة الطبيعية هي مجرد غيض من فيض. فالإنجاز الحقيقي هو <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">وكلاء الذكاء الاصطناعي</a> الذين يمكنهم الاستعلام عن البيانات كما يفعل البشر.</p>
<p>فهم الكلام البشري هو الخطوة الأولى. فهم ما تريده وتنفيذه بكفاءة - هنا يحدث السحر.</p>
<p>يعمل وكلاء الذكاء الاصطناعي بمثابة "دماغ" قاعدة البيانات، ويتعاملون مع</p>
<ul>
<li><p><strong>🤔 فهم النوايا:</strong> تحديد الحقول وقواعد البيانات والفهارس التي تحتاجها بالفعل</p></li>
<li><p><strong>⚙️ اختيار الاستراتيجية:</strong> الاختيار بين التصفية المنظمة أو التشابه المتجه أو النهج الهجين</p></li>
<li><p><strong>📦 تنسيق القدرات:</strong> تنفيذ واجهات برمجة التطبيقات، وتشغيل الخدمات، وتنسيق الاستعلامات عبر الأنظمة</p></li>
<li><p><strong>التنسيق الذكي:</strong> إرجاع النتائج التي يمكنك فهمها والتصرف بناءً عليها على الفور</p></li>
</ul>
<p>إليك ما يبدو عليه هذا عملياً. في <a href="https://milvus.io/">قاعدة بيانات Milvus vector،</a> يصبح البحث عن تشابه معقد أمرًا بسيطًا:</p>
<pre><code translate="no">results = collection.search(query_vector, top_k=<span class="hljs-number">10</span>, <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;is_active == true&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>سطر واحد. لا توجد عمليات ربط. لا استعلامات فرعية. لا يوجد ضبط للأداء.</strong> تتعامل <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة البيانات</a> المتجهة مع التشابه الدلالي بينما تتعامل المرشحات التقليدية مع التطابقات التامة. إنه أسرع وأبسط ويفهم بالفعل ما تريده.</p>
<p>يتكامل نهج "واجهة برمجة التطبيقات أولاً" هذا بشكل طبيعي مع قدرات <a href="https://zilliz.com/blog/function-calling-vs-mcp-vs-a2a-developers-guide-to-ai-agent-protocols">استدعاء الوظائف</a> في النماذج اللغوية الكبيرة - تنفيذ أسرع، وأخطاء أقل، وتكامل أسهل.</p>
<h2 id="Why-SQL-Falls-Apart-in-the-AI-Era" class="common-anchor-header">لماذا تنهار SQL في عصر الذكاء الاصطناعي<button data-href="#Why-SQL-Falls-Apart-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم SQL لعالم منظم. ومع ذلك، سوف تهيمن البيانات غير المهيكلة والفهم الدلالي والاسترجاع الذكي على المستقبل الذي يحركه الذكاء الاصطناعي - كل ما لم يتم تصميم SQL للتعامل معه.</p>
<p>فالتطبيقات الحديثة مغمورة بالبيانات غير المهيكلة، بما في ذلك تضمينات النصوص من نماذج اللغة، ومتجهات الصور من أنظمة الرؤية الحاسوبية، وبصمات الصوت من التعرف على الكلام، والتمثيلات متعددة الوسائط التي تجمع بين النصوص والصور والبيانات الوصفية.</p>
<p>هذه البيانات لا تتناسب بدقة مع الصفوف والأعمدة - فهي موجودة كتضمينات متجهة في فضاء دلالي عالي الأبعاد، وليس لدى SQL أي فكرة عما يجب فعله بها.</p>
<h3 id="SQL-+-Vector-A-Beautiful-Idea-That-Executes-Poorly" class="common-anchor-header">SQL + متجه: فكرة جميلة تنفذ بشكل سيء</h3><p>في محاولة يائسة للبقاء على صلة بالموضوع، تقوم قواعد البيانات التقليدية بإضافة قدرات المتجهات إلى SQL. أضافت PostgreSQL المشغل <code translate="no">&lt;-&gt;</code> للبحث عن تشابه المتجهات:</p>
<pre><code translate="no">SELECT *
  FROM items
 ORDER BY embedding &lt;-&gt; query_vector
 LIMIT 10;
<button class="copy-code-btn"></button></code></pre>
<p>يبدو هذا ذكيًا، لكنه معيب بشكل أساسي. أنت تفرض عمليات المتجهات من خلال محللي SQL، ومحسنات الاستعلام، وأنظمة المعاملات المصممة لنموذج بيانات مختلف تمامًا.</p>
<p>عقوبة الأداء قاسية:</p>
<p>📊 <strong>بيانات قياسية حقيقية</strong>: في ظل ظروف مماثلة، يوفر برنامج Milvus المصمم خصيصًا لهذا الغرض زمن استجابة أقل بنسبة 60% وإنتاجية أعلى بـ 4.5 أضعاف مقارنةً بـ PostgreSQL مع pgvector.</p>
<p>لماذا هذا الأداء الضعيف؟ قواعد البيانات التقليدية تنشئ مسارات تنفيذ معقدة غير ضرورية:</p>
<ul>
<li><p><strong>عبء المُحلِّل</strong>: يتم فرض استعلامات المتجهات من خلال التحقق من صحة بناء جملة SQL</p></li>
<li><p><strong>ارتباك المُحسِّن</strong>: يعاني مخططو الاستعلامات المحسّنون للوصلات العلائقية من صعوبات في عمليات البحث عن التشابه</p></li>
<li><p><strong>عدم كفاءة التخزين</strong>: تتطلب المتجهات المخزنة كملفات BLOB ترميز/فك ترميز ثابت</p></li>
<li><p><strong>عدم تطابق الفهرس</strong>: الشجرات B-شجرة B وهياكل LSM خاطئة تمامًا للبحث عن التشابه عالي الأبعاد</p></li>
</ul>
<h3 id="Relational-vs-AIVector-Databases-Fundamentally-Different-Philosophies" class="common-anchor-header">قواعد البيانات العلائقية مقابل قواعد بيانات الذكاء الاصطناعي/المتجهات: فلسفات مختلفة جوهرياً</h3><p>عدم التوافق أعمق من الأداء. هذه مقاربات مختلفة تمامًا للبيانات:</p>
<table>
<thead>
<tr><th><strong>الجانب</strong></th><th><strong>قواعد بيانات SQL/قواعد البيانات العلائقية</strong></th><th><strong>قواعد بيانات المتجهات/الذكاء الاصطناعي</strong></th></tr>
</thead>
<tbody>
<tr><td>نموذج البيانات</td><td>حقول منظمة (أرقام وسلاسل) في صفوف وأعمدة</td><td>تمثيلات متجهة عالية الأبعاد للبيانات غير المهيكلة (نصوص، صور، صوت، نصوص، صور)</td></tr>
<tr><td>منطق الاستعلام</td><td>المطابقة التامة + العمليات المنطقية</td><td>مطابقة التشابه + بحث دلالي</td></tr>
<tr><td>الواجهة</td><td>SQL</td><td>لغة طبيعية + واجهات برمجة تطبيقات بايثون</td></tr>
<tr><td>الفلسفة</td><td>توافق ACID، اتساق مثالي</td><td>الاستدعاء الأمثل، والملاءمة الدلالية، والأداء في الوقت الحقيقي</td></tr>
<tr><td>استراتيجية الفهرس</td><td>أشجار B+، وفهارس التجزئة إلخ.</td><td>HNSW، IVF، تكميم المنتجات، إلخ.</td></tr>
<tr><td>حالات الاستخدام الأساسية</td><td>المعاملات، وإعداد التقارير، والتحليلات</td><td>البحث الدلالي، البحث متعدد الوسائط، التوصيات، أنظمة RAG، وكلاء الذكاء الاصطناعي</td></tr>
</tbody>
</table>
<p>إن محاولة جعل SQL تعمل في عمليات المتجهات يشبه استخدام مفك البراغي كمطرقة - ليس مستحيلاً من الناحية الفنية، ولكنك تستخدم الأداة الخاطئة للمهمة.</p>
<h2 id="Vector-Databases-Purpose-Built-for-AI" class="common-anchor-header">قواعد البيانات المتجهة: مصممة خصيصاً للذكاء الاصطناعي<button data-href="#Vector-Databases-Purpose-Built-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>قواعد البيانات المتجهة مثل <a href="https://milvus.io/">Milvus</a> و <a href="https://zilliz.com/">Zilliz Cloud</a> ليست &quot;قواعد بيانات SQL بميزات متجهة&quot; - إنها أنظمة بيانات ذكية مصممة من الألف إلى الياء لتطبيقات الذكاء الاصطناعي الأصلية.</p>
<h3 id="1-Native-Multimodal-Support" class="common-anchor-header">1. دعم أصلي متعدد الوسائط</h3><p>لا تقوم تطبيقات الذكاء الاصطناعي الحقيقية بتخزين النصوص فقط - فهي تعمل مع الصور والصوت والفيديو والمستندات المتداخلة المعقدة. تتعامل قواعد البيانات المتجهة مع أنواع البيانات المتنوعة والهياكل متعددة النواقل مثل <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search">ColBERT</a> و <a href="https://zilliz.com/blog/colpali-milvus-redefine-document-retrieval-with-vision-language-models">ColPALI،</a> وتتكيف مع التمثيلات الدلالية الغنية من نماذج الذكاء الاصطناعي المختلفة.</p>
<h3 id="2-Agent-Friendly-Architecture" class="common-anchor-header">2. بنية صديقة للوكيل</h3><p>تتفوق النماذج اللغوية الكبيرة في استدعاء الدوال، وليس توليد SQL. توفر قواعد البيانات المتجهة واجهات برمجة تطبيقات بايثون الأولى التي تتكامل بسلاسة مع وكلاء الذكاء الاصطناعي، مما يتيح إتمام العمليات المعقدة، مثل استرجاع المتجهات، والتصفية، وإعادة الترتيب، والتمييز الدلالي، وكل ذلك ضمن استدعاء دالة واحدة، دون الحاجة إلى طبقة ترجمة لغة الاستعلام.</p>
<h3 id="3-Semantic-Intelligence-Built-In" class="common-anchor-header">3. ذكاء دلالي مدمج</h3><p>لا تقوم قواعد البيانات المتجهة بتنفيذ الأوامر فقط - فهي<strong>تفهم القصد.</strong> من خلال العمل مع وكلاء الذكاء الاصطناعي وتطبيقات الذكاء الاصطناعي الأخرى، فإنها تتحرر من المطابقة الحرفية للكلمات الرئيسية لتحقيق الاسترجاع الدلالي الحقيقي. فهي لا تعرف فقط "كيفية الاستعلام" ولكن "ما تريد العثور عليه حقًا".</p>
<h3 id="4-Optimized-for-Relevance-Not-Just-Speed" class="common-anchor-header">4. مُحسّنة للملاءمة، وليس فقط السرعة</h3><p>مثل النماذج اللغوية الكبيرة، تحقق قواعد البيانات المتجهة توازنًا بين الأداء والاسترجاع. ومن خلال تصفية البيانات الوصفية للبيانات الوصفية <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">والبحث الهجين عن المتجهات والنص الكامل</a> وخوارزميات إعادة ترتيب النصوص، فإنها تعمل باستمرار على تحسين جودة النتائج وملاءمتها، وإيجاد محتوى ذي قيمة فعلية، وليس فقط سريع الاسترجاع.</p>
<h2 id="The-Future-of-Databases-is-Conversational" class="common-anchor-header">مستقبل قواعد البيانات هو مستقبل المحادثة<button data-href="#The-Future-of-Databases-is-Conversational" class="anchor-icon" translate="no">
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
    </button></h2><p>تمثل قواعد البيانات المتجهة تحولًا جوهريًا في كيفية تفكيرنا في التفاعل مع البيانات. فهي لا تحل محل قواعد البيانات العلائقية - فهي مصممة خصيصًا لأعباء عمل الذكاء الاصطناعي وتعالج مشاكل مختلفة تمامًا في عالم الذكاء الاصطناعي أولاً.</p>
<p>وكما أن النماذج اللغوية الكبيرة لم تقم بترقية محركات القواعد التقليدية ولكنها أعادت تعريف التفاعل بين الإنسان والآلة بالكامل، فإن قواعد البيانات المتجهة تعيد تعريف كيفية العثور على المعلومات والعمل معها.</p>
<p>نحن ننتقل من "لغات مكتوبة لتقرأها الآلات" إلى "أنظمة تفهم مقاصد الإنسان". تتطور قواعد البيانات من منفذي استعلامات جامدة إلى وكلاء بيانات أذكياء يفهمون السياق ويكشفون الرؤى بشكل استباقي.</p>
<p>لا يرغب المطورون الذين يبنون تطبيقات الذكاء الاصطناعي اليوم في كتابة SQL - بل يريدون وصف ما يحتاجون إليه والسماح للأنظمة الذكية بمعرفة كيفية الحصول عليه.</p>
<p>لذا في المرة القادمة التي تحتاج فيها إلى العثور على شيء ما في بياناتك، جرّب نهجًا مختلفًا. لا تكتب استعلامًا - فقط قل ما تبحث عنه. قد تفاجئك قاعدة بياناتك بفهم ما تقصده بالفعل.</p>
<p><em>وإذا لم تفعل؟ ربما حان الوقت لترقية قاعدة بياناتك وليس مهاراتك في SQL.</em></p>
