---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: >-
  Milvus 2.2.9: Ein mit Spannung erwartetes Release mit optimaler
  Benutzerfreundlichkeit
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir freuen uns, die Ankunft von Milvus 2.2.9 ankündigen zu können, eine mit Spannung erwartete Version, die einen bedeutenden Meilenstein für das Team und die Community darstellt. Diese Version bietet viele spannende Funktionen, darunter die lang erwartete Unterstützung für JSON-Datentypen, dynamische Schemata und Partitionsschlüssel, die eine optimierte Benutzererfahrung und einen optimierten Entwicklungsworkflow gewährleisten. Darüber hinaus enthält diese Version zahlreiche Erweiterungen und Fehlerbehebungen. Begleiten Sie uns bei der Erkundung von Milvus 2.2.9 und entdecken Sie, warum diese Version so spannend ist.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Optimierte Benutzerfreundlichkeit mit JSON-Unterstützung<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus hat die mit Spannung erwartete Unterstützung für den JSON-Datentyp eingeführt, der die nahtlose Speicherung von JSON-Daten neben den Metadaten von Vektoren in den Sammlungen der Benutzer ermöglicht. Mit dieser Erweiterung können Benutzer JSON-Daten effizient in Massen einfügen und erweiterte Abfragen und Filterungen auf der Grundlage der Inhalte ihrer JSON-Felder durchführen. Darüber hinaus können Benutzer Ausdrücke nutzen und Operationen durchführen, die auf die JSON-Felder ihres Datensatzes zugeschnitten sind, Abfragen erstellen und Filter anwenden, die auf dem Inhalt und der Struktur ihrer JSON-Felder basieren, wodurch sie relevante Informationen extrahieren und Daten besser bearbeiten können.</p>
<p>In Zukunft wird das Milvus-Team Indizes für Felder innerhalb des JSON-Typs hinzufügen, um die Leistung von gemischten skalaren und vektoriellen Abfragen weiter zu optimieren. Bleiben Sie also gespannt auf die kommenden Entwicklungen!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Mehr Flexibilität durch Unterstützung für dynamische Schemata<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der Unterstützung von JSON-Daten bietet Milvus 2.2.9 jetzt eine dynamische Schemafunktionalität durch ein vereinfachtes Software Development Kit (SDK).</p>
<p>Ab Milvus 2.2.9 enthält das Milvus SDK eine High-Level-API, die automatisch dynamische Felder in das versteckte JSON-Feld der Sammlung einfügt, so dass sich die Benutzer ausschließlich auf ihre Geschäftsfelder konzentrieren können.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Bessere Datentrennung und verbesserte Sucheffizienz mit Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 erweitert seine Partitionierungsmöglichkeiten durch die Einführung der Funktion Partition Key. Sie ermöglicht benutzerspezifische Spalten als Primärschlüssel für die Partitionierung, wodurch zusätzliche APIs wie <code translate="no">loadPartition</code> und <code translate="no">releasePartition</code> überflüssig werden. Diese neue Funktion hebt auch die Begrenzung der Anzahl der Partitionen auf, was zu einer effizienteren Ressourcennutzung führt.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Unterstützung für Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 unterstützt jetzt den Alibaba Cloud Object Storage Service (OSS). Alibaba-Cloud-Benutzer können die <code translate="no">cloudProvider</code> einfach für Alibaba Cloud konfigurieren und die Vorteile der nahtlosen Integration für die effiziente Speicherung und den Abruf von Vektordaten in der Cloud nutzen.</p>
<p>Zusätzlich zu den bereits erwähnten Funktionen bietet Milvus 2.2.9 Datenbankunterstützung in der rollenbasierten Zugriffskontrolle (RBAC), führt Verbindungsverwaltung ein und enthält mehrere Verbesserungen und Fehlerbehebungen. Weitere Informationen finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 Release Notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Lassen Sie uns in Kontakt bleiben!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
