---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  LLM-Kontext-Bereinigung: Ein Leitfaden für Entwickler für bessere RAG- und
  AgentenkI-Ergebnisse
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Erfahren Sie, wie Context Pruning in RAG-Systemen mit langem Kontext
  funktioniert, warum es wichtig ist und wie Modelle wie Provence semantische
  Filterung ermöglichen und in der Praxis funktionieren.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>Die Kontextfenster in LLMs sind in letzter Zeit riesig geworden. Einige Modelle können eine Million Token oder mehr in einem einzigen Durchgang verarbeiten, und jede neue Version scheint diese Zahl noch zu erhöhen. Das ist aufregend, aber wenn Sie schon einmal etwas gebaut haben, das langen Kontext verwendet, wissen Sie, dass es eine Lücke zwischen dem, was <em>möglich</em> ist, und dem, was <em>nützlich</em> ist, gibt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nur weil ein Modell ein ganzes Buch in einer Eingabeaufforderung lesen <em>kann</em>, heißt das nicht, dass man ihm eine geben sollte. Die meisten langen Eingaben sind voll von Dingen, die das Modell nicht braucht. Sobald man anfängt, Hunderttausende von Token in eine Eingabeaufforderung zu packen, erhält man in der Regel langsamere Antworten, höhere Rechnungen und manchmal auch Antworten von geringerer Qualität, weil das Modell versucht, alles auf einmal zu berücksichtigen.</p>
<p>Auch wenn die Kontextfenster immer größer werden, stellt sich die Frage: <strong>Was sollen wir da eigentlich reinschreiben?</strong> An dieser Stelle kommt <strong>Context Pruning</strong> ins Spiel. Dabei handelt es sich um einen Prozess, bei dem die Teile des abgerufenen oder zusammengestellten Kontexts entfernt werden, die dem Modell nicht helfen, die Frage zu beantworten. Wenn es richtig gemacht wird, bleibt Ihr System schnell, stabil und viel berechenbarer.</p>
<p>In diesem Artikel werden wir darüber sprechen, warum sich langer Kontext oft anders verhält als erwartet, wie Pruning hilft, die Dinge unter Kontrolle zu halten, und wie Pruning-Tools wie <strong>Provence</strong> in echte RAG-Pipelines passen, ohne Ihr Setup komplizierter zu machen.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Vier häufige Fehlermöglichkeiten in Systemen mit langem Kontext<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein größeres Kontextfenster macht das Modell nicht auf magische Weise intelligenter. Sobald man anfängt, eine große Menge an Informationen in die Eingabeaufforderung zu packen, eröffnen sich ganz neue Möglichkeiten, wie etwas schief gehen kann. Hier sind vier Probleme, die bei der Erstellung von Systemen mit langem Kontext oder RAGs immer wieder auftreten können.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Context Clash</h3><p>Context Clash tritt auf, wenn Informationen, die über mehrere Runden hinweg angesammelt wurden, in sich widersprüchlich sind.</p>
<p>Zum Beispiel könnte ein Benutzer zu Beginn eines Gesprächs sagen: "Ich mag Äpfel" und später: "Ich mag kein Obst". Wenn beide Aussagen im Kontext verbleiben, hat das Modell keine zuverlässige Möglichkeit, den Konflikt aufzulösen, was zu inkonsistenten oder zögerlichen Antworten führt.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Kontext-Verwirrung</h3><p>Kontextverwirrung entsteht, wenn der Kontext eine große Menge irrelevanter oder wenig zusammenhängender Informationen enthält, was es dem Modell erschwert, die richtige Aktion oder das richtige Werkzeug auszuwählen.</p>
<p>Dieses Problem tritt besonders bei werkzeugunterstützten Systemen auf. Wenn der Kontext mit unzusammenhängenden Details überladen ist, kann das Modell die Absicht des Benutzers falsch interpretieren und das falsche Werkzeug oder die falsche Aktion auswählen - nicht weil die richtige Option fehlt, sondern weil das Signal unter Rauschen begraben ist.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Ablenkung durch den Kontext</h3><p>Kontextabhängige Ablenkung tritt auf, wenn übermäßige Kontextinformationen die Aufmerksamkeit des Modells dominieren und es sich weniger auf vorher gelerntes Wissen und allgemeine Schlussfolgerungen verlassen kann.</p>
<p>Anstatt sich auf allgemein erlernte Muster zu verlassen, gewichtet das Modell aktuelle Details im Kontext über, selbst wenn diese unvollständig oder unzuverlässig sind. Dies kann zu oberflächlichen oder spröden Schlussfolgerungen führen, die den Kontext zu genau widerspiegeln, anstatt ein übergeordnetes Verständnis anzuwenden.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Kontext-Vergiftung</h3><p>Context Poisoning tritt auf, wenn falsche Informationen in den Kontext einfließen und über mehrere Runden hinweg wiederholt referenziert und verstärkt werden.</p>
<p>Eine einzige falsche Aussage, die zu Beginn des Gesprächs eingeführt wird, kann zur Grundlage für die weitere Argumentation werden. Im weiteren Verlauf des Dialogs baut das Modell auf dieser fehlerhaften Annahme auf, wodurch sich der Fehler vergrößert und das Modell weiter von der richtigen Antwort abdriftet.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">Was ist Context Pruning und warum ist es so wichtig?<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald man anfängt, sich mit langen Kontexten zu beschäftigen, merkt man schnell, dass man mehr als einen Trick braucht, um die Dinge unter Kontrolle zu halten. In realen Systemen kombinieren Teams in der Regel eine Reihe von Taktiken - RAG, Tool Loadout, Zusammenfassung, Quarantäne bestimmter Nachrichten, Auslagerung alter Historien und so weiter. Sie alle helfen auf unterschiedliche Weise. Aber <strong>Context Pruning</strong> ist diejenige, die direkt entscheidet, <em>was tatsächlich</em> in das Modell eingespeist wird.</p>
<p>Context Pruning ist, einfach ausgedrückt, der Prozess des automatischen Entfernens irrelevanter, geringwertiger oder widersprüchlicher Informationen, bevor sie in das Kontextfenster des Modells gelangen. Im Grunde handelt es sich dabei um einen Filter, der nur die Textstücke behält, die für die aktuelle Aufgabe am wahrscheinlichsten sind.</p>
<p>Andere Strategien reorganisieren den Kontext, komprimieren ihn oder schieben einige Teile für später beiseite. Pruning ist direkter: <strong>Es beantwortet die Frage: "Soll diese Information überhaupt in den Prompt aufgenommen werden?"</strong></p>
<p>Aus diesem Grund ist Pruning in RAG-Systemen besonders wichtig. Die Vektorsuche ist großartig, aber sie ist nicht perfekt. Sie liefert oft eine große Wundertüte von Kandidaten - manche nützlich, manche lose verwandt, manche völlig daneben. Wenn man sie einfach alle in die Eingabeaufforderung einträgt, kommt es zu den bereits erwähnten Fehlermöglichkeiten. Das Pruning sitzt zwischen dem Abruf und dem Modell und entscheidet als Gatekeeper, welche Chunks behalten werden sollen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn Pruning gut funktioniert, zeigen sich die Vorteile sofort: sauberer Kontext, konsistentere Antworten, geringere Verwendung von Token und weniger seltsame Nebeneffekte durch irrelevanten Text, der sich eingeschlichen hat. Selbst wenn Sie nichts an Ihrem Abruf-Setup ändern, kann das Hinzufügen eines soliden Pruning-Schrittes die Gesamtleistung des Systems spürbar verbessern.</p>
<p>In der Praxis ist Pruning eine der wirksamsten Optimierungen in einer Long-Context- oder RAG-Pipeline - einfache Idee, große Wirkung.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence: Ein praktisches Context Pruning Modell<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Untersuchung von Ansätzen zum Context Pruning bin ich auf zwei überzeugende Open-Source-Modelle gestoßen, die bei <strong>Naver Labs Europe</strong> entwickelt wurden: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> und seine mehrsprachige Variante, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence ist eine Methode zum Trainieren eines leichtgewichtigen Context Pruning Modells für Retrieval-augmentierte Generierung, mit besonderem Fokus auf die Beantwortung von Fragen. Ausgehend von einer Benutzerfrage und einer abgerufenen Passage werden irrelevante Sätze identifiziert und entfernt, wobei nur die Informationen erhalten bleiben, die zur endgültigen Antwort beitragen.</p>
<p>Durch das Ausschneiden geringwertiger Inhalte vor der Generierung reduziert Provence das Rauschen in der Eingabe des Modells, verkürzt die Eingabeaufforderungen und verringert die LLM-Inferenzlatenz. Es ist außerdem Plug-and-Play-fähig und kann mit jedem LLM- oder Retrievalsystem verwendet werden, ohne dass eine enge Integration oder architektonische Änderungen erforderlich sind.</p>
<p>Provence bietet mehrere praktische Funktionen für reale RAG-Pipelines.</p>
<p><strong>1. Verstehen auf Dokumentenebene</strong></p>
<p>Provence betrachtet Dokumente als Ganzes, anstatt Sätze isoliert zu bewerten. Dies ist wichtig, da reale Dokumente häufig Verweise wie "es", "dies" oder "die obige Methode" enthalten. Isoliert betrachtet, können diese Sätze mehrdeutig oder sogar bedeutungslos sein. Betrachtet man sie im Kontext, wird ihre Relevanz deutlich. Durch die ganzheitliche Modellierung des Dokuments führt Provence zu genaueren und kohärenteren Bereinigungsentscheidungen.</p>
<p><strong>2. Adaptive Satzauswahl</strong></p>
<p>Provence bestimmt automatisch, wie viele Sätze aus einem abgerufenen Dokument übernommen werden sollen. Anstatt sich auf feste Regeln wie "die ersten fünf Sätze behalten" zu verlassen, passt es sich an die Anfrage und den Inhalt an.</p>
<p>Manche Fragen können mit einem einzigen Satz beantwortet werden, während andere mehrere unterstützende Aussagen erfordern. Provence geht mit dieser Variation dynamisch um, indem es einen Relevanzschwellenwert verwendet, der in allen Domänen gut funktioniert und bei Bedarf angepasst werden kann - in den meisten Fällen ohne manuelle Anpassung.</p>
<p><strong>3. Hohe Effizienz mit integriertem Reranking</strong></p>
<p>Provence wurde entwickelt, um effizient zu sein. Es ist ein kompaktes, leichtgewichtiges Modell, das deutlich schneller und kostengünstiger ist als LLM-basierte Pruning-Ansätze.</p>
<p>Noch wichtiger ist, dass Provence Reranking und Context Pruning in einem einzigen Schritt kombinieren kann. Da Reranking bereits ein Standardschritt in modernen RAG-Pipelines ist, werden durch die Integration von Pruning an dieser Stelle die zusätzlichen Kosten des Context Pruning gegen Null tendieren, während gleichzeitig die Qualität des an das Sprachmodell übergebenen Kontexts verbessert wird.</p>
<p><strong>4. Mehrsprachige Unterstützung durch XProvence</strong></p>
<p>Provence hat auch eine Variante namens XProvence, die die gleiche Architektur verwendet, aber auf mehrsprachigen Daten trainiert wird. Dies ermöglicht die Auswertung von Anfragen und Dokumenten in verschiedenen Sprachen, wie z. B. Chinesisch, Englisch und Koreanisch, und eignet sich daher für mehrsprachige und sprachübergreifende RAG-Systeme.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Wie Provence trainiert wird</h3><p>Provence verwendet ein sauberes und effektives Trainingsdesign, das auf einer Cross-Encoder-Architektur basiert. Während des Trainings werden die Abfrage und jede abgefragte Passage zu einer einzigen Eingabe verkettet und gemeinsam kodiert. Dadurch kann das Modell den gesamten Kontext der Frage und des Textes auf einmal erfassen und direkt auf deren Relevanz schließen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Diese gemeinsame Kodierung ermöglicht es Provence, aus feinkörnigen Relevanzsignalen zu lernen. Das Modell ist auf <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> als leichtgewichtigem Kodierer abgestimmt und optimiert, um zwei Aufgaben gleichzeitig zu erfüllen:</p>
<ol>
<li><p><strong>Relevanzbewertung auf Dokumentenebene (rerank score):</strong> Das Modell sagt eine Relevanzbewertung für das gesamte Dokument voraus, die angibt, wie gut es mit der Anfrage übereinstimmt. Ein Wert von 0,8 steht beispielsweise für hohe Relevanz.</p></li>
<li><p><strong>Relevanzkennzeichnung auf Token-Ebene (binäre Maske):</strong> Parallel dazu weist das Modell jedem Token ein binäres Label zu, das angibt, ob es für die Suchanfrage relevant (<code translate="no">1</code>) oder irrelevant (<code translate="no">0</code>) ist.</p></li>
</ol>
<p>Auf diese Weise kann das trainierte Modell die Gesamtrelevanz eines Dokuments beurteilen und feststellen, welche Teile beibehalten oder entfernt werden sollten.</p>
<p>Zum Zeitpunkt der Inferenz sagt Provence die Relevanzkennzeichnungen auf Token-Ebene voraus. Diese Vorhersagen werden dann auf Satzebene aggregiert: Ein Satz wird beibehalten, wenn er mehr relevante als irrelevante Token enthält; andernfalls wird er gestrichen. Da das Modell mit Überwachung auf Satzebene trainiert wird, sind die Token-Vorhersagen innerhalb desselben Satzes tendenziell konsistent, was diese Aggregationsstrategie in der Praxis zuverlässig macht. Das Pruning-Verhalten kann auch durch Anpassung der Aggregationsschwelle eingestellt werden, um ein konservativeres oder aggressiveres Pruning zu erreichen.</p>
<p>Entscheidend ist, dass Provence den Reranking-Schritt wiederverwendet, den die meisten RAG-Pipelines bereits enthalten. Das bedeutet, dass Context Pruning mit wenig bis gar keinem zusätzlichen Overhead hinzugefügt werden kann, was Provence besonders praktisch für reale RAG-Systeme macht.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Evaluierung der Context Pruning Performance über verschiedene Modelle hinweg<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Bis jetzt haben wir uns auf das Design und das Training von Provence konzentriert. Der nächste Schritt besteht darin, die Leistung von Provence in der Praxis zu evaluieren: wie gut es den Kontext bereinigt, wie es im Vergleich zu anderen Ansätzen abschneidet und wie es sich unter realen Bedingungen verhält.</p>
<p>Um diese Fragen zu beantworten, haben wir eine Reihe von quantitativen Experimenten entwickelt, um die Qualität der Kontexterkennung zwischen verschiedenen Modellen in realistischen Bewertungsumgebungen zu vergleichen.</p>
<p>Die Experimente konzentrieren sich auf zwei Hauptziele:</p>
<ul>
<li><p><strong>Effektivität des Pruning:</strong> Wir messen, wie genau jedes Modell relevante Inhalte beibehält, während irrelevante Informationen entfernt werden, wobei wir Standardkennzahlen wie Precision, Recall und F1-Score verwenden.</p></li>
<li><p><strong>Verallgemeinerung außerhalb der Domäne:</strong> Wir bewerten, wie gut jedes Modell bei Datenverteilungen abschneidet, die sich von den Trainingsdaten unterscheiden, und bewerten die Robustheit in Szenarien außerhalb der Domäne.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Verglichene Modelle</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (Ein Pruning-Modell, das auf einer BERT-Architektur basiert und speziell für semantische Hervorhebungsaufgaben entwickelt wurde)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Datensatz</h3><p>Wir verwenden WikiText-2 als Evaluierungsdatensatz. WikiText-2 stammt aus Wikipedia-Artikeln und enthält unterschiedliche Dokumentstrukturen, in denen relevante Informationen oft über mehrere Sätze verteilt sind und semantische Beziehungen nicht trivial sein können.</p>
<p>WikiText-2 unterscheidet sich wesentlich von den Daten, die normalerweise zum Trainieren von Context Pruning-Modellen verwendet werden, ähnelt aber dennoch realen, wissensintensiven Inhalten. Dies macht es gut geeignet für die Evaluierung außerhalb der Domäne, was ein Hauptaugenmerk unserer Experimente ist.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Abfragegenerierung und Beschriftung</h3><p>Um eine Out-of-Domain Pruning-Aufgabe zu konstruieren, generieren wir automatisch Frage-Antwort-Paare aus dem rohen WikiText-2-Korpus mit <strong>GPT-4o-mini</strong>. Jedes Bewertungsbeispiel besteht aus drei Komponenten:</p>
<ul>
<li><p><strong>Abfrage:</strong> Eine natürlichsprachliche Frage, die aus dem Dokument generiert wurde.</p></li>
<li><p><strong>Kontext:</strong> Das vollständige, unveränderte Dokument.</p></li>
<li><p><strong>Ground Truth:</strong> Annotationen auf Satzebene, die angeben, welche Sätze die Antwort enthalten (die beibehalten werden sollen) und welche irrelevant sind (die entfernt werden sollen).</p></li>
</ul>
<p>Dieser Aufbau definiert natürlich die Aufgabe des Context Pruning: Bei einer Anfrage und einem vollständigen Dokument muss das Modell die Sätze identifizieren, die tatsächlich wichtig sind. Sätze, die die Antwort enthalten, werden als relevant eingestuft und sollten beibehalten werden, während alle anderen Sätze als irrelevant eingestuft und gestrichen werden sollten. Mit dieser Formulierung kann die Qualität des Prunings quantitativ anhand von Precision, Recall und F1-Score gemessen werden.</p>
<p>Entscheidend ist, dass die generierten Fragen nicht in den Trainingsdaten eines bewerteten Modells erscheinen. Daher spiegelt die Leistung eher eine echte Generalisierung als ein Auswendiglernen wider. Insgesamt generieren wir 300 Beispiele, die von einfachen faktenbasierten Fragen über Multi-Hop-Reasoning-Aufgaben bis hin zu komplexeren analytischen Aufforderungen reichen, um reale Nutzungsmuster besser widerzuspiegeln.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Evaluierungs-Pipeline</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Optimierung der Hyperparameter: Für jedes Modell führen wir eine Rastersuche über einen vordefinierten Hyperparameterraum durch und wählen die Konfiguration aus, die die F1-Punktzahl maximiert.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Ergebnisse und Analyse</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Ergebnisse zeigen deutliche Leistungsunterschiede zwischen den drei Modellen.</p>
<p><strong>Provence</strong> erzielt mit einer <strong>F1-Punktzahl von 66,76 %</strong> die beste Gesamtleistung. Seine Präzision<strong>(69,53 %</strong>) und sein Wiedererkennungswert<strong>(64,19 %</strong>) sind gut ausgeglichen, was auf eine robuste Verallgemeinerung außerhalb der Domäne hindeutet. Die optimale Konfiguration verwendet einen Pruning-Schwellenwert von <strong>0,6</strong> und α <strong>= 0,051</strong>, was darauf hindeutet, dass die Relevanzwerte des Modells gut kalibriert sind und dass das Pruning-Verhalten intuitiv und in der Praxis leicht einzustellen ist.</p>
<p><strong>XProvence</strong> erreicht eine <strong>F1-Punktzahl von 58,97 %</strong>, gekennzeichnet durch eine <strong>hohe Wiederauffindbarkeit (75,52 %)</strong> und eine <strong>geringere Genauigkeit (48,37 %)</strong>. Dies spiegelt eine konservativere Beschneidungsstrategie wider, die der Beibehaltung potenziell relevanter Informationen Vorrang vor der aggressiven Entfernung von Rauschen einräumt. Ein solches Verhalten kann in Bereichen wünschenswert sein, in denen falsch-negative Ergebnisse kostspielig sind - z. B. im Gesundheitswesen oder bei juristischen Anwendungen -, aber es erhöht auch die Anzahl der falsch-positiven Ergebnisse, was die Genauigkeit verringert. Trotz dieses Kompromisses ist XProvence durch seine Mehrsprachigkeit eine gute Option für nicht-englische oder sprachübergreifende Umgebungen.</p>
<p>Im Gegensatz dazu schneidet <strong>OpenSearch Semantic Highlighter</strong> mit einem <strong>F1-Ergebnis von 46,37%</strong> (Precision <strong>62,35%</strong>, Recall <strong>36,98%</strong>) wesentlich schlechter ab. Der Rückstand gegenüber Provence und XProvence deutet auf Einschränkungen sowohl bei der Kalibrierung der Ergebnisse als auch bei der Verallgemeinerung außerhalb der Domäne hin, insbesondere unter Bedingungen außerhalb der Domäne.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Semantische Hervorhebung: Ein weiterer Weg, um zu finden, was im Text wirklich wichtig ist<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun über das Context Pruning gesprochen haben, lohnt es sich, einen Blick auf ein verwandtes Puzzleteil zu werfen: die <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>semantische Hervorhebung</strong></a>. Technisch gesehen erfüllen beide Funktionen fast dieselbe Aufgabe - sie bewerten Textteile auf der Grundlage ihrer Relevanz für eine Suchanfrage. Der Unterschied besteht darin, wie das Ergebnis in der Pipeline verwendet wird.</p>
<p>Die meisten Leute hören "Hervorhebung" und denken an die klassischen Keyword-Highlighter, die man in Elasticsearch oder Solr sieht. Diese Tools suchen im Wesentlichen nach wörtlichen Schlüsselwortübereinstimmungen und verpacken sie in etwas wie <code translate="no">&lt;em&gt;</code>. Sie sind billig und vorhersehbar, aber sie funktionieren nur, wenn der Text <em>genau</em> die gleichen Wörter wie die Abfrage verwendet. Wenn das Dokument Umschreibungen enthält, Synonyme verwendet oder den Begriff anders formuliert, wird er von den herkömmlichen Hervorhebungsprogrammen völlig übersehen.</p>
<p><strong>Die semantische Hervorhebung geht einen anderen Weg.</strong> Anstatt nach exakten Übereinstimmungen zu suchen, wird ein Modell verwendet, um die semantische Ähnlichkeit zwischen der Suchanfrage und verschiedenen Textabschnitten zu schätzen. Dadurch können relevante Inhalte auch dann hervorgehoben werden, wenn der Wortlaut völlig unterschiedlich ist. Für RAG-Pipelines, Agenten-Workflows oder jedes KI-Suchsystem, bei dem die Bedeutung wichtiger ist als die Token, bietet die semantische Hervorhebung ein viel klareres Bild davon, <em>warum</em> ein Dokument abgerufen wurde.</p>
<p>Das Problem ist, dass die meisten vorhandenen Lösungen zur semantischen Hervorhebung nicht für KI-Arbeitslasten in der Produktion ausgelegt sind. Wir haben alle verfügbaren Lösungen getestet, und keine von ihnen bot den Grad an Präzision, Latenz oder mehrsprachiger Zuverlässigkeit, den wir für echte RAG- und Agentensysteme benötigten. Also haben wir stattdessen unser eigenes Modell trainiert und zur Verfügung gestellt: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p>
<p>Auf einer hohen Ebene <strong>lösen Context Pruning und semantische Hervorhebung dieselbe Kernaufgabe</strong>: Bei einer Anfrage und einem Textstück muss herausgefunden werden, welche Teile wirklich wichtig sind. Der einzige Unterschied ist, was als nächstes passiert.</p>
<ul>
<li><p><strong>Beim Context Pruning</strong> werden die irrelevanten Teile vor der Generierung entfernt.</p></li>
<li><p>Bei<strong>der semantischen Hervorhebung</strong> bleibt der gesamte Text erhalten, aber die wichtigen Abschnitte werden visuell hervorgehoben.</p></li>
</ul>
<p>Da der zugrunde liegende Vorgang so ähnlich ist, kann oft dasselbe Modell für beide Funktionen verwendet werden. Das erleichtert die Wiederverwendung von Komponenten im gesamten Stack und macht Ihr RAG-System insgesamt einfacher und effizienter.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Semantische Hervorhebung in Milvus und Zilliz Cloud</h3><p>Die semantische Hervorhebung wird nun vollständig von <a href="https://milvus.io">Milvus</a> und <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (dem vollständig verwalteten Service von Milvus) unterstützt und erweist sich bereits als nützlich für alle, die mit RAG oder KI-gesteuerter Suche arbeiten. Die Funktion löst ein sehr einfaches, aber schmerzhaftes Problem: Wenn die Vektorsuche eine Menge Chunks liefert, wie findet man dann schnell heraus, <em>welche Sätze innerhalb dieser Chunks wirklich wichtig sind</em>?</p>
<p>Ohne Hervorhebung müssen die Benutzer ganze Dokumente lesen, nur um zu verstehen, warum etwas gefunden wurde. Mit der integrierten semantischen Hervorhebung markieren Milvus und Zilliz Cloud automatisch die spezifischen Abschnitte, die in semantischem Zusammenhang mit Ihrer Anfrage stehen - selbst wenn der Wortlaut unterschiedlich ist. Sie müssen nicht mehr nach übereinstimmenden Schlüsselwörtern suchen oder raten, warum ein Abschnitt auftaucht.</p>
<p>Das macht die Suche viel transparenter. Anstatt nur "relevante Dokumente" zu liefern, zeigt Milvus <em>, wo</em> die Relevanz liegt. Für RAG-Pipelines ist dies besonders hilfreich, da Sie sofort sehen können, worauf das Modell achten soll, was die Fehlersuche und die Erstellung von Eingabeaufforderungen erheblich erleichtert.</p>
<p>Wir haben diese Unterstützung direkt in Milvus und Zilliz Cloud integriert, so dass Sie keine externen Modelle hinzufügen oder einen anderen Dienst ausführen müssen, um eine brauchbare Attribution zu erhalten. Alles läuft innerhalb des Retrievalpfads: Vektorsuche → Relevanzbewertung → hervorgehobene Spans. Die Lösung ist sofort einsatzbereit und unterstützt mehrsprachige Workloads mit unserem Modell <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">Ein Blick in die Zukunft<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Context Engineering ist noch ziemlich neu, und es gibt noch viel herauszufinden. Selbst wenn Pruning und semantische Hervorhebung in <a href="https://milvus.io">Milvus</a> und <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> gut funktionieren<strong>,</strong> sind wir noch lange nicht am Ende der Geschichte angelangt. Es gibt eine Reihe von Bereichen, in denen noch echte Entwicklungsarbeit geleistet werden muss - genauere Pruning-Modelle, ohne die Abläufe zu verlangsamen, besserer Umgang mit seltsamen oder domänenfremden Abfragen und die Verknüpfung aller Teile miteinander, damit sich Retrieval → Rerank → Prune → Highlight wie eine einzige saubere Pipeline anfühlt und nicht wie eine Reihe von zusammengeklebten Hacks.</p>
<p>Da die Kontextfenster immer größer werden, werden diese Entscheidungen nur noch wichtiger. Eine gute Kontextverwaltung ist kein "netter Bonus" mehr, sondern wird zu einem Kernbestandteil der Zuverlässigkeit von Systemen mit langen Kontexten und RAGs.</p>
<p>Wir werden weiter experimentieren, Benchmarks durchführen und die Teile ausliefern, die für Entwickler tatsächlich einen Unterschied machen. Das Ziel ist klar: Es soll einfacher werden, Systeme zu erstellen, die bei unordentlichen Daten, unvorhersehbaren Abfragen oder großen Arbeitslasten nicht zusammenbrechen.</p>
<p>Wenn Sie etwas davon besprechen möchten - oder einfach nur Hilfe beim Debuggen benötigen - können Sie in unseren <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> einsteigen oder eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunde</a> zu erhalten.</p>
<p>Wir freuen uns immer über einen Chat und den Austausch mit anderen Entwicklern.</p>
