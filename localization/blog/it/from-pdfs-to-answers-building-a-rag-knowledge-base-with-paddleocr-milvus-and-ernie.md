---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  Dai PDF alle risposte: Costruire una base di conoscenza RAG con PaddleOCR,
  Milvus e ERNIE
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Imparate a costruire una base di conoscenza RAG ad alta precisione utilizzando
  Milvus, la ricerca ibrida, il reranking e la Q&amp;A multimodale per
  l'intelligence dei documenti.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>I modelli linguistici di grandi dimensioni sono molto più capaci di quanto non fossero nel 2023, ma sono ancora allucinati e spesso si basano su informazioni obsolete. RAG (Retrieval-Augmented Generation) risolve entrambi i problemi recuperando il contesto pertinente da un database vettoriale come <a href="https://milvus.io/">Milvus</a> prima che il modello generi una risposta. Questo contesto aggiuntivo consente di fondare la risposta su fonti reali e di renderla più attuale.</p>
<p>Uno dei casi d'uso più comuni di RAG è una base di conoscenza aziendale. Un utente carica PDF, file Word o altri documenti interni, pone una domanda in linguaggio naturale e riceve una risposta basata su questi materiali anziché solo sul preaddestramento del modello.</p>
<p>Ma utilizzare lo stesso LLM e lo stesso database vettoriale non garantisce lo stesso risultato. Due team possono basarsi sulle stesse fondamenta, ma ottenere comunque una qualità del sistema molto diversa. La differenza di solito deriva da tutto ciò che sta a monte: il <strong>modo in cui i documenti vengono analizzati, raggruppati e incorporati; il modo in cui i dati vengono indicizzati; il modo in cui i risultati del reperimento vengono classificati e il modo in cui viene assemblata la risposta finale.</strong></p>
<p>In questo articolo utilizzeremo <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> come esempio e spiegheremo come costruire una base di conoscenza basata su RAG con <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> e ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Architettura del sistema Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>L'architettura di Paddle-ERNIE-RAG è composta da quattro livelli principali:</p>
<ul>
<li><strong>Livello di estrazione dei dati.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, la pipeline di analisi dei documenti in PaddleOCR, legge PDF e immagini con un OCR consapevole del layout. Preserva la struttura del documento (titoli, tabelle, ordine di lettura) e produce un Markdown pulito, suddiviso in parti sovrapposte.</li>
<li><strong>Livello di memorizzazione vettoriale.</strong> Ogni pezzo è incorporato in un vettore a 384 dimensioni e memorizzato in <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> insieme ai metadati (nome del file, numero di pagina, ID del pezzo). Un indice parallelo invertito supporta la ricerca per parole chiave.</li>
<li><strong>Livello di recupero e risposta.</strong> Ogni interrogazione viene eseguita sia sull'indice vettoriale che su quello delle parole chiave. I risultati vengono uniti tramite RRF (Reciprocal Rank Fusion), riclassificati e passati al modello <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> per la generazione delle risposte.</li>
<li><strong>Livello di applicazione.</strong> L'interfaccia di <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/">Gradio</a> consente di caricare documenti, porre domande e visualizzare le risposte con citazioni delle fonti e punteggi di affidabilità.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>Le sezioni che seguono illustrano ogni fase in ordine sparso, a partire dal modo in cui i documenti grezzi diventano testo ricercabile.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Come costruire la pipeline RAG passo dopo passo<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Fase 1: analizzare i documenti con PP-StructureV3</h3><p>I documenti grezzi sono il punto di partenza della maggior parte dei problemi di accuratezza. I documenti di ricerca e le relazioni tecniche contengono layout a due colonne, formule, tabelle e immagini. L'estrazione del testo con una libreria di base come PyPDF2 di solito confonde l'output: i paragrafi appaiono fuori ordine, le tabelle collassano e le formule scompaiono.</p>
<p>Per evitare questi problemi, il progetto crea una classe OnlinePDFParser in backend.py. Questa classe chiama l'API online di PP-StructureV3 per eseguire il parsing del layout. Invece di estrarre il testo grezzo, identifica la struttura del documento e lo trasforma in formato Markdown.</p>
<p>Questo metodo ha tre chiari vantaggi:</p>
<ul>
<li><strong>Output pulito in Markdown</strong></li>
</ul>
<p>L'output è formattato in Markdown con intestazioni e paragrafi adeguati. Questo rende il contenuto più facile da capire per il modello.</p>
<ul>
<li><strong>Estrazione separata delle immagini</strong></li>
</ul>
<p>Il sistema estrae e salva le immagini durante il parsing. In questo modo si evita di perdere importanti informazioni visive.</p>
<ul>
<li><strong>Migliore gestione del contesto</strong></li>
</ul>
<p>Il testo viene suddiviso utilizzando una finestra scorrevole con sovrapposizione. In questo modo si evita di tagliare frasi o formule nel mezzo, contribuendo a mantenere chiaro il significato e a migliorare l'accuratezza della ricerca.</p>
<p><strong>Flusso di parsing di base</strong></p>
<p>In backend.py, il parsing segue tre semplici passaggi:</p>
<ol>
<li>Inviare il file PDF all'API PP-StructureV3.</li>
<li>Leggere i risultati di layoutParsingResults.</li>
<li>Estrarre il testo Markdown pulito e le eventuali immagini.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Fase 2: frammentazione del testo con sovrapposizione della finestra scorrevole</h3><p>Dopo il parsing, il testo Markdown deve essere diviso in pezzi più piccoli (chunk) per la ricerca. Se il testo viene tagliato a lunghezza fissa, le frasi o le formule possono essere divise a metà.</p>
<p>Per evitare ciò, il sistema utilizza un chunking a finestra scorrevole con sovrapposizione. Ogni chunk condivide una porzione di coda con il successivo, in modo che il contenuto limite appaia in entrambe le finestre. In questo modo si mantiene intatto il significato ai margini del chunk e si migliora il richiamo del testo.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Fase 3: memorizzare vettori e metadati in Milvus</h3><p>Una volta pronti i chunk puliti, il passo successivo consiste nell'immagazzinarli in modo tale da poterli recuperare in modo rapido e preciso.</p>
<p><strong>Memorizzazione dei vettori e dei metadati</strong></p>
<p>Milvus applica regole severe per i nomi delle raccolte: solo lettere ASCII, numeri e trattini bassi. Se il nome di una knowledge base contiene caratteri non ASCII, il backend lo codifica in esadecimale con un prefisso kb_ prima di creare la raccolta e lo decodifica per la visualizzazione. Un piccolo dettaglio, ma che impedisce errori criptici.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>Oltre alla denominazione, ogni chunk passa attraverso due fasi prima dell'inserimento: la generazione di un embedding e l'aggiunta di metadati.</p>
<ul>
<li><strong>Cosa viene memorizzato:</strong></li>
</ul>
<p>Ogni pezzo viene convertito in un vettore denso a 384 dimensioni. Allo stesso tempo, lo schema Milvus memorizza campi extra come il nome del file, il numero di pagina e l'ID del chunk.</p>
<ul>
<li><strong>Perché è importante:</strong></li>
</ul>
<p>Per poter risalire da una risposta alla pagina esatta da cui proviene. Inoltre, prepara il sistema a futuri casi d'uso di Q&amp;A multimodali.</p>
<ul>
<li><strong>Ottimizzazione delle prestazioni:</strong></li>
</ul>
<p>In vector_store.py, il metodo insert_documents utilizza il batch embedding. Questo riduce il numero di richieste alla rete e rende il processo più efficiente.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Fase 4: Recupero con ricerca ibrida e fusione RRF</h3><p>Un singolo metodo di ricerca raramente è sufficiente. La ricerca vettoriale trova contenuti semanticamente simili, ma può perdere i termini esatti; la ricerca per parole chiave inchioda i termini specifici, ma perde le parafrasi. L'esecuzione di entrambi in parallelo e la fusione dei risultati produce risultati migliori di quelli ottenuti da solo.</p>
<p>Quando la lingua della query è diversa da quella del documento, il sistema traduce prima la query utilizzando un LLM, in modo che entrambi i percorsi di ricerca possano operare nella lingua del documento. Quindi le due ricerche vengono eseguite in parallelo:</p>
<ul>
<li><strong>Ricerca vettoriale (densa):</strong> Trova contenuti con un significato simile, anche in lingue diverse, ma può far emergere passaggi correlati che non rispondono direttamente alla domanda.</li>
<li><strong>Ricerca per parole chiave (rada):</strong> Trova corrispondenze esatte per termini tecnici, numeri o variabili di formule, il tipo di token che le incorporazioni vettoriali spesso ignorano.</li>
</ul>
<p>Il sistema fonde entrambi gli elenchi di risultati utilizzando la RRF (Reciprocal Rank Fusion). Ogni candidato riceve un punteggio in base alla sua posizione in ciascun elenco, quindi un pezzo che appare vicino alla cima di <em>entrambi gli</em> elenchi ottiene il punteggio più alto. La ricerca vettoriale contribuisce alla copertura semantica; la ricerca per parole chiave alla precisione dei termini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Fase 5: Riclassificazione dei risultati prima della generazione delle risposte</h3><p>I chunk restituiti dalla fase di ricerca non sono ugualmente rilevanti. Quindi, prima di generare la risposta finale, un passaggio di reranking li rivaluta.</p>
<p>In reranker_v2.py, un metodo di punteggio combinato valuta ogni chunk, che viene valutato in base a cinque aspetti:</p>
<ul>
<li><strong>Corrispondenza fuzzy</strong></li>
</ul>
<p>Utilizzando fuzzywuzzy, controlliamo quanto la formulazione del chunk sia simile alla query. Questo misura la sovrapposizione diretta del testo.</p>
<ul>
<li><strong>Copertura delle parole chiave</strong></li>
</ul>
<p>Controlliamo quante parole importanti della query compaiono nel chunk. Un maggior numero di corrispondenze di parole chiave significa un punteggio più alto.</p>
<ul>
<li><strong>Somiglianza semantica</strong></li>
</ul>
<p>Riutilizziamo il punteggio di similarità vettoriale restituito da Milvus. Questo riflette quanto sono vicini i significati.</p>
<ul>
<li><strong>Lunghezza e rango originale</strong></li>
</ul>
<p>I brani molto brevi sono penalizzati perché spesso mancano di contesto. I brani che si sono classificati più in alto nei risultati originali di Milvus ricevono un piccolo bonus.</p>
<ul>
<li><strong>Rilevamento delle entità denominate</strong></li>
</ul>
<p>Il sistema individua termini maiuscoli come "Milvus" o "RAG" come probabili nomi propri e identifica termini tecnici di più parole come possibili frasi chiave.</p>
<p>Ogni fattore ha un peso nel punteggio finale (mostrato nella figura seguente).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Non richiede dati di addestramento e il contributo di ciascun fattore è visibile. Se un chunk si classifica inaspettatamente alto o basso, i punteggi ne spiegano il motivo. Un reranker completamente black-box non offre questa possibilità.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Passo 6: Aggiungere Q&amp;A multimodale per grafici e diagrammi</h3><p>I documenti di ricerca spesso contengono grafici e diagrammi importanti che contengono informazioni che il testo non contiene. Una pipeline RAG di solo testo perderebbe completamente questi segnali.  Per gestire questo problema, abbiamo aggiunto una semplice funzione Q&amp;A basata sulle immagini, composta da tre parti:</p>
<p><strong>1. Aggiungere più contesto alla richiesta</strong></p>
<p>Quando si invia un'immagine al modello, il sistema ottiene anche il testo OCR dalla stessa pagina.<br>
Il prompt include: l'immagine, il testo della pagina e la domanda dell'utente.<br>
Questo aiuta il modello a comprendere il contesto completo e riduce gli errori di lettura dell'immagine.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Supporto dell'API di visione</strong></p>
<p>Il client (ernie_client.py) supporta il formato di visione OpenAI. Le immagini sono convertite in Base64 e inviate nel formato image_url, che consente al modello di elaborare insieme immagini e testo.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Piano di ripiego</strong></p>
<p>Se l'API delle immagini fallisce (ad esempio, a causa di problemi di rete o di limiti del modello), il sistema torna al normale RAG basato sul testo.<br>
Utilizza il testo OCR per rispondere alla domanda, in modo che il sistema continui a funzionare senza interruzioni.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Caratteristiche principali dell'interfaccia utente e implementazione della pipeline<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Come gestire la limitazione e la protezione della velocità delle API</h3><p>Quando si chiamano le API LLM o embedding, il sistema può talvolta ricevere un errore <strong>429 Too Many Requests</strong>. Questo accade di solito quando vengono inviate troppe richieste in un breve lasso di tempo.</p>
<p>Per gestire questo problema, il progetto aggiunge un meccanismo di rallentamento adattivo in ernie_client.py. Se si verifica un errore di limite di velocità, il sistema riduce automaticamente la velocità della richiesta e ritenta invece di fermarsi.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Questo aiuta a mantenere il sistema stabile, soprattutto quando si elabora e si incorpora un gran numero di documenti.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Stile personalizzato</h3><p>Il frontend utilizza Gradio (main.py). Abbiamo aggiunto un CSS personalizzato (modern_css) per rendere l'interfaccia più pulita e facile da usare.</p>
<ul>
<li><strong>Casella di input</strong></li>
</ul>
<p>Si è passati dallo stile grigio predefinito a un design bianco e arrotondato. L'aspetto è più semplice e moderno.</p>
<ul>
<li><strong>Pulsante di invio</strong></li>
</ul>
<p>Aggiunti un colore sfumato e un effetto hover per farlo risaltare di più.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">Rendering delle formule LaTeX</h3><p>Molti documenti di ricerca contengono formule matematiche, per cui è importante una resa corretta. Abbiamo aggiunto il supporto LaTeX completo per le formule in linea e in blocco.</p>
<ul>
<li><strong>Dove si applica</strong>La configurazione funziona sia nella finestra di chat (Chatbot) che nell'area di riepilogo (Markdown).</li>
<li><strong>Risultato pratico</strong>Sia che le formule appaiano nella risposta del modello o nei sommari dei documenti, vengono rese correttamente sulla pagina.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Spiegabilità: Punteggi di rilevanza e fiducia</h3><p>Per evitare un'esperienza da "scatola nera", il sistema mostra due semplici indicatori:</p>
<ul>
<li><p><strong>Pertinenza</strong></p></li>
<li><p>Mostrato sotto ogni risposta nella sezione "Riferimenti".</p></li>
<li><p>Mostra il punteggio di reranker per ogni brano citato.</p></li>
<li><p>Aiuta gli utenti a capire perché è stata utilizzata una pagina o un passaggio specifico.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Fiducia</strong></p></li>
<li><p>Mostrata nel pannello "Dettagli dell'analisi".</p></li>
<li><p>Si basa sul punteggio del brano principale (scalato al 100%).</p></li>
<li><p>Mostra la fiducia del sistema nella risposta.</p></li>
<li><p>Se è inferiore al 60%, la risposta potrebbe essere meno affidabile.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>L'interfaccia utente è mostrata di seguito. Nell'interfaccia, ogni risposta mostra il numero di pagina della fonte e il suo punteggio di rilevanza.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'accuratezza del RAG dipende dall'ingegneria tra un LLM e un database vettoriale. Questo articolo ha illustrato una build di <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> con <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> che copre ogni fase di questa progettazione:</p>
<ul>
<li><strong>Parsing del documento.</strong> PP-StructureV3 (tramite <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) converte i PDF in Markdown pulito con OCR consapevole del layout, preservando titoli, tabelle e immagini che gli estrattori di base perdono.</li>
<li><strong>Chunking.</strong> Le suddivisioni a finestra scorrevole con sovrapposizione mantengono intatto il contesto ai confini del chunk, evitando i frammenti spezzati che danneggiano il richiamo del testo.</li>
<li><strong>Memorizzazione dei vettori in Milvus.</strong> Memorizzare i vettori in modo da supportare un recupero rapido e accurato.</li>
<li><strong>Ricerca ibrida.</strong> L'esecuzione di una ricerca vettoriale e di una ricerca per parole chiave in parallelo, quindi la fusione dei risultati con RRF (Reciprocal Rank Fusion), permette di individuare sia le corrispondenze semantiche sia i risultati esatti che uno dei due metodi da solo non riuscirebbe a trovare.</li>
<li><strong>Reranking.</strong> Un reranker trasparente e basato su regole assegna un punteggio a ogni chunk in base a corrispondenza fuzzy, copertura delle parole chiave, somiglianza semantica, lunghezza e rilevamento del sostantivo appropriato: non sono necessari dati di addestramento e ogni punteggio è debuggabile.</li>
<li><strong>Q&amp;A multimodale.</strong> L'abbinamento di immagini e testo della pagina OCR nel prompt fornisce al modello di visione un contesto sufficiente per rispondere a domande su grafici e diagrammi, con un ripiego di solo testo se l'API delle immagini fallisce.</li>
</ul>
<p>Se state costruendo un sistema RAG per le domande e risposte sui documenti e desiderate una maggiore accuratezza, ci piacerebbe sapere come lo state affrontando.</p>
<p>Avete domande su <a href="https://milvus.io/">Milvus</a>, sulla ricerca ibrida o sulla progettazione di basi di conoscenza? Unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> di 20 minuti per discutere il vostro caso d'uso.</p>
