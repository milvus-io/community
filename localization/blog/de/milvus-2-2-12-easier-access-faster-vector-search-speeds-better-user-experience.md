---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: Leichterer Zugang, schnellere Vektorsuche und bessere
  Benutzerfreundlichkeit
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir freuen uns, die neueste Version von Milvus 2.2.12 ankündigen zu können. Dieses Update enthält mehrere neue Funktionen, wie z. B. die Unterstützung für RESTful API, die Funktion <code translate="no">json_contains</code> und die Vektorabfrage bei ANN-Suchen als Reaktion auf das Feedback der Benutzer. Außerdem haben wir die Benutzerfreundlichkeit verbessert, die Geschwindigkeit der Vektorsuche erhöht und viele Probleme behoben. Schauen wir uns nun an, was wir von Milvus 2.2.12 erwarten können.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Unterstützung für RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 unterstützt jetzt die RESTful API, die es den Nutzern ermöglicht, auf Milvus zuzugreifen, ohne einen Client installieren zu müssen, wodurch Client-Server-Operationen mühelos möglich sind. Darüber hinaus ist die Bereitstellung von Milvus bequemer geworden, da das Milvus SDK und die RESTful API dieselbe Portnummer verwenden.</p>
<p><strong>Hinweis</strong>: Wir empfehlen nach wie vor die Verwendung des SDK für die Bereitstellung von Milvus für fortgeschrittene Operationen oder wenn Ihr Unternehmen latenzempfindlich ist.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Vektorabruf bei ANN-Suchen<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>In früheren Versionen ließ Milvus den Vektorabruf während der ANN-Suche (Approximate Nearest Neighbour) nicht zu, um die Leistung und die Speichernutzung zu priorisieren. Infolgedessen musste der Abruf von Rohvektoren in zwei Schritte aufgeteilt werden: die Durchführung der ANN-Suche und die anschließende Abfrage der Rohvektoren auf der Grundlage ihrer IDs. Dieser Ansatz erhöhte die Entwicklungskosten und erschwerte den Anwendern die Einführung und Nutzung von Milvus.</p>
<p>Mit Milvus 2.2.12 können Benutzer während der ANN-Suche Rohvektoren abrufen, indem sie das Vektorfeld als Ausgabefeld festlegen und in HNSW-, DiskANN- oder IVF-FLAT-indizierten Sammlungen abfragen. Darüber hinaus können die Benutzer eine viel schnellere Vektorabrufgeschwindigkeit erwarten.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Unterstützung für Operationen auf JSON-Arrays<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Vor kurzem haben wir in Milvus 2.2.8 Unterstützung für JSON hinzugefügt. Seitdem haben Benutzer zahlreiche Anfragen zur Unterstützung zusätzlicher JSON-Array-Operationen gestellt, wie z. B. Einschluss, Ausschluss, Schnittmenge, Vereinigung, Differenz und mehr. In Milvus 2.2.12 haben wir der Unterstützung der Funktion <code translate="no">json_contains</code> Priorität eingeräumt, um die Einschlussoperation zu ermöglichen. Wir werden die Unterstützung für andere Operatoren in zukünftigen Versionen hinzufügen.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Erweiterungen und Fehlerbehebungen<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben der Einführung neuer Funktionen hat Milvus 2.2.12 die Leistung der Vektorsuche mit reduziertem Overhead verbessert, so dass umfangreiche Topk-Suchen leichter zu handhaben sind. Darüber hinaus wurde die Schreibleistung in Situationen mit aktiviertem Partitionsschlüssel und mehreren Partitionen verbessert und die CPU-Nutzung für große Maschinen optimiert. Dieses Update behebt verschiedene Probleme: übermäßige Festplattennutzung, festsitzende Verdichtung, seltene Datenlöschungen und Fehler beim Einfügen von Bulk-Daten. Weitere Informationen finden Sie in den <a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12 Release Notes</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Lassen Sie uns in Kontakt bleiben!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
