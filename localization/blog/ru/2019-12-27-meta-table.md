---
id: 2019-12-27-meta-table.md
title: Управление метаданными Milvus (2) Поля в таблице метаданных
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Узнайте о деталях полей в таблицах метаданных в Milvus.
cover: null
tag: Engineering
---
<custom-h1>Управление метаданными Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Поля в таблице метаданных<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Автор: Yihua Mo</p>
<p>Дата: 2019-12-27</p>
</blockquote>
<p>В прошлом блоге мы рассказали о том, как просматривать метаданные с помощью MySQL или SQLite. В этой статье мы хотим подробно рассказать о полях в таблицах метаданных.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Поля в таблице &quot;<code translate="no">Tables</code>&quot;</h3><p>Возьмем для примера SQLite. Следующий результат получен в версии 0.5.0. В версии 0.6.0 добавлены некоторые поля, которые будут представлены позже. В <code translate="no">Tables</code> есть строка, определяющая 512-мерную векторную таблицу с именем <code translate="no">table_1</code>. Когда таблица создана, <code translate="no">index_file_size</code> - 1024 МБ, <code translate="no">engine_type</code> - 1 (FLAT), <code translate="no">nlist</code> - 16384, <code translate="no">metric_type</code> - 1 (евклидово расстояние L2). <code translate="no">id</code> - уникальный идентификатор таблицы. <code translate="no">state</code> - состояние таблицы, 0 означает нормальное состояние. <code translate="no">created_on</code> - время создания. <code translate="no">flag</code> - флаг, зарезервированный для внутреннего использования.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>таблицы</span> </span></p>
<p>В следующей таблице приведены типы полей и их описание в таблице <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Имя поля</th><th style="text-align:left">Тип данных</th><th style="text-align:left">Описание</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Уникальный идентификатор векторной таблицы. <code translate="no">id</code> автоматически увеличивается.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Имя векторной таблицы. <code translate="no">table_id</code> должно быть определено пользователем и соответствовать рекомендациям Linux по именам файлов.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Состояние векторной таблицы. 0 означает нормальное состояние, 1 - удалена (мягкое удаление).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Размерность вектора векторной таблицы. Должна быть определена пользователем.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Количество миллисекунд с 1 января 1970 года до момента создания таблицы.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Флаг для внутреннего использования, например, является ли идентификатор вектора определенным пользователем. По умолчанию 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Если размер файла данных достигает <code translate="no">index_file_size</code>, файл не объединяется и используется для построения индексов. По умолчанию - 1024 (МБ).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Тип индекса для построения векторной таблицы. По умолчанию 0, что означает недействительный индекс. 1 - FLAT. 2 - IVFLAT. 3 - IVFSQ8. 4 - NSG. 5 - IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Количество кластеров, на которые делятся векторы в каждом файле данных при построении индекса. По умолчанию - 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Метод вычисления расстояния между векторами. 1 задает евклидово расстояние (L1), а 2 - внутреннее произведение.</td></tr>
</tbody>
</table>
<p>В 0.6.0 включено разделение таблиц с несколькими новыми полями, включая <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> и <code translate="no">version</code>. Векторная таблица <code translate="no">table_1</code> имеет раздел <code translate="no">table_1_p1</code>, который также является векторной таблицей. <code translate="no">partition_name</code> соответствует <code translate="no">table_id</code>. Поля в таблице раздела наследуются от таблицы-владельца, при этом поле <code translate="no">owner table</code> указывает имя таблицы-владельца, а поле <code translate="no">partition_tag</code> - тег раздела.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>таблицы_новые</span> </span></p>
<p>В следующей таблице представлены новые поля в версии 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Имя поля</th><th style="text-align:left">Тип данных</th><th style="text-align:left">Описание</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string</td><td style="text-align:left">Родительская таблица раздела.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">string</td><td style="text-align:left">Метка раздела. Не должна быть пустой строкой.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Версия Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Поля в таблице "<code translate="no">TableFiles&quot;</code> </h3><p>Следующий пример содержит два файла, которые оба принадлежат векторной таблице <code translate="no">table_1</code>. Тип индекса (<code translate="no">engine_type</code>) первого файла - 1 (FLAT); статус файла (<code translate="no">file_type</code>) - 7 (резервная копия исходного файла); <code translate="no">file_size</code> - 411200113 байт; количество строк вектора - 200 000. Тип индекса второго файла - 2 (IVFLAT); статус файла - 3 (индексный файл). Второй файл на самом деле является индексом первого файла. Более подробную информацию мы представим в следующих статьях.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>tablefiles</span> </span></p>
<p>В следующей таблице приведены поля и описания <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Имя поля</th><th style="text-align:left">Тип данных</th><th style="text-align:left">Описание</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Уникальный идентификатор векторной таблицы. <code translate="no">id</code> автоматически увеличивается.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Имя векторной таблицы.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Тип индекса для построения векторной таблицы. По умолчанию 0, что означает недействительный индекс. 1 - FLAT. 2 - IVFLAT. 3 - IVFSQ8. 4 - NSG. 5 - IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">строка</td><td style="text-align:left">Имя файла, сгенерированное по времени создания файла. Равняется 1000, умноженному на количество миллисекунд, прошедших с 1 января 1970 года до момента создания таблицы.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Статус файла. 0 указывает на только что созданный файл необработанных векторных данных. 1 указывает на файл необработанных векторных данных. 2 указывает, что для файла будет построен индекс. 3 указывает, что файл является индексным файлом. 4 указывает, что файл будет удален (мягкое удаление). 5 указывает, что файл создается заново и используется для хранения комбинированных данных. 6 указывает, что файл является вновь созданным и используется для хранения индексных данных. 7 - статус резервного копирования файла необработанных векторных данных.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Размер файла в байтах.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Количество векторов в файле.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Временная метка для последнего времени обновления, которая указывает количество миллисекунд с 1 января 1970 года до момента создания таблицы.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Число миллисекунд с 1 января 1970 года до момента создания таблицы.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Дата создания таблицы. Этот параметр остался здесь по историческим причинам и будет удален в будущих версиях.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">Похожие блоги<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Управление данными в векторной поисковой системе огромного масштаба</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Управление метаданными Milvus (1): Как просматривать метаданные</a></li>
</ul>
