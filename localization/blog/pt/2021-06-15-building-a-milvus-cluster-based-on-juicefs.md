---
id: building-a-milvus-cluster-based-on-juicefs.md
title: O que é o JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Saiba como criar um cluster Milvus baseado no JuiceFS, um sistema de ficheiros
  partilhado concebido para ambientes nativos da cloud.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Construindo um cluster Milvus baseado no JuiceFS</custom-h1><p>As colaborações entre comunidades de código aberto são uma coisa mágica. Voluntários apaixonados, inteligentes e criativos não apenas mantêm as soluções de código aberto inovadoras, mas também trabalham para reunir diferentes ferramentas de maneiras interessantes e úteis. <a href="https://milvus.io/">O Milvus</a>, a base de dados vetorial mais popular do mundo, e <a href="https://github.com/juicedata/juicefs">o JuiceFS</a>, um sistema de ficheiros partilhado concebido para ambientes nativos da nuvem, foram unidos neste espírito pelas respectivas comunidades de código aberto. Este artigo explica o que é o JuiceFS, como criar um cluster Milvus baseado no armazenamento de ficheiros partilhados JuiceFS e o desempenho que os utilizadores podem esperar com esta solução.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>O que é o JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>O JuiceFS é um sistema de ficheiros POSIX distribuído de alto desempenho e de código aberto, que pode ser construído sobre o Redis e o S3. Ele foi projetado para ambientes nativos da nuvem e suporta o gerenciamento, a análise, o arquivamento e o backup de dados de qualquer tipo. O JuiceFS é normalmente utilizado para resolver desafios de grandes volumes de dados, criar aplicações de inteligência artificial (IA) e recolher registos. O sistema também suporta a partilha de dados entre vários clientes e pode ser utilizado diretamente como armazenamento partilhado no Milvus.</p>
<p>Depois de os dados e os metadados correspondentes serem persistidos no armazenamento de objectos e no <a href="https://redis.io/">Redis</a>, respetivamente, o JuiceFS funciona como um middleware sem estado. A partilha de dados é realizada permitindo que diferentes aplicações se liguem umas às outras sem problemas através de uma interface de sistema de ficheiros padrão. O JuiceFS depende do Redis, um armazenamento de dados em memória de código aberto, para o armazenamento de metadados. O Redis é utilizado porque garante a atomicidade e fornece operações de metadados de elevado desempenho. Todos os dados são armazenados no armazenamento de objectos através do cliente JuiceFS. O diagrama de arquitetura é o seguinte:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Construir um cluster Milvus baseado no JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Um cluster Milvus construído com o JuiceFS (ver diagrama de arquitetura abaixo) funciona dividindo os pedidos a montante utilizando o Mishards, um middleware de fragmentação de clusters, para fazer descer os pedidos em cascata até aos seus sub-módulos. Ao inserir dados, o Mishards aloca solicitações upstream para o nó de gravação Milvus, que armazena os dados recém-inseridos no JuiceFS. Ao ler dados, o Mishards carrega os dados do JuiceFS através de um nó de leitura Milvus para a memória para processamento, depois recolhe e devolve os resultados dos sub-serviços a montante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Passo 1: Iniciar o serviço MySQL</strong></h3><p>Inicie o serviço MySQL em <strong>qualquer</strong> nó do cluster. Para obter detalhes, consulte <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Gerenciar metadados com o MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Etapa 2: criar um sistema de arquivos JuiceFS</strong></h3><p>Para fins de demonstração, é usado o programa JuiceFS binário pré-compilado. Baixe o <a href="https://github.com/juicedata/juicefs/releases">pacote de instalação</a> correto para seu sistema e siga o <a href="https://github.com/juicedata/juicefs-quickstart">Guia de início rápido</a> do JuiceFS para obter instruções detalhadas de instalação. Para criar um sistema de arquivos JuiceFS, primeiro configure um banco de dados Redis para armazenamento de metadados. Recomenda-se que, para implantações em nuvem pública, você hospede o serviço Redis na mesma nuvem que o aplicativo. Além disso, configure o armazenamento de objetos para o JuiceFS. Neste exemplo, o Armazenamento de Blobs do Azure é usado; no entanto, o JuiceFS dá suporte a quase todos os serviços de objeto. Selecione o serviço de armazenamento de objetos que melhor se adapta às demandas do seu cenário.</p>
<p>Depois de configurar o serviço Redis e o armazenamento de objetos, formate um novo sistema de arquivos e monte o JuiceFS no diretório local:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Se o servidor Redis não estiver a ser executado localmente, substitua o localhost pelo seguinte endereço: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Quando a instalação for bem sucedida, o JuiceFS devolve a página de armazenamento partilhado <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Passo 3: Iniciar o Milvus</strong></h3><p>Todos os nós do cluster devem ter o Milvus instalado, e cada nó do Milvus deve ser configurado com permissão de leitura ou gravação. Apenas um nó do Milvus pode ser configurado como nó de escrita, e os demais devem ser nós de leitura. Primeiro, defina os parâmetros das secções <code translate="no">cluster</code> e <code translate="no">general</code> no ficheiro de configuração do sistema Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Secção</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parâmetro</strong></th><th style="text-align:left"><strong>Descrição</strong></th><th style="text-align:left"><strong>Configuration (Configuração)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Ativar ou não o modo de cluster</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Função de implantação do Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Secção</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Durante a instalação, o caminho de armazenamento partilhado JuiceFS configurado é definido como <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Após a conclusão da instalação, inicie o Milvus e confirme se ele foi iniciado corretamente. Por fim, inicie o serviço Mishards em <strong>qualquer um</strong> dos nós do cluster. A imagem abaixo mostra um lançamento bem-sucedido do Mishards. Para obter mais informações, consulte o <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">tutorial</a> do GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Referências de desempenho</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>As soluções de armazenamento compartilhado geralmente são implementadas por sistemas de armazenamento conectado à rede (NAS). Os tipos de sistemas NAS normalmente usados incluem o Sistema de Arquivos de Rede (NFS) e o Bloco de Mensagens do Servidor (SMB). As plataformas de nuvem pública geralmente fornecem serviços de armazenamento gerenciado compatíveis com esses protocolos, como o Amazon Elastic File System (EFS).</p>
<p>Ao contrário dos sistemas NAS tradicionais, o JuiceFS é implementado com base no Filesystem in Userspace (FUSE), em que toda a leitura e escrita de dados ocorre diretamente no lado da aplicação, reduzindo ainda mais a latência de acesso. Existem também funcionalidades exclusivas do JuiceFS que não podem ser encontradas noutros sistemas NAS, como a compressão de dados e a colocação em cache.</p>
<p>Os testes de benchmark revelam que o JuiceFS oferece grandes vantagens em relação ao EFS. No benchmark de metadados (Figura 1), o JuiceFS regista operações de E/S por segundo (IOPS) até dez vezes superiores ao EFS. Além disso, o benchmark de taxa de transferência de E/S (Figura 2) mostra que o JuiceFS supera o EFS em cenários de trabalho único e múltiplo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-2.png</span> </span></p>
<p>Além disso, o teste de benchmark mostra que o tempo de recuperação da primeira consulta, ou o tempo para carregar dados recém-inseridos do disco para a memória, para o cluster Milvus baseado no JuiceFS é de apenas 0,032 segundos em média, indicando que os dados são carregados do disco para a memória quase instantaneamente. Para este teste, o tempo de recuperação da primeira consulta é medido utilizando um milhão de linhas de dados vectoriais de 128 dimensões inseridos em lotes de 100k em intervalos de 1 a 8 segundos.</p>
<p>O JuiceFS é um sistema de armazenamento de ficheiros partilhado estável e fiável, e o cluster Milvus construído sobre o JuiceFS oferece um elevado desempenho e uma capacidade de armazenamento flexível.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Saiba mais sobre o Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é uma ferramenta poderosa capaz de alimentar uma vasta gama de aplicações de inteligência artificial e de pesquisa de semelhanças vectoriais. Para saber mais sobre o projeto, consulte os seguintes recursos:</p>
<ul>
<li>Leia o nosso <a href="https://zilliz.com/blog">blogue</a>.</li>
<li>Interagir com a nossa comunidade de código aberto no <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilize ou contribua para a base de dados de vectores mais popular do mundo no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testar e implementar rapidamente aplicações de IA com o nosso novo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>biografia do escritor-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>biografia do escritor-jingjing jia.png</span> </span></p>
