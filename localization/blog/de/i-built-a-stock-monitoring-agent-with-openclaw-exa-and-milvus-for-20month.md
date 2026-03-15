---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Ich habe einen Stock Monitoring Agent mit OpenClaw, Exa und Milvus für
  $20/Monat gebaut
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Eine Schritt-für-Schritt-Anleitung zum Aufbau eines
  KI-Aktienüberwachungsagenten mit OpenClaw, Exa und Milvus. Morning Briefs,
  Trade Memory und Alerts für $20/Monat.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Ich handle nebenbei mit US-Aktien, was eine höfliche Umschreibung dafür ist, dass ich als Hobby Geld verliere. Meine Kollegen scherzen, meine Strategie sei "bei Aufregung hoch kaufen, bei Angst niedrig verkaufen, wöchentlich wiederholen".</p>
<p>Der Teil mit der Wiederholung ist das, was mich umbringt. Jedes Mal, wenn ich auf den Markt starre, mache ich einen Handel, den ich nicht geplant hatte. Wenn der Ölpreis in die Höhe schießt, verkaufe ich in Panik. Die eine Tech-Aktie steigt um 4 %, und ich laufe ihr hinterher. Eine Woche später schaue ich mir meinen Handelsverlauf an und frage mich, <em>ob ich nicht genau das im letzten Quartal getan habe.</em></p>
<p>Also habe ich mit OpenClaw einen Agenten entwickelt, der den Markt an meiner Stelle beobachtet und mich davor bewahrt, dieselben Fehler zu machen. Er handelt nicht und fasst mein Geld nicht an; er hält mich davon ab, etwas zu tun, was ich schon einmal bereut habe.</p>
<p>Dieser Agent besteht aus drei Teilen und kostet etwa $20/Monat:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>, um alles auf Autopilot laufen zu lassen.</strong> OpenClaw lässt den Agenten im 30-Minuten-Takt laufen und pingt mich nur an, wenn etwas wirklich wichtig ist, was mich von der FOMO befreit, die mich früher am Bildschirm kleben ließ. Je mehr ich früher auf die Preise geachtet habe, desto mehr habe ich impulsiv reagiert.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>für präzise Echtzeit-Suchen.</strong> Exa durchsucht handverlesene Informationsquellen und fasst sie nach einem Zeitplan zusammen, so dass ich jeden Morgen ein sauberes Briefing erhalte. Vorher habe ich täglich eine Stunde damit verbracht, SEO-Spam und Spekulationen zu durchforsten, um verlässliche Nachrichten zu finden - und das konnte nicht automatisiert werden, weil Finanzseiten täglich aktualisiert werden, um Scraper zu bekämpfen.</li>
<li><strong><a href="https://milvus.io/">Milvus</a> für persönliche Historie und Präferenzen.</strong> Milvus speichert meine Handelshistorie, und der Agent durchsucht sie, bevor ich eine Entscheidung treffe - wenn ich im Begriff bin, etwas zu wiederholen, was ich bereue, sagt er es mir. Früher war es so mühsam, vergangene Transaktionen zu überprüfen, dass ich das einfach nicht gemacht habe, so dass die gleichen Fehler immer wieder bei anderen Tickern auftraten. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> ist die vollständig verwaltete Version von Milvus. Wenn Sie eine mühelose Erfahrung wünschen, ist Zilliz Cloud eine großartige Option<a href="https://cloud.zilliz.com/signup?utm_page=zilliz-cloud-free-tier&amp;utm_button=banner_left&amp;_gl=1*373c3v*_gcl_au*MjEwODY2Nzk5NS4xNzY5Njg1NzY4*_ga*MTU0OTAxMzY5Ni4xNzY5Njg1NzY4*_ga_Q1F8R2NWDP*czE3NzM0MDYzOTEkbzUwJGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..*_ga_KKMVYG8YF2*czE3NzM0MDYzOTEkbzc0JGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..">(kostenlose Stufe verfügbar</a>).</li>
</ul>
<p>Im Folgenden wird Schritt für Schritt beschrieben, wie ich es eingerichtet habe.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Schritt 1: Marktinformationen in Echtzeit mit Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Zuvor hatte ich versucht, Finanz-Apps zu durchsuchen, Scraper zu schreiben und professionelle Datenterminals zu nutzen. Apps haben das Signal unter Rauschen begraben, Scraper sind ständig kaputt gegangen, und professionelle APIs sind für institutionelle Händler zu teuer. Exa ist eine für KI-Agenten entwickelte Such-API, die die oben genannten Probleme löst.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_fa9d10fd00.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> ist eine Websuch-API, die strukturierte, KI-fähige Daten liefert. Sie wird von <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (dem vollständig verwalteten Dienst von Milvus) betrieben.  Wenn Perplexity eine Suchmaschine ist, die von Menschen benutzt wird, wird Exa von der KI benutzt. Der Agent sendet eine Anfrage, und Exa gibt Artikeltext, Schlüsselsätze und Zusammenfassungen als JSON zurück - eine strukturierte Ausgabe, die der Agent direkt parsen und bearbeiten kann, ohne dass Scraping erforderlich ist.</p>
<p>Exa verwendet auch eine semantische Suche unter der Haube, so dass der Agent in natürlicher Sprache abfragen kann. Eine Abfrage wie "Warum ist die NVIDIA-Aktie trotz starker Gewinne in Q4 2026 gefallen?" liefert Analystenaufschlüsselungen von Reuters und Bloomberg und nicht eine Seite mit SEO-Klickbait.</p>
<p>Exa hat eine kostenlose Stufe - 1.000 Suchanfragen pro Monat, was für den Anfang mehr als ausreichend ist. Um mitzumachen, installieren Sie das SDK und geben Sie Ihren eigenen API-Schlüssel ein:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Hier ist der Hauptaufruf:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Der Parameter "contents" übernimmt hier die meiste Arbeit - "text" ruft den gesamten Artikel ab, "highlights" extrahiert die wichtigsten Sätze, und "summary" erzeugt eine gezielte Zusammenfassung auf der Grundlage einer von Ihnen angegebenen Frage. Ein API-Aufruf ersetzt zwanzig Minuten Tab-Hopping.</p>
<p>Dieses Grundmuster deckt eine Menge ab, aber ich habe schließlich vier Variationen entwickelt, um verschiedene Situationen zu bewältigen, in die ich regelmäßig gerate:</p>
<ul>
<li><strong>Filtern nach Glaubwürdigkeit der Quelle.</strong> Für die Analyse von Gewinnen möchte ich nur Reuters, Bloomberg oder das Wall Street Journal - und keine Content-Farmen, die ihre Berichte zwölf Stunden später umschreiben.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Suche nach ähnlichen Analysen.</strong> Wenn ich einen guten Artikel lese, möchte ich weitere Perspektiven zu demselben Thema, ohne manuell danach suchen zu müssen.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Tiefensuche für komplexe Fragen.</strong> Manche Fragen lassen sich nicht mit einem einzigen Artikel beantworten, z. B. wie sich die Spannungen im Nahen Osten auf die Halbleiterlieferketten auswirken. Die Tiefensuche fasst mehrere Quellen zusammen und liefert strukturierte Zusammenfassungen.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Überwachung von Nachrichten in Echtzeit.</strong> Während der Börsenzeiten benötige ich aktuelle Nachrichten, die nur für den aktuellen Tag gefiltert sind.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>Ich habe etwa ein Dutzend Vorlagen mit diesen Mustern geschrieben, die die Fed-Politik, die Gewinne von Technologieunternehmen, die Ölpreise und Makroindikatoren abdecken. Sie werden jeden Morgen automatisch ausgeführt und senden die Ergebnisse an mein Telefon. Was früher eine Stunde lang dauerte, dauert jetzt nur noch fünf Minuten, wenn ich bei einem Kaffee die Zusammenfassungen lese.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Schritt 2: Speichern der Handelshistorie in Milvus für intelligentere Entscheidungen<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa hat mein Informationsproblem gelöst. Aber ich wiederholte immer noch dieselben Geschäfte - Panikverkäufe während Kurseinbrüchen, die sich innerhalb weniger Tage wieder erholten, und die Jagd nach dem Momentum in Aktien, die bereits überbewertet waren. Ich handelte aus einem Gefühl heraus, bedauerte es und vergaß die Lektion, wenn eine ähnliche Situation eintrat.</p>
<p>Ich brauchte eine persönliche Wissensbasis: meine vergangenen Geschäfte, meine Überlegungen, meine Fehler. Nicht etwas, das ich manuell durchgehen müsste (das hatte ich versucht und nie durchgehalten), sondern etwas, das der Agent selbständig durchsuchen könnte, wenn sich eine ähnliche Situation ergibt. Wenn ich im Begriff bin, einen Fehler zu wiederholen, möchte ich, dass der Agent mich darauf hinweist, bevor ich die Taste drücke. Der Abgleich von "aktueller Situation" und "früherer Erfahrung" ist ein Problem der Ähnlichkeitssuche, das von Vektordatenbanken gelöst wird, also mussten alle meine Daten in einer Datenbank gespeichert werden.</p>
<p>Ich habe <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> verwendet, eine leichtgewichtige Version von Milvus, die lokal und ohne Serverinstallation läuft. Sie ist perfekt für Prototypen und Experimente geeignet. Ich habe meine Daten in drei Sammlungen aufgeteilt. Die Einbettungsdimension ist 1536, um dem text-embedding-3-small-Modell von OpenAI zu entsprechen, das direkt verwendet werden kann:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Die drei Sammlungen entsprechen drei Arten von personenbezogenen Daten, die jeweils eine andere Suchstrategie erfordern:</p>
<table>
<thead>
<tr><th><strong>Typ</strong></th><th><strong>Was wird gespeichert</strong></th><th><strong>Wie der Agent sie verwendet</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Vorlieben</strong></td><td>Neigungen, Risikotoleranz, Anlagephilosophie ("Ich neige dazu, Technologieaktien zu lange zu halten")</td><td>Wird bei jedem Lauf in den Kontext des Agenten geladen</td></tr>
<tr><td><strong>Entscheidungen und Verhaltensmuster</strong></td><td>Spezifische frühere Geschäfte, Lektionen, Marktbeobachtungen</td><td>Abruf über Ähnlichkeitssuche nur bei Auftreten einer relevanten Situation</td></tr>
<tr><td><strong>Externes Wissen</strong></td><td>Forschungsberichte, SEC-Filings, öffentliche Daten</td><td>Nicht in Milvus gespeichert - durchsuchbar über Exa</td></tr>
</tbody>
</table>
<p>Diese in einer Sammlung zusammenzufassen, würde entweder bedeuten, dass jede Eingabeaufforderung mit irrelevanten Handelsdaten aufgebläht wird oder dass die wichtigsten Vorurteile verloren gehen, wenn sie nicht eng genug mit der aktuellen Anfrage übereinstimmen.</p>
<p>Sobald die Sammlungen existieren, muss der Agent sie automatisch befüllen. Ich möchte nicht nach jedem Gespräch Notizen schreiben, also habe ich einen Speicherextraktor entwickelt, der am Ende jeder Chatsitzung ausgeführt wird.</p>
<p>Er macht zwei Dinge: extrahieren und deduplizieren. Der Extraktor bittet den LLM, strukturierte Erkenntnisse aus dem Gespräch zu ziehen - Entscheidungen, Präferenzen, Muster, Lektionen - und leitet jede davon an die richtige Sammlung weiter. Bevor er etwas speichert, prüft er die Ähnlichkeit mit dem, was bereits vorhanden ist. Wenn eine neue Erkenntnis mehr als 92 % Ähnlichkeit mit einem bestehenden Eintrag aufweist, wird sie übersprungen.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Wenn ich mit einer neuen Marktsituation konfrontiert bin und den Drang verspüre, zu handeln, führt der Agent eine Rückruffunktion aus. Ich beschreibe, was gerade passiert, und der Agent sucht in allen drei Sammlungen nach relevanten Daten:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Als beispielsweise Anfang März Tech-Aktien aufgrund der Spannungen im Nahen Osten um 3 bis 4 % einbrachen, fand der Agent drei Dinge: eine Lektion vom Oktober 2024, dass man während einer geopolitischen Baisse keine Panikverkäufe tätigen sollte, eine Notiz, dass ich dazu neige, geopolitische Risiken überzugewichten, und ein von mir aufgezeichnetes Muster, dass sich geopolitisch bedingte Ausverkäufe von Tech-Aktien in der Regel innerhalb von ein bis drei Wochen erholen.</p>
<p>Mein Kollege nannte dies "Reinforcement Learning für Kleinanleger", wobei ich das Modell bin, das auf meine eigene Verlustfunktion hin trainiert wird. Na gut. Wenigstens gibt es jetzt eine Rückkopplungsschleife zwischen dem, was ich getan habe, und dem, was ich jetzt tun werde.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Schritt 3: Bringen Sie Ihrem Agenten bei, mit OpenClaw Skills zu analysieren<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Zu diesem Zeitpunkt hat der Agent gute Informationen<a href="https://exa.ai/">(Exa</a>) und ein persönliches Gedächtnis<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Aber wenn Sie beides einem LLM geben und sagen: "Analysieren Sie das", erhalten Sie eine generische, alles absichernde Antwort. Sie erwähnt jeden möglichen Aspekt und schließt mit "Investoren sollten die Risiken abwägen", mit anderen Worten: nichts.</p>
<p>Die Lösung besteht darin, einen eigenen Analyserahmen zu erstellen und ihn dem Agenten als ausdrückliche Anweisung mitzugeben. Auf welche Indikatoren Sie achten, welche Situationen Sie für gefährlich halten, wann Sie konservativ und wann Sie aggressiv vorgehen sollten. Diese Regeln sind für jeden Anleger anders, also müssen Sie sie selbst definieren.</p>
<p>OpenClaw macht dies über Skills - Markdown-Dateien in einem Verzeichnis skills/. Wenn der Agent auf eine relevante Situation stößt, lädt er den passenden Skill und folgt Ihrem Rahmen, anstatt frei zu agieren.</p>
<p>Hier ist ein Skill, den ich für die Bewertung von Aktien nach einem Gewinnbericht geschrieben habe:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>Die letzte Zeile ist die wichtigste: "Ich muss mir immer meine vergangenen Fehler vor Augen führen. Ich neige dazu, die Angst über die Daten zu stellen. Wenn meine Milvus-Historie zeigt, dass ich es bereut habe, nach einem Einbruch zu verkaufen, sagen Sie das ausdrücklich." Das ist ein Korrekturmechanismus, der speziell für meine Psychologie entwickelt wurde. Ihre Version würde Ihre eigenen Tendenzen verschlüsseln.</p>
<p>Ich habe ähnliche Skills für Stimmungsanalysen, Makroindikatoren und Sektorrotationssignale geschrieben. Ich habe auch Skills geschrieben, die simulieren, wie Investoren, die ich bewundere, die gleiche Situation bewerten würden - Buffetts Value Framework, Bridgewaters Makroansatz. Dies sind keine Entscheidungshilfen, sondern zusätzliche Perspektiven.</p>
<p>Eine Warnung: Lassen Sie LLMs nicht technische Indikatoren wie RSI oder MACD berechnen. Sie halluzinieren selbstbewusst Zahlen. Berechnen Sie diese selbst oder rufen Sie eine spezielle API auf und geben Sie die Ergebnisse als Input in den Skill ein.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Schritt 4: Starten Sie Ihren Agenten mit OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Alles, was Sie oben beschrieben haben, müssen Sie immer noch manuell auslösen. Wenn Sie jedes Mal, wenn Sie eine Aktualisierung wünschen, ein Terminal öffnen müssen, sind Sie wieder am Anfang - und wahrscheinlich wird Ihre Makler-App während der Besprechungen wieder zum Scheitern verurteilt sein.</p>
<p>Der Heartbeat-Mechanismus von OpenClaw behebt dieses Problem. Ein Gateway pingt den Agenten alle 30 Minuten an (konfigurierbar), und der Agent überprüft eine HEARTBEAT.md-Datei, um zu entscheiden, was in diesem Moment zu tun ist. Es handelt sich um eine Markdown-Datei mit zeitbasierten Regeln:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_1690efaffd.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Ergebnisse: Weniger Bildschirmzeit, weniger impulsive Trades<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>So sieht das System Tag für Tag aus:</p>
<ul>
<li><strong>Morgenbriefing (7:00 Uhr).</strong> Der Agent lässt Exa über Nacht laufen, zieht meine Positionen und den relevanten Verlauf aus Milvus und schickt mir eine personalisierte Zusammenfassung auf mein Telefon - weniger als 500 Wörter. Was über Nacht passiert ist, wie es sich auf meine Bestände auswirkt und ein bis drei Aktionspunkte. Ich lese sie, während ich mir die Zähne putze.</li>
<li><strong>Intraday-Benachrichtigungen (9:30 AM-4:00 PM ET).</strong> Alle 30 Minuten überprüft der Agent meine Watchlist. Wenn sich eine Aktie um mehr als 3 % bewegt, erhalte ich eine Benachrichtigung mit dem Kontext: warum ich sie gekauft habe, wo mein Stop-Loss liegt und ob ich mich schon einmal in einer ähnlichen Situation befunden habe.</li>
<li><strong>Wöchentlicher Rückblick (am Wochenende).</strong> Der Agent fasst die gesamte Woche zusammen - Marktbewegungen, wie sie im Vergleich zu meinen morgendlichen Erwartungen verlaufen sind, und Muster, an die man sich erinnern sollte. Am Samstag verbringe ich 30 Minuten damit, sie zu lesen. Den Rest der Woche bleibe ich absichtlich vom Bildschirm weg.</li>
</ul>
<p>Dieser letzte Punkt ist die größte Veränderung. Der Agent spart nicht nur Zeit, er befreit mich auch von der Marktbeobachtung. Man kann nicht in Panik verkaufen, wenn man die Preise nicht im Auge hat.</p>
<p>Vor diesem System verbrachte ich 10 bis 15 Stunden pro Woche mit dem Sammeln von Informationen, der Marktbeobachtung und der Überprüfung von Geschäften, verteilt auf Meetings, Pendlerzeiten und nächtliches Scrollen. Jetzt sind es etwa zwei Stunden: fünf Minuten für das morgendliche Briefing und 30 Minuten für die Überprüfung am Wochenende.</p>
<p>Auch die Qualität der Informationen ist besser geworden. Ich lese Zusammenfassungen von Reuters und Bloomberg und nicht mehr das, was sich auf Twitter verbreitet hat. Und da der Agent jedes Mal, wenn ich in Versuchung gerate zu handeln, meine Fehler aus der Vergangenheit aufruft, habe ich meine impulsiven Trades deutlich reduziert. Ich kann noch nicht beweisen, dass ich dadurch ein besserer Anleger geworden bin, aber ich bin weniger leichtsinnig geworden.</p>
<p>Die Gesamtkosten: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>10/Monat</mi><mn>für OpenClaw</mn><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">10/Monat für OpenClaw,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02691em;">10/Monat</span><span class="mord">für OpenClaw</span><span class="mpunct">,</span></span></span></span>10/Monat für Exa und ein bisschen Strom, um Milvus Lite am Laufen zu halten.</p>
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
    </button></h2><p>Ich machte immer wieder dieselben impulsiven Trades, weil meine Informationen schlecht waren, ich meine eigene Geschichte selten überprüfte und es noch schlimmer machte, den ganzen Tag auf den Markt zu starren. Also habe ich einen KI-Agenten entwickelt, der diese Probleme löst, indem er drei Dinge tut:</p>
<ul>
<li><strong>Er sammelt</strong> <strong>mit Hilfe von</strong> <strong><a href="https://exa.ai/">Exa</a></strong><strong>automatisch verlässliche Marktnachrichten</strong>, so dass ich jeden Morgen mit einem sauberen Briefing beginne, anstatt eine Stunde lang den Untergang zu verfolgen.</li>
<li><strong>Er erinnert sich an meine vergangenen Geschäfte mit <a href="https://milvus.io/">Milvus</a> und warnt mich</strong>, wenn ich im Begriff bin, einen Fehler zu wiederholen, indem er Milvus als persönliche Vektordatenbank nutzt.</li>
<li><strong>Läuft auf</strong> <strong>OpenClaw-Autopilot und pingt mich nur an, wenn es wichtig ist</strong>, unter Verwendung von OpenClaw Skills und Heartbeat - keine Cron-Jobs, kein Glue-Code.</li>
</ul>
<p>Gesamtkosten: $20/Monat. Der Agent handelt nicht und rührt mein Geld nicht an.</p>
<p>Die größte Veränderung waren nicht die Daten oder die Warnungen. Es war, dass ich aufgehört habe, den Markt zu beobachten. Letzten Mittwoch habe ich ihn völlig vergessen, was in den Jahren meines Handels noch nie passiert ist. Ich verliere zwar immer noch manchmal Geld, aber viel seltener, und ich genieße meine Wochenenden wieder richtig. Meine Kollegen haben den Witz noch nicht aktualisiert, aber warten Sie es ab.</p>
<p>Der Aufbau des Agenten hat auch nur zwei Wochenenden gedauert. Vor einem Jahr hätte das gleiche Setup bedeutet, dass man Zeitplaner, Benachrichtigungspipelines und Speicherverwaltung von Grund auf neu hätte schreiben müssen. Bei OpenClaw ging die meiste Zeit in die Klärung meiner eigenen Handelsregeln und nicht in die Entwicklung der Infrastruktur.</p>
<p>Und wenn man es einmal für einen Anwendungsfall gebaut hat, ist die Architektur portabel.  Tauschen Sie die Exa-Suchvorlagen gegen die OpenClaw-Skills aus, und schon haben Sie einen Agenten, der Forschungsarbeiten überwacht, Konkurrenten verfolgt, regulatorische Änderungen beobachtet oder Störungen in der Lieferkette verfolgt.</p>
<p>Wenn Sie es ausprobieren möchten:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstart</a></strong> - in weniger als fünf Minuten eine lokale Vektordatenbank einrichten</li>
<li><strong>OpenClaw-Dokumente</strong> - richten Sie Ihren ersten Agenten mit Skills und Heartbeat ein</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 1.000 kostenlose Suchanfragen pro Monat zum Start</li>
</ul>
<p>Haben Sie Fragen, brauchen Sie Hilfe bei der Fehlersuche oder wollen Sie einfach zeigen, was Sie gebaut haben? Treten Sie dem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal von Milvus</a> bei - das ist der schnellste Weg, um Hilfe von der Community und dem Team zu erhalten. Und wenn Sie Ihre Einrichtung lieber unter vier Augen besprechen möchten, buchen Sie eine 20-minütige <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus-Sprechstunde.</a></p>
<h2 id="Keep-Reading" class="common-anchor-header">Lesen Sie weiter<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (ehemals Clawdbot &amp; Moltbot) erklärt: Ein vollständiger Leitfaden für den autonomen KI-Agenten</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Schritt-für-Schritt-Anleitung zur Einrichtung von OpenClaw (ehemals Clawdbot/Moltbot) mit Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Warum KI-Agenten wie OpenClaw Token verbrauchen und wie man die Kosten senken kann</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Wir haben das Speichersystem von OpenClaw extrahiert und als Open-Source angeboten (memsearch)</a></li>
</ul>
