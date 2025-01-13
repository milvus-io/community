---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Technische Freigabe: Konfigurationsänderungen auf Milvus 2.0 mit Docker
  Compose anwenden
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: 'Erfahren Sie, wie Sie Konfigurationsänderungen an Milvus 2.0 vornehmen'
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Technische Freigabe: Anwendung von Konfigurationsänderungen auf Milvus 2.0 mit Docker Compose</custom-h1><p><em>Jingjing Jia, Zilliz Data Engineer, hat einen Abschluss in Informatik von der Xi'an Jiaotong Universität. Nachdem sie zu Zilliz gekommen ist, arbeitet sie hauptsächlich an der Vorverarbeitung von Daten, dem Einsatz von KI-Modellen, der Erforschung von Milvus-bezogenen Technologien und der Unterstützung von Community-Benutzern bei der Implementierung von Anwendungsszenarien. Sie ist sehr geduldig, kommuniziert gerne mit Community-Partnern und hört gerne Musik und schaut Anime.</em></p>
<p>Als regelmäßiger Nutzer von Milvus war ich sehr gespannt auf die neu veröffentlichte Version 2.0 RC von Milvus. Laut der Einführung auf der offiziellen Website scheint Milvus 2.0 seine Vorgänger bei weitem zu übertreffen. Ich war so gespannt darauf, es selbst auszuprobieren.</p>
<p>Und das habe ich auch getan.  Doch als ich Milvus 2.0 in die Hände bekam, musste ich feststellen, dass ich die Konfigurationsdatei in Milvus 2.0 nicht so einfach ändern konnte wie in Milvus 1.1.1. Ich konnte die Konfigurationsdatei innerhalb des Docker-Containers von Milvus 2.0, der mit Docker Compose gestartet wurde, nicht ändern, und selbst eine erzwungene Änderung würde nicht wirksam werden. Später erfuhr ich, dass Milvus 2.0 RC nicht in der Lage war, Änderungen an der Konfigurationsdatei nach der Installation zu erkennen. In einer zukünftigen stabilen Version wird dieses Problem behoben werden.</p>
<p>Nachdem ich verschiedene Ansätze ausprobiert habe, habe ich einen zuverlässigen Weg gefunden, um Änderungen an den Konfigurationsdateien für Milvus 2.0 standalone &amp; cluster zu übernehmen, und hier ist, wie.</p>
<p>Beachten Sie, dass alle Änderungen an der Konfiguration vor dem Neustart von Milvus mit Docker Compose vorgenommen werden müssen.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Ändern der Konfigurationsdatei in Milvus Standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Zunächst müssen Sie eine Kopie der Datei <strong>milvus.yaml</strong> auf Ihr lokales Gerät <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">herunterladen</a>.</p>
<p>Dann können Sie die Konfigurationen in der Datei ändern. Sie können zum Beispiel das Protokollformat ändern: <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Sobald die Datei <strong>milvus.yaml</strong> geändert wurde, müssen Sie auch die Datei <strong>docker-compose.yaml</strong> für Standalone <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">herunterladen</a> und ändern, indem Sie den lokalen Pfad zu milvus.yaml auf den entsprechenden Pfad des Docker-Containers zur Konfigurationsdatei <code translate="no">/milvus/configs/milvus.yaml</code> unter dem Abschnitt <code translate="no">volumes</code> abbilden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Starten Sie abschließend Milvus standalone mit <code translate="no">docker-compose up -d</code> und überprüfen Sie, ob die Änderungen erfolgreich waren. Führen Sie zum Beispiel <code translate="no">docker logs</code> aus, um das Protokollformat zu überprüfen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Ändern der Konfigurationsdatei im Milvus-Cluster<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">Laden Sie</a> zunächst die Datei <strong>milvus.yaml</strong> <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">herunter</a> und passen Sie sie an Ihre Bedürfnisse an.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Dann müssen Sie die Clusterdatei <strong>docker-compose.yml</strong> <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">herunterladen</a> und ändern, indem Sie den lokalen Pfad zu <strong>milvus.yaml</strong> auf den entsprechenden Pfad zu den Konfigurationsdateien in allen Komponenten abbilden, d. h. Root-Koordinate, Datenkoordinate, Datenknoten, Abfragekoordinate, Abfrageknoten, Indexkoordinate, Indexknoten und Proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Abschließend können Sie den Milvus-Cluster mit <code translate="no">docker-compose up -d</code> starten und überprüfen, ob die Änderungen erfolgreich waren.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Ändern Sie den Pfad der Protokolldatei in der Konfigurationsdatei<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">Laden Sie</a> zunächst die Datei <strong>milvus.yaml</strong> <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">herunter</a> und ändern Sie den Abschnitt <code translate="no">rootPath</code> in das Verzeichnis, in dem Sie die Protokolldateien im Docker-Container speichern möchten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>Danach laden Sie die entsprechende Datei <strong>docker-compose.yml</strong> für Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a> oder <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a> herunter.</p>
<p>Für Standalone müssen Sie den lokalen Pfad zu <strong>milvus.yaml</strong> auf den entsprechenden Docker-Container-Pfad zur Konfigurationsdatei <code translate="no">/milvus/configs/milvus.yaml</code> abbilden und das lokale Protokolldateiverzeichnis auf das zuvor erstellte Docker-Container-Verzeichnis abbilden.</p>
<p>Bei Clustern müssen Sie beide Pfade in jeder Komponente zuordnen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Starten Sie abschließend Milvus standalone oder cluster mit <code translate="no">docker-compose up -d</code> und überprüfen Sie die Protokolldateien, um zu sehen, ob die Änderung erfolgreich war.</p>
