---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Kreativere und kuratierte Bilder im Ghibli-Stil mit GPT-4o und Milvus
  generieren
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Verbinden Sie Ihre privaten Daten mit GPT-4o und nutzen Sie Milvus für mehr
  kuratierte Bildausgaben
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Mit GPT-4o wurde jeder über Nacht zum Künstler<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Ob Sie es glauben oder nicht, das Bild, das Sie gerade gesehen haben, wurde von KI generiert - und zwar von dem kürzlich veröffentlichten GPT-4o!</em></p>
<p>Als OpenAI am 26. März die native Bilderzeugungsfunktion von GPT-4o vorstellte, konnte niemand den kreativen Tsunami vorhersehen, der darauf folgte. Über Nacht explodierte das Internet mit KI-generierten Porträts im Ghibli-Stil - Prominente, Politiker, Haustiere und sogar die Nutzer selbst wurden mit ein paar einfachen Anweisungen in charmante Studio Ghibli-Figuren verwandelt. Die Nachfrage war so überwältigend, dass Sam Altman selbst die Nutzerinnen und Nutzer anflehen musste, langsamer zu machen, indem er twitterte, dass die "GPUs von OpenAI schmelzen".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Beispiel für mit GPT-4o generierte Bilder (Credit X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Warum GPT-4o alles verändert<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Für die Kreativbranche bedeutet dies einen Paradigmenwechsel. Aufgaben, für die früher ein ganzes Designteam einen ganzen Tag brauchte, können jetzt in wenigen Minuten erledigt werden. Was GPT-4o von früheren Bildgeneratoren unterscheidet, ist <strong>seine bemerkenswerte visuelle Konsistenz und seine intuitive Benutzeroberfläche</strong>. Es unterstützt Multiturn-Konversationen, mit denen Sie Bilder durch Hinzufügen von Elementen, Anpassen von Proportionen, Ändern von Stilen oder sogar Umwandeln von 2D in 3D verfeinern können - im Grunde genommen haben Sie damit einen professionellen Designer in der Tasche.</p>
<p>Das Geheimnis hinter der überragenden Leistung von GPT-4o? Es ist die autoregressive Architektur. Im Gegensatz zu Diffusionsmodellen (wie z. B. Stable Diffusion), die Bilder vor der Rekonstruktion zu Rauschen degradieren, generiert GPT-4o Bilder sequenziell - ein Token nach dem anderen - und behält während des gesamten Prozesses das Kontextbewusstsein bei. Dieser grundlegende architektonische Unterschied erklärt, warum GPT-4o kohärentere Ergebnisse mit einfacheren, natürlicheren Eingabeaufforderungen liefert.</p>
<p>Aber hier wird es für Entwickler interessant: <strong>Immer mehr Anzeichen deuten auf einen wichtigen Trend hin - KI-Modelle werden selbst zu Produkten. Einfach ausgedrückt: Die meisten Produkte, die einfach große KI-Modelle um öffentlich zugängliche Daten wickeln, laufen Gefahr, ins Hintertreffen zu geraten.</strong></p>
<p>Die wahre Stärke dieser Fortschritte ergibt sich aus der Kombination von großen Allzweckmodellen mit <strong>privaten, domänenspezifischen Daten</strong>. Diese Kombination könnte für die meisten Unternehmen die optimale Überlebensstrategie in der Ära der großen Sprachmodelle sein. Während sich die Basismodelle weiterentwickeln, wird der dauerhafte Wettbewerbsvorteil denjenigen gehören, die ihre eigenen Datensätze effektiv mit diesen leistungsstarken KI-Systemen integrieren können.</p>
<p>Lassen Sie uns untersuchen, wie Sie Ihre privaten Daten mit GPT-4o verbinden können, indem wir Milvus, eine quelloffene und leistungsstarke Vektordatenbank, verwenden.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Verbinden Sie Ihre privaten Daten mit GPT-4o mit Milvus für mehr kuratierte Bildausgaben<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken sind die Schlüsseltechnologie für die Verbindung Ihrer privaten Daten mit KI-Modellen. Sie konvertieren Ihre Inhalte - ob Bilder, Text oder Audio - in mathematische Darstellungen (Vektoren), die deren Bedeutung und Eigenschaften erfassen. Dies ermöglicht eine semantische Suche, die auf Ähnlichkeiten und nicht nur auf Schlüsselwörtern basiert.</p>
<p>Als führende Open-Source-Vektordatenbank eignet sich Milvus besonders gut für die Verbindung mit generativen KI-Tools wie GPT-4o. Im Folgenden zeige ich, wie ich die Datenbank zur Lösung einer persönlichen Herausforderung eingesetzt habe.</p>
<h3 id="Background" class="common-anchor-header">Hintergrund</h3><p>Eines Tages hatte ich die brillante Idee, den ganzen Unfug meines Hundes Cola in einen Comic zu verwandeln. Aber es gab einen Haken: Wie konnte ich Zehntausende von Fotos von der Arbeit, von Reisen und von Essensabenteuern durchforsten, um Colas schelmische Momente zu finden?</p>
<p>Die Lösung? Ich importierte alle meine Fotos in Milvus und führte eine Bildsuche durch.</p>
<p>Lassen Sie uns die Implementierung Schritt für Schritt durchgehen.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Abhängigkeiten und Umgebung</h4><p>Zunächst müssen Sie Ihre Umgebung mit den richtigen Paketen vorbereiten:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Bereiten Sie die Daten vor</h4><p>In dieser Anleitung verwende ich meine Fotobibliothek mit etwa 30.000 Fotos als Datensatz. Wenn Sie keinen Datensatz zur Hand haben, laden Sie einen Beispieldatensatz von Milvus herunter und entpacken Sie ihn:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Definieren Sie den Feature Extractor</h4><p>Wir werden den ResNet-50-Modus aus der <code translate="no">timm</code> -Bibliothek verwenden, um Einbettungsvektoren aus unseren Bildern zu extrahieren. Dieses Modell wurde auf Millionen von Bildern trainiert und kann aussagekräftige Merkmale extrahieren, die den visuellen Inhalt repräsentieren.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Erstellen einer Milvus-Sammlung</h4><p>Als Nächstes erstellen wir eine Milvus-Sammlung, um unsere Bildeinbettungen zu speichern. Stellen Sie sich dies als eine spezielle Datenbank vor, die explizit für die Vektorähnlichkeitssuche entwickelt wurde:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweise zu den MilvusClient-Parametern:</strong></p>
<ul>
<li><p><strong>Lokale Einrichtung:</strong> Die Verwendung einer lokalen Datei (z. B. <code translate="no">./milvus.db</code>) ist der einfachste Weg, um loszulegen - Milvus Lite verwaltet alle Ihre Daten.</p></li>
<li><p><strong>Scale Up:</strong> Für große Datensätze richten Sie einen robusten Milvus-Server mit Docker oder Kubernetes ein und verwenden dessen URI (z. B. <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Cloud-Option:</strong> Wenn Sie die Zilliz Cloud nutzen (den vollständig verwalteten Service von Milvus), passen Sie Ihre URI und Ihr Token an den öffentlichen Endpunkt und den API-Schlüssel an.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Einfügen von Bildeinbettungen in Milvus</h4><p>Nun folgt der Prozess der Analyse jedes Bildes und der Speicherung seiner Vektordarstellung. Dieser Schritt kann je nach Größe Ihres Datensatzes einige Zeit in Anspruch nehmen, ist aber ein einmaliger Vorgang:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Durchführen einer Bildsuche</h4><p>Nachdem unsere Datenbank gefüllt ist, können wir nun nach ähnlichen Bildern suchen. Das ist der Punkt, an dem die Magie passiert - wir können visuell ähnliche Fotos mithilfe der Vektorähnlichkeit finden:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Die zurückgegebenen Bilder werden wie unten dargestellt:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Kombinieren Sie die Vektorsuche mit GPT-4o: Generierung von Bildern im Ghibli-Stil mit von Milvus zurückgegebenen Bildern</h3><p>Jetzt kommt der spannende Teil: die Verwendung der Suchergebnisse als Input für GPT-4o, um kreative Inhalte zu generieren. In meinem Fall wollte ich auf der Grundlage von Fotos, die ich gemacht habe, Comics mit meinem Hund Cola erstellen.</p>
<p>Der Arbeitsablauf ist einfach, aber wirkungsvoll:</p>
<ol>
<li><p>Verwenden Sie die Vektorsuche, um relevante Bilder von Cola aus meiner Sammlung zu finden.</p></li>
<li><p>Einspeisen dieser Bilder in GPT-4o mit kreativen Vorgaben</p></li>
<li><p>Generierung einzigartiger Comics auf der Grundlage visueller Inspiration</p></li>
</ol>
<p>Hier sind einige Beispiele dafür, was diese Kombination hervorbringen kann:</p>
<p><strong>Die Aufforderungen, die ich verwende:</strong></p>
<ul>
<li><p><em>"Erstelle einen vierteiligen, vollfarbigen, lustigen Comic über einen Border Collie, der beim Nagen an einer Maus erwischt wird - mit einem peinlichen Moment, wenn der Besitzer es herausfindet."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Zeichne einen Comic, in dem dieser Hund ein süßes Outfit trägt."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Zeichne nach dem Vorbild dieses Hundes einen Comic, in dem er die Hogwarts-Schule für Hexerei und Zauberei besucht."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Ein paar schnelle Tipps aus meiner Erfahrung mit der Bilderstellung:</h3><ol>
<li><p><strong>Halten Sie es einfach</strong>: Im Gegensatz zu diesen heiklen Diffusionsmodellen funktioniert GPT-4o am besten mit einfachen Aufforderungen. Ich habe mich dabei ertappt, dass ich im Laufe der Zeit immer kürzere Prompts geschrieben habe und dadurch bessere Ergebnisse erzielt habe.</p></li>
<li><p><strong>Englisch funktioniert am besten</strong>: Ich habe versucht, die Prompts für einige Comics auf Chinesisch zu schreiben, aber die Ergebnisse waren nicht besonders gut. Am Ende habe ich die Aufforderungen auf Englisch geschrieben und die fertigen Comics dann bei Bedarf übersetzt.</p></li>
<li><p><strong>Nicht gut für Video Generation</strong>: Machen Sie sich keine allzu großen Hoffnungen auf Sora - KI-generierte Videos müssen sich noch weiterentwickeln, wenn es um flüssige Bewegungen und kohärente Handlungsstränge geht.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">Was kommt als Nächstes? Meine Sichtweise und offen für Diskussionen<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein kurzer Blick auf die wichtigsten Veröffentlichungen von OpenAI in den letzten sechs Monaten zeigt ein klares Muster: Ob GPTs für App-Marktplätze, DeepResearch für die Erstellung von Berichten, GPT-4o für die Erstellung von Konversationsbildern oder Sora für Videomagie - große KI-Modelle treten aus dem Verborgenen ins Rampenlicht. Was einst als experimentelle Technologie galt, reift nun zu echten, nutzbaren Produkten heran.</p>
<p>Da sich GPT-4o und ähnliche Modelle auf breiter Front durchsetzen, werden die meisten Workflows und intelligenten Agenten, die auf stabiler Diffusion basieren, bald überflüssig. Der unersetzliche Wert privater Daten und menschlicher Erkenntnisse bleibt jedoch bestehen. So wird KI zwar Kreativagenturen nicht vollständig ersetzen, aber die Integration einer Milvus-Vektordatenbank mit GPT-Modellen ermöglicht es Agenturen, schnell neue, kreative Ideen zu entwickeln, die von ihren bisherigen Erfolgen inspiriert sind. E-Commerce-Plattformen können auf der Grundlage von Einkaufstrends personalisierte Kleidung entwerfen, und akademische Einrichtungen können im Handumdrehen visuelle Darstellungen für Forschungsarbeiten erstellen.</p>
<p>Das Zeitalter der von KI-Modellen gesteuerten Produkte ist angebrochen, und der Wettlauf um die Ausbeutung der Datenmine hat gerade erst begonnen. Für Entwickler und Unternehmen gleichermaßen ist die Botschaft klar: Kombinieren Sie Ihre einzigartigen Daten mit diesen leistungsstarken Modellen oder riskieren Sie, den Anschluss zu verlieren.</p>
