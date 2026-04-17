---
id: 2019-12-18-datafile-cleanup.md
title: Estratégia de eliminação anterior e problemas relacionados
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Melhorámos a estratégia de eliminação de ficheiros para corrigir os problemas
  relacionados com a operação de consulta.
cover: null
tag: Engineering
---
<custom-h1>Melhorias no mecanismo de limpeza de ficheiros de dados</custom-h1><blockquote>
<p>autor: Yihua Mo</p>
<p>Data: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Estratégia de eliminação anterior e problemas relacionados<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Em <a href="/blog/pt/2019-11-08-data-management.md">Managing Data in Massive-Scale Vetor Search Engine</a>, mencionámos o mecanismo de eliminação de ficheiros de dados. A eliminação inclui a eliminação suave e a eliminação rígida. Depois de efetuar uma operação de eliminação numa tabela, a tabela é marcada com uma eliminação suave. As operações de pesquisa ou atualização subsequentes deixam de ser permitidas. No entanto, a operação de consulta que se inicia antes da eliminação pode continuar a ser executada. A tabela é realmente eliminada juntamente com os metadados e outros ficheiros apenas quando a operação de consulta estiver concluída.</p>
<p>Então, quando é que os ficheiros marcados com soft-delete são realmente eliminados? Antes da versão 0.6.0, a estratégia é que um ficheiro é realmente eliminado após uma eliminação suave durante 5 minutos. A figura seguinte mostra a estratégia:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5mins</span> </span></p>
<p>Esta estratégia baseia-se na premissa de que as consultas normalmente não duram mais de 5 minutos e não é fiável. Se uma consulta durar mais de 5 minutos, a consulta falhará. A razão é que, quando uma consulta é iniciada, o Milvus recolhe informações sobre os ficheiros que podem ser pesquisados e cria tarefas de consulta. Depois, o programador de consultas carrega os ficheiros para a memória um a um e procura os ficheiros um a um. Se um ficheiro já não existir ao carregar um ficheiro, a consulta falhará.</p>
<p>Aumentar o tempo pode ajudar a reduzir o risco de falhas nas consultas, mas também causa outro problema: a utilização do disco é demasiado grande. A razão é que, quando são inseridas grandes quantidades de vectores, o Milvus combina continuamente os ficheiros de dados e os ficheiros combinados não são imediatamente removidos do disco, mesmo que não ocorra nenhuma consulta. Se a inserção de dados for demasiado rápida e/ou a quantidade de dados inseridos for demasiado grande, a utilização extra do disco pode ascender a dezenas de GBs. Consulte a figura seguinte como exemplo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>resultado</span> </span></p>
<p>Como mostrado na figura anterior, o primeiro lote de dados inseridos (insert_1) é descarregado para o disco e torna-se ficheiro_1, depois insert_2 torna-se ficheiro_2. O thread responsável pela combinação de ficheiros combina os ficheiros no ficheiro_3. Em seguida, o ficheiro_1 e o ficheiro_2 são marcados como soft-delete. O terceiro lote de dados de inserção torna-se o ficheiro_4. A thread combina o ficheiro_3 e o ficheiro_4 com o ficheiro_5 e marca o ficheiro_3 e o ficheiro_4 como soft-delete.</p>
<p>Da mesma forma, insert_6 e insert_5 são combinados. Em t3, o ficheiro_5 e o ficheiro_6 são marcados como soft-delete. Entre t3 e t4, embora muitos ficheiros estejam marcados como soft-delete, eles ainda estão no disco. Os ficheiros são realmente eliminados após t4. Assim, entre t3 e t4, o uso do disco é 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. Os dados inseridos são 64 + 64 + 64 + 64 + 64 = 256 MB. A utilização do disco é 3 vezes superior ao tamanho dos dados inseridos. Quanto mais rápida for a velocidade de escrita do disco, maior será a utilização do disco durante um período de tempo específico.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Melhorias da estratégia de eliminação na versão 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Assim, alterámos a estratégia de eliminação de ficheiros na v0.6.0. O hard-delete já não usa o tempo como gatilho. Em vez disso, o gatilho é quando o ficheiro não está a ser utilizado por nenhuma tarefa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>novaestratégia</span> </span></p>
<p>Suponha que são inseridos dois lotes de vectores. Em t1 é dado um pedido de consulta, Milvus adquire dois ficheiros a serem consultados (ficheiro_1 e ficheiro_2, porque o ficheiro_3 ainda não existe.) Depois, a thread de backend começa a combinar os dois ficheiros com a consulta a correr ao mesmo tempo. Quando o ficheiro_3 é gerado, o ficheiro_1 e o ficheiro_2 são marcados como soft-delete. Após a consulta, nenhuma outra tarefa usará o arquivo_1 e o arquivo_2, então eles serão apagados em t4. O intervalo entre t2 e t4 é muito pequeno e depende do intervalo da consulta. Desta forma, os ficheiros não utilizados serão removidos a tempo.</p>
<p>Quanto à implementação interna, a contagem de referências, que é familiar aos engenheiros de software, é utilizada para determinar se um ficheiro pode ser apagado. Para explicar usando uma comparação, quando um jogador tem vidas num jogo, ele ainda pode jogar. Quando o número de vidas chega a 0, o jogo termina. O Milvus monitoriza o estado de cada ficheiro. Quando um ficheiro é utilizado por uma tarefa, é-lhe adicionada uma vida. Quando o ficheiro deixa de ser utilizado, é-lhe retirada uma vida. Quando um ficheiro é marcado com soft-delete e o número de vidas é 0, o ficheiro está pronto para hard-delete.</p>
<h2 id="Related-blogs" class="common-anchor-header">Blogs relacionados<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="/blog/pt/2019-11-08-data-management.md">Gestão de dados num motor de busca vetorial de grande escala</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Milvus Metadata Management (1): Como visualizar metadados</a></li>
<li><a href="/blog/pt/2019-12-27-meta-table.md">Milvus Metadata Management (2): Campos na tabela de metadados</a></li>
</ul>
