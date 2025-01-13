---
id: data-security.md
title: ¿Cómo garantiza la base de datos Milvus Vector la seguridad de los datos?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: >-
  Infórmese sobre la autenticación de usuarios y el cifrado en tránsito en
  Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<p>En plena consideración de la seguridad de sus datos, la autenticación de usuario y la conexión de seguridad de la capa de transporte (TLS) están ahora oficialmente disponibles en Milvus 2.1. Sin autenticación de usuario, cualquiera puede acceder a todos los datos de su base de datos vectorial con SDK. Sin embargo, a partir de Milvus 2.1, sólo aquellos que dispongan de un nombre de usuario y una contraseña válidos podrán acceder a la base de datos vectorial de Milvus. Además, en Milvus 2.1 la seguridad de los datos se protege aún más mediante TLS, que garantiza la seguridad de las comunicaciones en una red informática.</p>
<p>Este artículo pretende analizar cómo la base de datos de vectores Milvus garantiza la seguridad de los datos con la autenticación de usuario y la conexión TLS y explicar cómo puede utilizar estas dos características como usuario que desea garantizar la seguridad de los datos cuando utiliza la base de datos de vectores.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">¿Qué es la seguridad de la base de datos y por qué es importante?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">¿Cómo garantiza la base de datos vectorial de Milvus la seguridad de los datos?</a><ul>
<li><a href="#User-authentication">Autenticación del usuario</a></li>
<li><a href="#TLS-connection">Conexión TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">¿Qué es la seguridad de las bases de datos y por qué es importante?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>La seguridad de las bases de datos se refiere a las medidas adoptadas para garantizar que todos los datos de la base de datos estén seguros y se mantengan confidenciales. Los recientes casos de filtración y filtración de datos en <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, el Departamento de Seguros de Texas, etc.</a> nos hacen estar aún más atentos a la cuestión de la seguridad de los datos. Todos estos casos nos recuerdan constantemente que las empresas y los negocios pueden sufrir graves pérdidas si los datos no están bien protegidos y las bases de datos que utilizan son seguras.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">¿Cómo garantiza la base de datos vectorial Milvus la seguridad de los datos?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>En la versión actual 2.1, la base de datos vectorial Milvus intenta garantizar la seguridad de la base de datos mediante la autenticación y la encriptación. Más concretamente, a nivel de acceso, Milvus admite la autenticación básica de usuarios para controlar quién puede acceder a la base de datos. Mientras tanto, en el nivel de la base de datos, Milvus adopta el protocolo de encriptación de seguridad de la capa de transporte (TLS) para proteger la comunicación de datos.</p>
<h3 id="User-authentication" class="common-anchor-header">Autenticación de usuarios</h3><p>La función de autenticación de usuario básica de Milvus permite acceder a la base de datos de vectores utilizando un nombre de usuario y una contraseña para garantizar la seguridad de los datos. Esto significa que los clientes sólo pueden acceder a la instancia de Milvus si proporcionan un nombre de usuario y una contraseña autenticados.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">El flujo de trabajo de autenticación en la base de datos vectorial Milvus</h4><p>Todas las peticiones gRPC son gestionadas por el proxy de Milvus, por lo que la autenticación es completada por el proxy. El flujo de trabajo de inicio de sesión con las credenciales para conectarse a la instancia Milvus es el siguiente.</p>
<ol>
<li>Crear credenciales para cada instancia Milvus y las contraseñas encriptadas se almacenan en etcd. Milvus utiliza <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> para el cifrado, ya que implementa el <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">algoritmo de hashing adaptativo</a> de Provos y Mazières.</li>
<li>En el lado del cliente, SDK envía el texto cifrado cuando se conecta al servicio Milvus. El texto cifrado en base64 (<username>:<password>) se adjunta a los metadatos con la clave <code translate="no">authorization</code>.</li>
<li>El proxy de Milvus intercepta la solicitud y verifica las credenciales.</li>
<li>Las credenciales se almacenan en caché localmente en el proxy.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>flujo de trabajo de autenticación</span> </span></p>
<p>Cuando se actualizan las credenciales, el flujo de trabajo del sistema en Milvus es el siguiente</p>
<ol>
<li>El coordinador raíz se encarga de las credenciales cuando se llama a las API de inserción, consulta y eliminación.</li>
<li>Cuando se actualizan las credenciales porque se olvida la contraseña por ejemplo, la nueva contraseña se persiste en etcd. Entonces se invalidan todas las credenciales antiguas de la caché local del proxy.</li>
<li>El interceptor de autenticación busca primero los registros de la caché local. Si las credenciales de la caché no son correctas, se lanzará la llamada RPC para obtener el registro más actualizado del coord raíz. Y las credenciales en la caché local se actualizan en consecuencia.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>credential_update_workflow (flujo de trabajo de actualización de credenciales)</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Cómo gestionar la autenticación de usuarios en la base de datos vectorial de Milvus</h4><p>Para habilitar la autenticación, primero debe establecer <code translate="no">common.security.authorizationEnabled</code> en <code translate="no">true</code> al configurar Milvus en el archivo <code translate="no">milvus.yaml</code>.</p>
<p>Una vez habilitada, se creará un usuario raíz para la instancia de Milvus. Este usuario raíz puede utilizar la contraseña inicial de <code translate="no">Milvus</code> para conectarse a la base de datos vectorial de Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Recomendamos encarecidamente cambiar la contraseña del usuario raíz al iniciar Milvus por primera vez.</p>
<p>A continuación, el usuario root puede crear más usuarios nuevos para el acceso autenticado ejecutando el siguiente comando para crear nuevos usuarios.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Hay dos cosas que recordar al crear nuevos usuarios:</p>
<ol>
<li><p>En cuanto al nuevo nombre de usuario, no puede superar los 32 caracteres de longitud y debe empezar por una letra. Sólo se permiten guiones bajos, letras o números en el nombre de usuario. Por ejemplo, no se acepta un nombre de usuario "2abc".</p></li>
<li><p>En cuanto a la contraseña, su longitud debe ser de 6-256 caracteres.</p></li>
</ol>
<p>Una vez configurada la nueva credencial, el nuevo usuario puede conectarse a la instancia de Milvus con el nombre de usuario y la contraseña.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Como en todos los procesos de autenticación, no debe preocuparse si olvida la contraseña. La contraseña de un usuario existente puede restablecerse con el siguiente comando.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Lea la <a href="https://milvus.io/docs/v2.1.x/authenticate.md">documentación de</a> Milvus para saber más sobre la autenticación de usuarios.</p>
<h3 id="TLS-connection" class="common-anchor-header">Conexión TLS</h3><p>La seguridad de la capa de transporte (TLS) es un tipo de protocolo de autenticación para proporcionar seguridad en las comunicaciones en una red informática. TLS utiliza certificados para proporcionar servicios de autenticación entre dos o más partes comunicantes.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Cómo habilitar TLS en la base de datos de vectores de Milvus</h4><p>Para habilitar TLS en Milvus, primero necesita ejecutar el siguiente comando para preparar dos archivos para generar el certificado: un archivo de configuración OpenSSL por defecto llamado <code translate="no">openssl.cnf</code> y un archivo llamado <code translate="no">gen.sh</code> utilizado para generar certificados relevantes.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, puede simplemente copiar y pegar la configuración que proporcionamos <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">aquí</a> en los dos archivos. O también puedes hacer modificaciones basadas en nuestra configuración para adaptarla mejor a tu aplicación.</p>
<p>Cuando los dos archivos estén listos, puede ejecutar el archivo <code translate="no">gen.sh</code> para crear nueve archivos de certificado. Del mismo modo, también puedes modificar las configuraciones de los nueve archivos de certificado para adaptarlas a tus necesidades.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Hay un último paso antes de que pueda conectarse al servicio Milvus con TLS. Tiene que establecer <code translate="no">tlsEnabled</code> en <code translate="no">true</code> y configurar las rutas de archivos de <code translate="no">server.pem</code>, <code translate="no">server.key</code>, y <code translate="no">ca.pem</code> para el servidor en <code translate="no">config/milvus.yaml</code>. El siguiente código es un ejemplo.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Entonces ya está todo listo y puede conectarse al servicio Milvus con TLS siempre que especifique las rutas de archivo de <code translate="no">client.pem</code>, <code translate="no">client.key</code>, y <code translate="no">ca.pem</code> para el cliente cuando utilice el SDK de conexión de Milvus. El código siguiente es también un ejemplo.</p>
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
<h2 id="Whats-next" class="common-anchor-header">Próximos pasos<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el lanzamiento oficial de Milvus 2.1, hemos preparado una serie de blogs presentando las nuevas características. Lea más en esta serie de blogs:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cómo utilizar datos de cadenas para potenciar sus aplicaciones de búsqueda por similitud</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Uso de Milvus integrado para instalar y ejecutar Milvus con Python de forma instantánea</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente el rendimiento de lectura de su base de datos vectorial con réplicas en memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprender el nivel de consistencia en la base de datos vectorial Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprender el nivel de consistencia en la base de datos vectorial de Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">¿Cómo Garantiza la Seguridad de los Datos la Base de Datos Vectorial de Milvus?</a></li>
</ul>
