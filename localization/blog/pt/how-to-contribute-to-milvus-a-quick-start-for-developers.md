---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Como contribuir para o Milvus: um início rápido para os programadores'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>O Milvus</strong></a> é uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> de código aberto concebida para gerir dados vectoriais de elevada dimensão. Quer esteja a construir motores de pesquisa inteligentes, sistemas de recomendação ou soluções de IA de última geração, como a geração aumentada de recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), o Milvus é uma ferramenta poderosa na ponta dos dedos.</p>
<p>Mas o que verdadeiramente faz avançar o Milvus não é apenas a sua tecnologia avançada - é a vibrante e apaixonada <a href="https://zilliz.com/community">comunidade de programadores</a> que está por detrás dele. Sendo um projeto de código aberto, o Milvus prospera e evolui graças às contribuições de programadores como você. Cada correção de erros, adição de funcionalidades e melhoria de desempenho da comunidade torna o Milvus mais rápido, mais escalável e mais fiável.</p>
<p>Quer seja um apaixonado pelo código aberto, esteja ansioso por aprender ou queira causar um impacto duradouro na IA, o Milvus é o local perfeito para contribuir. Este guia irá guiá-lo através do processo - desde a configuração do seu ambiente de desenvolvimento até à submissão do seu primeiro pull request. Também destacaremos os desafios comuns que poderá enfrentar e forneceremos soluções para os ultrapassar.</p>
<p>Pronto para mergulhar? Vamos tornar o Milvus ainda melhor juntos!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Configurando seu ambiente de desenvolvimento Milvus<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>A primeira coisa a fazer é configurar o seu ambiente de desenvolvimento. Você pode instalar o Milvus em sua máquina local ou usar o Docker - ambos os métodos são simples, mas você também precisará instalar algumas dependências de terceiros para colocar tudo em funcionamento.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Construindo o Milvus localmente</h3><p>Se você gosta de construir coisas do zero, construir o Milvus em sua máquina local é muito fácil. O Milvus torna-o fácil ao juntar todas as dependências no script <code translate="no">install_deps.sh</code>. Aqui está a configuração rápida:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Construindo o Milvus com Docker</h3><p>Se preferir o Docker, há duas maneiras de o fazer: pode executar comandos num contentor pré-construído ou criar um contentor de desenvolvimento para uma abordagem mais prática.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Notas sobre a plataforma:</strong> Se você está no Linux, você está pronto para ir - problemas de compilação são muito raros. No entanto, os utilizadores de Mac, especialmente com chips M1, podem deparar-se com alguns problemas ao longo do caminho. Mas não se preocupe - nós temos um guia para o ajudar a resolver os problemas mais comuns.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Configuração do SO</em></p>
<p>Para obter o guia de configuração completo, consulte o <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Guia de desenvolvimento</a> oficial <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">do Milvus</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Problemas comuns e como resolvê-los</h3><p>Por vezes, a configuração do seu ambiente de desenvolvimento Milvus não corre tão bem como planeado. Não se preocupe - aqui está um resumo rápido dos problemas comuns que pode encontrar e como os resolver rapidamente.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Desconexão inesperada ao ler pacote de banda lateral</h4><p>Se estiver a utilizar o Homebrew e vir um erro como este:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Correção:</strong> Aumente o tamanho do <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Se também se deparar com <code translate="no">Brew: command not found</code> depois de instalar o Homebrew, poderá ter de definir a configuração do seu utilizador Git:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: Erro ao obter credenciais</h4><p>Ao trabalhar com o Docker, você pode ver isso:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correção:</strong> Abra<code translate="no">~/.docker/config.json</code> e remova o campo <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: Nenhum módulo com o nome 'imp'</h4><p>Se o Python lançar este erro, é porque o Python 3.12 removeu o módulo <code translate="no">imp</code>, que algumas dependências mais antigas ainda usam.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correção:</strong> Faça downgrade para Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: argumentos não reconhecidos ou comando não encontrado</h4><p><strong>Problema:</strong> Se vir <code translate="no">Unrecognized arguments: --install-folder conan</code>, é provável que esteja a utilizar uma versão incompatível do Conan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correção:</strong> Faça o downgrade para Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Problema:</strong> Se você vir <code translate="no">Conan command not found</code>, significa que seu ambiente Python não está configurado corretamente.</p>
<p><strong>Correção:</strong> adicione o diretório bin do Python ao seu <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Uso de identificador não declarado 'kSecFormatOpenSSL'</h4><p>Este erro normalmente significa que suas dependências LLVM estão desatualizadas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correção:</strong> Reinstale o LLVM 15 e atualize suas variáveis de ambiente:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dicas profissionais</strong></p>
<ul>
<li><p>Sempre verifique novamente as versões e dependências de suas ferramentas.</p></li>
<li><p>Se algo ainda não funcionar, a<a href="https://github.com/milvus-io/milvus/issues"> página de problemas do Milvus GitHub</a> é um ótimo lugar para encontrar respostas ou pedir ajuda.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Configurando o VS Code para integração do C++ e Go</h3><p>Fazer com que o C++ e o Go trabalhem juntos no VS Code é mais fácil do que parece. Com a configuração correta, pode simplificar o seu processo de desenvolvimento para o Milvus. Basta ajustar o seu ficheiro <code translate="no">user.settings</code> com a configuração abaixo:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Veja o que essa configuração faz:</p>
<ul>
<li><p><strong>Variáveis de ambiente:</strong> Define caminhos para <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, e <code translate="no">RPATH</code>, que são críticos para localizar bibliotecas durante compilações e testes.</p></li>
<li><p><strong>Integração de ferramentas Go:</strong> Habilita o servidor de linguagem Go (<code translate="no">gopls</code>) e configura ferramentas como <code translate="no">gofumpt</code> para formatação e <code translate="no">golangci-lint</code> para linting.</p></li>
<li><p><strong>Configuração de teste:</strong> Adiciona o <code translate="no">testTags</code> e aumenta o tempo limite para a execução de testes para 10 minutos.</p></li>
</ul>
<p>Uma vez adicionada, essa configuração garante uma integração perfeita entre os fluxos de trabalho C++ e Go. É perfeita para construir e testar o Milvus sem ajustes constantes no ambiente.</p>
<p><strong>Dica profissional</strong></p>
<p>Depois de configurar isso, execute uma compilação de teste rápida para confirmar que tudo funciona. Se algo parecer errado, verifique novamente os caminhos e a versão da extensão Go do VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Implantando o Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus suporta <a href="https://milvus.io/docs/install-overview.md">três modos de implantação - Lite</a><strong>, Standalone</strong> e <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> é uma biblioteca Python e uma versão ultra-leve do Milvus. É perfeito para prototipagem rápida em ambientes Python ou notebook e para experiências locais de pequena escala.</p></li>
<li><p><strong>Milvus Standalone</strong> é a opção de implantação de nó único para Milvus, usando um modelo cliente-servidor. É o equivalente Milvus do MySQL, enquanto o Milvus Lite é como o SQLite.</p></li>
<li><p><strong>O Milvus Distributed</strong> é o modo distribuído do Milvus, ideal para utilizadores empresariais que criam sistemas de bases de dados vectoriais em grande escala ou plataformas de dados vectoriais.</p></li>
</ul>
<p>Todas estas implementações dependem de três componentes principais:</p>
<ul>
<li><p><strong>Milvus:</strong> O motor de base de dados vetorial que conduz todas as operações.</p></li>
<li><p><strong>Etcd:</strong> O mecanismo de metadados que gerencia os metadados internos do Milvus.</p></li>
<li><p><strong>MinIO:</strong> O mecanismo de armazenamento que garante a persistência dos dados.</p></li>
</ul>
<p>Quando executado no modo <strong>distribuído</strong>, o Milvus também incorpora <strong>o Pulsar</strong> para processamento de mensagens distribuídas usando um mecanismo Pub/Sub, tornando-o escalável para ambientes de alto rendimento.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Autónomo</h3><p>O modo Standalone é feito sob medida para configurações de instância única, tornando-o perfeito para testes e aplicações de pequena escala. Veja como começar:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (anteriormente conhecido como Milvus Cluster)</h3><p>Para conjuntos de dados maiores e maior tráfego, o modo Distribuído oferece escalabilidade horizontal. Ele combina várias instâncias do Milvus em um único sistema coeso. A implantação é facilitada com o <strong>Milvus Operator</strong>, que é executado no Kubernetes e gerencia toda a pilha do Milvus para você.</p>
<p>Deseja orientação passo a passo? Confira o <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Guia de instalação do Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Executando testes de ponta a ponta (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois que a implantação do Milvus estiver em funcionamento, testar sua funcionalidade é muito fácil com os testes E2E. Estes testes cobrem todas as partes da sua configuração para garantir que tudo funciona como esperado. Veja como executá-los:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Para obter instruções detalhadas e dicas de resolução de problemas, consulte o <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Guia de desenvolvimento do Milvus</a>.</p>
<p><strong>Dica profissional</strong></p>
<p>Se for novo no Milvus, comece com o Milvus Lite ou o modo Standalone para ter uma ideia das suas capacidades antes de passar para o modo Distributed para cargas de trabalho ao nível da produção.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Enviando seu código<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Parabéns! Você passou por todos os testes unitários e E2E (ou depurou e recompilou conforme necessário). Embora a primeira compilação possa levar algum tempo, as futuras serão muito mais rápidas - portanto, não precisa se preocupar. Com tudo aprovado, está pronto para submeter as suas alterações e contribuir para o Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Ligar o seu Pull Request (PR) a uma Issue</h3><p>Cada PR para o Milvus precisa de estar ligado a uma issue relevante. Aqui está como lidar com isso:</p>
<ul>
<li><p><strong>Verifique se há problemas existentes:</strong> Procure no<a href="https://github.com/milvus-io/milvus/issues"> rastreador de problemas do Milvus</a> para ver se já existe um problema relacionado com as suas alterações.</p></li>
<li><p><strong>Criar um novo problema:</strong> Se não existir um problema relevante, abra um novo e explique o problema que está a resolver ou a funcionalidade que está a adicionar.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Submeter o seu código</h3><ol>
<li><p><strong>Bifurcar o repositório:</strong> Comece por bifurcar o repositório<a href="https://github.com/milvus-io/milvus"> Milvus</a> na sua conta GitHub.</p></li>
<li><p><strong>Criar uma ramificação:</strong> Clone o seu fork localmente e crie um novo branch para as suas alterações.</p></li>
<li><p><strong>Faça o commit com a assinatura de desligamento:</strong> Certifique-se de que os seus commits incluem uma assinatura <code translate="no">Signed-off-by</code> para cumprir o licenciamento de código aberto:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Esta etapa certifica que sua contribuição está de acordo com o Certificado de Origem do Desenvolvedor (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Recursos úteis</strong></h4><p>Para obter passos detalhados e melhores práticas, consulte o<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Guia de Contribuição Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Oportunidades para Contribuir<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Parabéns - você tem o Milvus instalado e funcionando! Explorou os seus modos de implementação, executou os seus testes e talvez até tenha aprofundado o código. Agora está na altura de subir de nível: contribuir para o <a href="https://github.com/milvus-io/milvus">Milvus</a> e ajudar a moldar o futuro da IA e dos <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a>.</p>
<p>Independentemente das suas competências, há um lugar para si na comunidade Milvus! Quer seja um programador que adora resolver desafios complexos, um escritor de tecnologia que adora escrever documentação limpa ou blogues de engenharia, ou um entusiasta de Kubernetes que procura melhorar as implementações, há uma forma de causar impacto.</p>
<p>Dê uma vista de olhos às oportunidades abaixo e encontre a sua combinação perfeita. Cada contribuição ajuda a fazer avançar o Milvus - e quem sabe? O seu próximo pull request pode ser o motor da próxima onda de inovação. Então, de que está à espera? Vamos começar! 🚀</p>
<table>
<thead>
<tr><th>Projectos</th><th>Adequado para</th><th>Diretrizes</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Programadores Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Programadores CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Desenvolvedores interessados em outras linguagens</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Contribuindo para o PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Entusiastas de Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Escritores técnicos</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Contribuir para os documentos do milvus</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Programadores Web</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Uma palavra final<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus oferece vários <a href="https://milvus.io/docs/install-pymilvus.md">SDKs-Python</a> (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a>, e <a href="https://milvus.io/docs/install-node.md">Node.js-que</a>tornam simples começar a construir. Contribuir para o Milvus não se trata apenas de código - trata-se de se juntar a uma comunidade vibrante e inovadora.</p>
<p>Bem-vindo à comunidade de programadores Milvus e boa codificação! Mal podemos esperar para ver o que vais criar.</p>
<h2 id="Further-Reading" class="common-anchor-header">Ler mais<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Junte-se à comunidade Milvus de programadores de IA</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">O que são bases de dados vectoriais e como funcionam?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Autónomo vs. Distribuído: Qual é o modo certo para si? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Crie aplicativos de IA com o Milvus: tutoriais e notebooks</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modelos de IA de alto desempenho para seus aplicativos GenAI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">O que é RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centro de recursos de IA generativa | Zilliz</a></p></li>
</ul>
