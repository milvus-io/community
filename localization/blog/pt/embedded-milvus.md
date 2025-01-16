---
id: embedded-milvus.md
title: >-
  Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus
  com Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Uma versão do Milvus Python de fácil utilização que torna a instalação mais
  flexível.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Capa</span> </span></p>
<blockquote>
<p>Este artigo tem a coautoria de <a href="https://github.com/soothing-rain/">Alex Gao</a> e <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>O Milvus é uma base de dados vetorial de código aberto para aplicações de IA. Ele fornece uma variedade de métodos de instalação, incluindo a construção a partir do código-fonte e a instalação do Milvus com o Docker Compose/Helm/APT/YUM/Ansible. Os utilizadores podem escolher um dos métodos de instalação, dependendo dos seus sistemas operativos e preferências. No entanto, existem muitos cientistas de dados e engenheiros de IA na comunidade Milvus que trabalham com Python e anseiam por um método de instalação muito mais simples do que os atualmente disponíveis.</p>
<p>Por isso, lançámos o Milvus incorporado, uma versão Python de fácil utilização, juntamente com o Milvus 2.1 para capacitar mais programadores Python na nossa comunidade. Este artigo apresenta o que é o Milvus incorporado e fornece instruções sobre como o instalar e utilizar.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Uma visão geral do Milvus incorporado</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Quando usar o Milvus embutido?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Uma comparação dos diferentes modos do Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Como instalar o Milvus embutido</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Iniciar e parar o Milvus incorporado</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Uma visão geral do Milvus incorporado<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">O Mil</a> vus embutido permite-lhe instalar e usar rapidamente o Milvus com Python. Pode abrir rapidamente uma instância do Milvus e permite-lhe iniciar e parar o serviço Milvus sempre que desejar. Todos os dados e registos são mantidos mesmo que se pare o Milvus incorporado.</p>
<p>O Milvus incorporado não tem dependências internas e não requer a pré-instalação e execução de dependências de terceiros como etcd, MinIO, Pulsar, etc.</p>
<p>Tudo o que faz com o Milvus embebido, e cada pedaço de código que escreve para ele pode ser migrado com segurança para outros modos do Milvus - standalone, cluster, versão cloud, etc. Isto reflecte uma das caraterísticas mais distintivas do Milvus incorporado - <strong>"Escreva uma vez, execute em qualquer lugar".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Quando usar o Milvus incorporado?</h3><p>O Milvus incorporado e <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">o PyMilvus</a> são construídos para diferentes objectivos. Você pode considerar escolher o Milvus embutido nos seguintes cenários:</p>
<ul>
<li><p>Você quer usar o Milvus sem instalar o Milvus de nenhuma das formas fornecidas <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">aqui</a>.</p></li>
<li><p>Você quer usar o Milvus sem manter um processo Milvus de longa duração na sua máquina.</p></li>
<li><p>Quer usar o Milvus rapidamente sem iniciar um processo Milvus separado e outros componentes necessários como etcd, MinIO, Pulsar, etc.</p></li>
</ul>
<p>Sugere-se que <strong>NÃO</strong> use o Milvus incorporado:</p>
<ul>
<li><p>Num ambiente de produção.<em>(Para usar o Milvus em produção, considere o cluster Milvus ou <a href="https://zilliz.com/cloud">a nuvem Zilliz</a>, um serviço Milvus totalmente gerido</em>)<em>.</em></p></li>
<li><p>Se tiver uma elevada exigência de desempenho.<em>(Em termos comparativos, o Milvus incorporado pode não fornecer o melhor desempenho</em>)<em>.</em></p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Uma comparação entre os diferentes modos do Milvus</h3><p>A tabela abaixo compara vários modos de Milvus: autónomo, cluster, Milvus incorporado e o Zilliz Cloud, um serviço Milvus totalmente gerido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>comparação</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Como instalar o Milvus embebido?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de instalar o Milvus incorporado, é necessário garantir que tem instalado o Python 3.6 ou posterior. O Milvus incorporado suporta os seguintes sistemas operativos:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Se os requisitos forem cumpridos, pode executar <code translate="no">$ python3 -m pip install milvus</code> para instalar o Milvus incorporado. Também é possível adicionar a versão no comando para instalar uma versão específica do Milvus incorporado. Por exemplo, se quiser instalar a versão 2.1.0, execute <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. E mais tarde, quando for lançada uma nova versão do Milvus incorporado, pode também executar <code translate="no">$ python3 -m pip install --upgrade milvus</code> para atualizar o Milvus incorporado para a versão mais recente.</p>
<p>Se você é um usuário antigo do Milvus que já instalou o PyMilvus antes e quer instalar o Milvus embutido, você pode executar <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>Depois de executar o comando de instalação, é necessário criar uma pasta de dados para o Milvus incorporado em <code translate="no">/var/bin/e-milvus</code> executando o seguinte comando:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Iniciar e parar o Milvus incorporado<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando a instalação for bem-sucedida, você poderá iniciar o serviço.</p>
<p>Se estiver a executar o Milvus incorporado pela primeira vez, tem de importar o Milvus e configurar o Milvus incorporado primeiro.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Se já tiver iniciado o Milvus incorporado com êxito e voltar a reiniciá-lo, pode executar diretamente <code translate="no">milvus.start()</code> depois de importar o Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Verá o seguinte resultado se tiver iniciado com êxito o serviço Milvus incorporado.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Após o início do serviço, pode iniciar outra janela de terminal e executar o código de exemplo de &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; para brincar com o Milvus incorporado!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Quando terminar de usar o Milvus incorporado, recomendamos pará-lo graciosamente e limpar as variáveis de ambiente executando o seguinte comando ou pressionando Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial do Milvus garante a segurança dos dados?</a></li>
</ul>
