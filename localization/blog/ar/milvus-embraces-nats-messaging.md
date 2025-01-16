---
id: milvus-embraces-nats-messaging.md
title: 'تحسين اتصالات البيانات: ميلفوس تحتضن رسائل NATS'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  تقديم التكامل بين NATS وMilvus، واستكشاف ميزاته وعملية الإعداد والترحيل ونتائج
  اختبار الأداء.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في النسيج المعقد لمعالجة البيانات، يكون التواصل السلس هو الخيط الذي يربط العمليات ببعضها البعض. وقد شرعت شركة <a href="https://zilliz.com/what-is-milvus">Milvus،</a> <a href="https://zilliz.com/cloud">قاعدة البيانات المتجهة مفتوحة المصدر</a> الرائدة <a href="https://zilliz.com/cloud">والمفتوحة المصدر،</a> في رحلة تحويلية مع أحدث ميزاتها: تكامل رسائل NATS. في منشور المدونة الشامل هذا، سنكشف عن تعقيدات هذا التكامل، ونستكشف ميزاته الأساسية، وعملية الإعداد، وفوائد الترحيل، وكيف يتراكم مقارنةً بسابقه RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">فهم دور قوائم انتظار الرسائل في Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>في بنية ميلفوس السحابية الأصلية، تحتل قائمة انتظار الرسائل، أو وسيط السجلات، أهمية محورية. إنها العمود الفقري الذي يضمن تدفقات البيانات المستمرة، والمزامنة، وإشعارات الأحداث، وسلامة البيانات أثناء عمليات استرداد النظام. تقليديًا، كان RocksMQ هو الخيار الأكثر وضوحًا في وضع Milvus Standalone، خاصةً عند مقارنته مع Pulsar و Kafka، ولكن أصبحت قيوده واضحة مع البيانات الواسعة والسيناريوهات المعقدة.</p>
<p>يقدم Milvus 2.3 Milvus 2.3 NATS، وهو تطبيق MQ أحادي العقدة، يعيد تعريف كيفية إدارة تدفقات البيانات. وعلى عكس سابقاتها، تحرر NATS مستخدمي Milvus من قيود الأداء، وتقدم تجربة سلسة في التعامل مع أحجام البيانات الكبيرة.</p>
<h2 id="What-is-NATS" class="common-anchor-header">ما هو NATS؟<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS هي تقنية اتصال نظام موزعة يتم تنفيذها في Go. وهي تدعم أوضاع اتصال مختلفة مثل طلب-إعادة الطلب ونشر-الاشتراك عبر الأنظمة، وتوفر ثبات البيانات من خلال JetStream، وتوفر إمكانات موزعة من خلال RAFT المدمج. يمكنك الرجوع إلى <a href="https://nats.io/">الموقع الرسمي لـ NATS</a> للحصول على فهم أكثر تفصيلاً لـ NATS.</p>
<p>في الوضع المستقل Milvus 2.3 Standalone، يوفر كل من NATS و JetStream و PubSub ل Milvus إمكانات MQ قوية.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">تمكين NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>يوفر Milvus 2.3 خيار تحكم جديد، <code translate="no">mq.type</code> ، والذي يسمح للمستخدمين بتحديد نوع MQ الذي يريدون استخدامه. لتمكين NATS، قم بتعيين <code translate="no">mq.type=natsmq</code>. إذا رأيت سجلات مشابهة للسجلات أدناه بعد بدء تشغيل مثيلات Milvus، فهذا يعني أنك قمت بتمكين NATS كقائمة انتظار للرسائل بنجاح.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">تكوين NATS لـ Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>تتضمن خيارات تخصيص NATS تحديد منفذ الاستماع، ودليل تخزين JetStream، والحد الأقصى لحجم الحمولة، ومهلة التهيئة. يضمن الضبط الدقيق لهذه الإعدادات الأداء الأمثل والموثوقية المثلى.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظة:</strong></p>
<ul>
<li><p>يجب تحديد <code translate="no">server.port</code> للاستماع إلى خادم NATS. إذا كان هناك تعارض في المنفذ، فلن يتمكن ميلفوس من بدء التشغيل. تعيين <code translate="no">server.port=-1</code> لتحديد منفذ عشوائياً.</p></li>
<li><p><code translate="no">storeDir</code> تحديد دليل تخزين JetStream. نوصي بتخزين الدليل في محرك أقراص ذي حالة صلبة عالي الأداء (SSD) لتحسين إنتاجية القراءة/الكتابة لـ Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> تعيين الحد الأعلى لحجم تخزين JetStream. سيؤدي تجاوز هذا الحد إلى منع كتابة المزيد من البيانات.</p></li>
<li><p><code translate="no">maxPayload</code> يحد من حجم الرسالة الفردية. يجب أن تبقيه أعلى من 5 ميغابايت لتجنب أي رفض للكتابة.</p></li>
<li><p><code translate="no">initializeTimeout</code>يتحكم في مهلة بدء تشغيل خادم NATS.</p></li>
<li><p><code translate="no">monitor</code> تكوين سجلات NATS المستقلة.</p></li>
<li><p><code translate="no">retention</code> يتحكم في آلية الاحتفاظ برسائل NATS.</p></li>
</ul>
<p>لمزيد من المعلومات، راجع <a href="https://docs.nats.io/running-a-nats-service/configuration">وثائق NATS الرسمية</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">الترحيل من RocksMQ إلى NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد الترحيل من RocksMQ إلى NATS عملية سلسة تتضمن خطوات مثل إيقاف عمليات الكتابة، ومسح البيانات، وتعديل التكوينات، والتحقق من الترحيل من خلال سجلات Milvus.</p>
<ol>
<li><p>قبل بدء الترحيل، أوقف جميع عمليات الكتابة في Milvus.</p></li>
<li><p>قم بتنفيذ عملية <code translate="no">FlushALL</code> في Milvus وانتظر اكتمالها. تضمن هذه الخطوة مسح جميع البيانات المعلقة وجاهزية النظام لإيقاف التشغيل.</p></li>
<li><p>قم بتعديل ملف تهيئة ميلفوس عن طريق تعيين <code translate="no">mq.type=natsmq</code> وضبط الخيارات ذات الصلة ضمن القسم <code translate="no">natsmq</code>.</p></li>
<li><p>ابدأ تشغيل ميلفوس 2.3.</p></li>
<li><p>قم بالنسخ الاحتياطي وتنظيف البيانات الأصلية المخزنة في الدليل <code translate="no">rocksmq.path</code>. (اختياري)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS مقابل RocksMQ: مواجهة الأداء<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">اختبار أداء Pub/Sub</h3><ul>
<li><p><strong>منصة الاختبار:</strong> رقاقة M1 Pro / الذاكرة: 16 جيجابايت</p></li>
<li><p><strong>سيناريو الاختبار:</strong> الاشتراك في حزم البيانات العشوائية ونشرها إلى موضوع بشكل متكرر حتى يتم استلام آخر نتيجة منشورة.</p></li>
<li><p><strong>النتائج:</strong></p>
<ul>
<li><p>بالنسبة لحزم البيانات الأصغر (&lt; 64 كيلو بايت)، يتفوق RocksMQ على NATS فيما يتعلق بالذاكرة ووحدة المعالجة المركزية وسرعة الاستجابة.</p></li>
<li><p>بالنسبة لحزم البيانات الأكبر حجمًا (&gt; 64 كيلو بايت)، يتفوق NATS على RocksMQ، حيث يقدم أوقات استجابة أسرع بكثير.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>نوع الاختبار</th><th>MQ</th><th>عدد العمليات</th><th>التكلفة لكل عملية</th><th>تكلفة الذاكرة</th><th>الوقت الإجمالي لوحدة المعالجة المركزية</th><th>تكلفة التخزين</th></tr>
</thead>
<tbody>
<tr><td>5 ميغابايت*100 بوب/فرعي</td><td>ناتس</td><td>50</td><td>1.650328186 ثانية/عملية</td><td>4.29 جيجابايت</td><td>85.58</td><td>25G</td></tr>
<tr><td>5 ميغابايت*100 حانة/فرعية</td><td>RocksMQ</td><td>50</td><td>2.475595131 ثانية/عملية</td><td>1.18 جيجابايت</td><td>81.42</td><td>19G</td></tr>
<tr><td>1 ميغابايت*500 حانة/فرعية</td><td>ناتس</td><td>50</td><td>2.248722593 ثانية/عملية</td><td>2.60 جيجابايت</td><td>96.50</td><td>25G</td></tr>
<tr><td>1 ميغابايت*500 حانة/فرعية</td><td>RocksMQ</td><td>50</td><td>2.554614279 ثانية/عملية</td><td>614.9 ميغابايت</td><td>80.19</td><td>19G</td></tr>
<tr><td>64 كيلوبايت*10000 حانة/فرعية</td><td>ناتس</td><td>50</td><td>2.133345262 ثانية/عملية</td><td>3.29 جيجابايت</td><td>97.59</td><td>31G</td></tr>
<tr><td>64 كيلوبايت*10000 حانة/فرعية</td><td>RocksMQ</td><td>50</td><td>3.253778195 ق/س/س</td><td>331.2 ميغابايت</td><td>134.6</td><td>24G</td></tr>
<tr><td>1 كيلوبايت*50000 حانة/فرعية</td><td>ناتس</td><td>50</td><td>2.629391004 ثانية/عملية</td><td>635.1 ميغابايت</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1 كيلوبايت*50000 حانة/فرعية</td><td>روكسمك</td><td>50</td><td>0.897638581 ثانية/عملية</td><td>232.3 ميغابايت</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>الجدول 1: نتائج اختبار أداء Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">اختبار تكامل ميلفوس</h3><p><strong>حجم البيانات:</strong> 100 ميغابايت</p>
<p><strong>النتيجة:</strong> في اختبار مكثف مع مجموعة بيانات 100 مليون متجه، أظهر NATS انخفاضًا في البحث عن المتجهات وزمن انتقال الاستعلام.</p>
<table>
<thead>
<tr><th>المقاييس</th><th>RocksMQ (مللي ثانية)</th><th>NATS (مللي ثانية)</th></tr>
</thead>
<tbody>
<tr><td>متوسط زمن انتقال البحث عن المتجهات</td><td>23.55</td><td>20.17</td></tr>
<tr><td>طلبات البحث عن المتجهات في الثانية (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>متوسط وقت استجابة الاستعلام</td><td>7.2</td><td>6.74</td></tr>
<tr><td>طلبات الاستعلام في الثانية (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>الجدول 2: نتائج اختبار تكامل Milvus مع مجموعة بيانات 100 متر</p>
<p><strong>مجموعة البيانات: &lt;100 مليون</strong></p>
<p><strong>النتيجة:</strong> بالنسبة لمجموعات البيانات الأصغر من 100 مليون، يُظهر NATS و RocksMQ أداءً مشابهًا.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">الاستنتاج: تمكين ميلفوس مع رسائل NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>يمثل دمج NATS في Milvus خطوة كبيرة في معالجة البيانات. سواءً كان الخوض في التحليلات في الوقت الحقيقي، أو تطبيقات التعلم الآلي، أو أي مشروع كثيف البيانات، فإن NATS يمكّن مشاريعك بالكفاءة والموثوقية والسرعة. مع تطور مشهد البيانات، فإن وجود نظام مراسلة قوي مثل NATS داخل Milvus يضمن اتصال بيانات سلس وموثوق وعالي الأداء.</p>
