---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: >-
  Recupero più intelligente per RAG: Late Chunking con Jina Embeddings v2 e
  Milvus
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Aumenta l'accuratezza della RAG utilizzando Late Chunking e Milvus per un
  embedding dei documenti efficiente e consapevole del contesto e una ricerca
  vettoriale più veloce e intelligente.
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: true
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>La costruzione di un robusto sistema RAG inizia solitamente con il <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>chunking</strong></a> <strong>dei documenti</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>, ovvero la suddivisione di</strong></a>testi di grandi dimensioni in parti gestibili per l'incorporazione e il recupero. Le strategie più comuni includono:</p>
<ul>
<li><p><strong>pezzi di dimensioni fisse</strong> (ad esempio, ogni 512 token)</p></li>
<li><p><strong>Pezzi di dimensioni variabili</strong> (ad esempio, confini di paragrafi o frasi)</p></li>
<li><p><strong>Finestre scorrevoli</strong> (intervalli sovrapposti)</p></li>
<li><p><strong>Chunking ricorsivo</strong> (suddivisione gerarchica)</p></li>
<li><p><strong>Chunking semantico</strong> (raggruppamento per argomento)</p></li>
</ul>
<p>Sebbene questi metodi abbiano i loro meriti, spesso non riescono ad analizzare il contesto a lungo termine. Per affrontare questa sfida, Jina AI ha creato un approccio di late chunking: incorporare prima l'intero documento e poi ritagliare i pezzi.</p>
<p>In questo articolo esploreremo il funzionamento del Late Chunking e dimostreremo come la sua combinazione con <a href="https://milvus.io/">Milvus, un</a>database vettoriale open-source ad alte prestazioni costruito per la ricerca di similarità, possa migliorare notevolmente le vostre pipeline RAG. Sia che stiate costruendo basi di conoscenza aziendali, assistenza clienti basata sull'intelligenza artificiale o applicazioni di ricerca avanzate, questa guida vi mostrerà come gestire gli embeddings in modo più efficace su scala.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">Che cos'è il chunking tardivo?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>I metodi tradizionali di chunking possono interrompere connessioni importanti quando le informazioni chiave si estendono su più chunk, con conseguenti scarse prestazioni di recupero.</p>
<p>Considerate queste note di rilascio per Milvus 2.4.13, divise in due parti come quelle che seguono:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Suddivisione della nota di rilascio di Milvus 2.4.13</em></p>
<p>Se si chiede "Quali sono le nuove caratteristiche di Milvus 2.4.13?", un modello di embedding standard potrebbe non riuscire a collegare "Milvus 2.4.13" (nel Chunk 1) con le sue caratteristiche (nel Chunk 2). Il risultato? Vettori più deboli e minore accuratezza di recupero.</p>
<p>Le soluzioni euristiche, come le finestre scorrevoli, la sovrapposizione dei contesti e le scansioni ripetute, forniscono un sollievo parziale, ma senza garanzie.</p>
<p><strong>Il chunking tradizionale</strong> segue questo percorso:</p>
<ol>
<li><p><strong>Pre-composizione del</strong> testo (per frasi, paragrafi o lunghezza massima dei token).</p></li>
<li><p><strong>Incorporare</strong> ogni pezzo separatamente.</p></li>
<li><p><strong>Aggregare le</strong> incorporazioni dei token (ad esempio, tramite pooling medio) in un unico vettore di chunk.</p></li>
</ol>
<p><strong>Il late chunking</strong> inverte la pipeline:</p>
<ol>
<li><p><strong>Incorpora per primo</strong>: Eseguire un trasformatore di contesto lungo sull'intero documento, generando embeddings di token ricchi che catturano il contesto globale.</p></li>
<li><p><strong>Poi si taglia</strong>: Mediamente si raggruppano intervalli contigui di queste incorporazioni di token per formare i vettori chunk finali.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Chunking ingenuo vs. Chunking tardivo (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>fonte</em></a><em>)</em></p>
<p>Conservando il contesto completo del documento in ogni chunk, il Late Chunking produce:</p>
<ul>
<li><p><strong>Maggiore accuratezza di recupero: ogni</strong>chunk è consapevole del contesto.</p></li>
<li><p><strong>Meno chunk: si</strong>invia un testo più mirato al LLM, riducendo i costi e la latenza.</p></li>
</ul>
<p>Molti modelli a contesto lungo, come jina-embeddings-v2-base-en, possono elaborare fino a 8.192 token, equivalenti a circa 20 minuti di lettura (circa 5.000 parole).</p>
<p>Ora che abbiamo capito il "cosa" e il "perché" del Late Chunking, passiamo al "come". Nella prossima sezione vi guideremo attraverso un'implementazione pratica della pipeline di Late Chunking, faremo un benchmark delle sue prestazioni rispetto al chunking tradizionale e ne convalideremo l'impatto nel mondo reale utilizzando Milvus. Questo percorso pratico è un ponte tra la teoria e la pratica e mostra esattamente come integrare il Late Chunking nei vostri flussi di lavoro RAG.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Test del Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Implementazione di base</h3><p>Di seguito sono riportate le funzioni principali di Late Chunking. Abbiamo aggiunto una documentazione chiara per guidarvi in ogni fase. La funzione <code translate="no">sentence_chunker</code> divide il documento originale in chunk basati su paragrafi, restituendo sia il contenuto del chunk che le informazioni di annotazione del chunk <code translate="no">span_annotations</code> (cioè gli indici di inizio e fine di ogni chunk).</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p>La funzione <code translate="no">document_to_token_embeddings</code> utilizza il modello jinaai/jina-embeddings-v2-base-en e il suo tokenizer per produrre embeddings per l'intero documento.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p>La funzione <code translate="no">late_chunking</code> prende le incorporazioni dei token del documento e le informazioni di annotazione del chunk originale <code translate="no">span_annotations</code> e produce le incorporazioni finali del chunk.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>Ad esempio, il chunking con jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Suggerimento: l'</em> involucro della pipeline in funzioni facilita l'inserimento di altri modelli a contesto lungo o di strategie di chunking.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Confronto con i metodi di embedding tradizionali</h3><p>Per dimostrare ulteriormente i vantaggi del Late Chunking, lo abbiamo anche confrontato con gli approcci tradizionali di embedding, utilizzando una serie di documenti e query campione.</p>
<p>Riprendiamo l'esempio della nostra nota di rilascio di Milvus 2.4.13:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Misuriamo la <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">similarità del coseno</a> tra l'embedding della query ("milvus 2.4.13") e ogni chunk:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Il Late Chunking ha costantemente superato il chunking tradizionale, producendo somiglianze coseno più elevate in ogni chunk. Questo conferma che l'incorporazione dell'intero documento prima preserva il contesto globale in modo più efficace.</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si può notare che l'incorporazione dell'intero paragrafo per primo garantisce che ogni chunk abbia il contesto "<code translate="no">Milvus 2.4.13</code>", aumentando i punteggi di somiglianza e la qualità del recupero.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Test del chunking tardivo in Milvus</strong></h3><p>Una volta generati i chunk embeddings, possiamo memorizzarli in Milvus ed eseguire le query. Il codice seguente inserisce i vettori chunk nella collezione.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importare le incorporazioni in Milvus</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">Interrogazione e validazione</h4><p>Per convalidare l'accuratezza delle query di Milvus, confrontiamo i suoi risultati con i punteggi di somiglianza del coseno calcolati manualmente. Se entrambi i metodi restituiscono risultati top-k coerenti, possiamo essere certi che l'accuratezza della ricerca di Milvus è affidabile.</p>
<p>Confrontiamo la ricerca nativa di Milvus con una scansione brutale della somiglianza del coseno:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>Questo conferma che Milvus restituisce gli stessi top-k chunks di una scansione manuale della somiglianza del coseno.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Entrambi i metodi restituiscono gli stessi top-3 chunk, confermando l'accuratezza di Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusioni<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo articolo abbiamo fatto un'immersione profonda nei meccanismi e nei vantaggi del Late Chunking. Abbiamo iniziato identificando le carenze degli approcci tradizionali al chunking, in particolare quando si tratta di documenti lunghi in cui la conservazione del contesto è fondamentale. Abbiamo introdotto il concetto di Late Chunking - incorporare l'intero documento prima di suddividerlo in pezzi significativi - e abbiamo mostrato come questo consenta di preservare il contesto globale, migliorando la similarità semantica e l'accuratezza del recupero.</p>
<p>Abbiamo quindi illustrato un'implementazione pratica utilizzando il modello jina-embeddings-v2-base-en di Jina AI e valutato le sue prestazioni rispetto ai metodi tradizionali. Infine, abbiamo dimostrato come integrare i chunk embeddings in Milvus per una ricerca vettoriale scalabile e accurata.</p>
<p>Il Late Chunking offre un approccio all'embedding <strong>orientato al contesto</strong>, perfetto per documenti lunghi e complessi in cui il contesto conta di più. Incorporando l'intero testo in anticipo e tagliando in un secondo momento, si ottengono i seguenti vantaggi:</p>
<ul>
<li><p><strong>🔍 Maggiore accuratezza di reperimento</strong></p></li>
<li><p>⚡ S <strong>uggerimenti LLM snelli e mirati</strong></p></li>
<li><p>🛠️ <strong>Semplice integrazione</strong> con qualsiasi modello di contesto lungo</p></li>
</ul>
