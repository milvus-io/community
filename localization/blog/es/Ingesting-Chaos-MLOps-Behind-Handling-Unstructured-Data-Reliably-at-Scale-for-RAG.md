---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Ingerir el caos: Los MLOps detrás del manejo fiable de datos no estructurados
  a escala para RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Con tecnologías como VectorFlow y Milvus, el equipo puede realizar pruebas
  eficientes en distintos entornos cumpliendo los requisitos de privacidad y
  seguridad.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los datos se generan más rápido que nunca y en todas las formas imaginables. Estos datos son la gasolina que impulsará una nueva oleada de aplicaciones de inteligencia artificial, pero estos motores de mejora de la productividad necesitan ayuda para ingerir este combustible. La amplia gama de escenarios y casos extremos que rodean a los datos no estructurados dificulta su uso en los sistemas de IA de producción.</p>
<p>Para empezar, existe un gran número de fuentes de datos. Éstas exportan los datos en varios formatos de archivo, cada uno con sus excentricidades. Por ejemplo, la forma de procesar un PDF varía mucho en función de su procedencia. La ingesta de un PDF para un caso de litigio de valores se centrará probablemente en los datos textuales. En cambio, una especificación de diseño de un sistema para un ingeniero de cohetes estará llena de diagramas que requieren un procesamiento visual. La falta de un esquema definido en los datos no estructurados añade aún más complejidad. Incluso cuando se supera el reto de procesar los datos, persiste el problema de ingestarlos a escala. El tamaño de los archivos puede variar considerablemente, lo que cambia la forma de procesarlos. Se puede procesar rápidamente una carga de 1 MB en una API a través de HTTP, pero la lectura de docenas de GB de un único archivo requiere streaming y un trabajador dedicado.</p>
<p>Superar estos retos tradicionales de ingeniería de datos es una apuesta segura para conectar datos sin procesar a <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM</a> a través de <a href="https://zilliz.com/learn/what-is-vector-database">bases de datos vectoriales</a> como <a href="https://github.com/milvus-io/milvus">Milvus</a>. Sin embargo, los casos de uso emergentes, como la realización de búsquedas de similitud semántica con la ayuda de una base de datos vectorial, requieren nuevos pasos de procesamiento, como la fragmentación de los datos de origen, la orquestación de metadatos para búsquedas híbridas, la elección del modelo de incrustación vectorial adecuado y el ajuste de los parámetros de búsqueda para determinar qué datos alimentar al LLM. Estos flujos de trabajo son tan nuevos que no existen mejores prácticas establecidas que los desarrolladores puedan seguir. En su lugar, deben experimentar para encontrar la configuración y el caso de uso correctos para sus datos. Para acelerar este proceso, el uso de una canalización de incrustación de vectores para manejar la ingestión de datos en la base de datos de vectores es inestimable.</p>
<p>Una canalización de incrustación vectorial como <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> conectará sus datos sin procesar a su base de datos vectorial, incluyendo la fragmentación, la orquestación de metadatos, la incrustación y la carga. VectorFlow permite a los equipos de ingenieros centrarse en la lógica central de la aplicación, experimentando con los diferentes parámetros de recuperación generados a partir del modelo de incrustación, la estrategia de agrupación, los campos de metadatos y los aspectos de la búsqueda para ver qué funciona mejor.</p>
<p>En nuestro trabajo ayudando a los equipos de ingeniería a llevar sus sistemas de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generación aumentada de recuperación (RAG</a> ) del prototipo a la producción, hemos observado que el siguiente enfoque tiene éxito a la hora de probar los diferentes parámetros de una canalización de búsqueda RAG:</p>
<ol>
<li>Utilice un pequeño conjunto de datos con los que esté familiarizado para acelerar la iteración, como algunos PDF que contengan fragmentos relevantes para las consultas de búsqueda.</li>
<li>Crea un conjunto estándar de preguntas y respuestas sobre ese subconjunto de datos. Por ejemplo, después de leer los PDF, escribe una lista de preguntas y haz que tu equipo se ponga de acuerdo sobre las respuestas.</li>
<li>Crea un sistema de evaluación automatizado que puntúe cómo funciona la recuperación en cada pregunta. Una forma de hacerlo es tomar la respuesta del sistema RAG y volver a pasarla por el LLM con una indicación que pregunte si este resultado RAG responde a la pregunta dada la respuesta correcta. La respuesta debe ser "sí" o "no". Por ejemplo, si tiene 25 preguntas en sus documentos y el sistema acierta 20, puede utilizarlo para comparar con otros enfoques.</li>
<li>Asegúrese de utilizar para la evaluación un LLM diferente del que utilizó para codificar las incrustaciones vectoriales almacenadas en la base de datos. El LLM de evaluación suele ser de tipo decodificador de un modelo como GPT-4. Una cosa que hay que recordar es el coste de estas evaluaciones cuando se ejecutan repetidamente. Los modelos de código abierto como Llama2 70B o el LLM 6B de Deci AI, que pueden ejecutarse en una única GPU más pequeña, tienen aproximadamente el mismo rendimiento por una fracción del coste.</li>
<li>Ejecuta cada prueba varias veces y calcula la media para suavizar la estocasticidad del LLM.</li>
</ol>
<p>Manteniendo constantes todas las opciones excepto una, puedes determinar rápidamente qué parámetros funcionan mejor para tu caso de uso. Una canalización de incrustación vectorial como VectorFlow hace que esto sea especialmente fácil en el lado de la ingestión, donde puede probar rápidamente diferentes estrategias de fragmentación, longitudes de trozos, superposiciones de trozos y modelos de incrustación de código abierto para ver qué conduce a los mejores resultados. Esto es especialmente útil cuando el conjunto de datos tiene varios tipos de archivos y fuentes de datos que requieren una lógica personalizada.</p>
<p>Una vez que el equipo sabe lo que funciona para su caso de uso, la canalización de incrustación de vectores les permite pasar rápidamente a producción sin tener que rediseñar el sistema para tener en cuenta aspectos como la fiabilidad y la supervisión. Con tecnologías como VectorFlow y <a href="https://zilliz.com/what-is-milvus">Milvus</a>, que son de código abierto e independientes de la plataforma, el equipo puede realizar pruebas eficientes en distintos entornos cumpliendo los requisitos de privacidad y seguridad.</p>
