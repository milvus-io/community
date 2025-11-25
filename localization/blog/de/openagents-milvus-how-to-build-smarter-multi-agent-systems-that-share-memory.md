---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: Wie man intelligentere Multi-Agenten-Systeme mit
  gemeinsamem Speicher aufbaut
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Erfahren Sie, wie OpenAgents verteilte Multi-Agenten-Zusammenarbeit
  ermöglicht, warum Milvus für das Hinzufügen von skalierbarem Speicher
  unverzichtbar ist und wie man ein vollständiges System aufbaut.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>Die meisten Entwickler beginnen ihre agentischen Systeme mit einem einzigen Agenten und stellen erst später fest, dass sie im Grunde einen sehr teuren Chatbot gebaut haben. Für einfache Aufgaben funktioniert ein Agent im Stil von ReAct gut, aber er stößt schnell an seine Grenzen: Er kann keine Schritte parallel ausführen, er verliert den Überblick über lange Argumentationsketten und er neigt dazu, auseinanderzufallen, sobald man zu viele Tools in den Mix einbringt. Multi-Agenten-Setups versprechen, dies zu beheben, aber sie bringen ihre eigenen Probleme mit sich: Koordinationsaufwand, brüchige Übergaben und ein ausufernder gemeinsamer Kontext, der die Qualität des Modells leise untergräbt.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> ist ein Open-Source-Framework für den Aufbau von Multi-Agenten-Systemen, in denen KI-Agenten zusammenarbeiten, Ressourcen gemeinsam nutzen und Projekte mit langen Laufzeiten in dauerhaften Gemeinschaften angehen. Anstelle eines einzigen zentralen Orchestrators ermöglicht OpenAgents den Agenten eine verteilte Zusammenarbeit: Sie können sich gegenseitig entdecken, kommunizieren und sich auf gemeinsame Ziele hin koordinieren.</p>
<p>In Verbindung mit der Vektordatenbank <a href="https://milvus.io/">Milvus</a> erhält diese Pipeline eine skalierbare, leistungsstarke Langzeitspeicherschicht. Milvus unterstützt den Agentenspeicher mit einer schnellen semantischen Suche, flexiblen Indizierungsoptionen wie HNSW und IVF und einer sauberen Isolierung durch Partitionierung, so dass Agenten Wissen speichern, abrufen und wiederverwenden können, ohne im Kontext zu ertrinken oder auf die Daten der anderen zu treten.</p>
<p>In diesem Beitrag gehen wir darauf ein, wie OpenAgents die verteilte Zusammenarbeit mehrerer Agenten ermöglicht, warum Milvus eine wichtige Grundlage für einen skalierbaren Agentenspeicher ist und wie man ein solches System Schritt für Schritt zusammenstellt.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Herausforderungen beim Aufbau von Agentensystemen in der realen Welt<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele der heute gängigen Agenten-Frameworks - LongChain, AutoGen, CrewAI und andere - basieren auf einem <strong>aufgabenzentrierten</strong> Modell. Man stellt eine Reihe von Agenten zusammen, gibt ihnen eine Aufgabe, definiert vielleicht einen Workflow und lässt sie laufen. Dies funktioniert gut für enge oder kurzlebige Anwendungsfälle, aber in echten Produktionsumgebungen stößt man auf drei strukturelle Einschränkungen:</p>
<ul>
<li><p><strong>Das Wissen bleibt isoliert.</strong> Die Erfahrungen eines Agenten beschränken sich auf seinen eigenen Einsatz. Ein Agent in der Entwicklungsabteilung, der den Code prüft, teilt seine Erkenntnisse nicht mit einem Agenten des Produktteams, der die Machbarkeit prüft. Am Ende muss jedes Team sein Wissen von Grund auf neu aufbauen, was sowohl ineffizient als auch brüchig ist.</p></li>
<li><p><strong>Die Zusammenarbeit ist starr.</strong> Selbst in Multi-Agenten-Frameworks hängt die Zusammenarbeit in der Regel von im Voraus definierten Arbeitsabläufen ab. Wenn sich die Zusammenarbeit ändern muss, können diese statischen Regeln nicht angepasst werden, was das gesamte System weniger flexibel macht.</p></li>
<li><p><strong>Fehlen eines dauerhaften Zustands.</strong> Die meisten Agenten folgen einem einfachen Lebenszyklus: <em>Starten → Ausführen → Beenden.</em> Zwischen den einzelnen Durchläufen vergessen sie alles - Kontext, Beziehungen, getroffene Entscheidungen und Interaktionsverlauf. Ohne einen dauerhaften Zustand können Agenten kein Langzeitgedächtnis aufbauen oder ihr Verhalten weiterentwickeln.</p></li>
</ul>
<p>Diese strukturellen Probleme rühren daher, dass Agenten als isolierte Ausführer von Aufgaben behandelt werden und nicht als Teilnehmer an einem breiteren kollaborativen Netzwerk.</p>
<p>Das OpenAgents-Team ist der Meinung, dass zukünftige Agentensysteme mehr als nur eine stärkere Argumentation benötigen - sie brauchen einen Mechanismus, der es den Agenten ermöglicht, sich gegenseitig zu entdecken, Beziehungen aufzubauen, Wissen zu teilen und dynamisch zusammenzuarbeiten. Und dies sollte nicht von einem einzigen zentralen Controller abhängen. Das Internet funktioniert, weil es verteilt ist - kein einzelner Knotenpunkt bestimmt alles, und das System wird robuster und skalierbarer, wenn es wächst. Multiagentensysteme profitieren von demselben Prinzip. Deshalb beseitigt OpenAgents die Idee eines allmächtigen Orchestrators und ermöglicht stattdessen eine dezentralisierte, netzwerkgesteuerte Zusammenarbeit.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">Was ist OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents ist ein Open-Source-Framework für den Aufbau von KI-Agenten-Netzwerken, das eine offene Zusammenarbeit ermöglicht, bei der KI-Agenten zusammenarbeiten, Ressourcen gemeinsam nutzen und langfristige Projekte in Angriff nehmen. Es bietet die Infrastruktur für ein Internet der Agenten, in dem Agenten offen mit Millionen anderer Agenten in dauerhaften, wachsenden Gemeinschaften zusammenarbeiten. Auf technischer Ebene ist das System um drei Kernkomponenten herum aufgebaut: <strong>Agentennetzwerk, Netzwerk-Mods und Transporte.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Agentennetzwerk: Ein gemeinsames Umfeld für die Zusammenarbeit</h3><p>Ein Agentennetzwerk ist eine gemeinsame Umgebung, in der sich mehrere Agenten verbinden, kommunizieren und zusammenarbeiten können, um komplexe Aufgaben zu lösen. Zu seinen Hauptmerkmalen gehören:</p>
<ul>
<li><p><strong>Dauerhafter Betrieb:</strong> Einmal erstellt, bleibt das Netzwerk unabhängig von einer einzelnen Aufgabe oder einem Arbeitsablauf online.</p></li>
<li><p><strong>Dynamische Agenten:</strong> Agenten können jederzeit mit einer Netzwerk-ID beitreten; eine Vorregistrierung ist nicht erforderlich.</p></li>
<li><p><strong>Unterstützung mehrerer Protokolle:</strong> Eine einheitliche Abstraktionsschicht unterstützt die Kommunikation über WebSocket, gRPC, HTTP und libp2p.</p></li>
<li><p><strong>Autonome Konfiguration:</strong> Jedes Netzwerk verwaltet seine eigenen Berechtigungen, Governance und Ressourcen.</p></li>
</ul>
<p>Mit nur einer Zeile Code können Sie ein Netzwerk einrichten, und jeder Agent kann über Standardschnittstellen sofort beitreten.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Netzwerk-Mods: Steckbare Erweiterungen für die Zusammenarbeit</h3><p>Mods bieten eine modulare Schicht von Kollaborationsfunktionen, die vom Kernsystem entkoppelt bleiben. Sie können Mods je nach Ihren spezifischen Anforderungen kombinieren und so auf jeden Anwendungsfall zugeschnittene Kooperationsmuster ermöglichen.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Zweck</strong></th><th><strong>Anwendungsfälle</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Arbeitsbereich Messaging</strong></td><td>Nachrichtenkommunikation in Echtzeit</td><td>Streaming-Antworten, sofortiges Feedback</td></tr>
<tr><td><strong>Forum</strong></td><td>Asynchrone Diskussion</td><td>Überprüfung von Vorschlägen, Beratung in mehreren Runden</td></tr>
<tr><td><strong>Wiki</strong></td><td>Gemeinsame Wissensbasis</td><td>Wissenskonsolidierung, Zusammenarbeit bei Dokumenten</td></tr>
<tr><td><strong>Soziales</strong></td><td>Beziehungsdiagramm</td><td>Experten-Routing, Vertrauensnetzwerke</td></tr>
</tbody>
</table>
<p>Alle Mods arbeiten mit einem einheitlichen Ereignissystem, so dass es einfach ist, den Rahmen zu erweitern oder benutzerdefinierte Verhaltensweisen einzuführen, wann immer dies erforderlich ist.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transporte: Ein protokoll-agnostischer Kommunikationskanal</h3><p>Transports sind die Kommunikationsprotokolle, die es heterogenen Agenten ermöglichen, sich zu verbinden und Nachrichten innerhalb eines OpenAgents-Netzwerks auszutauschen. OpenAgents unterstützt mehrere Transportprotokolle, die gleichzeitig innerhalb desselben Netzes laufen können, darunter:</p>
<ul>
<li><p><strong>HTTP/REST</strong> für eine breite, sprachübergreifende Integration</p></li>
<li><p><strong>WebSocket</strong> für bidirektionale Kommunikation mit niedriger Latenz</p></li>
<li><p><strong>gRPC</strong> für Hochleistungs-RPC, geeignet für große Cluster</p></li>
<li><p><strong>libp2p</strong> für dezentralisierte Peer-to-Peer-Netzwerke</p></li>
<li><p><strong>A2A</strong>, ein aufkommendes Protokoll, das speziell für die Kommunikation von Agent zu Agent entwickelt wurde</p></li>
</ul>
<p>Alle Transporte funktionieren über ein einheitliches, ereignisbasiertes Nachrichtenformat, das eine nahtlose Übersetzung zwischen den Protokollen ermöglicht. Sie müssen sich nicht darum kümmern, welches Protokoll ein Peer-Agent verwendet - das Framework erledigt dies automatisch. Agenten, die in einer beliebigen Sprache oder einem beliebigen Framework erstellt wurden, können einem OpenAgents-Netzwerk beitreten, ohne dass vorhandener Code umgeschrieben werden muss.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Integration von OpenAgents mit Milvus für ein langfristiges Agentengedächtnis<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents löst die Herausforderung, wie Agenten <strong>kommunizieren, sich gegenseitig entdecken und zusammenarbeiten - aber</strong>Zusammenarbeit allein ist nicht genug. Agenten generieren Erkenntnisse, Entscheidungen, Gesprächsverläufe, Toolergebnisse und domänenspezifisches Wissen. Ohne eine persistente Speicherebene verpufft all dies in dem Moment, in dem ein Agent heruntergefahren wird.</p>
<p>An dieser Stelle wird <strong>Milvus</strong> unverzichtbar. Milvus bietet den leistungsstarken Vektorspeicher und die semantische Abfrage, die erforderlich sind, um Agenteninteraktionen in einen dauerhaften, wiederverwendbaren Speicher zu verwandeln. Wenn es in das OpenAgents-Netzwerk integriert wird, bietet es drei wesentliche Vorteile:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Semantische Suche</strong></h4><p>Milvus bietet eine schnelle semantische Suche mit Indexierungsalgorithmen wie HNSW und IVF_FLAT. Agenten können die relevantesten historischen Aufzeichnungen auf der Grundlage von Bedeutungen und nicht von Schlüsselwörtern abrufen, was es ihnen ermöglicht:</p>
<ul>
<li><p>frühere Entscheidungen oder Pläne abzurufen,</p></li>
<li><p>die Wiederholung von Arbeit zu vermeiden,</p></li>
<li><p>einen langfristigen Kontext über mehrere Sitzungen hinweg aufrechtzuerhalten.</p></li>
</ul>
<p>Dies ist das Rückgrat des <em>agenturischen Gedächtnisses</em>: schnelles, relevantes und kontextbezogenes Abrufen.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Horizontale Skalierbarkeit im Milliardenmaßstab</strong></h4><p>Echte Agentennetzwerke erzeugen riesige Datenmengen. Milvus ist für einen komfortablen Betrieb in diesem Umfang ausgelegt und bietet:</p>
<ul>
<li><p>Speicherung und Suche über Milliarden von Vektoren,</p></li>
<li><p>&lt; 30 ms Latenzzeit selbst bei Top-K-Abrufen mit hohem Durchsatz,</p></li>
<li><p>eine vollständig verteilte Architektur, die bei wachsendem Bedarf linear skaliert.</p></li>
</ul>
<p>Egal, ob Sie ein Dutzend Agenten oder Tausende parallel arbeiten lassen, Milvus sorgt für eine schnelle und konsistente Abfrage.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Multi-Mandanten-Isolierung</strong></h4><p>Milvus bietet eine granulare Multi-Tenant-Isolation durch <strong>Partition Key</strong>, einen leichtgewichtigen Partitionierungsmechanismus, der den Speicher innerhalb einer einzigen Sammlung segmentiert. Dies ermöglicht:</p>
<ul>
<li><p>Verschiedene Teams, Projekte oder Agentengemeinschaften können unabhängige Speicherbereiche verwalten,</p></li>
<li><p>einen drastisch geringeren Overhead im Vergleich zur Verwaltung mehrerer Sammlungen,</p></li>
<li><p>optionales Abrufen von Wissen über mehrere Partitionen hinweg, wenn gemeinsames Wissen benötigt wird.</p></li>
</ul>
<p>Diese Isolierung ist entscheidend für große Multi-Agent-Einsätze, bei denen Datengrenzen respektiert werden müssen, ohne die Abrufgeschwindigkeit zu beeinträchtigen.</p>
<p>OpenAgents stellt die Verbindung zu Milvus über <strong>benutzerdefinierte Mods</strong> her, die Milvus-APIs direkt aufrufen. Agentenmeldungen, Toolausgaben und Interaktionsprotokolle werden automatisch in Vektoren eingebettet und in Milvus gespeichert. Entwickler können anpassen:</p>
<ul>
<li><p>das Einbettungsmodell,</p></li>
<li><p>das Speicherschema und die Metadaten,</p></li>
<li><p>und Abrufstrategien (z. B. hybride Suche, partitionierte Suche).</p></li>
</ul>
<p>Dadurch erhält jede Agentengemeinschaft eine Speicherebene, die skalierbar, beständig und für semantische Schlussfolgerungen optimiert ist.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Wie man einen Multi-Agenten-Chatbot mit OpenAgent und Milvus erstellt<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Um die Dinge konkret zu machen, lassen Sie uns eine Demo durchgehen: Aufbau einer <strong>Entwickler-Support-Community</strong>, in der mehrere spezialisierte Agenten - Python-Experten, Datenbankexperten, DevOps-Ingenieure und andere - zusammenarbeiten, um technische Fragen zu beantworten. Anstatt sich auf einen einzigen überlasteten Generalisten-Agenten zu verlassen, steuert jeder Experte domänenspezifische Argumente bei, und das System leitet Anfragen automatisch an den am besten geeigneten Agenten weiter.</p>
<p>Dieses Beispiel zeigt, wie <strong>Milvus</strong> in einen OpenAgents-Einsatz integriert werden kann, um ein Langzeitgedächtnis für technische Fragen und Antworten bereitzustellen. Agentengespräche, frühere Lösungen, Fehlerbehebungsprotokolle und Benutzeranfragen werden alle in Vektoreinbettungen umgewandelt und in Milvus gespeichert, so dass das Netzwerk in der Lage ist:</p>
<ul>
<li><p>sich an frühere Antworten zu erinnern,</p></li>
<li><p>frühere technische Erklärungen wiederzuverwenden,</p></li>
<li><p>die Konsistenz über Sitzungen hinweg aufrechtzuerhalten und</p></li>
<li><p>sich im Laufe der Zeit zu verbessern, wenn sich mehr Interaktionen ansammeln.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Voraussetzung</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-Schlüssel</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Abhängigkeiten definieren</h3><p>Definieren Sie die für das Projekt benötigten Python-Pakete:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Umgebungsvariablen</h3><p>Hier finden Sie die Vorlage für Ihre Umgebungskonfiguration:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Konfigurieren Sie Ihr OpenAgents-Netzwerk</h3><p>Definieren Sie die Struktur Ihres Agentennetzes und seine Kommunikationseinstellungen:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Implementieren Sie die Multi-Agenten-Zusammenarbeit</h3><p>Im Folgenden finden Sie die wichtigsten Codeschnipsel (nicht die vollständige Implementierung).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Erstellen und Aktivieren einer virtuellen Umgebung</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Abhängigkeiten installieren</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>API-Schlüssel konfigurieren</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Starten Sie das OpenAgents-Netzwerk</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Starten Sie den Multi-Agenten-Dienst</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>OpenAgents Studio starten</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Zugang zum Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Überprüfen Sie den Status Ihrer Agenten und Ihres Netzwerks:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents stellt die Koordinationsschicht bereit, die es Agenten ermöglicht, sich gegenseitig zu entdecken, zu kommunizieren und zusammenzuarbeiten, während Milvus das ebenso kritische Problem löst, wie Wissen gespeichert, gemeinsam genutzt und wiederverwendet wird. Durch die Bereitstellung einer hochleistungsfähigen Vektorspeicherschicht ermöglicht Milvus den Agenten den Aufbau eines dauerhaften Kontexts, die Erinnerung an vergangene Interaktionen und die Anhäufung von Fachwissen im Laufe der Zeit. Zusammen bringen sie KI-Systeme über die Grenzen isolierter Modelle hinaus und in Richtung des tieferen kollaborativen Potenzials eines echten Multi-Agenten-Netzwerks.</p>
<p>Natürlich ist keine Multi-Agenten-Architektur ohne Kompromisse. Die parallele Ausführung von Agenten kann den Token-Verbrauch erhöhen, Fehler können sich über die Agenten hinweg ausbreiten, und die gleichzeitige Entscheidungsfindung kann zu gelegentlichen Konflikten führen. Dies sind Bereiche, in denen noch geforscht und Verbesserungen vorgenommen werden, aber sie schmälern nicht den Wert von Systemen, die sich koordinieren, erinnern und weiterentwickeln können.</p>
<p>🚀 Sind Sie bereit, Ihren Agenten ein Langzeitgedächtnis zu verleihen?</p>
<p>Lernen Sie <a href="https://milvus.io/">Milvus</a> kennen und versuchen Sie, es in Ihren eigenen Arbeitsablauf zu integrieren.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen in den<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunden</a> zu erhalten.</p>
