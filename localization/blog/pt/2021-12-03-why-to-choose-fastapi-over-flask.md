---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Por que escolher FastAPI em vez de Flask?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: escolher a estrutura adequada de acordo com o cenário da aplicação
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Para o ajudar a iniciar-se rapidamente no Milvus, a base de dados vetorial de código aberto, lançámos outro projeto de código aberto afiliado, o <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> no GitHub. O Milvus Bootcamp não só fornece scripts e dados para testes de benchmark, mas também inclui projectos que utilizam o Milvus para construir alguns MVPs (produtos mínimos viáveis), como um sistema de pesquisa de imagens invertido, um sistema de análise de vídeo, um chatbot de QA ou um sistema de recomendação. Pode aprender a aplicar a pesquisa de semelhanças vectoriais num mundo repleto de dados não estruturados e obter alguma experiência prática no Milvus Bootcamp.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Fornecemos serviços de front-end e back-end para os projectos do Milvus Bootcamp. No entanto, tomámos recentemente a decisão de mudar a estrutura Web adoptada de Flask para FastAPI.</p>
<p>Este artigo tem como objetivo explicar a nossa motivação para esta mudança na estrutura Web adoptada para o Milvus Bootcamp, esclarecendo por que razão escolhemos o FastAPI em vez do Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Frameworks web para Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma framework web refere-se a uma coleção de pacotes ou módulos. É um conjunto de arquitetura de software para desenvolvimento web que permite escrever aplicações ou serviços web e poupa o trabalho de lidar com detalhes de baixo nível, como protocolos, sockets ou gestão de processos/thread. A utilização de uma estrutura Web pode reduzir significativamente a carga de trabalho do desenvolvimento de aplicações Web, uma vez que pode simplesmente "ligar" o seu código à estrutura, sem necessidade de atenção adicional ao lidar com o armazenamento em cache de dados, o acesso à base de dados e a verificação da segurança dos dados. Para mais informações sobre o que é um framework web para Python, veja <a href="https://wiki.python.org/moin/WebFrameworks">Frameworks Web</a>.</p>
<p>Existem vários tipos de frameworks web Python. Os mais comuns incluem Django, Flask, Tornado e FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> é um microframework leve projetado para Python, com um núcleo simples e fácil de usar que permite que você desenvolva suas próprias aplicações web. Além disso, o núcleo do Flask também é extensível. Portanto, o Flask suporta a extensão sob demanda de diferentes funções para atender às suas necessidades personalizadas durante o desenvolvimento de aplicações web. Ou seja, com uma biblioteca de vários plug-ins no Flask, é possível desenvolver sites poderosos.</p>
<p>O Flask tem as seguintes caraterísticas:</p>
<ol>
<li>O Flask é um microframework que não depende de outras ferramentas específicas ou componentes de bibliotecas de terceiros para fornecer funcionalidades partilhadas. O Flask não tem uma camada de abstração de base de dados e não requer validação de formulários. No entanto, o Flask é altamente extensível e suporta a adição de funcionalidades de aplicação de uma forma semelhante às implementações dentro do próprio Flask. As extensões relevantes incluem mapeadores objeto-relacionais, validação de formulários, processamento de upload, tecnologias de autenticação aberta e algumas ferramentas comuns projetadas para estruturas web.</li>
<li>Flask é uma estrutura de aplicação web baseada em <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). A WSGI é uma interface simples que liga um servidor web a uma aplicação ou estrutura web definida para a linguagem Python.</li>
<li>O Flask inclui duas bibliotecas de funções principais, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> e <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug é um kit de ferramentas WSGI que implementa objetos de solicitação, resposta e funções práticas, o que permite construir estruturas web sobre ele. O Jinja2 é um popular motor de criação de modelos com todas as funcionalidades para Python. Tem suporte total para Unicode, com um ambiente de execução de sandbox integrado opcional, mas amplamente adotado.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> é uma estrutura de aplicação web Python moderna que tem o mesmo nível de alto desempenho que Go e NodeJS. O núcleo do FastAPI é baseado em <a href="https://www.starlette.io/">Starlette</a> e <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette é um kit de ferramentas de estrutura <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) leve para construir serviços <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> de alto desempenho. Pydantic é uma biblioteca que define a validação, serialização e documentação de dados com base em dicas de tipo Python.</p>
<p>FastAPI tem as seguintes caraterísticas:</p>
<ol>
<li>FastAPI é uma estrutura de aplicação web baseada em ASGI, uma interface de protocolo de gateway assíncrona que conecta serviços de protocolo de rede e aplicações Python. FastAPI pode lidar com uma variedade de tipos de protocolos comuns, incluindo HTTP, HTTP2 e WebSocket.</li>
<li>FastAPI é baseado em Pydantic, que fornece a função de verificar o tipo de dados da interface. Não é necessário verificar adicionalmente o parâmetro da interface ou escrever código adicional para verificar se os parâmetros estão vazios ou se o tipo de dados está correto. A utilização da FastAPI pode efetivamente evitar erros humanos no código e melhorar a eficiência do desenvolvimento.</li>
<li>O FastAPI suporta documentos em dois formatos - <a href="https://swagger.io/specification/">OpenAPI</a> (anteriormente Swagger) e <a href="https://www.redoc.com/">Redoc</a>. Por conseguinte, enquanto utilizador, não precisa de perder tempo a escrever documentos de interface adicionais. O documento OpenAPI fornecido pelo FastAPI é mostrado na captura de ecrã abaixo.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask vs. FastAPI</h3><p>A tabela abaixo demonstra as diferenças entre o Flask e o FastAPI em vários aspectos.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Interface gateway</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Estrutura assíncrona</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Desempenho</strong></td><td>Mais rápido</td><td>Mais lento</td></tr>
<tr><td><strong>Documento interativo</strong></td><td>OpenAPI, Redoc</td><td>Nenhum</td></tr>
<tr><td><strong>Verificação de dados</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Custos de desenvolvimento</strong></td><td>Inferior</td><td>Mais elevados</td></tr>
<tr><td><strong>Facilidade de utilização</strong></td><td>Inferior</td><td>Maior</td></tr>
<tr><td><strong>Flexibilidade</strong></td><td>Menos flexível</td><td>Mais flexível</td></tr>
<tr><td><strong>Comunidade</strong></td><td>Mais pequena</td><td>Mais ativa</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Porquê FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de decidir qual a framework de aplicação web Python a escolher para os projectos do Milvus Bootcamp, pesquisámos várias frameworks mainstream, incluindo Django, Flask, FastAPI, Tornado, entre outras. Uma vez que os projectos do Milvus Bootcamp servem de referência para si, a nossa prioridade é adotar uma estrutura externa com a máxima leveza e destreza. De acordo com esta regra, reduzimos as nossas escolhas a Flask e FastAPI.</p>
<p>Pode ver a comparação entre as duas frameworks web na secção anterior. Segue-se uma explicação detalhada da nossa motivação para escolher FastAPI em vez de Flask para os projectos do Milvus Bootcamp. Existem várias razões:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Desempenho</h3><p>A maior parte dos projectos do Bootcamp Milvus são construídos em torno de sistemas de pesquisa inversa de imagens, chatbots de QA, motores de pesquisa de texto, todos eles com elevadas exigências de processamento de dados em tempo real. Por conseguinte, precisamos de uma estrutura com um desempenho excecional, o que é exatamente o ponto alto do FastAPI. Por conseguinte, do ponto de vista do desempenho do sistema, decidimos escolher a FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Eficiência</h3><p>Ao utilizar o Flask, é necessário escrever código para a verificação do tipo de dados em cada uma das interfaces, para que o sistema possa determinar se os dados de entrada estão vazios ou não. No entanto, ao suportar a verificação automática do tipo de dados, a FastAPI ajuda a evitar erros humanos na codificação durante o desenvolvimento do sistema e pode aumentar muito a eficiência do desenvolvimento. O Bootcamp está posicionado como um tipo de recurso de formação. Isto significa que o código e os componentes que utilizamos devem ser intuitivos e altamente eficientes. Neste sentido, escolhemos a FastAPI para melhorar a eficiência do sistema e a experiência do utilizador.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Estrutura assíncrona</h3><p>A FastAPI é inerentemente uma estrutura assíncrona. Inicialmente, lançámos quatro <a href="https://zilliz.com/milvus-demos?isZilliz=true">demonstrações</a>, pesquisa inversa de imagens, análise de vídeo, chatbot de garantia de qualidade e pesquisa de semelhanças moleculares. Nestas demos, pode carregar conjuntos de dados e ser-lhe-á imediatamente solicitado &quot;pedido recebido&quot;. E quando os dados forem carregados para o sistema de demonstração, receberá outra mensagem &quot;carregamento de dados bem sucedido&quot;. Este é um processo assíncrono que requer uma estrutura que suporte esta funcionalidade. A FastAPI é, ela própria, uma estrutura assíncrona. Para alinhar todos os recursos do Milvus, decidimos adotar um único conjunto de ferramentas e software de desenvolvimento para o Milvus Bootcamp e para as demonstrações do Milvus. Como resultado, mudámos a estrutura de Flask para FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Documentos interactivos automáticos</h3><p>De uma forma tradicional, quando se termina de escrever o código para o lado do servidor, é necessário escrever um documento extra para criar uma interface e depois utilizar ferramentas como o <a href="https://www.postman.com/">Postman</a> para testar e depurar a API. Então, e se apenas quiser começar rapidamente com a parte de desenvolvimento do lado do servidor web dos projectos no Milvus Bootcamp sem escrever código adicional para criar uma interface? FastAPI é a solução. Ao fornecer um documento OpenAPI, a FastAPI pode poupar-lhe o trabalho de testar ou depurar APIs e colaborar com equipas de front-end para desenvolver uma interface de utilizador. Com a FastAPI, pode ainda experimentar rapidamente a aplicação construída com uma interface automática mas intuitiva, sem esforços adicionais de codificação.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Facilidade de utilização</h3><p>A FastAPI é mais fácil de utilizar e desenvolver, permitindo-lhe assim prestar mais atenção à implementação específica do próprio projeto. Sem gastar muito tempo no desenvolvimento de frameworks web, pode concentrar-se mais na compreensão dos projectos no Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Recapitulação<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask e FlastAPI têm seus próprios prós e contras. Como um framework de aplicação web emergente, FlastAPI, em seu núcleo, é construído em kits de ferramentas maduros e biblioteca, Starlette e Pydantic. FastAPI é uma estrutura assíncrona de alto desempenho. A sua destreza, extensibilidade e suporte para verificação automática do tipo de dados, juntamente com muitas outras caraterísticas poderosas, levaram-nos a adotar a FastAPI como a estrutura para os projectos Milvus Bootcamp.</p>
<p>Tenha em atenção que deve escolher a estrutura adequada de acordo com o cenário da sua aplicação se pretender criar um sistema de pesquisa de semelhanças vectoriais em produção.</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre o autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, engenheira de dados da Zilliz, licenciou-se em ciências informáticas na Universidade de Ciência e Tecnologia de Huazhong. Desde que se juntou à Zilliz, tem trabalhado na exploração de soluções para o projeto de código aberto Milvus e tem ajudado os utilizadores a aplicar o Milvus em cenários do mundo real. O seu foco principal é a PNL e os sistemas de recomendação, e gostaria de aprofundar ainda mais o seu foco nestas duas áreas. Gosta de passar tempo sozinha e de ler.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Está à procura de mais recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Comece a construir um sistema de IA com Milvus e obtenha mais experiência prática lendo os nossos tutoriais!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">O que é isto? Quem é ela? Milvus ajuda a analisar vídeos de forma inteligente</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinar modelos de IA para pesquisa de imagens utilizando ONNX e Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classificação de sequências de ADN com base em Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recuperação de áudio com base em Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 passos para criar um sistema de pesquisa de vídeos</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Criação de um sistema de controlo de qualidade inteligente com PNL e Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Acelerar a descoberta de novos medicamentos</a></li>
</ul></li>
<li><p>Envolva-se com a nossa comunidade de código aberto:</p>
<ul>
<li>Encontre ou contribua para o Milvus no <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://bit.ly/3qiyTEk">Fórum</a>.</li>
<li>Ligue-se a nós no <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
