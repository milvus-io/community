---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Tutorial prático: Crie um assistente de documentos com RAG em 10 minutos com
  Dify e Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Saiba como criar um assistente de documentos alimentado por IA utilizando o
  Retrieval Augmented Generation (RAG) com o Dify e o Milvus neste tutorial
  rápido e prático para programadores.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>E se pudesse transformar toda a sua biblioteca de documentação - milhares de páginas de especificações técnicas, wikis internas e documentação de código - num assistente de IA inteligente que responde instantaneamente a perguntas específicas?</p>
<p>Melhor ainda, e se pudesse construí-lo em menos tempo do que é necessário para corrigir um conflito de fusão?</p>
<p>Essa é a promessa do Retrieval <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Augmented Generation</a> (RAG) quando implementado da maneira correta.</p>
<p>Embora o ChatGPT e outros LLMs sejam impressionantes, eles rapidamente atingem seus limites quando questionados sobre a documentação, base de código ou base de conhecimento específicos da sua empresa. O RAG colmata esta lacuna ao integrar os seus dados proprietários na conversa, fornecendo-lhe capacidades de IA que são diretamente relevantes para o seu trabalho.</p>
<p>O problema? A implementação tradicional do RAG tem o seguinte aspeto:</p>
<ul>
<li><p>Escrever pipelines de geração de incorporação personalizados</p></li>
<li><p>Configurar e implementar uma base de dados de vectores</p></li>
<li><p>Conceber modelos complexos de pedidos</p></li>
<li><p>Criar lógica de recuperação e limiares de semelhança</p></li>
<li><p>Criar uma interface utilizável</p></li>
</ul>
<p>Mas e se pudesse passar diretamente para os resultados?</p>
<p>Neste tutorial, vamos criar uma aplicação RAG simples utilizando duas ferramentas centradas no programador:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Uma plataforma de código aberto que lida com a orquestração RAG com configuração mínima</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: um banco de dados vetorial de código aberto extremamente rápido, criado especificamente para pesquisa de similaridade e pesquisas de IA</p></li>
</ul>
<p>No final deste guia de 10 minutos, você terá um assistente de IA funcional que pode responder a perguntas detalhadas sobre qualquer coleção de documentos que você jogar nele - não é necessário um diploma de aprendizado de máquina.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">O que vai construir<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Em apenas alguns minutos de trabalho ativo, irá criar:</p>
<ul>
<li><p>Um pipeline de processamento de documentos que converte qualquer PDF em conhecimento consultável</p></li>
<li><p>Um sistema de pesquisa vetorial que encontra exatamente a informação certa</p></li>
<li><p>Uma interface de chatbot que responde a perguntas técnicas com precisão exacta</p></li>
<li><p>Uma solução implementável que pode integrar nas suas ferramentas existentes</p></li>
</ul>
<p>A melhor parte? A maior parte é configurada através de uma interface de utilizador (IU) simples em vez de código personalizado.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">O que você precisará<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Conhecimento básico do Docker (apenas <code translate="no">docker-compose up -d</code> nível)</p></li>
<li><p>Uma chave de API OpenAI</p></li>
<li><p>Um documento PDF para experimentar (vamos usar um artigo de pesquisa)</p></li>
</ul>
<p>Pronto para construir algo realmente útil em tempo recorde? Vamos começar!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Construir a sua aplicação RAG com Milvus e Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>Nesta secção, vamos construir uma aplicação RAG simples com a Dify, onde podemos fazer perguntas sobre a informação contida num trabalho de investigação. Para o artigo de investigação, pode utilizar qualquer artigo que deseje; no entanto, neste caso, utilizaremos o famoso artigo que nos apresentou a arquitetura Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;.</p>
<p>Utilizaremos o Milvus como armazenamento vetorial, onde guardaremos todos os contextos necessários. Para o modelo de incorporação e o LLM, utilizaremos modelos do OpenAI. Portanto, precisamos de configurar primeiro uma chave da API do OpenAI. Pode saber mais sobre a sua configuração<a href="https://platform.openai.com/docs/quickstart"> aqui</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Etapa 1: Iniciando os contêineres Dify e Milvus</h3><p>Neste exemplo, vamos auto-hospedar o Dify com o Docker Compose. Portanto, antes de começarmos, certifique-se de que o Docker esteja instalado em sua máquina local. Se não estiver, instale o Docker consultando<a href="https://docs.docker.com/desktop/"> sua página de instalação</a>.</p>
<p>Assim que tivermos o Docker instalado, precisamos clonar o código-fonte do Dify em nossa máquina local com o seguinte comando:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Em seguida, vá para o diretório <code translate="no">docker</code> dentro do código-fonte que você acabou de clonar. Aí, é necessário copiar o ficheiro <code translate="no">.env</code> com o seguinte comando:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Em poucas palavras, o ficheiro <code translate="no">.env</code> contém as configurações necessárias para colocar a sua aplicação Dify em funcionamento, como a seleção de bases de dados de vectores, as credenciais necessárias para aceder à sua base de dados de vectores, o endereço da sua aplicação Dify, etc.</p>
<p>Uma vez que vamos utilizar o Milvus como a nossa base de dados de vectores, temos de alterar o valor da variável <code translate="no">VECTOR_STORE</code> no ficheiro <code translate="no">.env</code> para <code translate="no">milvus</code>. Além disso, precisamos alterar a variável <code translate="no">MILVUS_URI</code> para <code translate="no">http://host.docker.internal:19530</code> para garantir que não haja problemas de comunicação entre os contêineres do Docker mais tarde, após a implantação.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Agora estamos prontos para iniciar os contêineres do Docker. Para isso, tudo o que precisamos fazer é executar o comando <code translate="no">docker compose up -d</code>. Depois que ele terminar, você verá uma saída semelhante no seu terminal, como abaixo:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Podemos verificar o status de todos os contêineres e ver se eles estão funcionando de forma saudável com o comando <code translate="no">docker compose ps</code>. Se estiverem todos saudáveis, verá uma saída como a que se segue:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>E, finalmente, se formos para<a href="http://localhost/install"> </a>http://localhost/install, verá uma página de destino da Dify onde podemos inscrever-nos e começar a construir a nossa aplicação RAG num instante.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois de se inscrever, você pode simplesmente fazer login no Dify com suas credenciais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Etapa 2: Configurando a chave da API OpenAI</h3><p>A primeira coisa que precisamos fazer depois de nos inscrevermos no Dify é configurar nossas chaves de API que usaremos para chamar o modelo de incorporação, bem como o LLM. Uma vez que vamos utilizar modelos do OpenAI, precisamos de inserir a nossa chave de API do OpenAI no nosso perfil. Para o fazer, vá a "Settings" (Definições) passando o cursor sobre o seu perfil no canto superior direito da IU, como pode ver na captura de ecrã abaixo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em seguida, vá para "Model Provider" (Provedor de modelo), passe o cursor sobre o OpenAI e clique em "Setup" (Configuração). Em seguida, você verá uma tela pop-up onde será solicitado que você insira sua chave de API OpenAI. Quando terminarmos, estaremos prontos para usar modelos do OpenAI como nosso modelo de incorporação e LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Etapa 3: Inserindo documentos na base de conhecimento</h3><p>Agora vamos armazenar a base de conhecimento para a nossa aplicação RAG. A base de conhecimento consiste em uma coleção de documentos ou textos internos que podem ser usados como contextos relevantes para ajudar o LLM a gerar respostas mais precisas.</p>
<p>No nosso caso de utilização, a nossa base de conhecimentos é essencialmente o documento "Atenção é tudo o que precisa". No entanto, não podemos armazenar o documento tal como está devido a várias razões. Primeiro, o artigo é demasiado longo e dar um contexto demasiado longo ao LLM não ajudaria, pois o contexto é demasiado amplo. Em segundo lugar, não podemos efetuar pesquisas de semelhança para obter o contexto mais relevante se a nossa entrada for texto em bruto.</p>
<p>Por isso, há pelo menos dois passos que precisamos de dar antes de armazenar o nosso artigo na base de conhecimentos. Primeiro, temos de dividir o artigo em partes de texto e, em seguida, transformar cada parte numa incorporação através de um modelo de incorporação. Finalmente, podemos armazenar estes embeddings no Milvus como a nossa base de dados vetorial.</p>
<p>A Dify facilita-nos a divisão dos textos do documento em partes e a sua transformação em embeddings. Tudo o que precisamos de fazer é carregar o ficheiro PDF do artigo, definir o comprimento do fragmento e escolher o modelo de incorporação através de um cursor. Para efetuar todos estes passos, vá a &quot;Conhecimento&quot; e, em seguida, clique em &quot;Criar conhecimento&quot;. Em seguida, ser-lhe-á pedido que carregue o ficheiro PDF a partir do seu computador local. Por isso, é preferível descarregar o artigo do ArXiv e guardá-lo primeiro no seu computador.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois de carregarmos o ficheiro, podemos definir o comprimento dos pedaços, o método de indexação, o modelo de incorporação que queremos utilizar e as definições de recuperação.</p>
<p>Na área "Chunk Setting" (Definição de pedaços), pode escolher qualquer número como comprimento máximo dos pedaços (no nosso caso, vamos defini-lo como 100). Em seguida, para "Index Method" (Método de indexação), temos de escolher a opção "High Quality" (Alta qualidade), uma vez que nos permitirá efetuar pesquisas de semelhança para encontrar contextos relevantes. Para "Embedding Model" (Modelo de incorporação), pode escolher qualquer modelo de incorporação do OpenAI que quiser, mas, neste exemplo, vamos utilizar o modelo text-embedding-3-small. Por fim, para "Retrieval Setting" (Definições de recuperação), temos de escolher "Vetor Search" (Pesquisa de vectores), uma vez que queremos efetuar pesquisas de semelhança para encontrar os contextos mais relevantes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora, se clicar em "Save &amp; Process" (Guardar e processar) e tudo correr bem, verá um visto verde como mostra a seguinte captura de ecrã:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Passo 4: Criar a aplicação RAG</h3><p>Até este ponto, criámos com êxito uma base de conhecimentos e armazenámo-la na nossa base de dados Milvus. Agora, estamos prontos para criar a aplicação RAG.</p>
<p>Criar a aplicação RAG com a Dify é muito simples. Temos de ir para "Studio" em vez de "Knowledge" como anteriormente e, em seguida, clicar em "Create from Blank". Em seguida, escolha "Chatbot" como o tipo de aplicação e dê um nome à sua aplicação no campo fornecido. Quando terminar, clique em "Criar". Agora verá a seguinte página:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No campo "Instruction" (Instrução), podemos escrever uma solicitação do sistema, como "Answer the query from the user concisely" (Responder à pergunta do utilizador de forma concisa). A seguir, em "Contexto", temos de clicar no símbolo "Adicionar" e, em seguida, adicionar a base de conhecimentos que acabámos de criar. Desta forma, a nossa aplicação RAG vai buscar possíveis contextos a esta base de conhecimentos para responder à consulta do utilizador.</p>
<p>Agora que adicionámos a base de conhecimentos à nossa aplicação RAG, a última coisa que temos de fazer é escolher o LLM do OpenAI. Para o fazer, pode clicar na lista de modelos disponível no canto superior direito, como pode ver na captura de ecrã abaixo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>E agora estamos prontos para publicar a nossa aplicação RAG! No canto superior direito, clique em "Publicar", e aí pode encontrar muitas formas de publicar a nossa aplicação RAG: podemos simplesmente executá-la num browser, incorporá-la no nosso sítio Web ou aceder à aplicação através da API. Neste exemplo, vamos apenas executar a nossa aplicação num browser, pelo que podemos clicar em &quot;Run App&quot;.</p>
<p>E já está! Agora pode perguntar ao LLM qualquer coisa relacionada com o documento "Atenção é tudo o que precisa" ou qualquer outro documento incluído na nossa base de dados de conhecimento.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Construiu uma aplicação RAG funcional utilizando Dify e Milvus, com um mínimo de código e configuração. Esta abordagem torna a complexa arquitetura RAG acessível aos programadores sem exigir conhecimentos profundos em bases de dados vectoriais ou integração LLM. Principais conclusões</p>
<ol>
<li><strong>Baixa sobrecarga de configuração</strong>: O uso do Docker Compose simplifica a implantação</li>
<li><strong>Orquestração sem código/baixo código</strong>: O Dify lida com a maior parte do pipeline RAG</li>
<li><strong>Banco de dados vetorial pronto para produção</strong>: O Milvus fornece armazenamento e recuperação de incorporação eficientes</li>
<li><strong>Arquitetura extensível</strong>: Fácil de adicionar documentos ou ajustar parâmetros Para a implantação na produção, considere:</li>
</ol>
<ul>
<li>Configurar a autenticação para a sua aplicação</li>
<li>Configurar o escalonamento adequado para o Milvus (especialmente para colecções de documentos maiores)</li>
<li>Implementar a monitorização para as suas instâncias Dify e Milvus</li>
<li>A combinação da Dify e do Milvus permite o rápido desenvolvimento de aplicações RAG que podem efetivamente alavancar o conhecimento interno da sua organização com modelos modernos de linguagem de grande dimensão (LLMs). Boa construção!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Recursos adicionais<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Documentação da Dify</a></li>
<li><a href="https://milvus.io/docs">Documentação do Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Fundamentos do banco de dados vetorial</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Padrões de implementação de RAG</a></li>
</ul>
