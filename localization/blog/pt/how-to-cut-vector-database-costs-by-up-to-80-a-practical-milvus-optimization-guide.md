---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Como reduzir os custos das bases de dados vectoriais até 80%: Um guia prático
  de otimização Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  O Milvus é gratuito, mas a infraestrutura não é. Saiba como reduzir os custos
  de memória da base de dados vetorial em 60-80% com melhores índices, MMap e
  armazenamento em camadas.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>O seu protótipo RAG funcionou muito bem. Depois passou à produção, o tráfego aumentou e agora a fatura da sua base de dados vetorial passou de 500 dólares para 5000 dólares por mês. Parece-lhe familiar?</p>
<p>Este é um dos problemas de escala mais comuns em aplicações de IA atualmente. Construiu algo que cria valor real, mas os custos de infraestrutura estão a crescer mais rapidamente do que a sua base de utilizadores está a crescer. E quando você olha para a conta, o banco de dados vetorial costuma ser a maior surpresa - nas implantações que vimos, ele pode representar cerca de 40-50% do custo total do aplicativo, perdendo apenas para as chamadas de API LLM.</p>
<p>Neste guia, vou explicar para onde o dinheiro realmente vai e as coisas específicas que você pode fazer para reduzi-lo - em muitos casos, em 60-80%. Vou usar <a href="https://milvus.io/">o Milvus</a>, a base de dados vetorial open-source mais popular, como exemplo principal, uma vez que é a que conheço melhor, mas os princípios aplicam-se à maioria das bases de dados vectoriais.</p>
<p><em>Para ser claro:</em> <em><a href="https://milvus.io/">o Milvus</a></em> <em>em si é gratuito e de código aberto - nunca se paga pelo software. O custo vem inteiramente da infraestrutura em que é executado: instâncias de nuvem, memória, armazenamento e rede. A boa notícia é que a maior parte desse custo de infraestrutura é redutível.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Para onde o dinheiro realmente vai quando se usa um VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos começar com um exemplo concreto. Digamos que tem 100 milhões de vectores, 768 dimensões, armazenados como float32 - uma configuração RAG bastante típica. Aqui está o custo aproximado disso na AWS por mês:</p>
<table>
<thead>
<tr><th><strong>Componente de custo</strong></th><th><strong>Parcela</strong></th><th><strong>~Custo mensal</strong></th><th><strong>Notas</strong></th></tr>
</thead>
<tbody>
<tr><td>Computação (CPU + memória)</td><td>85-90%</td><td>$2,800</td><td>O mais importante - principalmente devido à memória</td></tr>
<tr><td>Rede</td><td>5-10%</td><td>$250</td><td>Tráfego entre AZs, grandes cargas de resultados</td></tr>
<tr><td>Armazenamento</td><td>2-5%</td><td>$100</td><td>Barato - o armazenamento de objectos (S3/MinIO) custa ~$0,03/GB</td></tr>
</tbody>
</table>
<p>A conclusão é simples: a memória é para onde vai 85-90% do seu dinheiro. A rede e o armazenamento são importantes nas margens, mas se você quiser cortar custos significativamente, a memória é a alavanca. Tudo neste guia se concentra nisso.</p>
<p><strong>Nota rápida sobre rede e armazenamento:</strong> Pode reduzir os custos de rede devolvendo apenas os campos de que necessita (ID, pontuação, metadados chave) e evitando consultas entre regiões. Para o armazenamento, o Milvus já separa o armazenamento da computação - os seus vectores são armazenados em objectos baratos como o S3, por isso, mesmo com 100M de vectores, o armazenamento é normalmente inferior a $50/mês. Nenhuma destas opções irá mover a agulha como a otimização da memória.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Por que a memória é tão cara para a pesquisa vetorial<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Se você vem de bancos de dados tradicionais, os requisitos de memória para pesquisa vetorial podem ser surpreendentes. Um banco de dados relacional pode aproveitar os índices de árvore B baseados em disco e o cache de página do sistema operacional. A pesquisa vetorial é diferente - ela envolve computação maciça de ponto flutuante, e índices como HNSW ou IVF precisam ficar carregados na memória para fornecer latência no nível de milissegundos.</p>
<p>Aqui está uma fórmula rápida para estimar suas necessidades de memória:</p>
<p><strong>Memória necessária = (vectores × dimensões × 4 bytes) × multiplicador de índice</strong></p>
<p>Para o nosso exemplo de 100M × 768 × float32 com HNSW (multiplicador ~1,8x):</p>
<ul>
<li>Dados em bruto: 100M × 768 × 4 bytes ≈ 307 GB</li>
<li>Com índice HNSW: 307 GB × 1,8 ≈ 553 GB</li>
<li>Com sobrecarga do SO, cache e espaço livre: ~768 GB total</li>
<li>No AWS: 3× r6i.8xlarge (256 GB cada) ≈ $2.800/mês</li>
</ul>
<p><strong>Essa é a linha de base. Agora vamos ver como reduzi-la.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Escolha o índice certo para obter 4x menos uso de memória<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta é a mudança de maior impacto que pode ser feita. Para o mesmo conjunto de dados de 100 milhões de vetores, o uso de memória pode variar de 4 a 6 vezes, dependendo da sua escolha de índice.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: quase nenhuma compactação, portanto, o uso da memória permanece próximo ao tamanho dos dados brutos, em torno de <strong>300 GB</strong></li>
<li><strong>HNSW</strong>: armazena uma estrutura gráfica adicional, pelo que a utilização de memória é normalmente <strong>1,5x a 2,0x</strong> o tamanho dos dados em bruto, ou cerca de <strong>450 a 600 GB</strong></li>
<li><strong>IVF_SQ8</strong>: comprime os valores float32 em uint8, obtendo uma <strong>compressão de</strong> cerca de <strong>4x</strong>, pelo que a utilização de memória pode baixar para cerca de <strong>75 a 100 GB</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>: utiliza uma compressão mais forte ou um índice baseado em disco, pelo que a memória pode diminuir ainda mais para cerca de <strong>30 a 60 GB</strong></li>
</ul>
<p>Muitas equipas começam com o HNSW porque tem a melhor velocidade de consulta, mas acabam por pagar 3-5 vezes mais do que o necessário.</p>
<p>Veja como os principais tipos de índice se comparam:</p>
<table>
<thead>
<tr><th><strong>Índice</strong></th><th><strong>Multiplicador de memória</strong></th><th><strong>Velocidade de consulta</strong></th><th><strong>Recuperação</strong></th><th><strong>Melhor para</strong></th></tr>
</thead>
<tbody>
<tr><td>FLAT</td><td>~1.0x</td><td>Lenta</td><td>100%</td><td>Conjuntos de dados pequenos (&lt;1M), testes</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Médio</td><td>95-99%</td><td>Utilização geral</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Média</td><td>93-97%</td><td>Produção sensível aos custos (recomendado)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Rápida</td><td>70-80%</td><td>Conjuntos de dados muito grandes, recuperação grosseira</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Muito rápido</td><td>98-99%</td><td>Apenas quando a latência é mais importante do que o custo</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Médio</td><td>95-98%</td><td>Escala muito grande com SSDs NVMe</td></tr>
</tbody>
</table>
<p><strong>O resultado final:</strong> Mudar de HNSW ou IVF_FLAT para IVF_SQ8 normalmente reduz o recall em apenas 2-3% (por exemplo, de 97% para 94-95%) enquanto reduz o custo de memória em cerca de 70%. Para a maioria das cargas de trabalho RAG, essa troca vale absolutamente a pena. Se estiver a fazer uma recuperação grosseira ou se a sua barra de precisão for mais baixa, o IVF_PQ ou o IVF_RABITQ podem aumentar ainda mais as poupanças.</p>
<p><strong>Minha recomendação:</strong> Se estiver a executar o HNSW na produção e o custo for uma preocupação, experimente primeiro o IVF_SQ8 numa coleção de teste. Meça a recuperação nas suas consultas reais. A maior parte das equipas fica surpreendida com a pequena diminuição da precisão.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Pare de carregar tudo na memória para obter uma redução de custo de 60% a 80%<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Mesmo depois de escolher um índice mais eficiente, é possível que ainda haja mais dados na memória do que o necessário. O Milvus oferece duas maneiras de resolver isso: <strong>MMap (disponível desde a versão 2.3) e armazenamento em camadas (disponível desde a versão 2.6). Ambas podem reduzir o uso de memória em 60-80%.</strong></p>
<p>A idéia central por trás de ambos é a mesma: nem todos os seus dados precisam estar na memória o tempo todo. A diferença é como eles lidam com os dados que não estão na memória.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (Ficheiros Mapeados na Memória)</h3><p>O MMap mapeia os seus ficheiros de dados do disco local para o espaço de endereço do processo. O conjunto de dados completo permanece no disco local do nó, e o SO carrega páginas para a memória a pedido - apenas quando são acedidas. Antes de usar o MMap, todos os dados são baixados do armazenamento de objetos (S3/MinIO) para o disco local do QueryNode.</p>
<ul>
<li>O uso da memória cai para ~10-30% do modo de carga total</li>
<li>A latência permanece estável e previsível (os dados estão no disco local, sem busca na rede)</li>
<li>Compensação: o disco local deve ser suficientemente grande para conter o conjunto de dados completo</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Armazenamento em camadas</h3><p>O armazenamento em camadas vai um passo mais além. Em vez de descarregar tudo para o disco local, utiliza o disco local como cache para dados quentes e mantém o armazenamento de objectos como camada primária. Os dados são obtidos do armazenamento de objectos apenas quando necessário.</p>
<ul>
<li>O uso da memória cai para &lt;10% do modo de carga total</li>
<li>A utilização do disco local também diminui - apenas os dados quentes são colocados em cache (normalmente 10-30% do total)</li>
<li>Compensação: os erros de cache acrescentam uma latência de 50-200 ms (pesquisa no armazenamento de objectos)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Fluxo de dados e utilização de recursos</h3><table>
<thead>
<tr><th><strong>Modo</strong></th><th><strong>Fluxo de dados</strong></th><th><strong>Utilização da memória</strong></th><th><strong>Utilização do disco local</strong></th><th><strong>Latência</strong></th></tr>
</thead>
<tbody>
<tr><td>Carga total tradicional</td><td>Armazenamento de objectos → memória (100%)</td><td>Muito alta (100%)</td><td>Baixa (apenas temporária)</td><td>Muito baixa e estável</td></tr>
<tr><td>MMap</td><td>Armazenamento de objectos → disco local (100%) → memória (a pedido)</td><td>Baixo (10-30%)</td><td>Elevado (100%)</td><td>Baixo e estável</td></tr>
<tr><td>Armazenamento em camadas</td><td>Armazenamento de objectos ↔ cache local (dados quentes) → memória (a pedido)</td><td>Muito baixo (&lt;10%)</td><td>Baixa (apenas dados quentes)</td><td>Baixa taxa de acerto na cache, maior taxa de falha na cache</td></tr>
</tbody>
</table>
<p><strong>Recomendação de hardware:</strong> ambos os métodos dependem fortemente de E/S de disco local, pelo que <strong>os SSD NVMe</strong> são fortemente recomendados, idealmente com <strong>IOPS superior a 10.000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs. armazenamento em camadas: Qual deles você deve usar?</h3><table>
<thead>
<tr><th><strong>Sua situação</strong></th><th><strong>Usar este</strong></th><th><strong>Por que</strong></th></tr>
</thead>
<tbody>
<tr><td>Sensível à latência (P99 &lt; 20ms)</td><td>MMap</td><td>Os dados já estão no disco local - sem busca na rede, latência estável</td></tr>
<tr><td>Acesso uniforme (sem divisão clara entre quente e frio)</td><td>MMap</td><td>O armazenamento em camadas precisa de uma distorção quente/fria para ser eficaz; sem ela, a taxa de acerto da cache é baixa</td></tr>
<tr><td>O custo é a prioridade (não há problema com picos ocasionais de latência)</td><td>Armazenamento em camadas</td><td>Poupa na memória e no disco local (70-90% menos disco)</td></tr>
<tr><td>Padrão claro de quente/frio (regra 80/20)</td><td>Armazenamento em camadas</td><td>Os dados quentes permanecem em cache, os dados frios permanecem baratos no armazenamento de objectos</td></tr>
<tr><td>Escala muito grande (&gt;500M de vectores)</td><td>Armazenamento em camadas</td><td>O disco local de um nó muitas vezes não pode conter o conjunto completo de dados nesta escala</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> MMap requer Milvus 2.3+. O armazenamento em camadas requer o Milvus 2.6+. Ambos funcionam melhor com SSDs NVMe (recomenda-se mais de 10.000 IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Como configurar o MMap</h3><p><strong>Opção 1: configuração YAML (recomendada para novas implantações)</strong></p>
<p>Edite o ficheiro de configuração Milvus milvus.yaml e adicione as seguintes definições na secção queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Opção 2: configuração do Python SDK (para coleções existentes)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Como configurar o armazenamento em camadas (Milvus 2.6+)</h3><p>Edite o ficheiro de configuração do Milvus milvus.yaml e adicione as seguintes definições na secção queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Use Lower-Dimensional Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Este é fácil de ignorar, mas a dimensão dimensiona diretamente o seu custo. A memória, o armazenamento e a computação crescem linearmente com a contagem de dimensões. Um modelo de 1536 dimensões custa cerca de 4x mais infraestrutura do que um modelo de 384 dimensões para os mesmos dados.</p>
<p>O custo da consulta é escalonado da mesma forma - a similaridade de cosseno é O(D), portanto, vetores de 768 dimensões consomem aproximadamente o dobro da computação de vetores de 384 dimensões por consulta. Em cargas de trabalho de alto QPS, essa diferença se traduz diretamente em menos nós necessários.</p>
<p>Veja como os modelos de incorporação comuns se comparam (usando 384-dim como linha de base de 1,0x):</p>
<table>
<thead>
<tr><th><strong>Modelo</strong></th><th><strong>Dimensões</strong></th><th><strong>Custo relativo</strong></th><th><strong>Recuperação</strong></th><th><strong>Melhor para</strong></th></tr>
</thead>
<tbody>
<tr><td>text-embedding-3-large</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Quando a precisão não é negociável (investigação, cuidados de saúde)</td></tr>
<tr><td>texto-embedding-3-pequeno</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Cargas de trabalho RAG gerais</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Bom equilíbrio entre custo e desempenho</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Cargas de trabalho sensíveis ao custo</td></tr>
</tbody>
</table>
<p><strong>Conselhos práticos:</strong> Não parta do princípio de que precisa do maior modelo. Teste numa amostra representativa das suas consultas reais (1 milhão de vectores é normalmente suficiente) e encontre o modelo de dimensão mais baixa que satisfaça a sua exigência de precisão. Muitas equipas descobrem que 768 dimensões funcionam tão bem como 1536 para o seu caso de utilização.</p>
<p><strong>Já está comprometido com um modelo de alta dimensão?</strong> É possível reduzir as dimensões após o facto. A PCA (Análise de Componentes Principais) pode eliminar caraterísticas redundantes, e <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">as incorporações Matryoshka</a> permitem-lhe truncar as primeiras N dimensões, mantendo a maior parte da qualidade. Vale a pena experimentar ambos antes de voltar a incorporar todo o seu conjunto de dados.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Gerir o ciclo de vida dos dados com compactação e TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Este é menos glamoroso, mas ainda é importante, especialmente para sistemas de produção de longa duração. O Milvus usa um modelo de armazenamento append-only: quando você exclui dados, eles são marcados como excluídos, mas não são removidos imediatamente. Com o tempo, esses dados mortos se acumulam, desperdiçam espaço de armazenamento e fazem com que as consultas examinem mais linhas do que o necessário.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Compactação: Recuperar o armazenamento de dados eliminados</h3><p>A compactação é o processo de fundo do Milvus para limpeza. Ele mescla pequenos segmentos, remove fisicamente dados excluídos e reescreve arquivos compactados. Você vai querer isso se:</p>
<ul>
<li>Tem escritas e eliminações frequentes (catálogos de produtos, actualizações de conteúdos, registos em tempo real)</li>
<li>Sua contagem de segmentos continua crescendo (isso aumenta a sobrecarga por consulta)</li>
<li>O uso do armazenamento está crescendo muito mais rápido do que seus dados válidos reais</li>
</ul>
<p><strong>Atenção:</strong> A compactação faz uso intensivo de E/S. Programe-a durante períodos de baixo tráfego (por exemplo, à noite) ou ajuste os acionadores cuidadosamente para que ela não concorra com as consultas de produção.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(Time to Live): Expirar automaticamente dados vetoriais antigos</h3><p>Para dados que expiram naturalmente, o TTL é mais limpo do que a exclusão manual. Defina um tempo de vida para seus dados, e Milvus automaticamente marca-os para exclusão quando expirarem. A compactação lida com a limpeza real.</p>
<p>Isso é útil para:</p>
<ul>
<li>Registos e dados de sessão - manter apenas os últimos 7 ou 30 dias</li>
<li>RAG sensíveis ao tempo - preferir conhecimento recente, deixar documentos antigos expirarem</li>
<li>Recomendações em tempo real - obter apenas informações sobre o comportamento recente do utilizador</li>
</ul>
<p>Em conjunto, a compactação e o TTL evitam que o seu sistema acumule resíduos silenciosamente. Não é a maior alavanca de custos, mas evita o tipo de aumento lento do armazenamento que apanha as equipas desprevenidas.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Mais uma opção: Zilliz Cloud (Milvus totalmente gerido)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Divulgação completa: <a href="https://zilliz.com/">o Zilliz Cloud</a> foi criado pela mesma equipa por detrás do Milvus, por isso, considere isto com o devido grau de sal.</p>
<p>Dito isso, aqui está a parte contra-intuitiva: embora o Milvus seja gratuito e de código aberto, um serviço gerenciado pode realmente custar menos do que a auto-hospedagem. A razão é simples - o software é gratuito, mas a infraestrutura de nuvem para o executar não é, e são necessários engenheiros para a operar e manter. Se um serviço gerido puder fazer o mesmo trabalho com menos máquinas e menos horas de engenharia, a sua fatura total diminui mesmo depois de pagar pelo próprio serviço.</p>
<p><a href="https://zilliz.com/">O Zilliz Cloud</a> é um serviço totalmente gerido, construído com base no Milvus e compatível com a sua API. Duas coisas são relevantes para o custo:</p>
<ul>
<li><strong>Melhor desempenho por nó.</strong> O Zilliz Cloud é executado no Cardinal, o nosso motor de pesquisa optimizado. Com base nos <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">resultados do VectorDBBench</a>, oferece um rendimento 3-5 vezes superior ao Milvus de código aberto e é 10 vezes mais rápido. Na prática, isso significa que precisa de cerca de um terço a um quinto dos nós de computação para a mesma carga de trabalho.</li>
<li><strong>Optimizações incorporadas.</strong> Os recursos abordados neste guia - MMap, armazenamento em camadas e quantização de índices - são incorporados e ajustados automaticamente. O escalonamento automático ajusta a capacidade com base na carga real, para que você não pague por espaço livre que não precisa.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">A migração</a> é simples, uma vez que as APIs e os formatos de dados são compatíveis. O Zilliz também fornece ferramentas de migração para ajudar. Para uma comparação detalhada, consulte: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Resumo: um plano passo a passo para reduzir os custos do banco de dados de vetores<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Se você fizer apenas uma coisa, faça o seguinte: verifique o tipo de índice.</strong></p>
<p>Se estiver executando o HNSW em uma carga de trabalho sensível ao custo, mude para IVF_SQ8. Isso, por si só, pode reduzir o custo de memória em ~70% com perda mínima de memória.</p>
<p>Se quiser ir mais longe, aqui está a ordem de prioridade:</p>
<ul>
<li>Troque<strong>seu índice</strong> - HNSW → IVF_SQ8 para a maioria das cargas de trabalho. Maior impacto para zero mudança de arquitetura.</li>
<li><strong>Ativar MMap ou armazenamento em camadas</strong> - Pare de manter tudo na memória. Trata-se de uma alteração de configuração, não de uma reformulação.</li>
<li><strong>Avalie suas dimensões de incorporação</strong> - Teste se um modelo menor atende às suas necessidades de precisão. Isto requer uma nova incorporação, mas as poupanças são maiores.</li>
<li>Configure<strong>a compactação e o TTL</strong> - Evite o inchaço silencioso dos dados, especialmente se tiver gravações/eliminações frequentes.</li>
</ul>
<p>Combinadas, estas estratégias podem reduzir a fatura da sua base de dados vetorial em 60-80%. Nem todas as equipas precisam de todas as quatro - comece com a alteração do índice, meça o impacto e vá descendo na lista.</p>
<p>Para as equipas que procuram reduzir o trabalho operacional e melhorar a eficiência dos custos, <a href="https://zilliz.com/">o Zilliz Cloud</a> (Milvus gerido) é outra opção.</p>
<p>Se estiver a trabalhar em qualquer uma destas optimizações e quiser comparar notas, o <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack da comunidade Milvus</a> é um bom local para colocar questões. Também pode juntar-se ao <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para uma conversa rápida com a equipa de engenharia sobre a sua configuração específica.</p>
