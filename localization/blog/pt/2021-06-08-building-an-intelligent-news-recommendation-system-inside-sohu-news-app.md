---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Recomendação de conteúdos utilizando a pesquisa vetorial semântica
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Saiba como o Milvus foi utilizado para criar um sistema inteligente de
  recomendação de notícias dentro de uma aplicação.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Criando um sistema inteligente de recomendação de notícias dentro do aplicativo Sohu News</custom-h1><p>Com <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71% dos americanos</a> a obterem as suas recomendações de notícias a partir de plataformas sociais, o conteúdo personalizado tornou-se rapidamente a forma como os novos meios de comunicação são descobertos. Quer as pessoas estejam a procurar tópicos específicos ou a interagir com conteúdos recomendados, tudo o que os utilizadores vêem é optimizado por algoritmos para melhorar as taxas de cliques (CTR), o envolvimento e a relevância. A Sohu é um grupo chinês de media, vídeo, pesquisa e jogos online cotado na NASDAQ. Utilizou a <a href="https://milvus.io/">Milvus</a>, uma base de dados vetorial de código aberto criada pela <a href="https://zilliz.com/">Zilliz</a>, para criar um motor de pesquisa vetorial semântico na sua aplicação de notícias. Este artigo explica como a empresa utilizou perfis de utilizador para afinar as recomendações de conteúdos personalizados ao longo do tempo, melhorando a experiência e o envolvimento do utilizador.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Recomendação de conteúdos utilizando a pesquisa vetorial semântica<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Os perfis de utilizador da Sohu News são criados a partir do histórico de navegação e ajustados à medida que os utilizadores procuram e interagem com o conteúdo das notícias. O sistema de recomendação da Sohu utiliza a pesquisa vetorial semântica para encontrar artigos noticiosos relevantes. O sistema funciona identificando um conjunto de etiquetas que se espera serem do interesse de cada utilizador com base no histórico de navegação. Em seguida, procura rapidamente artigos relevantes e ordena os resultados por popularidade (medida pela CTR média), antes de os apresentar aos utilizadores.</p>
<p>Só o New York Times publica <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 peças de conteúdo</a> por dia, o que dá uma ideia da magnitude do novo conteúdo que um sistema de recomendação eficaz deve ser capaz de processar. A ingestão de grandes volumes de notícias exige pesquisa de similaridade em milissegundos e correspondência horária de tags com novos conteúdos. A Sohu escolheu o Milvus porque processa conjuntos de dados maciços de forma eficiente e precisa, reduz a utilização de memória durante a pesquisa e suporta implementações de elevado desempenho.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Compreender o fluxo de trabalho de um sistema de recomendação de notícias<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>A recomendação de conteúdos baseada na pesquisa vetorial semântica da Sohu baseia-se no Modelo Semântico Estruturado Profundo (DSSM), que utiliza duas redes neurais para representar as consultas dos utilizadores e os artigos de notícias como vectores. O modelo calcula a semelhança de cosseno dos dois vectores semânticos e, em seguida, o lote de notícias mais semelhante é enviado para o conjunto de candidatos à recomendação. Em seguida, os artigos de notícias são classificados com base na sua CTR estimada, e aqueles com a taxa de cliques mais elevada prevista são apresentados aos utilizadores.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Codificação de artigos de notícias em vectores semânticos com o BERT-as-service</h3><p>Para codificar artigos de notícias em vectores semânticos, o sistema utiliza a ferramenta <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Se a contagem de palavras de qualquer conteúdo exceder 512 ao utilizar este modelo, ocorre uma perda de informação durante o processo de incorporação. Para ajudar a ultrapassar este problema, o sistema começa por extrair um resumo e codifica-o num vetor semântico de 768 dimensões. Em seguida, são extraídos os dois tópicos mais relevantes de cada artigo de notícias e os correspondentes vectores de tópicos pré-treinados (200 dimensões) são identificados com base na ID do tópico. Em seguida, os vectores de tópicos são unidos ao vetor semântico de 768 dimensões extraído do resumo do artigo, formando um vetor semântico de 968 dimensões.</p>
<p>A Kafta recebe continuamente novos conteúdos, que são convertidos em vectores semânticos antes de serem inseridos na base de dados Milvus.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Extração de etiquetas semanticamente semelhantes a partir de perfis de utilizadores com o BERT-as-service</h3><p>A outra rede neural do modelo é o vetor semântico do utilizador. As etiquetas semanticamente semelhantes (por exemplo, coronavírus, covid, COVID-19, pandemia, nova estirpe, pneumonia) são extraídas dos perfis dos utilizadores com base em interesses, consultas de pesquisa e histórico de navegação. A lista de etiquetas adquiridas é ordenada por peso e as 200 primeiras são divididas em diferentes grupos semânticos. As permutações das etiquetas dentro de cada grupo semântico são utilizadas para gerar novas frases de etiquetas, que são depois codificadas em vectores semânticos através do BERT-as-service</p>
<p>Para cada perfil de utilizador, os conjuntos de frases com etiquetas têm um <a href="https://github.com/baidu/Familia">conjunto correspondente de tópicos</a> que são marcados por um peso que indica o nível de interesse de um utilizador. Os dois tópicos mais importantes de todos os tópicos relevantes são selecionados e codificados pelo modelo de aprendizagem automática (ML) para serem unidos no vetor semântico da etiqueta correspondente, formando um vetor semântico do utilizador de 968 dimensões. Mesmo que o sistema gere as mesmas etiquetas para diferentes utilizadores, os diferentes pesos das etiquetas e dos tópicos correspondentes, bem como a variação explícita entre os vectores de tópicos de cada utilizador, garantem que as recomendações são únicas</p>
<p>O sistema é capaz de fazer recomendações de notícias personalizadas calculando a semelhança de cosseno dos vectores semânticos extraídos dos perfis de utilizador e dos artigos de notícias.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Cálculo de novos vectores semânticos de perfis de utilizador e sua inserção no Milvus</h3><p>Os vectores semânticos do perfil do utilizador são calculados diariamente, com os dados do período de 24 horas anterior processados na noite seguinte. Os vectores são inseridos no Milvus individualmente e passam pelo processo de consulta para fornecer resultados noticiosos relevantes aos utilizadores. O conteúdo das notícias é inerentemente atual, exigindo que o cálculo seja executado de hora a hora para gerar um newsfeed atual que contenha conteúdo com uma elevada taxa de cliques prevista e que seja relevante para os utilizadores. O conteúdo das notícias também é classificado em partições por data, e as notícias antigas são eliminadas diariamente.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Diminuição do tempo de extração de vectores semânticos de dias para horas</h3><p>A recuperação de conteúdos utilizando vectores semânticos requer a conversão diária de dezenas de milhões de frases de etiqueta em vectores semânticos. Trata-se de um processo moroso que demoraria dias a concluir, mesmo quando executado em unidades de processamento gráfico (GPU), que aceleram este tipo de computação. Para ultrapassar este problema técnico, os vectores semânticos da incorporação anterior devem ser optimizados de modo a que, quando surgem frases com etiquetas semelhantes, os vectores semânticos correspondentes sejam diretamente recuperados.</p>
<p>O vetor semântico do conjunto de frases com etiquetas existente é armazenado e um novo conjunto de frases com etiquetas gerado diariamente é codificado em vectores MinHash. <a href="https://milvus.io/docs/v1.1.1/metric.md">A distância de Jaccard</a> é utilizada para calcular a semelhança entre o vetor MinHash da nova frase de etiqueta e o vetor de frases de etiqueta guardado. Se a distância Jaccard exceder um limiar predefinido, os dois conjuntos são considerados semelhantes. Se o limiar de semelhança for atingido, as novas frases podem tirar partido das informações semânticas das incorporações anteriores. Os testes sugerem que uma distância superior a 0,8 deve garantir uma precisão suficiente para a maioria das situações.</p>
<p>Através deste processo, a conversão diária das dezenas de milhões de vectores acima referidos é reduzida de dias para cerca de duas horas. Embora outros métodos de armazenamento de vectores semânticos possam ser mais apropriados, dependendo dos requisitos específicos do projeto, o cálculo da semelhança entre duas frases de etiqueta utilizando a distância Jaccard numa base de dados Milvus continua a ser um método eficiente e preciso numa grande variedade de cenários.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Ultrapassar os "maus casos" da classificação de textos curtos<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao classificar um texto noticioso, os artigos noticiosos curtos têm menos caraterísticas para extração do que os mais longos. Por este motivo, os algoritmos de classificação falham quando conteúdos de diferentes comprimentos são submetidos ao mesmo classificador. O Milvus ajuda a resolver este problema procurando várias informações de classificação de textos longos com semântica semelhante e pontuações fiáveis, utilizando depois um mecanismo de votação para modificar a classificação de textos curtos.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Identificação e resolução de erros de classificação de textos curtos</h3><p>A classificação exacta de cada artigo noticioso é crucial para fornecer recomendações de conteúdo úteis. Uma vez que os artigos noticiosos curtos têm menos caraterísticas, a aplicação do mesmo classificador a notícias com diferentes durações resulta numa taxa de erro mais elevada para a classificação de textos curtos. A rotulagem humana é demasiado lenta e imprecisa para esta tarefa, pelo que o BERT-as-service e o Milvus são utilizados para identificar rapidamente textos curtos mal classificados em lotes, reclassificá-los corretamente e, em seguida, utilizar lotes de dados como corpus para treino contra este problema.</p>
<p>O BERT-as-service é utilizado para codificar um número total de cinco milhões de artigos noticiosos longos com uma pontuação do classificador superior a 0,9 em vectores semânticos. Depois de inserir os artigos de texto longo no Milvus, as notícias de texto curto são codificadas em vectores semânticos. Cada vetor semântico de notícias curtas é utilizado para consultar a base de dados Milvus e obter os 20 principais artigos de notícias longas com a maior semelhança de cosseno com as notícias curtas visadas. Se 18 das 20 notícias longas semanticamente mais semelhantes parecerem estar na mesma classificação e esta for diferente da das notícias curtas consultadas, então a classificação das notícias curtas é considerada incorrecta e deve ser ajustada para se alinhar com os 18 artigos de notícias longas.</p>
<p>Este processo identifica e corrige rapidamente classificações incorrectas de textos curtos. As estatísticas de amostragem aleatória mostram que, após a correção das classificações de textos curtos, a precisão global da classificação de textos excede os 95%. Ao aproveitar a classificação de textos longos de elevada confiança para corrigir a classificação de textos curtos, a maioria dos casos de má classificação é corrigida num curto espaço de tempo. Isto também oferece um bom corpus para treinar um classificador de texto curto.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Fluxograma da descoberta de "maus casos" de classificação de textos curtos.")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">O Milvus pode fornecer recomendações de conteúdos noticiosos em tempo real e muito mais<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus melhorou consideravelmente o desempenho em tempo real do sistema de recomendação de notícias da Sohu e também reforçou a eficiência da identificação de textos curtos mal classificados. Se estiver interessado em saber mais sobre o Milvus e as suas várias aplicações:</p>
<ul>
<li>Leia o nosso <a href="https://zilliz.com/blog">blogue</a>.</li>
<li>Interagir com a nossa comunidade de código aberto no <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilize ou contribua para a base de dados de vectores mais popular do mundo no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Teste e implemente rapidamente aplicações de IA com o nosso novo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
