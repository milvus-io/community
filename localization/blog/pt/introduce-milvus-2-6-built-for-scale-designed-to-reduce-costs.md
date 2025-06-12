---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 'Apresentamos o Milvus 2.6: Pesquisa Vetorial Acessível à Escala de Mil Milhões'
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Temos o prazer de anunciar que o Milvus 2.6 já está disponível. Esta versão
  apresenta dezenas de funcionalidades que abordam diretamente os desafios mais
  prementes da pesquisa vetorial atual - escalar de forma eficiente e manter os
  custos sob controlo.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>À medida que a pesquisa baseada em IA evoluiu de projectos experimentais para infra-estruturas de missão crítica, as exigências das <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de dados vectoriais</a> intensificaram-se. As organizações precisam de lidar com milhares de milhões de vectores enquanto gerem os custos de infraestrutura, suportam a ingestão de dados em tempo real e fornecem uma recuperação sofisticada para além da <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa</a> básica <a href="https://zilliz.com/learn/vector-similarity-search">por semelhança</a>. Para enfrentar estes desafios em evolução, temos estado a trabalhar arduamente no desenvolvimento e aperfeiçoamento do Milvus. A resposta da comunidade tem sido incrivelmente encorajadora, com comentários valiosos que ajudam a moldar a nossa direção.</p>
<p>Após meses de desenvolvimento intensivo, temos o prazer de anunciar que <strong>o Milvus 2.6 já está disponível</strong>. Esta versão aborda diretamente os desafios mais prementes da pesquisa vetorial atual: <strong><em>escalar de forma eficiente e manter os custos sob controlo.</em></strong></p>
<p>O Milvus 2.6 oferece inovações revolucionárias em três áreas críticas: <strong>redução de custos, capacidades de pesquisa avançadas e melhorias na arquitetura para uma escala massiva</strong>. Os resultados falam por si:</p>
<ul>
<li><p><strong>72% de redução de memória</strong> com a quantização de 1 bit RaBitQ e consultas 4x mais rápidas</p></li>
<li><p><strong>50% de economia de custos</strong> por meio de armazenamento inteligente em camadas</p></li>
<li><p><strong>Pesquisa de texto completo 4x mais rápida</strong> do que o Elasticsearch com nossa implementação aprimorada do BM25</p></li>
<li><p>Filtragem JSON<strong>100x mais rápida</strong> com o recém-introduzido Path Index</p></li>
<li><p><strong>A atualização da pesquisa é conseguida de forma económica</strong> com a nova arquitetura de disco zero</p></li>
<li><p><strong>Fluxo de trabalho de incorporação simplificado</strong> com a nova experiência "data in and data out".</p></li>
<li><p><strong>Até 100K colecções num único cluster</strong> para multi-tenancy à prova de futuro</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Inovações para redução de custos: Tornar a pesquisa vetorial acessível<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>O consumo de memória representa um dos maiores desafios ao escalar a pesquisa vetorial para milhares de milhões de registos. O Milvus 2.6 introduz várias optimizações chave que reduzem significativamente os custos da sua infraestrutura ao mesmo tempo que melhoram o desempenho.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">Quantização de 1 bit RaBitQ: 72% de redução de memória com 4× de desempenho</h3><p>Os métodos tradicionais de quantização obrigam-no a trocar a qualidade da pesquisa pela poupança de memória. O Milvus 2.6 muda isso com a <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantização de 1 bit RaBitQ</a> combinada com um mecanismo de refinamento inteligente.</p>
<p>O novo índice IVF_RABITQ comprime o índice principal para 1/32 do seu tamanho original através da quantização de 1 bit. Quando utilizado em conjunto com um refinamento SQ8 opcional, esta abordagem mantém uma elevada qualidade de pesquisa (95% de recordação) utilizando apenas 1/4 do espaço de memória original.</p>
<p>Os nossos benchmarks preliminares revelam resultados prometedores:</p>
<table>
<thead>
<tr><th><strong>Métrica de desempenho</strong></th><th><strong>Tradicional IVF_FLAT</strong></th><th><strong>Apenas RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1-bit) + SQ8 Refinar</strong></th></tr>
</thead>
<tbody>
<tr><td>Pegada de memória</td><td>100% (linha de base)</td><td>3% (redução de 97%)</td><td>28% (72% de redução)</td></tr>
<tr><td>Recuperação</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Rendimento da pesquisa (QPS)</td><td>236</td><td>648 (2,7× mais rápido)</td><td>946 (4× mais rápido)</td></tr>
</tbody>
</table>
<p><em>Tabela: Avaliação do VectorDBBench com 1M de vectores de 768 dimensões, testado em AWS m6id.2xlarge</em></p>
<p>O verdadeiro avanço aqui não é apenas a redução de 72% na memória, mas conseguir isso ao mesmo tempo em que oferece uma melhoria de 4× na taxa de transferência. Isto significa que pode servir a mesma carga de trabalho com menos 75% de servidores ou lidar com 4× mais tráfego na sua infraestrutura existente, tudo isto sem sacrificar a recordação.</p>
<p>Para os utilizadores empresariais que utilizam o Milvus totalmente gerido no<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, estamos a desenvolver uma estratégia automatizada que ajusta dinamicamente os parâmetros do RaBitQ com base nas caraterísticas específicas da sua carga de trabalho e nos requisitos de precisão. O cliente simplesmente desfrutará de uma melhor relação custo-benefício em todos os tipos de UCs do Zilliz Cloud.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Armazenamento em camadas quente-frio: 50% de redução de custos por meio da colocação inteligente de dados</h3><p>As cargas de trabalho de pesquisa vetorial do mundo real contêm dados com padrões de acesso muito diferentes. Os dados acedidos frequentemente necessitam de disponibilidade imediata, enquanto os dados de arquivo podem tolerar uma latência ligeiramente superior em troca de custos de armazenamento drasticamente inferiores.</p>
<p>O Milvus 2.6 apresenta uma arquitetura de armazenamento em camadas que classifica automaticamente os dados com base nos padrões de acesso e os coloca em camadas de armazenamento apropriadas:</p>
<ul>
<li><p><strong>Classificação inteligente de dados</strong>: O Milvus identifica automaticamente segmentos de dados quentes (frequentemente acedidos) e frios (raramente acedidos) com base nos padrões de acesso</p></li>
<li><p><strong>Colocação optimizada do armazenamento</strong>: Os dados quentes permanecem na memória/SSD de alto desempenho, enquanto os dados frios são movidos para um armazenamento de objectos mais económico</p></li>
<li><p><strong>Movimentação dinâmica de dados</strong>: À medida que os padrões de utilização mudam, os dados migram automaticamente entre camadas</p></li>
<li><p><strong>Recuperação transparente</strong>: Quando as consultas tocam nos dados frios, estes são automaticamente carregados a pedido</p></li>
</ul>
<p>O resultado é uma redução de até 50% nos custos de armazenamento, mantendo o desempenho das consultas para os dados activos.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Optimizações de custos adicionais</h3><p>O Milvus 2.6 também introduz o suporte de vetor Int8 para índices HNSW, o formato Storage v2 para uma estrutura optimizada que reduz os requisitos de IOPS e de memória, e uma instalação mais fácil diretamente através dos gestores de pacotes APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Capacidades de pesquisa avançadas: Para além da semelhança vetorial básica<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa vetorial por si só não é suficiente para as aplicações modernas de IA. Os utilizadores exigem a precisão da recuperação de informação tradicional combinada com a compreensão semântica dos embeddings vectoriais. O Milvus 2.6 apresenta um conjunto de recursos avançados de pesquisa que preenchem essa lacuna.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">BM25 turbinado: pesquisa de texto completo 400% mais rápida do que o Elasticsearch</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">A pesquisa de texto completo</a> tornou-se essencial para a construção de sistemas de recuperação híbridos em bases de dados vectoriais. No Milvus 2.6, foram feitas melhorias significativas no desempenho da pesquisa de texto completo, com base na implementação do BM25 introduzida desde a versão 2.5. Por exemplo, esta versão introduz novos parâmetros como <code translate="no">drop_ratio_search</code> e <code translate="no">dim_max_score_ratio</code>, melhorando a precisão e a velocidade de afinação e oferecendo controlos de pesquisa mais precisos.</p>
<p>Os nossos testes de referência com o conjunto de dados BEIR padrão da indústria mostram que o Milvus 2.6 alcança um rendimento 3-4× superior ao Elasticsearch com taxas de recuperação equivalentes. Para cargas de trabalho específicas, a melhoria atinge QPS 7 vezes maior.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">Índice de caminho JSON: Filtragem 100x mais rápida</h3><p>O Milvus suporta o tipo de dados JSON há muito tempo, mas a filtragem em campos JSON era lenta devido à falta de suporte de índice. Milvus 2.6 adiciona suporte para índice de caminho JSON para aumentar o desempenho significativamente.</p>
<p>Considere uma base de dados de perfis de utilizadores em que cada registo contém metadados aninhados como:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Para uma pesquisa semântica "utilizadores interessados em IA" com âmbito apenas em São Francisco, o Milvus costumava analisar e avaliar todo o objeto JSON para cada registo, tornando a consulta muito dispendiosa e lenta.</p>
<p>Agora, o Milvus permite-lhe criar índices em caminhos específicos dentro dos campos JSON para acelerar a pesquisa:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>Nos nossos testes de desempenho com mais de 100 milhões de registos, o JSON Path Index reduziu a latência do filtro de <strong>140 ms</strong> (P99: 480 ms) para apenas <strong>1,5 ms</strong> (P99: 10 ms) - uma redução de 99% na latência que torna estas pesquisas práticas na produção.</p>
<p>Esse recurso é particularmente valioso para:</p>
<ul>
<li><p>Sistemas de recomendação com filtragem complexa de atributos do utilizador</p></li>
<li><p>Aplicações RAG que filtram documentos por metadados</p></li>
<li><p>Sistemas multi-tenant onde a segmentação de dados é crítica</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Processamento de texto melhorado e pesquisa com noção de tempo</h3><p>O Milvus 2.6 apresenta um pipeline de análise de texto completamente renovado com tratamento sofisticado de idiomas, incluindo o tokenizador Lindera para japonês e coreano, o tokenizador ICU para suporte multilíngue abrangente e Jieba aprimorado com integração de dicionário personalizado.</p>
<p><strong>A Phrase Match Intelligence</strong> capta as nuances semânticas na ordem das palavras, distinguindo entre &quot;técnicas de aprendizagem automática&quot; e &quot;técnicas de aprendizagem automática&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>As funções de decaimento sensíveis ao tempo</strong> dão automaticamente prioridade a conteúdos novos, ajustando as pontuações de relevância com base na idade do documento, com taxas de decaimento e tipos de função configuráveis (exponencial, gaussiana ou linear).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Pesquisa simplificada: Experiência de entrada de dados e saída de dados</h3><p>A desconexão entre os dados brutos e os embeddings vetoriais é outro ponto problemático para os desenvolvedores que usam bancos de dados vetoriais. Antes de os dados chegarem ao Milvus para indexação e pesquisa vetorial, passam frequentemente por um pré-processamento utilizando modelos externos que convertem texto em bruto, imagens ou áudio em representações vectoriais. Após a recuperação, também é necessário um processamento adicional a jusante, como o mapeamento de IDs de resultados de volta ao conteúdo original.</p>
<p>O Milvus 2.6 simplifica estes fluxos de trabalho de incorporação com a nova interface <strong>Function</strong> que integra modelos de incorporação de terceiros diretamente no seu pipeline de pesquisa. Em vez de calcular previamente os embeddings, agora é possível:</p>
<ol>
<li><p><strong>Inserir dados brutos diretamente</strong>: Enviar texto, imagens ou outros conteúdos para o Milvus</p></li>
<li><p><strong>Configurar fornecedores de incorporação</strong>: Conectar-se a serviços de API de incorporação da OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face e muito mais.</p></li>
<li><p><strong>Consultas em linguagem natural</strong>: Pesquise utilizando diretamente consultas de texto em bruto</p></li>
</ol>
<p>Isto cria uma experiência "Data-In, Data-Out" em que o Milvus simplifica todas as transformações vectoriais nos bastidores para si.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Evolução da arquitetura: Escalonamento para dezenas de bilhões de vetores<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 introduz inovações arquitectónicas fundamentais que permitem um escalonamento económico para dezenas de milhares de milhões de vectores.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Substituindo Kafka e Pulsar por um novo Woodpecker WAL</h3><p>Implantações anteriores do Milvus dependiam de filas de mensagens externas, como Kafka ou Pulsar, como o sistema Write-Ahead Log (WAL). Embora esses sistemas inicialmente funcionassem bem, eles introduziram uma complexidade operacional significativa e sobrecarga de recursos.</p>
<p>O Milvus 2.6 apresenta <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>o Woodpecker</strong></a>, um sistema WAL nativo da nuvem criado especificamente para esse fim que elimina essas dependências externas por meio de um design revolucionário de disco zero:</p>
<ul>
<li><p><strong>Tudo no armazenamento de objetos</strong>: Todos os dados de log são mantidos em armazenamento de objetos como S3, Google Cloud Storage ou MinIO</p></li>
<li><p><strong>Metadados distribuídos</strong>: Os metadados ainda são gerenciados pelo armazenamento de valores-chave do etcd</p></li>
<li><p><strong>Sem dependências de disco local</strong>: Uma escolha para eliminar a arquitetura complexa e a sobrecarga operacional envolvida no estado permanente local distribuído.</p></li>
</ul>
<p>Executamos benchmarks abrangentes comparando o desempenho do Woodpecker:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Taxa de transferência</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latência</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>O Woodpecker atinge consistentemente de 60 a 80% da taxa de transferência máxima teórica para cada back-end de armazenamento, com o modo de sistema de arquivos local atingindo 450 MB/s - 3,5 vezes mais rápido que o Kafka - e o modo S3 atingindo 750 MB/s, 5,8 vezes mais alto que o Kafka.</p>
<p>Para obter mais detalhes sobre o Woodpecker, consulte este blogue: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Frescura da pesquisa alcançada de forma económica</h3><p>A pesquisa de missão crítica geralmente requer que os dados recém-ingressados sejam pesquisáveis instantaneamente. O Milvus 2.6 substitui a dependência de filas de mensagens para melhorar fundamentalmente o tratamento de actualizações recentes e proporcionar a atualização da pesquisa com uma menor sobrecarga de recursos. A nova arquitetura acrescenta o novo <strong>Streaming Node</strong>, um componente dedicado que trabalha em estreita coordenação com outros componentes do Milvus, como o Query Node e o Data Node. O Streaming Node é construído sobre o Woodpecker, nosso sistema de Write-Ahead Log (WAL) leve e nativo da nuvem.</p>
<p>Este novo componente permite:</p>
<ul>
<li><p><strong>Grande compatibilidade</strong>: Funciona com o novo WAL do Woodpecker e é compatível com versões anteriores do Kafka, do Pulsar e de outras plataformas de streaming</p></li>
<li><p><strong>Indexação incremental</strong>: Novos dados tornam-se pesquisáveis imediatamente, sem atrasos de lote</p></li>
<li><p><strong>Serviço de consulta contínuo</strong>: Ingestão simultânea de alta taxa de transferência e consulta de baixa latência</p></li>
</ul>
<p>Ao isolar o streaming do processamento em lote, o Streaming Node ajuda o Milvus a manter um desempenho estável e a frescura da pesquisa, mesmo durante a ingestão de grandes volumes de dados. Ele foi projetado com a escalabilidade horizontal em mente, dimensionando dinamicamente a capacidade do nó com base na taxa de transferência de dados.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Capacidade aprimorada de multilocação: Dimensionamento para 100 mil colecções por cluster</h3><p>As implantações corporativas geralmente exigem isolamento em nível de locatário. O Milvus 2.6 aumenta drasticamente o suporte multi-tenancy, permitindo até <strong>100.000 coleções</strong> por cluster. Esta é uma melhoria crucial para as organizações que executam um grande cluster monolítico que serve muitos inquilinos.</p>
<p>Esta melhoria é possível graças a numerosas optimizações de engenharia na gestão de metadados, atribuição de recursos e planeamento de consultas. Os utilizadores do Milvus podem agora desfrutar de um desempenho estável mesmo com dezenas de milhares de colecções.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Outras melhorias</h3><p>O Milvus 2.6 oferece mais melhorias na arquitetura, tais como CDC + BulkInsert para uma replicação de dados simplificada entre regiões geográficas e Coord Merge para uma melhor coordenação de clusters em implementações de grande escala.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Primeiros passos com o Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 representa um enorme esforço de engenharia com dezenas de novas funcionalidades e optimizações de desempenho, desenvolvidas em colaboração pelos engenheiros da Zilliz e pelos fantásticos colaboradores da nossa comunidade. Embora tenhamos abordado as principais funcionalidades aqui, há mais para descobrir. Recomendamos vivamente que mergulhe nas nossas <a href="https://milvus.io/docs/release_notes.md">notas de lançamento</a> abrangentes para explorar tudo o que esta versão tem para oferecer!</p>
<p>Documentação completa, guias de migração e tutoriais estão disponíveis no<a href="https://milvus.io/"> site da Milvus</a>. Para questões e apoio da comunidade, junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
