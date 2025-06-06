---
id: parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
title: 'الإعراب صعب: حل مشكلة الفهم الدلالي باستخدام Mistral OCR و Milvus'
author: Stephen Batifol
date: 2025-04-03T00:00:00.000Z
desc: >-
  مواجهة التحدي وجهاً لوجه باستخدام مزيج قوي من Mistral OCR وMilvus Vector DB،
  مما يحول كوابيس تحليل المستندات إلى حلم هادئ مع تضمينات متجهات ذات معنى دلالي
  يمكن البحث فيها.
cover: >-
  assets.zilliz.com/Parsing_is_Hard_Solving_Semantic_Understanding_with_Mistral_OCR_and_Milvus_316ac013b6.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>دعنا نواجه الأمر: تحليل المستندات أمر صعب - صعب للغاية. ملفات PDF، والصور، والتقارير، والجداول، والكتابة اليدوية الفوضوية؛ إنها مليئة بالمعلومات القيّمة التي يرغب المستخدمون في البحث عنها، ولكن استخراج تلك المعلومات والتعبير عنها بدقة في فهرس البحث الخاص بك يشبه حل لغز يستمر شكل القطع فيه بالتغير: كنت تعتقد أنك حللتها بسطر إضافي من التعليمات البرمجية ولكن غدًا يتم استيعاب مستند جديد وتجد حالة زاوية أخرى للتعامل معها.</p>
<p>في هذا المنشور، سنتعامل مع هذا التحدي وجهاً لوجه باستخدام مزيج قوي من Mistral OCR و Milvus Vector DB، مما يحول كوابيس تحليل المستندات إلى حلم هادئ مع تضمينات متجهات ذات معنى دلالي يمكن البحث فيها.</p>
<h2 id="Why-Rule-based-Parsing-Just-Wont-Cut-It" class="common-anchor-header">لماذا لا يفي التحليل المستند إلى القواعد بالغرض؟<button data-href="#Why-Rule-based-Parsing-Just-Wont-Cut-It" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت قد عانيت من أي وقت مضى مع أدوات التعرف الضوئي على الحروف القياسية، فربما تعرف أن لديها جميع أنواع المشكلات:</p>
<ul>
<li><strong>التخطيطات المعقدة</strong>: الجداول، والقوائم، والتنسيقات متعددة الأعمدة - يمكن أن تتعطل أو تشكل مشاكل لمعظم المحللين.</li>
<li><strong>الغموض الدلالي</strong>: الكلمات الرئيسية وحدها لا تخبرك ما إذا كانت كلمة "تفاحة" تعني فاكهة أم شركة.</li>
<li>مشكلة الحجم والتكلفة: تصبح معالجة آلاف المستندات بطيئة بشكل مؤلم.</li>
</ul>
<p>نحن بحاجة إلى نهج أكثر ذكاءً ومنهجية لا يكتفي باستخراج النص - بل <em>يفهم</em> المحتوى. وهنا بالضبط يأتي دور Mistral OCR وMilvus.</p>
<h2 id="Meet-Your-Dream-Team" class="common-anchor-header">تعرّف على فريق الأحلام<button data-href="#Meet-Your-Dream-Team" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Mistral-OCR-More-than-just-text-extraction" class="common-anchor-header">Mistral OCR: أكثر من مجرد استخراج النصوص</h3><p>إن Mistral OCR ليس أداة التعرف الضوئي على الحروف (OCR) العادية. فهي مصممة لمعالجة مجموعة واسعة من المستندات.</p>
<ul>
<li><strong>فهم عميق للمستندات المعقدة</strong>: سواء كانت صورًا مضمنة أو معادلات رياضية أو جداول مدمجة، يمكنها فهم كل ذلك بدقة عالية جدًا.</li>
<li><strong>يحتفظ بالتخطيطات الأصلية:</strong> لا يكتفي البرنامج بفهم التخطيطات المختلفة في المستندات فحسب، بل يحافظ أيضًا على التخطيطات الأصلية والبنية الأصلية سليمة. علاوة على ذلك، فهو قادر أيضًا على تحليل المستندات متعددة الصفحات.</li>
<li><strong>إتقان متعدد اللغات ومتعدد الوسائط</strong>: من الإنجليزية إلى الهندية إلى العربية، يمكن لـ Mistral OCR فهم المستندات عبر آلاف اللغات والنصوص، مما يجعلها لا تقدر بثمن للتطبيقات التي تستهدف قاعدة مستخدمين عالمية.</li>
</ul>
<h3 id="Milvus-Your-Vector-Database-Built-for-Scale" class="common-anchor-header">ميلفوس: قاعدة بياناتك المتجهة المصممة على نطاق واسع</h3><ul>
<li><strong>مليار + مقياس</strong>: يمكن لـ <a href="https://milvus.io/">Milvus</a> أن يتسع لمليارات المتجهات، مما يجعله مثاليًا لتخزين المستندات على نطاق واسع.</li>
<li><strong>البحث عن النص الكامل: بالإضافة إلى دعم التضمينات المتجهة الكثيفة،</strong> يدعم ميلفوس أيضًا البحث في النص الكامل. مما يجعل من السهل تشغيل الاستعلامات باستخدام النص والحصول على نتائج أفضل لنظام RAG الخاص بك.</li>
</ul>
<h2 id="Examples" class="common-anchor-header">أمثلة:<button data-href="#Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>لنأخذ هذه الملاحظة المكتوبة بخط اليد باللغة الإنجليزية على سبيل المثال. سيكون استخدام أداة التعرف الضوئي على الحروف العادية لاستخراج هذا النص مهمة صعبة للغاية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/A_handwritten_note_in_English_3bbc40dee7.png" alt="A handwritten note in English " class="doc-image" id="a-handwritten-note-in-english-" />
   </span> <span class="img-wrapper"> <span>ملاحظة مكتوبة بخط اليد باللغة الإنجليزية </span> </span></p>
<p>نقوم بمعالجتها باستخدام Mistral OCR</p>
<pre><code translate="no" class="language-python">api_key = os.getenv(<span class="hljs-string">&quot;MISTRAL_API_KEY&quot;</span>)
client = Mistral(api_key=api_key)

url = <span class="hljs-string">&quot;https://preview.redd.it/ocr-for-handwritten-documents-v0-os036yiv9xod1.png?width=640&amp;format=png&amp;auto=webp&amp;s=29461b68383534a3c1bf76cc9e36a2ba4de13c86&quot;</span>
result = client.ocr.process(
                model=ocr_model, document={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: url}
            )
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Result: <span class="hljs-subst">{result.pages[<span class="hljs-number">0</span>].markdown}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>ونحصل على المخرجات التالية. يمكنه التعرف على النص المكتوب بخط اليد بشكل جيد. يمكننا أن نرى أنه يحافظ حتى على التنسيق الكبير للكلمات &quot;مُجبر وغير طبيعي&quot;!</p>
<pre><code translate="no" class="language-Markdown">Today is Thursday, October 20th - But it definitely feels like a Friday. I<span class="hljs-string">&#x27;m already considering making a second cup of coffee - and I haven&#x27;</span>t even finished my first. Do I have a problem?
Sometimes I<span class="hljs-string">&#x27;ll fly through older notes I&#x27;</span>ve taken, and my handwriting is unrecamptable. Perhaps it depends on the <span class="hljs-built_in">type</span> of pen I use. I<span class="hljs-string">&#x27;ve tried writing in all cups but it looks so FORCED AND UNNATURAL.
Often times, I&#x27;</span>ll just take notes on my lapten, but I still seem to ermittelt forward pen and paper. Any advice on what to
improve? I already feel stressed at looking back at what I<span class="hljs-string">&#x27;ve just written - it looks like I different people wrote this!
</span><button class="copy-code-btn"></button></code></pre>
<p>الآن يمكننا بعد ذلك إدراج النص في ميلفوس للبحث الدلالي.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient 

COLLECTION_NAME = <span class="hljs-string">&quot;document_ocr&quot;</span>

milvus_client = MilvusClient(uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>)
<span class="hljs-string">&quot;&quot;&quot;
This is where you would define the index, create a collection etc. For the sake of this example. I am skipping it. 

schema = CollectionSchema(...)

milvus_client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    )

&quot;&quot;&quot;</span>

milvus_client.insert(collection_name=COLLECTION_NAME, data=[result.pages[<span class="hljs-number">0</span>].markdown])
<button class="copy-code-btn"></button></code></pre>
<p>لكن يمكن لميسترال أيضًا فهم المستندات بلغات مختلفة أو بتنسيق أكثر تعقيدًا، على سبيل المثال دعنا نجرب هذه الفاتورة باللغة الألمانية التي تجمع بين بعض أسماء العناصر باللغة الإنجليزية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_Invoice_in_German_994e204d49.png" alt="An Invoice in German" class="doc-image" id="an-invoice-in-german" />
   </span> <span class="img-wrapper"> <span>فاتورة باللغة الألمانية</span> </span></p>
<p>لا يزال برنامج Mistral OCR قادرًا على استخراج جميع المعلومات التي لديك، بل إنه ينشئ بنية الجدول بتنسيق Markdown الذي يمثل الجدول من الصورة الممسوحة ضوئيًا.</p>
<pre><code translate="no"><span class="hljs-title class_">Rechnungsadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Lieferadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Rechnungsinformationen</span>:

<span class="hljs-title class_">Bestelldatum</span>: <span class="hljs-number">2004</span>-<span class="hljs-number">10</span>-<span class="hljs-number">20</span>
<span class="hljs-title class_">Bezahit</span>: <span class="hljs-title class_">Ja</span>
<span class="hljs-title class_">Expressversand</span>: <span class="hljs-title class_">Nein</span>
<span class="hljs-title class_">Rechnungsnummer</span>: <span class="hljs-number">4652</span>

<span class="hljs-title class_">Rechnungs</span>übersicht

| <span class="hljs-title class_">Pos</span>. | <span class="hljs-title class_">Produkt</span> | <span class="hljs-title class_">Preis</span> &lt;br&gt; (<span class="hljs-title class_">Netto</span>) | <span class="hljs-title class_">Menge</span> | <span class="hljs-title class_">Steuersatz</span> | <span class="hljs-title class_">Summe</span> &lt;br&gt; <span class="hljs-title class_">Brutto</span> |
| :--: | :--: | :--: | :--: | :--: | :--: |
| <span class="hljs-number">1</span> | <span class="hljs-title class_">Grundig</span> <span class="hljs-variable constant_">CH</span> 7280w <span class="hljs-title class_">Multi</span>-<span class="hljs-title class_">Zerkleinerer</span> (<span class="hljs-title class_">Gourmet</span>, <span class="hljs-number">400</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">11</span> <span class="hljs-title class_">Glasbeh</span>älter), weiß | <span class="hljs-number">183.49</span> C | <span class="hljs-number">2</span> | $0 \%$ | <span class="hljs-number">366.98</span> C |
| <span class="hljs-number">2</span> | <span class="hljs-title class_">Planet</span> K | <span class="hljs-number">349.9</span> C | <span class="hljs-number">2</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">832.76</span> C |
| <span class="hljs-number">3</span> | <span class="hljs-title class_">The</span> <span class="hljs-title class_">Cabin</span> <span class="hljs-keyword">in</span> the <span class="hljs-title class_">Woods</span> (<span class="hljs-title class_">Blu</span>-ray) | <span class="hljs-number">159.1</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">340.47</span> C |
| <span class="hljs-number">4</span> | <span class="hljs-title class_">Schenkung</span> auf <span class="hljs-title class_">Italienisch</span> <span class="hljs-title class_">Taschenbuch</span> - <span class="hljs-number">30.</span> | <span class="hljs-number">274.33</span> C | <span class="hljs-number">4</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1305.81</span> C |
| <span class="hljs-number">5</span> | <span class="hljs-title class_">Xbox</span> <span class="hljs-number">360</span> - <span class="hljs-title class_">Razer</span> 0N2A <span class="hljs-title class_">Controller</span> <span class="hljs-title class_">Tournament</span> <span class="hljs-title class_">Edition</span> | <span class="hljs-number">227.6</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">487.06</span> C |
| <span class="hljs-number">6</span> | <span class="hljs-title class_">Philips</span> <span class="hljs-variable constant_">LED</span>-<span class="hljs-title class_">Lampe</span> ersetzt 25Watt <span class="hljs-variable constant_">E27</span> <span class="hljs-number">2700</span> <span class="hljs-title class_">Kelvin</span> - warm-weiß, <span class="hljs-number">2.7</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">250</span> <span class="hljs-title class_">Lumen</span> <span class="hljs-title class_">IEnergieklasse</span> A++I | <span class="hljs-number">347.57</span> C | <span class="hljs-number">3</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1115.7</span> C |
| <span class="hljs-number">7</span> | <span class="hljs-title class_">Spannende</span> <span class="hljs-title class_">Abenteuer</span> <span class="hljs-title class_">Die</span> verschollene <span class="hljs-title class_">Grabkammer</span> | <span class="hljs-number">242.8</span> C | <span class="hljs-number">6</span> | $0 \%$ | <span class="hljs-number">1456.8</span> C |
| <span class="hljs-title class_">Zw</span>. summe |  | <span class="hljs-number">1784.79</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">7</span>\% |  | <span class="hljs-number">51.4</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">19</span>\% |  | <span class="hljs-number">118.6</span> C |  |  |  |
| <span class="hljs-title class_">Gesamtbetrag</span> C inkl. <span class="hljs-title class_">MwSt</span>. |  | <span class="hljs-number">1954.79</span> C |  |  |  |
<button class="copy-code-btn"></button></code></pre>
<h2 id="Real-World-Usage-A-Case-Study" class="common-anchor-header">الاستخدام في العالم الحقيقي: دراسة حالة<button data-href="#Real-World-Usage-A-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن رأينا أن Mistral OCR يمكن أن يعمل على مستندات مختلفة، يمكننا أن نتخيل كيف يمكن لشركة قانونية غارقة في ملفات القضايا والعقود الاستفادة من هذه الأداة. من خلال تطبيق نظام RAG مع Mistral OCR و Milvus، فإن ما كان يستغرق من قبل ساعات لا حصر لها من المساعدين القانونيين، مثل المسح الضوئي يدويًا بحثًا عن بنود معينة أو مقارنة القضايا السابقة، يتم الآن بواسطة الذكاء الاصطناعي في بضع دقائق فقط.</p>
<h3 id="Next-Steps" class="common-anchor-header">الخطوات التالية</h3><p>هل أنت مستعد لاستخراج كل المحتوى الخاص بك؟ توجّه إلى <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/integration/mistral_ocr_with_milvus.ipynb">دفتر الملاحظات على GitHub</a> للحصول على المثال الكامل، وانضم إلى <a href="http://zilliz.com/discord">Discord</a> للدردشة مع المجتمع، وابدأ في البناء اليوم! يمكنك أيضًا الاطلاع على <a href="https://docs.mistral.ai/capabilities/document/">وثائق Mistral</a> حول نموذج OCR الخاص بهم </p>
<p>قل وداعًا لفوضى التحليل، وأهلاً بالفهم الذكي والقابل للتطوير للمستندات.</p>
