---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  Desbloquear o desempenho 8× Milvus com o Cloudian HyperStore e o NVIDIA RDMA
  para armazenamento S3
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  A Cloudian e a NVIDIA apresentam o RDMA para armazenamento compatível com S3,
  acelerando as cargas de trabalho de IA com baixa latência e permitindo um
  aumento de desempenho de 8 vezes no Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Este post foi publicado originalmente na <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> e é republicado aqui com permissão.</em></p>
<p>A Cloudian colaborou com a NVIDIA para adicionar suporte para RDMA para armazenamento compatível com S3 à sua solução HyperStore®, com base nos seus mais de 13 anos de experiência na implementação da API S3. Como plataforma baseada em S3-API com arquitetura de processamento paralelo, a Cloudian é a única adequada para contribuir e capitalizar o desenvolvimento desta tecnologia. Esta colaboração aproveita a profunda experiência da Cloudian em protocolos de armazenamento de objectos e a liderança da NVIDIA em computação e aceleração de rede para criar uma solução que integra perfeitamente a computação de elevado desempenho com o armazenamento à escala empresarial.</p>
<p>A NVIDIA anunciou a próxima disponibilidade geral da tecnologia de armazenamento compatível com RDMA para S3 (Remote Diret Memory Access), assinalando um marco significativo na evolução da infraestrutura de IA. Essa tecnologia inovadora promete transformar a forma como as organizações lidam com os requisitos de dados massivos das cargas de trabalho de AI modernas, oferecendo melhorias de desempenho sem precedentes, mantendo a escalabilidade e a simplicidade que tornaram o armazenamento de objetos compatível com S3 a base da computação em cloud.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">O que é RDMA para armazenamento compatível com S3?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Este lançamento representa um avanço fundamental na forma como os sistemas de armazenamento comunicam com os aceleradores de IA. A tecnologia permite transferências diretas de dados entre o armazenamento de objetos compatível com a API do S3 e a memória da GPU, ignorando completamente os caminhos de dados tradicionais mediados pela CPU. Ao contrário das arquiteturas de armazenamento convencionais que encaminham todas as transferências de dados através da CPU e da memória do sistema - criando gargalos e latência - o RDMA para armazenamento compatível com S3 estabelece uma estrada direta do armazenamento para a GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em sua essência, essa tecnologia elimina etapas intermediárias com um caminho direto que reduz a latência, diminui drasticamente as demandas de processamento da CPU e reduz significativamente o consumo de energia. O resultado são sistemas de armazenamento que podem fornecer dados na velocidade que as GPUs modernas exigem para aplicativos de IA exigentes.</p>
<p>A tecnologia mantém a compatibilidade com as onipresentes APIs do S3 enquanto adiciona esse caminho de dados de alto desempenho. Os comandos ainda são emitidos por meio de protocolos de armazenamento padrão baseados em S3-API, mas a transferência real de dados ocorre via RDMA diretamente para a memória da GPU, ignorando totalmente a CPU e eliminando a sobrecarga do processamento do protocolo TCP.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Resultados de desempenho revolucionários<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>As melhorias de desempenho fornecidas pelo RDMA para armazenamento compatível com S3 são nada menos que transformacionais. Testes no mundo real demonstram a capacidade da tecnologia de eliminar gargalos de E/S de storage que restringem as cargas de trabalho de IA.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Melhorias drásticas na velocidade:</h3><ul>
<li><p><strong>35 GB/s de taxa de transferência por nó</strong> (leituras) medida, com escalabilidade linear entre clusters</p></li>
<li><p><strong>Escalabilidade para TBs/s</strong> com a arquitetura de processamento paralelo do Cloudian</p></li>
<li><p><strong>Melhoria de 3-5x na taxa de transferência</strong> em comparação com o armazenamento de objetos convencional baseado em TCP</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Ganhos de eficiência de recursos:</h3><ul>
<li><p><strong>Redução de 90% na utilização da CPU</strong> ao estabelecer caminhos de dados diretos para GPUs</p></li>
<li><p><strong>Aumento da utilização da GPU</strong> com a eliminação de gargalos</p></li>
<li><p>Redução drástica no consumo de energia através da redução da sobrecarga de processamento</p></li>
<li><p>Reduções de custos para armazenamento de IA</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Aumento de 8X no desempenho do Milvus by Zilliz Vetor DB</h3><p>Essas melhorias de desempenho são particularmente evidentes nas operações de banco de dados vetorial, onde a colaboração entre Cloudian e Zilliz usando <a href="https://www.nvidia.com/en-us/data-center/l40s/">as GPUs</a> <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> e <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S</a> demonstrou um <strong>aumento de 8x no desempenho das operações Milvus</strong> quando comparadas com sistemas baseados em CPU e transferência de dados baseada em TCP. Isso representa uma mudança fundamental do armazenamento como uma restrição para o armazenamento que permite que os aplicativos de AI atinjam todo o seu potencial.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Por que o armazenamento de objetos baseado em API S3 para cargas de trabalho de IA<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>A convergência da tecnologia RDMA com a arquitetura de armazenamento de objetos cria a base ideal para a infraestrutura de IA, abordando vários desafios que restringiram as abordagens de armazenamento tradicionais.</p>
<p><strong>Escalabilidade de exabytes para a explosão de dados da IA:</strong> As cargas de trabalho de IA, particularmente aquelas que envolvem dados sintéticos e multimodais, estão levando os requisitos de armazenamento para a faixa de 100 petabytes e além. O espaço de endereçamento plano do armazenamento de objetos escala perfeitamente de petabytes a exabytes, acomodando o crescimento exponencial em conjuntos de dados de treinamento de IA sem as limitações hierárquicas que restringem os sistemas baseados em arquivos.</p>
<p><strong>Plataforma unificada para fluxos de trabalho completos de IA:</strong> As operações modernas de IA abrangem a ingestão, a limpeza, o treinamento, o checkpointing e a inferência de dados - cada um com requisitos distintos de desempenho e capacidade. O armazenamento de objetos compatível com o S3 suporta todo esse espetro por meio do acesso consistente à API, eliminando a complexidade e o custo de gerenciar várias camadas de armazenamento. Dados de treinamento, modelos, arquivos de ponto de verificação e conjuntos de dados de inferência podem residir em um único data lake de alto desempenho.</p>
<p><strong>Metadados avançados para operações de IA:</strong> Operações críticas de IA, como pesquisa e enumeração, são fundamentalmente orientadas por metadados. Os recursos de metadados avançados e personalizáveis do armazenamento de objetos permitem a marcação, a pesquisa e o gerenciamento eficientes de dados - essenciais para organizar e recuperar dados em fluxos de trabalho complexos de treinamento e inferência de modelos de IA.</p>
<p><strong>Vantagens económicas e operacionais:</strong> O armazenamento de objetos compatível com S3 oferece um custo total de propriedade até 80% menor em comparação com alternativas de armazenamento de arquivos, aproveitando o hardware padrão do setor e o dimensionamento independente de capacidade e desempenho. Esta eficiência económica torna-se crucial à medida que os conjuntos de dados de IA atingem a escala empresarial.</p>
<p><strong>Segurança e governança corporativa:</strong> Ao contrário das implementações GPUDirect que exigem modificações no nível do kernel, o RDMA para armazenamento compatível com S3 não requer alterações específicas do kernel do fornecedor, mantendo a segurança do sistema e a conformidade regulamentar. Essa abordagem é particularmente valiosa em setores como saúde e finanças, onde a segurança de dados e a conformidade regulatória são fundamentais.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">O caminho a seguir<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>O anúncio da NVIDIA sobre a disponibilidade geral do RDMA para armazenamento compatível com S3 representa mais do que um marco tecnológico - ele sinaliza a maturação da arquitetura de infraestrutura de AI. Ao combinar a escalabilidade ilimitada do armazenamento de objetos com o desempenho revolucionário do acesso direto à GPU, as organizações podem finalmente criar infraestruturas de AI que escalam com suas ambições.</p>
<p>À medida que as cargas de trabalho de IA continuam a crescer em complexidade e escala, o RDMA para armazenamento compatível com S3 fornece a base de armazenamento que permite que as organizações maximizem seus investimentos em IA, mantendo a soberania dos dados e a simplicidade operacional. A tecnologia transforma o armazenamento de um gargalo em um facilitador, permitindo que os aplicativos de IA atinjam todo o seu potencial em escala corporativa.</p>
<p>Para as organizações que planejam seu roteiro de infraestrutura de IA, a disponibilidade geral do RDMA para armazenamento compatível com S3 marca o início de uma nova era em que o desempenho do armazenamento realmente corresponde às demandas das cargas de trabalho de IA modernas.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Perspectivas do setor<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>À medida que a IA se torna cada vez mais central para a prestação de cuidados de saúde, procuramos continuamente aumentar o desempenho e a eficiência da nossa infraestrutura. O novo armazenamento compatível com RDMA para S3 da NVIDIA e da Cloudian será fundamental para nossas aplicações de análise de imagens médicas e IA de diagnóstico, onde o processamento rápido de grandes conjuntos de dados pode afetar diretamente o atendimento ao paciente, reduzindo os custos de movimentação de dados entre dispositivos de armazenamento baseados em S3-API e armazenamentos NAS baseados em SSD.  - <em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professor (F) de Patologia, PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre</em></p>
<p>"O anúncio do RDMA da NVIDIA para compatibilidade com S3 confirma o valor da nossa estratégia de infraestrutura de IA baseada em Cloudian. Permitimos que as organizações executem IA de alto desempenho em escala, preservando a compatibilidade da API S3 que mantém a migração simples e os custos de desenvolvimento de aplicativos baixos." - <em>Sunil Gupta, cofundador, diretor administrativo e diretor executivo (CEO), Yotta Data Services</em></p>
<p>"À medida que expandimos nossos recursos locais para fornecer AI soberana, a tecnologia de armazenamento compatível com RDMA para S3 da NVIDIA e o armazenamento de objetos de alto desempenho da Cloudian nos fornecem o desempenho de que precisamos sem comprometer a residência de dados e sem exigir nenhuma modificação no nível do kernel. A plataforma Cloudian HyperStore permite-nos escalar até exabytes, mantendo os nossos dados sensíveis de IA totalmente sob o nosso controlo." - <em>Logan Lee, EVP e Diretor de Cloud, Kakao</em></p>
<p>"Estamos entusiasmados com o anúncio da NVIDIA sobre o próximo lançamento do GA de armazenamento compatível com RDMA para S3. Nossos testes com o Cloudian mostraram uma melhoria de desempenho de até 8X para operações de banco de dados vetorial, o que permitirá que nossos usuários do Milvus by Zilliz obtenham desempenho em escala de nuvem para cargas de trabalho de IA exigentes, mantendo a soberania total dos dados." - <em>Charles Xie, fundador e CEO da Zilliz</em></p>
