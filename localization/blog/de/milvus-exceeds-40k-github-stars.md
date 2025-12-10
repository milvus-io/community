---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 Jahre, 2 große Rebuilds, 40K+ GitHub-Sterne: Der Aufstieg von Milvus zur
  führenden Open-Source-Vektordatenbank
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Wir feiern die 7-jährige Entwicklung von Milvus zur weltweit führenden
  Open-Source-Vektordatenbank
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>Im Juni 2025 erreichte Milvus 35.000 GitHub-Sterne. Nur wenige Monate später haben wir <a href="https://github.com/milvus-io/milvus">40.000 überschritten - ein Beweis</a>nicht nur für die Dynamik, sondern auch für eine globale Community, die die Zukunft der vektoriellen und multimodalen Suche vorantreibt.</p>
<p>Wir sind zutiefst dankbar. An alle, die Milvus mit Sternen versehen, geforkt, Probleme gemeldet, über eine API gestritten, einen Benchmark geteilt oder etwas Unglaubliches mit Milvus gebaut haben: <strong>Danke, und ihr seid der Grund, warum dieses Projekt so schnell voranschreitet</strong>. Jeder Stern steht für mehr als nur einen gedrückten Knopf - er spiegelt jemanden wider, der Milvus als Antrieb für seine Arbeit gewählt hat, jemanden, der an das glaubt, was wir aufbauen, jemanden, der unsere Vision einer offenen, zugänglichen und leistungsstarken KI-Infrastruktur teilt.</p>
<p>Während wir also feiern, blicken wir auch in die Zukunft - auf die Funktionen, die Sie fordern, auf die Architekturen, die KI heute verlangt, und auf eine Welt, in der multimodales, semantisches Verstehen der Standard in jeder Anwendung ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">Die Reise: Von Null auf 40.000+ Sterne<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Als wir 2017 mit der Entwicklung von Milvus begannen, gab es den Begriff <em>Vektordatenbank</em> noch gar nicht. Wir waren nur ein kleines Team von Ingenieuren, die davon überzeugt waren, dass KI-Anwendungen bald eine neue Art von Dateninfrastruktur benötigen würden - eine, die nicht für Zeilen und Spalten, sondern für hochdimensionale, unstrukturierte, multimodale Daten ausgelegt ist. Herkömmliche Datenbanken waren für diese Welt nicht geeignet, und wir wussten, dass jemand neu erfinden musste, wie Speicherung und Abruf aussehen könnten.</p>
<p>Die ersten Tage waren alles andere als glamourös. Der Aufbau einer unternehmenstauglichen Infrastruktur ist langsame, hartnäckige Arbeit - Wochen, in denen wir nachts um 2 Uhr Codepfade profilieren, Komponenten neu schreiben und Designentscheidungen in Frage stellen. Diese Mission trug uns durch die ersten Durchbrüche und durch die unvermeidlichen Rückschläge.</p>
<p>Und auf dem Weg dorthin gab es einige Wendepunkte, die alles veränderten:</p>
<ul>
<li><p><strong>2019:</strong> Wir haben Milvus 0.10 veröffentlicht. Das bedeutete, dass wir alle unsere Ecken und Kanten offenlegen mussten - die Hacks, die TODOs, die Teile, auf die wir noch nicht stolz waren. Aber die Community war da. Die Entwickler meldeten Probleme, die wir nie gefunden hätten, schlugen Funktionen vor, die wir uns nicht vorgestellt hatten, und stellten Annahmen in Frage, die Milvus letztendlich stärker machten.</p></li>
<li><p><strong>2020-2021:</strong> Wir traten der <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation</a> bei, lieferten Milvus 1.0 aus, schlossen die LF AI &amp; Data ab und gewannen die <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN-Milliarden-Vektorsuchherausforderung</a> - ein früher Beweis dafür, dass unsere Architektur mit realem Umfang umgehen konnte.</p></li>
<li><p><strong>2022:</strong> Unternehmensanwender brauchten Kubernetes-native Skalierung, Elastizität und eine echte Trennung von Speicher und Rechenleistung. Wir standen vor einer schwierigen Entscheidung: das alte System zu flicken oder alles neu zu bauen. Wir wählten den schwierigeren Weg. <strong>Milvus 2.0 war eine grundlegende Neuerfindung</strong>, die eine vollständig entkoppelte Cloud-native Architektur einführte, die Milvus in eine produktionsfähige Plattform für geschäftskritische KI-Workloads verwandelte.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (das Team hinter Milvus) wurde <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">von Forrester</a> zum <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">Marktführer</a> ernannt, überschritt die 30.000-Sterne-Marke und liegt nun bei über 40.000. Es wurde zum Rückgrat für multimodale Suche, RAG-Systeme, agentenbasierte Workflows und Retrieval in Milliardenhöhe in verschiedenen Branchen - Bildung, Finanzen, kreative Produktion, wissenschaftliche Forschung und mehr.</p></li>
</ul>
<p>Dieser Meilenstein wurde nicht durch einen Hype erreicht, sondern dadurch, dass Entwickler Milvus für reale Arbeitslasten in der Produktion einsetzen und uns bei jedem Schritt zur Verbesserung anspornen.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Zwei große Releases, enorme Leistungssteigerungen<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 war das Jahr, in dem Milvus in eine neue Liga aufgestiegen ist. Während die Vektorsuche ein hervorragendes semantisches Verständnis bietet, ist die Realität in der Produktion einfach: <strong>Entwickler benötigen immer noch einen präzisen Schlüsselwortabgleich</strong> für Produkt-IDs, Seriennummern, exakte Phrasen, rechtliche Begriffe und vieles mehr. Ohne native Volltextsuche waren die Teams gezwungen, Elasticsearch/OpenSearch-Cluster zu pflegen oder ihre eigenen benutzerdefinierten Lösungen zusammenzukleben - was den betrieblichen Aufwand und die Fragmentierung verdoppelte.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Mit Milvus 2.5</strong></a> <strong>hat sich das geändert</strong>. Es wurde eine <strong>wirklich native hybride Suche</strong> eingeführt, die Volltextsuche und Vektorsuche in einer einzigen Engine kombiniert. Zum ersten Mal konnten Entwickler lexikalische Abfragen, semantische Abfragen und Metadatenfilter zusammen ausführen, ohne mit zusätzlichen Systemen jonglieren oder Pipelines synchronisieren zu müssen. Außerdem haben wir die Metadatenfilterung, das Parsen von Ausdrücken und die Ausführungseffizienz verbessert, so dass sich hybride Abfragen unter echten Produktionslasten natürlich und schnell anfühlen.</p>
<p>Mit<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>haben wir diese Entwicklung weiter vorangetrieben</strong> und uns auf die beiden Herausforderungen konzentriert, die wir am häufigsten von Anwendern hören, die in großem Maßstab arbeiten: <strong><em>Kosten</em> und <em>Leistung</em>.</strong> Diese Version brachte tiefgreifende architektonische Verbesserungen mit sich: besser vorhersehbare Abfragepfade, schnellere Indizierung, drastisch geringere Speichernutzung und deutlich effizientere Speicherung. Viele Teams berichteten von unmittelbaren Verbesserungen, ohne eine einzige Zeile des Anwendungscodes zu ändern.</p>
<p>Hier sind nur einige der Highlights von Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Ein abgestufter Speicher</strong></a>, mit dem Teams Kosten und Leistung intelligenter ausbalancieren und die Speicherkosten um bis zu 50 % senken können.</p></li>
<li><p><strong>Enorme Speichereinsparungen</strong> durch <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1-Bit-Quantisierung</a> - Reduzierung der Speichernutzung um bis zu 72 % bei gleichzeitig schnelleren Abfragen.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Eine neu gestaltete Volltext-Engine</strong></a> mit einer deutlich schnelleren BM25-Implementierung - in unseren Benchmarks bis zu 4× schneller als Elasticsearch.</p></li>
<li><p><strong>Ein neuer Path Index</strong> für <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON-strukturierte Metadaten</a>, der eine bis zu 100-fach schnellere Filterung komplexer Dokumente ermöglicht.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> Milliardenfache Komprimierung mit 3200-facher Speicherreduzierung und starkem Recall</p></li>
<li><p><strong>Semantische und</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>raumbezogene Suche</strong></a> <strong>mit R-Tree:</strong> Kombiniert den <em>Ort der Dinge</em> mit <em>ihrer Bedeutung</em> für relevantere Ergebnisse</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> Senkt die Bereitstellungskosten mit einem hybriden CAGRA-Modus, der auf GPUs aufbaut, aber Abfragen auf CPUs stellt</p></li>
<li><p><strong>Ein "</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>Daten rein, Daten raus</strong></a><strong>"-Workflow</strong>, der die Einbettung von Ingestion und Retrieval vereinfacht, insbesondere für multimodale Pipelines.</p></li>
<li><p><strong>Unterstützung für bis zu 100K Sammlungen</strong> in einem einzigen Cluster - ein wichtiger Schritt in Richtung echter Multi-Tenancy im großen Maßstab.</p></li>
</ul>
<p>Einen tieferen Einblick in Milvus 2.6 erhalten Sie in den <a href="https://milvus.io/docs/release_notes.md">vollständigen Versionshinweisen</a>.</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Über Milvus hinaus: Open-Source-Tools für KI-Entwickler<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Jahr 2025 haben wir nicht nur Milvus verbessert, sondern auch Tools entwickelt, die das gesamte Ökosystem der KI-Entwickler stärken. Unser Ziel war es nicht, Trends hinterherzulaufen, sondern Entwicklern die Art von offenen, leistungsstarken und transparenten Tools zur Verfügung zu stellen, die wir uns schon immer gewünscht haben.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Forschung ohne Cloud-Lock-In</h3><p>Der Deep Researcher von OpenAI hat bewiesen, was Deep Reasoning Agents leisten können. Aber er ist geschlossen, teuer und hinter Cloud-APIs verschlossen. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>ist unsere Antwort.</strong> Es ist eine lokale, quelloffene Deep Research-Engine, die für alle entwickelt wurde, die strukturierte Untersuchungen durchführen wollen, ohne auf Kontrolle oder Datenschutz verzichten zu müssen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher läuft vollständig auf Ihrem Computer, sammelt Informationen aus verschiedenen Quellen, fasst Erkenntnisse zusammen und stellt Zitate, Argumentationsschritte und Rückverfolgbarkeit bereit - Funktionen, die für eine echte Recherche unerlässlich sind, nicht nur oberflächliche Zusammenfassungen. Keine Blackboxen. Keine Bindung an einen bestimmten Anbieter. Nur transparente, reproduzierbare Analysen, denen Entwickler und Forscher vertrauen können.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context: Kodierassistenten, die Ihren Code wirklich verstehen</h3><p>Die meisten KI-Codierwerkzeuge verhalten sich immer noch wie ausgefallene Grep-Pipelines - schnell, oberflächlich, Token-verbrennend und ohne Kenntnis der tatsächlichen Projektstruktur. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> **** ändert das. Es wurde als MCP-Plugin entwickelt und gibt Programmierassistenten endlich das, was sie bisher vermisst haben: ein echtes semantisches Verständnis Ihrer Codebasis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context baut einen vektorgestützten semantischen Index über Ihr Projekt auf, der es Agenten ermöglicht, die richtigen Module zu finden, Beziehungen zwischen Dateien zu verfolgen, Absichten auf Architekturebene zu verstehen und Fragen mit Relevanz statt mit Vermutungen zu beantworten. Es reduziert die Verschwendung von Token, erhöht die Präzision und - was am wichtigsten ist - lässt Programmierassistenten sich so verhalten, als würden sie Ihre Software wirklich verstehen, anstatt so zu tun, als ob.</p>
<p>Beide Tools sind vollständig quelloffen. Weil die KI-Infrastruktur allen gehören sollte - und weil die Zukunft der KI nicht hinter proprietären Mauern eingeschlossen sein sollte.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Mehr als 10.000 Teams in der Produktion vertrauen darauf<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Heute setzen mehr als 10.000 Unternehmensteams Milvus in der Produktion ein - von schnell wachsenden Startups bis hin zu einigen der weltweit etabliertesten Technologie- und Fortune 500-Unternehmen. Teams bei NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch und innerhalb von Microsoft verlassen sich auf Milvus, um KI-Systeme zu betreiben, die jede Minute eines jeden Tages funktionieren. Ihre Workloads umfassen Suche, Empfehlungen, agentenbasierte Pipelines, multimodales Retrieval und andere Anwendungen, die die Vektorinfrastruktur an ihre Grenzen bringen.</p>
<p><a href="https://assets.zilliz.com/logos_eb0d3ad4af.png"></a></p>
<p>Aber was am meisten zählt, ist nicht nur, <em>wer</em> Milvus nutzt, sondern auch, <em>was sie damit aufbauen</em>. Milvus ist branchenübergreifend für Systeme zuständig, die die Art und Weise beeinflussen, wie Unternehmen arbeiten, innovieren und konkurrieren:</p>
<ul>
<li><p><strong>KI-Kopiloten und Unternehmensassistenten</strong>, die den Kundensupport, die Vertriebsabläufe und die interne Entscheidungsfindung mit sofortigem Zugriff auf Milliarden von Einbettungen verbessern.</p></li>
<li><p><strong>Semantische und visuelle Suche im E-Commerce, in den Medien und in der Werbung</strong>, die zu höheren Umsätzen, besserer Entdeckung und schnellerer kreativer Produktion führt.</p></li>
<li><p><strong>Rechtliche, finanzielle und wissenschaftliche Intelligenzplattformen</strong>, bei denen sich Präzision, Überprüfbarkeit und Compliance in echte betriebliche Vorteile umsetzen lassen.</p></li>
<li><p><strong>Betrugserkennung und Risiko-Engines</strong> in der Finanztechnologie und im Bankwesen, die auf schnellem semantischem Abgleich beruhen, um Verluste in Echtzeit zu verhindern.</p></li>
<li><p><strong>Groß angelegte RAG- und Agentensysteme</strong>, die Teams ein tiefgreifend kontextbezogenes, domänenspezifisches KI-Verhalten ermöglichen.</p></li>
<li><p><strong>Wissensschichten in Unternehmen</strong>, die Text, Code, Bilder und Metadaten zu einer kohärenten semantischen Struktur vereinen.</p></li>
</ul>
<p>Und das sind keine Labor-Benchmarks - es sind einige der weltweit anspruchsvollsten Produktionsanwendungen. Milvus liefert routinemäßig:</p>
<ul>
<li><p>Abrufzeiten unter 50 ms für Milliarden von Vektoren</p></li>
<li><p>Verwaltung von Milliarden von Dokumenten und Ereignissen in einem einzigen System</p></li>
<li><p>5-10x schnellere Arbeitsabläufe als alternative Lösungen</p></li>
<li><p>Mandantenfähige Architekturen, die Hunderttausende von Sammlungen unterstützen</p></li>
</ul>
<p>Teams entscheiden sich aus einem einfachen Grund für Milvus: <strong>Es liefert dort, wo es darauf ankommt, Geschwindigkeit, Zuverlässigkeit, Kosteneffizienz und die Fähigkeit, auf Milliarden von Dokumenten zu skalieren, ohne ihre Architektur alle paar Monate auseinander zu reißen.</strong> Das Vertrauen, das diese Teams in uns setzen, ist der Grund, warum wir Milvus für das kommende Jahrzehnt der künstlichen Intelligenz weiter ausbauen.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Wenn Sie Milvus ohne die Ops brauchen: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist kostenlos, leistungsstark und kampferprobt. Aber es ist auch ein verteiltes System - und verteilte Systeme gut zu betreiben ist echte Ingenieursarbeit. Index-Tuning, Speicherverwaltung, Cluster-Stabilität, Skalierung, Beobachtbarkeit... diese Aufgaben erfordern Zeit und Fachwissen, das viele Teams einfach nicht erübrigen können. Die Entwickler wollten die Leistung von Milvus, nur ohne den operativen Aufwand, der unweigerlich mit der Verwaltung in großem Maßstab verbunden ist.</p>
<p>Diese Realität führte uns zu einer einfachen Schlussfolgerung: Wenn Milvus zur Kerninfrastruktur für KI-Anwendungen werden sollte, mussten wir es mühelos betreiben können. Aus diesem Grund haben wir <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> entwickelt, den vollständig verwalteten Milvus-Service, der von demselben Team entwickelt und gepflegt wird, das auch hinter dem Open-Source-Projekt steht.</p>
<p>Zilliz Cloud bietet Entwicklern das Milvus, das sie bereits kennen und dem sie vertrauen - allerdings ohne die Bereitstellung von Clustern, die Behebung von Leistungsproblemen, die Planung von Upgrades oder die Sorge um Storage- und Compute-Tuning. Und weil es Optimierungen enthält, die in selbstverwalteten Umgebungen nicht möglich sind, ist es sogar noch schneller und zuverlässiger. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, unsere kommerzielle, selbstoptimierende Vektor-Engine, bietet die 10-fache Leistung von <strong>Open-Source Milvus</strong>.</p>
<p><strong>Was Zilliz Cloud auszeichnet</strong></p>
<ul>
<li><strong>Selbst-optimierende Leistung:</strong> AutoIndex stimmt HNSW, IVF und DiskANN automatisch ab und liefert 96%+ Recall ohne manuelle Konfiguration.</li>
</ul>
<ul>
<li><p><strong>Elastisch und kosteneffizient:</strong> Pay-as-you-go-Preise, serverlose Autoskalierung und intelligentes Ressourcenmanagement senken die Kosten im Vergleich zu selbstverwalteten Bereitstellungen oft um 50 % oder mehr.</p></li>
<li><p><strong>Zuverlässigkeit auf Unternehmensebene:</strong> 99,95 % Betriebszeit SLA, Multi-AZ-Redundanz, SOC 2 Typ II, ISO 27001 und GDPR-Konformität. Volle Unterstützung für RBAC, BYOC, Audit-Protokolle und Verschlüsselung.</p></li>
<li><p><strong>Cloud-agnostische Bereitstellung:</strong> Ausführung auf AWS, Azure, GCP, Alibaba Cloud oder Tencent Cloud - keine Anbieterbindung, überall gleichbleibende Leistung.</p></li>
<li><p><strong>Abfragen in natürlicher Sprache:</strong> Dank der integrierten MCP-Serverunterstützung können Sie Daten in natürlicher Sprache abfragen, anstatt API-Aufrufe manuell zu verfassen.</p></li>
<li><p><strong>Mühelose Migration</strong>: Wechseln Sie von Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch oder PostgreSQL mithilfe integrierter Migrationstools - ohne Schema-Neuschreiben oder Ausfallzeiten.</p></li>
<li><p><strong>100% kompatibel mit Open-Source Milvus.</strong> Keine proprietären Forks. Kein Lock-in. Einfach Milvus, einfacher gemacht.</p></li>
</ul>
<p><strong>Milvus wird immer quelloffen und frei verwendbar bleiben.</strong> Aber der zuverlässige Betrieb im Unternehmensmaßstab erfordert erhebliche Fachkenntnisse und Ressourcen. <strong>Zilliz Cloud ist unsere Antwort auf diese Lücke</strong>. Zilliz Cloud wird in 29 Regionen und fünf großen Clouds eingesetzt und bietet Leistung, Sicherheit und Kosteneffizienz auf Unternehmensniveau, ohne dass Sie auf das Milvus, das Sie bereits kennen, verzichten müssen.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Kostenlose Testversion → starten</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">Was kommt als Nächstes? Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Als das Team, das die Vektordatenbank eingeführt hat, konnten wir aus der ersten Reihe miterleben, wie sich die Unternehmensdaten verändern. Was früher in strukturierten Tabellen im Terabyte-Bereich untergebracht war, entwickelt sich schnell zu Petabytes - und bald zu Billionen - von multimodalen Objekten. Text, Bilder, Audio, Video, Zeitreihenströme, Multisensorprotokolle... das sind die Datensätze, auf die moderne KI-Systeme angewiesen sind.</p>
<p>Vektordatenbanken sind speziell für unstrukturierte und multimodale Daten konzipiert, aber sie sind nicht immer die wirtschaftlichste oder architektonisch sinnvollste Wahl - vor allem, wenn der Großteil der Daten kalt ist. Trainingskorpora für große Modelle, Wahrnehmungsprotokolle für autonomes Fahren und Robotikdatensätze erfordern in der Regel keine Latenzzeiten im Millisekundenbereich oder hohe Gleichzeitigkeit. Die Ausführung dieser Datenmengen durch eine Echtzeit-Vektordatenbank wird für Pipelines, die dieses Leistungsniveau nicht benötigen, teuer, schwerfällig und übermäßig komplex.</p>
<p>Diese Realität führte uns zu unserer nächsten großen Initiative: <strong>Milvus Lake - ein</strong>semantikgesteuertes, indexbasiertes, multimodales Lakehouse, das für KI-Daten entwickelt wurde. Milvus Lake vereint semantische Signale über alle Modalitäten hinweg - Vektoren, Metadaten, Beschriftungen, LLM-generierte Beschreibungen und strukturierte Felder - und organisiert sie in <strong>Semantic Wide Tables</strong>, die um echte Geschäftseinheiten herum verankert sind. Daten, die zuvor als rohe, verstreute Dateien in Objektspeichern, Lakehouses und Modellpipelines vorhanden waren, werden zu einer einheitlichen, abfragbaren semantischen Ebene. Massive multimodale Korpora werden zu verwaltbaren, abrufbaren, wiederverwendbaren Assets mit konsistenter Bedeutung im gesamten Unternehmen.</p>
<p>Milvus Lake basiert auf einer sauberen <strong>Manifest-, Daten- und Indexarchitektur</strong>, bei der die Indizierung als grundlegend und nicht als nachträglicher Gedanke betrachtet wird. Dies ermöglicht einen Workflow nach dem Motto "erst abrufen, dann verarbeiten", der für kalte Daten in Billionenhöhe optimiert ist und vorhersehbare Latenzzeiten, drastisch niedrigere Speicherkosten und eine weitaus höhere Betriebsstabilität bietet. Ein Tiered-Storage-Ansatz - NVMe/SSD für Hot-Paths und Objektspeicher für tiefe Archive - gepaart mit effizienter Komprimierung und Lazy-Load-Indizes bewahrt die semantische Treue und hält den Infrastruktur-Overhead fest im Griff.</p>
<p>Milvus Lake fügt sich außerdem nahtlos in das moderne Datenökosystem ein und lässt sich mit Paimon, Iceberg, Hudi, Spark, Ray und anderen Big-Data-Engines und -Formaten integrieren. Teams können Stapelverarbeitung, Echtzeit-Pipelines, semantisches Retrieval, Feature-Engineering und die Vorbereitung von Trainingsdaten an einem Ort ausführen, ohne ihre bestehenden Workflows neu zu gestalten. Ganz gleich, ob Sie grundlegende Modellkorpora aufbauen, Bibliotheken für autonome Fahrsimulationen verwalten, Robotik-Agenten trainieren oder umfangreiche Retrievalsysteme betreiben, Milvus Lake bietet ein erweiterbares und kosteneffizientes semantisches Seehaus für das KI-Zeitalter.</p>
<p><strong>Milvus Lake befindet sich in aktiver Entwicklung.</strong> Sind Sie an einem frühen Zugang interessiert oder möchten Sie mehr erfahren?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Kontaktieren Sie uns →.</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Gebaut von der Gemeinschaft, für die Gemeinschaft<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Was Milvus so besonders macht, ist nicht nur die Technologie, sondern auch die Menschen, die dahinter stehen. Unsere Mitarbeiter kommen aus der ganzen Welt und sind Spezialisten für High-Performance-Computing, verteilte Systeme und KI-Infrastruktur. Ingenieure und Forscher von ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft und vielen anderen haben mit ihrer Expertise dazu beigetragen, Milvus zu dem zu machen, was es heute ist.</p>
<p>Jeder Pull-Request, jeder Bug-Report, jede in unseren Foren beantwortete Frage, jedes erstellte Tutorial - diese Beiträge machen Milvus für alle besser.</p>
<p>Dieser Meilenstein gehört Ihnen allen:</p>
<ul>
<li><p><strong>Unseren Mitwirkenden</strong>: Wir danken Ihnen für Ihren Code, Ihre Ideen und Ihre Zeit. Sie machen Milvus jeden einzelnen Tag besser.</p></li>
<li><p><strong>An unsere Benutzer</strong>: Vielen Dank, dass Sie Milvus Ihre Arbeitslasten anvertrauen und uns Ihre Erfahrungen mitteilen, sowohl die guten als auch die schwierigen. Ihr Feedback treibt unsere Roadmap voran.</p></li>
<li><p><strong>An unsere Community-Unterstützer</strong>: Vielen Dank für die Beantwortung von Fragen, das Schreiben von Tutorials, die Erstellung von Inhalten und die Unterstützung von Neulingen beim Einstieg. Sie machen unsere Community zu einer einladenden und integrativen Gemeinschaft.</p></li>
<li><p><strong>An unsere Partner und Integratoren</strong>: Vielen Dank, dass Sie mit uns zusammenarbeiten und Milvus zu einem erstklassigen Bürger im Ökosystem der KI-Entwicklung machen.</p></li>
<li><p><strong>An das Zilliz-Team</strong>: Vielen Dank für Ihr unermüdliches Engagement für das Open-Source-Projekt und den Erfolg unserer Nutzer.</p></li>
</ul>
<p>Milvus ist gewachsen, weil Tausende von Menschen beschlossen haben, gemeinsam etwas aufzubauen - offen, großzügig und in der Überzeugung, dass grundlegende KI-Infrastruktur für jeden zugänglich sein sollte.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Begleiten Sie uns auf dieser Reise<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Ganz gleich, ob Sie Ihre erste Vektorsuchanwendung entwickeln oder auf Milliarden von Vektoren skalieren, wir würden uns freuen, Sie als Teil der Milvus-Community begrüßen zu dürfen.</p>
<p><strong>Fangen Sie an</strong>:</p>
<ul>
<li><p>⭐ <strong>Starten Sie uns auf GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Zilliz Cloud kostenlos testen</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Treten Sie unserem</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> <strong>bei</strong>, um sich mit Entwicklern weltweit zu verbinden</p></li>
<li><p>📚 <strong>Erforschen Sie unsere Dokumentationen</strong>: <a href="https://milvus.io/docs">Milvus Dokumentation</a></p></li>
<li><p>💬 <strong>Buchen Sie ein</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20-minütiges persönliches Gespräch</strong></a>, um Einblicke, Anleitung und Antworten auf Ihre Fragen zu erhalten.</p></li>
</ul>
<p>Der Weg, der vor uns liegt, ist spannend. Während KI Branchen umgestaltet und neue Möglichkeiten eröffnet, werden Vektordatenbanken im Zentrum dieser Transformation stehen. Gemeinsam schaffen wir die semantische Grundlage, auf die sich moderne KI-Anwendungen stützen - und wir stehen erst am Anfang.</p>
<p>Auf die nächsten 40.000 Sterne und darauf, <strong>gemeinsam</strong> die Zukunft der KI-Infrastruktur zu gestalten. 🎉</p>
