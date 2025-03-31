---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 'التوقف عن استخدام RAG القديم: نهج RAG العميل الخاص ب DeepSearcher يغير كل شيء'
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">التحوّل إلى البحث المدعوم بالذكاء الاصطناعي مع البحث العميق<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد تطور تطور تكنولوجيا البحث بشكل كبير على مر العقود - من الاسترجاع القائم على الكلمات المفتاحية في فترة ما قبل عام 2000 إلى تجارب البحث المخصصة في عام 2010. ونحن نشهد الآن ظهور حلول مدعومة بالذكاء الاصطناعي قادرة على التعامل مع الاستعلامات المعقدة التي تتطلب تحليلاً احترافيًا متعمقًا ومحترفًا.</p>
<p>تجسد OpenAI's Deep Research هذا التحول، باستخدام قدرات التفكير المنطقي لتجميع كميات كبيرة من المعلومات وإنشاء تقارير بحثية متعددة الخطوات. على سبيل المثال، عند السؤال عن "ما هي القيمة السوقية المعقولة لشركة Tesla؟ يمكن لـ Deep Research تحليل الشؤون المالية للشركات ومسارات نمو الأعمال وتقديرات القيمة السوقية بشكل شامل.</p>
<p>يُطبِّق Deep Research شكلاً متقدمًا من إطار عمل RAG (التوليد المعزز للاسترجاع) في جوهره. يعزز RAG التقليدي مخرجات نموذج اللغة من خلال استرجاع ودمج المعلومات الخارجية ذات الصلة. يأخذ نهج OpenAI هذا الأمر إلى أبعد من ذلك من خلال تنفيذ دورات استرجاع واستدلال متكررة. فبدلاً من خطوة استرجاع واحدة، يُنشئ Deep Research بشكل ديناميكي استعلامات متعددة، ويقيّم النتائج الوسيطة ويُنقح استراتيجية البحث الخاصة به - مما يوضح كيف يمكن لتقنيات RAG المتقدمة أو الوكيلة أن تقدم محتوى عالي الجودة على مستوى المؤسسة يبدو وكأنه بحث احترافي أكثر من مجرد إجابة بسيطة على الأسئلة.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: بحث عميق محلي يجلب RAG الوكيل RAG للجميع<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>بإلهام من هذه التطورات، قام المطورون في جميع أنحاء العالم بإنشاء تطبيقاتهم الخاصة. قام مهندسو Zilliz ببناء مشروع <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> وفتح مصادره على نطاق واسع، والذي يمكن اعتباره بحثًا عميقًا محليًا ومفتوح المصدر. وقد حصل هذا المشروع على أكثر من 4,900 نجمة على موقع GitHub في أقل من شهر.</p>
<p>يُعيد DeepSearcher تعريف البحث المؤسسي المدعوم بالذكاء الاصطناعي من خلال الجمع بين قوة نماذج الاستدلال المتقدمة وميزات البحث المتطورة ومساعد بحث متكامل. من خلال دمج البيانات المحلية عبر <a href="https://milvus.io/docs/overview.md">Milvus</a> (قاعدة بيانات متجهة عالية الأداء ومفتوحة المصدر)، يقدم DeepSearcher نتائج أسرع وأكثر صلة بالموضوع مع السماح للمستخدمين بتبديل النماذج الأساسية للحصول على تجربة مخصصة بسهولة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 1:</em> <em>تاريخ نجوم DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>المصدر</em></a><em>)</em></p>
<p>في هذه المقالة، سنستكشف التطور من RAG التقليدي إلى RAG العميل في هذه المقالة، وسنستكشف ما الذي يجعل هذه الأساليب مختلفة على وجه التحديد على المستوى التقني. ثم سنناقش بعد ذلك تطبيق DeepSearcher، وسنوضح كيف يستفيد من قدرات الوكيل الذكي لتمكين التفكير الديناميكي متعدد الأدوار - ولماذا هذا مهم للمطورين الذين يقومون ببناء حلول بحث على مستوى المؤسسة.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">من RAG التقليدي إلى RAG العميل: قوة الاستدلال التكراري<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>يعزز RAG العميل RAG إطار عمل RAG التقليدي من خلال دمج قدرات الوكيل الذكي. ويُعد DeepSearcher مثالاً رئيسيًا على إطار عمل RAG العميل. فمن خلال التخطيط الديناميكي، والاستدلال متعدد الخطوات، واتخاذ القرارات المستقلة، ينشئ هذا الإطار عملية ذات حلقة مغلقة تسترجع البيانات وتعالجها وتتحقق من صحتها وتحسنها لحل المشاكل المعقدة.</p>
<p>إن الشعبية المتزايدة لـ Agentic RAG مدفوعة بالتطورات الكبيرة في قدرات التفكير في النماذج اللغوية الكبيرة (LLM)، لا سيما قدرتها المحسّنة على تفكيك المشاكل المعقدة والحفاظ على سلاسل التفكير المترابطة عبر خطوات متعددة.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>بُعد المقارنة</strong></td><td><strong>RAG التقليدي</strong></td><td><strong>نموذج RAG العميل</strong></td></tr>
<tr><td>النهج الأساسي</td><td>سلبي وتفاعلي</td><td>استباقية وقائمة على الوكلاء</td></tr>
<tr><td>تدفق العملية</td><td>الاسترجاع والتوليد بخطوة واحدة (عملية لمرة واحدة)</td><td>الاسترجاع والتوليد الديناميكي متعدد الخطوات (التنقيح التكراري)</td></tr>
<tr><td>استراتيجية الاسترجاع</td><td>بحث ثابت بالكلمات الرئيسية، يعتمد على الاستعلام الأولي</td><td>الاسترجاع التكيفي (على سبيل المثال، تنقيح الكلمات الرئيسية، وتبديل مصدر البيانات)</td></tr>
<tr><td>معالجة الاستعلامات المعقدة</td><td>التوليد المباشر؛ عرضة للأخطاء مع البيانات المتضاربة</td><td>تحلل المهام → الاسترجاع المستهدف → توليف الإجابة</td></tr>
<tr><td>القدرة على التفاعل</td><td>تعتمد بالكامل على مدخلات المستخدم؛ لا توجد استقلالية</td><td>المشاركة الاستباقية (على سبيل المثال، توضيح الغموض، وطلب التفاصيل)</td></tr>
<tr><td>تصحيح الأخطاء والتغذية الراجعة</td><td>لا يوجد تصحيح ذاتي؛ مقيد بالنتائج الأولية</td><td>التصحيح التكراري → إعادة الاسترجاع الذاتي من أجل الدقة</td></tr>
<tr><td>حالات الاستخدام المثالية</td><td>الأسئلة والأجوبة البسيطة، عمليات البحث عن الحقائق</td><td>الاستدلال المعقد، حل المشكلات متعدد المراحل، المهام المفتوحة</td></tr>
<tr><td>مثال</td><td>يسأل المستخدم: "ما هي الحوسبة الكمية؟ → يقوم النظام بإرجاع تعريف الكتاب المدرسي</td><td>يسأل المستخدم: "كيف يمكن للحوسبة الكمية تحسين الخدمات اللوجستية؟ → يسترجع النظام المبادئ الكمية والخوارزميات اللوجستية، ثم يقوم بتجميع رؤى قابلة للتنفيذ</td></tr>
</tbody>
</table>
<p>على عكس نظام RAG التقليدي، الذي يعتمد على استرجاع واحد قائم على الاستعلام، يقوم نظام RAG العميل بتقسيم الاستعلام إلى عدة أسئلة فرعية ويقوم بتطوير بحثه بشكل متكرر حتى يصل إلى إجابة مرضية. يوفر هذا التطور ثلاث فوائد أساسية:</p>
<ul>
<li><p><strong>حل المشكلات الاستباقي:</strong> ينتقل النظام من رد الفعل السلبي إلى حل المشكلات بفاعلية.</p></li>
<li><p><strong>الاسترجاع الديناميكي متعدد الأدوار:</strong> بدلاً من إجراء بحث لمرة واحدة، يقوم النظام باستمرار بتعديل استفساراته وتصحيح نفسه ذاتيًا بناءً على التغذية الراجعة المستمرة.</p></li>
<li><p><strong>قابلية تطبيق أوسع:</strong> يتجاوز نطاقه نطاق التحقق من الحقائق الأساسية للتعامل مع مهام الاستدلال المعقدة وإنشاء تقارير شاملة.</p></li>
</ul>
<p>ومن خلال الاستفادة من هذه الإمكانيات، تعمل تطبيقات Agentic RAG مثل DeepSearcher مثل DeepSearcher مثل الخبير البشري - لا تقدم الإجابة النهائية فحسب، بل تقدم أيضًا تفاصيل كاملة وشفافة لعملية الاستدلال وتفاصيل التنفيذ.</p>
<p>وعلى المدى الطويل، من المتوقع أن تتفوق تطبيقات RAG العميلة على أنظمة RAG الأساسية. فغالبًا ما تكافح الأساليب التقليدية لمعالجة المنطق الكامن في استعلامات المستخدم، والتي تتطلب التفكير التكراري والتفكير والتحسين المستمر.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">كيف تبدو بنية RAG العميلة؟ الباحث العميق كمثال<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن وبعد أن فهمنا قوة أنظمة RAG العميلة، كيف تبدو بنيتها؟ لنأخذ DeepSearcher كمثال.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 2: وحدتان ضمن DeepSearcher</em></p>
<p>تتكون بنية DeepSearcher من وحدتين أساسيتين:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. وحدة استيعاب البيانات</h3><p>تربط هذه الوحدة مختلف مصادر البيانات المملوكة لجهات خارجية عبر قاعدة بيانات Milvus vector. وهي ذات قيمة خاصة لبيئات المؤسسات التي تعتمد على مجموعات البيانات الخاصة. تعالج الوحدة النمطية:</p>
<ul>
<li><p>تحليل المستندات وتقطيعها</p></li>
<li><p>توليد التضمين</p></li>
<li><p>تخزين المتجهات وفهرستها</p></li>
<li><p>إدارة البيانات الوصفية للاسترجاع الفعال</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. وحدة الاستدلال والاستعلام عبر الإنترنت</h3><p>يطبّق هذا المكوّن استراتيجيات الوكلاء المتنوعة ضمن إطار عمل RAG لتقديم استجابات دقيقة وثاقبة. وهو يعمل على حلقة ديناميكية متكررة - بعد كل عملية استرجاع للبيانات، يقوم النظام بالتفكير فيما إذا كانت المعلومات المتراكمة تجيب بشكل كافٍ على الاستعلام الأصلي. إذا لم يكن الأمر كذلك، يتم تشغيل تكرار آخر؛ وإذا كانت الإجابة بنعم، يتم إنشاء التقرير النهائي.</p>
<p>تمثّل هذه الدورة المستمرة من "المتابعة" و"التفكير" تحسينًا جوهريًا مقارنةً بمناهج RAG الأساسية الأخرى. بينما يقوم RAG التقليدي بإجراء عملية استرجاع وتوليد دفعة واحدة، فإن نهج DeepSearcher التكراري يعكس كيفية عمل الباحثين البشريين - طرح الأسئلة الأولية، وتقييم المعلومات الواردة، وتحديد الثغرات، ومتابعة خطوط جديدة من الاستقصاء.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">ما مدى فعالية DeepSearcher، وما هي حالات الاستخدام الأنسب له؟<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد تثبيته وتهيئته، يقوم DeepSearcher بفهرسة ملفاتك المحلية من خلال قاعدة بيانات Milvus vector. وعند إرسال استعلام، يقوم بإجراء بحث شامل ومتعمق في هذا المحتوى المفهرس. الميزة الرئيسية للمطورين هي أن النظام يقوم بتسجيل كل خطوة من خطوات عملية البحث والاستدلال، مما يوفر الشفافية في كيفية وصوله إلى استنتاجاته - وهي ميزة مهمة لتصحيح الأخطاء وتحسين أنظمة RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 3: التشغيل المعجل لتكرار الباحث العميق</em></p>
<p>يستهلك هذا النهج موارد حسابية أكثر من RAG التقليدي ولكنه يقدم نتائج أفضل للاستعلامات المعقدة. دعونا نناقش حالتين محددتين للاستخدام حيث يكون DeepSearcher هو الأنسب لهما.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. استعلامات من نوع النظرة العامة</h3><p>توفر الاستعلامات من نوع النظرة العامة - مثل إنشاء التقارير أو صياغة المستندات أو تلخيص الاتجاهات - موضوعًا موجزًا ولكنها تتطلب مخرجات شاملة ومفصلة.</p>
<p>على سبيل المثال، عند الاستعلام عن &quot;كيف تغيرت عائلة سمبسون مع مرور الوقت؟&quot;، يقوم DeepSearcher أولاً بإنشاء مجموعة أولية من الاستعلامات الفرعية:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>يقوم باسترجاع المعلومات ذات الصلة، ثم يكرّر الاستعلامات مع التغذية الراجعة لتحسين بحثه، ويولّد الاستعلامات الفرعية التالية:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>يبني كل تكرار على الاستعلام الفرعي الذي سبقه، ويتوج ذلك بتقرير شامل يغطي جوانب متعددة للموضوع، منظمًا بأقسام مثل</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(للإيجاز، يتم عرض مقتطفات فقط من العملية والتقرير النهائي)</em></p>
<p>يقدم التقرير النهائي تحليلاً شاملاً مع اقتباسات مناسبة وتنظيم منظم.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. الاستعلامات المنطقية المعقدة</h3><p>تتضمن الاستعلامات المعقدة طبقات متعددة من المنطق والكيانات المترابطة.</p>
<p>تأمل الاستعلام "أي فيلم للمخرج الأكبر سنًا، فيلم "هبة الله للنساء" أم فيلم "ألدرى أنيت إن براك"؟</p>
<p>في حين أن هذا قد يبدو بسيطًا بالنسبة للإنسان، إلا أن أنظمة RAG البسيطة تواجه صعوبة في التعامل معه لأن الإجابة ليست مخزنة مباشرة في قاعدة المعرفة. يعالج DeepSearcher هذا التحدي من خلال تحليل الاستعلام إلى أسئلة فرعية أصغر:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>يسترجع أولاً معلومات عن مخرجي الفيلمين,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>ثم ينشئ استعلامات فرعية</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>ثم يستخرج تواريخ ميلادهما، وأخيرًا يقارن بينهما لتحديد الإجابة الصحيحة:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>في المقابل، قد يفوت نظام RAG التقليدي تفاصيل رئيسية بسبب الاسترجاع المحدود في مسار واحد، مما قد يؤدي إلى إجابات <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">مهلوسة</a> أو غير دقيقة:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>يتميز DeepSearcher عن طريق إجراء عمليات بحث عميقة وتكرارية على البيانات المحلية المستوردة. فهو يقوم بتسجيل كل خطوة من خطوات عملية الاستدلال الخاصة به ويقدم في النهاية تقريراً شاملاً وموحداً. وهذا يجعله فعالًا بشكل خاص في الاستعلامات من نوع النظرة العامة - مثل إنشاء تقارير مفصلة أو تلخيص الاتجاهات - وفي الاستعلامات المنطقية المعقدة التي تتطلب تقسيم السؤال إلى أسئلة فرعية أصغر وتجميع البيانات من خلال حلقات متعددة من التغذية الراجعة.</p>
<p>في القسم التالي، سنقارن بين DeepSearcher وأنظمة RAG الأخرى، مستكشفين كيف يتوافق نهجها التكراري وتكامل نموذجها المرن مع الطرق التقليدية.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">مقارنة كمية: مقارنة DeepSearcher مقابل RAG التقليدية<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>في مستودع GitHub الخاص ب DeepSearcher، قمنا بإتاحة كود للاختبار الكمي. لهذا التحليل، استخدمنا مجموعة بيانات 2WikiMultiHopQA الشهيرة. (ملاحظة: لقد قمنا بتقييم أول 50 مدخلاً فقط لإدارة استهلاك الرمز المميز لواجهة برمجة التطبيقات، لكن الاتجاهات العامة لا تزال واضحة).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">مقارنة معدل الاستدعاء</h3><p>كما هو موضح في الشكل 4، يتحسن معدل الاستدعاء بشكل ملحوظ مع زيادة عدد التكرارات القصوى:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 4: الحد الأقصى للتكرارات مقابل الاستدعاء</em></p>
<p>بعد نقطة معينة، تتناقص التحسينات الهامشية بعد نقطة معينة، ومن ثم، فإننا عادةً ما نضبط العدد الافتراضي على 3 تكرارات، على الرغم من أنه يمكن تعديل ذلك بناءً على الاحتياجات المحددة.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">تحليل استهلاك الرمز المميز</h3><p>قمنا أيضًا بقياس إجمالي استخدام الرمز المميز ل 50 استعلامًا عبر عدد مرات التكرار المختلفة:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 5: الحد الأقصى للتكرارات مقابل استخدام الرمز المميز</em></p>
<p>تظهر النتائج أن استهلاك الرمز المميز يزداد خطيًا مع زيادة عدد التكرارات. على سبيل المثال، مع 4 تكرارات، يستهلك DeepSearcher ما يقرب من 0.3 مليون رمز مميز. <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> باستخدام تقدير تقريبي استنادًا إلى تسعير gpt-4o-mini الخاص ب OpenAI البالغ</span></span></span> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.60</mn><mi>لكل</mi></mrow><annotation encoding="application/x-tex">مليون توكين إخراج،</annotation><mrow><mi>وهذا</mi><mi>يعادل</mi></mrow><annotation encoding="application/x-tex">متوسط تكلفة يبلغ حوالي 0.60 لكل مليون</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">توكين</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex"></annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct"> إخراج،</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">وهذا</span><span class="mord mathnormal">يعادل</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">متوسط تكلفة يبلغ حوالي</annotation></semantics></math></span> 0<span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span></span></span></span>0036 لكل استعلام (أو ما يقرب من 0.18 دولار أمريكي ل 50 استعلامًا).</p>
<p>بالنسبة للنماذج الاستدلالية الأكثر كثافة في الموارد، ستكون التكاليف أعلى بعدة مرات بسبب ارتفاع سعر الرمز الواحد ومخرجات الرموز الأكبر.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">مقارنة أداء النموذج</h3><p>من المزايا المهمة لبرنامج DeepSearcher مرونته في التبديل بين النماذج المختلفة. اختبرنا نماذج استدلالية مختلفة ونماذج غير استدلالية (مثل gpt-4o-mini). بشكل عام، كانت النماذج الاستدلالية - خاصةً كلود 3.7 سونيت - تميل إلى الأداء الأفضل، على الرغم من أن الاختلافات لم تكن كبيرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 6: متوسط التذكر حسب النموذج</em></p>
<p>من الجدير بالذكر أن بعض النماذج غير الاستدلالية الأصغر حجمًا لم تستطع أحيانًا إكمال عملية استعلام الوكيل الكاملة بسبب قدرتها المحدودة على اتباع التعليمات - وهو تحدٍ شائع للعديد من المطورين الذين يعملون مع أنظمة مماثلة.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">الباحث العميق (DeepSearcher (Agentic RAG) مقابل RAG Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>كما أن<a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> قادر على التعامل مع الاستعلامات المعقدة، خاصةً الاستعلامات متعددة القفزات. إذن، ما هو الفرق بين DeepSearcher (الباحث العميق (Agentic RAG) و Graph RAG؟</p>
<p>تم تصميم Graph RAG للاستعلام عن المستندات بناءً على روابط علائقية صريحة، مما يجعله قويًا بشكل خاص في الاستعلامات متعددة القفزات. على سبيل المثال، عند معالجة رواية طويلة، يمكن لـ Graph RAG استخراج العلاقات المعقدة بين الشخصيات بدقة. ومع ذلك، تتطلب هذه الطريقة استخدامًا كبيرًا للرموز أثناء استيراد البيانات لتعيين هذه العلاقات، ويميل وضع الاستعلام الخاص بها إلى أن يكون جامدًا - وهو فعال عادةً فقط للاستعلامات ذات العلاقة الواحدة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 7: الرسم البياني RAG مقابل DeepSearcher</em></p>
<p>على النقيض من ذلك، يتبع RAG العميل - كما يتضح من DeepSearcher - نهجًا مختلفًا تمامًا. فهو يقلل من استهلاك الرموز أثناء استيراد البيانات، وبدلًا من ذلك يستثمر الموارد الحسابية أثناء معالجة الاستعلام. يخلق خيار التصميم هذا مقايضات تقنية مهمة:</p>
<ol>
<li><p>انخفاض التكاليف الأولية: يتطلب DeepSearcher معالجة مسبقة أقل للوثائق، مما يجعل الإعداد الأولي أسرع وأقل تكلفة</p></li>
<li><p>معالجة ديناميكية للاستعلام: يمكن للنظام تعديل استراتيجية الاسترجاع الخاصة به أثناء التنقل بناءً على النتائج الوسيطة</p></li>
<li><p>تكاليف أعلى لكل استعلام: يتطلب كل استعلام عمليات حسابية أكثر من Graph RAG، ولكنه يقدم نتائج أكثر مرونة</p></li>
</ol>
<p>بالنسبة للمطورين، يعد هذا التمييز أمرًا بالغ الأهمية عند تصميم أنظمة ذات أنماط استخدام مختلفة. قد يكون Graph RAG أكثر كفاءة للتطبيقات ذات أنماط استعلام يمكن التنبؤ بها وحجم استعلام مرتفع، بينما يتفوق نهج DeepSearcher في السيناريوهات التي تتطلب مرونة ومعالجة استعلامات معقدة لا يمكن التنبؤ بها.</p>
<p>وبالنظر إلى المستقبل، مع انخفاض تكلفة الآلات ذات التكلفة المنخفضة واستمرار تحسن أداء الاستدلال، من المرجح أن تصبح أنظمة RAG العميلة مثل DeepSearcher أكثر انتشارًا. سوف يتضاءل عيب التكلفة الحسابية، بينما ستظل ميزة المرونة قائمة.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">الباحث العميق مقابل البحث العميق<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>على عكس OpenAI's Deep Research، فإن DeepSearcher مصمم خصيصًا للاسترجاع والتحليل العميق للبيانات الخاصة. من خلال الاستفادة من قاعدة بيانات متجهة، يمكن لـ DeepSearcher استيعاب مصادر بيانات متنوعة، ودمج أنواع مختلفة من البيانات، وتخزينها بشكل موحد في مستودع معرفي قائم على المتجهات. تمكّنه قدرات البحث الدلالي القوية من البحث بكفاءة من خلال كميات هائلة من البيانات غير المتصلة بالإنترنت.</p>
<p>علاوة على ذلك، فإن DeepSearcher مفتوح المصدر بالكامل. بينما يظل Deep Research رائداً في جودة توليد المحتوى، إلا أنه يأتي برسوم شهرية ويعمل كمنتج مغلق المصدر، مما يعني أن عملياته الداخلية مخفية عن المستخدمين. في المقابل، يوفر DeepSearcher شفافية كاملة - يمكن للمستخدمين فحص الكود البرمجي وتخصيصه ليناسب احتياجاتهم، أو حتى نشره في بيئات الإنتاج الخاصة بهم.</p>
<h2 id="Technical-Insights" class="common-anchor-header">الرؤى التقنية<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>خلال عملية التطوير والتكرارات اللاحقة لبرنامج DeepSearcher، جمعنا العديد من الرؤى التقنية المهمة:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">نماذج الاستدلال: فعالة ولكن ليست معصومة</h3><p>تكشف تجاربنا أنه على الرغم من أن نماذج الاستدلال تعمل بشكل جيد كوكلاء، إلا أنها في بعض الأحيان تبالغ في تحليل التعليمات المباشرة، مما يؤدي إلى استهلاك مفرط للرموز وأوقات استجابة أبطأ. تتماشى هذه الملاحظة مع نهج مزودي خدمات الذكاء الاصطناعي الرئيسيين مثل OpenAI، والتي لم تعد تميز بين النماذج الاستدلالية وغير الاستدلالية. وبدلاً من ذلك، يجب أن تحدد خدمات النماذج تلقائياً ضرورة الاستدلال بناءً على متطلبات محددة للحفاظ على الرموز المميزة.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">الصعود الوشيك لمفهوم RAG العميل</h3><p>من من منظور الطلب، يُعد توليد المحتوى العميق أمرًا ضروريًا؛ ومن الناحية التقنية، يُعد تعزيز فعالية RAG أمرًا بالغ الأهمية أيضًا. على المدى الطويل، تُعد التكلفة هي العائق الأساسي أمام الاعتماد الواسع النطاق لـ RAG العميل. ومع ذلك، مع ظهور أجهزة LLMs عالية الجودة وفعالة من حيث التكلفة مثل DeepSeek-R1 وتخفيضات التكلفة التي يقودها قانون مور، من المتوقع أن تنخفض النفقات المرتبطة بخدمات الاستدلال.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">حد التحجيم الخفي لخدمات RAG العميلة</h3><p>تتعلق إحدى النتائج المهمة التي توصلنا إليها في بحثنا بالعلاقة بين الأداء والموارد الحاسوبية. في البداية، افترضنا في البداية أن مجرد زيادة عدد التكرارات وتخصيص الرموز سيؤدي إلى تحسين النتائج بشكل متناسب للاستعلامات المعقدة.</p>
<p>كشفت تجاربنا عن حقيقة أكثر دقة: في حين أن الأداء يتحسن مع التكرارات الإضافية، لاحظنا تناقصًا واضحًا في العائدات. على وجه التحديد:</p>
<ul>
<li><p>زاد الأداء بشكل حاد من 1 إلى 3 تكرارات</p></li>
<li><p>كانت التحسينات من 3 إلى 5 تكرارات متواضعة</p></li>
<li><p>بعد 5 تكرارات إضافية، كانت المكاسب ضئيلة على الرغم من الزيادات الكبيرة في استهلاك الرمز المميز</p></li>
</ul>
<p>هذه النتيجة لها آثار مهمة بالنسبة للمطورين: إن مجرد إلقاء المزيد من الموارد الحاسوبية على أنظمة RAG ليس النهج الأكثر كفاءة. غالبًا ما تكون جودة استراتيجية الاسترجاع، ومنطق التحلل، وعملية التوليف أكثر أهمية من عدد التكرارات الخام. يشير هذا إلى أن المطورين يجب أن يركزوا على تحسين هذه المكونات بدلاً من مجرد زيادة ميزانيات الرموز.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">تطور ما بعد RAG التقليدي</h3><p>يوفر RAG التقليدي كفاءة قيّمة من خلال نهج الاسترجاع الأحادي منخفض التكلفة، مما يجعله مناسبًا لسيناريوهات الإجابة عن الأسئلة المباشرة. ومع ذلك، تصبح حدوده واضحة عند التعامل مع الاستعلامات ذات المنطق الضمني المعقد.</p>
<p>ضع في اعتبارك استعلام مستخدم مثل "كيف تكسب 100 مليون في السنة". قد يسترجع نظام RAG التقليدي محتوى حول المهن ذات الدخل المرتفع أو استراتيجيات الاستثمار، ولكنه سيواجه صعوبة في</p>
<ol>
<li><p>تحديد التوقعات غير الواقعية في الاستعلام</p></li>
<li><p>تقسيم المشكلة إلى أهداف فرعية قابلة للتنفيذ</p></li>
<li><p>تجميع المعلومات من مجالات متعددة (الأعمال والتمويل وريادة الأعمال)</p></li>
<li><p>تقديم نهج منظم ومتعدد المسارات مع جداول زمنية واقعية</p></li>
</ol>
<p>هذا هو المكان الذي تُظهر فيه أنظمة RAG العميلة مثل DeepSearcher قوتها. فمن خلال تحليل الاستفسارات المعقدة وتطبيق المنطق متعدد الخطوات، يمكنها تقديم استجابات دقيقة وشاملة تلبي احتياجات المستخدم الأساسية من المعلومات بشكل أفضل. ومع زيادة كفاءة هذه الأنظمة، نتوقع أن نرى تسارع اعتمادها عبر تطبيقات المؤسسات.</p>
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
    </button></h2><p>يمثل DeepSearcher تطوراً كبيراً في تصميم نظام RAG، حيث يقدم للمطورين إطار عمل قوي لبناء قدرات بحث وبحث أكثر تطوراً. وتشمل مزاياه التقنية الرئيسية ما يلي:</p>
<ol>
<li><p>الاستدلال التكراري: القدرة على تقسيم الاستفسارات المعقدة إلى خطوات فرعية منطقية والبناء التدريجي نحو إجابات شاملة</p></li>
<li><p>بنية مرنة: دعم لتبديل النماذج الأساسية وتخصيص عملية الاستدلال لتتناسب مع احتياجات التطبيق المحددة</p></li>
<li><p>تكامل قاعدة بيانات المتجهات: اتصال سلس بقاعدة بيانات Milvus لتخزين واسترجاع التضمينات المتجهة بكفاءة من مصادر البيانات الخاصة</p></li>
<li><p>تنفيذ شفاف: تسجيل مفصل لكل خطوة من خطوات الاستدلال، مما يمكّن المطورين من تصحيح سلوك النظام وتحسينه</p></li>
</ol>
<p>يؤكد اختبار الأداء الذي أجريناه على أن DeepSearcher يقدم نتائج متفوقة للاستعلامات المعقدة مقارنةً بنهج RAG التقليدي، على الرغم من وجود مقايضات واضحة في الكفاءة الحسابية. يوازن التكوين الأمثل (عادةً حوالي 3 تكرارات) بين الدقة واستهلاك الموارد.</p>
<p>مع استمرار انخفاض تكاليف LLM في الانخفاض وتحسن قدرات الاستدلال، سيصبح نهج RAG العميل المنفذ في DeepSearcher عمليًا بشكل متزايد لتطبيقات الإنتاج. بالنسبة للمطورين الذين يعملون على البحث المؤسسي أو مساعدي البحث أو أنظمة إدارة المعرفة، يوفر DeepSearcher أساسًا قويًا مفتوح المصدر يمكن تخصيصه لمتطلبات مجال معين.</p>
<p>نرحب بالمساهمات من مجتمع المطورين وندعوكم لاستكشاف هذا النموذج الجديد في تطبيق RAG من خلال الاطلاع على <a href="https://github.com/zilliztech/deep-searcher">مستودع GitHub</a> الخاص بنا.</p>
