---
id: molecular-structure-similarity-with-milvus.md
title: Introdução
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Como efetuar uma análise de semelhança da estrutura molecular no Milvus
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Acelerar a descoberta de novos medicamentos</custom-h1><h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>A descoberta de medicamentos, enquanto fonte de inovação na medicina, é uma parte importante da investigação e desenvolvimento de novos medicamentos. A descoberta de medicamentos é implementada através da seleção e confirmação de alvos. Quando são descobertos fragmentos ou compostos principais, os compostos semelhantes são normalmente pesquisados em bibliotecas de compostos internas ou comerciais, a fim de descobrir a relação estrutura-atividade (SAR) e a disponibilidade de compostos, avaliando assim o potencial dos compostos principais para serem optimizados em compostos candidatos.</p>
<p>Para descobrir compostos disponíveis no espaço de fragmentos de bibliotecas de compostos à escala de milhares de milhões, a impressão digital química é normalmente recuperada para pesquisa de subestruturas e pesquisa de semelhanças. No entanto, a solução tradicional é morosa e propensa a erros quando se trata de impressões digitais químicas de elevada dimensão e em milhares de milhões de dimensões. Alguns compostos potenciais podem também perder-se no processo. Este artigo aborda a utilização do Milvus, um motor de pesquisa de semelhanças para vectores de grande escala, com o RDKit para criar um sistema de pesquisa de semelhanças de estruturas químicas de elevado desempenho.</p>
<p>Em comparação com os métodos tradicionais, o Milvus tem uma velocidade de pesquisa mais rápida e uma cobertura mais alargada. Ao processar impressões digitais químicas, o Milvus pode efetuar pesquisa de subestruturas, pesquisa de semelhanças e pesquisa exacta em bibliotecas de estruturas químicas, a fim de descobrir medicamentos potencialmente disponíveis.</p>
<h2 id="System-overview" class="common-anchor-header">Descrição geral do sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema utiliza o RDKit para gerar impressões digitais químicas e o Milvus para efetuar a pesquisa por semelhança de estruturas químicas. Consulte https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search para saber mais sobre o sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Geração de impressões digitais químicas<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>As impressões digitais químicas são normalmente utilizadas para pesquisa de subestruturas e pesquisa de semelhanças. A imagem seguinte mostra uma lista sequencial representada por bits. Cada dígito representa um elemento, um par de átomos ou um grupo funcional. A estrutura química é <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identifying-patterns-molecules.png</span> </span></p>
<p>Podemos utilizar o RDKit para gerar impressões digitais Morgan, que define um raio a partir de um átomo específico e calcula o número de estruturas químicas dentro do intervalo do raio para gerar uma impressão digital química. Especifique valores diferentes para o raio e os bits para obter as impressões digitais químicas de diferentes estruturas químicas. As estruturas químicas são representadas no formato SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Pesquisa de estruturas químicas<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Podemos então importar as impressões digitais de Morgan para o Milvus para criar uma base de dados de estruturas químicas. Com diferentes impressões digitais químicas, o Milvus pode efetuar uma pesquisa de subestruturas, uma pesquisa de semelhanças e uma pesquisa exacta.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Pesquisa de subestruturas</h3><p>Verifica se uma estrutura química contém outra estrutura química.</p>
<h3 id="Similarity-search" class="common-anchor-header">Pesquisa de semelhanças</h3><p>Procura estruturas químicas semelhantes. A distância de Tanimoto é utilizada como métrica por defeito.</p>
<h3 id="Exact-search" class="common-anchor-header">Pesquisa exacta</h3><p>Verifica se existe uma estrutura química especificada. Este tipo de pesquisa requer uma correspondência exacta.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Computação de impressões digitais químicas<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>A distância de Tanimoto é frequentemente utilizada como uma métrica para impressões digitais químicas. Em Milvus, a distância de Jaccard corresponde à distância de Tanimoto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-computing-chem-fingerprings-table-1.png</span> </span></p>
<p>Com base nos parâmetros anteriores, o cálculo das impressões digitais químicas pode ser descrito da seguinte forma</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Podemos ver que <code translate="no">1- Jaccard = Tanimoto</code>. Aqui utilizamos Jaccard em Milvus para calcular a impressão digital química, o que é de facto consistente com a distância de Tanimoto.</p>
<h2 id="System-demo" class="common-anchor-header">Demonstração do sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Para demonstrar melhor o funcionamento do sistema, criámos uma demonstração que utiliza o Milvus para pesquisar mais de 90 milhões de impressões digitais químicas. Os dados utilizados provêm de ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. A interface inicial tem o seguinte aspeto:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>Podemos pesquisar estruturas químicas específicas no sistema e obter estruturas químicas semelhantes:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa por semelhança é indispensável numa série de domínios, como as imagens e os vídeos. Para a descoberta de medicamentos, a pesquisa por semelhança pode ser aplicada a bases de dados de estruturas químicas para descobrir compostos potencialmente disponíveis, que são depois convertidos em sementes para síntese prática e testes no local de tratamento. O Milvus, enquanto motor de pesquisa por semelhança de código aberto para vectores de caraterísticas em grande escala, foi concebido com uma arquitetura de computação heterogénea para obter a melhor relação custo-eficácia. As pesquisas em vectores à escala de milhares de milhões demoram apenas milissegundos com recursos computacionais mínimos. Assim, Milvus pode ajudar a implementar uma pesquisa precisa e rápida de estruturas químicas em domínios como a biologia e a química.</p>
<p>Pode aceder à demonstração visitando http://40.117.75.127:8002/, e não se esqueça de visitar também o nosso GitHub https://github.com/milvus-io/milvus para saber mais!</p>
