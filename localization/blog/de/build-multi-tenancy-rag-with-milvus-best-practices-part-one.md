---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Design von Multi-Tenancy RAG mit Milvus: Best Practices für skalierbare
  Enterprise Knowledge Bases
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>In den letzten Jahren hat sich <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> als zuverlässige Lösung für große Organisationen herauskristallisiert, um ihre <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM-gestützten</a> Anwendungen zu verbessern, insbesondere solche mit verschiedenen Benutzern. Da solche Anwendungen wachsen, wird die Implementierung eines Multi-Tenancy-Frameworks unerlässlich. <strong>Multi-Tenancy</strong> bietet einen sicheren, isolierten Zugriff auf Daten für verschiedene Benutzergruppen und gewährleistet so das Vertrauen der Benutzer, die Einhaltung gesetzlicher Vorschriften und die Verbesserung der betrieblichen Effizienz.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> ist eine <a href="https://zilliz.com/learn/what-is-vector-database">Open-Source-Vektordatenbank</a>, die für die Verarbeitung hochdimensionaler <a href="https://zilliz.com/glossary/vector-embeddings">Vektordaten</a> entwickelt wurde. Sie ist eine unverzichtbare Infrastrukturkomponente von RAG, die kontextbezogene Informationen für LLMs aus externen Quellen speichert und abruft. Milvus bietet <a href="https://milvus.io/docs/multi_tenancy.md">flexible Multi-Tenancy-Strategien</a> für verschiedene Anforderungen, einschließlich <strong>Multi-Tenancy auf Datenbank-, Sammel- und Partitionsebene</strong>.</p>
<p>In diesem Beitrag werden wir Folgendes behandeln:</p>
<ul>
<li><p>Was ist Multi-Tenancy und warum ist es wichtig?</p></li>
<li><p>Multi-Tenancy-Strategien in Milvus</p></li>
<li><p>Beispiel: Multi-Tenancy-Strategie für eine RAG-gestützte Unternehmens-Wissensdatenbank</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">Was ist Multi-Tenancy und warum ist sie wichtig?<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>Multi-Tenancy</strong></a> ist eine Architektur, bei der mehrere Kunden oder Teams, sogenannte &quot;<strong>Tenants&quot;,</strong> eine einzige Instanz einer Anwendung oder eines Systems gemeinsam nutzen. Die Daten und Konfigurationen der einzelnen Mandanten sind logisch isoliert, um Datenschutz und Sicherheit zu gewährleisten, während alle Mandanten dieselbe zugrunde liegende Infrastruktur nutzen.</p>
<p>Stellen Sie sich eine SaaS-Plattform vor, die wissensbasierte Lösungen für mehrere Unternehmen bereitstellt. Jedes Unternehmen ist ein Mieter.</p>
<ul>
<li><p>Mieter A ist eine Organisation des Gesundheitswesens, die patientenbezogene FAQs und Compliance-Dokumente speichert.</p></li>
<li><p>Mieter B ist ein Technologieunternehmen, das interne IT-Fehlerbehebungsabläufe verwaltet.</p></li>
<li><p>Mieter C ist ein Einzelhandelsunternehmen, das FAQs für Produktrücksendungen verwaltet.</p></li>
</ul>
<p>Jeder Tenant arbeitet in einer vollständig isolierten Umgebung, um sicherzustellen, dass keine Daten von Tenant A in das System von Tenant B gelangen oder umgekehrt. Darüber hinaus sind Entscheidungen zur Ressourcenzuweisung, Abfrageleistung und Skalierung mandantenspezifisch, so dass eine hohe Leistung unabhängig von Arbeitslastspitzen in einem Mandanten gewährleistet ist.</p>
<p>Multi-Tenant funktioniert auch für Systeme, die verschiedene Teams innerhalb desselben Unternehmens bedienen. Stellen Sie sich ein großes Unternehmen vor, das eine RAG-gestützte Wissensdatenbank für seine internen Abteilungen wie Personalabteilung, Rechtsabteilung und Marketing einsetzt. Jede <strong>Abteilung ist</strong> in dieser Konstellation <strong>ein Tenant</strong> mit isolierten Daten und Ressourcen.</p>
<p>Multi-Tenancy bietet erhebliche Vorteile, darunter <strong>Kosteneffizienz, Skalierbarkeit und robuste Datensicherheit</strong>. Durch die gemeinsame Nutzung einer einzigen Infrastruktur können Dienstanbieter ihre Gemeinkosten senken und eine effektivere Ressourcennutzung gewährleisten. Dieser Ansatz lässt sich außerdem mühelos skalieren - für das Einbinden neuer Mandanten werden weitaus weniger Ressourcen benötigt als für die Erstellung separater Instanzen für jeden einzelnen Mandanten, wie es bei Modellen mit Einzelmandanten der Fall ist. Wichtig ist, dass die Mandantenfähigkeit die Datensicherheit aufrechterhält, indem sie eine strikte Datenisolierung für jeden Mandanten gewährleistet, wobei Zugriffskontrollen und Verschlüsselung sensible Informationen vor unbefugtem Zugriff schützen. Darüber hinaus können Aktualisierungen, Patches und neue Funktionen auf allen Mandanten gleichzeitig bereitgestellt werden, was die Systemwartung vereinfacht und die Belastung der Administratoren verringert, während gleichzeitig sichergestellt wird, dass die Sicherheits- und Compliance-Standards konsequent eingehalten werden.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Mehrmandanten-Strategien in Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Um zu verstehen, wie Milvus Multi-Tenancy unterstützt, ist es wichtig, sich zunächst anzusehen, wie es die Benutzerdaten organisiert.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Wie Milvus die Benutzerdaten organisiert</h3><p>Milvus strukturiert die Daten auf drei Ebenen, die sich von breit bis granular erstrecken: <a href="https://milvus.io/docs/manage_databases.md"><strong>Datenbank</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Sammlung</strong></a> und <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partition/Partitionsschlüssel</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Abbildung - Wie Milvus die Benutzerdaten organisiert .png</span> </span></p>
<p><em>Abbildung: Wie Milvus die Benutzerdaten organisiert</em></p>
<ul>
<li><p><strong>Datenbank</strong>: Sie fungiert als logischer Container, ähnlich wie eine Datenbank in traditionellen relationalen Systemen.</p></li>
<li><p><strong>Sammlung</strong>: Vergleichbar mit einer Tabelle in einer Datenbank, organisiert eine Sammlung die Daten in verwaltbaren Gruppen.</p></li>
<li><p><strong>Partition/Partitionsschlüssel</strong>: Innerhalb einer Sammlung können die Daten durch <strong>Partitionen</strong> weiter segmentiert werden. Mit einem <strong>Partitionsschlüssel</strong> werden Daten mit demselben Schlüssel gruppiert. Wenn Sie beispielsweise eine <strong>Benutzer-ID</strong> als <strong>Partitionsschlüssel</strong> verwenden, werden alle Daten für einen bestimmten Benutzer in demselben logischen Segment gespeichert. Auf diese Weise ist es einfach, Daten abzurufen, die an einzelne Benutzer gebunden sind.</p></li>
</ul>
<p>Wenn Sie von der <strong>Datenbank</strong> zur <strong>Sammlung</strong> und zum <strong>Partitionsschlüssel</strong> übergehen, wird die Granularität der Datenorganisation immer feiner.</p>
<p>Um eine stärkere Datensicherheit und eine angemessene Zugriffskontrolle zu gewährleisten, bietet Milvus auch eine robuste <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>rollenbasierte Zugriffskontrolle (RBAC)</strong></a>, die es Administratoren ermöglicht, für jeden Benutzer spezifische Berechtigungen zu definieren. Nur autorisierte Benutzer können auf bestimmte Daten zugreifen.</p>
<p>Milvus unterstützt <a href="https://milvus.io/docs/multi_tenancy.md">mehrere Strategien</a> für die Implementierung von Mandantenfähigkeit und bietet damit Flexibilität je nach den Anforderungen Ihrer Anwendung: <strong>Mandantenfähigkeit auf Datenbankebene, Sammlungsebene und Partitionsebene</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multi-Tenancy auf Datenbank-Ebene</h3><p>Bei der Mandantenfähigkeit auf Datenbankebene wird jedem Mandanten eine eigene Datenbank innerhalb desselben Milvus-Clusters zugewiesen. Diese Strategie bietet eine starke Datenisolierung und gewährleistet eine optimale Suchleistung. Sie kann jedoch zu einer ineffizienten Ressourcennutzung führen, wenn bestimmte Tenants inaktiv bleiben.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multi-Tenancy auf Sammlungsebene</h3><p>Bei der Multi-Mandantenschaft auf Sammlungsebene können wir die Daten für die Mandanten auf zwei Arten organisieren.</p>
<ul>
<li><p><strong>Eine Sammlung für alle Mieter</strong>: Alle Mieter teilen sich eine einzige Sammlung, wobei mieterspezifische Felder zur Filterung verwendet werden. Dieser Ansatz ist zwar einfach zu implementieren, kann aber mit zunehmender Anzahl von Mietern zu Leistungsengpässen führen.</p></li>
<li><p><strong>Eine Sammlung pro Mandant</strong>: Jeder Mandant kann eine eigene Sammlung haben, was die Isolierung und Leistung verbessert, aber mehr Ressourcen erfordert. Bei dieser Konfiguration kann es zu Einschränkungen bei der Skalierbarkeit kommen, wenn die Anzahl der Mandanten die Sammlungskapazität von Milvus übersteigt.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Multi-Mandantenschaft auf Partitionsebene</h3><p>Multi-Tenancy auf Partitionsebene konzentriert sich auf die Organisation von Mandanten innerhalb einer einzigen Sammlung. Auch hier gibt es zwei Möglichkeiten, Mieterdaten zu organisieren.</p>
<ul>
<li><p><strong>Eine Partition pro Mieter</strong>: Die Mieter teilen sich eine Sammlung, aber ihre Daten werden in separaten Partitionen gespeichert. Wir können Daten isolieren, indem wir jedem Tenant eine eigene Partition zuweisen und so ein Gleichgewicht zwischen Isolierung und Suchleistung herstellen. Dieser Ansatz wird jedoch durch die maximale Partitionsgrenze von Milvus eingeschränkt.</p></li>
<li><p><strong>Partition-Schlüssel-basierte Mandantenfähigkeit</strong>: Hierbei handelt es sich um eine skalierbarere Option, bei der eine einzige Sammlung Partitionsschlüssel zur Unterscheidung von Mandanten verwendet. Diese Methode vereinfacht die Ressourcenverwaltung und ermöglicht eine höhere Skalierbarkeit, unterstützt jedoch keine Massendateneinfügungen.</p></li>
</ul>
<p>Die nachstehende Tabelle fasst die wichtigsten Unterschiede zwischen den wichtigsten Multi-Tenancy-Ansätzen zusammen.</p>
<table>
<thead>
<tr><th><strong>Granularität</strong></th><th><strong>Datenbankebene</strong></th><th><strong>Sammlungsebene</strong></th><th><strong>Partition Schlüssel-Ebene</strong></th></tr>
</thead>
<tbody>
<tr><td>Max. unterstützte Mieter</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Flexibilität bei der Datenorganisation</td><td>Hoch: Benutzer können mehrere Sammlungen mit benutzerdefinierten Schemata definieren.</td><td>Mittel: Benutzer sind auf eine Sammlung mit einem benutzerdefinierten Schema beschränkt.</td><td>Gering: Alle Benutzer teilen sich eine Sammlung, was ein einheitliches Schema erfordert.</td></tr>
<tr><td>Kosten pro Benutzer</td><td>Hoch</td><td>Mittel</td><td>Niedrig</td></tr>
<tr><td>Physische Ressourcenisolierung</td><td>Ja</td><td>Ja</td><td>Nein</td></tr>
<tr><td>RBAC</td><td>Ja</td><td>Ja</td><td>Nein</td></tr>
<tr><td>Suchleistung</td><td>Stark</td><td>Mittel</td><td>Stark</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Beispiel: Multi-Tenancy-Strategie für eine RAG-gestützte Wissensdatenbank im Unternehmen<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Beim Entwurf der Multi-Tenancy-Strategie für ein RAG-System ist es wichtig, den Ansatz auf die spezifischen Bedürfnisse Ihres Unternehmens und Ihrer Mandanten abzustimmen. Milvus bietet verschiedene Multi-Tenancy-Strategien an, und die Wahl der richtigen Strategie hängt von der Anzahl der Mandanten, ihren Anforderungen und dem erforderlichen Grad der Datenisolierung ab. Im Folgenden finden Sie einen praktischen Leitfaden für diese Entscheidungen am Beispiel einer RAG-gestützten Wissensdatenbank für Unternehmen.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Verständnis der Mandantenstruktur vor der Entscheidung für eine Multi-Tenancy-Strategie</h3><p>Eine RAG-gestützte Wissensdatenbank für Unternehmen dient oft einer kleinen Anzahl von Mietern. Bei diesen Mandanten handelt es sich in der Regel um unabhängige Geschäftseinheiten wie IT, Vertrieb, Rechtsabteilung und Marketing, die jeweils unterschiedliche Wissensdatenbankdienste benötigen. Die Personalabteilung verwaltet beispielsweise sensible Mitarbeiterinformationen wie Einführungsleitfäden und Richtlinien für Sozialleistungen, die vertraulich und nur für Mitarbeiter der Personalabteilung zugänglich sein sollten.</p>
<p>In diesem Fall sollte jede Geschäftseinheit als separater Tenant behandelt werden, und eine <strong>Multi-Tenancy-Strategie auf Datenbankebene</strong> ist oft die beste Lösung. Durch die Zuweisung dedizierter Datenbanken an jeden Mandanten können Unternehmen eine starke logische Isolierung erreichen, was die Verwaltung vereinfacht und die Sicherheit erhöht. Dieses Setup bietet Tenants eine hohe Flexibilität: Sie können benutzerdefinierte Datenmodelle innerhalb von Sammlungen definieren, beliebig viele Sammlungen erstellen und die Zugriffskontrolle für ihre Sammlungen unabhängig verwalten.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Höhere Sicherheit durch physische Ressourcenisolierung</h3><p>In Situationen, in denen die Datensicherheit einen hohen Stellenwert hat, reicht die logische Isolierung auf Datenbankebene möglicherweise nicht aus. Beispielsweise können einige Geschäftseinheiten kritische oder hochsensible Daten verarbeiten, die stärkere Garantien gegen Störungen durch andere Tenants erfordern. In solchen Fällen können wir einen <a href="https://milvus.io/docs/resource_group.md">physischen Isolationsansatz</a> auf einer Multi-Tenancy-Struktur auf Datenbankebene implementieren.</p>
<p>Milvus ermöglicht es uns, logische Komponenten wie Datenbanken und Sammlungen auf physische Ressourcen abzubilden. Diese Methode stellt sicher, dass die Aktivitäten anderer Mandanten keine Auswirkungen auf kritische Vorgänge haben. Sehen wir uns an, wie dieser Ansatz in der Praxis funktioniert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Abbildung - Wie Milvus physische Ressourcen verwaltet.png</span> </span></p>
<p>Abbildung: Wie Milvus physische Ressourcen verwaltet</p>
<p>Wie im obigen Diagramm dargestellt, gibt es in Milvus drei Ebenen der Ressourcenverwaltung: <strong>Abfrageknoten</strong>, <strong>Ressourcengruppe</strong> und <strong>Datenbank</strong>.</p>
<ul>
<li><p><strong>Abfrageknoten</strong>: Die Komponente, die Abfrageaufgaben verarbeitet. Sie läuft auf einer physischen Maschine oder einem Container (z. B. einem Pod in Kubernetes).</p></li>
<li><p><strong>Ressourcengruppe</strong>: Eine Sammlung von Abfrageknoten, die als Brücke zwischen logischen Komponenten (Datenbanken und Sammlungen) und physischen Ressourcen dient. Sie können einer einzelnen Ressourcengruppe eine oder mehrere Datenbanken oder Sammlungen zuweisen.</p></li>
</ul>
<p>In dem im obigen Diagramm dargestellten Beispiel gibt es drei logische <strong>Datenbanken</strong>: X, Y, und Z.</p>
<ul>
<li><p><strong>Datenbank X</strong>: Enthält <strong>Sammlung A</strong>.</p></li>
<li><p><strong>Datenbank Y</strong>: Enthält die <strong>Sammlungen B</strong> und <strong>C</strong>.</p></li>
<li><p><strong>Datenbank Z</strong>: Enthält die <strong>Sammlungen D</strong> und <strong>E</strong>.</p></li>
</ul>
<p>Nehmen wir an, <strong>Datenbank X</strong> enthält eine kritische Wissensdatenbank, die nicht durch die Last von <strong>Datenbank Y</strong> oder <strong>Datenbank Z</strong> beeinträchtigt werden soll:</p>
<ul>
<li><p><strong>Datenbank X</strong> wird eine eigene <strong>Ressourcengruppe</strong> zugewiesen, um zu gewährleisten, dass ihre kritische Wissensbasis nicht durch die Arbeitslasten anderer Datenbanken beeinträchtigt wird.</p></li>
<li><p>Die<strong>Sammlung E</strong> wird ebenfalls einer eigenen <strong>Ressourcengruppe</strong> innerhalb ihrer übergeordneten Datenbank<strong>(Z</strong>) zugewiesen. Dadurch wird eine Isolierung auf der Ebene der Sammlung für bestimmte kritische Daten innerhalb einer gemeinsam genutzten Datenbank erreicht.</p></li>
</ul>
<p>Die übrigen Sammlungen in den <strong>Datenbanken Y</strong> und <strong>Z</strong> teilen sich die physischen Ressourcen der <strong>Ressourcengruppe 2</strong>.</p>
<p>Durch die sorgfältige Zuordnung von logischen Komponenten zu physischen Ressourcen können Unternehmen eine flexible, skalierbare und sichere mandantenfähige Architektur erreichen, die auf ihre spezifischen Geschäftsanforderungen zugeschnitten ist.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Gestaltung des Zugriffs auf Endbenutzer-Ebene</h3><p>Nachdem wir nun die Best Practices für die Auswahl einer Multi-Tenancy-Strategie für eine Unternehmens-RAG kennengelernt haben, wollen wir nun untersuchen, wie der Zugriff auf Benutzerebene in solchen Systemen gestaltet werden kann.</p>
<p>In diesen Systemen interagieren die Endbenutzer in der Regel mit der Wissensdatenbank in einem Nur-Lese-Modus über LLMs. Dennoch müssen Unternehmen die von den Nutzern generierten Q&amp;A-Daten verfolgen und sie mit bestimmten Nutzern verknüpfen, um beispielsweise die Genauigkeit der Wissensdatenbank zu verbessern oder personalisierte Dienste anzubieten.</p>
<p>Nehmen wir als Beispiel den intelligenten Beratungsdienst eines Krankenhauses. Patienten könnten Fragen stellen wie "Gibt es heute noch freie Termine beim Facharzt?" oder "Sind spezielle Vorbereitungen für meine bevorstehende Operation erforderlich?". Diese Fragen wirken sich zwar nicht direkt auf die Wissensdatenbank aus, doch ist es für das Krankenhaus wichtig, solche Interaktionen zu verfolgen, um die Dienstleistungen zu verbessern. Diese Frage-Antwort-Paare werden in der Regel in einer separaten Datenbank (es muss nicht unbedingt eine Vektordatenbank sein) gespeichert, die für die Protokollierung von Interaktionen bestimmt ist.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Abbildung: Die mandantenfähige Architektur für eine unternehmensweite RAG-Wissensdatenbank .png</span> </span></p>
<p><em>Abbildung: Die Multi-Tenancy-Architektur für eine RAG-Wissensdatenbank im Unternehmen</em></p>
<p>Das obige Diagramm zeigt die Multi-Tenancy-Architektur eines Unternehmens-RAG-Systems.</p>
<ul>
<li><p><strong>Systemadministratoren</strong> beaufsichtigen das RAG-System, verwalten die Ressourcenzuweisung, weisen Datenbanken zu, ordnen sie Ressourcengruppen zu und stellen die Skalierbarkeit sicher. Sie verwalten die physische Infrastruktur, wie im Diagramm dargestellt, wo jede Ressourcengruppe (z.B. Ressourcengruppe 1, 2 und 3) physischen Servern (Abfrageknoten) zugeordnet ist.</p></li>
<li><p><strong>Die Tenants (Datenbankbesitzer und -entwickler)</strong> verwalten die Wissensdatenbank und bearbeiten sie auf der Grundlage der von den Benutzern erstellten Q&amp;A-Daten, wie im Diagramm dargestellt. Verschiedene Datenbanken (Datenbank X, Y, Z) enthalten Sammlungen mit unterschiedlichen Inhalten der Wissensdatenbank (Sammlung A, B, usw.).</p></li>
<li><p><strong>Die Endbenutzer</strong> interagieren mit dem System auf rein lesende Weise über das LLM. Wenn sie das System abfragen, werden ihre Fragen in der separaten Q&amp;A-Datentabelle (einer separaten Datenbank) protokolliert, wodurch kontinuierlich wertvolle Daten in das System zurückfließen.</p></li>
</ul>
<p>Dieses Design stellt sicher, dass jede Prozessebene - von der Benutzerinteraktion bis zur Systemverwaltung - nahtlos funktioniert und dem Unternehmen hilft, eine robuste und sich ständig verbessernde Wissensbasis aufzubauen.</p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Blog haben wir untersucht, wie <a href="https://milvus.io/docs/multi_tenancy.md"><strong>Multi-Tenancy-Frameworks</strong></a> eine entscheidende Rolle für die Skalierbarkeit, Sicherheit und Leistung von RAG-gestützten Wissensdatenbanken spielen. Durch die Isolierung von Daten und Ressourcen für verschiedene Mandanten können Unternehmen den Datenschutz, die Einhaltung von Vorschriften und eine optimierte Ressourcenzuweisung in einer gemeinsam genutzten Infrastruktur sicherstellen. <a href="https://milvus.io/docs/overview.md">Milvus</a> mit seinen flexiblen Multi-Tenancy-Strategien ermöglicht es Unternehmen, den richtigen Grad der Datenisolierung zu wählen - von der Datenbankebene bis zur Partitionsebene - je nach ihren spezifischen Anforderungen. Die Wahl des richtigen Multi-Tenancy-Ansatzes stellt sicher, dass Unternehmen ihren Mietern maßgeschneiderte Dienste anbieten können, selbst wenn sie mit unterschiedlichen Daten und Workloads zu tun haben.</p>
<p>Wenn Unternehmen die hier beschriebenen Best Practices befolgen, können sie effektiv mandantenfähige RAG-Systeme entwerfen und verwalten, die nicht nur ein hervorragendes Benutzererlebnis bieten, sondern auch mühelos skalierbar sind, wenn die Geschäftsanforderungen wachsen. Die Architektur von Milvus stellt sicher, dass Unternehmen ein hohes Maß an Isolierung, Sicherheit und Leistung aufrechterhalten können, was sie zu einer entscheidenden Komponente beim Aufbau von RAG-gestützten Wissensdatenbanken auf Unternehmensebene macht.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Bleiben Sie dran für weitere Einblicke in Multi-Tenancy RAG<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Blog haben wir erörtert, wie die Multi-Tenancy-Strategien von Milvus für die Verwaltung von Mandanten, aber nicht für die Verwaltung von Endbenutzern innerhalb dieser Mandanten konzipiert sind. Die Interaktionen der Endbenutzer finden in der Regel auf der Anwendungsebene statt, während die Vektordatenbank selbst nichts von diesen Benutzern weiß.</p>
<p>Sie fragen sich das vielleicht: <em>Wenn ich präzisere Antworten auf der Grundlage der Abfragehistorie eines jeden Endbenutzers geben möchte, muss Milvus dann nicht einen personalisierten Q&amp;A-Kontext für jeden Benutzer pflegen?</em></p>
<p>Das ist eine gute Frage, und die Antwort hängt wirklich vom Anwendungsfall ab. Bei einem On-Demand-Beratungsdienst zum Beispiel sind die Anfragen zufällig und das Hauptaugenmerk liegt auf der Qualität der Wissensdatenbank und nicht darauf, den historischen Kontext eines Benutzers zu verfolgen.</p>
<p>In anderen Fällen müssen RAG-Systeme jedoch kontextabhängig sein. Wenn dies erforderlich ist, muss Milvus mit der Anwendungsschicht zusammenarbeiten, um ein personalisiertes Gedächtnis für den Kontext jedes Benutzers zu erhalten. Dieses Design ist besonders wichtig für Anwendungen mit einer großen Anzahl von Endbenutzern, auf die wir in meinem nächsten Beitrag näher eingehen werden. Bleiben Sie dran für weitere Einblicke!</p>
