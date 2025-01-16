---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Perché scegliere FastAPI rispetto a Flask?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: scegliere il framework appropriato in base allo scenario applicativo
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Per aiutarvi a iniziare rapidamente a utilizzare Milvus, il database vettoriale open-source, abbiamo rilasciato un altro progetto open-source affiliato, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> su GitHub. Il Milvus Bootcamp non solo fornisce script e dati per i test di benchmark, ma include anche progetti che utilizzano Milvus per costruire alcuni MVP (minimum viable product), come un sistema di ricerca inversa di immagini, un sistema di analisi video, un chatbot QA o un sistema di raccomandazione. Nel Milvus Bootcamp potrete imparare ad applicare la ricerca per similarità vettoriale in un mondo pieno di dati non strutturati e fare un po' di esperienza pratica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Forniamo servizi sia di front-end che di back-end per i progetti del Milvus Bootcamp. Tuttavia, di recente abbiamo deciso di cambiare il framework web adottato, passando da Flask a FastAPI.</p>
<p>Questo articolo intende spiegare le motivazioni che ci hanno spinto a cambiare il framework web adottato per Milvus Bootcamp, chiarendo perché abbiamo preferito FastAPI a Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Framework web per Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Un framework web si riferisce a un insieme di pacchetti o moduli. Si tratta di un insieme di architetture software per lo sviluppo web che consentono di scrivere applicazioni o servizi web, evitando di gestire dettagli di basso livello come protocolli, socket o gestione di processi/thread. L'uso di framework web può ridurre significativamente il carico di lavoro dello sviluppo di applicazioni web, in quanto è sufficiente "inserire" il codice nel framework, senza dover prestare ulteriore attenzione alla cache dei dati, all'accesso al database e alla verifica della sicurezza dei dati. Per maggiori informazioni su cosa sia un framework web per Python, vedere <a href="https://wiki.python.org/moin/WebFrameworks">Framework web</a>.</p>
<p>Esistono vari tipi di framework web per Python. Quelli più diffusi sono Django, Flask, Tornado e FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> è un microframework leggero progettato per Python, con un nucleo semplice e facile da usare che consente di sviluppare le proprie applicazioni web. Inoltre, il nucleo di Flask è anche estensibile. Pertanto, Flask supporta l'estensione on-demand di diverse funzioni per soddisfare le vostre esigenze personalizzate durante lo sviluppo di applicazioni web. In altre parole, con una libreria di vari plug-in in Flask, è possibile sviluppare siti web potenti.</p>
<p>Flask ha le seguenti caratteristiche:</p>
<ol>
<li>Flask è un microframework che non si affida ad altri strumenti specifici o a componenti di librerie di terze parti per fornire funzionalità condivise. Flask non ha un livello di astrazione del database e non richiede la validazione dei moduli. Tuttavia, Flask è altamente estensibile e supporta l'aggiunta di funzionalità applicative in modo simile alle implementazioni all'interno di Flask stesso. Le estensioni rilevanti includono i mapper relazionali a oggetti, la validazione dei moduli, l'elaborazione degli upload, le tecnologie di autenticazione aperte e alcuni strumenti comuni progettati per i framework web.</li>
<li>Flask è un framework per applicazioni web basato su <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). WSGI è una semplice interfaccia che collega un server web con un'applicazione web o un framework definito per il linguaggio Python.</li>
<li>Flask include due librerie di funzioni fondamentali, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> e <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug è un toolkit WSGI che implementa oggetti di richiesta e risposta e funzioni pratiche, che consentono di costruire framework web su di esso. Jinja2 è un popolare motore di template completo per Python. Ha un supporto completo per Unicode e un ambiente di esecuzione sandbox integrato, opzionale ma ampiamente adottato.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> è un moderno framework per applicazioni web in Python che offre lo stesso livello di prestazioni elevate di Go e NodeJS. Il nucleo di FastAPI è basato su <a href="https://www.starlette.io/">Starlette</a> e <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette è un framework leggero <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) per la creazione di servizi <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> ad alte prestazioni. Pydantic è una libreria che definisce la convalida dei dati, la serializzazione e la documentazione basandosi sui suggerimenti di tipo Python.</p>
<p>FastAPI ha le seguenti caratteristiche:</p>
<ol>
<li>FastAPI è un framework per applicazioni web basato su ASGI, un'interfaccia di protocollo gateway asincrona che collega servizi di protocollo di rete e applicazioni Python. FastAPI è in grado di gestire diversi tipi di protocollo comuni, tra cui HTTP, HTTP2 e WebSocket.</li>
<li>FastAPI si basa su Pydantic, che fornisce la funzione di verifica del tipo di dati dell'interfaccia. Non è necessario verificare ulteriormente i parametri dell'interfaccia o scrivere codice aggiuntivo per verificare se i parametri sono vuoti o se il tipo di dati è corretto. L'utilizzo di FastAPI consente di evitare efficacemente gli errori umani nel codice e di migliorare l'efficienza dello sviluppo.</li>
<li>FastAPI supporta documenti in due formati: <a href="https://swagger.io/specification/">OpenAPI</a> (ex Swagger) e <a href="https://www.redoc.com/">Redoc</a>. Pertanto, l'utente non deve perdere tempo a scrivere documenti di interfaccia aggiuntivi. Il documento OpenAPI fornito da FastAPI è mostrato nella schermata seguente.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask contro FastAPI</h3><p>La tabella seguente mostra le differenze tra Flask e FastAPI sotto diversi aspetti.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Interfaccia gateway</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Struttura asincrona</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Prestazioni</strong></td><td>Più veloce</td><td>Più lento</td></tr>
<tr><td><strong>Documenti interattivi</strong></td><td>OpenAPI, Redoc</td><td>Nessuno</td></tr>
<tr><td><strong>Verifica dei dati</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Costi di sviluppo</strong></td><td>Più bassi</td><td>Più alti</td></tr>
<tr><td><strong>Facilità d'uso</strong></td><td>Più basso</td><td>Superiore</td></tr>
<tr><td><strong>Flessibilità</strong></td><td>Meno flessibile</td><td>Più flessibile</td></tr>
<tr><td><strong>Comunità</strong></td><td>Più piccola</td><td>Più attiva</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Perché FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di decidere quale framework Python per applicazioni web scegliere per i progetti del Milvus Bootcamp, abbiamo fatto una ricerca su diversi framework mainstream, tra cui Django, Flask, FastAPI, Tornado e altri. Poiché i progetti di Milvus Bootcamp servono da riferimento per voi, la nostra priorità è adottare un framework esterno di massima leggerezza e destrezza. In base a questa regola, abbiamo ristretto le nostre scelte a Flask e FastAPI.</p>
<p>Potete vedere il confronto tra i due framework web nella sezione precedente. Di seguito viene spiegata nel dettaglio la motivazione che ci ha spinto a scegliere FastAPI rispetto a Flask per i progetti di Milvus Bootcamp. Le ragioni sono molteplici:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Prestazioni</h3><p>La maggior parte dei progetti di Milvus Bootcamp sono costruiti intorno a sistemi di ricerca inversa di immagini, chatbot QA, motori di ricerca di testi, che hanno tutti elevate esigenze di elaborazione dei dati in tempo reale. Di conseguenza, abbiamo bisogno di un framework con prestazioni eccezionali, che è esattamente il punto forte di FastAPI. Pertanto, dal punto di vista delle prestazioni del sistema, abbiamo deciso di scegliere FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Efficienza</h3><p>Quando si utilizza Flask, è necessario scrivere codice per la verifica del tipo di dati in ciascuna interfaccia, in modo che il sistema possa determinare se i dati in ingresso sono vuoti o meno. Tuttavia, supportando la verifica automatica del tipo di dati, FastAPI aiuta a evitare errori umani nella codifica durante lo sviluppo del sistema e può aumentare notevolmente l'efficienza dello sviluppo. Il Bootcamp è un tipo di risorsa di formazione. Ciò significa che il codice e i componenti che utilizziamo devono essere intuitivi e altamente efficienti. A questo proposito, abbiamo scelto FastAPI per migliorare l'efficienza del sistema e l'esperienza dell'utente.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Struttura asincrona</h3><p>FastAPI è intrinsecamente un framework asincrono. Inizialmente, abbiamo rilasciato quattro <a href="https://zilliz.com/milvus-demos?isZilliz=true">demo</a>, la ricerca inversa di immagini, l'analisi video, il chatbot QA e la ricerca di somiglianze molecolari. In queste demo, è possibile caricare i set di dati e viene immediatamente visualizzato il messaggio &quot;richiesta ricevuta&quot;. Quando i dati vengono caricati nel sistema della demo, viene visualizzato un altro messaggio &quot;caricamento dei dati riuscito&quot;. Si tratta di un processo asincrono che richiede un framework che supporti questa funzione. FastAPI è un framework asincrono. Per allineare tutte le risorse di Milvus, abbiamo deciso di adottare un unico set di strumenti di sviluppo e software sia per il Milvus Bootcamp che per le demo di Milvus. Di conseguenza, abbiamo cambiato il framework da Flask a FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Documenti interattivi automatici</h3><p>In modo tradizionale, quando si finisce di scrivere il codice per il lato server, è necessario scrivere un documento aggiuntivo per creare un'interfaccia e poi utilizzare strumenti come <a href="https://www.postman.com/">Postman</a> per il test e il debug delle API. E se si volesse solo iniziare rapidamente la parte di sviluppo del lato server dei progetti in Milvus Bootcamp senza scrivere codice aggiuntivo per creare un'interfaccia? FastAPI è la soluzione. Fornendo un documento OpenAPI, FastAPI vi risparmia la fatica di testare o eseguire il debug delle API e di collaborare con i team di front-end per sviluppare un'interfaccia utente. Con FastAPI, è possibile provare rapidamente l'applicazione creata con un'interfaccia automatica ma intuitiva, senza ulteriori sforzi di codifica.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Facilità d'uso</h3><p>FastAPI è più facile da usare e da sviluppare, consentendo così di prestare maggiore attenzione all'implementazione specifica del progetto stesso. Senza dedicare troppo tempo allo sviluppo di framework web, ci si può concentrare maggiormente sulla comprensione dei progetti di Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Riconoscimento<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask e FlastAPI hanno i loro pro e contro. FlastAPI è un framework emergente per applicazioni web, mentre FlastAPI, nella sua essenza, si basa su toolkit e librerie mature, Starlette e Pydantic. FastAPI è un framework asincrono ad alte prestazioni. La sua destrezza, l'estensibilità e il supporto per la verifica automatica del tipo di dati, insieme a molte altre potenti caratteristiche, ci hanno spinto ad adottare FastAPI come framework per i progetti Milvus Bootcamp.</p>
<p>Si noti che è necessario scegliere il framework appropriato in base al proprio scenario applicativo se si vuole costruire un sistema di ricerca per similarità vettoriale in produzione.</p>
<h2 id="About-the-author" class="common-anchor-header">L'autore<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Data Engineer di Zilliz, si è laureata in informatica presso la Huazhong University of Science and Technology. Da quando è entrata a far parte di Zilliz, ha lavorato all'esplorazione di soluzioni per il progetto open source Milvus e ha aiutato gli utenti ad applicare Milvus in scenari reali. La sua attenzione principale è rivolta all'NLP e ai sistemi di raccomandazione e vorrebbe approfondire ulteriormente queste due aree. Le piace passare il tempo da sola e leggere.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Cercate altre risorse?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Iniziate a costruire sistemi di intelligenza artificiale con Milvus e fate più esperienza pratica leggendo i nostri tutorial!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">Che cos'è? Chi è? Milvus aiuta ad analizzare i video in modo intelligente</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinare modelli di intelligenza artificiale per la ricerca di immagini con ONNX e Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classificazione delle sequenze di DNA basata su Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recupero dell'audio basato su Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 passi per costruire un sistema di ricerca video</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Creare un sistema di QA intelligente con NLP e Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accelerare la scoperta di nuovi farmaci</a></li>
</ul></li>
<li><p>Impegnatevi con la nostra comunità open-source:</p>
<ul>
<li>Trovate o contribuite a Milvus su <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interagite con la comunità tramite il <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connettetevi con noi su <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
