---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >-
  Como executar 25 milhões de vectores de imagem com menos de 1 GB de memória em
  Milvus
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Como um utilizador da comunidade executou uma pesquisa de imagens de 25M de
  vectores em &lt;1GB de memória em Milvus utilizando FLAT, FP16 e mmap - em vez
  da estimativa de 139GB da Sizing Tool.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Um utilizador do Milvus contactou-nos recentemente com um problema muito prático de pesquisa de imagens.</p>
<p>"Precisamos de fazer uma pesquisa imagem a imagem em 25 milhões de imagens, codificadas como vectores de 1280 dimensões. A carga de trabalho será efectuada por uma única máquina. Tem 64GB de RAM e, no máximo, 32GB podem ir para a base de dados vetorial. Mas a <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> diz que precisamos de 139GB. Estamos tramados?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Resultados da estimativa da ferramenta de dimensionamento: 25M × 1280 vectores dimensionais, tamanho dos dados brutos 119,2 GB, memória de carregamento 139,4 GB</p>
<p>Não é bem assim.</p>
<p>No início, a resposta óbvia parecia ser um índice mais avançado. Se o conjunto de dados é grande e a memória é escassa, certamente um índice ANN mais inteligente deve ajudar. Neste caso, não ajudou. O índice que finalmente funcionou foi a opção mais simples do Milvus: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>O resultado foi melhor do que o esperado: a memória em estado estável ficou abaixo de 1 GB, a memória residente do contêiner ficou em torno de 600 MB e a latência de consulta quente ficou abaixo de 100 ms. A inicialização atingiu brevemente um pico de cerca de 12,5GB, e a primeira consulta levou cerca de 30 segundos enquanto o sistema aquecia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A parte importante não é o facto de o FLAT ter tornado magicamente baratas 25 milhões de comparações de força bruta. Isso não aconteceu. A parte importante é que essa carga de trabalho quase nunca pesquisou todos os 25 milhões de vetores. Os filtros escalares restringiram cada consulta primeiro, e o FLAT só comparou os vetores dentro desse conjunto de candidatos muito menor.</p>
<p>Este post mostra o que falhou, por que o FLAT funcionou e quando vale a pena tentar o mesmo padrão em sua própria carga de trabalho.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Por que o AISAQ e o IVF_FLAT não funcionaram aqui<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes do FLAT, o usuário tentou dois índices que pareciam mais naturais para uma máquina com restrições.</p>
<p><strong>Primeira tentativa:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> O AISAQ é um índice orientado a disco projetado para manter o uso de memória baixo. O problema nessa carga de trabalho foi o caminho de compilação e carregamento. Num teste anterior com 55 milhões de vectores, um carregamento de coleção escreveu 249 GB de dados temporários no disco e demorou demasiado tempo para ser prático.</p>
<p><strong>Segunda tentativa: IVF_FLAT.</strong> O IVF_FLAT também parecia razoável porque é um índice ANN padrão. O índice foi criado com êxito, mas a carga de recolha parou nos 14% e nunca mais recuperou.</p>
<p>Após estes dois becos sem saída, o utilizador tentou a opção mais aborrecida: FLAT. Carregou sem problemas. Também apresentou o melhor comportamento de tempo de execução para esse padrão de consulta específico.</p>
<table>
<thead>
<tr><th><strong>Índice</strong></th><th><strong>Por que parecia promissor</strong></th><th><strong>O que aconteceu nesta carga de trabalho</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Índice orientado para o disco com baixa utilização de memória em teoria</td><td>O caminho de compilação/carregamento gerou grandes ficheiros temporários. Num teste de 55M de vectores, uma carga de coleção escreveu 249GB de dados temporários e foi lenta.</td></tr>
<tr><td>IVF_FLAT</td><td>Índice ANN standard com um custo de pesquisa inferior ao de uma pesquisa completa</td><td>O índice foi criado, mas a carga da coleção parou em 14% e não recuperou.</td></tr>
<tr><td>FLAT</td><td>Sem estrutura ANN extra e sem complexidade de construção de índice</td><td>A memória em estado estacionário ficou abaixo de 1GB. A memória residente do container ficou em torno de 600MB. O arranque atingiu um pico de 12,5GB. A primeira consulta demorou cerca de 30s, depois as consultas quentes ficaram abaixo de 100ms.</td></tr>
</tbody>
</table>
<p>A lição é simples: um índice que é eficiente em teoria ainda pode ser o ajuste errado para uma máquina específica, formato de dados e padrão de consulta.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Por que o FLAT funcionou<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT é o índice mais simples que o Milvus suporta. Sem gráfico. Sem árvore. Sem agrupamento. Compara o vetor de consulta diretamente com os vectores candidatos.</p>
<p>Parece ser a ferramenta errada para 25 milhões de vectores. Seria a ferramenta errada se cada consulta procurasse toda a coleção.</p>
<p>Mas esta carga de trabalho tinha um filtro forte à frente da pesquisa de vectores. Todas as consultas restringiam primeiro o espaço de pesquisa com campos escalares como <code translate="no">dataid</code> e <code translate="no">classid</code>. Só depois é que o Milvus executava a pesquisa de semelhanças vectoriais. Isso mudou o problema de "pesquisar 25 milhões de vectores" para "pesquisar algumas centenas a dezenas de milhares de vectores após a filtragem".</p>
<p>Três peças fizeram a configuração funcionar: Armazenamento de vetores FP16, mmap para dados vetoriais brutos e filtragem escalar antes da passagem FLAT.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Otimização 1: FP16 corta os dados vectoriais para metade<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>Os vetores tinham 1280 dimensões. Armazenado como FP32, cada vetor precisa de 5120 bytes:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Em 25 milhões de vectores, isto representa cerca de 119,2 GB de dados vectoriais em bruto. O FP16 reduz cada dimensão de 4 bytes para 2 bytes:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>Assim, os dados vectoriais em bruto baixam para cerca de 59,6 GB.</p>
<p>Isto ainda não cabe perfeitamente na RAM disponível, mas reduz para metade a quantidade de dados vectoriais que o Milvus e o sistema operativo têm de tratar. Em muitas cargas de trabalho de recuperação de imagens, o FP16 tem um pequeno impacto na recuperação, mas não é uma regra gratuita. Teste a recuperação com seus próprios embeddings, métrica e barra de qualidade antes de torná-la padrão.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Otimização 2: mmap mantém os vectores brutos fora da pilha do processo<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Mesmo depois do FP16, cerca de 60GB de vectores ainda é demasiado para o orçamento de memória. É aí que <a href="https://milvus.io/docs/mmap.md"><strong>o mmap</strong></a> se torna útil.</p>
<p>Com o mmap, o Milvus pode aceder a dados vectoriais através de ficheiros mapeados na memória em vez de carregar todo o campo de vectores em bruto na memória do processo. O sistema operativo coloca os dados nas páginas à medida que as consultas os tocam e pode manter as páginas quentes na sua cache de páginas.</p>
<p>No ambiente Milvus 2.6.14 deste utilizador, a configuração do mmap ao nível do cluster já cobria os dados vectoriais em bruto, pelo que o utilizador não precisava de definir o mmap manualmente.</p>
<p>Um detalhe causou confusão durante a depuração: O Attu mostra a configuração do mmap ao nível do esquema, não a predefinição ao nível do cluster. Portanto, <a href="https://zilliz.com/attu"><strong>o Attu</strong></a> pode mostrar o mmap como desabilitado mesmo quando a configuração no nível do cluster está efetivamente habilitando o mmap para o caminho de dados.</p>
<p>O mmap economiza RAM, mas usa mais o disco e o cache de página do sistema operacional. Você ainda precisa de capacidade SSD para os arquivos vetoriais, e a primeira consulta pode ser mais lenta enquanto as páginas relevantes são lidas do disco.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Otimização 3: A filtragem escalar é o verdadeiro multiplicador de desempenho<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 e mmap explicam o número de memória. A filtragem escalar explica o número da latência.</p>
<p>Cada consulta nesta carga de trabalho incluía uma expressão de filtro como esta:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Esse filtro era executado antes da etapa de comparação de vetores. Em vez de comparar com 25 milhões de vectores, o FLAT comparou com o conjunto de candidatos filtrados, que variava entre algumas centenas e dezenas de milhares de vectores.</p>
<p>É por isso que as consultas quentes ficaram abaixo de 100ms. Dezenas de milhares de comparações de vectores são práticas numa CPU moderna. Vinte e cinco milhões de comparações por consulta seria uma história muito diferente.</p>
<p>Isso também explica por que IVF_FLAT e HNSW não foram úteis aqui. Uma vez que a filtragem escalar tenha reduzido o conjunto de candidatos o suficiente, uma estrutura ANN extra pode se tornar um peso morto. Acrescenta memória, tempo de construção e complexidade de carga, mas pode não melhorar muito a latência.</p>
<p>Há uma ressalva. Os filtros nesta carga de trabalho eram simples. Se os seus filtros usam grandes listas <code translate="no">IN</code>, padrões <code translate="no">LIKE</code>, predicados de intervalo ou condições JSON aninhadas, adicione índices escalares nos campos relevantes e meça o estágio do filtro diretamente.</p>
<table>
<thead>
<tr><th>Otimização</th><th>O que ela faz</th><th>Por que é importante aqui</th><th>Compensação</th></tr>
</thead>
<tbody>
<tr><td>Armazenamento de vetor FP16</td><td>Armazena cada dimensão do vetor com 2 bytes em vez de 4 bytes</td><td>Reduziu os dados vectoriais em bruto de cerca de 119,2 GB para cerca de 59,6 GB</td><td>O impacto da recordação depende dos seus embeddings e da métrica. Teste-o.</td></tr>
<tr><td>mmap em vectores brutos</td><td>Mapeia ficheiros vectoriais a partir do disco em vez de carregar o campo completo do vetor em bruto para a memória do processo</td><td>Mantém a memória do processo baixa, permitindo que o sistema operacional pagine os dados conforme necessário</td><td>Requer capacidade SSD e pode tornar as consultas frias mais lentas.</td></tr>
<tr><td>Filtragem escalar primeiro</td><td>Filtra por campos escalares antes da comparação de vectores</td><td>Reduziu cada consulta de 25 milhões de candidatos para centenas ou dezenas de milhares</td><td>Filtros complexos podem precisar de índices escalares.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Onde este padrão se aplica<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>O caso da pesquisa de imagens funcionou porque o espaço de pesquisa real era muito menor do que a coleção total. Essa mesma forma aparece em muitas cargas de trabalho de produção.</p>
<ol>
<li><strong>RAG de vários locatários:</strong> filtre primeiro por <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code> ou <code translate="no">project_id</code>. Cada inquilino pode ter apenas milhares ou dezenas de milhares de pedaços.</li>
<li><strong>Pesquisa de produtos de comércio eletrónico:</strong> Filtrar por categoria, marca, vendedor, região ou disponibilidade antes da pesquisa por vetor.</li>
<li><strong>Recuperação de registos e documentos:</strong> Filtrar por intervalo de tempo, fonte, serviço ou tipo de documento antes da pesquisa semântica.</li>
<li><strong>Pesquisa de imagens ou multimédia com etiquetas:</strong> Filtrar por conjunto de dados, classe, cliente ou grupo de activos antes de comparar embeddings.</li>
</ol>
<p>Estes são bons candidatos para FLAT + FP16 + mmap porque a coleção completa pode ser grande enquanto cada consulta ainda toca num pequeno subconjunto.</p>
<p>O padrão não se aplica quando cada consulta pesquisa toda a coleção. Se cada consulta precisar realmente de pesquisar todos os 25 milhões de vectores, o FLAT não lhe dará a mesma latência. Nesse caso, use um índice ANN, como HNSW, IVF ou um índice orientado a disco, e planeje as compensações de memória, disco e tempo de construção.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">Como ler a estimativa da ferramenta de dimensionamento<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Sizing Tool é um ponto de partida, não um veredito final sobre o seu hardware.</p>
<p>Neste caso, a estimativa de 139,4 GB de memória de carregamento serviu como uma linha de base conservadora para 25 milhões de vetores FP32 de 1280 dimensões. A carga de trabalho real alterou vários pressupostos:</p>
<ol>
<li>O FP16 reduziu o tamanho do vetor em bruto para metade.</li>
<li>O mmap evitou carregar o campo completo do vetor bruto na memória do processo.</li>
<li>FLAT evitou estruturas extras de índice ANN.</li>
<li>Os filtros escalares fizeram com que cada consulta buscasse um conjunto de candidatos muito menor.</li>
</ol>
<p>É por isso que os testes de carga de trabalho real são importantes. Antes de rejeitar uma configuração de hardware com base apenas em uma estimativa de tamanho, teste com sua precisão vetorial real, tipo de índice, configuração de mmap, filtros escalares, comportamento de consulta a frio e comportamento de consulta a quente.</p>
<h2 id="Get-Started" class="common-anchor-header">Começar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Se quiser experimentar a mesma receita, comece com o padrão de consulta, não com o nome do índice.</p>
<ol>
<li>Verifique se cada consulta tem filtros escalares selectivos.</li>
<li>Estimar quantos vectores permanecem após a filtragem.</li>
<li>Armazene os vectores como FP16 se o teste de recuperação parecer bom.</li>
<li>Use FLAT quando o conjunto de candidatos filtrados for pequeno o suficiente para comparação de força bruta.</li>
<li>Verificar o comportamento do mmap para dados vetoriais brutos. Verifique as configurações no nível do esquema e no nível do cluster.</li>
<li>Meça a memória de inicialização, a latência da primeira consulta, a latência da consulta a quente e a E/S do disco.</li>
<li>Adicione índices escalares se a avaliação do filtro se tornar o gargalo.</li>
</ol>
<p>Para testes locais, comece com o <a href="https://milvus.io/docs/quickstart.md"><strong>quickstart do Milvus</strong></a> ou o repositório Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>. Use o Attu para inspecionar coleções, mas lembre-se de que o Attu pode não mostrar os padrões de mmap no nível do cluster.</p>
<p>Se você não quiser executar a infraestrutura por conta própria, <a href="https://zilliz.com/cloud"><strong>o Zilliz Cloud</strong></a> é o serviço gerenciado do Milvus. Você obtém o mesmo núcleo do Milvus com operações gerenciadas, escalonamento e uma camada gratuita para testes. <a href="https://cloud.zilliz.com/signup"><strong>Registe-se</strong></a> para obter créditos gratuitos de 100 dólares com um e-mail de trabalho ou inicie <a href="https://cloud.zilliz.com/login"><strong>sessão</strong></a> se já tiver uma conta.</p>
