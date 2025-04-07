---
id: parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
title: >-
  Il parsing è difficile: risolvere la comprensione semantica con Mistral OCR e
  Milvus
author: Stephen Batifol
date: 2025-04-03T00:00:00.000Z
desc: >-
  Affrontare la sfida utilizzando la potente combinazione di Mistral OCR e
  Milvus Vector DB, trasformando gli incubi del parsing dei documenti in un
  sogno tranquillo con incorporazioni vettoriali ricercabili e semanticamente
  significative.
cover: >-
  assets.zilliz.com/Parsing_is_Hard_Solving_Semantic_Understanding_with_Mistral_OCR_and_Milvus_316ac013b6.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Ammettiamolo: analizzare i documenti è difficile, molto difficile. PDF, immagini, report, tabelle, grafie disordinate: sono pieni di informazioni preziose che i vostri utenti vogliono cercare, ma estrarre queste informazioni ed esprimerle accuratamente nel vostro indice di ricerca è come risolvere un puzzle in cui i pezzi cambiano continuamente forma: pensavate di averlo risolto con una riga di codice in più, ma domani un nuovo documento viene ingerito e troverete un altro caso da risolvere.</p>
<p>In questo post affronteremo questa sfida utilizzando la potente combinazione di Mistral OCR e Milvus Vector DB, trasformando i vostri incubi di parsing dei documenti in un sogno tranquillo con incorporazioni vettoriali ricercabili e semanticamente significative.</p>
<h2 id="Why-Rule-based-Parsing-Just-Wont-Cut-It" class="common-anchor-header">Perché il parsing basato su regole non è sufficiente<button data-href="#Why-Rule-based-Parsing-Just-Wont-Cut-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete mai lottato con gli strumenti OCR standard, probabilmente saprete che hanno tutti i tipi di problemi:</p>
<ul>
<li><strong>Layout complessi</strong>: Tabelle, elenchi, formati a più colonne: possono rompere o creare problemi alla maggior parte dei parser.</li>
<li><strong>Ambiguità semantica</strong>: Le parole chiave da sole non ci dicono se "mela" significa frutta o azienda.</li>
<li>Il problema della scala e dei costi: L'elaborazione di migliaia di documenti diventa dolorosamente lenta.</li>
</ul>
<p>Abbiamo bisogno di un approccio più intelligente e sistematico che non si limiti a estrarre il testo, ma <em>ne comprenda il</em> contenuto. Ed è proprio qui che entrano in gioco Mistral OCR e Milvus.</p>
<h2 id="Meet-Your-Dream-Team" class="common-anchor-header">Il team dei vostri sogni<button data-href="#Meet-Your-Dream-Team" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Mistral-OCR-More-than-just-text-extraction" class="common-anchor-header">Mistral OCR: più di una semplice estrazione di testo</h3><p>Mistral OCR non è il solito strumento OCR. È stato progettato per affrontare un'ampia gamma di documenti.</p>
<ul>
<li><strong>Comprensione profonda di documenti complessi</strong>: Che si tratti di immagini incorporate, equazioni matematiche o tabelle, è in grado di comprendere tutto con un'elevata precisione.</li>
<li><strong>Conserva i layout originali:</strong> Non solo comprende i diversi layout dei documenti, ma mantiene anche intatti i layout e la struttura originali. Inoltre, è in grado di analizzare documenti di più pagine.</li>
<li><strong>Padronanza multilingue e multimodale</strong>: Dall'inglese all'hindi all'arabo, Mistral OCR è in grado di comprendere documenti in migliaia di lingue e scritture, rendendolo prezioso per le applicazioni destinate a una base di utenti globale.</li>
</ul>
<h3 id="Milvus-Your-Vector-Database-Built-for-Scale" class="common-anchor-header">Milvus: il vostro database vettoriale costruito in scala</h3><ul>
<li><strong>Scala miliardaria</strong>: <a href="https://milvus.io/">Milvus</a> può scalare fino a miliardi di vettori, il che lo rende perfetto per l'archiviazione di documenti di grandi dimensioni.</li>
<li><strong>Ricerca a tutto testo: Oltre a supportare le incorporazioni vettoriali dense</strong>, Milvus supporta anche la ricerca full text. In questo modo è facile eseguire query utilizzando il testo e ottenere risultati migliori per il sistema RAG.</li>
</ul>
<h2 id="Examples" class="common-anchor-header">Esempi:<button data-href="#Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Prendiamo ad esempio questa nota scritta a mano in inglese. Utilizzare un normale strumento OCR per estrarre questo testo sarebbe un compito molto difficile.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/A_handwritten_note_in_English_3bbc40dee7.png" alt="A handwritten note in English " class="doc-image" id="a-handwritten-note-in-english-" />
   </span> <span class="img-wrapper"> <span>Una nota scritta a mano in inglese </span> </span></p>
<p>Lo elaboriamo con Mistral OCR</p>
<pre><code translate="no" class="language-python">api_key = os.getenv(<span class="hljs-string">&quot;MISTRAL_API_KEY&quot;</span>)
client = Mistral(api_key=api_key)

url = <span class="hljs-string">&quot;https://preview.redd.it/ocr-for-handwritten-documents-v0-os036yiv9xod1.png?width=640&amp;format=png&amp;auto=webp&amp;s=29461b68383534a3c1bf76cc9e36a2ba4de13c86&quot;</span>
result = client.ocr.process(
                model=ocr_model, document={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: url}
            )
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Result: <span class="hljs-subst">{result.pages[<span class="hljs-number">0</span>].markdown}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>E otteniamo il seguente risultato. È in grado di riconoscere bene il testo scritto a mano. Possiamo notare che mantiene persino il formato maiuscolo delle parole &quot;FORCED AND UNNATURAL&quot;!</p>
<pre><code translate="no" class="language-Markdown">Today is Thursday, October 20th - But it definitely feels like a Friday. I<span class="hljs-string">&#x27;m already considering making a second cup of coffee - and I haven&#x27;</span>t even finished my first. Do I have a problem?
Sometimes I<span class="hljs-string">&#x27;ll fly through older notes I&#x27;</span>ve taken, and my handwriting is unrecamptable. Perhaps it depends on the <span class="hljs-built_in">type</span> of pen I use. I<span class="hljs-string">&#x27;ve tried writing in all cups but it looks so FORCED AND UNNATURAL.
Often times, I&#x27;</span>ll just take notes on my lapten, but I still seem to ermittelt forward pen and paper. Any advice on what to
improve? I already feel stressed at looking back at what I<span class="hljs-string">&#x27;ve just written - it looks like I different people wrote this!
</span><button class="copy-code-btn"></button></code></pre>
<p>Ora possiamo inserire il testo in Milvus per la ricerca semantica.</p>
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
<p>Ma Mistral è in grado di comprendere anche documenti in lingue diverse o in formati più complessi, ad esempio proviamo questa fattura in tedesco che combina alcuni nomi di articoli in inglese.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_Invoice_in_German_994e204d49.png" alt="An Invoice in German" class="doc-image" id="an-invoice-in-german" />
   </span> <span class="img-wrapper"> <span>Una fattura in tedesco</span> </span></p>
<p>L'OCR di Mistral è ancora in grado di estrarre tutte le informazioni e crea persino la struttura della tabella in Markdown che rappresenta la tabella dall'immagine scansionata.</p>
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
<h2 id="Real-World-Usage-A-Case-Study" class="common-anchor-header">Utilizzo nel mondo reale: Un caso di studio<button data-href="#Real-World-Usage-A-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo visto che Mistral OCR è in grado di lavorare su diversi documenti, possiamo immaginare come uno studio legale, affollato di fascicoli e contratti, possa sfruttare questo strumento. Implementando un sistema RAG con Mistral OCR e Milvus, ciò che una volta richiedeva innumerevoli ore a un paralegale, come la scansione manuale di clausole specifiche o il confronto di casi passati, ora viene fatto dall'intelligenza artificiale in un paio di minuti.</p>
<h3 id="Next-Steps" class="common-anchor-header">I prossimi passi</h3><p>Siete pronti a estrarre tutti i vostri contenuti? Andate al <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/integration/mistral_ocr_with_milvus.ipynb">notebook su GitHub</a> per l'esempio completo, unitevi al nostro <a href="http://zilliz.com/discord">Discord</a> per chattare con la comunità e iniziate a costruire oggi stesso! Potete anche consultare la <a href="https://docs.mistral.ai/capabilities/document/">documentazione di Mistral</a> sul suo modello OCR. </p>
<p>Dite addio al caos del parsing e date il benvenuto a una comprensione intelligente e scalabile dei documenti.</p>
