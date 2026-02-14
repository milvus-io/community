---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: ¿Qué modelo se adapta a su
  pila de agentes de IA?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Comparación práctica de GLM-5, MiniMax M2.5 y Gemini 3 Deep Think para
  codificación, razonamiento y agentes de IA. Incluye un tutorial de RAG con
  Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>En poco más de dos días, se han lanzado tres grandes modelos consecutivos: GLM-5, MiniMax M2.5 y Gemini 3 Deep Think. Los tres encabezan las mismas capacidades: <strong>codificación, razonamiento profundo y flujos de trabajo agénticos.</strong> Los tres presumen de resultados de vanguardia. Si se miran con lupa las hojas de especificaciones, casi se podría jugar a emparejarlas y eliminar puntos de discusión idénticos en las tres.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¿Y lo que más miedo da? Probablemente tu jefe ya ha visto los anuncios y está deseando que crees nueve aplicaciones internas con los tres modelos antes de que acabe la semana.</p>
<p>Entonces, ¿qué diferencia realmente a estos modelos? ¿Cómo elegir entre ellos? Y (como siempre) ¿cómo conectarlos con <a href="https://milvus.io/">Milvus</a> para crear una base de conocimientos interna? Marque esta página. Tiene todo lo que necesita.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 y Gemini 3 Deep Think de un vistazo<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 lidera la ingeniería de sistemas complejos y las tareas de agentes de largo horizonte</h3><p>El 12 de febrero, Zhipu lanzó oficialmente GLM-5, que destaca en ingeniería de sistemas complejos y flujos de trabajo de agentes de larga duración.</p>
<p>El modelo tiene 355B-744B parámetros (40B activos), entrenados en 28,5T tokens. Integra mecanismos de atención dispersa con un marco de aprendizaje por refuerzo asíncrono llamado Slime, lo que le permite manejar contextos ultralargos sin pérdida de calidad y manteniendo bajos los costes de despliegue.</p>
<p>GLM-5 lideró la clasificación de código abierto en las pruebas de rendimiento más importantes, ocupando el primer puesto en SWE-bench Verified (77,8) y en Terminal Bench 2.0 (56,2), por delante de MiniMax 2.5 y Gemini 3 Deep Think. Dicho esto, sus puntuaciones siguen estando por detrás de los mejores modelos de código cerrado, como Claude Opus 4.5 y GPT-5.2. En Vending Bench 2, una evaluación de simulación empresarial, GLM-5 generó 4.432 dólares de beneficio anual simulado, lo que lo sitúa aproximadamente en el mismo rango que los sistemas de código cerrado.</p>
<p>GLM-5 también ha introducido mejoras significativas en sus capacidades de ingeniería de sistemas y de agentes de largo horizonte. Ahora puede convertir texto o materias primas directamente en archivos .docx, .pdf y .xlsx, y generar entregables específicos como documentos de requisitos de productos, planes de clases, exámenes, hojas de cálculo, informes financieros, diagramas de flujo y menús.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think establece un nuevo listón para el razonamiento científico</h3><p>En las primeras horas del 13 de febrero de 2026, Google lanzó oficialmente Gemini 3 Deep Think, una importante actualización que llamaré (provisionalmente) el modelo de investigación y razonamiento más potente del planeta. Después de todo, Gemini fue el único modelo que superó la prueba del túnel de lavado: "<em>Quiero lavar mi coche y el túnel de lavado está a sólo 50 metros.</em> ¿Debo<em>arrancar el coche y conducir hasta allí o simplemente caminar</em>?".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Su punto fuerte es el razonamiento de alto nivel y su rendimiento en competición: alcanzó 3455 Elo en Codeforces, equivalente al octavo mejor programador competitivo del mundo. También alcanzó la medalla de oro en las pruebas escritas de las Olimpiadas Internacionales de Física, Química y Matemáticas de 2025. La rentabilidad es otro gran avance. ARC-AGI-1 cuesta tan solo 7,17 dólares por tarea, lo que supone una reducción de 280 a 420 veces en comparación con el programa o3-preview de OpenAI de 14 meses antes. En cuanto a la aplicación, los mayores avances de Deep Think están en la investigación científica. Los expertos ya lo utilizan para la revisión por pares de artículos profesionales de matemáticas y para optimizar flujos de trabajo complejos de preparación del crecimiento de cristales.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 compite en coste y velocidad para cargas de trabajo de producción</h3><p>El mismo día, MiniMax lanzó M2.5, posicionándolo como el campeón en coste y eficiencia para casos de uso de producción.</p>
<p>M2.5, una de las familias de modelos de más rápida iteración del sector, establece nuevos resultados SOTA en codificación, llamada a herramientas, búsqueda y productividad ofimática. El coste es su principal argumento de venta: la versión rápida funciona a unos 100 TPS, con un precio de entrada de 0, <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">30 millones de to</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>kens y un precio de salida de</mn><mi>0</mi></mrow><annotation encoding="application/x-tex">,30 por</annotation></semantics></math></span></span>millón de tokens <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">, y un precio de salida de</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 millones de tokens y un precio de salida de</span><span class="mord mathnormal">2</span></span></span></span>,40 por millón de tokens. La versión de 50 TPS reduce el coste de producción a la mitad. La velocidad ha mejorado un 37% con respecto a la anterior M2.1, y completa las tareas verificadas del SWE-bench en una media de 22,8 minutos, aproximadamente igual que Claude Opus 4.6. En cuanto a las capacidades, M2.5 es compatible con el desarrollo full-stack en más de 10 lenguajes, incluidos Go, Rust y Kotlin, abarcando desde el diseño de sistemas cero a uno hasta la revisión completa del código. Para los flujos de trabajo ofimáticos, su función Office Skills se integra profundamente con Word, PPT y Excel. Cuando se combina con conocimientos en finanzas y derecho, puede generar informes de investigación y modelos financieros listos para su uso directo.</p>
<p>Este es el resumen de alto nivel. A continuación, veamos su rendimiento real en pruebas prácticas.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Comparaciones prácticas<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Renderizado de escenas 3D: Gemini 3 Deep Think produce los resultados más realistas</h3><p>Tomamos una sugerencia que los usuarios ya habían probado en Gemini 3 Deep Think y la ejecutamos en GLM-5 y MiniMax M2.5 para realizar una comparación directa. El objetivo: crear una escena Three.js completa en un único archivo HTML que reproduzca una habitación interior en 3D indistinguible de un óleo clásico en un museo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Deep Think</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep</strong> Think obtuvo el mejor resultado. Interpretó con precisión el mensaje y generó una escena 3D de alta calidad. La iluminación fue lo más destacado: la dirección y el decaimiento de las sombras parecían naturales, transmitiendo claramente la relación espacial de la luz natural que entra por una ventana. Los detalles finos también fueron impresionantes, como la textura medio derretida de las velas y la calidad del material de los sellos de cera roja. La fidelidad visual general fue alta.</p>
<p><strong>GLM-5</strong> realizó un modelado de objetos y un trabajo de texturas detallados, pero su sistema de iluminación presentaba problemas notables. Las sombras de las mesas se representaban como bloques duros de color negro puro sin transiciones suaves. El sello de cera parecía flotar sobre la superficie de la mesa, por lo que no se gestionaba correctamente la relación de contacto entre los objetos y el tablero. Estos artefactos apuntan a un margen de mejora en la iluminación global y el razonamiento espacial.</p>
<p><strong>MiniMax M2.5</strong> no pudo analizar eficazmente la compleja descripción de la escena. El resultado fue un movimiento desordenado de partículas, lo que indica limitaciones significativas tanto en la comprensión como en la generación a la hora de manejar instrucciones semánticas multicapa con requisitos visuales precisos.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Generación de SVG: los tres modelos lo gestionan de forma diferente</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pregunta:</strong> Genere un SVG de un pelícano pardo de California montando en bicicleta. La bicicleta debe tener radios y un cuadro con la forma correcta. El pelícano debe tener su característica bolsa grande, y debe haber una clara indicación de plumas. El pelícano debe estar claramente pedaleando la bicicleta. La imagen debe mostrar el plumaje completo de reproducción del pelícano pardo de California.</p>
<p><strong>Gemini 3 Deep Think</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemini 3 Deep Think</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep</strong> Think produjo el SVG más completo en general. La postura de pilotaje del pelícano es precisa: su centro de gravedad se asienta de forma natural sobre el asiento y sus pies descansan sobre los pedales en una pose ciclista dinámica. La textura del plumaje es detallada y por capas. El único punto débil es que la característica bolsa de la garganta del pelícano está dibujada demasiado grande, lo que altera ligeramente las proporciones generales.</p>
<p><strong>GLM-5</strong> tiene problemas de postura. Los pies están colocados correctamente en los pedales, pero la posición general del asiento se aleja de la postura natural de pilotaje, y la relación entre el cuerpo y el asiento no es la adecuada. Dicho esto, el trabajo de detalle es sólido: la bolsa de la garganta está bien proporcionada y la calidad de la textura del plumaje es respetable.</p>
<p><strong>MiniMax M2.5</strong> optó por un estilo minimalista y omitió por completo los elementos de fondo. La posición del pelícano en la bicicleta es más o menos correcta, pero el trabajo de detalle se queda corto. El manillar tiene una forma incorrecta, la textura de la pluma es casi inexistente, el cuello es demasiado grueso y hay artefactos ovalados blancos en la imagen que no deberían estar ahí.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Cómo elegir entre GLM-5, MiniMax M2.5 y Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>En todas nuestras pruebas, MiniMax M2.5 fue el más lento en generar resultados y el que más tiempo necesitó para pensar y razonar. GLM-5 tuvo un rendimiento constante y fue aproximadamente igual de rápido que Gemini 3 Deep Think.</p>
<p>He aquí una guía rápida de selección que hemos elaborado:</p>
<table>
<thead>
<tr><th>Caso de uso principal</th><th>Modelo recomendado</th><th>Puntos fuertes</th></tr>
</thead>
<tbody>
<tr><td>Investigación científica, razonamiento avanzado (física, química, matemáticas, diseño de algoritmos complejos)</td><td>Gemini 3 Deep Think</td><td>Medalla de oro en competiciones académicas. Verificación de datos científicos de primer nivel. Programación competitiva de categoría mundial en Codeforces. Aplicaciones de investigación probadas, incluida la identificación de fallos lógicos en documentos profesionales. (Actualmente limitado a suscriptores de Google AI Ultra y usuarios empresariales seleccionados; el coste por tarea es relativamente alto).</td></tr>
<tr><td>Implementación de código abierto, personalización de intranet empresarial, desarrollo full-stack, integración de habilidades ofimáticas.</td><td>GLM-5 de Zhipu</td><td>Modelo de código abierto de primera categoría. Gran capacidad de ingeniería de sistemas. Soporta el despliegue local con costes manejables.</td></tr>
<tr><td>Cargas de trabajo sensibles a los costes, programación multilingüe, desarrollo multiplataforma (Web/Android/iOS/Windows), compatibilidad ofimática.</td><td>MiniMax M2.5</td><td>A 100 TPS: 0 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn><mi>30</mi></mrow></semantics></math></span></span>por millón de tokens de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">entrada,</annotation></semantics></math></span></span>0,30 por millón de tokens de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">entrada,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30</span><span class="mord">por millón de tokens de entrada</span><span class="mpunct">,</span></span></span></span>2,40 por millón de tokens de salida. SOTA en las pruebas de oficina, codificación y llamada de herramientas. Primer puesto en el Multi-SWE-Bench. Gran generalización. Los porcentajes de aprobados en Droid/OpenCode superan a los de Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Tutorial RAG: Conexión de GLM-5 con Milvus para una base de conocimientos<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Tanto GLM-5 como MiniMax M2.5 están disponibles a través de <a href="https://openrouter.ai/">OpenRouter</a>. Regístrate y crea un <code translate="no">OPENROUTER_API_KEY</code> para empezar.</p>
<p>Este tutorial utiliza el GLM-5 de Zhipu como LLM de ejemplo. Para utilizar MiniMax en su lugar, simplemente cambia el nombre del modelo a <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Dependencias y configuración del entorno</h3><p>Instala o actualiza pymilvus, openai, requests y tqdm a sus últimas versiones:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Este tutorial utiliza GLM-5 como LLM y text-embedding-3-small de OpenAI como modelo de incrustación.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Preparación de los datos</h3><p>Utilizaremos las páginas FAQ de la documentación de Milvus 2.4.x como nuestra base de conocimiento privada.</p>
<p>Descargue el archivo zip y extraiga los documentos en una carpeta <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Cargue todos los archivos Markdown desde <code translate="no">milvus_docs/en/faq</code>. Dividimos cada archivo en <code translate="no">&quot;# &quot;</code> para separar aproximadamente el contenido por secciones principales:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM y configuración del modelo de incrustación</h3><p>Utilizaremos GLM-5 como LLM y text-embedding-3-small como modelo de incrustación:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Genera una incrustación de prueba e imprime sus dimensiones y sus primeros elementos:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Cargar los datos en Milvus</h3><p><strong>Crear una colección:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Una nota sobre la configuración de MilvusClient:</p>
<ul>
<li><p>Establecer el URI a un archivo local (por ejemplo, <code translate="no">./milvus.db</code>) es la opción más sencilla. Automáticamente utiliza Milvus Lite para almacenar todos los datos en ese archivo.</p></li>
<li><p>Para datos a gran escala, puede implementar un servidor Milvus de mayor rendimiento en Docker o Kubernetes. En ese caso, utiliza el URI del servidor (por ejemplo, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Para utilizar Zilliz Cloud (la versión en la nube totalmente gestionada de Milvus), establece el URI y el token en el Public Endpoint y la clave API desde tu consola de Zilliz Cloud.</p></li>
</ul>
<p>Compruebe si la colección ya existe y elimínela en caso afirmativo:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Cree una nueva colección con los parámetros especificados. Si no proporciona definiciones de campo, Milvus crea automáticamente un campo <code translate="no">id</code> por defecto como clave principal y un campo <code translate="no">vector</code> para datos vectoriales. Un campo JSON reservado almacena los campos y valores no definidos en el esquema:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Insertar datos</h3><p>Iterar a través de las líneas de texto, generar incrustaciones e insertar los datos en Milvus. El campo <code translate="no">text</code> no está definido en el esquema. Se añade automáticamente como campo dinámico respaldado por el campo JSON reservado de Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Construir el canal RAG</h3><p><strong>Recuperar documentos relevantes:</strong></p>
<p>Hagamos una pregunta común sobre Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Buscar en la colección los 3 resultados más relevantes:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Los resultados se ordenan por distancia, el más cercano primero:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Generar una respuesta con el LLM:</strong></p>
<p>Combinar los documentos recuperados en una cadena de contexto:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Configurar el sistema y los avisos al usuario. La pregunta al usuario se construye a partir de los documentos recuperados de Milvus:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
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
<p>Llamar a GLM-5 para generar la respuesta final:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 devuelve una respuesta bien estructurada:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Conclusión: Elija el modelo y construya la cadena<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Los tres modelos son potentes, pero lo son en cosas diferentes. Gemini 3 Deep Think es la mejor elección cuando la profundidad del razonamiento es más importante que el coste. GLM-5 es la mejor opción de código abierto para los equipos que necesitan un despliegue local e ingeniería a nivel de sistema. MiniMax M2.5 tiene sentido cuando se optimiza el rendimiento y el presupuesto de las cargas de trabajo de producción.</p>
<p>El modelo que elija es sólo la mitad de la ecuación. Para convertir cualquiera de ellos en una aplicación útil, necesita una capa de recuperación que pueda escalar con sus datos. Ahí es donde encaja Milvus. El tutorial RAG anterior funciona con cualquier modelo compatible con OpenAI, por lo que cambiar entre GLM-5, MiniMax M2.5, o cualquier versión futura requiere un solo cambio de línea.</p>
<p>Si está diseñando agentes de IA locales u on-prem y desea discutir la arquitectura de almacenamiento, el diseño de sesiones o la reversión segura con más detalle, no dude en unirse a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a>. También puede reservar una sesión individual de 20 minutos a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para obtener orientación personalizada.</p>
<p>Si desea profundizar en la creación de agentes de IA, aquí tiene más recursos que le ayudarán a empezar.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Cómo crear sistemas multiagente listos para la producción con Agno y Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Cómo elegir el modelo de incrustación adecuado para su canalización RAG</a></p></li>
<li><p><a href="https://zilliz.com/learn">Cómo crear un agente de IA con Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de IA de código abierto</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial de OpenClaw: Conectarse a Slack para un Asistente de IA Local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construir agentes de IA estilo Clawdbot con LangGraph y Milvus</a></p></li>
</ul>
