---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Milvus RBAC Explicado: Proteja su base de datos vectorial con el control de
  acceso basado en funciones
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
  Aprenda por qué es importante RBAC, cómo funciona RBAC en Milvus, cómo
  configurar el control de acceso y cómo permite el acceso con menos
  privilegios, una clara separación de roles y operaciones de producción
  seguras.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Al crear un sistema de base de datos, los ingenieros dedican la mayor parte de su tiempo al rendimiento: tipos de índice, recuperación, latencia, rendimiento y escalado. Pero una vez que un sistema va más allá del portátil de un único desarrollador, otra cuestión se vuelve igual de crítica: <strong>¿quién puede hacer qué dentro de su clúster Milvus</strong>? En otras palabras: control de acceso.</p>
<p>En todo el sector, muchos incidentes operativos tienen su origen en simples errores de permisos. Un script se ejecuta en el entorno equivocado. Una cuenta de servicio tiene un acceso más amplio de lo previsto. Una credencial de administrador compartida acaba en CI. Estos problemas suelen surgir como cuestiones muy prácticas:</p>
<ul>
<li><p>¿Pueden los desarrolladores eliminar colecciones de producción?</p></li>
<li><p>¿Por qué una cuenta de prueba puede leer datos vectoriales de producción?</p></li>
<li><p>¿Por qué varios servicios inician sesión con el mismo rol de administrador?</p></li>
<li><p>¿Pueden los trabajos de análisis tener acceso de sólo lectura con cero privilegios de escritura?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> aborda estos retos con <a href="https://milvus.io/docs/rbac.md">el control de acceso basado en roles (RBAC)</a>. En lugar de otorgar a cada usuario derechos de superadministrador o intentar imponer restricciones en el código de la aplicación, RBAC le permite definir permisos precisos en la capa de la base de datos. Cada usuario o servicio obtiene exactamente las capacidades que necesita, nada más.</p>
<p>Este artículo explica cómo funciona RBAC en Milvus, cómo configurarlo y cómo aplicarlo con seguridad en entornos de producción.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Por qué es importante el control de acceso cuando se utiliza Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando los equipos son pequeños y sus aplicaciones de IA sólo sirven a un número limitado de usuarios, la infraestructura suele ser sencilla. Unos pocos ingenieros gestionan el sistema; Milvus se utiliza sólo para desarrollo o pruebas; y los flujos de trabajo operativos son sencillos. En esta fase inicial, el control de acceso rara vez parece urgente, porque la superficie de riesgo es pequeña y cualquier error puede revertirse fácilmente.</p>
<p>A medida que Milvus pasa a producción y crece el número de usuarios, servicios y operadores, el modelo de uso cambia rápidamente. Los escenarios comunes incluyen:</p>
<ul>
<li><p>Múltiples sistemas empresariales que comparten la misma instancia de Milvus</p></li>
<li><p>Múltiples equipos que acceden a las mismas colecciones de vectores</p></li>
<li><p>Datos de prueba, de puesta en escena y de producción que coexisten en un solo clúster</p></li>
<li><p>Diferentes roles que necesitan diferentes niveles de acceso, desde consultas de sólo lectura hasta escrituras y control operativo</p></li>
</ul>
<p>Sin límites de acceso bien definidos, estas configuraciones crean riesgos predecibles:</p>
<ul>
<li><p>Los flujos de trabajo de prueba pueden borrar accidentalmente las colecciones de producción.</p></li>
<li><p>Los desarrolladores podrían modificar involuntariamente los índices utilizados por los servicios activos.</p></li>
<li><p>El uso generalizado de la cuenta <code translate="no">root</code> hace que las acciones sean imposibles de rastrear o auditar.</p></li>
<li><p>Una aplicación comprometida podría obtener acceso ilimitado a todos los datos del vector.</p></li>
</ul>
<p>A medida que crece el uso, confiar en convenciones informales o cuentas de administrador compartidas ya no es sostenible. Un modelo de acceso coherente y aplicable se convierte en esencial, y esto es exactamente lo que proporciona Milvus RBAC.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Qué es RBAC en Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> es un modelo de permiso que controla el acceso basado en <strong>roles</strong> en lugar de usuarios individuales. En Milvus, RBAC le permite definir exactamente qué operaciones puede realizar un usuario o servicio, y en qué recursos específicos. Proporciona una forma estructurada y escalable de gestionar la seguridad a medida que su sistema crece desde un único desarrollador hasta un entorno de producción completo.</p>
<p>Milvus RBAC se basa en los siguientes componentes principales:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Usuarios Roles Privilegios</span> </span></p>
<ul>
<li><p><strong>Recurso</strong>: La entidad a la que se accede. En Milvus, los recursos incluyen la <strong>instancia</strong>, la <strong>base de datos</strong> y la <strong>colección</strong>.</p></li>
<li><p><strong>Privilegio</strong>: Una operación específica permitida en un recurso, por ejemplo, crear una colección, insertar datos o eliminar entidades.</p></li>
<li><p><strong>Grupo de privilegios</strong>: Un conjunto predefinido de privilegios relacionados, como "sólo lectura" o "escritura".</p></li>
<li><p><strong>Rol</strong>: Una combinación de privilegios y los recursos a los que se aplican. Un rol determina <em>qué</em> operaciones pueden realizarse y <em>dónde</em>.</p></li>
<li><p><strong>Usuario</strong>: Una identidad en Milvus. Cada usuario tiene un ID único y se le asignan uno o más roles.</p></li>
</ul>
<p>Estos componentes forman una jerarquía clara:</p>
<ol>
<li><p><strong>A los usuarios se les asignan roles</strong></p></li>
<li><p><strong>Los roles definen privilegios</strong></p></li>
<li><p><strong>Los privilegios se aplican a recursos específicos</strong></p></li>
</ol>
<p>Un principio de diseño clave en Milvus es que <strong>los permisos nunca se asignan directamente a los usuarios</strong>. Todos los accesos pasan por los roles. Esta indirección simplifica la administración, reduce los errores de configuración y hace que los cambios de permisos sean predecibles.</p>
<p>Este modelo se escala limpiamente en despliegues reales. Cuando varios usuarios comparten una función, la actualización de los privilegios de la función actualiza instantáneamente los permisos para todos ellos, sin modificar cada usuario individualmente. Es un único punto de control alineado con la forma en que la infraestructura moderna gestiona el acceso.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Cómo funciona RBAC en Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando un cliente envía una solicitud a Milvus, el sistema la evalúa a través de una serie de pasos de autorización. Cada paso debe ser superado antes de que la operación pueda continuar:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Cómo funciona RBAC en Milvus</span> </span></p>
<ol>
<li><p><strong>Autenticar la solicitud:</strong> Milvus verifica primero la identidad del usuario. Si la autenticación falla, la solicitud se rechaza con un error de autenticación.</p></li>
<li><p><strong>Comprobar la asignación de funciones:</strong> Tras la autenticación, Milvus comprueba si el usuario tiene asignado al menos un rol. Si no se encuentra ningún rol, la solicitud se rechaza con un error de permiso denegado.</p></li>
<li><p><strong>Verificar los privilegios requeridos:</strong> A continuación, Milvus evalúa si el rol del usuario concede el privilegio requerido sobre el recurso de destino. Si la comprobación de privilegios falla, la solicitud se rechaza con un error de permiso denegado.</p></li>
<li><p><strong>Ejecutar la operación:</strong> Si todas las comprobaciones son correctas, Milvus ejecuta la operación solicitada y devuelve el resultado.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Cómo configurar el control de acceso mediante RBAC en Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Requisitos previos</h3><p>Antes de que las reglas RBAC puedan ser evaluadas y aplicadas, la autenticación de usuario debe estar habilitada para que cada petición a Milvus pueda ser asociada con una identidad de usuario específica.</p>
<p>Aquí hay dos métodos de despliegue estándar.</p>
<ul>
<li><strong>Despliegue con Docker Compose</strong></li>
</ul>
<p>Si Milvus se despliega utilizando Docker Compose, edite el archivo de configuración <code translate="no">milvus.yaml</code> y habilite la autorización estableciendo <code translate="no">common.security.authorizationEnabled</code> a <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Desplegando con Helm Charts</strong></li>
</ul>
<p>Si Milvus se despliega utilizando Helm Charts, edite el archivo <code translate="no">values.yaml</code> y añada la siguiente configuración en <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Inicialización</h3><p>Por defecto, Milvus crea un usuario <code translate="no">root</code> incorporado cuando se inicia el sistema. La contraseña por defecto para este usuario es <code translate="no">Milvus</code>.</p>
<p>Como paso inicial de seguridad, utilice el usuario <code translate="no">root</code> para conectarse a Milvus y cambie inmediatamente la contraseña por defecto. Se recomienda encarecidamente utilizar una contraseña compleja para evitar accesos no autorizados.</p>
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
<h3 id="3-Core-Operations" class="common-anchor-header">3. Operaciones básicas</h3><p><strong>Creación de usuarios</strong></p>
<p>Para el uso diario, se recomienda crear usuarios dedicados en lugar de utilizar la cuenta <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Crear roles</strong></p>
<p>Milvus proporciona un rol incorporado <code translate="no">admin</code> con privilegios administrativos completos. Sin embargo, para la mayoría de los escenarios de producción, se recomienda crear roles personalizados para lograr un control de acceso más detallado.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Crear grupos de privilegios</strong></p>
<p>Un grupo de privilegios es una colección de múltiples privilegios. Para simplificar la gestión de permisos, los privilegios relacionados pueden agruparse y concederse juntos.</p>
<p>Milvus incluye los siguientes grupos de privilegios incorporados:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>El uso de estos grupos de privilegios incorporados puede reducir significativamente la complejidad del diseño de permisos y mejorar la consistencia entre roles.</p>
<p>Puede utilizar directamente los grupos de privilegios incorporados o crear grupos de privilegios personalizados según sea necesario.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Conceder privilegios o grupos de privilegios a roles</strong></p>
<p>Una vez creado un rol, se le pueden conceder privilegios o grupos de privilegios. Los recursos de destino para estos privilegios pueden especificarse a diferentes niveles, incluyendo la instancia, la base de datos o las colecciones individuales.</p>
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
<p><strong>Asignación de funciones a usuarios</strong></p>
<p>Una vez asignados los roles a un usuario, éste puede acceder a los recursos y realizar las operaciones definidas por dichos roles. A un mismo usuario se le puede conceder uno o varios roles, dependiendo del ámbito de acceso requerido.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Inspeccionar y revocar el acceso</h3><p><strong>Inspeccionar los roles asignados a un usuario</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inspeccionar Privilegios Asignados a un Rol</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Revocar privilegios de una función</strong></p>
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
<p><strong>Revocar Funciones de un Usuario</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Borrar Usuarios y Roles</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Ejemplo: Diseño de control de acceso para un sistema RAG impulsado por Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Considere un sistema de Generación de Recuperación-Aumentada (RAG) construido sobre Milvus.</p>
<p>En este sistema, los diferentes componentes y usuarios tienen responsabilidades claramente separadas, y cada uno requiere un nivel de acceso diferente.</p>
<table>
<thead>
<tr><th>Actor</th><th>Responsabilidad</th><th>Acceso requerido</th></tr>
</thead>
<tbody>
<tr><td>Administrador de la plataforma</td><td>Operaciones y configuración del sistema</td><td>Administración a nivel de instancia</td></tr>
<tr><td>Servicio de ingestión de vectores</td><td>Ingesta y actualización de datos vectoriales</td><td>Acceso de lectura y escritura</td></tr>
<tr><td>Servicio de búsqueda</td><td>Búsqueda y recuperación de vectores</td><td>Acceso de sólo lectura</td></tr>
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
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Consejos rápidos: Cómo operar con seguridad el control de acceso en producción<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Para garantizar que el control de acceso siga siendo eficaz y manejable en sistemas de producción de larga duración, siga estas directrices prácticas.</p>
<p><strong>1. Cambie la</strong> <strong>contraseña</strong><strong>predeterminada</strong> <code translate="no">root</code> <strong>y limite el uso de la</strong> <strong>cuenta</strong> <code translate="no">root</code>.</p>
<p>Actualice la contraseña por defecto <code translate="no">root</code> inmediatamente después de la inicialización y restrinja su uso únicamente a tareas administrativas. Evite utilizar o compartir la cuenta root para operaciones rutinarias. En su lugar, cree usuarios y roles dedicados para el acceso diario con el fin de reducir el riesgo y mejorar la responsabilidad.</p>
<p><strong>2. Aísle físicamente las instancias de Milvus entre entornos</strong></p>
<p>Despliegue instancias Milvus separadas para desarrollo, puesta en escena y producción. El aislamiento físico proporciona un límite de seguridad más fuerte que el control de acceso lógico por sí solo y reduce significativamente el riesgo de errores entre entornos.</p>
<p><strong>3. Siga el principio de mínimo privilegio</strong></p>
<p>Conceda únicamente los permisos necesarios para cada función:</p>
<ul>
<li><p><strong>Entornos de desarrollo:</strong> los permisos pueden ser más permisivos para apoyar la iteración y las pruebas.</p></li>
<li><p><strong>Entornos de producción:</strong> los permisos deben limitarse estrictamente a lo necesario.</p></li>
<li><p><strong>Auditorías regulares:</strong> revisar periódicamente los permisos existentes para asegurarse de que siguen siendo necesarios</p></li>
</ul>
<p><strong>4. 4. Revocar activamente los permisos cuando ya no sean necesarios.</strong></p>
<p>El control de acceso no se configura una sola vez, sino que requiere un mantenimiento continuo. Revoca las funciones y los privilegios rápidamente cuando cambien los usuarios, los servicios o las responsabilidades. Esto evita que los permisos no utilizados se acumulen con el tiempo y se conviertan en riesgos de seguridad ocultos.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Configurar el control de acceso en Milvus no es inherentemente complejo, pero es esencial para operar el sistema de manera segura y confiable en producción. Con un modelo RBAC bien diseñado, usted puede:</p>
<ul>
<li><p><strong>Reducir el riesgo</strong> evitando operaciones accidentales o destructivas</p></li>
<li><p><strong>Mejorar la seguridad</strong> imponiendo el acceso con menos privilegios a los datos vectoriales.</p></li>
<li><p><strong>Estandarizar las operaciones</strong> mediante una clara separación de responsabilidades</p></li>
<li><p><strong>Escalar con confianza</strong>, sentando las bases para despliegues multi-tenant y a gran escala.</p></li>
</ul>
<p>El control de acceso no es una función opcional ni una tarea puntual. Es una parte fundamental para operar Milvus de forma segura a largo plazo.</p>
<p>👉 Empieza a construir una sólida base de seguridad con <a href="https://milvus.io/docs/rbac.md">RBAC</a> para tu despliegue de Milvus.</p>
<p>Tiene preguntas o desea una inmersión profunda en cualquier característica del último Milvus? Únete a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presenta incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
