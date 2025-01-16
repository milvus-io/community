---
id: 2019-12-27-meta-table.md
title: Milvus Metadata Management (2) Campos da tabela de metadados
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: Saiba mais sobre os pormenores dos campos nas tabelas de metadados do Milvus.
cover: null
tag: Engineering
---
<custom-h1>Gestão de Metadados Milvus (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">Campos na tabela de metadados<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>Autor: Yihua Mo</p>
<p>Data: 2019-12-27</p>
</blockquote>
<p>No último blogue, mencionámos como visualizar os seus metadados utilizando MySQL ou SQLite. Este artigo pretende principalmente apresentar em pormenor os campos das tabelas de metadados.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">Campos da tabela &quot;<code translate="no">Tables</code>&quot;</h3><p>Tomemos o SQLite como exemplo. O resultado seguinte vem da versão 0.5.0. Alguns campos foram adicionados à versão 0.6.0, que serão introduzidos mais tarde. Existe uma linha em <code translate="no">Tables</code> que especifica uma tabela vetorial de 512 dimensões com o nome <code translate="no">table_1</code>. Quando a tabela é criada, <code translate="no">index_file_size</code> é 1024 MB, <code translate="no">engine_type</code> é 1 (FLAT), <code translate="no">nlist</code> é 16384, <code translate="no">metric_type</code> é 1 (distância euclidiana L2). <code translate="no">id</code> é o identificador único da tabela. <code translate="no">state</code> é o estado da tabela, com 0 a indicar um estado normal. <code translate="no">created_on</code> é a hora de criação. <code translate="no">flag</code> é a bandeira reservada para uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>tabelas</span> </span></p>
<p>O quadro seguinte mostra os tipos de campos e as descrições dos campos em <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">Nome do campo</th><th style="text-align:left">Tipo de dados</th><th style="text-align:left">Descrição</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificador único da tabela de vectores. <code translate="no">id</code> aumenta automaticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nome da tabela de vectores. <code translate="no">table_id</code> tem de ser definido pelo utilizador e seguir as diretrizes de nomes de ficheiros do Linux.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">Estado da tabela de vectores. 0 significa normal e 1 significa apagado (apagamento suave).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">Dimensão do vetor da tabela de vectores. Deve ser definida pelo utilizador.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de milissegundos desde 1 de janeiro de 1970 até ao momento em que a tabela é criada.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">Sinalizador para uso interno, como, por exemplo, se o id do vetor é definido pelo utilizador. A predefinição é 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Se o tamanho de um ficheiro de dados atingir <code translate="no">index_file_size</code>, o ficheiro não é combinado e é utilizado para construir índices. A predefinição é 1024 (MB).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo de índice a construir para uma tabela de vectores. A predefinição é 0, que especifica um índice inválido. 1 especifica FLAT. 2 especifica IVFLAT. 3 especifica IVFSQ8. 4 especifica NSG. 5 especifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">Número de clusters em que os vectores em cada ficheiro de dados são divididos quando o índice está a ser construído. A predefinição é 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Método para calcular a distância do vetor. 1 especifica a distância euclidiana (L1) e 2 especifica o produto interno.</td></tr>
</tbody>
</table>
<p>O particionamento de tabelas é ativado na versão 0.6.0 com alguns campos novos, incluindo <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> e <code translate="no">version</code>. Uma tabela vetorial, <code translate="no">table_1</code>, tem uma partição chamada <code translate="no">table_1_p1</code>, que também é uma tabela vetorial. <code translate="no">partition_name</code> corresponde a <code translate="no">table_id</code>. Os campos de uma tabela de partição são herdados da tabela proprietária, com o campo <code translate="no">owner table</code> a especificar o nome da tabela proprietária e o campo <code translate="no">partition_tag</code> a especificar a etiqueta da partição.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>tabelas_novas</span> </span></p>
<p>A tabela seguinte mostra os novos campos na versão 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">Nome do campo</th><th style="text-align:left">Tipo de dados</th><th style="text-align:left">Descrição do campo</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">string</td><td style="text-align:left">Tabela pai da partição.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">string</td><td style="text-align:left">Etiqueta da partição. Não pode ser uma string vazia.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">string</td><td style="text-align:left">Versão do Milvus.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campos da tabela "<code translate="no">TableFiles&quot;</code> </h3><p>O exemplo seguinte contém dois ficheiros, ambos pertencentes à tabela de vectores <code translate="no">table_1</code>. O tipo de índice (<code translate="no">engine_type</code>) do primeiro ficheiro é 1 (FLAT); o estado do ficheiro (<code translate="no">file_type</code>) é 7 (cópia de segurança do ficheiro original); <code translate="no">file_size</code> é 411200113 bytes; o número de linhas do vetor é 200.000. O tipo de índice do segundo ficheiro é 2 (IVFLAT); o estado do ficheiro é 3 (ficheiro de índice). O segundo ficheiro é, na realidade, o índice do primeiro ficheiro. Introduziremos mais informações nos próximos artigos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>ficheiros de tabela</span> </span></p>
<p>A tabela seguinte mostra os campos e as descrições de <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">Nome do campo</th><th style="text-align:left">Tipo de dados</th><th style="text-align:left">Descrição</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">Identificador único de uma tabela de vectores. <code translate="no">id</code> aumenta automaticamente.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nome da tabela de vectores.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Tipo de índice a construir para uma tabela de vectores. A predefinição é 0, que especifica um índice inválido. 1 especifica FLAT. 2 especifica IVFLAT. 3 especifica IVFSQ8. 4 especifica NSG. 5 especifica IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">string</td><td style="text-align:left">Nome do ficheiro gerado a partir da hora de criação do ficheiro. Equivale a 1000 multiplicado pelo número de milissegundos desde 1 de janeiro de 1970 até ao momento em que a tabela é criada.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">Estado do ficheiro. 0 especifica um ficheiro de dados vectoriais em bruto recentemente gerado. 1 especifica um ficheiro de dados vectoriais em bruto. 2 especifica que será criado um índice para o ficheiro. 3 especifica que o ficheiro é um ficheiro de índice. 4 especifica que o ficheiro será apagado (apagamento suave). 5 indica que o ficheiro foi gerado de novo e é utilizado para armazenar dados combinados. 6 especifica que o ficheiro é gerado de novo e utilizado para armazenar dados de índice. 7 indica o estado da cópia de segurança do ficheiro de dados vectoriais brutos.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">Tamanho do ficheiro em bytes.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de vectores num ficheiro.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">Carimbo de data/hora para a última hora de atualização, que especifica o número de milissegundos desde 1 de janeiro de 1970 até ao momento em que a tabela é criada.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">Número de milissegundos desde 1 de janeiro de 1970 até ao momento em que a tabela é criada.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">Data em que a tabela é criada. Ainda está aqui por razões históricas e será removido em versões futuras.</td></tr>
</tbody>
</table>
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestão de dados num motor de busca vetorial de grande escala</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvus Metadata Management (1): Como visualizar metadados</a></li>
</ul>
