---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Verständnis der Konsistenzebene in der Milvus-Vektordatenbank
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Lernen Sie die vier Konsistenzstufen - strong, bounded staleness, session und
  eventual - kennen, die von der Milvus-Vektordatenbank unterstützt werden.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_Bild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/JackLCL">Chenglong Li</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgesetzt.</p>
</blockquote>
<p>Haben Sie sich jemals gefragt, warum manchmal die Daten, die Sie aus der Mlivus-Vektordatenbank gelöscht haben, immer noch in den Suchergebnissen erscheinen?</p>
<p>Ein sehr wahrscheinlicher Grund ist, dass Sie nicht die richtige Konsistenzstufe für Ihre Anwendung eingestellt haben. Die Konsistenzstufe in einer verteilten Vektordatenbank ist von entscheidender Bedeutung, da sie bestimmt, zu welchem Zeitpunkt ein bestimmter Dateneintrag vom System gelesen werden kann.</p>
<p>In diesem Artikel soll daher das Konzept der Konsistenz entmystifiziert und die von der Milvus-Vektordatenbank unterstützten Konsistenzstufen näher erläutert werden.</p>
<p><strong>Sprung zu:</strong></p>
<ul>
<li><a href="#What-is-consistency">Was ist Konsistenz?</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Vier Konsistenzstufen in der Milvus-Vektordatenbank</a><ul>
<li><a href="#Strong">Stark</a></li>
<li><a href="#Bounded-staleness">Begrenzte Unbeständigkeit</a></li>
<li><a href="#Session">Sitzung</a></li>
<li><a href="#Eventual">Eventuell</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">Was ist Konsistenz?<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir beginnen, müssen wir zunächst die Bedeutung von Konsistenz in diesem Artikel klären, da das Wort "Konsistenz" in der Computerbranche ein überladener Begriff ist. Konsistenz in einer verteilten Datenbank bezieht sich speziell auf die Eigenschaft, die sicherstellt, dass jeder Knoten oder jede Replik dieselbe Sicht auf die Daten hat, wenn sie zu einem bestimmten Zeitpunkt Daten schreiben oder lesen. Daher sprechen wir hier von Konsistenz im Sinne des <a href="https://en.wikipedia.org/wiki/CAP_theorem">CAP-Theorems</a>.</p>
<p>In der modernen Welt werden für den Betrieb großer Online-Unternehmen in der Regel mehrere Replikate eingesetzt. Der E-Commerce-Riese Amazon beispielsweise repliziert seine Bestellungen oder SKU-Daten über mehrere Rechenzentren, Zonen oder sogar Länder hinweg, um eine hohe Systemverfügbarkeit im Falle eines Systemabsturzes oder -ausfalls zu gewährleisten. Dies stellt eine Herausforderung für das System dar - die Datenkonsistenz über mehrere Replikate hinweg. Ohne Konsistenz ist es sehr wahrscheinlich, dass der gelöschte Artikel in Ihrem Amazon-Warenkorb wieder auftaucht, was zu einer sehr schlechten Benutzererfahrung führt.</p>
<p>Daher brauchen wir verschiedene Datenkonsistenzstufen für verschiedene Anwendungen. Glücklicherweise bietet Milvus, eine Datenbank für künstliche Intelligenz, Flexibilität bei der Konsistenzstufe und Sie können die Konsistenzstufe einstellen, die am besten zu Ihrer Anwendung passt.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Konsistenz in der Vektordatenbank Milvus</h3><p>Das Konzept der Konsistenzstufe wurde erstmals mit der Veröffentlichung von Milvus 2.0 eingeführt. Die Version 1.0 von Milvus war keine verteilte Vektordatenbank, so dass wir damals noch keine einstellbaren Konsistenzstufen verwendet haben. In Milvus 1.0 werden die Daten jede Sekunde geleert, was bedeutet, dass neue Daten fast sofort nach dem Einfügen sichtbar sind und Milvus die aktuellste Datenansicht genau zu dem Zeitpunkt liest, zu dem eine Vektorähnlichkeitssuche oder eine Abfrageanfrage kommt.</p>
<p>Allerdings wurde Milvus in seiner Version 2.0 überarbeitet und <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 ist eine verteilte Vektordatenbank</a>, die auf einem Pub-Sub-Mechanismus basiert. Das <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC-Theorem</a> besagt, dass ein verteiltes System einen Kompromiss zwischen Konsistenz, Verfügbarkeit und Latenz eingehen muss. Darüber hinaus dienen unterschiedliche Konsistenzniveaus für unterschiedliche Szenarien. Daher wurde in <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> das Konzept der Konsistenz eingeführt, das die Abstimmung der Konsistenzstufen unterstützt.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Vier Konsistenzstufen in der Milvus-Vektor-Datenbank<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt vier Konsistenzstufen: strong, bounded staleness, session und eventual. Und ein Milvus-Benutzer kann die Konsistenzstufe angeben, wenn er <a href="https://milvus.io/docs/v2.1.x/create_collection.md">eine Sammlung erstellt</a> oder eine <a href="https://milvus.io/docs/v2.1.x/search.md">Vektorähnlichkeitssuche</a> oder <a href="https://milvus.io/docs/v2.1.x/query.md">-abfrage</a> durchführt. In diesem Abschnitt wird weiter erläutert, wie sich diese vier Konsistenzstufen unterscheiden und für welches Szenario sie am besten geeignet sind.</p>
<h3 id="Strong" class="common-anchor-header">Stark</h3><p>Strong ist die höchste und strengste Konsistenzstufe. Sie stellt sicher, dass die Benutzer die neueste Version der Daten lesen können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Stark</span> </span></p>
<p>Nach dem PACELC-Theorem erhöht sich die Latenzzeit, wenn die Konsistenzstufe auf Strong gesetzt wird. Daher empfehlen wir, bei Funktionstests starke Konsistenz zu wählen, um die Genauigkeit der Testergebnisse zu gewährleisten. Starke Konsistenz eignet sich auch am besten für Anwendungen, die strenge Anforderungen an die Datenkonsistenz stellen, was auf Kosten der Suchgeschwindigkeit geht. Ein Beispiel hierfür ist ein Online-Finanzsystem, das sich mit der Bezahlung von Bestellungen und der Rechnungsstellung befasst.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Begrenzte Unbeständigkeit</h3><p>Bounded Staleness lässt, wie der Name schon sagt, Dateninkonsistenz während eines bestimmten Zeitraums zu. Im Allgemeinen sind die Daten jedoch außerhalb dieses Zeitraums immer global konsistent.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Begrenzte Stetigkeit</span> </span></p>
<p>Bounded Staleness eignet sich für Szenarien, in denen die Suchlatenz kontrolliert werden muss und eine sporadische Unsichtbarkeit der Daten akzeptiert werden kann. Bei Empfehlungssystemen wie Videoempfehlungsmaschinen hat die sporadische Unsichtbarkeit von Daten beispielsweise nur geringe Auswirkungen auf die Gesamtauffindungsrate, kann aber die Leistung des Empfehlungssystems erheblich steigern. Ein Beispiel ist eine App zur Verfolgung des Status Ihrer Online-Bestellungen.</p>
<h3 id="Session" class="common-anchor-header">Sitzung</h3><p>Session sorgt dafür, dass alle Daten, die Sie schreiben, sofort in derselben Sitzung gelesen werden können. Mit anderen Worten: Wenn Sie Daten über einen Client schreiben, werden die neu eingefügten Daten sofort durchsuchbar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Sitzung</span> </span></p>
<p>Wir empfehlen die Wahl von Session als Konsistenzlevel für jene Szenarien, in denen die Anforderung an die Datenkonsistenz in derselben Sitzung hoch ist. Ein Beispiel wäre das Löschen der Daten eines Bucheintrags aus dem Bibliothekssystem. Nach der Bestätigung der Löschung und dem Auffrischen der Seite (einer anderen Sitzung) sollte das Buch nicht mehr in den Suchergebnissen erscheinen.</p>
<h3 id="Eventual" class="common-anchor-header">Eventuell</h3><p>Es gibt keine garantierte Reihenfolge der Lese- und Schreibvorgänge, und die Replikate konvergieren schließlich zum gleichen Zustand, wenn keine weiteren Schreibvorgänge durchgeführt werden. Bei der eventuellen Konsistenz beginnen die Replikate bei Leseanforderungen mit den zuletzt aktualisierten Werten zu arbeiten. Eventuelle Konsistenz ist die schwächste der vier Stufen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Eventuelle</span> </span></p>
<p>Nach dem PACELC-Theorem kann die Suchlatenz jedoch enorm verkürzt werden, wenn die Konsistenz geopfert wird. Daher eignet sich die eventuelle Konsistenz am besten für Szenarien, in denen keine hohen Anforderungen an die Datenkonsistenz gestellt werden, aber eine blitzschnelle Suchleistung erforderlich ist. Ein Beispiel ist das Abrufen von Rezensionen und Bewertungen von Amazon-Produkten mit eventueller Konsistenz.</p>
<h2 id="Endnote" class="common-anchor-header">Endnote<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Um auf die zu Beginn dieses Artikels gestellte Frage zurückzukommen: Gelöschte Daten werden immer noch als Suchergebnisse zurückgegeben, weil der Benutzer nicht die richtige Konsistenzstufe gewählt hat. Der Standardwert für die Konsistenzstufe ist "bounded staleness" (<code translate="no">Bounded</code>) in der Milvus-Vektordatenbank. Daher kann es vorkommen, dass die gelesenen Daten hinterherhinken und dass Milvus die Datenansicht liest, bevor Sie bei einer Ähnlichkeitssuche oder -abfrage Löschvorgänge durchgeführt haben. Dieses Problem ist jedoch einfach zu lösen. Sie müssen lediglich <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">die Konsistenzstufe</a> bei der Erstellung einer Sammlung oder bei der Durchführung einer Vektorgleichheitssuche oder -abfrage <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">einstellen</a>. Ganz einfach!</p>
<p>Im nächsten Beitrag werden wir den Mechanismus dahinter enthüllen und erklären, wie die Milvus-Vektordatenbank verschiedene Konsistenzniveaus erreicht. Bleiben Sie dran!</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der offiziellen Veröffentlichung von Milvus 2.1 haben wir eine Reihe von Blogs vorbereitet, in denen die neuen Funktionen vorgestellt werden. Lesen Sie mehr in dieser Blogserie:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Wie Sie String-Daten für Ihre Anwendungen zur Ähnlichkeitssuche nutzen können</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von Milvus mit Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Erhöhen Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis des Konsistenzlevels in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
