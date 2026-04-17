---
id: 2019-12-24-view-metadata.md
title: Milvus Metadata Management (1) Como visualizar metadados
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  O Milvus suporta o armazenamento de metadados em SQLite ou MySQL. Este post
  apresenta como visualizar metadados com SQLite e MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>Gestão de Metadados Milvus (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">Como visualizar metadados<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>Data: 2019-12-24</p>
</blockquote>
<p>Introduzimos algumas informações sobre metadados em <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Managing Data in Massive-Scale Vetor Search Engine</a>. Este artigo mostra principalmente como visualizar os metadados do Milvus.</p>
<p>O Milvus suporta o armazenamento de metadados em SQLite ou MySQL. Existe um parâmetro <code translate="no">backend_url</code> (no ficheiro de configuração <code translate="no">server_config.yaml</code>) através do qual pode especificar se pretende utilizar SQLite ou MySQL para gerir os seus metadados.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>Se for utilizado o SQLite, será gerado um ficheiro <code translate="no">meta.sqlite</code> no diretório de dados (definido no parâmetro <code translate="no">primary_path</code> do ficheiro de configuração <code translate="no">server_config.yaml</code>) após o arranque do Milvus. Para visualizar o ficheiro, basta instalar um cliente SQLite.</p>
<p>Instalar o SQLite3 a partir da linha de comandos:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, entre no diretório de dados do Milvus e abra o meta ficheiro utilizando o SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>Agora, já entrou na linha de comandos do cliente SQLite. Basta usar alguns comandos para ver o que está nos metadados.</p>
<p>Para tornar os resultados impressos mais fáceis de serem lidos por humanos:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para consultar Tables e TableFiles usando instruções SQL (sem distinção de maiúsculas e minúsculas):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>Se estiver a utilizar o MySQL, é necessário especificar o endereço do serviço MySQL em <code translate="no">backend_url</code> do ficheiro de configuração <code translate="no">server_config.yaml</code>.</p>
<p>Por exemplo, as definições seguintes indicam que o serviço MySQL é implementado localmente, com a porta "3306", o nome de utilizador "root", a palavra-passe "123456" e o nome da base de dados "milvus":</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Em primeiro lugar, instalar o cliente MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>Após o arranque do Milvus, serão criadas duas tabelas (Tables e TableFiles) no serviço MySQL especificado por <code translate="no">backend_url</code>.</p>
<p>Utilize o seguinte comando para se ligar ao serviço MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>Agora, pode utilizar instruções SQL para consultar informações de metadados:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">DESCRIÇÃO DO FICHEIRO<button data-href="#相关博客" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">Gestão de dados em motores de busca vectoriais de grande escala</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestão de Metadados Milvus (2): Campos na Tabela de Metadados</a></li>
</ul>
