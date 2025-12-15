---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Otimização do NVIDIA CAGRA no Milvus: uma abordagem híbrida GPU-CPU para uma
  indexação mais rápida e consultas mais baratas
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Saiba como o GPU_CAGRA no Milvus 2.6 usa GPUs para construção rápida de
  gráficos e CPUs para servir consultas escalonáveis.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>À medida que os sistemas de IA passam das experiências para a infraestrutura de produção, as bases de dados vectoriais já não lidam com milhões de embeddings. <strong>Os biliões são agora rotina e as dezenas de biliões são cada vez mais comuns.</strong> A esta escala, as escolhas algorítmicas afectam não só o desempenho e a recordação, mas também se traduzem diretamente no custo da infraestrutura.</p>
<p>Isto leva a uma questão central para implementações em grande escala: <strong>como escolher o índice certo para fornecer uma recuperação e latência aceitáveis sem deixar que a utilização de recursos de computação fique fora de controlo?</strong></p>
<p>Os índices baseados em gráficos, como <strong>NSW, HNSW, CAGRA e Vamana</strong>, tornaram-se a resposta mais amplamente adotada. Ao navegar em grafos de vizinhança pré-construídos, estes índices permitem uma pesquisa rápida do vizinho mais próximo à escala de mil milhões, evitando a pesquisa de força bruta e a comparação de cada vetor com a consulta.</p>
<p>No entanto, o perfil de custos desta abordagem é desigual. <strong>Consultar um grafo é relativamente barato; construí-lo não é.</strong> Construir um gráfico de alta qualidade requer cálculos de distância em grande escala e refinamento iterativo em todo o conjunto de dados - cargas de trabalho que os recursos tradicionais da CPU lutam para lidar de forma eficiente à medida que os dados crescem.</p>
<p>O CAGRA da NVIDIA aborda esse gargalo usando GPUs para acelerar a construção de gráficos por meio de paralelismo massivo. Embora isso reduza significativamente o tempo de construção, contar com GPUs para a construção de índices e para o atendimento de consultas introduz restrições de custo e escalabilidade mais altas em ambientes de produção.</p>
<p>Para equilibrar estes compromissos, <a href="https://milvus.io/docs/release_notes.md#v261">o Milvus 2.6.1</a> <strong>adopta um design híbrido para os</strong> <strong>índices</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a>: <strong>As GPUs são usadas apenas para a construção de gráficos, enquanto a execução de consultas é executada em CPUs.</strong> Isso preserva as vantagens de qualidade dos gráficos construídos por GPU e, ao mesmo tempo, mantém o serviço de consulta escalonável e econômico - o que o torna especialmente adequado para cargas de trabalho com atualizações de dados pouco frequentes, grandes volumes de consulta e sensibilidade estrita a custos.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">O que é o CAGRA e como ele funciona?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Os índices vetoriais baseados em grafos geralmente se enquadram em duas categorias principais:</p>
<ul>
<li><p><strong>Construção iterativa de grafos</strong>, representada pelo <strong>CAGRA</strong> (já suportado no Milvus).</p></li>
<li><p><strong>Construção de gráficos baseada em inserção</strong>, representada pelo <strong>Vamana</strong> (atualmente em desenvolvimento no Milvus).</p></li>
</ul>
<p>Essas duas abordagens diferem significativamente em seus objetivos de projeto e fundamentos técnicos, tornando cada uma adequada para diferentes escalas de dados e padrões de carga de trabalho.</p>
<p><strong>O NVIDIA CAGRA (CUDA ANN Graph-based)</strong> é um algoritmo nativo da GPU para pesquisa aproximada do vizinho mais próximo (ANN), concebido para construir e consultar gráficos de proximidade em grande escala de forma eficiente. Ao aproveitar o paralelismo da GPU, o CAGRA acelera significativamente a construção de gráficos e oferece desempenho de consulta de alto rendimento em comparação com abordagens baseadas em CPU, como o HNSW.</p>
<p>O CAGRA é construído com base no algoritmo <strong>NN-Descent (Nearest Neighbor Descent)</strong>, que constrói um grafo de k vizinhos mais próximos (kNN) por meio de refinamento iterativo. Em cada iteração, os vizinhos candidatos são avaliados e actualizados, convergindo gradualmente para relações de vizinhança de maior qualidade em todo o conjunto de dados.</p>
<p>Depois de cada ronda de refinamento, o CAGRA aplica técnicas adicionais de poda do gráfico - como a <strong>poda de desvio de 2 saltos - para</strong>remover arestas redundantes, preservando a qualidade da pesquisa. Essa combinação de refinamento e poda iterativos resulta em um <strong>gráfico compacto, mas bem conectado</strong>, que é eficiente para percorrer no momento da consulta.</p>
<p>Através do refinamento e da poda repetidos, o CAGRA produz uma estrutura de grafo que suporta <strong>uma pesquisa do vizinho mais próximo de alta recuperação e baixa latência em grande escala</strong>, o que o torna particularmente adequado para conjuntos de dados estáticos ou actualizados com pouca frequência.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Etapa 1: Construindo o gráfico inicial com NN-Descent</h3><p>O NN-Descent é baseado em uma observação simples, mas poderosa: se o nó <em>u</em> é vizinho de <em>v</em> e o nó <em>w</em> é vizinho de <em>u</em>, então <em>w</em> muito provavelmente também é vizinho de <em>v</em>. Esta propriedade transitiva permite que o algoritmo descubra os verdadeiros vizinhos mais próximos de forma eficiente, sem comparar exaustivamente cada par de vectores.</p>
<p>O CAGRA usa o NN-Descent como seu algoritmo principal de construção de grafos. O processo funciona da seguinte forma:</p>
<p><strong>1. Inicialização aleatória:</strong> Cada nó começa com um pequeno conjunto de vizinhos selecionados aleatoriamente, formando um grafo inicial aproximado.</p>
<p><strong>2. Expansão de vizinhos:</strong> Em cada iteração, um nó reúne os seus vizinhos actuais e os vizinhos destes para formar uma lista de candidatos. O algoritmo calcula as semelhanças entre o nó e todos os candidatos. Uma vez que a lista de candidatos de cada nó é independente, estes cálculos podem ser atribuídos a blocos de threads GPU separados e executados em paralelo a uma escala maciça.</p>
<p><strong>3. Atualização da lista de candidatos:</strong> Se o algoritmo encontrar candidatos mais próximos do que os actuais vizinhos do nó, troca os vizinhos mais distantes e actualiza a lista kNN do nó. Ao longo de várias iterações, este processo produz um gráfico kNN aproximado de qualidade muito superior.</p>
<p><strong>4. Verificação da convergência:</strong> À medida que as iterações avançam, ocorrem menos actualizações de vizinhos. Quando o número de conexões atualizadas cai abaixo de um limite definido, o algoritmo pára, indicando que o gráfico efetivamente se estabilizou.</p>
<p>Como a expansão de vizinhos e a computação de similaridade para nós diferentes são totalmente independentes, o CAGRA mapeia a carga de trabalho NN-Descent de cada nó para um bloco de thread de GPU dedicado. Esse projeto permite um paralelismo maciço e torna a construção de gráficos muito mais rápida do que os métodos tradicionais baseados em CPU.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Etapa 2: podando o gráfico com desvios de 2 saltos</h3><p>Após a conclusão do NN-Descent, o gráfico resultante é preciso, mas excessivamente denso. O NN-Descent mantém intencionalmente vizinhos candidatos extras, e a fase de inicialização aleatória introduz muitas arestas fracas ou irrelevantes. Como resultado, cada nó geralmente acaba com um grau duas vezes - ou até várias vezes - maior do que o grau desejado.</p>
<p>Para produzir um grafo compacto e eficiente, o CAGRA aplica a poda de desvio de 2 saltos.</p>
<p>A ideia é simples: se o nó <em>A</em> pode alcançar o nó <em>B</em> indiretamente através de um vizinho partilhado <em>C</em> (formando um caminho A → C → B), e a distância deste caminho indireto é comparável à distância direta entre <em>A</em> e <em>B</em>, então a aresta direta A → B é considerada redundante e pode ser removida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Uma das principais vantagens desta estratégia de poda é que a verificação da redundância de cada aresta depende apenas da informação local - as distâncias entre os dois pontos finais e os seus vizinhos partilhados. Como cada aresta pode ser avaliada independentemente, a etapa de poda é altamente paralelizável e se encaixa naturalmente na execução em lote da GPU.</p>
<p>Como resultado, o CAGRA pode podar o gráfico de forma eficiente em GPUs, reduzindo a sobrecarga de armazenamento em <strong>40-50%</strong>, preservando a precisão da pesquisa e melhorando a velocidade de travessia durante a execução da consulta.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA em Milvus: o que há de diferente?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora as GPUs ofereçam grandes vantagens de desempenho para a construção de gráficos, os ambientes de produção enfrentam um desafio prático: Os recursos da GPU são muito mais caros e limitados do que os das CPUs. Se a construção de índices e a execução de consultas dependerem exclusivamente de GPUs, vários problemas operacionais surgirão rapidamente:</p>
<ul>
<li><p><strong>Baixa utilização de recursos:</strong> O tráfego de consultas é muitas vezes irregular e intermitente, deixando as GPUs inactivas durante longos períodos e desperdiçando a dispendiosa capacidade de computação.</p></li>
<li><p><strong>Alto custo de implantação:</strong> Atribuir uma GPU a cada instância de serviço de consulta aumenta os custos de hardware, mesmo que a maioria das consultas não utilize totalmente o desempenho da GPU.</p></li>
<li><p><strong>Escalabilidade limitada:</strong> O número de GPUs disponíveis limita diretamente o número de réplicas de serviço que pode executar, restringindo a sua capacidade de escalar com a procura.</p></li>
<li><p><strong>Flexibilidade reduzida:</strong> Quando a criação e a consulta de índices dependem de GPUs, o sistema fica vinculado à disponibilidade de GPUs e não pode mudar facilmente as cargas de trabalho para CPUs.</p></li>
</ul>
<p>Para resolver estas restrições, o Milvus 2.6.1 introduz um modo de implementação flexível para o índice GPU_CAGRA através do parâmetro <code translate="no">adapt_for_cpu</code>. Este modo permite um fluxo de trabalho híbrido: O CAGRA usa a GPU para construir um índice gráfico de alta qualidade, enquanto a execução da consulta é executada na CPU - normalmente usando o HNSW como algoritmo de pesquisa.</p>
<p>Nesta configuração, as GPUs são usadas onde fornecem o maior valor - construção de índice rápida e de alta precisão - enquanto as CPUs lidam com cargas de trabalho de consulta em grande escala de uma forma muito mais económica e escalável.</p>
<p>Como resultado, essa abordagem híbrida é particularmente adequada para cargas de trabalho em que:</p>
<ul>
<li><p><strong>As actualizações de dados são pouco frequentes</strong>, pelo que as reconstruções de índices são raras</p></li>
<li><p><strong>O volume de consultas é elevado</strong>, exigindo muitas réplicas económicas</p></li>
<li><p><strong>A sensibilidade aos custos é elevada</strong> e a utilização de GPU deve ser rigorosamente controlada</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Compreensão <code translate="no">adapt_for_cpu</code></h3><p>No Milvus, o parâmetro <code translate="no">adapt_for_cpu</code> controla a forma como um índice CAGRA é serializado para o disco durante a construção do índice e como é desserializado para a memória no momento do carregamento. Ao alterar essa configuração no momento da construção e no momento do carregamento, o Milvus pode alternar de forma flexível entre a construção de índice baseada em GPU e a execução de consulta baseada em CPU.</p>
<p>Diferentes combinações de <code translate="no">adapt_for_cpu</code> em tempo de construção e tempo de carga resultam em quatro modos de execução, cada um projetado para um cenário operacional específico.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tempo de construção (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Tempo de carregamento (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Lógica de execução</strong></th><th style="text-align:center"><strong>Cenário recomendado</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>verdadeiro</strong></td><td style="text-align:center"><strong>verdadeiro</strong></td><td style="text-align:center">Construir com GPU_CAGRA → serializar como HNSW → desserializar como HNSW → <strong>consulta à CPU</strong></td><td style="text-align:center">Cargas de trabalho sensíveis ao custo; serviço de consultas em grande escala</td></tr>
<tr><td style="text-align:center"><strong>verdadeiro</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Construir com GPU_CAGRA → serializar como HNSW → desserializar como HNSW → <strong>consulta à CPU</strong></td><td style="text-align:center">As consultas subsequentes voltam para a CPU quando ocorrem incompatibilidades de parâmetros</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>verdadeiro</strong></td><td style="text-align:center">Construir com GPU_CAGRA → serializar como CAGRA → deserializar como HNSW → <strong>consulta à CPU</strong></td><td style="text-align:center">Mantém o índice CAGRA original para armazenamento enquanto permite uma pesquisa temporária na CPU</td></tr>
<tr><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center"><strong>falso</strong></td><td style="text-align:center">Construir com GPU_CAGRA → serializar como CAGRA → desserializar como CAGRA → <strong>consulta à GPU</strong></td><td style="text-align:center">Cargas de trabalho de desempenho crítico em que o custo é secundário</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> O mecanismo <code translate="no">adapt_for_cpu</code> suporta apenas conversão unidirecional. Um índice CAGRA pode ser convertido em HNSW porque a estrutura do grafo CAGRA preserva todas as relações de vizinhança de que o HNSW necessita. No entanto, um índice HNSW não pode ser convertido de volta para CAGRA, pois não possui as informações estruturais adicionais necessárias para a consulta baseada em GPU. Como resultado, as definições de tempo de construção devem ser selecionadas cuidadosamente, tendo em consideração a implementação a longo prazo e os requisitos de consulta.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Colocando GPU_CAGRA à prova<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Para avaliar a eficácia do modelo de execução híbrido - usando GPUs para construção de índices e CPUs para execução de consultas - realizamos uma série de experiências controladas em um ambiente padronizado. A avaliação se concentra em três dimensões: <strong>desempenho da construção do índice</strong>, <strong>desempenho da consulta</strong> e <strong>precisão da recuperação</strong>.</p>
<p><strong>Configuração experimental</strong></p>
<p>As experiências foram realizadas em hardware padrão da indústria, amplamente adotado, para garantir que os resultados permanecem fiáveis e amplamente aplicáveis.</p>
<ul>
<li><p>CPU: Processador MD EPYC 7R13 (16 cpus)</p></li>
<li><p>GPU: NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Desempenho da construção do índice</h3><p>Comparamos o CAGRA construído na GPU com o HNSW construído na CPU, sob o mesmo grau de gráfico alvo de 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principais conclusões</strong></p>
<ul>
<li><p><strong>O CAGRA da GPU constrói índices de 12 a 15 vezes mais rápido que o HNSW da CPU.</strong> Tanto no Cohere1M quanto no Gist1M, o CAGRA baseado em GPU supera significativamente o HNSW baseado em CPU, destacando a eficiência do paralelismo da GPU durante a construção do gráfico.</p></li>
<li><p><strong>O tempo de construção aumenta linearmente com as iterações NN-Descent.</strong> À medida que o número de iterações aumenta, o tempo de construção cresce de forma quase linear, reflectindo a natureza de refinamento iterativo do NN-Descent e proporcionando um compromisso previsível entre o custo de construção e a qualidade do gráfico.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Desempenho da consulta</h3><p>Nesta experiência, o gráfico CAGRA é construído uma vez na GPU e depois consultado usando dois caminhos de execução diferentes:</p>
<ul>
<li><p><strong>Consulta na CPU</strong>: o índice é desserializado para o formato HNSW e pesquisado na CPU</p></li>
<li><p><strong>Consulta na GPU</strong>: a pesquisa é executada diretamente no gráfico CAGRA utilizando a passagem baseada na GPU</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principais conclusões</strong></p>
<ul>
<li><p><strong>A taxa de transferência da pesquisa da GPU é de 5 a 6 vezes maior que a da CPU.</strong> Tanto no Cohere1M como no Gist1M, a travessia baseada em GPU proporciona QPS substancialmente mais elevados, realçando a eficiência da navegação paralela em grafos nas GPUs.</p></li>
<li><p><strong>A recordação aumenta com as iterações NN-Descent e depois atinge um patamar.</strong> À medida que o número de iterações de construção cresce, a recuperação melhora tanto para consultas em CPU quanto em GPU. No entanto, para além de um certo ponto, as iterações adicionais produzem ganhos decrescentes, indicando que a qualidade do gráfico convergiu em grande medida.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Precisão da recuperação</h3><p>Nesta experiência, tanto o CAGRA como o HNSW são consultados na CPU para comparar a recuperação em condições de consulta idênticas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principais conclusões</strong></p>
<p><strong>O CAGRA alcança maior recall do que o HNSW em ambos os conjuntos de dados</strong>, mostrando que, mesmo quando um índice CAGRA é construído na GPU e desserializado para pesquisa na CPU, a qualidade do gráfico é bem preservada.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">O que vem a seguir: Escalonando a construção de índices com a Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>A abordagem híbrida GPU-CPU da Milvus oferece uma solução prática e econômica para as cargas de trabalho atuais de pesquisa vetorial em larga escala. Ao construir gráficos CAGRA de alta qualidade em GPUs e atender consultas em CPUs, ele combina a construção rápida de índices com a execução de consultas escalonável e acessível - particularmente<strong>adequada para cargas de trabalho com atualizações pouco frequentes, altos volumes de consulta e restrições rígidas de custo.</strong></p>
<p>Em escalas ainda maiores - dezenas<strong>ou centenas de milhares de milhões de vectores -</strong>a própria construção de<strong>índices</strong>torna-se o gargalo. Quando o conjunto de dados completo não cabe mais na memória da GPU, o setor normalmente recorre a métodos <strong>de construção de gráficos baseados em inserção</strong>, como o <strong>Vamana</strong>. Em vez de construir o gráfico de uma só vez, o Vamana processa os dados em lotes, inserindo novos vectores de forma incremental, mantendo a conetividade global.</p>
<p>Seu pipeline de construção segue três etapas principais:</p>
<p><strong>1. Crescimento geométrico do lote</strong> - começando com pequenos lotes para formar um esqueleto do gráfico, depois aumentando o tamanho do lote para maximizar o paralelismo e, finalmente, usando grandes lotes para refinar os detalhes.</p>
<p><strong>2. Inserção gulosa</strong> - cada novo nó é inserido navegando a partir de um ponto de entrada central, refinando iterativamente o seu conjunto de vizinhos.</p>
<p><strong>3. Actualizações de arestas para trás</strong> - adição de ligações inversas para preservar a simetria e garantir uma navegação eficiente no grafo.</p>
<p>A poda é integrada diretamente no processo de construção utilizando o critério α-RNG: se um candidato a vizinho <em>v</em> já estiver coberto por um vizinho existente <em>p′</em> (ou seja, <em>d(p′, v) &lt; α × d(p, v)</em>), então <em>v</em> é podado. O parâmetro α permite um controlo preciso da esparsidade e da precisão. A aceleração da GPU é conseguida através do paralelismo em lote e do escalonamento geométrico do lote, estabelecendo um equilíbrio entre a qualidade do índice e o rendimento.</p>
<p>Em conjunto, estas técnicas permitem às equipas lidar com o rápido crescimento de dados e actualizações de índices em grande escala sem se depararem com limitações de memória da GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A equipa da Milvus está a desenvolver ativamente o suporte da Vamana, com um lançamento previsto para o primeiro semestre de 2026. Fique atento.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas por meio do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre os recursos do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando Milvus 2.6: Pesquisa Vetorial Acessível em Escala de Bilhões</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a função Embedding: Como o Milvus 2.6 agiliza a vetorização e a busca semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding no Milvus: Filtragem JSON 88,9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades de Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: A arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para o Milvus</a></p></li>
</ul>
