---
id: >-
  tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
title: >-
  Tokenizar de forma mais inteligente, recuperar melhor: Um mergulho profundo no
  Milvus Analyzer para pesquisa de texto completo
author: Jack Li
date: 2025-10-16T00:00:00.000Z
desc: >-
  Explore como o Milvus Analyzer potencia a recuperação de IA híbrida com
  tokenização e filtragem eficientes, permitindo uma pesquisa de texto completo
  mais rápida e inteligente.
cover: assets.zilliz.com/Milvus_Analyzer_5096bcbd47.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_title: |
  A Deep Dive into Milvus Analyzer for Full-Text Search
meta_keywords: 'Milvus Analyzer, RAG, full-text search, vector database, tokenization'
origin: >-
  https://milvus.io/blog/tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
---
<p>As aplicações modernas de IA são complexas e raramente unidimensionais. Em muitos casos, um único método de pesquisa não consegue resolver sozinho os problemas do mundo real. Veja-se um sistema de recomendação, por exemplo. É necessária uma <strong>pesquisa vetorial</strong> para compreender o significado por detrás do texto ou das imagens, <strong>uma filtragem de metadados</strong> para refinar os resultados por preço, categoria ou localização e<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md"> <strong>uma pesquisa de texto completo</strong></a> para lidar com consultas diretas como "Nike Air Max". Cada método resolve uma parte diferente do puzzle - e os sistemas práticos dependem de todos eles trabalharem em conjunto sem problemas.</p>
<p>O Milvus destaca-se na pesquisa vetorial e na filtragem de metadados e, a partir da versão 2.5, introduziu a pesquisa de texto completo com base no algoritmo BM25 optimizado. Esta atualização torna a pesquisa com IA mais inteligente e mais precisa, combinando a compreensão semântica com a intenção precisa de palavras-chave. Com o<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Milvus 2.6</a>, a pesquisa de texto completo torna-se ainda mais rápida - até<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> 4 vezes o desempenho do Elasticsearch</a>.</p>
<p>No centro desse recurso está o <strong>Milvus Analyzer</strong>, o componente que transforma o texto bruto em tokens pesquisáveis. É ele que permite que o Milvus interprete a linguagem de forma eficiente e realize a correspondência de palavras-chave em escala. No resto deste post, vamos analisar como o Milvus Analyzer funciona - e porque é que é a chave para desbloquear todo o potencial da pesquisa híbrida no Milvus.</p>
<h2 id="What-is-Milvus-Analyzer" class="common-anchor-header">O que é o Milvus Analyzer？<button data-href="#What-is-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>Para uma pesquisa de texto completo eficiente - seja para correspondência de palavras-chave ou recuperação semântica - o primeiro passo é sempre o mesmo: transformar o texto bruto em tokens que o sistema pode entender, indexar e comparar.</p>
<p>O <strong>Milvus Analyzer</strong> lida com essa etapa. É um componente integrado de pré-processamento e tokenização de texto que divide o texto de entrada em tokens discretos e, em seguida, normaliza, limpa e padroniza-os para garantir uma correspondência consistente entre consultas e documentos. Este processo estabelece as bases para uma pesquisa de texto completo precisa e de elevado desempenho e para uma recuperação híbrida.</p>
<p>Aqui está uma visão geral da arquitetura do Milvus Analyzer:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_5_8e0ec1dbdf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como mostra o diagrama, o Analyzer tem dois componentes principais: o <strong>Tokenizer</strong> e o <strong>Filter</strong>. Juntos, convertem o texto de entrada em tokens e optimizam-nos para uma indexação e recuperação eficientes.</p>
<ul>
<li><p><strong>Tokenizador</strong>: Divide o texto em tokens básicos utilizando métodos como a divisão de espaços em branco (Whitespace), a segmentação de palavras chinesas (Jieba) ou a segmentação multilingue (ICU).</p></li>
<li><p><strong>Filtro</strong>: Processa tokens através de transformações específicas. O Milvus inclui um conjunto rico de filtros incorporados para operações como a normalização de maiúsculas e minúsculas (Lowercase), remoção de pontuação (Removepunct), filtragem de palavras de paragem (Stop), stemming (Stemmer) e correspondência de padrões (Regex). Pode encadear vários filtros para lidar com necessidades de processamento complexas.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tokenizer_70a57e893c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Milvus oferece vários tipos de Analisadores: três opções integradas (Standard, Inglês e Chinês), Analisadores Personalizados onde define as suas próprias combinações de Tokenizer e Filtros, e o Analisador Multi-língua para lidar com documentos multilingues. O fluxo de processamento é simples: Texto em bruto → Tokenizer → Filtro → Tokens.</p>
<h3 id="Tokenizer" class="common-anchor-header">Tokenizador</h3><p>O Tokenizer é o primeiro passo do processamento. Divide o texto em bruto em tokens mais pequenos (palavras ou sub-palavras), e a escolha certa depende do seu idioma e caso de utilização.</p>
<p>Atualmente, o Milvus suporta os seguintes tipos de tokenizadores:</p>
<table>
<thead>
<tr><th><strong>Tokenizador</strong></th><th><strong>Caso de uso</strong></th><th><strong>Descrição</strong></th></tr>
</thead>
<tbody>
<tr><td>Padrão</td><td>Inglês e línguas delimitadas por espaço</td><td>O tokenizador de uso geral mais comum; detecta limites de palavras e faz a divisão de acordo.</td></tr>
<tr><td>Espaço em branco</td><td>Texto simples com pré-processamento mínimo</td><td>Divide apenas por espaços; não lida com pontuação ou caixa.</td></tr>
<tr><td>Jieba（Chinês）</td><td>Texto chinês</td><td>Dicionário e tokenizador baseado em probabilidade que divide caracteres chineses contínuos em palavras significativas.</td></tr>
<tr><td>Lindera（JP/KR）</td><td>Texto em japonês e coreano</td><td>Utiliza a análise morfológica Lindera para uma segmentação eficaz.</td></tr>
<tr><td>ICU（Multilingue）</td><td>Línguas complexas, como o árabe, e cenários multilingues</td><td>Baseado na biblioteca ICU com suporte para tokenização multilíngue em Unicode.</td></tr>
</tbody>
</table>
<p>É possível configurar o Tokenizer ao criar o esquema da sua coleção, especificamente ao definir os campos <code translate="no">VARCHAR</code> por meio do parâmetro <code translate="no">analyzer_params</code>. Por outras palavras, o Tokenizer não é um objeto autónomo mas uma configuração ao nível do campo. O Milvus realiza automaticamente a tokenização e o pré-processamento ao inserir os dados.</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
       <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>   <span class="hljs-comment"># Configure Tokenizer here</span>
    }
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Filter" class="common-anchor-header">Filtro</h3><p>Se o Tokenizer corta o texto, o Filter refina o que resta. Filtros padronizam, limpam, ou transformam seus tokens para torná-los prontos para pesquisa.</p>
<p>As operações comuns do Filtro incluem a normalização de maiúsculas e minúsculas, a remoção de palavras de paragem (como "o" e "e"), a remoção de pontuação e a aplicação de stemming (reduzindo "running" para "run").</p>
<p>O Milvus inclui muitos filtros incorporados para a maioria das necessidades de processamento de linguagem:</p>
<table>
<thead>
<tr><th><strong>Nome do filtro</strong></th><th><strong>Função</strong></th><th><strong>Utilização Caso</strong></th></tr>
</thead>
<tbody>
<tr><td>Minúsculas</td><td>Converte todos os tokens para minúsculas</td><td>Essencial para a pesquisa em inglês para evitar incompatibilidades de maiúsculas e minúsculas</td></tr>
<tr><td>Asciifolding</td><td>Converte caracteres acentuados para ASCII</td><td>Cenários multilingues (por exemplo, "café" → "cafe")</td></tr>
<tr><td>Apenas alfanuméricos</td><td>Mantém apenas letras e números</td><td>Retira símbolos mistos do texto, como registos</td></tr>
<tr><td>Cncharonly</td><td>Mantém apenas caracteres chineses</td><td>Limpeza de corpus chinês</td></tr>
<tr><td>Cnalphanumonly</td><td>Mantém apenas caracteres chineses, ingleses e números</td><td>Texto misto chinês-inglês</td></tr>
<tr><td>Comprimento</td><td>Filtra os tokens por comprimento</td><td>Remove tokens excessivamente curtos ou longos</td></tr>
<tr><td>Parar</td><td>Filtragem de palavras de paragem</td><td>Remove palavras sem significado de alta frequência como "é" e "o"</td></tr>
<tr><td>Descompactador</td><td>Divide palavras compostas</td><td>Línguas com compostos frequentes, como o alemão e o neerlandês</td></tr>
<tr><td>Separador de palavras</td><td>Decomposição de palavras</td><td>Cenários ingleses (por exemplo, &quot;studies&quot; e &quot;studying&quot; → &quot;study&quot;)</td></tr>
<tr><td>Removepunct</td><td>Remove a pontuação</td><td>Limpeza geral de texto</td></tr>
<tr><td>Regex</td><td>Filtra ou substitui com um padrão regex</td><td>Necessidades personalizadas, como extrair apenas endereços de e-mail</td></tr>
</tbody>
</table>
<p>O poder dos Filtros está na sua flexibilidade - pode misturar e combinar regras de limpeza com base nas suas necessidades. Para a pesquisa em inglês, uma combinação típica é Lowercase + Stop + Stemmer, garantindo a uniformidade das maiúsculas e minúsculas, removendo palavras de preenchimento e normalizando as formas das palavras para o seu radical.</p>
<p>Para a pesquisa em chinês, normalmente combina-se Maiúsculas + Stop para obter resultados mais limpos e precisos. Configure os filtros da mesma forma que os Tokenizers, através de <code translate="no">analyzer_params</code> no seu FieldSchema:</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
        <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
               <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
               <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
    }
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Analyzer-Types" class="common-anchor-header">Tipos de analisadores<button data-href="#Analyzer-Types" class="anchor-icon" translate="no">
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
    </button></h2><p>O Analisador certo torna a sua pesquisa mais rápida e mais económica. Para atender a diferentes necessidades, Milvus fornece três tipos: Built-in, Multi-language, e Custom Analyzers.</p>
<h3 id="Built-in-Analyzer" class="common-anchor-header">Analisador incorporado</h3><p>Os analisadores incorporados estão prontos para serem usados fora da caixa - configurações padrão que funcionam para a maioria dos cenários comuns. Eles vêm com combinações predefinidas de Tokenizer e Filtro:</p>
<table>
<thead>
<tr><th><strong>Nome</strong></th><th><strong>Componentes（Tokenizer+Filtros）</strong></th><th><strong>Caso de uso</strong></th></tr>
</thead>
<tbody>
<tr><td>Padrão</td><td>Tokenizador padrão + minúsculas</td><td>Uso geral para inglês ou idiomas delimitados por espaço</td></tr>
<tr><td>Inglês</td><td>Tokenizer standard + minúsculas + Stop + Stemmer</td><td>Pesquisa em inglês com maior precisão</td></tr>
<tr><td>Chinês</td><td>Tokenizer Jieba + Cnalphanumonly</td><td>Pesquisa de texto em chinês com segmentação natural de palavras</td></tr>
</tbody>
</table>
<p>Para uma pesquisa simples em inglês ou chinês, estes analisadores incorporados funcionam sem qualquer configuração adicional.</p>
<p>Uma nota importante: o Analisador Padrão foi concebido para o inglês por defeito. Se for aplicado a texto chinês, a pesquisa de texto completo pode não apresentar resultados.</p>
<h3 id="Multi-language-Analyzer" class="common-anchor-header">Analisador multilingue</h3><p>Quando se lida com vários idiomas, um único tokenizador muitas vezes não consegue lidar com tudo. É aí que entra o Analisador multilíngue - ele escolhe automaticamente o tokenizador correto com base no idioma de cada texto. Veja como os idiomas são mapeados para os Tokenizers:</p>
<table>
<thead>
<tr><th><strong>Código do idioma</strong></th><th><strong>Tokenizador usado</strong></th></tr>
</thead>
<tbody>
<tr><td>pt</td><td>Analisador de inglês</td></tr>
<tr><td>zh</td><td>Jieba</td></tr>
<tr><td>ja / ko</td><td>Lindera</td></tr>
<tr><td>ar</td><td>UTI</td></tr>
</tbody>
</table>
<p>Se o seu conjunto de dados misturar inglês, chinês, japonês, coreano e até árabe, o Milvus pode tratá-los a todos no mesmo campo. Isto reduz drasticamente o pré-processamento manual.</p>
<h3 id="Custom-Analyzer" class="common-anchor-header">Analisador personalizado</h3><p>Quando os analisadores incorporados ou multilingues não se adequam, Milvus permite-lhe construir analisadores personalizados. Misture e combine Tokenizers e Filtros para criar algo adaptado às suas necessidades. Aqui está um exemplo:</p>
<pre><code translate="no">FieldSchema(
        name=<span class="hljs-string">&quot;text&quot;</span>,
        dtype=DataType.VARCHAR,
        max_length=<span class="hljs-number">512</span>,
        analyzer_params={
           <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;jieba&quot;</span>,  
            <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;cncharonly&quot;</span>, <span class="hljs-string">&quot;stop&quot;</span>]  <span class="hljs-comment"># Custom combination for mixed Chinese-English text</span>
        }
    )
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hands-on-Coding-with-Milvus-Analyzer" class="common-anchor-header">Codificação prática com o Analisador Milvus<button data-href="#Hands-on-Coding-with-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>A teoria ajuda, mas nada supera um exemplo de código completo. Vamos ver como usar os Analisadores em Milvus com o Python SDK, cobrindo tanto os Analisadores integrados como os Analisadores multi-linguagem. Estes exemplos usam Milvus v2.6.1 e Pymilvus v2.6.1.</p>
<h3 id="How-to-Use-Built-in-Analyzer" class="common-anchor-header">Como usar o analisador incorporado</h3><p>Digamos que pretende criar uma coleção para pesquisa de texto em inglês que lida automaticamente com a tokenização e o pré-processamento durante a inserção de dados. Utilizaremos o Analisador de Inglês incorporado (equivalente a <code translate="no">standard + lowercase + stop + stemmer</code> ).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

schema = client.create_schema()

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,                  <span class="hljs-comment"># Field name</span>
    datatype=DataType.INT64,          <span class="hljs-comment"># Integer data type</span>
    is_primary=<span class="hljs-literal">True</span>,                  <span class="hljs-comment"># Designate as primary key</span>
    auto_id=<span class="hljs-literal">True</span>                      <span class="hljs-comment"># Auto-generate IDs (recommended)</span>
)

schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">1000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    analyzer_params={
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
            <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
            <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
        },
    enable_match=<span class="hljs-literal">True</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,                   <span class="hljs-comment"># Field name</span>
    datatype=DataType.SPARSE_FLOAT_VECTOR  <span class="hljs-comment"># Sparse vector data type</span>
)

bm25_function = Function(
    name=<span class="hljs-string">&quot;text_to_vector&quot;</span>,            <span class="hljs-comment"># Descriptive function name</span>
    function_type=FunctionType.BM25,  <span class="hljs-comment"># Use BM25 algorithm</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],       <span class="hljs-comment"># Process text from this field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>]     <span class="hljs-comment"># Store vectors in this field</span>
)

schema.add_function(bm25_function)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,        <span class="hljs-comment"># Field to index (our vector field)</span>
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,     <span class="hljs-comment"># Let Milvus choose optimal index type</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>          <span class="hljs-comment"># Must be BM25 for this feature</span>
)

COLLECTION_NAME = <span class="hljs-string">&quot;english_demo&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)  
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

client.create_collection(
    collection_name=COLLECTION_NAME,       <span class="hljs-comment"># Collection name</span>
    schema=schema,                         <span class="hljs-comment"># Our schema</span>
    index_params=index_params              <span class="hljs-comment"># Our search index configuration</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully created collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Prepare sample data</span>
sample_texts = [
    <span class="hljs-string">&quot;The quick brown fox jumps over the lazy dog&quot;</span>,
    <span class="hljs-string">&quot;Machine learning algorithms are revolutionizing artificial intelligence&quot;</span>,  
    <span class="hljs-string">&quot;Python programming language is widely used for data science projects&quot;</span>,
    <span class="hljs-string">&quot;Natural language processing helps computers understand human languages&quot;</span>,
    <span class="hljs-string">&quot;Deep learning models require large amounts of training data&quot;</span>,
    <span class="hljs-string">&quot;Search engines use complex algorithms to rank web pages&quot;</span>,
    <span class="hljs-string">&quot;Text analysis and information retrieval are important NLP tasks&quot;</span>,
    <span class="hljs-string">&quot;Vector databases enable efficient similarity searches&quot;</span>,
    <span class="hljs-string">&quot;Stemming reduces words to their root forms for better searching&quot;</span>,
    <span class="hljs-string">&quot;Stop words like &#x27;the&#x27;, &#x27;and&#x27;, &#x27;of&#x27; are often filtered out&quot;</span>
]

<span class="hljs-comment"># Insert data</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nInserting data...&quot;</span>)
data = [{<span class="hljs-string">&quot;text&quot;</span>: text} <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> sample_texts]

client.insert(
    collection_name=COLLECTION_NAME,
    data=data
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_texts)}</span> records&quot;</span>)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Tokenizer Analysis Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

test_text = <span class="hljs-string">&quot;The running dogs are jumping over the lazy cats&quot;</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nOriginal text: &#x27;<span class="hljs-subst">{test_text}</span>&#x27;&quot;</span>)

<span class="hljs-comment"># Use run_analyzer to show tokenization results</span>
analyzer_result = client.run_analyzer(
    texts=test_text,
    collection_name=COLLECTION_NAME,
    field_name=<span class="hljs-string">&quot;text&quot;</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Tokenization result: <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nBreakdown:&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- lowercase: Converts all letters to lowercase&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stop words: Filtered out [&#x27;of&#x27;, &#x27;to&#x27;] and common English stop words&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)&quot;</span>)

<span class="hljs-comment"># Full-text search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Full-Text Search Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

<span class="hljs-comment"># Wait for indexing to complete</span>
<span class="hljs-keyword">import</span> time
time.sleep(<span class="hljs-number">2</span>)

<span class="hljs-comment"># Search query examples</span>
search_queries = [
    <span class="hljs-string">&quot;jump&quot;</span>,           <span class="hljs-comment"># Test stem matching (should match &quot;jumps&quot;)</span>
    <span class="hljs-string">&quot;algorithm&quot;</span>,      <span class="hljs-comment"># Test exact matching</span>
    <span class="hljs-string">&quot;python program&quot;</span>, <span class="hljs-comment"># Test multi-word query</span>
    <span class="hljs-string">&quot;learn&quot;</span>          <span class="hljs-comment"># Test stem matching (should match &quot;learning&quot;)</span>
]

<span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_queries, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery <span class="hljs-subst">{i}</span>: &#x27;<span class="hljs-subst">{query}</span>&#x27;&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
    
    <span class="hljs-comment"># Execute full-text search</span>
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        data=[query],                    <span class="hljs-comment"># Query text</span>
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>],         <span class="hljs-comment"># Return original text</span>
        limit=<span class="hljs-number">3</span>                         <span class="hljs-comment"># Return top 3 results</span>
    )
    
    <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
        <span class="hljs-keyword">for</span> j, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[<span class="hljs-number">0</span>], <span class="hljs-number">1</span>):
            score = result[<span class="hljs-string">&quot;distance&quot;</span>]
            text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Result <span class="hljs-subst">{j}</span> (relevance: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>): <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No relevant results found&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search complete！&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Saída：</p>
<pre><code translate="no">Dropped existing collection: english_demo
Successfully created collection: english_demo

Inserting data...
Successfully inserted <span class="hljs-number">10</span> records

============================================================
Tokenizer Analysis Demo
============================================================

Original text: <span class="hljs-string">&#x27;The running dogs are jumping over the lazy cats&#x27;</span>
Tokenization result: [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;dog&#x27;</span>, <span class="hljs-string">&#x27;jump&#x27;</span>, <span class="hljs-string">&#x27;over&#x27;</span>, <span class="hljs-string">&#x27;lazi&#x27;</span>, <span class="hljs-string">&#x27;cat&#x27;</span>]

Breakdown:
- lowercase: Converts <span class="hljs-built_in">all</span> letters to lowercase
- stop words: Filtered out [<span class="hljs-string">&#x27;of&#x27;</span>, <span class="hljs-string">&#x27;to&#x27;</span>] <span class="hljs-keyword">and</span> common English stop words
- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)

============================================================
Full-Text Search Demo
============================================================

Query <span class="hljs-number">1</span>: <span class="hljs-string">&#x27;jump&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">2.0040</span>): The quick brown fox jumps over the lazy dog

Query <span class="hljs-number">2</span>: <span class="hljs-string">&#x27;algorithm&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Search engines use <span class="hljs-built_in">complex</span> algorithms to rank web pages

Query <span class="hljs-number">3</span>: <span class="hljs-string">&#x27;python program&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">3.7884</span>): Python programming language <span class="hljs-keyword">is</span> widely used <span class="hljs-keyword">for</span> data science projects

Query <span class="hljs-number">4</span>: <span class="hljs-string">&#x27;learn&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Deep learning models require large amounts of training data

============================================================
Search complete！
============================================================
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Use-Multi-language-Analyzer" class="common-anchor-header">Como usar o analisador multilíngue</h3><p>Quando seu conjunto de dados contém vários idiomas - inglês, chinês e japonês, por exemplo - você pode ativar o Analisador multilíngue. Milvus escolherá automaticamente o tokenizador correto com base no idioma de cada texto.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-keyword">import</span> time

<span class="hljs-comment"># Configure connection</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_demo&quot;</span>

<span class="hljs-comment"># Drop existing collection if present</span>
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

<span class="hljs-comment"># Create schema</span>
schema = client.create_schema()

<span class="hljs-comment"># Add primary key field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Add language identifier field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;language&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">50</span>
)

<span class="hljs-comment"># Add text field with multi-language analyzer configuration</span>
multi_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,  <span class="hljs-comment"># Select analyzer based on language field</span>
    <span class="hljs-string">&quot;analyzers&quot;</span>: {
        <span class="hljs-string">&quot;en&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>  <span class="hljs-comment"># English analyzer</span>
        },
        <span class="hljs-string">&quot;zh&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;chinese&quot;</span>  <span class="hljs-comment"># Chinese analyzer</span>
        },
        <span class="hljs-string">&quot;jp&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,  <span class="hljs-comment"># Use ICU tokenizer for Japanese</span>
            <span class="hljs-string">&quot;filter&quot;</span>: [
                <span class="hljs-string">&quot;lowercase&quot;</span>,
                {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>,
                    <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;は&quot;</span>, <span class="hljs-string">&quot;が&quot;</span>, <span class="hljs-string">&quot;の&quot;</span>, <span class="hljs-string">&quot;に&quot;</span>, <span class="hljs-string">&quot;を&quot;</span>, <span class="hljs-string">&quot;で&quot;</span>, <span class="hljs-string">&quot;と&quot;</span>]
                }
            ]
        },
        <span class="hljs-string">&quot;default&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>  <span class="hljs-comment"># Default to ICU general tokenizer</span>
        }
    },
    <span class="hljs-string">&quot;alias&quot;</span>: {
        <span class="hljs-string">&quot;english&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;chinese&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, 
        <span class="hljs-string">&quot;japanese&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>,
        <span class="hljs-string">&quot;中文&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>,
        <span class="hljs-string">&quot;英文&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;日文&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>
    }
}

schema.add_field(
    field_name=<span class="hljs-string">&quot;text&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">2000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    multi_analyzer_params=multi_analyzer_params
)

<span class="hljs-comment"># Add sparse vector field for BM25</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    datatype=DataType.SPARSE_FLOAT_VECTOR
)

<span class="hljs-comment"># Define BM25 function</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>]
)

schema.add_function(bm25_function)

<span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Prepare multilingual test data</span>
multilingual_data = [
    <span class="hljs-comment"># English data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Artificial intelligence is revolutionizing technology industries worldwide&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Machine learning algorithms process large datasets efficiently&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Vector databases provide fast similarity search capabilities&quot;</span>},
    
    <span class="hljs-comment"># Chinese data  </span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工智能正在改变世界各行各业&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;机器学习算法能够高效处理大规模数据集&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;向量数据库提供快速的相似性搜索功能&quot;</span>},
    
    <span class="hljs-comment"># Japanese data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工知能は世界中の技術産業に革命をもたらしています&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;機械学習アルゴリズムは大量のデータセットを効率的に処理します&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;ベクトルデータベースは高速な類似性検索機能を提供します&quot;</span>},
]

client.insert(
    collection_name=COLLECTION_NAME,
    data=multilingual_data
)

<span class="hljs-comment"># Wait for BM25 function to generate vectors</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Waiting for BM25 vector generation...&quot;</span>)
client.flush(COLLECTION_NAME)
time.sleep(<span class="hljs-number">5</span>)
client.load_collection(COLLECTION_NAME)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nTokenizer Analysis:&quot;</span>)

test_texts = {
    <span class="hljs-string">&quot;en&quot;</span>: <span class="hljs-string">&quot;The running algorithms are processing data efficiently&quot;</span>,
    <span class="hljs-string">&quot;zh&quot;</span>: <span class="hljs-string">&quot;这些运行中的算法正在高效地处理数据&quot;</span>, 
    <span class="hljs-string">&quot;jp&quot;</span>: <span class="hljs-string">&quot;これらの実行中のアルゴリズムは効率的にデータを処理しています&quot;</span>
}

<span class="hljs-keyword">for</span> lang, text <span class="hljs-keyword">in</span> test_texts.items():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{lang}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">try</span>:
        analyzer_result = client.run_analyzer(
            texts=text,
            collection_name=COLLECTION_NAME,
            field_name=<span class="hljs-string">&quot;text&quot;</span>,
            analyzer_names=[lang]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → Analysis failed: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-comment"># Multi-language search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch Test:&quot;</span>)

search_cases = [
    (<span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;人工智能&quot;</span>),
    (<span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;機械学習&quot;</span>),
    (<span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;algorithm&quot;</span>),
]

<span class="hljs-keyword">for</span> lang, query <span class="hljs-keyword">in</span> search_cases:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{lang}</span> &#x27;<span class="hljs-subst">{query}</span>&#x27;:&quot;</span>)
    <span class="hljs-keyword">try</span>:
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query],
            search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
            output_fields=[<span class="hljs-string">&quot;language&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>],
            limit=<span class="hljs-number">3</span>,
            <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;language == &quot;<span class="hljs-subst">{lang}</span>&quot;&#x27;</span>
        )
        
        <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
            <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> search_results[<span class="hljs-number">0</span>]:
                score = result[<span class="hljs-string">&quot;distance&quot;</span>]
                text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No results&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Error: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nComplete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Saída：</p>
<pre><code translate="no"><span class="hljs-title class_">Waiting</span> <span class="hljs-keyword">for</span> <span class="hljs-title class_">BM25</span> vector generation...

<span class="hljs-title class_">Tokenizer</span> <span class="hljs-title class_">Analysis</span>:
<span class="hljs-attr">en</span>: <span class="hljs-title class_">The</span> running algorithms are processing data efficiently
  → [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;algorithm&#x27;</span>, <span class="hljs-string">&#x27;process&#x27;</span>, <span class="hljs-string">&#x27;data&#x27;</span>, <span class="hljs-string">&#x27;effici&#x27;</span>]
<span class="hljs-attr">zh</span>: 这些运行中的算法正在高效地处理数据
  → [<span class="hljs-string">&#x27;这些&#x27;</span>, <span class="hljs-string">&#x27;运行&#x27;</span>, <span class="hljs-string">&#x27;中&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;算法&#x27;</span>, <span class="hljs-string">&#x27;正在&#x27;</span>, <span class="hljs-string">&#x27;高效&#x27;</span>, <span class="hljs-string">&#x27;地&#x27;</span>, <span class="hljs-string">&#x27;处理&#x27;</span>, <span class="hljs-string">&#x27;数据&#x27;</span>]
<span class="hljs-attr">jp</span>: これらの実行中のアルゴリズムは効率的にデータを処理しています
  → [<span class="hljs-string">&#x27;これらの&#x27;</span>, <span class="hljs-string">&#x27;実行&#x27;</span>, <span class="hljs-string">&#x27;中の&#x27;</span>, <span class="hljs-string">&#x27;アルゴリズム&#x27;</span>, <span class="hljs-string">&#x27;効率&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;データ&#x27;</span>, <span class="hljs-string">&#x27;処理&#x27;</span>, <span class="hljs-string">&#x27;し&#x27;</span>, <span class="hljs-string">&#x27;てい&#x27;</span>, <span class="hljs-string">&#x27;ます&#x27;</span>]

<span class="hljs-title class_">Search</span> <span class="hljs-title class_">Test</span>:

zh <span class="hljs-string">&#x27;人工智能&#x27;</span>:
  <span class="hljs-number">3.300</span>: 人工智能正在改变世界各行各业

jp <span class="hljs-string">&#x27;機械学習&#x27;</span>:
  <span class="hljs-number">3.649</span>: 機械学習アルゴリズムは大量のデータセットを効率的に処理します

en <span class="hljs-string">&#x27;algorithm&#x27;</span>:
  <span class="hljs-number">2.096</span>: <span class="hljs-title class_">Machine</span> learning algorithms process large datasets efficiently

<span class="hljs-title class_">Complete</span>
<button class="copy-code-btn"></button></code></pre>
<p>Além disso, o Milvus suporta o tokenizador language_identifier para pesquisa. Ele detecta automaticamente os idiomas de um determinado texto, o que significa que o campo de idioma é opcional. Para mais detalhes, confira<a href="https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md"> Como o Milvus 2.6 atualiza a pesquisa multilíngue de texto completo em escala</a>.</p>
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
    </button></h2><p>O Milvus Analyzer transforma o que costumava ser um simples passo de pré-processamento num sistema bem definido e modular para lidar com texto. O seu design - construído em torno da tokenização e da filtragem - dá aos programadores um controlo refinado sobre a forma como a linguagem é interpretada, limpa e indexada. Quer esteja a construir uma aplicação num único idioma ou um sistema RAG global que abrange vários idiomas, o Analyzer fornece uma base consistente para a pesquisa de texto completo. É a parte do Milvus que silenciosamente faz tudo o resto funcionar melhor.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
