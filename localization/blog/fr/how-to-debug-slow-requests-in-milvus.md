---
id: how-to-debug-slow-requests-in-milvus.md
title: Comment déboguer les requêtes de recherche lentes dans Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  Dans ce billet, nous vous expliquons comment trier les requêtes lentes dans
  Milvus et nous vous présentons les mesures pratiques que vous pouvez prendre
  pour maintenir une latence prévisible, stable et constamment faible.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>La performance est au cœur de Milvus. Dans des conditions normales, une requête de recherche dans Milvus s'effectue en quelques millisecondes. Mais que se passe-t-il lorsque votre cluster ralentit, c'est-à-dire lorsque la latence de la recherche s'étend à des secondes entières ?</p>
<p>Les recherches lentes ne sont pas fréquentes, mais elles peuvent apparaître à grande échelle ou dans le cadre de charges de travail complexes. Et quand c'est le cas, c'est important : elles perturbent l'expérience des utilisateurs, faussent les performances des applications et révèlent souvent des inefficacités cachées dans votre configuration.</p>
<p>Dans cet article, nous verrons comment trier les requêtes lentes dans Milvus et partagerons les mesures pratiques que vous pouvez prendre pour maintenir une latence prévisible, stable et constamment faible.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identification des recherches lentes<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Le diagnostic d'une requête lente commence par deux questions : <strong>à quelle fréquence cela se produit-il et où va le temps ?</strong> Milvus vous donne les deux réponses par le biais de métriques et de journaux.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Mesures Milvus</h3><p>Milvus exporte des métriques détaillées que vous pouvez surveiller dans les tableaux de bord Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les principaux tableaux sont les suivants :</p>
<ul>
<li><p><strong>Qualité de service → Requête lente</strong>: Marque toute demande dépassant proxy.slowQuerySpanInSeconds (par défaut : 5s). Ces requêtes sont également marquées dans Prometheus.</p></li>
<li><p><strong>Qualité de service → Latence de recherche</strong>: Montre la distribution globale de la latence. Si celle-ci semble normale, mais que les utilisateurs finaux constatent toujours des retards, le problème se situe probablement en dehors de Milvus, au niveau du réseau ou de la couche d'application.</p></li>
<li><p><strong>Nœud de requête → Latence de recherche par phase</strong>: Répartit la latence entre les étapes de mise en file d'attente, de requête et de réduction. Pour une attribution plus approfondie, des panneaux tels que <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em> et <em>Wait Safe Latency</em> révèlent l'étape dominante.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Journaux Milvus</h3><p>Milvus consigne également toutes les requêtes qui durent plus d'une seconde, avec des marqueurs tels que [Search slow]. Ces journaux indiquent <em>quelles</em> requêtes sont lentes, complétant ainsi les informations fournies par les métriques. En règle générale :</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → latence de recherche saine dans la plupart des scénarios</p></li>
<li><p><strong>&gt; 100 ms</strong> → mérite d'être étudié</p></li>
<li><p><strong>&gt; 1 s</strong> → définitivement lent et nécessite de l'attention</p></li>
</ul>
<p>Exemple de journal :</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>En résumé, les <strong>métriques vous indiquent où va le temps ; les journaux vous indiquent quelles requêtes sont satisfaites.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Analyse de la cause première<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Charge de travail élevée</h3><p>Une charge de travail excessive est une cause fréquente de lenteur des requêtes. Lorsqu'une requête a un <strong>NQ</strong> (nombre de requêtes par requête) très élevé, elle peut s'exécuter pendant une période prolongée et monopoliser les ressources du nœud de requête. Les autres demandes s'empilent derrière elle, ce qui entraîne une augmentation de la latence de la file d'attente. Même si chaque requête a un petit NQ, un débit global (QPS) très élevé peut toujours provoquer le même effet, car Milvus peut fusionner les requêtes de recherche concurrentes en interne.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signaux à surveiller :</strong></p>
<ul>
<li><p>Toutes les requêtes présentent une latence élevée inattendue.</p></li>
<li><p>Les métriques du nœud de requête signalent une augmentation de la <strong>latence dans la file d'attente</strong>.</p></li>
<li><p>Les journaux montrent une requête avec un NQ important et une longue durée totale, mais une duréePerNQ relativement faible, ce qui indique qu'une requête surdimensionnée domine les ressources.</p></li>
</ul>
<p><strong>Comment y remédier ?</strong></p>
<ul>
<li><p><strong>Effectuez des requêtes par lots</strong>: Veillez à ce que le NQ reste modeste afin d'éviter de surcharger une seule requête.</p></li>
<li><p><strong>Réduire la taille des nœuds de requête</strong>: Si une forte concurrence fait régulièrement partie de votre charge de travail, ajoutez des nœuds de requête pour répartir la charge et maintenir une faible latence.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Filtrage inefficace</h3><p>Les filtres inefficaces constituent un autre goulot d'étranglement courant. Si les expressions de filtre sont mal structurées ou si les champs manquent d'index scalaires, Milvus peut se rabattre sur une <strong>analyse complète</strong> au lieu d'analyser un petit sous-ensemble ciblé. Les filtres JSON et les paramètres de cohérence stricts peuvent encore augmenter la charge de travail.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signaux à surveiller :</strong></p>
<ul>
<li><p><strong>Latence</strong> élevée <strong>du filtre scalaire</strong> dans les métriques du nœud de requête.</p></li>
<li><p>Les pics de latence ne sont perceptibles que lorsque des filtres sont appliqués.</p></li>
<li><p>Longue <strong>latence d'attente tSafe</strong> si la cohérence stricte est activée.</p></li>
</ul>
<p><strong>Comment y remédier :</strong></p>
<ul>
<li><strong>Simplifier les expressions de filtre</strong>: Réduisez la complexité du plan de requête en optimisant les filtres. Par exemple, remplacez les longues chaînes OR par une expression IN :</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus introduit également un mécanisme de modélisation des expressions de filtre conçu pour améliorer l'efficacité en réduisant le temps passé à analyser des expressions complexes. Voir <a href="https://milvus.io/docs/filtering-templating.md">ce document</a> pour plus de détails.</p>
<ul>
<li><p><strong>Ajouter des index appropriés</strong>: Évitez les balayages complets en créant des index scalaires sur les champs utilisés dans les filtres.</p></li>
<li><p><strong>Traiter efficacement le JSON</strong>: Milvus 2.6 a introduit des index de chemin et des index plats pour les champs JSON, permettant un traitement efficace des données JSON. Le déchiquetage JSON est également <a href="https://milvus.io/docs/roadmap.md">prévu</a> pour améliorer encore les performances. Reportez-vous au <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">document sur les champs JSON</a> pour plus d'informations.</p></li>
<li><p><strong>Ajustez le niveau de cohérence</strong>: Utilisez les lectures cohérentes <code translate="no">_Bounded</code>_ ou <code translate="no">_Eventually</code>_ lorsque des garanties strictes ne sont pas nécessaires, ce qui réduit le temps d'attente de <code translate="no">tSafe</code>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Mauvais choix de l'index vectoriel</h3><p>Les<a href="https://milvus.io/docs/index-explained.md">index vectoriels</a> ne sont pas universels. Le choix d'un mauvais index peut avoir un impact significatif sur la latence. Les index en mémoire offrent les performances les plus rapides mais consomment plus de mémoire, tandis que les index sur disque économisent de la mémoire au détriment de la vitesse. Les vecteurs binaires nécessitent également des stratégies d'indexation spécialisées.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signaux à surveiller :</strong></p>
<ul>
<li><p>Temps de latence élevé pour la recherche de vecteurs dans les métriques des nœuds de requête.</p></li>
<li><p>Saturation des E/S sur disque lors de l'utilisation de DiskANN ou MMAP.</p></li>
<li><p>Requêtes plus lentes immédiatement après le redémarrage en raison d'un démarrage à froid du cache.</p></li>
</ul>
<p><strong>Comment y remédier ?</strong></p>
<ul>
<li><p><strong>Adapter l'index à la charge de travail (vecteurs flottants) :</strong></p>
<ul>
<li><p><strong>HNSW</strong> - idéal pour les cas d'utilisation en mémoire avec un rappel élevé et une faible latence.</p></li>
<li><p><strong>Famille IVF</strong> - compromis flexibles entre le rappel et la vitesse.</p></li>
<li><p><strong>DiskANN</strong> - prend en charge des ensembles de données à l'échelle du milliard, mais nécessite une grande largeur de bande de disque.</p></li>
</ul></li>
<li><p><strong>Pour les vecteurs binaires :</strong> Utiliser l'<a href="https://milvus.io/docs/minhash-lsh.md">index MINHASH_LSH</a> (introduit dans Milvus 2.6) avec la métrique MHJACCARD pour approximer efficacement la similarité de Jaccard.</p></li>
<li><p><strong>Activer</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Mapper les fichiers d'index dans la mémoire au lieu de les garder entièrement résidents pour trouver un équilibre entre la latence et l'utilisation de la mémoire.</p></li>
<li><p><strong>Ajuster les paramètres de l'index/de la recherche</strong>: Ajustez les paramètres pour équilibrer le rappel et la latence pour votre charge de travail.</p></li>
<li><p><strong>Atténuez les démarrages à froid</strong>: Réchauffez les segments fréquemment accédés après un redémarrage afin d'éviter les lenteurs initiales des requêtes.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Conditions d'exécution et d'environnement</h3><p>La lenteur des requêtes n'est pas toujours due à la requête elle-même. Les nœuds de requête partagent souvent des ressources avec des tâches d'arrière-plan, telles que le compactage, la migration de données ou la construction d'index. Les insertions fréquentes peuvent générer de nombreux petits segments non indexés, ce qui oblige à analyser les données brutes. Dans certains cas, des inefficacités spécifiques à une version peuvent également introduire un temps de latence jusqu'à ce qu'elles soient corrigées.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signaux à surveiller :</strong></p>
<ul>
<li><p>Pics d'utilisation de l'unité centrale pendant les tâches d'arrière-plan (compaction, migration, construction d'index).</p></li>
<li><p>Saturation des E/S disque affectant les performances des requêtes.</p></li>
<li><p>Réchauffement très lent du cache après un redémarrage.</p></li>
<li><p>Nombre important de petits segments non indexés (suite à des insertions fréquentes).</p></li>
<li><p>Régressions de latence liées à des versions spécifiques de Milvus.</p></li>
</ul>
<p><strong>Comment y remédier :</strong></p>
<ul>
<li><p><strong>Reprogrammer les tâches d'arrière-plan</strong> (par exemple, le compactage) en dehors des heures de pointe.</p></li>
<li><p><strong>Libérer les collections inutilisées</strong> pour libérer de la mémoire.</p></li>
<li><p><strong>Tenir compte du temps de préchauffage</strong> après les redémarrages ; préchauffer les caches si nécessaire.</p></li>
<li><p>Effectuer<strong>des insertions par lots</strong> pour réduire la création de segments minuscules et permettre au compactage de suivre.</p></li>
<li><p><strong>Restez à jour</strong>: mettez à niveau les versions plus récentes de Milvus pour bénéficier de corrections de bogues et d'optimisations.</p></li>
<li><p><strong>Fournir des ressources</strong>: dédier une unité centrale ou une mémoire supplémentaire aux charges de travail sensibles à la latence.</p></li>
</ul>
<p>En associant chaque signal à l'action appropriée, la plupart des requêtes lentes peuvent être résolues rapidement et de manière prévisible.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Meilleures pratiques pour prévenir les recherches lentes<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>La meilleure session de débogage est celle que vous n'avez jamais besoin d'exécuter. D'après notre expérience, quelques habitudes simples permettent d'éviter les requêtes lentes dans Milvus :</p>
<ul>
<li><p><strong>Planifier l'allocation des ressources</strong> pour éviter la contention de l'unité centrale et du disque.</p></li>
<li><p><strong>Définissez des alertes proactives</strong> pour les défaillances et les pics de latence.</p></li>
<li><p><strong>Veillez à ce que les expressions de filtre soient</strong> courtes, simples et efficaces.</p></li>
<li><p><strong>Effectuez des insertions par lots</strong> et maintenez le NQ/QPS à des niveaux viables.</p></li>
<li><p><strong>Indexez tous les champs</strong> utilisés dans les filtres.</p></li>
</ul>
<p>Les requêtes lentes dans Milvus sont rares et lorsqu'elles apparaissent, elles ont généralement des causes claires et faciles à diagnostiquer. Grâce aux mesures, aux journaux et à une approche structurée, vous pouvez rapidement identifier et résoudre les problèmes. Il s'agit du même guide que notre équipe d'assistance utilise tous les jours, et il est désormais à votre disposition.</p>
<p>Nous espérons que ce guide vous fournira non seulement un cadre de dépannage, mais aussi la confiance nécessaire pour que vos charges de travail Milvus fonctionnent de manière fluide et efficace.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Vous voulez aller plus loin ?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Rejoignez le <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord Milvus</strong></a> pour poser des questions, partager des expériences et apprendre de la communauté.</p></li>
<li><p>Inscrivez-vous à nos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>heures de bureau Milvus</strong></a> pour parler directement à l'équipe et recevoir une assistance pratique pour vos charges de travail.</p></li>
</ul>
