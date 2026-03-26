---
id: milvus-access-control-rbac-guide.md
title: 'Руководство по управлению доступом Milvus: Как настроить RBAC для производства'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Пошаговое руководство по настройке Milvus RBAC в производстве - пользователи,
  роли, группы привилегий, доступ на уровне коллекций и пример полной системы
  RAG.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Вот история, которая встречается чаще, чем следовало бы: инженер QA запускает сценарий очистки в среде, которая, по его мнению, является средой постановки. Но строка подключения указывает на production. Через несколько секунд основные коллекции векторов исчезли - данные о функциях потеряны, <a href="https://zilliz.com/glossary/similarity-search">поиск по сходству</a> возвращает пустые результаты, сервисы деградируют по всем направлениям. Вскрытие обнаруживает ту же самую первопричину, что и всегда: все подключались как <code translate="no">root</code>, не было никаких границ доступа, и ничто не мешало тестовому аккаунту сбросить производственные данные.</p>
<p>Это не единичный случай. Команды, создающие <a href="https://milvus.io/">Milvus</a> - и <a href="https://zilliz.com/learn/what-is-a-vector-database">векторные базы данных</a> в целом, - как правило, сосредоточены на <a href="https://zilliz.com/learn/vector-index">производительности индексов</a>, пропускной способности и масштабировании данных, а контроль доступа рассматривают как нечто, с чем придется разбираться позже. Но это "потом" обычно приходит в виде инцидента. По мере того как Milvus переходит от прототипа к основе производственных <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">конвейеров RAG</a>, рекомендательных систем и <a href="https://zilliz.com/learn/what-is-vector-search">векторного поиска</a> в реальном времени, неизбежно возникает вопрос: кто может получить доступ к вашему кластеру Milvus, и что именно им разрешено делать?</p>
<p>Milvus включает встроенную систему RBAC для ответа на этот вопрос. В этом руководстве рассказывается о том, что такое RBAC, как она реализована в Milvus и как разработать модель управления доступом, обеспечивающую безопасность производства, с примерами кода и полным обзором системы RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">Что такое RBAC (контроль доступа на основе ролей)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Контроль доступа на основе ролей (RBAC)</strong> - это модель безопасности, в которой разрешения не назначаются непосредственно отдельным пользователям. Вместо этого разрешения группируются в роли, а пользователям назначается одна или несколько ролей. Эффективный доступ пользователя - это совокупность всех разрешений из назначенных ему ролей. RBAC является стандартной моделью управления доступом в производственных системах баз данных - PostgreSQL, MySQL, MongoDB и большинство облачных сервисов используют ее.</p>
<p>RBAC решает фундаментальную проблему масштабирования: когда у вас десятки пользователей и сервисов, управление разрешениями для каждого пользователя становится неподъемным. С помощью RBAC вы один раз определяете роль (например, "только для чтения на коллекции X"), назначаете ее десяти сервисам и обновляете в одном месте при изменении требований.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Как Milvus реализует RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC построен на четырех концепциях:</p>
<table>
<thead>
<tr><th>Концепция</th><th>Что это такое</th><th>Пример</th></tr>
</thead>
<tbody>
<tr><td><strong>Ресурс</strong></td><td>То, к чему осуществляется доступ.</td><td><a href="https://milvus.io/docs/architecture_overview.md">Экземпляр Milvus</a>, <a href="https://milvus.io/docs/manage-databases.md">база данных</a> или определенная коллекция.</td></tr>
<tr><td><strong>Привилегия / группа привилегий</strong></td><td>Выполняемое действие</td><td><code translate="no">Search</code> <code translate="no">Insert</code>, или группа, например (коллекция доступна только для чтения). <code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>Роль</strong></td><td>Именованный набор привилегий, относящихся к ресурсам.</td><td><code translate="no">role_read_only</code>: может искать и запрашивать все коллекции в базе данных <code translate="no">default</code>.</td></tr>
<tr><td><strong>Пользователь</strong></td><td>Учетная запись Milvus (человек или служба)</td><td><code translate="no">rag_writer</code>: служебная учетная запись, используемая конвейером всасывания.</td></tr>
</tbody>
</table>
<p>Доступ никогда не назначается непосредственно пользователям. Пользователи получают роли, роли содержат привилегии, а привилегии привязываются к ресурсам. Это та же <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">модель RBAC</a>, которая используется в большинстве производственных систем баз данных. Если десять пользователей имеют одну и ту же роль, вы обновляете роль один раз, и изменения распространяются на всех.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Модель RBAC в Milvus показывает, как пользователи назначаются на роли, а роли содержат привилегии и группы привилегий, которые применяются к ресурсам</span> </span>.</p>
<p>Когда запрос попадает в Milvus, он проходит три проверки:</p>
<ol>
<li><strong>Аутентификация</strong> - является ли это действительным пользователем с правильными учетными данными?</li>
<li><strong>Проверка роли</strong> - назначена ли этому пользователю хотя бы одна роль?</li>
<li><strong>Проверка привилегий</strong> - дает ли какая-либо из ролей пользователя запрашиваемое действие на запрашиваемом ресурсе?</li>
</ol>
<p>Если ни одна из проверок не проходит, запрос отклоняется.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Поток аутентификации и авторизации Milvus: Клиентский запрос проходит через аутентификацию, проверку ролей и проверку привилегий - отклоняется на любом неудачном этапе, выполняется только в случае прохождения всех этапов.</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Как включить аутентификацию в Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>По умолчанию Milvus работает с отключенной аутентификацией - любое соединение имеет полный доступ. Первым шагом будет ее включение.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Отредактируйте <code translate="no">milvus.yaml</code> и установите <code translate="no">authorizationEnabled</code> на <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helm Charts</h3><p>Отредактируйте <code translate="no">values.yaml</code> и добавьте настройку в <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Для развертывания <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> на <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a> такая же настройка вносится в раздел Milvus CR <code translate="no">spec.config</code>.</p>
<p>После включения аутентификации и перезапуска Milvus каждое соединение должно предоставлять учетные данные. Milvus создает пользователя по умолчанию <code translate="no">root</code> с паролем <code translate="no">Milvus</code> - немедленно измените его.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Как настроить пользователей, роли и привилегии<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Если аутентификация включена, вот типичный процесс настройки.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Шаг 1: Создание пользователей</h3><p>Не позволяйте службам или членам команды использовать <code translate="no">root</code>. Создайте специальные учетные записи для каждого пользователя или службы.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Шаг 2: Создание ролей</h3><p>В Milvus есть встроенная роль <code translate="no">admin</code>, но на практике вам понадобятся собственные роли, которые будут соответствовать вашим реальным шаблонам доступа.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Шаг 3: Создание групп привилегий</h3><p>Группа привилегий объединяет несколько привилегий под одним именем, что упрощает управление доступом в масштабе. Milvus предоставляет 9 встроенных групп привилегий:</p>
<table>
<thead>
<tr><th>Встроенная группа</th><th>Область применения</th><th>Что позволяет</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Коллекция</td><td>Операции только для чтения (запрос, поиск и т. д.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Коллекция</td><td>Операции чтения и записи</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Коллекция</td><td>Полное управление коллекцией</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>База данных</td><td>Операции с базой данных только для чтения</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>База данных</td><td>Операции с базой данных на чтение и запись</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>База данных</td><td>Полное управление базой данных</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Кластер</td><td>Операции в кластере только для чтения</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Кластер</td><td>Операции чтения и записи в кластере</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Кластер</td><td>Полное управление кластером</td></tr>
</tbody>
</table>
<p>Вы также можете создавать собственные группы привилегий, если встроенные не подходят:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Шаг 4: Предоставление привилегий роли</h3><p>Предоставьте отдельные привилегии или группы привилегий роли, привязанные к определенным ресурсам. Параметры <code translate="no">collection_name</code> и <code translate="no">db_name</code> управляют областью действия - используйте <code translate="no">*</code> для всех.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Шаг 5: Назначение ролей пользователям</h3><p>Пользователь может иметь несколько ролей. Его эффективные разрешения представляют собой объединение всех назначенных ролей.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Как проводить аудит и отзывать доступ<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Знать, какой доступ существует, не менее важно, чем предоставлять его. Устаревшие разрешения - от бывших членов команды, ушедших служб или разовых сеансов отладки - накапливаются молча и увеличивают площадь атаки.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Проверка текущих разрешений</h3><p>Просмотрите назначенные пользователю роли:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Просмотреть предоставленные привилегии роли:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Отменить привилегии у роли</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Отменить назначение роли пользователю</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Удаление пользователей или ролей</h3><p>Перед удалением пользователя удалите все назначенные роли, а перед снятием роли отмените все привилегии:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Пример: Как разработать RBAC для производственной системы RAG<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Абстрактные понятия быстрее усваиваются на конкретном примере. Рассмотрим систему <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, построенную на Milvus, с тремя отдельными службами:</p>
<table>
<thead>
<tr><th>Служба</th><th>Ответственность</th><th>Требуемый доступ</th></tr>
</thead>
<tbody>
<tr><td><strong>Администратор платформы</strong></td><td>Управляет кластером Milvus - создает коллекции, следит за состоянием, обрабатывает обновления</td><td>Полный администратор кластера</td></tr>
<tr><td><strong>Служба встраивания</strong></td><td>Генерирует <a href="https://zilliz.com/glossary/vector-embeddings">векторные вкрапления</a> из документов и записывает их в коллекции</td><td>Чтение + запись в коллекции</td></tr>
<tr><td><strong>Поисковый сервис</strong></td><td>Обрабатывает запросы на <a href="https://zilliz.com/learn/what-is-vector-search">векторный поиск</a> от конечных пользователей</td><td>Только чтение в коллекциях</td></tr>
</tbody>
</table>
<p>Вот полная настройка с использованием <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Каждый сервис получает именно тот доступ, который ему нужен. Служба поиска не может случайно удалить данные. Служба захвата не может изменять настройки кластера. А если учетные данные службы поиска утекут, злоумышленник сможет прочитать <a href="https://zilliz.com/glossary/vector-embeddings">векторы встраивания</a>, но не сможет записать, удалить или повысить права администратора.</p>
<p>Для команд, управляющих доступом к нескольким развертываниям Milvus, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемый Milvus) предоставляет встроенную RBAC с веб-консолью для управления пользователями, ролями и разрешениями - сценарии не требуются. Это удобно, если вы предпочитаете управлять доступом с помощью пользовательского интерфейса, а не поддерживать сценарии настройки в разных средах.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Лучшие практики управления доступом для производства<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Приведенные выше шаги по настройке - это механика. А вот принципы проектирования, которые позволяют сохранить эффективность контроля доступа на протяжении долгого времени.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Заблокируйте корневую учетную запись</h3><p>Прежде всего измените стандартный пароль <code translate="no">root</code>. В производстве учетная запись root должна использоваться только для экстренных операций и храниться в менеджере секретов, а не в конфигурациях приложений и не передаваться по Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Полностью разделяйте окружения</h3><p>Используйте разные <a href="https://milvus.io/docs/architecture_overview.md">экземпляры Milvus</a> для разработки, стейджинга и производства. Разделение сред только с помощью RBAC хрупко - одна неверно настроенная строка подключения, и служба разработки будет писать в производственные данные. Физическое разделение (разные кластеры, разные учетные данные) полностью исключает этот класс инцидентов.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Применение наименьших привилегий</h3><p>Предоставьте каждому пользователю и службе минимальный доступ, необходимый для выполнения их работы. Начните с узкого и расширяйте его только при наличии конкретной, документально подтвержденной необходимости. В средах разработки вы можете быть более расслабленными, но в производственных средах доступ должен быть строгим и регулярно пересматриваться.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Очистка устаревшего доступа</h3><p>Когда кто-то покидает команду или служба выводится из эксплуатации, немедленно отмените его роли и удалите его учетные записи. Неиспользуемые учетные записи с активными правами являются наиболее распространенным вектором несанкционированного доступа - это действительные учетные данные, за которыми никто не следит.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Распространяйте привилегии на конкретные коллекции</h3><p>Избегайте предоставления <code translate="no">collection_name='*'</code>, если роль не нуждается в доступе ко всем коллекциям. В многопользовательских системах или системах с несколькими конвейерами данных предоставляйте каждой роли доступ только к тем <a href="https://milvus.io/docs/manage-collections.md">коллекциям</a>, с которыми она работает. Это ограничит радиус взрыва в случае компрометации учетных данных.</p>
<hr>
<p>Если вы внедряете <a href="https://milvus.io/">Milvus</a> в производство и работаете над контролем доступа, безопасностью или многопользовательским дизайном, мы будем рады помочь:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">Slack-сообществу Milvus</a>, чтобы обсудить реальные методы развертывания с другими инженерами, работающими с Milvus в масштабе.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы обсудить дизайн RBAC - будь то структура ролей, масштабирование на уровне коллекций или многосредовая безопасность.</li>
<li>Если вы предпочитаете отказаться от настройки инфраструктуры и управлять контролем доступа через пользовательский интерфейс, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемое Milvus) включает встроенную RBAC с веб-консолью, а также <a href="https://zilliz.com/cloud-security">шифрование</a>, сетевую изоляцию и соответствие стандарту SOC 2.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают, когда команды начинают настраивать контроль доступа в Milvus:</p>
<p><strong>Вопрос: Могу ли я ограничить доступ пользователя только к определенным коллекциям, а не ко всем?</strong></p>
<p>Да. Когда вы вызываете <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>установите <code translate="no">collection_name</code> на конкретную коллекцию, а не <code translate="no">*</code>. Роль пользователя будет иметь доступ только к этой коллекции. Вы можете предоставить одной и той же роли привилегии для нескольких коллекций, вызывая функцию один раз для каждой коллекции.</p>
<p><strong>Вопрос: В чем разница между привилегией и группой привилегий в Milvus?</strong></p>
<p>Привилегия - это отдельное действие, например <code translate="no">Search</code>, <code translate="no">Insert</code> или <code translate="no">DropCollection</code>. <a href="https://milvus.io/docs/privilege_group.md">Группа привилегий</a> объединяет несколько привилегий под одним именем - например, <code translate="no">COLL_RO</code> включает все операции с коллекцией только для чтения. Предоставление группы привилегий функционально аналогично предоставлению каждой из входящих в нее привилегий по отдельности, но управлять ими проще.</p>
<p><strong>Вопрос: Влияет ли включение аутентификации на производительность запросов Milvus?</strong></p>
<p>Накладные расходы незначительны. Milvus подтверждает учетные данные и проверяет разрешения на роли при каждом запросе, но это поиск в памяти - он занимает микросекунды, а не миллисекунды. На задержку <a href="https://milvus.io/docs/single-vector-search.md">поиска</a> или <a href="https://milvus.io/docs/insert-update-delete.md">вставки</a> это не оказывает заметного влияния.</p>
<p><strong>В: Могу ли я использовать Milvus RBAC в многопользовательской системе?</strong></p>
<p>Да. Создайте отдельные роли для каждого арендатора, ограничьте привилегии каждой роли коллекциями этого арендатора и назначьте соответствующую роль учетной записи службы каждого арендатора. Это обеспечит изоляцию на уровне коллекций, не требуя отдельных экземпляров Milvus. Для более масштабного многопользовательского использования см. <a href="https://milvus.io/docs/multi_tenancy.md">руководство по многопользовательскому использованию Milvus</a>.</p>
