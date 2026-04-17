---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: >-
  Comment configurer OpenTelemetry avec Milvus pour un suivi des requêtes de
  bout en bout ?
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  Surveiller les performances de la base de données vectorielle Milvus avec le
  traçage OpenTelemetry. Tutoriel complet avec l'installation de Docker, le
  client Python, la visualisation Jaeger et des conseils de débogage.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la création d'applications <a href="https://milvus.io/blog/what-is-a-vector-database.md">basées</a> sur l'IA avec des <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de données vectorielles</a>, la compréhension des performances du système devient cruciale à mesure que l'application évolue. Une seule requête de recherche peut déclencher plusieurs opérations internes - indexation vectorielle, calculs de similarité et récupération de données - à travers différents composants. En l'absence d'une observabilité appropriée, le diagnostic des ralentissements ou des défaillances revient à trouver une aiguille dans une botte de foin.</p>
<p>Le<strong>traçage distribué</strong> résout ce problème en suivant les requêtes au fur et à mesure qu'elles circulent dans votre système, ce qui vous donne une image complète de ce qui se passe sous le capot.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL</strong></a> ) est un cadre d'observabilité open-source soutenu par la <a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a> qui vous aide à collecter les traces, les métriques et les journaux de vos applications. Il est indépendant des fournisseurs, largement adopté et fonctionne de manière transparente avec les outils de surveillance les plus courants.</p>
<p>Dans ce guide, nous allons vous montrer comment ajouter un traçage de bout en bout à <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielle haute performance conçue pour les applications d'intelligence artificielle. Vous apprendrez à tout suivre, des requêtes des clients aux opérations internes de la base de données, ce qui facilitera l'optimisation des performances et le débogage.</p>
<p>Nous utiliserons également <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> pour visualiser les données de traçage, ce qui vous permettra de mieux comprendre les opérations de votre base de données vectorielle.</p>
<h2 id="What-Well-Build" class="common-anchor-header">Ce que nous allons construire<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>À la fin de ce tutoriel, vous disposerez d'un pipeline de traçage complet composé de :</p>
<ol>
<li><p><strong>Base de données vectorielles Milvus</strong> avec le traçage OpenTelemetry activé</p></li>
<li><p><strong>Jaeger</strong> pour la visualisation et l'analyse des traces</p></li>
<li><p><strong>Un client Python</strong> qui trace automatiquement toutes les opérations de Milvus</p></li>
<li><p><strong>Visibilité de bout en bout</strong>, depuis les demandes des clients jusqu'aux opérations de la base de données</p></li>
</ol>
<p>Temps d'installation estimé : 15-20 minutes</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">Démarrage rapide (5 minutes)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous voulez d'abord le voir fonctionner ? Voici le chemin le plus rapide :</p>
<ol>
<li>Clonez le référentiel de démonstration :</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Démarrez les services :</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Attendez 30 secondes, puis vérifiez l'interface utilisateur de Jaeger : <code translate="no">http://localhost:16686</code></p></li>
<li><p>Exécutez l'exemple Python :</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Rafraîchissez Jaeger et recherchez les traces des services <code translate="no">standalone</code> (Milvus) et <code translate="no">milvus-client</code>.</li>
</ol>
<p>Si vous voyez des traces apparaître, tout fonctionne ! Comprenons maintenant comment tout cela s'articule.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Configuration de l'environnement<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici ce dont vous aurez besoin :</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (base de données vectorielle)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (visualisation des traces)</p></li>
<li><p><strong>Python 3.7+</strong> (développement client)</p></li>
<li><p><strong>Docker et Docker Compose</strong> (orchestration de conteneurs)</p></li>
</ul>
<p>Ces versions ont été testées ensemble, mais les versions plus récentes devraient également fonctionner correctement.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Configuration de Milvus et Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous allons utiliser Docker Compose pour faire fonctionner les deux services avec un réseau et une configuration appropriés.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Configuration de Docker Compose</h3><p>Créez un fichier <code translate="no">docker-compose.yaml</code>:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Remarque :</strong> des exemples de fichiers de configuration <code translate="no">embedEtcd.yaml</code> et <code translate="no">milvus.yaml</code> sont disponibles à l'adresse <a href="https://github.com/topikachu/milvus-py-otel">suivante : https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Configuration du traçage Milvus</h3><p>Créez <code translate="no">configs/milvus.yaml</code> avec la configuration de traçage :</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>La configuration est expliquée :</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> trace chaque requête (utile pour le développement, mais utilisez 0.1 ou moins en production)</p></li>
<li><p><code translate="no">secure: false</code> désactive TLS (active en production)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> utilise le nom du service Docker pour la communication interne</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">Démarrage des services</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Vérification de la livraison des traces de Milvus à Jaeger</h3><p>Une fois que les services sont en cours d'exécution, vous pouvez vérifier si les données de trace sont émises par le Milvus autonome et reçues par Jaeger.</p>
<ul>
<li><p>Ouvrez votre navigateur et visitez l'interface utilisateur de Jaeger à l'adresse : <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>Dans le panneau de <strong>recherche</strong> (en haut à gauche), choisissez le menu déroulant <strong>Service</strong> et sélectionnez <code translate="no">standalone</code>. Si vous voyez <code translate="no">standalone</code> dans la liste des services, cela signifie que la configuration OpenTelemetry intégrée de Milvus fonctionne et a transmis avec succès des données de traçage à Jaeger.</p></li>
<li><p>Cliquez sur <strong>Trouver des traces</strong> pour explorer les chaînes de traces générées par les composants internes de Milvus (tels que les interactions gRPC entre les modules).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">Si les données de trace ne s'affichent pas :</h3><ul>
<li><p>Vérifiez que le bloc <code translate="no">trace</code> dans <code translate="no">milvus.yaml</code> est configuré correctement et que Jaeger fonctionne sans problème.</p></li>
<li><p>Examinez les journaux du conteneur Milvus pour voir s'il y a des erreurs liées à l'initialisation de la trace.</p></li>
<li><p>Attendez quelques secondes et actualisez l'interface utilisateur de Jaeger ; le rapport de trace peut subir un court délai.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Configuration du client Python et dépendances<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>Configurons maintenant le client Python pour tracer automatiquement toutes les opérations Milvus.</p>
<p>Tout d'abord, créez un fichier <code translate="no">requirements.txt</code>:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>Installez ensuite les dépendances via :</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>Cela garantit que votre environnement Python est prêt à tracer les appels gRPC effectués vers le backend Milvus.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Initialisation d'OpenTelemetry dans Python<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant, configurons le traçage dans votre application Python. Cet extrait configure OTEL avec l'instrumentation gRPC et prépare un traceur.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>Ici, <code translate="no">GrpcInstrumentorClient()</code> s'accroche à la pile gRPC sous-jacente de sorte que vous n'avez pas besoin de modifier manuellement le code client pour l'instrumentation. Le site <code translate="no">OTLPSpanExporter()</code> est configuré pour envoyer les données de traçage à votre instance locale de Jaeger.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">Exemple complet de Milvus Python avec traçage<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>Créons maintenant un exemple complet qui démontre le traçage avec des opérations Milvus réalistes :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">Visualisation de la sortie de la trace<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que votre client Python a envoyé des données de traçage, retournez à Jaeger : <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>Sélectionnez le service <code translate="no">milvus-client</code> pour afficher les plages de traçage qui correspondent aux opérations Milvus de votre client Python. Il est ainsi beaucoup plus facile d'analyser les performances et de suivre les interactions au-delà des limites du système.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">Exemples dans d'autres langues<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre Python, vous pouvez mettre en œuvre le traçage Milvus dans d'autres langages :</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>: Utilisez l'agent Java OpenTelemetry pour une instrumentation en code zéro <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: Exploitez le SDK Go d'OpenTelemetry pour une intégration native 👉Node.<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>js</strong></a>: Auto-instrumenter les appels gRPC avec le SDK JavaScript</p>
<p>Chaque exemple suit des schémas similaires mais utilise des bibliothèques OpenTelemetry spécifiques au langage.</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous avez réussi à mettre en œuvre le traçage de bout en bout pour les opérations Milvus ! Voici ce que vous avez accompli :</p>
<ul>
<li><p>✅ <strong>Infrastructure</strong>: Configurer Milvus et Jaeger avec un réseau approprié</p></li>
<li><p><strong>Traçage côté serveur</strong>: Configurer Milvus pour exporter automatiquement les traces</p></li>
<li><p><strong>Traçage côté client</strong>: Instrumenté le client Python avec OpenTelemetry</p></li>
<li><p><strong>Visualisation</strong>: Utilisation de Jaeger pour analyser les performances du système</p></li>
<li><p><strong>Préparation à la production</strong>: Apprentissage des meilleures pratiques de configuration</p></li>
</ul>
<p>Tout cela fonctionne sans aucune modification du code source du SDK Milvus. Il suffit de quelques paramètres de configuration et votre pipeline de traçage est en ligne : simple, efficace et prêt pour la production.</p>
<p>Vous pouvez aller plus loin en intégrant des journaux et des mesures afin de créer une solution de surveillance complète pour le déploiement de votre base de données vectorielle native AI.</p>
<h2 id="Learn-More" class="common-anchor-header">En savoir plus<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Documentation Milvus <a href="https://milvus.io/docs">: https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry pour Python <a href="https://opentelemetry.io/docs/instrumentation/python/">: https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Documentation Jaeger <a href="https://www.jaegertracing.io/docs/">: https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Démonstration d'intégration de Milvus OpenTelemetry (Python) <a href="https://github.com/topikachu/milvus-py-otel">: https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
