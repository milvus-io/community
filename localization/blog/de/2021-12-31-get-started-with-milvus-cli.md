---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Erste Schritte mit Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: >-
  Dieser Artikel stellt die Milvus_CLI vor und hilft Ihnen bei der Erledigung
  gängiger Aufgaben.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>Im Zeitalter der Informationsexplosion produzieren wir laufend Sprache, Bilder, Videos und andere unstrukturierte Daten. Wie können wir diese riesigen Datenmengen effizient analysieren? Mit dem Aufkommen neuronaler Netze können unstrukturierte Daten als Vektoren eingebettet werden, und die Milvus-Datenbank ist eine grundlegende Datenservice-Software, die die Speicherung, Suche und Analyse von Vektordaten erleichtert.</p>
<p>Aber wie kann man die Milvus-Vektordatenbank schnell nutzen?</p>
<p>Einige Nutzer haben sich darüber beschwert, dass die APIs schwer zu erlernen sind, und hoffen, dass es einfache Befehlszeilen zur Bedienung der Milvus-Datenbank geben könnte.</p>
<p>Wir freuen uns, Milvus_CLI vorstellen zu können, ein Kommandozeilen-Tool für die Milvus-Vektordatenbank.</p>
<p>Milvus_CLI ist eine komfortable Datenbank-CLI für Milvus, die Datenbankverbindung, Datenimport, Datenexport und Vektorberechnung mit interaktiven Befehlen in Shells unterstützt. Die neueste Version von Milvus_CLI hat die folgenden Eigenschaften.</p>
<ul>
<li><p>Alle Plattformen werden unterstützt, einschließlich Windows, Mac und Linux</p></li>
<li><p>Online- und Offline-Installation mit pip unterstützt</p></li>
<li><p>Portabel, kann überall verwendet werden</p></li>
<li><p>Basiert auf dem Milvus SDK für Python</p></li>
<li><p>Hilfedokumente enthalten</p></li>
<li><p>Auto-Vervollständigung unterstützt</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Sie können Milvus_CLI entweder online oder offline installieren.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Milvus_CLI online installieren</h3><p>Führen Sie den folgenden Befehl aus, um Milvus_CLI online mit pip zu installieren. Python 3.8 oder höher ist erforderlich.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Milvus_CLI offline installieren</h3><p>Um Milvus_CLI offline zu installieren, <a href="https://github.com/milvus-io/milvus_cli/releases">laden Sie</a> zunächst den neuesten Tarball von der Release-Seite <a href="https://github.com/milvus-io/milvus_cli/releases">herunter</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Nachdem der Tarball heruntergeladen wurde, führen Sie den folgenden Befehl aus, um Milvus_CLI zu installieren.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Nachdem Milvus_CLI installiert ist, führen Sie <code translate="no">milvus_cli</code> aus. Die angezeigte Eingabeaufforderung <code translate="no">milvus_cli &gt;</code> zeigt an, dass die Befehlszeile bereit ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Wenn Sie einen Mac mit dem M1-Chip oder einen PC ohne Python-Umgebung verwenden, können Sie stattdessen eine portable Anwendung nutzen. <a href="https://github.com/milvus-io/milvus_cli/releases">Laden Sie</a> dazu eine Datei von der Veröffentlichungsseite <a href="https://github.com/milvus-io/milvus_cli/releases">herunter</a>, die Ihrem Betriebssystem entspricht, führen Sie <code translate="no">chmod +x</code> aus, um die Datei ausführbar zu machen, und führen Sie <code translate="no">./</code> aus, um sie zu starten.</p>
<h4 id="Example" class="common-anchor-header"><strong>Beispiel</strong></h4><p>Das folgende Beispiel macht <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> ausführbar und führt es aus.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Verwendung<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Verbindung zu Milvus herstellen</h3><p>Bevor Sie eine Verbindung zu Milvus herstellen, stellen Sie sicher, dass Milvus auf Ihrem Server installiert ist. Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Installieren von Milvus Standalone</a> oder <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Installieren von Milvus Cluster</a>.</p>
<p>Wenn Milvus auf Ihrem localhost mit dem Standardport installiert ist, führen Sie <code translate="no">connect</code> aus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Andernfalls führen Sie den folgenden Befehl mit der IP-Adresse Ihres Milvus-Servers aus. Im folgenden Beispiel wird <code translate="no">172.16.20.3</code> als IP-Adresse und <code translate="no">19530</code> als Portnummer verwendet.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Eine Sammlung erstellen</h3><p>In diesem Abschnitt wird beschrieben, wie Sie eine Sammlung erstellen.</p>
<p>Eine Sammlung besteht aus Entitäten und ist vergleichbar mit einer Tabelle in einem RDBMS. Siehe <a href="https://milvus.io/docs/v2.0.x/glossary.md">Glossar</a> für weitere Informationen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Beispiel</h4><p>Im folgenden Beispiel wird eine Sammlung mit dem Namen <code translate="no">car</code> erstellt. Die Sammlung <code translate="no">car</code> hat vier Felder, nämlich <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code> und <code translate="no">brand</code>. Das Primärschlüsselfeld ist <code translate="no">id</code>. Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">Sammlung erstellen</a>.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Sammlungen auflisten</h3><p>Führen Sie den folgenden Befehl aus, um alle Sammlungen in dieser Milvus-Instanz aufzulisten.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Führen Sie den folgenden Befehl aus, um die Details der Sammlung <code translate="no">car</code> zu überprüfen.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Berechne den Abstand zwischen zwei Vektoren</h3><p>Führen Sie den folgenden Befehl aus, um Daten in die Sammlung <code translate="no">car</code> zu importieren.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Führen Sie <code translate="no">query</code> aus und geben Sie <code translate="no">car</code> als Sammlungsnamen und <code translate="no">id&gt;0</code> als Abfrageausdruck ein, wenn Sie dazu aufgefordert werden. Die IDs der Entitäten, die die Kriterien erfüllen, werden zurückgegeben, wie in der folgenden Abbildung gezeigt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Führen Sie <code translate="no">calc</code> aus und geben Sie die entsprechenden Werte ein, wenn Sie dazu aufgefordert werden, um die Abstände zwischen den Vektorarrays zu berechnen.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Löschen einer Sammlung</h3><p>Führen Sie den folgenden Befehl aus, um die Sammlung <code translate="no">car</code> zu löschen.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Mehr<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI ist nicht auf die oben genannten Funktionen beschränkt. Führen Sie <code translate="no">help</code> aus, um alle Befehle, die Milvus_CLI enthält, und die entsprechenden Beschreibungen anzuzeigen. Führen Sie <code translate="no">&lt;command&gt; --help</code> aus, um die Details eines bestimmten Befehls anzuzeigen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Siehe auch:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLI Befehlsreferenz</a> unter Milvus Docs</p>
<p>Wir hoffen, dass Milvus_CLI Ihnen helfen konnte, die Milvus-Vektordatenbank einfach zu nutzen. Wir werden Milvus_CLI weiter optimieren und Ihre Beiträge sind willkommen.</p>
<p>Wenn Sie Fragen haben, können Sie gerne <a href="https://github.com/zilliztech/milvus_cli/issues">einen Fehler</a> auf GitHub <a href="https://github.com/zilliztech/milvus_cli/issues">melden</a>.</p>
