---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  Revisión de GPT-5: Aumento de la precisión, reducción de precios, código
  potente, pero mala para la creatividad
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  Para los desarrolladores, especialmente los que crean agentes y canalizaciones
  RAG, esta versión puede ser la actualización más útil hasta la fecha.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Después de meses de especulación, OpenAI ha lanzado finalmente</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> El modelo no es el relámpago creativo que fue GPT-4, pero para los desarrolladores, especialmente aquellos que construyen agentes y tuberías RAG, esta versión puede ser tranquilamente la actualización más útil hasta la fecha.</p>
<p><strong>TL;DR para desarrolladores:</strong> GPT-5 unifica arquitecturas, potencia la E/S multimodal, reduce drásticamente las tasas de error factual, amplía el contexto a 400.000 tokens y hace asequible el uso a gran escala. Sin embargo, la creatividad y el estilo literario han dado un notable paso atrás.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">¿Qué hay de nuevo bajo el capó?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Núcleo unificado</strong> - Fusiona las series digitales GPT con los modelos de razonamiento de las series o, ofreciendo razonamiento de cadena larga más multimodal en una única arquitectura.</p></li>
<li><p>Multimodal<strong>de espectro completo</strong>: entrada/salida de texto, imagen, audio y vídeo, todo en el mismo modelo.</p></li>
<li><p><strong>Aumento masivo de la precisión</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% menos de errores factuales frente a GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% menos de errores factuales en comparación con o3.</p></li>
</ul></li>
<li><p>Aumento<strong>de las habilidades de dominio</strong>: más fuerte en generación de código, razonamiento matemático, consulta de salud y escritura estructurada; las alucinaciones se redujeron significativamente.</p></li>
</ul>
<p>Junto con GPT-5, OpenAI también lanzó <strong>tres variantes</strong> adicionales, cada una optimizada para diferentes necesidades:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Modelo</strong></th><th><strong>Descripción</strong></th><th><strong>Entrada / $ por 1M de tokens</strong></th><th><strong>Salida / $ por 1M de tokens</strong></th><th><strong>Actualización de conocimientos</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Modelo principal, razonamiento de cadena larga + multimodal completo</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Equivalente a gpt-5, utilizado en las conversaciones ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% más barato, conserva ~90% del rendimiento de programación</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/offline, contexto 32K, latencia &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 batió récords en 25 categorías de pruebas comparativas -desde reparación de código hasta razonamiento multimodal y tareas médicas- con mejoras constantes de la precisión.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Por qué debería interesar a los desarrolladores, especialmente para RAG y agentes<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestras pruebas prácticas sugieren que esta versión es una revolución silenciosa para la generación mejorada de recuperaciones y los flujos de trabajo basados en agentes.</p>
<ol>
<li><p><strong>Los recortes de precios</strong> hacen viable la experimentación - Coste de entrada de la API: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,</mn><mi>25permilliontokens</mi><mo separator="true">∗∗;</mo><mi>outputcost</mi><mo>:∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 por millón de tokens**; output cost: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">1.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mpunct"> ∗;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span>:<span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Una ventana de contexto de 400k</strong> (frente a 128k en o3/4o) permite mantener el estado a través de complejos flujos de trabajo de agentes multipaso sin trocear el contexto.</p></li>
<li><p><strong>Menos alucinaciones y mejor uso de las herramientas</strong>: admite llamadas a herramientas encadenadas de varios pasos, gestiona tareas complejas no estándar y mejora la fiabilidad de la ejecución.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">No sin defectos<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesar de sus avances técnicos, GPT-5 sigue mostrando claros límites.</p>
<p>En la presentación, OpenAI mostró una diapositiva en la que se calculaba de forma extraña <em>52,8 &gt; 69,1 = 30,8</em>, y en nuestras propias pruebas, el modelo repitió con confianza la explicación errónea del "efecto Bernoulli" para el despegue de un avión, lo que nos recuerda <strong>que sigue siendo un aprendiz de patrones, no un verdadero experto en la materia.</strong></p>
<p><strong>Aunque el rendimiento en STEM ha mejorado, la profundidad creativa ha disminuido.</strong> Muchos usuarios veteranos han notado un declive en el talento literario: la poesía parece más plana, las conversaciones filosóficas menos matizadas y las narraciones largas más mecánicas. La contrapartida es clara: mayor precisión en los hechos y razonamiento más sólido en ámbitos técnicos, pero a expensas del tono artístico y exploratorio que antaño hacía que GPT pareciera casi humano.</p>
<p>Teniendo esto en cuenta, veamos cómo se comporta GPT-5 en nuestras pruebas prácticas.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Pruebas de codificación<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Empecé con una tarea sencilla: escribir un script HTML que permitiera a los usuarios cargar una imagen y moverla con el ratón. GPT-5 se detuvo durante unos nueve segundos y, a continuación, generó un código funcional que gestionaba bien la interacción. Parecía un buen comienzo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La segunda tarea era más difícil: implementar la detección de colisiones entre polígonos y bolas dentro de un hexágono giratorio, con velocidad de rotación, elasticidad y número de bolas ajustables. GPT-5 generó la primera versión en unos trece segundos. El código incluía todas las características esperadas, pero tenía errores y no se ejecutaba.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Entonces utilicé la opción <strong>Fix bug</strong> del editor, y GPT-5 corrigió los errores para que el hexágono se renderizara. Sin embargo, las bolas nunca aparecieron - la lógica de spawn faltaba o era incorrecta, lo que significa que la función principal del programa estaba ausente a pesar de la configuración completa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>En resumen,</strong> GPT-5 puede producir código interactivo limpio y bien estructurado y recuperarse de errores de ejecución sencillos. Pero en escenarios complejos, aún corre el riesgo de omitir la lógica esencial, por lo que la revisión humana y la iteración son necesarias antes del despliegue.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Prueba de razonamiento<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Planteé un rompecabezas lógico de varios pasos que incluía colores de artículos, precios y pistas de posición, algo que a la mayoría de los humanos les llevaría varios minutos resolver.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pregunta:</strong> <em>¿Cuál es el artículo azul y cuál es su precio?</em></p>
<p>GPT-5 dio la respuesta correcta en sólo 9 segundos, con una explicación clara y lógica. Esta prueba reforzó la fuerza del modelo en el razonamiento estructurado y la deducción rápida.</p>
<h2 id="Writing-Test" class="common-anchor-header">Prueba de escritura<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>A menudo recurro a ChatGPT para que me ayude con blogs, publicaciones en redes sociales y otros contenidos escritos, por lo que la generación de texto es una de las capacidades que más me importan. Para esta prueba, le pedí a GPT-5 que creara un post en LinkedIn basado en un blog sobre el analizador multilingüe de Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El resultado estaba bien organizado y contenía todos los puntos clave del blog original, pero parecía demasiado formal y predecible, más parecido a un comunicado de prensa corporativo que a algo destinado a despertar el interés en las redes sociales. Le faltaba la calidez, el ritmo y la personalidad que hacen que un post resulte humano y atractivo.</p>
<p>Por otro lado, las ilustraciones que lo acompañaban eran excelentes: claras, acordes con la marca y en perfecta consonancia con el estilo tecnológico de Zilliz. Visualmente, era perfecto; la redacción sólo necesita un poco más de energía creativa para estar a la altura.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">¿Una ventana de contexto más larga = la muerte de RAG y VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Abordamos este tema el año pasado cuando <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google lanzó <strong>Gemini 1.5 Pro</strong></a> con su ventana de contexto ultralarga de 10 millones de tokens. En aquel momento, algunos se apresuraron a predecir el fin de RAG e incluso el fin de las bases de datos. Hoy en día, la RAG no sólo sigue viva, sino que prospera. En la práctica, se ha vuelto <em>más</em> capaz y productiva, junto con bases de datos vectoriales como <a href="https://milvus.io/"><strong>Milvus</strong></a> y <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Ahora, con la ampliación de la longitud de contexto de GPT-5 y las funciones más avanzadas de llamada a herramientas, ha vuelto a surgir la pregunta: <em>¿Seguimos necesitando bases de datos vectoriales para la ingesta de contexto, o incluso agentes dedicados / pipelines RAG?</em></p>
<p><strong>La respuesta corta es: absolutamente sí. Seguimos necesitándolos.</strong></p>
<p>El contexto más largo es útil, pero no sustituye a la recuperación estructurada. Los sistemas multiagente siguen siendo una tendencia arquitectónica a largo plazo, y estos sistemas a menudo necesitan un contexto prácticamente ilimitado. Además, cuando se trata de gestionar datos privados no estructurados de forma segura, una base de datos vectorial siempre será el último guardián.</p>
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
    </button></h2><p>Tras asistir al evento de presentación de OpenAI y realizar mis propias pruebas prácticas, GPT-5 no parece tanto un espectacular salto adelante como una refinada mezcla de los puntos fuertes del pasado con algunas mejoras bien situadas. Esto no es malo, sino una señal de los límites arquitectónicos y de calidad de los datos que empiezan a encontrar los grandes modelos.</p>
<p>Como dice el refrán, <em>las críticas severas proceden de las grandes expectativas</em>. Cualquier decepción en torno a GPT-5 se debe sobre todo al listón tan alto que OpenAI se ha puesto a sí misma. Y lo cierto es que una mayor precisión, precios más bajos y soporte multimodal integrado siguen siendo ventajas valiosas. Para los desarrolladores que crean agentes y canalizaciones RAG, esta puede ser la actualización más útil hasta la fecha.</p>
<p>Algunos amigos han bromeado sobre la posibilidad de hacer "monumentos en línea" para GPT-4o, alegando que la personalidad de su antiguo compañero de chat ha desaparecido para siempre. A mí no me importa el cambio: puede que GPT-5 sea menos cálido y parlanchín, pero su estilo directo y sin rodeos me parece refrescantemente sencillo.</p>
<p><strong>¿Y a ti?</strong> Comparte tu opinión con nosotros: únete a nuestro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> o a la conversación en <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> y <a href="https://x.com/milvusio">X</a>.</p>
