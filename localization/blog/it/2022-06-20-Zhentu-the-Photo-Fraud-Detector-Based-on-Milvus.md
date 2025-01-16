---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - il rilevatore di frodi fotografiche basato su Milvus
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  Come è costruito il sistema di rilevamento di Zhentu con Milvus come motore di
  ricerca vettoriale?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da Yan Shi e Minwei Tang, ingegneri senior degli algoritmi di BestPay, e tradotto da <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>Negli ultimi anni, con il diffondersi dell'e-commerce e delle transazioni online in tutto il mondo, sono fiorite anche le frodi nell'e-commerce. Utilizzando foto generate al computer invece di quelle reali per superare la verifica dell'identità sulle piattaforme commerciali online, i truffatori creano enormi account falsi e approfittano delle offerte speciali delle aziende (ad esempio, regali di iscrizione, coupon, token), con perdite irrecuperabili sia per i consumatori che per le aziende.</p>
<p>I metodi tradizionali di controllo del rischio non sono più efficaci di fronte a un'ingente quantità di dati. Per risolvere il problema, <a href="https://www.bestpay.com.cn">BestPay</a> ha creato un rilevatore di frodi fotografiche, Zhentu (che in cinese significa rilevamento di immagini), basato sulle tecnologie di deep learning (DL) e di elaborazione digitale delle immagini (DIP). Zhentu è applicabile a diversi scenari che prevedono il riconoscimento delle immagini, tra cui l'identificazione di licenze commerciali false. Se la foto della licenza commerciale inviata da un utente è molto simile a un'altra foto già presente nella libreria fotografica di una piattaforma, è probabile che l'utente abbia rubato la foto da qualche parte o abbia falsificato la licenza per scopi fraudolenti.</p>
<p>Gli algoritmi tradizionali per misurare la somiglianza delle immagini, come <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> e ORB, sono lenti e imprecisi, applicabili solo a compiti offline. L'apprendimento profondo, invece, è in grado di elaborare dati di immagini su larga scala in tempo reale ed è il metodo definitivo per abbinare immagini simili. Grazie agli sforzi congiunti del team di ricerca e sviluppo di BestPay e della <a href="https://milvus.io/">comunità Milvus</a>, è stato sviluppato un sistema di rilevamento delle frodi fotografiche come parte di Zhentu. Il sistema funziona convertendo enormi quantità di dati di immagini in vettori di caratteristiche attraverso modelli di deep learning e inserendoli in <a href="https://milvus.io/">Milvus</a>, un motore di ricerca vettoriale. Con Milvus, il sistema di rilevamento è in grado di indicizzare trilioni di vettori e di recuperare in modo efficiente foto simili tra decine di milioni di immagini.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Panoramica di Zhentu</a></li>
<li><a href="#system-structure">Struttura del sistema</a></li>
<li><a href="#deployment"><strong>Distribuzione</strong></a></li>
<li><a href="#real-world-performance"><strong>Prestazioni nel mondo reale</strong></a></li>
<li><a href="#reference"><strong>Riferimento</strong></a></li>
<li><a href="#about-bestpay"><strong>Informazioni su BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Una panoramica di Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu è il prodotto di controllo del rischio visivo multimediale autoprogettato da BestPay e profondamente integrato con tecnologie di apprendimento automatico (ML) e di riconoscimento delle immagini su rete neurale. Il suo algoritmo integrato è in grado di identificare con precisione i truffatori durante l'autenticazione degli utenti e di rispondere a livello di millisecondi. Grazie alla sua tecnologia leader nel settore e alla sua soluzione innovativa, Zhentu ha ottenuto cinque brevetti e due copyright software. Attualmente viene utilizzato da numerose banche e istituzioni finanziarie per aiutare a identificare in anticipo i potenziali rischi.</p>
<h2 id="System-structure" class="common-anchor-header">Struttura del sistema<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay dispone attualmente di oltre 10 milioni di foto di licenze commerciali e il volume effettivo continua a crescere in modo esponenziale con la crescita dell'attività. Per recuperare rapidamente foto simili da un database così ampio, Zhentu ha scelto Milvus come motore di calcolo della similarità dei vettori di caratteristiche. La struttura generale del sistema di rilevamento delle frodi fotografiche è illustrata nel diagramma seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>La procedura può essere suddivisa in quattro fasi:</p>
<ol>
<li><p>Pre-elaborazione dell'immagine. La pre-elaborazione, che comprende la riduzione del rumore, la rimozione del disturbo e il miglioramento del contrasto, garantisce l'integrità delle informazioni originali e la rimozione delle informazioni inutili dal segnale dell'immagine.</p></li>
<li><p>Estrazione del vettore di caratteristiche. Un modello di deep learning appositamente addestrato viene utilizzato per estrarre i vettori di caratteristiche dell'immagine. La conversione delle immagini in vettori per un'ulteriore ricerca di somiglianza è un'operazione di routine.</p></li>
<li><p>Normalizzazione. La normalizzazione dei vettori di caratteristiche estratti aiuta a migliorare l'efficienza dell'elaborazione successiva.</p></li>
<li><p>Ricerca vettoriale con Milvus. Inserimento dei vettori di caratteristiche normalizzati nel database Milvus per la ricerca di similarità vettoriale.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Distribuzione</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco una breve descrizione di come viene implementato il sistema di rilevamento delle frodi fotografiche di Zhentu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura del sistema Milvus</span> </span></p>
<p>Abbiamo implementato il nostro <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">cluster Milvus su Kubernetes</a> per garantire l'alta disponibilità e la sincronizzazione in tempo reale dei servizi cloud. I passi generali sono i seguenti:</p>
<ol>
<li><p>Visualizzare le risorse disponibili. Eseguire il comando <code translate="no">kubectl describe nodes</code> per vedere le risorse che il cluster Kubernetes può allocare ai casi creati.</p></li>
<li><p>Allocare le risorse. Eseguire il comando <code translate="no">kubect`` -- apply xxx.yaml</code> per allocare le risorse di memoria e CPU per i componenti del cluster Milvus utilizzando Helm.</p></li>
<li><p>Applicare la nuova configurazione. Eseguire il comando <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Applicare la nuova configurazione al cluster Milvus. Il cluster distribuito in questo modo non solo ci permette di regolare la capacità del sistema in base alle diverse esigenze aziendali, ma soddisfa anche meglio i requisiti di alte prestazioni per il recupero massiccio di dati vettoriali.</p></li>
</ol>
<p>È possibile <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">configurare Milvus</a> per ottimizzare le prestazioni di ricerca per diversi tipi di dati provenienti da diversi scenari aziendali, come mostrato nei due esempi seguenti.</p>
<p>Nella <a href="https://milvus.io/docs/v2.0.x/build_index.md">costruzione dell'indice vettoriale</a>, si parametrizza l'indice in base allo scenario reale del sistema come segue:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> esegue il clustering dell'indice IVF prima di quantizzare il prodotto dei vettori. È caratterizzato da un'alta velocità di interrogazione del disco e da un consumo di memoria molto basso, che soddisfa le esigenze dell'applicazione reale di Zhentu.</p>
<p>Inoltre, abbiamo impostato i parametri di ricerca ottimali come segue:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Poiché i vettori sono già normalizzati prima di essere inseriti in Milvus, si sceglie il prodotto interno (IP) per calcolare la distanza tra due vettori. Gli esperimenti hanno dimostrato che il tasso di richiamo aumenta di circa il 15% utilizzando l'IP rispetto alla distanza euclidea (L2).</p>
<p>Gli esempi sopra riportati dimostrano che è possibile testare e impostare i parametri di Milvus in base ai diversi scenari aziendali e ai requisiti di prestazione.</p>
<p>Inoltre, Milvus non solo integra diverse librerie di indici, ma supporta anche diversi tipi di indici e metodi di calcolo della similarità. Milvus fornisce anche SDK ufficiali in diverse lingue e ricche API per l'inserimento, l'interrogazione e così via, consentendo ai nostri gruppi aziendali front-end di utilizzare gli SDK per chiamare il centro di controllo dei rischi.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Prestazioni nel mondo reale</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Finora il sistema di rilevamento delle frodi fotografiche ha funzionato costantemente, aiutando le aziende a identificare i potenziali truffatori. Nel 2021, ha rilevato oltre 20.000 patenti false nel corso dell'anno. In termini di velocità di interrogazione, un'interrogazione di un singolo vettore tra decine di milioni di vettori richiede meno di 1 secondo e il tempo medio di interrogazione in batch è inferiore a 0,08 secondi. La ricerca ad alte prestazioni di Milvus soddisfa le esigenze delle aziende sia in termini di accuratezza che di concomitanza.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Riferimento</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>Informazioni su BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co., Ltd è una società interamente controllata da China Telecom. Gestisce le attività di pagamento e finanza. BestPay si impegna a utilizzare tecnologie all'avanguardia come i big data, l'intelligenza artificiale e il cloud computing per potenziare l'innovazione aziendale, fornendo prodotti intelligenti, soluzioni di controllo del rischio e altri servizi. Fino a gennaio 2016, l'applicazione BestPay ha attirato oltre 200 milioni di utenti ed è diventata il terzo operatore di piattaforme di pagamento in Cina, dopo Alipay e WeChat Payment.</p>
