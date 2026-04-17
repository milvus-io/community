---
id: how-to-debug-slow-requests-in-milvus.md
title: Como depurar pedidos de pesquisa lentos no Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  Neste post, vamos compartilhar como fazer a triagem de solicitações lentas no
  Milvus e compartilhar etapas práticas que você pode tomar para manter a
  latência previsível, estável e consistentemente baixa.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>O desempenho está no centro de Milvus. Em condições normais, um pedido de pesquisa no Milvus é concluído em apenas milissegundos. Mas o que acontece quando o cluster fica mais lento - quando a latência da pesquisa chega a segundos inteiros?</p>
<p>Pesquisas lentas não acontecem com frequência, mas podem surgir em escala ou sob cargas de trabalho complexas. E quando acontecem, são importantes: perturbam a experiência do utilizador, distorcem o desempenho da aplicação e expõem frequentemente ineficiências ocultas na sua configuração.</p>
<p>Neste post, mostraremos como fazer a triagem de solicitações lentas no Milvus e compartilharemos etapas práticas que podem ser tomadas para manter a latência previsível, estável e consistentemente baixa.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identificando pesquisas lentas<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>O diagnóstico de uma solicitação lenta começa com duas perguntas: <strong>com que frequência isso acontece e para onde está indo o tempo?</strong> O Milvus dá-lhe ambas as respostas através de métricas e registos.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Métricas do Milvus</h3><p>O Milvus exporta métricas detalhadas que você pode monitorar nos painéis do Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os painéis principais incluem:</p>
<ul>
<li><p><strong>Qualidade do serviço → Consulta lenta</strong>: Sinaliza qualquer solicitação que exceda proxy.slowQuerySpanInSeconds (padrão: 5s). Elas também são marcadas no Prometheus.</p></li>
<li><p><strong>Qualidade do serviço → Latência de pesquisa</strong>: Mostra a distribuição geral da latência. Se isto parece normal, mas os utilizadores finais ainda vêem atrasos, o problema é provavelmente fora do Milvus - na camada de rede ou de aplicação.</p></li>
<li><p><strong>Query Node → Search Latency by Phase</strong>: Divide a latência em estágios de fila, consulta e redução. Para uma atribuição mais profunda, painéis como <em>Scalar</em> <em>Filter Latency</em>, <em>Vetor Search Latency</em> e <em>Wait tSafe Latency</em> revelam qual estágio domina.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Registos do Milvus</h3><p>O Milvus também regista qualquer pedido que dure mais de um segundo, etiquetado com marcadores como [Search slow]. Esses logs mostram <em>quais</em> consultas são lentas, complementando os <em>insights</em> das métricas. Como regra geral:</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → latência de pesquisa saudável na maioria dos cenários</p></li>
<li><p><strong>&gt; 100 ms</strong> → vale a pena investigar</p></li>
<li><p><strong>&gt; 1 s</strong> → definitivamente lento e requer atenção</p></li>
</ul>
<p>Exemplo de registo:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>Em resumo, <strong>as métricas informam para onde o tempo está indo; os logs informam quais consultas são atingidas.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Analisando a causa raiz<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Carga de trabalho pesada</h3><p>Uma causa comum de solicitações lentas é uma carga de trabalho excessiva. Quando uma solicitação tem um <strong>NQ</strong> (número de consultas por solicitação) muito grande, ela pode ser executada por um longo período e monopolizar os recursos do nó de consulta. Outras solicitações se acumulam atrás dela, resultando no aumento da latência da fila. Mesmo que cada solicitação tenha um NQ pequeno, uma taxa de transferência geral (QPS) muito alta ainda pode causar o mesmo efeito, pois o Milvus pode mesclar internamente as solicitações de pesquisa simultâneas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinais a serem observados:</strong></p>
<ul>
<li><p>Todas as consultas mostram uma latência inesperadamente alta.</p></li>
<li><p>As métricas do nó de consulta relatam alta <strong>latência na fila</strong>.</p></li>
<li><p>Os logs mostram uma solicitação com um NQ grande e uma duração total longa, mas uma duração relativamente pequenaPorNQ-indicando que uma solicitação superdimensionada está dominando os recursos.</p></li>
</ul>
<p><strong>Como corrigir isso:</strong></p>
<ul>
<li><p><strong>Consultas em lote</strong>: Mantenha o NQ modesto para evitar a sobrecarga de uma única solicitação.</p></li>
<li><p><strong>Dimensione os nós de consulta</strong>: Se a alta simultaneidade for uma parte regular da sua carga de trabalho, adicione nós de consulta para distribuir a carga e manter a baixa latência.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Filtragem ineficiente</h3><p>Outro gargalo comum vem de filtros ineficientes. Se as expressões de filtro forem mal conduzidas ou os campos não tiverem índices escalares, o Milvus pode voltar a uma <strong>varredura completa</strong> em vez de varrer um subconjunto pequeno e direcionado. Filtros JSON e configurações de consistência rígidas podem aumentar ainda mais a sobrecarga.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinais a serem observados:</strong></p>
<ul>
<li><p>Alta <strong>latência de filtro escalar</strong> nas métricas do nó de consulta.</p></li>
<li><p>Picos de latência perceptíveis somente quando os filtros são aplicados.</p></li>
<li><p>Long <strong>Wait tSafe Latency</strong> se a consistência estrita estiver ativada.</p></li>
</ul>
<p><strong>Como corrigir isso:</strong></p>
<ul>
<li><strong>Simplificar as expressões de filtro</strong>: Reduza a complexidade do plano de consulta otimizando os filtros. Por exemplo, substitua cadeias OR longas por uma expressão IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>O Milvus também introduz um mecanismo de modelagem de expressão de filtro projetado para melhorar a eficiência, reduzindo o tempo gasto na análise de expressões complexas. Consulte <a href="https://milvus.io/docs/filtering-templating.md">este documento</a> para obter mais detalhes.</p></li>
<li><p><strong>Adicione índices adequados</strong>: Evite varreduras completas criando índices escalares nos campos usados nos filtros.</p></li>
<li><p><strong>Lidar com JSON de forma eficiente</strong>: O Milvus 2.6 introduziu índices path e flat para campos JSON, permitindo o manuseio eficiente de dados JSON. A fragmentação de JSON também está no <a href="https://milvus.io/docs/roadmap.md">roteiro</a> para melhorar ainda mais o desempenho. Consulte <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">o documento do campo JSON</a> para obter informações adicionais.</p></li>
<li><p><strong>Ajuste o nível de consistência</strong>: Use as leituras <em>Bounded</em> ou <em>Eventually</em> consistent quando não forem necessárias garantias estritas, reduzindo o tempo de espera <em>do tSafe</em>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Escolha inadequada do índice de vetor</h3><p><a href="https://milvus.io/docs/index-explained.md">Os índices vetoriais</a> não são únicos. A seleção do índice errado pode afetar significativamente a latência. Os índices na memória oferecem o desempenho mais rápido, mas consomem mais memória, enquanto os índices no disco economizam memória ao custo da velocidade. Os vetores binários também exigem estratégias de indexação especializadas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinais a serem observados:</strong></p>
<ul>
<li><p>Alta latência de pesquisa de vetores nas métricas do nó de consulta.</p></li>
<li><p>Saturação de E/S de disco ao usar DiskANN ou MMAP.</p></li>
<li><p>Consultas mais lentas imediatamente após a reinicialização devido à inicialização a frio do cache.</p></li>
</ul>
<p><strong>Como corrigir isso:</strong></p>
<ul>
<li><p><strong>Corresponder o índice à carga de trabalho (vectores de flutuação):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - melhor para casos de uso na memória com alta recuperação e baixa latência.</p></li>
<li><p><strong>Família IVF</strong> - compromissos flexíveis entre recuperação e velocidade.</p></li>
<li><p><strong>DiskANN</strong> - suporta conjuntos de dados à escala de mil milhões, mas requer uma grande largura de banda de disco.</p></li>
</ul></li>
<li><p><strong>Para vectores binários:</strong> Use o <a href="https://milvus.io/docs/minhash-lsh.md">índice MINHASH_LSH</a> (introduzido no Milvus 2.6) com a métrica MHJACCARD para aproximar eficientemente a similaridade Jaccard.</p></li>
<li><p><strong>Habilitar</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Mapear os arquivos de índice na memória em vez de mantê-los totalmente residentes para obter um equilíbrio entre a latência e o uso da memória.</p></li>
<li><p><strong>Ajuste os parâmetros de índice/pesquisa</strong>: Ajuste as configurações para equilibrar a recuperação e a latência para sua carga de trabalho.</p></li>
<li><p><strong>Reduza as partidas a frio</strong>: Aqueça os segmentos frequentemente acedidos após um reinício para evitar a lentidão inicial da consulta.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Condições de tempo de execução e ambiente</h3><p>Nem todas as consultas lentas são causadas pela própria consulta. Os nós de consulta geralmente compartilham recursos com trabalhos em segundo plano, como compactação, migração de dados ou criação de índices. Os upserts frequentes podem gerar muitos segmentos pequenos e não indexados, forçando as pesquisas a examinar dados brutos. Em alguns casos, as ineficiências específicas da versão também podem introduzir latência até que sejam corrigidas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Sinais a serem observados:</strong></p>
<ul>
<li><p>Picos de uso da CPU durante trabalhos em segundo plano (compactação, migração, criação de índices).</p></li>
<li><p>Saturação de E/S do disco que afecta o desempenho da consulta.</p></li>
<li><p>Aquecimento muito lento do cache após uma reinicialização.</p></li>
<li><p>Grande número de segmentos pequenos não indexados (devido a upserts frequentes).</p></li>
<li><p>Regressões de latência ligadas a versões específicas do Milvus.</p></li>
</ul>
<p><strong>Como resolver:</strong></p>
<ul>
<li><p><strong>Reprogramar tarefas em segundo plano</strong> (por exemplo, compactação) para horários fora de pico.</p></li>
<li><p><strong>Libertar colecções não utilizadas</strong> para libertar memória.</p></li>
<li><p>Ter<strong>em conta o tempo de aquecimento</strong> após o reinício; pré-aquecer as caches, se necessário.</p></li>
<li><p><strong>Faça upserts em lote</strong> para reduzir a criação de segmentos minúsculos e permitir que a compactação acompanhe o ritmo.</p></li>
<li><p><strong>Mantenha-se atualizado</strong>: actualize para versões mais recentes do Milvus para correção de erros e optimizações.</p></li>
<li><p>Prover<strong>recursos</strong>: dedicar CPU/memória extra para cargas de trabalho sensíveis à latência.</p></li>
</ul>
<p>Ao fazer corresponder cada sinal à ação correta, a maioria das consultas lentas pode ser resolvida de forma rápida e previsível.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Práticas recomendadas para evitar pesquisas lentas<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>A melhor sessão de depuração é aquela que nunca precisa de ser executada. Em nossa experiência, alguns hábitos simples ajudam muito a prevenir consultas lentas no Milvus:</p>
<ul>
<li><p><strong>Planejar a alocação de recursos</strong> para evitar contenção de CPU e disco.</p></li>
<li><p><strong>Definir alertas proativos</strong> para falhas e picos de latência.</p></li>
<li><p><strong>Manter as expressões de filtro</strong> curtas, simples e eficientes.</p></li>
<li><p><strong>Faça upserts em lote</strong> e mantenha o NQ/QPS em níveis sustentáveis.</p></li>
<li><p><strong>Indexar todos os campos</strong> que são usados nos filtros.</p></li>
</ul>
<p>Consultas lentas no Milvus são raras, e quando elas aparecem, elas geralmente têm causas claras e diagnosticáveis. Com métricas, registos e uma abordagem estruturada, é possível identificar e resolver rapidamente os problemas. Este é o mesmo manual que a nossa equipa de apoio utiliza todos os dias - e agora também é seu.</p>
<p>Esperamos que este guia forneça não só uma estrutura de resolução de problemas, mas também a confiança para manter as suas cargas de trabalho Milvus a funcionar sem problemas e de forma eficiente.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">Quer mergulhar mais fundo?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Junte-se ao <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> para fazer perguntas, partilhar experiências e aprender com a comunidade.</p></li>
<li><p>Inscreva-se no nosso <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> para falar diretamente com a equipa e receber assistência prática com as suas cargas de trabalho.</p></li>
</ul>
