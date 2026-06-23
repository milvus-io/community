---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Por que criámos o Loon: um motor de armazenamento para dados de IA que estão
  em constante mudança.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  O Loon é um novo motor de armazenamento para o Milvus 3.0 e o Zilliz Vector
  Lakebase, concebido para gerir conjuntos de dados vetoriais em constante
  evolução através de ColumnGroups, alinhamento de IDs de linhas e Manifestos.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Este blogue foi publicado originalmente em zilliz.com e foi republicado com autorização.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Pontos-chave<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Trata-se de uma análise técnica longa e aprofundada, pelo que apresentamos aqui os pontos-chave antes de entrarmos nos detalhes.</p>
<ul>
<li>Os conjuntos de dados de IA não são tabelas estáticas. As mesmas linhas estão em constante mudança à medida que as equipas substituem modelos de incorporação, adicionam vetores esparsos, revêem legendas, preenchem rótulos em atraso, reconstroem índices e executam análises offline.</li>
<li>Os esquemas de armazenamento tradicionais apresentam três limitações: as colunas de vetores longos tornam o preenchimento retroativo dispendioso, um único formato de ficheiro não consegue servir bem tanto as varreduras como as leituras pontuais, e o armazenamento em bases de dados privadas obriga os pipelines externos a criar cópias adicionais da informação original.</li>
<li>O Loon é o novo motor de armazenamento para o Milvus e o Zilliz Vector Lakebase. Está construído em torno de formatos de ficheiro híbridos, alinhamento de IDs de linhas e um Manifesto que define o estado versionado do conjunto de dados.</li>
<li>O objetivo é permitir que um único conjunto de dados vetoriais suporte pesquisa online, análise offline, preenchimentos retroativos, compactação e computação externa sem a necessidade de copiar, reescrever ou reimportar dados constantemente.</li>
</ul>
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
    </button></h2><p>Durante algum tempo, houve um argumento contra as bases de dados vetoriais que parecia razoável.</p>
<p><em>As bases de dados tradicionais já armazenam inteiros, cadeias de caracteres, JSON, blobs e índices. Porque não adicionar um</em> <em>tipo</em> « <code translate="no">_vector_</code> <em>», criar um índice ANN a par dele e dar o assunto por encerrado?</em></p>
<p>Para as primeiras etapas da pesquisa semântica, isso funciona suficientemente bem. Uma coluna vetorial mais um índice podem dar resposta a uma demonstração, a uma pequena aplicação RAG ou a uma funcionalidade de pesquisa interna. O problema surge mais tarde, quando o conjunto de dados começa a comportar-se menos como uma tabela e mais como um sistema de dados de IA.</p>
<p>Um conjunto de dados vetorial em produção tem linhas, chaves primárias, campos escalares e colunas pesquisáveis. Nesse sentido, assemelha-se a uma tabela de base de dados. Mas também tem a escala e a estrutura de fluxo de trabalho de um data lake. Pode conter centenas de milhões de registos. É repetidamente lido e reescrito pelo Spark, Ray, DuckDB, pipelines de treino, tarefas de avaliação e sistemas de qualidade de dados.</p>
<p>Também depende do armazenamento de objetos. Os objetos de origem são frequentemente vídeos, imagens, PDFs, ficheiros de áudio ou documentos web que permanecem no S3, GCS, OSS ou noutro armazenamento de objetos. A base de dados armazena referências, metadados, características derivadas e índices. Em seguida, adiciona elementos que os modelos de armazenamento tradicionais não foram concebidos para gerir como objetos de primeira classe: incorporações densas, vetores esparsos, legendas, índices vetoriais, índices de texto, registos de eliminação, estatísticas, versões de modelos, versões de analisadores, referências a blobs externos e as relações de versão entre todos eles.</p>
<p><strong>É aí que a abordagem de «basta adicionar uma coluna vetorial» começa a falhar.</strong> A questão não é se uma base de dados consegue armazenar bytes vetoriais. Muitos sistemas conseguem. A questão mais complexa é <strong>se o modelo de armazenamento consegue lidar com a forma como os dados vetoriais se alteram, como são consultados e como são partilhados ao longo da pilha de dados de IA.</strong></p>
<p><strong>Foi por isso que criámos o Loon, o novo motor de armazenamento para o Milvus e</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>o Zilliz Vector Lakebase</strong></a> <strong>(a próxima evolução do Zilliz Cloud).</strong></p>
<p>O Loon foi concebido com base em três princípios:</p>
<ol>
<li>Utilizar formatos físicos diferentes para diferentes tipos de colunas.</li>
<li>Alinhar essas colunas através de um espaço de ID de linha partilhado.</li>
<li>Utilizar um manifesto para definir o estado versionado do conjunto de dados.</li>
</ol>
<p>Para perceber por que razão estes aspetos são importantes, comecemos por um fluxo de trabalho multimodal comum.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Um conjunto de dados vetoriais nunca está realmente concluído.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagine uma equipa de IA a criar um conjunto de dados de vídeo para formação multimodal.</p>
<p>Um vídeo longo é carregado para um armazenamento de objetos. Um pipeline divide-o em clipes com base em mudanças de cena, limites de tomada ou intervalos de tempo. Os clipes demasiado longos ou curtos, desfocados, duplicados ou de baixa qualidade são filtrados. Os clipes restantes são avaliados por um modelo estético, legendados por outro modelo, incorporados por um modelo de visão-linguagem e armazenados numa base de dados vetorial para pesquisa, deduplicação e filtragem de dados de treino.</p>
<p>A um nível geral, o fluxo de trabalho parece simples:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Mas o conjunto de dados não chega já totalmente formado.</p>
<ul>
<li>Na primeira semana, a tabela pode conter apenas <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> e <code translate="no">duration</code>.</li>
<li>Na segunda semana, a equipa adiciona <code translate="no">aesthetic_score</code>.</li>
<li>Na terceira semana, é executado um modelo de legendagem e cada clipe recebe um <code translate="no">caption</code>.</li>
<li>Na quarta semana, o primeiro modelo de embedding entra em funcionamento e cada clipe recebe um embedding CLIP de 768 dimensões.</li>
<li>Um mês depois, a equipa muda de modelo e retroativa o « <code translate="no">embedding_v2</code> », agora com 1024 dimensões.</li>
<li>Dois meses depois, a pesquisa híbrida torna-se um requisito, pelo que a equipa adiciona uma coluna de vetores esparsos.</li>
<li>Três meses depois, as legendas são submetidas a revisão humana e têm de ser corrigidas no local.</li>
</ul>
<p>O conjunto de dados nunca foi concluído. Continuou a acumular novas interpretações das mesmas linhas subjacentes.</p>
<p>Essa é uma das principais diferenças entre os dados vetoriais e os dados empresariais tradicionais. A mesma linha é reprocessada repetidamente. E a escala transforma isto de um inconveniente num problema de armazenamento: os conjuntos de dados multimodais muitas vezes não têm milhões de registos, mas sim centenas de milhões ou milhares de milhões. O LAION-5B é uma referência útil quanto à sua estrutura — milhares de milhões de pares de imagem-texto, cada um com metadados, legendas e incorporações. Assim, a parte difícil não é a primeira inserção. A parte difícil é tudo o que acontece depois de o conjunto de dados começar a evoluir. <strong>Essa evolução expõe três problemas.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">O primeiro problema: colunas longas tornam a amplificação de gravação dispendiosa<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Os formatos colunares, como o Parquet, são excelentes para muitas cargas de trabalho analíticas. Funcionam bem quando os esquemas são relativamente estáveis, os dados são lidos com mais frequência do que reescritos, as varreduras abrangem apenas um subconjunto de colunas e a compressão é importante. Esse é o contexto para o qual muitos formatos analíticos foram otimizados.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">As linhas vetoriais são muito mais largas do que as linhas analíticas</h3><p>O TPC-H <code translate="no">lineitem</code> é uma boa referência. Tem 16 colunas: chaves inteiras, valores decimais, datas, cadeias curtas e um pequeno campo de comentário. Uma linha não comprimida tem cerca de 150 bytes. Após a compressão, pode ficar muito mais pequena. Com um grupo de linhas de 64 MB, um sistema de armazenamento pode agrupar centenas de milhares de linhas num único grupo.</p>
<p><strong>Os conjuntos de dados vetoriais não se parecem com isso.</strong></p>
<p>Um conjunto de dados de imagem e texto ao estilo LAION está muito mais próximo do que muitos pipelines de IA produzem atualmente. Cada linha continua a ter metadados comuns: um URL, uma legenda, largura, altura, pontuações de qualidade, rótulos e assim por diante. Mas, assim que a incorporação é adicionada, a forma física da linha altera-se.</p>
<p>Um vetor CLIP de 768 dimensões ocupa cerca de 1,5 KB em fp16 ou 3 KB em fp32. Essa única coluna pode ser muito maior do que uma linha inteira do TPC-H <code translate="no">lineitem</code>.</p>
<p>E 768 dimensões não são invulgares nem consideradas grandes para os padrões atuais. Uma incorporação de 1024 ou 2048 dimensões é comum em pipelines multimodais. O modelo « <code translate="no">text-embedding-3-large</code> » da OpenAI chega às 3072 dimensões, o que corresponde a cerca de 12 KB por vetor em fp32.</p>
<p>A comparação é gritante:</p>
<table>
<thead>
<tr><th>Formato do conjunto de dados</th><th>Tamanho aproximado da linha</th><th>O que predomina na linha</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>~150 bytes não comprimidos</td><td>campos escalares e de cadeias de caracteres curtas</td></tr>
<tr><td>Linha no estilo LAION com vetor fp16 de 768 dimensões</td><td>~1,5 KB+</td><td>incorporação</td></tr>
<tr><td>linha no estilo LAION com vetor fp32 de 768 dimensões</td><td>~3 KB+</td><td>incorporação</td></tr>
<tr><td>Linha com vetor fp32 de 3072 dimensões</td><td>~12 KB+ só para o vetor</td><td>incorporação</td></tr>
</tbody>
</table>
<p>Em muitos conjuntos de dados de IA, a coluna do vetor não é apenas mais um campo. Fisicamente, ocupa a maior parte da linha. Isso altera o custo da evolução do esquema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Adicionar uma coluna de vetor pode significar centenas de gigabytes</h3><p>Suponha que um conjunto de dados tenha 100 milhões de clips de vídeo. Adicionar uma nova coluna de incorporação fp32 de 1024 dimensões significa gravar cerca de 400 GB de dados vetoriais brutos. Isso não inclui estatísticas, índices, atualizações de metadados, sobrecarga de armazenamento de objetos, validação ou integração do caminho de serviço.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Se a equipa adicionar uma ou duas colunas de tipo vetorial todos os meses, tais como características de « <code translate="no">embedding_v2</code> », « <code translate="no">sparse_vector</code> » ou «rerank», a evolução do esquema torna-se uma tarefa recorrente de engenharia de dados, medida em centenas de gigabytes ou terabytes.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Pequenas atualizações lógicas podem desencadear grandes reescritas físicas</h3><p>As atualizações são igualmente importantes.</p>
<p>Nos sistemas colunares, os dados antigos normalmente não são atualizados no local. Um registo de eliminação regista o que foi alterado e, posteriormente, a compactação reescreve as linhas ativas em novos ficheiros. Esse modelo é viável quando as linhas são pequenas.</p>
<p>Com dados vetoriais, uma pequena atualização lógica pode desencadear uma grande reescrita física.</p>
<p>Uma tarefa de revisão humana pode corrigir apenas algumas centenas de bytes numa legenda. Mas se a legenda, o vetor denso, o vetor esparso e outras características derivadas partilharem o mesmo ciclo de vida do ficheiro físico, o sistema pode acabar por reescrever também os vetores. A alteração lógica é pequena. A E/S física pode ser enorme.</p>
<p>Este é o problema da amplificação de gravação no armazenamento de vetores. O que é dispendioso não é apenas o facto de os vetores serem grandes. É o facto de os grandes campos derivados e os pequenos campos mutáveis ficarem frequentemente ligados por um layout de armazenamento que os trata como uma única unidade.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Para conjuntos de dados de IA, o preenchimento retroativo é uma carga de trabalho rotineira</h3><p>Para tabelas analíticas tradicionais, a evolução do esquema pode ocorrer apenas ocasionalmente. Para conjuntos de dados de IA, é rotina. Os modelos de legenda são atualizados. Os modelos de incorporação são substituídos. São adicionados vetores esparsos posteriormente. Surgem características de reclassificação. As etiquetas humanas são corrigidas. As etiquetas de governança são preenchidas retroativamente. Os índices são reconstruídos.</p>
<p>Estas operações não são simples adições. Frequentemente, modificam ou ampliam linhas existentes.</p>
<p>É por isso que o armazenamento vetorial não pode limitar-se a otimizar o débito de varredura. Tem também de tornar os preenchimentos retroativos e as atualizações parciais mais económicos.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">O segundo problema: os mesmos dados têm de suportar varreduras e leituras pontuais<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de os dados serem gravados, o caminho de leitura divide-se. O mesmo conjunto de dados vetoriais tem, normalmente, dois padrões de acesso distintos: <strong>varreduras analíticas e leituras pontuais.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">As cargas de trabalho analíticas requerem varreduras amplas e compactadas</h3><p>Um pipeline pode executar filtros como:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Ou pode executar análises offline, avaliação completa de incorporação, estatísticas BM25, construção de mapas de bits, verificações de qualidade de dados, contagens e agrupamentos.</p>
<p>Este padrão lê muitas linhas, mas apenas algumas colunas. Prefere E/S sequencial, grupos de linhas maiores, compressão, poda de colunas, descodificação em lote e execução vetorizada.</p>
<p>Grandes grupos de linhas ajudam neste contexto. Permitem que um único pedido de E/S extraia uma grande quantidade de dados úteis, melhoram a eficiência da compressão e fornecem ao motor de execução dados contíguos suficientes para amortizar a sobrecarga. Quando várias colunas são lidas em conjunto, mantê-las organizadas para o rendimento da varredura também ajuda a reduzir as falhas de cache durante a execução vetorizada.</p>
<p>O Parquet tem um bom desempenho neste aspeto.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Os resultados da ANN requerem pesquisas restritas ao nível da linha</h3><p>Depois de a pesquisa da ANN devolver os IDs das linhas candidatas, o sistema precisa frequentemente de recuperar campos como:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Este padrão lê menos linhas — frequentemente centenas ou milhares —, mas requer acesso preciso por ID de linha. O objetivo é localizar uma linha e coluna específicas, obter apenas o intervalo de bytes necessário e evitar extrair um grupo de linhas inteiro apenas para recuperar alguns registos.</p>
<p>A pesquisa pontual tem uma preferência quase oposta em termos de varredura. Pretende uma granularidade de leitura menor. Idealmente, a camada de armazenamento consegue localizar o segmento ou intervalo de bytes relevante pelo ID da linha, ler apenas esse intervalo e descodificar apenas os dados necessários para o resultado.</p>
<p>A compressão também apresenta um compromisso diferente. Para varreduras, uma compressão mais intensa costuma valer a pena, porque o sistema lê muitos dados e poupa E/S. Para a pesquisa pontual, a compressão pode tornar-se um obstáculo se a recuperação de uma linha exigir a descodificação de um bloco comprimido muito maior.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Um único layout não pode ser otimizado para ambos os cenários</h3><p>Este é o conflito central. A filtragem escalar e a análise exigem layouts amplos, comprimidos e adequados para varreduras. A pesquisa vetorial exige layouts estreitos, precisos e endereçáveis por linha.</p>
<p>Um único formato de ficheiro pode suportar ambos até certo ponto, mas não pode ser ideal para ambos simultaneamente.</p>
<p>Se todas as colunas estiverem no Parquet, as varreduras escalares são fáceis de realizar. Mas a pesquisa ANN após a recuperação torna-se mais difícil. O sistema pode precisar apenas de algumas centenas de vetores, legendas ou registos de metadados, enquanto a camada de armazenamento pode ter de ler grandes grupos de linhas que contêm, na sua maioria, linhas irrelevantes.</p>
<p>Num SSD local, o cache e o mmap podem ocultar parte deste custo. Quando os dados são armazenados num armazenamento de objetos, o custo torna-se mais visível. Cada falha de cache pode transformar-se numa leitura de intervalo remoto. Se as linhas candidatas estiverem espalhadas por muitos grupos de linhas, uma única consulta pode desencadear várias leituras, cada uma a extrair mais dados do que a consulta necessita. Num layout mal concebido, a recuperação de 1 000 linhas candidatas pode facilmente resultar em dezenas ou centenas de megabytes de E/S desnecessária e, em casos extremos, muito mais.</p>
<p>Tornar os grupos de linhas mais pequenos ajuda na pesquisa pontual, mas prejudica as varreduras. Demasiados fragmentos pequenos reduzem a eficiência da compressão, aumentam a sobrecarga de metadados e interrompem as longas leituras sequenciais de que os motores analíticos dependem.</p>
<p><strong>Portanto, o problema não é encontrar um único tamanho «mágico» para os grupos de linhas. O problema é que se está a exigir que o mesmo conjunto de dados se comporte como dois sistemas de armazenamento diferentes.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">A pesquisa híbrida obriga a combinar ambos os caminhos numa única consulta</h3><p>A pesquisa híbrida torna o conflito mais difícil de ignorar. Uma única consulta pode, em primeiro lugar, aplicar filtros escalares:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, executa uma pesquisa ANN.</p>
<p>Em seguida, recupera a legenda, o vetor e os metadados por ID de linha.</p>
<p>Para o utilizador, trata-se de um único pedido de pesquisa. Para a camada de armazenamento, é simultaneamente uma varredura analítica e uma pesquisa aleatória de baixa latência.</p>
<p>É por isso que o armazenamento vetorial precisa de mais do que uma melhor configuração do Parquet. Precisa de uma forma de organizar as diferentes colunas de acordo com a forma como são efetivamente lidas.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">O terceiro problema: o conjunto de dados não reside num único motor<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Os dois primeiros problemas ocorrem no interior da base de dados. O terceiro ocorre na fronteira entre sistemas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Os pipelines de dados de IA abrangem muitos sistemas</h3><p>No fluxo de trabalho de vídeo, muito pouco acontece dentro do próprio banco de dados vetorial.</p>
<p>Os vídeos em bruto residem no armazenamento de objetos. A geração de clipes pode ser executada no Spark ou no Ray. A pontuação estética pode ser executada num serviço de GPU. A legendagem pode ser executada num pipeline de inferência LLM. As incorporações podem ser geradas por outro trabalho de GPU. Os vetores esparsos podem provir de um serviço SPLADE. A avaliação offline, a filtragem de dados de treino, a revisão humana e as tarefas de governança podem todas ser executadas noutro local.</p>
<p>A base de dados vetorial serve a pesquisa online, mas o conjunto de dados é produzido, corrigido, avaliado e ampliado por vários sistemas.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Os formatos de armazenamento privados criam múltiplas cópias da verdade</h3><p>Se a base de dados utilizar um formato físico privado que só ela consegue ler e gravar, cada tarefa externa necessita de uma exportação, uma conversão, uma cópia e uma importação. A mesma coleção pode existir na base de dados, num diretório temporário do Spark, numa saída de avaliação e num diretório local de preenchimento retroativo. Então, a verdadeira questão passa a ser:</p>
<ul>
<li>Qual é a cópia que constitui a fonte da verdade?</li>
<li>Qual delas contém o modelo de legendas do mês passado?</li>
<li>Que linhas já foram corrigidas por revisão humana?</li>
<li>Qual coluna de vetor esparso foi gerada por qual modelo?</li>
<li>Qual é o índice de vetor que continua válido após o preenchimento retroativo?</li>
<li>A que objeto de vídeo original se refere esta linha?</li>
</ul>
<p>Em pequena escala, as equipas conseguem, por vezes, safar-se com convenções de nomenclatura e verificações manuais. Com centenas de milhões de linhas e terabytes de embeddings, isto torna-se um problema de consistência.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Os conjuntos de dados vetoriais precisam de um estado partilhado e versionado</h3><p>Os sistemas Lakehouse resolveram uma versão deste problema para dados estruturados. O Iceberg, o Delta Lake e o Hudi não se limitam apenas a armazenar ficheiros. A sua principal contribuição é permitir que vários motores se coordenem em torno do mesmo estado da tabela.</p>
<p>As bases de dados vetoriais precisam agora de uma capacidade semelhante, mas o estado é mais complexo. Deve incluir não só ficheiros de tabelas e partições, mas também índices vetoriais, índices de texto, características esparsas, registos de eliminação, estatísticas, intervalos de ID de linhas e referências a blobs externos.</p>
<p>A questão não é simplesmente: «O Spark consegue ler ficheiros Milvus?»</p>
<p>A questão é: depois de o Spark preencher uma coluna de vetores esparsos, como é que o Milvus sabe a que versão essa coluna pertence, que linhas abrange, que modelo a produziu e quando é que as consultas online a podem utilizar com segurança?</p>
<p>A resposta tem de estar no modelo de armazenamento.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Por que razão os patches não são suficientes<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>É tentador tratar estes como três problemas de engenharia distintos.</p>
<ul>
<li>Amplificação de gravação? Adicione o processamento em lote.</li>
<li>Leituras pontuais? Adicione um cache.</li>
<li>Sistemas externos? Adicione ferramentas de exportação e importação.</li>
</ul>
<p>Esses remendos podem ajudar, mas não resolvem o problema subjacente: um conjunto de dados vetoriais é fisicamente heterogéneo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No exemplo do vídeo, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> e <code translate="no">aesthetic_score</code> são campos escalares curtos. São úteis para filtragem e análise.</p>
<ul>
<li><code translate="no">caption</code> é texto. Pode ser utilizado para BM25, revisão, correção e preenchimento.</li>
<li><code translate="no">embedding</code> é um vetor longo e denso. É utilizado para o recall da ANN e, posteriormente, para pesquisa ao nível da linha ou reclassificação.</li>
<li><code translate="no">embedding_v2</code> é uma nova saída do modelo, frequentemente preenchida muito tempo depois de os dados originais terem sido inseridos.</li>
<li><code translate="no">sparse_vector</code> suporta pesquisa híbrida e tem o seu próprio padrão de acesso.</li>
<li>O vídeo em bruto deve permanecer no armazenamento de objetos. A base de dados deve armazenar uma referência, uma soma de verificação, um tipo MIME, uma versão do analisador e uma relação ao nível da linha.</li>
<li>Os índices vetoriais, os índices de texto, as estatísticas e os registos de eliminação são objetos derivados com a sua própria semântica de versão.</li>
</ul>
<p>Estes objetos partilham uma linha lógica, mas não devem partilhar todos o mesmo layout físico ou ciclo de vida.</p>
<ul>
<li>Se forem forçados a um layout de tabela comum, as atualizações tornam-se dispendiosas.</li>
<li>Se forem forçados a um único formato de ficheiro colunar, as leituras pontuais tornam-se dispendiosas.</li>
<li>Se forem tratados como ficheiros de objeto não relacionados, a gestão de versões torna-se frágil.</li>
</ul>
<p>Por isso, o modelo de armazenamento tem de partir do princípio de que o conjunto de dados é heterogéneo.</p>
<p><strong>Isso leva a três requisitos de conceção:</strong></p>
<ul>
<li>Em primeiro lugar, grupos de colunas diferentes devem ser armazenados em formatos físicos diferentes.</li>
<li>Em segundo lugar, esses grupos de colunas necessitam de um espaço de ID de linha partilhado, para que possam continuar a comportar-se como uma única tabela lógica.</li>
<li>Em terceiro lugar, o conjunto de dados necessita de um manifesto com versões que declare quais os ficheiros, índices, registos, estatísticas e referências a objetos que pertencem à vista atual.</li>
</ul>
<p><strong>Este é o design subjacente ao Loon, o nosso novo motor de armazenamento por trás do Milvus e do Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: um motor de armazenamento por trás do Milvus e do Zilliz Cloud para conjuntos de dados vetoriais em evolução<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Para resolver todos os problemas acima referidos, criámos <strong>o Loon</strong>, o novo motor de armazenamento para o Milvus e <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>o Zilliz Vector Lakebase</strong></a> (a próxima evolução do Zilliz Cloud), concebido para conjuntos de dados vetoriais em evolução.</p>
<p>O nome segue a tradição da Zilliz de dar nomes de aves aos seus produtos. Um «loon» é uma ave mergulhadora que vive em lagos, o que se adequa bem ao objetivo do sistema: uma base de dados vetorial não deve ter de mover, analisar ou reescrever um lago inteiro de dados sempre que executa uma consulta, preenche uma coluna ou cria um índice. Deve, em primeiro lugar, compreender a versão atual do conjunto de dados, incluindo as suas colunas, índices, estatísticas, registos de eliminação e referências a objetos, para depois ler apenas a parte de que realmente necessita.</p>
<p>Os formatos de ficheiro híbridos, o alinhamento de IDs de linhas e o Manifest não são três funcionalidades separadas. Decorrem da mesma premissa de conceção: um conjunto de dados vetorial é, por natureza, heterogéneo.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Três componentes, um modelo de armazenamento</h3><p>Os formatos de ficheiro híbridos reconhecem que colunas diferentes têm padrões de acesso diferentes. Os campos escalares são adequados para varreduras e filtros. Os campos vetoriais necessitam de uma pesquisa eficiente ao nível da linha. Objetos em bruto, como vídeos, PDFs, imagens e ficheiros de áudio, pertencem ao armazenamento de objetos, não aos ficheiros de dados da base de dados.</p>
<p>O alinhamento de IDs de linha reconhece que estas colunas podem estar fisicamente separadas, mas continuam a descrever as mesmas linhas lógicas. Uma legenda, uma incorporação, um vetor esparso e um URI de vídeo podem residir em ficheiros e formatos diferentes, mas ainda assim precisam de ser reunidos como um único resultado.</p>
<p>O Manifest reconhece que o conjunto de dados não é gravado uma única vez e deixado tal como está. Será modificado por vários sistemas, ao longo de várias versões, para várias tarefas. Índices, estatísticas, registos de eliminação, referências a objetos externos e grupos de colunas devem todos aparecer na mesma vista versionada.</p>
<p><strong>É por isso que o Loon não é apenas um formato de ficheiro vetorial mais rápido.</strong> Um formato mais rápido ajuda na pesquisa por referência, mas não resolve a evolução do esquema nem a coordenação entre vários motores. O alinhamento de IDs de linha permite que colunas divididas se comportem como uma única tabela, mas não especifica quais os ficheiros que pertencem à versão atual. Um Manifesto pode descrever o estado de um conjunto de dados, mas sem grupos de colunas e alinhamento de IDs de linha, não consegue representar de forma clara diferentes disposições físicas dentro de uma única coleção lógica.</p>
<p>O modelo de armazenamento necessita dos três elementos: formatos diferentes para grupos de colunas distintos, um espaço partilhado de IDs de linha para reconstruir as linhas e um Manifesto versionado que indique a todos os leitores e gravadores qual é o estado atual do conjunto de dados.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">O papel do Loon no Milvus e no Zilliz Vector Lakebase</h3><p>No Milvus, substitui a antiga camada de armazenamento de binlogs segmentados por um modelo construído em torno do Manifest, do ColumnGroup, do formato de ficheiro e de abstrações do sistema de ficheiros. No <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (a próxima evolução do Zilliz Cloud)<strong>,</strong> a mesma orientação aplica-se à arquitetura do Vector Lakebase: manter o caminho de serviço da base de dados vetorial rápido, ao mesmo tempo que se torna os dados subjacentes mais fáceis de evoluir, analisar e coordenar com sistemas externos.</p>
<p>Os componentes de nível superior do Milvus mantêm as suas funções habituais. O Proxy trata do encaminhamento. O QueryCoord e o DataCoord tratam do agendamento. O IndexNode cria índices. As APIs voltadas para as aplicações, para recolhas, inserções, pesquisas e pesquisas híbridas, não precisam de expor ficheiros Manifest nem ColumnGroups.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A mudança está a nível subjacente.</p>
<p>O DataNode, o QueryNode, o segcore, a compactação e os conectores externos podem operar através da mesma abstração de armazenamento. Isso é importante porque o conjunto de dados já não é escrito e lido apenas pela base de dados. Pode ser ampliado por sistemas de computação externos e consumido por pesquisas online simultaneamente.</p>
<p>A um nível geral, as camadas têm o seguinte aspeto:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Manifest descreve o estado versionado do conjunto de dados. Os ColumnGroups mapeiam uma coleção lógica para grupos físicos de colunas. A camada de formato de ficheiro permite que cada ColumnGroup escolha um formato adequado. A abstração do sistema de ficheiros funciona tanto no armazenamento de objetos como no armazenamento local.</p>
<p>O ponto importante é que os formatos de ficheiro híbridos, o alinhamento de IDs de linha e o Manifest não são funcionalidades separadas. Juntos, definem o modelo de armazenamento.</p>
<p>Com esse modelo em vigor, podemos analisar as três opções de design uma a uma: como o Loon armazena diferentes ColumnGroups, como os realinha em linhas e como o Manifest transforma esses ficheiros num conjunto de dados versionado.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Conceção 1: utilizar o formato de ficheiro adequado para o grupo de colunas adequado<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Colunas diferentes têm padrões de acesso diferentes. Não devem ser forçadas a utilizar o mesmo formato de ficheiro.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">O Loon separa uma coleção lógica em ColumnGroups.</h3><ul>
<li>Campos escalares, campos de filtro, chaves de negócio e campos estatísticos são frequentemente analisados, filtrados, agregados ou utilizados para o planeamento de consultas. Beneficiam da compressão, da poda de colunas e da compatibilidade com o ecossistema. O Parquet é uma boa opção para estas colunas.</li>
<li>Vetores densos, vetores esparsos e características de reclassificação são frequentemente lidos após a recuperação da ANN por ID de linha. Necessitam de acesso aleatório de baixa latência, leituras precisas de intervalos de bytes e descodificação seletiva. Um layout orientado por segmentos é mais adequado. O Loon utiliza o Vortex neste contexto.</li>
<li>Objetos em bruto, tais como vídeos, PDFs, imagens e ficheiros de áudio, não devem ser incorporados nos ficheiros de dados da base de dados vetorial. Devem permanecer no armazenamento de objetos. A base de dados regista referências, somas de verificação, tipos MIME, versões do analisador e relações ao nível da linha.</li>
</ul>
<p>No exemplo do vídeo, um layout físico poderia ter o seguinte aspeto:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Para a aplicação, trata-se ainda de uma única coleção. Para a camada de armazenamento, diferentes partes dessa coleção utilizam formatos físicos distintos. Isto reduz diretamente as reescritas desnecessárias. Adicionar um « <code translate="no">embedding_v2</code> » pode traduzir-se num novo «ColumnGroup» vetorial, juntamente com um commit do «Manifest». Não requer a reescrita da coluna de legenda, dos metadados escalares nem da coluna de incorporação existente.</p>
<p>A mesma ideia aplica-se a vetores esparsos, características de reclassificação ou outros campos derivados. Se uma nova coluna puder ser fisicamente independente e alinhada pelo ID da linha, não tem de arrastar colunas não relacionadas pelo mesmo caminho de reescrita.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">O Loon também adapta a utilização dos formatos de ficheiro.</h3><p><strong>No caso do Parquet, as configurações predefinidas nem sempre são ideais para dados com grande volume de vetores.</strong> Um grupo de linhas de 64 MB pode ser demasiado grande para a pesquisa pontual, porque uma pequena leitura aleatória pode extrair muito mais dados do que o necessário. O Loon reduz os grupos de linhas para 1 MB em percursos relevantes e desativa codificações, como a codificação por dicionário em colunas vetoriais, quando estas não ajudam na pesquisa aleatória de dados vetoriais.</p>
<p><strong>No caso do Vortex, o aspeto mais importante é o layout.</strong> O Loon utiliza um layout que equilibra a eficiência da varredura e a pesquisa pontual. Dentro de um grupo de linhas, os segmentos de colunas relacionadas podem ser colocados próximos uns dos outros para facilitar a varredura. Para realizar operações, as leituras de subsegmentos permitem que o sistema recupere apenas os bytes relevantes, em vez de extrair um segmento inteiro.</p>
<p><strong>O Loon também suporta a integração do Lance em modo de leitura apenas</strong>, pelo que os conjuntos de dados existentes do Lance podem ser montados como ColumnGroups quando a compatibilidade é importante.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">O que o benchmark revela</h3><p>Num teste local, utilizando um único ficheiro com 40 000 linhas e o esquema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, o Vortex apresentou estes resultados em comparação com o Parquet com grupos de linhas de 1 MB:</p>
<table>
<thead>
<tr><th>Operação</th><th>Vortex</th><th>Parquet</th><th>Diferença</th></tr>
</thead>
<tbody>
<tr><td>Recolha, K=1 000 linhas aleatórias</td><td>5,8 ms</td><td>144 ms</td><td>25 vezes mais rápido</td></tr>
<tr><td>Varredura completa da coluna do vetor</td><td>21 ms</td><td>142 ms</td><td>6,76 vezes mais rápido</td></tr>
<tr><td>Tamanho do ficheiro: ~21 MB de dados brutos</td><td>6,62 MB</td><td>7,16 MB</td><td>7% menor</td></tr>
</tbody>
</table>
<p>O resultado do ` <code translate="no">take</code> ` deve-se à redução da quantidade de dados irrelevantes que têm de ser lidos e descodificados. O resultado da análise deve-se à compressão e às escolhas de implementação.</p>
<p>Estes números devem ser considerados no contexto da sua configuração: 8 vCPU Ubuntu 22.04 KVM, sistema de ficheiros local, um ficheiro, 40 000 linhas, grupos de linhas de 1 MB e o esquema acima. No armazenamento de objetos, a E/S de rede pode ser predominante, pelo que reduzir a amplificação de leitura pode ser ainda mais importante. Os resultados reais dependem da forma do conjunto de dados, do comportamento do armazenamento de objetos, do estado da cache e do padrão de consulta.</p>
<p>A questão mais ampla não é que todas as colunas devam utilizar o Vortex.</p>
<p>A questão é que os conjuntos de dados vetoriais necessitam de uma escolha de formato de ficheiro ao nível do ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Conceção 2: alinhar ficheiros físicos através de IDs de linha<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Os formatos de ficheiro híbridos resolvem um problema: colunas diferentes podem agora residir nos formatos que melhor se adequam a elas.</p>
<p>Mas isso cria um segundo problema. Se os campos escalares residirem no Parquet, os vetores no Vortex e os objetos em bruto no armazenamento de objetos, como é que o sistema continua a tratá-los como uma única coleção?</p>
<p><strong>O Loon resolve isto com o alinhamento de IDs de linha.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">O ID de linha é o sistema de coordenadas da camada de armazenamento</h3><p>Cada ColumnGroupFile físico regista o caminho do ficheiro e o intervalo de IDs de linha que abrange:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Diferentes ColumnGroups podem abranger o mesmo espaço de ID de linha, mesmo que se encontrem em ficheiros e formatos diferentes.</p>
<p>Para o ID de linha <code translate="no">12345</code>, os metadados escalares podem estar num ColumnGroup do Parquet, a incorporação pode estar num ColumnGroup do Vortex e o vídeo bruto pode ser representado por uma referência ao armazenamento de objetos. Logicamente, continuam a ser uma única linha. Isto proporciona à camada de armazenamento um sistema de coordenadas estável.</p>
<p>O ID de linha não é a chave primária do negócio. É o sistema de coordenadas da camada de armazenamento que permite ao Loon dividir fisicamente uma coleção sem perder a capacidade de a reconstruir logicamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">As novas colunas não têm de reescrever as colunas antigas</h3><p>Adicionar um « <code translate="no">embedding_v2</code> » não requer a reescrita da legenda original, dos metadados ou dos «ColumnGroups» d <code translate="no">embedding_v1</code>. O Loon pode escrever um novo «ColumnGroup» de vetores, registar o intervalo de IDs de linha que abrange e confirmar essa alteração através do «Manifest».</p>
<p>O mesmo se aplica a vetores esparsos, características reclassificadas ou outros campos derivados que surjam posteriormente.</p>
<p>Desde que o novo ColumnGroup abranja o intervalo de IDs de linha correto, pode juntar-se à mesma coleção lógica sem forçar a movimentação de dados não relacionados.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">As eliminações e a compactação podem ser mais direcionadas</h3><p>O alinhamento dos IDs de linha também ajuda nas eliminações.</p>
<p>Uma eliminação pode ser inicialmente expressa através de um registo de eliminação. A linha torna-se invisível a nível lógico, enquanto a limpeza física é adiada até à compactação. Quando a compactação é finalmente executada, nem sempre é necessário reescrever todos os ColumnGroups associados às linhas afetadas. Pode concentrar-se nos ColumnGroups que necessitam de limpeza.</p>
<p>Isto é importante porque nem todas as colunas têm o mesmo perfil de custo. Reescrever um ColumnGroup escalar curto é muito diferente de reescrever centenas de gigabytes de vetores densos.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">A pesquisa híbrida pode recuperar apenas as colunas de que necessita</h3><p>O alinhamento dos ID das linhas é também o que torna a pesquisa híbrida prática em formatos de ficheiro híbridos.</p>
<p>Depois de a pesquisa ANN devolver os IDs de linhas candidatas, o sistema pode recuperar apenas os campos necessários para o resultado final: legendas, metadados, vetores, características de reclassificação ou referências a objetos.</p>
<p>Por exemplo, uma consulta pode necessitar de:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Esses campos podem estar em diferentes ColumnGroups. O Loon consegue localizar os ficheiros relevantes por intervalo de ID de linha, ler os intervalos de bytes necessários e compilar o resultado.</p>
<p>Sem o alinhamento de IDs de linha, os formatos híbridos seriam apenas ficheiros separados, lado a lado. Com o alinhamento de IDs de linha, comportam-se como uma única coleção lógica.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">O «Packed Reader» oculta a divisão da camada superior</h3><p>O componente de tempo de execução que torna isto utilizável é o Packed Reader.</p>
<p>A camada superior vê um fluxo unificado de Arrow RecordBatch. Por baixo, os dados podem provir de vários ColumnGroups em diferentes formatos de ficheiro. O Packed Reader oculta essas diferenças, alinha os dados por intervalos de ID de linha e programa a E/S de múltiplos ficheiros com utilização controlada da memória.</p>
<p>Também suporta a « <code translate="no">take</code> » direta por ID de linha. Dado um conjunto de IDs de linha, localiza os «ColumnGroupFiles» relevantes, emite leituras de intervalo e devolve os campos solicitados.</p>
<p>No caso do fluxo de trabalho de vídeo, uma consulta ANN pode necessitar de « <code translate="no">caption</code> », « <code translate="no">embedding</code> » e « <code translate="no">video_uri</code> ». O Packed Reader consegue recuperar o ColumnGroup escalar e o ColumnGroup vetorial sem afetar colunas não relacionadas.</p>
<p>Essa é a diferença entre «ficheiros separados» e «uma tabela com vários layouts físicos».</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Conceção 3: tornar o Manifest a fonte de verdade<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Os formatos de ficheiro híbridos definem como os dados são armazenados fisicamente. O alinhamento dos IDs das linhas determina como os ColumnGroups separados continuam a formar uma única tabela lógica. Mas o sistema ainda precisa de responder a uma questão mais ampla: <strong>quais os ficheiros, registos, estatísticas, índices e referências a objetos que pertencem à versão atual do conjunto de dados? Essa é a função do Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Os diretórios de armazenamento de objetos não são suficientes</h3><p>O armazenamento de objetos não é um catálogo de bases de dados. Um diretório pode conter ficheiros antigos, ficheiros novos, resultados de tarefas com falha, ficheiros temporários, registos de eliminação, ficheiros ainda referenciados por instantâneos mais antigos e ficheiros à espera de limpeza. O facto de um ficheiro existir não significa que pertença à versão atual do conjunto de dados.</p>
<p>Um conjunto de dados do Loon pode estar organizado em diretórios como:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Mas a estrutura de diretórios não é a fonte de verdade. O Manifest é que o é. Os leitores não devem listar diretórios e inferir o estado a partir dos ficheiros que por acaso existam. Devem ler o Manifest atual e seguir a visão versionada que este declara.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">O Manifesto define uma visão versionada do conjunto de dados</h3><p>O Manifesto define o conjunto de dados numa determinada versão. Regista:</p>
<ul>
<li>quais os ColumnGroups existentes</li>
<li>quais os intervalos de IDs de linha que abrangem</li>
<li>qual o formato físico que cada ColumnGroup utiliza</li>
<li>onde se encontram os ficheiros</li>
<li>quais os registos de eliminação que estão ativos</li>
<li>quais as estatísticas que estão disponíveis</li>
<li>quais os índices existentes</li>
<li>quais os blobs externos que são referenciados</li>
<li>quais as colunas e intervalos de linhas que essas estatísticas ou índices abrangem</li>
</ul>
<p>Cada atualização grava uma nova versão do Manifest. Um leitor que abre a versão N vê uma visão estável do conjunto de dados na versão N. Um gravador pode preparar a versão N+1 sem perturbar os leitores que ainda estão a utilizar a versão N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">O Manifest rastreia mais do que apenas ficheiros de tabelas</h3><p>No Loon, o corpo do Manifest é codificado com o Apache Avro e organizado em torno de quatro secções principais.</p>
<ul>
<li>Os ColumnGroups descrevem as colunas, os formatos, os ficheiros e os intervalos de IDs de linhas.</li>
<li>Os DeltaLogs descrevem as eliminações. Diferentes tipos de eliminação abrangem diferentes fontes de alteração, tais como eliminações por chave primária a partir de clientes, eliminações posicionais resultantes de compactação interna ou eliminações por igualdade a partir de motores externos.</li>
<li>Os Stats incluem metadados de planeamento, tais como filtros Bloom, estatísticas BM25 e valores mínimos/máximos.</li>
<li>Os «Indexes» descrevem o tipo de índice, os parâmetros, as colunas abrangidas e os intervalos de IDs de linhas. Isto pode incluir índices vetoriais, como HNSW ou IVF, índices de texto, índices invertidos, índices de bitmap e estruturas relacionadas.</li>
</ul>
<p>É aqui que o Loon difere de um manifesto de tabela tradicional.</p>
<p>Um conjunto de dados vetorial precisa de rastrear não só ficheiros de dados e partições, como também índices vetoriais, índices de texto, características esparsas, registos de eliminação, estatísticas, referências a objetos externos e os intervalos de ID de linha que os ligam.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">O Manifesto deve ser gravável por mais do que apenas a base de dados</h3><p>O mais importante não é apenas o que o Manifesto contém, mas sim quem pode gravá-lo.</p>
<ul>
<li>Se apenas a base de dados puder gravar o Manifesto, este permanece como metadados internos. Metadados mais organizados, mas ainda privados a um único motor.</li>
<li>Se os motores externos puderem gerar novos ColumnGroups, estatísticas e entradas no Manifesto, este torna-se uma interface de coordenação.</li>
<li>Um trabalho do Spark, por exemplo, pode preencher retroativamente uma coluna de vetor esparso. Escreve um novo ColumnGroup, regista a cobertura das linhas e as estatísticas e submete um novo Manifesto. As consultas online podem continuar a ler a versão antiga durante o trabalho. Assim que a submissão for bem-sucedida, a nova versão torna-se visível.</li>
</ul>
<p>Isto é semelhante, em essência, ao Iceberg e ao Delta Lake, mas o modelo de objetos é mais abrangente. Um conjunto de dados vetorial precisa de acompanhar índices vetoriais, índices de texto, características esparsas, registos de eliminação, estatísticas, referências a blobs e intervalos de IDs de linhas, e não apenas ficheiros de tabela e partições.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">As confirmações otimistas simplificam as atualizações de versão</h3><p>Cada confirmação grava uma nova versão do Manifest. Um gravador pode criar novo conteúdo com base na versão N e, em seguida, tentar gravar um <code translate="no">manifest-{N+1}.avro</code>. A semântica de gravação condicional ou de correspondência de geração do armazenamento de objetos pode fazer com que a confirmação falhe se essa versão já existir. O gravador pode então tentar novamente com a versão mais recente.</p>
<p>Isto proporciona ao Loon concorrência otimista sem obrigar todas as atualizações a passar por um percurso de coordenação pesado e fortemente consistente. Sem um Manifest, o armazenamento multiformato e multimotor acaba por se transformar em convenções de nomenclatura e reconciliação manual. Isso pode funcionar para pequenos conjuntos de dados. Não funciona para dados vetoriais à escala de TB.</p>
<p>O Manifest é o que transforma ficheiros heterogéneos num conjunto de dados que vários sistemas podem ler e atualizar com segurança.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">O que muda para os utilizadores quando o armazenamento passa a ser versionado<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Para os programadores de aplicações, o Loon não deve tornar-se um novo fardo em termos de API.</p>
<p>Os utilizadores devem continuar a trabalhar com conceitos familiares do Milvus: coleções, inserções, pesquisa e pesquisa híbrida. Não devem ter de pensar em ficheiros de Manifesto, ColumnGroups, intervalos de IDs de linhas ou layout de ficheiros durante o desenvolvimento normal de aplicações.</p>
<p>A mudança ocorre a nível subjacente. O armazenamento torna-se mais sensível à forma como os conjuntos de dados de IA evoluem na realidade.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Adicionar uma nova incorporação não deve mover os dados antigos</h3><p>Anteriormente, adicionar um <code translate="no">embedding_v2</code> a a uma coleção existente exigia frequentemente exportar dados, treinar um novo modelo, gerar vetores e, em seguida, reimportar ou atualizar em massa a coleção através do SDK. Esse processo gera muito trabalho operacional: acompanhamento de versões, repetições de tarefas com falha, reconstrução de índices, impacto no serviço e verificações de consistência.</p>
<p><strong>Com o Loon, isto pode resumir-se a uma evolução do esquema, acompanhada de um novo commit do ColumnGroup.</strong> A nova coluna de embedding pode ser definida como o seu próprio ColumnGroup físico, alinhada pelo ID da linha e tornada visível através do Manifest. A antiga coluna de legenda, a coluna de metadados escalares e a coluna de embedding original não precisam de ser movidas.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Os preenchimentos retroativos não devem exigir um ciclo de atualização do lado do cliente</h3><p>Muitas atualizações de dados de IA são preenchimentos retroativos. Uma equipa pode adicionar vetores esparsos depois de a pesquisa híbrida se tornar importante. Pode adicionar características de reclassificação após o treino de um novo modelo. Pode corrigir legendas após revisão humana. Pode adicionar etiquetas de governança após uma atualização de política.</p>
<p>Num layout tradicional, estas alterações ocorrem frequentemente através de atualizações do SDK do cliente ou de percursos de gravação exclusivos da base de dados, mesmo quando os dados são produzidos pelo Spark, Ray ou outro motor externo.</p>
<p>Com o Loon, os sistemas de computação externos podem produzir novos ColumnGroups e submetê-los através do Manifest. A base de dados já não tem de ser o único ponto de entrada para cada reescrita.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">A análise offline não deve exigir outra cópia da verdade</h3><p>Anteriormente, as equipas costumavam exportar uma coleção online para o Parquet para avaliação ou análise offline. Isso cria duas versões do mesmo conjunto de dados: a coleção online e a cópia de análise. Assim que as legendas são corrigidas, as incorporações são regeneradas, os registos de eliminação são aplicados ou os índices são reconstruídos, a equipa tem de determinar qual das cópias está atualizada.</p>
<p>Com um modelo de armazenamento baseado no Manifest, os motores de análise podem ler a mesma visão versionada do conjunto de dados que o sistema de serviço. Podem projetar apenas as colunas de que necessitam, analisar apenas os intervalos de linhas relevantes e trabalhar com uma versão declarada do conjunto de dados, em vez de um instantâneo exportado manualmente.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">As eliminações e correções devem incidir apenas sobre o que foi alterado</h3><p>Eliminações, correções de legendas, correções de rótulos e atualizações de governança são rotineiras em conjuntos de dados de IA. Não devem forçar todas as colunas de vetores longos a passar pelo mesmo percurso de reescrita.</p>
<p>Com o Loon, a eliminação de registos pode ser tratada inicialmente como uma eliminação lógica. Uma compactação posterior pode limpar os ColumnGroups afetados sem reescrever dados não relacionados. Se um campo de texto curto for alterado, a camada de armazenamento não deve ter de reescrever centenas de gigabytes de vetores densos apenas porque partilham a mesma linha lógica.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Os motores externos tornam-se parte do fluxo de trabalho, não uma saída de emergência</h3><p>A mudança mais significativa é que os motores externos já não são tratados como sistemas fora da base de dados de vetores.</p>
<p>O Spark, o Ray, os trabalhos de avaliação, os sistemas de rotulagem e os pipelines de governação já produzem e modificam grande parte dos dados. A camada de armazenamento deve permitir-lhes colaborar em torno de uma única fonte de verdade, em vez de estarem constantemente a exportar, copiar e reimportar.</p>
<p>É isso que uma versão do Manifest torna possível. Proporciona ao serviço online, à análise offline, às tarefas de preenchimento retroativo e à compactação uma visão partilhada do conjunto de dados.</p>
<p>Isto pode parecer apenas detalhes de armazenamento interno, mas afeta a rapidez com que as equipas podem iterar sobre conjuntos de dados de IA. Cada alteração de modelo, preenchimento de características, correção de legendas, filtro de qualidade e reconstrução de índices depende da mesma questão:<strong>«O sistema consegue atualizar o conjunto de dados sem mover dados que não precisa de mover?»</strong></p>
<p>Esse é o valor prático do modelo de armazenamento.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">O Loon está disponível na versão beta do Milvus 3.0 e no Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>O Loon está disponível na <a href="https://milvus.io/docs/release_notes.md">versão beta do Milvus 3.0</a> e faz também parte da camada de armazenamento do <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, a próxima evolução do Zilliz Cloud. E esta versão centra-se em três áreas principais:</p>
<ul>
<li><strong>O Manifest.</strong> O objetivo é que as gravações, preenchimentos retroativos, eliminações, estatísticas e atualizações de índices produzam visualizações versionadas do conjunto de dados que os leitores possam abrir de forma consistente. Para os leitores, isto significa que uma consulta pode abrir uma versão específica do Manifest e apresentar uma visão estável do conjunto de dados. Para os gravadores, isto significa que novos ficheiros de dados, registos de eliminação, estatísticas ou ficheiros de índice podem ser preparados primeiro e, em seguida, tornados visíveis através de um commit versionado.</li>
<li><strong>O ColumnGroup e o suporte a formatos.</strong> O Parquet suporta colunas escalares e compatíveis com o ecossistema. O Vortex suporta padrões de acesso com grande volume de vetores. O Lance pode ser integrado no modo de leitura apenas para garantir a compatibilidade com conjuntos de dados Lance existentes.</li>
<li><strong>O Índice no Lake.</strong> Estatísticas escalares, índices de filtragem e índices invertidos de texto podem participar no planeamento baseado no Manifest por intervalo de linhas. Os índices vetoriais nativos do Lake têm um papel mais complexo. O HNSW e o IVF têm comportamentos diferentes no armazenamento de objetos e, em particular, o HNSW é sensível ao acesso aleatório e à localidade da cache. Não é possível simplesmente reutilizar um layout concebido para um SSD local e esperar o mesmo resultado.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Ainda há trabalho pela frente</h3><ul>
<li><strong>Os percursos de gravação externos</strong> são importantes porque o Spark e o Ray devem ser capazes de produzir ColumnGroups e commits de Manifest sem forçar cada preenchimento retroativo a passar por um ciclo do SDK do cliente.</li>
<li><strong>A interoperabilidade do Lakehouse</strong> é importante porque muitas equipas já utilizam catálogos e motores de consulta como <strong>o Iceberg, o Delta Lake, o Trino, o DuckDB e o Athena.</strong> Os dados vetoriais devem poder integrar-se nesse ecossistema sem perder o desempenho da pesquisa vetorial.</li>
<li><strong>O layout do índice</strong> é importante porque os índices de grafos e as estruturas invertidas têm padrões de acesso diferentes no armazenamento de objetos.</li>
<li><strong>A semântica de objetos de grande dimensão</strong> é importante porque vídeos em bruto, PDFs, imagens e ficheiros de áudio requerem gestão de referências, controlo de versões e comportamentos de eliminação que estejam alinhados com o conjunto de dados vetoriais derivado.</li>
</ul>
<p>O comportamento exato da versão, as definições predefinidas e o caminho de migração devem seguir <a href="https://docs.zilliz.com/docs/release-notes-2605">as notas de lançamento</a> relevantes do Milvus e <a href="https://docs.zilliz.com/docs/release-notes-2605">do Zilliz Cloud</a>. A orientação em termos de armazenamento, no entanto, é clara: as bases de dados vetoriais precisam de uma base versionada e nativa do «lake» por baixo da camada de serviço.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Experimente o Loon no Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Se a sua pilha atual separa o serviço online, a análise offline, os preenchimentos retroativos e os fluxos de trabalho do data lake externo em sistemas diferentes, vale a pena dar uma vista de olhos ao Zilliz Vector Lakebase. Pode experimentá-lo na <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. As novas inscrições com e-mail profissional recebem 100 dólares em créditos gratuitos. Também pode <a href="https://zilliz.com/contact-sales">contactar-nos para falar</a> sobre o seu caso de utilização.</p>
<p>Pode ainda acompanhar o <a href="https://milvus.io/docs/release_notes.md">lançamento do Milvus 3.0</a> para ver como o Loon evolui no motor de código aberto.</p>
<p><strong>O Zilliz Vector Lakebase reúne:</strong></p>
<ul>
<li>Serviço em camadas para diferentes compromissos entre desempenho em tempo real e custos</li>
<li>Pesquisa a pedido para cargas de trabalho em grande escala ou exploratórias, sem computação sempre ativa</li>
<li>Pesquisa em lagos de dados externos, para que possa indexar e pesquisar diretamente nos dados existentes no lago</li>
<li>Pesquisa de espectro completo em vetores, texto, JSON e dados geoespaciais, com recuperação híbrida e reclassificação</li>
<li>Armazenamento unificado nativo do data lake, baseado no Vortex, um formato aberto concebido para leituras aleatórias mais rápidas e de menor custo em dados com grande volume de vetores</li>
</ul>
