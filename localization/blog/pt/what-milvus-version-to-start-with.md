---
id: what-milvus-version-to-start-with.md
title: Com que versão do Milvus começar?
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Um guia completo sobre as caraterísticas e capacidades de cada versão do
  Milvus para tomar uma decisão informada para os seus projectos de pesquisa
  vetorial.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Introdução às versões do Milvus</custom-h1><p>A seleção da versão adequada do Milvus é fundamental para o sucesso de qualquer projeto que utilize a tecnologia de pesquisa vetorial. Com diferentes versões do Milvus adaptadas a diferentes requisitos, compreender a importância de selecionar a versão correta é crucial para alcançar os resultados desejados.</p>
<p>A versão certa do Milvus pode ajudar um programador a aprender e a criar protótipos rapidamente ou ajudar a otimizar a utilização de recursos, simplificar os esforços de desenvolvimento e garantir a compatibilidade com as infra-estruturas e ferramentas existentes. Em última análise, trata-se de manter a produtividade do programador e melhorar a eficiência, a fiabilidade e a satisfação do utilizador.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Versões disponíveis do Milvus<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Estão disponíveis três versões do Milvus para os programadores e todas elas são de código aberto. As três versões são o Milvus Lite, o Milvus Standalone e o Milvus Cluster, que diferem nas funcionalidades e na forma como os utilizadores planeiam utilizar o Milvus a curto e longo prazo. Portanto, vamos explorá-las individualmente.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Como o nome sugere, o Milvus Lite é uma versão leve que se integra perfeitamente com o Google Colab e o Jupyter Notebook. É empacotado como um único binário sem dependências adicionais, tornando-o fácil de instalar e executar na sua máquina ou incorporar em aplicações Python. Além disso, o Milvus Lite inclui um servidor independente Milvus baseado em CLI, proporcionando flexibilidade para executá-lo diretamente em sua máquina. Se o incorporar no seu código Python ou o utilizar como um servidor autónomo, depende inteiramente da sua preferência e dos requisitos específicos da aplicação.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caraterísticas e Capacidades</h3><p>O Milvus Lite inclui todas as funcionalidades principais de pesquisa vetorial do Milvus.</p>
<ul>
<li><p><strong>Recursos de pesquisa</strong>: Suporta pesquisas top-k, de intervalo e híbridas, incluindo filtragem de metadados, para atender a diversos requisitos de pesquisa.</p></li>
<li><p><strong>Tipos de índices e métricas de similaridade</strong>: Oferece suporte para 11 tipos de índices e cinco métricas de similaridade, fornecendo flexibilidade e opções de personalização para seu caso de uso específico.</p></li>
<li><p><strong>Processamento de dados</strong>: Permite o processamento em lote (Apache Parquet, Arrays, JSON) e em fluxo, com integração perfeita através de conectores para Airbyte, Apache Kafka e Apache Spark.</p></li>
<li><p><strong>Operações CRUD</strong>: Oferece suporte completo a CRUD (criar, ler, atualizar/inserir, eliminar), capacitando os utilizadores com capacidades abrangentes de gestão de dados.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Aplicações e limitações</h3><p>O Milvus Lite é ideal para prototipagem rápida e desenvolvimento local, oferecendo suporte para configuração rápida e experimentação com conjuntos de dados de pequena escala na sua máquina. No entanto, as suas limitações tornam-se evidentes quando se faz a transição para ambientes de produção com conjuntos de dados maiores e requisitos de infra-estruturas mais exigentes. Assim, embora o Milvus Lite seja uma excelente ferramenta para exploração e testes iniciais, ele pode não ser adequado para a implantação de aplicativos em configurações de alto volume ou prontas para produção.</p>
<h3 id="Available-Resources" class="common-anchor-header">Recursos disponíveis</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Documentação</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Repositório do Github</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Exemplo do Google Colab</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Vídeo de introdução</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus autónomo<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus oferece dois modos operacionais: Standalone e Cluster. Ambos os modos são idênticos no que diz respeito às principais funcionalidades da base de dados vetorial e diferem no que diz respeito ao suporte do tamanho dos dados e aos requisitos de escalabilidade. Esta distinção permite-lhe selecionar o modo que melhor se alinha com o tamanho do seu conjunto de dados, volume de tráfego e outros requisitos de infraestrutura para produção.</p>
<p>O Milvus Standalone é um modo de funcionamento do sistema de base de dados vetorial Milvus em que este funciona de forma independente como uma única instância, sem qualquer agrupamento ou configuração distribuída. Neste modo, o Milvus funciona num único servidor ou máquina, fornecendo funcionalidades como a indexação e a pesquisa de vectores. É adequado para situações em que a escala do volume de dados e de tráfego é relativamente pequena e não requer as capacidades distribuídas fornecidas por uma configuração em cluster.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caraterísticas e capacidades</h3><ul>
<li><p><strong>Alto desempenho</strong>: Realizar pesquisas vectoriais em conjuntos de dados maciços (milhares de milhões ou mais) com velocidade e eficiência excepcionais.</p></li>
<li><p><strong>Capacidades de pesquisa</strong>: Suporta pesquisas top-k, de intervalo e híbridas, incluindo filtragem de metadados, para atender a diversos requisitos de pesquisa.</p></li>
<li><p><strong>Tipos de índices e métricas de similaridade</strong>: Oferece suporte para 11 tipos de índices e 5 métricas de similaridade, proporcionando flexibilidade e opções de personalização para o seu caso de utilização específico.</p></li>
<li><p><strong>Processamento de dados</strong>: Permite o processamento em lote (Apache Parquet, Arrays, Json) e em fluxo, com integração perfeita através de conectores para Airbyte, Apache Kafka e Apache Spark.</p></li>
<li><p><strong>Escalabilidade</strong>: Alcance a escalabilidade dinâmica com o escalonamento no nível do componente, permitindo o escalonamento contínuo para cima e para baixo com base na demanda. O Milvus pode escalonar automaticamente no nível do componente, otimizando a alocação de recursos para aumentar a eficiência.</p></li>
<li><p><strong>Multitenancy</strong>: Suporta multi-tenancy com a capacidade de gerenciar até 10.000 coleções/partições em um cluster, fornecendo utilização eficiente de recursos e isolamento para diferentes usuários ou aplicações.</p></li>
<li><p><strong>Operações CRUD</strong>: Oferece suporte completo a CRUD (criar, ler, atualizar/acrescentar, eliminar), dando aos utilizadores capacidades abrangentes de gestão de dados.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componentes essenciais:</h3><ul>
<li><p>Milvus: O componente funcional principal.</p></li>
<li><p>etcd: O mecanismo de metadados responsável por acessar e armazenar metadados dos componentes internos do Milvus, incluindo proxies, nós de índice e outros.</p></li>
<li><p>MinIO: O mecanismo de armazenamento responsável pela persistência de dados no Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1: Arquitetura autónoma do Milvus</p>
<h3 id="Available-Resources" class="common-anchor-header">Recursos disponíveis</h3><ul>
<li><p>Documentação</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Lista de verificação do ambiente para o Milvus com o Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Instalar o Milvus Standalone com o Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositório Github</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Cluster é um modo de funcionamento do sistema de base de dados vetorial Milvus em que este funciona e é distribuído por vários nós ou servidores. Neste modo, as instâncias do Milvus são agrupadas em clusters para formar um sistema unificado que pode lidar com volumes maiores de dados e cargas de tráfego mais elevadas em comparação com uma configuração autónoma. O Milvus Cluster oferece escalabilidade, tolerância a falhas e recursos de balanceamento de carga, tornando-o adequado para cenários que precisam lidar com grandes volumes de dados e atender a muitas consultas simultâneas de forma eficiente.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Caraterísticas e capacidades</h3><ul>
<li><p>Herda todos os recursos disponíveis no Milvus Standalone, incluindo pesquisa vetorial de alto desempenho, suporte a vários tipos de índices e métricas de similaridade e integração perfeita com estruturas de processamento em lote e fluxo.</p></li>
<li><p>Oferece disponibilidade, desempenho e otimização de custos incomparáveis, aproveitando a computação distribuída e o balanceamento de carga em vários nós.</p></li>
<li><p>Permite implementar e escalar cargas de trabalho seguras e de nível empresarial com custos totais mais baixos, utilizando eficientemente os recursos em todo o cluster e optimizando a atribuição de recursos com base nas exigências da carga de trabalho.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componentes essenciais:</h3><p>O Milvus Cluster inclui oito componentes de microsserviço e três dependências de terceiros. Todos os microsserviços podem ser implantados no Kubernetes independentemente uns dos outros.</p>
<h4 id="Microservice-components" class="common-anchor-header">Componentes de microsserviços</h4><ul>
<li><p>Coordenação de raiz</p></li>
<li><p>Proxy</p></li>
<li><p>Coordenação de consulta</p></li>
<li><p>Nó de consulta</p></li>
<li><p>Coordenada de índice</p></li>
<li><p>Nó de índice</p></li>
<li><p>Coordenada de dados</p></li>
<li><p>Nó de dados</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Dependências de terceiros</h4><ul>
<li><p>etcd: Armazena metadados para vários componentes no cluster.</p></li>
<li><p>MinIO: Responsável pela persistência de dados de arquivos grandes no cluster, como arquivos de índice e de log binário.</p></li>
<li><p>Pulsar: Gerencia logs de operações de mutação recentes, gera logs de streaming e fornece serviços de publicação e assinatura de logs.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2: Arquitetura do Cluster Milvus</p>
<h4 id="Available-Resources" class="common-anchor-header">Recursos disponíveis</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Documentação</a> | Como começar</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Instalar o Milvus Cluster com o Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Instalar o Milvus Cluster com o Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Como escalar um Cluster Milvus</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositório Github</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Tomando a decisão sobre qual versão do Milvus usar<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao decidir qual a versão do Milvus a utilizar no seu projeto, deve considerar factores como o tamanho do conjunto de dados, o volume de tráfego, os requisitos de escalabilidade e as restrições do ambiente de produção. O Milvus Lite é perfeito para a criação de protótipos no seu computador portátil. O Milvus Standalone oferece alto desempenho e flexibilidade para realizar pesquisas vetoriais em seus conjuntos de dados, tornando-o adequado para implantações de menor escala, CI / CD e implantações offline quando você não tem suporte para Kubernetes ... E, finalmente, o Milvus Cluster oferece disponibilidade incomparável, escalabilidade e otimização de custos para cargas de trabalho de nível empresarial, tornando-o a escolha preferida para ambientes de produção de grande escala e altamente disponíveis.</p>
<p>Existe outra versão que é uma versão sem complicações, que é uma versão gerida do Milvus chamada <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>Em última análise, a versão do Milvus dependerá do seu caso de utilização específico, dos requisitos de infraestrutura e dos objectivos a longo prazo. Ao avaliar cuidadosamente estes factores e ao compreender as caraterísticas e capacidades de cada versão, pode tomar uma decisão informada que se alinhe com as necessidades e objectivos do seu projeto. Quer escolha o Milvus Standalone ou o Milvus Cluster, pode tirar partido do poder das bases de dados vectoriais para melhorar o desempenho e a eficiência das suas aplicações de IA.</p>
