---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: El sistema de búsqueda por imágenes de segunda generación
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Un caso de usuario que aprovecha Milvus para crear un sistema de búsqueda de
  similitud de imágenes para empresas del mundo real.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>El viaje hacia la optimización de la búsqueda de imágenes a escala de miles de millones (2/2)</custom-h1><p>Este artículo es la segunda parte de <strong>The Journey to Optimizing Billion-scale Image Search de UPYUN</strong>. Si se perdió la primera, haga clic <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">aquí</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">El sistema de búsqueda por imágenes de segunda generación<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de búsqueda por imágenes de segunda generación opta técnicamente por la solución CNN + Milvus. El sistema se basa en vectores de características y ofrece un mejor soporte técnico.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Extracción de características<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>En el campo de la visión por ordenador, el uso de la inteligencia artificial se ha convertido en la corriente principal. Del mismo modo, la extracción de características del sistema de búsqueda por imágenes de segunda generación utiliza redes neuronales convolucionales (CNN) como tecnología subyacente.</p>
<p>El término CNN es difícil de entender. Aquí nos centraremos en responder a dos preguntas:</p>
<ul>
<li>¿Qué puede hacer una CNN?</li>
<li>¿Por qué puedo utilizar CNN para una búsqueda de imágenes?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Hay muchas competiciones en el campo de la IA y la clasificación de imágenes es una de las más importantes. El trabajo de la clasificación de imágenes consiste en determinar si el contenido de la imagen se refiere a un gato, un perro, una manzana, una pera u otros tipos de objetos.</p>
<p>¿Qué puede hacer la CNN? Puede extraer características y reconocer objetos. Extrae características de múltiples dimensiones y mide lo cerca que están las características de una imagen de las características de gatos o perros. Podemos elegir las más parecidas como resultado de la identificación, lo que indica si el contenido de una imagen concreta es un gato, un perro u otra cosa.</p>
<p>¿Cuál es la relación entre la función de identificación de objetos de la CNN y la búsqueda por imágenes? Lo que queremos no es el resultado final de la identificación, sino el vector de características extraído de múltiples dimensiones. Los vectores de características de dos imágenes con contenido similar deben estar próximos.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">¿Qué modelo de CNN debo utilizar?</h3><p>La respuesta es VGG16. ¿Por qué elegirlo? En primer lugar, VGG16 tiene una buena capacidad de generalización, es decir, es muy versátil. En segundo lugar, los vectores de características extraídos por VGG16 tienen 512 dimensiones. Si hay muy pocas dimensiones, la precisión puede verse afectada. Si hay demasiadas dimensiones, el coste de almacenar y calcular estos vectores de características es relativamente alto.</p>
<p>El uso de CNN para extraer las características de las imágenes es una solución habitual. Podemos utilizar VGG16 como modelo y Keras + TensorFlow para la implementación técnica. Aquí está el ejemplo oficial de Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>Las características extraídas aquí son vectores de características.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalización</h3><p>Para facilitar las operaciones posteriores, a menudo normalizamos las características:</p>
<p>Lo que se utiliza posteriormente es también el normalizado <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Descripción de la imagen</h3><p>La imagen se carga utilizando el método <code translate="no">image.load_img</code> de <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>De hecho, es el método TensorFlow llamado por Keras. Para más detalles, consulte la documentación de TensorFlow. El objeto imagen final es en realidad una instancia de PIL Image (el PIL utilizado por TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Conversión de bytes</h3><p>En términos prácticos, el contenido de las imágenes se transmite a menudo a través de la red. Por lo tanto, en lugar de cargar imágenes desde la ruta, preferimos convertir los datos de bytes directamente en objetos imagen, es decir, Imágenes PIL:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>El img anterior es el mismo que el resultado obtenido por el método image.load_img. Hay que prestar atención a dos cosas:</p>
<ul>
<li>Debes hacer la conversión RGB.</li>
<li>Debes redimensionar (redimensionar es el segundo parámetro del <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Tratamiento del borde negro</h3><p>Las imágenes, como las capturas de pantalla, pueden tener ocasionalmente bastantes bordes negros. Estos bordes negros no tienen ningún valor práctico y causan muchas interferencias. Por esta razón, eliminar los bordes negros es una práctica habitual.</p>
<p>Un borde negro es esencialmente una fila o columna de píxeles donde todos los píxeles son (0, 0, 0) (imagen RGB). Eliminar el borde negro consiste en encontrar estas filas o columnas y borrarlas. Esto es en realidad una multiplicación de matriz 3D en NumPy.</p>
<p>Un ejemplo de eliminación de bordes negros horizontales:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>Esto es más o menos lo que quiero hablar sobre el uso de CNN para extraer características de la imagen e implementar otro procesamiento de imágenes. Ahora echemos un vistazo a los motores de búsqueda vectorial.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Motor de búsqueda vectorial<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>El problema de extraer vectores de características de las imágenes está resuelto. Los problemas restantes son:</p>
<ul>
<li>¿Cómo almacenar los vectores de características?</li>
<li>El motor de búsqueda vectorial de código abierto Milvus puede resolver estos dos problemas. Hasta ahora, ha funcionado bien en nuestro entorno de producción.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, el motor de búsqueda vectorial<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Extraer vectores de características de una imagen no es suficiente. También tenemos que gestionar dinámicamente estos vectores de características (adición, eliminación y actualización), calcular la similitud de los vectores y devolver los datos vectoriales en el rango del vecino más cercano. El motor de búsqueda de vectores de código abierto Milvus realiza estas tareas bastante bien.</p>
<p>El resto de este artículo describirá prácticas específicas y puntos a tener en cuenta.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Requisitos de la CPU</h3><p>Para utilizar Milvus, su CPU debe soportar el conjunto de instrucciones avx2. Para sistemas Linux, utilice el siguiente comando para comprobar qué conjuntos de instrucciones soporta su CPU:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Entonces obtendrá algo como</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>Lo que sigue a las banderas son los conjuntos de instrucciones que soporta su CPU. Por supuesto, esto es mucho más de lo que necesito. Sólo quiero ver si un conjunto de instrucciones específico, como avx2, está soportado. Simplemente añade un grep para filtrarlo:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Si no devuelve ningún resultado, significa que ese conjunto de instrucciones específico no está soportado. Necesitas cambiar tu máquina entonces.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Planificación de la capacidad</h3><p>La planificación de la capacidad es nuestra primera consideración cuando diseñamos un sistema. ¿Cuántos datos necesitamos almacenar? ¿Cuánta memoria y espacio en disco necesitan?</p>
<p>Hagamos unos cálculos rápidos. Cada dimensión de un vector es float32. Un tipo float32 ocupa 4 Bytes. Entonces, un vector de 512 dimensiones requiere 2 KB de almacenamiento. Por la misma razón:</p>
<ul>
<li>Mil vectores de 512 dimensiones requieren 2 MB de almacenamiento.</li>
<li>Un millón de vectores de 512 dimensiones requieren 2 GB de almacenamiento.</li>
<li>10 millones de vectores de 512 dimensiones requieren 20 GB de almacenamiento.</li>
<li>100 millones de vectores de 512 dimensiones requieren 200 GB de almacenamiento.</li>
<li>Mil millones de vectores de 512 dimensiones requieren 2 TB de almacenamiento.</li>
</ul>
<p>Si queremos almacenar todos los datos en la memoria, entonces el sistema necesita al menos la capacidad de memoria correspondiente.</p>
<p>Se recomienda utilizar la herramienta oficial de cálculo del tamaño: Milvus sizing tool.</p>
<p>En realidad, nuestra memoria puede no ser tan grande. (No importa realmente si no tienes suficiente memoria. Milvus descarga automáticamente los datos en el disco). Además de los datos vectoriales originales, también tenemos que tener en cuenta el almacenamiento de otros datos, como los registros.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Configuración del sistema</h3><p>Para más información sobre la configuración del sistema, consulte la documentación de Milvus:</p>
<ul>
<li>Configuración del servidor Milvus: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Diseño de la base de datos</h3><p><strong>Colección y partición</strong></p>
<ul>
<li>Colección también se conoce como tabla.</li>
<li>Partición se refiere a las particiones dentro de una colección.</li>
</ul>
<p>La implementación subyacente de la partición es en realidad la misma que la de la colección, excepto que una partición está bajo una colección. Pero con las particiones, la organización de los datos es más flexible. También podemos consultar una partición específica de una colección para obtener mejores resultados.</p>
<p>¿Cuántas colecciones y particiones podemos tener? La información básica sobre colecciones y particiones está en Metadatos. Milvus utiliza SQLite (integración interna de Milvus) o MySQL (requiere conexión externa) para la gestión interna de metadatos. Si utiliza SQLite por defecto para gestionar Metadatos, sufrirá graves pérdidas de rendimiento cuando el número de colecciones y particiones sea demasiado grande. Por lo tanto, el número total de colecciones y particiones no debería exceder de 50.000 (Milvus 0.8.0 limitará este número a 4.096). Si necesita establecer un número mayor, se recomienda que utilice MySQL a través de una conexión externa.</p>
<p>La estructura de datos soportada por la colección y partición de Milvus es muy simple, es decir, <code translate="no">ID + vector</code>. En otras palabras, sólo hay dos columnas en la tabla: ID y datos vectoriales.</p>
<p><strong>Nota:</strong></p>
<ul>
<li>ID deben ser números enteros.</li>
<li>Debemos asegurarnos de que el ID es único dentro de una colección y no dentro de una partición.</li>
</ul>
<p><strong>Filtrado condicional</strong></p>
<p>Cuando utilizamos bases de datos tradicionales, podemos especificar valores de campo como condiciones de filtrado. Aunque Milvus no filtra exactamente de la misma manera, podemos implementar un filtrado condicional simple utilizando colecciones y particiones. Por ejemplo, tenemos una gran cantidad de datos de imágenes y los datos pertenecen a usuarios específicos. Entonces podemos dividir los datos en particiones por usuario. Por lo tanto, utilizar el usuario como condición de filtrado es en realidad especificar la partición.</p>
<p><strong>Datos estructurados y mapeo vectorial</strong></p>
<p>Milvus sólo admite la estructura de datos ID + vector. Pero en los escenarios empresariales, lo que necesitamos son datos estructurados con significado empresarial. En otras palabras, necesitamos encontrar datos estructurados a través de vectores. En consecuencia, necesitamos mantener las relaciones de mapeo entre datos estructurados y vectores a través de ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Selección del índice</strong></p>
<p>Puede consultar los siguientes artículos:</p>
<ul>
<li>Tipos de índice: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Cómo seleccionar el índice: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Procesamiento de los resultados de búsqueda</h3><p>Los resultados de búsqueda de Milvus son una colección de ID + distancia:</p>
<ul>
<li>ID: el ID de una colección.</li>
<li>Distancia: un valor de distancia de 0 ~ 1 indica el nivel de similitud; cuanto menor es el valor, más similares son los dos vectores.</li>
</ul>
<p><strong>Filtrado de datos cuyo ID es -1</strong></p>
<p>Cuando el número de colecciones es demasiado pequeño, los resultados de la búsqueda pueden contener datos cuyo ID es -1. Tenemos que filtrarlos nosotros mismos. Debemos filtrarlos nosotros mismos.</p>
<p><strong>Paginación</strong></p>
<p>La búsqueda de vectores es bastante diferente. Los resultados de la consulta se ordenan en orden descendente de similitud, y se selecciona el más similar (topK) de los resultados (topK es especificado por el usuario en el momento de la consulta).</p>
<p>Milvus no permite la paginación. Tenemos que implementar la función de paginación por nosotros mismos si lo necesitamos para el negocio. Por ejemplo, si tenemos diez resultados en cada página y sólo queremos mostrar la tercera página, tenemos que especificar que topK = 30 y sólo devolver los últimos diez resultados.</p>
<p><strong>Umbral de similitud para empresas</strong></p>
<p>La distancia entre los vectores de dos imágenes está comprendida entre 0 y 1. Si queremos decidir si dos imágenes son similares en un escenario empresarial específico, necesitamos especificar un umbral dentro de este rango. Las dos imágenes son similares si la distancia es menor que el umbral, o son muy diferentes entre sí si la distancia es mayor que el umbral. Es necesario ajustar el umbral para satisfacer sus propias necesidades de negocio.</p>
<blockquote>
<p>Este artículo ha sido escrito por rifewang, usuario de Milvus e ingeniero de software de UPYUN. Si te gusta este artículo, bienvenido a venir a decir hola @ https://github.com/rifewang.</p>
</blockquote>
