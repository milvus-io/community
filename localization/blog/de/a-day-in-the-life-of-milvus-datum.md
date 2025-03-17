---
id: a-day-in-the-life-of-milvus-datum.md
title: Ein Tag im Leben eines Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: >-
  Machen wir also einen Spaziergang durch einen Tag im Leben von Dave, dem
  Milvus-Datum.
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Der Aufbau einer leistungsfähigen <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> wie Milvus, die sich auf Milliarden von Vektoren skalieren lässt und den Datenverkehr im Web bewältigt, ist keine einfache Aufgabe. Es erfordert den sorgfältigen, intelligenten Entwurf eines verteilten Systems. Bei den Interna eines solchen Systems muss zwangsläufig ein Kompromiss zwischen Leistung und Einfachheit gefunden werden.</p>
<p>Während wir versucht haben, diesen Kompromiss gut auszubalancieren, sind einige Aspekte der Interna undurchsichtig geblieben. In diesem Artikel soll das Geheimnis gelüftet werden, wie Milvus die Dateneinfügung, die Indizierung und die Bereitstellung auf den einzelnen Knoten aufteilt. Diese Prozesse auf hohem Niveau zu verstehen, ist für eine effektive Optimierung der Abfrageleistung, der Systemstabilität und der Fehlersuche von entscheidender Bedeutung.</p>
<p>Lassen Sie uns also einen Spaziergang durch einen Tag im Leben von Dave, dem Milvus-Datum, machen. Stellen Sie sich vor, Sie fügen Dave in Ihre Sammlung in einer <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">verteilten Milvus-Bereitstellung</a> ein (siehe das Diagramm unten). Soweit es Sie betrifft, wird er direkt in die Sammlung aufgenommen. Hinter den Kulissen finden jedoch viele Schritte in unabhängigen Subsystemen statt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Proxy-Knoten und die Nachrichtenwarteschlange<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Zunächst rufen Sie das MilvusClient-Objekt auf, z. B. über die PyMilvus-Bibliothek, und senden eine <code translate="no">_insert()</code>_ Anfrage an einen <em>Proxy-Knoten</em>. Proxy-Knoten sind die Schnittstelle zwischen dem Benutzer und dem Datenbanksystem und führen Vorgänge wie den Lastausgleich bei eingehendem Datenverkehr und die Zusammenführung mehrerer Ausgaben durch, bevor sie an den Benutzer zurückgegeben werden.</p>
<p>Eine Hash-Funktion wird auf den Primärschlüssel des Objekts angewendet, um festzustellen, an welchen <em>Kanal</em> es gesendet werden soll. Kanäle, die entweder mit Pulsar- oder Kafka-Themen implementiert werden, sind ein Sammelbecken für Streaming-Daten, die dann an die Abonnenten des Kanals weitergeleitet werden können.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Datenknoten, Segmente und Chunks<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nachdem die Daten an den entsprechenden Kanal gesendet wurden, sendet der Kanal sie an das entsprechende Segment im <em>Datenknoten</em>. Datenknoten sind für die Speicherung und Verwaltung von Datenpuffern zuständig, die als <em>wachsende Segmente</em> bezeichnet werden. Es gibt ein wachsendes Segment pro Shard.</p>
<p>Wenn Daten in ein Segment eingefügt werden, wächst das Segment bis zu einer maximalen Größe, die standardmäßig bei 122 MB liegt. Während dieser Zeit werden kleinere Teile des Segments, die standardmäßig 16 MB groß sind und als <em>Chunks</em> bezeichnet werden, in den permanenten Speicher verschoben, z. B. mit S3 von AWS oder einem anderen kompatiblen Speicher wie MinIO. Jeder Chunk ist eine physische Datei auf dem Objektspeicher und für jedes Feld gibt es eine eigene Datei. Die obige Abbildung veranschaulicht die Dateihierarchie im Objektspeicher.</p>
<p>Zusammenfassend kann man sagen, dass die Daten einer Sammlung auf Datenknoten aufgeteilt werden, innerhalb derer sie in Segmente für die Pufferung aufgeteilt werden, die wiederum in Chunks pro Feld für die dauerhafte Speicherung aufgeteilt werden. Die beiden obigen Diagramme machen dies deutlicher. Durch diese Aufteilung der eingehenden Daten können wir die Parallelität von Netzwerkbandbreite, Rechenleistung und Speicherplatz im Cluster voll ausschöpfen.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Versiegeln, Zusammenführen und Verdichten von Segmenten<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bisher haben wir die Geschichte erzählt, wie unser freundliches Datum Dave seinen Weg von einer <code translate="no">_insert()</code>_ Abfrage in den persistenten Speicher findet. Natürlich ist seine Geschichte damit noch nicht zu Ende. Es gibt weitere Schritte, um den Such- und Indizierungsprozess effizienter zu gestalten. Durch die Verwaltung der Größe und Anzahl der Segmente nutzt das System die Parallelität des Clusters voll aus.</p>
<p>Sobald ein Segment seine maximale Größe auf einem Datenknoten erreicht, standardmäßig 122 MB, wird es als <em>versiegelt</em> bezeichnet. Das bedeutet, dass der Puffer auf dem Datenknoten geleert wird, um Platz für ein neues Segment zu schaffen, und die entsprechenden Chunks im persistenten Speicher als zu einem geschlossenen Segment gehörig markiert werden.</p>
<p>Die Datenknoten suchen in regelmäßigen Abständen nach kleineren versiegelten Segmenten und fügen sie zu größeren zusammen, bis sie eine maximale Größe von 1 GB (standardmäßig) pro Segment erreicht haben. Wenn ein Objekt in Milvus gelöscht wird, wird es einfach mit einem Löschkennzeichen versehen - man kann es sich wie die Todeszelle für Dave vorstellen. Wenn die Anzahl der gelöschten Elemente in einem Segment einen bestimmten Schwellenwert überschreitet (standardmäßig 20 %), wird das Segment verkleinert, was wir als <em>Verdichtung</em> bezeichnen.</p>
<p>Indizierung und Suche in Segmenten</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Es gibt einen zusätzlichen Knotentyp, den <em>Indexknoten</em>, der für die Erstellung von Indizes für versiegelte Segmente zuständig ist. Wenn das Segment versiegelt ist, sendet der Datenknoten eine Anforderung an einen Indexknoten, um einen Index zu erstellen. Der Indexknoten sendet dann den fertigen Index an den Objektspeicher. Jedes versiegelte Segment hat seinen eigenen Index, der in einer separaten Datei gespeichert wird. Sie können diese Datei manuell untersuchen, indem Sie auf den Bucket zugreifen - siehe die Abbildung oben für die Dateihierarchie.</p>
<p>Abfrageknoten - nicht nur Datenknoten - abonnieren die Themen der Nachrichtenwarteschlangen für die entsprechenden Shards. Die wachsenden Segmente werden auf die Abfrageknoten repliziert, und der Knoten lädt bei Bedarf versiegelte Segmente, die zur Sammlung gehören, in den Speicher. Er erstellt einen Index für jedes wachsende Segment, wenn Daten eintreffen, und lädt die fertigen Indizes für versiegelte Segmente aus dem Datenspeicher.</p>
<p>Stellen Sie sich nun vor, Sie rufen das MilvusClient-Objekt mit einer <em>search()-Anfrage</em> auf, die Dave umfasst. Nachdem die Anfrage über den Proxy-Knoten an alle Abfrageknoten weitergeleitet wurde, führt jeder Abfrageknoten eine Vektorähnlichkeitssuche (oder eine andere der Suchmethoden wie Abfrage, Bereichssuche oder Gruppierungssuche) durch und iteriert dabei über die Segmente, eines nach dem anderen. Die Ergebnisse werden über die Knoten hinweg in einer MapReduce-ähnlichen Weise zusammengefasst und an den Benutzer zurückgeschickt, wobei Dave sich freut, endlich wieder mit Ihnen vereint zu sein.</p>
<h2 id="Discussion" class="common-anchor-header">Diskussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben einen Tag im Leben von Dave, dem Datum, sowohl für die Operationen <code translate="no">_insert()</code>_ als auch <code translate="no">_search()</code>_ behandelt. Andere Operationen wie <code translate="no">_delete()</code>_ und <code translate="no">_upsert()</code>_ funktionieren auf ähnliche Weise. Es ist unvermeidlich, dass wir unsere Diskussion vereinfachen und feinere Details auslassen mussten. Im Großen und Ganzen sollten Sie jetzt jedoch ein ausreichendes Bild davon haben, wie Milvus für die Parallelität über Knoten in einem verteilten System hinweg ausgelegt ist, um robust und effizient zu sein, und wie Sie dies für die Optimierung und Fehlersuche nutzen können.</p>
<p><em>Eine wichtige Erkenntnis aus diesem Artikel: Milvus wurde mit einer Trennung der Belange über die verschiedenen Knotentypen hinweg entwickelt. Jeder Knotentyp hat eine spezifische, sich gegenseitig ausschließende Funktion, und es gibt eine Trennung von Speicher und Rechenleistung.</em> Das Ergebnis ist, dass jede Komponente unabhängig skaliert werden kann, wobei die Parameter je nach Anwendungsfall und Datenverkehrsmuster angepasst werden können. So können Sie beispielsweise die Anzahl der Abfrageknoten skalieren, um einen erhöhten Datenverkehr zu bewältigen, ohne die Daten- und Indexknoten zu skalieren. Dank dieser Flexibilität gibt es Milvus-Benutzer, die Milliarden von Vektoren verarbeiten und Datenverkehr im Webmaßstab mit einer Abfragelatenz von unter 100 ms bedienen.</p>
<p>Mit <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, einem vollständig verwalteten Service von Milvus, können Sie die Vorteile des verteilten Designs von Milvus auch ohne die Bereitstellung eines verteilten Clusters nutzen. <a href="https://cloud.zilliz.com/signup">Melden Sie sich noch heute für die kostenlose Version von Zilliz Cloud an und setzen Sie Dave in die Tat um!</a></p>
