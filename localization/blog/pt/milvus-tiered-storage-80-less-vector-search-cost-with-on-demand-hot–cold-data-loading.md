---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Pare de pagar por dados frios: 80% de redução de custos com o carregamento de
  dados quentes e frios a pedido no armazenamento em camadas Milvus
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Saiba como o armazenamento em camadas no Milvus permite o carregamento sob
  demanda de dados quentes e frios, proporcionando uma redução de custos de até
  80% e tempos de carregamento mais rápidos em escala.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>Quantos de vós continuam a pagar facturas de infra-estruturas de alta qualidade por dados que o vosso sistema mal toca? Seja honesto - a maioria das equipas está.</strong></p>
<p>Se você executa a pesquisa de vetores na produção, provavelmente já viu isso em primeira mão. Você provisiona grandes quantidades de memória e SSDs para que tudo fique "pronto para consulta", mesmo que apenas uma pequena parte do seu conjunto de dados esteja realmente ativa. E não é o único. Também vimos muitos casos semelhantes:</p>
<ul>
<li><p><strong>Plataformas SaaS de vários inquilinos:</strong> Centenas de inquilinos integrados, mas apenas 10-15% activos num determinado dia. Os restantes permanecem inactivos, mas continuam a ocupar recursos.</p></li>
<li><p><strong>Sistemas de recomendação de comércio eletrónico:</strong> Um milhão de SKUs, mas os 8% principais dos produtos geram a maioria das recomendações e do tráfego de pesquisa.</p></li>
<li><p><strong>Pesquisa de IA:</strong> Vastos arquivos de embeddings, apesar de 90% das consultas dos utilizadores incidirem sobre itens da semana passada.</p></li>
</ul>
<p>É a mesma história em todos os sectores: <strong>menos de 10% dos seus dados são consultados frequentemente, mas consomem 80% do seu armazenamento e memória.</strong> Toda a gente sabe que o desequilíbrio existe - mas até há pouco tempo, não havia uma forma arquitetónica simples de o resolver.</p>
<p><strong>Isso muda com o</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Antes desta versão, o Milvus (tal como a maioria das bases de dados vectoriais) dependia de <strong>um modelo de carregamento completo</strong>: se os dados precisassem de ser pesquisáveis, tinham de ser carregados nos nós locais. Não importava se os dados eram acessados mil vezes por minuto ou uma vez por trimestre - <strong>tudo tinha que permanecer quente.</strong> Essa escolha de design garantiu um desempenho previsível, mas também significou o sobredimensionamento de clusters e o pagamento de recursos que os dados frios simplesmente não mereciam.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">O armazenamento em camadas</a> <strong>é a nossa resposta.</strong></p>
<p>O Milvus 2.6 introduz uma nova arquitetura de armazenamento em camadas com <strong>verdadeiro carregamento sob demanda</strong>, permitindo que o sistema diferencie automaticamente entre dados quentes e frios:</p>
<ul>
<li><p>Os segmentos quentes ficam em cache perto do computador</p></li>
<li><p>Os segmentos frios vivem de forma barata no armazenamento de objectos remoto</p></li>
<li><p>Os dados são puxados para nós locais <strong>apenas quando uma consulta realmente precisa deles</strong></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isto muda a sua estrutura de custos de "quantos dados tem" para <strong>"quantos dados utiliza efetivamente".</strong> E nas primeiras implantações de produção, essa simples mudança proporciona <strong>uma redução de até 80% no custo de armazenamento e memória</strong>.</p>
<p>No restante deste post, explicaremos como o armazenamento em camadas funciona, compartilharemos resultados reais de desempenho e mostraremos onde essa mudança causa o maior impacto.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Por que o carregamento total é interrompido em escala<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar na solução, vale a pena analisar mais de perto por que o <strong>modo de carga total</strong> usado no Milvus 2.5 e em versões anteriores se tornou um fator limitante à medida que as cargas de trabalho eram dimensionadas.</p>
<p>No Milvus 2.5 e versões anteriores, quando um usuário emitia uma solicitação <code translate="no">Collection.load()</code>, cada QueryNode armazenava em cache a coleção inteira localmente, incluindo metadados, dados de campo e índices. Estes componentes são descarregados do armazenamento de objectos e armazenados totalmente na memória ou mapeados na memória (mmap) para o disco local. Só depois de <em>todos</em> estes dados estarem disponíveis localmente é que a coleção é marcada como carregada e pronta para servir consultas.</p>
<p>Por outras palavras, a coleção não é consultável até que o conjunto de dados completo - quente ou frio - esteja presente no nó.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Nota:</strong> Para os tipos de índice que incorporam dados vectoriais em bruto, o Milvus carrega apenas os ficheiros de índice e não o campo vetorial separadamente. Mesmo assim, o índice tem de ser totalmente carregado para servir as consultas, independentemente da quantidade de dados que é realmente acedida.</p>
<p>Para ver por que isso se torna problemático, considere um exemplo concreto:</p>
<p>Suponha que tem um conjunto de dados vectoriais de média dimensão com:</p>
<ul>
<li><p><strong>100 milhões de vectores</strong></p></li>
<li><p><strong>768 dimensões</strong> (BERT embeddings)</p></li>
<li><p>precisão<strong>float32</strong> (4 bytes por dimensão)</p></li>
<li><p>Um <strong>índice HNSW</strong></p></li>
</ul>
<p>Nesta configuração, só o índice HNSW - incluindo os vectores brutos incorporados - consome aproximadamente 430 GB de memória. Depois de adicionar campos escalares comuns, como IDs de utilizador, carimbos de data/hora ou etiquetas de categoria, a utilização total de recursos locais ultrapassa facilmente os 500 GB.</p>
<p>Isto significa que, mesmo que 80% dos dados sejam raramente ou nunca consultados, o sistema tem de fornecer e manter mais de 500 GB de memória local ou disco apenas para manter a coleção online.</p>
<p>Para algumas cargas de trabalho, este comportamento é aceitável:</p>
<ul>
<li><p>Se quase todos os dados são acedidos frequentemente, carregar tudo proporciona a latência de consulta mais baixa possível - com o custo mais elevado.</p></li>
<li><p>Se os dados puderem ser divididos em subconjuntos quentes e mornos, o mapeamento de memória dos dados quentes para o disco pode reduzir parcialmente a pressão da memória.</p></li>
</ul>
<p>No entanto, em cargas de trabalho em que 80% ou mais dos dados se encontram na cauda longa, as desvantagens do carregamento completo surgem rapidamente, tanto em termos de <strong>desempenho</strong> como <strong>de custo</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Gargalos de desempenho</h3><p>Na prática, o carregamento completo afecta mais do que o desempenho das consultas e, muitas vezes, torna mais lentos os fluxos de trabalho operacionais de rotina:</p>
<ul>
<li><p><strong>Actualizações contínuas mais longas:</strong> Em grandes clusters, as actualizações contínuas podem demorar horas ou mesmo um dia inteiro, uma vez que cada nó tem de recarregar todo o conjunto de dados antes de ficar novamente disponível.</p></li>
<li><p><strong>Recuperação mais lenta após falhas:</strong> Quando um QueryNode é reiniciado, ele não pode atender ao tráfego até que todos os dados sejam recarregados, prolongando significativamente o tempo de recuperação e ampliando o impacto das falhas de nós.</p></li>
<li><p><strong>Iteração e experimentação mais lentas:</strong> O carregamento completo torna os fluxos de trabalho de desenvolvimento mais lentos, obrigando as equipas de IA a esperar horas pelo carregamento dos dados quando testam novos conjuntos de dados ou configurações de índices.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Ineficiências de custo</h3><p>O carregamento completo também aumenta os custos de infraestrutura. Por exemplo, em instâncias otimizadas para memória na nuvem convencional, armazenar 1 TB de dados localmente custa cerca de<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">.</mo><mn>000 por</mn><mi>ano</mi><mo separator="true">∗∗,</mo><mi>com</mi><mi>base em preços conservadores</mi><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70.000 por ano**, com base em preços conservadores (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000por</span><span class="mord mathnormal" style="margin-right:0.02778em;">ano</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mpunct"> ∗,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">com</span><span class="mord mathnormal">base em preços conservadores</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB / mês; GCP n4-highmem: ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn><mi>68/GB/mês</mi><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,68 / GB / mês; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">68/GB/mês</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">series</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5,67 / GB / mês).</span></span></span></p>
<p>Agora considere um padrão de acesso mais realista, em que 80% desses dados são frios e podem ser armazenados no armazenamento de objectos (a cerca de $0,023 / GB / mês):</p>
<ul>
<li><p>200 GB de dados quentes × $5,68</p></li>
<li><p>800 GB de dados frios × $0,023</p></li>
</ul>
<p>Custo anual: (200×5,68+800×0,023)×12≈$14<strong>.000</strong></p>
<p>Isso representa uma <strong>redução de 80%</strong> no custo total de armazenamento, sem sacrificar o desempenho onde ele realmente importa.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">O que é o armazenamento em camadas e como ele funciona?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Para eliminar o compromisso, o Milvus 2.6 introduziu o <strong>armazenamento em camadas</strong>, que equilibra o desempenho e o custo ao tratar o armazenamento local como uma cache em vez de um contentor para todo o conjunto de dados.</p>
<p>Nesse modelo, os QueryNodes carregam apenas metadados leves na inicialização. Os dados de campo e os índices são obtidos a pedido do armazenamento de objectos remoto quando uma consulta os requer, e colocados em cache localmente se forem acedidos frequentemente. Os dados inactivos podem ser evacuados para libertar espaço.</p>
<p>Como resultado, os dados quentes permanecem perto da camada de computação para consultas de baixa latência, enquanto os dados frios permanecem no armazenamento de objectos até serem necessários. Isso reduz o tempo de carregamento, melhora a eficiência dos recursos e permite que os QueryNodes consultem conjuntos de dados muito maiores do que sua memória local ou capacidade de disco.</p>
<p>Na prática, o armazenamento em camadas funciona da seguinte forma:</p>
<ul>
<li><p><strong>Manter os dados quentes locais:</strong> Cerca de 20% dos dados frequentemente acedidos permanecem residentes nos nós locais, garantindo uma baixa latência para os 80% das consultas que mais importam.</p></li>
<li><p><strong>Carregar dados frios sob demanda:</strong> Os restantes 80% dos dados raramente acedidos são obtidos apenas quando necessário, libertando a maior parte da memória local e dos recursos do disco.</p></li>
<li><p><strong>Adaptar-se dinamicamente com o despejo baseado em LRU:</strong> O Milvus usa uma estratégia de despejo LRU (Least Recently Used) para ajustar continuamente quais dados são considerados quentes ou frios. Os dados inactivos são automaticamente eliminados para dar lugar a dados recentemente acedidos.</p></li>
</ul>
<p>Com esse design, o Milvus não é mais limitado pela capacidade fixa da memória local e do disco. Em vez disso, os recursos locais funcionam como um cache gerenciado dinamicamente, onde o espaço é continuamente recuperado de dados inativos e realocado para cargas de trabalho ativas.</p>
<p>Na sua essência, esse comportamento é possibilitado por três mecanismos técnicos principais:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Carga preguiçosa</h3><p>Na inicialização, o Milvus carrega apenas metadados mínimos ao nível do segmento, permitindo que as colecções se tornem consultáveis quase imediatamente após o arranque. Os dados de campo e os ficheiros de índice permanecem no armazenamento remoto e são obtidos a pedido durante a execução da consulta, mantendo a memória local e a utilização do disco baixos.</p>
<p><strong>Como funcionava o carregamento de colecções no Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Como o lazy loading funciona no Milvus 2.6 e posteriores</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os metadados carregados durante a inicialização se dividem em quatro categorias principais:</p>
<ul>
<li><p><strong>Estatísticas do segmento</strong> (Informações básicas como contagem de linhas, tamanho do segmento e metadados do esquema)</p></li>
<li><p><strong>Carimbos de data e hora</strong> (usados para suportar consultas de viagem no tempo)</p></li>
<li><p><strong>Registos de inserção e eliminação</strong> (necessários para manter a consistência dos dados durante a execução da consulta)</p></li>
<li><p><strong>Filtros Bloom</strong> (Utilizados para pré-filtragem rápida para eliminar rapidamente segmentos irrelevantes)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Carregamento parcial</h3><p>Enquanto o carregamento lento controla <em>quando</em> os dados são carregados, o carregamento parcial controla <em>a quantidade de</em> dados carregados. Uma vez iniciadas as consultas ou pesquisas, o QueryNode efectua um carregamento parcial, obtendo apenas os pedaços de dados necessários ou ficheiros de índice do armazenamento de objectos.</p>
<p><strong>Índices vectoriais: Carregamento com reconhecimento de locatário</strong></p>
<p>Uma das capacidades mais impactantes introduzidas no Milvus 2.6+ é o carregamento de índices vectoriais com conhecimento do inquilino, concebido especificamente para cargas de trabalho multi-tenant.</p>
<p>Quando uma consulta acede a dados de um único inquilino, o Milvus carrega apenas a parte do índice vetorial pertencente a esse inquilino, ignorando os dados do índice para todos os outros inquilinos. Isso mantém os recursos locais concentrados nos locatários ativos.</p>
<p>Esse design oferece vários benefícios:</p>
<ul>
<li><p>Os índices vetoriais para locatários inativos não consomem memória local ou disco</p></li>
<li><p>Os dados de índice para locatários ativos permanecem em cache para acesso de baixa latência</p></li>
<li><p>Uma política de despejo LRU no nível do locatário garante o uso justo do cache entre os locatários</p></li>
</ul>
<p><strong>Campos escalares: Carregamento parcial ao nível da coluna</strong></p>
<p>O carregamento parcial também se aplica a <strong>campos escalares</strong>, permitindo que o Milvus carregue apenas as colunas explicitamente referenciadas por uma consulta.</p>
<p>Considere uma coleção com <strong>50 campos de esquema</strong>, como <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, e <code translate="no">tags</code>, e você só precisa retornar três campos -<code translate="no">id</code>, <code translate="no">title</code>, e <code translate="no">price</code>.</p>
<ul>
<li><p>No <strong>Milvus 2.5</strong>, todos os 50 campos escalares são carregados independentemente dos requisitos da consulta.</p></li>
<li><p>No <strong>Milvus 2.6+</strong>, apenas os três campos solicitados são carregados. Os restantes 47 campos não são carregados e só são obtidos de forma preguiçosa se forem acedidos mais tarde.</p></li>
</ul>
<p>A economia de recursos pode ser substancial. Se cada campo escalar ocupar 20 GB:</p>
<ul>
<li><p>Carregar todos os campos requer <strong>1.000 GB</strong> (50 × 20 GB)</p></li>
<li><p>Carregar apenas os três campos necessários usa <strong>60 GB</strong></p></li>
</ul>
<p>Isto representa uma <strong>redução de 94%</strong> no carregamento de dados escalares, sem afetar a correção da consulta ou os resultados.</p>
<p><strong>Nota:</strong> o carregamento parcial com reconhecimento de locatário para campos escalares e índices vetoriais será oficialmente introduzido em uma próxima versão. Uma vez disponível, ele reduzirá ainda mais a latência de carga e melhorará o desempenho da consulta a frio em grandes implantações de vários locatários.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. Evicção de cache baseada em LRU</h3><p>O carregamento preguiçoso e o carregamento parcial reduzem significativamente a quantidade de dados que são trazidos para a memória local e para o disco. No entanto, em sistemas de longa duração, a cache continuará a crescer à medida que novos dados são acedidos ao longo do tempo. Quando a capacidade local é atingida, o despejo de cache baseado em LRU entra em vigor.</p>
<p>O despejo LRU (Least Recently Used) segue uma regra simples: os dados que não foram acedidos recentemente são despejados primeiro. Isto liberta espaço local para dados recentemente acedidos, mantendo os dados frequentemente utilizados residentes na cache.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Avaliação de desempenho: Armazenamento em camadas vs. Carregamento total<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Para avaliar o impacto do <strong>armazenamento em camadas</strong> no mundo real, configuramos um ambiente de teste que espelha de perto as cargas de trabalho de produção. Comparámos o Milvus com e sem armazenamento em camadas em cinco dimensões: tempo de carregamento, utilização de recursos, desempenho de consultas, capacidade efectiva e eficiência de custos.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Configuração experimental</h3><p><strong>Conjunto de dados</strong></p>
<ul>
<li><p>100 milhões de vectores com 768 dimensões (BERT embeddings)</p></li>
<li><p>Tamanho do índice do vetor: aproximadamente 430 GB</p></li>
<li><p>10 campos escalares, incluindo ID, registo de data e hora e categoria</p></li>
</ul>
<p><strong>Configuração de hardware</strong></p>
<ul>
<li><p>1 QueryNode com 4 vCPUs, 32 GB de memória e 1 TB de SSD NVMe</p></li>
<li><p>Rede de 10 Gbps</p></li>
<li><p>Cluster de armazenamento de objetos MinIO como back-end de armazenamento remoto</p></li>
</ul>
<p><strong>Padrão de acesso</strong></p>
<p>As consultas seguem uma distribuição realista de acesso quente-frio:</p>
<ul>
<li><p>80% das consultas têm como alvo os dados dos 30 dias mais recentes (≈20% do total de dados)</p></li>
<li><p>15% têm como objetivo dados de 30-90 dias (≈30% do total de dados)</p></li>
<li><p>5% direcionam os dados com mais de 90 dias (≈50% do total de dados)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Resultados principais</h3><p><strong>1. Tempo de carregamento 33× mais rápido</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Fase</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (armazenamento em camadas)</strong></th><th style="text-align:center"><strong>Aceleração</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Descarregamento de dados</td><td style="text-align:center">22 minutos</td><td style="text-align:center">28 segundos</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Carregamento do índice</td><td style="text-align:center">3 minutos</td><td style="text-align:center">17 segundos</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>total</strong></td><td style="text-align:center"><strong>25 minutos</strong></td><td style="text-align:center"><strong>45 segundos</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>No Milvus 2.5, o carregamento da coleção demorava <strong>25 minutos</strong>. Com o armazenamento em camadas no Milvus 2.6+, a mesma carga de trabalho é concluída em apenas <strong>45 segundos</strong>, o que representa uma melhoria significativa na eficiência do carregamento.</p>
<p><strong>2. 80% de redução no uso de recursos locais</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Estágio</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Armazenamento em camadas)</strong></th><th style="text-align:center"><strong>Redução</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Após o carregamento</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Após 1 hora</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Após 24 horas</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">Estado estável</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>No Milvus 2.5, o uso de recursos locais permanece constante em <strong>430 GB</strong>, independentemente da carga de trabalho ou tempo de execução. Em contraste, o Milvus 2.6+ começa com apenas <strong>12 GB</strong> imediatamente após o carregamento.</p>
<p>À medida que as consultas são executadas, os dados frequentemente acedidos são armazenados em cache localmente e a utilização de recursos aumenta gradualmente. Após cerca de 24 horas, o sistema estabiliza em <strong>85-95 GB</strong>, reflectindo o conjunto de trabalho de dados quentes. A longo prazo, isto resulta numa <strong> redução de ~80%</strong> na memória local e na utilização do disco, sem sacrificar a disponibilidade das consultas.</p>
<p><strong>3. Impacto quase nulo no desempenho dos dados quentes</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tipo de consulta</strong></th><th style="text-align:center"><strong>Latência do Milvus 2.5 P99</strong></th><th style="text-align:center"><strong>Latência do Milvus 2.6+ P99</strong></th><th style="text-align:center"><strong>Alterar</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Consultas de dados quentes</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Consultas de dados quentes</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Consultas de dados frios (primeiro acesso)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Consultas de dados frios (em cache)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Para dados quentes, que representam cerca de 80% de todas as consultas, a latência do P99 aumenta apenas 6,7%, resultando em praticamente nenhum impacto percetível na produção.</p>
<p>As consultas de dados frios apresentam uma latência mais elevada no primeiro acesso devido ao carregamento a pedido a partir do armazenamento de objectos. No entanto, uma vez armazenadas em cache, sua latência aumenta em apenas 20%. Dada a baixa frequência de acesso dos dados frios, este compromisso é geralmente aceitável para a maioria das cargas de trabalho do mundo real.</p>
<p><strong>4. Capacidade efectiva 4,3× maior</strong></p>
<p>Com o mesmo orçamento de hardware - oito servidores com 64 GB de memória cada (512 GB no total) - o Milvus 2.5 pode carregar no máximo 512 GB de dados, o equivalente a aproximadamente 136 milhões de vetores.</p>
<p>Com o armazenamento em camadas ativado no Milvus 2.6+, o mesmo hardware pode suportar 2,2 TB de dados, ou seja, cerca de 590 milhões de vectores. Isto representa um aumento de 4,3 vezes na capacidade efectiva, permitindo servir conjuntos de dados significativamente maiores sem expandir a memória local.</p>
<p><strong>5. Redução de custos de 80,1%</strong></p>
<p>Utilizando um conjunto de dados vectoriais de 2 TB num ambiente AWS como exemplo, e assumindo que 20% dos dados são quentes (400 GB), a comparação de custos é a seguinte:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Item</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (armazenamento em camadas)</strong></th><th style="text-align:center"><strong>Poupança</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Custo mensal</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Custo anual</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Taxa de poupança</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Resumo do benchmark</h3><p>Em todos os testes, o armazenamento em camadas oferece melhorias consistentes e mensuráveis:</p>
<ul>
<li><p><strong>Tempos de carregamento 33 vezes mais rápidos:</strong> O tempo de carregamento da coleção é reduzido de <strong>25 minutos para 45 segundos</strong>.</p></li>
<li><p><strong>80% menos uso de recursos locais:</strong> Em operação estável, o uso de memória e disco local cai em aproximadamente <strong>80%</strong>.</p></li>
<li><p><strong>Impacto quase nulo no desempenho dos dados quentes:</strong> A latência do P99 para dados quentes aumenta em <strong>menos de 10%</strong>, preservando o desempenho da consulta de baixa latência.</p></li>
<li><p><strong>Latência controlada para dados frios:</strong> Os dados frios incorrem em maior latência no primeiro acesso, mas isso é aceitável dada a sua baixa frequência de acesso.</p></li>
<li><p><strong>Capacidade efectiva 4,3 vezes superior:</strong> O mesmo hardware pode servir <strong>4-5 vezes mais dados</strong> sem memória adicional.</p></li>
<li><p><strong>Mais de 80% de redução de custos:</strong> Os custos anuais de infraestrutura são reduzidos em <strong>mais de 80%</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Quando utilizar o armazenamento em camadas no Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Com base em resultados de benchmark e casos de produção reais, agrupamos os casos de utilização do armazenamento em camadas em três categorias para o ajudar a decidir se é adequado para a sua carga de trabalho.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Casos de uso mais adequados</h3><p><strong>1. Plataformas de pesquisa vetorial multilocatário</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Grande número de locatários com atividade altamente desigual; a pesquisa vetorial é a carga de trabalho principal.</p></li>
<li><p><strong>Padrão de acesso:</strong> Menos de 20% dos inquilinos geram mais de 80% das consultas vectoriais.</p></li>
<li><p><strong>Benefícios esperados:</strong> Redução de custos de 70-80%; expansão de capacidade de 3-5×.</p></li>
</ul>
<p><strong>2. Sistemas de recomendação de comércio eletrónico (cargas de trabalho de pesquisa vetorial)</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Forte distorção da popularidade entre os produtos de topo e a cauda longa.</p></li>
<li><p><strong>Padrão de acesso:</strong> Os 10% de produtos de topo representam ~80% do tráfego de pesquisa vetorial.</p></li>
<li><p><strong>Benefícios esperados:</strong> Sem necessidade de capacidade extra durante os picos de tráfego; redução de custos de 60-70%.</p></li>
</ul>
<p><strong>3. Conjuntos de dados em grande escala com uma separação clara entre quente e frio (predominância de vectores)</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Conjuntos de dados de escala TB ou superior, com acesso fortemente orientado para dados recentes.</p></li>
<li><p><strong>Padrão de acesso:</strong> Uma distribuição 80/20 clássica: 20% dos dados servem 80% das consultas</p></li>
<li><p><strong>Benefícios esperados:</strong> 75-85% de redução de custos</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Casos de utilização adequados</h3><p><strong>1. Cargas de trabalho sensíveis ao custo</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Orçamentos apertados com alguma tolerância para pequenas compensações de desempenho.</p></li>
<li><p><strong>Padrão de acesso:</strong> As consultas vectoriais são relativamente concentradas.</p></li>
<li><p><strong>Benefícios esperados:</strong> Redução de custos de 50-70%; os dados frios podem incorrer numa latência de cerca de 500 ms no primeiro acesso, que deve ser avaliada em função dos requisitos do SLA.</p></li>
</ul>
<p><strong>2. Retenção de dados históricos e pesquisa em arquivo</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Grandes volumes de vectores históricos com uma frequência de consulta muito baixa.</p></li>
<li><p><strong>Padrão de acesso:</strong> Cerca de 90% das consultas visam dados recentes.</p></li>
<li><p><strong>Benefícios esperados:</strong> Manter conjuntos de dados históricos completos; manter os custos de infraestrutura previsíveis e controlados</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Casos de utilização pouco adequados</h3><p><strong>1. Cargas de trabalho de dados uniformemente quentes</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Todos os dados são acedidos com uma frequência semelhante, sem distinção clara entre quente e frio.</p></li>
<li><p><strong>Por que não é adequado:</strong> Benefício limitado da cache; complexidade adicional do sistema sem ganhos significativos</p></li>
</ul>
<p><strong>2. Cargas de trabalho de latência ultrabaixa</strong></p>
<ul>
<li><p><strong>Caraterísticas:</strong> Sistemas extremamente sensíveis à latência, como comércio financeiro ou licitações em tempo real</p></li>
<li><p><strong>Por que não é adequado:</strong> Mesmo pequenas variações de latência são inaceitáveis; o carregamento completo proporciona um desempenho mais previsível</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Início rápido: Experimente o armazenamento em camadas no Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>O Tiered Storage no Milvus 2.6 aborda uma incompatibilidade comum entre como os dados vetoriais são armazenados e como eles são realmente acessados. Na maioria dos sistemas de produção, apenas uma pequena fração dos dados é consultada com frequência, mas os modelos de carregamento tradicionais tratam todos os dados como igualmente quentes. Ao mudar para o carregamento sob demanda e gerenciar a memória local e o disco como um cache, o Milvus alinha o consumo de recursos com o comportamento real de consulta em vez de suposições de pior caso.</p>
<p>Essa abordagem permite que os sistemas sejam dimensionados para conjuntos de dados maiores sem aumentos proporcionais nos recursos locais, mantendo o desempenho da consulta quente praticamente inalterado. Os dados frios permanecem acessíveis quando necessário, com latência previsível e limitada, tornando o compromisso explícito e controlável. À medida que a pesquisa vetorial se aprofunda em ambientes de produção sensíveis a custos, multilocatários e de longa duração, o Armazenamento em camadas fornece uma base prática para operar com eficiência em escala.</p>
<p>Para obter mais informações sobre o armazenamento em camadas, consulte a documentação abaixo:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage | Documentação Milvus</a></li>
</ul>
<p>Tem dúvidas ou deseja aprofundar qualquer recurso do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Filtragem Geoespacial e Pesquisa Vetorial com Campos Geométricos e RTREE no Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Apresentando o AISAQ no Milvus: A pesquisa vetorial em escala de bilhões ficou 3.200 vezes mais barata em memória</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Otimizando o NVIDIA CAGRA no Milvus: Uma abordagem híbrida GPU-CPU para indexação mais rápida e consultas mais baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: a arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para o Milvus</a></p></li>
</ul>
