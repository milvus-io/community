---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Resolução de problemas de lentidão na pesquisa após a atualização do Milvus:
  Lições da equipa WPS
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  Depois de atualizar o Milvus da versão 2.2 para a versão 2.5, a equipa do WPS
  teve uma regressão de 3-5x na latência da pesquisa. A causa: um único
  sinalizador de restauração do milvus-backup que fragmentava segmentos.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Este post foi contribuído pela equipa de engenharia WPS da Kingsoft Office Software, que utiliza o Milvus num sistema de recomendação. Durante a atualização do Milvus 2.2.16 para o 2.5.16, a latência da pesquisa aumentou 3 a 5 vezes. Este artigo explica como investigaram o problema e o resolveram, e pode ser útil para outros na comunidade que planeiam uma atualização semelhante.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Por que atualizamos o Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Fazemos parte da equipa de engenharia da WPS que desenvolve software de produtividade e utilizamos o Milvus como o motor de pesquisa vetorial por detrás da pesquisa de semelhanças em tempo real no nosso sistema de recomendação online. O nosso cluster de produção armazenava dezenas de milhões de vectores, com uma dimensão média de 768. Os dados foram servidos por 16 QueryNodes, e cada pod foi configurado com limites de 16 núcleos de CPU e 48 GB de memória.</p>
<p>Durante a execução do Milvus 2.2.16, deparámo-nos com um grave problema de estabilidade que já estava a afetar o negócio. Sob alta simultaneidade de consultas, <code translate="no">planparserv2.HandleCompare</code> poderia causar uma exceção de ponteiro nulo, fazendo com que o componente Proxy entrasse em pânico e reiniciasse frequentemente. Este erro era muito fácil de ativar em cenários de elevada concorrência e afectava diretamente a disponibilidade do nosso serviço de recomendação online.</p>
<p>Abaixo está o registo de erros do Proxy e o stack trace do incidente:</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>O que o rastreamento de pilha mostra</strong>: O pânico ocorreu durante o pré-processamento da consulta no Proxy, em <code translate="no">queryTask.PreExecute</code>. O caminho da chamada foi:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>A falha ocorreu quando <code translate="no">HandleCompare</code> tentou aceder a uma memória inválida no endereço <code translate="no">0x8</code>, desencadeando um SIGSEGV e causando a falha do processo Proxy.</p>
<p><strong>Para eliminar completamente este risco de estabilidade, decidimos atualizar o cluster do Milvus 2.2.16 para o 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Fazendo backup dos dados com milvus-backup antes da atualização<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de tocar no cluster de produção, fizemos o backup de tudo usando a ferramenta oficial <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Ela suporta backup e restauração dentro do mesmo cluster, entre clusters e entre versões do Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Verificando a compatibilidade de versões</h3><p>O milvus-backup tem duas regras de versão para <a href="https://milvus.io/docs/milvus_backup_overview.md">restaurações entre</a> versões:</p>
<ol>
<li><p><strong>O cluster de destino deve executar a mesma versão do Milvus ou uma mais recente.</strong> Um backup da versão 2.2 pode ser carregado na versão 2.5, mas não o contrário.</p></li>
<li><p><strong>O destino deve ser, no mínimo, o Milvus 2.4.</strong> Alvos de restauração mais antigos não são suportados.</p></li>
</ol>
<p>Nosso caminho (backup da 2.2.16, carregar na 2.5.16) satisfez ambas as regras.</p>
<table>
<thead>
<tr><th>Cópia de segurança de ↓ \ Restaurar para →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Como funciona o Milvus-Backup</h3><p>O Milvus Backup facilita o backup e a restauração de metadados, segmentos e dados nas instâncias do Milvus. Fornece interfaces para o norte, como uma CLI, uma API e um módulo Go baseado em gRPC, para uma manipulação flexível dos processos de backup e restauração.</p>
<p>O Milvus Backup lê os metadados e segmentos da coleção a partir da instância de origem do Milvus para criar uma cópia de segurança. Depois copia os dados da coleção do caminho raiz da instância Milvus de origem e guarda-os no caminho raiz da cópia de segurança.</p>
<p>Para restaurar a partir de uma cópia de segurança, o Milvus Backup cria uma nova coleção na instância de destino do Milvus com base nos metadados da coleção e na informação do segmento na cópia de segurança. Em seguida, copia os dados de backup do caminho raiz do backup para o caminho raiz da instância de destino.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Executar a cópia de segurança</h3><p>Preparámos um ficheiro de configuração dedicado, <code translate="no">configs/backup.yaml</code>. Os campos principais são mostrados abaixo, com os valores sensíveis removidos:</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, executamos este comando:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> suporta <strong>backup</strong> a <strong>quente</strong>, por isso normalmente tem pouco impacto no tráfego online. A execução durante as horas de menor movimento é ainda mais segura para evitar a contenção de recursos.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Verificando o backup</h3><p>Após a conclusão do backup, verificámos se estava completo e utilizável. Verificamos principalmente se o número de coleções e segmentos no backup correspondia aos do cluster de origem.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Eles corresponderam, então passamos para a atualização.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Atualização com o Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Saltar três versões principais (2.2 → 2.5) com dezenas de milhões de vetores tornou uma atualização no local muito arriscada. Em vez disso, criamos um novo cluster e migramos os dados para ele. O cluster antigo permaneceu online para reversão.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Implementando o novo cluster</h3><p>Implementámos o novo cluster Milvus 2.5.16 com o Helm:</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Principais alterações de configuração (<code translate="no">values-v25.yaml</code>)</h3><p>Para tornar a comparação de desempenho justa, mantivemos o novo cluster o mais parecido possível com o antigo. Alteramos apenas algumas configurações que eram importantes para essa carga de trabalho:</p>
<ul>
<li><p><strong>Desativar o Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Nossa carga de trabalho de recomendação é sensível à latência. Se o Mmap estiver ativado, alguns dados podem ser lidos do disco quando necessário, o que pode aumentar o atraso de E/S do disco e causar picos de latência. Nós o desativamos para que os dados permaneçam totalmente na memória e a latência da consulta seja mais estável.</p></li>
<li><p><strong>Contagem de QueryNodes:</strong> mantida em <strong>16</strong>, igual à do cluster antigo</p></li>
<li><p><strong>Limites de recursos:</strong> cada Pod ainda tinha <strong>16 núcleos de CPU</strong>, o mesmo que o cluster antigo</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Dicas para atualizações de versões principais:</h3><ul>
<li><p><strong>Construir um novo cluster em vez de atualizar no local.</strong> Você evita riscos de compatibilidade de metadados e mantém um caminho de reversão limpo.</p></li>
<li><p><strong>Verifique seu backup antes de migrar.</strong> Uma vez que os dados estejam no formato da nova versão, não é possível voltar atrás facilmente.</p></li>
<li><p><strong>Mantenha os dois clusters em execução durante a transição.</strong> Desloque o tráfego gradualmente e só desactive o cluster antigo após uma verificação completa.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Migração de dados após a atualização com o Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Usamos <code translate="no">milvus-backup restore</code> para carregar o backup no novo cluster. Na terminologia do milvus-backup, "restaurar" significa "carregar dados de backup em um cluster de destino". O destino deve executar a mesma versão do Milvus ou uma mais recente, portanto, apesar do nome, as restaurações sempre movem os dados para frente.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Executando a restauração</h3><p>O arquivo de configuração da restauração, <code translate="no">configs/restore.yaml</code>, tinha que apontar para o <strong>novo cluster</strong> e suas configurações de armazenamento. Os campos principais eram assim:</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, executámos:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> precisa das informações de conexão Milvus e MinIO do novo cluster para que os dados restaurados sejam gravados no armazenamento do novo cluster.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Verificações após a restauração</h3><p>Após a conclusão da restauração, verificamos quatro coisas para garantir que a migração estava correta:</p>
<ul>
<li><p><strong>Esquema.</strong> O esquema de coleção no novo cluster tinha de corresponder exatamente ao antigo, incluindo definições de campo e dimensões de vetor.</p></li>
<li><p><strong>Contagem total de linhas.</strong> Comparámos o número total de entidades nos clusters antigo e novo para garantir que não se perdiam dados.</p></li>
<li><p><strong>Status do índice.</strong> Confirmámos que todos os índices tinham terminado a construção e que o seu estado estava definido para <code translate="no">Finished</code>.</p></li>
<li><p><strong>Resultados da consulta.</strong> Executámos as mesmas consultas em ambos os clusters e comparámos as IDs devolvidas e as pontuações de distância para nos certificarmos de que os resultados coincidiam.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Mudança gradual de tráfego e a surpresa da latência<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Transferimos o tráfego de produção para o novo cluster em fases:</p>
<table>
<thead>
<tr><th>Fase</th><th>Partilha de tráfego</th><th>Duração</th><th>O que observámos</th></tr>
</thead>
<tbody>
<tr><td>Fase 1</td><td>5%</td><td>24 horas</td><td>Latência da consulta P99, taxa de erro e exatidão dos resultados</td></tr>
<tr><td>Fase 2</td><td>25%</td><td>48 horas</td><td>Latência da consulta P99/P95, QPS, utilização da CPU</td></tr>
<tr><td>Fase 3</td><td>50%</td><td>48 horas</td><td>Métricas de ponta a ponta, utilização de recursos</td></tr>
<tr><td>Fase 4</td><td>100%</td><td>Monitorização contínua</td><td>Estabilidade geral das métricas</td></tr>
</tbody>
</table>
<p>Mantivemos o cluster antigo a funcionar durante todo o tempo para um rollback instantâneo.</p>
<p><strong>Durante esta implementação, detectámos o problema: a latência da pesquisa no novo cluster v2.5.16 era 3-5 vezes superior à do antigo cluster v2.2.16.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Encontrando a causa da lentidão da pesquisa<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Etapa 1: verificar o uso geral da CPU</h3><p>Começamos com o uso da CPU por componente para ver se o cluster estava com poucos recursos.</p>
<table>
<thead>
<tr><th>Componente</th><th>Uso da CPU (núcleos)</th><th>Análise</th></tr>
</thead>
<tbody>
<tr><td>Nó de consulta</td><td>10.1</td><td>O limite era de 16 núcleos, pelo que a utilização foi de cerca de 63%. Não totalmente utilizado</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Muito baixo</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Muito baixo</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Muito baixo</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Muito baixo</td></tr>
</tbody>
</table>
<p>Isso mostrou que o QueryNode ainda tinha CPU suficiente disponível. Portanto, a desaceleração <strong>não</strong> foi causada <strong>pela falta geral de CPU</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Etapa 2: verificar o equilíbrio do QueryNode</h3><p>A CPU total parecia boa, mas os pods individuais do QueryNode tinham um <strong>desequilíbrio claro</strong>:</p>
<table>
<thead>
<tr><th>Pod do QueryNode</th><th>Uso da CPU (último)</th><th>Uso da CPU (máximo)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>querinode-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>querinode-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>querinode-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>querinode-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>querinode-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>querynode-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>querinode-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>O pod-1 usou quase 5x mais CPU que o pod-8. Isso é um problema porque o Milvus distribui uma consulta para todos os QueryNodes e espera que o mais lento termine. Alguns pods sobrecarregados estavam a arrastar para baixo todas as pesquisas.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Etapa 3: Comparar a distribuição do segmento</h3><p>A carga irregular geralmente indica uma distribuição de dados irregular, portanto, comparamos os layouts de segmento entre os clusters antigos e novos.</p>
<p><strong>Layout do segmento v2.2.16 (13 segmentos no total)</strong></p>
<table>
<thead>
<tr><th>Intervalo de contagem de linhas</th><th>Contagem de segmentos</th><th>Estado</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Selado</td></tr>
<tr><td>533,630</td><td>1</td><td>Selado</td></tr>
</tbody>
</table>
<p>O cluster antigo era bastante uniforme. Ele tinha apenas 13 segmentos, e a maioria deles tinha cerca de <strong>740.000 linhas</strong>.</p>
<p><strong>Layout do segmento v2.5.16 (21 segmentos no total)</strong></p>
<table>
<thead>
<tr><th>Intervalo de contagem de linhas</th><th>Contagem de segmentos</th><th>Estado</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Selado</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Selado</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Selado</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Selado</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Selado</td></tr>
</tbody>
</table>
<p>O novo cluster tinha um aspeto muito diferente. Ele tinha 21 segmentos (60% a mais), com tamanho de segmento variável: alguns tinham ~685k linhas, outros apenas 350k. A restauração havia espalhado os dados de forma desigual.</p>
<h3 id="Root-Cause" class="common-anchor-header">Causa principal</h3><p>Nós rastreamos o problema até o nosso comando de restauração original:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Esse sinalizador <code translate="no">--use_v2_restore</code> habilita o modo de restauração de mesclagem de segmentos, que agrupa vários segmentos em um único trabalho de restauração. Esse modo foi projetado para acelerar as restaurações quando há muitos segmentos pequenos.</p>
<p>Mas em nossa restauração de versão cruzada (2.2 → 2.5), a lógica v2 reconstruiu os segmentos de forma diferente do cluster original: ela dividiu segmentos grandes em segmentos menores e de tamanho desigual. Uma vez carregados, alguns QueryNodes ficaram presos com mais dados do que outros.</p>
<p>Isso prejudicava o desempenho de três maneiras:</p>
<ul>
<li><p><strong>Nós quentes:</strong> Os QueryNodes com segmentos maiores ou mais tinham que trabalhar mais</p></li>
<li><p><strong>Efeito do nó mais lento:</strong> a latência da consulta distribuída depende do nó mais lento</p></li>
<li><p><strong>Mais sobrecarga de mesclagem:</strong> mais segmentos também significavam mais trabalho ao mesclar resultados</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">A correção</h3><p>Removemos <code translate="no">--use_v2_restore</code> e restauramos com a lógica padrão:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Primeiro, limpamos os dados incorretos do novo cluster e, em seguida, executamos a restauração padrão. A distribuição dos segmentos voltou ao equilíbrio, a latência da pesquisa voltou ao normal e o problema desapareceu.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">O que faríamos de diferente na próxima vez<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>Nesse caso, demoramos muito tempo para encontrar o problema real: <strong>distribuição desigual de segmentos</strong>. Aqui está o que teria tornado isso mais rápido.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Melhorar o monitoramento dos segmentos</h3><p>O Milvus não expõe a contagem de segmentos, a distribuição de linhas ou a distribuição de tamanho por coleção nos painéis padrão do Grafana. Tivemos que vasculhar manualmente o <a href="https://github.com/zilliztech/attu">Attu</a> e o etcd, o que foi lento.</p>
<p>Seria útil adicionar:</p>
<ul>
<li><p>um <strong>painel de distribuição de segmentos</strong> no Grafana, mostrando quantos segmentos cada QueryNode carregou, além de suas contagens de linhas e tamanhos</p></li>
<li><p>um <strong>alerta de desequilíbrio</strong>, acionado quando as contagens de linhas de segmentos nos nós ultrapassam um limite</p></li>
<li><p>uma <strong>visualização de comparação de migração</strong>, para que os usuários possam comparar a distribuição de segmentos entre os clusters antigos e novos após uma atualização</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Usar uma lista de verificação de migração padrão</h3><p>Verificámos a contagem de linhas e considerámo-la boa. Isso não foi suficiente. Uma validação completa pós-migração também deve abranger:</p>
<ul>
<li><p><strong>Consistência do esquema.</strong> As definições de campo e as dimensões do vetor correspondem?</p></li>
<li><p><strong>Contagem de segmentos.</strong> O número de segmentos mudou drasticamente?</p></li>
<li><p><strong>Equilíbrio do segmento.</strong> A contagem de linhas entre segmentos é razoavelmente uniforme?</p></li>
<li><p><strong>Status do índice.</strong> Todos os índices são <code translate="no">finished</code>?</p></li>
<li><p><strong>Referência de latência.</strong> As latências de consulta P50, P95 e P99 são semelhantes às do cluster antigo?</p></li>
<li><p><strong>Equilíbrio de carga.</strong> O uso da CPU do QueryNode é distribuído uniformemente entre os pods?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Adicionar verificações automatizadas</h3><p>Você pode criar um script dessa validação com o PyMilvus para capturar o desequilíbrio antes que ele atinja a produção:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Usar melhor as ferramentas existentes</h3><p>Algumas ferramentas já suportam diagnósticos em nível de segmento:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> pode ler os metadados Etcd diretamente e mostrar a disposição dos segmentos e a atribuição de canais</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> permite inspecionar visualmente as informações do segmento</p></li>
<li><p><strong>Grafana + Prometheus:</strong> pode ser usado para criar painéis personalizados para monitoramento de cluster em tempo real</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Sugestões para a comunidade Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Algumas mudanças no Milvus tornariam esse tipo de solução de problemas mais fácil:</p>
<ol>
<li><p><strong>Explicar a compatibilidade de parâmetros de forma mais claraOs</strong>documentos do <code translate="no">milvus-backup</code> devem explicar claramente como opções como <code translate="no">--use_v2_restore</code> se comportam durante restaurações entre versões e os riscos que podem introduzir.</p></li>
<li><p><strong>Adicionar melhores verificações após a restauraçãoApós a</strong>conclusão do <code translate="no">restore</code>, seria útil se a ferramenta imprimisse automaticamente um resumo da distribuição do segmento.</p></li>
<li><p><strong>Expor métricas relacionadas ao equilíbrioAs</strong>métricas<strong>do Prometheus</strong>devem incluir informações de equilíbrio do segmento, para que os usuários possam monitorá-las diretamente.</p></li>
<li><p><strong>Apoiar a análise do plano de consultaSemelhante</strong>ao MySQL <code translate="no">EXPLAIN</code>, o Milvus se beneficiaria de uma ferramenta que mostrasse como uma consulta é executada e ajudasse a localizar problemas de desempenho.</p></li>
</ol>
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
    </button></h2><p>Em resumo:</p>
<table>
<thead>
<tr><th>Etapa</th><th>Ferramenta / Método</th><th>Ponto-chave</th></tr>
</thead>
<tbody>
<tr><td>Cópia de segurança</td><td>milvus-backup create</td><td>O backup a quente é suportado, mas o backup deve ser verificado cuidadosamente</td></tr>
<tr><td>Atualização</td><td>Construir um novo cluster com o Helm</td><td>Desativar o Mmap para reduzir o jitter de E/S e manter as definições de recursos iguais às do cluster antigo</td></tr>
<tr><td>Migração</td><td>milvus-backup restore</td><td>Tenha cuidado com --use_v2_restore. Na restauração de versões cruzadas, não use lógica não padrão a menos que você a entenda claramente</td></tr>
<tr><td>Implementação cinzenta</td><td>Mudança gradual de tráfego</td><td>Deslocar o tráfego por fases: 5% → 25% → 50% → 100%, e mantenha o cluster antigo pronto para a reversão</td></tr>
<tr><td>Resolução de problemas</td><td>Grafana + análise de segmento</td><td>Não olhe apenas para a CPU e a memória. Verifique também o equilíbrio do segmento e a distribuição de dados</td></tr>
<tr><td>Corrigir</td><td>Remova os dados incorretos e restaure-os novamente</td><td>Remova o sinalizador errado, restaure com a lógica padrão e o desempenho volta ao normal</td></tr>
</tbody>
</table>
<p>Ao migrar dados, é importante considerar mais do que apenas se os dados estão presentes e são precisos. Também é necessário prestar atenção à <strong>forma como os dados</strong> <strong>são distribuídos</strong>.</p>
<p>A contagem de segmentos e os tamanhos dos segmentos determinam como o Milvus distribui uniformemente o trabalho de consulta entre os nós. Quando os segmentos estão desequilibrados, alguns nós acabam fazendo a maior parte do trabalho, e todas as pesquisas pagam por isso. Atualizações de versões cruzadas trazem um risco extra aqui porque o processo de restauração pode reconstruir segmentos de forma diferente do cluster original. Sinalizadores como <code translate="no">--use_v2_restore</code> podem fragmentar seus dados de maneiras que a contagem de linhas por si só não mostrará.</p>
<p>Portanto, a abordagem mais segura na migração entre versões é manter as configurações de restauração padrão, a menos que você tenha um motivo específico para fazer o contrário. Além disso, o monitoramento deve ir além da CPU e da memória; é preciso ter uma visão do layout dos dados subjacentes, particularmente a distribuição e o equilíbrio dos segmentos, para detetar problemas mais cedo.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Uma nota da equipa Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Gostaríamos de agradecer à equipa de engenharia do WPS por partilhar esta experiência com a comunidade Milvus. Relatos como este são valiosos porque capturam lições reais de produção e as tornam úteis para outros que enfrentam problemas semelhantes.</p>
<p>Se a sua equipa tiver uma lição técnica, uma história de resolução de problemas ou uma experiência prática que valha a pena partilhar, gostaríamos de ouvir a sua opinião. Junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal do Slack</a> e entre em contacto connosco.</p>
<p>E se estiver a enfrentar os seus próprios desafios, esses mesmos canais da comunidade são um bom local para se ligar aos engenheiros da Milvus e a outros utilizadores. Também pode marcar uma sessão individual através do <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para obter ajuda com cópias de segurança e restauro, actualizações entre versões e desempenho de consultas.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
