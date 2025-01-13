---
id: audio-retrieval-based-on-milvus.md
title: Tecnologie di elaborazione
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  Il recupero audio con Milvus consente di classificare e analizzare i dati
  audio in tempo reale.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Recupero dell'audio basato su Milvus</custom-h1><p>Il suono è un tipo di dati denso di informazioni. Anche se può sembrare antiquato nell'era dei contenuti video, l'audio rimane una fonte di informazione primaria per molte persone. Nonostante il lungo declino degli ascoltatori, nel 2020 l'83% degli americani di età pari o superiore ai 12 anni ha ascoltato la radio terrestre (AM/FM) in una determinata settimana (in calo rispetto all'89% del 2019). Al contrario, l'audio online ha registrato un aumento costante degli ascoltatori negli ultimi due decenni, con il 62% degli americani che ha dichiarato di ascoltarne una qualche forma su base settimanale, secondo lo stesso <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">studio del Pew Research Center</a>.</p>
<p>Come onda, il suono comprende quattro proprietà: frequenza, ampiezza, forma d'onda e durata. Nella terminologia musicale, queste proprietà sono chiamate altezza, dinamica, tono e durata. I suoni aiutano anche gli esseri umani e gli altri animali a percepire e comprendere l'ambiente circostante, fornendo indizi di contesto per la posizione e il movimento degli oggetti nell'ambiente circostante.</p>
<p>Come vettore di informazioni, l'audio può essere classificato in tre categorie:</p>
<ol>
<li><strong>Parlato:</strong> Un mezzo di comunicazione composto da parole e grammatica. Con gli algoritmi di riconoscimento vocale, il parlato può essere convertito in testo.</li>
<li><strong>Musica:</strong> Suoni vocali e/o strumentali combinati per produrre una composizione composta da melodia, armonia, ritmo e timbro. La musica può essere rappresentata da una partitura.</li>
<li><strong>Forma d'onda:</strong> Un segnale audio digitale ottenuto dalla digitalizzazione di suoni analogici. Le forme d'onda possono rappresentare il parlato, la musica e i suoni naturali o sintetizzati.</li>
</ol>
<p>L'audio retrieval può essere utilizzato per cercare e monitorare i media online in tempo reale per reprimere le violazioni dei diritti di proprietà intellettuale. Assume inoltre un ruolo importante nella classificazione e nell'analisi statistica dei dati audio.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Tecnologie di elaborazione<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Il parlato, la musica e altri suoni generici hanno caratteristiche uniche e richiedono metodi di elaborazione diversi. In genere, l'audio viene separato in gruppi che contengono il parlato e gruppi che non lo contengono:</p>
<ul>
<li>L'audio parlato viene elaborato dal riconoscimento vocale automatico.</li>
<li>L'audio non vocale, compreso l'audio musicale, gli effetti sonori e i segnali vocali digitalizzati, viene elaborato con sistemi di recupero audio.</li>
</ul>
<p>Questo articolo si concentra su come utilizzare un sistema di recupero audio per elaborare dati audio non vocali. Il riconoscimento del parlato non è trattato in questo articolo</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Estrazione delle caratteristiche audio</h3><p>L'estrazione delle caratteristiche è la tecnologia più importante nei sistemi di recupero audio, in quanto consente la ricerca di similarità audio. I metodi di estrazione delle caratteristiche audio si dividono in due categorie:</p>
<ul>
<li>Modelli tradizionali di estrazione delle caratteristiche audio, come i modelli a miscela gaussiana (GMM) e i modelli di Markov nascosti (HMM);</li>
<li>modelli di estrazione di caratteristiche audio basati sull'apprendimento profondo, come le reti neurali ricorrenti (RNN), le reti di memoria a breve termine (LSTM), le strutture di codifica-decodifica, i meccanismi di attenzione, ecc.</li>
</ul>
<p>I modelli basati sull'apprendimento profondo hanno un tasso di errore inferiore di un ordine di grandezza rispetto ai modelli tradizionali e pertanto stanno guadagnando terreno come tecnologia di base nel campo dell'elaborazione dei segnali audio.</p>
<p>I dati audio sono solitamente rappresentati dalle caratteristiche audio estratte. Il processo di recupero cerca e confronta queste caratteristiche e attributi piuttosto che i dati audio stessi. Pertanto, l'efficacia del recupero di similarità audio dipende in larga misura dalla qualità dell'estrazione delle caratteristiche.</p>
<p>In questo articolo, per estrarre i vettori di caratteristiche vengono utilizzate <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">reti neurali audio pre-addestrate su larga scala per il riconoscimento di pattern audio (PANN</a> ), con un'accuratezza media (mAP) di 0,439 (Hershey et al., 2017).</p>
<p>Dopo aver estratto i vettori di caratteristiche dei dati audio, possiamo implementare l'analisi dei vettori di caratteristiche ad alte prestazioni utilizzando Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Ricerca di similarità vettoriale</h3><p><a href="https://milvus.io/">Milvus</a> è un database vettoriale cloud-nativo e open-source costruito per gestire vettori di incorporazione generati da modelli di apprendimento automatico e reti neurali. È ampiamente utilizzato in scenari quali la computer vision, l'elaborazione del linguaggio naturale, la chimica computazionale, i sistemi di raccomandazione personalizzati e altro ancora.</p>
<p>Il diagramma seguente illustra il processo generale di ricerca della somiglianza utilizzando Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>I dati non strutturati vengono convertiti in vettori di caratteristiche dai modelli di deep learning e inseriti in Milvus.</li>
<li>Milvus memorizza e indicizza questi vettori di caratteristiche.</li>
<li>Su richiesta, Milvus cerca e restituisce i vettori più simili al vettore interrogato.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di recupero audio è composto principalmente da due parti: inserimento (linea nera) e ricerca (linea rossa).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>sistema di recupero audio.png</span> </span></p>
<p>Il set di dati di esempio utilizzato in questo progetto contiene suoni di giochi open-source e il codice è dettagliato nel <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">bootcamp di Milvus</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Passo 1: inserire i dati</h3><p>Di seguito è riportato il codice di esempio per generare embeddings audio con il modello di inferenza PANNs pre-addestrato e inserirli in Milvus, che assegna un ID univoco a ogni embedding vettoriale.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Gli <strong>ids_milvus</strong> restituiti vengono memorizzati insieme ad altre informazioni rilevanti (ad esempio, il <strong>nome del file wav</strong>) per i dati audio in un database MySQL per la successiva elaborazione.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Fase 2: Ricerca audio</h3><p>Milvus calcola la distanza del prodotto interno tra i vettori di caratteristiche pre-memorizzati e i vettori di caratteristiche in ingresso, estratti dai dati audio della query utilizzando il modello di inferenza PANNs, e restituisce gli <strong>ids_milvus</strong> dei vettori di caratteristiche simili, che corrispondono ai dati audio ricercati.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Riferimento API e demo<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Questo sistema di recupero audio è costruito con codice open-source. Le sue caratteristiche principali sono l'inserimento e la cancellazione di dati audio. Tutte le API possono essere visualizzate digitando <strong>127.0.0.1:<port></strong> /docs nel browser.</p>
<h3 id="Demo" class="common-anchor-header">Demo</h3><p>Abbiamo una <a href="https://zilliz.com/solutions">demo live</a> del sistema di ricerca audio basato su Milvus, che può essere provata con i propri dati audio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Vivendo nell'era dei big data, le persone trovano la loro vita piena di informazioni di ogni tipo. Per dare un senso migliore a queste informazioni, il tradizionale reperimento di testi non è più sufficiente. Oggi la tecnologia di recupero delle informazioni ha urgente bisogno di recuperare vari tipi di dati non strutturati, come video, immagini e audio.</p>
<p>I dati non strutturati, difficili da elaborare per i computer, possono essere convertiti in vettori di caratteristiche utilizzando modelli di deep learning. Questi dati convertiti possono essere facilmente elaborati dalle macchine, consentendoci di analizzare i dati non strutturati come i nostri predecessori non erano in grado di fare. Milvus, un database vettoriale open source, è in grado di elaborare in modo efficiente i vettori di caratteristiche estratti dai modelli di intelligenza artificiale e fornisce una serie di calcoli comuni di somiglianza vettoriale.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. e Slaney, M., 2017, marzo. Architetture CNN per la classificazione audio su larga scala. In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp. 131-135, 2017.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Non essere un estraneo<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Trova o contribuisci a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Interagite con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Connettetevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
