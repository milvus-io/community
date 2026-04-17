---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 &amp; 2.2.11: Kleinere Updates für verbesserte Systemstabilität
  und Benutzerfreundlichkeit
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Einführung neuer Funktionen und Verbesserungen von Milvus 2.2.10 und 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Grüße, Milvus-Fans! Wir freuen uns, Ihnen mitteilen zu können, dass wir soeben Milvus 2.2.10 und 2.2.11 veröffentlicht haben, zwei kleinere Updates, die sich in erster Linie auf Fehlerbehebungen und allgemeine Leistungsverbesserungen konzentrieren. Mit den beiden Updates können Sie ein stabileres System und eine bessere Benutzererfahrung erwarten. Werfen wir einen kurzen Blick auf die Neuerungen in diesen beiden Versionen.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 behebt gelegentliche Systemabstürze, beschleunigt das Laden und Indizieren, reduziert die Speichernutzung in Datenknoten und bietet viele weitere Verbesserungen. Im Folgenden sind einige bemerkenswerte Änderungen aufgeführt:</p>
<ul>
<li>Der alte CGO Payload Writer wurde durch einen neuen ersetzt, der in reinem Go geschrieben wurde, was die Speichernutzung in Datenknoten reduziert.</li>
<li><code translate="no">go-api/v2</code> wurde zur Datei <code translate="no">milvus-proto</code> hinzugefügt, um Verwechslungen mit verschiedenen <code translate="no">milvus-proto</code> Versionen zu vermeiden.</li>
<li>Gin wurde von Version 1.9.0 auf 1.9.1 aktualisiert, um einen Fehler in der Funktion <code translate="no">Context.FileAttachment</code> zu beheben.</li>
<li>Hinzufügen der rollenbasierten Zugriffskontrolle (RBAC) für die FlushAll- und Datenbank-APIs.</li>
<li>Es wurde ein zufälliger Absturz behoben, der durch das AWS S3 SDK verursacht wurde.</li>
<li>Die Lade- und Indizierungsgeschwindigkeiten wurden verbessert.</li>
</ul>
<p>Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10 Release Notes</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 hat verschiedene Probleme behoben, um die Stabilität des Systems zu verbessern. Außerdem wurde die Leistung bei der Überwachung, Protokollierung, Ratenbegrenzung und dem Abfangen von clusterübergreifenden Anfragen verbessert. Im Folgenden finden Sie die wichtigsten Neuerungen dieses Updates.</p>
<ul>
<li>Dem Milvus GRPC-Server wurde ein Interceptor hinzugefügt, um Probleme mit dem Cross-Cluster-Routing zu vermeiden.</li>
<li>Hinzufügen von Fehlercodes zum minio chunk manager, um die Fehlerdiagnose und -behebung zu erleichtern.</li>
<li>Verwendung eines Singleton-Coroutine-Pools, um die Verschwendung von Coroutines zu vermeiden und die Nutzung von Ressourcen zu maximieren.</li>
<li>Reduzierung der Festplattennutzung für RocksMq auf ein Zehntel des ursprünglichen Wertes durch Aktivierung der zstd-Kompression.</li>
<li>Gelegentliche QueryNode-Panik während des Ladens behoben.</li>
<li>Das Problem mit der Drosselung von Leseanfragen, das durch die doppelte Berechnung der Warteschlangenlänge verursacht wurde, wurde behoben.</li>
<li>Probleme mit GetObject, das unter MacOS Nullwerte zurückgibt, wurden behoben.</li>
<li>Es wurde ein Absturz behoben, der durch die falsche Verwendung des noexcept-Modifikators verursacht wurde.</li>
</ul>
<p>Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11 Release Notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Bleiben wir in Kontakt!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Fragen oder Feedback zu Milvus haben, zögern Sie bitte nicht, uns über <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> zu kontaktieren. Sie können auch gerne unserem <a href="https://milvus.io/slack/">Slack-Kanal</a> beitreten, um sich direkt mit unseren Ingenieuren und der Community auszutauschen, oder besuchen Sie unsere <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Dienstagssprechstunde</a>!</p>
