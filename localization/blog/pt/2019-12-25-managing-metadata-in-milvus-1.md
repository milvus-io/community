---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: Saiba como visualizar metadados na base de dados vetorial Milvus.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>Gestão de metadados do Milvus (1)</custom-h1><p>Introduzimos algumas informações sobre metadados em <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gerir dados num motor de busca vetorial de grande escala</a>. Este artigo mostra principalmente como visualizar os metadados do Milvus.</p>
<p>O Milvus suporta o armazenamento de metadados em SQLite ou MySQL. Existe um parâmetro <code translate="no">backend_url</code> (no ficheiro de configuração <code translate="no">server_config.yaml</code>) através do qual pode especificar se pretende utilizar SQLite ou MySQL para gerir os seus metadados.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>Se for utilizado o SQLite, será gerado um ficheiro <code translate="no">meta.sqlite</code> no diretório de dados (definido no parâmetro <code translate="no">primary_path</code> do ficheiro de configuração <code translate="no">server_config.yaml</code>) após o arranque do Milvus. Para visualizar o ficheiro, basta instalar um cliente SQLite.</p>
<p>Instalar o SQLite3 a partir da linha de comandos:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>Em seguida, entre no diretório de dados do Milvus e abra o meta ficheiro utilizando o SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>Agora, já entrou na linha de comandos do cliente SQLite. Basta usar alguns comandos para ver o que está nos metadados.</p>
<p>Para tornar os resultados impressos mais fáceis de serem lidos por humanos:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>Para consultar Tables e TableFiles usando instruções SQL (sem distinção de maiúsculas e minúsculas):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-use-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>Se estiver a utilizar o MySQL, é necessário especificar o endereço do serviço MySQL em <code translate="no">backend_url</code> do ficheiro de configuração <code translate="no">server_config.yaml</code>.</p>
<p>Por exemplo, as definições seguintes indicam que o serviço MySQL é implementado localmente, com a porta '3306', o nome de utilizador 'root', a palavra-passe '123456' e o nome da base de dados 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>Em primeiro lugar, instalar o cliente MySQL:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>Depois de o Milvus ser iniciado, serão criadas duas tabelas (Tables e TableFiles) no serviço MySQL especificado por <code translate="no">backend_url</code>.</p>
<p>Use o seguinte comando para se conectar ao serviço MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>Agora, pode utilizar instruções SQL para consultar informações de metadados:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-my-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">O que vem a seguir<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Os próximos artigos apresentarão em pormenor o esquema das tabelas de metadados. Fique atento!</p>
<p>Qualquer dúvida, entre no nosso <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal do Slack</a> ou registre um problema no repositório.</p>
<p>GitHub repo: https://github.com/milvus-io/milvus</p>
<p>Se gostou deste artigo ou o achou útil, não se esqueça de bater palmas!</p>
