---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: >-
  Hören Sie auf, Vanilla RAG zu bauen: Setzen Sie auf Agentic RAG mit
  DeepSearcher
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">Die Umstellung auf KI-gestützte Suche mit LLMs und Deep Research<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Entwicklung der Suchtechnologie hat im Laufe der Jahrzehnte dramatische Fortschritte gemacht - von der schlagwortbasierten Suche in den Jahren vor 2000 bis zu personalisierten Sucherlebnissen in den 2010er Jahren. Wir erleben das Aufkommen von KI-gestützten Lösungen, die in der Lage sind, komplexe Suchanfragen zu bearbeiten, die eine eingehende, professionelle Analyse erfordern.</p>
<p>Deep Research von OpenAI ist ein Beispiel für diesen Wandel. Es nutzt logische Fähigkeiten, um große Mengen an Informationen zu synthetisieren und mehrstufige Forschungsberichte zu erstellen. Wenn man beispielsweise fragt: "Wie hoch ist die Marktkapitalisierung von Tesla? Deep Research ist in der Lage, die Unternehmensfinanzen, die Wachstumsentwicklung des Unternehmens und den geschätzten Marktwert umfassend zu analysieren.</p>
<p>Deep Research implementiert eine fortgeschrittene Form des RAG-Frameworks (Retrieval-Augmented Generation) in seinem Kern. Traditionelles RAG verbessert die Ergebnisse von Sprachmodellen, indem es relevante externe Informationen abruft und einbezieht. Der Ansatz von OpenAI geht noch weiter, indem er iterative Abruf- und Schlussfolgerungszyklen implementiert. Anstelle eines einzigen Abrufschritts generiert Deep Research dynamisch mehrere Abfragen, wertet Zwischenergebnisse aus und verfeinert seine Suchstrategie. Dies zeigt, wie fortschrittliche oder agentenbasierte RAG-Techniken qualitativ hochwertige Inhalte auf Unternehmensebene liefern können, die sich eher wie professionelle Forschung anfühlen als wie die Beantwortung einfacher Fragen.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Eine lokale Tiefensuche, die Agentic RAG für jedermann zugänglich macht<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Inspiriert von diesen Fortschritten haben Entwickler weltweit ihre eigenen Implementierungen geschaffen. Zilliz-Ingenieure haben das <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher-Projekt</a> entwickelt und veröffentlicht, das als lokales und quelloffenes Deep Research betrachtet werden kann. Dieses Projekt hat in weniger als einem Monat über 4.900 GitHub-Sterne erhalten.</p>
<p>DeepSearcher definiert die KI-gestützte Unternehmenssuche neu, indem es die Leistung fortschrittlicher Schlussfolgerungsmodelle, ausgefeilter Suchfunktionen und eines integrierten Rechercheassistenten kombiniert. Durch die Integration lokaler Daten über <a href="https://milvus.io/docs/overview.md">Milvus</a> (eine leistungsstarke und quelloffene Vektordatenbank) liefert DeepSearcher schnellere und relevantere Ergebnisse und ermöglicht es den Nutzern, die Kernmodelle für ein individuelles Erlebnis einfach auszutauschen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 1:</em> <em>DeepSearcher's Sternengeschichte (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Quelle</em></a><em>)</em></p>
<p>In diesem Artikel werden wir die Entwicklung vom traditionellen RAG zum agentenbasierten RAG untersuchen und herausfinden, was diese Ansätze auf technischer Ebene unterscheidet. Anschließend wird die DeepSearcher-Implementierung besprochen und gezeigt, wie sie intelligente Agentenfähigkeiten nutzt, um dynamisches Multi-Turn-Reasoning zu ermöglichen - und warum dies für Entwickler wichtig ist, die Suchlösungen auf Unternehmensebene entwickeln.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">Vom traditionellen RAG zum agentenbasierten RAG: Die Macht des iterativen Reasonings<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG erweitert das traditionelle RAG-Framework durch die Einbeziehung intelligenter Agentenfunktionen. DeepSearcher ist ein Paradebeispiel für ein agentenbasiertes RAG-Framework. Durch dynamische Planung, mehrstufige Argumentation und autonome Entscheidungsfindung wird ein geschlossener Kreislauf geschaffen, der Daten abruft, verarbeitet, validiert und optimiert, um komplexe Probleme zu lösen.</p>
<p>Die wachsende Beliebtheit der agentenbasierten RAG ist auf die erheblichen Fortschritte bei den Argumentationsfähigkeiten von Large Language Models (LLM) zurückzuführen, insbesondere auf deren verbesserte Fähigkeit, komplexe Probleme aufzuschlüsseln und kohärente Denkketten über mehrere Schritte hinweg aufrechtzuerhalten.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Vergleich Dimension</strong></td><td><strong>Traditionelle RAG</strong></td><td><strong>Agentische RAG</strong></td></tr>
<tr><td>Kern-Ansatz</td><td>Passiv und reaktiv</td><td>Proaktiv, agentengesteuert</td></tr>
<tr><td>Prozessablauf</td><td>Einschrittiges Abrufen und Generieren (einmaliger Prozess)</td><td>Dynamische, mehrstufige Abfrage und Generierung (iterative Verfeinerung)</td></tr>
<tr><td>Abruf-Strategie</td><td>Feste Stichwortsuche, abhängig von der ursprünglichen Anfrage</td><td>Adaptive Abfrage (z. B. Verfeinerung der Schlüsselwörter, Wechsel der Datenquelle)</td></tr>
<tr><td>Handhabung komplexer Abfragen</td><td>Direkte Generierung; anfällig für Fehler bei widersprüchlichen Daten</td><td>Aufgabenzerlegung → gezielte Abfrage → Antwortsynthese</td></tr>
<tr><td>Fähigkeit zur Interaktion</td><td>Verlässt sich vollständig auf Benutzereingaben; keine Autonomie</td><td>Proaktives Engagement (z. B. Klärung von Unklarheiten, Nachfragen nach Details)</td></tr>
<tr><td>Fehlerkorrektur &amp; Feedback</td><td>Keine Selbstkorrektur; begrenzt durch erste Ergebnisse</td><td>Iterative Validierung → selbstausgelöste erneute Abfrage für Genauigkeit</td></tr>
<tr><td>Ideale Anwendungsfälle</td><td>Einfache Fragen und Antworten, Nachschlagen von Sachverhalten</td><td>Komplexe Argumentation, mehrstufige Problemlösung, offene Aufgaben</td></tr>
<tr><td>Beispiel</td><td>Ein Benutzer fragt: "Was ist Quantencomputing?" → System gibt eine Definition aus dem Lehrbuch zurück</td><td>Der Benutzer fragt: "Wie kann Quantencomputing die Logistik optimieren?" → Das System ruft Quantenprinzipien und Logistikalgorithmen ab und stellt dann umsetzbare Erkenntnisse zusammen.</td></tr>
</tbody>
</table>
<p>Im Gegensatz zur traditionellen RAG, die sich auf eine einzige, abfragebasierte Abfrage stützt, zerlegt die agentenbasierte RAG eine Abfrage in mehrere Teilfragen und verfeinert ihre Suche iterativ, bis sie eine zufriedenstellende Antwort findet. Diese Entwicklung bietet drei Hauptvorteile:</p>
<ul>
<li><p><strong>Proaktives Lösen von Problemen:</strong> Das System geht vom passiven Reagieren zum aktiven Lösen von Problemen über.</p></li>
<li><p><strong>Dynamische, mehrstufige Abfrage:</strong> Anstatt eine einmalige Suche durchzuführen, passt das System seine Abfragen kontinuierlich an und korrigiert sich selbst auf der Grundlage der laufenden Rückmeldungen.</p></li>
<li><p><strong>Breitere Anwendbarkeit:</strong> Das System geht über eine einfache Faktenüberprüfung hinaus und kann auch komplexe Schlussfolgerungen ziehen und umfassende Berichte erstellen.</p></li>
</ul>
<p>Durch die Nutzung dieser Fähigkeiten arbeiten Agentic RAG-Anwendungen wie DeepSearcher ähnlich wie ein menschlicher Experte - sie liefern nicht nur die endgültige Antwort, sondern auch eine vollständige, transparente Aufschlüsselung des Argumentationsprozesses und der Ausführungsdetails.</p>
<p>Langfristig wird die agentenbasierte RAG die herkömmlichen RAG-Systeme überholen. Herkömmliche Ansätze haben oft Schwierigkeiten, die den Benutzeranfragen zugrunde liegende Logik zu erfassen, die iterative Schlussfolgerungen, Reflexion und kontinuierliche Optimierung erfordert.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Wie sieht eine agentenbasierte RAG-Architektur aus? DeepSearcher als Beispiel<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun die Leistungsfähigkeit von agentenbasierten RAG-Systemen verstanden haben, wie sieht ihre Architektur aus? Nehmen wir DeepSearcher als Beispiel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 2: Zwei Module innerhalb von DeepSearcher</em></p>
<p>Die Architektur von DeepSearcher besteht aus zwei Hauptmodulen:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Modul für die Datenaufnahme</h3><p>Dieses Modul verbindet verschiedene proprietäre Datenquellen von Drittanbietern über eine Milvus-Vektor-Datenbank. Es ist besonders wertvoll für Unternehmensumgebungen, die auf proprietäre Datensätze angewiesen sind. Das Modul verarbeitet:</p>
<ul>
<li><p>Parsing und Chunking von Dokumenten</p></li>
<li><p>Erzeugung von Einbettungen</p></li>
<li><p>Vektorspeicherung und Indizierung</p></li>
<li><p>Verwaltung von Metadaten für effizientes Auffinden</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Online Reasoning und Abfragemodul</h3><p>Diese Komponente implementiert verschiedene Agentenstrategien innerhalb des RAG-Rahmens, um präzise, aufschlussreiche Antworten zu liefern. Sie arbeitet in einer dynamischen, iterativen Schleife - nach jeder Datenabfrage überlegt das System, ob die gesammelten Informationen die ursprüngliche Anfrage ausreichend beantworten. Wenn nicht, wird eine weitere Iteration ausgelöst; wenn ja, wird der Abschlussbericht erstellt.</p>
<p>Dieser fortlaufende Zyklus von "Follow-up" und "Reflexion" stellt eine grundlegende Verbesserung gegenüber anderen grundlegenden RAG-Ansätzen dar. Während herkömmliche RAGs einen einmaligen Abfrage- und Generierungsprozess durchführen, spiegelt der iterative Ansatz von DeepSearcher die Arbeitsweise menschlicher Forscher wider: Sie stellen die ersten Fragen, werten die erhaltenen Informationen aus, identifizieren Lücken und verfolgen neue Forschungsansätze.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Wie effektiv ist DeepSearcher, und für welche Anwendungsfälle ist es am besten geeignet?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Nach der Installation und Konfiguration indiziert DeepSearcher Ihre lokalen Dateien über die Milvus-Vektor-Datenbank. Wenn Sie eine Abfrage stellen, führt er eine umfassende, tiefgehende Suche in diesem indizierten Inhalt durch. Ein entscheidender Vorteil für Entwickler ist, dass das System jeden Schritt seines Such- und Schlussfolgerungsprozesses protokolliert und damit transparent macht, wie es zu seinen Schlussfolgerungen gekommen ist - eine wichtige Funktion für das Debugging und die Optimierung von RAG-Systemen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 3: Beschleunigte Wiedergabe einer DeepSearcher-Iteration</em></p>
<p>Dieser Ansatz verbraucht mehr Rechenressourcen als herkömmliche RAG, liefert aber bessere Ergebnisse bei komplexen Abfragen. Diskutieren wir zwei spezifische Anwendungsfälle, für die DeepSearcher am besten geeignet ist.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Überblicksartige Abfragen</h3><p>Übersichtsabfragen - wie das Erstellen von Berichten, das Verfassen von Dokumenten oder das Zusammenfassen von Trends - liefern ein kurzes Thema, erfordern aber eine ausführliche, detaillierte Ausgabe.</p>
<p>Bei der Abfrage &quot;Wie haben sich die Simpsons im Laufe der Zeit verändert?&quot; erzeugt DeepSearcher zunächst eine Reihe von Unterabfragen:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Er ruft relevante Informationen ab und verfeinert dann mit Hilfe von Feedback seine Suche, indem er die nächsten Unterabfragen generiert:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Jede Iteration baut auf der vorherigen auf und gipfelt in einem umfassenden Bericht, der mehrere Facetten des Themas abdeckt und mit Abschnitten wie diesen strukturiert ist:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Der Kürze halber werden nur Auszüge aus dem Prozess und dem Abschlussbericht gezeigt)</em></p>
<p>Der Abschlussbericht enthält eine gründliche Analyse mit korrekten Zitaten und einer strukturierten Gliederung.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Komplexe begründete Abfragen</h3><p>Komplexe Abfragen umfassen mehrere Logikebenen und miteinander verbundene Einheiten.</p>
<p>Betrachten Sie die Abfrage: "Welcher Film hat den älteren Regisseur, God's Gift To Women oder Aldri annet enn bråk?"</p>
<p>Während dies einem Menschen einfach erscheinen mag, haben einfache RAG-Systeme damit Schwierigkeiten, weil die Antwort nicht direkt in der Wissensbasis gespeichert ist. DeepSearcher geht diese Herausforderung an, indem es die Anfrage in kleinere Teilfragen zerlegt:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Zunächst werden Informationen über die Regisseure der beiden Filme abgerufen,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>generiert dann Unterabfragen:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Dann extrahiert es deren Geburtsdaten und vergleicht sie schließlich, um die richtige Antwort zu ermitteln:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>Im Gegensatz dazu könnte ein herkömmliches RAG-System aufgrund der begrenzten Abfrage in einem einzigen Durchgang wichtige Details übersehen, was möglicherweise zu <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">halluzinierten</a> oder ungenauen Antworten führt:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher zeichnet sich dadurch aus, dass es tiefe, iterative Suchen auf importierten lokalen Daten durchführt. Er protokolliert jeden Schritt seines Schlussfolgerungsprozesses und liefert schließlich einen umfassenden und einheitlichen Bericht. Dies macht ihn besonders effektiv für übersichtliche Abfragen, wie z. B. die Erstellung detaillierter Berichte oder die Zusammenfassung von Trends, und für komplexe Schlussfolgerungsabfragen, bei denen eine Frage in kleinere Unterfragen zerlegt und Daten über mehrere Feedbackschleifen aggregiert werden müssen.</p>
<p>Im nächsten Abschnitt werden wir DeepSearcher mit anderen RAG-Systemen vergleichen und untersuchen, wie sein iterativer Ansatz und seine flexible Modellintegration im Vergleich zu traditionellen Methoden abschneiden.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Quantitativer Vergleich: DeepSearcher vs. traditionelle RAG<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Im DeepSearcher-GitHub-Repository haben wir Code für quantitative Tests zur Verfügung gestellt. Für diese Analyse haben wir den beliebten 2WikiMultiHopQA-Datensatz verwendet. (Hinweis: Wir haben nur die ersten 50 Einträge ausgewertet, um den Verbrauch von API-Token zu verwalten, aber die allgemeinen Trends bleiben deutlich).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Vergleich der Wiederfindungsrate</h3><p>Wie in Abbildung 4 dargestellt, verbessert sich die Wiederfindungsrate erheblich, wenn die Anzahl der maximalen Iterationen steigt:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 4: Maximale Iterationen vs. Wiederfindungsrate</em></p>
<p>Ab einem bestimmten Punkt nehmen die marginalen Verbesserungen ab, weshalb wir in der Regel den Standardwert auf 3 Iterationen festlegen, der jedoch je nach den spezifischen Anforderungen angepasst werden kann.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Analyse des Token-Verbrauchs</h3><p>Wir haben auch den gesamten Token-Verbrauch für 50 Abfragen über verschiedene Iterationszahlen hinweg gemessen:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 5: Maximale Iterationen vs. Token-Verbrauch</em></p>
<p>Die Ergebnisse zeigen, dass der Token-Verbrauch mit zunehmender Anzahl von Iterationen linear ansteigt. Bei 4 Iterationen verbraucht DeepSearcher beispielsweise etwa 0,3 Millionen Token. Unter Verwendung einer groben Schätzung auf der Grundlage von OpenAIs gpt-4o-mini-Preisen von <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1M</mi><mn>Output-Token</mn><mo separator="true">,</mo><mi>was durchschnittlichen Kosten</mi><mi>von</mi><mi>etwa 0</mi></mrow><annotation encoding="application/x-tex">,60/1M Output-Token</annotation><mrow><mi>entspricht</mi></mrow><annotation encoding="application/x-tex">, ergibt dies durchschnittliche Kosten von etwa</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1M</span><span class="mord">Output-Token</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">was durchschnittlichen Kosten</span><span class="mord mathnormal">von</span><span class="mord mathnormal">etwa 0</span></span></span></span>,0036 pro Abfrage <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">entspricht</span></span></span></span>(oder etwa 0,18 $ für 50 Abfragen).</p>
<p>Bei ressourcenintensiveren Inferenzmodellen wären die Kosten aufgrund der höheren Preise pro Token und der größeren Token-Ausgaben um ein Vielfaches höher.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Vergleich der Modellleistung</h3><p>Ein wesentlicher Vorteil von DeepSearcher ist seine Flexibilität beim Wechsel zwischen verschiedenen Modellen. Wir haben verschiedene Inferenzmodelle und Nicht-Inferenzmodelle (wie gpt-4o-mini) getestet. Insgesamt schnitten die Inferenzmodelle - insbesondere Claude 3.7 Sonnet - am besten ab, obwohl die Unterschiede nicht dramatisch waren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 6: Durchschnittlicher Rückruf nach Modell</em></p>
<p>Bemerkenswert ist, dass einige kleinere Nicht-Inferenzmodelle aufgrund ihrer begrenzten Fähigkeit, Anweisungen zu befolgen, manchmal nicht in der Lage waren, den gesamten Agentenabfrageprozess abzuschließen - eine häufige Herausforderung für viele Entwickler, die mit ähnlichen Systemen arbeiten.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentisches RAG) im Vergleich zu Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> ist auch in der Lage, komplexe Abfragen zu verarbeiten, insbesondere Multi-Hop-Abfragen. Was ist nun der Unterschied zwischen DeepSearcher (Agentic RAG) und Graph RAG?</p>
<p>Graph RAG wurde entwickelt, um Dokumente auf der Grundlage expliziter relationaler Verknüpfungen abzufragen, was es besonders stark bei Multi-Hop-Abfragen macht. Bei der Verarbeitung eines langen Romans kann Graph RAG beispielsweise die komplizierten Beziehungen zwischen den Figuren präzise extrahieren. Diese Methode erfordert jedoch einen erheblichen Einsatz von Token während des Datenimports, um diese Beziehungen abzubilden, und ihr Abfragemodus ist tendenziell starr - typischerweise ist sie nur für Abfragen mit einer einzigen Beziehung effektiv.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 7: Graph RAG vs. DeepSearcher</em></p>
<p>Im Gegensatz dazu verfolgt Agentic RAG - wie zum Beispiel DeepSearcher - einen grundlegend anderen Ansatz. Es minimiert den Tokenverbrauch während des Datenimports und investiert stattdessen Rechenressourcen während der Abfrageverarbeitung. Diese Designentscheidung führt zu wichtigen technischen Kompromissen:</p>
<ol>
<li><p>Geringere Vorlaufkosten: DeepSearcher erfordert weniger Vorverarbeitung von Dokumenten, was die Ersteinrichtung schneller und kostengünstiger macht.</p></li>
<li><p>Dynamische Abfrageverarbeitung: Das System kann seine Abfragestrategie auf der Grundlage von Zwischenergebnissen im laufenden Betrieb anpassen.</p></li>
<li><p>Höhere Kosten pro Abfrage: Jede Abfrage erfordert mehr Berechnungen als Graph RAG, liefert aber flexiblere Ergebnisse.</p></li>
</ol>
<p>Für Entwickler ist diese Unterscheidung entscheidend, wenn sie Systeme mit unterschiedlichen Nutzungsmustern entwerfen. Graph RAG kann für Anwendungen mit vorhersehbaren Abfragemustern und hohem Abfragevolumen effizienter sein, während der Ansatz von DeepSearcher sich in Szenarien auszeichnet, die Flexibilität und den Umgang mit unvorhersehbaren, komplexen Abfragen erfordern.</p>
<p>Da die Kosten für LLMs sinken und sich die Inferenzleistung weiter verbessert, werden sich agentenbasierte RAG-Systeme wie DeepSearcher in Zukunft wahrscheinlich stärker durchsetzen. Der Nachteil der Rechenkosten wird sich verringern, während der Vorteil der Flexibilität bestehen bleiben wird.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Gegensatz zu OpenAIs Deep Research ist DeepSearcher speziell auf die tiefgehende Suche und Analyse privater Daten zugeschnitten. Durch die Nutzung einer Vektordatenbank kann DeepSearcher verschiedene Datenquellen aufnehmen, unterschiedliche Datentypen integrieren und sie einheitlich in einem vektorbasierten Wissensspeicher speichern. Seine robusten semantischen Suchfunktionen ermöglichen es, riesige Mengen an Offline-Daten effizient zu durchsuchen.</p>
<p>Außerdem ist DeepSearcher vollständig quelloffen. Deep Research ist zwar nach wie vor führend in der Qualität der Inhaltserstellung, kostet aber eine monatliche Gebühr und arbeitet als Closed-Source-Produkt, d. h. seine internen Prozesse sind für die Nutzer nicht sichtbar. Im Gegensatz dazu bietet DeepSearcher volle Transparenz - Benutzer können den Code untersuchen, ihn an ihre Bedürfnisse anpassen oder ihn sogar in ihrer eigenen Produktionsumgebung einsetzen.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Technische Einblicke<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Laufe der Entwicklung und der nachfolgenden Iterationen von DeepSearcher haben wir mehrere wichtige technische Erkenntnisse gewonnen:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Inferenzmodelle: Effektiv, aber nicht unfehlbar</h3><p>Unsere Experimente haben gezeigt, dass Inferenzmodelle zwar als Agenten gut funktionieren, aber manchmal einfache Anweisungen überanalysieren, was zu einem übermäßigen Tokenverbrauch und langsameren Antwortzeiten führt. Diese Beobachtung deckt sich mit dem Ansatz großer KI-Anbieter wie OpenAI, die nicht mehr zwischen Inferenz- und Nicht-Inferenz-Modellen unterscheiden. Stattdessen sollten Modelldienste automatisch die Notwendigkeit der Inferenz auf der Grundlage spezifischer Anforderungen bestimmen, um Token zu sparen.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">Der bevorstehende Aufstieg der agentenbasierten RAG</h3><p>Aus Nachfragesicht ist eine tiefgreifende Inhaltserstellung unerlässlich; technisch gesehen ist die Verbesserung der RAG-Effektivität ebenfalls von entscheidender Bedeutung. Langfristig sind die Kosten das Haupthindernis für die breite Einführung von agentenbasierten RAG. Mit dem Aufkommen kostengünstiger, qualitativ hochwertiger LLMs wie DeepSeek-R1 und den durch das Mooresche Gesetz bedingten Kostensenkungen dürften die mit Inferenzdiensten verbundenen Ausgaben jedoch sinken.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">Die verborgene Skalierungsgrenze von Agentic RAG</h3><p>Eine wichtige Erkenntnis aus unserer Forschung betrifft die Beziehung zwischen Leistung und Rechenressourcen. Ursprünglich gingen wir davon aus, dass eine einfache Erhöhung der Anzahl der Iterationen und der Token-Zuweisung die Ergebnisse bei komplexen Abfragen proportional verbessern würde.</p>
<p>In unseren Experimenten zeigte sich jedoch eine differenziertere Realität: Zwar verbessert sich die Leistung mit zusätzlichen Iterationen, aber wir beobachteten einen deutlichen Rückgang der Erträge. Genauer gesagt:</p>
<ul>
<li><p>Die Leistung stieg von 1 bis 3 Iterationen stark an.</p></li>
<li><p>Die Verbesserungen von 3 bis 5 Iterationen waren bescheiden</p></li>
<li><p>Bei mehr als 5 Iterationen waren die Verbesserungen vernachlässigbar, obwohl der Token-Verbrauch deutlich anstieg.</p></li>
</ul>
<p>Diese Erkenntnis hat wichtige Implikationen für Entwickler: einfach mehr Rechenressourcen auf RAG-Systeme zu werfen, ist nicht der effizienteste Ansatz. Die Qualität der Abfragestrategie, der Dekompositionslogik und des Syntheseprozesses ist oft wichtiger als die Anzahl der Iterationen. Dies legt nahe, dass sich die Entwickler auf die Optimierung dieser Komponenten konzentrieren sollten, anstatt nur die Token-Budgets zu erhöhen.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">Die Entwicklung über die traditionelle RAG hinaus</h3><p>Die traditionelle RAG bietet mit ihrem kostengünstigen Ansatz der Einzelabfrage wertvolle Effizienz und eignet sich daher für einfache Frage-Antwort-Szenarien. Seine Grenzen werden jedoch deutlich, wenn es um Abfragen mit komplexer impliziter Logik geht.</p>
<p>Nehmen wir eine Benutzeranfrage wie "Wie verdient man 100 Millionen in einem Jahr". Ein herkömmliches RAG-System könnte zwar Inhalte über gut verdienende Berufe oder Anlagestrategien abrufen, würde sich aber schwer tun:</p>
<ol>
<li><p>unrealistische Erwartungen in der Abfrage zu identifizieren</p></li>
<li><p>das Problem in realisierbare Teilziele aufzuschlüsseln</p></li>
<li><p>Informationen aus verschiedenen Bereichen (Wirtschaft, Finanzen, Unternehmertum) zu synthetisieren</p></li>
<li><p>einen strukturierten, mehrgleisigen Ansatz mit realistischen Zeitplänen zu präsentieren</p></li>
</ol>
<p>Hier zeigen agentenbasierte RAG-Systeme wie DeepSearcher ihre Stärke. Durch die Zerlegung komplexer Abfragen und die Anwendung mehrstufiger Schlussfolgerungen können sie differenzierte, umfassende Antworten geben, die dem Informationsbedarf des Benutzers besser gerecht werden. Da diese Systeme immer effizienter werden, ist zu erwarten, dass sie sich in Unternehmensanwendungen immer mehr durchsetzen.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSearcher stellt eine bedeutende Entwicklung im Design von RAG-Systemen dar und bietet Entwicklern ein leistungsfähiges Framework für den Aufbau anspruchsvoller Such- und Recherchefunktionen. Zu seinen wichtigsten technischen Vorteilen gehören:</p>
<ol>
<li><p>Iterative Argumentation: Die Fähigkeit, komplexe Abfragen in logische Teilschritte zu zerlegen und schrittweise auf umfassende Antworten hinzuarbeiten</p></li>
<li><p>Flexible Architektur: Unterstützung für den Austausch der zugrunde liegenden Modelle und die Anpassung des Schlussfolgerungsprozesses an spezifische Anwendungsanforderungen</p></li>
<li><p>Integration von Vektordatenbanken: Nahtlose Verbindung zu Milvus für effiziente Speicherung und Abruf von Vektoreinbettungen aus privaten Datenquellen</p></li>
<li><p>Transparente Ausführung: Detaillierte Protokollierung jedes Schlussfolgerungsschritts, die es Entwicklern ermöglicht, das Systemverhalten zu debuggen und zu optimieren</p></li>
</ol>
<p>Unsere Leistungstests bestätigen, dass DeepSearcher bei komplexen Abfragen im Vergleich zu traditionellen RAG-Ansätzen bessere Ergebnisse liefert, allerdings mit deutlichen Abstrichen bei der Recheneffizienz. Die optimale Konfiguration (typischerweise etwa 3 Iterationen) stellt ein Gleichgewicht zwischen Genauigkeit und Ressourcenverbrauch her.</p>
<p>In dem Maße, wie die LLM-Kosten weiter sinken und die Reasoning-Fähigkeiten verbessert werden, wird der in DeepSearcher implementierte agentenbasierte RAG-Ansatz für Produktionsanwendungen immer praktischer werden. Für Entwickler, die an einer unternehmensweiten Suche, Forschungsassistenten oder Wissensmanagementsystemen arbeiten, bietet DeepSearcher eine leistungsstarke Open-Source-Grundlage, die an spezifische Anforderungen angepasst werden kann.</p>
<p>Wir freuen uns über Beiträge aus der Entwicklergemeinschaft und laden Sie ein, dieses neue Paradigma der RAG-Implementierung in unserem <a href="https://github.com/zilliztech/deep-searcher">GitHub-Repository</a> zu erkunden.</p>
