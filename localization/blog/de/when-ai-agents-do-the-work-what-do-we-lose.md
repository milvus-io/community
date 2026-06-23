---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  Was geht uns verloren, wenn KI-Agenten die Arbeit übernehmen?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/AI_Agents_Work_blog_cover_1536x1024_565f1739a0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  KI-Agenten werden immer besser in den Bereichen Ausführung, Gedächtnis und
  Standards. Wenn sie jedoch den Lernprozess hinter der Arbeit ausschalten,
  könnte sich das menschliche Urteilsvermögen nicht mehr weiterentwickeln.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Agentenprodukte werden bei der Erledigung ihrer Aufgaben immer besser.</p>
<p>Claude Code kann große Codeabschnitte schreiben und umgestalten. Cursor hilft Entwicklern dabei, sich schneller durch Codebasen zu arbeiten. Devin und andere aufgabenorientierte Agenten versuchen, längere Arbeitsabläufe zu übernehmen. Abgesehen vom Programmieren entwerfen Agenten E-Mails, bearbeiten Dokumente, fassen Daten zusammen, aktualisieren Tickets und automatisieren sich wiederholende Aufgaben, die früher direkten menschlichen Aufwand erforderten.</p>
<p>Die meisten dieser Produkte geben das gleiche Versprechen: Geben Sie dem Agenten genügend Kontext, und er wird einen größeren Teil der Ausführung für Sie übernehmen. Dieses Versprechen ist nützlich, wirft aber auch eine Frage auf, die Agentenprodukte noch nicht vollständig beantwortet haben: <strong>Wenn der Agent einen größeren Teil der Arbeit übernimmt, was verlieren wir dann?</strong></p>
<p>Die Antwort lautet nicht einfach „manueller Aufwand“. Die Aufgabe mag zwar erledigt sein, aber der Mensch hat möglicherweise einen Teil des Prozesses übersprungen, der früher zur Bildung von Urteilsvermögen diente: Lesen, Nachverfolgen, Debuggen, Vergleichen von Optionen, Fehler machen und lernen, warum eine Lösung besser ist als eine andere.</p>
<p>Das bedeutet nicht, dass Agenten schlecht fürs Lernen sind. Es bedeutet, dass Agentenprodukte mit Blick auf das Lernen entwickelt werden müssen. Wenn sie nur auf den Output optimiert sind, könnten sie genau jene Erfahrung beseitigen, die Menschen dabei hilft, die Standards zu verbessern, auf denen Agenten basieren.</p>
<p>Eine hilfreiche Herangehensweise an dieses Problem ist es, die Autonomie-Leiter aus dem Bereich der selbstfahrenden Systeme zu übernehmen. Die Analogie ist nicht perfekt, hilft aber dabei, verschiedene Arten von Fortschritt bei Agentenprodukten zu unterscheiden:</p>
<ul>
<li><strong>L1-Agenten führen Aufgaben aus.</strong> Der Mensch gibt Anweisungen, und der Agent führt sie aus.</li>
<li><strong>L2-Agenten merken sich Dinge.</strong> Sie lernen über Sitzungen hinweg, indem sie Präferenzen, Korrekturen und den Projektkontext speichern.</li>
<li><strong>L3-Agenten wenden Standards an.</strong> Der Mensch definiert Regeln, Einschränkungen und Entscheidungskriterien, anstatt jeden Schritt anzuleiten.</li>
<li><strong>L4-Agenten verbessern den Menschen.</strong> Der Agent erledigt nicht nur die Arbeit. Er hilft dem Menschen, sein Urteilsvermögen zu bewahren und zu vertiefen.</li>
</ul>
<p>Der Großteil der Branche konzentriert sich nach wie vor auf die ersten drei Stufen. Das ist nachvollziehbar. Ausführung, Gedächtnis und Standards sind unmittelbare Produktprobleme. Doch auf Stufe L4 taucht das langfristige Risiko auf. Wenn Menschen aufhören, sich weiterzuentwickeln, hören auch die Standards, nach denen sich Agenten richten, auf, sich weiterzuentwickeln.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">L1: Agenten führen aus<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Entwicklung von KI-Anwendungen hat mehrere Abstraktionsebenen durchlaufen:</p>
<ul>
<li>Zunächst riefen Entwickler ein Modell über eine API auf: Text senden, Text zurückerhalten.</li>
<li>Dann kam <strong>das „Prompt Engineering“</strong>, bei dem es vor allem darum ging, zu lernen, wie man bessere Fragen stellt.</li>
<li>Danach folgte <strong>das „Context Engineering“</strong>, bei dem die Aufgabe darin bestand, dem Modell genügend Beispiele, Einschränkungen und Hintergrundinformationen zu geben, damit es sich in einer bestimmten Situation sinnvoll verhalten kann.</li>
<li>Danach folgte <strong>das „Harness Engineering</strong>“: die Anbindung von Modellen an Tools, Workflows, Dateien, Datenbanken, Browser, Terminals und Produktionssysteme.</li>
<li>Darauf aufbauend entstand<strong>das „Agent Engineering</strong> “. Anstatt das Modell zu bitten, eine einzelne Eingabe zu beantworten, fordern wir es auf, Schritte zu planen, Werkzeuge auszuwählen, Ergebnisse zu überprüfen, Fehler zu beheben und mehrstufige Aufgaben mit weniger Überwachung zu erledigen.</li>
</ul>
<p>Die technische Oberfläche verändert sich ständig, doch die grundlegende Beziehung auf L1 bleibt dieselbe: <strong>Der Mensch definiert die Aufgabe, und der Agent führt sie aus.</strong> Jede Interaktion ist nach wie vor weitgehend in sich geschlossen. Die Aufgabe ist erledigt, die Sitzung endet, und die nächste Aufgabe beginnt von Grund auf neu.</p>
<p>Diese Ebene funktioniert bereits gut genug, um das Verhalten zu verändern. Agenten können mehr Aufgaben mit weniger manuellem Aufwand bewältigen. Da sie kostengünstiger, schneller und zuverlässiger werden, steigt die Leistung, während die Kosten sinken.</p>
<p>Doch die einfachere Ausführung schafft einen neuen Engpass. Jede parallele Sitzung benötigt nach wie vor einen Menschen, der die Aufgabe erklärt, den Kontext liefert, das Ergebnis überprüft, die Qualität beurteilt und entscheidet, wie es weitergeht. Der Agent mag zwar die Arbeit erledigen, doch der Mensch ist weiterhin dafür verantwortlich, zu beurteilen, ob die Arbeit gut ist.</p>
<p><strong>Die Ausführung wird kostengünstiger. Die Beurteilung gewinnt an Bedeutung.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">L2: Agenten merken sich<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>L1 löst die vor ihm liegende Aufgabe. L2 stellt eine andere Frage: <strong>Kann der Agent aus dieser Interaktion lernen, damit die nächste besser verläuft?</strong></p>
<p>Ein reiner L1-Agent ist zustandslos. Sobald die Sitzung endet, geht der Kontext verloren. Die nächste Aufgabe beginnt bei Null. L2-Agenten durchbrechen dieses Muster, indem sie Erfahrungen über mehrere Sitzungen hinweg sammeln. Sie merken sich Nutzerpräferenzen, Projektkonventionen, wiederkehrendes Feedback, frühere Entscheidungen und Muster in der Arbeitsweise des Nutzers. <strong>Das Ziel ist es, die durch die Interaktion zwischen Mensch und Agent gewonnenen Erfahrungen in eine wiederverwendbare Ressource umzuwandeln.</strong></p>
<p>Aus diesem Grund sollte das Agenten-Gedächtnis auch nicht als verlängerte Eingabeaufforderung oder als Ordner mit gespeicherten Protokollen behandelt werden. Ein nützliches Gedächtnis benötigt eine Infrastruktur: dauerhaften Speicher, semantisches Abrufen, Deduplizierung, Aktualisierungen und eine Möglichkeit, veralteten Kontext von noch nützlichem Wissen zu trennen. An dieser Stelle knüpft unsere Arbeit bei <a href="https://zilliz.com/">Zilliz</a> an das Problem an. <a href="https://milvus.io/">Milvus</a> und die darauf aufbauenden Managed Services „Zilliz Cloud“ werden häufig als Abrufebene für das Agentengedächtnis genutzt, da sie vergangenen Kontext durchsuchbar machen, anstatt ihn lediglich zu archivieren.</p>
<p><strong>Doch das L2-Gedächtnis stößt an strukturelle Grenzen.</strong> Das meiste, was Agenten in dieser Phase lernen, stammt aus beobachtbarem Verhalten: was der Nutzer gesagt, geändert, akzeptiert, abgelehnt oder korrigiert hat. Ein Agent erinnert sich vielleicht daran, dass Sie einen Absatz umgeschrieben, eine Implementierung abgelehnt oder eine Funktionssignatur geändert haben. Er versteht jedoch möglicherweise nicht, warum.</p>
<p>War das Problem die Genauigkeit, der Tonfall, die Wartbarkeit, ein Sicherheitsrisiko, die Leistung, die Produktpositionierung oder etwas anderes? Verhalten ist die sichtbare Oberfläche der Beurteilung. Die zugrunde liegende Argumentation bleibt oft verborgen.</p>
<p>Dadurch eignet sich L2 besser dazu, explizites Wissen zu erfassen als implizites Wissen. Es kann sich an Regeln erinnern, die Sie direkt formuliert haben, und Beispiele vergangener Entscheidungen speichern. Aber Beispiele werden nicht automatisch zu Prinzipien. Der Agent erinnert sich vielleicht daran, was passiert ist, ohne den dahinterstehenden Standard zu verstehen.</p>
<p>Diese Lücke führt zu L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">L3: Agenten wenden Standards an<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald L1 und L2 funktionieren, ist der naheliegende nächste Schritt die Parallelisierung.</p>
<p>Wenn ein Agent eine Aufgabe erledigen kann, warum dann nicht zehn? Wenn ein Agent aus einer Sitzung lernen kann, warum dann nicht viele Sitzungen eröffnen und sie alle gleichzeitig arbeiten lassen? Das ist die Logik des „10x-Ingenieurs“ oder „100x-Ingenieurs“: Agenten einsetzen, um den Output zu vervielfachen.</p>
<p>In der Praxis verursacht Parallelität jedoch eigene Kosten. Bei jeder Sitzung muss der Mensch immer noch den Kontext wechseln, das Problem verstehen, die Arbeit überprüfen, Feedback geben und entscheiden, ob das Ergebnis gut genug ist. Ab einem bestimmten Punkt wirken mehr Agenten nicht mehr als Hebel, sondern als Mehraufwand.</p>
<p>Das ist nicht nur ein Problem des Arbeitsablaufs. Es ist eine kognitive Barriere. Menschen gehen mit parallelen Aufgaben nicht so um wie Maschinen. Der Wechsel zwischen Aufgaben beansprucht die Aufmerksamkeit. Das Arbeitsgedächtnis ist begrenzt. Jeder Wechsel erhöht die Wahrscheinlichkeit, Details zu übersehen, falsche Maßstäbe anzulegen oder Arbeit zu schnell abzusegnen.</p>
<p><strong>Ein gutes Produkt sollte nicht gegen diese Grenze ankämpfen. Es sollte um sie herum konzipiert werden.</strong></p>
<p>Bei L3 ändert sich die Vorgabe von „Löse dieses spezifische Problem auf diese spezifische Weise“ zu „Hier sind die Maßstäbe, die du anwenden solltest“. Der Mensch ist nicht mehr der Bediener, der jeden Schritt anleitet, sondern wird zu der Person, die Regeln, Einschränkungen, Präferenzen, Qualitätsstandards und Entscheidungskriterien definiert.</p>
<p>Ein Nutzer kann einen Agenten zwar weiterhin durch eine bestimmte Aufgabe führen, doch der Wert dieser Anleitung sollte nicht mit der Sitzung verloren gehen. Die Interaktion sollte einen wiederverwendbaren Standard hinterlassen, nicht nur ein Protokoll. Wenn das nächste Mal eine ähnliche Aufgabe auftritt, sollte der Agent den Standard anwenden, ohne den Menschen zu bitten, den gesamten Kontext zu rekonstruieren und dieselbe Beurteilung erneut vorzunehmen.</p>
<p>Die Branche bewegt sich bereits in diese Richtung. Viele Agentenprodukte ermöglichen es Benutzern, Regeln, Anweisungen, Erinnerungen, Projektkonventionen und Verhaltenspräferenzen zu definieren. Die Richtung ist richtig, doch die meisten Implementierungen befinden sich noch in einem frühen Stadium. Regeln sind oft statischer Text: manuell aktualisiert, fragmentiert und nur lose mit der Argumentation hinter den Entscheidungen eines Benutzers verbunden.</p>
<p>Das überzeugendere Modell ist ein kontinuierlich aktualisiertes persönliches Kognitionsmodell: eine maschinenlesbare Darstellung dessen, wie eine Person urteilt, entscheidet und Abwägungen trifft. Es sollte Präferenzen, Werte, Einschränkungen, Ausnahmen, Standards und den Entscheidungsstil als Kontext kodieren, den Agenten abrufen und anwenden können.</p>
<p>Anstatt lediglich vergangene Gespräche zu speichern, sollte es das Denken des Nutzers für Maschinen lesbar machen.</p>
<p>Die Aufgabe des Nutzers ändert sich entsprechend. Anstatt jede Aufgabe von Grund auf zu erklären, pflegt der Nutzer das Modell, indem er Standards verfeinert, Präferenzen aktualisiert, Annahmen korrigiert und implizite Urteile explizit macht. In gewisser Weise wandelt der Nutzer sich selbst kontinuierlich in Token um: Er überträgt immer mehr von seinem Denken in eine Form, die Agenten nutzen können.</p>
<p>Wenn die Ausführung kostengünstig ist, muss der Mensch nicht jedes Implementierungsdetail entscheiden, bevor eine Aufgabe beginnt. Der Mensch muss definieren, wie ein gutes Ergebnis aussieht, was inakzeptabel ist und wie Kompromisse gehandhabt werden sollen.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">L4: Agenten bewahren menschliches Lernen<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die ersten drei Stufen konzentrieren sich darauf, Agenten so zu gestalten, dass sie dem Menschen besser dienen. L4 kehrt die Frage um: Wie können Agenten dem Menschen helfen, besser zu werden?</strong></p>
<p>Dies ist der Aspekt, mit dem sich die meisten Agentenprodukte noch nicht vollständig auseinandergesetzt haben. Wenn Agenten einen größeren Teil der Arbeit für uns übernehmen, was genau verschwindet dann auf der menschlichen Seite des Regelkreises?</p>
<p>Oberflächlich betrachtet sparen wir uns manuellen Aufwand. Das ist der offensichtliche Vorteil. Aber wir verlieren möglicherweise auch drei weniger sichtbare Dinge: das situative Gedächtnis für die Arbeit, die Übung im Eingehen von Kompromissen und die Mustererkennung, die durch den wiederholten Umgang mit unübersichtlichen Details entsteht.</p>
<p><strong>Ich habe das beim Programmieren direkt gespürt.</strong> Wenn ich selbst Code schrieb, erinnerte ich mich daran, wo jede Zeile stand und wie das System funktionierte, weil ich Zeit damit verbracht hatte, ihn zu lesen, zu debuggen, nachzuverfolgen und von Hand zu korrigieren. Dieser Prozess hat nicht nur Code hervorgebracht. Er hat mein Gehirn darauf trainiert, Strukturen zu erkennen.</p>
<p>Mit Claude Code wird der Code zwar immer noch erzeugt, oft sogar schneller. Doch nach einer Weile ist meine Erinnerung an das System nicht mehr so tiefgreifend. Ich weiß vielleicht, was das System tut, aber ich erinnere mich nicht immer daran, wie die einzelnen Teile zusammenkommen. Die Erfahrung des Erstellens wird komprimiert, und ein Teil des Lernens geht dabei verloren.</p>
<p>Das ist kein Argument gegen programmierende Agenten. Es ist ein Argument dafür, dass Agentenprodukte jene Teile der Arbeit bewahren müssen, die das menschliche Urteilsvermögen schulen.</p>
<p>Das gleiche Muster zeigt sich auch außerhalb der Programmierung. Wenn ein Agent jedes Strategie-Memo entwirft, verliert der Mensch möglicherweise die Übung darin, ein Argument zu strukturieren. Wenn ein Agent jede Abhandlung zusammenfasst, verliert der Mensch möglicherweise die Gewohnheit, zu bemerken, was in der Zusammenfassung ausgelassen wurde. Wenn ein Agent jede operative Entscheidung trifft, entwickelt der Mensch möglicherweise nicht mehr die Intuition, die aus dem Umgang mit chaotischen Ausnahmen entsteht.</p>
<p>Die Arbeit verschwindet. Das Ergebnis bleibt. Doch der Lernkreislauf könnte schwächer werden.</p>
<p>Das ist das L4-Problem.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">Das menschliche Urteilsvermögen ist die Obergrenze<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser Verlust ist von Bedeutung, da Agenten nicht in einem Vakuum agieren. Ein Agent ist ein Multiplikator, kein Ersatz. Dasselbe Werkzeug führt in den Händen eines Experten und eines Anfängers zu sehr unterschiedlichen Ergebnissen. Ein erfahrener Ingenieur kann mit einem Agenten deutlich effektiver arbeiten. Ein Anfänger produziert möglicherweise lediglich mehr Output, ohne ein besseres Urteilsvermögen zu entwickeln.</p>
<p>Agenten verstärken das bestehende kognitive Niveau des Nutzers.</p>
<p>Das ist von Bedeutung, weil L3 davon abhängt, dass Menschen die Standards definieren, denen Agenten folgen sollen. Die Qualität dieser Standards hängt jedoch von der Qualität des menschlichen Urteilsvermögens ab. Wenn der Mensch aufhört, sich weiterzuentwickeln, veralten die Standards irgendwann. Sie werden unvollständig, oberflächlich oder passen nicht mehr zur aktuellen Realität der Arbeit.</p>
<p>Das System funktioniert am besten als Regelkreis:</p>
<ul>
<li>Das menschliche Urteilsvermögen definiert die Standards.</li>
<li>Agenten handeln im Rahmen dieser Standards.</li>
<li>Die Ergebnisse der Ausführung fließen zurück in den menschlichen Lernprozess.</li>
<li>Das menschliche Lernen verbessert die Standards.</li>
</ul>
<p>Wenn der Kreislauf funktioniert, werden beide Seiten besser. Der Agent arbeitet effektiver, und der Mensch wird besser darin, zu definieren, was „effektiv“ bedeutet. Wenn der Kreislauf unterbrochen wird, verschlechtert sich das System. Das menschliche Urteilsvermögen stagniert. Standards werden veraltet. Agenten optimieren zwar weiter, tun dies jedoch innerhalb eines Rahmens, der langsam den Anschluss verliert.</p>
<p>Deshalb stellt das menschliche Urteilsvermögen die Obergrenze dar. Leistungsfähigere Agenten machen leistungsfähigere Menschen nicht überflüssig. Sie machen die Qualität des menschlichen Urteilsvermögens umso wichtiger, da dieses Urteilsvermögen zum Rahmen wird, innerhalb dessen der Agent agiert.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Warum Agenten das gesamte Problem nicht allein lösen können<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine Antwort liegt auf der Hand: Agenten werden immer leistungsfähiger, also werden sie vielleicht irgendwann von selbst besseres Wissen, bessere Regeln und bessere Standards generieren.</p>
<p>Darin liegt ein Funken Wahrheit. Agenten sind bereits gut darin, Ideen zu kombinieren, Lösungsräume zu erkunden und Wege aufzuzeigen, die Menschen vielleicht nicht in Betracht gezogen hätten. Ein Modell kann Sätze, Entwürfe und Lösungen hervorbringen, die in seinen Trainingsdaten nie vorkamen. Es kann Muster domänenübergreifend neu kombinieren und nützliche Alternativen generieren.</p>
<p>Das ist echter Mehrwert. Bei L4 geht es jedoch um eine andere Art der Schöpfung. Die Frage ist nicht nur, wer eine bessere Antwort finden kann. Es geht darum, wer eine neue Frage stellen, den Standard neu definieren oder den Problemraum erweitern kann.</p>
<p>Agenten sind gut darin, zu verallgemeinern, zu kombinieren und innerhalb einer bestehenden Verteilung zu suchen. Sie können bessere Wege durch bekanntes Terrain finden, manchmal Wege, die Menschen noch nicht ausprobiert haben. Aber die Entscheidung, ob das Terrain selbst neu gestaltet werden sollte, ist etwas anderes.</p>
<p>Diese Art von Entscheidung entspringt oft dem menschlichen Kontext: gelebte Einschränkungen, persönliche Interessen, Neugier, Unzufriedenheit und die Kosten eines Irrtums. Ein Mensch kann eine Hypothese aufstellen, die den aktuellen Rahmen sprengt, und sie an der Realität überprüfen. Noch wichtiger ist, dass ein Mensch einen Grund haben kann, weiter zu testen, auch wenn die Idee auf den ersten Blick falsch, riskant oder nutzlos erscheint.</p>
<p>Die nicht-euklidische Geometrie ist ein nützliches Beispiel. Der entscheidende Schritt bestand nicht bloß darin, zu fragen: „Was wäre, wenn sich parallele Geraden schneiden?“ Ein Agent könnte diesen Satz generieren. Der entscheidende Schritt bestand darin, diese seltsame Annahme als untersuchungswürdig zu betrachten und dann ihre Konsequenzen zu verfolgen, bis daraus ein neuer theoretischer Raum entstand. Das erforderte Beharrlichkeit, ein persönliches Interesse und einen Grund, sich für das Ergebnis zu interessieren.</p>
<p>Margaret Bodens Kreativitätsmodell ist hier hilfreich. Sie unterscheidet zwischen drei Arten von Kreativität:</p>
<ul>
<li><strong>Kombinatorische Kreativität:</strong> das Kombinieren bekannter Ideen auf neue Weise.</li>
<li><strong>Explorative Kreativität:</strong> Suche innerhalb eines bestehenden konzeptuellen Raums.</li>
<li><strong>Transformative Kreativität:</strong> die Regeln des konzeptuellen Raums selbst zu verändern.</li>
</ul>
<p>Agenten sind in den ersten beiden Modi bereits stark. Sie kombinieren bestehende Ideen und erkunden bestehende konzeptuelle Räume. Der dritte Modus ist schwieriger. Transformative Kreativität hängt von mehr ab als nur von einer schnelleren Suche. Sie hängt davon ab, warum sich jemand dafür entscheidet, eine alte Regel abzulehnen, die Kosten des Scheiterns in Kauf zu nehmen und eine Idee weiter zu testen, die noch nicht passt.</p>
<p><strong>Genauer ausgedrückt lautet die These: Agenten sind am stärksten darin, innerhalb bestehender Räume zu kombinieren und zu erkunden. Neues Grundlagenwissen, neue Problemräume und neue Wertvorstellungen hängen nach wie vor stark vom Menschen ab.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Entwerfen Sie für den Regelkreis, nicht nur für das Ergebnis<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Nicht jedes Agentenprodukt muss L4 lösen. Manche Produkte müssen den Nutzern lediglich helfen, Aufgaben schneller zu erledigen. Das ist in Ordnung. Andere benötigen Speicher, Standards und eine bessere Integration in Arbeitsabläufe.</p>
<p>Auf der Ebene des Ökosystems müssen einige Produkte jedoch die Lernschleife aufrechterhalten. Wenn jedes Agentenprodukt den Menschen hilft, weniger Arbeit zu verrichten, und keines ihnen hilft, weiter zu lernen, nachdem sie die Arbeit nicht mehr direkt ausführen, schwächt sich die menschliche Leistungsfähigkeit mit der Zeit ab. Der Optimierungsraum für Agenten hört auf, sich zu erweitern. Das gesamte System bleibt durch das heutige Niveau des menschlichen Urteilsvermögens begrenzt.</p>
<p>Hier kommt es auf das Produktdesign an. Bei L4 geht es nicht nur darum, dass der Agent zusammenfasst, was er getan hat. Ein nützliches L4-Produkt bewahrt jene Teile der Arbeit, die das menschliche Urteilsvermögen stärken – selbst wenn der Agent den Großteil der Ausführung übernimmt.</p>
<p>Hier sind einige Produktmuster von Bedeutung:</p>
<ul>
<li><strong>Wichtige Entscheidungspunkte bewahren.</strong> Manche Entscheidungen sollten für den Menschen sichtbar bleiben – nicht, weil der Agent sie nicht treffen kann, sondern weil diese Entscheidungen das Urteilsvermögen schulen. Das Produkt sollte erkennen, welche Momente entscheidend sind, und dafür sorgen, dass sie bewusst getroffen werden.</li>
<li><strong>Den Prozess rekonstruieren, nicht nur das Ergebnis.</strong> Ein fertiges Ergebnis reicht nicht aus. Das System sollte wichtige Entscheidungszweige, Abwägungen, alternative Wege und gescheiterte Versuche sichtbar machen. Ein Nutzer, der nur das Ergebnis sieht, kann es genehmigen oder ablehnen. Ein Nutzer, der den Denkprozess sieht, kann sein mentales Modell aktualisieren.</li>
<li><strong>Unterstütze die gemeinsame Erkundung.</strong> Wenn der Nutzer unsicher ist, sollte der Agent nicht sofort zu einer Antwort springen. Er sollte dabei helfen, den Problemraum zu erweitern: Welche Dimensionen sind wichtig, welche Annahmen fehlen, welche Informationen werden noch benötigt und welche Kosten ist mit jeder Option verbunden?</li>
<li><strong>Hinterfragen Sie menschliche Annahmen.</strong> Das bedeutet nicht, nur um des Widerspruchs willen zu widersprechen. Es bedeutet, Lücken oder Spannungen im Denken des Nutzers zu erkennen und gezielte Fragen zu stellen, die diese Spannungen sichtbar machen.</li>
</ul>
<p>Das Ziel ist es nicht, Menschen wieder zu jedem manuellen Schritt zu zwingen. Das würde den Zweck von Agenten zunichte machen. Das Ziel ist es, jene Teile der Arbeit zu bewahren, die Erfahrung in Urteilsvermögen verwandeln.</p>
<p>Agentenprodukte sollten nicht nur auf den Output optimiert sein. Sie sollten auf die Rückkopplungsschleife optimiert sein: besseres menschliches Urteilsvermögen, bessere Standards, bessere Ausführung durch die Agenten und besseres menschliches Lernen aus den Ergebnissen.</p>
<p><strong>Wenn KI-Agenten die Arbeit übernehmen, sollten wir den Kreislauf nicht aus den Augen verlieren, der den Menschen überhaupt erst besser in dieser Arbeit gemacht hat.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Wir würden uns sehr über Ihre Meinung freuen<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Agenten entwickeln, würde ich gerne erfahren, wie Sie darüber denken: Welche Teile der Arbeit sollten Agenten vollständig übernehmen, und welche Teile sollten sichtbar bleiben, weil sie den Menschen helfen, sich weiter zu verbessern?</p>
