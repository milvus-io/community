---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: ¿Qué modelo utilizar?'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Compare DeepSeek V4, GPT-5.5 y Qwen3.6 en pruebas de recuperación, depuración
  y contexto largo y, a continuación, construya una canalización Milvus RAG con
  DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>Las nuevas versiones de los modelos avanzan más rápido de lo que los equipos de producción pueden evaluarlas. DeepSeek V4, GPT-5.5 y Qwen3.6-35B-A3B parecen fuertes sobre el papel, pero la cuestión más difícil para los desarrolladores de aplicaciones de IA es la práctica: ¿qué modelo se debe utilizar para los sistemas de recuperación intensiva, las tareas de codificación, el análisis de contexto largo y <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">las canalizaciones RAG</a>?</p>
<p><strong>Este artículo compara los tres modelos en pruebas prácticas:</strong> recuperación de información en vivo, depuración de concurrencia y depuración de marcadores de contexto largo. A continuación, se muestra cómo conectar DeepSeek V4 a <a href="https://zilliz.com/learn/what-is-vector-database">la base de datos vectorial Milvus</a>, de modo que el contexto recuperado proceda de una base de conocimientos en la que se pueden realizar búsquedas, en lugar de únicamente de los parámetros del modelo.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">¿Qué son DeepSeek V4, GPT-5.5 y Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 y Qwen3.6-35B-A3B son modelos de IA diferentes que se centran en distintas partes de la pila de modelos.</strong> DeepSeek V4 se centra en la inferencia de contextos largos de peso abierto. GPT-5.5 se centra en el rendimiento en la frontera, la codificación, la investigación en línea y las tareas con muchas herramientas. Qwen3.6-35B-A3B se centra en el despliegue multimodal de peso abierto con una huella de parámetros activos mucho menor.</p>
<p>La comparación es importante porque un sistema de <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">búsqueda vectorial de producción</a> rara vez depende únicamente del modelo. La capacidad del modelo, la longitud del contexto, el control del despliegue, la calidad de la recuperación y el coste del servicio afectan a la experiencia final del usuario.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: un modelo de ME de peso abierto para el control de costes de contextos largos</h3><p><strong>DeepSeek V4 es una familia de modelos MoE de peso abierto lanzada por DeepSeek el 24 de abril de 2026.</strong> La versión oficial incluye dos variantes: DeepSeek V4-Pro y DeepSeek V4-Flash. V4-Pro tiene 1,6T de parámetros totales con 49B activados por token, mientras que V4-Flash tiene 284B de parámetros totales con 13B activados por token. Ambos admiten una ventana de contexto de 1M de tokens.</p>
<p>La <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">tarjeta del modelo DeepSeek V4-Pro</a> también indica que el modelo tiene licencia MIT y está disponible a través de Hugging Face y ModelScope. Para los equipos que crean flujos de trabajo de documentos de contexto largo, el principal atractivo es el control de costes y la flexibilidad de despliegue en comparación con las API de frontera totalmente cerradas.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: un modelo de frontera alojado para codificación, investigación y uso de herramientas</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>es un modelo de frontera cerrada publicado por OpenAI el 23 de abril de 2026.</strong> OpenAI lo posiciona para codificación, investigación en línea, análisis de datos, trabajo con documentos, trabajo con hojas de cálculo, operación de software y tareas basadas en herramientas. En la documentación oficial del modelo se indica <code translate="no">gpt-5.5</code> con una ventana de contexto API de 1 millón de tokens, mientras que los límites de los productos Codex y ChatGPT pueden diferir.</p>
<p>OpenAI obtiene buenos resultados en las pruebas comparativas de codificación: 82,7% en Terminal-Bench 2.0, 73,1% en Expert-SWE y 58,6% en SWE-Bench Pro. La contrapartida es el precio: en la lista oficial de precios de la API, GPT-5.5 cuesta 5 dólares por 1 millón de tokens de entrada y 30 dólares por 1 millón de tokens de salida, antes de cualquier detalle sobre precios específicos de productos o contextos largos.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: un modelo de parámetros activos más pequeño para cargas de trabajo locales y multimodales</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>es un modelo MoE de peso abierto del equipo Qwen de Alibaba.</strong> Su ficha de modelo incluye 35.000 parámetros totales, 3.000 parámetros activados, un codificador de visión y una licencia Apache-2.0. Admite una ventana de contexto nativa de 262.144 tokens y puede ampliarse hasta 1.010.000 tokens con el escalado YaRN.</p>
<p>Esto hace que Qwen3.6-35B-A3B resulte atractivo cuando la implantación local, el servicio privado, la entrada de texto con imágenes o las cargas de trabajo en chino son más importantes que la comodidad de un modelo de frontera gestionado.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Comparación de especificaciones de modelos</h3><table>
<thead>
<tr><th>Modelo</th><th>Modelo de despliegue</th><th>Información pública de parámetros</th><th>Ventana contextual</th><th>Mejor ajuste</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>MoE de peso abierto; API disponible</td><td>1,6T total / 49B activos</td><td>1 millón de tokens</td><td>Despliegues de ingeniería de contexto largo y sensibles a los costes</td></tr>
<tr><td>GPT-5.5</td><td>Modelo cerrado alojado</td><td>Sin revelar</td><td>1 millón de tokens en la API</td><td>Codificación, investigación en vivo, uso de herramientas y mayor capacidad general</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>MoE multimodal de peso abierto</td><td>35B total / 3B activo</td><td>262K nativo; ~1M con YaRN</td><td>Despliegue local/privado, entrada multimodal y escenarios en chino</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Cómo hemos probado DeepSeek V4, GPT-5.5 y Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Estas pruebas no sustituyen a las suites de pruebas completas. Se trata de comprobaciones prácticas que reflejan preguntas habituales de los desarrolladores: ¿puede el modelo recuperar información actual, razonar sobre sutiles errores de código y localizar datos dentro de un documento muy largo?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">¿Qué modelo gestiona mejor la recuperación de información en tiempo real?</h3><p>Hicimos a cada modelo tres preguntas sensibles al tiempo utilizando la búsqueda web cuando estaba disponible. La instrucción era sencilla: devolver sólo la respuesta e incluir la URL de origen.</p>
<table>
<thead>
<tr><th>Pregunta</th><th>Respuesta esperada en el momento de la prueba</th><th>Fuente</th></tr>
</thead>
<tbody>
<tr><td>¿Cuánto cuesta generar una imagen de calidad media de 1024×1024 con <code translate="no">gpt-image-2</code> a través de la API de OpenAI?</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Precios de la generación de imágenes con OpenAI</a></td></tr>
<tr><td>¿Cuál es la canción número 1 en la lista Billboard Hot 100 de esta semana y quién es el artista?</td><td><code translate="no">Choosin' Texas</code> por Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Lista Billboard Hot 100</a></td></tr>
<tr><td>¿Quién lidera actualmente la clasificación de pilotos de F1 de 2026?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Clasificación de pilotos de Fórmula 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Nota: Estas preguntas son sensibles al tiempo. Las respuestas esperadas reflejan los resultados en el momento en que realizamos la prueba.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>La página de precios de imágenes de OpenAI utiliza la etiqueta "medio" en lugar de "estándar" para el resultado de 0,053 $ 1024×1024, por lo que la pregunta se normaliza aquí para que coincida con la redacción actual de la API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Resultados de la recuperación en tiempo real: GPT-5.5 tenía la ventaja más clara</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro respondió incorrectamente a la primera pregunta. No pudo responder a la segunda ni a la tercera pregunta a través de la búsqueda web en tiempo real en esta configuración.</p>
<p>La segunda respuesta incluía la URL correcta de Billboard, pero no recuperaba la canción número 1 del momento. La tercera respuesta utilizó la fuente incorrecta, por lo que la contamos como incorrecta.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La GPT-5.5 se desenvolvió mucho mejor en esta prueba. Sus respuestas fueron breves, precisas, con fuentes y rápidas. Cuando una tarea depende de información actual y el modelo dispone de recuperación en tiempo real, GPT-5.5 tiene una clara ventaja en esta configuración.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B produjo un resultado similar a DeepSeek V4-Pro. En esta configuración no tenía acceso directo a la web, por lo que no pudo completar la tarea de recuperación en tiempo real.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">¿Qué modelo es mejor para depurar errores de concurrencia?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>En la segunda prueba se utilizó un ejemplo de transferencia bancaria en Python con tres niveles de problemas de concurrencia. La tarea no era sólo encontrar la condición de carrera obvia, sino también explicar por qué se rompe el balance total y proporcionar código corregido.</p>
<table>
<thead>
<tr><th>Capa</th><th>Problema</th><th>Qué falla</th></tr>
</thead>
<tbody>
<tr><td>Básico</td><td>Condición de carrera</td><td><code translate="no">if self.balance &gt;= amount</code> y <code translate="no">self.balance -= amount</code> no son atómicas. Dos hilos pueden pasar la comprobación de saldo al mismo tiempo, entonces ambos restan dinero.</td></tr>
<tr><td>Medio</td><td>Riesgo de bloqueo</td><td>Un bloqueo ingenuo por cuenta puede bloquearse cuando la transferencia A→B bloquea A primero mientras que la transferencia B→A bloquea B primero. Este es el clásico bloqueo ABBA.</td></tr>
<tr><td>Avanzado</td><td>Alcance de bloqueo incorrecto</td><td>Proteger sólo <code translate="no">self.balance</code> no protege <code translate="no">target.balance</code>. Una solución correcta debe bloquear ambas cuentas en un orden estable, normalmente por ID de cuenta, o usar un bloqueo global con menor concurrencia.</td></tr>
</tbody>
</table>
<p>El mensaje y el código se muestran a continuación:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Resultados de la depuración de código: GPT-5.5 dio la respuesta más completa</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro dio un análisis conciso y fue directamente a la solución de bloqueo ordenado, que es la forma estándar de evitar el bloqueo ABBA. Su respuesta demostró la solución correcta, pero no dedicó mucho tiempo a explicar por qué la solución ingenua basada en el bloqueo podría introducir un nuevo modo de fallo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 obtuvo los mejores resultados en esta prueba. Encontró los problemas principales, anticipó el riesgo de bloqueo, explicó por qué podía fallar el código original y proporcionó una implementación corregida completa.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B identificó los errores con precisión y su secuencia de ejecución de ejemplo era clara. La parte más débil era la corrección: elegía un bloqueo global a nivel de clase, lo que hace que todas las cuentas compartan el mismo bloqueo. Esto funciona para una pequeña simulación, pero no es una buena solución para un sistema bancario real, ya que las transferencias de cuentas no relacionadas deben esperar el mismo bloqueo.</p>
<p><strong>En resumen:</strong> GPT-5.5 no sólo solucionó el fallo actual, sino que también advirtió sobre el próximo fallo que podría introducir un desarrollador. DeepSeek V4-Pro ofreció la solución no GPT más limpia. Qwen3.6 encontró los problemas y produjo un código que funcionaba, pero no llamó la atención sobre el compromiso de escalabilidad.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">¿Qué modelo gestiona mejor la recuperación de contextos largos?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Para la prueba de contexto largo, utilizamos el texto completo de <em>El sueño de la cámara</em> roja, de unos 850.000 caracteres chinos. Insertamos un marcador oculto alrededor de la posición de 500.000 caracteres:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>A continuación, cargamos el archivo en cada modelo y le pedimos que encontrara tanto el contenido del marcador como su posición.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Resultados de la recuperación de contextos largos: GPT-5.5 encontró el marcador con mayor precisión</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro encontró el marcador oculto, pero no la posición correcta del carácter. Además, proporcionó un contexto circundante erróneo. En esta prueba, pareció localizar el marcador semánticamente, pero perdió la pista de la posición exacta mientras razonaba sobre el documento.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 encontró correctamente el contenido del marcador, la posición y el contexto circundante. Informó de la posición como 500,002 e incluso distinguió entre el recuento con índice cero y el recuento con índice uno. El contexto circundante también coincidía con el texto utilizado al insertar el marcador.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B encontró correctamente el contenido del marcador y el contexto cercano, pero su estimación de posición fue errónea.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">¿Qué dicen estas pruebas sobre la selección de modelos?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Las tres pruebas apuntan a un modelo de selección práctico: <strong>GPT-5.5 es la elección de capacidad, DeepSeek V4-Pro es la elección de coste-rendimiento de contexto largo y Qwen3.6-35B-A3B es la elección de control local.</strong></p>
<table>
<thead>
<tr><th>Modelo</th><th>Mejor ajuste</th><th>Qué ocurrió en nuestras pruebas</th><th>Advertencia principal</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Mejor capacidad general</td><td>Ganó las pruebas de recuperación en vivo, depuración de concurrencia y marcador de contexto largo</td><td>Coste más elevado; más potente cuando la precisión y el uso de la herramienta justifican el sobreprecio</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Implantación de contexto largo y menor coste</td><td>Proporcionó la mejor solución no GPT para el error de concurrencia y encontró el contenido del marcador.</td><td>Necesita herramientas de recuperación externas para tareas web en vivo; el seguimiento exacto de la ubicación de caracteres fue más débil en esta prueba.</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Despliegue local, pesos abiertos, entrada multimodal, cargas de trabajo en chino.</td><td>Buen rendimiento en la identificación de errores y la comprensión de contextos largos.</td><td>La calidad de las correcciones fue menos escalable; el acceso a la web en directo no estaba disponible en esta configuración.</td></tr>
</tbody>
</table>
<p>Utilice GPT-5.5 cuando necesite los mejores resultados y el coste sea secundario. Utilice DeepSeek V4-Pro cuando necesite un contexto largo, un menor coste de servicio y un despliegue sencillo mediante API. Utilice Qwen3.6-35B-A3B cuando lo más importante sean los pesos abiertos, la implantación privada, el soporte multimodal o el control de la pila de servicios.</p>
<p>Sin embargo, para las aplicaciones de recuperación intensiva, la elección del modelo es sólo la mitad de la historia. Incluso un modelo de contexto largo sólido obtiene mejores resultados cuando el contexto se recupera, filtra y fundamenta mediante un <a href="https://zilliz.com/learn/generative-ai">sistema de búsqueda semántica</a> específico.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Por qué la GAR sigue siendo importante para los modelos de contexto largo<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Una ventana de contexto largo no elimina la necesidad de recuperación. Cambia la estrategia de recuperación.</p>
<p>En una aplicación RAG, el modelo no debe escanear todos los documentos en cada solicitud. Una <a href="https://zilliz.com/learn/introduction-to-unstructured-data">arquitectura de base de datos vectorial</a> almacena incrustaciones, busca fragmentos semánticamente relevantes, aplica filtros de metadatos y devuelve al modelo un conjunto de contextos compacto. De este modo, el modelo recibe mejores datos y se reducen los costes y la latencia.</p>
<p>Milvus encaja en este papel porque gestiona <a href="https://milvus.io/docs/schema.md">esquemas de recopilación</a>, indexación vectorial, metadatos escalares y operaciones de recuperación en un solo sistema. Puede empezar localmente con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, pasar a un <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a> autónomo, desplegar con <a href="https://milvus.io/docs/install_standalone-docker.md">instalación Docker</a> o <a href="https://milvus.io/docs/install_standalone-docker-compose.md">despliegue Docker Compose</a>, y escalar más con <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">despliegue Kubernetes</a> cuando la carga de trabajo crezca.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Cómo construir una tubería RAG con Milvus y DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>El siguiente tutorial construye una pequeña canalización RAG utilizando DeepSeek V4-Pro para la generación y Milvus para la recuperación. La misma estructura se aplica a otros LLM: crear incrustaciones, almacenarlas en una colección, buscar el contexto relevante y pasar ese contexto al modelo.</p>
<p>Para un recorrido más amplio, véase el <a href="https://milvus.io/docs/build-rag-with-milvus.md">tutorial oficial de Milvus RAG</a>. Este ejemplo mantiene el canal pequeño para que el flujo de recuperación sea fácil de inspeccionar.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Preparar el entorno<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Instale las dependencias</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Si está utilizando Google Colab, es posible que tenga que reiniciar el tiempo de ejecución después de instalar las dependencias. Haga clic en el menú <strong>Runtime</strong> y seleccione <strong>Reiniciar sesión</strong>.</p>
<p>DeepSeek V4-Pro soporta una API estilo OpenAI. Inicie sesión en el sitio web oficial de DeepSeek y establezca <code translate="no">DEEPSEEK_API_KEY</code> como variable de entorno.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Preparar el conjunto de datos de documentación de Milvus</h3><p>Utilizamos las páginas FAQ del <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">archivo de documentación de Milvus 2.4.x</a> como fuente privada de conocimiento. Se trata de un sencillo conjunto de datos inicial para una pequeña demostración RAG.</p>
<p>En primer lugar, descargue el archivo ZIP y extraiga la documentación en la carpeta <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Cargamos todos los archivos Markdown de la carpeta <code translate="no">milvus_docs/en/faq</code>. Para cada documento, dividimos el contenido del archivo por <code translate="no">#</code>, que separa aproximadamente las principales secciones Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Configuración de DeepSeek V4 y el modelo de incrustación</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, elija un modelo de incrustación. Este ejemplo utiliza <code translate="no">DefaultEmbeddingFunction</code> del módulo de modelos PyMilvus. Consulte la documentación de Milvus para obtener más información sobre <a href="https://milvus.io/docs/embeddings.md">las funciones de incrustación</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Genere un vector de prueba e imprima la dimensión del vector y los primeros elementos. La dimensión devuelta se utiliza al crear la colección Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Cargar datos en Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Crear una colección Milvus</h3><p>Una colección Milvus almacena campos vectoriales, campos escalares y metadatos dinámicos opcionales. La configuración rápida que se muestra a continuación utiliza la API de alto nivel <code translate="no">MilvusClient</code>; para los esquemas de producción, revise los documentos sobre <a href="https://milvus.io/docs/manage-collections.md">gestión de colecciones</a> y <a href="https://milvus.io/docs/create-collection.md">creación de colecciones</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Algunas notas sobre <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Configurar <code translate="no">uri</code> en un archivo local, como <code translate="no">./milvus.db</code>, es la opción más sencilla porque utiliza automáticamente <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> y almacena todos los datos en ese archivo.</li>
<li>Si tiene un conjunto de datos grande, puede configurar un servidor Milvus de mayor rendimiento en <a href="https://milvus.io/docs/quickstart.md">Docker o Kubernetes</a>. En esa configuración, utilice el URI del servidor, como <code translate="no">http://localhost:19530</code>, como su <code translate="no">uri</code>.</li>
<li>Si desea utilizar <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, el servicio en la nube totalmente gestionado para Milvus, configure <code translate="no">uri</code> y <code translate="no">token</code> con el <a href="https://docs.zilliz.com/docs/connect-to-cluster">punto final público y la clave API</a> de Zilliz Cloud.</li>
</ul>
<p>Compruebe si la colección ya existe. Si es así, elimínela.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Cree una nueva colección con los parámetros especificados. Si no especificamos información de campo, Milvus crea automáticamente un campo <code translate="no">id</code> por defecto como clave primaria y un campo vectorial para almacenar datos vectoriales. Un campo JSON reservado almacena datos escalares que no están definidos en el esquema.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>La métrica <code translate="no">IP</code> significa similitud de producto interno. Milvus también admite otros tipos de métricas y elecciones de índices dependiendo del tipo de vector y de la carga de trabajo; véanse las guías sobre <a href="https://milvus.io/docs/id/metric.md">tipos de métricas</a> y <a href="https://milvus.io/docs/index_selection.md">selección de índices</a>. El ajuste <code translate="no">Strong</code> es uno de los <a href="https://milvus.io/docs/consistency.md">niveles de coherencia</a> disponibles.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Insertar los documentos incrustados</h3><p>Itere a través de los datos de texto, cree incrustaciones e inserte los datos en Milvus. Aquí, añadimos un nuevo campo llamado <code translate="no">text</code>. Como no está definido explícitamente en el esquema de la colección, se añade automáticamente al campo JSON dinámico reservado. Para metadatos de producción, revise <a href="https://milvus.io/docs/enable-dynamic-field.md">la compatibilidad con campos dinámicos</a> y la <a href="https://milvus.io/docs/json-field-overview.md">descripción general de campos JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Para conjuntos de datos más grandes, el mismo patrón puede ampliarse con un diseño de esquema explícito, índices de <a href="https://milvus.io/docs/index-vector-fields.md">campo vectoriales</a>, índices escalares y operaciones de ciclo de vida de datos como <a href="https://milvus.io/docs/insert-update-delete.md">inserción, inserción ascendente y eliminación</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Construir el flujo de recuperación RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Buscar en Milvus el contexto relevante</h3><p>Definamos una pregunta común sobre Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Busquemos la pregunta en la colección y recuperemos las tres primeras coincidencias semánticas. Se trata de una <a href="https://milvus.io/docs/single-vector-search.md">búsqueda</a> básica <a href="https://milvus.io/docs/single-vector-search.md">de un solo vector</a>. En producción, puede combinarla con la <a href="https://milvus.io/docs/filtered-search.md">búsqueda filtrada</a>, la <a href="https://milvus.io/docs/full-text-search.md">búsqueda de texto completo</a>, <a href="https://milvus.io/docs/multi-vector-search.md">la búsqueda híbrida multivectorial</a> y las <a href="https://milvus.io/docs/reranking.md">estrategias de reordenación</a> para mejorar la relevancia.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Veamos ahora los resultados de la consulta.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Generar una respuesta RAG con DeepSeek V4</h3><p>Convertir los documentos recuperados en formato de cadena.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Definir las instrucciones del sistema y del usuario para el LLM. Este prompt se ensambla a partir de los documentos recuperados de Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Utilizar el modelo proporcionado por DeepSeek V4-Pro para generar una respuesta basada en la pregunta.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>En este punto, el proceso ha completado el bucle central de RAG: incrustar documentos, almacenar vectores en Milvus, buscar el contexto relevante y generar una respuesta con DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">¿Qué debería mejorar antes de la producción?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La demostración utiliza la simple división de secciones y la recuperación top-k. Eso es suficiente para mostrar la mecánica, pero la producción RAG por lo general necesita más control de recuperación.</p>
<table>
<thead>
<tr><th>Necesidad de producción</th><th>Características de Milvus a tener en cuenta</th><th>Por qué es útil</th></tr>
</thead>
<tbody>
<tr><td>Mezcla de señales semánticas y de palabras clave</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Búsqueda híbrida con Milvus</a></td><td>Combina la búsqueda vectorial densa con señales dispersas o de texto completo</td></tr>
<tr><td>Fusiona resultados de múltiples recuperadores</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Recuperador de búsqueda híbrida Milvus</a></td><td>Permite que los flujos de trabajo de LangChain utilicen una clasificación ponderada o de estilo RRF.</td></tr>
<tr><td>Restricción de resultados por inquilino, marca de tiempo o tipo de documento</td><td>Metadatos y filtros escalares</td><td>Mantiene el alcance de la recuperación en la porción de datos correcta</td></tr>
<tr><td>Pasar de Milvus autogestionado a un servicio gestionado</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migración de Milvus a Zilliz</a></td><td>Reduce el trabajo de infraestructura manteniendo la compatibilidad con Milvus</td></tr>
<tr><td>Conecte aplicaciones alojadas de forma segura</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Claves API de Zilliz Cloud</a></td><td>Proporciona control de acceso basado en tokens para clientes de aplicaciones</td></tr>
</tbody>
</table>
<p>El hábito de producción más importante es evaluar la recuperación por separado de la generación. Si el contexto recuperado es débil, cambiar el LLM a menudo oculta el problema en lugar de resolverlo.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Empezar con Milvus y DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Si desea reproducir el tutorial, comience con la <a href="https://milvus.io/docs">documentación</a> oficial <a href="https://milvus.io/docs">de Milvus</a> y la <a href="https://milvus.io/docs/build-rag-with-milvus.md">guía Build RAG with Milvus</a>. Para una configuración gestionada, <a href="https://docs.zilliz.com/docs/connect-to-cluster">conéctese a Zilliz Cloud</a> con su punto final de clúster y clave API en lugar de ejecutar Milvus localmente.</p>
<p>Si desea ayuda para ajustar la fragmentación, la indexación, los filtros o la recuperación híbrida, únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> o reserve una <a href="https://milvus.io/office-hours">sesión</a> gratuita <a href="https://milvus.io/office-hours">de Milvus Office Hours</a>. Si prefiere omitir la configuración de la infraestructura, utilice <a href="https://cloud.zilliz.com/login">el inicio de sesión de Zilliz</a> <a href="https://cloud.zilliz.com/signup">Cloud</a> o cree una <a href="https://cloud.zilliz.com/signup">cuenta de Zilliz Cloud</a> para ejecutar Milvus administrado.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Preguntas de los desarrolladores sobre DeepSeek V4, Milvus y RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">¿Es DeepSeek V4 bueno para RAG?</h3><p>DeepSeek V4-Pro se adapta perfectamente a RAG cuando se necesita un procesamiento de contexto largo y un coste de servicio inferior al de los modelos cerrados premium. Sigue necesitando una capa de recuperación como Milvus para seleccionar los fragmentos relevantes, aplicar filtros de metadatos y mantener la consulta centrada.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">¿Debo utilizar GPT-5.5 o DeepSeek V4 para una canalización RAG?</h3><p>Utilice GPT-5.5 cuando la calidad de la respuesta, el uso de herramientas y la investigación en directo sean más importantes que el coste. Utilice DeepSeek V4-Pro cuando el procesamiento de contextos largos y el control de costes sean más importantes, especialmente si su capa de recuperación ya proporciona un contexto fundamentado de alta calidad.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">¿Puedo ejecutar Qwen3.6-35B-A3B localmente para RAG privado?</h3><p>Sí, Qwen3.6-35B-A3B es de peso abierto y está diseñado para un despliegue más controlable. Es un buen candidato cuando la privacidad, el servicio local, la entrada multimodal o el rendimiento en idioma chino son importantes, pero aún debe validar la latencia, la memoria y la calidad de recuperación para su hardware.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">¿Los modelos de contexto largo hacen innecesarias las bases de datos vectoriales?</h3><p>No. Los modelos de contexto largo pueden leer más texto, pero siguen beneficiándose de la recuperación. Una base de datos vectorial limita la entrada a los fragmentos relevantes, admite el filtrado de metadatos, reduce el coste de los tokens y facilita la actualización de la aplicación a medida que cambian los documentos.</p>
