---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  الجوزاء 3 برو + ميلفوس: بناء نظام RAG أكثر قوة مع استدلال متقدم وقوة متعددة
  الوسائط
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  تعرّف على التحديثات الأساسية في Gemini 3 Pro، وشاهد كيفية أدائه على المعايير
  الرئيسية، واتبع دليلًا لإنشاء خط أنابيب RAG عالي الأداء باستخدام Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>جاء إصدار Gemini 3 Pro من Google بنوع نادر من الإصدار الذي يغيّر توقعات المطورين بشكل حقيقي - ليس مجرد ضجيج، بل قدرات توسع بشكل جوهري ما يمكن أن تفعله واجهات اللغة الطبيعية. إنه يحول "وصف التطبيق الذي تريده" إلى سير عمل قابل للتنفيذ: توجيه ديناميكي للأدوات، وتخطيط متعدد الخطوات، وتنسيق واجهة برمجة التطبيقات، وتوليد تجربة مستخدم تفاعلية يتم دمجها معًا بسلاسة. هذا هو أقرب ما وصل إليه أي نموذج لجعل الترميز الحيوي يبدو قابلاً للإنتاج.</p>
<p>والأرقام تدعم الرواية. ينشر Gemini 3 Pro نتائج متميزة عبر كل معيار رئيسي تقريبًا:</p>
<ul>
<li><p><strong>اختبار الإنسانية الأخير:</strong> 37.5% بدون أدوات، و45.8% مع الأدوات - أقرب منافس له بنسبة 26.5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23.4%، بينما تفشل معظم النماذج في تخطي نسبة 2%.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72.7% دقة 72.7%، أي ضعف أفضل النماذج التالية تقريبًا بنسبة 36.2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> متوسط القيمة الصافية <strong> 5,478.16</strong> دولار، أي حوالي <strong>1.4 ضعف</strong> المركز الثاني.</p></li>
</ul>
<p>راجع الجدول أدناه للاطلاع على المزيد من النتائج القياسية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا المزيج من التفكير العميق، والاستخدام القوي للأدوات، والطلاقة متعددة الوسائط يجعل Gemini 3 Pro مناسبًا بشكل طبيعي للتوليد المعزز للاسترجاع (RAG). قم بإقرانها مع <a href="https://milvus.io/"><strong>Milvus،</strong></a> قاعدة البيانات المتجهة عالية الأداء مفتوحة المصدر مفتوحة المصدر المصممة للبحث الدلالي على نطاق مليار، وستحصل على طبقة استرجاع تؤسس الاستجابات وتتوسع بشكل نظيف وتبقى موثوقة في الإنتاج حتى في ظل أعباء العمل الثقيلة.</p>
<p>في هذا المنشور، سنقوم بتفصيل ما هو جديد في Gemini 3 Pro، ولماذا يرتقي بسير عمل RAG، وكيفية بناء خط أنابيب RAG نظيف وفعال باستخدام Milvus كعمود فقري للاسترجاع.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">ترقيات رئيسية في Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم Gemini 3 Pro مجموعة من التحسينات الجوهرية التي تعيد تشكيل كيفية تعليل النموذج وإنشاء المهام وتنفيذها والتفاعل مع المستخدمين. تنقسم هذه التحسينات إلى أربعة مجالات قدرات رئيسية:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">الفهم والاستدلال متعدد الوسائط</h3><p>يسجل Gemini 3 Pro أرقامًا قياسية جديدة عبر معايير مهمة متعددة الوسائط، بما في ذلك ARC-AGI-2 للفهم البصري وMMMU-Pro للفهم متعدد الوسائط وMMMU-MMMU لفهم الفيديو واكتساب المعرفة. كما يقدم النموذج أيضًا طريقة التفكير العميق، وهي طريقة تفكير موسعة تتيح المعالجة المنطقية المنظمة ومتعددة الخطوات. وينتج عن ذلك دقة أعلى بكثير في المشاكل المعقدة حيث تميل نماذج سلسلة التفكير التقليدية إلى الفشل.</p>
<h3 id="Code-Generation" class="common-anchor-header">توليد الشيفرات البرمجية</h3><p>يأخذ النموذج الترميز التوليدي إلى مستوى جديد. يمكن ل Gemini 3 Pro إنتاج صور SVG تفاعلية وتطبيقات ويب كاملة ومشاهد ثلاثية الأبعاد وحتى ألعاب وظيفية - بما في ذلك البيئات الشبيهة بماين كرافت والبلياردو المستندة إلى المتصفح - كل ذلك من موجه واحد باللغة الطبيعية. يستفيد تطوير الواجهة الأمامية بشكل خاص: يمكن للنموذج إعادة إنشاء تصميمات واجهة المستخدم الحالية بدقة عالية أو ترجمة لقطة شاشة مباشرةً إلى كود جاهز للإنتاج، مما يجعل عمل واجهة المستخدم التكرارية أسرع بشكل كبير.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">وكلاء الذكاء الاصطناعي واستخدام الأدوات</h3><p>بعد الحصول على إذن المستخدم، يمكن لـ Gemini 3 Pro الوصول إلى البيانات من جهاز المستخدم من Google لأداء مهام طويلة المدى ومتعددة الخطوات مثل تخطيط الرحلات أو حجز السيارات المستأجرة. تنعكس قدرة الوكيل هذه في أدائه القوي على <strong>Vending-Bench 2،</strong> وهو معيار مصمم خصيصًا لاختبار ضغط استخدام الأداة على المدى الطويل. يدعم النموذج أيضاً سير عمل الوكيل على مستوى احترافي، بما في ذلك تنفيذ الأوامر الطرفية والتفاعل مع الأدوات الخارجية من خلال واجهات برمجة التطبيقات المحددة جيداً.</p>
<h3 id="Generative-UI" class="common-anchor-header">واجهة المستخدم التوليدية</h3><p>يتخطى Gemini 3 Pro نموذج السؤال الواحد والإجابة الواحدة التقليدي ويقدم <strong>واجهة مستخدم</strong> مولدة، حيث يمكن للنموذج بناء تجارب تفاعلية كاملة بشكل ديناميكي. بدلاً من إرجاع نص ثابت، يمكنه إنشاء واجهات مخصصة بالكامل - على سبيل المثال، مخطط سفر غني وقابل للتعديل - مباشرةً استجابةً لتعليمات المستخدم. يؤدي هذا إلى تحويل LLMs من مستجيبات سلبية إلى مولدات واجهات نشطة.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">وضع Gemini 3 Pro تحت الاختبار<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى النتائج القياسية، أجرينا سلسلة من الاختبارات العملية لفهم كيف يتصرف Gemini 3 Pro في سير العمل الحقيقي. وتسلط النتائج الضوء على كيفية ترجمة تفكيره متعدد الوسائط وقدراته التوليدية وتخطيطه طويل المدى إلى قيمة عملية للمطورين.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">الفهم متعدد الوسائط</h3><p>يُظهر Gemini 3 Pro تنوعًا مثيرًا للإعجاب عبر النصوص والصور والفيديو والرموز البرمجية. في اختبارنا، قمنا بتحميل فيديو زيليز مباشرة من يوتيوب. قام النموذج بمعالجة المقطع بأكمله - بما في ذلك السرد والانتقالات والنص الذي يظهر على الشاشة - في <strong>40 ثانية</strong> تقريبًا، وهو تحول سريع بشكل غير عادي للمحتوى الطويل متعدد الوسائط.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تُظهر تقييمات Google الداخلية سلوكًا مشابهًا: تعامل Gemini 3 Pro مع وصفات مكتوبة بخط اليد بلغات متعددة، وقام بنسخ وترجمة كل واحدة منها، ثم جمعها في كتاب وصفات عائلي قابل للمشاركة.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">المهام الصفرية</h3><p>يمكن ل Gemini 3 Pro إنشاء واجهات مستخدم ويب تفاعلية بالكامل بدون أمثلة أو سقالات مسبقة. عندما طُلب منه إنشاء <strong>لعبة ويب</strong> مصقولة <strong>ثلاثية الأبعاد لسفينة فضاء ثلاثية الأبعاد،</strong> أنتج النموذج مشهدًا تفاعليًا كاملًا: شبكة نيون أرجوانية، وسفن على غرار لعبة السايبربانك، وتأثيرات جسيمات متوهجة، وعناصر تحكم سلسة في الكاميرا - كل ذلك في استجابة واحدة من دون لقطة واحدة.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">تخطيط المهام المعقدة</h3><p>يُظهر النموذج أيضًا تخطيط مهام بعيد المدى أقوى من العديد من أقرانه. في اختبار تنظيم صندوق الوارد الذي أجريناه، تصرف Gemini 3 Pro إلى حد كبير مثل مساعد إداري يعمل بالذكاء الاصطناعي: تصنيف رسائل البريد الإلكتروني الفوضوية إلى مجموعات مشاريع، وصياغة اقتراحات قابلة للتنفيذ (الرد، المتابعة، الأرشفة)، وتقديم ملخص منظم ونظيف. مع وضع خطة النموذج، يمكن مسح صندوق الوارد بأكمله بنقرة تأكيد واحدة.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">كيفية بناء نظام RAG مع Gemini 3 Pro و Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إن المنطق المطور لـ Gemini 3 Pro، والفهم متعدد الوسائط، وقدرات استخدام الأدوات القوية تجعله أساسًا ممتازًا لأنظمة RAG عالية الأداء.</p>
<p>عند إقرانها مع <a href="https://milvus.io/"><strong>Milvus،</strong></a> قاعدة البيانات المتجهة مفتوحة المصدر عالية الأداء والمصممة للبحث الدلالي واسع النطاق، تحصل على تقسيم واضح للمسؤوليات: يتعامل Gemini 3 Pro مع <strong>التفسير والاستدلال والتوليد،</strong> بينما يوفر Milvus <strong>طبقة استرجاع سريعة وقابلة للتطوير</strong> تحافظ على الاستجابات في بيانات مؤسستك. هذا الاقتران مناسب تمامًا للتطبيقات على مستوى الإنتاج مثل قواعد المعرفة الداخلية، ومساعدي المستندات، والمساعدين في المستندات، والمساعدين المساعدين لدعم العملاء، والأنظمة الخبيرة الخاصة بالمجال.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p>قبل إنشاء خط أنابيب RAG الخاص بك، تأكد من تثبيت مكتبات Python الأساسية هذه أو ترقيتها إلى أحدث إصداراتها:</p>
<ul>
<li><p><strong>pymilvus</strong> - مجموعة أدوات تطوير البرمجة الرسمية لميلفوس بايثون</p></li>
<li><p><strong>google-generativeai</strong> - مكتبة عميل Gemini 3 Pro</p></li>
<li><p><strong>طلبات</strong> - للتعامل مع مكالمات HTTP عند الحاجة</p></li>
<li><p><strong>tqdm</strong> - لأشرطة التقدم أثناء استيعاب مجموعة البيانات</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، قم بتسجيل الدخول إلى <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> للحصول على مفتاح API الخاص بك.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">إعداد مجموعة البيانات</h3><p>بالنسبة لهذا البرنامج التعليمي، سنستخدم قسم الأسئلة الشائعة من وثائق Milvus 2.4.x كقاعدة معرفية خاصة لنظام RAG الخاص بنا.</p>
<p>قم بتنزيل أرشيف الوثائق واستخراجه في مجلد باسم <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>قم بتحميل جميع ملفات Markdown من المسار <code translate="no">milvus_docs/en/faq</code>. بالنسبة لكل مستند، نطبق تقسيمًا بسيطًا استنادًا إلى عناوين <code translate="no">#</code> لفصل الأقسام الرئيسية تقريبًا داخل كل ملف Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">إعداد نموذج LLM ونموذج التضمين</h3><p>في هذا البرنامج التعليمي، سنستخدم <code translate="no">gemini-3-pro-preview</code> كنموذج LLM و <code translate="no">text-embedding-004</code> كنموذج التضمين.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>استجابة النموذج: أنا الجوزاء، وهو نموذج لغوي كبير تم إنشاؤه بواسطة Google.</p>
<p>يمكنك إجراء فحص سريع من خلال إنشاء تضمين اختباري وطباعة أبعاده مع القيم القليلة الأولى:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>ناتج متجه الاختبار:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">تحميل البيانات في ميلفوس</h3><p><strong>إنشاء مجموعة</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>عند إنشاء مجموعة <code translate="no">MilvusClient</code> ، يمكنك الاختيار من بين ثلاثة خيارات تكوين، اعتمادًا على نطاقك وبيئتك:</p>
<ul>
<li><p><strong>الوضع المحلي (ميلفوس لايت):</strong> تعيين URI إلى مسار ملف محلي (على سبيل المثال، <code translate="no">./milvus.db</code>). هذه هي أسهل طريقة للبدء - سيقوم <a href="https://milvus.io/docs/milvus_lite.md">ميلفوس لايت</a> بتخزين جميع البيانات تلقائيًا في هذا الملف.</p></li>
<li><p><strong>Milvus المستضاف ذاتيًا (Docker أو Kubernetes):</strong> بالنسبة لمجموعات البيانات الأكبر أو أعباء عمل الإنتاج، قم بتشغيل Milvus على Docker أو Kubernetes. قم بتعيين URI إلى نقطة نهاية خادم Milvus الخاص بك، مثل <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>زيليز كلاود (خدمة ميلفوس المدارة بالكامل):</strong> إذا كنت تفضل حلاً مُداراً، استخدم Zilliz Cloud. قم بتعيين URI إلى نقطة النهاية العامة الخاصة بك وقدم مفتاح واجهة برمجة التطبيقات الخاص بك كرمز المصادقة.</p></li>
</ul>
<p>قبل إنشاء مجموعة جديدة، تحقق أولاً مما إذا كانت موجودة بالفعل. إذا كانت موجودة، قم بإسقاطها وإعادة إنشائها لضمان إعداد نظيف.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>أنشئ مجموعة جديدة بالمعلمات المحددة.</p>
<p>إذا لم يتم توفير أي مخطط، يقوم Milvus تلقائيًا بإنشاء حقل معرف افتراضي كمفتاح أساسي وحقل متجه لتخزين التضمينات. كما يوفر أيضًا حقل ديناميكي JSON محجوز، والذي يلتقط أي حقول إضافية غير محددة في المخطط.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>إدراج البيانات</strong></p>
<p>قم بتكرار كل إدخال نصي، وإنشاء متجه التضمين الخاص به، وإدراج البيانات في ملفوس. في هذا المثال، نقوم بتضمين حقل إضافي يسمى <code translate="no">text</code>. نظرًا لأنه غير محدد مسبقًا في المخطط، يقوم Milvus تلقائيًا بتخزينه باستخدام حقل JSON الديناميكي تحت الغطاء - لا يلزم إعداد إضافي.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>نموذج الإخراج:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">بناء سير عمل RAG</h3><p><strong>استرجاع البيانات ذات الصلة</strong></p>
<p>لاختبار الاسترجاع، نطرح سؤالاً شائعاً حول Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ابحث في المجموعة عن الاستعلام وأرجع أهم 3 نتائج ذات صلة.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>يتم إرجاع النتائج بترتيب التشابه، من الأقرب إلى الأقل تشابهًا.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>توليد استجابة RAG مع LLM</strong></p>
<p>بعد استرجاع المستندات، قم بتحويلها إلى تنسيق سلسلة</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>قم بتزويد LLM بمطالبة النظام ومطالبة المستخدم، وكلاهما تم إنشاؤهما من المستندات المسترجعة من ملفوس.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>استخدم النموذج <code translate="no">gemini-3-pro-preview</code> مع هذه المطالبات لتوليد الاستجابة النهائية.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>من الإخراج، يمكنك أن ترى أن Gemini 3 Pro ينتج إجابة واضحة ومنظمة بشكل جيد بناءً على المعلومات المسترجعة.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظة</strong>: Gemini 3 Pro غير متاح حاليًا لمستخدمي المستوى المجاني. انقر <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">هنا</a> لمزيد من التفاصيل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكنك الوصول إليه من خلال <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a> بدلاً من ذلك:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">شيء آخر: ترميز فيبي مع جوجل ضد الجاذبية<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>إلى جانب Gemini 3 Pro، طرحت Google Google <a href="https://antigravity.google/"><strong>Antigravity،</strong></a> وهي منصة ترميز فيديو تتفاعل بشكل مستقل مع المحرر والمحطة والمتصفح. على عكس الأدوات السابقة المدعومة بالذكاء الاصطناعي التي تعاملت مع التعليمات لمرة واحدة، تعمل Antigravity على مستوى موجه للمهام - مما يسمح للمطورين بتحديد <em>ما</em> يريدون بناءه بينما يدير النظام <em>الكيفية،</em> وينظم سير العمل الكامل من البداية إلى النهاية.</p>
<p>عادةً ما تُنشئ عمليات سير عمل ترميز الذكاء الاصطناعي التقليدية مقتطفات معزولة لا يزال يتعين على المطورين مراجعتها ودمجها وتصحيحها وتشغيلها يدوياً. يغير Antigravity هذه الديناميكية. يمكنك ببساطة وصف مهمة ما - على سبيل المثال، <em>"إنشاء لعبة تفاعل بسيطة بين الحيوانات الأليفة</em> " - وسيقوم النظام بتحليل الطلب، وإنشاء التعليمات البرمجية، وتنفيذ الأوامر الطرفية، وفتح متصفح لاختبار النتيجة، والتكرار حتى تعمل. إنه يرتقي بالذكاء الاصطناعي من محرك الإكمال التلقائي السلبي إلى شريك هندسي نشط - شريك يتعلم تفضيلاتك ويتكيف مع أسلوبك الشخصي في التطوير مع مرور الوقت.</p>
<p>وبالنظر إلى المستقبل، فإن فكرة تنسيق الوكيل مباشرةً مع قاعدة البيانات ليست بعيدة المنال. فمن خلال استدعاء الأدوات عبر MCP، يمكن للذكاء الاصطناعي في نهاية المطاف أن يقرأ من قاعدة بيانات Milvus، ويجمع قاعدة معرفية، بل ويحافظ على خط أنابيب الاسترجاع الخاص به بشكل مستقل. من نواحٍ عديدة، يعد هذا التحول أكثر أهمية من ترقية النموذج نفسه: بمجرد أن يتمكن الذكاء الاصطناعي من أخذ وصف على مستوى المنتج وتحويله إلى سلسلة من المهام القابلة للتنفيذ، يتحول الجهد البشري بشكل طبيعي نحو تحديد الأهداف والقيود وما يبدو عليه "الصواب" - التفكير على المستوى الأعلى الذي يقود حقًا تطوير المنتج.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">هل أنت جاهز للبناء؟<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت مستعدًا لتجربته، فاتبع برنامجنا التعليمي خطوة بخطوة وقم ببناء نظام RAG باستخدام <strong>Gemini 3 Pro + Milvus</strong> اليوم.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
