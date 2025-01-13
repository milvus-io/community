---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  A Milvus introduziu o MMap para uma gestão de dados redefinida e uma maior
  capacidade de armazenamento
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  A funcionalidade Milvus MMap permite que os utilizadores tratem mais dados com
  uma memória limitada, alcançando um equilíbrio delicado entre desempenho,
  custo e limites do sistema.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">O Milvus</a> é a solução mais rápida em <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de dados vectoriais</a> de código aberto, atendendo a utilizadores com requisitos de desempenho intensivos. No entanto, a diversidade das necessidades dos utilizadores reflecte os dados com que trabalham. Alguns dão prioridade a soluções económicas e a um armazenamento expansivo em detrimento da velocidade. Compreendendo este espetro de exigências, a Milvus introduz a funcionalidade MMap, redefinindo a forma como lidamos com grandes volumes de dados, prometendo eficiência de custos sem sacrificar a funcionalidade.</p>
<h2 id="What-is-MMap" class="common-anchor-header">O que é o MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, abreviatura de memory-mapped files, faz a ponte entre os ficheiros e a memória nos sistemas operativos. Esta tecnologia permite ao Milvus mapear grandes ficheiros diretamente no espaço de memória do sistema, transformando os ficheiros em blocos de memória contíguos. Esta integração elimina a necessidade de operações explícitas de leitura ou escrita, alterando fundamentalmente a forma como o Milvus gere os dados. Assegura um acesso sem falhas e um armazenamento eficiente para ficheiros de grandes dimensões ou situações em que os utilizadores necessitam de aceder aos ficheiros de forma aleatória.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Quem beneficia da MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais exigem uma capacidade de memória substancial devido aos requisitos de armazenamento dos dados vectoriais. Com a funcionalidade MMap, o processamento de mais dados numa memória limitada torna-se uma realidade. No entanto, esta capacidade acrescida tem um custo de desempenho. O sistema gere a memória de forma inteligente, retirando alguns dados com base na carga e na utilização. Esse despejo permite que o Milvus processe mais dados com a mesma capacidade de memória.</p>
<p>Durante os nossos testes, observámos que, com uma memória ampla, todos os dados residem na memória após um período de aquecimento, preservando o desempenho do sistema. No entanto, à medida que o volume de dados aumenta, o desempenho diminui gradualmente. <strong>Por isso, recomendamos a funcionalidade MMap para utilizadores menos sensíveis a flutuações de desempenho.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Ativar o MMap no Milvus: uma configuração simples<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>A ativação do MMap no Milvus é extremamente simples. Basta modificar o ficheiro <code translate="no">milvus.yaml</code>: adicionar o item <code translate="no">mmapDirPath</code> à configuração <code translate="no">queryNode</code> e definir um caminho válido como o seu valor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Atingir o equilíbrio: desempenho, armazenamento e limites do sistema<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Os padrões de acesso aos dados têm um impacto significativo no desempenho. O recurso MMap do Milvus otimiza o acesso aos dados com base na localidade. O MMap permite ao Milvus escrever dados escalares diretamente no disco para segmentos de dados acedidos sequencialmente. Dados de comprimento variável, como strings, são achatados e indexados usando uma matriz de offsets na memória. Esta abordagem garante a localidade de acesso aos dados e elimina a sobrecarga de armazenar cada dado de comprimento variável separadamente. As optimizações para índices vectoriais são meticulosas. O MMap é utilizado seletivamente para dados vectoriais enquanto mantém as listas de adjacência na memória, conservando uma memória significativa sem comprometer o desempenho.</p>
<p>Além disso, o MMap maximiza o processamento de dados, minimizando o uso de memória. Ao contrário das versões anteriores do Milvus, em que o QueryNode copiava conjuntos de dados inteiros, o MMap adopta um processo de streaming simplificado e sem cópias durante o desenvolvimento. Esta otimização reduz drasticamente a sobrecarga de memória.</p>
<p><strong>Os resultados dos nossos testes internos mostram que o Milvus pode lidar eficientemente com o dobro do volume de dados quando o MMap é ativado.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">O caminho a seguir: inovação contínua e melhorias centradas no utilizador<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora a funcionalidade MMap esteja na sua fase beta, a equipa do Milvus está empenhada na melhoria contínua. As futuras actualizações irão aperfeiçoar a utilização da memória do sistema, permitindo que o Milvus suporte volumes de dados ainda mais extensos num único nó. Os utilizadores podem antecipar um controlo mais granular sobre a funcionalidade MMap, permitindo alterações dinâmicas às colecções e modos avançados de carregamento de campos. Estas melhorias proporcionam uma flexibilidade sem precedentes, permitindo aos utilizadores adaptarem as suas estratégias de processamento de dados a requisitos específicos.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Conclusão: redefinindo a excelência do processamento de dados com o Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>O recurso MMap do Milvus 2.3 marca um salto significativo na tecnologia de processamento de dados. Ao atingir um equilíbrio delicado entre desempenho, custo e limites do sistema, o Milvus permite que os utilizadores lidem com grandes quantidades de dados de forma eficiente e económica. À medida que o Milvus continua a evoluir, permanece na vanguarda das soluções inovadoras, redefinindo os limites do que é possível alcançar na gestão de dados.</p>
<p>Fique atento a mais desenvolvimentos inovadores à medida que o Milvus continua a sua viagem em direção a uma excelência de processamento de dados sem paralelo.</p>
