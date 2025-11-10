---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: >-
  Potencialize o RAG de alto desempenho para GenAI com o HPE Alletra Storage MP
  + Milvus
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_45b4796ef3.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  Impulsione a GenAI com o HPE Alletra Storage MP X10000 e o Milvus. Obtenha
  pesquisa vetorial escalável e de baixa latência e armazenamento de nível
  empresarial para RAG rápido e seguro.
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p>O HPE Alletra Storage MP X10000 e o Milvus potencializam o RAG escalável e de baixa latência, permitindo que os LLMs forneçam respostas precisas e ricas em contexto, com pesquisa vetorial de alto desempenho para cargas de trabalho de GenAI.</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">Na IA generativa, o RAG precisa de mais do que apenas um LLM<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>O contexto liberta o verdadeiro poder da IA generativa (GenAI) e dos modelos de linguagem de grande porte (LLMs). Quando um LLM tem os sinais certos para orientar as suas respostas, pode dar respostas exactas, relevantes e fiáveis.</p>
<p>Pense da seguinte forma: se fosse largado numa selva densa com um dispositivo GPS mas sem sinal de satélite. O ecrã mostra um mapa, mas sem a sua posição atual, é inútil para a navegação. Pelo contrário, um GPS com um sinal de satélite forte não se limita a mostrar um mapa; dá-lhe orientação passo a passo.</p>
<p>É isso que a geração aumentada por recuperação (RAG) faz para os LLMs. O modelo já tem o mapa (o seu conhecimento pré-treinado), mas não a direção (os seus dados específicos do domínio). Os LLMs sem RAG são como dispositivos GPS que estão cheios de conhecimento mas não têm orientação em tempo real. O RAG fornece o sinal que diz ao modelo onde ele está e para onde ir.</p>
<p>O RAG fundamenta as respostas do modelo em conhecimento fiável e atualizado, extraído do seu próprio conteúdo específico do domínio, desde políticas, documentos de produtos, bilhetes, PDFs, código, transcrições de áudio, imagens e muito mais. Fazer o RAG funcionar em escala é um desafio. O processo de recuperação tem de ser suficientemente rápido para manter a experiência do utilizador sem falhas, suficientemente preciso para devolver as informações mais relevantes e previsível mesmo quando o sistema está sob carga pesada. Isso significa lidar com grandes volumes de consulta, ingestão contínua de dados e tarefas em segundo plano, como a criação de índices, sem degradação do desempenho. A criação de um pipeline RAG com alguns PDFs é relativamente simples. No entanto, ao aumentar para centenas de PDFs, o desafio torna-se significativamente maior. Não é possível manter tudo na memória, pelo que uma estratégia de armazenamento robusta e eficiente se torna essencial para gerir as incorporações, os índices e o desempenho da recuperação. O RAG requer uma base de dados vetorial e uma camada de armazenamento que possa acompanhar o ritmo do crescimento da concorrência e dos volumes de dados.</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">As bases de dados vectoriais alimentam o RAG<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>No centro do RAG está a pesquisa semântica, que permite encontrar informações pelo significado e não por palavras-chave exactas. É aqui que entram as bases de dados vectoriais. Estas bases armazenam incorporações de alta dimensão de texto, imagens e outros dados não estruturados, permitindo uma pesquisa por semelhança que recupera o contexto mais relevante para as suas consultas. O Milvus é um exemplo importante: uma base de dados vetorial nativa da nuvem e de código aberto criada para pesquisa de semelhanças à escala de mil milhões. Suporta a pesquisa híbrida, combinando a semelhança de vectores com filtros de palavras-chave e escalares para maior precisão, e oferece escalonamento independente de computação e armazenamento com opções de otimização sensíveis à GPU para aceleração. O Milvus também gerencia os dados por meio de um ciclo de vida de segmento inteligente, passando de segmentos crescentes para segmentos selados com compactação e várias opções de indexação de vizinho mais próximo aproximado (ANN), como HNSW e DiskANN, garantindo desempenho e escalabilidade para cargas de trabalho de IA em tempo real, como RAG.</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">O desafio oculto: taxa de transferência e latência de armazenamento<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>As cargas de trabalho de pesquisa vetorial exercem pressão sobre todas as partes do sistema. Exigem uma ingestão de alta simultaneidade, mantendo a recuperação de baixa latência para consultas interactivas. Ao mesmo tempo, operações em segundo plano, como criação de índices, compactação e recarregamento de dados, devem ser executadas sem interromper o desempenho em tempo real. Muitos estrangulamentos de desempenho nas arquitecturas tradicionais têm origem no armazenamento. Quer se trate de limitações de entrada/saída (E/S), atrasos na pesquisa de metadados ou restrições de concorrência. Para oferecer desempenho previsível e em tempo real em escala, a camada de armazenamento deve acompanhar as demandas dos bancos de dados vetoriais.</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">A base de armazenamento para pesquisa vetorial de alto desempenho<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">O HPE Alletra Storage MP X10000</a> é uma plataforma de armazenamento de objetos otimizada para flash, totalmente NVMe e compatível com S3, projetada para desempenho em tempo real em escala. Diferentemente dos armazenamentos de objetos tradicionais focados em capacidade, o HPE Alletra Storage MP X10000 foi projetado para cargas de trabalho de baixa latência e alto rendimento, como a pesquisa vetorial. Seu mecanismo de valor-chave estruturado em log e metadados baseados em extensão permitem leituras e gravações altamente paralelas, enquanto o GPUDirect RDMA oferece caminhos de dados de cópia zero que reduzem a sobrecarga da CPU e aceleram a movimentação de dados para GPUs. A arquitetura suporta o escalonamento desagregado, permitindo que a capacidade e o desempenho cresçam de forma independente, e inclui funcionalidades de nível empresarial, como encriptação, controlo de acesso baseado em funções (RBAC), imutabilidade e durabilidade dos dados. Combinado com seu design nativo da nuvem, o HPE Alletra Storage MP X10000 se integra perfeitamente aos ambientes Kubernetes, tornando-o uma base de armazenamento ideal para implantações Milvus.</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000 e Milvus: uma base expansível para RAG<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>O HPE Alletra Storage MP X10000 e o Milvus se complementam para oferecer RAG que é rápido, previsível e fácil de expandir. A Figura 1 ilustra a arquitetura de casos de uso de IA expansíveis e pipelines RAG, mostrando como os componentes do Milvus implantados em um ambiente em contêineres interagem com o armazenamento de objetos de alto desempenho do HPE Alletra Storage MP X10000.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Milvus separa claramente a computação do armazenamento, enquanto o HPE Alletra Storage MP X10000 oferece acesso a objetos de alta taxa de transferência e baixa latência, que acompanha o ritmo das cargas de trabalho vetoriais. Juntos, eles permitem um desempenho de expansão previsível: O Milvus distribui as consultas pelos shards, e o dimensionamento fracionário e multidimensional do HPE Alletra Storage MP X10000 mantém a latência consistente à medida que os dados e o QPS aumentam. Em termos simples, você adiciona exatamente a capacidade ou o desempenho de que precisa, quando precisa. A simplicidade operacional é outra vantagem: o HPE Alletra Storage MP X10000 sustenta o desempenho máximo a partir de um único bucket, eliminando camadas complexas, enquanto os recursos empresariais (criptografia, RBAC, imutabilidade, durabilidade robusta) suportam implantações no local ou híbridas com forte soberania de dados e objetivos de nível de serviço (SLOs) consistentes.</p>
<p>Quando a pesquisa vetorial se expande, o armazenamento é frequentemente responsabilizado pela lentidão na ingestão, compactação ou recuperação. Com o Milvus no HPE Alletra Storage MP X10000, essa narrativa muda. A arquitetura totalmente NVMe e estruturada em log da plataforma e a opção GPUDirect RDMA oferecem acesso a objetos consistente e de latência ultrabaixa - mesmo sob forte concorrência e durante operações de ciclo de vida, como criação e recarga de índices. Na prática, seus pipelines RAG permanecem vinculados à computação, não ao armazenamento. À medida que as coleções crescem e os volumes de consulta aumentam, o Milvus permanece responsivo, enquanto o HPE Alletra Storage MP X10000 preserva o espaço livre de E/S, permitindo uma escalabilidade previsível e linear, sem rearquitetar o armazenamento. Isso se torna especialmente importante à medida que as implantações de RAG se expandem para além dos estágios iniciais de prova de conceito e passam para a produção total.</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">RAG pronto para empresas: escalável, previsível e criado para GenAI<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>Para cargas de trabalho RAG e GenAI em tempo real, a combinação do HPE Alletra Storage MP X10000 e do Milvus oferece uma base pronta para o futuro que se expande com confiança. Essa solução integrada permite que as organizações criem sistemas inteligentes que são rápidos, elásticos e seguros - sem comprometer o desempenho ou a capacidade de gerenciamento. O Milvus oferece pesquisa vetorial distribuída e acelerada por GPU, com expansão modular, enquanto o HPE Alletra Storage MP X10000 garante acesso a objetos ultrarrápido e de baixa latência, com durabilidade e gerenciamento de ciclo de vida de nível empresarial. Juntos, eles dissociam a computação do armazenamento, permitindo um desempenho previsível, mesmo com o aumento dos volumes de dados e da complexidade das consultas. Quer esteja a servir recomendações em tempo real, a potenciar a pesquisa semântica ou a escalar milhares de milhões de vectores, esta arquitetura mantém os seus pipelines RAG responsivos, eficientes em termos de custos e optimizados para a cloud. o perfeita ao Kubernetes e à nuvem HPE GreenLake, você ganha gerenciamento unificado, preços baseados em consumo e a flexibilidade de implantar em ambientes de nuvem híbrida ou privada. HPE Alletra Storage MP X10000 e Milvus: uma solução RAG expansível e de alto desempenho criada para as demandas da GenAI moderna.</p>
