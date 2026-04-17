---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Dépannage d'un ralentissement de la recherche après la mise à jour de Milvus :
  leçons de l'équipe WPS
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
  Après avoir mis à niveau Milvus de la version 2.2 à la version 2.5, l'équipe
  WPS a constaté une régression de la latence de recherche de 3 à 5 fois. La
  cause : un drapeau de restauration milvus-backup unique qui fragmentait les
  segments.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Ce billet a été rédigé par l'équipe d'ingénieurs WPS de Kingsoft Office Software, qui utilise Milvus dans un système de recommandation. Lors de leur mise à jour de Milvus 2.2.16 à 2.5.16, la latence de recherche a augmenté de 3 à 5 fois. Cet article explique comment ils ont étudié le problème et l'ont résolu, et peut être utile à d'autres membres de la communauté qui prévoient une mise à niveau similaire.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Pourquoi nous avons mis à jour Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous faisons partie de l'équipe d'ingénieurs de WPS qui développe des logiciels de productivité, et nous utilisons Milvus comme moteur de recherche vectoriel derrière la recherche de similarité en temps réel dans notre système de recommandation en ligne. Notre cluster de production stockait des dizaines de millions de vecteurs, avec une dimension moyenne de 768. Les données étaient servies par 16 QueryNodes, et chaque pod était configuré avec des limites de 16 cœurs de CPU et 48 Go de mémoire.</p>
<p>Lors de l'exécution de Milvus 2.2.16, nous avons rencontré un grave problème de stabilité qui affectait déjà l'entreprise. En cas de forte concurrence des requêtes, <code translate="no">planparserv2.HandleCompare</code> pouvait provoquer une exception de pointeur nul, ce qui entraînait une panique du composant Proxy et des redémarrages fréquents. Ce bogue était très facile à déclencher dans des scénarios de forte concurrence et affectait directement la disponibilité de notre service de recommandation en ligne.</p>
<p>Vous trouverez ci-dessous le journal des erreurs du Proxy et la trace de pile de l'incident :</p>
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
<p><strong>Ce que montre la trace de pile</strong>: La panique s'est produite pendant le prétraitement de la requête dans Proxy, à l'intérieur de <code translate="no">queryTask.PreExecute</code>. Le chemin d'appel était le suivant :</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>L'incident s'est produit lorsque <code translate="no">HandleCompare</code> a tenté d'accéder à une mémoire non valide à l'adresse <code translate="no">0x8</code>, ce qui a déclenché un SIGSEGV et entraîné l'interruption du processus Proxy.</p>
<p><strong>Pour éliminer complètement ce risque de stabilité, nous avons décidé de mettre à niveau le cluster de Milvus 2.2.16 à 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Sauvegarde des données avec milvus-backup avant la mise à niveau<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de toucher au cluster de production, nous avons tout sauvegardé à l'aide de l'outil officiel <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Il prend en charge la sauvegarde et la restauration au sein d'un même cluster, entre clusters et entre versions de Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Vérification de la compatibilité des versions</h3><p>milvus-backup a deux règles de version pour les <a href="https://milvus.io/docs/milvus_backup_overview.md">restaurations inter-version</a>:</p>
<ol>
<li><p><strong>Le cluster cible doit exécuter la même version de Milvus ou une version plus récente.</strong> Une sauvegarde de la version 2.2 peut être chargée dans la version 2.5, mais pas l'inverse.</p></li>
<li><p><strong>La cible doit être au moins Milvus 2.4.</strong> Les cibles de restauration plus anciennes ne sont pas prises en charge.</p></li>
</ol>
<p>Notre chemin (sauvegarde à partir de la version 2.2.16, chargement dans la version 2.5.16) satisfait aux deux règles.</p>
<table>
<thead>
<tr><th>Sauvegarde de ↓ \NRestauration vers →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Fonctionnement de Milvus-Backup</h3><p>Milvus Backup facilite la sauvegarde et la restauration des métadonnées, des segments et des données dans les instances Milvus. Il fournit des interfaces vers le nord, telles qu'une CLI, une API et un module Go basé sur gRPC, pour une manipulation flexible des processus de sauvegarde et de restauration.</p>
<p>Milvus Backup lit les métadonnées et les segments de la collection à partir de l'instance Milvus source pour créer une sauvegarde. Il copie ensuite les données de collecte à partir du chemin racine de l'instance Milvus source et les enregistre dans le chemin racine de la sauvegarde.</p>
<p>Pour restaurer à partir d'une sauvegarde, Milvus Backup crée une nouvelle collection dans l'instance Milvus cible en fonction des métadonnées de la collection et des informations sur les segments dans la sauvegarde. Il copie ensuite les données de sauvegarde du chemin racine de la sauvegarde vers le chemin racine de l'instance cible.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Exécution de la sauvegarde</h3><p>Nous avons préparé un fichier de configuration dédié, <code translate="no">configs/backup.yaml</code>. Les principaux champs sont indiqués ci-dessous, les valeurs sensibles ayant été supprimées :</p>
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
<p>Nous avons ensuite exécuté cette commande :</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> La <strong>sauvegarde à chaud</strong> prend en charge la <strong>sauvegarde à chaud</strong>, de sorte qu'elle n'a généralement que peu d'impact sur le trafic en ligne. Il est préférable d'exécuter la sauvegarde pendant les heures creuses afin d'éviter la saturation des ressources.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Vérification de la sauvegarde</h3><p>Une fois la sauvegarde terminée, nous avons vérifié qu'elle était complète et utilisable. Nous avons principalement vérifié si le nombre de collections et de segments dans la sauvegarde correspondait à ceux du cluster source.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Comme ils correspondaient, nous sommes passés à la mise à niveau.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Mise à jour avec Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Le saut de trois versions majeures (2.2 → 2.5) avec des dizaines de millions de vecteurs rendait une mise à niveau sur place trop risquée. Nous avons donc construit un nouveau cluster et y avons migré les données. L'ancien cluster est resté en ligne pour le retour en arrière.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Déploiement du nouveau cluster</h3><p>Nous avons déployé le nouveau cluster Milvus 2.5.16 avec Helm :</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Changements de configuration clés (<code translate="no">values-v25.yaml</code>)</h3><p>Pour que la comparaison des performances soit équitable, nous avons fait en sorte que le nouveau cluster soit aussi similaire que possible à l'ancien. Nous n'avons modifié que quelques paramètres importants pour cette charge de travail :</p>
<ul>
<li><p><strong>Désactiver Mmap</strong> (<code translate="no">mmap.enabled: false</code>) : Notre charge de travail de recommandation est sensible à la latence. Si Mmap est activé, certaines données peuvent être lues sur le disque lorsque cela est nécessaire, ce qui peut ajouter un délai d'E/S sur le disque et provoquer des pics de latence. Nous l'avons désactivé pour que les données restent entièrement en mémoire et que la latence des requêtes soit plus stable.</p></li>
<li><p><strong>Nombre de QueryNodes :</strong> <strong>16</strong>, comme dans l'ancien cluster.</p></li>
<li><p><strong>Limites de ressources :</strong> chaque Pod dispose toujours de <strong>16 cœurs de CPU</strong>, comme dans l'ancien cluster.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Conseils pour les mises à niveau de versions majeures :</h3><ul>
<li><p><strong>Construisez un nouveau cluster au lieu de procéder à une mise à niveau sur place.</strong> Vous évitez ainsi les risques liés à la compatibilité des métadonnées et conservez un chemin de retour en arrière propre.</p></li>
<li><p><strong>Vérifiez votre sauvegarde avant de procéder à la migration.</strong> Une fois que les données sont au format de la nouvelle version, il est difficile de revenir en arrière.</p></li>
<li><p><strong>Maintenez les deux clusters en fonctionnement pendant le basculement.</strong> Déplacez progressivement le trafic et ne mettez l'ancien cluster hors service qu'après une vérification complète.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Migration des données après la mise à niveau avec Milvus - Restauration de la sauvegarde<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons utilisé <code translate="no">milvus-backup restore</code> pour charger la sauvegarde dans le nouveau cluster. Dans la terminologie de milvus-backup, "restaurer" signifie "charger les données de sauvegarde dans un cluster cible". La cible doit exécuter la même version de Milvus ou une version plus récente. Ainsi, malgré le nom, les restaurations font toujours avancer les données.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Exécution de la restauration</h3><p>Le fichier de configuration de la restauration, <code translate="no">configs/restore.yaml</code>, devait pointer vers le <strong>nouveau cluster</strong> et ses paramètres de stockage. Les champs principaux ressemblent à ceci :</p>
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
<p>Nous avons ensuite exécuté :</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> nécessite les informations de connexion Milvus et MinIO du nouveau cluster afin que les données restaurées soient écrites dans le stockage du nouveau cluster.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Vérifications après la restauration</h3><p>Une fois la restauration terminée, nous avons vérifié quatre éléments pour nous assurer que la migration était correcte :</p>
<ul>
<li><p><strong>Schéma.</strong> Le schéma de la collection dans le nouveau cluster devait correspondre exactement à l'ancien, y compris les définitions des champs et les dimensions des vecteurs.</p></li>
<li><p><strong>Nombre total de lignes.</strong> Nous avons comparé le nombre total d'entités dans l'ancien et le nouveau cluster pour nous assurer qu'aucune donnée n'avait été perdue.</p></li>
<li><p><strong>Statut de l'index.</strong> Nous avons vérifié que tous les index avaient fini d'être construits et que leur état était défini sur <code translate="no">Finished</code>.</p></li>
<li><p><strong>Résultats des requêtes.</strong> Nous avons exécuté les mêmes requêtes sur les deux clusters et comparé les identifiants et les scores de distance renvoyés pour nous assurer que les résultats correspondaient.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Déplacement progressif du trafic et surprise en matière de latence<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons transféré le trafic de production vers le nouveau cluster par étapes :</p>
<table>
<thead>
<tr><th>Phase</th><th>Part du trafic</th><th>Durée du transfert</th><th>Ce que nous avons observé</th></tr>
</thead>
<tbody>
<tr><td>Phase 1</td><td>5%</td><td>24 heures</td><td>Latence des requêtes P99, taux d'erreur et précision des résultats</td></tr>
<tr><td>Phase 2</td><td>25%</td><td>48 heures</td><td>Temps de latence des requêtes P99/P95, QPS, utilisation du CPU</td></tr>
<tr><td>Phase 3</td><td>50%</td><td>48 heures</td><td>Mesures de bout en bout, utilisation des ressources</td></tr>
<tr><td>Phase 4</td><td>100%</td><td>Surveillance continue</td><td>Stabilité globale des mesures</td></tr>
</tbody>
</table>
<p>Nous avons maintenu l'ancien cluster en fonctionnement pendant toute la durée de l'opération pour un retour en arrière instantané.</p>
<p><strong>Au cours de ce déploiement, nous avons repéré le problème : la latence de recherche sur le nouveau cluster v2.5.16 était 3 à 5 fois plus élevée que sur l'ancien cluster v2.2.16.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Trouver la cause du ralentissement de la recherche<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Étape 1 : Vérifier l'utilisation globale du processeur</h3><p>Nous avons commencé par vérifier l'utilisation du CPU par composant afin de déterminer si le cluster manquait de ressources.</p>
<table>
<thead>
<tr><th>Composant</th><th>Utilisation du CPU (cœurs)</th><th>Analyse</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>La limite étant de 16 cœurs, l'utilisation a été d'environ 63%. Pas entièrement utilisé</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Très faible</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Très faible</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Très faible</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Très faible</td></tr>
</tbody>
</table>
<p>Cela montre que QueryNode dispose toujours de suffisamment de CPU. Le ralentissement <strong>n'</strong>est donc <strong>pas dû à une pénurie globale de CPU</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Étape 2 : Vérifier l'équilibre de QueryNode</h3><p>Le CPU total semblait correct, mais les pods QueryNode individuels présentaient un <strong>déséquilibre évident</strong>:</p>
<table>
<thead>
<tr><th>QueryNode Pod</th><th>Utilisation du CPU (dernière)</th><th>Utilisation du CPU (Max)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>querynode-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>querynode-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>querynode-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>querynode-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>querynode-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>querynode-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>querynode-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 a utilisé près de 5 fois plus de CPU que pod-8. C'est un problème car Milvus répartit une requête sur tous les QueryNodes et attend que le plus lent termine. Quelques pods surchargés ralentissaient chaque recherche.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Étape 3 : comparaison de la répartition des segments</h3><p>Une charge inégale indique généralement une distribution inégale des données. Nous avons donc comparé la disposition des segments entre les anciens et les nouveaux clusters.</p>
<p><strong>Disposition des segments v2.2.16 (13 segments au total)</strong></p>
<table>
<thead>
<tr><th>Nombre de lignes</th><th>Nombre de segments</th><th>État</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Scellé</td></tr>
<tr><td>533,630</td><td>1</td><td>Scellé</td></tr>
</tbody>
</table>
<p>L'ancien cluster était assez homogène. Il ne comportait que 13 segments, et la plupart d'entre eux contenaient environ <strong>740 000 lignes</strong>.</p>
<p><strong>Disposition des segments de la version 2.5.16 (21 segments au total)</strong></p>
<table>
<thead>
<tr><th>Nombre de lignes</th><th>Nombre de segments</th><th>État</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Scellé</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Scellé</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Scellé</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Scellé</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Scellé</td></tr>
</tbody>
</table>
<p>Le nouveau cluster est très différent. Il comportait 21 segments (60 % de plus), dont la taille variait : certains contenaient ~685k lignes, d'autres à peine 350k. La restauration a dispersé les données de manière inégale.</p>
<h3 id="Root-Cause" class="common-anchor-header">Origine du problème</h3><p>Nous avons remonté le problème jusqu'à notre commande de restauration initiale :</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Le drapeau <code translate="no">--use_v2_restore</code> active le mode de restauration par fusion de segments, qui regroupe plusieurs segments en un seul travail de restauration. Ce mode est conçu pour accélérer les restaurations lorsque vous avez de nombreux petits segments.</p>
<p>Mais dans notre restauration inter-version (2.2 → 2.5), la logique v2 a reconstruit les segments différemment du cluster d'origine : elle a divisé les gros segments en segments plus petits, de taille inégale. Une fois chargés, certains QueryNodes se sont retrouvés avec plus de données que d'autres.</p>
<p>Cela a nui aux performances de trois manières :</p>
<ul>
<li><p><strong>Nœuds chauds :</strong> Les QueryNodes contenant des segments plus grands ou plus nombreux devaient effectuer plus de travail.</p></li>
<li><p><strong>Effet du nœud le plus lent :</strong> la latence des requêtes distribuées dépend du nœud le plus lent.</p></li>
<li><p><strong>Plus de surcharge de fusion :</strong> plus de segments signifiait également plus de travail lors de la fusion des résultats.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">La correction</h3><p>Nous avons supprimé <code translate="no">--use_v2_restore</code> et rétabli la logique par défaut :</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Nous avons d'abord nettoyé les mauvaises données du nouveau cluster, puis nous avons exécuté la restauration par défaut. La distribution des segments s'est rééquilibrée, la latence de recherche est revenue à la normale et le problème a disparu.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Ce que nous ferions différemment la prochaine fois<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans ce cas, il nous a fallu trop de temps pour trouver le véritable problème : une <strong>répartition inégale des segments</strong>. Voici ce qui aurait permis d'accélérer les choses.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Améliorer la surveillance des segments</h3><p>Milvus n'expose pas le nombre de segments, la distribution des lignes ou la distribution de la taille par collection dans les tableaux de bord Grafana standard. Nous avons dû fouiller manuellement dans <a href="https://github.com/zilliztech/attu">Attu</a> et etcd, ce qui était lent.</p>
<p>Il serait utile d'ajouter :</p>
<ul>
<li><p>un <strong>tableau de bord de distribution des segments</strong> dans Grafana, montrant combien de segments chaque QueryNode a chargé, ainsi que leur nombre de lignes et leur taille.</p></li>
<li><p>une <strong>alerte de déséquilibre</strong>, déclenchée lorsque le nombre de lignes de segments sur les nœuds dépasse un certain seuil</p></li>
<li><p>une <strong>vue de comparaison de la migration</strong>, afin que les utilisateurs puissent comparer la distribution des segments entre l'ancien et le nouveau cluster après une mise à niveau.</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Utiliser une liste de contrôle standard pour la migration</h3><p>Nous avons vérifié le nombre de lignes et l'avons jugé correct. Ce n'était pas suffisant. Une validation post-migration complète doit également porter sur les points suivants</p>
<ul>
<li><p><strong>La cohérence du schéma.</strong> Les définitions des champs et les dimensions des vecteurs correspondent-elles ?</p></li>
<li><p><strong>Le nombre de segments.</strong> Le nombre de segments a-t-il changé radicalement ?</p></li>
<li><p><strong>Équilibre des segments.</strong> Le nombre de lignes dans les segments est-il raisonnablement homogène ?</p></li>
<li><p><strong>Statut de l'index.</strong> Tous les index sont-ils <code translate="no">finished</code>?</p></li>
<li><p><strong>Benchmark de latence.</strong> Les temps de latence des requêtes P50, P95 et P99 sont-ils similaires à ceux de l'ancien cluster ?</p></li>
<li><p><strong>Équilibre de la charge.</strong> L'utilisation du CPU de QueryNode est-elle uniformément répartie entre les pods ?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Ajouter des contrôles automatisés</h3><p>Vous pouvez scripter cette validation avec PyMilvus pour détecter les déséquilibres avant qu'ils n'atteignent la production :</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Mieux utiliser les outils existants</h3><p>Quelques outils prennent déjà en charge les diagnostics au niveau des segments :</p>
<ul>
<li><p><strong>Birdwatcher :</strong> peut lire les métadonnées Etcd directement et montrer la disposition des segments et l'affectation des canaux.</p></li>
<li><p><strong>Milvus Web UI (v2.5+) :</strong> vous permet d'inspecter visuellement les informations sur les segments.</p></li>
<li><p><strong>Grafana + Prometheus :</strong> peut être utilisé pour créer des tableaux de bord personnalisés pour la surveillance en temps réel des clusters.</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Suggestions pour la communauté Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Quelques modifications apportées à Milvus faciliteraient ce type de dépannage :</p>
<ol>
<li><p><strong>Expliquer plus clairement la compatibilité des paramètresLa</strong>documentation de <code translate="no">milvus-backup</code> devrait expliquer clairement comment les options telles que <code translate="no">--use_v2_restore</code> se comportent lors des restaurations inter-version et les risques qu'elles peuvent introduire.</p></li>
<li><p><strong>Ajouter de meilleures vérifications après la restaurationAprès la</strong>fin de <code translate="no">restore</code>, il serait utile que l'outil imprime automatiquement un résumé de la distribution des segments.</p></li>
<li><p><strong>Exposer les métriques liées à l'équilibreLes</strong>métriques de<strong>Prometheus</strong>devraient inclure des informations sur l'équilibre des segments, afin que les utilisateurs puissent les surveiller directement.</p></li>
<li><p><strong>Prise en charge de l'analyse du plan de requêteSimilaire à</strong>MySQL <code translate="no">EXPLAIN</code>, Milvus bénéficierait d'un outil qui montre comment une requête est exécutée et aide à localiser les problèmes de performance.</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>En résumé :</p>
<table>
<thead>
<tr><th>Étape</th><th>Outil / Méthode</th><th>Point clé</th></tr>
</thead>
<tbody>
<tr><td>Sauvegarde</td><td>milvus-backup create</td><td>La sauvegarde à chaud est prise en charge, mais la sauvegarde doit être vérifiée avec soin.</td></tr>
<tr><td>Mise à niveau</td><td>Construire un nouveau cluster avec Helm</td><td>Désactiver Mmap pour réduire la gigue d'E/S et conserver les mêmes paramètres de ressources que l'ancien cluster.</td></tr>
<tr><td>Migration</td><td>milvus-backup restore</td><td>Soyez prudent avec --use_v2_restore. Lors d'une restauration inter-version, n'utilisez pas de logique autre que celle par défaut, à moins que vous ne la compreniez clairement.</td></tr>
<tr><td>Déploiement gris</td><td>Déplacement progressif du trafic</td><td>Déplacez le trafic par étapes : 5 % → 25 % → 50 % → 100 %, et gardez l'ancien cluster prêt pour le retour en arrière.</td></tr>
<tr><td>Résolution des problèmes</td><td>Grafana + analyse des segments</td><td>Ne vous contentez pas de regarder le processeur et la mémoire. Vérifiez également l'équilibre des segments et la distribution des données</td></tr>
<tr><td>Correction</td><td>Supprimer les mauvaises données et les restaurer à nouveau</td><td>Supprimez le mauvais drapeau, restaurez avec la logique par défaut et les performances reviennent à la normale.</td></tr>
</tbody>
</table>
<p>Lors de la migration des données, il est important de ne pas se contenter de vérifier si les données sont présentes et exactes. Vous devez également prêter attention à la <strong>manière dont les données</strong> <strong>sont distribuées</strong>.</p>
<p>Le nombre et la taille des segments déterminent la manière dont Milvus répartit le travail de requête entre les nœuds. Lorsque les segments sont déséquilibrés, quelques nœuds finissent par effectuer la majeure partie du travail, et chaque recherche en fait les frais. Les mises à niveau entre versions comportent un risque supplémentaire, car le processus de restauration peut reconstruire les segments différemment du cluster d'origine. Des drapeaux tels que <code translate="no">--use_v2_restore</code> peuvent fragmenter vos données d'une manière que le nombre de lignes ne suffit pas à révéler.</p>
<p>Par conséquent, l'approche la plus sûre lors d'une migration entre versions est de s'en tenir aux paramètres de restauration par défaut, sauf si vous avez une raison spécifique de faire autrement. En outre, la surveillance doit aller au-delà de l'unité centrale et de la mémoire ; vous devez avoir un aperçu de la disposition sous-jacente des données, en particulier de la distribution et de l'équilibre des segments, afin de détecter les problèmes plus tôt.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Note de l'équipe Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous tenons à remercier l'équipe d'ingénieurs de WPS d'avoir partagé cette expérience avec la communauté Milvus. Les comptes rendus de ce type sont précieux car ils permettent de tirer des leçons de la production réelle et de les rendre utiles à d'autres personnes confrontées à des problèmes similaires.</p>
<p>Si votre équipe a une leçon technique, une histoire de dépannage ou une expérience pratique qui mérite d'être partagée, nous serions ravis de l'entendre. Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> et contactez-nous.</p>
<p>Et si vous êtes confronté à vos propres défis, ces mêmes canaux communautaires sont un bon moyen d'entrer en contact avec les ingénieurs Milvus et d'autres utilisateurs. Vous pouvez également réserver une session individuelle via les <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Heures de bureau Milvus</a> pour obtenir de l'aide sur la sauvegarde et la restauration, les mises à niveau inter-version et les performances des requêtes.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
