---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: >-
  Nano Banana + Milvus: превращение шумихи в мультимодальный RAG, готовый к
  работе на предприятии
author: Lumina Wang
date: 2025-09-04T00:00:00.000Z
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, nano banana'
meta_keywords: 'Vibe coding, nano banana, Milvus, model context protocol'
meta_title: |
  Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: >-
  Мы расскажем, как объединить Nano Banana и Milvus для создания мультимодальной
  RAG-системы, готовой к использованию на предприятии, и почему эта пара
  открывает следующую волну приложений ИИ.
origin: >-
  https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---
<p>Нано-банан сейчас нарасхват в социальных сетях, и не зря! Вы наверняка видели изображения, которые он генерирует, или даже пробовали сами. Это новейшая модель генерации изображений, которая с поразительной точностью и скоростью превращает обычный текст в коллекционные снимки фигурок.</p>
<p>Введите что-то вроде <em>"поменяйте местами шляпу и юбку Элона"</em>, и примерно через 16 секунд вы получите фотореалистичный результат: рубашка заправлена, цвета смешаны, аксессуары на месте - никаких ручных правок. Никаких задержек.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beach_side_668179b830.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Я тоже не смог удержаться и не протестировать его. Мое задание гласило:</p>
<p><em>"Используйте модель Nano Banana для создания коммерческой фигурки персонажа в масштабе 1/7, изображенного на иллюстрации, в реалистичном стиле и окружении. Поместите фигурку на компьютерный стол, используя круглую прозрачную акриловую подставку без текста. На экране компьютера отобразите процесс моделирования фигуры в ZBrush. Рядом с экраном поместите коробку для упаковки игрушек в стиле Bandai с оригинальной иллюстрацией".</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Результат меня поразил - он выглядел как серийный прототип прямо со стенда на выставке.</p>
<p>Неудивительно, что команды уже находят для него серьезное применение. Один из наших клиентов, мобильная развлекательная платформа с гачей и одевалками, разрабатывает функцию, которая позволит игрокам загружать фотографии и мгновенно наряжать свои аватары внутриигровыми аксессуарами. Бренды электронной коммерции экспериментируют с принципом "снимай один раз, используй вечно": снимают базовый образ модели, а затем генерируют бесконечные варианты нарядов и причесок с помощью искусственного интеллекта, вместо того чтобы 20 раз переснимать в студии.</p>
<p>Но вот в чем загвоздка - одно лишь генерирование изображений не решает всей проблемы. Этим системам также необходим <strong>интеллектуальный поиск</strong>: способность мгновенно находить нужные наряды, реквизит и визуальные элементы из массивных неструктурированных медиабиблиотек. Без этого генеративная модель будет гадать в темноте. Что действительно нужно компаниям, так это <strong>мультимодальная система RAG (retrieval-augmented generation), в которой</strong>Nano Banana занимается творчеством, а мощная векторная база данных - контекстом.</p>
<p>Именно здесь на помощь приходит <strong>Milvus</strong>. Будучи векторной базой данных с открытым исходным кодом, Milvus может индексировать и искать по миллиардам вкраплений - изображениям, тексту, аудио и другим. В паре с Nano Banana он становится основой готового к производству мультимодального конвейера RAG: поиск, сопоставление и генерация в масштабах предприятия.</p>
<p>В этой части блога мы расскажем, как объединить Nano Banana и Milvus для создания готовой к работе мультимодальной RAG-системы, и почему эта пара открывает следующую волну приложений ИИ.</p>
<h2 id="Building-a-Text-to-Image-Retrieval-Engine" class="common-anchor-header">Создание механизма преобразования текста в изображение<button data-href="#Building-a-Text-to-Image-Retrieval-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Для быстро развивающихся брендов потребительских товаров, игровых студий и медиакомпаний узким местом в создании изображений с помощью ИИ является не модель, а беспорядок.</p>
<p>Их архивы - это болото неструктурированных данных, включая снимки товаров, персонажей, рекламные видеоролики и рендеры нарядов. И когда вам нужно найти "красную накидку из прошлого сезона Lunar drop", удачи - традиционный поиск по ключевым словам с этим не справится.</p>
<p>Решение? Создать <strong>систему поиска по тексту и изображению</strong>.</p>
<p>Вот как это делается: используйте <a href="https://openai.com/research/clip?utm_source=chatgpt.com">CLIP</a> для встраивания текстовых и графических данных в векторы. Храните эти векторы в <strong>Milvus</strong>, векторной базе данных с открытым исходным кодом, специально созданной для поиска по сходству. Затем, когда пользователь вводит описание ("красная шелковая накидка с золотой отделкой"), вы обращаетесь к базе данных и возвращаете 3 наиболее семантически похожих изображения.</p>
<p>Это быстро. Масштабируемо. И превращает вашу беспорядочную медиатеку в структурированный, доступный для запросов банк активов.</p>
<p>Вот как его создать:</p>
<p>Установите зависимости</p>
<pre><code translate="no"><span class="hljs-comment"># Install necessary packages</span>
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
<button class="copy-code-btn"></button></code></pre>
<p>Импорт необходимых библиотек</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> clip
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">import</span> matplotlib.pyplot <span class="hljs-keyword">as</span> plt
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
<span class="hljs-keyword">import</span> math

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All libraries imported successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Инициализировать клиент Milvus</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,token=<span class="hljs-string">&quot;root:Miluvs&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus client initialized successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Загрузить модель CLIP</p>
<pre><code translate="no"><span class="hljs-comment"># Load CLIP model</span>
model_name = <span class="hljs-string">&quot;ViT-B/32&quot;</span>
device = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
model, preprocess = clip.load(model_name, device=device)
model.<span class="hljs-built_in">eval</span>()

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;CLIP model &#x27;<span class="hljs-subst">{model_name}</span>&#x27; loaded successfully, running on device: <span class="hljs-subst">{device}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model input resolution: <span class="hljs-subst">{model.visual.input_resolution}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Context length: <span class="hljs-subst">{model.context_length}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Vocabulary size: <span class="hljs-subst">{model.vocab_size}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Вывести результат:</p>
<pre><code translate="no"><span class="hljs-variable constant_">CLIP</span> model <span class="hljs-string">`ViT-B/32`</span> loaded successfully, running <span class="hljs-attr">on</span>: cpu
 <span class="hljs-title class_">Model</span> input <span class="hljs-attr">resolution</span>: <span class="hljs-number">224</span>
 <span class="hljs-title class_">Context</span> <span class="hljs-attr">length</span>: <span class="hljs-number">77</span>
 <span class="hljs-title class_">Vocabulary</span> <span class="hljs-attr">size</span>: <span class="hljs-number">49</span>,<span class="hljs-number">408</span>
<button class="copy-code-btn"></button></code></pre>
<p>Определение функций извлечения признаков</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_image</span>(<span class="hljs-params">image_path</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode image into normalized feature vector&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        image = preprocess(Image.<span class="hljs-built_in">open</span>(image_path)).unsqueeze(<span class="hljs-number">0</span>).to(device)
        
        <span class="hljs-keyword">with</span> torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
        
        <span class="hljs-keyword">return</span> image_features.squeeze().cpu().tolist()
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Error processing image <span class="hljs-subst">{image_path}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_text</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text into normalized feature vector&quot;&quot;&quot;</span>
    text_tokens = clip.tokenize([text]).to(device)
    
    <span class="hljs-keyword">with</span> torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
    
    <span class="hljs-keyword">return</span> text_features.squeeze().cpu().tolist()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Feature extraction functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Создание коллекции Milvus</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;production_image_collection&quot;</span>
<span class="hljs-comment"># If collection already exists, delete it</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Existing collection deleted: <span class="hljs-subst">{collection_name}</span>&quot;</span>)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=<span class="hljs-number">512</span>,  <span class="hljs-comment"># CLIP ViT-B/32 embedding dimension</span>
    auto_id=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Auto-generate ID</span>
    enable_dynamic_field=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Enable dynamic fields</span>
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>  <span class="hljs-comment"># Use cosine similarity</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; created successfully!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection info: <span class="hljs-subst">{milvus_client.describe_collection(collection_name)}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выходной результат успешного создания коллекции:</p>
<pre><code translate="no">Existing collection deleted: production_image_collection
Collection <span class="hljs-string">&#x27;production_image_collection&#x27;</span> created successfully!
Collection info: {<span class="hljs-string">&#x27;collection_name&#x27;</span>: <span class="hljs-string">&#x27;production_image_collection&#x27;</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;num_shards&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {}, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">101</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;vector&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">512</span>}}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">102</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;function&#x27;</span>: [], <span class="hljs-string">&#x27;aliases&#x27;</span>: [], <span class="hljs-string">&#x27;collection_id&#x27;</span>: <span class="hljs-number">460508990706033544</span>, <span class="hljs-string">&#x27;consistency_level&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;properties&#x27;</span>: {}, <span class="hljs-string">&#x27;num_partitions&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;created_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>, <span class="hljs-string">&#x27;updated_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Обработка и вставка изображений</p>
<pre><code translate="no"><span class="hljs-comment"># Set image directory path</span>
image_dir = <span class="hljs-string">&quot;./production_image&quot;</span>
raw_data = []

<span class="hljs-comment"># Get all supported image formats</span>
image_extensions = [<span class="hljs-string">&#x27;*.jpg&#x27;</span>, <span class="hljs-string">&#x27;*.jpeg&#x27;</span>, <span class="hljs-string">&#x27;*.png&#x27;</span>, <span class="hljs-string">&#x27;*.JPEG&#x27;</span>, <span class="hljs-string">&#x27;*.JPG&#x27;</span>, <span class="hljs-string">&#x27;*.PNG&#x27;</span>]
image_paths = []

<span class="hljs-keyword">for</span> ext <span class="hljs-keyword">in</span> image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> images in <span class="hljs-subst">{image_dir}</span>&quot;</span>)

<span class="hljs-comment"># Process images and generate embeddings</span>
successful_count = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> i, image_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(image_paths):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Processing progress: <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> - <span class="hljs-subst">{os.path.basename(image_path)}</span>&quot;</span>)
    
    image_embedding = encode_image(image_path)
    <span class="hljs-keyword">if</span> image_embedding <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image_dict = {
            <span class="hljs-string">&quot;vector&quot;</span>: image_embedding,
            <span class="hljs-string">&quot;filepath&quot;</span>: image_path,
            <span class="hljs-string">&quot;filename&quot;</span>: os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += <span class="hljs-number">1</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully processed <span class="hljs-subst">{successful_count}</span> images&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выходные данные о ходе обработки изображений:</p>
<pre><code translate="no">Found 50 images <span class="hljs-keyword">in</span> ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
<button class="copy-code-btn"></button></code></pre>
<p>Вставка данных в Milvus</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data into Milvus</span>
<span class="hljs-keyword">if</span> raw_data:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Inserting data into Milvus...&quot;</span>)
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> images into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample inserted IDs: <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;ids&#x27;</span>][:<span class="hljs-number">5</span>]}</span>...&quot;</span>)  <span class="hljs-comment"># Show first 5 IDs</span>
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No successfully processed image data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Определение функций поиска и визуализации</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_images_by_text</span>(<span class="hljs-params">query_text, top_k=<span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Search images based on text query&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Search query: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    
    <span class="hljs-comment"># Encode query text</span>
    query_embedding = encode_text(query_text)
    
    <span class="hljs-comment"># Search in Milvus</span>
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;filepath&quot;</span>, <span class="hljs-string">&quot;filename&quot;</span>]
    )
    
    <span class="hljs-keyword">return</span> search_results[<span class="hljs-number">0</span>]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">visualize_search_results</span>(<span class="hljs-params">query_text, results</span>):
    <span class="hljs-string">&quot;&quot;&quot;Visualize search results&quot;&quot;&quot;</span>
    num_images = <span class="hljs-built_in">len</span>(results)
    
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No matching images found&quot;</span>)
        <span class="hljs-keyword">return</span>
    
    <span class="hljs-comment"># Create subplots</span>
    fig, axes = plt.subplots(<span class="hljs-number">1</span>, num_images, figsize=(<span class="hljs-number">5</span>*num_images, <span class="hljs-number">5</span>))
    fig.suptitle(<span class="hljs-string">f&#x27;Search Results: &quot;<span class="hljs-subst">{query_text}</span>&quot; (Top <span class="hljs-subst">{num_images}</span>)&#x27;</span>, fontsize=<span class="hljs-number">16</span>, fontweight=<span class="hljs-string">&#x27;bold&#x27;</span>)
    
    <span class="hljs-comment"># Handle single image case</span>
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">1</span>:
        axes = [axes]
    
    <span class="hljs-comment"># Display images</span>
    <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
        <span class="hljs-keyword">try</span>:
            img_path = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filepath&#x27;</span>]
            filename = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filename&#x27;</span>]
            score = result[<span class="hljs-string">&#x27;distance&#x27;</span>]
            
            <span class="hljs-comment"># Load and display image</span>
            img = Image.<span class="hljs-built_in">open</span>(img_path)
            axes[i].imshow(img)
            axes[i].set_title(<span class="hljs-string">f&quot;<span class="hljs-subst">{filename}</span>\nSimilarity: <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>&quot;</span>, fontsize=<span class="hljs-number">10</span>)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
            
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. File: <span class="hljs-subst">{filename}</span>, Similarity score: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
            
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            axes[i].text(<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>, <span class="hljs-string">f&#x27;Error loading image\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&#x27;</span>,
                        ha=<span class="hljs-string">&#x27;center&#x27;</span>, va=<span class="hljs-string">&#x27;center&#x27;</span>, transform=axes[i].transAxes)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
    
    plt.tight_layout()
    plt.show()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search and visualization functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выполнение поиска по тексту и изображению</p>
<pre><code translate="no"><span class="hljs-comment"># Example search 1</span>
query1 = <span class="hljs-string">&quot;a golden watch&quot;</span>
results1 = search_images_by_text(query1, top_k=<span class="hljs-number">3</span>)
visualize_search_results(query1, results1)
<button class="copy-code-btn"></button></code></pre>
<p>Результаты выполнения поискового запроса:</p>
<pre><code translate="no"><span class="hljs-title class_">Search</span> <span class="hljs-attr">query</span>: <span class="hljs-string">&#x27;a golden watch&#x27;</span>
<span class="hljs-number">1.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">19</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2934</span>
<span class="hljs-number">2.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">download</span> (<span class="hljs-number">26</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.3073</span>
<span class="hljs-number">3.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">17</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2717</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/watch_067c39ba51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Using-Nano-banana-to-Create-Brand-Promotional-Images" class="common-anchor-header">Использование Nano-banana для создания рекламных изображений бренда<button data-href="#Using-Nano-banana-to-Create-Brand-Promotional-Images" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда наша система поиска по тексту и изображениям работает с Milvus, давайте интегрируем Nano-banana для создания нового рекламного контента на основе полученных данных.</p>
<p>Установите Google SDK</p>
<pre><code translate="no">%pip install google-generativeai
%pip install requests
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Google Generative AI SDK installation complete!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Настройте Gemini API</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.<span class="hljs-property">generativeai</span> <span class="hljs-keyword">as</span> genai
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> io <span class="hljs-keyword">import</span> <span class="hljs-title class_">BytesIO</span>
genai.<span class="hljs-title function_">configure</span>(api_key=<span class="hljs-string">&quot;&lt;your_api_key&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Генерировать новые изображения</p>
<pre><code translate="no">prompt = (
    <span class="hljs-string">&quot;An European male model wearing a suit, carrying a gold watch.&quot;</span>
)

image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;/path/to/image/watch.jpg&quot;</span>)

model = genai.GenerativeModel(<span class="hljs-string">&#x27;gemini-2.5-flash-image-preview&#x27;</span>)
response = model.generate_content([prompt, image])

<span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> response.candidates[<span class="hljs-number">0</span>].content.parts:
    <span class="hljs-keyword">if</span> part.text <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">print</span>(part.text)
    <span class="hljs-keyword">elif</span> part.inline_data <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image = Image.<span class="hljs-built_in">open</span>(BytesIO(part.inline_data.data))
        image.save(<span class="hljs-string">&quot;generated_image.png&quot;</span>)
        image.show()
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/suit_976b6f1df2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-This-Means-for-Your-Development-Workflow" class="common-anchor-header">Что это значит для вашего рабочего процесса разработки<button data-href="#What-This-Means-for-Your-Development-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Как разработчик, эта интеграция Milvus + Nano-banana в корне меняет ваш подход к проектам по созданию контента. Вместо того чтобы управлять статичными библиотеками активов или полагаться на дорогостоящие творческие команды, у вас теперь есть динамичная система, которая получает и генерирует именно то, что нужно вашему приложению в режиме реального времени.</p>
<p>Рассмотрим следующий недавний клиентский сценарий: бренд запустил несколько новых продуктов, но решил полностью отказаться от традиционного процесса фотосъемки. Используя нашу интегрированную систему, они могли мгновенно генерировать рекламные изображения, объединив существующую базу данных продуктов с возможностями генерации Nano-banana.</p>
<p><em>Задача: Модель надевает эти продукты на пляже.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_5a2a042b46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Настоящая мощь становится очевидной, когда нужно создать сложный, многовариантный контент, который традиционно требует длительной координации между фотографами, моделями и декораторами. Благодаря тому, что Milvus занимается поиском активов, а Nano-banana управляет генерацией, вы можете программно создавать сложные сцены, которые адаптируются к вашим конкретным требованиям:</p>
<p><em>Подсказка: Модель позирует, прислонившись к синему спортивному автомобилю с откидным верхом. На ней платье-халтер и сопутствующие аксессуары. Ее украшает бриллиантовое колье и синие часы, на ногах - туфли на высоком каблуке, а в руке она держит кулон лабуду.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shoes_98e1e4c70b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для разработчиков, работающих в сфере игр или коллекционных товаров, эта система открывает совершенно новые возможности для быстрого создания прототипов и проверки концепций. Вместо того чтобы тратить недели на 3D-моделирование, прежде чем понять, работает ли концепция, теперь можно создавать фотореалистичные визуализации продуктов, включая упаковку, окружающий контекст и даже производственные процессы:</p>
<p><em>Подсказка: Используйте модель нано-банана, чтобы создать коммерческую фигурку персонажа на иллюстрации в масштабе 1/7, в реалистичном стиле и окружении. Поместите фигурку на компьютерный стол, используя круглую прозрачную акриловую подставку без текста. На экране компьютера отобразите процесс моделирования фигуры в ZBrush. Рядом с экраном компьютера поместите упаковочную коробку для игрушек в стиле BANDAI с оригинальной иллюстрацией.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_3d_5189d53773.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>С технической точки зрения Nano Banana - это не просто новинка, это готовый к производству продукт в тех аспектах, которые важны для разработчиков. Его самая сильная сторона - согласованность и управляемость, что означает меньшее количество побочных ситуаций, проникающих в логику вашего приложения. Не менее важно и то, что он справляется с тонкими деталями, которые часто приводят к сбоям в автоматизированных конвейерах: сохранение постоянства фирменных цветов, создание физически правдоподобного освещения и отражений, а также обеспечение визуальной согласованности в различных выходных форматах.</p>
<p>Настоящее волшебство происходит, когда вы объединяете его с векторной базой данных Milvus. Векторная база данных не просто хранит вкрапления - она становится интеллектуальным менеджером активов, который может выводить на поверхность наиболее актуальный исторический контент, чтобы направлять новые поколения. Результат: ускорение процесса генерации (потому что модель имеет лучший контекст), повышение согласованности во всем приложении и возможность автоматического соблюдения рекомендаций по бренду или стилю.</p>
<p>Одним словом, Milvus превращает Nano Banana из творческой игрушки в масштабируемую корпоративную систему.</p>
<p>Конечно, ни одна система не бывает безупречной. Сложные, многоступенчатые инструкции все равно могут вызвать заминки, а физика освещения иногда растягивает реальность сильнее, чем хотелось бы. Самое надежное решение, которое мы видели, - дополнять текстовые подсказки эталонными изображениями, хранящимися в Milvus, что дает модели более богатую базу, более предсказуемые результаты и сокращает циклы итераций. При такой настройке вы не просто экспериментируете с мультимодальной RAG - вы уверенно запускаете ее в производство.</p>
