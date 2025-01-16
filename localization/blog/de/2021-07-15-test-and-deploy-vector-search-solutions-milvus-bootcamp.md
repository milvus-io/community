---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Schnelles Testen und Bereitstellen von Vektorsuchlösungen mit dem Milvus 2.0
  Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Erstellen, Testen und Anpassen von Lösungen für die Suche nach
  Vektorähnlichkeit mit Milvus, einer Open-Source-Vektordatenbank.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Schnelles Testen und Bereitstellen von Vektorsuchlösungen mit dem Milvus 2.0 Bootcamp</custom-h1><p>Mit der Veröffentlichung von Milvus 2.0 hat das Team das <a href="https://github.com/milvus-io/bootcamp">Milvus-Bootcamp</a> überarbeitet. Das neue und verbesserte Bootcamp bietet aktualisierte Anleitungen und leichter nachvollziehbare Codebeispiele für eine Vielzahl von Anwendungsfällen und Implementierungen. Darüber hinaus wurde diese neue Version für <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a> aktualisiert, eine neu gestaltete Version der weltweit fortschrittlichsten Vektordatenbank.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Stresstest für Ihr System anhand von 1M- und 100M-Datensatz-Benchmarks</h3><p>Das <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">Benchmark-Verzeichnis</a> enthält 1 Million und 100 Millionen Vektor-Benchmark-Tests, die zeigen, wie Ihr System auf unterschiedlich große Datensätze reagieren wird.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Erforschen und erstellen Sie beliebte Lösungen für die Vektorähnlichkeitssuche</h3><p>Das <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">Lösungsverzeichnis</a> enthält die gängigsten Anwendungsfälle für die Vektorähnlichkeitssuche. Jeder Anwendungsfall enthält eine Notebook-Lösung und eine mit Docker bereitstellbare Lösung. Zu den Anwendungsfällen gehören:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Bildähnlichkeitssuche</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Video-Ähnlichkeitssuche</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Audio-Ähnlichkeitssuche</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Empfehlungssystem</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Molekulare Suche</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">System zur Beantwortung von Fragen</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Schnelle Bereitstellung einer vollständig erstellten Anwendung auf einem beliebigen System</h3><p>Bei den Quick-Deployment-Lösungen handelt es sich um Docker-Lösungen, mit denen Benutzer vollständig erstellte Anwendungen auf jedem beliebigen System bereitstellen können. Diese Lösungen eignen sich ideal für kurze Demos, erfordern aber im Vergleich zu Notebooks mehr Arbeit bei der Anpassung und beim Verständnis.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Verwenden Sie szenariospezifische Notebooks zur einfachen Bereitstellung vorkonfigurierter Anwendungen</h3><p>Die Notebooks enthalten ein einfaches Beispiel für den Einsatz von Milvus zur Lösung eines Problems in einem bestimmten Anwendungsfall. Jedes der Beispiele kann von Anfang bis Ende ausgeführt werden, ohne dass Dateien oder Konfigurationen verwaltet werden müssen. Jedes Notizbuch ist außerdem leicht nachvollziehbar und veränderbar, so dass es sich ideal als Basis für andere Projekte eignet.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Beispiel für ein Notizbuch zur Bildähnlichkeitssuche</h3><p>Die Ähnlichkeitssuche von Bildern ist eine der Kernideen hinter vielen verschiedenen Technologien, einschließlich autonomer Autos, die Objekte erkennen. In diesem Beispiel wird erklärt, wie man mit Milvus auf einfache Weise Computer-Vision-Programme erstellen kann.</p>
<p>Dieses Notizbuch dreht sich um drei Dinge:</p>
<ul>
<li>Milvus-Server</li>
<li>Redis-Server (für die Speicherung von Metadaten)</li>
<li>Vortrainiertes Resnet-18-Modell.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Schritt 1: Herunterladen der benötigten Pakete</h4><p>Beginnen Sie mit dem Herunterladen aller für dieses Projekt erforderlichen Pakete. Dieses Notizbuch enthält eine Tabelle, in der die zu verwendenden Pakete aufgelistet sind.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Schritt 2: Starten des Servers</h4><p>Nachdem die Pakete installiert sind, starten Sie die Server und stellen sicher, dass beide ordnungsgemäß laufen. Achten Sie darauf, dass Sie die richtigen Anweisungen zum Starten der <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus-</a> und <a href="https://hub.docker.com/_/redis">Redis-Server</a> befolgen.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Schritt 3: Herunterladen von Projektdaten</h4><p>Standardmäßig lädt dieses Notizbuch einen Ausschnitt der VOCImage-Daten als Beispiel herunter, aber jedes Verzeichnis mit Bildern sollte funktionieren, solange es der Dateistruktur folgt, die oben im Notizbuch zu sehen ist.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Schritt 4: Verbindung zu den Servern herstellen</h4><p>In diesem Beispiel laufen die Server auf den Standardports auf dem localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Schritt 5: Erstellen Sie eine Sammlung</h4><p>Nachdem Sie die Server gestartet haben, erstellen Sie eine Sammlung in Milvus, um alle Vektoren zu speichern. In diesem Beispiel wird die Dimensionsgröße auf 512, die Größe der resnet-18-Ausgabe, und die Ähnlichkeitsmetrik auf den euklidischen Abstand (L2) eingestellt. Milvus unterstützt eine Vielzahl verschiedener <a href="https://milvus.io/docs/v2.0.x/metric.md">Ähnlichkeitsmetriken</a>.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Schritt 6: Erstellen eines Index für die Sammlung</h4><p>Sobald die Sammlung erstellt ist, erstellen Sie einen Index für sie. In diesem Fall wird der Index IVF_SQ8 verwendet. Dieser Index erfordert den Parameter "nlist", der Milvus mitteilt, wie viele Cluster in jeder Datendatei (Segment) gebildet werden sollen. Verschiedene <a href="https://milvus.io/docs/v2.0.x/index.md">Indizes</a> erfordern verschiedene Parameter.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Schritt 7: Modell und Datenlader einrichten</h4><p>Nachdem der IVF_SQ8-Index erstellt wurde, richten Sie das neuronale Netz und den Datenlader ein. Das in diesem Beispiel verwendete vortrainierte pytorch resnet-18 verfügt nicht über die letzte Schicht, die Vektoren für die Klassifizierung komprimiert, wodurch wertvolle Informationen verloren gehen können.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Der Datensatz und der Datenlader müssen so modifiziert werden, dass sie in der Lage sind, die Bilder vorzuverarbeiten und zu stapeln und gleichzeitig die Dateipfade der Bilder bereitzustellen. Dies kann mit einem leicht modifizierten Torchvision-Datenlader erreicht werden. Für die Vorverarbeitung müssen die Bilder beschnitten und normalisiert werden, da das resnet-18-Modell auf eine bestimmte Größe und einen bestimmten Wertebereich trainiert wurde.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Schritt 8: Einfügen von Vektoren in die Sammlung</h4><p>Wenn die Sammlung eingerichtet ist, können die Bilder verarbeitet und in die erstellte Sammlung geladen werden. Zunächst werden die Bilder vom Datenlader gezogen und durch das resnet-18-Modell geleitet. Die resultierenden Vektoreinbettungen werden dann in Milvus eingefügt, das für jeden Vektor eine eindeutige ID zurückgibt. Die Vektor-IDs und Bilddateipfade werden dann als Schlüssel-Wert-Paare in den Redis-Server eingefügt.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Schritt 9: Durchführen einer Vektorähnlichkeitssuche</h4><p>Sobald alle Daten in Milvus und Redis eingefügt sind, kann die eigentliche Vektorähnlichkeitssuche durchgeführt werden. In diesem Beispiel werden drei zufällig ausgewählte Bilder aus dem Redis-Server für eine Vektorähnlichkeitssuche herangezogen.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Diese Bilder durchlaufen zunächst die gleiche Vorverarbeitung wie in Schritt 7 und werden dann durch das resnet-18-Modell gejagt.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>Anschließend werden die resultierenden Vektoreinbettungen für eine Suche verwendet. Zunächst werden die Suchparameter festgelegt, darunter der Name der zu durchsuchenden Sammlung, nprobe (die Anzahl der zu durchsuchenden Cluster) und top_k (die Anzahl der zurückgegebenen Vektoren). In diesem Beispiel sollte die Suche sehr schnell sein.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Schritt 10: Ergebnisse der Bildsuche</h4><p>Die von den Abfragen zurückgegebenen Vektor-IDs werden verwendet, um die entsprechenden Bilder zu finden. Matplotlib wird dann verwendet, um die Ergebnisse der Bildsuche anzuzeigen.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Erfahren Sie, wie Sie Milvus in verschiedenen Umgebungen einsetzen können</h3><p>Der <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">Abschnitt "Einsatz"</a> des neuen Bootcamps enthält alle Informationen zur Verwendung von Milvus in verschiedenen Umgebungen und Konfigurationen. Dazu gehören die Bereitstellung von Mishards, die Verwendung von Kubernetes mit Milvus, Lastausgleich und vieles mehr. Für jede Umgebung gibt es eine detaillierte Schritt-für-Schritt-Anleitung, die erklärt, wie man Milvus in dieser Umgebung zum Laufen bringt.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Seien Sie kein Fremder</h3><ul>
<li>Lesen Sie unseren <a href="https://zilliz.com/blog">Blog</a>.</li>
<li>Interagieren Sie mit unserer Open-Source-Community auf <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verwenden Sie Milvus, die beliebteste Vektordatenbank der Welt, auf <a href="https://github.com/milvus-io/milvus">Github</a> oder tragen Sie zu ihr bei.</li>
</ul>
