---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Hands-on mit Qwen 3 und Milvus: Aufbau von RAG mit den neuesten hybriden
  Inferenzmodellen
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Wir stellen Ihnen die wichtigsten Funktionen der Qwen 3-Modelle vor und führen
  Sie durch den Prozess der Kopplung von Qwen 3 mit Milvus, um ein lokales,
  kostenbewusstes Retrieval-Augmented-Generation-System (RAG) aufzubauen.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Als Entwickler, der ständig auf der Suche nach praktischen KI-Tools ist, konnte ich den Rummel um die neueste Veröffentlichung von Alibaba Cloud nicht ignorieren: die<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3-Modellfamilie</a>, eine robuste Reihe von acht hybriden Inferenzmodellen, die das Gleichgewicht zwischen Intelligenz und Effizienz neu definieren sollen. In nur 12 Stunden erhielt das Projekt <strong>über 17.000 GitHub-Sterne</strong> und erreichte einen Spitzenwert von <strong>23.000 Downloads</strong> pro Stunde auf Hugging Face.</p>
<p>Was ist also dieses Mal anders? Kurz gesagt, die Qwen 3-Modelle vereinen sowohl das Reasoning (langsame, durchdachte Antworten) als auch das Non-Reasoning (schnelle, effiziente Antworten) in einer einzigen Architektur, umfassen verschiedene Modelloptionen, verbessertes Training und Leistung und bieten mehr unternehmenstaugliche Funktionen.</p>
<p>In diesem Beitrag fasse ich die wichtigsten Funktionen der Qwen 3-Modelle zusammen, auf die Sie achten sollten, und führe Sie durch den Prozess der Kopplung von Qwen 3 mit Milvus, um ein lokales, kostenbewusstes Retrieval-Augmented-Generation-System (RAG) zu erstellen - komplett mit praktischem Code und Tipps zur Optimierung von Leistung und Latenz.</p>
<p>Lassen Sie uns eintauchen.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Was ist das Aufregende an Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem ich Qwen 3 getestet und genauer unter die Lupe genommen habe, ist klar, dass es nicht nur um größere Zahlen auf einem Datenblatt geht. Vielmehr geht es darum, wie die Designentscheidungen des Modells Entwicklern helfen, bessere GenAI-Anwendungen zu entwickeln - schneller, intelligenter und mit mehr Kontrolle. Hier ist, was heraussticht.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Hybride Denkmodi: Intelligent, wenn man sie braucht, schnell, wenn man sie nicht braucht</h3><p>Eine der innovativsten Funktionen von Qwen 3 ist seine <strong>hybride Inferenzarchitektur</strong>. Sie gibt Ihnen die Möglichkeit, genau zu bestimmen, wie viel "Denken" das Modell bei jeder einzelnen Aufgabe an den Tag legt. Schließlich sind nicht alle Aufgaben mit komplizierten Schlussfolgerungen verbunden.</p>
<ul>
<li><p>Bei komplexen Problemen, die eine tiefgehende Analyse erfordern, können Sie die volle Denkleistung nutzen - auch wenn sie langsamer ist.</p></li>
<li><p>Für alltägliche, einfache Abfragen können Sie in einen schnelleren, leichteren Modus wechseln.</p></li>
<li><p>Sie können sogar ein <strong>"Denkbudget</strong> " festlegen, d. h. wie viel Rechenleistung oder Token eine Sitzung verbraucht.</p></li>
</ul>
<p>Auch dies ist nicht nur eine Laborfunktion. Sie befasst sich direkt mit dem täglichen Kompromiss, mit dem Entwickler jonglieren: Hochwertige Antworten zu liefern, ohne die Infrastrukturkosten oder die Latenzzeiten für die Benutzer in die Höhe zu treiben.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Ein vielseitiges Lineup: MoE- und Dense-Modelle für unterschiedliche Anforderungen</h3><p>Qwen 3 bietet eine breite Palette von Modellen, die auf unterschiedliche betriebliche Anforderungen abgestimmt sind:</p>
<ul>
<li><p><strong>Zwei MoE-Modelle (Mixture of Experts)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 Milliarden Gesamtparameter, 22 Milliarden aktive Parameter pro Abfrage</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 Milliarden insgesamt, 3 Milliarden aktiv</p></li>
</ul></li>
<li><p><strong>Sechs Dense-Modelle</strong>: von flinken 0,6B bis zu satten 32B Parametern</p></li>
</ul>
<p><em>Kurzer technischer Hintergrund: Dense-Modelle (wie GPT-3 oder BERT) aktivieren immer alle Parameter, was sie schwerer, aber manchmal auch berechenbarer macht.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>MoE-Modelle</em></a> <em>aktivieren jeweils nur einen Bruchteil des Netzes, was sie im großen Maßstab viel effizienter macht.</em></p>
<p>In der Praxis bedeutet diese vielseitige Auswahl an Modellen, dass Sie Folgendes tun können:</p>
<ul>
<li><p>Dense-Modelle für enge, vorhersehbare Arbeitslasten (wie eingebettete Geräte) verwenden</p></li>
<li><p>MoE-Modelle verwenden, wenn Sie leistungsstarke Funktionen benötigen, ohne Ihre Cloud-Rechnung zum Schmelzen zu bringen</p></li>
</ul>
<p>Mit dieser Palette können Sie Ihre Bereitstellung individuell anpassen - von leichtgewichtigen, Edge-fähigen Setups bis hin zu leistungsstarken Cloud-Bereitstellungen - ohne auf einen einzigen Modelltyp festgelegt zu sein.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Fokus auf Effizienz und Real-World Deployment</h3><p>Anstatt sich ausschließlich auf die Skalierung der Modellgröße zu konzentrieren, legt Qwen 3 den Schwerpunkt auf Trainingseffizienz und praktische Einsatzmöglichkeiten:</p>
<ul>
<li><p><strong>Trainiert auf 36 Billionen Token</strong> - doppelt so viel wie bei Qwen 2.5</p></li>
<li><p><strong>Erweitert auf 235B Parameter</strong> - aber intelligent verwaltet durch MoE-Techniken, die einen Ausgleich zwischen Kapazität und Ressourcenbedarf schaffen.</p></li>
<li><p><strong>Optimiert für den Einsatz</strong> - dynamische Quantisierung (von FP4 auf INT8) ermöglicht den Betrieb selbst des größten Qwen 3-Modells auf einer bescheidenen Infrastruktur - zum Beispiel auf vier H20-GPUs.</p></li>
</ul>
<p>Das Ziel ist klar: mehr Leistung ohne unverhältnismäßig hohe Investitionen in die Infrastruktur.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Gebaut für echte Integration: MCP-Unterstützung und mehrsprachige Funktionen</h3><p>Bei der Entwicklung von Qwen 3 stand die Integration im Vordergrund, nicht nur die isolierte Modellleistung:</p>
<ul>
<li><p><strong>Die Kompatibilität mit dem MCP (Model Context Protocol)</strong> ermöglicht die nahtlose Integration mit externen Datenbanken, APIs und Werkzeugen und reduziert den technischen Aufwand für komplexe Anwendungen.</p></li>
<li><p><strong>Qwen-Agent</strong> verbessert den Aufruf von Werkzeugen und die Orchestrierung von Arbeitsabläufen und unterstützt so den Aufbau dynamischerer, umsetzbarer KI-Systeme.</p></li>
<li><p>Die<strong>mehrsprachige Unterstützung von 119 Sprachen und Dialekten</strong> macht Qwen 3 zu einer guten Wahl für Anwendungen, die auf globale und mehrsprachige Märkte abzielen.</p></li>
</ul>
<p>Diese Funktionen machen es für Entwickler einfacher, produktionsreife Systeme zu erstellen, ohne dass sie umfangreiche kundenspezifische Anpassungen am Modell vornehmen müssen.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 wird jetzt in DeepSearcher unterstützt<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> ist ein Open-Source-Projekt für Deep Retrieval und die Erstellung von Berichten, das als Local-First-Alternative zu Deep Research von OpenAI entwickelt wurde. Es hilft Entwicklern, Systeme zu erstellen, die qualitativ hochwertige, kontextbezogene Informationen aus privaten oder domänenspezifischen Datenquellen anzeigen.</p>
<p>DeepSearcher unterstützt jetzt die hybride Inferenzarchitektur von Qwen 3, die es Entwicklern ermöglicht, die Schlussfolgerungen dynamisch umzuschalten - tiefere Inferenzen nur dann anzuwenden, wenn sie einen Mehrwert bieten, und sie zu überspringen, wenn die Geschwindigkeit wichtiger ist.</p>
<p>Unter der Haube integriert sich DeepSearcher mit<a href="https://milvus.io"> Milvus</a>, einer hochleistungsfähigen Vektordatenbank, die von Zilliz-Ingenieuren entwickelt wurde, um eine schnelle und genaue semantische Suche über lokale Daten zu ermöglichen. In Kombination mit der Flexibilität des Modells erhalten Entwickler eine größere Kontrolle über das Systemverhalten, die Kosten und die Benutzerfreundlichkeit.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Praktisches Tutorial: Aufbau eines RAG-Systems mit Qwen 3 und Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns diese Qwen 3-Modelle in die Praxis umsetzen, indem wir ein RAG-System mit der Milvus-Vektordatenbank erstellen.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Richten Sie die Umgebung ein.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Hinweis: Sie müssen den API-Schlüssel von Alibaba Cloud erhalten.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Vorbereitung der Daten</h3><p>Wir werden die Milvus-Dokumentationsseiten als primäre Wissensbasis verwenden.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Einrichten von Modellen</h3><p>Wir werden die OpenAI-kompatible API von DashScope verwenden, um auf Qwen 3 zuzugreifen:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Wir generieren eine Testeinbettung und drucken ihre Abmessungen und die ersten Elemente aus:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Erstellen einer Milvus-Sammlung</h3><p>Richten wir nun unsere Milvus-Vektor-Datenbank ein:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Über die MilvusClient-Parametereinstellungen:</p>
<ul>
<li><p>Die Einstellung der URI auf eine lokale Datei (z.B. <code translate="no">./milvus.db</code>) ist die bequemste Methode, da sie automatisch Milvus Lite verwendet, um alle Daten in dieser Datei zu speichern.</p></li>
<li><p>Für große Datenmengen können Sie einen leistungsfähigeren Milvus-Server auf Docker oder Kubernetes einrichten. In diesem Fall verwenden Sie die URI des Servers (z. B. <code translate="no">http://localhost:19530</code>) als Ihre URI.</p></li>
<li><p>Wenn Sie <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(den verwalteten Dienst von Milvus) verwenden möchten, passen Sie die URI und das Token an, die dem öffentlichen Endpunkt und dem API-Schlüssel in Zilliz Cloud entsprechen.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Hinzufügen von Dokumenten zur Sammlung</h3><p>Jetzt erstellen wir Einbettungen für unsere Textbausteine und fügen sie zu Milvus hinzu:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Aufbau des RAG-Abfragesystems</h3><p>Jetzt kommt der spannende Teil - wir richten unser RAG-System ein, um Fragen zu beantworten.</p>
<p>Lassen Sie uns eine allgemeine Frage über Milvus spezifizieren:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Suchen Sie nach dieser Frage in der Sammlung und holen Sie sich die ersten 3 semantisch passenden Ergebnisse:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Schauen wir uns die Suchergebnisse für diese Frage an:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Verwendung des LLM zur Erstellung einer RAG-Antwort</h3><p>Konvertieren Sie die abgerufenen Dokumente in das String-Format:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Geben Sie eine System- und eine Benutzereingabeaufforderung für das große Sprachmodell ein:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verwenden Sie das neueste Qwen-Modell, um eine Antwort auf der Grundlage der Eingabeaufforderung zu erstellen:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Vergleich von Reasoning vs. Non-Reasoning Modi: Ein praktischer Test<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich habe einen Test durchgeführt, in dem ich die beiden Inferenzmodi anhand eines mathematischen Problems verglichen habe:</p>
<p><strong>Problem:</strong> Person A und Person B laufen vom selben Ort aus los. A geht als erster los und läuft 2 Stunden lang mit 5km/h. B folgt mit 15km/h. Wie lange wird B brauchen, um aufzuholen?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mit aktiviertem Argumentationsmodus:</strong></p>
<ul>
<li><p>Verarbeitungszeit: ~74,83 Sekunden</p></li>
<li><p>Tiefgreifende Analyse, Problem-Parsing, mehrere Lösungswege</p></li>
<li><p>Hochwertige Markdown-Ausgabe mit Formeln</p></li>
</ul>
<p>(Das Bild unten ist ein Screenshot der Visualisierung der Markdown-Antwort des Modells, um es dem Leser zu erleichtern)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Non-Reasoning-Modus:</strong></p>
<p>Im Code müssen Sie nur die Option <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Ergebnisse des Non-Reasoning-Modus für dieses Problem:</p>
<ul>
<li>Verarbeitungszeit: ~74,83 Sekunden</li>
<li>Tiefgreifende Analyse, Problem-Parsing, mehrere Lösungswege</li>
<li>Hochwertige Markdown-Ausgabe mit Formeln</li>
</ul>
<p>(Das Bild unten ist ein Screenshot der Visualisierung der Markdown-Antwort des Modells, zur Bequemlichkeit des Lesers)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Qwen 3 führt eine flexible Modellarchitektur ein, die sich gut an die realen Bedürfnisse der GenAI-Entwicklung anpasst. Mit einer Reihe von Modellgrößen (darunter sowohl dichte als auch MoE-Varianten), hybriden Inferenzmodi, MCP-Integration und mehrsprachiger Unterstützung bietet es Entwicklern mehr Optionen, um Leistung, Latenz und Kosten je nach Anwendungsfall zu optimieren.</p>
<p>Qwen 3 legt den Schwerpunkt nicht nur auf die Skalierbarkeit, sondern auch auf die Anpassungsfähigkeit. Das macht es zu einer praktischen Wahl für den Aufbau von RAG-Pipelines, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">KI-Agenten</a> und Produktionsanwendungen, die sowohl logische Fähigkeiten als auch einen kosteneffizienten Betrieb erfordern.</p>
<p>In Verbindung mit einer Infrastruktur wie<a href="https://milvus.io"> Milvus</a> - einer leistungsstarken Open-Source-Vektordatenbank - werden die Fähigkeiten von Qwen 3 noch nützlicher, da sie eine schnelle, semantische Suche und eine reibungslose Integration mit lokalen Datensystemen ermöglichen. Zusammen bieten sie eine starke Grundlage für intelligente, reaktionsschnelle GenAI-Anwendungen im großen Maßstab.</p>
