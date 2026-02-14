---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Réflexion approfondie : Quel modèle
  convient à votre pile d'agents d'IA ?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Comparaison pratique de GLM-5, MiniMax M2.5 et Gemini 3 Deep Think pour le
  codage, le raisonnement et les agents d'intelligence artificielle. Inclut un
  tutoriel RAG avec Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>En un peu plus de deux jours, trois modèles majeurs sont sortis coup sur coup : GLM-5, MiniMax M2.5 et Gemini 3 Deep Think. Les trois modèles présentent les mêmes capacités : <strong>codage, raisonnement profond et flux de travail agentique.</strong> Tous trois revendiquent des résultats à la pointe de la technologie. Si vous regardez attentivement les fiches techniques, vous pourriez presque jouer à un jeu de correspondance et éliminer les points de discussion identiques dans les trois cas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le plus effrayant ? Votre patron a probablement déjà vu les annonces et il a hâte que vous créiez neuf applications internes en utilisant les trois modèles avant même la fin de la semaine.</p>
<p>Qu'est-ce qui différencie réellement ces modèles ? Comment choisir entre eux ? Et (comme toujours) comment les relier à <a href="https://milvus.io/">Milvus</a> pour créer une base de connaissances interne ? Ajoutez cette page à vos favoris. Elle contient tout ce dont vous avez besoin.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 et Gemini 3 Deep Think en un coup d'œil<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">Le GLM-5 est à la pointe de l'ingénierie des systèmes complexes et des tâches d'agent à long terme</h3><p>Le 12 février, Zhipu a officiellement lancé le GLM-5, qui excelle dans l'ingénierie de systèmes complexes et les flux de travail d'agents à long terme.</p>
<p>Le modèle a 355B-744B paramètres (40B actifs), entraînés sur 28.5T tokens. Il intègre des mécanismes d'attention éparse avec un cadre d'apprentissage par renforcement asynchrone appelé Slime, ce qui lui permet de gérer des contextes ultra-longs sans perte de qualité tout en maintenant les coûts de déploiement à un niveau bas.</p>
<p>GLM-5 a pris la tête du peloton open-source sur les principaux benchmarks, se classant premier sur SWE-bench Verified (77,8) et premier sur Terminal Bench 2.0 (56,2) - devant MiniMax 2.5 et Gemini 3 Deep Think. Cela dit, ses scores restent inférieurs à ceux des meilleurs modèles à code source fermé tels que Claude Opus 4.5 et GPT-5.2. Dans Vending Bench 2, une évaluation de simulation d'entreprise, GLM-5 a généré 4 432 dollars de bénéfices annuels simulés, ce qui le place à peu près dans la même fourchette que les systèmes à code source fermé.</p>
<p>GLM-5 a également apporté des améliorations significatives à ses capacités d'ingénierie des systèmes et d'agent à long terme. Il peut désormais convertir du texte ou des matières premières directement en fichiers .docx, .pdf et .xlsx, et générer des produits livrables spécifiques tels que des documents sur les exigences du produit, des plans de cours, des examens, des feuilles de calcul, des rapports financiers, des organigrammes et des menus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think place la barre très haut en matière de raisonnement scientifique</h3><p>Aux premières heures du 13 février 2026, Google a officiellement lancé Gemini 3 Deep Think, une mise à jour majeure que je qualifierai (provisoirement) de modèle de recherche et de raisonnement le plus puissant de la planète. Après tout, Gemini est le seul modèle à avoir passé le test du lave-auto : "<em>Je veux laver ma voiture et la station de lavage se trouve à 50 mètres. Dois-je démarrer ma voiture et m'y rendre ou marcher</em>?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sa force principale réside dans son raisonnement de haut niveau et ses performances en compétition : il a atteint 3455 Elo sur Codeforces, ce qui équivaut au huitième meilleur programmeur de compétition au monde. Il a obtenu la médaille d'or dans les épreuves écrites des Olympiades internationales de physique, de chimie et de mathématiques de 2025. Le rapport coût-efficacité est une autre percée. ARC-AGI-1 ne coûte que 7,17 dollars par tâche, soit une réduction de 280 à 420 fois par rapport à l'étude o3-preview d'OpenAI réalisée 14 mois plus tôt. Du côté des applications, c'est dans le domaine de la recherche scientifique que Deep Think a le plus progressé. Des experts l'utilisent déjà pour l'examen par les pairs d'articles de mathématiques professionnelles et pour l'optimisation de flux de travail complexes de préparation de la croissance des cristaux.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 rivalise en termes de coût et de vitesse pour les charges de travail de production</h3><p>Le même jour, MiniMax a lancé la version M2.5, se positionnant comme le champion des coûts et de l'efficacité pour les cas d'utilisation en production.</p>
<p>En tant que l'une des familles de modèles les plus rapides de l'industrie, M2.5 établit de nouveaux résultats SOTA pour le codage, l'appel d'outils, la recherche et la productivité bureautique. Le coût est son principal argument de vente : la version rapide fonctionne à environ 100 TPS, avec un prix d'entrée de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 million</mn><mi>de</mi><mn>jetons et</mn></mrow></semantics></math></span></span>un prix de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">sortie de</annotation><mrow><mn>0</mn></mrow></semantics></math></span></span>, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">30 par million de jetons et un prix de sortie de</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 million de jetons et un prix de sortie de</span><span class="mord mathnormal">2</span></span></span></span>,40 par million de jetons. La version 50 TPS réduit encore de moitié le coût de production. La vitesse s'est améliorée de 37 % par rapport à la version précédente M2.1, et elle accomplit les tâches vérifiées par le banc d'essai SWE en 22,8 minutes en moyenne, ce qui correspond à peu près à l'Opus 4.6 de Claude. En ce qui concerne les capacités, M2.5 prend en charge le développement complet dans plus de 10 langages, y compris Go, Rust et Kotlin, couvrant tout, de la conception de systèmes zéro à un à l'examen complet du code. Pour les flux de travail de bureau, sa fonction Office Skills s'intègre profondément avec Word, PPT et Excel. Associée à des connaissances dans les domaines de la finance et du droit, elle peut générer des rapports de recherche et des modèles financiers prêts à être utilisés directement.</p>
<p>Voilà pour l'aperçu général. Voyons maintenant comment ils se comportent lors de tests pratiques.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Comparaisons pratiques<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Rendu de scènes 3D : Gemini 3 Deep Think produit les résultats les plus réalistes</h3><p>Nous avons pris une invite que les utilisateurs avaient déjà testée sur Gemini 3 Deep Think et l'avons exécutée sur GLM-5 et MiniMax M2.5 pour une comparaison directe. L'invite : construire une scène Three.js complète dans un seul fichier HTML qui rend une pièce intérieure entièrement en 3D impossible à distinguer d'une peinture à l'huile classique dans un musée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Réflexion approfondie sur Gemini 3</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> a fourni le meilleur résultat. Il a interprété avec précision le message et généré une scène 3D de haute qualité. L'éclairage s'est distingué : la direction et la chute des ombres étaient naturelles, traduisant clairement la relation spatiale de la lumière naturelle passant par une fenêtre. Les détails fins étaient également impressionnants, notamment la texture à moitié fondue des bougies et la qualité du matériau des sceaux de cire rouge. La fidélité visuelle globale était élevée.</p>
<p><strong>GLM-5</strong> a produit une modélisation d'objets et un travail de texture détaillés, mais son système d'éclairage présentait des problèmes notables. Les ombres des tables se présentaient sous la forme de blocs durs d'un noir pur, sans transitions douces. Le sceau de cire semblait flotter au-dessus de la surface de la table, ce qui ne permettait pas de gérer correctement la relation de contact entre les objets et le plateau de la table. Ces artefacts montrent qu'il est possible d'améliorer l'éclairage global et le raisonnement spatial.</p>
<p><strong>MiniMax M2.5</strong> n'a pas pu analyser efficacement la description complexe de la scène. Le résultat n'était qu'un mouvement désordonné de particules, ce qui indique des limitations significatives à la fois dans la compréhension et la génération lorsqu'il s'agit de traiter des instructions sémantiques multicouches avec des exigences visuelles précises.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Génération SVG : les trois modèles la gèrent différemment</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Invitation :</strong> Générer un SVG d'un pélican brun de Californie à bicyclette. La bicyclette doit avoir des rayons et un cadre de forme correcte. Le pélican doit avoir sa grande poche caractéristique et les plumes doivent être clairement visibles. Le pélican doit clairement pédaler sur la bicyclette. L'image doit montrer le plumage de reproduction complet du pélican brun de Californie.</p>
<p><strong>Gemini 3 Réflexion profonde</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemini 3 Deep Think</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p>Gemini<strong>3 Deep Think</strong> a produit le SVG le plus complet. La posture du pélican est précise : son centre de gravité repose naturellement sur le siège et ses pieds sont posés sur les pédales, dans une position dynamique de cycliste. La texture des plumes est détaillée et stratifiée. Le seul point faible est que la poche de gorge caractéristique du pélican est dessinée trop grande, ce qui perturbe légèrement les proportions générales.</p>
<p><strong>GLM-5</strong> avait des problèmes de posture notables. Les pieds sont correctement placés sur les pédales, mais la position assise générale s'éloigne d'une posture de pilotage naturelle, et la relation entre le corps et le siège ne semble pas correcte. Cela dit, le travail de détail est solide : la poche de gorge est bien proportionnée et la qualité de la texture des plumes est respectable.</p>
<p><strong>MiniMax M2.5</strong> a opté pour un style minimaliste et n'a pas utilisé d'éléments d'arrière-plan. La position du pélican sur le vélo est à peu près correcte, mais le travail de détail laisse à désirer. Le guidon n'a pas la bonne forme, la texture de la plume est presque inexistante, le cou est trop épais et il y a des artefacts ovales blancs dans l'image qui ne devraient pas s'y trouver.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Comment choisir entre GLM-5, MiniMax M2.5 et Gemin 3 Deep Think ?<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Sur l'ensemble de nos tests, MiniMax M2.5 a été le plus lent à générer des résultats, nécessitant le plus long temps de réflexion et de raisonnement. Les performances de GLM-5 ont été constantes et sa vitesse était à peu près équivalente à celle de Gemini 3 Deep Think.</p>
<p>Voici un guide de sélection rapide que nous avons élaboré :</p>
<table>
<thead>
<tr><th>Cas d'utilisation principal</th><th>Modèle recommandé</th><th>Points forts</th></tr>
</thead>
<tbody>
<tr><td>Recherche scientifique, raisonnement avancé (physique, chimie, mathématiques, conception d'algorithmes complexes)</td><td>Gemini 3 Réflexion approfondie</td><td>Médaille d'or dans les concours universitaires. Vérification de données scientifiques de premier ordre. Programmation compétitive de classe mondiale sur Codeforces. Applications de recherche éprouvées, y compris l'identification de failles logiques dans des articles professionnels. (Actuellement limité aux abonnés de Google AI Ultra et à certains utilisateurs professionnels ; le coût par tâche est relativement élevé).</td></tr>
<tr><td>Déploiement de logiciels libres, personnalisation de l'intranet de l'entreprise, développement complet, intégration des compétences bureautiques.</td><td>Zhipu GLM-5</td><td>Modèle à code source ouvert de premier ordre. Fortes capacités d'ingénierie au niveau du système. Permet un déploiement local à des coûts gérables.</td></tr>
<tr><td>Charges de travail sensibles aux coûts, programmation multilingue, développement multiplateforme (Web/Android/iOS/Windows), compatibilité bureautique.</td><td>MiniMax M2.5</td><td>À 100 TPS : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 par million</mn><mi>de</mi><mn>jetons</mn></mrow> d'</semantics></math></span></span>entrée <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">0,30 par million de jetons d'entrée,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30</span><span class="mord">par million de jetons d'entrée</span><span class="mpunct">,</span></span></span></span>2,40 par million de jetons de sortie. SOTA dans les domaines de la bureautique, du codage et de l'appel d'outils. Classé premier sur le Multi-SWE-Bench. Forte généralisation. Les taux de réussite sur Droid/OpenCode dépassent Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Tutoriel RAG : Câbler GLM-5 avec Milvus pour une base de connaissances<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>GLM-5 et MiniMax M2.5 sont disponibles sur <a href="https://openrouter.ai/">OpenRouter</a>. Inscrivez-vous et créez un <code translate="no">OPENROUTER_API_KEY</code> pour commencer.</p>
<p>Ce tutoriel utilise le GLM-5 de Zhipu comme LLM d'exemple. Pour utiliser MiniMax à la place, remplacez simplement le nom du modèle par <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Dépendances et configuration de l'environnement</h3><p>Installez ou mettez à jour pymilvus, openai, requests, et tqdm vers leurs dernières versions :</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Ce tutoriel utilise GLM-5 comme LLM et text-embedding-3-small d'OpenAI comme modèle d'intégration.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Préparation des données</h3><p>Nous utiliserons les pages FAQ de la documentation Milvus 2.4.x comme base de connaissances privée.</p>
<p>Téléchargez le fichier zip et extrayez les documents dans un dossier <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Chargez tous les fichiers Markdown à partir de <code translate="no">milvus_docs/en/faq</code>. Nous avons divisé chaque fichier sur <code translate="no">&quot;# &quot;</code> pour séparer grossièrement le contenu par grandes sections :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">Configuration du LLM et du modèle d'intégration</h3><p>Nous utiliserons GLM-5 comme LLM et text-embedding-3-small comme modèle d'intégration :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Générer un embedding de test et imprimer ses dimensions et ses premiers éléments :</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Charger les données dans Milvus</h3><p><strong>Créer une collection :</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Note sur la configuration de MilvusClient :</p>
<ul>
<li><p>La définition de l'URI d'un fichier local (par exemple, <code translate="no">./milvus.db</code>) est l'option la plus simple. Elle utilise automatiquement Milvus Lite pour stocker toutes les données dans ce fichier.</p></li>
<li><p>Pour les données à grande échelle, vous pouvez déployer un serveur Milvus plus performant sur Docker ou Kubernetes. Dans ce cas, utilisez l'URI du serveur (par exemple, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Pour utiliser Zilliz Cloud (la version cloud entièrement gérée de Milvus), définissez l'URI et le jeton sur le point de terminaison public et la clé API à partir de votre console Zilliz Cloud.</p></li>
</ul>
<p>Vérifiez si la collection existe déjà et supprimez-la si c'est le cas :</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Créez une nouvelle collection avec les paramètres spécifiés. Si vous ne fournissez pas de définitions de champ, Milvus crée automatiquement un champ <code translate="no">id</code> par défaut comme clé primaire et un champ <code translate="no">vector</code> pour les données vectorielles. Un champ JSON réservé stocke tous les champs et valeurs non définis dans le schéma :</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Insérer les données</h3><p>Interroger les lignes de texte, générer des embeddings et insérer les données dans Milvus. Le champ <code translate="no">text</code> n'est pas défini dans le schéma. Il est automatiquement ajouté en tant que champ dynamique soutenu par le champ JSON réservé de Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output :</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Construire le pipeline RAG</h3><p><strong>Récupérer les documents pertinents :</strong></p>
<p>Posons une question courante sur Milvus :</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Rechercher dans la collection les 3 résultats les plus pertinents :</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Les résultats sont triés par distance, le plus proche en premier :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Générer une réponse avec le LLM :</strong></p>
<p>Combinez les documents récupérés dans une chaîne de contexte :</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Configurer le système et les messages-guides de l'utilisateur. L'invite de l'utilisateur est construite à partir des documents extraits de Milvus :</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Appeler GLM-5 pour générer la réponse finale :</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 renvoie une réponse bien structurée :</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Conclusion : Choisir le modèle, puis construire le pipeline<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Les trois modèles sont performants, mais ils le sont dans des domaines différents. Gemini 3 Deep Think est le modèle à choisir lorsque la profondeur du raisonnement est plus importante que le coût. GLM-5 est la meilleure option open-source pour les équipes qui ont besoin d'un déploiement local et d'une ingénierie au niveau du système. MiniMax M2.5 est un choix judicieux pour optimiser le débit et le budget des charges de travail de production.</p>
<p>Le modèle que vous choisissez ne représente que la moitié de l'équation. Pour transformer l'un de ces modèles en une application utile, vous avez besoin d'une couche d'extraction capable d'évoluer avec vos données. C'est là que Milvus intervient. Le tutoriel RAG ci-dessus fonctionne avec n'importe quel modèle compatible avec OpenAI, de sorte que le passage de GLM-5 à MiniMax M2.5 ou à toute autre version future ne nécessite qu'un seul changement de ligne.</p>
<p>Si vous concevez des agents d'IA locaux ou sur site et que vous souhaitez discuter plus en détail de l'architecture de stockage, de la conception des sessions ou du rollback sécurisé, n'hésitez pas à rejoindre notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a>. Vous pouvez également réserver un entretien individuel de 20 minutes dans le cadre des <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> pour obtenir des conseils personnalisés.</p>
<p>Si vous souhaitez approfondir la construction d'agents d'IA, voici d'autres ressources pour vous aider à démarrer.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Comment construire des systèmes multi-agents prêts pour la production avec Agno et Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Choisir le bon modèle d'intégration pour votre pipeline RAG</a></p></li>
<li><p><a href="https://zilliz.com/learn">Comment construire un agent d'IA avec Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Guide complet de l'agent d'intelligence artificielle open-source</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutoriel OpenClaw : Se connecter à Slack pour un assistant IA local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construire des agents d'IA de type Clawdbot avec LangGraph et Milvus</a></p></li>
</ul>
