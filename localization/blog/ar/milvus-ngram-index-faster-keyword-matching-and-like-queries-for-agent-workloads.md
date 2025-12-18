---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  تقديم فهرس ميلفوس نغرام: مطابقة أسرع للكلمات المفتاحية واستعلامات مشابهة
  لأحمال عمل الوكلاء
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  تعلّم كيف يعمل فهرس Ngram في Milvus على تسريع استعلامات LIKE من خلال تحويل
  مطابقة السلاسل الفرعية إلى عمليات بحث فعّالة عن n-gram، مما يوفر أداءً أسرع ب
  100 مرة.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>في أنظمة الوكلاء، يعد <strong>استرجاع السياق</strong> لبنة أساسية في جميع مراحل العملية، حيث يوفر الأساس للتفكير والتخطيط والعمل في المراحل النهائية. ويساعد البحث المتجه الوكلاء على استرجاع السياق الدلالي ذي الصلة التي تلتقط القصد والمعنى عبر مجموعات البيانات الكبيرة وغير المنظمة. ومع ذلك، فإن الصلة الدلالية وحدها لا تكفي في كثير من الأحيان. تعتمد خطوط أنابيب الوكيل أيضًا على البحث في النص الكامل لفرض قيود الكلمات الرئيسية الدقيقة - مثل أسماء المنتجات أو استدعاءات الوظائف أو رموز الأخطاء أو المصطلحات ذات الأهمية القانونية. تضمن هذه الطبقة الداعمة ألا يكون السياق المسترجع وثيق الصلة بالموضوع فحسب، بل يفي أيضًا بشكل صريح بالمتطلبات النصية الصعبة.</p>
<p>تعكس أعباء العمل الحقيقية هذه الحاجة باستمرار:</p>
<ul>
<li><p>يجب على مساعدي دعم العملاء العثور على محادثات تشير إلى منتج أو مكون معين.</p></li>
<li><p>يبحث مساعدو البرمجة عن مقتطفات تحتوي على اسم دالة أو استدعاء واجهة برمجة التطبيقات أو سلسلة أخطاء.</p></li>
<li><p>كما يقوم الوكلاء القانونيون والطبيون والأكاديميون بتصفية المستندات بحثاً عن البنود أو الاقتباسات التي يجب أن تظهر حرفياً.</p></li>
</ul>
<p>تقليديًا، تعاملت الأنظمة مع هذا الأمر باستخدام مشغل SQL <code translate="no">LIKE</code>. يعتبر الاستعلام مثل <code translate="no">name LIKE '%rod%'</code> بسيطًا ومدعومًا على نطاق واسع، ولكن في ظل التزامن العالي وأحجام البيانات الكبيرة، فإن هذه البساطة تحمل تكاليف أداء كبيرة.</p>
<ul>
<li><p><strong>فبدون فهرس،</strong> يقوم استعلام <code translate="no">LIKE</code> بمسح مخزن السياق بأكمله وتطبيق مطابقة النمط صفًا بصف. عند وجود ملايين السجلات، يمكن أن يستغرق حتى استعلام واحد ثوانٍ - وهو بطيء جدًا بالنسبة لتفاعلات الوكيل في الوقت الفعلي.</p></li>
<li><p><strong>حتى مع وجود فهرس مقلوب تقليدي،</strong> تظل أنماط أحرف البدل مثل <code translate="no">%rod%</code> صعبة التحسين لأن المحرك لا يزال يتعين على المحرك اجتياز القاموس بأكمله وتشغيل مطابقة الأنماط على كل إدخال. تتجنب العملية عمليات مسح الصفوف ولكنها تظل خطية بشكل أساسي، مما يؤدي إلى تحسينات هامشية فقط.</p></li>
</ul>
<p>هذا يخلق فجوة واضحة في أنظمة الاسترجاع الهجينة: يعالج البحث المتجه الصلة الدلالية بكفاءة، ولكن غالبًا ما تصبح تصفية الكلمات الرئيسية الدقيقة أبطأ خطوة في خط الأنابيب.</p>
<p>يدعم Milvus أصلاً البحث الهجين المتجه والبحث في النص الكامل مع تصفية البيانات الوصفية. ولمعالجة القيود المفروضة على مطابقة الكلمات المفتاحية، يقدم Milvus <a href="https://milvus.io/docs/ngram.md"><strong>فهرس Ngram،</strong></a> الذي يحسن أداء <code translate="no">LIKE</code> من خلال تقسيم النص إلى سلاسل فرعية صغيرة وفهرستها للبحث الفعال. يقلل هذا الأمر بشكل كبير من كمية البيانات التي يتم فحصها أثناء تنفيذ الاستعلام، مما يوفر <strong>عشرات إلى مئات المرات أسرع</strong> <code translate="no">LIKE</code> الاستعلامات في أعباء العمل العميل الحقيقي.</p>
<p>تستعرض بقية هذه المقالة كيفية عمل فهرس نغرام في ميلفوس وتقييم أدائه في سيناريوهات العالم الحقيقي.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">ما هو فهرس نغرام؟<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>في قواعد البيانات، عادةً ما يتم التعبير عن تصفية النصوص باستخدام <strong>SQL،</strong> وهي لغة الاستعلام القياسية المستخدمة لاسترجاع البيانات وإدارتها. أحد أكثر مشغلات النصوص استخدامًا هو <code translate="no">LIKE</code> ، والذي يدعم مطابقة السلاسل المستندة إلى الأنماط.</p>
<p>يمكن تجميع تعبيرات LIKE بشكل عام في أربعة أنواع أنماط شائعة، اعتمادًا على كيفية استخدام أحرف البدل:</p>
<ul>
<li><p><strong>مطابقة إنفكس</strong> (<code translate="no">name LIKE '%rod%'</code>): يطابق السجلات التي يظهر فيها قضيب السلسلة الفرعية في أي مكان في النص.</p></li>
<li><p><strong>مطابقة البادئة</strong> (<code translate="no">name LIKE 'rod%'</code>): يطابق السجلات التي يبدأ نصها ب "قضيب".</p></li>
<li><p><strong>مطابقة لاحقة</strong> (<code translate="no">name LIKE '%rod'</code>): يطابق السجلات التي ينتهي نصها ب قضيب.</p></li>
<li><p><strong>مطابقة أحرف البدل</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): يجمع بين شروط السلاسل الفرعية المتعددة (<code translate="no">%</code>) مع أحرف البدل ذات الحرف الواحد (<code translate="no">_</code>) في نمط واحد.</p></li>
</ul>
<p>على الرغم من اختلاف هذه الأنماط في المظهر والتعبير، إلا أن <strong>فهرس نغرام</strong> في ميلفوس يسرّعها جميعًا باستخدام نفس النهج الأساسي.</p>
<p>قبل بناء الفهرس، يقسّم ميلفوس كل قيمة نصية إلى سلاسل فرعية قصيرة ومتداخلة ذات أطوال ثابتة، تُعرف باسم <em>n-grams</em>. على سبيل المثال، عندما تكون n = 3، تتحلل كلمة <strong>"Milvus"</strong> إلى 3 جرامات التالية: <strong>"Mil"، و</strong> <strong>"ilv"، و</strong> <strong>"lvu"،</strong> و <strong>"vus".</strong> ثم يتم تخزين كل n-gram في فهرس مقلوب يعيّن السلسلة الفرعية إلى مجموعة معرّفات المستندات التي تظهر فيها. في وقت الاستعلام، تُترجم شروط <code translate="no">LIKE</code> إلى مجموعات من عمليات البحث عن n-gram، مما يسمح لـ Milvus بتصفية معظم السجلات غير المطابقة بسرعة وتقييم النمط مقابل مجموعة مرشحة أصغر بكثير. وهذا ما يحول عمليات مسح السلاسل المكلفة إلى استعلامات فعالة قائمة على الفهرس.</p>
<p>تتحكم معلمتان في كيفية إنشاء فهرس Ngram: <code translate="no">min_gram</code> و <code translate="no">max_gram</code>. ويحددان معًا نطاق أطوال السلاسل الفرعية التي يقوم ميلفوس بتوليدها وفهرستها.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: أقصر طول سلسلة فرعية للفهرسة. في الممارسة العملية، يحدد هذا أيضًا الحد الأدنى لطول السلسلة الفرعية للاستعلام التي يمكن أن تستفيد من فهرس Ngram</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: أطول طول سلسلة فرعية للفهرسة. في وقت الاستعلام، يُحدّد بالإضافة إلى ذلك الحد الأقصى لحجم النافذة المستخدمة عند تقسيم سلاسل الاستعلام الأطول إلى ن-غرامات.</p></li>
</ul>
<p>من خلال فهرسة جميع السلاسل الفرعية المتجاورة التي تقع أطوالها بين <code translate="no">min_gram</code> و <code translate="no">max_gram</code> ، يؤسس ميلفوس أساسًا متسقًا وفعالًا لتسريع جميع أنواع الأنماط المدعومة <code translate="no">LIKE</code>.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">كيف يعمل فهرس نغرام؟<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>يقوم ميلفوس بتنفيذ فهرس نغرام في عملية من مرحلتين:</p>
<ul>
<li><p><strong>بناء الفهرس:</strong> توليد أنماط نغرام لكل مستند وبناء فهرس مقلوب أثناء استيعاب البيانات.</p></li>
<li><p><strong>تسريع الاستعلامات:</strong> استخدام الفهرس لتضييق نطاق البحث إلى مجموعة مرشحة صغيرة، ثم التحقق من التطابقات الدقيقة <code translate="no">LIKE</code> على تلك الملفات المرشحة.</p></li>
</ul>
<p>مثال ملموس يسهّل فهم هذه العملية.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">المرحلة 1: بناء الفهرس</h3><p><strong>حلل النص إلى ن-غرامات:</strong></p>
<p>افترض أننا نقوم بفهرسة النص <strong>"Apple"</strong> بالإعدادات التالية:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>في ظل هذا الإعداد، يُنشئ ميلفوس جميع السلاسل الفرعية المتجاورة ذات الطول 2 و3:</p>
<ul>
<li><p>2-غرامات <code translate="no">Ap</code> ، <code translate="no">pp</code> ، <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3 - جرامات: <code translate="no">App</code> ، <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>إنشاء فهرس مقلوب:</strong></p>
<p>ضع في اعتبارك الآن مجموعة بيانات صغيرة مكونة من خمسة سجلات:</p>
<ul>
<li><p><strong>المستند 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>المستند 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>المستند 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>المستند 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>المستند 4: المستند 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>أثناء الاستيعاب، يُنشئ ميلفوس n-غرامات لكل سجل ويدرجها في فهرس مقلوب. في هذا الفهرس:</p>
<ul>
<li><p><strong>المفاتيح</strong> هي ن-غرامات (سلاسل فرعية)</p></li>
<li><p><strong>القيم</strong> هي قوائم بمعرّفات المستندات التي يظهر فيها ن-غرام</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>الآن تم بناء الفهرس بالكامل.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">المرحلة 2: تسريع الاستعلامات</h3><p>عندما يتم تنفيذ فلتر <code translate="no">LIKE</code> ، يستخدم ميلفوس فهرس نغرام لتسريع تقييم الاستعلام من خلال الخطوات التالية:</p>
<p><strong>1. استخراج مصطلح الاستعلام:</strong> يتم استخراج السلاسل الفرعية المتجاورة بدون أحرف البدل من التعبير <code translate="no">LIKE</code> (على سبيل المثال، <code translate="no">'%apple%'</code> يصبح <code translate="no">apple</code>).</p>
<p><strong>2. تحليل مصطلح الاستعلام:</strong> يتحلل مصطلح الاستعلام إلى n-غرامات بناءً على طوله (<code translate="no">L</code>) والمكون <code translate="no">min_gram</code> و <code translate="no">max_gram</code>.</p>
<p><strong>3. البحث عن كل غرام وتقاطعه:</strong> يبحث Milvus عن ن-غرامات الاستعلام في الفهرس المقلوب ويتقاطع مع قوائم معرّفات المستندات الخاصة بها لإنتاج مجموعة صغيرة مرشحة.</p>
<p><strong>4. التحقق من النتائج وإرجاعها:</strong> يتم تطبيق شرط <code translate="no">LIKE</code> الأصلي فقط على هذه المجموعة المرشحة لتحديد النتيجة النهائية.</p>
<p>من الناحية العملية، تعتمد الطريقة التي يتم بها تقسيم الاستعلام إلى ن-غرامات على شكل النمط نفسه. لنرى كيف يعمل هذا، سنركّز على حالتين شائعتين: مطابقات اللواحق ومطابقات أحرف البدل. تتصرف مطابقات البادئة واللاحقة بنفس الطريقة التي تتصرف بها مطابقات اللواحق، لذا لن نتناولها بشكل منفصل.</p>
<p><strong>مطابقة اللواحق</strong></p>
<p>بالنسبة لمطابقة اللواحق، يعتمد التنفيذ على طول السلسلة الفرعية الحرفية (<code translate="no">L</code>) بالنسبة إلى <code translate="no">min_gram</code> و <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (على سبيل المثال، <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>تقع السلسلة الفرعية الحرفية <code translate="no">ppl</code> بالكامل ضمن نطاق n-gram المكوّن. يبحث Milvus مباشرةً عن n-gram <code translate="no">&quot;ppl&quot;</code> في الفهرس المقلوب، مما ينتج عنه معرفات المستندات المرشحة <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>ولأن الحرف الحرفي نفسه هو عبارة عن n-غرام مفهرس، فإن جميع المرشحين يستوفون بالفعل شرط اللواحق. لا تستبعد خطوة التحقق النهائية أي سجلات، وتبقى النتيجة <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (على سبيل المثال، <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>تكون السلسلة الفرعية الحرفية <code translate="no">pple</code> أطول من <code translate="no">max_gram</code> ، لذلك يتم تحليلها إلى ن-غرامات متداخلة باستخدام حجم نافذة <code translate="no">max_gram</code>. مع <code translate="no">max_gram = 3</code> ، ينتج عن ذلك ن-غرامات <code translate="no">&quot;ppl&quot;</code> و <code translate="no">&quot;ple&quot;</code>.</p>
<p>يبحث ميلفوس عن كل n-غرام في الفهرس المقلوب:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>ينتج عن تقاطع هذه القوائم المجموعة المرشحة <code translate="no">[0, 1, 4]</code>. ثم يتم تطبيق مرشح <code translate="no">LIKE '%pple%'</code> الأصلي على هؤلاء المرشحين. يستوفي الثلاثة جميعًا الشرط، وبالتالي تظل النتيجة النهائية <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (على سبيل المثال، <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>تكون السلسلة الفرعية الحرفية أقصر من <code translate="no">min_gram</code> وبالتالي لا يمكن تحليلها إلى نغرامات ن مفهرسة. في هذه الحالة، لا يمكن استخدام فهرس Ngram، ويعود Milvus إلى مسار التنفيذ الافتراضي، حيث يقوم بتقييم الشرط <code translate="no">LIKE</code> من خلال مسح كامل مع مطابقة النمط.</p>
<p><strong>مطابقة أحرف البدل</strong> (على سبيل المثال، <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>يحتوي هذا النمط على عدة أحرف بدل، لذا يقوم ميلفوس أولاً بتقسيمه إلى حروف متجاورة: <code translate="no">&quot;Ap&quot;</code> و <code translate="no">&quot;pple&quot;</code>.</p>
<p>ثم يقوم ميلفوس بمعالجة كل حرف بشكل مستقل:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> طوله 2 ويقع ضمن نطاق n-غرام.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> أطول من <code translate="no">max_gram</code> ويتحلل إلى <code translate="no">&quot;ppl&quot;</code> و <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>وهذا يقلل الاستعلام إلى ن-غرامات التالية:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>ينتج عن تقاطع هذه القوائم مرشح واحد: <code translate="no">[0]</code>.</p>
<p>أخيرًا، يتم تطبيق مرشح <code translate="no">LIKE '%Ap%pple%'</code> الأصلي على المستند 0 (<code translate="no">&quot;Apple&quot;</code>). نظرًا لأنه لا يفي بالنمط الكامل، تكون مجموعة النتائج النهائية فارغة.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">القيود والمقايضات في فهرس نغرام<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>في حين أن فهرس Ngram يمكن أن يحسّن أداء الاستعلام <code translate="no">LIKE</code> بشكل كبير، إلا أنه يقدم مقايضات يجب أخذها بعين الاعتبار في عمليات النشر في العالم الحقيقي.</p>
<ul>
<li><strong>زيادة حجم الفهرس</strong></li>
</ul>
<p>التكلفة الأساسية لفهرس Ngram هي زيادة حجم التخزين. نظرًا لأن الفهرس يخزن جميع السلاسل الفرعية المتجاورة التي تقع أطوالها بين <code translate="no">min_gram</code> و <code translate="no">max_gram</code> ، فإن عدد ن-غرامات التي تم إنشاؤها ينمو بسرعة مع توسع هذا النطاق. فكل طول ن-غرام إضافي يضيف فعليًا مجموعة كاملة أخرى من السلاسل الفرعية المتداخلة لكل قيمة نصية، مما يزيد من عدد مفاتيح الفهرس وقوائم ترحيلها. عمليًا، يمكن أن يؤدي توسيع النطاق بحرف واحد فقط إلى مضاعفة حجم الفهرس تقريبًا مقارنةً بالفهرس المقلوب القياسي.</p>
<ul>
<li><strong>غير فعّال لجميع أعباء العمل</strong></li>
</ul>
<p>لا يعمل فهرس Ngram على تسريع كل أحمال العمل. فإذا كانت أنماط الاستعلام غير منتظمة إلى حدٍّ كبير، أو كانت تحتوي على حروف قصيرة جدًا، أو فشلت في تقليل مجموعة البيانات إلى مجموعة مرشحة صغيرة في مرحلة التصفية، فقد تكون فائدة الأداء محدودة. في مثل هذه الحالات، لا يزال بإمكان تنفيذ الاستعلام أن يقترب من تكلفة المسح الكامل، على الرغم من وجود الفهرس.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">تقييم أداء فهرس Ngram على استعلامات LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>الهدف من هذا المعيار هو تقييم مدى فعالية فهرس Ngram في تسريع استعلامات <code translate="no">LIKE</code> عمليًا.</p>
<h3 id="Test-Methodology" class="common-anchor-header">منهجية الاختبار</h3><p>لوضع أدائه في سياقه، نقوم بمقارنته مع وضعين أساسيين للتنفيذ:</p>
<ul>
<li><p><strong>الرئيسي</strong>: التنفيذ بالقوة الغاشمة دون أي فهرس.</p></li>
<li><p><strong>مقلوب رئيسي</strong>: التنفيذ باستخدام فهرس مقلوب تقليدي.</p></li>
</ul>
<p>قمنا بتصميم سيناريوهين للاختبار لتغطية خصائص البيانات المختلفة:</p>
<ul>
<li><p><strong>مجموعة بيانات Wiki النصية</strong>: 100,000 صف، مع اقتطاع كل حقل نصي إلى 1 كيلوبايت.</p></li>
<li><p><strong>مجموعة بيانات كلمة واحدة</strong>: 1,000,000 صف، حيث يحتوي كل صف على كلمة واحدة.</p></li>
</ul>
<p>في كلا السيناريوهين، يتم تطبيق الإعدادات التالية باستمرار:</p>
<ul>
<li><p>تستخدم الاستعلامات <strong>نمط المطابقة اللواحق</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>يتم تكوين فهرس Ngram باستخدام <code translate="no">min_gram = 2</code> و <code translate="no">max_gram = 4</code></p></li>
<li><p>لعزل تكلفة تنفيذ الاستعلام وتجنب النفقات الزائدة لتجسيد النتائج، تقوم جميع الاستعلامات بإرجاع <code translate="no">count(*)</code> بدلاً من مجموعات النتائج الكاملة.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">النتائج</h3><p><strong>اختبار للويكي، كل سطر عبارة عن نص ويكي مع اقتطاع طول المحتوى بمقدار 1000، 100 ألف صف</strong></p>
<table>
<thead>
<tr><th></th><th>حرفي</th><th>الوقت (مللي ثانية)</th><th>السرعة</th><th>العد</th></tr>
</thead>
<tbody>
<tr><td>ماجستير</td><td>الملعب</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>ملعب رئيسي مقلوب</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>نغرام</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماجستير</td><td>مدرسة ثانوية</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>ماجستير مقلوب</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>نغرام</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماستر</td><td>هي مدرسة ثانوية مختلطة ذات نظام تعليمي مختلط، مدرسة ثانوية راعية</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>ماستر مقلوب</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>نغرام</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>اختبار للكلمات المفردة، 1 مليون صف</strong></p>
<table>
<thead>
<tr><th></th><th>حرفي</th><th>الوقت (مللي ثانية)</th><th>تسريع</th><th>العد</th></tr>
</thead>
<tbody>
<tr><td>الرئيسي</td><td>نا</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>سيد مقلوب</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>نغرام</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماجستير</td><td>نات</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>سيد مقلوب</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>نغرام</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماجستير</td><td>ناتي</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>سيد مقلوب</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>نغرام</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماجستير</td><td>ناتو</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>سيد مقلوب</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>نغرام</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>ماجستير</td><td>الأمة</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>سيد مقلوب</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>نغرام</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>ملاحظة:</strong> تستند هذه النتائج إلى معايير أجريت في مايو/أيار. منذ ذلك الحين، خضع الفرع الرئيسي إلى تحسينات إضافية على الأداء، لذا من المتوقع أن تكون فجوة الأداء الملحوظة هنا أصغر في الإصدارات الحالية.</p>
<p>تُبرز النتائج المعيارية نمطًا واضحًا: يُسرّع فهرس Ngram استعلامات LIKE بشكل كبير في جميع الحالات، وتعتمد سرعة أداء الاستعلامات بشكل كبير على بنية وطول البيانات النصية الأساسية.</p>
<ul>
<li><p>بالنسبة <strong>للحقول النصية الطويلة،</strong> مثل المستندات على غرار ويكي التي تم اقتطاعها إلى 1,000 بايت، فإن مكاسب الأداء تكون واضحة بشكل خاص. فمقارنةً بالتنفيذ بالقوة الغاشمة مع عدم وجود فهرس، يحقق فهرس Ngram تسريعًا يتراوح <strong>بين 100-200 مرة</strong> تقريبًا. وعند مقارنته بالفهرس المقلوب التقليدي، يكون التحسن أكثر دراماتيكيةً، حيث يصل إلى <strong>1,200-1,900×</strong>. ويرجع ذلك إلى أن الاستعلامات المماثلة على النصوص الطويلة مكلفة بشكل خاص بالنسبة لمقاربات الفهرسة التقليدية، في حين أن عمليات البحث عن نغرام يمكن أن تضيّق مساحة البحث بسرعة إلى مجموعة صغيرة جدًا من المرشحين.</p></li>
<li><p>في مجموعات البيانات التي تتألف من <strong>إدخالات من كلمة</strong> واحدة، تكون المكاسب أقل لكنها تظل كبيرة. في هذا السيناريو، يعمل فهرس نغرام أسرع بحوالي <strong>80-100 ضعف تقريب</strong> ًا من التنفيذ بالقوة الغاشمة وأسرع <strong>بـ45-55 ضعفًا</strong> من الفهرس المقلوب التقليدي. على الرغم من أن النص الأقصر أرخص بطبيعته في المسح الضوئي، إلا أن النهج القائم على n-gram لا يزال يتجنب المقارنات غير الضرورية ويقلل من تكلفة الاستعلام باستمرار.</p></li>
</ul>
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
    </button></h2><p>يعمل فهرس Ngram على تسريع الاستعلامات <code translate="no">LIKE</code> من خلال تقسيم النص إلى نغرامات ذات طول ثابت وفهرستها باستخدام بنية مقلوبة. يحول هذا التصميم مطابقة السلاسل الفرعية المكلفة إلى عمليات بحث فعالة عن نغرام متبوعة بالحد الأدنى من التحقق. ونتيجة لذلك، يتم تجنب عمليات مسح النص الكامل بينما يتم الحفاظ على الدلالات الدقيقة لـ <code translate="no">LIKE</code>.</p>
<p>من الناحية العملية، يكون هذا النهج فعالاً عبر مجموعة واسعة من أعباء العمل، مع نتائج قوية بشكل خاص للمطابقة الضبابية في الحقول النصية الطويلة. وبالتالي، فإن فهرس Ngram مناسب تمامًا لسيناريوهات الوقت الحقيقي مثل البحث عن الرموز، ووكلاء دعم العملاء، واسترجاع المستندات القانونية والطبية، وقواعد المعرفة المؤسسية، والبحث الأكاديمي، حيث تظل المطابقة الدقيقة للكلمات الرئيسية ضرورية.</p>
<p>في الوقت نفسه، يستفيد فهرس Ngram من التكوين الدقيق. اختيار القيم المناسبة <code translate="no">min_gram</code> و <code translate="no">max_gram</code> أمر بالغ الأهمية لتحقيق التوازن بين حجم الفهرس وأداء الاستعلام. عندما يتم ضبطه ليعكس أنماط الاستعلام الحقيقية، يوفر فهرس نغرام حلاً عملياً وقابلاً للتطوير للاستعلامات عالية الأداء <code translate="no">LIKE</code> في أنظمة الإنتاج.</p>
<p>لمزيد من المعلومات حول فهرس نغرام، راجع الوثائق أدناه:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">وثائق فهرس نغرام | وثائق ميلفوس</a></li>
</ul>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من ميلفوس؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة ديسكورد</a> الخاصة بنا أو قم بتسجيل المشاكل على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل ميلفوس المكتبية</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">تعرف على المزيد حول ميزات Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">تقديم ميلفوس 2.6: بحث متجه ميسور التكلفة على نطاق المليار</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">تقديم وظيفة التضمين: كيف يعمل ملفوس 2.6 على تبسيط عملية البحث في المتجهات والبحث الدلالي</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">تمزيق JSON في ميلفوس: تصفية JSON أسرع ب 88.9 مرة مع المرونة</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">فتح الاسترجاع الحقيقي على مستوى الكيان: مصفوفة جديدة من الهياكل وقدرات MAX_SIM في ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">الجمع بين التصفية الجغرافية المكانية والبحث في المتجهات مع الحقول الهندسية وRTREE في ملفوس 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">تقديم AISAQ في Milvus: أصبح البحث عن المتجهات بمليارات النطاقات أرخص ب 3,200 مرة على الذاكرة</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">تحسين NVIDIA CAGRA في Milvus: نهج هجين بين وحدة معالجة الرسومات ووحدة المعالجة المركزية للفهرسة الأسرع والاستعلامات الأرخص</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في Milvus: السلاح السري لمكافحة التكرارات في بيانات تدريب LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - قواعد بيانات المتجهات تستحق اختبارًا حقيقيًا </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس </a></p></li>
</ul>
