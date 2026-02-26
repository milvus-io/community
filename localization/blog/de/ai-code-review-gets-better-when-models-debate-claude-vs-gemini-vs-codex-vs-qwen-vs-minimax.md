---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  AI Code Review wird besser, wenn Modelle debattieren: Claude vs Gemini vs
  Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Wir haben Claude, Gemini, Codex, Qwen und MiniMax auf echte Fehlererkennung
  getestet. Das beste Modell erreichte 53 %. Nach einer kontradiktorischen
  Debatte stieg die Erkennungsrate auf 80 %.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>Ich habe vor kurzem KI-Modelle zur Überprüfung eines Pull-Antrags verwendet, und die Ergebnisse waren widersprüchlich: Claude meldete ein Data Race, während Gemini sagte, der Code sei sauber. Das hat mich neugierig gemacht, wie sich andere KI-Modelle verhalten würden, also habe ich die neuesten Flaggschiff-Modelle von Claude, Gemini, Codex, Qwen und MiniMax durch einen strukturierten Code-Review-Benchmark laufen lassen. Die Ergebnisse? Das leistungsstärkste Modell fand nur 53 % der bekannten Fehler.</p>
<p>Meine Neugierde war damit aber noch nicht zu Ende: Was wäre, wenn diese KI-Modelle zusammenarbeiten würden? Ich experimentierte damit, sie miteinander diskutieren zu lassen, und nach fünf Runden gegenseitiger Diskussionen stieg die Fehlererkennung auf 80 % an. Bei den schwierigsten Fehlern, die ein Verständnis auf Systemebene erfordern, lag die Erkennungsrate im Diskussionsmodus bei 100 %.</p>
<p>In diesem Beitrag werden der Aufbau des Experiments, die Ergebnisse für die einzelnen Modelle und die Erkenntnisse aus dem Debattiermechanismus über den tatsächlichen Einsatz von KI bei der Codeüberprüfung erläutert.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Benchmarking von Claude, Gemini, Codex, Qwen und MiniMax für die Codeüberprüfung<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Modelle für die Codeüberprüfung verwendet haben, ist Ihnen wahrscheinlich aufgefallen, dass sie sich nicht nur in der Genauigkeit unterscheiden, sondern auch darin, wie sie den Code lesen. Ein Beispiel:</p>
<p>Claude geht die Aufrufkette normalerweise von oben nach unten durch und verbringt viel Zeit mit "langweiligen" Pfaden (Fehlerbehandlung, Wiederholungen, Bereinigung). Dort verstecken sich oft die wirklichen Fehler, daher stört mich die Gründlichkeit nicht.</p>
<p>Gemini neigt dazu, mit einem eindeutigen Urteil zu beginnen ("das ist schlecht" / "sieht gut aus") und dann rückwärts zu arbeiten, um es aus der Sicht des Designs/der Struktur zu rechtfertigen. Manchmal ist das nützlich. Manchmal liest es sich aber auch so, als hätte man es nur überflogen und sich dann auf einen Standpunkt festgelegt.</p>
<p>Der Codex ist ruhiger. Aber wenn er etwas anmerkt, ist es oft konkret und umsetzbar - weniger Kommentar, mehr "diese Zeile ist falsch, weil X".</p>
<p>Dies sind jedoch Eindrücke, keine Messungen. Um konkrete Zahlen zu erhalten, habe ich einen Benchmark eingerichtet.</p>
<h3 id="Setup" class="common-anchor-header">Einrichtung</h3><p><strong>Es wurden fünf Flaggschiffmodelle getestet:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Werkzeuge (Magpie)</strong></p>
<p>Ich habe <a href="https://github.com/liliu-z/magpie">Magpie</a> verwendet, ein von mir entwickeltes Open-Source-Benchmarking-Tool. Seine Aufgabe ist es, die "Code-Review-Vorbereitung" zu übernehmen, die Sie normalerweise manuell durchführen würden: Sie ziehen den umgebenden Kontext ein (Aufrufketten, verwandte Module und relevanten angrenzenden Code) und füttern das Modell damit <em>, bevor</em> es den PR überprüft.</p>
<p><strong>Testfälle (Milvus-PRs mit bekannten Fehlern)</strong></p>
<p>Der Datensatz besteht aus 15 Pull-Requests von <a href="https://github.com/milvus-io/milvus">Milvus</a> (einer Open-Source-Vektor-Datenbank, die von <a href="https://zilliz.com/">Zilliz</a> erstellt und gepflegt wird). Diese PRs sind als Benchmark nützlich, weil jede von ihnen zusammengeführt wurde, nur um später einen Revert oder Hotfix zu erfordern, nachdem ein Fehler in der Produktion aufgetaucht war. Es gibt also in jedem Fall einen bekannten Fehler, gegen den wir punkten können.</p>
<p><strong>Schwierigkeitsgrad der Fehler</strong></p>
<p>Nicht alle diese Fehler sind gleich schwer zu finden, daher habe ich sie in drei Schwierigkeitsgrade eingeteilt:</p>
<ul>
<li><p><strong>L1:</strong> Allein anhand des Diffs erkennbar (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 Fälle):</strong> Erfordert ein Verständnis des umgebenden Codes, um Dinge wie semantische Änderungen an der Schnittstelle oder Gleichzeitigkeitsrennen zu erkennen. Dies sind die häufigsten Fehler bei der täglichen Codeüberprüfung.</p></li>
<li><p><strong>L3 (5 Fälle):</strong> Erfordert ein Verständnis der Systemebene, um Probleme wie modulübergreifende Zustandsinkonsistenzen oder Upgrade-Kompatibilitätsprobleme zu erkennen. Dies sind die härtesten Tests dafür, wie tief ein Modell in eine Codebasis eindringen kann.</p></li>
</ul>
<p><em>Hinweis: Jedes Modell hat alle L1-Fehler erkannt, daher habe ich sie von der Bewertung ausgeschlossen.</em></p>
<p><strong>Zwei Bewertungsmodi</strong></p>
<p>Jedes Modell wurde in zwei Modi ausgeführt:</p>
<ul>
<li><p><strong>Raw:</strong> Das Modell sieht nur den PR (diff + was auch immer im PR-Inhalt ist).</p></li>
<li><p><strong>R1:</strong> Magpie zieht den umgebenden Kontext (relevante Dateien/Aufrufseiten/verwandten Code) <em>, bevor</em> das Modell prüft. Dies simuliert einen Arbeitsablauf, bei dem man den Kontext im Voraus vorbereitet, anstatt das Modell zu bitten, zu erraten, was es braucht.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Ergebnisse (nur L2 + L3)</h3><table>
<thead>
<tr><th>Modus</th><th>Claude</th><th>Zwilling</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Rohe</td><td>53% (1.)</td><td>13% (letzter)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (mit Kontext von Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Vier Schlussfolgerungen:</p>
<p><strong>1. Claude dominiert die Rohbewertung.</strong> Es erzielte 53 % Gesamterkennung und eine perfekte 5/5 bei L3-Fehlern, ohne jegliche Kontexthilfe. Wenn Sie ein einzelnes Modell verwenden und keine Zeit für die Vorbereitung des Kontexts aufwenden wollen, ist Claude die beste Wahl.</p>
<p><strong>2. Gemini braucht Kontext, der ihm vorgelegt wird.</strong> Sein Rohwert von 13 % war der niedrigste in der Gruppe, aber mit Magpie, das Umgebungscode bereitstellt, stieg er auf 33 %. Gemini sammelt seinen eigenen Kontext nicht gut, aber es zeigt respektable Leistungen, wenn man ihm diese Arbeit im Vorfeld abnimmt.</p>
<p><strong>3. Qwen ist der stärkste kontextunterstützte Performer.</strong> Es erzielte 40 % im R1-Modus und 5/10 bei L2-Fehlern, was die höchste Punktzahl auf diesem Schwierigkeitsgrad war. Für routinemäßige tägliche Überprüfungen, bei denen man bereit ist, den Kontext vorzubereiten, ist Qwen eine praktische Wahl.</p>
<p><strong>4. Mehr Kontext ist nicht immer hilfreich.</strong> Es hat Gemini (13% → 33%) und MiniMax (27% → 33%) verbessert, aber Claude (53% → 47%) hat es geschadet. Claude ist bereits sehr gut darin, den Kontext zu organisieren, so dass die zusätzlichen Informationen wahrscheinlich eher zu Rauschen als zu Klarheit führten. Die Lehre daraus: Passen Sie den Arbeitsablauf an das Modell an, anstatt davon auszugehen, dass mehr Kontext generell besser ist.</p>
<p>Diese Ergebnisse decken sich mit meiner täglichen Erfahrung. Claude an der Spitze ist nicht überraschend. Dass Gemini schlechter abschneidet, als ich erwartet hatte, macht im Nachhinein Sinn: Ich verwende Gemini in der Regel in Gesprächen mit mehreren Gesprächspartnern, in denen ich ein Design iteriere oder gemeinsam einem Problem nachgehe, und in dieser interaktiven Umgebung schneidet es gut ab. Bei diesem Benchmark handelt es sich um eine feste Single-Pass-Pipeline, also genau das Format, in dem Gemini am schwächsten ist. Der Abschnitt über Debatten wird später zeigen, dass sich die Leistung von Gemini merklich verbessert, wenn man ihm ein gegnerisches Format mit mehreren Runden gibt.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">KI-Modelle miteinander debattieren lassen<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Jedes Modell zeigte bei den einzelnen Benchmarks unterschiedliche Stärken und blinde Flecken. Ich wollte also testen, was passiert, wenn die Modelle die Arbeit der anderen überprüfen und nicht nur den Code?</p>
<p>Also fügte ich demselben Benchmark eine Diskussionsschicht hinzu. Alle fünf Modelle nehmen an fünf Runden teil:</p>
<ul>
<li><p>In Runde 1 prüft jedes Modell unabhängig voneinander die gleiche PR.</p></li>
<li><p>Danach gebe ich alle fünf Bewertungen an alle Teilnehmer weiter.</p></li>
<li><p>In Runde 2 aktualisiert jedes Modell seine Position auf der Grundlage der anderen vier.</p></li>
<li><p>Dies wird bis Runde 5 wiederholt.</p></li>
</ul>
<p>Am Ende reagiert jedes Modell nicht nur auf den Code, sondern auch auf Argumente, die bereits mehrfach kritisiert und überarbeitet wurden.</p>
<p>Damit das Ganze nicht zu einem "LLMs stimmen lauthals zu" wird, habe ich eine harte Regel aufgestellt: <strong>Jede Behauptung muss auf einen bestimmten Code als Beweis verweisen</strong>, und ein Modell kann nicht einfach sagen: "Gutes Argument" - es muss erklären, warum es seine Meinung geändert hat.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Ergebnisse: Bestes Solo gegen Debattenmodus</h3><table>
<thead>
<tr><th>Modus</th><th>L2 (10 Fälle)</th><th>L3 (5 Fälle)</th><th>Erkennung insgesamt</th></tr>
</thead>
<tbody>
<tr><td>Bester Einzelner (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Debatte (alle fünf Modelle)</td><td>7/10 (verdoppelt)</td><td>5/5 (alle gefangen)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">Was auffällt</h3><p><strong>1. L2-Erkennung verdoppelt.</strong> Routinemäßige, mittelschwere Bugs stiegen von 3/10 auf 7/10. Dies sind die Fehler, die in realen Codebasen am häufigsten auftreten, und sie sind genau die Kategorie, in der einzelne Modelle inkonsistent sind. Der größte Beitrag des Diskussionsmechanismus besteht darin, diese alltäglichen Lücken zu schließen.</p>
<p><strong>2. L3-Fehler: Null Fehlversuche.</strong> Bei den Einzelmodellläufen hat nur Claude alle fünf L3-Fehler auf Systemebene gefunden. Im Debattiermodus hat die Gruppe dieses Ergebnis erreicht, was bedeutet, dass man nicht mehr auf das richtige Modell setzen muss, um eine vollständige L3-Abdeckung zu erhalten.</p>
<p><strong>3. Die Debatte füllt blinde Flecken, anstatt die Obergrenze anzuheben.</strong> Fehler auf Systemebene waren für die stärkste Person nicht das Schwierigste. Claude hatte diese bereits. Der Hauptbeitrag des Debattiermechanismus besteht darin, Claudes Schwäche bei Routine-L2-Fehlern zu beheben, wo der einzelne Claude nur 3 von 10 Fehlern fand, die Debattiergruppe aber 7. Daher rührt der Sprung von 53 % → 80 %.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">Wie die Debatte in der Praxis aussieht</h3><p>Die obigen Zahlen zeigen, dass die Debatte funktioniert, aber ein konkretes Beispiel zeigt, <em>warum</em> sie funktioniert. Hier ist ein kurzer Überblick darüber, wie die fünf Modelle mit <strong>PR #44474</strong> umgegangen sind, der das faule Laden von Primärschlüsseln bei der Suche einführte.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> Eine Lazy-Loading-Optimierung, die die Suche dahingehend änderte, dass Primärschlüssel bei Bedarf abgerufen werden, anstatt sie alle im Voraus zu laden.</p>
<p><strong>Runde 1</strong></p>
<p>Gemini eröffnete aggressiv:</p>
<p>"Dieser PR ist ein Minenfeld aus schlechten Praktiken, potenziell undefiniertem Verhalten und Leistungsrückschritten, die als 'Optimierung' getarnt sind."</p>
<p>Claude und Qwen konzentrierten sich auf undefiniertes Verhalten und Leistung und kamen zu demselben Ergebnis:</p>
<p>"Das C++-Speichermodell garantiert keine Sicherheit für gleichzeitige Schreibvorgänge auf verschiedene Indizes desselben Vektors ohne angemessene Synchronisierung."</p>
<p>Alle drei fanden echte Probleme, aber keiner von ihnen entdeckte den tieferen Fehler. Dann wies Codex, der sich kaum zu Wort gemeldet hatte, auf etwas hin, das die anderen übersehen hatten: Der Vektor <code translate="no">primary_keys_</code> wird in der Größe verändert, aber nur die Positionen, die die Reduktionsphase durchlaufen, werden tatsächlich aufgefüllt. Jede andere Position wird als Nullwert belassen.</p>
<p><strong>Runde 2</strong></p>
<p>Claude griff die Entdeckung von Codex auf und verfolgte die nachgelagerte Konsequenz:</p>
<p>"Ich habe es gefunden: <code translate="no">SortEqualScoresByPks</code> wird vor <code translate="no">ReduceResultData</code> ausgeführt. Wenn <code translate="no">SortEqualScoresByPks</code> ausgeführt wird, sind also noch keine PKs abgeholt worden. Der gesamte <code translate="no">primary_keys_</code> Vektor ist voll von standardmäßig konstruierten PkType-Werten."</p>
<p>Im Klartext: Die Sortierfunktion wird ausgeführt, bevor die Schlüssel geladen wurden, also sortiert sie Nullen. Claude räumte den Fehler offen ein:</p>
<p>"codex-cli hat einen echten kritischen Korrektheitsfehler identifiziert. Das habe ich in meiner ersten Runde übersehen."</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Welche Kombination von Modellen kann die meisten Fehler finden?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Sprung von 53 % auf 80 % ist darauf zurückzuführen, dass fünf Modelle die blinden Flecken des jeweils anderen abdecken. Aber nicht jeder kann es sich leisten, für jede Codeüberprüfung fünf Modelle einzurichten und fünf Diskussionsrunden durchzuführen.</p>
<p><strong>Also habe ich die einfachere Version getestet: Wenn Sie nur zwei Modelle durchführen können, welches Paar kommt der Obergrenze für mehrere Modelle am nächsten?</strong></p>
<p>Ich habe die <strong>kontextunterstützten (R1)</strong> Durchläufe verwendet und gezählt, wie viele der 15 bekannten Fehler jedes Modell gefunden hat:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Zwilling:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>Es kommt also nicht nur darauf an, wie viele Fehler jedes Modell findet, sondern auch <em>, welche</em> Fehler es übersieht. Von den 8 Fehlern, die Claude übersehen hat, hat Gemini 3 gefunden: eine Gleichzeitigkeits-Race-Condition, ein Kompatibilitätsproblem mit der Cloud-Storage-API und eine fehlende Berechtigungsprüfung. Umgekehrt hat Gemini die meisten Fehler in Datenstrukturen und tiefer Logik übersehen, während Claude fast alle davon gefunden hat. Ihre Schwächen überschneiden sich kaum, was sie zu einem starken Paar macht.</p>
<table>
<thead>
<tr><th>Zwei-Modelle-Paarung</th><th>Kombinierte Abdeckung</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Alle fünf Modelle zusammen haben 11 von 15 Fehlern gefunden, d. h. 4 Fehler, die jedes Modell nicht gefunden hat.</p>
<p><strong>Claude + Gemini</strong> erreichen als Paar mit zwei Modellen bereits 91 % der Obergrenze von fünf Modellen. Für diesen Benchmark ist dies die effizienteste Kombination.</p>
<p>Allerdings ist Claude + Gemini nicht die beste Kombination für jede Art von Fehler. Als ich die Ergebnisse nach Fehlerkategorie aufgeschlüsselt habe, ergab sich ein differenzierteres Bild:</p>
<table>
<thead>
<tr><th>Fehlertyp</th><th>Insgesamt</th><th>Claude</th><th>Zwillinge</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Validierungslücken</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Lebenszyklus der Datenstruktur</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Gleichzeitigkeitsrennen</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Kompatibilität</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Tiefe Logik</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Insgesamt</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>Die Aufschlüsselung nach Fehlertyp zeigt, warum keine einzelne Paarung universell die beste ist.</p>
<ul>
<li><p>Bei Fehlern im Lebenszyklus von Datenstrukturen liegen Claude und MiniMax mit 3/4 gleichauf.</p></li>
<li><p>Bei den Validierungslücken lagen Claude und Qwen mit 3/4 gleichauf.</p></li>
<li><p>Bei Gleichzeitigkeits- und Kompatibilitätsproblemen erzielte Claude bei beiden null Punkte, und Gemini ist das Modell, das diese Lücken füllt.</p></li>
<li><p>Kein Modell deckt alles ab, aber Claude deckt den größten Bereich ab und kommt einem Generalisten am nächsten.</p></li>
</ul>
<p>Vier Fehler wurden von jedem Modell übersehen. Einer betraf die Priorität der ANTLR-Grammatikregeln. Bei einem handelte es sich um eine semantische Unstimmigkeit zwischen Lese- und Schreibsperren in verschiedenen Funktionen. Bei einem musste man die Unterschiede in der Geschäftslogik zwischen den Verdichtungstypen verstehen. Und einer war ein stiller Vergleichsfehler, bei dem eine Variable Megabytes und eine andere Bytes verwendete.</p>
<p>Diesen vier Fehlern ist gemeinsam, dass der Code syntaktisch korrekt ist. Die Fehler sind auf Annahmen zurückzuführen, die der Entwickler im Kopf hatte, nicht auf den Vergleich und auch nicht auf den umgebenden Code. Genau hier stößt die KI-Codeüberprüfung heute an ihre Grenzen.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Welches Modell ist nach dem Auffinden von Fehlern am besten geeignet, diese zu beheben?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Codeüberprüfung ist das Finden von Fehlern die halbe Arbeit. Die andere Hälfte besteht darin, sie zu beheben. Daher habe ich nach den Diskussionsrunden eine Peer-Evaluation hinzugefügt, um zu messen, wie nützlich die Korrekturvorschläge der einzelnen Modelle tatsächlich sind.</p>
<p>Um dies zu messen, habe ich nach der Debatte eine Peer-Evaluierungsrunde eingefügt. Jedes Modell eröffnete eine neue Sitzung und fungierte als anonymer Richter, der die Bewertungen der anderen Modelle bewertete. Die fünf Modelle wurden nach dem Zufallsprinzip den Prüfern A/B/C/D/E zugeordnet, so dass kein Prüfer wusste, welches Modell welche Bewertung abgab. Jeder Bewerter bewertete vier Dimensionen, die mit 1 bis 10 bewertet wurden: Genauigkeit, Umsetzbarkeit, Tiefe und Klarheit.</p>
<table>
<thead>
<tr><th>Modell</th><th>Genauigkeit</th><th>Umsetzbarkeit</th><th>Tiefe</th><th>Klarheit</th><th>Insgesamt</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (gleichauf mit 1)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (gleichauf mit 1)</td></tr>
<tr><td>Codex</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Zwillinge</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen und Claude belegten mit deutlichem Abstand den ersten Platz. Beide erreichten in allen vier Dimensionen konstant hohe Werte, während Codex, Gemini und MiniMax einen ganzen Punkt oder mehr darunter lagen. Bemerkenswert ist, dass Gemini, der sich in der Pairing-Analyse als wertvoller Partner für Claude bei der Fehlersuche erwiesen hat, bei der Überprüfungsqualität am unteren Ende rangiert. Gut darin zu sein, Probleme zu erkennen und gut darin, zu erklären, wie man sie beheben kann, sind offensichtlich unterschiedliche Fähigkeiten.</p>
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
    </button></h2><p><strong>Claude</strong> ist derjenige, dem man die schwierigsten Überprüfungen anvertrauen würde. Er arbeitet sich durch ganze Aufrufketten, folgt tiefen Logikpfaden und zieht seinen eigenen Kontext heran, ohne dass Sie ihn mit Informationen füttern müssen. Bei L3-Fehlern auf Systemebene kommt nichts anderes an ihn heran. Manchmal wird es bei mathematischen Berechnungen übermütig, aber wenn ein anderes Modell beweist, dass es falsch ist, steht es dazu und erklärt, wo seine Argumentation versagt hat. Verwenden Sie es für den Kerncode und die Fehler, die Sie sich nicht entgehen lassen dürfen.</p>
<p><strong>Zwillinge</strong> ist ein heißer Kandidat. Es hat eine starke Meinung über den Stil des Codes und die technischen Standards, und es ist schnell in der Lage, Probleme strukturell zu erfassen. Der Nachteil ist, dass er oft an der Oberfläche bleibt und nicht tief genug gräbt, weshalb er in der Peer-Evaluation schlecht abschnitt. Gemini verdient seinen Platz wirklich als Herausforderer: Sein Pushback zwingt andere Modelle dazu, ihre Arbeit zu überprüfen. Kombinieren Sie es mit Claude, um die strukturelle Perspektive zu erhalten, die Claude manchmal auslässt.</p>
<p><strong>Codex</strong> sagt kaum ein Wort. Aber wenn er es tut, ist es wichtig. Seine Trefferquote bei echten Fehlern ist hoch, und er hat ein Händchen dafür, das zu finden, woran alle anderen vorbeigegangen sind. Im Beispiel des PR #44474 war Codex das Modell, das das Problem mit den nullwertigen Primärschlüsseln entdeckte, das die ganze Kette in Gang setzte. Betrachten Sie ihn als den zusätzlichen Prüfer, der auffängt, was Ihr Hauptmodell übersehen hat.</p>
<p><strong>Qwen</strong> ist der vielseitigste der fünf. Seine Überprüfungsqualität entspricht der von Claude, und er ist besonders gut darin, verschiedene Perspektiven zu Korrekturvorschlägen zusammenzufassen, auf die Sie tatsächlich reagieren können. Es hatte auch die höchste L2-Erkennungsrate im kontextunterstützten Modus, was es zu einem soliden Standard für alltägliche PR-Überprüfungen macht. Einziger Schwachpunkt: Bei langen Debatten über mehrere Runden verliert es manchmal den Überblick über den früheren Kontext und gibt in späteren Runden inkonsistente Antworten.</p>
<p><strong>MiniMax</strong> war am schwächsten bei der eigenständigen Fehlersuche. Es ist am besten geeignet, um eine Gruppe mit mehreren Modellen zu vervollständigen, und nicht als eigenständiger Prüfer.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Beschränkungen dieses Experiments<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein paar Vorbehalte, um dieses Experiment im Blick zu behalten:</p>
<p><strong>Die Stichprobengröße ist klein.</strong> Es gibt nur 15 PRs, die alle von demselben Go/C++-Projekt (Milvus) stammen. Diese Ergebnisse lassen sich nicht auf alle Sprachen oder Codebasen verallgemeinern. Betrachten Sie sie als richtungsweisend, nicht als endgültig.</p>
<p><strong>Modelle sind von Natur aus zufällig.</strong> Wird dieselbe Eingabeaufforderung zweimal ausgeführt, kann dies zu unterschiedlichen Ergebnissen führen. Bei den Zahlen in diesem Beitrag handelt es sich um eine einzelne Momentaufnahme, nicht um einen stabilen Erwartungswert. Die Rangliste der einzelnen Modelle sollte mit Vorsicht genossen werden, obwohl die allgemeinen Trends (Debatte übertrifft Einzelpersonen, verschiedene Modelle zeichnen sich bei verschiedenen Fehlertypen aus) konsistent sind.</p>
<p><strong>Die Redereihenfolge wurde festgelegt.</strong> In der Debatte wurde in allen Runden die gleiche Reihenfolge verwendet, was die Reaktion der später sprechenden Modelle beeinflusst haben könnte. In einem zukünftigen Experiment könnte die Reihenfolge pro Runde randomisiert werden, um dies zu kontrollieren.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Versuchen Sie es selbst<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Alle Werkzeuge und Daten dieses Experiments sind quelloffen:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Ein Open-Source-Tool, das Codekontext (Aufrufketten, verwandte PRs, betroffene Module) sammelt und eine kontradiktorische Debatte mit mehreren Modellen für die Codeüberprüfung orchestriert.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: Die komplette Evaluierungspipeline, Konfigurationen und Skripte.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Testfälle</strong></a>: Alle 15 PRs mit annotierten bekannten Fehlern.</p></li>
</ul>
<p>Die Fehler in diesem Experiment stammen alle aus echten Pull Requests in <a href="https://github.com/milvus-io/milvus">Milvus</a>, einer Open-Source-Vektordatenbank für KI-Anwendungen. Wir haben eine ziemlich aktive Community auf <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> und <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a> und würden uns freuen, wenn noch mehr Leute am Code herumstochern würden. Und wenn Sie diesen Benchmark auf Ihrer eigenen Codebasis durchführen, teilen Sie bitte die Ergebnisse mit uns! Ich bin wirklich neugierig, ob die Trends über verschiedene Sprachen und Projekte hinweg anhalten.</p>
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: Welches Modell passt zu Ihrem AI Agent Stack?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Hinzufügen von persistentem Speicher zu Claude Code mit dem Lightweight memsearch Plugin</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Wir haben das Speichersystem von OpenClaw extrahiert und als Open-Source angeboten (memsearch)</a></p></li>
</ul>
