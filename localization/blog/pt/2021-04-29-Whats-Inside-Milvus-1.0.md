---
id: Whats-Inside-Milvus-1.0.md
title: O que há no Milvus 1.0?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  O Milvus v1.0 já está disponível. Saiba mais sobre os fundamentos do Milvus,
  bem como sobre as principais caraterísticas do Milvus v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>O que há no Milvus 1.0?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>O Milvus é uma base de dados vetorial de código aberto concebida para gerir conjuntos de dados vectoriais massivos de milhões, biliões ou mesmo triliões. O Milvus tem amplas aplicações que abrangem a descoberta de novos medicamentos, visão computacional, condução autónoma, motores de recomendação, chatbots e muito mais.</p>
<p>Em março de 2021, a Zilliz, a empresa por detrás do Milvus, lançou a primeira versão de suporte a longo prazo da plataforma - Milvus v1.0. Após meses de testes exaustivos, uma versão estável e pronta para produção da base de dados vetorial mais popular do mundo está pronta para o horário nobre. Este artigo do blogue aborda alguns fundamentos do Milvus, bem como as principais funcionalidades da v1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Distribuições do Milvus</h3><p>O Milvus está disponível em distribuições somente para CPU e habilitadas para GPU. A primeira depende exclusivamente da CPU para a construção e pesquisa de índices; a segunda permite a pesquisa híbrida de CPU e GPU e a construção de índices que acelera ainda mais o Milvus. Por exemplo, usando a distribuição híbrida, a CPU pode ser usada para pesquisa e a GPU para criação de índices, melhorando ainda mais a eficiência da consulta.</p>
<p>Ambas as distribuições do Milvus estão disponíveis no Docker. Pode compilar o Milvus a partir do Docker (se o seu sistema operativo o suportar) ou compilar o Milvus a partir do código fonte no Linux (outros sistemas operativos não são suportados).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Incorporação de vectores</h3><p>Os vetores são armazenados no Milvus como entidades. Cada entidade tem um campo de identificação do vetor e um campo do vetor. O Milvus v1.0 suporta apenas IDs de vectores inteiros. Ao criar uma coleção no Milvus, os IDs dos vectores podem ser gerados automaticamente ou definidos manualmente. O Milvus garante que os IDs de vetor gerados automaticamente são únicos, no entanto, os IDs definidos manualmente podem ser duplicados no Milvus. Se definir manualmente os IDs, os utilizadores são responsáveis por garantir que todos os IDs são únicos.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Partições</h3><p>O Milvus suporta a criação de partições numa coleção. Em situações em que os dados são inseridos regularmente e os dados históricos não são significativos (por exemplo, dados de streaming), as partições podem ser utilizadas para acelerar a pesquisa de semelhanças vectoriais. Uma coleção pode ter até 4.096 partições. Especificar uma pesquisa de vectores dentro de uma partição específica limita a pesquisa e pode reduzir significativamente o tempo de consulta, particularmente para colecções que contêm mais de um trilião de vectores.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Optimizações do algoritmo de índice</h3><p>O Milvus é construído sobre várias bibliotecas de índices amplamente adotadas, incluindo Faiss, NMSLIB e Annoy. O Milvus é muito mais do que um invólucro básico para essas bibliotecas de índices. Aqui estão alguns dos principais aprimoramentos que foram feitos nas bibliotecas subjacentes:</p>
<ul>
<li>Optimizações de desempenho do índice IVF utilizando o algoritmo Elkan k-means.</li>
<li>Optimizações de pesquisa FLAT.</li>
<li>Suporte ao índice híbrido IVF_SQ8H, que pode reduzir o tamanho dos arquivos de índice em até 75% sem sacrificar a precisão dos dados. O IVF_SQ8H foi desenvolvido com base no IVF_SQ8, com recuperação idêntica, mas velocidade de consulta muito mais rápida. Ele foi projetado especificamente para o Milvus para aproveitar a capacidade de processamento paralelo das GPUs e o potencial de sinergia entre o co-processamento CPU/GPU.</li>
<li>Compatibilidade dinâmica do conjunto de instruções.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Pesquisa, criação de índices e outras optimizações do Milvus</h3><p>As seguintes otimizações foram feitas no Milvus para melhorar o desempenho da pesquisa e da criação de índices.</p>
<ul>
<li>O desempenho da pesquisa é otimizado em situações em que o número de consultas (nq) é menor que o número de threads da CPU.</li>
<li>O Milvus combina os pedidos de pesquisa de um cliente que utilizam o mesmo topK e parâmetros de pesquisa.</li>
<li>A construção do índice é suspensa quando chegam pedidos de pesquisa.</li>
<li>O Milvus pré-carrega automaticamente as colecções para a memória no início.</li>
<li>Vários dispositivos GPU podem ser atribuídos para acelerar a pesquisa de similaridade de vectores.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Métricas de distância</h3><p>O Milvus é uma base de dados de vectores criada para alimentar a pesquisa por semelhança de vectores. A plataforma foi criada com MLOps e aplicações de IA de nível de produção em mente. O Milvus suporta uma vasta gama de métricas de distância para calcular a semelhança, como a distância euclidiana (L2), o produto interno (IP), a distância Jaccard, Tanimoto, a distância Hamming, a superestrutura e a subestrutura. As duas últimas métricas são normalmente utilizadas na pesquisa molecular e na descoberta de novos fármacos através de IA.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Registo</h3><p>Milvus suporta rotação de logs. No ficheiro de configuração do sistema, milvus.yaml, é possível definir o tamanho de um único ficheiro de registo, o número de ficheiros de registo e a saída de registo para stdout.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Solução distribuída</h3><p>Mishards, um middleware de sharding Milvus, é a solução distribuída para Milvus Com um nó de escrita e um número ilimitado de nós de leitura, Mishards liberta o potencial computacional do cluster de servidores. As suas caraterísticas incluem encaminhamento de pedidos, divisão de leitura/escrita, escalonamento dinâmico/horizontal e muito mais.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Monitorização</h3><p>O Milvus é compatível com o Prometheus, um conjunto de ferramentas de monitorização de sistemas e alertas de código aberto. O Milvus adiciona suporte ao Pushgateway no Prometheus, possibilitando que o Prometheus adquira métricas de lote de curta duração. O sistema de monitoramento e alertas funciona da seguinte forma:</p>
<ul>
<li>O servidor Milvus envia dados de métricas personalizados para o Pushgateway.</li>
<li>O Pushgateway garante que os dados de métricas efémeras sejam enviados com segurança para o Prometheus.</li>
<li>O Prometheus continua a extrair dados do Pushgateway.</li>
<li>O Alertmanager é utilizado para definir o limiar de alerta para diferentes indicadores e enviar alertas por correio eletrónico ou mensagem.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Gestão de metadados</h3><p>Por defeito, o Milvus utiliza o SQLite para a gestão dos metadados. O SQLite está implementado no Milvus e não necessita de configuração. Num ambiente de produção, recomenda-se a utilização do MySQL para a gestão de metadados.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Participe na nossa comunidade de código aberto:</h3><ul>
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Ligue-se a nós no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
