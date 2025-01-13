---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: >-
  Cambiar dinámicamente los niveles de registro en la base de datos Milvus
  Vector
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: Aprenda a ajustar el nivel de registro en Milvus sin reiniciar el servicio.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/jiaoew1991">Enwei Jiao</a> y traducido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Para evitar que un exceso de registros afecte al rendimiento del disco y del sistema, Milvus genera por defecto registros en el nivel <code translate="no">info</code> mientras se ejecuta. Sin embargo, a veces los registros en el nivel <code translate="no">info</code> no son suficientes para ayudarnos a identificar eficientemente errores y problemas. Lo que es peor, en algunos casos, cambiar el nivel de registro y reiniciar el servicio puede hacer que no se reproduzcan los problemas, lo que dificulta aún más la resolución de problemas. En consecuencia, se necesita urgentemente el soporte para cambiar dinámicamente los niveles de registro en la base de datos vectorial de Milvus.</p>
<p>Este artículo pretende presentar el mecanismo que permite cambiar los niveles de registro de forma dinámica y proporcionar instrucciones sobre cómo hacerlo en la base de datos vectorial de Milvus.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#Mechanism">Mecanismo</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Cómo cambiar dinámicamente los niveles de registro</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mecanismo<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>La base de datos vectorial Milvus adopta el registrador <a href="https://github.com/uber-go/zap">zap</a> de código abierto de Uber. Como uno de los componentes de registro más potentes en el ecosistema del lenguaje Go, zap incorpora un módulo <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> para que pueda ver el nivel de registro actual y cambiar dinámicamente el nivel de registro a través de una interfaz HTTP.</p>
<p>Milvus escucha el servicio HTTP proporcionado por el puerto <code translate="no">9091</code>. Por lo tanto, puede acceder al puerto <code translate="no">9091</code> para aprovechar funciones como la depuración del rendimiento, las métricas y las comprobaciones de estado. Del mismo modo, el puerto <code translate="no">9091</code> se reutiliza para permitir la modificación dinámica del nivel de registro y también se añade una ruta <code translate="no">/log/level</code> al puerto. Para más información, consulte la<a href="https://github.com/milvus-io/milvus/pull/18430"> interfaz de registro PR</a>.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Cómo modificar dinámicamente los niveles de registro<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta sección proporciona instrucciones sobre cómo cambiar dinámicamente los niveles de registro sin necesidad de reiniciar el servicio Milvus en ejecución.</p>
<h3 id="Prerequisite" class="common-anchor-header">Requisitos previos</h3><p>Asegúrese de que puede acceder al puerto <code translate="no">9091</code> de los componentes Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Cambiar el nivel de registro</h3><p>Supongamos que la dirección IP del proxy Milvus es <code translate="no">192.168.48.12</code>.</p>
<p>Primero puede ejecutar <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> para comprobar el nivel de registro actual del proxy.</p>
<p>A continuación, puede realizar ajustes especificando el nivel de registro. Las opciones de nivel de registro incluyen:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>El siguiente código de ejemplo cambia el nivel de registro del nivel de registro predeterminado de <code translate="no">info</code> a <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
