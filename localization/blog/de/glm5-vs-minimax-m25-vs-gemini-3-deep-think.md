---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: Welches Modell passt zu Ihrem
  KI-Agentenstapel?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Praktischer Vergleich von GLM-5, MiniMax M2.5 und Gemini 3 Deep Think für
  Kodierung, logisches Denken und KI-Agenten. Enthält ein RAG-Tutorial mit
  Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>In etwas mehr als zwei Tagen wurden drei große Modelle hintereinander veröffentlicht: GLM-5, MiniMax M2.5 und Gemini 3 Deep Think. Alle drei bieten dieselben Funktionen: <strong>Kodierung, Deep Reasoning und agentenbasierte Arbeitsabläufe.</strong> Alle drei versprechen Ergebnisse auf dem neuesten Stand der Technik. Wenn man sich die technischen Daten ansieht, könnte man fast ein Matching-Spiel spielen und bei allen dreien die gleichen Argumente herausfinden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der erschreckende Gedanke? Ihr Chef hat die Ankündigungen wahrscheinlich schon gesehen und erwartet von Ihnen, dass Sie noch vor Ende der Woche neun interne Anwendungen mit den drei Modellen entwickeln.</p>
<p>Worin unterscheiden sich diese Modelle eigentlich? Wie sollten Sie zwischen ihnen wählen? Und (wie immer) wie verbinden Sie sie mit <a href="https://milvus.io/">Milvus</a>, um eine interne Wissensdatenbank zu erstellen? Merken Sie sich diese Seite vor. Hier finden Sie alles, was Sie brauchen.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 und Gemini 3 Deep Think auf einen Blick<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 ist führend in der komplexen Systementwicklung und bei Agentenaufgaben mit langem Zeithorizont</h3><p>Am 12. Februar brachte Zhipu offiziell den GLM-5 auf den Markt, der sich durch komplexe Systemtechnik und langlaufende Agenten-Workflows auszeichnet.</p>
<p>Das Modell hat 355B-744B Parameter (40B aktiv), trainiert auf 28,5T Token. Es integriert spärliche Aufmerksamkeitsmechanismen mit einem asynchronen Reinforcement-Learning-Framework namens Slime, wodurch es in der Lage ist, extrem lange Kontexte ohne Qualitätsverlust zu bewältigen und gleichzeitig die Bereitstellungskosten niedrig zu halten.</p>
<p>GLM-5 führte das Open-Source-Rudel bei wichtigen Benchmarks an und belegte Platz 1 beim SWE-Bench Verified (77,8) und Platz 1 beim Terminal Bench 2.0 (56,2) - vor MiniMax 2.5 und Gemini 3 Deep Think. Dennoch liegen die Ergebnisse noch hinter den besten Closed-Source-Modellen wie Claude Opus 4.5 und GPT-5.2. In Vending Bench 2, einer Bewertung der Geschäftssimulation, erwirtschaftete GLM-5 einen simulierten Jahresgewinn von 4.432 $ und liegt damit in etwa in der gleichen Größenordnung wie Closed-Source-Systeme.</p>
<p>GLM-5 hat auch seine Fähigkeiten im Bereich der Systemtechnik und der Agenten mit langem Zeithorizont erheblich verbessert. Es kann nun Text oder Rohmaterial direkt in .docx-, .pdf- und .xlsx-Dateien konvertieren und spezifische Ergebnisse wie Produktanforderungsdokumente, Unterrichtspläne, Prüfungen, Tabellenkalkulationen, Finanzberichte, Flussdiagramme und Menüs erstellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think setzt neue Maßstäbe für wissenschaftliches Denken</h3><p>In den frühen Morgenstunden des 13. Februar 2026 hat Google offiziell Gemini 3 Deep Think veröffentlicht, ein wichtiges Upgrade, das ich (vorläufig) als das stärkste Forschungs- und Denkmodell der Welt bezeichnen möchte. Schließlich war Gemini das einzige Modell, das den Autowaschtest bestanden hat: "<em>Ich möchte mein Auto waschen und die Waschanlage ist nur 50 Meter entfernt. Soll ich mein Auto starten und dorthin fahren oder einfach laufen</em>?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Seine Hauptstärke ist die erstklassige Denk- und Wettbewerbsleistung: Er erreichte 3455 Elo bei Codeforces, was dem achtbesten Wettbewerbsprogrammierer der Welt entspricht. In den schriftlichen Teilen der internationalen Physik-, Chemie- und Mathematikolympiade 2025 erreichte es die Goldmedaille. Die Kosteneffizienz ist ein weiterer Durchbruch. ARC-AGI-1 kostet nur 7,17 $ pro Aufgabe, eine 280- bis 420-fache Reduzierung im Vergleich zu OpenAIs o3-preview von vor 14 Monaten. Was die Anwendung betrifft, so liegen die größten Fortschritte von Deep Think in der wissenschaftlichen Forschung. Experten nutzen es bereits für das Peer-Review von mathematischen Facharbeiten und für die Optimierung komplexer Arbeitsabläufe bei der Kristallzüchtung.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 konkurriert bei Kosten und Geschwindigkeit für Produktionsworkloads</h3><p>Am selben Tag veröffentlichte MiniMax M2.5 und positionierte es als Kosten- und Effizienz-Champion für Produktionsanwendungen.</p>
<p>Als eine der schnellsten Modellfamilien der Branche setzt M2.5 neue SOTA-Resultate in den Bereichen Codierung, Tool Calling, Suche und Office-Produktivität. Die Kosten sind sein größtes Verkaufsargument: Die schnelle Version läuft mit etwa 100 TPS, wobei die Eingabe mit <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 Millionen Token</mn><mi>und</mi><mn>die Ausgabe mit 0</mn></mrow><annotation encoding="application/x-tex">,30 pro Million Token und die Ausgabe mit</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>mit 0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 Millionen Token und die Ausgabe mit</span><span class="mord mathnormal">2</span></span></span></span>,40 pro Million Token berechnet wird. Die Version mit 50 TPS senkt die Produktionskosten noch einmal um die Hälfte. Die Geschwindigkeit hat sich gegenüber dem Vorgängermodell M2.1 um 37 % verbessert, und es erledigt SWE-bench-verifizierte Aufgaben in durchschnittlich 22,8 Minuten, was in etwa dem Claude Opus 4.6 entspricht. Auf der Fähigkeitsseite unterstützt M2.5 die Full-Stack-Entwicklung in mehr als 10 Sprachen, einschließlich Go, Rust und Kotlin, und deckt alles vom Null-zu-Eins-Systemdesign bis zur vollständigen Codeüberprüfung ab. Für Office-Workflows bietet die Funktion Office Skills eine tiefe Integration mit Word, PPT und Excel. In Kombination mit Fachwissen in den Bereichen Finanzen und Recht können Forschungsberichte und Finanzmodelle erstellt werden, die direkt verwendet werden können.</p>
<p>Das ist der allgemeine Überblick. Als Nächstes wollen wir uns ansehen, wie sie in praktischen Tests abschneiden.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Praktische Vergleiche<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Rendering von 3D-Szenen: Gemini 3 Deep Think liefert die realistischsten Ergebnisse</h3><p>Wir haben eine Eingabeaufforderung, die Benutzer bereits mit Gemini 3 Deep Think getestet hatten, für einen direkten Vergleich durch GLM-5 und MiniMax M2.5 laufen lassen. Die Aufforderung: Erstellen Sie eine komplette Three.js-Szene in einer einzigen HTML-Datei, die einen vollständig in 3D gestalteten Innenraum wiedergibt, der von einem klassischen Ölgemälde in einem Museum nicht zu unterscheiden ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Deep Think</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> lieferte das beste Ergebnis. Es hat die Eingabeaufforderung genau interpretiert und eine hochwertige 3D-Szene erzeugt. Besonders hervorzuheben ist die Beleuchtung: Schattenrichtung und -abfall sahen natürlich aus und vermittelten deutlich die räumliche Beziehung von natürlichem Licht, das durch ein Fenster fällt. Auch die feinen Details waren beeindruckend, darunter die halb geschmolzene Textur von Kerzen und die Materialqualität von roten Wachssiegeln. Die visuelle Wiedergabetreue war insgesamt hoch.</p>
<p><strong>GLM-5</strong> zeichnete sich durch eine detaillierte Objektmodellierung und Texturierung aus, aber sein Beleuchtungssystem wies deutliche Probleme auf. Tischschatten wurden als harte, rein schwarze Blöcke ohne weiche Übergänge gerendert. Das Wachssiegel schien über der Tischoberfläche zu schweben, und die Kontaktbeziehung zwischen Objekten und der Tischplatte wurde nicht korrekt behandelt. Diese Artefakte deuten darauf hin, dass die globale Beleuchtung und das räumliche Vorstellungsvermögen verbessert werden müssen.</p>
<p><strong>MiniMax M2.5</strong> konnte die komplexe Szenenbeschreibung nicht effektiv analysieren. Die Ausgabe war lediglich eine ungeordnete Partikelbewegung, was auf erhebliche Einschränkungen sowohl beim Verständnis als auch bei der Generierung von mehrschichtigen semantischen Anweisungen mit genauen visuellen Anforderungen hinweist.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG-Generierung: Alle drei Modelle gehen unterschiedlich damit um</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Aufforderung:</strong> Erzeugen Sie ein SVG eines kalifornischen braunen Pelikans auf einem Fahrrad. Das Fahrrad muss Speichen und einen korrekt geformten Fahrradrahmen haben. Der Pelikan muss seinen charakteristischen großen Beutel haben, und es sollte ein deutliches Gefieder zu sehen sein. Der Pelikan muss deutlich in die Pedale des Fahrrads treten. Das Bild sollte das volle Brutgefieder des kalifornischen Braunpelikans zeigen.</p>
<p><strong>Zwillinge 3 Deep Think</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemini 3 Deep Think</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong> produzierte das vollständigste SVG insgesamt. Die Fahrhaltung des Pelikans ist akkurat: Sein Schwerpunkt liegt natürlich auf dem Sitz, und seine Füße ruhen auf den Pedalen in einer dynamischen Radfahrerpose. Die Federtextur ist detailliert und mehrschichtig. Der einzige Schwachpunkt ist, dass der charakteristische Kehlsack des Pelikans zu groß gezeichnet ist, was die Gesamtproportionen etwas stört.</p>
<p><strong>GLM-5</strong> hatte deutliche Haltungsprobleme. Die Füße sind korrekt auf den Pedalen platziert, aber die gesamte Sitzposition weicht von einer natürlichen Fahrhaltung ab, und das Verhältnis zwischen Körper und Sitz sieht falsch aus. Abgesehen davon ist die Detailarbeit solide: Der Kehlsack ist gut proportioniert, und die Qualität der Federtextur ist respektabel.</p>
<p><strong>MiniMax M2.5</strong> hat sich für einen minimalistischen Stil entschieden und auf Hintergrundelemente ganz verzichtet. Die Position des Pelikans auf dem Fahrrad ist ungefähr richtig, aber die Detailarbeit ist mangelhaft. Der Lenker hat die falsche Form, die Federtextur ist so gut wie nicht vorhanden, der Hals ist zu dick, und es gibt einige weiße ovale Artefakte im Bild, die dort nicht hingehören.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Wie man sich zwischen GLM-5, MiniMax M2.5 und Gemin 3 Deep Think entscheidet<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei all unseren Tests war MiniMax M2.5 am langsamsten und benötigte die längste Zeit zum Nachdenken und Überlegen. GLM-5 zeigte eine konstante Leistung und war in Bezug auf die Geschwindigkeit ungefähr gleichauf mit Gemini 3 Deep Think.</p>
<p>Hier ist eine kurze Auswahlhilfe, die wir zusammengestellt haben:</p>
<table>
<thead>
<tr><th>Hauptanwendungsfall</th><th>Empfohlenes Modell</th><th>Hauptstärken</th></tr>
</thead>
<tbody>
<tr><td>Wissenschaftliche Forschung, fortgeschrittenes logisches Denken (Physik, Chemie, Mathematik, Entwurf komplexer Algorithmen)</td><td>Gemini 3 Deep Think</td><td>Goldmedaillengewinner in akademischen Wettbewerben. Wissenschaftliche Datenüberprüfung auf höchstem Niveau. Wettbewerbsfähige Programmierung auf Weltklasseniveau bei Codeforces. Bewährte Forschungsanwendungen, einschließlich der Identifizierung von logischen Fehlern in Fachartikeln. (Derzeit auf Google AI Ultra-Abonnenten und ausgewählte Unternehmensnutzer beschränkt; die Kosten pro Aufgabe sind relativ hoch).</td></tr>
<tr><td>Open-Source-Bereitstellung, Intranet-Anpassung für Unternehmen, vollständige Entwicklung, Integration von Office-Fähigkeiten</td><td>Zhipu GLM-5</td><td>Erstklassiges Open-Source-Modell. Starke technische Fähigkeiten auf Systemebene. Unterstützt den lokalen Einsatz mit überschaubaren Kosten.</td></tr>
<tr><td>Kostensensitive Workloads, mehrsprachige Programmierung, plattformübergreifende Entwicklung (Web/Android/iOS/Windows), Office-Kompatibilität</td><td>MiniMax M2.5</td><td>Bei 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 Millionen</mn><mi>Eingabetoken</mi><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">0,30 pro Million Eingabetoken,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 Millionen</span><span class="mord mathnormal">Eingabetoken</span><span class="mpunct">,</span></span></span></span>2,40 pro Million Ausgabetoken. SOTA über Büro-, Codierungs- und Tool-Calling-Benchmarks hinweg. Erster Platz im Multi-SWE-Bench. Starke Generalisierung. Bestehensraten auf Droid/OpenCode übertreffen Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAG-Lehrgang: Verkabelung von GLM-5 mit Milvus für eine Wissensdatenbank<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Sowohl GLM-5 als auch MiniMax M2.5 sind über <a href="https://openrouter.ai/">OpenRouter</a> erhältlich. Melden Sie sich an und erstellen Sie eine <code translate="no">OPENROUTER_API_KEY</code>, um loszulegen.</p>
<p>In dieser Anleitung wird der GLM-5 von Zhipu als Beispiel-LLM verwendet. Um stattdessen MiniMax zu verwenden, ändern Sie einfach den Modellnamen in <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Abhängigkeiten und Einrichtung der Umgebung</h3><p>Installieren Sie pymilvus, openai, requests und tqdm oder aktualisieren Sie sie auf ihre neuesten Versionen:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Dieses Tutorial verwendet GLM-5 als LLM und OpenAIs text-embedding-3-small als Einbettungsmodell.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Vorbereitung der Daten</h3><p>Wir werden die FAQ-Seiten aus der Milvus 2.4.x Dokumentation als private Wissensbasis verwenden.</p>
<p>Laden Sie die Zip-Datei herunter und entpacken Sie die Dokumente in einen Ordner <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Laden Sie alle Markdown-Dateien von <code translate="no">milvus_docs/en/faq</code>. Wir teilen jede Datei auf <code translate="no">&quot;# &quot;</code> auf, um den Inhalt grob nach Hauptabschnitten zu trennen:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">Einrichtung des LLM und des Einbettungsmodells</h3><p>Wir werden GLM-5 als LLM und text-embedding-3-small als Einbettungsmodell verwenden:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Erzeugen Sie eine Testeinbettung und geben Sie ihre Abmessungen und die ersten Elemente aus:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Laden der Daten in Milvus</h3><p><strong>Erstellen Sie eine Sammlung:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ein Hinweis zur Konfiguration des MilvusClients:</p>
<ul>
<li><p>Das Setzen der URI auf eine lokale Datei (z.B. <code translate="no">./milvus.db</code>) ist die einfachste Option. Es wird automatisch Milvus Lite verwendet, um alle Daten in dieser Datei zu speichern.</p></li>
<li><p>Für große Datenmengen können Sie einen leistungsfähigeren Milvus-Server auf Docker oder Kubernetes bereitstellen. In diesem Fall verwenden Sie die Server-URI (z. B. <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Um Zilliz Cloud (die vollständig verwaltete Cloud-Version von Milvus) zu verwenden, setzen Sie den URI und das Token auf den öffentlichen Endpunkt und den API-Schlüssel von Ihrer Zilliz Cloud-Konsole.</p></li>
</ul>
<p>Prüfen Sie, ob die Sammlung bereits existiert, und löschen Sie sie gegebenenfalls:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Erstellen Sie eine neue Sammlung mit den angegebenen Parametern. Wenn Sie keine Felddefinitionen angeben, erstellt Milvus automatisch ein Standardfeld <code translate="no">id</code> als Primärschlüssel und ein Feld <code translate="no">vector</code> für Vektordaten. Ein reserviertes JSON-Feld speichert alle Felder und Werte, die nicht im Schema definiert sind:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Daten einfügen</h3><p>Iterieren Sie durch die Textzeilen, erzeugen Sie Einbettungen und fügen Sie die Daten in Milvus ein. Das Feld <code translate="no">text</code> ist hier nicht im Schema definiert. Es wird automatisch als dynamisches Feld hinzugefügt, das durch das reservierte JSON-Feld von Milvus unterstützt wird:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Aufbau der RAG-Pipeline</h3><p><strong>Abrufen relevanter Dokumente:</strong></p>
<p>Stellen wir eine allgemeine Frage über Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Durchsuchen Sie die Sammlung nach den 3 relevantesten Ergebnissen:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Die Ergebnisse werden nach Entfernung sortiert, das nächstgelegene zuerst:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Erzeugen Sie eine Antwort mit dem LLM:</strong></p>
<p>Kombinieren Sie die abgerufenen Dokumente zu einem Kontextstring:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Einrichten der System- und Benutzereingabeaufforderung. Die Benutzerführung wird aus den von Milvus abgerufenen Dokumenten erstellt:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Aufruf von GLM-5, um die endgültige Antwort zu generieren:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 gibt eine gut strukturierte Antwort zurück:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Schlussfolgerung: Erst das Modell wählen, dann die Pipeline bauen<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Alle drei Modelle sind stark, aber sie sind in unterschiedlichen Bereichen stark. Gemini 3 Deep Think ist die richtige Wahl, wenn die Tiefe der Argumentation wichtiger ist als die Kosten. GLM-5 ist die beste Open-Source-Option für Teams, die lokale Bereitstellung und Engineering auf Systemebene benötigen. MiniMax M2.5 ist sinnvoll, wenn Sie den Durchsatz und das Budget für Produktions-Workloads optimieren möchten.</p>
<p>Das von Ihnen gewählte Modell ist nur die halbe Miete. Um jedes dieser Modelle in eine nützliche Anwendung zu verwandeln, benötigen Sie eine Abrufschicht, die mit Ihren Daten skalieren kann. Hier kommt Milvus ins Spiel. Das obige RAG-Tutorial funktioniert mit jedem OpenAI-kompatiblen Modell, so dass der Wechsel zwischen GLM-5, MiniMax M2.5 oder einer zukünftigen Version nur eine einzige Zeilenänderung erfordert.</p>
<p>Wenn Sie lokale oder vor Ort installierte KI-Agenten entwickeln und die Speicherarchitektur, das Sitzungsdesign oder ein sicheres Rollback im Detail besprechen möchten, können Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> beitreten oder ein 20-minütiges Einzelgespräch über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> buchen, um eine persönliche Beratung zu erhalten.</p>
<p>Wenn Sie tiefer in die Entwicklung von KI-Agenten einsteigen möchten, finden Sie hier weitere Ressourcen, die Ihnen den Einstieg erleichtern.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Wie man produktionsreife Multi-Agenten-Systeme mit Agno und Milvus erstellt</a></p></li>
<li><p><a href="https://zilliz.com/learn">Die Wahl des richtigen Einbettungsmodells für Ihre RAG-Pipeline</a></p></li>
<li><p><a href="https://zilliz.com/learn">Wie man einen AI-Agenten mit Milvus erstellt</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Anleitung: Verbinden mit Slack für einen lokalen AI-Assistenten</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Erstellen von Clawdbot-ähnlichen KI-Agenten mit LangGraph und Milvus</a></p></li>
</ul>
