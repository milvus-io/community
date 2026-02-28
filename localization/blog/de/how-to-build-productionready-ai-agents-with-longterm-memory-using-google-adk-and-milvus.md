---
id: >-
  how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
title: >-
  Wie man mit Google ADK und Milvus produktionsreife KI-Agenten mit
  Langzeitspeicher erstellt
author: Min Yin
date: 2026-02-26T00:00:00.000Z
cover: assets.zilliz.com/cover_c543dbeab4.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: >-
  AI agent memory, long-term memory, ADK framework, Milvus vector database,
  semantic retrieval
meta_title: |
  Production AI Agents with Persistent Memory Using Google ADK and Milvus
desc: >-
  Aufbau von KI-Agenten mit echtem Langzeitgedächtnis unter Verwendung von ADK
  und Milvus, einschließlich Speicherdesign, semantischer Abfrage,
  Benutzerisolierung und produktionsreifer Architektur.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
---
<p>Bei der Entwicklung intelligenter Agenten ist eines der schwierigsten Probleme die Speicherverwaltung: die Entscheidung, was der Agent sich merken und was er vergessen soll.</p>
<p>Nicht jeder Speicher ist für die Ewigkeit gedacht. Einige Daten werden nur für das aktuelle Gespräch benötigt und sollten nach dessen Beendigung gelöscht werden. Andere Daten, wie z. B. Benutzereinstellungen, müssen über mehrere Gespräche hinweg erhalten bleiben. Wenn diese Daten vermischt werden, stapeln sich die temporären Daten, und wichtige Informationen gehen verloren.</p>
<p>Das eigentliche Problem liegt in der Architektur. Die meisten Frameworks sorgen nicht für eine klare Trennung zwischen Kurzzeit- und Langzeitspeicher, so dass die Entwickler dies manuell erledigen müssen.</p>
<p>Das Open-Source <a href="https://google.github.io/adk-docs/">Agent Development Kit (ADK)</a> von Google, das 2025 veröffentlicht wurde, geht dieses Problem auf der Framework-Ebene an, indem es die Speicherverwaltung zu einem Thema erster Klasse macht. Es erzwingt eine Standardtrennung zwischen Kurzzeit-Sitzungsspeicher und Langzeitspeicher.</p>
<p>In diesem Artikel werden wir uns ansehen, wie diese Trennung in der Praxis funktioniert. Unter Verwendung von Milvus als Vektordatenbank werden wir einen produktionsreifen Agenten mit echtem Langzeitspeicher von Grund auf aufbauen.</p>
<h2 id="ADK’s-Core-Design-Principles" class="common-anchor-header">ADKs grundlegende Designprinzipien<button data-href="#ADK’s-Core-Design-Principles" class="anchor-icon" translate="no">
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
    </button></h2><p>ADK ist so konzipiert, dass die Speicherverwaltung dem Entwickler abgenommen wird. Das Framework trennt automatisch kurzfristige Sitzungsdaten vom Langzeitspeicher und behandelt beide entsprechend. Dies geschieht durch vier zentrale Designentscheidungen.</p>
<h3 id="Built-in-Interfaces-for-Short--and-Long-Term-Memory" class="common-anchor-header">Eingebaute Schnittstellen für Kurz- und Langzeitspeicher</h3><p>Jeder ADK-Agent verfügt über zwei eingebaute Schnittstellen für die Speicherverwaltung:</p>
<p><strong>SessionService (temporäre Daten)</strong></p>
<ul>
<li><strong>Was er speichert</strong>: aktuelle Gesprächsinhalte und Zwischenergebnisse von Tool-Aufrufen</li>
<li><strong>Wann wird er gelöscht</strong>: automatisch bei Beendigung der Sitzung</li>
<li><strong>Wo wird er gespeichert</strong>: im Speicher (am schnellsten), in einer Datenbank oder in einem Cloud-Dienst</li>
</ul>
<p><strong>MemoryService (Langzeitspeicher)</strong></p>
<ul>
<li><strong>Was wird gespeichert</strong>: Informationen, die gespeichert werden sollen, wie z. B. Benutzereinstellungen oder frühere Datensätze</li>
<li><strong>Wann wird er gelöscht</strong>: nicht automatisch; muss manuell gelöscht werden</li>
<li><strong>Wo er gespeichert wird</strong>: ADK definiert nur die Schnittstelle; das Speicher-Backend ist Ihnen überlassen (z. B. Milvus)</li>
</ul>
<h3 id="A-Three-Layer-Architecture" class="common-anchor-header">Eine dreischichtige Architektur</h3><p>Das ADK unterteilt das System in drei Schichten, die jeweils für eine bestimmte Aufgabe zuständig sind:</p>
<ul>
<li><strong>Agentenschicht</strong>: Hier befindet sich die Geschäftslogik, z. B. "Abrufen des relevanten Speichers, bevor dem Benutzer geantwortet wird".</li>
<li><strong>Laufzeitschicht</strong>: Sie wird vom Framework verwaltet und ist für die Erstellung und den Abbau von Sitzungen und die Verfolgung jedes Ausführungsschritts verantwortlich.</li>
<li><strong>Serviceschicht</strong>: Integration mit externen Systemen, z. B. Vektordatenbanken wie Milvus oder große Modell-APIs.</li>
</ul>
<p>Diese Struktur sorgt für eine Trennung der Bereiche: Die Geschäftslogik befindet sich im Agenten, während die Speicherung an anderer Stelle erfolgt. Sie können das eine aktualisieren, ohne das andere zu zerstören.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_2_6af7f3a395.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Everything-Is-Recorded-as-Events" class="common-anchor-header">Alles wird als Ereignis aufgezeichnet</h3><p>Jede Aktion eines Agenten - das Aufrufen eines Erinnerungsprogramms, das Aufrufen eines Modells, das Generieren einer Antwort - wird als <strong>Ereignis</strong> aufgezeichnet.</p>
<p>Dies hat zwei praktische Vorteile. Erstens können Entwickler, wenn etwas schief geht, die gesamte Interaktion Schritt für Schritt wiederholen, um den genauen Fehlerpunkt zu finden. Zweitens liefert das System für die Prüfung und Einhaltung von Vorschriften eine vollständige Ausführungsspur für jede Benutzerinteraktion.</p>
<h3 id="Prefix-Based-Data-Scoping" class="common-anchor-header">Präfix-basiertes Data Scoping</h3><p>ADK steuert die Sichtbarkeit von Daten über einfache Schlüsselpräfixe:</p>
<ul>
<li><strong>temp:xxx</strong> - nur innerhalb der aktuellen Sitzung sichtbar und automatisch entfernt, wenn diese endet</li>
<li><strong>user:xxx</strong> - wird von allen Sitzungen desselben Benutzers gemeinsam genutzt und ermöglicht dauerhafte Benutzereinstellungen</li>
<li><strong>app:xxx</strong> - wird von allen Benutzern gemeinsam genutzt und eignet sich für anwendungsübergreifendes Wissen, wie z. B. Produktdokumentation</li>
</ul>
<p>Durch die Verwendung von Präfixen können Entwickler den Datenumfang kontrollieren, ohne zusätzliche Zugriffslogik zu schreiben. Das Framework verwaltet Sichtbarkeit und Lebensdauer automatisch.</p>
<h2 id="Milvus-as-the-Memory-Backend-for-ADK" class="common-anchor-header">Milvus als Speicher-Backend für ADK<button data-href="#Milvus-as-the-Memory-Backend-for-ADK" class="anchor-icon" translate="no">
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
    </button></h2><p>Im ADK ist der MemoryService nur eine Schnittstelle. Sie definiert, wie der Langzeitspeicher verwendet wird, aber nicht, wie er gespeichert wird. Die Wahl der Datenbank bleibt dem Entwickler überlassen. Welche Art von Datenbank eignet sich also für das Speicher-Backend eines Agenten?</p>
<h3 id="What-an-Agent-Memory-System-Needs--and-How-Milvus-Delivers" class="common-anchor-header">Was ein Agentenspeichersystem braucht - und wie Milvus es liefert</h3><ul>
<li><strong>Semantischer Abruf</strong></li>
</ul>
<p><strong>Der Bedarf</strong>:</p>
<p>Benutzer stellen selten dieselbe Frage auf dieselbe Weise. "Es wird keine Verbindung hergestellt" und "Zeitüberschreitung der Verbindung" bedeuten das Gleiche. Das Speichersystem muss die Bedeutung verstehen und nicht nur Schlüsselwörter abgleichen.</p>
<p><strong>Wie Milvus dies erfüllt</strong>:</p>
<p>Milvus unterstützt viele Vektor-Index-Typen wie HNSW und DiskANN, so dass die Entwickler wählen können, was zu ihrer Arbeitslast passt. Selbst bei Dutzenden von Millionen von Vektoren kann die Abfragelatenz unter 10 ms bleiben, was für den Einsatz von Agenten schnell genug ist.</p>
<ul>
<li><strong>Hybride Abfragen</strong></li>
</ul>
<p><strong>Der Bedarf</strong>:</p>
<p>Der Speicherabruf erfordert mehr als eine semantische Suche. Das System muss auch nach strukturierten Feldern wie user_id filtern, damit nur die Daten des aktuellen Benutzers zurückgegeben werden.</p>
<p><strong>Wie Milvus dies erfüllt</strong>:</p>
<p>Milvus unterstützt von Haus aus hybride Abfragen, die Vektorsuche mit skalarer Filterung kombinieren. So können z. B. semantisch ähnliche Datensätze abgerufen werden, während in derselben Abfrage ein Filter wie user_id = 'xxx' angewendet wird, ohne dass die Leistung oder die Abrufqualität beeinträchtigt wird.</p>
<ul>
<li><strong>Skalierbarkeit</strong></li>
</ul>
<p><strong>Der Bedarf</strong>:</p>
<p>Wenn die Zahl der Nutzer und der gespeicherten Daten wächst, muss das System reibungslos skalieren. Die Leistung sollte bei steigendem Datenvolumen stabil bleiben, ohne plötzliche Verlangsamungen oder Ausfälle.</p>
<p><strong>Wie Milvus diese Anforderungen erfüllt</strong>:</p>
<p>Milvus verwendet eine Architektur zur Trennung von Datenverarbeitung und Speicherung. Die Abfragekapazität kann durch Hinzufügen von Abfrageknoten nach Bedarf horizontal skaliert werden. Selbst die Standalone-Version, die auf einem einzigen Rechner läuft, kann Dutzende von Millionen von Vektoren verarbeiten und eignet sich daher für den Einsatz in der Anfangsphase.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_4_e1d89e6986.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hinweis: Für lokale Entwicklung und Tests verwenden die Beispiele in diesem Artikel <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> oder <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone</a>.</p>
<h2 id="Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="common-anchor-header">Aufbau eines Agenten mit Long-TermMemory Powered by Milvus<button data-href="#Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Abschnitt bauen wir einen einfachen technischen Support-Agenten. Wenn ein Benutzer eine Frage stellt, sucht der Agent nach ähnlichen früheren Support-Tickets, um sie zu beantworten, anstatt die gleiche Arbeit zu wiederholen.</p>
<p>Dieses Beispiel ist nützlich, weil es drei häufige Probleme zeigt, mit denen echte Agentenspeichersysteme umgehen müssen.</p>
<ul>
<li><strong>Langfristiges Gedächtnis über Sitzungen hinweg</strong></li>
</ul>
<p>Eine heute gestellte Frage kann sich auf ein Ticket beziehen, das vor Wochen erstellt wurde. Der Agent muss sich Informationen über mehrere Konversationen hinweg merken, nicht nur innerhalb der aktuellen Sitzung. Aus diesem Grund wird ein Langzeitspeicher benötigt, der über MemoryService verwaltet wird.</p>
<ul>
<li><strong>Benutzerisolierung</strong></li>
</ul>
<p>Der Supportverlauf eines jeden Benutzers muss privat bleiben. Daten eines Benutzers dürfen niemals in den Ergebnissen eines anderen Benutzers erscheinen. Dies erfordert die Filterung von Feldern wie user_id, die Milvus durch hybride Abfragen unterstützt.</p>
<ul>
<li><strong>Semantischer Abgleich</strong></li>
</ul>
<p>Benutzer beschreiben dasselbe Problem auf unterschiedliche Weise, z. B. "kann keine Verbindung herstellen" oder "Zeitüberschreitung". Der Abgleich von Schlüsselwörtern ist nicht genug. Der Agent benötigt eine semantische Suche, die durch Vektor-Retrieval bereitgestellt wird.</p>
<h3 id="Environment-setup" class="common-anchor-header">Einrichtung der Umgebung</h3><ul>
<li>Python 3.11+</li>
<li>Docker und Docker Compose</li>
<li>Gemini-API-Schlüssel</li>
</ul>
<p>Dieser Abschnitt behandelt die grundlegende Einrichtung, um sicherzustellen, dass das Programm korrekt ausgeführt werden kann.</p>
<pre><code translate="no">pip install google-adk pymilvus google-generativeai  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;  
ADK + Milvus + Gemini Long-term Memory Agent  
Demonstrates how to implement a cross-session memory recall system  
&quot;&quot;&quot;</span>  
<span class="hljs-keyword">import</span> os  
<span class="hljs-keyword">import</span> asyncio  
<span class="hljs-keyword">import</span> time  
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType, utility  
<span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai  
<span class="hljs-keyword">from</span> google.adk.agents <span class="hljs-keyword">import</span> Agent  
<span class="hljs-keyword">from</span> google.adk.tools <span class="hljs-keyword">import</span> FunctionTool  
<span class="hljs-keyword">from</span> google.adk.runners <span class="hljs-keyword">import</span> Runner  
<span class="hljs-keyword">from</span> google.adk.sessions <span class="hljs-keyword">import</span> InMemorySessionService  
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-Milvus-Standalone-Docker" class="common-anchor-header">Schritt 1: Einsatz von Milvus Standalone (Docker)</h3><p><strong>(1) Laden Sie die Bereitstellungsdateien herunter.</strong></p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml  
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Starten Sie den Milvus-Dienst</strong></p>
<pre><code translate="no">docker-compose up -d  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_1_0ab7f330eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Model-and-Connection-Configuration" class="common-anchor-header">Schritt 2: Modell- und Verbindungskonfiguration</h3><p>Konfigurieren Sie die Gemini-API und die Milvus-Verbindungseinstellungen.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Configuration ====================  </span>
<span class="hljs-comment"># 1. Gemini API configuration  </span>
GOOGLE_API_KEY = os.getenv(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)  
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> GOOGLE_API_KEY:  
   <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Please set the GOOGLE_API_KEY environment variable&quot;</span>)  
genai.configure(api_key=GOOGLE_API_KEY)  
<span class="hljs-comment"># 2. Milvus connection configuration  </span>
MILVUS_HOST = os.getenv(<span class="hljs-string">&quot;MILVUS_HOST&quot;</span>, <span class="hljs-string">&quot;localhost&quot;</span>)  
MILVUS_PORT = os.getenv(<span class="hljs-string">&quot;MILVUS_PORT&quot;</span>, <span class="hljs-string">&quot;19530&quot;</span>)  
<span class="hljs-comment"># 3. Model selection (best combination within the free tier limits)  </span>
LLM_MODEL = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>  <span class="hljs-comment"># LLM model: 1000 RPD  </span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;models/text-embedding-004&quot;</span>  <span class="hljs-comment"># Embedding model: 1000 RPD  </span>
EMBEDDING_DIM = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension  </span>
<span class="hljs-comment"># 4. Application configuration  </span>
APP_NAME = <span class="hljs-string">&quot;tech_support&quot;</span>  
USER_ID = <span class="hljs-string">&quot;user_123&quot;</span>  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Using model configuration:&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  LLM: <span class="hljs-subst">{LLM_MODEL}</span>&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Embedding: <span class="hljs-subst">{EMBEDDING_MODEL}</span> (dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>)&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Milvus-Database-Initialization" class="common-anchor-header">Schritt 3 Initialisierung der Milvus-Datenbank</h3><p>Erstellen einer Vektordatenbank-Sammlung (ähnlich einer Tabelle in einer relationalen Datenbank)</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Initialize Milvus ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">init_milvus</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus connection and collection&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Step 1: Establish connection  </span>
   Try:  
       connections.connect(  
           alias=<span class="hljs-string">&quot;default&quot;</span>,  
           host=MILVUS_HOST,  
           port=MILVUS_PORT  
       )  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Connected to Milvus: <span class="hljs-subst">{MILVUS_HOST}</span>:<span class="hljs-subst">{MILVUS_PORT}</span>&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✗ Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Hint: make sure Milvus is running&quot;</span>)  
       Raise  
   <span class="hljs-comment"># Step 2: Define data schema  </span>
   fields = [  
       FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;session_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;question&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;solution&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">5000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),  
       FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)  
   ]  
   schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Tech support memory&quot;</span>)  
   collection_name = <span class="hljs-string">&quot;support_memory&quot;</span>  
   <span class="hljs-comment"># Step 3: Create or load the collection  </span>
   <span class="hljs-keyword">if</span> utility.has_collection(collection_name):  
       memory_collection = Collection(name=collection_name)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; already exists&quot;</span>)  
   Else:  
       memory_collection = Collection(name=collection_name, schema=schema)  
   <span class="hljs-comment"># Step 4: Create vector index  </span>
   index_params = {  
       <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,  
       <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
   }  
   memory_collection.create_index(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, index_params=index_params)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Created collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; and index&quot;</span>)  
   <span class="hljs-keyword">return</span> memory_collection  
<span class="hljs-comment"># Run initialization  </span>
memory_collection = init_milvus()  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Memory-Operation-Functions" class="common-anchor-header">Schritt 4 Funktionen für Speicheroperationen</h3><p>Kapseln Sie die Speicher- und Abfragelogik als Werkzeuge für den Agenten.</p>
<p>(1) Speicherfunktion speichern</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Memory Operation Functions ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">store_memory</span>(<span class="hljs-params">question: <span class="hljs-built_in">str</span>, solution: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Store a solution record into the memory store  
   Args:  
       question: the user&#x27;s question  
       solution: the solution  
   Returns:  
       str: result message  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] store_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - question: <span class="hljs-subst">{question[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - solution: <span class="hljs-subst">{solution[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-comment"># Use global USER_ID (in production, this should come from ToolContext)  </span>
       user_id = USER_ID  
       session_id = <span class="hljs-string">f&quot;session_<span class="hljs-subst">{<span class="hljs-built_in">int</span>(time.time())}</span>&quot;</span>  
       <span class="hljs-comment"># Key step 1: convert the question into a 768-dimensional vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=question,  
           task_type=<span class="hljs-string">&quot;retrieval_document&quot;</span>,  <span class="hljs-comment"># specify document indexing task  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: insert into Milvus  </span>
       memory_collection.insert([{  
           <span class="hljs-string">&quot;user_id&quot;</span>: user_id,  
           <span class="hljs-string">&quot;session_id&quot;</span>: session_id,  
           <span class="hljs-string">&quot;question&quot;</span>: question,  
           <span class="hljs-string">&quot;solution&quot;</span>: solution,  
           <span class="hljs-string">&quot;embedding&quot;</span>: embedding,  
           <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-built_in">int</span>(time.time())  
       }])  
       <span class="hljs-comment"># Key step 3: flush to disk (ensure data persistence)  </span>
       memory_collection.flush()  
       result = <span class="hljs-string">&quot;✓ Successfully stored in memory&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> result  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;✗ Storage failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(2) Speicherfunktion abrufen</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_memory</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Retrieve relevant historical cases from the memory store  
   Args:  
       query: query question  
       top_k: number of most similar results to return  
   Returns:  
       str: retrieval result  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] recall_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - query: <span class="hljs-subst">{query}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - top_k: <span class="hljs-subst">{top_k}</span>&quot;</span>)  
       user_id = USER_ID  
       <span class="hljs-comment"># Key step 1: convert the query into a vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=query,  
           task_type=<span class="hljs-string">&quot;retrieval_query&quot;</span>,  <span class="hljs-comment"># specify query task (different from indexing)  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       query_embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: load the collection into memory (required for the first query)  </span>
       memory_collection.load()  
       <span class="hljs-comment"># Key step 3: hybrid search (vector similarity + scalar filtering)  </span>
       results = memory_collection.search(  
           data=[query_embedding],  
           anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,  
           param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},  
           limit=top_k,  
           expr=<span class="hljs-string">f&#x27;user_id == &quot;<span class="hljs-subst">{user_id}</span>&quot;&#x27;</span>,  <span class="hljs-comment"># 🔑 key to user isolation  </span>
           output_fields=[<span class="hljs-string">&quot;question&quot;</span>, <span class="hljs-string">&quot;solution&quot;</span>, <span class="hljs-string">&quot;timestamp&quot;</span>]  
       )  
       <span class="hljs-comment"># Key step 4: format results  </span>
       <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results[<span class="hljs-number">0</span>]:  
           result = <span class="hljs-string">&quot;No relevant historical cases found&quot;</span>  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
           <span class="hljs-keyword">return</span> result  
       result_text = <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> relevant cases:\\n\\n&quot;</span>  
       <span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results[<span class="hljs-number">0</span>]):  
           result_text += <span class="hljs-string">f&quot;Case <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> (similarity: <span class="hljs-subst">{hit.score:<span class="hljs-number">.2</span>f}</span>):\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;question&#x27;</span>)}</span>\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Solution: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;solution&#x27;</span>)}</span>\\n\\n&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> cases&quot;</span>)  
       <span class="hljs-keyword">return</span> result_text  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;Retrieval failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(3) Registrierung als ADK-Werkzeug</p>
<pre><code translate="no"><span class="hljs-comment"># Usage  </span>
<span class="hljs-comment"># Wrap functions with FunctionTool  </span>
store_memory_tool = FunctionTool(func=store_memory)  
recall_memory_tool = FunctionTool(func=recall_memory)  
memory_tools = [store_memory_tool, recall_memory_tool]  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Agent-Definition" class="common-anchor-header">Schritt 5 Agentendefinition</h3><p>Kerngedanke: Definition der Verhaltenslogik des Agenten.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Create Agent ====================  </span>
support_agent = Agent(  
   model=LLM_MODEL,  
   name=<span class="hljs-string">&quot;support_agent&quot;</span>,  
   description=<span class="hljs-string">&quot;Technical support expert agent that can remember and recall historical cases&quot;</span>,  
   <span class="hljs-comment"># Key: the instruction defines the agent’s behavior  </span>
   instruction=<span class="hljs-string">&quot;&quot;&quot;  
You are a technical support expert. Strictly follow the process below:  
&lt;b&gt;When the user asks a technical question:&lt;/b&gt;  
1. Immediately call the recall_memory tool to search for historical cases  
  - Parameter query: use the user’s question text directly  
  - Do not ask for any additional information; call the tool directly  
2. Answer based on the retrieval result:  
  - If relevant cases are found: explain that similar historical cases were found and answer by referencing their solutions  
  - If no cases are found: explain that this is a new issue and answer based on your own knowledge  
3. After answering, ask: “Did this solution resolve your issue?”  
&lt;b&gt;When the user confirms the issue is resolved:&lt;/b&gt;  
- Immediately call the store_memory tool to save this Q&amp;A  
- Parameter question: the user’s original question  
- Parameter solution: the complete solution you provided  
&lt;b&gt;Important rules:&lt;/b&gt;  
- You must call a tool before answering  
- Do not ask for user_id or any other parameters  
- Only store memory when you see confirmation phrases such as “resolved”, “it works”, or “thanks”  
&quot;&quot;&quot;</span>,  
   tools=memory_tools  
)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Main-Program-and-Execution-Flow" class="common-anchor-header">Schritt 6 Hauptprogramm und Ausführungsablauf</h3><p>Demonstriert den kompletten Prozess des sitzungsübergreifenden Speicherabrufs.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Main Program ====================  </span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Demonstrate cross-session memory recall&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Create Session service and Runner  </span>
   session_service = InMemorySessionService()  
   runner = Runner(  
       agent=support_agent,  
       app_name=APP_NAME,  
       session_service=session_service  
   )  
   <span class="hljs-comment"># ========== First round: build memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;First conversation: user asks a question and the solution is stored&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session1 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_001&quot;</span>  
   )  
   <span class="hljs-comment"># User asks the first question  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: What should I do if Milvus connection times out?&quot;</span>)  
   content1 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;What should I do if Milvus connection times out?&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content1  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># User confirms the issue is resolved  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: The issue is resolved, thanks!&quot;</span>)  
   content2 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;The issue is resolved, thanks!&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content2  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># ========== Second round: recall memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Second conversation: new session with memory recall&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session2 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_002&quot;</span>  
   )  
   <span class="hljs-comment"># User asks a similar question in a new session  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: Milvus can&#x27;t connect&quot;</span>)  
   content3 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;Milvus can&#x27;t connect&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session2.<span class="hljs-built_in">id</span>](http://session2.<span class="hljs-built_in">id</span>),  
       new_message=content3  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)

  
<span class="hljs-comment"># Program entry point  </span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:  
   Try:  
       asyncio.run(main())  
   <span class="hljs-keyword">except</span> KeyboardInterrupt:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n\\nProgram exited&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n\\nProgram error: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-keyword">import</span> traceback  
       traceback.print_exc()  
   Finally:  
       Try:  
           connections.disconnect(alias=<span class="hljs-string">&quot;default&quot;</span>)  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n✓ Disconnected from Milvus&quot;</span>)  
       Except:  
           <span class="hljs-keyword">pass</span>  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Run-and-Test" class="common-anchor-header">Schritt 7 Ausführen und Testen</h3><p><strong>(1) Setzen von Umgebungsvariablen</strong></p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-gemini-api-key&quot;</span>  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">python milvus_agent.py  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Expected-Output" class="common-anchor-header">Erwartete Ausgabe</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_5_0c5a37fe32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_3_cf3a60bd51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Ausgabe zeigt, wie das Speichersystem in der Praxis funktioniert.</p>
<p>In der ersten Konversation fragt der Benutzer, wie er mit einer Zeitüberschreitung der Milvus-Verbindung umgehen soll. Der Agent gibt eine Lösung vor. Nachdem der Benutzer bestätigt hat, dass das Problem gelöst ist, speichert der Agent diese Frage und die Antwort im Speicher.</p>
<p>In der zweiten Konversation beginnt eine neue Sitzung. Der Benutzer stellt die gleiche Frage mit anderen Worten: "Milvus kann keine Verbindung herstellen." Der Agent ruft automatisch einen ähnlichen Fall aus dem Speicher ab und gibt die gleiche Lösung.</p>
<p>Es sind keine manuellen Schritte erforderlich. Der Agent entscheidet, wann er frühere Fälle abruft und wann er neue speichert, und zeigt damit drei Schlüsselfähigkeiten: sitzungsübergreifendes Gedächtnis, semantischer Abgleich und Benutzerisolierung.</p>
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
    </button></h2><p>ADK trennt Kurzzeitkontext und Langzeitgedächtnis auf Framework-Ebene durch SessionService und MemoryService. <a href="https://milvus.io/">Milvus</a> übernimmt die semantische Suche und die Filterung auf Benutzerebene durch vektorbasiertes Retrieval.</p>
<p>Bei der Wahl eines Frameworks kommt es auf das Ziel an. Wenn Sie eine starke Statusisolierung, Auditierbarkeit und Produktionsstabilität benötigen, ist ADK die bessere Wahl. Wenn Sie Prototypen erstellen oder experimentieren möchten, bietet LangChain (ein beliebtes Python-Framework zur schnellen Erstellung von LLM-basierten Anwendungen und Agenten) mehr Flexibilität.</p>
<p>Der Schlüssel zum Agenten-Speicher ist die Datenbank. Das semantische Gedächtnis hängt von Vektordatenbanken ab, ganz gleich, welches Framework Sie verwenden. Milvus eignet sich gut, weil es quelloffen ist, lokal läuft, die Verarbeitung von Milliarden von Vektoren auf einem einzigen Rechner unterstützt und eine hybride Vektor-, Skalar- und Volltextsuche ermöglicht. Diese Funktionen eignen sich sowohl für frühe Tests als auch für den Produktionseinsatz.</p>
<p>Wir hoffen, dass dieser Artikel Ihnen hilft, das Design von Agentenspeichern besser zu verstehen und die richtigen Tools für Ihre Projekte auszuwählen.</p>
<p>Wenn Sie KI-Agenten entwickeln, die echten Speicher - und nicht nur größere Kontextfenster - benötigen, würden wir uns freuen, wenn Sie uns mitteilen, wie Sie dabei vorgehen.</p>
<p>Haben Sie Fragen zu ADK, Agenten-Speicherdesign oder zur Verwendung von Milvus als Speicher-Backend? Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>, um Ihren Anwendungsfall zu besprechen.</p>
