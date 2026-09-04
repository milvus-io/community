---
id: what-is-vector-database-and-how-it-works.md
title: >-
  <h1>O que é exatamente um Banco de Dados Vetorial e Como Ele Funciona</h1>

      <p>Com a rápida evolução da inteligência artificial, os bancos de dados vetoriais emergiram como uma tecnologia revolucionária no campo do gerenciamento de dados. Este artigo tem como objetivo fornecer uma explicação abrangente dos bancos de dados vetoriais, suas aplicações, princípios de funcionamento e uma visão geral dos principais produtos disponíveis no mercado.</p>

      <h2>Índice</h2>

      <ul>
          <li><a href="#what-is-a-vector-database">O que é um Banco de Dados Vetorial?</a></li>
          <li><a href="#how-do-vector-databases-work">Como Funcionam os Bancos de Dados Vetoriais?</a></li>
          <li><a href="#what-are-vector-databases-used-for">Para Que São Utilizados os Bancos de Dados Vetoriais?</a></li>
          <li><a href="#vector-database-examples">Exemplos de Bancos de Dados Vetoriais</a></li>
          <li><a href="#vector-database-milvus">Por que o Milvus é a Escolha Preferida para Bancos de Dados Vetoriais</a></li>
          <li><a href="#conclusion">Conclusão</a></li>
      </ul>

      <h2 id="what-is-a-vector-database">O que é um Banco de Dados Vetorial?</h2>

      <p>Um banco de dados vetorial é um tipo de banco de dados que organiza os dados como vetores de alta dimensão, que são representações matemáticas de características ou atributos. No campo da IA e do aprendizado de máquina, esses vetores representam dados não estruturados, como textos, imagens e áudio, permitindo consultas rápidas e recuperação de dados semelhantes com base na distância vetorial. Essa capacidade é crucial para cargas de trabalho de IA generativa, onde encontrar rapidamente dados semelhantes é essencial.</p>

      <p>Os bancos de dados vetoriais são particularmente hábeis em lidar com dados não estruturados complexos. Eles alcançam isso convertendo os dados em embeddings vetoriais por meio de modelos de aprendizado de máquina. Esse processo de conversão facilita uma pesquisa eficiente por similaridade, possibilitando o rápido desenvolvimento de aplicações com recursos de busca e comparação de dados não estruturados.</p>

      <h3>Compreendendo os Vetores: Os Fundamentos dos Bancos de Dados Vetoriais</h3>

      <p>Um vetor é definido como uma combinação de ponto final e ponto inicial, compreendendo magnitude (comprimento) e direção. Na ciência de dados, os vetores são matrizes de números de ponto flutuante, frequentemente chamados de <em>embeddings</em>, que representam dados não estruturados. O processo de conversão de dados em embeddings envolve modelos de incorporação como o mecanismo do Word2Vec ou redes neurais profundas. Cada dimensão do vetor corresponde a uma característica específica, tornando o vetor uma representação abrangente dos dados.</p>

      <p>Por exemplo, um vetor que representa um documento de texto pode incluir dimensões como comprimento, tópico, tom, sentimento, etc. Para dados de imagem, pode abranger cor, textura, bordas e assim por diante. É importante notar que, embora dois vetores possam ser comparados matematicamente para similaridade (quanto mais próximos, mais similares são as representações), interpretar a semântica de cada dimensão do vetor continua sendo um desafio. Essa complexidade é conhecida como o problema do "problema de explicação de IA", onde a natureza precisa de cada dimensão vetorial nem sempre é compreendida.</p>

      <h2 id="how-do-vector-databases-work">Como Funcionam os Bancos de Dados Vetoriais?</h2>

      <p>Os bancos de dados vetoriais usam uma combinação de diferentes algoritmos, todos participantes da <a href="https://zilliz.com/blog/vector-similarity-search">Indexação ANN (Aproximadamente Vizinho Mais Próximo)</a>. Esses algoritmos otimizam o processo de pesquisa por meio de técnicas como hashing, quantização ou construção de gráficos.</p>

      <p>Esses algoritmos compreendem pipelines que estabelecem uma conexão entre os vetores e permitem uma leitura rápida dos dados a partir do armazenamento. Como os bancos de dados vetoriais podem realizar buscas de similaridade de alta dimensão, isso permite que os usuários pesquisem com rapidez e precisão em grandes conjuntos de dados de aplicações de IA.</p>

      <h3>Compreendendo a Indexação ANN (Aproximadamente Vizinho Mais Próximo)</h3>

      <p>A indexação ANN é uma técnica fundamental usada em bancos de dados vetoriais para acelerar a pesquisa de vetores semelhantes. Ao contrário da pesquisa por vizinho mais próximo exato, que compara um vetor de consulta com cada vetor no banco de dados, a pesquisa ANN prioriza a velocidade em detrimento da perfeição. Ela encontra uma aproximação dos vetores mais próximos, o que muitas vezes é suficiente para casos de uso aplicados. O mecanismo por trás disso envolve várias técnicas, incluindo:</p>

      <ul>
          <li><strong>Hashing Sensível à Localidade (LSH):</strong> Um método que coloca vetores semelhantes no mesmo buckets de hash com alta probabilidade, agilizando assim o processo de pesquisa.</li>
          <li><strong>Quantificação por Produto (PQ):</strong> Uma técnica de compressão que reduz a dimensionalidade dos vetores, tornando o armazenamento e a computação mais eficientes.</li>
          <li><strong>Hierarchical Navigable Small World (HNSW):</strong> Um algoritmo baseado em grafos que constrói uma estrutura hierárquica de grafos para permitir pesquisas rápidas e precisas mesmo em altas dimensões.</li>
      </ul>

      <h3>O Papel dos Índices Vetoriais no Armazenamento e na Consulta de Dados</h3>

      <p>Os índices vetoriais são componentes essenciais no armazenamento e na consulta de dados vetoriais. Eles minimizam o tempo necessário para encontrar pontos de dados semelhantes durante uma consulta. Cada algoritmo de índice tem seus pontos fortes e é adequado para diferentes cenários. Por exemplo:</p>

      <ul>
          <li><strong>Índice FLAT:</strong> Este é um método de busca por força bruta que garante 100% de recall, mas tem uma velocidade de consulta lenta.</li>
          <li><strong>Índice IVT:</strong> Uma técnica que divide o espaço vetorial em partições, permitindo uma busca mais rápida do que o FLAT.</li>
          <li><strong>Índice HNSW:</strong> Oferece alta velocidade de consulta e escalabilidade, tornando-o adequado para cenários que exigem desempenho de pesquisa rápido.</li>
      </ul>

      <h3>Aprimorando a Pesquisa por Similaridade com o Produto Interno e Mais Além</h3>

      <p>A pesquisa por similaridade em bancos de dados vetoriais não se limita a um único método. Várias métricas de similaridade, como produto interno, similaridade de cosseno e distância euclidiana, podem ser empregadas. Essas métricas ajudam a compreender a relação entre diferentes vetores e a recuperar resultados mais relevantes. Vale a pena notar que a escolha da métrica de similaridade geralmente depende do caso de uso específico e da natureza da representação vetorial.</p>

      <h2 id="what-are-vector-databases-used-for">Para Que São Utilizados os Bancos de Dados Vetoriais?</h2>

      <p>Os bancos de dados vetoriais são usados principalmente em aplicações de IA, particularmente em modelos de linguagem natural e de visão computacional. Eles permitem tarefas como pesquisa semântica, sistemas de recomendação e detecção de anomalias.</p>

      <p>Na arquitetura de IA generativa, como o ChatGPT, os bancos de dados vetoriais podem ampliar a memória e acessar informações adicionais relevantes para o prompt do LLM. Esse processo aprimora a qualidade das respostas geradas pelo modelo de IA e permite um comportamento mais contextualizado.</p>

      <p>As aplicações reais dos bancos de dados vetoriais são extensas. Alguns dos casos de uso mais comuns incluem:</p>

      <ul>
          <li><strong>Pesquisa Semântica:</strong> Encontrar conteúdo relevante interpretando o significado por trás da consulta do usuário, em vez de apenas palavras-chave.</li>
          <li><strong>Sistemas de Recomendação:</strong> Fornecer recomendações personalizadas com base na similaridade vetorial dos itens ou usuários.</li>
          <li><strong>Detecção de Anomalias:</strong> Identificar padrões incomuns que se desviam significativamente da norma.</li>
          <li><strong>Pesquisa Multimodal:</strong> Recuperar dados em diferentes formatos, como imagens, textos e áudio, com base em um único tipo de entrada.</li>
      </ul>

      <h3>Possíveis Casos de Uso de Bancos de Dados Vetoriais</h3>

      <table>
          <thead>
              <tr>
                  <th>Caso de Uso</th>
                  <th>Descrição</th>
                  <th>Exemplos</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>LLMs e Modelos de Fundação</td>
                  <td>Aprimorar LLMs com memória de longo prazo e criar conhecimento empresarial.</td>
                  <td>- Assistência médica: responder perguntas clínicas com base em diretrizes farmacêuticas.<br>- Cibersegurança: semear LLMs com relatórios de ameaças para conscientização sobre vulnerabilidades.</td>
              </tr>
              <tr>
                  <td>Sistemas de Perguntas e Respostas (Q&amp;A)</td>
                  <td>Gerar respostas corretas consultando documentos de conhecimento.</td>
                  <td>- Assistentes de TI: recomendar artigos da base de conhecimento.<br>- Atendimento ao cliente: combinar perguntas de usuários com respostas de um vasto corpus.</td>
              </tr>
              <tr>
                  <td>Visão Computacional</td>
                  <td>Identificar ou similarizar objetos e conteúdo dentro de imagens e vídeos.</td>
                  <td>- Segurança: detectar ocorrências ou anomalias em vídeo.<br>- Varejo: comparar imagens de produtos para similaridade ou duplicatas.<br>- Mídia: realizar pesquisa reversa de imagens.</td>
              </tr>
              <tr>
                  <td>Processamento de Linguagem Natural (PNL)</td>
                  <td>Compreender, processar e extrair informações de dados de texto.</td>
                  <td>- Análise de sentimento: agrupar comentários de clientes por emoção.<br>- Mídia: encontrar artigos semelhantes por tópico para recomendações.</td>
              </tr>
              <tr>
                  <td>Mecanismos Multimodais</td>
                  <td>Buscar dados em diversos tipos (texto, imagem, áudio).</td>
                  <td>- E-commerce: encontrar produtos similares usando texto, imagem e áudio.<br>- Segurança: recuperar vídeos com base em descrições de texto ou áudio.</td>
              </tr>
              <tr>
                  <td>Mecanismos de Buska</td>
                  <td>Melhorar o desempenho da pesquisa para consultas personalizadas e baseadas em intenção.</td>
                  <td>- E-commerce: conduzir buscas orientadas por tags e texto.</td>
              </tr>
          </tbody>
      </table>

      <h2 id="vector-database-examples">Exemplos de Bancos de Dados Vetoriais</h2>

      <p>Vários bancos de dados vetoriais estão disponíveis no mercado, cada um com suas características e casos de uso ideais. Alguns dos mais populares incluem:</p>

      <ul>
          <li><strong>Pinecone:</strong> Um banco de dados vetorial totalmente gerenciado que se destaca em escalabilidade e facilidade de uso.</li>
          <li><strong>Milvus:</strong> Um banco de dados vetorial de código aberto construído especificamente para similaridade e pesquisa em IA, conhecido por seus recursos robustos e alto desempenho.</li>
          <li><strong>Weaviate:</strong> Um banco de dados vetorial de código aberto que combina pesquisa por similaridade com mecanismos de busca tradicionais.</li>
          <li><strong>Faiss:</strong> Uma biblioteca para pesquisa eficiente de similaridade e agrupamento de vetores densos, desenvolvida pelo Facebook AI Research.</li>
      </ul>

      <p>Cada um desses bancos de dados vetoriais tem seus pontos fortes e fracos, e a escolha depende muito dos requisitos específicos do projeto.</p>

      <h2 id="vector-database-milvus">Por que o Milvus é a Escolha Preferida para Bancos de Dados Vetoriais</h2>

      <p>Entre a infinidade de bancos de dados vetoriais, o <a href="https://milvus.io/">Milvus</a> se destaca por várias razões:</p>

      <ul>
          <li><strong>Alto Desempenho:</strong> O Milvus oferece velocidades de pesquisa excepcionalmente rápidas, mesmo em conjuntos de dados massivos, graças à sua arquitetura exclusiva e recursos avançados de indexação.</li>
          <li><strong>Escalabilidade:</strong> Ele suporta escala horizontal, permitindo lidar com volumes crescentes de dados sem comprometer o desempenho.</li>
          <li><strong>Rico em Recursos:</strong> O Milvus tem uma infinidade de recursos, incluindo suporte para várias métricas de similaridade, indexação híbrida e pesquisa em vetores esparsos e densos.</li>
          <li><strong>Código Aberto:</strong> Sendo de código aberto, tem uma comunidade vibrante e é continuamente melhorado com os avanços na área.</li>
      </ul>

      <p>Com todas essas vantagens, o Milvus é inegavelmente uma excelente escolha para quem procura implementar um banco de dados vetorial. Mas, para realmente entender o valor dele, vamos examinar um exemplo de como o Milvus pode ser usado para pesquisa de similaridade.</p>

      <h3>Decompondo como o Milvus Funciona</h3>

      <p>Para ter uma noção prática, vamos dar uma olhada em um exemplo simples. Vamos supor que tenhamos um conjunto de dados que represente palavras e queiramos encontrar palavras semelhantes. Primeiro, precisamos transformar essas palavras em vetores. Existem várias maneiras de fazer isso, mas um método comum é usar embeddings de palavras. Esses embeddings são essencialmente vetores de alta dimensão. Então, podemos usar o Milvus para armazenar esses vetores e realizar uma pesquisa por similaridade.</p>

      <p>Aqui está um exemplo simplificado de como seria esse processo:</p>

      <pre><code># Supondo que já tenhamos nossos embeddings de palavras
  embeddings = get_word_embeddings(["rei", "rainha", "rei", "menino", "menina"])


  # Conectar ao Milvus

  milvus = Milvus(host="localhost", port="19530")


  # Criar uma coleção no Milvus para nossos embeddings de palavras

  collection = milvus.create_collection("colecao_palavras", fields=[...])


  # Inserir os embeddings na coleção

  collection.insert(embeddings)


  # Agora, se quisermos encontrar palavras semelhantes a 'rei'

  similar_words = collection.search(vector=embeddings["rei"], limit=3)


  # Isso retornará as 3 palavras mais próximas de 'rei' em nosso conjunto de
  dados</code></pre>

      <p>Este é apenas um exemplo rudimentar. Na realidade, os bancos de dados vetoriais como o Milvus têm recursos muito mais avançados, mas este exemplo simples demonstra o conceito central.</p>

      <h2 id="conclusion">Conclusão</h2>

      <p>Os bancos de dados vetoriais desempenham um papel fundamental no cenário de IA em rápida evolução, fornecendo uma solução robusta para gerenciar e consultar dados complexos e não estruturados. Eles são a espinha dorsal de muitas aplicações modernas de IA, e sua importância só tende a crescer.</p>

      <p>Do ponto de vista do valor do negócio, ser capaz de aproveitar todo o potencial dos dados não estruturados é uma enorme vantagem competitiva. Seja para entender o feedback do cliente, fornecer recomendações personalizadas ou melhorar a segurança, os bancos de dados vetoriais oferecem as ferramentas para fazer isso com eficiência e eficácia. Portanto, entender seu funcionamento e como aproveitá-los pode ser um divisor de águas para qualquer organização orientada por dados.</p>
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Um banco de dados vetorial armazena, indexa e pesquisa embeddings vetoriais
  gerados por modelos de aprendizado de máquina para recuperação rápida de
  informações e busca por similaridade.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>Um banco de dados vetorial indexa e armazena embeddings vetoriais para recuperação rápida e busca por similaridade, com recursos como operações CRUD, filtragem por metadados e escalabilidade horizontal projetados especificamente para aplicações de IA.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introdução: A Ascensão dos Bancos de Dados Vetoriais na Era da IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos primórdios do ImageNet, foram necessários 25.000 curadores humanos para rotular manualmente o conjunto de dados. Esse número impressionante destaca um desafio fundamental na IA: categorizar manualmente dados não estruturados simplesmente não escala. Com bilhões de imagens, vídeos, documentos e arquivos de áudio gerados diariamente, era necessária uma mudança de paradigma na forma como os computadores entendem e interagem com o conteúdo.</p>
<p>Os <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">sistemas de banco de dados relacionais</a> tradicionais se destacam no gerenciamento de dados estruturados com formatos predefinidos e na execução de operações de busca precisas. Em contraste, os bancos de dados vetoriais são especializados em armazenar e recuperar tipos de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a>, como imagens, áudio, vídeos e conteúdo textual, por meio de representações numéricas de alta dimensionalidade conhecidas como embeddings vetoriais. Os bancos de dados vetoriais oferecem suporte a <a href="https://zilliz.com/glossary/large-language-models-(llms)">grandes modelos de linguagem</a> fornecendo recuperação e gerenciamento eficiente de dados. Os bancos de dados vetoriais modernos superam os sistemas tradicionais em 2 a 10 vezes por meio de otimização ciente do hardware (AVX512, SIMD, GPUs, SSDs NVMe), algoritmos de busca altamente otimizados (HNSW, IVF, DiskANN) e design de armazenamento orientado a colunas. Sua arquitetura cloud-native e desacoplada permite o dimensionamento independente dos componentes de busca, inserção de dados e indexação, permitindo que os sistemas lidem com eficiência com bilhões de vetores, mantendo o desempenho para aplicações empresariais de IA em empresas como Salesforce, PayPal, eBay e NVIDIA.</p>
<p>Isso representa o que os especialistas chamam de "lacuna semântica" — os bancos de dados tradicionais operam com correspondências exatas e relacionamentos predefinidos, enquanto a compreensão humana do conteúdo é matizada, contextual e multidimensional. Essa lacuna se torna cada vez mais problemática à medida que as aplicações de IA exigem:</p>
<ul>
<li><p>Encontrar similaridades conceituais em vez de correspondências exatas</p></li>
<li><p>Compreender relacionamentos contextuais entre diferentes conteúdos</p></li>
<li><p>Capturar a essência semântica da informação além das palavras-chave</p></li>
<li><p>Processar dados multimodais em um framework unificado</p></li>
</ul>
<p>Os bancos de dados vetoriais surgiram como a tecnologia crítica para preencher essa lacuna, tornando-se um componente essencial na infraestrutura moderna de IA. Eles melhoram o desempenho dos modelos de aprendizado de máquina facilitando tarefas como clustering e classificação.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Compreendendo os Embeddings Vetoriais: A Fundação<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Os <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vetoriais</a> servem como a ponte crítica sobre a lacuna semântica. Essas representações numéricas de alta dimensionalidade capturam a essência semântica dos dados não estruturados em uma forma que os computadores podem processar com eficiência. Os modelos modernos de embeddings transformam conteúdo bruto — seja texto, imagens ou áudio — em vetores densos onde conceitos similares se agrupam no espaço vetorial, independentemente de diferenças superficiais.</p>
<p>Por exemplo, embeddings devidamente construídos posicionariam conceitos como "automóvel", "carro" e "veículo" em proximidade dentro do espaço vetorial, apesar de terem formas lexicais diferentes. Essa propriedade permite que a <a href="https://zilliz.com/glossary/semantic-search">busca semântica</a>, os <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemas de recomendação</a> e as aplicações de IA compreendam o conteúdo além da simples correspondência de padrões.</p>
<p>O poder dos embeddings se estende por todas as modalidades. Os bancos de dados vetoriais avançados suportam vários tipos de dados não estruturados — texto, imagens, áudio — em um sistema unificado, permitindo buscas e relacionamentos entre modalidades que antes eram impossíveis de modelar com eficiência. Esses recursos de banco de dados vetorial são cruciais para tecnologias orientadas por IA, como chatbots e sistemas de reconhecimento de imagem, apoiando aplicações avançadas como busca semântica e sistemas de recomendação.</p>
<p>No entanto, armazenar, indexar e recuperar embeddings em escala apresenta desafios computacionais únicos que os bancos de dados tradicionais não foram projetados para resolver.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bancos de Dados Vetoriais: Conceitos Fundamentais<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Os bancos de dados vetoriais representam uma mudança de paradigma na forma como armazenamos e consultamos dados não estruturados. Ao contrário dos sistemas de banco de dados relacionais tradicionais, que se destacam no gerenciamento de dados estruturados com formatos predefinidos, os bancos de dados vetoriais são especializados em lidar com dados não estruturados por meio de representações vetoriais numéricas.</p>
<p>Em sua essência, os bancos de dados vetoriais são projetados para resolver um problema fundamental: permitir buscas eficientes por similaridade em conjuntos massivos de dados não estruturados. Eles conseguem isso por meio de três componentes principais:</p>
<p><strong>Embeddings Vetoriais</strong>: Representações numéricas de alta dimensionalidade que capturam o significado semântico de dados não estruturados (texto, imagens, áudio, etc.)</p>
<p><strong>Indexação Especializada</strong>: Algoritmos otimizados para espaços vetoriais de alta dimensionalidade que permitem buscas aproximadas rápidas. Os bancos de dados vetoriais indexam vetores para aumentar a velocidade e a eficiência das buscas por similaridade, utilizando vários algoritmos de aprendizado de máquina para criar índices sobre embeddings vetoriais.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Métricas de Distância</strong></a>: Funções matemáticas que quantificam a similaridade entre vetores</p>
<p>A operação primária em um banco de dados vetorial é a consulta de <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-vizinhos mais próximos</a> (KNN), que encontra os k vetores mais similares a um vetor de consulta fornecido. Para aplicações em larga escala, esses bancos de dados normalmente implementam algoritmos de <a href="https://zilliz.com/glossary/anns">vizinho mais próximo aproximado</a> (ANN), trocando uma pequena quantidade de precisão por ganhos significativos em velocidade de busca.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fundamentos Matemáticos da Similaridade Vetorial</h3><p>Compreender os bancos de dados vetoriais exige entender os princípios matemáticos por trás da similaridade vetorial. Aqui estão os conceitos fundamentais:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espaços Vetoriais e Embeddings</h3><p>Um <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embedding vetorial</a> é um array de comprimento fixo de números de ponto flutuante (podem variar de 100 a 32.768 dimensões!) que representa dados não estruturados em formato numérico. Esses embeddings posicionam itens similares mais próximos uns dos outros em um espaço vetorial de alta dimensionalidade.</p>
<p>Por exemplo, as palavras "rei" e "rainha" teriam representações vetoriais mais próximas entre si do que qualquer uma delas de "automóvel" em um espaço de embeddings de palavras bem treinado.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métricas de Distância</h3><p>A escolha da métrica de distância afeta fundamentalmente como a similaridade é calculada. As métricas de distância comuns incluem:</p>
<ol>
<li><p><strong>Distância Euclidiana</strong>: A distância em linha reta entre dois pontos no espaço euclidiano.</p></li>
<li><p><strong>Similaridade de Cosseno</strong>: Mede o cosseno do ângulo entre dois vetores, focando na orientação em vez da magnitude</p></li>
<li><p><strong>Produto Escalar</strong>: Para vetores normalizados, representa o quão alinhados dois vetores estão.</p></li>
<li><p><strong>Distância de Manhattan (Norma L1)</strong>: Soma das diferenças absolutas entre as coordenadas.</p></li>
</ol>
<p>Diferentes casos de uso podem exigir diferentes métricas de distância. Por exemplo, a similaridade de cosseno geralmente funciona bem para embeddings de texto, enquanto a distância euclidiana pode ser mais adequada para certos tipos de <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">embeddings de imagem</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Similaridade semântica</a> entre vetores em um espaço vetorial</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>Similaridade semântica entre vetores em um espaço vetorial</span>
  </span>
</p>
<p>Compreender esses fundamentos matemáticos leva a uma questão importante sobre a implementação: Então é só adicionar um índice vetorial a qualquer banco de dados, certo?</p>
<p>Simplesmente adicionar um índice vetorial a um banco de dados relacional não é suficiente, nem usar uma <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de índice vetorial</a> autônoma. Embora os índices vetoriais forneçam a capacidade crítica de encontrar vetores similares com eficiência, eles não possuem a infraest
