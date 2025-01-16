---
id: inside-milvus-1.1.0.md
title: Novas funcionalidades
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  O Milvus v1.1.0 chegou! Novas funcionalidades, melhorias e correcções de erros
  já estão disponíveis.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Por dentro do Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">O Milvus</a> é um projeto contínuo de software de código aberto (OSS) focado na construção da base de dados vetorial mais rápida e fiável do mundo. As novas funcionalidades do Milvus v1.1.0 são as primeiras de muitas actualizações que estão para vir, graças ao apoio a longo prazo da comunidade open-source e ao patrocínio da Zilliz. Este artigo do blogue aborda as novas funcionalidades, melhorias e correcções de erros incluídas no Milvus v1.1.0.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#new-features">Novas funcionalidades</a></li>
<li><a href="#improvements">Melhorias</a></li>
<li><a href="#bug-fixes">Correcções de erros</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Novas funcionalidades<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Como qualquer projeto OSS, Milvus é um trabalho perpétuo em progresso. Esforçamo-nos por ouvir os nossos utilizadores e a comunidade open-source para dar prioridade às funcionalidades mais importantes. A última atualização, Milvus v1.1.0, oferece as seguintes novas funcionalidades:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Especificar partições com <code translate="no">get_entity_by_id()</code> chamadas de método</h3><p>Para acelerar ainda mais a pesquisa de semelhança de vectores, o Milvus 1.1.0 suporta agora a obtenção de vectores a partir de uma partição especificada. Geralmente, o Milvus suporta a consulta de vectores através de IDs de vectores especificados. No Milvus 1.0, chamar o método <code translate="no">get_entity_by_id()</code> pesquisa toda a coleção, o que pode ser demorado para grandes conjuntos de dados. Como podemos ver no código abaixo, <code translate="no">GetVectorsByIdHelper</code> utiliza uma estrutura <code translate="no">FileHolder</code> para percorrer e encontrar um vetor específico.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>No entanto, esta estrutura não é filtrada por nenhuma partição em <code translate="no">FilesByTypeEx()</code>. Em Milvus v1.1.0, é possível para o sistema passar nomes de partições para o loop <code translate="no">GetVectorsIdHelper</code> para que o <code translate="no">FileHolder</code> contenha apenas segmentos de partições especificadas. Por outras palavras, se souber exatamente a que partição pertence o vetor para uma pesquisa, pode especificar o nome da partição numa chamada ao método <code translate="no">get_entity_by_id()</code> para acelerar o processo de pesquisa.</p>
<p>Não só fizemos modificações no código que controla as consultas do sistema ao nível do servidor Milvus, como também actualizámos todos os nossos SDK (Python, Go, C++, Java e RESTful) adicionando um parâmetro para especificar nomes de partições. Por exemplo, em pymilvus, a definição de <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> é alterada para <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Especificar partições com <code translate="no">delete_entity_by_id()</code> chamadas de método</h3><p>Para tornar a gestão de vectores mais eficiente, o Milvus v1.1.0 suporta agora a especificação de nomes de partições quando se elimina um vetor numa coleção. No Milvus 1.0, os vectores de uma coleção só podem ser eliminados por ID. Ao chamar o método delete, o Milvus irá procurar todos os vectores da coleção. No entanto, é muito mais eficiente analisar apenas as partições relevantes quando se trabalha com conjuntos de dados massivos de milhões, biliões ou mesmo triliões de vectores. Semelhante ao novo recurso para especificar partições com chamadas de método <code translate="no">get_entity_by_id()</code>, foram feitas modificações no código do Milvus usando a mesma lógica.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Novo método <code translate="no">release_collection()</code></h3><p>Para libertar a memória que o Milvus utilizava para carregar colecções em tempo de execução, foi adicionado um novo método <code translate="no">release_collection()</code> no Milvus v1.1.0 para descarregar manualmente colecções específicas da cache.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Melhorias<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora as novas funcionalidades estejam na moda, também é importante melhorar o que já temos. O que se segue são actualizações e outras melhorias gerais em relação ao Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Melhoria do desempenho da chamada do método <code translate="no">get_entity_by_id()</code> </h3><p>O gráfico abaixo é uma comparação do desempenho da pesquisa vetorial entre o Milvus v1.0 e o Milvus v1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Tamanho do ficheiro de segmento = 1024 MB <br/>Contagem de linhas = 1.000.000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">Número de ID da consulta</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib atualizado para v0.5.0</h3><p>O Milvus adopta várias bibliotecas de índices amplamente utilizadas, incluindo Faiss, NMSLIB, Hnswlib e Annoy para simplificar o processo de escolha do tipo de índice correto para um determinado cenário.</p>
<p>A Hnswlib foi actualizada da v0.3.0 para a v0.5.0 no Milvus 1.1.0 devido a um erro detectado na versão anterior. Além disso, a atualização da Hnswlib melhora o desempenho de <code translate="no">addPoint()</code> na construção de índices.</p>
<p>Um desenvolvedor Zilliz criou um pull request (PR) para melhorar o desempenho da Hnswlib durante a construção de índices no Milvus. Veja <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> para detalhes.</p>
<p>O gráfico abaixo é uma comparação do desempenho da <code translate="no">addPoint()</code> entre a Hnswlib 0.5.0 e o PR proposto:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Conjunto de dados: sift_1M (contagem de linhas = 1000000, dim = 128, espaço = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construction = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_construction = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Desempenho melhorado da formação de índices FIV</h3><p>A criação de um índice inclui treinamento, inserção e gravação de dados no disco. O Milvus 1.1.0 melhora a componente de formação da construção de índices. O gráfico abaixo é uma comparação do desempenho do treinamento do índice FIV entre o Milvus 1.0 e o Milvus 1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Conjunto de dados: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Correcções de erros<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Também corrigimos alguns erros para tornar o Milvus mais estável e eficiente na gestão de conjuntos de dados vectoriais. Veja <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Problemas corrigidos</a> para mais detalhes.</p>
