---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Устранение проблем с замедлением поиска после обновления Milvus: уроки команды
  WPS
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
  После обновления Milvus с версии 2.2 до 2.5 команда WPS столкнулась с
  регрессией задержки поиска в 3-5 раз. Причина: один флаг восстановления
  milvus-backup, который фрагментировал сегменты.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Это сообщение подготовлено командой инженеров WPS компании Kingsoft Office Software, которая использует Milvus в рекомендательной системе. Во время обновления с Milvus 2.2.16 до 2.5.16 задержка поиска увеличилась в 3-5 раз. Эта статья рассказывает о том, как они исследовали проблему и устранили ее, и может быть полезна другим пользователям, планирующим аналогичное обновление.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Почему мы обновили Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы являемся частью инженерной команды WPS, создающей программное обеспечение для повышения производительности, и используем Milvus в качестве векторного поискового движка, обеспечивающего поиск по сходству в режиме реального времени в нашей системе онлайн-рекомендаций. На нашем производственном кластере хранились десятки миллионов векторов со средней размерностью 768. Данные обслуживались 16 узлами QueryNodes, каждый из которых имел 16 ядер CPU и 48 ГБ памяти.</p>
<p>Во время работы Milvus 2.2.16 мы столкнулись с серьезной проблемой стабильности, которая уже сказывалась на бизнесе. При высоком параллелизме запросов <code translate="no">planparserv2.HandleCompare</code> мог вызвать исключение нулевого указателя, что приводило к панике и частым перезапускам компонента Proxy. Эту ошибку было очень легко спровоцировать в сценариях с высоким параллелизмом, и она напрямую влияла на доступность нашего сервиса онлайн-рекомендаций.</p>
<p>Ниже приведен фактический журнал ошибок Proxy и трассировка стека, полученная в результате инцидента:</p>
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
<p><strong>Что показывает трассировка стека</strong>: Паника произошла во время предварительной обработки запроса в Proxy, внутри <code translate="no">queryTask.PreExecute</code>. Путь вызова был:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>Падение произошло, когда <code translate="no">HandleCompare</code> попытался получить доступ к недопустимой памяти по адресу <code translate="no">0x8</code>, что вызвало SIGSEGV и привело к аварийному завершению процесса Proxy.</p>
<p><strong>Чтобы полностью устранить этот риск стабильности, мы решили обновить кластер с Milvus 2.2.16 до 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Резервное копирование данных с помощью milvus-backup перед обновлением<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем трогать производственный кластер, мы создали резервную копию всех данных с помощью официального инструмента <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Он поддерживает резервное копирование и восстановление в пределах одного кластера, между кластерами и между версиями Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Проверка совместимости версий</h3><p>В milvus-backup есть два правила для <a href="https://milvus.io/docs/milvus_backup_overview.md">кросс-версионного восстановления</a>:</p>
<ol>
<li><p><strong>На целевом кластере должна работать та же версия Milvus или более новая.</strong> Резервная копия из версии 2.2 может загрузиться в версию 2.5, но не наоборот.</p></li>
<li><p><strong>Целевой кластер должен быть не ниже Milvus 2.4.</strong> Более старые цели восстановления не поддерживаются.</p></li>
</ol>
<p>Наш путь (резервная копия из 2.2.16, загрузка в 2.5.16) удовлетворяет обоим правилам.</p>
<table>
<thead>
<tr><th>Резервное копирование из ↓ \ Восстановление в →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Принцип работы Milvus-Backup</h3><p>Milvus Backup облегчает резервное копирование и восстановление метаданных, сегментов и данных между экземплярами Milvus. Он предоставляет северные интерфейсы, такие как CLI, API и Go-модуль на основе gRPC, для гибкого управления процессами резервного копирования и восстановления.</p>
<p>Milvus Backup считывает метаданные и сегменты коллекции из исходного экземпляра Milvus для создания резервной копии. Затем он копирует данные коллекции из корневого пути исходного экземпляра Milvus и сохраняет их в корневом пути резервной копии.</p>
<p>Для восстановления из резервной копии Milvus Backup создает новую коллекцию в целевом экземпляре Milvus на основе метаданных коллекции и информации о сегментах в резервной копии. Затем он копирует данные из корневого пути резервной копии в корневой путь целевого экземпляра.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Запуск резервного копирования</h3><p>Мы подготовили специальный файл конфигурации, <code translate="no">configs/backup.yaml</code>. Основные поля показаны ниже, а конфиденциальные значения удалены:</p>
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
<p>Затем мы выполнили эту команду:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> поддерживает <strong>горячее резервное копирование</strong>, поэтому оно обычно не оказывает большого влияния на онлайн-трафик. Запуск в непиковые часы все же более безопасен, чтобы избежать нехватки ресурсов.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Проверка резервного копирования</h3><p>После завершения резервного копирования мы проверили его полноту и пригодность для использования. В основном мы проверяли, совпадает ли количество коллекций и сегментов в резервной копии с количеством коллекций и сегментов в исходном кластере.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Они совпали, и мы перешли к обновлению.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Обновление с помощью Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Переход через три основные версии (2.2 → 2.5) с десятками миллионов векторов делал обновление на месте слишком рискованным. Вместо этого мы построили новый кластер и перенесли в него данные. Старый кластер оставался в сети для отката.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Развертывание нового кластера</h3><p>Мы развернули новый кластер Milvus 2.5.16 с помощью Helm:</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Ключевые изменения конфигурации (<code translate="no">values-v25.yaml</code>)</h3><p>Чтобы сравнение производительности было справедливым, мы сделали новый кластер максимально похожим на старый. Мы изменили только несколько настроек, которые имели значение для данной рабочей нагрузки:</p>
<ul>
<li><p><strong>Отключить Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Наша рекомендательная нагрузка чувствительна к задержкам. Если Mmap включен, некоторые данные могут считываться с диска, когда это необходимо, что может увеличить задержку дискового ввода-вывода и вызвать скачки задержки. Мы отключили эту функцию, чтобы данные полностью оставались в памяти и латентность запросов была более стабильной.</p></li>
<li><p><strong>Количество узлов запросов:</strong> осталось <strong>16</strong>, как и в старом кластере.</p></li>
<li><p><strong>Ограничения ресурсов:</strong> каждый Pod по-прежнему имеет <strong>16 ядер процессора</strong>, как и в старом кластере.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Советы по обновлению крупных версий:</h3><ul>
<li><p><strong>Вместо обновления на месте создайте новый кластер.</strong> Так вы избежите рисков совместимости метаданных и сохраните чистый путь отката.</p></li>
<li><p><strong>Проверьте резервную копию перед миграцией.</strong> После того как данные перейдут в формат новой версии, вернуться назад будет непросто.</p></li>
<li><p><strong>Поддерживайте работу обоих кластеров во время перехода.</strong> Переключайте трафик постепенно и выводите старый кластер из эксплуатации только после полной проверки.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Перенос данных после обновления с помощью Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы использовали <code translate="no">milvus-backup restore</code> для загрузки резервной копии в новый кластер. В терминологии milvus-backup "восстановление" означает "загрузка данных резервной копии в целевой кластер". На целевом кластере должна работать та же версия Milvus или более новая, поэтому, несмотря на название, восстановление всегда перемещает данные вперед.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Запуск восстановления</h3><p>Файл конфигурации восстановления, <code translate="no">configs/restore.yaml</code>, должен был указывать на <strong>новый кластер</strong> и его настройки хранения. Основные поля выглядели следующим образом:</p>
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
<p>Затем мы запустили:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> необходимо получить информацию о подключении Milvus и MinIO нового кластера, чтобы восстановленные данные были записаны в хранилище нового кластера.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Проверки после восстановления</h3><p>После завершения восстановления мы проверили четыре вещи, чтобы убедиться, что миграция прошла правильно:</p>
<ul>
<li><p><strong>Схема.</strong> Схема коллекции на новом кластере должна была точно соответствовать старой, включая определения полей и размеры векторов.</p></li>
<li><p><strong>Общее количество строк.</strong> Мы сравнили общее количество сущностей в старом и новом кластерах, чтобы убедиться, что данные не были потеряны.</p></li>
<li><p><strong>Состояние индексов.</strong> Мы убедились, что все индексы завершили создание и их статус установлен на <code translate="no">Finished</code>.</p></li>
<li><p><strong>Результаты запросов.</strong> Мы выполнили одинаковые запросы на обоих кластерах и сравнили возвращаемые идентификаторы и оценки расстояния, чтобы убедиться, что результаты совпадают.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Постепенное смещение трафика и сюрприз с задержкой<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы поэтапно переводили производственный трафик на новый кластер:</p>
<table>
<thead>
<tr><th>Этап</th><th>Доля трафика</th><th>Продолжительность</th><th>Что мы наблюдали</th></tr>
</thead>
<tbody>
<tr><td>Фаза 1</td><td>5%</td><td>24 часа</td><td>Задержка запросов P99, количество ошибок и точность результатов</td></tr>
<tr><td>Фаза 2</td><td>25%</td><td>48 часов</td><td>Задержка запросов P99/P95, QPS, использование ЦП</td></tr>
<tr><td>Фаза 3</td><td>50%</td><td>48 часов</td><td>Конечные метрики, использование ресурсов</td></tr>
<tr><td>Фаза 4</td><td>100%</td><td>Продолжение мониторинга</td><td>Общая стабильность метрик</td></tr>
</tbody>
</table>
<p>Мы сохранили старый кластер для мгновенного отката.</p>
<p><strong>Во время этого отката мы обнаружили проблему: задержка поиска на новом кластере v2.5.16 была в 3-5 раз выше, чем на старом кластере v2.2.16.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Поиск причины замедления поиска<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Шаг 1: Проверьте общее использование процессора</h3><p>Мы начали с проверки использования процессора каждым компонентом, чтобы понять, не хватает ли кластеру ресурсов.</p>
<table>
<thead>
<tr><th>Компонент</th><th>Использование ЦП (ядра)</th><th>Анализ</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>Ограничение составляло 16 ядер, поэтому использование составило около 63 %. Используется не полностью</td></tr>
<tr><td>Прокси</td><td>0.21</td><td>Очень низкий</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Очень низкий</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Очень низкий</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Очень низкий</td></tr>
</tbody>
</table>
<p>Это показывает, что QueryNode все еще имеет достаточно доступного процессора. Таким образом, замедление <strong>не было вызвано общей нехваткой CPU</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Шаг 2: Проверка баланса QueryNode</h3><p>Общее количество CPU выглядело нормально, но отдельные поды QueryNode имели <strong>явный дисбаланс</strong>:</p>
<table>
<thead>
<tr><th>QueryNode Pod</th><th>Использование ЦП (последнее)</th><th>Использование ЦП (максимальное)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>кунод-под-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>запрос-под-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>кунод-под-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>кунод-под-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>кунод-под-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>кунод-под-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>кунод-под-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Под-1 использовал почти в 5 раз больше CPU, чем под-8. Это проблема, потому что Milvus рассылает запрос по всем узлам QueryNode и ждет, пока закончится самый медленный из них. Несколько перегруженных стручков снижали производительность каждого поиска.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Шаг 3: Сравните распределение сегментов</h3><p>Неравномерная нагрузка обычно указывает на неравномерное распределение данных, поэтому мы сравнили расположение сегментов между старым и новым кластерами.</p>
<p><strong>Схема сегментов v2.2.16 (всего 13 сегментов)</strong></p>
<table>
<thead>
<tr><th>Диапазон количества строк</th><th>Количество сегментов</th><th>Состояние</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Уплотненный</td></tr>
<tr><td>533,630</td><td>1</td><td>Запечатано</td></tr>
</tbody>
</table>
<p>Старый кластер был довольно равномерным. В нем было всего 13 сегментов, и большинство из них содержало около <strong>740 000 строк</strong>.</p>
<p><strong>Схема сегментов в версии 2.5.16 (всего 21 сегмент)</strong></p>
<table>
<thead>
<tr><th>Диапазон количества строк</th><th>Количество сегментов</th><th>Состояние</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Уплотненный</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Запечатанный</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Запечатанный</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Запечатанный</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Запечатанный</td></tr>
</tbody>
</table>
<p>Новый кластер выглядел совсем иначе. В нем был 21 сегмент (на 60 % больше), причем размер сегментов варьировался: некоторые содержали ~ 685 тыс. строк, другие - едва 350 тыс. При восстановлении данные были распределены неравномерно.</p>
<h3 id="Root-Cause" class="common-anchor-header">Коренная причина</h3><p>Мы отследили проблему до нашей первоначальной команды восстановления:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Флаг <code translate="no">--use_v2_restore</code> включает режим восстановления слияния сегментов, который объединяет несколько сегментов в одно задание восстановления. Этот режим предназначен для ускорения восстановления, когда у вас много маленьких сегментов.</p>
<p>Но в нашем восстановлении кросс-версии (2.2 → 2.5) логика v2 перестраивала сегменты иначе, чем в оригинальном кластере: она разбивала большие сегменты на более мелкие, неравномерно распределенные по размеру. После загрузки некоторые узлы QueryNode застревали с большим количеством данных, чем другие.</p>
<p>Это снижало производительность тремя способами:</p>
<ul>
<li><p><strong>Горячие узлы:</strong> QueryNodes с более крупными или большими сегментами должны были выполнять больше работы.</p></li>
<li><p><strong>Эффект самого медленного узла:</strong> задержка распределенных запросов зависит от самого медленного узла.</p></li>
<li><p><strong>Больше накладных расходов на слияние:</strong> большее количество сегментов также означало больше работы при объединении результатов.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">Исправление</h3><p>Мы удалили <code translate="no">--use_v2_restore</code> и восстановили логику по умолчанию:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Сначала мы очистили плохие данные из нового кластера, а затем запустили восстановление по умолчанию. Распределение сегментов вернулось к балансу, задержка поиска пришла в норму, и проблема исчезла.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Что бы мы сделали по-другому в следующий раз<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>В данном случае нам потребовалось слишком много времени, чтобы найти настоящую проблему: <strong>неравномерное распределение сегментов</strong>. Вот что помогло бы сделать это быстрее.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Улучшить мониторинг сегментов</h3><p>Milvus не отображает количество сегментов, распределение строк или распределение размера по коллекциям в стандартных панелях Grafana. Нам приходилось вручную копаться в <a href="https://github.com/zilliztech/attu">Attu</a> и etcd, что было медленно.</p>
<p>Было бы полезно добавить:</p>
<ul>
<li><p><strong>панель распределения сегментов</strong> в Grafana, показывающую, сколько сегментов загрузил каждый QueryNode, а также их количество строк и размеры</p></li>
<li><p><strong>предупреждение о дисбалансе</strong>, срабатывающее при превышении порогового значения количества строк сегментов на узлах</p></li>
<li><p><strong>представление сравнения миграции</strong>, чтобы пользователи могли сравнить распределение сегментов между старым и новым кластерами после обновления.</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Используйте стандартный контрольный список миграции</h3><p>Мы проверили количество строк и решили, что все в порядке. Но этого было недостаточно. Полная проверка после миграции также должна охватывать:</p>
<ul>
<li><p><strong>Согласованность схемы.</strong> Совпадают ли определения полей и размеры векторов?</p></li>
<li><p><strong>Количество сегментов.</strong> Сильно ли изменилось количество сегментов?</p></li>
<li><p><strong>Баланс сегментов.</strong> Является ли количество строк в сегментах достаточно равномерным?</p></li>
<li><p><strong>Состояние индексов.</strong> Все ли индексы находятся на <code translate="no">finished</code>?</p></li>
<li><p><strong>Эталон латентности.</strong> Похожи ли задержки запросов P50, P95 и P99 на задержки старого кластера?</p></li>
<li><p><strong>Баланс нагрузки.</strong> Равномерно ли распределено использование CPU QueryNode между подсистемами?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Добавьте автоматические проверки</h3><p>Вы можете написать сценарий этой проверки с помощью PyMilvus, чтобы выявить дисбаланс до того, как он попадет в производство:</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Лучше использовать существующие инструменты</h3><p>Несколько инструментов уже поддерживают диагностику на уровне сегментов:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> может напрямую читать метаданные Etcd и показывать расположение сегментов и назначение каналов.</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> позволяет визуально просматривать информацию о сегменте</p></li>
<li><p><strong>Grafana + Prometheus:</strong> можно использовать для создания пользовательских панелей для мониторинга кластера в реальном времени</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Предложения для сообщества Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Несколько изменений в Milvus облегчили бы решение подобных проблем:</p>
<ol>
<li><p><strong>Более четко объяснять совместимость параметровДокументация</strong> <code translate="no">milvus-backup</code> должна четко объяснять, как такие опции, как <code translate="no">--use_v2_restore</code>, ведут себя при кросс-версионном восстановлении и какие риски они могут представлять.</p></li>
<li><p><strong>Добавить более качественные проверки после восстановленияПосле</strong>завершения работы <code translate="no">restore</code> было бы полезно, если бы инструмент автоматически выводил сводку распределения сегментов.</p></li>
<li><p><strong>Раскрытие метрик, связанных с балансомМетрики Prometheus</strong>должны включать информацию о балансе сегмента, чтобы пользователи могли отслеживать его напрямую.</p></li>
<li><p><strong>Поддержка анализа плана запросовПодобно</strong>MySQL <code translate="no">EXPLAIN</code>, Milvus выиграл бы от инструмента, который показывает, как выполняется запрос, и помогает обнаружить проблемы с производительностью.</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Подведем итоги:</p>
<table>
<thead>
<tr><th>Этап</th><th>Инструмент / метод</th><th>Ключевой момент</th></tr>
</thead>
<tbody>
<tr><td>Резервное копирование</td><td>milvus-backup create</td><td>Поддерживается горячее резервное копирование, но резервная копия должна быть тщательно проверена</td></tr>
<tr><td>Обновление</td><td>Создайте новый кластер с помощью Helm</td><td>Отключите Mmap, чтобы уменьшить дрожание ввода-вывода, и сохраните настройки ресурсов такими же, как в старом кластере.</td></tr>
<tr><td>Миграция</td><td>milvus-backup restore</td><td>Будьте осторожны с параметром --use_v2_restore. При восстановлении кросс-версии не используйте логику не по умолчанию, если вы ее не понимаете.</td></tr>
<tr><td>Развертывание серого цвета</td><td>Постепенное перемещение трафика</td><td>Перемещайте трафик поэтапно: 5 % → 25 % → 50 % → 100 %, и держите старый кластер готовым к откату.</td></tr>
<tr><td>Устранение неполадок</td><td>Grafana + сегментный анализ</td><td>Смотрите не только на процессор и память. Проверьте также баланс сегментов и распределение данных.</td></tr>
<tr><td>Исправить</td><td>Удалите плохие данные и восстановите их снова</td><td>Удалите неправильный флаг, восстановите с логикой по умолчанию, и производительность вернется к норме</td></tr>
</tbody>
</table>
<p>При переносе данных важно учитывать не только наличие и точность данных. Необходимо также обратить внимание на <strong>то, как</strong> <strong>распределены</strong> <strong>данные</strong>.</p>
<p>Количество сегментов и их размеры определяют, насколько равномерно Milvus распределяет работу над запросами между узлами. При несбалансированном распределении сегментов несколько узлов выполняют большую часть работы, и каждый поиск платит за это. При обновлении кросс-версий возникает дополнительный риск, поскольку процесс восстановления может перестроить сегменты иначе, чем в исходном кластере. Такие флаги, как <code translate="no">--use_v2_restore</code>, могут фрагментировать данные так, что их не покажет только подсчет строк.</p>
<p>Поэтому наиболее безопасным подходом при миграции кросс-версии является использование настроек восстановления по умолчанию, если у вас нет особых причин поступать иначе. Кроме того, мониторинг не должен ограничиваться только процессором и памятью; для более раннего обнаружения проблем необходимо понимать базовую структуру данных, в частности распределение и баланс сегментов.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Заметка от команды Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы хотели бы поблагодарить команду инженеров WPS за то, что они поделились этим опытом с сообществом Milvus. Подобные статьи ценны тем, что в них отражены реальные производственные уроки и они могут быть полезны другим людям, столкнувшимся с подобными проблемами.</p>
<p>Если у вашей команды есть технический урок, история устранения неполадок или практический опыт, которым стоит поделиться, мы будем рады услышать от вас. Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу Slack</a> и обращайтесь к нам там.</p>
<p>А если вы сами решаете свои проблемы, те же каналы сообщества - отличное место для общения с инженерами Milvus и другими пользователями. Вы также можете заказать индивидуальную сессию в <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы получить помощь по резервному копированию и восстановлению, обновлению кросс-версий и производительности запросов.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
