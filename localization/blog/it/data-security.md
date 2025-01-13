---
id: data-security.md
title: In che modo il database Milvus Vector garantisce la sicurezza dei dati?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: >-
  Imparate a conoscere l'autenticazione degli utenti e la crittografia in
  transito in Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<p>In considerazione della sicurezza dei vostri dati, l'autenticazione dell'utente e la connessione con sicurezza del livello di trasporto (TLS) sono ora ufficialmente disponibili in Milvus 2.1. Senza l'autenticazione dell'utente, chiunque può accedere a tutti i dati del database vettoriale con l'SDK. Tuttavia, a partire da Milvus 2.1, solo chi possiede un nome utente e una password validi può accedere al database vettoriale di Milvus. Inoltre, in Milvus 2.1 la sicurezza dei dati è ulteriormente protetta da TLS, che garantisce comunicazioni sicure in una rete di computer.</p>
<p>Questo articolo si propone di analizzare come il database vettoriale Milvus garantisca la sicurezza dei dati con l'autenticazione dell'utente e la connessione TLS e di spiegare come si possono utilizzare queste due funzioni come utenti che vogliono garantire la sicurezza dei dati quando utilizzano il database vettoriale.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">Cos'è la sicurezza del database e perché è importante?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a><ul>
<li><a href="#User-authentication">Autenticazione dell'utente</a></li>
<li><a href="#TLS-connection">Connessione TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">Cos'è la sicurezza del database e perché è importante?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>La sicurezza del database si riferisce alle misure adottate per garantire la sicurezza e la riservatezza di tutti i dati contenuti nel database. I recenti casi di violazione e fuga di dati di <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, Texas Department of Insurance, ecc.</a> ci rendono ancora più attenti al problema della sicurezza dei dati. Tutti questi casi ci ricordano costantemente che le aziende e le imprese possono subire gravi perdite se i dati non sono ben protetti e i database che utilizzano sono sicuri.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>Nell'attuale versione 2.1, il database vettoriale Milvus cerca di garantire la sicurezza del database attraverso l'autenticazione e la crittografia. In particolare, a livello di accesso, Milvus supporta l'autenticazione di base degli utenti per controllare chi può accedere al database. A livello di database, invece, Milvus adotta il protocollo di crittografia Transport Layer Security (TLS) per proteggere la comunicazione dei dati.</p>
<h3 id="User-authentication" class="common-anchor-header">Autenticazione dell'utente</h3><p>La funzione di autenticazione utente di base di Milvus consente di accedere al database dei vettori utilizzando un nome utente e una password per garantire la sicurezza dei dati. Ciò significa che i clienti possono accedere all'istanza Milvus solo dopo aver fornito un nome utente e una password autenticati.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Il flusso di autenticazione nel database vettoriale di Milvus</h4><p>Tutte le richieste gRPC sono gestite dal proxy Milvus, quindi l'autenticazione è completata dal proxy. Il flusso di lavoro per l'accesso con le credenziali per la connessione all'istanza Milvus è il seguente.</p>
<ol>
<li>Creare le credenziali per ogni istanza Milvus e le password criptate sono memorizzate in etcd. Milvus utilizza <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> per la crittografia, poiché implementa l'<a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">algoritmo di hashing adattivo</a> di Provos e Mazières.</li>
<li>Sul lato client, l'SDK invia un testo cifrato quando si connette al servizio Milvus. Il testo cifrato in base64 (<username>:<password>) è allegato ai metadati con la chiave <code translate="no">authorization</code>.</li>
<li>Il proxy Milvus intercetta la richiesta e verifica le credenziali.</li>
<li>Le credenziali sono memorizzate nella cache locale del proxy.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>flusso_di_autenticazione</span> </span></p>
<p>Quando le credenziali vengono aggiornate, il flusso di lavoro del sistema in Milvus è il seguente</p>
<ol>
<li>Il coordinatore principale si occupa delle credenziali quando vengono chiamate le API di inserimento, interrogazione e cancellazione.</li>
<li>Quando si aggiornano le credenziali, ad esempio perché si è dimenticata la password, la nuova password viene memorizzata in etcd. Quindi tutte le vecchie credenziali nella cache locale del proxy vengono invalidate.</li>
<li>L'intercettore di autenticazione cerca prima i record della cache locale. Se le credenziali nella cache non sono corrette, viene attivata la chiamata RPC per recuperare il record più aggiornato dal coord root. Le credenziali nella cache locale vengono aggiornate di conseguenza.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>flusso_aggiornamento_credenziali</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Come gestire l'autenticazione degli utenti nel database vettoriale Milvus</h4><p>Per abilitare l'autenticazione, è necessario prima impostare <code translate="no">common.security.authorizationEnabled</code> su <code translate="no">true</code> quando si configura Milvus nel file <code translate="no">milvus.yaml</code>.</p>
<p>Una volta abilitata, verrà creato un utente root per l'istanza Milvus. Questo utente root può usare la password iniziale di <code translate="no">Milvus</code> per connettersi al database dei vettori di Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Si consiglia di cambiare la password dell'utente root quando si avvia Milvus per la prima volta.</p>
<p>L'utente root può poi creare altri nuovi utenti per l'accesso autenticato eseguendo il seguente comando per creare nuovi utenti.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Ci sono due cose da ricordare quando si creano nuovi utenti:</p>
<ol>
<li><p>Per quanto riguarda il nuovo nome utente, non può superare i 32 caratteri e deve iniziare con una lettera. Nel nome utente sono ammessi solo trattini bassi, lettere o numeri. Ad esempio, un nome utente di "2abc!" non è accettato.</p></li>
<li><p>La lunghezza della password deve essere compresa tra 6 e 256 caratteri.</p></li>
</ol>
<p>Una volta impostata la nuova credenziale, il nuovo utente può collegarsi all'istanza Milvus con il nome utente e la password.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Come per tutti i processi di autenticazione, non ci si deve preoccupare se si dimentica la password. La password di un utente esistente può essere reimpostata con il seguente comando.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Leggete la <a href="https://milvus.io/docs/v2.1.x/authenticate.md">documentazione</a> di <a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus</a> per saperne di più sull'autenticazione degli utenti.</p>
<h3 id="TLS-connection" class="common-anchor-header">Connessione TLS</h3><p>La sicurezza del livello di trasporto (TLS) è un tipo di protocollo di autenticazione che garantisce la sicurezza delle comunicazioni in una rete di computer. TLS utilizza certificati per fornire servizi di autenticazione tra due o più parti comunicanti.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Come abilitare il TLS nel database dei vettori Milvus</h4><p>Per abilitare il TLS in Milvus, occorre innanzitutto eseguire il seguente comando per preparare due file per la generazione del certificato: un file di configurazione OpenSSL predefinito chiamato <code translate="no">openssl.cnf</code> e un file chiamato <code translate="no">gen.sh</code> usato per generare i certificati pertinenti.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Quindi si può semplicemente copiare e incollare la configurazione fornita <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">qui</a> nei due file. Oppure si possono apportare modifiche basate sulla nostra configurazione per adattarla meglio alla propria applicazione.</p>
<p>Quando i due file sono pronti, si può eseguire il file <code translate="no">gen.sh</code> per creare nove file di certificati. Allo stesso modo, è possibile modificare le configurazioni dei nove file di certificato in base alle proprie esigenze.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>C'è un ultimo passaggio prima di potersi connettere al servizio Milvus con TLS. Bisogna impostare <code translate="no">tlsEnabled</code> su <code translate="no">true</code> e configurare i percorsi dei file <code translate="no">server.pem</code>, <code translate="no">server.key</code> e <code translate="no">ca.pem</code> per il server in <code translate="no">config/milvus.yaml</code>. Il codice qui sotto è un esempio.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>A questo punto è tutto pronto e ci si può connettere al servizio Milvus con TLS, purché si specifichino i percorsi dei file <code translate="no">client.pem</code>, <code translate="no">client.key</code> e <code translate="no">ca.pem</code> per il client quando si usa l'SDK di connessione Milvus. Il codice qui sotto è anche un esempio.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che introducono le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati delle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza del database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
