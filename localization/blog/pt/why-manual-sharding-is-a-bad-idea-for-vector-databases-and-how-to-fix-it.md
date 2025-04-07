---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Porque é que a fragmentação manual é uma má ideia para a base de dados de
  vectores e como corrigi-la
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Descubra por que razão a fragmentação manual da base de dados vetorial cria
  estrangulamentos e como o dimensionamento automatizado do Milvus elimina as
  despesas gerais de engenharia para um crescimento contínuo.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"<em>Inicialmente, criámos a nossa pesquisa semântica no pgvector em vez do Milvus porque todos os nossos dados relacionais já estavam no PostgreSQL",</em> recorda Alex, CTO de uma startup SaaS de IA empresarial. <em>"Mas assim que atingimos a adequação do produto ao mercado, nosso crescimento encontrou sérios obstáculos no lado da engenharia. Rapidamente ficou claro que o pgvector não foi projetado para escalabilidade. Tarefas simples, como a implementação de actualizações de esquemas em vários fragmentos, transformaram-se em processos tediosos e propensos a erros que consumiram dias de esforço de engenharia. Quando chegamos a 100 milhões de embeddings vetoriais, a latência das consultas aumentou para mais de um segundo, algo muito além do que nossos clientes tolerariam. Depois de mudar para o Milvus, a fragmentação manual parecia estar a entrar na idade da pedra. Não é divertido fazer malabarismos com servidores de fragmentação como se fossem artefactos frágeis. Nenhuma empresa deveria ter que suportar isso."</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Um desafio comum para empresas de IA<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>A experiência de Alex não é exclusiva dos usuários do pgvector. Quer você esteja usando pgvector, Qdrant, Weaviate ou qualquer outro banco de dados vetorial que dependa de fragmentação manual, os desafios de dimensionamento permanecem os mesmos. O que começa como uma solução gerenciável rapidamente se transforma em uma dívida tecnológica à medida que os volumes de dados crescem.</p>
<p>Para as startups de hoje, <strong>a escalabilidade não é opcional - é uma missão crítica</strong>. Isso é especialmente verdadeiro para produtos de IA alimentados por modelos de linguagem grande (LLM) e bancos de dados vetoriais, onde o salto da adoção inicial para o crescimento exponencial pode acontecer da noite para o dia. Alcançar a adequação do produto ao mercado desencadeia muitas vezes um aumento do crescimento do número de utilizadores, influxos de dados avassaladores e exigências de consulta disparadas. Mas se a infraestrutura da base de dados não conseguir acompanhar o ritmo, as consultas lentas e as ineficiências operacionais podem travar a dinâmica e impedir o sucesso do negócio.</p>
<p>Uma decisão técnica a curto prazo pode conduzir a um estrangulamento a longo prazo, obrigando as equipas de engenharia a resolver constantemente problemas urgentes de desempenho, falhas na base de dados e falhas no sistema, em vez de se concentrarem na inovação. O pior cenário possível? Uma re-arquitetura de base de dados dispendiosa e demorada - precisamente quando uma empresa deveria estar a escalar.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">A fragmentação não é uma solução natural para a escalabilidade?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>A escalabilidade pode ser abordada de várias maneiras. A abordagem mais simples, o <strong>aumento de escala</strong>, envolve o aprimoramento dos recursos de uma única máquina, adicionando mais CPU, memória ou armazenamento para acomodar volumes de dados crescentes. Embora simples, esse método tem limitações claras. Em um ambiente Kubernetes, por exemplo, pods grandes são ineficientes, e depender de um único nó aumenta o risco de falha, potencialmente levando a um tempo de inatividade significativo.</p>
<p>Quando o Scaling Up não é mais viável, as empresas naturalmente se voltam para o <strong>Scaling Out</strong>, distribuindo dados em vários servidores. À primeira vista, o <strong>sharding</strong> parece ser uma solução simples - dividir um banco de dados em bancos de dados menores e independentes para aumentar a capacidade e permitir vários nós primários graváveis.</p>
<p>No entanto, embora conceitualmente simples, o sharding rapidamente se torna um desafio complexo na prática. A maioria dos aplicativos é inicialmente projetada para trabalhar com um único banco de dados unificado. No momento em que um banco de dados vetorial é dividido em vários fragmentos, cada parte do aplicativo que interage com os dados deve ser modificada ou totalmente reescrita, introduzindo uma sobrecarga de desenvolvimento significativa. A conceção de uma estratégia de fragmentação eficaz torna-se crucial, tal como a implementação da lógica de encaminhamento para garantir que os dados são direcionados para o fragmento correto. A gestão de transacções atómicas em vários shards exige frequentemente a reestruturação das aplicações para evitar operações entre shards. Além disso, os cenários de falha devem ser tratados de forma elegante para evitar interrupções quando determinados shards ficam indisponíveis.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Porque é que a fragmentação manual se torna um fardo<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p>&quot;<em>Inicialmente, estimámos que a implementação da fragmentação manual para a nossa base de dados pgvector levaria cerca de seis meses a dois engenheiros&quot;,</em> recorda Alex. <em>&quot;O que não nos apercebemos foi que esses engenheiros seriam</em> <strong><em>sempre</em></strong> <em>necessários. Cada alteração de esquema, operação de rebalanceamento de dados ou decisão de escalonamento exigia sua experiência especializada. Estávamos essencialmente a comprometer-nos com uma 'equipa de sharding' permanente só para manter a nossa base de dados a funcionar.&quot;</em></p>
<p>Os desafios do mundo real com bancos de dados vetoriais fragmentados incluem:</p>
<ol>
<li><p><strong>Desequilíbrio na distribuição de dados (Hotspots)</strong>: Em casos de uso de vários locatários, a distribuição de dados pode variar de centenas a bilhões de vetores por locatário. Esse desequilíbrio cria pontos de acesso em que certos shards ficam sobrecarregados enquanto outros ficam ociosos.</p></li>
<li><p><strong>A dor de cabeça do resharding</strong>: Escolher o número certo de shards é quase impossível. Um número muito pequeno leva a operações de resharding frequentes e dispendiosas. Demasiados criam uma sobrecarga desnecessária de metadados, aumentando a complexidade e reduzindo o desempenho.</p></li>
<li><p><strong>Complexidade de alteração de esquema</strong>: Muitas bases de dados vectoriais implementam a fragmentação gerindo várias bases de dados subjacentes. Isso torna a sincronização de alterações de esquema entre shards complicada e propensa a erros, atrasando os ciclos de desenvolvimento.</p></li>
<li><p><strong>Desperdício de recursos</strong>: Em bancos de dados acoplados de armazenamento-computação, é necessário alocar meticulosamente os recursos em cada nó, antecipando o crescimento futuro. Normalmente, quando a utilização de recursos atinge 60-70%, é necessário começar a planear o resharding.</p></li>
</ol>
<p>Simplificando, <strong>gerenciar shards manualmente é ruim para o seu negócio</strong>. Em vez de prender a sua equipa de engenharia a uma gestão constante de shards, considere investir numa base de dados vetorial concebida para escalar automaticamente - sem os encargos operacionais.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Como o Milvus resolve o problema da escalabilidade<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitos desenvolvedores - de startups a empresas - reconheceram a sobrecarga significativa associada à fragmentação manual do banco de dados. O Milvus adota uma abordagem fundamentalmente diferente, permitindo um escalonamento contínuo de milhões a bilhões de vetores sem a complexidade.</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">Escalonamento automatizado sem a dívida técnica</h3><p>O Milvus aproveita o Kubernetes e uma arquitetura desagregada de armazenamento e computação para oferecer suporte à expansão contínua. Esse design permite:</p>
<ul>
<li><p>Escalonamento rápido em resposta às mudanças nas demandas</p></li>
<li><p>Balanceamento automático de carga em todos os nós disponíveis</p></li>
<li><p>Alocação independente de recursos, permitindo-lhe ajustar a computação, a memória e o armazenamento separadamente</p></li>
<li><p>Alto desempenho consistente, mesmo durante períodos de crescimento rápido</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">Arquitetura distribuída concebida desde o início</h3><p>O Milvus alcança as suas capacidades de escalonamento através de duas inovações chave:</p>
<p><strong>Arquitetura baseada em segmentos:</strong> No seu núcleo, Milvus organiza os dados em &quot;segmentos&quot; - as unidades mais pequenas de gestão de dados:</p>
<ul>
<li><p>Segmentos crescentes residem em StreamNodes, otimizando a atualização de dados para consultas em tempo real</p></li>
<li><p>Segmentos selados são gerenciados por QueryNodes, utilizando índices poderosos para acelerar a pesquisa</p></li>
<li><p>Esses segmentos são distribuídos uniformemente entre os nós para otimizar o processamento paralelo</p></li>
</ul>
<p><strong>Roteamento de duas camadas</strong>: Ao contrário das bases de dados tradicionais, em que cada fragmento reside numa única máquina, o Milvus distribui dinamicamente os dados de um fragmento por vários nós:</p>
<ul>
<li><p>Cada fragmento pode armazenar mais de 1 bilião de pontos de dados</p></li>
<li><p>Os segmentos dentro de cada fragmento são automaticamente equilibrados entre as máquinas</p></li>
<li><p>Expandir colecções é tão simples como aumentar o número de shards</p></li>
<li><p>O próximo Milvus 3.0 introduzirá a divisão dinâmica de fragmentos, eliminando até mesmo este passo manual mínimo</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Processamento de consultas em escala</h3><p>Ao executar uma consulta, o Milvus segue um processo eficiente:</p>
<ol>
<li><p>O Proxy identifica os shards relevantes para a coleção solicitada</p></li>
<li><p>O Proxy reúne dados de ambos StreamNodes e QueryNodes</p></li>
<li><p>Os StreamNodes tratam os dados em tempo real enquanto os QueryNodes processam os dados históricos em simultâneo</p></li>
<li><p>Os resultados são agregados e devolvidos ao utilizador</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Uma experiência de engenharia diferente<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>"<em>Quando a escalabilidade é incorporada na própria base de dados, todas aquelas dores de cabeça simplesmente... desaparecem",</em> diz Alex, reflectindo sobre a transição da sua equipa para o Milvus. <em>"Os meus engenheiros voltaram a criar funcionalidades que os clientes adoram, em vez de ficarem a tomar conta de fragmentos de bases de dados."</em></p>
<p>Se você está enfrentando a carga de engenharia da fragmentação manual, gargalos de desempenho em escala ou a perspetiva assustadora de migrações de banco de dados, é hora de repensar sua abordagem. Visite nossa <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">página de documentos</a> para saber mais sobre a arquitetura Milvus ou experimente a escalabilidade sem esforço em primeira mão com o Milvus totalmente gerenciado em <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Com a base de dados vetorial correta, a sua inovação não conhece limites.</p>
