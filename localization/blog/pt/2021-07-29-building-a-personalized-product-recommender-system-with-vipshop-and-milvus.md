---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Arquitetura geral
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  O Milvus facilita o fornecimento de um serviço de recomendação personalizado
  aos utilizadores.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Criação de um sistema de recomendação de produtos personalizados com a Vipshop e a Milvus</custom-h1><p>Com o crescimento explosivo da escala de dados da Internet, a quantidade de produtos, bem como a categoria na atual plataforma de comércio eletrónico convencional, aumentam, por um lado, e a dificuldade dos utilizadores em encontrar os produtos de que necessitam aumenta, por outro.</p>
<p><a href="https://www.vip.com/">A Vipshop</a> é um retalhista online líder em descontos para marcas na China. A empresa oferece produtos de marca populares e de alta qualidade aos consumidores em toda a China, com um desconto significativo em relação aos preços de retalho. Para otimizar a experiência de compra dos seus clientes, a empresa decidiu criar um sistema de recomendação de pesquisa personalizado com base nas palavras-chave de consulta do utilizador e nos retratos do utilizador.</p>
<p>A função principal do sistema de recomendação de pesquisa de comércio eletrónico é recuperar produtos adequados de um grande número de produtos e apresentá-los aos utilizadores de acordo com a sua intenção de pesquisa e preferência. Neste processo, o sistema tem de calcular a semelhança entre os produtos e a intenção e preferência de pesquisa dos utilizadores, e recomenda os produtos TopK com a maior semelhança aos utilizadores.</p>
<p>Dados como a informação do produto, a intenção de pesquisa do utilizador e as preferências do utilizador são todos dados não estruturados. Tentámos calcular a semelhança desses dados utilizando o CosineSimilarity(7.x) do motor de busca Elasticsearch (ES), mas esta abordagem tem as seguintes desvantagens</p>
<ul>
<li><p>Tempo de resposta computacional longo - a latência média para recuperar resultados TopK de milhões de itens é de cerca de 300 ms.</p></li>
<li><p>Elevado custo de manutenção dos índices do ES - o mesmo conjunto de índices é utilizado tanto para os vectores de caraterísticas das mercadorias como para outros dados relacionados, o que dificilmente facilita a construção do índice, mas produz uma enorme quantidade de dados.</p></li>
</ul>
<p>Tentámos desenvolver o nosso próprio plug-in de hash localmente sensível para acelerar o cálculo do CosineSimilarity do ES. Embora o desempenho e o rendimento tenham melhorado significativamente após a aceleração, a latência de mais de 100 ms continuava a ser difícil de satisfazer os requisitos reais de recuperação de produtos em linha.</p>
<p>Após uma pesquisa exaustiva, decidimos utilizar a Milvus, uma base de dados vetorial de código aberto, que tem a vantagem de suportar a implantação distribuída, SDKs multilingues, separação de leitura/escrita, etc., em comparação com a Faiss autónoma normalmente utilizada.</p>
<p>Utilizando vários modelos de aprendizagem profunda, convertemos dados massivos não estruturados em vectores de caraterísticas e importamos os vectores para o Milvus. Com o excelente desempenho do Milvus, o nosso sistema de recomendação de pesquisa de comércio eletrónico pode consultar eficazmente os vectores TopK que são semelhantes aos vectores-alvo.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Arquitetura geral<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>![Arquitetura](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Arquitetura.) Como mostra o diagrama, a arquitetura geral do sistema é constituída por duas partes principais.</p>
<ul>
<li><p>Processo de escrita: os vectores de caraterísticas dos itens (a seguir designados por vectores de itens) gerados pelo modelo de aprendizagem profunda são normalizados e escritos no MySQL. Em seguida, o MySQL lê os vectores de caraterísticas de itens processados utilizando a ferramenta de sincronização de dados (ETL) e importa-os para a base de dados de vectores Milvus.</p></li>
<li><p>Processo de leitura: O serviço de pesquisa obtém vectores de caraterísticas das preferências do utilizador (doravante designados por vectores do utilizador) com base nas palavras-chave da consulta do utilizador e nos retratos do utilizador, consulta vectores semelhantes no Milvus e recorda os vectores de itens TopK.</p></li>
</ul>
<p>O Milvus suporta tanto a atualização incremental dos dados como a atualização de todos os dados. Cada atualização incremental tem de eliminar o vetor de itens existente e inserir um novo vetor de itens, o que significa que cada coleção recentemente actualizada será novamente indexada. É mais adequado para o cenário com mais leituras e menos escritas. Por isso, escolhemos o método de atualização de dados completos. Além disso, são necessários apenas alguns minutos para escrever todos os dados em lotes de várias partições, o que equivale a actualizações quase em tempo real.</p>
<p>Os nós de escrita Milvus executam todas as operações de escrita, incluindo a criação de colecções de dados, a construção de índices, a inserção de vectores, etc., e fornecem serviços ao público com nomes de domínio de escrita. Os nós de leitura do Milvus realizam todas as operações de leitura e fornecem serviços ao público com nomes de domínio apenas de leitura.</p>
<p>Considerando que a versão atual do Milvus não suporta a troca de aliases de colecções, introduzimos o Redis para trocar aliases entre múltiplas colecções de dados inteiras.</p>
<p>O nó de leitura só precisa de ler informações de metadados existentes e dados vectoriais ou índices do MySQL, do Milvus e do sistema de ficheiros distribuído GlusterFS, pelo que a capacidade de leitura pode ser alargada horizontalmente através da implementação de várias instâncias.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Detalhes da implementação<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Atualização de dados</h3><p>O serviço de atualização de dados inclui não só a escrita de dados vectoriais, mas também a deteção do volume de dados dos vectores, a construção de índices, o pré-carregamento de índices, o controlo de pseudónimos, etc. O processo global é o seguinte. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Processo</span> </span></p>
<ol>
<li><p>Suponha-se que, antes de construir os dados completos, a ColecçãoA presta um serviço de dados ao público e que os dados completos que estão a ser utilizados são dirigidos à ColecçãoA (<code translate="no">redis key1 = CollectionA</code>). O objetivo da construção de dados completos é criar uma nova coleção CollectionB.</p></li>
<li><p>Verificação dos dados das mercadorias - verificar o número de item dos dados das mercadorias na tabela MySQL, comparar os dados das mercadorias com os dados existentes na ColecçãoA. O alerta pode ser definido de acordo com a quantidade ou a percentagem. Se a quantidade definida (percentagem) não for atingida, os dados completos não serão construídos e será considerado como uma falha desta operação de construção, accionando o alerta; assim que a quantidade definida (percentagem) for atingida, todo o processo de construção de dados é iniciado.</p></li>
<li><p>Iniciar a construção de todos os dados - inicializar o alias de todos os dados que estão a ser construídos e atualizar o Redis. Após a atualização, o alias de todos os dados em construção é direcionado para a ColecçãoB (<code translate="no">redis key2 = CollectionB</code>).</p></li>
<li><p>Criar uma nova coleção inteira - determinar se CollectionB existe. Se existir, exclua-a antes de criar uma nova.</p></li>
<li><p>Gravação de dados em lote - calcular o ID da partição de cada dado de mercadoria com o seu próprio ID utilizando a operação de módulo e gravar os dados em várias partições na coleção recém-criada em lotes.</p></li>
<li><p>Criar e pré-carregar o índice - Criar um índice (<code translate="no">createIndex()</code>) para a nova coleção. O ficheiro de índice é armazenado no servidor de armazenamento distribuído GlusterFS. O sistema simula automaticamente a consulta na nova coleção e pré-carrega o índice para aquecimento da consulta.</p></li>
<li><p>Verificação dos dados da coleção - verifica o número de itens de dados na nova coleção, compara os dados com a coleção existente e define alarmes com base na quantidade e na percentagem. Se o número definido (percentagem) não for atingido, a coleção não será trocada e o processo de construção será considerado como uma falha, accionando o alerta.</p></li>
<li><p>Troca de coleção - Controlo de alias. Após a atualização do Redis, todo o alias de dados em utilização é direcionado para a CollectionB (<code translate="no">redis key1 = CollectionB</code>), a chave original do Redis2 é eliminada e o processo de construção é concluído.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Recuperação de dados</h3><p>Os dados da partição Milvus são chamados várias vezes para calcular a semelhança entre os vectores de utilizador, obtidos com base nas palavras-chave de consulta do utilizador e no retrato do utilizador, e o vetor de item, e os vectores de item TopK são devolvidos após a fusão. O esquema geral do fluxo de trabalho é o seguinte: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>fluxo de trabalho</span>A </span>tabela seguinte enumera os principais serviços envolvidos neste processo. Pode ver-se que a latência média para recuperar os vectores TopK é de cerca de 30 ms.</p>
<table>
<thead>
<tr><th><strong>Serviço</strong></th><th><strong>Função</strong></th><th><strong>Parâmetros de entrada</strong></th><th><strong>Parâmetros de saída</strong></th><th><strong>Latência de resposta</strong></th></tr>
</thead>
<tbody>
<tr><td>Aquisição dos vectores do utilizador</td><td>Obter o vetor do utilizador</td><td>informação do utilizador + consulta</td><td>vetor do utilizador</td><td>10 ms</td></tr>
<tr><td>Pesquisa Milvus</td><td>Calcular a similaridade do vetor e devolver os resultados TopK</td><td>vetor do utilizador</td><td>vetor do item</td><td>10 ms</td></tr>
<tr><td>Lógica de programação</td><td>Recolha e fusão simultânea de resultados</td><td>Vectores de itens recuperados por vários canais e a pontuação de semelhança</td><td>Itens TopK</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>Processo de implementação:</strong></p>
<ol>
<li>Com base nas palavras-chave de consulta do utilizador e no retrato do utilizador, o vetor do utilizador é calculado pelo modelo de aprendizagem profunda.</li>
<li>Obter o alias da coleção de todos os dados que estão a ser utilizados a partir de Redis currentInUseKeyRef e obter Milvus CollectionName. Este processo é um serviço de sincronização de dados, ou seja, mudar o alias para o Redis após a atualização de todos os dados.</li>
<li>O Milvus é chamado de forma simultânea e assíncrona com o vetor do utilizador para obter dados de diferentes partições da mesma coleção, e o Milvus calcula a semelhança entre o vetor do utilizador e o vetor do item, e devolve os TopK vectores de itens semelhantes em cada partição.</li>
<li>Fundir os vectores de itens TopK devolvidos de cada partição e classificar os resultados pela ordem inversa da distância de semelhança, que é calculada utilizando o produto interno IP (quanto maior for a distância entre os vectores, mais semelhantes são). São devolvidos os vectores de itens TopK finais.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">Olhando para o futuro<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Atualmente, a pesquisa vetorial baseada em Milvus pode ser utilizada de forma constante na pesquisa de cenários de recomendação, e o seu elevado desempenho dá-nos mais espaço para jogar na dimensionalidade do modelo e na seleção do algoritmo.</p>
<p>O Milvus desempenhará um papel crucial como middleware para mais cenários, incluindo a chamada de atenção para a pesquisa no sítio principal e recomendações para todos os cenários.</p>
<p>As três caraterísticas mais esperadas do Milvus no futuro são as seguintes</p>
<ul>
<li>Lógica para a comutação de pseudónimos de colecções - coordenar a comutação entre colecções sem componentes externos.</li>
<li>Mecanismo de filtragem - Milvus v0.11.0 apenas suporta o mecanismo de filtragem ES DSL na versão autónoma. O Milvus 2.0, recentemente lançado, suporta filtragem escalar e separação de leitura/escrita.</li>
<li>Suporte de armazenamento para Hadoop Distributed File System (HDFS) - O Milvus v0.10.6 que estamos a utilizar apenas suporta a interface de ficheiros POSIX, e implementámos GlusterFS com suporte FUSE como backend de armazenamento. No entanto, o HDFS é uma escolha melhor em termos de desempenho e facilidade de escalonamento.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Lições aprendidas e melhores práticas<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Para aplicações em que as operações de leitura são o foco principal, uma implantação de separação leitura-escrita pode aumentar significativamente o poder de processamento e melhorar o desempenho.</li>
<li>O cliente Java Milvus não possui um mecanismo de reconexão porque o cliente Milvus usado pelo serviço de recuperação está residente na memória. Temos de criar o nosso próprio conjunto de ligações para garantir a disponibilidade da ligação entre o cliente Java e o servidor através de um teste de pulsação.</li>
<li>Ocasionalmente, ocorrem consultas lentas no Milvus. Isto deve-se a um aquecimento insuficiente da nova coleção. Ao simular a consulta na nova coleção, o ficheiro de índice é carregado na memória para atingir o aquecimento do índice.</li>
<li>nlist é o parâmetro de construção do índice e nprobe é o parâmetro de consulta. É necessário obter um valor limite razoável de acordo com o seu cenário empresarial através de experiências de teste de pressão para equilibrar o desempenho e a precisão da recuperação.</li>
<li>Para um cenário de dados estáticos, é mais eficiente importar primeiro todos os dados para a coleção e construir índices mais tarde.</li>
</ol>
