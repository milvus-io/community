---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Wir haben ein zweisprachiges semantisches Hervorhebungsmodell für die
  RAG-Produktion und die KI-Suche trainiert und als Open-Source bereitgestellt
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Tauchen Sie tief in die semantische Hervorhebung ein und erfahren Sie, wie das
  zweisprachige Modell von Zilliz aufgebaut ist und wie es in englischen und
  chinesischen Benchmarks für RAG-Systeme abschneidet.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Ganz gleich, ob Sie eine Produktsuche, eine RAG-Pipeline oder einen KI-Agenten entwickeln, die Benutzer benötigen letztlich dasselbe: eine schnelle Möglichkeit, um zu erkennen, warum ein Ergebnis relevant ist. <strong>Hervorhebungen</strong> helfen dabei, indem sie den genauen Text markieren, der die Übereinstimmung unterstützt, so dass die Benutzer nicht das gesamte Dokument scannen müssen.</p>
<p>Die meisten Systeme basieren immer noch auf der Hervorhebung von Schlüsselwörtern. Wenn ein Benutzer nach "iPhone-Leistung" sucht, hebt das System die genauen Token "iPhone" und "Leistung" hervor. Dies funktioniert jedoch nicht mehr, sobald der Text dieselbe Idee mit unterschiedlichen Formulierungen ausdrückt. Eine Beschreibung wie "A15 Bionic-Chip, über eine Million Benchmarks, flüssig und ohne Verzögerung" bezieht sich eindeutig auf die Leistung, wird aber nicht hervorgehoben, weil die Schlüsselwörter nie vorkommen.</p>
<p>Die<strong>semantische Hervorhebung</strong> löst dieses Problem. Anstatt exakte Zeichenfolgen abzugleichen, werden Textabschnitte identifiziert, die semantisch mit der Anfrage übereinstimmen. Für RAG-Systeme, KI-Suche und Agenten - bei denen die Relevanz von der Bedeutung und nicht von der Oberflächenform abhängt - liefert dies präzisere, zuverlässigere Erklärungen, warum ein Dokument abgerufen wurde.</p>
<p>Bestehende Methoden zur semantischen Hervorhebung sind jedoch nicht für den produktiven Einsatz von KI geeignet. Nach der Evaluierung aller verfügbaren Lösungen stellten wir fest, dass keine die Präzision, Latenz, mehrsprachige Abdeckung oder Robustheit bietet, die für RAG-Pipelines, Agentensysteme oder eine groß angelegte Websuche erforderlich sind. <strong>Also trainierten wir unser eigenes zweisprachiges semantisches Hervorhebungsmodell - und stellten es als Open Source zur Verfügung.</strong></p>
<ul>
<li><p>Unser semantisches Hervorhebungsmodell: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Sagen Sie uns Ihre Meinung - nehmen Sie an unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> teil, folgen Sie uns auf <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>, oder buchen Sie eine <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20-minütige Milvus-Sprechstunde</a> mit uns.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Wie schlagwortbasierte Hervorhebung funktioniert - und warum sie in modernen KI-Systemen scheitert<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Herkömmliche Suchsysteme implementieren die Hervorhebung durch einfachen Schlüsselwortabgleich</strong>. Wenn Ergebnisse zurückgegeben werden, findet die Maschine die genauen Token-Positionen, die mit der Abfrage übereinstimmen, und wickelt sie in Markup ein (normalerweise <code translate="no">&lt;em&gt;</code> Tags), so dass das Frontend die Hervorhebung wiedergeben kann. Dies funktioniert gut, wenn die Suchbegriffe wörtlich im Text vorkommen.</p>
<p>Das Problem ist, dass dieses Modell davon ausgeht, dass die Relevanz an die exakte Überschneidung der Suchbegriffe gebunden ist. Sobald diese Annahme nicht mehr zutrifft, sinkt die Zuverlässigkeit schnell. Jedes Ergebnis, das die richtige Idee mit einem anderen Wortlaut ausdrückt, wird überhaupt nicht hervorgehoben, selbst wenn der Abrufschritt korrekt war.</p>
<p>Diese Schwäche wird in modernen KI-Anwendungen deutlich. In RAG-Pipelines und KI-Agenten-Workflows sind die Abfragen abstrakter, die Dokumente länger und die relevanten Informationen verwenden möglicherweise nicht mehr dieselben Wörter. Das Hervorheben von Schlüsselwörtern kann Entwicklern - oder Endbenutzern - nicht mehr zeigen, wo<em>sich die Antwort tatsächlich befindet</em>, wodurch das Gesamtsystem als weniger genau empfunden wird, selbst wenn die Abfrage wie vorgesehen funktioniert.</p>
<p>Angenommen, ein Benutzer fragt: <em>"Wie kann ich die Ausführungseffizienz von Python-Code verbessern?"</em> Das System ruft ein technisches Dokument aus einer Vektordatenbank ab. Herkömmliche Hervorhebungen können nur wörtliche Übereinstimmungen wie <em>"Python",</em> <em>"Code",</em> <em>"Ausführung"</em> und <em>"Effizienz"</em> markieren <em>.</em></p>
<p>Die nützlichsten Teile des Dokuments könnten jedoch sein:</p>
<ul>
<li><p>Verwendung von NumPy-Vektoroperationen anstelle von expliziten Schleifen</p></li>
<li><p>Vermeiden Sie das wiederholte Erstellen von Objekten innerhalb von Schleifen</p></li>
</ul>
<p>Diese Sätze beantworten die Frage direkt, aber sie enthalten keinen der Suchbegriffe. Infolgedessen versagt die traditionelle Hervorhebung vollständig. Das Dokument mag zwar relevant sein, aber der Benutzer muss es trotzdem Zeile für Zeile durchsuchen, um die eigentliche Antwort zu finden.</p>
<p>Das Problem wird bei KI-Agenten noch deutlicher. Die Suchanfrage eines Agenten ist oft nicht die ursprüngliche Frage des Benutzers, sondern eine abgeleitete Anweisung, die durch logisches Denken und Aufgabenzerlegung entsteht. Wenn ein Benutzer beispielsweise fragt: <em>"Können Sie die jüngsten Markttrends analysieren?",</em> könnte der Agent eine Abfrage wie "Abrufen von Verkaufsdaten für Unterhaltungselektronik für das vierte Quartal 2024, Wachstumsraten im Jahresvergleich, Änderungen der Marktanteile der wichtigsten Wettbewerber und Kostenschwankungen in der Lieferkette" erstellen.</p>
<p>Diese Abfrage erstreckt sich über mehrere Dimensionen und kodiert eine komplexe Absicht. Herkömmliche schlagwortbasierte Hervorhebungen können jedoch nur wörtliche Übereinstimmungen wie <em>"2024",</em> <em>"Verkaufsdaten"</em> oder <em>"Wachstumsrate"</em> mechanisch markieren <em>.</em></p>
<p>In der Zwischenzeit können die wertvollsten Erkenntnisse wie folgt aussehen:</p>
<ul>
<li><p>Die iPhone 15-Serie war der Motor für eine breitere Markterholung</p></li>
<li><p>Engpässe bei der Chipversorgung haben die Kosten um 15 % in die Höhe getrieben</p></li>
</ul>
<p>Diese Schlussfolgerungen haben möglicherweise kein einziges Schlüsselwort mit der Abfrage gemeinsam, obwohl sie genau das sind, was der Agent zu extrahieren versucht. Agenten müssen schnell wirklich nützliche Informationen aus großen Mengen abgerufener Inhalte herausfinden - und die stichwortbasierte Hervorhebung bietet keine wirkliche Hilfe.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">Was ist semantische Hervorhebung und wo liegen die Schwachstellen bei den heutigen Lösungen?<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Die semantische Hervorhebung basiert auf der gleichen Idee wie die semantische Suche: Der Abgleich basiert auf der Bedeutung und nicht auf exakten Wörtern</strong>. Bei der semantischen Suche bilden Einbettungsmodelle Text in Vektoren ab, so dass ein Suchsystem - in der Regel unterstützt durch eine Vektordatenbank wie <a href="https://milvus.io/">Milvus -</a>Passagen abrufen <a href="https://milvus.io/">kann</a>, die dieselbe Idee wie die Suchanfrage vermitteln, auch wenn der Wortlaut unterschiedlich ist. Die semantische Hervorhebung wendet dieses Prinzip auf einer feineren Granularität an. Anstatt wörtliche Schlüsselworttreffer zu markieren, werden die spezifischen Abschnitte innerhalb eines Dokuments hervorgehoben, die für die Absicht des Benutzers semantisch relevant sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dieser Ansatz löst ein Kernproblem der traditionellen Hervorhebung, die nur funktioniert, wenn die Suchbegriffe wörtlich erscheinen. Wenn ein Benutzer nach "iPhone-Leistung" sucht, ignoriert die schlagwortbasierte Hervorhebung Sätze wie "A15 Bionic-Chip", "über eine Million in Benchmarks" oder "reibungslos und ohne Verzögerung", obwohl diese Zeilen die Frage eindeutig beantworten. Die semantische Hervorhebung erfasst diese bedeutungsbezogenen Zusammenhänge und zeigt die Teile des Textes an, die für die Benutzer tatsächlich von Bedeutung sind.</p>
<p>Theoretisch ist dies ein einfaches semantisches Zuordnungsproblem. Moderne Einbettungsmodelle kodieren Ähnlichkeit bereits gut, so dass die konzeptionellen Teile bereits vorhanden sind. Die Herausforderung liegt in der Praxis: Die Hervorhebung erfolgt bei jeder Abfrage, oft über viele abgerufene Dokumente hinweg, was Latenz, Durchsatz und bereichsübergreifende Robustheit zu nicht verhandelbaren Anforderungen macht. Große Sprachmodelle sind einfach zu langsam und zu teuer, um auf diesem hochfrequenten Pfad zu laufen.</p>
<p>Deshalb ist für die praktische semantische Hervorhebung ein leichtgewichtiges, spezialisiertes Modell erforderlich, das klein genug ist, um neben der Suchinfrastruktur eingesetzt zu werden, und schnell genug, um innerhalb weniger Millisekunden Ergebnisse zu liefern. An diesem Punkt scheitern die meisten bestehenden Lösungen. Schwere Modelle liefern Genauigkeit, können aber nicht in großem Umfang eingesetzt werden. Leichtere Modelle sind schnell, verlieren aber an Präzision oder versagen bei mehrsprachigen oder domänenspezifischen Daten.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Letztes Jahr hat OpenSearch ein spezielles Modell für die semantische Hervorhebung veröffentlicht: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Obwohl es ein sinnvoller Versuch ist, das Problem zu lösen, hat es zwei kritische Einschränkungen.</p>
<ul>
<li><p><strong>Kleines Kontextfenster:</strong> Das Modell basiert auf einer BERT-Architektur und unterstützt maximal 512 Token - ungefähr 300-400 chinesische Zeichen oder 400-500 englische Wörter. In realen Szenarien umfassen Produktbeschreibungen und technische Dokumente oft Tausende von Wörtern. Inhalte, die über das erste Fenster hinausgehen, werden einfach abgeschnitten, so dass das Modell gezwungen ist, Hervorhebungen nur auf der Grundlage eines kleinen Teils des Dokuments zu identifizieren.</p></li>
<li><p><strong>Schlechte Generalisierung außerhalb der Domäne:</strong> Das Modell funktioniert nur bei Datenverteilungen, die dem Trainingssatz ähneln, gut. Bei der Anwendung auf Daten außerhalb der Domäne - z. B. bei der Verwendung eines auf Nachrichtenartikeln trainierten Modells zur Hervorhebung von E-Commerce-Inhalten oder technischer Dokumentation - verschlechtert sich die Leistung drastisch. In unseren Experimenten erreicht das Modell bei domäneninternen Daten eine F1-Punktzahl von etwa 0,72, fällt aber bei domänenfremden Datensätzen auf etwa 0,46. Dieser Grad der Instabilität ist in der Produktion problematisch. Darüber hinaus unterstützt das Modell kein Chinesisch.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> ist ein von <a href="https://zilliz.com/customers/naver">Naver</a> entwickeltes Modell, das ursprünglich für <strong>Context Pruning</strong>trainiert wurde <strong>- eine</strong>Aufgabe, die eng mit der semantischen Hervorhebung verwandt ist.</p>
<p>Beide Aufgaben beruhen auf der gleichen Grundidee: dem semantischen Abgleich, um relevante Inhalte zu identifizieren und irrelevante Teile herauszufiltern. Aus diesem Grund kann Provence mit relativ geringen Anpassungen auch für die semantische Hervorhebung eingesetzt werden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence ist ein rein englischsprachiges Modell und schneidet in dieser Umgebung recht gut ab. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> ist seine mehrsprachige Variante, die mehr als ein Dutzend Sprachen unterstützt, darunter Chinesisch, Japanisch und Koreanisch. Auf den ersten Blick scheint XProvence daher ein guter Kandidat für zweisprachige oder mehrsprachige semantische Hervorhebungsszenarien zu sein.</p>
<p>In der Praxis weisen jedoch sowohl Provence als auch XProvence einige bemerkenswerte Einschränkungen auf:</p>
<ul>
<li><p><strong>Schwächere englische Leistung im mehrsprachigen Modell:</strong> XProvence erreicht nicht die Leistung von Provence bei englischen Benchmarks. Dies ist ein üblicher Kompromiss bei mehrsprachigen Modellen: Die Kapazität wird auf mehrere Sprachen aufgeteilt, was oft zu einer schwächeren Leistung in Sprachen mit hohen Ressourcen wie Englisch führt. Diese Einschränkung ist in realen Systemen von Bedeutung, in denen Englisch eine primäre oder dominante Arbeitslast bleibt.</p></li>
<li><p><strong>Begrenzte Leistung für Chinesisch:</strong> XProvence unterstützt viele Sprachen. Während des mehrsprachigen Trainings werden die Daten und die Modellkapazität auf mehrere Sprachen verteilt, was die Spezialisierung des Modells auf eine einzelne Sprache einschränkt. Infolgedessen ist die Leistung von XProvence in Chinesisch nur bedingt akzeptabel und oft unzureichend für hochpräzise Hervorhebungsanwendungen.</p></li>
<li><p><strong>Diskrepanz zwischen den Zielen von Pruning und Highlighting:</strong> Provence ist für das Pruning von Kontexten optimiert, bei dem es in erster Linie darum geht, so viele potenziell nützliche Inhalte wie möglich zu erhalten, um den Verlust kritischer Informationen zu vermeiden. Bei der semantischen Hervorhebung hingegen steht die Präzision im Vordergrund: Es werden nur die relevantesten Sätze hervorgehoben, nicht große Teile des Dokuments. Wenn Provence-Modelle auf Hervorhebungen angewendet werden, führt diese Diskrepanz oft zu übermäßig breiten oder verrauschten Hervorhebungen.</p></li>
<li><p><strong>Restriktive Lizenzierung:</strong> Sowohl Provence als auch XProvence werden unter der CC BY-NC 4.0-Lizenz veröffentlicht, die eine kommerzielle Nutzung nicht zulässt. Allein diese Einschränkung macht sie für viele Produktionsanwendungen ungeeignet.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Offene Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> ist ein von der Gemeinschaft getragenes Projekt, das die Provence-Trainings-Pipeline in einer offenen und transparenten Weise neu implementiert. Es bietet nicht nur Trainingsskripte, sondern auch Datenverarbeitungsabläufe, Bewertungswerkzeuge und vortrainierte Modelle in verschiedenen Maßstäben.</p>
<p>Ein entscheidender Vorteil von Open Provence ist seine <strong>freizügige MIT-Lizenz</strong>. Anders als Provence und XProvence kann es ohne rechtliche Einschränkungen in kommerziellen Umgebungen eingesetzt werden, was es für produktionsorientierte Teams attraktiv macht.</p>
<p>Allerdings unterstützt Open Provence derzeit nur <strong>Englisch und Japanisch</strong>, was es für unsere zweisprachigen Anwendungsfälle ungeeignet macht.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Wir haben ein zweisprachiges semantisches Hervorhebungsmodell trainiert und als Open-Source bereitgestellt<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein semantisches Hervorhebungsmodell, das für reale Arbeitslasten entwickelt wurde, muss einige wesentliche Fähigkeiten bieten:</p>
<ul>
<li><p>Starke mehrsprachige Leistung</p></li>
<li><p>Ein Kontextfenster, das groß genug ist, um lange Dokumente zu unterstützen</p></li>
<li><p>Robuste Generalisierung außerhalb der Domäne</p></li>
<li><p>Hohe Präzision bei semantischen Hervorhebungsaufgaben</p></li>
<li><p>Eine freizügige, produktionsfreundliche Lizenz (MIT oder Apache 2.0)</p></li>
</ul>
<p>Nach der Evaluierung bestehender Lösungen stellten wir fest, dass keines der verfügbaren Modelle die für den Produktionseinsatz erforderlichen Anforderungen erfüllte. Daher beschlossen wir, unser eigenes semantisches Hervorhebungsmodell zu trainieren: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um all dies zu erreichen, haben wir einen einfachen Ansatz gewählt: Wir verwenden große Sprachmodelle, um qualitativ hochwertige gelabelte Daten zu generieren, und trainieren darauf ein leichtgewichtiges semantisches Hervorhebungsmodell mit Open-Source-Werkzeugen. Auf diese Weise können wir die Argumentationsstärke von LLMs mit der Effizienz und den geringen Latenzzeiten kombinieren, die in Produktionssystemen erforderlich sind.</p>
<p><strong>Der schwierigste Teil dieses Prozesses ist die Datenerstellung</strong>. Während der Annotation fordern wir einen LLM (Qwen3 8B) auf, nicht nur die Highlight-Spans auszugeben, sondern auch die gesamte Argumentation dahinter. Dieses zusätzliche Argumentationssignal führt zu einer genaueren, konsistenten Überwachung und verbessert die Qualität des resultierenden Modells erheblich.</p>
<p>Auf einer hohen Ebene funktioniert die Annotationspipeline wie folgt: <strong>LLM-Reasoning → Markierungen → Filterung → endgültiges Trainingsmuster.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dieser Aufbau bietet in der Praxis drei konkrete Vorteile:</p>
<ul>
<li><p><strong>Höhere Qualität der Beschriftung</strong>: Das Modell wird aufgefordert, <em>erst zu denken und dann zu antworten</em>. Dieser Zwischenschritt dient als eingebaute Selbstüberprüfung und verringert die Wahrscheinlichkeit von unzureichenden oder inkonsistenten Beschriftungen.</p></li>
<li><p><strong>Verbesserte Beobachtbarkeit und Fehlersuche</strong>: Da jedes Etikett von einer Argumentationsspur begleitet wird, werden Fehler sichtbar. Dies erleichtert die Diagnose von Fehlern und die schnelle Anpassung von Prompts, Regeln oder Datenfiltern in der Pipeline.</p></li>
<li><p><strong>Wiederverwendbare Daten</strong>: Reasoning Traces liefern wertvollen Kontext für künftiges Re-Labeling. Wenn sich die Anforderungen ändern, können dieselben Daten erneut geprüft und verfeinert werden, ohne bei Null anfangen zu müssen.</p></li>
</ul>
<p>Mithilfe dieser Pipeline haben wir mehr als eine Million zweisprachige Trainingsmuster generiert, die etwa gleichmäßig auf Englisch und Chinesisch verteilt waren.</p>
<p>Für das Training des Modells haben wir mit dem BGE-M3 Reranker v2 (0,6B Parameter, 8.192 Token Kontextfenster) begonnen, das Open Provence Trainingsframework übernommen und drei Epochen lang auf 8× A100 GPUs trainiert, wodurch das Training in etwa fünf Stunden abgeschlossen war.</p>
<p>Wir werden diese technischen Entscheidungen - einschließlich der Frage, warum wir uns auf Argumentationsspuren verlassen, wie wir das Basismodell ausgewählt haben und wie der Datensatz erstellt wurde - in einem Folgebeitrag näher erläutern.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Benchmarking des zweisprachigen semantischen Hervorhebungsmodells von Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Um die Leistung in der Praxis zu bewerten, haben wir mehrere semantische Hervorhebungsmodelle in einer Reihe von Datensätzen evaluiert. Die Benchmarks umfassen sowohl domäneninterne als auch domänenexterne Szenarien in Englisch und Chinesisch, um die Vielfalt der in Produktionssystemen anzutreffenden Inhalte widerzuspiegeln.</p>
<h3 id="Datasets" class="common-anchor-header">Datensätze</h3><p>Wir haben die folgenden Datensätze in unserer Bewertung verwendet:</p>
<ul>
<li><p><strong>MultiSpanQA (Englisch)</strong> - ein In-Domain-Datensatz für die Beantwortung von Fragen mit mehreren Bereichen</p></li>
<li><p><strong>WikiText-2 (Englisch)</strong> - ein out-of-domain Wikipedia-Korpus</p></li>
<li><p><strong>MultiSpanQA-ZH (Chinesisch)</strong> - ein chinesischer Datensatz zur Beantwortung von Mehrspartenfragen</p></li>
<li><p><strong>WikiText-2-ZH (Chinesisch)</strong> - ein chinesischer Wikipedia-Korpus außerhalb der Domäne</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Verglichene Modelle</h3><p>Die in den Vergleich einbezogenen Modelle sind:</p>
<ul>
<li><p><strong>Offene Provence-Modelle</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (herausgegeben von Naver)</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong></p></li>
<li><p><strong>Das zweisprachige semantische Hervorhebungsmodell von Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Ergebnisse und Analyse</h3><p><strong>Englische Datensätze:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Chinesische Datensätze:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bei den zweisprachigen Benchmarks erreicht unser Modell die <strong>besten durchschnittlichen F1-Ergebnisse</strong> und übertrifft damit alle zuvor evaluierten Modelle und Ansätze. Besonders ausgeprägt sind die Gewinne bei den <strong>chinesischen Datensätzen</strong>, wo unser Modell XProvence - das einzige andere evaluierte Modell mit chinesischer Unterstützung - deutlich übertrifft.</p>
<p>Noch wichtiger ist jedoch, dass unser Modell eine ausgewogene Leistung sowohl auf Englisch als auch auf Chinesisch liefert, eine Eigenschaft, die mit bestehenden Lösungen nur schwer zu erreichen ist:</p>
<ul>
<li><p><strong>Open Provence</strong> unterstützt nur Englisch</p></li>
<li><p><strong>XProvence</strong> opfert die englische Leistung im Vergleich zu Provence</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> bietet keine Unterstützung für Chinesisch und zeigt eine schwache Generalisierung</p></li>
</ul>
<p>Infolgedessen vermeidet unser Modell die üblichen Kompromisse zwischen Sprachabdeckung und Leistung, wodurch es sich besser für reale zweisprachige Einsätze eignet.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Ein konkretes Beispiel aus der Praxis</h3><p>Jenseits von Benchmark-Ergebnissen ist es oft aufschlussreicher, ein konkretes Beispiel zu untersuchen. Das folgende Beispiel zeigt, wie sich unser Modell in einem realen Szenario zur semantischen Hervorhebung verhält und warum Präzision wichtig ist.</p>
<p><strong>Abfrage:</strong> Wer schrieb den Film <em>The Killing of a Sacred Deer</em>?</p>
<p><strong>Kontext (5 Sätze):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> ist ein Psychothriller aus dem Jahr 2017, bei dem Yorgos Lanthimos Regie führte und das Drehbuch von Lanthimos und Efthymis Filippou geschrieben wurde.</p></li>
<li><p>In dem Film spielen Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone und Bill Camp mit.</p></li>
<li><p>Die Geschichte basiert auf dem antiken griechischen Theaterstück <em>Iphigenie in Aulis</em> von Euripides.</p></li>
<li><p>Der Film handelt von einem Herzchirurgen, der eine geheime Freundschaft mit einem Teenager schließt, der mit seiner Vergangenheit verbunden ist.</p></li>
<li><p>Er macht den Jungen mit seiner Familie bekannt, woraufhin mysteriöse Krankheiten auftreten.</p></li>
</ol>
<p><strong>Richtiges Highlight: Satz 1</strong> ist die richtige Antwort, da er ausdrücklich besagt, dass das Drehbuch von Yorgos Lanthimos und Efthymis Filippou geschrieben wurde.</p>
<p>Dieses Beispiel enthält eine raffinierte Falle. <strong>In Satz 3</strong> wird Euripides erwähnt, der Autor des griechischen Originalstücks, auf dem die Geschichte lose basiert. In der Frage wird jedoch gefragt, wer den <em>Film</em> geschrieben hat, nicht die antike Vorlage. Die richtige Antwort lautet daher: die Drehbuchautoren des Films, nicht der Dramatiker von vor Tausenden von Jahren.</p>
<p><strong>Die Ergebnisse:</strong></p>
<p>Die folgende Tabelle fasst zusammen, wie die verschiedenen Modelle bei diesem Beispiel abgeschnitten haben.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modell</strong></th><th style="text-align:center"><strong>Ermittelte korrekte Antwort</strong></th><th style="text-align:center"><strong>Ergebnis</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Unseres (zweisprachig M3)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Ausgewählter Satz 1 (richtig) und Satz 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Hat nur Satz 3 ausgewählt, hat die richtige Antwort verpasst</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Nur Satz 3 ausgewählt, die richtige Antwort nicht gefunden</td></tr>
</tbody>
</table>
<p><strong>Vergleich der Ergebnisse auf Satzebene</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Satz</strong></th><th><strong>Unserer (zweisprachig M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Satz 1 (Filmdrehbuch, <strong>richtig</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Satz 3 (Original-Theaterstück, Distraktor)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Wo XProvence versagt</strong></p>
<ul>
<li><p>XProvence fühlt sich stark von den Schlüsselwörtern <em>"Euripides"</em> und <em>"schrieb"</em> angezogen <em>und</em> vergibt für Satz 3 eine fast perfekte Punktzahl (0,947 und 0,802).</p></li>
<li><p>Gleichzeitig ignoriert es weitgehend die richtige Antwort in Satz 1 und vergibt extrem niedrige Punktzahlen (0,133 und 0,081).</p></li>
<li><p>Auch nach der Senkung der Entscheidungsschwelle von 0,5 auf 0,2 gelingt es dem Modell nicht, die richtige Antwort zu finden.</p></li>
</ul>
<p>Mit anderen Worten: Das Modell wird in erster Linie von oberflächlichen Schlüsselwortassoziationen gesteuert und nicht von der eigentlichen Absicht der Frage.</p>
<p><strong>Wie sich unser Modell anders verhält</strong></p>
<ul>
<li><p>Unser Modell vergibt eine hohe Punktzahl (0,915) für die richtige Antwort in Satz 1, da es <em>die Drehbuchautoren des Films</em> korrekt identifiziert.</p></li>
<li><p>Es vergibt auch eine mäßige Punktzahl (0,719) für Satz 3, da in diesem Satz ein Konzept im Zusammenhang mit dem Drehbuch erwähnt wird.</p></li>
<li><p>Entscheidend ist, dass die Trennung deutlich und sinnvoll ist: <strong>0,915 vs. 0,719</strong>, ein Unterschied von fast 0,2.</p></li>
</ul>
<p>Dieses Beispiel verdeutlicht die zentrale Stärke unseres Ansatzes: Wir gehen über schlagwortbasierte Assoziationen hinaus und interpretieren die Absicht des Nutzers korrekt. Selbst wenn mehrere "Autor"-Konzepte auftauchen, hebt das Modell konsequent dasjenige hervor, auf das sich die Frage tatsächlich bezieht.</p>
<p>Einen detaillierteren Evaluierungsbericht und weitere Fallstudien werden wir in einem Folgebeitrag veröffentlichen.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Probieren Sie es aus und sagen Sie uns, was Sie denken<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben unser zweisprachiges semantisches Hervorhebungsmodell auf <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a> als Open Source zur Verfügung gestellt, wobei alle Modellgewichte öffentlich zugänglich sind, so dass Sie sofort mit dem Experimentieren beginnen können. Wir würden uns freuen zu hören, wie es bei Ihnen funktioniert - bitte teilen Sie uns Ihr Feedback, Probleme oder Verbesserungsvorschläge mit, wenn Sie es ausprobieren.</p>
<p>Parallel dazu arbeiten wir an einem produktionsreifen Inferenzdienst und integrieren das Modell direkt in <a href="https://milvus.io/">Milvus</a> als native Semantic Highlighting API. Diese Integration ist bereits im Gange und wird bald verfügbar sein.</p>
<p>Die semantische Hervorhebung öffnet die Tür zu einer intuitiveren RAG- und KI-Erfahrung. Wenn Milvus mehrere lange Dokumente abruft, kann das System sofort die relevantesten Sätze anzeigen und so deutlich machen, wo die Antwort zu finden ist. Dies verbessert nicht nur die Erfahrung des Endbenutzers, sondern hilft auch den Entwicklern bei der Fehlersuche in Abfrage-Pipelines, da genau angezeigt wird, auf welche Teile des Kontexts sich das System stützt.</p>
<p>Wir sind davon überzeugt, dass die semantische Hervorhebung in den Such- und RAG-Systemen der nächsten Generation zur Standardfunktion wird. Wenn Sie Ideen, Vorschläge oder Anwendungsfälle für zweisprachige semantische Hervorhebungen haben, treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei und teilen Sie Ihre Gedanken mit. Sie können auch ein 20-minütiges persönliches Gespräch buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> zu erhalten.</p>
