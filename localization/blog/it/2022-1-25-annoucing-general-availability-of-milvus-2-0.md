---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Annuncio della disponibilità generale di Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Un modo semplice per gestire dati massivi ad alta dimensionalità
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Cari membri e amici della comunità Milvus:</p>
<p>Oggi, sei mesi dopo che la prima Release Candidate (RC) è stata resa pubblica, siamo entusiasti di annunciare che Milvus 2.0 è <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">General Available (GA)</a> e pronto per la produzione! È stato un lungo viaggio e ringraziamo tutti coloro - collaboratori della comunità, utenti e LF AI &amp; Data Foundation - che ci hanno aiutato a realizzarlo.</p>
<p>La capacità di gestire miliardi di dati ad alta dimensionalità è una questione importante per i sistemi di intelligenza artificiale al giorno d'oggi, e per buone ragioni:</p>
<ol>
<li>I dati non strutturati occupano volumi dominanti rispetto ai tradizionali dati strutturati.</li>
<li>La freschezza dei dati non è mai stata così importante. I data scientist sono desiderosi di soluzioni tempestive per i dati, piuttosto che il tradizionale compromesso T+1.</li>
<li>I costi e le prestazioni sono diventati ancora più critici, eppure esiste ancora un grande divario tra le soluzioni attuali e i casi d'uso reali. Da qui nasce Milvus 2.0. Milvus è un database che aiuta a gestire dati ad alta dimensionalità su scala. È progettato per il cloud e può essere eseguito ovunque. Se avete seguito i nostri rilasci RC, sapete che ci siamo impegnati a fondo per rendere Milvus più stabile e più facile da distribuire e mantenere.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA offre ora<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Eliminazione delle entità</strong></p>
<p>Come database, Milvus supporta ora la <a href="https://milvus.io/docs/v2.0.x/delete_data.md">cancellazione di entità per chiave primaria</a> e più avanti supporterà la cancellazione di entità per espressione.</p>
<p><strong>Bilanciamento automatico del carico</strong></p>
<p>Milvus supporta ora la politica di bilanciamento del carico tramite plugin per bilanciare il carico di ogni nodo di query e di ogni nodo di dati. Grazie alla disaggregazione del calcolo e dello storage, il bilanciamento avviene in un paio di minuti.</p>
<p><strong>Trasferimento</strong></p>
<p>Una volta che i segmenti in crescita sono stati sigillati attraverso il flush, le attività di handoff sostituiscono i segmenti in crescita con segmenti storici indicizzati per migliorare le prestazioni di ricerca.</p>
<p><strong>Compattazione dei dati</strong></p>
<p>La compattazione dei dati è un'attività in background per unire segmenti piccoli in segmenti grandi e pulire i dati logici eliminati.</p>
<p><strong>Supporto per etcd incorporato e per l'archiviazione locale dei dati</strong></p>
<p>In modalità standalone, Milvus può rimuovere la dipendenza da etcd/MinIO con poche configurazioni. L'archiviazione locale dei dati può anche essere usata come cache locale per evitare di caricare tutti i dati nella memoria principale.</p>
<p><strong>SDK multilingue</strong></p>
<p>Oltre a <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, sono ora pronti all'uso gli SDK per <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> e <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a>.</p>
<p><strong>Operatore Milvus K8s</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> fornisce una soluzione semplice per distribuire e gestire un intero stack di servizi Milvus, compresi i componenti Milvus e le relative dipendenze (ad esempio etcd, Pulsar e MinIO), sui cluster <a href="https://kubernetes.io/">Kubernetes</a> di destinazione in modo scalabile e altamente disponibile.</p>
<p><strong>Strumenti che aiutano a gestire Milvus</strong></p>
<p>Dobbiamo ringraziare <a href="https://zilliz.com/">Zilliz</a> per il fantastico contributo degli strumenti di gestione. Ora abbiamo <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, che ci permette di interagire con Milvus tramite una GUI intuitiva, e <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, uno strumento a riga di comando per gestire Milvus.</p>
<p>Grazie a tutti i 212 collaboratori, la comunità ha completato 6718 commit negli ultimi 6 mesi e sono stati chiusi molti problemi di stabilità e prestazioni. Apriremo il nostro rapporto di benchmark sulla stabilità e le prestazioni subito dopo il rilascio della versione 2.0 GA.</p>
<h2 id="Whats-next" class="common-anchor-header">Cosa ci aspetta?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Funzionalità</strong></p>
<p>Il supporto per i tipi di stringa sarà la prossima caratteristica di Milvus 2.1. Introdurremo anche il meccanismo del time to live (TTL) e la gestione di base delle ACL per soddisfare meglio le esigenze degli utenti.</p>
<p><strong>Disponibilità</strong></p>
<p>Stiamo lavorando per rifattorizzare il meccanismo di schedulazione delle query per supportare repliche multimemoria per ogni segmento. Con più repliche attive, Milvus può supportare un failover più rapido e un'esecuzione speculativa per ridurre i tempi di inattività a un paio di secondi.</p>
<p><strong>Prestazioni</strong></p>
<p>I risultati dei benchmark delle prestazioni saranno presto disponibili sui nostri siti web. Si prevede che le versioni successive vedranno un impressionante miglioramento delle prestazioni. Il nostro obiettivo è quello di dimezzare la latenza di ricerca su insiemi di dati più piccoli e raddoppiare il throughput del sistema.</p>
<p><strong>Facilità d'uso</strong></p>
<p>Milvus è progettato per funzionare ovunque. Nei prossimi rilasci supporteremo Milvus su MacOS (sia M1 che X86) e su server ARM. Offriremo anche PyMilvus incorporato, in modo che possiate semplicemente <code translate="no">pip install</code> Milvus senza dover configurare un ambiente complesso.</p>
<p><strong>Governance della comunità</strong></p>
<p>Raffineremo le regole di adesione e chiariremo i requisiti e le responsabilità dei ruoli di contributore. È in fase di sviluppo anche un programma di mentorship; chiunque sia interessato a database cloud-native, ricerca vettoriale e/o governance della comunità, non esiti a contattarci.</p>
<p>Siamo davvero entusiasti dell'ultimo rilascio di Milvus GA! Come sempre, siamo felici di ascoltare il vostro feedback. Se riscontrate qualche problema, non esitate a contattarci su <a href="https://github.com/milvus-io/milvus">GitHub</a> o via <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Cordiali saluti,</p>
<p>Xiaofan Luan</p>
<p>Manutentore del progetto Milvus</p>
<p><br/></p>
<blockquote>
<p><em>Modificato da <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
