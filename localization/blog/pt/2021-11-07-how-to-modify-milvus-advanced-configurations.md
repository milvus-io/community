---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Como modificar as configurações avançadas do Milvus
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Como modificar a configuração do Milvus implantado no Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, engenheira de desenvolvimento de testes da Zilliz, licenciou-se na Universidade de Ciência e Tecnologia de Huazhong com um mestrado em tecnologia informática. Atualmente, está envolvida na garantia de qualidade da base de dados vetorial Milvus, incluindo, mas não se limitando a, testes de integração de interfaces, testes SDK, testes de referência, etc. Yufen é uma entusiasta da resolução de problemas nos testes e no desenvolvimento do Milvus e uma grande fã da teoria da engenharia do caos e da prática da simulação de falhas.</em></p>
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
    </button></h2><p>Ao utilizar a base de dados vetorial Milvus, será necessário modificar a configuração por defeito para satisfazer os requisitos de diferentes cenários. Anteriormente, um usuário Milvus compartilhou em <a href="/blog/pt/2021-10-22-apply-configuration-changes-on-milvus-2.md">Como modificar a configuração do Milvus implantado usando o Docker Compose</a>. E neste artigo, gostaria de compartilhar com você sobre como modificar a configuração do Milvus implantado no Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Modificar a configuração do Milvus no Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Pode escolher diferentes planos de modificação de acordo com os parâmetros de configuração que deseja modificar. Todos os ficheiros de configuração do Milvus são armazenados em <strong>milvus/configs</strong>. Ao instalar o Milvus no Kubernetes, um repositório Milvus Helm Chart será adicionado localmente. Ao executar <code translate="no">helm show values milvus/milvus</code>, pode verificar os parâmetros que podem ser modificados diretamente com o Gráfico. Para os parâmetros modificáveis com o Chart, você pode passar o parâmetro usando <code translate="no">--values</code> ou <code translate="no">--set</code>. Para mais informações, consulte <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> e <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Se os parâmetros que pretende modificar não estiverem na lista, pode seguir as instruções abaixo.</p>
<p>Nas etapas a seguir, o parâmetro <code translate="no">rootcoord.dmlChannelNum</code> em <strong>/milvus/configs/advanced/root_coord.yaml</strong> deve ser modificado para fins de demonstração. O gerenciamento de arquivos de configuração do Milvus no Kubernetes é implementado através do objeto de recurso ConfigMap. Para alterar o parâmetro, você deve primeiro atualizar o objeto ConfigMap da versão Chart correspondente e, em seguida, modificar os arquivos de recursos de implantação dos pods correspondentes.</p>
<p>Tenha em atenção que este método apenas se aplica à modificação de parâmetros na aplicação Milvus implementada. Para modificar os parâmetros em <strong>/milvus/configs/advanced/*.yaml</strong> antes da implementação, terá de voltar a desenvolver o Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Modificar o ConfigMap YAML</h3><p>Como mostrado abaixo, sua versão do Milvus em execução no Kubernetes corresponde a um objeto ConfigMap com o mesmo nome da versão. A secção <code translate="no">data</code> do objeto ConfigMap inclui apenas configurações em <strong>milvus.yaml</strong>. Para alterar o <code translate="no">rootcoord.dmlChannelNum</code> em <strong>root_coord.yaml</strong>, tem de adicionar os parâmetros em <strong>root_coord.yaml</strong> à secção <code translate="no">data</code> no YAML do ConfigMap e alterar o parâmetro específico.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Modificar o YAML de implantação</h3><p>Os dados armazenados em um ConfigMap podem ser referenciados em um volume do tipo configMap e, em seguida, consumidos por aplicativos em contêineres executados em um pod. Para direcionar os pods para os novos arquivos de configuração, você deve modificar os modelos de pod que precisam carregar as configurações em <strong>root_coord.yaml</strong>. Especificamente, você precisa adicionar uma declaração de montagem na seção <code translate="no">spec.template.spec.containers.volumeMounts</code> no YAML de implantação.</p>
<p>Tomando o YAML de implantação do pod rootcoord como um exemplo, um volume do tipo <code translate="no">configMap</code> chamado <strong>milvus-config</strong> é especificado na seção <code translate="no">.spec.volumes</code>. E, na secção <code translate="no">spec.template.spec.containers.volumeMounts</code>, o volume é declarado para montar <strong>milvus.yaml</strong> do seu lançamento Milvus em <strong>/milvus/configs/milvus.yaml</strong>. Da mesma forma, só precisa de adicionar uma declaração de montagem especificamente para o contentor rootcoord para montar o <strong>root_coord.yaml</strong> em <strong>/milvus/configs/advanced/root_coord.yaml</strong>, e assim o contentor pode aceder ao novo ficheiro de configuração.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Verificar o resultado</h3><p>O kubelet verifica se o ConfigMap montado é novo em cada sincronização periódica. Quando o ConfigMap consumido no volume é atualizado, as chaves projetadas também são atualizadas automaticamente. Quando o novo pod estiver em execução novamente, você poderá verificar se a modificação foi bem-sucedida no pod. Os comandos para verificar o parâmetro <code translate="no">rootcoord.dmlChannelNum</code> são compartilhados abaixo.</p>
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
<p>Acima está o método para modificar as configurações avançadas no Milvus implantado no Kubernetes. A versão futura do Milvus integrará todas as configurações em um arquivo e suportará a atualização da configuração via helm chart. Mas antes disso, espero que este artigo possa ajudar-te como uma solução temporária.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Envolva-se com a nossa comunidade open-source:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Encontre ou contribua para o Milvus no <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Interaja com a comunidade através do <a href="https://bit.ly/3qiyTEk">Fórum</a>.</p></li>
<li><p>Ligue-se a nós no <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
