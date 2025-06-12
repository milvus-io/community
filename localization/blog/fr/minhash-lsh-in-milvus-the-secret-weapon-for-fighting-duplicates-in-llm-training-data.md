---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans
  les données d'entraînement LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH dans Milvus 2.6 offre une solution efficace pour dédupliquer des
  ensembles massifs de données de formation LLM, avec un traitement deux fois
  plus rapide et des économies de 3 à 5 fois par rapport aux méthodes
  traditionnelles.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Les grands modèles de langage (LLM) ont transformé le paysage de l'IA grâce à leur capacité à écrire du code, à créer du contenu et à résoudre des problèmes complexes. Cependant, ces modèles puissants nécessitent d'énormes quantités de données de haute qualité pour alimenter leur formation.</p>
<p>Le problème est que les données d'entraînement brutes contiennent souvent une redondance importante. C'est comme si l'on enseignait à un enfant en répétant sans cesse les mêmes leçons tout en omettant d'autres sujets importants. Une grande entreprise d'IA nous a contactés précisément pour ce problème : elle construisait un nouveau modèle de langage ambitieux, mais avait du mal à dédupliquer des dizaines de milliards de documents. Les méthodes traditionnelles de mise en correspondance ne pouvaient pas s'adapter à ce volume, et les outils de déduplication spécialisés nécessitaient d'énormes ressources informatiques, ce qui les rendait non viables d'un point de vue économique.</p>
<p>Pour résoudre ce problème, nous avons introduit l'indexation MinHash LSH (Locality Sensitive Hashing) dans Milvus 2.6. Cet article examine comment MinHash LSH résout efficacement le problème de la déduplication des données pour la formation LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Déduplication des données : L'importance de la déduplication pour la formation LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Des données diversifiées et de haute qualité sont essentielles pour former des LLM performants. Lorsque du contenu dupliqué apparaît dans les données de formation, cela crée plusieurs problèmes importants :</p>
<ul>
<li><p><strong>Ressources gaspillées :</strong> Les données redondantes augmentent le temps de formation, les coûts et la consommation d'énergie.</p></li>
<li><p><strong>Réduction des performances :</strong> Les modèles peuvent s'adapter de manière excessive au contenu répété, ce qui limite leur capacité à s'adapter à de nouvelles informations.</p></li>
<li><p><strong>Effet de mémorisation :</strong> Le contenu dupliqué augmente le risque que les modèles mémorisent et reproduisent mot pour mot un texte spécifique. Cela peut également conduire à des fuites de confidentialité ou à des problèmes de droits d'auteur.</p></li>
<li><p><strong>Évaluations trompeuses :</strong> Les doublons entre les ensembles de formation et de test peuvent accidentellement gonfler les mesures de performance.</p></li>
</ul>
<p>Il existe trois approches principales pour trouver et supprimer les doublons :</p>
<ul>
<li><p><strong>Correspondance exacte :</strong> identifie les doublons identiques par hachage.</p></li>
<li><p><strong>Correspondance approximative :</strong> recherche des doublons proches à l'aide d'algorithmes tels que MinHash LSH et la similarité de Jaccard.</p></li>
<li><p><strong>Correspondance sémantique :</strong> identifie le contenu ayant une signification similaire à l'aide de vecteurs intégrés.</p></li>
</ul>
<p>Avec des corpus de préformation atteignant des téraoctets, voire des pétaoctets, les méthodes traditionnelles d'appariement exact, telles que les comparaisons par paires, sont infaisables sur le plan informatique. La déduplication sémantique ajoute une surcharge significative en utilisant des modèles d'intégration pour générer des vecteurs. Nous avons besoin de méthodes approximatives plus innovantes, comme <strong>MinHash LSH, qui</strong>équilibrent le rappel et la précision tout en maintenant les coûts à un niveau raisonnable, afin de rendre pratique la déduplication à grande échelle.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH : détection efficace des quasi-doublons dans des ensembles de données massifs<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour trouver les quasi-doublons dans un océan de données de formation, nous avons besoin d'un algorithme de correspondance approximative qui soit à la fois efficace et précis. MinHash LSH (Locality Sensitive Hashing) est un excellent outil pour atteindre cet objectif. Décortiquons ce terme apparemment complexe étape par étape.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Étape 1 : Représentation des documents avec MinHash</h3><p>Tout d'abord, nous avons besoin d'un moyen de mesurer la similarité des documents. L'approche standard utilise la similarité de Jaccard :</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Cette formule mesure le chevauchement entre le document A et le document B - plus précisément, le rapport entre les éléments partagés et le nombre total d'éléments uniques. Une valeur plus élevée signifie que les documents sont plus similaires.</p>
<p>Cependant, le calcul direct de cette formule pour des milliards de paires de documents est gourmand en ressources et prendrait des années. MinHash crée des "empreintes digitales" compactes (signatures) qui préservent les relations de similarité tout en accélérant les comparaisons.</p>
<ol>
<li><strong>Le shingling :</strong> Décomposer chaque document en séquences de mots ou de caractères qui se chevauchent (k-shingles). Par exemple, la phrase "J'aime la recherche vectorielle" avec k=3 (par mot) donne : {"I love vector", "love vector search"}.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing :</strong> appliquer plusieurs fonctions de hachage à chaque ensemble de bardeaux et enregistrer la valeur de hachage minimale de chaque fonction. Il en résulte un vecteur de signature pour chaque document.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lors du calcul de la similarité, la probabilité que les valeurs de hachage s'alignent aux mêmes positions dans les signatures MinHash de deux documents (ce qui correspond à la distance de Jaccard de ces signatures) fournit une approximation proche de la similarité de Jaccard de leurs ensembles de bardeaux d'origine. Cela nous permet d'estimer efficacement la similarité des documents sans comparer directement les textes originaux plus volumineux ; à la place, nous pouvons analyser leurs signatures MinHash compactes.</p>
<p>Le principe MinHash consiste à utiliser le mot ayant la plus petite valeur de hachage pour représenter l'ensemble du document, en améliorant la précision par l'incorporation de fonctions de hachage supplémentaires. Les changements de mots mineurs sont susceptibles d'être ignorés car ils n'affectent généralement pas la valeur de hachage minimale. En revanche, les changements plus importants ont tendance à modifier la valeur de hachage et sont plus facilement détectés. Cette méthode peut être considérée comme une mise en commun minimale des valeurs de hachage des différents mots. Outre MinHash, il existe d'autres méthodes, comme SimHash, pour générer des signatures de documents, mais elles ne seront pas abordées ici.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Étape 2 : Identification des documents similaires via LSH</h3><p>Même avec des signatures MinHash compactes, la comparaison de chaque paire sur des millions ou des milliards de documents reste coûteuse en termes de calcul. C'est là qu'intervient le <strong>hachage sensible à la localité (LSH)</strong>.</p>
<p>L'idée principale de LSH est d'utiliser des fonctions de hachage qui <strong>provoquent intentionnellement des collisions :</strong>des éléments <strong>similaires</strong>ont plus de chances d'être hachés dans le même bac, alors que des éléments différents ne le sont pas. C'est le contraire du hachage traditionnel, qui vise à éviter les collisions.</p>
<p>Pour MinHash, une stratégie LSH populaire est la <strong>technique du banding</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Diviser chaque signature MinHash (un vecteur de longueur <em>N</em>) en <em>b</em> bandes, chacune avec <em>r</em> dims<em>(N = b × r</em>).</p></li>
<li><p><strong>Hachage des bandes :</strong> Hacher chaque bande (un sous-vecteur de <em>r</em> valeurs) dans un seau à l'aide d'une fonction de hachage standard.</p></li>
<li><p><strong>Paires candidates :</strong> Si deux documents partagent un godet dans <strong>n'importe quelle</strong> bande, ils sont marqués comme des correspondances potentielles.</p></li>
</ol>
<p>En ajustant le nombre de bandes (b) et le nombre de dimensions par bande ®, vous pouvez contrôler le compromis entre le rappel, la précision et l'efficacité de la recherche.</p>
<p>L'idée clé est la suivante : les documents très similaires auront de nombreuses valeurs de hachage correspondantes dans leurs signatures MinHash. Lorsque ces signatures sont divisées en bandes, une seule bande contenant toutes les valeurs correspondantes suffit à placer deux documents dans le même seau. Plus les documents sont similaires, plus la probabilité que cela se produise dans au moins une bande est élevée, ce qui permet à LSH de faire apparaître efficacement des paires de candidats sans comparer exhaustivement toutes les signatures.</p>
<p>En bref, <strong>MinHash + LSH</strong> permet une déduplication approximative évolutive : MinHash compresse les documents en signatures compactes et LSH réduit efficacement l'espace de recherche en regroupant les correspondances probables. C'est comme repérer des jumeaux dans une foule : il faut d'abord prendre un instantané rapide des caractéristiques de chacun (MinHash), regrouper les personnes qui se ressemblent (LSH), puis inspecter de près les petits groupes pour détecter les doublons réels.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Intégration de MinHash LSH dans Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>L'intégration de MinHash LSH dans Milvus 2.6 a été motivée par un besoin réel. Comme mentionné précédemment, un utilisateur de Milvus - l'une des principales sociétés de LLM - nous a contactés pour nous présenter un défi : dédupliquer efficacement des volumes massifs de données textuelles pour le pré-entraînement LLM.</p>
<p>Les pipelines de déduplication traditionnels s'appuient généralement sur des outils externes découplés des systèmes de stockage et d'extraction, ce qui nécessite des transferts de données coûteux entre les composants. Ce flux de travail fragmenté augmente les frais généraux opérationnels et empêche l'utilisation complète des ressources informatiques distribuées.</p>
<p>Reconnaissant les atouts de Milvus dans le traitement des données vectorielles à haut débit, une idée naturelle s'est imposée : <strong><em>Et si MinHash LSH était intégré à Milvus de manière native, faisant de la déduplication approximative une fonction de base de données de premier ordre ?</em></strong></p>
<p>Cette approche permet un flux de travail complet, de la déduplication à la récupération sémantique, au sein de Milvus, ce qui simplifie les MLOps tout en tirant parti de son évolutivité et de son API unifiée. En collaboration avec notre partenaire, nous avons optimisé MinHash LSH pour l'architecture cloud-native de Milvus, ce qui donne une solution rapide et évolutive pour la déduplication à grande échelle.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Les principales fonctionnalités de Milvus 2.6 sont les suivantes</h3><ul>
<li><p><strong>Indexation MinHash LSH native :</strong> Met en œuvre la technique de regroupement standard pour LSH et prend en charge le reclassement Jaccard facultatif pour améliorer le rappel. Il propose des implémentations en mémoire et en mode mmap pour une plus grande souplesse dans les différentes charges de travail.</p></li>
<li><p><strong>Intégration transparente de l'API :</strong> Les utilisateurs peuvent définir des champs vectoriels MinHash, créer des index <code translate="no">MINHASH_LSH</code>, insérer des données de signature et effectuer des recherches de similarité approximative à l'aide du SDK standard et des API déclaratives de Milvus.</p></li>
<li><p><strong>Distribué et évolutif :</strong> Construite sur l'architecture cloud-native de Milvus, la fonctionnalité prend en charge la mise à l'échelle horizontale pour les grands ensembles de données et le traitement à haut débit.</p></li>
</ul>
<p>Cette intégration a donné des résultats impressionnants. En exécutant MinHash LSH sur Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) entièrement géré, nous avons aidé cet utilisateur à dédupliquer efficacement <strong>10 milliards de documents</strong>. Par rapport à son ancienne approche basée sur MapReduce, la nouvelle solution a <strong>plus que doublé la vitesse de traitement</strong> et a permis de réaliser <strong>des économies de 3 à 5 fois</strong>, grâce à l'indexation et à l'exécution des requêtes optimisées de Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Travaux pratiques : déduplication des ensembles de données LLM à l'aide de Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Retroussons nos manches et utilisons MinHash LSH dans Milvus 2.6 pour effectuer une déduplication approximative à l'échelle.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Prérequis : Génération de signatures MinHash</h3><p>Milvus gère l'indexation et la recherche de signatures MinHash <strong>pré-générées</strong>. Vous devrez les générer pendant le prétraitement à l'aide d'outils tels que <code translate="no">datasketch</code> en Python ou d'une implémentation personnalisée. Les étapes habituelles sont les suivantes</p>
<ol>
<li><p>Lecture des documents bruts</p></li>
<li><p>Découpage (tokenize ou chunk) de chaque document</p></li>
<li><p>Appliquer plusieurs fonctions de hachage pour générer une signature MinHash (par exemple, un tableau uint64 de taille 128).</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Étape 1 : Création d'un schéma dans Milvus</h3><p>Nous devons créer une collection Milvus pour stocker les signatures MinHash et les identifiants des documents correspondants.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Étape 2 : Créer l'index et la collection MINHASH_LSH</strong></h3><p>Il s'agit de l'étape principale. Nous devons spécifier JACCARD comme type de métrique et configurer les paramètres liés à LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Note sur l'ajustement des paramètres : L'efficacité de MinHash LSH dépend fortement du choix des paramètres. Par exemple, le nombre de fonctions de hachage utilisées pendant la génération de la signature MinHash (c'est-à-dire <code translate="no">MINHASH_DIM</code>) affecte la précision et la taille de la signature. Dans la phase LSH, le nombre de bandes (<code translate="no">num_bands</code>) et de lignes par bande déterminent ensemble la plage de sensibilité du seuil de similarité et l'équilibre entre le rappel et la précision. Les utilisateurs doivent expérimenter et affiner les réglages en fonction des caractéristiques de leur jeu de données et de leurs exigences en matière de déduplication. Il s'agit souvent d'un processus itératif.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Étape 3 : Insérer des signatures MinHash</strong></h3><p>Supposons que vous disposiez d'un lot de documents et des signatures MinHash correspondantes.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Étape 5 : Recherche de quasi-doublons</h3><p>Utilisez la signature MinHash d'un document pour rechercher des documents similaires dans la collection.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Étape 6 : Post-traitement et regroupement</h3><p>Les résultats renvoyés sont des <strong>quasi-doublons candidats</strong>. Pour former des groupes de déduplication complets, vous pouvez appliquer des techniques de clustering comme <strong>Union-Find</strong> sur les paires candidates. Chaque groupe obtenu représente un ensemble de doublons ; conservez un document représentatif et archivez ou supprimez les autres.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Conclusion</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH dans Milvus 2.6 est un bond en avant dans le traitement des données d'IA. Ce qui a commencé comme une solution pour la déduplication des données LLM ouvre maintenant des portes à des cas d'utilisation plus larges : nettoyage de contenu Web, gestion de catalogue, détection de plagiat, etc.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Démarrer avec Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 est disponible dès maintenant. Outre MinHash LSH, elle présente des dizaines de nouvelles fonctionnalités et d'optimisations des performances, telles que le stockage hiérarchisé, la méthode de quantification RabbitQ, la recherche en texte intégral améliorée et la multilocation, répondant directement aux défis les plus urgents de la recherche vectorielle aujourd'hui : une mise à l'échelle efficace tout en gardant les coûts sous contrôle.</p>
<p>Prêt à découvrir tout ce qu'offre Milvus ? Plongez dans nos<a href="https://milvus.io/docs/release_notes.md"> notes de version</a>, parcourez la<a href="https://milvus.io/docs"> documentation complète</a> ou consultez nos<a href="https://milvus.io/blog"> blogs sur les fonctionnalités</a>.</p>
<p>Si vous avez des questions ou un cas d'utilisation similaire, n'hésitez pas à nous contacter via notre <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord</a> ou à déposer un problème sur<a href="https://github.com/milvus-io/milvus"> GitHub</a> - nous sommes là pour vous aider à tirer le meilleur parti de Milvus 2.6.</p>
