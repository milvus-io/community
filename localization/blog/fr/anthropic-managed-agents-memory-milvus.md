---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Comment ajouter une mémoire à long terme aux agents gérés d'Anthropic avec
  Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Les agents gérés d'Anthropic ont rendu les agents fiables, mais chaque session
  commence par un blanc. Voici comment associer Milvus pour le rappel sémantique
  à l'intérieur d'une session et la mémoire partagée entre les agents.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Les <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a> d'Anthropic rendent l'infrastructure des agents résiliente. Une tâche de 200 étapes survit désormais à un crash du harnais, à un dépassement de délai de la sandbox ou à un changement d'infrastructure en plein vol sans intervention humaine, et Anthropic rapporte que le temps p50 jusqu'au premier jeton a chuté d'environ 60 % et le p95 de plus de 90 % après le découplage.</p>
<p>Ce que la fiabilité ne résout pas, c'est la mémoire. Une migration de code en 200 étapes qui se heurte à un nouveau conflit de dépendance à l'étape 201 ne peut pas se pencher efficacement sur la manière dont elle a géré le dernier conflit. Un agent qui effectue des analyses de vulnérabilité pour un client ne sait pas qu'un autre agent a déjà résolu le même cas il y a une heure. Chaque session démarre sur une page blanche et les cerveaux parallèles n'ont pas accès à ce que les autres ont déjà résolu.</p>
<p>La solution consiste à associer la <a href="https://milvus.io/">base de données vectorielles Milvus</a> aux agents gérés d'Anthropic : rappel sémantique au sein d'une session et <a href="https://milvus.io/docs/milvus_for_agents.md">couche de mémoire vectorielle</a> partagée entre les sessions. Le contrat de session reste inchangé, le harnais reçoit une nouvelle couche et les tâches des agents à long terme bénéficient de capacités qualitativement différentes.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Ce que les agents gérés ont résolu (et ce qu'ils n'ont pas résolu)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les agents gérés ont résolu le problème de la fiabilité en découplant l'agent en trois modules indépendants. Ce qu'ils n'ont pas résolu, c'est la mémoire, qu'il s'agisse d'un rappel sémantique au cours d'une seule session ou d'une expérience partagée au cours de sessions parallèles.</strong> Voici ce qui a été découplé et où se situe le déficit de mémoire dans cette conception découplée.</p>
<table>
<thead>
<tr><th>Module</th><th>Ce qu'il fait</th></tr>
</thead>
<tbody>
<tr><td><strong>Session</strong></td><td>Un journal d'événements en annexe de tout ce qui s'est passé. Stocké en dehors du harnais.</td></tr>
<tr><td><strong>Harnais</strong></td><td>La boucle qui appelle Claude et achemine les appels d'outils de Claude vers l'infrastructure appropriée.</td></tr>
<tr><td><strong>Bac à sable</strong></td><td>L'environnement d'exécution isolé dans lequel Claude exécute le code et modifie les fichiers.</td></tr>
</tbody>
</table>
<p>Le recadrage qui permet à cette conception de fonctionner est énoncé explicitement dans le billet d'Anthropic :</p>
<p><em>"La session n'est pas la fenêtre contextuelle de Claude.</em></p>
<p>La fenêtre de contexte est éphémère : limitée en tokens, reconstruite par appel de modèle, et rejetée lorsque l'appel revient. La session est durable, stockée en dehors du harnais, et représente le système d'enregistrement pour l'ensemble de la tâche.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lorsqu'un harnais tombe en panne, la plateforme en démarre un nouveau avec <code translate="no">wake(sessionId)</code>. Le nouveau harnais lit le journal des événements via <code translate="no">getSession(id)</code>, et la tâche reprend à partir de la dernière étape enregistrée, sans logique de récupération personnalisée à écrire ni babysitting au niveau de la session à opérer.</p>
<p>Ce que l'article sur les agents gérés n'aborde pas, et ne prétend pas aborder, c'est ce que fait l'agent lorsqu'il doit se souvenir de quoi que ce soit. Deux lacunes apparaissent dès que l'on fait passer des charges de travail réelles dans l'architecture. L'une d'entre elles se situe à l'intérieur d'une seule session, l'autre s'étend d'une session à l'autre.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problème 1 : Pourquoi les journaux de session linéaires échouent après quelques centaines d'étapes ?<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les journaux de session linéaires échouent après quelques centaines d'étapes parce que les lectures séquentielles et la recherche sémantique sont des charges de travail fondamentalement différentes, et que l'</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>ne sert que la première.</strong> Le découpage par position ou la recherche d'un horodatage suffisent à répondre à la question "où s'est arrêtée cette session". Ce n'est pas suffisant pour répondre à la question qu'un agent se posera de manière prévisible pour toute tâche de longue durée : avons-nous déjà rencontré ce type de problème et qu'avons-nous fait pour y remédier ?</p>
<p>Prenons l'exemple d'une migration de code à l'étape 200 qui se heurte à un nouveau conflit de dépendance. La démarche naturelle est de regarder en arrière. L'agent a-t-il déjà rencontré quelque chose de similaire au cours de la même tâche ? Quelle approche a été tentée ? A-t-elle été efficace ou a-t-elle fait régresser quelque chose d'autre en aval ?</p>
<p>Avec <code translate="no">getEvents()</code>, il y a deux façons de répondre à cette question, et les deux sont mauvaises :</p>
<table>
<thead>
<tr><th>Option</th><th>Problème</th></tr>
</thead>
<tbody>
<tr><td>Analyser chaque événement de manière séquentielle</td><td>Lent à 200 pas. Impossible à 2 000.</td></tr>
<tr><td>Déverser une grande partie du flux dans la fenêtre contextuelle</td><td>Coûteux en jetons, peu fiable à l'échelle, et encombre la mémoire de travail de l'agent pour l'étape en cours.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La session est utile pour la récupération et l'audit, mais elle n'a pas été conçue avec un index permettant de savoir si j'ai déjà vu cela auparavant. Les tâches à long terme sont celles pour lesquelles cette question n'est plus facultative.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Solution 1 : Comment ajouter une mémoire sémantique à la session d'un agent géré ?<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Ajouter une collection Milvus à côté du journal de session et faire une double écriture à partir de</strong> <code translate="no">**emitEvent**</code>. Le contrat de session reste intact, et le harnais obtient une requête sémantique sur son propre passé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La conception d'Anthropic laisse une marge de manœuvre pour cela. Leur billet indique que "tout événement récupéré peut également être transformé dans le harnais avant d'être transmis à la fenêtre contextuelle de Claude. Ces transformations peuvent être tout ce que le harnais encode, y compris l'organisation du contexte... et l'ingénierie du contexte". L'ingénierie du contexte se trouve dans le harnais ; la session n'a qu'à garantir la durabilité et la possibilité d'interrogation.</p>
<p>Le modèle : à chaque fois que <code translate="no">emitEvent</code> se déclenche, le harnais calcule également une <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">intégration vectorielle</a> pour les événements qui méritent d'être indexés et les insère dans une collection Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque l'agent atteint l'étape 200 et doit se souvenir de décisions antérieures, la requête est une <a href="https://zilliz.com/glossary/vector-similarity-search">recherche vectorielle</a> limitée à cette session :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Trois détails de production doivent être pris en compte avant l'embarquement :</p>
<ul>
<li><strong>Choisir ce qui doit être indexé.</strong> Tous les événements ne méritent pas d'être intégrés. Les états intermédiaires des appels d'outils, les journaux des tentatives et les événements d'état répétitifs polluent la qualité de la recherche plus rapidement qu'ils ne l'améliorent. La politique de <code translate="no">INDEXABLE_EVENT_TYPES</code> dépend de la tâche, elle n'est pas globale.</li>
<li><strong>Définir la limite de cohérence.</strong> Si le harnais tombe en panne entre l'ajout de la session et l'insertion de Milvus, une couche est brièvement en avance sur l'autre. La fenêtre est petite mais réelle. Choisissez un chemin de réconciliation (réessayer au redémarrage, écrire un journal d'avance, ou réconciliation éventuelle) plutôt que d'espérer.</li>
<li><strong>Contrôlez les dépenses d'intégration.</strong> Une session de 200 étapes qui appelle une API d'intégration externe de manière synchrone à chaque étape produit une facture que personne n'avait prévue. Mettez les encastrements en file d'attente et envoyez-les par lots de manière asynchrone.</li>
</ul>
<p>Une fois ces éléments en place, le rappel prend quelques millisecondes pour la recherche vectorielle et moins de 100 ms pour l'appel d'intégration. Les cinq événements passés les plus pertinents sont intégrés dans le contexte avant que l'agent ne s'aperçoive de la friction. La session conserve son rôle initial de journal durable ; le harnais acquiert la capacité d'interroger son propre passé de manière sémantique plutôt que séquentielle. Il s'agit d'un changement modeste à la surface de l'API et d'un changement structurel dans ce que l'agent peut faire pour les tâches à long terme.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problème 2 : Pourquoi les agents Claude parallèles ne peuvent-ils pas partager leur expérience ?<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les agents Claude parallèles ne peuvent pas partager leur expérience parce que les sessions des agents gérés sont isolées par conception. Le même isolement qui permet une mise à l'échelle horizontale propre empêche également chaque cerveau d'apprendre de tous les autres cerveaux.</strong></p>
<p>Dans un harnais découplé, les cerveaux sont indépendants et sans état. Cette isolation débloque les gains de latence que rapporte Anthropic, et elle maintient également chaque session en cours d'exécution dans l'ignorance de toutes les autres sessions.</p>
<p>L'agent A passe 40 minutes à diagnostiquer un vecteur d'injection SQL délicat pour un client. Une heure plus tard, l'agent B reprend le même cas pour un autre client et passe lui aussi 40 minutes à parcourir les mêmes impasses, à exécuter les mêmes appels d'outils et à parvenir à la même réponse.</p>
<p>Pour un utilisateur unique exécutant un agent occasionnel, il s'agit d'un gaspillage de calcul. Pour une plateforme exécutant des dizaines d'<a href="https://zilliz.com/glossary/ai-agents">agents d'IA</a> simultanés dans le cadre de l'examen du code, de l'analyse des vulnérabilités et de la génération de documentation pour différents clients chaque jour, le coût s'accroît structurellement.</p>
<p>Si l'expérience produite par chaque session s'évapore au moment où la session se termine, l'intelligence est jetable. Une plateforme construite de cette manière évolue linéairement mais ne s'améliore pas au fil du temps, comme le font les ingénieurs humains.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Solution 2 : Comment créer un pool de mémoire d'agent partagé avec Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Construisez une collection de vecteurs que chaque harnais lit au démarrage et sur laquelle il écrit à l'arrêt, partitionnée par locataire afin que l'expérience soit partagée entre les sessions sans fuite entre les clients.</strong></p>
<p>Lorsqu'une session se termine, les décisions clés, les problèmes rencontrés et les approches qui ont fonctionné sont transférés dans la collection partagée de Milvus. Lorsqu'un nouveau cerveau s'initialise, le harnais exécute une requête sémantique dans le cadre de la configuration et injecte les expériences passées les plus pertinentes dans la fenêtre contextuelle. La première étape du nouvel agent hérite des leçons de chaque agent précédent.</p>
<p>Deux décisions techniques permettent de passer du prototype à la production.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Isolation des locataires avec la clé de partition Milvus</h3><p><strong>Partition par</strong> <code translate="no">**tenant_id**</code>,<strong> et les expériences de l'agent du client A ne vivent pas physiquement dans la même partition que celles du client B. Il s'agit d'une isolation au niveau des données plutôt que d'une convention de requête.</strong></p>
<p>Le travail de Brain A sur la base de code de l'entreprise A ne devrait jamais être récupéré par les agents de l'entreprise B. La <a href="https://milvus.io/docs/use-partition-key.md">clé de partition de</a> Milvus gère cela sur une seule collection, sans deuxième collection par locataire et sans logique de partage dans le code de l'application.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Les expériences des agents du client A ne font jamais surface dans les requêtes du client B, non pas parce que le filtre de requête est écrit correctement (bien qu'il doive l'être), mais parce que les données ne se trouvent pas physiquement dans la même partition que celles du client B. Une seule collection à exploiter, l'isolation logique appliquée à la couche des requêtes, l'isolation physique appliquée à la couche des partitions.</p>
<p>Voir les <a href="https://milvus.io/docs/multi_tenancy.md">documents sur les stratégies de multi-tenance</a> pour savoir quand la clé de partition convient et quand des collections ou des bases de données séparées conviennent, et le <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">guide des modèles de multi-tenance RAG</a> pour les notes sur le déploiement de la production.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Pourquoi la qualité de la mémoire des agents nécessite un travail continu</h3><p><strong>La qualité de la mémoire s'érode avec le temps : les solutions de contournement défectueuses qui ont réussi une fois sont rejouées et renforcées, et les entrées périmées liées à des dépendances obsolètes continuent d'induire en erreur les agents qui en héritent. Les défenses sont des programmes opérationnels, et non des caractéristiques de base de données.</strong></p>
<p>Un agent tombe sur une solution de contournement défectueuse qui n'a réussi qu'une seule fois. Il est écrit dans le pool partagé. L'agent suivant le récupère, le reproduit et renforce le mauvais schéma avec un deuxième enregistrement d'utilisation "réussie".</p>
<p>Les entrées périmées suivent une version plus lente du même chemin. Un correctif épinglé à une version de dépendance qui a été obsolète il y a six mois continue à être récupéré et à induire en erreur les agents qui en héritent. Plus le pool est ancien et utilisé, plus ce phénomène s'accumule.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Trois programmes opérationnels permettent de s'en prémunir :</p>
<ul>
<li><strong>Le score de confiance.</strong> Suivi du nombre de fois où une mémoire a été appliquée avec succès dans des sessions en aval. Déclasser les entrées qui échouent lors de la relecture. Promouvoir les entrées qui réussissent à plusieurs reprises.</li>
<li><strong>Pondération temporelle.</strong> Privilégier les expériences récentes. Retirer les entrées qui dépassent un seuil de staleness connu, souvent lié aux changements de version des dépendances majeures.</li>
<li><strong>Contrôles humains ponctuels.</strong> Les entrées dont la fréquence d'extraction est élevée sont très utiles. Lorsque l'une d'entre elles est erronée, elle l'est à de nombreuses reprises, et c'est là que la révision humaine est la plus rentable.</li>
</ul>
<p>Milvus seul ne résout pas ce problème, pas plus que Mem0, Zep ou tout autre produit de mémoire. La mise en œuvre d'un pool avec de nombreux locataires et l'absence de fuites entre locataires est quelque chose que l'on ne peut concevoir qu'une seule fois. Garder ce pool précis, frais et utile est un travail opérationnel continu qu'aucune base de données ne livre préconfiguré.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">À retenir : Ce que Milvus ajoute aux agents gérés d'Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus transforme les Managed Agents d'une plateforme fiable mais oubliable en une plateforme qui enrichit l'expérience au fil du temps en ajoutant un rappel sémantique au sein d'une session et une mémoire partagée entre les agents.</strong></p>
<p>Les agents gérés répondent clairement à la question de la fiabilité : les cerveaux et les mains sont du bétail, et l'un ou l'autre peut mourir sans emporter la tâche avec lui. C'est le problème de l'infrastructure, et Anthropic l'a bien résolu.</p>
<p>Ce qui est resté ouvert, c'est la croissance. Les ingénieurs humains s'enrichissent avec le temps ; des années de travail se transforment en reconnaissance de modèles, et ils ne raisonnent pas à partir de principes premiers pour chaque tâche. Ce n'est pas le cas des agents gérés d'aujourd'hui, car chaque session commence sur une page blanche.</p>
<p>La connexion de la session à Milvus pour le rappel sémantique au sein d'une tâche et la mise en commun de l'expérience entre les cerveaux dans une collection de vecteurs partagée est ce qui donne aux agents un passé qu'ils peuvent réellement utiliser. Le branchement de Milvus est l'élément d'infrastructure ; l'élagage des mauvais souvenirs, le retrait des souvenirs périmés et l'application des limites du locataire sont l'élément opérationnel. Une fois ces deux éléments en place, la forme de la mémoire cesse d'être un handicap pour devenir un capital composé.</p>
<h2 id="Get-Started" class="common-anchor-header">Commencez<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>Essayez-le localement :</strong> démarrez une instance Milvus intégrée avec <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Pas de Docker, pas de cluster, juste <code translate="no">pip install pymilvus</code>. Les charges de travail de production passent à <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone ou Distributed</a> lorsque vous en avez besoin.</li>
<li><strong>Lire la justification de la conception :</strong> L'<a href="https://www.anthropic.com/engineering/managed-agents">article d'</a> Anthropic sur l'<a href="https://www.anthropic.com/engineering/managed-agents">ingénierie des Managed Agents</a> présente en profondeur la session, le harnais et le découplage du bac à sable.</li>
<li><strong>Vous avez des questions ?</strong> Rejoignez la communauté <a href="https://discord.com/invite/8uyFbECzPX">Discord Milvus</a> pour des discussions sur la conception de la mémoire des agents ou réservez une session <a href="https://milvus.io/office-hours">Milvus Office Hours</a> pour étudier votre charge de travail.</li>
<li><strong>Vous préférez la gestion ?</strong> <a href="https://cloud.zilliz.com/signup">Inscrivez-vous à Zilliz Cloud</a> (ou <a href="https://cloud.zilliz.com/login">connectez-vous</a>) pour un Milvus hébergé avec des clés de partition, une mise à l'échelle et une multi-location intégrées. Les nouveaux comptes bénéficient de crédits gratuits sur un e-mail professionnel.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Questions fréquemment posées<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Q : Quelle est la différence entre une session et une fenêtre de contexte dans les Managed Agents d'Anthropic ?</strong></p>
<p>La fenêtre de contexte est l'ensemble éphémère de jetons que voit un seul appel de Claude. Elle est limitée et se réinitialise à chaque invocation du modèle. La session est le journal d'événements durable, uniquement en annexe, de tout ce qui s'est passé dans l'ensemble de la tâche, stocké à l'extérieur du harnais. Lorsqu'un harnais tombe en panne, <code translate="no">wake(sessionId)</code> génère un nouveau harnais qui lit le journal de session et reprend. La session est le système d'enregistrement ; la fenêtre contextuelle est la mémoire de travail. La session n'est pas la fenêtre contextuelle.</p>
<p><strong>Q : Comment puis-je conserver la mémoire de l'agent à travers les sessions de Claude ?</strong></p>
<p>La session elle-même est déjà persistante ; c'est ce que <code translate="no">getSession(id)</code> récupère. Ce qui manque généralement, c'est une mémoire à long terme interrogeable. Le modèle consiste à intégrer les événements à fort impact (décisions, résolutions, stratégies) dans une base de données vectorielle telle que Milvus pendant <code translate="no">emitEvent</code>, puis à les interroger par similarité sémantique au moment de la récupération. On obtient ainsi à la fois le journal de session durable fourni par Anthropic et une couche de rappel sémantique permettant de revenir sur des centaines d'étapes.</p>
<p><strong>Q : Plusieurs agents Claude peuvent-ils partager la mémoire ?</strong></p>
<p>Non, pas du tout. Chaque session de Managed Agents est isolée par conception, ce qui leur permet d'évoluer horizontalement. Pour partager la mémoire entre les agents, ajoutez une collection de vecteurs partagée (par exemple dans Milvus) que chaque harnais lit au démarrage et sur laquelle il écrit à l'arrêt. Utilisez la fonction de clé de partition de Milvus pour isoler les locataires afin que les mémoires des agents du client A ne fuient jamais dans les sessions du client B.</p>
<p><strong>Q : Quelle est la meilleure base de données vectorielle pour la mémoire des agents d'IA ?</strong></p>
<p>La réponse dépend de l'échelle et de la forme du déploiement. Pour les prototypes et les petites charges de travail, une option locale intégrée comme Milvus Lite s'exécute dans le processus sans infrastructure. Pour les agents de production répartis entre de nombreux locataires, vous souhaitez une base de données multitenant mature (clés de partition, recherche filtrée), une recherche hybride (vecteur + scalaire + mot-clé) et une latence de l'ordre de la milliseconde pour des millions de vecteurs. Milvus est conçu pour les charges de travail vectorielles à cette échelle, c'est pourquoi il apparaît dans les systèmes de mémoire d'agents de production construits sur LangChain, Google ADK, Deep Agents et OpenAgents.</p>
