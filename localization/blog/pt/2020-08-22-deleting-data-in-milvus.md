---
id: deleting-data-in-milvus.md
title: Conclusão
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  Na versão 0.7.0 do Milvus, criámos um novo design para tornar a eliminação
  mais eficiente e suportar mais tipos de índices.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Como o Milvus implementa a função Eliminar</custom-h1><p>Este artigo trata da forma como o Milvus implementa a função de apagar. Sendo uma funcionalidade muito aguardada por muitos utilizadores, a função delete foi introduzida no Milvus v0.7.0. Não chamámos diretamente remove_ids no FAISS, em vez disso, criámos um novo design para tornar a eliminação mais eficiente e suportar mais tipos de índices.</p>
<p>Em <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">How Milvus Realizes Dynamic Data Update and Query</a>, apresentámos todo o processo, desde a inserção de dados até à descarga de dados. Vamos recapitular alguns dos princípios básicos. MemManager gerencia todos os buffers de inserção, com cada MemTable correspondendo a uma coleção (nós renomeamos "tabela" para "coleção" no Milvus v0.7.0). O Milvus divide automaticamente os dados inseridos na memória em múltiplos MemTableFiles. Quando os dados são enviados para o disco, cada MemTableFile é serializado em um arquivo bruto. Mantivemos esta arquitetura ao conceber a função de eliminação.</p>
<p>Definimos a função do método delete como sendo a eliminação de todos os dados correspondentes aos IDs de entidade especificados numa coleção específica. Ao desenvolver esta função, concebemos dois cenários. O primeiro é eliminar os dados que ainda estão no buffer de inserção e o segundo é eliminar os dados que foram descarregados para o disco. O primeiro cenário é mais intuitivo. Podemos encontrar o MemTableFile correspondente ao ID especificado e apagar os dados na memória diretamente (Figura 1). Uma vez que a eliminação e a inserção de dados não podem ser efectuadas ao mesmo tempo, e devido ao mecanismo que altera a MemTableFile de mutável para imutável ao descarregar os dados, a eliminação só é efectuada no buffer mutável. Desta forma, a operação de eliminação não entra em conflito com a descarga de dados, garantindo assim a consistência dos dados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>O segundo cenário é mais complexo, mas mais comum, pois na maioria dos casos os dados permanecem no buffer de inserção por pouco tempo antes de serem descarregados no disco. Dado que é tão ineficiente carregar os dados descarregados para a memória para uma eliminação rígida, decidimos optar por uma eliminação suave, uma abordagem mais eficiente. Em vez de apagar efetivamente os dados descarregados, a eliminação suave guarda os IDs apagados num ficheiro separado. Desta forma, podemos filtrar esses IDs eliminados durante as operações de leitura, como a pesquisa.</p>
<p>Quando se trata de implementação, temos várias questões a considerar. No Milvus, os dados são visíveis ou, por outras palavras, recuperáveis, apenas quando são descarregados para o disco. Por isso, os dados descarregados não são apagados durante a chamada do método delete, mas na próxima operação de descarga. A razão é que os ficheiros de dados que foram descarregados para o disco já não incluem novos dados, pelo que a eliminação suave não afecta os dados que foram descarregados. Ao chamar a eliminação, é possível eliminar diretamente os dados que ainda se encontram na memória intermédia de inserção, enquanto que para os dados descarregados é necessário registar o ID dos dados eliminados na memória. Ao enviar os dados para o disco, o Milvus escreve o ID eliminado no ficheiro DEL para registar qual a entidade do segmento correspondente que foi eliminada. Estas actualizações só serão visíveis após a conclusão da descarga de dados. Este processo é ilustrado na Figura 2. Antes da versão 0.7.0, tínhamos apenas um mecanismo de auto-flush; isto é, Milvus serializa os dados no buffer de inserção a cada segundo. Na nossa nova conceção, adicionámos um método de descarga que permite aos programadores chamar após o método de eliminação, assegurando que os dados recentemente inseridos são visíveis e que os dados eliminados já não são recuperáveis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>A segunda questão é que o ficheiro de dados brutos e o ficheiro de índice são dois ficheiros separados no Milvus e dois registos independentes nos metadados. Ao apagar um ID específico, temos de encontrar o ficheiro de dados em bruto e o ficheiro de índice correspondentes ao ID e registá-los em conjunto. Assim, introduzimos o conceito de segmento. Um segmento contém o ficheiro raw (que inclui os ficheiros vectoriais raw e os ficheiros ID), o ficheiro de índice e o ficheiro DEL. O segmento é a unidade mais básica para ler, escrever e pesquisar vectores no Milvus. Uma coleção (Figura 3) é composta por vários segmentos. Assim, existem várias pastas de segmentos sob uma pasta de coleção no disco. Uma vez que os nossos metadados se baseiam em bases de dados relacionais (SQLite ou MySQL), é muito simples registar a relação dentro de um segmento, e a operação de eliminação já não requer o processamento separado do ficheiro em bruto e do ficheiro de índice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>A terceira questão é como filtrar os dados eliminados durante uma pesquisa. Na prática, o ID registado por DEL é o offset dos dados correspondentes armazenados no segmento. Uma vez que o segmento descarregado não inclui novos dados, o offset não mudará. A estrutura de dados do DEL é um mapa de bits na memória, em que um bit ativo representa um offset apagado. Também actualizámos o FAISS em conformidade: quando se pesquisa no FAISS, o vetor correspondente ao bit ativo deixa de ser incluído no cálculo da distância (Figura 4). As alterações ao FAISS não serão abordadas em pormenor aqui.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>A última questão prende-se com a melhoria do desempenho. Ao eliminar dados descarregados, é necessário primeiro descobrir em que segmento da coleção se encontra o ID eliminado e depois registar o seu offset. A abordagem mais direta é procurar todos os IDs em cada segmento. A otimização em que estamos a pensar é adicionar um filtro bloom a cada segmento. O filtro Bloom é uma estrutura de dados aleatória usada para verificar se um elemento é membro de um conjunto. Portanto, podemos carregar apenas o filtro bloom de cada segmento. Só quando o filtro bloom determina que o ID eliminado está no segmento atual é que podemos encontrar o deslocamento correspondente no segmento; caso contrário, podemos ignorar esse segmento (Figura 5). Escolhemos o filtro bloom porque utiliza menos espaço e é mais eficiente na pesquisa do que muitos dos seus pares, como as tabelas de hash. Embora o filtro bloom tenha uma certa taxa de falsos positivos, podemos reduzir os segmentos que precisam de ser pesquisados para o número ideal para ajustar a probabilidade. Entretanto, o filtro bloom também precisa de suportar a eliminação. Caso contrário, o ID da entidade eliminada ainda pode ser encontrado no filtro bloom, resultando num aumento da taxa de falsos positivos. Por este motivo, utilizamos o filtro bloom de contagem, uma vez que suporta a eliminação. Neste artigo, não entraremos em pormenores sobre o funcionamento do filtro bloom. Se estiver interessado, pode consultar a Wikipedia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-request-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Conclusão<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Até agora, demos-lhe uma breve introdução sobre como o Milvus elimina vectores por ID. Como sabe, usamos a eliminação suave para eliminar os dados descarregados. À medida que os dados apagados aumentam, precisamos de compactar os segmentos na coleção para libertar o espaço ocupado pelos dados apagados. Além disso, se um segmento já tiver sido indexado, compactar também exclui o arquivo de índice anterior e cria novos índices. Por enquanto, os desenvolvedores precisam chamar o método compact para compactar os dados. No futuro, esperamos introduzir um mecanismo de inspeção. Por exemplo, quando a quantidade de dados eliminados atingir um determinado limite ou a distribuição dos dados tiver mudado após uma eliminação, o Milvus compacta automaticamente o segmento.</p>
<p>Agora introduzimos a filosofia de design por trás da função delete e sua implementação. Há definitivamente espaço para melhorias, e todos os seus comentários ou sugestões são bem-vindos.</p>
<p>Conheça mais sobre o Milvus: https://github.com/milvus-io/milvus. Pode também juntar-se à nossa comunidade <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> para discussões técnicas!</p>
