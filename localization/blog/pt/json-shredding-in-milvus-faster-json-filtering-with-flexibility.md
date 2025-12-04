---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: >-
  Fragmentação JSON em Milvus: filtragem JSON 88,9x mais rápida com
  flexibilidade
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Descubra como o Milvus JSON Shredding utiliza o armazenamento colunar
  optimizado para acelerar as consultas JSON até 89×, preservando a
  flexibilidade total do esquema.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Os sistemas de IA modernos estão a produzir mais dados JSON semiestruturados do que nunca. As informações de clientes e produtos são compactadas em um objeto JSON, os microsserviços emitem logs JSON em cada solicitação, os dispositivos IoT transmitem leituras de sensores em cargas JSON leves e os aplicativos de IA atuais padronizam cada vez mais o JSON para saída estruturada. O resultado é uma enxurrada de dados do tipo JSON fluindo para bancos de dados vetoriais.</p>
<p>Tradicionalmente, há duas maneiras de lidar com documentos JSON:</p>
<ul>
<li><p><strong>Predefinir cada campo do JSON em um esquema fixo e criar um índice:</strong> Essa abordagem oferece um bom desempenho de consulta, mas é rígida. Uma vez que o formato dos dados muda, cada campo novo ou modificado aciona outra rodada de atualizações dolorosas da Linguagem de Definição de Dados (DDL) e migrações de esquema.</p></li>
<li><p><strong>Armazene todo o objeto JSON como uma única coluna (tanto o tipo JSON quanto o Dynamic Schema no Milvus usam essa abordagem):</strong> Esta opção oferece excelente flexibilidade, mas ao custo do desempenho da consulta. Cada solicitação requer análise de JSON em tempo de execução e, muitas vezes, uma varredura completa da tabela, resultando em latência que aumenta à medida que o conjunto de dados cresce.</p></li>
</ul>
<p>Costumava ser um dilema de flexibilidade e desempenho.</p>
<p>Não é mais assim com o recurso JSON Shredding recentemente introduzido no <a href="https://milvus.io/">Milvus</a>.</p>
<p>Com a introdução do <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, o Milvus agora consegue agilidade sem esquema com o desempenho do armazenamento colunar, finalmente tornando os dados semi-estruturados em grande escala flexíveis e fáceis de consultar.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Como funciona a fragmentação de JSON<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>A fragmentação de JSON acelera as consultas JSON ao transformar documentos JSON baseados em linhas em armazenamento colunar altamente otimizado. O Milvus preserva a flexibilidade do JSON para modelagem de dados enquanto otimiza automaticamente o armazenamento em colunas - melhorando significativamente o acesso aos dados e o desempenho das consultas.</p>
<p>Para lidar com campos JSON esparsos ou raros de forma eficiente, o Milvus também tem um índice invertido para chaves partilhadas. Tudo isto acontece de forma transparente para os utilizadores: pode inserir documentos JSON como habitualmente, e deixar que seja o Milvus a gerir internamente a estratégia de armazenamento e indexação ideal.</p>
<p>Quando o Milvus recebe registos JSON em bruto com formas e estruturas variadas, analisa cada chave JSON quanto à sua taxa de ocorrência e estabilidade de tipo (se o seu tipo de dados é consistente entre documentos). Com base nesta análise, cada chave é classificada numa de três categorias:</p>
<ul>
<li><p><strong>Chaves digitadas:</strong> Chaves que aparecem na maioria dos documentos e têm sempre o mesmo tipo de dados (por exemplo, todos os números inteiros ou todas as cadeias de caracteres).</p></li>
<li><p><strong>Chaves dinâmicas</strong>: Chaves que aparecem frequentemente mas têm tipos de dados mistos (por exemplo, por vezes uma cadeia de caracteres, por vezes um número inteiro).</p></li>
<li><p><strong>Chaves partilhadas:</strong> Chaves que são infrequentes, esparsas ou aninhadas, ficando abaixo de um limite de frequência configurável.</p></li>
</ul>
<p>O Milvus lida com cada categoria de forma diferente para maximizar a eficiência:</p>
<ul>
<li><p><strong>As chaves tipadas</strong> são armazenadas em colunas dedicadas e fortemente tipadas.</p></li>
<li><p><strong>Chaves dinâmicas</strong> são colocadas em colunas dinâmicas com base no tipo de valor real observado em tempo de execução.</p></li>
<li><p>Tanto as colunas tipadas como as dinâmicas são armazenadas em formatos colunares Arrow/Parquet para uma pesquisa rápida e uma execução de consulta altamente optimizada.</p></li>
<li><p><strong>As chaves partilhadas</strong> são consolidadas numa coluna JSON binária compacta, acompanhada por um índice invertido de chave partilhada. Este índice acelera as consultas em campos de baixa frequência, eliminando antecipadamente as linhas irrelevantes e restringindo a pesquisa apenas aos documentos que contêm a chave consultada.</p></li>
</ul>
<p>Essa combinação de armazenamento colunar adaptável e indexação invertida forma o núcleo do mecanismo de fragmentação JSON do Milvus, permitindo flexibilidade e alto desempenho em escala.</p>
<p>O fluxo de trabalho geral é ilustrado abaixo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora que cobrimos o básico de como a fragmentação JSON funciona, vamos dar uma olhada mais de perto nos principais recursos que tornam essa abordagem flexível e de alto desempenho.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Fragmentação e colunarização</h3><p>Quando um novo documento JSON é escrito, Milvus o divide e o reorganiza em um armazenamento colunar otimizado:</p>
<ul>
<li><p>Chaves digitadas e dinâmicas são automaticamente identificadas e armazenadas em colunas dedicadas.</p></li>
<li><p>Se o JSON contém objectos aninhados, o Milvus gera automaticamente nomes de colunas baseados em caminhos. Por exemplo, um campo <code translate="no">name</code> dentro de um objeto <code translate="no">user</code> pode ser armazenado com o nome de coluna <code translate="no">/user/name</code>.</p></li>
<li><p>As chaves partilhadas são armazenadas em conjunto numa única coluna JSON binária compacta. Como essas chaves aparecem com pouca frequência, o Milvus cria um índice invertido para elas, permitindo uma filtragem rápida e permitindo que o sistema localize rapidamente as linhas que contêm a chave especificada.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Gestão inteligente de colunas</h3><p>Para além de fragmentar o JSON em colunas, o Milvus acrescenta uma camada adicional de inteligência através da gestão dinâmica de colunas, garantindo que a fragmentação JSON se mantém flexível à medida que os dados evoluem.</p>
<ul>
<li><p><strong>Colunas criadas conforme necessário:</strong> Quando novas chaves aparecem em documentos JSON de entrada, o Milvus agrupa automaticamente valores com a mesma chave numa coluna dedicada. Isto preserva as vantagens de desempenho do armazenamento em colunas sem exigir que os utilizadores concebam esquemas antecipadamente. O Milvus também infere o tipo de dados dos novos campos (por exemplo, INTEGER, DOUBLE, VARCHAR) e seleciona um formato colunar eficiente para eles.</p></li>
<li><p><strong>Todas as chaves são tratadas automaticamente:</strong> Milvus analisa e processa cada chave no documento JSON. Isto garante uma ampla cobertura de consulta sem forçar os utilizadores a predefinir campos ou construir índices antecipadamente.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Otimização de Consultas</h3><p>Uma vez que os dados são reorganizados nas colunas certas, Milvus seleciona o caminho de execução mais eficiente para cada consulta:</p>
<ul>
<li><p><strong>Varredura direta de colunas para chaves digitadas e dinâmicas:</strong> Se uma consulta visa um campo que já foi dividido na sua própria coluna, o Milvus pode pesquisar essa coluna diretamente. Isso reduz a quantidade total de dados que precisam ser processados e aproveita a computação colunar acelerada por SIMD para uma execução ainda mais rápida.</p></li>
<li><p><strong>Pesquisa indexada para chaves partilhadas:</strong> Se a consulta envolver um campo que não foi promovido para a sua própria coluna - normalmente uma chave rara - o Milvus avalia-a em relação à coluna de chave partilhada. O índice invertido construído nesta coluna permite ao Milvus identificar rapidamente quais as linhas que contêm a chave especificada e saltar as restantes, melhorando significativamente o desempenho dos campos de baixa frequência.</p></li>
<li><p><strong>Gestão automática de metadados:</strong> O Milvus mantém continuamente metadados e dicionários globais para que as consultas permaneçam precisas e eficientes, mesmo quando a estrutura dos documentos JSON de entrada evolui com o tempo.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Referências de desempenho<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Concebemos um parâmetro de referência para comparar o desempenho de consulta do armazenamento de todo o documento JSON como um único campo em bruto em comparação com a utilização da funcionalidade JSON Shredding recentemente lançada.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Ambiente de teste e metodologia</h3><ul>
<li><p>Hardware: cluster de 1 núcleo/8 GB</p></li>
<li><p>Conjunto de dados: 1 milhão de documentos do <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Metodologia: Medir o QPS e a latência em diferentes padrões de consulta</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Resultados: chaves digitadas</h3><p>Este teste mediu o desempenho ao consultar uma chave presente na maioria dos documentos.</p>
<table>
<thead>
<tr><th>Expressão de consulta</th><th>QPS (sem fragmentação)</th><th>QPS (com fragmentação)</th><th>Aumento de desempenho</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Resultados: chaves partilhadas</h3><p>Este teste concentrou-se na consulta de chaves esparsas e aninhadas que se enquadram na categoria "partilhada".</p>
<table>
<thead>
<tr><th>Expressão da consulta</th><th>QPS (sem fragmentação)</th><th>QPS (com fragmentação)</th><th>Aumento de desempenho</th></tr>
</thead>
<tbody>
<tr><td>json['identidade']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>As consultas de chave compartilhada mostram as melhorias mais drásticas (até 89× mais rápidas), enquanto as consultas de chave digitada fornecem acelerações consistentes de 15-30×. No geral, todos os tipos de consulta se beneficiam do JSON Shredding, com ganhos claros de desempenho em toda a linha.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Experimente agora<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Quer esteja a trabalhar com registos de API, dados de sensores IoT ou cargas úteis de aplicações em rápida evolução, o JSON Shredding dá-lhe a rara capacidade de ter flexibilidade e elevado desempenho.</p>
<p>O recurso já está disponível e é bem-vindo para experimentá-lo agora. Você também pode consultar <a href="https://milvus.io/docs/json-shredding.md">este documento</a> para obter mais detalhes.</p>
<p>Tem perguntas ou quer um mergulho profundo em qualquer caraterística do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>E se quiser explorar ainda mais, fique atento a outros mergulhos profundos ao longo da nossa série Milvus Week.</p>
