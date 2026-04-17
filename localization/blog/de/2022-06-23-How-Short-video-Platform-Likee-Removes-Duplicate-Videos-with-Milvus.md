---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: Wie die Kurzvideoplattform Likee mit Milvus doppelte Videos entfernt
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Likee Milvus nutzt, um doppelte Videos in Millisekunden zu
  identifizieren.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von Xinyang Guo und Baoyu Han, Ingenieure bei BIGO, geschrieben und von <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a> übersetzt.</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a> (BIGO) ist eines der am schnellsten wachsenden Technologieunternehmen in Singapur. Die auf künstlicher Intelligenz basierenden Produkte und Dienstleistungen von BIGO erfreuen sich weltweit großer Beliebtheit und haben über 400 Millionen Nutzer in mehr als 150 Ländern. Dazu gehören <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (Live-Streaming) und <a href="https://likee.video/">Likee</a> (Kurzvideos).</p>
<p>Likee ist eine globale Plattform zur Erstellung von Kurzvideos, auf der Nutzer ihre Momente teilen, sich selbst ausdrücken und mit der Welt in Verbindung treten können. Um die Nutzererfahrung zu verbessern und den Nutzern qualitativ hochwertigere Inhalte zu empfehlen, muss Likee doppelte Videos aus der enormen Menge der täglich von den Nutzern erstellten Videos aussortieren, was keine einfache Aufgabe darstellt.</p>
<p>In diesem Blog wird vorgestellt, wie BIGO <a href="https://milvus.io">Milvus</a>, eine Open-Source-Vektordatenbank, verwendet, um doppelte Videos effektiv zu entfernen.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#Overview">Übersicht</a></li>
<li><a href="#Video-deduplication-workflow">Arbeitsablauf der Videodeduplizierung</a></li>
<li><a href="#System-architecture">System-Architektur</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Verwendung von Milvus für die Ähnlichkeitssuche</a></li>
</ul>
<custom-h1>Überblick</custom-h1><p>Milvus ist eine Open-Source-Vektordatenbank, die eine ultraschnelle Vektorsuche ermöglicht. Mit Milvus ist Likee in der Lage, eine Suche innerhalb von 200 ms abzuschließen und gleichzeitig eine hohe Wiederfindungsrate zu gewährleisten. Durch die <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">horizontale Skalierung von Milvus</a> kann Likee den Durchsatz von Vektorabfragen erhöhen und so seine Effizienz weiter steigern.</p>
<custom-h1>Arbeitsablauf der Videodeduplizierung</custom-h1><p>Wie identifiziert Likee doppelte Videos? Jedes Mal, wenn ein abgefragtes Video in das Likee-System eingegeben wird, wird es in 15-20 Einzelbilder zerlegt und jedes Einzelbild wird in einen Merkmalsvektor umgewandelt. Dann durchsucht Likee eine Datenbank mit 700 Millionen Vektoren, um die K ähnlichsten Vektoren zu finden. Jeder der K Spitzenvektoren entspricht einem Video in der Datenbank. Likee führt weitere Suchvorgänge durch, um die endgültigen Ergebnisse zu erhalten und die zu entfernenden Videos zu bestimmen.</p>
<custom-h1>Aufbau des Systems</custom-h1><p>Schauen wir uns genauer an, wie das Video-Deduplizierungssystem von Likee mit Milvus funktioniert. Wie im folgenden Diagramm dargestellt, werden neue Videos, die auf Likee hochgeladen werden, in Echtzeit in Kafka, ein Datenspeichersystem, geschrieben und von Kafka-Konsumenten konsumiert. Die Merkmalsvektoren dieser Videos werden durch Deep-Learning-Modelle extrahiert, wobei unstrukturierte Daten (Videos) in Merkmalsvektoren umgewandelt werden. Diese Merkmalsvektoren werden vom System verpackt und an den Ähnlichkeitsprüfer gesendet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Architektur des Video-Deduplizierungssystems von Likee</span> </span></p>
<p>Die extrahierten Merkmalsvektoren werden von Milvus indiziert und in Ceph gespeichert, bevor sie <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">vom Milvus-Abfrageknoten</a> zur weiteren Suche <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">geladen</a> werden. Die entsprechenden Video-IDs dieser Merkmalsvektoren werden je nach Bedarf auch gleichzeitig in TiDB oder Pika gespeichert.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Verwendung der Milvus-Vektordatenbank für die Ähnlichkeitssuche</h3><p>Bei der Suche nach ähnlichen Vektoren stellen Milliarden vorhandener Daten sowie große Mengen neuer Daten, die täglich generiert werden, eine große Herausforderung für die Funktionalität der Vektorsuchmaschine dar. Nach einer gründlichen Analyse entschied sich Likee schließlich für Milvus, eine verteilte Vektorsuchmaschine mit hoher Leistung und hoher Wiedererkennungsrate, um die Ähnlichkeitssuche durchzuführen.</p>
<p>Wie im folgenden Diagramm dargestellt, läuft eine Ähnlichkeitssuche wie folgt ab:</p>
<ol>
<li><p>Zunächst führt Milvus eine Stapelsuche durch, um die 100 ähnlichsten Vektoren für jeden der mehreren Merkmalsvektoren, die aus einem neuen Video extrahiert wurden, abzurufen. Jeder ähnliche Vektor ist an die entsprechende Video-ID gebunden.</p></li>
<li><p>Zweitens entfernt Milvus durch den Vergleich der Video-IDs die doppelten Videos und ruft die Merkmalsvektoren der verbleibenden Videos aus TiDB oder Pika ab.</p></li>
<li><p>Schließlich berechnet und bewertet Milvus die Ähnlichkeit zwischen jedem Satz der abgerufenen Feature-Vektoren und den Feature-Vektoren des Abfragevideos. Die Video-ID mit der höchsten Punktzahl wird als Ergebnis zurückgegeben. Damit ist die Ähnlichkeitssuche nach Videos abgeschlossen.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Vorgehensweise bei einer Ähnlichkeitssuche</span> </span></p>
<p>Als leistungsstarke Vektorsuchmaschine hat Milvus im Video-Deduplizierungssystem von Likee hervorragende Arbeit geleistet und das Wachstum des Kurzvideo-Geschäfts von BIGO erheblich gefördert. In Bezug auf das Videogeschäft gibt es viele andere Szenarien, in denen Milvus eingesetzt werden kann, wie z. B. das Sperren illegaler Inhalte oder personalisierte Videoempfehlungen. Sowohl BIGO als auch Milvus freuen sich auf die zukünftige Zusammenarbeit in weiteren Bereichen.</p>
