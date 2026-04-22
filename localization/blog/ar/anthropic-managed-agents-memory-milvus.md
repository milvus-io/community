---
id: anthropic-managed-agents-memory-milvus.md
title: كيفية إضافة ذاكرة طويلة الأجل إلى وكلاء أنثروبيك المُدارين مع ميلفوس
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  جعلت الوكلاء المدارة من أنثروبيك الوكلاء موثوقين، ولكن كل جلسة تبدأ فارغة.
  إليك كيفية إقران ميلفوس للاستدعاء الدلالي داخل الجلسة والذاكرة المشتركة عبر
  الوكلاء.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>تجعل <a href="https://www.anthropic.com/engineering/managed-agents">الوكلاء المُدارون</a> من أنثروبيك البنية التحتية للوكيل مرنة. تنجو المهمة المكونة من 200 خطوة الآن من تعطل التسخير أو انتهاء مهلة صندوق الرمل أو تغيير البنية التحتية في منتصف الرحلة دون تدخل بشري، وتفيد أنثروبيك أن الوقت اللازم للرمز الأول p50 انخفض بنسبة 60% تقريبًا وانخفض p95 بأكثر من 90% بعد الفصل.</p>
<p>ما لا تحله الموثوقية هو الذاكرة. لا يمكن لترحيل التعليمات البرمجية المكونة من 200 خطوة التي تصطدم بتعارض تبعية جديد في الخطوة 201 أن تنظر بكفاءة إلى كيفية تعاملها مع الخطوة الأخيرة. لا يملك الوكيل الذي يقوم بفحص الثغرات الأمنية لأحد العملاء أي فكرة عن أن وكيلاً آخر قام بالفعل بحل نفس الحالة قبل ساعة. تبدأ كل جلسة من صفحة فارغة، ولا يمكن للعقول المتوازية الوصول إلى ما قام الآخرون بحله بالفعل.</p>
<p>ويتمثل الحل في إقران <a href="https://milvus.io/">قاعدة بيانات متجهات ميلفوس بقاعدة بيانات المتجهات</a> مع الوكلاء المدارة من أنثروبيك: الاستدعاء الدلالي داخل الجلسة، <a href="https://milvus.io/docs/milvus_for_agents.md">وطبقة ذاكرة متجهة</a> مشتركة عبر الجلسات. يبقى عقد الجلسة دون تغيير، ويحصل التسخير على طبقة واحدة جديدة، وتحصل مهام الوكيل طويل المدى على قدرات مختلفة نوعياً.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">ما حله الوكلاء المُدارون (وما لم يحلوه)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>حلت الوكلاء المُدارة مشكلة الموثوقية من خلال فصل الوكيل إلى ثلاث وحدات مستقلة. أما ما لم تحله فهو الذاكرة، سواء كاستدعاء دلالي داخل جلسة واحدة أو كخبرة مشتركة عبر جلسات متوازية.</strong> إليك ما تم فصله، وأين تقع فجوة الذاكرة داخل هذا التصميم المفصول.</p>
<table>
<thead>
<tr><th>الوحدة النمطية</th><th>ما تقوم به</th></tr>
</thead>
<tbody>
<tr><td><strong>الجلسة</strong></td><td>سجل أحداث ملحق فقط لكل ما حدث. مخزنة خارج التسخير.</td></tr>
<tr><td><strong>تسخير</strong></td><td>الحلقة التي تستدعي كلود وتوجّه استدعاءات أداة كلود إلى البنية التحتية ذات الصلة.</td></tr>
<tr><td><strong>صندوق الرمل</strong></td><td>بيئة التنفيذ المعزولة حيث يقوم كلود بتشغيل الشيفرة وتحرير الملفات.</td></tr>
</tbody>
</table>
<p>إن إعادة التأطير الذي يجعل هذا التصميم يعمل مذكور صراحةً في منشور أنثروبيك:</p>
<p><em>"الجلسة ليست نافذة سياق كلود".</em></p>
<p>نافذة السياق سريعة الزوال: محددة بالرموز، ويعاد بناؤها في كل استدعاء للنموذج، ويتم التخلص منها عند عودة الاستدعاء. تكون جلسة العمل دائمة ومخزنة خارج الحزام، وتمثل نظام السجل للمهمة بأكملها.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>عندما تتعطل الحزام، تبدأ المنصة حزامًا جديدًا باستخدام <code translate="no">wake(sessionId)</code>. تقرأ الحزام الجديد سجل الأحداث عبر <code translate="no">getSession(id)</code> ، وتلتقط المهمة من آخر خطوة مسجلة، دون الحاجة إلى كتابة منطق استرداد مخصص ولا يوجد منطق استرداد مخصص للكتابة ولا مجالسة أطفال على مستوى الجلسة.</p>
<p>ما لا يتناوله منشور الوكلاء المُدارين، ولا يدعي ذلك، هو ما يفعله الوكيل عندما يحتاج إلى تذكر أي شيء. تظهر فجوتان في اللحظة التي تدفع فيها أعباء عمل حقيقية من خلال البنية. أحدهما يعيش داخل جلسة واحدة؛ والآخر يعيش عبر الجلسات.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">المشكلة 1: لماذا تفشل سجلات الجلسات الخطية بعد بضع مئات من الخطوات<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تفشل سجلات الجلسات الخطية بعد بضع مئات من الخطوات لأن القراءات المتسلسلة والبحث الدلالي هما عبء عمل مختلفان بشكل أساسي،</strong> <strong>ولا تخدم واجهة برمجة التطبيقات</strong> <code translate="no">**getEvents()**</code> <strong>سوى الأول.</strong> يكفي التقطيع حسب الموقع أو البحث عن طابع زمني للإجابة على سؤال "أين توقفت هذه الجلسة". لا يكفي للإجابة على السؤال الذي سيحتاج إليه الوكيل بشكل متوقع في أي مهمة طويلة: هل رأينا هذا النوع من المشاكل من قبل، وماذا فعلنا حيال ذلك؟</p>
<p>ضع في اعتبارك ترحيل رمز في الخطوة 200 يصطدم بتعارض تبعية جديد. الخطوة الطبيعية هي النظر إلى الوراء. هل واجه الوكيل شيئًا مشابهًا في وقت سابق في هذه المهمة نفسها؟ ما النهج الذي تمت تجربته؟ هل صمد، أم أنه تراجع عن شيء آخر في نهاية المطاف؟</p>
<p>مع <code translate="no">getEvents()</code> هناك طريقتان للإجابة على ذلك، وكلاهما سيئ:</p>
<table>
<thead>
<tr><th>الخيار</th><th>المشكلة</th></tr>
</thead>
<tbody>
<tr><td>مسح كل حدث بالتتابع</td><td>بطيء عند 200 خطوة غير ممكن عند 2000 خطوة</td></tr>
<tr><td>تفريغ شريحة كبيرة من الدفق في نافذة السياق</td><td>مكلف على الرموز، وغير موثوق به على نطاق واسع، ويزاحم الذاكرة العاملة الفعلية للوكيل للخطوة الحالية.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الجلسة جيدة للاسترداد والتدقيق، لكنها لم تُبنى بفهرس يدعم "هل رأيت هذا من قبل". المهام طويلة المدى حيث يتوقف هذا السؤال عن كونه اختياريًا.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">الحل 1: كيفية إضافة ذاكرة دلالية إلى جلسة عمل الوكيل المُدار<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>إضافة مجموعة ميلفوس إلى جانب سجل الجلسة والكتابة المزدوجة من</strong> <code translate="no">**emitEvent**</code>. يبقى عقد الجلسة دون مساس به، ويكتسب التسخير استعلامًا دلاليًا عن ماضيه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يترك تصميم أنثروبيك مجالاً لهذا بالضبط. ينص منشورهم على أنه "يمكن أيضًا تحويل أي أحداث تم جلبها في التسخير قبل تمريرها إلى نافذة سياق كلود. يمكن أن تكون هذه التحويلات أيًا كان ما يرمز إليه التسخير، بما في ذلك تنظيم السياق... وهندسة السياق." تعيش هندسة السياق في التسخير؛ يجب أن تضمن الجلسة فقط المتانة وقابلية الاستعلام.</p>
<p>النمط: في كل مرة يتم فيها إطلاق <code translate="no">emitEvent</code> ، يحسب التسخير أيضًا <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">تضمين متجه</a> للأحداث التي تستحق الفهرسة ويدرجها في مجموعة ميلفوس.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>عندما يصل الوكيل إلى الخطوة 200 ويحتاج إلى استدعاء قرارات سابقة، يكون الاستعلام عبارة عن <a href="https://zilliz.com/glossary/vector-similarity-search">بحث متجه</a> محدد النطاق لتلك الجلسة:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثلاثة تفاصيل إنتاجية مهمة قبل أن يتم شحنها</p>
<ul>
<li><strong>اختر ما يجب فهرسته.</strong> ليس كل حدث يستحق التضمين. فالحالات الوسيطة لاستدعاء الأدوات، وسجلات إعادة المحاولة، وأحداث الحالة المتكررة تلوث جودة الاسترجاع أسرع من تحسينها. سياسة <code translate="no">INDEXABLE_EVENT_TYPES</code> تعتمد على المهام، وليست عالمية.</li>
<li><strong>حدد حدود الاتساق.</strong> إذا تعطلت الحزام بين إلحاق الجلسة وإدراج ميلفوس، فإن إحدى الطبقتين تتقدم على الأخرى لفترة وجيزة. النافذة صغيرة ولكنها حقيقية. اختر مسارًا للمصالحة (إعادة المحاولة عند إعادة التشغيل، أو سجل الكتابة الأمامي، أو المصالحة النهائية) بدلاً من الأمل.</li>
<li><strong>التحكم في تضمين الإنفاق.</strong> تنتج جلسة من 200 خطوة تستدعي واجهة برمجة تطبيقات التضمين الخارجية بشكل متزامن في كل خطوة فاتورة لم يخطط لها أحد. وضع التضمينات في قائمة الانتظار وإرسالها بشكل غير متزامن على دفعات.</li>
</ul>
<p>مع وجود هذه الخطوات، يستغرق الاستدعاء أجزاء من الثانية للبحث عن المتجهات بالإضافة إلى أقل من 100 مللي ثانية لاستدعاء التضمين. تصل أهم خمسة أحداث سابقة ذات صلة في السياق قبل أن يلاحظ الوكيل الاحتكاك. تحتفظ الجلسة بوظيفتها الأصلية كسجل دائم؛ وتكتسب أداة التسخير القدرة على الاستعلام عن ماضيها بشكل دلالي بدلاً من التسلسل. هذا تغيير متواضع على سطح واجهة برمجة التطبيقات وتغيير هيكلي في ما يمكن للوكيل القيام به في المهام طويلة المدى.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">المشكلة 2: لماذا لا يمكن لوكلاء كلود المتوازيين مشاركة الخبرة<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>لا يمكن لوكلاء كلود المتوازيين مشاركة الخبرة لأن جلسات الوكلاء المدارة معزولة حسب التصميم. نفس العزل الذي يجعل التوسع الأفقي نظيفًا يمنع أيضًا كل دماغ من التعلم من كل دماغ آخر.</strong></p>
<p>في التسخير المنفصل، تكون العقول عديمة الحالة ومستقلة. ويفتح هذا العزل باب الكمون الذي يفوز بتقارير أنثروبيك، كما أنه يبقي كل جلسة تعمل في الظلام عن كل جلسة أخرى.</p>
<p>يقضي العميل (أ) 40 دقيقة في تشخيص متجه حقن SQL صعبة لأحد العملاء. بعد ساعة، يلتقط العميل (ب) نفس الحالة لعميل مختلف ويقضي 40 دقيقة خاصة به يمشي في نفس الطريق المسدود ويجري نفس مكالمات الأداة ويصل إلى نفس الإجابة.</p>
<p>بالنسبة لمستخدم واحد يقوم بتشغيل الوكيل العرضي من حين لآخر، فإن ذلك يعتبر حوسبة مهدرة. أما بالنسبة لمنصة تقوم بتشغيل العشرات من <a href="https://zilliz.com/glossary/ai-agents">وكلاء الذكاء الاصطناعي</a> المتزامنة عبر مراجعة التعليمات البرمجية وفحص الثغرات وتوليد الوثائق لعملاء مختلفين كل يوم، فإن التكلفة تتضاعف هيكلياً.</p>
<p>إذا تبخرت التجربة التي تنتجها كل جلسة في اللحظة التي تنتهي فيها الجلسة، فإن الذكاء يمكن التخلص منه. فالمنصة المبنية بهذه الطريقة تتوسع خطياً ولكنها لا تتحسن في أي شيء بمرور الوقت، كما يفعل المهندسون البشريون.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">الحل 2: كيفية بناء مجموعة ذاكرة عميل مشتركة مع ميلفوس<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>قم ببناء مجموعة متجهات واحدة يقرأ منها كل تسخير عند بدء التشغيل ويكتب إليها عند إيقاف التشغيل، مقسمة حسب المستأجر بحيث تتجمع التجربة عبر الجلسات دون تسرب عبر العملاء.</strong></p>
<p>عند انتهاء الجلسة، يتم دفع القرارات الرئيسية والمشاكل التي تمت مواجهتها والأساليب التي نجحت في مجموعة Milvus المشتركة. عندما تتم تهيئة عقل جديد، يقوم التسخير بتشغيل استعلام دلالي كجزء من الإعداد ويحقن التجارب السابقة المطابقة الأعلى في نافذة السياق. ترث الخطوة الأولى للعامل الجديد دروس كل عامل سابق.</p>
<p>قراران هندسيان ينقلان هذا من النموذج الأولي إلى الإنتاج.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">عزل المستأجرين باستخدام مفتاح التقسيم Milvus Partition Key</h3><p><strong>التقسيم عن طريق</strong> <code translate="no">**tenant_id**</code><strong> ، وتجارب وكيل العميل "أ" لا تعيش فعليًا في نفس القسم الذي يعيش فيه العميل "ب". هذا هو العزل في طبقة البيانات بدلاً من اصطلاح الاستعلام.</strong></p>
<p>يجب ألا يكون عمل العميل "أ" على قاعدة بيانات الشركة "أ" قابلاً للاسترجاع من قبل وكلاء الشركة "ب". يعالج <a href="https://milvus.io/docs/use-partition-key.md">مفتاح التقسيم</a> الخاص بـ Milvus هذا الأمر على مجموعة واحدة، مع عدم وجود مجموعة ثانية لكل مستأجر ولا يوجد منطق تقاسم في التعليمات البرمجية للتطبيق.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>لا تظهر خبرات وكيل العميل (أ) في استعلامات العميل (ب)، ليس لأن مرشح الاستعلام مكتوب بشكل صحيح (على الرغم من أنه يجب أن يكون كذلك)، ولكن لأن البيانات لا تعيش فعليًا في نفس القسم الذي يعيش فيه العميل (ب). مجموعة واحدة للعمل، وعزل منطقي مفروض في طبقة الاستعلام، وعزل مادي مفروض في طبقة التقسيم.</p>
<p>راجع <a href="https://milvus.io/docs/multi_tenancy.md">مستندات استراتيجيات تعدد</a> <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">الإيجارات</a> لمعرفة متى يناسب مفتاح التقسيم مقابل المجموعات أو قواعد البيانات المنفصلة، <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">ودليل أنماط RAG متعدد الإيجارات</a> لملاحظات نشر الإنتاج.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">لماذا تحتاج جودة ذاكرة الوكيل إلى عمل مستمر</h3><p><strong>تتآكل جودة الذاكرة بمرور الوقت: فالحلول المعيبة التي صادف نجاحها مرة واحدة يتم إعادة تشغيلها وتعزيزها، والإدخالات القديمة المرتبطة بالتبعيات المهملة تستمر في تضليل الوكلاء الذين يرثونها. الدفاعات هي برامج تشغيلية وليست ميزات قاعدة البيانات.</strong></p>
<p>يعثر الوكيل على حل بديل معيب يصادف نجاحه مرة واحدة. تتم كتابته إلى التجمع المشترك. يستعيده الوكيل التالي ويعيد كتابته ويعزز النمط السيئ بسجل استخدام "ناجح" ثانٍ.</p>
<p>تتبع الإدخالات القديمة نسخة أبطأ من نفس المسار. يستمر استرجاع الإصلاح المثبت في إصدار تبعية تم إهماله قبل ستة أشهر، ويستمر في تضليل الوكلاء الذين يرثونه. كلما كان المجمع أقدم وأكثر استخدامًا، كلما تراكمت هذه المشكلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ثلاثة برامج تشغيلية تدافع ضد هذا:</p>
<ul>
<li><strong>درجة الثقة.</strong> تتبع عدد المرات التي تم فيها تطبيق الذاكرة بنجاح في جلسات الإعادة. اضمحلال الإدخالات التي تفشل في الإعادة. تعزيز الإدخالات التي تنجح بشكل متكرر.</li>
<li><strong>ترجيح الوقت.</strong> تفضيل التجارب الحديثة. تقاعد الإدخالات التي تتخطى عتبة تقادم معروفة، وغالباً ما تكون مرتبطة بمطبات الإصدارات الرئيسية التابعة.</li>
<li><strong>الفحوصات الموضعية البشرية.</strong> الإدخالات ذات التكرار العالي للاسترجاع هي إدخالات ذات نفوذ كبير. عندما يكون أحدها خاطئًا، يكون خاطئًا عدة مرات، وهو المكان الذي تؤتي فيه المراجعة البشرية ثمارها بشكل أسرع.</li>
</ul>
<p>لا يحل Milvus وحده هذه المشكلة، ولا حتى Mem0 أو Zep أو أي منتج ذاكرة آخر. إن إنفاذ تجمع واحد مع العديد من المستأجرين وعدم وجود تسرب عبر المستأجرين هو شيء تقوم بهندسته مرة واحدة. إن الحفاظ على هذا المجمع دقيقًا وجديدًا ومفيدًا هو عمل تشغيلي مستمر لا يتم تهيئته مسبقًا في أي قاعدة بيانات.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">الوجبات الجاهزة: ما الذي تضيفه ميلفوس إلى وكلاء أنثروبيك المُدارين<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يحول Milvus الوكلاء المُدارون من منصة موثوقة ولكن يمكن نسيانها إلى منصة تضاعف الخبرة بمرور الوقت من خلال إضافة الاستدعاء الدلالي داخل الجلسة والذاكرة المشتركة عبر الوكلاء.</strong></p>
<p>يجيب الوكلاء المُدارون على سؤال الموثوقية بشكل واضح: كل من العقول والأيدي ماشية، ويمكن أن يموت أي واحد منهم دون أن يأخذ المهمة معه. هذه هي مشكلة البنية التحتية، وقد حلها أنثروبيك بشكل جيد.</p>
<p>ما بقي مفتوحًا هو النمو. يتراكم المهندسون البشريون بمرور الوقت؛ فسنوات من العمل تتحول إلى التعرف على الأنماط، ولا يفكرون من المبادئ الأولى في كل مهمة. فالعوامل المدارة اليوم لا تفعل ذلك، لأن كل جلسة تبدأ من صفحة بيضاء.</p>
<p>إن توصيل الجلسة بـ Milvus للاستدعاء الدلالي داخل المهمة وتجميع الخبرة عبر العقول في مجموعة متجهات مشتركة هو ما يمنح الوكلاء ماضٍ يمكنهم استخدامه بالفعل. إن توصيل Milvus هو الجزء الخاص بالبنية التحتية؛ أما تشذيب الذكريات الخاطئة والتخلص من الذكريات القديمة وفرض حدود المستأجرين فهو الجزء التشغيلي. وبمجرد أن يصبح كلاهما في مكانهما الصحيح، يتوقف شكل الذاكرة عن كونه عائقاً ويبدأ في أن يكون رأس مال مركب.</p>
<h2 id="Get-Started" class="common-anchor-header">البدء<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>جربه محلياً:</strong> قم بتشغيل مثيل Milvus مدمج مع <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. لا يوجد Docker، لا كتلة، فقط <code translate="no">pip install pymilvus</code>. أحمال العمل الإنتاجية تنتقل إلى <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone أو الموزعة</a> عندما تحتاج إليها.</li>
<li><strong>اقرأ الأساس المنطقي للتصميم:</strong> يتطرق <a href="https://www.anthropic.com/engineering/managed-agents">منشور هندسة الوكلاء المُدارون</a> من أنثروبيك إلى الجلسة والتسخير وفصل صندوق الرمل بعمق.</li>
<li><strong>هل لديك أسئلة؟</strong> انضم إلى مجتمع <a href="https://discord.com/invite/8uyFbECzPX">ميلفوس ديسكورد</a> لمناقشات تصميم ذاكرة الوكيل، أو احجز جلسة <a href="https://milvus.io/office-hours">ساعات عمل ميلفوس المكتبية</a> للتعرف على عبء العمل الخاص بك.</li>
<li><strong>هل تفضل الإدارة؟</strong> <a href="https://cloud.zilliz.com/signup">سجّل في Zilliz Cloud</a> (أو سجّل <a href="https://cloud.zilliz.com/login">الدخول</a>) للحصول على Milvus المستضاف مع مفاتيح التقسيم والتوسع والإيجار المتعدد المدمج. تحصل الحسابات الجديدة على أرصدة مجانية على بريد إلكتروني للعمل.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتداولة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>س: ما هو الفرق بين الجلسة ونافذة السياق في الوكلاء المُدارون في أنثروبيك ؟</strong></p>
<p>نافذة السياق هي مجموعة سريعة الزوال من الرموز المميزة التي تراها مكالمة كلود واحدة. وهي محدودة ويعاد تعيينها لكل استدعاء للنموذج. جلسة العمل هي سجل الأحداث الدائم والملحق فقط لكل ما حدث عبر المهمة بأكملها، ويتم تخزينها خارج الحزام. عندما تتعطل الحزام، يقوم <code translate="no">wake(sessionId)</code> بتوليد حزام جديد يقرأ سجل الجلسة ويستأنف العمل. جلسة العمل هي نظام السجل؛ ونافذة السياق هي الذاكرة العاملة. جلسة العمل ليست نافذة السياق.</p>
<p><strong>س: كيف يمكنني استمرار ذاكرة الوكيل عبر جلسات عمل Claude؟</strong></p>
<p>ج: الجلسة نفسها ثابتة بالفعل؛ وهذا ما يسترجعه <code translate="no">getSession(id)</code>. ما هو مفقود عادةً هو الذاكرة طويلة المدى القابلة للاستعلام. يتمثل النمط في تضمين الأحداث عالية الإشارة (القرارات، والقرارات، والاستراتيجيات) في قاعدة بيانات متجهة مثل Milvus أثناء <code translate="no">emitEvent</code> ، ثم الاستعلام عن طريق التشابه الدلالي في وقت الاسترجاع. يمنحك هذا كلاً من سجل الجلسة الدائم الذي يوفره أنثروبيك وطبقة استرجاع دلالي للنظر إلى الوراء عبر مئات الخطوات.</p>
<p><strong>س: هل يمكن لوكلاء كلود المتعددين مشاركة الذاكرة؟</strong></p>
<p>ليس خارج الصندوق. يتم عزل كل جلسة من جلسات الوكلاء المُدارة حسب التصميم، وهو ما يتيح لهم التوسع أفقيًا. لمشاركة الذاكرة عبر الوكلاء، أضف مجموعة متجهات مشتركة (على سبيل المثال في Milvus) يقرأ منها كل تسخير عند بدء التشغيل ويكتب إليها عند إيقاف التشغيل. استخدم خاصية مفتاح التقسيم في Milvus لعزل المستأجرين بحيث لا تتسرب ذكريات وكيل العميل "أ" إلى جلسات العميل "ب".</p>
<p><strong>س: ما هي أفضل قاعدة بيانات متجهة لذاكرة وكيل الذكاء الاصطناعي؟</strong></p>
<p>تعتمد الإجابة الصادقة على الحجم وشكل النشر. بالنسبة للنماذج الأولية وأعباء العمل الصغيرة، يتم تشغيل خيار محلي مدمج مثل Milvus Lite داخل العملية بدون بنية تحتية. أما بالنسبة لوكلاء الإنتاج عبر العديد من المستأجرين، فأنت تريد قاعدة بيانات ذات تآجر متعدد ناضج (مفاتيح التقسيم والبحث المصفى)، والبحث الهجين (متجه + قياسي + كلمة رئيسية)، وكمون بملايين المتجهات في أجزاء من الثانية. صُمم Milvus خصيصًا لأعباء عمل المتجهات على هذا النطاق، ولهذا السبب يظهر في أنظمة ذاكرة الوكيل الإنتاجية المبنية على LangChain وGoogle ADK وDep Agents وOpenAgents.</p>
