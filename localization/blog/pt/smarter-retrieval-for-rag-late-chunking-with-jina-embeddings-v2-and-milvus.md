---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 'Smarter Retrieval for RAG: Late Chunking with Jina Embeddings v2 and Milvus'
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Aumente a precisão do RAG utilizando o Late Chunking e o Milvus para obter uma
  incorporação de documentos eficiente e consciente do contexto e uma pesquisa
  vetorial mais rápida e inteligente.
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>A construção de um sistema RAG robusto começa normalmente com a <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>fragmentação de</strong></a> <strong>documentos</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>- dividindo</strong></a>grandes textos em partes manejáveis para incorporação e recuperação. As estratégias mais comuns incluem:</p>
<ul>
<li><p><strong>Partes de tamanho fixo</strong> (por exemplo, a cada 512 tokens)</p></li>
<li><p><strong>Partes de tamanho variável</strong> (por exemplo, limites de parágrafos ou frases)</p></li>
<li><p><strong>Janelas deslizantes</strong> (intervalos sobrepostos)</p></li>
<li><p><strong>Chunking recursivo</strong> (divisões hierárquicas)</p></li>
<li><p><strong>Chunking semântico</strong> (agrupamento por tópicos)</p></li>
</ul>
<p>Embora estes métodos tenham os seus méritos, muitas vezes não têm em conta o contexto de longo alcance. Para responder a este desafio, a Jina AI cria uma abordagem de Late Chunking: primeiro, incorpora o documento inteiro e, depois, separa os seus pedaços.</p>
<p>Neste artigo, vamos explorar como funciona o Late Chunking e demonstrar como a sua combinação com o <a href="https://milvus.io/">Milvus - uma</a>base de dados vetorial open-source de alto desempenho criada para pesquisa de semelhanças - pode melhorar drasticamente os seus pipelines RAG. Quer esteja a criar bases de conhecimento empresariais, suporte ao cliente orientado por IA ou aplicações de pesquisa avançada, este passo a passo irá mostrar-lhe como gerir os embeddings de forma mais eficaz em escala.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">O que é chunking tardio?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Os métodos tradicionais de fragmentação podem quebrar conexões importantes quando informações importantes abrangem vários blocos, resultando em um desempenho de recuperação ruim.</p>
<p>Considere estas notas de lançamento do Milvus 2.4.13, divididas em dois pedaços como abaixo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Nota de lançamento do Milvus 2.4.13 em pedaços</em></p>
<p>Se perguntar: "Quais são as novas funcionalidades do Milvus 2.4.13?", um modelo de incorporação normal pode não conseguir ligar "Milvus 2.4.13" (no fragmento 1) às suas funcionalidades (no fragmento 2). O resultado? Vectores mais fracos e menor precisão de recuperação.</p>
<p>As correcções heurísticas - tais como janelas deslizantes, contextos sobrepostos e análises repetidas - proporcionam um alívio parcial, mas sem garantias.</p>
<p><strong>O chunking tradicional</strong> segue este processo:</p>
<ol>
<li><p>Texto<strong>pré-fragmentado</strong> (por frases, parágrafos ou comprimento máximo de token).</p></li>
<li><p><strong>Incorporar</strong> cada pedaço separadamente.</p></li>
<li><p><strong>Agregar</strong> as incorporações de tokens (por exemplo, via pooling médio) em um único vetor de chunk.</p></li>
</ol>
<p><strong>O Late Chunking</strong> inverte o pipeline:</p>
<ol>
<li><p><strong>Incorporar primeiro</strong>: Executa um transformador de contexto longo sobre o documento completo, gerando incorporações de token ricas que capturam o contexto global.</p></li>
<li><p><strong>Separar depois</strong>: Faça a média dos intervalos contíguos desses token embeddings para formar seus vetores de pedaços finais.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Naive Chunking vs. Late Chunking (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Fonte</em></a><em>)</em></p>
<p>Ao preservar o contexto completo do documento em cada pedaço, o Late Chunking produz:</p>
<ul>
<li><p><strong>Maior precisão de recuperação - cada</strong>pedaço é contextualmente consciente.</p></li>
<li><p><strong>Menos pedaços -</strong>envia texto mais focado para o LLM, reduzindo os custos e a latência.</p></li>
</ul>
<p>Muitos modelos de contexto longo, como o jina-embeddings-v2-base-en, podem processar até 8.192 tokens - o equivalente a uma leitura de cerca de 20 minutos (aproximadamente 5.000 palavras) - tornando o Late Chunking prático para a maioria dos documentos do mundo real.</p>
<p>Agora que entendemos o "o quê" e o "porquê" por trás do Late Chunking, vamos mergulhar no "como". Na próxima secção, vamos guiá-lo através de uma implementação prática do pipeline Late Chunking, comparar o seu desempenho com o chunking tradicional e validar o seu impacto no mundo real utilizando o Milvus. Este passo-a-passo prático fará a ponte entre a teoria e a prática, mostrando exatamente como integrar o Late Chunking nos seus fluxos de trabalho RAG.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Testando o Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Implementação básica</h3><p>Abaixo estão as principais funções do Late Chunking. Adicionámos documentação clara para o guiar em cada passo. A função <code translate="no">sentence_chunker</code> divide o documento original em partes baseadas em parágrafos, devolvendo o conteúdo da parte e as informações de anotação da parte <code translate="no">span_annotations</code> (ou seja, os índices de início e fim de cada parte).</p>
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
<p>A função <code translate="no">document_to_token_embeddings</code> utiliza o modelo jinaai/jina-embeddings-v2-base-en e o seu tokenizador para produzir embeddings para todo o documento.</p>
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
<p>A função <code translate="no">late_chunking</code> recebe os encaixes dos tokens do documento e a informação original de anotação dos pedaços <code translate="no">span_annotations</code>, produzindo depois os encaixes finais dos pedaços.</p>
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
<p>Por exemplo, chunking com jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Dica:</em> Envolver o seu pipeline em funções facilita a troca por outros modelos de contexto longo ou estratégias de chunking.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Comparação com os métodos tradicionais de incorporação</h3><p>Para demonstrar ainda mais as vantagens do Late Chunking, também o comparamos com as abordagens tradicionais de incorporação, usando um conjunto de documentos e consultas de amostra.</p>
<p>E voltemos ao nosso exemplo da nota de lançamento do Milvus 2.4.13:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Medimos <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">a semelhança de cosseno</a> entre a incorporação da consulta ("milvus 2.4.13") e cada pedaço:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>O Late Chunking superou consistentemente o chunking tradicional, produzindo maiores semelhanças de cosseno em cada pedaço. Isto confirma que a incorporação do documento completo primeiro preserva o contexto global de forma mais eficaz.</p>
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
<p>Podemos ver que a incorporação do parágrafo completo primeiro assegura que cada fração tem o contexto "<code translate="no">Milvus 2.4.13</code>", aumentando as pontuações de semelhança e a qualidade da recuperação.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Testar o Late Chunking no Milvus</strong></h3><p>Uma vez gerados os chunk embeddings, podemos armazená-los no Milvus e efetuar consultas. O código seguinte insere vectores de pedaços na coleção.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importando embeddings para o Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Consulta e validação</h4><p>Para validar a exatidão das consultas Milvus, comparamos os seus resultados com as pontuações de similaridade de cosseno de força bruta calculadas manualmente. Se ambos os métodos retornarem resultados top-k consistentes, podemos ter a certeza de que a precisão da pesquisa do Milvus é fiável.</p>
<p>Comparamos a pesquisa nativa do Milvus com uma análise de força bruta de similaridade de cosseno:</p>
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
<p>Isto confirma que o Milvus devolve o mesmo top-k de blocos que uma pesquisa manual de cosine-sim.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Assim, ambos os métodos produzem os mesmos pedaços top-3, confirmando a precisão do Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste artigo, mergulhamos profundamente na mecânica e nos benefícios do Late Chunking. Começámos por identificar as deficiências das abordagens tradicionais de fragmentação, especialmente quando se trata de documentos longos em que a preservação do contexto é crucial. Introduzimos o conceito de Late Chunking - incorporando todo o documento antes de o dividir em pedaços significativos - e mostrámos como isto preserva o contexto global, levando a uma melhor semelhança semântica e precisão de recuperação.</p>
<p>De seguida, fizemos uma implementação prática utilizando o modelo jina-embeddings-v2-base-en da Jina AI e avaliámos o seu desempenho em comparação com os métodos tradicionais. Por fim, demonstrámos como integrar os chunk embeddings no Milvus para uma pesquisa vetorial escalável e precisa.</p>
<p>O Late Chunking oferece uma abordagem de incorporação que prioriza <strong>o contexto</strong> - perfeita para documentos longos e complexos, onde o contexto é mais importante. Ao incorporar todo o texto antecipadamente e fatiar depois, você ganha:</p>
<ul>
<li><p><strong>🔍 Maior precisão na recuperação</strong></p></li>
<li><p><strong>Solicitações de LLM enxutas e focadas</strong></p></li>
<li><p>🛠️ <strong>Integração simples</strong> com qualquer modelo de contexto longo</p></li>
</ul>
