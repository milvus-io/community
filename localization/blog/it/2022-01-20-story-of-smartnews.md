---
id: 2022-01-20-story-of-smartnews.md
title: 'La storia di SmartNews: da utente Milvus a collaboratore attivo'
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: 'Scoprite la storia di SmartNews, utente e collaboratore di Milvus.'
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Questo articolo è stato tradotto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
<p>Le informazioni sono ovunque nella nostra vita. Meta (precedentemente noto come Facebook), Instagram, Twitter e altre piattaforme di social media rendono i flussi di informazioni ancora più onnipresenti. Pertanto, i motori che gestiscono tali flussi di informazioni sono diventati un must nella maggior parte delle architetture di sistema. Tuttavia, in qualità di utenti delle piattaforme di social media e delle relative app, scommetto che sarete stati infastiditi da articoli, notizie, meme e altro ancora duplicati. L'esposizione a contenuti duplicati ostacola il processo di recupero delle informazioni e porta a una cattiva esperienza dell'utente.</p>
<p>Per un prodotto che si occupa di flussi di informazioni, è una priorità assoluta per gli sviluppatori trovare un processore di dati flessibile che possa essere integrato perfettamente nell'architettura del sistema per deduplicare notizie o pubblicità identiche.</p>
<p><a href="https://www.smartnews.com/en/">SmartNews</a>, valutata <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2 miliardi di dollari</a>, è l'azienda di app di notizie più quotata degli Stati Uniti. In passato era un utente di Milvus, un database vettoriale open-source, ma in seguito si è trasformata in un collaboratore attivo del progetto Milvus.</p>
<p>Questo articolo racconta la storia di SmartNews e spiega perché ha deciso di contribuire al progetto Milvus.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Una panoramica di SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews, fondata nel 2012, ha sede a Tokyo, in Giappone. L'app di notizie sviluppata da SmartNews è sempre stata <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">ai primi posti</a> nel mercato giapponese. SmartNews è l'app di notizie <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">in più rapida crescita</a> e vanta anche <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">un'elevata viscosità di utenti</a> nel mercato statunitense. Secondo le statistiche di <a href="https://www.appannie.com/en/">APP Annie</a>, alla fine di luglio 2021 la durata media mensile delle sessioni di SmartNews era al primo posto tra tutte le app di notizie, superiore alla durata cumulativa delle sessioni di AppleNews e Google News.</p>
<p>Con la rapida crescita della base di utenti e della viscosità, SmartNews deve affrontare ulteriori sfide in termini di meccanismo di raccomandazione e algoritmo di intelligenza artificiale. Tali sfide includono l'utilizzo di enormi caratteristiche discrete nell'apprendimento automatico (ML) su larga scala, l'accelerazione della ricerca di dati non strutturati con la ricerca di similarità vettoriale e altro ancora.</p>
<p>All'inizio del 2021, il team dell'algoritmo di dynamic Ad di SmartNews ha chiesto al team dell'infrastruttura AI di ottimizzare le funzioni di richiamo e interrogazione degli annunci pubblicitari. Dopo due mesi di ricerche, l'ingegnere dell'infrastruttura AI Shu ha deciso di utilizzare Milvus, un database vettoriale open-source che supporta indici multipli e metriche di somiglianza e aggiornamenti online dei dati. Milvus è apprezzato da più di mille organizzazioni in tutto il mondo.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Raccomandazione pubblicitaria basata sulla ricerca di similarità vettoriale<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Il database vettoriale open-source Milvus è adottato nel sistema SmartNews Ad per abbinare e raccomandare agli utenti annunci dinamici provenienti da un set di dati su scala di 10 milioni. In questo modo, SmartNews è in grado di creare una relazione di mappatura tra due insiemi di dati precedentemente non abbinabili: i dati degli utenti e quelli degli annunci pubblicitari. Nel secondo trimestre del 2021, Shu è riuscita a distribuire Milvus 1.0 su Kubernetes. Per saperne di più su come <a href="https://milvus.io/docs">distribuire Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Dopo il successo dell'implementazione di Milvus 1.0, il primo progetto a utilizzare Milvus è stato il progetto di richiamo delle pubblicità avviato dal team Ad di SmartNews. Durante la fase iniziale, il set di dati pubblicitari era su scala milionaria. Nel frattempo, la latenza di P99 era rigorosamente controllata entro meno di 10 millisecondi.</p>
<p>Nel giugno 2021, Shu e i suoi colleghi del team di algoritmi hanno applicato Milvus a più scenari aziendali e hanno tentato l'aggregazione dei dati e l'aggiornamento dei dati/indici online in tempo reale.</p>
<p>A questo punto, Milvus, il database vettoriale open-source, è stato utilizzato in vari scenari aziendali di SmartNews, compresa la raccomandazione di annunci pubblicitari.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>Da utente a collaboratore attivo</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Durante l'integrazione di Milvus nell'architettura del prodotto Smartnews, Shu e altri sviluppatori hanno avanzato richieste di funzioni come l'hot reload, il TTL (time-to-live) degli articoli, l'aggiornamento/sostituzione degli articoli e altro ancora. Si tratta di funzioni desiderate anche da molti utenti della comunità Milvus. Per questo motivo, Dennis Zhao, responsabile del team dell'infrastruttura AI di SmartNews, ha deciso di sviluppare e contribuire alla funzione di ricarica a caldo per la comunità. Dennis ritiene che "il team di SmartNews ha beneficiato della comunità di Milvus, quindi siamo più che disposti a contribuire se abbiamo qualcosa da condividere con la comunità".</p>
<p>Il Data reload supporta la modifica del codice durante l'esecuzione. Con l'aiuto di Data reload, gli sviluppatori non devono più fermarsi a un punto di interruzione o riavviare l'applicazione. Possono invece modificare direttamente il codice e vedere il risultato in tempo reale.</p>
<p>Alla fine di luglio, Yusup, ingegnere di SmartNews, ha proposto l'idea di utilizzare gli <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">alias delle collezioni</a> per ottenere il caricamento a caldo.</p>
<p>La creazione di alias di raccolta si riferisce alla specificazione di nomi di alias per una raccolta. Una collezione può avere più alias. Tuttavia, un alias corrisponde al massimo a una collezione. È sufficiente fare un'analogia tra una raccolta e un armadietto. Un armadietto, come una collezione, ha il suo numero e la sua posizione, che rimarranno sempre invariati. Tuttavia, è sempre possibile inserire ed estrarre cose diverse dall'armadietto. Allo stesso modo, il nome della collezione è fisso, ma i dati in essa contenuti sono dinamici. È sempre possibile inserire o eliminare vettori in una collezione, poiché la cancellazione dei dati è supportata nella <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">versione</a> Milvus <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pre-GA</a>.</p>
<p>Nel caso dell'attività pubblicitaria di SmartNews, quasi 100 milioni di vettori vengono inseriti o aggiornati quando vengono generati nuovi vettori pubblicitari dinamici. Ci sono diverse soluzioni a questo problema:</p>
<ul>
<li>Soluzione 1: cancellare prima i vecchi dati e inserirne di nuovi.</li>
<li>Soluzione 2: creare una nuova raccolta per i nuovi dati.</li>
<li>Soluzione 3: utilizzare alias di raccolta.</li>
</ul>
<p>Per quanto riguarda la soluzione 1, uno dei difetti più evidenti è che richiede molto tempo, soprattutto quando il set di dati da aggiornare è enorme. In genere ci vogliono ore per aggiornare un set di dati su scala di 100 milioni.</p>
<p>Per quanto riguarda la soluzione 2, il problema è che la nuova raccolta non è immediatamente disponibile per la ricerca. In altre parole, una raccolta non è ricercabile durante il caricamento. Inoltre, Milvus non consente a due raccolte di utilizzare lo stesso nome. Per passare a una nuova raccolta, gli utenti devono sempre modificare manualmente il codice lato client. In altre parole, gli utenti devono rivedere il valore del parametro <code translate="no">collection_name</code> ogni volta che devono passare da una collezione all'altra.</p>
<p>La soluzione 3 sarebbe la soluzione migliore. È sufficiente inserire i nuovi dati in una nuova raccolta e utilizzare gli alias di raccolta. In questo modo, è sufficiente scambiare l'alias della raccolta ogni volta che è necessario cambiare la raccolta per effettuare la ricerca. Non è necessario un ulteriore sforzo per rivedere il codice. Questa soluzione evita i problemi menzionati nelle due soluzioni precedenti.</p>
<p>Yusup è partito da questa richiesta e ha aiutato tutto il team di SmartNews a capire l'architettura di Milvus. Dopo un mese e mezzo, il progetto Milvus ha ricevuto da Yusup una PR sul caricamento a caldo. In seguito, questa funzione è stata resa ufficialmente disponibile con il rilascio di Milvus 2.0.0-RC7.</p>
<p>Attualmente, il team dell'infrastruttura AI sta prendendo l'iniziativa di distribuire Milvus 2.0 e migrare gradualmente tutti i dati da Milvus 1.0 a 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>alias img_collection</span> </span></p>
<p>Il supporto degli alias di raccolta può migliorare notevolmente l'esperienza dell'utente, soprattutto per le grandi aziende Internet con grandi volumi di richieste da parte degli utenti. Chenglong Li, ingegnere dei dati della comunità Milvus, che ha contribuito a creare il ponte tra Milvus e Smartnews, ha dichiarato: "La funzione alias di raccolta nasce da una richiesta reale di SmartNews, un utente di Milvus. E SmartNews ha contribuito al codice della comunità Milvus. Questo atto di reciprocità è un grande esempio dello spirito open-source: dalla comunità e per la comunità. Ci auguriamo di vedere altri collaboratori come SmartNews e di costruire insieme una comunità Milvus più prospera".</p>
<p>"Attualmente, una parte del settore pubblicitario sta adottando Milvus come database vettoriale offline. Il rilascio ufficiale di Mivus 2.0 si avvicina e speriamo di poter utilizzare Milvus per costruire sistemi più affidabili e fornire servizi in tempo reale per un maggior numero di scenari aziendali", ha dichiarato Dennis.</p>
<blockquote>
<p>Aggiornamento: Milvus 2.0 è ora disponibile a livello generale! <a href="/blog/it/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Per saperne di più</a></p>
</blockquote>
