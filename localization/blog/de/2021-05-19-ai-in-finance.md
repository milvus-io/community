---
id: ai-in-.md
title: >-
  Beschleunigung der KI im Finanzwesen mit Milvus, einer
  Open-Source-Vektordatenbank
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus kann für die Entwicklung von KI-Anwendungen für die Finanzbranche
  verwendet werden, darunter Chatbots, Empfehlungssysteme und vieles mehr.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Beschleunigung der KI im Finanzwesen mit Milvus, einer Open-Source-Vektordatenbank</custom-h1><p>Banken und andere Finanzinstitute haben schon seit langem Open-Source-Software für die Verarbeitung und Analyse großer Datenmengen eingesetzt. Im Jahr 2010 <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">begann</a> Morgan Stanley im Rahmen eines kleinen Experiments <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">mit der Nutzung</a> des Open-Source-Frameworks Apache Hadoop. Das Unternehmen hatte Schwierigkeiten, herkömmliche Datenbanken erfolgreich auf die riesigen Datenmengen zu skalieren, die seine Wissenschaftler nutzen wollten, und beschloss daher, alternative Lösungen zu untersuchen. Hadoop ist heute ein fester Bestandteil bei Morgan Stanley und hilft bei allen Aufgaben, von der Verwaltung von CRM-Daten bis hin zur Portfolioanalyse. Andere Open-Source-Software für relationale Datenbanken wie MySQL, MongoDB und PostgreSQL sind unverzichtbare Werkzeuge, um Big Data in der Finanzbranche sinnvoll zu nutzen.</p>
<p>Technologie verschafft der Finanzdienstleistungsbranche einen Wettbewerbsvorteil, und künstliche Intelligenz (KI) entwickelt sich rasch zum Standardansatz, um wertvolle Erkenntnisse aus Big Data zu gewinnen und Aktivitäten im Bank-, Asset-Management- und Versicherungssektor in Echtzeit zu analysieren. Durch den Einsatz von KI-Algorithmen zur Umwandlung unstrukturierter Daten wie Bilder, Audio- oder Videodaten in Vektoren, ein maschinenlesbares numerisches Datenformat, ist es möglich, Ähnlichkeitssuchen in riesigen Millionen-, Milliarden- oder sogar Billionen-Vektordatensätzen durchzuführen. Vektordaten werden im hochdimensionalen Raum gespeichert, und ähnliche Vektoren werden mit Hilfe der Ähnlichkeitssuche gefunden, für die eine spezielle Infrastruktur, eine sogenannte Vektordatenbank, erforderlich ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> ist eine Open-Source-Vektordatenbank, die speziell für die Verwaltung von Vektordaten entwickelt wurde. Das bedeutet, dass sich Ingenieure und Datenwissenschaftler auf die Entwicklung von KI-Anwendungen oder die Durchführung von Analysen konzentrieren können - und nicht auf die zugrunde liegende Dateninfrastruktur. Die Plattform wurde für die Entwicklung von KI-Anwendungen entwickelt und ist für die Rationalisierung von maschinellen Lernprozessen (MLOps) optimiert. Weitere Informationen über Milvus und die zugrunde liegende Technologie finden Sie in unserem <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">Blog</a>.</p>
<p>Zu den gängigen Anwendungen von KI in der Finanzdienstleistungsbranche gehören algorithmischer Handel, Portfoliozusammensetzung und -optimierung, Modellvalidierung, Backtesting, Robo-Advising, virtuelle Kundenassistenten, Analyse der Marktauswirkungen, Einhaltung von Vorschriften und Stresstests. Dieser Artikel befasst sich mit drei spezifischen Bereichen, in denen Vektordaten als einer der wertvollsten Vermögenswerte für Banken und Finanzunternehmen genutzt werden:</p>
<ol>
<li>Verbesserung des Kundenerlebnisses mit Chatbots für Banken</li>
<li>Steigerung des Verkaufs von Finanzdienstleistungen und mehr mit Empfehlungssystemen</li>
<li>Analyse von Gewinnberichten und anderen unstrukturierten Finanzdaten mit semantischem Text Mining</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Verbesserung des Kundenerlebnisses mit Banken-Chatbots</h3><p>Banken-Chatbots können das Kundenerlebnis verbessern, indem sie den Verbrauchern bei der Auswahl von Investitionen, Bankprodukten und Versicherungspolicen helfen. Digitale Dienstleistungen werden immer beliebter, zum Teil aufgrund von Trends, die durch die Coronavirus-Pandemie beschleunigt wurden. Chatbots arbeiten mit natürlicher Sprachverarbeitung (NLP), um vom Benutzer gestellte Fragen in semantische Vektoren umzuwandeln und nach passenden Antworten zu suchen. Moderne Chatbots für Banken bieten den Nutzern ein personalisiertes, natürliches Erlebnis und sprechen in einem konversationellen Ton. Milvus bietet eine Datenstruktur, die sich gut für die Erstellung von Chatbots mit Echtzeit-Vektorähnlichkeitssuche eignet.</p>
<p>Erfahren Sie mehr in unserer Demo, die die Erstellung von <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">Chatbots mit Milvus</a> behandelt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Steigerung des Verkaufs von Finanzdienstleistungen und mehr mit Empfehlungssystemen:</h4><p>Der Private-Banking-Sektor nutzt Empfehlungssysteme, um den Absatz von Finanzprodukten durch personalisierte Empfehlungen auf der Grundlage von Kundenprofilen zu steigern. Empfehlungssysteme können auch in der Finanzforschung, bei Wirtschaftsnachrichten, der Aktienauswahl und bei Systemen zur Unterstützung des Handels eingesetzt werden. Mit Hilfe von Deep-Learning-Modellen wird jeder Nutzer und jedes Objekt als ein eingebetteter Vektor beschrieben. Eine Vektordatenbank bietet einen Einbettungsraum, in dem Ähnlichkeiten zwischen Benutzern und Artikeln berechnet werden können.</p>
<p>Erfahren Sie mehr in unserer <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">Demo</a> über graphbasierte Empfehlungssysteme mit Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Analyse von Gewinnberichten und anderen unstrukturierten Finanzdaten mit semantischem Text Mining:</h4><p>Text Mining-Techniken haben die Finanzbranche stark beeinflusst. Da Finanzdaten exponentiell wachsen, hat sich Text Mining als wichtiges Forschungsgebiet im Finanzbereich herauskristallisiert.</p>
<p>Deep-Learning-Modelle werden derzeit eingesetzt, um Finanzberichte durch Wortvektoren darzustellen, die zahlreiche semantische Aspekte erfassen können. Eine Vektordatenbank wie Milvus ist in der Lage, riesige semantische Wortvektoren aus Millionen von Berichten zu speichern und dann innerhalb von Millisekunden eine Ähnlichkeitssuche mit ihnen durchzuführen.</p>
<p>Erfahren Sie mehr darüber, wie Sie <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">deepset's Haystack mit Milvus nutzen</a> können.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Seien Sie kein Fremder</h3><ul>
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
