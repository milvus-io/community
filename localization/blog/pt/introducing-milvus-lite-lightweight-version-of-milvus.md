---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Apresentamos o Milvus Lite: a versão leve do Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Experimente a velocidade e a eficiência do Milvus Lite, a variante leve da
  famosa base de dados de vectores Milvus para uma pesquisa de semelhanças
  extremamente rápida.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Nota importante</em></strong></p>
<p><em>Atualizamos o Milvus Lite em junho de 2024, permitindo que os desenvolvedores de IA criem aplicativos mais rapidamente, garantindo uma experiência consistente em várias opções de implantação, incluindo Milvus em Kurbernetes, Docker e serviços gerenciados de nuvem. O Milvus Lite também se integra com várias estruturas e tecnologias de IA, simplificando o desenvolvimento de aplicações de IA com capacidades de pesquisa vetorial. Para mais informações, consulte as seguintes referências:</em></p>
<ul>
<li><p><em>Blogue de lançamento do Milvus Lite: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Documentação do Milvus Lite: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Repositório GitHub do Milvus Lite: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">O Milvus</a> é um banco de dados vetorial de código aberto criado especificamente para indexar, armazenar e consultar vetores de incorporação gerados por redes neurais profundas e outros modelos de aprendizado de máquina (ML) em bilhões de escalas. Tornou-se uma escolha popular para muitas empresas, investigadores e programadores que têm de efetuar pesquisas de semelhança em conjuntos de dados de grande escala.</p>
<p>No entanto, alguns utilizadores podem considerar a versão completa do Milvus demasiado pesada ou complexa. Para resolver este problema, <a href="https://github.com/matrixji">Bin Ji</a>, um dos colaboradores mais activos da comunidade Milvus, construiu <a href="https://github.com/milvus-io/milvus-lite">o Milvus Lite</a>, uma versão leve do Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">O que é o Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Como mencionado anteriormente, <a href="https://github.com/milvus-io/milvus-lite">o Milvus Lite</a> é uma alternativa simplificada ao Milvus que oferece muitas vantagens e benefícios.</p>
<ul>
<li>Pode integrá-lo na sua aplicação Python sem adicionar peso extra.</li>
<li>É autónomo e não requer quaisquer outras dependências, graças à capacidade do Milvus autónomo de trabalhar com Etcd incorporado e armazenamento local.</li>
<li>Pode importá-lo como uma biblioteca Python e utilizá-lo como um servidor autónomo baseado na interface de linha de comandos (CLI).</li>
<li>Funciona sem problemas com o Google Colab e o Jupyter Notebook.</li>
<li>Pode migrar com segurança o seu trabalho e escrever código para outras instâncias do Milvus (versões autónomas, em cluster e totalmente geridas) sem qualquer risco de perda de dados.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Quando é que se deve usar o Milvus Lite?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Especificamente, o Milvus Lite é mais útil nas seguintes situações:</p>
<ul>
<li>Quando prefere utilizar o Milvus sem técnicas e ferramentas de contentores como <a href="https://milvus.io/docs/install_standalone-operator.md">o Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> ou <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Quando não são necessárias máquinas virtuais ou contentores para utilizar o Milvus.</li>
<li>Quando pretende incorporar as funcionalidades do Milvus nas suas aplicações Python.</li>
<li>Quando pretende criar uma instância do Milvus no Colab ou no Notebook para uma experiência rápida.</li>
</ul>
<p><strong>Nota</strong>: Não recomendamos a utilização do Milvus Lite em qualquer ambiente de produção ou se necessitar de elevado desempenho, forte disponibilidade ou elevada escalabilidade. Em vez disso, considere a utilização de <a href="https://github.com/milvus-io/milvus">clusters Milvus</a> ou <a href="https://zilliz.com/cloud">Milvus totalmente gerido na Zilliz Cloud</a> para produção.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Como começar a utilizar o Milvus Lite?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora, vamos dar uma olhada em como instalar, configurar e usar o Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Para utilizar o Milvus Lite, certifique-se de que preencheu os seguintes requisitos:</p>
<ul>
<li>Instalou o Python 3.7 ou uma versão posterior.</li>
<li>Utilizar um dos sistemas operativos verificados listados abaixo:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Notas</strong>:</p>
<ol>
<li>O Milvus Lite usa <code translate="no">manylinux2014</code> como imagem base, tornando-o compatível com a maioria das distribuições Linux para utilizadores Linux.</li>
<li>Também é possível executar o Milvus Lite no Windows, embora isso ainda não tenha sido totalmente verificado.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Instalar o Milvus Lite</h3><p>O Milvus Lite está disponível no PyPI, então você pode instalá-lo via <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>Você também pode instalá-lo com o PyMilvus da seguinte forma:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Usar e iniciar o Milvus Lite</h3><p>Descarregue o <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">notebook de exemplo</a> da pasta de exemplos do nosso repositório de projectos. Tem duas opções para utilizar o Milvus Lite: importá-lo como uma biblioteca Python ou executá-lo como um servidor autónomo na sua máquina utilizando o CLI.</p>
<ul>
<li>Para iniciar o Milvus Lite como um módulo Python, execute os seguintes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para suspender ou parar o Milvus Lite, use a instrução <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para iniciar o Milvus Lite como um servidor autónomo baseado em CLI, execute o seguinte comando:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Depois de iniciar o Milvus Lite, você pode usar o PyMilvus ou outras ferramentas de sua preferência para se conectar ao servidor autônomo.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Iniciar o Milvus Lite em um modo de depuração</h3><ul>
<li>Para executar o Milvus Lite em modo de depuração como um módulo Python, execute os seguintes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para executar o servidor autónomo em modo de depuração, execute o seguinte comando:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Persistir dados e registos</h3><ul>
<li>Para criar um diretório local para o Milvus Lite que conterá todos os dados e registos relevantes, execute os seguintes comandos:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para manter todos os dados e registos gerados pelo servidor autónomo na sua unidade local, execute o seguinte comando:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Configurar o Milvus Lite</h3><p>A configuração do Milvus Lite é semelhante à configuração de instâncias do Milvus usando APIs Python ou CLI.</p>
<ul>
<li>Para configurar o Milvus Lite usando APIs Python, use a API <code translate="no">config.set</code> de uma instância <code translate="no">MilvusServer</code> para as configurações básicas e extras:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Para configurar o Milvus Lite utilizando a CLI, execute o seguinte comando para as definições básicas:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Ou, execute o seguinte para configurações extras.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Todos os itens configuráveis estão no modelo <code translate="no">config.yaml</code> fornecido com o pacote Milvus.</p>
<p>Para obter mais detalhes técnicos sobre como instalar e configurar o Milvus Lite, consulte nossa <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">documentação</a>.</p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Lite é uma excelente escolha para quem procura as capacidades do Milvus num formato compacto. Quer seja um investigador, programador ou cientista de dados, vale a pena explorar esta opção.</p>
<p>O Milvus Lite também é uma bela adição à comunidade de código aberto, mostrando o trabalho extraordinário de seus colaboradores. Graças aos esforços de Bin Ji, o Milvus está agora disponível para mais utilizadores. Mal podemos esperar para ver as ideias inovadoras que Bin Ji e outros membros da comunidade Milvus irão apresentar no futuro.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Vamos manter-nos em contacto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se tiver problemas na instalação ou utilização do Milvus Lite, pode <a href="https://github.com/milvus-io/milvus-lite/issues/new">registar um problema aqui</a> ou contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também é bem-vindo a juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar com os nossos engenheiros e toda a comunidade, ou visitar o <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">nosso horário de expediente às terças-feiras</a>!</p>
