---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Wie RoboBrain mit Milvus ein Langzeit-Robotergedächtnis aufbaut
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  Robotermodule können allein arbeiten, versagen aber, wenn sie verkettet sind.
  Der CEO von Senqi AI erklärt, wie RoboBrain Aufgabenstatus, Feedback und
  Milvus-Speicher nutzt.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Dieser Beitrag stammt von Song Zhi, CEO von Senqi AI, einem Unternehmen für verkörperte Intelligenz, das Infrastrukturen für die Aufgabenausführung von Robotern entwickelt. RoboBrain ist eines der Kernprodukte von Senqi AI.</em></p>
<p>Die meisten Fähigkeiten eines Roboters funktionieren von selbst. Ein Navigationsmodell kann eine Route planen. Ein Wahrnehmungsmodell kann Objekte identifizieren. Ein Sprachmodul kann Anweisungen entgegennehmen. Der Produktionsfehler tritt auf, wenn diese Fähigkeiten als eine kontinuierliche Aufgabe ausgeführt werden müssen.</p>
<p>Eine einfache Anweisung wie "Überprüfe diesen Bereich, fotografiere alles Ungewöhnliche und benachrichtige mich" erfordert bei einem Roboter eine Planung vor Beginn der Aufgabe, eine Anpassung während der Ausführung und ein brauchbares Ergebnis nach Abschluss der Aufgabe. Jede Übergabe kann scheitern: Die Navigation bleibt hinter einem Hindernis stehen, ein unscharfes Foto wird als endgültig akzeptiert, oder das System vergisst die Ausnahme, die es vor fünf Minuten behandelt hat.</p>
<p>Das ist die zentrale Herausforderung für <a href="https://zilliz.com/glossary/ai-agents">KI-Agenten</a>, die in der realen Welt arbeiten. Im Gegensatz zu digitalen Agenten arbeiten Roboter mit kontinuierlichen <a href="https://zilliz.com/learn/introduction-to-unstructured-data">, unstrukturierten Daten</a>: versperrte Wege, wechselnde Lichtverhältnisse, Batterieladung, Sensorrauschen und Bedienerregeln.</p>
<p>RoboBrain ist das Senqi AI-Betriebssystem für Roboteraufgaben, das auf verkörperter Intelligenz basiert. Es sitzt auf der Aufgabenebene und verbindet Wahrnehmung, Planung, Ausführungssteuerung und Datenfeedback, sodass natürlichsprachliche Anweisungen zu strukturierten, wiederherstellbaren Roboter-Workflows werden können.</p>
<table>
<thead>
<tr><th>Haltepunkt</th><th>Was in der Produktion scheitert</th><th>Wie RoboBrain es schließt</th></tr>
</thead>
<tbody>
<tr><td>Planung von Aufgaben</td><td>Vage Anweisungen lassen nachgelagerte Module ohne konkrete Ausführungsfelder zurück.</td><td>Die Objektivierung der Aufgabe verwandelt die Absicht in einen gemeinsamen Zustand.</td></tr>
<tr><td>Kontext-Routing</td><td>Die richtigen Informationen sind vorhanden, gelangen aber in die falsche Entscheidungsphase.</td><td>Ein abgestufter Speicher leitet Echtzeit-, Kurzzeit- und Langzeitkontext getrennt weiter.</td></tr>
<tr><td>Daten-Feedback</td><td>Ein einzelner Durchlauf wird abgeschlossen oder scheitert, ohne den nächsten Durchlauf zu verbessern.</td><td>Rückmeldungen aktualisieren den Aufgabenstatus und den Langzeitspeicher.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Drei Haltepunkte bei der Ausführung von Roboteraufgaben<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Softwareaufgaben lassen sich häufig als Eingabe, Prozess und Ergebnis eingrenzen. Roboteraufgaben laufen gegen einen beweglichen physikalischen Zustand: blockierte Pfade, wechselndes Licht, Batterielimits, Sensorrauschen und Bedienerregeln.</p>
<p>Aus diesem Grund benötigt die Aufgabenschleife mehr als nur isolierte Modelle. Es muss ein Weg gefunden werden, den Kontext über Planung, Ausführung und Feedback hinweg zu erhalten.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. Aufgabenplanung: Vage Anweisungen führen zu einer vagen Ausführung</h3><p>Hinter einer Formulierung wie "Sieh dich um" verbergen sich viele Entscheidungen. Welcher Bereich? Was soll der Roboter fotografieren? Was gilt als ungewöhnlich? Was soll er tun, wenn die Aufnahme misslingt? Welches Ergebnis soll er an den Bediener zurückgeben?</p>
<p>Wenn die Aufgabenebene diese Details nicht in konkrete Felder auflösen kann - Zielbereich, Inspektionsobjekt, Abschlussbedingung, Fehlerpolitik und Rückgabeformat -, läuft die Aufgabe von Anfang an orientierungslos und gewinnt nie den nachgeschalteten Kontext zurück.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Kontext-Routing: Die richtigen Daten kommen an der falschen Stelle an</h3><p>Der Roboterstapel kann bereits die richtigen Informationen enthalten, aber die Ausführung der Aufgabe hängt davon ab, dass sie in der richtigen Phase abgerufen werden.</p>
<p>In der Startphase werden Karten, Bereichsdefinitionen und Betriebsregeln benötigt. In der Mitte der Ausführung wird der aktuelle Sensorstatus benötigt. Für die Behandlung von Ausnahmen werden ähnliche Fälle aus früheren Einsätzen benötigt. Wenn diese Quellen verwechselt werden, trifft das System die richtige Entscheidung im falschen Kontext.</p>
<p>Wenn das Routing fehlschlägt, werden beim Start veraltete Erfahrungswerte anstelle von Bereichsregeln herangezogen, die Ausnahmebehandlung kann die benötigten Fälle nicht erreichen, und in der Mitte der Ausführung wird die Karte von gestern anstelle von aktuellen Messwerten verwendet. Wenn man jemandem ein Wörterbuch in die Hand drückt, hilft ihm das nicht beim Schreiben eines Aufsatzes. Die Daten müssen zum richtigen Zeitpunkt und in der richtigen Form an den richtigen Entscheidungspunkt gelangen.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Daten-Feedback: Single-Pass-Ausführung bringt keine Verbesserung</h3><p>Ohne Rückmeldung kann ein Roboter einen Lauf beenden, ohne den nächsten zu verbessern. Eine abgeschlossene Aktion muss noch auf ihre Qualität hin überprüft werden: Ist das Bild scharf genug, oder sollte der Roboter eine neue Aufnahme machen? Ist der Weg noch frei, oder sollte er einen Umweg machen? Liegt der Batteriestand über dem Schwellenwert, oder sollte die Aufgabe abgebrochen werden?</p>
<p>Ein Single-Pass-System hat keinen Mechanismus für diese Aufrufe. Es führt die Aufgabe aus, hält an und wiederholt den gleichen Fehler beim nächsten Mal.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Wie RoboBrain die Schleife der Roboteraufgabe schließt<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain verbindet Umgebungsverständnis, Aufgabenplanung, Ausführungssteuerung und Datenrückmeldung zu einer einzigen Betriebsschleife.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>Die Middleware-Architektur des RoboBrain-Kerns zeigt, wie die Absichten des Benutzers durch Aufgabenobjekte, einen von Milvus unterstützten Stufenspeicher und eine Policy-Engine fließen, bevor sie die verkörperten Fähigkeiten erreichen</span> </span></p>
<p>In der Architektur, die in diesem Beitrag beschrieben wird, wird diese Schleife durch drei Mechanismen implementiert:</p>
<ol>
<li>Die<strong>Objektivierung der Aufgabe</strong> strukturiert den Einstiegspunkt.</li>
<li><strong>Ein abgestufter Speicher</strong> leitet die richtigen Informationen an die richtige Stelle weiter.</li>
<li><strong>Eine Rückkopplungsschleife</strong> schreibt die Ergebnisse zurück und entscheidet über den nächsten Schritt.</li>
</ol>
<p>Sie funktionieren nur im Verbund. Wenn man eine ohne die anderen repariert, bricht die Kette am nächsten Punkt immer noch ab.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. Objektivierung von Aufgaben: Umwandlung von Absichten in gemeinsame Zustände</h3><p>Bevor die Ausführung beginnt, verwandelt RoboBrain jede Anweisung in ein Aufgabenobjekt: Aufgabentyp, Zielbereich, Prüfobjekt, Einschränkungen, erwartete Ausgabe, aktuelle Stufe und Fehlerpolitik.</p>
<p>Dabei geht es nicht nur um das Parsen der Sprache. Es geht darum, jedem nachgelagerten Modul die gleiche zustandsbezogene Sicht auf die Aufgabe zu geben. Ohne diese Konvertierung hat die Aufgabe keine Richtung.</p>
<p>Für das Beispiel der Patrouille füllt das Aufgabenobjekt den Inspektionstyp, die vorgesehene Zone, anomale Elemente als Prüfobjekt, Batterie &gt;= 20 % als Einschränkung, ein eindeutiges Foto der Anomalie plus Bedieneralarm als erwartete Ausgabe und Rückkehr zur Basis als Fehlerrichtlinie aus.</p>
<p>Das Etappenfeld wird aktualisiert, wenn sich der Lauf ändert. Ein Hindernis verschiebt die Aufgabe vom Navigieren zum Umleiten oder Anfordern von Hilfe. Bei einem unscharfen Bild wird die Aufgabe von Inspektion auf Neuaufnahme verschoben. Eine schwache Batterie führt zum Abbruch und zur Rückkehr zur Basis.</p>
<p>Nachgeschaltete Module erhalten keine isolierten Befehle mehr. Sie erhalten das aktuelle Stadium der Aufgabe, ihre Einschränkungen und den Grund für die Änderung des Stadiums.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Tiered Memory: Weiterleitung des Kontexts an die richtige Stufe</h3><p>RoboBrain unterteilt aufgabenrelevante Informationen in drei Ebenen, damit die richtigen Daten die richtige Stufe erreichen.</p>
<p>Der<strong>Echtzeit-Status</strong> enthält Pose, Akku, Sensorwerte und Umgebungsbeobachtungen. Er unterstützt Entscheidungen bei jedem Steuerungsschritt.</p>
<p>Der<strong>Kurzzeitkontext</strong> zeichnet Ereignisse innerhalb der aktuellen Aufgabe auf: das Hindernis, das der Roboter vor zwei Minuten umgangen hat, das Foto, das er erneut aufgenommen hat, oder die Tür, die er nicht beim ersten Versuch öffnen konnte. So verliert das System nicht den Überblick über das, was gerade passiert ist.</p>
<p><strong>Das semantische Langzeitgedächtnis</strong> speichert Szenenwissen, historische Erfahrungen, Ausnahmefälle und Rückmeldungen nach der Aufgabe. Ein bestimmter Parkplatz kann bei Nacht aufgrund reflektierender Oberflächen eine Anpassung des Kamerawinkels erfordern. Eine bestimmte Art von Anomalie kann zu einer Reihe von Fehlalarmen führen und sollte eine menschliche Überprüfung anstelle eines automatischen Alarms auslösen.</p>
<p>Diese langfristige Ebene basiert auf einer <a href="https://zilliz.com/learn/vector-similarity-search">vektoriellen Ähnlichkeitssuche</a> in der <a href="https://milvus.io/">Milvus-Vektordatenbank</a>, da das Abrufen des richtigen Speichers einen Abgleich nach Bedeutung und nicht nach ID oder Schlüsselwort bedeutet. Szenenbeschreibungen und Abfertigungsdatensätze werden als <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> gespeichert und über eine <a href="https://zilliz.com/glossary/anns">ungefähre Suche nach dem nächsten Nachbarn</a> abgerufen, um die engsten semantischen Übereinstimmungen zu finden.</p>
<p>Beim Start werden Bereichsregeln und Zusammenfassungen vergangener Patrouillen aus dem Langzeitspeicher abgerufen. In der Mitte der Ausführung wird auf den Echtzeitstatus und den kurzfristigen Kontext zurückgegriffen. Die Behandlung von Ausnahmen nutzt die <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a>, um ähnliche Fälle im Langzeitspeicher zu finden.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. Rückkopplungsschleife: Rückführung der Ergebnisse in das System</h3><p>RoboBrain schreibt die Navigations-, Wahrnehmungs- und Aktionsergebnisse nach jedem Schritt zurück in das Aufgabenobjekt und aktualisiert das Etappenfeld. Das System liest diese Beobachtungen und entscheidet, was als Nächstes zu tun ist: einen Umweg machen, wenn der Weg unerreichbar ist, eine neue Aufnahme machen, wenn das Bild unscharf ist, es erneut versuchen, wenn sich die Tür nicht öffnen lässt, oder den Vorgang beenden, wenn der Akku leer ist.</p>
<p>Die Ausführung wird zu einem Zyklus: ausführen, beobachten, anpassen, wieder ausführen. Die Kette passt sich ständig an Veränderungen in der Umgebung an, anstatt beim ersten unerwarteten Auftreten abzubrechen.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Wie Milvus das Langzeit-Roboterspeicher von RoboBrain antreibt<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Teil des Roboterspeichers kann anhand von Aufgaben-ID, Zeitstempel oder Sitzungsmetadaten abgefragt werden. Langfristige Betriebserfahrungen können das normalerweise nicht.</p>
<p>Der nützliche Datensatz ist oft der Fall, der der aktuellen Szene semantisch ähnlich ist, auch wenn die Aufgaben-ID, der Ortsname oder der Wortlaut unterschiedlich sind. Das macht es zu einem <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbankproblem</a>, und Milvus eignet sich für die Langzeitspeicherschicht.</p>
<p>Diese Ebene speichert Informationen wie:</p>
<ul>
<li>Beschreibungen von Bereichsregeln und Semantik von Punkt-Standorten</li>
<li>Definitionen von Anomalietypen und Beispielzusammenfassungen</li>
<li>Historische Bearbeitungsprotokolle und Schlussfolgerungen aus der Überprüfung nach der Aufgabe</li>
<li>Zusammenfassungen von Patrouillen, die bei Abschluss der Aufgabe geschrieben werden</li>
<li>Erfahrungsberichte nach menschlicher Übernahme</li>
<li>Fehlerursachen und Korrekturstrategien aus ähnlichen Szenarien</li>
</ul>
<p>Nichts davon ist von Natur aus durch ein strukturiertes Feld verschlüsselt. All das muss nach Bedeutung abgerufen werden.</p>
<p>Ein konkretes Beispiel: Der Roboter patrouilliert nachts auf einem Parkplatz. Die Blendung durch Oberlichter macht die Erkennung von Anomalien instabil. Reflexionen werden immer wieder als Anomalien erkannt.</p>
<p>Das System muss sich an Aufnahmestrategien erinnern, die bei starker nächtlicher Blendung funktionierten, an Kamerawinkelkorrekturen aus ähnlichen Bereichen und an Schlussfolgerungen der menschlichen Überprüfung, die frühere Erkennungen als falsch-positiv markierten. Eine Abfrage mit exakter Übereinstimmung kann eine bekannte Aufgaben-ID oder ein Zeitfenster finden. Sie kann jedoch nicht zuverlässig "den früheren Blendungsfall, der sich wie dieser verhielt" finden, es sei denn, diese Beziehung wurde bereits gekennzeichnet.</p>
<p>Semantische Ähnlichkeit ist das Abfragemuster, das funktioniert. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Ähnlichkeitsmetriken</a> ordnen gespeicherte Erinnerungen nach Relevanz, während <a href="https://milvus.io/docs/filtered-search.md">die Filterung von Metadaten</a> den Suchraum nach Bereich, Aufgabentyp oder Zeitfenster eingrenzen kann. In der Praxis wird dies oft zu einer <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">hybriden Suche</a>: semantischer Abgleich für die Bedeutung, strukturierte Filter für die operativen Zwänge.</p>
<p>Bei der Implementierung ist die Filterschicht oft der Ort, an dem das semantische Gedächtnis operativ wird. <a href="https://milvus.io/docs/boolean.md">Milvus-Filterausdrücke</a> definieren skalare Einschränkungen, während <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">Milvus-Skalarabfragen</a> exakte Suchvorgänge unterstützen, wenn das System Datensätze nach Metadaten und nicht nach Ähnlichkeit benötigt.</p>
<p>Dieses Abfragemuster ähnelt eher einer <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Abfrage-erweiterten Generierung</a>, die für die Entscheidungsfindung in der physischen Welt angepasst ist, als einer Textgenerierung. Der Roboter sucht nicht nach Dokumenten, um eine Frage zu beantworten, sondern er sucht nach früheren Erfahrungen, um die nächste sichere Aktion zu wählen.</p>
<p>Nicht alles geht in Milvus hinein. Aufgaben-IDs, Zeitstempel und Sitzungsmetadaten werden in einer relationalen Datenbank gespeichert. Rohe Laufzeitprotokolle werden in einem Protokollierungssystem gespeichert. Jedes Speichersystem verarbeitet das Abfragemuster, für das es entwickelt wurde.</p>
<table>
<thead>
<tr><th>Datentyp</th><th>Wo sie gespeichert sind</th><th>Wie es abgefragt wird</th></tr>
</thead>
<tbody>
<tr><td>Aufgaben-IDs, Zeitstempel, Sitzungs-Metadaten</td><td>Relationale Datenbank</td><td>Genaue Suchabfragen, Verknüpfungen</td></tr>
<tr><td>Rohe Laufzeitprotokolle und Ereignisströme</td><td>Protokollierungssystem</td><td>Volltextsuche, Zeitbereichsfilter</td></tr>
<tr><td>Szeneregeln, Fallbearbeitung, Erfahrungsrückmeldungen</td><td>Milvus</td><td>Vektorielle Ähnlichkeitssuche nach Bedeutung</td></tr>
</tbody>
</table>
<p>Während der Ausführung von Aufgaben und der Anhäufung von Szenen speist die Langzeitspeicherschicht nachgelagerte Prozesse: Musterkuration für die Feinabstimmung des Modells, breitere Datenanalyse und einsatzübergreifender Wissenstransfer. Der Speicher setzt sich zu einem Datenbestand zusammen, der jeder zukünftigen Bereitstellung einen besseren Ausgangspunkt bietet.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">Was diese Architektur bei der Bereitstellung ändert<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Durch die Objektivierung von Aufgaben, den abgestuften Speicher und die Feedback-Schleife wird die Aufgabenschleife von RoboBrain zu einem Einsatzmuster: Jede Aufgabe bewahrt den Status, jede Ausnahme kann frühere Erfahrungen abrufen und jeder Durchlauf kann den nächsten verbessern.</p>
<p>Ein Roboter, der in einem neuen Gebäude patrouilliert, sollte nicht bei Null anfangen, wenn er bereits an anderer Stelle mit ähnlichen Beleuchtungen, Hindernissen, Anomalien oder Bedienerregeln gearbeitet hat. Dadurch wird die Ausführung von Roboteraufgaben an verschiedenen Schauplätzen wiederholbar, und die langfristigen Einsatzkosten sind leichter zu kontrollieren.</p>
<p>Für Robotik-Teams ist die tiefere Lehre, dass der Speicher nicht nur eine Speicherebene ist. Er ist Teil der Ausführungssteuerung. Das System muss wissen, was es gerade tut, was sich gerade geändert hat, was in ähnlichen Fällen bereits geschehen ist und was für den nächsten Durchlauf zurückgeschrieben werden sollte.</p>
<h2 id="Further-Reading" class="common-anchor-header">Weitere Lektüre<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie an ähnlichen Problemen mit dem Gedächtnis von Robotern, der Ausführung von Aufgaben oder der semantischen Abfrage für verkörperte KI arbeiten, sind diese Ressourcen nützliche nächste Schritte:</p>
<ul>
<li>Lesen Sie die <a href="https://milvus.io/docs">Milvus-Dokumentation</a> oder probieren Sie den <a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstart</a> aus, um zu sehen, wie die Vektorsuche in der Praxis funktioniert.</li>
<li>Lesen Sie die <a href="https://milvus.io/docs/architecture_overview.md">Milvus-Architekturübersicht</a>, wenn Sie eine Produktionsspeicherschicht planen.</li>
<li>Sehen Sie sich die <a href="https://zilliz.com/vector-database-use-cases">Anwendungsfälle der Vektordatenbank</a> an, um weitere Beispiele für die semantische Suche in Produktionssystemen zu finden.</li>
<li>Treten Sie der <a href="https://milvus.io/community">Milvus-Community</a> bei, um Fragen zu stellen und Ihre Entwicklungen mit anderen zu teilen.</li>
<li>Wenn Sie Milvus verwalten möchten, anstatt Ihre eigene Infrastruktur zu betreiben, erfahren Sie mehr über <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>
