---
id: molecular-structure-similarity-with-milvus.md
title: Introducción
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Cómo realizar análisis de similitud de estructuras moleculares en Milvus
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Acelerar el descubrimiento de nuevos fármacos</custom-h1><h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>El descubrimiento de fármacos, como fuente de innovación en medicina, es una parte importante de la investigación y el desarrollo de nuevos medicamentos. El descubrimiento de fármacos se lleva a cabo mediante la selección y confirmación de dianas. Cuando se descubren fragmentos o compuestos principales, se suelen buscar compuestos similares en bibliotecas de compuestos internas o comerciales con el fin de descubrir la relación estructura-actividad (SAR), la disponibilidad de compuestos, evaluando así el potencial de los compuestos principales para ser optimizados como compuestos candidatos.</p>
<p>Para descubrir compuestos disponibles en el espacio de fragmentos de bibliotecas de compuestos a escala de miles de millones, se suele recuperar la huella química para la búsqueda de subestructuras y similitudes. Sin embargo, la solución tradicional requiere mucho tiempo y es propensa a errores cuando se trata de huellas químicas de alta dimensión a escala de miles de millones. Además, algunos compuestos potenciales pueden perderse en el proceso. Este artículo analiza el uso de Milvus, un motor de búsqueda de similitudes para vectores a gran escala, con RDKit para construir un sistema de búsqueda de similitudes de estructuras químicas de alto rendimiento.</p>
<p>En comparación con los métodos tradicionales, Milvus tiene una velocidad de búsqueda más rápida y una cobertura más amplia. Al procesar huellas químicas, Milvus puede realizar búsquedas de subestructuras, similitudes y búsquedas exactas en bibliotecas de estructuras químicas para descubrir medicamentos potencialmente disponibles.</p>
<h2 id="System-overview" class="common-anchor-header">Visión general del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema utiliza RDKit para generar huellas químicas y Milvus para realizar búsquedas por similitud de estructuras químicas. Consulte https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search para obtener más información sobre el sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Generación de huellas químicas<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Las huellas químicas suelen utilizarse para la búsqueda de subestructuras y la búsqueda de similitudes. La siguiente imagen muestra una lista secuencial representada por bits. Cada dígito representa un elemento, un par de átomos o un grupo funcional. La estructura química es <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identificación-patrones-moléculas.png</span> </span></p>
<p>Podemos utilizar RDKit para generar huellas Morgan, que define un radio a partir de un átomo específico y calcula el número de estructuras químicas dentro del rango del radio para generar una huella química. Especifique diferentes valores para el radio y los bits para obtener las huellas químicas de diferentes estructuras químicas. Las estructuras químicas se representan en formato SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Búsqueda de estructuras químicas<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación, podemos importar las huellas Morgan en Milvus para construir una base de datos de estructuras químicas. Con diferentes huellas químicas, Milvus puede realizar búsquedas de subestructuras, búsquedas de similitudes y búsquedas exactas.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Búsqueda por subestructura</h3><p>Comprueba si una estructura química contiene otra estructura química.</p>
<h3 id="Similarity-search" class="common-anchor-header">Búsqueda por similitud</h3><p>Busca estructuras químicas similares. Por defecto, se utiliza la distancia de Tanimoto como métrica.</p>
<h3 id="Exact-search" class="common-anchor-header">Búsqueda exacta</h3><p>Comprueba si existe una estructura química especificada. Este tipo de búsqueda requiere una coincidencia exacta.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Cálculo de huellas químicas<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>La distancia de Tanimoto se utiliza a menudo como métrica para las huellas químicas. En Milvus, la distancia de Jaccard se corresponde con la distancia de Tanimoto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-computing-chem-fingerprings-table-1.png</span> </span></p>
<p>Basándose en los parámetros anteriores, el cálculo de huellas dactilares químicas puede describirse como:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Podemos ver que <code translate="no">1- Jaccard = Tanimoto</code>. Aquí utilizamos Jaccard en Milvus para calcular la huella química, que en realidad es coherente con la distancia de Tanimoto.</p>
<h2 id="System-demo" class="common-anchor-header">Demostración del sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Para demostrar mejor cómo funciona el sistema, hemos construido una demo que utiliza Milvus para buscar más de 90 millones de huellas químicas. Los datos utilizados proceden de ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. La interfaz inicial tiene el siguiente aspecto:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-sistema-demo-1.jpg</span> </span></p>
<p>Podemos buscar estructuras químicas especificadas en el sistema y nos devuelve estructuras químicas similares:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-sistema-demo-2.gif</span> </span></p>
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
    </button></h2><p>La búsqueda por similitud es indispensable en numerosos campos, como las imágenes y los vídeos. En el descubrimiento de fármacos, la búsqueda por similitud puede aplicarse a bases de datos de estructuras químicas para descubrir compuestos potencialmente disponibles, que luego se convierten en semillas para la síntesis práctica y las pruebas en el punto de atención. Milvus, como motor de búsqueda de similitudes de código abierto para vectores de características a escala masiva, está construido con una arquitectura informática heterogénea para obtener la mejor rentabilidad. Las búsquedas en vectores a escala de miles de millones sólo tardan milisegundos con recursos informáticos mínimos. De este modo, Milvus puede ayudar a implementar búsquedas precisas y rápidas de estructuras químicas en campos como la biología y la química.</p>
<p>Puede acceder a la demo visitando http://40.117.75.127:8002/, ¡y no olvide visitar también nuestro GitHub https://github.com/milvus-io/milvus para obtener más información!</p>
