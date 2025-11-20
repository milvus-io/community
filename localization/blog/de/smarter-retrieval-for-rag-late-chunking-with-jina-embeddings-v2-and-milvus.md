---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 'Smarter Retrieval für RAG: Late Chunking mit Jina Embeddings v2 und Milvus'
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Steigern Sie die RAG-Genauigkeit mit Late Chunking und Milvus für effiziente,
  kontextbewusste Dokumenteneinbettungen und schnellere, intelligentere
  Vektorsuche.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>Der Aufbau eines robusten RAG-Systems beginnt in der Regel mit dem <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>Chunking von</strong></a> <strong>Dokumenten</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>- der Aufteilung</strong></a>großer Texte in handhabbare Teile für die Einbettung und das Abrufen. Gängige Strategien sind:</p>
<ul>
<li><p><strong>Stücke fester Größe</strong> (z. B. alle 512 Token)</p></li>
<li><p><strong>Chunks mit variabler Größe</strong> (z. B. an Absatz- oder Satzgrenzen)</p></li>
<li><p><strong>Gleitende Fenster</strong> (überlappende Zeitspannen)</p></li>
<li><p><strong>Rekursives Chunking</strong> (hierarchische Splits)</p></li>
<li><p><strong>Semantisches Chunking</strong> (Gruppierung nach Themen)</p></li>
</ul>
<p>Diese Methoden haben zwar ihre Vorzüge, doch fehlt ihnen oft der weitreichende Kontext. Um dieser Herausforderung zu begegnen, hat Jina AI einen Late Chunking-Ansatz entwickelt: Zuerst wird das gesamte Dokument eingebettet, dann werden die Chunks herausgeschnitten.</p>
<p>In diesem Artikel erfahren Sie, wie Late Chunking funktioniert und wie die Kombination mit <a href="https://milvus.io/">Milvus - einer</a>leistungsstarken Open-Source-Vektordatenbank, die für die Ähnlichkeitssuche entwickelt wurde - Ihre RAG-Pipelines drastisch verbessern kann. Ganz gleich, ob Sie unternehmensweite Wissensdatenbanken, KI-gesteuerten Kundensupport oder fortgeschrittene Suchanwendungen erstellen, dieser Exkurs zeigt Ihnen, wie Sie Einbettungen im großen Maßstab effektiver verwalten können.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">Was ist Late Chunking?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Herkömmliche Chunking-Methoden können wichtige Verbindungen unterbrechen, wenn sich wichtige Informationen über mehrere Chunks erstrecken, was zu einer schlechten Abrufleistung führt.</p>
<p>Betrachten Sie diese Versionshinweise für Milvus 2.4.13, die wie unten dargestellt in zwei Abschnitte unterteilt sind:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 1. Chunking Milvus 2.4.13 Release Note</em></p>
<p>Wenn Sie die Frage stellen: "Was sind die neuen Funktionen in Milvus 2.4.13?", kann ein Standard-Einbettungsmodell "Milvus 2.4.13" (in Chunk 1) nicht mit den Funktionen (in Chunk 2) verbinden. Das Ergebnis? Schwächere Vektoren und geringere Abrufgenauigkeit.</p>
<p>Heuristische Lösungen - wie gleitende Fenster, überlappende Kontexte und wiederholte Scans - bieten eine teilweise Entlastung, aber keine Garantien.</p>
<p>Das<strong>traditionelle Chunking</strong> folgt diesem Schema:</p>
<ol>
<li><p><strong>Vorchunking</strong> des Textes (nach Sätzen, Absätzen oder maximaler Tokenlänge).</p></li>
<li><p>Jedes Chunk<strong>wird</strong> separat<strong>eingebettet</strong>.</p></li>
<li><p><strong>Aggregieren der</strong> Token-Einbettungen (z. B. durch Durchschnittspooling) zu einem einzigen Chunk-Vektor.</p></li>
</ol>
<p><strong>Late Chunking</strong> kehrt die Pipeline um:</p>
<ol>
<li><p><strong>Zuerst einbetten</strong>: Führen Sie einen Long-Context-Transformer über das gesamte Dokument aus und erzeugen Sie so umfangreiche Token-Einbettungen, die den globalen Kontext erfassen.</p></li>
<li><p><strong>Später Chunking</strong>: Ein Durchschnitts-Pooling zusammenhängender Bereiche dieser Token-Einbettungen, um die endgültigen Chunk-Vektoren zu bilden.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 2. Naives Chunking vs. Late Chunking (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Quelle</em></a><em>)</em></p>
<p>Durch die Erhaltung des vollständigen Dokumentkontextes in jedem Chunk bietet Late Chunking folgende Vorteile:</p>
<ul>
<li><p><strong>Höhere Abrufgenauigkeit - jeder</strong>Chunk ist kontextabhängig.</p></li>
<li><p><strong>Weniger Chunks - Sie</strong>senden mehr fokussierten Text an Ihren LLM und reduzieren so Kosten und Latenzzeiten.</p></li>
</ul>
<p>Viele Long-Context-Modelle wie jina-embeddings-v2-base-de können bis zu 8.192 Token verarbeiten - das entspricht etwa einer Lesezeit von 20 Minuten (ca. 5.000 Wörter) - was Late Chunking für die meisten realen Dokumente praktisch macht.</p>
<p>Nachdem wir nun das "Was" und "Warum" hinter Late Chunking verstanden haben, wollen wir uns nun mit dem "Wie" beschäftigen. Im nächsten Abschnitt führen wir Sie durch eine praktische Implementierung der Late Chunking-Pipeline, vergleichen ihre Leistung mit der des traditionellen Chunking und validieren ihre Auswirkungen in der Praxis mit Milvus. Dieser praktische Durchgang schlägt eine Brücke zwischen Theorie und Praxis und zeigt genau, wie Sie Late Chunking in Ihre RAG-Workflows integrieren können.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Testen von Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Grundlegende Implementierung</h3><p>Nachfolgend finden Sie die Kernfunktionen für Late Chunking. Wir haben klare Dokumentationen hinzugefügt, um Sie durch jeden Schritt zu führen. Die Funktion <code translate="no">sentence_chunker</code> teilt das Originaldokument in absatzbasierte Chunks auf und gibt sowohl den Chunk-Inhalt als auch die Chunk-Annotationsinformationen <code translate="no">span_annotations</code> (d.h. die Start- und Endindizes jedes Chunks) zurück.</p>
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
<p>Die Funktion <code translate="no">document_to_token_embeddings</code> verwendet das jinaai/jina-embeddings-v2-base-de-Modell und seinen Tokenizer, um Einbettungen für das gesamte Dokument zu erzeugen.</p>
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
<p>Die Funktion <code translate="no">late_chunking</code> nimmt die Token-Einbettungen des Dokuments und die ursprünglichen Chunk-Annotation-Informationen <code translate="no">span_annotations</code> und erzeugt dann die endgültigen Chunk-Einbettungen.</p>
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
<p>Zum Beispiel: Chunking mit jinaai/jina-embeddings-v2-base-de:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Tipp:</em> Wenn Sie Ihre Pipeline in Funktionen verpacken, können Sie leicht andere Langkontext-Modelle oder Chunking-Strategien einfügen.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Vergleich mit traditionellen Einbettungsmethoden</h3><p>Um die Vorteile von Late Chunking weiter zu demonstrieren, haben wir es auch mit traditionellen Einbettungsmethoden verglichen, indem wir eine Reihe von Beispieldokumenten und Abfragen verwendet haben.</p>
<p>Lassen Sie uns noch einmal unser Milvus 2.4.13 Release Note Beispiel betrachten:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Wir messen die <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">Kosinus-Ähnlichkeit</a> zwischen der Einbettung der Anfrage ("milvus 2.4.13") und jedem Chunk:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Late Chunking übertraf durchweg das traditionelle Chunking, indem es höhere Kosinus-Ähnlichkeiten über jeden Chunk ergab. Dies bestätigt, dass die Einbettung des vollständigen Dokuments zuerst den globalen Kontext besser bewahrt.</p>
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
<p>Wir können sehen, dass die Einbettung des vollständigen Absatzes zuerst sicherstellt, dass jeder Chunk den "<code translate="no">Milvus 2.4.13</code>" Kontext trägt, was die Ähnlichkeitswerte und die Abrufqualität erhöht.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Testen des Late Chunking in Milvus</strong></h3><p>Sobald die Chunk-Einbettungen generiert sind, können wir sie in Milvus speichern und Abfragen durchführen. Der folgende Code fügt Chunk-Vektoren in die Sammlung ein.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importieren von Einbettungen in Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Abfrage und Validierung</h4><p>Um die Genauigkeit der Milvus-Abfragen zu überprüfen, vergleichen wir die Abfrageergebnisse mit den manuell berechneten Brute-Force-Cosinus-Ähnlichkeitswerten. Wenn beide Methoden konsistente Top-k-Ergebnisse liefern, können wir sicher sein, dass die Suchgenauigkeit von Milvus zuverlässig ist.</p>
<p>Wir vergleichen die native Suche von Milvus mit einem Brute-Force-Cosinus-Ähnlichkeitsscan:</p>
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
<p>Dies bestätigt, dass Milvus die gleichen Top-k-Chunks liefert wie ein manueller Cosinus-Sim-Scan.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Beide Methoden liefern also die gleichen Top-3-Chunks, was die Genauigkeit von Milvus bestätigt.</p>
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
    </button></h2><p>In diesem Artikel haben wir uns eingehend mit den Mechanismen und Vorteilen von Late Chunking beschäftigt. Wir begannen damit, die Unzulänglichkeiten herkömmlicher Chunking-Ansätze aufzuzeigen, insbesondere bei langen Dokumenten, bei denen die Erhaltung des Kontexts entscheidend ist. Wir stellten das Konzept des Late Chunking vor - das Einbetten des gesamten Dokuments, bevor es in sinnvolle Teile zerlegt wird - und zeigten, wie dadurch der globale Kontext erhalten bleibt, was zu einer verbesserten semantischen Ähnlichkeit und Abrufgenauigkeit führt.</p>
<p>Anschließend führten wir eine praktische Implementierung mit dem Modell jina-embeddings-v2-base-de von Jina AI durch und bewerteten dessen Leistung im Vergleich zu herkömmlichen Methoden. Abschließend wurde gezeigt, wie die Chunk-Embeddings in Milvus für eine skalierbare und genaue Vektorsuche integriert werden können.</p>
<p>Late Chunking bietet einen <strong>kontextbezogenen</strong> Ansatz zur Einbettung - perfekt für lange, komplexe Dokumente, bei denen der Kontext am wichtigsten ist. Durch die Einbettung des gesamten Textes im Voraus und die spätere Zerlegung gewinnen Sie:</p>
<ul>
<li><p><strong>🔍 Höhere Abrufgenauigkeit</strong></p></li>
<li><p>⚡ S <strong>chlanke, fokussierte LLM-Eingabeaufforderungen</strong></p></li>
<li><p>🛠️ <strong>Einfache Integration</strong> in ein beliebiges Modell für lange Kontexte</p></li>
</ul>
