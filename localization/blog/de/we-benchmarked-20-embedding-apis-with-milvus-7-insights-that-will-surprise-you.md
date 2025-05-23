---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >-
  Wir haben 20+ Einbettungs-APIs mit Milvus verglichen: 7 Einblicke, die Sie
  überraschen werden
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  Die beliebtesten Einbettungs-APIs sind nicht die schnellsten. Die Geografie
  ist wichtiger als die Modellarchitektur. Und manchmal ist eine $20/Monat-CPU
  besser als ein $200/Monat-API-Aufruf.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>Wahrscheinlich hat jeder KI-Entwickler ein RAG-System gebaut, das perfekt funktioniert... in seiner lokalen Umgebung.</strong></p>
<p>Sie haben die Abrufgenauigkeit verbessert, Ihre Vektordatenbank optimiert, und Ihre Demo läuft wie geschmiert. Dann gehen Sie in die Produktion und plötzlich:</p>
<ul>
<li><p>Ihre lokalen Abfragen von 200 ms dauern für tatsächliche Benutzer 3 Sekunden.</p></li>
<li><p>Kollegen in verschiedenen Regionen berichten von völlig unterschiedlichen Leistungen</p></li>
<li><p>Der Einbettungsanbieter, den Sie für die "beste Genauigkeit" ausgewählt haben, wird zum größten Engpass</p></li>
</ul>
<p>Was ist passiert? Hier ist der Leistungskiller, den niemand misst: die <strong>Latenzzeit der Einbettungs-API</strong>.</p>
<p>Während MTEB-Rankings sich auf Recall-Werte und Modellgrößen konzentrieren, ignorieren sie die Metrik, die Ihre Benutzer spüren - wie lange sie warten, bis sie eine Antwort sehen. Wir haben jeden großen Einbettungsanbieter unter realen Bedingungen getestet und dabei extreme Latenzunterschiede festgestellt, die Sie Ihre gesamte Anbieterauswahlstrategie in Frage stellen lassen.</p>
<p><strong><em>Spoiler: Die beliebtesten Einbettungs-APIs sind nicht die schnellsten. Die Geografie spielt eine größere Rolle als die Modellarchitektur. Und manchmal <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>schlägt</mn></mrow></semantics></math></span></span>ein <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>20/MonatCPUbeatsa20/Monat</mi></mrow><annotation encoding="application/x-tex">CPU einen</annotation></semantics></math></span></span></em></strong><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><strong><em> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">20/MonatCPUbeatsa200/Monat</span></span></span></span>API-Aufruf.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Warum die Einbettung der API-Latenzzeit der versteckte Engpass in RAG ist<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Beim Aufbau von RAG-Systemen, E-Commerce-Suchen oder Empfehlungsmaschinen sind Einbettungsmodelle die Kernkomponente, die Text in Vektoren umwandelt und es Maschinen ermöglicht, Semantik zu verstehen und effiziente Ähnlichkeitssuchen durchzuführen. Während wir in der Regel Einbettungen für Dokumentenbibliotheken vorberechnen, erfordern Benutzeranfragen immer noch Echtzeit-Einbettungs-API-Aufrufe, um Fragen vor dem Abruf in Vektoren umzuwandeln, und diese Echtzeit-Latenz wird oft zum Leistungsengpass in der gesamten Anwendungskette.</p>
<p>Gängige Einbettungs-Benchmarks wie MTEB konzentrieren sich auf die Abrufgenauigkeit oder die Modellgröße und übersehen dabei oft die entscheidende Leistungskennzahl - die API-Latenz. Mit Hilfe der Funktion <code translate="no">TextEmbedding</code> von Milvus haben wir umfassende Praxistests bei großen Anbietern von Einbettungsdiensten in Nordamerika und Asien durchgeführt.</p>
<p>Die Einbettungslatenz manifestiert sich in zwei kritischen Phasen:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Auswirkungen auf die Abfragezeit</h3><p>Wenn ein Benutzer in einem typischen RAG-Workflow eine Frage stellt, muss das System:</p>
<ul>
<li><p>die Abfrage über einen Aufruf der Einbettungs-API in einen Vektor umwandeln</p></li>
<li><p>nach ähnlichen Vektoren in Milvus suchen</p></li>
<li><p>Ergebnisse und die ursprüngliche Frage an einen LLM weiterleiten</p></li>
<li><p>Die Antwort generieren und zurückgeben</p></li>
</ul>
<p>Viele Entwickler nehmen an, dass die Generierung der Antwort durch den LLM der langsamste Teil ist. Die Streaming-Output-Fähigkeit vieler LLMs erzeugt jedoch eine Illusion von Geschwindigkeit - Sie sehen das erste Token schnell. Wenn der Aufruf der Einbettungs-API in Wirklichkeit Hunderte von Millisekunden oder sogar Sekunden dauert, wird er zum ersten - und auffälligsten - Engpass in Ihrer Antwortkette.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Auswirkungen der Dateneingabe</h3><p>Unabhängig davon, ob ein Index von Grund auf neu erstellt oder routinemäßig aktualisiert wird, erfordert die Massenaufnahme die Vektorisierung von Tausenden oder Millionen von Textabschnitten. Wenn bei jedem Einbettungsaufruf eine hohe Latenzzeit auftritt, verlangsamt sich Ihre gesamte Datenpipeline dramatisch, wodurch sich Produktveröffentlichungen und Aktualisierungen der Wissensdatenbank verzögern.</p>
<p>In beiden Fällen ist die Latenz der Einbettungs-API eine nicht verhandelbare Leistungskennzahl für produktive RAG-Systeme.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Messung der Latenzzeit von Embedding-APIs in der realen Welt mit Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist eine quelloffene, hochleistungsfähige Vektordatenbank, die eine neue <code translate="no">TextEmbedding</code> Funktionsschnittstelle bietet. Diese Funktion integriert beliebte Einbettungsmodelle von OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI und vielen anderen Anbietern direkt in Ihre Datenpipeline und rationalisiert Ihre Vektorsuchpipeline mit einem einzigen Aufruf.</p>
<p>Mithilfe dieser neuen Funktionsschnittstelle haben wir beliebte Einbettungs-APIs von bekannten Anbietern wie OpenAI und Cohere sowie von anderen Anbietern wie AliCloud und SiliconFlow getestet und ihre End-to-End-Latenz in realistischen Einsatzszenarien gemessen.</p>
<p>Unsere umfassende Testsuite umfasste verschiedene Modellkonfigurationen:</p>
<table>
<thead>
<tr><th><strong>Anbieter</strong></th><th><strong>Modell</strong></th><th><strong>Abmessungen</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>text-einbettung-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-einbettung-3-klein</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-einbettung-3-groß</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-einbetten-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>text-einbettung-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>text-mehrsprachig-einbetten-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-groß</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>einbetten-englisch-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>einbetten-mehrsprachig-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>einbetten-englisch-leicht-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>einbetten-mehrsprachig-leicht-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-einbetten-v1</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-einbettung-v2</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-einbettung-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Siliziumfluss</td><td>BAAI/bge-groß-de-v1.5</td><td>1024</td></tr>
<tr><td>Siliziumfluss</td><td>netease-youdao/bce-einbettung-basis_v1</td><td>768</td></tr>
<tr><td>Siliziumfluss</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Siliziumfluss</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-de-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Wichtige Erkenntnisse aus unseren Benchmarking-Ergebnissen<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben führende Einbettungsmodelle unter verschiedenen Stapelgrößen, Token-Längen und Netzwerkbedingungen getestet und die mittlere Latenzzeit in allen Szenarien gemessen. Die Ergebnisse enthüllen wichtige Erkenntnisse, die die Auswahl und Optimierung von Einbettungs-APIs verändern können. Werfen wir einen Blick darauf.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Globale Netzwerkeffekte sind signifikanter als Sie denken</h3><p>Die Netzwerkumgebung ist vielleicht der kritischste Faktor, der die Leistung von Einbettungs-APIs beeinflusst. Ein und derselbe Anbieter von Einbettungs-APIs kann in verschiedenen Netzwerkumgebungen ganz unterschiedliche Leistungen erbringen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn Ihre Anwendung in Asien eingesetzt wird und auf Dienste wie OpenAI, Cohere oder VoyageAI zugreift, die in Nordamerika eingesetzt werden, erhöht sich die Netzwerklatenz erheblich. Unsere Praxistests haben gezeigt, dass die Latenzzeit für API-Aufrufe durchgängig um das <strong>3- bis 4-fache</strong> steigt!</p>
<p>Wenn Ihre Anwendung dagegen in Nordamerika eingesetzt wird und auf asiatische Dienste wie AliCloud Dashscope oder SiliconFlow zugreift, ist die Leistungsverschlechterung noch gravierender. Insbesondere SiliconFlow zeigte in regionsübergreifenden Szenarien einen Anstieg der Latenzzeit um das <strong>fast 100-fache</strong>!</p>
<p>Das bedeutet, dass Sie die Einbettungsanbieter immer auf der Grundlage Ihres Einsatzortes und der geografischen Lage der Nutzer auswählen müssen - Leistungsangaben ohne Netzwerkkontext sind bedeutungslos.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. Modell-Performance-Ranglisten offenbaren überraschende Ergebnisse</h3><p>Unsere umfassenden Latenztests ergaben klare Leistungshierarchien:</p>
<ul>
<li><p><strong>Nordamerikanische Modelle (mittlere Latenz)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Modelle in Asien (mittlere Latenz)</strong>: SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>Diese Rankings stellen die konventionellen Weisheiten über die Auswahl von Anbietern in Frage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hinweis: Aufgrund des erheblichen Einflusses der Netzwerkumgebung und der geografischen Region des Servers auf die Latenzzeit der Echtzeit-Einbettungs-API haben wir die Latenzzeiten der Modelle in Nordamerika und Asien getrennt verglichen.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. Der Einfluss der Modellgröße variiert dramatisch je nach Anbieter</h3><p>Wir haben einen allgemeinen Trend beobachtet, bei dem größere Modelle eine höhere Latenz aufweisen als Standardmodelle, die wiederum eine höhere Latenz aufweisen als kleinere/leichte Modelle. Dieses Muster war jedoch nicht allgemeingültig und offenbarte wichtige Erkenntnisse über die Backend-Architektur. Zum Beispiel:</p>
<ul>
<li><p><strong>Cohere und OpenAI</strong> zeigten minimale Leistungsunterschiede zwischen den Modellgrößen</p></li>
<li><p><strong>VoyageAI</strong> wies deutliche Leistungsunterschiede je nach Modellgröße auf.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dies zeigt, dass die API-Antwortzeit von mehreren Faktoren abhängt, die über die Modellarchitektur hinausgehen, darunter Backend-Batching-Strategien, Optimierung der Anfragebearbeitung und anbieterspezifische Infrastruktur. Die Lektion ist klar: <em>Verlassen Sie sich nicht auf die Modellgröße oder das Veröffentlichungsdatum als zuverlässige Leistungsindikatoren - testen Sie immer in Ihrer eigenen Einsatzumgebung.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. Token-Länge und Batch-Größe schaffen komplexe Kompromisse</h3><p>Abhängig von Ihrer Backend-Implementierung und insbesondere von Ihrer Stapelverarbeitungsstrategie. Die Tokenlänge hat möglicherweise nur geringe Auswirkungen auf die Latenzzeit, bis die Stapelgrößen wachsen. Unsere Tests zeigten einige klare Muster:</p>
<ul>
<li><p><strong>Die Latenz von OpenAI</strong> blieb zwischen kleinen und großen Stapeln ziemlich konstant, was auf großzügige Backend-Batching-Fähigkeiten schließen lässt.</p></li>
<li><p><strong>VoyageAI</strong> zeigte deutliche Token-Längen-Effekte, was auf eine minimale Backend-Batching-Optimierung hindeutet</p></li>
</ul>
<p>Größere Stapelgrößen erhöhen die absolute Latenz, verbessern aber den Gesamtdurchsatz. In unseren Tests erhöhte sich die Latenz bei einem Wechsel von Batch=1 zu Batch=10 um das 2×-5×, während der Gesamtdurchsatz erheblich gesteigert wurde. Dies stellt eine wichtige Optimierungsmöglichkeit für Massenverarbeitungs-Workflows dar, bei denen Sie die Latenzzeit einzelner Anfragen gegen einen erheblich verbesserten Gesamtdurchsatz des Systems eintauschen können.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Beim Wechsel von Batch=1 auf 10 erhöhte sich die Latenzzeit um das 2×-5×</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. API-Zuverlässigkeit stellt ein Produktionsrisiko dar</h3><p>Insbesondere bei OpenAI und VoyageAI wurden erhebliche Schwankungen bei den Latenzzeiten festgestellt, die zu Unvorhersehbarkeiten in Produktionssystemen führen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenzabweichung bei Batch=1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenzabweichung bei Batch=10</p>
<p>Unsere Tests konzentrierten sich zwar in erster Linie auf die Latenzzeit, doch die Abhängigkeit von externen APIs birgt inhärente Ausfallrisiken, wie z. B. Netzwerkschwankungen, Ratenbegrenzungen der Anbieter und Serviceausfälle. Ohne klare SLAs von Anbietern sollten Entwickler robuste Fehlerbehandlungsstrategien implementieren, einschließlich Wiederholungsversuchen, Zeitüberschreitungen und Unterbrechungen, um die Systemzuverlässigkeit in Produktionsumgebungen zu gewährleisten.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. Lokale Inferenz kann erstaunlich wettbewerbsfähig sein</h3><p>Unsere Tests haben auch gezeigt, dass die lokale Bereitstellung von mittelgroßen Einbettungsmodellen eine mit Cloud-APIs vergleichbare Leistung bieten kann - eine wichtige Erkenntnis für budgetbewusste oder latenzempfindliche Anwendungen.</p>
<p>Die Bereitstellung des Open-Source-Modells <code translate="no">bge-base-en-v1.5</code> über TEI (Text Embeddings Inference) auf einer bescheidenen 4c8g-CPU entsprach beispielsweise der Latenzleistung von SiliconFlow und bot damit eine erschwingliche Alternative für lokale Inferenzen. Diese Erkenntnis ist besonders für einzelne Entwickler und kleine Teams von Bedeutung, die möglicherweise nicht über GPU-Ressourcen in Unternehmensqualität verfügen, aber dennoch leistungsstarke Einbettungsfunktionen benötigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEI-Latenz</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. Der Milvus-Overhead ist vernachlässigbar</h3><p>Da wir Milvus verwendet haben, um die Latenz der Einbettungs-API zu testen, haben wir festgestellt, dass der zusätzliche Overhead, der durch die TextEmbedding-Funktion von Milvus entsteht, minimal und praktisch vernachlässigbar ist. Unsere Messungen zeigen, dass die Milvus-Operationen insgesamt nur 20-40 ms hinzufügen, während die Einbettungs-API-Aufrufe Hunderte von Millisekunden bis zu mehreren Sekunden dauern, was bedeutet, dass Milvus weniger als 5 % Overhead zur Gesamtoperationszeit hinzufügt. Der Leistungsengpass liegt in erster Linie in der Netzwerkübertragung und den Verarbeitungskapazitäten der Anbieter von Einbettungs-APIs, nicht in der Milvus-Serverschicht.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Tipps: Wie Sie die Leistung Ihrer RAG-Einbettung optimieren können<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Basierend auf unseren Benchmarks empfehlen wir die folgenden Strategien zur Optimierung der Einbettungsleistung Ihres RAG-Systems:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. Lokalisieren Sie Ihre Tests immer</h3><p>Verlassen Sie sich nicht auf generische Benchmark-Berichte (auch nicht auf diesen!). Sie sollten die Modelle immer in Ihrer tatsächlichen Einsatzumgebung testen und sich nicht nur auf veröffentlichte Benchmarks verlassen. Netzwerkbedingungen, geografische Nähe und Unterschiede in der Infrastruktur können die Leistung in der Praxis drastisch beeinflussen.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Wählen Sie Ihre Provider strategisch aus</h3><ul>
<li><p><strong>Für nordamerikanische Implementierungen</strong>: Ziehen Sie Cohere, VoyageAI, OpenAI/Azure oder GCP Vertex AI in Betracht - und führen Sie immer Ihre eigene Leistungsvalidierung durch.</p></li>
<li><p><strong>Für asiatische Implementierungen</strong>: Ziehen Sie asiatische Modellanbieter wie AliCloud Dashscope oder SiliconFlow ernsthaft in Betracht, die eine bessere regionale Leistung bieten</p></li>
<li><p><strong>Für globale Zielgruppen</strong>: Implementieren Sie das Routing über mehrere Regionen hinweg oder wählen Sie Anbieter mit global verteilter Infrastruktur, um Latenzverluste über Regionen hinweg zu minimieren.</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Hinterfragen Sie die Auswahl von Standardanbietern</h3><p>Die Einbettungsmodelle von OpenAI sind so beliebt, dass viele Unternehmen und Entwickler sie als Standardoptionen wählen. Unsere Tests haben jedoch gezeigt, dass die Latenz und Stabilität von OpenAI trotz ihrer Popularität bestenfalls durchschnittlich sind. Hinterfragen Sie Annahmen über "beste" Anbieter mit Ihren eigenen strengen Benchmarks - Popularität korreliert nicht immer mit optimaler Leistung für Ihren spezifischen Anwendungsfall.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Optimieren Sie Batch- und Chunk-Konfigurationen</h3><p>Eine Konfiguration ist nicht für alle Modelle oder Anwendungsfälle geeignet. Die optimale Batch-Größe und Chunk-Länge variiert aufgrund der unterschiedlichen Backend-Architekturen und Batching-Strategien von Anbieter zu Anbieter erheblich. Experimentieren Sie systematisch mit verschiedenen Konfigurationen, um Ihren optimalen Leistungspunkt zu finden, und berücksichtigen Sie dabei die Kompromisse zwischen Durchsatz und Latenz für Ihre spezifischen Anwendungsanforderungen.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Strategisches Caching implementieren</h3><p>Speichern Sie bei hochfrequenten Abfragen sowohl den Abfragetext als auch die generierten Einbettungen im Cache (mit Lösungen wie Redis). Nachfolgende identische Abfragen können direkt auf den Cache zugreifen und die Latenzzeit auf Millisekunden reduzieren. Dies ist eine der kostengünstigsten und wirkungsvollsten Techniken zur Optimierung der Abfragelatenz.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Lokale Inferenz-Bereitstellung in Betracht ziehen</h3><p>Wenn Sie extrem hohe Anforderungen an die Latenzzeit beim Dateneingang, die Abfragelatenz und den Datenschutz stellen oder wenn die Kosten für API-Aufrufe unerschwinglich sind, sollten Sie die lokale Bereitstellung von Einbettungsmodellen für die Inferenz in Betracht ziehen. Standard-API-Pläne sind oft mit QPS-Beschränkungen, instabilen Latenzzeiten und fehlenden SLA-Garantien verbunden - Einschränkungen, die für Produktionsumgebungen problematisch sein können.</p>
<p>Für viele einzelne Entwickler oder kleine Teams ist das Fehlen von GPUs in Unternehmensqualität ein Hindernis für die lokale Bereitstellung von Hochleistungs-Einbettungsmodellen. Dies bedeutet jedoch nicht, dass die lokale Inferenz völlig aufgegeben werden muss. Mit leistungsstarken Inferenz-Engines wie <a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face's text-embeddings-inference</a> können selbst kleine bis mittelgroße Einbettungsmodelle auf einer CPU eine anständige Leistung erzielen, die API-Aufrufe mit hoher Latenz übertreffen kann, insbesondere bei der Offline-Erzeugung von Einbettungen in großem Maßstab.</p>
<p>Dieser Ansatz erfordert eine sorgfältige Abwägung der Kompromisse zwischen Kosten, Leistung und Wartungskomplexität.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Wie Milvus Ihren Einbettungs-Workflow vereinfacht<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie bereits erwähnt, ist Milvus nicht nur eine leistungsstarke Vektordatenbank, sondern bietet auch eine bequeme Schnittstelle für Einbettungsfunktionen, die sich nahtlos mit beliebten Einbettungsmodellen verschiedener Anbieter wie OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI und anderen aus der ganzen Welt in Ihre Vektorsuchpipeline integrieren lässt.</p>
<p>Milvus geht über die Speicherung und den Abruf von Vektoren hinaus und bietet Funktionen, die die Integration von Einbettungsmodellen vereinfachen:</p>
<ul>
<li><p><strong>Effizientes Vektor-Management</strong>: Als Hochleistungsdatenbank, die für umfangreiche Vektorsammlungen entwickelt wurde, bietet Milvus eine zuverlässige Speicherung, flexible Indizierungsoptionen (HNSW, IVF, RaBitQ, DiskANN und mehr) sowie schnelle und präzise Abrufmöglichkeiten.</p></li>
<li><p><strong>Rationalisierter Anbieterwechsel</strong>: Milvus bietet eine <code translate="no">TextEmbedding</code> Funktionsschnittstelle, die es Ihnen ermöglicht, die Funktion mit Ihren API-Schlüsseln zu konfigurieren, Anbieter oder Modelle sofort zu wechseln und die Leistung in der Praxis ohne komplexe SDK-Integration zu messen.</p></li>
<li><p><strong>End-to-End-Datenpipelines</strong>: Rufen Sie <code translate="no">insert()</code> mit Rohtext auf, und Milvus bettet automatisch Vektoren ein und speichert sie in einem einzigen Vorgang, wodurch Ihr Datenpipeline-Code erheblich vereinfacht wird.</p></li>
<li><p><strong>Text-zu-Ergebnissen in einem Aufruf</strong>: Rufen Sie <code translate="no">search()</code> mit Textabfragen auf, und Milvus übernimmt die Einbettung, Suche und Rückgabe der Ergebnisse - alles in einem einzigen API-Aufruf.</p></li>
<li><p><strong>Anbieter-gnostische Integration</strong>: Milvus abstrahiert die Details der Provider-Implementierung; Sie müssen nur einmal Ihre Funktion und Ihren API-Schlüssel konfigurieren, und schon sind Sie startklar.</p></li>
<li><p><strong>Kompatibilität mit dem Open-Source-Ökosystem</strong>: Unabhängig davon, ob Sie Einbettungen über unsere integrierte <code translate="no">TextEmbedding</code> Funktion, lokale Inferenz oder eine andere Methode erzeugen, bietet Milvus einheitliche Speicher- und Abrufmöglichkeiten.</p></li>
</ul>
<p>Dies schafft eine optimierte "Data-In, Insight-Out"-Erfahrung, bei der Milvus die Vektorgenerierung intern abwickelt, wodurch Ihr Anwendungscode einfacher und wartbarer wird.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Schlussfolgerung: Die Leistungswahrheit, die Ihr RAG-System braucht<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>Der stille Killer der RAG-Leistung liegt nicht dort, wo die meisten Entwickler suchen. Während Teams ihre Ressourcen in Prompt-Engineering und LLM-Optimierung stecken, sabotiert die eingebettete API-Latenz im Stillen die Benutzererfahrung mit Verzögerungen, die 100-mal schlimmer sein können als erwartet. Unsere umfassenden Benchmarks zeigen die harte Realität auf: Beliebt bedeutet nicht performant, in vielen Fällen ist der Standort wichtiger als die Wahl des Algorithmus, und lokale Inferenzen schlagen manchmal teure Cloud-APIs.</p>
<p>Diese Ergebnisse weisen auf einen entscheidenden blinden Fleck in der RAG-Optimierung hin. Regionsübergreifende Latenzzeiten, unerwartete Leistungsrankings von Anbietern und die überraschende Konkurrenzfähigkeit lokaler Inferenzen sind keine Einzelfälle, sondern Produktionsrealitäten, die echte Anwendungen betreffen. Das Verständnis und die Messung der Leistung von Einbettungs-APIs ist für die Bereitstellung von reaktionsschnellen Benutzererlebnissen unerlässlich.</p>
<p>Die Wahl des Einbettungsanbieters ist ein wichtiger Teil des RAG-Leistungspuzzles. Durch Testen in Ihrer tatsächlichen Bereitstellungsumgebung, die Auswahl geografisch geeigneter Anbieter und die Berücksichtigung von Alternativen wie lokaler Inferenz können Sie eine wichtige Quelle für Verzögerungen bei der Benutzererfahrung beseitigen und wirklich reaktionsschnelle KI-Anwendungen erstellen.</p>
<p>Weitere Details zur Durchführung dieses Benchmarkings finden Sie in <a href="https://github.com/zhuwenxing/text-embedding-bench">diesem Notebook</a>.</p>
