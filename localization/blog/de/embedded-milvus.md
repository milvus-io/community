---
id: embedded-milvus.md
title: >-
  Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von
  Milvus mit Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Eine benutzerfreundliche Python-Version von Milvus, die die Installation
  flexibler macht.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Titelseite</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde gemeinsam von <a href="https://github.com/soothing-rain/">Alex Gao</a> und <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> verfasst.</p>
</blockquote>
<p>Milvus ist eine Open-Source-Vektordatenbank für KI-Anwendungen. Sie bietet eine Vielzahl von Installationsmethoden, einschließlich der Erstellung aus dem Quellcode und der Installation von Milvus mit Docker Compose/Helm/APT/YUM/Ansible. Die Benutzer können je nach Betriebssystem und Vorlieben eine der Installationsmethoden wählen. Es gibt jedoch viele Datenwissenschaftler und KI-Ingenieure in der Milvus-Community, die mit Python arbeiten und sich nach einer viel einfacheren Installationsmethode als den derzeit verfügbaren sehnen.</p>
<p>Daher haben wir zusammen mit Milvus 2.1 embedded Milvus, eine benutzerfreundliche Python-Version, veröffentlicht, um mehr Python-Entwickler in unserer Community zu unterstützen. In diesem Artikel wird erklärt, was embedded Milvus ist, und es wird beschrieben, wie man es installiert und benutzt.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Ein Überblick über embedded Milvus</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Wann sollte man embedded Milvus verwenden?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Ein Vergleich der verschiedenen Modi von Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Wie installiert man embedded Milvus?</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Starten und Beenden von embedded Milvus</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Ein Überblick über embedded Milvus<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Embedded Milvus</a> ermöglicht es Ihnen, Milvus mit Python schnell zu installieren und zu verwenden. Es kann schnell eine Milvus-Instanz einrichten und erlaubt Ihnen, den Milvus-Dienst zu starten und zu stoppen, wann immer Sie es wünschen. Alle Daten und Protokolle bleiben erhalten, auch wenn Sie das eingebettete Milvus beenden.</p>
<p>Eingebettetes Milvus selbst hat keine internen Abhängigkeiten und erfordert keine Vorinstallation und Ausführung von Drittanbieter-Abhängigkeiten wie etcd, MinIO, Pulsar usw.</p>
<p>Alles, was Sie mit eingebettetem Milvus tun, und jedes Stück Code, das Sie dafür schreiben, kann sicher in andere Milvus-Modi migriert werden - Standalone, Cluster, Cloud-Version usw. Dies spiegelt eine der markantesten Eigenschaften von embedded Milvus wider - <strong>"Write once, run anywhere".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Wann sollte man embedded Milvus verwenden?</h3><p>Embedded Milvus und <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> sind für unterschiedliche Zwecke konzipiert. In den folgenden Szenarien können Sie sich für Embedded Milvus entscheiden:</p>
<ul>
<li><p>Sie möchten Milvus verwenden, ohne Milvus auf eine der <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">hier</a> beschriebenen Arten zu installieren.</p></li>
<li><p>Sie möchten Milvus verwenden, ohne einen langlaufenden Milvus-Prozess in Ihrem Rechner zu haben.</p></li>
<li><p>Sie wollen Milvus schnell nutzen, ohne einen separaten Milvus-Prozess und andere benötigte Komponenten wie etcd, MinIO, Pulsar, etc. zu starten.</p></li>
</ul>
<p>Es wird empfohlen, dass Sie eingebettetes Milvus <strong>NICHT</strong> verwenden sollten:</p>
<ul>
<li><p>In einer Produktionsumgebung.<em>(Um Milvus für die Produktion zu verwenden, sollten Sie einen Milvus-Cluster oder <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, einen vollständig verwalteten Milvus-Dienst, in Betracht ziehen</em>).</p></li>
<li><p>Wenn Sie einen hohen Bedarf an Leistung haben.<em>(Im Vergleich dazu bietet eingebettetes Milvus möglicherweise nicht die beste Leistung</em>).</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Ein Vergleich der verschiedenen Milvus-Modi</h3><p>In der folgenden Tabelle werden verschiedene Milvus-Modi miteinander verglichen: Standalone, Cluster, Embedded Milvus und die Zilliz Cloud, ein vollständig verwalteter Milvus-Dienst.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>Vergleich</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Wie installiert man embedded Milvus?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor Sie embedded Milvus installieren, müssen Sie sicherstellen, dass Sie Python 3.6 oder höher installiert haben. Embedded Milvus unterstützt die folgenden Betriebssysteme:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Wenn die Anforderungen erfüllt sind, können Sie <code translate="no">$ python3 -m pip install milvus</code> ausführen, um embedded Milvus zu installieren. Sie können auch die Version in den Befehl einfügen, um eine bestimmte Version von embedded Milvus zu installieren. Wenn Sie zum Beispiel die Version 2.1.0 installieren möchten, führen Sie <code translate="no">$ python3 -m pip install milvus==2.1.0</code> aus. Und wenn später eine neue Version von embedded Milvus veröffentlicht wird, können Sie auch <code translate="no">$ python3 -m pip install --upgrade milvus</code> ausführen, um embedded Milvus auf die neueste Version zu aktualisieren.</p>
<p>Wenn Sie ein alter Milvus-Benutzer sind, der bereits PyMilvus installiert hat und nun embedded Milvus installieren möchte, können Sie <code translate="no">$ python3 -m pip install --no-deps milvus</code> ausführen.</p>
<p>Nachdem Sie den Installationsbefehl ausgeführt haben, müssen Sie einen Datenordner für embedded Milvus unter <code translate="no">/var/bin/e-milvus</code> erstellen, indem Sie den folgenden Befehl ausführen:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Start und Stopp von embedded Milvus<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn die Installation erfolgreich abgeschlossen ist, können Sie den Dienst starten.</p>
<p>Wenn Sie embedded Milvus zum ersten Mal starten, müssen Sie Milvus zunächst importieren und embedded Milvus einrichten.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie embedded Milvus schon einmal erfolgreich gestartet haben und zurückkommen, um es neu zu starten, können Sie <code translate="no">milvus.start()</code> direkt nach dem Import von Milvus ausführen.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie den eingebetteten Milvus-Dienst erfolgreich gestartet haben, sehen Sie die folgende Ausgabe.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Nachdem der Dienst gestartet ist, können Sie ein weiteres Terminalfenster öffnen und den Beispielcode von &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; ausführen, um mit dem eingebetteten Milvus herumzuspielen!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie mit der Verwendung von embedded Milvus fertig sind, empfehlen wir, den Dienst zu beenden und die Umgebungsvariablen zu bereinigen, indem Sie den folgenden Befehl ausführen oder Strg-D drücken.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der offiziellen Veröffentlichung von Milvus 2.1 haben wir eine Reihe von Blogs vorbereitet, in denen die neuen Funktionen vorgestellt werden. Lesen Sie mehr in dieser Blogserie:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Wie Sie String-Daten für Ihre Anwendungen zur Ähnlichkeitssuche nutzen können</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von Milvus mit Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Erhöhen Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis der Konsistenzstufe in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
