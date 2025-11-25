---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: 'OpenAgents x Milvus: كيفية بناء أنظمة متعددة الوكلاء أكثر ذكاءً تتشارك الذاكرة'
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  اكتشف كيفية تمكين OpenAgents من التعاون الموزع متعدد الوكلاء وسبب أهمية Milvus
  لإضافة ذاكرة قابلة للتطوير، وكيفية بناء نظام كامل.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>يبدأ معظم المطورين أنظمتهم الوكالية بوكيل واحد ويدركون لاحقًا أنهم قاموا ببناء روبوت محادثة مكلف للغاية. بالنسبة للمهام البسيطة، يعمل الوكيل على غرار ReAct بشكل جيد، لكنه سرعان ما يصل إلى حدود: لا يمكنه تشغيل الخطوات بالتوازي، ويفقد مسار سلاسل التفكير الطويلة، ويميل إلى الانهيار بمجرد إضافة الكثير من الأدوات إلى المزيج. تعد الإعدادات متعددة الوكلاء بإصلاح هذا الأمر، لكنها تجلب مشاكلها الخاصة: نفقات التنسيق الزائدة، وعمليات التسليم الهشة، وتضخم السياق المشترك الذي يؤدي إلى تآكل جودة النموذج بهدوء.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> هو إطار عمل مفتوح المصدر لبناء أنظمة متعددة الوكلاء يعمل فيها وكلاء الذكاء الاصطناعي معاً، ويتشاركون الموارد، ويتعاملون مع مشاريع طويلة الأمد ضمن مجتمعات مستمرة. فبدلاً من وجود منسق مركزي واحد، يتيح OpenAgents للوكلاء التعاون بطريقة أكثر توزيعاً: يمكنهم اكتشاف بعضهم البعض والتواصل والتنسيق حول الأهداف المشتركة.</p>
<p>وبالاقتران مع قاعدة بيانات <a href="https://milvus.io/">Milvus</a> المتجهة، يكتسب خط الأنابيب هذا طبقة ذاكرة طويلة الأجل قابلة للتطوير وعالية الأداء. تعمل Milvus على تشغيل ذاكرة الوكلاء من خلال البحث الدلالي السريع، وخيارات الفهرسة المرنة مثل HNSW و IVF، والعزل النظيف من خلال التقسيم، بحيث يمكن للوكلاء تخزين واسترجاع وإعادة استخدام المعرفة دون الغرق في السياق أو التعدي على بيانات بعضهم البعض.</p>
<p>سنستعرض في هذا المنشور كيفية تمكين OpenAgents من التعاون الموزع متعدد الوكلاء، ولماذا يعتبر Milvus أساسًا مهمًا لذاكرة الوكيل القابلة للتطوير، وكيفية تجميع مثل هذا النظام خطوة بخطوة.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">التحديات في بناء أنظمة الوكلاء في العالم الحقيقي<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>يتم بناء العديد من أطر عمل الوكلاء السائدة اليوم - مثل LangChain و AutoGen و CrewAI وغيرها - حول نموذج <strong>يركز على المهام</strong>. يمكنك تشغيل مجموعة من الوكلاء، ومنحهم مهمة، وربما تحديد سير العمل، والسماح لهم بالعمل. يعمل هذا بشكل جيد لحالات الاستخدام الضيقة أو قصيرة الأجل، ولكن في بيئات الإنتاج الحقيقية، فإنه يكشف عن ثلاثة قيود هيكلية:</p>
<ul>
<li><p><strong>تظل المعرفة منعزلة.</strong> تقتصر خبرة الوكيل على عملية النشر الخاصة به. وكيل مراجعة التعليمات البرمجية في قسم الهندسة لا يشارك ما يتعلمه مع وكيل فريق المنتج الذي يقوم بتقييم الجدوى. وينتهي الأمر بكل فريق إلى إعادة بناء المعرفة من الصفر، وهو أمر غير فعال وهش في نفس الوقت.</p></li>
<li><p><strong>التعاون جامد.</strong> حتى في الأطر متعددة الوكلاء، يعتمد التعاون عادةً على سير العمل المحدد مسبقاً. عندما يحتاج التعاون إلى التغيير، لا يمكن لهذه القواعد الثابتة أن تتكيف، مما يجعل النظام بأكمله أقل مرونة.</p></li>
<li><p><strong>عدم وجود حالة ثابتة.</strong> يتبع معظم الوكلاء دورة حياة بسيطة: <em>البدء ← التنفيذ ← الإغلاق.</em> ينسون كل شيء بين عمليات التشغيل - السياق والعلاقات والقرارات المتخذة وتاريخ التفاعل. بدون حالة مستمرة، لا يمكن للوكلاء بناء ذاكرة طويلة الأمد أو تطوير سلوكهم.</p></li>
</ul>
<p>تأتي هذه المشكلات الهيكلية من التعامل مع الوكلاء كمنفذين معزولين للمهام بدلاً من مشاركين في شبكة تعاونية أوسع.</p>
<p>يعتقد فريق OpenAgents أن أنظمة الوكلاء المستقبلية تحتاج إلى أكثر من مجرد التفكير المنطقي الأقوى - فهي تحتاج إلى آلية تمكّن الوكلاء من اكتشاف بعضهم البعض وبناء العلاقات ومشاركة المعرفة والعمل معًا بشكل ديناميكي. والأهم من ذلك، يجب ألا يعتمد ذلك على وحدة تحكم مركزية واحدة. تعمل شبكة الإنترنت لأنها موزعة - لا توجد عقدة واحدة تملي كل شيء، ويصبح النظام أكثر قوة وقابلية للتطوير مع نموه. تستفيد الأنظمة متعددة الوكلاء من نفس مبدأ التصميم. وهذا هو السبب في أن OpenAgents يزيل فكرة وجود منسق قوي للغاية ويتيح بدلاً من ذلك التعاون اللامركزي القائم على الشبكة.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">ما هو OpenAgents؟<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents هو إطار عمل مفتوح المصدر لبناء شبكات وكلاء الذكاء الاصطناعي التي تتيح التعاون المفتوح، حيث يعمل وكلاء الذكاء الاصطناعي معًا، ويتشاركون الموارد، ويتعاملون مع مشاريع طويلة المدى. وهو يوفر البنية التحتية لإنترنت الوكلاء - حيث يتعاون الوكلاء بشكل مفتوح مع ملايين الوكلاء الآخرين في مجتمعات مستمرة ومتنامية. على المستوى التقني، يتمحور النظام حول ثلاثة مكونات أساسية: <strong>شبكة الوكلاء، وتعديلات الشبكة، والنقل.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. شبكة الوكلاء: بيئة مشتركة للتعاون</h3><p>شبكة الوكيل هي بيئة مشتركة حيث يمكن للعديد من الوكلاء الاتصال والتواصل والعمل معًا لحل المهام المعقدة. وتشمل خصائصها الأساسية ما يلي:</p>
<ul>
<li><p><strong>التشغيل المستمر:</strong> بمجرد إنشائها، تبقى الشبكة متصلة بالإنترنت بشكل مستقل عن أي مهمة أو سير عمل واحد.</p></li>
<li><p><strong>وكيل ديناميكي:</strong> يمكن للوكلاء الانضمام في أي وقت باستخدام معرّف الشبكة؛ لا يلزم التسجيل المسبق.</p></li>
<li><p><strong>دعم متعدد البروتوكولات:</strong> طبقة تجريد موحدة تدعم الاتصال عبر WebSocket و gRPC و HTTP و libp2p.</p></li>
<li><p><strong>التكوين المستقل:</strong> تحتفظ كل شبكة بالأذونات والحوكمة والموارد الخاصة بها.</p></li>
</ul>
<p>من خلال سطر واحد فقط من التعليمات البرمجية، يمكنك إنشاء شبكة، ويمكن لأي وكيل الانضمام إليها على الفور من خلال واجهات قياسية.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. تعديلات الشبكة: ملحقات قابلة للتوصيل للتعاون</h3><p>توفر التعديلات طبقة معيارية من ميزات التعاون التي تبقى منفصلة عن النظام الأساسي. يمكنك مزج الوحدات النمطية ومطابقتها بناءً على احتياجاتك الخاصة، مما يتيح أنماط تعاون مصممة خصيصاً لكل حالة استخدام.</p>
<table>
<thead>
<tr><th><strong>الوحدات النمطية</strong></th><th><strong>الغرض</strong></th><th><strong>حالات الاستخدام</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>مراسلة مساحة العمل</strong></td><td>التواصل بالرسائل في الوقت الحقيقي</td><td>تدفق الردود والملاحظات الفورية</td></tr>
<tr><td><strong>المنتدى</strong></td><td>مناقشة غير متزامنة</td><td>مراجعات المقترحات، مداولات متعددة الجولات</td></tr>
<tr><td><strong>ويكي</strong></td><td>قاعدة المعرفة المشتركة</td><td>توحيد المعرفة والتعاون في الوثائق</td></tr>
<tr><td><strong>اجتماعي</strong></td><td>الرسم البياني للعلاقات</td><td>توجيه الخبراء، وشبكات الثقة</td></tr>
</tbody>
</table>
<p>تعمل جميع المودات على نظام حدث موحد، مما يجعل من السهل توسيع إطار العمل أو إدخال سلوكيات مخصصة عند الحاجة.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. النقل: قناة اتصال لا تعتمد على البروتوكول</h3><p>وسائل النقل هي بروتوكولات الاتصال التي تسمح للوكلاء غير المتجانسين بالاتصال وتبادل الرسائل داخل شبكة OpenAgents. يدعم OpenAgents العديد من بروتوكولات النقل التي يمكن تشغيلها في وقت واحد داخل نفس الشبكة، بما في ذلك:</p>
<ul>
<li><p><strong>HTTP/REST</strong> للتكامل الواسع والمتعدد اللغات</p></li>
<li><p><strong>WebSocket</strong> للاتصال ثنائي الاتجاه بزمن تأخير منخفض</p></li>
<li><p><strong>gRPC</strong> للاتصالات عالية الأداء RPC المناسبة للمجموعات واسعة النطاق</p></li>
<li><p><strong>libp2p</strong> للربط الشبكي اللامركزي من نظير إلى نظير</p></li>
<li><p><strong>A2A،</strong> وهو بروتوكول ناشئ مصمم خصيصًا للاتصال من وكيل إلى وكيل</p></li>
</ul>
<p>تعمل جميع وسائل النقل من خلال تنسيق رسائل موحد قائم على الأحداث، مما يتيح الترجمة السلسة بين البروتوكولات. لا داعي للقلق بشأن البروتوكول الذي يستخدمه الوكيل النظير - حيث يتعامل إطار العمل مع ذلك تلقائياً. يمكن للوكلاء الذين تم إنشاؤهم بأي لغة أو إطار عمل الانضمام إلى شبكة OpenAgents دون إعادة كتابة التعليمات البرمجية الحالية.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">تكامل OpenAgents مع Milvus للذاكرة العميلة طويلة المدى<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>يعمل OpenAgents على حل التحدي المتمثل في كيفية <strong>تواصل</strong>الوكلاء <strong>واكتشاف بعضهم البعض والتعاون فيما بينهم - ولكن</strong>التعاون وحده لا يكفي. يولد الوكلاء رؤى وقرارات وسجل المحادثات ونتائج الأدوات والمعرفة الخاصة بالمجال. بدون طبقة ذاكرة مستمرة، يتبخر كل ذلك في اللحظة التي يتوقف فيها الوكيل عن العمل.</p>
<p>هنا تصبح <strong>Milvus</strong> ضرورية. يوفر Milvus التخزين المتجه عالي الأداء والاسترجاع الدلالي اللازم لتحويل تفاعلات الوكيل إلى ذاكرة دائمة وقابلة لإعادة الاستخدام. عند دمجه في شبكة OpenAgents، فإنه يوفر ثلاث مزايا رئيسية:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. البحث الدلالي</strong></h4><p>يوفر Milvus بحثًا دلاليًا سريعًا باستخدام خوارزميات الفهرسة مثل HNSW و IVF_FLAT. يمكن للوكلاء استرجاع السجلات التاريخية الأكثر صلة بناءً على المعنى بدلاً من الكلمات المفتاحية، مما يمكّنهم من:</p>
<ul>
<li><p>استرجاع القرارات أو الخطط السابقة</p></li>
<li><p>تجنب تكرار العمل</p></li>
<li><p>الحفاظ على سياق طويل المدى عبر الجلسات.</p></li>
</ul>
<p>هذا هو العمود الفقري <em>لذاكرة الوكلاء</em>: استرجاع سريع وذو صلة بالموضوع وسياقه.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. قابلية التوسع الأفقي على نطاق المليار</strong></h4><p>تولد شبكات الوكلاء الحقيقية كميات هائلة من البيانات. تم تصميم Milvus ليعمل بشكل مريح على هذا النطاق، حيث يوفر:</p>
<ul>
<li><p>التخزين والبحث على مليارات المتجهات,</p></li>
<li><p>&lt; زمن استجابة أقل من 30 مللي ثانية حتى في ظل الاسترجاع عالي الإنتاجية من أعلى-ك,</p></li>
<li><p>بنية موزعة بالكامل تتوسع خطياً مع تزايد الطلب.</p></li>
</ul>
<p>وسواء كان لديك عشرات الوكلاء أو آلاف الوكلاء الذين يعملون بالتوازي، فإن Milvus يحافظ على سرعة الاسترجاع واتساقه.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. عزل متعدد المستأجرين</strong></h4><p>توفر Milvus عزلًا دقيقًا متعدد المستأجرين من خلال <strong>مفتاح التقسيم،</strong> وهي آلية تقسيم خفيفة الوزن تعمل على تقسيم الذاكرة داخل مجموعة واحدة. وهذا يسمح بـ</p>
<ul>
<li><p>لفرق أو مشاريع أو مجتمعات وكلاء مختلفة بالحفاظ على مساحات ذاكرة مستقلة,</p></li>
<li><p>نفقات أقل بشكل كبير مقارنةً بالحفاظ على مجموعات متعددة,</p></li>
<li><p>استرجاع اختياري عبر الأقسام عند الحاجة إلى معرفة مشتركة.</p></li>
</ul>
<p>هذا العزل أمر بالغ الأهمية لعمليات النشر الكبيرة متعددة الوكلاء حيث يجب احترام حدود البيانات دون المساس بسرعة الاسترجاع.</p>
<p>يتصل OpenAgents بـ Milvus من خلال <strong>نماذج مخصصة</strong> تستدعي واجهات برمجة تطبيقات Milvus مباشرةً. يتم تضمين رسائل الوكيل، ومخرجات الأدوات، وسجلات التفاعل تلقائيًا في النواقل وتخزينها في Milvus. يمكن للمطورين تخصيص</p>
<ul>
<li><p>نموذج التضمين</p></li>
<li><p>مخطط التخزين والبيانات الوصفية</p></li>
<li><p>واستراتيجيات الاسترجاع (مثل البحث الهجين والبحث المجزأ).</p></li>
</ul>
<p>وهذا يمنح كل مجتمع وكلاء طبقة ذاكرة قابلة للتطوير، ومستمرة، ومحسّنة للاستدلال الدلالي.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">كيفية بناء روبوت محادثة متعدد الوكلاء باستخدام OpenAgent و Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>لجعل الأمور ملموسة، دعونا نستعرض عرضًا توضيحيًا: بناء <strong>مجتمع دعم المطورين</strong> حيث يتعاون العديد من الوكلاء المتخصصين - خبراء بايثون وخبراء قواعد البيانات ومهندسي DevOps وغيرهم - للإجابة على الأسئلة التقنية. فبدلاً من الاعتماد على وكيل واحد متخصص، يساهم كل خبير في التفكير المنطقي الخاص بالمجال، ويقوم النظام بتوجيه الاستفسارات إلى الوكيل الأنسب تلقائياً.</p>
<p>يوضح هذا المثال كيفية دمج <strong>Milvus</strong> في نشر OpenAgents لتوفير ذاكرة طويلة الأجل للأسئلة والأجوبة التقنية. يتم تحويل جميع محادثات الوكلاء والحلول السابقة وسجلات استكشاف الأخطاء وإصلاحها واستفسارات المستخدم إلى تضمينات متجهة وتخزينها في Milvus، مما يمنح الشبكة القدرة على:</p>
<ul>
<li><p>تذكّر الإجابات السابقة</p></li>
<li><p>إعادة استخدام التفسيرات التقنية السابقة</p></li>
<li><p>الحفاظ على الاتساق عبر الجلسات، و</p></li>
<li><p>التحسين بمرور الوقت مع تراكم المزيد من التفاعلات.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li><p>python3.11+</p></li>
<li><p>كوندا</p></li>
<li><p>المفتاح المفتوح</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. تحديد التبعيات</h3><p>تحديد حزم بايثون المطلوبة للمشروع:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. متغيرات البيئة</h3><p>فيما يلي نموذج لتكوين بيئتك:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. تكوين شبكة الوكلاء المفتوحين الخاصة بك</h3><p>حدد بنية شبكة وكيلك وإعدادات الاتصال الخاصة بها:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. تنفيذ التعاون متعدد الوكلاء</h3><p>فيما يلي مقتطفات التعليمات البرمجية الأساسية (وليس التنفيذ الكامل).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. إنشاء بيئة افتراضية وتفعيلها</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>تثبيت التبعيات</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>تكوين مفاتيح API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>بدء تشغيل شبكة الوكلاء المفتوحين</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>بدء تشغيل خدمة الوكلاء المتعددين</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>بدء تشغيل OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>الوصول إلى الاستوديو</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تحقق من حالة وكلائك وشبكتك:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>يوفر OpenAgents طبقة التنسيق التي تسمح للوكلاء باكتشاف بعضهم البعض والتواصل والتعاون، بينما يحل Milvus المشكلة التي لا تقل أهمية وهي كيفية تخزين المعرفة ومشاركتها وإعادة استخدامها. ومن خلال توفير طبقة ذاكرة متجهة عالية الأداء، تُمكِّن Milvus الوكلاء من بناء سياق مستمر، واستدعاء التفاعلات السابقة، وتجميع الخبرات بمرور الوقت. ويدفعان معًا أنظمة الذكاء الاصطناعي إلى ما وراء حدود النماذج المعزولة نحو الإمكانات التعاونية الأعمق لشبكة حقيقية متعددة الوكلاء.</p>
<p>بالطبع، لا توجد بنية متعددة الوكلاء بدون مقايضات. إذ يمكن أن يؤدي تشغيل الوكلاء بالتوازي إلى زيادة استهلاك الرمز المميز، وقد تتعاقب الأخطاء عبر الوكلاء، ويمكن أن يؤدي اتخاذ القرارات المتزامنة إلى تعارضات عرضية. هذه مجالات نشطة للبحث والتحسين المستمر - لكنها لا تقلل من قيمة بناء أنظمة يمكنها التنسيق والتذكر والتطور.</p>
<p>🚀 هل أنت مستعد لمنح وكلائك ذاكرة طويلة المدى؟</p>
<p>استكشف <a href="https://milvus.io/">ميلفوس</a> وحاول دمجه مع سير عملك الخاص.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات على أسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
