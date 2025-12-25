---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  L'intégration d'abord, le regroupement ensuite : Récupération plus
  intelligente des RAG avec le découpage sémantique Max-Min
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Découvrez comment le découpage sémantique Max-Min améliore la précision du RAG
  en utilisant une approche d'intégration d'abord qui crée des morceaux plus
  intelligents, améliore la qualité du contexte et offre de meilleures
  performances de recherche.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p>La<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">génération augmentée par récupération (RAG)</a> est devenue l'approche par défaut pour fournir un contexte et une mémoire aux applications d'IA - les agents d'IA, les assistants d'assistance à la clientèle, les bases de connaissances et les systèmes de recherche s'appuient tous sur elle.</p>
<p>Dans presque toutes les filières RAG, le processus standard est le même : prendre les documents, les diviser en morceaux, puis intégrer ces morceaux pour la recherche de similarités dans une base de données vectorielle comme <a href="https://milvus.io/">Milvus</a>. Comme le <strong>découpage</strong> se fait en amont, la qualité de ces morceaux a une incidence directe sur la qualité de la recherche d'informations par le système et sur la précision des réponses finales.</p>
<p>Le problème est que les stratégies de découpage traditionnelles découpent généralement le texte sans aucune compréhension sémantique. Le découpage à longueur fixe est basé sur le nombre de jetons et le découpage récursif utilise une structure de surface, mais ces deux stratégies ignorent toujours le sens réel du texte. En conséquence, les idées connexes sont souvent séparées, les lignes sans rapport sont regroupées et le contexte important est fragmenté.</p>
<p>Dans ce blog, j'aimerais vous faire part d'une stratégie de découpage différente : <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Le découpage sémantique Max-Min</strong></a>. Au lieu de procéder au découpage en premier, cette stratégie intègre le texte en amont et utilise la similarité sémantique pour décider où les limites doivent être formées. En intégrant le texte avant de le découper, le pipeline peut suivre les changements naturels de sens plutôt que de s'appuyer sur des limites de longueur arbitraires.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Fonctionnement d'un pipeline RAG type<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La plupart des pipelines RAG, quel que soit le cadre, suivent la même chaîne de montage en quatre étapes. Vous en avez probablement déjà écrit une version vous-même :</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Nettoyage et regroupement des données</h3><p>Le pipeline commence par nettoyer les documents bruts : il supprime les en-têtes, les pieds de page, le texte de navigation et tout ce qui n'est pas du contenu réel. Une fois le bruit éliminé, le texte est divisé en petits morceaux. La plupart des équipes utilisent des morceaux de taille fixe - généralement de 300 à 800 tokens - car cela permet de gérer le modèle d'intégration. L'inconvénient est que les divisions sont basées sur la longueur, et non sur le sens, de sorte que les limites peuvent être arbitraires.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Intégration et stockage</h3><p>Chaque morceau est ensuite intégré à l'aide d'un modèle d'intégration tel que celui d'OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> ou l'encodeur de BAAI. Les vecteurs résultants sont stockés dans une base de données vectorielle telle que <a href="https://milvus.io/">Milvus</a> ou <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. La base de données gère l'indexation et la recherche de similarités afin que vous puissiez rapidement comparer de nouvelles requêtes à tous les morceaux stockés.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Requête</h3><p>Lorsqu'un utilisateur pose une question - par exemple, <em>"Comment RAG réduit-il les hallucinations ?"</em> - le système intègre la requête et l'envoie à la base de données. La base de données renvoie les K premiers morceaux dont les vecteurs sont les plus proches de la question. Ce sont les morceaux de texte sur lesquels le modèle s'appuiera pour répondre à la question.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Génération de réponses</h3><p>Les morceaux récupérés sont regroupés avec la requête de l'utilisateur et introduits dans un LLM. Le modèle génère une réponse en utilisant le contexte fourni comme base.</p>
<p><strong>Le découpage en morceaux se situe au début de toute cette chaîne, mais il a un impact considérable</strong>. Si les morceaux s'alignent sur le sens naturel du texte, la recherche est précise et cohérente. Si les morceaux ont été coupés à des endroits bizarres, le système a plus de mal à trouver la bonne information, même avec des enchâssements solides et une base de données vectorielle rapide.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Les défis d'une bonne segmentation</h3><p>La plupart des systèmes RAG actuels utilisent l'une des deux méthodes de découpage de base, qui présentent toutes deux des limites.</p>
<p><strong>1. Le découpage en morceaux de taille fixe</strong></p>
<p>Il s'agit de l'approche la plus simple : diviser le texte en fonction d'un nombre fixe de jetons ou de caractères. Cette méthode est rapide et prévisible, mais elle ne tient absolument pas compte de la grammaire, des thèmes ou des transitions. Les phrases peuvent être coupées en deux. Parfois même des mots. Les encastrements que vous obtenez à partir de ces morceaux ont tendance à être bruyants parce que les limites ne reflètent pas la structure réelle du texte.</p>
<p><strong>2. Découpage récursif des caractères</strong></p>
<p>Cette méthode est un peu plus intelligente. Elle divise le texte de manière hiérarchique en se basant sur des indices tels que les paragraphes, les retours à la ligne ou les phrases. Si une section est trop longue, elle la divise de manière récursive. Le résultat est généralement plus cohérent, mais il reste incohérent. Certains documents manquent de structure claire ou présentent des sections de longueur inégale, ce qui nuit à la précision de la recherche. Et dans certains cas, cette approche produit encore des morceaux qui dépassent la fenêtre contextuelle du modèle.</p>
<p>Les deux méthodes sont confrontées au même compromis : précision contre contexte. Les petits morceaux améliorent la précision de la recherche mais perdent le contexte environnant ; les gros morceaux préservent le sens mais risquent d'ajouter du bruit non pertinent. Trouver le bon équilibre est ce qui rend le découpage à la fois fondamental et frustrant dans la conception des systèmes RAG.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">Le découpage sémantique Max-Min : Intégrer d'abord, découper ensuite<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, S.R. Bhat et al. ont publié <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval : A Multi-Dataset Analysis</em></a>. L'une de leurs principales conclusions est qu'il n'existe pas de taille de bloc <strong>"optimale"</strong> pour les RAG. Les petits morceaux (64-128 tokens) ont tendance à mieux fonctionner pour les questions factuelles ou de type recherche, tandis que les morceaux plus grands (512-1024 tokens) sont plus utiles pour les tâches narratives ou de raisonnement de haut niveau. En d'autres termes, le découpage en morceaux de taille fixe est toujours un compromis.</p>
<p>Cela soulève une question naturelle : au lieu de choisir une longueur et d'espérer que tout se passe au mieux, pourrions-nous procéder à un découpage en fonction de la signification plutôt que de la taille ? Le <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>découpage sémantique Max-Min</strong></a> est une approche que j'ai trouvée et qui tente précisément de faire cela.</p>
<p>L'idée est simple : <strong>intégrer d'abord, découper ensuite</strong>. Au lieu de diviser le texte et d'intégrer ensuite les morceaux qui en résultent, l'algorithme intègre <em>toutes les phrases</em> dès le départ. Il utilise ensuite les relations sémantiques entre les phrases incorporées pour décider de l'emplacement des limites.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagramme illustrant le flux de travail "embed-first chunk-second" dans le cadre du découpage sémantique Max-Min</span> </span></p>
<p>D'un point de vue conceptuel, la méthode traite le découpage comme un problème de regroupement contraint dans l'espace d'intégration. Vous parcourez le document dans l'ordre, une phrase à la fois. Pour chaque phrase, l'algorithme compare son intégration avec celles du bloc actuel. Si la nouvelle phrase est sémantiquement assez proche, elle rejoint le groupe. Si elle est trop éloignée, l'algorithme commence un nouveau bloc. La contrainte principale est que les morceaux doivent suivre l'ordre original des phrases - pas de réorganisation, pas de regroupement global.</p>
<p>Le résultat est un ensemble de morceaux de longueur variable qui reflètent l'endroit où le sens du document change réellement, et non l'endroit où un compteur de caractères arrive à zéro.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Fonctionnement de la stratégie de découpage sémantique Max-Min<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Le découpage sémantique Max-Min détermine les limites des morceaux en comparant la façon dont les phrases sont liées les unes aux autres dans l'espace vectoriel à haute dimension. Au lieu de s'appuyer sur des longueurs fixes, il examine la manière dont le sens évolue dans le document. Le processus peut être décomposé en six étapes :</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Intégrer toutes les phrases et commencer un bloc</h3><p>Le modèle d'intégration convertit chaque phrase du document en une intégration vectorielle. Il traite les phrases dans l'ordre. Si les <em>n</em> premières phrases forment le bloc actuel C, la phrase suivante (sₙ₋ₖ₊₁) doit être évaluée : doit-elle rejoindre le bloc C ou commencer un nouveau bloc ?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Mesurer la cohérence du morceau actuel</h3><p>Dans le bloc C, calculez la similarité cosinus minimale par paire entre tous les enchâssements de phrases. Cette valeur reflète le degré d'interdépendance des phrases au sein du bloc. Une similarité minimale plus faible indique que les phrases sont moins liées, ce qui suggère que le bloc doit être divisé.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Comparez la nouvelle phrase à l'ensemble</h3><p>Ensuite, calculez la similarité maximale en cosinus entre la nouvelle phrase et toute phrase déjà présente dans C. Cette valeur reflète le degré d'alignement sémantique de la nouvelle phrase avec le bloc existant.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Décider s'il convient d'étendre le bloc ou d'en créer un nouveau.</h3><p>Il s'agit de la règle de base :</p>
<ul>
<li><p>Si <strong>la similarité maximale de la nouvelle phrase</strong> avec le bloc <strong>C</strong> est <strong>supérieure ou égale à la</strong> <strong>similarité minimale à l'intérieur de C</strong>, → La nouvelle phrase s'adapte et reste dans le bloc.</p></li>
<li><p>Sinon, → commencer un nouveau bloc.</p></li>
</ul>
<p>Cela permet de s'assurer que chaque bloc conserve sa cohérence sémantique interne.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Ajuster les seuils au fur et à mesure que le document change</h3><p>Pour optimiser la qualité des morceaux, des paramètres tels que la taille des morceaux et les seuils de similarité peuvent être ajustés dynamiquement. Cela permet à l'algorithme de s'adapter à des structures de documents et à des densités sémantiques variables.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Traiter les premières phrases</h3><p>Lorsqu'un bloc ne contient qu'une seule phrase, l'algorithme traite la première comparaison en utilisant un seuil de similarité fixe. Si la similarité entre la phrase 1 et la phrase 2 est supérieure à ce seuil, elles forment un bloc. Dans le cas contraire, elles se séparent immédiatement.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Points forts et limites du découpage sémantique Max-Min<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Le découpage sémantique Max-Min améliore la manière dont les systèmes RAG découpent le texte en utilisant le sens plutôt que la longueur, mais il ne s'agit pas d'une solution miracle. Voici un aperçu pratique de ce qu'il fait de bien et de ce qu'il ne fait pas encore.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">Ce qu'il fait bien</h3><p>Le découpage sémantique Max-Min améliore le découpage traditionnel de trois manières importantes :</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Des limites de morceaux dynamiques, basées sur le sens</strong></h4><p>Contrairement aux approches basées sur la taille fixe ou la structure, cette méthode s'appuie sur la similarité sémantique pour guider le découpage. Elle compare la similarité minimale au sein du bloc actuel (degré de cohésion) à la similarité maximale entre la nouvelle phrase et ce bloc (degré d'adéquation). Si cette dernière est plus élevée, la phrase rejoint le bloc ; sinon, un nouveau bloc est créé.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Réglage simple et pratique des paramètres</strong></h4><p>L'algorithme ne dépend que de trois hyperparamètres principaux :</p>
<ul>
<li><p>la <strong>taille maximale des morceaux</strong>,</p></li>
<li><p>la <strong>similarité minimale</strong> entre les deux premières phrases, et</p></li>
<li><p>le <strong>seuil de similarité</strong> pour l'ajout de nouvelles phrases.</p></li>
</ul>
<p>Ces paramètres s'ajustent automatiquement en fonction du contexte : les morceaux plus grands nécessitent des seuils de similarité plus stricts pour maintenir la cohérence.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Faible surcharge de traitement</strong></h4><p>Étant donné que le pipeline RAG calcule déjà les enchâssements de phrases, le découpage sémantique Max-Min n'ajoute pas de calculs lourds. Tout ce dont il a besoin, c'est d'un ensemble de vérifications de la similarité des cosinus lors de l'analyse des phrases. Il est donc moins coûteux que de nombreuses techniques de regroupement sémantique qui nécessitent des modèles supplémentaires ou un regroupement en plusieurs étapes.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">Ce qu'elle ne peut toujours pas résoudre</h3><p>Le découpage sémantique Max-Min améliore les limites des morceaux, mais n'élimine pas tous les défis de la segmentation des documents. Étant donné que l'algorithme traite les phrases dans l'ordre et ne procède qu'à des regroupements locaux, il peut encore passer à côté de relations à longue portée dans des documents plus longs ou plus complexes.</p>
<p>La <strong>fragmentation du contexte</strong> est un problème courant. Lorsque des informations importantes sont réparties dans différentes parties d'un document, l'algorithme peut placer ces parties dans des morceaux distincts. Chaque morceau ne contient alors qu'une partie de la signification.</p>
<p>Par exemple, dans les notes de mise à jour de Milvus 2.4.13, comme indiqué ci-dessous, un bloc peut contenir l'identifiant de la version tandis qu'un autre contient la liste des fonctionnalités. Une requête telle que <em>"Quelles sont les nouvelles fonctionnalités introduites dans Milvus 2.4.13 ?"</em> dépend des deux. Si ces détails sont répartis entre différents morceaux, le modèle d'intégration peut ne pas les relier, ce qui affaiblit l'extraction.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Exemple montrant la fragmentation du contexte dans les notes de mise à jour de Milvus 2.4.13 avec l'identifiant de la version et la liste des fonctionnalités dans des morceaux distincts.</span> </span></li>
</ul>
<p>Cette fragmentation affecte également l'étape de génération du LLM. Si la référence de la version se trouve dans un morceau et les descriptions des caractéristiques dans un autre, le modèle reçoit un contexte incomplet et ne peut pas raisonner proprement sur la relation entre les deux.</p>
<p>Pour atténuer ces cas, les systèmes utilisent souvent des techniques telles que les fenêtres glissantes, le chevauchement des limites des morceaux ou les analyses à plusieurs passages. Ces approches réintroduisent une partie du contexte manquant, réduisent la fragmentation et aident l'étape d'extraction à conserver les informations connexes.</p>
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
    </button></h2><p>Le découpage sémantique Max-Min n'est pas une solution magique à tous les problèmes de RAG, mais il nous donne une façon plus raisonnable de penser aux limites des morceaux. Au lieu de laisser les limites de jetons décider de l'endroit où les idées sont découpées, il utilise les enchâssements pour détecter les endroits où le sens change réellement. Pour de nombreux documents du monde réel (API, spécifications, journaux, notes de mise à jour, guides de dépannage), cette approche peut à elle seule améliorer sensiblement la qualité de la recherche.</p>
<p>Ce qui me plaît dans cette approche, c'est qu'elle s'intègre naturellement dans les pipelines RAG existants. Si vous intégrez déjà des phrases ou des paragraphes, le coût supplémentaire se résume à quelques contrôles de similarité de cosinus. Vous n'avez pas besoin de modèles supplémentaires, d'un regroupement complexe ou d'un prétraitement lourd. Et lorsque cela fonctionne, les morceaux produits semblent plus "humains", plus proches de la façon dont nous regroupons mentalement les informations lorsque nous lisons.</p>
<p>Mais la méthode comporte encore des zones d'ombre. Elle ne perçoit le sens que localement et ne peut pas reconnecter des informations intentionnellement dispersées. Des fenêtres qui se chevauchent, des balayages en plusieurs passages et d'autres astuces de préservation du contexte sont encore nécessaires, en particulier pour les documents où les références et les explications sont éloignées les unes des autres.</p>
<p>Néanmoins, le découpage sémantique Max-Min nous fait avancer dans la bonne direction : nous nous éloignons du découpage arbitraire du texte et nous nous dirigeons vers des pipelines de recherche qui respectent réellement la sémantique. Si vous cherchez des moyens de rendre RAG plus fiable, cela vaut la peine d'expérimenter.</p>
<p>Vous avez des questions ou souhaitez aller plus loin dans l'amélioration des performances de RAG ? Rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> et communiquez avec des ingénieurs qui construisent et mettent au point des systèmes de recherche réels tous les jours.</p>
