---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: >-
  Smarter Retrieval for RAG : Late Chunking with Jina Embeddings v2 and Milvus
  (en anglais)
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Améliorez la précision de RAG en utilisant Late Chunking et Milvus pour une
  intégration efficace et contextuelle des documents et une recherche
  vectorielle plus rapide et plus intelligente.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>La construction d'un système RAG robuste commence généralement par le <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>découpage des</strong></a> <strong>documents</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>, c'est-à-dire la division de</strong></a>textes volumineux en morceaux gérables pour l'intégration et la récupération. Les stratégies les plus courantes sont les suivantes</p>
<ul>
<li><p>des<strong>morceaux de taille fixe</strong> (par exemple, tous les 512 tokens)</p></li>
<li><p><strong>Morceaux de taille variable</strong> (par exemple, à la limite des paragraphes ou des phrases)</p></li>
<li><p><strong>Fenêtres coulissantes</strong> (chevauchement des portées)</p></li>
<li><p>découpage<strong>récursif</strong> (découpage hiérarchique)</p></li>
<li><p>le découpage<strong>sémantique</strong> (regroupement par thème).</p></li>
</ul>
<p>Bien que ces méthodes aient leurs mérites, elles ne tiennent pas compte du contexte à long terme. Pour relever ce défi, Jina AI crée une approche de découpage tardive : incorporez d'abord le document entier, puis découpez vos morceaux.</p>
<p>Dans cet article, nous allons explorer le fonctionnement du Late Chunking et démontrer comment sa combinaison avec <a href="https://milvus.io/">Milvus - une</a>base de données vectorielle open-source haute performance conçue pour la recherche de similarités - peut améliorer considérablement vos pipelines RAG. Que vous construisiez des bases de connaissances d'entreprise, un support client piloté par l'IA ou des applications de recherche avancée, cette présentation vous montrera comment gérer les embeddings de manière plus efficace à grande échelle.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">Qu'est-ce que le découpage tardif ?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Les méthodes de regroupement traditionnelles peuvent rompre des connexions importantes lorsque des informations clés s'étendent sur plusieurs morceaux, ce qui se traduit par des performances de recherche médiocres.</p>
<p>Prenons les notes de mise à jour de Milvus 2.4.13, divisées en deux parties comme ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1. Découpage des notes de mise à jour de Milvus 2.4.13</em></p>
<p>Si vous demandez "Quelles sont les nouvelles fonctionnalités de Milvus 2.4.13 ?", un modèle d'intégration standard risque de ne pas relier "Milvus 2.4.13" (dans le morceau 1) à ses fonctionnalités (dans le morceau 2). Le résultat ? Des vecteurs plus faibles et une précision de recherche moindre.</p>
<p>Les solutions heuristiques, telles que les fenêtres glissantes, les contextes qui se chevauchent et les balayages répétés, offrent un soulagement partiel, mais aucune garantie.</p>
<p>Le<strong>découpage traditionnel</strong> suit ce processus :</p>
<ol>
<li><p><strong>Pré-découpage du</strong> texte (par phrases, paragraphes ou longueur maximale du jeton).</p></li>
<li><p><strong>Intégrer</strong> chaque morceau séparément.</p></li>
<li><p><strong>Agrégation de l'</strong> intégration des jetons (par exemple, via un regroupement moyen) en un seul vecteur de morceaux.</p></li>
</ol>
<p>Le<strong>découpage tardif</strong> inverse le processus :</p>
<ol>
<li><p><strong>Intégrer d'abord</strong>: Exécution d'un transformateur de contexte long sur l'ensemble du document, générant des encastrements de jetons riches qui capturent le contexte global.</p></li>
<li><p>Le<strong>découpage ultérieur</strong>: La mise en commun moyenne d'étendues contiguës de ces encastrements de tokens pour former les vecteurs de morceaux finaux.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2. Découpage naïf et découpage tardif (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Source</em></a><em>)</em></p>
<p>En préservant le contexte complet du document dans chaque bloc, le découpage tardif permet d'obtenir les résultats suivants</p>
<ul>
<li><p><strong>Une plus grande précision de recherche - chaque</strong>élément est contextuel.</p></li>
<li><p><strong>Moins de morceaux - vous</strong>envoyez un texte plus ciblé à votre LLM, ce qui réduit les coûts et la latence.</p></li>
</ul>
<p>De nombreux modèles à contexte long tels que jina-embeddings-v2-base-en peuvent traiter jusqu'à 8 192 tokens, soit l'équivalent d'une lecture de 20 minutes (environ 5 000 mots), ce qui rend le découpage tardif pratique pour la plupart des documents du monde réel.</p>
<p>Maintenant que nous avons compris le "quoi" et le "pourquoi" du découpage tardif, passons au "comment". Dans la section suivante, nous vous guiderons dans la mise en œuvre pratique du pipeline de découpage tardif, nous comparerons ses performances à celles du découpage traditionnel et nous validerons son impact dans le monde réel à l'aide de Milvus. Ce parcours pratique fera le lien entre la théorie et la pratique, en montrant exactement comment intégrer le découpage tardif dans vos flux de travail RAG.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Test du découpage tardif<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Mise en œuvre de base</h3><p>Vous trouverez ci-dessous les fonctions de base du découpage tardif. Nous avons ajouté des documents clairs pour vous guider à chaque étape. La fonction <code translate="no">sentence_chunker</code> divise le document original en morceaux basés sur des paragraphes, renvoyant à la fois le contenu des morceaux et les informations d'annotation des morceaux <code translate="no">span_annotations</code> (c'est-à-dire les indices de début et de fin de chaque morceau).</p>
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
<p>La fonction <code translate="no">document_to_token_embeddings</code> utilise le modèle jinaai/jina-embeddings-v2-base-en et son tokenizer pour produire des embeddings pour l'ensemble du document.</p>
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
<p>La fonction <code translate="no">late_chunking</code> prend les enchâssements de jetons du document et les informations d'annotation du bloc original <code translate="no">span_annotations</code>, puis produit les enchâssements de blocs finaux.</p>
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
<p>Par exemple, chunking avec jinaai/jina-embeddings-v2-base-en :</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Conseil :</em> l'intégration de votre pipeline dans des fonctions facilite l'intégration d'autres modèles de contexte long ou de stratégies de découpage.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Comparaison avec les méthodes d'intégration traditionnelles</h3><p>Pour mieux démontrer les avantages du découpage tardif, nous l'avons également comparé aux approches d'intégration traditionnelles, à l'aide d'un ensemble de documents et de requêtes types.</p>
<p>Reprenons l'exemple de la note de mise à jour Milvus 2.4.13 :</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Nous mesurons la <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">similarité en cosinus</a> entre l'intégration de la requête ("milvus 2.4.13") et chaque morceau :</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Le découpage tardif a toujours été plus performant que le découpage traditionnel, produisant des similitudes en cosinus plus élevées pour chaque morceau. Cela confirme que l'intégration du document complet en premier lieu préserve le contexte global de manière plus efficace.</p>
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
<p>Nous pouvons constater que l'intégration du paragraphe complet en premier permet de s'assurer que chaque morceau contient le contexte "<code translate="no">Milvus 2.4.13</code>", ce qui améliore les scores de similarité et la qualité de la recherche.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Test du découpage tardif dans Milvus</strong></h3><p>Une fois que les encastrements de morceaux sont générés, nous pouvons les stocker dans Milvus et effectuer des requêtes. Le code suivant insère les vecteurs de morceaux dans la collection.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importation d'incorporations dans Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Interrogation et validation</h4><p>Pour valider la précision des requêtes de Milvus, nous comparons ses résultats de recherche aux scores de similarité cosinus calculés manuellement par force brute. Si les deux méthodes renvoient des résultats top-k cohérents, nous pouvons être sûrs que la précision de recherche de Milvus est fiable.</p>
<p>Nous comparons la recherche native de Milvus à une analyse de similarité en cosinus par force brute :</p>
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
<p>Cela confirme que Milvus renvoie les mêmes top-k chunks qu'une analyse cosinusim manuelle.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Les deux méthodes renvoient donc les mêmes top-3 chunks, ce qui confirme la précision de Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cet article, nous avons plongé dans les mécanismes et les avantages du découpage tardif. Nous avons commencé par identifier les lacunes des approches de découpage traditionnelles, en particulier lors du traitement de longs documents pour lesquels la préservation du contexte est cruciale. Nous avons introduit le concept de découpage tardif, qui consiste à intégrer l'ensemble du document avant de le découper en morceaux significatifs, et nous avons montré comment cela permet de préserver le contexte global, ce qui améliore la similarité sémantique et la précision de l'extraction.</p>
<p>Nous avons ensuite procédé à une mise en œuvre pratique en utilisant le modèle jina-embeddings-v2-base-en de Jina AI et évalué ses performances par rapport aux méthodes traditionnelles. Enfin, nous avons démontré comment intégrer les chunk embeddings dans Milvus pour une recherche vectorielle évolutive et précise.</p>
<p>Le découpage tardif offre une approche de l'incorporation <strong>fondée sur le contexte</strong>, parfaite pour les documents longs et complexes où le contexte est le plus important. En incorporant l'intégralité du texte en amont et en procédant à un découpage ultérieur, vous bénéficiez des avantages suivants :</p>
<ul>
<li><p><strong>🔍 Une meilleure précision de recherche</strong></p></li>
<li><p>⚡ <strong>Des invites LLM allégées et ciblées</strong></p></li>
<li><p>🛠️ <strong>Intégration simple</strong> avec n'importe quel modèle de contexte long</p></li>
</ul>
