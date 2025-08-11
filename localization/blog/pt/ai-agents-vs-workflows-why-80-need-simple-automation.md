---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  Agentes de IA ou fluxos de trabalho? Por que você deve ignorar os agentes para
  80% das tarefas de automação
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  A integração da Refly e da Milvus oferece uma abordagem pragmática à
  automatização - uma abordagem que valoriza a fiabilidade e a facilidade de
  utilização em detrimento de uma complexidade desnecessária.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>Os agentes de IA estão por todo o lado neste momento - desde copilotos de programação a bots de atendimento ao cliente - e podem ser extraordinariamente bons em raciocínios complexos. Tal como muitos de vós, eu adoro-os. Mas depois de criar agentes e fluxos de trabalho de automação, aprendi uma verdade simples: <strong>os agentes não são a melhor solução para todos os problemas.</strong></p>
<p>Por exemplo, quando criei um sistema multi-agente com CrewAI para descodificar ML, as coisas ficaram rapidamente confusas. Os agentes de investigação ignoravam os web crawlers 70% do tempo. Os agentes de resumo deixaram cair citações. A coordenação desmoronava-se sempre que as tarefas não eram muito claras.</p>
<p>E não é só nas experiências. Muitos de nós já andamos a saltar entre o ChatGPT para o brainstorming, o Claude para a codificação e meia dúzia de APIs para o processamento de dados - pensando calmamente: <em>tem de haver uma forma melhor de fazer com que tudo isto funcione em conjunto.</em></p>
<p>Por vezes, a resposta é um agente. Mais frequentemente, é um <strong>fluxo de trabalho de IA bem concebido</strong> que une as ferramentas existentes em algo poderoso, sem a complexidade imprevisível.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Criando fluxos de trabalho de IA mais inteligentes com Refly e Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sei que alguns de vós já estão a abanar a cabeça: "Fluxos de trabalho? Esses são rígidos. Não são suficientemente inteligentes para uma verdadeira automatização da IA". É justo - a maioria dos fluxos de trabalho são rígidos, porque são modelados de acordo com as linhas de montagem da velha escola: passo A → passo B → passo C, sem desvios permitidos.</p>
<p>Mas o verdadeiro problema não é a <em>ideia</em> dos fluxos de trabalho - é a <em>execução</em>. Não temos de nos contentar com condutas frágeis e lineares. Podemos conceber fluxos de trabalho mais inteligentes que se adaptem ao contexto, sejam flexíveis com a criatividade e ainda produzam resultados previsíveis.</p>
<p>Neste guia, vamos construir um sistema completo de criação de conteúdo usando Refly e Milvus para mostrar por que os fluxos de trabalho de IA podem superar arquiteturas complexas de vários agentes, especialmente se você se preocupa com velocidade, confiabilidade e facilidade de manutenção.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">As ferramentas que estamos a utilizar</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Uma plataforma de criação de conteúdo nativa de IA de código aberto, construída em torno de um conceito de "tela livre".</p>
<ul>
<li><p><strong>Principais recursos:</strong> tela inteligente, gerenciamento de conhecimento, diálogo multi-threaded e ferramentas de criação profissional.</p></li>
<li><p><strong>Porque é que é útil:</strong> A criação de fluxo de trabalho de arrastar e soltar permite encadear ferramentas em sequências de automação coesas, sem prendê-lo a uma execução rígida de caminho único.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: Uma base de dados vetorial de código aberto que lida com a camada de dados.</p>
<ul>
<li><p><strong>Por que é importante:</strong> A criação de conteúdo consiste principalmente em encontrar e recombinar informações existentes. As bases de dados tradicionais lidam bem com dados estruturados, mas a maior parte do trabalho criativo envolve formatos não estruturados - documentos, imagens, vídeos.</p></li>
<li><p><strong>O que acrescenta:</strong> O Milvus utiliza modelos de incorporação integrados para codificar dados não estruturados como vectores, permitindo a pesquisa semântica para que os seus fluxos de trabalho possam recuperar o contexto relevante com uma latência de milissegundos. Através de protocolos como o MCP, integra-se perfeitamente com as suas estruturas de IA, permitindo-lhe consultar dados em linguagem natural em vez de se debater com a sintaxe da base de dados.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configurar o seu ambiente</h3><p>Deixe-me guiá-lo na configuração deste fluxo de trabalho localmente.</p>
<p><strong>Lista de verificação de configuração rápida:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (ou Linux similar)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Uma chave de API de qualquer LLM que suporte chamadas de função. Neste guia, usarei o LLM do <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Requisitos do sistema</strong></p>
<ul>
<li><p>CPU: 8 núcleos no mínimo (16 núcleos recomendados)</p></li>
<li><p>Memória: 16GB mínimo (32GB recomendado)</p></li>
<li><p>Armazenamento: 100GB SSD mínimo (500GB recomendado)</p></li>
<li><p>Rede: É necessária uma ligação estável à Internet</p></li>
</ul>
<p><strong>Dependências de software</strong></p>
<ul>
<li><p>Sistema operativo: Linux (Ubuntu 20.04+ recomendado)</p></li>
<li><p>Containerização: Docker + Docker Compose</p></li>
<li><p>Python: Versão 3.11 ou superior</p></li>
<li><p>Modelo de linguagem: Qualquer modelo que suporte chamadas de função (serviços online ou implantação offline do Ollama funcionam)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Passo 1: Implementar a base de dados de vectores Milvus</h3><p><strong>1.1 Descarregar o Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Iniciar os serviços Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Passo 2: Implementar a plataforma Refly</h3><p><strong>2.1 Clonar o repositório</strong></p>
<p>Pode utilizar valores predefinidos para todas as variáveis de ambiente, exceto se tiver requisitos específicos:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Verificar o status do serviço</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Etapa 3: Configurar os serviços MCP</h3><p><strong>3.1 Descarregar o servidor Milvus MCP</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Iniciar o serviço MCP</strong></p>
<p>Este exemplo usa o modo SSE. Substitua o URI pelo seu ponto final de serviço Milvus disponível:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Confirmar que o serviço MCP está a funcionar</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Etapa 4: Configuração e instalação</h3><p>Agora que a sua infraestrutura está a funcionar, vamos configurar tudo para que funcione em conjunto sem problemas.</p>
<p><strong>4.1 Aceder à plataforma Refly</strong></p>
<p>Navegue até à sua instância local do Refly:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Crie a sua conta</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Configurar o seu modelo de idioma</strong></p>
<p>Para este guia, utilizaremos <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">o Moonshot</a>. Primeiro, registe-se e obtenha a sua chave de API.</p>
<p><strong>4.4 Adicionar o seu fornecedor de modelos</strong></p>
<p>Introduza a chave de API que obteve na etapa anterior:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Configurar o modelo LLM</strong></p>
<p>Certifique-se de que seleciona um modelo que suporta capacidades de chamada de funções, uma vez que isto é essencial para as integrações de fluxo de trabalho que vamos construir:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Integrar o serviço Milvus-MCP</strong></p>
<p>Note que a versão Web não suporta ligações do tipo stdio, pelo que utilizaremos o ponto final HTTP que configurámos anteriormente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ótimo! Com tudo configurado, vamos ver este sistema em ação através de alguns exemplos práticos.</p>
<p><strong>4.7 Exemplo: Recuperação eficiente de vectores com o MCP-Milvus-Server</strong></p>
<p>Este exemplo mostra como o <strong>MCP-Milvus-Server</strong> funciona como middleware entre os seus modelos de IA e as instâncias da base de dados vetorial Milvus. Ele age como um tradutor - aceitando solicitações de linguagem natural do seu modelo de IA, convertendo-as nas consultas corretas do banco de dados e retornando os resultados - para que seus modelos possam trabalhar com dados vetoriais sem conhecer nenhuma sintaxe de banco de dados.</p>
<p><strong>4.7.1 Criar uma nova tela</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Iniciar uma conversa</strong></p>
<p>Abra a interface de diálogo, selecione o seu modelo, introduza a sua pergunta e envie.</p>
<p><strong>4.7.3 Rever os resultados</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O que está a acontecer aqui é notável: acabámos de mostrar o controlo em linguagem natural de uma base de dados vetorial Milvus utilizando <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">o MCP-Milvus-Server</a> como camada de integração. Não há sintaxe de consulta complexa - basta dizer ao sistema o que precisa em inglês simples, e ele trata das operações da base de dados por si.</p>
<p><strong>4.8 Exemplo 2: Construindo um Guia de Implantação do Refly com Fluxos de Trabalho</strong></p>
<p>Este segundo exemplo mostra o verdadeiro poder da orquestração do fluxo de trabalho. Vamos criar um guia de implementação completo, combinando várias ferramentas de IA e fontes de dados num processo único e coerente.</p>
<p><strong>4.8.1 Reúna os seus materiais de origem</strong></p>
<p>O poder do Refly é a sua flexibilidade no tratamento de diferentes formatos de entrada. Pode importar recursos em vários formatos, quer se trate de documentos, imagens ou dados estruturados.</p>
<p><strong>4.8.2 Criar tarefas e ligar cartões de recursos</strong></p>
<p>Agora vamos criar o nosso fluxo de trabalho, definindo tarefas e ligando-as aos nossos materiais de origem.</p>
<p><strong>4.8.3 Configurar três tarefas de processamento</strong></p>
<p>É aqui que a abordagem do fluxo de trabalho realmente brilha. Em vez de tentar tratar de tudo num único processo complexo, dividimos o trabalho em três tarefas específicas que integram os materiais carregados e os refinam sistematicamente.</p>
<ul>
<li><p><strong>Tarefa de integração de conteúdos</strong>: Combina e estrutura os materiais de origem</p></li>
<li><p><strong>Tarefa de aperfeiçoamento de conteúdos</strong>: melhora a clareza e o fluxo</p></li>
<li><p><strong>Compilação do projeto final</strong>: Cria um resultado pronto para publicação</p></li>
</ul>
<p>Os resultados falam por si. O que teria levado horas de coordenação manual através de várias ferramentas é agora tratado automaticamente, com cada passo a basear-se logicamente no anterior.</p>
<p><strong>Capacidades de fluxo de trabalho multimodal:</strong></p>
<ul>
<li><p><strong>Geração e processamento de imagens</strong>: Integração com modelos de alta qualidade, incluindo flux-schnell, flux-pro e SDXL</p></li>
<li><p><strong>Geração e compreensão de vídeo</strong>: Suporte para vários modelos de vídeo estilizados, incluindo Seedance, Kling e Veo</p></li>
<li><p><strong>Ferramentas de geração de áudio</strong>: Geração de música através de modelos como Lyria-2 e síntese de voz através de modelos como Chatterbox</p></li>
<li><p><strong>Processamento integrado</strong>: Todas as saídas multimodais podem ser referenciadas, analisadas e reprocessadas dentro do sistema</p></li>
</ul>
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
    </button></h2><p>A integração do <strong>Refly</strong> e do <strong>Milvus</strong> oferece uma abordagem pragmática à automatização - uma abordagem que valoriza a fiabilidade e a facilidade de utilização em detrimento da complexidade desnecessária. Ao combinar a orquestração do fluxo de trabalho com o processamento multimodal, as equipas podem passar mais rapidamente do conceito à publicação, mantendo o controlo total em todas as fases.</p>
<p>Não se trata de rejeitar os agentes de IA. Eles são valiosos para lidar com problemas genuinamente complexos e imprevisíveis. Mas para muitas necessidades de automação - especialmente na criação de conteúdo e no processamento de dados - um fluxo de trabalho bem projetado pode oferecer melhores resultados com menos despesas.</p>
<p>À medida que a tecnologia de IA evolui, os sistemas mais eficazes irão provavelmente misturar ambas as estratégias:</p>
<ul>
<li><p><strong>Fluxos de trabalho</strong> em que a previsibilidade, a capacidade de manutenção e a reprodutibilidade são fundamentais.</p></li>
<li><p><strong>Agentes</strong> onde o raciocínio real, a adaptabilidade e a resolução de problemas sem limites são necessários.</p></li>
</ul>
<p>O objetivo não é construir a IA mais vistosa - é construir a mais <em>útil</em>. E muitas vezes, a solução mais útil é também a mais direta.</p>
