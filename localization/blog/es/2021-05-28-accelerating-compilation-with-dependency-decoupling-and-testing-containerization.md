---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Acelerar la compilación 2,5 veces con la desvinculación de dependencias y la
  contenedorización de pruebas
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Descubra cómo zilliz para reducir los tiempos de compilación 2,5x utilizando
  técnicas de desacoplamiento de dependencias y contenedorización para proyectos
  de IA y MLOps a gran escala.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Acelerar la compilación 2,5 veces con la desvinculación de dependencias y la contenedorización de pruebas</custom-h1><p>El tiempo de compilación puede verse agravado por complejas dependencias internas y externas que evolucionan a lo largo del proceso de desarrollo, así como por cambios en los entornos de compilación, como el sistema operativo o las arquitecturas de hardware. A continuación se enumeran los problemas más comunes que pueden surgir al trabajar en proyectos de IA o MLOps a gran escala:</p>
<p><strong>Compilación prohibitivamente larga</strong> - La integración de código se realiza cientos de veces al día. Con cientos de miles de líneas de código, incluso un pequeño cambio podría dar lugar a una compilación completa que suele durar una o más horas.</p>
<p><strong>Entorno de compilación complejo</strong> - El código del proyecto debe compilarse en diferentes entornos, que implican diferentes sistemas operativos, como CentOS y Ubuntu, dependencias subyacentes, como GCC, LLVM y CUDA, y arquitecturas de hardware. Y la compilación en un entorno específico normalmente puede no funcionar en un entorno diferente.</p>
<p><strong>Dependencias complejas</strong> - La compilación de proyectos implica más de 30 dependencias entre componentes y de terceros. El desarrollo del proyecto a menudo conlleva cambios en las dependencias, lo que inevitablemente provoca conflictos de dependencias. El control de versiones entre dependencias es tan complejo que la actualización de la versión de las dependencias afectará fácilmente a otros componentes.</p>
<p><strong>La descarga de dependencias de terceros es lenta o falla</strong> - Los retrasos en la red o la inestabilidad de las bibliotecas de dependencias de terceros provocan descargas lentas de recursos o fallos de acceso, lo que afecta gravemente a la integración del código.</p>
<p>Al desacoplar las dependencias e implementar la contenedorización de pruebas, conseguimos reducir el tiempo medio de compilación en un 60% mientras trabajábamos en el proyecto de código abierto de búsqueda de similitudes de incrustaciones <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Desacoplar las dependencias del proyecto</h3><p>La compilación de proyectos suele implicar un gran número de dependencias de componentes internos y externos. Cuantas más dependencias tiene un proyecto, más complejo resulta gestionarlas. A medida que el software crece, se hace más difícil y costoso cambiar o eliminar dependencias, así como identificar los efectos de hacerlo. Es necesario un mantenimiento regular a lo largo del proceso de desarrollo para garantizar que las dependencias funcionan correctamente. Un mantenimiento deficiente, dependencias complejas o dependencias defectuosas pueden causar conflictos que ralenticen o paralicen el desarrollo. En la práctica, esto puede suponer retrasos en la descarga de recursos, fallos de acceso que repercuten negativamente en la integración del código, etc. Desacoplar las dependencias del proyecto puede mitigar los defectos y reducir el tiempo de compilación, acelerando las pruebas del sistema y evitando un lastre innecesario en el desarrollo del software.</p>
<p>Por lo tanto, recomendamos desacoplar las dependencias de su proyecto:</p>
<ul>
<li>Dividir los componentes con dependencias complejas</li>
<li>Utilizar diferentes repositorios para la gestión de versiones.</li>
<li>Utilizar archivos de configuración para gestionar la información de versiones, opciones de compilación, dependencias, etc.</li>
<li>Añada los archivos de configuración a las bibliotecas de componentes para que se actualicen a medida que el proyecto itera.</li>
</ul>
<p><strong>Optimización de la compilación entre componentes</strong> - Extraiga y compile el componente pertinente según las dependencias y las opciones de compilación registradas en los archivos de configuración. Etiquete y empaquete los resultados de la compilación binaria y los archivos de manifiesto correspondientes y, a continuación, súbalos a su repositorio privado. Si no se realiza ningún cambio en un componente o en los componentes de los que depende, reproduzca sus resultados de compilación de acuerdo con los archivos de manifiesto. Para problemas como retrasos en la red o bibliotecas de dependencias de terceros inestables, pruebe a crear un repositorio interno o a utilizar repositorios duplicados.</p>
<p>Para optimizar la compilación entre componentes</p>
<p>1.Cree un gráfico de relación de dependencia: utilice los archivos de configuración de las bibliotecas de componentes para crear un gráfico de relación de dependencia. Utilice la relación de dependencia para recuperar la información de la versión (Git Branch, Tag y Git commit ID) y las opciones de compilación y más de los componentes dependientes tanto aguas arriba como aguas abajo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>.Comprobación de dependencias</strong> - Genera alertas para dependencias circulares, conflictos de versión y otros problemas que surjan entre componentes.</p>
<p>3<strong>.Aplanar dependencias</strong> - Ordena las dependencias mediante la búsqueda por profundidad (DFS) y fusiona componentes con dependencias duplicadas para formar un gráfico de dependencias.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4.Utilizar el algoritmo MerkleTree para generar un hash (Root Hash) que contenga las dependencias de cada componente basándose en la información de la versión, las opciones de compilación y más. Combinado con información como el nombre del componente, el algoritmo forma una etiqueta única para cada componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5.Basándose en la información de la etiqueta única del componente, comprueba si existe un archivo de compilación correspondiente en el repositorio privado. Si se recupera un archivo de compilación, descomprímalo para obtener el archivo de manifiesto para la reproducción; si no, compile el componente, marque los archivos objeto de compilación generados y el archivo de manifiesto, y cárguelos en el repositorio privado.</p>
<p><br/></p>
<p><strong>Implemente optimizaciones de compilación en los componentes</strong>: elija una herramienta de caché de compilación específica del lenguaje para almacenar en caché los archivos objeto compilados, y cárguelos y almacénelos en su repositorio privado. Para la compilación de C/C++, elija una herramienta de caché de compilación como CCache para almacenar en caché los archivos intermedios de compilación de C/C++ y, a continuación, archive la caché local de CCache tras la compilación. Estas herramientas de caché de compilación simplemente almacenan en caché los archivos de código modificados uno a uno después de la compilación, y copian los componentes compilados del archivo de código no modificado para que puedan participar directamente en la compilación final. La optimización de la compilación dentro de los componentes incluye los siguientes pasos:</p>
<ol>
<li>Añadir las dependencias de compilación necesarias a Dockerfile. Utilizar Hadolint para realizar comprobaciones de conformidad en Dockerfile para garantizar que la imagen se ajusta a las mejores prácticas de Docker.</li>
<li>Duplique el entorno de compilación de acuerdo con la versión del proyecto sprint (versión + compilación), el sistema operativo y otra información.</li>
<li>Ejecute el contenedor del entorno de compilación duplicado y transfiera el ID de la imagen al contenedor como variable de entorno. He aquí un comando de ejemplo para obtener el ID de imagen: "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Elija la herramienta de caché de compilación adecuada: Introduce tu contenedor para integrar y compilar tus códigos y comprueba en tu repositorio privado si existe una caché de compilación apropiada. En caso afirmativo, descárgala y extráela al directorio especificado. Una vez compilados todos los componentes, la caché generada por la herramienta de caché de compilación se empaqueta y se carga en su repositorio privado en función de la versión del proyecto y el ID de imagen.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Mayor optimización de la compilación</h3><p>Como nuestra compilación inicial ocupa demasiado espacio en disco y ancho de banda de red, y tarda mucho en desplegarse, tomamos las siguientes medidas:</p>
<ol>
<li>Elegir la imagen base más ligera para reducir el tamaño de la imagen, por ejemplo, alpine, busybox, etc.</li>
<li>Reducir el número de capas de la imagen. Reutilizar las dependencias en la medida de lo posible. Fusione varios comandos con "&amp;&amp;".</li>
<li>Limpie los productos intermedios durante la construcción de la imagen.</li>
<li>Utilizar la caché de imagen para construir la imagen tanto como sea posible.</li>
</ol>
<p>A medida que nuestro proyecto avanzaba, el uso de disco y de recursos de red comenzó a dispararse a medida que aumentaba la caché de compilación, mientras que algunas de las cachés de compilación estaban infrautilizadas. Entonces hicimos los siguientes ajustes:</p>
<p>Limpiar<strong>regularmente los</strong> archivos de caché - Comprobar regularmente el repositorio privado (utilizando scripts por ejemplo), y limpiar los archivos de caché que no han cambiado durante un tiempo o que no se han descargado mucho.</p>
<p><strong>Almacenamiento selectivo de compilaciones en caché</strong>: almacene en caché únicamente las compilaciones que requieran muchos recursos y omita las compilaciones que no requieran muchos recursos.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Aprovechamiento de las pruebas en contenedores para reducir los errores y mejorar la estabilidad y la fiabilidad</h3><p>Los códigos tienen que compilarse en diferentes entornos, que implican una variedad de sistemas operativos (por ejemplo, CentOS y Ubuntu), dependencias subyacentes (por ejemplo, GCC, LLVM y CUDA) y arquitecturas de hardware específicas. El código que se compila con éxito en un entorno específico falla en un entorno diferente. Al ejecutar las pruebas dentro de contenedores, el proceso de pruebas se vuelve más rápido y preciso.</p>
<p>La contenedorización garantiza que el entorno de pruebas sea coherente y que la aplicación funcione como se espera. El enfoque de pruebas en contenedores empaqueta las pruebas como contenedores de imágenes y crea un entorno de pruebas realmente aislado. Nuestros probadores encontraron este enfoque bastante útil, que acabó reduciendo los tiempos de compilación hasta en un 60%.</p>
<p><strong>Garantizar un entorno de compilación coherente</strong> - Como los productos compilados son sensibles a los cambios en el entorno del sistema, pueden producirse errores desconocidos en distintos sistemas operativos. Tenemos que etiquetar y archivar la caché de productos compilados en función de los cambios en el entorno de compilación, pero son difíciles de clasificar. Por ello, introdujimos la tecnología de contenedorización para unificar el entorno de compilación y resolver estos problemas.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusión</h3><p>Mediante el análisis de las dependencias del proyecto, este artículo introduce diferentes métodos para la optimización de la compilación entre y dentro de los componentes, proporcionando ideas y mejores prácticas para construir una integración de código continua estable y eficiente. Estos métodos ayudaron a resolver la lenta integración de código causada por dependencias complejas, unificar las operaciones dentro del contenedor para asegurar la consistencia del entorno, y mejorar la eficiencia de la compilación a través de la reproducción de los resultados de la compilación y el uso de herramientas de caché de compilación para almacenar en caché los resultados intermedios de la compilación.</p>
<p>Las prácticas mencionadas han reducido el tiempo de compilación del proyecto en un 60% de media, mejorando enormemente la eficiencia global de la integración del código. En el futuro, seguiremos paralelizando la compilación entre y dentro de los componentes para reducir aún más los tiempos de compilación.</p>
<p><br/></p>
<p><em>Para este artículo se han utilizado las siguientes fuentes</em></p>
<ul>
<li>"Desacoplamiento de árboles de código fuente en componentes de nivel de compilación"</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Factores a tener en cuenta al añadir dependencias de terceros a un proyecto</a>"</li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Sobrevivir a las dependencias de software</a>"</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Comprender las dependencias: Un estudio de los retos de coordinación en el desarrollo de software</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">Sobre el autor</h3><p>Zhifeng Zhang es un ingeniero senior de DevOps en Zilliz.com que trabaja en Milvus, una base de datos vectorial de código abierto, e instructor autorizado de la universidad de software de código abierto LF en China. Obtuvo su licenciatura en Internet de las Cosas (IOT) en el Instituto de Ingeniería de Software de Guangzhou. Dedica su carrera a participar y dirigir proyectos en el área de CI/CD, DevOps, gestión de infraestructuras de TI, conjunto de herramientas Cloud-Native, contenerización y optimización de procesos de compilación.</p>
