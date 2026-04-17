---
id: managing-metadata-in-milvus-2.md
title: Поля в таблице Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Поля в таблице метаданных
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Управление метаданными Milvus (2)</custom-h1><p>В прошлом блоге мы рассказали о том, как просматривать метаданные с помощью MySQL или SQLite. В этой статье мы хотим подробно рассказать о полях в таблицах метаданных.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Поля в таблице <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Возьмем для примера SQLite. Следующий результат получен в версии 0.5.0. В версии 0.6.0 добавлены некоторые поля, которые будут представлены позже. В <code translate="no">Tables</code> есть строка, определяющая 512-мерную векторную таблицу с именем &lt;codetable_1</code>. Когда таблица создана, <code translate="no">index_file_size</code> - 1024 МБ, <code translate="no">engine_type</code> - 1 (FLAT), <code translate="no">nlist</code> - 16384, <code translate="no">metric_type</code> - 1 (евклидово расстояние L2). id - уникальный идентификатор таблицы. <code translate="no">state</code> - состояние таблицы, 0 означает нормальное состояние. <code translate="no">created_on</code> - время создания. <code translate="no">flag</code> - флаг, зарезервированный для внутреннего использования.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>В следующей таблице приведены типы полей и описания полей в <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>В версии 0.6.0 включено разделение таблиц на несколько новых полей, включая <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> и <code translate="no">version</code>. Векторная таблица <code translate="no">table_1</code> имеет раздел <code translate="no">table_1_p1</code>, который также является векторной таблицей. <code translate="no">partition_name</code> соответствует <code translate="no">table_id</code>. Поля в таблице разделов наследуются от <code translate="no">owner table</code>, при этом поле таблицы-владельца указывает имя таблицы-владельца, а поле <code translate="no">partition_tag</code> - тег раздела.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>В следующей таблице представлены новые поля в версии 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-new-fields-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Поля в таблице TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Следующий пример содержит два файла, которые оба принадлежат векторной таблице <code translate="no">table_1</code>. Тип индекса (<code translate="no">engine_type</code>) первого файла - 1 (FLAT); статус файла (<code translate="no">file_type</code>) - 7 (резервная копия исходного файла); <code translate="no">file_size</code> - 411200113 байт; количество строк вектора - 200 000. Тип индекса второго файла - 2 (IVFLAT); статус файла - 3 (индексный файл). Второй файл на самом деле является индексом первого файла. Более подробную информацию мы представим в следующих статьях.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-image-3.png</span> </span></p>
<p>В следующей таблице приведены поля и описания <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Что будет дальше<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>В следующей статье мы расскажем вам, как использовать SQLite для управления метаданными в Milvus. Следите за новостями!</p>
<p>Если у вас есть вопросы, присоединяйтесь к нашему <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">Slack-каналу или</a>создайте проблему в репо.</p>
<p>GitHub репо: https://github.com/milvus-io/milvus</p>
