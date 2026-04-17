---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Produção de pesquisa semântica: Como criámos e escalámos a infraestrutura de
  vectores na Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Saiba como a Airtable criou uma infraestrutura vetorial escalável baseada em
  Milvus para pesquisa semântica, recuperação multilocatário e experiências de
  IA de baixa latência.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Este post foi originalmente publicado no</em> <em>canal</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>e é republicado aqui com permissão.</em></p>
<p>À medida que a pesquisa semântica na Airtable evoluía de um conceito para uma caraterística central do produto, a equipa de Infraestrutura de Dados enfrentou o desafio de a escalar. Conforme detalhado no nosso <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">post anterior sobre a construção do sistema de incorporação</a>, já tínhamos concebido uma camada de aplicação robusta e eventualmente consistente para lidar com o ciclo de vida da incorporação. Mas ainda faltava uma peça fundamental no nosso diagrama de arquitetura: a própria base de dados vetorial.</p>
<p>Precisávamos de um motor de armazenamento capaz de indexar e servir milhares de milhões de incorporações, suportando uma multilocação massiva e mantendo objectivos de desempenho e disponibilidade num ambiente de nuvem distribuído. Esta é a história de como arquitectámos, reforçámos e desenvolvemos a nossa plataforma de pesquisa vetorial para se tornar um pilar central da pilha de infra-estruturas da Airtable.</p>
<h2 id="Background" class="common-anchor-header">Histórico<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Na Airtable, o nosso objetivo é ajudar os clientes a trabalhar com os seus dados de forma poderosa e intuitiva. Com o surgimento de LLMs cada vez mais poderosos e precisos, os recursos que aproveitam o significado semântico dos seus dados tornaram-se essenciais para o nosso produto.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Como utilizamos a pesquisa semântica<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (o chat de IA da Airtable) a responder a perguntas reais de grandes conjuntos de dados</h3><p>Imagine fazer uma pergunta em linguagem natural à sua base (banco de dados) com meio milhão de linhas e obter uma resposta correta e rica em contexto. Por exemplo:</p>
<p>"O que é que os clientes têm dito ultimamente sobre a duração da bateria?"</p>
<p>Em pequenos conjuntos de dados, é possível enviar todas as linhas diretamente para um LLM. Em escala, isso rapidamente se torna inviável. Em vez disso, precisávamos de um sistema capaz de:</p>
<ul>
<li>Entender a intenção semântica de uma consulta</li>
<li>Recuperar as linhas mais relevantes através da pesquisa de semelhança de vectores</li>
<li>Fornecer essas linhas como contexto para um LLM</li>
</ul>
<p>Este requisito moldou quase todas as decisões de design que se seguiram: O Omni tinha de ser instantâneo e inteligente, mesmo em bases muito grandes.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Recomendações de registos ligados: Significado em vez de correspondências exactas</h3><p>A pesquisa semântica também melhora uma caraterística essencial do Airtable: registos ligados. Os utilizadores precisam de sugestões de relações baseadas no contexto e não em correspondências de texto exactas. Por exemplo, a descrição de um projeto pode implicar uma relação com "Team Infrastructure" sem nunca utilizar essa frase específica.</p>
<p>A entrega dessas sugestões sob demanda requer recuperação semântica de alta qualidade com latência consistente e previsível.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Nossas prioridades de design<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Para suportar estas caraterísticas e outras mais, ancorámos o sistema em 4 objectivos:</p>
<ul>
<li><strong>Consultas de baixa latência (500ms p99):</strong> o desempenho previsível é fundamental para a confiança do utilizador</li>
<li><strong>Escritas de alto rendimento:</strong> as bases mudam constantemente e os embeddings têm de se manter sincronizados</li>
<li><strong>Escalabilidade horizontal:</strong> o sistema deve suportar milhões de bases independentes</li>
<li><strong>Auto-hospedagem:</strong> todos os dados dos clientes devem permanecer dentro da infraestrutura controlada pela Airtable</li>
</ul>
<p>Estes objectivos moldaram todas as decisões arquitectónicas que se seguiram.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Avaliação de fornecedores de bases de dados vectoriais<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>No final de 2024, avaliamos várias opções de banco de dados vetorial e, por fim, selecionamos <a href="https://milvus.io/">o Milvus</a> com base em três requisitos principais.</p>
<ul>
<li>Primeiro, priorizamos uma solução auto-hospedada para garantir a privacidade dos dados e manter o controle refinado de nossa infraestrutura.</li>
<li>Em segundo lugar, a nossa carga de trabalho de escrita pesada e os padrões de consulta intermitentes exigiam um sistema que pudesse escalar elasticamente, mantendo uma latência baixa e previsível.</li>
<li>Por fim, a nossa arquitetura exigia um forte isolamento entre milhões de clientes inquilinos.</li>
</ul>
<p><strong>O Milvus</strong> surgiu como a melhor opção: a sua natureza distribuída suporta multi-tenancy massivo e permite-nos escalar a ingestão, a indexação e a execução de consultas de forma independente, proporcionando desempenho e mantendo os custos previsíveis.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Desenho da arquitetura<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de escolher uma tecnologia, tivemos de determinar uma arquitetura para representar a forma única dos dados da Airtable: milhões de "bases" distintas pertencentes a diferentes clientes.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">O desafio do particionamento<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Avaliámos duas estratégias principais de particionamento de dados:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Opção 1: Partições partilhadas</h3><p>Várias bases partilham uma partição e as consultas são delimitadas através da filtragem de um ID de base. Isso melhora a utilização de recursos, mas introduz uma sobrecarga adicional de filtragem e torna a exclusão de bases mais complexa.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Opção 2: Uma base por partição</h3><p>Cada base Airtable é mapeada para sua própria partição física no Milvus. Isto proporciona um forte isolamento, permite uma eliminação rápida e simples da base e evita o impacto no desempenho da filtragem pós-consulta.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Estratégia final</h3><p>Escolhemos a opção 2 por sua simplicidade e forte isolamento. No entanto, os primeiros testes mostraram que a criação de 100 mil partições numa única coleção Milvus causava uma degradação significativa do desempenho:</p>
<ul>
<li>A latência de criação de partições aumentou de ~20 ms para ~250 ms</li>
<li>O tempo de carregamento das partições excedeu 30 segundos</li>
</ul>
<p>Para resolver este problema, limitámos o número de partições por coleção. Para cada cluster Milvus, criamos 400 coleções, cada uma com no máximo 1.000 partições. Isso limita o número total de bases por cluster a 400k, e novos clusters são provisionados à medida que clientes adicionais são integrados.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indexação e recuperação<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>A escolha do índice acabou por ser um dos compromissos mais importantes do nosso sistema. Quando uma partição é carregada, seu índice é armazenado em cache na memória ou no disco. Para encontrar um equilíbrio entre a taxa de recuperação, o tamanho do índice e o desempenho, avaliámos vários tipos de índices.</p>
<ul>
<li><strong>IVF-SQ8:</strong> Oferece um pequeno espaço de memória, mas menor recuperação.</li>
<li><strong>HNSW:</strong> Oferece a melhor recuperação (99%-100%), mas consome muita memória.</li>
<li><strong>DiskANN:</strong> oferece uma recuperação semelhante ao HNSW, mas com maior latência de consulta</li>
</ul>
<p>Em última análise, selecionámos o HNSW pelas suas caraterísticas superiores de recuperação e desempenho.</p>
<h2 id="The-Application-layer" class="common-anchor-header">A camada de aplicação<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Em alto nível, o pipeline de pesquisa semântica do Airtable envolve dois fluxos principais:</p>
<ol>
<li><strong>Fluxo de ingestão:</strong> Converte as linhas do Airtable em embeddings e armazena-as no Milvus</li>
<li><strong>Fluxo de consulta:</strong> Incorporar as consultas do utilizador, obter IDs de linhas relevantes e fornecer contexto ao LLM</li>
</ol>
<p>Ambos os fluxos têm de funcionar de forma contínua e fiável em grande escala. A seguir, apresentamos cada um deles.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Fluxo de ingestão: manter o Milvus em sincronia com o Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando um utilizador abre o Omni, o Airtable começa a sincronizar a sua base com o Milvus. Criamos uma partição e, em seguida, processamos as linhas em partes, gerando embeddings e upserting no Milvus. A partir daí, capturamos todas as alterações feitas na base e reincorporamos e inserimos essas linhas para manter os dados consistentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Fluxo de consulta: como utilizamos os dados<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>No lado da consulta, incorporamos o pedido do utilizador e enviamo-lo para o Milvus para obter os IDs de linha mais relevantes. De seguida, vamos buscar as versões mais recentes dessas linhas e incluímo-las como contexto no pedido ao LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Desafios operacionais e como os resolvemos<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir uma arquitetura de pesquisa semântica é um desafio; executá-la de forma fiável para centenas de milhares de bases é outro. Abaixo estão algumas das principais lições operacionais que aprendemos ao longo do caminho.</p>
<h3 id="Deployment" class="common-anchor-header">Implantação</h3><p>Implantamos o Milvus por meio de seu CRD Kubernetes com o <a href="https://github.com/zilliztech/milvus-operator">operador Milvus</a>, o que nos permite definir e gerenciar clusters de forma declarativa. Cada alteração, quer se trate de uma atualização de configuração, de uma melhoria do cliente ou de uma atualização do Milvus, passa por testes unitários e por um teste de carga a pedido que simula o tráfego de produção antes de ser implementado nos utilizadores.</p>
<p>Na versão 2.5, o cluster Milvus é composto por estes componentes principais:</p>
<ul>
<li>Os nós de consulta guardam os índices vectoriais na memória e executam pesquisas vectoriais</li>
<li>Os nós de dados tratam da ingestão e compactação e persistem os novos dados no armazenamento</li>
<li>Os nós de índice criam e mantêm índices vectoriais para manter a pesquisa rápida à medida que os dados crescem</li>
<li>O Nó Coordenador orquestra toda a atividade do cluster e a atribuição de fragmentos</li>
<li>Os nós proxy encaminham o tráfego da API e equilibram a carga entre os nós</li>
<li>O Kafka fornece o backbone de registo/streaming para mensagens internas e fluxo de dados</li>
<li>O Etcd armazena os metadados do cluster e o estado de coordenação</li>
</ul>
<p>Com a automação orientada por CRD e um pipeline de testes rigoroso, podemos implementar atualizações com rapidez e segurança.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Observabilidade: Entendendo a integridade do sistema de ponta a ponta<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Monitoramos o sistema em dois níveis para garantir que a pesquisa semântica permaneça rápida e previsível.</p>
<p>No nível da infraestrutura, rastreamos a CPU, o uso de memória e a integridade do pod em todos os componentes do Milvus. Estes sinais dizem-nos se o cluster está a funcionar dentro de limites seguros e ajudam-nos a detetar problemas como a saturação de recursos ou nós não saudáveis antes de afectarem os utilizadores.</p>
<p>Na camada de serviço, concentramo-nos na forma como cada base está a acompanhar as nossas cargas de trabalho de ingestão e consulta. Métricas como compactação e taxa de transferência de indexação nos dão visibilidade da eficiência com que os dados estão sendo ingeridos. As taxas de sucesso das consultas e a latência dão-nos uma ideia da experiência do utilizador ao consultar os dados, e o crescimento da partição permite-nos saber como os nossos dados estão a crescer, para que sejamos alertados se precisarmos de escalar.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Rotação de nós<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Por motivos de segurança e conformidade, fazemos a rotação regular dos nós do Kubernetes. Em um cluster de pesquisa vetorial, isso não é trivial:</p>
<ul>
<li>À medida que os nós de consulta são girados, o coordenador reequilibrará os dados na memória entre os nós de consulta</li>
<li>O Kafka e o Etcd armazenam informações com estado e exigem quorum e disponibilidade contínua</li>
</ul>
<p>Resolvemos este problema com orçamentos de interrupção rigorosos e uma política de rotação de um nó de cada vez. O coordenador do Milvus tem tempo para se reequilibrar antes que o próximo nó seja substituído. Esta orquestração cuidadosa preserva a fiabilidade sem diminuir a nossa velocidade.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Descarregamento de partições frias<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma das nossas maiores vitórias operacionais foi reconhecer que os nossos dados têm padrões claros de acesso quente/frio. Ao analisar o uso, descobrimos que apenas ~25% dos dados no Milvus são gravados ou lidos numa determinada semana. O Milvus permite-nos descarregar partições inteiras, libertando memória nos Query Nodes. Se esses dados forem necessários mais tarde, podemos recarregá-los em segundos. Isto permite-nos manter os dados quentes na memória e descarregar o resto, reduzindo os custos e permitindo-nos escalar de forma mais eficiente ao longo do tempo.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Recuperação de dados<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de lançar o Milvus em larga escala, precisávamos de ter a certeza de que poderíamos recuperar rapidamente de qualquer cenário de falha. Embora a maioria dos problemas seja coberta pela tolerância a falhas incorporada no cluster, também planeámos casos raros em que os dados podem ficar corrompidos ou o sistema pode entrar num estado irrecuperável.</p>
<p>Nessas situações, nosso caminho de recuperação é simples. Primeiro, criamos um novo cluster Milvus para que possamos retomar o serviço de tráfego quase imediatamente. Assim que o novo cluster estiver operacional, reintegramos proactivamente as bases mais utilizadas e, em seguida, processamos preguiçosamente as restantes à medida que são acedidas. Isto minimiza o tempo de inatividade dos dados mais acedidos enquanto o sistema reconstrói gradualmente um índice semântico consistente.</p>
<h2 id="What’s-Next" class="common-anchor-header">O que vem a seguir<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>O nosso trabalho com a <a href="https://milvus.io/">Milvus</a> estabeleceu uma base sólida para a pesquisa semântica na Airtable: proporcionar experiências de IA rápidas e significativas em escala. Com este sistema implementado, estamos agora a explorar pipelines de recuperação mais ricos e integrações de IA mais profundas em todo o produto. Há muito trabalho empolgante pela frente, e estamos apenas a começar.</p>
<p><em>Agradecemos a todos os Airtablets da Infraestrutura de Dados, antigos e actuais, e a toda a organização que contribuíram para este projeto: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Sobre a Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">A Airtable</a> é uma plataforma líder de operações digitais que permite às organizações criar aplicações personalizadas, automatizar fluxos de trabalho e gerir dados partilhados à escala empresarial. Concebida para suportar processos complexos e multifuncionais, a Airtable ajuda as equipas a criar sistemas flexíveis de planeamento, coordenação e execução numa fonte de verdade partilhada. À medida que a Airtable expande a sua plataforma alimentada por IA, tecnologias como a Milvus desempenham um papel importante no reforço da infraestrutura de recuperação necessária para proporcionar experiências de produto mais rápidas e inteligentes.</p>
