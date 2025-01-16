---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Wie man zu Milvus beiträgt: Ein Schnellstart für Entwickler'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> ist eine <a href="https://zilliz.com/learn/what-is-vector-database">Open-Source-Vektordatenbank</a> für die Verwaltung hochdimensionaler Vektordaten. Ganz gleich, ob Sie intelligente Suchmaschinen, Empfehlungssysteme oder KI-Lösungen der nächsten Generation wie Retrieval Augmented Generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>) entwickeln, Milvus ist ein leistungsstarkes Tool, das Ihnen zur Verfügung steht.</p>
<p>Aber was Milvus wirklich vorantreibt, ist nicht nur seine fortschrittliche Technologie, sondern auch die lebendige, leidenschaftliche <a href="https://zilliz.com/community">Entwicklergemeinschaft</a>, die dahinter steht. Als Open-Source-Projekt gedeiht und entwickelt sich Milvus dank der Beiträge von Entwicklern wie Ihnen weiter. Jede Fehlerbehebung, Funktionserweiterung und Leistungsverbesserung durch die Community macht Milvus schneller, skalierbarer und zuverlässiger.</p>
<p>Egal, ob Sie sich für Open-Source begeistern, lernen wollen oder einen bleibenden Einfluss auf die KI haben möchten, Milvus ist der perfekte Ort, um einen Beitrag zu leisten. Dieser Leitfaden führt Sie durch den Prozess - von der Einrichtung Ihrer Entwicklungsumgebung bis zum Einreichen Ihres ersten Pull Requests. Wir zeigen Ihnen auch die häufigsten Herausforderungen auf, mit denen Sie konfrontiert werden könnten, und bieten Lösungen an, um diese zu überwinden.</p>
<p>Bereit zum Einsteigen? Lassen Sie uns gemeinsam Milvus noch besser machen!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Einrichten Ihrer Milvus-Entwicklungsumgebung<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Wichtigste zuerst: die Einrichtung Ihrer Entwicklungsumgebung. Sie können Milvus entweder auf Ihrem lokalen Rechner installieren oder Docker verwenden - beide Methoden sind unkompliziert, aber Sie müssen auch ein paar Abhängigkeiten von Drittanbietern installieren, damit alles läuft.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Milvus lokal erstellen</h3><p>Wenn Sie gerne Dinge von Grund auf neu erstellen, ist die Erstellung von Milvus auf Ihrem lokalen Rechner ein Kinderspiel. Milvus macht es einfach, indem es alle Abhängigkeiten im <code translate="no">install_deps.sh</code> Skript bündelt. Hier ist die schnelle Einrichtung:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Milvus mit Docker bauen</h3><p>Wenn Sie Docker bevorzugen, gibt es zwei Möglichkeiten: Sie können entweder Befehle in einem vorgefertigten Container ausführen oder einen Entwicklungscontainer erstellen, um einen praktischen Ansatz zu verfolgen.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweise zur Plattform:</strong> Wenn Sie mit Linux arbeiten, können Sie loslegen - Kompilierungsprobleme sind ziemlich selten. Mac-Benutzer, insbesondere mit M1-Chips, könnten jedoch auf dem Weg dorthin auf einige Probleme stoßen. Aber keine Sorge, wir haben einen Leitfaden, der Ihnen hilft, die häufigsten Probleme zu lösen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: OS-Konfiguration</em></p>
<p>Die vollständige Anleitung zur Einrichtung finden Sie im offiziellen <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus-Entwicklungshandbuch</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Häufige Probleme und deren Behebung</h3><p>Manchmal verläuft die Einrichtung Ihrer Milvus-Entwicklungsumgebung nicht so reibungslos wie geplant. Machen Sie sich keine Sorgen - hier finden Sie eine kurze Übersicht über häufige Probleme, die auftreten können, und wie Sie diese schnell beheben können.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Unerwartete Verbindungsunterbrechung beim Lesen von Seitenbandpaketen</h4><p>Wenn Sie Homebrew verwenden und eine Fehlermeldung wie diese sehen:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fix:</strong> Erhöhen Sie die <code translate="no">http.postBuffer</code> Größe:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie nach der Installation von Homebrew auch auf <code translate="no">Brew: command not found</code> stoßen, müssen Sie möglicherweise Ihre Git-Benutzerkonfiguration anpassen:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: Fehler beim Abrufen der Anmeldeinformationen</h4><p>Wenn Sie mit Docker arbeiten, sehen Sie möglicherweise diesen Fehler:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Abhilfe:</strong> Öffnen Sie<code translate="no">~/.docker/config.json</code> und entfernen Sie das Feld <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: Kein Modul mit dem Namen 'imp'</h4><p>Wenn Python diesen Fehler auslöst, liegt das daran, dass Python 3.12 das Modul <code translate="no">imp</code> entfernt hat, das einige ältere Abhängigkeiten noch verwenden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Beheben:</strong> Downgrade auf Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Nicht erkannte Argumente oder Befehl nicht gefunden</h4><p><strong>Problem:</strong> Wenn Sie <code translate="no">Unrecognized arguments: --install-folder conan</code> sehen, verwenden Sie wahrscheinlich eine inkompatible Conan-Version.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Behebung:</strong> Downgrade auf Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Problem:</strong> Wenn Sie <code translate="no">Conan command not found</code> sehen, bedeutet das, dass Ihre Python-Umgebung nicht richtig eingerichtet ist.</p>
<p><strong>Fix:</strong> Fügen Sie das bin-Verzeichnis von Python zu Ihrem <code translate="no">PATH</code> hinzu:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Verwendung eines nicht deklarierten Bezeichners 'kSecFormatOpenSSL'</h4><p>Dieser Fehler bedeutet normalerweise, dass Ihre LLVM-Abhängigkeiten veraltet sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Behebung:</strong> Installieren Sie LLVM 15 neu und aktualisieren Sie Ihre Umgebungsvariablen:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Profi-Tipps</strong></p>
<ul>
<li><p>Überprüfen Sie Ihre Tool-Versionen und Abhängigkeiten immer doppelt.</p></li>
<li><p>Wenn etwas immer noch nicht funktioniert, ist die<a href="https://github.com/milvus-io/milvus/issues"> Milvus GitHub Issues-Seite</a> ein guter Ort, um Antworten zu finden oder um Hilfe zu bitten.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">VS Code für die Integration von C++ und Go konfigurieren</h3><p>Die Zusammenarbeit von C++ und Go in VS Code ist einfacher, als es klingt. Mit dem richtigen Setup können Sie Ihren Entwicklungsprozess für Milvus rationalisieren. Ändern Sie einfach Ihre <code translate="no">user.settings</code> Datei mit der untenstehenden Konfiguration:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Das bewirkt diese Konfiguration:</p>
<ul>
<li><p><strong>Umgebungsvariablen:</strong> Richtet Pfade für <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code> und <code translate="no">RPATH</code> ein, die für das Auffinden von Bibliotheken während der Builds und Tests entscheidend sind.</p></li>
<li><p><strong>Go-Tools-Integration:</strong> Aktiviert Go's Sprachserver (<code translate="no">gopls</code>) und konfiguriert Werkzeuge wie <code translate="no">gofumpt</code> für die Formatierung und <code translate="no">golangci-lint</code> für das Linting.</p></li>
<li><p><strong>Test-Einrichtung:</strong> Fügt <code translate="no">testTags</code> hinzu und erhöht den Timeout für laufende Tests auf 10 Minuten.</p></li>
</ul>
<p>Einmal hinzugefügt, gewährleistet dieses Setup eine nahtlose Integration zwischen C++- und Go-Workflows. Es ist perfekt für die Erstellung und das Testen von Milvus ohne ständige Anpassung der Umgebung.</p>
<p><strong>Profi-Tipp</strong></p>
<p>Führen Sie nach der Einrichtung einen kurzen Test-Build durch, um sicherzustellen, dass alles funktioniert. Wenn etwas nicht stimmt, überprüfen Sie die Pfade und die Version der Go-Erweiterung von VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Bereitstellen von Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt <a href="https://milvus.io/docs/install-overview.md">drei Bereitstellungsmodi: Lite</a><strong>, Standalone</strong> und <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> ist eine Python-Bibliothek und eine ultraleichte Version von Milvus. Sie eignet sich perfekt für das schnelle Prototyping in Python- oder Notebook-Umgebungen und für kleine lokale Experimente.</p></li>
<li><p><strong>Milvus Standalone</strong> ist die Single-Node Deployment-Option für Milvus, die ein Client-Server-Modell verwendet. Es ist das Milvus-Äquivalent zu MySQL, während Milvus Lite mit SQLite vergleichbar ist.</p></li>
<li><p><strong>Milvus Distributed</strong> ist der verteilte Modus von Milvus, der sich ideal für Unternehmensanwender eignet, die groß angelegte Vektordatenbank-Systeme oder Vektordaten-Plattformen aufbauen.</p></li>
</ul>
<p>Alle diese Implementierungen basieren auf drei Kernkomponenten:</p>
<ul>
<li><p><strong>Milvus:</strong> Die Vektordatenbank-Engine, die alle Operationen steuert.</p></li>
<li><p><strong>Etcd:</strong> Die Metadaten-Engine, die die internen Metadaten von Milvus verwaltet.</p></li>
<li><p><strong>MinIO</strong>: Die Speicher-Engine, die die Persistenz der Daten gewährleistet.</p></li>
</ul>
<p>Im <strong>verteilten</strong> Modus enthält Milvus auch <strong>Pulsar</strong> für die verteilte Nachrichtenverarbeitung über einen Pub/Sub-Mechanismus, wodurch es für Umgebungen mit hohem Durchsatz skalierbar ist.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Der Standalone-Modus ist auf Einzelinstanz-Setups zugeschnitten und eignet sich daher perfekt für Tests und kleinere Anwendungen. Hier erfahren Sie, wie Sie loslegen können:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (früher bekannt als Milvus Cluster)</h3><p>Für größere Datensätze und ein höheres Datenaufkommen bietet der verteilte Modus horizontale Skalierbarkeit. Er kombiniert mehrere Milvus-Instanzen zu einem einzigen, zusammenhängenden System. Das Deployment wird durch den <strong>Milvus Operator</strong> vereinfacht, der auf Kubernetes läuft und den gesamten Milvus-Stack für Sie verwaltet.</p>
<p>Möchten Sie eine schrittweise Anleitung? Sehen Sie sich die <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus-Installationsanleitung</a> an.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Ausführen von End-to-End-Tests (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald Ihre Milvus-Installation in Betrieb ist, ist das Testen der Funktionalität mit E2E-Tests ein Kinderspiel. Diese Tests decken jeden Teil Ihrer Einrichtung ab, um sicherzustellen, dass alles wie erwartet funktioniert. Hier erfahren Sie, wie Sie sie durchführen:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Ausführliche Anweisungen und Tipps zur Fehlerbehebung finden Sie im <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus-Entwicklungshandbuch</a>.</p>
<p><strong>Profi-Tipp</strong></p>
<p>Wenn Sie Milvus noch nicht kennen, sollten Sie zunächst mit Milvus Lite oder dem Standalone-Modus beginnen, um ein Gefühl für die Möglichkeiten zu bekommen, bevor Sie den verteilten Modus für Produktionslasten einsetzen.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Einreichen Ihres Codes<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Herzlichen Glückwunsch! Sie haben alle Unit- und E2E-Tests abgeschlossen (oder bei Bedarf debuggt und neu kompiliert). Während der erste Build einige Zeit in Anspruch nehmen kann, werden zukünftige Builds viel schneller sein - also kein Grund zur Sorge. Wenn Sie alle Tests bestanden haben, können Sie Ihre Änderungen einreichen und zu Milvus beitragen!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Verknüpfen Sie Ihren Pull Request (PR) mit einem Issue</h3><p>Jeder PR an Milvus muss mit einem relevanten Issue verknüpft werden. Hier erfahren Sie, wie Sie das machen:</p>
<ul>
<li><p><strong>Prüfen Sie, ob es bereits Themen gibt:</strong> Schauen Sie im<a href="https://github.com/milvus-io/milvus/issues"> Milvus Issue Tracker</a> nach, ob es bereits einen Issue gibt, der mit Ihren Änderungen zu tun hat.</p></li>
<li><p><strong>Erstellen Sie eine neue Meldung:</strong> Wenn kein relevanter Issue existiert, eröffnen Sie einen neuen und erklären Sie das Problem, das Sie lösen oder die Funktion, die Sie hinzufügen.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Einreichen Ihres Codes</h3><ol>
<li><p><strong>Forken Sie das Repository:</strong> Beginnen Sie damit, das<a href="https://github.com/milvus-io/milvus"> Milvus-Repository</a> in Ihrem GitHub-Konto zu forken.</p></li>
<li><p><strong>Erstellen Sie einen Zweig:</strong> Klonen Sie Ihren Fork lokal und erstellen Sie einen neuen Branch für Ihre Änderungen.</p></li>
<li><p><strong>Commit mit Signed-off-by Signatur:</strong> Stellen Sie sicher, dass Ihre Commits eine <code translate="no">Signed-off-by</code> Signatur enthalten, um der Open-Source-Lizenzierung zu entsprechen:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Dieser Schritt bescheinigt, dass Ihr Beitrag mit dem Developer Certificate of Origin (DCO) übereinstimmt.</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Hilfreiche Ressourcen</strong></h4><p>Detaillierte Schritte und Best Practices finden Sie im<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvus Contribution Guide</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Gelegenheiten zum Beitragen<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Herzlichen Glückwunsch - Sie haben Milvus zum Laufen gebracht! Sie haben die Bereitstellungsmodi erkundet, Ihre Tests durchgeführt und sich vielleicht sogar in den Code vertieft. Jetzt ist es an der Zeit, sich weiterzuentwickeln: Tragen Sie zu <a href="https://github.com/milvus-io/milvus">Milvus</a> bei und gestalten Sie die Zukunft von KI und <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierten Daten</a> mit.</p>
<p>Unabhängig von Ihren Fähigkeiten gibt es einen Platz für Sie in der Milvus-Community! Egal, ob Sie ein Entwickler sind, der gerne komplexe Herausforderungen löst, ein technischer Redakteur, der gerne saubere Dokumentationen oder Technik-Blogs schreibt, oder ein Kubernetes-Enthusiast, der Bereitstellungen verbessern möchte - es gibt eine Möglichkeit für Sie, etwas zu bewirken.</p>
<p>Werfen Sie einen Blick auf die untenstehenden Möglichkeiten und finden Sie das Richtige für sich. Jeder Beitrag hilft, Milvus voranzubringen - und wer weiß? Ihr nächster Pull Request könnte die nächste Innovationswelle auslösen. Also, worauf warten Sie noch? Fangen wir an! 🚀</p>
<table>
<thead>
<tr><th>Projekte</th><th>Geeignet für</th><th>Richtlinien</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Go-Entwickler</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP-Entwickler</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Entwickler, die an anderen Sprachen interessiert sind</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Beitragen zu PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Kubernetes-Enthusiasten</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/Gemeinschaft/Blog</a></td><td>Technische Redakteure</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Beitrag zu milvus-docs</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-einblick</a></td><td>Web-Entwickler</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Ein letztes Wort<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus bietet verschiedene SDKs - <a href="https://milvus.io/docs/install-pymilvus.md">Python</a> (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a> und <a href="https://milvus.io/docs/install-node.md">Node.js -, die</a>den Einstieg in die Entwicklung erleichtern. Bei der Mitarbeit an Milvus geht es nicht nur um Code, sondern auch darum, sich einer lebendigen und innovativen Gemeinschaft anzuschließen.</p>
<p>🚀Willkommen in der Milvus-Entwickler-Community, und viel Spaß beim Programmieren! Wir können es kaum erwarten, zu sehen, was Sie erschaffen werden.</p>
<h2 id="Further-Reading" class="common-anchor-header">Weitere Informationen<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Treten Sie der Milvus-Gemeinschaft von KI-Entwicklern bei</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Was sind Vektordatenbanken und wie funktionieren sie?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Verteilt: Welcher Modus ist der richtige für Sie? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Erstellen von AI-Anwendungen mit Milvus: Tutorials &amp; Notebooks</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Leistungsstarke AI-Modelle für Ihre GenAI-Anwendungen | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Was ist RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Ressourcenzentrum für generative KI | Zilliz</a></p></li>
</ul>
