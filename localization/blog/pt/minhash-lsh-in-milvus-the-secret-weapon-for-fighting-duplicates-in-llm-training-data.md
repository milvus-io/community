---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH em Milvus: A Arma Secreta para Combater Duplicados em Dados de
  Treino LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  O MinHash LSH no Milvus 2.6 oferece uma solução eficiente para a desduplicação
  de conjuntos de dados de treino LLM maciços, com um processamento 2x mais
  rápido e uma poupança de custos de 3 a 5 vezes em comparação com os métodos
  tradicionais.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Os modelos de linguagem de grande dimensão (LLM) transformaram o panorama da IA com a sua capacidade de escrever código, criar conteúdos e resolver problemas complexos. No entanto, estes modelos poderosos requerem enormes quantidades de dados de alta qualidade para alimentar a sua formação.</p>
<p>O desafio é que os dados de treino em bruto contêm frequentemente uma redundância significativa. É como ensinar uma criança repetindo as mesmas lições vezes sem conta, saltando outros tópicos importantes. Uma grande empresa de IA abordou-nos precisamente com este problema - estavam a construir um novo e ambicioso modelo linguístico, mas tinham dificuldade em desduplicar dezenas de milhares de milhões de documentos. Os métodos de correspondência tradicionais não conseguiam escalar para este volume e as ferramentas de desduplicação especializadas exigiam recursos computacionais enormes, tornando-as economicamente inviáveis.</p>
<p>Para resolver este problema, introduzimos a indexação MinHash LSH (Locality Sensitive Hashing) no Milvus 2.6. Este artigo explora a forma como o MinHash LSH resolve eficazmente o problema da desduplicação de dados para a formação LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Deduplicação de dados: Porque é que é importante para a formação LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Dados diversificados e de alta qualidade são essenciais para o treinamento de LLMs poderosos. Quando o conteúdo duplicado aparece nos dados de treinamento, ele cria vários problemas significativos:</p>
<ul>
<li><p><strong>Desperdício de recursos:</strong> Dados redundantes aumentam o tempo de treinamento, os custos e o consumo de energia.</p></li>
<li><p><strong>Desempenho reduzido:</strong> Os modelos podem se ajustar demais ao conteúdo repetido, limitando sua capacidade de generalizar para novas informações.</p></li>
<li><p><strong>Efeito de memorização:</strong> O conteúdo duplicado aumenta a hipótese de os modelos memorizarem e reproduzirem textualmente um texto específico. Também pode levar a fugas de privacidade ou problemas de direitos de autor.</p></li>
<li><p><strong>Avaliações enganosas:</strong> As duplicações entre conjuntos de treino e de teste podem inflacionar acidentalmente as métricas de desempenho.</p></li>
</ul>
<p>Existem três abordagens principais para encontrar e remover duplicados:</p>
<ul>
<li><p><strong>Correspondência exacta:</strong> Identifica duplicados idênticos através de hashing.</p></li>
<li><p><strong>Correspondência aproximada:</strong> encontra duplicatas próximas usando algoritmos como MinHash LSH e similaridade Jaccard.</p></li>
<li><p><strong>Correspondência semântica:</strong> Identifica conteúdo com significado semelhante usando embeddings vetoriais.</p></li>
</ul>
<p>Com corpora de pré-treino que atingem terabytes ou mesmo petabytes, os métodos tradicionais de correspondência exacta, como as comparações entre pares, são computacionalmente inviáveis. A deduplicação semântica acrescenta uma sobrecarga significativa ao utilizar modelos de incorporação para gerar vectores. Precisamos de métodos aproximados mais inovadores - como o <strong>MinHash LSH - que</strong>equilibrem a recuperação e a precisão, mantendo os custos gerenciáveis, tornando prática a deduplicação em grande escala.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: Detectando eficientemente quase duplicatas em conjuntos de dados massivos<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Para encontrar quase duplicatas em um oceano de dados de treinamento, precisamos de um algoritmo de correspondência aproximada que seja eficiente e preciso. O MinHash LSH (Locality Sensitive Hashing) é uma ótima ferramenta para esse objetivo. Vamos analisar este termo aparentemente complexo, passo a passo.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Passo 1: Representação de documentos com MinHash</h3><p>Primeiro, precisamos de uma maneira de medir a similaridade dos documentos. A abordagem padrão usa a similaridade Jaccard:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Esta fórmula mede a sobreposição entre o documento A e o documento B - especificamente, o rácio de elementos partilhados para o total de elementos únicos. Um valor mais alto significa que os documentos são mais semelhantes.</p>
<p>No entanto, calcular este valor diretamente para milhares de milhões de pares de documentos consome muitos recursos e demoraria anos. O MinHash cria "impressões digitais" compactas (assinaturas) que preservam as relações de semelhança e tornam as comparações muito mais rápidas.</p>
<ol>
<li><strong>Shingling:</strong> Divide cada documento em sequências sobrepostas de palavras ou caracteres (k-shingles). Por exemplo, a frase "Adoro pesquisa vetorial" com k=3 (por palavra) produz: {"I love vetor", "love vetor search"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> Aplique várias funções de hash a cada conjunto de shingles e registe o valor de hash mínimo de cada função. Isto resulta num vetor de assinatura para cada documento.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ao calcular a similaridade, a probabilidade de que os valores de hash se alinhem nas mesmas posições nas assinaturas MinHash de dois documentos (que corresponde à distância Jaccard dessas assinaturas) fornece uma aproximação da similaridade Jaccard de seus conjuntos de shingles originais. Isto permite-nos estimar eficazmente a semelhança entre documentos sem comparar diretamente os textos originais maiores; em vez disso, podemos analisar as suas assinaturas MinHash compactas.</p>
<p>O princípio MinHash envolve a utilização da palavra com o valor de hash mais pequeno para representar todo o documento, aumentando a precisão através da incorporação de funções de hash adicionais. É provável que as pequenas alterações de palavras não sejam tidas em conta, uma vez que normalmente não afectam o valor de hash mínimo. Em contrapartida, as alterações mais substanciais tendem a alterar o valor de hash e são mais facilmente detectadas. Este método pode ser visto como um min-pooling de valores de hash em várias palavras. Para além do MinHash, estão disponíveis alternativas como o SimHash para gerar assinaturas de documentos, mas estas não serão discutidas aqui.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Etapa 2: Identificando documentos similares via LSH</h3><p>Mesmo com assinaturas MinHash compactas, a comparação de cada par em milhões ou biliões de documentos continua a ser computacionalmente dispendiosa. É aí que entra o <strong>Locality Sensitive Hashing (LSH)</strong>.</p>
<p>A ideia principal do LSH é usar funções de hash que <strong>intencionalmente causam colisões -</strong>itens <strong>semelhantes</strong>têm maior probabilidade de fazer hash no mesmo bucket, enquanto itens diferentes não. Isto é o oposto do hashing tradicional, que tem como objetivo evitar colisões.</p>
<p>Para MinHash, uma estratégia LSH popular é a <strong>técnica de banding</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Dividir cada assinatura MinHash (um vetor de comprimento <em>N</em>) em <em>b</em> bandas, cada uma com <em>r</em> dims<em>(N = b × r</em>).</p></li>
<li><p><strong>Lavagem das bandas:</strong> Fazer o hash de cada banda (um sub-vetor de <em>r</em> valores) em um bucket usando uma função hash padrão.</p></li>
<li><p><strong>Pares candidatos:</strong> Se dois documentos partilham um balde em <strong>qualquer</strong> banda, são assinalados como potenciais pares.</p></li>
</ol>
<p>Ajustando o número de bandas (b) e o número de dimensões por banda ®, é possível controlar o compromisso entre a recuperação, a precisão e a eficiência da pesquisa.</p>
<p>A ideia principal é: documentos muito semelhantes terão muitos valores de hash correspondentes em suas assinaturas MinHash. Quando essas assinaturas são divididas em bandas, mesmo uma banda com todos os valores correspondentes é suficiente para colocar dois documentos no mesmo intervalo. Quanto mais semelhantes forem os documentos, maior será a probabilidade de que isso aconteça em pelo menos uma banda, permitindo que o LSH revele eficientemente os pares candidatos sem comparar exaustivamente todas as assinaturas.</p>
<p>Em suma, <strong>o MinHash + LSH</strong> permite uma desduplicação aproximada escalável: O MinHash comprime documentos em assinaturas compactas, e o LSH reduz eficientemente o espaço de pesquisa agrupando correspondências prováveis. É como encontrar gémeos no meio da multidão: primeiro, tire uma fotografia rápida de todas as pessoas (MinHash), agrupe os sósias (LSH) e, em seguida, inspeccione os grupos mais pequenos para detetar duplicados reais.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Integração do MinHash LSH no Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma necessidade do mundo real levou à integração do MinHash LSH no Milvus 2.6. Como mencionado anteriormente, um usuário do Milvus - uma das principais empresas de LLM - nos procurou com um desafio: deduplicar eficientemente grandes volumes de dados de texto para pré-treinamento de LLM.</p>
<p>Os pipelines de deduplicação tradicionais geralmente dependem de ferramentas externas desacopladas dos sistemas de armazenamento e recuperação, exigindo transferências de dados dispendiosas entre os componentes. Este fluxo de trabalho fragmentado aumenta a sobrecarga operacional e impede a utilização total dos recursos de computação distribuídos.</p>
<p>Reconhecendo os pontos fortes do Milvus no tratamento de dados vectoriais de elevado débito, surgiu uma ideia natural: <strong><em>E se o MinHash LSH fosse incorporado no Milvus de forma nativa, tornando a deduplicação aproximada uma caraterística de primeira classe da base de dados?</em></strong></p>
<p>Essa abordagem permite um fluxo de trabalho completo, desde a deduplicação até a recuperação semântica no Milvus, simplificando os MLOps e aproveitando sua escalabilidade e API unificada. Juntamente com o nosso parceiro, otimizamos o MinHash LSH para a arquitetura nativa da nuvem do Milvus, resultando em uma solução rápida e escalável para desduplicação em grande escala.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Os principais recursos do Milvus 2.6 incluem:</h3><ul>
<li><p><strong>Indexação nativa MinHash LSH:</strong> Implementa a técnica de bandas padrão para LSH e suporta a reclassificação Jaccard opcional para melhorar a recuperação. Fornece implementações na memória e baseadas em mmap para flexibilidade em diferentes cargas de trabalho.</p></li>
<li><p><strong>Integração perfeita com a API:</strong> Os utilizadores podem definir campos vectoriais MinHash, criar índices <code translate="no">MINHASH_LSH</code>, inserir dados de assinatura e efetuar pesquisas de semelhança aproximada utilizando o SDK padrão do Milvus e APIs declarativas.</p></li>
<li><p><strong>Distribuído e escalável:</strong> Construído na arquitetura nativa da nuvem do Milvus, o recurso suporta escalonamento horizontal para grandes conjuntos de dados e processamento de alto rendimento.</p></li>
</ul>
<p>Essa integração apresentou resultados impressionantes. Ao executar o MinHash LSH em Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) totalmente gerido, ajudámos este utilizador a desduplicar <strong>10 mil milhões de documentos</strong> de forma eficiente. Em comparação com a abordagem anterior baseada em MapReduce, a nova solução <strong>mais do que duplicou a velocidade de processamento</strong> e conseguiu <strong>poupanças de custos de 3-5 vezes</strong>, graças à indexação optimizada e à execução de consultas do Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Prática: Deduplicação de conjuntos de dados LLM usando o Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos arregaçar as mangas e usar o MinHash LSH no Milvus 2.6 para realizar a desduplicação aproximada em escala.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Pré-requisito: Gerando assinaturas MinHash</h3><p>O Milvus lida com a indexação e busca de assinaturas MinHash <strong>pré-geradas</strong>. Será necessário gerá-las durante o pré-processamento usando ferramentas como <code translate="no">datasketch</code> em Python ou uma implementação personalizada. Os passos típicos são:</p>
<ol>
<li><p>Ler documentos brutos</p></li>
<li><p>Shingle (tokenize ou chunk) cada documento</p></li>
<li><p>Aplicar várias funções hash para gerar uma assinatura MinHash (por exemplo, uma matriz uint64 de tamanho 128)</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Passo 1: Criar um esquema em Milvus</h3><p>Precisamos de criar uma coleção Milvus para armazenar as assinaturas MinHash e os seus IDs de documentos correspondentes.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Etapa 2: Criar o índice e a coleção MINHASH_LSH</strong></h3><p>Esta é a etapa principal. Precisamos especificar JACCARD como o tipo de métrica e configurar os parâmetros relacionados ao LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Uma nota sobre o ajuste dos parâmetros: A eficácia do MinHash LSH depende muito da escolha dos parâmetros. Por exemplo, o número de funções hash utilizadas durante a geração da assinatura MinHash (i.e., <code translate="no">MINHASH_DIM</code>) afecta a precisão e o tamanho da assinatura. Na fase LSH, o número de bandas (<code translate="no">num_bands</code>) e as linhas por banda determinam, em conjunto, o intervalo de sensibilidade do limiar de semelhança e o equilíbrio entre a recuperação e a precisão. Os utilizadores têm de experimentar e ajustar com base nas caraterísticas do seu conjunto de dados e nos requisitos de desduplicação. Este é frequentemente um processo iterativo.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Etapa 3: inserir assinaturas MinHash</strong></h3><p>Digamos que você tenha um lote de documentos e suas assinaturas MinHash correspondentes.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Etapa 5: Pesquisar quase duplicatas</h3><p>Utilize a assinatura MinHash de um documento para procurar documentos semelhantes na coleção.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Etapa 6: Pós-processamento e agrupamento</h3><p>Os resultados retornados são <strong>candidatos quase duplicados</strong>. Para formar grupos de deduplicação completos, é possível aplicar técnicas de clustering como <strong>Union-Find</strong> nos pares candidatos. Cada grupo resultante representa um conjunto de duplicados; mantenha um documento representativo e arquive ou remova os restantes.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Conclusão</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>O MinHash LSH no Milvus 2.6 é um salto em frente no processamento de dados de IA. O que começou como uma solução para deduplicação de dados LLM agora abre portas para casos de uso mais amplos - limpeza de conteúdo da Web, gerenciamento de catálogo, deteção de plágio e muito mais.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Introdução ao Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 já está disponível. Para além do MinHash LSH, apresenta dezenas de novas funcionalidades e optimizações de desempenho, como o armazenamento em camadas, o método de quantização RabbitQ e a pesquisa de texto completo melhorada e a multitenancy, abordando diretamente os desafios mais prementes da pesquisa vetorial atual: escalar de forma eficiente, mantendo os custos sob controlo.</p>
<p>Pronto para explorar tudo o que o Milvus oferece? Mergulhe nas nossas<a href="https://milvus.io/docs/release_notes.md"> notas de versão</a>, navegue na<a href="https://milvus.io/docs"> documentação completa</a> ou consulte os nossos<a href="https://milvus.io/blog"> blogues de funcionalidades</a>.</p>
<p>Se tiver alguma dúvida ou um caso de utilização semelhante, não hesite em contactar-nos através da nossa <a href="https://discord.com/invite/8uyFbECzPX">comunidade Discord</a> ou registar um problema no<a href="https://github.com/milvus-io/milvus"> GitHub</a> - estamos aqui para o ajudar a tirar o máximo partido do Milvus 2.6.</p>
