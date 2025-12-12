---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: costruire un RAG più robusto con ragionamento avanzato
  e potenza multimodale
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Scoprite gli aggiornamenti fondamentali di Gemini 3 Pro, vedete come si
  comporta con i principali benchmark e seguite la guida alla creazione di una
  pipeline RAG ad alte prestazioni con Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Gemini 3 Pro di Google è arrivato con il raro tipo di release che sposta realmente le aspettative degli sviluppatori, non solo con l'hype, ma con funzionalità che espandono materialmente ciò che le interfacce in linguaggio naturale possono fare. Trasforma la frase "descrivi l'app che vuoi" in un flusso di lavoro eseguibile: instradamento dinamico degli strumenti, pianificazione in più fasi, orchestrazione delle API e generazione interattiva della UX, il tutto cucito insieme senza soluzione di continuità. Questo è il modello che più si avvicina a far sembrare la codifica a vibrazione una cosa fattibile in produzione.</p>
<p>E i numeri confermano questa tesi. Gemini 3 Pro ottiene risultati eccellenti in quasi tutti i principali benchmark:</p>
<ul>
<li><p><strong>Humanity's Last Exam:</strong> 37,5% senza strumenti, 45,8% con strumenti - il concorrente più vicino si ferma al 26,5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4%, mentre la maggior parte dei modelli non supera il 2%.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72,7% di precisione, quasi il doppio del migliore, che si ferma al 36,2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> valore netto medio di <strong> 5.478,16 dollari</strong>, circa <strong>1,4 volte</strong> superiore al secondo posto.</p></li>
</ul>
<p>Per ulteriori risultati di benchmark, consultare la tabella sottostante.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa combinazione di ragionamento profondo, forte utilizzo di strumenti e fluidità multimodale rende Gemini 3 Pro una soluzione naturale per la retrieval-augmented generation (RAG). Abbinandolo a <a href="https://milvus.io/"><strong>Milvus</strong></a>, il database vettoriale open-source ad alte prestazioni costruito per la ricerca semantica su scala miliardaria, si ottiene un livello di retrieval che mette a terra le risposte, scala in modo pulito e rimane affidabile in produzione anche con carichi di lavoro elevati.</p>
<p>In questo post, vi illustreremo le novità di Gemini 3 Pro, i motivi per cui eleva i flussi di lavoro RAG e come costruire una pipeline RAG pulita ed efficiente utilizzando Milvus come struttura portante del reperimento.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Aggiornamenti importanti in Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro introduce una serie di aggiornamenti sostanziali che rimodellano il modo in cui il modello ragiona, crea, esegue le attività e interagisce con gli utenti. Questi miglioramenti rientrano in quattro grandi aree di funzionalità:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Comprensione e ragionamento multimodale</h3><p>Gemini 3 Pro stabilisce nuovi record in importanti benchmark multimodali, tra cui ARC-AGI-2 per il ragionamento visivo, MMMU-Pro per la comprensione cross-modale e Video-MMMU per la comprensione di video e l'acquisizione di conoscenze. Il modello introduce anche Deep Think, una modalità di ragionamento estesa che consente un'elaborazione logica strutturata in più fasi. Ciò si traduce in un'accuratezza significativamente più elevata su problemi complessi in cui i modelli tradizionali a catena di pensiero tendono a fallire.</p>
<h3 id="Code-Generation" class="common-anchor-header">Generazione di codice</h3><p>Il modello porta la codifica generativa a un nuovo livello. Gemini 3 Pro è in grado di produrre SVG interattivi, applicazioni web complete, scene 3D e persino giochi funzionali, tra cui ambienti simili a Minecraft e biliardi basati su browser, il tutto partendo da un unico prompt in linguaggio naturale. Lo sviluppo front-end ne beneficia in modo particolare: il modello può ricreare progetti di interfaccia utente esistenti con alta fedeltà o tradurre uno screenshot direttamente in codice pronto per la produzione, rendendo il lavoro iterativo dell'interfaccia utente molto più veloce.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Agenti AI e uso dello strumento</h3><p>Con l'autorizzazione dell'utente, Gemini 3 Pro può accedere ai dati del dispositivo Google dell'utente per eseguire compiti a lungo termine e in più fasi, come la pianificazione di viaggi o la prenotazione di auto a noleggio. Questa capacità agenziale si riflette nelle sue ottime prestazioni su <strong>Vending-Bench 2</strong>, un benchmark specificamente progettato per testare l'uso di strumenti a lungo termine. Il modello supporta anche flussi di lavoro degli agenti di livello professionale, tra cui l'esecuzione di comandi da terminale e l'interazione con strumenti esterni tramite API ben definite.</p>
<h3 id="Generative-UI" class="common-anchor-header">Interfaccia utente generativa</h3><p>Gemini 3 Pro supera il modello convenzionale di una domanda e una risposta e introduce l'<strong>interfaccia utente generativa</strong>, in cui il modello può costruire dinamicamente intere esperienze interattive. Invece di restituire un testo statico, è in grado di generare interfacce completamente personalizzate - ad esempio, un ricco pianificatore di viaggio regolabile - direttamente in risposta alle istruzioni dell'utente. In questo modo gli LLM si trasformano da risponditori passivi a generatori attivi di interfacce.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Mettere Gemini 3 Pro alla prova<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre ai risultati dei benchmark, abbiamo eseguito una serie di test pratici per capire come Gemini 3 Pro si comporta nei flussi di lavoro reali. I risultati evidenziano come il ragionamento multimodale, le capacità generative e la pianificazione a lungo termine si traducano in un valore pratico per gli sviluppatori.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Comprensione multimodale</h3><p>Gemini 3 Pro mostra un'impressionante versatilità tra testo, immagini, video e codice. Nel nostro test, abbiamo caricato un video di Zilliz direttamente da YouTube. Il modello ha elaborato l'intero filmato - compresa la narrazione, le transizioni e il testo sullo schermo - in circa <strong>40 secondi</strong>, un tempo insolitamente rapido per un contenuto multimodale di lunga durata.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le valutazioni interne di Google mostrano un comportamento simile: Gemini 3 Pro ha gestito ricette scritte a mano in più lingue, ha trascritto e tradotto ognuna di esse e le ha raccolte in un ricettario di famiglia condivisibile.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Compiti a colpo sicuro</h3><p>Gemini 3 Pro è in grado di generare UI web completamente interattive senza esempi o impalcature precedenti. Quando gli è stato chiesto di creare un <strong>gioco web di astronavi 3D</strong> retrofuturistiche, il modello ha prodotto una scena interattiva completa: una griglia neon-violacea, astronavi in stile cyberpunk, effetti particellari incandescenti e controlli fluidi della telecamera, il tutto in un'unica risposta a zero colpi.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Pianificazione di compiti complessi</h3><p>Il modello dimostra anche una migliore pianificazione dei compiti a lungo termine rispetto a molti altri. Nel nostro test di organizzazione della posta in arrivo, Gemini 3 Pro si è comportato come un assistente amministrativo AI: ha categorizzato le e-mail disordinate in gruppi di progetti, ha elaborato suggerimenti praticabili (risposta, follow-up, archiviazione) e ha presentato un riepilogo pulito e strutturato. Con il piano del modello, l'intera posta in arrivo poteva essere cancellata con un solo clic di conferma.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Come costruire un sistema RAG con Gemini 3 Pro e Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Il ragionamento potenziato, la comprensione multimodale e le forti capacità di utilizzo degli strumenti fanno di Gemini 3 Pro una base eccellente per sistemi RAG ad alte prestazioni.</p>
<p>Se abbinato a <a href="https://milvus.io/"><strong>Milvus</strong></a>, il database vettoriale open-source ad alte prestazioni costruito per la ricerca semantica su larga scala, si ottiene una netta divisione delle responsabilità: Gemini 3 Pro gestisce l'<strong>interpretazione, il ragionamento e la generazione</strong>, mentre Milvus fornisce un <strong>livello di recupero veloce e scalabile</strong> che mantiene le risposte basate sui dati aziendali. Questa accoppiata è adatta ad applicazioni di livello produttivo come basi di conoscenza interne, assistenti documentali, copiloti per l'assistenza ai clienti e sistemi di esperti specifici per il dominio.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p>Prima di costruire la pipeline RAG, assicuratevi che le librerie Python di base siano installate o aggiornate alle versioni più recenti:</p>
<ul>
<li><p><strong>pymilvus</strong> - l'SDK ufficiale di Milvus per Python</p></li>
<li><p><strong>google-generativeai</strong> - la libreria client di Gemini 3 Pro</p></li>
<li><p><strong>requests</strong> - per gestire le chiamate HTTP quando necessario</p></li>
<li><p><strong>tqdm</strong> - per le barre di avanzamento durante l'ingestione dei set di dati.</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Quindi, accedere a <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> per ottenere la chiave API.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Preparazione del set di dati</h3><p>Per questa esercitazione, utilizzeremo la sezione FAQ della documentazione di Milvus 2.4.x come base di conoscenza privata per il nostro sistema RAG.</p>
<p>Scaricare l'archivio della documentazione ed estrarlo in una cartella denominata <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Caricare tutti i file Markdown dal percorso <code translate="no">milvus_docs/en/faq</code>. Per ogni documento, applichiamo una semplice suddivisione basata sulle intestazioni di <code translate="no">#</code> per separare approssimativamente le sezioni principali all'interno di ogni file Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">Impostazione del modello LLM e di incorporazione</h3><p>Per questa esercitazione, useremo <code translate="no">gemini-3-pro-preview</code> come LLM e <code translate="no">text-embedding-004</code> come modello di incorporamento.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Risposta al modello: Sono Gemini, un modello linguistico di grandi dimensioni costruito da Google.</p>
<p>È possibile eseguire un rapido controllo generando un embedding di prova e stampando la sua dimensionalità insieme ai primi valori:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Vettore di test in uscita:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Caricare i dati in Milvus</h3><p><strong>Creare una raccolta</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Quando si crea una raccolta <code translate="no">MilvusClient</code>, si può scegliere tra tre opzioni di configurazione, a seconda della scala e dell'ambiente:</p>
<ul>
<li><p><strong>Modalità locale (Milvus Lite):</strong> Imposta l'URI su un percorso di file locale (ad esempio, <code translate="no">./milvus.db</code>). Questo è il modo più semplice per iniziare: <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> memorizzerà automaticamente tutti i dati in quel file.</p></li>
<li><p><strong>Milvus auto-ospitato (Docker o Kubernetes):</strong> Per set di dati più grandi o carichi di lavoro di produzione, eseguire Milvus su Docker o Kubernetes. Impostate l'URI all'endpoint del vostro server Milvus, ad esempio <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (il servizio Milvus completamente gestito):</strong> Se preferite una soluzione gestita, utilizzate Zilliz Cloud. Impostate l'URI al vostro Endpoint pubblico e fornite la vostra chiave API come token di autenticazione.</p></li>
</ul>
<p>Prima di creare una nuova raccolta, verificare se esiste già. In caso affermativo, eliminarla e ricrearla per garantire una configurazione pulita.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Creare una nuova raccolta con i parametri specificati.</p>
<p>Se non viene fornito alcuno schema, Milvus genera automaticamente un campo ID predefinito come chiave primaria e un campo vettore per memorizzare gli embeddings. Fornisce anche un campo dinamico JSON riservato, che cattura qualsiasi campo aggiuntivo non definito nello schema.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inserire i dati</strong></p>
<p>Si itera ogni voce di testo, si genera il suo vettore di incorporamento e si inseriscono i dati in Milvus. In questo esempio, includiamo un campo aggiuntivo chiamato <code translate="no">text</code>. Poiché non è predefinito nello schema, Milvus lo memorizza automaticamente utilizzando il campo JSON dinamico, senza bisogno di ulteriori impostazioni.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Esempio di output:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Creazione del flusso di lavoro RAG</h3><p><strong>Recuperare i dati rilevanti</strong></p>
<p>Per testare il recupero, poniamo una domanda comune su Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>La domanda viene cercata nella raccolta e vengono restituiti i 3 risultati più rilevanti.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>I risultati vengono restituiti in ordine di somiglianza, dal più vicino al meno simile.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Generare una risposta RAG con il LLM</strong></p>
<p>Dopo aver recuperato i documenti, convertirli in un formato stringa.</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornire al LLM un prompt di sistema e un prompt utente, entrambi costruiti a partire dai documenti recuperati da Milvus.</p>
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
<p>Utilizzare il modello <code translate="no">gemini-3-pro-preview</code> insieme a questi prompt per generare la risposta finale.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Dall'output, si può notare che Gemini 3 Pro produce una risposta chiara e ben strutturata basata sulle informazioni recuperate.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Nota</strong>: Gemini 3 Pro non è attualmente disponibile per gli utenti free-tier. Per maggiori dettagli, fare clic <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">qui</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>È invece possibile accedervi tramite <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">One More Thing: Vibe Coding con Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a Gemini 3 Pro, Google ha presentato <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>, una piattaforma di vide coding che interagisce autonomamente con l'editor, il terminale e il browser. A differenza dei precedenti strumenti assistiti dall'intelligenza artificiale che gestivano istruzioni singole, Antigravity opera a un livello orientato alle attività, consentendo agli sviluppatori di specificare <em>ciò che</em> vogliono costruire mentre il sistema gestisce il <em>come</em>, orchestrando l'intero flusso di lavoro end-to-end.</p>
<p>I tradizionali flussi di lavoro per la codifica dell'intelligenza artificiale generavano in genere frammenti isolati che gli sviluppatori dovevano rivedere, integrare, debuggare ed eseguire manualmente. Antigravity cambia questa dinamica. È sufficiente descrivere un'attività, ad esempio <em>"Crea un semplice gioco di interazione con gli animali domestici</em> ", e il sistema decomporrà la richiesta, genererà il codice, eseguirà i comandi da terminale, aprirà un browser per testare il risultato e itererà finché non funzionerà. In questo modo l'intelligenza artificiale si trasforma da motore passivo di autocompletamento in un partner attivo di progettazione, che apprende le preferenze dell'utente e si adatta al suo stile di sviluppo personale nel corso del tempo.</p>
<p>In prospettiva, l'idea di un agente che si coordina direttamente con un database non è lontana. Con la chiamata di strumenti tramite MCP, un'intelligenza artificiale potrebbe leggere da un database Milvus, assemblare una base di conoscenze e persino gestire autonomamente la propria pipeline di reperimento. Per molti versi, questo passaggio è ancora più significativo dell'aggiornamento del modello stesso: una volta che un'intelligenza artificiale può prendere una descrizione del prodotto e convertirla in una sequenza di compiti eseguibili, lo sforzo umano si sposta naturalmente verso la definizione degli obiettivi, dei vincoli e dell'aspetto della "correttezza" - il pensiero di livello superiore che guida veramente lo sviluppo del prodotto.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Pronti a costruire?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Se siete pronti a provarlo, seguite il nostro tutorial passo dopo passo e costruite oggi stesso un sistema RAG con <strong>Gemini 3 Pro + Milvus</strong>.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
