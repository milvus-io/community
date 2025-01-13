---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Schlüsselwortbasierte Suche
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia nutzte Milvus, um ein 10x intelligenteres Suchsystem zu entwickeln,
  das die Benutzerfreundlichkeit dramatisch verbessert hat.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Wie wir die semantische Suche nutzen, um unsere Suche 10x intelligenter zu machen</custom-h1><p>Wir bei Tokopedia sind uns bewusst, dass unser Produktkorpus nur dann seinen Wert entfaltet, wenn unsere Käufer Produkte finden können, die für sie relevant sind, daher bemühen wir uns, die Relevanz der Suchergebnisse zu verbessern.</p>
<p>Um diese Bemühungen zu unterstützen, führen wir die <strong>Ähnlichkeitssuche</strong> auf Tokopedia ein. Wenn Sie die Suchergebnisseite auf mobilen Geräten aufrufen, finden Sie eine "..."-Schaltfläche, die Ihnen die Möglichkeit gibt, nach ähnlichen Produkten wie dem Produkt zu suchen.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Schlüsselwortbasierte Suche<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search verwendet <strong>Elasticsearch</strong> für die Suche und das Ranking von Produkten. Für jede Suchanfrage wird zunächst Elasticsearch abgefragt, das die Produkte entsprechend der Suchanfrage einstuft. Elasticsearch speichert jedes Wort als eine Folge von Zahlen, die <a href="https://en.wikipedia.org/wiki/ASCII">ASCII-</a> (oder UTF-) Codes für jeden Buchstaben darstellen. Es baut einen <a href="https://en.wikipedia.org/wiki/Inverted_index">invertierten Index</a> auf, um schnell herauszufinden, welche Dokumente Wörter aus der Benutzeranfrage enthalten, und findet dann die beste Übereinstimmung unter ihnen mit Hilfe verschiedener Bewertungsalgorithmen. Diese Bewertungsalgorithmen achten wenig auf die Bedeutung der Wörter, sondern eher darauf, wie häufig sie in dem Dokument vorkommen, wie nahe sie beieinander liegen usw. Die ASCII-Darstellung enthält offensichtlich genügend Informationen, um die Semantik zu vermitteln (schließlich können wir Menschen sie verstehen). Leider gibt es für den Computer keinen guten Algorithmus, um ASCII-kodierte Wörter anhand ihrer Bedeutung zu vergleichen.</p>
<h2 id="Vector-representation" class="common-anchor-header">Vektorielle Darstellung<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine Lösung für dieses Problem wäre eine alternative Darstellung, die nicht nur etwas über die im Wort enthaltenen Buchstaben aussagt, sondern auch etwas über seine Bedeutung. Wir könnten zum Beispiel kodieren <em>, mit welchen anderen Wörtern unser Wort häufig zusammen verwendet wird</em> (dargestellt durch den wahrscheinlichen Kontext). Wir würden dann annehmen, dass ähnliche Kontexte für ähnliche Dinge stehen, und versuchen, sie mit mathematischen Methoden zu vergleichen. Wir könnten sogar einen Weg finden, ganze Sätze nach ihrer Bedeutung zu kodieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Wie wir die semantische Suche nutzen, um unsere Suche 10x intelligenter zu machen_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Auswahl einer Suchmaschine für die Einbettungsähnlichkeit<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Da wir nun über Merkmalsvektoren verfügen, stellt sich die Frage, wie wir aus der großen Menge von Vektoren diejenigen herausfinden können, die dem Zielvektor ähnlich sind. Was die Suchmaschine für Einbettungen betrifft, so haben wir POC mit mehreren auf Github verfügbaren Maschinen ausprobiert, darunter FAISS, Vearch und Milvus.</p>
<p>Basierend auf den Ergebnissen der Lasttests ziehen wir Milvus den anderen Engines vor. Einerseits haben wir FAISS bereits in anderen Teams eingesetzt und wollten daher etwas Neues ausprobieren. Im Vergleich zu Milvus ist FAISS eher eine zugrundeliegende Bibliothek und daher nicht ganz einfach zu benutzen. Als wir mehr über Milvus erfuhren, entschieden wir uns schließlich für Milvus wegen seiner zwei Hauptmerkmale:</p>
<ul>
<li><p>Milvus ist sehr einfach zu benutzen. Alles, was Sie tun müssen, ist, sein Docker-Image zu ziehen und die Parameter auf der Grundlage Ihres eigenen Szenarios zu aktualisieren.</p></li>
<li><p>Milvus unterstützt mehrere Indizes und verfügt über eine ausführliche Dokumentation.</p></li>
</ul>
<p>Kurz gesagt, Milvus ist sehr benutzerfreundlich und die Dokumentation ist sehr ausführlich. Wenn Sie auf ein Problem stoßen, können Sie in der Regel Lösungen in der Dokumentation finden; andernfalls können Sie jederzeit Unterstützung von der Milvus-Community erhalten.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvus-Cluster-Dienst<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir uns für Milvus als Feature-Vektor-Suchmaschine entschieden hatten, beschlossen wir, Milvus für einen unserer Ads-Service-Anwendungsfälle zu verwenden, bei dem wir Keywords <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">mit niedriger Füllrate</a> mit Keywords mit hoher Füllrate abgleichen wollten. Wir konfigurierten einen Standalone-Knoten in einer Entwicklungsumgebung (DEV) und begannen mit der Auslieferung, die bereits seit einigen Tagen gut lief und uns verbesserte CTR/CVR-Metriken lieferte. Wenn ein Standalone-Knoten in der Produktionsumgebung ausfiele, würde der gesamte Dienst nicht mehr verfügbar sein. Wir müssen also einen hochverfügbaren Suchdienst bereitstellen.</p>
<p>Milvus bietet sowohl Mishards, eine Cluster-Sharding-Middleware, als auch Milvus-Helm für die Konfiguration. In Tokopedia verwenden wir Ansible-Playbooks für die Einrichtung der Infrastruktur, also haben wir ein Playbook für die Infrastruktur-Orchestrierung erstellt. Das folgende Diagramm aus der Milvus-Dokumentation zeigt, wie Mishards funktioniert:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_3.png</span> </span></p>
<p>Mishards kaskadiert eine Anfrage von Upstream bis hinunter zu seinen Untermodulen, die die Upstream-Anfrage aufteilen, und sammelt dann die Ergebnisse der Unterdienste und gibt sie an Upstream zurück. Die Gesamtarchitektur der Mishards-basierten Clusterlösung ist unten dargestellt: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>Die offizielle Dokumentation bietet eine klare Einführung in Mishards. Bei Interesse können Sie sich auf <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> beziehen.</p>
<p>In unserem Schlüsselwort-zu-Schlüsselwort-Dienst haben wir einen beschreibbaren Knoten, zwei schreibgeschützte Knoten und eine Mishards-Middleware-Instanz in GCP mithilfe von Milvus Ansible eingerichtet. Bislang läuft das System stabil. Ein wesentlicher Bestandteil der effizienten Abfrage von Millionen-, Milliarden- oder sogar Billionen-Vektordatensätzen, auf die sich Suchmaschinen für Ähnlichkeitsanalysen stützen, ist die <a href="https://milvus.io/docs/v0.10.5/index.md">Indizierung</a>, ein Prozess zur Organisation von Daten, der die Big-Data-Suche drastisch beschleunigt.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">Wie beschleunigt die Vektorindizierung die Ähnlichkeitssuche?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Ähnlichkeitssuchmaschinen arbeiten, indem sie Eingaben mit einer Datenbank vergleichen, um Objekte zu finden, die der Eingabe am ähnlichsten sind. Die Indizierung ist der Prozess der effizienten Organisation von Daten und spielt eine wichtige Rolle, wenn es darum geht, die Ähnlichkeitssuche nützlich zu machen, indem zeitaufwändige Abfragen in großen Datensätzen drastisch beschleunigt werden. Nachdem ein großer Vektordatensatz indiziert wurde, können Abfragen zu Clustern oder Teilmengen von Daten geleitet werden, die mit hoher Wahrscheinlichkeit Vektoren enthalten, die einer Eingabeabfrage ähnlich sind. In der Praxis bedeutet dies, dass ein gewisses Maß an Genauigkeit geopfert werden muss, um Abfragen auf wirklich großen Vektordaten zu beschleunigen.</p>
<p>Es kann eine Analogie zu einem Wörterbuch gezogen werden, in dem die Wörter alphabetisch sortiert sind. Wenn man ein Wort nachschlägt, kann man schnell zu einem Abschnitt navigieren, der nur Wörter mit demselben Anfangsbuchstaben enthält, was die Suche nach der Definition des eingegebenen Wortes drastisch beschleunigt.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">Sie fragen sich, wie es weitergeht?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Wie wir die semantische Suche nutzen, um unsere Suche 10x intelligenter zu machen_5.jpeg</span> </span></p>
<p>Wie oben gezeigt, gibt es keine Lösung, die für alle geeignet ist. Wir wollen immer die Leistung des Modells verbessern, das für die Ermittlung der Einbettungen verwendet wird.</p>
<p>Außerdem wollen wir aus technischer Sicht mehrere Lernmodelle gleichzeitig laufen lassen und die Ergebnisse der verschiedenen Experimente vergleichen. Weitere Informationen zu unseren Experimenten, z. B. zur Bild- und Videosuche, finden Sie an dieser Stelle.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Referenzen:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Dieser Blog-Artikel wurde von https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821 übernommen.</em></p>
<p>Lesen Sie andere <a href="https://zilliz.com/user-stories">Anwenderberichte</a>, um mehr über die Herstellung von Dingen mit Milvus zu erfahren.</p>
