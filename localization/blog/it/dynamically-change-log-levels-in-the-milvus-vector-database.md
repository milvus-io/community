---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Modifica dinamica dei livelli dei registri nel database Milvus Vector
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: >-
  Scoprite come regolare il livello di log in Milvus senza riavviare il
  servizio.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/jiaoew1991">Enwei Jiao</a> e tradotto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Per evitare che un eccesso di registri influisca sulle prestazioni del disco e del sistema, Milvus produce per impostazione predefinita i registri al livello <code translate="no">info</code> durante l'esecuzione. Tuttavia, a volte i log al livello <code translate="no">info</code> non sono sufficienti per aiutarci a identificare efficacemente bug e problemi. Inoltre, in alcuni casi, la modifica del livello di log e il riavvio del servizio possono portare alla mancata riproduzione dei problemi, rendendo ancora più difficile la risoluzione dei problemi. Di conseguenza, il supporto per la modifica dinamica dei livelli di log nel database dei vettori di Milvus è urgentemente necessario.</p>
<p>Questo articolo si propone di introdurre il meccanismo che consente di modificare dinamicamente i livelli di log e di fornire istruzioni su come farlo nel database dei vettori Milvus.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#Mechanism">Meccanismo</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Come modificare dinamicamente i livelli di log</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Meccanismo<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Il database vettoriale Milvus adotta il logger <a href="https://github.com/uber-go/zap">zap</a> open sourced di Uber. Essendo uno dei componenti di log più potenti nell'ecosistema del linguaggio Go, zap incorpora un modulo <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> che consente di visualizzare il livello di log corrente e di modificarlo dinamicamente tramite un'interfaccia HTTP.</p>
<p>Milvus ascolta il servizio HTTP fornito dalla porta <code translate="no">9091</code>. Pertanto, è possibile accedere alla porta <code translate="no">9091</code> per sfruttare funzioni quali il debug delle prestazioni, le metriche e i controlli di salute. Allo stesso modo, la porta <code translate="no">9091</code> viene riutilizzata per consentire la modifica dinamica del livello di log e alla porta viene aggiunto anche un percorso <code translate="no">/log/level</code>. Per ulteriori informazioni, vedere la<a href="https://github.com/milvus-io/milvus/pull/18430"> PR</a> dell'<a href="https://github.com/milvus-io/milvus/pull/18430"> interfaccia di log</a>.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Come modificare dinamicamente i livelli di log<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa sezione fornisce istruzioni su come modificare dinamicamente i livelli di log senza dover riavviare il servizio Milvus in esecuzione.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisito</h3><p>Assicurarsi di poter accedere alla porta <code translate="no">9091</code> dei componenti Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Cambiare il livello di log</h3><p>Supponiamo che l'indirizzo IP del proxy Milvus sia <code translate="no">192.168.48.12</code>.</p>
<p>Per prima cosa si può eseguire <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> per verificare il livello di log corrente del proxy.</p>
<p>Poi si possono apportare modifiche specificando il livello di log. Le opzioni del livello di log includono:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>Il seguente esempio di codice modifica il livello di log dal livello di log predefinito da <code translate="no">info</code> a <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
