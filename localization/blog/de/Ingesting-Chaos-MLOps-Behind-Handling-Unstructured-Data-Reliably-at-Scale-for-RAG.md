---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Ingesting Chaos: Die MLOps hinter dem zuverlässigen Umgang mit
  unstrukturierten Daten für RAG in großem Maßstab
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Mit Technologien wie VectorFlow und Milvus kann das Team effizient in
  verschiedenen Umgebungen testen und dabei die Anforderungen an Datenschutz und
  Sicherheit erfüllen.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Daten werden schneller als je zuvor in jeder erdenklichen Form erzeugt. Diese Daten sind das Benzin, das eine neue Welle von Anwendungen der künstlichen Intelligenz antreiben wird, aber diese Maschinen zur Produktivitätssteigerung brauchen Hilfe bei der Aufnahme dieses Treibstoffs. Die große Bandbreite an Szenarien und Sonderfällen, die unstrukturierte Daten umgeben, macht ihre Verwendung in KI-Systemen schwierig.</p>
<p>Zunächst einmal gibt es eine große Anzahl von Datenquellen. Diese exportieren Daten in verschiedenen Dateiformaten, von denen jedes seine Eigenheiten hat. Wie man zum Beispiel ein PDF verarbeitet, hängt stark davon ab, woher es kommt. Beim Einlesen einer PDF-Datei für einen Rechtsstreit im Wertpapierbereich wird der Schwerpunkt wahrscheinlich auf Textdaten liegen. Im Gegensatz dazu wird eine Systemdesign-Spezifikation für einen Raketentechniker voller Diagramme sein, die eine visuelle Verarbeitung erfordern. Das Fehlen eines definierten Schemas bei unstrukturierten Daten erhöht die Komplexität zusätzlich. Selbst wenn die Herausforderung der Datenverarbeitung gemeistert ist, bleibt das Problem der Aufnahme der Daten in großem Umfang bestehen. Die Größe von Dateien kann erheblich variieren, was die Art ihrer Verarbeitung verändert. Sie können einen Upload von 1 MB über eine API über HTTP schnell verarbeiten, aber das Einlesen von Dutzenden von GB aus einer einzigen Datei erfordert Streaming und einen speziellen Worker.</p>
<p>Die Bewältigung dieser traditionellen Herausforderungen der Datentechnik ist eine Grundvoraussetzung für die Verbindung von Rohdaten mit <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a> über <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbanken</a> wie <a href="https://github.com/milvus-io/milvus">Milvus</a>. Neue Anwendungsfälle wie die Durchführung semantischer Ähnlichkeitssuchen mit Hilfe einer Vektordatenbank erfordern jedoch neue Verarbeitungsschritte wie das Chunking der Quelldaten, die Orchestrierung von Metadaten für hybride Suchen, die Auswahl des geeigneten Vektoreinbettungsmodells und die Abstimmung der Suchparameter, um zu bestimmen, welche Daten an den LLM weitergegeben werden sollen. Diese Arbeitsabläufe sind so neu, dass es keine etablierten Best Practices gibt, an denen sich die Entwickler orientieren könnten. Stattdessen müssen sie experimentieren, um die richtige Konfiguration und den richtigen Anwendungsfall für ihre Daten zu finden. Um diesen Prozess zu beschleunigen, ist es von unschätzbarem Wert, eine Vektoreinbettungspipeline zu verwenden, die die Daten in die Vektordatenbank einspeist.</p>
<p>Eine Vektoreinbettungspipeline wie <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> verbindet Ihre Rohdaten mit Ihrer Vektordatenbank, einschließlich Chunking, Orchestrierung von Metadaten, Einbettung und Upload. VectorFlow ermöglicht es Entwicklungsteams, sich auf die Kernanwendungslogik zu konzentrieren und mit den verschiedenen Abrufparametern zu experimentieren, die aus dem Einbettungsmodell, der Chunking-Strategie, den Metadatenfeldern und Aspekten der Suche generiert werden, um zu sehen, was am besten funktioniert.</p>
<p>Bei unserer Arbeit, bei der wir Entwicklungsteams dabei helfen, ihre <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">RAG-Systeme (Retrieval Augmented Generation)</a> vom Prototyp in die Produktion zu überführen, haben wir festgestellt, dass der folgende Ansatz beim Testen der verschiedenen Parameter einer RAG-Suchpipeline erfolgreich ist:</p>
<ol>
<li>Verwenden Sie einen kleinen Datensatz, mit dem Sie vertraut sind, um die Iteration zu beschleunigen, z.B. einige PDFs, die relevante Teile für die Suchanfragen enthalten.</li>
<li>Erstellen Sie einen Standardsatz von Fragen und Antworten zu dieser Teilmenge der Daten. Schreiben Sie z. B. nach dem Lesen der PDFs eine Liste von Fragen und lassen Sie Ihr Team die Antworten abstimmen.</li>
<li>Erstellen Sie ein automatisiertes Bewertungssystem, das die Ergebnisse der Abfrage für jede Frage bewertet. Eine Möglichkeit, dies zu tun, besteht darin, die Antwort aus dem RAG-System zu nehmen und sie durch das LLM laufen zu lassen, mit einer Eingabeaufforderung, die fragt, ob dieses RAG-Ergebnis die Frage mit der richtigen Antwort beantwortet. Dies sollte eine "Ja"- oder "Nein"-Antwort sein. Wenn Sie z.B. 25 Fragen in Ihren Dokumenten haben und das System 20 richtig beantwortet, können Sie dies zum Benchmarking mit anderen Ansätzen verwenden.</li>
<li>Stellen Sie sicher, dass Sie für die Auswertung ein anderes LLM verwenden als für die Codierung der in der Datenbank gespeicherten Vektoreinbettungen. Das LLM für die Auswertung ist typischerweise ein Decoder-Typ eines Modells wie GPT-4. Eine Sache, die man nicht vergessen sollte, sind die Kosten dieser Auswertungen, wenn sie wiederholt ausgeführt werden. Open-Source-Modelle wie Llama2 70B oder der Deci AI LLM 6B, die auf einem einzigen, kleineren Grafikprozessor laufen können, haben ungefähr die gleiche Leistung zu einem Bruchteil der Kosten.</li>
<li>Führen Sie jeden Test mehrmals durch und bilden Sie den Durchschnitt der Ergebnisse, um die Stochastik des LLM auszugleichen.</li>
</ol>
<p>Wenn Sie alle Optionen außer einer konstant halten, können Sie schnell feststellen, welche Parameter für Ihren Anwendungsfall am besten geeignet sind. Eine Vektoreinbettungspipeline wie VectorFlow macht dies auf der Ingestion-Seite besonders einfach, da Sie schnell verschiedene Chunking-Strategien, Chunk-Längen, Chunk-Überlappungen und Open-Source-Einbettungsmodelle ausprobieren können, um zu sehen, was zu den besten Ergebnissen führt. Dies ist besonders nützlich, wenn Ihr Datensatz aus verschiedenen Dateitypen und Datenquellen besteht, die eine eigene Logik erfordern.</p>
<p>Sobald das Team weiß, was für seinen Anwendungsfall am besten geeignet ist, kann es mit der Vektoreinbettungspipeline schnell zur Produktion übergehen, ohne das System neu gestalten zu müssen, um Dinge wie Zuverlässigkeit und Überwachung zu berücksichtigen. Mit Technologien wie VectorFlow und <a href="https://zilliz.com/what-is-milvus">Milvus</a>, die quelloffen und plattformunabhängig sind, kann das Team effizient in verschiedenen Umgebungen testen und dabei die Datenschutz- und Sicherheitsanforderungen einhalten.</p>
