---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  GPT-5 Testbericht: Höhere Genauigkeit, niedrigere Preise, starker Code - aber
  schlecht für die Kreativität
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  Für Entwickler, insbesondere für diejenigen, die Agenten und RAG-Pipelines
  erstellen, ist diese Version möglicherweise das bisher nützlichste Upgrade.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Nach monatelangen Spekulationen hat OpenAI endlich</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>ausgeliefert</strong><strong>.</strong> Das Modell ist nicht der kreative Blitzschlag, der GPT-4 war, aber für Entwickler, insbesondere für diejenigen, die Agenten und RAG-Pipelines erstellen, könnte diese Version im Stillen das bisher nützlichste Upgrade sein.</p>
<p><strong>TL;DR für Entwickler:</strong> GPT-5 vereinheitlicht die Architekturen, verbessert die multimodale E/A, reduziert die Fehlerrate, erweitert den Kontext auf 400k Token und macht den Einsatz in großem Maßstab erschwinglich. Die Kreativität und das literarische Gespür haben jedoch einen deutlichen Rückschritt gemacht.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">Was ist das Neue unter der Haube?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Vereinheitlichter Kern</strong> - Verschmelzung der digitalen GPT-Reihe mit den Schlussfolgerungsmodellen der o-Reihe, wodurch langkettige Schlussfolgerungen und multimodale Schlussfolgerungen in einer einzigen Architektur möglich sind.</p></li>
<li><p><strong>Multimodales Gesamtspektrum</strong> - Eingabe/Ausgabe von Text, Bild, Audio und Video, alles innerhalb desselben Modells.</p></li>
<li><p><strong>Massive Genauigkeitssteigerung</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% weniger sachliche Fehler im Vergleich zu GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% weniger sachliche Fehler im Vergleich zu o3.</p></li>
</ul></li>
<li><p><strong>Steigerung der Fähigkeiten in den Bereichen</strong> Codegenerierung, mathematisches Denken, Gesundheitsberatung und strukturiertes Schreiben; deutlich weniger Halluzinationen.</p></li>
</ul>
<p>Neben GPT-5 hat OpenAI auch <strong>drei weitere Varianten</strong> veröffentlicht, die jeweils für unterschiedliche Anforderungen optimiert sind:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Modell</strong></th><th><strong>Beschreibung</strong></th><th><strong>Eingabe / $ pro 1M Token</strong></th><th><strong>Ausgabe / $ pro 1M Token</strong></th><th><strong>Wissen aktualisieren</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Hauptmodell, langkettige Argumentation + vollständige Multimodalität</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Äquivalent zu gpt-5, verwendet in ChatGPT-Gesprächen</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% billiger, behält ~90% der Programmierleistung</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/Offline, 32K Kontext, Latenz &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 brach Rekorde in 25 Benchmark-Kategorien - von der Code-Reparatur über multimodales Reasoning bis hin zu medizinischen Aufgaben - mit beständigen Genauigkeitsverbesserungen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Warum es für Entwickler wichtig sein sollte - besonders für RAG und Agenten<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Unsere praktischen Tests deuten darauf hin, dass diese Version eine stille Revolution für Retrieval-Augmented Generation und agentengesteuerte Arbeitsabläufe darstellt.</p>
<ol>
<li><p><strong>Preissenkungen</strong> machen Experimente möglich - API-Inputkosten: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,25 pro Million</mn><mi>Token</mi><mo separator="true">∗∗;</mo><mi>Outputkosten</mi><mo>:∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 pro Million Token**; Outputkosten: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25proMillionToken</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mpunct"> ∗;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span>:<span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Ein 400k-Kontextfenster</strong> (im Vergleich zu 128k in o3/4o) ermöglicht es Ihnen, den Status über komplexe mehrstufige Agenten-Workflows hinweg beizubehalten, ohne dass der Kontext unterbrochen wird.</p></li>
<li><p><strong>Weniger Halluzinationen und bessere Werkzeugnutzung</strong> - Unterstützt mehrstufige verkettete Werkzeugaufrufe, bewältigt komplexe Nicht-Standardaufgaben und verbessert die Ausführungssicherheit.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Nicht ohne Schwächen<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Trotz seiner technischen Fortschritte zeigt GPT-5 immer noch deutliche Grenzen auf.</p>
<p>Auf der Keynote von OpenAI wurde eine Folie gezeigt, auf der bizarrerweise <em>52,8 &gt; 69,1 = 30,8</em> berechnet wurde, und in unseren eigenen Tests wiederholte das Modell selbstbewusst die aus dem Lehrbuch stammende, aber falsche Erklärung des "Bernoulli-Effekts" für den Auftrieb eines Flugzeugs - was uns daran erinnert, dass <strong>es immer noch ein Musterschüler und kein echter Fachmann ist.</strong></p>
<p><strong>Während sich die MINT-Leistung verbessert hat, ist die kreative Tiefe gesunken.</strong> Viele langjährige Nutzer stellen einen Rückgang des literarischen Flairs fest: Gedichte wirken flacher, philosophische Gespräche weniger nuanciert und lange Erzählungen mechanischer. Der Nachteil liegt auf der Hand: Die höhere sachliche Genauigkeit und die stärkere Argumentation in technischen Bereichen gehen auf Kosten des kunstvollen, forschenden Tons, der GPT einst fast menschlich erscheinen ließ.</p>
<p>Sehen wir uns nun an, wie GPT-5 in unseren praktischen Tests abschneidet.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Codierung der Tests<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich begann mit einer einfachen Aufgabe: Schreiben Sie ein HTML-Skript, das es dem Benutzer ermöglicht, ein Bild hochzuladen und es mit der Maus zu bewegen. GPT-5 pausierte etwa neun Sekunden lang und produzierte dann einen funktionierenden Code, der die Interaktion gut bewältigte. Das war schon mal ein guter Anfang.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die zweite Aufgabe war schwieriger: die Erkennung von Kollisionen zwischen Polygonen und Kugeln in einem rotierenden Sechseck, mit einstellbarer Rotationsgeschwindigkeit, Elastizität und Kugelanzahl. GPT-5 erstellte die erste Version in etwa dreizehn Sekunden. Der Code enthielt alle erwarteten Funktionen, war aber fehlerhaft und ließ sich nicht ausführen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ich habe dann die Option <strong>Fehler beheben</strong> des Editors verwendet, und GPT-5 hat die Fehler korrigiert, so dass das Sechseck gerendert wurde. Die Kugeln erschienen jedoch nie - die Spawn-Logik fehlte oder war fehlerhaft, d. h. die Kernfunktion des Programms war trotz des ansonsten vollständigen Setups nicht vorhanden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Zusammenfassend lässt sich sagen, dass</strong> GPT-5 sauberen, gut strukturierten interaktiven Code erzeugen und einfache Laufzeitfehler beheben kann. In komplexen Szenarien besteht jedoch immer noch die Gefahr, dass wesentliche Logik ausgelassen wird, so dass eine menschliche Überprüfung und Iteration vor dem Einsatz erforderlich ist.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Test des logischen Denkens<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich habe ein mehrstufiges Logikrätsel gestellt, das Farben, Preise und Positionsangaben von Artikeln enthält - etwas, für dessen Lösung die meisten Menschen mehrere Minuten benötigen würden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Frage:</strong> <em>Was ist der blaue Gegenstand und wie hoch ist sein Preis?</em></p>
<p>GPT-5 lieferte die richtige Antwort in nur 9 Sekunden, mit einer klaren und logisch fundierten Erklärung. Dieser Test bestätigte die Stärke des Modells in Bezug auf strukturiertes Denken und schnelle Schlussfolgerungen.</p>
<h2 id="Writing-Test" class="common-anchor-header">Schriftlicher Test<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich wende mich oft an ChatGPT, wenn ich Hilfe bei Blogs, Beiträgen in sozialen Medien und anderen schriftlichen Inhalten benötige, daher ist die Texterstellung eine der Fähigkeiten, auf die ich am meisten Wert lege. Für diesen Test bat ich GPT-5, einen LinkedIn-Beitrag auf der Grundlage eines Blogs über den mehrsprachigen Analysator von Milvus 2.6 zu erstellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Ergebnis war gut organisiert und traf alle wichtigen Punkte des ursprünglichen Blogs, aber es fühlte sich zu förmlich und vorhersehbar an - eher wie eine Pressemitteilung eines Unternehmens als etwas, das Interesse in einem sozialen Feed wecken sollte. Es fehlte die Wärme, der Rhythmus und die Persönlichkeit, die einen Beitrag menschlich und einladend wirken lassen.</p>
<p>Positiv zu vermerken ist, dass die begleitenden Illustrationen hervorragend waren: klar, markengerecht und perfekt auf den technischen Stil von Zilliz abgestimmt. Visuell war es genau richtig; der Text braucht nur ein bisschen mehr kreative Energie, um zu passen.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Längeres Kontextfenster = Tod von RAG und VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben uns mit diesem Thema letztes Jahr beschäftigt, als <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google <strong>Gemini 1.5 Pro</strong></a> mit seinem ultralangen Kontextfenster mit 10 Millionen Token <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">auf den Markt brachte</a>. Damals sagten einige Leute schnell das Ende von RAG und sogar das Ende von Datenbanken insgesamt voraus. Heute ist RAG nicht nur noch am Leben, sondern floriert. In der Praxis <em>ist</em> sie leistungsfähiger und produktiver geworden, zusammen mit Vektordatenbanken wie <a href="https://milvus.io/"><strong>Milvus</strong></a> und <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Jetzt, mit der erweiterten Kontextlänge von GPT-5 und den fortschrittlicheren Funktionen zum Aufrufen von Werkzeugen, stellt sich die Frage erneut: <em>Brauchen wir noch Vektordatenbanken für die Kontexterfassung oder sogar spezielle Agenten/RAG-Pipelines?</em></p>
<p><strong>Die kurze Antwort: absolut ja. Wir brauchen sie immer noch.</strong></p>
<p>Längerer Kontext ist nützlich, aber er ist kein Ersatz für strukturierte Abfragen. Multi-Agenten-Systeme sind immer noch auf dem besten Weg, ein langfristiger architektonischer Trend zu werden - und diese Systeme benötigen oft einen praktisch unbegrenzten Kontext. Und wenn es darum geht, private, unstrukturierte Daten sicher zu verwalten, wird eine Vektordatenbank immer die letzte Instanz sein.</p>
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
    </button></h2><p>Nachdem ich mir die OpenAI-Veranstaltung zur Markteinführung angesehen und meine eigenen praktischen Tests durchgeführt habe, fühlt sich GPT-5 weniger wie ein dramatischer Sprung nach vorn an, sondern eher wie eine raffinierte Mischung aus den Stärken der Vergangenheit mit ein paar gut platzierten Upgrades. Das ist nichts Schlechtes - es ist ein Zeichen für die Grenzen der Architektur und der Datenqualität, an die große Modelle allmählich stoßen.</p>
<p>Wie das Sprichwort sagt, <em>kommt schwere Kritik von hohen Erwartungen</em>. Jegliche Enttäuschung über GPT-5 kommt hauptsächlich von der sehr hohen Messlatte, die OpenAI für sich selbst gesetzt hat. Und wirklich - bessere Genauigkeit, niedrigere Preise und integrierte multimodale Unterstützung sind immer noch wertvolle Gewinne. Für Entwickler, die Agenten und RAG-Pipelines erstellen, ist dies vielleicht sogar das bisher nützlichste Upgrade.</p>
<p>Einige Freunde haben sich darüber lustig gemacht, "Online-Gedenkstätten" für GPT-4o zu erstellen und zu behaupten, die Persönlichkeit ihres alten Chat-Begleiters sei für immer verschwunden. Mir macht die Veränderung nichts aus - GPT-5 ist vielleicht weniger warmherzig und gesprächig, aber sein direkter, schnörkelloser Stil wirkt erfrischend geradlinig.</p>
<p><strong>Wie sieht es bei Ihnen aus?</strong> Teilen Sie uns Ihre Meinung mit - nehmen Sie an unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> teil oder beteiligen Sie sich an der Diskussion auf <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> und <a href="https://x.com/milvusio">X</a>.</p>
