---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: >-
  كيف يقوم برنامج Milvus 2.6 بترقية البحث متعدد اللغات عن النص الكامل على نطاق
  واسع
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  يقدّم الإصدار Milvus 2.6 خط أنابيب لتحليل النصوص تم إصلاحه بالكامل مع دعم شامل
  متعدد اللغات للبحث في النص الكامل.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>أصبحت تطبيقات الذكاء الاصطناعي الحديثة معقدة بشكل متزايد. لا يمكنك فقط إلقاء طريقة بحث واحدة على مشكلة ما واعتبارها منتهية.</p>
<p>خذ أنظمة التوصيات، على سبيل المثال - فهي تتطلب <strong>بحثًا متجهًا</strong> لفهم معنى النص والصور، <strong>وتصفية البيانات الوصفية</strong> لتضييق نطاق النتائج حسب السعر أو الفئة أو الموقع، <strong>والبحث بالكلمات الرئيسية</strong> للاستعلامات المباشرة مثل "Nike Air Max". تحل كل طريقة جزءًا مختلفًا من المشكلة، وتحتاج أنظمة العالم الحقيقي إلى أن تعمل جميعها معًا.</p>
<p>لا يتعلق مستقبل البحث بالاختيار بين المتجه والكلمة المفتاحية. بل يتعلق بالجمع بين المتجه والكلمة المفتاحية والتصفية، إلى جانب أنواع البحث الأخرى - كل ذلك في مكان واحد. لهذا السبب بدأنا في بناء <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">بحث هجين</a> في Milvus منذ عام، مع إصدار Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">لكن البحث عن النص الكامل يعمل بشكل مختلف<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>ليس من السهل إدخال البحث عن النص الكامل في نظام متجه أصلي. البحث في النص الكامل له مجموعة التحديات الخاصة به.</p>
<p>فبينما يلتقط البحث المتجه المعنى <em>الدلالي</em> للنص - أي تحويله إلى متجهات عالية الأبعاد - يعتمد البحث عن النص الكامل على فهم <strong>بنية اللغة</strong>: كيف تتشكل الكلمات، وأين تبدأ وتنتهي، وكيف ترتبط ببعضها البعض. على سبيل المثال، عندما يبحث المستخدم عن "حذاء الجري" باللغة الإنجليزية، يمر النص بعدة خطوات معالجة:</p>
<p><em>التقسيم على المسافات البيضاء ← إزالة الكلمات الصغيرة ← إزالة الكلمات المتوقفة ← تحويل كلمة &quot;الركض&quot; إلى &quot;الركض&quot;.</em></p>
<p>للتعامل مع ذلك بشكل صحيح، نحتاج إلى <strong>محلل لغوي</strong>قوي <strong>- محلل لغوي</strong>يتعامل مع التقسيم والوقف والتصفية وغير ذلك.</p>
<p>عندما قدمنا <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">بحث النص الكامل BM25</a> في ميلفوس 2.5، قمنا بتضمين محلل قابل للتخصيص، وقد عمل بشكل جيد لما صُمم للقيام به. كان بإمكانك تحديد خط أنابيب باستخدام أدوات ترميز، ومرشحات الرموز الرمزية، ومرشحات الأحرف لإعداد النص للفهرسة والبحث.</p>
<p>بالنسبة للغة الإنجليزية، كان هذا الإعداد بسيطًا نسبيًا. لكن الأمور تصبح أكثر تعقيدًا عندما تتعامل مع لغات متعددة.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">تحدي البحث متعدد اللغات في النص الكامل<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم البحث في النص الكامل متعدد اللغات مجموعة من التحديات:</p>
<ul>
<li><p><strong>تحتاج اللغات المعقدة إلى معاملة خاصة</strong>: لغات مثل الصينية واليابانية والكورية لا تستخدم مسافات بين الكلمات. فهي تحتاج إلى أدوات ترميز متقدمة لتجزئة الأحرف إلى كلمات ذات معنى. قد تعمل هذه الأدوات بشكل جيد مع لغة واحدة ولكنها نادراً ما تدعم لغات معقدة متعددة في وقت واحد.</p></li>
<li><p><strong>حتى اللغات المتشابهة يمكن أن تتعارض</strong>: قد تستخدم كل من اللغتين الإنجليزية والفرنسية مسافات بيضاء لفصل الكلمات، ولكن بمجرد تطبيق المعالجة الخاصة بلغة معينة مثل الجذع أو الليماتنة، يمكن أن تتداخل قواعد إحدى اللغتين مع قواعد اللغة الأخرى. ما يحسن دقة اللغة الإنجليزية قد يشوه الاستعلامات الفرنسية - والعكس صحيح.</p></li>
</ul>
<p>باختصار، <strong>تتطلب اللغات المختلفة محللات مختلفة</strong>. تؤدي محاولة معالجة النص الصيني باستخدام محلل إنجليزي إلى الفشل - لا توجد مسافات للتقسيم عليها، ويمكن أن تؤدي قواعد الجذعية الإنجليزية إلى إفساد الأحرف الصينية.</p>
<p>الخلاصة؟ الاعتماد على أداة ترميز واحدة ومحلل واحد لمجموعات البيانات متعددة اللغات يجعل من المستحيل تقريبًا ضمان ترميز متسق وعالي الجودة عبر جميع اللغات. وهذا يؤدي مباشرةً إلى تدهور أداء البحث.</p>
<p>عندما بدأت الفرق في اعتماد البحث بالنص الكامل في Milvus 2.5، بدأنا نسمع نفس التعليقات:</p>
<p><em>"هذا مثالي لعمليات البحث لدينا باللغة الإنجليزية، ولكن ماذا عن تذاكر دعم العملاء متعددة اللغات؟ "نحن نحب أن يكون لدينا بحث متجه وبحث BM25، ولكن مجموعة بياناتنا تتضمن محتوى صيني وياباني وإنجليزي." "هل يمكننا الحصول على دقة البحث نفسها عبر جميع لغاتنا؟</em></p>
<p>أكدت هذه الأسئلة ما رأيناه بالفعل في الممارسة العملية: يختلف البحث في النص الكامل اختلافًا جوهريًا عن البحث المتجه. يعمل التشابه الدلالي بشكل جيد عبر اللغات، ولكن البحث الدقيق في النص يتطلب فهماً عميقاً لبنية كل لغة.</p>
<p>هذا هو السبب في أن <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> يقدم نظام تحليل نصي تم إصلاحه بالكامل مع دعم شامل متعدد اللغات. يطبّق هذا النظام الجديد تلقائيًا المحلل الصحيح لكل لغة، مما يتيح بحثًا دقيقًا وقابلًا للتطوير في النص الكامل عبر مجموعات بيانات متعددة اللغات، دون تكوين يدوي أو مساومة في الجودة.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">كيف يتيح نظام Milvus 2.6 بحثًا قويًا متعدد اللغات بالنصوص الكاملة<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد البحث والتطوير المكثف، قمنا ببناء مجموعة من الميزات التي تعالج سيناريوهات مختلفة متعددة اللغات. كل نهج يحل مشكلة التبعية اللغوية بطريقته الخاصة.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. محلل متعدد اللغات: الدقة من خلال التحكم</h3><p>يتيح لك المُحلل <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>متعدد اللغات</strong></a> تحديد قواعد مختلفة لمعالجة النصوص للغات المختلفة داخل نفس المجموعة، بدلاً من إجبار جميع اللغات على نفس خط أنابيب التحليل.</p>
<p><strong>إليك كيفية عمله:</strong> يمكنك تكوين محلل خاص بكل لغة وتمييز كل مستند بلغته أثناء الإدراج. عند إجراء بحث BM25، تقوم بتحديد محلل اللغة الذي ستستخدمه لمعالجة الاستعلام. يضمن ذلك معالجة كل من المحتوى المفهرس واستعلامات البحث الخاصة بك بالقواعد المثلى للغات الخاصة بكل منهما.</p>
<p><strong>مثالي لـ</strong> التطبيقات التي تعرف فيها لغة المحتوى الخاص بك وتريد أقصى قدر من دقة البحث. فكّر في قواعد المعرفة متعددة الجنسيات أو كتالوجات المنتجات المترجمة أو أنظمة إدارة المحتوى الخاصة بكل منطقة.</p>
<p><strong>المتطلبات:</strong> تحتاج إلى توفير البيانات الوصفية اللغوية لكل مستند. متوفر حاليًا فقط لعمليات البحث BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. أداة ترميز معرّف اللغة: الكشف التلقائي عن اللغة</h3><p>نحن نعلم أن وضع علامات يدويًا على كل جزء من المحتوى ليس عمليًا دائمًا. يقوم مُعرّف <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>اللغة Tokenizer</strong></a> بالكشف التلقائي عن اللغة مباشرةً في خط أنابيب تحليل النصوص.</p>
<p><strong>إليك كيفية عمله:</strong> يقوم هذا المُعَرِّف الذكي بتحليل النص الوارد، ويكتشف لغته باستخدام خوارزميات كشف متطورة، ويطبق تلقائيًا قواعد المعالجة المناسبة الخاصة باللغة. يمكنك تكوينه باستخدام تعريفات متعددة للمحلل - واحد لكل لغة تريد دعمها، بالإضافة إلى محلل احتياطي افتراضي.</p>
<p>نحن ندعم محركين للكشف: <code translate="no">whatlang</code> لمعالجة أسرع و <code translate="no">lingua</code> لدقة أعلى. يدعم النظام 71-75 لغة، اعتمادًا على الكاشف الذي اخترته. أثناء كل من الفهرسة والبحث، يقوم مُحلل الرموز تلقائيًا بتحديد المحلل المناسب بناءً على اللغة المكتشفة، ويعود إلى التكوين الافتراضي الخاص بك عندما يكون الاكتشاف غير مؤكد.</p>
<p><strong>مثالي لـ</strong> البيئات الديناميكية ذات الخلط اللغوي غير المتوقع، أو منصات المحتوى التي ينشئها المستخدم، أو التطبيقات التي لا يمكن فيها وضع علامات اللغة يدويًا.</p>
<p><strong>المفاضلة:</strong> يضيف الاكتشاف التلقائي وقتًا إضافيًا للمعالجة وقد يواجه صعوبات في النصوص القصيرة جدًا أو المحتوى المختلط اللغات. لكن بالنسبة لمعظم التطبيقات الواقعية، فإن الملاءمة تفوق هذه القيود بشكل كبير.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. رمز ICU Tokenizer: الأساس العالمي</h3><p>إذا كنت تشعر أن الخيارين الأولين مبالغ فيهما، فلدينا شيء أبسط لك. لقد قمنا حديثًا بدمج<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> أداة ترميز ICU (المكونات الدولية لليونيكود)</a> في Milvus 2.6. لقد كانت ICU موجودة منذ زمن طويل - إنها مجموعة ناضجة ومستخدمة على نطاق واسع من المكتبات التي تتعامل مع معالجة النصوص للعديد من اللغات والنصوص. الشيء الرائع هو أنه يمكنه التعامل مع مختلف اللغات المعقدة والبسيطة في آن واحد.</p>
<p>إن أداة الترميز ICU هي بصراحة خيار افتراضي رائع. فهو يستخدم قواعد يونيكود القياسية لتقسيم الكلمات، مما يجعله موثوقًا لعشرات اللغات التي لا تمتلك أدوات ترميز متخصصة خاصة بها. إذا كنت تحتاج فقط إلى شيء قوي وعام الأغراض يعمل بشكل جيد عبر لغات متعددة، فإن ICU يقوم بالمهمة.</p>
<p><strong>القيود:</strong> لا تزال وحدة ICU تعمل ضمن محلل واحد، لذا فإن جميع لغاتك في نهاية المطاف تشترك في نفس المرشحات. هل تريد القيام بأشياء خاصة بلغة معينة مثل الجذع أو اللمط؟ ستواجه نفس التعارضات التي تحدثنا عنها سابقًا.</p>
<p><strong>حيث تتألق حقًا:</strong> لقد صممنا وحدة ICU لتعمل كمحلل افتراضي ضمن إعدادات معرفات اللغات المتعددة أو معرفات اللغات. إنه في الأساس شبكة أمان ذكية للتعامل مع اللغات التي لم تقم بتكوينها بشكل صريح.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">شاهده أثناء العمل: عرض توضيحي عملي<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>كفى نظرية - دعنا نتعمق في بعض الشيفرات البرمجية! فيما يلي كيفية استخدام الميزات الجديدة متعددة اللغات في <strong>pymilvus</strong> لإنشاء مجموعة بحث متعددة اللغات.</p>
<p>سنبدأ بتحديد بعض تكوينات المحلّل القابلة لإعادة الاستخدام، ثم سنستعرض <strong>مثالين كاملين</strong>:</p>
<ul>
<li><p>استخدام <strong>المحلل متعدد اللغات</strong></p></li>
<li><p>استخدام <strong>أداة ترميز معرّف اللغة</strong></p></li>
</ul>
<p>👉 للحصول على الشيفرة التوضيحية الكاملة، راجع <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">صفحة GitHub هذه</a>.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">الخطوة 1: إعداد عميل ميلفوس</h3><p><em>أولاً، نتصل بـ Milvus، ونقوم بتعيين اسم مجموعة، وننظف أي مجموعات موجودة لنبدأ من جديد.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">الخطوة 2: تعريف المحللين للغات المتعددة</h3><p>بعد ذلك، نقوم بتعريف قاموس <code translate="no">analyzers</code> مع تكوينات خاصة بكل لغة. سيتم استخدام هذه في كلتا طريقتي البحث متعدد اللغات الموضحة لاحقًا.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">الخيار أ: استخدام محلل متعدد اللغات</h3><p>هذه الطريقة هي الأفضل عندما <strong>تعرف لغة كل مستند مسبقاً</strong>. ستقوم بتمرير تلك المعلومات من خلال حقل مخصص <code translate="no">language</code> أثناء إدراج البيانات.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">إنشاء مجموعة باستخدام محلل متعدد اللغات</h4><p>سننشئ مجموعة حيث يستخدم الحقل <code translate="no">&quot;text&quot;</code> محللًا مختلفًا بناءً على قيمة الحقل <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">إدراج بيانات متعددة اللغات وتحميل المجموعة</h4><p>الآن أدخل المستندات باللغتين الإنجليزية واليابانية. يقوم الحقل <code translate="no">language</code> بإخبار ميلفوس بالمحلل الذي يجب استخدامه.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">تشغيل البحث بالنص الكامل</h4><p>للبحث، حدد أي محلل لاستخدامه في الاستعلام بناءً على لغته.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">النتائج:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">الخيار ب: استخدام أداة ترميز معرّف اللغة</h3><p>يُخرج هذا الأسلوب التعامل اليدوي مع اللغة من بين يديك. يكتشف <strong>أداة ترميز معرّف اللغة</strong> تلقائيًا لغة كل مستند ويطبق المحلل الصحيح - لا حاجة لتحديد حقل <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">إنشاء مجموعة باستخدام أداة ترميز معرّف اللغة</h4><p>هنا، ننشئ مجموعة حيث يستخدم الحقل <code translate="no">&quot;text&quot;</code> الكشف التلقائي للغة لاختيار المحلل الصحيح.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">إدراج البيانات وتحميل المجموعة</h4><p>إدراج نص بلغات مختلفة - لا حاجة لتسميتها. يقوم ميلفوس باكتشاف المحلل الصحيح وتطبيقه تلقائيًا.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">تشغيل بحث بالنص الكامل</h4><p>إليك أفضل جزء: <strong>لا حاجة لتحديد محلل</strong> عند البحث. يكتشف أداة الترميز لغة الاستعلام تلقائيًا ويطبق المنطق الصحيح.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">النتائج</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>يخطو Milvus 2.6 خطوة كبيرة إلى الأمام في جعل <strong>البحث الهجين</strong> أكثر قوة وسهولة في الوصول إليه، حيث يجمع بين البحث المتجه والبحث بالكلمات الرئيسية، والآن عبر لغات متعددة. مع الدعم المحسّن متعدد اللغات، يمكنك إنشاء تطبيقات تفهم <em>ما يعنيه المستخدمون</em> <em>وما يقولونه</em> بغض النظر عن اللغة التي يستخدمونها.</p>
<p>ولكن هذا جزء واحد فقط من التحديث. يجلب Milvus 2.6 أيضًا العديد من الميزات الأخرى التي تجعل البحث أسرع وأكثر ذكاءً وأسهل في العمل:</p>
<ul>
<li><p><strong>مطابقة أفضل للاستعلام</strong> - استخدم <code translate="no">phrase_match</code> و <code translate="no">multi_match</code> لعمليات بحث أكثر دقة</p></li>
<li><p><strong>تصفية أسرع</strong> لحقول<strong>JSON</strong> - بفضل فهرس جديد مخصص لحقول JSON</p></li>
<li><p><strong>الفرز القائم على العددية</strong> - فرز النتائج حسب أي حقل رقمي</p></li>
<li><p><strong>إعادة الترتيب المتقدم</strong> - إعادة ترتيب النتائج باستخدام النماذج أو منطق التسجيل المخصص</p></li>
</ul>
<p>هل تريد التفاصيل الكاملة لميلفوس 2.6؟ اطلع على أحدث منشوراتنا: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>تقديم ميلفوس 2.6: بحث متجه ميسور التكلفة على نطاق المليار</strong></a><strong>.</strong></p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
