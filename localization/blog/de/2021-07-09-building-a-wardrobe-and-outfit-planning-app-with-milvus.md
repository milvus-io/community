---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: System-Übersicht
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Entdecken Sie, wie Milvus, eine Open-Source-Vektordatenbank, von Mozat für
  eine Mode-App verwendet wird, die personalisierte Stilempfehlungen und ein
  Bildsuchsystem bietet.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Erstellung einer App zur Kleiderschrank- und Outfitplanung mit Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p><a href="http://www.mozat.com/home">Mozat</a> wurde 2003 gegründet und ist ein Start-up-Unternehmen mit Hauptsitz in Singapur und Niederlassungen in China und Saudi-Arabien. Das Unternehmen hat sich auf die Entwicklung von Social-Media-, Kommunikations- und Lifestyle-Anwendungen spezialisiert. <a href="https://stylepedia.com/">Stylepedia</a> ist eine von Mozat entwickelte Kleiderschrank-App, die den Nutzern hilft, neue Stile zu entdecken und sich mit anderen Modebegeisterten zu vernetzen. Zu den wichtigsten Funktionen gehören die Möglichkeit, einen digitalen Kleiderschrank anzulegen, personalisierte Stilempfehlungen, Social-Media-Funktionen und eine Bildersuche, um ähnliche Artikel zu finden, wie man sie online oder im echten Leben gesehen hat.</p>
<p><a href="https://milvus.io">Milvus</a> wird verwendet, um das Bildsuchsystem in Stylepedia zu betreiben. Die App verarbeitet drei Bildtypen: Benutzerbilder, Produktbilder und Modefotos. Jedes Bild kann ein oder mehrere Elemente enthalten, was jede Abfrage noch komplizierter macht. Um nützlich zu sein, muss ein Bildsuchsystem genau, schnell und stabil sein. Diese Eigenschaften bilden eine solide technische Grundlage für die Erweiterung der App um neue Funktionen wie Outfitvorschläge und Empfehlungen für Modeinhalte.</p>
<h2 id="System-overview" class="common-anchor-header">System-Übersicht<button data-href="#System-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-system-prozess.png</span> </span></p>
<p>Das Bildsuchsystem ist in eine Offline- und eine Online-Komponente unterteilt.</p>
<p>Offline werden die Bilder vektorisiert und in eine Vektordatenbank (Milvus) eingefügt. Im Daten-Workflow werden relevante Produktbilder und Modefotos mit Hilfe von Objekterkennungs- und Merkmalsextraktionsmodellen in 512-dimensionale Merkmalsvektoren umgewandelt. Die Vektordaten werden dann indiziert und in die Vektordatenbank eingefügt.</p>
<p>Online wird die Bilddatenbank abgefragt und ähnliche Bilder werden dem Nutzer zurückgegeben. Ähnlich wie bei der Offline-Komponente wird ein abgefragtes Bild mit Objekterkennungs- und Merkmalsextraktionsmodellen verarbeitet, um einen Merkmalsvektor zu erhalten. Anhand des Merkmalsvektors sucht Milvus nach ähnlichen TopK-Vektoren und ermittelt die entsprechenden Bild-IDs. Nach der Nachbearbeitung (Filterung, Sortierung usw.) wird schließlich eine Sammlung von Bildern zurückgegeben, die dem abgefragten Bild ähnlich sind.</p>
<h2 id="Implementation" class="common-anchor-header">Implementierung<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Implementierung gliedert sich in vier Module:</p>
<ol>
<li>Erkennung von Kleidungsstücken</li>
<li>Merkmalsextraktion</li>
<li>Vektorielle Ähnlichkeitssuche</li>
<li>Nachbearbeitung</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Erkennung von Kleidungsstücken</h3><p>Im Modul für die Erkennung von Kleidungsstücken wird <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, ein einstufiges, ankerbasiertes Zielerkennungsmodell, als Objekterkennungsmodell verwendet, da es sehr klein ist und in Echtzeit funktioniert. Es bietet vier Modellgrößen (YOLOv5s/m/l/x), wobei jede spezifische Größe Vor- und Nachteile hat. Die größeren Modelle sind leistungsfähiger (höhere Genauigkeit), benötigen aber viel mehr Rechenleistung und laufen langsamer. Da es sich in diesem Fall um relativ große und leicht zu erkennende Objekte handelt, ist das kleinste Modell, YOLOv5s, ausreichend.</p>
<p>Die Kleidungsstücke in jedem Bild werden erkannt und ausgeschnitten, um als Input für das Modell zur Merkmalsextraktion zu dienen, das in der nachfolgenden Verarbeitung verwendet wird. Gleichzeitig sagt das Objekterkennungsmodell auch die Klassifizierung der Kleidungsstücke nach vordefinierten Klassen (Oberteile, Oberbekleidung, Hosen, Röcke, Kleider und Strampler) voraus.</p>
<h3 id="Feature-extraction" class="common-anchor-header">Merkmalsextraktion</h3><p>Der Schlüssel zur Ähnlichkeitssuche ist das Modell zur Merkmalsextraktion. Ausgeschnittene Bilder von Kleidungsstücken werden in 512-dimensionale Fließkomma-Vektoren eingebettet, die ihre Attribute in einem maschinenlesbaren numerischen Datenformat darstellen. Die Methodik des <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">tiefen metrischen Lernens (DML)</a> wird mit <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> als Backbone-Modell eingesetzt.</p>
<p>Metrisches Lernen zielt darauf ab, ein CNN-basiertes nichtlineares Merkmalsextraktionsmodul (oder einen Encoder) zu trainieren, um den Abstand zwischen den Merkmalsvektoren, die der gleichen Klasse von Proben entsprechen, zu verringern und den Abstand zwischen den Merkmalsvektoren, die verschiedenen Klassen von Proben entsprechen, zu vergrößern. In diesem Szenario bezieht sich die gleiche Klasse von Mustern auf das gleiche Kleidungsstück.</p>
<p>EfficientNet berücksichtigt bei der einheitlichen Skalierung von Netzwerkbreite, -tiefe und -auflösung sowohl Geschwindigkeit als auch Präzision. EfficientNet-B4 wird als Netzwerk zur Merkmalsextraktion verwendet, und die Ausgabe der letzten vollständig verknüpften Schicht sind die Bildmerkmale, die zur Durchführung der Vektorähnlichkeitssuche benötigt werden.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Vektorielle Ähnlichkeitssuche</h3><p>Milvus ist eine Open-Source-Vektordatenbank, die das Erstellen, Lesen, Aktualisieren und Löschen (CRUD) von Datensätzen mit einer Größe von einer Billion Byte sowie die Suche in nahezu Echtzeit unterstützt. In Stylepedia wird sie für die groß angelegte Vektorähnlichkeitssuche verwendet, da sie äußerst elastisch, stabil, zuverlässig und blitzschnell ist. Milvus erweitert die Fähigkeiten weit verbreiteter Vektorindexbibliotheken (Faiss, NMSLIB, Annoy usw.) und bietet eine Reihe einfacher und intuitiver APIs, mit denen Benutzer den idealen Indextyp für ein bestimmtes Szenario auswählen können.</p>
<p>Angesichts der Anforderungen des Szenarios und des Datenumfangs verwendeten die Stylepedia-Entwickler die CPU-only-Distribution von Milvus in Kombination mit dem HNSW-Index. Zwei indizierte Sammlungen, eine für Produkte und eine für Modefotografien, wurden erstellt, um verschiedene Anwendungsfunktionalitäten zu unterstützen. Jede Sammlung wird auf der Grundlage der Erkennungs- und Klassifizierungsergebnisse in sechs Partitionen unterteilt, um den Suchbereich einzugrenzen. Milvus führt die Suche auf mehreren Millionen Vektoren in Millisekunden durch und bietet so eine optimale Leistung, während die Entwicklungskosten niedrig gehalten und der Ressourcenverbrauch minimiert werden.</p>
<h3 id="Post-processing" class="common-anchor-header">Nachbearbeitung</h3><p>Um die Ähnlichkeit zwischen den Ergebnissen der Bildsuche und dem gesuchten Bild zu verbessern, verwenden wir Farbfilter und Filter für Schlüsselbegriffe (Ärmellänge, Kleidungslänge, Kragenform usw.), um ungeeignete Bilder herauszufiltern. Darüber hinaus wird ein Algorithmus zur Bewertung der Bildqualität verwendet, um sicherzustellen, dass den Nutzern zuerst die qualitativ besseren Bilder präsentiert werden.</p>
<h2 id="Application" class="common-anchor-header">Anwendung<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Benutzer-Uploads und Bildsuche</h3><p>Die Benutzer können Bilder ihrer eigenen Kleidung machen und sie in ihren digitalen Kleiderschrank bei Stylepedia hochladen, um dann die Produktbilder abzurufen, die ihren hochgeladenen Bildern am ähnlichsten sind.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-suche-ergebnisse.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Outfit-Vorschläge</h3><p>Durch eine Ähnlichkeitssuche in der Stylepedia-Datenbank können die Nutzer Modefotos finden, die ein bestimmtes Kleidungsstück enthalten. Dabei kann es sich um neue Kleidungsstücke handeln, die jemand kaufen möchte, oder um etwas aus der eigenen Kollektion, das anders getragen oder kombiniert werden könnte. Durch die Gruppierung der Artikel, mit denen sie häufig kombiniert werden, werden dann Outfitvorschläge generiert. So kann beispielsweise eine schwarze Bikerjacke mit einer Vielzahl von Kleidungsstücken kombiniert werden, etwa mit einer schwarzen Skinny Jeans. Die Nutzer können dann relevante Modefotos durchsuchen, auf denen diese Kombination in der ausgewählten Formel vorkommt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacke-schnappschuss.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Empfehlungen für Modefotos</h3><p>Auf der Grundlage des Browserverlaufs eines Nutzers, seiner Vorlieben und des Inhalts seines digitalen Kleiderschranks berechnet das System Ähnlichkeiten und bietet maßgeschneiderte Empfehlungen für Modefotos, die von Interesse sein könnten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-benutzer-kleiderschrank.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Durch die Kombination von Deep-Learning- und Computer-Vision-Methoden konnte Mozat ein schnelles, stabiles und genaues System für die Suche nach Bildähnlichkeiten entwickeln, das Milvus nutzt, um verschiedene Funktionen in der Stylepedia-App zu unterstützen.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Seien Sie kein Fremder<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagiere mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinde dich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
