---
id: molecular-structure-similarity-with-milvus.md
title: Introduction
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: >-
  Comment effectuer une analyse de similarité de structure moléculaire dans
  Milvus ?
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Accélérer la découverte de nouveaux médicaments</custom-h1><h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>La découverte de médicaments, source d'innovation médicale, est un élément important de la recherche et du développement de nouveaux médicaments. La découverte de médicaments est mise en œuvre par la sélection et la confirmation de la cible. Lorsque des fragments ou des composés principaux sont découverts, des composés similaires sont généralement recherchés dans des bibliothèques de composés internes ou commerciales afin de découvrir la relation structure-activité (SAR), la disponibilité des composés, et d'évaluer ainsi le potentiel des composés principaux à être optimisés pour devenir des composés candidats.</p>
<p>Afin de découvrir les composés disponibles dans l'espace des fragments des bibliothèques de composés à l'échelle du milliard, l'empreinte chimique est généralement récupérée pour la recherche de sous-structure et la recherche de similarité. Cependant, la solution traditionnelle prend du temps et est sujette aux erreurs lorsqu'il s'agit d'empreintes chimiques à haute dimension à l'échelle du milliard. Certains composés potentiels peuvent également être perdus au cours du processus. Cet article traite de l'utilisation de Milvus, un moteur de recherche de similarité pour les vecteurs à grande échelle, avec RDKit pour construire un système de recherche de similarité de structure chimique à haute performance.</p>
<p>Par rapport aux méthodes traditionnelles, Milvus a une vitesse de recherche plus rapide et une couverture plus large. En traitant les empreintes chimiques, Milvus peut effectuer une recherche de sous-structure, une recherche de similarité et une recherche exacte dans les bibliothèques de structures chimiques afin de découvrir des médicaments potentiellement disponibles.</p>
<h2 id="System-overview" class="common-anchor-header">Présentation du système<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système utilise RDKit pour générer des empreintes chimiques et Milvus pour effectuer une recherche de similarité de structure chimique. Pour en savoir plus sur le système, consultez le site https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Génération d'empreintes chimiques<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Les empreintes chimiques sont généralement utilisées pour la recherche de sous-structures et la recherche de similarités. L'image suivante montre une liste séquentielle représentée par des bits. Chaque chiffre représente un élément, une paire d'atomes ou des groupes fonctionnels. La structure chimique est <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identifying-patterns-molecules.png</span> </span></p>
<p>Nous pouvons utiliser RDKit pour générer des empreintes Morgan, qui définit un rayon à partir d'un atome spécifique et calcule le nombre de structures chimiques dans la plage du rayon pour générer une empreinte chimique. Spécifiez différentes valeurs pour le rayon et les bits afin d'obtenir les empreintes chimiques de différentes structures chimiques. Les structures chimiques sont représentées au format SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Recherche de structures chimiques<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous pouvons ensuite importer les empreintes de Morgan dans Milvus pour créer une base de données de structures chimiques. Avec différentes empreintes chimiques, Milvus peut effectuer une recherche de sous-structure, une recherche de similarité et une recherche exacte.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Recherche de sous-structure</h3><p>Vérifie si une structure chimique contient une autre structure chimique.</p>
<h3 id="Similarity-search" class="common-anchor-header">Recherche de similarité</h3><p>Recherche de structures chimiques similaires. La distance de Tanimoto est utilisée par défaut comme métrique.</p>
<h3 id="Exact-search" class="common-anchor-header">Recherche exacte</h3><p>Vérifie si une structure chimique spécifiée existe. Ce type de recherche nécessite une correspondance exacte.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Calcul des empreintes chimiques<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>La distance de Tanimoto est souvent utilisée comme métrique pour les empreintes chimiques. Dans Milvus, la distance de Jaccard correspond à la distance de Tanimoto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-calcul des empreintes chimiques-tableau-1.png</span> </span></p>
<p>Sur la base des paramètres précédents, le calcul des empreintes chimiques peut être décrit comme suit :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-calcul des empreintes chimiques-tableau-2.png</span> </span></p>
<p>Nous pouvons constater que <code translate="no">1- Jaccard = Tanimoto</code>. Ici, nous utilisons Jaccard dans Milvus pour calculer l'empreinte chimique, ce qui est en fait cohérent avec la distance de Tanimoto.</p>
<h2 id="System-demo" class="common-anchor-header">Démonstration du système<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour mieux démontrer le fonctionnement du système, nous avons créé une démonstration qui utilise Milvus pour rechercher plus de 90 millions d'empreintes chimiques. Les données utilisées proviennent de ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. L'interface initiale se présente comme suit :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>Nous pouvons rechercher des structures chimiques spécifiées dans le système et obtenir des structures chimiques similaires :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche de similitudes est indispensable dans un certain nombre de domaines, tels que les images et les vidéos. Pour la découverte de médicaments, la recherche de similitudes peut être appliquée aux bases de données de structures chimiques pour découvrir des composés potentiellement disponibles, qui sont ensuite convertis en semences pour la synthèse pratique et les tests au point d'intervention. Milvus, en tant que moteur de recherche de similarités open-source pour les vecteurs de caractéristiques à grande échelle, est construit avec une architecture informatique hétérogène pour une meilleure rentabilité. Les recherches sur des vecteurs à l'échelle du milliard ne prennent que quelques millisecondes avec un minimum de ressources informatiques. Milvus peut donc contribuer à la mise en œuvre d'une recherche précise et rapide de structures chimiques dans des domaines tels que la biologie et la chimie.</p>
<p>Vous pouvez accéder à la démo en visitant http://40.117.75.127:8002/, et n'oubliez pas de visiter notre GitHub https://github.com/milvus-io/milvus pour en savoir plus !</p>
