---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  La revisión del código de IA mejora cuando los modelos debaten: Claude vs
  Gemini vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Probamos Claude, Gemini, Codex, Qwen y MiniMax en detección real de errores.
  El mejor modelo alcanzó el 53%. Tras un debate contradictorio, la detección
  subió al 80%.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>Hace poco utilicé modelos de IA para revisar un pull request, y los resultados fueron contradictorios: Claude marcó una carrera de datos, mientras que Gemini dijo que el código estaba limpio. Eso me despertó la curiosidad por saber cómo se comportarían otros modelos de IA, así que pasé los últimos modelos insignia de Claude, Gemini, Codex, Qwen y MiniMax por una prueba comparativa estructurada de revisión de código. ¿Los resultados? El modelo con mejor rendimiento sólo detectó el 53% de los errores conocidos.</p>
<p>Sin embargo, mi curiosidad no acababa ahí: ¿y si estos modelos de IA trabajaran juntos? Probé a ponerlos a debatir entre ellos y, tras cinco rondas de debate, la detección de errores aumentó hasta el 80%. Los errores más difíciles, los que requerían una comprensión del sistema, se detectaron al 100% en el modo de debate.</p>
<p>Este artículo analiza el diseño del experimento, los resultados por modelo y lo que el mecanismo de debate revela sobre cómo utilizar realmente la IA para la revisión de código.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Evaluación comparativa de Claude, Gemini, Codex, Qwen y MiniMax para la revisión de código<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Si has estado utilizando modelos para la revisión de código, probablemente te habrás dado cuenta de que no sólo difieren en precisión, sino también en cómo leen el código. Por ejemplo, Claude</p>
<p>Claude suele recorrer la cadena de llamadas de arriba abajo y dedicará tiempo a las rutas "aburridas" (gestión de errores, reintentos, limpieza). A menudo es ahí donde se esconden los verdaderos errores, así que no odio esa minuciosidad.</p>
<p>Géminis tiende a empezar con un veredicto contundente ("esto está mal" / "parece que está bien") y luego trabaja hacia atrás para justificarlo desde un ángulo de diseño/estructura. A veces es útil. A veces da la impresión de que se ha escaqueado y luego se ha comprometido a tomar una decisión.</p>
<p>Codex es más silencioso. Pero cuando señala algo, suele ser concreto y aplicable: menos comentarios y más "esta línea está mal porque X".</p>
<p>Pero se trata de impresiones, no de mediciones. Para obtener cifras reales, establecí un punto de referencia.</p>
<h3 id="Setup" class="common-anchor-header">Configuración</h3><p><strong>Se probaron cinco modelos emblemáticos:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Herramientas (Magpie)</strong></p>
<p>Utilicé <a href="https://github.com/liliu-z/magpie">Magpie</a>, una herramienta de evaluación comparativa de código abierto creada por mí. Su trabajo consiste en hacer la "preparación de la revisión del código" que normalmente se haría manualmente: extraer el contexto circundante (cadenas de llamadas, módulos relacionados y código adyacente relevante) e introducirlo en el modelo <em>antes de</em> que revise el PR.</p>
<p><strong>Casos de prueba (Milvus PRs con errores conocidos)</strong></p>
<p>El conjunto de datos se compone de 15 pull requests de <a href="https://github.com/milvus-io/milvus">Milvus</a> (una base de datos vectorial de código abierto creada y mantenida por <a href="https://zilliz.com/">Zilliz</a>). Estos PRs son útiles como punto de referencia porque cada uno fue fusionado, sólo para requerir más tarde una reversión o hotfix después de que un error apareciera en producción. Por tanto, cada caso tiene un fallo conocido que podemos comparar.</p>
<p><strong>Niveles de dificultad de los fallos</strong></p>
<p>No todos estos errores son igual de difíciles de encontrar, así que los clasifiqué en tres niveles de dificultad:</p>
<ul>
<li><p><strong>L1:</strong> Visibles sólo a partir del diff (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 casos):</strong> Requiere entender el código circundante para detectar cosas como cambios semánticos en la interfaz o carreras de concurrencia. Son los errores más comunes en la revisión diaria del código.</p></li>
<li><p><strong>L3 (5 casos):</strong> Requiere comprensión a nivel de sistema para detectar problemas como incoherencias de estado entre módulos o problemas de compatibilidad con actualizaciones. Estas son las pruebas más duras de la profundidad con la que un modelo puede razonar sobre una base de código.</p></li>
</ul>
<p><em>Nota: Todos los modelos detectaron todos los errores L1, por lo que los excluí de la puntuación.</em></p>
<p><strong>Dos modos de evaluación</strong></p>
<p>Cada modelo se ejecutó en dos modos:</p>
<ul>
<li><p><strong>Raw:</strong> el modelo sólo ve el PR (diff + lo que haya en el contenido del PR).</p></li>
<li><p><strong>R1:</strong> Magpie extrae el contexto circundante (archivos relevantes / sitios de llamada / código relacionado) <em>antes de</em> que el modelo lo revise. Esto simula un flujo de trabajo en el que se prepara el contexto por adelantado en lugar de pedir al modelo que adivine lo que necesita.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Resultados (sólo L2 + L3)</h3><table>
<thead>
<tr><th>Modo</th><th>Claude</th><th>Géminis</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>En bruto</td><td>53% (1º)</td><td>13% (último)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (con contexto de Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Cuatro conclusiones:</p>
<p><strong>1. Claude domina la revisión en bruto.</strong> Obtuvo un 53% de detección global y un perfecto 5/5 en errores L3, sin ninguna ayuda de contexto. Si utilizas un único modelo y no quieres dedicar tiempo a preparar el contexto, Claude es la mejor opción.</p>
<p><strong>2. Gemini necesita que le den contexto.</strong> Su puntuación bruta del 13% fue la más baja del grupo, pero con Magpie proporcionando código de contexto, subió al 33%. Géminis no reúne bien su propio contexto, pero su rendimiento es respetable cuando se hace ese trabajo por adelantado.</p>
<p><strong>3. Qwen es el que mejor funciona con ayuda del contexto.</strong> Obtuvo un 40% en el modo R1, con 5/10 en errores L2, que fue la puntuación más alta en ese nivel de dificultad. Para revisiones diarias rutinarias en las que estés dispuesto a preparar el contexto, Qwen es una elección práctica.</p>
<p><strong>4. Más contexto no siempre ayuda.</strong> Elevó a Gemini (13% → 33%) y MiniMax (27% → 33%), pero en realidad perjudicó a Claude (53% → 47%). Claude ya destaca en la organización del contexto por sí solo, por lo que la información adicional probablemente introdujo ruido en lugar de claridad. La lección: adapte el flujo de trabajo al modelo, en lugar de asumir que más contexto es universalmente mejor.</p>
<p>Estos resultados coinciden con mi experiencia cotidiana. Que Claude ocupe el primer puesto no es sorprendente. La puntuación de Géminis, más baja de lo que esperaba, tiene sentido en retrospectiva: normalmente utilizo Géminis en conversaciones de varios turnos en las que estoy iterando sobre un diseño o persiguiendo un problema juntos, y funciona bien en ese entorno interactivo. Este benchmark es un pipeline fijo de una sola pasada, que es exactamente el formato en el que Gemini es más débil. La sección de debate mostrará más adelante que cuando se le da a Géminis un formato adversario de varias rondas, su rendimiento mejora notablemente.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Dejar que los modelos de IA debatan entre sí<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada modelo mostró diferentes puntos fuertes y débiles en las pruebas comparativas individuales. Así que quise probar: ¿qué ocurre si los modelos revisan el trabajo de los demás en lugar de sólo el código?</p>
<p>Así que añadí una capa de debate sobre el mismo punto de referencia. Los cinco modelos participan en cinco rondas:</p>
<ul>
<li><p>En la ronda 1, cada modelo revisa el mismo RP de forma independiente.</p></li>
<li><p>Después, transmito las cinco revisiones a todos los participantes.</p></li>
<li><p>En la ronda 2, cada modelo actualiza su posición basándose en las otras cuatro.</p></li>
<li><p>Se repite hasta la quinta ronda.</p></li>
</ul>
<p>Al final, cada modelo no sólo reacciona al código, sino a argumentos que ya han sido criticados y revisados varias veces.</p>
<p>Para evitar que esto se convierta en un "LLM de acuerdo en voz alta", impuse una regla estricta: <strong>cada afirmación tiene que apuntar a un código específico como prueba</strong>, y un modelo no puede limitarse a decir "buena observación", sino que tiene que explicar por qué ha cambiado de opinión.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Resultados: Mejor Solo vs Modo Debate</h3><table>
<thead>
<tr><th>Modo</th><th>L2 (10 casos)</th><th>L3 (5 casos)</th><th>Detección total</th></tr>
</thead>
<tbody>
<tr><td>Mejor individual (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Debate (los cinco modelos)</td><td>7/10 (doblado)</td><td>5/5 (todos atrapados)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">Lo más destacado</h3><p><strong>1. La detección de L2 se ha duplicado.</strong> 2. Los errores rutinarios de dificultad media pasaron de 3/10 a 7/10. Estos son los errores que aparecen con más frecuencia en las bases de código reales, y son exactamente la categoría en la que los modelos individuales fallan de forma incoherente. La mayor contribución del mecanismo de debate es colmar estas lagunas cotidianas.</p>
<p><strong>2. Errores L3: cero fallos.</strong> En las ejecuciones con un solo modelo, sólo Claude detectó los cinco errores L3 a nivel de sistema. En el modo de debate, el grupo igualó ese resultado, lo que significa que ya no es necesario apostar por el modelo correcto para obtener una cobertura L3 completa.</p>
<p><strong>3. El debate rellena los puntos ciegos en lugar de elevar el techo.</strong> Los fallos a nivel de sistema no eran la parte difícil para el individuo más fuerte. Claude ya los tenía. La principal contribución del mecanismo de debate es parchear la debilidad de Claude en los fallos L2 rutinarios, en los que Claude sólo detectó 3 de cada 10, pero el grupo de debate detectó 7. De ahí viene el salto del 53% → 80%.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">Cómo es el debate en la práctica</h3><p>Las cifras anteriores demuestran que el debate funciona, pero un ejemplo concreto muestra <em>por qué</em> funciona. He aquí un resumen de cómo los cinco modelos trataron <strong>el PR #44474</strong>, que introdujo la carga perezosa de claves primarias durante la búsqueda.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> Una optimización de la carga perezosa que cambió la búsqueda para obtener claves primarias bajo demanda en lugar de cargarlas todas por adelantado.</p>
<p><strong>Primer asalto</strong></p>
<p>Géminis abrió agresivamente:</p>
<p>"Este PR es un campo minado de malas prácticas, potenciales comportamientos indefinidos y regresiones de rendimiento disfrazadas de 'optimización'".</p>
<p>Claude y Qwen se centraron en el comportamiento indefinido y el rendimiento, convergiendo en la misma preocupación:</p>
<p>"El modelo de memoria de C++ no garantiza la seguridad de las escrituras concurrentes en diferentes índices del mismo vector sin la sincronización adecuada".</p>
<p>Los tres encontraron problemas reales, pero ninguno de ellos detectó el fallo más profundo. Entonces Codex, que apenas había hablado, señaló algo que los otros pasaron por alto: el vector <code translate="no">primary_keys_</code> se redimensiona, pero sólo se rellenan las posiciones que pasan por la fase de reducción. Todas las demás posiciones quedan con valor cero.</p>
<p><strong>Segundo asalto</strong></p>
<p>Claude recogió el hallazgo de Codex y rastreó las consecuencias:</p>
<p>"Lo he encontrado: <code translate="no">SortEqualScoresByPks</code> se ejecuta antes que <code translate="no">ReduceResultData</code>. Así que cuando se ejecuta <code translate="no">SortEqualScoresByPks</code>, todavía no se ha obtenido ningún PK. Todo el vector <code translate="no">primary_keys_</code> está lleno de valores PkType construidos por defecto".</p>
<p>En términos sencillos, la función de ordenación se ejecuta antes de que se hayan cargado las claves, por lo que está ordenando ceros. Claude reconoció abiertamente el fallo:</p>
<p>"codex-cli identificó un auténtico error crítico de corrección. Lo pasé por alto en mi primera ronda".</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">¿Qué combinación de modelos puede encontrar más errores?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>El salto del 53% al 80% se produjo porque cinco modelos cubrieron mutuamente sus puntos ciegos. Pero no todo el mundo puede permitirse configurar y ejecutar cinco modelos a través de cinco rondas de debate para cada revisión de código.</p>
<p><strong>Así que probé la versión más sencilla: si sólo puedes ejecutar dos modelos, ¿qué par te acerca más al techo multimodelo?</strong></p>
<p>Utilicé las ejecuciones <strong>asistidas por contexto (R1)</strong> y conté cuántos de los 15 errores conocidos encontró cada modelo:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Géminis:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex</strong> 4/15 (27%)</p></li>
</ul>
<p>Lo que importa, por tanto, no es sólo cuántos fallos encuentra cada modelo, sino <em>qué</em> fallos pasa por alto. De los 8 errores que Claude pasó por alto, Gemini detectó 3: una condición de carrera de concurrencia, un problema de compatibilidad con la API de almacenamiento en la nube y una falta de comprobación de permisos. En la otra dirección, Gemini no detectó la mayoría de los errores de estructuras de datos y lógica profunda, mientras que Claude detectó casi todos. Sus puntos débiles apenas se solapan, lo que les convierte en una pareja fuerte.</p>
<table>
<thead>
<tr><th>Emparejamiento de dos modelos</th><th>Cobertura combinada</th></tr>
</thead>
<tbody>
<tr><td>Claude + Géminis</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Los cinco modelos juntos cubrieron 11 de 15, dejando 4 fallos que cada modelo pasó por alto.</p>
<p><strong>Claude + Gemini,</strong> como pareja de dos modelos, ya alcanza el 91% de ese techo de cinco modelos. Para este punto de referencia, es la combinación más eficaz.</p>
<p>Dicho esto, Claude + Géminis no es la mejor pareja para cada tipo de fallo. Cuando desglosé los resultados por categoría de fallo, surgió una imagen más matizada:</p>
<table>
<thead>
<tr><th>Tipo de error</th><th>Total</th><th>Claude</th><th>Géminis</th><th>Códice</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Lagunas de validación</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Ciclo de vida de la estructura de datos</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Carreras de concurrencia</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Compatibilidad</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Lógica profunda</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Total</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>El desglose por tipo de fallo revela por qué ningún emparejamiento es universalmente el mejor.</p>
<ul>
<li><p>Para los fallos del ciclo de vida de las estructuras de datos, Claude y MiniMax empataron a 3/4.</p></li>
<li><p>En cuanto a los fallos de validación, Claude y Qwen empataron a 3/4.</p></li>
<li><p>En cuanto a problemas de concurrencia y compatibilidad, Claude obtuvo una puntuación de cero en ambos, y Gemini es el que cubre esas lagunas.</p></li>
<li><p>Ningún modelo lo cubre todo, pero Claude es el que más abarca y el que más se acerca a ser generalista.</p></li>
</ul>
<p>Todos los modelos pasaron por alto cuatro errores. Uno tenía que ver con la prioridad de las reglas gramaticales ANTLR. Otro era un desajuste semántico de bloqueo de lectura/escritura entre funciones. Otro requería entender las diferencias de lógica de negocio entre los tipos de compactación. Y otro era un error de comparación silencioso en el que una variable utilizaba megabytes y otra bytes.</p>
<p>Lo que estos cuatro errores tienen en común es que el código es sintácticamente correcto. Los errores viven en suposiciones que el desarrollador llevaba en la cabeza, no en el diff, y ni siquiera en el código circundante. Aquí es más o menos donde la revisión de código de IA toca techo hoy en día.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Después de encontrar errores, ¿qué modelo es el mejor para corregirlos?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>En la revisión de código, encontrar errores es la mitad del trabajo. La otra mitad es corregirlos. Así que después de las rondas de debate, añadí una evaluación por pares para medir la utilidad real de las sugerencias de corrección de cada modelo.</p>
<p>Para medir esto, añadí una ronda de evaluación por pares después del debate. Cada modelo abrió una nueva sesión y actuó como juez anónimo, puntuando las revisiones de los otros modelos. Los cinco modelos se asignaron aleatoriamente al revisor A/B/C/D/E, de modo que ningún juez sabía qué modelo había producido qué revisión. Cada juez puntuó en cuatro dimensiones, calificadas de 1 a 10: precisión, capacidad de acción, profundidad y claridad.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Precisión</th><th>Accionabilidad</th><th>Profundidad</th><th>Claridad</th><th>En general</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (empatado 1º)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (empatado 1º)</td></tr>
<tr><td>Códice</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Géminis</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen y Claude empataron en el primer puesto por un claro margen. Ambos obtuvieron sistemáticamente puntuaciones altas en las cuatro dimensiones, mientras que Codex, Géminis y MiniMax se situaron un punto o más por debajo. Cabe destacar que Géminis, que demostró ser un valioso compañero de Claude en la búsqueda de errores en el análisis por parejas, se sitúa cerca de los últimos puestos en calidad de revisión. Ser bueno detectando problemas y ser bueno explicando cómo solucionarlos son habilidades evidentemente diferentes.</p>
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
    </button></h2><p><strong>Claude</strong> es a quien confiarías las revisiones más difíciles. Trabaja a través de cadenas de llamadas enteras, sigue rutas lógicas profundas y extrae su propio contexto sin necesidad de que le eches una cuchara. En bugs a nivel de sistema L3, nada se le acerca. A veces se muestra demasiado confiado con las matemáticas, pero cuando otro modelo demuestra que está equivocado, lo asume y explica dónde falló su razonamiento. Utilícelo para el código central y los errores que no puede permitirse pasar por alto.</p>
<p><strong>Géminis</strong> viene pisando fuerte. Tiene opiniones firmes sobre el estilo del código y las normas de ingeniería, y es rápido para enmarcar los problemas estructuralmente. El inconveniente es que a menudo se queda en la superficie y no profundiza lo suficiente, por lo que obtuvo una puntuación baja en la evaluación por pares. Donde Géminis se gana realmente su puesto es como retador: su reacción obliga a otros modelos a revisar su trabajo. Combínalo con Claude para obtener la perspectiva estructural que Claude a veces se salta.</p>
<p><strong>Codex</strong> apenas dice una palabra. Pero cuando lo hace, cuenta. Su porcentaje de aciertos en errores reales es alto, y tiene un don para detectar lo que todos los demás pasan por alto. En el ejemplo del PR #44474, Codex fue el modelo que detectó el problema de las claves primarias de valor cero que desencadenó toda la cadena. Piensa en él como el revisor suplementario que detecta lo que tu modelo principal pasó por alto.</p>
<p><strong>Qwen</strong> es el más completo de los cinco. Su calidad de revisión igualó a la de Claude, y es especialmente bueno a la hora de reunir diferentes perspectivas en sugerencias de arreglos sobre las que realmente se puede actuar. También tuvo la tasa más alta de detección de L2 en el modo de contexto asistido, lo que lo convierte en un sólido predeterminado para las revisiones diarias de relaciones públicas. El único punto débil: en los debates largos de varias rondas, a veces pierde de vista el contexto anterior y empieza a dar respuestas incoherentes en rondas posteriores.</p>
<p><strong>MiniMax</strong> fue el más flojo a la hora de encontrar errores por sí solo. Es mejor utilizarlo para completar un grupo multimodelo que como revisor independiente.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Limitaciones de este experimento<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Algunas advertencias para mantener este experimento en perspectiva:</p>
<p><strong>El tamaño de la muestra es pequeño.</strong> Sólo hay 15 PRs, todos del mismo proyecto Go/C++ (Milvus). Estos resultados no son generalizables a todos los lenguajes o bases de código. Considérelos orientativos, no definitivos.</p>
<p><strong>Los modelos son inherentemente aleatorios.</strong> Ejecutar la misma consulta dos veces puede producir resultados diferentes. Las cifras de este artículo son una instantánea, no un valor esperado estable. Las clasificaciones de los modelos individuales deben tomarse a la ligera, aunque las tendencias generales (el debate supera a los individuos, los diferentes modelos destacan en diferentes tipos de errores) son coherentes.</p>
<p><strong>Se ha modificado el orden de intervención.</strong> En el debate se utilizó el mismo orden en todas las rondas, lo que puede haber influido en la respuesta de los modelos que hablaron más tarde. En un experimento futuro se podría aleatorizar el orden en cada ronda para controlar este aspecto.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Pruébelo usted mismo<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Todas las herramientas y datos de este experimento son de código abierto:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Una herramienta de código abierto que recopila el contexto del código (cadenas de llamadas, PRs relacionados, módulos afectados) y orquesta el debate adversarial multimodelo para la revisión de código.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: El proceso de evaluación completo, configuraciones y secuencias de comandos.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Casos de prueba</strong></a>: Los 15 RP con errores conocidos anotados.</p></li>
</ul>
<p>Todos los errores de este experimento proceden de solicitudes reales de <a href="https://github.com/milvus-io/milvus">Milvus</a>, una base de datos vectorial de código abierto creada para aplicaciones de IA. Tenemos una comunidad bastante activa en <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> y <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, y nos encantaría que más gente hurgara en el código. Y si acabas ejecutando esta prueba en tu propio código, ¡comparte los resultados! Tengo mucha curiosidad por saber si las tendencias se mantienen en diferentes lenguajes y proyectos.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Seguir leyendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: ¿Qué modelo encaja con tu pila de agentes de IA?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Añadiendo Memoria Persistente al Código Claude con el Ligero Plugin memsearch</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código abierto (memsearch)</a></p></li>
</ul>
