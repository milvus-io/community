---
id: deep-dive-2-milvus-sdk-and-api.md
title: Введение в Milvus Python SDK и API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Узнайте, как SDK взаимодействуют с Milvus и почему API в стиле ORM поможет вам
  лучше управлять Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<p><a href="https://github.com/XuanYang-cn">Сюань Ян</a></p>
<h2 id="Background" class="common-anchor-header">Фон<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>На следующей иллюстрации показано взаимодействие между SDK и Milvus через gRPC. Представьте, что Milvus - это черный ящик. Буферы протоколов используются для определения интерфейсов сервера и структуры информации, которую они несут. Таким образом, все операции в черном ящике Milvus определяются Protocol API.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Взаимодействие</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus Protocol API<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Protocol API состоит из <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, и <code translate="no">schema.proto</code>, которые представляют собой файлы Protocol Buffers с суффиксом <code translate="no">.proto</code>. Чтобы обеспечить правильную работу, SDK должны взаимодействовать с Milvus с помощью этих файлов Protocol Buffers.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> является важнейшим компонентом Milvus Protocol API, поскольку он определяет <code translate="no">MilvusService</code>, который далее определяет все RPC-интерфейсы Milvus.</p>
<p>В следующем примере кода показан интерфейс <code translate="no">CreatePartitionRequest</code>. Он имеет два основных параметра строкового типа <code translate="no">collection_name</code> и <code translate="no">partition_name</code>, на основе которых можно запустить запрос на создание раздела.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Посмотрите пример протокола в <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">репозитории PyMilvus GitHub</a> на строке 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Пример</span> </span></p>
<p>Определение <code translate="no">CreatePartitionRequest</code> вы можете найти здесь.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Определение</span> </span></p>
<p>Участникам, которые хотят разработать функцию Milvus или SDK на другом языке программирования, предлагается найти все интерфейсы, которые Milvus предлагает через RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> определяет общие типы информации, включая <code translate="no">ErrorCode</code>, и <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> определяет схему в параметрах. Следующий пример кода является примером <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code> <code translate="no">common.proto</code> и вместе составляют API Milvus, представляя все операции, которые могут быть вызваны через RPC. <code translate="no">schema.proto</code> </p>
<p>Если вы покопаетесь в исходном коде и внимательно посмотрите, то обнаружите, что при вызове таких интерфейсов, как <code translate="no">create_index</code>, они на самом деле вызывают несколько RPC-интерфейсов, таких как <code translate="no">describe_collection</code> и <code translate="no">describe_index</code>. Многие внешние интерфейсы Milvus представляют собой комбинацию нескольких RPC-интерфейсов.</p>
<p>Разобравшись с поведением RPC, вы сможете разработать новые возможности для Milvus, используя их комбинации. Мы будем рады, если вы воспользуетесь своим воображением и творческим подходом и внесете свой вклад в развитие сообщества Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Объектно-реляционное отображение (ORM)</h3><p>Говоря в двух словах, объектно-реляционное отображение (ORM) означает, что когда вы работаете с локальным объектом, эти операции влияют на соответствующий объект на сервере. API PyMilvus в стиле ORM обладает следующими характеристиками:</p>
<ol>
<li>Он работает непосредственно с объектами.</li>
<li>Он изолирует логику обслуживания и детали доступа к данным.</li>
<li>Он скрывает сложность реализации, и вы можете запускать одни и те же скрипты на разных экземплярах Milvus независимо от подходов к развертыванию и реализации.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API в стиле ORM</h3><p>Одна из сущностей API в стиле ORM заключается в управлении подключением Milvus. Например, вы можете указать псевдонимы для нескольких серверов Milvus и подключаться или отключаться от них только с помощью их псевдонимов. Вы даже можете удалить адрес локального сервера и управлять определенными объектами именно через конкретное соединение.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Управление подключением</span> </span></p>
<p>Еще одной особенностью API в стиле ORM является то, что после абстрагирования все операции можно выполнять непосредственно над объектами, в том числе над коллекциями, разделами и индексами.</p>
<p>Вы можете абстрагировать объект коллекции, получив существующий объект или создав новый. Вы также можете назначить соединение Milvus определенным объектам с помощью псевдонима соединения, чтобы работать с этими объектами локально.</p>
<p>Чтобы создать объект раздела, вы можете либо создать его вместе с родительским объектом коллекции, либо сделать это так же, как при создании объекта коллекции. Эти методы можно применить и к объекту индекса.</p>
<p>В случае если эти объекты разделов или индексов уже существуют, их можно получить через родительский объект коллекции.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">О серии "Глубокое погружение<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>После <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">официального объявления об общей доступности</a> Milvus 2.0 мы организовали эту серию блогов Milvus Deep Dive, чтобы предоставить углубленную интерпретацию архитектуры и исходного кода Milvus. В этой серии блогов рассматриваются следующие темы:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Обзор архитектуры Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API и Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Обработка данных</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Управление данными</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Запрос в реальном времени</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Скалярный механизм выполнения</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Система контроля качества</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Векторный механизм выполнения</a></li>
</ul>
