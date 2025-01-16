---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: >-
  Compreender o nível de consistência na base de dados de vectores Milvus -
  Parte II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Uma anatomia do mecanismo subjacente aos níveis de consistência ajustáveis na
  base de dados vetorial Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/longjiquan">Jiquan Long</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>No <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">blogue anterior</a> sobre consistência, explicámos o que é a conotação de consistência numa base de dados vetorial distribuída, abordámos os quatro níveis de consistência - forte, estanquicidade limitada, sessão e eventual - suportados na base de dados vetorial Milvus e explicámos o cenário de aplicação mais adequado para cada nível de consistência.</p>
<p>Nesta publicação, continuaremos a examinar o mecanismo que permite aos utilizadores da base de dados de vectores Milvus escolher de forma flexível o nível de consistência ideal para vários cenários de aplicação. Também forneceremos um tutorial básico sobre como ajustar o nível de consistência na base de dados vetorial Milvus.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">O mecanismo de marcação de tempo subjacente</a></li>
<li><a href="#Guarantee-timestamp">Carimbo de data/hora de garantia</a></li>
<li><a href="#Consistency-levels">Níveis de consistência</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Como ajustar o nível de consistência em Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">O mecanismo de marcação do tempo subjacente<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utiliza o mecanismo de time tick para garantir diferentes níveis de consistência quando uma pesquisa ou consulta vetorial é realizada. O Time Tick é a marca de água do Milvus que funciona como um relógio e indica em que momento se encontra o sistema Milvus. Sempre que é enviado um pedido em linguagem de manipulação de dados (DML) à base de dados vetorial do Milvus, este atribui um carimbo de data/hora ao pedido. Como mostra a figura abaixo, quando são inseridos novos dados na fila de mensagens, por exemplo, o Milvus não só marca um carimbo de data/hora nesses dados inseridos, como também insere marcações de tempo a intervalos regulares.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>marca de tempo</span> </span></p>
<p>Tomemos como exemplo o endereço <code translate="no">syncTs1</code> na figura acima. Quando os consumidores a jusante, como os nós de consulta, vêem <code translate="no">syncTs1</code>, os componentes do consumidor compreendem que todos os dados inseridos antes de <code translate="no">syncTs1</code> foram consumidos. Por outras palavras, os pedidos de inserção de dados cujos valores de carimbo de data/hora são inferiores a <code translate="no">syncTs1</code> deixarão de aparecer na fila de mensagens.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Garantia de carimbo de data/hora<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Tal como mencionado na secção anterior, os componentes consumidores a jusante, como os nós de consulta, obtêm continuamente mensagens de pedidos de inserção de dados e marcações temporais da fila de mensagens. Sempre que um tique de tempo é consumido, o nó de consulta marca esse tique de tempo consumido como o tempo útil - <code translate="no">ServiceTime</code> e todos os dados inseridos antes de <code translate="no">ServiceTime</code> são visíveis para o nó de consulta.</p>
<p>Para além do <code translate="no">ServiceTime</code>, o Milvus adopta também um tipo de marca temporal - a marca temporal de garantia (<code translate="no">GuaranteeTS</code>) para satisfazer a necessidade de vários níveis de consistência e disponibilidade por parte de diferentes utilizadores. Isto significa que os utilizadores da base de dados vetorial Milvus podem especificar <code translate="no">GuaranteeTs</code> para informar os nós de consulta de que todos os dados anteriores a <code translate="no">GuaranteeTs</code> devem estar visíveis e envolvidos quando é efectuada uma pesquisa ou consulta.</p>
<p>Existem normalmente dois cenários quando o nó de consulta executa um pedido de pesquisa na base de dados vetorial Milvus.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Cenário 1: Executar o pedido de pesquisa imediatamente</h3><p>Como mostra a figura abaixo, se <code translate="no">GuaranteeTs</code> for mais pequeno do que <code translate="no">ServiceTime</code>, os nós de consulta podem executar o pedido de pesquisa imediatamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>execute_immediately</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Cenário 2: esperar até "ServiceTime &gt; GuaranteeTs"</h3><p>Se <code translate="no">GuaranteeTs</code> for maior do que <code translate="no">ServiceTime</code>, os nós de consulta devem continuar a consumir tempo da fila de mensagens. Os pedidos de pesquisa não podem ser executados até que <code translate="no">ServiceTime</code> seja superior a <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Níveis de consistência<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Portanto, o <code translate="no">GuaranteeTs</code> é configurável no pedido de pesquisa para atingir o nível de consistência especificado pelo utilizador. Um <code translate="no">GuaranteeTs</code> com um valor grande garante <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">uma consistência forte</a> ao custo de uma alta latência de pesquisa. E um <code translate="no">GuaranteeTs</code> com um valor pequeno reduz a latência da pesquisa, mas a visibilidade dos dados fica comprometida.</p>
<p><code translate="no">GuaranteeTs</code> em Milvus é um formato de carimbo de data/hora híbrido. E o utilizador não faz ideia do <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> dentro do Milvus. Por conseguinte, especificar o valor de<code translate="no">GuaranteeTs</code> é uma tarefa demasiado complicada para os utilizadores. Para evitar problemas aos utilizadores e proporcionar-lhes uma experiência de utilização óptima, Milvus apenas exige que os utilizadores escolham o nível de consistência específico, e a base de dados vetorial Milvus tratará automaticamente do valor <code translate="no">GuaranteeTs</code> para os utilizadores. Ou seja, o utilizador do Milvus só precisa de escolher entre os quatro níveis de consistência: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, e <code translate="no">Eventually</code>. E cada um dos níveis de consistência corresponde a um determinado valor de <code translate="no">GuaranteeTs</code>.</p>
<p>A figura seguinte ilustra o <code translate="no">GuaranteeTs</code> para cada um dos quatro níveis de consistência da base de dados vetorial Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>garantia_ts</span> </span></p>
<p>A base de dados vetorial Milvus suporta quatro níveis de consistência:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> está definido para o mesmo valor que o carimbo de data/hora mais recente do sistema, e os nós de consulta aguardam até que o tempo de serviço avance para o carimbo de data/hora mais recente do sistema para processar o pedido de pesquisa ou consulta.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> O nó de consulta espera até que o tempo de serviço passe para o último carimbo de data/hora do sistema para processar o pedido de pesquisa ou consulta. Os nós de consulta pesquisam imediatamente na vista de dados existente.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> é definido para um valor relativamente menor do que o último carimbo de data/hora do sistema e os nós de consulta pesquisam numa vista de dados toleravelmente menos actualizada.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: O cliente utiliza o carimbo de data/hora da última operação de escrita como <code translate="no">GuaranteeTs</code> para que cada cliente possa, pelo menos, recuperar os dados inseridos por si próprio.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Como ajustar o nível de consistência no Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus permite ajustar o nível de consistência ao <a href="https://milvus.io/docs/v2.1.x/create_collection.md">criar uma coleção</a> ou ao efetuar uma <a href="https://milvus.io/docs/v2.1.x/search.md">pesquisa</a> ou <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Efetuar uma pesquisa de semelhança de vectores</h3><p>Para efetuar uma pesquisa de semelhança vetorial com o nível de consistência pretendido, basta definir o valor do parâmetro <code translate="no">consistency_level</code> como <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, ou <code translate="no">Eventually</code>. Se não definir o valor do parâmetro <code translate="no">consistency_level</code>, o nível de consistência será <code translate="no">Bounded</code> por defeito. O exemplo efectua uma pesquisa de semelhança de vectores com a consistência <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Realizar uma consulta de vetor</h3><p>À semelhança da realização de uma pesquisa de semelhança de vectores, pode especificar o valor para o parâmetro <code translate="no">consistency_level</code> ao realizar uma consulta de vectores. O exemplo efectua uma consulta de vetor com a consistência <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">O que se segue<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial Milvus garante a segurança dos dados?</a></li>
</ul>
