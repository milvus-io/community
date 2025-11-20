---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  Compreender o índice vetorial da FIV: Como funciona e quando o escolher em vez
  do HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_1bbe0e9f85.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Saiba como funciona o índice vetorial IVF, como acelera a pesquisa ANN e
  quando supera o HNSW em termos de velocidade, memória e eficiência de
  filtragem.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>Numa base de dados de vectores, é frequente termos de encontrar rapidamente os resultados mais semelhantes entre vastas colecções de vectores de elevada dimensão - tais como caraterísticas de imagens, incorporação de texto ou representações de áudio. Sem um índice, a única opção é comparar o vetor de consulta com cada um dos vectores do conjunto de dados. Esta <strong>pesquisa de força bruta</strong> pode funcionar quando se tem alguns milhares de vectores, mas quando se lida com dezenas ou centenas de milhões, torna-se insuportavelmente lenta e computacionalmente dispendiosa.</p>
<p>É aí que entra a pesquisa <strong>ANN (Approximate Nearest Neighbor</strong> ). Pense nisso como procurar um livro específico numa biblioteca enorme. Em vez de verificar todos os livros um a um, começa por navegar nas secções com maior probabilidade de o conter. Poderá não obter <em>exatamente</em> os mesmos resultados que uma pesquisa completa, mas estará muito próximo e numa fração do tempo. Em suma, a ANN troca uma ligeira perda de precisão por um aumento significativo de velocidade e escalabilidade.</p>
<p>Entre as muitas formas de implementar a pesquisa ANN, <strong>IVF (Inverted File)</strong> e <strong>HNSW (Hierarchical Navigable Small World)</strong> são duas das mais utilizadas. Mas o IVF destaca-se pela sua eficiência e adaptabilidade na pesquisa vetorial em grande escala. Neste artigo, vamos explicar-lhe como funciona o IVF e como se compara com o HNSW - para que possa compreender as suas vantagens e desvantagens e escolher o que melhor se adequa à sua carga de trabalho.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">O que é um índice de vetor IVF?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O IVF (Inverted File)</strong> é um dos algoritmos mais utilizados para ANN. A sua ideia central provém do "índice invertido" utilizado em sistemas de recuperação de texto - só que, desta vez, em vez de palavras e documentos, estamos a lidar com vectores num espaço de elevada dimensão.</p>
<p>Pense nisto como organizar uma biblioteca enorme. Se colocasse todos os livros (vectores) numa pilha gigante, encontrar o que precisa demoraria uma eternidade. O IVF resolve este problema <strong>agrupando</strong> primeiro todos os vectores em grupos, ou <em>baldes</em>. Cada grupo representa uma "categoria" de vectores semelhantes, definida por um <strong>centróide - uma</strong>espécie de resumo ou "etiqueta" para tudo o que está dentro desse grupo.</p>
<p>Quando uma consulta chega, a pesquisa ocorre em duas etapas:</p>
<p><strong>1. Encontrar os clusters mais próximos.</strong> O sistema procura os poucos conjuntos cujos centróides estão mais próximos do vetor de consulta - tal como ir diretamente para as duas ou três secções da biblioteca com maior probabilidade de terem o seu livro.</p>
<p><strong>2. Pesquise dentro desses grupos.</strong> Quando estiver nas secções certas, só precisa de procurar num pequeno conjunto de livros em vez de em toda a biblioteca.</p>
<p>Esta abordagem reduz a quantidade de computação em ordens de grandeza. Continua a obter resultados altamente precisos, mas muito mais rapidamente.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Como construir um índice vetorial de FIV<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>O processo de criação de um índice vetorial FIV envolve três etapas principais: Agrupamento K-means, Atribuição de Vetor e Codificação de Compressão (Opcional). O processo completo tem o seguinte aspeto:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Etapa 1: Agrupamento K-means</h3><p>Em primeiro lugar, execute o agrupamento K-means no conjunto de dados X para dividir o espaço vetorial de alta dimensão em n grupos de listas. Cada cluster é representado por um centróide, que é armazenado na tabela de centróides C. O número de centróides, nlist, é um hiperparâmetro chave que determina o grau de precisão do agrupamento.</p>
<p>Eis como o k-means funciona nos bastidores:</p>
<ul>
<li><p><strong>Inicialização:</strong> Selecionar aleatoriamente os vectores <em>nlist</em> como centróides iniciais.</p></li>
<li><p><strong>Atribuição:</strong> Para cada vetor, calcula a sua distância a todos os centróides e atribui-o ao mais próximo.</p></li>
<li><p><strong>Atualização:</strong> Para cada cluster, calcule a média dos seus vectores e defina-a como o novo centróide.</p></li>
<li><p><strong>Iteração e convergência:</strong> Repetir a atribuição e atualização até os centróides deixarem de mudar significativamente ou até ser atingido um número máximo de iterações.</p></li>
</ul>
<p>Uma vez que o k-means converge, os centróides da lista n resultante formam o "diretório de índices" do IVF. Eles definem como o conjunto de dados é particionado de forma grosseira, permitindo que as consultas reduzam rapidamente o espaço de pesquisa posteriormente.</p>
<p>Voltemos à analogia da biblioteca: treinar centróides é como decidir como agrupar livros por tópico:</p>
<ul>
<li><p>Uma lista n maior significa mais secções, cada uma com menos livros e mais específicos.</p></li>
<li><p>Uma lista n mais pequena significa menos secções, cada uma cobrindo uma gama mais vasta e variada de tópicos.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Passo 2: Atribuição de vectores</h3><p>Em seguida, cada vetor é atribuído ao cluster cujo centróide está mais próximo, formando listas invertidas (List_i). Cada lista invertida armazena os IDs e as informações de armazenamento de todos os vectores que pertencem a esse cluster.</p>
<p>Pode pensar neste passo como se estivesse a arrumar os livros nas suas respectivas secções. Quando procurar um título mais tarde, só precisa de verificar as poucas secções que têm maior probabilidade de o ter, em vez de percorrer toda a biblioteca.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Passo 3: Codificação de compressão (opcional)</h3><p>Para poupar memória e acelerar o cálculo, os vectores de cada grupo podem passar por uma codificação de compressão. Existem duas abordagens comuns:</p>
<ul>
<li><p><strong>SQ8 (Quantização escalar):</strong> Este método quantiza cada dimensão de um vetor em 8 bits. Para um vetor <code translate="no">float32</code> padrão, cada dimensão ocupa normalmente 4 bytes. Com a SQ8, é reduzida a apenas 1 byte, atingindo uma taxa de compressão de 4:1 e mantendo a geometria do vetor praticamente intacta.</p></li>
<li><p><strong>PQ (Product Quantization):</strong> Divide um vetor de elevada dimensão em vários subespaços. Por exemplo, um vetor de 128 dimensões pode ser dividido em 8 sub-vectores de 16 dimensões cada. Em cada subespaço, um pequeno livro de códigos (normalmente com 256 entradas) é pré-treinado e cada sub-vetor é representado por um índice de 8 bits que aponta para a entrada do livro de códigos mais próxima. Isto significa que o vetor original de 128-D <code translate="no">float32</code> (que requer 512 bytes) pode ser representado utilizando apenas 8 bytes (8 subespaços × 1 byte cada), atingindo um rácio de compressão de 64:1.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Como utilizar o índice vetorial IVF para pesquisa<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma vez construídos a tabela de centróides, as listas invertidas, o codificador de compressão e os livros de códigos (opcional), o índice FIV pode ser usado para acelerar a pesquisa de similaridade. O processo tem normalmente três passos principais, como se mostra a seguir:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Passo 1: Calcular as distâncias do vetor de consulta a todos os centróides</h3><p>Quando chega um vetor de consulta q, o sistema começa por determinar a que clusters é mais provável que pertença. Depois, calcula a distância entre q e cada centróide na tabela de centróides C - normalmente utilizando a distância euclidiana ou o produto interno como métrica de semelhança. Os centróides são então ordenados pela sua distância ao vetor de consulta, produzindo uma lista ordenada do mais próximo para o mais distante.</p>
<p>Por exemplo, como mostrado na ilustração, a ordem é: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Etapa 2: selecionar os clusters nprobe mais próximos</h3><p>Para evitar a varredura de todo o conjunto de dados, o IVF pesquisa apenas dentro dos <em>nagrupamentos de sonda</em> superiores que estão mais próximos do vetor de consulta.</p>
<p>O parâmetro nprobe define o âmbito da pesquisa e afecta diretamente o equilíbrio entre a velocidade e a recuperação:</p>
<ul>
<li><p>Um nprobe mais pequeno conduz a consultas mais rápidas, mas pode reduzir a recuperação.</p></li>
<li><p>Um nprobe maior melhora a recuperação, mas aumenta a latência.</p></li>
</ul>
<p>Nos sistemas reais, nprobe pode ser ajustado dinamicamente com base no orçamento de latência ou nos requisitos de precisão. No exemplo acima, se nprobe = 2, o sistema só pesquisará dentro do Cluster 2 e do Cluster 4 - os dois clusters mais próximos.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Passo 3: Pesquisar o vizinho mais próximo nos clusters selecionados</h3><p>Uma vez selecionados os clusters candidatos, o sistema compara o vetor de consulta q com os vectores armazenados nos mesmos. Existem dois modos principais de comparação:</p>
<ul>
<li><p><strong>Comparação exacta (IVF_FLAT)</strong>: O sistema recupera os vectores originais dos clusters selecionados e calcula diretamente as suas distâncias a q, obtendo os resultados mais exactos.</p></li>
<li><p><strong>Comparação aproximada (IVF_PQ / IVF_SQ8)</strong>: Quando é utilizada a compressão PQ ou SQ8, o sistema utiliza um <strong>método de tabela de pesquisa</strong> para acelerar o cálculo da distância. Antes do início da pesquisa, calcula previamente as distâncias entre o vetor de consulta e cada entrada do livro de códigos. Depois, para cada vetor, pode simplesmente "procurar e somar" estas distâncias pré-computadas para estimar a semelhança.</p></li>
</ul>
<p>Finalmente, os resultados candidatos de todos os clusters pesquisados são fundidos e reordenados, produzindo os Top-k vectores mais semelhantes como resultado final.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">FIV na prática<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de entender como os índices vetoriais IVF são <strong>criados</strong> e <strong>pesquisados</strong>, a próxima etapa é aplicá-los em cargas de trabalho reais. Na prática, muitas vezes é necessário equilibrar <strong>desempenho</strong>, <strong>precisão</strong> e <strong>uso de memória</strong>. Abaixo estão algumas diretrizes práticas extraídas da experiência de engenharia.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Como escolher a nlist correta</h3><p>Como mencionado anteriormente, o parâmetro nlist determina o número de clusters em que o conjunto de dados é dividido ao criar um índice IVF.</p>
<ul>
<li><p><strong>Uma lista parcial maior</strong>: Cria clusters mais refinados, o que significa que cada cluster contém menos vetores. Isto reduz o número de vectores analisados durante a pesquisa e geralmente resulta em consultas mais rápidas. Mas a criação do índice leva mais tempo e a tabela de centroides consome mais memória.</p></li>
<li><p><strong>Lista n menor</strong>: Acelera a construção do índice e reduz a utilização de memória, mas cada cluster fica mais "lotado". Cada consulta tem de pesquisar mais vectores dentro de um cluster, o que pode levar a estrangulamentos de desempenho.</p></li>
</ul>
<p>Com base nestas compensações, eis uma regra prática:</p>
<p>Para conjuntos de dados à <strong>escala de um milhão</strong>, um bom ponto de partida é <strong>nlist ≈ √n</strong> (n é o número de vectores no fragmento de dados que está a ser indexado).</p>
<p>Por exemplo, se você tiver 1 milhão de vetores, tente nlist = 1.000. Para conjuntos de dados maiores - dezenas ou centenas de milhões - a maioria das bases de dados vectoriais fragmenta os dados de modo a que cada fragmento contenha cerca de um milhão de vectores, mantendo esta regra prática.</p>
<p>Como a nlist é fixada na criação do índice, alterá-la posteriormente significa reconstruir todo o índice. Portanto, é melhor fazer experiências logo no início. Teste vários valores - idealmente em potências de dois (por exemplo, 1024, 2048) - para encontrar o ponto ideal que equilibre velocidade, precisão e memória para sua carga de trabalho.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Como ajustar o nprobe</h3><p>O parâmetro nprobe controla o número de clusters pesquisados durante o tempo de consulta. Ele afeta diretamente o equilíbrio entre a recuperação e a latência.</p>
<ul>
<li><p><strong>Maior nprobe</strong>: Cobre mais clusters, levando a uma maior recuperação, mas também a uma maior latência. O atraso geralmente aumenta linearmente com o número de clusters pesquisados.</p></li>
<li><p><strong>Nprobe mais pequeno</strong>: Pesquisa menos clusters, resultando em menor latência e consultas mais rápidas. No entanto, pode falhar alguns vizinhos mais próximos verdadeiros, diminuindo ligeiramente a recuperação e a precisão dos resultados.</p></li>
</ul>
<p>Se a sua aplicação não for extremamente sensível à latência, é uma boa ideia experimentar o nprobe dinamicamente - por exemplo, testando valores de 1 a 16 para observar como a recuperação e a latência mudam. O objetivo é encontrar o ponto ideal em que a recuperação seja aceitável e a latência permaneça dentro do intervalo desejado.</p>
<p>Como o nprobe é um parâmetro de pesquisa em tempo de execução, ele pode ser ajustado em tempo real sem exigir que o índice seja reconstruído. Isso permite um ajuste rápido, de baixo custo e altamente flexível em diferentes cargas de trabalho ou cenários de consulta.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Variantes comuns do índice IVF</h3><p>Ao criar um índice IVF, você precisará decidir se deseja usar a codificação de compactação para os vetores em cada cluster e, em caso afirmativo, qual método usar.</p>
<p>Isso resulta em três variantes comuns de índice FIV:</p>
<table>
<thead>
<tr><th><strong>Variante IVF</strong></th><th><strong>Principais recursos</strong></th><th><strong>Casos de uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Armazena vectores brutos em cada cluster sem compressão. Oferece a maior precisão, mas também consome mais memória.</td><td>Ideal para conjuntos de dados de média escala (até centenas de milhões de vectores) em que é necessária uma elevada recuperação (95%+).</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Aplica a Quantização de Produtos (PQ) para comprimir vectores dentro de clusters. Ao ajustar o rácio de compressão, a utilização de memória pode ser significativamente reduzida.</td><td>Adequado para pesquisa de vectores em grande escala (centenas de milhões ou mais) onde é aceitável alguma perda de precisão. Com um rácio de compressão de 64:1, a recuperação é tipicamente de cerca de 70%, mas pode atingir 90% ou mais ao reduzir o rácio de compressão.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Utiliza a Quantização escalar (SQ8) para quantizar vectores. A utilização de memória situa-se entre IVF_FLAT e IVF_PQ.</td><td>Ideal para pesquisa de vectores em grande escala, onde é necessário manter uma recuperação relativamente elevada (90%+) enquanto se melhora a eficiência.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW: Escolha o que se encaixa<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Além do IVF, <strong>o HNSW (Hierarchical Navigable Small World)</strong> é outro índice de vetor na memória amplamente utilizado. A tabela abaixo destaca as principais diferenças entre os dois.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algoritmo Conceito</strong></td><td>Agrupamento e classificação</td><td>Navegação gráfica multi-camada</td></tr>
<tr><td><strong>Utilização de memória</strong></td><td>Relativamente baixa</td><td>Relativamente alta</td></tr>
<tr><td><strong>Velocidade de construção do índice</strong></td><td>Rápida (apenas requer clustering)</td><td>Lenta (necessita de construção de gráficos multi-camadas)</td></tr>
<tr><td><strong>Velocidade de consulta (sem filtragem)</strong></td><td>Rápida, depende do <em>nprobe</em></td><td>Extremamente rápida, mas com complexidade logarítmica</td></tr>
<tr><td><strong>Velocidade da consulta (com filtragem)</strong></td><td>Estável - efectua uma filtragem grosseira ao nível do centróide para reduzir os candidatos</td><td>Instável - especialmente quando o rácio de filtragem é elevado (90%+), o grafo fica fragmentado e pode degradar-se para uma travessia quase total do grafo, ainda mais lenta do que a pesquisa de força bruta</td></tr>
<tr><td><strong>Taxa de recuperação</strong></td><td>Depende da utilização de compressão; sem quantização, a recuperação pode atingir <strong>95%+</strong></td><td>Normalmente mais alta, cerca de <strong>98%+</strong></td></tr>
<tr><td><strong>Parâmetros chave</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Casos de utilização</strong></td><td>Quando a memória é limitada, mas é necessário um elevado desempenho de consulta e recuperação; adequado para pesquisas com condições de filtragem</td><td>Quando a memória é suficiente e o objetivo é um desempenho de consulta e de recuperação extremamente elevado, mas a filtragem não é necessária, ou o rácio de filtragem é baixo</td></tr>
</tbody>
</table>
<p>Em aplicações do mundo real, é muito comum incluir condições de filtragem - por exemplo, "pesquisar apenas vectores de um utilizador específico" ou "limitar os resultados a um determinado intervalo de tempo". Devido às diferenças nos seus algoritmos subjacentes, o IVF geralmente lida com pesquisas filtradas de forma mais eficiente do que o HNSW.</p>
<p>A força do IVF reside no seu processo de filtragem a dois níveis. Em primeiro lugar, pode efetuar um filtro de granularidade grosseira ao nível do centróide (cluster) para reduzir rapidamente o conjunto de candidatos e, em seguida, efetuar cálculos de distância de granularidade fina dentro dos clusters selecionados. Isto mantém um desempenho estável e previsível, mesmo quando uma grande parte dos dados é filtrada.</p>
<p>Em contraste, o HNSW é baseado na travessia de gráficos. Devido à sua estrutura, não pode aproveitar diretamente as condições de filtragem durante a travessia. Quando o rácio de filtragem é baixo, isto não causa grandes problemas. No entanto, quando o rácio de filtragem é elevado (por exemplo, mais de 90% dos dados são filtrados), o gráfico restante torna-se frequentemente fragmentado, formando muitos "nós isolados". Nesses casos, a pesquisa pode degradar-se para uma travessia quase total do grafo - por vezes ainda pior do que uma pesquisa de força bruta.</p>
<p>Na prática, os índices IVF já estão a alimentar muitos casos de utilização de grande impacto em diferentes domínios:</p>
<ul>
<li><p><strong>Pesquisa de comércio eletrónico:</strong> Um utilizador pode carregar uma imagem de um produto e encontrar instantaneamente itens visualmente semelhantes em milhões de listagens.</p></li>
<li><p><strong>Recuperação de patentes:</strong> Dada uma breve descrição, o sistema pode localizar as patentes mais semanticamente relacionadas a partir de uma enorme base de dados - muito mais eficiente do que a tradicional pesquisa por palavras-chave.</p></li>
<li><p><strong>Bases de conhecimento RAG:</strong> O IVF ajuda a recuperar o contexto mais relevante de milhões de documentos de inquilinos, garantindo que os modelos de IA geram respostas mais precisas e fundamentadas.</p></li>
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
    </button></h2><p>Para escolher o índice certo, tudo se resume ao seu caso de utilização específico. Se estiver a trabalhar com conjuntos de dados de grande escala ou precisar de suportar pesquisas filtradas, o IVF pode ser a melhor opção. Em comparação com índices baseados em gráficos, como o HNSW, o IVF oferece compilações de índices mais rápidas, menor uso de memória e um forte equilíbrio entre velocidade e precisão.</p>
<p><a href="https://milvus.io/">Milvus</a>, o banco de dados vetorial de código aberto mais popular, fornece suporte completo para toda a família IVF, incluindo IVF_FLAT, IVF_PQ e IVF_SQ8. Pode experimentar facilmente estes tipos de índices e encontrar a configuração que melhor se adapta às suas necessidades de desempenho e memória. Para obter uma lista completa dos índices que o Milvus suporta, consulte esta <a href="https://milvus.io/docs/index-explained.md">página do documento Milvus Index</a>.</p>
<p>Se estiver a construir pesquisa de imagens, sistemas de recomendação ou bases de conhecimento RAG, experimente a indexação IVF no Milvus e veja como a pesquisa vetorial eficiente e em grande escala se sente em ação.</p>
