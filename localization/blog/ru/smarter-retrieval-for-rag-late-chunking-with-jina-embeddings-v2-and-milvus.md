---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 'Более разумный поиск для RAG: поздние фрагменты с Jina Embeddings v2 и Milvus'
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Повысьте точность RAG, используя Late Chunking и Milvus для эффективного
  встраивания документов с учетом контекста и более быстрого и интеллектуального
  векторного поиска.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>Создание надежной системы RAG обычно начинается с <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>разбивки</strong></a> <strong>документов</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>- разделения</strong></a>больших текстов на удобные для встраивания и поиска фрагменты. К распространенным стратегиям относятся:</p>
<ul>
<li><p><strong>Куски фиксированного размера</strong> (например, каждые 512 лексем)</p></li>
<li><p><strong>Куски переменного размера</strong> (например, на границах абзацев или предложений)</p></li>
<li><p><strong>Скользящие окна</strong> (перекрывающиеся промежутки)</p></li>
<li><p><strong>Рекурсивное разбиение</strong> (иерархическое разбиение)</p></li>
<li><p><strong>Семантическая разбивка</strong> (группировка по темам).</p></li>
</ul>
<p>Хотя у этих методов есть свои достоинства, они часто не учитывают дальний контекст. Чтобы решить эту проблему, Jina AI разработала подход Late Chunking: сначала встраивается весь документ, а затем вырезаются фрагменты.</p>
<p>В этой статье мы рассмотрим принцип работы Late Chunking и продемонстрируем, как его сочетание с <a href="https://milvus.io/">Milvus -</a>высокопроизводительной векторной базой данных с открытым исходным кодом, созданной для поиска сходства, - может значительно улучшить ваши конвейеры RAG. Независимо от того, создаете ли вы корпоративные базы знаний, поддержку клиентов на основе ИИ или продвинутые поисковые приложения, этот обзор покажет вам, как более эффективно управлять вкраплениями в масштабе.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">Что такое поздний чанкинг?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Традиционные методы разбиения на куски могут нарушать важные связи, когда ключевая информация охватывает несколько кусков, что приводит к низкой производительности поиска.</p>
<p>Рассмотрим эти заметки о выпуске Milvus 2.4.13, разбитые на два фрагмента, как показано ниже:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 1. Разбивка на части информации о выпуске Milvus 2.4.13</em></p>
<p>Если вы спросите: "Какие новые возможности появились в Milvus 2.4.13?", стандартная модель встраивания может не связать "Milvus 2.4.13" (в фрагменте 1) с его возможностями (в фрагменте 2). Результат? Слабые векторы и низкая точность поиска.</p>
<p>Эвристические решения - такие как скользящие окна, перекрывающиеся контексты и повторное сканирование - дают частичное облегчение, но не дают никаких гарантий.</p>
<p><strong>Традиционное разбиение на куски</strong> происходит следующим образом:</p>
<ol>
<li><p><strong>Предварительная разбивка</strong> текста (по предложениям, абзацам или максимальной длине лексем).</p></li>
<li><p><strong>Встраивание</strong> каждого куска отдельно.</p></li>
<li><p><strong>Агрегирование</strong> вкраплений лексем (например, с помощью объединения средних) в единый вектор чанков.</p></li>
</ol>
<p><strong>Поздний чанкинг</strong> переворачивает конвейер:</p>
<ol>
<li><p><strong>Сначала встраиваем</strong>: Запустите трансформатор длинного контекста над полным документом, генерируя богатые вкрапления лексем, которые захватывают глобальный контекст.</p></li>
<li><p><strong>Чанк потом</strong>: Усредняем-пулируем смежные участки этих вкраплений лексем, чтобы сформировать конечные векторы чанков.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 2. Наивный чанкинг против позднего чанкинга (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>источник</em></a><em>)</em></p>
<p>Сохраняя полный контекст документа в каждом чанке, Late Chunking обеспечивает:</p>
<ul>
<li><p><strong>Более высокая точность поиска - каждый</strong>фрагмент учитывает контекст.</p></li>
<li><p><strong>Меньшее количество фрагментов - вы</strong>отправляете более целенаправленный текст в LLM, сокращая затраты и время ожидания.</p></li>
</ul>
<p>Многие модели с длинным контекстом, такие как jina-embeddings-v2-base-en, могут обрабатывать до 8 192 лексем, что эквивалентно примерно 20-минутному чтению (около 5 000 слов), что делает Late Chunking практичным для большинства реальных документов.</p>
<p>Теперь, когда мы поняли "что" и "почему", стоящие за Late Chunking, давайте перейдем к "как". В следующем разделе мы проведем вас через практическую реализацию конвейера Late Chunking, сравним его производительность с традиционным chunking и проверим его влияние на реальный мир с помощью Milvus. Этот практический обзор соединит теорию и практику и покажет, как именно интегрировать Late Chunking в рабочие процессы RAG.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Тестирование Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Базовая реализация</h3><p>Ниже приведены основные функции Late Chunking. Мы добавили понятную документацию, чтобы проследить за каждым шагом. Функция <code translate="no">sentence_chunker</code> разбивает исходный документ на фрагменты на основе абзацев, возвращая содержимое фрагмента и информацию об аннотации фрагмента <code translate="no">span_annotations</code> (т. е. начальный и конечный индексы каждого фрагмента).</p>
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
<p>Функция <code translate="no">document_to_token_embeddings</code> использует модель jinaai/jina-embeddings-v2-base-en и ее токенизатор для создания вкраплений для всего документа.</p>
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
<p>Функция <code translate="no">late_chunking</code> получает вкрапления лексем из документа и информацию об аннотации исходного чанка <code translate="no">span_annotations</code>, а затем производит окончательные вкрапления чанков.</p>
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
<p>Например, чанкинг с помощью jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Совет:</em> Если обернуть ваш конвейер в функции, то можно легко менять другие модели длинного контекста или стратегии чанкинга.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Сравнение с традиционными методами встраивания</h3><p>Чтобы еще больше продемонстрировать преимущества Late Chunking, мы также сравнили его с традиционными подходами к встраиванию, используя набор образцов документов и запросов.</p>
<p>Давайте вернемся к нашему примеру с заметкой о выпуске Milvus 2.4.13:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Мы измерили <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">косинусное сходство</a> между вложением запроса ("milvus 2.4.13") и каждым фрагментом:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Поздний чанкинг неизменно превосходит традиционный чанкинг, обеспечивая более высокое косинусное сходство в каждом чанке. Это подтверждает, что встраивание полного документа сначала более эффективно сохраняет глобальный контекст.</p>
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
<p>Мы видим, что встраивание полного абзаца первым гарантирует, что каждый фрагмент несет в себе контекст "<code translate="no">Milvus 2.4.13</code>", что повышает показатели сходства и качество поиска.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Тестирование позднего чанкинга в Milvus</strong></h3><p>После того как вкрапления чанков сгенерированы, мы можем хранить их в Milvus и выполнять запросы. Следующий код вставляет векторы чанков в коллекцию.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Импорт эмбеддингов в Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Запрос и проверка</h4><p>Чтобы проверить точность запросов Milvus, мы сравниваем результаты поиска с косинусным сходством, рассчитанным вручную. Если оба метода возвращают совпадающие результаты топ-к, мы можем быть уверены, что точность поиска Milvus надежна.</p>
<p>Мы сравниваем собственный поиск Milvus с грубой проверкой косинусного сходства:</p>
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
<p>Это подтверждает, что Milvus возвращает те же самые топ-к-куски, что и ручное сканирование по косинусному сходству.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Таким образом, оба метода дают одинаковые топ-3, что подтверждает точность Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье мы подробно рассмотрели механику и преимущества Late Chunking. Мы начали с выявления недостатков традиционных подходов к выделению фрагментов, особенно при работе с длинными документами, где сохранение контекста имеет решающее значение. Мы представили концепцию Late Chunking - встраивание всего документа перед его нарезкой на значимые фрагменты - и показали, как это сохраняет глобальный контекст, что приводит к повышению семантической схожести и точности поиска.</p>
<p>Затем мы провели практическую реализацию с использованием модели jina-embeddings-v2-base-en от Jina AI и оценили ее производительность по сравнению с традиционными методами. Наконец, мы продемонстрировали, как интегрировать вкрапления чанков в Milvus для масштабируемого и точного векторного поиска.</p>
<p>Late Chunking предлагает подход к встраиванию с <strong>учетом контекста</strong> - идеальный вариант для длинных и сложных документов, где контекст имеет наибольшее значение. Встраивая весь текст заранее и нарезая его позже, вы получаете:</p>
<ul>
<li><p><strong>🔍 Более высокая точность поиска</strong></p></li>
<li><p>⚡ <strong>Простые и целенаправленные подсказки LLM</strong></p></li>
<li><p>🛠️ <strong>Простая интеграция</strong> с любой моделью длинного контекста</p></li>
</ul>
