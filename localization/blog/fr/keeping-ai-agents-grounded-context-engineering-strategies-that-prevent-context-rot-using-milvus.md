---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  Maintenir les agents d'IA au sol : Stratégies d'ingénierie contextuelle qui
  empêchent le pourrissement du contexte à l'aide de Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Découvrez pourquoi le pourrissement du contexte se produit dans les flux de
  travail LLM à long terme et comment l'ingénierie du contexte, les stratégies
  de recherche et la recherche vectorielle Milvus permettent aux agents
  d'intelligence artificielle de rester précis, concentrés et fiables dans des
  tâches complexes à plusieurs étapes.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Si vous avez travaillé sur des conversations LLM de longue durée, vous avez probablement connu ce moment de frustration : à mi-chemin d'un long fil de discussion, le modèle commence à dériver. Les réponses deviennent vagues, le raisonnement s'affaiblit et des détails clés disparaissent mystérieusement. Mais si vous lancez exactement la même question dans une nouvelle discussion, le modèle se comporte soudain de manière ciblée, précise et ancrée.</p>
<p>Ce n'est pas le modèle qui se fatigue, c'est le <strong>contexte qui change</strong>. Au fur et à mesure qu'une conversation se développe, le modèle doit jongler avec davantage d'informations et sa capacité à établir des priorités diminue lentement. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Des études antropiques</a> montrent que lorsque les fenêtres contextuelles s'étendent d'environ 8K tokens à 128K, la précision de la recherche peut chuter de 15 à 30 %. Le modèle a encore de la place, mais il ne sait plus ce qui est important. Des fenêtres contextuelles plus grandes permettent de retarder le problème, mais ne l'éliminent pas.</p>
<p>C'est là que l'<strong>ingénierie contextuelle</strong> entre en jeu. Au lieu de donner tout au modèle en une seule fois, nous façonnons ce qu'il voit : nous ne récupérons que les éléments importants, nous compressons ce qui n'a plus besoin d'être verbeux et nous gardons les messages-guides et les outils suffisamment propres pour que le modèle puisse raisonner. L'objectif est simple : rendre les informations importantes disponibles au bon moment et ignorer le reste.</p>
<p>La récupération joue un rôle central à cet égard, en particulier pour les agents à long terme. Les bases de données vectorielles telles que <a href="https://milvus.io/"><strong>Milvus</strong></a> fournissent la base pour ramener efficacement les connaissances pertinentes dans leur contexte, ce qui permet au système de garder les pieds sur terre même si les tâches gagnent en profondeur et en complexité.</p>
<p>Dans ce blog, nous verrons comment la rotation du contexte se produit, les stratégies utilisées par les équipes pour la gérer et les modèles architecturaux - de la récupération à la conception de l'invite - qui permettent aux agents d'IA de rester performants sur des flux de travail longs et à plusieurs étapes.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Pourquoi le pourrissement du contexte se produit-il ?<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>Les gens supposent souvent qu'en donnant plus de contexte à un modèle d'IA, on obtient naturellement de meilleures réponses. Mais ce n'est pas vrai. Les humains ont également du mal à gérer les longues entrées : les sciences cognitives suggèrent que notre mémoire de travail contient environ <strong>7±2 morceaux d'</strong> information. Au-delà, nous commençons à oublier, à brouiller ou à mal interpréter les détails.</p>
<p>Les LLM présentent un comportement similaire, mais à une échelle beaucoup plus grande et avec des modes de défaillance plus dramatiques.</p>
<p>Le problème de fond vient de l'<a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">architecture Transformer</a> elle-même. Chaque jeton doit se comparer à tous les autres jetons, formant une attention par paire sur l'ensemble de la séquence. Cela signifie que le calcul croît en <strong>O(n²)</strong> avec la longueur du contexte. Si vous passez de 1 000 à 100 000 jetons, le modèle ne travaille pas plus dur : il multiplie le nombre d'interactions entre les jetons par <strong>10 000×.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Il y a ensuite le problème des données d'apprentissage.</strong> Les modèles voient beaucoup plus de séquences courtes que de séquences longues. Ainsi, lorsque vous demandez à un LLM d'opérer dans des contextes extrêmement larges, vous le poussez dans un régime pour lequel il n'a pas été formé. Dans la pratique, le raisonnement sur des contextes très longs est souvent <strong>hors de portée de la</strong> plupart des modèles.</p>
<p>Malgré ces limites, les contextes longs sont désormais inévitables. Les premières applications LLM étaient principalement des tâches à tour unique - classification, résumé ou génération simple. Aujourd'hui, plus de 70 % des systèmes d'IA d'entreprise reposent sur des agents qui restent actifs pendant de nombreux cycles d'interaction, souvent pendant des heures, en gérant des flux de travail ramifiés et à plusieurs étapes. Les sessions de longue durée sont passées du statut d'exception à celui de défaut.</p>
<p>La question qui se pose alors est la suivante : <strong>comment maintenir l'attention du modèle sans le submerger ?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Approches de récupération du contexte pour résoudre le problème de la rotation du contexte<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>La récupération est l'un des leviers les plus efficaces dont nous disposons pour lutter contre le pourrissement du contexte et, dans la pratique, elle tend à se manifester dans des modèles complémentaires qui abordent le pourrissement du contexte sous différents angles.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Récupération juste à temps : Réduction du contexte inutile</h3><p>L'une des principales causes du pourrissement du contexte est la <em>surcharge du</em> modèle avec des informations dont il n'a pas encore besoin. Claude Code - l'assistant de codage d'Anthropic - résout ce problème grâce à la <strong>récupération juste à temps (JIT)</strong>, une stratégie dans laquelle le modèle ne récupère les informations que lorsqu'elles deviennent pertinentes.</p>
<p>Au lieu d'intégrer des bases de code ou des ensembles de données entiers dans son contexte (ce qui augmente considérablement les risques de dérive et d'oubli), Claude Code maintient un petit index : chemins d'accès aux fichiers, commandes et liens de documentation. Lorsque le modèle a besoin d'un élément d'information, il récupère cet élément spécifique et l'insère dans le contexte <strong>au moment où il est important, pas</strong>avant.</p>
<p>Par exemple, si vous demandez à Claude Code d'analyser une base de données de 10 Go, il n'essaiera jamais de la charger entièrement. Il travaille plutôt comme un ingénieur :</p>
<ol>
<li><p>Il exécute une requête SQL pour obtenir des résumés de haut niveau de l'ensemble des données.</p></li>
<li><p>Il utilise des commandes telles que <code translate="no">head</code> et <code translate="no">tail</code> pour visualiser des échantillons de données et comprendre leur structure.</p></li>
<li><p>Ne conserve que les informations les plus importantes, telles que les statistiques clés ou les lignes d'échantillons, dans le contexte.</p></li>
</ol>
<p>En minimisant ce qui est conservé dans le contexte, la récupération JIT empêche l'accumulation de jetons non pertinents qui provoquent la pourriture. Le modèle reste concentré car il ne voit jamais que les informations nécessaires à l'étape de raisonnement en cours.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pré-recueil (recherche vectorielle) : Prévenir la dérive du contexte avant qu'elle ne commence</h3><p>Parfois, le modèle ne peut pas "demander" des informations de manière dynamique - l'assistance à la clientèle, les systèmes de questions-réponses et les flux de travail des agents ont souvent besoin des bonnes connaissances <em>avant que</em> la génération ne commence. C'est là que la <strong>pré-récupération</strong> devient essentielle.</p>
<p>Le pourrissement du contexte est souvent dû au fait que le modèle se voit remettre un gros tas de texte brut et qu'il est censé trier ce qui est important. La pré-instruction inverse cette situation : une base de données vectorielle (comme <a href="https://milvus.io/">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) identifie les éléments les plus pertinents <em>avant l'</em> inférence, garantissant ainsi que seul le contexte de grande valeur parvient au modèle.</p>
<p>Dans une configuration RAG typique :</p>
<ul>
<li><p>Les documents sont intégrés et stockés dans une base de données vectorielle, telle que Milvus.</p></li>
<li><p>Au moment de l'interrogation, le système récupère un petit ensemble de morceaux très pertinents par le biais de recherches de similarité.</p></li>
<li><p>Seuls ces morceaux sont intégrés dans le contexte du modèle.</p></li>
</ul>
<p>Cela permet d'éviter le pourrissement de deux manières :</p>
<ul>
<li><p><strong>Réduction du bruit : les</strong> textes non pertinents ou faiblement liés n'entrent jamais dans le contexte.</p></li>
<li><p><strong>Efficacité : les</strong> modèles traitent beaucoup moins de jetons, ce qui réduit le risque de perdre la trace de détails essentiels.</p></li>
</ul>
<p>Milvus peut rechercher des millions de documents en quelques millisecondes, ce qui rend cette approche idéale pour les systèmes en direct où le temps de latence est important.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Recherche hybride JIT et vectorielle</h3><p>La pré-recouvrement basé sur la recherche vectorielle aborde une partie importante du pourrissement du contexte en s'assurant que le modèle commence avec des informations à haut signal plutôt qu'avec du texte brut et surdimensionné. Mais Anthropic met en évidence deux défis réels que les équipes négligent souvent :</p>
<ul>
<li><p><strong>La rapidité d'exécution :</strong> Si la base de connaissances est mise à jour plus rapidement que l'index vectoriel n'est reconstruit, le modèle peut s'appuyer sur des informations périmées.</p></li>
<li><p><strong>Précision :</strong> avant le début d'une tâche, il est difficile de prédire avec précision ce dont le modèle aura besoin, en particulier pour les flux de travail à plusieurs étapes ou exploratoires.</p></li>
</ul>
<p>Dans les charges de travail réelles, une approche hybride est donc la solution optimale.</p>
<ul>
<li><p>Recherche vectorielle de connaissances stables et fiables</p></li>
<li><p>Exploration JIT pilotée par des agents pour les informations qui évoluent ou qui ne deviennent pertinentes qu'en milieu de tâche.</p></li>
</ul>
<p>En combinant ces deux approches, vous bénéficiez de la rapidité et de l'efficacité de la recherche vectorielle pour les informations connues, et de la flexibilité du modèle pour découvrir et charger de nouvelles données chaque fois qu'elles deviennent pertinentes.</p>
<p>Voyons comment cela fonctionne dans un système réel. Prenons l'exemple d'un assistant de documentation de production. La plupart des équipes finissent par opter pour un pipeline en deux étapes : Recherche vectorielle alimentée par Milvus + Recherche JIT basée sur des agents.</p>
<p><strong>1. Recherche vectorielle alimentée par Milvus (pré-recueil)</strong></p>
<ul>
<li><p>Convertissez votre documentation, vos références API, vos changelogs et vos problèmes connus en embeddings.</p></li>
<li><p>Stockez-les dans la base de données vectorielle Milvus avec des métadonnées telles que le domaine du produit, la version et l'heure de mise à jour.</p></li>
<li><p>Lorsqu'un utilisateur pose une question, exécutez une recherche sémantique pour récupérer les K segments les plus pertinents.</p></li>
</ul>
<p>Cette méthode permet de résoudre environ 80 % des requêtes courantes en moins de 500 ms, ce qui donne au modèle un point de départ solide et résistant à la dégradation du contexte.</p>
<p><strong>2. Exploration basée sur des agents</strong></p>
<p>Lorsque la recherche initiale n'est pas suffisante, par exemple lorsque l'utilisateur demande quelque chose de très spécifique ou de très urgent, l'agent peut faire appel à des outils pour obtenir de nouvelles informations :</p>
<ul>
<li><p>Utiliser <code translate="no">search_code</code> pour localiser des fonctions ou des fichiers spécifiques dans la base de code.</p></li>
<li><p>Utiliser <code translate="no">run_query</code> pour extraire des données en temps réel de la base de données.</p></li>
<li><p>Utiliser <code translate="no">fetch_api</code> pour obtenir l'état le plus récent du système</p></li>
</ul>
<p>Ces appels prennent généralement de <strong>3 à 5 secondes</strong>, mais ils garantissent que le modèle fonctionne toujours avec des données fraîches, précises et pertinentes, même pour les questions que le système ne pouvait pas anticiper à l'avance.</p>
<p>Cette structure hybride garantit que le contexte reste opportun, correct et spécifique à la tâche, ce qui réduit considérablement le risque de pourrissement du contexte dans les flux de travail de longue durée des agents.</p>
<p>Milvus est particulièrement efficace dans ces scénarios hybrides car il prend en charge :</p>
<ul>
<li><p><strong>la recherche vectorielle + le filtrage scalaire</strong>, combinant la pertinence sémantique avec des contraintes structurées</p></li>
<li><p>les<strong>mises à jour incrémentielles</strong>, qui permettent d'actualiser les données intégrées sans temps d'arrêt.</p></li>
</ul>
<p>Milvus constitue donc une épine dorsale idéale pour les systèmes qui nécessitent à la fois une compréhension sémantique et un contrôle précis de ce qui est récupéré.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Par exemple, vous pouvez exécuter une requête du type :</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Comment choisir la bonne approche pour traiter la rotation contextuelle ?<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche vectorielle préalable, la recherche juste à temps et la recherche hybride étant toutes disponibles, la question qui se pose naturellement est la suivante : <strong>laquelle devez-vous utiliser ?</strong></p>
<p>Voici une méthode simple mais pratique pour choisir, en fonction de la <em>stabilité de</em> vos connaissances et de la <em>prévisibilité</em> des besoins d'information du modèle.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. La recherche vectorielle → la meilleure pour les domaines stables</h3><p>Si le domaine évolue lentement mais exige de la précision (finance, travail juridique, conformité, documentation médicale), une base de connaissances alimentée par Milvus et dotée d'une fonction de <strong>pré-récupération</strong> est généralement la solution idéale.</p>
<p>Les informations sont bien définies, les mises à jour sont peu fréquentes et il est possible de répondre à la plupart des questions en récupérant d'emblée les documents sémantiquement pertinents.</p>
<p><strong>Tâches prévisibles + connaissances stables → Pré-recueil.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Récupération juste à temps → Meilleure solution pour les flux de travail dynamiques et exploratoires</h3><p>Les domaines tels que le génie logiciel, le débogage, l'analytique et la science des données impliquent des environnements en évolution rapide : nouveaux fichiers, nouvelles données, nouveaux états de déploiement. Le modèle ne peut pas prédire ce dont il aura besoin avant le début de la tâche.</p>
<p><strong>Tâches imprévisibles + connaissances en évolution rapide → récupération juste à temps.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Approche hybride → lorsque les deux conditions sont réunies</h3><p>De nombreux systèmes réels ne sont ni purement stables ni purement dynamiques. Par exemple, la documentation destinée aux développeurs évolue lentement, alors que l'état d'un environnement de production change minute par minute. Une approche hybride vous permet de</p>
<ul>
<li><p>charger des connaissances connues et stables à l'aide d'une recherche vectorielle (rapide, faible latence)</p></li>
<li><p>d'obtenir à la demande des informations dynamiques à l'aide d'outils d'agent (précises et actualisées).</p></li>
</ul>
<p><strong>Connaissances mixtes + structure de tâches mixtes → approche de recherche hybride.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">Et si la fenêtre contextuelle ne suffit toujours pas ?<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ingénierie contextuelle permet de réduire la surcharge, mais le problème est parfois plus fondamental : <strong>la tâche n'est tout simplement pas adaptée</strong>, même avec un découpage minutieux.</p>
<p>Certains flux de travail, comme la migration d'une base de code volumineuse, l'examen d'architectures multiréférentiels ou la production de rapports de recherche approfondis, peuvent dépasser les 200 000 fenêtres de contexte avant que le modèle n'atteigne la fin de la tâche. Même si la recherche vectorielle fait le gros du travail, certaines tâches nécessitent une mémoire plus persistante et structurée.</p>
<p>Anthropic a récemment proposé trois stratégies pratiques.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. La compression : Préserver le signal, supprimer le bruit</h3><p>Lorsque la fenêtre contextuelle approche de sa limite, le modèle peut <strong>compresser les interactions antérieures</strong> en résumés concis. Une bonne compression permet de conserver</p>
<ul>
<li><p>les décisions clés</p></li>
<li><p>les contraintes et les exigences</p></li>
<li><p>les questions en suspens</p></li>
<li><p>Les échantillons ou exemples pertinents</p></li>
</ul>
<p>et supprime :</p>
<ul>
<li><p>les sorties d'outils verbeuses</p></li>
<li><p>les journaux non pertinents</p></li>
<li><p>les étapes redondantes.</p></li>
</ul>
<p>Le défi consiste à trouver un équilibre. Si la compression est trop agressive, le modèle perd des informations essentielles ; si elle est trop légère, vous gagnez peu d'espace. Une compression efficace permet de conserver le "pourquoi" et le "quoi", mais pas le "comment nous en sommes arrivés là".</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. La prise de notes structurée : Déplacer les informations stables hors du contexte</h3><p>Au lieu de tout conserver dans la fenêtre du modèle, le système peut stocker les faits importants dans une <strong>mémoire externe - une</strong>base de données séparée ou un magasin structuré que l'agent peut interroger en cas de besoin.</p>
<p>Par exemple, le prototype d'agent Pokémon de Claude stocke des faits durables tels que :</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Pendant ce temps, les détails transitoires - journaux de combat, sorties d'outils longues - restent en dehors du contexte actif. Cela reflète la manière dont les humains utilisent les carnets de notes : nous ne conservons pas chaque détail dans notre mémoire de travail ; nous stockons des points de référence à l'extérieur et les consultons en cas de besoin.</p>
<p>La prise de notes structurée permet d'éviter le pourrissement du contexte dû à la répétition de détails inutiles, tout en donnant au modèle une source de vérité fiable.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Architecture des sous-agents : Diviser et conquérir les grandes tâches</h3><p>Pour les tâches complexes, il est possible de concevoir une architecture multi-agents dans laquelle un agent principal supervise l'ensemble du travail, tandis que plusieurs sous-agents spécialisés s'occupent d'aspects spécifiques de la tâche. Ces sous-agents plongent dans de grandes quantités de données liées à leurs sous-tâches, mais ne renvoient que les résultats concis et essentiels. Cette approche est couramment utilisée dans des scénarios tels que les rapports de recherche ou l'analyse de données.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En pratique, il est préférable de commencer par utiliser un seul agent combiné à la compression pour gérer la tâche. Le stockage externe ne devrait être introduit que lorsqu'il est nécessaire de conserver la mémoire au fil des sessions. L'architecture multi-agents doit être réservée aux tâches qui nécessitent réellement un traitement parallèle de sous-tâches complexes et spécialisées.</p>
<p>Chaque approche étend la "mémoire de travail" effective du système sans faire exploser la fenêtre contextuelle et sans déclencher de pourrissement du contexte.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Meilleures pratiques pour concevoir un contexte qui fonctionne réellement<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir géré le débordement du contexte, il y a un autre élément tout aussi important : la manière dont le contexte est construit en premier lieu. Même avec la compression, les notes externes et les sous-agents, le système aura du mal à fonctionner si l'invite et les outils eux-mêmes ne sont pas conçus pour supporter des raisonnements longs et complexes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic propose une façon utile de penser à cela - moins comme un exercice unique de rédaction d'un message-guide, et plus comme la construction d'un contexte à travers trois couches.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>Invitations au système : Trouver la zone Boucles d'or</strong></h3><p>La plupart des messages-guides systémiques échouent aux extrêmes. Trop de détails - listes de règles, conditions imbriquées, exceptions codées en dur - rendent l'invite fragile et difficile à maintenir. Trop peu de structure laisse le modèle deviner ce qu'il doit faire.</p>
<p>Les meilleures invites se situent au milieu : suffisamment structurées pour guider le comportement, suffisamment souples pour permettre au modèle de raisonner. En pratique, cela signifie qu'il faut donner au modèle un rôle clair, un flux de travail général et une légère orientation de l'outil - rien de plus, rien de moins.</p>
<p>En voici un exemple :</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Cette invite donne une direction sans submerger le modèle ni le forcer à jongler avec des informations dynamiques qui n'ont pas leur place ici.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Conception d'outils : Moins, c'est plus</h3><p>Une fois que l'invite du système définit le comportement de haut niveau, les outils portent la logique opérationnelle réelle. Un mode d'échec étonnamment courant dans les systèmes augmentés d'outils est simplement le fait d'avoir trop d'outils ou d'avoir des outils dont les objectifs se chevauchent.</p>
<p>Une bonne règle de base s'impose :</p>
<ul>
<li><p><strong>Un outil, un objectif</strong></p></li>
<li><p><strong>Paramètres explicites et non ambigus</strong></p></li>
<li><p><strong>Pas de chevauchement des responsabilités</strong></p></li>
</ul>
<p>Si un ingénieur humain hésite sur l'outil à utiliser, le modèle le fera aussi. Une conception claire des outils réduit l'ambiguïté, diminue la charge cognitive et empêche le contexte d'être encombré par des tentatives d'utilisation d'outils inutiles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">Les informations dynamiques doivent être extraites, et non codées en dur</h3><p>La dernière couche est la plus facile à négliger. Les informations dynamiques ou sensibles au temps, telles que les valeurs d'état, les mises à jour récentes ou l'état spécifique de l'utilisateur, ne doivent pas apparaître du tout dans l'invite du système. En les intégrant à l'invite, on s'assure qu'elles deviendront périmées, gonflées ou contradictoires au fil des tâches.</p>
<p>Au lieu de cela, ces informations ne doivent être récupérées qu'en cas de besoin, soit par extraction, soit par l'intermédiaire d'outils d'agent. Le fait d'exclure le contenu dynamique de l'invite du système permet d'éviter le pourrissement du contexte et de maintenir l'espace de raisonnement du modèle propre.</p>
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
    </button></h2><p>Au fur et à mesure que les agents d'intelligence artificielle s'intègrent dans des environnements de production dans différents secteurs d'activité, ils prennent en charge des flux de travail plus longs et des tâches plus complexes que jamais. Dans ce contexte, la gestion du contexte devient une nécessité pratique.</p>
<p><strong>Cependant, une fenêtre de contexte plus grande ne produit pas automatiquement de meilleurs résultats</strong>; dans de nombreux cas, c'est le contraire qui se produit. Lorsqu'un modèle est surchargé, qu'il reçoit des informations périmées ou qu'il est contraint de répondre à des invites massives, la précision dérive tranquillement. Ce déclin lent et subtil est ce que nous appelons aujourd'hui le <strong>pourrissement du contexte</strong>.</p>
<p>Les techniques telles que la recherche JIT, la pré-recherche, les pipelines hybrides et la recherche sémantique alimentée par des bases de données vectorielles visent toutes le même objectif : <strong>s'assurer que le modèle voit les bonnes informations au bon moment - ni plus, ni moins - afin qu'il puisse rester ancré dans la réalité et produire des réponses fiables.</strong></p>
<p>En tant que base de données vectorielles haute performance à code source ouvert, <a href="https://milvus.io/"><strong>Milvus</strong></a> est au cœur de ce flux de travail. Elle fournit l'infrastructure nécessaire au stockage efficace des connaissances et à la récupération des éléments les plus pertinents avec une faible latence. Associé à la récupération JIT et à d'autres stratégies complémentaires, Milvus aide les agents d'intelligence artificielle à rester précis à mesure que leurs tâches deviennent plus profondes et plus dynamiques.</p>
<p>Mais la récupération n'est qu'une pièce du puzzle. Une bonne conception de l'invite, un ensemble d'outils propres et minimaux et des stratégies de débordement judicieuses - qu'il s'agisse de compression, de notes structurées ou de sous-agents - sont autant d'éléments qui permettent au modèle de rester concentré sur des sessions de longue durée. C'est à cela que ressemble une véritable ingénierie contextuelle : non pas des bidouillages intelligents, mais une architecture réfléchie.</p>
<p>Si vous voulez des agents d'IA qui restent précis pendant des heures, des jours ou des flux de travail entiers, le contexte mérite la même attention que celle que vous accorderiez à n'importe quel autre élément central de votre pile.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
