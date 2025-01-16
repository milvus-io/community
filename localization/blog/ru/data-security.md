---
id: data-security.md
title: Как база данных Milvus Vector обеспечивает безопасность данных?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: Узнайте об аутентификации пользователей и шифровании в пути в Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение обложки</span> </span></p>
<p>В полной мере заботясь о безопасности ваших данных, в Milvus 2.1 теперь официально доступны аутентификация пользователя и соединение с защитой транспортного уровня (TLS). Без аутентификации пользователя любой может получить доступ ко всем данным в вашей векторной базе данных с помощью SDK. Однако, начиная с Milvus 2.1, доступ к базе данных векторов Milvus могут получить только те, у кого есть действительное имя пользователя и пароль. Кроме того, в Milvus 2.1 безопасность данных дополнительно защищена с помощью TLS, который обеспечивает безопасные коммуникации в компьютерной сети.</p>
<p>Цель этой статьи - проанализировать, как векторная база данных Milvus обеспечивает безопасность данных с помощью аутентификации пользователей и TLS-соединения, и объяснить, как вы можете использовать эти две функции в качестве пользователя, который хочет обеспечить безопасность данных при использовании векторной базы данных.</p>
<p><strong>Перейти к разделу:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">Что такое безопасность базы данных и почему она важна?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Как векторная база данных Milvus обеспечивает безопасность данных?</a><ul>
<li><a href="#User-authentication">Аутентификация пользователя</a></li>
<li><a href="#TLS-connection">TLS-соединение</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">Что такое безопасность базы данных и почему она важна?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Безопасность базы данных - это меры, принимаемые для обеспечения сохранности и конфиденциальности всех данных в базе. Недавние случаи утечки данных в <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, Техасском департаменте страхования и т. д.</a> заставляют нас все более бдительно относиться к проблеме безопасности данных. Все эти случаи постоянно напоминают нам о том, что компании и предприятия могут понести серьезные потери, если их данные не будут хорошо защищены, а используемые ими базы данных не будут надежно защищены.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Как векторная база данных Milvus обеспечивает безопасность данных?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>В текущем выпуске 2.1 векторная база данных Milvus пытается обеспечить безопасность базы данных с помощью аутентификации и шифрования. Если говорить более конкретно, то на уровне доступа Milvus поддерживает базовую аутентификацию пользователей, чтобы контролировать, кто может получить доступ к базе данных. В то же время на уровне базы данных Milvus использует протокол шифрования транспортного уровня (TLS) для защиты обмена данными.</p>
<h3 id="User-authentication" class="common-anchor-header">Аутентификация пользователей</h3><p>Функция базовой аутентификации пользователей в Milvus поддерживает доступ к базе данных векторов с помощью имени пользователя и пароля для обеспечения безопасности данных. Это означает, что клиенты могут получить доступ к экземпляру Milvus только после предоставления аутентифицированного имени пользователя и пароля.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Процесс аутентификации в векторной базе данных Milvus</h4><p>Все gRPC-запросы обрабатываются прокси Milvus, поэтому аутентификация выполняется прокси. Процесс входа в систему с учетными данными для подключения к экземпляру Milvus выглядит следующим образом.</p>
<ol>
<li>Создайте учетные данные для каждого экземпляра Milvus, а зашифрованные пароли хранятся в etcd. Для шифрования Milvus использует <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a>, поскольку в нем реализован <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">адаптивный алгоритм хеширования</a> Провоса и Мазьера.</li>
<li>На стороне клиента SDK отправляет шифртекст при подключении к сервису Milvus. Шифротекст в формате base64 (<username>:<password>) прикрепляется к метаданным с ключом <code translate="no">authorization</code>.</li>
<li>Прокси-сервер Milvus перехватывает запрос и проверяет учетные данные.</li>
<li>Учетные данные кэшируются локально в прокси.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>процесс_автоматизации</span> </span></p>
<p>Когда учетные данные обновляются, системный рабочий процесс в Milvus выглядит следующим образом</p>
<ol>
<li>Root coord отвечает за учетные данные при вызове API insert, query, delete.</li>
<li>Когда вы обновляете учетные данные, например, потому что забыли пароль, новый пароль сохраняется в etcd. После этого все старые учетные данные в локальном кэше прокси становятся недействительными.</li>
<li>Перехватчик аутентификации сначала ищет записи в локальном кэше. Если учетные данные в кэше не верны, то срабатывает вызов RPC для получения наиболее обновленной записи из корневой коорд. И учетные данные в локальном кэше обновляются соответствующим образом.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>рабочий процесс_обновления_учетных_данных</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Как управлять аутентификацией пользователей в векторной базе данных Milvus</h4><p>Чтобы включить аутентификацию, необходимо сначала установить <code translate="no">common.security.authorizationEnabled</code> на <code translate="no">true</code> при настройке Milvus в файле <code translate="no">milvus.yaml</code>.</p>
<p>После включения аутентификации для экземпляра Milvus будет создан пользователь root. Этот пользователь root может использовать начальный пароль <code translate="no">Milvus</code> для подключения к базе данных векторов Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Мы настоятельно рекомендуем изменить пароль root-пользователя при первом запуске Milvus.</p>
<p>Затем пользователь root может создавать новых пользователей для аутентифицированного доступа, выполнив следующую команду для создания новых пользователей.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>При создании новых пользователей следует помнить две вещи:</p>
<ol>
<li><p>Что касается имени пользователя, то оно не должно превышать 32 символов и должно начинаться с буквы. В имени пользователя допускаются только символы подчеркивания, буквы или цифры. Например, имя пользователя "2abc!" не принимается.</p></li>
<li><p>Что касается пароля, то его длина должна составлять 6-256 символов.</p></li>
</ol>
<p>После того как новые учетные данные настроены, новый пользователь может подключиться к экземпляру Milvus с помощью имени пользователя и пароля.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Как и во всех процессах аутентификации, не стоит беспокоиться, если вы забудете пароль. Пароль для существующего пользователя можно сбросить с помощью следующей команды.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Подробнее об аутентификации пользователей читайте в <a href="https://milvus.io/docs/v2.1.x/authenticate.md">документации Milvus</a>.</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS-соединение</h3><p>Безопасность транспортного уровня (TLS) - это тип протокола аутентификации для обеспечения безопасности связи в компьютерной сети. TLS использует сертификаты для предоставления услуг аутентификации между двумя или более взаимодействующими сторонами.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Как включить TLS в базе данных векторов Milvus</h4><p>Чтобы включить TLS в Milvus, вам нужно сначала выполнить следующую команду, чтобы подготовить два файла для генерации сертификата: файл конфигурации OpenSSL по умолчанию с именем <code translate="no">openssl.cnf</code> и файл с именем <code translate="no">gen.sh</code>, используемый для генерации соответствующих сертификатов.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Затем вы можете просто скопировать и вставить конфигурацию, которую мы приводим <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">здесь,</a> в эти два файла. Вы также можете внести изменения в нашу конфигурацию, чтобы она лучше подходила для вашего приложения.</p>
<p>Когда два файла будут готовы, вы можете запустить файл <code translate="no">gen.sh</code> для создания девяти файлов сертификатов. Аналогичным образом вы можете изменить конфигурацию девяти файлов сертификатов в соответствии с вашими потребностями.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Перед тем как подключиться к службе Milvus с помощью TLS, необходимо сделать еще один шаг. Вы должны установить <code translate="no">tlsEnabled</code> на <code translate="no">true</code> и настроить пути к файлам <code translate="no">server.pem</code>, <code translate="no">server.key</code> и <code translate="no">ca.pem</code> для сервера в <code translate="no">config/milvus.yaml</code>. В качестве примера ниже приведен код.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>После этого все готово, и вы можете подключаться к сервису Milvus с помощью TLS, если при использовании Milvus connection SDK вы укажете пути к файлам <code translate="no">client.pem</code>, <code translate="no">client.key</code> и <code translate="no">ca.pem</code> для клиента. Приведенный ниже код также является примером.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Читайте подробнее в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Понимание уровня согласованности в векторной базе данных Milvus (часть II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
