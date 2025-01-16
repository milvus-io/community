---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Milvus 고급 구성을 수정하는 방법
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Kubernetes에 배포된 Milvus의 구성을 수정하는 방법
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>질리즈 테스트 개발 엔지니어인 유펜 종은 화중과학기술대학교에서 컴퓨터 기술 석사 학위를 취득했습니다. 현재 인터페이스 통합 테스트, SDK 테스트, 벤치마크 테스트 등 Milvus 벡터 데이터베이스의 품질 보증에 종사하고 있습니다. 유펜은 Milvus의 테스트 및 개발 분야에서 열정적인 문제 해결사이며 카오스 엔지니어링 이론과 결함 훈련 실습의 열렬한 팬입니다.</em></p>
<h2 id="Background" class="common-anchor-header">배경<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스를 사용하는 동안 다양한 시나리오의 요구 사항을 충족하기 위해 기본 구성을 수정해야 합니다. 이전에 Milvus 사용자가 <a href="/blog/ko/2021-10-22-apply-configuration-changes-on-milvus-2.md">Docker Compose를 사용하여 배포된 Milvus의 구성을 수정하는 방법에</a> 대해 공유한 적이 있습니다. 이번 글에서는 Kubernetes에 배포된 Milvus의 구성을 수정하는 방법에 대해 공유하고자 합니다.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">쿠버네티스에서 Milvus 설정 수정하기<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>수정하고자 하는 구성 파라미터에 따라 다른 수정 방법을 선택할 수 있습니다. 모든 Milvus 설정 파일은 <strong>milvus/configs</strong> 아래에 저장됩니다. 쿠버네티스에 밀버스를 설치하는 동안, 밀버스 헬름 차트 리포지토리가 로컬에 추가됩니다. <code translate="no">helm show values milvus/milvus</code> 를 실행하면 Chart로 직접 수정할 수 있는 파라미터를 확인할 수 있습니다. 차트로 수정 가능한 파라미터의 경우, <code translate="no">--values</code> 또는 <code translate="no">--set</code> 을 사용하여 파라미터를 전달할 수 있다. 자세한 내용은 <a href="https://artifacthub.io/packages/helm/milvus/milvus">밀버스 헬름 차트</a> 및 <a href="https://helm.sh/docs/">헬름을</a> 참조하세요.</p>
<p>수정하려는 매개변수가 목록에 없는 경우 아래 지침을 따를 수 있습니다.</p>
<p>다음 단계에서는 데모 목적으로 <strong>/milvus/configs/advanced/root_coord.yaml의</strong> <code translate="no">rootcoord.dmlChannelNum</code> 파라미터를 수정할 것입니다. 쿠버네티스에서 Milvus의 구성 파일 관리는 컨피그맵 리소스 오브젝트를 통해 구현됩니다. 파라미터를 변경하려면 먼저 해당 차트 릴리즈의 컨피그맵 오브젝트를 업데이트한 다음 해당 파드의 배포 리소스 파일을 수정해야 합니다.</p>
<p>이 방법은 배포된 Milvus 애플리케이션의 파라미터 수정에만 적용된다는 점에 유의하세요. 배포 전에 <strong>/milvus/configs/advanced/*.yaml의</strong> 파라미터를 수정하려면, 밀버스 헬름 차트를 다시 개발해야 한다.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">컨피그맵 YAML 수정</h3><p>아래와 같이, 쿠버네티스에서 실행 중인 밀버스 릴리스는 릴리스와 동일한 이름을 가진 컨피그맵 오브젝트에 해당한다. 컨피그맵 오브젝트의 <code translate="no">data</code> 섹션에는 <strong>milvus.yaml의</strong> 구성만 포함되어 있다. <strong>root_coord.yaml의</strong> <code translate="no">rootcoord.dmlChannelNum</code> 을 변경하려면, <strong>root_coord.yaml의</strong> 파라미터를 컨피그맵 YAML의 <code translate="no">data</code> 섹션에 추가하고 특정 파라미터를 변경해야 한다.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">배포 YAML 수정</h3><p>컨피그맵에 저장된 데이터는 configMap 유형의 볼륨에서 참조된 다음 파드에서 실행되는 컨테이너화된 애플리케이션에서 사용할 수 있다. 파드를 새 구성 파일로 안내하려면, <strong>root_coord.yaml에서</strong> 구성을 로드해야 하는 파드 템플릿을 수정해야 한다. 구체적으로, 배포 YAML의 <code translate="no">spec.template.spec.containers.volumeMounts</code> 섹션 아래에 마운트 선언을 추가해야 한다.</p>
<p>rootcoord 파드의 배포 YAML을 예로 들어보면, <code translate="no">.spec.volumes</code> 섹션에 <strong>milvus-config라는</strong> <code translate="no">configMap</code> 타입의 볼륨이 지정되어 있습니다. 그리고 <code translate="no">spec.template.spec.containers.volumeMounts</code> 섹션에서, 이 볼륨은 <strong>/milvus/configs/milvus.yaml에</strong> Milvus 릴리즈의 <strong>milvus.y</strong> aml을 마운트하도록 선언되어 있습니다. 마찬가지로 루트코드 컨테이너에 대한 마운트 선언만 추가하면 <strong>/milvus/configs/advanced/root_coord</strong> <strong>.yaml에 root</strong> _coord <strong>.</strong> yaml을 마운트할 수 있으므로 컨테이너가 새 구성 파일에 액세스할 수 있습니다.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">결과 확인</h3><p>kubelet은 주기적으로 동기화할 때마다 마운트된 컨피그맵이 최신인지 확인합니다. 볼륨에서 소비되는 컨피그맵이 업데이트되면, 투영된 키도 자동으로 업데이트됩니다. 새 파드가 다시 실행되면 파드에서 수정이 성공했는지 확인할 수 있다. <code translate="no">rootcoord.dmlChannelNum</code> 파라미터를 확인하는 명령어는 아래에 나와 있습니다.</p>
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
<p>위는 쿠버네티스에 배포된 Milvus에서 고급 구성을 수정하는 방법입니다. 향후 Milvus 릴리즈에서는 모든 설정을 하나의 파일에 통합하고 헬름 차트를 통해 설정을 업데이트할 수 있도록 지원할 예정입니다. 하지만 그 전까지는 이 글이 임시 해결책으로 도움이 되길 바랍니다.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">오픈 소스 커뮤니티에 참여하세요:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p><a href="https://bit.ly/307b7jC">GitHub에서</a> Milvus를 찾거나 기여하세요.</p></li>
<li><p><a href="https://bit.ly/3qiyTEk">포럼을</a> 통해 커뮤니티와 소통하세요.</p></li>
<li><p><a href="https://bit.ly/3ob7kd8">트위터에서</a> 소통하세요.</p></li>
</ul>
