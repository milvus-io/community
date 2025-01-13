---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Meilleures pratiques pour l'index FIV
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Comment sélectionner les paramètres d'index pour l'index FIV</custom-h1><p>Les meilleures pratiques <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">pour la configuration</a> de Milvus ont été présentées dans l'article <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Meilleures pratiques</a> pour la configuration de Milvus 0.6.0. Dans cet article, nous présenterons également quelques bonnes pratiques pour définir des paramètres clés dans les clients Milvus pour des opérations telles que la création d'une table, la création d'index et la recherche. Ces paramètres peuvent affecter les performances de recherche.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la création d'une table, le paramètre index_file_size est utilisé pour spécifier la taille, en Mo, d'un fichier unique pour le stockage des données. La valeur par défaut est 1024. Lors de l'importation de données vectorielles, Milvus combine progressivement les données dans des fichiers. Lorsque la taille du fichier atteint index_file_size, ce fichier n'accepte pas de nouvelles données et Milvus enregistre les nouvelles données dans un autre fichier. Il s'agit de fichiers de données brutes. Lorsqu'un index est créé, Milvus génère un fichier d'index pour chaque fichier de données brutes. Pour le type d'index IVFLAT, la taille du fichier d'index est approximativement égale à la taille du fichier de données brutes correspondant. Pour l'index SQ8, la taille d'un fichier d'index est d'environ 30 % du fichier de données brutes correspondant.</p>
<p>Au cours d'une recherche, Milvus examine chaque fichier d'index un par un. D'après notre expérience, lorsque la taille du fichier d'index passe de 1024 à 2048, les performances de recherche s'améliorent de 30 à 50 %. Toutefois, si la valeur est trop élevée, les fichiers volumineux risquent de ne pas être chargés dans la mémoire GPU (ou même dans la mémoire CPU). Par exemple, si la mémoire du GPU est de 2 Go et que index_file_size est de 3 Go, le fichier d'index ne pourra pas être chargé dans la mémoire du GPU. En général, nous fixons la taille du fichier d'index à 1024 Mo ou 2048 Mo.</p>
<p>Le tableau suivant montre un test utilisant sift50m pour index_file_size. Le type d'index est SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>Nous pouvons voir qu'en mode CPU et en mode GPU, lorsque index_file_size est de 2048 Mo au lieu de 1024 Mo, les performances de recherche s'améliorent de manière significative.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>et</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Le paramètre <code translate="no">nlist</code> est utilisé pour la création de l'index et le paramètre <code translate="no">nprobe</code> est utilisé pour la recherche. IVFLAT et SQ8 utilisent tous deux des algorithmes de regroupement pour diviser un grand nombre de vecteurs en grappes, ou buckets. <code translate="no">nlist</code> est le nombre de buckets pendant le regroupement.</p>
<p>Lors d'une recherche à l'aide d'index, la première étape consiste à trouver un certain nombre d'ensembles les plus proches du vecteur cible et la deuxième étape consiste à trouver les k vecteurs les plus similaires à partir des ensembles en fonction de la distance vectorielle. <code translate="no">nprobe</code> est le nombre d'ensembles lors de la première étape.</p>
<p>En règle générale, l'augmentation de <code translate="no">nlist</code> entraîne une augmentation du nombre de godets et une diminution du nombre de vecteurs dans un godet lors du regroupement. Par conséquent, la charge de calcul diminue et les performances de recherche s'améliorent. Cependant, avec moins de vecteurs pour la comparaison des similitudes, le résultat correct peut être manqué.</p>
<p>L'augmentation de <code translate="no">nprobe</code> entraîne une augmentation du nombre de godets à rechercher. Par conséquent, la charge de calcul augmente et les performances de recherche se détériorent, mais la précision de la recherche s'améliore. La situation peut varier selon les ensembles de données dont la distribution est différente. Vous devez également tenir compte de la taille de l'ensemble de données lorsque vous définissez <code translate="no">nlist</code> et <code translate="no">nprobe</code>. En règle générale, il est recommandé que <code translate="no">nlist</code> soit <code translate="no">4 * sqrt(n)</code>, où n est le nombre total de vecteurs. Comme pour <code translate="no">nprobe</code>, vous devez faire un compromis entre la précision et l'efficacité et la meilleure façon est de déterminer la valeur par essais et erreurs.</p>
<p>Le tableau suivant montre un test utilisant sift50m pour <code translate="no">nlist</code> et <code translate="no">nprobe</code>. Le type d'index est SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>Le tableau compare les performances de recherche et la précision en utilisant différentes valeurs de <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Seuls les résultats GPU sont affichés car les tests CPU et GPU donnent des résultats similaires. Dans ce test, lorsque les valeurs de <code translate="no">nlist</code>/<code translate="no">nprobe</code> augmentent du même pourcentage, la précision de la recherche augmente également. Lorsque <code translate="no">nlist</code> = 4096 et <code translate="no">nprobe</code> est 128, Milvus a les meilleures performances de recherche. En conclusion, lorsque vous déterminez les valeurs de <code translate="no">nlist</code> et <code translate="no">nprobe</code>, vous devez faire un compromis entre les performances et la précision en tenant compte des différents ensembles de données et des exigences.</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Lorsque la taille des données est supérieure à <code translate="no">index_file_size</code>, plus la valeur de <code translate="no">index_file_size</code> est élevée, meilleures sont les performances de recherche.<code translate="no">nlist</code> et <code translate="no">nprobe</code>：Vous devez faire un compromis entre les performances et la précision.</p>
