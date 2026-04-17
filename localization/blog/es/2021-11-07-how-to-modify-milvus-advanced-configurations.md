---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Cómo modificar las configuraciones avanzadas de Milvus
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Cómo modificar la configuración de Milvus desplegado en Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, ingeniera de desarrollo de pruebas de Zilliz, se licenció en tecnología informática por la Universidad de Ciencia y Tecnología de Huazhong. En la actualidad se dedica a garantizar la calidad de la base de datos vectorial Milvus, lo que incluye, entre otras cosas, pruebas de integración de interfaces, pruebas de SDK, pruebas de Benchmark, etc. Yufen es una entusiasta solucionadora de problemas en las pruebas y el desarrollo de Milvus, y una gran aficionada a la teoría de la ingeniería del caos y a la práctica de la perforación de fallos.</em></p>
<h2 id="Background" class="common-anchor-header">Antecedentes<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Al utilizar la base de datos vectorial Milvus, necesitará modificar la configuración por defecto para satisfacer los requisitos de diferentes escenarios. Anteriormente, un usuario de Milvus compartió sobre <a href="/blog/es/2021-10-22-apply-configuration-changes-on-milvus-2.md">Cómo modificar la configuración de Milvus desplegado utilizando Docker Compose</a>. Y en este artículo, me gustaría compartir con ustedes cómo modificar la configuración de Milvus desplegado en Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Modificar la configuración de Milvus en Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Puede elegir diferentes planes de modificación según los parámetros de configuración que desee modificar. Todos los archivos de configuración de Milvus se almacenan en <strong>milvus/configs</strong>. Al instalar Milvus en Kubernetes, se añadirá localmente un repositorio de Milvus Helm Chart. Ejecutando <code translate="no">helm show values milvus/milvus</code>, puede comprobar los parámetros modificables directamente con Chart. Para los parámetros modificables con Chart, puede pasar el parámetro utilizando <code translate="no">--values</code> o <code translate="no">--set</code>. Para más información, consulte <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> y <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Si los parámetros que espera modificar no están en la lista, puede seguir las siguientes instrucciones.</p>
<p>En los siguientes pasos, se modificará el parámetro <code translate="no">rootcoord.dmlChannelNum</code> en <strong>/milvus/configs/advanced/root_coord.yaml</strong> con fines de demostración. La gestión de archivos de configuración de Milvus en Kubernetes se implementa a través del objeto de recurso ConfigMap. Para cambiar el parámetro, primero debe actualizar el objeto ConfigMap de la versión Chart correspondiente y, a continuación, modificar los archivos de recursos de despliegue de los pods correspondientes.</p>
<p>Tenga en cuenta que este método sólo se aplica a la modificación de parámetros en la aplicación Milvus desplegada. Para modificar los parámetros en <strong>/milvus/configs/advanced/*.yaml</strong> antes del despliegue, tendrá que volver a desarrollar el Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Modificar ConfigMap YAML</h3><p>Como se muestra a continuación, su versión de Milvus que se ejecuta en Kubernetes corresponde a un objeto ConfigMap con el mismo nombre de la versión. La sección <code translate="no">data</code> del objeto ConfigMap solo incluye configuraciones en <strong>milvus.yaml</strong>. Para modificar <code translate="no">rootcoord.dmlChannelNum</code> en <strong>root_coord</strong> <strong>.yam</strong>l, debe añadir los parámetros de <strong>root_coord.yaml</strong> a la sección <code translate="no">data</code> en el YAML de ConfigMap y modificar el parámetro específico.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Modificación de YAML de despliegue</h3><p>Los datos almacenados en un ConfigMap pueden referenciarse en un volumen de tipo configMap y luego ser consumidos por las aplicaciones en contenedores que se ejecutan en un pod. Para dirigir los pods a los nuevos archivos de configuración, debe modificar las plantillas pod que necesitan cargar las configuraciones en <strong>root_coord.yaml</strong>. En concreto, debe añadir una declaración de montaje bajo la sección <code translate="no">spec.template.spec.containers.volumeMounts</code> en el YAML de despliegue.</p>
<p>Tomando como ejemplo el YAML de despliegue del pod rootcoord, en la sección <code translate="no">.spec.volumes</code> se especifica un volumen de tipo <code translate="no">configMap</code> denominado <strong>milvus-config</strong>. Y, en la sección <code translate="no">spec.template.spec.containers.volumeMounts</code>, el volumen se declara para montar <strong>milvus.yaml</strong> de su versión de Milvus en <strong>/milvus/configs/milvus.yaml</strong>. Del mismo modo, sólo tiene que añadir una declaración de montaje específica para el contenedor rootcoord para montar el <strong>root_coord.yam</strong> l en <strong>/milvus/configs/advanced/root_coord.yaml</strong>, y así el contenedor podrá acceder al nuevo archivo de configuración.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Verificar el resultado</h3><p>El kubelet comprueba si el ConfigMap montado es fresco en cada sincronización periódica. Cuando el ConfigMap consumido en el volumen se actualiza, las claves proyectadas también se actualizan automáticamente. Cuando el nuevo pod se está ejecutando de nuevo, puede verificar si la modificación se ha realizado correctamente en el pod. Los comandos para comprobar el parámetro <code translate="no">rootcoord.dmlChannelNum</code> se comparten a continuación.</p>
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
<p>Arriba está el método para modificar las configuraciones avanzadas en Milvus desplegado en Kubernetes. La futura versión de Milvus integrará todas las configuraciones en un archivo, y soportará la actualización de la configuración a través de helm chart. Pero antes de eso, espero que este artículo pueda ayudarle como una solución temporal.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Participe con nuestra comunidad de código abierto:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Encuentre o contribuya a Milvus en <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Interactúe con la comunidad a través <a href="https://bit.ly/3qiyTEk">del Foro</a>.</p></li>
<li><p>Conéctese con nosotros en <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
