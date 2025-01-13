---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Come modificare le configurazioni avanzate di Milvus
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Come modificare la configurazione di Milvus distribuito su Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, Test Development Engineer di Zilliz, si è laureata presso la Huazhong University of Science and Technology con un master in tecnologia informatica. Attualmente si occupa della garanzia di qualità del database vettoriale Milvus, compresi, ma non solo, i test di integrazione dell'interfaccia, i test SDK, i test di benchmark, ecc. Yufen è un'appassionata di risoluzione dei problemi nei test e nello sviluppo di Milvus, nonché una grande fan della teoria dell'ingegneria del caos e della pratica di perforazione degli errori.</em></p>
<h2 id="Background" class="common-anchor-header">Il contesto<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si utilizza il database vettoriale di Milvus, è necessario modificare la configurazione predefinita per soddisfare i requisiti di diversi scenari. In precedenza, un utente di Milvus ha condiviso <a href="/blog/it/2021-10-22-apply-configuration-changes-on-milvus-2.md">Come modificare la configurazione di Milvus distribuito utilizzando Docker Compose</a>. In questo articolo, vorrei condividere con voi come modificare la configurazione di Milvus distribuito su Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Modificare la configurazione di Milvus su Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>È possibile scegliere diversi piani di modifica in base ai parametri di configurazione che si desidera modificare. Tutti i file di configurazione di Milvus sono memorizzati in <strong>milvus/configs</strong>. Durante l'installazione di Milvus su Kubernetes, viene aggiunto localmente un repository Milvus Helm Chart. Eseguendo <code translate="no">helm show values milvus/milvus</code>, è possibile controllare i parametri che possono essere modificati direttamente con Chart. Per i parametri modificabili con Chart, è possibile passare il parametro utilizzando <code translate="no">--values</code> o <code translate="no">--set</code>. Per ulteriori informazioni, vedere <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> e <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Se i parametri che si desidera modificare non sono presenti nell'elenco, è possibile seguire le istruzioni riportate di seguito.</p>
<p>Nei passi seguenti, il parametro <code translate="no">rootcoord.dmlChannelNum</code> in <strong>/milvus/configs/advanced/root_coord.yaml</strong> deve essere modificato a scopo dimostrativo. La gestione dei file di configurazione di Milvus su Kubernetes è implementata attraverso l'oggetto risorsa ConfigMap. Per modificare il parametro, si deve prima aggiornare l'oggetto ConfigMap della corrispondente release di Chart e poi modificare i file delle risorse di distribuzione dei pod corrispondenti.</p>
<p>Attenzione: questo metodo si applica solo alla modifica dei parametri dell'applicazione Milvus distribuita. Per modificare i parametri in <strong>/milvus/configs/advanced/*.yaml</strong> prima della distribuzione, è necessario sviluppare nuovamente il diagramma di Milvus Helm.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Modificare la ConfigMap YAML</h3><p>Come mostrato di seguito, la release di Milvus in esecuzione su Kubernetes corrisponde a un oggetto ConfigMap con lo stesso nome della release. La sezione <code translate="no">data</code> dell'oggetto ConfigMap include solo le configurazioni in <strong>milvus.yaml</strong>. Per modificare <code translate="no">rootcoord.dmlChannelNum</code> in <strong>root_coord.yaml</strong>, è necessario aggiungere i parametri di <strong>root_coord.yaml</strong> alla sezione <code translate="no">data</code> nello YAML di ConfigMap e modificare il parametro specifico.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Modifica dello YAML di distribuzione</h3><p>I dati memorizzati in una ConfigMap possono essere referenziati in un volume di tipo configMap e quindi consumati dalle applicazioni containerizzate in esecuzione in un pod. Per indirizzare i pod ai nuovi file di configurazione, è necessario modificare i modelli di pod che devono caricare le configurazioni in <strong>root_coord.yaml</strong>. In particolare, è necessario aggiungere una dichiarazione di mount nella sezione <code translate="no">spec.template.spec.containers.volumeMounts</code> dello YAML di distribuzione.</p>
<p>Prendendo come esempio lo YAML di deployment del pod rootcoord, nella sezione <code translate="no">.spec.volumes</code> è specificato un volume di tipo <code translate="no">configMap</code> chiamato <strong>milvus-config</strong>. Inoltre, nella sezione <code translate="no">spec.template.spec.containers.volumeMounts</code>, il volume è dichiarato per montare <strong>milvus.yaml</strong> della propria release di Milvus su <strong>/milvus/configs/milvus.yaml</strong>. Allo stesso modo, è sufficiente aggiungere una dichiarazione di mount specifica per il contenitore rootcoord per montare il file <strong>root_coord.yaml</strong> su <strong>/milvus/configs/advanced/root_coord.yaml</strong> e quindi il contenitore può accedere al nuovo file di configurazione.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Verifica del risultato</h3><p>Il kubelet controlla se il ConfigMap montato è fresco a ogni sincronizzazione periodica. Quando il ConfigMap consumato nel volume viene aggiornato, anche le chiavi proiettate vengono automaticamente aggiornate. Quando il nuovo pod è di nuovo in funzione, è possibile verificare se la modifica è avvenuta con successo nel pod. I comandi per verificare il parametro <code translate="no">rootcoord.dmlChannelNum</code> sono condivisi di seguito.</p>
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
<p>Questo è il metodo per modificare le configurazioni avanzate in Milvus distribuito su Kubernetes. La futura versione di Milvus integrerà tutte le configurazioni in un unico file e supporterà l'aggiornamento della configurazione tramite il grafico helm. Ma prima di allora, spero che questo articolo possa aiutarvi come soluzione temporanea.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Impegnatevi con la nostra comunità open-source:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Trovate o contribuite a Milvus su <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Interagite con la comunità tramite il <a href="https://bit.ly/3qiyTEk">forum</a>.</p></li>
<li><p>Collegatevi con noi su <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
