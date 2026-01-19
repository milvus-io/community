---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Wie wir ein semantisches Hervorhebungsmodell für RAG Context Pruning und Token
  Saving entwickelt haben
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Erfahren Sie, wie Zilliz ein semantisches Hervorhebungsmodell für
  RAG-Rauschfilterung, Kontextbeschneidung und Token-Sparen mit reinen
  Encoder-Architekturen, LLM-Schlussfolgerungen und umfangreichen zweisprachigen
  Trainingsdaten entwickelt hat.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">Das Problem: RAG-Rauschen und Token-Verschwendung<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p>Die<strong>Vektorsuche</strong> ist eine solide Grundlage für RAG-Systeme - Unternehmensassistenten, KI-Agenten, Kundensupport-Bots und mehr. Sie findet zuverlässig die Dokumente, auf die es ankommt. Aber die Abfrage allein löst das Kontextproblem nicht. Selbst gut abgestimmte Indizes liefern im Großen und Ganzen relevante Abschnitte, während nur ein kleiner Teil der Sätze innerhalb dieser Abschnitte tatsächlich die Anfrage beantwortet.</p>
<p>In Produktionssystemen macht sich diese Lücke sofort bemerkbar. Eine einzige Abfrage kann Dutzende von Dokumenten umfassen, von denen jedes Tausende von Token lang ist. Nur eine Handvoll Sätze enthält das eigentliche Signal; der Rest ist Kontext, der die Verwendung von Token aufbläht, die Inferenz verlangsamt und oft den LLM ablenkt. Noch deutlicher wird das Problem in Agenten-Workflows, wo die Abfragen selbst das Ergebnis mehrstufiger Schlussfolgerungen sind und nur kleine Teile des abgerufenen Textes abdecken.</p>
<p>Dadurch entsteht ein klarer Bedarf an einem Modell, das <em>die nützlichen Sätze</em> <em><strong>identifizieren und hervorheben</strong></em> <em>und den Rest ignorieren</em>kann <em>- im Wesentlichen</em>eine Relevanzfilterung auf Satzebene oder das, was viele Teams als <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>Context Pruning</strong></a> bezeichnen. Das Ziel ist einfach: die wichtigen Teile zu behalten und das Rauschen zu entfernen, bevor es den LLM erreicht.</p>
<p>Herkömmliche schlagwortbasierte Hervorhebungen können dieses Problem nicht lösen. Wenn ein Benutzer beispielsweise fragt: "Wie kann ich die Ausführungseffizienz von Python-Code verbessern?", wird ein Keyword-Highlighter "Python" und "Effizienz" herausfiltern, aber den Satz, der die Frage tatsächlich beantwortet - "NumPy vektorisierte Operationen anstelle von Schleifen verwenden" - übersehen, da er keine Schlüsselwörter mit der Anfrage teilt. Was wir stattdessen brauchen, ist semantisches Verständnis, nicht String-Matching.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Ein semantisches Hervorhebungsmodell für die RAG-Rauschfilterung und das Pruning von Kontexten<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Um dies für die Entwickler von RAG zu vereinfachen, haben wir ein <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>Semantic Highlighting Modell</strong></a> trainiert und als Open Source zur Verfügung gestellt, das die Sätze in den abgerufenen Dokumenten identifiziert und hervorhebt, die semantisch besser mit der Suchanfrage übereinstimmen. Das Modell liefert derzeit die beste Leistung sowohl auf Englisch als auch auf Chinesisch und ist so konzipiert, dass es direkt in bestehende RAG-Pipelines integriert werden kann.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modell-Details</strong></p>
<ul>
<li><p><strong>Umarmungsgesicht:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Lizenz:</strong> MIT (kommerziell-freundlich)</p></li>
<li><p><strong>Architektur:</strong> 0.6B Encoder-only Modell basierend auf BGE-M3 Reranker v2</p></li>
<li><p><strong>Kontext-Fenster:</strong> 8192 Token</p></li>
<li><p><strong>Unterstützte Sprachen:</strong> Englisch und Chinesisch</p></li>
</ul>
<p>Semantische Hervorhebung liefert die Relevanzsignale, die benötigt werden, um nur die nützlichen Teile von langen abgerufenen Dokumenten auszuwählen. In der Praxis ermöglicht dieses Modell:</p>
<ul>
<li><p><strong>Verbesserte Interpretierbarkeit</strong>, die zeigt, welche Teile eines Dokuments wirklich wichtig sind</p></li>
<li><p><strong>70-80% weniger Token-Kosten</strong>, da nur hervorgehobene Sätze an den LLM gesendet werden</p></li>
<li><p><strong>Bessere Antwortqualität</strong>, da das Modell weniger irrelevanten Kontext sieht</p></li>
<li><p><strong>Leichtere Fehlersuche</strong>, da die Ingenieure die Übereinstimmungen auf Satzebene direkt überprüfen können</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Bewertungsergebnisse: Erreichen der SOTA-Leistung</h3><p>Wir haben unser Semantisches Hervorhebungsmodell in mehreren Datensätzen sowohl auf Englisch als auch auf Chinesisch evaluiert, und zwar sowohl unter domäneninternen als auch domänenexternen Bedingungen.</p>
<p>Die Benchmark-Suiten umfassen:</p>
<ul>
<li><p><strong>Englische Multispan-QA:</strong> multispanqa</p></li>
<li><p><strong>Englisch out-of-domain Wikipedia:</strong> wikitext2</p></li>
<li><p><strong>Chinesische Mehrspur-QS:</strong> multispanqa_zh</p></li>
<li><p><strong>Chinesisch out-of-domain Wikipedia:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Zu den evaluierten Modellen gehören:</p>
<ul>
<li><p>Offene Provence-Reihe</p></li>
<li><p>Naver's Provence/XProvence-Reihe</p></li>
<li><p>OpenSearch's semantische Hervorhebung</p></li>
<li><p>Unser trainiertes zweisprachiges Modell: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>Über alle vier Datensätze hinweg erreicht unser Modell die beste Platzierung. Noch wichtiger ist, dass es das <em>einzige</em> Modell ist, das sowohl auf Englisch als auch auf Chinesisch konstant gut abschneidet. Konkurrierende Modelle konzentrieren sich entweder ausschließlich auf Englisch oder zeigen deutliche Leistungseinbußen bei chinesischem Text.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Wie wir dieses semantische Hervorhebungsmodell entwickelt haben<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Modell für diese Aufgabe zu trainieren ist nicht der schwierige Teil; die eigentliche Arbeit besteht darin, ein <em>gutes</em> Modell zu trainieren, das die früheren Probleme bewältigt und eine Leistung nahe der SOTA-Leistung liefert. Unser Ansatz konzentrierte sich auf zwei Dinge:</p>
<ul>
<li><p><strong>Modellarchitektur:</strong> Verwendung eines reinen Encoder-Designs für eine schnelle Inferenz.</p></li>
<li><p><strong>Trainingsdaten:</strong> Generierung hochwertiger Relevanzkennzeichnungen mit schlussfolgernden LLMs und Skalierung der Datengenerierung mit lokalen Inferenz-Frameworks.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Modell-Architektur</h3><p>Wir haben das Modell als leichtgewichtiges <strong>, reines Kodierernetzwerk</strong> aufgebaut, das Context Pruning als eine <strong>Relevanzbewertungsaufgabe auf Token-Ebene</strong> behandelt. Dieses Design ist inspiriert von <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, einem von Naver auf dem ICLR 2025 vorgestellten Ansatz zur Kontextsäuberung, bei dem das Pruning nicht mehr als "Auswahl des richtigen Chunks", sondern als "Bewertung jedes Tokens" verstanden wird. Dieser Ansatz passt natürlich zur semantischen Hervorhebung, bei der feinkörnige Signale wichtig sind.</p>
<p>Reine Encoder-Modelle sind zwar nicht die neueste Architektur, aber sie sind in diesem Fall äußerst praktisch: Sie sind schnell, einfach zu skalieren und können Relevanzbewertungen für alle Token-Positionen parallel erzeugen. Für ein RAG-Produktionssystem ist dieser Geschwindigkeitsvorteil weitaus wichtiger als die Verwendung eines größeren Decodermodells.</p>
<p>Nach der Berechnung der Relevanzwerte auf Token-Ebene werden diese zu Werten <strong>auf Satzebene</strong> aggregiert. Dieser Schritt verwandelt verrauschte Token-Signale in eine stabile, interpretierbare Relevanzmetrik. Sätze oberhalb eines konfigurierbaren Schwellenwerts werden hervorgehoben, alles andere wird herausgefiltert. Auf diese Weise entsteht ein einfacher und zuverlässiger Mechanismus zur Auswahl der Sätze, die für die Anfrage tatsächlich von Bedeutung sind.</p>
<h3 id="Inference-Process" class="common-anchor-header">Inferenz-Prozess</h3><p>Zur Laufzeit folgt unser semantisches Hervorhebungsmodell einer einfachen Pipeline:</p>
<ol>
<li><p><strong>Eingabe -</strong> Der Prozess beginnt mit einer Benutzerabfrage. Die abgerufenen Dokumente werden als Kontextkandidaten für die Relevanzbewertung behandelt.</p></li>
<li><p><strong>Modellverarbeitung-</strong> Die Abfrage und der Kontext werden zu einer einzigen Sequenz verkettet: [BOS] + Abfrage + Kontext</p></li>
<li><p><strong>Token-Scoring -</strong> Jedem Token im Kontext wird ein Relevanzwert zwischen 0 und 1 zugewiesen, der angibt, wie stark es mit der Abfrage in Verbindung steht.</p></li>
<li><p><strong>Satzaggregation -</strong> Die Token-Scores werden auf Satzebene aggregiert, in der Regel durch Mittelwertbildung, um einen Relevanz-Score für jeden Satz zu erhalten.</p></li>
<li><p><strong>Schwellenwertfilterung -</strong> Sätze, deren Punktzahl über einem konfigurierbaren Schwellenwert liegt, werden hervorgehoben und beibehalten, während Sätze mit niedriger Punktzahl herausgefiltert werden, bevor sie an das nachgeschaltete LLM weitergeleitet werden.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Basismodell: BGE-M3 Reranker v2</h3><p>Wir haben BGE-M3 Reranker v2 aus mehreren Gründen als Basismodell ausgewählt:</p>
<ol>
<li><p>Es verwendet eine Encoder-Architektur, die für die Bewertung von Token und Sätzen geeignet ist</p></li>
<li><p>Unterstützt mehrere Sprachen mit Optimierung für Englisch und Chinesisch</p></li>
<li><p>Bietet ein 8192-Token-Kontextfenster, das für längere RAG-Dokumente geeignet ist</p></li>
<li><p>Behält 0,6B Parameter bei - stark genug, ohne rechenaufwändig zu sein</p></li>
<li><p>Sorgt für ausreichendes Weltwissen im Basismodell</p></li>
<li><p>Trainiert für das Reranking, das sich eng an die Aufgaben der Relevanzbeurteilung anlehnt</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Trainingsdaten: LLM-Annotation mit Reasoning<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir die Modellarchitektur fertiggestellt hatten, bestand die nächste Herausforderung darin, einen Datensatz zu erstellen, mit dem ein zuverlässiges Modell trainiert werden konnte. Wir begannen damit, uns anzusehen, wie Open Provence dies handhabt. Deren Ansatz verwendet öffentliche QA-Datensätze und ein kleines LLM, um zu kennzeichnen, welche Sätze relevant sind. Er ist gut skalierbar und leicht zu automatisieren, was ihn zu einer guten Grundlage für uns machte.</p>
<p>Wir stießen jedoch schnell auf das gleiche Problem, das sie beschreiben: Wenn man einen LLM bittet, direkt Kennzeichnungen auf Satzebene auszugeben, sind die Ergebnisse nicht immer stabil. Einige Beschriftungen sind korrekt, andere sind fragwürdig, und es ist schwierig, die Dinge im Nachhinein zu bereinigen. Eine vollständig manuelle Beschriftung war ebenfalls keine Option - wir benötigten viel mehr Daten, als wir jemals von Hand beschriften könnten.</p>
<p>Um die Stabilität zu verbessern, ohne die Skalierbarkeit zu beeinträchtigen, haben wir eine Änderung vorgenommen: Der LLM muss für jedes Label, das er ausgibt, ein kurzes Argumentationsmuster liefern. Jedes Trainingsbeispiel enthält die Anfrage, das Dokument, die Satzspannen und eine kurze Erklärung, warum ein Satz relevant oder irrelevant ist. Durch diese kleine Anpassung wurden die Annotationen viel konsistenter und wir erhielten etwas Konkretes, auf das wir uns bei der Validierung oder Fehlerbehebung des Datensatzes beziehen konnten.</p>
<p>Die Einbeziehung der Argumentation erwies sich als überraschend wertvoll:</p>
<ul>
<li><p><strong>Die Qualität der Annotationen wurde verbessert:</strong> Das Aufschreiben der Begründung wirkt wie eine Selbstkontrolle, die zufällige oder inkonsistente Beschriftungen reduziert.</p></li>
<li><p><strong>Bessere Beobachtbarkeit:</strong> Wir können sehen, <em>warum</em> ein Satz ausgewählt wurde, anstatt das Label als Blackbox zu behandeln.</p></li>
<li><p><strong>Leichtere Fehlersuche:</strong> Wenn etwas falsch aussieht, lässt sich anhand der Begründung leicht feststellen, ob das Problem an der Eingabeaufforderung, der Domäne oder der Anmerkungslogik liegt.</p></li>
<li><p><strong>Wiederverwendbare Daten:</strong> Selbst wenn wir in Zukunft zu einem anderen Beschriftungsmodell wechseln, bleiben die Argumentationsspuren für eine erneute Beschriftung oder Prüfung nützlich.</p></li>
</ul>
<p>Der Annotations-Workflow sieht wie folgt aus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B für Annotation</h3><p>Für die Annotation haben wir uns für Qwen3 8B entschieden, weil es von Haus aus einen "Denkmodus" über die Ausgaben unterstützt, was es viel einfacher macht, konsistente Argumentationsspuren zu extrahieren. Kleinere Modelle lieferten uns keine stabilen Beschriftungen, und größere Modelle waren langsamer und unnötig teuer für diese Art von Pipeline. Qwen3 8B hat die richtige Balance zwischen Qualität, Geschwindigkeit und Kosten gefunden.</p>
<p>Wir haben alle Annotationen über einen <strong>lokalen vLLM-Dienst</strong> anstatt über Cloud-APIs ausgeführt. Dies ermöglichte uns einen hohen Durchsatz, eine vorhersehbare Leistung und viel niedrigere Kosten - im Grunde genommen tauschten wir GPU-Zeit gegen API-Token-Gebühren, was bei der Generierung von Millionen von Proben das bessere Geschäft ist.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Skalierung des Datensatzes</h3><p>Insgesamt haben wir <strong>mehr als 5 Millionen zweisprachige Trainingsmuster</strong> erstellt, die etwa gleichmäßig auf Englisch und Chinesisch verteilt sind.</p>
<ul>
<li><p><strong>Englische Quellen:</strong> MS MARCO, Natürliche Fragen, GooAQ</p></li>
<li><p><strong>Chinesische Quellen:</strong> DuReader, Chinesische Wikipedia, mmarco_chinese</p></li>
</ul>
<p>Ein Teil des Datensatzes stammt aus der Neukommentierung bestehender Daten, die von Projekten wie Open Provence verwendet werden. Der Rest wurde aus Rohkorpora generiert, indem zunächst Abfrage-Kontext-Paare erstellt und diese dann mit unserer schlussfolgernden Pipeline beschriftet wurden.</p>
<p>Alle annotierten Trainingsdaten sind auch auf HuggingFace für die Entwicklung der Community und als Trainingsreferenz verfügbar: <a href="https://huggingface.co/zilliz/datasets">Zilliz-Datensätze</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Trainingsmethode</h3><p>Sobald die Modellarchitektur und der Datensatz fertig waren, trainierten wir das Modell auf <strong>8× A100 GPUs</strong> für drei Epochen, was ungefähr <strong>9 Stunden</strong> dauerte.</p>
<p><strong>Hinweis:</strong> Das Training zielte nur auf den <strong>Pruning Head</strong> ab, der für die semantische Hervorhebung zuständig ist. Der <strong>Rerank Head</strong> wurde nicht trainiert, da die ausschließliche Konzentration auf das Pruning-Ziel bessere Ergebnisse für die Relevanzbewertung auf Satzebene lieferte.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Fallstudie aus der realen Welt<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Benchmarks sagen nur einen Teil der Geschichte aus. Hier ist ein reales Beispiel, das zeigt, wie sich das Modell in einem häufigen Grenzfall verhält: wenn der abgerufene Text sowohl die richtige Antwort als auch einen sehr verlockenden Distraktor enthält.</p>
<p><strong>Abfrage:</strong> <em>Wer hat The Killing of a Sacred Deer geschrieben?</em></p>
<p><strong>Kontext (5 Sätze):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Richtige Antwort: Satz 1 (sagt ausdrücklich "Drehbuch von Lanthimos und Efthymis Filippou")</p>
<p>Dieses Beispiel hat eine Falle: In Satz 3 wird erwähnt, dass "Euripides" das Originalstück geschrieben hat. Die Frage lautet jedoch: "Wer hat den Film The Killing of a Sacred Deer geschrieben?", und die Antwort sollte die Drehbuchautoren des Films sein, nicht der griechische Dramatiker von vor Tausenden von Jahren.</p>
<h3 id="Model-results" class="common-anchor-header">Modell-Ergebnisse</h3><table>
<thead>
<tr><th>Modell</th><th>Findet die richtige Antwort?</th><th>Vorhersage</th></tr>
</thead>
<tbody>
<tr><td>Unser Modell</td><td>✓</td><td>Ausgewählte Sätze 1 (richtig) und 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Nur Satz 3 ausgewählt, richtige Antwort verpasst</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Nur Satz 3 ausgewählt, richtige Antwort verpasst</td></tr>
</tbody>
</table>
<p><strong>Key Sentence Score Vergleich:</strong></p>
<table>
<thead>
<tr><th>Satz</th><th>Unser Modell</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Satz 1 (Filmdrehbuch, richtige Antwort)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Satz 3 (Original-Theaterstück, Distraktor)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>XProvence-Modelle:</p>
<ul>
<li><p>Fühlt sich stark zu "Euripides" und "Stück" hingezogen und gibt Satz 3 nahezu perfekte Werte (0,947 und 0,802)</p></li>
<li><p>Ignoriert die eigentliche Antwort (Satz 1) völlig und erzielt extrem niedrige Werte (0,133 und 0,081)</p></li>
<li><p>Selbst wenn der Schwellenwert von 0,5 auf 0,2 gesenkt wird, findet es immer noch nicht die richtige Antwort.</p></li>
</ul>
<p>Unser Modell:</p>
<ul>
<li><p>gibt Satz 1 korrekt die höchste Punktzahl (0,915)</p></li>
<li><p>ordnet Satz 3 immer noch eine gewisse Relevanz zu (0,719), weil er mit dem Hintergrund zusammenhängt</p></li>
<li><p>trennt die beiden eindeutig mit einer Marge von ~0,2</p></li>
</ul>
<p>Dieses Beispiel zeigt die Hauptstärke des Modells: das Verstehen der <strong>Suchabsicht</strong> und nicht nur das Abgleichen oberflächlicher Schlüsselwörter. In diesem Zusammenhang bezieht sich "Wer schrieb <em>The Killing of a Sacred Deer</em>" auf den Film, nicht auf das antike griechische Theaterstück. Unser Modell erkennt das, während andere sich von starken lexikalischen Hinweisen ablenken lassen.</p>
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
    </button></h2><p>Unser Modell <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> ist jetzt vollständig unter der MIT-Lizenz verfügbar und kann in der Produktion eingesetzt werden. Sie können es in Ihre RAG-Pipeline einfügen, es für Ihre eigene Domäne anpassen oder neue Tools darauf aufbauen. Wir freuen uns auch über Beiträge und Feedback aus der Community.</p>
<ul>
<li><p><strong>Herunterladen von HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Alle annotierten Trainingsdaten:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Semantische Hervorhebung verfügbar in Milvus und Zilliz Cloud</h3><p>Die semantische Hervorhebung ist auch direkt in <a href="https://milvus.io/">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (das vollständig verwaltete Milvus) integriert, so dass die Benutzer einen klaren Überblick darüber erhalten, <em>warum</em> jedes Dokument abgerufen wurde. Anstatt ganze Abschnitte zu durchsuchen, sehen Sie sofort die spezifischen Sätze, die sich auf Ihre Anfrage beziehen - selbst wenn der Wortlaut nicht genau übereinstimmt. Dadurch wird der Abruf leichter verständlich und die Fehlersuche wird erheblich beschleunigt. Für RAG-Pipelines wird außerdem klarer, worauf sich das nachgelagerte LLM konzentrieren soll, was beim prompten Entwurf und bei Qualitätsprüfungen hilft.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Testen Sie Semantic Highlighting in einer vollständig verwalteten Zilliz Cloud kostenlos</strong></a></p>
<p>Wir würden uns freuen zu hören, wie es bei Ihnen funktioniert - Fehlerberichte, Verbesserungsideen oder alles, was Sie bei der Integration in Ihren Workflow entdecken.</p>
<p>Wenn Sie etwas genauer besprechen möchten, können Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> beitreten oder eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> buchen. Wir freuen uns immer, mit anderen Entwicklern zu plaudern und Erfahrungen auszutauschen.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Danksagung<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Arbeit baut auf vielen großartigen Ideen und Open-Source-Beiträgen auf, und wir möchten die Projekte hervorheben, die dieses Modell möglich gemacht haben.</p>
<ul>
<li><p><strong>Provence</strong> hat einen sauberen und praktischen Rahmen für das Context Pruning mit leichtgewichtigen Encoder-Modellen eingeführt.</p></li>
<li><p><strong>Open Provence</strong> lieferte eine solide, ausgereifte Codebasis - Trainings-Pipelines, Datenverarbeitung und Modellköpfe - unter einer freizügigen Lizenz. Damit hatten wir eine gute Ausgangsbasis für Experimente.</p></li>
</ul>
<p>Auf dieser Grundlage fügten wir mehrere eigene Beiträge hinzu:</p>
<ul>
<li><p>Verwendung von <strong>LLM-Schlussfolgerungen</strong> zur Generierung von Relevanzkennzeichnungen höherer Qualität</p></li>
<li><p>Erstellung von <strong>fast 5 Millionen</strong> zweisprachigen Trainingsbeispielen, die auf reale RAG-Arbeitslasten abgestimmt sind</p></li>
<li><p>Auswahl eines Basismodells, das besser für die Bewertung der Relevanz von langen Kontexten geeignet ist<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>Training nur des <strong>Pruning Head</strong>, um das Modell für die semantische Hervorhebung zu spezialisieren</p></li>
</ul>
<p>Wir sind den Teams von Provence und Open Provence dankbar, dass sie ihre Arbeit offengelegt haben. Ihre Beiträge haben unsere Entwicklung erheblich beschleunigt und dieses Projekt möglich gemacht.</p>
