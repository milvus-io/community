---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 'Von Word2Vec zu LLM2Vec: Wie man das richtige Einbettungsmodell für RAG wählt'
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  In diesem Blog erfahren Sie, wie Sie Einbettungen in der Praxis bewerten
  können, damit Sie die beste Lösung für Ihr RAG-System auswählen können.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>Große Sprachmodelle sind leistungsstark, aber sie haben eine bekannte Schwäche: Halluzinationen. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> ist eine der effektivsten Möglichkeiten, dieses Problem zu lösen. Anstatt sich ausschließlich auf das Gedächtnis des Modells zu verlassen, ruft RAG relevantes Wissen aus einer externen Quelle ab und integriert es in die Eingabeaufforderung, um sicherzustellen, dass die Antworten auf realen Daten beruhen.</p>
<p>Ein RAG-System besteht in der Regel aus drei Hauptkomponenten: dem LLM selbst, einer <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a> wie <a href="https://milvus.io/">Milvus</a> zum Speichern und Suchen von Informationen und einem Einbettungsmodell. Das Einbettungsmodell wandelt die menschliche Sprache in maschinenlesbare Vektoren um. Es ist sozusagen der Übersetzer zwischen der natürlichen Sprache und der Datenbank. Die Qualität dieses Übersetzers bestimmt die Relevanz des abgerufenen Kontexts. Wenn es richtig gemacht wird, sehen die Benutzer genaue, hilfreiche Antworten. Wenn es falsch gemacht wird, produziert selbst die beste Infrastruktur Rauschen, Fehler und vergeudete Rechenleistung.</p>
<p>Deshalb ist es so wichtig, die Einbettungsmodelle zu verstehen. Die Auswahl ist groß und reicht von frühen Methoden wie Word2Vec bis hin zu modernen LLM-basierten Modellen wie der Text-Einbettungsfamilie von OpenAI. Jedes hat seine eigenen Vorteile und Stärken. Dieser Leitfaden wird Ihnen zeigen, wie Sie Einbettungen in der Praxis bewerten können, damit Sie die beste Lösung für Ihr RAG-System auswählen können.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">Was sind Einbettungen und warum sind sie wichtig?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Auf der einfachsten Ebene verwandeln Einbettungen menschliche Sprache in Zahlen, die von Maschinen verstanden werden können. Jedes Wort, jeder Satz und jedes Dokument wird in einem hochdimensionalen Vektorraum abgebildet, wobei der Abstand zwischen den Vektoren die Beziehungen zwischen ihnen erfasst. Texte mit ähnlichen Bedeutungen neigen dazu, sich zu gruppieren, während nicht verwandte Inhalte weiter auseinanderdriften. Dies macht die semantische Suche möglich - die Suche nach der Bedeutung und nicht nur nach den passenden Schlüsselwörtern.</p>
<p>Nicht alle Einbettungsmodelle funktionieren auf die gleiche Weise. Sie lassen sich im Allgemeinen in drei Kategorien einteilen, die jeweils ihre Stärken und Nachteile haben:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Dünne Vektoren</strong></a> (wie BM25) konzentrieren sich auf die Häufigkeit der Schlüsselwörter und die Länge der Dokumente. Sie eignen sich hervorragend für eindeutige Übereinstimmungen, sind aber blind für Synonyme und Kontext - "AI" und "künstliche Intelligenz" würden nicht zusammenpassen.</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Dichte Vektoren</strong></a> (wie die von BERT erzeugten) erfassen eine tiefere Semantik. Sie können erkennen, dass "Apple bringt neues Telefon heraus" mit "iPhone-Produktvorstellung" verwandt ist, auch ohne gemeinsame Schlüsselwörter. Der Nachteil ist der höhere Rechenaufwand und die geringere Interpretierbarkeit.</p></li>
<li><p><strong>Hybride Modelle</strong> (wie BGE-M3) vereinen beides. Sie können gleichzeitig spärliche, dichte oder multivektorielle Darstellungen erzeugen - so bleibt die Präzision der Schlüsselwortsuche erhalten, während gleichzeitig semantische Nuancen erfasst werden.</p></li>
</ul>
<p>In der Praxis hängt die Wahl von Ihrem Anwendungsfall ab: spärliche Vektoren für Geschwindigkeit und Transparenz, dichte Vektoren für eine reichere Bedeutung und eine Mischform, wenn Sie das Beste aus beiden Welten wollen.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Acht Schlüsselfaktoren für die Bewertung von Einbettungsmodellen<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 Kontextfenster</strong></h3><p>Das <a href="https://zilliz.com/glossary/context-window"><strong>Kontextfenster</strong></a> bestimmt die Menge an Text, die ein Modell auf einmal verarbeiten kann. Da ein Token etwa 0,75 Wörtern entspricht, schränkt diese Zahl direkt ein, wie lang eine Passage ist, die das Modell beim Erstellen von Einbettungen "sehen" kann. Ein großes Fenster ermöglicht es dem Modell, die gesamte Bedeutung längerer Dokumente zu erfassen; ein kleines Fenster zwingt Sie dazu, den Text in kleinere Stücke zu zerhacken, wodurch der Verlust von bedeutungsvollem Kontext droht.</p>
<p>OpenAIs <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>text-embedding-ada-002</em></a> unterstützt zum Beispiel bis zu 8.192 Token - genug, um eine ganze Forschungsarbeit einschließlich Zusammenfassung, Methoden und Schlussfolgerung zu erfassen. Im Gegensatz dazu erfordern Modelle mit nur 512-Token-Fenstern (wie <em>m3e-base</em>) häufiges Trunkieren, was zum Verlust wichtiger Details führen kann.</p>
<p>Fazit: Wenn Ihr Anwendungsfall lange Dokumente umfasst, wie z. B. juristische oder akademische Abhandlungen, wählen Sie ein Modell mit einem 8K+-Token-Fenster. Für kürzere Texte, wie z. B. Chats im Kundensupport, kann ein 2K-Token-Fenster ausreichend sein.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">#<strong>Nr. 2</strong> Tokenisierungseinheit</h3><p>Bevor die Einbettungen generiert werden, muss der Text in kleinere Teile, sogenannte <strong>Token</strong>, zerlegt werden. Die Art und Weise dieser Tokenisierung beeinflusst, wie gut das Modell mit seltenen Wörtern, Fachbegriffen und spezialisierten Domänen umgehen kann.</p>
<ul>
<li><p><strong>Teilwort-Tokenisierung (BPE):</strong> Zerlegt Wörter in kleinere Teile (z. B. "unglücklich" → "un" + "glücklich"). Dies ist die Standardeinstellung in modernen LLMs wie GPT und LLaMA und funktioniert gut bei Wörtern außerhalb des Vokabulars.</p></li>
<li><p><strong>WortStück:</strong> Eine Verfeinerung von BPE, die von BERT verwendet wird, um einen besseren Ausgleich zwischen Wortschatzabdeckung und Effizienz zu schaffen.</p></li>
<li><p><strong>Tokenisierung auf Wortebene:</strong> Teilt nur nach ganzen Wörtern auf. Sie ist einfach, hat aber Probleme mit seltener oder komplexer Terminologie, weshalb sie für technische Bereiche ungeeignet ist.</p></li>
</ul>
<p>Für spezialisierte Bereiche wie Medizin oder Recht sind teilwortbasierte Modelle in der Regel am besten geeignet - sie können Begriffe wie <em>Myokardinfarkt</em> oder <em>Forderungsübergang</em> korrekt verarbeiten. Einige moderne Modelle, wie z. B. <strong>NV-Embed</strong>, gehen noch weiter, indem sie Erweiterungen wie latente Aufmerksamkeitsebenen hinzufügen, die die Erfassung von komplexem, domänenspezifischem Vokabular durch Tokenisierung verbessern.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 Dimensionalität</h3><p>Die<a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>Dimensionalität des Vektors</strong></a> bezieht sich auf die Länge des Einbettungsvektors, der bestimmt, wie viele semantische Details ein Modell erfassen kann. Höhere Dimensionen (z. B. 1.536 oder mehr) ermöglichen eine feinere Unterscheidung zwischen Konzepten, haben aber den Nachteil, dass sie mehr Speicherplatz, langsamere Abfragen und höhere Rechenanforderungen mit sich bringen. Niedrigere Dimensionen (z. B. 768) sind schneller und billiger, bergen aber die Gefahr, dass subtile Bedeutungen verloren gehen.</p>
<p>Der Schlüssel ist das Gleichgewicht. Für die meisten allgemeinen Anwendungen bieten die Dimensionen 768-1.536 die richtige Mischung aus Effizienz und Genauigkeit. Für Aufgaben, die eine hohe Präzision erfordern - wie akademische oder wissenschaftliche Recherchen - kann es sich lohnen, über 2.000 Dimensionen hinauszugehen. Andererseits können ressourcenbeschränkte Systeme (z. B. Edge-Anwendungen) 512 Dimensionen effektiv nutzen, sofern die Abrufqualität validiert ist. In einigen leichtgewichtigen Empfehlungs- oder Personalisierungssystemen können sogar kleinere Dimensionen ausreichend sein.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 Vokabulargröße</h3><p>Die <strong>Größe</strong> des Vokabulars eines Modells bezieht sich auf die Anzahl der eindeutigen Token, die der Tokenizer erkennen kann. Dies wirkt sich direkt auf die Fähigkeit aus, mit verschiedenen Sprachen und domänenspezifischer Terminologie umzugehen. Wenn ein Wort oder ein Zeichen nicht im Vokabular enthalten ist, wird es als <code translate="no">[UNK]</code> markiert, was zu Bedeutungsverlusten führen kann.</p>
<p>Die Anforderungen variieren je nach Anwendungsfall. Mehrsprachige Szenarien benötigen im Allgemeinen größere Vokabulare - in der Größenordnung von 50k+ Token, wie im Fall von <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. Für domänenspezifische Anwendungen ist die Abdeckung von Fachbegriffen am wichtigsten. Ein juristisches Modell sollte beispielsweise Begriffe wie <em>&quot;Verjährung&quot;</em> oder <em>&quot;gutgläubiger Erwerb</em>&quot; von Haus aus unterstützen, während ein chinesisches Modell Tausende von Schriftzeichen und einzigartige Interpunktion berücksichtigen muss. Ohne eine ausreichende Abdeckung des Vokabulars bricht die Genauigkeit der Einbettung schnell zusammen.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># Nr. 5 Trainingsdaten</h3><p>Die <strong>Trainingsdaten</strong> definieren die Grenzen dessen, was ein Einbettungsmodell "weiß". Modelle, die auf breit gefächerten, allgemeinen Daten trainiert wurden - wie <em>text-embedding-ada-002</em>, das eine Mischung aus Webseiten, Büchern und Wikipedia verwendet - zeigen in der Regel gute Leistungen in verschiedenen Bereichen. Wenn es jedoch auf Präzision in speziellen Bereichen ankommt, sind fachlich geschulte Modelle oft erfolgreicher. <em>LegalBERT</em> und <em>BioBERT</em> übertreffen beispielsweise allgemeine Modelle für juristische und biomedizinische Texte, obwohl sie etwas an Generalisierungsfähigkeit verlieren.</p>
<p>Als Faustregel gilt:</p>
<ul>
<li><p><strong>Allgemeine Szenarien</strong> → verwenden Sie Modelle, die auf breiten Datensätzen trainiert wurden, aber stellen Sie sicher, dass sie Ihre Zielsprache(n) abdecken. Chinesische Anwendungen benötigen beispielsweise Modelle, die auf umfangreichen chinesischen Korpora trainiert wurden.</p></li>
<li><p><strong>Vertikale Bereiche</strong> → wählen Sie bereichsspezifische Modelle für beste Genauigkeit.</p></li>
<li><p><strong>Das Beste aus beiden Welten</strong> → neuere Modelle wie <strong>NV-Embed</strong>, die in zwei Stufen sowohl mit allgemeinen als auch mit domänenspezifischen Daten trainiert werden, zeigen vielversprechende Gewinne bei der Generalisierung <em>und der</em> Domänenpräzision.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 Kosten</h3><p>Bei den Kosten geht es nicht nur um die API-Preise, sondern auch um die <strong>wirtschaftlichen</strong> und <strong>rechnerischen Kosten</strong>. Gehostete API-Modelle, wie die von OpenAI, sind nutzungsbasiert: Sie zahlen pro Aufruf, müssen sich aber nicht um die Infrastruktur kümmern. Das macht sie perfekt für Rapid Prototyping, Pilotprojekte oder kleine bis mittlere Arbeitslasten.</p>
<p>Open-Source-Optionen wie <em>BGE</em> oder <em>Sentence-BERT</em> können kostenlos genutzt werden, erfordern aber eine selbstverwaltete Infrastruktur, in der Regel GPU- oder TPU-Cluster. Sie eignen sich besser für die Produktion in großem Maßstab, wo langfristige Einsparungen und Flexibilität die einmaligen Einrichtungs- und Wartungskosten ausgleichen.</p>
<p>Die praktische Konsequenz: <strong>API-Modelle sind ideal für schnelle Iterationen</strong>, während <strong>Open-Source-Modelle in der Großproduktion oft die Nase vorn haben</strong>, wenn man die Gesamtbetriebskosten (TCO) berücksichtigt. Die Wahl des richtigen Weges hängt davon ab, ob Sie eine schnelle Markteinführung oder langfristige Kontrolle benötigen.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># Nr. 7 MTEB-Ergebnis</h3><p>Der <a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a> ist der am häufigsten verwendete Standard zum Vergleich von Einbettungsmodellen. Er bewertet die Leistung bei verschiedenen Aufgaben, darunter semantische Suche, Klassifizierung, Clustering und andere. Eine höhere Punktzahl bedeutet im Allgemeinen, dass das Modell eine bessere Verallgemeinerbarkeit für verschiedene Aufgabentypen aufweist.</p>
<p>MTEB ist jedoch kein Allheilmittel. Ein Modell, das insgesamt eine hohe Punktzahl erreicht, kann in Ihrem speziellen Anwendungsfall dennoch unterdurchschnittlich abschneiden. So kann beispielsweise ein Modell, das hauptsächlich auf Englisch trainiert wurde, bei MTEB-Benchmarks gut abschneiden, aber bei medizinischen Fachtexten oder nicht-englischen Daten Schwierigkeiten haben. Der sichere Ansatz besteht darin, MTEB als Ausgangspunkt zu verwenden und es dann mit <strong>Ihren eigenen Datensätzen</strong> zu validieren, bevor Sie es einsetzen.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 Domänenspezifität</h3><p>Einige Modelle wurden speziell für bestimmte Szenarien entwickelt, und sie glänzen dort, wo allgemeine Modelle versagen:</p>
<ul>
<li><p><strong>Legal:</strong> <em>LegalBERT</em> kann feinkörnige juristische Begriffe unterscheiden, z. B. <em>Verteidigung</em> versus <em>Gerichtsbarkeit</em>.</p></li>
<li><p><strong>Biomedizinisch:</strong> <em>BioBERT</em> kann technische Ausdrücke wie <em>mRNA</em> oder <em>gezielte Therapie</em> genau behandeln.</p></li>
<li><p><strong>Mehrsprachig:</strong> <em>BGE-M3</em> unterstützt mehr als 100 Sprachen und eignet sich daher gut für globale Anwendungen, bei denen Englisch, Chinesisch und andere Sprachen überbrückt werden müssen.</p></li>
<li><p><strong>Code-Aufruf:</strong> <em>Qwen3-Embedding</em> erreicht Spitzenwerte (81,0+) bei <em>MTEB-Code</em>, optimiert für programmierbezogene Abfragen.</p></li>
</ul>
<p>Wenn Ihr Anwendungsfall in einen dieser Bereiche fällt, können domänenoptimierte Modelle die Abfragegenauigkeit erheblich verbessern. Für umfassendere Anwendungen sollten Sie jedoch bei Allzweckmodellen bleiben, es sei denn, Ihre Tests zeigen etwas anderes.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Zusätzliche Perspektiven für die Evaluierung von Einbettungen<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Über die acht Kernfaktoren hinaus gibt es noch einige andere Aspekte, die für eine tiefergehende Bewertung in Betracht gezogen werden sollten:</p>
<ul>
<li><p><strong>Mehrsprachige Ausrichtung</strong>: Bei mehrsprachigen Modellen reicht es nicht aus, einfach nur viele Sprachen zu unterstützen. Der eigentliche Test ist, ob die Vektorräume aufeinander abgestimmt sind. Mit anderen Worten: Liegen semantisch identische Wörter - z. B. "cat" auf Englisch und "gato" auf Spanisch - im Vektorraum nahe beieinander? Eine starke Ausrichtung gewährleistet einen konsistenten sprachübergreifenden Abruf.</p></li>
<li><p><strong>Gegensätzliche Tests</strong>: Ein gutes Einbettungsmodell sollte bei kleinen Änderungen der Eingabe stabil sein. Indem Sie nahezu identische Sätze eingeben (z. B. "Die Katze saß auf der Matte" vs. "Die Katze saß auf einer Matte"), können Sie testen, ob sich die resultierenden Vektoren vernünftig bewegen oder stark schwanken. Große Schwankungen deuten oft auf eine schwache Robustheit hin.</p></li>
<li><p><strong>Lokale semantische Kohärenz</strong> bezieht sich auf das Phänomen, dass getestet wird, ob sich semantisch ähnliche Wörter in lokalen Umgebungen eng aneinanderreihen. Bei einem Wort wie "Bank" beispielsweise sollte das Modell verwandte Begriffe (wie "Flussufer" und "Finanzinstitut") angemessen gruppieren, während nicht verwandte Begriffe auf Abstand gehalten werden. Wenn man misst, wie oft sich "aufdringliche" oder irrelevante Wörter in diese Nachbarschaften einschleichen, kann man die Qualität des Modells vergleichen.</p></li>
</ul>
<p>Diese Perspektiven sind für die tägliche Arbeit nicht immer erforderlich, aber sie sind hilfreich für Stresstests von Einbettungen in Produktionssystemen, bei denen es auf mehrsprachige, hochpräzise oder kontradiktorische Stabilität ankommt.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Übliche Einbettungsmodelle: Eine kurze Geschichte<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Geschichte der Einbettungsmodelle ist eigentlich die Geschichte der Maschinen, die im Laufe der Zeit gelernt haben, Sprache immer besser zu verstehen. Jede Generation hat die Grenzen der vorherigen überwunden - von statischen Wortrepräsentationen bis hin zu den heutigen Large Language Model (LLM)-Einbettungen, die einen differenzierten Kontext erfassen können.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: Der Startpunkt (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Googles Word2Vec</a> war der erste Durchbruch, der Einbettungen auf breiter Ebene praktikabel machte. Es basierte auf der <em>Verteilungshypothese</em> in der Linguistik, d. h. auf der Idee, dass Wörter, die in ähnlichen Kontexten vorkommen, oft die gleiche Bedeutung haben. Durch die Analyse riesiger Textmengen konnte Word2Vec Wörter in einem Vektorraum abbilden, in dem verwandte Begriffe dicht beieinander liegen. So lagen zum Beispiel "Puma" und "Leopard" aufgrund ihrer gemeinsamen Lebensräume und Jagdgewohnheiten nahe beieinander.</p>
<p>Word2Vec gibt es in zwei Varianten:</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words):</strong> sagt ein fehlendes Wort aus dem umgebenden Kontext voraus.</p></li>
<li><p><strong>Skip-Gram:</strong> macht die umgekehrte Vorhersage von umgebenden Wörtern aus einem Zielwort.</p></li>
</ul>
<p>Dieser einfache, aber leistungsfähige Ansatz ermöglichte elegante Analogien wie:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Für seine Zeit war Word2Vec revolutionär. Aber es hatte zwei wesentliche Einschränkungen. Erstens war es <strong>statisch</strong>: Jedes Wort hatte nur einen Vektor, so dass "Bank" dasselbe bedeutete, egal ob es in der Nähe von "Geld" oder "Fluss" stand. Zweitens funktionierte es nur auf <strong>Wortebene</strong>, so dass Sätze und Dokumente nicht erfasst wurden.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT: Die Transformer-Revolution (2018)</h3><p>Wenn Word2Vec uns die erste Bedeutungskarte lieferte, so hat <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong></a> sie mit weitaus mehr Details neu gezeichnet. BERT wurde 2018 von Google veröffentlicht und läutete die Ära des <em>tiefen semantischen Verständnisses</em> ein, indem die Transformer-Architektur in Einbettungen eingeführt wurde. Im Gegensatz zu früheren LSTMs können Transformers alle Wörter in einer Sequenz gleichzeitig und in beide Richtungen untersuchen, was einen weitaus umfassenderen Kontext ermöglicht.</p>
<p>Die Magie von BERT beruht auf zwei cleveren Pre-Training-Aufgaben:</p>
<ul>
<li><p><strong>Maskierte Sprachmodellierung (MLM):</strong> Dabei werden zufällig Wörter in einem Satz versteckt und das Modell gezwungen, sie vorherzusagen, wobei es lernt, aus dem Kontext auf die Bedeutung zu schließen.</p></li>
<li><p><strong>Next Sentence Prediction (NSP):</strong> Das Modell wird darauf trainiert, zu entscheiden, ob zwei Sätze aufeinander folgen, und lernt so satzübergreifende Beziehungen.</p></li>
</ul>
<p>Unter der Haube kombinierten die Eingabevektoren von BERT drei Elemente: Token-Einbettungen (das Wort selbst), Segment-Einbettungen (zu welchem Satz es gehört) und Positions-Einbettungen (wo es in der Sequenz steht). Zusammen ermöglichten sie es BERT, komplexe semantische Beziehungen sowohl auf <strong>Satz-</strong> als auch auf <strong>Dokumentebene</strong> zu erfassen. Dieser Sprung machte BERT zu einem hochmodernen Verfahren für Aufgaben wie die Beantwortung von Fragen und die semantische Suche.</p>
<p>Natürlich war BERT nicht perfekt. Die frühen Versionen waren auf ein <strong>Fenster von 512 Token</strong> beschränkt, was bedeutete, dass lange Dokumente zerhackt werden mussten und manchmal an Bedeutung verloren. Den dichten Vektoren mangelte es auch an Interpretierbarkeit - man konnte sehen, dass zwei Texte übereinstimmen, aber nicht immer erklären, warum. Spätere Varianten, wie z. B. <strong>RoBERTa</strong>, ließen die NSP-Aufgabe fallen, nachdem die Forschung gezeigt hatte, dass sie wenig Nutzen brachte, behielten aber das leistungsstarke MLM-Training bei.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: Verschmelzung von Sparse und Dense (2023)</h3><p>Im Jahr 2023 war das Feld so weit ausgereift, dass man erkannte, dass keine einzelne Einbettungsmethode alles erreichen konnte. Es entstand <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), ein hybrides Modell, das speziell für Retrieval-Aufgaben entwickelt wurde. Seine wichtigste Neuerung besteht darin, dass es nicht nur einen Vektortyp erzeugt, sondern gleichzeitig dichte Vektoren, spärliche Vektoren und Multivektoren, wobei es deren Stärken kombiniert.</p>
<ul>
<li><p><strong>Dichte Vektoren</strong> erfassen tiefe Semantik und behandeln Synonyme und Umschreibungen (z.B. "iPhone launch", ≈ "Apple releases new phone").</p></li>
<li><p><strong>Spärliche Vektoren</strong> weisen explizite Termgewichte zu. Selbst wenn ein Schlüsselwort nicht vorkommt, kann das Modell auf die Relevanz schließen, z. B. indem es "iPhone neues Produkt" mit "Apple Inc." und "Smartphone" verknüpft.</p></li>
<li><p><strong>Multi-Vektoren</strong> verfeinern die dichten Einbettungen weiter, indem sie jedem Token seinen eigenen Interaktionswert zuweisen, was für ein feinkörniges Retrieval hilfreich ist.</p></li>
</ul>
<p>Die Trainingspipeline von BGE-M3 spiegelt diese Raffinesse wider:</p>
<ol>
<li><p><strong>Pre-Training</strong> auf massiven unbeschrifteten Daten mit <em>RetroMAE</em> (maskierter Encoder + Rekonstruktionsdecoder) zum Aufbau eines allgemeinen semantischen Verständnisses.</p></li>
<li><p><strong>Allgemeine Feinabstimmung</strong> mit kontrastivem Lernen auf 100 Mio. Textpaaren, um die Retrievalleistung zu verbessern.</p></li>
<li><p><strong>Aufgaben-Feinabstimmung</strong> mit Instruktionsabstimmung und komplexem negativem Sampling zur szenariospezifischen Optimierung.</p></li>
</ol>
<p>Die Ergebnisse sind beeindruckend: BGE-M3 verarbeitet mehrere Granularitäten (von der Wort- bis zur Dokumentenebene), liefert eine starke mehrsprachige Leistung - insbesondere in Chinesisch - und bringt Genauigkeit und Effizienz besser in Einklang als die meisten seiner Konkurrenten. In der Praxis stellt es einen großen Fortschritt bei der Entwicklung von Einbettungsmodellen dar, die sowohl leistungsstark als auch praktisch für die Suche in großem Maßstab sind.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">LLMs als Einbettungsmodelle (2023-Gegenwart)</h3><p>Jahrelang war die vorherrschende Meinung, dass nur decoderbasierte große Sprachmodelle (LLMs) wie GPT nicht für Einbettungen geeignet sind. Man ging davon aus, dass ihre kausale Aufmerksamkeit - die nur vorherige Token betrachtet - ein tiefes semantisches Verständnis einschränkt. Jüngste Forschungen haben diese Annahme jedoch widerlegt. Mit den richtigen Anpassungen können LLMs Einbettungen erzeugen, die mit speziell entwickelten Modellen konkurrieren und diese manchmal sogar übertreffen. Zwei bemerkenswerte Beispiele sind LLM2Vec und NV-Embed.</p>
<p><strong>LLM2Vec</strong> passt reine Decoder-LLMs mit drei wesentlichen Änderungen an:</p>
<ul>
<li><p><strong>Bidirektionale Aufmerksamkeitskonvertierung</strong>: Ersetzen von kausalen Masken, so dass jedes Token die gesamte Sequenz beachten kann.</p></li>
<li><p><strong>Maskierte Vorhersage des nächsten Tokens (MNTP):</strong> ein neues Trainingsziel, das das bidirektionale Verständnis fördert.</p></li>
<li><p><strong>Unüberwachtes kontrastives Lernen:</strong> Inspiriert von SimCSE werden semantisch ähnliche Sätze im Vektorraum näher zusammengeführt.</p></li>
</ul>
<p><strong>NV-Embed</strong> hingegen verfolgt einen schlankeren Ansatz:</p>
<ul>
<li><p><strong>Latente Aufmerksamkeitsschichten:</strong> Hinzufügen von trainierbaren "latenten Arrays" zur Verbesserung des Sequenz-Poolings.</p></li>
<li><p><strong>Direktes bidirektionales Training:</strong> Entfernen Sie einfach kausale Masken und nehmen Sie die Feinabstimmung mit kontrastivem Lernen vor.</p></li>
<li><p><strong>Mean-Pooling-Optimierung:</strong> Verwendung gewichteter Mittelwerte über Token hinweg zur Vermeidung von "Last-Token-Bias".</p></li>
</ul>
<p>Das Ergebnis ist, dass moderne LLM-basierte Einbettungen <strong>tiefes semantisches Verständnis</strong> mit <strong>Skalierbarkeit</strong> kombinieren. Sie können mit <strong>sehr langen Kontextfenstern (8K-32K Token)</strong> umgehen, was sie besonders stark für dokumentenlastige Aufgaben in Forschung, Recht oder Unternehmenssuche macht. Und da sie dasselbe LLM-Backbone verwenden, können sie manchmal auch in eingeschränkteren Umgebungen hochwertige Einbettungen liefern.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Schlussfolgerung: Die Theorie in die Praxis umsetzen<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn es um die Auswahl eines Einbettungsmodells geht, kommt man mit der Theorie nicht weit. Der eigentliche Test ist, wie gut es in <em>Ihrem</em> System mit <em>Ihren</em> Daten funktioniert. Ein paar praktische Schritte können den Unterschied zwischen einem Modell, das auf dem Papier gut aussieht, und einem, das in der Produktion tatsächlich funktioniert, ausmachen:</p>
<ul>
<li><p><strong>Testen Sie mit MTEB-Teilmengen.</strong> Verwenden Sie Benchmarks, insbesondere für Retrieval-Aufgaben, um eine erste Auswahlliste von Kandidaten zu erstellen.</p></li>
<li><p><strong>Testen Sie mit echten Geschäftsdaten.</strong> Erstellen Sie Evaluierungssets aus Ihren eigenen Dokumenten, um Recall, Precision und Latency unter realen Bedingungen zu messen.</p></li>
<li><p><strong>Prüfen Sie die Datenbankkompatibilität.</strong> Dünne Vektoren erfordern eine Unterstützung für invertierte Indizes, während hochdimensionale, dichte Vektoren mehr Speicherplatz und Berechnungen erfordern. Vergewissern Sie sich, dass Ihre Vektordatenbank für Ihre Wahl geeignet ist.</p></li>
<li><p><strong>Kluger Umgang mit langen Dokumenten.</strong> Nutzen Sie Segmentierungsstrategien, wie z. B. gleitende Fenster, um effizient zu arbeiten, und kombinieren Sie sie mit großen Kontextfenstermodellen, um die Bedeutung zu erhalten.</p></li>
</ul>
<p>Von den einfachen statischen Vektoren von Word2Vec bis hin zu LLM-gestützten Einbettungen mit 32K Kontexten haben wir große Fortschritte beim Sprachverständnis von Maschinen gesehen. Aber hier ist die Lektion, die jeder Entwickler irgendwann lernt: Das Modell <em>mit der höchsten Punktzahl</em> ist nicht immer das <em>beste</em> Modell für Ihren Anwendungsfall.</p>
<p>Letztendlich interessieren sich die Benutzer nicht für MTEB-Ranglisten oder Benchmark-Tabellen - sie wollen einfach nur schnell die richtigen Informationen finden. Entscheiden Sie sich für das Modell, das ein ausgewogenes Verhältnis zwischen Genauigkeit, Kosten und Kompatibilität mit Ihrem System bietet, und Sie haben etwas geschaffen, das nicht nur in der Theorie beeindruckt, sondern auch in der Praxis wirklich funktioniert.</p>
