---
id: 2019-11-08-data-management.md
title: Como é feita a gestão de dados em Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Este post apresenta a estratégia de gestão de dados em Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Gestão de dados em motores de busca vectoriais de grande escala</custom-h1><blockquote>
<p>Autor: Yihua Mo</p>
<p>Data: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Como é feita a gestão de dados em Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mais, alguns conceitos básicos de Milvus:</p>
<ul>
<li>Tabela: A tabela é um conjunto de dados de vectores, em que cada vetor tem um ID único. Cada vetor e o seu ID representam uma linha da tabela. Todos os vectores de uma tabela têm de ter as mesmas dimensões. Abaixo está um exemplo de uma tabela com vectores de 10 dimensões:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>tabela</span> </span></p>
<ul>
<li>Índice: A construção de um índice é o processo de agrupamento de vectores através de um determinado algoritmo, o que requer espaço adicional em disco. Alguns tipos de índices requerem menos espaço, uma vez que simplificam e comprimem os vectores, enquanto outros tipos requerem mais espaço do que os vectores em bruto.</li>
</ul>
<p>No Milvus, os utilizadores podem executar tarefas como criar uma tabela, inserir vectores, criar índices, pesquisar vectores, obter informações da tabela, eliminar tabelas, remover dados parciais de uma tabela e remover índices, etc.</p>
<p>Suponhamos que temos 100 milhões de vectores de 512 dimensões e que é necessário inseri-los e geri-los no Milvus para uma pesquisa vetorial eficiente.</p>
<p><strong>(1) Inserção de vectores</strong></p>
<p>Vejamos como os vectores são inseridos no Milvus.</p>
<p>Como cada vetor ocupa 2 KB de espaço, o espaço mínimo de armazenamento para 100 milhões de vectores é de cerca de 200 GB, o que torna irrealista a inserção única de todos estes vectores. É necessário criar vários ficheiros de dados em vez de um. O desempenho da inserção é um dos principais indicadores de desempenho. O Milvus suporta a inserção única de centenas ou mesmo dezenas de milhares de vectores. Por exemplo, a inserção única de 30 mil vectores de 512 dimensões demora geralmente apenas 1 segundo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>inserção</span> </span></p>
<p>Nem todas as inserções de vectores são carregadas no disco. Milvus reserva um buffer mutável na memória da CPU para cada tabela que é criada, onde os dados inseridos podem ser rapidamente escritos. E quando os dados no buffer mutável atingirem um determinado tamanho, este espaço será rotulado como imutável. Nesse meio tempo, um novo buffer mutável será reservado. Os dados no buffer imutável são gravados no disco regularmente e a memória correspondente da CPU é liberada. O mecanismo de gravação regular no disco é semelhante ao usado no Elasticsearch, que grava dados armazenados em buffer no disco a cada 1 segundo. Além disso, os utilizadores que estão familiarizados com o LevelDB/RocksDB podem ver aqui alguma semelhança com o MemTable.</p>
<p>Os objectivos do mecanismo de inserção de dados são:</p>
<ul>
<li>A inserção de dados deve ser eficiente.</li>
<li>Os dados inseridos podem ser utilizados instantaneamente.</li>
<li>Os ficheiros de dados não devem ser demasiado fragmentados.</li>
</ul>
<p><strong>(2) Ficheiro de dados brutos</strong></p>
<p>Quando os vectores são escritos no disco, são guardados num ficheiro de dados brutos que contém os vectores brutos. Como mencionado anteriormente, os vectores de grande escala têm de ser guardados e geridos em vários ficheiros de dados. O tamanho dos dados inseridos varia, uma vez que os utilizadores podem inserir 10 vectores ou 1 milhão de vectores de uma só vez. No entanto, a operação de escrita no disco é executada uma vez a cada 1 segundo. Assim, são gerados ficheiros de dados de diferentes tamanhos.</p>
<p>Os ficheiros de dados fragmentados não são fáceis de gerir nem de aceder para a pesquisa de vectores. O Milvus funde constantemente estes pequenos ficheiros de dados até que o tamanho do ficheiro fundido atinja um determinado tamanho, por exemplo, 1GB. Este tamanho específico pode ser configurado no parâmetro da API <code translate="no">index_file_size</code> na criação de tabelas. Assim, 100 milhões de vectores de 512 dimensões serão distribuídos e guardados em cerca de 200 ficheiros de dados.</p>
<p>Tendo em conta os cenários de computação incremental, em que os vectores são inseridos e pesquisados em simultâneo, temos de nos certificar de que, assim que os vectores são escritos no disco, estão disponíveis para pesquisa. Assim, antes de os pequenos ficheiros de dados serem fundidos, podem ser acedidos e pesquisados. Quando a fusão estiver concluída, os ficheiros de dados pequenos serão removidos e os ficheiros recentemente fundidos serão utilizados para pesquisa.</p>
<p>Este é o aspeto dos ficheiros consultados antes da fusão:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>Ficheiros consultados após a fusão:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) Ficheiro de índice</strong></p>
<p>A pesquisa baseada no ficheiro de dados brutos é uma pesquisa de força bruta que compara as distâncias entre os vectores de consulta e os vectores de origem e calcula os k vectores mais próximos. A pesquisa por força bruta é ineficiente. A eficiência da pesquisa pode ser grandemente aumentada se a pesquisa for baseada no Ficheiro de índice onde os vectores são indexados. A criação de um índice requer espaço adicional em disco e é normalmente demorada.</p>
<p>Então, quais são as diferenças entre ficheiros de dados brutos e ficheiros de índice? Simplificando, o ficheiro de dados brutos regista cada vetor juntamente com o seu ID único, enquanto o ficheiro de índice regista os resultados do agrupamento de vectores, como o tipo de índice, os centróides do agrupamento e os vectores em cada agrupamento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>Ficheiro de índice</span> </span></p>
<p>De um modo geral, o Ficheiro de índice contém mais informações do que o Ficheiro de dados brutos, mas os tamanhos dos ficheiros são muito mais pequenos, uma vez que os vectores são simplificados e quantificados durante o processo de construção do índice (para determinados tipos de índices).</p>
<p>As tabelas recém-criadas são, por defeito, pesquisadas por computação bruta. Assim que o índice é criado no sistema, o Milvus constrói automaticamente o índice para ficheiros fundidos que atinjam o tamanho de 1 GB numa thread autónoma. Quando a construção do índice estiver concluída, é gerado um novo ficheiro de índice. Os ficheiros de dados brutos serão arquivados para a construção de índices com base noutros tipos de índices.</p>
<p>O Milvus constrói automaticamente o índice para os ficheiros que atingem 1 GB:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Construção de índice concluída:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>O índice não será criado automaticamente para ficheiros de dados brutos que não atinjam 1 GB, o que pode diminuir a velocidade de pesquisa. Para evitar esta situação, é necessário forçar manualmente a construção do índice para esta tabela.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcebuild</span> </span></p>
<p>Depois de forçar a criação do índice para o ficheiro, o desempenho da pesquisa é bastante melhorado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Meta dados</strong></p>
<p>Como mencionado anteriormente, 100 milhões de vectores de 512 dimensões são guardados em 200 ficheiros de disco. Quando o índice é construído para estes vectores, haverá 200 ficheiros de índice adicionais, o que faz com que o número total de ficheiros seja 400 (incluindo os ficheiros de disco e os ficheiros de índice). É necessário um mecanismo eficiente para gerir os metadados (estado dos ficheiros e outras informações) destes ficheiros, a fim de verificar o seu estado, remover ou criar ficheiros.</p>
<p>A utilização de bases de dados OLTP para gerir estas informações é uma boa opção. O Milvus autónomo utiliza o SQLite para gerir os metadados, enquanto que na implementação distribuída, o Milvus utiliza o MySQL. Quando o servidor Milvus arranca, são criadas 2 tabelas (nomeadamente 'Tables' e 'TableFiles') em SQLite/MySQL, respetivamente. 'Tables' regista a informação das tabelas e 'TableFiles' regista a informação dos ficheiros de dados e dos ficheiros de índice.</p>
<p>Como demonstrado no fluxograma abaixo, 'Tables' contém metadados como o nome da tabela (table_id), a dimensão do vetor (dimension), a data de criação da tabela (created_on), o estado da tabela (state), o tipo de índice (engine_type), o número de clusters do vetor (nlist) e o método de cálculo da distância (metric_type).</p>
<p>E 'TableFiles' contém o nome da tabela a que o ficheiro pertence (table_id), o tipo de índice do ficheiro (engine_type), o nome do ficheiro (file_id), o tipo de ficheiro (file_type), o tamanho do ficheiro (file_size), o número de linhas (row_count) e a data de criação do ficheiro (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>metadados</span> </span></p>
<p>Com estes metadados, podem ser executadas várias operações. Seguem-se alguns exemplos:</p>
<ul>
<li>Para criar uma tabela, o Meta Manager só precisa de executar uma instrução SQL: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Para executar a pesquisa vetorial na tabela_2, o MetaManager executará uma consulta em SQLite/MySQL, que é uma instrução SQL de facto: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> para obter as informações dos ficheiros da tabela_2. Em seguida, estes ficheiros serão carregados na memória pelo Query Scheduler para o cálculo da pesquisa.</li>
<li>Não é permitido eliminar instantaneamente uma tabela, uma vez que podem estar a ser executadas consultas nessa tabela. É por isso que existem as opções "soft-delete" e "hard-delete" para uma tabela. Quando se elimina uma tabela, esta é rotulada como "soft-delete" e não é permitido efetuar mais consultas ou alterações. No entanto, as consultas que estavam a ser executadas antes da eliminação continuam a ser executadas. Só quando todas estas consultas pré-exclusão estiverem concluídas, a tabela, juntamente com os seus metadados e ficheiros relacionados, será definitivamente eliminada.</li>
</ul>
<p><strong>(5) Programador de consultas</strong></p>
<p>O gráfico abaixo demonstra o processo de pesquisa de vectores tanto na CPU como na GPU, consultando os ficheiros (ficheiros de dados brutos e ficheiros de índice) que são copiados e guardados no disco, na memória da CPU e na memória da GPU para os topk vectores mais semelhantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresultado</span> </span></p>
<p>O algoritmo de programação de consultas melhora significativamente o desempenho do sistema. A filosofia básica de conceção consiste em obter o melhor desempenho de pesquisa através da utilização máxima dos recursos de hardware. Abaixo está apenas uma breve descrição do agendador de consultas e haverá um artigo dedicado a este tópico no futuro.</p>
<p>Chamamos à primeira consulta a uma dada tabela a consulta "fria" e às consultas subsequentes a consulta "quente". Quando a primeira consulta é feita contra uma determinada tabela, o Milvus faz muito trabalho para carregar dados na memória da CPU e alguns dados na memória da GPU, o que consome muito tempo. Em consultas posteriores, a pesquisa é muito mais rápida, pois parte ou todos os dados já estão na memória da CPU, o que economiza o tempo de leitura do disco.</p>
<p>Para reduzir o tempo de pesquisa da primeira consulta, o Milvus fornece a configuração Preload Table (<code translate="no">preload_table</code>), que permite o pré-carregamento automático de tabelas na memória da CPU aquando do arranque do servidor. Para uma tabela que contenha 100 milhões de vectores de 512 dimensões, o que corresponde a 200 GB, a velocidade de pesquisa é mais rápida se houver memória suficiente na CPU para armazenar todos estes dados. No entanto, se a tabela contiver vectores de milhares de milhões de dimensões, é por vezes inevitável libertar memória da CPU/GPU para adicionar novos dados que não são consultados. Atualmente, utilizamos o LRU (Latest Recently Used) como estratégia de substituição de dados.</p>
<p>Como mostra o gráfico abaixo, suponha que existe uma tabela que tem 6 ficheiros de índice armazenados no disco. A memória da CPU só pode armazenar 3 ficheiros de índice e a memória da GPU apenas 1 ficheiro de índice.</p>
<p>Quando a pesquisa começa, 3 ficheiros de índice são carregados na memória da CPU para consulta. O primeiro ficheiro será libertado da memória da CPU imediatamente após ser consultado. Entretanto, o 4º ficheiro é carregado na memória da CPU. Da mesma forma, quando um ficheiro é consultado na memória da GPU, é imediatamente libertado e substituído por um novo ficheiro.</p>
<p>O programador de consultas lida principalmente com 2 conjuntos de filas de tarefas, uma fila é sobre o carregamento de dados e outra é sobre a execução da pesquisa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>Queryschedule</span> </span></p>
<p><strong>(6) Redutor de resultados</strong></p>
<p>Há dois parâmetros-chave relacionados com a pesquisa vetorial: um é "n", que significa o número n de vectores-alvo; o outro é "k", que significa os k vectores mais semelhantes. Os resultados da pesquisa são, de facto, n conjuntos de KVP (pares chave-valor), cada um com k pares de chave-valor. Como as consultas têm de ser executadas em relação a cada ficheiro individual, independentemente de se tratar de um ficheiro de dados brutos ou de um ficheiro de índice, serão obtidos n conjuntos de resultados dos k melhores para cada ficheiro. Todos estes conjuntos de resultados são fundidos para obter os conjuntos de resultados top-k da tabela.</p>
<p>O exemplo abaixo mostra como os conjuntos de resultados são fundidos e reduzidos para a pesquisa vetorial numa tabela com 4 ficheiros de índice (n=2, k=3). Note-se que cada conjunto de resultados tem 2 colunas. A coluna da esquerda representa a identificação do vetor e a coluna da direita representa a distância euclidiana.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>resultado</span> </span></p>
<p><strong>(7) Otimização futura</strong></p>
<p>Seguem-se algumas reflexões sobre possíveis optimizações da gestão de dados.</p>
<ul>
<li>E se os dados no buffer imutável ou mesmo no buffer mutável também pudessem ser consultados instantaneamente? Atualmente, os dados na memória intermutável não podem ser consultados, não até serem escritos no disco. Alguns utilizadores estão mais interessados no acesso instantâneo aos dados após a inserção.</li>
<li>Fornecer uma funcionalidade de particionamento de tabelas que permita ao utilizador dividir tabelas muito grandes em partições mais pequenas e executar uma pesquisa vetorial numa determinada partição.</li>
<li>Adicionar aos vectores alguns atributos que possam ser filtrados. Por exemplo, alguns utilizadores só querem pesquisar entre os vectores com determinados atributos. É necessário recuperar os atributos dos vectores e mesmo os vectores brutos. Uma abordagem possível é utilizar uma base de dados KV, como a RocksDB.</li>
<li>Fornecer uma funcionalidade de migração de dados que permita a migração automática de dados desactualizados para outro espaço de armazenamento. Em alguns cenários em que os dados fluem constantemente, os dados podem estar a envelhecer. Como alguns utilizadores apenas se preocupam com os dados do mês mais recente e executam pesquisas com base nos mesmos, os dados mais antigos tornam-se menos úteis e consomem muito espaço em disco. Um mecanismo de migração de dados ajuda a libertar espaço em disco para novos dados.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artigo apresenta principalmente a estratégia de gestão de dados no Milvus. Em breve, serão publicados mais artigos sobre a implementação distribuída do Milvus, a seleção de métodos de indexação vetorial e o programador de consultas. Fique atento!</p>
<h2 id="Related-blogs" class="common-anchor-header">Blogues relacionados<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestão de metadados do Milvus (1): Como visualizar os metadados</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvus Metadata Management (2): Campos da tabela de metadados</a></li>
</ul>
