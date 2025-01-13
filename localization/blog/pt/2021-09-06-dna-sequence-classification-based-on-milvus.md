---
id: dna-sequence-classification-based-on-milvus.md
title: Classificação da sequência de ADN com base em Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Utilize Milvus, uma base de dados de vectores de código aberto, para
  reconhecer famílias de genes de sequências de ADN. Menos espaço mas maior
  precisão.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Classificação de sequências de ADN com base em Milvus</custom-h1><blockquote>
<p>Autora: Mengjia Gu, engenheira de dados na Zilliz, licenciou-se na Universidade McGill com um mestrado em Estudos da Informação. Os seus interesses incluem aplicações de IA e pesquisa de semelhanças em bases de dados vectoriais. Como membro da comunidade do projeto de código aberto Milvus, forneceu e melhorou várias soluções, como o sistema de recomendação e o modelo de classificação de sequências de ADN. Gosta de desafios e nunca desiste!</p>
</blockquote>
<custom-h1>Introdução</custom-h1><p>A sequência de ADN é um conceito popular tanto na investigação académica como em aplicações práticas, como a rastreabilidade de genes, a identificação de espécies e o diagnóstico de doenças. Considerando que todas as indústrias anseiam por um método de investigação mais inteligente e eficiente, a inteligência artificial tem atraído muita atenção, especialmente nos domínios biológico e médico. Cada vez mais cientistas e investigadores estão a contribuir para a aprendizagem automática e a aprendizagem profunda em bioinformática. Para tornar os resultados experimentais mais convincentes, uma opção comum é aumentar o tamanho da amostra. A colaboração com grandes volumes de dados no domínio da genómica também traz mais possibilidades de casos de utilização na realidade. No entanto, o alinhamento tradicional de sequências tem limitações que o tornam <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">inadequado para grandes volumes de dados</a>. Para reduzir as desvantagens na realidade, a vectorização é uma boa opção para um grande conjunto de dados de sequências de ADN.</p>
<p>A base de dados de vectores de código aberto <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> é adequada para dados maciços. É capaz de armazenar vectores de sequências de ácidos nucleicos e efetuar uma recuperação altamente eficiente. Pode também ajudar a reduzir o custo de produção ou de investigação. O sistema de classificação de sequências de ADN baseado no Milvus demora apenas milissegundos a efetuar a classificação dos genes. Além disso, apresenta uma maior precisão do que outros classificadores comuns na aprendizagem automática.</p>
<custom-h1>Processamento de dados</custom-h1><p>Um gene que codifica informação genética é constituído por uma pequena secção de sequências de ADN, que consiste em 4 bases de nucleótidos [A, C, G, T]. Existem cerca de 30.000 genes no genoma humano, quase 3 mil milhões de pares de bases de ADN, e cada par de bases tem 2 bases correspondentes. Para poderem ser utilizadas para diversos fins, as sequências de ADN podem ser classificadas em várias categorias. Para reduzir o custo e facilitar a utilização de dados de sequências de ADN longas, <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">o k-mer </a>é introduzido no pré-processamento de dados. Entretanto, torna os dados de sequências de ADN mais semelhantes a texto simples. Além disso, os dados vectorizados podem acelerar o cálculo na análise de dados ou na aprendizagem automática.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>O método k-mer é normalmente utilizado no pré-processamento de sequências de ADN. Extrai uma pequena secção de comprimento k a partir de cada base da sequência original, convertendo assim uma sequência longa de comprimento s em (s-k+1) sequências curtas de comprimento k. Ajustar o valor de k melhorará o desempenho do modelo. As listas de sequências curtas são mais fáceis para a leitura de dados, extração de caraterísticas e vectorização.</p>
<p><strong>Vectorização</strong></p>
<p>As sequências de ADN são vectorizadas sob a forma de texto. Uma sequência transformada por k-mer torna-se uma lista de sequências curtas, que se assemelha a uma lista de palavras individuais numa frase. Por conseguinte, a maioria dos modelos de processamento de linguagem natural deve funcionar também para dados de sequências de ADN. Podem ser aplicadas metodologias semelhantes à formação de modelos, à extração de caraterísticas e à codificação. Uma vez que cada modelo tem as suas próprias vantagens e desvantagens, a seleção de modelos depende da caraterística dos dados e do objetivo da investigação. Por exemplo, o CountVectorizer, um modelo de saco de palavras, implementa a extração de caraterísticas através de uma tokenização simples. Não estabelece limites para o comprimento dos dados, mas o resultado obtido é menos óbvio em termos de comparação de semelhanças.</p>
<custom-h1>Demonstração do Milvus</custom-h1><p>O Milvus pode gerir facilmente dados não estruturados e recuperar os resultados mais semelhantes entre triliões de vectores num prazo médio de milissegundos. A sua pesquisa de semelhanças baseia-se no algoritmo de pesquisa ANN (Approximate Nearest Neighbor). Estas caraterísticas fazem do Milvus uma excelente opção para gerir vectores de sequências de ADN, promovendo assim o desenvolvimento e as aplicações da bioinformática.</p>
<p>Aqui está uma demonstração que mostra como construir um sistema de classificação de sequências de ADN com o Milvus. O <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">conjunto de dados experimentais </a>inclui 3 organismos e 7 famílias de genes. Todos os dados são convertidos em listas de sequências curtas por k-mers. Com um modelo CountVectorizer pré-treinado, o sistema codifica os dados das sequências em vectores. O fluxograma abaixo mostra a estrutura do sistema e os processos de inserção e pesquisa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Experimente esta demonstração no <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">bootcamp de Milvus</a>.</p>
<p>No Milvus, o sistema cria uma coleção e insere os vectores correspondentes de sequências de ADN na coleção (ou na partição, se esta estiver activada). Quando recebe um pedido de consulta, o Milvus devolve as distâncias entre o vetor da sequência de ADN de entrada e os resultados mais semelhantes na base de dados. A classe da sequência de entrada e a semelhança entre as sequências de ADN podem ser determinadas pelas distâncias dos vectores nos resultados.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Classificação das sequências</strong>de ADN A pesquisa das sequências de ADN mais semelhantes no Milvus pode implicar a família de genes de uma amostra desconhecida, permitindo assim conhecer a sua possível funcionalidade.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> Se uma sequência for classificada como GPCRs, então provavelmente tem influência nas funções do corpo. </a>Nesta demonstração, o Milvus permitiu ao sistema identificar com êxito as famílias de genes das sequências de ADN humano pesquisadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>Similaridade genética</strong></p>
<p>A similaridade média das sequências de ADN entre organismos ilustra a proximidade entre os seus genomas. A demonstração procura nos dados humanos as sequências de ADN mais semelhantes às do chimpanzé e do cão, respetivamente. Em seguida, calcula e compara as distâncias médias do produto interno (0,97 para o chimpanzé e 0,70 para o cão), o que prova que o chimpanzé partilha mais genes semelhantes com o ser humano do que o cão. Com dados mais complexos e conceção de sistema, o Milvus é capaz de apoiar a investigação genética mesmo a um nível mais elevado.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Desempenho</strong></p>
<p>A demonstração treina o modelo de classificação com 80% de dados de amostras humanas (3629 no total) e utiliza os restantes como dados de teste. Compara o desempenho do modelo de classificação da sequência de ADN que utiliza o Milvus com o modelo alimentado por Mysql e 5 classificadores populares de aprendizagem automática. O modelo baseado no Milvus supera os seus homólogos em termos de precisão.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>Exploração adicional</custom-h1><p>Com o desenvolvimento da tecnologia de grandes volumes de dados, a vectorização da sequência de ADN desempenhará um papel mais importante na investigação e na prática genéticas. Em combinação com os conhecimentos profissionais em bioinformática, os estudos relacionados podem beneficiar ainda mais do envolvimento da vectorização da sequência de ADN. Por conseguinte, o Milvus pode apresentar melhores resultados na prática. De acordo com diferentes cenários e necessidades dos utilizadores, a pesquisa de semelhanças e o cálculo de distâncias com Milvus apresentam um grande potencial e muitas possibilidades.</p>
<ul>
<li><strong>Estudar sequências desconhecidas</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">De acordo com alguns investigadores, a vectorização pode comprimir dados de sequências de ADN.</a> Ao mesmo tempo, requer menos esforço para estudar a estrutura, função e evolução de sequências de ADN desconhecidas. O Milvus pode armazenar e recuperar um grande número de vectores de sequências de ADN sem perder a precisão.</li>
<li><strong>Adaptar dispositivos</strong>: Limitada pelos algoritmos tradicionais de alinhamento de sequências, a pesquisa por semelhança mal pode beneficiar da melhoria dos dispositivos<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>). O Milvus, que suporta tanto a computação regular da CPU como a aceleração da GPU, resolve este problema com o algoritmo do vizinho mais próximo aproximado.</li>
<li><strong>Detetar vírus e rastrear origens</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">Os cientistas compararam as sequências genómicas e indicaram que o vírus COVID19, provavelmente originário de morcegos, pertence ao SARS-COV</a>. Com base nesta conclusão, os investigadores podem expandir o tamanho da amostra para obter mais provas e padrões.</li>
<li><strong>Diagnosticar doenças</strong>: Em termos clínicos, os médicos podem comparar sequências de ADN entre pacientes e grupos saudáveis para identificar genes variantes que causam doenças. É possível extrair caraterísticas e codificar estes dados utilizando algoritmos adequados. O Milvus é capaz de devolver distâncias entre vectores, que podem ser relacionadas com dados de doenças. Para além de ajudar no diagnóstico de doenças, esta aplicação pode também ajudar a inspirar o estudo de <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">terapias específicas</a>.</li>
</ul>
<custom-h1>Saiba mais sobre o Milvus</custom-h1><p>O Milvus é uma ferramenta poderosa capaz de alimentar um vasto conjunto de aplicações de inteligência artificial e de pesquisa de semelhanças vectoriais. Para saber mais sobre o projeto, consulte os seguintes recursos:</p>
<ul>
<li>Leia o nosso <a href="https://milvus.io/blog">blogue</a>.</li>
<li>Interagir com a nossa comunidade de código aberto no <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Utilize ou contribua para a base de dados de vectores mais popular do mundo no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Teste e implemente rapidamente aplicações de IA com o nosso novo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
