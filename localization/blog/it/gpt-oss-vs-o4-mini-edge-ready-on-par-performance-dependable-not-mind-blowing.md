---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss vs. o4-mini: Prestazioni al limite, alla pari - Affidabili, non
  strabilianti
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI ruba la scena con l'open-sourcing di due modelli di ragionamento:
  gpt-oss-120b e gpt-oss-20b, con licenza permissiva Apache 2.0.
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
<p>Il mondo dell'intelligenza artificiale è in fermento. In poche settimane, Anthropic ha lanciato Claude 4.1 Opus, DeepMind ha stupito tutti con il simulatore di mondo Genie 3 e ora OpenAI ruba i riflettori con l'open-sourcing di due modelli di ragionamento: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> e <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, con licenza permissiva Apache 2.0.</p>
<p>Dopo il lancio, questi modelli sono balzati immediatamente al primo posto tra le tendenze di Hugging Face, e per una buona ragione. È la prima volta dal 2019 che OpenAI rilascia modelli open-weight che sono effettivamente pronti per la produzione. La mossa non è casuale: dopo anni in cui ha spinto l'accesso alle sole API, OpenAI sta chiaramente rispondendo alle pressioni dei leader open-source come DeepSeek, LLaMA di Meta e Qwen, che hanno dominato sia i benchmark che i flussi di lavoro degli sviluppatori.</p>
<p>In questo post esploreremo cosa rende GPT-oss diverso, come si confronta con i principali modelli aperti come DeepSeek R1 e Qwen 3 e perché gli sviluppatori dovrebbero interessarsene. Inoltre, ci occuperemo della costruzione di un sistema RAG in grado di ragionare utilizzando GPT-oss e Milvus, il più popolare database vettoriale open-source.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">Cosa rende GPT-oss speciale e perché dovrebbe interessarvi?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss non è solo un'altra goccia di peso. Offre prestazioni in cinque aree chiave che interessano agli sviluppatori:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Costruito per l'implementazione su un bordo</h3><p>GPT-oss è disponibile in due varianti di dimensioni strategiche:</p>
<ul>
<li><p>gpt-oss-120b: 117B totali, 5,1B attivi per token</p></li>
<li><p>gpt-oss-20b: 21B totali, 3,6B attivi per token</p></li>
</ul>
<p>Grazie all'architettura Mixture-of-Experts (MoE), solo un sottoinsieme di parametri è attivo durante l'inferenza. Questo rende entrambi i modelli leggeri da eseguire rispetto alle loro dimensioni:</p>
<ul>
<li><p>gpt-oss-120b viene eseguito su una singola GPU da 80 GB (H100)</p></li>
<li><p>gpt-oss-20b si adatta a soli 16 GB di VRAM, il che significa che può essere eseguito su computer portatili di fascia alta o dispositivi edge.</p></li>
</ul>
<p>Secondo i test di OpenAI, gpt-oss-20b è il modello OpenAI più veloce per l'inferenza, ideale per le implementazioni a bassa latenza o per gli agenti di ragionamento offline.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Prestazioni elevate nei benchmark</h3><p>Secondo le valutazioni di OpenAI:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> ha prestazioni quasi uguali a quelle di o4-mini per quanto riguarda il ragionamento, l'uso di strumenti e la codifica della concorrenza (Codeforces, MMLU, TauBench).</p></li>
<li><p><strong>gpt-oss-20b</strong> compete con o3-mini e lo supera persino nel ragionamento matematico e sanitario.</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Formazione efficiente dal punto di vista dei costi</h3><p>OpenAI dichiara prestazioni equivalenti a quelle di o3-mini e o4-mini, ma con costi di formazione nettamente inferiori:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 milioni di ore H100 → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K ore H100 → ~$1M</p></li>
</ul>
<p>Confrontate questo dato con i budget da centinaia di milioni di dollari che stanno dietro a modelli come GPT-4. GPT-oss dimostra che scelte efficienti in termini di scala e architettura possono fornire prestazioni competitive senza un'enorme impronta di carbonio.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Vera libertà open-source</h3><p>GPT-oss utilizza la licenza Apache 2.0, che significa:</p>
<ul>
<li><p>Uso commerciale consentito</p></li>
<li><p>Pieni diritti di modifica e ridistribuzione</p></li>
<li><p>Nessuna restrizione d'uso o clausola di copyleft</p></li>
</ul>
<p>Si tratta di un vero open source, non di un rilascio riservato alla ricerca. Si può mettere a punto per un uso specifico del dominio, distribuire in produzione con pieno controllo e costruire prodotti commerciali attorno ad esso. Le caratteristiche principali includono la profondità di ragionamento configurabile (bassa/media/alta), la visibilità completa della catena di pensiero e il richiamo nativo di strumenti con il supporto di output strutturati.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Potenziale anteprima del GPT-5</h3><p>OpenAI non ha rivelato tutto, ma i dettagli dell'architettura suggeriscono che potrebbe essere un'anteprima della direzione del <strong>GPT-5</strong>:</p>
<ul>
<li><p>Utilizza MoE con 4 esperti per ingresso</p></li>
<li><p>Segue l'alternanza di attenzione densa + rada locale (schema GPT-3)</p></li>
<li><p>Presenta più teste di attenzione</p></li>
<li><p>È interessante notare che le unità di bias della GPT-2 sono tornate in auge.</p></li>
</ul>
<p>Se siete alla ricerca di segnali sul futuro, GPT-oss potrebbe essere l'indizio pubblico più chiaro.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Specifiche del nucleo</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modello</strong></td><td><strong>Parametri totali</strong></td><td><strong>Parametri attivi</strong></td><td><strong>Esperti</strong></td><td><strong>Lunghezza del contesto</strong></td><td><strong>Richiesta di VRAM</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>Entrambi i modelli utilizzano il tokenizer o200k_harmony e supportano una lunghezza del contesto di 128.000 token (circa 96.000-100.000 parole).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss rispetto ad altri modelli di ragionamento<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco come GPT-oss si posiziona rispetto ai modelli interni di OpenAI e ai principali concorrenti open-source:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modello</strong></td><td><strong>Parametri (attivi)</strong></td><td><strong>Memoria</strong></td><td><strong>Punti di forza</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5,1B attivi)</td><td>80 GB</td><td>Single-GPU, ragionamento aperto</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B attivo)</td><td>16 GB</td><td>Distribuzione ai bordi, inferenza veloce</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B attivo)</td><td>Distribuito</td><td>Leader nei benchmark, prestazioni comprovate</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Proprietario</td><td>Solo API</td><td>Forte ragionamento (chiuso)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Proprietario</td><td>Solo API</td><td>Ragionamento leggero (chiuso)</td></tr>
</tbody>
</table>
<p>Sulla base di vari modelli di benchmarking, ecco cosa abbiamo trovato:</p>
<ul>
<li><p><strong>GPT-oss contro i modelli di OpenAI:</strong> gpt-oss-120b è all'altezza di o4-mini nelle competizioni matematiche (AIME), nella codifica (Codeforces) e nell'uso di strumenti (TauBench). Il modello 20b ha prestazioni simili a quelle di o3-mini, nonostante sia molto più piccolo.</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1:</strong> DeepSeek R1 domina in termini di prestazioni pure, ma richiede un'infrastruttura distribuita. GPT-oss offre un'implementazione più semplice: non è necessaria alcuna configurazione distribuita per il modello 120b.</p></li>
</ul>
<p>In sintesi, GPT-oss offre la migliore combinazione di prestazioni, accesso aperto e distribuibilità. DeepSeek R1 vince sulle prestazioni pure, ma GPT-oss raggiunge l'equilibrio ottimale per la maggior parte degli sviluppatori.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Esperienza pratica: Costruire con GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo visto cosa offre GPT-oss, è il momento di metterlo in pratica.</p>
<p>Nelle sezioni che seguono, verrà illustrato un tutorial pratico per la costruzione di un sistema RAG in grado di ragionare, utilizzando gpt-oss-20b e Milvus, il tutto in esecuzione locale, senza bisogno di chiavi API.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Configurazione dell'ambiente</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Preparazione del set di dati</h3><p>Utilizzeremo la documentazione di Milvus come base di conoscenza:</p>
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
<h3 id="Model-Setup" class="common-anchor-header">Impostazione del modello</h3><p>Accedere a GPT-oss attraverso <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (o eseguirlo localmente). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> è una piattaforma che consente agli sviluppatori di accedere e passare da un modello all'altro di intelligenza artificiale (come GPT-4, Claude, Mistral) attraverso un'unica API unificata. È utile per confrontare i modelli o costruire applicazioni che funzionano con diversi fornitori di IA. Ora la serie GPT-oss è disponibile su OpenRouter.</p>
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
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Impostazione del database vettoriale Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

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
<p>Informazioni sulle impostazioni dei parametri di MilvusClient:</p>
<ul>
<li><p>L'impostazione dell'URI a un file locale (ad esempio, <code translate="no">./milvus.db</code>) è il metodo più conveniente, poiché utilizza automaticamente Milvus Lite per memorizzare tutti i dati in quel file.</p></li>
<li><p>Per i dati su larga scala, è possibile impostare un server Milvus più potente su Docker o Kubernetes. In questo caso, utilizzare l'URI del server (ad esempio, <code translate="no">http://localhost:19530</code>) come URI.</p></li>
<li><p>Se si desidera utilizzare <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(il servizio gestito di Milvus), regolare l'URI e il token, che corrispondono all'endpoint pubblico e alla chiave API di Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Aggiunta di documenti alla raccolta</h3><p>Ora creiamo gli embeddings per i nostri pezzi di testo e li aggiungiamo a Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">Pipeline di query RAG</h3><p>Ora la parte più interessante: configuriamo il nostro sistema RAG per rispondere alle domande.</p>
<p>Specifichiamo una domanda comune su Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cercare questa domanda nella raccolta e recuperare i primi 3 risultati semanticamente corrispondenti:</p>
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
<p>Vediamo i risultati della ricerca per questa domanda:</p>
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
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Utilizzo di GPT-oss per costruire una risposta RAG</h3><p>Convertire i documenti recuperati in formato stringa:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornire un prompt del sistema e un prompt dell'utente per il modello linguistico di grandi dimensioni:</p>
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
<p>Utilizzare il modello gpt-oss più recente per generare una risposta basata sul prompt:</p>
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
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Considerazioni finali su GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss è la tacita ammissione di OpenAI che l'open-source non può più essere ignorato. Non fa saltare in aria DeepSeek R1, Qwen 3 o molti altri modelli, ma offre qualcosa che non hanno: La pipeline di addestramento di OpenAI, applicata a un modello che è possibile ispezionare ed eseguire localmente.</p>
<p><strong>Prestazioni? Buone. Non strabilianti, ma affidabili.</strong> Il modello 20B in esecuzione su hardware consumer - o anche su mobile con LM Studio - è il tipo di vantaggio pratico che conta davvero per gli sviluppatori. È più un "funziona e basta" che un "wow, questo cambia tutto". E onestamente, questo va bene.</p>
<p><strong>Il punto debole è il supporto multilingue.</strong> Se si lavora in una lingua diversa dall'inglese, ci si imbatte in frasi strane, problemi di ortografia e confusione generale. Il modello è stato chiaramente addestrato con un'ottica English-first. Se la copertura globale è importante, probabilmente dovrete perfezionarlo con un set di dati multilingue.</p>
<p>L'aspetto più interessante, tuttavia, è la tempistica. Il teaser di OpenAI su X - con un "5" inserito nella parola "LIVESTREAM" - sembra una montatura. GPT-oss potrebbe non essere l'atto principale, ma potrebbe essere un'anteprima di ciò che arriverà in GPT-5. Stessi ingredienti, diversa scala. Stessi ingredienti, scala diversa. Aspettiamo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Il vero vantaggio è avere più scelte di alta qualità.</strong> La concorrenza spinge all'innovazione e il rientro di OpenAI nello sviluppo open-source va a vantaggio di tutti. Testate GPT-oss in base alle vostre esigenze specifiche, ma scegliete in base a ciò che funziona effettivamente per il vostro caso d'uso, non al riconoscimento del marchio.</p>
