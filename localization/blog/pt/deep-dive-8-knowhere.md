---
id: deep-dive-8-knowhere.md
title: O que permite a pesquisa por semelhança na base de dados vetorial Milvus?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'E não, não é o Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagem de capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/cydrain">Yudong Cai</a> e traduzido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Sendo o motor de execução vetorial principal, o Knowhere para o Milvus é o que um motor é para um carro desportivo. Esta publicação apresenta o que é o Knowhere, como é diferente do Faiss e como o código do Knowhere está estruturado.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">O conceito de Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere na arquitetura Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere vs Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Compreender o código do Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Adicionando índices ao Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">O conceito de Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Em termos gerais, o Knowhere é uma interface de operação para aceder a serviços nas camadas superiores do sistema e a bibliotecas de pesquisa de semelhanças vectoriais como o <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">o Hnswlib</a> e o <a href="https://github.com/spotify/annoy">Annoy</a> nas camadas inferiores do sistema. Além disso, o Knowhere é também responsável pela computação heterogénea. Mais concretamente, o Knowhere controla em que hardware (por exemplo, CPU ou GPU) executar a criação de índices e os pedidos de pesquisa. É assim que o Knowhere recebe o seu nome - saber onde executar as operações. Mais tipos de hardware, incluindo DPU e TPU, serão suportados em versões futuras.</p>
<p>Num sentido mais lato, o Knowhere também incorpora outras bibliotecas de índices de terceiros, como a Faiss. Por conseguinte, no seu conjunto, o Knowhere é reconhecido como o principal motor de cálculo vetorial da base de dados vetorial Milvus.</p>
<p>A partir do conceito de Knowhere, podemos ver que este apenas processa tarefas de computação de dados, enquanto tarefas como a fragmentação, o equilíbrio de carga e a recuperação de desastres estão fora do âmbito de trabalho do Knowhere.</p>
<p>A partir do Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">o Knowhere</a> (no sentido mais lato) torna-se independente do projeto Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere na arquitetura Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>arquitetura knowhere</span> </span></p>
<p>A computação em Milvus envolve principalmente operações vectoriais e escalares. A Knowhere apenas trata das operações sobre vectores em Milvus. A figura acima ilustra a arquitetura Knowhere em Milvus.</p>
<p>A camada mais baixa é o hardware do sistema. As bibliotecas de índice de terceiros estão na parte superior do hardware. Em seguida, o Knowhere interage com o nó de índice e o nó de consulta na parte superior através do CGO.</p>
<p>Este artigo fala sobre o Knowhere no seu sentido mais lato, conforme assinalado na moldura azul da ilustração da arquitetura.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere Vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>O Knowhere não só alarga as funções do Faiss como também optimiza o desempenho. Mais especificamente, o Knowhere tem as seguintes vantagens</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Suporte para BitsetView</h3><p>Inicialmente, o bitset foi introduzido no Milvus para efeitos de &quot;eliminação suave&quot;. Um vetor apagado suavemente continua a existir na base de dados, mas não será computado durante uma pesquisa ou consulta de semelhança de vectores. Cada bit no conjunto de bits corresponde a um vetor indexado. Se um vetor estiver marcado como "1" no conjunto de bits, significa que esse vetor foi eliminado de forma suave e não será envolvido durante uma pesquisa de vectores.</p>
<p>Os parâmetros do conjunto de bits são adicionados a todas as APIs de consulta de índice Faiss expostas no Knowhere, incluindo índices de CPU e GPU.</p>
<p>Saiba mais sobre <a href="https://milvus.io/blog/2022-2-14-bitset.md">como o bitset permite a versatilidade da pesquisa vetorial</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Suporte a mais métricas de similaridade para indexação de vetores binários</h3><p>Além de <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, o Knowhere também oferece suporte a <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superestrutura</a> e <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Subestrutura</a>. O Jaccard e o Tanimoto podem ser utilizados para medir a semelhança entre dois conjuntos de amostras, enquanto o Superstructure e o Substructure podem ser utilizados para medir a semelhança de estruturas químicas.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Suporte do conjunto de instruções AVX512</h3><p>O próprio Faiss suporta vários conjuntos de instruções, incluindo <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a> e <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. O Knowhere alarga ainda mais os conjuntos de instruções suportados, acrescentando <a href="https://en.wikipedia.org/wiki/AVX-512">o AVX512</a>, que pode <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">melhorar o desempenho da construção e consulta de índices em 20% a 30%</a> em comparação com o AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Seleção automática de instruções SIMD</h3><p>O Knowhere foi projetado para funcionar bem em um amplo espetro de processadores de CPU (plataformas locais e em nuvem) com diferentes instruções SIMD (por exemplo, SIMD SSE, AVX, AVX2 e AVX512). Assim, o desafio é, dado um único pedaço de binário de software (ou seja, Milvus), como fazer com que ele invoque automaticamente as instruções SIMD adequadas em qualquer processador de CPU? O Faiss não suporta a seleção automática de instruções SIMD e os utilizadores têm de especificar manualmente o sinalizador SIMD (por exemplo, "-msse4") durante a compilação. No entanto, o Knowhere é construído através da refacção da base de código do Faiss. As funções comuns (por exemplo, cálculo de semelhanças) que dependem de acelerações SIMD são eliminadas. Em seguida, para cada função, são implementadas quatro versões (ou seja, SSE, AVX, AVX2, AVX512) e cada uma é colocada num ficheiro fonte separado. Em seguida, os ficheiros de origem são compilados individualmente com o sinalizador SIMD correspondente. Por conseguinte, em tempo de execução, o Knowhere pode escolher automaticamente as instruções SIMD mais adequadas com base nas bandeiras actuais da CPU e ligar os ponteiros de função corretos utilizando o hooking.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Outras optimizações de desempenho</h3><p>Leia <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: um sistema de gerenciamento de dados vetoriais criado para fins específicos</a> para obter mais informações sobre a otimização de desempenho do Knowhere.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Entendendo o código Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Conforme mencionado na primeira seção, o Knowhere lida apenas com operações de pesquisa vetorial. Portanto, o Knowhere processa apenas o campo vetorial de uma entidade (atualmente, é suportado apenas um campo vetorial para entidades em uma coleção). A construção de índices e a pesquisa de semelhança de vectores também são direcionadas para o campo vetorial de um segmento. Para compreender melhor o modelo de dados, leia o blogue <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">aqui</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>campos de entidade</span> </span></p>
<h3 id="Index" class="common-anchor-header">Índice</h3><p>O índice é um tipo de estrutura de dados independente dos dados vectoriais originais. A indexação requer quatro etapas: criar um índice, treinar dados, inserir dados e construir um índice.</p>
<p>Para algumas das aplicações de IA, a formação do conjunto de dados é um processo individual da pesquisa de vectores. Neste tipo de aplicação, os dados dos conjuntos de dados são primeiro treinados e depois inseridos numa base de dados vetorial como o Milvus para pesquisa de semelhanças. Conjuntos de dados abertos como o sift1M e o sift1B fornecem dados para treino e teste. No entanto, no Knowhere, os dados para treino e pesquisa são misturados. Ou seja, o Knowhere treina todos os dados de um segmento e, em seguida, insere todos os dados treinados e cria um índice para eles.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Estrutura de código do Knowhere</h3><p>DataObj é a classe base de toda a estrutura de dados no Knowhere. <code translate="no">Size()</code> é o único método virtual em DataObj. A classe Index herda de DataObj com um campo chamado &quot;size_&quot;. A classe Index também tem dois métodos virtuais - <code translate="no">Serialize()</code> e <code translate="no">Load()</code>. A classe VecIndex derivada de Index é a classe base virtual para todos os índices vectoriais. VecIndex fornece métodos que incluem <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, e <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>classe de base</span> </span></p>
<p>Outros tipos de índices estão listados à direita na figura acima.</p>
<ul>
<li>O índice Faiss tem duas subclasses: FaissBaseIndex, para todos os índices em vectores de ponto flutuante, e FaissBaseBinaryIndex, para todos os índices em vectores binários.</li>
<li>GPUIndex é a classe base para todos os índices Faiss GPU.</li>
<li>OffsetBaseIndex é a classe de base para todos os índices desenvolvidos pelo próprio utilizador. Apenas o ID do vetor é armazenado no ficheiro de índice. Como resultado, o tamanho de um ficheiro de índice para vectores de 128 dimensões pode ser reduzido em 2 ordens de grandeza. Recomendamos que os vectores originais também sejam tidos em consideração quando se utiliza este tipo de índice para a pesquisa de semelhança de vectores.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Tecnicamente falando, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">o IDMAP</a> não é um índice, mas sim utilizado para pesquisa de força bruta. Quando os vectores são inseridos na base de dados de vectores, não é necessário treinar os dados nem criar um índice. As pesquisas serão realizadas diretamente nos dados vectoriais inseridos.</p>
<p>No entanto, por uma questão de coerência do código, o IDMAP também herda a classe VecIndex com todas as suas interfaces virtuais. A utilização do IDMAP é idêntica à dos outros índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Os índices IVF (inverted file) são os mais frequentemente utilizados. A classe IVF é derivada de VecIndex e FaissBaseIndex, e estende-se ainda a IVFSQ e IVFPQ. GPUIVF é derivada de GPUndex e IVF. Em seguida, GPUIVF estende-se ainda a GPUIVFSQ e GPUIVFPQ.</p>
<p>IVFSQHybrid é uma classe para índice híbrido auto-desenvolvido que é executado por quantização grosseira na GPU. E a pesquisa no balde é executada na CPU. Este tipo de índice pode reduzir a ocorrência de cópia de memória entre CPU e GPU, aproveitando o poder de computação da GPU. O IVFSQHybrid tem a mesma taxa de recuperação que o GPUIVFSQ, mas apresenta um melhor desempenho.</p>
<p>A estrutura da classe de base para índices binários é relativamente mais simples. BinaryIDMAP e BinaryIVF são derivados de FaissBaseBinaryIndex e VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>índice de terceiros</span> </span></p>
<p>Atualmente, apenas são suportados dois tipos de índices de terceiros para além do Faiss: o índice baseado em árvores Annoy e o índice baseado em gráficos HNSW. Estes dois índices de terceiros comuns e frequentemente utilizados são ambos derivados do VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Adicionar índices ao Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Se pretender adicionar novos índices ao Knowhere, pode consultar primeiro os índices existentes:</p>
<ul>
<li>Para adicionar um índice baseado em quantização, consulte IVF_FLAT.</li>
<li>Para adicionar um índice baseado em gráficos, consulte HNSW.</li>
<li>Para adicionar um índice baseado em árvore, consulte Annoy.</li>
</ul>
<p>Depois de consultar o índice existente, pode seguir os passos abaixo para adicionar um novo índice ao Knowhere.</p>
<ol>
<li>Adicione o nome do novo índice em <code translate="no">IndexEnum</code>. O tipo de dados é string.</li>
<li>Adicione uma verificação de validação de dados ao novo índice no ficheiro <code translate="no">ConfAdapter.cpp</code>. A verificação de validação destina-se principalmente a validar os parâmetros de formação e consulta de dados.</li>
<li>Crie um novo ficheiro para o novo índice. A classe de base do novo índice deve incluir <code translate="no">VecIndex</code>, e a interface virtual necessária de <code translate="no">VecIndex</code>.</li>
<li>Adicione a lógica de construção do índice para o novo índice em <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Adicione o teste de unidade no diretório <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Sobre a série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código-fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visão geral da arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs e SDKs Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestão de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta em tempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de execução escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de execução vetorial</a></li>
</ul>
