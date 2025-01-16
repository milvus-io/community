---
id: deep-dive-7-query-expression.md
title: ¿Cómo entiende y ejecuta la base de datos su consulta?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Una consulta vectorial es el proceso de recuperación de vectores mediante
  filtrado escalar.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido transcreado por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Una <a href="https://milvus.io/docs/v2.0.x/query.md">consulta vectorial</a> en Milvus es el proceso de recuperación de vectores mediante filtrado escalar basado en una expresión booleana. Con el filtrado escalar, los usuarios pueden limitar los resultados de sus consultas aplicando determinadas condiciones a los atributos de los datos. Por ejemplo, si un usuario busca películas estrenadas entre 1990 y 2010 con una puntuación superior a 8,5, sólo se mostrarán las películas cuyos atributos (año de estreno y puntuación) cumplan la condición.</p>
<p>Este artículo pretende examinar cómo se completa una consulta en Milvus desde la entrada de una expresión de consulta hasta la generación del plan de consulta y la ejecución de la consulta.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#Query-expression">Expresión de consulta</a></li>
<li><a href="#Plan-AST-generation">Generación del plan AST</a></li>
<li><a href="#Query-execution">Ejecución de la consulta</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Expresión de consulta<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>La expresión de una consulta con filtrado de atributos en Milvus adopta la sintaxis EBNF (Extended Backus-Naur form). La siguiente imagen muestra las reglas de expresión en Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Sintaxis de expresión</span> </span></p>
<p>Las expresiones lógicas pueden crearse utilizando la combinación de operadores lógicos binarios, operadores lógicos unarios, expresiones lógicas y expresiones simples. Dado que la sintaxis EBNF es en sí misma recursiva, una expresión lógica puede ser el resultado de la combinación o parte de una expresión lógica mayor. Una expresión lógica puede contener muchas sub-expresiones lógicas. La misma regla se aplica en Milvus. Si un usuario necesita filtrar los atributos de los resultados con muchas condiciones, puede crear su propio conjunto de condiciones de filtrado combinando diferentes operadores y expresiones lógicas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Expresión booleana</span> </span></p>
<p>La imagen anterior muestra parte de las <a href="https://milvus.io/docs/v2.0.x/boolean.md">reglas de expresión booleana</a> en Milvus. Pueden añadirse operadores lógicos unarios a una expresión. Actualmente Milvus sólo admite el operador lógico unario &quot;not&quot;, que indica que el sistema necesita tomar los vectores cuyos valores de campo escalar no satisfacen los resultados del cálculo. Los operadores lógicos binarios incluyen &quot;and&quot; y &quot;or&quot;. Las expresiones simples incluyen expresiones de término y expresiones de comparación.</p>
<p>Milvus también admite cálculos aritméticos básicos como la suma, la resta, la multiplicación y la división durante una consulta. La siguiente imagen muestra la precedencia de las operaciones. Los operadores se enumeran de arriba a abajo en orden descendente de precedencia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Precedencia</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">¿Cómo se procesa en Milvus una expresión de consulta sobre determinadas películas?</h3><p>Supongamos que hay una gran cantidad de datos de películas almacenados en Milvus y que el usuario desea consultar determinadas películas. Por ejemplo, cada dato de película almacenado en Milvus tiene los cinco campos siguientes: ID de la película, año de estreno, tipo de película, puntuación y cartel. En este ejemplo, el tipo de datos del ID de la película y el año de estreno es int64, mientras que las puntuaciones de las películas son datos de coma flotante. Además, los carteles de las películas se almacenan en formato de vectores de coma flotante, y el tipo de película en formato de datos de cadena. Cabe destacar que la compatibilidad con los tipos de datos de cadena es una nueva característica de Milvus 2.1.</p>
<p>Por ejemplo, si un usuario desea consultar las películas con puntuaciones superiores a 8,5 puntos. Además, las películas deben estrenarse entre una década antes de 2000 y una década después de 2000, o ser de comedia o de acción, el usuario debe introducir la siguiente expresión predicada: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Al recibir la expresión de consulta, el sistema la ejecutará con la siguiente precedencia:</p>
<ol>
<li>Buscar películas con una puntuación superior a 8,5. El resultado de la consulta se denomina &quot;resultado1&quot;.</li>
<li>Calcular 2000 - 10 para obtener "resultado2" (1990).</li>
<li>Calcular 2000 + 10 para obtener "resultado3" (2010).</li>
<li>Buscar películas cuyo valor de <code translate="no">release_year</code> sea mayor que &quot;result2&quot; y menor que &quot;result3&quot;. Es decir, el sistema debe buscar las películas estrenadas entre 1990 y 2010. Los resultados de la consulta se denominan &quot;resultado4&quot;.</li>
<li>Buscar películas que sean comedias o películas de acción. Los resultados de la consulta se denominan &quot;resultado5&quot;.</li>
<li>Combine "resultado4" y "resultado5" para obtener películas estrenadas entre 1990 y 2010 o que pertenezcan a la categoría de comedia o película de acción. Los resultados se denominan &quot;resultado6&quot;.</li>
<li>Tome la parte común en "resultado1" y "resultado6" para obtener los resultados finales que satisfacen todas las condiciones.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Ejemplo de película</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Planificar la generación de AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utiliza la herramienta de código abierto <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) para la generación de planes AST (árbol de sintaxis abstracta). ANTLR es un potente generador de análisis sintáctico para leer, procesar, ejecutar o traducir texto estructurado o archivos binarios. Más concretamente, ANTLR puede generar un analizador sintáctico para construir y recorrer árboles de análisis sintáctico basados en sintaxis o reglas predefinidas. La siguiente imagen es un ejemplo en el que la expresión de entrada es &quot;SP=100;&quot;. LEXER, la funcionalidad de reconocimiento de lenguaje integrada en ANTLR, genera cuatro tokens para la expresión de entrada: &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; y &quot;;&quot;. A continuación, la herramienta analiza los cuatro tokens para generar el correspondiente árbol de análisis sintáctico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>árbol de análisis sintáctico</span> </span></p>
<p>El mecanismo de recorrido es una parte crucial de la herramienta ANTLR. Está diseñado para recorrer todos los árboles de análisis sintáctico con el fin de examinar si cada nodo obedece las reglas sintácticas, o para detectar ciertas palabras sensibles. En la siguiente imagen se enumeran algunas de las API relevantes. Dado que ANTLR comienza desde el nodo raíz y va descendiendo por cada subnodo hasta llegar al final, no es necesario diferenciar el orden de cómo recorrer el árbol de análisis sintáctico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>caminador del árbol de análisis sintáctico</span> </span></p>
<p>Milvus genera el PlanAST para consulta de forma similar al ANTLR. Sin embargo, el uso de ANTLR requiere redefinir reglas sintácticas bastante complicadas. Por lo tanto, Milvus adopta una de las reglas más comunes, las reglas de expresión booleana, y depende del paquete <a href="https://github.com/antonmedv/expr">Expr</a> de código abierto en GitHub para consultar y analizar la sintaxis de las expresiones de consulta.</p>
<p>Durante una consulta con filtrado de atributos, Milvus generará un árbol de plan primitivo sin resolver utilizando ant-parser, el método de análisis sintáctico proporcionado por Expr, al recibir la expresión de consulta. El árbol del plan primitivo que obtendremos es un árbol binario simple. A continuación, Expr y el optimizador incorporado en Milvus afinan el árbol del plan. El optimizador de Milvus es bastante similar al mecanismo del caminante antes mencionado. Dado que la funcionalidad de optimización del árbol de planes proporcionada por Expr es bastante sofisticada, la carga del optimizador incorporado en Milvus se alivia en gran medida. En última instancia, el analizador analiza el árbol del plan optimizado de forma recursiva para generar un AST del plan en la estructura de <a href="https://developers.google.com/protocol-buffers">búferes de protocolo</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Flujo de trabajo del plan AST</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Ejecución de consultas<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>La ejecución de la consulta es, en esencia, la ejecución del plan AST generado en los pasos anteriores.</p>
<p>En Milvus, un plan AST se define en una estructura proto. La imagen de abajo es un mensaje con la estructura protobuf. Hay seis tipos de expresiones, entre las cuales la expresión binaria y la expresión unaria pueden tener además expresión lógica binaria y expresión lógica unaria.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>La imagen siguiente es una imagen UML de la expresión de consulta. Demuestra la clase básica y la clase derivada de cada expresión. Cada clase viene con un método para aceptar parámetros del visitante. Este es un patrón de diseño de visitante típico. Milvus utiliza este patrón para ejecutar el plan AST ya que su mayor ventaja es que los usuarios no tienen que hacer nada a las expresiones primitivas sino que pueden acceder directamente a uno de los métodos de los patrones para modificar cierta clase de expresión de consulta y los elementos relevantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Al ejecutar un plan AST, Milvus recibe primero un nodo de plan de tipo proto. A continuación, se obtiene un nodo de plan de tipo segcore mediante el analizador sintáctico interno de proto de C++. Al obtener los dos tipos de nodos del plan, Milvus acepta una serie de accesos a clases y, a continuación, modifica y ejecuta en la estructura interna de los nodos del plan. Por último, Milvus busca en todos los nodos del plan de ejecución para obtener los resultados filtrados. Los resultados finales se obtienen en el formato de una máscara de bits. Una máscara de bits es una matriz de números de bits ("0" y "1"). Los datos que cumplen las condiciones del filtro se marcan como "1" en la máscara de bits, mientras que los que no las cumplen se marcan como "0" en la máscara de bits.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>ejecutar flujo de trabajo</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, hemos orquestado esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consultas en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
