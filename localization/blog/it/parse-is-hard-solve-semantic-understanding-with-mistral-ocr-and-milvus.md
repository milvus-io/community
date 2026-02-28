---
id: parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
title: |
  Parsing is Hard: Solving Semantic Understanding with Mistral OCR and Milvus
author: Stephen Batifol
date: 2025-04-03T00:00:00.000Z
desc: >-
  Tackling the challenge head-on using the powerful combo of Mistral OCR and
  Milvus Vector DB, turning your doc parsing nightmares into a calm dream with
  searchable, semantically meaningful vector embeddings.
cover: >-
  assets.zilliz.com/Parsing_is_Hard_Solving_Semantic_Understanding_with_Mistral_OCR_and_Milvus_316ac013b6.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Let’s face it: parsing documents is hard—really hard. PDFs, images, reports, tables, messy handwriting; they’re packed with valuable information that your users want to search for, but extracting that information and express that accurately in your search index is like solving a puzzle where the pieces keep changing shape: you thought you’ve solved it with an extra line of code but tomorrow a new doc gets ingested and you find another corner case to deal with.</p>
<p>In this post, we’ll tackle this challenge head-on using the powerful combo of Mistral OCR and Milvus Vector DB, turning your doc parsing nightmares into a calm dream with searchable, semantically meaningful vector embeddings.</p>
<h2 id="Why-Rule-based-Parsing-Just-Wont-Cut-It" class="common-anchor-header">Why Rule-based Parsing Just Won’t Cut It<button data-href="#Why-Rule-based-Parsing-Just-Wont-Cut-It" class="anchor-icon" translate="no">
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
    </button></h2><p>If you’ve ever struggled with standard OCR tools, you probably know that they have all sorts of issues:</p>
<ul>
<li><strong>Complex layouts</strong>: Tables, lists, multi-column formats – they can break or pose issues to most parsers.</li>
<li><strong>Semantic ambiguity</strong>: Keywords alone don’t tell you if “apple” means fruit or company.</li>
<li>The chanllege of scale and cost: Processing thousands of documents becomes painfully slow.</li>
</ul>
<p>We need a smarter, more systematic approach that doesn’t just extract text—it <em>understands</em> the content. And that’s exactly where Mistral OCR and Milvus come in.</p>
<h2 id="Meet-Your-Dream-Team" class="common-anchor-header">Meet Your Dream Team<button data-href="#Meet-Your-Dream-Team" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Mistral-OCR-More-than-just-text-extraction" class="common-anchor-header">Mistral OCR: More than just text extraction</h3><p>Mistral OCR isn’t your average OCR tool. It’s designed to tackle a wide range of documents.</p>
<ul>
<li><strong>Deep Understanding of Complex Documents</strong>: Whether it’s embedded images, mathematical equations, or tables, it can understand it all with a very high accuracy.</li>
<li><strong>Keeps original layouts:</strong> Not only does it understand the different layouts in the documents, it also keeps the original layouts and structure intact. On top of that, it’s also capable of parsing multi-page documents.</li>
<li><strong>Multilingual and Multimodal Mastery</strong>: From English to Hindi to Arabic, Mistral OCR can comprehend documents across thousands of languages and scripts, making it invaluable for applications targeting a global user base.</li>
</ul>
<h3 id="Milvus-Your-Vector-Database-Built-for-Scale" class="common-anchor-header">Milvus: Your Vector Database Built for Scale</h3><ul>
<li><strong>Billion+ Scale</strong>: <a href="https://milvus.io/">Milvus</a> can scale to billions of vectors, making it perfect for storing large-scale documents.</li>
<li><strong>Full-Text Search: In addition to supporting dense vector embeddings</strong>, Milvus also supports Full Text Search. Making it easy to run queries using text and get better results for your RAG system.</li>
</ul>
<h2 id="Examples" class="common-anchor-header">Examples:<button data-href="#Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s take this handwritten note in English, for example. Using a regular OCR tool to extract this text would be a very hard task.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_handwritten_note_in_English_3bbc40dee7.png" alt="A handwritten note in English " class="doc-image" id="a-handwritten-note-in-english-" />
    <span>A handwritten note in English </span>
  </span>
</p>
<p>We process it with Mistral OCR</p>
<pre><code translate="no" class="language-python">api_key = os.getenv(<span class="hljs-string">&quot;MISTRAL_API_KEY&quot;</span>)
client = Mistral(api_key=api_key)

url = <span class="hljs-string">&quot;https://preview.redd.it/ocr-for-handwritten-documents-v0-os036yiv9xod1.png?width=640&amp;format=png&amp;auto=webp&amp;s=29461b68383534a3c1bf76cc9e36a2ba4de13c86&quot;</span>
result = client.ocr.process(
                model=ocr_model, document={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: url}
            )
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Result: <span class="hljs-subst">{result.pages[<span class="hljs-number">0</span>].markdown}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>And we get the following output. It can recognize handwritten text well. We can see that it even keeps the capitalized format of the words &quot;FORCED AND UNNATURAL&quot;!</p>
<pre><code translate="no" class="language-Markdown">Today is Thursday, October 20th - But it definitely feels like a Friday. I<span class="hljs-string">&#x27;m already considering making a second cup of coffee - and I haven&#x27;</span>t even finished my first. Do I have a problem?
Sometimes I<span class="hljs-string">&#x27;ll fly through older notes I&#x27;</span>ve taken, and my handwriting is unrecamptable. Perhaps it depends on the <span class="hljs-built_in">type</span> of pen I use. I<span class="hljs-string">&#x27;ve tried writing in all cups but it looks so FORCED AND UNNATURAL.
Often times, I&#x27;</span>ll just take notes on my lapten, but I still seem to ermittelt forward pen and paper. Any advice on what to
improve? I already feel stressed at looking back at what I<span class="hljs-string">&#x27;ve just written - it looks like I different people wrote this!
</span><button class="copy-code-btn"></button></code></pre>
<p>Now we can then insert the text into Milvus for semantic search.</p>
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
<p>But Mistral can also understand documents in different languages or in more complex format, for example let’s try this invoice in German that combines some item names in English.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_Invoice_in_German_994e204d49.png" alt="An Invoice in German" class="doc-image" id="an-invoice-in-german" />
    <span>An Invoice in German</span>
  </span>
</p>
<p>Mistral OCR is still capable of extracting all the information you have and it even creates the table structure in Markdown that represents the table from the scanned image.</p>
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
<h2 id="Real-World-Usage-A-Case-Study" class="common-anchor-header">Real-World Usage: A Case Study<button data-href="#Real-World-Usage-A-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we’ve seen that Mistral OCR can work on different documents, we could imagine how a legal firm that is drowning in case files and contracts leverage this tool. By implementing a RAG system with Mistral OCR and Milvus, what once took a paralegal countless hours, like manually scanning for specific clauses or comparing past cases, now is done by AI in only a couple of minutes.</p>
<h3 id="Next-Steps" class="common-anchor-header">Next Steps</h3><p>Ready to extract all your content? Head over to the <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/integration/mistral_ocr_with_milvus.ipynb">notebook on GitHub</a> for the full example, join our <a href="http://zilliz.com/discord">Discord</a> to chat with the community, and start building today! You can also check out <a href="https://docs.mistral.ai/capabilities/document/">Mistral documentation</a> about their OCR model </p>
<p>Say goodbye to parsing chaos, and hello to intelligent, scalable document understanding.</p>
