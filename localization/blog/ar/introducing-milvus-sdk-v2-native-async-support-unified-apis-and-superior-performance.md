---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  تقديم Milvus SDK الإصدار 2: دعم التزامن الأصلي وواجهات برمجة التطبيقات الموحدة
  والأداء المتفوق
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  جرب Milvus SDK الإصدار 2، أعيد تصوره للمطورين! استمتع بواجهة برمجة تطبيقات
  موحّدة، ودعم المزامنة الأصلي، وأداء محسّن لمشاريع البحث المتجه.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">خلاصة القول<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد تحدثتم، واستمعنا إليكم! إن Milvus SDK v2 هو إعادة تصور كامل لتجربة المطورين لدينا، تم تصميمه مباشرةً من ملاحظاتكم. مع واجهة برمجة تطبيقات موحدة عبر Python وJava وGo وNode.js، ودعم المزامنة الأصلي الذي كنتم تطلبونه، وذاكرة تخزين مؤقت للمخطط معززة للأداء، وواجهة MilvusClient مبسطة، يجعل Milvus SDK v2 تطوير <a href="https://zilliz.com/learn/vector-similarity-search">البحث المتجه</a> أسرع وأكثر سهولة من أي وقت مضى. سواء كنت تقوم ببناء تطبيقات <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> أو أنظمة التوصية أو حلول <a href="https://zilliz.com/learn/what-is-computer-vision">الرؤية الحاسوبية،</a> فإن هذا التحديث الذي يحركه المجتمع سيغير طريقة عملك مع Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">لماذا قمنا ببنائه: معالجة مشاكل المجتمع<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>على مر السنين، أصبحت Milvus <a href="https://milvus.io/blog/what-is-a-vector-database.md">قاعدة البيانات المتجهة</a> المفضلة لآلاف تطبيقات الذكاء الاصطناعي. ومع ذلك، مع نمو مجتمعنا، سمعنا باستمرار عن العديد من القيود في الإصدار الأول من SDK الخاص بنا:</p>
<p><strong>"التعامل مع التزامن العالي معقد للغاية."</strong> أجبر الافتقار إلى دعم التزامن الأصلي في بعض حزم SDK اللغوية المطورين على الاعتماد على سلاسل الرسائل أو عمليات الاستدعاء، مما جعل إدارة التعليمات البرمجية وتصحيح الأخطاء أكثر صعوبة، خاصةً في سيناريوهات مثل تحميل البيانات المجمعة والاستعلامات المتوازية.</p>
<p><strong>"يتدهور الأداء مع التوسع."</strong> من دون ذاكرة التخزين المؤقت للمخطط، كان الإصدار 1 يقوم بالتحقق من صحة المخططات بشكل متكرر أثناء العمليات، مما يخلق اختناقات لأحمال العمل ذات الحجم الكبير. في حالات الاستخدام التي تتطلب معالجة متجهية ضخمة، أدت هذه المشكلة إلى زيادة وقت الاستجابة وانخفاض الإنتاجية.</p>
<p><strong>"تخلق الواجهات غير المتسقة بين اللغات منحنى تعليمي حاد."</strong> قامت مجموعات تطوير البرمجيات SDK باللغات المختلفة بتنفيذ الواجهات بطرقها الخاصة، مما أدى إلى تعقيد عملية التطوير عبر اللغات.</p>
<p><strong>"تفتقد واجهة برمجة تطبيقات RESTful API إلى ميزات أساسية."</strong> كانت الوظائف الأساسية مثل إدارة الأقسام وإنشاء الفهرس غير متوفرة، مما أجبر المطورين على التبديل بين حزم SDK المختلفة.</p>
<p>لم تكن هذه مجرد طلبات ميزات، بل كانت عقبات حقيقية في سير عمل التطوير. SDK الإصدار 2 هو وعدنا بإزالة هذه العوائق والسماح لك بالتركيز على ما هو مهم: إنشاء تطبيقات ذكاء اصطناعي مذهلة.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">الحل: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>إن Milvus SDK v2 هو نتيجة إعادة تصميم كاملة تركز على تجربة المطورين، وهي متاحة بلغات متعددة:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. الدعم الأصلي غير المتزامن: من المعقد إلى المتزامن</h3><p>كانت الطريقة القديمة للتعامل مع التزامن تنطوي على كائنات مستقبلية مرهقة وأنماط رد الاتصال. تقدم SDK الإصدار 2 وظيفة مزامنة/انتظار حقيقية، خاصةً في Python مع <code translate="no">AsyncMilvusClient</code> (منذ الإصدار 2.5.3). باستخدام نفس المعلمات مثل MilvusClient المتزامن، يمكنك بسهولة تشغيل عمليات مثل الإدراج والاستعلام والبحث بالتوازي.</p>
<p>يحل هذا النهج المبسط محل أنماط المستقبل وردود الفعل المرهقة القديمة، مما يؤدي إلى شيفرة أنظف وأكثر كفاءة. يمكن الآن تنفيذ المنطق المتزامن المعقد، مثل عمليات الإدراج المتجهية المجمعة أو الاستعلامات المتعددة المتوازية بسهولة باستخدام أدوات مثل <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. ذاكرة التخزين المؤقت للمخطط: تعزيز الأداء حيثما كان ذلك مهمًا</h3><p>يقدم SDK الإصدار 2 ذاكرة التخزين المؤقت للمخطط التي تخزن مخططات المجموعة محليًا بعد عملية الجلب الأولية، مما يلغي طلبات الشبكة المتكررة والنفقات الزائدة لوحدة المعالجة المركزية أثناء العمليات.</p>
<p>بالنسبة لسيناريوهات الإدراج والاستعلام عالية التردد، يُترجم هذا التحديث إلى:</p>
<ul>
<li><p>تقليل حركة مرور الشبكة بين العميل والخادم</p></li>
<li><p>زمن انتقال أقل للعمليات</p></li>
<li><p>انخفاض استخدام وحدة المعالجة المركزية من جانب الخادم</p></li>
<li><p>تحجيم أفضل في ظل التزامن العالي</p></li>
</ul>
<p>يعد هذا الأمر ذا قيمة خاصة للتطبيقات مثل أنظمة التوصيات في الوقت الفعلي أو ميزات البحث المباشر حيث تكون أجزاء من الثانية مهمة.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. تجربة موحدة ومبسطة لواجهة برمجة التطبيقات</h3><p>تقدم Milvus SDK v2 تجربة موحدة وأكثر اكتمالاً لواجهة برمجة التطبيقات عبر جميع لغات البرمجة المدعومة. على وجه الخصوص، تم تحسين واجهة برمجة التطبيقات RESTful API بشكل كبير لتقديم ما يقرب من التكافؤ في الميزات مع واجهة gRPC.</p>
<p>في الإصدارات السابقة، كانت واجهة RESTful API متخلفة عن واجهة gRPC، مما يحد مما يمكن للمطورين القيام به دون تبديل الواجهات. لم يعد الأمر كذلك. الآن، يمكن للمطورين استخدام واجهة برمجة تطبيقات RESTful API لتنفيذ جميع العمليات الأساسية تقريبًا - مثل إنشاء المجموعات وإدارة الأقسام وإنشاء الفهارس وتشغيل الاستعلامات - دون الحاجة إلى الرجوع إلى gRPC أو طرق أخرى.</p>
<p>يضمن هذا النهج الموحد تجربة مطورين متسقة عبر بيئات وحالات استخدام مختلفة. فهو يقلل من منحنى التعلم، ويبسط التكامل، ويحسن قابلية الاستخدام بشكل عام.</p>
<p>ملاحظة: بالنسبة لمعظم المستخدمين، توفر واجهة برمجة تطبيقات RESTful API طريقة أسرع وأسهل لبدء استخدام Milvus. ومع ذلك، إذا كان التطبيق الخاص بك يتطلب أداءً عاليًا أو ميزات متقدمة مثل المكررات، يظل عميل gRPC هو الخيار المفضل لتحقيق أقصى قدر من المرونة والتحكم.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. تصميم SDK متناسق عبر جميع اللغات</h3><p>مع Milvus SDK الإصدار 2، قمنا بتوحيد تصميم حزم SDK الخاصة بنا عبر جميع لغات البرمجة المدعومة لتقديم تجربة أكثر اتساقًا للمطورين.</p>
<p>سواء كنت تقوم بالبناء باستخدام Python أو Java أو Go أو Node.js، فإن كل مجموعة تطوير البرمجيات SDK تتبع الآن بنية موحدة تتمحور حول فئة MilvusClient. تجلب إعادة التصميم هذه تسمية متسقة للطريقة وتنسيق المعلمات وأنماط الاستخدام الشاملة لكل لغة ندعمها. (انظر: <a href="https://github.com/milvus-io/milvus/discussions/33979">تحديث مثال على كود MilvusClient SDK - مناقشة GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الآن، بمجرد أن تكون معتادًا على Milvus في لغة ما، يمكنك التبديل بسهولة إلى لغة أخرى دون الحاجة إلى إعادة تعلم كيفية عمل SDK. هذه المواءمة لا تبسّط عملية الإعداد فحسب، بل تجعل التطوير متعدد اللغات أكثر سلاسة وبديهية.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. PyMilvus PyMilvus (Python SDK) أبسط وأذكى مع <code translate="no">MilvusClient</code></h3><p>في الإصدار السابق، اعتمدت PyMilvus في الإصدار السابق على تصميم على غرار ORM الذي قدم مزيجًا من النهج الموجه للكائنات والنهج الإجرائية. كان على المطورين تعريف كائنات <code translate="no">FieldSchema</code> ، وإنشاء <code translate="no">CollectionSchema</code> ، ثم إنشاء فئة <code translate="no">Collection</code> - كل ذلك فقط لإنشاء مجموعة. لم تكن هذه العملية مطولة فحسب، بل قدمت أيضًا منحنى تعليمي أكثر حدة للمستخدمين الجدد.</p>
<p>مع واجهة <code translate="no">MilvusClient</code> الجديدة، أصبحت الأمور أبسط بكثير. يمكنك الآن إنشاء مجموعة في خطوة واحدة باستخدام طريقة <code translate="no">create_collection()</code>. يسمح لك بتعريف المخطط بسرعة عن طريق تمرير معلمات مثل <code translate="no">dimension</code> و <code translate="no">metric_type</code> ، أو لا يزال بإمكانك استخدام كائن مخطط مخصص إذا لزم الأمر.</p>
<p>والأفضل من ذلك، يدعم <code translate="no">create_collection()</code> إنشاء الفهرس كجزء من نفس الاستدعاء. إذا تم توفير معلمات الفهرس، فسيقوم ميلفوس تلقائيًا بإنشاء الفهرس وتحميل البيانات في الذاكرة - لا حاجة لاستدعاءات منفصلة <code translate="no">create_index()</code> أو <code translate="no">load()</code>. طريقة واحدة تقوم بكل شيء: <em>إنشاء مجموعة ← إنشاء فهرس ← تحميل مجموعة.</em></p>
<p>يقلل هذا النهج المبسط من تعقيدات الإعداد ويجعل من الأسهل بكثير البدء في استخدام Milvus، خاصة للمطورين الذين يريدون مسارًا سريعًا وفعالًا للنماذج الأولية أو الإنتاج.</p>
<p>توفر وحدة <code translate="no">MilvusClient</code> الجديدة مزايا واضحة في سهولة الاستخدام والاتساق والأداء. بينما تظل واجهة ORM القديمة متاحة في الوقت الحالي، فإننا نخطط لإلغائها تدريجيًا في المستقبل (انظر <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">المرجع</a>). نوصي بشدة بالترقية إلى SDK الجديدة للاستفادة الكاملة من التحسينات.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. وثائق أكثر وضوحاً وشمولاً</h3><p>قمنا بإعادة هيكلة وثائق المنتج لتوفير <a href="https://milvus.io/docs">مرجع</a> أكثر اكتمالاً ووضوحاً <a href="https://milvus.io/docs">لواجهة برمجة التطبيقات</a>. تتضمن أدلة المستخدم الآن نماذج من التعليمات البرمجية متعددة اللغات، مما يتيح لك البدء بسرعة وفهم ميزات Milvus بسهولة. بالإضافة إلى ذلك، يمكن لمساعد Ask AI المتاح على موقع التوثيق الخاص بنا تقديم ميزات جديدة، وشرح الآليات الداخلية، وحتى المساعدة في إنشاء أو تعديل نموذج التعليمات البرمجية، مما يجعل رحلتك عبر الوثائق أكثر سلاسة ومتعة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. خادم ميلفوس MCP: مصمم لمستقبل تكامل الذكاء الاصطناعي</h3><p>إن <a href="https://github.com/zilliztech/mcp-server-milvus">خادم MCP</a> Server، المبني على رأس مجموعة أدوات تطوير البرمجيات Milvus SDK، هو إجابتنا على حاجة متزايدة في النظام البيئي للذكاء الاصطناعي: التكامل السلس بين نماذج اللغة الكبيرة<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>) <a href="https://milvus.io/blog/what-is-a-vector-database.md">وقواعد البيانات المتجهة</a> والأدوات الخارجية أو مصادر البيانات. وهي تطبق بروتوكول سياق النموذج (MCP)، مما يوفر واجهة موحدة وذكية لتنسيق عمليات Milvus وما بعدها.</p>
<p>نظرًا لأن <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">وكلاء الذكاء الاصطناعي</a> أصبحوا أكثر قدرة - ليس فقط على توليد التعليمات البرمجية ولكن أيضًا إدارة الخدمات الخلفية بشكل مستقل - فإن الطلب على بنية تحتية أكثر ذكاءً وقائمة على واجهة برمجة التطبيقات آخذ في الارتفاع. تم تصميم خادم MCP Server مع وضع هذا المستقبل في الاعتبار. فهو يتيح تفاعلات ذكية وآلية مع مجموعات Milvus، مما يبسّط مهام مثل النشر والصيانة وإدارة البيانات.</p>
<p>والأهم من ذلك أنه يضع الأساس لنوع جديد من التعاون بين الآلات. وباستخدام خادم MCP Server، يمكن لوكلاء الذكاء الاصطناعي استدعاء واجهات برمجة التطبيقات لإنشاء مجموعات ديناميكية وتشغيل الاستعلامات وإنشاء الفهارس وغير ذلك - كل ذلك دون تدخل بشري.</p>
<p>باختصار، لا يحوّل خادم MCP Server Milvus إلى قاعدة بيانات فحسب، بل إلى واجهة خلفية قابلة للبرمجة بالكامل وجاهزة للذكاء الاصطناعي - مما يمهد الطريق لتطبيقات ذكية ومستقلة وقابلة للتطوير.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">الشروع في العمل مع Milvus SDK v2: عينة من التعليمات البرمجية<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>توضّح الأمثلة أدناه كيفية استخدام واجهة PyMilvus (Python SDK v2) الجديدة لإنشاء مجموعة وتنفيذ عمليات غير متزامنة. بالمقارنة مع نهج نمط ORM في الإصدار السابق، فإن هذه الشيفرة أنظف وأكثر اتساقًا وأسهل في العمل.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. إنشاء مجموعة وتعريف المخططات وإنشاء الفهارس وتحميل البيانات باستخدام <code translate="no">MilvusClient</code></h3><p>يوضح مقتطف كود Python أدناه كيفية إنشاء مجموعة وتعريف مخططها وبناء الفهارس وتحميل البيانات - كل ذلك في مكالمة واحدة:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تلغي معلمة <code translate="no">index_params</code> الخاصة بالطريقة <code translate="no">create_collection</code> الحاجة إلى مكالمات منفصلة لـ <code translate="no">create_index</code> و <code translate="no">load_collection</code>- كل شيء يحدث تلقائيًا.</p>
<p>بالإضافة إلى ذلك، يدعم <code translate="no">MilvusClient</code> وضع إنشاء جدول سريع. على سبيل المثال، يمكن إنشاء مجموعة في سطر واحد من التعليمات البرمجية عن طريق تحديد المعلمات المطلوبة فقط:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(ملاحظة المقارنة: في نهج إدارة علاقات العملاء القديم، كان عليك إنشاء <code translate="no">Collection(schema)</code> ، ثم استدعاء <code translate="no">collection.create_index()</code> و <code translate="no">collection.load()</code> بشكل منفصل؛ أما الآن، فإن MilvusClient يبسط العملية برمتها).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. إجراء إدخالات غير متزامنة عالية التزامن مع <code translate="no">AsyncMilvusClient</code></h3><p>يوضح المثال التالي كيفية استخدام <code translate="no">AsyncMilvusClient</code> لإجراء عمليات إدراج متزامنة باستخدام <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>في هذا المثال، يتم استخدام <code translate="no">AsyncMilvusClient</code> لإدراج البيانات بشكل متزامن عن طريق جدولة مهام إدراج متعددة باستخدام <code translate="no">asyncio.gather</code>. تستفيد هذه الطريقة استفادة كاملة من قدرات المعالجة المتزامنة للواجهة الخلفية لميلفوس. على عكس عمليات الإدراج المتزامنة سطراً بسطر في الإصدار الأول، فإن هذا الدعم غير المتزامن الأصلي يزيد بشكل كبير من الإنتاجية.</p>
<p>وبالمثل، يمكنك تعديل الكود لإجراء استعلامات أو عمليات بحث متزامنة - على سبيل المثال، عن طريق استبدال استدعاء الإدراج ب <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. تضمن الواجهة غير المتزامنة في Milvus SDK v2 تنفيذ كل طلب بطريقة غير متوقفة، مما يحقق الاستفادة الكاملة من موارد العميل والخادم.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">الترحيل أصبح سهلاً<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن نعلم أنك قد استثمرت وقتًا في SDK v1، لذا فقد صممنا SDK v2 مع وضع تطبيقاتك الحالية في الاعتبار. تتضمن SDK v2 توافقاً مع الإصدارات السابقة، لذا ستستمر الواجهات الحالية على غرار v1/ORM في العمل لفترة من الوقت. ولكننا نوصي بشدة بالترقية إلى SDK v2 في أقرب وقت ممكن - سينتهي دعم الإصدار v1 مع إصدار الإصدار Milvus 3.0 (نهاية عام 2025).</p>
<p>يتيح الانتقال إلى SDK v2 تجربة أكثر اتساقًا وحداثة للمطورين مع بناء جملة مبسط، ودعم أفضل للمزامنة وتحسين الأداء. وهو أيضًا المكان الذي تتركز فيه جميع الميزات الجديدة ودعم المجتمع من الآن فصاعدًا. تضمن الترقية الآن استعدادك لما هو قادم وتمنحك إمكانية الوصول إلى أفضل ما تقدمه Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>تقدم Milvus SDK v2 تحسينات كبيرة مقارنةً بالإصدار الأول: أداء محسّن، وواجهة موحدة ومتسقة عبر لغات برمجة متعددة، ودعم أصلي غير متزامن يبسط العمليات عالية التردد. مع وثائق أكثر وضوحًا وأمثلة أكواد أكثر سهولة، تم تصميم Milvus SDK v2 لتبسيط عملية التطوير، مما يجعل إنشاء تطبيقات الذكاء الاصطناعي ونشرها أسهل وأسرع.</p>
<p>للحصول على معلومات أكثر تفصيلاً، يُرجى الرجوع إلى أحدث <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">مرجع</a> رسمي لواجهة <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">برمجة التطبيقات وأدلة المستخدم</a>. إذا كانت لديك أي أسئلة أو اقتراحات بشأن مجموعة تطوير البرمجيات الجديدة، فلا تتردد في تقديم ملاحظاتك على <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> و <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. نحن نتطلع إلى مساهماتكم بينما نواصل تحسين Milvus.</p>
