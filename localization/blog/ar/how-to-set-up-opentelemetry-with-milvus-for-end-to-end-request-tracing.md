---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: كيفية إعداد OpenTelemetry مع Milvus لتتبع الطلبات من النهاية إلى النهاية
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  مراقبة أداء قاعدة بيانات Milvus vector لقاعدة بيانات Milvus باستخدام تتبع
  OpenTelemetry. برنامج تعليمي كامل مع إعداد Docker، وعميل Python، وتصور Jaeger،
  ونصائح تصحيح الأخطاء.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
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
    </button></h2><p>عند إنشاء تطبيقات مدعومة بالذكاء الاصطناعي باستخدام <a href="https://milvus.io/blog/what-is-a-vector-database.md">قواعد البيانات المتجهة،</a> يصبح فهم أداء النظام أمرًا بالغ الأهمية مع توسع نطاق تطبيقك. قد يؤدي طلب بحث واحد إلى تشغيل عمليات داخلية متعددة - فهرسة المتجهات وحسابات التشابه واسترجاع البيانات - عبر مكونات مختلفة. بدون إمكانية المراقبة المناسبة، يصبح تشخيص التباطؤ أو الأعطال مثل العثور على إبرة في كومة قش.</p>
<p>يعمل<strong>التتبع الموزع</strong> على حل هذه المشكلة من خلال تتبع الطلبات أثناء تدفقها عبر نظامك، مما يمنحك صورة كاملة لما يحدث تحت الغطاء.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a> هو إطار عمل مفتوح المصدر للمراقبة مدعوم من <a href="https://www.cncf.io/">مؤسسة الحوسبة السحابية الأصلية (CNCF)</a> يساعدك على جمع الآثار والمقاييس والسجلات من تطبيقاتك. وهو محايد من حيث البائعين، ومعتمد على نطاق واسع، ويعمل بسلاسة مع أدوات المراقبة الشائعة.</p>
<p>في هذا الدليل، سنوضح لك في هذا الدليل كيفية إضافة التتبع الشامل إلى <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة عالية الأداء مصممة لتطبيقات الذكاء الاصطناعي. ستتعلم كيفية تتبع كل شيء من طلبات العميل إلى عمليات قاعدة البيانات الداخلية، مما يجعل تحسين الأداء وتصحيح الأخطاء أسهل بكثير.</p>
<p>سنستخدم أيضًا <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> لتصور بيانات التتبع، مما يوفر لك رؤى قوية حول عمليات قاعدة البيانات المتجهة.</p>
<h2 id="What-Well-Build" class="common-anchor-header">ما سنقوم ببنائه<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>بنهاية هذا البرنامج التعليمي، سيكون لديك خط تتبع كامل يتكون من</p>
<ol>
<li><p><strong>قاعدة بيانات ميلفوس المتجهة</strong> مع تمكين تتبع OpenTelemetry</p></li>
<li><p><strong>جايجر</strong> لتصور التتبع وتحليله.</p></li>
<li><p><strong>عميل بايثون</strong> يتتبع جميع عمليات ميلفوس تلقائيًا</p></li>
<li><p><strong>رؤية شاملة</strong> من<strong>النهاية إلى النهاية</strong> من طلبات العميل إلى عمليات قاعدة البيانات</p></li>
</ol>
<p>الوقت المقدر للإعداد: 15-20 دقيقة</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">البدء السريع (5 دقائق)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>هل تريد رؤيته يعمل أولاً؟ إليك المسار الأسرع</p>
<ol>
<li>استنساخ المستودع التجريبي:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>ابدأ تشغيل الخدمات:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>انتظر 30 ثانية، ثم تحقق من واجهة مستخدم Jaeger في: <code translate="no">http://localhost:16686</code></p></li>
<li><p>قم بتشغيل مثال Python:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>قم بتحديث Jaeger وابحث عن آثار من كل من خدمات <code translate="no">standalone</code> (Milvus) و <code translate="no">milvus-client</code>.</li>
</ol>
<p>إذا رأيت آثارًا تظهر، فهذا يعني أن كل شيء يعمل! الآن دعنا نفهم كيف يتناسب كل ذلك معًا.</p>
<h2 id="Environment-Setup" class="common-anchor-header">إعداد البيئة<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>إليك ما ستحتاج إليه</p>
<ul>
<li><p><strong>ميلفوس 2.5.11</strong> (قاعدة بيانات المتجهات)</p></li>
<li><p><strong>جايجر 1.46.0</strong> (تصور التتبع)</p></li>
<li><p><strong>بايثون 3.7+</strong> (تطوير العميل)</p></li>
<li><p><strong>Docker و Docker Compose</strong> (تنسيق الحاويات)</p></li>
</ul>
<p>تم اختبار هذه الإصدارات معًا؛ ومع ذلك، يجب أن تعمل الإصدارات الأحدث أيضًا بشكل جيد.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">إعداد ميلفوس وجايجر<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>سنستخدم Docker Compose لتشغيل كلتا الخدمتين مع الشبكات والتهيئة المناسبة.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">تكوين Docker Compose Compose</h3><p>قم بإنشاء ملف <code translate="no">docker-compose.yaml</code>:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظة:</strong> يمكن العثور على أمثلة لملفات التكوين <code translate="no">embedEtcd.yaml</code> و <code translate="no">milvus.yaml</code> على: <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">تكوين تتبع ميلفوس</h3><p>إنشاء <code translate="no">configs/milvus.yaml</code> مع تكوين التتبع:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>شرح التكوين:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> تتبع كل طلب (مفيد للتطوير، ولكن استخدم 0.1 أو أقل في الإنتاج)</p></li>
<li><p><code translate="no">secure: false</code> تعطيل TLS (تمكين في الإنتاج)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> يستخدم اسم خدمة Docker للاتصال الداخلي</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">بدء تشغيل الخدمات</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">التحقق من تسليم التتبع من ميلفوس إلى جايجر</h3><p>بمجرد تشغيل الخدمات، يمكنك التحقق مما إذا كانت بيانات التتبع تنبعث من ميلفوس المستقلة وتستقبلها جايجر.</p>
<ul>
<li><p>افتح متصفحك وقم بزيارة واجهة مستخدم Jaeger على: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>في لوحة <strong>البحث</strong> (أعلى اليسار)، اختر القائمة المنسدلة <strong>للخدمة</strong> واختر <code translate="no">standalone</code>. إذا كنت ترى <code translate="no">standalone</code> في قائمة الخدمة، فهذا يعني أن تكوين OpenTelemetry المدمج في ميلفوس يعمل وقد نجح في دفع بيانات التتبع إلى جايجر.</p></li>
<li><p>انقر فوق <strong>البحث عن التتبعات</strong> لاستكشاف سلاسل التتبع التي تم إنشاؤها بواسطة مكونات ملفوس الداخلية (مثل تفاعلات gRPC بين الوحدات النمطية).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">إذا لم تظهر بيانات التتبع:</h3><ul>
<li><p>تحقق مرة أخرى من أن كتلة <code translate="no">trace</code> في <code translate="no">milvus.yaml</code> قد تم تكوينها بشكل صحيح وأن جايجر يعمل دون مشاكل.</p></li>
<li><p>افحص سجلات حاوية ميلفوس لمعرفة ما إذا كانت هناك أي أخطاء متعلقة بتهيئة التتبع.</p></li>
<li><p>انتظر بضع ثوانٍ وقم بتحديث واجهة مستخدم Jaeger؛ قد تواجه تقارير التتبع تأخيرًا قصيرًا.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">إعداد عميل بايثون والتبعيات<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>لنقم الآن بإعداد عميل بايثون لتتبع جميع عمليات ميلفوس تلقائيًا.</p>
<p>أولاً، قم بإنشاء ملف <code translate="no">requirements.txt</code>:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثم قم بتثبيت التبعيات عبر:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>هذا يضمن أن بيئة Python الخاصة بك جاهزة لتتبع مكالمات gRPC التي يتم إجراؤها إلى الواجهة الخلفية لـ Milvus.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">تهيئة OpenTelemetry في بايثون<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن، لنقم بتهيئة التتبع داخل تطبيق Python الخاص بك. يقوم هذا المقتطف بإعداد OTEL مع أجهزة gRPC وإعداد المتتبع.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>هنا ، <code translate="no">GrpcInstrumentorClient()</code> يربط بمكدس gRPC الأساسي حتى لا تحتاج إلى تعديل كود العميل يدويًا للأجهزة. يتم تكوين <code translate="no">OTLPSpanExporter()</code> لإرسال بيانات التتبع إلى مثيل Jaeger المحلي الخاص بك.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">مثال ميلفوس بايثون الكامل مع التتبع<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>لنقم الآن بإنشاء مثال شامل يوضح التتبع مع عمليات Milvus الواقعية:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">عرض مخرجات التتبع<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد أن يرسل عميل Python بيانات التتبع، ارجع إلى Jaeger: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>اختر خدمة <code translate="no">milvus-client</code> لعرض مسافات التتبع التي تتوافق مع عمليات عميل Python الخاصة بك في Milvus. هذا يجعل من الأسهل بكثير تحليل الأداء وتتبع التفاعلات عبر حدود النظام.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">أمثلة بلغات أخرى<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى بايثون، يمكنك تنفيذ تتبع ميلفوس بلغات أخرى:</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉جافا</strong></a>: استخدم وكيل OpenTelemetry Java Agent للأجهزة ذات التعليمات البرمجية الصفرية <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: الاستفادة من OpenTelemetry Go SDK للتكامل الأصلي 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: استدعاءات gRPC للأداة التلقائية للأداة gRPC باستخدام مجموعة تطوير البرمجيات SDK لجافا سكريبت</p>
<p>يتبع كل مثال أنماطًا متشابهة ولكنه يستخدم مكتبات OpenTelemetry الخاصة باللغة.</p>
<h2 id="Summary" class="common-anchor-header">الملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد نجحت في تنفيذ التتبع الشامل لعمليات ميلفوس! إليك ما أنجزته:</p>
<ul>
<li><p>✅ <strong>البنية التحتية</strong>: قم بإعداد ميلفوس وجايجر مع الشبكات المناسبة</p></li>
<li><p>✅ <strong>التتبع من جانب الخادم</strong>: تهيئة ميلفوس لتصدير التتبع تلقائيًا</p></li>
<li><p>✅ <strong>التتبع من جانب العميل</strong>: عميل بايثون المجهز بأدوات مع OpenTelemetry</p></li>
<li><p>✅ <strong>التصور</strong>: استخدام Jaeger لتحليل أداء النظام</p></li>
<li><p>✅ <strong>جاهزية الإنتاج</strong>: تعلمت أفضل ممارسات التكوين</p></li>
</ul>
<p>كل ذلك يعمل دون أي تغييرات على التعليمات البرمجية المصدرية لـ Milvus SDK. فقط عدد قليل من إعدادات التهيئة ويصبح خط أنابيب التتبع الخاص بك بسيطًا وفعالًا وجاهزًا للإنتاج.</p>
<p>يمكنك الذهاب إلى أبعد من ذلك من خلال دمج السجلات والمقاييس لبناء حل مراقبة كامل لنشر قاعدة بيانات ناقلات الذكاء الاصطناعي الأصلية الخاصة بك.</p>
<h2 id="Learn-More" class="common-anchor-header">معرفة المزيد<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>وثائق ميلفوس: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry لبايثون: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>وثائق جايجر: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>عرض Milvus OpenTelemetry Integration Demo (Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
