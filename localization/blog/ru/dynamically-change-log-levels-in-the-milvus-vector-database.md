---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Динамическое изменение уровней журналов в базе данных Milvus Vector
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: 'Узнайте, как настроить уровень журнала в Milvus без перезапуска службы.'
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/jiaoew1991">Энвэй Цзяо</a> и переведена <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>Чтобы чрезмерный объем журналов не влиял на производительность диска и системы, Milvus по умолчанию во время работы выводит журналы на уровне <code translate="no">info</code>. Однако иногда журналов на уровне <code translate="no">info</code> недостаточно для эффективного выявления ошибок и проблем. Более того, в некоторых случаях изменение уровня журнала и перезапуск службы может привести к невозможности воспроизведения проблем, что еще больше усложняет поиск и устранение неисправностей. Следовательно, поддержка динамического изменения уровня журнала в векторной базе данных Milvus крайне необходима.</p>
<p>Цель этой статьи - представить механизм, позволяющий динамически изменять уровни журналов, и дать инструкции, как это сделать в векторной базе данных Milvus.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#Mechanism">Механизм</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Как динамически изменять уровни журналов</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Механизм<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>В векторной базе данных Milvus используется логгер <a href="https://github.com/uber-go/zap">zap</a>, открытый компанией Uber. Являясь одним из самых мощных компонентов журнала в экосистеме языка Go, zap включает в себя модуль <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a>, чтобы вы могли просматривать текущий уровень журнала и динамически изменять его через HTTP-интерфейс.</p>
<p>Milvus прослушивает HTTP-сервис, предоставляемый портом <code translate="no">9091</code>. Таким образом, вы можете получить доступ к порту <code translate="no">9091</code>, чтобы воспользоваться такими возможностями, как отладка производительности, метрики, проверка работоспособности. Аналогично, порт <code translate="no">9091</code> используется для динамического изменения уровня журнала, и к нему также добавляется путь <code translate="no">/log/level</code>. Дополнительную информацию см. в разделе "<a href="https://github.com/milvus-io/milvus/pull/18430"> Интерфейс журнала" PR</a>.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Как динамически изменять уровни журналов<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом разделе приведены инструкции по динамическому изменению уровней журналов без необходимости перезапуска запущенной службы Milvus.</p>
<h3 id="Prerequisite" class="common-anchor-header">Необходимые условия</h3><p>Убедитесь, что вы можете получить доступ к порту <code translate="no">9091</code> компонентов Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Изменение уровня журнала</h3><p>Предположим, что IP-адрес прокси-сервера Milvus - <code translate="no">192.168.48.12</code>.</p>
<p>Сначала можно запустить <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code>, чтобы проверить текущий уровень журнала прокси.</p>
<p>Затем вы можете внести коррективы, указав уровень журнала. Опции уровня журнала включают:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>Следующий пример кода изменяет уровень журнала с уровня журнала по умолчанию <code translate="no">info</code> на <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
