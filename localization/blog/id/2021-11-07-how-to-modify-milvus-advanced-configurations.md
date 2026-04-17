---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Cara Memodifikasi Konfigurasi Lanjutan Milvus
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: Cara memodifikasi konfigurasi Milvus yang digunakan pada Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Yufen Zong, Insinyur Pengembangan Tes Zilliz, lulus dari Universitas Sains dan Teknologi Huazhong dengan gelar master di bidang teknologi komputer. Saat ini ia terlibat dalam jaminan kualitas basis data vektor Milvus, termasuk namun tidak terbatas pada pengujian integrasi antarmuka, pengujian SDK, pengujian Benchmark, dll. Yufen adalah seorang pemecah masalah yang antusias dalam pengujian dan pengembangan Milvus, dan penggemar berat teori chaos engineering dan praktik fault drill.</em></p>
<h2 id="Background" class="common-anchor-header">Latar Belakang<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika menggunakan database vektor Milvus, Anda perlu memodifikasi konfigurasi default untuk memenuhi kebutuhan skenario yang berbeda. Sebelumnya, seorang pengguna Milvus berbagi tentang <a href="/blog/id/2021-10-22-apply-configuration-changes-on-milvus-2.md">Cara Memodifikasi Konfigurasi Milvus yang Diterapkan Menggunakan Docker Compose</a>. Dan pada artikel ini, saya ingin berbagi dengan Anda tentang cara memodifikasi konfigurasi Milvus yang digunakan pada Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Memodifikasi konfigurasi Milvus di Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda dapat memilih paket modifikasi yang berbeda sesuai dengan parameter konfigurasi yang ingin Anda ubah. Semua berkas konfigurasi Milvus disimpan di bawah <strong>milvus/configs</strong>. Saat menginstal Milvus di Kubernetes, repositori Milvus Helm Chart akan ditambahkan secara lokal. Dengan menjalankan <code translate="no">helm show values milvus/milvus</code>, Anda dapat memeriksa parameter yang dapat dimodifikasi secara langsung dengan Chart. Untuk parameter yang dapat dimodifikasi dengan Chart, Anda dapat mengoper parameter menggunakan <code translate="no">--values</code> atau <code translate="no">--set</code>. Untuk informasi lebih lanjut, lihat <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> dan <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Jika parameter yang ingin Anda modifikasi tidak ada dalam daftar, Anda dapat mengikuti instruksi di bawah ini.</p>
<p>Pada langkah berikut, parameter <code translate="no">rootcoord.dmlChannelNum</code> pada <strong>/milvus/configs/advanced/root_coord.yaml</strong> akan dimodifikasi untuk tujuan demonstrasi. Manajemen berkas konfigurasi Milvus pada Kubernetes diimplementasikan melalui objek sumber daya ConfigMap. Untuk mengubah parameter, Anda harus terlebih dahulu memperbarui objek ConfigMap dari rilis Chart yang sesuai, lalu memodifikasi berkas sumber daya penerapan dari pod yang sesuai.</p>
<p>Perhatikan bahwa metode ini hanya berlaku untuk modifikasi parameter pada aplikasi Milvus yang telah dit-deploy. Untuk memodifikasi parameter di <strong>/milvus/configs/advanced/*.yaml</strong> sebelum deployment, Anda perlu mengembangkan ulang Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Memodifikasi ConfigMap YAML</h3><p>Seperti yang ditunjukkan di bawah ini, rilis Milvus Anda yang berjalan di Kubernetes berhubungan dengan objek ConfigMap dengan nama yang sama dengan nama rilis. Bagian <code translate="no">data</code> pada objek ConfigMap hanya menyertakan konfigurasi di <strong>milvus.yaml</strong>. Untuk mengubah <code translate="no">rootcoord.dmlChannelNum</code> di <strong>root_coord.yaml</strong>, Anda harus menambahkan parameter di <strong>root_coord.yaml</strong> ke bagian <code translate="no">data</code> di ConfigMap YAML dan mengubah parameter tertentu.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Memodifikasi YAML Penyebaran</h3><p>Data yang disimpan dalam ConfigMap dapat direferensikan dalam volume bertipe configMap dan kemudian digunakan oleh aplikasi terkontainerisasi yang berjalan dalam pod. Untuk mengarahkan pod ke file konfigurasi baru, Anda harus memodifikasi templat pod yang perlu memuat konfigurasi di <strong>root_coord.yaml</strong>. Secara khusus, Anda perlu menambahkan deklarasi mount di bawah bagian <code translate="no">spec.template.spec.containers.volumeMounts</code> dalam deployment YAML.</p>
<p>Mengambil deployment YAML pod rootcoord sebagai contoh, volume tipe <code translate="no">configMap</code> bernama <strong>milvus-config</strong> ditentukan di bagian <code translate="no">.spec.volumes</code>. Dan, pada bagian <code translate="no">spec.template.spec.containers.volumeMounts</code>, volume tersebut dideklarasikan untuk memount <strong>milvus.yaml</strong> dari rilis Milvus Anda pada <strong>/milvus/configs/milvus.yaml</strong>. Dengan cara yang sama, Anda hanya perlu menambahkan deklarasi mount khusus untuk kontainer rootcoord untuk memount <strong>root_coord.yaml</strong> di <strong>/milvus/configs/advanced/root_coord.yaml</strong>, dan dengan demikian, kontainer tersebut dapat mengakses berkas konfigurasi yang baru.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Verifikasi hasilnya</h3><p>Kubelet memeriksa apakah ConfigMap yang terpasang masih baru pada setiap sinkronisasi berkala. Ketika ConfigMap yang digunakan dalam volume diperbarui, kunci yang diproyeksikan juga secara otomatis diperbarui. Ketika pod baru berjalan lagi, Anda dapat memverifikasi apakah modifikasi berhasil di dalam pod. Perintah untuk memeriksa parameter <code translate="no">rootcoord.dmlChannelNum</code> dibagikan di bawah ini.</p>
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
<p>Di atas adalah metode untuk memodifikasi konfigurasi lanjutan dalam Milvus yang diterapkan pada Kubernetes. Rilis Milvus di masa mendatang akan mengintegrasikan semua konfigurasi dalam satu berkas, dan akan mendukung pembaruan konfigurasi melalui diagram helm. Namun sebelum itu, saya harap artikel ini dapat membantu Anda sebagai solusi sementara.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Bergabunglah dengan komunitas sumber terbuka kami:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Temukan atau berkontribusi ke Milvus di <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>Berinteraksi dengan komunitas melalui <a href="https://bit.ly/3qiyTEk">Forum</a>.</p></li>
<li><p>Terhubung dengan kami di <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
