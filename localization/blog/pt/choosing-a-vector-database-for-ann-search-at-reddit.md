---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Escolher uma base de dados de vectores para a pesquisa ANN no Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  Esta publicação descreve o processo que a equipa do Reddit utilizou para
  selecionar a base de dados de vectores mais adequada e porque escolheu o
  Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Este post foi escrito por Chris Fournie, o engenheiro de software da equipa do Reddit, e publicado originalmente no</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>, e é republicado aqui com permissão.</p>
<p>Em 2024, as equipas do Reddit utilizaram uma variedade de soluções para realizar a pesquisa vetorial aproximada do vizinho mais próximo (ANN). Desde a <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">pesquisa de vectores Vertex AI</a> da Google e a experimentação da <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">pesquisa de vectores ANN do Apache Solr</a> para alguns conjuntos de dados maiores, até à <a href="https://github.com/facebookresearch/faiss">biblioteca FAISS</a> do Facebook para conjuntos de dados mais pequenos (alojados em carros laterais de escala vertical). Cada vez mais equipes do Reddit queriam uma solução de pesquisa vetorial ANN com amplo suporte, que fosse econômica, tivesse os recursos de pesquisa desejados e pudesse ser dimensionada para dados do tamanho do Reddit. Para atender a essa necessidade, em 2025, procuramos o banco de dados vetorial ideal para as equipes do Reddit.</p>
<p>Este post descreve o processo que usamos para selecionar o melhor banco de dados vetorial para as necessidades atuais do Reddit. Não descreve a melhor base de dados vetorial em geral, nem o conjunto mais essencial de requisitos funcionais e não funcionais para todas as situações. Ele descreve o que o Reddit e sua cultura de engenharia valorizaram e priorizaram ao selecionar um banco de dados vetorial. Esta publicação pode servir de inspiração para a sua própria recolha e avaliação de requisitos, mas cada organização tem a sua própria cultura, valores e necessidades.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Processo de avaliação<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>No geral, as etapas de seleção foram:</p>
<p>1. Recolher o contexto das equipas</p>
<p>2. Avaliar qualitativamente as soluções</p>
<p>3. Avaliar quantitativamente os melhores candidatos</p>
<p>4. Seleção final</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Recolher o contexto das equipas</h3><p>Foram recolhidos três elementos de contexto das equipas interessadas em realizar a pesquisa vetorial ANN:</p>
<ul>
<li><p>Requisitos funcionais (por exemplo, pesquisa híbrida vetorial e lexical? Consultas de pesquisa de intervalo? Filtragem por atributos não vectoriais?)</p></li>
<li><p>Requisitos não funcionais (por exemplo, pode suportar vetores 1B? Pode atingir uma latência &lt;100ms P99?)</p></li>
<li><p>As equipas de bases de dados vectoriais já estavam interessadas</p></li>
</ul>
<p>Entrevistar equipas para obter requisitos não é trivial. Muitos descreverão suas necessidades em termos de como estão resolvendo um problema atualmente, e seu desafio é entender e remover esse viés.</p>
<p>Por exemplo, uma equipa já estava a utilizar o FAISS para a pesquisa de vectores ANN e afirmou que a nova solução deve devolver eficientemente 10K resultados por chamada de pesquisa. Após uma discussão mais aprofundada, a razão para os 10K resultados era que precisavam de efetuar uma filtragem post-hoc, e o FAISS não oferece filtragem de resultados ANN no momento da consulta. O problema real era que precisavam de filtragem, pelo que qualquer solução que oferecesse uma filtragem eficiente seria suficiente, e o envio de 10 mil resultados era simplesmente uma solução alternativa necessária para melhorar a sua recordação. Idealmente, gostariam de pré-filtrar toda a coleção antes de encontrar os vizinhos mais próximos.</p>
<p>Pedir as bases de dados de vectores que as equipas já utilizavam ou nas quais estavam interessadas também foi útil. Se pelo menos uma equipa tiver uma opinião positiva sobre a sua solução atual, é um sinal de que a base de dados vetorial pode ser uma solução útil a partilhar por toda a empresa. Se as equipas só tiverem opiniões negativas sobre uma solução, então não a devemos incluir como opção. Aceitar soluções em que as equipas estavam interessadas foi também uma forma de garantir que as equipas se sentiam incluídas no processo e ajudou-nos a formar uma lista inicial dos principais candidatos a avaliar; existem demasiadas soluções de pesquisa vetorial ANN em bases de dados novas e existentes para as testar exaustivamente.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Avaliar qualitativamente as soluções</h3><p>Começando com a lista de soluções em que as equipas estavam interessadas, para avaliar qualitativamente qual a solução de pesquisa vetorial ANN que melhor se adequava às nossas necessidades, nós:</p>
<ul>
<li><p>Pesquisámos cada solução e classificámos o seu grau de cumprimento de cada requisito em função da importância ponderada desse requisito</p></li>
<li><p>Removemos soluções com base em critérios qualitativos e discussão</p></li>
<li><p>Selecionámos as N melhores soluções para testar quantitativamente</p></li>
</ul>
<p>A nossa lista inicial de soluções de pesquisa vetorial ANN incluía</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Pesquisa aberta</p></li>
<li><p>Pgvector (já utilizava Postgres como RDBMS)</p></li>
<li><p>Redis (já utilizado como armazenamento e cache de KV)</p></li>
<li><p>Cassandra (já utilizado para pesquisa não-ANA)</p></li>
<li><p>Solr (já utilizado para pesquisa lexical e experimentado com pesquisa vetorial)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (já utilizado para pesquisa vetorial ANN)</p></li>
</ul>
<p>Em seguida, pegámos em todos os requisitos funcionais e não funcionais mencionados pelas equipas, mais algumas restrições que representavam os nossos valores e objectivos de engenharia, criámos essas linhas numa folha de cálculo e avaliámos a sua importância (de 1 a 3; apresentada na tabela resumida abaixo).</p>
<p>Para cada solução que estávamos a comparar, avaliámos (numa escala de 0 a 3) até que ponto cada sistema satisfazia esse requisito (como se mostra na tabela abaixo). A pontuação desta forma era algo subjectiva, pelo que escolhemos um sistema e demos exemplos de pontuações com uma justificação escrita e pedimos aos revisores que se referissem a esses exemplos. Também demos a seguinte orientação para a atribuição de cada valor de pontuação: atribuir este valor se:</p>
<ul>
<li><p>0: Sem suporte/evidência de suporte a requisitos</p></li>
<li><p>1: Suporte básico ou inadequado do requisito</p></li>
<li><p>2: Requisito razoavelmente suportado</p></li>
<li><p>3: Suporte robusto de requisitos que vai além de soluções comparáveis</p></li>
</ul>
<p>Em seguida, criamos uma pontuação geral para cada solução, obtendo a soma do produto da pontuação do requisito de uma solução e a importância desse requisito (por exemplo, Qdrant obteve pontuação 3 para reclassificação/combinação de pontuação, que tem importância 2, então 3 x 2 = 6, repita isso para todas as linhas e some tudo). No final, temos uma pontuação geral que pode ser usada como base para classificar e discutir soluções, e quais requisitos são mais importantes (observe que a pontuação não é usada para tomar uma decisão final, mas como uma ferramenta de discussão).</p>
<p><strong><em>Nota do editor:</em></strong> <em>Esta análise foi baseada no Milvus 2.4. Desde então, lançámos o Milvus 2.5, o Milvus</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>2.6</em></a><em> e o Milvus 3.0 está mesmo ao virar da esquina, pelo que alguns números podem estar desactualizados. Mesmo assim, a comparação continua a oferecer uma boa visão e continua a ser muito útil.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Categoria</strong></td><td><strong>Importância</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Tipo de pesquisa</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Pesquisa híbrida</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pesquisa por palavra-chave</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Pesquisa NN aproximada</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pesquisa de alcance</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Rearranjo/combinação de pontuação</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Método de indexação</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Suporta múltiplos métodos de indexação</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Quantização</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Agrupamento sensível à localidade (LSH)</td><td>1</td><td>0</td><td>0Nota: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 suporta-o. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Dados</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tipos de vectores diferentes de float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Atributos de metadados em vectores (suporta múltiplos atributos, um tamanho de registo grande, etc.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Opções de filtragem de metadados (pode filtrar metadados, tem filtragem pré/pós)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Tipos de dados de atributos de metadados (esquema robusto, por exemplo, bool, int, string, json, arrays)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Limites de atributos de metadados (consultas de intervalo, por exemplo, 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversidade de resultados por atributo (por exemplo, obter não mais de N resultados de cada subreddit numa resposta)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Escala</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Centenas de milhões de índices vectoriais</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Índice vetorial do bilião</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Vectores de apoio com pelo menos 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Vectores de suporte superiores a 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latência 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latência &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99,9% de disponibilidade recuperação</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99,99% de disponibilidade de indexação/armazenamento</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operações de armazenamento</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hospedável no AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-região</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Actualizações com tempo de inatividade zero</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Múltiplas nuvens</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>APIs/Bibliotecas</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>API RESTful</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Ir para a biblioteca</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Biblioteca Java</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Outras línguas (C++, Ruby, etc.)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operações em tempo de execução</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Métricas do Prometheus</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Operações básicas de BD</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Sobreposições</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Operador de Kubernetes</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Paginação dos resultados</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Incorporação da pesquisa por ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Devolver Embeddings com ID do candidato e pontuações do candidato</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ID fornecido pelo utilizador</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Capaz de pesquisar em contexto de lote em grande escala</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Cópias de segurança / Instantâneos: suporta a capacidade de criar cópias de segurança de toda a base de dados</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Suporte eficiente de grandes índices (distinção entre armazenamento frio e quente)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Apoio/Comunidade</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Neutralidade do fornecedor</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Suporte robusto da API</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Apoio do fornecedor</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Velocidade da Comunidade</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Base de utilizadores de produção</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Sentimento da comunidade</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Estrelas do Github</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Configuração</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tratamento de segredos</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Fonte</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Fonte aberta</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Língua</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Lançamentos</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ensaios a montante</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Disponibilidade de documentação</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Custo</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Custo efetivo</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Desempenho</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Suporte para ajustar a utilização de recursos para CPU, memória e disco</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Fragmentação de vários nós (pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ter a capacidade de ajustar o sistema para equilibrar a latência e o débito</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Partição definida pelo utilizador (escritas)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-tenant</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Partição</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replicação</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redundância</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Failover automático</td><td>3</td><td>2</td><td>0 Nota: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 suporta-o. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Balanceamento de carga</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Suporte de GPU</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Pontuações globais da solução</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Discutimos as pontuações globais e dos requisitos dos vários sistemas e procurámos perceber se tínhamos ponderado adequadamente a importância dos requisitos e se alguns requisitos eram tão importantes que deviam ser considerados restrições fundamentais. Um desses requisitos que identificámos foi o facto de a solução ser ou não de código aberto, porque desejávamos uma solução com a qual nos pudéssemos envolver, contribuir e resolver rapidamente pequenos problemas se os tivéssemos na nossa escala. Contribuir e utilizar software de código aberto é uma parte importante da cultura de engenharia do Reddit. Isso eliminou as soluções somente hospedadas (Vertex AI, Pinecone) de nossa consideração.</p>
<p>Durante as discussões, descobrimos que alguns outros requisitos-chave eram de grande importância para nós:</p>
<ul>
<li><p>Escala e confiabilidade: queríamos ver evidências de outras empresas executando a solução com mais de 100 milhões ou até 1 bilhão de vetores</p></li>
<li><p>Comunidade: Queríamos uma solução com uma comunidade saudável e com muito dinamismo neste espaço em rápido amadurecimento</p></li>
<li><p>Tipos de metadados e filtragem expressivos para permitir mais dos nossos casos de utilização (filtragem por data, booleana, etc.)</p></li>
<li><p>Suporte para vários tipos de índices (não apenas HNSW ou DiskANN) para melhor adequar o desempenho aos nossos muitos casos de uso exclusivos</p></li>
</ul>
<p>O resultado das nossas discussões e do aperfeiçoamento dos principais requisitos levou-nos a optar por testar (por ordem) quantitativamente:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, e</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Infelizmente, decisões como esta requerem tempo e recursos, e nenhuma organização dispõe de quantidades ilimitadas de ambos. Dado o nosso orçamento, decidimos testar o Qdrant e o Milvus e deixar os testes do Vespa e do Weviate como objectivos ambiciosos.</p>
<p>Qdrant vs Milvus foi também um teste interessante de duas arquitecturas diferentes:</p>
<ul>
<li><p><strong>Qdrant:</strong> Tipos de nós homogéneos que executam todas as operações da base de dados vetorial ANN</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">tipos</a> de <a href="https://milvus.io/docs/architecture_overview.md">nós heterogéneos</a> (Milvus; um para consultas, outro para indexação, outro para ingestão de dados, um proxy, etc.)</p></li>
</ul>
<p>Qual deles foi mais fácil de configurar (um teste da sua documentação)? Qual deles foi fácil de executar (um teste das suas caraterísticas de resiliência e polimento)? E qual deles teve o melhor desempenho para os casos de uso e a escala que nos interessava? Procurámos responder a estas perguntas ao comparar quantitativamente as soluções.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Avaliar quantitativamente os principais concorrentes</h3><p>Queríamos entender melhor a escalabilidade de cada solução e, no processo, experimentar como seria instalar, configurar, manter e executar cada solução em escala. Para fazer isso, coletamos três conjuntos de dados de vetores de documentos e consultas para três casos de uso diferentes, configuramos cada solução com recursos semelhantes no Kubernetes, carregamos documentos em cada solução e enviamos cargas de consulta idênticas usando <a href="https://k6.io/">o K6 do Grafana</a> com um executor de taxa de chegada em rampa para aquecer os sistemas antes de atingir uma taxa de transferência de destino (por exemplo, 100 QPS).</p>
<p>Testamos a taxa de transferência, o ponto de rutura de cada solução, a relação entre taxa de transferência e latência e como eles reagem à perda de nós sob carga (taxa de erro, impacto na latência etc.). De grande interesse foi o <strong>efeito da filtragem na latência</strong>. Também fizemos testes simples de sim/não para verificar se uma capacidade na documentação funcionava como descrito (por exemplo, upserts, delete, get by ID, administração de utilizadores, etc.) e para experimentar a ergonomia dessas APIs.</p>
<p><strong>Os testes foram efectuados no Milvus v2.4 e no Qdrant v1.12.</strong> Devido a limitações de tempo, não afinámos nem testámos exaustivamente todos os tipos de definições de índices; foram utilizadas definições semelhantes em cada solução, com uma tendência para uma elevada recuperação de ANN, e os testes centraram-se no desempenho dos índices HNSW. Também foram atribuídos recursos de CPU e memória semelhantes a cada solução.</p>
<p>Na nossa experimentação, encontrámos algumas diferenças interessantes entre as duas soluções. Nas experiências seguintes, cada solução tinha aproximadamente 340M Reddit post vectors de 384 dimensões cada, para HNSW, M=16, e efConstruction=100.</p>
<p>Numa experiência, verificámos que, para o mesmo débito de consulta (100 QPS sem ingestão ao mesmo tempo), a adição de filtragem afectou mais a latência do Milvus do que do Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latência de consulta de posts com filtragem</p>
<p>Em outra, descobrimos que havia muito mais interação entre ingestão e carga de consulta na Qdrant do que na Milvus (mostrada abaixo com taxa de transferência constante). Isto deve-se provavelmente à sua arquitetura; a Milvus divide grande parte da sua ingestão em tipos de nós separados daqueles que servem o tráfego de consulta, enquanto a Qdrant serve tanto a ingestão como o tráfego de consulta a partir dos mesmos nós.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latência de consulta de posts a 100 QPS durante a ingestão</p>
<p>Ao testar a diversidade de resultados por atributo (por exemplo, obter não mais que N resultados de cada subreddit em uma resposta), descobrimos que, para a mesma taxa de transferência, o Milvus tinha latência pior que o Qdrant (a 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latência de pós-consulta com diversidade de resultados</p>
<p>Também queríamos ver a eficácia de cada solução quando mais réplicas de dados foram adicionadas (ou seja, o fator de replicação, RF, foi aumentado de 1 para 2). Inicialmente, olhando para RF=1, Qdrant foi capaz de nos dar uma latência satisfatória para mais rendimento do que Milvus (QPS mais alto não mostrado porque os testes não foram concluídos sem erros).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant apresenta latência RF=1 para taxa de transferência variável</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus apresenta latência RF=1 para taxa de transferência variável</p>
<p>No entanto, ao aumentar o fator de replicação, a latência do p99 do Qdrant melhorou, mas o Milvus conseguiu manter um throughput maior do que o do Qdrant, com latência aceitável (Qdrant 400 QPS não mostrado porque o teste não foi concluído devido à alta latência e aos erros).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus apresenta latência RF=2 para taxa de transferência variável</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant apresenta latência RF=2 para taxa de transferência variável</p>
<p>Devido a restrições de tempo, não tivemos tempo suficiente para comparar a recuperação de RNA entre soluções nos nossos conjuntos de dados, mas tivemos em conta as medições de recuperação de RNA para soluções fornecidas por <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> em conjuntos de dados publicamente disponíveis.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Seleção final</h3><p><strong>Em termos de desempenho</strong>, sem muitos ajustes e usando apenas o HNSW, o Qdrant pareceu ter melhor latência bruta em muitos testes do que o Milvus. No entanto, a Milvus parecia escalar melhor com o aumento da replicação e tinha um melhor isolamento entre a ingestão e a carga de consulta devido à sua arquitetura de múltiplos nós.</p>
<p><strong>Em termos de operação,</strong> apesar da complexidade da arquitetura do Milvus (vários tipos de nós, dependente de um registo externo de escrita antecipada como o Kafka e um armazenamento de metadados como o etcd), tivemos mais facilidade em depurar e corrigir o Milvus do que o Qdrant quando qualquer uma das soluções entrou em mau estado. O Milvus também tem um reequilíbrio automático quando se aumenta o fator de replicação de uma coleção, enquanto que no Qdrant de código aberto é necessário criar manualmente ou eliminar fragmentos para aumentar o fator de replicação (uma funcionalidade que teríamos de construir nós próprios ou utilizar a versão de código não aberto).</p>
<p>O Milvus é uma tecnologia mais "Reddit-shaped" do que o Qdrant; partilha mais semelhanças com o resto da nossa pilha tecnológica. O Milvus é escrito em Golang, a nossa linguagem de programação de backend preferida, e por isso é mais fácil para nós contribuirmos do que o Qdrant, que é escrito em Rust. A Milvus tem uma excelente velocidade de projeto para a sua oferta de código aberto em comparação com a Qdrant, e satisfez mais dos nossos principais requisitos.</p>
<p>No final, ambas as soluções atenderam à maioria dos nossos requisitos e, em alguns casos, a Qdrant teve uma vantagem de desempenho, mas sentimos que poderíamos escalar mais a Milvus, nos sentimos mais confortáveis em executá-la e ela foi uma combinação melhor para nossa organização do que a Qdrant. Gostaríamos de ter tido mais tempo para testar a Vespa e a Weaviate, mas elas também podem ter sido selecionadas por adequação organizacional (a Vespa é baseada em Java) e arquitetura (a Weaviate é do tipo nó único, como a Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Principais conclusões<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Desafie os requisitos que lhe são dados e tente remover o viés da solução existente.</p></li>
<li><p>Pontuar as soluções candidatas e usá-las para informar a discussão sobre os requisitos essenciais, não como um ponto final</p></li>
<li><p>Avaliar quantitativamente as soluções, mas ao longo do caminho, tomar nota de como é trabalhar com a solução.</p></li>
<li><p>Escolha a solução que melhor se adapta à sua organização do ponto de vista da manutenção, do custo, da facilidade de utilização e do desempenho, e não apenas porque a solução tem o melhor desempenho.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Agradecimentos<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Este trabalho de avaliação foi efectuado por Ben Kochie, Charles Njoroge, Amit Kumar e por mim. Agradecemos também a outros que contribuíram para este trabalho, incluindo Annie Yang, Konrad Reiche, Sabrina Kong e Andrew Johnson, pela investigação qualitativa da solução.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Notas do Editor<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Queremos agradecer genuinamente à equipa de engenharia do Reddit - não só por escolherem o Milvus para as suas cargas de trabalho de pesquisa vetorial, mas também por dedicarem tempo a publicar uma avaliação tão detalhada e justa. É raro ver este nível de transparência na forma como equipas de engenharia reais comparam bases de dados, e o seu artigo será útil para qualquer pessoa da comunidade Milvus (e não só) que esteja a tentar perceber o crescente panorama das bases de dados vectoriais.</p>
<p>Como Chris mencionou no post, não existe uma única "melhor" base de dados vetorial. O que importa é se um sistema se adapta ao seu volume de trabalho, restrições e filosofia operacional. A comparação do Reddit reflecte bem essa realidade. O Milvus não está no topo de todas as categorias, e isso é completamente esperado, dadas as compensações entre diferentes modelos de dados e objectivos de desempenho.</p>
<p>Vale a pena esclarecer uma coisa: A avaliação do Reddit usou <strong>o Milvus 2.4</strong>, que era a versão estável na época. Alguns recursos - como LSH e várias otimizações de índice - ainda não existiam ou não estavam maduros na versão 2.4, portanto, algumas pontuações refletem naturalmente essa linha de base mais antiga. Desde então, lançámos o Milvus 2.5 e depois <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>o Milvus 2.6</strong></a>, e é um sistema muito diferente em termos de desempenho, eficiência e flexibilidade. A resposta da comunidade tem sido forte e muitas equipas já fizeram a atualização.</p>
<p><strong>Aqui está uma rápida olhada no que há de novo no Milvus 2.6:</strong></p>
<ul>
<li><p>Até <strong>72% menos utilização de memória</strong> e <strong>consultas 4× mais rápidas</strong> com a quantização de 1 bit RaBitQ</p></li>
<li><p><strong>50% de redução de custos</strong> com armazenamento inteligente em camadas</p></li>
<li><p><strong>Pesquisa de texto completo BM25 4× mais rápida</strong> em comparação com o Elasticsearch</p></li>
<li><p><strong>Filtragem JSON 100 vezes mais rápida</strong> com o novo Path Index</p></li>
<li><p>Uma nova arquitetura de disco zero para uma pesquisa mais fresca a um custo mais baixo</p></li>
<li><p>Um fluxo de trabalho "data-in, data-out" mais simples para incorporar pipelines</p></li>
<li><p>Suporte para <strong>mais de 100 mil colecções</strong> para lidar com grandes ambientes multi-tenant</p></li>
</ul>
<p>Se quiser ver a análise completa, aqui estão alguns bons acompanhamentos:</p>
<ul>
<li><p>Blogue: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando o Milvus 2.6: pesquisa vetorial acessível em escala de bilhões</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Notas de lançamento do Milvus 2.6: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Benchmarking do mundo real para bancos de dados vetoriais - Milvus Blog</a></p></li>
</ul>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
