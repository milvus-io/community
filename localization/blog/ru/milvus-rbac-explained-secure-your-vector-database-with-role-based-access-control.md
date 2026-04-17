---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Milvus RBAC Explained: Защита базы данных Vector с помощью управления доступом
  на основе ролей
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  Узнайте, почему RBAC имеет значение, как работает RBAC в Milvus, как настроить
  контроль доступа и как он обеспечивает доступ с наименьшими привилегиями,
  четкое разделение ролей и безопасную работу на производстве.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>При создании системы баз данных инженеры тратят большую часть своего времени на производительность: типы индексов, отзыв, задержка, пропускная способность и масштабирование. Но как только система выходит за пределы ноутбука одного разработчика, не менее важным становится другой вопрос: <strong>кто и что может делать в вашем кластере Milvus</strong>? Другими словами - контроль доступа.</p>
<p>Во всей отрасли многие инциденты, связанные с эксплуатацией, происходят из-за простых ошибок в разрешении. Скрипт запускается в неправильном окружении. Учетная запись службы имеет более широкий доступ, чем предполагалось. Общие учетные данные администратора попадают в CI. Обычно эти проблемы возникают в виде вполне практических вопросов:</p>
<ul>
<li><p>Разрешено ли разработчикам удалять производственные коллекции?</p></li>
<li><p>Почему тестовая учетная запись может читать данные производственного вектора?</p></li>
<li><p>Почему несколько служб входят в систему с одной и той же ролью администратора?</p></li>
<li><p>Могут ли задания аналитики иметь доступ только для чтения с нулевыми правами на запись?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> решает эти проблемы с помощью <a href="https://milvus.io/docs/rbac.md">управления доступом на основе ролей (RBAC)</a>. Вместо того чтобы наделять каждого пользователя правами суперадмина или пытаться внедрить ограничения в код приложения, RBAC позволяет определить точные разрешения на уровне базы данных. Каждый пользователь или служба получает именно те возможности, которые ему нужны, и ничего больше.</p>
<p>В этом посте рассказывается о том, как работает RBAC в Milvus, как его настроить и как безопасно применять в производственных средах.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Почему контроль доступа имеет значение при использовании Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда команды небольшие, а их приложения искусственного интеллекта обслуживают лишь ограниченное число пользователей, инфраструктура обычно проста. Системой управляют несколько инженеров, Milvus используется только для разработки или тестирования, а рабочие процессы просты. На этом раннем этапе контроль доступа редко кажется срочным, потому что поверхность риска невелика, а любые ошибки можно легко исправить.</p>
<p>По мере того как Milvus переходит на производственный уровень и растет число пользователей, сервисов и операторов, модель использования быстро меняется. К распространенным сценариям относятся:</p>
<ul>
<li><p>Несколько бизнес-систем, совместно использующих один экземпляр Milvus</p></li>
<li><p>Доступ нескольких команд к одним и тем же коллекциям векторов</p></li>
<li><p>Тестовые, этапные и производственные данные, сосуществующие в одном кластере</p></li>
<li><p>Различные роли, нуждающиеся в различных уровнях доступа, от запросов только на чтение до записи и оперативного управления.</p></li>
</ul>
<p>Без четко определенных границ доступа такие системы создают предсказуемые риски:</p>
<ul>
<li><p>Тестовые рабочие процессы могут случайно удалить производственные коллекции</p></li>
<li><p>Разработчики могут непреднамеренно изменить индексы, используемые живыми сервисами.</p></li>
<li><p>Широко распространенное использование учетной записи <code translate="no">root</code> делает невозможным отслеживание или аудит действий.</p></li>
<li><p>Скомпрометированное приложение может получить неограниченный доступ ко всем векторным данным.</p></li>
</ul>
<p>По мере роста использования, полагаться на неформальные соглашения или общие учетные записи администраторов становится все труднее. Становится необходимой последовательная, принудительная модель доступа - и именно это обеспечивает Milvus RBAC.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Что такое RBAC в Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> - это модель разрешений, которая контролирует доступ на основе <strong>ролей</strong>, а не отдельных пользователей. В Milvus RBAC позволяет точно определить, какие операции разрешено выполнять пользователю или службе - и на каких конкретных ресурсах. Она обеспечивает структурированный, масштабируемый способ управления безопасностью по мере роста вашей системы от одного разработчика до полноценной производственной среды.</p>
<p>Milvus RBAC построен на основе следующих основных компонентов:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Пользователи Роли Привилегии</span> </span></p>
<ul>
<li><p><strong>Ресурс</strong>: Объект, к которому осуществляется доступ. В Milvus ресурсы включают <strong>экземпляр</strong>, <strong>базу данных</strong> и <strong>коллекцию</strong>.</p></li>
<li><p><strong>Привилегия</strong>: Определенная разрешенная операция над ресурсом - например, создание коллекции, вставка данных или удаление сущностей.</p></li>
<li><p><strong>Группа привилегий</strong>: Предопределенный набор связанных привилегий, например "только чтение" или "запись".</p></li>
<li><p><strong>Роль</strong>: Сочетание привилегий и ресурсов, к которым они применяются. Роль определяет <em>, какие</em> операции можно выполнять и <em>где</em>.</p></li>
<li><p><strong>Пользователь</strong>: личность в Milvus. Каждый пользователь имеет уникальный идентификатор и назначает одну или несколько ролей.</p></li>
</ul>
<p>Эти компоненты образуют четкую иерархию:</p>
<ol>
<li><p><strong>Пользователям назначаются роли.</strong></p></li>
<li><p><strong>Роли определяют привилегии</strong></p></li>
<li><p><strong>Привилегии применяются к определенным ресурсам.</strong></p></li>
</ol>
<p>Ключевой принцип разработки Milvus заключается в том, что <strong>разрешения никогда не назначаются непосредственно пользователям</strong>. Весь доступ осуществляется через роли. Такая непрямая связь упрощает администрирование, уменьшает количество ошибок конфигурации и делает изменения прав предсказуемыми.</p>
<p>Эта модель хорошо масштабируется в реальных развертываниях. Когда несколько пользователей используют одну роль, обновление привилегий роли мгновенно обновляет разрешения для всех них, не изменяя их для каждого пользователя в отдельности. Это единая точка контроля, соответствующая тому, как современная инфраструктура управляет доступом.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Как работает RBAC в Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда клиент отправляет запрос в Milvus, система оценивает его, проходя ряд этапов авторизации. Каждый шаг должен быть пройден, прежде чем операция будет разрешена:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Как работает RBAC в Milvus</span> </span></p>
<ol>
<li><p><strong>Проверка подлинности запроса:</strong> Сначала Milvus проверяет личность пользователя. Если аутентификация не проходит, запрос отклоняется с ошибкой аутентификации.</p></li>
<li><p><strong>Проверка назначения роли:</strong> После аутентификации Milvus проверяет, назначена ли пользователю хотя бы одна роль. Если роль не найдена, запрос отклоняется с ошибкой "Разрешение запрещено".</p></li>
<li><p><strong>Проверка необходимых привилегий:</strong> Затем Milvus проверяет, предоставляет ли роль пользователя требуемые привилегии на целевом ресурсе. Если проверка привилегий не удается, запрос отклоняется с ошибкой "Разрешение отклонено".</p></li>
<li><p><strong>Выполнить операцию:</strong> Если все проверки пройдены, Milvus выполняет запрошенную операцию и возвращает результат.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Как настроить контроль доступа с помощью RBAC в Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Предварительные условия</h3><p>Прежде чем правила RBAC будут оценены и применены, необходимо включить аутентификацию пользователей, чтобы каждый запрос к Milvus мог быть связан с конкретной личностью пользователя.</p>
<p>Вот два стандартных метода развертывания.</p>
<ul>
<li><strong>Развертывание с помощью Docker Compose</strong></li>
</ul>
<p>Если Milvus развертывается с помощью Docker Compose, отредактируйте конфигурационный файл <code translate="no">milvus.yaml</code> и включите авторизацию, установив <code translate="no">common.security.authorizationEnabled</code> на <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Развертывание с помощью Helm Charts</strong></li>
</ul>
<p>Если Milvus развертывается с помощью Helm Charts, отредактируйте файл <code translate="no">values.yaml</code> и добавьте следующую конфигурацию под <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Инициализация</h3><p>По умолчанию Milvus создает встроенного пользователя <code translate="no">root</code> при запуске системы. Пароль по умолчанию для этого пользователя - <code translate="no">Milvus</code>.</p>
<p>В качестве начального шага безопасности используйте пользователя <code translate="no">root</code> для подключения к Milvus и немедленно измените пароль по умолчанию. Настоятельно рекомендуется использовать сложный пароль для предотвращения несанкционированного доступа.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. Основные операции</h3><p><strong>Создание пользователей</strong></p>
<p>Для ежедневного использования рекомендуется создавать специальных пользователей, а не использовать учетную запись <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Создание ролей</strong></p>
<p>Milvus предоставляет встроенную роль <code translate="no">admin</code> с полными административными привилегиями. Однако для большинства производственных сценариев рекомендуется создавать собственные роли для более тонкого контроля доступа.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Создание групп привилегий</strong></p>
<p>Группа привилегий - это набор из нескольких привилегий. Чтобы упростить управление разрешениями, связанные привилегии можно сгруппировать и предоставлять вместе.</p>
<p>Milvus включает следующие встроенные группы привилегий:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>Использование этих встроенных групп привилегий позволяет значительно снизить сложность разработки разрешений и улучшить согласованность ролей.</p>
<p>Вы можете либо использовать встроенные группы привилегий напрямую, либо создавать собственные группы привилегий по мере необходимости.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Предоставление привилегий или групп привилегий ролям</strong></p>
<p>После создания роли ей могут быть предоставлены привилегии или группы привилегий. Целевые ресурсы для этих привилегий могут быть указаны на разных уровнях, включая экземпляр, базу данных или отдельные коллекции.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Предоставление ролей пользователям</strong></p>
<p>После того как роли назначены пользователю, он может получать доступ к ресурсам и выполнять операции, определенные этими ролями. Одному пользователю может быть предоставлена одна или несколько ролей, в зависимости от требуемого объема доступа.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Проверка и отмена доступа</h3><p><strong>Проверка ролей, назначенных пользователю</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Проверка привилегий, назначенных роли</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Отмена привилегий у роли</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Отмена ролей у пользователя</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Удаление пользователей и ролей</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Пример: Проектирование контроля доступа для системы RAG на базе Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Рассмотрим систему Retrieval-Augmented Generation (RAG), построенную на базе Milvus.</p>
<p>В этой системе различные компоненты и пользователи имеют четко разграниченные обязанности, и для каждого из них требуется свой уровень доступа.</p>
<table>
<thead>
<tr><th>Актор</th><th>Ответственность</th><th>Требуемый доступ</th></tr>
</thead>
<tbody>
<tr><td>Администратор платформы</td><td>Системные операции и конфигурация</td><td>Администрирование на уровне экземпляра</td></tr>
<tr><td>Служба сбора векторных данных</td><td>Получение и обновление векторных данных</td><td>Доступ для чтения и записи</td></tr>
<tr><td>Служба поиска</td><td>Поиск и извлечение векторных данных</td><td>Доступ только для чтения</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Быстрые советы: Как безопасно управлять контролем доступа в производстве<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы контроль доступа оставался эффективным и управляемым в длительных производственных системах, следуйте этим практическим рекомендациям.</p>
<p><strong>1. Измените</strong> <strong>пароль</strong><strong>по умолчанию</strong> <code translate="no">root</code> <strong>и ограничьте использование</strong> <strong>учетной записи</strong> <code translate="no">root</code>.</p>
<p>Обновите пароль по умолчанию <code translate="no">root</code> сразу после инициализации и ограничьте его использование только административными задачами. Избегайте использования или совместного использования учетной записи root для рутинных операций. Вместо этого создайте специальных пользователей и роли для повседневного доступа, чтобы снизить риск и улучшить подотчетность.</p>
<p><strong>2. Физически изолируйте экземпляры Milvus в разных средах</strong></p>
<p>Разверните отдельные экземпляры Milvus для разработки, постановки и производства. Физическая изоляция обеспечивает более надежную границу безопасности, чем логический контроль доступа, и значительно снижает риск ошибок в разных средах.</p>
<p><strong>3. Следуйте принципу наименьших привилегий</strong></p>
<p>Предоставляйте только те разрешения, которые необходимы для каждой роли:</p>
<ul>
<li><p><strong>Среды разработки:</strong> разрешения могут быть более свободными для поддержки итераций и тестирования.</p></li>
<li><p><strong>Производственные среды:</strong> разрешения должны быть строго ограничены тем, что необходимо.</p></li>
<li><p><strong>Регулярный аудит:</strong> периодически проверяйте существующие разрешения, чтобы убедиться, что они по-прежнему необходимы.</p></li>
</ul>
<p><strong>4. Активно отменяйте разрешения, когда они больше не нужны</strong></p>
<p>Контроль доступа - это не одноразовая настройка, он требует постоянного обслуживания. Оперативно отменяйте роли и привилегии, когда меняются пользователи, службы или обязанности. Это предотвратит накопление неиспользуемых разрешений со временем и превращение их в скрытые риски безопасности.</p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Настройка управления доступом в Milvus не является сложной по своей сути, но она необходима для безопасной и надежной работы системы в производстве. С помощью хорошо продуманной модели RBAC вы сможете:</p>
<ul>
<li><p><strong>Снизить риск</strong>, предотвратив случайные или разрушительные операции</p></li>
<li><p><strong>Повысить уровень безопасности</strong>, обеспечив доступ к векторным данным с наименьшими привилегиями</p></li>
<li><p><strong>Стандартизировать операции</strong> за счет четкого разделения обязанностей</p></li>
<li><p><strong>Уверенно масштабировать</strong> систему, закладывая основу для многопользовательских и масштабных развертываний.</p></li>
</ul>
<p>Контроль доступа - это не дополнительная функция или одноразовая задача. Это основополагающая часть безопасной эксплуатации Milvus в долгосрочной перспективе.</p>
<p>👉 Начните создавать надежную основу безопасности с помощью <a href="https://milvus.io/docs/rbac.md">RBAC</a> для своего развертывания Milvus.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции последней версии Milvus? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутную индивидуальную сессию, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
