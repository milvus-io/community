---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Verständnis der Konsistenzebene in der Milvus-Vektordatenbank - Teil II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Eine Anatomie des Mechanismus hinter den abstimmbaren Konsistenzstufen in der
  Milvus-Vektordatenbank.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_Bild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/longjiquan">Jiquan Long</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgeschrieben.</p>
</blockquote>
<p>Im <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">vorherigen Blog</a> über Konsistenz haben wir erklärt, was Konsistenz in einer verteilten Vektordatenbank bedeutet, die vier Konsistenzstufen - strong, bounded staleness, session und eventual - behandelt, die in der Milvus-Vektordatenbank unterstützt werden, und das am besten geeignete Anwendungsszenario für jede Konsistenzstufe erläutert.</p>
<p>In diesem Beitrag werden wir weiterhin den Mechanismus untersuchen, der es den Benutzern der Milvus-Vektordatenbank ermöglicht, flexibel die ideale Konsistenzstufe für verschiedene Anwendungsszenarien zu wählen. Wir werden auch eine grundlegende Anleitung zur Einstellung der Konsistenzstufe in der Milvus-Vektordatenbank geben.</p>
<p><strong>Sprung zu:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">Der zugrunde liegende Zeittick-Mechanismus</a></li>
<li><a href="#Guarantee-timestamp">Garantierter Zeitstempel</a></li>
<li><a href="#Consistency-levels">Konsistenzstufen</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Wie stellt man den Konsistenzgrad in Milvus ein?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">Der zugrunde liegende Zeittick-Mechanismus<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus verwendet den Time-Tick-Mechanismus, um bei einer Vektorsuche oder -abfrage verschiedene Konsistenzniveaus zu gewährleisten. Time Tick ist das Wasserzeichen von Milvus, das wie eine Uhr in Milvus funktioniert und anzeigt, zu welchem Zeitpunkt sich das Milvus-System befindet. Jedes Mal, wenn eine DML-Anfrage (Data Manipulation Language) an die Milvus-Vektordatenbank gesendet wird, weist sie der Anfrage einen Zeitstempel zu. Wie in der nachstehenden Abbildung gezeigt, markiert Milvus nicht nur die eingefügten Daten mit einem Zeitstempel, sondern fügt auch in regelmäßigen Abständen Zeitmarken ein, wenn beispielsweise neue Daten in die Nachrichtenwarteschlange eingefügt werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>Zeitstempel</span> </span></p>
<p>Nehmen wir <code translate="no">syncTs1</code> in der obigen Abbildung als Beispiel. Wenn nachgeschaltete Verbraucher wie Abfrageknoten <code translate="no">syncTs1</code> sehen, verstehen die Verbraucherkomponenten, dass alle Daten, die vor <code translate="no">syncTs1</code> eingefügt wurden, verbraucht wurden. Mit anderen Worten, die Dateneinfügeanforderungen, deren Zeitstempelwerte kleiner als <code translate="no">syncTs1</code> sind, erscheinen nicht mehr in der Nachrichtenwarteschlange.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Garantie des Zeitstempels<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie im vorigen Abschnitt erwähnt, erhalten nachgelagerte Verbraucherkomponenten wie Abfrageknoten kontinuierlich Nachrichten über Dateneinfügeanforderungen und Zeitstempel aus der Nachrichtenwarteschlange. Jedes Mal, wenn ein Zeitstempel verbraucht wird, markiert der Abfrageknoten diesen verbrauchten Zeitstempel als nutzbare Zeit - <code translate="no">ServiceTime</code> und alle vor <code translate="no">ServiceTime</code> eingefügten Daten sind für den Abfrageknoten sichtbar.</p>
<p>Zusätzlich zu <code translate="no">ServiceTime</code> verwendet Milvus auch eine Art von Zeitstempel - Garantiezeitstempel (<code translate="no">GuaranteeTS</code>), um den Bedarf an verschiedenen Konsistenz- und Verfügbarkeitsniveaus für verschiedene Benutzer zu erfüllen. Dies bedeutet, dass die Benutzer der Milvus-Vektordatenbank <code translate="no">GuaranteeTs</code> angeben können, um den Abfrageknoten mitzuteilen, dass alle Daten vor <code translate="no">GuaranteeTs</code> sichtbar und beteiligt sein sollten, wenn eine Suche oder Abfrage durchgeführt wird.</p>
<p>Es gibt normalerweise zwei Szenarien, wenn der Abfrageknoten eine Suchanfrage in der Milvus-Vektordatenbank ausführt.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Szenario 1: Sofortige Ausführung der Suchanfrage</h3><p>Wenn <code translate="no">GuaranteeTs</code> kleiner als <code translate="no">ServiceTime</code> ist, kann der Abfrageknoten die Suchanfrage sofort ausführen, wie in der folgenden Abbildung gezeigt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>ausführen_unmittelbar</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Szenario 2: Warten bis "ServiceTime &gt; GuaranteeTs"</h3><p>Wenn <code translate="no">GuaranteeTs</code> größer ist als <code translate="no">ServiceTime</code>, müssen Abfrageknoten weiterhin Zeitticks aus der Nachrichtenwarteschlange verbrauchen. Suchanfragen können erst ausgeführt werden, wenn <code translate="no">ServiceTime</code> größer als <code translate="no">GuaranteeTs</code> ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Konsistenzstufen<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Daher ist <code translate="no">GuaranteeTs</code> in der Suchanfrage konfigurierbar, um die von Ihnen angegebene Konsistenzstufe zu erreichen. Ein <code translate="no">GuaranteeTs</code> mit einem großen Wert gewährleistet <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">starke Konsistenz</a> auf Kosten einer hohen Suchlatenz. Ein <code translate="no">GuaranteeTs</code> mit einem kleinen Wert verringert die Suchlatenz, aber die Sichtbarkeit der Daten ist beeinträchtigt.</p>
<p><code translate="no">GuaranteeTs</code> in Milvus ist ein hybrides Zeitstempelformat. Und der Benutzer hat keine Ahnung von der <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> innerhalb von Milvus. Daher ist die Angabe des Wertes von<code translate="no">GuaranteeTs</code> eine viel zu komplizierte Aufgabe für die Benutzer. Um den Benutzern die Mühe zu ersparen und eine optimale Benutzererfahrung zu bieten, verlangt Milvus von den Benutzern nur, dass sie die spezifische Konsistenzstufe wählen, und die Milvus-Vektordatenbank wird den Wert <code translate="no">GuaranteeTs</code> automatisch für die Benutzer verarbeiten. Das heißt, dass der Milvus-Benutzer nur eine der vier Konsistenzstufen auswählen muss: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, und <code translate="no">Eventually</code>. Und jede der Konsistenzstufen entspricht einem bestimmten <code translate="no">GuaranteeTs</code> Wert.</p>
<p>Die folgende Abbildung zeigt die <code translate="no">GuaranteeTs</code> für jede der vier Konsistenzstufen in der Milvus-Vektordatenbank.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>garantie_ts</span> </span></p>
<p>Die Milvus-Vektordatenbank unterstützt vier Konsistenzstufen:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> ist auf denselben Wert wie der letzte Systemzeitstempel gesetzt, und Abfrageknoten warten, bis die Servicezeit auf den letzten Systemzeitstempel übergeht, um die Such- oder Abfrageanfrage zu bearbeiten.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> wird auf einen Wert gesetzt, der unwesentlich kleiner als der letzte Systemzeitstempel ist, um die Konsistenzprüfung zu überspringen. Abfrageknoten suchen sofort in der vorhandenen Datenansicht.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> wird auf einen Wert gesetzt, der relativ kleiner als der letzte Systemzeitstempel ist, und Abfrageknoten suchen in einer tolerierbar weniger aktualisierten Datenansicht.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: Der Client verwendet den Zeitstempel des letzten Schreibvorgangs als <code translate="no">GuaranteeTs</code>, so dass jeder Client zumindest die von ihm selbst eingefügten Daten abrufen kann.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Wie kann man den Konsistenzgrad in Milvus einstellen?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt die Einstellung des Konsistenzniveaus bei der <a href="https://milvus.io/docs/v2.1.x/create_collection.md">Erstellung einer Sammlung</a> oder bei der Durchführung einer <a href="https://milvus.io/docs/v2.1.x/search.md">Suche</a> oder <a href="https://milvus.io/docs/v2.1.x/query.md">Abfrage</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Durchführen einer vektoriellen Ähnlichkeitssuche</h3><p>Um eine Vektorgleichheitssuche mit dem gewünschten Konsistenzniveau durchzuführen, setzen Sie einfach den Wert für den Parameter <code translate="no">consistency_level</code> entweder auf <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code> oder <code translate="no">Eventually</code>. Wenn Sie den Wert für den Parameter <code translate="no">consistency_level</code> nicht setzen, ist das Konsistenzniveau standardmäßig <code translate="no">Bounded</code>. Das Beispiel führt eine Vektorähnlichkeitssuche mit der Konsistenz <code translate="no">Strong</code> durch.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Durchführen einer Vektorabfrage</h3><p>Ähnlich wie bei der Durchführung einer Vektorähnlichkeitssuche können Sie bei der Durchführung einer Vektorabfrage den Wert für den Parameter <code translate="no">consistency_level</code> angeben. Das Beispiel führt eine Vektorabfrage mit der Konsistenz <code translate="no">Strong</code> durch.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
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
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
