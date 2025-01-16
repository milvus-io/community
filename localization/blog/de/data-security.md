---
id: data-security.md
title: Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: >-
  Erfahren Sie mehr über Benutzerauthentifizierung und Verschlüsselung bei der
  Übertragung in Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<p>Um die Sicherheit Ihrer Daten zu gewährleisten, sind Benutzerauthentifizierung und Transport Layer Security (TLS)-Verbindung jetzt offiziell in Milvus 2.1 verfügbar. Ohne Benutzerauthentifizierung kann jeder mit dem SDK auf alle Daten in Ihrer Vektordatenbank zugreifen. Ab Milvus 2.1 können jedoch nur Personen mit einem gültigen Benutzernamen und Passwort auf die Milvus-Vektordatenbank zugreifen. Darüber hinaus wird in Milvus 2.1 die Datensicherheit durch TLS weiter geschützt, was eine sichere Kommunikation in einem Computernetzwerk gewährleistet.</p>
<p>In diesem Artikel soll analysiert werden, wie die Vektordatenbank Milvus die Datensicherheit durch Benutzerauthentifizierung und TLS-Verbindung gewährleistet, und es soll erklärt werden, wie Sie als Benutzer, der die Datensicherheit bei der Verwendung der Vektordatenbank gewährleisten möchte, diese beiden Funktionen nutzen können.</p>
<p><strong>Springen Sie zu:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">Was ist Datenbanksicherheit und warum ist sie wichtig?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Wie gewährleistet die Vektordatenbank Milvus die Datensicherheit?</a><ul>
<li><a href="#User-authentication">Benutzer-Authentifizierung</a></li>
<li><a href="#TLS-connection">TLS-Verbindung</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">Was ist Datenbanksicherheit und warum ist sie wichtig?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Datenbanksicherheit bezieht sich auf die Maßnahmen, die ergriffen werden, um sicherzustellen, dass alle Daten in der Datenbank sicher sind und vertraulich behandelt werden. Die jüngsten Fälle von Datenschutzverletzungen und Datenlecks bei <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, dem texanischen Versicherungsministerium usw</a>. machen uns umso wachsamer in Bezug auf das Thema Datensicherheit. All diese Fälle erinnern uns ständig daran, dass Firmen und Unternehmen schwere Verluste erleiden können, wenn die Daten nicht gut geschützt sind und die von ihnen verwendeten Datenbanken nicht sicher sind.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Wie gewährleistet die Vektordatenbank Milvus die Datensicherheit?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>In der aktuellen Version 2.1 versucht die Milvus Vektordatenbank, die Sicherheit der Datenbank durch Authentifizierung und Verschlüsselung zu gewährleisten. Genauer gesagt, unterstützt Milvus auf der Zugriffsebene eine grundlegende Benutzerauthentifizierung, um zu kontrollieren, wer auf die Datenbank zugreifen kann. Auf der Datenbankebene verwendet Milvus das TLS-Verschlüsselungsprotokoll (Transport Layer Security), um die Datenkommunikation zu schützen.</p>
<h3 id="User-authentication" class="common-anchor-header">Benutzerauthentifizierung</h3><p>Die grundlegende Benutzerauthentifizierung in Milvus unterstützt den Zugriff auf die Vektordatenbank unter Verwendung eines Benutzernamens und eines Passworts, um die Datensicherheit zu gewährleisten. Das bedeutet, dass Clients nur dann auf die Milvus-Instanz zugreifen können, wenn sie einen authentifizierten Benutzernamen und ein Passwort angeben.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Der Authentifizierungs-Workflow in der Milvus-Vektordatenbank</h4><p>Alle gRPC-Anfragen werden vom Milvus-Proxy bearbeitet, daher wird die Authentifizierung vom Proxy durchgeführt. Der Arbeitsablauf für die Anmeldung mit den Anmeldedaten zur Verbindung mit der Milvus-Instanz sieht folgendermaßen aus.</p>
<ol>
<li>Erstellen Sie Anmeldeinformationen für jede Milvus-Instanz, und die verschlüsselten Passwörter werden in etcd gespeichert. Milvus verwendet <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> zur Verschlüsselung, da es den <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">adaptiven Hashing-Algorithmus</a> von Provos und Mazières implementiert.</li>
<li>Auf der Client-Seite sendet das SDK bei der Verbindung mit dem Milvus-Dienst einen Chiffretext. Der base64-Chiffretext (<username>:<password>) wird mit dem Schlüssel <code translate="no">authorization</code> an die Metadaten angehängt.</li>
<li>Der Milvus-Proxy fängt die Anfrage ab und prüft die Anmeldedaten.</li>
<li>Die Berechtigungsnachweise werden lokal im Proxy zwischengespeichert.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>authetication_workflow</span> </span></p>
<p>Wenn die Berechtigungsnachweise aktualisiert werden, sieht der Systemworkflow in Milvus wie folgt aus</p>
<ol>
<li>Der Root-Koordinator ist für die Anmeldeinformationen zuständig, wenn die APIs zum Einfügen, Abfragen und Löschen aufgerufen werden.</li>
<li>Wenn Sie die Anmeldedaten aktualisieren, weil Sie z.B. das Passwort vergessen haben, wird das neue Passwort in etcd festgehalten. Dann werden alle alten Anmeldeinformationen im lokalen Cache des Proxys ungültig gemacht.</li>
<li>Der Authentifizierungsinterceptor sucht zuerst nach den Datensätzen im lokalen Cache. Wenn die Anmeldeinformationen im Cache nicht korrekt sind, wird der RPC-Aufruf zum Abrufen des aktuellsten Datensatzes aus dem Stammverzeichnis ausgelöst. Die Anmeldeinformationen im lokalen Cache werden entsprechend aktualisiert.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>credential_update_workflow</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Wie verwaltet man die Benutzerauthentifizierung in der Milvus-Vektor-Datenbank?</h4><p>Um die Authentifizierung zu aktivieren, müssen Sie zunächst <code translate="no">common.security.authorizationEnabled</code> auf <code translate="no">true</code> setzen, wenn Sie Milvus in der Datei <code translate="no">milvus.yaml</code> konfigurieren.</p>
<p>Sobald die Authentifizierung aktiviert ist, wird ein Root-Benutzer für die Milvus-Instanz erstellt. Dieser Root-Benutzer kann das anfängliche Passwort <code translate="no">Milvus</code> verwenden, um sich mit der Milvus-Vektor-Datenbank zu verbinden.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Wir empfehlen dringend, das Passwort des Root-Benutzers zu ändern, wenn Sie Milvus zum ersten Mal starten.</p>
<p>Anschließend kann der Root-Benutzer weitere neue Benutzer für den authentifizierten Zugriff erstellen, indem er den folgenden Befehl zum Erstellen neuer Benutzer ausführt.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Beim Anlegen neuer Benutzer sind zwei Dinge zu beachten:</p>
<ol>
<li><p>Der neue Benutzername darf nicht länger als 32 Zeichen sein und muss mit einem Buchstaben beginnen. Nur Unterstriche, Buchstaben oder Zahlen sind im Benutzernamen erlaubt. Der Benutzername "2abc!" wird zum Beispiel nicht akzeptiert.</p></li>
<li><p>Die Länge des Passworts sollte zwischen 6 und 256 Zeichen liegen.</p></li>
</ol>
<p>Sobald die neuen Anmeldedaten eingerichtet sind, kann sich der neue Benutzer mit dem Benutzernamen und dem Passwort mit der Milvus-Instanz verbinden.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Wie bei allen Authentifizierungsverfahren müssen Sie sich keine Sorgen machen, wenn Sie das Passwort vergessen haben. Das Passwort für einen bestehenden Benutzer kann mit dem folgenden Befehl zurückgesetzt werden.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Lesen Sie die <a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus-Dokumentation</a>, um mehr über die Benutzerauthentifizierung zu erfahren.</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS-Verbindung</h3><p>Transport Layer Security (TLS) ist eine Art Authentifizierungsprotokoll, das die Kommunikationssicherheit in einem Computernetzwerk gewährleistet. TLS verwendet Zertifikate, um Authentifizierungsdienste zwischen zwei oder mehreren kommunizierenden Parteien bereitzustellen.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">So aktivieren Sie TLS in der Milvus-Vektor-Datenbank</h4><p>Um TLS in Milvus zu aktivieren, müssen Sie zunächst den folgenden Befehl ausführen, um zwei Dateien für die Erzeugung des Zertifikats zu erstellen: eine Standard-OpenSSL-Konfigurationsdatei namens <code translate="no">openssl.cnf</code> und eine Datei namens <code translate="no">gen.sh</code>, die für die Erzeugung der entsprechenden Zertifikate verwendet wird.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Dann können Sie einfach die Konfiguration, die wir <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">hier</a> bereitstellen, in die beiden Dateien kopieren und einfügen. Sie können aber auch Änderungen auf der Grundlage unserer Konfiguration vornehmen, um sie besser an Ihre Anwendung anzupassen.</p>
<p>Wenn die beiden Dateien fertig sind, können Sie die Datei <code translate="no">gen.sh</code> ausführen, um neun Zertifikatsdateien zu erstellen. Ebenso können Sie die Konfigurationen in den neun Zertifikatsdateien an Ihre Bedürfnisse anpassen.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Es gibt noch einen letzten Schritt, bevor Sie sich mit dem Milvus-Dienst über TLS verbinden können. Sie müssen <code translate="no">tlsEnabled</code> auf <code translate="no">true</code> setzen und die Dateipfade von <code translate="no">server.pem</code>, <code translate="no">server.key</code>, und <code translate="no">ca.pem</code> für den Server in <code translate="no">config/milvus.yaml</code> konfigurieren. Der folgende Code ist ein Beispiel.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dann sind Sie bereit und können eine Verbindung zum Milvus-Dienst mit TLS herstellen, solange Sie die Dateipfade von <code translate="no">client.pem</code>, <code translate="no">client.key</code> und <code translate="no">ca.pem</code> für den Client angeben, wenn Sie das Milvus-Verbindungs-SDK verwenden. Der folgende Code ist auch ein Beispiel.</p>
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
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der offiziellen Freigabe von Milvus 2.1 haben wir eine Reihe von Blogs vorbereitet, in denen die neuen Funktionen vorgestellt werden. Lesen Sie mehr in dieser Blogserie:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Wie Sie String-Daten für Ihre Anwendungen zur Ähnlichkeitssuche nutzen können</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von Milvus mit Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Erhöhen Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis der Konsistenzstufe in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
