---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Wie man die erweiterten Milvus-Konfigurationen ändert
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: So ändern Sie die Konfiguration von Milvus in Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, Testentwicklungsingenieurin bei Zilliz, schloss ihr Studium an der Huazhong University of Science and Technology mit einem Master-Abschluss in Computertechnik ab. Derzeit ist sie mit der Qualitätssicherung der Milvus-Vektordatenbank beschäftigt, einschließlich, aber nicht beschränkt auf Schnittstellenintegrationstests, SDK-Tests, Benchmark-Tests usw. Yufen ist eine begeisterte Problemlöserin bei den Tests und der Entwicklung von Milvus und ein großer Fan der Chaos-Engineering-Theorie und der Fehlerbehebungspraxis.</em></p>
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
    </button></h2><p>Wenn Sie die Vektordatenbank Milvus verwenden, müssen Sie die Standardkonfiguration ändern, um die Anforderungen verschiedener Szenarien zu erfüllen. Zuvor hat ein Milvus-Benutzer darüber berichtet, <a href="/blog/de/2021-10-22-apply-configuration-changes-on-milvus-2.md">wie man die Konfiguration von Milvus, das mit Docker Compose bereitgestellt wird, ändern kann</a>. In diesem Artikel möchte ich Ihnen zeigen, wie Sie die Konfiguration von Milvus, das auf Kubernetes bereitgestellt wird, ändern können.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Ändern der Konfiguration von Milvus auf Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Sie können je nach den Konfigurationsparametern, die Sie ändern möchten, verschiedene Änderungspläne wählen. Alle Milvus-Konfigurationsdateien werden unter <strong>milvus/configs</strong> gespeichert. Bei der Installation von Milvus auf Kubernetes wird ein Milvus Helm Chart-Repository lokal hinzugefügt. Wenn Sie <code translate="no">helm show values milvus/milvus</code> ausführen, können Sie die Parameter überprüfen, die direkt mit Chart geändert werden können. Für die mit Chart änderbaren Parameter können Sie den Parameter mit <code translate="no">--values</code> oder <code translate="no">--set</code> übergeben. Weitere Informationen finden Sie unter <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> und <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Wenn die Parameter, die Sie ändern möchten, nicht in der Liste aufgeführt sind, können Sie die folgenden Anweisungen befolgen.</p>
<p>In den folgenden Schritten soll der Parameter <code translate="no">rootcoord.dmlChannelNum</code> in <strong>/milvus/configs/advanced/root_coord.yaml</strong> zu Demonstrationszwecken geändert werden. Die Verwaltung der Konfigurationsdateien von Milvus auf Kubernetes wird durch das Ressourcenobjekt ConfigMap implementiert. Um den Parameter zu ändern, sollten Sie zuerst das ConfigMap-Objekt der entsprechenden Chart-Version aktualisieren und dann die Deployment-Ressourcendateien der entsprechenden Pods ändern.</p>
<p>Beachten Sie, dass diese Methode nur für die Änderung von Parametern in der bereitgestellten Milvus-Anwendung gilt. Um die Parameter in <strong>/milvus/configs/advanced/*.yaml</strong> vor der Bereitstellung zu ändern, müssen Sie das Milvus Helm Chart neu entwickeln.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Ändern der ConfigMap YAML</h3><p>Wie unten dargestellt, entspricht Ihr Milvus-Release, das auf Kubernetes läuft, einem ConfigMap-Objekt mit demselben Namen wie das Release. Der Abschnitt <code translate="no">data</code> des ConfigMap-Objekts enthält nur Konfigurationen in <strong>milvus.yaml</strong>. Um die <code translate="no">rootcoord.dmlChannelNum</code> in <strong>root_coord.yaml</strong> zu ändern, müssen Sie die Parameter in <strong>root_coord.yaml</strong> zum Abschnitt <code translate="no">data</code> in der ConfigMap YAML hinzufügen und den spezifischen Parameter ändern.</p>
<pre><code translate="no">kind: ConfigMap
apiVersion: v1
metadata:
  name: milvus-chaos
  ...
data:
  milvus.yaml: &gt;
    ......
  root_coord.yaml: |
    rootcoord:
      dmlChannelNum: 128
      maxPartitionNum: 4096
      minSegmentSizeToEnableIndex: 1024
      <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
      timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Deployment YAML modifizieren</h3><p>Die in einer ConfigMap gespeicherten Daten können in einem Volume des Typs configMap referenziert und dann von containerisierten Anwendungen, die in einem Pod laufen, konsumiert werden. Um die Pods auf die neuen Konfigurationsdateien zu verweisen, müssen Sie die Pod-Vorlagen ändern, die die Konfigurationen in <strong>root_coord.yaml</strong> laden müssen. Insbesondere müssen Sie eine Mount-Deklaration unter dem Abschnitt <code translate="no">spec.template.spec.containers.volumeMounts</code> in der deployment YAML hinzufügen.</p>
<p>In der Deployment-YAML des Rootcoord-Pods ist zum Beispiel im Abschnitt <code translate="no">.spec.volumes</code> ein Volume vom Typ <code translate="no">configMap</code> mit dem Namen <strong>milvus-config</strong> angegeben. Und im Abschnitt <code translate="no">spec.template.spec.containers.volumeMounts</code> wird das Volume so deklariert, dass es die <strong>milvus.yaml</strong> Ihrer Milvus-Version unter <strong>/milvus/configs/milvus.yaml</strong> einbindet. In ähnlicher Weise müssen Sie nur eine Mount-Deklaration speziell für den rootcoord-Container hinzufügen, um die <strong>root_coord.yaml</strong> unter <strong>/milvus/configs/advanced/root_coord.yaml</strong> zu mounten, und so kann der Container auf die neue Konfigurationsdatei zugreifen.</p>
<pre><code translate="no" class="language-yaml">spec:
  replicas: 1
  selector:
    ......
  template:
    metadata:
      ...
    spec:
      volumes:
        - name: milvus-config
          configMap:
            name: milvus-chaos
            defaultMode: 420
      containers:
        - name: rootcoord
          image: <span class="hljs-string">&#x27;milvusdb/milvus-dev:master-20210906-86afde4&#x27;</span>
          args:
            ...
          ports:
            ...
          resources: {}
          volumeMounts:
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/milvus.yaml
              subPath: milvus.yaml
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/advanced/`root_coord.yaml
              subPath: root_coord.yaml
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: IfNotPresent
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verify-the-result" class="common-anchor-header">Überprüfen Sie das Ergebnis</h3><p>Das Kubelet prüft bei jedem periodischen Sync, ob die gemountete ConfigMap frisch ist. Wenn die im Volume verbrauchte ConfigMap aktualisiert wird, werden auch die projizierten Schlüssel automatisch aktualisiert. Wenn der neue Pod wieder in Betrieb ist, können Sie überprüfen, ob die Änderung im Pod erfolgreich war. Die Befehle zum Überprüfen des Parameters <code translate="no">rootcoord.dmlChannelNum</code> sind unten angegeben.</p>
<pre><code translate="no" class="language-bash">$ kctl <span class="hljs-built_in">exec</span> -ti milvus-chaos-rootcoord-6f56794f5b-xp2zs -- sh
<span class="hljs-comment"># cd configs/advanced</span>
<span class="hljs-comment"># pwd</span>
/milvus/configs/advanced
<span class="hljs-comment"># ls</span>
channel.yaml  common.yaml  data_coord.yaml  data_node.yaml  etcd.yaml  proxy.yaml  query_node.yaml  root_coord.yaml
<span class="hljs-comment"># cat root_coord.yaml</span>
rootcoord:
  dmlChannelNum: 128
  maxPartitionNum: 4096
  minSegmentSizeToEnableIndex: 1024
  <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
  timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<span class="hljs-comment"># exit</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dies ist die Methode zur Änderung der erweiterten Konfigurationen in Milvus, das auf Kubernetes bereitgestellt wird. Zukünftige Versionen von Milvus werden alle Konfigurationen in eine Datei integrieren und die Aktualisierung der Konfiguration über ein Helm-Diagramm unterstützen. Aber bis dahin hoffe ich, dass dieser Artikel Ihnen als vorübergehende Lösung helfen kann.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Beteiligen Sie sich an unserer Open-Source-Community:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Finden Sie Milvus auf <a href="https://bit.ly/307b7jC">GitHub</a> oder tragen Sie dazu bei.</p></li>
<li><p>Interagieren Sie mit der Community über das <a href="https://bit.ly/3qiyTEk">Forum</a>.</p></li>
<li><p>Verbinden Sie sich mit uns auf <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
