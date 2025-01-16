---
id: deep-dive-2-milvus-sdk-and-api.md
title: Eine Einführung in Milvus Python SDK und API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Erfahren Sie, wie SDKs mit Milvus interagieren und warum eine ORM-ähnliche API
  Ihnen hilft, Milvus besser zu verwalten.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<p>Von <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Hintergrund<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Die folgende Illustration zeigt die Interaktion zwischen SDKs und Milvus über gRPC. Stellen Sie sich vor, dass Milvus eine Blackbox ist. Protokollpuffer werden verwendet, um die Schnittstellen des Servers und die Struktur der von ihnen übertragenen Informationen zu definieren. Daher werden alle Operationen in der Blackbox Milvus durch die Protokoll-API definiert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interaktion</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus-Protokoll-API<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Protocol API besteht aus <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code> und <code translate="no">schema.proto</code>, die Protokollpufferdateien mit dem Suffix <code translate="no">.proto</code> sind. Um einen ordnungsgemäßen Betrieb zu gewährleisten, müssen SDKs mit Milvus über diese Protocol Buffers-Dateien interagieren.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> ist die wichtigste Komponente der Milvus Protocol API, da sie die <code translate="no">MilvusService</code> definiert, die wiederum alle RPC-Schnittstellen von Milvus definiert.</p>
<p>Das folgende Codebeispiel zeigt die Schnittstelle <code translate="no">CreatePartitionRequest</code>. Sie hat zwei Hauptparameter vom Typ String <code translate="no">collection_name</code> und <code translate="no">partition_name</code>, auf deren Grundlage Sie eine Anfrage zur Erstellung einer Partition starten können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Ein Beispiel für das Protokoll finden Sie im <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub Repository</a> in Zeile 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Beispiel</span> </span></p>
<p>Die Definition von <code translate="no">CreatePartitionRequest</code> finden Sie hier.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Definition</span> </span></p>
<p>Mitwirkende, die ein Feature von Milvus oder ein SDK in einer anderen Programmiersprache entwickeln wollen, können alle Schnittstellen finden, die Milvus über RPC anbietet.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> definiert die allgemeinen Informationstypen, einschließlich <code translate="no">ErrorCode</code> und <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> definiert das Schema in den Parametern. Das folgende Codebeispiel ist ein Beispiel für <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code> und <code translate="no">schema.proto</code> bilden zusammen die API von Milvus und repräsentieren alle Operationen, die über RPC aufgerufen werden können.</p>
<p>Wenn Sie den Quellcode genau betrachten, werden Sie feststellen, dass Schnittstellen wie <code translate="no">create_index</code> mehrere RPC-Schnittstellen wie <code translate="no">describe_collection</code> und <code translate="no">describe_index</code> aufrufen, wenn sie aufgerufen werden. Viele der äußeren Schnittstellen von Milvus sind eine Kombination aus mehreren RPC-Schnittstellen.</p>
<p>Wenn Sie das Verhalten von RPC verstanden haben, können Sie durch Kombination neue Funktionen für Milvus entwickeln. Sie sind herzlich eingeladen, Ihre Phantasie und Kreativität zu nutzen und zur Milvus-Gemeinschaft beizutragen.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Objekt-relationales Mapping (ORM)</h3><p>Um es kurz zu machen: Objekt-relationales Mapping (ORM) bedeutet, dass, wenn Sie auf einem lokalen Objekt operieren, diese Operationen das entsprechende Objekt auf dem Server beeinflussen. Die ORM-ähnliche API von PyMilvus weist die folgenden Merkmale auf:</p>
<ol>
<li>Sie operiert direkt auf Objekten.</li>
<li>Sie isoliert Dienstlogik und Datenzugriffsdetails.</li>
<li>Sie verbirgt die Komplexität der Implementierung, und Sie können dieselben Skripte in verschiedenen Milvus-Instanzen ausführen, unabhängig von deren Bereitstellungsansätzen oder Implementierung.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORM-ähnliche API</h3><p>Einer der Kernpunkte der ORM-ähnlichen API liegt in der Steuerung der Milvus-Verbindung. So können Sie beispielsweise Aliase für mehrere Milvus-Server angeben und die Verbindung zu diesen Servern nur über ihre Aliase herstellen oder trennen. Sie können sogar die lokale Serveradresse löschen und bestimmte Objekte über eine bestimmte Verbindung genau steuern.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Verbindung kontrollieren</span> </span></p>
<p>Ein weiteres Merkmal der ORM-artigen API ist, dass nach der Abstraktion alle Operationen direkt an Objekten durchgeführt werden können, einschließlich Sammlung, Partition und Index.</p>
<p>Sie können ein Sammlungsobjekt abstrahieren, indem Sie ein bestehendes Objekt abrufen oder ein neues Objekt erstellen. Sie können auch eine Milvus-Verbindung zu bestimmten Objekten zuweisen, indem Sie einen Verbindungsalias verwenden, so dass Sie lokal auf diesen Objekten arbeiten können.</p>
<p>Um ein Partitionsobjekt zu erstellen, können Sie es entweder mit seinem übergeordneten Sammlungsobjekt erstellen, oder Sie können es genau wie bei der Erstellung eines Sammlungsobjekts erstellen. Diese Methoden können auch auf ein Indexobjekt angewendet werden.</p>
<p>Wenn diese Partitions- oder Indexobjekte existieren, können Sie sie über ihr übergeordnetes Sammlungsobjekt abrufen.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Serie<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine eingehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
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
