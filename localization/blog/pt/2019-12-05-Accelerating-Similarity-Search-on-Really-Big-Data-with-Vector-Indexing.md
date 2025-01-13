---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Aceleração da pesquisa por semelhança em dados realmente grandes com indexação
  de vectores
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Sem a indexação vetorial, muitas aplicações modernas de IA seriam
  impossivelmente lentas. Saiba como selecionar o índice certo para a sua
  próxima aplicação de aprendizagem automática.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Acelerando a pesquisa de similaridade em dados realmente grandes com indexação vetorial</custom-h1><p>Da visão computacional à descoberta de novos medicamentos, os mecanismos de pesquisa de similaridade de vetores alimentam muitas aplicações populares de inteligência artificial (IA). Um grande componente do que torna possível consultar com eficiência os conjuntos de dados de milhões, bilhões ou até trilhões de vetores dos quais os mecanismos de pesquisa de similaridade dependem é a indexação, um processo de organização de dados que acelera drasticamente a pesquisa de Big Data. Este artigo aborda o papel que a indexação desempenha na eficiência da pesquisa de similaridade de vectores, os diferentes tipos de índices de ficheiros invertidos de vectores (IVF) e conselhos sobre qual o índice a utilizar em diferentes cenários.</p>
<p><strong>Ir para:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetor</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">Como é que a indexação de vectores acelera a pesquisa por semelhança e a aprendizagem automática?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Quais são os diferentes tipos de índices IVF e para que cenários são mais adequados?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Bom para pesquisar conjuntos de dados relativamente pequenos (à escala de um milhão) quando é necessária uma recuperação de 100%.</a><ul>
<li><a href="#flat-performance-test-results">Resultados do teste de desempenho do FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Resultados do teste de tempo de consulta para o índice FLAT em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Principais conclusões:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Melhora a velocidade em detrimento da precisão (e vice-versa).</a><ul>
<li><a href="#ivf_flat-performance-test-results">Resultados do teste de desempenho do IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Resultados do teste de tempo de consulta para o índice IVF_FLAT em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Principais conclusões:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Resultados do teste de taxa de recuperação para o índice IVF_FLAT em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Principais conclusões:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: Mais rápido e com menos consumo de recursos do que o IVF_FLAT, mas também menos preciso.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">Resultados do teste de desempenho do IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Resultados do teste de tempo de consulta para o índice IVF_SQ8 em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Principais conclusões:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Resultados do teste de taxa de recuperação para o índice IVF_SQ8 em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Principais conclusões:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: nova abordagem híbrida GPU/CPU que é ainda mais rápida que o IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Resultados do teste de desempenho do IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Resultados do teste de tempo de consulta para o índice IVF_SQ8H em Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Principais conclusões:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Saiba mais sobre o Milvus, uma plataforma de gerenciamento de dados vetoriais em grande escala.</a></li>
<li><a href="#methodology">Metodologia</a><ul>
<li><a href="#performance-testing-environment">Ambiente de teste de desempenho</a></li>
<li><a href="#relevant-technical-concepts">Conceitos técnicos relevantes</a></li>
<li><a href="#resources">Recursos</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">Como é que a indexação vetorial acelera a pesquisa por semelhança e a aprendizagem automática?</h3><p>Os motores de pesquisa de semelhanças funcionam comparando uma entrada com uma base de dados para encontrar objectos que sejam mais semelhantes à entrada. A indexação é o processo de organização eficiente de dados e desempenha um papel importante na utilidade da pesquisa por similaridade, acelerando drasticamente as consultas demoradas em grandes conjuntos de dados. Depois de um enorme conjunto de dados vectoriais ser indexado, as consultas podem ser encaminhadas para clusters, ou subconjuntos de dados, que têm maior probabilidade de conter vectores semelhantes a uma consulta de entrada. Na prática, isto significa que um certo grau de precisão é sacrificado para acelerar as consultas em dados vectoriais realmente grandes.</p>
<p>Pode ser feita uma analogia com um dicionário, onde as palavras são ordenadas alfabeticamente. Ao procurar uma palavra, é possível navegar rapidamente para uma secção que contém apenas palavras com a mesma inicial - acelerando drasticamente a procura da definição da palavra introduzida.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Quais são os diferentes tipos de índices de FIV e para que cenários são mais adequados?</h3><p>Existem vários índices concebidos para a pesquisa de semelhança de vectores de alta dimensão, e cada um deles tem desvantagens em termos de desempenho, precisão e requisitos de armazenamento. Este artigo aborda vários tipos de índices FIV comuns, seus pontos fortes e fracos, bem como resultados de testes de desempenho para cada tipo de índice. Os testes de desempenho quantificam o tempo de consulta e as taxas de recuperação para cada tipo de índice no <a href="https://milvus.io/">Milvus</a>, uma plataforma de gestão de dados vectoriais de código aberto. Para mais informações sobre o ambiente de teste, consulte a secção de metodologia no final deste artigo.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Bom para pesquisar conjuntos de dados relativamente pequenos (escala de milhões) quando é necessária uma recuperação de 100%.</h3><p>Para aplicações de pesquisa de similaridade de vectores que requerem uma precisão perfeita e dependem de conjuntos de dados relativamente pequenos (à escala de um milhão), o índice FLAT é uma boa escolha. O FLAT não comprime vectores e é o único índice que pode garantir resultados de pesquisa exactos. Os resultados do FLAT também podem ser usados como um ponto de comparação para resultados produzidos por outros índices que têm menos de 100% de recuperação.</p>
<p>O FLAT é exato porque adopta uma abordagem exaustiva à pesquisa, o que significa que, para cada consulta, a entrada de destino é comparada com todos os vectores de um conjunto de dados. Isso torna o FLAT o índice mais lento da nossa lista e pouco adequado para consultar dados vetoriais maciços. Não há parâmetros para o índice FLAT no Milvus, e usá-lo não requer treinamento de dados ou armazenamento adicional.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Resultados do teste de desempenho do FLAT:</h4><p>O teste de desempenho do tempo de consulta FLAT foi realizado em Milvus usando um conjunto de dados composto por 2 milhões de vetores de 128 dimensões.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetor_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>À medida que nq (o número de vetores de destino para uma consulta) aumenta, o tempo de consulta aumenta.</li>
<li>Usando o índice FLAT em Milvus, podemos ver que o tempo de consulta aumenta acentuadamente quando nq excede 200.</li>
<li>Em geral, o índice FLAT é mais rápido e mais consistente ao executar o Milvus na GPU em comparação com a CPU. No entanto, as consultas FLAT na CPU são mais rápidas quando nq está abaixo de 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Melhora a velocidade à custa da precisão (e vice-versa).</h3><p>Uma forma comum de acelerar o processo de pesquisa de similaridade em detrimento da precisão é realizar uma pesquisa de vizinho mais próximo aproximado (ANN). Os algoritmos ANN reduzem os requisitos de armazenamento e a carga de cálculo agrupando vectores semelhantes, o que resulta numa pesquisa de vectores mais rápida. O IVF_FLAT é o tipo de índice de ficheiro invertido mais básico e baseia-se numa forma de pesquisa ANN.</p>
<p>O IVF_FLAT divide os dados vetoriais em um número de unidades de cluster (nlist) e, em seguida, compara as distâncias entre o vetor de entrada de destino e o centro de cada cluster. Dependendo do número de clusters que o sistema está definido para consultar (nprobe), os resultados da pesquisa de semelhança são devolvidos com base em comparações entre a entrada de destino e os vectores apenas no(s) cluster(s) mais semelhante(s) - reduzindo drasticamente o tempo de consulta.</p>
<p>Ao ajustar nprobe, é possível encontrar um equilíbrio ideal entre precisão e velocidade para um determinado cenário. Os resultados do nosso teste de desempenho IVF_FLAT demonstram que o tempo de consulta aumenta drasticamente à medida que o número de vectores de entrada alvo (nq) e o número de clusters a pesquisar (nprobe) aumentam. O IVF_FLAT não comprime os dados vectoriais; no entanto, os ficheiros de índice incluem metadados que aumentam marginalmente os requisitos de armazenamento em comparação com o conjunto de dados vectoriais brutos não indexados.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Resultados do teste de desempenho do IVF_FLAT:</h4><p>O teste de desempenho do tempo de consulta do IVF_FLAT foi realizado no Milvus utilizando o conjunto de dados SIFT 1B público, que contém mil milhões de vectores de 128 dimensões.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetor_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>Ao executar na CPU, o tempo de consulta para o índice IVF_FLAT no Milvus aumenta com nprobe e nq. Isso significa que quanto mais vetores de entrada uma consulta contiver, ou quanto mais clusters uma consulta pesquisar, maior será o tempo de consulta.</li>
<li>Na GPU, o índice mostra menos variação de tempo em relação às alterações em nq e nprobe. Isso ocorre porque os dados do índice são grandes, e a cópia de dados da memória da CPU para a memória da GPU é responsável pela maior parte do tempo total da consulta.</li>
<li>Em todos os cenários, exceto quando nq = 1.000 e nprobe = 32, o índice IVF_FLAT é mais eficiente quando executado na CPU.</li>
</ul>
<p>O teste de desempenho de recuperação do IVF_FLAT foi realizado no Milvus utilizando o conjunto de dados público 1M SIFT, que contém 1 milhão de vectores de 128 dimensões, e o conjunto de dados glove-200-angular, que contém mais de 1 milhão de vectores de 200 dimensões, para a construção do índice (nlist = 16 384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetores_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>O índice IVF_FLAT pode ser otimizado para precisão, alcançando uma taxa de recuperação acima de 0,99 no conjunto de dados SIFT de 1M quando nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: Mais rápido e com menos consumo de recursos do que o IVF_FLAT, mas também menos preciso.</h3><p>O IVF_FLAT não executa qualquer compressão, pelo que os ficheiros de índice que produz têm aproximadamente o mesmo tamanho que os dados vectoriais originais não indexados. Por exemplo, se o conjunto de dados 1B SIFT original tiver 476 GB, os seus ficheiros de índice IVF_FLAT serão ligeiramente maiores (~470 GB). Carregar todos os ficheiros de índice na memória consumirá 470 GB de armazenamento.</p>
<p>Quando os recursos de memória do disco, CPU ou GPU são limitados, o IVF_SQ8 é uma opção melhor do que o IVF_FLAT. Este tipo de índice pode converter cada FLOAT (4 bytes) em UINT8 (1 byte) efectuando a quantização escalar. Isto reduz o consumo de memória do disco, CPU e GPU em 70-75%. Para o conjunto de dados 1B SIFT, os ficheiros de índice IVF_SQ8 requerem apenas 140 GB de armazenamento.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Resultados do teste de desempenho do IVF_SQ8:</h4><p>O teste do tempo de consulta do IVF_SQ8 foi realizado no Milvus utilizando o conjunto de dados público 1B SIFT, que contém mil milhões de vectores de 128 dimensões, para a criação de índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetor_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>Ao reduzir o tamanho do arquivo de índice, o IVF_SQ8 oferece melhorias significativas de desempenho em relação ao IVF_FLAT. O IVF_SQ8 segue uma curva de desempenho semelhante ao IVF_FLAT, com o tempo de consulta aumentando com nq e nprobe.</li>
<li>Semelhante ao IVF_FLAT, o IVF_SQ8 apresenta um desempenho mais rápido quando executado na CPU e quando nq e nprobe são menores.</li>
</ul>
<p>O teste de desempenho de rechamada do IVF_SQ8 foi realizado no Milvus usando o conjunto de dados público 1M SIFT, que contém 1 milhão de vetores de 128 dimensões, e o conjunto de dados glove-200-angular, que contém mais de 1 milhão de vetores de 200 dimensões, para a construção do índice (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetores_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>Apesar de compactar os dados originais, o IVF_SQ8 não vê uma diminuição significativa na precisão da consulta. Em várias configurações do nprobe, o IVF_SQ8 tem, no máximo, uma taxa de recuperação 1% menor do que o IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: Nova abordagem híbrida GPU/CPU que é ainda mais rápida que o IVF_SQ8.</h3><p>O IVF_SQ8H é um novo tipo de índice que melhora o desempenho da consulta em comparação com o IVF_SQ8. Quando um índice IVF_SQ8 em execução na CPU é consultado, a maior parte do tempo total da consulta é gasto para encontrar os clusters nprobe mais próximos do vetor de entrada de destino. Para reduzir o tempo de consulta, o IVF_SQ8 copia os dados para operações de quantização grosseira, que são mais pequenos do que os ficheiros de índice, para a memória da GPU - acelerando consideravelmente as operações de quantização grosseira. Em seguida, o gpu_search_threshold determina qual o dispositivo que executa a consulta. Quando nq &gt;= gpu_search_threshold, a GPU executa a consulta; caso contrário, a CPU executa a consulta.</p>
<p>IVF_SQ8H é um tipo de índice híbrido que requer que a CPU e a GPU trabalhem em conjunto. Ele só pode ser usado com o Milvus habilitado para GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Resultados do teste de desempenho do IVF_SQ8H:</h4><p>O teste de desempenho do tempo de consulta IVF_SQ8H foi realizado no Milvus usando o conjunto de dados SIFT 1B público, que contém 1 bilhão de vetores de 128 dimensões, para a criação do índice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação de vetor_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principais conclusões:</h4><ul>
<li>Quando nq é menor ou igual a 1.000, o IVF_SQ8H apresenta tempos de consulta quase duas vezes mais rápidos que o IVFSQ8.</li>
<li>Quando nq = 2000, os tempos de consulta para IVFSQ8H e IVF_SQ8 são os mesmos. No entanto, se o parâmetro gpu_search_threshold for menor que 2000, o IVF_SQ8H terá um desempenho melhor que o IVF_SQ8.</li>
<li>A taxa de recuperação de consulta do IVF_SQ8H é idêntica à do IVF_SQ8, o que significa que é obtido menos tempo de consulta sem perda na precisão da pesquisa.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Saiba mais sobre o Milvus, uma plataforma de gestão de dados vectoriais em grande escala.</h3><p>O Milvus é uma plataforma de gerenciamento de dados vetoriais que pode potencializar aplicativos de pesquisa de similaridade em campos que abrangem inteligência artificial, aprendizado profundo, cálculos vetoriais tradicionais e muito mais. Para obter informações adicionais sobre o Milvus, consulte os seguintes recursos:</p>
<ul>
<li>O Milvus está disponível sob uma licença de código aberto no <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>Tipos de índices adicionais, incluindo índices baseados em gráficos e árvores, são compatíveis com o Milvus. Para obter uma lista abrangente dos tipos de índice suportados, consulte <a href="https://milvus.io/docs/v0.11.0/index.md">a documentação para índices vetoriais</a> no Milvus.</li>
<li>Para saber mais sobre a empresa que lançou o Milvus, visite <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Converse com a comunidade Milvus ou obtenha ajuda com um problema no <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Metodologia</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Ambiente de teste de desempenho</h4><p>A configuração do servidor usada nos testes de desempenho mencionados neste artigo é a seguinte:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 núcleos</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB de memória</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Conceitos técnicos relevantes</h4><p>Embora não seja necessário para entender este artigo, aqui estão alguns conceitos técnicos que são úteis para interpretar os resultados dos nossos testes de desempenho de índice:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Acelerando a pesquisa de similaridade em dados realmente grandes com indexação vetorial_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Recursos</h4><p>As seguintes fontes foram usadas para este artigo:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Encyclopedia of database systems</a>", Ling Liu e M. Tamer Özsu.</li>
</ul>
