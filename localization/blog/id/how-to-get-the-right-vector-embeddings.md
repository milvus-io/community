---
id: how-to-get-the-right-vector-embeddings.md
title: Cara Mendapatkan Penyematan Vektor yang Tepat
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Pengantar komprehensif untuk penyematan vektor dan cara membuatnya dengan
  model sumber terbuka yang populer.
cover: assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Embeddings, Image Embeddings, Text Embeddings
recommend: true
canonicalUrl: 'https://zilliz.com/blog/how-to-get-the-right-vector-embeddings'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Artikel ini awalnya diterbitkan di <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> dan dimuat ulang di sini dengan izin.</em></p>
<p><strong>Pengantar komprehensif untuk penyematan vektor dan cara membuatnya dengan model sumber terbuka yang populer.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Gambar oleh Денис Марчук dari Pixabay</span> </span></p>
<p>Penyematan vektor sangat penting ketika bekerja dengan <a href="https://zilliz.com/blog/vector-similarity-search">kemiripan semantik</a>. Namun, vektor hanyalah serangkaian angka; penyematan vektor adalah serangkaian angka yang mewakili data masukan. Dengan menggunakan penyematan vektor, kita dapat menyusun <a href="https://zilliz.com/blog/introduction-to-unstructured-data">data yang tidak terstruktur</a> atau bekerja dengan jenis data apa pun dengan mengubahnya menjadi serangkaian angka. Pendekatan ini memungkinkan kita untuk melakukan operasi matematika pada data input, daripada mengandalkan perbandingan kualitatif.</p>
<p>Penyematan vektor sangat berpengaruh pada banyak tugas, terutama untuk <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a>. Namun, sangat penting untuk mendapatkan penyematan vektor yang sesuai sebelum menggunakannya. Misalnya, jika Anda menggunakan model gambar untuk membuat vektor teks, atau sebaliknya, Anda mungkin akan mendapatkan hasil yang buruk.</p>
<p>Dalam postingan ini, kita akan mempelajari apa arti dari vector embeddings, cara membuat vector embeddings yang tepat untuk aplikasi Anda dengan menggunakan model yang berbeda, dan cara menggunakan vector embeddings dengan database vektor seperti <a href="https://milvus.io/">Milvus</a> dan <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Bagaimana embedding vektor dibuat?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_vector_embeddings_are_created_03f9b60c68.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah kita memahami pentingnya embedding vektor, mari kita pelajari cara kerjanya. Vektor embedding adalah representasi internal dari data input dalam model pembelajaran mendalam, yang juga dikenal sebagai model embedding atau jaringan syaraf tiruan. Jadi, bagaimana cara mengekstrak informasi ini?</p>
<p>Kita mendapatkan vektor dengan menghapus lapisan terakhir dan mengambil output dari lapisan kedua hingga terakhir. Lapisan terakhir dari jaringan saraf biasanya menghasilkan prediksi model, jadi kami mengambil output dari lapisan kedua hingga terakhir. Penyematan vektor adalah data yang diumpankan ke lapisan prediktif jaringan saraf.</p>
<p>Dimensi dari sebuah embedding vektor setara dengan ukuran lapisan kedua hingga terakhir dalam model dan, dengan demikian, dapat dipertukarkan dengan ukuran atau panjang vektor. Dimensi vektor yang umum termasuk 384 (dihasilkan oleh Sentence Transformers Mini-LM), 768 (oleh Sentence Transformers MPNet), 1.536 (oleh OpenAI) dan 2.048 (oleh ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">Apa yang dimaksud dengan penyematan vektor?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Seseorang pernah bertanya kepada saya tentang arti dari setiap dimensi dalam penyematan vektor. Jawaban singkatnya adalah tidak ada. Satu dimensi dalam embedding vektor tidak berarti apa-apa, karena terlalu abstrak untuk menentukan maknanya. Namun, ketika kita menggabungkan semua dimensi, mereka memberikan makna semantik dari data input.</p>
<p>Dimensi vektor adalah representasi abstrak tingkat tinggi dari atribut yang berbeda. Atribut yang direpresentasikan bergantung pada data pelatihan dan model itu sendiri. Model teks dan gambar menghasilkan penyematan yang berbeda karena mereka dilatih untuk jenis data yang pada dasarnya berbeda. Bahkan model teks yang berbeda menghasilkan penyematan yang berbeda. Kadang-kadang mereka berbeda dalam ukuran; di lain waktu, mereka berbeda dalam atribut yang mereka wakili. Sebagai contoh, model yang dilatih untuk data hukum akan mempelajari hal-hal yang berbeda dari model yang dilatih untuk data perawatan kesehatan. Saya telah membahas topik ini dalam postingan saya <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">yang membandingkan penyematan vektor</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Menghasilkan penyematan vektor yang tepat<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagaimana Anda mendapatkan embedding vektor yang tepat? Semuanya dimulai dengan mengidentifikasi jenis data yang ingin Anda sematkan. Bagian ini mencakup penyematan lima jenis data yang berbeda: gambar, teks, audio, video, dan data multimodal. Semua model yang kami perkenalkan di sini adalah sumber terbuka dan berasal dari Hugging Face atau PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Penyematan gambar</h3><p>Pengenalan gambar mulai populer pada tahun 2012 setelah AlexNet muncul. Sejak saat itu, bidang visi komputer telah menyaksikan banyak kemajuan. Model pengenalan gambar terbaru yang terkenal adalah ResNet-50, jaringan residual sedalam 50 lapisan berdasarkan arsitektur ResNet-34 sebelumnya.</p>
<p>Jaringan saraf residual (ResNet) memecahkan masalah gradien yang menghilang dalam jaringan saraf convolutional yang dalam dengan menggunakan koneksi pintas. Koneksi ini memungkinkan output dari lapisan sebelumnya untuk pergi ke lapisan berikutnya secara langsung tanpa melewati semua lapisan perantara, sehingga menghindari masalah gradien yang hilang. Desain ini membuat ResNet tidak terlalu rumit dibandingkan dengan VGGNet (Visual Geometry Group), jaringan syaraf tiruan dengan performa terbaik sebelumnya.</p>
<p>Saya merekomendasikan dua implementasi ResNet-50 sebagai contoh: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 pada Hugging Face</a> dan <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 pada PyTorch Hub</a>. Meskipun jaringannya sama, proses mendapatkan embedding berbeda.</p>
<p>Contoh kode di bawah ini menunjukkan cara menggunakan PyTorch untuk mendapatkan embedding vektor. Pertama, kita memuat model dari PyTorch Hub. Selanjutnya, kita menghapus layer terakhir dan memanggil <code translate="no">.eval()</code> untuk menginstruksikan model agar berperilaku seperti sedang menjalankan inferensi. Kemudian, fungsi <code translate="no">embed</code> menghasilkan penyematan vektor.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace menggunakan pengaturan yang sedikit berbeda. Kode di bawah ini menunjukkan bagaimana cara mendapatkan penyematan vektor dari Hugging Face. Pertama, kita membutuhkan ekstraktor fitur dan model dari perpustakaan <code translate="no">transformers</code>. Kita akan menggunakan ekstraktor fitur untuk mendapatkan input untuk model dan menggunakan model untuk mendapatkan output dan mengekstrak keadaan tersembunyi terakhir.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, AutoModelForImageClassification


extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)
model = AutoModelForImageClassification.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)


<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Text-embeddings" class="common-anchor-header">Penyematan teks</h3><p>Para insinyur dan peneliti telah bereksperimen dengan bahasa alami dan AI sejak penemuan AI. Beberapa eksperimen paling awal meliputi:</p>
<ul>
<li>ELIZA, chatbot terapis AI pertama.</li>
<li>Chinese Room dari John Searle, sebuah eksperimen pemikiran yang meneliti apakah kemampuan untuk menerjemahkan antara bahasa Mandarin dan Inggris membutuhkan pemahaman bahasa tersebut.</li>
<li>Terjemahan berbasis aturan antara bahasa Inggris dan Rusia.</li>
</ul>
<p>Operasi AI pada bahasa alami telah berevolusi secara signifikan dari penyematan berbasis aturan. Dimulai dengan jaringan saraf primer, kami menambahkan hubungan pengulangan melalui RNN untuk melacak langkah-langkah dalam waktu. Dari sana, kami menggunakan transformer untuk menyelesaikan masalah transduksi urutan.</p>
<p>Transformator terdiri dari encoder, yang mengkodekan input ke dalam matriks yang mewakili keadaan, matriks perhatian dan decoder. Decoder menerjemahkan matriks state dan attention untuk memprediksi token berikutnya yang benar untuk menyelesaikan urutan output. GPT-3, model bahasa yang paling populer hingga saat ini, terdiri dari decoder yang ketat. Mereka menyandikan input dan memprediksi token berikutnya yang tepat.</p>
<p>Berikut adalah dua model dari perpustakaan <code translate="no">sentence-transformers</code> oleh Hugging Face yang dapat Anda gunakan sebagai tambahan untuk embedding OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: model 384 dimensi</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: model 768 dimensi</li>
</ul>
<p>Anda dapat mengakses penyematan dari kedua model dengan cara yang sama.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Penyematan multimodal</h3><p>Model multimodal kurang dikembangkan dengan baik dibandingkan model gambar atau teks. Model ini sering menghubungkan gambar dengan teks.</p>
<p>Contoh sumber terbuka yang paling berguna adalah <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, sebuah model gambar-ke-teks. Anda dapat mengakses penyematan CLIP VIT dengan cara yang sama seperti yang Anda lakukan pada model gambar, seperti yang ditunjukkan pada kode di bawah ini.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoProcessor, AutoModelForZeroShotImageClassification


processor = AutoProcessor.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
model = AutoModelForZeroShotImageClassification.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Audio-embeddings" class="common-anchor-header">Penyematan audio</h3><p>AI untuk audio kurang mendapat perhatian dibandingkan AI untuk teks atau gambar. Kasus penggunaan yang paling umum untuk audio adalah ucapan-ke-teks untuk industri seperti pusat panggilan, teknologi medis, dan aksesibilitas. Salah satu model sumber terbuka yang populer untuk ucapan-ke-teks adalah <a href="https://huggingface.co/openai/whisper-large-v2">Whisper dari OpenAI</a>. Kode di bawah ini menunjukkan cara mendapatkan penyematan vektor dari model ucapan-ke-teks.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
from transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, WhisperModel
from datasets <span class="hljs-keyword">import</span> <span class="hljs-type">load_dataset</span>


<span class="hljs-variable">model</span> <span class="hljs-operator">=</span> WhisperModel.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
feature_extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
ds = load_dataset(<span class="hljs-string">&quot;hf-internal-testing/librispeech_asr_dummy&quot;</span>, <span class="hljs-string">&quot;clean&quot;</span>, split=<span class="hljs-string">&quot;validation&quot;</span>)
inputs = feature_extractor(ds[<span class="hljs-number">0</span>][<span class="hljs-string">&quot;audio&quot;</span>][<span class="hljs-string">&quot;array&quot;</span>], return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
input_features = inputs.<span class="hljs-type">input_features</span>
<span class="hljs-variable">decoder_input_ids</span> <span class="hljs-operator">=</span> torch.tensor([[<span class="hljs-number">1</span>, <span class="hljs-number">1</span>]]) * model.config.<span class="hljs-type">decoder_start_token_id</span>
<span class="hljs-variable">vector_embedding</span> <span class="hljs-operator">=</span> model(input_features, decoder_input_ids=decoder_input_ids).last_hidden_state
<button class="copy-code-btn"></button></code></pre>
<h3 id="Video-embeddings" class="common-anchor-header">Penyematan video</h3><p>Penyematan video lebih kompleks daripada penyematan audio atau gambar. Pendekatan multimodal diperlukan ketika bekerja dengan video, karena video mencakup audio dan gambar yang disinkronkan. Salah satu model video yang populer adalah <a href="https://huggingface.co/deepmind/multimodal-perceiver">perceiver multimodal</a> dari DeepMind. <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">Tutorial buku catatan</a> ini menunjukkan cara menggunakan model ini untuk mengklasifikasikan video.</p>
<p>Untuk mendapatkan penyematan input, gunakan <code translate="no">outputs[1][-1].squeeze()</code> dari kode yang ditunjukkan dalam buku catatan alih-alih menghapus output. Saya menyoroti cuplikan kode ini dalam fungsi <code translate="no">autoencode</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">autoencode_video</span>(<span class="hljs-params">images, audio</span>):
     <span class="hljs-comment"># only create entire video once as inputs</span>
     inputs = {<span class="hljs-string">&#x27;image&#x27;</span>: torch.from_numpy(np.moveaxis(images, -<span class="hljs-number">1</span>, <span class="hljs-number">2</span>)).<span class="hljs-built_in">float</span>().to(device),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.from_numpy(audio).to(device),
               <span class="hljs-string">&#x27;label&#x27;</span>: torch.zeros((images.shape[<span class="hljs-number">0</span>], <span class="hljs-number">700</span>)).to(device)}
     nchunks = <span class="hljs-number">128</span>
     reconstruction = {}
     <span class="hljs-keyword">for</span> chunk_idx <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(nchunks)):
          image_chunk_size = np.prod(images.shape[<span class="hljs-number">1</span>:-<span class="hljs-number">1</span>]) // nchunks
          audio_chunk_size = audio.shape[<span class="hljs-number">1</span>] // SAMPLES_PER_PATCH // nchunks
          subsampling = {
               <span class="hljs-string">&#x27;image&#x27;</span>: torch.arange(
                    image_chunk_size * chunk_idx, image_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.arange(
                    audio_chunk_size * chunk_idx, audio_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;label&#x27;</span>: <span class="hljs-literal">None</span>,
          }
     <span class="hljs-comment"># forward pass</span>
          <span class="hljs-keyword">with</span> torch.no_grad():
               outputs = model(inputs=inputs, subsampled_output_points=subsampling)


          output = {k:v.cpu() <span class="hljs-keyword">for</span> k,v <span class="hljs-keyword">in</span> outputs.logits.items()}
          reconstruction[<span class="hljs-string">&#x27;label&#x27;</span>] = output[<span class="hljs-string">&#x27;label&#x27;</span>]
          <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;image&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> reconstruction:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = output[<span class="hljs-string">&#x27;image&#x27;</span>]
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = output[<span class="hljs-string">&#x27;audio&#x27;</span>]
          <span class="hljs-keyword">else</span>:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], output[<span class="hljs-string">&#x27;image&#x27;</span>]], dim=<span class="hljs-number">1</span>)
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], output[<span class="hljs-string">&#x27;audio&#x27;</span>]], dim=<span class="hljs-number">1</span>)
          vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<span class="hljs-comment"># finally, reshape image and audio modalities back to original shape</span>
     reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], images.shape)
     reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], audio.shape)
     <span class="hljs-keyword">return</span> reconstruction


     <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Menyimpan, mengindeks, dan mencari embedding vektor dengan database vektor<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang kita telah memahami apa itu penyematan vektor dan cara membuatnya menggunakan berbagai model penyematan yang kuat, pertanyaan selanjutnya adalah bagaimana cara menyimpan dan memanfaatkannya. Database vektor adalah jawabannya.</p>
<p>Basis data vektor seperti <a href="https://zilliz.com/what-is-milvus">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a> sengaja dibuat untuk menyimpan, mengindeks, dan mencari di seluruh kumpulan data yang sangat besar dari data yang tidak terstruktur melalui penyematan vektor. Database ini juga merupakan salah satu infrastruktur yang paling penting untuk berbagai tumpukan AI.</p>
<p>Basis data vektor biasanya menggunakan algoritme <a href="https://zilliz.com/glossary/anns">Approximate Nearest Neighbor (ANN</a> ) untuk menghitung jarak spasial antara vektor kueri dan vektor yang tersimpan di dalam basis data. Semakin dekat jarak kedua vektor tersebut, semakin relevan kedua vektor tersebut. Kemudian algoritme menemukan k tetangga terdekat dan memberikannya kepada pengguna.</p>
<p>Basis data vektor sangat populer dalam kasus penggunaan seperti <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM retrieval augmented generation</a> (RAG), sistem tanya jawab, sistem pemberi rekomendasi, pencarian semantik, dan pencarian kemiripan gambar, video, dan audio.</p>
<p>Untuk mempelajari lebih lanjut tentang penyematan vektor, data tidak terstruktur, dan basis data vektor, pertimbangkan untuk memulai dengan seri <a href="https://zilliz.com/blog?tag=39&amp;page=1">Basis Data Vektor 101.</a> </p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektor adalah alat yang kuat untuk bekerja dengan data yang tidak terstruktur. Dengan menggunakan vektor, kita dapat secara matematis membandingkan berbagai bagian data tidak terstruktur berdasarkan kesamaan semantik. Memilih model penyematan vektor yang tepat sangat penting untuk membangun mesin pencari vektor untuk aplikasi apa pun.</p>
<p>Dalam artikel ini, kita telah mempelajari bahwa penyematan vektor adalah representasi internal dari data input dalam jaringan saraf. Akibatnya, mereka sangat bergantung pada arsitektur jaringan dan data yang digunakan untuk melatih model. Tipe data yang berbeda (seperti gambar, teks, dan audio) memerlukan model yang spesifik. Untungnya, banyak model open source yang sudah terlatih tersedia untuk digunakan. Dalam tulisan ini, kami membahas model untuk lima jenis data yang paling umum: gambar, teks, multimodal, audio, dan video. Selain itu, jika Anda ingin memanfaatkan penyematan vektor dengan sebaik-baiknya, basis data vektor adalah alat yang paling populer.</p>
