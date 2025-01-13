---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Einführung von Milvus Lite: die leichtgewichtige Version von Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Erleben Sie die Geschwindigkeit und Effizienz von Milvus Lite, der
  leichtgewichtigen Variante der renommierten Vektordatenbank Milvus für
  blitzschnelle Ähnlichkeitssuche.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Wichtiger Hinweis</em></strong></p>
<p><em>Wir haben Milvus Lite im Juni 2024 aktualisiert. Damit können KI-Entwickler Anwendungen schneller erstellen und gleichzeitig eine konsistente Erfahrung über verschiedene Bereitstellungsoptionen hinweg gewährleisten, einschließlich Milvus auf Kurbernetes, Docker und verwaltete Cloud-Dienste. Milvus Lite lässt sich auch in verschiedene KI-Frameworks und -Technologien integrieren und vereinfacht die Entwicklung von KI-Anwendungen mit Vektorsuchfunktionen. Weitere Informationen finden Sie unter den folgenden Referenzen:</em></p>
<ul>
<li><p><em>Milvus Lite Launch Blog: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Milvus-Lite-Dokumentation: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Milvus Lite GitHub-Repository: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> ist eine Open-Source-Vektordatenbank, die speziell für die Indizierung, Speicherung und Abfrage von Einbettungsvektoren entwickelt wurde, die von tiefen neuronalen Netzen und anderen Modellen des maschinellen Lernens (ML) in Milliardenhöhe erzeugt werden. Sie ist zu einer beliebten Wahl für viele Unternehmen, Forscher und Entwickler geworden, die Ähnlichkeitssuchen in großen Datensätzen durchführen müssen.</p>
<p>Manche Benutzer finden die Vollversion von Milvus jedoch zu schwerfällig oder zu komplex. Um dieses Problem zu lösen, hat <a href="https://github.com/matrixji">Bin Ji</a>, einer der aktivsten Mitwirkenden in der Milvus-Gemeinschaft, <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> entwickelt, eine schlanke Version von Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Was ist Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie bereits erwähnt, ist <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> eine vereinfachte Alternative zu Milvus, die viele Vorteile und Nutzen bietet.</p>
<ul>
<li>Sie können es in Ihre Python-Anwendung integrieren, ohne zusätzliches Gewicht zu erzeugen.</li>
<li>Es ist in sich geschlossen und benötigt keine weiteren Abhängigkeiten, da das eigenständige Milvus mit eingebettetem Etcd und lokalem Speicher arbeiten kann.</li>
<li>Sie können ihn als Python-Bibliothek importieren und ihn als eigenständigen Server mit Befehlszeilenschnittstelle (CLI) verwenden.</li>
<li>Er arbeitet reibungslos mit Google Colab und Jupyter Notebook zusammen.</li>
<li>Sie können Ihre Arbeit und Ihren Code sicher auf andere Milvus-Instanzen (Standalone-, Cluster- und vollständig verwaltete Versionen) migrieren, ohne dass ein Datenverlust droht.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Wann sollten Sie Milvus Lite verwenden?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite ist vor allem in den folgenden Situationen sehr hilfreich:</p>
<ul>
<li>Wenn Sie es vorziehen, Milvus ohne Container-Techniken und -Tools wie <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> oder <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a> zu verwenden.</li>
<li>Wenn Sie für die Nutzung von Milvus keine virtuellen Maschinen oder Container benötigen.</li>
<li>Wenn Sie Milvus-Funktionen in Ihre Python-Anwendungen einbinden möchten.</li>
<li>Wenn Sie eine Milvus-Instanz in Colab oder Notebook für ein schnelles Experiment aufsetzen möchten.</li>
</ul>
<p><strong>Hinweis</strong>: Wir raten davon ab, Milvus Lite in einer Produktionsumgebung zu verwenden oder wenn Sie hohe Leistung, hohe Verfügbarkeit oder hohe Skalierbarkeit benötigen. Ziehen Sie stattdessen die Verwendung von <a href="https://github.com/milvus-io/milvus">Milvus-Clustern</a> oder <a href="https://zilliz.com/cloud">voll verwaltetem Milvus auf Zilliz Cloud</a> für die Produktion in Betracht.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Wie fängt man mit Milvus Lite an?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Werfen wir nun einen Blick darauf, wie Milvus Lite installiert, konfiguriert und verwendet wird.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><p>Um Milvus Lite zu verwenden, stellen Sie bitte sicher, dass Sie die folgenden Anforderungen erfüllt haben:</p>
<ul>
<li>Installiertes Python 3.7 oder eine neuere Version.</li>
<li>Sie verwenden eines der unten aufgeführten verifizierten Betriebssysteme:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Anmerkungen</strong>:</p>
<ol>
<li>Milvus Lite verwendet <code translate="no">manylinux2014</code> als Basis-Image, wodurch es mit den meisten Linux-Distributionen für Linux-Benutzer kompatibel ist.</li>
<li>Der Betrieb von Milvus Lite unter Windows ist ebenfalls möglich, obwohl dies noch nicht vollständig verifiziert wurde.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Milvus Lite installieren</h3><p>Milvus Lite ist auf PyPI verfügbar, so dass Sie es über <code translate="no">pip</code> installieren können.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>Sie können es auch mit PyMilvus wie folgt installieren:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Milvus Lite verwenden und starten</h3><p>Laden Sie das <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Beispiel-Notizbuch</a> aus dem Beispiel-Ordner unseres Projekt-Repositorys herunter. Sie haben zwei Möglichkeiten, Milvus Lite zu verwenden: Entweder Sie importieren es als Python-Bibliothek oder Sie starten es als eigenständigen Server auf Ihrem Rechner unter Verwendung der CLI.</p>
<ul>
<li>Um Milvus Lite als Python-Modul zu starten, führen Sie die folgenden Befehle aus:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Um Milvus Lite zu unterbrechen oder anzuhalten, verwenden Sie die Anweisung <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Um Milvus Lite als CLI-basierten Standalone-Server zu starten, führen Sie den folgenden Befehl aus:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Nachdem Sie Milvus Lite gestartet haben, können Sie PyMilvus oder ein anderes Tool Ihrer Wahl verwenden, um sich mit dem Standalone-Server zu verbinden.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Starten von Milvus Lite in einem Debug-Modus</h3><ul>
<li>Um Milvus Lite in einem Debug-Modus als Python-Modul zu starten, führen Sie die folgenden Befehle aus:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Um den Standalone-Server in einem Debug-Modus zu starten, führen Sie den folgenden Befehl aus:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Persistieren von Daten und Protokollen</h3><ul>
<li>Um ein lokales Verzeichnis für Milvus Lite zu erstellen, das alle relevanten Daten und Protokolle enthält, führen Sie die folgenden Befehle aus:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Um alle vom Standalone-Server erzeugten Daten und Protokolle auf Ihrem lokalen Laufwerk zu speichern, führen Sie den folgenden Befehl aus:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Milvus Lite konfigurieren</h3><p>Die Konfiguration von Milvus Lite ähnelt der Einrichtung von Milvus-Instanzen über Python-APIs oder CLI.</p>
<ul>
<li>Um Milvus Lite mit Hilfe von Python-APIs zu konfigurieren, verwenden Sie die <code translate="no">config.set</code> API einer <code translate="no">MilvusServer</code> Instanz sowohl für die Grund- als auch für die Zusatzeinstellungen:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Um Milvus Lite mit CLI zu konfigurieren, führen Sie den folgenden Befehl für die Grundeinstellungen aus:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Oder führen Sie den folgenden Befehl für zusätzliche Konfigurationen aus.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Alle konfigurierbaren Elemente sind in der Vorlage <code translate="no">config.yaml</code> enthalten, die mit dem Milvus-Paket geliefert wird.</p>
<p>Weitere technische Details zur Installation und Konfiguration von Milvus Lite finden Sie in unserer <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">Dokumentation</a>.</p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite ist eine ausgezeichnete Wahl für alle, die die Fähigkeiten von Milvus in einem kompakten Format suchen. Ob Sie Forscher, Entwickler oder Datenwissenschaftler sind, es lohnt sich, diese Option zu erkunden.</p>
<p>Milvus Lite ist auch eine wunderbare Bereicherung für die Open-Source-Gemeinschaft und zeigt die außergewöhnliche Arbeit seiner Mitwirkenden. Dank der Bemühungen von Bin Ji ist Milvus nun für mehr Nutzer verfügbar. Wir können es kaum erwarten, die innovativen Ideen zu sehen, die Bin Ji und andere Mitglieder der Milvus-Community in Zukunft hervorbringen werden.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Lassen Sie uns in Kontakt bleiben!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Probleme bei der Installation oder Verwendung von Milvus Lite haben, können Sie <a href="https://github.com/milvus-io/milvus-lite/issues/new">hier ein Problem melden</a> oder uns über <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> kontaktieren. Sie sind auch herzlich eingeladen, unserem <a href="https://milvus.io/slack/">Slack-Kanal</a> beizutreten, um mit unseren Ingenieuren und der gesamten Community zu chatten, oder besuchen Sie <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">unsere Dienstagssprechstunde</a>!</p>
