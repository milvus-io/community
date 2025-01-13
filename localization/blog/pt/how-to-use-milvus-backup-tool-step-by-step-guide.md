---
id: how-to-use-milvus-backup-tool-step-by-step-guide.md
title: 'Como utilizar a ferramenta de cópia de segurança Milvus: Um guia passo-a-passo'
author: Michael Mo
date: 2024-09-27T00:00:00.000Z
desc: >-
  Este guia irá guiá-lo através do processo de utilização da Cópia de Segurança
  Milvus, assegurando que pode lidar com confiança com as suas necessidades de
  cópia de segurança.
cover: >-
  assets.zilliz.com/How_to_Use_the_Milvus_Backup_Tool_A_Step_by_Step_Guide_411029fa4b.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, Backup and restore'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-use-milvus-backup-tool-step-by-step-guide.md'
---
<p><a href="https://milvus.io/docs/overview.md"><strong>O Milvus</strong></a> é uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> de código aberto, de elevado desempenho e altamente escalável, que pode armazenar, indexar e pesquisar <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a> à escala de milhares de milhões através de <a href="https://zilliz.com/glossary/vector-embeddings">incorporação de vectores</a> de elevada dimensão. É perfeita para a criação de aplicações modernas de IA, como a geração aumentada de recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), a pesquisa semântica, <a href="https://zilliz.com/blog/multimodal-rag-expanding-beyond-text-for-smarter-ai">a pesquisa multimodal</a> e os sistemas de recomendação. O Milvus funciona de forma eficiente em vários <a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">ambientes</a>, desde computadores portáteis a sistemas distribuídos em grande escala. Está disponível como software de código aberto e como um serviço de nuvem.</p>
<p><a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>O Milvus Backup</strong></a> é uma ferramenta para efetuar cópias de segurança e restaurar dados do Milvus. Fornece CLI e API para acomodar diferentes cenários de aplicação. Este guia irá guiá-lo através do processo de utilização do Milvus Backup, assegurando que pode lidar com confiança com as suas necessidades de cópia de segurança.</p>
<h2 id="Preparation" class="common-anchor-header">Preparação<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de iniciar o processo de cópia de segurança ou de restauro, é necessário configurar o seu ambiente:</p>
<p><strong>1. Descarregue o binário mais recente</strong> das<a href="https://github.com/zilliztech/milvus-backup/releases"> versões do repositório Milvus-backup</a>. Selecione a versão apropriada para o seu sistema operativo:</p>
<ul>
<li><p>Para macOS: <code translate="no">milvus-backup_Darwin_arm64.tar.gz</code> ou <code translate="no">milvus-backup_Darwin_x86_64.tar.gz</code></p></li>
<li><p>Para Linux: <code translate="no">milvus-backup_Linux_arm64.tar.gz</code> ou <code translate="no">milvus-backup_Linux_x86_64.tar.gz</code></p></li>
</ul>
<p><strong>2. Descarregue o ficheiro de configuração a</strong> partir do <a href="https://github.com/zilliztech/milvus-backup/blob/main/configs/backup.yaml">GitHub</a>.</p>
<p><strong>3. Extraia o arquivo tar</strong> para o diretório de sua preferência e coloque o <code translate="no">backup.yaml</code> no diretório <code translate="no">configs/</code> dentro da mesma pasta extraída. Certifique-se de que a estrutura de diretórios seja exibida da seguinte forma:</p>
<pre><code translate="no">├── configs
│   └── backup.yaml
├── milvus-backup
└── README.md
<button class="copy-code-btn"></button></code></pre>
<h2 id="Command-Overview" class="common-anchor-header">Visão geral do comando<button data-href="#Command-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Navegue até o seu terminal e familiarize-se com os comandos da ferramenta:</p>
<p><strong>1. Ajuda geral</strong>: Digite <code translate="no">milvus-backup help</code> para visualizar os comandos e sinalizadores disponíveis.</p>
<pre><code translate="no">milvus-backup <span class="hljs-keyword">is</span> a backup&amp;restore tool <span class="hljs-keyword">for</span> milvus.

Usage:
 milvus-backup [flags]
 milvus-backup [command]

Available Commands:
 check       check <span class="hljs-keyword">if</span> the connects <span class="hljs-keyword">is</span> right.
 create      create subcommand create a backup.
 delete      delete subcommand delete backup <span class="hljs-keyword">by</span> name.
 <span class="hljs-keyword">get</span>         <span class="hljs-keyword">get</span> subcommand <span class="hljs-keyword">get</span> backup <span class="hljs-keyword">by</span> name.
 help        Help about any command
 list        list subcommand shows all backup <span class="hljs-keyword">in</span> the cluster.
 restore     restore subcommand restore a backup.
 server      server subcommand start milvus-backup RESTAPI server.

Flags:
     --<span class="hljs-function">config <span class="hljs-built_in">string</span>   config YAML <span class="hljs-keyword">file</span> of <span class="hljs-title">milvus</span> (<span class="hljs-params"><span class="hljs-literal">default</span> <span class="hljs-string">&quot;backup.yaml&quot;</span></span>)
 -h, --help            help <span class="hljs-keyword">for</span> milvus-backup

Use &quot;milvus-backup [command] --help&quot; <span class="hljs-keyword">for</span> more information about a command.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>2. Criar uma cópia de segurança</strong>: Obtenha ajuda específica para criar uma cópia de segurança, digitando <code translate="no">milvus-backup create --help</code>.</p>
<pre><code translate="no">Usage:
 milvus-backup create [flags]

Flags:
 -n, --name <span class="hljs-built_in">string</span>                   backup name, <span class="hljs-keyword">if</span> unset will generate a name automatically
 -c, --colls <span class="hljs-built_in">string</span>                  collectionNames to backup, use <span class="hljs-string">&#x27;,&#x27;</span> to connect multiple collections
 -d, --databases <span class="hljs-built_in">string</span>              databases to backup
 -a, --database_collections <span class="hljs-built_in">string</span>   databases <span class="hljs-keyword">and</span> collections to backup, json format: {<span class="hljs-string">&quot;db1&quot;</span>:[<span class="hljs-string">&quot;c1&quot;</span>, <span class="hljs-string">&quot;c2&quot;</span>],<span class="hljs-string">&quot;db2&quot;</span>:[]}
 -f, --force                         force backup, will skip flush, should make sure data has been stored <span class="hljs-keyword">into</span> disk <span class="hljs-keyword">when</span> <span class="hljs-keyword">using</span> it
     --meta_only                     only backup collection meta instead of data
 -h, --help                          help <span class="hljs-keyword">for</span> create
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Restaurar um backup</strong>: Para saber como restaurar uma cópia de segurança, utilize <code translate="no">milvus-backup restore --help</code>.</p>
<pre><code translate="no">Usage:
 milvus-backup restore [flags]

Flags:
 -n, --name <span class="hljs-built_in">string</span>                   backup name to restore
 -c, --collections <span class="hljs-built_in">string</span>            collectionNames to restore
 -s, --suffix <span class="hljs-built_in">string</span>                 <span class="hljs-keyword">add</span> a suffix to collection name to restore
 -r, --rename <span class="hljs-built_in">string</span>                 rename collections to <span class="hljs-keyword">new</span> names, format: db1.collection1:db2.collection1_new,db1.collection2:db2.collection2_new
 -d, --databases <span class="hljs-built_in">string</span>              databases to restore, <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">set</span>, restore all databases
 -a, --database_collections <span class="hljs-built_in">string</span>   databases <span class="hljs-keyword">and</span> collections to restore, json format: {<span class="hljs-string">&quot;db1&quot;</span>:[<span class="hljs-string">&quot;c1&quot;</span>, <span class="hljs-string">&quot;c2&quot;</span>],<span class="hljs-string">&quot;db2&quot;</span>:[]}
     --meta_only                     <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, restore meta only
     --restore_index                 <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, restore index
     --use_auto_index                <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, replace vector index <span class="hljs-keyword">with</span> autoindex
     --drop_exist_collection         <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, drop existing target collection before create
     --drop_exist_index              <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, drop existing index of target collection before create
     --skip_create_collection        <span class="hljs-keyword">if</span> <span class="hljs-literal">true</span>, will skip collection, use <span class="hljs-keyword">when</span> collection exist, restore index <span class="hljs-keyword">or</span> data
 -h, --help                          help <span class="hljs-keyword">for</span> restore
<button class="copy-code-btn"></button></code></pre>
<h2 id="BackupRestore-Use-Cases" class="common-anchor-header">Casos de uso de backup/restauração<button data-href="#BackupRestore-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Existem vários casos de uso em que a ferramenta milvus-backup pode ser aplicada de forma eficaz, dependendo de suas necessidades e configurações específicas:</p>
<ol>
<li><p><strong>Dentro de uma única instância do Milvus:</strong> Copiar uma coleção para uma nova coleção dentro do mesmo serviço Milvus.</p></li>
<li><p><strong>Entre instâncias Milvus num único S3 com um único Bucket:</strong> Transferir uma coleção entre instâncias do Milvus com caminhos de raiz diferentes, mas usando o mesmo bucket S3.</p></li>
<li><p><strong>Entre instâncias do Milvus em diferentes buckets do S3:</strong> Transferir uma coleção entre diferentes buckets S3 dentro do mesmo serviço S3.</p></li>
<li><p><strong>Entre diferentes serviços S3:</strong> Copiar uma coleção entre instâncias Milvus que estão a usar diferentes serviços S3.</p></li>
</ol>
<p>Vamos explorar cada caso de uso em detalhes.</p>
<h2 id="Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="common-anchor-header">Caso de uso 1: Backup e restauração dentro de uma instância Milvus<button data-href="#Use-Case-1-Backup-and-Restore-Within-One-Milvus-Instance" class="anchor-icon" translate="no">
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
    </button></h2><p>Efetuar uma cópia de segurança e restaurar uma coleção dentro da mesma instância Milvus. Suponha que uma coleção denominada "coll" é objeto de uma cópia de segurança e restaurada como "coll_bak" utilizando o mesmo contentor S3.</p>
<h3 id="Configuration" class="common-anchor-header">Configuração:</h3><ul>
<li><p><strong>O Milvus</strong> utiliza o <code translate="no">bucket_A</code> para armazenamento.</p></li>
<li><p><strong>Configuração do MinIO:</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-Workflow" class="common-anchor-header">Fluxo de trabalho de backup</h3><p>1. Configurar <code translate="no">backup.yaml</code> para apontar o Milvus e o MinIO para as localizações corretas.</p>
<pre><code translate="no"><span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
  backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. Crie um backup usando o comando.</p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p>Este comando coloca a cópia de segurança em <code translate="no">bucket_A/backup/my_backup</code>.</p>
<p>3. Restaurar a cópia de segurança para uma nova coleção.</p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>Isto restaura "coll" como "coll_bak" dentro da mesma instância do Milvus.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Within_One_Milvus_Instance_a232ee6e81.png" alt="Figure: The Backup and Restore Workflow Within One Milvus Instance" class="doc-image" id="figure:-the-backup-and-restore-workflow-within-one-milvus-instance" />
   <span>Figura: O fluxo de trabalho de backup e restauração dentro de uma instância do Milvus</span> </span></p>
<p>Figura: O fluxo de trabalho de backup e restauração dentro de uma instância Milvus</p>
<h2 id="Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="common-anchor-header">Caso de uso 2: Backup e restauração entre duas instâncias do Milvus que compartilham um bucket S3<button data-href="#Use-Case-2-Backup-and-Restore-Between-Two-Milvus-Instances-Sharing-One-S3-Bucket" class="anchor-icon" translate="no">
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
    </button></h2><p>Fazer backup de uma coleção de uma instância Milvus e restaurá-la para outra usando o mesmo bucket S3, mas com caminhos de raiz diferentes. Supondo que há uma coleção chamada "coll" no milvus_A, fazemos o backup e restauramos para uma nova coleção chamada "coll_bak" no milvus_B. As duas instâncias do Milvus partilham o mesmo bucket "bucket_A" como armazenamento, mas têm caminhos de raiz diferentes.</p>
<h3 id="Configuration" class="common-anchor-header">Configuração</h3><ul>
<li><p><strong>Milvus A</strong> utiliza <code translate="no">files_A</code> como caminho de raiz.</p></li>
<li><p><strong>Milvus B</strong> usa <code translate="no">files_B</code> como caminho de raiz.</p></li>
<li><p><strong>Configuração do MinIO para Milvus A:</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files_A <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Configuração MinIO para Milvus B:</strong></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files_B <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-Workflow" class="common-anchor-header">Fluxo de trabalho de cópia de segurança</h3><p><strong>1. Configuração de Backup para Milvus A</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: milvus_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files_A&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Executar o comando de backup:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Restaurar a configuração para Milvus B</strong></p>
<p>Modifique <code translate="no">backup.yaml</code> para apontar para o Milvus B e ajuste o caminho da raiz do MinIO:</p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  address: milvus_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files_B&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>4. Executar o comando de restauro:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Sharing_One_S3_Bucket_80f282a6f4.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Sharing One S3 Bucket" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-sharing-one-s3-bucket" />
   <span>Figura: O fluxo de trabalho de backup e restauração entre duas instâncias do Milvus que compartilham um bucket S3</span> </span></p>
<h2 id="Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="common-anchor-header">Caso de utilização 3: Cópia de segurança e restauro entre duas instâncias Milvus num S3, com diferentes buckets<button data-href="#Use-Case-3-Backup-and-Restore-Between-Two-Milvus-Instances-in-One-S3-Different-Buckets" class="anchor-icon" translate="no">
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
    </button></h2><p>Efetuar o backup de uma coleção a partir de uma instância Milvus (Milvus_A) e restaurá-la para outra instância Milvus (Milvus_B) no mesmo serviço S3, mas utilizando buckets diferentes.</p>
<h3 id="Configuration" class="common-anchor-header">Configuração:</h3><ul>
<li><p><strong>O Milvus</strong> usa o <code translate="no">bucket_A</code> para armazenamento.</p></li>
<li><p><strong>Configuração de MinIO para Milvus A:</strong></p></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Configuração do MinIO para o Milvus B:</strong></li>
</ul>
<pre><code translate="no">minio:
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_B <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Fluxo de trabalho de backup e restauração</h3><p><strong>1. Configuração de Backup para Milvus A</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Executar o comando de backup:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Restaurar a configuração do Milvus B</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
  backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>4. Executar o comando restore:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_in_One_S3_Different_Buckets_02895ffe18.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances in One S3, Different Buckets" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-in-one-s3,-different-buckets" />
   <span>Figura: O fluxo de trabalho de backup e restauração entre duas instâncias do Milvus em um S3, em diferentes buckets</span> </span></p>
<p>Figura: O fluxo de trabalho de backup e restauração entre duas instâncias do Milvus em um S3, em compartimentos diferentes</p>
<h2 id="Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="common-anchor-header">Caso de uso 4: Backup e restauração entre duas instâncias do Milvus em diferentes serviços S3<button data-href="#Use-Case-4-Backup-and-Restore-Between-Two-Milvus-Instances-Across-Different-S3-Services" class="anchor-icon" translate="no">
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
    </button></h2><p>Para facilitar a cópia de segurança de uma coleção denominada "coll" do Milvus_A utilizando um serviço S3 (MinIO_A) e restaurá-la no Milvus_B utilizando um serviço S3 diferente (MinIO_B), com cada instância a utilizar diferentes buckets de armazenamento.</p>
<h3 id="Configuration" class="common-anchor-header">Configuração</h3><ul>
<li><strong>Configuração do MinIO para o Milvus A:</strong></li>
</ul>
<pre><code translate="no">minio:
 address: minio_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_A <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Configuração do MinIO para o Milvus B</strong></li>
</ul>
<pre><code translate="no"> minio:
 address: minio_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span> <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 ssl:
   tlsCACert: /path/to/public.crt <span class="hljs-comment"># path to your CACert file, ignore when it is empty</span>
 bucketName: bucket_B <span class="hljs-comment"># Bucket name in MinIO/S3</span>
 rootPath: files <span class="hljs-comment"># The root path where the message is stored in MinIO/S3</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backup-and-Restore-Workflow" class="common-anchor-header">Fluxo de trabalho de backup e restauração</h3><p><strong>1. Configuração de backup para Milvus A</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_A
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: minio_A <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_A&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Executar o comando de backup:</strong></p>
<pre><code translate="no">./milvus-backup create -c coll -n my_backup
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.</strong> Transferir a cópia de segurança</p>
<p>Copie manualmente a cópia de segurança de <code translate="no">minio_A:bucket_A/backup/my_backup</code> para <code translate="no">minio_B:bucket_B/backup/my_backup</code> utilizando uma ferramenta compatível com S3 ou SDK.</p>
<p>4. <strong>Restaurar a configuração do Milvus B</strong></p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: milvus_B
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
 <span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: minio_B <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;bucket_B&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<p>5. <strong>Executar o comando de restauro:</strong></p>
<pre><code translate="no">./milvus-backup restore -c coll -n my_backup -s _bak
<button class="copy-code-btn"></button></code></pre>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/Figure_The_Backup_and_Restore_Workflow_Between_Two_Milvus_Instances_Across_Different_S3_Services_6a1c55d559.png" alt="Figure: The Backup and Restore Workflow Between Two Milvus Instances Across Different S3 Services" class="doc-image" id="figure:-the-backup-and-restore-workflow-between-two-milvus-instances-across-different-s3-services" />
   <span>Figura: O fluxo de trabalho de backup e restauração entre duas instâncias do Milvus em diferentes serviços S3</span> </span></p>
<p>Figura: O fluxo de trabalho de backup e restauração entre duas instâncias do Milvus em diferentes serviços S3</p>
<h2 id="Configuration-File-Explanation" class="common-anchor-header">Explicação do ficheiro de configuração<button data-href="#Configuration-File-Explanation" class="anchor-icon" translate="no">
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
    </button></h2><p>Edite o ficheiro <code translate="no">configs/backup.yaml</code> para adaptar as definições de cópia de segurança ao seu ambiente. Aqui está uma análise das opções de configuração:</p>
<p><strong>Registo</strong>: Configurar os níveis de registo e as preferências de saída.</p>
<pre><code translate="no"><span class="hljs-meta"># Configures the system log output.</span>
log:
 level: info <span class="hljs-meta"># Only supports debug, info, warn, <span class="hljs-keyword">error</span>, panic, or fatal. Default &#x27;info&#x27;.</span>
 console: <span class="hljs-literal">true</span> <span class="hljs-meta"># whether print log to console</span>
 <span class="hljs-keyword">file</span>:
   rootPath: <span class="hljs-string">&quot;logs/backup.log&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ligação Milvus</strong>: Defina os detalhes da conexão para sua instância do Milvus.</p>
<pre><code translate="no"><span class="hljs-comment"># milvus proxy address, compatible to milvus.yaml</span>
milvus:
 address: localhost
 port: <span class="hljs-number">19530</span>
 authorizationEnabled: false
 <span class="hljs-comment"># tls mode values [0, 1, 2]</span>
 <span class="hljs-comment"># 0 is close, 1 is one-way authentication, 2 is two-way authentication.</span>
 tlsMode: <span class="hljs-number">0</span>
 user: <span class="hljs-string">&quot;root&quot;</span>
 password: <span class="hljs-string">&quot;Milvus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configuração do MinIO</strong>: Defina como os backups interagem com o MinIO ou outro armazenamento compatível com S3.</p>
<pre><code translate="no"><span class="hljs-comment"># Related configuration of minio, which is responsible for data persistence for Milvus.</span>
minio:
 <span class="hljs-comment"># cloudProvider: &quot;minio&quot; # deprecated use storageType instead</span>
 storageType: <span class="hljs-string">&quot;minio&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
 address: localhost <span class="hljs-comment"># Address of MinIO/S3</span>
 port: <span class="hljs-number">9000</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
 accessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 secretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 useSSL: false <span class="hljs-comment"># Access to MinIO/S3 with SSL</span>
 useIAM: false
 iamEndpoint: <span class="hljs-string">&quot;&quot;</span>
 bucketName: <span class="hljs-string">&quot;a-bucket&quot;</span> <span class="hljs-comment"># Milvus Bucket name in MinIO/S3, make it the same as your milvus instance</span>
 rootPath: <span class="hljs-string">&quot;files&quot;</span> <span class="hljs-comment"># Milvus storage root path in MinIO/S3, make it the same as your milvus instance</span>

 <span class="hljs-comment"># only for azure</span>
 backupAccessKeyID: minioadmin  <span class="hljs-comment"># accessKeyID of MinIO/S3</span>
 backupSecretAccessKey: minioadmin <span class="hljs-comment"># MinIO/S3 encryption string</span>
 backupBucketName: <span class="hljs-string">&quot;a-bucket&quot;</span> <span class="hljs-comment"># Bucket name to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
 backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Rootpath to store backup data. Backup data will store to backupBucketName/backupRootPath</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>A ferramenta <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> fornece uma solução robusta para efetuar cópias de segurança e restaurar colecções dentro e entre instâncias Milvus. Quer esteja a gerir backups dentro de uma única instância, entre instâncias no mesmo serviço S3, ou entre diferentes serviços S3, milvus-backup trata de tudo com flexibilidade e precisão.</p>
<h3 id="Key-Takeaways" class="common-anchor-header">Principais lições</h3><ol>
<li><p><strong>Versatilidade:</strong> O milvus-backup suporta vários cenários, desde simples backups intra-instância até complexas restaurações entre serviços.</p></li>
<li><p><strong>Flexibilidade de configuração:</strong> Ao configurar adequadamente o ficheiro <code translate="no">backup.yaml</code>, os utilizadores podem personalizar os processos de backup e restauro de acordo com necessidades específicas, acomodando diferentes configurações de armazenamento e de rede.</p></li>
<li><p><strong>Segurança e controlo:</strong> A manipulação direta dos buckets e caminhos do S3 permite o controlo do armazenamento e da segurança dos dados, garantindo que as cópias de segurança são seguras e acessíveis apenas a utilizadores autorizados.</p></li>
</ol>
<p>A gestão eficaz dos dados é crucial para tirar partido de todo o potencial do Milvus nas suas aplicações. Ao dominar a ferramenta de backup Milvus, é possível garantir a durabilidade e disponibilidade dos dados, mesmo em ambientes distribuídos complexos. Este guia permite aos utilizadores implementar estratégias de backup robustas, promovendo as melhores práticas e técnicas eficientes de tratamento de dados.</p>
<p>Quer seja um programador, um engenheiro de dados ou um profissional de TI, compreender e utilizar a ferramenta Milvus-backup pode contribuir significativamente para o sucesso do seu projeto, fornecendo soluções de gestão de dados fiáveis e eficientes.</p>
