---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Au-delà de la surcharge de contexte : Comment Parlant × Milvus apporte
  contrôle et clarté au comportement des agents LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Découvrez comment Parlant × Milvus utilise la modélisation de l'alignement et
  l'intelligence vectorielle pour rendre le comportement des agents LLM
  contrôlable, explicable et prêt pour la production.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Imaginez que l'on vous demande d'accomplir une tâche qui implique 200 règles de gestion, 50 outils et 30 démonstrations, et que vous n'ayez qu'une heure pour le faire. C'est tout simplement impossible. Pourtant, nous attendons souvent des grands modèles de langage qu'ils fassent exactement cela lorsque nous les transformons en "agents" et que nous les surchargeons d'instructions.</p>
<p>Dans la pratique, cette approche s'effondre rapidement. Les cadres d'agents traditionnels, tels que LangChain ou LlamaIndex, injectent toutes les règles et tous les outils dans le contexte du modèle en même temps, ce qui entraîne des conflits de règles, une surcharge du contexte et un comportement imprévisible en production.</p>
<p>Pour résoudre ce problème, un cadre d'agent open-source appelé<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> a récemment gagné en popularité sur GitHub. Il introduit une nouvelle approche appelée Alignment Modeling, ainsi qu'un mécanisme de supervision et des transitions conditionnelles qui rendent le comportement de l'agent beaucoup plus contrôlable et explicable.</p>
<p>Associé à <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielle open-source, Parlant devient encore plus performant. Milvus ajoute une intelligence sémantique qui permet aux agents de récupérer dynamiquement les règles et le contexte les plus pertinents en temps réel, ce qui les rend précis, efficaces et prêts pour la production.</p>
<p>Dans ce billet, nous allons explorer le fonctionnement de Parlant dans l'ombre et la manière dont son intégration avec Milvus permet d'atteindre le niveau de production.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Pourquoi les frameworks d'agents traditionnels s'effondrent<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>Les frameworks d'agents traditionnels aiment faire les choses en grand : des centaines de règles, des dizaines d'outils et une poignée de démonstrations, le tout entassé dans un seul et unique message d'accueil surchargé. Cela peut sembler parfait dans une démo ou un petit test en bac à sable, mais une fois que vous le mettez en production, les fissures commencent à apparaître rapidement.</p>
<ul>
<li><p><strong>Les règles contradictoires sont source de chaos :</strong> Lorsque deux règles ou plus s'appliquent en même temps, ces frameworks n'ont aucun moyen intégré de décider laquelle l'emporte. Parfois, il en choisit une. Parfois, il mélange les deux. Parfois, il fait quelque chose de totalement imprévisible.</p></li>
<li><p><strong>Les cas marginaux révèlent les lacunes :</strong> Il est impossible de prévoir tout ce qu'un utilisateur pourrait dire. Et lorsque votre modèle est confronté à quelque chose qui ne fait pas partie de ses données d'apprentissage, il se contente de réponses génériques, sans engagement.</p></li>
<li><p><strong>Le débogage est pénible et coûteux :</strong> Lorsqu'un agent se comporte mal, il est presque impossible de déterminer quelle règle est à l'origine du problème. Comme tout se trouve dans une énorme invite système, le seul moyen de résoudre le problème est de réécrire l'invite et de tout tester à nouveau à partir de zéro.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Qu'est-ce que Parlant et comment fonctionne-t-il ?<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant est un moteur d'alignement open-source pour les agents LLM. Vous pouvez contrôler précisément le comportement d'un agent dans différents scénarios en modélisant son processus de prise de décision d'une manière structurée et basée sur des règles.</p>
<p>Pour résoudre les problèmes rencontrés dans les cadres d'agents traditionnels, Parlant introduit une nouvelle approche puissante : <strong>la modélisation de l'alignement</strong>. Son idée centrale est de séparer la définition des règles de leur exécution, en s'assurant que seules les règles les plus pertinentes sont injectées dans le contexte du LLM à tout moment.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Lignes directrices granulaires : Le cœur de la modélisation de l'alignement</h3><p>Au cœur du modèle d'alignement de Parlant se trouve le concept de <strong>directives granulaires</strong>. Au lieu d'écrire une invite de système géante pleine de règles, vous définissez de petites directives modulaires - chacune décrivant la manière dont l'agent doit gérer un type de situation spécifique.</p>
<p>Chaque directive se compose de trois parties :</p>
<ul>
<li><p><strong>Condition</strong> - Une description en langage naturel du moment où la règle doit s'appliquer. Parlant convertit cette condition en un vecteur sémantique et l'associe à la saisie de l'utilisateur pour déterminer si elle est pertinente.</p></li>
<li><p><strong>Action</strong> - Une instruction claire qui définit comment l'agent doit réagir une fois que la condition est remplie. Cette action n'est injectée dans le contexte du LLM que lorsqu'elle est déclenchée.</p></li>
<li><p><strong>Outils</strong> - Toutes les fonctions externes ou API liées à cette règle spécifique. Ils ne sont exposés à l'agent que lorsque la ligne directrice est active, ce qui permet de contrôler l'utilisation des outils et de tenir compte du contexte.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Chaque fois qu'un utilisateur interagit avec l'agent, Parlant exécute une étape de correspondance légère pour trouver les trois à cinq directives les plus pertinentes. Seules ces règles sont injectées dans le contexte du modèle, ce qui permet de garder les messages concis et ciblés tout en garantissant que l'agent suit toujours les bonnes règles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Mécanisme de supervision pour la précision et la cohérence</h3><p>Pour maintenir la précision et la cohérence, Parlant introduit un <strong>mécanisme de supervision</strong> qui agit comme un second niveau de contrôle de la qualité. Le processus se déroule en trois étapes :</p>
<p><strong>1. Génération d'une réponse candidate</strong> - L'agent crée une réponse initiale basée sur les directives correspondantes et le contexte de la conversation en cours.</p>
<p><strong>2. Vérification de la conformité</strong> - La réponse est comparée aux lignes directrices actives pour vérifier que chaque instruction a été suivie correctement.</p>
<p><strong>3. Révision ou confirmation</strong> - En cas de problème, le système corrige le résultat ; si tout est conforme, la réponse est approuvée et envoyée à l'utilisateur.</p>
<p>Ce mécanisme de supervision garantit que l'agent non seulement comprend les règles, mais qu'il les respecte avant de répondre, ce qui améliore à la fois la fiabilité et le contrôle.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Transitions conditionnelles pour le contrôle et la sécurité</h3><p>Dans les cadres d'agents traditionnels, chaque outil disponible est exposé au LLM à tout moment. Cette approche "tout sur la table" conduit souvent à des invites surchargées et à des appels d'outils involontaires. Parlant résout ce problème grâce aux <strong>transitions conditionnelles</strong>. Comme pour les machines à états, une action ou un outil n'est déclenché que lorsqu'une condition spécifique est remplie. Chaque outil est étroitement lié à la ligne directrice correspondante et ne devient disponible que lorsque la condition de cette ligne directrice est activée.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Ce mécanisme transforme l'invocation d'un outil en une transition conditionnelle : les outils passent de l'état "inactif" à l'état "actif" uniquement lorsque leurs conditions de déclenchement sont remplies. En structurant l'exécution de cette manière, Parlant s'assure que chaque action se produit délibérément et contextuellement, ce qui permet d'éviter les abus tout en améliorant l'efficacité et la sécurité du système.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Comment Milvus alimente Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque nous regardons sous le capot du processus de mise en correspondance des directives de Parlant, un défi technique fondamental apparaît clairement : comment le système peut-il trouver les trois à cinq règles les plus pertinentes parmi des centaines, voire des milliers d'options, en quelques millisecondes seulement ? C'est exactement là qu'intervient une base de données vectorielle. C'est la recherche sémantique qui rend cela possible.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Comment Milvus prend en charge le processus de mise en correspondance des directives de Parlant</h3><p>L'appariement des directives fonctionne par similarité sémantique. Le champ Condition de chaque ligne directrice est converti en une intégration vectorielle, capturant sa signification plutôt que son texte littéral. Lorsqu'un utilisateur envoie un message, Parlant compare la sémantique de ce message à toutes les lignes directrices stockées pour trouver les plus pertinentes.</p>
<p>Voici comment fonctionne le processus, étape par étape :</p>
<p><strong>1. Encodage de la requête</strong> - Le message de l'utilisateur et l'historique des conversations récentes sont transformés en un vecteur de requête.</p>
<p><strong>2. Recherche de similitudes</strong> - Le système effectue une recherche de similitudes dans la base de vecteurs de directives pour trouver les correspondances les plus proches.</p>
<p><strong>3. Récupération des résultats Top-K</strong> - Les trois à cinq directives les plus pertinentes d'un point de vue sémantique sont renvoyées.</p>
<p><strong>4. Injecter dans le contexte</strong> - Ces lignes directrices correspondantes sont ensuite insérées dynamiquement dans le contexte du LLM afin que le modèle puisse agir selon les règles correctes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour que ce flux de travail soit possible, la base de données vectorielles doit offrir trois fonctionnalités essentielles : une recherche par approximation du plus proche voisin (ANN) très performante, un filtrage flexible des métadonnées et des mises à jour de vecteurs en temps réel. <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de données vectorielles open-source et cloud-native, offre des performances de niveau production dans ces trois domaines.</p>
<p>Pour comprendre comment Milvus fonctionne dans des scénarios réels, prenons l'exemple d'un agent de services financiers.</p>
<p>Supposons que le système définisse 800 directives commerciales couvrant des tâches telles que les demandes de renseignements sur les comptes, les transferts de fonds et les consultations sur les produits de gestion de patrimoine. Dans cette configuration, Milvus fait office de couche de stockage et d'extraction pour toutes les données relatives aux directives.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Maintenant, lorsqu'un utilisateur dit "Je veux transférer 100 000 RMB sur le compte de ma mère", le flux d'exécution est le suivant :</p>
<p><strong>1. Rectoriser la requête</strong> - Convertir l'entrée de l'utilisateur en un vecteur à 768 dimensions.</p>
<p><strong>2. Recherche hybride</strong> - Exécuter une recherche de similarité vectorielle dans Milvus avec filtrage des métadonnées (par exemple, <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Classement des résultats</strong> - Classer les lignes directrices candidates sur la base des scores de similarité combinés à leurs valeurs de <strong>priorité</strong>.</p>
<p><strong>4. Injection de contexte</strong> - Injecter les lignes directrices correspondant au Top 3 ( <code translate="no">action_text</code> ) dans le contexte de l'agent Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans cette configuration, Milvus offre une latence P99 inférieure à 15 ms, même lorsque la bibliothèque de lignes directrices atteint 100 000 entrées. Par comparaison, l'utilisation d'une base de données relationnelle traditionnelle avec correspondance par mot-clé entraîne généralement une latence supérieure à 200 ms et une précision de correspondance nettement inférieure.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Comment Milvus permet la mémoire à long terme et la personnalisation</h3><p>Milvus ne se contente pas de faire correspondre des lignes directrices. Dans les scénarios où les agents ont besoin d'une mémoire à long terme et de réponses personnalisées, Milvus peut servir de couche de mémoire qui stocke et récupère les interactions passées des utilisateurs sous forme de vecteurs intégrés, ce qui aide l'agent à se souvenir de ce qui a été discuté auparavant.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque le même utilisateur revient, l'agent peut récupérer les interactions historiques les plus pertinentes dans Milvus et les utiliser pour générer une expérience plus connectée et plus humaine. Par exemple, si un utilisateur a posé une question sur un fonds d'investissement la semaine dernière, l'agent peut se souvenir de ce contexte et y répondre de manière proactive : "Bienvenue ! Avez-vous encore des questions sur le fonds dont nous avons parlé la dernière fois ?"</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Comment optimiser les performances des systèmes d'agents alimentés par Milvus ?</h3><p>Lors du déploiement d'un système d'agent alimenté par Milvus dans un environnement de production, l'optimisation des performances devient essentielle. Pour obtenir une faible latence et un débit élevé, plusieurs paramètres clés doivent être pris en compte :</p>
<p><strong>1. Choix du bon type d'index</strong></p>
<p>Il est important de sélectionner la structure d'index appropriée. Par exemple, HNSW (Hierarchical Navigable Small World) est idéal pour les scénarios à fort taux de rappel tels que la finance ou la santé, où la précision est essentielle. IVF_FLAT fonctionne mieux pour les applications à grande échelle telles que les recommandations en matière de commerce électronique, où un rappel légèrement inférieur est acceptable en échange d'une performance plus rapide et d'une utilisation réduite de la mémoire.</p>
<p><strong>2. Stratégie de partage</strong></p>
<p>Lorsque le nombre de recommandations stockées dépasse un million d'entrées, il est recommandé d'utiliser <strong>Partition</strong> pour diviser les données par domaine d'activité ou par cas d'utilisation. Le partitionnement réduit l'espace de recherche par requête, ce qui améliore la vitesse d'extraction et maintient la latence stable, même lorsque l'ensemble de données augmente.</p>
<p><strong>3. Configuration du cache</strong></p>
<p>Pour les directives fréquemment consultées, telles que les requêtes standard des clients ou les flux de travail à fort trafic, vous pouvez utiliser la mise en cache des résultats de la requête Milvus. Cela permet au système de réutiliser les résultats précédents, réduisant la latence à moins de 5 millisecondes pour les recherches répétées.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Démonstration pratique : Comment construire un système intelligent de questions-réponses avec Parlant et Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> est une version légère de Milvus - une bibliothèque Python qui peut être facilement intégrée dans vos applications. Elle est idéale pour le prototypage rapide dans des environnements tels que les carnets Jupyter ou pour l'exécution sur des appareils périphériques et intelligents avec des ressources de calcul limitées. Malgré son faible encombrement, Milvus Lite prend en charge les mêmes API que les autres déploiements Milvus. Cela signifie que le code côté client que vous écrivez pour Milvus Lite peut se connecter de manière transparente à une instance Milvus ou Zilliz Cloud complète ultérieurement - aucune refonte n'est nécessaire.</p>
<p>Dans cette démo, nous utiliserons Milvus Lite en conjonction avec Parlant pour démontrer comment construire un système de questions-réponses intelligent qui fournit des réponses rapides et contextuelles avec une configuration minimale.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><p>1. GitHub Parlant : https://github.com/emcie-co/parlant</p>
<p>2. documentation Parlant : https://parlant.io/docs</p>
<p>3. python3.10+</p>
<p>4. clé OpenAI</p>
<p>5. MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Etape 1 : Installer les dépendances</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Étape 2 : Configurer les variables d'environnement</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Étape 3 : Implémenter le code de base</h3><ul>
<li>Créer un Embedder OpenAI personnalisé</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Initialiser la base de connaissances</li>
</ul>
<p>1. créer une collection Milvus nommée kb_articles.</p>
<p>2. insérer des échantillons de données (par exemple, politique de remboursement, politique d'échange, délai d'expédition)</p>
<p>3. construire un index HNSW pour accélérer la recherche.</p>
<ul>
<li>Construire l'outil de recherche vectorielle</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Configurer l'agent Parlant</li>
</ul>
<p><strong>Ligne directrice 1 :</strong> Pour les questions factuelles ou liées à la politique, l'agent doit d'abord effectuer une recherche vectorielle.</p>
<p><strong>Directive 2 :</strong> Lorsque des preuves sont trouvées, l'agent doit répondre en utilisant un modèle structuré (résumé + points clés + sources).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Rédiger le code complet</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Étape 4 : Exécuter le code</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Visitez le terrain de jeu :</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vous avez maintenant réussi à construire un système de questions-réponses intelligent en utilisant Parlant et Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex : Leurs différences et leur complémentarité<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>En quoi Parlant diffère-t-il des frameworks d'agents existants tels que <strong>LangChain</strong> ou <strong>LlamaIndex</strong>?</p>
<p>LangChain et LlamaIndex sont des frameworks à usage général. Ils fournissent une large gamme de composants et d'intégrations, ce qui les rend idéaux pour le prototypage rapide et les expériences de recherche. Cependant, lorsqu'il s'agit de les déployer en production, les développeurs doivent souvent créer eux-mêmes des couches supplémentaires, telles que la gestion des règles, les contrôles de conformité et les mécanismes de fiabilité, afin de maintenir la cohérence et la fiabilité des agents.</p>
<p>Parlant propose une gestion intégrée des directives, des mécanismes d'autocritique et des outils d'explicitation qui aident les développeurs à gérer la façon dont un agent se comporte, répond et raisonne. Parlant est donc particulièrement adapté aux cas d'utilisation à fort enjeu, en contact avec les clients, où l'exactitude et la responsabilité sont importantes, comme dans les secteurs de la finance, de la santé et des services juridiques.</p>
<p>En fait, ces cadres peuvent fonctionner ensemble :</p>
<ul>
<li><p>Utilisez LangChain pour construire des pipelines de traitement de données complexes ou des flux de recherche.</p></li>
<li><p>Utilisez Parlant pour gérer la couche d'interaction finale, en veillant à ce que les résultats respectent les règles de l'entreprise et restent interprétables.</p></li>
<li><p>Utiliser Milvus comme base de données vectorielles pour assurer la recherche sémantique en temps réel, la mémoire et la récupération des connaissances dans l'ensemble du système.</p></li>
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
    </button></h2><p>Alors que les agents LLM passent de l'expérimentation à la production, la question clé n'est plus de savoir ce qu'ils peuvent faire, mais comment ils peuvent le faire de manière fiable et sûre. Parlant fournit la structure et le contrôle nécessaires à cette fiabilité, tandis que Milvus fournit l'infrastructure vectorielle évolutive qui assure la rapidité et la prise en compte du contexte.</p>
<p>Ensemble, ils permettent aux développeurs de construire des agents d'IA qui ne sont pas seulement capables, mais dignes de confiance, explicables et prêts pour la production.</p>
<p>Découvrez<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant sur GitHub</a> et intégrez-le à<a href="https://milvus.io"> Milvus</a> pour créer votre propre système d'agents intelligents et guidés par des règles.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
