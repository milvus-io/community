---
id: 2019-12-18-datafile-cleanup.md
title: Bisherige Löschstrategie und damit verbundene Probleme
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Wir haben die Strategie zum Löschen von Dateien verbessert, um die Probleme im
  Zusammenhang mit Abfrageoperationen zu beheben.
cover: null
tag: Engineering
---
<custom-h1>Verbesserungen des Mechanismus zur Bereinigung von Datendateien</custom-h1><blockquote>
<p>Autor: Yihua Mo</p>
<p>Datum: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Bisherige Löschstrategie und damit verbundene Probleme<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>In <a href="/blog/de/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a> haben wir den Löschmechanismus von Datendateien erwähnt. Das Löschen umfasst das sanfte Löschen und das harte Löschen. Nach einer Löschoperation an einer Tabelle wird die Tabelle mit "soft-delete" markiert. Such- oder Aktualisierungsoperationen sind danach nicht mehr zulässig. Die Abfrageoperation, die vor dem Löschen beginnt, kann jedoch weiterhin ausgeführt werden. Die Tabelle wird zusammen mit den Metadaten und anderen Dateien erst dann wirklich gelöscht, wenn der Abfragevorgang abgeschlossen ist.</p>
<p>Wann also werden die mit "soft-delete" markierten Dateien wirklich gelöscht? Vor Version 0.6.0 galt die Strategie, dass eine Datei erst dann wirklich gelöscht wird, wenn sie 5 Minuten lang weich gelöscht wurde. Die folgende Abbildung zeigt die Strategie:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5 Minuten</span> </span></p>
<p>Diese Strategie basiert auf der Annahme, dass Abfragen normalerweise nicht länger als 5 Minuten dauern und ist nicht zuverlässig. Wenn eine Abfrage länger als 5 Minuten dauert, schlägt die Abfrage fehl. Der Grund dafür ist, dass Milvus zu Beginn einer Abfrage Informationen über Dateien sammelt, die durchsucht werden können, und Abfrageaufgaben erstellt. Dann lädt der Abfrageplaner eine Datei nach der anderen in den Speicher und sucht eine Datei nach der anderen. Wenn eine Datei beim Laden einer Datei nicht mehr existiert, schlägt die Abfrage fehl.</p>
<p>Die Verlängerung der Zeit kann dazu beitragen, das Risiko von Abfragefehlern zu verringern, führt aber auch zu einem anderen Problem: Die Festplattennutzung ist zu groß. Der Grund dafür ist, dass Milvus beim Einfügen großer Mengen von Vektoren ständig Datendateien kombiniert und die kombinierten Dateien nicht sofort von der Festplatte entfernt werden, auch wenn keine Abfrage erfolgt. Wenn die Dateneinfügung zu schnell und/oder die Menge der eingefügten Daten zu groß ist, kann sich die zusätzliche Festplattennutzung auf mehrere Dutzend GB belaufen. Die folgende Abbildung ist ein Beispiel dafür:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>Ergebnis</span> </span></p>
<p>Wie in der vorherigen Abbildung gezeigt, wird der erste Stapel eingefügter Daten (insert_1) auf die Festplatte gespült und wird zu file_1, dann wird insert_2 zu file_2. Der für die Dateikombination zuständige Thread kombiniert die Dateien zu file_3. Anschließend werden file_1 und file_2 als "soft-delete" markiert. Der dritte Stapel von Einfügedaten wird zu file_4. Der Thread kombiniert file_3 und file_4 zu file_5 und markiert file_3 und file_4 als soft-delete.</p>
<p>In gleicher Weise werden insert_6 und insert_5 kombiniert. In t3 werden file_5 und file_6 als "soft-delete" markiert. Zwischen t3 und t4 sind viele Dateien zwar als "soft-delete" markiert, befinden sich aber noch auf der Festplatte. Nach t4 werden die Dateien tatsächlich gelöscht. Zwischen t3 und t4 beträgt die Festplattennutzung also 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. Die eingefügten Daten sind 64 + 64 + 64 + 64 = 256 MB. Die Festplattennutzung beträgt das Dreifache der Größe der eingefügten Daten. Je schneller die Schreibgeschwindigkeit der Festplatte ist, desto höher ist die Festplattennutzung während eines bestimmten Zeitraums.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Verbesserungen der Löschstrategie in 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Daher haben wir die Strategie zum Löschen von Dateien in v0.6.0 geändert. Hard-delete verwendet nicht mehr die Zeit als Auslöser. Stattdessen ist der Auslöser, wenn die Datei von keiner Aufgabe verwendet wird.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>neue strategie</span> </span></p>
<p>Angenommen, es werden zwei Stapel von Vektoren eingefügt. In t1 wird eine Abfrageanfrage gestellt, Milvus beschafft zwei abzufragende Dateien (file_1 und file_2, da file_3 noch nicht existiert). Wenn file_3 erzeugt wird, werden file_1 und file_2 als "soft-delete" markiert. Nach der Abfrage werden file_1 und file_2 von keiner anderen Aufgabe mehr verwendet, so dass sie in t4 hartgelöscht werden. Das Intervall zwischen t2 und t4 ist sehr klein und hängt von dem Intervall der Abfrage ab. Auf diese Weise werden ungenutzte Dateien rechtzeitig entfernt.</p>
<p>Bei der internen Implementierung wird die Referenzzählung, die Softwareingenieuren vertraut ist, verwendet, um festzustellen, ob eine Datei hart gelöscht werden kann. Zur Erklärung ein Vergleich: Wenn ein Spieler in einem Spiel noch Leben hat, kann er noch spielen. Wenn die Anzahl der Leben 0 wird, ist das Spiel vorbei. Milvus überwacht den Status jeder Datei. Wenn eine Datei von einer Aufgabe verwendet wird, wird der Datei ein Leben hinzugefügt. Wenn die Datei nicht mehr benutzt wird, wird ein Leben aus der Datei entfernt. Wenn eine Datei mit Soft-Delete markiert ist und die Anzahl der Leben 0 ist, ist die Datei bereit für Hard-Delete.</p>
<h2 id="Related-blogs" class="common-anchor-header">Verwandte Blogs<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="/blog/de/2019-11-08-data-management.md">Verwaltung von Daten in einer Massive-Scale-Vektor-Suchmaschine</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus Metadaten-Verwaltung (1): Wie man Metadaten anzeigt</a></li>
<li><a href="/blog/de/2019-12-27-meta-table.md">Milvus Metadaten-Verwaltung (2): Felder in der Metadatentabelle</a></li>
</ul>
