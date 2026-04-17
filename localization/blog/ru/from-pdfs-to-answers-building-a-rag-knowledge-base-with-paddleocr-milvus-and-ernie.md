---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  От PDF-файлов к ответам: Создание базы знаний RAG с помощью PaddleOCR, Milvus
  и ERNIE
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
  Узнайте, как создать высокоточную базу знаний RAG с помощью Milvus, гибридного
  поиска, реранкинга и мультимодальных вопросов и ответов для анализа
  документов.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>Большие языковые модели стали намного способнее, чем в 2023 году, но они все еще галлюцинируют от уверенности и часто опираются на устаревшую информацию. RAG (Retrieval-Augmented Generation) решает обе проблемы, извлекая релевантный контекст из векторной базы данных, такой как <a href="https://milvus.io/">Milvus</a>, до того, как модель сгенерирует ответ. Дополнительный контекст привязывает ответ к реальным источникам и делает его более актуальным.</p>
<p>Один из наиболее распространенных примеров использования RAG - база знаний компании. Пользователь загружает PDF-файлы, файлы Word или другие внутренние документы, задает вопрос на естественном языке и получает ответ, основанный на этих материалах, а не только на предварительном обучении модели.</p>
<p>Но использование одного и того же LLM и одной и той же базы векторов не гарантирует одинакового результата. Две команды могут строить на одном и том же фундаменте, но в итоге получить совершенно разное качество системы. Разница, как правило, заключается в том, что происходит на самом верхнем уровне: <strong>как разбираются, разбиваются на части и встраиваются документы; как индексируются данные; как ранжируются результаты поиска; и как собирается окончательный ответ.</strong></p>
<p>В этой статье мы рассмотрим пример <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> и объясним, как построить базу знаний на основе RAG с помощью <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> и ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Архитектура системы Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Архитектура Paddle-ERNIE-RAG состоит из четырех основных слоев:</p>
<ul>
<li><strong>Уровень извлечения данных.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, конвейер разбора документов в PaddleOCR, считывает PDF-файлы и изображения с помощью OCR с учетом компоновки. Он сохраняет структуру документа - заголовки, таблицы, порядок чтения - и выводит чистый Markdown, разбитый на перекрывающиеся куски.</li>
<li><strong>Векторный слой хранения.</strong> Каждый фрагмент встраивается в 384-мерный вектор и хранится в <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> вместе с метаданными (имя файла, номер страницы, идентификатор фрагмента). Параллельный инвертированный индекс поддерживает поиск по ключевым словам.</li>
<li><strong>Уровень поиска и ответов.</strong> Каждый запрос выполняется как по векторному индексу, так и по индексу ключевых слов. Результаты объединяются с помощью RRF (Reciprocal Rank Fusion), повторно ранжируются и передаются в модель <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> для генерации ответа.</li>
<li><strong>Прикладной уровень.</strong> Интерфейс <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/">Gradio</a> позволяет загружать документы, задавать вопросы и просматривать ответы со ссылками на источники и оценками достоверности.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>В следующих разделах мы рассмотрим каждый этап по порядку, начиная с того, как необработанные документы превращаются в текст для поиска.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Как построить конвейер RAG шаг за шагом<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Шаг 1: Разбор документов с помощью PP-StructureV3</h3><p>Необработанные документы - это то, с чего начинается большинство проблем с точностью. В научных статьях и технических отчетах сочетаются двухколоночные макеты, формулы, таблицы и изображения. Извлечение текста с помощью базовой библиотеки вроде PyPDF2 обычно приводит к искажению результатов: абзацы выглядят не по порядку, таблицы разваливаются, а формулы исчезают.</p>
<p>Чтобы избежать этих проблем, в проекте создан класс OnlinePDFParser в файле backend.py. Этот класс вызывает онлайн API PP-StructureV3 для выполнения парсинга макета. Вместо того чтобы извлекать необработанный текст, он определяет структуру документа, а затем преобразует его в формат Markdown.</p>
<p>У этого метода есть три очевидных преимущества:</p>
<ul>
<li><strong>Чистый вывод в формате Markdown</strong></li>
</ul>
<p>На выходе получается документ в формате Markdown с правильными заголовками и абзацами. Это облегчает понимание контента моделью.</p>
<ul>
<li><strong>Отдельное извлечение изображений</strong></li>
</ul>
<p>Система извлекает и сохраняет изображения во время парсинга. Это предотвращает потерю важной визуальной информации.</p>
<ul>
<li><strong>Улучшенная работа с контекстом</strong></li>
</ul>
<p>Текст разбивается с помощью скользящего окна с перекрытием. Это позволяет избежать обрыва предложений или формул посередине, что помогает сохранить ясность смысла и повышает точность поиска.</p>
<p><strong>Основной поток парсинга</strong></p>
<p>В файле backend.py парсинг выполняется в три простых шага:</p>
<ol>
<li>Отправить PDF-файл в PP-StructureV3 API.</li>
<li>Прочитать возвращаемые результаты layoutParsingResults.</li>
<li>Извлеките очищенный текст в формате Markdown и любые изображения.</li>
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
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Шаг 2: Разбивка текста на куски с наложением скользящего окна</h3><p>После парсинга текст в формате Markdown необходимо разделить на более мелкие фрагменты (chunks) для поиска. Если текст разрезан на части фиксированной длины, предложения или формулы могут быть разделены пополам.</p>
<p>Чтобы предотвратить это, система использует разбиение с помощью скользящего окна с перекрытием. Каждый кусок разделяет хвостовую часть со следующим, поэтому пограничное содержимое появляется в обоих окнах. Это позволяет сохранить смысл на краях фрагмента и улучшить запоминание.</p>
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
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Шаг 3: хранение векторов и метаданных в Milvus</h3><p>Когда чистые фрагменты готовы, следующий шаг - хранение их таким образом, чтобы обеспечить быстрый и точный поиск.</p>
<p><strong>Хранение векторов и метаданных</strong></p>
<p>В Milvus действуют строгие правила для имен коллекций - только буквы ASCII, цифры и знаки подчеркивания. Если имя базы знаний содержит не ASCII-символы, бэкэнд перед созданием коллекции кодирует его в шестнадцатеричном формате с префиксом kb_, а затем декодирует для отображения. Небольшая деталь, но она предотвращает ошибки в шифровании.</p>
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
<p>Помимо именования, каждый чанк проходит два этапа перед вставкой: генерируется вставка и прикрепляются метаданные.</p>
<ul>
<li><strong>Что хранится:</strong></li>
</ul>
<p>Каждый чанк преобразуется в 384-мерный плотный вектор. В то же время схема Milvus хранит дополнительные поля, такие как имя файла, номер страницы и идентификатор чанка.</p>
<ul>
<li><strong>Почему это важно:</strong></li>
</ul>
<p>Это позволяет отследить ответ до страницы, с которой он был получен. Кроме того, это готовит систему к будущим случаям использования мультимодальных вопросов и ответов.</p>
<ul>
<li><strong>Оптимизация производительности:</strong></li>
</ul>
<p>В vector_store.py метод insert_documents использует пакетное встраивание. Это уменьшает количество сетевых запросов и делает процесс более эффективным.</p>
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
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Шаг 4: Извлечение с помощью гибридного поиска и слияния RRF</h3><p>Одного метода поиска редко бывает достаточно. Векторный поиск находит семантически схожий контент, но может упустить точные термины; поиск по ключевым словам находит конкретные термины, но упускает перефразирование. Параллельный запуск обоих методов и объединение результатов дает лучшие результаты, чем любой из них в отдельности.</p>
<p>Если язык запроса отличается от языка документа, система сначала переводит запрос с помощью LLM, чтобы оба пути поиска работали на языке документа. Затем два поиска выполняются параллельно:</p>
<ul>
<li><strong>Векторный поиск (плотный):</strong> Находит контент с похожим смыслом, даже на разных языках, но может обнаружить связанные отрывки, которые не дают прямого ответа на вопрос.</li>
<li><strong>Поиск по ключевым словам (разреженный):</strong> Находит точные совпадения технических терминов, чисел или переменных формул - такие лексемы, которые векторные вкрапления часто сглаживают.</li>
</ul>
<p>Система объединяет оба списка результатов с помощью RRF (Reciprocal Rank Fusion). Каждый кандидат получает оценку, основанную на его ранге в каждом списке, поэтому фрагмент, который находится в верхней части <em>обоих</em> списков, получает наивысшую оценку. Векторный поиск вносит вклад в семантический охват, а поиск по ключевым словам - в точность терминов.</p>
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
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Шаг 5: Ранжирование результатов перед генерацией ответа</h3><p>Чанки, полученные в результате поиска, не являются одинаково релевантными. Поэтому перед генерацией окончательного ответа их ранжируют.</p>
<p>В reranker_v2.py комбинированный метод оценки оценивает каждый фрагмент, который оценивается по пяти аспектам:</p>
<ul>
<li><strong>Нечеткое соответствие</strong></li>
</ul>
<p>Используя fuzzywuzzy, мы проверяем, насколько формулировка фрагмента похожа на запрос. Это измеряет прямое совпадение текста.</p>
<ul>
<li><strong>Охват ключевых слов</strong></li>
</ul>
<p>Мы проверяем, сколько важных слов из запроса встречается в фрагменте. Большее количество совпадений ключевых слов означает более высокий балл.</p>
<ul>
<li><strong>Семантическое сходство</strong></li>
</ul>
<p>Мы повторно используем оценку векторного сходства, полученную Milvus. Он отражает, насколько близки значения.</p>
<ul>
<li><strong>Длина и первоначальный ранг</strong></li>
</ul>
<p>Очень короткие фрагменты наказываются, поскольку в них часто отсутствует контекст. Части, которые заняли более высокое место в исходных результатах Milvus, получают небольшой бонус.</p>
<ul>
<li><strong>Обнаружение именованных сущностей</strong></li>
</ul>
<p>Система определяет термины с заглавной буквы, такие как "Milvus" или "RAG", как вероятные собственные существительные, а также определяет многословные технические термины как возможные ключевые фразы.</p>
<p>Каждый фактор имеет свой вес в итоговой оценке (показано на рисунке ниже).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для этого не требуется обучающих данных, и вклад каждого фактора заметен. Если какой-то фрагмент занимает неожиданно высокое или низкое место, оценка объясняет причину. Полностью "черный ящик" реранкера этого не дает.</p>
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
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Шаг 6: Добавьте мультимодальные вопросы и ответы для графиков и диаграмм</h3><p>Исследовательские работы часто содержат важные графики и диаграммы, которые несут информацию, недоступную в тексте. Конвейер RAG, работающий только с текстом, полностью пропустил бы эти сигналы.  Чтобы справиться с этой проблемой, мы добавили простую функцию вопросов и ответов на основе изображений, состоящую из трех частей:</p>
<p><strong>1. Добавить дополнительный контекст к подсказке</strong></p>
<p>Отправляя изображение в модель, система также получает OCR-текст с той же страницы.<br>
Подсказка включает в себя: изображение, текст страницы и вопрос пользователя.<br>
Это помогает модели понять весь контекст и уменьшить количество ошибок при чтении изображения.</p>
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
<p><strong>2. Поддержка Vision API</strong></p>
<p>Клиент (ernie_client.py) поддерживает формат видения OpenAI. Изображения конвертируются в Base64 и отправляются в формате image_url, что позволяет модели обрабатывать одновременно изображение и текст.</p>
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
<p><strong>3. План резервного копирования</strong></p>
<p>Если API изображений не работает (например, из-за проблем с сетью или ограничений модели), система переключается на обычный текстовый RAG.<br>
Для ответа на вопрос используется текст OCR, поэтому система продолжает работать без перебоев.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Ключевые особенности пользовательского интерфейса и их реализация для конвейера<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Как работать с ограничением и защитой скорости API</h3><p>При вызове LLM или встраивании API система иногда может получить ошибку <strong>429 Too Many Requests</strong>. Обычно это происходит, когда за короткое время отправляется слишком много запросов.</p>
<p>Чтобы справиться с этим, проект добавляет механизм адаптивного замедления в ernie_client.py. Если возникает ошибка ограничения скорости, система автоматически снижает скорость запроса и повторяет попытку вместо остановки.</p>
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
<p>Это помогает поддерживать стабильность системы, особенно при обработке и встраивании большого количества документов.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Пользовательский стиль</h3><p>Фронтенд использует Gradio (main.py). Мы добавили пользовательский CSS (modern_css), чтобы сделать интерфейс чище и проще в использовании.</p>
<ul>
<li><strong>Поле ввода</strong></li>
</ul>
<p>Сменили серый стиль по умолчанию на белый, округлый. Оно выглядит проще и современнее.</p>
<ul>
<li><strong>Кнопка "Отправить</strong></li>
</ul>
<p>Добавлены градиентный цвет и эффект наведения, чтобы она больше выделялась.</p>
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
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">Рендеринг формул LaTeX</h3><p>Многие научные документы содержат математические формулы, поэтому их правильное отображение очень важно. Мы добавили полную поддержку LaTeX для формул как в строке, так и в блоке.</p>
<ul>
<li><strong>Где применяется</strong>Настройка работает как в окне чата (Chatbot), так и в области резюме (Markdown).</li>
<li><strong>Практический результат</strong>Независимо от того, появляются ли формулы в ответе модели или в резюме документа, они корректно отображаются на странице.</li>
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
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Объяснимость: баллы релевантности и уверенность</h3><p>Чтобы избежать ощущения "черного ящика", система показывает два простых показателя:</p>
<ul>
<li><p><strong>Релевантность .</strong></p></li>
<li><p>Отображается под каждым ответом в разделе "Ссылки".</p></li>
<li><p>Отображает оценку реранкера для каждого цитируемого фрагмента.</p></li>
<li><p>Помогает пользователям понять, почему была использована та или иная страница или отрывок.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Уверенность</strong></p></li>
<li><p>Отображается на панели "Детали анализа".</p></li>
<li><p>Основана на оценке верхнего фрагмента (в масштабе 100 %).</p></li>
<li><p>Показывает, насколько система уверена в ответе.</p></li>
<li><p>Если ниже 60 %, ответ может быть менее надежным.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Пользовательский интерфейс показан ниже. В интерфейсе каждый ответ показывает номер страницы источника и его оценку релевантности.</p>
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
    </button></h2><p>Точность RAG зависит от инженерии между LLM и векторной базой данных. В этой статье мы рассмотрели сборку <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> с <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a>, которая охватывает каждый этап этой инженерии:</p>
<ul>
<li><strong>Парсинг документов.</strong> PP-StructureV3 (через <a href="https://github.com/PaddlePaddle/PaddleOCR"></a> PaddleOCR) преобразует PDF-файлы в чистый Markdown с помощью OCR с поддержкой верстки, сохраняя заголовки, таблицы и изображения, которые теряют базовые экстракторы.</li>
<li><strong>Разбивка на части.</strong> Разбиение с помощью скользящего окна с перекрытием сохраняет контекст на границах фрагментов, предотвращая разрыв фрагментов, который вредит запоминанию при поиске.</li>
<li><strong>Хранение векторов в Milvus.</strong> Храните векторы таким образом, чтобы обеспечить быстрый и точный поиск.</li>
<li><strong>Гибридный поиск.</strong> Параллельный запуск векторного поиска и поиска по ключевым словам, а затем объединение результатов с помощью RRF (Reciprocal Rank Fusion) позволяет выявить как семантические совпадения, так и точные совпадения, которые не были бы обнаружены ни одним из методов.</li>
<li><strong>Реранкинг.</strong> Прозрачный, основанный на правилах реранкер оценивает каждый фрагмент по нечеткому совпадению, охвату ключевых слов, семантическому сходству, длине и обнаружению правильных существительных - не требуется никаких обучающих данных, и каждый результат можно отладить.</li>
<li><strong>Мультимодальные вопросы и ответы.</strong> Сопряжение изображений с OCR-текстом страницы в подсказке дает модели зрения достаточно контекста, чтобы отвечать на вопросы о графиках и диаграммах, с возможностью резервного копирования только текста, если API изображений не работает.</li>
</ul>
<p>Если вы создаете систему RAG для вопросов и ответов на документы и хотите добиться большей точности, мы будем рады услышать, как вы к этому подходите.</p>
<p>У вас есть вопросы о <a href="https://milvus.io/">Milvus</a>, гибридном поиске или проектировании баз знаний? Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу в Slack</a> или запишитесь на 20-минутную сессию <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы обсудить ваш вариант использования.</p>
