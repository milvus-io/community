---
id: graph-based-recommendation-system-with-milvus.md
title: Wie funktionieren Empfehlungssysteme?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Empfehlungssysteme können Einnahmen generieren, Kosten senken und einen
  Wettbewerbsvorteil bieten. Erfahren Sie, wie Sie ein solches System mit
  Open-Source-Tools kostenlos erstellen können.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Aufbau eines graphenbasierten Empfehlungssystems mit Milvus-, PinSage-, DGL- und MovieLens-Datensätzen</custom-h1><p>Empfehlungssysteme werden von Algorithmen angetrieben, deren <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">bescheidene Anfänge</a> darin bestehen, Menschen dabei zu helfen, unerwünschte E-Mails zu sichten. Im Jahr 1990 verwendete der Erfinder Doug Terry einen Algorithmus zur kollaborativen Filterung, um erwünschte E-Mails von Junk-Mails zu trennen. Durch einfaches "Mögen" oder "Hassen" einer E-Mail in Zusammenarbeit mit anderen, die dasselbe mit ähnlichen E-Mail-Inhalten taten, konnten Benutzer Computer schnell darauf trainieren, zu bestimmen, was in den Posteingang eines Benutzers gelangen sollte und was in den Junk-Mail-Ordner verschoben werden sollte.</p>
<p>Im Allgemeinen sind Empfehlungssysteme Algorithmen, die den Benutzern relevante Vorschläge machen. Dabei kann es sich um Vorschläge für Filme, Bücher, Produkte oder andere Dinge handeln, je nach Szenario oder Branche. Diese Algorithmen sind allgegenwärtig und beeinflussen die Inhalte, die wir konsumieren, und die Produkte, die wir von großen Technologieunternehmen wie Youtube, Amazon, Netflix und vielen anderen kaufen.</p>
<p>Gut konzipierte Empfehlungssysteme können wesentliche Umsatzquellen, Kostensenkungen und Wettbewerbsvorteile darstellen. Dank Open-Source-Technologie und sinkender Rechenkosten waren maßgeschneiderte Empfehlungssysteme noch nie so zugänglich wie heute. Dieser Artikel erklärt, wie man Milvus, eine Open-Source-Vektordatenbank, PinSage, ein Graph Convolutional Neural Network (GCN), Deep Graph Library (DGL), ein skalierbares Python-Paket für Deep Learning auf Graphen, und MovieLens-Datensätze verwendet, um ein graphbasiertes Empfehlungssystem aufzubauen.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Wie funktionieren Empfehlungssysteme?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Tools für den Aufbau eines Empfehlungssystems</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Aufbau eines graphbasierten Empfehlungssystems mit Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Wie funktionieren Empfehlungssysteme?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Es gibt zwei gängige Ansätze für die Entwicklung von Empfehlungssystemen: kollaboratives Filtern und inhaltsbasiertes Filtern. Die meisten Entwickler verwenden eine oder beide Methoden, und obwohl Empfehlungssysteme in ihrer Komplexität und ihrem Aufbau variieren können, enthalten sie in der Regel drei Kernelemente:</p>
<ol>
<li><strong>Benutzermodell:</strong> Empfehlungssysteme erfordern die Modellierung von Benutzereigenschaften, Vorlieben und Bedürfnissen. Viele Empfehlungssysteme basieren ihre Vorschläge auf impliziten oder expliziten Eingaben der Benutzer auf Objektebene.</li>
<li><strong>Objektmodell:</strong> Empfehlungssysteme modellieren auch Objekte, um auf der Grundlage von Benutzerporträts Objektempfehlungen auszusprechen.</li>
<li><strong>Empfehlungsalgorithmus:</strong> Die Kernkomponente eines jeden Empfehlungssystems ist der Algorithmus, der die Empfehlungen ausspricht. Zu den häufig verwendeten Algorithmen gehören kollaboratives Filtern, implizite semantische Modellierung, graphbasierte Modellierung, kombinierte Empfehlungen und andere.</li>
</ol>
<p>Empfehlungssysteme, die sich auf kollaboratives Filtern stützen, erstellen ein Modell auf der Grundlage des bisherigen Benutzerverhaltens (einschließlich des Verhaltens ähnlicher Benutzer), um vorherzusagen, woran ein Benutzer interessiert sein könnte. Systeme, die auf inhaltsbasierter Filterung beruhen, verwenden diskrete, vordefinierte Tags auf der Grundlage von Artikelmerkmalen, um ähnliche Artikel zu empfehlen.</p>
<p>Ein Beispiel für kollaboratives Filtern wäre ein personalisierter Radiosender auf Spotify, der auf der Hörhistorie, den Interessen, der Musiksammlung und mehr eines Nutzers basiert. Der Sender spielt Musik, die der Nutzer nicht gespeichert oder anderweitig sein Interesse bekundet hat, die aber andere Nutzer mit ähnlichem Geschmack oft gehört haben. Ein Beispiel für ein inhaltsbasiertes Filtersystem wäre ein Radiosender, der auf einem bestimmten Lied oder Künstler basiert und anhand von Attributen der Eingabe ähnliche Musik empfiehlt.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Werkzeuge für den Aufbau eines Empfehlungssystems<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Beispiel ist der Aufbau eines graphbasierten Empfehlungssystems von Grund auf von den folgenden Tools abhängig:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Ein graphisches Faltungsnetzwerk</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> ist ein Random-Walk-Graph-Faltungsnetzwerk, das in der Lage ist, Einbettungen für Knoten in Web-Graphen mit Milliarden von Objekten zu lernen. Das Netzwerk wurde von <a href="https://www.pinterest.com/">Pinterest</a>, einem Unternehmen für Online-Pinnwände, entwickelt, um seinen Nutzern thematische visuelle Empfehlungen zu geben.</p>
<p>Pinterest-Nutzer können Inhalte, die sie interessieren, an "Boards" anheften, d. h. an Sammlungen von angehefteten Inhalten. Mit über <a href="https://business.pinterest.com/audience/">478 Millionen</a> monatlich aktiven Nutzern (MAU) und über <a href="https://newsroom.pinterest.com/en/company">240 Milliarden</a> gespeicherten Objekten verfügt das Unternehmen über eine immense Menge an Nutzerdaten, für die es neue Technologien entwickeln muss.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage verwendet bipartite Graphen von Pins, um hochwertige Einbettungen von Pins zu generieren, die dazu verwendet werden, Nutzern visuell ähnliche Inhalte zu empfehlen. Im Gegensatz zu herkömmlichen GCN-Algorithmen, die Faltungen auf den Merkmalsmatrizen und dem gesamten Graphen durchführen, nimmt PinSage Stichproben der nahegelegenen Knoten/Pins und führt effizientere lokale Faltungen durch dynamische Konstruktion von Rechengraphen durch.</p>
<p>Die Durchführung von Faltungen in der gesamten Nachbarschaft eines Knotens führt zu einem riesigen Berechnungsgraphen. Um den Ressourcenbedarf zu reduzieren, aktualisieren herkömmliche GCN-Algorithmen die Darstellung eines Knotens, indem sie Informationen aus seiner k-Hop-Nachbarschaft zusammenfassen. PinSage simuliert Random-Walk, um häufig besuchte Inhalte als Schlüssel-Nachbarschaft festzulegen, und konstruiert dann eine darauf basierende Faltung.</p>
<p>Da sich die k-hop-Nachbarschaften häufig überschneiden, führt die lokale Faltung auf den Knoten zu wiederholten Berechnungen. Um dies zu vermeiden, bildet PinSage in jedem Aggregationsschritt alle Knoten ohne wiederholte Berechnung ab, verknüpft sie dann mit den entsprechenden Knoten der oberen Ebene und ruft schließlich die Einbettungen der Knoten der oberen Ebene ab.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Deep Graph Bibliothek: Ein skalierbares Python-Paket für Deep Learning auf Graphen</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> ist ein Python-Paket, das für den Aufbau graphbasierter neuronaler Netzwerkmodelle auf bestehenden Deep-Learning-Frameworks (z. B. PyTorch, MXNet, Gluon und andere) entwickelt wurde. DGL enthält eine benutzerfreundliche Backend-Schnittstelle, die die Einbindung in Frameworks, die auf Tensoren basieren und die automatische Generierung unterstützen, erleichtert. Der oben erwähnte PinSage-Algorithmus ist für die Verwendung mit DGL und PyTorch optimiert.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: Eine Open-Source-Vektordatenbank für KI und Ähnlichkeitssuche</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>wie-geht-milvus-arbeit.png</span> </span></p>
<p>Milvus ist eine Open-Source-Vektordatenbank, die für die Suche nach Vektorähnlichkeiten und Anwendungen der künstlichen Intelligenz (KI) entwickelt wurde. Im Großen und Ganzen funktioniert die Verwendung von Milvus für die Ähnlichkeitssuche wie folgt:</p>
<ol>
<li>Deep-Learning-Modelle werden verwendet, um unstrukturierte Daten in Merkmalsvektoren umzuwandeln, die in Milvus importiert werden.</li>
<li>Milvus speichert und indiziert die Merkmalsvektoren.</li>
<li>Auf Anfrage sucht Milvus die Vektoren, die einem Eingabevektor am ähnlichsten sind, und gibt sie zurück.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Aufbau eines graphbasierten Empfehlungssystems mit Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-aufbau-graphenbasiertes-empfehlungs-system.png</span> </span></p>
<p>Der Aufbau eines graphenbasierten Empfehlungssystems mit Milvus umfasst die folgenden Schritte:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Schritt 1: Daten vorverarbeiten</h3><p>Bei der Datenvorverarbeitung werden die Rohdaten in ein leichter verständliches Format gebracht. In diesem Beispiel werden die offenen Datensätze MovieLens[5] (m1-1m) verwendet, die 1.000.000 Bewertungen von 4.000 Filmen enthalten, die von 6.000 Benutzern beigetragen wurden. Diese Daten wurden von GroupLens gesammelt und enthalten Filmbeschreibungen, Filmbewertungen und Benutzereigenschaften.</p>
<p>Beachten Sie, dass die in diesem Beispiel verwendeten MovieLens-Datensätze nur eine minimale Datenbereinigung oder -organisation erfordern. Wenn Sie jedoch andere Datensätze verwenden, können Ihre Erfahrungen davon abweichen.</p>
<p>Um mit dem Aufbau eines Empfehlungssystems zu beginnen, erstellen Sie einen bipartiten Graphen für Klassifizierungszwecke unter Verwendung historischer Benutzer-Film-Daten aus dem MovieLens-Datensatz.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Schritt 2: Modell mit PinSage trainieren</h3><p>Die mit dem PinSage-Modell erzeugten Einbettungsvektoren von Pins sind Merkmalsvektoren der erfassten Filminformationen. Erstellen Sie ein PinSage-Modell, das auf dem bipartiten Graphen g und den benutzerdefinierten Film-Merkmalsvektor-Dimensionen (standardmäßig 256-d) basiert. Dann trainieren Sie das Modell mit PyTorch, um die h_item Einbettungen von 4.000 Filmen zu erhalten.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Schritt 3: Laden der Daten</h3><p>Laden Sie die vom PinSage-Modell generierten Filmeinbettungen h_item in Milvus, das die entsprechenden IDs zurückgibt. Importieren Sie die IDs und die entsprechenden Filminformationen in MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Schritt 4: Durchführen einer Vektorähnlichkeitssuche</h3><p>Ermitteln Sie die entsprechenden Einbettungen in Milvus auf der Grundlage der Film-IDs und führen Sie dann mit Milvus eine Ähnlichkeitssuche mit diesen Einbettungen durch. Anschließend identifizieren Sie die entsprechenden Filminformationen in einer MySQL-Datenbank.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Schritt 5: Empfehlungen abrufen</h3><p>Das System wird nun die Filme empfehlen, die den Suchanfragen der Benutzer am ähnlichsten sind. Dies ist der allgemeine Arbeitsablauf für den Aufbau eines Empfehlungssystems. Um Empfehlungssysteme und andere KI-Anwendungen schnell zu testen und einzusetzen, sollten Sie das <a href="https://github.com/milvus-io/bootcamp">Milvus-Bootcamp</a> ausprobieren.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus kann mehr als nur Empfehlungssysteme betreiben<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist ein leistungsstarkes Tool, das eine Vielzahl von Anwendungen für künstliche Intelligenz und Vektorähnlichkeitssuche unterstützt. Wenn Sie mehr über das Projekt erfahren möchten, lesen Sie die folgenden Ressourcen:</p>
<ul>
<li>Lesen Sie unseren <a href="https://zilliz.com/blog">Blog</a>.</li>
<li>Interagieren Sie mit unserer Open-Source-Community auf <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Nutzen Sie die beliebteste Vektordatenbank der Welt auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie zu ihr bei.</li>
</ul>
