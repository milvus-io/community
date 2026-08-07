---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 'من الاسترجاع إلى النتائج المُهيكلة: التجميع وORDER BY في Milvus 3.0'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  تعرّف على كيفية إضافة Milvus 3.0 لتجميع الاستعلامات، وتجميع البحث، وORDER BY
  من جانب الخادم للحصول على نتائج بحث متجهي منظّمة وفعّالة.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>لنتأمل تدفقًا مألوفًا للبحث عن المنتجات. يحمّل متسوق صورة لفستان، ويسترجع البحث المتجهي مجموعة مرشحة ذات صلة من كتالوج يحتوي على عشرات الملايين من المنتجات.</p>
<p>لكن الصفحة تحتاج إلى أكثر من قائمة مرتبة. فهي تحتاج إلى واجهات تصفية حسب العلامة التجارية. وتحتاج إلى فرز حسب السعر. ويريد فريق الترويج التجاري معرفة العلامات التجارية التي تهيمن على مجموعة النتائج هذه، ونطاق السعر داخل كل علامة تجارية، وبضعة منتجات تمثيلية من كل مجموعة.</p>
<p>قبل Milvus 3.0، كانت التطبيقات تتولى عادةً تلك الخطوة الثانية بنفسها: جلب الصفوف من Milvus، وتجميعها وفرزها في pandas أو في طبقة خدمة، ثم تجميع الاستجابة. حافظت بعض الفرق على مسار تحليلات منفصل فقط لحساب الأعداد والتوزيعات على بيانات كانت موجودة بالفعل في قاعدة البيانات المتجهية.</p>
<p>كانت قاعدة البيانات المتجهية تعثر على المرشحين؛ وكان على التطبيق تحويلهم إلى نتيجة منظمة.</p>
<p>ينقل Milvus 3.0 المزيد من هذا العمل إلى محرك الاسترجاع. ويضيف ثلاث قدرات مترابطة لكنها متميزة:</p>
<ul>
<li><strong>تجميع الاستعلامات</strong> يحسب <code translate="no">count</code> و<code translate="no">sum</code> و<code translate="no">avg</code> و<code translate="no">min</code> و<code translate="no">max</code> على الصفوف المرئية والمفلترة، مع حقول <code translate="no">GROUP BY</code> اختيارية.</li>
<li><strong>تجميع البحث</strong> ينظم مرشحي أقرب الجيران التقريبيين (ANN) المحتفظ بهم في دلاء، ويحسب مقاييس لكل دلو، ويبني دلاء متداخلة، ويعيد نتائج تمثيلية.</li>
<li><strong>من جانب الخادم</strong> يفرز <code translate="no">**ORDER BY**</code> نتائج الاستعلام أو مرشحي ANN حسب حقل قياسي واحد أو أكثر قبل أن يتلقاها التطبيق.</li>
</ul>
<p>التمييز بين الاستعلام والبحث مهم:</p>
<table>
<thead>
<tr><th>القدرة</th><th>البيانات التي يجري تلخيصها أو ترتيبها</th><th>الشكل الأساسي للنتيجة</th><th>حدود الدقة</th></tr>
</thead>
<tbody>
<tr><td>تجميع الاستعلامات</td><td>كل الصفوف المرئية التي تطابق عامل التصفية</td><td>صف واحد لكل مجموعة، مع قيم تجميعية</td><td>دقيق على مجموعة الصفوف المرئية للاستعلام</td></tr>
<tr><td>تجميع البحث</td><td>المرشحون المحتفظ بهم عبر بحث ANN ومرحلة التجميع</td><td>دلاء، ومقاييس، ونتائج تمثيلية، ودلاء فرعية اختيارية</td><td>تقريبي بطبيعته</td></tr>
<tr><td><code translate="no">ORDER BY</code> في الاستعلام</td><td>الصفوف المرئية التي تطابق عامل التصفية</td><td>صفوف مرتبة</td><td>دقيق على نتيجة الاستعلام المفلترة</td></tr>
<tr><td><code translate="no">ORDER BY</code> في البحث</td><td>مرشحو ANN</td><td>نتائج بحث أو مجموعات مرتبة</td><td>لا يوسّع حدود استدعاء ANN</td></tr>
</tbody>
</table>
<p>تشرح هذه المقالة لماذا تنتمي هذه العمليات إلى داخل قاعدة البيانات، وكيف يعمل التجميع الموزع، وكيف يختلف تجميع البحث عن البحث بالتجميع، وأين تتوقف الدلالات الجديدة.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">لماذا ينهار ما بعد المعالجة من جانب التطبيق<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>قد يبدو نقل التجميع والفرز إلى التطبيق خيار تنفيذ صغيرًا. وعلى نطاق واسع، يخلق ذلك ثلاث مشكلات أكبر.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">ينقل التطبيق بيانات أكثر بكثير مما تحتويه الإجابة</h3><p>لنفترض أن لوحة مراقبة العمليات تحتاج إلى عدد المنتجات ومتوسط السعر لكل فئة بين مليوني صف متاح في المخزون. حتى مع حمولة تقريبية لا تتجاوز 100 بايت لكل صف للفئة والسعر والمفتاح الأساسي ونفقات التسلسل، يجب على التطبيق استقبال نحو 200 ميغابايت من البيانات قبل أن يتمكن من حساب النتيجة.</p>
<p>إذا كان الكتالوج يحتوي على 200 فئة، فإن الإجابة لا تتجاوز بضع مئات من المفاتيح والأرقام—أي في حدود الكيلوبايتات. ينقل التطبيق بيانات أكبر بعدة مراتب مما يعيده، ويدفع التكلفة نفسها عند كل تحديث، ويحتاج إلى ذاكرة عميل كافية للاحتفاظ بالصفوف الوسيطة أو بثها.</p>
<p>يغيّر التجميع داخل المحرك وحدة نقل البيانات. تبقى الصفوف الخام حيث هي. وما يعبر بين العقد ويغادر Milvus في النهاية هو مجموعة أصغر بكثير من حالات المجموعات الجزئية والنهائية.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">الفرز المحلي للصفحة ليس فرزًا عالميًا</h3><p>الفرز بعد التقسيم إلى صفحات خطأ في الصحة، وليس مجرد تنفيذ غير فعال.</p>
<p>إذا جلب تطبيق الصفوف من 11 إلى 20 وفرز تلك الصفوف فقط حسب السعر، فإنه أنتج ترتيب السعر داخل تلك الصفحة—وليس الصفوف من 11 إلى 20 من النتيجة المفرزة عالميًا حسب السعر. قد تحتوي صفحة لاحقة على منتجات أرخص من كل منتج في الصفحة الأولى.</p>
<p>ينطبق الحد نفسه في البحث المتجهي. فجلب مجموعة Top-K صغيرة وفرزها في التطبيق لا يستطيع إلا إعادة ترتيب أولئك المرشحين. ولا يمكنه استرجاع مرشحين ذوي صلة لم تُعدهم مرحلة ANN، وغالبًا ما يدفع التطبيقات إلى الإفراط في الجلب فقط لجعل الفرز من جانب العميل مفيدًا.</p>
<p>يمنح الفرز من جانب الخادم Milvus التحكم في تسلسل الترتيب والتقسيم إلى صفحات. بالنسبة لأعباء عمل الاستعلام، يفرز المحرك مجموعة الصفوف المفلترة قبل تطبيق نافذة الصفحة. وبالنسبة لأعباء عمل البحث، يفرز داخل حدود مرشحي ANN ويبقي ذلك القيد صريحًا.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">لا يستطيع العميل إعادة إنتاج رؤية قاعدة البيانات</h3><p>يعتمد التجميع أيضًا على الصفوف المرئية عند الطابع الزمني للاستعلام. تتحكم دلالات التحكم متعدد الإصدارات في التزامن (MVCC) والاتساق في Milvus في عمليات الحذف والكيانات منتهية الصلاحية والكتابات المتزامنة.</p>
<p>بمجرد مغادرة الصفوف الخام لقاعدة البيانات، يفترض التطبيق عادةً أن الدفعة المستلمة تمثل اللقطة الصحيحة. إعادة بناء قواعد الرؤية نفسها في العميل أمر غير عملي، خاصة أثناء تلقي المجموعة لعمليات كتابة وحذف.</p>
<p>الحل البديل الشائع—محرك تحليلات ثانٍ يُغذّى عبر التصدير وETL—يضيف نسخة أخرى من البيانات، وحدًا آخر للاتساق، ومسارًا آخر للتشغيل. يجب أن تعمل الأعداد والمقاييس والفرز حيث توجد بالفعل كل من البيانات وقواعد رؤيتها.</p>
<p>والآن، لنلقِ نظرة على ما يقدمه Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">تجميع الاستعلامات: إحصاءات دقيقة على الصفوف المرئية<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>يجيب تجميع الاستعلامات عن أسئلة مثل:</p>
<ul>
<li>كم عدد المنتجات المتاحة في المخزون في كل فئة؟</li>
<li>ما متوسط السعر لكل علامة تجارية؟</li>
<li>ما الحد الأدنى والحد الأقصى للطوابع الزمنية للأحداث لكل مضيف؟</li>
<li>كم عدد السجلات المتبقية بعد تطبيق عامل تصفية ورؤية TTL؟</li>
</ul>
<p>تبدو واجهة API مألوفة لأي شخص استخدم SQL: مرّر حقلًا واحدًا أو أكثر في <code translate="no">group_by_fields</code>، ثم ضع تعبيرات التجميع في <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>الصياغة هي الجزء البسيط. أما نموذج التنفيذ فهو ما يجعل النتيجة مفيدة في قاعدة بيانات متجهية موزعة.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">تحل الحالات المحلية للمقاطع محل نقل الصفوف الخام</h3><p>يمكن لمجموعة Milvus أن تمتد عبر مئات أو آلاف المقاطع الموزعة على عدة عقد استعلام، مع بقاء البيانات المكتوبة حديثًا على مسار البث. لا تبدأ أي عقدة تنفيذ واحدة ومعها كل صف مرئي.</p>
<p>لذلك يدفع Milvus التجميع إلى المقاطع:</p>
<ol>
<li>يطبق كل مقطع عامل التصفية وقواعد رؤية MVCC محليًا.</li>
<li>يصدر المقطع حالة جزئية واحدة لكل مجموعة بدلًا من صفوفه المطابقة.</li>
<li>تُدمج الحالات الجزئية داخل عقدة الاستعلام.</li>
<li>ينفذ الوكيل الدمج النهائي عبر العقد ويعيد المجموعات المكتملة.</li>
</ol>
<p>يتوسع مقدار البيانات الوسيطة الآن مع عدد المجموعات وحالات التجميع، بدلًا من التوسع مباشرة مع عدد الصفوف المطابقة.</p>
<p>تعتمد عملية الدمج على التجميع:</p>
<table>
<thead>
<tr><th>التجميع</th><th>الحالة الجزئية</th><th>قاعدة الدمج</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>عدد جزئي</td><td>إضافة الأعداد</td></tr>
<tr><td><code translate="no">sum</code></td><td>مجموع جزئي</td><td>إضافة المجاميع</td></tr>
<tr><td><code translate="no">min</code></td><td>حد أدنى جزئي</td><td>أخذ الحد الأدنى</td></tr>
<tr><td><code translate="no">max</code></td><td>حد أقصى جزئي</td><td>أخذ الحد الأقصى</td></tr>
<tr><td><code translate="no">avg</code></td><td>مجموع وعدد جزئيان</td><td>إضافة كلتا الحالتين، ثم القسمة مرة واحدة في المرحلة النهائية</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> هي الحالة التعليمية. فحساب متوسط متوسطين جزئيين غير صحيح عندما تحتوي الأقسام على أعداد مختلفة من الصفوف. يحمل Milvus <code translate="no">sum</code> و<code translate="no">count</code> بشكل مستقل ويحسب المتوسط النهائي فقط بعد دمج كليهما عالميًا.</p>
<p>هذا أحد أسباب انتماء التجميع إلى قاعدة البيانات: فالعملية ليست ببساطة “تشغيل الدالة نفسها على عدة دفعات”. يجب على المحرك الحفاظ على الجبر الخاص بكل تجميع عبر حدود المقاطع والعقد.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">تُطبّق الرؤية قبل التجميع</h3><p>تُزال الصفوف المحذوفة ومنتهية الصلاحية من الحالات الجزئية على مستوى المقطع وفقًا لحدود الرؤية الخاصة بالاستعلام. فهي لا تنتقل إلى الأعلى ثم تُصحح في التطبيق.</p>
<p>لذلك تصف النتيجة الصفوف التي يعتبرها Milvus مرئية لذلك الطلب، وليس مجموعة عشوائية من الدفعات المسحوبة في أوقات مختلفة قليلًا.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header">أصبح <code translate="no">limit</code> يحسب المجموعات</h3><p>في الاستعلام العادي، يتحكم <code translate="no">limit</code> في عدد صفوف الكيانات التي تُعاد. في الاستعلام المجمّع، يتحكم في عدد المجموعات التي تُعاد. ولأن عدد النتائج يُحدد بالمجموعات بدلًا من الصفوف المطابقة، يمكن لتجميع الاستعلام أيضًا حذف <code translate="no">limit</code> عندما يحتاج إلى كل مجموعة.</p>
<p>يبدو هذا تفصيلًا صغيرًا في واجهة API، لكنه يعكس نموذج نتيجة مختلفًا: لم يعد الناتج صفحة من الكيانات. إنه علاقة تمثل صفوفها مجموعات.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">تجميع البحث: عرض قائم على الدلاء لمرشحي ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>يجيب تجميع الاستعلامات عن سؤال: “كيف تبدو الصفوف المرئية المطابقة لهذا الفلتر؟” أما تجميع البحث فيطرح سؤالًا مختلفًا: “كيف تبدو مجموعة المرشحين المسترجعة لهذا المتجه؟”</p>
<p>لا توجد لهذه العملية مكافئة SQL دقيقة. يبدأ بحث ANN بإنشاء حدود مرشحين مدفوعة بالتشابه. ثم ينظم Milvus المرشحين المحتفظ بهم حسب مفاتيح قياسية ويعيد شجرة دلاء بدلًا من قائمة نتائج مسطحة عادية.</p>
<p>يمكن أن يحتوي الدلو على:</p>
<ul>
<li>مفتاح مثل <code translate="no">brand</code> أو مفتاح مركب مثل <code translate="no">(brand, color)</code>؛</li>
<li>عدد المرشحين المحتفظ بهم؛</li>
<li>مقاييس تشمل <code translate="no">count</code> و<code translate="no">sum</code> و<code translate="no">avg</code> و<code translate="no">min</code> و<code translate="no">max</code>؛</li>
<li>كيانات تمثيلية مختارة باستخدام <code translate="no">top_hits</code>؛ و</li>
<li><code translate="no">sub_aggregation</code> متداخل ينشئ دلاء فرعية.</li>
</ul>
<p>بالنسبة لصفحة البحث عن المنتجات، يمكن لطلب واحد إرجاع دلاء العلامات التجارية، ومتوسط السعر داخل كل دلو، وثلاثة منتجات تمثيلية لكل علامة تجارية:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>عند تعيين <code translate="no">search_aggregation</code>، تكون قائمة النتائج العادية فارغة. يقرأ التطبيق استجابة الدلاء من <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">تحدد مواصفة التجميع حدين مختلفين</h3><p>لا يشغل تجميع البحث <code translate="no">GROUP BY</code> على كل كيان في المجموعة، ولا يأخذ ببساطة استجابة Top-K عادية ويجمع تلك القائمة المسطحة.</p>
<p>يتكون تنفيذه من ثلاث مراحل:</p>
<ol>
<li>يشغّل Milvus بحث ANN لاسترجاع المرشحين القريبين من متجه الاستعلام.</li>
<li>تحتفظ مرحلة التجميع بعدد محدود من المرشحين لكل مفتاح دلو كامل.</li>
<li>يبني Milvus الدلاء، ويحسب المقاييس على المرشحين المحتفظ بهم، ويرتب الدلاء، ويرفق نتائج تمثيلية أو دلاء فرعية.</li>
</ol>
<p>يتحكم معلمان في أجزاء مختلفة من النتيجة:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> يحد من عدد الدلاء التي تُعاد عند مستوى التجميع ذلك.</li>
<li>أكبر <code translate="no">TopHits.size</code> في أي مكان في شجرة التجميع يحدد ميزانية المرشحين المحتفظ بهم لكل مفتاح مركب كامل. إذا لم يتضمن الطلب أي <code translate="no">top_hits</code>، تكون الميزانية الافتراضية لكل مفتاح واحدًا.</li>
</ul>
<p>لا يتحكم <code translate="no">limit</code> الخاص بالبحث على المستوى الأعلى في هذا الوضع ويتم تجاهله عند وجود <code translate="no">search_aggregation</code>.</p>
<p>هذا التمييز أساسي عند قراءة <code translate="no">count</code> أو المقاييس الخاصة بدلو. مع <code translate="no">TopHits(size=3)</code>، يمكن لدلو علامة تجارية أن يلخص على الأكثر ثلاثة مرشحين محتفظًا بهم لمفتاحه الكامل، حتى لو كانت المجموعة تحتوي على آلاف المنتجات ذات الصلة من تلك العلامة التجارية. زيادة <code translate="no">TopHits.size</code> توسّع نافذة المقاييس لكل مفتاح، لكنها لا تحول بحث ANN إلى مسح دقيق.</p>
<p>إذا احتاج التطبيق إلى إحصاءات دقيقة على كل صف مرئي يطابق عامل تصفية، فيجب أن يستخدم تجميع الاستعلامات. تجميع البحث مخصص لوصف ومقارنة المرشحين الذين ينتجهم الاسترجاع القائم على التشابه.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">تجميع البحث والبحث بالتجميع يحلان مشكلات مختلفة<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>دعم Milvus البحث بالتجميع (<code translate="no">group_by</code>)منذ Milvus 2.4. من السهل رؤية كلمة “تجميع” في الميزتين وافتراض أنهما واجهتان للعملية نفسها. لكن عقود المخرجات مختلفة.</p>
<p><strong>البحث بالتجميع</strong> يغيّر الكيانات التي تظهر في قائمة نتائج مرتبة. يخزن نمط RAG شائع المقاطع ككيانات فردية، ويجمعها حسب <code translate="no">doc_id</code>، ويعيد مقطعًا واحدًا أو بضعة مقاطع من كل مستند. يبقى الناتج الأساسي نتائج بحث عادية، ولكن مع قيم مكررة أقل من حقل التجميع.</p>
<p><strong>تجميع البحث</strong> يعيد عرضًا إحصائيًا. الناتج الأساسي هو شجرة دلاء تحتوي على مفاتيح وأعداد ومقاييس ونتائج تمثيلية ودلاء فرعية اختيارية.</p>
<table>
<thead>
<tr><th>حاجة التطبيق</th><th>الأفضلية</th><th>الاستهلاك</th></tr>
</thead>
<tbody>
<tr><td>قائمة كيانات مرتبة مع تنوع أكبر عبر حقل</td><td>البحث بالتجميع</td><td>نتائج البحث العادية</td></tr>
<tr><td>أعداد الواجهات، أو مقاييس لكل مجموعة، أو نتائج تمثيلية، أو توزيعات متداخلة</td><td>تجميع البحث</td><td>كائنات <code translate="no">AggregationBucket</code> في <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>قاعدة عملية هي البدء من شكل استجابة واجهة المستخدم أو API. إذا كان التطبيق يعرض قائمة، فغالبًا ما يكون البحث بالتجميع هو البدائية المناسبة. وإذا كان يعرض واجهات تصفية أو بطاقات توزيع أو تسلسلًا هرميًا من المجموعات، فاستخدم تجميع البحث.</p>
<p>الوضعان متنافيان في طلب واحد لأنهما يعرّفان شكلين مختلفين للنتيجة الأساسية.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: انقل الفرز إلى ما قبل حدود التطبيق<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>الفرز هو الميزة الأقل غرابة في هذا الإصدار، وواحدة من أسهل الميزات التي تُنفذ بشكل غير صحيح خارج المحرك.</p>
<p>يعرض Milvus 3.0 الفرز في كل من الاستعلام والبحث، لكن المسارين يستخدمان معاملات SDK مختلفة ويعملان على مجموعات إدخال مختلفة.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">فرز الاستعلام يرتب مجموعة الصفوف المفلترة</h3><p>يستخدم استعلام PyMilvus <code translate="no">order_by</code>، معبرًا عنه كقائمة من سلاسل <code translate="no">&quot;field:direction&quot;</code>. يطبق المحرك عامل التصفية، ويرتب الصفوف المرئية، ثم يطبق <code translate="no">limit</code> و<code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>هذا يجعل الاستعلام مفيدًا للتصفح المرتب تجاريًا: أحدث السجلات المُدخلة، أو أعلى المنتجات سعرًا داخل عامل تصفية، أو أدنى مخزون، أو القيم القصوى لفحص البيانات. بدون الترتيب من جانب الخادم، كان على التطبيقات جلب الصفوف أولًا ولم تكن قادرة على تحديد ترتيب تجاري موثوق عبر الصفحات.</p>
<p>بالنسبة لحقول الاستعلام القابلة لأن تكون فارغة، يضع الترتيب التصاعدي القيم الخالية أخيرًا ويضع الترتيب التنازلي القيم الخالية أولًا. لا يلزم أن يظهر حقل الفرز في <code translate="no">output_fields</code>؛ أدرجه فقط عندما يحتاج التطبيق إلى القيمة في الاستجابة.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">فرز البحث يعيد ترتيب مجموعة مرشحي ANN</h3><p>يستخدم بحث PyMilvus <code translate="no">order_by_fields</code>، حيث يسمي كل إدخال حقلًا قياسيًا واتجاهًا:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>لا يزال ANN يحدد أي الكيانات تصبح مرشحة. يغيّر <code translate="no">order_by_fields</code> طريقة إرجاع أولئك المرشحين؛ ولا يجعل البحث يمسح المجموعة عالميًا للعثور على أرخص المنتجات.</p>
<p>يمنح ذلك الحد واجهتي API وظيفتين متميزتين:</p>
<ul>
<li>استخدم الاستعلام مع <code translate="no">order_by</code> عندما يحدد الترتيب القياسي نفسه النتيجة، مثل أرخص عشرة منتجات متاحة في المخزون.</li>
<li>استخدم البحث مع <code translate="no">order_by_fields</code> عندما تحدد الصلة الدلالية أو المتجهية مجموعة المرشحين ويحدد حقل قياسي كيفية عرض هؤلاء المرشحين.</li>
</ul>
<p>يطبق الفرز متعدد الحقول المفاتيح بترتيب القائمة. عندما يكون لدى مرشحي البحث القيم نفسها لكل مفتاح قياسي محدد، يحافظ Milvus على ترتيب درجة التشابه الأصلي.</p>
<p>يتكامل الفرز أيضًا مع البحث بالتجميع. يرتب Milvus المجموعات حسب القيمة القياسية المكوّنة من أعلى كيان في كل مجموعة مع الحفاظ على شكل النتيجة المجمّعة. وهذا مفيد عندما يريد التطبيق كلًا من التنوع عبر حقل وترتيب مجموعات ذي صلة بالأعمال.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">ما الذي تتيحه هذه القدرات<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>واجهات API هي بدائيات عامة لقواعد البيانات، لكن عدة أعباء عمل للاسترجاع تستفيد منها فورًا.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG والوكلاء: فحص تركّز الاسترجاع</h3><p>يمكن لنظام RAG أو نظام وكيل أن يجمع المقاطع المسترجعة في دلاء حسب المستند المصدر، أو خط المنتج، أو المستأجر، أو نوع المحتوى. النتيجة المركزة في مستندين تحمل إشارة تغطية مختلفة عن نتيجة موزعة عبر عشرات المصادر.</p>
<p>ذلك التوزيع ليس ضمانًا لجودة الإجابة. لكنه تشخيص استرجاع مفيد يمكن للتطبيق أو الوكيل دمجه مع الدرجات والاستشهادات والفحوصات الأخرى عند اتخاذ قرار بتوسيع الاستعلام، أو الاسترجاع مرة أخرى، أو طلب توضيح.</p>
<p>يبقى البحث بالتجميع هو الخيار الصحيح عندما يكون الهدف ببساطة تنويع المقاطع المعادة. ويكون تجميع البحث مفيدًا عندما يحتاج النظام إلى التوزيع نفسه.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">التجارة الإلكترونية وتوصية المحتوى: إرجاع الواجهات مع البحث</h3><p>يمكن لصفحة البحث عن المنتجات في البداية تلقي دلاء العلامات التجارية، ومقاييس الأسعار، والعناصر التمثيلية، وقائمة مرشحين مرتبة قياسيًا من Milvus. لا يزال التطبيق يتحكم في العرض ومنطق الأعمال، لكنه لم يعد بحاجة إلى إعادة بناء دلالات الدلاء الأساسية من النتائج المصدّرة.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">السجلات والأمان: الجمع بين التشابه وتوزيع الحوادث</h3><p>يمكن لبحث التشابه العثور على أحداث مرتبطة بسطر سجل مريب. ثم يمكن لتجميع البحث إظهار المضيفين الذين يهيمنون على هؤلاء المرشحين، أو الحد الأدنى والحد الأقصى للطابع الزمني في كل دلو مضيف، أو كيفية تقسيم المرشحين عبر الشدة والخدمة.</p>
<p>تبقى النتيجة عرضًا للمرشحين المسترجعين بدلًا من عدد عالمي دقيق للحوادث. عندما يحتاج التحقيق إلى أعداد دقيقة على كل حدث يطابق عامل تصفية، يوفر تجميع الاستعلامات ذلك المسار الثاني.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">العمليات واستكشاف البيانات: احسب بدلًا من التصدير</h3><p>يمكن للوحات المعلومات والأدوات الإدارية تشغيل أعداد ومتوسطات دقيقة على الصفوف المفلترة، ثم تصفح الكيانات الأساسية بترتيب قياسي محدد. يزيل ذلك العديد من أدوات “صدّر، واحسب، وافرز” المخصصة دون الادعاء بأن Milvus أصبح قاعدة بيانات تحليلية كاملة.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">الحدود: ما الذي لا يستبدله التجميع و<code translate="no">ORDER BY</code><button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>توسّع هذه الميزات محرك الاسترجاع؛ لكنها لا تحول Milvus إلى نظام معالجة تحليلية عبر الإنترنت (OLAP).</p>
<ul>
<li>يدعم تجميع الاستعلامات التجميع مع <code translate="no">count</code> و<code translate="no">sum</code> و<code translate="no">avg</code> و<code translate="no">min</code> و<code translate="no">max</code>. ولا يضيف عمليات ربط أو دوال نافذة أو استعلامات فرعية معقدة. لا تزال الوظائف التحليلية الكبيرة غير المتصلة تنتمي إلى أنظمة مثل Spark، التي يمكنها العمل مع لقطات Milvus 3.0 ومسارات التخزين المشتركة.</li>
<li>تدعم مفاتيح مجموعات الاستعلام حقول الأعداد الصحيحة و<code translate="no">VARCHAR</code> و<code translate="no">TIMESTAMPTZ</code>. وتدعم مفاتيح دلاء تجميع البحث أيضًا الحقول المنطقية. لا تُعد قيم الفاصلة العائمة أو المتجهات أو JSON أو المصفوفات مفاتيح دلاء.</li>
<li>بالنسبة لتجميع البحث، يقبل <code translate="no">count</code> <code translate="no">&quot;*&quot;</code> أو مصدرًا غير JSON وغير ديناميكي؛ ويتطلب <code translate="no">sum</code> و<code translate="no">avg</code> مصادر رقمية؛ ويدعم <code translate="no">min</code> و<code translate="no">max</code> أيضًا مصادر السلاسل و<code translate="no">TIMESTAMPTZ</code>. يتبع تجميع الاستعلامات حدود الأنواع الحسابية نفسها. راجع دليل API قبل تطبيق تجميع على نوع حقل معقد.</li>
<li>يمكن لتجميع الاستعلامات ترتيب الناتج المجمّع حسب مفاتيح المجموعات، بينما يبقى الترتيب حسب تجميع محسوب مثل <code translate="no">count(*)</code> حدًا حاليًا. وبدون ترتيب صريح، لا يكون ترتيب المجموعات مضمونًا.</li>
<li>لا يمكن حاليًا دمج تجميع البحث مع البحث الهجين، أو البحث بالتجميع، أو مكررات البحث، أو إزاحة غير صفرية، أو التمييز في الطلب نفسه.</li>
<li>تصف أعداد ومقاييس تجميع البحث مرشحي ANN المحتفظ بهم، وليس المجموعة الكاملة ولا كل كيان قد يكون ذا صلة دلاليًا.</li>
<li>يغيّر <code translate="no">ORDER BY</code> في البحث طريقة عرض المرشحين. ولا يصلح مرشحي ANN المفقودين أو يحول الاسترجاع بالتشابه إلى استعلام Top-N قياسي دقيق.</li>
</ul>
<p>أنظف طريقة للاختيار بين البدائيات الجديدة هي البدء بالسؤال:</p>
<ul>
<li>للإحصاءات الدقيقة على الصفوف المرئية المفلترة، استخدم تجميع الاستعلامات.</li>
<li>لتوزيع على مرشحي الاسترجاع بالتشابه، استخدم تجميع البحث.</li>
<li>لقائمة مرتبة متنوعة، استخدم البحث بالتجميع.</li>
<li>لترتيب قياسي محدد، استخدم <code translate="no">ORDER BY</code> في الاستعلام أو البحث وفقًا للمسار الذي أنشأ مجموعة النتائج.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">من قوائم المرشحين إلى نتائج منظمة<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>حسّنت قواعد البيانات المتجهية تقليديًا سؤالًا واحدًا: أي K كيانات هي الأقرب إلى هذا المتجه؟</strong></p>
<p>تطرح أنظمة الاسترجاع الإنتاجية أسئلة متابعة فورًا. أي المجموعات تهيمن على النتيجة؟ ما أعدادها ونطاقاتها؟ أي أمثلة تمثل كل مجموعة؟ وبأي ترتيب تجاري يجب على التطبيق عرض الصفوف أو المرشحين؟</p>
<p>يجلب Milvus 3.0 هذه العمليات إلى المحرك نفسه الذي يملك البيانات، وحدود مرشحي ANN، ودلالات الرؤية. ينفذ تجميع الاستعلامات اختزالًا موزعًا دقيقًا على الصفوف المرئية. ويبني تجميع البحث عرضًا قائمًا على الدلاء فوق مرشحي ANN المحتفظ بهم. ويمنح <code translate="no">ORDER BY</code> مساري الاستعلام والبحث ترتيبًا قياسيًا من جانب الخادم دون مطالبة التطبيق بإعادة بنائه صفحة بصفحة.</p>
<p>ليست النتيجة محرك OLAP مخفيًا داخل قاعدة بيانات متجهية. بل هي محرك استرجاع يستطيع إرجاع المزيد من البنية التي تحتاجها التطبيقات فعليًا.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">جرّب التجميع و<code translate="no">ORDER BY</code> في Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>يتوفر Milvus 3.0 الآن. استخدم <a href="https://milvus.io/docs/get-and-scalar-query.md">دليل الاستعلام</a> للتجميع الدقيق وفرز الاستعلامات، و<a href="https://milvus.io/docs/search-aggregation.md">دليل تجميع البحث</a> لدلالات الدلاء والحدود، و<a href="https://milvus.io/docs/single-vector-search.md">دليل البحث المتجهي الأساسي</a> لفرز البحث، و<a href="https://milvus.io/docs/grouping-search.md">دليل البحث بالتجميع</a> عندما يكون هدفك الأساسي تنوع النتائج.</p>
<p>للاطلاع على الإصدار الأوسع، راجع <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">مدونة إطلاق Milvus 3.0</a>، و<a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus 3.0</a>، و<a href="https://github.com/milvus-io/milvus">مستودع milvus-io/milvus</a>.</p>
<p>إذا كنت تريد تقييم واجهات API نفسها دون تشغيل العنقود بنفسك، فجرّبها على <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. يصف <a href="https://docs.zilliz.com/reference/python/python/Vector-query">مرجع استعلام Zilliz Cloud</a> الحالي و<a href="https://docs.zilliz.com/reference/python/python/Vector-search">مرجع البحث</a> التوفر والمعلمات لأنواع العناقيد المُدارة.</p>
<p>لمناقشة عبء عمل أو حالة طرفية مع الفريق، انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus على Discord</a> أو احجز <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">جلسة Milvus Office Hours</a>.</p>
