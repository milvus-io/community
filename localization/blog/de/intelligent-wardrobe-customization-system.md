---
id: intelligent-wardrobe-customization-system.md
title: >-
  Aufbau eines intelligenten Systems zur Anpassung der Garderobe auf der
  Grundlage der Milvus-Vektordatenbank
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Mit der Technologie der Ähnlichkeitssuche können Sie das Potenzial
  unstrukturierter Daten erschließen, sogar von Kleiderschränken und ihren
  Bestandteilen!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<p>Wenn Sie auf der Suche nach einem Kleiderschrank sind, der perfekt in Ihr Schlafzimmer oder Ihre Garderobe passt, denken die meisten Menschen sicher an Maßanfertigungen. Doch nicht jeder hat ein so großes Budget zur Verfügung. Was ist dann mit den Schränken von der Stange? Das Problem bei dieser Art von Schränken ist, dass sie höchstwahrscheinlich nicht Ihren Erwartungen entsprechen, da sie nicht flexibel genug sind, um Ihren individuellen Stauraumbedürfnissen gerecht zu werden. Außerdem ist es bei der Online-Suche ziemlich schwierig, den von Ihnen gesuchten Schranktyp in Stichworten zusammenzufassen. Es ist sehr wahrscheinlich, dass das Schlüsselwort, das Sie in das Suchfeld eingeben (z. B. Kleiderschrank mit Schmuckfach), sich von dem unterscheidet, das in der Suchmaschine eingegeben wird (z. B. Kleiderschrank mit <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">ausziehbarem Fach mit Einsatz</a>).</p>
<p>Aber dank der neuen Technologien gibt es eine Lösung! Der Möbelkonzern IKEA bietet ein beliebtes Design-Tool <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX-Kleiderschrank</a> an, mit dem die Benutzer aus einer Reihe von vorgefertigten Schränken auswählen und die Farbe, Größe und Innenausstattung der Schränke anpassen können. Ganz gleich, ob Sie Platz zum Aufhängen, mehrere Einlegeböden oder Innenschubladen benötigen, dieses intelligente System zur individuellen Gestaltung von Kleiderschränken kann immer auf Ihre Bedürfnisse eingehen.</p>
<p>Um mit diesem intelligenten Schranksystem Ihren idealen Kleiderschrank zu finden oder zu bauen, müssen Sie:</p>
<ol>
<li>Geben Sie die Grundanforderungen an - die Form (normal, L- oder U-förmig), Länge und Tiefe des Schranks.</li>
<li>Bestimmen Sie Ihren Stauraumbedarf und die Inneneinteilung des Schranks (z.B. Hängefläche, ausziehbarer Hosenständer, etc. wird benötigt).</li>
<li>Fügen Sie Teile des Schranks wie Schubladen oder Einlegeböden hinzu oder entfernen Sie sie.</li>
</ol>
<p>Dann ist Ihr Entwurf fertig. Einfach und leicht!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>pax-System</span> </span></p>
<p>Eine sehr wichtige Komponente, die ein solches Garderobensystem möglich macht, ist die <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a>. In diesem Artikel werden daher der Arbeitsablauf und die Lösungen für die Ähnlichkeitssuche vorgestellt, die für den Aufbau eines intelligenten Systems zur Anpassung von Kleiderschränken auf der Grundlage der Vektorähnlichkeitssuche verwendet werden.</p>
<p>Springe zu:</p>
<ul>
<li><a href="#System-overview">System-Übersicht</a></li>
<li><a href="#Data-flow">Datenfluss</a></li>
<li><a href="#System-demo">System-Demo</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">System-Übersicht<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Um ein solches intelligentes Tool zur Anpassung von Kleiderschränken zu entwickeln, müssen wir zunächst die Geschäftslogik definieren und die Attribute der Artikel und die Benutzerführung verstehen. Kleiderschränke und ihre Komponenten wie Schubladen, Fächer und Regale sind allesamt unstrukturierte Daten. Daher besteht der zweite Schritt darin, KI-Algorithmen und -Regeln, Vorwissen, Artikelbeschreibungen und vieles mehr zu nutzen, um diese unstrukturierten Daten in eine Art von Daten zu konvertieren, die von Computern verstanden werden können - Vektoren!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Überblick über das Anpassungswerkzeug</span> </span></p>
<p>Mit den generierten Vektoren benötigen wir leistungsfähige Vektordatenbanken und Suchmaschinen, um sie zu verarbeiten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>Tool-Architektur</span> </span></p>
<p>Das Anpassungswerkzeug nutzt einige der beliebtesten Suchmaschinen und Datenbanken: Elasticsearch, <a href="https://milvus.io/">Milvus</a> und PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Warum Milvus?</h3><p>Eine Garderobenkomponente enthält hochkomplexe Informationen, wie Farbe, Form, Inneneinteilung usw. Die herkömmliche Speicherung von Garderobendaten in einer relationalen Datenbank reicht jedoch bei weitem nicht aus. Ein beliebter Weg ist die Verwendung von Einbettungstechniken, um Garderoben in Vektoren umzuwandeln. Daher müssen wir nach einer neuen Art von Datenbank suchen, die speziell für die Speicherung von Vektoren und die Ähnlichkeitssuche entwickelt wurde. Nach Prüfung mehrerer gängiger Lösungen wurde die <a href="https://github.com/milvus-io/milvus">Milvus-Vektordatenbank</a> aufgrund ihrer hervorragenden Leistung, Stabilität, Kompatibilität und Benutzerfreundlichkeit ausgewählt. Die nachstehende Tabelle ist ein Vergleich mehrerer gängiger Lösungen für die Vektorsuche.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>Lösungsvergleich</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">System Arbeitsablauf</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Arbeitsablauf des Systems</span> </span></p>
<p>Elasticsearch wird für eine grobe Filterung nach Kleiderschrankgröße, Farbe usw. verwendet. Dann durchlaufen die gefilterten Ergebnisse die Vektordatenbank Milvus für eine Ähnlichkeitssuche, und die Ergebnisse werden auf der Grundlage ihres Abstands/ihrer Ähnlichkeit mit dem Abfragevektor eingestuft. Schließlich werden die Ergebnisse konsolidiert und auf der Grundlage von Geschäftserkenntnissen weiter verfeinert.</p>
<h2 id="Data-flow" class="common-anchor-header">Datenfluss<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Das System zur Anpassung des Kleiderschranks ist herkömmlichen Suchmaschinen und Empfehlungssystemen sehr ähnlich. Es besteht aus drei Teilen:</p>
<ul>
<li>Offline-Datenaufbereitung einschließlich Datendefinition und -generierung.</li>
<li>Online-Dienste, einschließlich Abruf und Ranking.</li>
<li>Nachbearbeitung der Daten auf der Grundlage der Geschäftslogik.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Datenfluss</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Offline-Datenfluss</h3><ol>
<li>Definieren Sie Daten anhand von Geschäftskenntnissen.</li>
<li>Nutzung von Vorwissen, um zu definieren, wie verschiedene Komponenten kombiniert und zu einem Kleiderschrank zusammengestellt werden können.</li>
<li>Erkennen der Merkmalsbezeichnungen der Kleiderschränke und Kodierung der Merkmale in Elasticsearch-Daten in der Datei <code translate="no">.json</code>.</li>
<li>Bereiten Sie Rückrufdaten vor, indem Sie unstrukturierte Daten in Vektoren kodieren.</li>
<li>Verwenden Sie die Vektordatenbank Milvus, um die im vorherigen Schritt erhaltenen Abrufergebnisse zu ordnen.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>Offline-Datenfluss</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Online-Datenfluss</h3><ol>
<li>Entgegennahme von Abfrageanfragen von Benutzern und Sammlung von Benutzerprofilen.</li>
<li>Verstehen der Benutzeranfrage durch Identifizierung ihrer Anforderungen an den Kleiderschrank.</li>
<li>Grobsuche mit Elasticsearch.</li>
<li>Bewertung und Rangfolge der Ergebnisse aus der Grobsuche auf der Grundlage der Berechnung der Vektorähnlichkeit in Milvus.</li>
<li>Nachbearbeitung und Organisation der Ergebnisse auf der Back-End-Plattform, um die endgültigen Ergebnisse zu generieren.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>Online-Datenfluss</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Nachbearbeitung der Daten</h3><p>Die Geschäftslogik ist von Unternehmen zu Unternehmen unterschiedlich. Sie können den Ergebnissen einen letzten Schliff geben, indem Sie die Geschäftslogik Ihres Unternehmens anwenden.</p>
<h2 id="System-demo" class="common-anchor-header">System-Demo<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Sehen wir uns nun an, wie das von uns entwickelte System tatsächlich funktioniert.</p>
<p>Die Benutzeroberfläche (UI) zeigt die verschiedenen Kombinationsmöglichkeiten der Garderobenkomponenten an.</p>
<p>Jede Komponente wird durch ihr Merkmal (Größe, Farbe usw.) gekennzeichnet und in Elasticsearch (ES) gespeichert. Bei der Speicherung der Etiketten in ES müssen vier Hauptdatenfelder ausgefüllt werden: ID, Tags, Speicherpfad und andere Hilfsfelder. ES und die beschrifteten Daten werden für den granularen Abruf und die Attributfilterung verwendet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Dann werden verschiedene KI-Algorithmen verwendet, um eine Garderobe in einen Satz von Vektoren zu kodieren. Die Vektorsätze werden in Milvus für die Ähnlichkeitssuche und das Ranking gespeichert. Dieser Schritt liefert verfeinerte und genauere Ergebnisse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus und andere Systemkomponenten bilden zusammen die Designplattform für die Anpassung als Ganzes. Die domänenspezifische Sprache (DSL) in Elasticsearch und Milvus sieht wie folgt aus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Suchen Sie nach weiteren Ressourcen?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Erfahren Sie, wie die Milvus-Vektordatenbank mehr KI-Anwendungen unterstützen kann:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Wie die Kurzvideo-Plattform Likee mit Milvus doppelte Videos entfernt</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Der Fotobetrugsdetektor auf Basis von Milvus</a></li>
</ul>
