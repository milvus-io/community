---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: >-
  Nano Banana + Milvus: Aus dem Hype wird ein unternehmenstauglicher
  multimodaler RAG
author: Lumina Wang
date: 2025-09-04T00:00:00.000Z
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, nano banana'
meta_keywords: 'Vibe coding, nano banana, Milvus, model context protocol'
meta_title: |
  Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: >-
  zeigen wir Ihnen, wie Sie Nano Banana und Milvus kombinieren können, um ein
  unternehmensfähiges multimodales RAG-System aufzubauen - und warum diese
  Kombination die nächste Welle von KI-Anwendungen eröffnet.
origin: >-
  https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---
<p>Nano Banana geht in den sozialen Medien gerade viral und das aus gutem Grund! Sie haben wahrscheinlich die Bilder gesehen, die es erzeugt, oder es sogar selbst ausprobiert. Es handelt sich um ein neuestes Modell zur Bilderzeugung, das einfachen Text mit verblüffender Präzision und Geschwindigkeit in Bilder in Sammlerqualität verwandelt.</p>
<p>Geben Sie z. B. ein <em>: "Tausche Elons Hut und Rock",</em> und in etwa 16 Sekunden erhalten Sie ein fotorealistisches Ergebnis: Hemd zurechtgerückt, Farben gemischt, Accessoires an Ort und Stelle - keine manuellen Bearbeitungen. Keine Verzögerung.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beach_side_668179b830.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ich konnte auch nicht widerstehen, es zu testen. Meine Aufforderung lautete:</p>
<p><em>"Verwenden Sie das Nano Banana Modell, um eine kommerzielle Figur im Maßstab 1:7 der Figur in der Illustration in einem realistischen Stil und Umfeld zu erstellen. Stellen Sie die Figur auf einen Computertisch und verwenden Sie eine runde, transparente Acrylplatte ohne jeglichen Text. Zeigen Sie auf dem Computerbildschirm den ZBrush-Modellierungsprozess der Figur an. Legen Sie neben den Bildschirm eine Spielzeugverpackung im Bandai-Stil, die mit dem Original-Artwork bedruckt ist.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Ergebnis hat mich umgehauen - es sah aus wie ein Produktionsprototyp direkt von einem Messestand.</p>
<p>Es ist keine Überraschung, dass die Teams bereits ernsthafte Anwendungsfälle dafür gefunden haben. Einer unserer Kunden, eine mobile Unterhaltungsplattform mit Gacha- und Anzieh-Spielen, entwickelt eine Funktion, die es den Spielern ermöglicht, Fotos hochzuladen und ihre Avatare im Handumdrehen mit Accessoires aus dem Spiel auszustatten. E-Commerce-Marken experimentieren mit dem Prinzip "einmal fotografieren, immer wieder verwenden": Sie nehmen ein Basismodell auf und generieren dann mit Hilfe von KI endlose Outfit- und Frisurenvariationen, anstatt 20 Mal im Studio neu zu fotografieren.</p>
<p>Aber hier ist der Haken: Die Bilderzeugung allein löst nicht das ganze Problem. Diese Systeme benötigen auch ein <strong>intelligentes Retrieval</strong>: die Fähigkeit, sofort die richtigen Outfits, Requisiten und visuellen Elemente aus riesigen, unstrukturierten Medienbibliotheken zu finden. Ohne diese Fähigkeit tappt das generative Modell im Dunkeln. Was Unternehmen wirklich brauchen, ist ein <strong>multimodales RAG-System (Retrieval-Augmented Generation), bei dem</strong>Nano Banana für die Kreativität und eine leistungsstarke Vektordatenbank für den Kontext sorgt.</p>
<p>Hier kommt <strong>Milvus</strong> ins Spiel. Als Open-Source-Vektordatenbank kann Milvus Milliarden von Einbettungen indizieren und durchsuchen - Bilder, Text, Audio und mehr. In Verbindung mit Nano Banana wird Milvus zum Rückgrat einer produktionsreifen multimodalen RAG-Pipeline: Suche, Abgleich und Generierung im Unternehmensmaßstab.</p>
<p>Im weiteren Verlauf dieses Blogs zeigen wir Ihnen, wie Sie Nano Banana und Milvus kombinieren können, um ein unternehmensfähiges multimodales RAG-System aufzubauen - und warum diese Kombination die nächste Welle von KI-Anwendungen ermöglicht.</p>
<h2 id="Building-a-Text-to-Image-Retrieval-Engine" class="common-anchor-header">Aufbau einer Text-to-Image Retrieval Engine<button data-href="#Building-a-Text-to-Image-Retrieval-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Für schnelllebige Konsumgütermarken, Spielestudios und Medienunternehmen ist der Engpass bei der KI-Bilderzeugung nicht das Modell, sondern das Chaos.</p>
<p>Ihre Archive sind ein Sumpf aus unstrukturierten Daten, darunter Produktaufnahmen, Charakter-Assets, Werbevideos und Outfit-Renderings. Und wenn Sie "den roten Umhang aus der letzten Lunar-Kollektion" suchen, haben Sie Pech - die herkömmliche stichwortbasierte Suche kann das nicht leisten.</p>
<p>Die Lösung? Erstellen Sie ein <strong>Text-zu-Bild-Retrieval-System</strong>.</p>
<p>Und so geht's: Verwenden Sie <a href="https://openai.com/research/clip?utm_source=chatgpt.com">CLIP</a>, um sowohl Text- als auch Bilddaten in Vektoren einzubetten. Speichern Sie diese Vektoren in <strong>Milvus</strong>, der Open-Source-Vektordatenbank, die speziell für die Ähnlichkeitssuche entwickelt wurde. Wenn dann ein Benutzer eine Beschreibung eingibt ("roter Seidenumhang mit goldenen Verzierungen"), schlagen Sie in der Datenbank die drei semantisch ähnlichsten Bilder vor.</p>
<p>Das ist schnell. Es ist skalierbar. Und es verwandelt Ihre unübersichtliche Mediathek in eine strukturierte, abfragbare Asset-Bank.</p>
<p>Hier ist, wie man es baut:</p>
<p>Abhängigkeiten installieren</p>
<pre><code translate="no"><span class="hljs-comment"># Install necessary packages</span>
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
<button class="copy-code-btn"></button></code></pre>
<p>Erforderliche Bibliotheken importieren</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> clip
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">import</span> matplotlib.pyplot <span class="hljs-keyword">as</span> plt
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
<span class="hljs-keyword">import</span> math

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All libraries imported successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus-Client initialisieren</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,token=<span class="hljs-string">&quot;root:Miluvs&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus client initialized successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>CLIP-Modell laden</p>
<pre><code translate="no"><span class="hljs-comment"># Load CLIP model</span>
model_name = <span class="hljs-string">&quot;ViT-B/32&quot;</span>
device = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
model, preprocess = clip.load(model_name, device=device)
model.<span class="hljs-built_in">eval</span>()

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;CLIP model &#x27;<span class="hljs-subst">{model_name}</span>&#x27; loaded successfully, running on device: <span class="hljs-subst">{device}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model input resolution: <span class="hljs-subst">{model.visual.input_resolution}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Context length: <span class="hljs-subst">{model.context_length}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Vocabulary size: <span class="hljs-subst">{model.vocab_size}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ergebnis ausgeben:</p>
<pre><code translate="no"><span class="hljs-variable constant_">CLIP</span> model <span class="hljs-string">`ViT-B/32`</span> loaded successfully, running <span class="hljs-attr">on</span>: cpu
 <span class="hljs-title class_">Model</span> input <span class="hljs-attr">resolution</span>: <span class="hljs-number">224</span>
 <span class="hljs-title class_">Context</span> <span class="hljs-attr">length</span>: <span class="hljs-number">77</span>
 <span class="hljs-title class_">Vocabulary</span> <span class="hljs-attr">size</span>: <span class="hljs-number">49</span>,<span class="hljs-number">408</span>
<button class="copy-code-btn"></button></code></pre>
<p>Funktionen zur Merkmalsextraktion definieren</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_image</span>(<span class="hljs-params">image_path</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode image into normalized feature vector&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        image = preprocess(Image.<span class="hljs-built_in">open</span>(image_path)).unsqueeze(<span class="hljs-number">0</span>).to(device)
        
        <span class="hljs-keyword">with</span> torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
        
        <span class="hljs-keyword">return</span> image_features.squeeze().cpu().tolist()
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Error processing image <span class="hljs-subst">{image_path}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_text</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text into normalized feature vector&quot;&quot;&quot;</span>
    text_tokens = clip.tokenize([text]).to(device)
    
    <span class="hljs-keyword">with</span> torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
    
    <span class="hljs-keyword">return</span> text_features.squeeze().cpu().tolist()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Feature extraction functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus-Sammlung erstellen</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;production_image_collection&quot;</span>
<span class="hljs-comment"># If collection already exists, delete it</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Existing collection deleted: <span class="hljs-subst">{collection_name}</span>&quot;</span>)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=<span class="hljs-number">512</span>,  <span class="hljs-comment"># CLIP ViT-B/32 embedding dimension</span>
    auto_id=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Auto-generate ID</span>
    enable_dynamic_field=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Enable dynamic fields</span>
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>  <span class="hljs-comment"># Use cosine similarity</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; created successfully!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection info: <span class="hljs-subst">{milvus_client.describe_collection(collection_name)}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Erfolgreiche Erstellung der Sammlung ausgeben:</p>
<pre><code translate="no">Existing collection deleted: production_image_collection
Collection <span class="hljs-string">&#x27;production_image_collection&#x27;</span> created successfully!
Collection info: {<span class="hljs-string">&#x27;collection_name&#x27;</span>: <span class="hljs-string">&#x27;production_image_collection&#x27;</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;num_shards&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {}, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">101</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;vector&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">512</span>}}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">102</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;function&#x27;</span>: [], <span class="hljs-string">&#x27;aliases&#x27;</span>: [], <span class="hljs-string">&#x27;collection_id&#x27;</span>: <span class="hljs-number">460508990706033544</span>, <span class="hljs-string">&#x27;consistency_level&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;properties&#x27;</span>: {}, <span class="hljs-string">&#x27;num_partitions&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;created_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>, <span class="hljs-string">&#x27;updated_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Bilder verarbeiten und einfügen</p>
<pre><code translate="no"><span class="hljs-comment"># Set image directory path</span>
image_dir = <span class="hljs-string">&quot;./production_image&quot;</span>
raw_data = []

<span class="hljs-comment"># Get all supported image formats</span>
image_extensions = [<span class="hljs-string">&#x27;*.jpg&#x27;</span>, <span class="hljs-string">&#x27;*.jpeg&#x27;</span>, <span class="hljs-string">&#x27;*.png&#x27;</span>, <span class="hljs-string">&#x27;*.JPEG&#x27;</span>, <span class="hljs-string">&#x27;*.JPG&#x27;</span>, <span class="hljs-string">&#x27;*.PNG&#x27;</span>]
image_paths = []

<span class="hljs-keyword">for</span> ext <span class="hljs-keyword">in</span> image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> images in <span class="hljs-subst">{image_dir}</span>&quot;</span>)

<span class="hljs-comment"># Process images and generate embeddings</span>
successful_count = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> i, image_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(image_paths):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Processing progress: <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> - <span class="hljs-subst">{os.path.basename(image_path)}</span>&quot;</span>)
    
    image_embedding = encode_image(image_path)
    <span class="hljs-keyword">if</span> image_embedding <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image_dict = {
            <span class="hljs-string">&quot;vector&quot;</span>: image_embedding,
            <span class="hljs-string">&quot;filepath&quot;</span>: image_path,
            <span class="hljs-string">&quot;filename&quot;</span>: os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += <span class="hljs-number">1</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully processed <span class="hljs-subst">{successful_count}</span> images&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Fortschritt der Bildverarbeitung ausgegeben:</p>
<pre><code translate="no">Found 50 images <span class="hljs-keyword">in</span> ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
<button class="copy-code-btn"></button></code></pre>
<p>Daten in Milvus einfügen</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data into Milvus</span>
<span class="hljs-keyword">if</span> raw_data:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Inserting data into Milvus...&quot;</span>)
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> images into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample inserted IDs: <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;ids&#x27;</span>][:<span class="hljs-number">5</span>]}</span>...&quot;</span>)  <span class="hljs-comment"># Show first 5 IDs</span>
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No successfully processed image data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Definieren von Such- und Visualisierungsfunktionen</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_images_by_text</span>(<span class="hljs-params">query_text, top_k=<span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Search images based on text query&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Search query: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    
    <span class="hljs-comment"># Encode query text</span>
    query_embedding = encode_text(query_text)
    
    <span class="hljs-comment"># Search in Milvus</span>
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;filepath&quot;</span>, <span class="hljs-string">&quot;filename&quot;</span>]
    )
    
    <span class="hljs-keyword">return</span> search_results[<span class="hljs-number">0</span>]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">visualize_search_results</span>(<span class="hljs-params">query_text, results</span>):
    <span class="hljs-string">&quot;&quot;&quot;Visualize search results&quot;&quot;&quot;</span>
    num_images = <span class="hljs-built_in">len</span>(results)
    
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No matching images found&quot;</span>)
        <span class="hljs-keyword">return</span>
    
    <span class="hljs-comment"># Create subplots</span>
    fig, axes = plt.subplots(<span class="hljs-number">1</span>, num_images, figsize=(<span class="hljs-number">5</span>*num_images, <span class="hljs-number">5</span>))
    fig.suptitle(<span class="hljs-string">f&#x27;Search Results: &quot;<span class="hljs-subst">{query_text}</span>&quot; (Top <span class="hljs-subst">{num_images}</span>)&#x27;</span>, fontsize=<span class="hljs-number">16</span>, fontweight=<span class="hljs-string">&#x27;bold&#x27;</span>)
    
    <span class="hljs-comment"># Handle single image case</span>
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">1</span>:
        axes = [axes]
    
    <span class="hljs-comment"># Display images</span>
    <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
        <span class="hljs-keyword">try</span>:
            img_path = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filepath&#x27;</span>]
            filename = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filename&#x27;</span>]
            score = result[<span class="hljs-string">&#x27;distance&#x27;</span>]
            
            <span class="hljs-comment"># Load and display image</span>
            img = Image.<span class="hljs-built_in">open</span>(img_path)
            axes[i].imshow(img)
            axes[i].set_title(<span class="hljs-string">f&quot;<span class="hljs-subst">{filename}</span>\nSimilarity: <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>&quot;</span>, fontsize=<span class="hljs-number">10</span>)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
            
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. File: <span class="hljs-subst">{filename}</span>, Similarity score: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
            
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            axes[i].text(<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>, <span class="hljs-string">f&#x27;Error loading image\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&#x27;</span>,
                        ha=<span class="hljs-string">&#x27;center&#x27;</span>, va=<span class="hljs-string">&#x27;center&#x27;</span>, transform=axes[i].transAxes)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
    
    plt.tight_layout()
    plt.show()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search and visualization functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Text-to-Image-Suche ausführen</p>
<pre><code translate="no"><span class="hljs-comment"># Example search 1</span>
query1 = <span class="hljs-string">&quot;a golden watch&quot;</span>
results1 = search_images_by_text(query1, top_k=<span class="hljs-number">3</span>)
visualize_search_results(query1, results1)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe der Ausführung der Suchanfrage:</p>
<pre><code translate="no"><span class="hljs-title class_">Search</span> <span class="hljs-attr">query</span>: <span class="hljs-string">&#x27;a golden watch&#x27;</span>
<span class="hljs-number">1.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">19</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2934</span>
<span class="hljs-number">2.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">download</span> (<span class="hljs-number">26</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.3073</span>
<span class="hljs-number">3.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">17</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2717</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/watch_067c39ba51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Using-Nano-banana-to-Create-Brand-Promotional-Images" class="common-anchor-header">Verwendung von Nano-banana zur Erstellung von Marken-Werbebildern<button data-href="#Using-Nano-banana-to-Create-Brand-Promotional-Images" class="anchor-icon" translate="no">
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
    </button></h2><p>Jetzt, wo unser Text-zu-Bild-Suchsystem mit Milvus funktioniert, können wir Nano-banana integrieren, um neue Werbeinhalte auf der Grundlage der abgerufenen Assets zu erstellen.</p>
<p>Google SDK installieren</p>
<pre><code translate="no">%pip install google-generativeai
%pip install requests
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Google Generative AI SDK installation complete!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Gemini API konfigurieren</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.<span class="hljs-property">generativeai</span> <span class="hljs-keyword">as</span> genai
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> io <span class="hljs-keyword">import</span> <span class="hljs-title class_">BytesIO</span>
genai.<span class="hljs-title function_">configure</span>(api_key=<span class="hljs-string">&quot;&lt;your_api_key&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Neue Bilder generieren</p>
<pre><code translate="no">prompt = (
    <span class="hljs-string">&quot;An European male model wearing a suit, carrying a gold watch.&quot;</span>
)

image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;/path/to/image/watch.jpg&quot;</span>)

model = genai.GenerativeModel(<span class="hljs-string">&#x27;gemini-2.5-flash-image-preview&#x27;</span>)
response = model.generate_content([prompt, image])

<span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> response.candidates[<span class="hljs-number">0</span>].content.parts:
    <span class="hljs-keyword">if</span> part.text <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">print</span>(part.text)
    <span class="hljs-keyword">elif</span> part.inline_data <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image = Image.<span class="hljs-built_in">open</span>(BytesIO(part.inline_data.data))
        image.save(<span class="hljs-string">&quot;generated_image.png&quot;</span>)
        image.show()
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/suit_976b6f1df2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-This-Means-for-Your-Development-Workflow" class="common-anchor-header">Was dies für Ihren Entwicklungs-Workflow bedeutet<button data-href="#What-This-Means-for-Your-Development-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Als Entwickler ändert diese Integration von Milvus und Nano-banana grundlegend, wie Sie Projekte zur Content-Generierung angehen können. Anstatt statische Asset-Bibliotheken zu verwalten oder sich auf teure Kreativteams zu verlassen, haben Sie jetzt ein dynamisches System, das genau das abruft und generiert, was Ihre Anwendung in Echtzeit benötigt.</p>
<p>Nehmen wir das folgende Kundenszenario: Eine Marke brachte mehrere neue Produkte auf den Markt, entschied sich aber dafür, die herkömmliche Fotoshooting-Pipeline komplett zu überspringen. Mit unserem integrierten System konnte sie sofort Werbebilder generieren, indem sie ihre bestehende Produktdatenbank mit den Generierungsfunktionen von Nano-banana kombinierte.</p>
<p><em>Aufforderung: Ein Model trägt diese Produkte am Strand</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_5a2a042b46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die wahre Leistungsfähigkeit wird deutlich, wenn Sie komplexe, variantenreiche Inhalte erstellen müssen, die normalerweise eine umfangreiche Koordination zwischen Fotografen, Models und Set-Designern erfordern würden. Mit Milvus, das den Abruf von Assets übernimmt, und Nano-banana, das die Generierung verwaltet, können Sie programmgesteuert anspruchsvolle Szenen erstellen, die sich an Ihre spezifischen Anforderungen anpassen:</p>
<p><em>Aufforderung: Ein Model posiert und lehnt an einem blauen Cabrio-Sportwagen. Sie trägt ein Neckholder-Kleid und die dazugehörigen Accessoires. Sie ist mit einer Diamantkette und einer blauen Uhr geschmückt, trägt hohe Absätze an den Füßen und hält einen Labubu-Anhänger in der Hand.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shoes_98e1e4c70b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Für Entwickler, die im Bereich Spiele oder Sammlerstücke arbeiten, eröffnet dieses System völlig neue Möglichkeiten für das Rapid Prototyping und die Konzeptvalidierung. Anstatt wochenlang in die 3D-Modellierung zu investieren, bevor man weiß, ob ein Konzept funktioniert, kann man jetzt fotorealistische Produktvisualisierungen erstellen, die auch die Verpackung, den Umgebungskontext und sogar die Herstellungsprozesse berücksichtigen:</p>
<p><em>Aufforderung: Verwenden Sie das Nanobananenmodell, um eine kommerzielle Figur im Maßstab 1:7 der Figur in der Illustration in einem realistischen Stil und Umfeld zu erstellen. Stellen Sie die Figur auf einen Computertisch und verwenden Sie eine runde, transparente Acrylplatte ohne Text. Zeigen Sie auf dem Computerbildschirm den ZBrush-Modellierungsprozess der Figur an. Legen Sie neben den Computerbildschirm eine Spielzeugverpackung im BANDAI-Stil, die mit der Originalvorlage bedruckt ist.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_3d_5189d53773.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Aus technischer Sicht ist Nano Banana mehr als nur eine Neuheit - es ist in einer Weise produktionsreif, die für Entwickler wichtig ist. Seine größte Stärke ist die Konsistenz und Kontrollierbarkeit, was bedeutet, dass weniger Randfälle in Ihre Anwendungslogik einfließen. Ebenso wichtig ist, dass es die feinen Details handhabt, die automatisierte Pipelines oft zum Scheitern bringen: Konsistenz der Markenfarben, Erzeugung physikalisch plausibler Beleuchtung und Reflexionen und Gewährleistung visueller Kohärenz über mehrere Ausgabeformate hinweg.</p>
<p>Die eigentliche Magie entsteht durch die Kombination mit der Milvus-Vektordatenbank. Eine Vektordatenbank speichert nicht nur Einbettungen, sondern wird zu einem intelligenten Asset-Manager, der die relevantesten historischen Inhalte zur Steuerung neuer Generationen anzeigt. Das Ergebnis: schnellere Generierungszeiten (da das Modell über einen besseren Kontext verfügt), höhere Konsistenz in Ihrer gesamten Anwendung und die Möglichkeit, Marken- oder Stilrichtlinien automatisch durchzusetzen.</p>
<p>Kurz gesagt, Milvus verwandelt Nano Banana von einem kreativen Spielzeug in ein skalierbares Unternehmenssystem.</p>
<p>Natürlich ist kein System fehlerfrei. Komplexe, mehrstufige Anweisungen können immer noch Schluckauf verursachen, und die Beleuchtungsphysik dehnt die Realität manchmal mehr aus, als Ihnen lieb ist. Die zuverlässigste Lösung, die wir gesehen haben, besteht darin, Textanweisungen durch in Milvus gespeicherte Referenzbilder zu ergänzen, was dem Modell eine bessere Grundlage, vorhersehbarere Ergebnisse und kürzere Iterationszyklen verleiht. Mit diesem Setup experimentieren Sie nicht nur mit multimodalem RAG, sondern setzen es auch zuverlässig in der Produktion ein.</p>
