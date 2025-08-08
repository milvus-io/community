---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss vs. o4-mini: Randständige, ebenbürtige Leistung - zuverlässig, nicht
  umwerfend
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI stiehlt das Rampenlicht, indem es zwei Argumentationsmodelle zur
  Verfügung stellt: gpt-oss-120b und gpt-oss-20b, die unter Apache 2.0
  lizenziert sind.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>Die Welt der KI ist in Aufruhr. In nur wenigen Wochen hat Anthropic Claude 4.1 Opus veröffentlicht, DeepMind hat alle mit dem Weltsimulator Genie 3 verblüfft - und jetzt stiehlt OpenAI das Rampenlicht, indem es zwei Argumentationsmodelle offenlegt: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> und <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, die unter Apache 2.0 lizenziert sind.</p>
<p>Nach der Veröffentlichung schossen diese Modelle sofort auf Platz 1 der Trending Spots bei Hugging Face - und das aus gutem Grund. Dies ist das erste Mal seit 2019, dass OpenAI Modelle mit offenem Gewicht veröffentlicht, die tatsächlich produktionsreif sind. Der Schritt ist nicht zufällig - nach Jahren der Förderung des reinen API-Zugangs reagiert OpenAI eindeutig auf den Druck von Open-Source-Führern wie DeepSeek, Metas LLaMA und Qwen, die sowohl Benchmarks als auch Entwickler-Workflows dominieren.</p>
<p>In diesem Beitrag werden wir untersuchen, was GPT-oss auszeichnet, wie es sich von führenden Open-Source-Modellen wie DeepSeek R1 und Qwen 3 unterscheidet und warum Entwickler sich dafür interessieren sollten. Wir werden auch den Aufbau eines schlussfolgernden RAG-Systems mit GPT-oss und Milvus, der beliebtesten Open-Source-Vektordatenbank, erläutern.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">Was ist das Besondere an GPT-oss und warum sollte es Sie interessieren?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss ist nicht einfach nur eine weitere Gewichtsabnahme. Es bietet fünf Schlüsselbereiche, die für Entwickler wichtig sind:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Entwickelt für den Edge-Einsatz</h3><p>GPT-oss ist in zwei strategisch günstig gelegenen Varianten erhältlich:</p>
<ul>
<li><p>gpt-oss-120b: 117B insgesamt, 5,1B aktiv pro Token</p></li>
<li><p>gpt-oss-20b: 21B gesamt, 3,6B aktiv pro Token</p></li>
</ul>
<p>Dank der Mixture-of-Experts (MoE)-Architektur ist während der Inferenz nur eine Teilmenge der Parameter aktiv. Dadurch sind beide Modelle im Verhältnis zu ihrer Größe leicht auszuführen:</p>
<ul>
<li><p>gpt-oss-120b läuft auf einer einzigen 80GB GPU (H100)</p></li>
<li><p>gpt-oss-20b kommt mit nur 16 GB VRAM aus, was bedeutet, dass es auf High-End-Laptops oder Edge-Geräten läuft.</p></li>
</ul>
<p>Den Tests von OpenAI zufolge ist gpt-oss-20b das schnellste OpenAI-Modell für Inferenzen - ideal für Implementierungen mit geringer Latenz oder Offline-Reasoning-Agenten.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Starke Benchmark-Leistung</h3><p>Nach den Auswertungen von OpenAI:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> ist nahezu gleichwertig mit o4-mini in Bezug auf Schlussfolgerungen, Werkzeugnutzung und Wettbewerbscodierung (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>gpt-oss-20b</strong> konkurriert mit o3-mini und übertrifft ihn sogar im mathematischen Denken und im Gesundheitswesen</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Kosteneffizientes Training</h3><p>OpenAI behauptet, dass die Leistung der von o3-mini und o4-mini gleichwertig ist, aber mit drastisch niedrigeren Trainingskosten:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 Millionen H100-Stunden → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K H100-Stunden → ~$1M</p></li>
</ul>
<p>Vergleichen Sie das mit den Budgets von mehreren Hundert Millionen Dollar für Modelle wie GPT-4. GPT-oss beweist, dass effiziente Skalierungs- und Architekturentscheidungen eine wettbewerbsfähige Leistung ohne einen massiven CO2-Fußabdruck liefern können.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Echte Open-Source-Freiheit</h3><p>GPT-oss verwendet die Apache 2.0-Lizenz, was bedeutet:</p>
<ul>
<li><p>Kommerzielle Nutzung erlaubt</p></li>
<li><p>Vollständige Rechte zur Modifikation und Weiterverbreitung</p></li>
<li><p>Keine Nutzungsbeschränkungen oder Copyleft-Klauseln</p></li>
</ul>
<p>Es handelt sich um echte Open Source, nicht um eine reine Forschungsversion. Sie können es für den domänenspezifischen Gebrauch anpassen, in der Produktion mit voller Kontrolle einsetzen und kommerzielle Produkte darauf aufbauen. Zu den wichtigsten Funktionen gehören eine konfigurierbare Argumentationstiefe (niedrig/mittel/hoch), vollständige Transparenz der Gedankenkette und native Toolaufrufe mit Unterstützung für strukturierte Ausgaben.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Mögliche GPT-5-Vorschau</h3><p>OpenAI hat noch nicht alles verraten, aber die Details der Architektur deuten darauf hin, dass dies eine Vorschau auf <strong>GPT-5</strong> sein könnte:</p>
<ul>
<li><p>Verwendet MoE mit 4 Experten pro Eingabe</p></li>
<li><p>Folgt abwechselnd dichter und lokaler spärlicher Aufmerksamkeit (GPT-3-Muster)</p></li>
<li><p>Verfügt über mehr Aufmerksamkeitsköpfe</p></li>
<li><p>Interessanterweise haben die Bias-Einheiten von GPT-2 ein Comeback erlebt.</p></li>
</ul>
<p>Wenn Sie auf Signale warten, was als nächstes kommt, könnte GPT-oss der bisher deutlichste öffentliche Hinweis sein.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Kernspezifikationen</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modell</strong></td><td><strong>Params gesamt</strong></td><td><strong>Aktive Params</strong></td><td><strong>Experten</strong></td><td><strong>Kontext Länge</strong></td><td><strong>VRAM-Anforderung</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>Beide Modelle verwenden den Tokenizer o200k_harmony und unterstützen eine Kontextlänge von 128.000 Token (etwa 96.000-100.000 Wörter).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss vs. andere Reasoning-Modelle<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier sehen Sie, wie GPT-oss im Vergleich zu den internen Modellen von OpenAI und den führenden Open-Source-Konkurrenten abschneidet:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modell</strong></td><td><strong>Parameter (aktiv)</strong></td><td><strong>Speicher</strong></td><td><strong>Stärken</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5,1B aktiv)</td><td>80GB</td><td>Single-GPU, offene Argumentation</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B aktiv)</td><td>16 GB</td><td>Edge-Einsatz, schnelle Inferenz</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B aktiv)</td><td>Verteilt</td><td>Führend im Benchmarking, bewährte Leistung</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Proprietär</td><td>Nur API</td><td>Starke Argumentation (geschlossen)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Proprietär</td><td>Nur API</td><td>Leichte Argumentation (geschlossen)</td></tr>
</tbody>
</table>
<p>Auf der Grundlage verschiedener Benchmarking-Modelle haben wir folgendes herausgefunden:</p>
<ul>
<li><p><strong>GPT-oss vs. OpenAIs eigene Modelle:</strong> gpt-oss-120b entspricht o4-mini in den Bereichen Mathematik (AIME), Codierung (Codeforces) und Werkzeugnutzung (TauBench). Das 20b-Modell schneidet ähnlich gut ab wie o3-mini, obwohl es viel kleiner ist.</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1:</strong> DeepSeek R1 dominiert bei der reinen Leistung, erfordert aber eine verteilte Infrastruktur. GPT-oss bietet eine einfachere Bereitstellung - für das 120b-Modell ist keine verteilte Einrichtung erforderlich.</p></li>
</ul>
<p>Zusammenfassend lässt sich sagen, dass GPT-oss die beste Kombination aus Leistung, offenem Zugang und Einsatzfähigkeit bietet. DeepSeek R1 gewinnt bei der reinen Leistung, aber GPT-oss bietet für die meisten Entwickler das optimale Gleichgewicht.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Praktische Anwendung: Bauen mit GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun gesehen haben, was GPT-oss zu bieten hat, ist es an der Zeit, es in die Praxis umzusetzen.</p>
<p>In den folgenden Abschnitten gehen wir durch ein praktisches Tutorial für den Aufbau eines RAG-Systems mit gpt-oss-20b und Milvus, das lokal läuft und keinen API-Schlüssel benötigt.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Einrichtung der Umgebung</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Vorbereitung des Datensatzes</h3><p>Wir werden die Milvus-Dokumentation als Wissensbasis verwenden:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Modell-Einrichtung</h3><p>Greifen Sie über <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> auf GPT-oss zu (oder führen Sie es lokal aus). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> ist eine Plattform, die es Entwicklern ermöglicht, über eine einzige, einheitliche API auf mehrere KI-Modelle (wie GPT-4, Claude, Mistral) zuzugreifen und zwischen ihnen zu wechseln. Dies ist nützlich, um Modelle zu vergleichen oder Anwendungen zu entwickeln, die mit verschiedenen KI-Anbietern arbeiten. Die GPT-oss Serie ist nun auch auf OpenRouter verfügbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Einrichten der Milvus-Vektordatenbank</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Über die MilvusClient-Parametereinstellungen:</p>
<ul>
<li><p>Die Einstellung der URI auf eine lokale Datei (z. B. <code translate="no">./milvus.db</code>) ist die bequemste Methode, da sie automatisch Milvus Lite verwendet, um alle Daten in dieser Datei zu speichern.</p></li>
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
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG-Abfrage-Pipeline</h3><p>Jetzt kommt der spannende Teil - wir richten unser RAG-System ein, um Fragen zu beantworten.</p>
<p>Lassen Sie uns eine allgemeine Frage über Milvus spezifizieren:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Suchen Sie nach dieser Frage in der Sammlung und holen Sie sich die ersten 3 semantisch passenden Ergebnisse:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Schauen wir uns die Suchergebnisse für diese Frage an:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Verwendung des GPT-oss zur Erstellung einer RAG-Antwort</h3><p>Konvertieren Sie die abgerufenen Dokumente in das String-Format:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Geben Sie eine System- und eine Benutzereingabeaufforderung für das große Sprachmodell ein:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Verwendung des neuesten gpt-oss-Modells zur Erstellung einer Antwort auf der Grundlage der Eingabeaufforderung:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Abschließende Überlegungen zu GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss ist das stille Eingeständnis von OpenAI, dass Open-Source nicht mehr ignoriert werden kann. Es übertrifft zwar nicht DeepSeek R1 oder Qwen 3 oder viele andere Modelle, aber es bringt etwas mit, was diese nicht haben: Die OpenAI-Trainings-Pipeline, angewandt auf ein Modell, das Sie tatsächlich überprüfen und lokal ausführen können.</p>
<p><strong>Leistung? Solide. Nicht umwerfend, aber verlässlich.</strong> Das 20B-Modell, das auf Consumer-Hardware - oder sogar auf Mobilgeräten mit LM Studio - läuft, ist die Art von praktischem Vorteil, der für Entwickler tatsächlich von Bedeutung ist. Es ist mehr ein "das funktioniert einfach" als ein "wow, das ändert alles". Und ehrlich gesagt, das ist auch gut so.</p>
<p><strong>Wo es hapert, ist die mehrsprachige Unterstützung.</strong> Wenn Sie in einer anderen Sprache als Englisch arbeiten, werden Sie auf seltsame Formulierungen, Rechtschreibprobleme und allgemeine Verwirrung stoßen. Das Modell wurde eindeutig mit dem Schwerpunkt Englisch trainiert. Wenn die globale Abdeckung wichtig ist, müssen Sie es wahrscheinlich mit einem mehrsprachigen Datensatz feinabstimmen.</p>
<p>Am interessantesten ist jedoch das Timing. Der Teaser von OpenAI auf X - mit einer "5" in dem Wort "LIVESTREAM" - wirkt wie eine Falle. GPT-oss ist vielleicht nicht der Hauptakt, aber es könnte eine Vorschau auf das sein, was in GPT-5 kommen wird. Gleiche Zutaten, anderer Maßstab. Warten wir ab.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Der eigentliche Gewinn besteht darin, dass wir mehr hochwertige Angebote zur Auswahl haben.</strong> Wettbewerb fördert Innovation, und der Wiedereinstieg von OpenAI in die Open-Source-Entwicklung kommt allen zugute. Testen Sie GPT-oss anhand Ihrer spezifischen Anforderungen, aber entscheiden Sie sich für das, was tatsächlich für Ihren Anwendungsfall funktioniert, und nicht für die Markenbekanntheit.</p>
