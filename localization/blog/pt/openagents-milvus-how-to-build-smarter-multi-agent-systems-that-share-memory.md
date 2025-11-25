---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: Como construir sistemas multiagentes mais inteligentes
  que partilham memória
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Explore como o OpenAgents permite a colaboração multiagente distribuída,
  porque é que o Milvus é essencial para adicionar memória escalável e como
  construir um sistema completo.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>A maioria dos desenvolvedores começa seus sistemas agênticos com um único agente e só mais tarde percebe que basicamente construiu um chatbot muito caro. Para tarefas simples, um agente do tipo ReAct funciona bem, mas rapidamente atinge os seus limites: não consegue executar passos em paralelo, perde o controlo de cadeias de raciocínio longas e tende a desmoronar-se quando se adicionam demasiadas ferramentas à mistura. As configurações multiagente prometem resolver isto, mas trazem os seus próprios problemas: sobrecarga de coordenação, transferências frágeis e um contexto partilhado crescente que corrói silenciosamente a qualidade do modelo.</p>
<p><a href="https://github.com/OpenAgentsInc">O OpenAgents</a> é uma estrutura de código aberto para a construção de sistemas multiagentes em que os agentes de IA trabalham em conjunto, partilham recursos e lidam com projectos de longo prazo em comunidades persistentes. Em vez de um único orquestrador central, o OpenAgents permite que os agentes colaborem de uma forma mais distribuída: podem descobrir-se uns aos outros, comunicar e coordenar-se em torno de objectivos partilhados.</p>
<p>Em conjunto com o banco de dados vetorial <a href="https://milvus.io/">Milvus</a>, esse pipeline ganha uma camada de memória de longo prazo escalável e de alto desempenho. O Milvus alimenta a memória do agente com pesquisa semântica rápida, opções de indexação flexíveis, como HNSW e IVF, e isolamento limpo por meio de particionamento, para que os agentes possam armazenar, recuperar e reutilizar o conhecimento sem se afogar no contexto ou pisar nos dados uns dos outros.</p>
<p>Nesta postagem, veremos como o OpenAgents permite a colaboração multiagente distribuída, por que o Milvus é uma base crítica para a memória escalável de agentes e como montar esse sistema passo a passo.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Desafios na construção de sistemas de agentes do mundo real<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitos dos principais frameworks de agentes atuais - LangChain, AutoGen, CrewAI e outros - são construídos em torno de um modelo <strong>centrado em tarefas</strong>. Você cria um conjunto de agentes, dá a eles um trabalho, talvez defina um fluxo de trabalho, e os deixa trabalhar. Isto funciona bem para casos de utilização restritos ou de curta duração, mas em ambientes de produção reais, expõe três limitações estruturais:</p>
<ul>
<li><p><strong>O conhecimento permanece em silos.</strong> A experiência de um agente está confinada à sua própria implantação. Um agente de revisão de código na engenharia não partilha o que aprende com um agente da equipa de produto que avalia a viabilidade. Cada equipa acaba por reconstruir o conhecimento a partir do zero, o que é ineficiente e frágil.</p></li>
<li><p><strong>A colaboração é rígida.</strong> Mesmo em estruturas multi-agente, a colaboração depende normalmente de fluxos de trabalho definidos antecipadamente. Quando a colaboração precisa de mudar, estas regras estáticas não se podem adaptar, tornando todo o sistema menos flexível.</p></li>
<li><p><strong>A falta de um estado persistente.</strong> A maioria dos agentes segue um ciclo de vida simples: <em>iniciar → executar → encerrar.</em> Esquecem-se de tudo entre execuções - contexto, relações, decisões tomadas e histórico de interações. Sem um estado persistente, os agentes não podem construir memória de longo prazo ou evoluir seu comportamento.</p></li>
</ul>
<p>Estes problemas estruturais resultam do facto de tratar os agentes como executores de tarefas isoladas em vez de participantes numa rede colaborativa mais ampla.</p>
<p>A equipa OpenAgents acredita que os futuros sistemas de agentes precisam de mais do que um raciocínio mais forte - precisam de um mecanismo que permita que os agentes se descubram uns aos outros, construam relações, partilhem conhecimentos e trabalhem em conjunto de forma dinâmica. E, criticamente, isso não deve depender de um único controlador central. A Internet funciona porque é distribuída - nenhum nó único dita tudo, e o sistema torna-se mais robusto e escalável à medida que cresce. Os sistemas multiagentes beneficiam do mesmo princípio de conceção. É por isso que o OpenAgents elimina a ideia de um orquestrador todo-poderoso e, em vez disso, permite a cooperação descentralizada e orientada para a rede.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">O que é o OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>O OpenAgents é uma estrutura de código aberto para a criação de redes de agentes de IA que permite a colaboração aberta, onde os agentes de IA trabalham em conjunto, partilham recursos e lidam com projectos de longo prazo. Fornece a infraestrutura para uma Internet de agentes - onde os agentes colaboram abertamente com milhões de outros agentes em comunidades persistentes e em crescimento. A nível técnico, o sistema está estruturado em torno de três componentes principais: <strong>Rede de Agentes, Mods de Rede e Transportes.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Rede de Agentes: Um ambiente partilhado para colaboração</h3><p>Uma rede de agentes é um ambiente partilhado onde vários agentes podem ligar-se, comunicar e trabalhar em conjunto para resolver tarefas complexas. As suas principais caraterísticas incluem:</p>
<ul>
<li><p><strong>Operação persistente:</strong> Uma vez criada, a rede permanece online independentemente de qualquer tarefa ou fluxo de trabalho.</p></li>
<li><p><strong>Agente dinâmico:</strong> Os agentes podem aderir a qualquer momento utilizando uma ID de rede; não é necessário pré-registo.</p></li>
<li><p><strong>Suporte multi-protocolo:</strong> Uma camada de abstração unificada suporta a comunicação através de WebSocket, gRPC, HTTP e libp2p.</p></li>
<li><p><strong>Configuração autónoma:</strong> Cada rede mantém suas próprias permissões, governança e recursos.</p></li>
</ul>
<p>Com apenas uma linha de código, é possível criar uma rede, e qualquer agente pode entrar imediatamente através de interfaces padrão.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Mods de rede: Extensões plugáveis para colaboração</h3><p>Os Mods fornecem uma camada modular de recursos de colaboração que permanecem desacoplados do sistema principal. Pode misturar e combinar Mods com base nas suas necessidades específicas, permitindo padrões de colaboração adaptados a cada caso de utilização.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Objetivo</strong></th><th><strong>Casos de uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Mensagens do espaço de trabalho</strong></td><td>Comunicação de mensagens em tempo real</td><td>Respostas em fluxo contínuo, feedback instantâneo</td></tr>
<tr><td><strong>Fórum</strong></td><td>Discussão assíncrona</td><td>Revisões de propostas, deliberação em várias rondas</td></tr>
<tr><td><strong>Wiki</strong></td><td>Base de conhecimentos partilhada</td><td>Consolidação de conhecimentos, colaboração em documentos</td></tr>
<tr><td><strong>Social</strong></td><td>Gráfico de relações</td><td>Encaminhamento de especialistas, redes de confiança</td></tr>
</tbody>
</table>
<p>Todos os Mods funcionam num sistema de eventos unificado, o que facilita a extensão da estrutura ou a introdução de comportamentos personalizados sempre que necessário.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transportes: Um canal de comunicação independente de protocolo</h3><p>Os transportes são os protocolos de comunicação que permitem que agentes heterogéneos se liguem e troquem mensagens dentro de uma rede OpenAgents. O OpenAgents suporta múltiplos protocolos de transporte que podem ser executados simultaneamente dentro da mesma rede, incluindo</p>
<ul>
<li><p><strong>HTTP/REST</strong> para integração ampla e entre linguagens</p></li>
<li><p><strong>WebSocket</strong> para comunicação bidirecional e de baixa latência</p></li>
<li><p><strong>gRPC</strong> para RPC de alto desempenho adequado a clusters de grande escala</p></li>
<li><p><strong>libp2p</strong> para redes descentralizadas e peer-to-peer</p></li>
<li><p><strong>A2A</strong>, um protocolo emergente projetado especificamente para comunicação agente a agente</p></li>
</ul>
<p>Todos os transportes operam através de um formato de mensagem unificado baseado em eventos, permitindo uma tradução perfeita entre protocolos. Não precisa de se preocupar com o protocolo utilizado por um agente de pares - a estrutura trata disso automaticamente. Os agentes criados em qualquer linguagem ou estrutura podem participar de uma rede OpenAgents sem reescrever o código existente.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Integração do OpenAgents com o Milvus para memória agêntica de longo prazo<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>O OpenAgents resolve o desafio de como os agentes <strong>se comunic</strong>am <strong>, descobrem uns aos outros e colaboram - mas</strong>a colaboração por si só não é suficiente. Os agentes geram insights, decisões, histórico de conversas, resultados de ferramentas e conhecimento específico do domínio. Sem uma camada de memória persistente, tudo isso se evapora no momento em que um agente é desligado.</p>
<p>É aqui que <strong>o Milvus</strong> se torna essencial. O Milvus fornece o armazenamento vetorial de alto desempenho e a recuperação semântica necessários para transformar as interações dos agentes em memória duradoura e reutilizável. Quando integrado à rede OpenAgents, ele oferece três grandes vantagens:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Pesquisa semântica</strong></h4><p>O Milvus proporciona uma pesquisa semântica rápida utilizando algoritmos de indexação como o HNSW e o IVF_FLAT. Os agentes podem recuperar os registos históricos mais relevantes com base no significado e não em palavras-chave, permitindo-lhes</p>
<ul>
<li><p>recordar decisões ou planos anteriores,</p></li>
<li><p>evitar a repetição de trabalho,</p></li>
<li><p>manter um contexto de longo prazo em todas as sessões.</p></li>
</ul>
<p>Esta é a espinha dorsal da <em>memória agêntica</em>: recuperação rápida, relevante e contextual.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Escalabilidade horizontal à escala de milhares de milhões</strong></h4><p>Redes de agentes reais geram grandes quantidades de dados. Milvus foi construído para operar confortavelmente nesta escala, oferecendo</p>
<ul>
<li><p>armazenamento e pesquisa em milhares de milhões de vectores,</p></li>
<li><p>latência &lt; 30 ms mesmo com recuperação Top-K de alto rendimento,</p></li>
<li><p>uma arquitetura totalmente distribuída que se dimensiona linearmente à medida que a procura aumenta.</p></li>
</ul>
<p>Quer tenha uma dúzia de agentes ou milhares a trabalhar em paralelo, o Milvus mantém a recuperação rápida e consistente.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Isolamento de vários inquilinos</strong></h4><p>Milvus fornece isolamento granular multi-tenant através de <strong>Partition Key</strong>, um mecanismo de particionamento leve que segmenta a memória dentro de uma única coleção. Isso permite:</p>
<ul>
<li><p>diferentes equipas, projectos ou comunidades de agentes mantenham espaços de memória independentes,</p></li>
<li><p>uma sobrecarga drasticamente menor em comparação com a manutenção de várias colecções,</p></li>
<li><p>recuperação opcional entre partições quando é necessário conhecimento partilhado.</p></li>
</ul>
<p>Este isolamento é crucial para grandes implementações multi-agente onde os limites dos dados devem ser respeitados sem comprometer a velocidade de recuperação.</p>
<p>O OpenAgents liga-se ao Milvus através de <strong>Mods personalizados</strong> que chamam diretamente as APIs do Milvus. As mensagens dos agentes, os resultados das ferramentas e os registos de interação são automaticamente incorporados nos vectores e armazenados no Milvus. Os programadores podem personalizar:</p>
<ul>
<li><p>o modelo de incorporação,</p></li>
<li><p>o esquema de armazenamento e os metadados,</p></li>
<li><p>e estratégias de recuperação (por exemplo, pesquisa híbrida, pesquisa particionada).</p></li>
</ul>
<p>Isto dá a cada comunidade de agentes uma camada de memória que é escalável, persistente e optimizada para raciocínio semântico.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Como criar um Chatbot multiagente com OpenAgent e Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para tornar as coisas concretas, vamos fazer uma demonstração: construir uma <strong>comunidade de suporte ao desenvolvedor</strong> onde vários agentes especializados - especialistas em Python, especialistas em banco de dados, engenheiros de DevOps e outros - colaboram para responder a perguntas técnicas. Em vez de depender de um único agente generalista sobrecarregado, cada especialista contribui com um raciocínio específico do domínio, e o sistema encaminha automaticamente as consultas para o agente mais adequado.</p>
<p>Este exemplo demonstra como integrar <strong>o Milvus</strong> numa implementação OpenAgents para fornecer memória de longo prazo para perguntas e respostas técnicas. As conversas dos agentes, as soluções anteriores, os registos de resolução de problemas e as consultas dos utilizadores são todos convertidos em embeddings vectoriais e armazenados no Milvus, dando à rede a capacidade de</p>
<ul>
<li><p>lembrar respostas anteriores,</p></li>
<li><p>reutilizar explicações técnicas anteriores,</p></li>
<li><p>manter a consistência entre sessões, e</p></li>
<li><p>melhorar ao longo do tempo à medida que mais interações se acumulam.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Pré-requisitos</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Definir dependências</h3><p>Defina os pacotes Python necessários para o projeto:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Variáveis de ambiente</h3><p>Aqui está o modelo para a configuração do seu ambiente:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Configure sua rede OpenAgents</h3><p>Defina a estrutura da sua rede de agentes e suas configurações de comunicação:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Implementar a Colaboração Multi-Agente</h3><p>A seguir, são mostrados trechos de código principais (não a implementação completa).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Criar e ativar um ambiente virtual</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Instalar dependências</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurar chaves de API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Iniciar a rede OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Iniciar o Serviço Multi-Agente</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Iniciar o OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Acessar o Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Verificar o estado dos agentes e da rede:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>O OpenAgents fornece a camada de coordenação que permite que os agentes descubram uns aos outros, se comuniquem e colaborem, enquanto o Milvus resolve o problema igualmente crítico de como o conhecimento é armazenado, compartilhado e reutilizado. Ao fornecer uma camada de memória vetorial de elevado desempenho, o Milvus permite que os agentes criem um contexto persistente, recordem interações passadas e acumulem conhecimentos ao longo do tempo. Juntos, levam os sistemas de IA para além dos limites dos modelos isolados e em direção ao potencial de colaboração mais profundo de uma verdadeira rede multiagente.</p>
<p>Naturalmente, nenhuma arquitetura multiagente está isenta de compromissos. A execução de agentes em paralelo pode aumentar o consumo de tokens, os erros podem ocorrer em cascata entre agentes e a tomada simultânea de decisões pode levar a conflitos ocasionais. Estas são áreas activas de investigação e melhoria contínua - mas não diminuem o valor da construção de sistemas que podem coordenar, lembrar e evoluir.</p>
<p>Pronto para dar aos seus agentes uma memória de longo prazo?</p>
<p>Explore <a href="https://milvus.io/">o Milvus</a> e tente integrá-lo no seu próprio fluxo de trabalho.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registre problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
