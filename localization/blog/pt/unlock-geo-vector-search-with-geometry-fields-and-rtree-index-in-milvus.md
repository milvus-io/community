---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  O espacial encontra o semântico: Desbloquear a Pesquisa Geo-Vetorial com
  Campos Geométricos e Índice RTREE em Milvus
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Milvus Geometry Field and RTREE Index for Geo-Vector Search
desc: >-
  Saiba como o Milvus 2.6 unifica a pesquisa vetorial com a indexação
  geoespacial utilizando os campos Geometry e o índice RTREE, permitindo uma
  recuperação de IA precisa e com reconhecimento de localização.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>À medida que os sistemas modernos se tornam mais inteligentes, os dados de geolocalização tornaram-se essenciais para aplicações como as recomendações baseadas em IA, a expedição inteligente e a condução autónoma.</p>
<p>Por exemplo, quando encomenda comida em plataformas como a DoorDash ou a Uber Eats, o sistema tem em conta muito mais do que a distância entre si e o restaurante. Também tem em conta as classificações dos restaurantes, as localizações dos estafetas, as condições de trânsito e até as suas preferências pessoais. Na condução autónoma, os veículos têm de efetuar o planeamento do caminho, a deteção de obstáculos e a compreensão semântica do cenário, muitas vezes em apenas alguns milissegundos.</p>
<p>Tudo isto depende da capacidade de indexar e recuperar dados geoespaciais de forma eficiente.</p>
<p>Tradicionalmente, os dados geográficos e os dados vectoriais viviam em dois sistemas separados:</p>
<ul>
<li><p>Os sistemas geoespaciais armazenam coordenadas e relações espaciais (latitude, longitude, regiões poligonais, etc.).</p></li>
<li><p>As bases de dados vectoriais tratam as incorporações semânticas e a pesquisa de semelhanças geradas por modelos de IA.</p></li>
</ul>
<p>Esta separação complica a arquitetura, torna as consultas mais lentas e dificulta a realização simultânea de raciocínios espaciais e semânticos pelas aplicações.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">O Milvus 2.6</a> resolve este problema introduzindo o <a href="https://milvus.io/docs/geometry-field.md">campo Geometry</a>, que permite combinar diretamente a pesquisa de semelhanças vectoriais com restrições espaciais. Isso permite casos de uso como:</p>
<ul>
<li><p>Serviço de Base de Localização (LBS): "encontrar POIs semelhantes dentro deste quarteirão"</p></li>
<li><p>Pesquisa multimodal: "recuperar fotografias semelhantes num raio de 1 km deste ponto"</p></li>
<li><p>Mapas e logística: "activos dentro de uma região" ou "rotas que intersectam um caminho"</p></li>
</ul>
<p>Em conjunto com o novo <a href="https://milvus.io/docs/rtree.md">índice RTREE - uma</a>estrutura em árvore optimizada para filtragem espacial - o Milvus suporta agora operadores geoespaciais eficientes como <code translate="no">st_contains</code>, <code translate="no">st_within</code> e <code translate="no">st_dwithin</code> juntamente com a pesquisa vetorial de alta dimensão. Juntos, eles tornam a recuperação inteligente espacialmente consciente não apenas possível, mas prática.</p>
<p>Nesta publicação, vamos explicar como funcionam o Campo Geométrico e o índice RTREE e como se combinam com a pesquisa de semelhança vetorial para permitir aplicações espácio-semânticas do mundo real.</p>
<h2 id="What-Is-a-Geometry-Field" class="common-anchor-header">O que é um campo geométrico?<button data-href="#What-Is-a-Geometry-Field" class="anchor-icon" translate="no">
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
    </button></h2><p>Um <strong>campo geométrico</strong> é um tipo de dados definido pelo esquema (<code translate="no">DataType.GEOMETRY</code>) em Milvus utilizado para armazenar dados geométricos. Ao contrário dos sistemas que lidam apenas com coordenadas brutas, o Milvus suporta uma gama de estruturas espaciais - incluindo <strong>Ponto</strong>, <strong>LineString</strong> e <strong>Polígono</strong>.</p>
<p>Isto torna possível representar conceitos do mundo real, tais como localizações de restaurantes (Ponto), zonas de entrega (Polígono), ou trajectórias de veículos autónomos (LineString), tudo na mesma base de dados que armazena vectores semânticos. Por outras palavras, o Milvus torna-se um sistema unificado para saber <em>onde</em> algo está e <em>o que significa</em>.</p>
<p>Os valores geométricos são armazenados utilizando o formato <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>, uma norma legível por humanos para a inserção e consulta de dados geométricos. Isto simplifica a ingestão e consulta de dados porque as cadeias de caracteres WKT podem ser inseridas diretamente num registo Milvus. Por exemplo:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">O que é o índice RTREE e como ele funciona?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma vez que o Milvus introduz o tipo de dados Geometry, também precisa de uma forma eficiente de filtrar objectos espaciais. Milvus lida com isso usando um pipeline de filtragem espacial em dois estágios:</p>
<ul>
<li><p><strong>Filtragem grosseira:</strong> Reduz rapidamente os candidatos usando índices espaciais como o RTREE.</p></li>
<li><p><strong>Filtragem fina:</strong> Aplica verificações de geometria exacta aos candidatos restantes, garantindo a correção nos limites.</p></li>
</ul>
<p>No centro deste processo está o <strong>RTREE (Rectangle Tree)</strong>, uma estrutura de indexação espacial concebida para dados geométricos multidimensionais. A RTREE acelera as consultas espaciais ao organizar hierarquicamente os objectos geométricos.</p>
<p><strong>Fase 1: Construir o índice</strong></p>
<p><strong>1. Criar nós folha:</strong> Para cada objeto geométrico, calcular o seu <strong>Minimum Bounding Rectangle (MBR</strong>) - o retângulo mais pequeno que contém totalmente o objeto - e armazená-lo como um nó folha.</p>
<p><strong>2. Agrupar em caixas maiores:</strong> Agrupe os nós folha próximos e envolva cada grupo dentro de um novo MBR, produzindo nós internos.</p>
<p><strong>3. Adicionar o nó raiz:</strong> Crie um nó raiz cujo MBR cubra todos os grupos internos, formando uma estrutura de árvore com altura balanceada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fase 2: Acelerar as consultas</strong></p>
<p><strong>1. Formar o MBR da consulta:</strong> Calcular o MBR para a geometria utilizada na sua consulta.</p>
<p><strong>2. Podar ramos:</strong> Começando pela raiz, compare o MBR da consulta com cada nó interno. Ignore qualquer ramo cujo MBR não se cruze com o MBR da consulta.</p>
<p><strong>3. Coletar candidatos:</strong> Descer para os ramos que se intersectam e reunir os nós folha candidatos.</p>
<p><strong>4. Executar correspondência exata:</strong> Para cada candidato, execute o predicado espacial para obter resultados precisos.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Por que o RTREE é rápido</h3><p>O RTREE oferece um bom desempenho na filtragem espacial devido a vários recursos importantes do projeto:</p>
<ul>
<li><p>Cada<strong>nó armazena um MBR:</strong> Cada nó aproxima a área de todas as geometrias em sua subárvore. Isto torna mais fácil decidir se um ramo deve ser explorado durante uma consulta.</p></li>
<li><p><strong>Poda rápida:</strong> Apenas as sub-árvores cujo MBR intersecta a região de consulta são exploradas. As áreas irrelevantes são ignoradas por completo.</p></li>
<li><p><strong>Escala com o tamanho dos dados:</strong> RTREE suporta pesquisas espaciais em tempo <strong>O(log N)</strong>, permitindo consultas rápidas mesmo quando o conjunto de dados se expande.</p></li>
<li><p><strong>Implementação Boost.Geometry:</strong> Milvus constrói seu índice RTREE usando <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, uma biblioteca C++ amplamente utilizada que fornece algoritmos de geometria otimizados e uma implementação RTREE segura para threads, adequada para cargas de trabalho simultâneas.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Operadores de geometria suportados</h3><p>O Milvus fornece um conjunto de operadores espaciais que lhe permitem filtrar e recuperar entidades com base em relações geométricas. Esses operadores são essenciais para cargas de trabalho que precisam entender como os objetos se relacionam uns com os outros no espaço.</p>
<p>A tabela seguinte lista os <a href="https://milvus.io/docs/geometry-operators.md">operadores geométricos</a> atualmente disponíveis no Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operador</strong></th><th style="text-align:center"><strong>Descrição</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Retorna TRUE se as geometrias A e B compartilham pelo menos um ponto em comum.</td></tr>
<tr><td style="text-align:center"><strong>st_contém(A, B)</strong></td><td style="text-align:center">Retorna TRUE se a geometria A contém completamente a geometria B (excluindo o limite).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">Retorna TRUE se a geometria A está completamente contida na geometria B. Este é o inverso de st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_cobre(A, B)</strong></td><td style="text-align:center">Retorna TRUE se a geometria A cobre a geometria B (incluindo o limite).</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">Retorna TRUE se as geometrias A e B se tocam nos seus limites mas não se intersectam internamente.</td></tr>
<tr><td style="text-align:center"><strong>st_igual(A, B)</strong></td><td style="text-align:center">Retorna TRUE se as geometrias A e B são espacialmente idênticas.</td></tr>
<tr><td style="text-align:center"><strong>st_sobreposições(A, B)</strong></td><td style="text-align:center">Retorna TRUE se as geometrias A e B se sobrepõem parcialmente e nenhuma contém totalmente a outra.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Retorna TRUE se a distância entre A e B for menor que <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Como combinar o índice de geolocalização e o índice vetorial</h3><p>Com o suporte Geometry e o índice RTREE, o Milvus pode combinar a filtragem geoespacial com a pesquisa de similaridade vetorial num único fluxo de trabalho. O processo funciona em duas etapas:</p>
<p><strong>1. Filtrar por localização usando RTREE:</strong> Milvus primeiro usa o índice RTREE para restringir a pesquisa a entidades dentro do intervalo geográfico especificado (por exemplo, "dentro de 2 km").</p>
<p><strong>2. Classificar por semântica utilizando a pesquisa vetorial:</strong> Dos restantes candidatos, o índice vetorial seleciona os Top-N resultados mais semelhantes com base na semelhança de incorporação.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Applications-of-Geo-Vector-Retrieval" class="common-anchor-header">Aplicações reais da recuperação geo-vetorial<button data-href="#Real-World-Applications-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Serviços de entrega: Recomendações mais inteligentes e sensíveis à localização</h3><p>Plataformas como a DoorDash ou a Uber Eats lidam com centenas de milhões de pedidos todos os dias. No momento em que um utilizador abre a aplicação, o sistema tem de determinar - com base na localização do utilizador, hora do dia, preferências de gosto, tempos de entrega estimados, tráfego em tempo real e disponibilidade do serviço de entregas - quais os restaurantes ou serviços de entregas que melhor se adequam <em>neste momento</em>.</p>
<p>Tradicionalmente, isto requer a consulta de uma base de dados geoespacial e de um motor de recomendação separado, seguido de várias rondas de filtragem e nova classificação. Com o Geolocation Index, a Milvus simplifica muito este fluxo de trabalho:</p>
<ul>
<li><p><strong>Armazenamento unificado</strong> - As coordenadas dos restaurantes, as localizações dos correios e as preferências dos utilizadores estão todas num único sistema.</p></li>
<li><p><strong>Recuperação conjunta</strong> - Primeiro, aplique um filtro espacial (por exemplo, <em>restaurantes num raio de 3 km</em>) e, em seguida, utilize a pesquisa vetorial para classificar por semelhança, preferência de gosto ou qualidade.</p></li>
<li><p>Tomada<strong>de decisões dinâmica</strong> - Combinar a distribuição de correio em tempo real e os sinais de trânsito para atribuir rapidamente o correio mais próximo e mais adequado.</p></li>
</ul>
<p>Esta abordagem unificada permite à plataforma efetuar raciocínios espaciais e semânticos numa única consulta. Por exemplo, quando um utilizador procura "arroz com caril", o Milvus recupera restaurantes semanticamente relevantes <em>e</em> dá prioridade aos que estão próximos, que fazem entregas rápidas e que correspondem ao perfil histórico de gostos do utilizador.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Condução autónoma: Decisões mais inteligentes</h3><p>Na condução autónoma, a indexação geoespacial é fundamental para a perceção, localização e tomada de decisões. Os veículos devem alinhar-se continuamente com mapas de alta definição, detetar obstáculos e planear trajectórias seguras - tudo isto em apenas alguns milissegundos.</p>
<p>Com o Milvus, o tipo Geometry e o índice RTREE podem armazenar e consultar estruturas espaciais ricas, tais como:</p>
<ul>
<li><p><strong>Limites de estradas</strong> (LineString)</p></li>
<li><p><strong>Zonas de regulação de tráfego</strong> (Polygon)</p></li>
<li><p><strong>Obstáculos detectados</strong> (Point)</p></li>
</ul>
<p>Estas estruturas podem ser indexadas de forma eficiente, permitindo que os dados geoespaciais participem diretamente no ciclo de decisão da IA. Por exemplo, um veículo autónomo pode determinar rapidamente se as suas coordenadas actuais estão dentro de uma faixa específica ou se intersectam uma área restrita, simplesmente através de um predicado espacial RTREE.</p>
<p>Quando combinada com os vectores gerados pelo sistema de perceção - tais como os vectores de cena que captam o ambiente de condução atual - a Milvus pode suportar consultas mais avançadas, como a recuperação de cenários históricos de condução semelhantes ao atual num raio de 50 metros. Isto ajuda os modelos a interpretar o ambiente mais rapidamente e a tomar melhores decisões.</p>
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
    </button></h2><p>A geolocalização é mais do que latitude e longitude - é uma fonte valiosa de informações semânticas que nos diz onde as coisas acontecem, como se relacionam com o meio envolvente e a que contexto pertencem.</p>
<p>Na base de dados da próxima geração do Zilliz, os dados vectoriais e a informação geoespacial estão gradualmente a juntar-se como uma base unificada. Isto permite:</p>
<ul>
<li><p>Recuperação conjunta entre vectores, dados geoespaciais e tempo</p></li>
<li><p>Sistemas de recomendação espacialmente conscientes</p></li>
<li><p>Pesquisa multimodal e baseada na localização (LBS)</p></li>
</ul>
<p>No futuro, a IA não só compreenderá <em>o</em> significado do conteúdo, mas também onde este se aplica e quando é mais importante.</p>
<p>Para mais informações sobre o Geometry Field e o índice RTREE, consulte a documentação abaixo:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Campo Geométrico | Documentação Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Documentação de Milvus</a></p></li>
</ul>
<p>Tem dúvidas ou quer aprofundar qualquer caraterística do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre os recursos do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando Milvus 2.6: Pesquisa Vetorial Acessível em Escala de Bilhões</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a função Embedding: Como o Milvus 2.6 agiliza a vetorização e a busca semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding no Milvus: Filtragem JSON 88,9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades de Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: A arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um pica-pau para o Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar com eficiência sem prejudicar a recuperação</a></p></li>
</ul>
