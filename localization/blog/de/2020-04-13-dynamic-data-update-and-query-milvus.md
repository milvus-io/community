---
id: dynamic-data-update-and-query-milvus.md
title: Vorbereitung
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: Die Vektorsuche ist jetzt noch intuitiver und bequemer
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Wie Milvus die dynamische Datenaktualisierung und -abfrage implementiert</custom-h1><p>In diesem Artikel werden wir hauptsächlich beschreiben, wie Vektordaten im Speicher von Milvus aufgezeichnet werden und wie diese Datensätze gepflegt werden.</p>
<p>Nachfolgend sind unsere wichtigsten Designziele aufgeführt:</p>
<ol>
<li>Die Effizienz des Datenimports sollte hoch sein.</li>
<li>Die Daten sollen so schnell wie möglich nach dem Datenimport sichtbar sein.</li>
<li>Die Fragmentierung von Datendateien soll vermieden werden.</li>
</ol>
<p>Aus diesem Grund haben wir einen Speicherpuffer (Insert Buffer) zum Einfügen von Daten eingerichtet, um die Anzahl der Kontextwechsel bei zufälligen IO auf der Festplatte und im Betriebssystem zu reduzieren und die Leistung beim Einfügen von Daten zu verbessern. Die Speicherarchitektur, die auf MemTable und MemTableFile basiert, ermöglicht es uns, Daten bequemer zu verwalten und zu serialisieren. Der Zustand des Puffers ist in "Mutable" und "Immutable" unterteilt, wodurch die Daten auf der Festplatte persistiert werden können und gleichzeitig externe Dienste verfügbar bleiben.</p>
<h2 id="Preparation" class="common-anchor-header">Vorbereitung<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn der Benutzer bereit ist, einen Vektor in Milvus einzufügen, muss er zunächst eine Collection erstellen (* Milvus benennt Table in der Version 0.7.0 in Collection um). Eine Sammlung ist die grundlegendste Einheit für die Aufnahme und Suche von Vektoren in Milvus.</p>
<p>Jede Collection hat einen eindeutigen Namen und einige Eigenschaften, die eingestellt werden können, und Vektoren werden basierend auf dem Collection-Namen eingefügt oder gesucht. Wenn Sie eine neue Sammlung anlegen, speichert Milvus die Informationen dieser Sammlung in den Metadaten.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Einfügen von Daten<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn der Benutzer eine Anfrage zum Einfügen von Daten sendet, werden die Daten serialisiert und deserialisiert, um den Milvus-Server zu erreichen. Die Daten werden nun in den Speicher geschrieben. Das Schreiben in den Speicher ist grob in die folgenden Schritte unterteilt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>Suchen oder erstellen Sie im MemManager eine neue MemTable, die dem Namen der Sammlung entspricht. Jede MemTable entspricht einem Sammlungspuffer im Speicher.</li>
<li>Eine MemTable enthält eine oder mehrere MemTableFile. Jedes Mal, wenn wir eine neue MemTableFile erstellen, werden wir diese Information gleichzeitig in der Meta aufzeichnen. Wir unterteilen MemTableFile in zwei Zustände: Veränderlich und unveränderlich. Wenn die Größe von MemTableFile den Schwellenwert erreicht, wird sie unveränderlich. Jede MemTable kann zu jeder Zeit nur eine veränderbare MemTableFile haben, die geschrieben werden kann.</li>
<li>Die Daten jeder MemTableDatei werden schließlich im Speicher im Format des eingestellten Indextyps gespeichert. MemTableFile ist die grundlegendste Einheit für die Verwaltung von Daten im Speicher.</li>
<li>Der Speicherverbrauch der eingefügten Daten wird zu keinem Zeitpunkt den voreingestellten Wert (insert_buffer_size) überschreiten. Der Grund dafür ist, dass MemManager bei jeder Anfrage zum Einfügen von Daten den von der in jeder MemTable enthaltenen MemTableFile belegten Speicherplatz leicht berechnen und die Einfügeanfrage entsprechend dem aktuellen Speicherplatz koordinieren kann.</li>
</ol>
<p>Durch die mehrstufige Architektur von MemManager, MemTable und MemTableFile kann die Dateneinfügung besser verwaltet und gepflegt werden. Natürlich können sie noch viel mehr als das.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Abfrage fast in Echtzeit<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus müssen Sie höchstens eine Sekunde warten, bis die eingefügten Daten vom Speicher auf die Festplatte übertragen werden. Dieser gesamte Vorgang lässt sich grob mit dem folgenden Bild zusammenfassen:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>Zunächst werden die eingefügten Daten in einen Puffer im Speicher eingefügt. Der Puffer wechselt in regelmäßigen Abständen vom anfänglichen Zustand Mutable (veränderlich) in den Zustand Immutable (unveränderlich), um die Serialisierung vorzubereiten. Anschließend werden diese unveränderlichen Puffer in regelmäßigen Abständen vom Hintergrund-Serialisierungs-Thread auf die Festplatte serialisiert. Nachdem die Daten platziert wurden, werden die Auftragsinformationen in den Metadaten aufgezeichnet. Ab diesem Zeitpunkt können die Daten durchsucht werden!</p>
<p>Wir werden nun die Schritte im Bild im Detail beschreiben.</p>
<p>Wir kennen bereits den Prozess des Einfügens von Daten in den veränderlichen Puffer. Der nächste Schritt ist der Wechsel vom veränderbaren Puffer zum unveränderbaren Puffer:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>Die unveränderliche Warteschlange versorgt den Hintergrund-Serialisierungs-Thread mit dem unveränderlichen Zustand und der MemTableFile, die zur Serialisierung bereit ist. Jede MemTable verwaltet ihre eigene unveränderliche Warteschlange, und wenn die Größe der einzigen veränderlichen MemTableDatei der MemTable den Schwellenwert erreicht, wird sie in die unveränderliche Warteschlange aufgenommen. Ein Hintergrund-Thread, der für ToImmutable verantwortlich ist, zieht regelmäßig alle MemTableFiles aus der von MemTable verwalteten unveränderlichen Warteschlange und sendet sie an die gesamte unveränderliche Warteschlange. Es ist zu beachten, dass die beiden Vorgänge des Schreibens von Daten in den Speicher und des Änderns der Daten im Speicher in einen Zustand, der nicht geschrieben werden kann, nicht gleichzeitig erfolgen können, und dass eine gemeinsame Sperre erforderlich ist. Der Vorgang von ToImmutable ist jedoch sehr einfach und verursacht fast keine Verzögerung, so dass die Auswirkungen auf die Leistung der eingefügten Daten minimal sind.</p>
<p>Der nächste Schritt ist die Serialisierung der MemTableFile in der Serialisierungswarteschlange auf der Festplatte. Dies ist hauptsächlich in drei Schritte unterteilt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>Zunächst holt der Hintergrund-Serialisierungs-Thread regelmäßig MemTableFile aus der unveränderlichen Warteschlange. Anschließend werden sie in Rohdateien fester Größe (Raw TableFiles) serialisiert. Schließlich werden diese Informationen in den Metadaten gespeichert. Wenn wir eine Vektorsuche durchführen, werden wir die entsprechende TableFile in den Metadaten abfragen. Von hier aus können diese Daten durchsucht werden!</p>
<p>Außerdem wird der Serialisierungs-Thread nach Abschluss eines Serialisierungszyklus entsprechend der eingestellten index_file_size einige TableFiles mit fester Größe zu einer TableFile zusammenführen und auch diese Informationen in den Metadaten aufzeichnen. Zu diesem Zeitpunkt kann die TableFile indiziert werden. Der Indexaufbau erfolgt ebenfalls asynchron. Ein anderer Hintergrund-Thread, der für den Indexaufbau zuständig ist, liest regelmäßig die TableFile im ToIndex-Status der Metadaten, um den entsprechenden Indexaufbau durchzuführen.</p>
<h2 id="Vector-search" class="common-anchor-header">Vektorsuche<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Sie werden feststellen, dass die Vektorsuche mit Hilfe von TableFile und Metadaten intuitiver und bequemer wird. Im Allgemeinen müssen wir die TableFiles, die der abgefragten Collection entsprechen, aus den Metadaten holen, in jeder TableFile suchen und schließlich zusammenführen. In diesem Artikel gehen wir nicht auf die spezifische Implementierung der Suche ein.</p>
<p>Wenn Sie mehr wissen wollen, lesen Sie bitte unseren Quellcode oder unsere anderen technischen Artikel über Milvus!</p>
