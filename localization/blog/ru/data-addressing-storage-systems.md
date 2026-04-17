---
id: data-addressing-storage-systems.md
title: >-
  Глубокое погружение в адресацию данных в системах хранения: От HashMap до
  HDFS, Kafka, Milvus и Iceberg
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
  Проследите, как работает адресация данных: от HashMap до HDFS, Kafka, Milvus и
  Iceberg - и почему вычисление местоположения побеждает поиск в любом масштабе.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Если вы работаете с внутренними системами или распределенными хранилищами, то наверняка видели такое: сеть не перегружена, машины не перегружены, но простой поиск вызывает тысячи дисковых операций ввода-вывода или вызовов API объектного хранилища - и все равно запрос занимает секунды.</p>
<p>Узким местом редко бывает пропускная способность или вычисления. Это <em>адресация</em> - работа, которую выполняет система, чтобы выяснить, где находятся данные, прежде чем прочитать их. <strong>Адресация данных</strong> - это процесс преобразования логического идентификатора (ключа, пути к файлу, смещения, предиката запроса) в физическое местоположение данных в хранилище. При масштабировании этот процесс, а не фактическая передача данных, доминирует над задержкой.</p>
<p>Производительность хранилища можно свести к простой модели:</p>
<blockquote>
<p><strong>Общая стоимость адресации = обращения к метаданным + обращения к данным.</strong></p>
</blockquote>
<p>Почти каждая оптимизация системы хранения - от хэш-таблиц до слоев метаданных Lakehouse - направлена на это уравнение. Методы могут быть разными, но цель всегда одна: найти данные с минимальным количеством операций с высокой задержкой.</p>
<p>В этой статье мы проследим эту идею в системах все большего масштаба - от структур данных in-memory, таких как HashMap, до распределенных систем, таких как HDFS и Apache Kafka, и, наконец, до современных движков, таких как <a href="https://milvus.io/">Milvus</a> ( <a href="https://zilliz.com/learn/what-is-a-vector-database">векторная база данных</a>) и Apache Iceberg, которые работают с объектным хранением. Несмотря на различия, все они оптимизируют одно и то же уравнение.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Три основных метода адресации<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>В системах хранения данных и распределенных движках большинство оптимизаций адресации сводится к трем техникам:</p>
<ul>
<li><strong>Вычисление</strong> - определение местоположения данных непосредственно из формулы, вместо сканирования или обхода структур для их поиска.</li>
<li><strong>Кэширование</strong> - хранение часто используемых метаданных или индексов в памяти, чтобы избежать повторных чтений с высокой задержкой с диска или удаленного хранилища.</li>
<li><strong>Обрезка</strong> - используйте информацию о диапазоне или границах разделов, чтобы исключить файлы, осколки или узлы, которые не могут содержать результат.</li>
</ul>
<p>В этой статье под <em>доступом</em> понимается любая операция, имеющая реальные затраты на системном уровне: чтение с диска, сетевой вызов или запрос API к объектному хранилищу. Вычисления процессора на наносекундном уровне не считаются. Важно сократить количество операций ввода-вывода - или превратить дорогой случайный ввод-вывод в более дешевое последовательное чтение.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Как работает адресация: Проблема двух сумм<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы конкретизировать процесс адресации, рассмотрим классическую задачу алгоритма. Учитывая массив целых чисел <code translate="no">nums</code> и целевое значение <code translate="no">target</code>, верните индексы двух чисел, сумма которых равна <code translate="no">target</code>.</p>
<p>Например: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → результат <code translate="no">[0, 1]</code>.</p>
<p>Эта задача наглядно иллюстрирует разницу между поиском данных и вычислением их местонахождения.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Решение 1: Поиск методом грубой силы</h3><p>При использовании метода грубой силы проверяется каждая пара. Для каждого элемента он сканирует остальную часть массива в поисках совпадения. Просто, но O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Нет никакого представления о том, где может находиться ответ. Каждый поиск начинается с нуля и обходит массив вслепую. Узким местом является не арифметика, а повторное сканирование.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Решение 2: Прямая адресация с помощью вычислений</h3><p>Оптимизированное решение заменяет сканирование на HashMap. Вместо того чтобы искать подходящее значение, он вычисляет нужное значение и ищет его напрямую. Временная сложность снижается до O(n).</p>
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
<p>Сдвиг: вместо того чтобы сканировать массив в поисках совпадения, вы вычисляете нужное значение и обращаетесь непосредственно к его местоположению. Как только местоположение может быть получено, обход исчезает.</p>
<p>Эта идея лежит в основе всех высокопроизводительных систем хранения, которые мы рассмотрим: замените сканирование вычислениями, а косвенные пути поиска - прямой адресацией.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Как вычисленные адреса заменяют сканирование<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap хранит пары ключ-значение и определяет местоположение значений путем вычисления адреса по ключу, а не путем поиска по записям. К ключу применяется хэш-функция, вычисляется индекс массива и выполняется переход непосредственно к этому месту. Сканирование не требуется.</p>
<p>Это простейшая форма принципа, который лежит в основе всех систем, описанных в этой статье: избегайте сканирования, получая местоположение путем вычислений. Эта же идея, лежащая в основе всего - от распределенного поиска метаданных до <a href="https://zilliz.com/learn/vector-index">векторных индексов</a>, - проявляется в любом масштабе.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">Основная структура данных</h3><p>В основе HashMap лежит одна структура - массив. Хэш-функция сопоставляет ключи с индексами массива. Поскольку пространство ключей намного больше массива, неизбежны коллизии - разные ключи могут хэшироваться на один и тот же индекс. Эти проблемы решаются локально в каждом слоте с помощью связного списка или красно-черного дерева.</p>
<p>Массивы обеспечивают постоянный доступ по индексу. Это свойство - прямая, предсказуемая адресация - является основой производительности HashMap и тем же принципом, который лежит в основе эффективного доступа к данным в крупномасштабных системах хранения.</p>
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
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Как HashMap находит данные?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Пошаговая адресация HashMap: хэширование ключа, вычисление индекса массива, переход непосредственно к ведру и локальное разрешение - достижение O(1) поиска без обхода</span> </span>.</p>
<p>Возьмем для примера <code translate="no">put(&quot;apple&quot;, 100)</code>. Весь поиск занимает четыре шага - без полного сканирования таблицы:</p>
<ol>
<li><strong>Хеширование ключа:</strong> Пропустить ключ через хэш-функцию → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Сопоставление с индексом массива:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → например, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Переход к ведру:</strong> Прямой доступ к <code translate="no">table[10]</code> - однократный доступ к памяти, а не обход.</li>
<li><strong>Разрешить локально:</strong> Если коллизий нет, читайте или записывайте немедленно. Если коллизия есть, проверьте небольшой связанный список или красно-черное дерево внутри этого ведра.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Почему поиск в хэш-местах является O(1)?</h3><p>Доступ к массиву является O(1) из-за простой формулы адресации:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Учитывая индекс, адрес памяти вычисляется с помощью одного умножения и одного сложения. Стоимость фиксирована независимо от размера массива - одно вычисление, одно чтение памяти. Связный список, напротив, необходимо обходить узел за узлом, следуя за указателями через отдельные ячейки памяти: O(n) в худшем случае.</p>
<p>HashMap хэширует ключ в индекс массива, превращая то, что было бы обходом, в вычисление адреса. Вместо того чтобы искать данные, он вычисляет, где именно они находятся, и переходит туда.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Как меняется адресация в распределенных системах?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap решает проблему адресации в пределах одной машины, где данные находятся в памяти и стоимость доступа к ним тривиальна. При больших масштабах ограничения резко меняются:</p>
<table>
<thead>
<tr><th>Масштабный фактор</th><th>Влияние</th></tr>
</thead>
<tbody>
<tr><td>Размер данных</td><td>Мегабайты → терабайты или петабайты в кластерах</td></tr>
<tr><td>Носитель информации</td><td>Память → диск → сеть → объектное хранилище</td></tr>
<tr><td>Задержка доступа</td><td>Память: ~100 нс / Диск: 10-20 мс / Однорегиональная сеть: ~0,5 мс / Межрегиональная: ~150 мс</td></tr>
</tbody>
</table>
<p>Проблема адресации не меняется - она просто становится дороже. Каждый поиск может включать в себя сетевые переходы и дисковые операции ввода-вывода, поэтому сокращение числа обращений имеет гораздо большее значение, чем в памяти.</p>
<p>Чтобы увидеть, как с этим справляются реальные системы, мы рассмотрим два классических примера. HDFS применяет адресацию, основанную на вычислениях, к большим файлам, основанным на блоках. Kafka применяет ее для потоков сообщений, основанных только на приложениях. В обоих случаях используется один и тот же принцип: вычислять, где находятся данные, вместо того чтобы искать их.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: адресация больших файлов с помощью метаданных в памяти<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS - это <a href="https://milvus.io/docs/architecture_overview.md">распределенная</a> система <a href="https://milvus.io/docs/architecture_overview.md">хранения</a>, предназначенная для работы с очень большими файлами на кластерах машин. Учитывая путь к файлу и смещение байта, необходимо найти нужный блок данных и узел DataNode, который его хранит.</p>
<p>HDFS решает эту задачу с помощью сознательного выбора дизайна: хранить все метаданные файловой системы в памяти.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Организация данных в HDFS, показывающая логическое представление файла размером 300 МБ, отображенного на физическое хранилище в виде трех блоков, распределенных по DataNode с репликацией</span> </span></p>
<p>В центре находится узел NameNode. Он загружает в память все дерево файловой системы - структуру каталогов, сопоставления файлов с блоками и блоков с узлами данных. Поскольку метаданные никогда не касаются диска во время чтения, HDFS решает все вопросы адресации только через поиск в памяти.</p>
<p>Концептуально это HashMap в масштабе кластера: используйте структуры данных в памяти, чтобы превратить медленный поиск в быстрый, вычисляемый поиск. Разница в том, что HDFS применяет тот же принцип к наборам данных, распределенным по тысячам машин.</p>
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
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Как HDFS определяет местоположение данных?</h3><p>Рассмотрим чтение данных со смещением 200 МБ по адресу <code translate="no">/user/data/bigfile.txt</code>, размер блока по умолчанию составляет 128 МБ:</p>
<ol>
<li>Клиент отправляет один RPC на узел NameNode.</li>
<li>Узел NameNode разрешает путь к файлу и вычисляет, что смещение 200 МБ попадает во второй блок (диапазон 128-256 МБ) - полностью в памяти</li>
<li>NameNode возвращает DataNodes, хранящие этот блок (например, DN2 и DN3).</li>
<li>Клиент считывает данные непосредственно с ближайшего DataNode (DN2).</li>
</ol>
<p>Общая стоимость: один RPC, несколько обращений к памяти, одно чтение данных. Метаданные никогда не попадают на диск во время этого процесса, и каждый поиск выполняется в постоянном времени. HDFS позволяет избежать дорогостоящего сканирования метаданных даже при масштабировании данных в больших кластерах.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Как разреженное индексирование позволяет избежать случайных операций ввода-вывода<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka предназначен для работы с высокопроизводительными потоками сообщений. Учитывая смещение сообщения, ему необходимо найти точную позицию байта на диске, не превращая чтение в случайный ввод-вывод.</p>
<p>Kafka сочетает последовательное хранение с разреженным индексом в памяти. Вместо поиска по данным он вычисляет приблизительное местоположение и выполняет небольшое, ограниченное сканирование.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>Организация данных Kafka показывает логическое представление с темами и разделами, отображенными на физическое хранилище в виде каталогов разделов, содержащих файлы сегментов .log, .index и .timeindex.</span> </span></p>
<p>Сообщения организованы по принципу Тема → Раздел → Сегмент. Каждый раздел представляет собой журнал, разбитый только на сегменты, каждый из которых состоит из:</p>
<ul>
<li>файла <code translate="no">.log</code>, хранящего сообщения последовательно на диске</li>
<li>Файл <code translate="no">.index</code>, выполняющий роль разреженного индекса в журнале.</li>
</ul>
<p>Файл <code translate="no">.index</code> отображается на память (mmap), поэтому поиск индекса осуществляется непосредственно из памяти без дискового ввода-вывода.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Дизайн разреженного индекса Kafka, показывающий одну запись индекса на 4 КБ данных, и сравнение памяти: плотный индекс на 800 МБ против разреженного индекса всего на 2 МБ в памяти</span> </span></p>
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
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Как Kafka определяет местоположение данных?</h3><p>Предположим, потребитель читает сообщение по смещению 500 000. Кафка решает эту проблему в три этапа:</p>
<p><strong>1. Найти сегмент</strong> (поиск по TreeMap).</p>
<ul>
<li>Базовые смещения сегмента: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Целевой файл: <code translate="no">00000000000000367834.log</code></li>
<li>Временная сложность: O(log S), где S - количество сегментов (обычно &lt; 100).</li>
</ul>
<p><strong>2. Поиск позиции в разреженном индексе</strong> (.index)</p>
<ul>
<li>Относительное смещение: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Двоичный поиск в <code translate="no">.index</code>: найти наибольшую запись ≤ 132166 →. <code translate="no">[132100 → position 20500000]</code></li>
<li>Временная сложность: O(log N), где N - количество записей в индексе.</li>
</ul>
<p><strong>3. Последовательное чтение из журнала</strong> (.log)</p>
<ul>
<li>Начните чтение с позиции 20 500 000</li>
<li>Продолжать до тех пор, пока не будет достигнуто смещение 500 000</li>
<li>Сканируется не более одного индексного интервала (~4 КБ)</li>
</ul>
<p>Итого: один поиск сегмента в памяти, один поиск индекса, одно короткое последовательное чтение. Никакого случайного обращения к диску.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS против Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
<tr><th>Размерность</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Цель разработки</td><td>Эффективное хранение и чтение массивных файлов</td><td>Высокопроизводительное последовательное чтение/запись потоков сообщений</td></tr>
<tr><td>Модель адресации</td><td>Путь → блок → DataNode через HashMaps в памяти</td><td>Смещение → сегмент → позиция через разреженный индекс + последовательное сканирование</td></tr>
<tr><td>Хранение метаданных</td><td>Централизованное в памяти NameNode</td><td>Локальные файлы, отображаемые на память через mmap</td></tr>
<tr><td>Стоимость доступа для одного поиска</td><td>1 RPC + N чтений блоков</td><td>1 поиск индекса + 1 чтение данных</td></tr>
<tr><td>Ключевая оптимизация</td><td>Все метаданные в памяти - никакого диска на пути поиска</td><td>Разреженная индексация + последовательная компоновка позволяет избежать случайных операций ввода-вывода</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Почему объектное хранилище меняет проблему адресации<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>От HashMap до HDFS и Kafka мы видели адресацию в памяти и в классических распределенных хранилищах. По мере развития рабочих нагрузок требования к ним растут:</p>
<ul>
<li><strong>Более сложные запросы.</strong> Современные системы обрабатывают многополевые фильтры, <a href="https://zilliz.com/glossary/similarity-search">поиск по сходству</a> и сложные предикаты, а не только простые ключи и смещения.</li>
<li><strong>Объектное хранение по умолчанию.</strong> Данные все чаще хранятся в S3-совместимых хранилищах. Файлы распределены по ведрам, и каждый доступ к ним представляет собой вызов API с фиксированной задержкой порядка десятков миллисекунд - даже для нескольких килобайт.</li>
</ul>
<p>На данном этапе узким местом является не пропускная способность, а задержка. Один запрос S3 GET стоит ~50 мс, независимо от того, сколько данных он возвращает. Если запрос вызывает тысячи таких запросов, общая задержка возрастает. Минимизация "раздувания" API становится главным ограничением при проектировании.</p>
<p>Мы рассмотрим две современные системы - <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/learn/what-is-a-vector-database">векторную базу данных</a>, и Apache Iceberg, формат таблиц Lakehouse, - чтобы увидеть, как они решают эти проблемы. Несмотря на различия, в обеих системах применяются одни и те же основные идеи: минимизация доступа с высокой задержкой, раннее уменьшение веерного выхода и предпочтение вычислений обходным путям.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Когда хранилище полевого уровня создает слишком много файлов<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus - это широко используемая векторная база данных, предназначенная для <a href="https://zilliz.com/glossary/similarity-search">поиска сходства</a> по <a href="https://zilliz.com/glossary/vector-embeddings">векторным вкраплениям</a>. Ее ранний дизайн хранения отражает общий первый подход к созданию объектных хранилищ: хранить каждое поле отдельно.</p>
<p>В V1 каждое поле <a href="https://milvus.io/docs/manage-collections.md">коллекции</a> хранится в отдельных файлах binlog по <a href="https://milvus.io/docs/glossary.md">сегментам</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Схема хранения Milvus V1, показывающая коллекцию, разбитую на сегменты, где каждый сегмент хранит такие поля, как id, вектор и скалярные данные в отдельных файлах binlog, а также отдельные файлы stats_log для статистики файлов</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Как Milvus V1 находит данные?</h3><p>Рассмотрим простой запрос: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Поиск метаданных</strong> - Запрос к etcd/MySQL для получения списка сегментов → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Считать поле id для всех сегментов</strong> - Для каждого сегмента считать id binlog-файлов</li>
<li><strong>Найдите целевую строку</strong> - Просканируйте загруженные данные id, чтобы найти <code translate="no">id = 123</code></li>
<li><strong>Чтение векторного поля</strong> - Чтение соответствующих векторных binlog-файлов для совпадающего сегмента</li>
</ol>
<p>Всего обращений к файлам: <strong>N × (F₁ + F₂ + ...)</strong>, где N = количество сегментов, F = файлы binlog на поле.</p>
<p>Математика быстро становится уродливой. Для коллекции со 100 полями, 1 000 сегментами и 5 файлами бинлога на поле:</p>
<blockquote>
<p><strong>1 000 × 100 × 5 = 500 000 файлов.</strong></p>
</blockquote>
<p>Даже если запрос затрагивает только три поля, это 15 000 обращений к API объектного хранилища. При 50 мс на запрос S3 сериализованная задержка достигает <strong>750 секунд</strong> - более 12 минут для одного запроса.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Как сегментно-уровневый паркет сокращает количество вызовов API в 10 раз<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы устранить ограничения масштабируемости в V1, Milvus V2 вносит фундаментальные изменения: организует данные по <a href="https://milvus.io/docs/glossary.md">сегментам</a>, а не по полям. Вместо множества небольших файлов binlog в V2 данные консолидируются в файлы Parquet на основе сегментов.</p>
<p>Количество файлов сокращается с <code translate="no">N × fields × binlogs</code> до примерно <code translate="no">N</code> (одна файловая группа на сегмент).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Схема хранения Milvus V2, показывающая сегмент, хранящийся в виде файлов Parquet с группами строк, содержащими куски столбцов для id, vector и timestamp, плюс нижний колонтитул со схемой и статистикой столбцов.</span> </span></p>
<p>Но V2 не хранит все поля в одном файле. Он группирует поля по размеру:</p>
<ul>
<li><strong>Небольшие <a href="https://milvus.io/docs/scalar_index.md">скалярные поля</a></strong> (например, id, timestamp) хранятся вместе.</li>
<li><strong>Большие поля</strong> (например, <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">плотные векторы</a>) разделяются на отдельные файлы.</li>
</ul>
<p>Все файлы принадлежат одному сегменту, и строки выравниваются по индексу между файлами.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Структура файла Parquet, показывающая группы строк с кусками столбцов и сжатыми страницами данных, а также нижний колонтитул, содержащий метаданные файла, метаданные группы строк и статистику столбцов, такую как минимальные/максимальные значения</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Как Milvus V2 находит данные?</h3><p>Для одного и того же запроса - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Поиск метаданных</strong> - Получение списка сегментов → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Чтение колонтитулов Parquet</strong> - Извлечение статистики группы строк. Проверьте минимальное/максимальное значение столбца id для группы строк. <code translate="no">id = 123</code> попадает в группу строк 0 (min=1, max=1000).</li>
<li><strong>Считывайте только то, что нужно</strong> - обрезка столбцов Parquet считывает только столбец id из файла с малым полем и только столбец <a href="https://milvus.io/docs/index-vector-fields.md">vector</a> из файла с большим полем. Доступ осуществляется только к совпадающим группам строк.</li>
</ol>
<p>Разделение больших полей дает два ключевых преимущества:</p>
<ul>
<li><strong>Более эффективное чтение.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Векторные вложения</a> доминируют в объеме хранилища. Смешанные с малыми полями, они ограничивают количество строк, помещающихся в группу строк, увеличивая количество обращений к файлу. Если их изолировать, то группы строк с малыми полями будут вмещать гораздо больше строк, а большие поля будут использовать макеты, оптимизированные под их размер.</li>
<li><strong>Гибкая эволюция <a href="https://milvus.io/docs/schema.md">схемы</a>.</strong> Добавление столбца означает создание нового файла. Удаление столбца означает его пропуск во время чтения. Переписывать исторические данные не нужно.</li>
</ul>
<p>Результат: количество файлов уменьшается более чем в 10 раз, количество вызовов API - более чем в 10 раз, а время ожидания запросов сокращается с минут до секунд.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 против V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
<tr><th>Aspect</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Организация файлов</td><td>Разделение по полям</td><td>Интеграция по сегментам</td></tr>
<tr><td>Файлы на коллекцию</td><td>N × поля × бинлоги</td><td>~N × группы столбцов</td></tr>
<tr><td>Формат хранения</td><td>Пользовательский бинлог</td><td>Parquet (также поддерживает Lance и Vortex)</td></tr>
<tr><td>Обрезка столбцов</td><td>Естественная (файлы на уровне полей)</td><td>Обрезка столбцов Parquet</td></tr>
<tr><td>Статистика</td><td>Отдельные файлы stats_log</td><td>Встраивается в нижний колонтитул Parquet</td></tr>
<tr><td>Вызовы S3 API на один запрос</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Задержка запроса</td><td>Минуты</td><td>Секунды</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Обрезка файлов на основе метаданных<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg управляет аналитическими таблицами над огромными наборами данных в системах Lakehouse. Когда таблица охватывает тысячи файлов данных, возникает проблема сужения запроса только до релевантных файлов - без сканирования всех.</p>
<p>Решение Iceberg: решить, какие файлы читать <em>, до того, как</em> произойдет ввод-вывод данных, используя многоуровневые метаданные. Тот же принцип лежит в основе <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">фильтрации метаданных</a> в векторных базах данных - используйте предварительно вычисленную статистику, чтобы пропустить нерелевантные данные.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Организация данных в Iceberg: каталог метаданных с файлами metadata.json, списками манифестов и файлами манифестов, а также каталог данных с файлами Parquet, разделенными по датам.</span> </span></p>
<p>Iceberg использует многоуровневую структуру метаданных. Каждый слой отфильтровывает нерелевантные данные, прежде чем обратиться к следующему - по духу это похоже на то, как <a href="https://milvus.io/docs/architecture_overview.md">распределенные базы данных</a> отделяют метаданные от данных для эффективного доступа.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Четырехслойная архитектура Iceberg: metadata.json указывает на списки манифестов, которые ссылаются на файлы манифестов, содержащие статистику на уровне файлов, которые указывают на фактические файлы данных Parquet</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Как Iceberg определяет местоположение данных?</h3><p>Рассмотрим: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Прочитать metadata.json</strong> (1 ввод-вывод) - Загрузить текущий снимок и его списки манифестов</li>
<li><strong>Чтение списка манифестов</strong> (1 ввод-вывод) - Применение фильтров <a href="https://milvus.io/docs/use-partition-key.md">на уровне разделов</a> для пропуска целых разделов (например, все данные 2023 исключаются)</li>
<li><strong>Чтение файлов манифеста</strong> (2 ввода/вывода) - Используйте статистику на уровне файлов (мин/макс дата, мин/макс количество), чтобы исключить файлы, которые не соответствуют запросу.</li>
<li><strong>Чтение файлов данных</strong> (3 ввода/вывода) - Остаются только три файла, которые действительно будут прочитаны.</li>
</ol>
<p>Вместо того чтобы сканировать все 1000 файлов данных, Iceberg завершает поиск за <strong>7 операций ввода-вывода</strong>, избегая более 94 % ненужных чтений.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Как различные системы обращаются к данным<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
<tr><th>Система</th><th>Организация данных</th><th>Основной механизм адресации</th><th>Стоимость доступа</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Ключ → слот массива</td><td>Хэш-функция → прямой индекс</td><td>Доступ к памяти O(1)</td></tr>
<tr><td>HDFS</td><td>Путь → блок → узел данных</td><td>Хэш-карты в памяти + вычисление блока</td><td>1 RPC + N чтений блоков</td></tr>
<tr><td>Kafka</td><td>Тема → раздел → сегмент</td><td>TreeMap + разреженный индекс + последовательное сканирование</td><td>1 просмотр индекса + 1 чтение данных</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Коллекция</a> → Сегмент → Паркетные колонки</td><td>Поиск метаданных + обрезка столбцов</td><td>N чтений (N = сегменты)</td></tr>
<tr><td>Iceberg</td><td>Таблица → Снимок → Манифест → Файлы данных</td><td>Многослойные метаданные + обрезка статистики</td><td>3 чтения метаданных + M чтений данных</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Три принципа эффективной адресации данных<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Вычисления всегда побеждают поиск</h3><p>В каждой системе, которую мы рассмотрели, наиболее эффективная оптимизация следует одному и тому же правилу: вычислять, где находятся данные, вместо того чтобы искать их.</p>
<ul>
<li>HashMap вычисляет индекс массива из <code translate="no">hash(key)</code> вместо сканирования.</li>
<li>HDFS вычисляет целевой блок по смещению файла, а не по метаданным файловой системы.</li>
<li>Kafka вычисляет соответствующий сегмент и позицию индекса вместо сканирования журнала</li>
<li>Iceberg использует предикаты и статистику на уровне файлов, чтобы вычислить, какие файлы стоит читать</li>
</ul>
<p>Вычисления - это арифметика с фиксированной стоимостью. Поиск - это обход - сравнение, перебор указателей или ввод-вывод, - и его стоимость растет с увеличением размера данных. Когда система может определить местоположение напрямую, сканирование становится ненужным.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Минимизация доступа с высокой задержкой</h3><p>Это возвращает нас к основной формуле: <strong>Общая стоимость адресации = обращения к метаданным + обращения к данным.</strong> Любая оптимизация в конечном итоге направлена на сокращение этих высокозамедленных операций.</p>
<table>
<thead>
<tr><th>Шаблон</th><th>Пример</th></tr>
</thead>
<tbody>
<tr><td>Сокращение количества файлов для ограничения раздувания API</td><td>Консолидация сегментов Milvus V2</td></tr>
<tr><td>Использование статистики для раннего исключения данных</td><td>Обрезка манифеста айсберга</td></tr>
<tr><td>Кэширование метаданных в памяти</td><td>HDFS NameNode, Kafka mmap индексы</td></tr>
<tr><td>Обмен небольших последовательных сканирований на меньшее количество случайных чтений</td><td>Разреженный индекс Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Статистика позволяет принимать ранние решения</h3><p>Запись простой информации во время записи - минимальные/максимальные значения, границы разделов, количество строк - позволяет системам во время чтения решить, какие файлы стоит читать, а какие можно пропустить.</p>
<p>Это небольшая инвестиция с большой отдачей. Статистика превращает доступ к файлам из слепого чтения в осознанный выбор. Будь то обрезка на уровне манифеста Iceberg или статистика нижнего колонтитула Parquet от Milvus V2, принцип один и тот же: несколько байт метаданных во время записи могут устранить тысячи операций ввода-вывода во время чтения.</p>
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
    </button></h2><p>От Two Sum до HashMap, от HDFS и Kafka до Milvus и Apache Iceberg повторяется одна закономерность: производительность зависит от того, насколько эффективно система размещает данные.</p>
<p>По мере роста данных и перехода от памяти к диску и объектному хранилищу механика меняется, но основные идеи - нет. Лучшие системы вычисляют местоположение вместо поиска, хранят метаданные близко и используют статистику, чтобы не трогать данные, которые не имеют значения. Каждый выигрыш в производительности, который мы рассмотрели, достигается за счет уменьшения количества обращений с высокой задержкой и сужения пространства поиска как можно раньше.</p>
<p>Независимо от того, проектируете ли вы конвейер <a href="https://zilliz.com/learn/what-is-vector-search">векторного поиска</a>, создаете системы для работы с <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированными данными</a> или оптимизируете механизм запросов Lakehouse, здесь применимо одно и то же уравнение. Понимание того, как ваша система работает с данными, - первый шаг к тому, чтобы сделать ее быстрее.</p>
<hr>
<p>Если вы работаете с Milvus и хотите оптимизировать производительность хранилища или запросов, мы будем рады помочь:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">сообществу Milvus Slack</a>, чтобы задавать вопросы, делиться своей архитектурой и учиться у других инженеров, работающих над аналогичными проблемами.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы обсудить ваш случай использования - будь то расположение хранилища, настройка запросов или масштабирование на производство.</li>
<li>Если вы не хотите заниматься настройкой инфраструктуры, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемая Milvus) предлагает бесплатный уровень для начала работы.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают, когда инженеры начинают думать об адресации данных и проектировании хранилищ:</p>
<p><strong>Вопрос: Почему Milvus перешла от хранения на уровне полей к хранению на уровне сегментов?</strong></p>
<p>В Milvus V1 каждое поле хранилось в отдельных файлах binlog в разных сегментах. Для коллекции со 100 полями и 1 000 сегментами это создавало сотни тысяч небольших файлов, каждый из которых требовал отдельного вызова API S3. V2 консолидирует данные в сегментные файлы Parquet, сокращая количество файлов более чем в 10 раз и уменьшая задержку запросов с минут до секунд. Основной вывод: в объектном хранилище количество вызовов API имеет большее значение, чем общий объем данных.</p>
<p><strong>В: Как Milvus эффективно справляется с векторным поиском и скалярной фильтрацией?</strong></p>
<p>В Milvus V2 <a href="https://milvus.io/docs/scalar_index.md">скалярные</a> и <a href="https://milvus.io/docs/index-vector-fields.md">векторные</a> <a href="https://milvus.io/docs/scalar_index.md">поля</a> хранятся в отдельных файловых группах в одном сегменте. Скалярные запросы используют обрезку столбцов Parquet и статистику групп строк, чтобы пропустить нерелевантные данные. <a href="https://zilliz.com/learn/what-is-vector-search">Векторный поиск</a> использует специальные <a href="https://zilliz.com/learn/vector-index">векторные индексы</a>. Оба варианта имеют одинаковую структуру сегмента, поэтому <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">гибридные запросы</a>, сочетающие скалярные фильтры и векторное сходство, могут работать с одними и теми же данными без дублирования.</p>
<p><strong>Вопрос: Применим ли принцип "вычисление над поиском" к векторным базам данных?</strong></p>
<p>Да. <a href="https://zilliz.com/learn/vector-index">Векторные индексы</a>, такие как HNSW и IVF, построены на той же идее. Вместо того чтобы сравнивать вектор запроса с каждым хранимым вектором (грубый поиск), они используют графовые структуры или центроиды кластеров для вычисления приблизительных окрестностей и перехода непосредственно к соответствующим областям векторного пространства. Компромисс - небольшая потеря точности при на порядки меньшем количестве вычислений расстояний - это та же самая схема "вычисления вместо поиска", которая применяется к высокоразмерным данным <a href="https://zilliz.com/glossary/vector-embeddings">для встраивания</a>.</p>
<p><strong>В: Какую самую большую ошибку в производительности допускают команды при работе с объектными хранилищами?</strong></p>
<p>Создание слишком большого количества маленьких файлов. Каждый запрос S3 GET имеет фиксированную задержку (~50 мс), независимо от того, сколько данных он возвращает. Система, которая читает 10 000 маленьких файлов, задерживается на 500 секунд - даже если общий объем данных невелик. Решение проблемы - консолидация: объединяйте маленькие файлы в большие, используйте колоночные форматы, такие как Parquet, для выборочного чтения и поддерживайте метаданные, позволяющие полностью пропускать файлы.</p>
