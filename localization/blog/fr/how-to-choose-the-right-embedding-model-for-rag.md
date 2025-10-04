---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 'De Word2Vec à LLM2Vec : Comment choisir le bon modèle d''intégration pour RAG'
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  Ce blog vous expliquera comment évaluer l'intégration dans la pratique, afin
  que vous puissiez choisir ce qui convient le mieux à votre système RAG.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>Les grands modèles de langage sont puissants, mais ils ont une faiblesse bien connue : les hallucinations. La <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">génération assistée par récupération (RAG)</a> est l'une des méthodes les plus efficaces pour résoudre ce problème. Au lieu de s'appuyer uniquement sur la mémoire du modèle, la RAG récupère les connaissances pertinentes d'une source externe et les incorpore dans l'invite, garantissant ainsi que les réponses sont fondées sur des données réelles.</p>
<p>Un système RAG se compose généralement de trois éléments principaux : le LLM lui-même, une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> telle que <a href="https://milvus.io/">Milvus</a> pour le stockage et la recherche d'informations, et un modèle d'intégration. Le modèle d'intégration est ce qui convertit le langage humain en vecteurs lisibles par la machine. Il s'agit du traducteur entre le langage naturel et la base de données. La qualité de ce traducteur détermine la pertinence du contexte retrouvé. S'il est efficace, les utilisateurs obtiendront des réponses précises et utiles. Si elle est mauvaise, même la meilleure infrastructure produit du bruit, des erreurs et des calculs inutiles.</p>
<p>C'est pourquoi il est si important de comprendre les modèles d'intégration. Il en existe de nombreux, allant des premières méthodes comme Word2Vec aux modèles modernes basés sur LLM, comme la famille d'intégration de texte d'OpenAI. Chacun d'entre eux présente ses propres avantages et inconvénients. Ce guide vous permettra d'y voir plus clair et vous montrera comment évaluer les embeddings dans la pratique, afin que vous puissiez choisir le modèle le mieux adapté à votre système RAG.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">Que sont les embeddings et pourquoi sont-ils importants ?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Au niveau le plus simple, les embeddings transforment le langage humain en nombres que les machines peuvent comprendre. Chaque mot, phrase ou document est cartographié dans un espace vectoriel à haute dimension, où la distance entre les vecteurs capture les relations entre eux. Les textes ayant des significations similaires ont tendance à se regrouper, tandis que les contenus sans rapport entre eux ont tendance à s'éloigner les uns des autres. C'est ce qui rend possible la recherche sémantique : il s'agit de trouver du sens, et pas seulement de faire correspondre des mots-clés.</p>
<p>Les modèles d'intégration ne fonctionnent pas tous de la même manière. Ils se répartissent généralement en trois catégories, chacune présentant des avantages et des inconvénients :</p>
<ul>
<li><p>Les<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>vecteurs épars</strong></a> (comme BM25) se concentrent sur la fréquence des mots clés et la longueur des documents. Ils sont parfaits pour les correspondances explicites, mais ne tiennent pas compte des synonymes et du contexte - "AI" et "artificial intelligence" n'auraient aucun rapport entre eux.</p></li>
<li><p>Les<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>vecteurs denses</strong></a> (comme ceux produits par BERT) capturent une sémantique plus profonde. Ils peuvent voir que "Apple sort un nouveau téléphone" est lié au "lancement du produit iPhone", même en l'absence de mots-clés communs. L'inconvénient est un coût de calcul plus élevé et une interprétabilité moindre.</p></li>
<li><p><strong>Les modèles hybrides</strong> (tels que BGE-M3) combinent les deux. Ils peuvent générer simultanément des représentations éparses, denses ou multi-vectorielles, ce qui permet de préserver la précision de la recherche par mot-clé tout en capturant les nuances sémantiques.</p></li>
</ul>
<p>En pratique, le choix dépend de votre cas d'utilisation : les vecteurs épars pour la rapidité et la transparence, les vecteurs denses pour une signification plus riche, et les vecteurs hybrides lorsque vous voulez le meilleur des deux mondes.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Huit facteurs clés pour évaluer les modèles d'intégration<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 Fenêtre de contexte</strong></h3><p>La <a href="https://zilliz.com/glossary/context-window"><strong>fenêtre contextuelle</strong></a> détermine la quantité de texte qu'un modèle peut traiter en une seule fois. Étant donné qu'un jeton représente environ 0,75 mot, ce nombre limite directement la longueur du passage que le modèle peut "voir" lors de la création d'enchâssements. Une grande fenêtre permet au modèle de saisir tout le sens de documents plus longs ; une petite fenêtre vous oblige à découper le texte en petits morceaux, au risque de perdre un contexte significatif.</p>
<p>Par exemple, le modèle d <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>'intégration de texte OpenAI-ada-002</em></a> prend en charge jusqu'à 8 192 jetons, ce qui est suffisant pour couvrir l'intégralité d'un article de recherche, y compris le résumé, les méthodes et la conclusion. En revanche, les modèles avec des fenêtres de 512 jetons seulement (comme <em>m3e-base</em>) nécessitent une troncature fréquente, ce qui peut entraîner la perte de détails clés.</p>
<p>Conclusion : si votre cas d'utilisation implique de longs documents, tels que des dossiers juridiques ou des articles universitaires, choisissez un modèle avec une fenêtre de plus de 8 000 jetons. Pour les textes plus courts, tels que les chats de l'assistance clientèle, une fenêtre de 2 000 jetons peut suffire.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">Unité de tokenisation<strong>#2</strong> </h3><p>Avant que les embeddings ne soient générés, le texte doit être décomposé en morceaux plus petits appelés <strong>tokens</strong>. La façon dont cette tokenisation est effectuée affecte la manière dont le modèle traite les mots rares, les termes professionnels et les domaines spécialisés.</p>
<ul>
<li><p><strong>Bibliothèques de sous-mots (BPE) :</strong> Divise les mots en parties plus petites (par exemple, "unhappiness" → "un" + "happiness"). C'est la méthode par défaut des LLM modernes comme GPT et LLaMA, et elle fonctionne bien pour les mots qui ne font pas partie du vocabulaire.</p></li>
<li><p><strong>WordPiece :</strong> Un raffinement de BPE utilisé par BERT, conçu pour mieux équilibrer la couverture du vocabulaire et l'efficacité.</p></li>
<li><p><strong>Tokenisation au niveau du mot :</strong> Ne sépare que les mots entiers. Elle est simple, mais a du mal à traiter la terminologie rare ou complexe, ce qui la rend inadaptée aux domaines techniques.</p></li>
</ul>
<p>Pour les domaines spécialisés tels que la médecine ou le droit, les modèles basés sur les sous-mots sont généralement les meilleurs. Ils peuvent traiter correctement des termes tels que <em>infarctus du myocarde</em> ou <em>subrogation</em>. Certains modèles modernes, tels que <strong>NV-Embed</strong>, vont plus loin en ajoutant des améliorations telles que des couches d'attention latente, qui améliorent la façon dont la tokenisation capture le vocabulaire complexe et spécifique à un domaine.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">Dimensionnalité #3</h3><p>La<a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>dimensionnalité du vecteur</strong></a> fait référence à la longueur du vecteur d'intégration, qui détermine la quantité de détails sémantiques qu'un modèle peut capturer. Des dimensions plus élevées (par exemple, 1 536 ou plus) permettent des distinctions plus fines entre les concepts, mais au prix d'un stockage accru, de requêtes plus lentes et de besoins de calcul plus importants. Les dimensions inférieures (768 par exemple) sont plus rapides et moins coûteuses, mais risquent de faire perdre une signification subtile.</p>
<p>La clé est l'équilibre. Pour la plupart des applications générales, les dimensions 768-1 536 offrent un bon équilibre entre efficacité et précision. Pour les tâches exigeant une grande précision, telles que les recherches universitaires ou scientifiques, il peut être intéressant d'aller au-delà de 2 000 dimensions. D'autre part, les systèmes aux ressources limitées (tels que les déploiements en périphérie) peuvent utiliser efficacement 512 dimensions, à condition que la qualité de la recherche soit validée. Dans certains systèmes légers de recommandation ou de personnalisation, des dimensions encore plus petites peuvent suffire.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">Taille du vocabulaire #4</h3><p>La <strong>taille du vocabulaire</strong> d'un modèle fait référence au nombre de tokens uniques que son tokenizer peut reconnaître. Cela a un impact direct sur sa capacité à gérer différentes langues et la terminologie spécifique à un domaine. Si un mot ou un caractère ne fait pas partie du vocabulaire, il est marqué comme <code translate="no">[UNK]</code>, ce qui peut entraîner une perte de sens.</p>
<p>Les exigences varient selon les cas d'utilisation. Les scénarios multilingues nécessitent généralement des vocabulaires plus importants - de l'ordre de 50 000 tokens ou plus, comme dans le cas de <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. Pour les applications spécifiques à un domaine, la couverture des termes spécialisés est la plus importante. Par exemple, un modèle juridique doit prendre en charge de manière native des termes tels que <em>&quot;prescription&quot;</em> ou <em>&quot;acquisition de bonne foi</em>&quot;, tandis qu'un modèle chinois doit tenir compte de milliers de caractères et d'une ponctuation unique. Sans une couverture suffisante du vocabulaire, la précision de l'intégration s'effondre rapidement.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 Données de formation</h3><p>Les <strong>données d'entraînement</strong> définissent les limites de ce qu'un modèle d'intégration "sait". Les modèles formés sur des données générales, telles que <em>text-embedding-ada-002</em>, qui utilise un mélange de pages Web, de livres et de Wikipédia, ont tendance à donner de bons résultats dans divers domaines. En revanche, lorsque vous avez besoin de précision dans des domaines spécialisés, les modèles formés par domaine sont souvent plus performants. Par exemple, <em>LegalBERT</em> et <em>BioBERT</em> sont plus performants que les modèles généraux sur les textes juridiques et biomédicaux, même s'ils perdent un peu de leur capacité de généralisation.</p>
<p>La règle d'or :</p>
<ul>
<li><p><strong>Scénarios généraux</strong> → utiliser des modèles formés sur de vastes ensembles de données, mais s'assurer qu'ils couvrent la ou les langues cibles. Par exemple, les applications chinoises ont besoin de modèles formés sur de riches corpus chinois.</p></li>
<li><p><strong>Domaines verticaux</strong> → choisissez des modèles spécifiques à un domaine pour une meilleure précision.</p></li>
<li><p><strong>Le meilleur des deux mondes</strong> → des modèles plus récents comme <strong>NV-Embed</strong>, formés en deux étapes avec des données générales et spécifiques à un domaine, montrent des gains prometteurs en termes de généralisation <em>et de</em> précision du domaine.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6. Coût</h3><p>Le coût ne se limite pas à la tarification de l'API : il s'agit à la fois du <strong>coût économique</strong> et du <strong>coût de calcul</strong>. Les modèles d'API hébergées, comme ceux d'OpenAI, sont basés sur l'utilisation : vous payez par appel, mais vous ne vous souciez pas de l'infrastructure. Ils sont donc parfaits pour le prototypage rapide, les projets pilotes ou les charges de travail à petite ou moyenne échelle.</p>
<p>Les options open-source, telles que <em>BGE</em> ou <em>Sentence-BERT</em>, sont gratuites mais nécessitent une infrastructure autogérée, généralement des clusters de GPU ou de TPU. Elles sont mieux adaptées à la production à grande échelle, où les économies à long terme et la flexibilité compensent les coûts uniques d'installation et de maintenance.</p>
<p>Ce qu'il faut en retenir : Les <strong>modèles API sont idéaux pour l'itération rapide</strong>, tandis que <strong>les modèles open-source sont souvent gagnants pour la production à grande échelle</strong>, une fois que l'on tient compte du coût total de possession (TCO). Le choix de la bonne voie dépend de la rapidité de mise sur le marché ou du contrôle à long terme.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 Score MTEB</h3><p>Le <a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB)</strong></a> est la norme la plus utilisée pour comparer les modèles d'intégration. Il évalue les performances dans diverses tâches, notamment la recherche sémantique, la classification et le regroupement. Un score plus élevé signifie généralement que le modèle est plus facilement généralisable à différents types de tâches.</p>
<p>Cela dit, la MTEB n'est pas une solution miracle. Un modèle qui obtient un score élevé dans l'ensemble peut encore être moins performant dans votre cas d'utilisation spécifique. Par exemple, un modèle formé principalement à l'anglais peut obtenir de bons résultats dans les benchmarks MTEB, mais éprouver des difficultés avec des textes médicaux spécialisés ou des données non anglophones. L'approche la plus sûre consiste à utiliser le MTEB comme point de départ, puis à le valider avec <strong>vos propres ensembles de données</strong> avant de vous engager.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 Spécificité du domaine</h3><p>Certains modèles sont conçus pour des scénarios spécifiques, et ils brillent là où les modèles généraux échouent :</p>
<ul>
<li><p><strong>Le domaine juridique :</strong> <em>LegalBERT</em> peut distinguer des termes juridiques très fins, tels que <em>défense</em> ou <em>juridiction</em>.</p></li>
<li><p><strong>Biomédical :</strong> <em>BioBERT</em> traite avec précision des expressions techniques telles que <em>ARNm</em> ou <em>thérapie ciblée</em>.</p></li>
<li><p><strong>Multilingue :</strong> <em>BGE-M3</em> prend en charge plus de 100 langues, ce qui le rend bien adapté aux applications internationales qui nécessitent de faire le lien entre l'anglais, le chinois et d'autres langues.</p></li>
<li><p><strong>Recherche de code :</strong> <em>Qwen3-Embedding</em> obtient des scores de premier ordre (81.0+) sur <em>MTEB-Code</em>, optimisé pour les requêtes liées à la programmation.</p></li>
</ul>
<p>Si votre cas d'utilisation relève de l'un de ces domaines, les modèles optimisés par domaine peuvent améliorer de manière significative la précision de la recherche. Mais pour des applications plus larges, il convient de s'en tenir à des modèles d'usage général, sauf si vos tests démontrent le contraire.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Perspectives supplémentaires pour l'évaluation des emboîtements<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Au-delà des huit facteurs principaux, il y a quelques autres aspects qui méritent d'être pris en compte si vous souhaitez une évaluation plus approfondie :</p>
<ul>
<li><p>L'<strong>alignement multilingue</strong>: Pour les modèles multilingues, il ne suffit pas de prendre en charge de nombreuses langues. Le véritable test consiste à déterminer si les espaces vectoriels sont alignés. En d'autres termes, les mots sémantiquement identiques - par exemple "cat" en anglais et "gato" en espagnol - sont-ils proches les uns des autres dans l'espace vectoriel ? Un alignement solide garantit une recherche cohérente entre les langues.</p></li>
<li><p><strong>Tests contradictoires</strong>: Un bon modèle d'intégration doit être stable en cas de légères modifications des données d'entrée. En introduisant des phrases presque identiques (par exemple, "Le chat s'est assis sur le tapis" ou "Le chat s'est assis sur un tapis"), vous pouvez tester si les vecteurs résultants se déplacent raisonnablement ou s'ils fluctuent de manière importante. Des fluctuations importantes sont souvent le signe d'une faible robustesse.</p></li>
<li><p>La<strong>cohérence sémantique locale</strong> fait référence au phénomène consistant à vérifier si des mots sémantiquement similaires se regroupent étroitement dans des voisinages locaux. Par exemple, pour un mot comme "banque", le modèle doit regrouper les termes apparentés (tels que "rive" et "institution financière") de manière appropriée, tout en gardant les termes non apparentés à distance. Mesurer la fréquence à laquelle des mots "intrusifs" ou non pertinents se glissent dans ces quartiers permet de comparer la qualité du modèle.</p></li>
</ul>
<p>Ces perspectives ne sont pas toujours nécessaires pour le travail quotidien, mais elles sont utiles pour les tests d'intégration dans les systèmes de production où la stabilité multilingue, de haute précision ou contradictoire est vraiment importante.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Modèles d'intégration courants : Une brève histoire<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>L'histoire des modèles d'intégration est en fait l'histoire de la façon dont les machines ont appris à comprendre le langage plus profondément au fil du temps. Chaque génération a repoussé les limites de celle qui l'a précédée, passant de représentations statiques de mots aux encastrements de grands modèles de langage (LLM) d'aujourd'hui, capables de capturer un contexte nuancé.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec : Le point de départ (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Word2Vec de Google</a> a été la première percée qui a rendu les encastrements largement pratiques. Il est basé sur l'<em>hypothèse de distribution</em> en linguistique, c'est-à-dire l'idée que les mots apparaissant dans des contextes similaires ont souvent une signification commune. En analysant des quantités massives de texte, Word2Vec a cartographié les mots dans un espace vectoriel où les termes apparentés sont proches les uns des autres. Par exemple, les termes "puma" et "léopard" ont été regroupés en raison de leurs habitats et de leurs caractéristiques de chasse communs.</p>
<p>Word2Vec existe en deux versions :</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words) :</strong> prédit un mot manquant à partir de son contexte environnant.</p></li>
<li><p><strong>Skip-Gram :</strong> fait l'inverse en prédisant les mots environnants à partir d'un mot cible.</p></li>
</ul>
<p>Cette approche simple mais puissante a permis d'établir des analogies élégantes telles que :</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Pour l'époque, Word2Vec était révolutionnaire. Mais il présentait deux limites importantes. Premièrement, il était <strong>statique</strong>: chaque mot n'avait qu'un seul vecteur, de sorte que "banque" signifiait la même chose qu'il soit proche de "argent" ou de "rivière". Deuxièmement, il ne fonctionnait qu'au <strong>niveau du mot</strong>, laissant les phrases et les documents hors de sa portée.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT : La révolution des transformateurs (2018)</h3><p>Si Word2Vec nous a donné la première carte du sens, <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations from Transformers)</strong></a> l'a redessinée avec beaucoup plus de détails. Publié par Google en 2018, BERT a marqué le début de l'ère de la <em>compréhension sémantique profonde</em> en introduisant l'architecture Transformer dans les embeddings. Contrairement aux LSTM antérieures, les Transformers peuvent examiner tous les mots d'une séquence simultanément et dans les deux sens, ce qui permet d'obtenir un contexte beaucoup plus riche.</p>
<p>La magie de BERT provient de deux tâches intelligentes de pré-entraînement :</p>
<ul>
<li><p><strong>Modélisation du langage masqué (MLM) :</strong> Cette tâche cache des mots au hasard dans une phrase et oblige le modèle à les prédire, lui apprenant ainsi à déduire le sens à partir du contexte.</p></li>
<li><p><strong>Prédiction de la phrase suivante (NSP) :</strong> entraîne le modèle à déterminer si deux phrases se suivent, l'aidant ainsi à apprendre les relations entre les phrases.</p></li>
</ul>
<p>Sous le capot, les vecteurs d'entrée de l'ORET combinent trois éléments : l'intégration de jetons (le mot lui-même), l'intégration de segments (la phrase à laquelle il appartient) et l'intégration de positions (où il se situe dans la séquence). Ensemble, ces éléments ont donné à l'ORET la capacité de capturer des relations sémantiques complexes à la fois au niveau de la <strong>phrase</strong> et du <strong>document</strong>. Cette avancée a permis à l'ORET d'être à la pointe de la technologie pour des tâches telles que la réponse aux questions et la recherche sémantique.</p>
<p>Bien sûr, l'ORET n'était pas parfait. Ses premières versions étaient limitées à une <strong>fenêtre de 512 mots</strong>, ce qui signifiait que les longs documents devaient être découpés et perdaient parfois de leur sens. Ses vecteurs denses manquaient également d'interprétabilité : il était possible de voir que deux textes correspondaient, mais pas toujours d'expliquer pourquoi. Les variantes ultérieures, telles que <strong>RoBERTa</strong>, ont abandonné la tâche NSP après que les recherches ont montré qu'elle n'apportait que peu d'avantages, tout en conservant la puissante formation MLM.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3 : Fusionner l'épars et le dense (2023)</h3><p>En 2023, le domaine avait suffisamment évolué pour reconnaître qu'aucune méthode d'intégration ne pouvait à elle seule tout accomplir. C'est ainsi qu'est né <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), un modèle hybride explicitement conçu pour les tâches de recherche. Sa principale innovation réside dans le fait qu'il ne produit pas un seul type de vecteur : il génère des vecteurs denses, des vecteurs épars et des vecteurs multiples en même temps, en combinant leurs points forts.</p>
<ul>
<li><p>Les<strong>vecteurs denses</strong> capturent la sémantique profonde, gèrent les synonymes et les paraphrases (par exemple, "lancement de l'iPhone", ≈ "Apple sort un nouveau téléphone").</p></li>
<li><p>Les<strong>vecteurs d</strong> enses attribuent des poids explicites aux termes. Même si un mot-clé n'apparaît pas, le modèle peut en déduire la pertinence, par exemple en associant "nouveau produit iPhone" à "Apple Inc." et "smartphone".</p></li>
<li><p>Les<strong>multi-vecteurs</strong> affinent encore les encastrements denses en permettant à chaque élément de contribuer à son propre score d'interaction, ce qui est utile pour la recherche fine.</p></li>
</ul>
<p>Le pipeline de formation de BGE-M3 reflète cette sophistication :</p>
<ol>
<li><p><strong>Pré-entraînement</strong> sur des données massives non étiquetées avec <em>RetroMAE</em> (encodeur masqué + décodeur de reconstruction) pour construire une compréhension sémantique générale.</p></li>
<li><p>Ajustement<strong>général</strong> à l'aide de l'apprentissage contrastif sur 100 millions de paires de textes, afin d'améliorer ses performances en matière de recherche.</p></li>
<li><p>Un<strong>réglage fin de la tâche</strong> avec un réglage des instructions et un échantillonnage négatif complexe pour une optimisation spécifique au scénario.</p></li>
</ol>
<p>Les résultats sont impressionnants : BGE-M3 gère de multiples granularités (du niveau du mot au niveau du document), offre de solides performances multilingues - en particulier en chinois - et équilibre la précision et l'efficacité mieux que la plupart de ses homologues. En pratique, il représente un grand pas en avant dans la construction de modèles d'intégration qui sont à la fois puissants et pratiques pour la recherche à grande échelle.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">Les LLM en tant que modèles d'intégration (2023-aujourd'hui)</h3><p>Pendant des années, la sagesse dominante était que les grands modèles de langage (LLM) décodeurs uniquement, tels que GPT, n'étaient pas adaptés aux encastrements. Leur attention causale, qui ne tient compte que des tokens précédents, était censée limiter la compréhension sémantique en profondeur. Mais des recherches récentes ont renversé cette hypothèse. Avec les bons ajustements, les LLM peuvent générer des embeddings qui rivalisent, et parfois surpassent, les modèles conçus à cet effet. LLM2Vec et NV-Embed en sont deux exemples notables.</p>
<p><strong>LLM2Vec</strong> adapte les LLMs à décodeur seul avec trois changements clés :</p>
<ul>
<li><p><strong>Conversion bidirectionnelle de l'attention</strong>: remplacement des masques causaux afin que chaque jeton puisse s'occuper de la séquence complète.</p></li>
<li><p><strong>Prédiction du prochain jeton masqué (MNTP) :</strong> un nouvel objectif de formation qui encourage la compréhension bidirectionnelle.</p></li>
<li><p><strong>Apprentissage contrastif non supervisé :</strong> inspiré de SimCSE, il rapproche les phrases sémantiquement similaires dans l'espace vectoriel.</p></li>
</ul>
<p><strong>NV-Embed</strong>, quant à lui, adopte une approche plus rationalisée :</p>
<ul>
<li><p><strong>Couches d'attention latente :</strong> ajout de "tableaux latents" entraînables pour améliorer la mise en commun des séquences.</p></li>
<li><p><strong>Formation bidirectionnelle directe :</strong> il suffit de supprimer les masques de causalité et de procéder à un réglage fin par apprentissage contrastif.</p></li>
<li><p><strong>Optimisation de la mise en commun des moyennes :</strong> utilise des moyennes pondérées entre les jetons pour éviter le "biais du dernier jeton".</p></li>
</ul>
<p>Le résultat est que les encastrements modernes basés sur LLM combinent une <strong>compréhension sémantique profonde</strong> avec l'<strong>évolutivité</strong>. Ils peuvent gérer des <strong>fenêtres contextuelles très longues (8K-32K tokens)</strong>, ce qui les rend particulièrement performants pour les tâches à forte densité documentaire dans les domaines de la recherche, du droit ou de la recherche d'entreprise. Et parce qu'ils réutilisent la même colonne vertébrale LLM, ils peuvent parfois fournir des encastrements de haute qualité même dans des environnements plus contraignants.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Conclusion : De la théorie à la pratique<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'il s'agit de choisir un modèle d'intégration, la théorie n'a qu'une portée limitée. Le véritable test est de savoir comment il fonctionne dans <em>votre</em> système avec <em>vos</em> données. Quelques mesures pratiques peuvent faire la différence entre un modèle qui semble bon sur le papier et un modèle qui fonctionne réellement en production :</p>
<ul>
<li><p><strong>Effectuer des projections avec des sous-ensembles de la MTEB.</strong> Utilisez des repères, en particulier des tâches de recherche, pour établir une première liste de candidats.</p></li>
<li><p><strong>Testez avec des données professionnelles réelles.</strong> Créez des ensembles d'évaluation à partir de vos propres documents pour mesurer le rappel, la précision et la latence dans des conditions réelles.</p></li>
<li><p><strong>Vérifiez la compatibilité avec les bases de données.</strong> Les vecteurs épars nécessitent la prise en charge d'index inversés, tandis que les vecteurs denses à haute dimension requièrent davantage de stockage et de calculs. Assurez-vous que votre base de données vectorielle peut s'adapter à votre choix.</p></li>
<li><p><strong>Traitez intelligemment les documents longs.</strong> Utilisez des stratégies de segmentation, telles que les fenêtres coulissantes, pour plus d'efficacité, et associez-les à des modèles de fenêtres contextuelles de grande taille pour préserver le sens.</p></li>
</ul>
<p>Des simples vecteurs statiques de Word2Vec aux embeddings alimentés par LLM avec 32 000 contextes, nous avons vu d'énormes progrès dans la façon dont les machines comprennent le langage. Mais voici la leçon que tous les développeurs finissent par apprendre : le modèle <em>qui obtient le meilleur score</em> n'est pas toujours le <em>meilleur</em> modèle pour votre cas d'utilisation.</p>
<p>En fin de compte, les utilisateurs ne s'intéressent pas aux classements MTEB ou aux graphiques de référence : ils veulent simplement trouver la bonne information, rapidement. Choisissez le modèle qui concilie précision, coût et compatibilité avec votre système, et vous aurez construit quelque chose qui ne se contente pas d'impressionner en théorie, mais qui fonctionne réellement dans le monde réel.</p>
