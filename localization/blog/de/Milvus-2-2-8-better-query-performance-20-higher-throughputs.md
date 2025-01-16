---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: Bessere Abfrageleistung, 20% höherer Durchsatz'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Wir freuen uns, unsere neueste Version von Milvus 2.2.8 ankündigen zu können. Diese Version enthält zahlreiche Verbesserungen und Fehlerkorrekturen im Vergleich zu den Vorgängerversionen, was zu einer besseren Abfrageleistung, Ressourcenschonung und höheren Durchsätzen führt. Schauen wir uns gemeinsam an, was in dieser Version neu ist.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Reduzierter Spitzenspeicherverbrauch beim Laden von Sammlungen<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Um Abfragen durchführen zu können, muss Milvus Daten und Indizes in den Speicher laden. Während des Ladevorgangs können jedoch mehrere Speicherkopien dazu führen, dass der Spitzenspeicherverbrauch drei- bis viermal so hoch ist wie während der eigentlichen Laufzeit. Die neueste Version von Milvus 2.2.8 behebt dieses Problem effektiv und optimiert die Speichernutzung.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Erweiterte Abfrageszenarien mit QueryNode, das Plugins unterstützt<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>QueryNode unterstützt nun Plugins in der neuesten Milvus 2.2.8. Sie können den Pfad der Plugin-Datei einfach in der <code translate="no">queryNode.soPath</code> Konfiguration angeben. Dann kann Milvus das Plugin zur Laufzeit laden und die verfügbaren Abfrageszenarien erweitern. Wenn Sie eine Anleitung zur Entwicklung von Plugins benötigen, lesen Sie bitte die <a href="https://pkg.go.dev/plugin">Go-Plugin-Dokumentation</a>.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Optimierte Abfrageleistung mit verbessertem Verdichtungsalgorithmus<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Verdichtungsalgorithmus bestimmt die Geschwindigkeit, mit der die Segmente konvergieren können, was sich direkt auf die Abfrageleistung auswirkt. Mit den jüngsten Verbesserungen des Verdichtungsalgorithmus hat sich die Konvergenzeffizienz drastisch verbessert, was zu schnelleren Abfragen führt.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Bessere Ressourcensparsamkeit und Abfrageleistung mit reduzierten Sammlungssplittern<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist ein massiv paralleles Verarbeitungssystem (MPP), was bedeutet, dass die Anzahl der Sammlungssplitter die Effizienz von Milvus beim Schreiben und Abfragen beeinflusst. In älteren Versionen verfügte eine Sammlung standardmäßig über zwei Shards, was zu einer ausgezeichneten Schreibleistung führte, aber die Abfrageleistung und die Ressourcenkosten beeinträchtigte. Mit dem neuen Milvus-Update 2.2.8 wurden die Standard-Sammlungs-Shards auf einen reduziert, wodurch die Benutzer mehr Ressourcen sparen und bessere Abfragen durchführen können. Die meisten Benutzer in der Community haben weniger als 10 Millionen Datenvolumen, und ein Shard ist ausreichend, um eine gute Schreibleistung zu erzielen.</p>
<p><strong>Hinweis</strong>: Dieses Upgrade wirkt sich nicht auf Sammlungen aus, die vor dieser Version erstellt wurden.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">20 % mehr Durchsatz mit einem verbesserten Abfragegruppierungsalgorithmus<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus verfügt über einen effizienten Abfragegruppierungsalgorithmus, der mehrere Abfrageanfragen in der Warteschlange zur schnelleren Ausführung zu einer einzigen zusammenfasst und so den Durchsatz erheblich verbessert. In der neuesten Version haben wir diesen Algorithmus weiter verbessert, wodurch sich der Durchsatz von Milvus um mindestens 20 % erhöht.</p>
<p>Zusätzlich zu den erwähnten Verbesserungen behebt Milvus 2.2.8 auch verschiedene Bugs. Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Milvus Release Notes</a>.</p>
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
    </button></h2><p>Wenn Sie Fragen oder Feedback zu Milvus haben, zögern Sie bitte nicht, uns über <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> zu kontaktieren. Sie sind auch herzlich eingeladen, unserem <a href="https://milvus.io/slack/">Slack-Kanal</a> beizutreten, um direkt mit unseren Ingenieuren und der gesamten Community zu chatten, oder besuchen Sie unsere <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Sprechstunde am Dienstag</a>!</p>
