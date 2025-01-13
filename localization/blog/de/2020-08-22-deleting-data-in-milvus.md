---
id: deleting-data-in-milvus.md
title: Schlusswort
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  In Milvus v0.7.0 haben wir ein völlig neues Design entwickelt, um das Löschen
  effizienter zu machen und mehr Indextypen zu unterstützen.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Wie Milvus die Löschfunktion realisiert</custom-h1><p>Dieser Artikel befasst sich damit, wie Milvus die Löschfunktion implementiert. Die Löschfunktion wurde in Milvus v0.7.0 eingeführt und von vielen Benutzern mit Spannung erwartet. Wir haben remove_ids nicht direkt in FAISS aufgerufen, sondern ein völlig neues Design entwickelt, um das Löschen effizienter zu machen und mehr Indextypen zu unterstützen.</p>
<p>In <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Wie Milvus die dynamische Datenaktualisierung und -abfrage realisiert</a>, haben wir den gesamten Prozess vom Einfügen der Daten bis zum Flush der Daten vorgestellt. Lassen Sie uns einige der Grundlagen rekapitulieren. MemManager verwaltet alle Einfügepuffer, wobei jede MemTable einer Sammlung entspricht (in Milvus v0.7.0 haben wir "Tabelle" in "Sammlung" umbenannt). Milvus unterteilt die in den Speicher eingefügten Daten automatisch in mehrere MemTableFiles. Wenn die Daten auf die Festplatte übertragen werden, wird jedes MemTableFile in eine Rohdatei serialisiert. Wir haben diese Architektur beim Entwurf der Löschfunktion beibehalten.</p>
<p>Wir definieren die Funktion der Löschmethode als das Löschen aller Daten, die den angegebenen Entity-IDs in einer bestimmten Sammlung entsprechen. Bei der Entwicklung dieser Funktion haben wir zwei Szenarien entworfen. Das erste besteht darin, die Daten zu löschen, die sich noch im Einfügepuffer befinden, und das zweite darin, die Daten zu löschen, die auf die Festplatte gespült wurden. Das erste Szenario ist intuitiver. Wir können die MemTableFile finden, die der angegebenen ID entspricht, und die Daten im Speicher direkt löschen (Abbildung 1). Da das Löschen und Einfügen von Daten nicht gleichzeitig durchgeführt werden kann und aufgrund des Mechanismus, der die MemTableFile beim Flushen von Daten von veränderlich zu unveränderlich ändert, wird das Löschen nur im veränderlichen Puffer durchgeführt. Auf diese Weise kollidiert der Löschvorgang nicht mit dem Flushen der Daten, so dass die Konsistenz der Daten gewährleistet ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-löschen-anforderung-milvus.jpg</span> </span></p>
<p>Das zweite Szenario ist komplexer, aber häufiger anzutreffen, da die Daten in den meisten Fällen kurz im Einfügepuffer verbleiben, bevor sie auf die Festplatte geschrieben werden. Da es so ineffizient ist, gespülte Daten für eine harte Löschung in den Speicher zu laden, haben wir uns für eine weiche Löschung entschieden, einen effizienteren Ansatz. Anstatt die geleerten Daten tatsächlich zu löschen, werden die gelöschten IDs in einer separaten Datei gespeichert. Auf diese Weise können wir die gelöschten IDs bei Lesevorgängen, z. B. bei der Suche, herausfiltern.</p>
<p>Bei der Implementierung sind mehrere Aspekte zu berücksichtigen. In Milvus sind Daten nur dann sichtbar oder, mit anderen Worten, wiederherstellbar, wenn sie auf die Festplatte gespült werden. Daher werden geleerte Daten nicht beim Aufruf der Delete-Methode gelöscht, sondern erst bei der nächsten Flush-Operation. Der Grund dafür ist, dass die Datendateien, die auf die Festplatte geleert wurden, keine neuen Daten mehr enthalten, so dass das sanfte Löschen keine Auswirkungen auf die geleerten Daten hat. Wenn Sie den Löschvorgang aufrufen, können Sie die Daten, die sich noch im Einfügepuffer befinden, direkt löschen, während Sie für die geleerten Daten die ID der gelöschten Daten im Speicher aufzeichnen müssen. Beim Flushen der Daten auf die Festplatte schreibt Milvus die gelöschte ID in die DEL-Datei, um festzuhalten, welche Entität im entsprechenden Segment gelöscht wurde. Diese Aktualisierungen werden erst sichtbar, wenn die Datenübertragung abgeschlossen ist. Dieser Vorgang ist in Abbildung 2 dargestellt. Vor Version 0.7.0 verfügten wir nur über einen Auto-Flush-Mechanismus, d. h. Milvus serialisiert die Daten im Einfügepuffer jede Sekunde. In unserem neuen Design haben wir eine Flush-Methode hinzugefügt, die es den Entwicklern ermöglicht, nach der Delete-Methode aufzurufen, um sicherzustellen, dass die neu eingefügten Daten sichtbar sind und die gelöschten Daten nicht mehr wiederhergestellt werden können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-löschen-anforderung-milvus.jpg</span> </span></p>
<p>Das zweite Problem besteht darin, dass die Rohdatendatei und die Indexdatei zwei separate Dateien in Milvus und zwei unabhängige Datensätze in den Metadaten sind. Wenn wir eine bestimmte ID löschen, müssen wir die Rohdatei und die Indexdatei, die dieser ID entsprechen, finden und sie zusammen aufzeichnen. Daher haben wir das Konzept des Segments eingeführt. Ein Segment enthält die Rohdatei (die die Rohvektordateien und ID-Dateien enthält), die Indexdatei und die DEL-Datei. Ein Segment ist die grundlegendste Einheit zum Lesen, Schreiben und Suchen von Vektoren in Milvus. Eine Sammlung (Abbildung 3) besteht aus mehreren Segmenten. Daher gibt es mehrere Segmentordner unter einem Sammlungsordner auf der Festplatte. Da unsere Metadaten auf relationalen Datenbanken (SQLite oder MySQL) basieren, ist es sehr einfach, die Beziehungen innerhalb eines Segments aufzuzeichnen, und der Löschvorgang erfordert keine separate Verarbeitung der Rohdatei und der Indexdatei mehr.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-Löschanforderung-milvus.jpg</span> </span></p>
<p>Das dritte Problem ist die Frage, wie gelöschte Daten bei einer Suche herausgefiltert werden können. In der Praxis ist die von DEL aufgezeichnete ID der Offset der entsprechenden im Segment gespeicherten Daten. Da das geleerte Segment keine neuen Daten enthält, wird sich der Offset nicht ändern. Die Datenstruktur von DEL ist eine Bitmap im Speicher, wobei ein aktives Bit einen gelöschten Offset darstellt. Wir haben auch FAISS entsprechend aktualisiert: Wenn Sie in FAISS suchen, wird der dem aktiven Bit entsprechende Vektor nicht mehr in die Abstandsberechnung einbezogen (Abbildung 4). Die Änderungen an FAISS werden hier nicht im Detail behandelt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-löschen-anforderung-milvus.jpg</span> </span></p>
<p>Beim letzten Punkt geht es um die Verbesserung der Leistung. Beim Löschen von gespülten Daten müssen Sie zunächst herausfinden, in welchem Segment der Sammlung sich die gelöschte ID befindet, und dann ihren Offset aufzeichnen. Der einfachste Ansatz besteht darin, alle IDs in jedem Segment zu suchen. Die Optimierung, an die wir denken, besteht darin, jedem Segment einen Bloom-Filter hinzuzufügen. Der Bloom-Filter ist eine zufällige Datenstruktur, mit der geprüft wird, ob ein Element Mitglied einer Menge ist. Daher können wir nur den Bloom-Filter jedes Segments laden. Nur wenn der Bloomfilter feststellt, dass die gelöschte ID im aktuellen Segment enthalten ist, können wir den entsprechenden Offset im Segment finden; andernfalls können wir dieses Segment ignorieren (Abbildung 5). Wir haben uns für den Bloom-Filter entschieden, weil er weniger Platz benötigt und bei der Suche effizienter ist als viele seiner Konkurrenten, z. B. Hash-Tabellen. Obwohl der Bloom-Filter eine gewisse Falsch-Positiv-Rate aufweist, können wir die zu durchsuchenden Segmente auf die ideale Anzahl reduzieren, um die Wahrscheinlichkeit anzupassen. In der Zwischenzeit muss der Bloom-Filter auch die Löschung unterstützen. Andernfalls kann die gelöschte Entitäts-ID immer noch im Bloom-Filter gefunden werden, was zu einer erhöhten Falsch-positiv-Rate führt. Aus diesem Grund verwenden wir den Zählungs-Bloomfilter, da er die Löschung unterstützt. In diesem Artikel werden wir nicht näher darauf eingehen, wie der Bloomfilter funktioniert. Wenn Sie daran interessiert sind, können Sie sich an Wikipedia wenden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-löschen-anforderung-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Schlusswort<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Bis jetzt haben wir Ihnen eine kurze Einführung gegeben, wie Milvus Vektoren nach ID löscht. Wie Sie wissen, verwenden wir Soft Deletion, um die geleerten Daten zu löschen. Da die Zahl der gelöschten Daten zunimmt, müssen wir die Segmente in der Sammlung verdichten, um den von den gelöschten Daten belegten Platz freizugeben. Wenn ein Segment bereits indiziert wurde, wird bei der Verdichtung außerdem die vorherige Indexdatei gelöscht und neue Indizes erstellt. Im Moment müssen die Entwickler die Methode compact aufrufen, um Daten zu komprimieren. Wir hoffen, in Zukunft einen Kontrollmechanismus einführen zu können. Wenn zum Beispiel die Menge der gelöschten Daten einen bestimmten Schwellenwert erreicht oder sich die Datenverteilung nach einer Löschung geändert hat, kompaktiert Milvus das Segment automatisch.</p>
<p>Nun haben wir die Designphilosophie hinter der Löschfunktion und ihre Implementierung vorgestellt. Es gibt definitiv Raum für Verbesserungen, und Ihre Kommentare und Vorschläge sind willkommen.</p>
<p>Erfahren Sie mehr über Milvus: https://github.com/milvus-io/milvus. Sie können auch unserer <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack-Community</a> für technische Diskussionen beitreten!</p>
