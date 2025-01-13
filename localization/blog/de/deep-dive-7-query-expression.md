---
id: deep-dive-7-query-expression.md
title: Wie versteht die Datenbank Ihre Abfrage und wie führt sie sie aus?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Eine Vektorabfrage ist der Prozess des Abrufs von Vektoren durch skalare
  Filterung.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> verfasst.</p>
</blockquote>
<p>Eine <a href="https://milvus.io/docs/v2.0.x/query.md">Vektorabfrage</a> in Milvus ist der Prozess des Abrufs von Vektoren mittels skalarer Filterung auf der Grundlage eines booleschen Ausdrucks. Mit skalarer Filterung können Benutzer ihre Abfrageergebnisse mit bestimmten Bedingungen einschränken, die auf Datenattribute angewendet werden. Wenn ein Benutzer beispielsweise nach Filmen sucht, die zwischen 1990 und 2010 veröffentlicht wurden und eine Bewertung von mehr als 8,5 haben, werden nur Filme angezeigt, deren Attribute (Erscheinungsjahr und Bewertung) die Bedingung erfüllen.</p>
<p>In diesem Beitrag soll untersucht werden, wie eine Abfrage in Milvus von der Eingabe eines Abfrageausdrucks bis zur Erstellung des Abfrageplans und der Ausführung der Abfrage abgeschlossen wird.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#Query-expression">Abfrageausdruck</a></li>
<li><a href="#Plan-AST-generation">Plan-AST-Generierung</a></li>
<li><a href="#Query-execution">Abfrageausführung</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Abfrageausdruck<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Ausdruck einer Abfrage mit Attributfilterung in Milvus verwendet die EBNF-Syntax (Erweiterte Backus-Naur-Form). Die Abbildung unten zeigt die Ausdrucksregeln in Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Ausdrucks-Syntax</span> </span></p>
<p>Logische Ausdrücke können durch die Kombination von binären logischen Operatoren, unären logischen Operatoren, logischen Ausdrücken und einzelnen Ausdrücken erstellt werden. Da die EBNF-Syntax selbst rekursiv ist, kann ein logischer Ausdruck das Ergebnis einer Kombination oder Teil eines größeren logischen Ausdrucks sein. Ein logischer Ausdruck kann viele sub-logische Ausdrücke enthalten. Die gleiche Regel gilt in Milvus. Wenn ein Benutzer die Attribute der Ergebnisse mit vielen Bedingungen filtern muss, kann er seinen eigenen Satz von Filterbedingungen erstellen, indem er verschiedene logische Operatoren und Ausdrücke kombiniert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Boolescher Ausdruck</span> </span></p>
<p>Das Bild oben zeigt einen Teil der <a href="https://milvus.io/docs/v2.0.x/boolean.md">Regeln für boolesche Ausdrücke</a> in Milvus. Unäre logische Operatoren können zu einem Ausdruck hinzugefügt werden. Derzeit unterstützt Milvus nur den unären logischen Operator &quot;not&quot;, der anzeigt, dass das System die Vektoren nehmen muss, deren skalare Feldwerte die Berechnungsergebnisse nicht erfüllen. Zu den binären logischen Operatoren gehören &quot;und&quot; und &quot;oder&quot;. Einzelne Ausdrücke umfassen Termausdrücke und Vergleichsausdrücke.</p>
<p>Grundlegende arithmetische Berechnungen wie Addition, Subtraktion, Multiplikation und Division werden bei einer Abfrage in Milvus ebenfalls unterstützt. Die folgende Abbildung veranschaulicht die Rangfolge der Operationen. Die Operatoren sind von oben nach unten in absteigender Rangfolge aufgeführt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Vorrangigkeit</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Wie wird ein Abfrageausdruck zu bestimmten Filmen in Milvus verarbeitet?</h3><p>Angenommen, in Milvus ist eine Fülle von Filmdaten gespeichert und der Benutzer möchte bestimmte Filme abfragen. Jeder in Milvus gespeicherte Film hat zum Beispiel die folgenden fünf Felder: Film-ID, Erscheinungsjahr, Filmtyp, Filmmusik und Filmplakat. In diesem Beispiel ist der Datentyp der Film-ID und des Erscheinungsjahres int64, während die Filmpunkte Fließkommadaten sind. Auch Filmplakate werden im Format von Fließkomma-Vektoren und der Filmtyp im Format von String-Daten gespeichert. Die Unterstützung von String-Daten ist eine neue Funktion in Milvus 2.1.</p>
<p>Wenn ein Benutzer zum Beispiel die Filme mit einer Bewertung von mehr als 8,5 abfragen möchte. Die Filme sollten außerdem in einem Jahrzehnt vor 2000 bis zu einem Jahrzehnt nach 2000 veröffentlicht worden sein, oder ihr Typ sollte entweder eine Komödie oder ein Actionfilm sein, muss der Benutzer den folgenden Prädikatsausdruck eingeben: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Nachdem das System den Abfrageausdruck erhalten hat, wird es ihn in der folgenden Reihenfolge ausführen:</p>
<ol>
<li>Abfrage nach Filmen mit einer Bewertung von mehr als 8,5. Die Abfrageergebnisse werden &quot;result1&quot; genannt.</li>
<li>Berechnen Sie 2000 - 10, um "Ergebnis2" (1990) zu erhalten.</li>
<li>Berechnen Sie 2000 + 10, um "result3" (2010) zu erhalten.</li>
<li>Suchen Sie nach Filmen, deren Wert auf <code translate="no">release_year</code> größer als &quot;result2&quot; und kleiner als &quot;result3&quot; ist. Das heißt, dass das System nach Filmen suchen muss, die zwischen 1990 und 2010 veröffentlicht wurden. Die Abfrageergebnisse werden als &quot;result4&quot; bezeichnet.</li>
<li>Abfrage nach Filmen, die entweder Komödien oder Actionfilme sind. Die Abfrageergebnisse werden als &quot;result5&quot; bezeichnet.</li>
<li>Kombinieren Sie "result4" und "result5", um Filme zu erhalten, die entweder zwischen 1990 und 2010 veröffentlicht wurden oder zur Kategorie der Komödie oder des Actionfilms gehören. Die Ergebnisse werden als &quot;result6&quot; bezeichnet.</li>
<li>Nehmen Sie den gemeinsamen Teil in "result1" und "result6", um die endgültigen Ergebnisse zu erhalten, die alle Bedingungen erfüllen.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Beispiel für einen Film</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">AST-Generierung planen<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus nutzt das Open-Source-Tool <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) für die Generierung von Plan-AST (Abstract Syntax Tree). ANTLR ist ein leistungsfähiger Parser-Generator zum Lesen, Verarbeiten, Ausführen oder Übersetzen von Strukturtext- oder Binärdateien. Genauer gesagt kann ANTLR einen Parser zum Aufbau und zur Abarbeitung von Parse-Bäumen auf der Grundlage einer vordefinierten Syntax oder von Regeln erzeugen. Das folgende Bild ist ein Beispiel, in dem der Eingabeausdruck &quot;SP=100;&quot; lautet. LEXER, die integrierte Spracherkennungsfunktion in ANTLR, erzeugt vier Token für den Eingabeausdruck - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; und &quot;;&quot;. Anschließend analysiert das Tool die vier Token weiter, um den entsprechenden Parse-Baum zu erzeugen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>Parse-Baum</span> </span></p>
<p>Der Walker-Mechanismus ist ein wichtiger Bestandteil des ANTLR-Tools. Er soll alle Parse-Bäume durchlaufen, um zu prüfen, ob jeder Knoten den Syntaxregeln gehorcht, oder um bestimmte sensible Wörter zu erkennen. Einige der relevanten APIs sind in der folgenden Abbildung aufgeführt. Da ANTLR vom Wurzelknoten ausgeht und jeden Unterknoten bis zum Ende durchläuft, ist es nicht notwendig, die Reihenfolge des Durchlaufs des Parse-Baums zu unterscheiden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>Parse-Baum-Walker</span> </span></p>
<p>Milvus generiert den PlanAST für Abfragen auf ähnliche Weise wie ANTLR. Die Verwendung von ANTLR erfordert jedoch die Neudefinition von ziemlich komplizierten Syntaxregeln. Daher übernimmt Milvus eine der am weitesten verbreiteten Regeln - die Regeln für boolesche Ausdrücke - und hängt vom <a href="https://github.com/antonmedv/expr">Expr-Paket</a> ab, das auf GitHub zur Verfügung steht, um die Syntax von Abfrageausdrücken abzufragen und zu parsen.</p>
<p>Bei einer Abfrage mit Attributfilterung generiert Milvus nach Erhalt des Abfrageausdrucks einen primitiven, ungelösten Planbaum mithilfe von ant-parser, der von Expr bereitgestellten Parsing-Methode. Der primitive Planbaum, den wir erhalten, ist ein einfacher binärer Baum. Dann wird der Planbaum durch Expr und den eingebauten Optimierer in Milvus fein abgestimmt. Der Optimierer in Milvus ist dem bereits erwähnten Walker-Mechanismus sehr ähnlich. Da die von Expr zur Verfügung gestellte Funktionalität zur Optimierung des Planbaums ziemlich ausgefeilt ist, wird die Belastung des in Milvus eingebauten Optimierers weitgehend gemindert. Letztendlich analysiert der Analyzer den optimierten Planbaum in einer rekursiven Weise, um einen Plan-AST in der Struktur von <a href="https://developers.google.com/protocol-buffers">Protokollpuffern</a> (protobuf) zu erzeugen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Plan-AST-Arbeitsablauf</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Ausführung der Abfrage<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Ausführung der Abfrage ist im Grunde die Ausführung des in den vorherigen Schritten generierten Plan-AST.</p>
<p>In Milvus wird ein Plan AST in einer Proto-Struktur definiert. Die Abbildung unten zeigt eine Nachricht mit der protobuf-Struktur. Es gibt sechs Arten von Ausdrücken, darunter binäre Ausdrücke und unäre Ausdrücke, die auch binäre logische Ausdrücke und unäre logische Ausdrücke enthalten können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>Die folgende Abbildung ist eine UML-Darstellung des Abfrageausdrucks. Es zeigt die Basisklasse und die abgeleitete Klasse eines jeden Ausdrucks. Jede Klasse verfügt über eine Methode zur Annahme von Besucherparametern. Dies ist ein typisches Besucherentwurfsmuster. Milvus verwendet dieses Muster, um den Plan AST auszuführen, da sein größter Vorteil darin besteht, dass die Benutzer nichts an den primitiven Ausdrücken ändern müssen, sondern direkt auf eine der Methoden in den Mustern zugreifen können, um bestimmte Abfrageausdrucksklassen und relevante Elemente zu ändern.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Bei der Ausführung eines Plan-AST erhält Milvus zunächst einen Plan-Knoten vom Typ Proto. Dann wird über den internen C++-Proto-Parser ein Plan-Knoten vom Typ Segcore ermittelt. Nach Erhalt der beiden Arten von Planknoten akzeptiert Milvus eine Reihe von Klassenzugriffen und modifiziert dann die interne Struktur der Planknoten und führt sie aus. Schließlich durchsucht Milvus alle Knoten des Ausführungsplans, um die gefilterten Ergebnisse zu erhalten. Die Endergebnisse werden im Format einer Bitmaske ausgegeben. Eine Bitmaske ist ein Array von Bitnummern ("0" und "1"). Die Daten, die die Filterbedingungen erfüllen, werden in der Bitmaske als "1" markiert, während die Daten, die die Anforderungen nicht erfüllen, in der Bitmaske als "0" markiert werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>Arbeitsablauf ausführen</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Reihe<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine tiefgehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Überblick über die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs und Python-SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Datenverwaltung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Abfrage in Echtzeit</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Skalare Ausführungsmaschine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA-System</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vektorielles Ausführungssystem</a></li>
</ul>
