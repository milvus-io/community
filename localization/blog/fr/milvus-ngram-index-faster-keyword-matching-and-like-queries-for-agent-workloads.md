---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Présentation de l'index Milvus Ngram : Correspondance plus rapide des
  mots-clés et requêtes LIKE pour les charges de travail des agents
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Découvrez comment l'index Ngram de Milvus accélère les requêtes LIKE en
  transformant la correspondance des sous-chaînes en recherches efficaces de
  n-grammes, ce qui permet d'obtenir des performances 100 fois supérieures.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>Dans les systèmes d'agents, la <strong>recherche de contexte</strong> est un élément fondamental de l'ensemble de la chaîne de production, qui sert de base au raisonnement, à la planification et à l'action en aval. La recherche vectorielle aide les agents à récupérer un contexte sémantiquement pertinent qui capture l'intention et le sens dans des ensembles de données vastes et non structurés. Cependant, la pertinence sémantique seule n'est souvent pas suffisante. Les pipelines d'agents s'appuient également sur la recherche plein texte pour appliquer des contraintes de mots-clés exacts, tels que les noms de produits, les appels de fonctions, les codes d'erreur ou les termes juridiquement significatifs. Cette couche d'appui garantit que le contexte récupéré n'est pas seulement pertinent, mais qu'il répond aussi explicitement à des exigences textuelles strictes.</p>
<p>Les charges de travail réelles reflètent systématiquement ce besoin :</p>
<ul>
<li><p>Les assistants du service clientèle doivent trouver des conversations mentionnant un produit ou un ingrédient spécifique.</p></li>
<li><p>Les copilotes de codage recherchent des extraits contenant le nom exact d'une fonction, un appel API ou une chaîne d'erreur.</p></li>
<li><p>Les agents juridiques, médicaux et universitaires filtrent les documents à la recherche de clauses ou de citations qui doivent apparaître mot pour mot.</p></li>
</ul>
<p>Traditionnellement, les systèmes gèrent cela avec l'opérateur SQL <code translate="no">LIKE</code>. Une requête telle que <code translate="no">name LIKE '%rod%'</code> est simple et largement supportée, mais en cas de forte concurrence et de grands volumes de données, cette simplicité entraîne des coûts de performance importants.</p>
<ul>
<li><p><strong>Sans index</strong>, une requête <code translate="no">LIKE</code> parcourt l'ensemble de la mémoire contextuelle et applique le filtrage ligne par ligne. Avec des millions d'enregistrements, une seule requête peut prendre quelques secondes, ce qui est beaucoup trop lent pour des interactions en temps réel avec un agent.</p></li>
<li><p><strong>Même avec un index inversé conventionnel</strong>, il est difficile d'optimiser les modèles de caractères génériques tels que <code translate="no">%rod%</code>, car le moteur doit toujours parcourir l'ensemble du dictionnaire et exécuter le filtrage sur chaque entrée. L'opération évite les balayages de lignes mais reste fondamentalement linéaire, ce qui n'entraîne que des améliorations marginales.</p></li>
</ul>
<p>Cela crée une lacune évidente dans les systèmes de recherche hybrides : la recherche vectorielle traite efficacement la pertinence sémantique, mais le filtrage des mots clés exacts devient souvent l'étape la plus lente du pipeline.</p>
<p>Milvus prend en charge de manière native la recherche vectorielle et plein texte hybride avec filtrage des métadonnées. Pour remédier aux limites de la correspondance par mots clés, Milvus introduit l'<a href="https://milvus.io/docs/ngram.md"><strong>index Ngram</strong></a>, qui améliore les performances de <code translate="no">LIKE</code> en divisant le texte en petites sous-chaînes et en les indexant pour une recherche efficace. Cela réduit considérablement la quantité de données examinées lors de l'exécution de la requête, ce qui permet d'obtenir des requêtes <code translate="no">LIKE</code> des <strong>dizaines, voire des centaines de fois plus rapides</strong> dans les charges de travail agentiques réelles.</p>
<p>Le reste de ce billet explique comment fonctionne l'index Ngram dans Milvus et évalue ses performances dans des scénarios réels.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Qu'est-ce que l'index Ngram ?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans les bases de données, le filtrage de texte est généralement exprimé à l'aide de <strong>SQL</strong>, le langage de requête standard utilisé pour récupérer et gérer les données. L'un des opérateurs de texte les plus utilisés est <code translate="no">LIKE</code>, qui prend en charge les correspondances de chaînes basées sur des motifs.</p>
<p>Les expressions LIKE peuvent être regroupées en quatre types de motifs courants, en fonction de la manière dont les caractères génériques sont utilisés :</p>
<ul>
<li><p><strong>Correspondance infixe</strong> (<code translate="no">name LIKE '%rod%'</code>) : Correspond aux enregistrements dans lesquels la sous-chaîne rod apparaît n'importe où dans le texte.</p></li>
<li><p><strong>Correspondance préfixe</strong> (<code translate="no">name LIKE 'rod%'</code>) : Recherche les enregistrements dont le texte commence par rod.</p></li>
<li><p><strong>Correspondance avec le suffixe</strong> (<code translate="no">name LIKE '%rod'</code>) : Recherche les enregistrements dont le texte se termine par rod.</p></li>
<li><p><strong>Correspondance par caractères génériques</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>) : Combine plusieurs conditions de sous-chaînes (<code translate="no">%</code>) avec des caractères génériques uniques (<code translate="no">_</code>) dans un seul modèle.</p></li>
</ul>
<p>Bien que ces modèles diffèrent en termes d'apparence et d'expressivité, l'<strong>index Ngram</strong> de Milvus les accélère tous en utilisant la même approche sous-jacente.</p>
<p>Avant de construire l'index, Milvus divise chaque valeur textuelle en courtes sous-chaînes se chevauchant de longueurs fixes, connues sous le nom de <em>n-grammes</em>. Par exemple, lorsque n = 3, le mot <strong>"Milvus"</strong> est décomposé en trois grammes : <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu"</strong> et <strong>"vus".</strong> Chaque n-gramme est ensuite stocké dans un index inversé qui associe la sous-chaîne à l'ensemble des identifiants des documents dans lesquels elle apparaît. Au moment de l'interrogation, les conditions de <code translate="no">LIKE</code> sont traduites en combinaisons de recherches de n-grammes, ce qui permet à Milvus de filtrer rapidement la plupart des enregistrements non concordants et d'évaluer le modèle par rapport à un ensemble de candidats beaucoup plus restreint. C'est ce qui permet de transformer les balayages de chaînes coûteux en requêtes efficaces basées sur un index.</p>
<p>Deux paramètres contrôlent la manière dont l'index Ngram est construit : <code translate="no">min_gram</code> et <code translate="no">max_gram</code>. Ensemble, ils définissent la plage de longueurs de sous-chaînes que Milvus génère et indexe.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: La longueur de sous-chaîne la plus courte à indexer. Dans la pratique, ce paramètre définit également la longueur minimale des sous-chaînes de la requête qui peuvent bénéficier de l'index Ngram</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: La plus longue longueur de sous-chaîne à indexer. Au moment de l'interrogation, il détermine en outre la taille maximale de la fenêtre utilisée pour diviser les chaînes de requête plus longues en n-grammes.</p></li>
</ul>
<p>En indexant toutes les sous-chaînes contiguës dont la longueur se situe entre <code translate="no">min_gram</code> et <code translate="no">max_gram</code>, Milvus établit une base cohérente et efficace pour accélérer tous les types de motifs <code translate="no">LIKE</code> pris en charge.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Comment fonctionne l'index Ngram ?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus met en œuvre l'index Ngram dans un processus en deux phases :</p>
<ul>
<li><p><strong>Construire l'index :</strong> Générer des n-grammes pour chaque document et construire un index inversé pendant l'ingestion des données.</p></li>
<li><p><strong>Accélérer les requêtes :</strong> Utiliser l'index pour restreindre la recherche à un petit ensemble de candidats, puis vérifier les correspondances exactes <code translate="no">LIKE</code> sur ces candidats.</p></li>
</ul>
<p>Un exemple concret facilite la compréhension de ce processus.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Phase 1 : Construction de l'index</h3><p><strong>Décomposer le texte en n-grammes :</strong></p>
<p>Supposons que nous indexions le texte <strong>"Apple"</strong> avec les paramètres suivants :</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Dans ce cadre, Milvus génère toutes les sous-chaînes contiguës de longueur 2 et 3 :</p>
<ul>
<li><p>2-grammes : <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-grammes : <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Construire un index inversé :</strong></p>
<p>Considérons maintenant un petit ensemble de données de cinq enregistrements :</p>
<ul>
<li><p><strong>Document 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Document 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Document 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Document 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Document 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Lors de l'ingestion, Milvus génère des n-grammes pour chaque enregistrement et les insère dans un index inversé. Dans cet index :</p>
<ul>
<li><p>les<strong>clés</strong> sont des n-grammes (sous-chaînes)</p></li>
<li><p>Les<strong>valeurs</strong> sont des listes d'ID de documents où le n-gramme apparaît.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>L'index est maintenant entièrement construit.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Phase 2 : Accélérer les requêtes</h3><p>Lorsqu'un filtre <code translate="no">LIKE</code> est exécuté, Milvus utilise l'index Ngram pour accélérer l'évaluation de la requête grâce aux étapes suivantes :</p>
<p><strong>1. Extraire le terme de la requête :</strong> Les sous-chaînes contiguës sans caractères génériques sont extraites de l'expression <code translate="no">LIKE</code> (par exemple, <code translate="no">'%apple%'</code> devient <code translate="no">apple</code>).</p>
<p><strong>2. Décomposition du terme de la requête :</strong> Le terme de la requête est décomposé en n-grammes sur la base de sa longueur (<code translate="no">L</code>) et des mots configurés <code translate="no">min_gram</code> et <code translate="no">max_gram</code>.</p>
<p><strong>3. Recherche de chaque gramme et intersection :</strong> Milvus recherche les n-grammes de la requête dans l'index inversé et intersecte leurs listes d'ID de documents pour produire un petit ensemble de candidats.</p>
<p><strong>4. Vérifier et renvoyer les résultats :</strong> La condition originale <code translate="no">LIKE</code> est appliquée uniquement à cet ensemble de candidats pour déterminer le résultat final.</p>
<p>Dans la pratique, la manière dont une requête est divisée en n-grammes dépend de la forme du motif lui-même. Pour voir comment cela fonctionne, nous nous concentrerons sur deux cas courants : les correspondances infixes et les correspondances de caractères génériques. Les correspondances préfixes et suffixes se comportent de la même manière que les correspondances infixes, nous ne les aborderons donc pas séparément.</p>
<p><strong>Correspondance infixe</strong></p>
<p>Pour une correspondance infixe, l'exécution dépend de la longueur de la sous-chaîne littérale (<code translate="no">L</code>) par rapport à <code translate="no">min_gram</code> et <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (par exemple, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>La chaîne littérale <code translate="no">ppl</code> se situe entièrement dans la plage de n-grammes configurée. Milvus recherche directement le n-gramme <code translate="no">&quot;ppl&quot;</code> dans l'index inversé, ce qui produit les ID de documents candidats <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Le littéral étant lui-même un n-gramme indexé, tous les candidats satisfont déjà à la condition d'infixation. L'étape de vérification finale n'élimine aucun enregistrement et le résultat reste <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (par exemple, <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>Le sous-chaîne littéral <code translate="no">pple</code> est plus long que <code translate="no">max_gram</code>, il est donc décomposé en n-grammes qui se chevauchent en utilisant une taille de fenêtre de <code translate="no">max_gram</code>. Avec <code translate="no">max_gram = 3</code>, on obtient les n-grammes <code translate="no">&quot;ppl&quot;</code> et <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus recherche chaque n-gramme dans l'index inversé :</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>L'intersection de ces listes donne l'ensemble de candidats <code translate="no">[0, 1, 4]</code>. Le filtre original <code translate="no">LIKE '%pple%'</code> est ensuite appliqué à ces candidats. Les trois candidats satisfont à la condition, de sorte que le résultat final reste <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (par exemple, <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>La chaîne littérale est plus courte que <code translate="no">min_gram</code> et ne peut donc pas être décomposée en n-grammes indexés. Dans ce cas, l'index Ngram ne peut pas être utilisé et Milvus revient au chemin d'exécution par défaut, en évaluant la condition <code translate="no">LIKE</code> par le biais d'un balayage complet avec correspondance de motifs.</p>
<p><strong>Correspondance de caractères génériques</strong> (par exemple, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Ce motif contient plusieurs caractères génériques, Milvus le divise donc d'abord en littéraux contigus : <code translate="no">&quot;Ap&quot;</code> et <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus traite ensuite chaque littéral indépendamment :</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> a une longueur de 2 et se situe dans l'intervalle du n-gramme.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> est plus long que <code translate="no">max_gram</code> et est décomposé en <code translate="no">&quot;ppl&quot;</code> et <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>La requête est ainsi réduite aux n-grammes suivants :</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>L'intersection de ces listes produit un seul candidat : <code translate="no">[0]</code>.</p>
<p>Enfin, le filtre original <code translate="no">LIKE '%Ap%pple%'</code> est appliqué au document 0 (<code translate="no">&quot;Apple&quot;</code>). Étant donné qu'il ne satisfait pas au modèle complet, l'ensemble de résultats final est vide.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Limites et compromis de l'index des ngrammes<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien que l'index Ngram puisse améliorer de manière significative les performances des requêtes <code translate="no">LIKE</code>, il introduit des compromis qui doivent être pris en compte dans les déploiements réels.</p>
<ul>
<li><strong>Augmentation de la taille de l'index</strong></li>
</ul>
<p>Le coût principal de l'index Ngram est l'augmentation des frais généraux de stockage. Étant donné que l'index stocke toutes les sous-chaînes contiguës dont la longueur est comprise entre <code translate="no">min_gram</code> et <code translate="no">max_gram</code>, le nombre de n-grammes générés augmente rapidement à mesure que cette plage s'élargit. Chaque longueur de n-gramme supplémentaire ajoute en effet un autre ensemble complet de sous-chaînes qui se chevauchent pour chaque valeur de texte, ce qui augmente à la fois le nombre de clés d'index et leurs listes d'affichage. Dans la pratique, l'extension de la plage d'un seul caractère peut approximativement doubler la taille de l'index par rapport à un index inversé standard.</p>
<ul>
<li><strong>Pas efficace pour toutes les charges de travail</strong></li>
</ul>
<p>L'index Ngram n'accélère pas toutes les charges de travail. Si les modèles de requête sont très irréguliers, s'ils contiennent des littéraux très courts ou s'ils ne parviennent pas à réduire l'ensemble de données à un petit ensemble de candidats lors de la phase de filtrage, l'avantage en termes de performances peut être limité. Dans de tels cas, l'exécution de la requête peut encore s'approcher du coût d'un balayage complet, même si l'index est présent.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Évaluation des performances de l'index Ngram sur les requêtes LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>L'objectif de ce test de référence est d'évaluer l'efficacité avec laquelle l'index Ngram accélère les requêtes <code translate="no">LIKE</code> dans la pratique.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Méthodologie des tests</h3><p>Pour replacer les performances de l'index Ngram dans leur contexte, nous le comparons à deux modes d'exécution de base :</p>
<ul>
<li><p><strong>Master</strong>: Exécution brute sans index.</p></li>
<li><p><strong>Maître-inversé</strong>: Exécution à l'aide d'un index inversé conventionnel.</p></li>
</ul>
<p>Nous avons conçu deux scénarios de test pour couvrir différentes caractéristiques de données :</p>
<ul>
<li><p><strong>Ensemble de données textuelles Wiki</strong>: 100 000 lignes, chaque champ de texte étant tronqué à 1 Ko.</p></li>
<li><p><strong>Ensemble de données à mot unique</strong>: 1 000 000 lignes, où chaque ligne contient un seul mot.</p></li>
</ul>
<p>Dans les deux scénarios, les paramètres suivants sont appliqués de manière cohérente :</p>
<ul>
<li><p>Les requêtes utilisent le <strong>modèle de correspondance infixe</strong> (<code translate="no">%xxx%</code>).</p></li>
<li><p>L'index Ngram est configuré avec <code translate="no">min_gram = 2</code> et <code translate="no">max_gram = 4</code></p></li>
<li><p>Pour isoler les coûts d'exécution des requêtes et éviter les frais généraux de matérialisation des résultats, toutes les requêtes renvoient <code translate="no">count(*)</code> au lieu d'ensembles de résultats complets.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p><strong>Test pour wiki, chaque ligne est un texte wiki dont la longueur du contenu est tronquée par 1000, 100K lignes</strong></p>
<table>
<thead>
<tr><th></th><th>Littéral</th><th>Temps (ms)</th><th>Accélération</th><th>Compter</th></tr>
</thead>
<tbody>
<tr><td>Maître</td><td>stade</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Maître inversé</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Nogramme</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maître</td><td>école secondaire</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Maître inversé</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Nogramme</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>est un établissement d'enseignement secondaire mixte.</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Master-inversé</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Nogramme</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Test pour les mots simples, 1M lignes</strong></p>
<table>
<thead>
<tr><th></th><th>Littéral</th><th>Temps (ms)</th><th>Accélération</th><th>Comptage</th></tr>
</thead>
<tbody>
<tr><td>Maître</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Maître inversé</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Nogramme</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maître</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Maître-inversé</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Nogramme</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maître</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Maître inversé</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Nogramme</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maître</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Maître inversé</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Nogramme</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maître</td><td>nation</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Maître inversé</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Nogramme</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Note :</strong> Ces résultats sont basés sur des tests effectués en mai. Depuis lors, la branche Master a fait l'objet d'optimisations de performance supplémentaires, de sorte que l'écart de performance observé ici devrait être plus faible dans les versions actuelles.</p>
<p>Les résultats des tests de référence mettent en évidence un schéma clair : l'index Ngram accélère considérablement les requêtes LIKE dans tous les cas, et la rapidité d'exécution des requêtes dépend fortement de la structure et de la longueur des données textuelles sous-jacentes.</p>
<ul>
<li><p>Pour les <strong>champs de texte longs</strong>, tels que les documents de type wiki tronqués à 1 000 octets, les gains de performance sont particulièrement prononcés. Par rapport à une exécution brute sans index, l'index Ngram permet d'obtenir des gains de vitesse de l'ordre de <strong>100 à 200×</strong>. Par rapport à un index inversé classique, l'amélioration est encore plus spectaculaire, atteignant <strong>1 200 à 1 900 fois</strong>. En effet, les requêtes LIKE sur des textes longs sont particulièrement coûteuses pour les approches d'indexation traditionnelles, alors que les recherches de n-grammes peuvent rapidement réduire l'espace de recherche à un très petit ensemble de candidats.</p></li>
<li><p>Sur les ensembles de données constitués d'<strong>entrées d'un seul mot</strong>, les gains sont moindres mais restent substantiels. Dans ce scénario, l'index Ngram est environ <strong>80 à 100 fois plus</strong> rapide que l'exécution brute et <strong>45 à 55 fois plus</strong> rapide qu'un index inversé conventionnel. Bien qu'un texte plus court soit intrinsèquement moins coûteux à analyser, l'approche basée sur les n-grammes évite toujours les comparaisons inutiles et réduit systématiquement le coût des requêtes.</p></li>
</ul>
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
    </button></h2><p>L'index Ngram accélère les requêtes <code translate="no">LIKE</code> en décomposant le texte en n-grammes de longueur fixe et en les indexant à l'aide d'une structure inversée. Cette conception transforme l'appariement coûteux des sous-chaînes en recherches efficaces de n-grammes suivies d'une vérification minimale. Par conséquent, les balayages de texte intégral sont évités et la sémantique exacte de <code translate="no">LIKE</code> est préservée.</p>
<p>Dans la pratique, cette approche est efficace pour un large éventail de charges de travail, avec des résultats particulièrement probants pour la correspondance floue sur de longs champs de texte. L'index Ngram est donc bien adapté aux scénarios en temps réel tels que la recherche de codes, les agents d'assistance à la clientèle, la recherche de documents juridiques et médicaux, les bases de connaissances d'entreprise et la recherche universitaire, où la correspondance précise des mots clés reste essentielle.</p>
<p>En même temps, l'index Ngram bénéficie d'une configuration minutieuse. Le choix des valeurs appropriées de <code translate="no">min_gram</code> et <code translate="no">max_gram</code> est essentiel pour équilibrer la taille de l'index et la performance des requêtes. Lorsqu'il est réglé de manière à refléter les modèles de requête réels, l'index Ngram constitue une solution pratique et évolutive pour les requêtes <code translate="no">LIKE</code> à haute performance dans les systèmes de production.</p>
<p>Pour plus d'informations sur l'index Ngram, consultez la documentation ci-dessous :</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index | Milvus Documentation</a></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Heures de bureau Milvus</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">En savoir plus sur les fonctionnalités de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : recherche vectorielle abordable à l'échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d'intégration : Comment Milvus 2.6 rationalise la vectorisation et la recherche sémantique</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Déchiquetage JSON dans Milvus : filtrage JSON 88,9 fois plus rapide et flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Déverrouiller la véritable recherche au niveau de l'entité : Nouvelles fonctionnalités Array-of-Structs et MAX_SIM dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Rapprocher le filtrage géospatial et la recherche vectorielle avec les champs géométriques et RTREE dans Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Présentation d'AISAQ dans Milvus : la recherche vectorielle à l'échelle du milliard vient d'être 3 200 fois moins coûteuse en mémoire</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimisation de NVIDIA CAGRA dans Milvus : une approche hybride GPU-CPU pour une indexation plus rapide et des requêtes moins coûteuses</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données d'entraînement LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus </a></p></li>
</ul>
