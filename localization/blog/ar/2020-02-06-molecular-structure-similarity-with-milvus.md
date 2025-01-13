---
id: molecular-structure-similarity-with-milvus.md
title: مقدمة
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: كيفية إجراء تحليل تشابه التركيب الجزيئي في ميلفوس
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>تسريع اكتشاف العقاقير الجديدة</custom-h1><h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>يُعدّ اكتشاف الأدوية، باعتباره مصدر ابتكار الأدوية، جزءًا مهمًا من عملية البحث والتطوير في مجال الأدوية الجديدة. يتم تنفيذ اكتشاف الدواء عن طريق اختيار الهدف وتأكيده. عندما يتم اكتشاف شظايا أو مركبات رائدة، عادةً ما يتم البحث عن مركبات مماثلة في مكتبات المركبات الداخلية أو التجارية من أجل اكتشاف العلاقة بين التركيب والنشاط (SAR)، وتوافر المركبات، وبالتالي تقييم إمكانية تحسين المركبات الرائدة إلى مركبات مرشحة.</p>
<p>من أجل اكتشاف المركبات المتاحة في فضاء الأجزاء من مكتبات المركبات على نطاق المليار مركب، عادةً ما يتم استرجاع البصمة الكيميائية للبحث عن البنية الفرعية والبحث عن التشابه. ومع ذلك، فإن الحل التقليدي يستغرق وقتًا طويلاً وعرضة للأخطاء عندما يتعلق الأمر ببصمات كيميائية عالية الأبعاد بمليار من البصمات الكيميائية. كما قد تضيع بعض المركبات المحتملة في هذه العملية. تناقش هذه المقالة استخدام Milvus، وهو محرك بحث عن التشابه للمتجهات واسعة النطاق، مع RDKit لبناء نظام للبحث عن تشابه التركيب الكيميائي عالي الأداء.</p>
<p>بالمقارنة مع الطرق التقليدية، يتمتع ميلفوس بسرعة بحث أسرع وتغطية أوسع. من خلال معالجة البصمات الكيميائية، يمكن ل Milvus إجراء بحث عن البنية الفرعية والبحث عن التشابه والبحث الدقيق في مكتبات البنى الكيميائية من أجل اكتشاف الأدوية التي يحتمل أن تكون متاحة.</p>
<h2 id="System-overview" class="common-anchor-header">نظرة عامة على النظام<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم النظام RDKit لتوليد البصمات الكيميائية، ويستخدم نظام Milvus لإجراء بحث عن تشابه البنية الكيميائية. راجع https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search لمعرفة المزيد عن النظام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-نظرة عامة على النظام. png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. توليد البصمات الكيميائية<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>تُستخدم البصمات الكيميائية عادةً للبحث عن البنية الفرعية والبحث عن التشابه. تُظهر الصورة التالية قائمة متسلسلة ممثلة بأرقام بت. يمثل كل رقم عنصر أو زوج ذرة أو مجموعة وظيفية. التركيب الكيميائي هو <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2- تحديد أنماط-أنماط-الجزيئات.png</span> </span></p>
<p>يُمكننا استخدام RDKit لتوليد بصمات مورغان، الذي يُحدّد نصف قطر من ذرة معينة ويحسب عدد البنى الكيميائية ضمن نطاق نصف القطر لتوليد بصمة كيميائية. حدد قيمًا مختلفة لنصف القطر والبتات للحصول على البصمات الكيميائية للهياكل الكيميائية المختلفة. يتم تمثيل البنى الكيميائية بصيغة SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. البحث في البنى الكيميائية<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكننا بعد ذلك استيراد بصمات مورغان إلى ميلفوس لبناء قاعدة بيانات البنى الكيميائية. باستخدام بصمات الأصابع الكيميائية المختلفة، يمكن لميلفوس إجراء بحث عن البنى الفرعية والبحث عن التشابه والبحث الدقيق.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">بحث البنية الفرعية</h3><p>يتحقق مما إذا كانت البنية الكيميائية تحتوي على بنية كيميائية أخرى.</p>
<h3 id="Similarity-search" class="common-anchor-header">بحث التشابه</h3><p>يبحث في البنى الكيميائية المتشابهة. تُستخدم مسافة تانيموتو كمقياس افتراضي.</p>
<h3 id="Exact-search" class="common-anchor-header">بحث دقيق</h3><p>التحقق من وجود بنية كيميائية محددة من عدمه. يتطلب هذا النوع من البحث مطابقة تامة.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">حساب البصمات الكيميائية<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>غالبًا ما تُستخدم مسافة تانيموتو كمقياس للبصمات الكيميائية. في ميلفوس، تتوافق مسافة جاكارد مع مسافة تانيموتو.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-حساب البصمات الكيميائية-البصمات الكيميائية-جدول-1.png</span> </span></p>
<p>بناءً على المعلمات السابقة، يمكن وصف حساب البصمات الكيميائية على النحو التالي:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-حوسبة-حساب-الكيمياء-نشوء-نشوء-جدول-2.png</span> </span></p>
<p>يمكننا أن نرى أن <code translate="no">1- Jaccard = Tanimoto</code>. هنا نستخدم جاكارد في ميلفوس لحساب البصمة الكيميائية، وهو ما يتوافق في الواقع مع مسافة تانيموتو.</p>
<h2 id="System-demo" class="common-anchor-header">عرض توضيحي للنظام<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>لتوضيح كيفية عمل النظام بشكل أفضل، قمنا ببناء عرض توضيحي يستخدم Milvus للبحث في أكثر من 90 مليون بصمة كيميائية. البيانات المستخدمة تأتي من ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. تبدو الواجهة الأولية كما يلي:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-النظام التجريبي 5-system-demo-1.jpg</span> </span></p>
<p>يمكننا البحث عن تراكيب كيميائية محددة في النظام وإرجاع تراكيب كيميائية مماثلة:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-النظام-العرض التجريبي-2.gif</span> </span></p>
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
    </button></h2><p>لا غنى عن البحث عن التشابه في عدد من المجالات، مثل الصور ومقاطع الفيديو. بالنسبة لاكتشاف الأدوية، يمكن تطبيق البحث عن التشابه على قواعد بيانات الهياكل الكيميائية لاكتشاف المركبات التي يحتمل أن تكون متاحة، والتي يتم تحويلها بعد ذلك إلى بذور للتركيب العملي واختبارها في نقاط الرعاية. تم تصميم Milvus، باعتباره محرك بحث تشابه مفتوح المصدر لنواقل الميزات واسعة النطاق، باستخدام بنية حوسبة غير متجانسة لتحقيق أفضل كفاءة من حيث التكلفة. لا تستغرق عمليات البحث على متجهات بمليار ناقل سوى أجزاء من الثانية مع الحد الأدنى من موارد الحوسبة. وبالتالي، يمكن لـ Milvus المساعدة في تنفيذ بحث دقيق وسريع عن التركيب الكيميائي في مجالات مثل علم الأحياء والكيمياء.</p>
<p>يمكنك الوصول إلى العرض التوضيحي من خلال زيارة http://40.117.75.127:8002/، ولا تنسَ أيضًا زيارة موقعنا GitHub https://github.com/milvus-io/milvus لمعرفة المزيد!</p>
