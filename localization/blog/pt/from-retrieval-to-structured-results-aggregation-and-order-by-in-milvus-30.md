---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 'Da Recuperação a Resultados Estruturados: Agregação e ORDER BY no Milvus 3.0'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Saiba como o Milvus 3.0 adiciona agregação de consultas, Search Aggregation e
  ORDER BY no lado do servidor para resultados de busca vetorial estruturados e
  eficientes.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Considere um fluxo familiar de busca de produtos. Um comprador envia uma foto de um vestido, e a busca vetorial recupera um conjunto relevante de candidatos de um catálogo com dezenas de milhões de produtos.</p>
<p>A página, no entanto, precisa de mais do que uma lista ranqueada. Ela precisa de facetas de marca. Precisa de uma ordenação por preço. A equipe de merchandising quer saber quais marcas dominam esse conjunto de resultados, a faixa de preço dentro de cada marca e alguns produtos representativos de cada grupo.</p>
<p>Antes do Milvus 3.0, as aplicações geralmente lidavam com essa segunda etapa por conta própria: buscavam linhas no Milvus, agrupavam e ordenavam em pandas ou em uma camada de serviço, e então montavam a resposta. Algumas equipes mantinham um pipeline analítico separado apenas para calcular contagens e distribuições sobre dados que já estavam no banco de dados vetorial.</p>
<p>O banco de dados vetorial encontrava os candidatos; a aplicação precisava transformá-los em um resultado estruturado.</p>
<p>O Milvus 3.0 move mais desse trabalho para dentro do mecanismo de recuperação. Ele adiciona três capacidades relacionadas, mas distintas:</p>
<ul>
<li><strong>Agregação de consultas</strong> calcula <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code> sobre linhas filtradas e visíveis, com campos opcionais de <code translate="no">GROUP BY</code>.</li>
<li><strong>Search Aggregation</strong> organiza candidatos de vizinhos mais próximos aproximados (ANN) retidos em buckets, calcula métricas por bucket, cria buckets aninhados e retorna resultados representativos.</li>
<li><strong>No lado do servidor</strong>, <code translate="no">**ORDER BY**</code> ordena resultados de consulta ou candidatos ANN por um ou mais campos escalares antes que a aplicação os receba.</li>
</ul>
<p>A distinção entre consulta e busca é importante:</p>
<table>
<thead>
<tr><th>Capacidade</th><th>Dados sendo resumidos ou ordenados</th><th>Formato principal do resultado</th><th>Limite de exatidão</th></tr>
</thead>
<tbody>
<tr><td>Agregação de consultas</td><td>Todas as linhas visíveis que correspondem ao filtro</td><td>Uma linha por grupo, com valores agregados</td><td>Exata sobre o conjunto de linhas visíveis da consulta</td></tr>
<tr><td>Search Aggregation</td><td>Candidatos retidos pela busca ANN e pelo estágio de agrupamento</td><td>Buckets, métricas, resultados representativos e buckets filhos opcionais</td><td>Aproximada por design</td></tr>
<tr><td>Consulta com <code translate="no">ORDER BY</code></td><td>Linhas visíveis que correspondem ao filtro</td><td>Linhas ordenadas</td><td>Exata sobre o resultado filtrado da consulta</td></tr>
<tr><td>Busca com <code translate="no">ORDER BY</code></td><td>Candidatos ANN</td><td>Resultados ou grupos de busca ordenados</td><td>Não expande o limite de recall da ANN</td></tr>
</tbody>
</table>
<p>Este artigo explica por que essas operações pertencem ao banco de dados, como funciona a agregação distribuída, como o Search Aggregation difere do Grouping Search e onde a nova semântica termina.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Por que o pós-processamento no lado da aplicação deixa de funcionar<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Mover a agregação e a ordenação para a aplicação pode parecer uma pequena escolha de implementação. Em escala, isso cria três problemas maiores.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">A aplicação move muito mais dados do que a resposta contém</h3><p>Suponha que um painel operacional precise da contagem de produtos e do preço médio de cada categoria entre dois milhões de linhas em estoque. Mesmo com uma carga útil aproximada de apenas 100 bytes por linha para a categoria, preço, chave primária e sobrecarga de serialização, a aplicação precisa receber cerca de 200 MB de dados antes de poder calcular o resultado.</p>
<p>Se o catálogo tiver 200 categorias, a resposta terá apenas algumas centenas de chaves e números—na ordem de kilobytes. A aplicação move várias ordens de magnitude mais dados do que retorna, paga o mesmo custo a cada atualização e precisa de memória suficiente no cliente para manter ou transmitir as linhas intermediárias.</p>
<p>Uma agregação dentro do mecanismo altera a unidade de movimentação de dados. As linhas brutas permanecem onde estão. O que atravessa os nós e eventualmente sai do Milvus é o conjunto muito menor de estados parciais e finais de grupos.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">A ordenação local da página não é ordenação global</h3><p>Ordenar após a paginação é um bug de correção, não apenas uma implementação ineficiente.</p>
<p>Se uma aplicação busca as linhas 11 a 20 e ordena apenas essas linhas por preço, ela produziu a ordem de preço dentro dessa página—não as linhas 11 a 20 do resultado globalmente ordenado por preço. Uma página posterior pode conter produtos mais baratos do que todos os produtos da primeira página.</p>
<p>O mesmo limite é importante na busca vetorial. Buscar um pequeno conjunto Top-K e ordená-lo na aplicação só consegue reordenar esses candidatos. Isso não consegue recuperar candidatos relevantes que o estágio ANN não retornou, e muitas vezes leva as aplicações a buscar em excesso apenas para tornar útil a ordenação no lado do cliente.</p>
<p>A ordenação no lado do servidor dá ao Milvus controle sobre a sequência de ordenação e paginação. Para cargas de trabalho de consulta, o mecanismo ordena o conjunto de linhas filtradas antes de aplicar a janela da página. Para cargas de trabalho de busca, ele ordena dentro do limite dos candidatos ANN e mantém essa limitação explícita.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">O cliente não consegue reproduzir a visibilidade do banco de dados</h3><p>A agregação também depende de quais linhas são visíveis no timestamp da consulta. Exclusões, entidades expiradas e gravações concorrentes são governadas pelo controle de concorrência multiversão (MVCC) e pela semântica de consistência do Milvus.</p>
<p>Depois que as linhas brutas saem do banco de dados, a aplicação geralmente assume que o lote recebido representa o snapshot correto. Reconstruir as mesmas regras de visibilidade em um cliente é impraticável, especialmente enquanto a coleção está recebendo gravações e exclusões.</p>
<p>A solução comum—um segundo mecanismo analítico alimentado por exportação e ETL—adiciona outra cópia dos dados, outro limite de consistência e outro pipeline para operar. Contagens, métricas e ordenação devem ser executadas onde tanto os dados quanto suas regras de visibilidade já existem.</p>
<p>Agora, vamos ver o que o Milvus 3.0 oferece.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Agregação de consultas: estatísticas exatas sobre linhas visíveis<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>A agregação de consultas responde a perguntas como:</p>
<ul>
<li>Quantos produtos em estoque há em cada categoria?</li>
<li>Qual é o preço médio por marca?</li>
<li>Quais são os timestamps mínimo e máximo de eventos para cada host?</li>
<li>Quantos registros permanecem após a aplicação de um filtro e da visibilidade de TTL?</li>
</ul>
<p>A API parece familiar para qualquer pessoa que tenha usado SQL: passe um ou mais campos em <code translate="no">group_by_fields</code> e coloque expressões de agregação em <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>A sintaxe é a parte simples. O modelo de execução é o que torna o resultado útil em um banco de dados vetorial distribuído.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Estados locais ao segmento substituem a movimentação de linhas brutas</h3><p>Uma coleção do Milvus pode abranger centenas ou milhares de segmentos distribuídos por vários nós de consulta, com dados recém-gravados ainda no caminho de streaming. Nenhum nó de execução começa com todas as linhas visíveis.</p>
<p>Portanto, o Milvus empurra a agregação para os segmentos:</p>
<ol>
<li>Cada segmento aplica localmente o filtro e as regras de visibilidade MVCC.</li>
<li>O segmento emite um estado parcial por grupo em vez de suas linhas correspondentes.</li>
<li>Estados parciais são mesclados dentro de um nó de consulta.</li>
<li>O proxy realiza a mesclagem final entre nós e retorna os grupos concluídos.</li>
</ol>
<p>A quantidade de dados intermediários agora escala com o número de grupos e estados agregados, em vez de escalar diretamente com o número de linhas correspondentes.</p>
<p>A operação de mesclagem depende do agregado:</p>
<table>
<thead>
<tr><th>Agregado</th><th>Estado parcial</th><th>Regra de mesclagem</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Contagem parcial</td><td>Somar contagens</td></tr>
<tr><td><code translate="no">sum</code></td><td>Soma parcial</td><td>Somar somas</td></tr>
<tr><td><code translate="no">min</code></td><td>Mínimo parcial</td><td>Tomar o mínimo</td></tr>
<tr><td><code translate="no">max</code></td><td>Máximo parcial</td><td>Tomar o máximo</td></tr>
<tr><td><code translate="no">avg</code></td><td>Soma e contagem parciais</td><td>Somar ambos os estados e então dividir uma vez no estágio final</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> é o caso instrutivo. Tirar a média de duas médias parciais é incorreto quando as partições contêm números diferentes de linhas. O Milvus carrega <code translate="no">sum</code> e <code translate="no">count</code> independentemente e calcula a média final apenas depois que ambos foram mesclados globalmente.</p>
<p>Esse é um dos motivos pelos quais a agregação pertence ao banco de dados: a operação não é simplesmente “executar a mesma função em vários lotes”. O mecanismo precisa preservar a álgebra de cada agregado através dos limites de segmentos e nós.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">A visibilidade é aplicada antes da agregação</h3><p>Linhas excluídas e expiradas são removidas dos estados parciais no nível do segmento de acordo com o limite de visibilidade da consulta. Elas não sobem pela pilha para depois serem corrigidas na aplicação.</p>
<p>Portanto, o resultado descreve as linhas que o Milvus considera visíveis para aquela solicitação, não uma coleção arbitrária de lotes obtidos em momentos ligeiramente diferentes.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> agora conta grupos</h3><p>Em uma consulta normal, <code translate="no">limit</code> controla quantas linhas de entidade são retornadas. Em uma consulta agrupada, ele controla quantos grupos são retornados. Como a cardinalidade do resultado é determinada por grupos, e não por linhas correspondentes, uma agregação de consulta também pode omitir <code translate="no">limit</code> quando precisa de todos os grupos.</p>
<p>Isso parece um pequeno detalhe de API, mas reflete um modelo de resultado diferente: a saída não é mais uma página de entidades. É uma relação cujas linhas representam grupos.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: uma visão em buckets dos candidatos ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>A agregação de consultas responde: “Como são as linhas visíveis que correspondem a este filtro?” O Search Aggregation faz uma pergunta diferente: “Como é o conjunto de candidatos recuperado para este vetor?”</p>
<p>Essa operação não tem equivalente SQL exato. A busca ANN primeiro estabelece um limite de candidatos orientado por similaridade. O Milvus então organiza os candidatos retidos por chaves escalares e retorna uma árvore de buckets em vez de uma lista plana comum de resultados.</p>
<p>Um bucket pode conter:</p>
<ul>
<li>uma chave como <code translate="no">brand</code> ou uma chave composta como <code translate="no">(brand, color)</code>;</li>
<li>uma contagem de candidatos retidos;</li>
<li>métricas incluindo <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code>;</li>
<li>entidades representativas selecionadas com <code translate="no">top_hits</code>; e</li>
<li>uma <code translate="no">sub_aggregation</code> aninhada que cria buckets filhos.</li>
</ul>
<p>Para a página de busca de produtos, uma solicitação pode retornar buckets de marca, o preço médio dentro de cada bucket e três produtos representativos por marca:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Quando <code translate="no">search_aggregation</code> está definido, a lista comum de resultados fica vazia. A aplicação lê a resposta de buckets em <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">A especificação de agregação define dois limites diferentes</h3><p>O Search Aggregation não executa <code translate="no">GROUP BY</code> sobre todas as entidades da coleção, e também não simplesmente pega uma resposta Top-K comum e agrega essa lista plana.</p>
<p>Sua execução tem três estágios:</p>
<ol>
<li>O Milvus executa a busca ANN para recuperar candidatos próximos ao vetor de consulta.</li>
<li>O estágio de agrupamento retém um número limitado de candidatos para cada chave completa de bucket.</li>
<li>O Milvus cria buckets, calcula métricas sobre os candidatos retidos, ordena os buckets e anexa resultados representativos ou buckets filhos.</li>
</ol>
<p>Dois parâmetros controlam partes diferentes do resultado:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> limita quantos buckets são retornados naquele nível de agregação.</li>
<li>O maior <code translate="no">TopHits.size</code> em qualquer lugar da árvore de agregação define o orçamento de candidatos retidos para cada chave composta completa. Se a solicitação não contiver <code translate="no">top_hits</code>, o orçamento por chave terá como padrão um.</li>
</ul>
<p>O <code translate="no">limit</code> da busca de nível superior não controla esse modo e é ignorado quando <code translate="no">search_aggregation</code> está presente.</p>
<p>Essa distinção é essencial ao interpretar o <code translate="no">count</code> ou as métricas de um bucket. Com <code translate="no">TopHits(size=3)</code>, um bucket de marca pode resumir no máximo três candidatos retidos para sua chave completa, mesmo que a coleção contenha milhares de produtos relevantes dessa marca. Aumentar <code translate="no">TopHits.size</code> amplia a janela de métricas por chave, mas não transforma a busca ANN em uma varredura exata.</p>
<p>Se a aplicação precisa de estatísticas exatas sobre todas as linhas visíveis que correspondem a um filtro, deve usar agregação de consultas. O Search Aggregation serve para descrever e comparar os candidatos produzidos pela recuperação por similaridade.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation e Grouping Search resolvem problemas diferentes<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus oferece suporte ao Grouping Search (<code translate="no">group_by</code>)desde o Milvus 2.4. É fácil ver a palavra “agrupamento” nos dois recursos e assumir que são duas interfaces para a mesma operação. Seus contratos de saída são diferentes.</p>
<p><strong>Grouping Search</strong> altera quais entidades aparecem em uma lista de resultados ranqueada. Um padrão comum de RAG armazena chunks como entidades individuais, agrupa-os por <code translate="no">doc_id</code> e retorna um ou alguns chunks de cada documento. A saída principal continua sendo resultados de busca comuns, mas com menos valores repetidos do campo de agrupamento.</p>
<p><strong>Search Aggregation</strong> retorna uma visão estatística. A saída principal é uma árvore de buckets contendo chaves, contagens, métricas, resultados representativos e buckets filhos opcionais.</p>
<table>
<thead>
<tr><th>Necessidade da aplicação</th><th>Preferir</th><th>Consumir</th></tr>
</thead>
<tbody>
<tr><td>Uma lista de entidades ranqueada com maior diversidade em um campo</td><td>Grouping Search</td><td>Resultados de busca comuns</td></tr>
<tr><td>Contagens de facetas, métricas por grupo, resultados representativos ou distribuições aninhadas</td><td>Search Aggregation</td><td>Objetos <code translate="no">AggregationBucket</code> em <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Uma regra prática é começar pelo formato de resposta da UI ou da API. Se a aplicação renderiza uma lista, Grouping Search geralmente é o primitivo certo. Se ela renderiza facetas, cartões de distribuição ou uma hierarquia de grupos, use Search Aggregation.</p>
<p>Os dois modos são mutuamente exclusivos em uma solicitação porque definem formatos principais de resultado diferentes.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: mova a ordenação para antes do limite da aplicação<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>A ordenação é o recurso menos exótico desta versão e um dos mais fáceis de implementar incorretamente fora do mecanismo.</p>
<p>O Milvus 3.0 expõe ordenação tanto em consulta quanto em busca, mas os dois caminhos usam parâmetros de SDK diferentes e operam sobre conjuntos de entrada diferentes.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">A ordenação de consultas ordena o conjunto de linhas filtradas</h3><p>A consulta do PyMilvus usa <code translate="no">order_by</code>, expresso como uma lista de strings <code translate="no">&quot;field:direction&quot;</code>. O mecanismo aplica o filtro, ordena as linhas visíveis e então aplica <code translate="no">limit</code> e <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Isso torna a consulta útil para navegação ordenada por negócios: registros ingeridos mais recentes, produtos de maior preço dentro de um filtro, menor estoque ou valores extremos para inspeção de dados. Sem ordenação no lado do servidor, as aplicações precisavam recuperar as linhas primeiro e não conseguiam definir uma ordem de negócio confiável entre páginas.</p>
<p>Para campos de consulta anuláveis, a ordem crescente coloca nulos por último e a ordem decrescente os coloca primeiro. Um campo de ordenação não precisa aparecer em <code translate="no">output_fields</code>; inclua-o apenas quando a aplicação precisar do valor na resposta.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">A ordenação de busca reordena o conjunto de candidatos ANN</h3><p>A busca do PyMilvus usa <code translate="no">order_by_fields</code>, em que cada entrada nomeia um campo escalar e uma direção:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>A ANN ainda determina quais entidades se tornam candidatas. <code translate="no">order_by_fields</code> altera como esses candidatos são retornados; ela não faz a busca varrer globalmente a coleção pelos produtos mais baratos.</p>
<p>Esse limite dá às duas APIs funções distintas:</p>
<ul>
<li>Use consulta mais <code translate="no">order_by</code> quando a própria ordem escalar define o resultado, como os dez produtos em estoque mais baratos.</li>
<li>Use busca mais <code translate="no">order_by_fields</code> quando a relevância semântica ou vetorial define o conjunto de candidatos e um campo escalar determina como esses candidatos devem ser apresentados.</li>
</ul>
<p>A ordenação por vários campos aplica as chaves na ordem da lista. Quando candidatos de busca têm os mesmos valores para todas as chaves escalares especificadas, o Milvus preserva sua ordem original por pontuação de similaridade.</p>
<p>A ordenação também se compõe com o Grouping Search. O Milvus ordena grupos pelo valor escalar configurado da entidade principal de cada grupo, mantendo o formato de resultado agrupado. Isso é útil quando a aplicação quer tanto diversidade em um campo quanto uma ordem de grupos relevante para o negócio.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">O que essas capacidades tornam possível<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>As APIs são primitivas gerais de banco de dados, mas várias cargas de trabalho de recuperação se beneficiam imediatamente.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG e agentes: inspecionar a concentração da recuperação</h3><p>Um sistema RAG ou agêntico pode agrupar chunks recuperados por documento de origem, linha de produto, tenant ou tipo de conteúdo. Um resultado concentrado em dois documentos carrega um sinal de cobertura diferente de um resultado espalhado por dezenas de fontes.</p>
<p>Essa distribuição não é uma garantia de qualidade da resposta. Ela é, no entanto, um diagnóstico de recuperação útil que uma aplicação ou agente pode combinar com pontuações, citações e outras verificações ao decidir se deve ampliar a consulta, recuperar novamente ou pedir esclarecimento.</p>
<p>Grouping Search continua sendo a escolha certa quando o objetivo é simplesmente diversificar os chunks retornados. Search Aggregation é útil quando o sistema precisa da própria distribuição.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce e recomendação de conteúdo: retornar facetas junto com a busca</h3><p>A página inicial de busca de produtos pode receber buckets de marca, métricas de preço, itens representativos e uma lista de candidatos ordenada por escalar a partir do Milvus. A aplicação ainda controla a apresentação e a lógica de negócio, mas não precisa mais reconstruir semânticas básicas de bucket a partir de resultados exportados.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Logs e segurança: combinar similaridade com distribuição de incidentes</h3><p>A busca por similaridade pode encontrar eventos relacionados a uma linha de log suspeita. O Search Aggregation pode então mostrar quais hosts dominam esses candidatos, o timestamp mínimo e máximo em cada bucket de host ou como os candidatos se dividem por severidade e serviço.</p>
<p>O resultado continua sendo uma visão dos candidatos recuperados, e não uma contagem global exata de incidentes. Quando a investigação precisa de contagens exatas sobre todos os eventos que correspondem a um filtro, a agregação de consultas fornece esse segundo caminho.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operações e exploração de dados: calcular em vez de exportar</h3><p>Painéis e ferramentas administrativas podem executar contagens e médias exatas sobre linhas filtradas e então navegar pelas entidades subjacentes em uma ordem escalar definida. Isso remove muitos utilitários pontuais de “exportar, calcular e ordenar”, sem fingir que o Milvus se tornou um banco de dados analítico completo.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Limites: o que agregação e <code translate="no">ORDER BY</code> não substituem<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Esses recursos estendem o mecanismo de recuperação; eles não transformam o Milvus em um sistema de processamento analítico online (OLAP).</p>
<ul>
<li>A agregação de consultas oferece suporte a agrupamento mais <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code>. Ela não adiciona joins, funções de janela ou subconsultas complexas. Grandes trabalhos analíticos offline ainda pertencem a sistemas como Spark, que podem trabalhar com snapshots do Milvus 3.0 e caminhos de armazenamento compartilhado.</li>
<li>Chaves de grupo de consulta oferecem suporte a campos inteiros, <code translate="no">VARCHAR</code> e <code translate="no">TIMESTAMPTZ</code>. As chaves de bucket do Search Aggregation também oferecem suporte a campos booleanos. Valores de ponto flutuante, vetores, JSON e arrays não são chaves de bucket.</li>
<li>Para Search Aggregation, <code translate="no">count</code> aceita <code translate="no">&quot;*&quot;</code> ou uma origem não JSON e não dinâmica; <code translate="no">sum</code> e <code translate="no">avg</code> exigem origens numéricas; e <code translate="no">min</code> e <code translate="no">max</code> também oferecem suporte a origens string e <code translate="no">TIMESTAMPTZ</code>. A agregação de consultas segue os mesmos limites de tipos aritméticos. Consulte o guia da API antes de aplicar um agregado a um tipo de campo complexo.</li>
<li>A agregação de consultas pode ordenar a saída agrupada por chaves de grupo, enquanto a ordenação por um agregado calculado como <code translate="no">count(*)</code> continua sendo um limite atual. Sem uma ordem explícita, a ordem dos grupos não é garantida.</li>
<li>Search Aggregation atualmente não pode ser combinado com Hybrid Search, Grouping Search, Search Iterators, um offset diferente de zero ou realce na mesma solicitação.</li>
<li>Contagens e métricas do Search Aggregation descrevem candidatos ANN retidos, não a coleção completa nem todas as entidades que possam ser semanticamente relevantes.</li>
<li>O <code translate="no">ORDER BY</code> de busca altera a apresentação dos candidatos. Ele não corrige candidatos ANN perdidos nem converte a recuperação por similaridade em uma consulta Top-N escalar exata.</li>
</ul>
<p>A forma mais clara de escolher entre os novos primitivos é começar pela pergunta:</p>
<ul>
<li>Para estatísticas exatas sobre linhas visíveis filtradas, use agregação de consultas.</li>
<li>Para uma distribuição sobre candidatos de recuperação por similaridade, use Search Aggregation.</li>
<li>Para uma lista ranqueada diversa, use Grouping Search.</li>
<li>Para uma ordem escalar definida, use consulta ou busca com <code translate="no">ORDER BY</code> de acordo com o caminho que estabeleceu o conjunto de resultados.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">De listas de candidatos a resultados estruturados<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Bancos de dados vetoriais tradicionalmente otimizaram uma pergunta: quais K entidades estão mais próximas deste vetor?</strong></p>
<p>Sistemas de recuperação em produção fazem perguntas de acompanhamento imediatamente. Quais grupos dominam o resultado? Quais são suas contagens e intervalos? Quais exemplos representam cada grupo? Em que ordem de negócio a aplicação deve apresentar as linhas ou candidatos?</p>
<p>O Milvus 3.0 traz essas operações para o mesmo mecanismo que é dono dos dados, do limite de candidatos ANN e da semântica de visibilidade. A agregação de consultas realiza redução distribuída exata sobre linhas visíveis. O Search Aggregation constrói uma visão em buckets sobre candidatos ANN retidos. <code translate="no">ORDER BY</code> dá aos caminhos de consulta e busca uma ordem escalar no lado do servidor, sem pedir que a aplicação a reconstrua página por página.</p>
<p>O resultado não é um mecanismo OLAP escondido dentro de um banco de dados vetorial. É um mecanismo de recuperação que consegue retornar mais da estrutura de que as aplicações realmente precisam.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Experimente agregação e <code translate="no">ORDER BY</code> no Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 3.0 já está disponível. Use o <a href="https://milvus.io/docs/get-and-scalar-query.md">guia de consultas</a> para agregação exata e ordenação de consultas, o <a href="https://milvus.io/docs/search-aggregation.md">guia de Search Aggregation</a> para semântica e limites de buckets, o <a href="https://milvus.io/docs/single-vector-search.md">guia de Basic Vector Search</a> para ordenação de buscas e o <a href="https://milvus.io/docs/grouping-search.md">guia de Grouping Search</a> quando seu objetivo principal for diversidade de resultados.</p>
<p>Para a versão mais ampla, consulte o <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lançamento do Milvus 3.0</a>, as <a href="https://milvus.io/docs/release_notes.md">notas de versão do Milvus 3.0</a> e o <a href="https://github.com/milvus-io/milvus">repositório milvus-io/milvus</a>.</p>
<p>Se você quiser avaliar as mesmas APIs sem operar o cluster por conta própria, experimente-as no <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. A <a href="https://docs.zilliz.com/reference/python/python/Vector-query">referência atual de consultas do Zilliz Cloud</a> e a <a href="https://docs.zilliz.com/reference/python/python/Vector-search">referência de busca</a> descrevem disponibilidade e parâmetros para tipos de cluster gerenciado.</p>
<p>Para discutir uma carga de trabalho ou um caso limite com a equipe, participe da <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus no Discord</a> ou agende uma <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">sessão de Milvus Office Hours</a>.</p>
