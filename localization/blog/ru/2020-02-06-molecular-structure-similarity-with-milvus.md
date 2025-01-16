---
id: molecular-structure-similarity-with-milvus.md
title: Введение
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Как провести анализ сходства молекулярных структур в Milvus
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Ускорение открытия новых лекарств</custom-h1><h2 id="Introduction" class="common-anchor-header">Введение<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Открытие лекарств, как источник инноваций в медицине, является важной частью исследований и разработки новых лекарств. Открытие лекарств осуществляется путем выбора и подтверждения цели. Когда обнаруживаются фрагменты или ведущие соединения, обычно проводится поиск аналогичных соединений в собственных или коммерческих библиотеках соединений с целью выявления взаимосвязи структура-активность (SAR), доступности соединений, что позволяет оценить потенциал ведущих соединений для оптимизации до соединений-кандидатов.</p>
<p>Чтобы обнаружить доступные соединения в пространстве фрагментов из миллиардных библиотек соединений, обычно извлекают химический отпечаток для поиска субструктур и сходства. Однако традиционное решение занимает много времени и чревато ошибками, когда речь идет о миллиардных высокоразмерных химических отпечатках. Кроме того, некоторые потенциальные соединения могут быть потеряны в процессе. В этой статье рассматривается использование Milvus, механизма поиска сходства для векторов огромного размера, с RDKit для создания системы высокопроизводительного поиска сходства химической структуры.</p>
<p>По сравнению с традиционными методами, Milvus обладает более высокой скоростью поиска и более широким охватом. Обрабатывая химические отпечатки, Milvus может выполнять поиск подструктур, поиск по сходству и точный поиск в библиотеках химических структур, чтобы обнаружить потенциально доступные лекарства.</p>
<h2 id="System-overview" class="common-anchor-header">Обзор системы<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Система использует RDKit для создания химических отпечатков, а Milvus - для поиска сходства химических структур. Более подробная информация о системе представлена на сайте https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Генерация химических отпечатков пальцев<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Химические отпечатки обычно используются для поиска подструктур и сходства. На следующем рисунке показан последовательный список, представленный битами. Каждая цифра представляет элемент, пару атомов или функциональные группы. Химическая структура - <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identifying-patterns-molecules.png</span> </span></p>
<p>Мы можем использовать RDKit для генерации отпечатков Morgan, который определяет радиус от конкретного атома и подсчитывает количество химических структур в пределах радиуса, чтобы сгенерировать химический отпечаток. Задайте разные значения радиуса и битов, чтобы получить химические отпечатки различных химических структур. Химические структуры представлены в формате SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Поиск химических структур<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Затем мы можем импортировать отпечатки Моргана в Milvus, чтобы создать базу данных химических структур. По различным химическим отпечаткам Milvus может выполнять поиск подструктур, поиск по сходству и точный поиск.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Поиск подструктур</h3><p>Проверяет, содержит ли химическая структура другую химическую структуру.</p>
<h3 id="Similarity-search" class="common-anchor-header">Поиск по сходству</h3><p>Поиск схожих химических структур. По умолчанию в качестве метрики используется расстояние Танимото.</p>
<h3 id="Exact-search" class="common-anchor-header">Точный поиск</h3><p>Проверяет, существует ли указанная химическая структура. Этот вид поиска требует точного совпадения.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Вычисление химических отпечатков пальцев<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Расстояние Танимото часто используется в качестве метрики для химических отпечатков пальцев. В Milvus расстояние Жаккарда соответствует расстоянию Танимото.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-computing-chem-fingerprings-table-1.png</span> </span></p>
<p>Основываясь на предыдущих параметрах, вычисление химических отпечатков пальцев можно описать следующим образом:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Мы видим, что <code translate="no">1- Jaccard = Tanimoto</code>. Здесь мы используем Жаккарда в Milvus для вычисления химического отпечатка, что фактически соответствует расстоянию Танимото.</p>
<h2 id="System-demo" class="common-anchor-header">Демонстрация системы<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы лучше продемонстрировать работу системы, мы создали демо-версию, которая использует Milvus для поиска более 90 миллионов химических отпечатков пальцев. Используемые данные взяты с сайта ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. Начальный интерфейс выглядит следующим образом:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>Мы можем искать заданные химические структуры в системе и возвращать похожие химические структуры:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Поиск по сходству незаменим во многих областях, например, в работе с изображениями и видео. Для поиска лекарств поиск по сходству может быть применен к базам данных химических структур для обнаружения потенциально доступных соединений, которые затем преобразуются в семена для практического синтеза и тестирования в точках оказания медицинской помощи. Milvus - поисковая система с открытым исходным кодом для поиска сходств в массивных векторах признаков - построена на основе гетерогенной вычислительной архитектуры для достижения максимальной экономической эффективности. Поиск по миллиардным векторам занимает всего миллисекунды при минимальных вычислительных ресурсах. Таким образом, Milvus может помочь реализовать точный и быстрый поиск химических структур в таких областях, как биология и химия.</p>
<p>Вы можете ознакомиться с демонстрацией по адресу http://40.117.75.127:8002/, а также посетить наш GitHub https://github.com/milvus-io/milvus, чтобы узнать больше!</p>
