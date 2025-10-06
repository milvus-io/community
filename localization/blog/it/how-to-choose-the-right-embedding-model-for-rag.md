---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: >-
  Da Word2Vec a LLM2Vec: Come scegliere il giusto modello di incorporazione per
  RAG
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  Questo blog vi spiegherà come valutare le incorporazioni nella pratica, in
  modo da poter scegliere quella più adatta al vostro sistema RAG.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>I modelli linguistici di grandi dimensioni sono potenti, ma hanno una debolezza ben nota: le allucinazioni. La <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG (Retrieval-Augmented Generation)</a> è uno dei modi più efficaci per affrontare questo problema. Invece di affidarsi esclusivamente alla memoria del modello, RAG recupera le conoscenze rilevanti da una fonte esterna e le incorpora nel prompt, assicurando che le risposte siano fondate su dati reali.</p>
<p>Un sistema RAG è costituito in genere da tre componenti principali: il LLM stesso, un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> come <a href="https://milvus.io/">Milvus</a> per la memorizzazione e la ricerca delle informazioni e un modello di incorporazione. Il modello di embedding è quello che converte il linguaggio umano in vettori leggibili dalla macchina. È il traduttore tra il linguaggio naturale e il database. La qualità di questo traduttore determina la rilevanza del contesto recuperato. Se è corretto, gli utenti vedranno risposte accurate e utili. Se si sbaglia, anche la migliore infrastruttura produce rumore, errori e sprechi di calcolo.</p>
<p>Ecco perché è così importante capire i modelli di incorporazione. Ce ne sono molti tra cui scegliere: dai primi metodi come Word2Vec ai moderni modelli basati su LLM, come la famiglia di modelli di incorporazione del testo di OpenAI. Ognuno di essi ha i propri compromessi e punti di forza. Questa guida vi mostrerà come valutare gli embeddings nella pratica, in modo da poter scegliere quello più adatto al vostro sistema RAG.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">Cosa sono gli embeddings e perché sono importanti?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Al livello più semplice, gli embeddings trasformano il linguaggio umano in numeri comprensibili alle macchine. Ogni parola, frase o documento viene mappato in uno spazio vettoriale ad alta dimensione, dove la distanza tra i vettori cattura le relazioni tra di essi. I testi con significati simili tendono a raggrupparsi, mentre i contenuti non correlati tendono ad allontanarsi. È questo che rende possibile la ricerca semantica: trovare un significato, non solo parole chiave corrispondenti.</p>
<p>I modelli di incorporazione non funzionano tutti allo stesso modo. In genere si dividono in tre categorie, ciascuna con punti di forza e compromessi:</p>
<ul>
<li><p>I<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>vettori sparsi</strong></a> (come BM25) si concentrano sulla frequenza delle parole chiave e sulla lunghezza dei documenti. Sono ottimi per le corrispondenze esplicite, ma non tengono conto dei sinonimi e del contesto: "AI" e "intelligenza artificiale" non sarebbero correlate.</p></li>
<li><p>I<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>vettori densi</strong></a> (come quelli prodotti da BERT) catturano la semantica più profonda. Possono vedere che "Apple rilascia un nuovo telefono" è collegato a "lancio del prodotto iPhone", anche senza parole chiave condivise. Lo svantaggio è un costo computazionale più elevato e una minore interpretabilità.</p></li>
<li><p><strong>I modelli ibridi</strong> (come BGE-M3) combinano le due cose. Possono generare rappresentazioni rade, dense o multivettoriali contemporaneamente, preservando la precisione della ricerca per parole chiave e catturando al contempo le sfumature semantiche.</p></li>
</ul>
<p>In pratica, la scelta dipende dal caso d'uso: vettori sparsi per la velocità e la trasparenza, densi per un significato più ricco e ibridi quando si vuole il meglio di entrambi i mondi.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Otto fattori chiave per la valutazione dei modelli di incorporamento<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 Finestra di contesto</strong></h3><p>La <a href="https://zilliz.com/glossary/context-window"><strong>finestra di contesto</strong></a> determina la quantità di testo che un modello può elaborare contemporaneamente. Poiché un token corrisponde a circa 0,75 parole, questo numero limita direttamente la lunghezza del passaggio che il modello può "vedere" quando crea le incorporazioni. Una finestra ampia consente al modello di catturare l'intero significato di documenti più lunghi; una finestra piccola costringe a tagliare il testo in pezzi più piccoli, rischiando di perdere il contesto significativo.</p>
<p>Ad esempio, il <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>text-embedding-ada-002</em></a> di OpenAI supporta fino a 8.192 tokens, sufficienti a coprire un intero articolo di ricerca, compresi abstract, metodi e conclusioni. Al contrario, i modelli con finestre di soli 512 token (come <em>m3e-base</em>) richiedono frequenti troncamenti, che possono comportare la perdita di dettagli fondamentali.</p>
<p>Quindi, se il vostro caso d'uso prevede documenti lunghi, come documenti legali o accademici, scegliete un modello con una finestra di oltre 8K token. Per testi più brevi, come le chat dell'assistenza clienti, può essere sufficiente una finestra di token da 2K.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header"><strong>#2</strong> Unità di tokenizzazione</h3><p>Prima di generare le incorporazioni, il testo deve essere suddiviso in parti più piccole, chiamate <strong>token</strong>. Il modo in cui avviene la tokenizzazione influisce sulla capacità del modello di gestire parole rare, termini professionali e domini specializzati.</p>
<ul>
<li><p><strong>Tokenizzazione delle sottoparole (BPE):</strong> Divide le parole in parti più piccole (ad esempio, "infelicità" → "un" + "felicità"). È l'impostazione predefinita dei moderni LLM, come GPT e LLaMA, e funziona bene per le parole fuori vocabolario.</p></li>
<li><p><strong>WordPiece:</strong> Un perfezionamento di BPE usato da BERT, progettato per bilanciare meglio la copertura del vocabolario con l'efficienza.</p></li>
<li><p><strong>Tokenizzazione a livello di parola:</strong> Suddivide solo per parole intere. È semplice, ma ha difficoltà con la terminologia rara o complessa, il che la rende inadatta ai settori tecnici.</p></li>
</ul>
<p>Per domini specializzati come la medicina o la legge, i modelli basati su sottoparole sono generalmente i migliori: possono gestire correttamente termini come <em>infarto del miocardio</em> o <em>surrogazione</em>. Alcuni modelli moderni, come <strong>NV-Embed</strong>, si spingono oltre, aggiungendo miglioramenti come i livelli di attenzione latente, che migliorano il modo in cui la tokenizzazione cattura il vocabolario complesso e specifico del dominio.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 Dimensionalità</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>La dimensionalità del vettore</strong></a> si riferisce alla lunghezza del vettore di incorporazione, che determina la quantità di dettagli semantici che un modello può catturare. Dimensioni più elevate (ad esempio, 1.536 o più) consentono distinzioni più fini tra i concetti, ma comportano un aumento dello spazio di archiviazione, una maggiore lentezza delle query e requisiti di calcolo più elevati. Le dimensioni inferiori (come 768) sono più veloci ed economiche, ma rischiano di perdere il significato più sottile.</p>
<p>La chiave è l'equilibrio. Per la maggior parte delle applicazioni generiche, le dimensioni 768-1.536 rappresentano il giusto mix di efficienza e precisione. Per le attività che richiedono un'elevata precisione, come le ricerche accademiche o scientifiche, può essere utile andare oltre le 2.000 dimensioni. D'altra parte, i sistemi con risorse limitate (come le applicazioni edge) possono utilizzare efficacemente 512 dimensioni, a condizione che la qualità del recupero sia convalidata. In alcuni sistemi di raccomandazione o personalizzazione leggeri, possono essere sufficienti anche dimensioni inferiori.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 Dimensione del vocabolario</h3><p>La <strong>dimensione del vocabolario</strong> di un modello si riferisce al numero di token unici che il suo tokenizer può riconoscere. Ciò influisce direttamente sulla capacità di gestire lingue diverse e terminologia specifica del dominio. Se una parola o un carattere non è presente nel vocabolario, viene contrassegnata come <code translate="no">[UNK]</code>, il che può causare la perdita di significato.</p>
<p>I requisiti variano a seconda del caso d'uso. Gli scenari multilingue richiedono in genere vocabolari più ampi, dell'ordine di oltre 50k token, come nel caso di <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. Per le applicazioni specifiche di un dominio, la copertura dei termini specializzati è più importante. Ad esempio, un modello legale deve supportare in modo nativo termini come <em>&quot;prescrizione&quot; o</em> <em>&quot;acquisizione in buona fede</em>&quot;, mentre un modello cinese deve tenere conto di migliaia di caratteri e di una punteggiatura unica. Senza una copertura sufficiente del vocabolario, l'accuratezza dell'incorporazione si riduce rapidamente.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 Dati di addestramento</h3><p>I <strong>dati di addestramento</strong> definiscono i confini di ciò che un modello di embedding "conosce". I modelli addestrati su dati ampi e generici, come quello di <em>text-embedding-ada-002</em>, che utilizza un mix di pagine web, libri e Wikipedia, tendono a ottenere buone prestazioni in vari ambiti. Ma quando si ha bisogno di precisione in campi specializzati, i modelli addestrati per il dominio spesso vincono. Ad esempio, <em>LegalBERT</em> e <em>BioBERT</em> superano i modelli generali sui testi legali e biomedici, anche se perdono un po' di capacità di generalizzazione.</p>
<p>La regola empirica è che:</p>
<ul>
<li><p><strong>Scenari generali</strong> → utilizzare modelli addestrati su insiemi di dati ampi, ma assicurarsi che coprano la lingua o le lingue di destinazione. Ad esempio, le applicazioni in cinese necessitano di modelli addestrati su ricchi corpora cinesi.</p></li>
<li><p><strong>Domini verticali</strong> → scegliete modelli specifici per il dominio per ottenere la migliore accuratezza.</p></li>
<li><p><strong>Il meglio dei due mondi</strong> → i modelli più recenti come <strong>NV-Embed</strong>, addestrati in due fasi con dati generali e specifici del dominio, mostrano promettenti guadagni nella generalizzazione <em>e nella</em> precisione del dominio.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 Costo</h3><p>Il costo non riguarda solo il prezzo delle API, ma anche il <strong>costo economico</strong> e il <strong>costo computazionale</strong>. I modelli di API in hosting, come quelli di OpenAI, sono basati sull'uso: si paga per ogni chiamata, ma non ci si preoccupa dell'infrastruttura. Questo li rende perfetti per la prototipazione rapida, i progetti pilota o i carichi di lavoro di piccola e media entità.</p>
<p>Le opzioni open-source, come <em>BGE</em> o <em>Sentence-BERT</em>, sono gratuite ma richiedono un'infrastruttura autogestita, in genere cluster di GPU o TPU. Sono più adatte alla produzione su larga scala, dove i risparmi a lungo termine e la flessibilità compensano i costi di configurazione e manutenzione una tantum.</p>
<p>Il risultato pratico: <strong>I modelli API sono ideali per l'iterazione rapida</strong>, mentre <strong>i modelli open-source sono spesso vincenti nella produzione su larga scala</strong>, se si considera il costo totale di proprietà (TCO). La scelta della strada giusta dipende dall'esigenza di velocità di commercializzazione o di controllo a lungo termine.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 Punteggio MTEB</h3><p>Il <a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a> è lo standard più utilizzato per confrontare i modelli di embedding. Valuta le prestazioni in vari compiti, tra cui ricerca semantica, classificazione, clustering e altri. Un punteggio più alto significa generalmente che il modello ha una maggiore generalizzabilità tra diversi tipi di compiti.</p>
<p>Detto questo, l'MTEB non è una pallottola d'argento. Un modello che ottiene un punteggio complessivo elevato potrebbe comunque avere prestazioni inferiori nel vostro caso d'uso specifico. Ad esempio, un modello addestrato principalmente per l'inglese potrebbe ottenere buoni risultati nei benchmark MTEB, ma avere difficoltà con testi medici specialistici o dati non inglesi. L'approccio sicuro consiste nell'utilizzare MTEB come punto di partenza e nel convalidarlo con i <strong>propri set di dati</strong> prima di impegnarsi.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 Specificità del dominio</h3><p>Alcuni modelli sono stati costruiti appositamente per scenari specifici e sono in grado di funzionare laddove i modelli generali non sono all'altezza:</p>
<ul>
<li><p><strong>Legal:</strong> <em>LegalBERT</em> è in grado di distinguere termini legali a grana fine, come <em>difesa</em> e <em>giurisdizione</em>.</p></li>
<li><p><strong>Biomedico:</strong> <em>BioBERT</em> gestisce con precisione frasi tecniche come <em>mRNA</em> o <em>terapia mirata</em>.</p></li>
<li><p><strong>Multilingua:</strong> <em>BGE-M3</em> supporta oltre 100 lingue, il che lo rende adatto ad applicazioni globali che richiedono il collegamento tra inglese, cinese e altre lingue.</p></li>
<li><p><strong>Recupero del codice:</strong> <em>Qwen3-Embedding</em> raggiunge punteggi di alto livello (81,0+) su <em>MTEB-Code</em>, ottimizzato per le interrogazioni relative alla programmazione.</p></li>
</ul>
<p>Se il vostro caso d'uso rientra in uno di questi ambiti, i modelli ottimizzati per il dominio possono migliorare significativamente l'accuratezza del reperimento. Per applicazioni più ampie, invece, è consigliabile utilizzare modelli generici, a meno che i test non dimostrino il contrario.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Ulteriori prospettive per la valutazione degli embeddings<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre agli otto fattori principali, ci sono alcuni altri aspetti che vale la pena considerare se si desidera una valutazione più approfondita:</p>
<ul>
<li><p><strong>Allineamento multilingue</strong>: Per i modelli multilingue, non è sufficiente supportare molte lingue. Il vero test è se gli spazi vettoriali sono allineati. In altre parole, parole semanticamente identiche, come "gatto" in inglese e "gato" in spagnolo, sono vicine nello spazio vettoriale? Un forte allineamento garantisce un recupero coerente tra le lingue.</p></li>
<li><p><strong>Test avversariali</strong>: Un buon modello di embedding dovrebbe essere stabile anche in presenza di piccole modifiche dell'input. Inserendo frasi quasi identiche (ad esempio, "Il gatto si è seduto sul tappetino" contro "Il gatto si è seduto sul tappetino"), si può verificare se i vettori risultanti si spostano in modo ragionevole o fluttuano in modo selvaggio. Grandi oscillazioni spesso indicano una debole robustezza.</p></li>
<li><p>La<strong>coerenza semantica locale</strong> si riferisce al fenomeno di verificare se parole semanticamente simili si raggruppano strettamente in aree locali. Ad esempio, data una parola come "banca", il modello dovrebbe raggruppare in modo appropriato i termini correlati (come "riva del fiume" e "istituto finanziario"), mantenendo a distanza i termini non correlati. Misurare la frequenza con cui parole "invadenti" o irrilevanti si insinuano in questi quartieri aiuta a confrontare la qualità del modello.</p></li>
</ul>
<p>Queste prospettive non sono sempre necessarie per il lavoro quotidiano, ma sono utili per lo stress-testing degli embedding nei sistemi di produzione in cui contano molto la stabilità multilingue, l'alta precisione o l'avversità.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Modelli di embedding comuni: Una breve storia<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>La storia dei modelli di embedding è in realtà la storia di come le macchine hanno imparato a comprendere il linguaggio in modo più approfondito nel corso del tempo. Ogni generazione ha superato i limiti di quella precedente, passando da rappresentazioni statiche delle parole agli odierni embedding di modelli linguistici di grandi dimensioni (LLM) in grado di catturare contesti ricchi di sfumature.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: Il punto di partenza (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Word2Vec di Google</a> è stato il primo passo avanti che ha reso le incorporazioni ampiamente pratiche. Si basa sull'<em>ipotesi distributiva</em> della linguistica, ovvero sull'idea che le parole che appaiono in contesti simili spesso condividono il significato. Analizzando enormi quantità di testo, Word2Vec ha mappato le parole in uno spazio vettoriale in cui i termini correlati si trovano vicini. Per esempio, "puma" e "leopardo" si sono raggruppati vicini grazie ai loro habitat e alle loro caratteristiche di caccia comuni.</p>
<p>Word2Vec è disponibile in due versioni:</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words):</strong> predice una parola mancante dal contesto circostante.</p></li>
<li><p><strong>Skip-Gram:</strong> fa l'inverso, predicendo le parole circostanti da una parola target.</p></li>
</ul>
<p>Questo approccio semplice ma potente ha permesso di creare analogie eleganti come:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Per l'epoca, Word2Vec era rivoluzionario. Ma aveva due limiti significativi. In primo luogo, era <strong>statico</strong>: ogni parola aveva un solo vettore, quindi "banca" significava la stessa cosa sia che fosse vicino a "denaro" che a "fiume". In secondo luogo, funzionava solo a <strong>livello di parola</strong>, lasciando frasi e documenti fuori dalla sua portata.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT: la rivoluzione dei trasformatori (2018)</h3><p>Se Word2Vec ci ha fornito la prima mappa del significato, <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong></a> l'ha ridisegnata con un dettaglio molto maggiore. Rilasciato da Google nel 2018, BERT ha segnato l'inizio dell'era della <em>comprensione semantica profonda</em> introducendo l'architettura Transformer negli embeddings. A differenza dei precedenti LSTM, i Transformer possono esaminare tutte le parole di una sequenza contemporaneamente e in entrambe le direzioni, consentendo un contesto molto più ricco.</p>
<p>La magia di BERT deriva da due intelligenti operazioni di pre-addestramento:</p>
<ul>
<li><p><strong>Modellazione linguistica mascherata (MLM):</strong> Nasconde a caso le parole in una frase e costringe il modello a prevederle, insegnandogli a dedurre il significato dal contesto.</p></li>
<li><p><strong>Next Sentence Prediction (NSP):</strong> addestra il modello a decidere se due frasi si susseguono, aiutandolo a imparare le relazioni tra le frasi.</p></li>
</ul>
<p>Sotto il cofano, i vettori di input di BERT combinavano tre elementi: token embeddings (la parola stessa), segment embeddings (a quale frase appartiene) e position embeddings (dove si trova nella sequenza). Insieme, questi elementi hanno dato a BERT la capacità di catturare relazioni semantiche complesse sia a livello di <strong>frase</strong> che di <strong>documento</strong>. Questo salto ha reso BERT all'avanguardia per compiti come la risposta alle domande e la ricerca semantica.</p>
<p>Naturalmente, BERT non era perfetto. Le prime versioni erano limitate a una <strong>finestra di 512 token</strong>, il che significava che i documenti lunghi dovevano essere spezzettati e talvolta perdevano di significato. I suoi vettori densi mancavano anche di interpretabilità: si poteva vedere che due testi coincidevano, ma non sempre se ne spiegava il motivo. Le varianti successive, come <strong>RoBERTa</strong>, hanno abbandonato il compito NSP dopo che la ricerca ha dimostrato che aggiungeva pochi vantaggi, pur mantenendo il potente addestramento MLM.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: Fondere sparse e dense (2023)</h3><p>Nel 2023, il campo era maturato abbastanza da riconoscere che nessun singolo metodo di incorporazione era in grado di fare tutto. Nasce <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), un modello ibrido progettato esplicitamente per compiti di recupero. La sua innovazione chiave è che non produce un solo tipo di vettore: genera vettori densi, vettori radi e vettori multipli tutti insieme, combinando i loro punti di forza.</p>
<ul>
<li><p>I<strong>vettori densi</strong> catturano la semantica profonda, gestendo sinonimi e parafrasi (ad esempio, "lancio dell'iPhone", ≈ "Apple rilascia un nuovo telefono").</p></li>
<li><p><strong>I vettori sparsi</strong> assegnano pesi espliciti ai termini. Anche se una parola chiave non compare, il modello può dedurne la rilevanza, ad esempio collegando "iPhone nuovo prodotto" con "Apple Inc." e "smartphone".</p></li>
<li><p><strong>I multivettori</strong> affinano ulteriormente le incorporazioni dense, consentendo a ogni token di contribuire con il proprio punteggio di interazione, utile per il reperimento a grana fine.</p></li>
</ul>
<p>La pipeline di addestramento di BGE-M3 riflette questa sofisticazione:</p>
<ol>
<li><p><strong>Pre-training</strong> su dati massicci non etichettati con <em>RetroMAE</em> (codificatore mascherato + decodificatore di ricostruzione) per costruire una comprensione semantica generale.</p></li>
<li><p><strong>Messa a punto generale</strong> con l'apprendimento contrastivo su 100 milioni di coppie di testi, per affinare le prestazioni di recupero.</p></li>
<li><p><strong>Messa a punto del compito</strong> con la messa a punto delle istruzioni e il campionamento negativo complesso per l'ottimizzazione specifica dello scenario.</p></li>
</ol>
<p>I risultati sono impressionanti: BGE-M3 gestisce diverse granularità (dal livello di parola al livello di documento), offre ottime prestazioni multilingue, soprattutto in cinese, e bilancia l'accuratezza con l'efficienza meglio della maggior parte dei suoi concorrenti. In pratica, rappresenta un importante passo avanti nella costruzione di modelli di embedding potenti e pratici per il reperimento su larga scala.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">Gli LLM come modelli di incorporamento (2023-oggi)</h3><p>Per anni, l'opinione prevalente è stata che i modelli linguistici di grandi dimensioni (LLM) di sola decodifica, come GPT, non fossero adatti all'embedding. Si pensava che la loro attenzione causale - che guarda solo ai token precedenti - limitasse la comprensione semantica profonda. Ma recenti ricerche hanno ribaltato questo assunto. Con le giuste modifiche, gli LLM possono generare embeddings che rivaleggiano, e talvolta superano, i modelli costruiti ad hoc. Due esempi significativi sono LLM2Vec e NV-Embed.</p>
<p><strong>LLM2Vec</strong> adatta gli LLM di solo decodifica con tre modifiche chiave:</p>
<ul>
<li><p><strong>Conversione bidirezionale dell'attenzione</strong>: sostituzione delle maschere causali in modo che ogni token possa seguire l'intera sequenza.</p></li>
<li><p><strong>Masked next token prediction (MNTP):</strong> un nuovo obiettivo di allenamento che incoraggia la comprensione bidirezionale.</p></li>
<li><p><strong>Apprendimento contrastivo non supervisionato:</strong> ispirato a SimCSE, avvicina le frasi semanticamente simili nello spazio vettoriale.</p></li>
</ul>
<p><strong>NV-Embed</strong>, invece, adotta un approccio più snello:</p>
<ul>
<li><p><strong>Livelli di attenzione latente:</strong> aggiunge "matrici latenti" addestrabili per migliorare il raggruppamento delle sequenze.</p></li>
<li><p><strong>Addestramento diretto bidirezionale: è</strong> sufficiente rimuovere le maschere causali e perfezionare l'apprendimento contrastivo.</p></li>
<li><p><strong>Ottimizzazione del pooling medio:</strong> utilizza medie ponderate tra i token per evitare la "distorsione da ultimo token".</p></li>
</ul>
<p>Il risultato è che le moderne incorporazioni basate su LLM combinano la <strong>comprensione semantica profonda</strong> con la <strong>scalabilità</strong>. Sono in grado di gestire <strong>finestre di contesto molto lunghe (8K-32K token)</strong>, il che li rende particolarmente efficaci per le attività di ricerca, di diritto o di ricerca aziendale che richiedono molti documenti. Inoltre, poiché riutilizzano la stessa struttura portante di LLM, possono talvolta fornire embeddings di alta qualità anche in ambienti più limitati.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Conclusioni: Trasformare la teoria in pratica<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si tratta di scegliere un modello di embedding, la teoria porta solo fino a un certo punto. Il vero banco di prova è il rendimento del modello nel <em>vostro</em> sistema e con i <em>vostri</em> dati. Alcuni accorgimenti pratici possono fare la differenza tra un modello che sembra buono sulla carta e uno che funziona davvero in produzione:</p>
<ul>
<li><p><strong>Eseguire uno screening con i sottoinsiemi MTEB.</strong> Usare i benchmark, in particolare i compiti di recupero, per costruire una rosa iniziale di candidati.</p></li>
<li><p><strong>Testate con dati aziendali reali.</strong> Creare set di valutazione a partire dai propri documenti per misurare richiamo, precisione e latenza in condizioni reali.</p></li>
<li><p><strong>Verificare la compatibilità con il database.</strong> I vettori sparsi richiedono il supporto di indici invertiti, mentre i vettori densi ad alta dimensione richiedono più spazio di archiviazione e calcolo. Assicuratevi che il vostro database vettoriale sia in grado di soddisfare la vostra scelta.</p></li>
<li><p><strong>Gestite in modo intelligente i documenti lunghi.</strong> Utilizzate strategie di segmentazione, come le finestre scorrevoli, per ottenere maggiore efficienza e abbinatele a modelli di finestre contestuali di grandi dimensioni per preservare il significato.</p></li>
</ul>
<p>Dai semplici vettori statici di Word2Vec agli embeddings alimentati da LLM con 32K contesti, abbiamo assistito a enormi passi avanti nel modo in cui le macchine comprendono il linguaggio. Ma ecco la lezione che ogni sviluppatore impara: il modello <em>con il punteggio più alto</em> non è sempre il modello <em>migliore</em> per il caso d'uso.</p>
<p>In fin dei conti, agli utenti non interessano le classifiche MTEB o i grafici di benchmark: vogliono solo trovare le informazioni giuste, velocemente. Scegliete il modello che bilancia precisione, costo e compatibilità con il vostro sistema e avrete costruito qualcosa che non impressiona solo in teoria, ma funziona davvero nel mondo reale.</p>
