---
id: data-addressing-storage-systems.md
title: >-
  نظرة متعمقة في عنونة البيانات في أنظمة التخزين: من HashMap إلى HDFS وKafka
  وMilvus وMilvus وA Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  تتبّع كيفية عمل عنونة البيانات من HashMap إلى HDFS وKafka وMilvus وA Iceberg -
  ولماذا تتفوق مواقع الحوسبة على البحث في كل نطاق.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>إذا كنت تعمل على أنظمة الواجهة الخلفية أو التخزين الموزعة، فربما تكون قد رأيت هذا: الشبكة غير مشبعة، والأجهزة غير مثقلة بالأعباء، ومع ذلك فإن عملية بحث بسيطة تؤدي إلى آلاف عمليات الإدخال/الإخراج على القرص أو استدعاءات واجهة برمجة تطبيقات تخزين الكائنات - ولا يزال الاستعلام يستغرق ثوانٍ.</p>
<p>نادرًا ما يكون عنق الزجاجة هو عرض النطاق الترددي أو الحوسبة. إنه <em>العنونة</em> - العمل الذي يقوم به النظام لمعرفة مكان البيانات قبل أن يتمكن من قراءتها. <strong>عنونة البيانات</strong> هي عملية ترجمة المعرف المنطقي (مفتاح، مسار ملف، إزاحة أو مسند استعلام) إلى الموقع الفعلي للبيانات على التخزين. على نطاق واسع، تهيمن هذه العملية - وليس النقل الفعلي للبيانات - على زمن الاستجابة.</p>
<p>يمكن اختزال أداء التخزين إلى نموذج بسيط:</p>
<blockquote>
<p><strong>إجمالي تكلفة العنونة = الوصول إلى البيانات الوصفية + الوصول إلى البيانات</strong></p>
</blockquote>
<p>تستهدف كل تحسينات التخزين تقريبًا - من جداول التجزئة إلى طبقات البيانات الوصفية في البحيرة - هذه المعادلة. تختلف التقنيات، ولكن الهدف هو نفسه دائمًا: تحديد موقع البيانات بأقل عدد ممكن من العمليات ذات الكمون العالي.</p>
<p>تتتبع هذه المقالة هذه الفكرة عبر الأنظمة ذات النطاق المتزايد - من هياكل البيانات داخل الذاكرة مثل HashMap، إلى الأنظمة الموزعة مثل HDFS و Apache Kafka، وأخيرًا إلى المحركات الحديثة مثل <a href="https://milvus.io/">Milvus</a> ( <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بيانات متجهة</a>) و Apache Iceberg التي تعمل على تخزين الكائنات. على الرغم من اختلافاتها، إلا أنها جميعًا تعمل على تحسين المعادلة نفسها.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">ثلاث تقنيات عنونة أساسية<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>عبر أنظمة التخزين والمحركات الموزعة، تنقسم معظم تحسينات العنونة إلى ثلاث تقنيات:</p>
<ul>
<li><strong>الحوسبة</strong> - اشتقاق موقع البيانات مباشرةً من معادلة، بدلاً من المسح أو اجتياز الهياكل للعثور عليها.</li>
<li><strong>التخزين المؤقت</strong> - الاحتفاظ بالبيانات الوصفية أو الفهارس التي يتم الوصول إليها بشكل متكرر في الذاكرة لتجنب القراءات المتكررة ذات الكمون العالي من القرص أو التخزين عن بُعد.</li>
<li><strong>التقليم</strong> - استخدام معلومات النطاق أو حدود الأقسام لاستبعاد الملفات أو الأجزاء أو العقد التي لا يمكن أن تحتوي على النتيجة.</li>
</ul>
<p>خلال هذه المقالة، يعني <em>الوصول</em> في هذه المقالة أي عملية ذات تكلفة حقيقية على مستوى النظام: قراءة قرص أو مكالمة شبكة أو طلب واجهة برمجة تطبيقات تخزين الكائنات. لا يتم احتساب حساب وحدة المعالجة المركزية على مستوى النانو ثانية. ما يهم هو تقليل عدد عمليات الإدخال/الإخراج - أو تحويل الإدخال/الإخراج العشوائي المكلف إلى قراءات متسلسلة أرخص.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">كيف تعمل العنونة: مشكلة المجموعتين<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>لجعل العنونة ملموسة، فكر في مشكلة خوارزمية كلاسيكية. بمعلومية مصفوفة من الأعداد الصحيحة <code translate="no">nums</code> وقيمة مستهدفة <code translate="no">target</code> ، قم بإرجاع مؤشرات رقمين مجموعهما <code translate="no">target</code>.</p>
<p>على سبيل المثال <code translate="no">nums = [2, 7, 11, 15]</code> <code translate="no">target = 9</code> → النتيجة <code translate="no">[0, 1]</code>.</p>
<p>توضح هذه المشكلة بوضوح الفرق بين البحث عن البيانات وحساب مكانها.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">الحل 1: البحث بالقوة الغاشمة</h3><p>يتحقق نهج القوة الغاشمة من كل زوج. لكل عنصر، يقوم بمسح بقية المصفوفة بحثًا عن تطابق. بسيط، ولكن O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>لا توجد فكرة عن مكان الإجابة. كل عملية بحث تبدأ من الصفر وتجتاز المصفوفة بشكل أعمى. عنق الزجاجة ليس عنق الزجاجة هو العملية الحسابية - بل المسح المتكرر.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">الحل 2: العنونة المباشرة عبر الحساب</h3><p>يستبدل الحل الأمثل المسح الضوئي بخريطة تجزئة. بدلاً من البحث عن قيمة مطابقة، يحسب القيمة المطلوبة ويبحث عنها مباشرةً. ينخفض تعقيد الوقت إلى O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>التحويل: بدلًا من المسح الضوئي للمصفوفة للعثور على قيمة مطابقة، تحسب ما تحتاج إليه وتذهب مباشرةً إلى موقعه. بمجرد اشتقاق الموقع، يختفي الاجتياز.</p>
<p>هذه هي الفكرة نفسها وراء كل نظام تخزين عالي الأداء سنفحصه: استبدل عمليات المسح بالحساب، ومسارات البحث غير المباشرة بالعنونة المباشرة.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">خريطة التجزئة: كيف تحل العناوين المحسوبة محل عمليات المسح<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>يخزن HashMap أزواج المفاتيح والقيم ويحدد موقع القيم عن طريق حساب عنوان من المفتاح - وليس عن طريق البحث في الإدخالات. بمعلومية مفتاح، تطبق دالة تجزئة وتحسب فهرس مصفوفة وتنتقل مباشرةً إلى ذلك الموقع. لا حاجة للمسح الضوئي.</p>
<p>هذا هو أبسط شكل من أشكال المبدأ الذي يحرك جميع الأنظمة في هذه المقالة: تجنب عمليات المسح عن طريق اشتقاق المواقع من خلال الحساب. تظهر الفكرة نفسها - التي تدعم كل شيء بدءًا من عمليات البحث عن البيانات الوصفية الموزعة إلى <a href="https://zilliz.com/learn/vector-index">فهارس المتجهات</a> - في كل نطاق.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">بنية البيانات الأساسية</h3><p>في جوهرها، يتم بناء HashMap حول بنية واحدة: مصفوفة. تقوم دالة التجزئة بتعيين المفاتيح إلى فهارس الصفيف. نظرًا لأن مساحة المفتاح أكبر بكثير من المصفوفة، فإن التصادمات أمر لا مفر منه - قد يتم تجزئة مفاتيح مختلفة إلى نفس الفهرس. يتم التعامل معها محليًا داخل كل فتحة باستخدام قائمة مرتبطة أو شجرة حمراء سوداء.</p>
<p>توفر المصفوفات وصولًا ثابتًا حسب الفهرس. هذه الخاصية - العنونة المباشرة التي يمكن التنبؤ بها - هي أساس أداء HashMap، وهي نفس المبدأ الذي يقوم عليه الوصول الفعال للبيانات في أنظمة التخزين واسعة النطاق.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">كيف تحدد خريطة التجزئة موقع البيانات؟</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>عنونة HashMap خطوة بخطوة: تجزئة المفتاح، وحساب فهرس المصفوفة، والانتقال مباشرةً إلى الدلو، وحلها محليًا - تحقيق O(1) بحث بدون اجتياز</span> </span></p>
<p>خذ <code translate="no">put(&quot;apple&quot;, 100)</code> كمثال. يستغرق البحث بأكمله أربع خطوات - لا يوجد مسح كامل للجدول:</p>
<ol>
<li><strong>تجزئة المفتاح:</strong> تمرير المفتاح من خلال دالة تجزئة → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>التحويل إلى فهرس مصفوفة:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> ← على سبيل المثال, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>الانتقال إلى الدلو:</strong> الوصول إلى <code translate="no">table[10]</code> مباشرةً - الوصول إلى ذاكرة واحدة، وليس اجتيازًا</li>
<li><strong>حل محلي:</strong> إذا لم يكن هناك تصادم، اقرأ أو اكتب على الفور. إذا كان هناك تصادم، تحقق من قائمة مرتبطة صغيرة أو شجرة حمراء سوداء داخل تلك الدلو.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">لماذا يكون بحث HashMap O(1)؟</h3><p>الوصول إلى المصفوفة هو O(1) بسبب صيغة عنونة بسيطة:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>بمعلومية فهرس، يتم حساب عنوان الذاكرة بعملية ضرب واحدة وعملية جمع واحدة. التكلفة ثابتة بغض النظر عن حجم المصفوفة - عملية حسابية واحدة وقراءة ذاكرة واحدة. على النقيض من ذلك، يجب اجتياز القائمة المرتبطة عقدة تلو الأخرى، باتباع المؤشرات عبر مواقع ذاكرة منفصلة: O(n) في أسوأ الحالات.</p>
<p>تقوم HashMap بتجزئة المفتاح إلى فهرس مصفوفة، مما يحول ما يمكن أن يكون اجتيازًا إلى عنوان محسوب. بدلاً من البحث عن البيانات، يحسب بالضبط مكان البيانات ويقفز إلى هناك.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">كيف تتغير العنونة في الأنظمة الموزعة؟<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>يحل HashMap العنونة داخل جهاز واحد، حيث تعيش البيانات في الذاكرة وتكون تكاليف الوصول تافهة. في المقاييس الأكبر، تتغير القيود بشكل كبير:</p>
<table>
<thead>
<tr><th>عامل المقياس</th><th>التأثير</th></tr>
</thead>
<tbody>
<tr><td>حجم البيانات</td><td>ميغابايت → تيرابايت أو بيتابايت عبر المجموعات</td></tr>
<tr><td>وسيط التخزين</td><td>الذاكرة ← القرص ← الشبكة ← تخزين الكائنات</td></tr>
<tr><td>زمن الوصول</td><td>الذاكرة: ~100 نانو ثانية / القرص: 10-20 مللي ثانية / شبكة نفس التيار المتردد: ~حوالي 0.5 مللي ثانية / عبر المنطقة: ~150 مللي ثانية</td></tr>
</tbody>
</table>
<p>لا تتغير مشكلة العنونة - إنها فقط تصبح أكثر تكلفة. قد تتضمن كل عملية بحث قفزات في الشبكة وعمليات إدخال/إخراج على القرص، لذا فإن تقليل عدد عمليات الوصول مهم أكثر بكثير من الذاكرة.</p>
<p>لنرى كيف تتعامل الأنظمة الحقيقية مع هذا الأمر، سنلقي نظرة على مثالين كلاسيكيين. يطبق HDFS العنونة المستندة إلى الحساب على الملفات الكبيرة المستندة إلى الكتل. يطبقه كافكا على تدفقات الرسائل الإلحاقية فقط. كلاهما يتبع نفس المبدأ: حساب مكان البيانات بدلاً من البحث عنها.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: معالجة الملفات الكبيرة باستخدام البيانات الوصفية في الذاكرة<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS هو نظام <a href="https://milvus.io/docs/architecture_overview.md">تخزين موزع</a> مصمم للملفات الكبيرة جدًا عبر مجموعات من الأجهزة. بالنظر إلى مسار الملف وإزاحة البايت، فإنه يحتاج إلى العثور على كتلة البيانات الصحيحة وعقدة البيانات التي تخزنها.</p>
<p>يحل HDFS هذا الأمر بخيار تصميم متعمد: الاحتفاظ بجميع البيانات الوصفية لنظام الملفات في الذاكرة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>تُظهر منظمة بيانات HDFS عرضًا منطقيًا لملف بحجم 300 ميغابايت تم تعيينه إلى وحدة تخزين فعلية على شكل ثلاث كتل موزعة على عقد البيانات مع النسخ المتماثل</span> </span></p>
<p>في المركز توجد عقدة الاسم. حيث يقوم بتحميل شجرة نظام الملفات بالكامل - بنية الدليل، وتعيينات من ملف إلى كتلة، وتعيينات من كتلة إلى عقدة بيانات - في الذاكرة. نظرًا لأن البيانات الوصفية لا تلامس القرص أبدًا أثناء القراءة، فإن HDFS يحل جميع أسئلة العنونة من خلال عمليات البحث في الذاكرة فقط.</p>
<p>من الناحية المفاهيمية، هذا هو HashMap على نطاق الكتلة: استخدام هياكل البيانات داخل الذاكرة لتحويل عمليات البحث البطيئة إلى عمليات بحث سريعة ومحسوبة. الفرق هو أن HDFS يطبق نفس المبدأ على مجموعات البيانات المنتشرة عبر آلاف الأجهزة.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">كيف يحدد HDFS موقع البيانات؟</h3><p>ضع في اعتبارك قراءة البيانات عند إزاحة 200 ميغابايت من <code translate="no">/user/data/bigfile.txt</code> ، مع حجم كتلة افتراضي يبلغ 128 ميغابايت:</p>
<ol>
<li>يقوم العميل بإرسال طلب استدعاء استدعاء واحد إلى NameNode</li>
<li>تقوم NameNode بتحديد مسار الملف وتحسب أن الإزاحة 200 ميغابايت تقع في الكتلة الثانية (نطاق 128-256 ميغابايت) - بالكامل في الذاكرة</li>
<li>تقوم NameNode بإرجاع DataNode التي تخزن تلك الكتلة (على سبيل المثال، DN2 و DN3)</li>
<li>يقوم العميل بالقراءة مباشرةً من أقرب عقدة بيانات (DN2)</li>
</ol>
<p>التكلفة الإجمالية: عملية طلب استدعاء واحدة لإعادة البرمجة، وبعض عمليات البحث في الذاكرة، وقراءة بيانات واحدة. لا تصل البيانات الوصفية أبدًا إلى القرص أثناء هذه العملية، وكل عملية بحث تكون في وقت ثابت. يتجنب HDFS عمليات المسح المكلفة للبيانات الوصفية حتى مع توسع البيانات عبر مجموعات كبيرة.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">أباتشي كافكا: كيف تتجنب الفهرسة المتفرقة الإدخال/الإخراج العشوائي<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم Apache Kafka لتدفقات الرسائل عالية الإنتاجية. بالنظر إلى إزاحة رسالة، فإنه يحتاج إلى تحديد موضع البايت بالضبط على القرص - دون تحويل القراءات إلى إدخال/إخراج عشوائي.</p>
<p>يجمع كافكا بين التخزين المتسلسل وفهرس متناثر في الذاكرة. فبدلاً من البحث في البيانات، يحسب موقعًا تقريبيًا ويجري مسحًا صغيرًا محدودًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>تُظهر منظمة بيانات كافكا طريقة العرض المنطقية مع المواضيع والأقسام المعينة للتخزين الفعلي كدلائل أقسام تحتوي على ملفات المقاطع .log و .index و .timeindex</span> </span></p>
<p>يتم تنظيم الرسائل كموضوع ← موضوع ← قسم ← مقطع. كل قسم هو عبارة عن سجل إلحاقي فقط مقسم إلى مقاطع، كل منها يتكون من:</p>
<ul>
<li>ملف <code translate="no">.log</code> يخزن الرسائل بالتتابع على القرص</li>
<li>ملف <code translate="no">.index</code> يعمل كفهرس متناثر في السجل</li>
</ul>
<p>الملف <code translate="no">.index</code> معيّن على الذاكرة (mmap)، لذا يتم تقديم عمليات البحث عن الفهرس مباشرةً من الذاكرة دون الحاجة إلى إدخال/إخراج من القرص.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>يُظهر تصميم فهرس كافكا المتناثر إدخال فهرس واحد لكل 4 كيلوبايت من البيانات، مع مقارنة الذاكرة: فهرس كثيف بحجم 800 ميجابايت مقابل فهرس متناثر بحجم 2 ميجابايت فقط مقيم في الذاكرة</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">كيف يحدد كافكا موقع البيانات؟</h3><p>لنفترض أن المستهلك يقرأ الرسالة عند الإزاحة 500,000. تحل كافكا هذا الأمر في ثلاث خطوات:</p>
<p><strong>1. تحديد موقع المقطع</strong> (البحث عن خريطة الشجرة)</p>
<ul>
<li>إزاحة قاعدة المقطع: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>الملف المستهدف <code translate="no">00000000000000367834.log</code></li>
<li>تعقيد الوقت: O(لوغاريتم S)، حيث S هو عدد المقاطع (عادةً أقل من 100)</li>
</ul>
<p><strong>2. البحث عن الموضع في الفهرس المتناثر</strong> (.الفهرس)</p>
<ul>
<li>الإزاحة النسبية: <code translate="no">500000 − 367834 = 132166</code></li>
<li>بحث ثنائي في <code translate="no">.index</code>: ابحث عن أكبر إدخال ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>تعقيد الوقت O(لوغاريتم N)، حيث N هو عدد إدخالات الفهرس</li>
</ul>
<p><strong>3. قراءة متسلسلة من السجل</strong> (.log)</p>
<ul>
<li>ابدأ القراءة من الموضع 20,500,000</li>
<li>استمر حتى الوصول إلى الإزاحة 500,000</li>
<li>يتم مسح فاصل فهرس واحد على الأكثر (حوالي 4 كيلوبايت)</li>
</ul>
<p>الإجمالي: بحث واحد في الذاكرة عن مقطع واحد، وبحث واحد عن الفهرس، وقراءة متسلسلة قصيرة واحدة. لا يوجد وصول عشوائي للقرص.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS مقابل أباتشي كافكا<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
<tr><th>البعد</th><th>HDFS</th><th>كافكا</th></tr>
</thead>
<tbody>
<tr><td>هدف التصميم</td><td>التخزين والقراءة الفعالة للملفات الضخمة</td><td>قراءة/كتابة تسلسلية عالية الإنتاجية لتدفقات الرسائل</td></tr>
<tr><td>نموذج العنونة</td><td>المسار ← الكتلة ← كتلة ← عقدة البيانات عبر خرائط التجزئة في الذاكرة</td><td>إزاحة → مقطع → مقطع → موضع عبر فهرس متقطع + مسح متسلسل</td></tr>
<tr><td>تخزين البيانات الوصفية</td><td>مركزي في ذاكرة NameNode</td><td>ملفات محلية، مع تعيين الذاكرة عبر mmap</td></tr>
<tr><td>تكلفة الوصول لكل عملية بحث</td><td>1 RPC + قراءات كتلة N</td><td>1 عملية بحث عن الفهرس + 1 قراءة بيانات</td></tr>
<tr><td>تحسين المفتاح</td><td>جميع البيانات الوصفية في الذاكرة - لا يوجد قرص في مسار البحث</td><td>تتجنب الفهرسة المتفرقة + التخطيط المتسلسل الإدخال/الإخراج العشوائي</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">لماذا يغير تخزين الكائنات مشكلة العنونة<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>من HashMap إلى HDFS و Kafka، رأينا العنونة في الذاكرة وفي التخزين الموزع الكلاسيكي. مع تطور أعباء العمل، تستمر المتطلبات في الارتفاع:</p>
<ul>
<li><strong>استعلامات أكثر ثراءً.</strong> تتعامل الأنظمة الحديثة مع الفلاتر متعددة الحقول، <a href="https://zilliz.com/glossary/similarity-search">والبحث عن التشابه،</a> والمسندات المعقدة - وليس فقط المفاتيح البسيطة والإزاحات.</li>
<li><strong>تخزين الكائنات كإعداد افتراضي.</strong> تعيش البيانات بشكل متزايد في مخازن متوافقة مع S3. وتنتشر الملفات عبر الدلاء، وكل عملية وصول هي عبارة عن استدعاء لواجهة برمجة التطبيقات مع زمن انتقال ثابت في حدود عشرات المللي ثانية - حتى بالنسبة لبضعة كيلوبايتات.</li>
</ul>
<p>عند هذه النقطة، يكون وقت الاستجابة - وليس عرض النطاق الترددي - هو عنق الزجاجة. يكلّف طلب S3 GET واحد حوالي 50 مللي ثانية بغض النظر عن كمية البيانات التي يُرجعها. إذا أدى الاستعلام إلى تشغيل آلاف الطلبات من هذا القبيل، فإن إجمالي زمن الاستجابة يتضخم. ويصبح التقليل من انتشار واجهة برمجة التطبيقات هو قيد التصميم المركزي.</p>
<p>سنلقي نظرة على نظامين حديثين - <a href="https://milvus.io/">ميلفوس،</a> <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بيانات متجهة،</a> وأباتشي آيسبرغ، وهو تنسيق جدول بحيرة - لنرى كيف يعالجان هذه التحديات. على الرغم من اختلافاتهما، إلا أن كلاهما يطبقان نفس الأفكار الأساسية: تقليل عمليات الوصول ذات الكمون العالي، وتقليل التمدد في وقت مبكر، وتفضيل الحساب على الاجتياز.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">ميلفوس V1: عندما ينشئ التخزين على مستوى الحقل الكثير من الملفات<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus عبارة عن قاعدة بيانات متجهة مستخدمة على نطاق واسع مصممة <a href="https://zilliz.com/glossary/similarity-search">للبحث عن التشابه</a> عبر <a href="https://zilliz.com/glossary/vector-embeddings">تضمينات المتجهات</a>. يعكس تصميم التخزين المبكر الخاص به نهجًا أوليًا شائعًا للبناء على تخزين الكائنات: تخزين كل حقل على حدة.</p>
<p>في V1، يتم تخزين كل حقل في <a href="https://milvus.io/docs/manage-collections.md">مجموعة</a> ما في ملفات بنلوغ منفصلة عبر <a href="https://milvus.io/docs/glossary.md">قطاعات</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>يُظهر تخطيط تخزين Milvus V1 تخطيط تخزين Milvus V1 مجموعة مقسمة إلى شرائح، حيث يخزن كل حقل مثل المعرف والمتجه والبيانات القياسية في ملفات binlog منفصلة، بالإضافة إلى ملفات stats_log منفصلة لإحصائيات الملفات</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">كيف يحدد ميلفوس V1 موقع البيانات؟</h3><p>فكر في استعلام بسيط: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>البحث عن البيانات الوصفية</strong> - الاستعلام عن بيانات<strong>التعريف</strong> - الاستعلام عن قائمة المقاطع إلخd/MySQL → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>اقرأ حقل المعرف عبر المقاطع</strong> - لكل مقطع، اقرأ ملفات المعرف بنلوغ</li>
<li><strong>تحديد موقع الصف الهدف</strong> - مسح بيانات المعرف المحملة للعثور على <code translate="no">id = 123</code></li>
<li><strong>قراءة الحقل المتجه</strong> - قراءة ملفات مدونة المتجهات المقابلة للمقطع المطابق</li>
</ol>
<p>إجمالي عمليات الوصول إلى الملفات: <strong>N × (F₁ + F₂ + ...)</strong> حيث N = عدد المقاطع، F = ملفات ثنائية المدونة لكل حقل.</p>
<p>تصبح الرياضيات قبيحة بسرعة. بالنسبة لمجموعة تحتوي على 100 حقل، و1,000 مقطع، و5 ملفات مدونة لكل حقل:</p>
<blockquote>
<p><strong>1,000 × 100 × 100 × 5 = 500,000 ملف</strong></p>
</blockquote>
<p>حتى لو كان الاستعلام يمس ثلاثة حقول فقط، فهذا يعني 15,000 استدعاء لواجهة برمجة تطبيقات تخزين الكائنات. عند 50 مللي ثانية لكل طلب S3، يصل زمن الوصول التسلسلي إلى <strong>750 ثانية</strong> - أكثر من 12 دقيقة لاستعلام واحد.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">ميلفوس V2: كيف يقلل الباركيه على مستوى القطاع من مكالمات واجهة برمجة التطبيقات بمقدار 10 أضعاف<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>لإصلاح حدود قابلية التوسع في الإصدار V1، يُجري Milvus V2 تغييراً جوهرياً: تنظيم البيانات حسب <a href="https://milvus.io/docs/glossary.md">المقطع</a> بدلاً من الحقل. فبدلاً من العديد من ملفات المدونات الصغيرة، يدمج V2 البيانات في ملفات باركيه حسب المقطع.</p>
<p>ينخفض عدد الملفات من <code translate="no">N × fields × binlogs</code> إلى <code translate="no">N</code> تقريبًا (مجموعة ملفات واحدة لكل مقطع).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>يعرض تخطيط تخزين Milvus V2 تخطيط تخزين Milvus V2 مقطعًا مخزنًا كملفات باركيه مع مجموعات صفوف تحتوي على أجزاء أعمدة للمعرف والمتجه والطابع الزمني، بالإضافة إلى تذييل يحتوي على إحصائيات المخطط والأعمدة</span> </span></p>
<p>لكن V2 لا يخزن V2 جميع الحقول في ملف واحد. فهو يجمع الحقول حسب الحجم:</p>
<ul>
<li>يتم تخزين<strong> <a href="https://milvus.io/docs/scalar_index.md">الحقول القياسية</a> الصغيرة</strong> (مثل المعرف والطابع الزمني) معًا</li>
<li>يتم تقسيم<strong>الحقول الكبيرة</strong> (مثل <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">المتجهات الكثيفة</a>) إلى ملفات مخصصة</li>
</ul>
<p>تنتمي جميع الملفات إلى نفس المقطع، ويتم محاذاة الصفوف حسب الفهرس عبر الملفات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>بنية ملف الباركيه التي تعرض مجموعات الصفوف مع أجزاء الأعمدة وصفحات البيانات المضغوطة، بالإضافة إلى تذييل يحتوي على البيانات الوصفية للملف، والبيانات الوصفية لمجموعة الصفوف، وإحصائيات الأعمدة مثل قيم الحد الأدنى/الحد الأقصى</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">كيف يحدد Milvus V2 موقع البيانات؟</h3><p>لنفس الاستعلام - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>البحث عن البيانات الوصفية</strong> - جلب قائمة المقاطع → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>قراءة تذييلات الباركيه</strong> - استخراج إحصائيات مجموعة الصفوف. تحقق من الحد الأدنى/الحد الأقصى لعمود المعرف لكل مجموعة صفوف. <code translate="no">id = 123</code> يقع في مجموعة الصفوف 0 (الحد الأدنى=1، الحد الأقصى=1000).</li>
<li><strong>اقرأ ما هو مطلوب فقط</strong> - يقرأ تشذيب الأعمدة في الباركيه عمود المعرف فقط من ملف الحقل الصغير وعمود <a href="https://milvus.io/docs/index-vector-fields.md">المتجه</a> فقط من ملف الحقل الكبير. يتم الوصول إلى مجموعات الصفوف المطابقة فقط.</li>
</ol>
<p>يوفر تقسيم الحقول الكبيرة فائدتين رئيسيتين:</p>
<ul>
<li><strong>قراءات أكثر كفاءة.</strong> تهيمن <a href="https://zilliz.com/glossary/vector-embeddings">التضمينات المتجهة</a> على حجم التخزين. عند خلطها مع الحقول الصغيرة، فإنها تحد من عدد الصفوف التي تناسب مجموعة الصفوف، مما يزيد من عمليات الوصول إلى الملف. يتيح عزلها لمجموعات الصفوف ذات الحقول الصغيرة استيعاب عدد أكبر بكثير من الصفوف بينما تستخدم الحقول الكبيرة تخطيطات محسّنة لحجمها.</li>
<li><strong>تطور مرن <a href="https://milvus.io/docs/schema.md">للمخطط</a>.</strong> إضافة عمود يعني إنشاء ملف جديد. إزالة واحد يعني تخطيه في وقت القراءة. لا حاجة لإعادة كتابة البيانات التاريخية.</li>
</ul>
<p>والنتيجة: ينخفض عدد الملفات بأكثر من 10 أضعاف، ومكالمات واجهة برمجة التطبيقات بأكثر من 10 أضعاف، وينخفض زمن استجابة الاستعلام من دقائق إلى ثوانٍ.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 مقابل V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
<tr><th>أسبكت</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>تنظيم الملفات</td><td>مقسم حسب الحقل</td><td>مدمج حسب القطاع</td></tr>
<tr><td>الملفات لكل مجموعة</td><td>N × حقول × مدونات ثنائية</td><td>~ن × مجموعات الأعمدة</td></tr>
<tr><td>تنسيق التخزين</td><td>مدونة ثنائية مخصصة</td><td>باركيه (يدعم أيضًا لانس وفورتيكس)</td></tr>
<tr><td>تشذيب الأعمدة</td><td>طبيعي (ملفات على مستوى الحقل)</td><td>تشذيب أعمدة الباركيه</td></tr>
<tr><td>الإحصائيات</td><td>ملفات stats_log منفصلة</td><td>مضمنة في تذييل الباركيه</td></tr>
<tr><td>مكالمات S3 API لكل استعلام</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>وقت استجابة الاستعلام</td><td>دقيقة</td><td>ثوانٍ</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: تشذيب الملفات المستند إلى البيانات الوصفية<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>يدير Apache Iceberg الجداول التحليلية على مجموعات البيانات الضخمة في أنظمة البحيرات. عندما يمتد جدول ما على آلاف ملفات البيانات، فإن التحدي يكمن في تضييق نطاق الاستعلام إلى الملفات ذات الصلة فقط - دون مسح كل شيء.</p>
<p>إجابة Iceberg: تحديد الملفات التي يجب قراءتها <em>قبل</em> حدوث أي إدخال/إخراج للبيانات، باستخدام البيانات الوصفية ذات الطبقات. هذا هو نفس المبدأ وراء <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">تصفية البيانات الوصفية</a> للبيانات <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">الوصفية</a> في قواعد البيانات المتجهة - استخدام الإحصائيات المحسوبة مسبقًا لتخطي البيانات غير ذات الصلة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>تُظهر منظمة بيانات Iceberg دليل بيانات وصفية يحتوي على دليل بيانات وصفية مع metadata.json وقوائم بيانات وملفات بيانات، إلى جانب دليل بيانات يحتوي على ملفات باركيه مقسمة حسب التاريخ</span> </span></p>
<p>يستخدم Iceberg بنية بيانات وصفية ذات طبقات. تقوم كل طبقة بتصفية البيانات غير ذات الصلة قبل أن يتم الرجوع إلى الطبقة التالية - على غرار كيفية فصل <a href="https://milvus.io/docs/architecture_overview.md">قواعد البيانات الموزعة</a> للبيانات الوصفية عن البيانات للوصول الفعال.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>بنية Iceberg المكونة من أربع طبقات: تشير metadata.json إلى قوائم البيانات، والتي تشير إلى ملفات البيان التي تحتوي على إحصائيات على مستوى الملف، والتي تشير إلى ملفات بيانات الباركيه الفعلية</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">كيف يحدد Iceberg موقع البيانات؟</h3><p>ضع في اعتبارك <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>قراءة metadata.json</strong> (1 I/O) - تحميل اللقطة الحالية وقوائم البيان الخاصة بها</li>
<li><strong>قراءة قائمة البيان</strong> (1 إدخال/إخراج) - تطبيق عوامل التصفية <a href="https://milvus.io/docs/use-partition-key.md">على مستوى القسم</a> لتخطي أقسام كاملة (على سبيل المثال، يتم حذف جميع بيانات 2023)</li>
<li><strong>قراءة ملفات البيان</strong> (2 إدخال/إخراج) - استخدام إحصائيات على مستوى الملف (الحد الأدنى/الأقصى للتاريخ، الحد الأدنى/الأقصى للمبلغ) لحذف الملفات التي لا تتطابق مع الاستعلام</li>
<li><strong>قراءة ملفات البيانات</strong> (3 عمليات إدخال/إخراج) - تبقى ثلاثة ملفات فقط ويتم قراءتها بالفعل</li>
</ol>
<p>بدلاً من مسح جميع ملفات البيانات الـ 1,000، يكمل Iceberg البحث في <strong>7 عمليات إدخال/إخراج</strong> - تجنب أكثر من 94% من عمليات القراءة غير الضرورية.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">كيف تعالج الأنظمة المختلفة البيانات<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
<tr><th>النظام</th><th>تنظيم البيانات</th><th>آلية العنونة الأساسية</th><th>تكلفة الوصول</th></tr>
</thead>
<tbody>
<tr><td>خريطة التجزئة</td><td>المفتاح → فتحة المصفوفة</td><td>دالة التجزئة → الفهرس المباشر</td><td>O(1) الوصول إلى الذاكرة</td></tr>
<tr><td>HDFS</td><td>المسار → الكتلة → كتلة → عقدة البيانات</td><td>خرائط تجزئة داخل الذاكرة + حساب الكتلة</td><td>1 RPC + قراءات كتلة N</td></tr>
<tr><td>كافكا</td><td>الموضوع → التقسيم → التقسيم</td><td>خريطة الشجرة + فهرس متناثر + مسح متسلسل</td><td>1 بحث عن الفهرس + 1 قراءة بيانات</td></tr>
<tr><td><a href="https://milvus.io/">ميلفوس</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">المجموعة</a> →<a href="https://milvus.io/docs/manage-collections.md">المجموعة</a> → الجزء → أعمدة الباركيه</td><td>البحث عن البيانات الوصفية + تشذيب الأعمدة</td><td>قراءات N (N = شرائح)</td></tr>
<tr><td>جبل جليدي</td><td>الجدول → اللقطة → اللقطة → البيان → ملفات البيانات</td><td>بيانات وصفية متعددة الطبقات + تشذيب إحصائي</td><td>3 قراءات البيانات الوصفية + قراءات البيانات M</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">ثلاثة مبادئ وراء العنونة الفعالة للبيانات<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. الحساب يتفوق دائمًا على البحث</h3><p>عبر كل نظام قمنا بفحصه، يتبع التحسين الأكثر فعالية نفس القاعدة: حساب مكان البيانات بدلاً من البحث عنها.</p>
<ul>
<li>تقوم HashMap بحساب فهرس مصفوفة من <code translate="no">hash(key)</code> بدلاً من البحث عنها.</li>
<li>يحسب HDFS الكتلة المستهدفة من إزاحة الملف بدلاً من اجتياز البيانات الوصفية لنظام الملفات</li>
<li>يقوم كافكا بحساب موضع المقطع والفهرس ذي الصلة بدلاً من مسح السجل</li>
<li>يستخدم Iceberg المسندات والإحصائيات على مستوى الملف لحساب الملفات التي تستحق القراءة</li>
</ul>
<p>الحساب هو عملية حسابية بتكلفة ثابتة. البحث هو اجتياز - المقارنات أو مطاردة المؤشرات أو الإدخال/الإخراج - وتنمو تكلفته مع حجم البيانات. عندما يتمكن النظام من اشتقاق الموقع مباشرة، يصبح البحث غير ضروري.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. تقليل عمليات الوصول ذات الكمون العالي</h3><p>هذا يعيدنا إلى المعادلة الأساسية: <strong>إجمالي تكلفة العنونة = الوصول إلى البيانات الوصفية + الوصول إلى البيانات.</strong> تهدف كل عملية تحسين في نهاية المطاف إلى تقليل هذه العمليات ذات الكمون العالي.</p>
<table>
<thead>
<tr><th>النمط</th><th>مثال</th></tr>
</thead>
<tbody>
<tr><td>تقليل عدد الملفات للحد من انتشار واجهة برمجة التطبيقات</td><td>دمج مقطع ميلفوس V2</td></tr>
<tr><td>استخدام الإحصائيات لاستبعاد البيانات مبكرًا</td><td>تشذيب بيان الجبل الجليدي</td></tr>
<tr><td>تخزين البيانات الوصفية في الذاكرة</td><td>اسم عقدة اسم HDFS، فهارس خريطة كافكا mmap</td></tr>
<tr><td>استبدال عمليات المسح المتسلسلة الصغيرة بقراءات عشوائية أقل</td><td>فهرس كافكا المتناثر</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. تتيح الإحصائيات اتخاذ قرارات مبكرة</h3><p>يتيح تسجيل المعلومات البسيطة في وقت الكتابة - قيم الحد الأدنى/الحد الأقصى، وحدود التقسيم، وعدد الصفوف - للأنظمة أن تقرر في وقت القراءة أي الملفات تستحق القراءة وأيها يمكن تخطيها بالكامل.</p>
<p>هذا استثمار صغير ذو مردود كبير. تحول الإحصائيات الوصول إلى الملفات من قراءة عمياء إلى اختيار مدروس. وسواء كانت إحصائيات التقليم على مستوى البيان في Iceberg أو إحصائيات تذييل ملف Parquet في Milvus V2، فإن المبدأ واحد: يمكن لبضعة بايتات من البيانات الوصفية في وقت الكتابة أن تلغي آلاف عمليات الإدخال/الإخراج في وقت القراءة.</p>
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
    </button></h2><p>من Two Sum إلى HashMap، ومن HDFS و Kafka إلى Milvus و Apache Iceberg، هناك نمط واحد يتكرر باستمرار: يعتمد الأداء على مدى كفاءة النظام في تحديد موقع البيانات.</p>
<p>مع نمو البيانات وانتقال التخزين من الذاكرة إلى القرص إلى تخزين الكائنات، تتغير الآليات - لكن الأفكار الأساسية لا تتغير. تقوم أفضل الأنظمة بحساب المواقع بدلاً من البحث، وتحتفظ بالبيانات الوصفية قريبة، وتستخدم الإحصائيات لتجنب لمس البيانات غير المهمة. يأتي كل فوز في الأداء الذي قمنا بفحصه من تقليل عمليات الوصول ذات الكمون العالي وتضييق مساحة البحث في أقرب وقت ممكن.</p>
<p>سواء كنت تقوم بتصميم خط أنابيب <a href="https://zilliz.com/learn/what-is-vector-search">بحث متجه،</a> أو بناء أنظمة على <a href="https://zilliz.com/learn/introduction-to-unstructured-data">بيانات غير منظمة،</a> أو تحسين محرك استعلام البحيرة، فإن المعادلة نفسها تنطبق. إن فهم كيفية معالجة نظامك للبيانات هو الخطوة الأولى نحو جعله أسرع.</p>
<hr>
<p>إذا كنت تعمل مع Milvus وترغب في تحسين أداء التخزين أو الاستعلام، فنحن نود مساعدتك:</p>
<ul>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> لطرح الأسئلة، ومشاركة بنيتك، والتعلم من المهندسين الآخرين الذين يعملون على مشاكل مماثلة.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية مدتها 20 دقيقة من ساعات عمل Milvus المكتبية</a> للتعرف على حالة الاستخدام الخاصة بك - سواء كانت تخطيط التخزين أو ضبط الاستعلام أو التوسع في الإنتاج.</li>
<li>إذا كنت تفضّل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدارة من قبل Milvus) تقدم لك مستوى مجاني للبدء.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تظهر عندما يبدأ المهندسون في التفكير في معالجة البيانات وتصميم التخزين:</p>
<p><strong>س: لماذا تحولت Milvus من التخزين على مستوى الحقل إلى التخزين على مستوى القطاع؟</strong></p>
<p>ج: في Milvus V1، كان يتم تخزين كل حقل في ملفات منفصلة على مستوى الحقل عبر القطاعات. بالنسبة لمجموعة تحتوي على 100 حقل و1000 مقطع، أدى ذلك إلى إنشاء مئات الآلاف من الملفات الصغيرة - كل منها يتطلب استدعاء واجهة برمجة تطبيقات S3 الخاصة به. يدمج V2 البيانات في ملفات Parquet القائمة على المقاطع، مما يقلل من عدد الملفات بأكثر من 10 أضعاف ويقلل من زمن الاستجابة للاستعلام من دقائق إلى ثوانٍ. الفكرة الأساسية: في تخزين الكائنات، يكون عدد مكالمات واجهة برمجة التطبيقات أكثر أهمية من إجمالي حجم البيانات.</p>
<p><strong>س: كيف يتعامل Milvus مع كل من البحث المتجه والتصفية القياسية بكفاءة؟</strong></p>
<p>يقوم Milvus V2 بتخزين <a href="https://milvus.io/docs/scalar_index.md">الحقول القياسية</a> <a href="https://milvus.io/docs/index-vector-fields.md">والحقول المتجهة</a> في مجموعات ملفات منفصلة داخل نفس المقطع. تستخدم الاستعلامات العددية تقليم أعمدة الباركيه وإحصائيات مجموعة الصفوف لتخطي البيانات غير ذات الصلة. يستخدم <a href="https://zilliz.com/learn/what-is-vector-search">البحث عن المتجهات</a> <a href="https://zilliz.com/learn/vector-index">فهارس متجهات</a> مخصصة. يشترك كلاهما في نفس بنية المقطع، لذلك يمكن أن تعمل <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">الاستعلامات المختلطة</a> - التي تجمع بين المرشحات العددية والتشابه المتجه - على نفس البيانات دون ازدواجية.</p>
<p><strong>س: هل ينطبق مبدأ "الحساب على البحث" على قواعد البيانات المتجهة؟</strong></p>
<p>ج: نعم. إن <a href="https://zilliz.com/learn/vector-index">فهارس المتجهات</a> مثل HNSW و IVF مبنية على نفس الفكرة. فبدلاً من مقارنة متجه الاستعلام مع كل متجه مخزن (بحث بالقوة الغاشمة)، فإنها تستخدم هياكل الرسم البياني أو مراكز المجموعات لحساب الأحياء التقريبية والقفز مباشرةً إلى المناطق ذات الصلة في فضاء المتجه. والمقايضة - خسارة صغيرة في الدقة مقابل عدد أقل من عمليات حساب المسافة بأضعاف - هي نفس نمط "الحساب على البحث" المطبق على بيانات <a href="https://zilliz.com/glossary/vector-embeddings">التضمين</a> عالية الأبعاد.</p>
<p><strong>س: ما هو أكبر خطأ في الأداء ترتكبه الفرق في تخزين الكائنات؟</strong></p>
<p>إنشاء عدد كبير جدًا من الملفات الصغيرة. يحتوي كل طلب S3 GET على حد زمني ثابت للكمون (حوالي 50 مللي ثانية)، بغض النظر عن كمية البيانات التي يتم إرجاعها. فالنظام الذي يقرأ 10000 ملف صغير يستغرق 500 ثانية من زمن الاستجابة - حتى لو كان إجمالي حجم البيانات متواضعًا. الحل هو الدمج: دمج الملفات الصغيرة في ملفات أكبر، واستخدام تنسيقات عمودية مثل Parquet للقراءات الانتقائية، والاحتفاظ بالبيانات الوصفية التي تتيح لك تخطي الملفات بالكامل.</p>
