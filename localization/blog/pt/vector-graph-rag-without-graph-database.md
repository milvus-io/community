---
id: vector-graph-rag-without-graph-database.md
title: Construímos o Graph RAG sem o banco de dados de grafos
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  O Vetor Graph RAG de código aberto acrescenta raciocínio multi-hop ao RAG
  utilizando apenas o Milvus. 87,8% Recall@5, 2 chamadas LLM por consulta, sem
  necessidade de base de dados de grafos.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>Precisa de facto de uma base de dados de grafos para o Graph RAG? Não. Coloque entidades, relações e passagens no Milvus. Usar expansão de subgrafos em vez de travessia de grafos, e um rerank LLM em vez de loops de agentes em várias rodadas. Isso é o</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vetor Graph RAG</em></strong></a><strong><em>,</em></strong> <em>e foi o que construímos. Esta abordagem atinge uma média de 87,8% de Recall@5 em três benchmarks de QA multi-hop e supera o HippoRAG 2 numa única instância do Milvus.</em></p>
</blockquote>
<p>As perguntas multi-hop são a barreira que a maioria dos pipelines RAG acaba por atingir. A resposta está no seu corpus, mas abrange várias passagens ligadas por entidades que a pergunta nunca nomeia. A solução comum é adicionar uma base de dados de grafos, o que significa executar dois sistemas em vez de um.</p>
<p>Nós próprios estávamos sempre a bater nesta parede e não queríamos ter de correr duas bases de dados só para tratar disso. Então construímos e abrimos o <a href="https://github.com/zilliztech/vector-graph-rag">Vetor Graph RAG</a>, uma biblioteca Python que traz o raciocínio multi-hop para o <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> usando apenas <a href="https://milvus.io/docs">o Milvus</a>, o banco de dados vetorial de código aberto mais amplamente adotado. Ela fornece a mesma capacidade multi-hop com um banco de dados em vez de dois.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Por que as perguntas com múltiplos saltos quebram o RAG padrão<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>As perguntas com vários saltos quebram o RAG padrão porque a resposta depende de relacionamentos de entidades que a pesquisa vetorial não pode ver. A entidade ponte que liga a pergunta à resposta muitas vezes não está na própria pergunta.</p>
<p>As perguntas simples funcionam bem. Pode dividir os documentos em partes, incorporá-los, obter as correspondências mais próximas e enviá-las para um LLM. "Quais os índices suportados pelo Milvus?" está numa passagem e a pesquisa vetorial encontra-a.</p>
<p>As perguntas com vários saltos não se enquadram nesse padrão. Tomemos uma pergunta como <em>"Quais os efeitos secundários a que devo estar atento com os medicamentos de primeira linha para a diabetes?"</em> numa base de conhecimentos médicos.</p>
<p>Para responder a esta pergunta são necessários dois passos de raciocínio. Primeiro, o sistema tem de saber que a metformina é o medicamento de primeira linha para a diabetes. Só depois é que pode procurar os efeitos secundários da metformina: monitorização da função renal, desconforto gastrointestinal, deficiência de vitamina B12.</p>
<p>A "metformina" é a entidade de ligação. Liga a pergunta à resposta, mas a pergunta nunca a menciona.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>É aí que <a href="https://zilliz.com/learn/vector-similarity-search">a pesquisa de semelhanças do Vetor</a> pára. Recupera passagens que se parecem com a pergunta, guias de tratamento da diabetes e listas de efeitos secundários de medicamentos, mas não consegue seguir as relações entre entidades que ligam essas passagens. Factos como "a metformina é o medicamento de primeira linha para a diabetes" residem nessas relações e não no texto de uma única passagem.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Porque é que as bases de dados de grafos e o RAG agêntico não são a resposta<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>As formas padrão de resolver o RAG de múltiplos saltos são bancos de dados de grafos e loops de agentes iterativos. Ambas funcionam. Ambas custam mais do que a maioria das equipas quer pagar por uma única funcionalidade.</p>
<p>Primeiro, opte pelo caminho da base de dados de grafos. Extrai triplos dos seus documentos, armazena-os numa base de dados de grafos e percorre as arestas para encontrar ligações multi-hop. Isto significa executar um segundo sistema juntamente com a sua <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a>, aprender Cypher ou Gremlin e manter os armazenamentos de grafos e vectores sincronizados.</p>
<p>Os ciclos iterativos de agentes são a outra abordagem. O LLM recupera um lote, analisa-o, decide se tem contexto suficiente e, se não tiver, recupera-o novamente. <a href="https://arxiv.org/abs/2212.10509">O IRCoT</a> (Trivedi et al., 2023) faz 3-5 chamadas ao LLM por consulta. O RAG do agente pode exceder 10 porque o agente decide quando parar. O custo por consulta torna-se imprevisível e a latência do P99 aumenta sempre que o agente efectua rondas adicionais.</p>
<p>Nenhum deles se adequa a equipas que pretendam raciocínio multi-hop sem reconstruir a sua pilha. Por isso, tentámos outra coisa.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">O que é o Vetor Graph RAG, uma estrutura gráfica dentro de uma base de dados vetorial<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>O Vetor Graph RAG</strong></a> é uma biblioteca Python de código aberto que traz o raciocínio multi-hop para o <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> usando apenas <a href="https://milvus.io/docs">o Milvus</a>. Armazena a estrutura do grafo como referências de ID em três colecções Milvus. A travessia torna-se uma cadeia de pesquisas de chave primária no Milvus em vez de consultas Cypher numa base de dados de grafos. Um Milvus faz os dois trabalhos.</p>
<p>Funciona porque as relações num grafo de conhecimento são apenas texto. A tripla <em>(que é a metformina, o medicamento de primeira linha para a diabetes tipo 2)</em> é uma aresta direcionada numa base de dados gráfica. É também uma frase: "A metformina é o medicamento de primeira linha para a diabetes tipo 2". Pode incorporar essa frase como um vetor e armazená-la no <a href="https://milvus.io/docs">Milvus</a>, tal como qualquer outro texto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Responder a uma consulta multi-hop significa seguir as ligações entre o que a consulta menciona (como "diabetes") e o que não menciona (como "metformina"). Isso só funciona se o armazenamento preservar essas ligações: que entidade se liga a que entidade através de que relação. O texto simples é pesquisável, mas não é seguível.</p>
<p>Para manter as ligações seguíveis no Milvus, damos a cada entidade e a cada relação um ID único e depois guardamo-las em colecções separadas que se referem umas às outras pelo ID. Três colecções no total: <strong>entidades</strong> (os nós), <strong>relações</strong> (as arestas) e <strong>passagens</strong> (o texto de partida, de que o LLM precisa para gerar as respostas). Cada linha tem uma incorporação vetorial, pelo que podemos fazer uma pesquisa semântica em qualquer uma das três.</p>
<p><strong>As entidades</strong> armazenam entidades deduplicadas. Cada uma tem um ID único, uma <a href="https://zilliz.com/glossary/vector-embeddings">incorporação vetorial</a> para <a href="https://zilliz.com/glossary/semantic-search">pesquisa semântica</a> e uma lista de IDs de relações em que participa.</p>
<table>
<thead>
<tr><th>id</th><th>nome</th><th>incorporação</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformina</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>diabetes tipo 2</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>função renal</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>As relações</strong> armazenam triplas de conhecimento. Cada uma regista as suas IDs de entidade sujeito e objeto, as IDs de passagem de onde provém e uma incorporação do texto completo da relação.</p>
<table>
<thead>
<tr><th>id</th><th>sujeito_id</th><th>object_id</th><th>texto</th><th>incorporação</th><th>IDs_passagem</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>A metformina é o medicamento de primeira linha para a diabetes tipo 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Os doentes a tomar metformina devem ter a função renal monitorizada</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>As passagens</strong> armazenam blocos de documentos originais, com referências às entidades e relações extraídas dos mesmos.</p>
<p>As três colecções apontam umas para as outras através de campos de ID: as entidades transportam os IDs das suas relações, as relações transportam os IDs das suas entidades sujeito e objeto e das passagens de origem, e as passagens transportam os IDs de tudo o que delas foi extraído. Esta rede de referências de ID é o grafo.</p>
<p>A travessia é apenas uma cadeia de pesquisas de IDs. Vai buscar a entidade e01 para obter o seu <code translate="no">relation_ids</code>, vai buscar as relações r01 e r02 por esses IDs, lê o <code translate="no">object_id</code> de r01 para descobrir a entidade e02, e continua. Cada salto é uma <a href="https://milvus.io/docs/get-and-scalar-query.md">consulta de chave primária</a> Milvus padrão. Não é necessário Cypher.</p>
<p>Poderá perguntar-se se as viagens de ida e volta extra a Milvus fazem sentido. Não são. A expansão do subgrafo custa 2-3 consultas baseadas em IDs, totalizando 20-30ms. A chamada ao LLM leva de 1 a 3 segundos, o que torna as pesquisas de ID invisíveis ao lado dela.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Como o RAG de grafos vetoriais responde a uma consulta de múltiplos saltos<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>O fluxo de recuperação leva uma consulta multi-hop a uma resposta fundamentada em quatro passos: <strong>recuperação de sementes → expansão de subgrafos → rerank LLM → geração de respostas.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Iremos analisar a questão da diabetes: <em>"Quais os efeitos secundários a que devo estar atento com os medicamentos de primeira linha para a diabetes?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Passo 1: Recuperação de sementes</h3><p>Um LLM extrai entidades-chave da pergunta: "diabetes", "efeitos secundários", "medicamento de primeira linha". A pesquisa vetorial no Milvus encontra diretamente as entidades e relações mais relevantes.</p>
<p>Mas a metformina não está entre elas. A pergunta não a menciona, por isso a pesquisa vetorial não a consegue encontrar.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Passo 2: Expansão do subgrafo</h3><p>É aqui que o Vetor Graph RAG diverge do RAG padrão.</p>
<p>O sistema segue as referências de ID das entidades semente num salto. Ele obtém os IDs da entidade semente, encontra todas as relações que contêm esses IDs e puxa os novos IDs de entidade para o subgrafo. Predefinição: um salto.</p>
<p><strong>Metformina, a entidade ponte, entra no subgrafo.</strong></p>
<p>"Diabetes" tem uma relação: <em>"A metformina é o medicamento de primeira linha para a diabetes tipo 2".</em> Seguindo essa aresta, a metformina entra. Uma vez que a metformina está no subgrafo, as suas próprias relações vêm com ela: <em>"Os doentes que tomam metformina devem ter a função renal monitorizada", "A metformina pode causar desconforto gastrointestinal", "O uso prolongado de metformina pode levar à deficiência de vitamina B12".</em></p>
<p>Dois factos que viviam em passagens separadas estão agora ligados através de um salto de expansão gráfica. A entidade ponte que a pergunta nunca mencionou pode agora ser descoberta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Etapa 3: Rerank do LLM</h3><p>A expansão deixa-o com dezenas de relações candidatas. A maioria é ruído.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>O sistema envia estes candidatos e a pergunta original para um LLM: "Que se relacionam com os efeitos secundários dos medicamentos de primeira linha para a diabetes?" É uma chamada sem iteração.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>As relações selecionadas cobrem a cadeia completa: diabetes → metformina → monitorização dos rins / desconforto gastrointestinal / deficiência de B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Etapa 4: Geração de respostas</h3><p>O sistema recupera as passagens originais para as relações selecionadas e envia-as para o LLM.</p>
<p>O LLM gera a resposta a partir do texto completo da passagem, e não a partir dos triplos recortados. As triplas são resumos compactados. Elas não têm o contexto, as advertências e as especificidades que o LLM precisa para produzir uma resposta fundamentada.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Ver o Vetor Graph RAG em ação</h3><p>Também criamos uma interface interativa que visualiza cada etapa. Clique no painel de passos à esquerda e o gráfico actualiza-se em tempo real: laranja para os nós de semente, azul para os nós expandidos, verde para as relações selecionadas. Isto torna o fluxo de recuperação concreto em vez de abstrato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Porque é que uma reavaliação é melhor do que várias iterações<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>O nosso pipeline efectua duas chamadas LLM por consulta: uma para o rerank, outra para a geração. Os sistemas iterativos como o IRCoT e o Agentic RAG fazem 3 a 10+ chamadas porque fazem um ciclo: recuperar, raciocinar, recuperar novamente. Saltamos o ciclo porque a pesquisa vetorial e a expansão do subgrafo cobrem a semelhança semântica e as ligações estruturais numa só passagem, dando ao LLM candidatos suficientes para terminar numa rerank.</p>
<table>
<thead>
<tr><th>Abordagem</th><th>Chamadas ao LLM por consulta</th><th>Perfil de latência</th><th>Custo relativo da API</th></tr>
</thead>
<tbody>
<tr><td>Gráfico vetorial RAG</td><td>2 (rerank + gerar)</td><td>Fixo, previsível</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variável</td><td>~2-3x</td></tr>
<tr><td>RAG autêntico</td><td>5-10+</td><td>Imprevisível</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>Na produção, isso representa um custo de API aproximadamente 60% menor, respostas 2-3 vezes mais rápidas e latência previsível. Não há picos de surpresa quando um agente decide executar rodadas extras.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Resultados de benchmark<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>O Vetor Graph RAG tem uma média de 87,8% de Recall@5 em três benchmarks padrão de QA multi-hop, igualando ou superando todos os métodos que testamos, incluindo o HippoRAG 2, com apenas Milvus e 2 chamadas LLM.</p>
<p>Avaliámos o MuSiQue (2-4 saltos, o mais difícil), o HotpotQA (2 saltos, o mais utilizado) e o 2WikiMultiHopQA (2 saltos, raciocínio entre documentos). A métrica é Recall@5: se as passagens de apoio corretas aparecem nos 5 principais resultados recuperados.</p>
<p>Utilizámos exatamente os mesmos triplos pré-extraídos do <a href="https://github.com/OSU-NLP-Group/HippoRAG">repositório HippoRAG</a> para uma comparação justa. Sem re-extração, sem pré-processamento personalizado. A comparação isola o próprio algoritmo de recuperação.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header">RAG<a href="https://github.com/zilliztech/vector-graph-rag">de gráfico vetorial</a> vs RAG padrão (ingénuo)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Vetor Graph RAG aumenta a média de Recall@5 de 73,4% para 87,8%, uma melhoria de 19,6 pontos percentuais.</p>
<ul>
<li>MuSiQue: maior ganho (+31,4 pp). 3-4 hop benchmark, as perguntas multi-hop mais difíceis, e exatamente onde a expansão do subgrafo tem o maior impacto.</li>
<li>2WikiMultiHopQA: melhoria acentuada (+27,7 pp). Raciocínio entre documentos, outro ponto ideal para a expansão de subgrafos.</li>
<li>HotpotQA: ganho menor (+6,1 pp), mas o RAG padrão já obtém 90,8% neste conjunto de dados. O teto é baixo.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">RAG de gráfico vetorial</a> versus métodos de última geração (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Vetor Graph RAG obtém a pontuação média mais elevada, 87,8%, contra HippoRAG 2, IRCoT e NV-Embed-v2.</p>
<p>Referência por referência:</p>
<ul>
<li>HotpotQA: empata com HippoRAG 2 (ambos 96,3%)</li>
<li>2WikiMultiHopQA: lidera por 3,7 pontos (94,1% vs 90,4%)</li>
<li>MuSiQue (o mais difícil): fica atrás por 1,7 pontos (73,0% vs 74,7%)</li>
</ul>
<p>O Vetor Graph RAG atinge estes números com apenas 2 chamadas LLM por consulta, sem base de dados de grafos e sem ColBERTv2. Ele é executado na infraestrutura mais simples da comparação e ainda assim obtém a média mais alta.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Como <a href="https://github.com/zilliztech/vector-graph-rag">o RAG de grafos vetoriais</a> se compara a outras abordagens de RAG de grafos<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Diferentes abordagens de Graph RAG otimizam para diferentes problemas. O Vetor Graph RAG foi criado para QA de vários saltos de produção com custo previsível e infraestrutura simples.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>RAG de gráfico vetorial</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infraestrutura</strong></td><td>BD de grafos + BD de vectores</td><td>ColBERTv2 + gráfico em memória</td><td>BD vetorial + agentes multi-round</td><td><strong>Apenas Milvus</strong></td></tr>
<tr><td><strong>Chamadas LLM por consulta</strong></td><td>Varia</td><td>Moderado</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Melhor para</strong></td><td>Sumarização global de corpus</td><td>Recuperação académica de granularidade fina</td><td>Exploração complexa e aberta</td><td><strong>Controlo de qualidade multi-hop de produção</strong></td></tr>
<tr><td><strong>Preocupação com a escala</strong></td><td>Indexação LLM dispendiosa</td><td>Gráfico completo na memória</td><td>Latência e custo imprevisíveis</td><td><strong>Escala com Milvus</strong></td></tr>
<tr><td><strong>Complexidade de configuração</strong></td><td>Alta</td><td>Média-alta</td><td>Média</td><td><strong>Baixa (instalação pip)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">O Microsoft GraphRAG</a> usa o agrupamento de comunidade hierárquica para responder a perguntas de resumo global como "quais são os principais temas neste corpus?". Esse é um problema diferente do QA multi-hop&quot;.</p>
<p><a href="https://arxiv.org/abs/2502.14802">O HippoRAG 2</a> (Gutierrez et al., 2025) usa recuperação de inspiração cognitiva com correspondência de nível de token ColBERTv2. Carregar o gráfico completo na memória limita a escalabilidade.</p>
<p>As abordagens iterativas, como o <a href="https://arxiv.org/abs/2212.10509">IRCoT</a>, trocam a simplicidade da infraestrutura pelo custo do LLM e pela latência imprevisível.</p>
<p>O Vetor Graph RAG tem como alvo a produção de QA multi-hop: equipes que desejam custo e latência previsíveis sem adicionar um banco de dados de gráficos.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Quando usar o Vetor Graph RAG e os principais casos de uso<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>O Vetor Graph RAG foi criado para quatro tipos de cargas de trabalho:</p>
<table>
<thead>
<tr><th>Cenário</th><th>Por que ele se encaixa</th></tr>
</thead>
<tbody>
<tr><td><strong>Documentos com grande volume de conhecimento</strong></td><td>Códigos legais com referências cruzadas, literatura biomédica com cadeias droga-gene-doença, registos financeiros com ligações empresa-pessoa-evento, documentos técnicos com gráficos de dependência de API</td></tr>
<tr><td><strong>Perguntas de 2-4 saltos</strong></td><td>As perguntas de um salto funcionam bem com o RAG padrão. Cinco ou mais saltos podem precisar de métodos iterativos. O intervalo de 2-4 saltos é o ponto ideal da expansão de subgrafos.</td></tr>
<tr><td><strong>Implementação simples</strong></td><td>Uma base de dados, um <code translate="no">pip install</code>, nenhuma infraestrutura de grafos para aprender</td></tr>
<tr><td><strong>Sensibilidade ao custo e à latência</strong></td><td>Duas chamadas LLM por consulta, fixas e previsíveis. Com milhares de consultas diárias, a diferença aumenta.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Introdução ao Vetor Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> sem argumentos tem como padrão o <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Ele cria um arquivo local <code translate="no">.db</code>, como o SQLite. Não há servidor para iniciar, nada para configurar.</p>
<p><code translate="no">add_texts()</code> chama um LLM para extrair triplas do seu texto, vetoriza-as e armazena tudo no Milvus. <code translate="no">query()</code> executa o fluxo completo de recuperação em quatro etapas: seed, expand, rerank, generate.</p>
<p>Para produção, troque um parâmetro URI. O resto do código permanece o mesmo:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Para importar PDFs, páginas Web ou ficheiros Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>O Graph RAG não precisa de um banco de dados de grafos. O Vetor Graph RAG armazena a estrutura do grafo como referências de ID em três colecções Milvus, o que transforma a travessia do grafo em pesquisas de chave primária e mantém cada consulta multi-hop em duas chamadas LLM fixas.</p>
<p>Em resumo:</p>
<ul>
<li>Biblioteca Python de código aberto. Raciocínio multi-hop apenas em Milvus.</li>
<li>Três colecções ligadas por ID. Entidades (nós), relações (arestas), passagens (texto de partida). A expansão do subgrafo segue os IDs para descobrir entidades-ponte que a consulta não menciona.</li>
<li>Duas chamadas LLM por consulta. Um rerank, uma geração. Sem iteração.</li>
<li>87,8% de Recall@5 médio no MuSiQue, HotpotQA e 2WikiMultiHopQA, igualando ou superando o HippoRAG 2 em dois dos três.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Experimente:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vetor-graph-rag</a> para o código</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Documentos</a> para a API completa e exemplos</li>
<li>Junte-se à <a href="https://discord.com/invite/8uyFbECzPX">comunidade</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">no Discord</a> para fazer perguntas e partilhar comentários</li>
<li><a href="https://milvus.io/office-hours">Marque uma sessão Milvus Office Hours</a> para analisar o seu caso de utilização</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> oferece um nível gratuito com Milvus gerido se preferir saltar a configuração da infraestrutura</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">PERGUNTAS FREQUENTES<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Posso fazer Graph RAG apenas com uma base de dados vetorial?</h3><p>Sim. O Vetor Graph RAG armazena a estrutura do gráfico de conhecimento (entidades, relações e suas conexões) dentro de três coleções Milvus ligadas por referências cruzadas de ID. Em vez de percorrer arestas numa base de dados de grafos, encadeia pesquisas de chaves primárias no Milvus para expandir um subgrafo em torno de entidades semente. Isto atinge uma média de 87,8% de Recall@5 em três benchmarks multi-hop padrão sem qualquer infraestrutura de base de dados de grafos.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Como o Vetor Graph RAG se compara ao Microsoft GraphRAG?</h3><p>Eles resolvem problemas diferentes. O Microsoft GraphRAG usa o agrupamento hierárquico de comunidades para resumo global de corpus ("Quais são os principais temas desses documentos?"). O Vetor Graph RAG foca-se na resposta a perguntas multi-hop, em que o objetivo é encadear factos específicos em passagens. O Vetor Graph RAG necessita apenas do Milvus e de duas chamadas LLM por consulta. O Microsoft GraphRAG requer uma base de dados de grafos e tem custos de indexação mais elevados.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Que tipos de perguntas beneficiam do RAG de vários saltos?</h3><p>O RAG multi-hop ajuda com perguntas em que a resposta depende da conexão de informações dispersas em várias passagens, especialmente quando uma entidade-chave nunca aparece na pergunta. Exemplos incluem "Que efeitos secundários tem o medicamento de primeira linha para a diabetes?" (requer a descoberta da metformina como ponte), pesquisas de referências cruzadas em textos legais ou regulamentares e rastreio de cadeias de dependência em documentação técnica. O RAG padrão lida bem com pesquisas de um único facto. O RAG multi-hop acrescenta valor quando o caminho de raciocínio tem dois a quatro passos.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Preciso de extrair manualmente os triplos do gráfico de conhecimento?</h3><p>Não. <code translate="no">add_texts()</code> e <code translate="no">add_documents()</code> chamam automaticamente um LLM para extrair entidades e relacionamentos, vetorizá-los e armazená-los no Milvus. É possível importar documentos a partir de URLs, PDFs e ficheiros DOCX utilizando a ferramenta integrada <code translate="no">DocumentImporter</code>. Para a avaliação comparativa ou migração, a biblioteca suporta a importação de triplas pré-extraídas de outras estruturas como o HippoRAG.</p>
