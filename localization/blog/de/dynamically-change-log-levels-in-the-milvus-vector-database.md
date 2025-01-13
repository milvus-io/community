---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Dynamische Änderung der Log-Ebenen in der Milvus-Vektor-Datenbank
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Sie den Loglevel in Milvus anpassen können, ohne den Dienst
  neu zu starten.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/jiaoew1991">Enwei Jiao</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> übersetzt.</p>
</blockquote>
<p>Um zu verhindern, dass eine übermäßige Ausgabe von Protokollen die Festplatten- und Systemleistung beeinträchtigt, gibt Milvus während des Betriebs standardmäßig Protokolle auf der Ebene <code translate="no">info</code> aus. Manchmal reichen Protokolle auf der Ebene <code translate="no">info</code> jedoch nicht aus, um Fehler und Probleme effizient zu identifizieren. Noch schlimmer ist, dass in einigen Fällen das Ändern der Protokollebene und der Neustart des Dienstes dazu führen kann, dass die Probleme nicht reproduziert werden können, was die Fehlersuche noch schwieriger macht. Daher ist die Unterstützung für die dynamische Änderung der Log-Ebenen in der Milvus-Vektor-Datenbank dringend erforderlich.</p>
<p>In diesem Artikel wird der Mechanismus vorgestellt, der eine dynamische Änderung der Protokollebenen ermöglicht, und es werden Anweisungen gegeben, wie dies in der Milvus-Vektordatenbank zu bewerkstelligen ist.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#Mechanism">Mechanismus</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Dynamische Änderung der Protokollierungsstufen</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mechanismus<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Milvus-Vektordatenbank verwendet den <a href="https://github.com/uber-go/zap">zap-Logger</a>, der von Uber als Open Source zur Verfügung gestellt wird. Als eine der leistungsstärksten Log-Komponenten im Go-Ökosystem enthält zap ein <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go-Modul</a>, mit dem Sie die aktuelle Log-Stufe anzeigen und die Log-Stufe über eine HTTP-Schnittstelle dynamisch ändern können.</p>
<p>Milvus lauscht auf den HTTP-Dienst, der über den Port <code translate="no">9091</code> bereitgestellt wird. Daher können Sie auf den Port <code translate="no">9091</code> zugreifen, um Funktionen wie Leistungsdebugging, Metriken und Zustandsprüfungen zu nutzen. In ähnlicher Weise wird der Port <code translate="no">9091</code> wiederverwendet, um eine dynamische Änderung der Protokollebene zu ermöglichen, und ein <code translate="no">/log/level</code> -Pfad wird ebenfalls zum Port hinzugefügt. Weitere Informationen finden Sie in der<a href="https://github.com/milvus-io/milvus/pull/18430"> PR zur Protokollschnittstelle</a>.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Dynamische Änderung der Protokollebenen<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser Abschnitt enthält Anweisungen zur dynamischen Änderung der Protokollstufen, ohne dass der laufende Milvus-Dienst neu gestartet werden muss.</p>
<h3 id="Prerequisite" class="common-anchor-header">Voraussetzung</h3><p>Stellen Sie sicher, dass Sie auf den <code translate="no">9091</code> Port der Milvus-Komponenten zugreifen können.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Ändern des Loglevels</h3><p>Angenommen, die IP-Adresse des Milvus-Proxys lautet <code translate="no">192.168.48.12</code>.</p>
<p>Sie können zunächst <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> ausführen, um die aktuelle Protokollierungsstufe des Proxys zu überprüfen.</p>
<p>Dann können Sie Anpassungen vornehmen, indem Sie die Protokollierungsstufe angeben. Die Optionen für die Protokollierungsstufe umfassen:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>Der folgende Beispielcode ändert die Protokollebene von der Standardprotokollebene von <code translate="no">info</code> auf <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
