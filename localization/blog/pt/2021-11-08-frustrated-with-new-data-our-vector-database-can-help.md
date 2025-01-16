---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Introdução
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: >-
  Conceção e prática de sistemas de bases de dados vectoriais de uso geral
  orientados para a IA
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>Frustrado com novos dados? A nossa Base de Dados Vetorial pode ajudar</custom-h1><p>Na era dos grandes volumes de dados, que tecnologias e aplicações de bases de dados serão mais importantes? Qual será o próximo fator de mudança?</p>
<p>Com os dados não estruturados a representarem cerca de 80-90% de todos os dados armazenados, o que é suposto fazermos com estes lagos de dados em crescimento? Poder-se-ia pensar em utilizar os métodos analíticos tradicionais, mas estes não conseguem extrair informações úteis, se é que as têm. Para responder a esta pergunta, os "Três Mosqueteiros" da equipa de Investigação e Desenvolvimento da Zilliz, o Dr. Rentong Guo, o Sr. Xiaofan Luan e o Dr. Xiaomeng Yi, são co-autores de um artigo que discute a conceção e os desafios enfrentados na construção de um sistema de base de dados vetorial de uso geral.</p>
<p>Este artigo foi incluído na Programmer, uma revista produzida pela CSDN, a maior comunidade de programadores de software da China. Esta edição da Programmer também inclui artigos de Jeffrey Ullman, vencedor do Prémio Turing 2020, Yann LeCun, vencedor do Prémio Turing 2018, Mark Porter, CTO da MongoDB, Zhenkun Yang, fundador da OceanBase, Dongxu Huang, fundador da PingCAP, etc.</p>
<p>Abaixo, compartilhamos o artigo completo com você:</p>
<custom-h1>Conceção e prática de sistemas de bases de dados vectoriais de utilização geral orientados para a IA</custom-h1><h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>As aplicações de dados actuais podem lidar facilmente com dados estruturados, que representam cerca de 20% dos dados actuais. Na sua caixa de ferramentas encontram-se sistemas como as bases de dados relacionais, as bases de dados NoSQL, etc. Em contrapartida, os dados não estruturados, que representam cerca de 80% de todos os dados, não dispõem de sistemas fiáveis. Para resolver este problema, este artigo abordará os pontos problemáticos que a análise de dados tradicional tem com os dados não estruturados e discutirá ainda a arquitetura e os desafios que enfrentámos ao criar o nosso próprio sistema de base de dados vetorial de uso geral.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">Revolução dos dados na era da IA<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o rápido desenvolvimento das tecnologias 5G e IoT, as indústrias procuram multiplicar os seus canais de recolha de dados e projetar ainda mais o mundo real no espaço digital. Embora tenha trazido alguns desafios tremendos, também trouxe consigo enormes benefícios para a indústria em crescimento. Um desses desafios difíceis é a forma de obter informações mais aprofundadas sobre estes novos dados recebidos.</p>
<p>De acordo com as estatísticas da IDC, só em 2020 foram gerados mais de 40 000 exabytes de novos dados a nível mundial. Do total, apenas 20% são dados estruturados - dados altamente ordenados e fáceis de organizar e analisar através de cálculos numéricos e álgebra relacional. Em contrapartida, os dados não estruturados (que representam os restantes 80%) são extremamente ricos em variações de tipos de dados, o que dificulta a descoberta da semântica profunda através dos métodos tradicionais de análise de dados.</p>
<p>Felizmente, estamos a assistir a uma evolução rápida e simultânea dos dados não estruturados e da IA, com a IA a permitir-nos compreender melhor os dados através de vários tipos de redes neuronais, como se mostra na Figura 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>A tecnologia de incorporação ganhou rapidamente popularidade após a estreia do Word2vec, com a ideia de "incorporar tudo" a chegar a todos os sectores da aprendizagem automática. Isto leva ao aparecimento de duas grandes camadas de dados: a camada de dados em bruto e a camada de dados vectoriais. A camada de dados brutos é composta por dados não estruturados e por certos tipos de dados estruturados; a camada de vectores é a coleção de dados incorporados facilmente analisáveis que têm origem na camada de dados brutos e que passam por modelos de aprendizagem automática.</p>
<p>Quando comparados com os dados em bruto, os dados vectorizados apresentam as seguintes vantagens:</p>
<ul>
<li>Os vectores de incorporação são um tipo abstrato de dados, o que significa que podemos construir um sistema de álgebra unificado dedicado a reduzir a complexidade dos dados não estruturados.</li>
<li>Os vectores de incorporação são expressos através de vectores de vírgula flutuante densos, permitindo que as aplicações tirem partido do SIMD. Com o SIMD a ser suportado por GPUs e quase todas as CPUs modernas, os cálculos entre vectores podem atingir um elevado desempenho a um custo relativamente baixo.</li>
<li>Os dados vectoriais codificados através de modelos de aprendizagem automática ocupam menos espaço de armazenamento do que os dados originais não estruturados, permitindo um maior rendimento.</li>
<li>A aritmética também pode ser efectuada através de vectores de incorporação. A Figura 2 mostra um exemplo de correspondência aproximada semântica transmodal - as imagens apresentadas na figura são o resultado da correspondência de palavras incorporadas com imagens incorporadas.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>novosdados2.png</span> </span></p>
<p>Como se mostra na Figura 3, a combinação da semântica de imagens e palavras pode ser feita com uma simples adição e subtração de vectores através dos seus correspondentes encaixes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Para além das caraterísticas acima referidas, estes operadores suportam declarações de consulta mais complicadas em cenários práticos. A recomendação de conteúdos é um exemplo bem conhecido. Geralmente, o sistema incorpora tanto o conteúdo como as preferências de visualização dos utilizadores. Em seguida, o sistema faz corresponder as preferências do utilizador incorporadas com o conteúdo incorporado mais semelhante através da análise de semelhança semântica, resultando num novo conteúdo que é semelhante às preferências dos utilizadores. Esta camada de dados vectoriais não se limita apenas aos sistemas de recomendação, os casos de utilização incluem o comércio eletrónico, a análise de malware, a análise de dados, a verificação biométrica, a análise de fórmulas químicas, as finanças, os seguros, etc.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Os dados não estruturados requerem uma pilha de software de base completa<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>O software de sistema está na base de todas as aplicações orientadas para os dados, mas o software de sistema de dados criado ao longo das últimas décadas, por exemplo, bases de dados, motores de análise de dados, etc., destina-se a lidar com dados estruturados. As aplicações de dados modernas baseiam-se quase exclusivamente em dados não estruturados e não beneficiam dos sistemas tradicionais de gestão de bases de dados.</p>
<p>Para resolver este problema, desenvolvemos um sistema de base de dados vetorial de uso geral orientado para a IA, denominado <em>Milvus</em> (Referência n.º 1~2). Em comparação com os sistemas de bases de dados tradicionais, o Milvus trabalha numa camada de dados diferente. As bases de dados tradicionais, como as bases de dados relacionais, as bases de dados KV, as bases de dados de texto, as bases de dados de imagens/vídeo, etc., funcionam na camada de dados brutos, enquanto o Milvus funciona na camada de dados vectoriais.</p>
<p>Nos capítulos seguintes, discutiremos as novas caraterísticas, a conceção arquitetónica e os desafios técnicos que enfrentámos ao construir o Milvus.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Principais atributos das bases de dados vectoriais<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais armazenam, recuperam e analisam vectores e, tal como qualquer outra base de dados, também fornecem uma interface normalizada para operações CRUD. Para além destas caraterísticas "normais", os atributos enumerados abaixo são também qualidades importantes para uma base de dados vetorial:</p>
<ul>
<li><strong>Suporte para operadores vectoriais de elevada eficiência</strong></li>
</ul>
<p>O suporte de operadores vectoriais num motor de análise centra-se em dois níveis. Em primeiro lugar, a base de dados vetorial deve suportar diferentes tipos de operadores, por exemplo, a correspondência de semelhanças semânticas e a aritmética semântica acima mencionadas. Para além disso, deve suportar uma variedade de métricas de semelhança para os cálculos de semelhança subjacentes. Essa semelhança é geralmente quantificada como distância espacial entre vectores, sendo as métricas comuns a distância euclidiana, a distância cosseno e a distância do produto interno.</p>
<ul>
<li><strong>Apoio à indexação de vectores</strong></li>
</ul>
<p>Em comparação com os índices baseados em árvores B ou LSM nas bases de dados tradicionais, os índices vectoriais de alta dimensão consomem normalmente muito mais recursos informáticos. Recomendamos a utilização de algoritmos de clustering e de índice gráfico, dando prioridade a operações matriciais e vectoriais, tirando assim o máximo partido das capacidades de aceleração do cálculo vetorial por hardware anteriormente mencionadas.</p>
<ul>
<li><strong>Experiência de utilizador consistente em diferentes ambientes de implementação</strong></li>
</ul>
<p>As bases de dados vectoriais são normalmente desenvolvidas e implementadas em diferentes ambientes. Na fase preliminar, os cientistas de dados e os engenheiros de algoritmos trabalham sobretudo nos seus computadores portáteis e estações de trabalho, pois prestam mais atenção à eficiência da verificação e à velocidade de iteração. Quando a verificação estiver concluída, podem implementar a base de dados completa num cluster privado ou na nuvem. Por conseguinte, um sistema de base de dados vetorial qualificado deve proporcionar um desempenho consistente e uma experiência de utilizador em diferentes ambientes de implementação.</p>
<ul>
<li><strong>Suporte para pesquisa híbrida</strong></li>
</ul>
<p>Estão a surgir novas aplicações à medida que as bases de dados vectoriais se tornam omnipresentes. Entre todas estas exigências, a mais frequentemente mencionada é a pesquisa híbrida em vectores e outros tipos de dados. Alguns exemplos disto são a pesquisa aproximada do vizinho mais próximo (ANNS) após filtragem escalar, a recuperação multicanal da pesquisa de texto integral e da pesquisa vetorial e a pesquisa híbrida de dados espácio-temporais e dados vectoriais. Estes desafios exigem escalabilidade elástica e otimização de consultas para fundir eficazmente os motores de pesquisa vetorial com KV, texto e outros motores de pesquisa.</p>
<ul>
<li><strong>Arquitetura nativa da nuvem</strong></li>
</ul>
<p>O volume de dados vectoriais aumenta com o crescimento exponencial da recolha de dados. Os dados vectoriais de elevada dimensão e à escala de um bilião correspondem a milhares de TB de armazenamento, o que ultrapassa largamente o limite de um único nó. Consequentemente, a extensibilidade horizontal é uma capacidade fundamental para uma base de dados vetorial e deve satisfazer as exigências dos utilizadores em termos de elasticidade e agilidade de implantação. Além disso, deve também reduzir a complexidade da operação e da manutenção do sistema, melhorando simultaneamente a observabilidade com a ajuda da infraestrutura de computação em nuvem. Algumas destas necessidades assumem a forma de isolamento multi-tenant, instantâneo e cópia de segurança de dados, encriptação de dados e visualização de dados, que são comuns nas bases de dados tradicionais.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Arquitetura do sistema de base de dados vetorial<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.0 segue os princípios de conceção de &quot;registo como dados&quot;, &quot;processamento unificado em lote e em fluxo&quot;, &quot;sem estado&quot; e &quot;micro-serviços&quot;. A figura 4 mostra a arquitetura geral do Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Registo como dados</strong>: O Milvus 2.0 não mantém quaisquer tabelas físicas. Em vez disso, garante a fiabilidade dos dados através da persistência de registos e de instantâneos de registos. O corretor de logs (a espinha dorsal do sistema) armazena logs e desacopla componentes e serviços através do mecanismo de publicação-assinatura de logs (pub-sub). Como mostra a Figura 5, o corretor de registos é composto pela &quot;sequência de registos&quot; e pelo &quot;assinante de registos&quot;. A sequência de registos regista todas as operações que alteram o estado de uma coleção (equivalente a uma tabela numa base de dados relacional); o assinante de registos subscreve a sequência de registos para atualizar os seus dados locais e fornecer serviços sob a forma de cópias só de leitura. O mecanismo pub-sub também abre espaço para a extensibilidade do sistema em termos de captura de dados alterados (CDC) e implantação globalmente distribuída.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Processamento unificado em lote e em fluxo</strong>: O streaming de registos permite ao Milvus atualizar os dados em tempo real, garantindo assim a capacidade de entrega em tempo real. Além disso, ao transformar lotes de dados em instantâneos de registo e ao criar índices em instantâneos, o Milvus consegue obter uma maior eficiência de consulta. Durante uma consulta, Milvus funde os resultados da consulta de dados incrementais e dados históricos para garantir a integralidade dos dados retornados. Esta conceção equilibra melhor o desempenho e a eficiência em tempo real, aliviando a carga de manutenção dos sistemas online e offline em comparação com a arquitetura Lambda tradicional.</p>
<p><strong>Sem estado</strong>: A infraestrutura de nuvem e os componentes de armazenamento de código aberto libertam o Milvus da persistência de dados nos seus próprios componentes. O Milvus 2.0 persiste os dados com três tipos de armazenamento: armazenamento de metadados, armazenamento de registos e armazenamento de objectos. O armazenamento de metadados não apenas armazena os metadados, mas também lida com a descoberta de serviços e o gerenciamento de nós. O armazenamento de registos executa a persistência incremental de dados e a publicação-assinatura de dados. O armazenamento de objectos armazena instantâneos de registos, índices e alguns resultados de cálculos intermédios.</p>
<p><strong>Microsserviços</strong>: O Milvus segue os princípios de desagregação do plano de dados e do plano de controlo, separação de leitura/escrita e separação de tarefas online/offline. É composto por quatro camadas de serviço: a camada de acesso, a camada de coordenação, a camada de trabalho e a camada de armazenamento. Estas camadas são mutuamente independentes quando se trata de escalonamento e recuperação de desastres. Como camada frontal e ponto final do utilizador, a camada de acesso trata das ligações dos clientes, valida os pedidos dos clientes e combina os resultados das consultas. Como &quot;cérebro&quot; do sistema, a camada de coordenação assume as tarefas de gestão da topologia do cluster, equilíbrio de carga, declaração de dados e gestão de dados. A camada de trabalho contém os "membros" do sistema, executando actualizações de dados, consultas e operações de criação de índices. Finalmente, a camada de armazenamento é responsável pela persistência e replicação dos dados. Globalmente, esta conceção baseada em microsserviços garante uma complexidade controlável do sistema, sendo cada componente responsável pela sua função correspondente. O Milvus clarifica as fronteiras dos serviços através de interfaces bem definidas e separa os serviços com base numa granularidade mais fina, o que optimiza ainda mais a escalabilidade elástica e a distribuição de recursos.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Desafios técnicos enfrentados pelas bases de dados vectoriais<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>A investigação inicial sobre bases de dados vectoriais concentrou-se principalmente na conceção de estruturas de índices e métodos de consulta de elevada eficiência, o que deu origem a uma variedade de bibliotecas de algoritmos de pesquisa vetorial (Referência n.º 3~5). Nos últimos anos, um número crescente de equipas académicas e de engenharia analisaram os problemas da pesquisa vetorial do ponto de vista da conceção do sistema e propuseram algumas soluções sistemáticas. Resumindo os estudos existentes e a procura dos utilizadores, classificamos os principais desafios técnicos das bases de dados vectoriais da seguinte forma</p>
<ul>
<li><strong>Otimização da relação custo/desempenho em relação à carga</strong></li>
</ul>
<p>Em comparação com os tipos de dados tradicionais, a análise de dados vectoriais exige muito mais recursos de armazenamento e computação devido à sua elevada dimensionalidade. Além disso, os utilizadores têm mostrado preferências diversas quanto às caraterísticas da carga e à otimização do custo-desempenho das soluções de pesquisa vetorial. Por exemplo, os utilizadores que trabalham com conjuntos de dados extremamente grandes (dezenas ou centenas de milhares de milhões de vectores) preferem soluções com custos de armazenamento de dados mais baixos e latência de pesquisa variável, enquanto outros podem exigir um desempenho de pesquisa mais elevado e uma latência média não variável. Para satisfazer preferências tão diversas, o componente de índice central da base de dados vetorial deve ser capaz de suportar estruturas de índice e algoritmos de pesquisa com diferentes tipos de hardware de armazenamento e computação.</p>
<p>Por exemplo, o armazenamento de dados vectoriais e dos dados de índice correspondentes em suportes de armazenamento mais baratos (como NVM e SSD) deve ser tido em consideração ao reduzir os custos de armazenamento. No entanto, a maioria dos algoritmos de pesquisa vetorial existentes funciona com dados lidos diretamente da memória. Para evitar a perda de desempenho causada pela utilização de unidades de disco, a base de dados vetorial deve ser capaz de explorar a localidade do acesso aos dados combinada com algoritmos de pesquisa, para além de ser capaz de se ajustar a soluções de armazenamento para dados vectoriais e estrutura de índices (Referência n.º 6~8). Com o objetivo de melhorar o desempenho, a investigação contemporânea tem-se centrado nas tecnologias de aceleração de hardware que envolvem GPU, NPU, FPGA, etc. (Referência n.º 9). No entanto, o hardware e os chips específicos de aceleração variam na conceção da arquitetura, e o problema da execução mais eficiente em diferentes aceleradores de hardware ainda não está resolvido.</p>
<ul>
<li><strong>Configuração e afinação automatizadas do sistema</strong></li>
</ul>
<p>A maioria dos estudos existentes sobre algoritmos de pesquisa vetorial procura um equilíbrio flexível entre os custos de armazenamento, o desempenho computacional e a precisão da pesquisa. Em geral, tanto os parâmetros do algoritmo como as caraterísticas dos dados influenciam o desempenho efetivo de um algoritmo. Dado que as exigências dos utilizadores diferem em termos de custos e desempenho, a seleção de um método de pesquisa vetorial que se adeqúe às suas necessidades e caraterísticas dos dados constitui um desafio significativo.</p>
<p>No entanto, os métodos manuais de análise dos efeitos da distribuição dos dados nos algoritmos de pesquisa não são eficazes devido à elevada dimensionalidade dos dados vectoriais. Para resolver este problema, o meio académico e a indústria procuram soluções de recomendação de algoritmos baseadas na aprendizagem automática (Referência n.º 10).</p>
<p>A conceção de um algoritmo de pesquisa vetorial inteligente baseado em aprendizagem automática é também um ponto de interesse para a investigação. De um modo geral, os algoritmos de pesquisa vetorial existentes são desenvolvidos universalmente para dados vectoriais com várias dimensionalidades e padrões de distribuição. Consequentemente, não suportam estruturas de índice específicas de acordo com as caraterísticas dos dados, pelo que têm pouco espaço para otimização. Os estudos futuros devem também explorar tecnologias eficazes de aprendizagem automática que possam adaptar as estruturas de índices a diferentes caraterísticas dos dados (Referência n.º 11-12).</p>
<ul>
<li><strong>Suporte para semântica de consulta avançada</strong></li>
</ul>
<p>As aplicações modernas recorrem frequentemente a consultas mais avançadas em vectores - a semântica tradicional de pesquisa do vizinho mais próximo já não é aplicável à pesquisa de dados vectoriais. Além disso, está a surgir a procura de pesquisa combinada em múltiplas bases de dados vectoriais ou em dados vectoriais e não vectoriais (Referência n.º 13).</p>
<p>Especificamente, as variações nas métricas de distância para a similaridade vetorial crescem rapidamente. As pontuações de semelhança tradicionais, como a distância euclidiana, a distância do produto interno e a distância cosseno, não podem satisfazer todas as exigências das aplicações. Com a popularização da tecnologia de inteligência artificial, muitas indústrias estão a desenvolver as suas próprias métricas de semelhança vetorial específicas da área, como a distância de Tanimoto, a distância de Mahalanobis, a superestrutura e a subestrutura. A integração destas métricas de avaliação nos algoritmos de pesquisa existentes e a conceção de novos algoritmos que utilizem as referidas métricas são problemas de investigação difíceis.</p>
<p>À medida que a complexidade dos serviços para os utilizadores aumenta, as aplicações terão de pesquisar em dados vectoriais e não vectoriais. Por exemplo, um recomendador de conteúdos analisa as preferências dos utilizadores e as suas relações sociais e associa-as aos temas actuais para apresentar o conteúdo adequado aos utilizadores. Essas pesquisas envolvem normalmente consultas em vários tipos de dados ou em vários sistemas de processamento de dados. Um outro desafio para a conceção de sistemas consiste em apoiar estas pesquisas híbridas de forma eficiente e flexível.</p>
<h2 id="Authors" class="common-anchor-header">Autores<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Dr. Rentong Guo (Doutorado em Teoria e Software Informático, Universidade de Ciência e Tecnologia de Huazhong), sócio e Diretor de I&amp;D da Zilliz. É membro do Comité Técnico da Federação de Computadores da China sobre Computação e Processamento Distribuídos (CCF TCDCP). A sua investigação centra-se em bases de dados, sistemas distribuídos, sistemas de cache e computação heterogénea. Os seus trabalhos de investigação foram publicados em várias conferências e revistas de topo, incluindo Usenix ATC, ICS, DATE, TPDS. Como arquiteto da Milvus, o Dr. Guo procura soluções para desenvolver sistemas de análise de dados baseados em IA altamente escaláveis e económicos.</p>
<p>Xiaofan Luan, sócio e Diretor de Engenharia da Zilliz, e membro do Comité Técnico Consultivo da LF AI &amp; Data Foundation. Trabalhou sucessivamente na sede da Oracle nos EUA e na Hedvig, uma startup de armazenamento definido por software. Juntou-se à equipa da Alibaba Cloud Database e foi responsável pelo desenvolvimento da base de dados NoSQL HBase e Lindorm. Luan obteve o seu mestrado em Engenharia Eletrónica e de Computadores na Universidade de Cornell.</p>
<p>Dr. Xiaomeng Yi (Doutorado em Arquitetura de Computadores, Universidade de Ciência e Tecnologia de Huazhong), investigador sénior e líder da equipa de investigação da Zilliz. A sua investigação centra-se na gestão de dados de alta dimensão, na recuperação de informação em grande escala e na atribuição de recursos em sistemas distribuídos. Os trabalhos de investigação do Dr. Yi foram publicados nas principais revistas e conferências internacionais, incluindo IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS e ACM TOMPECS.</p>
<p>Filip Haltmayer, Engenheiro de Dados da Zilliz, licenciou-se na Universidade da Califórnia, Santa Cruz, com um bacharelato em Ciências da Computação. Depois de se juntar à Zilliz, Filip passa a maior parte do seu tempo a trabalhar em implementações na nuvem, interações com clientes, palestras técnicas e desenvolvimento de aplicações de IA.</p>
<h2 id="References" class="common-anchor-header">Referências<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Projeto Milvus: https://github.com/milvus-io/milvus</li>
<li>Milvus: Um sistema de gestão de dados vectoriais construído para o efeito, SIGMOD'21</li>
<li>Projeto Faiss: https://github.com/facebookresearch/faiss</li>
<li>Projeto Annoy: https://github.com/spotify/annoy</li>
<li>Projeto SPTAG: https://github.com/microsoft/SPTAG</li>
<li>GRIP: Multi-Store Capacity-Optimized High-Performance Nearest Neighbor Search for Vetor Search Engine, CIKM'19</li>
<li>DiskANN: Busca rápida e precisa do vizinho mais próximo em um bilhão de pontos em um único nó, NIPS'19</li>
<li>HM-ANN: Pesquisa eficiente do vizinho mais próximo de mil milhões de pontos em memória heterogénea, NIPS'20</li>
<li>SONG: Pesquisa aproximada do vizinho mais próximo em GPU, ICDE'20</li>
<li>Uma demonstração do serviço de afinação automática do sistema de gestão de bases de dados ottertune, VLDB'18</li>
<li>O caso das estruturas de índices aprendidas, SIGMOD'18</li>
<li>Melhorando a busca aproximada do vizinho mais próximo através da terminação antecipada adaptativa aprendida, SIGMOD'20</li>
<li>AnalyticDB-V: Um motor analítico híbrido para a fusão de consultas para dados estruturados e não estruturados, VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Envolva-se com a nossa comunidade de código aberto:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>Encontre ou contribua para o Milvus no <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://bit.ly/307HVsY">Fórum</a>.</li>
<li>Ligue-se a nós no <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
