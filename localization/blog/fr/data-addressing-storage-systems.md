---
id: data-addressing-storage-systems.md
title: >-
  Une plongée en profondeur dans l'adressage des données dans les systèmes de
  stockage : De HashMap à HDFS, Kafka, Milvus et Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  Découvrez comment fonctionne l'adressage des données, de HashMap à HDFS,
  Kafka, Milvus et Iceberg, et pourquoi les emplacements de calcul l'emportent
  sur la recherche à toutes les échelles.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Si vous travaillez sur des systèmes dorsaux ou des systèmes de stockage distribués, vous avez probablement vu cela : le réseau n'est pas saturé, les machines ne sont pas surchargées, mais une simple recherche déclenche des milliers d'entrées/sorties de disque ou d'appels à l'API de stockage d'objets - et la requête prend toujours quelques secondes.</p>
<p>Le goulot d'étranglement est rarement la bande passante ou le calcul. C'est l'<em>adressage</em>, c'est-à-dire le travail qu'effectue un système pour déterminer où se trouvent les données avant de pouvoir les lire. L'<strong>adressage des données</strong> consiste à traduire un identifiant logique (une clé, un chemin d'accès à un fichier, un décalage, un prédicat de requête) en emplacement physique des données sur le support de stockage. À grande échelle, c'est ce processus - et non le transfert de données proprement dit - qui domine la latence.</p>
<p>Les performances de stockage peuvent être ramenées à un modèle simple :</p>
<blockquote>
<p><strong>Coût total d'adressage = accès aux métadonnées + accès aux données.</strong></p>
</blockquote>
<p>Presque toutes les optimisations du stockage - des tables de hachage aux couches de métadonnées Lakehouse - visent cette équation. Les techniques varient, mais l'objectif est toujours le même : localiser les données avec le moins d'opérations à forte latence possible.</p>
<p>Cet article retrace cette idée à travers des systèmes d'échelle croissante - des structures de données en mémoire comme HashMap, aux systèmes distribués comme HDFS et Apache Kafka, et enfin aux moteurs modernes comme <a href="https://milvus.io/">Milvus</a> (une <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a>) et Apache Iceberg qui opèrent sur le stockage d'objets. Malgré leurs différences, ils optimisent tous la même équation.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Trois techniques d'adressage principales<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans l'ensemble des systèmes de stockage et des moteurs distribués, la plupart des optimisations d'adressage relèvent de trois techniques :</p>
<ul>
<li><strong>Calcul</strong> - Dériver l'emplacement des données directement à partir d'une formule, au lieu de balayer ou de parcourir les structures pour les trouver.</li>
<li><strong>Mise en cache</strong> - Conserver en mémoire les métadonnées ou les index auxquels on accède fréquemment afin d'éviter les lectures répétées à forte latence à partir du disque ou d'un stockage distant.</li>
<li><strong>Élagage</strong> - Utiliser les informations de plage ou les limites des partitions pour exclure les fichiers, les fragments ou les nœuds qui ne peuvent pas contenir le résultat.</li>
</ul>
<p>Dans cet article, on entend par <em>accès</em> toute opération ayant un coût réel au niveau du système : une lecture sur disque, un appel réseau ou une demande d'API de stockage d'objets. Les calculs de l'unité centrale au niveau de la nanoseconde ne comptent pas. Ce qui compte, c'est de réduire le nombre d'opérations d'E/S ou de transformer des E/S aléatoires coûteuses en lectures séquentielles moins onéreuses.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Comment fonctionne l'adressage : Le problème des deux sommes<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour rendre l'adressage plus concret, considérons un problème algorithmique classique. Étant donné un tableau d'entiers <code translate="no">nums</code> et une valeur cible <code translate="no">target</code>, il faut renvoyer les indices de deux nombres dont la somme est égale à <code translate="no">target</code>.</p>
<p>Par exemple : <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → résultat <code translate="no">[0, 1]</code>.</p>
<p>Ce problème illustre clairement la différence entre la recherche de données et le calcul de leur emplacement.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Solution 1 : Recherche par force brute</h3><p>L'approche par force brute vérifie chaque paire. Pour chaque élément, elle parcourt le reste du tableau à la recherche d'une correspondance. C'est simple, mais O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Il n'y a aucune notion de l'endroit où la réponse pourrait se trouver. Chaque recherche part de zéro et parcourt le tableau à l'aveugle. Le goulot d'étranglement n'est pas l'arithmétique, mais le balayage répété.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Solution 2 : adressage direct par calcul</h3><p>La solution optimisée remplace le balayage par une table de hachage. Au lieu de rechercher une valeur correspondante, elle calcule la valeur nécessaire et la recherche directement. La complexité temporelle tombe à O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>Le changement : au lieu de parcourir le tableau pour trouver une correspondance, vous calculez ce dont vous avez besoin et allez directement à son emplacement. Une fois que l'emplacement peut être dérivé, la traversée disparaît.</p>
<p>C'est la même idée qui sous-tend tous les systèmes de stockage haute performance que nous examinerons : remplacer les balayages par des calculs, et les chemins de recherche indirects par un adressage direct.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap : Comment les adresses calculées remplacent les balayages<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>Une table de hachage (HashMap) stocke des paires clé-valeur et localise les valeurs en calculant une adresse à partir de la clé, et non en effectuant une recherche parmi les entrées. À partir d'une clé, il applique une fonction de hachage, calcule un indice de tableau et passe directement à cet emplacement. Aucun balayage n'est nécessaire.</p>
<p>Il s'agit de la forme la plus simple du principe qui sous-tend tous les systèmes présentés dans cet article : éviter les balayages en déduisant les emplacements par le calcul. La même idée - qui sous-tend tout, des recherches de métadonnées distribuées aux <a href="https://zilliz.com/learn/vector-index">index vectoriels</a> - se retrouve à toutes les échelles.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">La structure de données de base</h3><p>À la base, une table de hachage est construite autour d'une structure unique : un tableau. Une fonction de hachage associe des clés à des index de tableau. L'espace des clés étant beaucoup plus grand que le tableau, les collisions sont inévitables : des clés différentes peuvent correspondre au même index. Ces collisions sont gérées localement dans chaque emplacement à l'aide d'une liste chaînée ou d'un arbre rouge-noir.</p>
<p>Les tableaux permettent un accès en temps constant par index. Cette propriété - l'adressage direct et prévisible - est le fondement des performances de la table de hachage et le même principe qui sous-tend l'accès efficace aux données dans les systèmes de stockage à grande échelle.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Comment une table de hachage localise-t-elle les données ?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Adressage étape par étape dans une table de hachage : hachage de la clé, calcul de l'index du tableau, saut direct au seau et résolution locale - ce qui permet d'obtenir une recherche O(1) sans traversée.</span> </span></p>
<p>Prenons l'exemple de <code translate="no">put(&quot;apple&quot;, 100)</code>. L'ensemble de la recherche se fait en quatre étapes, sans balayage complet de la table :</p>
<ol>
<li><strong>Hacher la clé :</strong> Passage de la clé par une fonction de hachage → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Mapper vers un index de tableau :</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → par exemple, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Sauter au seau :</strong> Accéder directement à <code translate="no">table[10]</code> - un seul accès à la mémoire, pas une traversée.</li>
<li><strong>Résoudre localement :</strong> S'il n'y a pas de collision, lire ou écrire immédiatement. En cas de collision, vérifier une petite liste chaînée ou un arbre rouge-noir à l'intérieur du seau.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Pourquoi la consultation d'une table de hachage est-elle O(1) ?</h3><p>L'accès aux tableaux est O(1) en raison d'une formule d'adressage simple :</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Compte tenu d'un index, l'adresse mémoire est calculée à l'aide d'une multiplication et d'une addition. Le coût est fixe quelle que soit la taille du tableau : un calcul, une lecture en mémoire. Une liste chaînée, en revanche, doit être parcourue nœud par nœud, en suivant des pointeurs à travers des emplacements de mémoire distincts : O(n) dans le pire des cas.</p>
<p>Une table de hachage (HashMap) transforme une clé en un index de tableau, transformant ce qui serait une traversée en une adresse calculée. Au lieu de rechercher des données, il calcule exactement l'emplacement des données et s'y rend.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Comment l'adressage change-t-il dans les systèmes distribués ?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap résout le problème de l'adressage au sein d'une seule machine, où les données se trouvent en mémoire et où les coûts d'accès sont négligeables. À plus grande échelle, les contraintes changent radicalement :</p>
<table>
<thead>
<tr><th>Facteur d'échelle</th><th>Impact</th></tr>
</thead>
<tbody>
<tr><td>Taille des données</td><td>Mégaoctets → téraoctets ou pétaoctets dans les clusters</td></tr>
<tr><td>Support de stockage</td><td>Mémoire → disque → réseau → stockage d'objets</td></tr>
<tr><td>Latence d'accès</td><td>Mémoire : ~100 ns / Disque : 10-20 ms / Réseau Same-DC : ~0,5 ms / Transrégion : ~150 ms</td></tr>
</tbody>
</table>
<p>Le problème de l'adressage ne change pas - il devient simplement plus coûteux. Chaque consultation peut impliquer des sauts de réseau et des E/S sur disque, de sorte que la réduction du nombre d'accès est beaucoup plus importante qu'en mémoire.</p>
<p>Pour voir comment les systèmes réels gèrent ce problème, nous allons examiner deux exemples classiques. HDFS applique l'adressage basé sur le calcul aux fichiers volumineux basés sur des blocs. Kafka l'applique aux flux de messages en mode append-only. Les deux systèmes suivent le même principe : calculer où se trouvent les données au lieu de les rechercher.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS : adressage de fichiers volumineux avec des métadonnées en mémoire<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS est un système de <a href="https://milvus.io/docs/architecture_overview.md">stockage distribué</a> conçu pour les fichiers très volumineux répartis sur des grappes de machines. Étant donné un chemin de fichier et un décalage d'octets, il doit trouver le bon bloc de données et le DataNode qui le stocke.</p>
<p>HDFS résout ce problème par un choix de conception délibéré : conserver toutes les métadonnées du système de fichiers en mémoire.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Organisation des données HDFS montrant la vue logique d'un fichier de 300 Mo mappé sur le stockage physique sous la forme de trois blocs distribués sur les DataNodes avec réplication.</span> </span></p>
<p>Au centre se trouve le NameNode. Il charge l'ensemble de l'arborescence du système de fichiers - structure des répertoires, mappages fichier-bloc et mappages bloc-DataNode - dans la mémoire. Comme les métadonnées ne touchent jamais le disque pendant les lectures, HDFS résout toutes les questions d'adressage en effectuant uniquement des recherches en mémoire.</p>
<p>Conceptuellement, il s'agit de HashMap à l'échelle d'un cluster : utiliser des structures de données en mémoire pour transformer les recherches lentes en recherches rapides et calculées. La différence est que HDFS applique le même principe à des ensembles de données répartis sur des milliers de machines.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Comment HDFS localise-t-il les données ?</h3><p>Considérons la lecture de données au niveau du décalage de 200 Mo de <code translate="no">/user/data/bigfile.txt</code>, avec une taille de bloc par défaut de 128 Mo :</p>
<ol>
<li>Le client envoie une seule RPC au NameNode</li>
<li>Le NameNode résout le chemin d'accès au fichier et calcule que le décalage de 200 Mo se situe dans le deuxième bloc (plage de 128 à 256 Mo) - entièrement en mémoire.</li>
<li>Le NameNode renvoie les DataNodes stockant ce bloc (par exemple, DN2 et DN3).</li>
<li>Le client lit directement dans le DataNode le plus proche (DN2).</li>
</ol>
<p>Coût total : une RPC, quelques recherches en mémoire, une lecture de données. Les métadonnées n'atteignent jamais le disque au cours de ce processus, et chaque consultation est à temps constant. HDFS évite les balayages de métadonnées coûteux, même lorsque les données évoluent sur de grands clusters.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka : Comment l'indexation éparse évite les E/S aléatoires<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka est conçu pour les flux de messages à haut débit. Étant donné le décalage d'un message, il doit localiser la position exacte de l'octet sur le disque, sans transformer les lectures en E/S aléatoires.</p>
<p>Kafka combine le stockage séquentiel avec un index clairsemé en mémoire. Au lieu de chercher dans les données, il calcule un emplacement approximatif et effectue un petit balayage limité.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>L'organisation des données Kafka montre une vue logique avec des sujets et des partitions mappés sur le stockage physique en tant que répertoires de partition contenant des fichiers segment .log, .index et .timeindex.</span> </span></p>
<p>Les messages sont organisés sous la forme Topic → Partition → Segment. Chaque partition est un journal annexe divisé en segments, chacun d'entre eux étant composé de :</p>
<ul>
<li>un fichier <code translate="no">.log</code> stockant les messages de manière séquentielle sur le disque</li>
<li>un fichier <code translate="no">.index</code> qui sert d'index clair dans le journal.</li>
</ul>
<p>Le fichier <code translate="no">.index</code> est mappé en mémoire (mmap), de sorte que les recherches d'index sont effectuées directement à partir de la mémoire, sans E/S sur le disque.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Conception de l'index clairsemé de Kafka montrant une entrée d'index pour 4 Ko de données, avec comparaison de la mémoire : un index dense de 800 Mo contre un index clairsemé de seulement 2 Mo résidant en mémoire.</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Comment Kafka localise-t-il les données ?</h3><p>Supposons qu'un consommateur lise le message à l'offset 500 000. Kafka résout ce problème en trois étapes :</p>
<p><strong>1. Localiser le segment</strong> (TreeMap lookup)</p>
<ul>
<li>Offsets de base du segment : <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Fichier cible : <code translate="no">00000000000000367834.log</code></li>
<li>Complexité temporelle : O(log S), où S est le nombre de segments (typiquement &lt; 100)</li>
</ul>
<p><strong>2. Recherche de la position dans l'index clair</strong> (.index)</p>
<ul>
<li>Décalage relatif : <code translate="no">500000 − 367834 = 132166</code></li>
<li>Recherche binaire dans <code translate="no">.index</code>: trouver la plus grande entrée ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Complexité temporelle : O(log N), où N est le nombre d'entrées de l'index.</li>
</ul>
<p><strong>3. Lecture séquentielle du journal</strong> (.log)</p>
<ul>
<li>Commencer la lecture à partir de la position 20 500 000</li>
<li>Continuer jusqu'à ce que le décalage 500 000 soit atteint</li>
<li>Au plus un intervalle d'index (~4 KB) est analysé</li>
</ul>
<p>Total : une recherche de segment en mémoire, une recherche d'index, une lecture séquentielle courte. Pas d'accès aléatoire au disque.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Dimension</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Objectif de conception</td><td>Stockage et lecture efficaces de fichiers massifs</td><td>Lecture/écriture séquentielle à haut débit de flux de messages</td></tr>
<tr><td>Modèle d'adressage</td><td>Chemin → bloc → DataNode via des HashMaps en mémoire</td><td>Décalage → segment → position via un index clair + un balayage séquentiel</td></tr>
<tr><td>Stockage des métadonnées</td><td>Centralisé dans la mémoire du NameNode</td><td>Fichiers locaux, mappés en mémoire via mmap</td></tr>
<tr><td>Coût d'accès par consultation</td><td>1 RPC + N lectures de blocs</td><td>1 consultation d'index + 1 lecture de données</td></tr>
<tr><td>Optimisation clé</td><td>Toutes les métadonnées sont en mémoire - pas de disque dans le chemin de recherche</td><td>Indexation éparse + disposition séquentielle évitant les E/S aléatoires</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Pourquoi le stockage d'objets modifie le problème d'adressage<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>De HashMap à HDFS et Kafka, nous avons vu l'adressage en mémoire et dans le stockage distribué classique. Au fur et à mesure que les charges de travail évoluent, les exigences ne cessent de croître :</p>
<ul>
<li><strong>Des requêtes plus riches.</strong> Les systèmes modernes gèrent les filtres à champs multiples, la <a href="https://zilliz.com/glossary/similarity-search">recherche par similarité</a> et les prédicats complexes, et non plus simplement les clés et les décalages.</li>
<li><strong>Le stockage d'objets par défaut.</strong> Les données sont de plus en plus souvent stockées dans des magasins compatibles S3. Les fichiers sont répartis dans des buckets, et chaque accès est un appel API avec une latence fixe de l'ordre de dizaines de millisecondes - même pour quelques kilo-octets.</li>
</ul>
<p>À ce stade, c'est la latence - et non la bande passante - qui constitue le goulot d'étranglement. Une seule requête GET S3 coûte environ 50 ms, quelle que soit la quantité de données renvoyées. Si une requête déclenche des milliers de demandes de ce type, le temps de latence total explose. La minimisation de la dispersion des API devient la contrainte centrale de la conception.</p>
<p>Nous examinerons deux systèmes modernes - <a href="https://milvus.io/">Milvus</a>, une <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a>, et Apache Iceberg, un format de table Lakehouse - pour voir comment ils relèvent ces défis. Malgré leurs différences, les deux systèmes appliquent les mêmes idées de base : minimiser les accès à forte latence, réduire le fan-out dès le début et favoriser le calcul par rapport à la traversée.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1 : Quand le stockage sur site crée trop de fichiers<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une base de données vectorielles très répandue, conçue pour la <a href="https://zilliz.com/glossary/similarity-search">recherche de similarités</a> sur des <a href="https://zilliz.com/glossary/vector-embeddings">intégrations vectorielles</a>. Sa conception initiale du stockage reflète une première approche courante du stockage d'objets : stocker chaque champ séparément.</p>
<p>Dans V1, chaque champ d'une <a href="https://milvus.io/docs/manage-collections.md">collection</a> est stocké dans des fichiers binlog distincts à travers les <a href="https://milvus.io/docs/glossary.md">segments</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>La présentation du stockage de Milvus V1 montre une collection divisée en segments, chaque segment stockant des champs tels que l'identifiant, le vecteur et les données scalaires dans des fichiers binlog distincts, ainsi que des fichiers stats_log distincts pour les statistiques des fichiers.</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Comment Milvus V1 localise-t-il les données ?</h3><p>Considérons une requête simple : <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Recherche de métadonnées</strong> - Interroger etcd/MySQL pour obtenir la liste des segments → Lire le champ d'identification dans les segments <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Lire le champ id dans tous les segments</strong> - Pour chaque segment, lire les fichiers binlog id</li>
<li><strong>Localiser la ligne cible</strong> - Analyser les données d'identification chargées pour trouver la<strong>ligne cible</strong>. <code translate="no">id = 123</code></li>
<li><strong>Lire le champ vectoriel</strong> - Lire les fichiers binlogs vectoriels correspondants pour le segment correspondant</li>
</ol>
<p>Nombre total d'accès aux fichiers : <strong>N × (F₁ + F₂ + ...)</strong> où N = nombre de segments, F = fichiers binlog par champ.</p>
<p>Le calcul devient vite compliqué. Pour une collection comportant 100 champs, 1 000 segments et 5 fichiers binlog par champ :</p>
<blockquote>
<p><strong>1 000 × 100 × 5 = 500 000 fichiers</strong></p>
</blockquote>
<p>Même si une requête ne concerne que trois champs, cela représente 15 000 appels à l'API de stockage d'objets. À raison de 50 ms par requête S3, la latence sérialisée atteint <strong>750 secondes</strong>, soit plus de 12 minutes pour une seule requête.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2 : Comment le Parquet au niveau du segment réduit les appels d'API de 10x<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour remédier aux limites d'évolutivité de la V1, Milvus V2 apporte un changement fondamental : organiser les données par <a href="https://milvus.io/docs/glossary.md">segment</a> plutôt que par champ. Plutôt que de nombreux petits fichiers binlog, la version 2 consolide les données dans des fichiers Parquet basés sur les segments.</p>
<p>Le nombre de fichiers passe de <code translate="no">N × fields × binlogs</code> à environ <code translate="no">N</code> (un groupe de fichiers par segment).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Schéma de stockage de Milvus V2 montrant un segment stocké sous forme de fichiers Parquet avec des groupes de lignes contenant des blocs de colonnes pour l'identifiant, le vecteur et l'horodatage, ainsi qu'un pied de page avec des statistiques sur le schéma et les colonnes</span> </span></p>
<p>Mais V2 ne stocke pas tous les champs dans un seul fichier. Il regroupe les champs par taille :</p>
<ul>
<li>Les<strong>petits <a href="https://milvus.io/docs/scalar_index.md">champs scalaires</a></strong> (comme l'identifiant, l'horodatage) sont stockés ensemble.</li>
<li>Les<strong>champs de grande taille</strong> (comme les <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">vecteurs denses</a>) sont répartis dans des fichiers spécifiques.</li>
</ul>
<p>Tous les fichiers appartiennent au même segment et les lignes sont alignées par index entre les fichiers.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Structure d'un fichier Parquet montrant des groupes de lignes avec des morceaux de colonnes et des pages de données compressées, ainsi qu'un pied de page contenant des métadonnées sur le fichier, des métadonnées sur le groupe de lignes et des statistiques sur les colonnes, telles que les valeurs min/max.</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Comment Milvus V2 localise-t-il les données ?</h3><p>Pour la même requête - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Consultation des métadonnées</strong> - Extraction de la liste des segments → Lecture des pieds de page du Parquet - Extraction des lignes de données <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Lire les pieds de page du Parquet</strong> - Extraire les statistiques des groupes de lignes. Vérifier le min/max de la colonne id par groupe de lignes. <code translate="no">id = 123</code> se trouve dans le groupe de lignes 0 (min=1, max=1000).</li>
<li><strong>Ne lire que ce qui est nécessaire</strong> - L'élagage des colonnes de Parquet ne lit que la colonne id dans le fichier à petits champs et que la colonne <a href="https://milvus.io/docs/index-vector-fields.md">vectorielle</a> dans le fichier à grands champs. Seuls les groupes de lignes correspondants sont consultés.</li>
</ol>
<p>L'élagage des champs de grande taille présente deux avantages majeurs :</p>
<ul>
<li><strong>Des lectures plus efficaces.</strong> Les <a href="https://zilliz.com/glossary/vector-embeddings">encastrements vectoriels</a> dominent la taille du stockage. Mélangés à de petits champs, ils limitent le nombre de lignes que peut contenir un groupe de lignes, ce qui augmente le nombre d'accès aux fichiers. En les isolant, les groupes de lignes de petits champs peuvent contenir beaucoup plus de lignes, tandis que les grands champs utilisent des mises en page optimisées pour leur taille.</li>
<li><strong>Évolution souple du <a href="https://milvus.io/docs/schema.md">schéma</a>.</strong> L'ajout d'une colonne implique la création d'un nouveau fichier. En supprimer une signifie l'ignorer au moment de la lecture. Aucune réécriture des données historiques n'est nécessaire.</li>
</ul>
<p>Résultat : le nombre de fichiers est divisé par plus de 10, le nombre d'appels à l'API par plus de 10 et la latence des requêtes passe de quelques minutes à quelques secondes.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs. V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Aspect</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Organisation des fichiers</td><td>Divisé par champ</td><td>Intégré par segment</td></tr>
<tr><td>Fichiers par collection</td><td>N × champs × binlogs</td><td>~N × groupes de colonnes</td></tr>
<tr><td>Format de stockage</td><td>Journal d'archive personnalisé</td><td>Parquet (supporte également Lance et Vortex)</td></tr>
<tr><td>Élagage des colonnes</td><td>Naturel (fichiers au niveau des champs)</td><td>Élagage des colonnes Parquet</td></tr>
<tr><td>Statistiques</td><td>Fichiers stats_log séparés</td><td>Intégrées dans le pied de page Parquet</td></tr>
<tr><td>Appels à l'API S3 par requête</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Temps de latence des requêtes</td><td>Minutes</td><td>Secondes</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg : Élagage des fichiers en fonction des métadonnées<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg gère des tables analytiques sur des ensembles de données massifs dans des systèmes Lakehouse. Lorsqu'une table s'étend sur des milliers de fichiers de données, le défi consiste à restreindre une requête aux seuls fichiers pertinents, sans tout analyser.</p>
<p>La réponse d'Iceberg : décider quels fichiers lire <em>avant toute</em> entrée/sortie de données, en utilisant des métadonnées en couches. Il s'agit du même principe que celui qui sous-tend le <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">filtrage des métadonnées</a> dans les bases de données vectorielles : utiliser des statistiques précalculées pour ignorer les données non pertinentes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Organisation des données d'Iceberg montrant un répertoire de métadonnées avec metadata.json, des listes de manifestes et des fichiers manifestes à côté d'un répertoire de données avec des fichiers Parquet partitionnés par date.</span> </span></p>
<p>Iceberg utilise une structure de métadonnées en couches. Chaque couche filtre les données non pertinentes avant que la suivante ne soit consultée - dans un esprit similaire à celui des <a href="https://milvus.io/docs/architecture_overview.md">bases de données distribuées</a> qui séparent les métadonnées des données pour un accès efficace.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Architecture en quatre couches d'Iceberg : metadata.json pointe vers des listes de manifestes, qui référencent des fichiers manifestes contenant des statistiques au niveau des fichiers, qui pointent vers les fichiers de données Parquet.</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Comment Iceberg localise-t-il les données ?</h3><p>Considérez : <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Lire metadata.json</strong> (1 E/S) - Charger l'instantané actuel et ses listes de manifestes</li>
<li><strong>Lire la liste des manifestes</strong> (1 E/S) - Appliquer des filtres <a href="https://milvus.io/docs/use-partition-key.md">au niveau des parti</a>tions pour ignorer des partitions entières (par exemple, toutes les données de 2023 sont éliminées).</li>
<li><strong>Lecture des fichiers manifestes</strong> (2 E/S) - Utilisation de statistiques au niveau des fichiers (date min/max, quantité min/max) pour éliminer les fichiers qui ne correspondent pas à la requête.</li>
<li><strong>Lecture des fichiers de données</strong> (3 E/S) - Seuls trois fichiers restent et sont effectivement lus.</li>
</ol>
<p>Au lieu d'analyser les 1 000 fichiers de données, Iceberg effectue la recherche en <strong>7 opérations d'E/S</strong>, ce qui permet d'éviter plus de 94 % des lectures inutiles.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Comment les différents systèmes traitent les données<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Système</th><th>Organisation des données</th><th>Mécanisme d'adressage principal</th><th>Coût d'accès</th></tr>
</thead>
<tbody>
<tr><td>Carte de hachage</td><td>Clé → emplacement du tableau</td><td>Fonction de hachage → index direct</td><td>Accès mémoire O(1)</td></tr>
<tr><td>HDFS</td><td>Chemin → bloc → DataNode</td><td>HashMaps en mémoire + calcul du bloc</td><td>1 RPC + N lectures de blocs</td></tr>
<tr><td>Kafka</td><td>Sujet → Partition → Segment</td><td>TreeMap + index clairsemé + balayage séquentiel</td><td>1 consultation d'index + 1 lecture de données</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Collection</a> → Segment → Colonnes Parquet</td><td>Consultation des métadonnées + élagage des colonnes</td><td>N lectures (N = segments)</td></tr>
<tr><td>Iceberg</td><td>Table → Instantané → Manifeste → Fichiers de données</td><td>Métadonnées en couches + élagage statistique</td><td>3 lectures de métadonnées + M lectures de données</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Trois principes derrière l'adressage efficace des données<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Le calcul l'emporte toujours sur la recherche</h3><p>Dans tous les systèmes que nous avons examinés, l'optimisation la plus efficace suit la même règle : calculer où se trouvent les données au lieu de les rechercher.</p>
<ul>
<li>HashMap calcule l'index d'un tableau à partir de <code translate="no">hash(key)</code> au lieu d'effectuer un balayage</li>
<li>HDFS calcule le bloc cible à partir d'un offset de fichier au lieu de parcourir les métadonnées du système de fichiers.</li>
<li>Kafka calcule le segment pertinent et la position de l'index au lieu de parcourir le journal.</li>
<li>Iceberg utilise des prédicats et des statistiques au niveau des fichiers pour déterminer quels fichiers valent la peine d'être lus.</li>
</ul>
<p>Le calcul est une opération arithmétique à coût fixe. La recherche est une traversée - comparaisons, recherche de pointeurs ou E/S - et son coût augmente avec la taille des données. Lorsqu'un système peut déduire directement un emplacement, la recherche devient inutile.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Minimiser les accès à forte latence</h3><p>Cela nous ramène à la formule de base : <strong>Coût total d'adressage = accès aux métadonnées + accès aux données.</strong> Chaque optimisation vise en fin de compte à réduire ces opérations à forte latence.</p>
<table>
<thead>
<tr><th>Modèle</th><th>Exemple</th></tr>
</thead>
<tbody>
<tr><td>Réduire le nombre de fichiers pour limiter la dispersion des API</td><td>Consolidation des segments de Milvus V2</td></tr>
<tr><td>Utiliser des statistiques pour exclure des données à un stade précoce</td><td>Élagage du manifeste de l'iceberg</td></tr>
<tr><td>Mise en cache des métadonnées en mémoire</td><td>HDFS NameNode, Kafka mmap indexes</td></tr>
<tr><td>Échange de petits balayages séquentiels contre moins de lectures aléatoires</td><td>Index clairsemé de Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Les statistiques permettent de prendre des décisions rapides</h3><p>L'enregistrement d'informations simples au moment de l'écriture - valeurs min/max, limites de partition, nombre de lignes - permet aux systèmes de décider au moment de la lecture quels fichiers valent la peine d'être lus et lesquels peuvent être entièrement ignorés.</p>
<p>Il s'agit d'un petit investissement qui rapporte beaucoup. Les statistiques transforment l'accès aux fichiers d'une lecture aveugle en un choix délibéré. Qu'il s'agisse de l'élagage au niveau du manifeste d'Iceberg ou des statistiques du pied de page Parquet de Milvus V2, le principe est le même : quelques octets de métadonnées au moment de l'écriture peuvent éliminer des milliers d'opérations d'E/S au moment de la lecture.</p>
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
    </button></h2><p>De Two Sum à HashMap, et de HDFS et Kafka à Milvus et Apache Iceberg, un schéma se répète : les performances dépendent de l'efficacité avec laquelle un système localise les données.</p>
<p>Au fur et à mesure que les données augmentent et que le stockage passe de la mémoire au disque et au stockage d'objets, les mécanismes changent, mais les idées de base ne changent pas. Les meilleurs systèmes calculent les emplacements au lieu de chercher, gardent les métadonnées à proximité et utilisent les statistiques pour éviter de toucher aux données qui n'ont pas d'importance. Tous les gains de performance que nous avons examinés proviennent de la réduction des accès à forte latence et de la réduction de l'espace de recherche le plus tôt possible.</p>
<p>Que vous conceviez un pipeline de <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle</a>, que vous construisiez des systèmes sur des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a> ou que vous optimisiez un moteur de requête de type "lakehouse", la même équation s'applique. Comprendre comment votre système traite les données est la première étape pour le rendre plus rapide.</p>
<hr>
<p>Si vous travaillez avec Milvus et souhaitez optimiser vos performances de stockage ou de requête, nous serions ravis de vous aider :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> pour poser des questions, partager votre architecture et apprendre d'autres ingénieurs travaillant sur des problèmes similaires.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session Milvus Office Hours gratuite de 20 minutes</a> pour étudier votre cas d'utilisation, qu'il s'agisse de l'agencement du stockage, de l'optimisation des requêtes ou de la mise à l'échelle vers la production.</li>
<li>Si vous préférez ignorer l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour commencer.</li>
</ul>
<hr>
<p>Quelques questions qui se posent lorsque les ingénieurs commencent à réfléchir à l'adressage des données et à la conception du stockage :</p>
<p><strong>Q : Pourquoi Milvus est-il passé d'un stockage au niveau du champ à un stockage au niveau du segment ?</strong></p>
<p>Dans Milvus V1, chaque champ était stocké dans des fichiers binlog distincts dans les segments. Pour une collection comportant 100 champs et 1 000 segments, cela créait des centaines de milliers de petits fichiers, chacun nécessitant son propre appel API S3. V2 consolide les données dans des fichiers Parquet basés sur les segments, réduisant le nombre de fichiers de plus de 10 fois et diminuant la latence des requêtes de quelques minutes à quelques secondes. L'idée maîtresse : sur le stockage objet, le nombre d'appels API importe plus que le volume total de données.</p>
<p><strong>Q : Comment Milvus gère-t-il efficacement la recherche vectorielle et le filtrage scalaire ?</strong></p>
<p>Milvus V2 stocke les <a href="https://milvus.io/docs/scalar_index.md">champs scalaires</a> et les <a href="https://milvus.io/docs/index-vector-fields.md">champs vectoriels</a> dans des groupes de fichiers distincts au sein du même segment. Les requêtes scalaires utilisent l'élagage des colonnes Parquet et les statistiques de groupes de lignes pour ignorer les données non pertinentes. La <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle</a> utilise des <a href="https://zilliz.com/learn/vector-index">index vectoriels</a> dédiés. Les deux partagent la même structure de segment, de sorte que <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">les requêtes hybrides</a> - combinant les filtres scalaires avec la similarité vectorielle - peuvent opérer sur les mêmes données sans duplication.</p>
<p><strong>Q : Le principe de la "primauté du calcul sur la recherche" s'applique-t-il aux bases de données vectorielles ?</strong></p>
<p>Oui. Les <a href="https://zilliz.com/learn/vector-index">index vectoriels</a> tels que HNSW et IVF reposent sur la même idée. Au lieu de comparer un vecteur interrogé à chaque vecteur stocké (recherche brute), ils utilisent des structures de graphe ou des centroïdes de grappes pour calculer des voisinages approximatifs et sauter directement aux régions pertinentes de l'espace vectoriel. Le compromis - une petite perte de précision pour une réduction de plusieurs ordres de grandeur des calculs de distance - est le même modèle de "calcul plutôt que de recherche" appliqué aux données d'<a href="https://zilliz.com/glossary/vector-embeddings">intégration à</a> haute dimension.</p>
<p><strong>Q : Quelle est la plus grande erreur de performance commise par les équipes avec le stockage objet ?</strong></p>
<p>La création d'un trop grand nombre de petits fichiers. Chaque requête S3 GET a un temps de latence fixe (~50 ms), quelle que soit la quantité de données qu'elle renvoie. Un système qui lit 10 000 petits fichiers sérialise 500 secondes de latence - même si le volume total de données est modeste. La solution est la consolidation : fusionner les petits fichiers dans les plus grands, utiliser des formats en colonnes comme Parquet pour les lectures sélectives, et maintenir des métadonnées qui vous permettent d'ignorer complètement des fichiers.</p>
