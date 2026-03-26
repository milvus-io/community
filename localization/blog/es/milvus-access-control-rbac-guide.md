---
id: milvus-access-control-rbac-guide.md
title: 'Guía de control de acceso de Milvus: Cómo configurar RBAC para producción'
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
  Guía paso a paso para configurar Milvus RBAC en producción: usuarios, roles,
  grupos de privilegios, acceso a nivel de colección y un ejemplo de sistema RAG
  completo.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>He aquí una historia que es más común de lo que debería ser: un ingeniero de control de calidad ejecuta un script de limpieza contra lo que cree que es el entorno de ensayo. Excepto que la cadena de conexión apunta a producción. Unos segundos más tarde, las colecciones de vectores principales han desaparecido: se han perdido datos de características, <a href="https://zilliz.com/glossary/similarity-search">la búsqueda de similitudes</a> devuelve resultados vacíos y los servicios se degradan en general. El postmortem encuentra la misma causa raíz de siempre: todo el mundo se conectaba como <code translate="no">root</code>, no había límites de acceso y nada impedía que una cuenta de prueba dejara caer datos de producción.</p>
<p>Esto no es un caso aislado. Los equipos que construyen sobre <a href="https://milvus.io/">Milvus</a> - y <a href="https://zilliz.com/learn/what-is-a-vector-database">bases de datos vectoriales</a> en general - tienden a centrarse en el <a href="https://zilliz.com/learn/vector-index">rendimiento del índice</a>, el rendimiento y la escala de datos, mientras que tratan el control de acceso como algo de lo que ocuparse más tarde. Pero "más tarde" suele llegar en forma de incidente. A medida que Milvus pasa del prototipo a la columna vertebral de <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">los conductos RAG</a> de producción, los motores de recomendación y la <a href="https://zilliz.com/learn/what-is-vector-search">búsqueda vectorial</a> en tiempo real, la pregunta se vuelve inevitable: ¿quién puede acceder a su clúster Milvus y qué es exactamente lo que se les permite hacer?</p>
<p>Milvus incluye un sistema RBAC integrado para responder a esa pregunta. Esta guía cubre qué es RBAC, cómo lo implementa Milvus y cómo diseñar un modelo de control de acceso que mantenga segura la producción - completo con ejemplos de código y un recorrido completo del sistema RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">¿Qué es RBAC (Control de Acceso Basado en Roles)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p>El<strong>control de acceso basado en roles (RBAC)</strong> es un modelo de seguridad en el que los permisos no se asignan directamente a usuarios individuales. En su lugar, los permisos se agrupan en roles, y a los usuarios se les asigna uno o más roles. El acceso efectivo de un usuario es la unión de todos los permisos de sus roles asignados. RBAC es el modelo de control de acceso estándar en los sistemas de bases de datos de producción - PostgreSQL, MySQL, MongoDB, y la mayoría de los servicios en la nube lo utilizan.</p>
<p>RBAC resuelve un problema fundamental de escalabilidad: cuando se tienen docenas de usuarios y servicios, la gestión de permisos por usuario se vuelve imposible de mantener. Con RBAC, usted define una función una vez (por ejemplo, "sólo lectura en la colección X"), la asigna a diez servicios y la actualiza en un solo lugar cuando cambian los requisitos.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">¿Cómo implementa Milvus RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC se basa en cuatro conceptos:</p>
<table>
<thead>
<tr><th>Concepto</th><th>Qué es</th><th>Ejemplo</th></tr>
</thead>
<tbody>
<tr><td><strong>Recurso</strong></td><td>La cosa a la que se accede</td><td>Una <a href="https://milvus.io/docs/architecture_overview.md">instancia de Milvus</a>, una <a href="https://milvus.io/docs/manage-databases.md">base de datos</a> o una colección específica</td></tr>
<tr><td><strong>Privilegio / Grupo de privilegios</strong></td><td>La acción que se realiza</td><td><code translate="no">Search</code> <code translate="no">Insert</code>, , o un grupo como (colección de sólo lectura) <code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>Rol</strong></td><td>Conjunto de privilegios asignados a recursos.</td><td><code translate="no">role_read_only</code>Puede buscar y consultar todas las colecciones de la base de datos <code translate="no">default</code> </td></tr>
<tr><td><strong>Usuario</strong></td><td>Una cuenta Milvus (humana o de servicio)</td><td><code translate="no">rag_writer</code>cuenta de servicio utilizada por el proceso de ingestión</td></tr>
</tbody>
</table>
<p>El acceso nunca se asigna directamente a los usuarios. Los usuarios obtienen roles, los roles contienen privilegios y los privilegios se asignan a los recursos. Este es el mismo <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">modelo RBAC</a> que se utiliza en la mayoría de los sistemas de bases de datos de producción. Si diez usuarios comparten el mismo rol, usted actualiza el rol una vez y el cambio se aplica a todos ellos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>El modelo RBAC de Milvus muestra cómo los Usuarios son asignados a Roles, y los Roles contienen Privilegios y Grupos de Privilegios que se aplican a los Recursos</span> </span>.</p>
<p>Cuando una solicitud llega a Milvus, pasa por tres comprobaciones:</p>
<ol>
<li><strong>Autenticación</strong>: ¿se trata de un usuario válido con las credenciales correctas?</li>
<li><strong>Comprobación de funciones</strong>: ¿tiene este usuario asignada al menos una función?</li>
<li><strong>Comprobación de privilegios</strong>: ¿alguna de las funciones del usuario permite la acción solicitada en el recurso solicitado?</li>
</ol>
<p>Si falla alguna comprobación, se rechaza la solicitud.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Flujo de autenticación y autorización de Milvus: La solicitud del cliente pasa por la autenticación, la comprobación de funciones y la comprobación de privilegios: se rechaza en cualquier paso que falle, sólo se ejecuta si se superan todos.</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Cómo habilitar la autenticación en Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Por defecto, Milvus funciona con la autenticación desactivada - todas las conexiones tienen acceso total. El primer paso es activarla.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Componer Docker</h3><p>Edite <code translate="no">milvus.yaml</code> y establezca <code translate="no">authorizationEnabled</code> en <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Cartas Helm</h3><p>Edite <code translate="no">values.yaml</code> y añada la configuración en <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para despliegues de Milvus <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Operator</a> en <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, la misma configuración va en la sección <code translate="no">spec.config</code> de Milvus CR.</p>
<p>Una vez que se habilita la autenticación y Milvus se reinicia, cada conexión debe proporcionar credenciales. Milvus crea un usuario por defecto <code translate="no">root</code> con la contraseña <code translate="no">Milvus</code> - cámbiela inmediatamente.</p>
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
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Cómo configurar usuarios, roles y privilegios<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la autenticación habilitada, este es el flujo de trabajo típico de configuración.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Paso 1: Crear usuarios</h3><p>No permita que los servicios o miembros del equipo utilicen <code translate="no">root</code>. Cree cuentas dedicadas para cada usuario o servicio.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Paso 2: Crear Roles</h3><p>Milvus tiene un rol incorporado <code translate="no">admin</code>, pero en la práctica usted querrá roles personalizados que coincidan con sus patrones de acceso reales.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Paso 3: Crear grupos de privilegios</h3><p>Un grupo de privilegios agrupa múltiples privilegios bajo un mismo nombre, facilitando la gestión del acceso a escala. Milvus proporciona 9 grupos de privilegios integrados:</p>
<table>
<thead>
<tr><th>Grupo incorporado</th><th>Alcance</th><th>Qué permite</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Colección</td><td>Operaciones de sólo lectura (consulta, búsqueda, etc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Colección</td><td>Operaciones de lectura y escritura</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Colección</td><td>Gestión completa de colecciones</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Base de datos</td><td>Operaciones de base de datos de sólo lectura</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Base de datos</td><td>Operaciones de base de datos de lectura y escritura</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Base de datos</td><td>Gestión completa de bases de datos</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Clúster</td><td>Operaciones de clúster de sólo lectura</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Clúster</td><td>Operaciones de clúster de lectura y escritura</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Clúster</td><td>Gestión completa del clúster</td></tr>
</tbody>
</table>
<p>También puede crear grupos de privilegios personalizados cuando los incorporados no sean adecuados:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Paso 4: Conceder privilegios a una función</h3><p>Conceda privilegios individuales o grupos de privilegios a un rol, con alcance a recursos específicos. Los parámetros <code translate="no">collection_name</code> y <code translate="no">db_name</code> controlan el alcance - utilice <code translate="no">*</code> para todos.</p>
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
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Paso 5: Asignar funciones a los usuarios</h3><p>Un usuario puede tener varios roles. Sus permisos efectivos son la unión de todos los roles asignados.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Cómo auditar y revocar accesos<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Saber qué accesos existen es tan importante como concederlos. Los permisos obsoletos -de antiguos miembros del equipo, servicios retirados o sesiones de depuración puntuales- se acumulan silenciosamente y amplían la superficie de ataque.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Compruebe los permisos actuales</h3><p>Ver los roles asignados a un usuario:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ver los privilegios concedidos a un rol:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Revocar privilegios de un rol</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
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
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Anular la asignación de una función a un usuario</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Eliminar usuarios o funciones</h3><p>Elimine todas las asignaciones de funciones antes de eliminar un usuario, y revoque todos los privilegios antes de eliminar una función:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Ejemplo: Cómo diseñar RBAC para un sistema RAG de producción<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Los conceptos abstractos se entienden más rápido con un ejemplo concreto. Considere un sistema <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> construido sobre Milvus con tres servicios distintos:</p>
<table>
<thead>
<tr><th>Servicio</th><th>Responsabilidad</th><th>Acceso requerido</th></tr>
</thead>
<tbody>
<tr><td><strong>Administrador de la plataforma</strong></td><td>Gestiona el clúster Milvus - crea colecciones, supervisa la salud, gestiona las actualizaciones</td><td>Administrador completo del clúster</td></tr>
<tr><td><strong>Servicio de ingestión</strong></td><td>Genera <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones vectoriales</a> a partir de documentos y las escribe en las colecciones</td><td>Lectura y escritura en colecciones</td></tr>
<tr><td><strong>Servicio de búsqueda</strong></td><td>Gestiona las consultas de <a href="https://zilliz.com/learn/what-is-vector-search">búsqueda vectorial</a> de los usuarios finales</td><td>Sólo lectura en colecciones</td></tr>
</tbody>
</table>
<p>Esta es una configuración completa usando <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
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
<p>Cada servicio obtiene exactamente el acceso que necesita. El servicio de búsqueda no puede borrar datos accidentalmente. El servicio de ingestión no puede modificar la configuración del clúster. Y si las credenciales del servicio de búsqueda se filtran, el atacante puede leer <a href="https://zilliz.com/glossary/vector-embeddings">los vectores de incrustación</a>, pero no puede escribir, eliminar o escalar a administrador.</p>
<p>Para los equipos que gestionan el acceso a través de múltiples despliegues de Milvus, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) proporciona RBAC integrado con una consola web para gestionar usuarios, roles y permisos, sin necesidad de scripts. Es útil cuando prefiere gestionar el acceso a través de una interfaz de usuario en lugar de mantener secuencias de comandos de configuración en todos los entornos.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Mejores prácticas de control de acceso para producción<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Los pasos de configuración anteriores son la mecánica. Estos son los principios de diseño que mantienen el control de acceso efectivo a lo largo del tiempo.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Bloquee la cuenta raíz</h3><p>Cambie la contraseña por defecto <code translate="no">root</code> antes que cualquier otra cosa. En producción, la cuenta raíz sólo debe utilizarse para operaciones de emergencia y almacenarse en un gestor de secretos, no codificarse en la configuración de la aplicación ni compartirse a través de Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Separe completamente los entornos</h3><p>Utilice diferentes <a href="https://milvus.io/docs/architecture_overview.md">instancias de Milvus</a> para desarrollo, puesta en escena y producción. La separación de entornos únicamente mediante RBAC es frágil: una cadena de conexión mal configurada y un servicio de desarrollo está escribiendo en datos de producción. La separación física (diferentes clusters, diferentes credenciales) elimina esta clase de incidentes por completo.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Aplicar el mínimo privilegio</h3><p>Dé a cada usuario y servicio el acceso mínimo necesario para hacer su trabajo. Empiece con un acceso reducido y amplíelo sólo cuando exista una necesidad específica y documentada. En entornos de desarrollo se puede ser más relajado, pero el acceso en producción debe ser estricto y revisarse periódicamente.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Limpiar el acceso obsoleto</h3><p>Cuando alguien abandona el equipo o se da de baja un servicio, revoca sus funciones y elimina sus cuentas inmediatamente. Las cuentas no utilizadas con permisos activos son el vector más común de acceso no autorizado: son credenciales válidas que nadie está supervisando.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Privilegios de alcance a colecciones específicas</h3><p>Evite conceder permisos a <code translate="no">collection_name='*'</code> a menos que la función realmente necesite acceder a todas las colecciones. En configuraciones de varios inquilinos o sistemas con varias canalizaciones de datos, limite cada función únicamente a las <a href="https://milvus.io/docs/manage-collections.md">colecciones</a> en las que opera. Esto limita el radio de explosión si las credenciales se ven comprometidas.</p>
<hr>
<p>Si está desplegando <a href="https://milvus.io/">Milvus</a> en producción y trabajando en el control de acceso, la seguridad o el diseño multiusuario, nos encantaría ayudarle:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para discutir prácticas reales de despliegue con otros ingenieros que ejecutan Milvus a escala.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para revisar su diseño RBAC, ya sea la estructura de roles, el alcance a nivel de colección o la seguridad multientorno.</li>
<li>Si prefiere omitir la configuración de la infraestructura y gestionar el control de acceso a través de una interfaz de usuario, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) incluye RBAC integrado con una consola web, además de <a href="https://zilliz.com/cloud-security">cifrado</a>, aislamiento de red y cumplimiento de SOC 2 desde el primer momento.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los equipos comienzan a configurar el control de acceso en Milvus:</p>
<p><strong>P: ¿Puedo restringir el acceso de un usuario a determinadas colecciones y no a todas?</strong></p>
<p>Sí. Cuando llame a <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a><code translate="no">collection_name</code> a la colección específica en lugar de <code translate="no">*</code>. La función del usuario sólo tendrá acceso a esa colección. Puede conceder privilegios a la misma función en varias colecciones llamando a la función una vez por colección.</p>
<p><strong>P: ¿Cuál es la diferencia entre un privilegio y un grupo de privilegios en Milvus?</strong></p>
<p>Un privilegio es una sola acción como <code translate="no">Search</code>, <code translate="no">Insert</code>, o <code translate="no">DropCollection</code>. Un <a href="https://milvus.io/docs/privilege_group.md">grupo de</a> privilegios agrupa múltiples privilegios bajo un nombre - por ejemplo, <code translate="no">COLL_RO</code> incluye todas las operaciones de lectura de colecciones. Conceder un grupo de privilegios es funcionalmente lo mismo que conceder individualmente cada uno de los privilegios que lo componen, pero es más fácil de gestionar.</p>
<p><strong>P: ¿Afecta la autenticación al rendimiento de las consultas de Milvus?</strong></p>
<p>La sobrecarga es insignificante. Milvus valida las credenciales y comprueba los permisos de rol en cada solicitud, pero se trata de una búsqueda en memoria - añade microsegundos, no milisegundos. No hay un impacto medible en la latencia de <a href="https://milvus.io/docs/single-vector-search.md">búsqueda</a> o <a href="https://milvus.io/docs/insert-update-delete.md">inserción</a>.</p>
<p><strong>P: ¿Puedo utilizar Milvus RBAC en una configuración multi-tenant?</strong></p>
<p>Sí. Cree funciones separadas por inquilino, limite los privilegios de cada función a las colecciones de ese inquilino y asigne la función correspondiente a la cuenta de servicio de cada inquilino. Esto le proporciona un aislamiento a nivel de colección sin necesidad de instancias Milvus separadas. Para un multi-arrendamiento a mayor escala, consulte la <a href="https://milvus.io/docs/multi_tenancy.md">guía de multi-arrendamiento de Mil</a>vus.</p>
