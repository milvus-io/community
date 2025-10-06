---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: >-
  De Word2Vec a LLM2Vec: Como escolher o modelo de incorporação correto para o
  RAG
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  Este blogue explica-lhe como avaliar as incorporações na prática, para que
  possa escolher a melhor opção para o seu sistema RAG.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>Os modelos de linguagem de grande dimensão são poderosos, mas têm uma fraqueza bem conhecida: as alucinações. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">A Geração Aumentada por Recuperação (RAG)</a> é uma das formas mais eficazes de resolver este problema. Em vez de se basear apenas na memória do modelo, o RAG recupera conhecimentos relevantes de uma fonte externa e incorpora-os na pergunta, garantindo que as respostas são baseadas em dados reais.</p>
<p>Um sistema RAG é normalmente constituído por três componentes principais: o próprio LLM, uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a>, como o <a href="https://milvus.io/">Milvus</a>, para armazenar e pesquisar informações, e um modelo de incorporação. O modelo de incorporação é o que converte a linguagem humana em vectores legíveis por máquina. Pense nele como o tradutor entre a linguagem natural e a base de dados. A qualidade deste tradutor determina a relevância do contexto recuperado. Se for bem feito, os utilizadores verão respostas precisas e úteis. Se o fizer mal, até a melhor infraestrutura produz ruído, erros e desperdício de computação.</p>
<p>É por isso que é tão importante compreender os modelos de incorporação. Há muitos por onde escolher - desde métodos antigos como o Word2Vec até modelos modernos baseados em LLM, como a família de incorporação de texto da OpenAI. Cada um tem as suas próprias vantagens e desvantagens. Este guia vai acabar com a confusão e mostrar-lhe como avaliar os embeddings na prática, para que possa escolher o mais adequado para o seu sistema RAG.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">O que são embeddings e porque é que são importantes?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao nível mais simples, os embeddings transformam a linguagem humana em números que as máquinas podem compreender. Cada palavra, frase ou documento é mapeado num espaço vetorial de elevada dimensão, onde a distância entre vectores capta as relações entre eles. Os textos com significados semelhantes tendem a agrupar-se, enquanto os conteúdos não relacionados tendem a afastar-se. É isto que torna possível a pesquisa semântica - encontrar significado e não apenas palavras-chave correspondentes.</p>
<p>Os modelos de incorporação não funcionam todos da mesma forma. Geralmente, dividem-se em três categorias, cada uma com pontos fortes e desvantagens:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Os vectores esparsos</strong></a> (como o BM25) centram-se na frequência das palavras-chave e no comprimento dos documentos. São óptimos para correspondências explícitas, mas não têm em conta os sinónimos e o contexto - "IA" e "inteligência artificial" não teriam qualquer relação.</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Os vectores densos</strong></a> (como os produzidos pelo BERT) captam uma semântica mais profunda. Conseguem ver que "Apple lança novo telemóvel" está relacionado com "lançamento do produto iPhone", mesmo sem palavras-chave partilhadas. A desvantagem é um custo computacional mais elevado e uma menor capacidade de interpretação.</p></li>
<li><p><strong>Os modelos híbridos</strong> (como o BGE-M3) combinam as duas coisas. Podem gerar representações esparsas, densas ou multi-vectoriais em simultâneo - preservando a precisão da pesquisa por palavra-chave e captando simultaneamente as nuances semânticas.</p></li>
</ul>
<p>Na prática, a escolha depende do caso de utilização: vectores esparsos para velocidade e transparência, densos para um significado mais rico e híbridos quando se pretende o melhor dos dois mundos.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Oito factores-chave para avaliar modelos de incorporação<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 Janela de contexto</strong></h3><p>A <a href="https://zilliz.com/glossary/context-window"><strong>janela de contexto</strong></a> determina a quantidade de texto que um modelo pode processar de uma só vez. Uma vez que um token equivale a cerca de 0,75 palavras, este número limita diretamente a extensão de uma passagem que o modelo pode "ver" ao criar as incorporações. Uma janela grande permite ao modelo captar todo o significado de documentos mais longos; uma janela pequena obriga-o a cortar o texto em pedaços mais pequenos, arriscando a perda de contexto significativo.</p>
<p>Por exemplo, o <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>text-embedding-ada-002</em></a> da OpenAI suporta até 8.192 tokens - o suficiente para cobrir um artigo de investigação completo, incluindo resumo, métodos e conclusão. Por outro lado, os modelos com janelas de apenas 512 tokens (como <em>m3e-base</em>) exigem truncamento frequente, o que pode resultar na perda de detalhes importantes.</p>
<p>A conclusão: se o seu caso de utilização envolver documentos longos, como processos judiciais ou artigos académicos, escolha um modelo com uma janela de mais de 8K tokens. Para textos mais curtos, como chats de suporte ao cliente, uma janela de token de 2K pode ser suficiente.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">Unidade de Tokenização<strong>#2</strong> </h3><p>Antes de serem gerados os embeddings, o texto tem de ser dividido em pedaços mais pequenos chamados <strong>tokens</strong>. A forma como esta tokenização acontece afecta a forma como o modelo lida com palavras raras, termos profissionais e domínios especializados.</p>
<ul>
<li><p><strong>Subword tokenization (BPE):</strong> Divide as palavras em partes mais pequenas (por exemplo, "unhappiness" → "un" + "happiness"). Este é o padrão em LLMs modernos como GPT e LLaMA, e funciona bem para palavras fora do vocabulário.</p></li>
<li><p><strong>WordPiece:</strong> Um refinamento do BPE usado pelo BERT, projetado para equilibrar melhor a cobertura do vocabulário com a eficiência.</p></li>
<li><p><strong>Tokenização ao nível da palavra:</strong> Divide apenas por palavras inteiras. É simples, mas tem dificuldades com terminologia rara ou complexa, o que a torna inadequada para domínios técnicos.</p></li>
</ul>
<p>Para domínios especializados como a medicina ou o direito, os modelos baseados em subpalavras são geralmente os melhores - podem tratar corretamente termos como <em>enfarte do miocárdio</em> ou <em>sub-rogação</em>. Alguns modelos modernos, como o <strong>NV-Embed</strong>, vão mais longe, adicionando melhorias como camadas de atenção latente, que melhoram a forma como a tokenização capta vocabulário complexo e específico do domínio.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 Dimensionalidade</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>A dimensionalidade do vetor</strong></a> refere-se ao comprimento do vetor de incorporação, que determina a quantidade de detalhes semânticos que um modelo pode captar. Dimensões mais elevadas (por exemplo, 1.536 ou mais) permitem distinções mais finas entre conceitos, mas têm o custo de maior armazenamento, consultas mais lentas e requisitos de computação mais elevados. As dimensões inferiores (como 768) são mais rápidas e mais baratas, mas correm o risco de perder um significado subtil.</p>
<p>A chave é o equilíbrio. Para a maioria das aplicações de uso geral, as dimensões 768-1.536 são a combinação certa de eficiência e precisão. Para tarefas que exigem elevada precisão - como pesquisas académicas ou científicas - pode valer a pena ir além das 2000 dimensões. Por outro lado, os sistemas com recursos limitados (como as implementações de ponta) podem utilizar 512 dimensões de forma eficaz, desde que a qualidade da recuperação seja validada. Em alguns sistemas leves de recomendação ou personalização, até mesmo dimensões menores podem ser suficientes.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 Tamanho do vocabulário</h3><p>O <strong>tamanho</strong> do <strong>vocabulário</strong> de um modelo refere-se ao número de tokens únicos que o seu tokenizador pode reconhecer. Isto tem um impacto direto na sua capacidade de lidar com diferentes idiomas e terminologia específica do domínio. Se uma palavra ou carácter não constar do vocabulário, é marcado como <code translate="no">[UNK]</code>, o que pode causar a perda de significado.</p>
<p>Os requisitos variam consoante o caso de utilização. Os cenários multilingues necessitam geralmente de vocabulários maiores - da ordem dos 50k+ tokens, como no caso da <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. Para aplicações específicas de um domínio, a cobertura de termos especializados é mais importante. Por exemplo, um modelo jurídico deve suportar nativamente termos como <em>&quot;estatuto de limitações&quot;</em> ou <em>&quot;aquisição de boa-fé</em>&quot;, enquanto um modelo chinês deve ter em conta milhares de caracteres e pontuação única. Sem uma cobertura de vocabulário suficiente, a exatidão da incorporação é rapidamente afetada.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 Dados de treino</h3><p><strong>Os dados de treino</strong> definem os limites do que um modelo de incorporação "sabe". Os modelos treinados em dados amplos e de uso geral - como o <em>text-embedding-ada-002</em>, que utiliza uma mistura de páginas Web, livros e Wikipedia - tendem a ter um bom desempenho em vários domínios. Mas quando é necessária precisão em campos especializados, os modelos treinados no domínio ganham frequentemente. Por exemplo, o <em>LegalBERT</em> e <em>o BioBERT</em> superam os modelos gerais em textos jurídicos e biomédicos, embora percam alguma capacidade de generalização.</p>
<p>A regra geral:</p>
<ul>
<li><p><strong>Cenários gerais</strong> → utilizar modelos treinados em conjuntos de dados alargados, mas garantir que abrangem o(s) idioma(s) de destino. Por exemplo, as aplicações chinesas necessitam de modelos treinados em corpora chineses ricos.</p></li>
<li><p><strong>Domínios verticais</strong> → escolha modelos específicos do domínio para obter a melhor precisão.</p></li>
<li><p><strong>O melhor dos dois mundos</strong> → modelos mais recentes como o <strong>NV-Embed</strong>, treinados em duas fases com dados gerais e específicos do domínio, mostram ganhos promissores na generalização <em>e</em> precisão do domínio.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 Custo</h3><p>O custo não tem apenas a ver com o preço da API - tem a ver com o <strong>custo económico</strong> e <strong>o custo computacional</strong>. Os modelos de API alojadas, como os da OpenAI, baseiam-se na utilização: o utilizador paga por chamada, mas não se preocupa com a infraestrutura. Isto torna-os perfeitos para prototipagem rápida, projectos-piloto ou cargas de trabalho de pequena a média escala.</p>
<p>As opções de código aberto, como o <em>BGE</em> ou o <em>Sentence-BERT</em>, são de utilização gratuita, mas requerem uma infraestrutura auto-gerida, normalmente clusters de GPU ou TPU. São mais adequadas para a produção em grande escala, onde as poupanças a longo prazo e a flexibilidade compensam os custos únicos de configuração e manutenção.</p>
<p>A conclusão prática: <strong>Os modelos de API são ideais para iteração rápida</strong>, enquanto <strong>os modelos de código aberto geralmente ganham na produção em larga escala</strong>, uma vez que você considera o custo total de propriedade (TCO). A escolha do caminho certo depende da necessidade de rapidez no mercado ou de controlo a longo prazo.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 Pontuação MTEB</h3><p>O <a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a> é o padrão mais utilizado para comparar modelos de incorporação. Ele avalia o desempenho em várias tarefas, incluindo pesquisa semântica, classificação, agrupamento e outras. Uma pontuação mais elevada significa geralmente que o modelo tem uma maior capacidade de generalização em diferentes tipos de tarefas.</p>
<p>Dito isto, o MTEB não é uma solução milagrosa. Um modelo com uma pontuação geral elevada pode ter um desempenho inferior no seu caso de utilização específico. Por exemplo, um modelo treinado principalmente em inglês pode ter um bom desempenho em benchmarks MTEB, mas ter dificuldades com textos médicos especializados ou dados que não sejam em inglês. A abordagem segura é utilizar o MTEB como ponto de partida e depois validá-lo com os <strong>seus próprios conjuntos de dados</strong> antes de se comprometer.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 Especificidade do domínio</h3><p>Alguns modelos são criados especificamente para cenários específicos e brilham onde os modelos gerais ficam aquém:</p>
<ul>
<li><p><strong>Jurídico:</strong> <em>O LegalBERT</em> consegue distinguir termos jurídicos de pormenor, como <em>defesa</em> versus <em>jurisdição</em>.</p></li>
<li><p><strong>Biomédico:</strong> <em>O BioBERT</em> lida com precisão com expressões técnicas como <em>mRNA</em> ou <em>terapia direcionada</em>.</p></li>
<li><p><strong>Multilingue:</strong> <em>O BGE-M3</em> suporta mais de 100 idiomas, o que o torna adequado para aplicações globais que requerem a ligação entre inglês, chinês e outros idiomas.</p></li>
<li><p><strong>Recuperação de código:</strong> <em>O Qwen3-Embedding</em> atinge pontuações de topo (81.0+) no <em>MTEB-Code</em>, optimizado para consultas relacionadas com programação.</p></li>
</ul>
<p>Se o seu caso de utilização se enquadra num destes domínios, os modelos optimizados para o domínio podem melhorar significativamente a precisão da recuperação. Mas para aplicações mais amplas, opte por modelos de uso geral, a menos que os seus testes mostrem o contrário.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Perspectivas adicionais para avaliação de Embeddings<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além dos oito factores principais, existem alguns outros ângulos que vale a pena considerar se pretender uma avaliação mais profunda:</p>
<ul>
<li><p><strong>Alinhamento multilingue</strong>: Para os modelos multilingues, não é suficiente suportar simplesmente muitas línguas. O verdadeiro teste é saber se os espaços vectoriais estão alinhados. Por outras palavras, as palavras semanticamente idênticas - digamos "cat" em inglês e "gato" em espanhol - estão próximas umas das outras no espaço vetorial? Um alinhamento forte garante uma recuperação consistente em várias línguas.</p></li>
<li><p><strong>Testes adversários</strong>: Um bom modelo de incorporação deve ser estável com pequenas alterações na entrada. Introduzindo frases quase idênticas (por exemplo, "O gato sentou-se no tapete" vs. "O gato sentou-se no tapete"), pode testar se os vectores resultantes se deslocam razoavelmente ou se flutuam descontroladamente. Grandes oscilações indicam frequentemente uma robustez fraca.</p></li>
<li><p><strong>A coerência semântica local</strong> refere-se ao fenómeno que consiste em testar se as palavras semanticamente semelhantes se agrupam fortemente em vizinhanças locais. Por exemplo, dada uma palavra como "banco", o modelo deve agrupar termos relacionados (como "margem do rio" e "instituição financeira") de forma adequada, mantendo os termos não relacionados à distância. Medir a frequência com que palavras "intrusivas" ou irrelevantes se infiltram nestas vizinhanças ajuda a comparar a qualidade do modelo.</p></li>
</ul>
<p>Estas perspectivas nem sempre são necessárias para o trabalho quotidiano, mas são úteis para testar os embeddings em sistemas de produção onde a estabilidade multilingue, de alta precisão ou adversária é realmente importante.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Modelos de incorporação comuns: Uma breve história<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>A história dos modelos de incorporação é, na verdade, a história de como as máquinas aprenderam a compreender a linguagem mais profundamente ao longo do tempo. Cada geração ultrapassou os limites da geração anterior - passando de representações estáticas de palavras para os actuais modelos de linguagem de grande dimensão (LLM) que conseguem captar o contexto com nuances.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: O ponto de partida (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">O Word2Vec da Google</a> foi o primeiro avanço que tornou os embeddings amplamente práticos. Baseou-se na <em>hipótese distributiva</em> da linguística - a ideia de que as palavras que aparecem em contextos semelhantes partilham frequentemente o mesmo significado. Ao analisar grandes quantidades de texto, o Word2Vec mapeou as palavras num espaço vetorial onde os termos relacionados estavam próximos uns dos outros. Por exemplo, "puma" e "leopardo" agrupavam-se nas proximidades graças aos seus habitats e caraterísticas de caça comuns.</p>
<p>O Word2Vec estava disponível em duas versões:</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words):</strong> prevê uma palavra em falta a partir do seu contexto envolvente.</p></li>
<li><p><strong>Skip-Gram:</strong> faz o inverso - prevê palavras circundantes a partir de uma palavra-alvo.</p></li>
</ul>
<p>Esta abordagem simples mas poderosa permitiu analogias elegantes como:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Na altura, o Word2Vec foi revolucionário. Mas tinha duas limitações significativas. Primeiro, era <strong>estático</strong>: cada palavra tinha apenas um vetor, por isso "banco" significava a mesma coisa quer estivesse perto de "dinheiro" ou "rio". Em segundo lugar, só funcionava ao <strong>nível da palavra</strong>, deixando frases e documentos fora do seu alcance.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT: A Revolução dos Transformadores (2018)</h3><p>Se o Word2Vec nos deu o primeiro mapa de significado, <a href="https://zilliz.com/learn/what-is-bert"><strong>o BERT (Bidirectional Encoder Representations from Transformers)</strong></a> redesenhou-o com muito mais pormenor. Lançado pela Google em 2018, o BERT marcou o início da era da <em>compreensão semântica profunda</em> ao introduzir a arquitetura Transformer nos embeddings. Ao contrário dos LSTMs anteriores, os Transformers podem examinar todas as palavras de uma sequência simultaneamente e em ambas as direcções, permitindo um contexto muito mais rico.</p>
<p>A magia do BERT veio de duas tarefas inteligentes de pré-treino:</p>
<ul>
<li><p><strong>Modelação de linguagem mascarada (MLM):</strong> Esconde aleatoriamente palavras numa frase e força o modelo a prevê-las, ensinando-o a inferir o significado a partir do contexto.</p></li>
<li><p><strong>Previsão da frase seguinte (NSP):</strong> Treina o modelo para decidir se duas frases se seguem uma à outra, ajudando-o a aprender as relações entre frases.</p></li>
</ul>
<p>Nos bastidores, os vectores de entrada do BERT combinavam três elementos: token embeddings (a palavra em si), segment embeddings (a que frase pertence) e position embeddings (onde se situa na sequência). Juntos, estes elementos deram ao BERT a capacidade de captar relações semânticas complexas, tanto ao nível da <strong>frase</strong> como <strong>do documento</strong>. Este salto tornou o BERT o mais avançado para tarefas como a resposta a perguntas e a pesquisa semântica.</p>
<p>Claro que o BERT não era perfeito. As suas primeiras versões estavam limitadas a uma <strong>janela de 512 tokens</strong>, o que significava que documentos longos tinham de ser cortados e, por vezes, perdiam significado. Os seus vectores densos também careciam de interpretabilidade - podia-se ver dois textos a coincidir, mas nem sempre se explicava porquê. As variantes posteriores, como o <strong>RoBERTa</strong>, abandonaram a tarefa NSP depois de a investigação ter demonstrado que acrescentava poucos benefícios, mantendo a poderosa formação MLM.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: Fusão de esparsos e densos (2023)</h3><p>Em 2023, o campo tinha amadurecido o suficiente para reconhecer que nenhum método de incorporação único poderia realizar tudo. Entra em cena o <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), um modelo híbrido explicitamente concebido para tarefas de recuperação. A sua principal inovação é que não produz apenas um tipo de vetor - gera vectores densos, vectores esparsos e multi-vectores de uma só vez, combinando os seus pontos fortes.</p>
<ul>
<li><p><strong>Os vectores dens</strong> os captam a semântica profunda, lidando com sinónimos e paráfrases (por exemplo, "lançamento do iPhone", ≈ "Apple lança novo telemóvel").</p></li>
<li><p><strong>Os vectores esparsos</strong> atribuem pesos explícitos aos termos. Mesmo que uma palavra-chave não apareça, o modelo pode inferir a relevância - por exemplo, associando "novo produto iPhone" a "Apple Inc." e "smartphone".</p></li>
<li><p><strong>Os multi-vectores</strong> refinam ainda mais os embeddings densos, permitindo que cada token contribua com a sua própria pontuação de interação, o que é útil para uma recuperação mais fina.</p></li>
</ul>
<p>O pipeline de formação do BGE-M3 reflecte esta sofisticação:</p>
<ol>
<li><p><strong>Pré-treino</strong> em dados maciços não rotulados com <em>RetroMAE</em> (codificador mascarado + descodificador de reconstrução) para construir uma compreensão semântica geral.</p></li>
<li><p><strong>Afinação geral</strong> utilizando aprendizagem contrastiva em 100 milhões de pares de textos, melhorando o seu desempenho de recuperação.</p></li>
<li><p>Afinação<strong>de tarefas</strong> com afinação de instruções e amostragem negativa complexa para otimização específica do cenário.</p></li>
</ol>
<p>Os resultados são impressionantes: O BGE-M3 lida com várias granularidades (desde o nível da palavra até ao nível do documento), oferece um forte desempenho multilingue - especialmente em chinês - e equilibra a precisão com a eficiência melhor do que a maioria dos seus pares. Na prática, representa um grande passo em frente na construção de modelos de incorporação que são simultaneamente poderosos e práticos para a recuperação em grande escala.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">LLMs como modelos de incorporação (2023-presente)</h3><p>Durante anos, a sabedoria prevalecente era que os modelos de linguagem de grande porte (LLMs) somente decodificadores, como o GPT, não eram adequados para embeddings. Pensava-se que a sua atenção causal - que apenas olha para os tokens anteriores - limitava a compreensão semântica profunda. Mas a investigação recente inverteu esse pressuposto. Com os ajustes certos, os LLMs podem gerar embeddings que rivalizam, e por vezes ultrapassam, os modelos criados para o efeito. Dois exemplos notáveis são o LLM2Vec e o NV-Embed.</p>
<p><strong>O LLM2Vec</strong> adapta LLMs só de descodificador com três alterações fundamentais:</p>
<ul>
<li><p><strong>Conversão da atenção bidirecional</strong>: substituição das máscaras causais para que cada token possa atender à sequência completa.</p></li>
<li><p><strong>Previsão do próximo token com máscara (MNTP):</strong> um novo objetivo de treino que incentiva a compreensão bidirecional.</p></li>
<li><p><strong>Aprendizagem contrastiva não supervisionada:</strong> inspirada no SimCSE, aproxima frases semanticamente semelhantes no espaço vetorial.</p></li>
</ul>
<p><strong>O NV-Embed</strong>, por sua vez, adopta uma abordagem mais simplificada:</p>
<ul>
<li><p><strong>Camadas de atenção latente:</strong> adiciona "matrizes latentes" treináveis para melhorar o agrupamento de sequências.</p></li>
<li><p><strong>Formação bidirecional direta:</strong> basta remover as máscaras causais e afinar com a aprendizagem contrastiva.</p></li>
<li><p><strong>Otimização do agrupamento médio:</strong> utiliza médias ponderadas entre tokens para evitar o "viés do último token".</p></li>
</ul>
<p>O resultado é que os embeddings modernos baseados em LLM combinam <strong>uma compreensão semântica profunda</strong> com <strong>escalabilidade</strong>. Podem lidar com <strong>janelas de contexto muito longas (8K-32K tokens)</strong>, o que os torna especialmente fortes para tarefas com muitos documentos em investigação, direito ou pesquisa empresarial. E porque reutilizam a mesma espinha dorsal do LLM, podem por vezes fornecer embeddings de alta qualidade mesmo em ambientes mais restritos.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Conclusão: Transformar a teoria em prática<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando se trata de escolher um modelo de incorporação, a teoria só nos leva até certo ponto. O verdadeiro teste é o seu desempenho no <em>seu</em> sistema com os <em>seus</em> dados. Algumas etapas práticas podem fazer a diferença entre um modelo que parece bom no papel e um que realmente funciona na produção:</p>
<ul>
<li><p><strong>Selecionar com subconjuntos de MTEB.</strong> Utilizar benchmarks, especialmente tarefas de recuperação, para criar uma lista inicial de candidatos.</p></li>
<li><p><strong>Testar com dados comerciais reais.</strong> Crie conjuntos de avaliação a partir dos seus próprios documentos para medir a recuperação, a precisão e a latência em condições reais.</p></li>
<li><p><strong>Verifique a compatibilidade da base de dados.</strong> Os vectores esparsos requerem suporte de índice invertido, enquanto os vectores densos de alta dimensão exigem mais armazenamento e computação. Certifique-se de que a sua base de dados de vectores pode acomodar a sua escolha.</p></li>
<li><p><strong>Tratar documentos longos de forma inteligente.</strong> Utilize estratégias de segmentação, como janelas deslizantes, para obter eficiência, e combine-as com modelos de janelas de contexto amplo para preservar o significado.</p></li>
</ul>
<p>Desde os simples vectores estáticos do Word2Vec até aos embeddings do LLM com 32K contextos, temos visto grandes avanços na forma como as máquinas compreendem a linguagem. Mas aqui está a lição que todos os programadores acabam por aprender: o modelo <em>com maior pontuação</em> nem sempre é o <em>melhor</em> modelo para o seu caso de utilização.</p>
<p>No final do dia, os utilizadores não querem saber de tabelas de classificação MTEB ou gráficos de referência - apenas querem encontrar a informação certa, rapidamente. Escolha o modelo que equilibra precisão, custo e compatibilidade com o seu sistema e terá construído algo que não impressiona apenas na teoria, mas que funciona verdadeiramente no mundo real.</p>
