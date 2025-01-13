---
id: audio-retrieval-based-on-milvus.md
title: Tecnologias de processamento
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  A recuperação de áudio com Milvus permite classificar e analisar dados sonoros
  em tempo real.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Recuperação de áudio baseada em Milvus</custom-h1><p>O som é um tipo de dados denso em termos de informação. Embora possa parecer antiquado na era do conteúdo vídeo, o áudio continua a ser uma fonte de informação primária para muitas pessoas. Apesar do declínio de longo prazo no número de ouvintes, 83% dos americanos com 12 anos ou mais ouviram rádio terrestre (AM / FM) em uma determinada semana em 2020 (abaixo dos 89% em 2019). Por outro lado, o áudio online tem visto um aumento constante de ouvintes nas últimas duas décadas, com 62% dos americanos ouvindo alguma forma dele semanalmente, de acordo com o mesmo <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">estudo do Pew Research Center</a>.</p>
<p>Como uma onda, o som inclui quatro propriedades: frequência, amplitude, forma de onda e duração. Na terminologia musical, estas propriedades são designadas por altura, dinâmica, tom e duração. Os sons também ajudam os seres humanos e outros animais a perceber e compreender o nosso ambiente, fornecendo pistas contextuais para a localização e o movimento de objectos no nosso meio envolvente.</p>
<p>Como portador de informação, o áudio pode ser classificado em três categorias:</p>
<ol>
<li><strong>Fala:</strong> Um meio de comunicação composto por palavras e gramática. Com algoritmos de reconhecimento de voz, a fala pode ser convertida em texto.</li>
<li><strong>Música:</strong> Sons vocais e/ou instrumentais combinados para produzir uma composição composta por melodia, harmonia, ritmo e timbre. A música pode ser representada por uma partitura.</li>
<li><strong>Forma de onda:</strong> Um sinal de áudio digital obtido através da digitalização de sons analógicos. As formas de onda podem representar fala, música e sons naturais ou sintetizados.</li>
</ol>
<p>A recuperação de áudio pode ser utilizada para pesquisar e monitorizar os meios de comunicação em linha em tempo real, a fim de reprimir a violação dos direitos de propriedade intelectual. Assume também um papel importante na classificação e análise estatística de dados áudio.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Tecnologias de processamento<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>A fala, a música e outros sons genéricos têm caraterísticas únicas e exigem diferentes métodos de processamento. Normalmente, o áudio é separado em grupos que contêm fala e grupos que não a contêm:</p>
<ul>
<li>O áudio de fala é processado por reconhecimento automático de fala.</li>
<li>O áudio que não contém fala, incluindo áudio musical, efeitos sonoros e sinais de fala digitalizados, é processado através de sistemas de recuperação de áudio.</li>
</ul>
<p>Este artigo centra-se na utilização de um sistema de recuperação de áudio para processar dados de áudio que não sejam de fala. O reconhecimento da fala não é abordado neste artigo</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Extração de caraterísticas de áudio</h3><p>A extração de caraterísticas é a tecnologia mais importante nos sistemas de recuperação de áudio, uma vez que permite a pesquisa de semelhanças de áudio. Os métodos de extração de caraterísticas de áudio dividem-se em duas categorias:</p>
<ul>
<li>Modelos tradicionais de extração de caraterísticas de áudio, como os modelos de mistura gaussiana (GMM) e os modelos ocultos de Markov (HMM);</li>
<li>Modelos de extração de caraterísticas de áudio baseados na aprendizagem profunda, tais como redes neuronais recorrentes (RNN), redes de memória de curto prazo (LSTM), quadros de codificação-descodificação, mecanismos de atenção, etc.</li>
</ul>
<p>Os modelos baseados na aprendizagem profunda têm uma taxa de erro que é uma ordem de grandeza inferior à dos modelos tradicionais e, por conseguinte, estão a ganhar força como tecnologia de base no domínio do processamento de sinais de áudio.</p>
<p>Os dados de áudio são normalmente representados pelas caraterísticas de áudio extraídas. O processo de recuperação procura e compara estas caraterísticas e atributos em vez dos próprios dados áudio. Por conseguinte, a eficácia da recuperação da similaridade do áudio depende em grande medida da qualidade da extração das caraterísticas.</p>
<p>Neste artigo, <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">as redes neurais de áudio pré-treinadas em grande escala para o reconhecimento de padrões de áudio (PANNs)</a> são utilizadas para extrair vectores de caraterísticas com uma precisão média (mAP) de 0,439 (Hershey et al., 2017).</p>
<p>Depois de extrair os vectores de caraterísticas dos dados de áudio, podemos implementar uma análise de vectores de caraterísticas de alto desempenho utilizando o Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Pesquisa de similaridade de vectores</h3><p><a href="https://milvus.io/">O Milvus</a> é um banco de dados de vetores de código aberto e nativo da nuvem, criado para gerenciar vetores de incorporação gerados por modelos de aprendizado de máquina e redes neurais. É amplamente utilizado em cenários como visão computacional, processamento de linguagem natural, química computacional, sistemas de recomendação personalizados e muito mais.</p>
<p>O diagrama seguinte descreve o processo geral de pesquisa de semelhanças utilizando o Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>Os dados não estruturados são convertidos em vectores de caraterísticas por modelos de aprendizagem profunda e inseridos no Milvus.</li>
<li>O Milvus armazena e indexa estes vectores de caraterísticas.</li>
<li>Mediante pedido, o Milvus procura e devolve os vectores mais semelhantes ao vetor de consulta.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">Visão geral do sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de recuperação de áudio é composto principalmente por duas partes: inserção (linha preta) e pesquisa (linha vermelha).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>audio-retrieval-system.png</span> </span></p>
<p>O conjunto de dados de amostra utilizado neste projeto contém sons de jogos de código aberto, e o código está detalhado no <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">bootcamp do Milvus</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Passo 1: Inserir dados</h3><p>Abaixo está o código de exemplo para gerar áudio embeddings com o modelo de inferência PANNs pré-treinado e inseri-los no Milvus, que atribui um ID único a cada vetor embedding.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, os <strong>ids_milvus</strong> devolvidos são armazenados juntamente com outras informações relevantes (por exemplo, <strong>wav_name</strong>) para os dados de áudio mantidos numa base de dados MySQL para processamento subsequente.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Passo 2: Pesquisa de áudio</h3><p>O Milvus calcula a distância do produto interno entre os vectores de caraterísticas pré-armazenados e os vectores de caraterísticas de entrada, extraídos dos dados de áudio consultados utilizando o modelo de inferência PANNs, e devolve os <strong>ids_milvus</strong> de vectores de caraterísticas semelhantes, que correspondem aos dados de áudio pesquisados.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Referência e demonstração da API<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Este sistema de recuperação de áudio é construído com código-fonte aberto. As suas principais caraterísticas são a inserção e a eliminação de dados áudio. Todas as APIs podem ser visualizadas digitando <strong>127.0.0.1:<port></strong> /docs no navegador.</p>
<h3 id="Demo" class="common-anchor-header">Demonstração</h3><p>Alojamos online uma <a href="https://zilliz.com/solutions">demonstração em direto</a> do sistema de recuperação de áudio baseado no Milvus, que pode experimentar com os seus próprios dados de áudio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Vivendo na era dos grandes volumes de dados, as pessoas vêem as suas vidas repletas de todo o tipo de informação. Para a compreender melhor, a recuperação tradicional de texto já não é suficiente. Atualmente, a tecnologia de recuperação de informação necessita urgentemente da recuperação de vários tipos de dados não estruturados, como vídeos, imagens e áudio.</p>
<p>Os dados não estruturados, que são difíceis de processar pelos computadores, podem ser convertidos em vectores de caraterísticas utilizando modelos de aprendizagem profunda. Estes dados convertidos podem ser facilmente processados por máquinas, permitindo-nos analisar dados não estruturados de uma forma que os nossos antecessores nunca conseguiram. A Milvus, uma base de dados de vectores de código aberto, pode processar eficazmente os vectores de caraterísticas extraídos por modelos de IA e fornece uma variedade de cálculos comuns de semelhança de vectores.</p>
<h2 id="References" class="common-anchor-header">Referências<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. e Slaney, M., 2017, março. Arquiteturas CNN para classificação de áudio em grande escala. Em 2017, Conferência Internacional do IEEE sobre Acústica, Fala e Processamento de Sinais (ICASSP), pp. 131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Não seja um estranho<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Ligue-se a nós no <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
