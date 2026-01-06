---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Nous avons formé et mis à disposition un modèle de mise en évidence sémantique
  bilingue pour la production de RAG et la recherche d'IA.
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Plongez au cœur de la mise en évidence sémantique, découvrez comment le modèle
  bilingue de Zilliz est construit et comment il se comporte dans les systèmes
  RAG en anglais et en chinois.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Que vous construisiez une recherche de produits, un pipeline RAG ou un agent d'intelligence artificielle, les utilisateurs ont en fin de compte besoin de la même chose : un moyen rapide de voir pourquoi un résultat est pertinent. Le <strong>surlignage</strong> permet de marquer le texte exact qui soutient la correspondance, de sorte que les utilisateurs n'ont pas besoin de scanner l'ensemble du document.</p>
<p>La plupart des systèmes s'appuient encore sur la mise en évidence par mot clé. Si un utilisateur recherche "performances de l'iPhone", le système met en évidence les termes exacts "iPhone" et "performances". Mais cette méthode ne fonctionne plus dès que le texte exprime la même idée en utilisant des termes différents. Une description telle que "Puce A15 Bionic, plus d'un million dans les benchmarks, fluide sans décalage" traite clairement des performances, mais rien n'est mis en évidence parce que les mots clés n'apparaissent jamais.</p>
<p>La<strong>mise en évidence sémantique</strong> résout ce problème. Au lieu de faire correspondre des chaînes de caractères exactes, elle identifie des portions de texte qui sont sémantiquement alignées avec la requête. Pour les systèmes RAG, la recherche IA et les agents - où la pertinence dépend du sens plutôt que de la forme superficielle - cela permet d'obtenir des explications plus précises et plus fiables sur la raison pour laquelle un document a été récupéré.</p>
<p>Cependant, les méthodes de mise en évidence sémantique existantes ne sont pas conçues pour des charges de travail d'IA de production. Après avoir évalué toutes les solutions disponibles, nous avons constaté qu'aucune n'offrait la précision, la latence, la couverture multilingue ou la robustesse requises pour les pipelines RAG, les systèmes d'agents ou la recherche sur le Web à grande échelle. <strong>Nous avons donc formé notre propre modèle de mise en évidence sémantique bilingue et l'avons mis en libre accès.</strong></p>
<ul>
<li><p>Notre modèle de mise en évidence sémantique : <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Dites-nous ce que vous en pensez : rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, suivez-nous sur <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> ou réservez une session de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20 minutes</a> avec nous dans le <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">cadre des Milvus Office Hours</a>.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Comment fonctionne la mise en évidence par mot-clé - et pourquoi elle échoue dans les systèmes d'IA modernes<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les systèmes de recherche traditionnels mettent en œuvre la mise en évidence par simple correspondance de mots-clés</strong>. Lorsque les résultats sont renvoyés, le moteur localise les positions exactes des jetons qui correspondent à la requête et les enveloppe dans un balisage (généralement les balises <code translate="no">&lt;em&gt;</code> ), laissant au frontend le soin de rendre la mise en évidence. Cette méthode fonctionne bien lorsque les termes de la requête apparaissent textuellement dans le texte.</p>
<p>Le problème est que ce modèle suppose que la pertinence est liée au chevauchement exact des mots clés. Dès que ce postulat est rompu, la fiabilité chute rapidement. Tout résultat exprimant la bonne idée avec une formulation différente n'est pas mis en évidence, même si l'étape de recherche a été correcte.</p>
<p>Cette faiblesse devient évidente dans les applications modernes de l'IA. Dans les pipelines RAG et les flux de travail des agents d'IA, les requêtes sont plus abstraites, les documents sont plus longs et les informations pertinentes peuvent ne pas réutiliser les mêmes mots. La mise en évidence par mot-clé ne peut plus montrer aux développeurs - ou aux utilisateurs finaux - où<em>se trouve réellement la réponse</em>, ce qui donne l'impression que le système dans son ensemble est moins précis, même lorsque la recherche fonctionne comme prévu.</p>
<p>Supposons qu'un utilisateur demande <em>"Comment puis-je améliorer l'efficacité d'exécution du code Python ?"</em> Le système extrait un document technique d'une base de données vectorielle. La mise en évidence traditionnelle ne peut marquer que les correspondances littérales telles que <em>"Python",</em> <em>"code",</em> <em>"exécution"</em> et <em>"efficacité".</em></p>
<p>Cependant, les parties les plus utiles du document peuvent être :</p>
<ul>
<li><p>Utiliser les opérations vectorisées de NumPy au lieu de boucles explicites</p></li>
<li><p>Éviter la création répétée d'objets à l'intérieur des boucles</p></li>
</ul>
<p>Ces phrases répondent directement à la question, mais elles ne contiennent aucun des termes de la requête. Par conséquent, la mise en évidence traditionnelle échoue complètement. Le document peut être pertinent, mais l'utilisateur doit le parcourir ligne par ligne pour trouver la réponse.</p>
<p>Le problème est encore plus prononcé avec les agents d'intelligence artificielle. Souvent, la requête de recherche d'un agent n'est pas la question originale de l'utilisateur, mais une instruction dérivée produite par le raisonnement et la décomposition des tâches. Par exemple, si un utilisateur demande <em>: "Pouvez-vous analyser les tendances récentes du marché ?",</em> l'agent pourrait générer une requête du type "Récupérer les données sur les ventes d'électronique grand public du quatrième trimestre 2024, les taux de croissance d'une année sur l'autre, l'évolution des parts de marché des principaux concurrents et les fluctuations des coûts de la chaîne d'approvisionnement".</p>
<p>Cette requête englobe plusieurs dimensions et codifie une intention complexe. La mise en évidence traditionnelle par mot-clé ne peut toutefois que marquer mécaniquement les correspondances littérales telles que <em>"2024",</em> <em>"données de vente"</em> ou <em>"taux de croissance".</em></p>
<p>En attendant, les informations les plus précieuses peuvent ressembler à ce qui suit :</p>
<ul>
<li><p>La série iPhone 15 a entraîné une reprise plus large du marché</p></li>
<li><p>Les contraintes d'approvisionnement en puces ont fait grimper les coûts de 15 %.</p></li>
</ul>
<p>Ces conclusions peuvent ne pas partager un seul mot-clé avec la requête, même si elles correspondent exactement à ce que l'agent essaie d'extraire. Les agents ont besoin d'identifier rapidement les informations réellement utiles à partir de grands volumes de contenu récupéré, et la mise en évidence par mot-clé n'offre pas d'aide réelle.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">Qu'est-ce que la mise en évidence sémantique et quels sont les points faibles des solutions actuelles ?<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>mise en évidence sémantique repose sur la même idée que celle qui sous-tend la recherche sémantique : l'appariement basé sur le sens plutôt que sur les mots exacts</strong>. Dans la recherche sémantique, les modèles d'intégration cartographient le texte en vecteurs, de sorte qu'un système de recherche - généralement soutenu par une base de données vectorielles comme <a href="https://milvus.io/">Milvus - peut</a>retrouver des passages qui véhiculent la même idée que la requête, même si la formulation est différente. La mise en évidence sémantique applique ce principe à une granularité plus fine. Au lieu de marquer les occurrences littérales des mots-clés, elle met en évidence les passages spécifiques d'un document qui sont sémantiquement pertinents par rapport à l'intention de l'utilisateur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette approche résout un problème fondamental de la mise en évidence traditionnelle, qui ne fonctionne que lorsque les termes de la requête apparaissent textuellement. Si un utilisateur recherche "performances de l'iPhone", la mise en évidence par mot-clé ignore des expressions telles que "puce A15 Bionic", "plus d'un million de tests" ou "fluide sans décalage", même si ces lignes répondent clairement à la question. La mise en évidence sémantique capture ces connexions axées sur le sens et fait apparaître les parties du texte qui intéressent réellement les utilisateurs.</p>
<p>En théorie, il s'agit d'un problème de correspondance sémantique simple. Les modèles d'intégration modernes codent déjà bien la similarité, de sorte que les éléments conceptuels sont déjà en place. Le défi vient des contraintes du monde réel : la mise en évidence se produit à chaque requête, souvent à travers de nombreux documents récupérés, ce qui rend la latence, le débit et la robustesse inter-domaines des exigences non négociables. Les grands modèles de langage sont tout simplement trop lents et trop coûteux pour fonctionner sur ce chemin à haute fréquence.</p>
<p>C'est pourquoi la mise en évidence sémantique pratique nécessite un modèle léger et spécialisé, suffisamment petit pour s'intégrer à l'infrastructure de recherche et suffisamment rapide pour renvoyer les résultats en quelques millisecondes. C'est là que la plupart des solutions existantes échouent. Les modèles lourds sont précis mais ne peuvent pas fonctionner à grande échelle ; les modèles légers sont rapides mais perdent en précision ou échouent sur des données multilingues ou spécifiques à un domaine.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En début d'année, OpenSearch a publié un modèle dédié à la mise en évidence sémantique : <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Bien qu'il s'agisse d'une tentative significative pour résoudre le problème, elle présente deux limitations importantes.</p>
<ul>
<li><p><strong>Petite fenêtre contextuelle :</strong> Le modèle est basé sur une architecture BERT et prend en charge un maximum de 512 tokens, soit environ 300-400 caractères chinois ou 400-500 mots anglais. Dans le monde réel, les descriptions de produits et les documents techniques comportent souvent des milliers de mots. Le contenu au-delà de la première fenêtre est simplement tronqué, ce qui oblige le modèle à identifier les points forts sur la base d'une petite partie seulement du document.</p></li>
<li><p><strong>Mauvaise généralisation hors domaine :</strong> Le modèle ne fonctionne bien que sur des distributions de données similaires à son ensemble d'apprentissage. Lorsqu'il est appliqué à des données hors domaine - comme l'utilisation d'un modèle formé sur des articles de presse pour mettre en évidence le contenu du commerce électronique ou de la documentation technique - les performances se dégradent fortement. Dans nos expériences, le modèle atteint un score F1 d'environ 0,72 sur les données du domaine, mais tombe à environ 0,46 sur les ensembles de données hors domaine. Ce niveau d'instabilité est problématique en production. En outre, le modèle ne prend pas en charge le chinois.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> est un modèle développé par <a href="https://zilliz.com/customers/naver">Naver</a> et a été initialement formé pour l'<strong>élagage de contexte - une</strong>tâche qui est étroitement liée à la mise en évidence sémantique.</p>
<p>Ces deux tâches reposent sur la même idée sous-jacente : l'utilisation de la correspondance sémantique pour identifier le contenu pertinent et filtrer les parties non pertinentes. C'est pourquoi Provence peut être réutilisé pour la mise en évidence sémantique avec relativement peu d'adaptation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence est un modèle exclusivement anglais et fonctionne raisonnablement bien dans ce contexte. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> est sa variante multilingue, qui prend en charge plus d'une douzaine de langues, dont le chinois, le japonais et le coréen. À première vue, XProvence semble être un bon candidat pour les scénarios de mise en évidence sémantique bilingues ou multilingues.</p>
<p>Dans la pratique, cependant, Provence et XProvence présentent plusieurs limites notables :</p>
<ul>
<li><p><strong>Une performance plus faible en anglais dans le modèle multilingue :</strong> XProvence n'atteint pas les performances de Provence sur les benchmarks en anglais. Il s'agit d'un compromis courant dans les modèles multilingues : la capacité est partagée entre les langues, ce qui entraîne souvent des performances moindres dans les langues à ressources élevées telles que l'anglais. Cette limitation est importante dans les systèmes réels où l'anglais reste une charge de travail principale ou dominante.</p></li>
<li><p><strong>Performances limitées en chinois :</strong> XProvence prend en charge de nombreuses langues. Pendant la formation multilingue, les données et la capacité du modèle sont réparties entre les différentes langues, ce qui limite la spécialisation du modèle dans une seule d'entre elles. Par conséquent, ses performances en chinois ne sont que marginalement acceptables et souvent insuffisantes pour les cas d'utilisation de mise en évidence de haute précision.</p></li>
<li><p><strong>Inadéquation entre les objectifs d'élagage et de mise en évidence :</strong> Provence est optimisé pour l'élagage du contexte, où la priorité est la mémorisation - conserver autant de contenu potentiellement utile que possible pour éviter de perdre des informations critiques. La mise en évidence sémantique, en revanche, met l'accent sur la précision : elle ne met en évidence que les phrases les plus pertinentes, et non de grandes parties du document. Lorsque des modèles de type Provence sont appliqués à la mise en évidence, ce décalage conduit souvent à des mises en évidence trop larges ou trop bruyantes.</p></li>
<li><p><strong>Licence restrictive :</strong> Provence et XProvence sont tous deux publiés sous la licence CC BY-NC 4.0, qui n'autorise pas l'utilisation commerciale. Cette seule restriction les rend inadaptés à de nombreux déploiements en production.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Open Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> est un projet communautaire qui réimplante le pipeline de formation Provence de manière ouverte et transparente. Il fournit non seulement des scripts d'entraînement, mais aussi des flux de traitement de données, des outils d'évaluation et des modèles pré-entraînés à plusieurs échelles.</p>
<p>L'un des principaux avantages d'Open Provence est sa <strong>licence MIT permissive</strong>. Contrairement à Provence et XProvence, il peut être utilisé en toute sécurité dans des environnements commerciaux sans restrictions légales, ce qui le rend attrayant pour les équipes orientées vers la production.</p>
<p>Cela dit, Open Provence ne prend actuellement en charge que l <strong>'anglais et le japonais</strong>, ce qui le rend inadapté à nos cas d'utilisation bilingues.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Nous avons formé un modèle de mise en évidence sémantique bilingue et l'avons mis à disposition en libre accès<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Un modèle de surlignage sémantique conçu pour des charges de travail réelles doit offrir quelques capacités essentielles :</p>
<ul>
<li><p>De solides performances multilingues</p></li>
<li><p>Une fenêtre contextuelle suffisamment large pour prendre en charge de longs documents</p></li>
<li><p>Une généralisation robuste en dehors du domaine</p></li>
<li><p>Une grande précision dans les tâches de mise en évidence sémantique</p></li>
<li><p>Une licence permissive et adaptée à la production (MIT ou Apache 2.0).</p></li>
</ul>
<p>Après avoir évalué les solutions existantes, nous avons constaté qu'aucun des modèles disponibles ne répondait aux exigences requises pour une utilisation en production. Nous avons donc décidé d'entraîner notre propre modèle de surlignage sémantique : <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour atteindre tous ces objectifs, nous avons adopté une approche simple : utiliser de grands modèles de langage pour générer des données étiquetées de haute qualité, puis entraîner un modèle de mise en évidence sémantique léger à l'aide d'un outil open-source. Cela nous permet de combiner la force de raisonnement des LLM avec l'efficacité et la faible latence requises dans les systèmes de production.</p>
<p><strong>La partie la plus difficile de ce processus est la construction des données</strong>. Pendant l'annotation, nous demandons à un LLM (Qwen3 8B) de produire non seulement les portées de mise en évidence mais aussi tout le raisonnement qui les sous-tend. Ce signal de raisonnement supplémentaire produit une supervision plus précise et plus cohérente et améliore considérablement la qualité du modèle résultant.</p>
<p>À un niveau élevé, le pipeline d'annotation fonctionne comme suit : <strong>raisonnement LLM → étiquettes de mise en évidence → filtrage → échantillon de formation final.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette conception offre trois avantages concrets dans la pratique :</p>
<ul>
<li><p><strong>Une meilleure qualité d'étiquetage</strong>: Le modèle est invité à <em>réfléchir d'abord, puis à répondre</em>. Cette étape de raisonnement intermédiaire sert d'autocontrôle intégré, réduisant la probabilité d'étiquettes superficielles ou incohérentes.</p></li>
<li><p><strong>Amélioration de l'observabilité et du débogage</strong>: Chaque étiquette étant accompagnée d'une trace de raisonnement, les erreurs deviennent visibles. Il est ainsi plus facile de diagnostiquer les cas d'échec et d'ajuster rapidement les messages-guides, les règles ou les filtres de données dans le pipeline.</p></li>
<li><p><strong>Données réutilisables</strong>: Les traces de raisonnement fournissent un contexte précieux pour le ré-étiquetage futur. Au fur et à mesure que les besoins évoluent, les mêmes données peuvent être réexaminées et affinées sans avoir à repartir de zéro.</p></li>
</ul>
<p>Grâce à ce pipeline, nous avons généré plus d'un million d'échantillons de formation bilingues, répartis à peu près équitablement entre l'anglais et le chinois.</p>
<p>Pour l'entraînement du modèle, nous sommes partis de BGE-M3 Reranker v2 (0.6B paramètres, 8,192-token context window), nous avons adopté le cadre d'entraînement Open Provence, et nous nous sommes entraînés pendant trois époques sur 8× A100 GPUs, terminant l'entraînement en approximativement cinq heures.</p>
<p>Nous approfondirons ces choix techniques - y compris la raison pour laquelle nous nous appuyons sur les traces de raisonnement, la façon dont nous avons sélectionné le modèle de base et la façon dont l'ensemble de données a été construit - dans un article ultérieur.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Analyse comparative du modèle de mise en évidence sémantique bilingue de Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour évaluer les performances dans le monde réel, nous avons évalué plusieurs modèles de mise en évidence sémantique sur un ensemble varié de données. Les benchmarks couvrent à la fois des scénarios in-domain et out-of-domain, en anglais et en chinois, afin de refléter la variété des contenus rencontrés dans les systèmes de production.</p>
<h3 id="Datasets" class="common-anchor-header">Jeux de données</h3><p>Nous avons utilisé les ensembles de données suivants pour notre évaluation :</p>
<ul>
<li><p><strong>MultiSpanQA (anglais)</strong> - un ensemble de données de réponse à des questions multi-domaines.</p></li>
<li><p><strong>WikiText-2 (anglais)</strong> - un corpus Wikipédia hors domaine</p></li>
<li><p><strong>MultiSpanQA-ZH (chinois)</strong> - un ensemble de données chinoises de réponse aux questions à portée multiple.</p></li>
<li><p><strong>WikiText-2-ZH (chinois)</strong> - un corpus Wikipédia chinois hors domaine</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modèles comparés</h3><p>Les modèles inclus dans la comparaison sont les suivants :</p>
<ul>
<li><p><strong>Modèles Open Provence</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (publié par Naver)</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong></p></li>
<li><p><strong>Le modèle de surlignage sémantique bilingue de Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Résultats et analyse</h3><p><strong>Ensembles de données en anglais :</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Jeux de données chinois :</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sur l'ensemble des benchmarks bilingues, notre modèle atteint des <strong>scores F1 moyens de pointe</strong>, surpassant tous les modèles et approches précédemment évalués. Les gains sont particulièrement prononcés sur les <strong>ensembles de données chinoises</strong>, où notre modèle surpasse de manière significative XProvence, le seul autre modèle évalué avec un support chinois.</p>
<p>Plus important encore, notre modèle offre des performances équilibrées entre l'anglais et le chinois, une propriété que les solutions existantes peinent à atteindre :</p>
<ul>
<li><p><strong>Open Provence</strong> ne prend en charge que l'anglais</p></li>
<li><p><strong>XProvence</strong> sacrifie les performances en anglais par rapport à Provence</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> ne prend pas en charge le chinois et présente une faible généralisation.</p></li>
</ul>
<p>Par conséquent, notre modèle évite les compromis habituels entre la couverture linguistique et la performance, ce qui le rend plus adapté aux déploiements bilingues dans le monde réel.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Un exemple concret dans la pratique</h3><p>Au-delà des scores de référence, il est souvent plus révélateur d'examiner un exemple concret. Le cas suivant montre comment notre modèle se comporte dans un scénario réel de mise en évidence sémantique et pourquoi la précision est importante.</p>
<p><strong>Requête :</strong> Qui a écrit le film <em>L'assassinat d'un cerf sacré</em>?</p>
<p><strong>Contexte (5 phrases) :</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> est un film de thriller psychologique de 2017 réalisé par Yorgos Lanthimos, dont le scénario a été écrit par Lanthimos et Efthymis Filippou.</p></li>
<li><p>Le film met en vedette Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone et Bill Camp.</p></li>
<li><p>L'histoire est basée sur la pièce de théâtre grecque <em>Iphigénie à Aulis</em> d'Euripide.</p></li>
<li><p>Le film raconte l'histoire d'un chirurgien cardiaque qui se lie d'une amitié secrète avec un adolescent lié à son passé.</p></li>
<li><p>Il présente le garçon à sa famille, après quoi de mystérieuses maladies commencent à se manifester.</p></li>
</ol>
<p><strong>Bonne réponse :</strong> La<strong>phrase 1</strong> est la bonne réponse, car elle indique explicitement que le scénario a été écrit par Yorgos Lanthimos et Efthymis Filippou.</p>
<p>Cet exemple contient un piège subtil. La <strong>phrase 3</strong> mentionne Euripide, l'auteur de la pièce de théâtre grecque originale dont l'histoire est librement inspirée. Cependant, la question demande qui a écrit le <em>film</em>, et non la source antique. La bonne réponse est donc les scénaristes du film, et non le dramaturge d'il y a des milliers d'années.</p>
<p><strong>Résultats :</strong></p>
<p>Le tableau ci-dessous résume les performances des différents modèles pour cet exemple.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modèle</strong></th><th style="text-align:center"><strong>Réponse correcte identifiée</strong></th><th style="text-align:center"><strong>Résultat</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Le nôtre (M3 bilingue)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">A sélectionné la phrase 1 (correcte) et la phrase 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">A sélectionné la phrase 3 uniquement, n'a pas trouvé la bonne réponse</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">A sélectionné la phrase 3 seulement, a manqué la bonne réponse</td></tr>
</tbody>
</table>
<p><strong>Comparaison des scores au niveau des phrases</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Phrase</strong></th><th><strong>Les nôtres (M3 bilingue)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Phrase 1 (scénario de film, <strong>correct</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Phrase 3 (pièce de théâtre originale, distracteur)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Les points faibles de XProvence</strong></p>
<ul>
<li><p>XProvence est fortement attiré par les mots-clés <em>"Euripide"</em> et <em>"écrit",</em> attribuant à la phrase 3 un score presque parfait (0.947 et 0.802).</p></li>
<li><p>Dans le même temps, il ignore largement la réponse correcte de la phrase 1, lui attribuant des scores extrêmement faibles (0,133 et 0,081).</p></li>
<li><p>Même après avoir abaissé le seuil de décision de 0,5 à 0,2, le modèle ne parvient toujours pas à faire apparaître la bonne réponse.</p></li>
</ul>
<p>En d'autres termes, le modèle est principalement guidé par des associations de mots clés au niveau de la surface plutôt que par l'intention réelle de la question.</p>
<p><strong>Comment notre modèle se comporte-t-il différemment ?</strong></p>
<ul>
<li><p>Notre modèle attribue un score élevé (0,915) à la réponse correcte de la phrase 1, qui identifie correctement <em>les scénaristes du film</em>.</p></li>
<li><p>Il attribue également un score modéré (0,719) à la phrase 3, qui mentionne effectivement un concept lié au scénario.</p></li>
<li><p>Il est essentiel que la séparation soit claire et significative : <strong>0,915 contre 0,719</strong>, soit un écart de près de 0,2.</p></li>
</ul>
<p>Cet exemple met en évidence la force principale de notre approche : aller au-delà des associations basées sur les mots-clés pour interpréter correctement l'intention de l'utilisateur. Même lorsque plusieurs concepts d'"auteur" apparaissent, le modèle met systématiquement en évidence celui auquel la question fait réellement référence.</p>
<p>Nous partagerons un rapport d'évaluation plus détaillé et d'autres études de cas dans un article ultérieur.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Essayez-le et dites-nous ce que vous en pensez<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons ouvert notre modèle de mise en évidence sémantique bilingue sur <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>, avec tous les poids du modèle disponibles publiquement afin que vous puissiez commencer à expérimenter dès maintenant. Nous aimerions savoir comment il fonctionne pour vous - veuillez nous faire part de vos commentaires, problèmes ou idées d'amélioration au fur et à mesure que vous l'essayez.</p>
<p>En parallèle, nous travaillons sur un service d'inférence prêt pour la production et sur l'intégration du modèle directement dans <a href="https://milvus.io/">Milvus</a> en tant qu'API de mise en évidence sémantique native. Cette intégration est déjà en cours et sera bientôt disponible.</p>
<p>La mise en évidence sémantique ouvre la voie à une expérience plus intuitive en matière de RAG et d'IA agentique. Lorsque Milvus récupère plusieurs longs documents, le système peut immédiatement faire apparaître les phrases les plus pertinentes, en indiquant clairement où se trouve la réponse. Cela n'améliore pas seulement l'expérience de l'utilisateur final, mais aide également les développeurs à déboguer les pipelines de recherche en montrant exactement les parties du contexte sur lesquelles le système s'appuie.</p>
<p>Nous pensons que la mise en évidence sémantique deviendra une fonctionnalité standard dans les systèmes de recherche et de RAG de la prochaine génération. Si vous avez des idées, des suggestions ou des cas d'utilisation pour la mise en évidence sémantique bilingue, rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> et partagez vos idées. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
