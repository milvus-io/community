---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  هل سيؤدي تضمين الجوزاء 2 إلى قتل البحث متعدد المتجهات في قواعد بيانات
  المتجهات؟
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  تضمين Gemini 2 من Google يدمج النص والصور والفيديو والصوت في متجه واحد. هل
  سيؤدي ذلك إلى إلغاء البحث متعدد المتجهات؟ لا، وإليك السبب.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>أصدرت Google إصدار <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a> - أول نموذج تضمين متعدد الوسائط يقوم بتعيين النصوص والصور والفيديو والصوت والمستندات في مساحة متجهية واحدة.</p>
<p>يمكنك تضمين مقطع فيديو، وصورة منتج، وفقرة نصية بمكالمة واحدة من واجهة برمجة التطبيقات، وستقع جميعها في نفس الحي الدلالي.</p>
<p>قبل نماذج كهذه، كان عليك قبل ذلك تشغيل كل طريقة من خلال نموذج متخصص خاص بها، ثم تخزين كل مخرج في عمود متجه منفصل. صُممت الأعمدة متعددة المتجهات في قواعد البيانات المتجهة مثل <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> خصيصًا لمثل هذه السيناريوهات.</p>
<p>مع تضمين Gemini Embedding 2 لتعيين طرائق متعددة في نفس الوقت، يبرز سؤال: ما مقدار الأعمدة متعددة المتجهات التي يمكن أن تحل محل Gemini Embedding 2، وأين تقصر؟ يشرح هذا المنشور أين يناسب كل نهج وكيف يعملان معًا.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">ما هو المختلف في Gemini Embedding 2 عند مقارنته بـ CLIP / CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم نماذج التضمين بتحويل البيانات غير المنظمة إلى متجهات كثيفة بحيث تتجمع العناصر المتشابهة دلاليًا معًا في مساحة المتجهات. ما يجعل تضمين Gemini Embedding 2 مختلفًا هو أنه يقوم بذلك أصلاً عبر الطرائق، بدون نماذج منفصلة ولا خطوط أنابيب للتجميع.</p>
<p>حتى الآن، كان التضمين متعدد الوسائط يعني نماذج ثنائية التضمين مدربة على التعلم المتباين: <a href="https://openai.com/index/clip/">CLIP</a> للنص-الصورة و <a href="https://arxiv.org/abs/2211.06687">CLAP</a> للنص-الصوتي، كل منهما يتعامل مع طريقتين فقط. إذا كنت بحاجة إلى النماذج الثلاثة، يمكنك تشغيل نماذج متعددة وتنسيق مساحات التضمين الخاصة بها بنفسك.</p>
<p>على سبيل المثال، كانت فهرسة بودكاست مع غلاف فني يعني تشغيل CLIP للصورة، و CLAP للصوت، وترميز النص للنص - ثلاثة نماذج، وثلاثة مساحات متجهة، ومنطق دمج مخصص لجعل نتائجها قابلة للمقارنة في وقت الاستعلام.</p>
<p>في المقابل، وفقًا <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">لإعلان Google الرسمي،</a> إليك ما يدعمه Gemini Embedding 2:</p>
<ul>
<li><strong>نص</strong> يصل إلى 8,192 رمزًا لكل طلب</li>
<li><strong>صور</strong> حتى 6<strong>صور</strong> لكل طلب (PNG، JPEG)</li>
<li><strong>فيديو</strong> حتى 120 ثانية (MP4، MOV)</li>
<li><strong>صوت</strong> يصل إلى 80 ثانية، مضمن أصلاً بدون نسخ ASR</li>
<li>إدخال<strong>مستندات</strong> PDF، حتى 6 صفحات</li>
</ul>
<p>صورة<strong>الإدخال المختلطة</strong> + النص معًا في مكالمة تضمين واحدة</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">تضمين Gemini Embedding 2 مقابل CLIP/CLAP نموذج واحد مقابل العديد من التضمينات متعددة الوسائط</h3><table>
<thead>
<tr><th></th><th><strong>المُبرمج المزدوج (CLIP، CLAP)</strong></th><th><strong>تضمين الجوزاء 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>الطرائق لكل نموذج</strong></td><td>2 (على سبيل المثال، صورة + نص)</td><td>5 (نص، صورة، صورة، فيديو، صوت، PDF)</td></tr>
<tr><td><strong>إضافة نموذج جديد</strong></td><td>يمكنك إحضار نموذج آخر ومحاذاة المساحات يدويًا</td><td>مضمنة بالفعل - مكالمة واجهة برمجة تطبيقات واحدة</td></tr>
<tr><td><strong>إدخال عبر الوسائط</strong></td><td>مشفرات منفصلة، مكالمات منفصلة</td><td>الإدخال المتداخل (على سبيل المثال، صورة + نص في طلب واحد)</td></tr>
<tr><td><strong>البنية</strong></td><td>برامج تشفير منفصلة للرؤية والنص متوائمة عبر فقدان التباين</td><td>نموذج واحد يرث الفهم متعدد الوسائط من Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">ميزة تضمين الجوزاء 2: تبسيط خط الأنابيب<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>خذ سيناريو شائع: بناء محرك بحث دلالي على مكتبة فيديو قصيرة. يحتوي كل مقطع على إطارات مرئية وصوت منطوق ونص ترجمة - وكلها تصف نفس المحتوى.</p>
<p><strong>قبل تضمين Gemini Embedding 2،</strong> كنت ستحتاج إلى ثلاثة نماذج تضمين منفصلة (صورة، صوت، نص)، وثلاثة أعمدة متجهة، وخط أنابيب استرجاع يقوم باستدعاء متعدد الاتجاهات، ودمج النتائج، وإلغاء التكرار. هذا كثير من الأجزاء المتحركة التي يجب إنشاؤها وصيانتها.</p>
<p><strong>الآن،</strong> يمكنك تغذية إطارات الفيديو والصوت والعناوين الفرعية في مكالمة واجهة برمجة تطبيقات واحدة والحصول على متجه واحد موحد يلتقط الصورة الدلالية الكاملة.</p>
<p>بطبيعة الحال، من المغري أن نستنتج أن الأعمدة متعددة المتجهات قد ماتت. لكن هذا الاستنتاج يخلط بين "التمثيل الموحد متعدد الوسائط" و"استرجاع المتجهات متعددة الأبعاد". فهما يحلان مشاكل مختلفة، وفهم الفرق مهم لاختيار النهج الصحيح.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">ما هو البحث متعدد المتجهات في ميلفوس؟<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>في <a href="http://milvus.io">Milvus،</a> البحث متعدد المتجهات يعني البحث في نفس العنصر من خلال حقول متجهات متعددة في وقت واحد ثم دمج تلك النتائج مع إعادة الترتيب.</p>
<p>الفكرة الأساسية: غالبًا ما يحمل العنصر الواحد أكثر من نوع واحد من المعاني. فالمنتج له عنوان <em>ووصف</em>. منشور على وسائل التواصل الاجتماعي له تعليق <em>وصورة</em>. كل زاوية تخبرك بشيء مختلف، لذلك يحصل كل منها على حقل متجه خاص به.</p>
<p>يبحث Milvus في كل حقل متجه بشكل مستقل، ثم يدمج المجموعات المرشحة باستخدام أداة إعادة ترتيب. في واجهة برمجة التطبيقات، يعيِّن كل طلب حقلًا مختلفًا وتكوين بحث مختلف، ويعيد hybrid_search() النتيجة المدمجة.</p>
<p>يعتمد نمطين شائعين على هذا:</p>
<ul>
<li><strong>بحث متناثر + بحث متجه كثيف.</strong> لديك كتالوج منتجات حيث يكتب المستخدمون استعلامات مثل "أحمر نايك إير ماكس مقاس 10". تلتقط المتجهات الكثيفة القصد الدلالي ("حذاء جري، أحمر، نايكي")، ولكن يفوتها الحجم الدقيق. أما المتجهات المتفرقة عبر <a href="https://milvus.io/docs/full-text-search.md">BM25</a> أو نماذج مثل <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> فتتطابق مع الكلمات الرئيسية. أنت بحاجة إلى تشغيل كليهما بالتوازي، ثم إعادة تصنيفهما - لأن أياً منهما لا يُرجع بمفرده نتائج جيدة للاستعلامات التي تمزج بين اللغة الطبيعية ومعرّفات محددة مثل وحدات التخزين المخزنية أو أسماء الملفات أو رموز الأخطاء.</li>
<li><strong>بحث متجه متعدد الوسائط.</strong> يقوم المستخدم بتحميل صورة فستان ويكتب "شيء مثل هذا ولكن باللون الأزرق". تقوم بالبحث في عمود تضمين الصورة للتشابه البصري وعمود تضمين النص لقيد اللون في وقت واحد. يحتوي كل عمود على فهرس ونموذج خاص به - <a href="https://openai.com/index/clip/">CLIP</a> للصورة، ومشفّر النص للوصف - ويتم دمج النتائج.</li>
</ul>
<p>يقوم<a href="https://milvus.io/">Milvus</a> بتشغيل كلا النموذجين <a href="https://milvus.io/docs/multi-vector-search.md">كعمليات بحث ANN</a> متوازية مع إعادة ترتيب أصلي عبر RRFRanker. يتم التعامل مع تعريف المخطط، وتكوين الفهارس المتعددة، و BM25 المدمج في نظام واحد.</p>
<p>على سبيل المثال، ضع في اعتبارك كتالوج منتج حيث يتضمن كل عنصر وصفًا نصيًا وصورة. يمكنك إجراء ثلاث عمليات بحث مقابل تلك البيانات بالتوازي:</p>
<ul>
<li><strong>البحث النصي الدلالي.</strong> الاستعلام عن الوصف النصي باستخدام متجهات كثيفة تم إنشاؤها بواسطة نماذج مثل <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a> أو <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> أو واجهة برمجة تطبيقات <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> المضمنة.</li>
<li><strong>البحث في النص الكامل.</strong> الاستعلام عن الوصف النصي باستخدام متجهات متناثرة باستخدام <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> أو نماذج التضمين المتناثرة مثل <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> أو <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>البحث عن الصور عبر النماذج.</strong> الاستعلام عن صور المنتج باستخدام استعلام نصي باستخدام متجهات كثيفة من نموذج مثل <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">مع Gemini Embedding 2، هل سيظل البحث متعدد المتجهات مهمًا؟<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>يعالج Gemini Embedding 2 المزيد من الطرائق في مكالمة واحدة، مما يبسط خطوط الأنابيب إلى حد كبير. لكن التضمين الموحد متعدد الوسائط ليس هو نفس الشيء مثل الاسترجاع متعدد النواقل. بمعنى آخر، نعم، سيظل البحث متعدد النواقل مهمًا.</p>
<p>يقوم Gemini Embedding 2 بتعيين النصوص والصور والفيديو والصوت والمستندات في مساحة متجهية واحدة مشتركة. <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">تضعه</a> Google للبحث الدلالي متعدد الوسائط، واسترجاع المستندات، والتوصية - وهي سيناريوهات تصف فيها جميع الوسائط نفس المحتوى ويجعل التداخل العالي بين الوسائط متجهًا واحدًا قابلاً للتطبيق.</p>
<p>يحل بحث<a href="https://milvus.io/docs/multi-vector-search.md">ميلفوس</a> متعدد المتجهات مشكلة مختلفة. إنها طريقة للبحث في نفس الكائن من خلال <strong>حقول متجهات متعددة -</strong>على سبيل المثال، العنوان بالإضافة إلى الوصف، أو النص بالإضافة إلى الصورة - ثم دمج هذه الإشارات أثناء الاسترجاع. بمعنى آخر، يتعلق الأمر بالحفاظ على <strong>وجهات نظر دلالية متعددة</strong> لنفس العنصر والاستعلام عنها، وليس مجرد ضغط كل شيء في تمثيل واحد.</p>
<p>ولكن نادراً ما تتناسب بيانات العالم الحقيقي مع تضمين واحد. تعتمد أنظمة القياسات الحيوية، واسترجاع الأدوات العميلية، والتجارة الإلكترونية ذات النوايا المختلطة على متجهات تعيش في مساحات دلالية مختلفة تمامًا. وهذا بالضبط هو المكان الذي يتوقف فيه التضمين الموحد عن العمل.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">لماذا لا يكفي التضمين الواحد: استرجاع متعدد المتجهات في الممارسة العملية</h3><p>يعالج تضمين الجوزاء 2 الحالة التي تصف فيها جميع الطرائق نفس الشيء. يعالج البحث متعدد النواقل كل شيء آخر - و"كل شيء آخر" يغطي معظم أنظمة الاسترجاع الإنتاجية.</p>
<p><strong>القياسات الحيوية.</strong> لدى المستخدم الواحد متجهات الوجه وبصمة الصوت وبصمة الإصبع وقزحية العين. تصف هذه السمات البيولوجية المستقلة تمامًا مع عدم وجود أي تداخل دلالي. لا يمكنك دمجها في متجه واحد - كل منها يحتاج إلى عمود وفهرس ومقياس تشابه خاص به.</p>
<p><strong>الأدوات العميلة.</strong> يقوم مساعد الترميز مثل OpenClaw بتخزين متجهات دلالية كثيفة لتاريخ المحادثة ("مشكلة النشر تلك من الأسبوع الماضي") إلى جانب متجهات BM25 المتفرقة للمطابقة الدقيقة لأسماء الملفات وأوامر CLI ومعلمات التكوين. أهداف استرجاع مختلفة، وأنواع متجهات مختلفة، ومسارات بحث مستقلة، ثم إعادة ترتيبها.</p>
<p><strong>التجارة الإلكترونية ذات الأهداف المختلطة.</strong> يعمل الفيديو الترويجي للمنتج والصور التفصيلية بشكل جيد في تضمين Gemini الموحد. ولكن عندما يريد المستخدم "فساتين تشبه هذه" <em>و</em> "نفس القماش، مقاس M"، فأنت بحاجة إلى عمود تشابه بصري وعمود سمات منظم مع فهارس منفصلة وطبقة استرجاع مختلطة.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">متى تستخدم تضمين الجوزاء 2 مقابل الأعمدة متعددة المتجهات<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>السيناريو</strong></th><th><strong>ماذا تستخدم</strong></th><th><strong>لماذا</strong></th></tr>
</thead>
<tbody>
<tr><td>تصف جميع الطرائق نفس المحتوى (إطارات الفيديو + الصوت + الترجمة)</td><td>تضمين الجوزاء 2 المتجه الموحد</td><td>يعني التداخل الدلالي العالي أن متجهًا واحدًا يلتقط الصورة الكاملة - لا حاجة إلى الدمج</td></tr>
<tr><td>تحتاج إلى دقة الكلمات الرئيسية إلى جانب الاستدعاء الدلالي (BM25 + كثيف)</td><td>أعمدة متعددة المتجهات باستخدام hybrid_search()</td><td>تخدم المتجهات المتفرقة والكثيفة أهداف استرجاع مختلفة لا يمكن دمجها في تضمين واحد</td></tr>
<tr><td>البحث متعدد الوسائط هو حالة الاستخدام الأساسية (استعلام نصي → نتائج الصور)</td><td>تضمين الجوزاء 2 المتجه الموحد</td><td>مساحة مشتركة واحدة تجعل التشابه عبر الوسائط أصليًا</td></tr>
<tr><td>المتجهات تعيش في فضاءات دلالية مختلفة جوهرياً (القياسات الحيوية، السمات المنظمة)</td><td>أعمدة متعددة المتجهات مع فهارس لكل حقل</td><td>مقاييس تشابه مستقلة وأنواع فهارس مستقلة لكل حقل متجه</td></tr>
<tr><td>تريد بساطة خط الأنابيب <em>واسترجاع</em> دقيق التفاصيل</td><td>كلاهما - متجه الجوزاء الموحد + أعمدة متناثرة أو أعمدة سمات إضافية في نفس المجموعة</td><td>يتعامل Gemini مع العمود متعدد الوسائط؛ بينما يتعامل Milvus مع طبقة الاسترجاع الهجينة حوله</td></tr>
</tbody>
</table>
<p>هذان الأسلوبان لا يستبعد أحدهما الآخر. يمكنك استخدام تضمين Gemini Embedding 2 للعمود متعدد الوسائط الموحد مع الاستمرار في تخزين متجهات إضافية متفرقة أو سمة خاصة في أعمدة منفصلة داخل نفس مجموعة <a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">بداية سريعة: إعداد Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إليك عرض توضيحي عملي. تحتاج إلى <a href="https://milvus.io/docs/install-overview.md">مثيل Milvus أو Zilliz Cloud</a> قيد التشغيل ومفتاح GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">الإعداد</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">مثال كامل</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لتضمين الصور والصوت، استخدم تضمين_الصورة() وتضمين_الصوت() بنفس الطريقة - حيث تهبط المتجهات في نفس المجموعة ونفس مساحة المتجهات، مما يتيح البحث الحقيقي عبر الوسائط.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">سيتوفر Gemini Embedding 2 في Milvus/Zilliz Cloud قريبًا<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم شركة<a href="https://milvus.io/">Milvus</a> بشحن التكامل العميق مع Gemini Embedding 2 من خلال ميزة <a href="https://milvus.io/docs/embeddings.md">وظيفة التضمين</a>. بمجرد نشرها، لن تحتاج إلى استدعاء واجهات برمجة التطبيقات المضمنة يدويًا. ستقوم Milvus باستدعاء النموذج تلقائيًا (يدعم OpenAI، وAWS Bedrock، وGoogle Vertex AI، والمزيد) لتوجيه البيانات الأولية عند الإدراج والاستعلامات عند البحث.</p>
<p>وهذا يعني أنك ستحصل على تضمين موحد متعدد الوسائط من Gemini حيثما يناسبك، ومجموعة أدوات Milvus الكاملة متعددة المتجهات - البحث الهجين المتناثر الكثيف، والمخططات متعددة الفهارس، وإعادة الترتيب - حيثما تحتاج إلى تحكم دقيق.</p>
<p>هل تريد تجربته؟ ابدأ <a href="https://milvus.io/docs/quickstart.md">ببداية Milvus السريعة</a> وشغِّل العرض التوضيحي أعلاه، أو اطلع على <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">دليل البحث الهجين</a> للحصول على الإعداد الكامل متعدد النواقل باستخدام BGE-M3. أحضر أسئلتك إلى <a href="https://milvus.io/discord">Discord</a> أو <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">ساعات عمل Milvus المكتبية</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">تابع القراءة<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">تقديم وظيفة التضمين: كيف يعمل ملفوس 2.6 على تبسيط عملية البحث متعدد النواقل والبحث الدلالي - مدونة ملفوس</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">البحث الهجين متعدد النواقل</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">مستندات دالة تضمين ميلفوس</a></li>
</ul>
