---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: >-
  Como o Milvus 2.6 actualiza a pesquisa multilingue de texto integral em grande
  escala
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  O Milvus 2.6 apresenta um pipeline de análise de texto completamente revisto
  com suporte multilingue abrangente para pesquisa de texto completo.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>As aplicações modernas de IA estão a tornar-se cada vez mais complexas. Não se pode simplesmente aplicar um método de pesquisa a um problema e considerá-lo resolvido.</p>
<p>Veja-se os sistemas de recomendação, por exemplo - requerem <strong>pesquisa vetorial</strong> para compreender o significado do texto e das imagens, <strong>filtragem de metadados</strong> para restringir os resultados por preço, categoria ou localização e <strong>pesquisa de palavras-chave</strong> para consultas diretas como "Nike Air Max". Cada método resolve uma parte diferente do problema, e os sistemas do mundo real precisam de todos eles a trabalhar em conjunto.</p>
<p>O futuro da pesquisa não se resume a escolher entre vetor e palavra-chave. Trata-se de combinar vetor E palavra-chave E filtragem, juntamente com outros tipos de pesquisa - tudo num único local. Foi por isso que começámos a incorporar <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">a pesquisa híbrida</a> no Milvus há um ano, com o lançamento do Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Mas a pesquisa de texto completo funciona de forma diferente<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Trazer a pesquisa de texto completo para um sistema nativo de vetor não é fácil. A pesquisa de texto completo tem seu próprio conjunto de desafios.</p>
<p>Enquanto a pesquisa vetorial capta o significado <em>semântico</em> do texto - transformando-o em vectores de elevada dimensão - a pesquisa de texto integral depende da compreensão <strong>da estrutura da linguagem</strong>: como as palavras são formadas, onde começam e acabam e como se relacionam entre si. Por exemplo, quando um utilizador procura "ténis de corrida" em inglês, o texto passa por várias etapas de processamento:</p>
<p><em>Dividir os espaços em branco → minúsculas → remover palavras de paragem → transformar &quot;running&quot; em &quot;run&quot;.</em></p>
<p>Para lidar com isto corretamente, precisamos de um <strong>analisador de linguagem</strong>robusto <strong>- um</strong>que lide com a divisão, stemming, filtragem e muito mais.</p>
<p>Quando introduzimos <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">a pesquisa de texto completo BM25</a> no Milvus 2.5, incluímos um analisador personalizável, e funcionou bem para o que foi concebido. É possível definir um pipeline utilizando tokenizadores, filtros de token e filtros de caracteres para preparar o texto para indexação e pesquisa.</p>
<p>Para o inglês, esta configuração era relativamente simples. Mas as coisas tornam-se mais complexas quando se lida com várias línguas.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">O desafio da pesquisa multilingue de texto integral<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa multilingue de texto integral apresenta uma série de desafios:</p>
<ul>
<li><p><strong>As línguas complexas necessitam de um tratamento especial</strong>: Línguas como o chinês, o japonês e o coreano não utilizam espaços entre as palavras. Necessitam de tokenizadores avançados para segmentar os caracteres em palavras com significado. Estas ferramentas podem funcionar bem para uma única língua, mas raramente suportam várias línguas complexas em simultâneo.</p></li>
<li><p><strong>Mesmo línguas semelhantes podem entrar em conflito</strong>: O inglês e o francês podem utilizar espaços em branco para separar as palavras, mas quando se aplica o processamento específico da língua, como o stemming ou a lematização, as regras de uma língua podem interferir com as da outra. O que melhora a precisão para o inglês pode distorcer as consultas em francês - e vice-versa.</p></li>
</ul>
<p>Em suma, <strong>línguas diferentes requerem analisadores diferentes</strong>. Tentar processar texto chinês com um analisador inglês conduz ao fracasso - não há espaços para dividir e as regras de stemming inglesas podem corromper os caracteres chineses.</p>
<p>O resultado final? Confiar em um único tokenizador e analisador para conjuntos de dados multilíngues torna quase impossível garantir uma tokenização consistente e de alta qualidade em todos os idiomas. E isso leva diretamente a uma degradação do desempenho da pesquisa.</p>
<p>Quando as equipas começaram a adotar a pesquisa de texto integral no Milvus 2.5, começámos a ouvir o mesmo feedback:</p>
<p><em>"Isto é perfeito para as nossas pesquisas em inglês, mas e os nossos pedidos de apoio ao cliente multilingues?" "Adoramos ter a pesquisa vetorial e BM25, mas o nosso conjunto de dados inclui conteúdos em chinês, japonês e inglês." "Podemos obter a mesma precisão de pesquisa em todos os nossos idiomas?"</em></p>
<p>Estas perguntas confirmaram o que já tínhamos visto na prática: a pesquisa de texto integral é fundamentalmente diferente da pesquisa vetorial. A semelhança semântica funciona bem em todas as línguas, mas uma pesquisa de texto precisa requer um conhecimento profundo da estrutura de cada língua.</p>
<p>É por isso que <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">o Milvus 2.6</a> introduz um pipeline de análise de texto completamente revisto com suporte multilingue abrangente. Este novo sistema aplica automaticamente o analisador correto para cada língua, permitindo uma pesquisa de texto completo precisa e escalável em conjuntos de dados multilingues, sem configuração manual ou comprometimento da qualidade.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Como o Milvus 2.6 permite uma pesquisa de texto completo multilingue robusta<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Após extensa pesquisa e desenvolvimento, criámos um conjunto de funcionalidades que abordam diferentes cenários multilingues. Cada abordagem resolve o problema de dependência de idioma de sua própria maneira.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Analisador multilingue: Precisão através do controlo</h3><p>O <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Analisador multilingue</strong></a> permite-lhe definir diferentes regras de processamento de texto para diferentes idiomas dentro da mesma coleção, em vez de forçar todos os idiomas a passar pelo mesmo pipeline de análise.</p>
<p><strong>Funciona da seguinte forma:</strong> configura analisadores específicos do idioma e marca cada documento com o seu idioma durante a inserção. Ao efetuar uma pesquisa BM25, especifica qual o analisador de idiomas a utilizar para o processamento da consulta. Isto assegura que tanto o conteúdo indexado como as consultas de pesquisa são processados com as regras ideais para os respectivos idiomas.</p>
<p><strong>Perfeito para:</strong> Aplicações em que conhece o idioma do seu conteúdo e pretende a máxima precisão de pesquisa. Pense em bases de conhecimento multinacionais, catálogos de produtos localizados ou sistemas de gestão de conteúdos específicos de cada região.</p>
<p><strong>O requisito:</strong> É necessário fornecer metadados de idioma para cada documento. Atualmente apenas disponível para operações de pesquisa BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Tokenizer de identificador de idioma: Deteção automática da língua</h3><p>Sabemos que a marcação manual de cada conteúdo nem sempre é prática. O <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Tokenizer de Identificador de</strong></a> Idioma traz a deteção automática de idioma diretamente para o pipeline de análise de texto.</p>
<p><strong>Eis como funciona:</strong> Este tokenizador inteligente analisa o texto recebido, detecta o seu idioma utilizando algoritmos de deteção sofisticados e aplica automaticamente as regras de processamento específicas do idioma adequadas. Configura-o com várias definições de analisador - uma para cada idioma que pretende suportar, mais um analisador de recurso predefinido.</p>
<p>Suportamos dois motores de deteção: <code translate="no">whatlang</code> para um processamento mais rápido e <code translate="no">lingua</code> para uma maior precisão. O sistema suporta 71-75 idiomas, dependendo do detetor escolhido. Durante a indexação e a pesquisa, o tokenizador seleciona automaticamente o analisador correto com base no idioma detectado, recorrendo à sua configuração predefinida quando a deteção é incerta.</p>
<p><strong>Perfeito para:</strong> Ambientes dinâmicos com mistura imprevisível de idiomas, plataformas de conteúdo gerado pelo utilizador ou aplicações em que a marcação manual de idiomas não é viável.</p>
<p><strong>A desvantagem:</strong> A deteção automática acrescenta latência de processamento e pode ter dificuldades com textos muito curtos ou conteúdos em vários idiomas. Mas, para a maioria das aplicações do mundo real, a conveniência supera significativamente estas limitações.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. Tokenizador ICU: Fundação universal</h3><p>Se as duas primeiras opções parecerem um exagero, temos algo mais simples para si. Nós integramos recentemente o<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> tokenizador ICU (International Components for Unicode)</a> no Milvus 2.6. O ICU existe desde sempre - é um conjunto de bibliotecas maduro e amplamente usado que lida com processamento de texto para toneladas de idiomas e scripts. O legal é que ele pode lidar com várias linguagens complexas e simples ao mesmo tempo.</p>
<p>O tokenizador ICU é honestamente uma ótima escolha padrão. Ele usa regras padrão Unicode para quebrar palavras, o que o torna confiável para dezenas de idiomas que não têm seus próprios tokenizadores especializados. Se você só precisa de algo poderoso e de uso geral que funcione bem em vários idiomas, o ICU faz o trabalho.</p>
<p><strong>Limitações:</strong> O ICU ainda funciona dentro de um único analisador, por isso todas as suas línguas acabam por partilhar os mesmos filtros. Quer fazer coisas específicas para cada língua, como stemming ou lematização? Vai deparar-se com os mesmos conflitos de que falámos anteriormente.</p>
<p><strong>Onde ele realmente brilha:</strong> Criámos o ICU para funcionar como o analisador predefinido nas configurações de vários idiomas ou identificadores de idiomas. É basicamente a sua rede de segurança inteligente para lidar com idiomas que não tenha configurado explicitamente.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Veja-o em ação: Demonstração prática<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Chega de teoria - vamos mergulhar em algum código! Eis como usar as novas caraterísticas multilingues do <strong>pymilvus</strong> para construir uma coleção de pesquisa multilingue.</p>
<p>Começaremos por definir algumas configurações reutilizáveis do analisador e, em seguida, passaremos por <strong>dois exemplos completos</strong>:</p>
<ul>
<li><p>Usando o <strong>analisador multilíngüe</strong></p></li>
<li><p>Usando o <strong>tokenizador de identificador de idioma</strong></p></li>
</ul>
<p>Para obter o código de demonstração completo, confira <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">esta página do GitHub</a>.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Passo 1: Configurar o cliente Milvus</h3><p><em>Primeiro, conectamo-nos ao Milvus, definimos um nome de coleção e limpamos todas as coleções existentes para começar de novo.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Etapa 2: definir analisadores para vários idiomas</h3><p>Em seguida, definimos um dicionário <code translate="no">analyzers</code> com configurações específicas de idioma. Elas serão usadas nos dois métodos de pesquisa multilíngüe mostrados mais adiante.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Opção A: Usando o analisador multilíngue</h3><p>Esta abordagem é melhor quando se <strong>sabe antecipadamente o idioma de cada documento</strong>. Passará essa informação através de um campo dedicado <code translate="no">language</code> durante a inserção de dados.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Criar uma coleção com o Analisador multilingue</h4><p>Criaremos uma coleção em que o campo <code translate="no">&quot;text&quot;</code> usa analisadores diferentes, dependendo do valor do campo <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Inserir dados multilíngues e carregar a coleção</h4><p>Agora insira documentos em inglês e japonês. O campo <code translate="no">language</code> informa ao Milvus qual analisador deve ser usado.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Executar pesquisa de texto completo</h4><p>Para pesquisar, especifique qual o analisador a utilizar para a consulta com base no seu idioma.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Resultados:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Opção B: Usando o tokenizador de identificador de idioma</h3><p>Esta abordagem elimina o manuseamento manual da língua das suas mãos. O <strong>Tokenizer de identificador de</strong> idioma detecta automaticamente o idioma de cada documento e aplica o analisador correto - não é necessário especificar um campo <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Criar uma coleção com o Tokenizer de identificador de idioma</h4><p>Aqui, criamos uma coleção em que o campo <code translate="no">&quot;text&quot;</code> usa a deteção automática de idioma para escolher o analisador correto.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Inserir dados e carregar coleção</h4><p>Insira texto em diferentes idiomas - não é necessário rotulá-los. Milvus detecta e aplica o analisador correto automaticamente.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Executar pesquisa de texto completo</h4><p>Aqui está a melhor parte: <strong>não é necessário especificar um analisador</strong> ao pesquisar. O tokenizador detecta automaticamente o idioma da consulta e aplica a lógica correta.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Resultados</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>O Milvus 2.6 dá um grande passo para tornar <strong>a pesquisa híbrida</strong> mais poderosa e acessível, combinando pesquisa vetorial com pesquisa por palavra-chave, agora em vários idiomas. Com o suporte multilingue melhorado, é possível criar aplicações que compreendem <em>o que os utilizadores</em> querem dizer e <em>o que dizem</em>, independentemente do idioma que estão a utilizar.</p>
<p>Mas esta é apenas uma parte da atualização. O Milvus 2.6 também traz vários outros recursos que tornam a pesquisa mais rápida, mais inteligente e mais fácil de trabalhar:</p>
<ul>
<li><p><strong>Melhor correspondência de consultas</strong> - Use <code translate="no">phrase_match</code> e <code translate="no">multi_match</code> para pesquisas mais precisas</p></li>
<li><p><strong>Filtragem JSON mais rápida</strong> - Graças a um novo índice dedicado para campos JSON</p></li>
<li><p><strong>Ordenação baseada em escalar</strong> - Ordene os resultados por qualquer campo numérico</p></li>
<li><p><strong>Reranking avançado</strong> - Reordene os resultados utilizando modelos ou lógica de pontuação personalizada</p></li>
</ul>
<p>Quer uma análise completa do Milvus 2.6? Veja o nosso último post: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Apresentando o Milvus 2.6: Pesquisa Vetorial Acessível à Escala de Bilhões</strong></a><strong>.</strong></p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Participe do nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registre problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
