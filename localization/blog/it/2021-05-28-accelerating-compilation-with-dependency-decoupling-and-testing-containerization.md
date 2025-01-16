---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Accelerazione della compilazione 2,5 volte con il disaccoppiamento delle
  dipendenze e la containerizzazione dei test
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Scoprite come zilliz ha ridotto i tempi di compilazione di 2,5 volte
  utilizzando tecniche di disaccoppiamento delle dipendenze e di
  containerizzazione per progetti AI e MLOps su larga scala.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Accelerazione della compilazione 2,5 volte con il disaccoppiamento delle dipendenze e la containerizzazione dei test</custom-h1><p>Il tempo di compilazione può essere aggravato da complesse dipendenze interne ed esterne che si evolvono durante il processo di sviluppo, nonché da cambiamenti negli ambienti di compilazione, come il sistema operativo o le architetture hardware. Di seguito sono riportati i problemi comuni che si possono incontrare quando si lavora a progetti di IA o MLOps su larga scala:</p>
<p><strong>Compilazione troppo lunga</strong> - L'integrazione del codice viene eseguita centinaia di volte al giorno. Con centinaia di migliaia di righe di codice, anche una piccola modifica potrebbe comportare una compilazione completa che richiede in genere una o più ore.</p>
<p><strong>Ambiente di compilazione complesso</strong> - Il codice del progetto deve essere compilato in ambienti diversi, che coinvolgono sistemi operativi diversi, come CentOS e Ubuntu, dipendenze sottostanti, come GCC, LLVM e CUDA, e architetture hardware. Inoltre, la compilazione in un ambiente specifico potrebbe non funzionare in un ambiente diverso.</p>
<p><strong>Dipendenze complesse</strong> - La compilazione di un progetto comporta più di 30 dipendenze tra componenti e di terze parti. Lo sviluppo del progetto porta spesso a modifiche delle dipendenze, causando inevitabilmente conflitti di dipendenza. Il controllo di versione tra le dipendenze è così complesso che l'aggiornamento della versione delle dipendenze si ripercuote facilmente sugli altri componenti.</p>
<p>Il<strong>download delle dipendenze di terze parti è lento o fallisce</strong> - I ritardi della rete o l'instabilità delle librerie di dipendenze di terze parti causano la lentezza del download delle risorse o il fallimento dell'accesso, con gravi ripercussioni sull'integrazione del codice.</p>
<p>Disaccoppiando le dipendenze e implementando la containerizzazione dei test, siamo riusciti a ridurre il tempo medio di compilazione del 60% mentre lavoravamo al progetto open-source di ricerca di similarità di embeddings <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Disaccoppiare le dipendenze del progetto</h3><p>La compilazione di un progetto di solito comporta un gran numero di dipendenze da componenti interni ed esterni. Più un progetto ha dipendenze, più diventa complesso gestirle. Man mano che il software cresce, diventa più difficile e costoso modificare o rimuovere le dipendenze, nonché identificare gli effetti di tali operazioni. È necessaria una manutenzione regolare durante tutto il processo di sviluppo per garantire il corretto funzionamento delle dipendenze. Una manutenzione carente, dipendenze complesse o difettose possono causare conflitti che rallentano o bloccano lo sviluppo. In pratica, ciò può significare ritardi nel download delle risorse, errori di accesso che hanno un impatto negativo sull'integrazione del codice e altro ancora. Il disaccoppiamento delle dipendenze del progetto può mitigare i difetti e ridurre i tempi di compilazione, accelerando i test di sistema ed evitando inutili ritardi nello sviluppo del software.</p>
<p>Pertanto, si consiglia di disaccoppiare le dipendenze del progetto:</p>
<ul>
<li>Dividere i componenti con dipendenze complesse</li>
<li>Utilizzare repository diversi per la gestione delle versioni.</li>
<li>Utilizzare file di configurazione per gestire le informazioni sulla versione, le opzioni di compilazione, le dipendenze, ecc.</li>
<li>Aggiungere i file di configurazione alle librerie dei componenti, in modo che vengano aggiornati durante l'iterazione del progetto.</li>
</ul>
<p><strong>Ottimizzazione della compilazione tra i componenti</strong> - Estrarre e compilare il componente pertinente in base alle dipendenze e alle opzioni di compilazione registrate nei file di configurazione. Taggare e impacchettare i risultati della compilazione binaria e i file manifest corrispondenti, quindi caricarli nel repository privato. Se non viene apportata alcuna modifica a un componente o ai componenti da cui dipende, riprodurre i risultati della compilazione in base ai file manifest. Per problemi quali ritardi di rete o librerie di dipendenze di terze parti instabili, provare a creare un repository interno o a usare repository speculari.</p>
<p>Per ottimizzare la compilazione tra componenti:</p>
<p>1. Creare il grafico delle relazioni di dipendenza - Usare i file di configurazione nelle librerie dei componenti per creare il grafico delle relazioni di dipendenza. Usare la relazione di dipendenza per recuperare le informazioni sulla versione (Git Branch, Tag e Git commit ID), le opzioni di compilazione e altro ancora dei componenti dipendenti a monte e a valle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>.Controllare le dipendenze</strong> - Generare avvisi per dipendenze circolari, conflitti di versione e altri problemi che si verificano tra i componenti.</p>
<p>3<strong>.Appiattire le dipendenze</strong> - Ordinare le dipendenze in base alla ricerca per profondità (DFS) e unire frontalmente i componenti con dipendenze duplicate per formare un grafico delle dipendenze.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4.Utilizzare l'algoritmo MerkleTree per generare un hash (Root Hash) contenente le dipendenze di ciascun componente in base alle informazioni sulla versione, alle opzioni di compilazione e altro ancora. In combinazione con informazioni come il nome del componente, l'algoritmo forma un tag unico per ogni componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5. In base alle informazioni sul tag univoco del componente, si controlla se esiste un archivio di compilazione corrispondente nel repo privato. Se viene recuperato un archivio di compilazione, decomprimerlo per ottenere il file manifest per la riproduzione; in caso contrario, compilare il componente, contrassegnare i file oggetto di compilazione e il file manifest generati e caricarli nel repo privato.</p>
<p><br/></p>
<p><strong>Implementare le ottimizzazioni di compilazione all'interno dei componenti</strong> - Scegliere uno strumento di cache di compilazione specifico per il linguaggio per memorizzare i file oggetto compilati, caricarli e memorizzarli nel repository privato. Per la compilazione di C/C++, scegliere uno strumento di cache di compilazione come CCache per memorizzare nella cache i file intermedi di compilazione di C/C++ e archiviare la cache locale di CCache dopo la compilazione. Tali strumenti di cache di compilazione memorizzano nella cache i file di codice modificati uno per uno dopo la compilazione e copiano i componenti compilati del file di codice invariato in modo che possano essere coinvolti direttamente nella compilazione finale. L'ottimizzazione della compilazione all'interno dei componenti comprende i seguenti passaggi:</p>
<ol>
<li>Aggiungere le dipendenze di compilazione necessarie al file Docker. Usare Hadolint per eseguire controlli di conformità su Dockerfile per garantire che l'immagine sia conforme alle best practice di Docker.</li>
<li>Eseguire il mirroring dell'ambiente di compilazione in base alla versione del progetto (versione + build), al sistema operativo e ad altre informazioni.</li>
<li>Eseguire il contenitore dell'ambiente di compilazione specchiato e trasferire l'ID dell'immagine al contenitore come variabile d'ambiente. Ecco un esempio di comando per ottenere l'ID dell'immagine: "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Scegliere lo strumento di cache di compilazione appropriato: Inserire il containter per integrare e compilare i codici e controllare nel repository privato se esiste una cache di compilazione appropriata. In caso affermativo, scaricarla ed estrarla nella directory specificata. Dopo la compilazione di tutti i componenti, la cache generata dallo strumento di cache di compilazione viene impacchettata e caricata nel vostro repository privato in base alla versione del progetto e all'ID dell'immagine.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Ulteriore ottimizzazione della compilazione</h3><p>Il nostro progetto iniziale occupa troppo spazio su disco e banda di rete e richiede molto tempo per essere distribuito:</p>
<ol>
<li>Scegliere l'immagine di base più snella per ridurre le dimensioni dell'immagine, ad esempio alpine, busybox, ecc.</li>
<li>Ridurre il numero di livelli dell'immagine. Riutilizzare il più possibile le dipendenze. Unire più comandi con "&amp;&amp;".</li>
<li>Pulire i prodotti intermedi durante la creazione dell'immagine.</li>
<li>Usare la cache dell'immagine per costruire l'immagine il più possibile.</li>
</ol>
<p>Con l'avanzare del progetto, l'utilizzo del disco e delle risorse di rete ha iniziato a salire con l'aumentare della cache di compilazione, mentre alcune cache di compilazione sono sottoutilizzate. Abbiamo quindi apportato le seguenti modifiche:</p>
<p><strong>Pulire regolarmente i file della cache</strong> - Controllare regolarmente il repository privato (utilizzando ad esempio gli script) e pulire i file della cache che non sono stati modificati per un certo periodo o che non sono stati scaricati molto.</p>
<p><strong>Caching selettivo delle compilazioni</strong> - Mettere in cache solo le compilazioni che richiedono risorse e saltare quelle che non ne richiedono molte.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Sfruttare i test containerizzati per ridurre gli errori, migliorare la stabilità e l'affidabilità</h3><p>I codici devono essere compilati in ambienti diversi, che comportano una varietà di sistemi operativi (ad esempio CentOS e Ubuntu), dipendenze sottostanti (ad esempio GCC, LLVM e CUDA) e architetture hardware specifiche. Il codice che viene compilato con successo in un ambiente specifico fallisce in un ambiente diverso. Eseguendo i test all'interno di container, il processo di test diventa più rapido e accurato.</p>
<p>La containerizzazione garantisce che l'ambiente di test sia coerente e che l'applicazione funzioni come previsto. L'approccio di testing containerizzato confeziona i test come contenitori di immagini e crea un ambiente di test veramente isolato. I nostri tester hanno trovato molto utile questo approccio, che ha finito per ridurre i tempi di compilazione fino al 60%.</p>
<p><strong>Garantire un ambiente di compilazione coerente</strong> - Poiché i prodotti compilati sono sensibili alle modifiche dell'ambiente di sistema, è possibile che si verifichino errori sconosciuti in sistemi operativi diversi. Dobbiamo etichettare e archiviare la cache dei prodotti compilati in base alle modifiche dell'ambiente di compilazione, ma è difficile classificarle. Per risolvere questi problemi abbiamo introdotto la tecnologia di containerizzazione per unificare l'ambiente di compilazione.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusione</h3><p>Analizzando le dipendenze del progetto, questo articolo introduce diversi metodi per l'ottimizzazione della compilazione tra e all'interno dei componenti, fornendo idee e best practice per la creazione di un'integrazione continua del codice stabile ed efficiente. Questi metodi hanno contribuito a risolvere la lentezza dell'integrazione del codice causata da dipendenze complesse, a unificare le operazioni all'interno del contenitore per garantire la coerenza dell'ambiente e a migliorare l'efficienza della compilazione attraverso la riproduzione dei risultati della compilazione e l'uso di strumenti di cache di compilazione per memorizzare i risultati intermedi della compilazione.</p>
<p>Queste pratiche hanno ridotto il tempo di compilazione del progetto del 60% in media, migliorando notevolmente l'efficienza complessiva dell'integrazione del codice. In futuro, continueremo a parallelizzare la compilazione tra e all'interno dei componenti per ridurre ulteriormente i tempi di compilazione.</p>
<p><br/></p>
<p><em>Per questo articolo sono state utilizzate le seguenti fonti:</em></p>
<ul>
<li>"Disaccoppiamento degli alberi di sorgenti nei componenti a livello di build".</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Fattori da considerare quando si aggiungono dipendenze di terze parti a un progetto</a>".</li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Sopravvivere alle dipendenze del software</a></li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Comprendere le dipendenze: Uno studio delle sfide di coordinamento nello sviluppo del software</a>".</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">Informazioni sull'autore</h3><p>Zhifeng Zhang è un ingegnere DevOps senior presso Zilliz.com che lavora su Milvus, un database vettoriale open-source, e istruttore autorizzato dell'università del software open-source LF in Cina. Ha conseguito la laurea in Internet of Things (IOT) presso il Software Engineering Institute di Guangzhou. Trascorre la sua carriera partecipando e guidando progetti nell'area CI/CD, DevOps, gestione dell'infrastruttura IT, toolkit Cloud-Native, containerizzazione e ottimizzazione dei processi di compilazione.</p>
