---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Presentación del índice Milvus Ngram: Coincidencia de palabras clave y
  consultas LIKE más rápidas para cargas de trabajo de agentes
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Descubra cómo el índice Ngram de Milvus acelera las consultas LIKE
  convirtiendo la concordancia de subcadenas en eficientes búsquedas de
  n-gramas, con un rendimiento 100 veces superior.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>En los sistemas de agentes, la <strong>recuperación del contexto</strong> es un elemento fundamental en todo el proceso, ya que proporciona la base para el razonamiento, la planificación y la acción posteriores. La búsqueda vectorial ayuda a los agentes a recuperar el contexto semánticamente relevante que capta la intención y el significado en conjuntos de datos grandes y desestructurados. Sin embargo, la relevancia semántica por sí sola no suele ser suficiente. Las cadenas de agentes también se basan en la búsqueda de texto completo para aplicar restricciones de palabras clave exactas, como nombres de productos, llamadas a funciones, códigos de error o términos legalmente significativos. Esta capa de apoyo garantiza que el contexto recuperado no sólo sea relevante, sino que también satisfaga explícitamente requisitos textuales estrictos.</p>
<p>Las cargas de trabajo reales reflejan sistemáticamente esta necesidad:</p>
<ul>
<li><p>Los asistentes de atención al cliente deben encontrar conversaciones en las que se mencione un producto o ingrediente concreto.</p></li>
<li><p>Los copilotos de codificación buscan fragmentos que contengan el nombre exacto de una función, una llamada a la API o una cadena de error.</p></li>
<li><p>Los agentes jurídicos, médicos y académicos filtran documentos en busca de cláusulas o citas que deben aparecer textualmente.</p></li>
</ul>
<p>Tradicionalmente, los sistemas han manejado esto con el operador SQL <code translate="no">LIKE</code>. Una consulta como <code translate="no">name LIKE '%rod%'</code> es sencilla y está ampliamente soportada, pero en condiciones de alta concurrencia y grandes volúmenes de datos, esta simplicidad conlleva importantes costes de rendimiento.</p>
<ul>
<li><p><strong>Sin un índice</strong>, una consulta a <code translate="no">LIKE</code> escanea todo el almacén de contexto y aplica la concordancia de patrones fila por fila. Con millones de registros, incluso una sola consulta puede tardar segundos, lo que resulta demasiado lento para las interacciones de los agentes en tiempo real.</p></li>
<li><p><strong>Incluso con un índice invertido convencional</strong>, los patrones comodín como <code translate="no">%rod%</code> siguen siendo difíciles de optimizar porque el motor debe recorrer todo el diccionario y ejecutar la concordancia de patrones en cada entrada. La operación evita el escaneo de filas, pero sigue siendo fundamentalmente lineal, con lo que las mejoras son marginales.</p></li>
</ul>
<p>Esto crea una clara brecha en los sistemas de recuperación híbridos: la búsqueda vectorial maneja la relevancia semántica de forma eficiente, pero el filtrado de palabras clave exactas a menudo se convierte en el paso más lento del proceso.</p>
<p>Milvus soporta de forma nativa la búsqueda híbrida vectorial y de texto completo con filtrado de metadatos. Para abordar las limitaciones de la concordancia de palabras clave, Milvus introduce el <a href="https://milvus.io/docs/ngram.md"><strong>índice Ngram</strong></a>, que mejora el rendimiento de <code translate="no">LIKE</code> dividiendo el texto en pequeñas subcadenas e indexándolas para una búsqueda eficiente. Esto reduce drásticamente la cantidad de datos examinados durante la ejecución de la consulta, proporcionando consultas <code translate="no">LIKE</code> <strong>de decenas a cientos de veces más rápidas</strong> en cargas de trabajo reales.</p>
<p>El resto de este artículo explica cómo funciona el índice Ngram en Milvus y evalúa su rendimiento en escenarios reales.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">¿Qué es el índice Ngram?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>En las bases de datos, el filtrado de texto se expresa habitualmente mediante <strong>SQL</strong>, el lenguaje de consulta estándar utilizado para recuperar y gestionar datos. Uno de sus operadores de texto más utilizados es <code translate="no">LIKE</code>, que admite la comparación de cadenas basada en patrones.</p>
<p>Las expresiones LIKE pueden agruparse a grandes rasgos en cuatro tipos de patrones comunes, dependiendo de cómo se utilicen los comodines:</p>
<ul>
<li><p><strong>Coincidencia infija</strong> (<code translate="no">name LIKE '%rod%'</code>): Coincide con registros en los que la subcadena rod aparece en cualquier parte del texto.</p></li>
<li><p><strong>Coincidencia prefija</strong> (<code translate="no">name LIKE 'rod%'</code>): Coincide con los registros cuyo texto empiece por rod.</p></li>
<li><p><strong>Coincidencia de sufijo</strong> (<code translate="no">name LIKE '%rod'</code>): Coincide con los registros cuyo texto termina con rod.</p></li>
<li><p><strong>Coincidencia con comodín</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Combina múltiples condiciones de subcadena (<code translate="no">%</code>) con comodines de un solo carácter (<code translate="no">_</code>) en un único patrón.</p></li>
</ul>
<p>Aunque estos patrones difieren en apariencia y expresividad, el <strong>Índice Ngram</strong> de Milvus los acelera todos utilizando el mismo enfoque subyacente.</p>
<p>Antes de construir el índice, Milvus divide cada valor de texto en subcadenas cortas y superpuestas de longitudes fijas, conocidas como <em>n-gramas</em>. Por ejemplo, cuando n = 3, la palabra <strong>"Milvus"</strong> se descompone en los 3gramas siguientes: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu</strong>" y <strong>"vus".</strong> Cada n-grama se almacena en un índice invertido que asigna la subcadena al conjunto de ID de documentos en los que aparece. En el momento de la consulta, las condiciones de <code translate="no">LIKE</code> se traducen en combinaciones de búsquedas de n-gramas, lo que permite a Milvus filtrar rápidamente la mayoría de los registros no coincidentes y evaluar el patrón con un conjunto de candidatos mucho más pequeño. Esto es lo que convierte los costosos escaneos de cadenas en eficientes consultas basadas en índices.</p>
<p>Dos parámetros controlan cómo se construye el índice Ngram: <code translate="no">min_gram</code> y <code translate="no">max_gram</code>. Juntos, definen el rango de longitudes de subcadenas que Milvus genera e indexa.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: La longitud de subcadena más corta a indexar. En la práctica, esto también establece la longitud mínima de la subcadena de consulta que puede beneficiarse del Índice Ngram.</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: La longitud de subcadena más larga a indexar. En el momento de la consulta, determina además el tamaño máximo de ventana utilizado al dividir las cadenas de consulta más largas en n-gramas.</p></li>
</ul>
<p>Al indexar todas las subcadenas contiguas cuya longitud esté comprendida entre <code translate="no">min_gram</code> y <code translate="no">max_gram</code>, Milvus establece una base coherente y eficaz para acelerar todos los tipos de patrones compatibles con <code translate="no">LIKE</code>.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">¿Cómo funciona el índice Ngram?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus implementa el Índice Ngram en un proceso de dos fases:</p>
<ul>
<li><p><strong>Construir el índice:</strong> Generar n-gramas para cada documento y construir un índice invertido durante la ingesta de datos.</p></li>
<li><p><strong>Acelerar las consultas:</strong> Utilice el índice para limitar la búsqueda a un pequeño conjunto de candidatos y, a continuación, verifique las coincidencias exactas de <code translate="no">LIKE</code> en esos candidatos.</p></li>
</ul>
<p>Un ejemplo concreto facilita la comprensión de este proceso.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Fase 1: Creación del índice</h3><p><strong>Descomponga el texto en n-gramas:</strong></p>
<p>Supongamos que indexamos el texto <strong>"Apple"</strong> con la siguiente configuración:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Con esta configuración, Milvus genera todas las subcadenas contiguas de longitud 2 y 3:</p>
<ul>
<li><p>2-gramas: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-gramas: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Construir un índice invertido:</strong></p>
<p>Consideremos ahora un pequeño conjunto de datos de cinco registros:</p>
<ul>
<li><p><strong>Documento 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Documento 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Documento 2</strong>: <code translate="no">Maple</code></p></li>
<li><p>Documento<strong>3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Documento 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Durante la ingesta, Milvus genera n-gramas para cada registro y los inserta en un índice invertido. En este índice</p>
<ul>
<li><p><strong>Las claves</strong> son n-gramas (subcadenas)</p></li>
<li><p><strong>Los valores</strong> son listas de ID de documentos en los que aparece el n-grama.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Ahora el índice está totalmente construido.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Fase 2: Acelerar las consultas</h3><p>Cuando se ejecuta un filtro <code translate="no">LIKE</code>, Milvus utiliza el índice de n-gramas para acelerar la evaluación de las consultas mediante los siguientes pasos:</p>
<p><strong>1. Extraer el término de la consulta:</strong> Las subcadenas contiguas sin comodines se extraen de la expresión <code translate="no">LIKE</code> (por ejemplo, <code translate="no">'%apple%'</code> se convierte en <code translate="no">apple</code>).</p>
<p><strong>2. 2. Descomponer el término de la consulta:</strong> El término de la consulta se descompone en n-gramas en función de su longitud (<code translate="no">L</code>) y de los configurados <code translate="no">min_gram</code> y <code translate="no">max_gram</code>.</p>
<p><strong>3.</strong> 3.<strong>Buscar cada gramo e intersecar:</strong> Milvus busca los n-gramas de la consulta en el índice invertido e interseca sus listas de ID de documentos para producir un pequeño conjunto de candidatos.</p>
<p><strong>4. 4. Verificar y devolver resultados:</strong> La condición original de <code translate="no">LIKE</code> se aplica sólo a este conjunto de candidatos para determinar el resultado final.</p>
<p>En la práctica, la forma de dividir una consulta en n-gramas depende de la forma del propio patrón. Para ver cómo funciona, nos centraremos en dos casos comunes: las coincidencias infijos y las coincidencias comodín. Las coincidencias prefijo y sufijo se comportan igual que las infijos, por lo que no las trataremos por separado.</p>
<p><strong>Coincidencia infija</strong></p>
<p>Para una coincidencia infija, la ejecución depende de la longitud de la subcadena literal (<code translate="no">L</code>) relativa a <code translate="no">min_gram</code> y <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (por ejemplo, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>La subcadena literal <code translate="no">ppl</code> cae completamente dentro del rango de n-gramas configurado. Milvus busca directamente el n-gram <code translate="no">&quot;ppl&quot;</code> en el índice invertido, produciendo los IDs de documentos candidatos <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Dado que el propio literal es un n-grama indexado, todos los candidatos satisfacen ya la condición infija. El último paso de verificación no elimina ningún registro, y el resultado sigue siendo <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (por ejemplo, <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>La subcadena literal <code translate="no">pple</code> es más larga que <code translate="no">max_gram</code>, por lo que se descompone en n-gramas superpuestos utilizando un tamaño de ventana de <code translate="no">max_gram</code>. Con <code translate="no">max_gram = 3</code>, se obtienen los n-gramas <code translate="no">&quot;ppl&quot;</code> y <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus busca cada n-grama en el índice invertido:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Al intersecar estas listas se obtiene el conjunto de candidatos <code translate="no">[0, 1, 4]</code>. A continuación, se aplica el filtro original <code translate="no">LIKE '%pple%'</code> a estos candidatos. Los tres satisfacen la condición, por lo que el resultado final sigue siendo <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (por ejemplo, <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>La subcadena literal es más corta que <code translate="no">min_gram</code> y, por tanto, no puede descomponerse en n-gramas indexados. En este caso, no se puede utilizar el índice Ngram y Milvus vuelve a la ruta de ejecución predeterminada, evaluando la condición <code translate="no">LIKE</code> mediante un escaneo completo con coincidencia de patrones.</p>
<p><strong>Coincidencia de comodines</strong> (por ejemplo, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Este patrón contiene múltiples comodines, por lo que Milvus lo divide primero en literales contiguos: <code translate="no">&quot;Ap&quot;</code> y <code translate="no">&quot;pple&quot;</code>.</p>
<p>A continuación, Milvus procesa cada literal de forma independiente:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> tiene una longitud de 2 y entra dentro del rango de n-gramas.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> es más largo que <code translate="no">max_gram</code> y se descompone en <code translate="no">&quot;ppl&quot;</code> y <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>Esto reduce la consulta a los siguientes n-gramas:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>La intersección de estas listas produce un único candidato: <code translate="no">[0]</code>.</p>
<p>Por último, se aplica el filtro original <code translate="no">LIKE '%Ap%pple%'</code> al documento 0 (<code translate="no">&quot;Apple&quot;</code>). Como no satisface el patrón completo, el conjunto de resultados final está vacío.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Limitaciones y desventajas del índice de ngramas<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque el índice de ngramas puede mejorar significativamente el rendimiento de las consultas en <code translate="no">LIKE</code>, introduce ventajas y desventajas que deben tenerse en cuenta en las implantaciones en el mundo real.</p>
<ul>
<li><strong>Mayor tamaño del índice</strong></li>
</ul>
<p>El principal coste del índice Ngram es una mayor sobrecarga de almacenamiento. Dado que el índice almacena todas las subcadenas contiguas cuya longitud esté comprendida entre <code translate="no">min_gram</code> y <code translate="no">max_gram</code>, el número de n-gramas generados crece rápidamente a medida que se amplía este rango. Cada longitud de n-grama adicional añade efectivamente otro conjunto completo de subcadenas contiguas para cada valor de texto, lo que aumenta tanto el número de claves de índice como sus listas de contabilización. En la práctica, ampliar el rango en un solo carácter puede duplicar aproximadamente el tamaño del índice en comparación con un índice invertido estándar.</p>
<ul>
<li><strong>No es eficaz para todas las cargas de trabajo</strong></li>
</ul>
<p>El índice Ngram no acelera todas las cargas de trabajo. Si los patrones de consulta son muy irregulares, contienen literales muy cortos o no consiguen reducir el conjunto de datos a un pequeño conjunto de candidatos en la fase de filtrado, las ventajas de rendimiento pueden ser limitadas. En tales casos, la ejecución de la consulta puede seguir aproximándose al coste de un escaneo completo, aunque el índice esté presente.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Evaluación del rendimiento del índice Ngram en consultas LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>El objetivo de esta prueba es evaluar la eficacia del índice Ngram para acelerar las consultas a <code translate="no">LIKE</code> en la práctica.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Metodología de la prueba</h3><p>Para poner su rendimiento en contexto, lo comparamos con dos modos de ejecución de referencia:</p>
<ul>
<li><p><strong>Maestro</strong>: Ejecución de fuerza bruta sin ningún índice.</p></li>
<li><p><strong>Maestro-invertido</strong>: Ejecución utilizando un índice invertido convencional.</p></li>
</ul>
<p>Diseñamos dos escenarios de prueba para cubrir diferentes características de los datos:</p>
<ul>
<li><p><strong>Conjunto de datos de texto Wiki</strong>: 100.000 filas, con cada campo de texto truncado a 1 KB.</p></li>
<li><p><strong>Conjunto de datos de una sola palabra</strong>: 1.000.000 de filas, en las que cada fila contiene una sola palabra.</p></li>
</ul>
<p>En ambos casos, se aplican los siguientes parámetros de forma coherente:</p>
<ul>
<li><p>Las consultas utilizan el <strong>patrón de coincidencia infijo</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>El índice Ngram se configura con <code translate="no">min_gram = 2</code> y <code translate="no">max_gram = 4</code></p></li>
<li><p>Para aislar el coste de ejecución de la consulta y evitar la sobrecarga de materialización de resultados, todas las consultas devuelven <code translate="no">count(*)</code> en lugar de conjuntos de resultados completos.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Prueba para wiki, cada línea es un texto wiki con una longitud de contenido truncada por 1000, 100K filas</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Tiempo (ms)</th><th>Aceleración</th><th>Recuento</th></tr>
</thead>
<tbody>
<tr><td>Maestro</td><td>estadio</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Maestro-invertido</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngrama</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>escuela secundaria</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Maestro-invertido</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngrama</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>es una escuela secundaria mixta patrocinada por</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Master-invertido</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngrama</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Prueba de palabras sueltas, 1M de filas</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Tiempo(ms)</th><th>Aceleración</th><th>Recuento</th></tr>
</thead>
<tbody>
<tr><td>Maestro</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Maestro-invertido</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngrama</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Master-invertido</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngrama</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Master-invertido</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngrama</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Master-invertido</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngrama</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nación</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Maestro-invertido</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngrama</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> Estos resultados se basan en pruebas comparativas realizadas en mayo. Desde entonces, la rama Master ha experimentado optimizaciones adicionales de rendimiento, por lo que se espera que la diferencia de rendimiento observada aquí sea menor en las versiones actuales.</p>
<p>Los resultados de las pruebas ponen de manifiesto un patrón claro: el índice Ngram acelera significativamente las consultas LIKE en todos los casos, y la rapidez con la que se ejecutan las consultas depende en gran medida de la estructura y la longitud de los datos de texto subyacentes.</p>
<ul>
<li><p>En el caso de <strong>los campos de texto largos</strong>, como los documentos tipo Wiki truncados a 1.000 bytes, el aumento del rendimiento es especialmente pronunciado. En comparación con la ejecución de fuerza bruta sin índice, el índice Ngram consigue aumentos de velocidad de aproximadamente <strong>100-200×</strong>. Si se compara con un índice invertido convencional, la mejora es aún más espectacular, llegando a <strong>1.200-1.900×</strong>. Esto se debe a que las consultas LIKE en textos largos son especialmente costosas para los métodos de indexación tradicionales, mientras que las búsquedas de n-gramas pueden reducir rápidamente el espacio de búsqueda a un conjunto muy pequeño de candidatos.</p></li>
<li><p>En los conjuntos de datos compuestos por <strong>entradas de una sola palabra</strong>, las ganancias son menores, pero siguen siendo sustanciales. En este caso, el índice de n-gramas es <strong>entre 80 y 100 veces</strong> más rápido que la ejecución por fuerza bruta y <strong>entre 45 y 55 veces</strong> más rápido que un índice invertido convencional. A pesar de que el escaneo de textos más cortos es intrínsecamente más barato, el enfoque basado en n-gramas evita comparaciones innecesarias y reduce sistemáticamente el coste de la consulta.</p></li>
</ul>
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
    </button></h2><p>El índice Ngram acelera las consultas en <code translate="no">LIKE</code> dividiendo el texto en n-gramas de longitud fija e indexándolos mediante una estructura invertida. Este diseño convierte las costosas comparaciones de subcadenas en eficientes búsquedas de n-gramas seguidas de una verificación mínima. De este modo, se evitan las búsquedas de texto completo y se conserva la semántica exacta de <code translate="no">LIKE</code>.</p>
<p>En la práctica, este planteamiento es eficaz en una amplia gama de cargas de trabajo, con resultados especialmente buenos en las coincidencias difusas de campos de texto largos. El índice Ngram es, por tanto, muy adecuado para escenarios en tiempo real como la búsqueda de códigos, los agentes de atención al cliente, la recuperación de documentos jurídicos y médicos, las bases de conocimiento empresarial y la búsqueda académica, donde sigue siendo esencial la coincidencia precisa de palabras clave.</p>
<p>Al mismo tiempo, el índice Ngram se beneficia de una configuración cuidadosa. La elección de los valores <code translate="no">min_gram</code> y <code translate="no">max_gram</code> es fundamental para equilibrar el tamaño del índice y el rendimiento de la consulta. Cuando se ajusta para reflejar patrones de consulta reales, el índice de ngramas ofrece una solución práctica y escalable para consultas de alto rendimiento en <code translate="no">LIKE</code> en sistemas de producción.</p>
<p>Para obtener más información sobre el índice Ngram, consulte la documentación siguiente:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Índice Ngram | Documentación de Milvus</a></li>
</ul>
<p>¿Tiene preguntas o desea profundizar en alguna característica de la última versión de Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Más información sobre las características de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Unificación del filtrado geoespacial y la búsqueda vectorial con campos geométricos y RTREE en Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introducción de AISAQ en Milvus: la búsqueda vectorial a escala de miles de millones se ha vuelto 3.200 veces más barata en memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimización de NVIDIA CAGRA en Milvus: un enfoque híbrido GPU-CPU para una indexación más rápida y consultas más baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: el arma secreta para combatir los duplicados en los datos de entrenamiento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus </a></p></li>
</ul>
