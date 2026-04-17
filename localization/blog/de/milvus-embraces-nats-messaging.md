---
id: milvus-embraces-nats-messaging.md
title: 'Optimierung der Datenkommunikation: Milvus setzt auf NATS Messaging'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Einführung in die Integration von NATS und Milvus, Untersuchung der
  Funktionen, des Einrichtungs- und Migrationsprozesses sowie der Ergebnisse von
  Leistungstests.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Im komplizierten Geflecht der Datenverarbeitung ist die nahtlose Kommunikation der Faden, der die Abläufe zusammenhält. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, die bahnbrechende <a href="https://zilliz.com/cloud">Open-Source-Vektordatenbank</a>, hat sich mit ihrer neuesten Funktion auf eine transformative Reise begeben: NATS-Messaging-Integration. In diesem umfassenden Blog-Beitrag werden wir die Feinheiten dieser Integration enträtseln und ihre Kernfunktionen, den Einrichtungsprozess, die Migrationsvorteile und den Vergleich mit ihrem Vorgänger RocksMQ untersuchen.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Die Rolle von Message Queues in Milvus verstehen<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In der Cloud-nativen Architektur von Milvus ist die Nachrichtenwarteschlange oder der Log Broker von zentraler Bedeutung. Sie ist das Rückgrat, das persistente Datenströme, Synchronisierung, Ereignisbenachrichtigungen und Datenintegrität bei Systemwiederherstellungen gewährleistet. Traditionell war RocksMQ die einfachste Wahl im Milvus-Standalone-Modus, insbesondere im Vergleich zu Pulsar und Kafka, aber seine Grenzen wurden bei umfangreichen Daten und komplexen Szenarien deutlich.</p>
<p>Mit Milvus 2.3 wird NATS eingeführt, eine Single-Node-MQ-Implementierung, die die Verwaltung von Datenströmen neu definiert. Im Gegensatz zu seinen Vorgängern befreit NATS die Milvus-Benutzer von Leistungseinschränkungen und bietet eine nahtlose Erfahrung bei der Verarbeitung großer Datenmengen.</p>
<h2 id="What-is-NATS" class="common-anchor-header">Was ist NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS ist eine verteilte Systemverbindungstechnologie, die in Go implementiert ist. Sie unterstützt verschiedene Kommunikationsmodi wie Request-Reply und Publish-Subscribe zwischen Systemen, bietet Datenpersistenz durch JetStream und verteilte Fähigkeiten durch eingebautes RAFT. Auf der <a href="https://nats.io/">offiziellen NATS-Website</a> finden Sie weitere Informationen zu NATS.</p>
<p>Im Milvus 2.3 Standalone-Modus bieten NATS, JetStream und PubSub Milvus robuste MQ-Funktionen.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Aktivieren von NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 bietet eine neue Steuerungsoption, <code translate="no">mq.type</code>, die es den Benutzern ermöglicht, die Art von MQ, die sie verwenden möchten, anzugeben. Um NATS zu aktivieren, setzen Sie <code translate="no">mq.type=natsmq</code>. Wenn Sie nach dem Starten von Milvus-Instanzen ähnliche Protokolle wie die unten stehenden sehen, haben Sie NATS als Nachrichtenwarteschlange erfolgreich aktiviert.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">NATS für Milvus konfigurieren<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Zu den NATS-Anpassungsoptionen gehören die Angabe des Listening Ports, des JetStream-Speicherverzeichnisses, der maximalen Nutzdatengröße und des Initialisierungs-Timeouts. Die Feinabstimmung dieser Einstellungen gewährleistet optimale Leistung und Zuverlässigkeit.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Anmerkung:</strong></p>
<ul>
<li><p>Sie müssen <code translate="no">server.port</code> für das Abhören des NATS-Servers angeben. Wenn es einen Portkonflikt gibt, kann Milvus nicht starten. Stellen Sie <code translate="no">server.port=-1</code> so ein, dass ein Port zufällig ausgewählt wird.</p></li>
<li><p><code translate="no">storeDir</code> gibt das Verzeichnis für die JetStream-Speicherung an. Wir empfehlen, das Verzeichnis auf einem leistungsstarken Solid-State-Laufwerk (SSD) zu speichern, um den Lese-/Schreibdurchsatz von Milvus zu verbessern.</p></li>
<li><p><code translate="no">maxFileStore</code> legt die Obergrenze für die JetStream-Speichergröße fest. Das Überschreiten dieser Grenze verhindert das weitere Schreiben von Daten.</p></li>
<li><p><code translate="no">maxPayload</code> begrenzt die Größe der einzelnen Nachrichten. Sie sollte über 5 MB liegen, um Schreibabweisungen zu vermeiden.</p></li>
<li><p><code translate="no">initializeTimeout</code>steuert die Zeitüberschreitung beim Start des NATS-Servers.</p></li>
<li><p><code translate="no">monitor</code> konfiguriert die unabhängigen Logs von NATS.</p></li>
<li><p><code translate="no">retention</code> steuert den Aufbewahrungsmechanismus von NATS-Nachrichten.</p></li>
</ul>
<p>Weitere Informationen finden Sie in der <a href="https://docs.nats.io/running-a-nats-service/configuration">offiziellen NATS-Dokumentation</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Umstellung von RocksMQ auf NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Migration von RocksMQ zu NATS ist ein nahtloser Prozess, der Schritte wie das Stoppen von Schreibvorgängen, das Flushen von Daten, das Ändern von Konfigurationen und das Überprüfen der Migration durch Milvus-Protokolle umfasst.</p>
<ol>
<li><p>Bevor Sie die Migration einleiten, stoppen Sie alle Schreibvorgänge in Milvus.</p></li>
<li><p>Führen Sie den Vorgang <code translate="no">FlushALL</code> in Milvus aus und warten Sie auf seinen Abschluss. Dieser Schritt stellt sicher, dass alle ausstehenden Daten geleert werden und das System zum Herunterfahren bereit ist.</p></li>
<li><p>Ändern Sie die Milvus-Konfigurationsdatei, indem Sie <code translate="no">mq.type=natsmq</code> einstellen und die relevanten Optionen im Abschnitt <code translate="no">natsmq</code> anpassen.</p></li>
<li><p>Starten Sie den Milvus 2.3.</p></li>
<li><p>Sichern und bereinigen Sie die Originaldaten, die im Verzeichnis <code translate="no">rocksmq.path</code> gespeichert sind. (Optional)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: Ein Leistungsvergleich<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pub/Sub-Leistungstest</h3><ul>
<li><p><strong>Testplattform:</strong> M1 Pro Chip / Speicher: 16GB</p></li>
<li><p><strong>Test-Szenario:</strong> Wiederholtes Abonnieren und Veröffentlichen von Zufallsdatenpaketen an ein Topic, bis das letzte veröffentlichte Ergebnis empfangen wird.</p></li>
<li><p><strong>Ergebnisse:</strong></p>
<ul>
<li><p>Bei kleineren Datenpaketen (&lt; 64kb) übertrifft RocksMQ NATS in Bezug auf Speicher, CPU und Reaktionsgeschwindigkeit.</p></li>
<li><p>Bei größeren Datenpaketen (&gt; 64kb) übertrifft NATS RocksMQ und bietet wesentlich schnellere Antwortzeiten.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Test Typ</th><th>MQ</th><th>Anzahl der Operationen</th><th>Kosten pro Operation</th><th>Kosten für Speicher</th><th>CPU-Gesamtzeit</th><th>Speicherkosten</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4,29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1,18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2,60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614,9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3,29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331,2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635,1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232,3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tabelle 1: Ergebnisse der Pub/Sub-Leistungstests</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus-Integrationstest</h3><p><strong>Datengröße:</strong> 100M</p>
<p><strong>Ergebnis:</strong> In umfangreichen Tests mit einem Datensatz von 100 Millionen Vektoren zeigte NATS eine geringere Vektorsuche und Abfragelatenz.</p>
<table>
<thead>
<tr><th>Metriken</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Durchschnittliche Vektorsuch-Latenzzeit</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Vektorsuchanfragen pro Sekunde (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Durchschnittliche Abfrage-Latenzzeit</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Abfrageanfragen pro Sekunde (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tabelle 2: Ergebnisse der Milvus-Integrationstests mit einem 100-Meter-Datensatz</p>
<p><strong>Datensatz: &lt;100M</strong></p>
<p><strong>Ergebnis:</strong> Für Datensätze kleiner als 100M zeigen NATS und RocksMQ eine ähnliche Leistung.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Schlussfolgerung: Verstärkung von Milvus mit NATS Messaging<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Integration von NATS in Milvus stellt einen bedeutenden Schritt in der Datenverarbeitung dar. Egal, ob Sie sich mit Echtzeitanalysen, Anwendungen für maschinelles Lernen oder anderen datenintensiven Projekten befassen, NATS unterstützt Ihre Projekte mit Effizienz, Zuverlässigkeit und Geschwindigkeit. Da sich die Datenlandschaft weiterentwickelt, gewährleistet ein robustes Messaging-System wie NATS innerhalb von Milvus eine nahtlose, zuverlässige und hochleistungsfähige Datenkommunikation.</p>
