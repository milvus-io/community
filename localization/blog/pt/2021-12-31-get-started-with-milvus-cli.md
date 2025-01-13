---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Começar a utilizar o Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: Este artigo apresenta o Milvus_CLI e ajuda-o a realizar tarefas comuns.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>Na era da explosão da informação, estamos a produzir voz, imagens, vídeos e outros dados não estruturados a toda a hora. Como é que analisamos eficazmente esta enorme quantidade de dados? O aparecimento das redes neuronais permite que os dados não estruturados sejam incorporados como vectores e a base de dados Milvus é um software básico de serviço de dados, que ajuda a completar o armazenamento, a pesquisa e a análise de dados vectoriais.</p>
<p>Mas como podemos utilizar rapidamente a base de dados vetorial Milvus?</p>
<p>Alguns utilizadores queixaram-se de que as APIs são difíceis de memorizar e esperam que possam existir linhas de comando simples para operar a base de dados Milvus.</p>
<p>É com grande entusiasmo que apresentamos o Milvus_CLI, uma ferramenta de linha de comandos dedicada à base de dados vetorial Milvus.</p>
<p>O Milvus_CLI é um conveniente CLI de base de dados para o Milvus, que suporta a ligação à base de dados, a importação e exportação de dados e o cálculo de vectores utilizando comandos interactivos em shells. A última versão do Milvus_CLI tem as seguintes caraterísticas.</p>
<ul>
<li><p>Todas as plataformas suportadas, incluindo Windows, Mac e Linux</p></li>
<li><p>Instalação online e offline com pip suportada</p></li>
<li><p>Portátil, pode ser usado em qualquer lugar</p></li>
<li><p>Construído sobre o Milvus SDK para Python</p></li>
<li><p>Documentos de ajuda incluídos</p></li>
<li><p>Suporte ao preenchimento automático</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Instalação<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Você pode instalar o Milvus_CLI online ou offline.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Instalar Milvus_CLI online</h3><p>Execute o seguinte comando para instalar o Milvus_CLI online com o pip. É necessário o Python 3.8 ou posterior.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Instalar o Milvus_CLI offline</h3><p>Para instalar o Milvus_CLI offline, <a href="https://github.com/milvus-io/milvus_cli/releases">baixe</a> primeiro o tarball mais recente da página de lançamento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Depois que o tarball for baixado, execute o seguinte comando para instalar o Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Depois que o Milvus_CLI estiver instalado, execute <code translate="no">milvus_cli</code>. O prompt <code translate="no">milvus_cli &gt;</code> que aparece indica que a linha de comando está pronta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Se estiver a utilizar um Mac com o chip M1 ou um PC sem um ambiente Python, pode optar por utilizar uma aplicação portátil. Para o conseguir, <a href="https://github.com/milvus-io/milvus_cli/releases">transfira</a> um ficheiro na página de lançamento correspondente ao seu SO, execute <code translate="no">chmod +x</code> no ficheiro para o tornar executável, e execute <code translate="no">./</code> no ficheiro para o executar.</p>
<h4 id="Example" class="common-anchor-header"><strong>Exemplo</strong></h4><p>O exemplo seguinte torna <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> executável e executa-o.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Utilização<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Ligar ao Milvus</h3><p>Antes de se ligar ao Milvus, certifique-se de que o Milvus está instalado no seu servidor. Consulte <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Instalar o Milvus Standalone</a> ou <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Instalar o Milvus Cluster</a> para obter mais informações.</p>
<p>Se o Milvus estiver instalado no seu localhost com a porta predefinida, execute <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Caso contrário, execute o seguinte comando com o endereço IP do seu servidor Milvus. O exemplo a seguir usa <code translate="no">172.16.20.3</code> como o endereço IP e <code translate="no">19530</code> como o número da porta.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Criar uma coleção</h3><p>Esta secção apresenta a forma de criar uma coleção.</p>
<p>Uma coleção é constituída por entidades e é semelhante a uma tabela em RDBMS. Consulte <a href="https://milvus.io/docs/v2.0.x/glossary.md">o Glossário</a> para obter mais informações.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Exemplo</h4><p>O exemplo seguinte cria uma coleção com o nome <code translate="no">car</code>. A coleção <code translate="no">car</code> tem quatro campos que são <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code> e <code translate="no">brand</code>. O campo de chave primária é <code translate="no">id</code>. Consulte <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">criar coleção</a> para obter mais informações.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Listar colecções</h3><p>Execute o seguinte comando para listar todas as colecções nesta instância do Milvus.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Execute o seguinte comando para verificar os detalhes da coleção <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Calcular a distância entre dois vectores</h3><p>Execute o seguinte comando para importar dados para a coleção <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Execute <code translate="no">query</code> e introduza <code translate="no">car</code> como o nome da coleção e <code translate="no">id&gt;0</code> como a expressão de consulta quando solicitado. Os IDs das entidades que atendem aos critérios são retornados conforme mostrado na figura a seguir.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Execute <code translate="no">calc</code> e introduza os valores apropriados quando solicitado para calcular as distâncias entre as matrizes de vectores.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Eliminar uma coleção</h3><p>Execute o seguinte comando para excluir a coleção <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Mais informações<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus_CLI não se limita às funções anteriores. Execute <code translate="no">help</code> para ver todos os comandos que o Milvus_CLI inclui e as respectivas descrições. Execute <code translate="no">&lt;command&gt; --help</code> para ver os detalhes de um comando específico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Veja também:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Referência de comandos do Milvus_CLI</a> em Milvus Docs</p>
<p>Esperamos que o Milvus_CLI o possa ajudar a utilizar facilmente a base de dados vetorial Milvus. Continuaremos a otimizar a Milvus_CLI e as suas contribuições são bem-vindas.</p>
<p>Se tiver alguma dúvida, sinta-se à vontade para <a href="https://github.com/zilliztech/milvus_cli/issues">registar um problema</a> no GitHub.</p>
