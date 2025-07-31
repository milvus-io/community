---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Cómo Milvus 2.6 mejora la búsqueda multilingüe de texto completo a escala
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 introduce un proceso de análisis de texto completamente revisado
  con soporte multilingüe completo para la búsqueda de texto completo.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Las aplicaciones modernas de IA son cada vez más complejas. No basta con aplicar un método de búsqueda a un problema y ya está.</p>
<p>Por ejemplo, los sistemas de recomendación requieren <strong>una búsqueda vectorial</strong> para comprender el significado del texto y las imágenes, <strong>un filtrado de metadatos</strong> para limitar los resultados por precio, categoría o ubicación, y <strong>una búsqueda por palabras clave</strong> para consultas directas como "Nike Air Max". Cada método resuelve una parte distinta del problema, y los sistemas del mundo real necesitan que todos ellos trabajen juntos.</p>
<p>El futuro de la búsqueda no consiste en elegir entre vectores y palabras clave. Se trata de combinar vector y palabra clave y filtrado, junto con otros tipos de búsqueda, todo en un mismo lugar. Por eso empezamos a incorporar <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">la búsqueda híbrida</a> a Milvus hace un año, con el lanzamiento de Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Pero la búsqueda de texto completo funciona de forma diferente<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Introducir la búsqueda de texto completo en un sistema vectorial nativo no es fácil. La búsqueda de texto completo tiene sus propios retos.</p>
<p>Mientras que la búsqueda vectorial captura el significado <em>semántico</em> del texto (convirtiéndolo en vectores de alta dimensión), la búsqueda de texto completo depende de la comprensión de <strong>la estructura del lenguaje</strong>: cómo se forman las palabras, dónde empiezan y terminan y cómo se relacionan entre sí. Por ejemplo, cuando un usuario busca "running shoes" en inglés, el texto pasa por varias etapas de procesamiento:</p>
<p><em>Dividir en espacios en blanco → minúsculas → eliminar palabras vacías → convertir &quot;running&quot; en &quot;run&quot;.</em></p>
<p>Para gestionar correctamente este proceso, necesitamos un <strong>analizador de lenguaje</strong>robusto <strong>,</strong>que se encargue de la división, la separación, el filtrado y mucho más.</p>
<p>Cuando introdujimos <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">la búsqueda de texto completo BM25</a> en Milvus 2.5, incluimos un analizador personalizable, y funcionó bien para lo que fue diseñado. Se podía definir un proceso que utilizara tokenizadores, filtros de token y filtros de caracteres para preparar el texto para la indexación y la búsqueda.</p>
<p>Para el inglés, esta configuración era relativamente sencilla. Pero las cosas se complican cuando se trata de varios idiomas.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">El reto de la búsqueda multilingüe de texto completo<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda multilingüe de texto completo plantea una serie de retos:</p>
<ul>
<li><p>Las<strong>lenguas complejas necesitan un tratamiento especial</strong>: Lenguas como el chino, el japonés y el coreano no utilizan espacios entre las palabras. Necesitan tokenizadores avanzados para segmentar los caracteres en palabras significativas. Estas herramientas pueden funcionar bien para una sola lengua, pero rara vez son compatibles con varias lenguas complejas a la vez.</p></li>
<li><p><strong>Incluso lenguas similares pueden entrar en conflicto</strong>: El inglés y el francés pueden utilizar espacios en blanco para separar las palabras, pero una vez que se aplica el procesamiento específico de la lengua, como la separación por raíces o la lematización, las reglas de una lengua pueden interferir con las de la otra. Lo que mejora la precisión en inglés puede distorsionar las consultas en francés, y viceversa.</p></li>
</ul>
<p>En resumen, <strong>cada lengua requiere un analizador distinto</strong>. Tratar de procesar texto chino con un analizador inglés es un fracaso: no hay espacios que separar y las reglas inglesas de lematización pueden corromper los caracteres chinos.</p>
<p>¿Cuál es la conclusión? Confiar en un único tokenizador y analizador para conjuntos de datos multilingües hace casi imposible garantizar una tokenización coherente y de alta calidad en todos los idiomas. Y esto se traduce directamente en un menor rendimiento de las búsquedas.</p>
<p>A medida que los equipos comenzaron a adoptar la búsqueda de texto completo en Milvus 2.5, empezamos a escuchar los mismos comentarios:</p>
<p><em>"Esto es perfecto para nuestras búsquedas en inglés, pero ¿qué pasa con nuestros tickets multilingües de atención al cliente?". "Nos encanta tener búsqueda vectorial y BM25, pero nuestro conjunto de datos incluye contenido en chino, japonés e inglés". "¿Podemos obtener la misma precisión de búsqueda en todos nuestros idiomas?".</em></p>
<p>Estas preguntas confirmaron lo que ya habíamos visto en la práctica: la búsqueda de texto completo difiere fundamentalmente de la búsqueda vectorial. La similitud semántica funciona bien en todos los idiomas, pero una búsqueda de texto precisa requiere un conocimiento profundo de la estructura de cada idioma.</p>
<p>Por este motivo, <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduce un proceso de análisis de texto completamente renovado con soporte multilingüe completo. Este nuevo sistema aplica automáticamente el analizador correcto para cada idioma, lo que permite realizar búsquedas de texto completo precisas y escalables en conjuntos de datos multilingües, sin necesidad de configuración manual y sin comprometer la calidad.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Cómo Milvus 2.6 permite una búsqueda robusta de texto completo multilingüe<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tras una exhaustiva labor de investigación y desarrollo, hemos creado un conjunto de funciones que abordan diferentes situaciones multilingües. Cada enfoque resuelve el problema de la dependencia del idioma a su manera.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Analizador multilingüe: Precisión a través del control</h3><p>El analizador <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>multilingüe</strong></a> le permite definir distintas reglas de procesamiento de texto para diferentes idiomas dentro de la misma colección, en lugar de obligar a todos los idiomas a pasar por el mismo proceso de análisis.</p>
<p><strong>Así es como funciona:</strong> usted configura analizadores específicos para cada idioma y etiqueta cada documento con su idioma durante la inserción. Al realizar una búsqueda BM25, se especifica qué analizador de idioma se utilizará para procesar la consulta. Esto garantiza que tanto el contenido indexado como las consultas de búsqueda se procesen con las reglas óptimas para sus respectivos idiomas.</p>
<p><strong>Ideal para:</strong> Aplicaciones en las que conoce el idioma de su contenido y desea la máxima precisión de búsqueda. Piense en bases de conocimiento multinacionales, catálogos de productos localizados o sistemas de gestión de contenidos específicos de una región.</p>
<p><strong>Requisitos:</strong> Debe proporcionar metadatos lingüísticos para cada documento. Actualmente sólo está disponible para las operaciones de búsqueda BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Identificador de idioma Tokenizer: Detección automática de idiomas</h3><p>Sabemos que etiquetar manualmente cada contenido no siempre es práctico. El <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>tokenizador</strong></a> de <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>identificadores lingü</strong></a> ísticos introduce la detección automática de idiomas directamente en el proceso de análisis de textos.</p>
<p><strong>Funciona de la siguiente manera:</strong> Este tokenizador inteligente analiza el texto entrante, detecta su idioma mediante sofisticados algoritmos de detección y aplica automáticamente las reglas de procesamiento específicas del idioma. Puede configurarlo con varias definiciones de analizador: una para cada idioma que desee admitir, además de un analizador de reserva por defecto.</p>
<p>Admite dos motores de detección: <code translate="no">whatlang</code> para un procesamiento más rápido y <code translate="no">lingua</code> para una mayor precisión. El sistema admite entre 71 y 75 idiomas, en función del detector elegido. Tanto durante la indexación como durante la búsqueda, el tokenizador selecciona automáticamente el analizador adecuado en función del idioma detectado, volviendo a la configuración predeterminada cuando la detección es incierta.</p>
<p><strong>Perfecto para:</strong> Entornos dinámicos con mezcla de idiomas impredecible, plataformas de contenido generado por el usuario o aplicaciones en las que el etiquetado manual de idiomas no es factible.</p>
<p><strong>La contrapartida:</strong> La detección automática añade latencia de procesamiento y puede tener problemas con textos muy cortos o contenidos en varios idiomas. Pero para la mayoría de las aplicaciones del mundo real, la comodidad supera con creces estas limitaciones.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. Tokenizador ICU: Base universal</h3><p>Si las dos primeras opciones le parecen excesivas, tenemos algo más sencillo para usted. Hemos integrado recientemente el<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> tokenizador ICU (International Components for Unicode)</a> en Milvus 2.6. ICU ha existido desde siempre - es un conjunto maduro y ampliamente utilizado de bibliotecas que maneja el procesamiento de texto para toneladas de idiomas y scripts. Lo bueno es que puede manejar varios lenguajes complejos y simples a la vez.</p>
<p>El tokenizador ICU es honestamente una gran opción por defecto. Utiliza reglas estándar Unicode para dividir las palabras, lo que lo hace fiable para docenas de idiomas que no tienen sus propios tokenizadores especializados. Si sólo necesita algo potente y de uso general que funcione bien en varios idiomas, ICU hace el trabajo.</p>
<p><strong>Limitaciones:</strong> ICU sigue funcionando dentro de un único analizador, por lo que todos los idiomas acaban compartiendo los mismos filtros. ¿Quieres hacer cosas específicas para cada idioma, como stemming o lematización? Te encontrarás con los mismos conflictos de los que hemos hablado antes.</p>
<p><strong>Donde realmente brilla:</strong> Hemos creado ICU para que funcione como analizador predeterminado en las configuraciones multilingües o de identificador de idioma. Es básicamente su red de seguridad inteligente para manejar idiomas que no ha configurado explícitamente.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Véalo en acción: Demostración práctica<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Basta de teoría: ¡vamos a codificar! A continuación se explica cómo utilizar las nuevas funciones multilingües de <strong>pymilvus</strong> para crear una colección de búsqueda multilingüe.</p>
<p>Empezaremos definiendo algunas configuraciones reutilizables del analizador y, a continuación, veremos <strong>dos ejemplos completos</strong>:</p>
<ul>
<li><p>Uso del <strong>analizador multil</strong>ingüe</p></li>
<li><p>Uso del <strong>tokenizador de identificadores de idioma</strong></p></li>
</ul>
<p>👉 Para obtener el código de demostración completo, consulte <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">esta página de GitHub</a>.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Paso 1: Configurar el cliente de Milvus</h3><p><em>En primer lugar, nos conectamos a Milvus, establecemos un nombre de colección y limpiamos cualquier colección existente para empezar de cero.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Paso 2: Definir analizadores para múltiples idiomas</h3><p>A continuación, definimos un diccionario <code translate="no">analyzers</code> con configuraciones específicas para cada idioma. Éstas se utilizarán en los dos métodos de búsqueda multilingüe que se muestran más adelante.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Opción A: Utilizar el analizador multilingüe</h3><p>Este método es mejor cuando <strong>se conoce de antemano el idioma de cada documento</strong>. Pasará esa información a través de un campo dedicado de <code translate="no">language</code> durante la inserción de datos.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Crear una colección con el analizador multilingüe</h4><p>Crearemos una colección en la que el campo <code translate="no">&quot;text&quot;</code> utilice diferentes analizadores en función del valor del campo <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Insertar datos multilingües y cargar la colección</h4><p>Ahora inserte documentos en inglés y japonés. El campo <code translate="no">language</code> indica a Milvus qué analizador debe utilizar.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Ejecutar la búsqueda de texto completo</h4><p>Para realizar la búsqueda, especifique qué analizador utilizar para la consulta en función de su idioma.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Resultados:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Opción B: Uso del identificador de idioma Tokenizer</h3><p>Este método le evita la manipulación manual del idioma. El <strong>tokenizador</strong> de <strong>identificadores de idioma</strong> detecta automáticamente el idioma de cada documento y aplica el analizador correcto, sin necesidad de especificar un campo <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Creación de una colección con el tokenizador de identificadores de idioma</h4><p>Aquí creamos una colección en la que el campo <code translate="no">&quot;text&quot;</code> utiliza la detección automática del idioma para elegir el analizador adecuado.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Insertar datos y cargar la colección</h4><p>Inserte texto en diferentes idiomas, sin necesidad de etiquetarlos. Milvus detecta y aplica automáticamente el analizador correcto.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Búsqueda de texto completo</h4><p>Esto es lo mejor: <strong>no es necesario especificar un analizador</strong> al buscar. El tokenizador detecta automáticamente el idioma de la consulta y aplica la lógica correcta.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Resultados</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6 da un gran paso adelante para hacer <strong>la búsqueda híbrida</strong> más potente y accesible, combinando la búsqueda vectorial con la búsqueda por palabras clave, ahora en varios idiomas. Con el soporte multilingüe mejorado, puede crear aplicaciones que entiendan <em>lo que los usuarios quieren decir</em> y <em>lo que dicen</em>, independientemente del idioma que utilicen.</p>
<p>Pero eso es sólo una parte de la actualización. Milvus 2.6 también trae otras características que hacen que la búsqueda sea más rápida, más inteligente y más fácil de trabajar:</p>
<ul>
<li><p><strong>Mejor concordancia de consultas</strong>: utilice <code translate="no">phrase_match</code> y <code translate="no">multi_match</code> para realizar búsquedas más precisas.</p></li>
<li><p><strong>Filtrado JSON más rápido</strong>: gracias a un nuevo índice dedicado a los campos JSON.</p></li>
<li><p><strong>Ordenación basada en escalares</strong>: ordene los resultados por cualquier campo numérico.</p></li>
<li><p><strong>Reordenación avanzada</strong> - Reordene los resultados utilizando modelos o lógica de puntuación personalizada</p></li>
</ul>
<p>¿Quiere el desglose completo de Milvus 2.6? Consulte nuestro último post: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</strong></a><strong>.</strong></p>
<p>¿Tiene preguntas o desea profundizar en alguna característica? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
