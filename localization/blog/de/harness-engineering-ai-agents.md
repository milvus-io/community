---
id: harness-engineering-ai-agents.md
title: >-
  Harness Engineering: Die Ausführungsebene, die KI-Agenten tatsächlich
  benötigen
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  Harness Engineering entwickelt die Ausführungsumgebung für autonome
  KI-Agenten. Erfahren Sie, was das ist, wie OpenAI es verwendet und warum es
  eine hybride Suche erfordert.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto hat HashiCorp aufgebaut und Terraform mitentwickelt. Im Februar 2026 veröffentlichte er einen <a href="https://mitchellh.com/writing/my-ai-adoption-journey">Blogbeitrag</a>, in dem er eine Angewohnheit beschrieb, die er bei der Arbeit mit KI-Agenten entwickelt hatte: Jedes Mal, wenn ein Agent einen Fehler machte, baute er eine dauerhafte Korrektur in die Umgebung des Agenten ein. Er nannte dies "engineering the harness". Innerhalb weniger Wochen veröffentlichten <a href="https://openai.com/index/harness-engineering/">OpenAI</a> und <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> Artikel, in denen diese Idee weiter ausgeführt wurde. Der Begriff <em>Harness Engineering</em> hatte sich durchgesetzt.</p>
<p>Er fand Anklang, weil er ein Problem benennt, auf das jeder Ingenieur, der <a href="https://zilliz.com/glossary/ai-agents">KI-Agenten</a> entwickelt, bereits gestoßen ist. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">Promptes Engineering</a> sorgt für bessere Ergebnisse in einem einzigen Durchgang. Context Engineering verwaltet, was das Modell sieht. Aber keine der beiden Lösungen befasst sich mit dem, was passiert, wenn ein Agent stundenlang autonom arbeitet und Hunderte von Entscheidungen ohne Aufsicht trifft. Das ist die Lücke, die Harness Engineering füllt - und es ist fast immer auf eine hybride Suche (hybride Volltext- und semantische Suche) angewiesen, um zu funktionieren.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">Was ist Harness Engineering?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Harness Engineering ist die Disziplin des Entwurfs der Ausführungsumgebung für einen autonomen KI-Agenten. Dabei wird festgelegt, welche Tools der Agent aufrufen kann, wo er Informationen erhält, wie er seine eigenen Entscheidungen überprüft und wann er aufhören sollte.</p>
<p>Um zu verstehen, warum dies so wichtig ist, sollten Sie sich drei Ebenen der KI-Agentenentwicklung vor Augen führen:</p>
<table>
<thead>
<tr><th>Ebene</th><th>Was wird optimiert</th><th>Umfang</th><th>Beispiel</th></tr>
</thead>
<tbody>
<tr><td><strong>Aufforderung zur Entwicklung</strong></td><td>Was Sie dem Modell sagen</td><td>Einmaliger Austausch</td><td>Wenige Beispiele, Aufforderungen zur Gedankenkette</td></tr>
<tr><td><strong>Kontext Technik</strong></td><td>Was das Modell sehen kann</td><td><a href="https://zilliz.com/glossary/context-window">Kontext-Fenster</a></td><td>Abrufen von Dokumenten, Komprimierung der Historie</td></tr>
<tr><td><strong>Harness Technik</strong></td><td>Die Welt, in der der Agent arbeitet</td><td>Autonome mehrstündige Ausführung</td><td>Werkzeuge, Validierungslogik, architektonische Zwänge</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong> optimiert die Qualität eines einzelnen Austauschs - Formulierung, Struktur, Beispiele. Eine Konversation, eine Ausgabe.</p>
<p><strong>Context Engineering</strong> verwaltet, wie viele Informationen das Modell auf einmal sehen kann - welche Dokumente abgerufen werden, wie der Verlauf komprimiert wird, was in das Kontextfenster passt und was weggelassen wird.</p>
<p><strong>Harness Engineering</strong> baut die Welt auf, in der der Agent arbeitet. Werkzeuge, Wissensquellen, Validierungslogik, architektonische Einschränkungen - alles, was bestimmt, ob ein Agent ohne menschliche Aufsicht über Hunderte von Entscheidungen hinweg zuverlässig arbeiten kann.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Drei Ebenen der KI-Agentenentwicklung: Prompt Engineering optimiert, was Sie sagen, Context Engineering verwaltet, was das Modell sieht, und Harness Engineering gestaltet die Ausführungsumgebung</span> </span>.</p>
<p>Die ersten beiden Ebenen bestimmen die Qualität eines einzelnen Zuges. Die dritte Ebene bestimmt, ob ein Agent stundenlang unbeobachtet arbeiten kann.</p>
<p>Dies sind keine konkurrierenden Ansätze. Sie sind eine Weiterentwicklung. Wenn die Fähigkeiten der Agenten wachsen, durchläuft ein und dasselbe Team alle drei Ebenen - oft innerhalb eines einzigen Projekts.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Wie OpenAI Harness Engineering zum Aufbau einer millionenfachen Codebasis einsetzte und welche Lehren daraus gezogen wurden<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI führte ein internes Experiment durch, das Harness Engineering in konkrete Worte fasst. Sie haben es in ihrem Engineering-Blogpost <a href="https://openai.com/index/harness-engineering/">"Harness Engineering"</a> beschrieben <a href="https://openai.com/index/harness-engineering/">:</a> <a href="https://openai.com/index/harness-engineering/">Leveraging Codex in an Agent-First World".</a> Ein dreiköpfiges Team begann Ende August 2025 mit einem leeren Repository. Fünf Monate lang schrieben sie keinen Code selbst - jede Zeile wurde von Codex, dem KI-gestützten Kodierungsagenten von OpenAI, generiert. Das Ergebnis: eine Million Zeilen Produktionscode und 1.500 zusammengeführte Pull Requests.</p>
<p>Der interessante Teil ist nicht der Output. Es sind die vier Probleme, auf die sie gestoßen sind, und die Lösungen, die sie auf Harness-Ebene entwickelt haben.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problem 1: Kein gemeinsames Verständnis der Codebasis</h3><p>Welche Abstraktionsschicht soll der Agent verwenden? Wie lauten die Namenskonventionen? Wo ist die Architekturdiskussion von letzter Woche gelandet? In Ermangelung von Antworten riet der Agent immer wieder - und irrte sich dabei.</p>
<p>Der erste Instinkt war eine einzelne <code translate="no">AGENTS.md</code> Datei, die jede Konvention, Regel und historische Entscheidung enthielt. Dies scheiterte aus vier Gründen. Kontext ist rar, und eine aufgeblähte Anweisungsdatei verdrängt die eigentliche Aufgabe. Wenn alles als wichtig markiert ist, ist nichts wichtig. Dokumentation verrottet - Regeln von Woche zwei werden in Woche acht falsch. Und ein flaches Dokument kann nicht mechanisch überprüft werden.</p>
<p>Die Lösung: <code translate="no">AGENTS.md</code> auf 100 Zeilen schrumpfen. Keine Regeln - eine Karte. Sie verweist auf ein strukturiertes Verzeichnis <code translate="no">docs/</code>, das Designentscheidungen, Ausführungspläne, Produktspezifikationen und Referenzdokumente enthält. Linters und CI stellen sicher, dass die Querverweise intakt bleiben. Der Agent navigiert genau zu dem, was er braucht.</p>
<p>Das zugrundeliegende Prinzip: Wenn etwas zur Laufzeit nicht im Kontext ist, existiert es für den Agenten nicht.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problem 2: Die menschliche QA konnte mit der Ausgabe des Agenten nicht Schritt halten</h3><p>Das Team schloss Chrome DevTools Protocol an Codex an. Der Agent konnte Screenshots von UI-Pfaden machen, Laufzeitereignisse beobachten und Protokolle mit LogQL und Metriken mit PromQL abfragen. Es wurde ein konkreter Schwellenwert festgelegt: Ein Dienst musste in weniger als 800 Millisekunden starten, bevor eine Aufgabe als abgeschlossen galt. Codex-Aufgaben liefen über sechs Stunden am Stück - in der Regel, während die Ingenieure schliefen.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problem 3: Architektonischer Drift ohne Beschränkungen</h3><p>Ohne Leitplanken reproduzierte der Agent alle Muster, die er im Repo fand - auch die schlechten.</p>
<p>Die Lösung: eine strikt geschichtete Architektur mit einer einzigen erzwungenen Abhängigkeitsrichtung - Types → Config → Repo → Service → Runtime → UI. Benutzerdefinierte Linters setzten diese Regeln mechanisch durch, mit Fehlermeldungen, die die Korrekturanweisung inline enthielten.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Strenge Schichtenarchitektur mit einseitiger Abhängigkeitsvalidierung: Typen an der Basis, Benutzeroberfläche an der Spitze, benutzerdefinierte Linters setzen die Regeln mit Inline-Fehlerbehebungsvorschlägen durch</span> </span></p>
<p>In einem menschlichen Team tritt diese Einschränkung in der Regel auf, wenn ein Unternehmen auf Hunderte von Ingenieuren skaliert. Für einen Kodierungsagenten ist sie vom ersten Tag an eine Voraussetzung. Je schneller sich ein Agent ohne Einschränkungen bewegt, desto schlimmer ist die architektonische Abweichung.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problem 4: Stille technische Verschuldung</h3><p>Die Lösung: Kodierung der Kernprinzipien des Projekts im Repository, dann Ausführung von Codex-Hintergrundaufgaben nach einem Zeitplan, um nach Abweichungen zu suchen und Refactoring-PRs einzureichen. Die meisten wurden innerhalb einer Minute automatisch zusammengeführt - kleine kontinuierliche Zahlungen statt periodischer Abrechnungen.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Warum KI-Agenten ihre eigene Arbeit nicht benoten können<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Experiment von OpenAI hat bewiesen, dass Harness Engineering funktioniert. Separate Forschungen haben jedoch eine Schwachstelle aufgedeckt: Agenten sind systematisch schlecht darin, ihren eigenen Output zu bewerten.</p>
<p>Das Problem tritt in zwei Formen auf.</p>
<p><strong>Kontextangst.</strong> Wenn sich das Kontextfenster füllt, beginnen die Agenten, Aufgaben vorzeitig zu beenden - nicht, weil die Arbeit erledigt ist, sondern weil sie spüren, dass sich die Grenze des Fensters nähert. Cognition, das Team, das hinter dem KI-Agenten Devin steht, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">dokumentierte dieses Verhalten</a>, als es Devin für Claude Sonnet 4.5 umbaute: Das Modell wurde sich seines eigenen Kontextfensters bewusst und begann, Abkürzungen zu nehmen, lange bevor der Platz tatsächlich zu Ende war.</p>
<p>Die Lösung war reines "harness engineering". Sie aktivierten die 1-Millionen-Token-Kontext-Beta, begrenzten aber die tatsächliche Nutzung auf 200.000 Token - und gaukelten dem Modell so vor, dass es über reichlich Spielraum verfügte. Die Befürchtungen verschwanden. Es war keine Modelländerung erforderlich, nur eine intelligentere Umgebung.</p>
<p>Die gängigste allgemeine Abhilfemaßnahme ist die Verdichtung: Man fasst den Verlauf zusammen und lässt denselben Agenten mit komprimiertem Kontext weitermachen. Dadurch wird die Kontinuität gewahrt, aber das zugrunde liegende Verhalten nicht beseitigt. Eine Alternative ist das Zurücksetzen des Kontexts: Das Fenster wird gelöscht, eine neue Instanz wird gestartet und der Zustand wird durch ein strukturiertes Artefakt weitergegeben. Dies beseitigt den Angstauslöser vollständig, erfordert aber ein vollständiges Übergabedokument - Lücken im Artefakt bedeuten Lücken im Verständnis des neuen Agenten.</p>
<p><strong>Verzerrung der Selbsteinschätzung.</strong> Wenn Agenten ihre eigene Leistung beurteilen, bewerten sie diese hoch. Selbst bei Aufgaben mit objektiven Kriterien für das Bestehen/Nichtbestehen erkennt der Agent ein Problem, redet sich ein, dass es nicht schwerwiegend ist, und genehmigt Arbeiten, die eigentlich fehlschlagen sollten.</p>
<p>Die Lösung lehnt sich an GANs (Generative Adversarial Networks) an: Der Generator wird vollständig vom Bewerter getrennt. In einem GAN konkurrieren zwei neuronale Netze miteinander - eines generiert, eines bewertet - und diese gegensätzliche Spannung führt zu einer Qualitätssteigerung. Dieselbe Dynamik gilt für <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">Multiagentensysteme</a>.</p>
<p>Anthropic testete dies mit einem Drei-Agenten-System - Planer, Generator, Bewerter - gegen einen Solo-Agenten mit der Aufgabe, eine 2D-Retro-Spiel-Engine zu bauen. Das vollständige Experiment wird in <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026) beschrieben. Der Planner erweitert eine kurze Eingabeaufforderung zu einer vollständigen Produktspezifikation, wobei die Implementierungsdetails absichtlich nicht spezifiziert werden - eine frühe Überspezifizierung führt zu nachgelagerten Fehlern. Der Generator implementiert Funktionen in Sprints, aber bevor er Code schreibt, unterzeichnet er einen Sprintvertrag mit dem Evaluator: eine gemeinsame Definition von "fertig". Der Evaluator verwendet Playwright (Microsofts Open-Source-Framework zur Browser-Automatisierung), um sich wie ein echter Benutzer durch die Anwendung zu klicken und die Benutzeroberfläche, die API und das Datenbankverhalten zu testen. Wenn etwas nicht funktioniert, ist der Sprint gescheitert.</p>
<p>Der Solo-Agent produzierte ein Spiel, das technisch gesehen startete, aber die Entity-to-Runtime-Verbindungen waren auf der Code-Ebene unterbrochen - was nur durch das Lesen des Quellcodes festgestellt werden konnte. Das Drei-Agenten-Harness produzierte ein spielbares Spiel mit KI-unterstützter Level-Generierung, Sprite-Animation und Soundeffekten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Vergleich des Solo-Agenten mit dem Drei-Agenten-Harness: Der Solo-Agent lief 20 Minuten für neun Dollar mit defekter Kernfunktionalität, während das vollständige Harness 6 Stunden für zweihundert Dollar brauchte, um ein voll funktionsfähiges Spiel mit KI-unterstützten Funktionen zu erzeugen</span> </span>.</p>
<p>Die Drei-Agenten-Architektur kostete etwa 20 Mal mehr. Der Output wechselte von unbrauchbar zu brauchbar. Das ist der Kernpunkt des Harness-Engineerings: struktureller Overhead im Austausch für Zuverlässigkeit.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">Das Retrieval-Problem in jedem Agent Harness<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Beide Muster - das strukturierte <code translate="no">docs/</code> System und der Generator/Evaluator Sprint-Zyklus - haben eine stille Abhängigkeit gemeinsam: Der Agent muss die richtigen Informationen aus einer lebendigen, sich entwickelnden Wissensbasis finden, wenn er sie braucht.</p>
<p>Das ist schwieriger, als es aussieht. Nehmen wir ein konkretes Beispiel: Der Generator führt Sprint 3 aus und implementiert die Benutzerauthentifizierung. Bevor er Code schreibt, benötigt er zwei Arten von Informationen.</p>
<p>Erstens eine <a href="https://zilliz.com/glossary/semantic-search">semantische Suchabfrage</a>: <em>Wie lauten die Designprinzipien dieses Produkts für Benutzersitzungen?</em> Das relevante Dokument könnte "Sitzungsverwaltung" oder "Zugriffskontrolle" enthalten - nicht "Benutzerauthentifizierung". Ohne semantisches Verständnis geht die Abfrage daneben.</p>
<p>Zweitens eine Abfrage mit exakter Übereinstimmung: <em>Welche Dokumente verweisen auf die Funktion <code translate="no">validateToken</code>?</em> Ein Funktionsname ist eine beliebige Zeichenfolge ohne semantische Bedeutung. <a href="https://zilliz.com/glossary/vector-embeddings">Eine auf Einbettung basierende Abfrage</a> kann ihn nicht zuverlässig finden. Nur die Suche nach Schlüsselwörtern funktioniert.</p>
<p>Diese beiden Abfragen finden gleichzeitig statt. Sie können nicht in aufeinanderfolgende Schritte aufgeteilt werden.</p>
<p>Die reine <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuche</a> versagt bei exakter Übereinstimmung. Das traditionelle <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> versagt bei semantischen Abfragen und kann nicht vorhersagen, welches Vokabular ein Dokument verwendet. Vor Milvus 2.5 bestand die einzige Möglichkeit darin, zwei parallele Abfragesysteme - einen Vektorindex und einen <a href="https://milvus.io/docs/full-text-search.md">Volltextindex</a> - zur Abfragezeit mit einer benutzerdefinierten Ergebnisfusionslogik parallel laufen zu lassen. Für ein Live-Repository <code translate="no">docs/</code> mit kontinuierlichen Aktualisierungen mussten beide Indizes synchron bleiben: Jede Dokumentänderung löste eine Neuindizierung an zwei Stellen aus, mit dem ständigen Risiko von Inkonsistenzen.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Wie Milvus 2.6 die Agentenabfrage mit einer einzigen hybriden Pipeline löst<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist eine <a href="https://zilliz.com/learn/what-is-vector-database">Open-Source-Vektordatenbank</a>, die für KI-Workloads entwickelt wurde. Die Sparse-BM25 von Milvus 2.6 fasst das Dual-Pipeline-Abfrageproblem in einem einzigen System zusammen.</p>
<p>Beim Einlesen erzeugt Milvus zwei Repräsentationen gleichzeitig: eine <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dichte Einbettung</a> für die semantische Suche und einen <a href="https://milvus.io/docs/sparse_vector.md">TF-kodierten Sparse-Vektor</a> für die BM25-Bewertung. Die globalen <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF-Statistiken</a> werden automatisch aktualisiert, wenn Dokumente hinzugefügt oder entfernt werden - eine manuelle Neuindizierung ist nicht erforderlich. Zur Abfragezeit werden durch eine natürlichsprachliche Eingabe beide Abfragevektortypen intern erzeugt. <a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF)</a> führt die bewerteten Ergebnisse zusammen, und der Aufrufer erhält eine einzige einheitliche Ergebnismenge.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Vorher und nachher: zwei getrennte Systeme mit manueller Synchronisierung, fragmentierten Ergebnissen und benutzerdefinierter Fusionslogik im Vergleich zur Milvus 2.6-Pipeline mit Dense Embedding, Sparse BM25, RRF-Fusion und automatischer IDF-Wartung, die einheitliche Ergebnisse liefert</span> </span></p>
<p>Eine Schnittstelle. Ein zu pflegender Index.</p>
<p>Beim <a href="https://zilliz.com/glossary/beir">BEIR-Benchmark</a> - einer Standard-Evaluierungssuite, die 18 heterogene Retrieval-Datensätze abdeckt - erreicht Milvus einen 3-4fach höheren Durchsatz als Elasticsearch bei gleichem Recall, mit einer bis zu 7fachen QPS-Verbesserung bei bestimmten Workloads. Für das Sprint-Szenario findet eine einzige Abfrage sowohl das Sitzungsdesignprinzip (semantischer Pfad) als auch jedes Dokument, das <code translate="no">validateToken</code> erwähnt (exakter Pfad). Das Repository <code translate="no">docs/</code> wird kontinuierlich aktualisiert; die BM25 IDF-Wartung bedeutet, dass ein neu geschriebenes Dokument an der Auswertung der nächsten Abfrage teilnimmt, ohne dass ein Batch-Neuaufbau erforderlich ist.</p>
<p>Dies ist die Abfrageschicht, die für genau diese Art von Problemen entwickelt wurde. Wenn ein Agent eine lebende Wissensbasis durchsuchen muss - Code-Dokumentation, Design-Entscheidungen, Sprint-Historie - ist die hybride Single-Pipeline-Suche kein Nice-to-have. Sie sorgt dafür, dass der Rest des Kabelbaums funktioniert.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">Die besten Harness-Komponenten sind so konzipiert, dass sie gelöscht werden können<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Jede Komponente in einem Harness kodiert eine Annahme über Modellbeschränkungen. Sprint-Decomposition war notwendig, wenn Modelle bei langen Aufgaben die Kohärenz verloren. Das Zurücksetzen des Kontexts war notwendig, wenn die Modelle in der Nähe der Fenstergrenze unruhig wurden. Evaluator-Agenten wurden notwendig, als die Verzerrung der Selbsteinschätzung nicht mehr beherrschbar war.</p>
<p>Diese Annahmen sind hinfällig. Der Kontext-Fenster-Trick der Kognition könnte überflüssig werden, wenn die Modelle eine echte Ausdauer für lange Kontexte entwickeln. Während sich die Modelle weiter verbessern, werden andere Komponenten zu unnötigem Overhead, der die Agenten verlangsamt, ohne ihre Zuverlässigkeit zu erhöhen.</p>
<p>Harness Engineering ist keine feste Architektur. Es ist ein System, das mit jeder neuen Modellversion neu kalibriert wird. Die erste Frage nach jedem größeren Upgrade lautet nicht: "Was kann ich hinzufügen?" Sie lautet: "Was kann ich entfernen?"</p>
<p>Dieselbe Logik gilt auch für den Abruf. Je zuverlässiger die Modelle mit längeren Kontexten umgehen, desto mehr verschieben sich die Chunking-Strategien und die Abrufzeiten. Informationen, die heute noch sorgfältig fragmentiert werden müssen, können morgen als ganze Seiten aufgenommen werden. Die Abrufinfrastruktur passt sich dem Modell an.</p>
<p>Jede Komponente in einem gut aufgebauten Kabelbaum wartet darauf, durch ein intelligenteres Modell überflüssig zu werden. Das ist kein Problem. Das ist das Ziel.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Starten Sie mit Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie eine Agenteninfrastruktur aufbauen, die ein hybrides Retrieval benötigt - semantische und stichwortbasierte Suche in einer Pipeline - dann ist dies der richtige Ausgangspunkt:</p>
<ul>
<li>In den <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 Release Notes</strong></a> finden Sie alle Details zu Sparse-BM25, automatischer IDF-Wartung und Leistungsbenchmarks.</li>
<li>Treten Sie der <a href="https://milvus.io/community"><strong>Milvus-Community</strong></a> bei, um Fragen zu stellen und Ihre Entwicklungen mit anderen zu teilen.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Buchen Sie eine kostenlose Milvus-Sprechstunde</strong></a>, um Ihren Anwendungsfall mit einem Vektordatenbankexperten durchzugehen.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (vollständig verwaltetes Milvus) eine kostenlose Stufe für den Einstieg mit 100 $ Gratis-Credits bei Registrierung mit einer Arbeits-E-Mail.</li>
<li>Bewerten Sie uns auf GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ Sterne und wachsend.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Häufig gestellte Fragen<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">Was ist Harness Engineering und wie unterscheidet es sich von Prompt Engineering?</h3><p>Prompt Engineering optimiert das, was Sie einem Modell in einem einzigen Austausch sagen - Formulierung, Struktur, Beispiele. Harness Engineering baut die Ausführungsumgebung um einen autonomen KI-Agenten herum auf: die Tools, die er aufrufen kann, das Wissen, auf das er zugreifen kann, die Validierungslogik, die seine Arbeit überprüft, und die Beschränkungen, die ein Abdriften der Architektur verhindern. Prompt Engineering gestaltet eine Gesprächsrunde. Harness Engineering bestimmt, ob ein Agent stundenlang zuverlässig hunderte von Entscheidungen ohne menschliche Aufsicht treffen kann.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Warum brauchen KI-Agenten die Vektorsuche und BM25 gleichzeitig?</h3><p>Agenten müssen zwei grundlegend unterschiedliche Suchanfragen gleichzeitig beantworten. Semantische Abfragen - <em>was sind unsere Designprinzipien für Benutzersitzungen?</em> - erfordern dichte Vektoreinbettungen, um konzeptionell verwandte Inhalte unabhängig vom Vokabular zu finden. Exakte Suchanfragen - <em>welche Dokumente verweisen auf die Funktion <code translate="no">validateToken</code>?</em> - erfordern eine BM25-Schlüsselwortauswertung, da Funktionsnamen beliebige Zeichenfolgen ohne semantische Bedeutung sind. Ein Retrievalsystem, das nur einen Modus verarbeitet, verpasst systematisch Abfragen des anderen Typs.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Wie funktioniert Milvus Sparse-BM25 für die Abfrage von Agentenwissen?</h3><p>Beim Einlesen erzeugt Milvus gleichzeitig eine dichte Einbettung und einen TF-kodierten Sparse-Vektor für jedes Dokument. Die globalen IDF-Statistiken werden in Echtzeit aktualisiert, wenn sich die Wissensbasis ändert - eine manuelle Neuindizierung ist nicht erforderlich. Zur Abfragezeit werden beide Vektortypen intern generiert, Reciprocal Rank Fusion führt die gerankten Ergebnisse zusammen, und der Agent erhält eine einzige einheitliche Ergebnismenge. Die gesamte Pipeline läuft über eine einzige Schnittstelle und einen einzigen Index - ein entscheidender Faktor für kontinuierlich aktualisierte Wissensdatenbanken wie ein Repository für Codedokumentation.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">Wann sollte ich einen Evaluator-Agenten zu meinem Agentenkonzept hinzufügen?</h3><p>Fügen Sie einen separaten Evaluator hinzu, wenn die Qualität der Ausgabe Ihres Generators nicht allein durch automatisierte Tests verifiziert werden kann oder wenn die Selbsteinschätzung zu übersehenen Fehlern geführt hat. Der wichtigste Grundsatz: Der Evaluator muss architektonisch vom Generator getrennt sein - ein gemeinsamer Kontext führt zu denselben Verzerrungen, die Sie zu beseitigen versuchen. Der Evaluator sollte Zugang zu Laufzeit-Tools (Browser-Automatisierung, API-Aufrufe, Datenbankabfragen) haben, um das Verhalten zu testen und nicht nur den Code zu überprüfen. Die <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic-Forschung</a> hat ergeben, dass diese GAN-inspirierte Trennung die Qualität des Outputs von "technisch startklar, aber fehlerhaft" zu "voll funktionsfähig mit Funktionen, die der Solo-Agent nie ausprobiert hat" gebracht hat.</p>
