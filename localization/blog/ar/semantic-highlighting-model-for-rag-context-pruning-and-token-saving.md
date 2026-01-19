---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: كيف بنينا نموذج تسليط الضوء الدلالي لتشذيب سياق RAG وحفظ الرموز
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  تعرّف على كيفية قيام Zilliz ببناء نموذج تسليط الضوء الدلالي لتصفية ضوضاء RAG،
  وتشذيب السياق، وحفظ الرموز باستخدام بنيات التشفير فقط، ومنطق LLM، وبيانات
  التدريب ثنائية اللغة على نطاق واسع.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">المشكلة ضوضاء RAG وإهدار الرموز<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p>يُعد<strong>البحث المتجه</strong> أساساً متيناً لأنظمة RAG - مساعدو المؤسسات، ووكلاء الذكاء الاصطناعي، وروبوتات دعم العملاء، وغيرها. فهو يعثر بشكل موثوق على المستندات المهمة. ولكن الاسترجاع وحده لا يحل مشكلة السياق. فحتى الفهارس التي تم ضبطها بشكل جيد تُرجع أجزاءً ذات صلة على نطاق واسع، في حين أن جزءًا صغيرًا فقط من الجمل الموجودة داخل تلك الأجزاء تجيب فعليًا على الاستعلام.</p>
<p>في أنظمة الإنتاج، تظهر هذه الفجوة على الفور. قد يسحب استعلام واحد عشرات المستندات، طول كل منها آلاف الرموز. عدد قليل فقط من الجمل يحتوي على الإشارة الفعلية؛ أما الباقي فهو عبارة عن سياق يزيد من استخدام الرموز ويبطئ عملية الاستدلال وغالبًا ما يشتت انتباه إدارة التعلم الآلي. وتصبح المشكلة أكثر وضوحًا في عمليات سير عمل الوكيل، حيث تكون الاستعلامات نفسها ناتجًا عن الاستدلال متعدد الخطوات ولا تتطابق إلا مع أجزاء صغيرة من النص المسترجع.</p>
<p>وهذا يخلق حاجة واضحة لنموذج يمكنه <em><strong>تحديد</strong></em> <em>الجمل المفيدة</em> <em><strong>وإبرازها</strong></em> <em>وتجاهل الباقي - أي</em>تصفية الملاءمة على مستوى الجملة، أو ما تشير إليه العديد من الفرق باسم <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>تشذيب السياق</strong></a>. والهدف بسيط: الاحتفاظ بالأجزاء المهمة وإسقاط الضوضاء قبل أن تصل إلى LLM.</p>
<p>لا يمكن للتمييز التقليدي القائم على الكلمات الرئيسية حل هذه المشكلة. على سبيل المثال، إذا سأل المستخدم، "كيف يمكنني تحسين كفاءة تنفيذ التعليمات البرمجية لبايثون"، فإن أداة تمييز الكلمات المفتاحية ستختار "بايثون" و"الكفاءة"، ولكنها ستفقد الجملة التي تجيب بالفعل على السؤال - "استخدم عمليات NumPy المتجهة بدلاً من الحلقات" - لأنها لا تشترك في أي كلمات مفتاحية مع الاستعلام. ما نحتاجه بدلًا من ذلك هو الفهم الدلالي وليس مطابقة السلسلة.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">نموذج تسليط الضوء الدلالي لتصفية ضوضاء RAG وتشذيب السياق<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>ولتسهيل هذا الأمر على منشئي RAG، قمنا بتدريب <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>نموذج تسليط الضوء</strong></a> الدلالي الذي يحدد ويبرز الجمل في المستندات المسترجعة التي تتوافق دلاليًا مع الاستعلام ويبرزها. يقدم النموذج حاليًا أحدث أداء في كل من اللغتين الإنجليزية والصينية، وهو مصمم ليُدمج مباشرةً في خطوط أنابيب RAG الحالية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تفاصيل النموذج</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>الترخيص:</strong> معهد ماساتشوستس للتكنولوجيا (تجاري)</p></li>
<li><p><strong>البنية:</strong> 0.6B نموذج مشفر فقط مبني على BGE-M3 Ranker v2</p></li>
<li><p><strong>نافذة السياق:</strong> 8192 رمزًا</p></li>
<li><p><strong>اللغات المدعومة:</strong> الإنجليزية والصينية</p></li>
</ul>
<p>يوفر التظليل الدلالي إشارات الملاءمة اللازمة لتحديد الأجزاء المفيدة فقط من المستندات الطويلة المسترجعة. من الناحية العملية، يتيح هذا النموذج:</p>
<ul>
<li><p><strong>تحسين قابلية التفسير،</strong> وإظهار الأجزاء المهمة بالفعل من المستند</p></li>
<li><p><strong>خفض تكلفة الرمز المميز بنسبة 70-80% من</strong> خلال إرسال الجمل المميزة فقط إلى نموذج التظليل اللغوي</p></li>
<li><p><strong>جودة إجابة أفضل،</strong> حيث يرى النموذج سياقًا أقل غير ذي صلة</p></li>
<li><p><strong>تصحيح أسهل،</strong> لأن المهندسين يمكنهم فحص التطابقات على مستوى الجملة مباشرةً</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">نتائج التقييم: تحقيق أداء SOTA</h3><p>لقد قمنا بتقييم نموذج التظليل الدلالي الخاص بنا عبر مجموعات بيانات متعددة تشمل اللغتين الإنجليزية والصينية، في كل من الظروف داخل المجال وخارج المجال.</p>
<p>تتضمن المجموعات المعيارية ما يلي:</p>
<ul>
<li><p><strong>ضمان الجودة متعدد النطاق باللغة الإنجليزية:</strong> multispanqa</p></li>
<li><p><strong>ويكيبيديا الإنجليزية خارج النطاق:</strong> wikitext2</p></li>
<li><p><strong>ضمان الجودة الصيني متعدد الامتدادات:</strong> multispanqa_zh</p></li>
<li><p><strong>ويكيبيديا الصينية خارج النطاق:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تشمل النماذج التي تم تقييمها:</p>
<ul>
<li><p>سلسلة بروفانس المفتوحة</p></li>
<li><p>سلسلة Naver's Provence/XProvence من Naver</p></li>
<li><p>أداة التمييز الدلالي OpenSearch's semantic-highlighter</p></li>
<li><p>نموذجنا ثنائي اللغة المدرّب: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-highlight-bilingual-v1</a></p></li>
</ul>
<p>عبر جميع مجموعات البيانات الأربع، يحقق نموذجنا أعلى تصنيف. والأهم من ذلك أنه النموذج <em>الوحيد</em> الذي يحقق أداءً جيدًا باستمرار على اللغتين الإنجليزية والصينية. حيث تركز النماذج المنافسة إما على اللغة الإنجليزية فقط أو تُظهر انخفاضاً واضحاً في الأداء على النص الصيني.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">كيف قمنا ببناء نموذج التظليل الدلالي هذا<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>تدريب نموذج لهذه المهمة ليس هو الجزء الصعب؛ تدريب نموذج <em>جيد</em> يتعامل مع المشاكل السابقة ويقدم أداءً قريبًا من أداء SOTA هو الجزء الذي يحدث فيه العمل الحقيقي. ركز نهجنا على أمرين</p>
<ul>
<li><p><strong>بنية النموذج:</strong> استخدام تصميم مشفر فقط للاستدلال السريع.</p></li>
<li><p><strong>بيانات التدريب:</strong> توليد تسميات ملاءمة عالية الجودة باستخدام نماذج LLM ذات القدرة على الاستدلال وتوليد البيانات على نطاق واسع باستخدام أطر الاستدلال المحلية.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">بنية النموذج</h3><p>قمنا ببناء النموذج كشبكة <strong>تشفير</strong> خفيفة الوزن <strong>فقط</strong> تتعامل مع تشذيب السياق <strong>كمهمة تسجيل الملاءمة على مستوى الرمز المميز</strong>. هذا التصميم مستوحى من <a href="https://arxiv.org/html/2501.16214v1">بروفانس،</a> وهو نهج تقليم السياق الذي قدمته شركة Naver في ICLR 2025، والذي يعيد صياغة التقليم من "اختيار الجزء الصحيح" إلى "تسجيل كل رمز رمزي". يتماشى هذا التأطير بشكل طبيعي مع التظليل الدلالي، حيث تكون الإشارات الدقيقة ضرورية.</p>
<p>نماذج التشفير فقط ليست أحدث بنية معمارية لكنها تظل عملية للغاية هنا: فهي سريعة وسهلة التوسع، ويمكنها إنتاج درجات الملاءمة لجميع مواضع الرموز الرمزية بالتوازي. بالنسبة لنظام RAG للإنتاج، فإن ميزة السرعة هذه أكثر أهمية بكثير من استخدام نموذج فك ترميز أكبر.</p>
<p>بمجرد حساب درجات الملاءمة على مستوى الرمز المميز، نقوم بتجميعها في درجات <strong>على مستوى الجملة</strong>. تُحوِّل هذه الخطوة إشارات الرموز المشوشة إلى مقياس صلة مستقر وقابل للتفسير. يتم تمييز الجمل التي تتجاوز عتبة قابلة للتكوين؛ ويتم تصفية كل شيء آخر. ينتج عن ذلك آلية بسيطة وموثوقة لاختيار الجمل التي تهم الاستعلام بالفعل.</p>
<h3 id="Inference-Process" class="common-anchor-header">عملية الاستدلال</h3><p>في وقت التشغيل، يتبع نموذج التظليل الدلالي الخاص بنا خط أنابيب بسيط:</p>
<ol>
<li><p><strong>المدخلات-</strong> تبدأ العملية باستعلام المستخدم. يتم التعامل مع المستندات المسترجعة كسياق مرشح لتقييم مدى الصلة.</p></li>
<li><p><strong>معالجة النموذج-</strong> يتم دمج الاستعلام والسياق في تسلسل واحد: [BOS] + الاستعلام + السياق</p></li>
<li><p><strong>قياس الرمز المميز</strong> - يتم تعيين درجة صلة لكل رمز في السياق بين 0 و1، مما يعكس مدى ارتباطه بقوة بالاستعلام.</p></li>
<li><p><strong>تجميع الجمل-</strong> يتم تجميع درجات الرموز الرمزية على مستوى الجملة، عادةً عن طريق حساب المتوسط، للحصول على درجة صلة لكل جملة.</p></li>
<li><p><strong>تصفية العتبة-</strong> يتم تمييز الجمل ذات الدرجات الأعلى من عتبة قابلة للتكوين والاحتفاظ بها، بينما يتم تصفية الجمل ذات الدرجات المنخفضة قبل تمريرها إلى وحدة تحليل الارتباط النهائية.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">النموذج الأساسي: BGE-M3 Reranker v2</h3><p>اخترنا BGE-M3 Reranker v2 كنموذجنا الأساسي لعدة أسباب:</p>
<ol>
<li><p>أنه يستخدم بنية تشفير مناسبة لتسجيل الرموز والجمل</p></li>
<li><p>يدعم لغات متعددة مع تحسينات لكل من اللغتين الإنجليزية والصينية</p></li>
<li><p>يوفر نافذة سياق 8192 رمزًا رمزيًا مناسبًا لمستندات RAG الأطول</p></li>
<li><p>يحافظ على 0.6 مليار معلمة - قوي بما فيه الكفاية دون أن يكون ثقيلًا من الناحية الحسابية</p></li>
<li><p>يضمن معرفة عالمية كافية في النموذج الأساسي</p></li>
<li><p>مُدرَّب على إعادة الترتيب، وهو ما يتماشى بشكل وثيق مع مهام الحكم على الملاءمة</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">بيانات التدريب: شرح LLM مع الاستدلال<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد أن انتهينا من وضع اللمسات الأخيرة على بنية النموذج، كان التحدي التالي هو بناء مجموعة بيانات من شأنها تدريب نموذج موثوق به بالفعل. بدأنا بالنظر في كيفية تعامل Open Provence مع هذا الأمر. حيث يستخدم نهجهم مجموعات بيانات ضمان الجودة العامة و LLM صغير لتسمية الجمل ذات الصلة. وهو يتوسع بشكل جيد وسهل التشغيل الآلي، مما جعله خط أساس جيد بالنسبة لنا.</p>
<p>ولكننا سرعان ما واجهنا نفس المشكلة التي وصفوها: إذا طلبت من LLM إخراج تسميات على مستوى الجملة مباشرة، فإن النتائج ليست مستقرة دائمًا. بعض التسميات صحيحة، والبعض الآخر مشكوك فيه، ومن الصعب تنظيف الأمور بعد ذلك. لم تكن التسمية التوضيحية اليدوية بالكامل خيارًا متاحًا أيضًا - كنا بحاجة إلى بيانات أكثر بكثير مما يمكننا تصنيفه يدويًا.</p>
<p>ولتحسين الاستقرار دون التضحية بقابلية التوسع، أجرينا تغييرًا واحدًا: يجب أن توفر LLM مقتطفًا منطقيًا قصيرًا لكل تسمية تقوم بإخراجها. يتضمن كل مثال تدريبي الاستعلام، والمستند، وامتدادات الجملة، وشرحًا موجزًا لسبب كون الجملة ذات صلة أو غير ذات صلة. هذا التعديل البسيط جعل التعليقات التوضيحية أكثر اتساقًا وأعطانا شيئًا ملموسًا للرجوع إليه عند التحقق من صحة مجموعة البيانات أو تصحيحها.</p>
<p>وقد تبين أن تضمين التعليل كان ذا قيمة مدهشة:</p>
<ul>
<li><p><strong>جودة تعليقات توضيحية أعلى:</strong> تعمل كتابة التعليلات التوضيحية كتدقيق ذاتي، مما يقلل من التسميات العشوائية أو غير المتسقة.</p></li>
<li><p><strong>إمكانية ملاحظة أفضل:</strong> يمكننا أن نرى <em>سبب</em> اختيار الجملة بدلاً من التعامل مع التسمية كصندوق أسود.</p></li>
<li><p><strong>تصحيح أسهل:</strong> عندما يبدو شيء ما خاطئًا، يسهّل المنطق تحديد ما إذا كانت المشكلة في الموجه أو المجال أو منطق التعليق التوضيحي.</p></li>
<li><p><strong>بيانات قابلة لإعادة الاستخدام:</strong> حتى إذا قمنا بالتبديل إلى نموذج تصنيف مختلف في المستقبل، تظل آثار الاستدلال مفيدة لإعادة التصنيف أو التدقيق.</p></li>
</ul>
<p>يبدو سير عمل التسمية التوضيحية على النحو التالي:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B للتعليق التوضيحي</h3><p>بالنسبة للتعليق التوضيحي، اخترنا Qwen3 8B لأنه يدعم أصلاً "وضع التفكير" عبر المخرجات، مما يسهل كثيرًا استخراج آثار استدلال متسقة. لم تعطنا النماذج الأصغر حجمًا تسميات مستقرة، وكانت النماذج الأكبر حجمًا أبطأ ومكلفة بشكل غير ضروري لهذا النوع من خطوط الأنابيب. حقق Qwen3 8B التوازن الصحيح بين الجودة والسرعة والتكلفة.</p>
<p>قمنا بتشغيل جميع التعليقات التوضيحية باستخدام <strong>خدمة vLLM محلية</strong> بدلاً من واجهات برمجة التطبيقات السحابية. وقد منحنا ذلك إنتاجية عالية، وأداءً يمكن التنبؤ به، وتكلفة أقل بكثير - أي مقايضة وقت وحدة معالجة الرسومات مقابل رسوم رمز واجهة برمجة التطبيقات، وهي الصفقة الأفضل عند توليد ملايين العينات.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">نطاق مجموعة البيانات</h3><p>إجمالاً، قمنا بإنشاء <strong>أكثر من 5 ملايين عينة تدريب ثنائية اللغة،</strong> مقسمة بالتساوي تقريباً بين اللغتين الإنجليزية والصينية.</p>
<ul>
<li><p><strong>مصادر اللغة الإنجليزية:</strong> MS MARCO، الأسئلة الطبيعية، GooAQ</p></li>
<li><p><strong>المصادر الصينية:</strong> DuReader، ويكيبيديا الصينية، mmarco_chinese</p></li>
</ul>
<p>يأتي جزء من مجموعة البيانات من إعادة شرح البيانات الحالية التي تستخدمها مشاريع مثل Open Provence. أما الباقي فقد تم إنشاؤه من المتون الخام عن طريق إنشاء أزواج من الاستعلام والسياق أولاً ثم تصنيفها باستخدام خط الأنابيب القائم على الاستدلال.</p>
<p>جميع بيانات التدريب المشروحة متاحة أيضًا على HuggingFace لتطوير المجتمع ومرجع التدريب: <a href="https://huggingface.co/zilliz/datasets">مجموعات بيانات زيليز</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">طريقة التدريب</h3><p>بمجرد أن أصبحت بنية النموذج ومجموعة البيانات جاهزة، قمنا بتدريب النموذج على <strong>وحدات معالجة الرسوميات 8×A100</strong> لثلاث حقب، وهو ما استغرق حوالي <strong>9 ساعات</strong> من البداية إلى النهاية.</p>
<p><strong>ملاحظة:</strong> استهدف التدريب <strong>رأس التقليم</strong> فقط، وهو المسؤول عن مهمة التظليل الدلالي. لم نقم بتدريب <strong>رأس إعادة التصنيف،</strong> نظرًا لأن التركيز فقط على هدف التقليم أسفر عن نتائج أفضل لتسجيل الصلة على مستوى الجملة.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">دراسة حالة واقعية<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>لا تروي المعايير القياسية سوى جزء من القصة، لذا إليك مثال حقيقي يوضح كيف يتصرف النموذج في حالة شائعة شائعة: عندما يحتوي النص المسترجع على الإجابة الصحيحة ومشتت انتباه مغرٍ للغاية.</p>
<p><strong>استعلام:</strong> <em>من كتب رواية "قتل غزال مقدس"؟</em></p>
<p><strong>السياق (5 جمل):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>الإجابة الصحيحة: الجملة 1 (تنص صراحةً على "سيناريو لانثيموس وإفثيميس فيليبو")</p>
<p>يحتوي هذا المثال على فخ: تذكر الجملة 3 أن "يوريبيدس" كتب المسرحية الأصلية. لكن السؤال يسأل "من كتب فيلم قتل غزال مقدس"، ويجب أن تكون الإجابة هي كاتب سيناريو الفيلم، وليس الكاتب المسرحي اليوناني الذي يعود تاريخه إلى آلاف السنين.</p>
<h3 id="Model-results" class="common-anchor-header">نتائج النموذج</h3><table>
<thead>
<tr><th>النموذج</th><th>أوجد الإجابة الصحيحة؟</th><th>التنبؤ</th></tr>
</thead>
<tbody>
<tr><td>نموذجنا</td><td>✓</td><td>الجمل المختارة 1 (الصحيحة) و 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>اخترت الجملة 3 فقط، وأخطأت الإجابة الصحيحة</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>اخترت الجملة 3 فقط، وأخطأت الإجابة الصحيحة</td></tr>
</tbody>
</table>
<p><strong>مقارنة نقاط الجملة الرئيسية:</strong></p>
<table>
<thead>
<tr><th>الجملة</th><th>نموذجنا</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>الجملة 1 (سيناريو فيلم، إجابة صحيحة)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>الجملة 3 (المسرحية الأصلية، الإجابة الصحيحة)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>نماذج XProvence:</p>
<ul>
<li><p>ينجذب بشدة إلى "يوريبيدس" و"المسرحية"، ويعطي الجملة 3 درجات شبه مثالية (0.947 و0.802)</p></li>
<li><p>يتجاهل تمامًا الإجابة الفعلية (الجملة 1)، مع إعطاء درجات منخفضة للغاية (0.133 و0.081)</p></li>
<li><p>حتى عند خفض الحد الأدنى من 0.5 إلى 0.2، لا يزال النموذج غير قادر على العثور على الإجابة الصحيحة</p></li>
</ul>
<p>نموذجنا:</p>
<ul>
<li><p>يعطي بشكل صحيح الجملة 1 أعلى الدرجات (0.915)</p></li>
<li><p>لا يزال يمنح الجملة 3 بعض الأهمية (0.719) لأنها مرتبطة بالخلفية</p></li>
<li><p>يفصل بوضوح بين الجملتين بهامش 0.2 تقريبًا</p></li>
</ul>
<p>يوضح هذا المثال نقطة القوة الأساسية للنموذج: فهم <strong>مقصد الاستعلام</strong> بدلاً من مجرد مطابقة الكلمات الرئيسية على مستوى السطح. في هذا السياق، تشير عبارة "من كتب <em>قتل غزال مقدس</em>" إلى الفيلم، وليس المسرحية اليونانية القديمة. يلتقط نموذجنا ذلك، بينما يتشتت الآخرون بسبب الإشارات المعجمية القوية.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">جرّبه وأخبرنا برأيك<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>نموذج <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> الخاص بنا مفتوح المصدر بالكامل الآن تحت رخصة MIT وجاهز للاستخدام في الإنتاج. يمكنك توصيله إلى خط أنابيب RAG الخاص بك، أو ضبطه لمجالك الخاص، أو بناء أدوات جديدة فوقه. نرحب أيضًا بالمساهمات والتعليقات من المجتمع.</p>
<ul>
<li><p><strong>تنزيل من HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>جميع بيانات التدريب المشروحة:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">التظليل الدلالي متوفر في سحابة ميلفوس وزيليز</h3><p>كما أن التظليل الدلالي مدمج مباشرةً في <a href="https://milvus.io/">Milvus</a> و <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus المدارة بالكامل)، مما يمنح المستخدمين رؤية واضحة <em>لسبب</em> استرجاع كل مستند. بدلاً من مسح أجزاء كاملة، يمكنك أن ترى على الفور الجمل المحددة التي تتعلق باستعلامك - حتى عندما لا تتطابق الصياغة تمامًا. وهذا يجعل الاسترجاع أسهل في الفهم وأسرع في التصحيح. بالنسبة لخطوط أنابيب RAG، فإنه يوضح أيضًا ما يُتوقع أن يركز عليه برنامج LLM النهائي، مما يساعد في التصميم الفوري وفحوصات الجودة.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>جرّب تسليط الضوء الدلالي في سحابة Zilliz المدارة بالكامل مجانًا</strong></a></p>
<p>نود أن نسمع كيف يعمل معك - تقارير الأخطاء أو أفكار التحسين أو أي شيء تكتشفه أثناء دمجه في سير عملك.</p>
<p>إذا كنت ترغب في التحدث عن أي شيء بمزيد من التفصيل، لا تتردد في الانضمام إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا أو حجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة. يسعدنا دائمًا التحدث مع البناة الآخرين وتبادل الملاحظات.</p>
<h2 id="Acknowledgements" class="common-anchor-header">شكر وتقدير<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد هذا العمل على الكثير من الأفكار الرائعة والمساهمات مفتوحة المصدر، ونريد أن نسلط الضوء على المشاريع التي جعلت هذا النموذج ممكنًا.</p>
<ul>
<li><p>قدّمت<strong>بروفانس</strong> إطارًا نظيفًا وعمليًا لتشذيب السياق باستخدام نماذج تشفير خفيفة الوزن.</p></li>
<li><p>قدم<strong>مشروع بروفانس المفتوح المصدر</strong> كودًا قويًا ومصمّمًا بشكل جيد - خطوط أنابيب التدريب، ومعالجة البيانات، ورؤوس النماذج - تحت رخصة متساهلة. لقد أعطانا نقطة انطلاق قوية للتجريب.</p></li>
</ul>
<p>على رأس هذا الأساس، أضفنا العديد من المساهمات الخاصة بنا:</p>
<ul>
<li><p>استخدام <strong>منطق LLM</strong> لتوليد تسميات ذات صلة عالية الجودة</p></li>
<li><p>إنشاء <strong>ما يقرب من 5 ملايين</strong> عينة تدريب ثنائية اللغة تتماشى مع أعباء عمل RAG الحقيقية</p></li>
<li><p>اختيار نموذج أساسي أكثر ملاءمةً لتسجيل أهمية السياق الطويل<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>تدريب <strong>رأس التشذيب</strong> فقط لتخصيص النموذج للتمييز الدلالي</p></li>
</ul>
<p>نحن ممتنون لفريقي Provence وOpen Provence لنشر عملهما بشكل علني. لقد سرّعت مساهماتهم بشكل كبير من تطويرنا وجعلت هذا المشروع ممكنًا.</p>
