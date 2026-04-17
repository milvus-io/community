---
id: building-video-search-system-with-milvus.md
title: System-Übersicht
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Videos nach Bild mit Milvus suchen
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 Schritte zum Aufbau eines Videosuchsystems</custom-h1><p>Wie der Name schon sagt, ist die Suche nach Videos anhand von Bildern ein Prozess, bei dem aus dem Repository Videos abgerufen werden, die ähnliche Bilder wie das Eingabebild enthalten. Einer der wichtigsten Schritte ist die Umwandlung von Videos in Einbettungen, d. h. die Extraktion der Schlüsselbilder und die Umwandlung ihrer Merkmale in Vektoren. Einige neugierige Leser werden sich nun fragen, worin der Unterschied zwischen der Suche nach einem Video nach Bild und der Suche nach einem Bild nach Bild besteht? Tatsächlich ist die Suche nach Schlüsselbildern in Videos gleichbedeutend mit der Suche nach einem Bild nach Bild.</p>
<p>Wenn Sie daran interessiert sind, können Sie sich auf unseren früheren Artikel <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Aufbau eines inhaltsbasierten Bildabrufsystems</a> beziehen.</p>
<h2 id="System-overview" class="common-anchor-header">System-Übersicht<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Das folgende Diagramm veranschaulicht den typischen Arbeitsablauf eines solchen Videosuchsystems.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-suchsystem-workflow.png</span> </span></p>
<p>Beim Importieren von Videos verwenden wir die OpenCV-Bibliothek, um jedes Video in Einzelbilder zu zerlegen, Vektoren der Schlüsselbilder mit dem Bildextraktionsmodell VGG zu extrahieren und die extrahierten Vektoren (Einbettungen) in Milvus einzufügen. Wir verwenden Minio zum Speichern der Originalvideos und Redis zum Speichern der Korrelationen zwischen Videos und Vektoren.</p>
<p>Bei der Suche nach Videos verwenden wir dasselbe VGG-Modell, um das Eingabebild in einen Merkmalsvektor umzuwandeln und diesen in Milvus einzufügen, um Vektoren mit der größten Ähnlichkeit zu finden. Anschließend ruft das System die entsprechenden Videos über die Schnittstelle von Minio entsprechend den Korrelationen in Redis ab.</p>
<h2 id="Data-preparation" class="common-anchor-header">Aufbereitung der Daten<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Artikel verwenden wir etwa 100.000 GIF-Dateien von Tumblr als Beispieldatensatz für den Aufbau einer End-to-End-Lösung für die Suche nach Videos. Sie können auch Ihre eigenen Video-Repositories verwenden.</p>
<h2 id="Deployment" class="common-anchor-header">Bereitstellung<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Code für die Erstellung des Videoabrufsystems in diesem Artikel befindet sich auf GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Schritt 1: Erstellen von Docker-Images.</h3><p>Das Videoabrufsystem benötigt Milvus v0.7.1 Docker, Redis Docker, Minio Docker, das Front-End Interface Docker und das Back-End API Docker. Sie müssen den Front-End-Interface-Docker und den Back-End-API-Docker selbst erstellen, während Sie die anderen drei Docker direkt von Docker Hub beziehen können.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Schritt 2: Konfigurieren Sie die Umgebung.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier verwenden wir docker-compose.yml, um die oben erwähnten fünf Container zu verwalten. Die Konfiguration von docker-compose.yml finden Sie in der folgenden Tabelle:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>Die IP-Adresse 192.168.1.38 in der obigen Tabelle ist die Serveradresse, die speziell für die Erstellung des Videoabrufsystems in diesem Artikel verwendet wird. Sie müssen sie auf Ihre Serveradresse aktualisieren.</p>
<p>Sie müssen manuell Speicherverzeichnisse für Milvus, Redis und Minio erstellen und dann die entsprechenden Pfade in docker-compose.yml hinzufügen. In diesem Beispiel haben wir die folgenden Verzeichnisse erstellt:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Sie können Milvus, Redis und Minio in docker-compose.yml wie folgt konfigurieren:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-konfigurieren-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Schritt 3: Starten Sie das System.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Verwenden Sie die geänderte Datei docker-compose.yml, um die fünf Docker-Container zu starten, die im Videoabrufsystem verwendet werden sollen:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Anschließend können Sie docker-compose ps ausführen, um zu überprüfen, ob die fünf Docker-Container ordnungsgemäß gestartet wurden. Der folgende Screenshot zeigt eine typische Oberfläche nach einem erfolgreichen Start.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>Jetzt haben Sie erfolgreich ein Videosuchsystem erstellt, obwohl die Datenbank keine Videos enthält.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Schritt 4: Videos importieren.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Deploy-Verzeichnis des System-Repositorys liegt import_data.py, das Skript zum Importieren von Videos. Um das Skript auszuführen, müssen Sie nur den Pfad zu den Videodateien und das Importintervall aktualisieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-pfad-video.png</span> </span></p>
<p>daten_pfad: Der Pfad zu den zu importierenden Videos.</p>
<p>time.sleep(0.5): Das Intervall, in dem das System Videos importiert. Der Server, den wir zum Aufbau des Videosuchsystems verwenden, hat 96 CPU-Kerne. Es wird daher empfohlen, das Intervall auf 0,5 Sekunden festzulegen. Setzen Sie das Intervall auf einen größeren Wert, wenn Ihr Server über weniger CPU-Kerne verfügt. Andernfalls wird der Importprozess die CPU belasten und Zombieprozesse erzeugen.</p>
<p>Führen Sie import_data.py aus, um Videos zu importieren.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Sobald die Videos importiert sind, haben Sie Ihr eigenes Videosuchsystem!</p>
<h2 id="Interface-display" class="common-anchor-header">Anzeige der Schnittstelle<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Öffnen Sie Ihren Browser und geben Sie 192.168.1.38:8001 ein, um die Schnittstelle des Videosuchsystems wie unten gezeigt zu sehen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-suche-schnittstelle.png</span> </span></p>
<p>Schalten Sie den Zahnradschalter oben rechts um, um alle Videos im Repository anzuzeigen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-alle-videos-ansehen-repository.png</span> </span></p>
<p>Klicken Sie auf das Hochladefeld oben links, um ein Zielbild einzugeben. Wie unten gezeigt, gibt das System Videos mit den ähnlichsten Bildern zurück.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-genuss-empfehlungssystem-katzen.png</span> </span></p>
<p>Und nun viel Spaß mit unserem Videosuchsystem!</p>
<h2 id="Build-your-own" class="common-anchor-header">Bauen Sie Ihr eigenes<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Artikel haben wir Milvus verwendet, um ein System für die Suche nach Videos anhand von Bildern zu erstellen. Dies ist ein Beispiel für die Anwendung von Milvus bei der Verarbeitung unstrukturierter Daten.</p>
<p>Milvus ist mit mehreren Deep-Learning-Frameworks kompatibel und ermöglicht die Suche in Millisekunden nach Vektoren im Milliardenbereich. Sie können Milvus gerne zu weiteren KI-Szenarien mitnehmen: https://github.com/milvus-io/milvus.</p>
<p>Seien Sie kein Fremder, folgen Sie uns auf <a href="https://twitter.com/milvusio/">Twitter</a> oder schließen Sie sich uns auf <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> an! 👇🏻</p>
