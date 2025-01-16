---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Enthüllung von Milvus 2.3.2 &amp; 2.3.3: Unterstützung für Array-Datentypen,
  komplexes Löschen, TiKV-Integration und mehr
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  Wir freuen uns, heute die Veröffentlichung von Milvus 2.3.2 und 2.3.3
  ankündigen zu können! Diese Updates bringen viele spannende Funktionen,
  Optimierungen und Verbesserungen, die die Systemleistung, die Flexibilität und
  die allgemeine Benutzerfreundlichkeit verbessern.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In der sich ständig weiterentwickelnden Landschaft der Vektorsuchtechnologien bleibt Milvus an vorderster Front, verschiebt Grenzen und setzt neue Standards. Heute freuen wir uns, die Veröffentlichung von Milvus 2.3.2 und 2.3.3 bekannt zu geben! Diese Updates bringen viele spannende Funktionen, Optimierungen und Verbesserungen, die die Systemleistung, Flexibilität und die allgemeine Benutzerfreundlichkeit verbessern.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Unterstützung für Array-Datentypen - für genauere und relevantere Suchergebnisse<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Hinzufügen der Unterstützung für Array-Datentypen ist eine entscheidende Verbesserung für Milvus, insbesondere in Abfrage-Filter-Szenarien wie Schnittmenge und Vereinigung. Durch diese Ergänzung wird sichergestellt, dass die Suchergebnisse nicht nur genauer, sondern auch relevanter sind. In der Praxis, zum Beispiel im E-Commerce-Sektor, ermöglichen Produkt-Tags, die als String-Arrays gespeichert sind, den Verbrauchern eine erweiterte Suche, bei der irrelevante Ergebnisse herausgefiltert werden.</p>
<p>In unserer umfassenden <a href="https://milvus.io/docs/array_data_type.md">Dokumentation</a> finden Sie eine ausführliche Anleitung zur Nutzung von Array-Typen in Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Unterstützung für komplexe Löschausdrücke - Verbesserung Ihrer Datenverwaltung<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>In früheren Versionen unterstützte Milvus Ausdrücke zum Löschen von Primärschlüsseln und bot eine stabile und optimierte Architektur. Mit Milvus 2.3.2 oder 2.3.3 können Benutzer komplexe Löschausdrücke verwenden, die anspruchsvolle Datenverwaltungsaufgaben wie die rollierende Bereinigung alter Daten oder die GDPR-konforme Datenlöschung auf der Grundlage von Benutzer-IDs erleichtern.</p>
<p>Hinweis: Stellen Sie sicher, dass Sie Sammlungen geladen haben, bevor Sie komplexe Ausdrücke verwenden. Außerdem ist es wichtig zu beachten, dass der Löschvorgang keine Atomizität garantiert.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">TiKV-Integration - skalierbare Metadatenspeicherung mit Stabilität<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Da Milvus bisher auf Etcd für die Metadatenspeicherung angewiesen war, gab es Probleme mit der begrenzten Kapazität und Skalierbarkeit der Metadatenspeicherung. Um diese Probleme zu lösen, fügte Milvus TiKV, einen Open-Source-Schlüsselwertspeicher, als eine weitere Option für die Metadatenspeicherung hinzu. TiKV bietet eine verbesserte Skalierbarkeit, Stabilität und Effizienz und ist damit eine ideale Lösung für die sich entwickelnden Anforderungen von Milvus. Ab Milvus 2.3.2 können Benutzer durch Änderung der Konfiguration nahtlos zu TiKV für ihre Metadatenspeicherung übergehen.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Unterstützung für FP16-Vektortyp - Effizienz des maschinellen Lernens<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 und spätere Versionen unterstützen jetzt den FP16-Vektortyp auf der Schnittstellenebene. FP16, oder 16-Bit-Gleitkomma, ist ein Datenformat, das im Deep Learning und im maschinellen Lernen weit verbreitet ist und eine effiziente Darstellung und Berechnung numerischer Werte ermöglicht. Während die volle Unterstützung für FP16 in Arbeit ist, müssen verschiedene Indizes in der Indizierungsschicht während der Konstruktion von FP16 in FP32 konvertiert werden.</p>
<p>Wir werden FP16-, BF16- und int8-Datentypen in späteren Versionen von Milvus vollständig unterstützen. Bleiben Sie dran.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Signifikante Verbesserung des Rolling-Upgrade-Erlebnisses - nahtloser Übergang für Benutzer<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>Rolling Upgrade ist eine wichtige Funktion für verteilte Systeme, die System-Upgrades ohne Unterbrechung der Geschäftsdienste oder Ausfallzeiten ermöglicht. In den letzten Milvus-Releases haben wir die Funktion des Rolling Upgrades gestärkt, so dass ein reibungsloser und effizienter Übergang für die Benutzer beim Upgrade von Version 2.2.15 auf 2.3.3 und alle späteren Versionen gewährleistet ist. Die Community hat auch in umfangreiche Tests und Optimierungen investiert, um die Auswirkungen auf die Abfragen während des Upgrades auf weniger als 5 Minuten zu reduzieren und den Nutzern eine problemlose Erfahrung zu ermöglichen.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimierung der Leistung<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben der Einführung neuer Funktionen haben wir die Leistung von Milvus in den letzten beiden Versionen erheblich optimiert.</p>
<ul>
<li><p>Minimierte Datenkopiervorgänge für optimiertes Laden von Daten</p></li>
<li><p>Vereinfachte Einfügungen mit großer Kapazität durch Batch-Varchar-Lesen</p></li>
<li><p>Unnötige Offset-Prüfungen beim Auffüllen von Daten wurden entfernt, um die Leistung der Abrufphase zu verbessern.</p></li>
<li><p>Behebung von Problemen mit hohem CPU-Verbrauch in Szenarien mit umfangreichen Dateneinfügungen</p></li>
</ul>
<p>Diese Optimierungen tragen insgesamt zu einem schnelleren und effizienteren Milvus-Erlebnis bei. Werfen Sie einen Blick auf unser Monitoring-Dashboard, um zu sehen, wie Milvus seine Leistung verbessert hat.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Inkompatible Änderungen<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>Dauerhaft gelöschter TimeTravel-bezogener Code.</p></li>
<li><p>Veraltete Unterstützung für MySQL als Metadatenspeicher.</p></li>
</ul>
<p>Detaillierte Informationen zu allen neuen Funktionen und Verbesserungen finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Versionshinweisen von Milvus</a>.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit den neuesten Milvus-Versionen 2.3.2 und 2.3.3 sind wir bestrebt, eine robuste, funktionsreiche und leistungsstarke Datenbanklösung anzubieten. Entdecken Sie diese neuen Funktionen, nutzen Sie die Vorteile der Optimierungen und begleiten Sie uns auf dieser spannenden Reise, während wir Milvus weiterentwickeln, um den Anforderungen des modernen Datenmanagements gerecht zu werden. Laden Sie jetzt die neueste Version herunter und erleben Sie die Zukunft der Datenspeicherung mit Milvus!</p>
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
    </button></h2><p>Wenn Sie Fragen oder Feedback zu Milvus haben, treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei, um sich direkt mit unseren Ingenieuren und der Community auszutauschen oder nehmen Sie an unserem <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> teil, das jeden Dienstag von 12-12:30 PM PST stattfindet. Sie können uns auch gerne auf <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> folgen, um die neuesten Nachrichten und Updates über Milvus zu erhalten.</p>
