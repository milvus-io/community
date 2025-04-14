---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Apresentando a ferramenta de dimensionamento do Milvus: Calculando e
  otimizando seus recursos de implantação do Milvus
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Maximize o desempenho do seu Milvus com a nossa ferramenta de dimensionamento
  de fácil utilização! Saiba como configurar a sua implementação para uma
  utilização optimizada dos recursos e poupança de custos.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Selecionar a configuração ideal para a sua implementação do Milvus é fundamental para a otimização do desempenho, a utilização eficiente dos recursos e a gestão dos custos. Quer esteja a construir um protótipo ou a planear uma implementação de produção, dimensionar corretamente a sua instância Milvus pode significar a diferença entre uma base de dados vetorial a funcionar sem problemas e uma que se debate com o desempenho ou incorre em custos desnecessários.</p>
<p>Para simplificar este processo, renovámos a nossa <a href="https://milvus.io/tools/sizing">ferramenta de dimensionamento do Milvus</a>, uma calculadora de fácil utilização que gera estimativas de recursos recomendadas com base nos seus requisitos específicos. Neste guia, vamos orientá-lo na utilização da ferramenta e fornecer informações mais aprofundadas sobre os factores que influenciam o desempenho do Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Como usar a ferramenta de dimensionamento do Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>É muito fácil usar esta ferramenta de dimensionamento. Basta seguir os seguintes passos.</p>
<ol>
<li><p>Visite a página do<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a>.</p></li>
<li><p>Introduza os seus parâmetros chave:</p>
<ul>
<li><p>Número de vectores e dimensões por vetor</p></li>
<li><p>Tipo de índice</p></li>
<li><p>Tamanho dos dados do campo escalar</p></li>
<li><p>Tamanho do segmento</p></li>
<li><p>O seu modo de implementação preferido</p></li>
</ul></li>
<li><p>Reveja as recomendações de recursos geradas</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>ferramenta de dimensionamento do milvus</span> </span></p>
<p>Vamos explorar como cada um desses parâmetros afeta sua implantação do Milvus.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Seleção de índices: Equilíbrio entre armazenamento, custo, precisão e velocidade<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus oferece vários algoritmos de índice, incluindo <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> e outros, cada um com compensações distintas no uso de memória, requisitos de espaço em disco, velocidade de consulta e precisão de pesquisa.</p>
<p>Aqui está o que você precisa saber sobre as opções mais comuns:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>índice</span> </span></p>
<p>HNSW (Hierarchical Navigable Small World)</p>
<ul>
<li><p><strong>Arquitetura</strong>: Combina listas de saltos com gráficos Navigable Small Worlds (NSWs) em uma estrutura hierárquica</p></li>
<li><p><strong>Desempenho</strong>: Consulta muito rápida com excelentes taxas de recuperação</p></li>
<li><p><strong>Utilização de recursos</strong>: Requer a maior quantidade de memória por vetor (custo mais alto)</p></li>
<li><p><strong>Ideal para</strong>: Aplicações em que a velocidade e a precisão são críticas e as restrições de memória são menos preocupantes</p></li>
<li><p><strong>Nota técnica</strong>: A pesquisa começa na camada mais alta, com o menor número de nós, e percorre as camadas cada vez mais densas</p></li>
</ul>
<p>FLAT</p>
<ul>
<li><p><strong>Arquitetura</strong>: Pesquisa exaustiva simples sem aproximação</p></li>
<li><p><strong>Desempenho</strong>: 100% de recuperação, mas tempos de consulta extremamente lentos (<code translate="no">O(n)</code> para tamanho de dados <code translate="no">n</code>)</p></li>
<li><p><strong>Utilização de recursos</strong>: O tamanho do índice é igual ao tamanho dos dados vectoriais em bruto</p></li>
<li><p><strong>Ideal para</strong>: Pequenos conjuntos de dados ou aplicações que requerem uma recuperação perfeita</p></li>
<li><p><strong>Nota técnica</strong>: Efectua cálculos de distância completos entre o vetor de consulta e todos os vectores da base de dados</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Arquitetura</strong>: Divide o espaço vetorial em clusters para uma pesquisa mais eficiente</p></li>
<li><p><strong>Desempenho</strong>: Recuperação média-alta com velocidade de consulta moderada (mais lenta que HNSW, mas mais rápida que FLAT)</p></li>
<li><p><strong>Utilização de recursos</strong>: Requer menos memória que o FLAT, mas mais que o HNSW</p></li>
<li><p><strong>Ideal para</strong>: Aplicações equilibradas em que alguma recuperação pode ser trocada por um melhor desempenho</p></li>
<li><p><strong>Nota técnica</strong>: Durante a pesquisa, apenas os clusters <code translate="no">nlist</code> são examinados, reduzindo significativamente a computação</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Arquitetura</strong>: Aplica a quantização escalar ao IVF_FLAT, comprimindo dados vectoriais</p></li>
<li><p><strong>Desempenho</strong>: Recuperação média com velocidade de consulta média-alta</p></li>
<li><p><strong>Utilização de recursos</strong>: Reduz o consumo de disco, computação e memória em 70-75% em comparação com o IVF_FLAT</p></li>
<li><p><strong>Ideal para</strong>: Ambientes com recursos limitados onde a precisão pode ser ligeiramente comprometida</p></li>
<li><p><strong>Nota técnica</strong>: comprime valores de ponto flutuante de 32 bits para valores inteiros de 8 bits</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Opções avançadas de índice: ScaNN, DiskANN, CAGRA e mais</h3><p>Para desenvolvedores com requisitos especializados, Milvus também oferece:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% mais rápido na CPU do que o HNSW com taxas de recuperação semelhantes</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: Um índice híbrido de disco/memória que é ideal quando é necessário suportar um grande número de vectores com elevada recuperação e pode aceitar uma latência ligeiramente mais longa (~100ms). Ele equilibra o uso da memória com o desempenho, mantendo apenas parte do índice na memória, enquanto o restante permanece no disco.</p></li>
<li><p><strong>Índices baseados em GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: Este é o mais rápido dos índices de GPU, mas requer uma placa de inferência com memória GDDR em vez de uma com memória HBM</p></li>
<li><p>GPU_BRUTE_FORCE: Pesquisa exaustiva implementada na GPU</p></li>
<li><p>GPU_IVF_FLAT: Versão acelerada por GPU do IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: Versão acelerada por GPU do IVF com <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">Quantização de Produto</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: Consulta a muito alta velocidade, recursos de memória limitados; aceita um pequeno compromisso na taxa de recuperação.</p></li>
<li><p><strong>HNSW_PQ</strong>: Consulta de velocidade média; recursos de memória muito limitados; aceita um pequeno compromisso na taxa de recuperação</p></li>
<li><p><strong>HNSW_PRQ</strong>: Consulta de velocidade média; recursos de memória muito limitados; aceita um compromisso menor na taxa de recuperação</p></li>
<li><p><strong>AUTOINDEX</strong>: O padrão é HNSW no Milvus de código aberto (ou usa índices proprietários de melhor desempenho no <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, o Milvus gerenciado).</p></li>
</ul></li>
<li><p><strong>Índices binários, esparsos e outros índices especializados</strong>: Para tipos de dados e casos de uso específicos. Consulte <a href="https://milvus.io/docs/index.md">esta página de documentação sobre índices</a> para obter mais detalhes.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Tamanho do segmento e configuração de implantação<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Segmentos são os blocos de construção fundamentais da organização interna de dados do Milvus. Eles funcionam como pedaços de dados que permitem a pesquisa distribuída e o balanceamento de carga em toda a sua implantação. Esta ferramenta de dimensionamento do Milvus oferece três opções de tamanho de segmento (512 MB, 1024 MB, 2048 MB), com 1024 MB como padrão.</p>
<p>A compreensão dos segmentos é crucial para a otimização do desempenho. Como orientação geral:</p>
<ul>
<li><p>Segmentos de 512 MB: Melhor para nós de consulta com 4-8 GB de memória</p></li>
<li><p>Segmentos de 1 GB: Ideal para nós de consulta com 8-16 GB de memória</p></li>
<li><p>Segmentos de 2 GB: Recomendado para nós de consulta com mais de 16 GB de memória</p></li>
</ul>
<p>Insight do desenvolvedor: Menos segmentos maiores geralmente oferecem desempenho de pesquisa mais rápido. Para implantações em larga escala, segmentos de 2 GB geralmente fornecem o melhor equilíbrio entre eficiência de memória e velocidade de consulta.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Seleção do sistema de fila de mensagens<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao escolher entre Pulsar e Kafka como seu sistema de mensagens:</p>
<ul>
<li><p><strong>Pulsar</strong>: Recomendado para novos projetos devido à menor sobrecarga por tópico e melhor escalabilidade</p></li>
<li><p><strong>Kafka</strong>: Pode ser preferível se já tiver experiência ou infraestrutura Kafka na sua organização</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Optimizações empresariais no Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Para implementações de produção com requisitos de desempenho rigorosos, o Zilliz Cloud (a versão empresarial e totalmente gerida do Milvus na nuvem) oferece optimizações adicionais na indexação e quantização:</p>
<ul>
<li><p><strong>Prevenção de memória esgotada (OOM):</strong> Gestão sofisticada da memória para evitar falhas fora da memória</p></li>
<li><p><strong>Otimização da compactação</strong>: Melhora o desempenho da pesquisa e a utilização de recursos</p></li>
<li><p><strong>Armazenamento em camadas</strong>: Gerir eficazmente os dados quentes e frios com unidades de computação adequadas</p>
<ul>
<li><p>Unidades de computação padrão (CUs) para dados frequentemente acedidos</p></li>
<li><p>CUs de armazenamento em camadas para um armazenamento económico de dados raramente acedidos</p></li>
</ul></li>
</ul>
<p>Para opções detalhadas de dimensionamento empresarial, visite a<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> documentação dos planos de serviço do Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Dicas de configuração avançada para desenvolvedores<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
<li><p><strong>Vários tipos de índice</strong>: A ferramenta de dimensionamento concentra-se em um único índice. Para aplicações complexas que requerem algoritmos de índice diferentes para várias colecções, crie colecções separadas com configurações personalizadas.</p></li>
<li><p><strong>Alocação de memória</strong>: Ao planear a sua implementação, tenha em conta os dados vectoriais e os requisitos de memória do índice. O HNSW normalmente requer de 2 a 3 vezes a memória dos dados vetoriais brutos.</p></li>
<li><p><strong>Teste de desempenho</strong>: Antes de finalizar a configuração, compare seus padrões de consulta específicos em um conjunto de dados representativo.</p></li>
<li><p><strong>Considerações sobre escala</strong>: Leve em conta o crescimento futuro. É mais fácil começar com um pouco mais de recursos do que reconfigurar mais tarde.</p></li>
</ol>
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
    </button></h2><p>A<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a> fornece um excelente ponto de partida para o planeamento de recursos, mas lembre-se que cada aplicação tem requisitos únicos. Para obter o melhor desempenho, é necessário ajustar a configuração com base nas caraterísticas específicas da carga de trabalho, nos padrões de consulta e nas necessidades de escalonamento.</p>
<p>Estamos continuamente a melhorar as nossas ferramentas e documentação com base no feedback dos utilizadores. Se tiver dúvidas ou precisar de mais assistência para dimensionar a sua implementação Milvus, contacte a nossa comunidade no<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> ou no<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
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
    </button></h2><ul>
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Escolhendo o índice vetorial certo para o seu projeto</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Índice na memória | Documentação do Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Revelar Milvus CAGRA: Elevando a pesquisa vetorial com indexação de GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Calculadora de preços do Zilliz Cloud</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Como começar a usar o Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud Resource Planning | Nuvem | Zilliz Cloud Developer Hub</a></p></li>
</ul>
