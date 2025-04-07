---
id: parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
title: 解析很困難：使用 Mistral OCR 和 Milvus 解決語意理解問題
author: Stephen Batifol
date: 2025-04-03T00:00:00.000Z
desc: 使用 Mistral OCR 和 Milvus Vector DB 的強大組合迎戰挑戰，透過可搜尋、具語義意義的向量嵌入，將您的文件解析夢魘變成平靜的美夢。
cover: >-
  assets.zilliz.com/Parsing_is_Hard_Solving_Semantic_Understanding_with_Mistral_OCR_and_Milvus_316ac013b6.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>讓我們面對現實：解析文件是很難的，真的很難。PDF 文件、圖片、報告、表格、亂七八糟的手寫字跡；它們都包含了您的使用者想要搜尋的寶貴資訊，但是要將這些資訊擷取出來並準確地表達在您的搜尋索引中，就像是在解一個拼圖，拼圖的片段不斷在改變形狀：您以為您已經用多一行的程式碼解決了問題，但是明天又有新的文件被擷取，您又發現另一個角落需要處理。</p>
<p>在這篇文章中，我們將採用 Mistral OCR 和 Milvus Vector DB 的強大組合來迎頭解決這個挑戰，利用可搜尋、具語義意義的向量嵌入，將您的文件解析惡夢變成平靜的美夢。</p>
<h2 id="Why-Rule-based-Parsing-Just-Wont-Cut-It" class="common-anchor-header">為什麼基於規則的解析無法解決問題<button data-href="#Why-Rule-based-Parsing-Just-Wont-Cut-It" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您曾經與標準 OCR 工具糾纏不清，您可能會知道它們有各種各樣的問題：</p>
<ul>
<li><strong>複雜的佈局</strong>：表格、清單、多列格式 - 對大多數解析器來說，它們可能會破壞或造成問題。</li>
<li><strong>語義模糊</strong>：單靠關鍵字並不能說明「apple」是指水果還是公司。</li>
<li>規模和成本的限制：處理數以千計的文件會變得非常緩慢。</li>
</ul>
<p>我們需要更聰明、更系統化的方法，不只是擷取文字，還要<em>了解</em>內容。這正是 Mistral OCR 和 Milvus 的用武之地。</p>
<h2 id="Meet-Your-Dream-Team" class="common-anchor-header">滿足您的夢想團隊<button data-href="#Meet-Your-Dream-Team" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Mistral-OCR-More-than-just-text-extraction" class="common-anchor-header">Mistral OCR：不只是文字擷取</h3><p>Mistral OCR 並非一般的 OCR 工具。它的設計是為了處理廣泛的文件。</p>
<ul>
<li><strong>深入了解複雜的文件</strong>：無論是內嵌的圖片、數學方程式或表格，它都能以極高的準確度理解。</li>
<li><strong>保留原始版面：</strong>它不僅能理解文件中的不同佈局，還能完整保留原始佈局和結構。除此之外，它還可以解析多頁文件。</li>
<li><strong>精通多語言和多模態</strong>：從英文到印地文再到阿拉伯文，Mistral OCR 能夠理解數千種語言和文字的文件，因此對於以全球使用者為目標的應用程式來說是無價之寶。</li>
</ul>
<h3 id="Milvus-Your-Vector-Database-Built-for-Scale" class="common-anchor-header">Milvus：為規模而建的向量資料庫</h3><ul>
<li><strong>十億以上的規模</strong>：<a href="https://milvus.io/">Milvus</a>可擴充至數十億向量，非常適合儲存大型文件。</li>
<li><strong>全文檢索：除了支援密集向量嵌入</strong>，Milvus 也支援全文檢索。讓您輕鬆使用文字執行查詢，為您的 RAG 系統取得更好的結果。</li>
</ul>
<h2 id="Examples" class="common-anchor-header">範例：<button data-href="#Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>以這張英文手寫便條為例。使用一般的 OCR 工具來擷取這個文字將會是非常困難的工作。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/A_handwritten_note_in_English_3bbc40dee7.png" alt="A handwritten note in English " class="doc-image" id="a-handwritten-note-in-english-" />
   </span> <span class="img-wrapper"> <span>英文手寫便條 </span> </span></p>
<p>我們使用 Mistral OCR 處理</p>
<pre><code translate="no" class="language-python">api_key = os.getenv(<span class="hljs-string">&quot;MISTRAL_API_KEY&quot;</span>)
client = Mistral(api_key=api_key)

url = <span class="hljs-string">&quot;https://preview.redd.it/ocr-for-handwritten-documents-v0-os036yiv9xod1.png?width=640&amp;format=png&amp;auto=webp&amp;s=29461b68383534a3c1bf76cc9e36a2ba4de13c86&quot;</span>
result = client.ocr.process(
                model=ocr_model, document={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: url}
            )
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Result: <span class="hljs-subst">{result.pages[<span class="hljs-number">0</span>].markdown}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>得到以下輸出。它可以很好地識別手寫文字。我們可以看到它甚至保留了 &quot;FORCED AND UNNATURAL&quot; 字樣的大寫格式！</p>
<pre><code translate="no" class="language-Markdown">Today is Thursday, October 20th - But it definitely feels like a Friday. I<span class="hljs-string">&#x27;m already considering making a second cup of coffee - and I haven&#x27;</span>t even finished my first. Do I have a problem?
Sometimes I<span class="hljs-string">&#x27;ll fly through older notes I&#x27;</span>ve taken, and my handwriting is unrecamptable. Perhaps it depends on the <span class="hljs-built_in">type</span> of pen I use. I<span class="hljs-string">&#x27;ve tried writing in all cups but it looks so FORCED AND UNNATURAL.
Often times, I&#x27;</span>ll just take notes on my lapten, but I still seem to ermittelt forward pen and paper. Any advice on what to
improve? I already feel stressed at looking back at what I<span class="hljs-string">&#x27;ve just written - it looks like I different people wrote this!
</span><button class="copy-code-btn"></button></code></pre>
<p>現在我們可以將文字插入 Milvus 進行語意搜尋。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient 

COLLECTION_NAME = <span class="hljs-string">&quot;document_ocr&quot;</span>

milvus_client = MilvusClient(uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>)
<span class="hljs-string">&quot;&quot;&quot;
This is where you would define the index, create a collection etc. For the sake of this example. I am skipping it. 

schema = CollectionSchema(...)

milvus_client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    )

&quot;&quot;&quot;</span>

milvus_client.insert(collection_name=COLLECTION_NAME, data=[result.pages[<span class="hljs-number">0</span>].markdown])
<button class="copy-code-btn"></button></code></pre>
<p>但 Mistral 也可以理解不同語言或更複雜格式的文件，例如讓我們試試這張德文發票，它結合了一些英文的項目名稱。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_Invoice_in_German_994e204d49.png" alt="An Invoice in German" class="doc-image" id="an-invoice-in-german" />
   </span> <span class="img-wrapper"> <span>德文發票</span> </span></p>
<p>Mistral OCR 仍然能夠擷取您所有的資訊，它甚至可以從掃描的影像中，用 Markdown 建立代表表格的表格結構。</p>
<pre><code translate="no"><span class="hljs-title class_">Rechnungsadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Lieferadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Rechnungsinformationen</span>:

<span class="hljs-title class_">Bestelldatum</span>: <span class="hljs-number">2004</span>-<span class="hljs-number">10</span>-<span class="hljs-number">20</span>
<span class="hljs-title class_">Bezahit</span>: <span class="hljs-title class_">Ja</span>
<span class="hljs-title class_">Expressversand</span>: <span class="hljs-title class_">Nein</span>
<span class="hljs-title class_">Rechnungsnummer</span>: <span class="hljs-number">4652</span>

<span class="hljs-title class_">Rechnungs</span>übersicht

| <span class="hljs-title class_">Pos</span>. | <span class="hljs-title class_">Produkt</span> | <span class="hljs-title class_">Preis</span> &lt;br&gt; (<span class="hljs-title class_">Netto</span>) | <span class="hljs-title class_">Menge</span> | <span class="hljs-title class_">Steuersatz</span> | <span class="hljs-title class_">Summe</span> &lt;br&gt; <span class="hljs-title class_">Brutto</span> |
| :--: | :--: | :--: | :--: | :--: | :--: |
| <span class="hljs-number">1</span> | <span class="hljs-title class_">Grundig</span> <span class="hljs-variable constant_">CH</span> 7280w <span class="hljs-title class_">Multi</span>-<span class="hljs-title class_">Zerkleinerer</span> (<span class="hljs-title class_">Gourmet</span>, <span class="hljs-number">400</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">11</span> <span class="hljs-title class_">Glasbeh</span>älter), weiß | <span class="hljs-number">183.49</span> C | <span class="hljs-number">2</span> | $0 \%$ | <span class="hljs-number">366.98</span> C |
| <span class="hljs-number">2</span> | <span class="hljs-title class_">Planet</span> K | <span class="hljs-number">349.9</span> C | <span class="hljs-number">2</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">832.76</span> C |
| <span class="hljs-number">3</span> | <span class="hljs-title class_">The</span> <span class="hljs-title class_">Cabin</span> <span class="hljs-keyword">in</span> the <span class="hljs-title class_">Woods</span> (<span class="hljs-title class_">Blu</span>-ray) | <span class="hljs-number">159.1</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">340.47</span> C |
| <span class="hljs-number">4</span> | <span class="hljs-title class_">Schenkung</span> auf <span class="hljs-title class_">Italienisch</span> <span class="hljs-title class_">Taschenbuch</span> - <span class="hljs-number">30.</span> | <span class="hljs-number">274.33</span> C | <span class="hljs-number">4</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1305.81</span> C |
| <span class="hljs-number">5</span> | <span class="hljs-title class_">Xbox</span> <span class="hljs-number">360</span> - <span class="hljs-title class_">Razer</span> 0N2A <span class="hljs-title class_">Controller</span> <span class="hljs-title class_">Tournament</span> <span class="hljs-title class_">Edition</span> | <span class="hljs-number">227.6</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">487.06</span> C |
| <span class="hljs-number">6</span> | <span class="hljs-title class_">Philips</span> <span class="hljs-variable constant_">LED</span>-<span class="hljs-title class_">Lampe</span> ersetzt 25Watt <span class="hljs-variable constant_">E27</span> <span class="hljs-number">2700</span> <span class="hljs-title class_">Kelvin</span> - warm-weiß, <span class="hljs-number">2.7</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">250</span> <span class="hljs-title class_">Lumen</span> <span class="hljs-title class_">IEnergieklasse</span> A++I | <span class="hljs-number">347.57</span> C | <span class="hljs-number">3</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1115.7</span> C |
| <span class="hljs-number">7</span> | <span class="hljs-title class_">Spannende</span> <span class="hljs-title class_">Abenteuer</span> <span class="hljs-title class_">Die</span> verschollene <span class="hljs-title class_">Grabkammer</span> | <span class="hljs-number">242.8</span> C | <span class="hljs-number">6</span> | $0 \%$ | <span class="hljs-number">1456.8</span> C |
| <span class="hljs-title class_">Zw</span>. summe |  | <span class="hljs-number">1784.79</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">7</span>\% |  | <span class="hljs-number">51.4</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">19</span>\% |  | <span class="hljs-number">118.6</span> C |  |  |  |
| <span class="hljs-title class_">Gesamtbetrag</span> C inkl. <span class="hljs-title class_">MwSt</span>. |  | <span class="hljs-number">1954.79</span> C |  |  |  |
<button class="copy-code-btn"></button></code></pre>
<h2 id="Real-World-Usage-A-Case-Study" class="common-anchor-header">真實世界的用法：個案研究<button data-href="#Real-World-Usage-A-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>現在我們已經看到 Mistral OCR 可以在不同的文件上運作，我們可以想像一個被案例檔案和合約淹沒的法律事務所如何利用這個工具。透過使用 Mistral OCR 和 Milvus 來執行 RAG 系統，以往需要助理花費無數個小時，例如手動掃描特定條款或比較過去的案例，現在只需要幾分鐘就能由 AI 完成。</p>
<h3 id="Next-Steps" class="common-anchor-header">下一步</h3><p>準備好擷取所有內容了嗎？前往<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/integration/mistral_ocr_with_milvus.ipynb">GitHub 上的筆記型</a>電腦取得完整範例，加入我們的<a href="http://zilliz.com/discord">Discord</a>與社群聊天，現在就開始建置！您也可以查看<a href="https://docs.mistral.ai/capabilities/document/">Mistral</a>有關其 OCR 模型的<a href="https://docs.mistral.ai/capabilities/document/">說明文件</a></p>
<p>向混亂的解析說再見，向智慧型、可擴充的文件理解說你好。</p>
